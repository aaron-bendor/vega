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

interface DashboardPortfolioChartProps {
  /** Current portfolio value from shared store (same as KPI cards). */
  currentValue: number;
  /** @deprecated Do not pass a fixed start (e.g. £100k); when no history, chart shows flat at currentValue. */
  startValue?: number;
  /** Optional real time series from store. If not provided, chart shows flat line and "unavailable" copy. */
  dataPoints?: DataPoint[];
  className?: string;
}

/**
 * Portfolio value chart. Uses shared store current value only when no real
 * history exists: shows a flat line at current value and explanatory copy
 * so the chart never contradicts KPI cards or implies a fake trend.
 */
export function DashboardPortfolioChart({
  currentValue,
  startValue: _startValue,
  dataPoints,
  className,
}: DashboardPortfolioChartProps) {
  void _startValue; // optional prop for future use
  const [range, setRange] = useState<(typeof RANGES)[number]>("All");

  const hasHistory = dataPoints && dataPoints.length >= 2;
  const chartData: { label: string; value: number }[] = hasHistory
    ? dataPoints
    : [
        { label: "Start", value: currentValue },
        { label: "Now", value: currentValue },
      ];

  if (chartData.length < 2) {
    return (
      <div
        className={cn(
          "rounded-xl border border-border bg-card p-6 flex flex-col items-center justify-center min-h-[280px] text-center",
          className
        )}
      >
        <p className="text-sm text-muted-foreground">
          Add algorithms to your portfolio to see performance over time.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("rounded-xl border border-border bg-card overflow-hidden", className)}>
      <div className="flex items-center justify-between gap-2 px-4 pt-4 pb-2">
        <h3 className="text-sm font-semibold text-foreground">Portfolio value</h3>
        {hasHistory && (
          <div className="flex rounded-lg border border-border bg-muted/30 p-0.5">
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
      <div className="h-[260px] w-full px-2 pb-2">
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
                value != null ? `£${value.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "—",
                "Value",
              ]}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="rgb(var(--primary))"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {!hasHistory && (
        <p className="px-4 pb-4 text-[11px] text-muted-foreground">
          Historical portfolio series is unavailable in the current demo.
        </p>
      )}
    </div>
  );
}
