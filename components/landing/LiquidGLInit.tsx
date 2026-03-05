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
  resolution: 1.5,
  refraction: 0.01,
  bevelDepth: 0.08,
  bevelWidth: 0.15,
  frost: 1,
  shadow: true,
  specular: true,
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

    async function init() {
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

      if (!document.querySelector(".liquidGL-nav")) return;

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
