"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useCountUp } from "@/hooks/useCountUp";
import { formatCurrency, formatPercent } from "@/lib/utils/format";

interface SummaryMetricCardProps {
  label: string;
  value: ReactNode;
  /** When set, value is ignored and we show a count-up from 0 for this number (currency or percent) */
  numericValue?: number;
  /** Use with numericValue: "currency" or "percent" */
  numericFormat?: "currency" | "percent";
  /** Helper text below the value (e.g. "Includes invested strategies and available cash") */
  helperText?: ReactNode;
  /** Optional tiny trend or status note (e.g. "Since your first allocation") */
  trendOrStatus?: ReactNode;
  /** Positive/negative styling for value */
  variant?: "default" | "positive" | "negative";
  className?: string;
}

/**
 * Summary metric card for dashboard: label, primary value, helper text, optional trend.
 * Optional count-up animation when numericValue + numericFormat provided.
 */
export function SummaryMetricCard({
  label,
  value,
  numericValue,
  numericFormat = "currency",
  helperText,
  trendOrStatus,
  variant = "default",
  className,
}: SummaryMetricCardProps) {
  const countUp = useCountUp(numericValue ?? 0, {
    duration: 900,
    enabled: numericValue != null,
  });
  const displayValue =
    numericValue != null
      ? numericFormat === "percent"
        ? formatPercent(countUp / 100)
        : formatCurrency(countUp)
      : value;

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-3 sm:p-4 min-w-0 transition-[border-color] duration-200 hover:border-muted-foreground/30",
        className
      )}
    >
      <p className="text-xs font-medium text-muted-foreground mb-1 truncate">
        {label}
      </p>
      <p
        className={cn(
          "text-xl sm:text-2xl font-semibold tabular-nums text-foreground",
          variant === "positive" && "text-brand-green",
          variant === "negative" && "text-brand-red"
        )}
      >
        {displayValue}
      </p>
      {helperText != null && (
        <p className="text-[11px] sm:text-xs text-muted-foreground mt-1 leading-tight max-w-[200px] sm:max-w-none">
          {helperText}
        </p>
      )}
      {trendOrStatus != null && (
        <p className="text-[10px] sm:text-xs text-muted-foreground/80 mt-0.5">
          {trendOrStatus}
        </p>
      )}
    </div>
  );
}
