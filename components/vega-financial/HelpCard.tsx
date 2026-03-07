"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { clearTourForReplay, TOUR_START_SESSION_KEY, setTourStep } from "@/lib/tour/storage";
import { cn } from "@/lib/utils";

interface HelpCardProps {
  className?: string;
}

/**
 * Guidance card: Replay tutorial + Learn about risk. Secondary actions.
 */
export function HelpCard({ className }: HelpCardProps) {
  const router = useRouter();

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
      <h3 className="text-sm font-semibold text-foreground">Need help choosing?</h3>
      <p className="text-sm text-muted-foreground leading-snug">
        Replay the product tour or learn how to compare risk, return, and diversification.
      </p>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleReplayTutorial}
          className="text-sm font-medium text-primary hover:underline focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring rounded"
        >
          Replay tutorial
        </button>
        <Link
          href="/vega-financial/learn"
          className="text-sm font-medium text-primary hover:underline focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring rounded"
        >
          How to read these metrics
        </Link>
      </div>
    </div>
  );
}
