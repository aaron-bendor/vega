"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type SortOption = "return" | "sharpe" | "drawdown" | "newest";

const OPTIONS: { value: SortOption; label: string }[] = [
  { value: "return", label: "Return" },
  { value: "sharpe", label: "Sharpe" },
  { value: "drawdown", label: "Drawdown" },
  { value: "newest", label: "Newest" },
];

interface SortSelectProps {
  value: SortOption;
  onValueChange: (v: SortOption) => void;
}

export function SortSelect({ value, onValueChange }: SortSelectProps) {
  return (
    <Select value={value} onValueChange={(v) => onValueChange(v as SortOption)}>
      <SelectTrigger className="w-[140px]">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        {OPTIONS.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
