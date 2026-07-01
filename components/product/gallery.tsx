"use client";

import Image from "next/image";
import { useState } from "react";
import { Image as ShopifyImage } from "@/types/shopify";
import { cn } from "@/lib/utils";

export function Gallery({ images }: { images: ShopifyImage[] }) {
  const [activeImage, setActiveImage] = useState(images[0]);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-[4/5] bg-muted rounded-xl flex items-center justify-center text-muted-foreground">
        No image available
      </div>
    );
  }

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto no-scrollbar pb-2 md:pb-0 md:w-20 lg:w-24 flex-shrink-0">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setActiveImage(image)}
              onMouseEnter={() => setActiveImage(image)}
              className={cn(
                "relative w-20 h-24 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all",
                activeImage.url === image.url ? "border-primary" : "border-transparent hover:border-muted-foreground"
              )}
            >
              <Image
                src={image.url}
                alt={image.altText || `Thumbnail ${index}`}
                fill
                className="object-cover"
                sizes="100px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image */}
      <div className="relative aspect-[4/5] w-full bg-muted rounded-xl overflow-hidden">
        <Image
          src={activeImage.url}
          alt={activeImage.altText || "Product Image"}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 50vw, 100vw"
          priority
        />
      </div>
    </div>
  );
}
