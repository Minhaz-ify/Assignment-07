import Link from "next/link";
import { taka } from "@/lib/bn";
import ChangeBadge from "./ChangeBadge";

export default function ProductCard({ p }) {
  return (
    <Link
      href={`/product/${encodeURIComponent(p.slug)}`}
      className="group block rounded-2xl border border-base-300 bg-white p-4 transition hover:border-primary hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#f3fbf4] text-2xl" aria-hidden>
          {p.emoji}
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold leading-snug group-hover:text-primary">{p.name}</h3>
          <p className="text-sm text-base-content/60">{p.unit}</p>
        </div>
      </div>
      <div className="mt-4 flex items-end justify-between gap-2 border-t border-base-200 pt-3">
        <div>
          <p className="text-xs text-base-content/60">আজকের দাম</p>
          <p className="text-lg font-bold">{p.price === null ? "—" : taka(p.price)}</p>
        </div>
        <ChangeBadge dir={p.dir} change={p.change} />
      </div>
    </Link>
  );
}
