"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface AllocationItem {
  name: string;
  value: number;
  color: string;
}

const COLORS = ["#793DE1", "#9877D1", "#531CB3", "#34D769", "#ED5A5A"];

interface AllocationDonutProps {
  data: { name: string; value: number }[];
}

export function AllocationDonut({ data }: AllocationDonutProps) {
  if (!data.length) {
    return (
      <div className="h-[200px] flex items-center justify-center text-sm text-muted-foreground">
        No allocation yet
      </div>
    );
  }

  const chartData: AllocationItem[] = data.map((d, i) => ({
    ...d,
    color: COLORS[i % COLORS.length],
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart margin={{ top: 8, right: 8, bottom: 56, left: 8 }}>
        <Pie
          data={chartData}
          cx="50%"
          cy="45%"
          innerRadius={52}
          outerRadius={68}
          paddingAngle={2}
          dataKey="value"
        >
          {chartData.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "#FFFFFF",
            border: "1px solid rgba(51,51,51,0.18)",
            borderRadius: 8,
            fontSize: 13,
          }}
          formatter={(value: number | undefined) => [`${(value ?? 0).toFixed(1)}%`, "Allocation"]}
        />
        <Legend
          verticalAlign="bottom"
          height={44}
          wrapperStyle={{ paddingTop: 8 }}
          formatter={(value) => <span className="text-xs text-foreground">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
