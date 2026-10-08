"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { fetchClient } from "@/lib/api";
import { normalizeCategories, normalizeProducts } from "@/lib/normalize";

const Ctx = createContext({ loading: true, error: null, products: [], categories: [] });

export function DataProvider({ children }) {
  const [state, setState] = useState({ loading: true, error: null, products: [], categories: [] });

  useEffect(() => {
    let off = false;
    (async () => {
      try {
        const [p, c] = await Promise.all([fetchClient("/products"), fetchClient("/categories")]);
        if (off) return;
        setState({ loading: false, error: null, products: normalizeProducts(p), categories: normalizeCategories(c) });
      } catch (e) {
        if (!off) setState({ loading: false, error: "তথ্য লোড করা যায়নি। আবার চেষ্টা করুন।", products: [], categories: [] });
      }
    })();
    return () => {
      off = true;
    };
  }, []);

  return <Ctx.Provider value={state}>{children}</Ctx.Provider>;
}

export const useMarketData = () => useContext(Ctx);
