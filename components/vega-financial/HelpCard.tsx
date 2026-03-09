"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { clearTourForReplay, TOUR_START_SESSION_KEY, setTourStep } from "@/lib/tour/storage";
import { getDemoEventCount } from "@/lib/vega-financial/demo-onboarding";
import { cn } from "@/lib/utils";

interface HelpCardProps {
  className?: string;
}

/**
 * Guidance card: Replay tutorial + Learn about risk. Secondary actions.
 */
export function HelpCard({ className }: HelpCardProps) {
  const router = useRouter();
  const [skippedCount, setSkippedCount] = useState(0);
  useEffect(() => {
    setSkippedCount(getDemoEventCount("tutorial_skipped"));
  }, []);
  const explorePrompt =
    skippedCount >= 2
      ? "Prefer to explore alone? Start in Strategies to browse."
      : "Replay the tutorial or learn how to compare risk, return, and diversification. You can also restart the tutorial from Settings.";

  const handleReplayTutorial = () => {
    clearTourForReplay();
    if (typeof sessionStorage !== "undefined") {
      sessionStorage.setItem(TOUR_START_SESSION_KEY, "1");
    }
    setTourStep(0);
    router.push("/vega-financial");
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-4 flex flex-col gap-3",
        className
      )}
    >
      <h3 className="font-maven-pro text-sm font-semibold text-foreground">Need help choosing?</h3>
      <p className="text-sm text-muted-foreground leading-snug">
        {explorePrompt}
      </p>
      <div className="flex flex-wrap gap-3">
        {skippedCount >= 2 && (
          <Link
            href="/vega-financial/marketplace"
            className="text-sm font-medium text-primary hover:underline focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring rounded min-h-[44px] inline-flex items-center px-3"
          >
            Explore strategies
          </Link>
        )}
        <button
          type="button"
          onClick={handleReplayTutorial}
          className="text-sm font-medium text-primary hover:underline focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring rounded min-h-[44px] min-w-[44px] inline-flex items-center justify-center"
        >
          Replay tutorial
        </button>
        <Link
          href="/vega-financial/learn"
          className="text-sm font-medium text-primary hover:underline focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring rounded min-h-[44px] inline-flex items-center"
        >
          How to read these metrics
        </Link>
      </div>
    </div>
  );
}
