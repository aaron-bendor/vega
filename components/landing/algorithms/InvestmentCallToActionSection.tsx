"use client";

import Link from "next/link";
import { AnimateOnScroll } from "@/components/landing/AnimateOnScroll";
import { LANDING_CTA, LANDING_CTA_HREFS } from "@/lib/landing-cta";

export function InvestmentCallToActionSection(): JSX.Element {
  return (
    <section className="relative w-full min-h-0 md:min-h-screen bg-black flex flex-col justify-center py-20 md:py-24">
      <AnimateOnScroll direction="up" duration={600} distance={20}>
      <div className="max-w-[738px] mx-auto px-4 text-center flex flex-col items-center gap-8">
        <div className="font-dm-mono font-light text-violet-500 text-xl tracking-[2px] leading-[17.6px]">
          {"// GET STARTED"}
        </div>
        <h2 className="font-syne font-extrabold text-4xl md:text-5xl lg:text-6xl text-center tracking-[-2px] leading-[63px]">
          <span className="text-[#f0edff]">Ready to invest</span>
          <br />
          <span className="text-violet-500">in algorithms?</span>
        </h2>
      </div>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 mt-10 sm:mt-12 px-4 w-full max-w-[738px] mx-auto">
        <Link
          href={LANDING_CTA_HREFS.investorDemo}
          className="inline-flex justify-center items-center min-h-[48px] h-12 px-6 sm:px-8 w-full sm:w-auto sm:min-w-[200px] bg-[#6b21e8] rounded-[10px] shadow-[0px_0px_40px_#6b21e866] font-dm-sans font-medium text-white text-[15px] transition-all hover:bg-[#5a1bc4] active:scale-[0.98] focus-visible:outline focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          aria-label={LANDING_CTA.investorPrimary}
        >
          {LANDING_CTA.investorPrimary}
        </Link>
        <Link
          href={LANDING_CTA_HREFS.developerPlatform}
          className="inline-flex justify-center items-center min-h-[48px] h-12 px-6 sm:px-8 w-full sm:w-auto sm:min-w-[200px] rounded-[10px] border border-[#6b21e84c] shadow-[0px_1px_5px_#531cb3] font-dm-sans font-normal text-[#f0edff] text-[15px] transition-all hover:border-violet-500 hover:shadow-[0px_1px_8px_#531cb3] active:scale-[0.98] focus-visible:outline focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          aria-label={`${LANDING_CTA.developerPrimary} — ${LANDING_CTA.developerSecondary}`}
        >
          {LANDING_CTA.developerPrimary}
        </Link>
      </div>
      </AnimateOnScroll>
    </section>
  );
}
