"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type AccordionItem = {
  title: string;
  icon: string;
  content: React.ReactNode;
};

export function ProductAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const items: AccordionItem[] = [
    {
      title: "Free Shipping*",
      icon: "📦",
      content: "We offer free standard shipping on all orders over $200. Orders are typically processed within 1-2 business days. Delivery times vary based on your location but usually take 3-5 business days.",
    },
    {
      title: "Materials & Care",
      icon: "🏷️",
      content: "Crafted from premium materials. Dry clean only. Do not bleach. Iron on low heat if necessary. Store in a cool, dry place.",
    },
    {
      title: "Shipping & Returns",
      icon: "↩️",
      content: "We accept returns within 30 days of delivery. Items must be unworn, unwashed, and in original condition with all tags attached. A return shipping fee of $10 will be deducted from your refund.",
    },
  ];

  return (
    <div className="border-t border-gray-200 divide-y divide-gray-200">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={index} className="py-4 cursor-pointer group" onClick={() => setOpenIndex(isOpen ? null : index)}>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium group-hover:text-gray-600 flex items-center gap-3">
                <span>{item.icon}</span> {item.title}
              </span>
              {isOpen ? (
                <ChevronUp className="w-4 h-4 text-gray-400 group-hover:text-black" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-black" />
              )}
            </div>
            
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 text-sm text-gray-600 leading-relaxed">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
