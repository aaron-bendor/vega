"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { RiskExplainerSheet } from "./RiskExplainerSheet";

export interface RiskBadgeProps {
  /** 1–10 risk score (eToro-style fast read). */
  score: number;
  /** 95% monthly VaR as decimal (e.g. 0.05 = 5%). Shown in explainer. */
  var95MonthlyPct?: number;
  /** True if strategy is risk-standardised (Darwinex investable asset). */
  standardised?: boolean;
  /** Optional label override; defaults to "Risk" */
  label?: string;
  /** Size: compact for cards/rows, default for hero. */
  variant?: "compact" | "default";
  className?: string;
}

export function RiskBadge({
  score,
  var95MonthlyPct,
  standardised = false,
  label = "Risk",
  variant = "default",
  className = "",
}: RiskBadgeProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const clamped = Math.max(1, Math.min(10, Math.round(score)));
  const isLow = clamped <= 3;
  const isHigh = clamped >= 7;

  return (
    <>
      <button
        type="button"
        onClick={() => setSheetOpen(true)}
        className={`inline-flex items-center gap-1.5 rounded-md border transition-colors hover:bg-[rgba(51,51,51,0.04)] focus:outline-none focus:ring-2 focus:ring-primary/20 ${className} ${
          variant === "compact"
            ? "border-[rgba(51,51,51,0.18)] px-1.5 py-0.5 text-[10px] font-medium"
            : "border-[rgba(51,51,51,0.18)] px-2 py-1 text-xs font-medium"
        } ${isLow ? "text-brand-green border-brand-green/40" : isHigh ? "text-brand-red border-brand-red/40" : "text-muted-foreground"}`}
        aria-label={`${label} score ${clamped} of 10. Click for explanation.`}
      >
        <AlertTriangle className={variant === "compact" ? "size-2.5" : "size-3"} aria-hidden />
        <span className="tabular-nums">{clamped}/10</span>
        {standardised && (
          <span className="rounded bg-primary/10 px-1 py-0.5 text-[10px] text-primary">
            Std
          </span>
        )}
      </button>
      <RiskExplainerSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        riskScore={clamped}
        var95MonthlyPct={var95MonthlyPct}
        standardised={standardised}
      />
    </>
  );
}
