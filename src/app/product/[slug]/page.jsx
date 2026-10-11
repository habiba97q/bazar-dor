import React from "react";
import { getProductByIdOrSlug } from "@/lib/api";
import ProductDetailsView from "@/components/ProductDetailsView";

export const instant = false;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProductByIdOrSlug(slug);
  return {
    title: product
      ? `${product.nameBn} - বাজার দর`
      : "পণ্য বিবরণ - বাজার দর",
    description: product
      ? `${product.nameBn} এর আজকের বাজার দর ও বাজারভিত্তিক বিস্তারিত দাম।`
      : "বাজার দর পণ্যের বিস্তারিত বিবরণ।",
  };
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const product = await getProductByIdOrSlug(slug);

  return (
    <div className="w-full">
      <ProductDetailsView product={product} />
    </div>
  );
}
