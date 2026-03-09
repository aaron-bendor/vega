"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface InfoTooltipProps {
  /** Text shown on hover and on click (and to assistive tech) */
  content: string;
  className?: string;
  /** Optional aria-label override */
  ariaLabel?: string;
  /** Optional link to Learn page anchor (e.g. /vega-financial/learn#drawdown) */
  learnMoreHref?: string;
}

/**
 * Small "?" icon that shows explanation on hover (desktop) and on click (touch/keyboard).
 * Click opens and closes the tooltip; Escape or outside click closes it.
 */
export function InfoTooltip({ content, className, ariaLabel, learnMoreHref }: InfoTooltipProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onEscape);
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      document.removeEventListener("keydown", onEscape);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [open]);

  return (
    <span
      ref={ref}
      className={cn("group/tooltip relative inline-flex shrink-0", className)}
      aria-label={ariaLabel ?? content}
      title={content}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex size-4 shrink-0 rounded-full bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground cursor-help transition-colors focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <HelpCircle className="size-3.5 mx-auto my-0" aria-hidden />
      </button>
      <span
        role="tooltip"
        className={cn(
          "absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-3.5 py-2 text-xs font-normal text-popover-foreground bg-popover border border-border rounded-md shadow-md z-50 min-w-[16rem] max-w-[min(22rem,90vw)] w-max text-left whitespace-normal leading-[1.45] transition-[opacity,visibility] duration-150",
          open
            ? "opacity-100 visible pointer-events-auto"
            : "opacity-0 invisible pointer-events-none group-hover/tooltip:opacity-100 group-hover/tooltip:visible"
        )}
      >
        {content}
        {learnMoreHref && (
          <>
            {" "}
            <Link href={learnMoreHref} className="font-medium text-primary hover:underline inline-block mt-1" onClick={(e) => e.stopPropagation()}>
              Learn more →
            </Link>
          </>
        )}
      </span>
    </span>
  );
}
