"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { clearTourForReplay, TOUR_START_SESSION_KEY, setTourStep } from "@/lib/tour/storage";

const PROTOTYPE_LABEL = "University prototype. Paper trading only. Not investment advice.";

export function DashboardHeader() {
  const router = useRouter();

  const handleReplayTutorial = () => {
    clearTourForReplay();
    if (typeof sessionStorage !== "undefined") {
      sessionStorage.setItem(TOUR_START_SESSION_KEY, "1");
    }
    setTourStep(0);
    router.push("/vega-financial");
  };

  const actions = (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
      <button
        type="button"
        onClick={handleReplayTutorial}
        className="text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring rounded min-h-[44px] min-w-[44px] inline-flex items-center sm:min-h-0 sm:min-w-0"
        aria-label="Replay tutorial"
      >
        Replay tutorial
      </button>
      <Link
        href="/vega-financial/profile#metrics"
        className="text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring rounded min-h-[44px] inline-flex items-center sm:min-h-0"
      >
        How to read these metrics
      </Link>
    </div>
  );

  return (
    <header className="min-w-0 mb-6 sm:mb-8" aria-label="Dashboard header">
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="min-w-0 max-w-2xl">
            <h1 className="font-syne text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
              Dashboard
            </h1>
            <p className="text-sm text-muted-foreground mt-1.5 max-w-xl">
              Track your portfolio, review your holdings, and decide what to do next.
            </p>
            {/* Mobile: actions under subtitle */}
            <div className="mt-3 sm:hidden">{actions}</div>
          </div>
          {/* Desktop: actions right-aligned */}
          <div className="hidden sm:block shrink-0">{actions}</div>
        </div>
        <div className="flex justify-end">
          <span
            className="text-[11px] sm:text-xs text-muted-foreground/80"
            title={PROTOTYPE_LABEL}
            aria-label={PROTOTYPE_LABEL}
          >
            {PROTOTYPE_LABEL}
          </span>
        </div>
      </div>
    </header>
  );
}
