"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right";

interface Props {
  children: ReactNode;
  className?: string;
  /** Delay in ms */
  delay?: number;
  duration?: number;
  distance?: number;
  direction?: Direction;
  once?: boolean;
  scaleFrom?: number;
}

export function AnimateOnScroll({
  children,
  className = "",
  delay = 0,
  duration = 420,
  distance = 16,
  direction = "up",
  once = true,
  scaleFrom = 0.985,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  const hiddenTransform = {
    up: `translate3d(0, ${distance}px, 0) scale(${scaleFrom})`,
    down: `translate3d(0, -${distance}px, 0) scale(${scaleFrom})`,
    left: `translate3d(${distance}px, 0, 0) scale(${scaleFrom})`,
    right: `translate3d(-${distance}px, 0, 0) scale(${scaleFrom})`,
  }[direction];

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translate3d(0,0,0) scale(1)" : hiddenTransform,
        transition: `
          opacity ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms,
          transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms
        `,
        willChange: visible ? "auto" : "transform, opacity",
      }}
    >
      {children}
    </div>
  );
}
