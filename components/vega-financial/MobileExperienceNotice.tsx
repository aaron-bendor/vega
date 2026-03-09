"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "vega-mobile-experience-notice-dismissed";

export function MobileExperienceNotice() {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    const hidden = window.localStorage.getItem(STORAGE_KEY) === "1";
    setDismissed(hidden);
  }, []);

  if (dismissed) return null;

  return (
    <div className="px-4 pt-4 lg:hidden">
      <div className="rounded-2xl border border-border/80 bg-muted/40 px-4 py-3">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Mobile demo
            </p>
            <p className="mt-1 text-sm leading-6 text-foreground">
              This mobile version is simplified. Full experience works best on a laptop.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              window.localStorage.setItem(STORAGE_KEY, "1");
              setDismissed(true);
            }}
            className="min-h-[44px] min-w-[44px] rounded-md text-sm text-muted-foreground hover:text-foreground"
            aria-label="Dismiss mobile demo notice"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
