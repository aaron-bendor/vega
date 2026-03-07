"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { DashboardHeader } from "@/components/vega-financial/DashboardHeader";
import { SummaryMetricCard } from "@/components/vega-financial/SummaryMetricCard";
import { PortfolioPerformanceCard } from "@/components/vega-financial/PortfolioPerformanceCard";
import { AccountBreakdownCard } from "@/components/vega-financial/AccountBreakdownCard";
import { riskMixFromScores, diversificationLabel } from "@/lib/vega-financial/portfolio-metrics";
import { DashboardHoldingsSection } from "@/components/vega-financial/DashboardHoldingsSection";
import { PortfolioInsightCard } from "@/components/vega-financial/PortfolioInsightCard";
import { HelpCard } from "@/components/vega-financial/HelpCard";
import { DashboardRecentActivity } from "@/components/vega-financial/DashboardRecentActivity";
import { SuggestedAlgorithms } from "@/components/vega-financial/SuggestedAlgorithms";
import {
  loadPortfolioState,
  seedFromMockAccountIfEmpty,
  subscribePortfolioUpdate,
  getTotalInvested,
  getTotalCurrentValue,
  getTotalReturnPct,
} from "@/lib/vega-financial/portfolio-store";
import type { MockAccount, MockHolding } from "@/lib/mock/portfolio";
import type { PaperHolding } from "@/lib/vega-financial/portfolio-store";
import { formatCurrency, formatPercent } from "@/lib/utils/format";

function portfolioStateToMockAccount(
  availableCash: number,
  _startingCash: number,
  holdings: PaperHolding[]
): MockAccount {
  const totalInvested = getTotalInvested(holdings);
  const totalCurrentValue = getTotalCurrentValue(holdings);
  const equity = availableCash + totalCurrentValue;
  const unrealizedPnlPct = getTotalReturnPct(holdings, totalCurrentValue);
  const unrealizedPnl = totalInvested > 0 ? totalCurrentValue - totalInvested : 0;
  const mockHoldings: MockHolding[] = holdings.map((h) => ({
    id: h.id,
    algorithmId: h.algorithmId,
    name: h.name,
    allocated: h.allocated,
    currentValue: h.currentValue,
    weight: equity > 0 ? (h.currentValue / equity) * 100 : 0,
    returnPct: h.returnPct,
    tags: h.tags ?? [],
    riskScore: 5,
  }));
  return {
    equity,
    availableCash,
    allocated: totalInvested,
    unrealizedPnl,
    unrealizedPnlPct,
    holdings: mockHoldings,
  };
}

export interface DashboardPortfolioContentProps {
  suggestedAlgorithms: Array<{
    id: string;
    name: string;
    shortDesc: string;
    riskLevel: string;
    verified: boolean;
    return?: number;
    maxDrawdown?: number;
    sharpe?: number;
  }>;
}

