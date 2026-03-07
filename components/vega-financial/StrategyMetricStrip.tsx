"use client";

import { formatPercent, UNAVAILABLE_IN_DEMO } from "@/lib/utils/format";
import { METRIC_LABELS } from "@/lib/vega-financial/investor-copy";
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
    <div className="rounded-xl border border-border bg-card p-3 min-w-[140px] sm:min-w-0 flex-shrink-0 sm:flex-shrink flex flex-col gap-0.5">
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
    {
      key: "return",
      label: METRIC_LABELS.return,
      value: returnPct != null ? formatPercent(returnPct) : UNAVAILABLE_IN_DEMO,
      explanation: CARD_EXPLANATIONS.return,
    },
    {
      key: "biggestDrop",
      label: METRIC_LABELS.biggestDrop,
      value: maxDrawdown != null ? formatPercent(maxDrawdown) : UNAVAILABLE_IN_DEMO,
      explanation: CARD_EXPLANATIONS.biggestDrop,
    },
    {
      key: "riskAdjustedReturn",
      label: METRIC_LABELS.riskAdjustedReturn,
      value: riskAdjustedReturn != null ? riskAdjustedReturn.toFixed(2) : UNAVAILABLE_IN_DEMO,
      explanation: CARD_EXPLANATIONS.riskAdjustedReturn,
    },
    {
      key: "trackRecordLength",
      label: "Track record length",
      value: trackRecordLength ?? UNAVAILABLE_IN_DEMO,
      explanation: CARD_EXPLANATIONS.trackRecordLength,
    },
    {
      key: "dataConfidence",
      label: METRIC_LABELS.dataConfidence,
      value: dataConfidence ?? UNAVAILABLE_IN_DEMO,
      explanation: CARD_EXPLANATIONS.dataConfidence,
    },
  ];

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
