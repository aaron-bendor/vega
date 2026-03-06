import { Card, CardContent } from "@/components/ui/card";
import { ViewTransitionLink } from "@/components/ui/ViewTransitionLink";
import { ShieldCheck, ChevronRight } from "lucide-react";
import { formatPercent } from "@/lib/utils/format";
import { RiskBadge } from "./RiskBadge";

interface AlgorithmCardProps {
  id: string;
  name: string;
  shortDesc: string;
  tags: string[];
  riskLevel: string;
  riskScore?: number;
  var95MonthlyPct?: number;
  standardised?: boolean;
  verified?: boolean;
  return?: number;
  volatility?: number;
  maxDrawdown?: number;
  sparklineData?: number[];
  thesis?: string;
  bestFor?: string;
  mayNotSuit?: string;
  statusBadgeText?: string;
  cardFooterMicrocopy?: string;
}

function riskLevelToScore(level: string): number {
  if (level === "Low") return 3;
  if (level === "High") return 8;
  return 5;
}

export function AlgorithmCard({
  id,
  name,
  shortDesc,
  tags,
  riskLevel,
  riskScore,
  var95MonthlyPct,
  standardised,
  verified,
  return: ret,
  volatility,
  maxDrawdown,
  thesis,
  bestFor,
  mayNotSuit,
  statusBadgeText,
  cardFooterMicrocopy,
}: AlgorithmCardProps) {
  const visibleTags = tags.slice(0, 2);
  const extraCount = tags.length - 2;
  const hasMetrics = ret != null || volatility != null || maxDrawdown != null;
  const score = riskScore ?? riskLevelToScore(riskLevel);
  const description = thesis ?? shortDesc;

  return (
    <ViewTransitionLink
      href={`/vega-financial/algorithms/${id}`}
      className="group/card focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-2xl block min-w-0 min-h-[44px]"
    >
      <div
        className="h-full min-w-0"
        style={id ? { viewTransitionName: `algo-card-${id}` } : undefined}
      >
        <Card className="group/card h-full rounded-2xl border-primary/20 bg-primary/[0.03] transition-[box-shadow,border-color,background-color,transform] duration-200 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:border-primary/30 hover:bg-primary/5 hover:shadow-md hover:shadow-primary/5 hover:-translate-y-0.5 motion-reduce:transition-none relative overflow-visible">
          {/* Left accent bar: scales in on hover/focus-visible */}
          <span
            aria-hidden
            className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full bg-primary/50 origin-bottom scale-y-0 transition-transform duration-200 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover/card:scale-y-100 group-focus-within/card:scale-y-100 motion-reduce:transition-none"
          />
        <CardContent className="p-5 relative">
          {/* Risk badge: fixed top-right so all cards align */}
          <div className="absolute top-5 right-5 flex items-center gap-1">
            <RiskBadge
              score={score}
              var95MonthlyPct={var95MonthlyPct}
              standardised={standardised}
              variant="compact"
            />
          </div>

          {/* Mobile / narrow: stacked */}
          <div className="flex flex-col gap-3 md:hidden pr-20">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-syne text-sm font-semibold text-foreground truncate">
                  {name}
                </h3>
                {verified && (
                  <ShieldCheck className="size-3.5 text-primary shrink-0" aria-label="Verified" />
                )}
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                {description}
              </p>
              {bestFor && (
                <p className="text-[10px] text-muted-foreground mt-1 line-clamp-1">
                  <span className="font-medium text-foreground">Best for:</span> {bestFor}
                </p>
              )}
              {mayNotSuit && (
                <p className="text-[10px] text-muted-foreground line-clamp-1">
                  <span className="font-medium text-foreground">May not suit:</span> {mayNotSuit}
                </p>
              )}
              {statusBadgeText ? (
                <p className="text-[10px] text-muted-foreground mt-1.5 min-h-[1.25rem]">
                  {statusBadgeText}
                </p>
              ) : (
                <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-2 text-[10px] text-muted-foreground min-h-[1.25rem]">
                  <span>Risk: <span className="text-foreground font-medium">{riskLevel}</span></span>
                  <span>Style: <span className="text-foreground truncate max-w-[6rem] inline-block align-bottom" title={visibleTags[0]}>{visibleTags[0] ?? "—"}</span></span>
                  <span>Asset: <span className="text-foreground truncate max-w-[6rem] inline-block align-bottom" title={visibleTags[1] ?? tags[2]}>{visibleTags[1] ?? tags[2] ?? "—"}</span></span>
                </div>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {visibleTags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-2 py-0.5 rounded-md border border-primary/20 text-muted-foreground"
                  title={tag}
                >
                  {tag}
                </span>
              ))}
              {extraCount > 0 && (
                <span className="text-[10px] text-muted-foreground">+{extraCount}</span>
              )}
            </div>
            {hasMetrics && (
              <div className="flex gap-4 text-xs tabular-nums pt-1 border-t border-[rgba(51,51,51,0.08)]">
                {ret != null && (
                  <span>
                    <span className="text-muted-foreground">Return </span>
                    <span className="font-medium text-foreground">{formatPercent(ret)}</span>
                  </span>
                )}
                {volatility != null && (
                  <span>
                    <span className="text-muted-foreground">Vol </span>
                    <span className="font-medium text-foreground">{formatPercent(volatility)}</span>
                  </span>
                )}
                {maxDrawdown != null && (
                  <span>
                    <span className="text-muted-foreground">Max DD </span>
                    <span className="font-medium text-foreground">{formatPercent(maxDrawdown)}</span>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Desktop: grid for consistent alignment across cards */}
          <div className="hidden md:block pr-24">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-syne text-sm font-semibold text-foreground truncate">
                  {name}
                </h3>
                {verified && (
                  <ShieldCheck className="size-3.5 text-primary shrink-0" aria-label="Verified" />
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {description}
              </p>
              {bestFor && (
                <p className="text-[10px] text-muted-foreground mt-1 truncate">
                  <span className="font-medium text-foreground">Best for:</span> {bestFor}
                </p>
              )}
              {mayNotSuit && (
                <p className="text-[10px] text-muted-foreground truncate">
                  <span className="font-medium text-foreground">May not suit:</span> {mayNotSuit}
                </p>
              )}
              {statusBadgeText ? (
                <p className="text-[10px] text-muted-foreground mt-1.5 min-h-[1.25rem]">
                  {statusBadgeText}
                </p>
              ) : (
                <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1.5 text-[10px] text-muted-foreground min-h-[1.25rem] items-baseline">
                  <span>Risk: <span className="text-foreground font-medium">{riskLevel}</span></span>
                  <span className="min-w-0">Style: <span className="text-foreground truncate max-w-[5.5rem] inline-block align-baseline" title={visibleTags[0]}>{visibleTags[0] ?? "—"}</span></span>
                  <span className="min-w-0">Asset: <span className="text-foreground truncate max-w-[5.5rem] inline-block align-baseline" title={visibleTags[1] ?? tags[2]}>{visibleTags[1] ?? tags[2] ?? "—"}</span></span>
                </div>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              {visibleTags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-2 py-0.5 rounded-md border border-primary/20 text-muted-foreground max-w-[7rem] truncate"
                  title={tag}
                >
                  {tag}
                </span>
              ))}
              {extraCount > 0 && (
                <span className="text-[10px] text-muted-foreground">+{extraCount}</span>
              )}
            </div>
            {hasMetrics ? (
              <div className="flex gap-4 text-xs tabular-nums mt-2 pt-2 border-t border-[rgba(51,51,51,0.08)]">
                {ret != null && (
                  <span>
                    <span className="text-muted-foreground">Return </span>
                    <span className="font-medium text-foreground">{formatPercent(ret)}</span>
                  </span>
                )}
                {volatility != null && (
                  <span>
                    <span className="text-muted-foreground">Vol </span>
                    <span className="font-medium text-foreground">{formatPercent(volatility)}</span>
                  </span>
                )}
                {maxDrawdown != null && (
                  <span>
                    <span className="text-muted-foreground">Max DD </span>
                    <span className="font-medium text-foreground">{formatPercent(maxDrawdown)}</span>
                  </span>
                )}
              </div>
            ) : (
              <div className="mt-2 pt-2 border-t border-[rgba(51,51,51,0.08)]">
                {cardFooterMicrocopy ? (
                  <p className="text-[10px] text-muted-foreground italic">{cardFooterMicrocopy}</p>
                ) : (
                  <div className="text-xs text-muted-foreground flex items-center gap-0.5">
                    Run backtest to see metrics
                    <ChevronRight className="size-3.5 opacity-0 -translate-x-1 transition-[opacity,transform] duration-motion-normal ease-motion group-hover/card:opacity-100 group-hover/card:translate-x-0 group-focus-within/card:opacity-100 group-focus-within/card:translate-x-0 motion-reduce:transition-none shrink-0" aria-hidden />
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      </div>
    </ViewTransitionLink>
  );
}
