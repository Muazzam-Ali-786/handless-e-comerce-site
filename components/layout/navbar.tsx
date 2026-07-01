"use client";

import Link from "next/link";
import { Search, User, Menu, X } from "lucide-react";
import { CartIcon } from "./cart-icon";
import { Marquee } from "../ui/marquee";
import { SearchDrawer } from "./search-drawer";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/collections/all", label: "Shop All" },
    { href: "/collections/outerwear", label: "Outerwear" },
    { href: "/collections/knitwear", label: "Knitwear" },
    { href: "/collections/accessories", label: "Accessories" },
    { href: "/stores", label: "Stores" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex flex-col">
        <Marquee text="✦ FREE SHIPPING WORLDWIDE ON ORDERS OVER $500 ✦ NEW SUMMER COLLECTION 2026 ✦" />
        <div className="bg-white/90 backdrop-blur-md border-b border-gray-100 transition-colors duration-300 hover:bg-white">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            {/* Mobile: Hamburger */}
            <button
              className="md:hidden text-gray-700 hover:text-black transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Logo */}
            <Link href="/" className="text-2xl font-bold tracking-widest uppercase text-black">
              Maison
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Icons */}
            <div className="flex items-center gap-5">
              <button
                aria-label="Search"
                onClick={() => setIsSearchOpen(true)}
                className="text-gray-700 hover:text-black transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
              <Link href="/account" aria-label="Account" className="text-gray-700 hover:text-black transition-colors">
                <User className="w-5 h-5" />
              </Link>
              <CartIcon />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Slide Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3, ease: "easeOut" as const }}
              className="fixed top-0 left-0 h-full w-72 bg-white z-[70] flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <span className="text-xl font-bold tracking-widest uppercase">Maison</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 -mr-2 text-gray-500 hover:text-black">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex flex-col p-6 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-lg font-light uppercase tracking-widest text-gray-700 hover:text-black py-3 border-b border-gray-100 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto p-6 space-y-4 border-t border-gray-100">
                <Link href="/account/login" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm text-gray-500 hover:text-black transition-colors">Sign In / Register</Link>
                <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm text-gray-500 hover:text-black transition-colors">Contact Us</Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <SearchDrawer isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}

