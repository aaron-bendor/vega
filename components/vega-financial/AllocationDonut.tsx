"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface AllocationItem {
  name: string;
  value: number;
  color: string;
}

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

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
          formatter={(value: number | undefined) => [`${(value ?? 0).toFixed(1)}%`, "Allocation"]}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
