import Link from "next/link";
import { getProducts, getCollections } from "@/lib/shopify";
import { ProductCard } from "@/components/product/product-card";
import Image from "next/image";

export default async function HomePage() {
  const products = await getProducts();
  const collections = await getCollections();

  return (
    <div className="flex flex-col min-h-screen bg-[#faf9f6] text-black">

      {/* Luxury Hero Section */}
      <section className="relative w-full h-[85vh] overflow-hidden bg-[#1c1917]">
        {/* Background Image with Ken Burns effect */}
        <div className="absolute inset-0 scale-105 animate-[zoom_30s_infinite_alternate] ease-in-out opacity-85">
          <Image
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2070&auto=format&fit=crop"
            alt="Maison Autumn Winter '26 Campaign"
            fill
            priority
            className="object-cover object-center"
          />
        </div>
        
        {/* Sleek Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col justify-end pb-24 px-6 md:px-12 lg:px-20 z-10 max-w-7xl mx-auto w-full">
          <div className="max-w-2xl text-left space-y-6">
            <span className="inline-block text-xs font-semibold uppercase tracking-[0.3em] text-[#d6d3d1] border-b border-[#d6d3d1]/30 pb-2">
              Collection Campaign N°04
            </span>
            <h1 className="text-5xl md:text-7xl font-light text-white uppercase tracking-[0.05em] leading-[1.05]">
              Forms &<br />
              <span className="font-serif italic font-normal">Silence</span>
            </h1>
            <p className="text-[#a8a29e] font-normal tracking-wide text-sm md:text-base leading-relaxed max-w-md">
              A study in raw textures, heavy wools, and sculptural tailoring designed to withstand the winter elements.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <Link
                href="/collections/outerwear"
                className="bg-white text-black text-center uppercase tracking-widest text-[11px] font-bold px-8 py-4 rounded-none hover:bg-black hover:text-white transition-all duration-300 border border-white hover:border-black"
              >
                Shop Outerwear
              </Link>
              <Link
                href="/collections"
                className="bg-transparent text-white text-center uppercase tracking-widest text-[11px] font-bold px-8 py-4 rounded-none border border-white/40 hover:border-white transition-all duration-300"
              >
                View Collections
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Circular Premium Categories */}
      <section className="bg-[#f5f5f4] py-16 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="flex justify-center gap-6 md:gap-16 overflow-x-auto no-scrollbar py-2">
            {[
              { 
                name: "Outerwear", 
                href: "/collections/outerwear", 
                img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=400&auto=format&fit=crop" 
              },
              { 
                name: "Knitwear", 
                href: "/collections/knitwear", 
                img: "https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?q=80&w=400&auto=format&fit=crop" 
              },
              { 
                name: "Accessories", 
                href: "/collections/accessories", 
                img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=400&auto=format&fit=crop" 
              },
            ].map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="flex flex-col items-center gap-4 group flex-shrink-0 cursor-pointer"
              >
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden relative ring-1 ring-black/5 ring-offset-4 group-hover:ring-black transition-all duration-500">
                  <Image
                    src={cat.img}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-colors duration-300" />
                </div>
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-[#44403c] group-hover:text-black transition-colors">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Philosophy Segment (Wow-factor Editorial) */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
        <div className="lg:col-span-5 space-y-6">
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#78716c]">
            Maison Philosophy
          </span>
          <h2 className="text-3xl md:text-4xl font-light uppercase tracking-wider leading-tight">
            Designed to endure.<br />
            <span className="font-serif italic font-normal text-gray-500">Made to inspire.</span>
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            We believe in clothing as architecture for the body. Every seam, cut, and fabric is meticulously selected to formulate a dialogue between minimalist design and raw, functional comfort.
          </p>
          <div className="pt-2">
            <Link
              href="/collections"
              className="text-xs font-bold uppercase tracking-widest border-b border-black pb-1 hover:border-gray-400 transition-colors"
            >
              Discover our story
            </Link>
          </div>
        </div>
        
        {/* Intersecting Dual-Image Editorial Layout */}
        <div className="lg:col-span-7 grid grid-cols-12 gap-4 relative mt-10 lg:mt-0">
          <div className="col-span-8 aspect-[4/5] relative overflow-hidden bg-gray-100 shadow-md">
            <Image
              src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=800&auto=format&fit=crop"
              alt="Maison studio tailoring"
              fill
              className="object-cover"
            />
          </div>
          <div className="col-span-5 aspect-[3/4] absolute bottom-[-40px] right-[-10px] md:right-4 overflow-hidden border-8 border-[#faf9f6] shadow-xl z-10 hidden sm:block">
            <Image
              src="https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=600&auto=format&fit=crop"
              alt="Maison texture detail"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* New Arrivals Horizontal Showcase */}
      <section className="w-full py-16 border-t border-gray-200 overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-6 w-full">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-semibold uppercase tracking-[0.15em] text-black">
              New In
            </h2>
            <Link
              href="/collections/all"
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 hover:text-black transition-colors mt-2 block"
            >
              View All
            </Link>
          </div>

          {products.length === 0 ? (
            <p className="text-center text-gray-400 py-20">Loading products...</p>
          ) : (
            <div className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-8">
              {products.slice(0, 10).map((product) => (
                <div key={product.id} className="min-w-[280px] w-[80vw] md:w-[320px] lg:w-[18vw] flex-shrink-0 snap-start">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* On Sale Horizontal Showcase */}
      <section className="w-full py-16 border-t border-gray-200 overflow-hidden bg-white">
        <div className="max-w-[1600px] mx-auto px-6 w-full">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-semibold uppercase tracking-[0.15em] text-black">
              On Sale
            </h2>
            <Link
              href="/collections/sale"
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 hover:text-black transition-colors mt-2 block"
            >
              View All
            </Link>
          </div>

          {products.length === 0 ? (
            <p className="text-center text-gray-400 py-20">Loading products...</p>
          ) : (
            <div className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-8">
              {/* Note: ideally we would filter products by discount here, but for demo we slice differently */}
              {[...products].reverse().slice(0, 10).map((product) => (
                <div key={`sale-${product.id}`} className="min-w-[280px] w-[80vw] md:w-[320px] lg:w-[18vw] flex-shrink-0 snap-start">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Collections Premium Showcase Split-Banners */}
      <section className="w-full bg-[#1c1917] text-white py-24 mt-16">
        <div className="max-w-7xl mx-auto px-6 w-full space-y-16">
          <div className="text-center max-w-xl mx-auto space-y-4">
            <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#a8a29e]">
              Shop by category
            </span>
            <h2 className="text-3xl md:text-4xl font-light uppercase tracking-wider">
              The Winter <span className="font-serif italic font-normal text-[#d6d3d1]">Chapters</span>
            </h2>
            <div className="w-12 h-[1px] bg-white/30 mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
            {collections.slice(0, 3).map((collection) => (
              <Link
                key={collection.handle}
                href={`/collections/${collection.handle}`}
                className="group relative aspect-[3/4] overflow-hidden bg-zinc-900 border border-white/5 cursor-pointer"
              >
                {/* Background Image (with fallback) */}
                <div className="absolute inset-0 scale-100 group-hover:scale-105 transition-transform duration-700 ease-out opacity-75">
                  <Image
                    src={collection.image?.url || "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop"}
                    alt={collection.title}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                  />
                </div>
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10 group-hover:via-black/30 transition-all duration-300" />
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-8 space-y-3 z-20">
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#d6d3d1]">
                    Explore Chapter
                  </span>
                  <h3 className="text-2xl font-light uppercase tracking-wider text-white">
                    {collection.title}
                  </h3>
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {collection.description}
                  </p>
                  <div className="pt-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white border-b border-white/40 group-hover:border-white pb-1 transition-all">
                      Browse Garments →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
