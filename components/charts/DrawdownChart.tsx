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

export function DrawdownChart({ equityData }: DrawdownChartProps) {
  const dd = computeDrawdown(equityData);
  if (!dd.length) {
    return (
      <div className="h-[200px] w-full flex items-center justify-center rounded-md border border-dashed bg-muted/30">
        <p className="text-sm text-muted-foreground">
          No drawdown data. Run a backtest first.
        </p>
      </div>
    );
  }
  const data = [...dd]
    .sort((a, b) => a.dayIndex - b.dayIndex)
    .map((d) => ({
      day: d.dayIndex,
      drawdown: d.drawdown,
      display: `Day ${d.dayIndex}: ${d.drawdown.toFixed(2)}%`,
    }));

  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="day" />
          <YAxis tickFormatter={(v) => `${v}%`} />
          <Tooltip formatter={(value: number | undefined) => [`${value != null ? value.toFixed(2) : ""}%`, "Drawdown"]} />
          <Area
            type="monotone"
            dataKey="drawdown"
            stroke="hsl(var(--destructive))"
            fill="hsl(var(--destructive) / 0.2)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
