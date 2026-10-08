"use client";
import { useMarketData } from "./DataProvider";
import { taka } from "@/lib/bn";
import ChangeBadge from "./ChangeBadge";

export default function Ticker() {
  const { loading, products } = useMarketData();

  if (loading) return <div className="skeleton h-9 w-full rounded-none" aria-hidden />;
  if (!products.length) return null;

  const items = products.map((p) => (
    <span key={p.id || p.slug} className="inline-flex items-center gap-2 px-5 text-sm">
      <span aria-hidden>{p.emoji}</span>
      <span className="font-medium">{p.name}</span>
      <span className="text-base-content/70">
        {p.price === null ? "—" : taka(p.price)}/{String(p.unit).replace("প্রতি ", "")}
      </span>
      <ChangeBadge dir={p.dir} change={p.change} />
    </span>
  ));

  return (
    <div className="marquee overflow-hidden border-b border-base-300 bg-[#f3fbf4] py-1.5" role="marquee" aria-label="আজকের দামের তালিকা">
      <div className="marquee-track flex whitespace-nowrap">
        <div className="flex">{items}</div>
        <div className="flex" aria-hidden>{items}</div>
      </div>
    </div>
  );
}
