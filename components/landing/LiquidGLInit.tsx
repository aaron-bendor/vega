"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    liquidGL?: (opts: Record<string, unknown>) => unknown;
    html2canvas?: unknown;
  }
}

const LIQUID_GL_OPTIONS = {
  snapshot: "body",
  target: ".liquidGL-nav",
  resolution: 1,
  refraction: 0.01,
  bevelDepth: 0.08,
  bevelWidth: 0.15,
  frost: 1,
  shadow: false,
  specular: false,
  reveal: "fade" as const,
  tilt: false,
};

function waitForFonts(): Promise<void> {
  const doc = document as Document & { fonts?: { ready?: Promise<unknown> } };
  const p = doc.fonts?.ready?.catch(() => undefined);
  return p ? p.then(() => undefined) : Promise.resolve();
}

export function LiquidGLInit() {
  const initDone = useRef(false);

  useEffect(() => {
    if (initDone.current || typeof window === "undefined") return;

    let cancelled = false;

    function shouldSkipLiquidGL(): boolean {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
      if (window.matchMedia("(max-width: 767px)").matches) return true; // below tablet
      if (window.matchMedia("(pointer: coarse)").matches) return true;
      const nav = navigator as Navigator & { deviceMemory?: number };
      if (typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4) return true;
      return false;
    }

    async function init() {
      if (shouldSkipLiquidGL()) return;

      const waitFor = (key: keyof Window): Promise<void> =>
        new Promise((resolve) => {
          const t = setInterval(() => {
            if (cancelled) {
              clearInterval(t);
              return;
            }
            if ((window as Window)[key]) {
              clearInterval(t);
              resolve();
            }
          }, 25);
        });

      await waitFor("liquidGL");
      if (cancelled) return;
      await waitFor("html2canvas");
      if (cancelled) return;

      await waitForFonts();
      if (cancelled) return;

      await new Promise<void>((r) => requestAnimationFrame(() => r()));
      if (cancelled) return;

      if (shouldSkipLiquidGL() || !document.querySelector(".liquidGL-nav")) return;

      try {
        window.liquidGL?.(LIQUID_GL_OPTIONS);
        initDone.current = true;
      } catch (e) {
        console.warn("liquidGL init failed", e);
      }
    }

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"
        strategy="afterInteractive"
      />
      <Script
        src="/scripts/liquidGL.js"
        strategy="afterInteractive"
      />
    </>
  );
}
