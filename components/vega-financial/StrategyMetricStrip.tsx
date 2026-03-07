"use client";

import { formatPercent } from "@/lib/utils/format";
import { METRIC_LABELS } from "@/lib/vega-financial/investor-copy";
import { cn } from "@/lib/utils";

export type DataConfidenceLevel = "High" | "Medium" | "Low";

interface StrategyMetricStripProps {
  returnPct?: number | null;
  maxDrawdown?: number | null;
  riskAdjustedReturn?: number | null;
  /** e.g. "5 years" or "6 months" */
  trackRecordLength?: string | null;
  dataConfidence?: DataConfidenceLevel | null;
  /** Optional: explainer for each metric (tooltip/sheet) */
  onMetricExplain?: (metricKey: string) => void;
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
  onClick,
}: {
  label: string;
  value: React.ReactNode;
  explanation: string;
  onClick?: () => void;
}) {
  const content = (
    <div className="rounded-xl border border-border bg-card p-3 min-w-[140px] sm:min-w-0 flex-shrink-0 sm:flex-shrink flex flex-col gap-0.5">
      <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
      <p className="text-base font-semibold tabular-nums text-foreground">{value}</p>
      <p className="text-[10px] text-muted-foreground leading-tight line-clamp-2">{explanation}</p>
    </div>
  );
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="text-left focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
      >
        {content}
      </button>
    );
  }
  return content;
}

export function StrategyMetricStrip({
  returnPct,
  maxDrawdown,
  riskAdjustedReturn,
  trackRecordLength,
  dataConfidence,
  onMetricExplain,
  className,
}: StrategyMetricStripProps) {
  const cards = [
    {
      key: "return",
      label: METRIC_LABELS.return,
      value: returnPct != null ? `${returnPct >= 0 ? "+" : ""}${formatPercent(returnPct)}` : "—",
      explanation: CARD_EXPLANATIONS.return,
    },
    {
      key: "biggestDrop",
      label: METRIC_LABELS.biggestDrop,
      value: maxDrawdown != null ? formatPercent(maxDrawdown) : "—",
      explanation: CARD_EXPLANATIONS.biggestDrop,
    },
    {
      key: "riskAdjustedReturn",
      label: METRIC_LABELS.riskAdjustedReturn,
      value: riskAdjustedReturn != null ? riskAdjustedReturn.toFixed(2) : "—",
      explanation: CARD_EXPLANATIONS.riskAdjustedReturn,
    },
    {
      key: "trackRecordLength",
      label: "Track record length",
      value: trackRecordLength ?? "—",
      explanation: CARD_EXPLANATIONS.trackRecordLength,
    },
    {
      key: "dataConfidence",
      label: "Data confidence",
      value: dataConfidence ?? "—",
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
              onClick={onMetricExplain ? () => onMetricExplain(c.key) : undefined}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
