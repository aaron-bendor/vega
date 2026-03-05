"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimateOnScroll } from "@/components/landing/AnimateOnScroll";

const features = [
  "Full Python IDE with live market data access",
  "Built-in backtesting and performance analysis",
  "Publish once — immutable, verifiable, trusted",
  "Earn performance fees proportional to AUM",
  "The ultimate differentiator for quant job applications",
];

export function VegaDeveloperIDESection() {
  return (
    <section className="relative w-full py-16 md:py-24 overflow-hidden">
      <div className="relative max-w-[1360px] mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          <div className="flex-1 order-2 lg:order-1">
            <AnimateOnScroll>
              <h2 className="text-white text-2xl sm:text-3xl md:text-[40px] leading-tight tracking-tight font-bold max-w-[500px]">
                Full Python IDE with everything you need
              </h2>
            </AnimateOnScroll>
            <AnimateOnScroll delay={0.1}>
              <ul className="mt-8 space-y-3">
                {features.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="font-dm-mono text-violet-500 text-sm mt-1 shrink-0">→</span>
                    <p className="font-dm-sans font-light text-white/90 text-base md:text-lg leading-relaxed">
                      {item}
                    </p>
                  </li>
                ))}
              </ul>
            </AnimateOnScroll>
            <AnimateOnScroll delay={0.2}>
              <Link
                href="/#get-started"
                className="mt-10 inline-flex items-center justify-center h-[50px] px-8 rounded-[30px] bg-[#6b21e8] text-white font-dm-sans font-bold text-base hover:bg-[#5a1bc4] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                Start Building →
              </Link>
            </AnimateOnScroll>
          </div>
          {/* Laptop with publish modal — full device, no crop */}
          <AnimateOnScroll delay={0.1} direction="right" className="flex-shrink-0 w-full lg:w-[55%] order-1 lg:order-2 flex justify-center">
            <div className="relative w-full max-w-[800px] flex justify-center">
              <Image
                src="/fullPython.png"
                alt="Laptop showing Vega Developer publish dialog"
                width={1200}
                height={900}
                className="w-full h-auto object-contain object-top"
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
