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

interface EquityPoint {
  dayIndex: number;
  value: number;
}

interface EquityCurveProps {
  data: EquityPoint[];
}

export function EquityCurve({ data }: EquityCurveProps) {
  if (!data?.length) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center rounded-md border border-dashed bg-muted/30">
        <p className="text-sm text-muted-foreground">
          No equity data yet. Run a backtest or ensure data is cached.
        </p>
      </div>
    );
  }
  if (data.length < 2) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center rounded-md border border-dashed bg-muted/30">
        <p className="text-sm text-muted-foreground">
          Not enough bars for a chart. Need at least 2 data points.
        </p>
      </div>
    );
  }
  const chartData = [...data]
    .sort((a, b) => a.dayIndex - b.dayIndex)
    .map((p) => ({
      day: p.dayIndex,
      value: p.value,
      display: `Day ${p.dayIndex}: ${p.value.toLocaleString("en-GB", { minimumFractionDigits: 2 })}`,
    }));

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="day" />
          <YAxis tickFormatter={(v) => v.toLocaleString()} />
          <Tooltip formatter={(value: number | undefined) => [value != null ? value.toFixed(2) : "", "Value"]} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="hsl(var(--chart-1))"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
