"use client";

import { HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface InfoTooltipProps {
  /** Text shown on hover (and to assistive tech) */
  content: string;
  className?: string;
  /** Optional aria-label override */
  ariaLabel?: string;
}

/**
 * Small "?" icon that shows explanation content on hover.
 * Uses a visible tooltip on hover so the explanation is clear and appears quickly.
 */
export function InfoTooltip({ content, className, ariaLabel }: InfoTooltipProps) {
  return (
    <span
      className={cn("group/tooltip relative inline-flex shrink-0", className)}
      aria-label={ariaLabel ?? content}
      title={content}
    >
      <span
        className="inline-flex size-4 shrink-0 rounded-full bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground cursor-help transition-colors"
        aria-hidden
      >
        <HelpCircle className="size-3.5 mx-auto my-0" />
      </span>
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-3.5 py-2 text-xs font-normal text-popover-foreground bg-popover border border-border rounded-md shadow-md opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-[opacity,visibility] duration-150 z-50 min-w-[16rem] max-w-[min(22rem,90vw)] w-max text-left whitespace-normal leading-[1.45]"
      >
        {content}
      </span>
    </span>
  );
}
