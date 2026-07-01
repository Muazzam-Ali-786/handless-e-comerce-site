"use client";

import { X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface SearchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchDrawer({ isOpen, onClose }: SearchDrawerProps) {
  const [query, setQuery] = useState("");

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Dummy search results for preview
  const dummyResults = [
    { id: "1", title: "Double-Breasted Wool Trench Coat", handle: "double-breasted-wool-trench-coat", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=200&auto=format&fit=crop", price: "$380.00" },
    { id: "2", title: "Oversized Shearling Coat", handle: "oversized-shearling-coat", image: "https://images.unsplash.com/photo-1544923246-77307dd654cb?q=80&w=200&auto=format&fit=crop", price: "$520.00" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[70] flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-black">Search</h2>
              <button onClick={onClose} className="p-2 -mr-2 text-gray-500 hover:text-black transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products, collections..."
                  className="w-full border-b-2 border-black py-4 pl-10 pr-4 text-sm focus:outline-none placeholder:text-gray-400 bg-transparent"
                  autoFocus
                />
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {query.length > 2 ? (
                <div className="space-y-6">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Results</h3>
                  <div className="space-y-4">
                    {dummyResults.map((product) => (
                      <Link 
                        key={product.id} 
                        href={`/products/${product.handle}`}
                        onClick={onClose}
                        className="flex gap-4 items-center group"
                      >
                        <div className="relative w-16 h-20 bg-gray-100 overflow-hidden flex-shrink-0">
                          <Image
                            src={product.image}
                            alt={product.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium uppercase tracking-wide group-hover:text-gray-600 transition-colors">{product.title}</p>
                          <p className="text-sm text-gray-500 mt-1">{product.price}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Popular Searches</h3>
                  <div className="flex flex-wrap gap-3">
                    {["Trench Coats", "Knitwear", "Accessories", "New Arrivals"].map((term) => (
                      <button 
                        key={term}
                        onClick={() => setQuery(term)}
                        className="px-4 py-2 border border-gray-200 text-xs font-medium uppercase tracking-wider hover:border-black transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
