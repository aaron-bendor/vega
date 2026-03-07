"use client";

import Link from "next/link";
import { formatCurrency } from "@/lib/utils/format";
import { cn } from "@/lib/utils";
import type { RiskMixLabel, DiversificationLabel } from "@/lib/vega-financial/portfolio-metrics";

export type { RiskMixLabel, DiversificationLabel };

interface AccountBreakdownCardProps {
  invested: number;
  cash: number;
  numberOfHoldings: number;
  riskMix: RiskMixLabel;
  diversification: DiversificationLabel;
  /** e.g. "Your largest holding is Trend Tracker" */
  largestHoldingNote?: string;
  className?: string;
}

/**
 * Compact sidebar card: invested, cash, holdings count, risk mix, diversification,
 * CTA Review portfolio, and largest holding note.
 */
export function AccountBreakdownCard({
  invested,
  cash,
  numberOfHoldings,
  riskMix,
  diversification,
  largestHoldingNote,
  className,
}: AccountBreakdownCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-4 flex flex-col gap-4",
        className
      )}
    >
      <h3 className="text-sm font-semibold text-foreground">Account breakdown</h3>

      <dl className="space-y-3 text-sm">
        <div className="flex justify-between items-baseline gap-2">
          <dt className="text-muted-foreground">Invested</dt>
          <dd className="font-medium tabular-nums text-foreground">{formatCurrency(invested)}</dd>
        </div>
        <div className="flex justify-between items-baseline gap-2">
          <dt className="text-muted-foreground">Cash</dt>
          <dd className="font-medium tabular-nums text-foreground">{formatCurrency(cash)}</dd>
        </div>
        <div className="flex justify-between items-baseline gap-2">
          <dt className="text-muted-foreground">Number of holdings</dt>
          <dd className="font-medium tabular-nums text-foreground">{numberOfHoldings}</dd>
        </div>
        <div className="flex justify-between items-baseline gap-2">
          <dt className="text-muted-foreground">Risk mix</dt>
          <dd className="font-medium text-foreground">{riskMix}</dd>
        </div>
        <div className="flex justify-between items-baseline gap-2">
          <dt className="text-muted-foreground">Diversification</dt>
          <dd className="font-medium text-foreground text-right max-w-[140px]">{diversification}</dd>
        </div>
      </dl>

      <Link
        href="/vega-financial/portfolio"
        className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-medium h-9 px-4 hover:bg-primary/90 focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring min-h-[44px] sm:min-h-[36px]"
      >
        Review portfolio
      </Link>

      {largestHoldingNote && (
        <p className="text-[11px] text-muted-foreground leading-snug">{largestHoldingNote}</p>
      )}
    </div>
  );
}
