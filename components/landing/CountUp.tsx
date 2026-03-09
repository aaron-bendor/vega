"use client";

import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  to: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** Initial value for first paint (avoids zero flash). When set to `to`, no visible animation. */
  initialValue?: number;
}

export function CountUp({
  to,
  duration = 2040,
  decimals = 0,
  prefix = "",
  suffix = "",
  initialValue,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const startVal = initialValue ?? 0;
  const [value, setValue] = useState(initialValue ?? 0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) {
      setValue(to);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [to]);

  useEffect(() => {
    if (!started) return;

    let frame = 0;
    const totalFrames = Math.round(duration / 16);
    const start = startVal;

    const tick = () => {
      frame += 1;
      const progress = Math.min(frame / totalFrames, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const next = start + (to - start) * eased;
      setValue(next);

      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [started, to, duration, startVal]);

  return (
    <span ref={ref}>
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}
