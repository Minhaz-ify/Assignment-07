"use client";
import { useEffect, useMemo, useState } from "react";
import { useMarketData } from "./DataProvider";
import Hero from "./Hero";
import ProductGrid from "./ProductGrid";
import { GridSkeleton } from "./Skeletons";
import { banglaDate, toBn } from "@/lib/bn";

function Section({ id, title, subtitle, children }) {
  return (
    <section id={id} className="scroll-mt-4 py-6">
      <div className="mb-4">
        <h2 className="text-xl font-bold sm:text-2xl">{title}</h2>
        {subtitle && <p className="text-sm text-base-content/60">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

export default function HomeClient() {
  const { loading, error, products } = useMarketData();
  const [date, setDate] = useState("");
  useEffect(() => setDate(banglaDate()), []);

  const risers = useMemo(
    () => products.filter((p) => p.dir === "up").sort((a, b) => b.change - a.change).slice(0, 6),
    [products]
  );
  const fallers = useMemo(
    () => products.filter((p) => p.dir === "down").sort((a, b) => b.change - a.change).slice(0, 6),
    [products]
  );

  return (
    <>
      <Hero total={products.length} dateText={date} />
      <div className="mx-auto max-w-6xl px-4">
        {error && (
          <div role="alert" className="alert alert-error mt-6">
            <span>{error}</span>
          </div>
        )}

        <Section title="আজ দাম বেড়েছে ▲" subtitle="গতকালের তুলনায় সবচেয়ে বেশি বেড়েছে এমন ৬টি পণ্য">
          {loading ? <GridSkeleton count={4} /> : risers.length ? <ProductGrid products={risers} /> : <p className="text-base-content/60">আজ কোনো পণ্যের দাম বাড়েনি।</p>}
        </Section>

        <Section title="আজ দাম কমেছে ▼" subtitle="গতকালের তুলনায় সবচেয়ে বেশি কমেছে এমন ৬টি পণ্য">
          {loading ? <GridSkeleton count={4} /> : fallers.length ? <ProductGrid products={fallers} /> : <p className="text-base-content/60">আজ কোনো পণ্যের দাম কমেনি।</p>}
        </Section>

        <Section id="সব-পণ্য" title="সব পণ্য" subtitle={loading ? "লোড হচ্ছে…" : `মোট ${toBn(products.length)}টি পণ্য দেখানো হচ্ছে`}>
          {loading ? <GridSkeleton count={8} /> : <ProductGrid products={products} />}
        </Section>
      </div>
    </>
  );
}
