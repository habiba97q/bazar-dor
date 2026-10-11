import React from "react";
import Link from "next/link";
import { toBengaliNumber, formatUnit, formatPrice } from "@/lib/utils";

export default function ProductCard({ product }) {
  if (!product) return null;

  const isUp = product.change?.dir === "up";
  const isDown = product.change?.dir === "down";
  const pct = product.change?.pct !== undefined ? toBengaliNumber(product.change.pct) : "০.০";
  const formattedUnit = formatUnit(product.unit);
  const formattedPrice = formatPrice(product.today);

  return (
    <Link
      href={`/product/${product.slug || product.id}`}
      className="group block bg-white rounded-2xl border border-zinc-200/80 p-4 sm:p-5 hover:border-zinc-300 hover:shadow-sm transition-all duration-200 flex flex-col justify-between"
    >
      {/* Top Section: Icon & Name */}
      <div className="flex items-start gap-3.5 mb-4">
        <div className="w-11 h-11 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
          {product.image || "⚪"}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-zinc-900 text-sm sm:text-base tracking-tight truncate group-hover:text-[#0e874b] transition-colors">
            {product.nameBn}
          </h3>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            {formattedUnit}
          </p>
        </div>
      </div>

      {/* Price & Change */}
      <div className="flex items-end justify-between mt-auto pt-1">
        <div>
          <span className="text-[10px] text-zinc-400 font-medium block">
            আজকের দাম
          </span>
          <span className="text-base sm:text-lg font-extrabold text-zinc-900">
            {formattedPrice}
          </span>
        </div>

        <div>
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold ${
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
    </Link>
  );
}
