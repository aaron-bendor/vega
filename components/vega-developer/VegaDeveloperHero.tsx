"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimateOnScroll } from "@/components/landing/AnimateOnScroll";

export function VegaDeveloperHero() {
  return (
    <section className="relative w-full py-16 md:py-24 overflow-hidden">
      <div className="relative max-w-[1360px] mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          <div className="flex-1 order-2 lg:order-1">
            <AnimateOnScroll>
              <p className="font-dm-mono text-sm md:text-xl font-light text-violet-500 tracking-[2px] leading-tight">
                {"// COMING SOON"}
              </p>
            </AnimateOnScroll>
            <AnimateOnScroll delay={0.1}>
              <h1 className="mt-4 max-w-[525px] text-white text-2xl sm:text-3xl md:text-[40px] leading-tight tracking-tight font-semibold">
                All-in-one interface for algorithm development
              </h1>
            </AnimateOnScroll>
            <AnimateOnScroll delay={0.15}>
              <Link
                href="/#get-started"
                className="mt-8 inline-flex items-center justify-center h-[50px] px-8 rounded-[30px] bg-white/10 backdrop-blur-sm border border-white/20 text-white font-dm-sans font-bold text-base hover:bg-white/15 hover:scale-[1.02] active:scale-[0.98] transition-[transform,background-color,border-color] duration-motion-normal ease-motion"
              >
                Learn more
              </Link>
            </AnimateOnScroll>
          </div>
          {/* Laptop — full device, no crop: natural size with object-contain */}
          <AnimateOnScroll delay={0.15} direction="right" className="flex-shrink-0 w-full lg:w-[60%] order-1 lg:order-2 flex justify-center">
            <div className="relative w-full max-w-[900px] flex justify-center items-start">
              <Image
                src="/macbookvegadeveloper.png"
                alt="MacBook displaying Vega Developer IDE"
                width={1200}
                height={900}
                className="w-full h-auto object-contain object-top"
                sizes="(max-width: 768px) 100vw, 900px"
              />
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
