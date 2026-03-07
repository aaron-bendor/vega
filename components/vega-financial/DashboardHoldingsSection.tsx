"use client";

import Link from "next/link";
import { formatCurrency, formatPercent } from "@/lib/utils/format";
import { cn } from "@/lib/utils";
import type { MockHolding } from "@/lib/mock/portfolio";
import { RiskExplainerSheet } from "@/components/vega-financial/RiskExplainerSheet";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

interface DashboardHoldingsSectionProps {
  holdings: MockHolding[];
  /** Total equity (cash + holdings value). Used for weight = % of total portfolio. */
  equity: number;
}

function riskScoreToLabel(score: number): "Low" | "Medium" | "High" {
  if (score <= 3) return "Low";
  if (score >= 7) return "High";
  return "Medium";
}

function strategySubtitle(tags: string[]): string {
  const first = tags[0];
  if (!first) return "Strategy";
  const lower = first.toLowerCase();
  if (lower === "mean reversion") return "Mean reversion strategy";
  if (lower === "trend following") return "Trend-following strategy";
  if (lower === "momentum" || lower === "equity") return "Momentum strategy";
  return `${first} strategy`;
}

function roleFromTags(tags: string[]): string {
  const first = (tags[0] ?? "").toLowerCase();
  if (first.includes("mean reversion")) return "Diversifier";
  if (first.includes("trend")) return "Growth";
  if (first.includes("momentum") || first.includes("equity")) return "Growth";
  return "Growth";
}

