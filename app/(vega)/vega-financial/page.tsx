import { DashboardIntro } from "@/components/vega-financial/DashboardIntro";
import { PortfolioOverview } from "@/components/vega-financial/PortfolioOverview";
import { AlgorithmCategoryTabs } from "@/components/vega-financial/AlgorithmCategoryTabs";
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
    <div className="w-full max-w-5xl min-w-0 mx-auto px-4 py-6 sm:p-6 lg:p-8 space-y-8 sm:space-y-12">
      <DashboardIntro />

      <section className="min-w-0">
        <div className="flex items-baseline justify-between gap-2 sm:gap-4 mb-3 sm:mb-4">
          <h2 className="font-syne text-lg sm:text-xl font-semibold text-foreground">Portfolio overview</h2>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          This portfolio uses paper money and demo strategy data. Values update from your simulated
          allocations, not from live brokerage activity.
        </p>
        <PortfolioOverview account={account} />
      </section>

      <section
        id="marketplace"
        data-tour="vf-algo-list"
        className="relative rounded-2xl bg-cover bg-center bg-no-repeat -mx-4 px-4 py-5 sm:py-6 md:-mx-4 md:px-6 md:py-8 min-w-0"
        style={{ backgroundImage: "url(/images/backgrounds/mesh-gradient-1.png)" }}
      >
        <div className="absolute inset-0 rounded-2xl bg-white/85 pointer-events-none" aria-hidden />
        <div className="relative min-w-0">
          <p className="text-xs text-muted-foreground mb-3">
            These are demo strategy pages designed to show how Vega could help investors compare
            systematic strategies. Start with risk, drawdown, and portfolio fit, not just headline
            return.
          </p>
          <div className="flex flex-wrap items-baseline justify-between gap-2 sm:gap-4 mb-3 sm:mb-4">
            <h2 className="font-syne text-lg sm:text-xl font-semibold text-foreground">Algorithms</h2>
            <span className="flex items-center gap-3">
              <span className="text-xs sm:text-sm text-muted-foreground tabular-nums">
                {algorithms.length} algorithm{algorithms.length !== 1 ? "s" : ""}
              </span>
              <a
                href="/vega-financial/marketplace"
                className="text-xs sm:text-sm font-medium text-primary hover:underline focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
              >
                View all in Marketplace
              </a>
            </span>
          </div>
          <AlgorithmCategoryTabs algorithms={algorithms} />
        </div>
      </section>
    </div>
  );
}
