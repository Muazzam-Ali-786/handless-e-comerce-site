"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/shopify";
import { formatCurrency } from "@/lib/utils";
import { Heart, ShoppingBag } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { fadeUpVariant } from "@/lib/animations";
import { useState } from "react";
import { QuickViewModal } from "./quick-view-modal";

export function ProductCard({ product }: { product: Product }) {
  const minPrice = product.priceRange.minVariantPrice;
  const currencyCode = minPrice.currencyCode;
  const [isHovered, setIsHovered] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const reduce = useReducedMotion();

  // Get second image if available for hover swap
  const secondImage = product.images?.edges?.[1]?.node;

  // Highest real compare-at price across variants (the original/strikethrough price).
  let compareAtAmount = 0;
  let maxDiscount = 0;
  product.variants?.edges?.forEach(({ node }) => {
    if (node.compareAtPrice && parseFloat(node.compareAtPrice.amount) > parseFloat(node.price.amount)) {
      const compare = parseFloat(node.compareAtPrice.amount);
      if (compare > compareAtAmount) compareAtAmount = compare;
      const discount = Math.round(((compare - parseFloat(node.price.amount)) / compare) * 100);
      if (discount > maxDiscount) maxDiscount = discount;
    }
  });

  // Extract color options
  const colorOption = product.options?.find(
    (opt) => opt.name.toLowerCase() === "color" || opt.name.toLowerCase() === "colour"
  );

  return (
    <>
      <motion.div
        variants={fadeUpVariant}
        whileHover={reduce ? undefined : { y: -6 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="group flex flex-col"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-[3/4] w-full bg-gray-100 overflow-hidden mb-4 rounded-none">
          {product.featuredImage ? (
            <>
              <Image
                src={product.featuredImage.url}
                alt={product.featuredImage.altText || product.title}
                fill
                className={`object-cover object-center transition-opacity duration-500 ease-in-out ${isHovered && secondImage ? 'opacity-0' : 'opacity-100'}`}
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              />
              {secondImage && (
                <Image
                  src={secondImage.url}
                  alt={secondImage.altText || product.title}
                  fill
                  className={`object-cover object-center transition-all duration-700 ease-in-out ${isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}`}
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                />
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400 text-sm">
              No image
            </div>
          )}

          {/* Badges Container */}
          <div className="absolute top-0 right-0 flex flex-col gap-1">
            {maxDiscount > 0 && (
              <div className="bg-black text-white text-[11px] px-2 py-1 font-semibold tracking-wider">
                {maxDiscount}% OFF
              </div>
            )}
          </div>

          {!product.availableForSale && (
            <div className="absolute top-3 left-3 bg-black text-white text-[10px] uppercase tracking-wider font-semibold px-3 py-1">
              Sold Out
            </div>
          )}

          <button
            aria-label="Wishlist"
            className="absolute top-3 left-3 p-2 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-white"
          >
            <Heart className="w-4 h-4 text-gray-700" />
          </button>

          <div className="absolute bottom-4 left-0 right-0 px-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <button
              onClick={() => setQuickViewOpen(true)}
              className="w-full flex items-center justify-center gap-2 bg-white/95 backdrop-blur-md text-black py-3 rounded-none text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors shadow-sm"
            >
              <ShoppingBag className="w-4 h-4" /> Quick View
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center text-center mb-3 space-y-1">
          <Link
            href={`/products/${product.handle}`}
            className="text-[11px] font-semibold uppercase tracking-widest text-gray-900 hover:text-gray-500 transition-colors"
          >
            {product.title}
          </Link>
          <div className="flex items-center gap-2 mt-1">
            {compareAtAmount > 0 && (
              <span className="text-xs text-gray-400 line-through">
                {formatCurrency(compareAtAmount, currencyCode)}
              </span>
            )}
            <span className="text-sm font-medium text-black">
              {formatCurrency(minPrice.amount, currencyCode)}
            </span>
          </div>

          {/* Color Swatches */}
          {colorOption && colorOption.values.length > 0 && (
            <div className="flex justify-center gap-1.5 mt-3">
              {colorOption.values.slice(0, 4).map((color, idx) => {
                // Basic color mapping for swatch backgrounds
                const colorMap: Record<string, string> = {
                  black: "#000000", white: "#ffffff", navy: "#000080", grey: "#808080", gray: "#808080",
                  red: "#ff0000", blue: "#0000ff", green: "#008000", yellow: "#ffff00", brown: "#a52a2a",
                  pink: "#ffc0cb", purple: "#800080", orange: "#ffa500", beige: "#f5f5dc", cream: "#fffdd0"
                };
                const hex = colorMap[color.toLowerCase()] || "#cccccc";
                return (
                  <div
                    key={idx}
                    title={color}
                    className="w-3.5 h-3.5 rounded-full border border-gray-300 shadow-sm cursor-pointer hover:scale-110 transition-transform"
                    style={{ backgroundColor: hex }}
                  />
                );
              })}
              {colorOption.values.length > 4 && (
                <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center bg-gray-100 text-[8px] text-gray-500">
                  +
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>

      <QuickViewModal
        product={product}
        open={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
      />
    </>
  );
}
