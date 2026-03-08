"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPercent } from "@/lib/utils/format";
import { ShieldCheck, Star } from "lucide-react";
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

  return (
    <Card
      data-tour={dataTour}
      className={cn(
        "vf-card-hover h-full flex flex-col rounded-xl border border-border bg-card",
        "hover:border-primary/25 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:outline-none"
      )}
    >
      <CardHeader className="pb-3 flex-shrink-0 space-y-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {verified && (
            <span className="inline-flex items-center gap-1 rounded-md border border-primary/25 bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
              <ShieldCheck className="size-3" aria-hidden /> Verified
            </span>
          )}
          <span className="rounded-md border border-border bg-muted/50 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
            Simulated
          </span>
          {algorithm.riskLevel && (
            <Badge variant="outline" className="text-[11px] font-medium">
              {algorithm.riskLevel}
            </Badge>
          )}
        </div>
        <CardTitle className="font-maven-pro text-base font-semibold leading-tight">
          <Link
            href={`/vega-financial/algorithms/${algorithm.id}`}
            className="font-maven-pro text-foreground hover:text-primary transition-colors duration-150 focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
          >
            {algorithm.name}
          </Link>
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
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border/80">
          <Link
            href={`/vega-financial/algorithms/${algorithm.id}`}
            className="text-sm font-maven-pro font-medium text-primary hover:text-primary-hover transition-colors duration-150"
          >
            View details
          </Link>
          {onCompareToggle && (
            <button
              type="button"
              onClick={() => onCompareToggle(algorithm.id)}
              disabled={compareDisabled}
              className={cn(
                "text-sm font-medium disabled:opacity-50 transition-colors duration-150",
                compareSelected ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Compare
            </button>
          )}
          <Link
            href={`/vega-financial/algorithms/${algorithm.id}#invest`}
            className="ml-auto text-muted-foreground hover:text-foreground transition-colors duration-150"
            aria-label="Add to watchlist"
          >
            <Star className="size-4" aria-hidden />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
