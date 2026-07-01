import Link from "next/link";
import { Newsletter } from "../ui/newsletter";

export function Footer() {
  return (
    <>
      <Newsletter />
      <footer className="bg-white border-t border-gray-100 text-black pt-16 pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="space-y-4">
              <h3 className="font-bold text-xl tracking-widest uppercase">MAISON</h3>
              <p className="text-sm text-gray-500 font-light leading-relaxed max-w-xs">
                Redefining modern luxury. Exceptional materials, expert craftsmanship, and timeless design.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-xs tracking-widest uppercase mb-6">Collections</h4>
              <ul className="space-y-4 text-sm text-gray-500 font-light">
                <li><Link href="/collections/women" className="hover:text-black transition-colors">Women's Ready-to-Wear</Link></li>
                <li><Link href="/collections/men" className="hover:text-black transition-colors">Men's Ready-to-Wear</Link></li>
                <li><Link href="/collections/accessories" className="hover:text-black transition-colors">Accessories</Link></li>
                <li><Link href="/collections/new-arrivals" className="hover:text-black transition-colors">New Arrivals</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-xs tracking-widest uppercase mb-6">Services</h4>
              <ul className="space-y-4 text-sm text-gray-500 font-light">
                <li><Link href="/shipping" className="hover:text-black transition-colors">Shipping & Returns</Link></li>
                <li><Link href="/care" className="hover:text-black transition-colors">Product Care</Link></li>
                <li><Link href="/faq" className="hover:text-black transition-colors">FAQ</Link></li>
                <li><Link href="/contact" className="hover:text-black transition-colors">Contact Us</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-xs tracking-widest uppercase mb-6">Social</h4>
              <ul className="space-y-4 text-sm text-gray-500 font-light">
                <li><a href="#" className="hover:text-black transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Pinterest</a></li>
                <li><a href="#" className="hover:text-black transition-colors">TikTok</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Journal</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400 font-light">
            <p>© {new Date().getFullYear()} MAISON. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-black transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-black transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
