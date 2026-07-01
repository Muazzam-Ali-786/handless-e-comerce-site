"use client";

import { useState } from "react";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";

export function FbtWidget({
  mainProduct,
  mainVariant,
  relatedProduct,
}: {
  mainProduct: any;
  mainVariant: any;
  relatedProduct: any;
}) {
  const { addItem, isLoading } = useCartStore();
  const [selectMain, setSelectMain] = useState(true);
  const [selectRelated, setSelectRelated] = useState(true);

  if (!relatedProduct || !mainVariant) return null;

  const relatedVariant = relatedProduct.variants?.edges?.[0]?.node;
  const mainPrice = selectMain ? parseFloat(mainVariant.price.amount) : 0;
  const relatedPrice = selectRelated && relatedVariant ? parseFloat(relatedVariant.price.amount) : 0;
  const total = mainPrice + relatedPrice;
  const currencyCode = mainVariant.price.currencyCode || "USD";

  const handleAddSelected = async () => {
    if (selectMain && mainVariant?.id) {
      addItem(mainVariant.id, 1);
    }
    if (selectRelated && relatedVariant?.id) {
      // Small timeout to prevent immediate parallel store updates from clashing
      setTimeout(() => {
        addItem(relatedVariant.id, 1);
      }, 500);
    }
  };

  const isAnythingSelected = selectMain || selectRelated;

  return (
    <div className="mb-12 border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-light uppercase tracking-wider mb-6">Frequently bought together</h3>
      <div className="space-y-4">
        {/* Current Product */}
        <div className="flex gap-4 items-center">
          <input 
            type="checkbox" 
            checked={selectMain}
            onChange={(e) => setSelectMain(e.target.checked)}
            className="w-4 h-4 accent-black bg-transparent border-gray-300 rounded-sm cursor-pointer" 
          />
          {mainVariant?.image?.url ? (
            <div className="w-16 h-20 relative bg-gray-100 flex-shrink-0">
              <Image src={mainVariant.image.url} alt={mainProduct.title} fill className="object-cover" />
            </div>
          ) : (
            <div className="w-16 h-20 bg-gray-100 flex-shrink-0" />
          )}
          <div className="flex-1">
            <p className={`text-xs font-semibold uppercase tracking-widest ${!selectMain && 'opacity-50'}`}>
              {mainProduct.title}
            </p>
            <p className={`text-xs text-gray-500 mt-1 ${!selectMain && 'opacity-50'}`}>
              {formatCurrency(mainVariant?.price.amount || "0", currencyCode)}
            </p>
          </div>
        </div>

        <div className="pl-2 w-full flex justify-start py-1">
           <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">+</div>
        </div>

        {/* Related Product */}
        <div className="flex gap-4 items-center">
          <input 
            type="checkbox" 
            checked={selectRelated}
            onChange={(e) => setSelectRelated(e.target.checked)}
            className="w-4 h-4 accent-black bg-transparent border-gray-300 rounded-sm cursor-pointer" 
          />
          {relatedProduct.featuredImage?.url ? (
            <div className="w-16 h-20 relative bg-gray-100 flex-shrink-0">
              <Image src={relatedProduct.featuredImage.url} alt={relatedProduct.title} fill className="object-cover" />
            </div>
          ) : (
             <div className="w-16 h-20 bg-gray-100 flex-shrink-0" />
          )}
          <div className="flex-1">
            <p className={`text-xs font-semibold uppercase tracking-widest ${!selectRelated && 'opacity-50'}`}>
              {relatedProduct.title}
            </p>
            <p className={`text-xs text-gray-500 mt-1 ${!selectRelated && 'opacity-50'}`}>
              {formatCurrency(relatedVariant?.price?.amount || "0", currencyCode)}
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-end">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Total price</p>
          <p className="text-lg font-semibold">
            {formatCurrency(total.toString(), currencyCode)}
          </p>
        </div>
        <button 
          onClick={handleAddSelected}
          disabled={!isAnythingSelected || isLoading}
          className="bg-black text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Adding..." : "Add Selected"}
        </button>
      </div>
    </div>
  );
}
