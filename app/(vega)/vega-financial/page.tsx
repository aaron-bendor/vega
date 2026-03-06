import { DashboardTitle } from "@/components/vega-financial/DashboardTitle";
import { PortfolioOverview } from "@/components/vega-financial/PortfolioOverview";
import { DashboardInsights } from "@/components/vega-financial/DashboardInsights";
import { DashboardRecentActivity } from "@/components/vega-financial/DashboardRecentActivity";
import { AlgorithmCategoryTabs } from "@/components/vega-financial/AlgorithmCategoryTabs";
import Link from "next/link";
import { getInvestmentsForUser } from "@/lib/db/portfolio";
import { getLatestBacktestForVersion } from "@/lib/db/backtests";
import { listPublishedVersions } from "@/lib/db/algorithms";
import { withDbOrThrow } from "@/lib/db/safe";
import { loadDemoAlgorithms } from "@/lib/demo/loader";
import { MOCK_ACCOUNT } from "@/lib/mock/portfolio";
import type { MockAccount, MockHolding } from "@/lib/mock/portfolio";

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
      return {
        id: inv.id,
        algorithmName: inv.version.name,
        versionId: inv.versionId,
        invested: inv.amount,
        currentValue,
        pnl,
        riskLevel: inv.version.riskLevel ?? "Medium",
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

export default async function VegaFinancialPage() {
  const [account, algorithms] = await Promise.all([
    getPortfolioAccount(),
    getAlgorithmsData(),
  ]);

  return (
    <div className="w-full max-w-[1160px] min-w-0 mx-auto px-4 py-6 sm:py-8 lg:px-6 space-y-8 sm:space-y-10">
      <DashboardTitle />

      <section className="min-w-0" aria-labelledby="portfolio-overview-heading">
        <h2 id="portfolio-overview-heading" className="sr-only">
          Portfolio overview
        </h2>
        <p className="text-xs text-muted-foreground mb-3">
          Paper money and demo strategy data. Values update from your simulated
          allocations, not live brokerage activity.
        </p>
        <PortfolioOverview account={account} />
      </section>

      <section className="min-w-0">
        <DashboardInsights account={account} />
      </section>

      <section className="min-w-0">
        <DashboardRecentActivity />
      </section>

      <section
        id="marketplace"
        data-tour="vf-algo-list"
        className="min-w-0"
        aria-labelledby="recommended-strategies-heading"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-2 sm:gap-4 mb-3 sm:mb-4">
          <h2 id="recommended-strategies-heading" className="font-syne text-lg sm:text-xl font-semibold text-foreground">
            Recommended strategies
          </h2>
          <Link
            href="/vega-financial/marketplace"
            className="text-sm font-medium text-primary hover:underline focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
          >
            View all in Marketplace
          </Link>
        </div>
        <AlgorithmCategoryTabs algorithms={algorithms} />
      </section>
    </div>
  );
}
