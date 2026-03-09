"use client";

import { formatPercent } from "@/lib/utils/format";
import { InfoTooltip } from "@/components/vega-financial/InfoTooltip";
import { METRIC_LABELS } from "@/lib/vega-financial/investor-copy";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

const LEARN = ROUTES.vegaFinancial.learn;

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
  return: "Total change in value over the tested period (simulated).",
  biggestDrop: "Largest peak-to-trough fall before recovering.",
  riskAdjustedReturn: "Return per unit of risk over the tested period.",
  trackRecordLength: "Length of history used to produce these results.",
  dataConfidence: "Based on how much history is available for this strategy.",
};

function MetricCard({
  label,
  value,
  explanation,
  valueClassName,
  learnMoreHref,
}: {
  label: string;
  value: React.ReactNode;
  explanation: string;
  valueClassName?: string;
  learnMoreHref?: string;
}) {
  return (
    <div className="vf-surface-1 rounded-xl border vf-border-soft p-4 min-h-[88px] flex flex-col gap-2 min-w-[140px] sm:min-w-0">
      <div className="flex items-center gap-1.5">
        <p className="text-[11px] font-medium vf-text-muted">{label}</p>
        <InfoTooltip content={explanation} learnMoreHref={learnMoreHref} />
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
      label: METRIC_LABELS.return,
      value: formatPercent(returnPct),
      explanation: CARD_EXPLANATIONS.return,
      valueClassName: returnPct >= 0 ? "vf-text-positive" : "vf-text-negative",
      learnMoreHref: undefined as string | undefined,
    },
    maxDrawdown != null && {
      key: "maxDrawdown",
      label: METRIC_LABELS.biggestDrop,
      value: formatPercent(maxDrawdown),
      explanation: CARD_EXPLANATIONS.biggestDrop,
      valueClassName: "vf-text-negative",
      learnMoreHref: `${LEARN}#drawdown`,
    },
    riskAdjustedReturn != null && {
      key: "sharpe",
      label: METRIC_LABELS.riskAdjustedReturn,
      value: riskAdjustedReturn.toFixed(2),
      explanation: CARD_EXPLANATIONS.riskAdjustedReturn,
      valueClassName: undefined,
      learnMoreHref: `${LEARN}#risk-adjusted-return`,
    },
    trackRecordLength && {
      key: "trackRecord",
      label: "Track record",
      value: trackRecordLength,
      explanation: CARD_EXPLANATIONS.trackRecordLength,
      valueClassName: undefined,
      learnMoreHref: undefined as string | undefined,
    },
    dataConfidence && {
      key: "confidence",
      label: "Confidence",
      value: dataConfidence,
      explanation: CARD_EXPLANATIONS.dataConfidence,
      valueClassName: undefined,
      learnMoreHref: undefined as string | undefined,
    },
  ].filter(Boolean) as { key: string; label: string; value: React.ReactNode; explanation: string; valueClassName?: string; learnMoreHref?: string }[];

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
            learnMoreHref={c.learnMoreHref}
          />
        ))}
      </div>
    </div>
  );
}