export function DashboardPortfolioContent({
  suggestedAlgorithms,
}: DashboardPortfolioContentProps) {
  const [account, setAccount] = useState<MockAccount | null>(null);

  const refresh = useCallback(() => {
    if (typeof window === "undefined") return;
    seedFromMockAccountIfEmpty();
    const state = loadPortfolioState();
    const next = portfolioStateToMockAccount(
      state.availableCash,
      state.startingCash,
      state.holdings
    );
    setAccount(next);
  }, []);

  useEffect(() => {
    refresh();
    const unsub = subscribePortfolioUpdate(refresh);
    return unsub;
  }, [refresh]);

  if (account == null) {
    return (
      <div className="w-full max-w-[1160px] min-w-0 mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:px-6 space-y-6">
        <DashboardHeader />
        <div
          className="rounded-xl bg-muted/50 h-32 w-full motion-reduce:animate-none animate-pulse transition-opacity duration-200"
          style={{ animationDuration: "1.5s" }}
          aria-hidden
        />
      </div>
    );
  }

  const riskScores = account.holdings.map((h) => h.riskScore);
  const riskMix = riskMixFromScores(riskScores);
  const maxWeight =
    account.holdings.length > 0
      ? Math.max(...account.holdings.map((h) => h.weight))
      : undefined;
  const diversification = diversificationLabel(account.holdings.length, maxWeight);
  const largestHolding =
    account.holdings.length > 0
      ? account.holdings.reduce((a, b) => (a.currentValue > b.currentValue ? a : b))
      : null;
  const largestHoldingNote = largestHolding
    ? `Your largest holding is ${largestHolding.name}`
    : undefined;

  return (
    <div className="w-full max-w-[1160px] min-w-0 mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:pl-6 lg:pr-8 space-y-6 sm:space-y-8 md:space-y-10">
      <div className="vf-reveal vf-reveal-delay-0">
        <DashboardHeader />
      </div>

      <section
        className="vf-reveal vf-reveal-delay-1 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 gap-y-3 sm:gap-y-4"
        aria-label="Portfolio summary"
      >
        <SummaryMetricCard
          label="Portfolio value"
          value={formatCurrency(account.equity)}
          numericValue={account.equity}
          numericFormat="currency"
          helperText="Invested and cash"
        />
        <SummaryMetricCard
          label="1M return"
          value={formatPercent(account.unrealizedPnlPct / 100)}
          numericValue={account.unrealizedPnlPct}
          numericFormat="percent"
          variant={account.unrealizedPnlPct >= 0 ? "positive" : "negative"}
        />
        <SummaryMetricCard
          label="Cash available"
          value={formatCurrency(account.availableCash)}
          numericValue={account.availableCash}
          numericFormat="currency"
        />
        <SummaryMetricCard
          label="Risk score"
          value={riskMix}
        />
      </section>

      <section
        className="vf-reveal vf-reveal-delay-2 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6"
        aria-labelledby="performance-heading"
      >
        <h2 id="performance-heading" className="sr-only">
          Portfolio performance
        </h2>
        <div className="lg:col-span-8 min-w-0">
          <PortfolioPerformanceCard currentValue={account.equity} />
        </div>
        <div className="lg:col-span-4 min-w-0">
          <AccountBreakdownCard
            invested={account.allocated}
            cash={account.availableCash}
            numberOfHoldings={account.holdings.length}
            riskMix={riskMix}
            diversification={diversification}
            largestHoldingNote={largestHoldingNote}
          />
        </div>
      </section>

      <div className="vf-reveal vf-reveal-delay-3">
        <DashboardHoldingsSection
          holdings={account.holdings}
          totalInvested={account.allocated}
        />
      </div>

      <section className="vf-reveal vf-reveal-delay-4 grid grid-cols-1 md:grid-cols-2 gap-4" aria-label="Insights and guidance">
        <PortfolioInsightCard account={account} />
        <HelpCard />
      </section>

      <div className="vf-reveal vf-reveal-delay-5">
        <SuggestedAlgorithms
          algorithms={suggestedAlgorithms}
          heldAlgorithmIds={account.holdings.map((h) => h.algorithmId)}
        />
      </div>

      <section className="vf-reveal vf-reveal-delay-6" aria-labelledby="next-actions-heading">
        <h2 id="next-actions-heading" className="font-maven-pro text-lg font-semibold text-foreground mb-4">
          Next actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/vega-financial/marketplace"
            className="vf-card-hover rounded-xl border border-border bg-card p-4 flex flex-col gap-2 hover:border-muted-foreground/25 hover:bg-muted/10 transition-colors duration-200 focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="font-medium text-foreground">Add a diversifier</span>
            <span className="text-sm text-muted-foreground">Explore strategies that can improve portfolio diversification.</span>
          </Link>
          <Link
            href="/vega-financial/portfolio"
            className="vf-card-hover rounded-xl border border-border bg-card p-4 flex flex-col gap-2 hover:border-muted-foreground/25 hover:bg-muted/10 transition-colors duration-200 focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="font-medium text-foreground">Reduce concentration</span>
            <span className="text-sm text-muted-foreground">Review allocation weights and rebalancing ideas.</span>
          </Link>
          <Link
            href="/vega-financial/watchlist"
            className="vf-card-hover rounded-xl border border-border bg-card p-4 flex flex-col gap-2 hover:border-muted-foreground/25 hover:bg-muted/10 transition-colors duration-200 focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="font-medium text-foreground">Review watchlist</span>
            <span className="text-sm text-muted-foreground">Compare saved strategies before allocating.</span>
          </Link>
        </div>
      </section>

      <div className="vf-reveal vf-reveal-delay-7">
        <DashboardRecentActivity />
      </div>
    </div>
  );
}
