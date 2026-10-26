import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Care | Maison",
  description: "How to care for your Maison garments — wool, cashmere, leather, and knitwear care guides.",
};

const sections = [
  {
    title: "General Care",
    content: [
      {
        heading: "Read the Label",
        text: "Each garment comes with specific care instructions on its inner label. Always follow these first — the guidance below is a general reference for our core materials.",
      },
      {
        heading: "Store with Care",
        text: "Fold heavy knits rather than hanging them to preserve their shape. Use padded or wooden hangers for tailored pieces, and keep garments in a cool, dry place away from direct sunlight.",
      },
    ],
  },
  {
    title: "By Material",
    content: [
      {
        heading: "Wool & Cashmere",
        text: "Dry-clean or gently hand wash in cold water with a wool-specific detergent. Never wring; press out excess water and dry flat, away from heat. De-pill gently with a cashmere comb to keep the surface smooth.",
      },
      {
        heading: "Leather",
        text: "Wipe clean with a soft, dry cloth. Condition periodically with a leather balm to maintain suppleness. Keep away from prolonged moisture and direct heat, and allow wet leather to air-dry naturally.",
      },
      {
        heading: "Cotton & Linen",
        text: "Machine wash cold on a gentle cycle and tumble dry low, or line dry to reduce creasing. Iron on a medium setting while slightly damp for a crisp finish.",
      },
      {
        heading: "Mohair & Delicate Knits",
        text: "Hand wash cold or dry-clean. Reshape while damp and dry flat. Store folded with acid-free tissue to protect the fibers between seasons.",
      },
    ],
  },
];

export default function CarePage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      <div className="mb-16 border-b border-gray-200 pb-8">
        <h1 className="text-4xl font-light uppercase tracking-widest mb-4">Product Care</h1>
        <p className="text-sm text-gray-500 font-light">
          Thoughtful care keeps every piece looking its best for years to come.
        </p>
      </div>

      <div className="space-y-20">
        {sections.map((section) => (
          <div key={section.title}>
            <h2 className="text-xl font-semibold uppercase tracking-widest mb-8 text-black">
              {section.title}
            </h2>
            <div className="space-y-8">
              {section.content.map((item) => (
                <div key={item.heading} className="border-l-2 border-gray-100 pl-6">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-black mb-2">
                    {item.heading}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed font-light">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 pt-10 border-t border-gray-200 text-center">
        <p className="text-xs text-gray-400 uppercase tracking-widest font-light">
          © {new Date().getFullYear()} Maison. All rights reserved.
        </p>
      </div>
    </div>
  );
}
