"use client";

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

interface EquityPoint {
  dayIndex: number;
  value: number;
}

interface EquityCurveProps {
  data: EquityPoint[];
  /** Optional start date (YYYY-MM-DD) to show calendar dates on x-axis. */
  startDate?: string;
  /** Optional precomputed date labels (one per point, same order as sorted data). */
  dates?: string[];
  /** Optional className for the chart container (e.g. h-[120px] for compact hero). */
  className?: string;
}

function addDays(isoDate: string, days: number): string {
  const d = new Date(isoDate + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function formatAxisDate(isoDate: string): string {
  const d = new Date(isoDate + "T12:00:00Z");
  const day = d.getUTCDate();
  const month = d.toLocaleDateString("en-GB", { month: "short" });
  const year = d.getUTCFullYear();
  return `${day} ${month} ${year}`;
}

export function EquityCurve({ data, startDate, dates, className }: EquityCurveProps) {
  const heightClass = className ?? "h-[300px]";
  if (!data?.length) {
    return (
      <div className={cn(heightClass, "w-full flex items-center justify-center rounded-lg border border-dashed border-[rgba(51,51,51,0.18)] bg-[rgba(51,51,51,0.02)]")}>
        <p className="text-sm text-muted-foreground">
          No equity data yet. Run a backtest or ensure data is cached.
        </p>
      </div>
    );
  }
  if (data.length < 2) {
    return (
      <div className={cn(heightClass, "w-full flex items-center justify-center rounded-lg border border-dashed border-[rgba(51,51,51,0.18)] bg-[rgba(51,51,51,0.02)]")}>
        <p className="text-sm text-muted-foreground">
          Not enough bars for a chart. Need at least 2 data points.
        </p>
      </div>
    );
  }
  const sorted = [...data].sort((a, b) => a.dayIndex - b.dayIndex);
  const chartData = sorted.map((p, i) => {
    const dateLabel =
      dates?.[i] ??
      (startDate ? formatAxisDate(addDays(startDate, p.dayIndex)) : `Day ${p.dayIndex}`);
    return { day: dateLabel, value: p.value };
  });

  return (
    <div className={cn(heightClass, "w-full")}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(51,51,51,0.10)" />
          <XAxis
            dataKey="day"
            tick={{ fill: "#333333", fontSize: 11 }}
            interval="preserveStartEnd"
          />
          <YAxis
            tickFormatter={(v) => v.toLocaleString()}
            tick={{ fill: "#333333", fontSize: 12 }}
            label={{
              value: "Portfolio value (£)",
              angle: -90,
              position: "insideLeft",
              style: { fill: "#333333", fontSize: 12, textAnchor: "middle" },
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#FFFFFF",
              border: "1px solid rgba(51,51,51,0.18)",
              borderRadius: 8,
              fontSize: 13,
            }}
            labelStyle={{ color: "#111111", fontWeight: 600 }}
            itemStyle={{ color: "#333333" }}
            formatter={(value: number | undefined) => [
              value != null ? value.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "",
              "Portfolio value (£)",
            ]}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#793DE1"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
