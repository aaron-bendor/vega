"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EquityCurve } from "@/components/charts/EquityCurve";
import { DrawdownChart } from "@/components/charts/DrawdownChart";
import { MetricsCards } from "@/components/charts/MetricsCards";

interface RunBacktestPanelProps {
  versionId?: string;
  templateId?: string;
  defaultParams?: Record<string, number>;
  preview?: boolean;
  /** Stooq symbols from algo version (e.g. ["^spx"], ["spy.us"]) */
  symbols?: string[];
  startDate?: string;
  endDate?: string;
}

const HORIZONS = [63, 126, 252];
const DATE_PRESETS = [
  { label: "2019–2024", start: "2019-01-01", end: "2024-12-31" },
  { label: "2020–2024", start: "2020-01-01", end: "2024-12-31" },
  { label: "2022–2024", start: "2022-01-01", end: "2024-12-31" },
];
const STOOQ_SYMBOLS = [
  { id: "^spx", label: "S&P 500 (^spx)" },
  { id: "spy.us", label: "SPY ETF" },
  { id: "qqq.us", label: "QQQ ETF" },
  { id: "tlt.us", label: "TLT ETF" },
  { id: "gld.us", label: "GLD ETF" },
];
const STRATEGIES = [
  { id: "buy_and_hold", label: "Buy and hold" },
  { id: "ma_crossover", label: "MA crossover" },
  { id: "bollinger_reversion", label: "Bollinger reversion" },
  { id: "rsi_momentum", label: "RSI momentum" },
  { id: "vol_target_overlay", label: "Vol target overlay" },
];

