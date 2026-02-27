"use client";

import type { InvestableAttributes } from "@/lib/vega-financial/types";

interface InvestableAttributesStripProps {
  attributes: InvestableAttributes;
  /** Compact for cards, default for detail page. */
  variant?: "compact" | "default";
  className?: string;
}

const LABELS: Record<keyof InvestableAttributes, string> = {
  experience: "Experience",
  marketCorrelation: "Market corr.",
  riskStability: "Risk stability",
  riskAdjustment: "Risk adj.",
  performancePercentile: "Performance %",
};

function formatValue(key: keyof InvestableAttributes, value: number): string {
  if (key === "experience") return `${value} mo`;
  return `${value}`;
}

export function InvestableAttributesStrip({
  attributes,
  variant = "default",
  className = "",
}: InvestableAttributesStripProps) {
  const entries = (Object.entries(attributes) as [keyof InvestableAttributes, number][])
    .filter(([, v]) => v != null && !Number.isNaN(v));

  if (entries.length === 0) return null;

  const isCompact = variant === "compact";

  return (
    <div
      className={`flex flex-wrap items-center gap-x-4 gap-y-2 ${isCompact ? "text-[10px]" : "text-xs"} text-muted-foreground ${className}`}
      role="list"
      aria-label="Investable attributes"
    >
      {entries.map(([key, value]) => (
        <div key={key} className="flex items-baseline gap-1.5" role="listitem">
          <span className="font-medium text-foreground tabular-nums">
            {formatValue(key, value)}
          </span>
          <span>{LABELS[key]}</span>
        </div>
      ))}
    </div>
  );
}
