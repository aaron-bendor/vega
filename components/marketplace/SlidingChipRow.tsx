"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface ChipItem {
  href: string;
  label: string;
}

interface SlidingChipRowProps {
  chips: ChipItem[];
  activeHref: string;
  className?: string;
}

/**
 * A row of filter chips with a single shared sliding pill behind the selected (or hovered) chip.
 * Animates via transform/opacity only; respects reduced motion (instant).
 */
export function SlidingChipRow({ chips, activeHref, className }: SlidingChipRowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [pill, setPill] = useState({ left: 0, top: 0, width: 0, height: 0 });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const activeIndex = chips.findIndex((c) => c.href === activeHref);
  const displayIndex = hoveredIndex ?? (activeIndex >= 0 ? activeIndex : null);

  const updatePill = useCallback(() => {
    const container = containerRef.current;
    if (!container || displayIndex == null || displayIndex < 0 || displayIndex >= chipRefs.current.length) {
      setPill((prev) => (prev.width === 0 ? prev : { left: 0, top: 0, width: 0, height: 0 }));
      return;
    }
    const el = chipRefs.current[displayIndex];
    if (!el) return;
    const cr = container.getBoundingClientRect();
    const er = el.getBoundingClientRect();
    setPill({
      left: er.left - cr.left,
      top: er.top - cr.top,
      width: er.width,
      height: er.height,
    });
  }, [displayIndex]);

  useLayoutEffect(() => {
    updatePill();
  }, [updatePill]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver(updatePill);
    ro.observe(container);
    return () => ro.disconnect();
  }, [updatePill]);

  return (
    <div
      ref={containerRef}
      className={cn("relative flex flex-wrap gap-1.5", className)}
    >
      {/* Shared selection pill: transform/opacity only; motion-reduce snaps */}
      <span
        aria-hidden
        className={cn(
          "absolute rounded-md bg-primary/90 pointer-events-none ease-motion",
          "transition-[transform,width,height,opacity] duration-[200ms] motion-reduce:!duration-0"
        )}
        style={{
          transform: `translate(${pill.left}px, ${pill.top}px)`,
          width: pill.width > 0 ? `${pill.width}px` : 0,
          height: pill.height > 0 ? `${pill.height}px` : 0,
          opacity: pill.width > 0 ? 1 : 0,
        }}
      />
      {chips.map((chip, i) => {
        const isActive = chip.href === activeHref;
        return (
          <Link
            key={chip.href + chip.label}
            ref={(el) => {
              chipRefs.current[i] = el;
            }}
            href={chip.href}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            className={cn(
              "relative z-10 inline-block px-2.5 py-1 rounded-md text-sm",
              "transition-[transform,color,background-color,border-color,box-shadow] duration-[200ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]",
              "focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
              "active:scale-[0.98] motion-reduce:active:scale-100",
              isActive
                ? "text-primary-foreground border border-primary bg-primary/95"
                : "bg-transparent text-foreground border border-transparent hover:bg-muted/50 hover:border-[rgba(51,51,51,0.08)]"
            )}
            aria-selected={isActive}
            aria-current={isActive ? "page" : undefined}
          >
            {chip.label}
          </Link>
        );
      })}
    </div>
  );
}
