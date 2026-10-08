const BN = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

/** "১,২৩৪.৫" or "1234.5" or 1234.5 -> 1234.5 (null if not numeric) */
export function toNum(v) {
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  if (typeof v !== "string") return null;
  const en = v.replace(/[০-৯]/g, (d) => String(BN.indexOf(d)));
  const clean = en.replace(/[,৳\s]/g, "").replace(/[^\d.\-]/g, "");
  const n = parseFloat(clean);
  return Number.isNaN(n) ? null : n;
}

/** 1850 -> "১,৮৫০", 64.5 -> "৬৪.৫" */
export function toBn(n, maxFraction = 2) {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  const s = new Intl.NumberFormat("en-US", { maximumFractionDigits: maxFraction }).format(n);
  return s.replace(/\d/g, (d) => BN[Number(d)]);
}

export const taka = (n) => `${toBn(n)} টাকা`;

export function banglaDate(date = new Date()) {
  try {
    return new Intl.DateTimeFormat("bn-BD-u-ca-gregory", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  } catch {
    return "";
  }
}
