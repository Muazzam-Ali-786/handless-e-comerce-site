"use client";

import { MessageCircle } from "lucide-react";

export function WhatsappButton() {
  const phoneNumber = "1234567890"; // Placeholder number
  const message = "Hi, I have a question about a product.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-black text-white px-4 py-3 rounded-full shadow-lg hover:scale-105 hover:bg-gray-900 transition-all duration-300"
      aria-label="Chat with an expert on WhatsApp"
    >
      <span className="text-sm font-semibold tracking-wide">Chat with an expert</span>
      <MessageCircle className="w-5 h-5" />
    </a>
  );
}
