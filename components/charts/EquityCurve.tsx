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
  dates?: string[];
}

export function EquityCurve({ data, dates }: EquityCurveProps) {
  if (!data?.length) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center rounded-lg border border-dashed border-[rgba(51,51,51,0.18)] bg-[rgba(51,51,51,0.02)]">
        <p className="text-sm text-muted-foreground">
          No equity data yet. Run a backtest or ensure data is cached.
        </p>
      </div>
    );
  }
  if (data.length < 2) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center rounded-lg border border-dashed border-[rgba(51,51,51,0.18)] bg-[rgba(51,51,51,0.02)]">
        <p className="text-sm text-muted-foreground">
          Not enough bars for a chart. Need at least 2 data points.
        </p>
      </div>
    );
  }
  const chartData = [...data]
    .sort((a, b) => a.dayIndex - b.dayIndex)
    .map((p, i) => ({
      day: dates?.[i] ?? p.dayIndex,
      value: p.value,
    }));

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(51,51,51,0.10)" />
          <XAxis dataKey="day" tick={{ fill: "#333333", fontSize: 12 }} />
          <YAxis tickFormatter={(v) => v.toLocaleString()} tick={{ fill: "#333333", fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#FFFFFF",
              border: "1px solid rgba(51,51,51,0.18)",
              borderRadius: 8,
              fontSize: 13,
            }}
            labelStyle={{ color: "#111111", fontWeight: 600 }}
            itemStyle={{ color: "#333333" }}
            formatter={(value: number | undefined) => [value != null ? value.toFixed(2) : "", "Value"]}
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
