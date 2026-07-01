"use client";

import { useCartStore } from "@/store/cart-store";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ShieldCheck, CreditCard, ChevronLeft } from "lucide-react";

export default function CheckoutPage() {
  const { cart, localItems } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Form states
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  
  const items = cart?.lines?.edges?.map((e) => e.node) || [];
  const subtotal = parseFloat(cart?.cost?.subtotalAmount?.amount || "0");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !firstName || !lastName || !address || !city || !postalCode) {
      alert("Please fill in all shipping fields.");
      return;
    }
    
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      // Clear cart
      useCartStore.setState({ cart: null, localItems: [] });
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="bg-[#faf9f6] text-black min-h-[90vh] flex flex-col items-center justify-center px-6 py-20">
        <div className="max-w-md w-full bg-white border border-gray-200 p-10 text-center space-y-6 shadow-sm">
          <div className="w-16 h-16 bg-[#e8e4de] rounded-full flex items-center justify-center mx-auto">
            <span className="text-2xl">✨</span>
          </div>
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#78716c]">
              Maison Order System
            </span>
            <h1 className="text-3xl font-light uppercase tracking-wider">
              Order <span className="font-serif italic font-normal text-gray-500">Confirmed</span>
            </h1>
            <p className="text-sm text-gray-500">
              Thank you for your purchase, {firstName}. Your mock order ID is <span className="font-mono text-black font-semibold">#MSN-{Math.floor(100000 + Math.random() * 900000)}</span>.
            </p>
          </div>
          <div className="w-full h-[1px] bg-gray-100" />
          <p className="text-xs text-gray-400 leading-relaxed">
            Since this website is running in **Premium Fallback Mode**, no real transaction has taken place. You can now configure your Shopify API keys in `.env.local` to connect to your live store!
          </p>
          <div className="pt-4">
            <Link
              href="/"
              className="bg-black text-white text-center uppercase tracking-widest text-[11px] font-bold px-8 py-4 rounded-none hover:bg-zinc-800 transition-all duration-300 border border-black inline-block w-full"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-[#faf9f6] text-black min-h-[80vh] flex flex-col items-center justify-center px-6">
        <div className="text-center space-y-6 max-w-sm">
          <p className="text-gray-500 text-sm">Your shopping bag is currently empty.</p>
          <Link
            href="/"
            className="bg-black text-white uppercase tracking-widest text-[11px] font-bold px-8 py-4 rounded-none hover:bg-zinc-800 transition-all border border-black inline-block"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#faf9f6] text-black min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Left Column: Form */}
        <div className="lg:col-span-7 space-y-10">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-black transition-colors mb-4">
            <ChevronLeft className="w-3.5 h-3.5" /> Back to Store
          </Link>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Contact Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-light uppercase tracking-wider border-b border-gray-200 pb-2">
                1. Contact Information
              </h2>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-none px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                />
              </div>
            </div>

            {/* Shipping Address Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-light uppercase tracking-wider border-b border-gray-200 pb-2">
                2. Shipping Address
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">First Name</label>
                  <input
                    type="text"
                    required
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-none px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Last Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-none px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Address</label>
                <input
                  type="text"
                  required
                  placeholder="Street name and house number"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-none px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">City</label>
                  <input
                    type="text"
                    required
                    placeholder="Paris"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-none px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Postal Code</label>
                  <input
                    type="text"
                    required
                    placeholder="75001"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-none px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-light uppercase tracking-wider border-b border-gray-200 pb-2">
                3. Payment Details
              </h2>
              <div className="bg-white border border-gray-200 p-5 space-y-4 shadow-sm">
                <div className="flex items-center gap-3 text-sm font-semibold">
                  <CreditCard className="w-5 h-5 text-gray-500" />
                  <span>Mock Secure Credit Card Payment</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  No actual payment credentials are required. Simply click the "Complete Order" button below to place a mock purchase order.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black text-white text-center uppercase tracking-widest text-[11px] font-bold py-5 rounded-none hover:bg-zinc-800 transition-all duration-300 border border-black disabled:opacity-50"
            >
              {isSubmitting ? "Processing Order..." : "Complete Purchase"}
            </button>
          </form>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5 bg-white border border-gray-200 p-6 lg:p-8 h-fit space-y-6 shadow-sm">
          <h2 className="text-lg font-semibold uppercase tracking-wider border-b border-gray-100 pb-3">
            Order Summary
          </h2>

          {/* Items List */}
          <div className="divide-y divide-gray-100 max-h-[40vh] overflow-y-auto pr-2 no-scrollbar">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                <div className="w-16 h-20 bg-gray-100 relative overflow-hidden flex-shrink-0">
                  {item.merchandise.product.featuredImage && (
                    <Image
                      src={item.merchandise.product.featuredImage.url}
                      alt={item.merchandise.product.title}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex-grow flex flex-col justify-between py-1">
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wide leading-tight">
                      {item.merchandise.product.title}
                    </h3>
                    <p className="text-[10px] text-gray-500 mt-1">
                      Qty: {item.quantity} {item.merchandise.title !== "Default Title" ? `| ${item.merchandise.title}` : ""}
                    </p>
                  </div>
                  <p className="text-xs font-semibold">
                    {formatCurrency(item.cost.totalAmount.amount, item.cost.totalAmount.currencyCode)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-6 space-y-3 text-xs font-medium text-gray-500">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-black font-semibold">{formatCurrency(subtotal, "USD")}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-black font-semibold">Complimentary</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes</span>
              <span className="text-black font-semibold">$0.00</span>
            </div>
            <div className="border-t border-gray-100 pt-4 flex justify-between text-sm text-black font-bold">
              <span>Estimated Total</span>
              <span className="text-lg">{formatCurrency(subtotal, "USD")}</span>
            </div>
          </div>

          <div className="bg-[#f5f5f4] p-4 flex gap-3 text-xs text-gray-500 leading-relaxed">
            <ShieldCheck className="w-5 h-5 text-gray-700 flex-shrink-0 mt-0.5" />
            <span>
              Secure checkout. Your connection is fully encrypted. Fallback system active.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
