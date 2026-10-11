"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, updateUser } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { ArrowLeft, Loader2, Save } from "lucide-react";

export default function EditProfilePage() {
  const router = useRouter();
  const sessionRes = useSession();
  const session = sessionRes?.data?.user;
  const isPending = sessionRes?.isPending;

  const [name, setName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      toast.error("তথ্য পরিবর্তন করতে অনুগ্রহ করে সাইন ইন করুন");
      router.push("/signin?callbackUrl=/profile/edit");
    } else if (session?.name) {
      setName(session.name);
    }
  }, [session, isPending, router]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("নাম প্রদান করুন");
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
        toast.success("প্রোফাইল তথ্য সফলভাবে আপডেট হয়েছে!");
        router.push("/profile");
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
      <div className="max-w-xl mx-auto px-4 py-12 space-y-6 animate-pulse">
        <div className="h-6 w-36 bg-zinc-200 rounded"></div>
        <div className="bg-white rounded-3xl border border-zinc-200/80 p-8 h-64"></div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <div className="mb-6">
        <Link
          href="/profile"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-emerald-700 transition-colors mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          প্রোফাইলে ফিরে যান
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
          তথ্য সংশোধন করুন
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 mt-1">
          আপনার বর্তমান নাম পরিবর্তন বা আপডেট করুন।
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-zinc-200/90 p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleUpdate} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
              নাম
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="আপনার পুরো নাম"
              required
              className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-zinc-900 placeholder:text-zinc-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-500 mb-1.5">
              ইমেইল (পরিবর্তনযোগ্য নয়)
            </label>
            <input
              type="email"
              value={session.email || ""}
              disabled
              className="w-full px-3.5 py-2.5 text-sm bg-zinc-100 border border-zinc-200 rounded-xl text-zinc-500 cursor-not-allowed"
            />
          </div>

          <button
            type="submit"
            disabled={isUpdating}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-sm disabled:opacity-60 cursor-pointer"
          >
            {isUpdating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                তথ্য আপডেট করুন
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
