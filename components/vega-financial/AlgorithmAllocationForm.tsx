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
  subscribePortfolioUpdate,
  getTotalAllocated,
} from "@/lib/vega-financial/portfolio-store";
import { validateAllocationAmount } from "@/lib/vega-financial/allocation-validation";
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
  const [amount, setAmount] = useState<number>(10000);
  const [amountInput, setAmountInput] = useState("10000");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [disclosureOpen, setDisclosureOpen] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [onWatchlist, setOnWatchlist] = useState(false);
  const [availableCash, setAvailableCash] = useState(0);
  const [totalEquity, setTotalEquity] = useState(0);
  const [currentHoldingValue, setCurrentHoldingValue] = useState(0);

  const refreshFromStore = useCallback(() => {
    if (typeof window === "undefined") return;
    const state = loadPortfolioState();
    setAvailableCash(state.availableCash);
    const allocated = getTotalAllocated(state.holdings);
    setTotalEquity(state.availableCash + allocated);
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

  function doAllocate() {
    setError(null);
    setSuccess(false);
    const num = Number(amountInput);
    const hasAmount = amountInput.trim() !== "";
    if (!hasAmount || amountInput.trim() === "") {
      setError("Enter an amount to allocate.");
      return;
    }
    const validation = validateAllocationAmount(num, availableCash, versionId);
    if (!validation.valid) {
      setError(validation.message);
      return;
    }
    setLoading(true);
    try {
      const result = performDemoAllocation(versionId, num, strategyName);
      if (result.success) {
        setSuccess(true);
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
    }
  }

  function handleInvestClick() {
    if (!accepted) {
      setDisclosureOpen(true);
      return;
    }
    doAllocate();
  }

  function handleDisclosureAccept() {
    setAccepted(true);
    doAllocate();
  }

  const numAmount = Number(amountInput);
  const isValidNum = !Number.isNaN(numAmount) && numAmount > 0;
  const maxAmount = Math.max(availableCash, 0);
  const effectiveAmount = isValidNum ? Math.min(numAmount, maxAmount || numAmount) : 0;
  const estimatedWeightPct =
    totalEquity > 0
      ? (((currentHoldingValue + effectiveAmount) / totalEquity) * 100).toFixed(1)
      : "—";
  const cashAfter = availableCash - effectiveAmount;

  return (
    <div className={cn("space-y-3", className)}>
      <div>
        <label htmlFor="algo-amount" className="text-xs font-medium text-foreground block mb-1.5">
          Amount to allocate
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">£</span>
          <Input
            id="algo-amount"
            type="number"
            min={100}
            max={maxAmount || undefined}
            step={1000}
            value={amountInput}
            onChange={(e) => {
              const v = e.target.value;
              setAmountInput(v);
              setError(null);
              const n = Number(v);
              if (!Number.isNaN(n) && n >= 0) setAmount(n);
            }}
            className="w-28 h-9 tabular-nums"
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
                className="min-h-[44px] sm:min-h-[36px] px-2.5 py-1.5 rounded-md border border-border bg-muted/30 text-xs font-medium text-foreground hover:bg-muted/50 focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring"
              >
                £{a.toLocaleString("en-GB")}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setAmount(maxAmount);
                setAmountInput(String(maxAmount));
                setError(null);
              }}
              className="min-h-[44px] sm:min-h-[36px] px-2.5 py-1.5 rounded-md border border-border bg-muted/30 text-xs font-medium text-foreground hover:bg-muted/50 focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring"
            >
              Max
            </button>
          </div>
        </div>
      </div>

      {showAllocationHelper && (
        <div className="text-[11px] text-muted-foreground space-y-0.5">
          <p>Estimated portfolio weight: {estimatedWeightPct}%</p>
          <p>Available cash after: {formatCurrency(Math.max(0, cashAfter))}</p>
        </div>
      )}

      {error && (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      )}
      {success && (
        <p className="text-sm text-brand-green font-medium" role="status">
          Demo allocation added.
        </p>
      )}

      <div className="flex flex-col gap-2">
        <Button
          onClick={handleInvestClick}
          disabled={loading}
          className="w-full min-h-[44px] sm:min-h-[40px]"
          data-tour="algo-add-paper"
        >
          {loading ? "Allocating…" : "Allocate to demo portfolio"}
        </Button>
        {success && (
          <Link
            href="/vega-financial/portfolio"
            className="text-center text-sm font-medium text-primary hover:underline focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring rounded py-2"
          >
            Review portfolio
          </Link>
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full gap-2 min-h-[44px] sm:min-h-[36px]"
          onClick={toggleWatchlist}
          aria-pressed={onWatchlist}
        >
          <Star className={cn("size-4", onWatchlist && "fill-primary text-primary")} aria-hidden />
          {onWatchlist ? "On watchlist" : "Add to watchlist"}
        </Button>
        <Link
          href="/vega-financial/marketplace"
          className="text-center text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring rounded py-2"
        >
          Compare
        </Link>
      </div>

      <RiskDisclosureModal
        open={disclosureOpen}
        onOpenChange={setDisclosureOpen}
        onAccept={handleDisclosureAccept}
      />
    </div>
  );
}
