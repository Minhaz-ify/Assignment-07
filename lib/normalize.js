import { toNum } from "./bn";

/**
 * The API field names are normalised here so the UI only deals with one shape.
 * If the live API uses a different name for something, add it to the key list.
 */
const pick = (o, keys) => {
  for (const k of keys) if (o && o[k] !== undefined && o[k] !== null && o[k] !== "") return o[k];
  return undefined;
};

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
    icon: pick(c, ["emoji", "icon", "symbol"]) ?? "🛒",
    count: toNum(pick(c, ["count", "productCount", "total"])),
  };
}

function normalizeMarket(m, i) {
  if (typeof m === "string") return { name: m, price: null, change: null };
  const price = toNum(pick(m, ["price", "todayPrice", "currentPrice", "amount", "value", "avgPrice"]));
  return {
    name: pick(m, ["name", "market", "marketName", "bazar", "bazarName", "nameBn", "location"]) ?? `বাজার ${i + 1}`,
    price,
    change: toNum(pick(m, ["changePercent", "change_percent", "percentChange", "change", "pct"])),
    district: pick(m, ["district", "city", "area"]),
  };
}

function direction(change, hint) {
  const h = typeof hint === "string" ? hint.toLowerCase() : "";
  if (change === null || change === undefined) {
    if (h.includes("up") || h.includes("rise") || h.includes("increase")) return "up";
    if (h.includes("down") || h.includes("fall") || h.includes("decrease")) return "down";
    return "flat";
  }
  let c = change;
  if ((h.includes("down") || h.includes("fall") || h.includes("decrease")) && c > 0) c = -c;
  if ((h.includes("up") || h.includes("rise") || h.includes("increase")) && c < 0) c = -c;
  return c > 0 ? "up" : c < 0 ? "down" : "flat";
}

export function normalizeProduct(p) {
  const id = pick(p, ["id", "_id", "productId"]);
  const slug = String(pick(p, ["slug", "id", "_id", "productId"]) ?? "");

  // price can be a number, a string or an object like { min, max, avg }
  let priceRaw = pick(p, ["price", "todayPrice", "currentPrice", "priceToday", "avgPrice", "averagePrice", "avg"]);
  let objMin, objMax, objAvg;
  if (priceRaw && typeof priceRaw === "object") {
    objMin = toNum(pick(priceRaw, ["min", "minimum", "low"]));
    objMax = toNum(pick(priceRaw, ["max", "maximum", "high"]));
    objAvg = toNum(pick(priceRaw, ["avg", "average", "today", "current", "price"]));
    priceRaw = objAvg;
  }

  const marketsRaw = pick(p, ["markets", "marketPrices", "market_prices", "bazars", "bazarPrices", "marketWise", "prices"]);
  let marketList = [];
  if (Array.isArray(marketsRaw)) marketList = marketsRaw.map(normalizeMarket);
  else if (marketsRaw && typeof marketsRaw === "object")
    marketList = Object.entries(marketsRaw).map(([name, v], i) =>
      typeof v === "object" ? normalizeMarket({ name, ...v }, i) : { name, price: toNum(v), change: null }
    );
  const mPrices = marketList.map((m) => m.price).filter((x) => x !== null);

  const min = toNum(pick(p, ["minPrice", "min_price", "min", "lowestPrice"])) ?? objMin ?? (mPrices.length ? Math.min(...mPrices) : null);
  const max = toNum(pick(p, ["maxPrice", "max_price", "max", "highestPrice"])) ?? objMax ?? (mPrices.length ? Math.max(...mPrices) : null);
  const avgMarkets = mPrices.length ? mPrices.reduce((a, b) => a + b, 0) / mPrices.length : null;
  const avg = toNum(pick(p, ["avgPrice", "averagePrice", "avg_price", "avg"])) ?? objAvg ?? avgMarkets;

  const price = toNum(priceRaw) ?? avg ?? min ?? null;

  const prev = toNum(pick(p, ["yesterdayPrice", "previousPrice", "prevPrice", "lastPrice", "priceYesterday"]));
  let change = toNum(pick(p, ["changePercent", "change_percent", "percentChange", "changePct", "change", "percentage", "pct"]));
  if (change === null && price !== null && prev) change = ((price - prev) / prev) * 100;
  const dir = direction(change, pick(p, ["trend", "direction", "changeType", "status"]));
  const changeAbs = change === null ? 0 : Math.abs(change);

  // category: string id | object | array of those
  let catRaw = pick(p, ["category", "categoryId", "category_id", "categories", "type"]);
  if (Array.isArray(catRaw)) catRaw = catRaw[0];
  const cat = catRaw && typeof catRaw === "object" ? normalizeCategory(catRaw) : null;
  const categoryId = String(cat ? cat.id : catRaw ?? "").toLowerCase();
  const categoryName = cat ? cat.name : pick(p, ["categoryName", "categoryBn", "category_name"]) ?? (typeof catRaw === "string" ? catRaw : "");

  const tagsRaw = pick(p, ["tags", "categories"]);
  const tags = Array.isArray(tagsRaw)
    ? tagsRaw.map((t) => (typeof t === "object" ? normalizeCategory(t).name : String(t)))
    : categoryName
    ? [categoryName]
    : [];

  return {
    id: id !== undefined ? String(id) : slug,
    slug,
    name: pick(p, ["nameBn", "name_bn", "bnName", "name", "title", "nameEn"]) ?? "পণ্য",
    emoji: pick(p, ["emoji", "icon", "symbol", "image"]) ?? "🛒",
    unit: pick(p, ["unit", "unitBn", "unit_bn", "per"]) ?? "প্রতি কেজি",
    description: pick(p, ["description", "subtitle", "summary", "note", "details"]) ?? "",
    categoryId,
    categoryName,
    tags,
    price,
    change: changeAbs,
    dir,
    min,
    max,
    avg,
    markets: marketList,
  };
}

export const normalizeProducts = (json) => extractList(json).map(normalizeProduct);
export const normalizeCategories = (json) => extractList(json).map(normalizeCategory);
