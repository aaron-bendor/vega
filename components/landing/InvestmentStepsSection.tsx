"use client";

import { AnimateOnScroll } from "./AnimateOnScroll";

export function InvestmentStepsSection() {
  return (
    <section
      id="get-started"
      className="relative w-full bg-black py-24 md:py-36 flex items-center justify-center"
    >
      <div className="max-w-[540px] mx-auto px-4 text-center">
        <AnimateOnScroll>
          <p className="font-dm-mono text-sm md:text-xl font-light text-violet-500 tracking-[2px] leading-tight">
            {"// Get Started"}
          </p>
        </AnimateOnScroll>

        <AnimateOnScroll delay={100}>
          <h2 className="mt-6 font-syne font-extrabold text-3xl sm:text-4xl md:text-6xl tracking-[-2px] leading-[1.05]">
            <span className="text-[#f0edff]">
              The market
              <br />
              is already
              <br />
              running
              <br />
              algorithms.
              <br />
            </span>
            <span className="text-violet-500">
              So should
              <br />
              you.
            </span>
          </h2>
        </AnimateOnScroll>

        <AnimateOnScroll delay={200}>
          <p className="mt-8 font-dm-sans font-light text-[#7b7394] text-sm md:text-base leading-[1.6]">
            Join thousands of investors and developers building the
            <br className="hidden sm:inline" />
            future of retail finance on Vega.
          </p>
        </AnimateOnScroll>

        <AnimateOnScroll delay={300}>
          <div className="mt-10 flex justify-center">
            <a
              href="https://tally.so/r/ZjaKj5"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-14 px-7 rounded-[10px] border border-[#6b21e84c] text-[#f0edff] font-dm-sans font-normal text-[15px] hover:border-[#6b21e899] hover:bg-[#6b21e80d] hover:scale-[1.02] active:scale-[0.98] transition-[transform,background-color] duration-motion-normal ease-motion"
            >
              Register Interest for Vega Financial&nbsp;→
            </a>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
