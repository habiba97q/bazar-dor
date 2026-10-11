"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, LogOut, ChevronDown, Menu, X } from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";
import toast from "react-hot-toast";

const DEFAULT_CATEGORIES = [
  { id: "chal", slug: "chal", nameBn: "চাল", icon: "🍚" },
  { id: "dal", slug: "dal", nameBn: "ডাল", icon: "🫘" },
  { id: "tel", slug: "tel", nameBn: "তেল", icon: "🛢️" },
  { id: "sobji", slug: "sobji", nameBn: "সবজি", icon: "🥬" },
  { id: "mach", slug: "mach", nameBn: "মাছ", icon: "🐟" },
  { id: "mangsho", slug: "mangsho", nameBn: "মাংস", icon: "🍗" },
  { id: "dim-dui", slug: "dim-dui", nameBn: "ডিম-দুধ", icon: "🥛" },
  { id: "mosla", slug: "mosla", nameBn: "মসলা", icon: "🌶️" },
];

export default function Navbar({ categories = DEFAULT_CATEGORIES }) {
  const pathname = usePathname();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const banglaDate = "মঙ্গলবার, ৬ অক্টোবর, ২০২৬";

  let session = null;
  try {
    const sessionRes = useSession();
    session = sessionRes?.data?.user || null;
  } catch (e) {
    session = null;
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("সফলভাবে সাইন আউট হয়েছে");
      setDropdownOpen(false);
      router.push("/");
      router.refresh();
    } catch (err) {
      toast.error("সাইন আউট ব্যর্থ হয়েছে");
    }
  };

  const activeCategoryList = categories.length > 0 ? categories : DEFAULT_CATEGORIES;

  return (
    <header className="w-full bg-white border-b border-zinc-200/80 sticky top-0 z-40">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Bengali Date */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#0e874b] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105 overflow-hidden p-2">
              <img
                src="/logo-icon.png"
                alt="বাজার দর"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 group-hover:text-[#0e874b] transition-colors">
                বাজার দর
              </span>
              <span className="text-[11px] text-zinc-400 font-normal">
                {banglaDate}
              </span>
            </div>
          </Link>

          {/* Right Section: Auth buttons / User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {session ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-zinc-50 transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
                    <img
                      src={session.image || "/avatar-rezwan.png"}
                      alt={session.name || "Rezwan"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-zinc-800 hidden sm:inline-block max-w-[120px] truncate">
                    {session.name ? session.name.split(" ")[0] : "Rezwan"}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-zinc-100 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="pb-3 border-b border-zinc-100">
                      <p className="font-bold text-sm text-zinc-900">
                        {session.name || "Rezwan Ahmed"}
                      </p>
                      <p className="text-xs text-zinc-400 truncate mt-0.5">
                        {session.email || "rezwanahmed@gmail.com"}
                      </p>
                    </div>

                    <div className="py-2">
                      <Link
                        href="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-2 py-2 text-xs sm:text-sm text-zinc-700 hover:text-[#0e874b] hover:bg-zinc-50 rounded-lg transition-colors font-medium"
                      >
                        <User className="w-4 h-4 text-zinc-400" />
                        👤 আমার প্রোফাইল
                      </Link>
                    </div>

                    <div className="pt-2 border-t border-zinc-100">
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 px-2 py-2 text-xs sm:text-sm text-rose-600 hover:bg-rose-50 rounded-lg transition-colors font-medium w-full text-left cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        ↩️ সাইন আউট
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/signin"
                  className="text-xs sm:text-sm font-medium text-zinc-700 hover:text-[#0e874b] transition-colors"
                >
                  সাইন ইন
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#0e874b] hover:bg-[#0c733f] rounded-lg shadow-sm transition-all"
                >
                  সাইন আপ
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-zinc-600 hover:text-zinc-900 rounded-lg hover:bg-zinc-100"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Category Navigation Bar */}
      <div className="w-full bg-white border-t border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-start sm:justify-center gap-3 py-2 overflow-x-auto no-scrollbar scroll-smooth">
            {activeCategoryList.map((cat) => {
              const isActive = pathname === `/category/${cat.slug}`;
              return (
                <Link
                  key={cat.id || cat.slug}
                  href={`/category/${cat.slug}`}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-[#0e874b] text-white font-semibold shadow-sm"
                      : "text-zinc-700 hover:text-zinc-900 font-medium"
                  }`}
                >
                  <span className="text-sm">{cat.icon}</span>
                  <span>{cat.nameBn}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-zinc-200 px-4 py-3 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 px-2">
            ক্যাটাগরি
          </p>
          <div className="grid grid-cols-2 gap-2">
            {activeCategoryList.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2 rounded-lg text-sm text-zinc-700 hover:bg-zinc-100"
              >
                <span>{cat.icon}</span>
                <span>{cat.nameBn}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
