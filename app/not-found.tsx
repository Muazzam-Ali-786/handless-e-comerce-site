import Link from "next/link";
import { getProducts } from "@/lib/shopify";
import { ProductCard } from "@/components/product/product-card";
import { Reveal, StaggerGroup } from "@/components/home/home-motion";

export default async function NotFound() {
  const products = await getProducts();
  const picks = products.slice(0, 4);

  return (
    <div className="bg-[#faf9f6] text-black min-h-screen flex flex-col">
      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24">
        <Reveal className="max-w-xl w-full flex flex-col items-center space-y-6">
          <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#78716c]">
            Maison
          </span>
          <h1 className="text-7xl md:text-8xl font-light tracking-[0.1em] leading-none">404</h1>
          <h2 className="text-3xl md:text-4xl font-light uppercase tracking-wider">
            Lost your <span className="font-serif italic font-normal text-gray-500">way?</span>
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed max-w-md">
            The page you&apos;re looking for doesn&apos;t exist, or it may have moved. Let&apos;s get you back to the good part.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row gap-4">
            <Link
              href="/collections/all"
              className="bg-black text-white text-center uppercase tracking-widest text-[11px] font-bold px-8 py-4 border border-black hover:bg-[#27272a] transition-all duration-300"
            >
              Shop All Products
            </Link>
            <Link
              href="/"
              className="bg-transparent text-black text-center uppercase tracking-widest text-[11px] font-bold px-8 py-4 border border-black hover:bg-black hover:text-white transition-all duration-300"
            >
              Return Home
            </Link>
          </div>
        </Reveal>
      </section>

      {/* You may also like */}
      {picks.length > 0 && (
        <section className="w-full border-t border-gray-200 py-16">
          <div className="max-w-[1200px] mx-auto px-6 w-full">
            <Reveal className="text-center mb-10">
              <h2 className="text-2xl font-semibold uppercase tracking-[0.15em] text-black">
                You may also like
              </h2>
            </Reveal>
            <StaggerGroup className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-12">
              {picks.map((product) => (
                <div key={product.id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </StaggerGroup>
          </div>
        </section>
      )}
    </div>
  );
}
