import React from "react";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";

export default function CategoryLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Category Header Skeleton */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 animate-pulse">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-zinc-200"></div>
          <div className="space-y-2">
            <div className="h-6 w-32 bg-zinc-200 rounded"></div>
            <div className="h-4 w-48 bg-zinc-100 rounded"></div>
          </div>
        </div>
      </div>

      {/* Sort Bar Skeleton */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 p-4 flex items-center justify-between animate-pulse">
        <div className="h-4 w-28 bg-zinc-200 rounded"></div>
        <div className="h-8 w-36 bg-zinc-200 rounded-xl"></div>
      </div>

      {/* Product Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
