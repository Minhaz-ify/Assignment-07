import Image from "next/image";

export default function Hero({ total, dateText }) {
  return (
    <section className="bg-gradient-to-b from-[#f3fbf4] to-[#fafcfa]">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-10 md:grid-cols-2 md:py-16">
        <div>
          <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm text-base-content/70 ring-1 ring-base-300">
            <span aria-hidden>🟢</span> আপডেট {dateText}
          </p>
          <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">আজকের বাজারের দাম এক নজরে</h1>
          <p className="mt-4 max-w-prose text-base text-base-content/70 sm:text-lg">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।
          </p>
          <a href="#সব-পণ্য" className="btn btn-primary mt-6 btn-sm sm:btn-md">
            সব পণ্য দেখুন
          </a>
        </div>
        <div className="flex justify-center md:justify-end">
          <Image src="/bazar-hero.png" alt="ফল ও সবজির ঝুড়ি" width={420} height={380} priority className="h-auto w-full max-w-sm" />
        </div>
      </div>
    </section>
  );
}
