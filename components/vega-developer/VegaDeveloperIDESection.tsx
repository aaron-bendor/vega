"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimateOnScroll } from "@/components/landing/AnimateOnScroll";
import { LANDING_CTA_HREFS } from "@/lib/landing-cta";

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
            <ul className="mt-8 space-y-1">
              {features.map((item, i) => (
                <li key={item}>
                  <AnimateOnScroll
                    delay={i * 90}
                    direction="up"
                    className="group flex items-start gap-3 rounded-lg px-3 py-2 -mx-3 transition-all duration-300 ease-out hover:bg-[rgba(167,139,250,0.12)] hover:translate-x-1 cursor-default"
                  >
                    <span className="font-dm-mono text-lg mt-0.5 shrink-0 transition-all duration-300 ease-out text-[#7c3aed] group-hover:translate-x-0.5 group-hover:scale-105" aria-hidden>
                      →
                    </span>
                    <p className="font-dm-sans font-light text-base md:text-lg leading-[1.4] text-white/90 transition-colors duration-300 ease-out group-hover:text-[rgba(228,215,255,0.95)]">
                      {item}
                    </p>
                  </AnimateOnScroll>
                </li>
              ))}
            </ul>
            <AnimateOnScroll delay={0.2}>
              <Link
                href={LANDING_CTA_HREFS.developerDemo}
                className="mt-10 inline-flex items-center justify-center h-[50px] px-8 rounded-[30px] bg-[#6b21e8] text-white font-dm-sans font-bold text-base hover:bg-[#5a1bc4] hover:scale-[1.02] active:scale-[0.98] transition-[transform,background-color] duration-motion-normal ease-motion"
              >
                Start Building →
              </Link>
            </AnimateOnScroll>
          </div>
          {/* Laptop with publish modal — full device, no crop */}
          <AnimateOnScroll delay={0.1} direction="right" className="flex-shrink-0 w-full lg:w-[55%] order-1 lg:order-2 flex justify-center">
            <div className="relative w-full max-w-[800px] flex justify-center">
              <Image
                src="/fullPython.png?v=2"
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
