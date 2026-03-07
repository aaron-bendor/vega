"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  /** When set, card supports click-to-zoom; this is the currently expanded card id. */
  expandedId?: string | null;
  /** Called when user expands or collapses a card. */
  onExpand?: (id: string | null) => void;
}

function riskLevelToScore(level: string): number {
  if (level === "Low") return 3;
  if (level === "High") return 8;
  return 5;
}

function riskBadgeVariant(level: string): "success" | "warning" | "destructive" {
  if (level === "Low") return "success";
  if (level === "High") return "destructive";
  return "warning";
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
  expandedId = null,
  onExpand,
}: AlgorithmCardProps) {
  const visibleTags = tags.slice(0, 2);
  const extraCount = tags.length - 2;
  const hasMetrics = ret != null || volatility != null || maxDrawdown != null;
  const score = riskScore ?? riskLevelToScore(riskLevel);
  const description = thesis ?? shortDesc;
  const isExpandable = typeof onExpand === "function";
  const isExpanded = isExpandable && expandedId === id;

  const toggleExpand = () => {
    if (!onExpand) return;
    if (isExpanded) onExpand(null);
    else onExpand(id);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (!onExpand) return;
    const target = e.target as HTMLElement;
    if (target.closest('a[href]')) return;
    toggleExpand();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleExpand();
    }
  };

  const cardContent = (
    <Card
      className={
        "group/card h-full rounded-2xl border border-border bg-card transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none relative overflow-visible " +
        (isExpandable
          ? "cursor-pointer hover:border-primary/60 hover:shadow-lg focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 "
          : "hover:border-primary/60 hover:shadow-md hover:-translate-y-0.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 ") +
        (isExpanded
          ? "scale-[1.02] sm:scale-[1.04] shadow-lg border-primary/50 ring-2 ring-primary/20 z-10"
          : "")
      }
    >
      <CardContent className="p-5 relative">
        <div className="absolute top-5 right-5 flex items-center gap-1">
          <RiskBadge
            score={score}
            var95MonthlyPct={var95MonthlyPct}
            standardised={standardised}
            variant="compact"
          />
        </div>

        {/* Mobile */}
        <div className="flex flex-col gap-3 md:hidden pr-20">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-syne text-sm font-semibold text-foreground truncate">{name}</h3>
              {verified && (
                <ShieldCheck className="size-3.5 text-primary shrink-0" aria-label="Verified" />
              )}
            </div>
            <p className={`text-xs text-muted-foreground mt-0.5 ${isExpanded ? "" : "line-clamp-2"}`}>
              {description}
            </p>
            {(isExpanded || !isExpandable) && bestFor && (
              <p className="text-[10px] text-muted-foreground mt-1">
                <span className="font-medium text-foreground">Best for:</span> {bestFor}
              </p>
            )}
            {(isExpanded || !isExpandable) && mayNotSuit && (
              <p className="text-[10px] text-muted-foreground line-clamp-1">
                <span className="font-medium text-foreground">May not suit:</span> {mayNotSuit}
              </p>
            )}
            {statusBadgeText && (
              <p className="text-[10px] text-muted-foreground mt-1.5 min-h-[1.25rem]">
                {statusBadgeText}
              </p>
            )}
            {!statusBadgeText && (
              <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-2 text-[10px] text-muted-foreground min-h-[1.25rem] items-center">
                <span className="flex items-center gap-1.5">
                  Risk:{" "}
                  <Badge variant={riskBadgeVariant(riskLevel)} className="text-[10px] font-medium px-2 py-0">
                    {riskLevel}
                  </Badge>
                </span>
                <span>Style: {visibleTags[0] ?? "—"}</span>
                <span>Asset: {visibleTags[1] ?? tags[2] ?? "—"}</span>
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {visibleTags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 rounded-md border border-border text-muted-foreground"
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
          {isExpanded && (
            <div className="mt-3 pt-3 border-t border-[rgba(51,51,51,0.08)]">
              <ViewTransitionLink
                href={`/vega-financial/algorithms/${id}`}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
                onClick={(e) => e.stopPropagation()}
              >
                View strategy
                <ChevronRight className="size-4" aria-hidden />
              </ViewTransitionLink>
            </div>
          )}
        </div>

        {/* Desktop */}
        <div className="hidden md:block pr-24">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-syne text-sm font-semibold text-foreground truncate">{name}</h3>
              {verified && (
                <ShieldCheck className="size-3.5 text-primary shrink-0" aria-label="Verified" />
              )}
            </div>
            <p
              className={`text-xs text-muted-foreground mt-0.5 ${
                isExpanded ? "" : "line-clamp-1"
              }`}
            >
              {description}
            </p>
            {(isExpanded || !isExpandable) && (
              <div className="pt-1.5 space-y-1">
                {bestFor && (
                  <p className="text-[10px] text-muted-foreground">
                    <span className="font-medium text-foreground">Best for:</span> {bestFor}
                  </p>
                )}
                {mayNotSuit && (
                  <p className="text-[10px] text-muted-foreground">
                    <span className="font-medium text-foreground">May not suit:</span> {mayNotSuit}
                  </p>
                )}
                {cardFooterMicrocopy && (
                  <p className="text-[10px] text-muted-foreground italic pt-0.5">
                    {cardFooterMicrocopy}
                  </p>
                )}
              </div>
            )}
            {statusBadgeText && (
              <p className="text-[10px] text-muted-foreground mt-1.5 min-h-[1.25rem]">
                {statusBadgeText}
              </p>
            )}
            {!statusBadgeText && (
              <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1.5 text-[10px] text-muted-foreground min-h-[1.25rem] items-baseline">
                <span className="flex items-center gap-1.5">
                  Risk:{" "}
                  <Badge variant={riskBadgeVariant(riskLevel)} className="text-[10px] font-medium px-2 py-0">
                    {riskLevel}
                  </Badge>
                </span>
                <span className="min-w-0">
                  Style: {visibleTags[0] ?? "—"}
                </span>
                <span className="min-w-0">Asset: {visibleTags[1] ?? tags[2] ?? "—"}</span>
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            {visibleTags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 rounded-md border border-border text-muted-foreground max-w-[7rem] truncate"
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
              {!cardFooterMicrocopy && (
                <div className="text-xs text-muted-foreground flex items-center gap-0.5">
                  Run backtest to see metrics
                  <ChevronRight
                    className="size-3.5 opacity-0 -translate-x-1 transition-[opacity,transform] duration-motion-normal ease-motion group-hover/card:opacity-100 group-hover/card:translate-x-0 group-focus-within/card:opacity-100 group-focus-within/card:translate-x-0 motion-reduce:transition-none shrink-0"
                    aria-hidden
                  />
                </div>
              )}
            </div>
          )}
          {isExpanded && (
            <div className="mt-3 pt-3 border-t border-[rgba(51,51,51,0.08)]">
              <ViewTransitionLink
                href={`/vega-financial/algorithms/${id}`}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
                onClick={(e) => e.stopPropagation()}
              >
                View strategy
                <ChevronRight className="size-4" aria-hidden />
              </ViewTransitionLink>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (isExpandable) {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={handleCardClick}
        onKeyDown={handleKeyDown}
        className="block min-w-0 min-h-[44px] rounded-2xl focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        style={id ? { viewTransitionName: `algo-card-${id}` } : undefined}
      >
        {cardContent}
      </div>
    );
  }

  return (
    <ViewTransitionLink
      href={`/vega-financial/algorithms/${id}`}
      className="block min-w-0 min-h-[44px] rounded-2xl focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      style={id ? { viewTransitionName: `algo-card-${id}` } : undefined}
    >
      {cardContent}
    </ViewTransitionLink>
  );
}
