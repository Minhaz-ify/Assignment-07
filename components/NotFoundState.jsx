import Link from "next/link";

export default function NotFoundState({ title = "পাতাটি খুঁজে পাওয়া যায়নি", text = "আপনি যে পাতা খুঁজছেন তা নেই বা সরিয়ে ফেলা হয়েছে।" }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
      <p className="text-6xl font-bold text-primary">৪০৪</p>
      <h1 className="mt-3 text-2xl font-bold">{title}</h1>
      <p className="mt-2 text-base-content/70">{text}</p>
      <Link href="/" className="btn btn-primary mt-6">← হোম পেজে ফিরে যান</Link>
    </div>
  );
}
