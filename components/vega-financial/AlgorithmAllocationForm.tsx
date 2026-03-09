"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star } from "lucide-react";
import {
  RiskDisclosureModal,
  getRiskDisclosureAccepted,
} from "@/components/vega-financial/RiskDisclosureModal";
import {
  loadPortfolioState,
  savePortfolioState,
  performDemoAllocation,
  performDemoSell,
  subscribePortfolioUpdate,
} from "@/lib/vega-financial/portfolio-store";
import { validateAllocationAmount, validateSellAmount } from "@/lib/vega-financial/allocation-validation";
import { formatCurrency } from "@/lib/utils/format";
import { cn } from "@/lib/utils";

const QUICK_AMOUNTS = [1000, 5000, 10000] as const;

interface AlgorithmAllocationFormProps {
  versionId: string;
  /** Strategy display name for activity log */
  strategyName?: string;
  /** Max = available cash from portfolio state */
  showAllocationHelper?: boolean;
  className?: string;
}

export function AlgorithmAllocationForm({
  versionId,
  strategyName = "Strategy",
  showAllocationHelper = true,
  className,
}: AlgorithmAllocationFormProps) {
  const [, setAmount] = useState<number | null>(null);
  const [amountInput, setAmountInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState<"buy" | "sell" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<"buy" | "sell" | false>(false);
  const [disclosureOpen, setDisclosureOpen] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [onWatchlist, setOnWatchlist] = useState(false);
  const [availableCash, setAvailableCash] = useState(0);
  const [currentHoldingValue, setCurrentHoldingValue] = useState(0);

  const refreshFromStore = useCallback(() => {
    if (typeof window === "undefined") return;
    const state = loadPortfolioState();
    setAvailableCash(state.availableCash);
    setOnWatchlist(state.watchlist.includes(versionId));
    const existing = state.holdings.find((h) => h.algorithmId === versionId);
    setCurrentHoldingValue(existing?.currentValue ?? 0);
  }, [versionId]);

  useEffect(() => {
    setAccepted(getRiskDisclosureAccepted());
  }, []);

  useEffect(() => {
    refreshFromStore();
    const unsub = subscribePortfolioUpdate(refreshFromStore);
    return unsub;
  }, [refreshFromStore]);

  function toggleWatchlist() {
    if (typeof window === "undefined") return;
    const state = loadPortfolioState();
    const next = state.watchlist.includes(versionId)
      ? state.watchlist.filter((id) => id !== versionId)
      : [...state.watchlist, versionId];
    savePortfolioState({ ...state, watchlist: next });
    setOnWatchlist(next.includes(versionId));
  }

  function doBuy() {
    setError(null);
    setSuccess(false);
    const num = Number(amountInput);
    const hasAmount = amountInput.trim() !== "";
    if (!hasAmount || amountInput.trim() === "") {
      setError("Enter an amount to trade.");
      return;
    }
    const validation = validateAllocationAmount(num, availableCash, versionId);
    if (!validation.valid) {
      setError(validation.message);
      return;
    }
    setLoading(true);
    setAction("buy");
    try {
      const result = performDemoAllocation(versionId, num, strategyName);
      if (result.success) {
        setSuccess("buy");
        setAmount(num);
        setAmountInput(String(num));
        refreshFromStore();
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError(result.error);
      }
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "Could not complete demo allocation. Please try again.";
      setError(msg);
      if (process.env.NODE_ENV === "development") {
        console.error("Demo allocation error:", e);
      }
    } finally {
      setLoading(false);
      setAction(null);
    }
  }

  function doSell() {
    setError(null);
    setSuccess(false);
    const num = Number(amountInput);
    const hasAmount = amountInput.trim() !== "";
    if (!hasAmount || amountInput.trim() === "") {
      setError("Enter an amount to trade.");
      return;
    }
    const validation = validateSellAmount(num, currentHoldingValue, versionId);
    if (!validation.valid) {
      setError(validation.message);
      return;
    }
    setLoading(true);
    setAction("sell");
    try {
      const result = performDemoSell(versionId, num, strategyName);
      if (result.success) {
        setSuccess("sell");
        setAmount(num);
        setAmountInput(String(num));
        refreshFromStore();
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError(result.error);
      }
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "Could not complete demo sell. Please try again.";
      setError(msg);
      if (process.env.NODE_ENV === "development") {
        console.error("Demo sell error:", e);
      }
    } finally {
      setLoading(false);
      setAction(null);
    }
  }

  function handleBuyClick() {
    if (!accepted) {
      setDisclosureOpen(true);
      return;
    }
    doBuy();
  }

  function handleDisclosureAccept() {
    setAccepted(true);
    doBuy();
  }

  const maxBuy = Math.max(availableCash, 0);
  const maxSell = Math.max(currentHoldingValue, 0);

  return (
    <div className={cn("space-y-3", className)}>
      <div>
        <label htmlFor="algo-amount" className="text-xs font-medium text-foreground block mb-1.5">
          Amount to trade
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">£</span>
          <Input
            id="algo-amount"
            type="number"
            min={1}
            step={100}
            value={amountInput}
            onChange={(e) => {
              const v = e.target.value;
              setAmountInput(v);
              setError(null);
              const n = Number(v);
              if (!Number.isNaN(n) && n >= 0) setAmount(n);
            }}
            placeholder="e.g. 1000"
            className="w-28 h-9 tabular-nums"
            aria-describedby={showAllocationHelper ? "algo-amount-helper" : undefined}
          />
          <div className="flex flex-wrap gap-1.5">
            {QUICK_AMOUNTS.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => {
                  setAmount(a);
                  setAmountInput(String(a));
                  setError(null);
                }}
                className="min-h-[44px] sm:min-h-[36px] px-2.5 py-1.5 rounded-md border border-border bg-muted/30 text-xs font-medium text-foreground hover:bg-muted/50 hover:border-muted-foreground/30 focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring transition-colors duration-200"
              >
                £{(a / 1000).toFixed(0)}k
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setAmount(maxBuy);
                setAmountInput(String(maxBuy));
                setError(null);
              }}
              className="min-h-[44px] sm:min-h-[36px] px-2.5 py-1.5 rounded-md border border-border bg-muted/30 text-xs font-medium text-foreground hover:bg-muted/50 hover:border-muted-foreground/30 focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring transition-colors duration-200"
            >
              Max buy
            </button>
            <button
              type="button"
              onClick={() => {
                setAmount(maxSell);
                setAmountInput(String(maxSell));
                setError(null);
              }}
              disabled={maxSell <= 0}
              className="min-h-[44px] sm:min-h-[36px] px-2.5 py-1.5 rounded-md border border-border bg-muted/30 text-xs font-medium text-foreground hover:bg-muted/50 hover:border-muted-foreground/30 focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none"
            >
              Max sell
            </button>
          </div>
        </div>
      </div>

      {showAllocationHelper && (
        <div id="algo-amount-helper" className="text-[11px] text-muted-foreground space-y-0.5">
          <p>Minimum £1. Available cash: {formatCurrency(availableCash)}</p>
          {availableCash <= 0 && (
            <p className="text-amber-600 dark:text-amber-500">
              You have no available cash to buy. Reset the demo in Settings to restore starting cash.
            </p>
          )}
          <p>Current holding: {formatCurrency(currentHoldingValue)}</p>
        </div>
      )}

      {error && (
        <div
          className="error-slider"
          data-visible="true"
          role="alert"
        >
          <span className="error-slider-icon" aria-hidden>⚠</span>
          <p>{error}</p>
        </div>
      )}
      {success && (
        <p className="text-sm vf-text-positive font-medium" role="status">
          {success === "buy" ? "Bought in demo portfolio." : "Sold from demo portfolio."}
        </p>
      )}

      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Button
            onClick={handleBuyClick}
            disabled={loading}
            className="flex-1 min-h-[44px] sm:min-h-[40px]"
            data-tour="algo-add-paper"
          >
            {loading && action === "buy" ? "Buying…" : "Add to paper portfolio"}
          </Button>
          <Button
            onClick={doSell}
            disabled={loading || currentHoldingValue <= 0}
            variant="outline"
            className="flex-1 min-h-[44px] sm:min-h-[40px]"
          >
            {loading && action === "sell" ? "Selling…" : "Sell"}
          </Button>
        </div>
        {success && (
          <Link
            href="/vega-financial/portfolio"
            className="text-center text-sm font-medium text-primary hover:underline focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring rounded py-2 min-h-[44px] flex items-center justify-center"
          >
            Review portfolio
          </Link>
        )}
        <Link
          href={`/vega-financial/compare?compare=${versionId}`}
          className="text-center text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring rounded py-2 px-3 min-h-[44px] flex items-center justify-center border border-border"
        >
          Compare strategies
        </Link>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full gap-2 min-h-[44px] sm:min-h-[44px]"
          onClick={toggleWatchlist}
          aria-pressed={onWatchlist}
        >
          <Star className={cn("size-4", onWatchlist && "fill-primary text-primary")} aria-hidden />
          {onWatchlist ? "On watchlist" : "Add to watchlist"}
        </Button>
      </div>

      <RiskDisclosureModal
        open={disclosureOpen}
        onOpenChange={setDisclosureOpen}
        onAccept={handleDisclosureAccept}
      />
    </div>
  );
}
