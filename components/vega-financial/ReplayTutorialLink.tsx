"use client";

import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/routes";
import { clearTourForReplay, TOUR_START_SESSION_KEY, setTourStep } from "@/lib/tour/storage";

interface ReplayTutorialLinkProps {
  /** Button label. Default: "Start tutorial". */
  label?: string;
}

export function ReplayTutorialLink({ label = "Start tutorial" }: ReplayTutorialLinkProps) {
  const router = useRouter();

  function handleClick() {
    clearTourForReplay();
    setTourStep(0);
    if (typeof sessionStorage !== "undefined") {
      sessionStorage.setItem(TOUR_START_SESSION_KEY, "1");
    }
    router.push(ROUTES.vegaFinancial.root);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring rounded border border-border py-2 px-3 min-h-[44px] inline-flex items-center justify-center"
    >
      {label}
    </button>
  );
}
