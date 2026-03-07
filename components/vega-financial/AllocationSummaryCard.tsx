"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface AllocationSummaryCardProps {
  /** Allocation form and CTAs */
  children: ReactNode;
  className?: string;
}

export function AllocationSummaryCard({
  children,
  className,
}: AllocationSummaryCardProps) {
  return (
    <div
      className={cn(
        "vf-glass-hero vf-glass-violet rounded-xl p-5 flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start",
        className
      )}
    >
      <div>
        <h2 className="text-sm font-semibold text-foreground">Simulate allocation</h2>
        <p className="text-xs text-muted-foreground mt-0.5">See how this changes your demo portfolio.</p>
      </div>

      <div className="flex flex-col gap-3">
        {children}
      </div>

      <p className="text-[10px] text-muted-foreground leading-snug">Demo only. No real money invested.</p>
    </div>
  );
}
