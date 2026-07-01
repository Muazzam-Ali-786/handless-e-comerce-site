import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service & Privacy Policy | Maison",
  description: "Read Maison's Terms of Service, Privacy Policy, and Customer Support information.",
};

const sections = [
  {
    title: "Terms of Service",
    content: [
      {
        heading: "1. Acceptance of Terms",
        text: "By accessing and placing an order with Maison, you confirm that you are in agreement with and bound by these terms and conditions. These terms apply to the entire website and any email or other communication between you and Maison.",
      },
      {
        heading: "2. Products & Pricing",
        text: "All prices are shown in USD and are subject to change without notice. We reserve the right to modify or discontinue any product at any time. We shall not be liable to you or any third party for any modification, suspension or discontinuance of products.",
      },
      {
        heading: "3. Orders & Payment",
        text: "When you place an order, you are making an offer to purchase the selected products. We reserve the right to refuse any order without providing reasons. Payment must be received in full before dispatch of goods.",
      },
      {
        heading: "4. Shipping & Delivery",
        text: "We offer complimentary worldwide express shipping on orders over $500. Delivery times vary by destination and are estimates only. We are not responsible for delays caused by customs or other factors outside our control.",
      },
      {
        heading: "5. Returns & Exchanges",
        text: "Items may be returned within 30 days of delivery in their original, unworn condition with all tags attached. Sale items are final sale and cannot be returned or exchanged. Contact our client services team to initiate a return.",
      },
    ],
  },
  {
    title: "Privacy Policy",
    content: [
      {
        heading: "1. Information We Collect",
        text: "We collect information you provide when creating an account, placing an order, or contacting us. This includes name, email address, billing and shipping address, and payment information (processed securely via Shopify).",
      },
      {
        heading: "2. How We Use Your Information",
        text: "Your information is used to process orders, send order confirmations and shipping updates, improve our services, and send marketing communications where you have opted in. We do not sell your personal data to third parties.",
      },
      {
        heading: "3. Data Security",
        text: "We use industry-standard security measures to protect your personal information. All payment transactions are processed through Shopify's encrypted payment gateway. However, no method of transmission over the internet is 100% secure.",
      },
      {
        heading: "4. Cookies",
        text: "Our website uses cookies to enhance your browsing experience, analyze site traffic, and personalize content. You may disable cookies in your browser settings, though this may affect website functionality.",
      },
      {
        heading: "5. Your Rights",
        text: "You have the right to access, correct, or delete your personal data at any time. To exercise these rights, please contact us at privacy@maison.com. We will respond to your request within 30 days.",
      },
    ],
  },
  {
    title: "Customer Support",
    content: [
      {
        heading: "Contact Us",
        text: "Our client services team is available Monday through Friday, 9am–6pm GMT. Email us at support@maison.com or use the contact form on our website. We aim to respond to all enquiries within 24 hours.",
      },
      {
        heading: "FAQ",
        text: "For answers to common questions about sizing, care instructions, shipping, and returns, please visit our FAQ section or reach out to our team who are always happy to assist.",
      },
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      <div className="mb-16 border-b border-gray-200 pb-8">
        <h1 className="text-4xl font-light uppercase tracking-widest mb-4">Legal &amp; Support</h1>
        <p className="text-sm text-gray-500 font-light">Last updated: June 2026</p>
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
