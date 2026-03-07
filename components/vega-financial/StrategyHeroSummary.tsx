"use client";

import { ShieldCheck, Target, PieChart, TrendingUp, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { DEFAULT_TRUST_PILLS } from "@/lib/vega-financial/strategy-copy";

interface StrategyHeroSummaryProps {
  name: string;
  verified: boolean;
  /** One-line plain-English summary */
  oneLineSummary: string;
  /** Microcopy under summary */
  heroMicrocopy?: string;
  /** Asset class e.g. Equity */
  assetClass?: string;
  /** Strategy style e.g. Momentum */
  strategyStyle?: string;
  /** Risk level e.g. Medium */
  riskLevel?: string | null;
  /** Four decision cards */
  bestFit?: string;
  portfolioRole?: string;
  worksBestIn?: string;
  mainRisk?: string;
  /** Compact trust pills */
  trustPills?: string[];
  /** Optional: Walkthrough / Replay link (rendered next to Help button, client-safe) */
  replayTutorialSlot?: React.ReactNode;
  className?: string;
}

const DECISION_CARDS = [
  { key: "bestFit" as const, label: "Best fit", icon: Target },
  { key: "portfolioRole" as const, label: "Portfolio role", icon: PieChart },
  { key: "worksBestIn" as const, label: "Works best in", icon: TrendingUp },
  { key: "mainRisk" as const, label: "Main risk", icon: AlertTriangle },
];

export function StrategyHeroSummary({
  name,
  verified,
  oneLineSummary,
  heroMicrocopy,
  assetClass,
  strategyStyle,
  riskLevel,
  bestFit,
  portfolioRole,
  worksBestIn,
  mainRisk,
  trustPills = DEFAULT_TRUST_PILLS,
  replayTutorialSlot,
  className,
}: StrategyHeroSummaryProps) {
  const decisionValues = { bestFit, portfolioRole, worksBestIn, mainRisk };
  const hasDecisionCards = Object.values(decisionValues).some(Boolean);

  const handleHelpClick = () => {
    window.dispatchEvent(new CustomEvent("algo-detail-how-to-read"));
  };

  return (
    <div className={cn("min-w-0 space-y-4", className)}>
      {/* Badges: Verified, Demo, Equity, Momentum, Medium risk */}
      <div className="flex flex-wrap items-center gap-1.5">
        {verified && (
          <span className="inline-flex items-center gap-1 rounded-md border border-primary/30 bg-primary/5 px-2 py-0.5 text-[11px] font-medium text-primary">
            <ShieldCheck className="size-3" aria-hidden /> Verified
          </span>
        )}
        <span className="rounded-md border border-border bg-muted/30 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
          Demo
        </span>
        {assetClass && (
          <span className="rounded-md border border-border bg-muted/30 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
            {assetClass}
          </span>
        )}
        {strategyStyle && (
          <span className="rounded-md border border-border bg-muted/30 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
            {strategyStyle}
          </span>
        )}
        {riskLevel && (
          <span className="rounded-md border border-border bg-muted/30 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
            {riskLevel} risk
          </span>
        )}
      </div>

      {/* Title */}
      <h1 className="font-maven-pro text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
        {name}
      </h1>

      {/* One-line summary + microcopy */}
      <p className="text-sm sm:text-base text-muted-foreground leading-snug max-w-2xl">
        {oneLineSummary}
      </p>
      {heroMicrocopy && (
        <p className="text-xs text-muted-foreground/90 leading-snug max-w-2xl">
          {heroMicrocopy}
        </p>
      )}

      {/* Four decision cards (standard glass, tint by purpose) */}
      {hasDecisionCards && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {DECISION_CARDS.map(({ key, label, icon: Icon }, i) => {
            const value = decisionValues[key];
            if (!value) return null;
            const tint = (["vf-glass-violet", "vf-glass-blue", "vf-glass-green", "vf-glass-amber"] as const)[i] ?? "vf-glass-violet";
            return (
              <div
                key={key}
                className={cn("vf-glass-card rounded-xl p-4 flex gap-3", tint)}
              >
                <div className="flex shrink-0 items-center justify-center size-8 rounded-lg bg-muted/50 text-muted-foreground">
                  <Icon className="size-4" aria-hidden />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
                  <p className="text-sm font-medium text-foreground mt-0.5">{value}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Compact trust pills (quiet glass) */}
      {trustPills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {trustPills.map((item) => (
            <span
              key={item}
              className="vf-glass-quiet inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
            >
              <span className="size-1.5 rounded-full bg-brand-green/60 shrink-0" aria-hidden />
              {item}
            </span>
          ))}
        </div>
      )}

      {/* Help + Walkthrough (top right, handlers live in client) */}
      <div className="flex justify-end items-center gap-2 pt-1">
        <button
          type="button"
          onClick={handleHelpClick}
          className="text-xs font-medium text-muted-foreground hover:text-foreground focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring rounded transition-colors"
        >
          Help
        </button>
        {replayTutorialSlot}
      </div>
    </div>
  );
}
