const DEFAULT_BASES = [
  "https://api.api-store.workers.dev/api/bazardor",
  "https://api.abcz.workers.dev/api/bazardor",
];

export const BASES = [process.env.API_BASE_1, process.env.API_BASE_2].filter(Boolean).length
  ? [process.env.API_BASE_1, process.env.API_BASE_2].filter(Boolean)
  : DEFAULT_BASES;

/** Server-side: try BASE_URL_1, fall back to BASE_URL_2 */
export async function fetchUpstream(path, { revalidate = 60 } = {}) {
  let lastErr;
  for (const base of BASES) {
    try {
      const res = await fetch(`${base}${path}`, { next: { revalidate } });
      if (res.ok) return await res.json();
      lastErr = new Error(`HTTP ${res.status}`);
      if (res.status === 404) return null;
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr ?? new Error("API unavailable");
}

/** Client-side: goes through our own /api/market proxy (avoids CORS problems) */
export async function fetchClient(path) {
  const res = await fetch(`/api/market${path}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
