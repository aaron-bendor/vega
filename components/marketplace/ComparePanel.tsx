"use client";

import Link from "next/link";
import { formatPercent } from "@/lib/utils/format";
import { ArrowLeft, X, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CompareStrategyRow } from "@/lib/vega-financial/compare-data";

const FALLBACK_NOT_AVAILABLE = "Not available";

interface ComparePanelProps {
  strategies: CompareStrategyRow[];
  /** Current compare ids (for building remove-one URLs). */
  compareIds: string[];
  /** IDs that could not be loaded (for soft warning). */
  invalidIds?: string[];
}

/** Order: name (header), best for, risk, return, biggest drop, min investment, fees, asset class, style. */
const ROW_LABELS: { key: keyof CompareStrategyRow; label: string }[] = [
  { key: "bestFor", label: "Best for" },
  { key: "riskLevel", label: "Risk level" },
  { key: "returnPct", label: "Simulated return" },
  { key: "biggestDrop", label: "Biggest drop" },
  { key: "minInvestment", label: "Minimum investment" },
  { key: "fees", label: "Fees" },
  { key: "assetClass", label: "Asset class" },
  { key: "style", label: "Style" },
];

function CellValue({
  rowKey,
  value,
  strategy,
}: {
  rowKey: keyof CompareStrategyRow;
  value: unknown;
  strategy: CompareStrategyRow;
}) {
  if (rowKey === "name") {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        <Link
          href={`/vega-financial/algorithms/${strategy.id}`}
          className="font-medium text-foreground hover:underline focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring rounded"
        >
          {strategy.name}
        </Link>
        {strategy.verified && (
          <span className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium bg-primary/10 text-primary">
            <ShieldCheck className="size-3" aria-hidden /> Verified
          </span>
        )}
      </div>
    );
  }
  if (rowKey === "returnPct") {
    const v = strategy.returnPct;
    if (v == null) return <span className="text-muted-foreground">{FALLBACK_NOT_AVAILABLE}</span>;
    return (
      <span className={cn("tabular-nums", v >= 0 ? "text-brand-green" : "text-brand-red")}>
        {formatPercent(v)}
      </span>
    );
  }
  if (rowKey === "biggestDrop") {
    const v = strategy.biggestDrop;
    if (v == null) return <span className="text-muted-foreground">{FALLBACK_NOT_AVAILABLE}</span>;
    return <span className="tabular-nums text-brand-red">{formatPercent(v)}</span>;
  }
  return <span className="text-foreground">{String(value ?? FALLBACK_NOT_AVAILABLE)}</span>;
}

export function ComparePanel({ strategies, compareIds, invalidIds = [] }: ComparePanelProps) {
  function buildCompareUrlWithout(removeId: string): string {
    const rest = compareIds.filter((id) => id !== removeId);
    if (rest.length < 2) return "/vega-financial/compare";
    return `/vega-financial/compare?compare=${rest.join(",")}`;
  }

  const showRemove = strategies.length > 2;
  const showInvalidWarning = invalidIds.length > 0;

  if (strategies.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground mb-4">No strategies to compare.</p>
        <Button asChild variant="default" size="sm" className="min-h-[44px]">
          <Link href="/vega-financial/marketplace">Browse strategies</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-maven-pro text-lg font-semibold text-foreground">
          Compare strategies
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild variant="outline" size="sm" className="min-h-[44px] gap-2">
            <Link
              href="/vega-financial/marketplace"
              className="inline-flex items-center gap-2 focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              <ArrowLeft className="size-4" aria-hidden />
              Back to strategies
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className="min-h-[44px]">
            <Link
              href="/vega-financial/compare"
              className="inline-flex items-center focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              Clear all
            </Link>
          </Button>
        </div>
      </div>

      {showInvalidWarning && (
        <div
          className="rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/40 px-4 py-2.5 text-sm text-amber-800 dark:text-amber-200"
          role="status"
        >
          {invalidIds.length === 1
            ? "One strategy ID could not be loaded. Comparison shows the others."
            : `${invalidIds.length} strategy IDs could not be loaded. Comparison shows the rest.`}
        </div>
      )}

      <p className="text-sm text-muted-foreground">
        Side-by-side comparison. Values are simulated for the demo. Minimum investment and fees
        reflect strategy terms where available.
      </p>

      {/* Desktop: table */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[600px] text-sm" role="grid" aria-label="Strategy comparison">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left py-3 px-4 font-medium text-muted-foreground w-[140px]">
                —
              </th>
              {strategies.map((s) => (
                <th key={s.id} className="text-left py-3 px-4 font-medium text-foreground align-top">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-maven-pro font-semibold">{s.name}</span>
                    {showRemove && (
                      <Link
                        href={buildCompareUrlWithout(s.id)}
                        className="shrink-0 rounded p-1 min-w-[44px] min-h-[44px] inline-flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring"
                        aria-label={`Remove ${s.name} from comparison`}
                      >
                        <X className="size-4" />
                      </Link>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROW_LABELS.map(({ key, label }) => (
              <tr key={key} className="border-b border-border last:border-0">
                <td className="py-2.5 px-4 text-muted-foreground font-medium">{label}</td>
                {strategies.map((s) => (
                  <td key={s.id} className="py-2.5 px-4">
                    <CellValue
                      rowKey={key}
                      value={s[key as keyof CompareStrategyRow]}
                      strategy={s}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: stacked cards — same row order as desktop, tight spacing */}
      <div className="md:hidden space-y-4">
        {strategies.map((s) => (
          <div
            key={s.id}
            className="rounded-xl border border-border bg-card p-4 space-y-2"
            role="article"
            aria-label={`${s.name} comparison`}
          >
            <div className="flex items-start justify-between gap-2">
              <Link
                href={`/vega-financial/algorithms/${s.id}`}
                className="font-maven-pro font-semibold text-foreground hover:underline focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring rounded min-h-[44px] inline-flex items-center"
              >
                {s.name}
              </Link>
              {showRemove && (
                <Link
                  href={buildCompareUrlWithout(s.id)}
                  className="shrink-0 rounded p-1 min-w-[44px] min-h-[44px] inline-flex items-center justify-center text-muted-foreground hover:text-foreground focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={`Remove ${s.name} from comparison`}
                >
                  <X className="size-4" />
                </Link>
              )}
            </div>
            <dl className="grid grid-cols-1 gap-1.5 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground">Best for</dt>
                <dd className="font-medium">{s.bestFor}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Risk level</dt>
                <dd className="font-medium">{s.riskLevel}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Simulated return</dt>
                <dd className="font-medium tabular-nums">
                  {s.returnPct != null ? formatPercent(s.returnPct) : FALLBACK_NOT_AVAILABLE}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Biggest drop</dt>
                <dd className="font-medium tabular-nums">
                  {s.biggestDrop != null ? formatPercent(s.biggestDrop) : FALLBACK_NOT_AVAILABLE}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Minimum investment</dt>
                <dd className="font-medium">{s.minInvestment}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Fees</dt>
                <dd className="font-medium">{s.fees}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Asset class</dt>
                <dd className="font-medium">{s.assetClass}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Style</dt>
                <dd className="font-medium">{s.style}</dd>
              </div>
            </dl>
            <Button asChild size="sm" className="w-full min-h-[44px] mt-2">
              <Link
                href={`/vega-financial/algorithms/${s.id}`}
                className="focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring rounded"
              >
                View details
              </Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
