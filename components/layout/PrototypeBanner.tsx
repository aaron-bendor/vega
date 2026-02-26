import { Info } from "lucide-react";

export const PROTOTYPE_BANNER_TEXT =
  "University prototype. Synthetic data. Paper trading only. Not investment advice.";

export function PrototypeBanner() {
  return (
    <div className="bg-[rgba(51,51,51,0.04)] border-b border-[rgba(51,51,51,0.12)] py-1.5 px-4">
      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <Info className="size-3.5 shrink-0" />
        <span>{PROTOTYPE_BANNER_TEXT}</span>
        <span className="inline-flex items-center rounded-full border border-brand-p1/40 px-2 py-0.5 text-[10px] font-medium text-brand-p3">
          Paper trading
        </span>
      </div>
    </div>
  );
}
