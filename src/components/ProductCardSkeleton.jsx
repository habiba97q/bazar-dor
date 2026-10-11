import React from "react";

export default function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200/80 p-4 sm:p-5 flex flex-col justify-between animate-pulse">
      <div className="flex items-start gap-3.5 mb-5">
        <div className="w-11 h-11 rounded-xl bg-zinc-200 shrink-0"></div>
        <div className="flex-1 space-y-2 mt-1">
          <div className="h-4 bg-zinc-200 rounded w-3/4"></div>
          <div className="h-3 bg-zinc-100 rounded w-1/3"></div>
        </div>
      </div>
      <div className="flex items-end justify-between pt-3 border-t border-zinc-100">
        <div className="space-y-1.5">
          <div className="h-2.5 bg-zinc-100 rounded w-12"></div>
          <div className="h-4 bg-zinc-200 rounded w-20"></div>
        </div>
        <div className="h-5 bg-zinc-200 rounded w-14"></div>
      </div>
    </div>
  );
}
