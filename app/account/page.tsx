"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Package, MapPin, User, LogOut } from "lucide-react";

interface UserProfile {
  name: string;
  email: string;
}

export default function AccountDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/account/login");
    } else {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem("user");
        router.push("/account/login");
      }
      setIsLoading(false);
    }
  }, [router]);

  const handleSignOut = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem("user");
    router.push("/account/login");
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 w-full flex items-center justify-center min-h-[50vh]">
        <div className="text-sm uppercase tracking-widest text-gray-500 animate-pulse">Loading Account...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 w-full animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-gray-200 pb-6 gap-6">
        <div>
          <h1 className="text-3xl font-light uppercase tracking-widest mb-2">My Account</h1>
          <p className="text-sm text-gray-500 font-light">
            Welcome back, <span className="font-semibold text-black">{user?.name || "Guest"}</span>.
          </p>
        </div>
        <button 
          onClick={handleSignOut} 
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors bg-transparent border-none cursor-pointer"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Sidebar Nav */}
        <div className="lg:col-span-1 space-y-2">
          <Link href="/account" className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-md text-sm font-medium text-black">
            <Package className="w-4 h-4" /> Order History
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-black transition-colors">
            <MapPin className="w-4 h-4" /> Addresses
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-black transition-colors">
            <User className="w-4 h-4" /> Profile Details
          </Link>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <h2 className="text-lg font-semibold uppercase tracking-wider mb-6">Order History</h2>
          
          <div className="border border-gray-200 rounded-md p-10 text-center flex flex-col items-center justify-center">
            <Package className="w-12 h-12 text-gray-300 mb-4" />
            <p className="text-gray-500 mb-6 font-light">You haven't placed any orders yet.</p>
            <Link 
              href="/collections"
              className="bg-black text-white px-8 py-3 text-xs uppercase tracking-widest font-semibold hover:bg-gray-800 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
