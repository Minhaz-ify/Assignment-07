"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useMarketData } from "./DataProvider";
import { useSession, signOut } from "@/lib/auth-client";
import { banglaDate } from "@/lib/bn";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { categories, loading } = useMarketData();
  const { data: session, isPending } = useSession();
  const [date, setDate] = useState("");

  useEffect(() => setDate(banglaDate()), []);

  const linkCls = (active) =>
    `whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition ${
      active ? "bg-primary text-white" : "text-base-content/70 hover:bg-base-200"
    }`;

  async function handleSignOut() {
    await signOut();
    toast.success("সফলভাবে সাইন আউট হয়েছে");
    router.push("/");
    router.refresh();
  }

  return (
    <header className="border-b border-base-300 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/logo-icon.png" alt="" width={28} height={28} priority />
          <span className="leading-tight">
            <span className="block text-xl font-bold text-primary">🛒 বাজার দর</span>
            <span className="block text-xs text-base-content/60 min-h-4">{date}</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {isPending ? (
            <div className="skeleton h-8 w-28 rounded-full" />
          ) : session ? (
            <div className="dropdown dropdown-end">
              <button tabIndex={0} className="btn btn-sm sm:btn-md btn-ghost gap-2" aria-label="প্রোফাইল মেনু">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-sm font-bold text-white">
                  {(session.user.name || "U").charAt(0).toUpperCase()}
                </span>
                <span className="hidden max-w-28 truncate sm:inline">{session.user.name}</span>
              </button>
              <ul tabIndex={0} className="menu dropdown-content z-30 mt-2 w-48 rounded-box border border-base-300 bg-white p-2 shadow">
                <li><Link href="/profile">👤 আমার প্রোফাইল</Link></li>
                <li><button onClick={handleSignOut}>↩ সাইন আউট</button></li>
              </ul>
            </div>
          ) : (
            <>
              <Link href="/signin" className="btn btn-sm sm:btn-md btn-outline btn-primary">সাইন ইন</Link>
              <Link href="/signup" className="btn btn-sm sm:btn-md btn-primary">সাইন আপ</Link>
            </>
          )}
        </div>
      </div>

      <nav className="mx-auto max-w-6xl px-4 pb-3" aria-label="বিভাগ">
        <ul className="no-scrollbar flex items-center gap-1.5 overflow-x-auto">
          <li><Link href="/" className={linkCls(pathname === "/")}>হোম</Link></li>
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <li key={i}><div className="skeleton h-8 w-16 rounded-full" /></li>
              ))
            : categories.map((c) => (
                <li key={c.id}>
                  <Link href={`/category/${encodeURIComponent(c.id)}`} className={linkCls(pathname === `/category/${c.id}`)}>
                    {c.name}
                  </Link>
                </li>
              ))}
        </ul>
      </nav>
    </header>
  );
}
