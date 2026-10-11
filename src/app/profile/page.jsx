"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut, updateUser } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { LogOut, Loader2, ArrowLeft } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const sessionRes = useSession();
  const session = sessionRes?.data?.user;
  const isPending = sessionRes?.isPending;

  const [name, setName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      toast.error("প্রোফাইল দেখতে অনুগ্রহ করে সাইন ইন করুন");
      router.push("/signin?callbackUrl=/profile");
    } else if (session?.name) {
      setName(session.name);
    }
  }, [session, isPending, router]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("সফলভাবে সাইন আউট হয়েছে");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("সাইন আউট ব্যর্থ হয়েছে");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("নাম খালি হতে পারে না");
      return;
    }

    setIsUpdating(true);
    try {
      const res = await updateUser({
        name: name.trim(),
      });

      if (res?.error) {
        toast.error(res.error.message || "আপডেট ব্যর্থ হয়েছে");
      } else {
        toast.success("নাম সফলভাবে আপডেট করা হয়েছে!");
        router.refresh();
      }
    } catch (err) {
      toast.error(err.message || "আপডেট করতে সমস্যা হয়েছে");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isPending || !session) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 space-y-5 animate-pulse">
        <div className="h-6 w-36 bg-zinc-200 rounded"></div>
        <div className="h-4 w-52 bg-zinc-100 rounded"></div>
        <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 h-28"></div>
        <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 h-40"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Profile Header */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
          আমার প্রোফাইল
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          আপনার অ্যাকাউন্টের তথ্য এখান দেখুন।
        </p>
      </div>

      {/* User Card */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 sm:p-6 flex items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden shrink-0">
            <img
              src={session.image || "/avatar-rezwan.png"}
              alt={session.name || "Rezwan Ahmed"}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-zinc-900">
              {session.name || "Rezwan Ahmed"}
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              {session.email || "rezwanahmed@gmail.com"}
            </p>
          </div>
        </div>

        <div>
          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#ef4444] text-[#ef4444] hover:bg-rose-50 text-xs font-medium transition-colors cursor-pointer"
          >
            <span>↩</span>
            <span>সাইন আউট</span>
          </button>
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 sm:p-6">
        <h3 className="text-xs sm:text-sm font-bold text-zinc-900 mb-3.5">
          তথ্য
        </h3>

        <form onSubmit={handleUpdate} className="space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">
              নাম
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="আপনার নাম লিখুন"
              required
              className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0e874b] transition-all text-zinc-900 placeholder:text-zinc-400"
            />
          </div>

          <button
            type="submit"
            disabled={isUpdating}
            className="w-full flex items-center justify-center py-2 px-4 rounded-lg text-xs font-semibold text-white bg-[#0e874b] hover:bg-[#0c733f] active:scale-[0.99] transition-all disabled:opacity-60 cursor-pointer"
          >
            {isUpdating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              "আপডেট"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
