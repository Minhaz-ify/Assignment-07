import { toNum, toBn } from "./bn";

/**
 * The API shape (verified against /products/1):
 *   { id, slug, nameBn, category, categoryNameBn, categoryIcon, unit, image,
 *     today, yesterday, lastWeek, lastMonth, change: { dir, pct },
 *     markets: [{ market, division, min, max }] }
 * Extra key names are kept as fallbacks so small API changes don't break the UI.
 */
const pick = (o, keys) => {
  for (const k of keys) if (o && o[k] !== undefined && o[k] !== null && o[k] !== "") return o[k];
  return undefined;
};

const UNIT_BN = {
  kg: "প্রতি কেজি",
  kilogram: "প্রতি কেজি",
  litre: "প্রতি লিটার",
  liter: "প্রতি লিটার",
  l: "প্রতি লিটার",
  dozen: "প্রতি ডজন",
  piece: "প্রতি পিস",
  pcs: "প্রতি পিস",
  pc: "প্রতি পিস",
};

export function unitBn(u) {
  if (!u) return "প্রতি কেজি";
  const s = String(u).trim();
  if (/[\u0980-\u09FF]/.test(s)) return s.startsWith("প্রতি") ? s : `প্রতি ${s}`;
  return UNIT_BN[s.toLowerCase()] ?? `প্রতি ${s}`;
}

export function extractList(json) {
  if (Array.isArray(json)) return json;
  if (json && typeof json === "object") {
    for (const k of ["data", "products", "categories", "items", "results"]) {
      if (Array.isArray(json[k])) return json[k];
    }
    for (const v of Object.values(json)) if (Array.isArray(v)) return v;
  }
  return [];
}

export function extractOne(json) {
  if (json && typeof json === "object" && !Array.isArray(json)) {
    for (const k of ["data", "product", "category", "item", "result"]) {
      if (json[k] && typeof json[k] === "object" && !Array.isArray(json[k])) return json[k];
    }
    return json;
  }
  if (Array.isArray(json)) return json[0] ?? null;
  return null;
}

export function normalizeCategory(c) {
  if (typeof c === "string") return { id: c, name: c, icon: "🛒" };
  const id = String(pick(c, ["id", "slug", "key", "_id"]) ?? "");
  return {
    id,
    name: pick(c, ["nameBn", "name_bn", "bnName", "name", "title", "label", "nameEn"]) ?? id,
    icon: pick(c, ["icon", "emoji", "categoryIcon", "symbol"]) ?? "🛒",
    count: toNum(pick(c, ["count", "productCount", "total"])),
  };
}

function normalizeMarket(m, i) {
  if (typeof m === "string") return { name: m, division: "", price: null, min: null, max: null };
  const min = toNum(pick(m, ["min", "minPrice", "low"]));
  const max = toNum(pick(m, ["max", "maxPrice", "high"]));
  const single = toNum(pick(m, ["price", "today", "todayPrice", "currentPrice", "amount", "value"]));
  const price = single ?? (min !== null && max !== null ? (min + max) / 2 : min ?? max);
  return {
    name: pick(m, ["market", "name", "marketName", "bazar", "bazarName", "nameBn"]) ?? `বাজার ${i + 1}`,
    division: pick(m, ["division", "district", "city", "area", "location"]) ?? "",
    price,
    min: min ?? single,
    max: max ?? single,
  };
}

function direction(change, hint) {
  const h = typeof hint === "string" ? hint.toLowerCase() : "";
  const up = h.includes("up") || h.includes("rise") || h.includes("increase");
  const down = h.includes("down") || h.includes("fall") || h.includes("decrease");
  if (up) return "up";
  if (down) return "down";
  if (change === null || change === undefined) return "flat";
  return change > 0 ? "up" : change < 0 ? "down" : "flat";
}

export function normalizeProduct(p) {
  const id = pick(p, ["id", "_id", "productId"]);
  const slug = String(pick(p, ["slug", "id", "_id", "productId"]) ?? "");

  const marketsRaw = pick(p, ["markets", "marketPrices", "market_prices", "bazars", "marketWise"]);
  let markets = [];
  if (Array.isArray(marketsRaw)) markets = marketsRaw.map(normalizeMarket);
  else if (marketsRaw && typeof marketsRaw === "object")
    markets = Object.entries(marketsRaw).map(([name, v], i) =>
      typeof v === "object" ? normalizeMarket({ market: name, ...v }, i) : { name, division: "", price: toNum(v), min: toNum(v), max: toNum(v) }
    );
  const mins = markets.map((m) => m.min).filter((x) => x !== null);
  const maxs = markets.map((m) => m.max).filter((x) => x !== null);

  const price = toNum(pick(p, ["today", "price", "todayPrice", "currentPrice", "priceToday"]));
  const prev = toNum(pick(p, ["yesterday", "yesterdayPrice", "previousPrice", "prevPrice", "lastPrice"]));

  // change can be { dir, pct } or a plain number
  const changeRaw = pick(p, ["change", "changePercent", "change_percent", "percentChange", "changePct", "pct"]);
  let pct = null;
  let hint = pick(p, ["trend", "direction", "changeType"]);
  if (changeRaw && typeof changeRaw === "object") {
    pct = toNum(pick(changeRaw, ["pct", "percent", "percentage", "value"]));
    hint = pick(changeRaw, ["dir", "direction", "trend"]) ?? hint;
  } else {
    pct = toNum(changeRaw);
  }
  if (pct === null && price !== null && prev) pct = ((price - prev) / prev) * 100;
  const dir = direction(pct, hint);
  const change = pct === null ? 0 : Math.abs(pct);

  const categoryId = String(pick(p, ["category", "categoryId", "category_id"]) ?? "").toLowerCase();
  const categoryName = pick(p, ["categoryNameBn", "categoryName", "categoryBn", "category_name"]) ?? "";
  const categoryIcon = pick(p, ["categoryIcon", "categoryEmoji"]) ?? "";

  const unit = unitBn(pick(p, ["unit", "unitBn", "unit_bn"]));

  let description = pick(p, ["description", "subtitle", "summary", "note", "details"]);
  if (!description && price !== null && prev !== null) {
    const d = price - prev;
    description =
      d > 0
        ? `গতকালের তুলনায় আজ দাম বেড়েছে · ${toBn(d)} টাকা`
        : d < 0
        ? `গতকালের তুলনায় আজ দাম কমেছে · ${toBn(Math.abs(d))} টাকা`
        : "গতকালের তুলনায় আজ দাম অপরিবর্তিত";
  }

  return {
    id: id !== undefined ? String(id) : slug,
    slug,
    name: pick(p, ["nameBn", "name_bn", "bnName", "name", "title", "nameEn"]) ?? "পণ্য",
    emoji: pick(p, ["image", "emoji", "icon", "symbol"]) ?? "🛒",
    unit,
    description: description ?? "",
    categoryId,
    categoryName,
    categoryIcon,
    tags: categoryName ? [categoryName] : [],
    price,
    prev,
    change,
    dir,
    min: toNum(pick(p, ["minPrice", "min_price", "lowestPrice"])) ?? (mins.length ? Math.min(...mins) : null),
    max: toNum(pick(p, ["maxPrice", "max_price", "highestPrice"])) ?? (maxs.length ? Math.max(...maxs) : null),
    avg: toNum(pick(p, ["avgPrice", "averagePrice", "avg_price"])) ?? price,
    markets,
  };
}

export const normalizeProducts = (json) => extractList(json).map(normalizeProduct);
export const normalizeCategories = (json) => extractList(json).map(normalizeCategory);
