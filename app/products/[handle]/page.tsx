import { getProduct, getProducts } from "@/lib/shopify";
import { notFound } from "next/navigation";
import { Gallery } from "@/components/product/gallery";
import { VariantSelector } from "@/components/product/variant-selector";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { ProductCard } from "@/components/product/product-card";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { Heart } from "lucide-react";
import { ProductAccordion } from "@/components/product/product-accordion";
import { FbtWidget } from "@/components/product/fbt-widget";
import { WishlistButton } from "@/components/product/wishlist-button";

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { handle } = await params;
  const resolvedSearchParams = await searchParams;
  const product = await getProduct(handle);
  const allProducts = await getProducts();

  if (!product) {
    return notFound();
  }

  const relatedProducts = allProducts.filter(p => p.id !== product.id);

  const selectedVariant = product.variants.edges.find((edge) => {
    return edge.node.selectedOptions.every((option) => {
      const paramValue = resolvedSearchParams[option.name.toLowerCase()];
      return paramValue === option.value;
    });
  })?.node;

  const displayVariant = selectedVariant || product.variants.edges[0]?.node;
  const images = product.images.edges.map(edge => edge.node);

  return (
    <div className="bg-[#fcfbf9] min-h-screen">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-6 py-6 flex gap-2 text-xs text-gray-500 uppercase tracking-widest font-medium">
        <Link href="/" className="hover:text-black">Maison</Link>
        <span>/</span>
        <Link href="/collections/all" className="hover:text-black">Shop</Link>
        <span>/</span>
        <span className="text-black">{product.title}</span>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-24">
        {/* Left: Images */}
        <div className="w-full">
          <Gallery images={images} />
        </div>

        {/* Right: Details */}
        <div className="pt-4 lg:pt-10">
          <h1 className="text-3xl font-semibold tracking-wide uppercase mb-2">{product.title}</h1>
          <p className="text-xl font-medium mb-6">
            {displayVariant 
              ? formatCurrency(displayVariant.price.amount, displayVariant.price.currencyCode)
              : formatCurrency(product.priceRange.minVariantPrice.amount, product.priceRange.minVariantPrice.currencyCode)}
          </p>
          
          <div className="prose prose-sm text-gray-600 mb-10 leading-relaxed max-w-none" dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />

          <div className="mb-8">
            <VariantSelector 
              options={product.options} 
              variants={product.variants.edges.map(e => e.node)} 
            />
          </div>

          <div className="space-y-4 mb-12">
            <AddToCartButton
              variant={displayVariant}
              availableForSale={displayVariant?.availableForSale || false}
              product={product}
            />
            <WishlistButton productId={product.id} />
          </div>

          {/* Frequently Bought Together */}
          {relatedProducts.length > 0 && (
            <FbtWidget 
              mainProduct={product} 
              mainVariant={displayVariant} 
              relatedProduct={relatedProducts[0]} 
            />
          )}

          {/* Accordion Info */}
          <ProductAccordion />
        </div>
      </div>

      {/* You May Also Like */}
      <div className="max-w-7xl mx-auto px-6 py-20 border-t border-gray-200">
        <h2 className="text-2xl font-semibold uppercase tracking-wide mb-10 text-center lg:text-left">You may also like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {relatedProducts.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}

