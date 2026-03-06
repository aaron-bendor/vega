"use client";

import { useState, useEffect, useRef } from "react";

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Restrained count-up for numeric display. Animates from 0 (or previous value) to target over duration.
 * Respects prefers-reduced-motion (no animation when reduced).
 */
export function useCountUp(
  value: number,
  options: { duration?: number; enabled?: boolean } = {}
) {
  const { duration = 1000, enabled = true } = options;
  const [display, setDisplay] = useState(enabled ? 0 : value);
  const prevValue = useRef(value);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled) {
      setDisplay(value);
      prevValue.current = value;
      return;
    }
    if (prefersReducedMotion()) {
      setDisplay(value);
      prevValue.current = value;
      return;
    }

    const start = performance.now();
    const from = prevValue.current;

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) * (1 - progress);
      setDisplay(from + (value - from) * eased);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        prevValue.current = value;
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value, duration, enabled]);

  return display;
}
