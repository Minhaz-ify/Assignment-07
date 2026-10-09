import { notFound } from "next/navigation";
import Link from "next/link";
import { fetchUpstream } from "@/lib/api";
import { extractList, extractOne, normalizeProduct } from "@/lib/normalize";
import { taka, toBn } from "@/lib/bn";
import ChangeBadge from "@/components/ChangeBadge";

async function getProduct(slug) {
  let one = null;
  try {
    one = extractOne(await fetchUpstream(`/products/${encodeURIComponent(slug)}`));
  } catch {}
  if (one && Object.keys(one).length) return normalizeProduct(one);

  // fallback: look it up in the full list by id / slug
  try {
    const all = extractList(await fetchUpstream("/products")).map(normalizeProduct);
    return all.find((p) => p.slug === slug || p.id === slug) ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const p = await getProduct(decodeURIComponent(slug));
  return { title: p ? `${p.name} — বাজার দর` : "পণ্য — বাজার দর" };
}

function Stat({ label, value, tone }) {
  const tones = { min: "text-[#1a9951]", avg: "text-base-content", max: "text-[#d03739]" };
  return (
    <div className="rounded-2xl border border-base-300 bg-white p-4">
      <p className="text-sm text-base-content/60">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${tones[tone]}`}>{value === null ? "—" : taka(value)}</p>
    </div>
  );
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const p = await getProduct(decodeURIComponent(slug));
  if (!p) notFound();

  const priced = p.markets.filter((m) => m.price !== null);
  const cheapest = priced.length ? priced.reduce((a, b) => (b.price < a.price ? b : a)) : null;
  const costliest = priced.length ? priced.reduce((a, b) => (b.price > a.price ? b : a)) : null;
  const maxPrice = p.max ?? costliest?.max ?? 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link href="/" className="text-sm text-primary hover:underline">← হোম পেজে ফিরে যান</Link>

      {/* Summary */}
      <section className="mt-4 rounded-2xl border border-base-300 bg-white p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-[#f3fbf4] text-5xl" aria-hidden>{p.emoji}</div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold sm:text-3xl">{p.name}</h1>
            {p.description && <p className="mt-1 text-base-content/70">{p.description}</p>}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {p.tags.map((t) => (
                <span key={t} className="badge badge-outline badge-primary">{t}</span>
              ))}
              <span className="badge bg-base-200 border-0">{p.unit}</span>
            </div>
          </div>
          <div className="sm:text-right">
            <p className="text-sm text-base-content/60">আজকের দাম</p>
            <p className="text-3xl font-bold">{p.price === null ? "—" : taka(p.price)}</p>
            <ChangeBadge dir={p.dir} change={p.change} className="mt-1" />
          </div>
        </div>
      </section>

      {/* Price summary */}
      <section className="mt-6">
        <h2 className="mb-3 text-xl font-bold">দামের সারসংক্ষেপ</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Stat label="সর্বনিম্ন দাম" value={p.min} tone="min" />
          <Stat label="গড় দাম" value={p.avg} tone="avg" />
          <Stat label="সর্বাধিক দাম" value={p.max} tone="max" />
        </div>
        {p.unit && <p className="mt-2 text-sm text-base-content/60">{p.unit}-এর হিসাবে</p>}
      </section>

      {/* Market wise */}
      <section className="mt-8">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold">বাজারভিত্তিক আজকের দাম</h2>
            <p className="text-sm text-base-content/60">{toBn(p.markets.length)}টি বাজার অন্তর্ভুক্ত</p>
          </div>
          {cheapest && costliest && (
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="rounded-full bg-[#f3fbf4] px-3 py-1 text-[#1a9951]">সবচেয়ে কম দামের বাজার: <b>{cheapest.name}</b></span>
              <span className="rounded-full bg-[#fdf1f1] px-3 py-1 text-[#d03739]">সবচেয়ে বেশি দামের বাজার: <b>{costliest.name}</b></span>
            </div>
          )}
        </div>

        {p.markets.length === 0 ? (
          <p className="rounded-2xl border border-base-300 bg-white p-6 text-base-content/60">এই পণ্যের বাজারভিত্তিক তথ্য এখনো পাওয়া যায়নি।</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-base-300 bg-white">
            <table className="table">
              <thead>
                <tr className="text-base-content/60">
                  <th>বাজার</th>
                  <th>সর্বনিম্ন</th>
                  <th>সর্বাধিক</th>
                  <th className="min-w-40">গড়</th>
                </tr>
              </thead>
              <tbody>
                {p.markets.map((m, i) => (
                  <tr key={`${m.name}-${i}`}>
                    <td>
                      <p className="font-medium">
                        {m.name}
                        {m === cheapest && <span className="ml-2 text-xs text-[#1a9951]">● কম</span>}
                        {m === costliest && <span className="ml-2 text-xs text-[#d03739]">● বেশি</span>}
                      </p>
                      {m.division && <p className="text-xs text-base-content/60">{m.division}</p>}
                    </td>
                    <td className="text-[#1a9951]">{m.min === null ? "—" : taka(m.min)}</td>
                    <td className="text-[#d03739]">{m.max === null ? "—" : taka(m.max)}</td>
                    <td>
                      <p className="font-semibold">{m.price === null ? "—" : taka(m.price)}</p>
                      {m.price !== null && maxPrice > 0 && (
                        <div className="mt-1 h-1.5 w-full max-w-40 rounded-full bg-base-200">
                          <div className="h-1.5 rounded-full bg-primary" style={{ width: `${Math.max(8, Math.min(100, Math.round((m.price / maxPrice) * 100)))}%` }} />
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
