"use client";

import {
  AreaChart,
  Area,
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

interface DrawdownChartProps {
  equityData: EquityPoint[];
  dates?: string[];
}

function computeDrawdown(equity: EquityPoint[]): { dayIndex: number; drawdown: number }[] {
  if (!equity?.length) return [];
  let peak = equity[0]?.value ?? 0;
  return equity.map((p) => {
    peak = Math.max(peak, p.value);
    const dd = peak > 0 ? (p.value / peak - 1) * 100 : 0;
    return { dayIndex: p.dayIndex, drawdown: dd };
  });
}

export function DrawdownChart({ equityData, dates }: DrawdownChartProps) {
  const dd = computeDrawdown(equityData);
  if (!dd.length) {
    return (
      <div className="h-[200px] w-full flex items-center justify-center rounded-lg border border-dashed border-[rgba(51,51,51,0.18)] bg-[rgba(51,51,51,0.02)]">
        <p className="text-sm text-muted-foreground">
          No drawdown data. Run a backtest first.
        </p>
      </div>
    );
  }
  const data = [...dd]
    .sort((a, b) => a.dayIndex - b.dayIndex)
    .map((d, i) => ({
      day: dates?.[i] ?? d.dayIndex,
      drawdown: d.drawdown,
    }));

  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(51,51,51,0.10)" />
          <XAxis dataKey="day" tick={{ fill: "#333333", fontSize: 12 }} />
          <YAxis tickFormatter={(v) => `${v}%`} tick={{ fill: "#333333", fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#FFFFFF",
              border: "1px solid rgba(51,51,51,0.18)",
              borderRadius: 8,
              fontSize: 13,
            }}
            labelStyle={{ color: "#111111", fontWeight: 600 }}
            itemStyle={{ color: "#333333" }}
            formatter={(value: number | undefined) => [`${value != null ? value.toFixed(2) : ""}%`, "Drawdown"]}
          />
          <Area
            type="monotone"
            dataKey="drawdown"
            stroke="#ED5A5A"
            fill="rgba(237,90,90,0.15)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
