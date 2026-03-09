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
} from "@/lib/vega-financial/portfolio-store";
import {
  getTotalInvested,
  getEquity,
  getUnrealisedPnl,
  getUnrealisedPnlPct,
  getHoldingWeightPct,
} from "@/lib/vega-financial/portfolio-selectors";
import type { MockAccount, MockHolding } from "@/lib/mock/portfolio";
import type { PaperHolding } from "@/lib/vega-financial/portfolio-store";
import { PortfolioReconciliationBlock } from "@/components/vega-financial/PortfolioReconciliationBlock";
import { FirstRunWelcomeBanner } from "@/components/vega-financial/FirstRunWelcomeBanner";
import { DemoQuickStartStrip } from "@/components/vega-financial/DemoQuickStartStrip";
import { DEMO_ONBOARDING } from "@/lib/vega-financial/investor-copy";
import { ROUTES } from "@/lib/routes";
import { formatCurrency, formatPercent } from "@/lib/utils/format";
import { ReplayTutorialLink } from "@/components/vega-financial/ReplayTutorialLink";

function portfolioStateToMockAccount(
  availableCash: number,
  _startingCash: number,
  holdings: PaperHolding[]
): MockAccount {
  const invested = getTotalInvested(holdings);
  const equity = getEquity(availableCash, holdings);
  const unrealisedPnl = getUnrealisedPnl(holdings);
  const unrealisedPnlPct = getUnrealisedPnlPct(holdings);
  const mockHoldings: MockHolding[] = holdings.map((h) => ({
    id: h.id,
    algorithmId: h.algorithmId,
    name: h.name,
    allocated: h.allocated,
    currentValue: h.currentValue,
    weight: getHoldingWeightPct(h.currentValue, equity),
    returnPct: h.returnPct,
    tags: h.tags ?? [],
    riskScore: 5,
  }));
  return {
    equity,
    availableCash,
    allocated: invested,
    unrealizedPnl: unrealisedPnl,
    unrealizedPnlPct: unrealisedPnlPct,
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
  const [startingCash, setStartingCash] = useState(0);

  const refresh = useCallback(() => {
    if (typeof window === "undefined") return;
    seedFromMockAccountIfEmpty();
    const state = loadPortfolioState();
    setStartingCash(state.startingCash);
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

      <div className="vf-reveal vf-reveal-delay-0 space-y-4">
        <FirstRunWelcomeBanner />
        <DemoQuickStartStrip />
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={ROUTES.vegaFinancial.marketplace}
            className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium hover:bg-primary-hover focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring min-h-[44px]"
          >
            Explore strategies
          </Link>
          <ReplayTutorialLink label="Replay tutorial" />
        </div>
      </div>

      <p
        className="vf-reveal vf-reveal-delay-1 text-xs text-muted-foreground"
        role="status"
      >
        {DEMO_ONBOARDING.simulatedDisclosure}
      </p>

      {account.holdings.length === 0 && (
        <div className="vf-reveal vf-reveal-delay-1 rounded-xl border border-border bg-card p-4 sm:p-5">
          <h2 className="font-maven-pro text-base font-semibold text-foreground mb-1">
            You have not allocated to any strategies yet
          </h2>
          <p className="text-sm text-muted-foreground mb-3">
            Start by exploring a few simulated strategies and add one to your paper portfolio.
          </p>
          <Link
            href={ROUTES.vegaFinancial.marketplace}
            className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary-hover focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring min-h-[44px]"
          >
            Explore strategies
          </Link>
        </div>
      )}

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
          <PortfolioPerformanceCard
            currentValue={account.equity}
            dataPoints={[
              { label: "Start", value: startingCash },
              { label: "Now", value: account.equity },
            ]}
            holdings={account.holdings.map((h) => ({ name: h.name, currentValue: h.currentValue }))}
          />
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

      <div className="vf-reveal vf-reveal-delay-2b">
        <PortfolioReconciliationBlock
          availableCash={account.availableCash}
          holdingsValue={account.equity - account.availableCash}
          totalEquity={account.equity}
          invested={account.allocated}
          unrealisedPnl={account.unrealizedPnl}
        />
      </div>

      <div className="vf-reveal vf-reveal-delay-3">
        <DashboardHoldingsSection
          holdings={account.holdings}
          equity={account.equity}
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
            href={ROUTES.vegaFinancial.marketplace}
            className="vf-card-hover rounded-xl border border-border bg-card p-4 flex flex-col gap-2 hover:border-muted-foreground/25 hover:bg-muted/10 transition-colors duration-200 focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="font-medium text-foreground">Explore strategies</span>
            <span className="text-sm text-muted-foreground">Browse and compare strategies by risk, biggest drop, and role.</span>
            <span className="text-sm font-medium text-primary mt-1">Browse strategies →</span>
          </Link>
          <Link
            href={ROUTES.vegaFinancial.watchlist}
            className="vf-card-hover rounded-xl border border-border bg-card p-4 flex flex-col gap-2 hover:border-muted-foreground/25 hover:bg-muted/10 transition-colors duration-200 focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="font-medium text-foreground">Review watchlist</span>
            <span className="text-sm text-muted-foreground">Compare saved strategies before allocating.</span>
            <span className="text-sm font-medium text-primary mt-1">Open watchlist →</span>
          </Link>
          <Link
            href={ROUTES.vegaFinancial.learn}
            className="vf-card-hover rounded-xl border border-border bg-card p-4 flex flex-col gap-2 hover:border-muted-foreground/25 hover:bg-muted/10 transition-colors duration-200 focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="font-medium text-foreground">Learn the basics</span>
            <span className="text-sm text-muted-foreground">Understand metrics and how to compare strategies.</span>
            <span className="text-sm font-medium text-primary mt-1">Go to Learn →</span>
          </Link>
        </div>
      </section>

      <div className="vf-reveal vf-reveal-delay-7">
        <DashboardRecentActivity />
      </div>
    </div>
  );
}
