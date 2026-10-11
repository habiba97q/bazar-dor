"use client";

import React, { useState, useMemo } from "react";
import ProductCard from "@/components/ProductCard";
import { ChevronDown } from "lucide-react";
import { toBengaliNumber } from "@/lib/utils";

export default function CategoryView({ category, initialProducts = [] }) {
  const [sortBy, setSortBy] = useState("default");

  const sortedProducts = useMemo(() => {
    const list = [...initialProducts];
    if (sortBy === "low-to-high") {
      return list.sort((a, b) => (Number(a.today) || 0) - (Number(b.today) || 0));
    }
    if (sortBy === "high-to-low") {
      return list.sort((a, b) => (Number(b.today) || 0) - (Number(a.today) || 0));
    }
    return list;
  }, [initialProducts, sortBy]);

  const countBn = toBengaliNumber(sortedProducts.length);

  return (
    <div className="space-y-4">
      {/* Category Header */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-2xl shrink-0">
            {category?.icon || "🍚"}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
              {category?.nameBn || "ক্যাটাগরি"}
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              {countBn}টি পণ্যের আজকের দাম ও পরিবর্তন
            </p>
          </div>
        </div>
      </div>

      {/* Sort Options */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 p-3 flex justify-end items-center">
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500 font-medium">
            সাজান
          </span>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-800 text-xs font-medium rounded-lg px-3 py-1.5 pr-7 focus:outline-none focus:ring-1 focus:ring-[#0e874b] transition-all cursor-pointer"
            >
              <option value="default">ডিফল্ট</option>
              <option value="low-to-high">দাম: কম থেকে বেশি</option>
              <option value="high-to-low">দাম: বেশি থেকে কম</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Product count */}
      <div className="text-xs text-zinc-500 font-medium py-1">
        মোট {countBn}টি পণ্য দেখানো হচ্ছে
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {sortedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
