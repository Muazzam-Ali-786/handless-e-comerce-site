"use client";

import { useCartStore } from "@/store/cart-store";
import { ProductVariant } from "@/types/shopify";
import { Button } from "@/components/ui/button";

export function AddToCartButton({
  variant,
  availableForSale,
}: {
  variant: ProductVariant | undefined;
  availableForSale: boolean;
}) {
  const { addItem, isLoading } = useCartStore();

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

  return (
    <Button
      variant="default"
      size="lg"
      className="w-full"
      disabled={isLoading}
      onClick={() => {
        addItem(variant.id, 1);
      }}
    >
      {isLoading ? "Adding..." : "Add to Cart"}
    </Button>
  );
}
