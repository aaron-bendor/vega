"use client";

import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { TrustSignalsRow } from "./TrustSignalsRow";
import { MiniInsightCard } from "./MiniInsightCard";
import { DEFAULT_TRUST_SIGNALS } from "@/lib/vega-financial/strategy-copy";

interface StrategyHeroSummaryProps {
  name: string;
  verified: boolean;
  /** One-line plain-English summary */
  oneLineSummary: string;
  /** Asset class e.g. Equity */
  assetClass?: string;
  /** Strategy style e.g. Momentum, Trend Following */
  strategyStyle?: string;
  /** Risk level e.g. Medium */
  riskLevel?: string | null;
  /** From strategy copy: suitableFor, bestRole, typicalBehaviour, mainDrawback */
  suitableFor?: string;
  bestRole?: string;
  typicalBehaviour?: string;
  mainDrawback?: string;
  whyConsider?: { title: string; body: string }[];
  trustSignals?: string[];
  /** Optional: link to open "How to read this page" */
  onHowToRead?: () => void;
  /** Optional: Replay tutorial link (rendered as secondary action) */
  replayTutorialSlot?: React.ReactNode;
  className?: string;
}

export function StrategyHeroSummary({
  name,
  verified,
  oneLineSummary,
  assetClass,
  strategyStyle,
  riskLevel,
  suitableFor,
  bestRole,
  typicalBehaviour,
  mainDrawback,
  whyConsider = [],
  trustSignals = DEFAULT_TRUST_SIGNALS,
  onHowToRead,
  replayTutorialSlot,
  className,
}: StrategyHeroSummaryProps) {
  const hasQuickSummary =
    suitableFor || bestRole || typicalBehaviour || mainDrawback;
  const hasWhyConsider = whyConsider.length > 0;

  return (
    <div className={cn("min-w-0 space-y-4", className)}>
      {/* A. Top metadata row: compact badges */}
      <div className="flex flex-wrap items-center gap-1.5">
        {verified && (
          <span className="inline-flex items-center gap-1 rounded-md border border-primary/30 bg-primary/5 px-2 py-0.5 text-[11px] font-medium text-primary">
            <ShieldCheck className="size-3" aria-hidden /> Verified
          </span>
        )}
        <span className="rounded-md border border-border bg-muted/30 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
          Simulated
        </span>
        {assetClass && (
          <span className="rounded-md border border-border bg-muted/30 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
            {assetClass}
          </span>
        )}
        {strategyStyle && (
          <span className="rounded-md border border-border bg-muted/30 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
            {strategyStyle}
          </span>
        )}
        {riskLevel && (
          <span className="rounded-md border border-border bg-muted/30 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
            {riskLevel} risk
          </span>
        )}
      </div>

      {/* B. Title row */}
      <h1 className="font-syne text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight flex items-center gap-2 flex-wrap">
        {name}
        {verified && (
          <ShieldCheck className="size-6 text-primary shrink-0" aria-label="Verified strategy" />
        )}
      </h1>

      {/* C. One-line summary */}
      <p className="text-sm sm:text-base text-muted-foreground leading-snug max-w-2xl">
        {oneLineSummary}
      </p>

      {/* D. Two-column quick summary list */}
      {hasQuickSummary && (
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
          {suitableFor && (
            <>
              <dt className="font-medium text-foreground">Suitable for</dt>
              <dd className="text-muted-foreground">{suitableFor}</dd>
            </>
          )}
          {bestRole && (
            <>
              <dt className="font-medium text-foreground">Best role in a portfolio</dt>
              <dd className="text-muted-foreground">{bestRole}</dd>
            </>
          )}
          {typicalBehaviour && (
            <>
              <dt className="font-medium text-foreground">Typical behaviour</dt>
              <dd className="text-muted-foreground">{typicalBehaviour}</dd>
            </>
          )}
          {mainDrawback && (
            <>
              <dt className="font-medium text-foreground">Main drawback</dt>
              <dd className="text-muted-foreground">{mainDrawback}</dd>
            </>
          )}
        </dl>
      )}

      {/* E. Why consider this: 3 mini cards */}
      {hasWhyConsider && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {whyConsider.slice(0, 3).map((item, i) => (
            <MiniInsightCard key={i} title={item.title} body={item.body} />
          ))}
        </div>
      )}

      {/* F. Trust signals row */}
      <TrustSignalsRow items={trustSignals} />

      {/* Optional: How to read / Replay tutorial */}
      <div className="flex flex-wrap items-center gap-3 pt-1">
        {onHowToRead && (
          <button
            type="button"
            onClick={onHowToRead}
            className="text-xs font-medium text-muted-foreground hover:text-foreground focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring rounded"
          >
            How to read this page
          </button>
        )}
        {replayTutorialSlot}
      </div>
    </div>
  );
}
