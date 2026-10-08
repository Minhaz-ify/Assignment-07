"use client";
import { useEffect, useMemo, useState } from "react";
import { useMarketData } from "./DataProvider";
import ProductGrid from "./ProductGrid";
import { GridSkeleton } from "./Skeletons";
import SortSelect, { sortProducts } from "./SortSelect";
import NotFoundState from "./NotFoundState";
import { toBn } from "@/lib/bn";
import { fetchClient } from "@/lib/api";
import { normalizeProducts } from "@/lib/normalize";

export default function CategoryClient({ slug }) {
  const { loading, products, categories } = useMarketData();
  const [sort, setSort] = useState("default");
  const id = decodeURIComponent(slug).toLowerCase();

  const category = categories.find((c) => c.id.toLowerCase() === id);
  const matched = useMemo(
    () => products.filter((p) => p.categoryId === id || (category && p.categoryName === category.name)),
    [products, id, category]
  );

  // Fallback: ask the API directly with /products?category=<slug>
  const [remote, setRemote] = useState(null);
  const [remoteDone, setRemoteDone] = useState(false);
  useEffect(() => {
    if (loading || matched.length || !category) return;
    let off = false;
    fetchClient(`/products?category=${encodeURIComponent(id)}`)
      .then((j) => !off && setRemote(normalizeProducts(j)))
      .catch(() => {})
      .finally(() => !off && setRemoteDone(true));
    return () => {
      off = true;
    };
  }, [loading, matched.length, category, id]);

  const base = matched.length ? matched : remote ?? [];
  const list = useMemo(() => sortProducts(base, sort), [base, sort]);
  const waiting = loading || (!matched.length && !!category && !remoteDone);

  if (!waiting && (!category || list.length === 0)) {
    return (
      <NotFoundState
        title="এই বিভাগে কোনো পণ্য নেই"
        text="বিভাগটি আছে কি না বা সেখানে পণ্য আছে কি না যাচাই করুন।"
      />
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-3">
          {waiting || !category ? (
            <div className="skeleton h-12 w-48" />
          ) : (
            <>
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-[#f3fbf4] text-2xl" aria-hidden>{category.icon}</span>
              <div>
                <h1 className="text-2xl font-bold sm:text-3xl">{category.name}</h1>
                <p className="text-sm text-base-content/60">মোট {toBn(list.length)}টি পণ্য দেখানো হচ্ছে</p>
              </div>
            </>
          )}
        </div>
        <SortSelect value={sort} onChange={setSort} />
      </div>
      {waiting ? <GridSkeleton count={8} /> : <ProductGrid products={list} />}
    </div>
  );
}
