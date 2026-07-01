"use client";

import { Product, ProductVariant } from "@/types/shopify";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function VariantSelector({ options, variants }: { options: Product["options"]; variants: ProductVariant[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const hasNoOptionsOrJustOneOption =
    !options.length || (options.length === 1 && options[0].values.length === 1);

  if (hasNoOptionsOrJustOneOption) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      {options.map((option) => (
        <div key={option.id} className="flex flex-col gap-2">
          <h3 className="font-medium text-sm uppercase tracking-wider">{option.name}</h3>
          <div className="flex flex-wrap gap-2">
            {option.values.map((value) => {
              const optionNameLowerCase = option.name.toLowerCase();
              
              // Base option params on current params so we can update them
              const optionParams = new URLSearchParams(searchParams.toString());
              
              // Update the option params
              optionParams.set(optionNameLowerCase, value);
              const optionUrl = `${pathname}?${optionParams.toString()}`;

              // Is this option currently selected?
              const isActive = searchParams.get(optionNameLowerCase) === value;

              // Check if combination is available
              const isAvailableForSale = variants.some((variant) => {
                const isMatch = variant.selectedOptions.every((variantOption) => {
                  if (variantOption.name.toLowerCase() === optionNameLowerCase) {
                    return variantOption.value === value;
                  }
                  // Check other currently selected options
                  const selectedValue = searchParams.get(variantOption.name.toLowerCase());
                  // If not selected yet, assume it could be valid
                  if (!selectedValue) return true;
                  return variantOption.value === selectedValue;
                });
                return isMatch && variant.availableForSale;
              });

              // Dynamic styling based on state
              return (
                <button
                  key={value}
                  onClick={() => {
                    router.replace(optionUrl, { scroll: false });
                  }}
                  disabled={!isAvailableForSale}
                  className={cn(
                    "min-w-[3rem] px-4 py-2 border rounded-md text-sm transition-all",
                    {
                      "cursor-not-allowed opacity-50": !isAvailableForSale,
                      "border-primary bg-primary text-primary-foreground": isActive && isAvailableForSale,
                      "hover:border-primary": !isActive && isAvailableForSale,
                    }
                  )}
                  title={!isAvailableForSale ? "Out of Stock" : ""}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
