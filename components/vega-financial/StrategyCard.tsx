"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPercent } from "@/lib/utils/format";
import { ArrowRight, ShieldCheck, Star } from "lucide-react";
import { cn } from "@/lib/utils";

type DemoAlgo = { id: string; name: string; shortDesc?: string; tags: string[]; riskLevel?: string };
type DbVersion = {
  id: string;
  name: string;
  shortDesc?: string | null;
  description?: string | null;
  tags: { tag: { name: string } }[];
  riskLevel?: string | null;
  verificationStatus?: string;
  cachedReturn?: number | null;
  cachedMaxDrawdown?: number | null;
};

type Algorithm = DemoAlgo | DbVersion;

function isDbVersion(a: Algorithm): a is DbVersion {
  return "verificationStatus" in a && Array.isArray((a as DbVersion).tags) && (a as DbVersion).tags[0]?.tag != null;
}

function getTags(a: Algorithm): string[] {
  return isDbVersion(a) ? a.tags.map((t) => t.tag.name) : a.tags;
}

interface StrategyCardProps {
  algorithm: Algorithm;
  onCompareToggle?: (id: string) => void;
  compareSelected?: boolean;
  compareDisabled?: boolean;
  /** For tour target */
  dataTour?: string;
}

const RISK_BADGE_CLASSES: Record<string, string> = {
  Low: "vf-badge-risk-low",
  Medium: "vf-badge-risk-medium",
  High: "vf-badge-risk-high",
};

export function StrategyCard({
  algorithm,
  onCompareToggle,
  compareSelected,
  compareDisabled,
  dataTour,
}: StrategyCardProps) {
  const tags = getTags(algorithm);
  const verified = isDbVersion(algorithm) && algorithm.verificationStatus === "verified";
  const returnPct = isDbVersion(algorithm) ? algorithm.cachedReturn : undefined;
  const maxDrop = isDbVersion(algorithm) ? algorithm.cachedMaxDrawdown : undefined;
  const desc = algorithm.shortDesc ?? (isDbVersion(algorithm) ? algorithm.description : "") ?? "";
  const algoHref = `/vega-financial/algorithms/${algorithm.id}`;

  return (
    <Card
      data-tour={dataTour}
      className="vf-card-lift h-full flex flex-col rounded-xl border border-border bg-card"
    >
      <Link
        href={algoHref}
        className="flex flex-1 flex-col min-h-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        aria-label={`View details for ${algorithm.name}`}
      >
        <CardHeader className="pb-3 flex-shrink-0 space-y-4">
          <div className="flex flex-wrap items-center gap-1.5">
            {verified && (
              <span className="vf-badge-verified inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium">
                <ShieldCheck className="size-3" aria-hidden /> Verified
              </span>
            )}
            <span className="vf-badge-simulated rounded-md px-2 py-0.5 text-[11px] font-medium">
              Simulated
            </span>
            {algorithm.riskLevel && (
              <span
                className={cn(
                  "rounded-md px-2 py-0.5 text-[11px] font-medium",
                  RISK_BADGE_CLASSES[algorithm.riskLevel] ?? "border border-border bg-muted/50 text-muted-foreground"
                )}
              >
                {algorithm.riskLevel}
              </span>
            )}
          </div>
          <CardTitle className="font-maven-pro text-base font-semibold leading-tight text-foreground">
            {algorithm.name}
          </CardTitle>
          <p className="line-clamp-2 text-sm text-muted-foreground leading-snug">
            {desc}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 4).map((t) => (
              <span
                key={t}
                className="rounded bg-muted/60 px-2 py-0.5 text-[11px] text-muted-foreground"
              >
                {t}
              </span>
            ))}
          </div>
        </CardHeader>
        <CardContent className="pt-0 flex-1 flex flex-col justify-end space-y-4">
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            {returnPct != null && (
              <div>
                <span className="text-muted-foreground">Return</span>
                <span className="ml-1.5 font-maven-pro font-semibold text-foreground tabular-nums">
                  {formatPercent(returnPct)}
                </span>
              </div>
            )}
            {maxDrop != null && (
              <div>
                <span className="text-muted-foreground">Biggest drop</span>
                <span className="ml-1.5 font-maven-pro font-semibold text-foreground tabular-nums">
                  {formatPercent(maxDrop)}
                </span>
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground inline-flex items-center gap-1 group/link">
            View details
            <ArrowRight className="size-3 opacity-70 group-hover/link:translate-x-0.5 transition-transform" aria-hidden />
          </p>
        </CardContent>
      </Link>
      <div className="flex flex-wrap items-center gap-3 px-6 pb-4 pt-2 border-t border-border/80 flex-shrink-0">
        {onCompareToggle && (
          <button
            type="button"
            onClick={() => onCompareToggle(algorithm.id)}
            disabled={compareDisabled}
            aria-pressed={compareSelected}
            aria-label={compareSelected ? "In compare (remove from compare)" : "Add to compare (select 2–3)"}
            className={cn(
              "text-sm font-medium disabled:opacity-50 transition-colors duration-150 min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded sm:min-h-[44px] sm:min-w-[44px]",
              compareSelected ? "text-accent-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {compareSelected ? "In compare" : "Add to compare"}
          </button>
        )}
        <Link
          href={`${algoHref}#invest`}
          className="ml-auto min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors duration-150 rounded focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Add to watchlist"
        >
          <Star className="size-4" aria-hidden />
        </Link>
      </div>
    </Card>
  );
}
