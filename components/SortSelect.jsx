"use client";

export const SORT_OPTIONS = [
  { value: "default", label: "ডিফল্ট" },
  { value: "asc", label: "দাম: কম থেকে বেশি" },
  { value: "desc", label: "দাম: বেশি থেকে কম" },
];

/** Sorts by the numeric price (never by the Bengali string) */
export function sortProducts(list, mode) {
  if (mode === "default") return list;
  const key = (p) => (p.price === null ? (mode === "asc" ? Infinity : -Infinity) : p.price);
  return [...list].sort((a, b) => (mode === "asc" ? key(a) - key(b) : key(b) - key(a)));
}

export default function SortSelect({ value, onChange }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-base-content/60">সাজান:</span>
      <span className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="select select-bordered select-sm sm:select-md appearance-none bg-white pr-9"
          aria-label="সাজান"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <svg className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </span>
    </label>
  );
}
