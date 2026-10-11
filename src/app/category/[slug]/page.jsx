import React from "react";
import Link from "next/link";
import { getCategoryBySlug, getProductsByCategory } from "@/lib/api";
import CategoryView from "@/components/CategoryView";
import { ArrowLeft, PackageOpen } from "lucide-react";

export const instant = false;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  return {
    title: category
      ? `${category.nameBn} - বাজার দর`
      : "ক্যাটাগরি পাওয়া যায়নি - বাজার দর",
    description: `বাজার দর - ${category?.nameBn || "ক্যাটাগরি"} এর আজকের নির্ভরযোগ্য বাজার দর ও পণ্যের তালিকা।`,
  };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const [category, products] = await Promise.all([
    getCategoryBySlug(slug),
    getProductsByCategory(slug),
  ]);

  // Empty state
  if (!category && (!products || products.length === 0)) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-3xl border border-zinc-200/80 p-8 sm:p-12 shadow-none max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-5">
            <PackageOpen className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 mb-2">
            এই ক্যাটাগরিতে কোনো পণ্য নেই
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mb-6">
            দুঃখিত, অনুরোধকৃত ক্যাটাগরিটি খুঁজে পাওয়া যায়নি অথবা বর্তমানে কোনো পণ্য তালিকাভুক্ত নেই।
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0e874b] hover:bg-[#0c733f] text-white font-semibold text-xs sm:text-sm transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            হোম পেজে ফিরে যান
          </Link>
        </div>
      </div>
    );
  }

  const categoryData = category || {
    nameBn: products[0]?.categoryNameBn || slug,
    icon: products[0]?.categoryIcon || "🛒",
    slug,
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <CategoryView
        category={categoryData}
        initialProducts={products || []}
      />
    </div>
  );
}
