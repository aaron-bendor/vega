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
      <div className="h-[180px] sm:h-[200px] flex items-center justify-center text-sm text-muted-foreground min-w-0">
        No allocation yet
      </div>
    );
  }

  const chartData: AllocationItem[] = data.map((d, i) => ({
    ...d,
    color: COLORS[i % COLORS.length],
  }));

  return (
    <div className="w-full min-w-0 h-[200px] sm:h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
      <PieChart margin={{ top: 8, right: 8, bottom: 56, left: 8 }}>
        <Pie
          data={chartData}
          cx="50%"
          cy="45%"
          innerRadius={52}
          outerRadius={68}
          paddingAngle={2}
          dataKey="value"
          animationBegin={0}
          animationDuration={900}
          animationEasing="ease-out"
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
            minWidth: "16rem",
            maxWidth: "22rem",
            lineHeight: 1.45,
            padding: "10px 14px",
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
    </div>
  );
}
