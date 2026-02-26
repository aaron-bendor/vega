import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";
import { formatPercent } from "@/lib/utils/format";

interface AlgorithmCardProps {
  id: string;
  name: string;
  shortDesc: string;
  tags: string[];
  riskLevel: string;
  verified?: boolean;
  return?: number;
  volatility?: number;
  maxDrawdown?: number;
  sparklineData?: number[];
}

function riskClass(level: string) {
  if (level === "Low") return "text-brand-green";
  if (level === "High") return "text-brand-red";
  return "text-muted-foreground";
}

export function AlgorithmCard({
  id,
  name,
  shortDesc,
  tags,
  riskLevel,
  verified,
  return: ret,
  volatility,
  maxDrawdown,
}: AlgorithmCardProps) {
  const visibleTags = tags.slice(0, 2);
  const extraCount = tags.length - 2;
  const hasMetrics = ret != null || volatility != null || maxDrawdown != null;

  return (
    <Link href={`/vega-financial/algorithms/${id}`}>
      <Card className="h-full transition-colors hover:border-[rgba(51,51,51,0.18)] hover:bg-[rgba(51,51,51,0.02)]">
        <CardContent className="p-4">
          {/* Mobile / narrow: stacked */}
          <div className="flex flex-col gap-3 md:hidden">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-foreground truncate">
                    {name}
                  </h3>
                  {verified && (
                    <ShieldCheck className="size-3.5 text-primary shrink-0" aria-label="Verified" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                  {shortDesc}
                </p>
              </div>
              <span className={`text-xs font-medium shrink-0 ${riskClass(riskLevel)}`}>
                {riskLevel}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {visibleTags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-1.5 py-0.5 rounded border border-[rgba(51,51,51,0.18)] text-muted-foreground"
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
                <h3 className="text-sm font-semibold text-foreground truncate">
                  {name}
                </h3>
                {verified && (
                  <ShieldCheck className="size-3.5 text-primary shrink-0" aria-label="Verified" />
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {shortDesc}
              </p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0 max-w-[120px] flex-wrap justify-end">
              {visibleTags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-1.5 py-0.5 rounded border border-[rgba(51,51,51,0.18)] text-muted-foreground truncate max-w-[56px]"
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
              <div className="text-xs text-muted-foreground shrink-0 w-20 text-right">
                Run backtest for metrics
              </div>
            )}
            <div className={`text-[10px] font-medium w-12 text-center shrink-0 ${riskClass(riskLevel)}`}>
              {riskLevel}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
