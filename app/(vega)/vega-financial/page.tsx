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
import { getInvestmentsForUser } from "@/lib/db/portfolio";
import { getLatestBacktestForVersion } from "@/lib/db/backtests";
import { listPublishedVersions } from "@/lib/db/algorithms";
import { withDbOrThrow } from "@/lib/db/safe";
import { loadDemoAlgorithms } from "@/lib/demo/loader";
import { MOCK_ACCOUNT } from "@/lib/mock/portfolio";
import type { MockAccount, MockHolding } from "@/lib/mock/portfolio";
import { formatCurrency, formatPercent } from "@/lib/utils/format";

export const dynamic = "force-dynamic";

const DEMO_CASH = 100000;

async function getPortfolioAccount(): Promise<MockAccount> {
  const { data: investments, dbAvailable } = await withDbOrThrow(
    () => getInvestmentsForUser(),
    []
  );

  if (!dbAvailable || investments.length === 0) {
    return MOCK_ACCOUNT;
  }

  const holdingsWithValue = await Promise.all(
    investments.map(async (inv) => {
      const backtest = await getLatestBacktestForVersion(inv.versionId);
      const lastEquity = backtest?.equityPoints.at(-1)?.value;
      const pricePerUnit = lastEquity && lastEquity > 0 ? lastEquity : 10000;
      const currentValue = inv.units * pricePerUnit;
      const pnl = inv.amount > 0 ? (currentValue - inv.amount) / inv.amount : 0;
      const riskScore =
        inv.version.riskLevel === "Low" ? 3 : inv.version.riskLevel === "High" ? 7 : 5;
      return {
        id: inv.id,
        algorithmName: inv.version.name,
        versionId: inv.versionId,
        invested: inv.amount,
        currentValue,
        pnl,
        riskLevel: inv.version.riskLevel ?? "Medium",
        riskScore,
      };
    })
  );

  const totalAllocated = holdingsWithValue.reduce((s, h) => s + h.currentValue, 0);
  const totalInvested = holdingsWithValue.reduce((s, h) => s + h.invested, 0);
  const availableCash = Math.max(0, DEMO_CASH - totalInvested);
  const totalEquity = availableCash + totalAllocated;
  const unrealisedPnl = totalInvested > 0 ? (totalAllocated - totalInvested) / totalInvested : 0;
  const unrealisedPnlPct = unrealisedPnl * 100;

  const holdings: MockHolding[] = holdingsWithValue.map((h) => ({
    id: h.id,
    algorithmId: h.versionId,
    name: h.algorithmName,
    allocated: h.invested,
    currentValue: h.currentValue,
    weight: totalAllocated > 0 ? (h.currentValue / totalAllocated) * 100 : 0,
    returnPct: h.pnl * 100,
    tags: [],
    riskScore: h.riskScore,
  }));

  return {
    equity: totalEquity,
    availableCash,
    allocated: totalAllocated,
    unrealizedPnl: totalEquity - DEMO_CASH,
    unrealizedPnlPct: unrealisedPnlPct,
    holdings,
  };
}

async function getAlgorithmsData() {
  const { data: versions, dbAvailable } = await withDbOrThrow(
    () => listPublishedVersions({}),
    []
  );

  const demoAlgos = !dbAvailable ? loadDemoAlgorithms() : [];
  const useDemo = !dbAvailable && demoAlgos.length > 0;

  const items = useDemo
    ? demoAlgos.map((a) => ({
        id: a.id,
        name: a.name,
        shortDesc: a.shortDesc,
        tags: a.tags,
        riskLevel: a.riskLevel ?? "Medium",
        riskScore: a.riskScore,
        var95MonthlyPct: a.var95MonthlyPct,
        standardised: a.standardised,
        attributes: a.attributes,
        verified: a.verified ?? false,
        return: undefined as number | undefined,
        volatility: undefined as number | undefined,
        maxDrawdown: undefined as number | undefined,
        sparklineData: [] as number[],
        thesis: a.thesis,
        bestFor: a.bestFor,
        mayNotSuit: a.mayNotSuit,
        statusBadgeText: a.statusBadgeText,
        cardFooterMicrocopy: a.cardFooterMicrocopy,
      }))
    : versions.map((v) => ({
        id: v.id,
        name: v.name,
        shortDesc: v.shortDesc ?? v.description ?? "",
        tags: v.tags?.map((t) => t.tag.name) ?? [],
        riskLevel: v.riskLevel ?? "Medium",
        riskScore: undefined as number | undefined,
        var95MonthlyPct: undefined as number | undefined,
        standardised: undefined as boolean | undefined,
        attributes: undefined,
        verified: v.verificationStatus === "verified",
        return: v.cachedReturn ?? undefined,
        volatility: v.cachedVolatility ?? undefined,
        maxDrawdown: v.cachedMaxDrawdown ?? undefined,
        sparklineData: [] as number[],
      }));

  return items;
}

const DEMO_INITIAL_CASH = 100000;

export default async function VegaFinancialPage() {
  const [account, algorithms] = await Promise.all([
    getPortfolioAccount(),
    getAlgorithmsData(),
  ]);

  const suggestedForCard = algorithms.slice(0, 5).map((a) => ({
    id: a.id,
    name: a.name,
    shortDesc: a.shortDesc ?? "",
    riskLevel: a.riskLevel ?? "Medium",
    verified: a.verified,
    return: a.return,
    maxDrawdown: a.maxDrawdown,
    sharpe: undefined as number | undefined,
  }));

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
    <div className="w-full max-w-[1160px] min-w-0 mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:px-6 space-y-6 sm:space-y-8 md:space-y-10">
      {/* 1. Page header row */}
      <DashboardHeader />

      {/* 2. Summary cards row */}
      <section
        className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 gap-y-3 sm:gap-y-4"
        aria-label="Portfolio summary"
      >
        <SummaryMetricCard
          label="Total account value"
          value={formatCurrency(account.equity)}
          helperText="Includes invested strategies and available cash"
        />
        <SummaryMetricCard
          label="Invested in strategies"
          value={formatCurrency(account.allocated)}
          helperText="Amount currently allocated across your holdings"
        />
        <SummaryMetricCard
          label="Total return"
          value={formatPercent(account.unrealizedPnlPct / 100)}
          helperText="Since your first allocation"
          variant={account.unrealizedPnlPct >= 0 ? "positive" : "negative"}
        />
        <SummaryMetricCard
          label="Cash available"
          value={formatCurrency(account.availableCash)}
          helperText="Ready to allocate when you add another strategy"
        />
      </section>

      {/* 3. Main portfolio section: chart + sidebar */}
      <section
        className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6"
        aria-labelledby="performance-heading"
      >
        <h2 id="performance-heading" className="sr-only">
          Portfolio performance
        </h2>
        <div className="lg:col-span-8 min-w-0">
          <PortfolioPerformanceCard
            currentValue={account.equity}
            startValue={DEMO_INITIAL_CASH}
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

      {/* 4. Holdings section */}
      <DashboardHoldingsSection
        holdings={account.holdings}
        totalInvested={account.allocated}
      />

      {/* 5. Portfolio insights row: two half-width cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4" aria-label="Insights and guidance">
        <PortfolioInsightCard account={account} />
        <HelpCard />
      </section>

      {/* 6. Suggested strategies section */}
      <SuggestedAlgorithms algorithms={suggestedForCard} />

      {/* 7. Recent activity section */}
      <DashboardRecentActivity />
    </div>
  );
}
