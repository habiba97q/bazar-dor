import React from "react";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/api";
import { toBengaliNumber } from "@/lib/utils";

export default async function HomePage() {
  const products = await getProducts();

  // Top 6 risers (dir === "up", sorted by change percentage descending)
  const risers = [...products]
    .filter((p) => p.change?.dir === "up")
    .sort((a, b) => (b.change?.pct || 0) - (a.change?.pct || 0))
    .slice(0, 6);

  // Top 6 fallers (dir === "down", sorted by change percentage descending)
  const fallers = [...products]
    .filter((p) => p.change?.dir === "down")
    .sort((a, b) => (b.change?.pct || 0) - (a.change?.pct || 0))
    .slice(0, 6);

  const totalBengaliCount = toBengaliNumber(products.length);

  return (
    <div className="w-full pb-16 sm:pb-24">
      {/* Hero Banner with CTA smooth scroll to #সব-পণ্য */}
      <Hero />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10 sm:space-y-14 mt-4">
        {/* Section A — আজ দাম বেড়েছে ▲ */}
        {risers.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[#ef4444] text-xs">▲</span>
              <h2 className="text-base sm:text-lg font-bold text-zinc-900">
                আজ দাম বেড়েছে
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {risers.map((product) => (
                <ProductCard key={`riser-${product.id}`} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* Section B — আজ দাম কমেছে ▼ */}
        {fallers.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[#16a34a] text-xs">▼</span>
              <h2 className="text-base sm:text-lg font-bold text-zinc-900">
                আজ দাম কমেছে
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {fallers.map((product) => (
                <ProductCard key={`faller-${product.id}`} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* Section C — সব পণ্য */}
        <section id="সব-পণ্য" className="scroll-mt-28">
          <div className="mb-5">
            <h2 className="text-lg sm:text-xl font-bold text-zinc-900">
              সব পণ্য
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              মোট {totalBengaliCount}টি পণ্যের আজকের দাম
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {products.map((product) => (
              <ProductCard key={`all-${product.id}`} product={product} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
