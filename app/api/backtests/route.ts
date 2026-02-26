import { NextResponse } from "next/server";
import { runBacktest } from "@/lib/simulation/backtest";
import { runBacktestV2 } from "@/lib/simulation/backtestV2";
import { getAlgorithmVersionById } from "@/lib/db/algorithms";
import { createBacktest } from "@/lib/db/backtests";
import { withDbOrThrow } from "@/lib/db/safe";
import { runBacktestSchema } from "@/lib/validation/backtests";
import type { StrategyId } from "@/lib/simulation/types";
import { getStooqBars } from "@/lib/marketdata/providers/stooq";

const LEGACY_STRATEGY_MAP: Record<string, string> = {
  buyAndHold: "buy_and_hold",
  maCrossover: "ma_crossover",
};

const DEFAULT_START = "2019-01-01";
const DEFAULT_END = "2024-12-31";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = runBacktestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const {
      versionId,
      templateId,
      parameters,
      scenario,
      horizon,
      strategyId,
      startingCapital,
      preview,
      dataSource,
      symbols,
      startDate,
      endDate,
    } = parsed.data;

    const params = (parameters ?? {}) as Record<string, number | string>;
    const effectiveTemplateId =
      templateId ?? (strategyId && LEGACY_STRATEGY_MAP[strategyId]) ?? strategyId;
    let effectiveSymbols = symbols && symbols.length > 0 ? symbols : undefined;
    let start = startDate ?? DEFAULT_START;
    let end = endDate ?? DEFAULT_END;

    if (versionId && (!effectiveSymbols || !startDate || !endDate)) {
      const { data: version } = await withDbOrThrow(
        () => getAlgorithmVersionById(versionId),
        null
      );
      if (version) {
        if (!effectiveSymbols) {
          const vSym = version.symbols as string[] | null;
          effectiveSymbols = Array.isArray(vSym) && vSym.length > 0 ? vSym : ["^spx"];
        }
        if (!startDate && version.startDate) start = version.startDate;
        if (!endDate && version.endDate) end = version.endDate;
      }
    }
    if (!effectiveSymbols?.length) effectiveSymbols = ["^spx"];

    let priceBars: import("@/lib/marketdata/types").Bar[] | undefined;

    if (dataSource === "stooq") {
      const syms = effectiveSymbols;
      let bars: import("@/lib/marketdata/types").Bar[] = [];
      try {
        bars = await getStooqBars(syms[0] ?? "^spx", start, end);
        if (!bars.length) {
          return NextResponse.json(
            {
              error: "No Stooq data",
              message: `Empty data for ${syms[0]} (${start}–${end}). Run: npm run stooq:prefetch -- --symbols "${syms.join(",")}" --start ${start} --end ${end}`,
              fallbackToSynthetic: true,
            },
            { status: 503 }
          );
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        return NextResponse.json(
          {
            error: "Stooq fetch failed",
            message: msg,
            fallbackToSynthetic: true,
          },
          { status: 503 }
        );
      }
      priceBars = bars;
    }

    const horizonVal = priceBars ? priceBars.length : (horizon ?? 252);

    if (effectiveTemplateId && ["buy_and_hold", "ma_crossover", "bollinger_reversion", "rsi_momentum", "vol_target_overlay"].includes(effectiveTemplateId)) {
      const result = runBacktestV2({
        versionId: versionId ?? "demo",
        templateId: effectiveTemplateId,
        params,
        scenario: scenario as "TREND" | "RANGE" | "CRASH" | "RECOVERY" | undefined,
        horizon: horizonVal,
        startingCapital,
        priceBars,
      });

      if (versionId) {
        const { data: version } = await withDbOrThrow(
          () => getAlgorithmVersionById(versionId),
          null
        );
        if (version) {
          const { data: run } = await withDbOrThrow(
            () =>
              createBacktest({
                versionId,
                horizon: horizonVal,
                strategyId: effectiveTemplateId,
                parameters: params as Record<string, unknown>,
                startingCapital,
                seed: result.seed,
                equityPoints: result.equityPoints,
                metrics: [
                  { key: "cumulativeReturn", value: result.metrics.cumulativeReturn },
                  ...(result.metrics.sharpeRatio != null
                    ? [{ key: "sharpeRatio" as const, value: result.metrics.sharpeRatio }]
                    : []),
                  { key: "maxDrawdown", value: result.metrics.maxDrawdown },
                  { key: "annualisedVolatility", value: result.metrics.annualisedVolatility },
                ],
              }),
            null
          );
          if (run) {
            return NextResponse.json({
              runId: run.id,
              metrics: result.metrics,
              equityPoints: result.equityPoints,
              drawdownPoints: result.drawdownPoints,
              seed: result.seed,
            });
          }
        }
      }

      return NextResponse.json({
        runId: null,
        metrics: result.metrics,
        equityPoints: result.equityPoints,
        drawdownPoints: result.drawdownPoints,
        seed: result.seed,
      });
    }

    if (!versionId && !effectiveTemplateId) {
      return NextResponse.json(
        { error: "versionId or templateId required" },
        { status: 400 }
      );
    }

    if (!versionId) {
      return NextResponse.json(
        { error: "versionId required for this strategy" },
        { status: 400 }
      );
    }

    const { data: version } = await withDbOrThrow(
      () => getAlgorithmVersionById(versionId),
      null
    );

    if (!version && !preview) {
      const result = runBacktestV2({
        versionId,
        templateId: "buy_and_hold",
        params: {},
        horizon,
        startingCapital,
      });
      return NextResponse.json({
        metrics: result.metrics,
        equityPoints: result.equityPoints,
        seed: result.seed,
      });
    }

    const legacyStrategyId = (strategyId ?? "buyAndHold") as StrategyId;
    const result = runBacktest(
      versionId,
      horizon ?? 252,
      legacyStrategyId,
      params as { fastWindow?: number; slowWindow?: number },
      startingCapital
    );

    if (preview) {
      return NextResponse.json({
        metrics: result.metrics,
        equityPoints: result.equityPoints,
        seed: result.seed,
      });
    }

    if (version) {
      const { data: run } = await withDbOrThrow(
        () =>
          createBacktest({
            versionId,
            horizon: horizon ?? 252,
            strategyId: legacyStrategyId,
            parameters: params as Record<string, unknown>,
            startingCapital,
            seed: result.seed,
            equityPoints: result.equityPoints,
            metrics: [
              { key: "cumulativeReturn", value: result.metrics.cumulativeReturn },
              ...(result.metrics.sharpeRatio != null
                ? [{ key: "sharpeRatio" as const, value: result.metrics.sharpeRatio }]
                : []),
              { key: "maxDrawdown", value: result.metrics.maxDrawdown },
              { key: "annualisedVolatility", value: result.metrics.annualisedVolatility },
            ],
          }),
        null
      );
      if (run) {
        return NextResponse.json({
          runId: run.id,
          metrics: result.metrics,
          equityPoints: result.equityPoints,
        });
      }
    }

    return NextResponse.json({
      runId: null,
      metrics: result.metrics,
      equityPoints: result.equityPoints,
      seed: result.seed,
    });
  } catch (err) {
    console.error("Backtest error:", err);
    return NextResponse.json(
      { error: "Backtest failed" },
      { status: 500 }
    );
  }
}
