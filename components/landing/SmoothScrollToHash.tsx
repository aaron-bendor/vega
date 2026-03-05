"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function scrollToHash(hash: string) {
  if (!hash) return;
  const el = document.getElementById(hash);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/**
 * On landing page, when URL has a hash (e.g. /#investing-made-simple),
 * smoothly scroll to the target element. Handles both initial load and in-page anchor clicks.
 */
export function SmoothScrollToHash() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const runScroll = () => {
      const hash = window.location.hash?.slice(1);
      if (!hash) return;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => scrollToHash(hash));
      });
    };

    runScroll();

    window.addEventListener("hashchange", runScroll);
    return () => window.removeEventListener("hashchange", runScroll);
  }, [pathname]);

  return null;
}
