"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

const RANGES = ["1W", "1M", "3M", "1Y", "All"] as const;

interface DataPoint {
  label: string;
  value: number;
}

export interface HoldingContribution {
  name: string;
  currentValue: number;
}

interface PortfolioPerformanceCardProps {
  /** Current portfolio value (end of series) */
  currentValue: number;
  /** Start value (e.g. initial cash). If not provided, use currentValue. */
  startValue?: number;
  /** Optional full time series. If not provided and only start→current, show empty state. */
  dataPoints?: DataPoint[];
  /** Optional holdings for strategy-level contribution (value and % of total). */
  holdings?: HoldingContribution[];
  className?: string;
}

/**
 * Portfolio performance chart card with title, subtitle, time range tabs,
 * and explanation row. Shows neutral empty state when no real history.
 */
export function PortfolioPerformanceCard({
  currentValue,
  startValue: _startValue,
  dataPoints,
  holdings,
  className,
}: PortfolioPerformanceCardProps) {
  void _startValue; // optional prop for future use
  const [range, setRange] = useState<(typeof RANGES)[number]>("All");
  const totalEquity = currentValue;
  const hasHoldings = holdings && holdings.length > 0;
  const showContributionBlock = true; // Always show section so empty state is visible when no holdings
  const showContributionList = hasHoldings && totalEquity > 0;
  const sortedHoldings = showContributionList
    ? [...holdings!].sort((a, b) => b.currentValue - a.currentValue)
    : [];

  const hasRealHistory = dataPoints && dataPoints.length >= 2;
  const chartData: { label: string; value: number }[] = hasRealHistory
    ? dataPoints!
    : [
        { label: "Start", value: currentValue },
        { label: "Now", value: currentValue },
      ];

  const showChart = hasRealHistory && chartData.length >= 2;

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card overflow-hidden flex flex-col",
        className
      )}
    >
      <div className="flex flex-col gap-1 px-4 pt-4 pb-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Portfolio performance</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            How your demo account value has changed over time. Values are simulated.
          </p>
        </div>
        {showChart && (
          <div className="flex rounded-lg border border-border bg-muted/30 p-0.5 shrink-0 mt-2 sm:mt-0">
            {RANGES.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRange(r)}
                className={cn(
                  "px-2.5 py-1 text-xs font-medium rounded-md transition-colors",
                  range === r
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {r}
              </button>
            ))}
          </div>
        )}
      </div>

      {showChart ? (
        <>
          <div className="h-[220px] sm:h-[260px] w-full px-2 pb-2 flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(51,51,51,0.08)" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "rgb(115 115 115)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={(v) => `£${(v / 1000).toFixed(0)}k`}
                  tick={{ fill: "rgb(115 115 115)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={44}
                  domain={["dataMin - 100", "dataMax + 100"]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid rgba(51,51,51,0.12)",
                    borderRadius: 8,
                    fontSize: 12,
                    minWidth: "16rem",
                    maxWidth: "22rem",
                    lineHeight: 1.45,
                    padding: "10px 14px",
                  }}
                  formatter={(value: number | undefined) => [
                    value != null
                      ? `£${value.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                      : "—",
                    "Value",
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="rgb(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  isAnimationActive={true}
                  animationDuration={900}
                  animationEasing="ease-out"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="px-4 pb-4 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
            <span>Includes invested strategies and available cash</span>
            <span>Simulated data</span>
          </div>
          {showContributionBlock && (
            <div className="border-t border-border px-4 pb-4 pt-3">
              <h4 className="text-xs font-semibold text-foreground mb-1">
                Strategy contribution to portfolio value
              </h4>
              <p className="text-[11px] text-muted-foreground mb-2">
                Based on your <strong>current demo portfolio value</strong>. This is a snapshot of
                how much each strategy contributes now—simulated for the demo, not historical attribution.
              </p>
              {showContributionList ? (
                <ul className="space-y-1.5 text-sm" role="list">
                  {sortedHoldings.map((h) => {
                    const pct = totalEquity > 0 ? (h.currentValue / totalEquity) * 100 : 0;
                    return (
                      <li
                        key={h.name}
                        className="flex flex-wrap items-center justify-between gap-2 py-1.5 border-b border-border/60 last:border-0"
                      >
                        <span className="font-medium text-foreground truncate min-w-0">{h.name}</span>
                        <span className="tabular-nums text-muted-foreground shrink-0 text-right">
                          {formatCurrency(h.currentValue)} ({pct.toFixed(0)}%)
                        </span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-xs text-muted-foreground py-2">
                  No strategies in your portfolio yet. Allocate to strategies to see their share of
                  portfolio value here.
                </p>
              )}
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex flex-col items-center justify-center flex-1 min-h-[200px] sm:min-h-[220px] px-4 pb-4 text-center">
            <p className="text-sm text-muted-foreground">
              Portfolio history will appear here once performance data is available for your current holdings.
            </p>
            <p className="text-[11px] text-muted-foreground/80 mt-2">
              Includes invested strategies and available cash · Simulated data
            </p>
          </div>
          {showContributionBlock && (
            <div className="border-t border-border px-4 pb-4 pt-3">
              <h4 className="text-xs font-semibold text-foreground mb-1">
                Strategy contribution to portfolio value
              </h4>
              <p className="text-[11px] text-muted-foreground mb-2">
                Based on your <strong>current demo portfolio value</strong>. Simulated for the demo.
              </p>
              {showContributionList ? (
                <ul className="space-y-1.5 text-sm" role="list">
                  {sortedHoldings.map((h) => {
                    const pct = totalEquity > 0 ? (h.currentValue / totalEquity) * 100 : 0;
                    return (
                      <li
                        key={h.name}
                        className="flex flex-wrap items-center justify-between gap-2 py-1.5 border-b border-border/60 last:border-0"
                      >
                        <span className="font-medium text-foreground truncate min-w-0">{h.name}</span>
                        <span className="tabular-nums text-muted-foreground shrink-0 text-right">
                          {formatCurrency(h.currentValue)} ({pct.toFixed(0)}%)
                        </span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-xs text-muted-foreground py-2">
                  No strategies in your portfolio yet. Allocate to strategies to see their share here.
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
