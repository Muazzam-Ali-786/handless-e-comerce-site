"use client";

import { useCartStore } from "@/store/cart-store";
import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";

export function CartIcon() {
  const { cart, setIsOpen } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const quantity = cart?.totalQuantity || 0;

  return (
    <button
      data-cart-icon
      onClick={() => setIsOpen(true)}
      className="relative flex items-center justify-center p-2 rounded-full hover:bg-accent transition-colors"
      aria-label="Open cart"
    >
      <ShoppingBag className="w-5 h-5" />
      {mounted && quantity > 0 && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-primary-foreground bg-primary rounded-full transform translate-x-1/4 -translate-y-1/4">
          {quantity}
        </span>
      )}
    </button>
  );
}
