"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SummaryMetricCardProps {
  label: string;
  value: ReactNode;
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
 * Tighter vertical spacing, stronger value size, hover border only.
 */
export function SummaryMetricCard({
  label,
  value,
  helperText,
  trendOrStatus,
  variant = "default",
  className,
}: SummaryMetricCardProps) {
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
        {value}
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
