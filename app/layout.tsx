import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { clsx } from "clsx";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { CartFeedback } from "@/components/cart/cart-feedback";
import { PageTransition } from "@/components/layout/page-transition";
import { WhatsappButton } from "@/components/ui/whatsapp-button";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Maison | Premium Headless Fashion Store",
  description: "A modern headless fashion store powered by Next.js and Shopify.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en" className={clsx(inter.variable, "antialiased")}>
      <body className="min-h-screen flex flex-col bg-white text-black selection:bg-black selection:text-white">
        <Navbar />
        <main className="flex-grow flex flex-col pt-[140px]">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
        <CartDrawer />
        <CartFeedback />
        <WhatsappButton />
      </body>
    </html>
  );
}

