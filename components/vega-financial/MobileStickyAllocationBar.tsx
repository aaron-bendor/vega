"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ALLOCATION_FORM_ID = "allocation-form";

interface MobileStickyAllocationBarProps {
  /** Primary CTA label */
  label?: string;
  /** Optional: scroll to form (default true) */
  scrollToForm?: boolean;
  className?: string;
}

/**
 * Sticky bottom CTA bar on mobile. Scrolls to allocation form when tapped.
 */
export function MobileStickyAllocationBar({
  label = "Buy or sell",
  scrollToForm = true,
  className,
}: MobileStickyAllocationBarProps) {
  function handleClick() {
    if (!scrollToForm) return;
    const el = document.getElementById(ALLOCATION_FORM_ID);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <div
      className={cn(
        "fixed left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur-sm p-3 safe-area-pb lg:hidden",
        "bottom-[calc(3.5rem+env(safe-area-inset-bottom,0px))] lg:bottom-0",
        className
      )}
      role="presentation"
    >
      <Button
        onClick={handleClick}
        className="w-full min-h-[48px] rounded-lg"
        aria-label={label}
      >
        {label}
      </Button>
    </div>
  );
}

export const ALLOCATION_FORM_ID_EXPORT = ALLOCATION_FORM_ID;
