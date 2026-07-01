"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is your return policy?",
    answer:
      "We offer free returns within 30 days of delivery. Items must be unworn, unwashed, and in original packaging. Simply visit the Returns Portal and follow the instructions.",
  },
  {
    question: "How long does shipping take?",
    answer:
      "Standard shipping takes 3–5 business days within Pakistan. International orders typically arrive within 7–14 business days. Express shipping is available at checkout.",
  },
  {
    question: "Do you offer size exchanges?",
    answer:
      "Yes! We offer free size exchanges within 30 days. Visit our Exchanges page or contact our customer care team and we'll arrange the swap for you.",
  },
  {
    question: "How do I care for my garments?",
    answer:
      "Each garment comes with specific care instructions on its label. As a general rule, we recommend dry-cleaning or gentle cold-water hand washing for our wool and cashmere pieces.",
  },
  {
    question: "Are your products ethically made?",
    answer:
      "Absolutely. We partner exclusively with factories that hold GOTS and OEKO-TEX certifications, ensuring fair wages, safe working conditions, and sustainable practices.",
  },
  {
    question: "Can I track my order?",
    answer:
      "Yes, once your order ships you will receive an email with a tracking number. You can also view real-time tracking from your Account dashboard under Order History.",
  },
];

function AccordionItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center py-5 text-left gap-4 group"
      >
        <span className="text-sm font-semibold uppercase tracking-wider text-black group-hover:text-gray-600 transition-colors">
          {question}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-48 pb-5" : "max-h-0"
        }`}
      >
        <p className="text-sm text-gray-600 font-light leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-light uppercase tracking-widest mb-4">FAQ</h1>
        <p className="text-gray-500 font-light">
          Answers to our most frequently asked questions.
        </p>
      </div>

      <div className="border-t border-gray-200">
        {faqs.map((faq) => (
          <AccordionItem key={faq.question} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </div>
  );
}
