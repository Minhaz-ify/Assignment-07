"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { signUp } from "@/lib/auth-client";
import SocialButtons from "./SocialButtons";

export default function SignUpForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const password = String(fd.get("password") || "");

    const fail = (m) => {
      setError(m);
      toast.error(m);
    };
    if (!name) return fail("আপনার নাম দিন");
    if (!email) return fail("ইমেইল দিন");
    if (password.length < 8) return fail("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে");

    setBusy(true);
    const { error: err } = await signUp.email({ name, email, password });
    setBusy(false);
    if (err) return fail(err.message || "অ্যাকাউন্ট তৈরি করা যায়নি");

    toast.success("অ্যাকাউন্ট তৈরি হয়েছে। এখন সাইন ইন করুন");
    router.push("/signin?registered=1");
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-12">
      <div className="rounded-2xl border border-base-300 bg-white p-6 sm:p-8">
        <h1 className="text-2xl font-bold">অ্যাকাউন্ট তৈরি করুন</h1>
        <p className="mt-1 text-sm text-base-content/60">বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
          <label className="form-control">
            <span className="label-text mb-1">নাম</span>
            <input name="name" type="text" placeholder="যেমন: রহিম উদ্দিন" autoComplete="name" className="input input-bordered w-full" />
          </label>
          <label className="form-control">
            <span className="label-text mb-1">ইমেইল</span>
            <input name="email" type="email" placeholder="you@example.com" autoComplete="email" className="input input-bordered w-full" />
          </label>
          <label className="form-control">
            <span className="label-text mb-1">পাসওয়ার্ড</span>
            <input name="password" type="password" placeholder="কমপক্ষে ৮ অক্ষর" autoComplete="new-password" className="input input-bordered w-full" />
          </label>
          {error && <p role="alert" className="text-sm text-error">{error}</p>}
          <button type="submit" disabled={busy} className="btn btn-primary w-full">
            {busy ? <span className="loading loading-spinner loading-sm" /> : "অ্যাকাউন্ট তৈরি করুন"}
          </button>
        </form>

        <div className="divider text-sm text-base-content/50">অথবা</div>
        <SocialButtons callbackURL="/" />

        <p className="mt-6 text-center text-sm">
          অ্যাকাউন্ট আছে? <Link href="/signin" className="font-semibold text-primary hover:underline">সাইন ইন করুন</Link>
        </p>
      </div>
    </div>
  );
}
