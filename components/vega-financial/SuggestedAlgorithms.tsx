"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Star } from "lucide-react";
import { formatPercent } from "@/lib/utils/format";
import { METRIC_LABELS } from "@/lib/vega-financial/investor-copy";
import { MetricTooltip } from "@/components/vega-financial/MetricTooltip";
import { cn } from "@/lib/utils";

export interface SuggestedAlgorithm {
  id: string;
  name: string;
  shortDesc: string;
  riskLevel: string;
  verified?: boolean;
  return?: number;
  maxDrawdown?: number;
  sharpe?: number;
  /** Optional style label e.g. "Momentum" */
  style?: string;
  /** Optional popularity label */
  popularity?: string;
}

interface SuggestedAlgorithmsProps {
  algorithms: SuggestedAlgorithm[];
}

function riskVariant(level: string): "success" | "warning" | "destructive" {
  if (level === "Low") return "success";
  if (level === "High") return "destructive";
  return "warning";
}

export function SuggestedAlgorithms({ algorithms }: SuggestedAlgorithmsProps) {
  const show = algorithms.slice(0, 3);
  if (show.length === 0) return null;

  return (
    <section aria-labelledby="suggested-heading" id="marketplace" data-tour="vf-algo-list">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-4">
        <div>
          <h2 id="suggested-heading" className="font-syne text-lg font-semibold text-foreground">
            Suggested for you
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Strategies that may complement your current portfolio
          </p>
        </div>
        <Link
          href="/vega-financial/marketplace"
          className="text-sm font-medium text-primary hover:underline focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring rounded shrink-0"
        >
          Explore all
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {show.map((algo) => (
          <Card
            key={algo.id}
            className="rounded-xl border border-border bg-card overflow-hidden transition-colors hover:border-muted-foreground/20 flex flex-col h-full"
          >
            <CardContent className="p-4 flex flex-col flex-1 gap-3">
              {/* Top row: name + verified */}
              <div className="flex items-start justify-between gap-2 min-h-[2.5rem]">
                <Link
                  href={`/vega-financial/algorithms/${algo.id}`}
                  className="font-semibold text-foreground hover:underline line-clamp-2"
                >
                  {algo.name}
                </Link>
                {algo.verified && (
                  <ShieldCheck
                    className="size-4 text-primary shrink-0 mt-0.5"
                    aria-label="Verified strategy"
                  />
                )}
              </div>

              {/* Description */}
              <p className="text-xs text-muted-foreground line-clamp-2 leading-snug">
                {algo.shortDesc}
              </p>

              {/* Metric strip: 4 items desktop, 2x2 mobile */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                {algo.return != null && (
                  <>
                    <span className="text-muted-foreground">{METRIC_LABELS.return}</span>
                    <span
                      className={cn(
                        "tabular-nums font-medium",
                        algo.return >= 0 ? "text-brand-green" : "text-brand-red"
                      )}
                    >
                      {formatPercent(algo.return)}
                    </span>
                  </>
                )}
                {algo.maxDrawdown != null && (
                  <>
                    <MetricTooltip
                      label={METRIC_LABELS.biggestDrop}
                      technicalTerm={METRIC_LABELS.maxDrawdown}
                      className="text-muted-foreground"
                    />
                    <span className="tabular-nums text-foreground">{formatPercent(algo.maxDrawdown)}</span>
                  </>
                )}
                {algo.sharpe != null && (
                  <>
                    <MetricTooltip
                      label={METRIC_LABELS.riskAdjustedReturn}
                      technicalTerm={METRIC_LABELS.sharpeRatio}
                      className="text-muted-foreground"
                    />
                    <span className="tabular-nums text-foreground">{algo.sharpe.toFixed(2)}</span>
                  </>
                )}
                {(algo.popularity ?? algo.style) && (
                  <>
                    <span className="text-muted-foreground">Popularity</span>
                    <span className="tabular-nums text-foreground">
                      {algo.popularity ?? algo.style ?? "—"}
                    </span>
                  </>
                )}
                {!algo.return && !algo.maxDrawdown && !algo.sharpe && (
                  <>
                    <span className="text-muted-foreground">Risk</span>
                    <span className="text-foreground">{algo.riskLevel}</span>
                    {algo.style && (
                      <>
                        <span className="text-muted-foreground">Style</span>
                        <span className="text-foreground">{algo.style}</span>
                      </>
                    )}
                  </>
                )}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                <Badge variant={riskVariant(algo.riskLevel)} className="text-xs font-normal">
                  {algo.riskLevel} risk
                </Badge>
                {algo.style && (
                  <Badge variant="secondary" className="text-xs font-normal">
                    {algo.style}
                  </Badge>
                )}
                {algo.verified && (
                  <Badge variant="outline" className="text-xs font-normal text-primary border-primary/40">
                    Popular
                  </Badge>
                )}
              </div>

              {/* Action row: View details (primary emphasis but lighter than full purple) + Save */}
              <div className="flex gap-2 mt-auto pt-1">
                <Button size="sm" variant="outline" asChild className="flex-1 min-h-[44px] sm:min-h-[32px] border-primary/30 text-primary hover:bg-primary/10">
                  <Link href={`/vega-financial/algorithms/${algo.id}`}>View details</Link>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="shrink-0 min-h-[44px] min-w-[44px] sm:min-h-[32px] sm:min-w-[32px]"
                  aria-label="Save to watchlist"
                >
                  <Star className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
