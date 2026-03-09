"use client";

import { AnimateOnScroll } from "@/components/landing/AnimateOnScroll";
import { GoldSilverExplainer } from "./GoldSilverExplainer";

export function TradingAlgorithmExampleSection(): JSX.Element {
  return (
    <section
      className="relative w-full min-h-0 md:min-h-screen flex flex-col justify-center py-0"
      aria-label="Trading Algorithm Example"
    >
      <AnimateOnScroll direction="up" duration={600} distance={24}>
        <GoldSilverExplainer />
      </AnimateOnScroll>
    </section>
  );
}
