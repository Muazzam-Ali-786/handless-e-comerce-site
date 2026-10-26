import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Journal | Maison",
  description: "Stories, craft notes, and editorials from the Maison atelier.",
};

const articles = [
  {
    category: "Craft",
    title: "The Architecture of Tailoring",
    excerpt:
      "Inside the atelier, where structured shoulders and hand-finished seams turn raw wool into sculpture for the body.",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1000&auto=format&fit=crop",
  },
  {
    category: "Materials",
    title: "Sourcing Grade-A Cashmere",
    excerpt:
      "A journey to the highland mills where our cashmere begins — and why provenance matters to the pieces you wear.",
    image: "https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=1000&auto=format&fit=crop",
  },
  {
    category: "Editorial",
    title: "Forms & Silence: AW'26",
    excerpt:
      "The thinking behind our winter campaign — heavy textures, muted palettes, and clothing designed to endure.",
    image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=1000&auto=format&fit=crop",
  },
  {
    category: "Care",
    title: "A Guide to Longevity",
    excerpt:
      "Small rituals that keep wool, cashmere, and leather looking considered season after season.",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000&auto=format&fit=crop",
  },
];

export default function JournalPage() {
  return (
    <div className="bg-[#faf9f6] text-black min-h-screen pb-24">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12 text-center space-y-4">
        <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#78716c]">
          Maison Journal
        </span>
        <h1 className="text-4xl md:text-5xl font-light uppercase tracking-wider">
          Stories &amp; <span className="font-serif italic font-normal text-gray-500">Craft</span>
        </h1>
        <p className="text-sm text-gray-600 max-w-lg mx-auto leading-relaxed">
          Notes from the atelier — on the materials, the makers, and the thinking behind each collection.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10">
        {articles.map((article) => (
          <Link key={article.title} href="/journal" className="group block">
            <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 mb-5">
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#78716c]">
              {article.category}
            </span>
            <h2 className="text-xl font-light uppercase tracking-wider mt-2 group-hover:text-gray-500 transition-colors">
              {article.title}
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed mt-2 max-w-md">{article.excerpt}</p>
            <span className="inline-block text-[11px] font-bold uppercase tracking-widest border-b border-black pb-1 mt-4 group-hover:border-gray-400 transition-colors">
              Read more
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
