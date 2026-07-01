 "use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { fadeUpVariant } from "@/lib/animations";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // In a real app, send this to Shopify customer API or Mailchimp
      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
      setEmail("");
    }
  };
 return (
    <motion.section 
      variants={fadeUpVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="bg-gray-50 border-t border-gray-200 py-20 px-6"
    >
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-light tracking-wide uppercase mb-4 text-black">
          Join The Club
        </h2>
        <p className="text-gray-600 mb-8 font-light">
          Subscribe to receive updates, access to exclusive deals, and more. Get 10% off your first order.
        </p>
        
        <form onSubmit={handleSubmit} className="relative max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            className="w-full bg-transparent border-b border-gray-400 py-3 pr-10 text-black placeholder:text-gray-400 focus:outline-none focus:border-black transition-colors"
          />
          <button
            type="submit"
            className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-black transition-colors"
            aria-label="Subscribe"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
        
        {status === "success" && (
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-green-600 mt-4"
          >
            Thank you for subscribing! Check your inbox for the discount code.
          </motion.p>
        )}
      </div>
    </motion.section>
  );
}
