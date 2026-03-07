"use client";

import { useRouter } from "next/navigation";
import { clearTourForReplay, TOUR_START_SESSION_KEY, setTourStep } from "@/lib/tour/storage";

export function ReplayTutorialLink() {
  const router = useRouter();

  function handleClick() {
    clearTourForReplay();
    if (typeof sessionStorage !== "undefined") {
      sessionStorage.setItem(TOUR_START_SESSION_KEY, "1");
    }
    setTourStep(0);
    router.push("/vega-financial");
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="text-xs font-medium text-muted-foreground hover:text-foreground focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring rounded"
    >
      Replay tutorial
    </button>
  );
}
