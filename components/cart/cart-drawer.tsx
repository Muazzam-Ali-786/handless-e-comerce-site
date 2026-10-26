"use client";

import { useCartStore } from "@/store/cart-store";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useEffect } from "react";
import Image from "next/image";

export function CartDrawer() {
  const { cart, isOpen, setIsOpen, initializeCart, updateItemQuantity, removeItem, isLoading } = useCartStore();

  useEffect(() => {
    initializeCart();
  }, [initializeCart]);

  // Filter out any phantom zero-quantity lines (e.g. an out-of-stock add that
  // Shopify refused to stock) so they never silently show in the bag.
  const items = (cart?.lines?.edges?.map((e) => e.node) || []).filter((item) => item.quantity > 0);
  const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
          />
          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="text-lg font-semibold">
                Shopping bag ({totalQuantity})
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Bar */}
            <div className="px-6 py-4 border-b border-gray-100">
              <p className="text-sm font-medium mb-2">$210 away from free shipping</p>
              <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-black w-1/3 rounded-full" />
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-20">
                  <p className="text-gray-500">Your bag is empty.</p>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-6 py-3 border border-black rounded-full text-sm font-medium hover:bg-black hover:text-white transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-6 border-b border-gray-100 last:border-0">
                    <div className="w-20 h-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 relative">
                      {item.merchandise.product.featuredImage && (
                        <Image
                          src={item.merchandise.product.featuredImage.url}
                          alt={item.merchandise.product.featuredImage.altText || item.merchandise.product.title}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between gap-2">
                        <div>
                          <h3 className="text-sm font-semibold uppercase leading-tight">
                            {item.merchandise.product.title}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {item.merchandise.title !== "Default Title" ? item.merchandise.title : ""}
                          </p>
                        </div>
                        <p className="text-sm font-medium flex-shrink-0">
                          {formatCurrency(item.cost.totalAmount.amount, item.cost.totalAmount.currencyCode)}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-gray-300 rounded-full">
                          <button
                            disabled={isLoading}
                            onClick={() => updateItemQuantity(item.id, item.merchandise.id, item.quantity - 1)}
                            className="px-3 py-1 hover:text-gray-500 disabled:opacity-50 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                          <button
                            disabled={isLoading}
                            onClick={() => updateItemQuantity(item.id, item.merchandise.id, item.quantity + 1)}
                            className="px-3 py-1 hover:text-gray-500 disabled:opacity-50 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          disabled={isLoading}
                          onClick={() => removeItem(item.id)}
                          className="text-xs text-gray-500 underline hover:text-black disabled:opacity-50 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-6 border-t border-gray-100">
                <div className="mb-4">
                  <button className="text-sm font-medium underline underline-offset-4 text-gray-700 hover:text-black transition-colors">
                    Add promo code +
                  </button>
                </div>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <p className="text-xs text-gray-500">Shipping calculated at checkout</p>
                    <p className="text-sm font-semibold">Estimated total</p>
                  </div>
                  <p className="text-lg font-semibold">
                    {formatCurrency(cart!.cost.subtotalAmount.amount, cart!.cost.subtotalAmount.currencyCode)}
                  </p>
                </div>
                <button
                  disabled={isLoading}
                  onClick={() => window.location.href = cart!.checkoutUrl}
                  className="w-full bg-black text-white rounded-full py-4 font-semibold text-sm hover:bg-gray-800 transition-colors disabled:opacity-60"
                >
                  Checkout →
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