export function RunBacktestPanel({
  versionId,
  templateId,
  defaultParams,
  preview,
  symbols: algoSymbols,
  startDate: algoStart,
  endDate: algoEnd,
}: RunBacktestPanelProps) {
  const [dataSource, setDataSource] = useState<"stooq" | "synthetic">("stooq");
  const [symbol, setSymbol] = useState(algoSymbols?.[0] ?? "^spx");
  const [startDate, setStartDate] = useState(algoStart ?? "2019-01-01");
  const [endDate, setEndDate] = useState(algoEnd ?? "2024-12-31");
  const [horizon, setHorizon] = useState(252);
  const [strategyId, setStrategyId] = useState(templateId ?? "buy_and_hold");
  const [startingCapital, setStartingCapital] = useState(10000);
  const [fastWindow, setFastWindow] = useState(defaultParams?.fastWindow ?? 10);
  const [slowWindow, setSlowWindow] = useState(defaultParams?.slowWindow ?? 30);
  const [bollingerWindow, setBollingerWindow] = useState(defaultParams?.window ?? 20);
  const [bollingerK, setBollingerK] = useState(defaultParams?.k ?? 2);
  const [rsiWindow, setRsiWindow] = useState(defaultParams?.window ?? 14);
  const [rsiEntry, setRsiEntry] = useState(defaultParams?.entry ?? 30);
  const [rsiExit, setRsiExit] = useState(defaultParams?.exit ?? 70);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    metrics: {
      cumulativeReturn: number;
      sharpeRatio: number;
      maxDrawdown: number;
      annualisedVolatility: number;
    };
    equityPoints: { dayIndex: number; value: number }[];
  } | null>(null);

  useEffect(() => {
    if (templateId) setStrategyId(templateId);
    if (algoSymbols?.[0]) setSymbol(algoSymbols[0]);
    if (algoStart) setStartDate(algoStart);
    if (algoEnd) setEndDate(algoEnd);
    if (defaultParams) {
      if (defaultParams.fastWindow) setFastWindow(defaultParams.fastWindow);
      if (defaultParams.slowWindow) setSlowWindow(defaultParams.slowWindow);
      if (defaultParams.window) {
        setBollingerWindow(defaultParams.window);
        setRsiWindow(defaultParams.window);
      }
      if (defaultParams.k) setBollingerK(defaultParams.k);
      if (defaultParams.entry) setRsiEntry(defaultParams.entry);
      if (defaultParams.exit) setRsiExit(defaultParams.exit);
    }
  }, [templateId, defaultParams, algoSymbols, algoStart, algoEnd]);

  function buildParams(): Record<string, number | string> {
    switch (strategyId) {
      case "ma_crossover":
        return { fastWindow, slowWindow };
      case "bollinger_reversion":
        return { window: bollingerWindow, k: bollingerK };
      case "rsi_momentum":
        return { window: rsiWindow, entry: rsiEntry, exit: rsiExit };
      case "vol_target_overlay":
        return { targetVol: 0.15, maxLeverage: 1, innerTemplate: "buy_and_hold" };
      default:
        return {};
    }
  }

  async function handleRun() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const body: Record<string, unknown> = {
        parameters: buildParams(),
        startingCapital,
        preview: preview ?? !versionId,
        dataSource,
      };
      if (dataSource === "stooq") {
        body.symbols = [symbol];
        body.startDate = startDate;
        body.endDate = endDate;
      } else {
        body.horizon = horizon;
      }
      if (templateId || !versionId) {
        body.templateId = strategyId;
      } else if (versionId) {
        body.versionId = versionId;
        body.templateId = strategyId;
      }

      const res = await fetch("/api/backtests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const msg = data.message ?? data.error ?? "Backtest failed";
        if (data.fallbackToSynthetic) {
          throw new Error(`${msg} Try switching to synthetic data.`);
        }
        throw new Error(msg);
      }
      const data = await res.json();
      setResult({
        metrics: data.metrics,
        equityPoints: data.equityPoints ?? [],
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Backtest failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Data source</label>
          <Select value={dataSource} onValueChange={(v) => setDataSource(v as "stooq" | "synthetic")}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="stooq">Stooq (real daily OHLC)</SelectItem>
              <SelectItem value="synthetic">Synthetic</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {dataSource === "stooq" ? (
          <>
            <div>
              <label className="text-sm font-medium mb-1 block">Symbol</label>
              <Select value={symbol} onValueChange={setSymbol}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STOOQ_SYMBOLS.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Date range</label>
              <Select
                value={`${startDate}_${endDate}`}
                onValueChange={(v) => {
                  const p = DATE_PRESETS.find((x) => `${x.start}_${x.end}` === v);
                  if (p) {
                    setStartDate(p.start);
                    setEndDate(p.end);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DATE_PRESETS.map((p) => (
                    <SelectItem key={p.label} value={`${p.start}_${p.end}`}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        ) : (
          <div>
            <label className="text-sm font-medium mb-1 block">Horizon (days)</label>
            <Select value={String(horizon)} onValueChange={(v) => setHorizon(Number(v))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {HORIZONS.map((h) => (
                  <SelectItem key={h} value={String(h)}>
                    {h}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <div>
          <label className="text-sm font-medium mb-1 block">Strategy</label>
          <Select value={strategyId} onValueChange={setStrategyId}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STRATEGIES.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Starting capital</label>
          <Input
            type="number"
            min={100}
            step={1000}
            value={startingCapital}
            onChange={(e) => setStartingCapital(Number(e.target.value) || 10000)}
          />
        </div>
        {strategyId === "ma_crossover" && (
          <>
            <div>
              <label className="text-sm font-medium mb-1 block">Fast MA window</label>
              <Input
                type="number"
                min={2}
                value={fastWindow}
                onChange={(e) => setFastWindow(Number(e.target.value) || 10)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Slow MA window</label>
              <Input
                type="number"
                min={2}
                value={slowWindow}
                onChange={(e) => setSlowWindow(Number(e.target.value) || 30)}
              />
            </div>
          </>
        )}
        {strategyId === "bollinger_reversion" && (
          <>
            <div>
              <label className="text-sm font-medium mb-1 block">Window</label>
              <Input
                type="number"
                min={5}
                value={bollingerWindow}
                onChange={(e) => setBollingerWindow(Number(e.target.value) || 20)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">k (bands)</label>
              <Input
                type="number"
                min={1}
                step={0.1}
                value={bollingerK}
                onChange={(e) => setBollingerK(Number(e.target.value) || 2)}
              />
            </div>
          </>
        )}
        {strategyId === "rsi_momentum" && (
          <>
            <div>
              <label className="text-sm font-medium mb-1 block">Window</label>
              <Input
                type="number"
                min={5}
                value={rsiWindow}
                onChange={(e) => setRsiWindow(Number(e.target.value) || 14)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Entry (oversold)</label>
              <Input
                type="number"
                min={0}
                max={50}
                value={rsiEntry}
                onChange={(e) => setRsiEntry(Number(e.target.value) || 30)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Exit (overbought)</label>
              <Input
                type="number"
                min={50}
                max={100}
                value={rsiExit}
                onChange={(e) => setRsiExit(Number(e.target.value) || 70)}
              />
            </div>
          </>
        )}
      </div>

      <Button onClick={handleRun} disabled={loading}>
        {loading ? "Running…" : "Run backtest"}
      </Button>

      {error && <p className="text-destructive text-sm">{error}</p>}

      {result && (
        <div className="space-y-6 pt-4 border-t">
          <MetricsCards
            cumulativeReturn={result.metrics.cumulativeReturn}
            sharpeRatio={result.metrics.sharpeRatio}
            maxDrawdown={result.metrics.maxDrawdown}
            annualisedVolatility={result.metrics.annualisedVolatility}
          />
          {result.equityPoints.length > 0 && (
            <>
              <EquityCurve data={result.equityPoints} />
              <DrawdownChart equityData={result.equityPoints} />
            </>
          )}
        </div>
      )}
    </div>
  );
}
