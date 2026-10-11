"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("অনুগ্রহ করে ইমেইল এবং পাসওয়ার্ড প্রদান করুন");
      return;
    }

    setIsLoading(true);
    try {
      const res = await signIn.email({
        email,
        password,
      });

      if (res.error) {
        toast.error(res.error.message || "ইমেইল বা পাসওয়ার্ড ভুল হয়েছে");
      } else {
        toast.success("সফলভাবে সাইন ইন হয়েছে!");
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      toast.error(err.message || "সাইন ইন করতে সমস্যা হয়েছে");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignIn = async (provider) => {
    try {
      await signIn.social({
        provider,
        callbackURL: callbackUrl,
      });
    } catch (err) {
      toast.error(`${provider} দিয়ে সাইন ইন করতে সমস্যা হয়েছে`);
    }
  };

  return (
    <div className="min-h-[78vh] flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-[420px]">
        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
            সাইন ইন
          </h1>
          <p className="text-xs text-zinc-500 mt-1.5">
            বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                ইমেইল
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0e874b] transition-all text-zinc-900 placeholder:text-zinc-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                পাসওয়ার্ড
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="কমপক্ষে ৮ অক্ষর"
                required
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0e874b] transition-all text-zinc-900 placeholder:text-zinc-400"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center py-2.5 px-4 rounded-lg text-sm font-semibold text-white bg-[#0e874b] hover:bg-[#0c733f] active:scale-[0.99] transition-all shadow-[0_4px_12px_rgba(14,135,75,0.2)] disabled:opacity-60 cursor-pointer mt-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "সাইন ইন"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-2.5 text-zinc-400 text-xs">অথবা</span>
            </div>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleSocialSignIn("google")}
              className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-[11px] font-medium text-zinc-700 transition-colors cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span className="truncate">Google দিয়ে চালিয়ে যান</span>
            </button>

            <button
              type="button"
              onClick={() => handleSocialSignIn("github")}
              className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-[11px] font-medium text-zinc-700 transition-colors cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 fill-zinc-900 shrink-0" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span className="truncate">GitHub দিয়ে চালিয়ে যান</span>
            </button>
          </div>

          {/* Link to Register */}
          <div className="mt-5 text-center text-xs text-zinc-500">
            অ্যাকাউন্ট নেই?{" "}
            <Link
              href="/signup"
              className="text-[#0e874b] hover:text-[#0c733f] font-semibold"
            >
              সাইন আপ করুন
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-xs text-zinc-400 hover:text-zinc-600 transition-colors"
          >
            — হোম পেজে ফিরে যান
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[78vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#0e874b]" />
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  );
}
