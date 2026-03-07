"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star } from "lucide-react";
import {
  RiskDisclosureModal,
  getRiskDisclosureAccepted,
} from "@/components/vega-financial/RiskDisclosureModal";
import { loadPortfolioState, savePortfolioState } from "@/lib/vega-financial/portfolio-store";
import { formatCurrency } from "@/lib/utils/format";
import { cn } from "@/lib/utils";

const QUICK_AMOUNTS = [1000, 5000, 10000] as const;
const DEFAULT_STARTING_CASH = 100_000;

interface AlgorithmAllocationFormProps {
  versionId: string;
  /** Max = available cash from portfolio state */
  showAllocationHelper?: boolean;
  className?: string;
}

export function AlgorithmAllocationForm({
  versionId,
  showAllocationHelper = true,
  className,
}: AlgorithmAllocationFormProps) {
  const router = useRouter();
  const [amount, setAmount] = useState(10000);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [disclosureOpen, setDisclosureOpen] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [onWatchlist, setOnWatchlist] = useState(false);
  const [availableCash, setAvailableCash] = useState(DEFAULT_STARTING_CASH);
  const [totalEquity, setTotalEquity] = useState(DEFAULT_STARTING_CASH);

  useEffect(() => {
    setAccepted(getRiskDisclosureAccepted());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const state = loadPortfolioState();
    setAvailableCash(state.availableCash);
    const allocated = state.holdings.reduce((s, h) => s + h.currentValue, 0);
    setTotalEquity(state.availableCash + allocated);
    setOnWatchlist(state.watchlist.includes(versionId));
  }, [versionId]);

  function toggleWatchlist() {
    if (typeof window === "undefined") return;
    const state = loadPortfolioState();
    const next = state.watchlist.includes(versionId)
      ? state.watchlist.filter((id) => id !== versionId)
      : [...state.watchlist, versionId];
    savePortfolioState({ ...state, watchlist: next });
    setOnWatchlist(next.includes(versionId));
  }

  async function doInvest() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/invest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ versionId, amount }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to invest");
      }
      router.push("/vega-financial/portfolio");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to invest");
    } finally {
      setLoading(false);
    }
  }

  function handleInvestClick() {
    if (!accepted) {
      setDisclosureOpen(true);
      return;
    }
    doInvest();
  }

  function handleDisclosureAccept() {
    setAccepted(true);
    doInvest();
  }

  const maxAmount = Math.max(availableCash, 0);
  const effectiveAmount = Math.min(amount, maxAmount || amount);
  const estimatedWeightPct =
    totalEquity > 0 ? ((effectiveAmount / (totalEquity + effectiveAmount)) * 100).toFixed(1) : "—";
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
            value={amount}
            onChange={(e) => setAmount(Math.max(0, Number(e.target.value) || 0))}
            className="w-28 h-9 tabular-nums"
          />
          <div className="flex flex-wrap gap-1.5">
            {QUICK_AMOUNTS.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setAmount(a)}
                className="min-h-[44px] sm:min-h-[36px] px-2.5 py-1.5 rounded-md border border-border bg-muted/30 text-xs font-medium text-foreground hover:bg-muted/50 focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring"
              >
                £{a.toLocaleString("en-GB")}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setAmount(maxAmount)}
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

      <div className="flex flex-col gap-2">
        <Button
          onClick={handleInvestClick}
          disabled={loading}
          className="w-full min-h-[44px] sm:min-h-[40px]"
          data-tour="algo-add-paper"
        >
          {loading ? "Adding…" : "Add to portfolio"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full gap-2 min-h-[44px] sm:min-h-[36px]"
          onClick={toggleWatchlist}
          aria-pressed={onWatchlist}
        >
          <Star className={cn("size-4", onWatchlist && "fill-primary text-primary")} aria-hidden />
          {onWatchlist ? "On watchlist" : "Save to watchlist"}
        </Button>
        <Link
          href="/vega-financial/marketplace"
          className="text-center text-sm font-medium text-primary hover:underline focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring rounded py-2"
        >
          Compare strategy
        </Link>
      </div>

      {error && <p className="text-destructive text-sm">{error}</p>}

      <RiskDisclosureModal
        open={disclosureOpen}
        onOpenChange={setDisclosureOpen}
        onAccept={handleDisclosureAccept}
      />
    </div>
  );
}
