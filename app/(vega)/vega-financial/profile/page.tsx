"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  loadPortfolioState,
  savePortfolioState,
  PORTFOLIO_STORAGE_KEY,
  type PortfolioState,
  type RiskPreference,
} from "@/lib/vega-financial/portfolio-store";
import { clearTourForReplay, setTourStep } from "@/lib/tour/storage";
import { formatCurrency } from "@/lib/utils/format";

const RISK_LABELS: Record<RiskPreference, string> = {
  conservative: "Conservative",
  balanced: "Balanced",
  adventurous: "Adventurous",
};

export default function VegaFinancialProfilePage() {
  const [state, setState] = useState<PortfolioState | null>(null);
  const router = useRouter();

  useEffect(() => {
    setState(loadPortfolioState());
  }, []);

  const refresh = () => {
    setState(loadPortfolioState());
    router.refresh();
  };

  const handleResetDemoPortfolio = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(PORTFOLIO_STORAGE_KEY);
    }
    refresh();
    router.push("/vega-financial");
  };

  const handleResetOnboarding = () => {
    if (!state) return;
    savePortfolioState({
      ...state,
      onboardingCompleted: false,
      tutorialState: 0,
    });
    if (typeof sessionStorage !== "undefined") {
      sessionStorage.setItem("vega_tour_start", "1");
    }
    setTourStep(0);
    refresh();
    router.push("/vega-financial");
  };

  const handleClearWatchlist = () => {
    if (!state) return;
    savePortfolioState({ ...state, watchlist: [] });
    refresh();
  };

  const handleTutorialReset = () => {
    clearTourForReplay();
    if (state) {
      savePortfolioState({ ...state, tutorialState: 0 });
    }
    if (typeof sessionStorage !== "undefined") {
      sessionStorage.setItem("vega_tour_start", "1");
    }
    setTourStep(0);
    refresh();
  };

  if (state === null) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-muted rounded" />
          <div className="h-32 bg-muted rounded-lg" />
          <div className="h-24 bg-muted rounded-lg" />
        </div>
      </div>
    );
  }

  const recentActivity = state.activityLog.slice(-5).reverse();
  const watchlistCount = state.watchlist.length;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 sm:py-8 space-y-8">
      <h1 className="font-syne text-2xl md:text-3xl font-bold text-foreground">
        Profile
      </h1>

      {/* 1. Profile */}
      <section aria-labelledby="profile-heading">
        <Card className="rounded-2xl border border-border">
          <CardHeader>
            <CardTitle id="profile-heading" className="text-lg">
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="size-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-lg font-medium text-primary">VF</span>
              </div>
              <div>
                <p className="font-medium text-foreground">Demo User</p>
                <p className="text-sm text-muted-foreground">Account type: Demo</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-sm text-muted-foreground">Risk preference:</span>
              <span className="text-sm font-medium">
                {RISK_LABELS[state.riskPreference]}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground">Mode:</span>
              <span className="text-sm font-medium">
                {state.beginnerMode ? "Beginner" : "Advanced"}
              </span>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 2. Activity */}
      <section id="activity" aria-labelledby="activity-heading">
        <Card className="rounded-2xl border border-border">
          <CardHeader>
            <CardTitle id="activity-heading" className="text-lg">
              Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-foreground mb-2">
                Recent paper allocations
              </h3>
              {recentActivity.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No recent activity.
                </p>
              ) : (
                <ul className="space-y-1.5 text-sm">
                  {recentActivity.map((entry) => (
                    <li
                      key={entry.id}
                      className="flex flex-wrap items-center gap-x-2 gap-y-0.5"
                    >
                      <span className="text-muted-foreground capitalize">
                        {entry.type}
                      </span>
                      <span className="font-medium">{entry.algorithmName}</span>
                      <span className="text-muted-foreground">
                        {formatCurrency(entry.amount)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium text-foreground mb-1">
                Watchlist summary
              </h3>
              <p className="text-sm text-muted-foreground">
                {watchlistCount} strategy{watchlistCount !== 1 ? "ies" : ""} on
                watchlist
              </p>
              {watchlistCount > 0 && (
                <Link
                  href="/vega-financial/watchlist"
                  className="text-sm text-primary hover:underline mt-1 inline-block"
                >
                  View in Watchlist section
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 3. Preferences */}
      <section id="preferences" aria-labelledby="preferences-heading">
        <Card className="rounded-2xl border border-border">
          <CardHeader>
            <CardTitle id="preferences-heading" className="text-lg">
              Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1">
                Default allocation amount
              </label>
              <p className="text-sm text-muted-foreground">
                £1,000 (demo placeholder)
              </p>
            </div>
            <div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleTutorialReset}
                className="mt-1"
              >
                Reset tutorial
              </Button>
              <p className="text-xs text-muted-foreground mt-1.5">
                Restart the guided tour from the beginning.
              </p>
            </div>
            <p className="text-sm text-muted-foreground pt-2">
              Demo notification preferences (placeholder) — no real
              notifications in this prototype.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* 4. Watchlist snippet (anchor for sidebar link) */}
      <section id="watchlist" aria-labelledby="watchlist-heading">
        <Card className="rounded-2xl border border-border">
          <CardHeader>
            <CardTitle id="watchlist-heading" className="text-lg">
              Watchlist
            </CardTitle>
          </CardHeader>
          <CardContent>
            {watchlistCount === 0 ? (
              <p className="text-sm text-muted-foreground">
                No strategies on your watchlist. Add some from the{" "}
                <Link
                  href="/vega-financial/marketplace"
                  className="text-primary hover:underline"
                >
                  Marketplace
                </Link>
                .
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                You have {watchlistCount} strategy
                {watchlistCount !== 1 ? "ies" : ""} on your watchlist. Browse them
                from the Dashboard or Marketplace.
              </p>
            )}
          </CardContent>
        </Card>
      </section>

      {/* 5. Demo controls */}
      <section aria-labelledby="demo-heading">
        <Card className="rounded-2xl border border-border">
          <CardHeader>
            <CardTitle id="demo-heading" className="text-lg">
              Demo controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              onClick={handleResetDemoPortfolio}
              className="w-full sm:w-auto"
            >
              Reset demo portfolio
            </Button>
            <p className="text-xs text-muted-foreground">
              Clear all paper holdings and reset cash. You will start fresh.
            </p>
            <Button
              variant="outline"
              onClick={handleResetOnboarding}
              className="w-full sm:w-auto mt-2"
            >
              Reset onboarding
            </Button>
            <p className="text-xs text-muted-foreground">
              Show onboarding and tutorial again from the dashboard.
            </p>
            <Button
              variant="outline"
              onClick={handleClearWatchlist}
              className="w-full sm:w-auto mt-2"
              disabled={watchlistCount === 0}
            >
              Clear watchlist
            </Button>
            <p className="text-xs text-muted-foreground">
              Remove all strategies from your watchlist.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
