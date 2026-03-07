"use client";

import { type ReactNode } from "react";

interface MetricTooltipProps {
  /** Plain-English label shown in UI */
  label: ReactNode;
  /** Technical term for tooltip (e.g. "Sharpe ratio") */
  technicalTerm?: string;
  children?: ReactNode;
  className?: string;
}

/**
 * Wraps a metric label with an optional tooltip showing the technical term.
 */
export function MetricTooltip({ label, technicalTerm, children, className }: MetricTooltipProps) {
  const title = technicalTerm ? `${label} (${technicalTerm})` : undefined;
  return (
    <span title={title} className={className}>
      {children ?? label}
    </span>
  );
}
