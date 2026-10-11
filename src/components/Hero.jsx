"use client";

import React, { useState, useEffect } from "react";
import { getBengaliDate } from "@/lib/utils";

export default function Hero() {
  const currentDate = "মঙ্গলবার, ৬ অক্টোবর, ২০২৬";

  return (
    <section className="w-full py-6 sm:py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-10 lg:p-12 flex flex-col md:flex-row items-center justify-between gap-8 sm:gap-12 relative overflow-hidden shadow-none">
          
          {/* Left Text Content */}
          <div className="flex-1 max-w-xl text-center md:text-left">
            {/* Date badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ecfdf5] text-[#0e874b] text-xs font-semibold mb-4 border border-[#a7f3d0]/60">
              <span>{currentDate}</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-zinc-900 tracking-tight leading-[1.25] mb-4">
              আজকের বাজারের দাম এক নজরে
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed mb-6 max-w-lg">
              চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।
            </p>

            {/* Primary CTA */}
            <div>
              <a
                href="#সব-পণ্য"
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-[#0e874b] hover:bg-[#0c733f] active:scale-95 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all cursor-pointer"
              >
                সব পণ্য দেখুন
              </a>
            </div>
          </div>

          {/* Right Hero Illustration: Basket */}
          <div className="w-full max-w-[260px] sm:max-w-[320px] flex items-center justify-center relative">
            <img
              src="/bazar-hero.png"
              alt="বাজার দর ফলমূল ও সবজির ঝুড়ি"
              className="w-full h-auto drop-shadow-sm object-contain max-h-[240px]"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