/** Desktop: full table with Strategy, Allocated, Return, Risk, Trend, Actions */
function HoldingsTableDesktop({
  holdings,
  equity,
  onOpenRiskExplainer,
}: {
  holdings: MockHolding[];
  equity: number;
  onOpenRiskExplainer: (score: number) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                Strategy
              </th>
              <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">
                Current value
              </th>
              <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">
                Return
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                Risk
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                Role
              </th>
              <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground w-[140px]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((h) => {
              const score = h.riskScore ?? 5;
              const riskLabel = riskScoreToLabel(score);
              const pctOfPortfolio =
                equity > 0 ? ((h.currentValue / equity) * 100).toFixed(0) : "—";
              return (
                <tr
                  key={h.id}
                  className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors duration-200 h-[72px] sm:h-[80px]"
                >
                  <td className="py-3 px-4 align-middle">
                    <Link
                      href={`/vega-financial/algorithms/${h.algorithmId}`}
                      className="font-semibold text-foreground hover:underline block"
                    >
                      {h.name}
                    </Link>
                    <span className="text-xs text-muted-foreground block mt-0.5">
                      {strategySubtitle(h.tags)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right align-middle tabular-nums">
                    <span className="font-medium text-foreground">{formatCurrency(h.currentValue)}</span>
                    <span className="text-xs text-muted-foreground block mt-0.5">
                      {pctOfPortfolio}% of total portfolio
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right align-middle">
                    <span
                      className={cn(
                        "tabular-nums font-medium",
                        h.returnPct >= 0 ? "text-brand-green" : "text-brand-red"
                      )}
                    >
                      {formatPercent(h.returnPct / 100)}
                    </span>
                    <span className="text-xs text-muted-foreground block mt-0.5">since allocation</span>
                  </td>
                  <td className="py-3 px-4 align-middle">
                    <button
                      type="button"
                      onClick={() => onOpenRiskExplainer(score)}
                      className="text-left focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring rounded"
                      aria-label={`Risk ${riskLabel}, ${score} out of 10. Click for explanation.`}
                    >
                      <span className="font-medium text-foreground">{riskLabel}</span>
                      <span className="text-xs text-muted-foreground block">{score}/10</span>
                    </button>
                  </td>
                  <td className="py-3 px-4 align-middle">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                      {roleFromTags(h.tags)}
                    </span>
                  </td>
                  <td className="py-3 px-4 align-middle text-right">
                    <div className="flex items-center justify-end gap-2 flex-wrap">
                      <Link
                        href={`/vega-financial/algorithms/${h.algorithmId}`}
                        className="text-sm font-medium text-primary hover:underline focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring rounded"
                      >
                        View details
                      </Link>
                      <span className="text-muted-foreground/60">·</span>
                      <Link
                        href={`/vega-financial/algorithms/${h.algorithmId}#invest`}
                        className="text-xs text-muted-foreground hover:text-foreground"
                      >
                        Add funds
                      </Link>
                      <Link
                        href={`/vega-financial/portfolio`}
                        className="text-xs text-muted-foreground hover:text-foreground"
                      >
                        Reduce
                      </Link>
                      <Link
                        href="/vega-financial/marketplace"
                        className="text-xs text-muted-foreground hover:text-foreground"
                      >
                        Compare
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
  );
}

/** Mobile: one card per holding */
function HoldingCardMobile({
  holding,
  equity,
  onOpenRiskExplainer,
}: {
  holding: MockHolding;
  equity: number;
  onOpenRiskExplainer: (score: number) => void;
}) {
  const score = holding.riskScore ?? 5;
  const riskLabel = riskScoreToLabel(score);
  const pctOfPortfolio =
    equity > 0 ? ((holding.currentValue / equity) * 100).toFixed(0) : "—";

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <Link
            href={`/vega-financial/algorithms/${holding.algorithmId}`}
            className="font-semibold text-foreground hover:underline"
          >
            {holding.name}
          </Link>
          <p className="text-xs text-muted-foreground mt-0.5">{strategySubtitle(holding.tags)}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div>
          <p className="text-xs text-muted-foreground">Current value</p>
          <p className="font-medium tabular-nums">{formatCurrency(holding.currentValue)}</p>
          <p className="text-xs text-muted-foreground">{pctOfPortfolio}% of total portfolio</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Return</p>
          <p
            className={cn(
              "font-medium tabular-nums",
              holding.returnPct >= 0 ? "text-brand-green" : "text-brand-red"
            )}
          >
            {formatPercent(holding.returnPct / 100)}
          </p>
          <p className="text-xs text-muted-foreground">since allocation</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Risk</p>
          <button
            type="button"
            onClick={() => onOpenRiskExplainer(score)}
            className="text-left focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring rounded"
          >
            <span className="font-medium">{riskLabel}</span>
            <span className="text-xs text-muted-foreground block">{score}/10</span>
          </button>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Role</p>
          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
            {roleFromTags(holding.tags)}
          </span>
        </div>
      </div>
      <div className="flex flex-wrap gap-3 pt-2 border-t border-border">
        <Link
          href={`/vega-financial/algorithms/${holding.algorithmId}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline min-h-[44px] items-center"
        >
          View details <ArrowUpRight className="size-3.5" />
        </Link>
        <Link
          href={`/vega-financial/algorithms/${holding.algorithmId}#invest`}
          className="text-sm text-muted-foreground hover:text-foreground min-h-[44px] inline-flex items-center"
        >
          Add funds
        </Link>
        <Link
          href="/vega-financial/portfolio"
          className="text-sm text-muted-foreground hover:text-foreground min-h-[44px] inline-flex items-center"
        >
          Reduce
        </Link>
        <Link
          href="/vega-financial/marketplace"
          className="text-sm text-muted-foreground hover:text-foreground min-h-[44px] inline-flex items-center"
        >
          Compare
        </Link>
      </div>
    </div>
  );
}

export function DashboardHoldingsSection({ holdings, equity }: DashboardHoldingsSectionProps) {
  const [explainerOpen, setExplainerOpen] = useState(false);
  const [explainerScore, setExplainerScore] = useState(5);

  if (holdings.length === 0) return null;

  const openExplainer = (score: number) => {
    setExplainerScore(score);
    setExplainerOpen(true);
  };

  return (
    <section aria-labelledby="holdings-heading">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-4">
        <div>
          <h2 id="holdings-heading" className="font-syne text-lg font-semibold text-foreground">
            Your holdings
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            See how your current strategies are performing
          </p>
        </div>
        <Link
          href="/vega-financial/portfolio"
          className="text-sm font-medium text-primary hover:underline focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring rounded shrink-0"
        >
          View portfolio
        </Link>
      </div>

      <div className="hidden md:block">
        <HoldingsTableDesktop
          holdings={holdings}
          equity={equity}
          onOpenRiskExplainer={openExplainer}
        />
      </div>
      <div className="md:hidden space-y-4">
        {holdings.map((h) => (
          <HoldingCardMobile
            key={h.id}
            holding={h}
            equity={equity}
            onOpenRiskExplainer={openExplainer}
          />
        ))}
      </div>

      <RiskExplainerSheet
        open={explainerOpen}
        onOpenChange={setExplainerOpen}
        riskScore={explainerScore}
      />
    </section>
  );
}
