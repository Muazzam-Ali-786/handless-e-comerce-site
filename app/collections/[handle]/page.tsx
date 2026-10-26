import { getCollectionProducts, getProducts, getCollections } from "@/lib/shopify";
import { ProductCard } from "@/components/product/product-card";
import Link from "next/link";

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;

  const products = handle === "all" ? await getProducts() : await getCollectionProducts(handle);

  const title = handle === "all"
    ? "All Products"
    : handle.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

  // A specific collection that is missing from the store OR has no products
  // renders a designed empty state inside the normal layout — never a hard 404.
  if (handle !== "all" && (!products || products.length === 0)) {
    const collections = await getCollections();
    const others = collections.filter((c) => c.handle !== handle);

    return (
      <div className="bg-[#faf9f6] text-black min-h-screen pb-20 -mt-20 pt-20">
        <div className="max-w-[1600px] mx-auto px-6 py-24 flex flex-col items-center text-center">
          <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#78716c] mb-6">
            Maison Collections
          </span>
          <h1 className="text-4xl md:text-5xl font-light tracking-widest uppercase">{title}</h1>
          <h2 className="text-lg font-light uppercase tracking-wider text-gray-500 mt-6">
            This collection isn&apos;t available yet
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed max-w-md mt-4">
            The pieces you&apos;re looking for haven&apos;t arrived in this collection yet. New collections are added every season — explore what&apos;s in store today.
          </p>
          <div className="pt-8 flex flex-col sm:flex-row gap-4">
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

          {others.length > 0 && (
            <div className="mt-16">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#78716c] mb-4">
                Browse available collections
              </p>
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-3">
                {others.map((c) => (
                  <Link
                    key={c.handle}
                    href={`/collections/${c.handle}`}
                    className="text-sm font-medium text-gray-600 hover:text-black underline underline-offset-4 transition-colors"
                  >
                    {c.title}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#faf9f6] text-black min-h-screen pb-20 -mt-20 pt-20">
      {/* Header */}
      <div className="max-w-[1600px] mx-auto px-6 py-12">
        <h1 className="text-4xl font-light tracking-widest uppercase">{title}</h1>
        
        {/* Quick Tabs */}
        <div className="flex gap-4 mt-8 overflow-x-auto no-scrollbar pb-2">
          {["All", "Spring/Summer", "Autumn/Winter", "Essentials", "New Arrivals"].map((tab, idx) => (
            <button 
              key={tab}
              className={`px-5 py-2 text-xs font-bold uppercase tracking-widest whitespace-nowrap border ${idx === 0 ? 'bg-black text-white border-black' : 'bg-transparent text-gray-600 border-gray-300 hover:border-black'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="mt-8 flex justify-between items-center text-sm border-b border-gray-200 pb-4">
          <div className="flex gap-4 items-center">
            <span className="text-gray-500 font-semibold uppercase tracking-wider text-xs">Sort by:</span>
            <select className="bg-transparent text-black border-none focus:ring-0 cursor-pointer text-sm font-medium">
              <option className="bg-white">Newest Arrivals</option>
              <option className="bg-white">Price: Low to High</option>
              <option className="bg-white">Price: High to Low</option>
            </select>
          </div>
          <span className="text-gray-500 font-medium">{products.length} Products</span>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 flex gap-12">
        {/* Sidebar */}
        <aside className="w-64 hidden lg:block flex-shrink-0">
          <div className="space-y-10">
            <div>
              <ul className="space-y-4 text-sm font-medium text-gray-500">
                <li className="text-black cursor-pointer hover:text-black transition-colors">Coats</li>
                <li className="hover:text-black cursor-pointer transition-colors">Jackets</li>
                <li className="hover:text-black cursor-pointer transition-colors">Blazers</li>
                <li className="hover:text-black cursor-pointer transition-colors">Vests</li>
              </ul>
            </div>

            {/* Colors */}
            <div>
              <h3 className="text-xs font-semibold uppercase mb-4 tracking-widest text-black">Color</h3>
              <div className="flex gap-3">
                <button className="w-6 h-6 rounded-full bg-white border border-gray-300 focus:ring-1 focus:ring-black ring-offset-2 ring-offset-[#faf9f6]"></button>
                <button className="w-6 h-6 rounded-full bg-black border border-gray-800 focus:ring-1 focus:ring-black ring-offset-2 ring-offset-[#faf9f6]"></button>
                <button className="w-6 h-6 rounded-full bg-[#D2B48C] border border-gray-300 focus:ring-1 focus:ring-black ring-offset-2 ring-offset-[#faf9f6]"></button>
                <button className="w-6 h-6 rounded-full bg-[#1E3A8A] border border-gray-300 focus:ring-1 focus:ring-black ring-offset-2 ring-offset-[#faf9f6]"></button>
              </div>
            </div>

            {/* Size */}
            <div>
              <h3 className="text-xs font-semibold uppercase mb-4 tracking-widest text-black">Size</h3>
              <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                <button className="w-10 h-10 border border-gray-200 flex items-center justify-center hover:border-black transition-colors bg-white">XS</button>
                <button className="w-10 h-10 border border-gray-200 flex items-center justify-center hover:border-black transition-colors bg-white">S</button>
                <button className="w-10 h-10 border border-black flex items-center justify-center bg-black text-white font-medium transition-colors">M</button>
                <button className="w-10 h-10 border border-gray-200 flex items-center justify-center hover:border-black transition-colors bg-white">L</button>
                <button className="w-10 h-10 border border-gray-200 flex items-center justify-center hover:border-black transition-colors bg-white">XL</button>
              </div>
            </div>
            
            {/* Material */}
            <div>
              <h3 className="text-xs font-semibold uppercase mb-4 tracking-widest text-black">Material</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4 accent-black bg-transparent border-gray-300 rounded-sm" />
                  <span>Wool (12)</span>
                </li>
                <li className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4 accent-black bg-transparent border-gray-300 rounded-sm" />
                  <span>Leather (5)</span>
                </li>
                <li className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4 accent-black bg-transparent border-gray-300 rounded-sm" />
                  <span>Cotton (8)</span>
                </li>
              </ul>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1 w-full overflow-hidden">
          {products.length === 0 ? (
            <p className="text-gray-400 text-center py-20 font-light">No products found in this collection.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-12">
              {products.map((product) => (
                <div key={product.id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

