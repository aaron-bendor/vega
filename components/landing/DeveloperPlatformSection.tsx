"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimateOnScroll } from "./AnimateOnScroll";

export function DeveloperPlatformSection() {
  return (
    <section id="developer" className="relative w-full bg-black py-16 md:py-24 overflow-hidden">
      <div className="relative max-w-[1360px] mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Left: text content */}
          <div className="flex-1 order-2 lg:order-1">
            <AnimateOnScroll>
              <p className="font-dm-mono text-sm md:text-xl font-light text-violet-500 tracking-[2px] leading-tight">
                {"// COMING SOON"}
              </p>
            </AnimateOnScroll>

            <AnimateOnScroll delay={0.1}>
              <h2 className="mt-4 max-w-[525px] text-white text-2xl sm:text-3xl md:text-[40px] leading-tight tracking-tight">
                <span className="font-semibold">All-in-one interface</span>{" "}
                <span className="font-light">for algorithm development</span>
              </h2>
            </AnimateOnScroll>

            <AnimateOnScroll delay={0.15} className="mt-8 flex items-center gap-3">
              <Image
                src="/vegadeveloper.png"
                alt="Vega Developer"
                width={200}
                height={60}
                className="h-10 md:h-14 w-auto object-contain"
              />
            </AnimateOnScroll>

            <AnimateOnScroll delay={0.2}>
              <Link
                href="/vega-developer"
                className="mt-8 inline-flex items-center justify-center h-[50px] px-8 rounded-[30px] bg-white/10 backdrop-blur-sm border border-white/20 text-white font-dm-sans font-bold text-base hover:bg-white/15 hover:scale-[1.02] active:scale-[0.98] transition-[transform,background-color,border-color] duration-motion-normal ease-motion"
              >
                Learn more
              </Link>
            </AnimateOnScroll>
          </div>

          {/* Right: MacBook image */}
          <AnimateOnScroll delay={0.15} direction="right" className="flex-shrink-0 w-full lg:w-[70%] order-1 lg:order-2">
            <div className="relative w-full">
              <Image
                src="/macbookvegadeveloper.png"
                alt="MacBook Pro displaying Vega Developer algorithm interface"
                width={1200}
                height={900}
                className="w-full h-auto object-contain"
                sizes="(max-width: 768px) 100vw, 900px"
              />
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
