"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  isWelcomeBannerDismissed,
  setWelcomeBannerDismissed,
  recordDemoEvent,
} from "@/lib/vega-financial/demo-onboarding";
import { DEMO_ONBOARDING } from "@/lib/vega-financial/investor-copy";
import {
  clearTourForReplay,
  TOUR_START_SESSION_KEY,
  setTourStep,
} from "@/lib/tour/storage";

export function FirstRunWelcomeBanner() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setShow(!isWelcomeBannerDismissed());
    setMounted(true);
  }, []);

  const handleStartTutorial = useCallback(() => {
    setLoading(true);
    recordDemoEvent("tutorial_started");
    clearTourForReplay();
    if (typeof sessionStorage !== "undefined") {
      sessionStorage.setItem(TOUR_START_SESSION_KEY, "1");
    }
    setTourStep(0);
    setLoading(false);
    // Ensure TourRunner re-runs when already on /vega-financial (pathname wouldn't change on push)
    router.push("/vega-financial");
    router.refresh();
  }, [router]);

  const handleSkip = useCallback(() => {
    recordDemoEvent("tutorial_skipped");
    setWelcomeBannerDismissed();
    setShow(false);
  }, []);

  const handleDismiss = useCallback(() => {
    setWelcomeBannerDismissed();
    setShow(false);
  }, []);

  if (!mounted || !show) return null;

  const { welcomeBanner, trustCues } = DEMO_ONBOARDING;

  return (
    <section
      className="rounded-xl border border-border bg-primary/5 px-4 py-4 sm:px-5 sm:py-5 animate-in fade-in slide-in-from-top-2 duration-300"
      aria-labelledby="welcome-banner-title"
      role="region"
    >
      <div className="flex flex-col gap-4 sm:gap-5">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-wider text-primary mb-1">
              {welcomeBanner.eyebrow}
            </p>
            <h2
              id="welcome-banner-title"
              className="font-maven-pro text-lg sm:text-xl font-semibold text-foreground"
            >
              {welcomeBanner.title}
            </h2>
            <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl">
              {welcomeBanner.body}
            </p>
          </div>
          <button
            type="button"
            onClick={handleDismiss}
            className="shrink-0 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring min-w-[44px] min-h-[44px] flex items-center justify-center sm:min-w-0 sm:min-h-0 sm:p-1"
            aria-label="Dismiss welcome banner"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>

        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground" aria-hidden>
          {trustCues.map((cue) => (
            <li key={cue}>{cue}</li>
          ))}
        </ul>

        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:gap-3 gap-3">
          <Button
            onClick={handleStartTutorial}
            disabled={loading}
            className="min-h-[44px] w-full sm:w-auto sm:min-w-[140px] font-medium"
            aria-busy={loading}
          >
            {loading ? "Starting…" : welcomeBanner.ctaStartTutorial}
          </Button>
          <Button
            variant="outline"
            onClick={handleSkip}
            className="min-h-[44px] w-full sm:w-auto"
          >
            {welcomeBanner.ctaSkip}
          </Button>
          <Link
            href="/vega-financial/profile"
            className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-2 focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring rounded min-h-[44px] sm:min-h-0 flex items-center justify-center sm:justify-start"
          >
            {welcomeBanner.linkResetLater}
          </Link>
        </div>
      </div>
    </section>
  );
}
