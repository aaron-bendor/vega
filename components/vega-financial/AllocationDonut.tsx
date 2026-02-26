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
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
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
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
