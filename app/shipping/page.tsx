import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping & Returns | Maison",
  description: "Maison shipping options, delivery times, and our 30-day returns and exchanges policy.",
};

const sections = [
  {
    title: "Shipping",
    content: [
      {
        heading: "Complimentary Worldwide Shipping",
        text: "We offer free express shipping on all orders over $500. For orders below this threshold, a flat rate is calculated at checkout based on your destination.",
      },
      {
        heading: "Delivery Times",
        text: "Standard shipping takes 3–5 business days within Pakistan. International orders typically arrive within 7–14 business days. Express options are available at checkout for expedited delivery.",
      },
      {
        heading: "Order Tracking",
        text: "Once your order ships you will receive an email with a tracking number. You can also view real-time tracking from your Account dashboard under Order History.",
      },
      {
        heading: "Customs & Duties",
        text: "International orders may be subject to import duties and taxes levied by the destination country. These charges are the responsibility of the recipient and are not included in the product price or shipping cost.",
      },
    ],
  },
  {
    title: "Returns & Exchanges",
    content: [
      {
        heading: "30-Day Returns",
        text: "We offer free returns within 30 days of delivery. Items must be unworn, unwashed, and in their original condition with all tags attached. Sale items are final sale and cannot be returned.",
      },
      {
        heading: "Size Exchanges",
        text: "We offer free size exchanges within 30 days. Contact our client services team and we will arrange the swap for you, subject to availability.",
      },
      {
        heading: "How to Return",
        text: "Visit our Returns Portal or contact support@maison.com to initiate a return. Once your return is received and inspected, your refund will be processed to your original payment method within 5–7 business days.",
      },
    ],
  },
];

export default function ShippingPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      <div className="mb-16 border-b border-gray-200 pb-8">
        <h1 className="text-4xl font-light uppercase tracking-widest mb-4">Shipping &amp; Returns</h1>
        <p className="text-sm text-gray-500 font-light">
          Everything you need to know about delivery, returns, and exchanges.
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
