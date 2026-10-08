"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { signIn } from "@/lib/auth-client";
import SocialButtons from "./SocialButtons";

export default function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/";
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const toasted = useRef(false);

  useEffect(() => {
    if (toasted.current) return;
    if (params.get("reason") === "protected") {
      toasted.current = true;
      toast.error("এই পাতা দেখতে আগে সাইন ইন করুন");
    } else if (params.get("registered")) {
      toasted.current = true;
      toast.success("অ্যাকাউন্ট তৈরি হয়েছে। এখন সাইন ইন করুন");
    }
  }, [params]);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "").trim();
    const password = String(fd.get("password") || "");
    if (!email || !password) {
      const m = "ইমেইল ও পাসওয়ার্ড দিন";
      setError(m);
      toast.error(m);
      return;
    }
    setBusy(true);
    const { error: err } = await signIn.email({ email, password });
    setBusy(false);
    if (err) {
      const m = "ইমেইল বা পাসওয়ার্ড সঠিক নয়";
      setError(m);
      toast.error(m);
      return;
    }
    toast.success("সফলভাবে সাইন ইন হয়েছে");
    router.push(redirect);
    router.refresh();
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-12">
      <div className="rounded-2xl border border-base-300 bg-white p-6 sm:p-8">
        <h1 className="text-2xl font-bold">সাইন ইন</h1>
        <p className="mt-1 text-sm text-base-content/60">আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
          <label className="form-control">
            <span className="label-text mb-1">ইমেইল</span>
            <input name="email" type="email" placeholder="you@example.com" autoComplete="email" className="input input-bordered w-full" />
          </label>
          <label className="form-control">
            <span className="label-text mb-1">পাসওয়ার্ড</span>
            <input name="password" type="password" autoComplete="current-password" className="input input-bordered w-full" />
          </label>
          {error && <p role="alert" className="text-sm text-error">{error}</p>}
          <button type="submit" disabled={busy} className="btn btn-primary w-full">
            {busy ? <span className="loading loading-spinner loading-sm" /> : "সাইন ইন"}
          </button>
        </form>

        <div className="divider text-sm text-base-content/50">অথবা</div>
        <SocialButtons callbackURL={redirect} />

        <p className="mt-6 text-center text-sm">
          অ্যাকাউন্ট নেই? <Link href="/signup" className="font-semibold text-primary hover:underline">সাইন আপ করুন</Link>
        </p>
      </div>
    </div>
  );
}
