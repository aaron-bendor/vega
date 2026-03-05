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
    <div className="max-w-5xl mx-auto p-6 lg:p-8 space-y-12">
      <section>
        <div className="flex items-baseline justify-between gap-4 mb-4">
          <h2 className="font-syne text-xl font-semibold text-foreground">Portfolio overview</h2>
        </div>
        <PortfolioOverview account={account} />
      </section>

      <section id="marketplace">
        <div className="flex items-baseline justify-between gap-4 mb-4">
          <h2 className="font-syne text-xl font-semibold text-foreground">Algorithms</h2>
          <span className="text-sm text-muted-foreground tabular-nums">
            {algorithms.length} algorithm{algorithms.length !== 1 ? "s" : ""}
          </span>
        </div>
        <AlgorithmCategoryTabs algorithms={algorithms} />
      </section>
    </div>
  );
}
