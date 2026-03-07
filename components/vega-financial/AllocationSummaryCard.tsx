"use client";

import { formatPercent } from "@/lib/utils/format";
import { cn } from "@/lib/utils";
import { METRIC_LABELS } from "@/lib/vega-financial/investor-copy";
import { ALLOCATION_NOTE_COPY } from "@/lib/vega-financial/strategy-copy";
import type { ReactNode } from "react";

interface AllocationSummaryCardProps {
  /** Card title */
  title?: string;
  returnPct?: number | null;
  maxDrawdown?: number | null;
  riskLevel?: string | null;
  /** Market similarity - plain-English or "—" */
  marketSimilarity?: string | null;
  /** Plain-English insight paragraph */
  actionInsight?: string | null;
  /** Allocation form and CTAs */
  children: ReactNode;
  className?: string;
}

export function AllocationSummaryCard({
  title = "Allocation summary",
  returnPct,
  maxDrawdown,
  riskLevel,
  marketSimilarity,
  actionInsight,
  children,
  className,
}: AllocationSummaryCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-4 flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start",
        className
      )}
    >
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>

      {/* 2x2 key metrics */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-[11px] font-medium text-muted-foreground">Return</p>
          <p className={cn("text-base font-semibold tabular-nums", returnPct != null && (returnPct >= 0 ? "text-brand-green" : "text-brand-red"))}>
            {returnPct != null ? `${returnPct >= 0 ? "+" : ""}${formatPercent(returnPct)}` : "—"}
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Over tested period</p>
        </div>
        <div>
          <p className="text-[11px] font-medium text-muted-foreground">{METRIC_LABELS.biggestDrop}</p>
          <p className="text-base font-semibold tabular-nums text-foreground">
            {maxDrawdown != null ? formatPercent(maxDrawdown) : "—"}
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Largest peak-to-trough fall</p>
        </div>
        <div>
          <p className="text-[11px] font-medium text-muted-foreground">Risk level</p>
          <p className="text-base font-semibold text-foreground">{riskLevel ?? "—"}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Strategy classification</p>
        </div>
        <div>
          <p className="text-[11px] font-medium text-muted-foreground">{METRIC_LABELS.similarityToMarket}</p>
          <p className="text-base font-semibold text-foreground">{marketSimilarity ?? "—"}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Vs market benchmark</p>
        </div>
      </div>

      {/* Plain-English insight */}
      {actionInsight && (
        <div className="rounded-lg border border-border bg-muted/20 p-3">
          <p className="text-xs text-muted-foreground leading-snug">{actionInsight}</p>
        </div>
      )}

      {/* Allocation controls slot */}
      <div className="flex flex-col gap-3 pt-0">
        {children}
      </div>

      <p className="text-[10px] text-muted-foreground leading-snug">{ALLOCATION_NOTE_COPY}</p>
    </div>
  );
}
