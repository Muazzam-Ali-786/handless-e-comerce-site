import { getCollectionProducts, getProducts, getCollections } from "@/lib/shopify";
import { ProductCard } from "@/components/product/product-card";
import { notFound } from "next/navigation";

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  
  const products = handle === "all" ? await getProducts() : await getCollectionProducts(handle);

  if (!products || products.length === 0) {
    if (handle !== "all") {
      const collections = await getCollections();
      const exists = collections.some(c => c.handle === handle);
      if (!exists) return notFound();
    }
  }

  const title = handle === "all" 
    ? "All Products" 
    : handle.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

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

