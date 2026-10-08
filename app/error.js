"use client";

export default function Error({ reset }) {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <h1 className="text-2xl font-bold">কিছু একটা সমস্যা হয়েছে</h1>
      <p className="mt-2 text-base-content/70">তথ্য লোড করা যায়নি। একটু পরে আবার চেষ্টা করুন।</p>
      <button onClick={reset} className="btn btn-primary mt-6">আবার চেষ্টা করুন</button>
    </div>
  );
}
