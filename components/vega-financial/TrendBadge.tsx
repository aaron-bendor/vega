"use client";

import { cn } from "@/lib/utils";

export type TrendStatus = "Improving" | "Steady" | "More volatile" | "Pulling back";

interface TrendBadgeProps {
  status: TrendStatus;
  className?: string;
}

const STYLES: Record<TrendStatus, string> = {
  Improving: "text-brand-green border-brand-green/40 bg-brand-green/5",
  Steady: "text-muted-foreground border-border bg-muted/30",
  "More volatile": "text-amber-600 dark:text-amber-500 border-amber-500/40 bg-amber-500/10",
  "Pulling back": "text-brand-red border-brand-red/40 bg-brand-red/5",
};

/**
 * Plain-English trend status pill for holdings.
 */
export function TrendBadge({ status, className }: TrendBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
        STYLES[status],
        className
      )}
    >
      {status}
    </span>
  );
}

/** Derive trend from return (placeholder when no real trend data). */
export function trendFromReturnPct(returnPct: number): TrendStatus {
  if (returnPct > 8) return "Improving";
  if (returnPct < -5) return "Pulling back";
  if (returnPct < -2 || returnPct > 15) return "More volatile";
  return "Steady";
}
