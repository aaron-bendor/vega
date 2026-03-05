import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";
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
}: AlgorithmCardProps) {
  const visibleTags = tags.slice(0, 2);
  const extraCount = tags.length - 2;
  const hasMetrics = ret != null || volatility != null || maxDrawdown != null;
  const score = riskScore ?? riskLevelToScore(riskLevel);

  return (
    <Link
      href={`/vega-financial/algorithms/${id}`}
      className="focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-2xl block"
    >
      <Card className="h-full rounded-2xl border-primary/20 bg-primary/[0.03] transition-colors hover:border-primary/30 hover:bg-primary/5">
        <CardContent className="p-5">
          {/* Mobile / narrow: stacked */}
          <div className="flex flex-col gap-3 md:hidden">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-syne text-sm font-semibold text-foreground truncate">
                    {name}
                  </h3>
                  {verified && (
                    <ShieldCheck className="size-3.5 text-primary shrink-0" aria-label="Verified" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                  {shortDesc}
                </p>
                <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-2 text-[10px] text-muted-foreground">
                  <span>Risk: <span className="text-foreground font-medium">{riskLevel}</span></span>
                  <span>Style: <span className="text-foreground">{visibleTags[0] ?? "—"}</span></span>
                  <span>Asset: <span className="text-foreground">{visibleTags[1] ?? tags[2] ?? "—"}</span></span>
                </div>
              </div>
              <RiskBadge
                score={score}
                var95MonthlyPct={var95MonthlyPct}
                standardised={standardised}
                variant="compact"
              />
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

          {/* Desktop: single row */}
          <div className="hidden md:flex items-center gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-syne text-sm font-semibold text-foreground truncate">
                  {name}
                </h3>
                {verified && (
                  <ShieldCheck className="size-3.5 text-primary shrink-0" aria-label="Verified" />
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {shortDesc}
              </p>
              <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1.5 text-[10px] text-muted-foreground">
                <span>Risk: <span className="text-foreground font-medium">{riskLevel}</span></span>
                <span>Style: <span className="text-foreground">{visibleTags[0] ?? "—"}</span></span>
                <span>Asset: <span className="text-foreground">{visibleTags[1] ?? tags[2] ?? "—"}</span></span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0 max-w-[100px] flex-wrap justify-end">
              {visibleTags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-2 py-0.5 rounded-md border border-primary/20 text-muted-foreground truncate max-w-[56px]"
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
              <div className="flex items-center gap-4 shrink-0 tabular-nums">
                {ret != null && (
                  <div className="text-right w-14">
                    <div className="text-[10px] text-muted-foreground">Return</div>
                    <div className="text-xs font-medium text-foreground">
                      {formatPercent(ret)}
                    </div>
                  </div>
                )}
                {volatility != null && (
                  <div className="text-right w-12">
                    <div className="text-[10px] text-muted-foreground">Vol</div>
                    <div className="text-xs font-medium text-foreground">
                      {formatPercent(volatility)}
                    </div>
                  </div>
                )}
                {maxDrawdown != null && (
                  <div className="text-right w-14">
                    <div className="text-[10px] text-muted-foreground">Max DD</div>
                    <div className="text-xs font-medium text-foreground">
                      {formatPercent(maxDrawdown)}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-xs text-muted-foreground shrink-0 w-32 text-right">
                Run backtest to see metrics
              </div>
            )}
            <div className="shrink-0">
              <RiskBadge
                score={score}
                var95MonthlyPct={var95MonthlyPct}
                standardised={standardised}
                variant="compact"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
