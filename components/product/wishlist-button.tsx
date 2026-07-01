"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";

export function WishlistButton({ productId }: { productId?: string }) {
  const [inWishlist, setInWishlist] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (productId) {
      const saved = localStorage.getItem(`wishlist-${productId}`);
      if (saved) {
        setInWishlist(true);
      }
    }
  }, [productId]);

  const toggleWishlist = () => {
    if (!productId) return;
    if (inWishlist) {
      localStorage.removeItem(`wishlist-${productId}`);
      setInWishlist(false);
    } else {
      localStorage.setItem(`wishlist-${productId}`, "true");
      setInWishlist(true);
    }
  };

  if (!mounted) return null;

  return (
    <button 
      onClick={toggleWishlist}
      className={`w-full border border-black py-4 rounded-full font-semibold text-sm transition-colors flex items-center justify-center gap-2 ${
        inWishlist ? "bg-black text-white" : "bg-transparent text-black hover:bg-gray-50"
      }`}
    >
      {inWishlist ? "Remove from wishlist" : "Add to wishlist"} 
      <Heart className={`w-4 h-4 ${inWishlist ? "fill-white" : ""}`} />
    </button>
  );
}
