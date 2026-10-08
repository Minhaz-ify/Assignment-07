import { toBn } from "@/lib/bn";

export default function ChangeBadge({ dir, change, className = "" }) {
  const styles = {
    up: "bg-[#f3fbf4] text-[#1a9951]",
    down: "bg-[#fdf1f1] text-[#d03739]",
    flat: "bg-base-200 text-base-content/60",
  };
  const label =
    dir === "up" ? `▲ ${toBn(change, 1)}%` : dir === "down" ? `▼ ${toBn(change, 1)}%` : `— ${toBn(0, 1)}%`;
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold whitespace-nowrap ${styles[dir] || styles.flat} ${className}`}>
      {label}
    </span>
  );
}
