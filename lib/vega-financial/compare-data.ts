/**
 * Data for the compare view. Used by the compare page to load 2–3 strategies.
 */

import { loadDemoAlgorithms, loadDemoRun } from "@/lib/demo/loader";
import { getAlgorithmVersionById } from "@/lib/db/algorithms";
import { withDbOrThrow } from "@/lib/db/safe";

export interface CompareStrategyRow {
  id: string;
  name: string;
  shortDesc: string;
  /** Style tags (e.g. Momentum, Trend Following). */
  style: string;
  /** Asset class (e.g. Equity, Multi-Asset). */
  assetClass: string;
  riskLevel: string;
  minInvestment: string;
  /** Fee description or placeholder. */
  fees: string;
  /** Simulated return as decimal or null. */
  returnPct: number | null;
  /** Biggest drop (max drawdown) as decimal or null. */
  biggestDrop: number | null;
  bestFor: string;
  verified?: boolean;
}

const STYLE_TAGS = ["Momentum", "Trend Following", "Mean Reversion", "Quant"];
const ASSET_TAGS = ["Equity", "Multi-Asset", "Commodities"];

const FALLBACK = {
  notSet: "Not set",
  notAvailable: "Not available",
  feesDemo: "No fees applied in demo",
  feesTerms: "See strategy terms",
} as const;

function inferStyle(tags: string[]): string {
  const found = tags.find((t) => STYLE_TAGS.includes(t));
  return found ?? tags[0] ?? FALLBACK.notSet;
}

function inferAsset(tags: string[]): string {
  const found = tags.find((t) => ASSET_TAGS.includes(t));
  return found ?? (tags.includes("Equity") ? "Equity" : tags[1] ?? FALLBACK.notSet);
}

export interface GetCompareResult {
  strategies: CompareStrategyRow[];
  invalidIds: string[];
}

export async function getCompareStrategies(ids: string[]): Promise<GetCompareResult> {
  const invalidIds: string[] = [];
  if (ids.length === 0) return { strategies: [], invalidIds: [] };

  const demoAlgos = loadDemoAlgorithms();
  const rows: CompareStrategyRow[] = [];

  for (const id of ids.slice(0, 3)) {
    const demoAlgo = demoAlgos.find((a) => a.id === id);
    if (demoAlgo) {
      const run = loadDemoRun(id);
      const returnPct = run?.metrics?.cumulativeReturn ?? null;
      const biggestDrop = run?.metrics?.maxDrawdown ?? null;
      rows.push({
        id: demoAlgo.id,
        name: demoAlgo.name,
        shortDesc: demoAlgo.shortDesc ?? "",
        style: inferStyle(demoAlgo.tags),
        assetClass: inferAsset(demoAlgo.tags),
        riskLevel: demoAlgo.riskLevel ?? FALLBACK.notSet,
        minInvestment:
          demoAlgo.minInvestment != null
            ? `£${demoAlgo.minInvestment.toLocaleString("en-GB")}`
            : FALLBACK.notSet,
        fees: FALLBACK.feesDemo,
        returnPct,
        biggestDrop,
        bestFor: demoAlgo.bestFor ?? demoAlgo.shortDesc ?? FALLBACK.notSet,
        verified: demoAlgo.verified,
      });
      continue;
    }

    try {
      const { data: version } = await withDbOrThrow(() => getAlgorithmVersionById(id), null);
      if (version) {
        const tags = version.tags?.map((t) => t.tag.name) ?? [];
        rows.push({
          id: version.id,
          name: version.name,
          shortDesc: version.shortDesc ?? version.description ?? "",
          style: inferStyle(tags),
          assetClass: inferAsset(tags),
          riskLevel: version.riskLevel ?? FALLBACK.notSet,
          minInvestment: FALLBACK.notSet,
          fees: FALLBACK.feesTerms,
          returnPct: version.cachedReturn ?? null,
          biggestDrop: version.cachedMaxDrawdown ?? null,
          bestFor: version.shortDesc ?? FALLBACK.notSet,
          verified: version.verificationStatus === "verified",
        });
      } else {
        invalidIds.push(id);
      }
    } catch {
      invalidIds.push(id);
    }
  }

  return { strategies: rows, invalidIds };
}
