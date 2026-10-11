"use client";

import React from "react";
import Link from "next/link";
import { toBengaliNumber } from "@/lib/utils";

export default function PriceTicker({ products = [] }) {
  if (!products || products.length === 0) return null;

  // Duplicate list to achieve seamless infinite looping
  const tickerItems = [...products, ...products];

  return (
    <div className="w-full bg-white border-y border-zinc-200/70 overflow-hidden relative select-none py-2">
      <div className="flex animate-marquee whitespace-nowrap items-center">
        {tickerItems.map((item, index) => {
          const isUp = item.change?.dir === "up";
          const isDown = item.change?.dir === "down";
          const pct = item.change?.pct ? toBengaliNumber(item.change.pct) : "০.০";
          const todayPrice = toBengaliNumber(item.today);
          const unit = item.unit === "kg" ? "কেজি" : item.unit === "litre" ? "লিটার" : item.unit;

          return (
            <Link
              key={`${item.id}-${index}`}
              href={`/product/${item.slug || item.id}`}
              className="inline-flex items-center gap-2 mx-5 text-xs text-zinc-700 hover:text-[#0e874b] transition-colors cursor-pointer"
            >
              <span className="text-sm">{item.image || "⚪"}</span>
              <span className="font-medium text-zinc-800">{item.nameBn}</span>
              <span className="text-zinc-600">
                {todayPrice} টাকা/{unit}
              </span>
              <span
                className={`inline-flex items-center gap-0.5 font-bold text-xs ${
                  isUp
                    ? "text-[#ef4444]"
                    : isDown
                    ? "text-[#16a34a]"
                    : "text-zinc-500"
                }`}
              >
                {isUp ? "▲" : isDown ? "▼" : "—"} {pct}%
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
