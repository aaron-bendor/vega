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

const RANGES = ["1W", "1M", "3M", "1Y", "All"] as const;

interface DataPoint {
  label: string;
  value: number;
}

interface PortfolioPerformanceCardProps {
  /** Current portfolio value (end of series) */
  currentValue: number;
  /** Start value (e.g. initial cash). If not provided, use currentValue. */
  startValue?: number;
  /** Optional full time series. If not provided and only start→current, show empty state. */
  dataPoints?: DataPoint[];
  className?: string;
}

/**
 * Portfolio performance chart card with title, subtitle, time range tabs,
 * and explanation row. Shows neutral empty state when no real history.
 */
export function PortfolioPerformanceCard({
  currentValue,
  startValue,
  dataPoints,
  className,
}: PortfolioPerformanceCardProps) {
  const [range, setRange] = useState<(typeof RANGES)[number]>("All");

  const hasRealHistory = dataPoints && dataPoints.length >= 2;
  const effectiveStart = startValue ?? currentValue;
  const chartData: { label: string; value: number }[] = hasRealHistory
    ? dataPoints!
    : [
        { label: "Start", value: effectiveStart },
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
            How your account value has changed over time
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
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="px-4 pb-4 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
            <span>Includes invested strategies and available cash</span>
            <span>Simulated data</span>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center flex-1 min-h-[240px] sm:min-h-[280px] px-4 pb-6 text-center">
          <p className="text-sm text-muted-foreground">
            Your performance history will appear here after your first allocation.
          </p>
          <p className="text-[11px] text-muted-foreground/80 mt-2">
            Includes invested strategies and available cash · Simulated data
          </p>
        </div>
      )}
    </div>
  );
}
