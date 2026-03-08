"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VegaFinancialPageScaffold } from "@/components/vega-financial/VegaFinancialPageScaffold";
import { Skeleton } from "@/components/ui/skeleton";
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
      <div className="w-full max-w-[1280px] min-w-0 mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6 lg:space-y-8">
        <header className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const recentActivity = state.activityLog.slice(-5).reverse();
  const watchlistCount = state.watchlist.length;

  return (
    <VegaFinancialPageScaffold
      title="Settings"
      description="Profile, demo preferences, notifications, and risk settings."
      showDisclaimer={false}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Profile */}
        <section aria-labelledby="profile-heading" className="min-w-0">
          <Card className="rounded-xl border border-border h-full">
            <CardHeader className="p-4 sm:p-5 lg:p-6">
              <CardTitle id="profile-heading" className="font-maven-pro text-lg">
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-5 lg:p-6 pt-0 space-y-4">
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
              {watchlistCount > 0 && (
                <p className="text-sm text-muted-foreground pt-2">
                  {watchlistCount} strategy{watchlistCount !== 1 ? "ies" : ""} on watchlist.{" "}
                  <Link href="/vega-financial/watchlist" className="text-primary hover:underline">
                    View watchlist
                  </Link>
                </p>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Demo preferences */}
        <section aria-labelledby="demo-heading" className="min-w-0">
          <Card className="rounded-xl border border-border h-full">
            <CardHeader className="p-4 sm:p-5 lg:p-6">
              <CardTitle id="demo-heading" className="font-maven-pro text-lg">
                Demo preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-5 lg:p-6 pt-0 space-y-4">
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

        {/* Notifications */}
        <section aria-labelledby="notifications-heading" className="min-w-0">
          <Card className="rounded-xl border border-border h-full">
            <CardHeader className="p-4 sm:p-5 lg:p-6">
              <CardTitle id="notifications-heading" className="font-maven-pro text-lg">
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-5 lg:p-6 pt-0 space-y-4">
              <p className="text-sm text-muted-foreground">
                In a full product you could choose how to be notified about portfolio updates, strategy alerts, and market events. This prototype does not send real notifications.
              </p>
              <div className="rounded-lg border border-border bg-muted/30 px-4 py-3">
                <p className="text-xs text-muted-foreground">
                  Placeholder: email and push preferences would appear here.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Risk preferences */}
        <section aria-labelledby="risk-heading" className="min-w-0">
          <Card className="rounded-xl border border-border h-full">
            <CardHeader className="p-4 sm:p-5 lg:p-6">
              <CardTitle id="risk-heading" className="font-maven-pro text-lg">
                Risk preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-5 lg:p-6 pt-0 space-y-4">
              <div>
                <p className="text-sm font-medium text-foreground">Current preference</p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {RISK_LABELS[state.riskPreference]} — used to tailor strategy suggestions and portfolio insights in this demo.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 px-4 py-3">
                <p className="text-xs text-muted-foreground">
                  Placeholder: in a full product you could adjust risk tolerance and time horizon here.
                </p>
              </div>
              {recentActivity.length > 0 && (
                <div className="pt-2 border-t border-border">
                  <h3 className="font-maven-pro text-sm font-medium text-foreground mb-2">
                    Recent activity
                  </h3>
                  <ul className="space-y-1.5 text-sm">
                    {recentActivity.map((entry) => (
                      <li key={entry.id} className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                        <span className="text-muted-foreground capitalize">{entry.type}</span>
                        <span className="font-medium">{entry.algorithmName}</span>
                        <span className="text-muted-foreground">
                          {formatCurrency(entry.amount)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </VegaFinancialPageScaffold>
  );
}
