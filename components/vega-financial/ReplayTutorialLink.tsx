"use client";

import { useRouter, usePathname } from "next/navigation";
import { ROUTES } from "@/lib/routes";
import { clearTourForReplay, TOUR_START_SESSION_KEY, setTourStep, TOUR_REPLAY_EVENT } from "@/lib/tour/storage";

interface ReplayTutorialLinkProps {
  /** Button label. Default: "Start tutorial". */
  label?: string;
}

export function ReplayTutorialLink({ label = "Start tutorial" }: ReplayTutorialLinkProps) {
  const router = useRouter();
  const pathname = usePathname();

  function handleClick() {
    clearTourForReplay();
    setTourStep(0);
    if (typeof sessionStorage !== "undefined") {
      sessionStorage.setItem(TOUR_START_SESSION_KEY, "1");
    }
    if (pathname === ROUTES.vegaFinancial.root) {
      window.dispatchEvent(new CustomEvent(TOUR_REPLAY_EVENT));
    } else {
      router.push(ROUTES.vegaFinancial.root);
    }
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
