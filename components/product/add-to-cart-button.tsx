"use client";

import { useRef } from "react";
import { useCartStore } from "@/store/cart-store";
import { Product, ProductVariant } from "@/types/shopify";
import { Button } from "@/components/ui/button";
import { rectOf } from "@/store/cart-ui-store";

export function AddToCartButton({
  variant,
  availableForSale,
  product,
}: {
  variant: ProductVariant | undefined;
  availableForSale: boolean;
  product?: Product;
}) {
  const { addItem, isLoading } = useCartStore();
  const btnRef = useRef<HTMLButtonElement>(null);

  if (!availableForSale) {
    return (
      <Button variant="outline" size="lg" className="w-full" disabled>
        Out of Stock
      </Button>
    );
  }

  if (!variant) {
    return (
      <Button variant="default" size="lg" className="w-full opacity-50 cursor-not-allowed">
        Select Options
      </Button>
    );
  }

  const handleAdd = () => {
    const context = product
      ? {
          productId: product.id,
          productHandle: product.handle,
          productTitle: product.title,
          variantTitle: variant.title,
          price: variant.price,
          featuredImage: product.featuredImage || { url: "", altText: "", width: 0, height: 0 },
          selectedOptions: variant.selectedOptions,
          origin: rectOf(btnRef.current),
        }
      : undefined;

    addItem(variant.id, 1, context);
  };

  return (
    <Button
      ref={btnRef}
      variant="default"
      size="lg"
      className="w-full"
      disabled={isLoading}
      onClick={handleAdd}
    >
      {isLoading ? "Adding..." : "Add to Cart"}
    </Button>
  );
}
