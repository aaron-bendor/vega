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
import { clearWelcomeBannerDismissed, recordDemoEvent } from "@/lib/vega-financial/demo-onboarding";
import { clearTourForReplay, setTourStep, TOUR_START_SESSION_KEY } from "@/lib/tour/storage";
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
    recordDemoEvent("settings_opened");
  }, []);

  const refresh = () => {
    setState(loadPortfolioState());
    router.refresh();
  };

  const handleResetDemoPortfolio = () => {
    recordDemoEvent("reset_demo_clicked");
    if (typeof window !== "undefined") {
      localStorage.removeItem(PORTFOLIO_STORAGE_KEY);
      clearWelcomeBannerDismissed();
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
      sessionStorage.setItem(TOUR_START_SESSION_KEY, "1");
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
      sessionStorage.setItem(TOUR_START_SESSION_KEY, "1");
    }
    setTourStep(0);
    refresh();
  };

  const handleRestoreWelcomeBanner = () => {
    clearWelcomeBannerDismissed();
    refresh();
  };

  if (state === null) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-muted rounded" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="h-32 bg-muted rounded-lg" />
            <div className="h-32 bg-muted rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  const recentActivity = state.activityLog.slice(-5).reverse();
  const watchlistCount = state.watchlist.length;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-5 sm:py-6">
      <h1 className="font-maven-pro text-2xl md:text-3xl font-bold text-foreground mb-5">
        Settings
      </h1>

      {/* Demo controls — primary focus for demo users */}
      <section aria-labelledby="demo-heading" className="mb-6 lg:mb-8">
        <Card className="rounded-2xl border border-border">
          <CardHeader>
            <CardTitle id="demo-heading" className="font-maven-pro text-lg">
              Demo controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleTutorialReset}
                className="min-h-[44px]"
              >
                Restart tutorial
              </Button>
              <p className="text-xs text-muted-foreground mt-1.5">
                Walk through the demo again.
              </p>
            </div>
            <div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetDemoPortfolio}
                className="min-h-[44px]"
              >
                Reset demo portfolio
              </Button>
              <p className="text-xs text-muted-foreground mt-1.5">
                Restore the sample holdings and balances.
              </p>
            </div>
            <div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearWatchlist}
                disabled={watchlistCount === 0}
                className="min-h-[44px]"
              >
                Clear watchlist
              </Button>
              <p className="text-xs text-muted-foreground mt-1.5">
                Remove saved demo strategies.
              </p>
            </div>
            <div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRestoreWelcomeBanner}
                className="min-h-[44px]"
              >
                Restore welcome banner
              </Button>
              <p className="text-xs text-muted-foreground mt-1.5">
                Show the onboarding banner again.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
        {/* Profile */}
        <section aria-labelledby="profile-heading" className="min-w-0">
          <Card className="rounded-2xl border border-border h-full">
            <CardHeader>
              <CardTitle id="profile-heading" className="font-maven-pro text-lg">
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

        {/* Activity */}
        <section id="activity" aria-labelledby="activity-heading" className="min-w-0">
          <Card className="rounded-2xl border border-border h-full">
            <CardHeader>
              <CardTitle id="activity-heading" className="font-maven-pro text-lg">
                Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-maven-pro text-sm font-medium text-foreground mb-2">
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
                <h3 className="font-maven-pro text-sm font-medium text-foreground mb-1">
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

        {/* Preferences — deprioritised placeholder */}
        <section id="preferences" aria-labelledby="preferences-heading" className="min-w-0">
          <Card className="rounded-2xl border border-border h-full opacity-90">
            <CardHeader>
              <CardTitle id="preferences-heading" className="font-maven-pro text-lg text-muted-foreground">
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
              <p className="text-sm text-muted-foreground pt-2">
                Demo notification preferences (placeholder) — no real
                notifications in this prototype.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Watchlist snippet */}
        <section id="watchlist" aria-labelledby="watchlist-heading" className="min-w-0">
          <Card className="rounded-2xl border border-border h-full">
            <CardHeader>
              <CardTitle id="watchlist-heading" className="font-maven-pro text-lg">
                Watchlist
              </CardTitle>
            </CardHeader>
            <CardContent>
              {watchlistCount === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No strategies on your watchlist. Add some from{" "}
                  <Link
                    href="/vega-financial/marketplace"
                    className="text-primary hover:underline"
                  >
                    Explore
                  </Link>
                  .
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  You have {watchlistCount} strategy
                  {watchlistCount !== 1 ? "ies" : ""} on your watchlist. Browse them
                  from the Dashboard or Explore.
                </p>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
