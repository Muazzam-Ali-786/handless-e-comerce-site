"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { X, Minus, Plus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Product } from "@/types/shopify";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { rectOf } from "@/store/cart-ui-store";
import { VariantSelector } from "./variant-selector";

export function QuickViewModal({
  product,
  open,
  onClose,
}: {
  product: Product;
  open: boolean;
  onClose: () => void;
}) {
  const { addItem, isLoading } = useCartStore();
  const imageRef = useRef<HTMLDivElement>(null);

  const variants = useMemo(
    () => product.variants?.edges?.map((e) => e.node) ?? [],
    [product]
  );

  // Local (controlled) option selection, seeded from the first variant.
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (open) {
      const first = variants[0];
      const seed: Record<string, string> = {};
      first?.selectedOptions?.forEach((o) => {
        seed[o.name.toLowerCase()] = o.value;
      });
      setSelected(seed);
      setQuantity(1);
    }
  }, [open, variants]);

  // Close on Escape + lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  const selectedVariant = useMemo(() => {
    return (
      variants.find((v) =>
        v.selectedOptions.every(
          (o) => selected[o.name.toLowerCase()] === o.value
        )
      ) || variants[0]
    );
  }, [variants, selected]);

  const image = product.featuredImage;
  const price = selectedVariant?.price || product.priceRange.minVariantPrice;
  const compareAt =
    selectedVariant?.compareAtPrice &&
    parseFloat(selectedVariant.compareAtPrice.amount) > parseFloat(price.amount)
      ? selectedVariant.compareAtPrice
      : null;

  const handleAdd = () => {
    if (!selectedVariant) return;
    addItem(selectedVariant.id, quantity, {
      productId: product.id,
      productHandle: product.handle,
      productTitle: product.title,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      featuredImage: product.featuredImage || { url: "", altText: "", width: 0, height: 0 },
      selectedOptions: selectedVariant.selectedOptions,
      origin: rectOf(imageRef.current),
    });
    onClose();
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[120] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="relative z-10 w-full max-w-3xl bg-[#faf9f6] text-black shadow-2xl grid grid-cols-1 md:grid-cols-2 max-h-[90vh] overflow-hidden"
          >
            {/* Image */}
            <div ref={imageRef} className="relative aspect-[3/4] bg-gray-100 hidden md:block">
              {image ? (
                <Image
                  src={image.url}
                  alt={image.altText || product.title}
                  fill
                  className="object-cover"
                  sizes="400px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                  No image
                </div>
              )}
            </div>

            {/* Details */}
            <div className="p-8 flex flex-col overflow-y-auto">
              <button
                aria-label="Close"
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-gray-500 hover:text-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <Link
                href={`/products/${product.handle}`}
                className="text-lg font-semibold uppercase tracking-widest hover:text-gray-500 transition-colors pr-8"
              >
                {product.title}
              </Link>

              <div className="flex items-center gap-3 mt-3">
                {compareAt && (
                  <span className="text-sm text-gray-400 line-through">
                    {formatCurrency(compareAt.amount, compareAt.currencyCode)}
                  </span>
                )}
                <span className="text-base font-medium">
                  {formatCurrency(price.amount, price.currencyCode)}
                </span>
              </div>

              {product.description && (
                <p className="text-sm text-gray-600 leading-relaxed mt-5 line-clamp-4">
                  {product.description}
                </p>
              )}

              <div className="mt-6">
                <VariantSelector
                  options={product.options}
                  variants={variants}
                  selected={selected}
                  onSelectOption={(name, value) =>
                    setSelected((prev) => ({ ...prev, [name]: value }))
                  }
                />
              </div>

              {/* Quantity */}
              <div className="mt-6">
                <h3 className="font-medium text-sm uppercase tracking-wider mb-2">Quantity</h3>
                <div className="flex items-center border border-gray-300 w-fit">
                  <button
                    aria-label="Decrease quantity"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-3 hover:bg-gray-100 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center text-sm font-medium">{quantity}</span>
                  <button
                    aria-label="Increase quantity"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-3 hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mt-auto pt-8">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleAdd}
                  disabled={isLoading || !selectedVariant?.availableForSale}
                  className="w-full bg-black text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-[#27272a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {!selectedVariant?.availableForSale
                    ? "Out of Stock"
                    : isLoading
                    ? "Adding..."
                    : "Add to Cart"}
                </motion.button>
                <Link
                  href={`/products/${product.handle}`}
                  className="block text-center text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 hover:text-black transition-colors mt-4"
                >
                  View full details
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
