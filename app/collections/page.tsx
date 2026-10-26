import Link from "next/link";
import Image from "next/image";
import { getCollections } from "@/lib/shopify";

export default async function CollectionsPage() {
  const collections = await getCollections();

  return (
    <div className="bg-[#faf9f6] text-black min-h-screen pb-24">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-16 text-center md:text-left space-y-4">
        <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#78716c]">
          Maison Archives
        </span>
        <h1 className="text-4xl md:text-5xl font-light uppercase tracking-wider">
          The <span className="font-serif italic font-normal text-gray-500">Collections</span>
        </h1>
        <p className="text-sm text-gray-600 max-w-lg leading-relaxed">
          Explore our seasonal chapters, each carefully engineered to serve as architectural layers for the modern wardrobe.
        </p>
        <div className="w-16 h-[1px] bg-black/20 pt-2" />
      </div>

      {/* Collections Grid */}
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        {collections.length === 0 && (
          <p className="text-center text-gray-400 py-24 font-light uppercase tracking-widest text-sm">
            No collections available
          </p>
        )}
        {collections.map((collection, index) => {
          const isEven = index % 2 === 0;
          return (
            <div
              key={collection.handle}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center border-b border-gray-200 pb-16 last:border-b-0 last:pb-0`}
            >
              {/* Image Column */}
              <div
                className={`lg:col-span-7 aspect-[4/3] relative overflow-hidden bg-gray-100 group shadow-md ${
                  isEven ? "lg:order-1" : "lg:order-2"
                }`}
              >
                {collection.image && (
                  <Image
                    src={collection.image.url}
                    alt={collection.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                )}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all duration-300" />
              </div>

              {/* Text Column */}
              <div
                className={`lg:col-span-5 space-y-6 ${
                  isEven ? "lg:order-2" : "lg:order-1"
                }`}
              >
                <div className="flex items-center gap-4 text-xs font-semibold text-[#78716c] uppercase tracking-widest">
                  <span>Chapter 0{index + 1}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />
                  <span>Winter '26</span>
                </div>
                <h2 className="text-3xl font-light uppercase tracking-wider">
                  {collection.title}
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {collection.description ||
                    "An editorial curating highly-refined silhouettes, crafted utilizing premium sourced fabrics from heritage mills across Italy and Japan."}
                </p>
                
                <div className="pt-4">
                  <Link
                    href={`/collections/${collection.handle}`}
                    className="bg-black text-white text-center uppercase tracking-widest text-[11px] font-bold px-8 py-4 rounded-none hover:bg-[#27272a] transition-all duration-300 border border-black inline-block"
                  >
                    View Collection
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
