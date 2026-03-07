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
}: {
  label: string;
  value: React.ReactNode;
  explanation: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-3 min-w-[140px] sm:min-w-0 flex-shrink-0 sm:flex-shrink flex flex-col gap-0.5 transition-[border-color,box-shadow] duration-200 hover:border-muted-foreground/25 hover:shadow-sm">
      <div className="flex items-center gap-1.5">
        <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
        <InfoTooltip content={explanation} />
      </div>
      <p className="text-base font-semibold tabular-nums text-foreground">{value}</p>
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
    },
    maxDrawdown != null && {
      key: "maxDrawdown",
      label: "Max drawdown",
      value: formatPercent(maxDrawdown),
      explanation: CARD_EXPLANATIONS.biggestDrop,
    },
    riskAdjustedReturn != null && {
      key: "sharpe",
      label: "Sharpe",
      value: riskAdjustedReturn.toFixed(2),
      explanation: CARD_EXPLANATIONS.riskAdjustedReturn,
    },
    trackRecordLength && {
      key: "trackRecord",
      label: "Track record",
      value: trackRecordLength,
      explanation: CARD_EXPLANATIONS.trackRecordLength,
    },
    dataConfidence && {
      key: "confidence",
      label: "Confidence",
      value: dataConfidence,
      explanation: CARD_EXPLANATIONS.dataConfidence,
    },
  ].filter(Boolean) as { key: string; label: string; value: React.ReactNode; explanation: string }[];

  return (
    <div className={cn("min-w-0", className)}>
      <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0 lg:grid-cols-5">
        {cards.map((c) => (
          <div key={c.key} className="snap-start sm:snap-align-none">
            <MetricCard
              label={c.label}
              value={c.value}
              explanation={c.explanation}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
