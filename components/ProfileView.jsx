"use client";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";

export default function ProfileView() {
  const { data: session, isPending } = useSession();

  if (isPending)
    return (
      <div className="mx-auto max-w-lg px-4 py-12">
        <div className="skeleton h-64 w-full" />
      </div>
    );

  const user = session?.user;
  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <div className="rounded-2xl border border-base-300 bg-white p-6 sm:p-8">
        <h1 className="text-2xl font-bold">👤 আমার প্রোফাইল</h1>
        {user ? (
          <>
            <div className="mt-6 flex items-center gap-4">
              {user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.image} alt="" className="h-16 w-16 rounded-full object-cover" />
              ) : (
                <span className="grid h-16 w-16 place-items-center rounded-full bg-primary text-2xl font-bold text-white">
                  {(user.name || "U").charAt(0).toUpperCase()}
                </span>
              )}
              <div className="min-w-0">
                <p className="truncate text-lg font-semibold">{user.name}</p>
                <p className="truncate text-sm text-base-content/60">{user.email}</p>
              </div>
            </div>
            <Link href="/profile/update" className="btn btn-primary mt-8 w-full sm:w-auto">তথ্য আপডেট করুন</Link>
          </>
        ) : (
          <p className="mt-4 text-base-content/60">প্রোফাইল দেখতে সাইন ইন করুন।</p>
        )}
      </div>
    </div>
  );
}
