"use client";

import { formatPercent } from "@/lib/utils/format";
import { InfoTooltip } from "@/components/vega-financial/InfoTooltip";
import { cn } from "@/lib/utils";

export type DataConfidenceLevel = "High" | "Medium" | "Low";

interface StrategyMetricStripProps {
  returnPct?: number | null;
  maxDrawdown?: number | null;
  riskAdjustedReturn?: number | null;
  /** e.g. "5 years" or "6 months" */
  trackRecordLength?: string | null;
  dataConfidence?: DataConfidenceLevel | null;
  className?: string;
}

const CARD_EXPLANATIONS: Record<string, string> = {
  return: "Total change in value over the tested period.",
  biggestDrop: "Largest peak-to-trough fall before recovering.",
  riskAdjustedReturn: "How much return the strategy delivered for the level of risk taken.",
  trackRecordLength: "Length of history used to produce these results.",
  dataConfidence: "Based on the amount of history available for this strategy.",
};

function MetricCard({
  label,
  value,
  explanation,
  valueClassName,
}: {
  label: string;
  value: React.ReactNode;
  explanation: string;
  valueClassName?: string;
}) {
  return (
    <div className="vf-surface-1 rounded-xl border vf-border-soft p-4 min-h-[88px] flex flex-col gap-2 min-w-[140px] sm:min-w-0">
      <div className="flex items-center gap-1.5">
        <p className="text-[11px] font-medium vf-text-muted">{label}</p>
        <InfoTooltip content={explanation} />
      </div>
      <p className={cn("text-base font-semibold tabular-nums mt-0.5", valueClassName ?? "text-foreground")}>
        {value}
      </p>
    </div>
  );
}

export function StrategyMetricStrip({
  returnPct,
  maxDrawdown,
  riskAdjustedReturn,
  trackRecordLength,
  dataConfidence,
  className,
}: StrategyMetricStripProps) {
  const cards = [
    returnPct != null && {
      key: "return",
      label: "Return",
      value: formatPercent(returnPct),
      explanation: CARD_EXPLANATIONS.return,
      valueClassName: returnPct >= 0 ? "vf-text-positive" : "vf-text-negative",
    },
    maxDrawdown != null && {
      key: "maxDrawdown",
      label: "Max drawdown",
      value: formatPercent(maxDrawdown),
      explanation: CARD_EXPLANATIONS.biggestDrop,
      valueClassName: "vf-text-negative",
    },
    riskAdjustedReturn != null && {
      key: "sharpe",
      label: "Sharpe",
      value: riskAdjustedReturn.toFixed(2),
      explanation: CARD_EXPLANATIONS.riskAdjustedReturn,
      valueClassName: undefined,
    },
    trackRecordLength && {
      key: "trackRecord",
      label: "Track record",
      value: trackRecordLength,
      explanation: CARD_EXPLANATIONS.trackRecordLength,
      valueClassName: undefined,
    },
    dataConfidence && {
      key: "confidence",
      label: "Confidence",
      value: dataConfidence,
      explanation: CARD_EXPLANATIONS.dataConfidence,
      valueClassName: undefined,
    },
  ].filter(Boolean) as { key: string; label: string; value: React.ReactNode; explanation: string; valueClassName?: string }[];

  return (
    <div className={cn("min-w-0", className)}>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {cards.map((c) => (
          <MetricCard
            key={c.key}
            label={c.label}
            value={c.value}
            explanation={c.explanation}
            valueClassName={c.valueClassName}
          />
        ))}
      </div>
    </div>
  );
}
