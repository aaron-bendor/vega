"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimateOnScroll } from "./AnimateOnScroll";
import { TypingEffect } from "./TypingEffect";

const features = [
  "Full performance history and more metrics",
  "Curated collections built for your risk appetite",
  "Invest any amount — no minimum, no lock-in",
  "Algorithm source code stays private — your edge is protected",
  "All algorithms reviewed by our team before going live",
];

const TYPING_FIRST_PHRASE = "the everyday investor";

export function ProductFeaturesSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section id="built-for" className="relative z-0 w-full min-w-0 overflow-hidden py-16 md:py-24">
      <div className="pointer-events-none absolute inset-0 z-0 bg-white" aria-hidden />
      <div className="relative z-10 max-w-[1200px] mx-auto w-full min-w-0 px-4 md:px-8">
        <AnimateOnScroll>
          <h2 className="font-maven-pro font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-[-2px] leading-[1.25] min-h-[2.6em]">
            <span className="text-black font-extrabold">Built for </span>
            {mounted ? (
              <TypingEffect
                className="font-maven-pro text-[#531cb3] font-black md:tracking-[-2px] tracking-[2px]"
                caretClassName="text-[#531cb3]"
              />
            ) : (
              <span className="font-maven-pro text-[#531cb3] font-black md:tracking-[-2px] tracking-[2px]">
                {TYPING_FIRST_PHRASE}
              </span>
            )}
          </h2>
        </AnimateOnScroll>

        <div className="mt-10 md:mt-16 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Left: phone showcase */}
          <AnimateOnScroll direction="left" className="flex-shrink-0 w-full lg:w-1/2 flex justify-center">
            <div className="relative w-full max-w-[600px]">
              <Image
                src="/builtforPhones.png?v=2"
                alt="Built for everyone — multiple phone mockups"
                width={600}
                height={450}
                className="w-full h-auto object-contain"
                sizes="(max-width: 768px) 100vw, 600px"
              />
            </div>
          </AnimateOnScroll>

          {/* Right: features + CTA */}
          <div className="flex-1">
            <AnimateOnScroll>
              <p className="font-dm-sans font-medium text-[#333] text-base md:text-xl leading-[1.6] max-w-[487px]">
                Browse verified trading algorithms built by real developers. See
                live performance, risk metrics, and creator backgrounds, and invest
                with a single tap.
              </p>
            </AnimateOnScroll>

            <ul className="mt-6 space-y-2.5">
              {features.map((feature, i) => (
                <li key={feature}>
                  <AnimateOnScroll
                    delay={i * 90}
                    direction="up"
                    className="flex items-start gap-3 rounded-lg px-3 py-2 -mx-3 transition-all duration-300 ease-out hover:bg-[#531cb3]/10 hover:translate-x-1 cursor-default group"
                  >
                    <span className="font-dm-mono text-sm mt-0.5 shrink-0 transition-all duration-300 ease-out text-[#531cb3] group-hover:translate-x-1 group-hover:text-[#7c3aed] group-hover:scale-110">
                      →
                    </span>
                    <p className="font-dm-sans font-light text-base md:text-lg leading-[1.4] text-[#333] transition-colors duration-300 ease-out group-hover:text-[#531cb3]">
                      {feature}
                    </p>
                  </AnimateOnScroll>
                </li>
              ))}
            </ul>

            <AnimateOnScroll delay={300}>
              <Link
                href="/vega-financial"
                className="mt-8 inline-flex items-center justify-center h-[50px] px-8 rounded-[30px] bg-[#6b21e8] text-white font-dm-sans font-bold text-base md:text-lg hover:bg-[#5a1bc4] hover:scale-[1.02] active:scale-[0.98] transition-[transform,background-color] duration-motion-normal ease-motion"
              >
                Learn more
              </Link>
            </AnimateOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}
