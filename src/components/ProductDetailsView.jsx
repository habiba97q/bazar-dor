"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { toBengaliNumber, formatUnit, formatPrice } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

export default function ProductDetailsView({ product }) {
  const router = useRouter();
  const sessionRes = useSession();
  const session = sessionRes?.data?.user;
  const isPending = sessionRes?.isPending;

  useEffect(() => {
    if (!isPending && !session) {
      toast.error("পণ্য বিবরণ দেখতে অনুগ্রহ করে সাইন ইন করুন");
      router.push(`/signin?callbackUrl=/product/${product?.slug || product?.id}`);
    }
  }, [session, isPending, router, product]);

  if (isPending || !session) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-pulse">
        <div className="h-4 w-40 bg-zinc-200 rounded"></div>
        <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 h-40"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 h-28"></div>
          <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 h-28"></div>
          <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 h-28"></div>
        </div>
        <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 h-64"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-3xl border border-zinc-200/80 p-8 shadow-none">
          <h2 className="text-xl font-bold text-zinc-900 mb-2">পণ্যটি পাওয়া যায়নি</h2>
          <p className="text-xs sm:text-sm text-zinc-500 mb-6">অনুরোধকৃত পণ্যের কোনো তথ্য খুঁজে পাওয়া যায়নি।</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0e874b] text-white text-xs sm:text-sm font-semibold hover:bg-[#0c733f] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            হোম পেজে ফিরে যান
          </Link>
        </div>
      </div>
    );
  }

  // Calculate market stats
  const markets = product.markets || [];
  let minPrice = product.today;
  let maxPrice = product.today;

  if (markets.length > 0) {
    minPrice = Math.min(...markets.map((m) => m.min));
    maxPrice = Math.max(...markets.map((m) => m.max));
  }

  // Sort markets by average price
  const sortedMarkets = [...markets].sort((a, b) => {
    const avgA = (a.min + a.max) / 2;
    const avgB = (b.min + b.max) / 2;
    return avgA - avgB;
  });

  const avgPrice = product.today;

  // Price difference vs yesterday
  const diff = (product.today || 0) - (product.yesterday || product.today);
  let diffText = "গতকালের তুলনায় আজ দাম অপরিবর্তিত";
  if (diff > 0) {
    diffText = `গতকালের তুলনায় আজ দাম বেড়েছে - ${toBengaliNumber(diff)} টাকা`;
  } else if (diff < 0) {
    diffText = `গতকালের তুলনায় আজ দাম কমেছে - ${toBengaliNumber(Math.abs(diff))} টাকা`;
  }

  const isUp = product.change?.dir === "up";
  const isDown = product.change?.dir === "down";
  const pct = product.change?.pct !== undefined ? toBengaliNumber(product.change.pct) : "০.০";
  const unit = product.unit === "kg" ? "কেজি" : product.unit === "litre" ? "লিটার" : product.unit;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-zinc-400">
        <Link href="/" className="hover:text-[#0e874b] transition-colors">
          হোম
        </Link>
        <span>&gt;</span>
        <Link
          href={`/category/${product.category}`}
          className="hover:text-[#0e874b] transition-colors"
        >
          {product.categoryNameBn || "ক্যাটাগরি"}
        </Link>
        <span>&gt;</span>
        <span className="text-zinc-700 font-medium truncate max-w-[200px] sm:max-w-none">
          {product.nameBn}
        </span>
      </nav>

      {/* Product Summary */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-3xl shrink-0">
            {product.image || "🍚"}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
              {product.nameBn}
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              {formatUnit(product.unit)} • {product.categoryNameBn}
            </p>
            <p className="text-xs text-zinc-600 mt-2 font-medium">
              {diffText}
            </p>
          </div>
        </div>

        {/* Right side Price Box */}
        <div className="bg-[#f8faf8] border border-zinc-200/70 rounded-2xl p-4 text-center w-full sm:w-auto min-w-[130px]">
          <span className="text-[10px] text-zinc-400 font-medium block">
            আজকের দাম
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight my-0.5">
            {toBengaliNumber(product.today)}
          </div>
          <div className="text-[11px] text-zinc-400 font-medium mb-1.5">
            টাকা / {unit}
          </div>
          <div>
            <span
              className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[11px] font-bold ${
                isUp
                  ? "text-[#ef4444] bg-[#fef2f2]"
                  : isDown
                  ? "text-[#16a34a] bg-[#f0fdf4]"
                  : "text-zinc-500 bg-zinc-100"
              }`}
            >
              {isUp ? "▲" : isDown ? "▼" : "—"} {pct}%
            </span>
          </div>
        </div>
      </div>

      {/* Price Summary */}
      <section>
        <h2 className="text-sm sm:text-base font-bold text-zinc-900 mb-3">
          দামের সারসংক্ষেপ
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* সর্বনিম্ন দাম */}
          <div className="bg-white rounded-2xl border border-zinc-200/80 p-5">
            <span className="text-[10px] text-zinc-400 font-medium block mb-1">
              সর্বনিম্ন দাম
            </span>
            <div className="text-xl sm:text-2xl font-bold text-[#0e874b]">
              {formatPrice(minPrice)}
            </div>
            <p className="text-[10px] text-zinc-400 mt-1">
              সবচেয়ে কম দামের বাজার
            </p>
          </div>

          {/* সর্বাধিক দাম */}
          <div className="bg-white rounded-2xl border border-zinc-200/80 p-5">
            <span className="text-[10px] text-zinc-400 font-medium block mb-1">
              সর্বাধিক দাম
            </span>
            <div className="text-xl sm:text-2xl font-bold text-[#ef4444]">
              {formatPrice(maxPrice)}
            </div>
            <p className="text-[10px] text-zinc-400 mt-1">
              সবচেয়ে বেশি দামের বাজার
            </p>
          </div>

          {/* গড় দাম */}
          <div className="bg-white rounded-2xl border border-zinc-200/80 p-5">
            <span className="text-[10px] text-zinc-400 font-medium block mb-1">
              গড় দাম
            </span>
            <div className="text-xl sm:text-2xl font-bold text-[#0e874b]">
              {formatPrice(avgPrice)}
            </div>
            <p className="text-[10px] text-zinc-400 mt-1">
              প্রতি {unit}-এর হিসাবে
            </p>
          </div>
        </div>
      </section>

      {/* Market Breakdown */}
      {sortedMarkets.length > 0 && (
        <section>
          <h2 className="text-sm sm:text-base font-bold text-zinc-900 mb-3">
            বাজারভিত্তিক আজকের দাম
          </h2>
          <div className="bg-white rounded-2xl border border-zinc-200/80 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-100 bg-white text-zinc-400 font-medium">
                    <th className="py-3 px-4 sm:px-6">বাজার</th>
                    <th className="py-3 px-4 sm:px-6">বিভাগ</th>
                    <th className="py-3 px-4 sm:px-6">সর্বনিম্ন</th>
                    <th className="py-3 px-4 sm:px-6">সর্বাধিক</th>
                    <th className="py-3 px-4 sm:px-6">গড়</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {sortedMarkets.map((m, idx) => {
                    const rowAvg = (m.min + m.max) / 2;
                    return (
                      <tr
                        key={idx}
                        className="hover:bg-zinc-50/60 transition-colors"
                      >
                        <td className="py-3 px-4 sm:px-6 font-medium text-zinc-900">
                          {m.market}
                        </td>
                        <td className="py-3 px-4 sm:px-6 text-zinc-500">
                          {m.division}
                        </td>
                        <td className="py-3 px-4 sm:px-6 text-zinc-700">
                          {formatPrice(m.min)}
                        </td>
                        <td className="py-3 px-4 sm:px-6 text-zinc-700">
                          {formatPrice(m.max)}
                        </td>
                        <td className="py-3 px-4 sm:px-6 font-bold text-zinc-900">
                          {formatPrice(rowAvg)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
