"use client";

import Image from "next/image";
import { AnimateOnScroll } from "@/components/landing/AnimateOnScroll";

const bullets = [
  "Web-hosted IDE built for quant developers.",
  "Fetch live market data, backtest strategies, and publish directly to the platform.",
  "Earn performance fees as investors allocate capital.",
];

export function VegaDeveloperBuildSection() {
  return (
    <section className="relative w-full py-16 md:py-24 overflow-hidden">
      <div className="relative max-w-[1360px] mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Desktop monitor — full device, no crop */}
          <AnimateOnScroll direction="left" className="flex-shrink-0 w-full lg:w-[55%] flex justify-center order-1">
            <div className="relative w-full max-w-[800px] flex justify-center">
              <Image
                src="/buildalgorithms.png?v=2"
                alt="Desktop monitor showing Vega Developer IDE"
                width={1200}
                height={900}
                className="w-full h-auto object-contain object-top"
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </div>
          </AnimateOnScroll>
          <div className="flex-1 order-2">
            <AnimateOnScroll delay={0.1}>
              <h2 className="text-white text-2xl sm:text-3xl md:text-[40px] leading-tight tracking-tight font-bold text-[#a78bfa]">
                Build algorithms. Earn from them.
              </h2>
            </AnimateOnScroll>
            <AnimateOnScroll delay={0.2}>
              <ul className="mt-8 space-y-1">
                {bullets.map((item) => (
                  <li
                    key={item}
                    className="group flex items-start gap-3 rounded-lg py-2 px-2 -mx-2 transition-all duration-300 ease-out hover:bg-[rgba(167,139,250,0.12)] hover:translate-x-1"
                  >
                    <span className="font-dm-mono text-lg mt-0.5 shrink-0 transition-all duration-300 ease-out text-[#7c3aed] group-hover:translate-x-0.5 group-hover:scale-105" aria-hidden>
                      →
                    </span>
                    <p className="font-dm-sans font-light text-white/90 text-base md:text-lg leading-relaxed group-hover:text-[rgba(228,215,255,0.95)] transition-colors duration-300 ease-out">
                      {item}
                    </p>
                  </li>
                ))}
              </ul>
            </AnimateOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}
