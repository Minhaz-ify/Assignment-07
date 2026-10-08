"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { authClient, useSession } from "@/lib/auth-client";

export default function UpdateProfileForm() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (session?.user?.name) setName(session.user.name);
  }, [session]);

  async function onSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return toast.error("নাম খালি রাখা যাবে না");
    setBusy(true);
    const { error } = await authClient.updateUser({ name: name.trim() });
    setBusy(false);
    if (error) return toast.error(error.message || "তথ্য আপডেট করা যায়নি");
    toast.success("তথ্য আপডেট হয়েছে");
    router.push("/profile");
    router.refresh();
  }

  if (isPending)
    return (
      <div className="mx-auto max-w-lg px-4 py-12">
        <div className="skeleton h-56 w-full" />
      </div>
    );

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <div className="rounded-2xl border border-base-300 bg-white p-6 sm:p-8">
        <h1 className="text-2xl font-bold">তথ্য আপডেট করুন</h1>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <label className="form-control">
            <span className="label-text mb-1">নাম</span>
            <input value={name} onChange={(e) => setName(e.target.value)} type="text" className="input input-bordered w-full" />
          </label>
          <div className="flex flex-wrap gap-2">
            <button type="submit" disabled={busy} className="btn btn-primary">
              {busy ? <span className="loading loading-spinner loading-sm" /> : "তথ্য আপডেট করুন"}
            </button>
            <Link href="/profile" className="btn btn-ghost">বাতিল</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
