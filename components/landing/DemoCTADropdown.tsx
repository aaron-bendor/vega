"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

export type DemoCTADropdownVariant = "hero" | "header";

type DemoCTADropdownProps = {
  /** Called when user chooses Invest: run tour init then navigate. */
  onInvest: (e: React.MouseEvent) => void;
  variant?: DemoCTADropdownVariant;
  /** Optional: when true (header variant), trigger uses primary colour (scrolled state). */
  scrolled?: boolean;
  /** Optional class for the wrapper (e.g. for mobile full width). */
  className?: string;
  /** Optional: close callback when a CTA is clicked (e.g. close mobile menu). */
  onClose?: () => void;
};

/**
 * Hero: single "Start Investing" button that goes to the invest demo (/vega-financial).
 * Header: two buttons — Invest (investor flow + tour) and Develop (developer demo).
 */
export function DemoCTADropdown({
  onInvest,
  variant = "hero",
  scrolled = false,
  className,
  onClose,
}: DemoCTADropdownProps) {
  const handleInvestClick = (e: React.MouseEvent) => {
    onClose?.();
    onInvest(e);
  };

  const isHero = variant === "hero";

  const triggerClass = isHero
    ? "font-dm-sans inline-flex items-center justify-center gap-1.5 h-14 px-8 w-full sm:w-auto min-w-[174px] rounded-[30px] bg-white/20 backdrop-blur-sm border border-white/30 font-black text-white hover:bg-white/30 hover:scale-[1.02] active:scale-[0.98] transition-[transform,background-color,border-color] duration-motion-normal ease-motion"
    : cn(
        "font-dm-sans flex items-center justify-center gap-1.5 px-5 h-9 md:h-10 font-bold text-sm md:text-base transition-[transform,background-color,border-color,box-shadow] duration-motion-chip ease-motion hover:scale-[1.02] active:scale-[0.98] shrink-0 focus-visible:outline focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-[30px]",
        scrolled
          ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90 hover:border-primary/90 shadow-md shadow-primary/20"
          : "bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 hover:border-white/40"
      );

  if (isHero) {
    return (
      <div className={cn("relative", className)}>
        <button
          type="button"
          className={triggerClass}
          onClick={(e) => onInvest(e)}
          data-tour="try-it-now"
        >
          Start Investing
        </button>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2 min-w-0", className)}>
      <Link
        href="/vega-developer/demo"
        className={cn(triggerClass, "hidden md:inline-flex")}
        onClick={() => onClose?.()}
      >
        Develop
      </Link>
      <button
        type="button"
        className={cn(triggerClass, "inline-flex ml-0 md:ml-2")}
        onClick={handleInvestClick}
        data-tour="try-it-now"
      >
        Invest
      </button>
    </div>
  );
}
