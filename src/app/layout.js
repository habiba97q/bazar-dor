import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import PriceTicker from "@/components/PriceTicker";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import { getCategories, getProducts } from "@/lib/api";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "বাজার দর (Bazar Dor) - নিত্যপ্রয়োজনীয় পণ্যের বাজার মূল্য",
  description: "প্রতিদিনের নিত্যপ্রয়োজনীয় পণ্যের নির্ভরযোগ্য বাজার দর, বাজারের তুলনা ও মূল্য পর্যালোচনা এক নজরে।",
};

export default async function RootLayout({ children }) {
  let categories = [];
  let products = [];

  try {
    const [cats, prods] = await Promise.all([
      getCategories(),
      getProducts(),
    ]);
    categories = cats || [];
    products = prods || [];
  } catch (err) {
    console.error("Layout fetch error:", err);
  }

  return (
    <html
      lang="bn"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#f4f6f4] text-zinc-900 selection:bg-emerald-100 selection:text-emerald-900">
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3500,
            style: {
              background: "#18181b",
              color: "#fff",
              borderRadius: "12px",
              padding: "12px 18px",
              fontSize: "14px",
              fontWeight: "500",
            },
            success: {
              iconTheme: {
                primary: "#10b981",
                secondary: "#fff",
              },
            },
            error: {
              iconTheme: {
                primary: "#f43f5e",
                secondary: "#fff",
              },
            },
          }}
        />
        <Suspense fallback={<div className="h-24 bg-white border-b border-zinc-200" />}>
          <Navbar categories={categories} />
        </Suspense>
        <PriceTicker products={products} />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
