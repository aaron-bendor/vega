"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimateOnScroll } from "./AnimateOnScroll";

const features = [
  "Full performance history and more metrics",
  "Curated collections built for your risk appetite",
  "Invest any amount \u2014 no minimum, no lock-in",
  "Algorithm source code stays private \u2014 your edge is protected",
  "All algorithms reviewed by our team before going live",
];

export function ProductFeaturesSection() {
  return (
    <section id="built-for" className="relative w-full bg-white py-16 md:py-24 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <AnimateOnScroll>
          <p className="font-dm-mono text-sm md:text-xl font-normal text-[#531cb3] tracking-[2px] leading-tight">
            {"// WHO IS IT FOR"}
          </p>
        </AnimateOnScroll>

        <AnimateOnScroll delay={0.1}>
          <h2 className="font-maven-pro font-extrabold text-[#111] text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-[-2px] leading-[1.15] mt-4">
            Built for the everyday investor
          </h2>
        </AnimateOnScroll>

        <div className="mt-10 md:mt-16 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Left: phone showcase */}
          <AnimateOnScroll direction="left" className="flex-shrink-0 w-full lg:w-1/2 flex justify-center">
            <div className="relative w-full max-w-[600px]">
              <Image
                src="/builtforPhones.png"
                alt="Built for everyone \u2014 multiple phone mockups"
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

            <AnimateOnScroll delay={0.15}>
              <ul className="mt-6 space-y-2.5">
                {features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 group">
                    <span className="font-dm-mono text-[#531cb3] text-sm mt-0.5 shrink-0 group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                    <p className="font-dm-sans font-light text-[#333] text-base md:text-lg leading-[1.4]">
                      {feature}
                    </p>
                  </li>
                ))}
              </ul>
            </AnimateOnScroll>

            <AnimateOnScroll delay={0.3}>
              <Link
                href="/vega-financial"
                className="mt-8 inline-flex items-center justify-center h-[50px] px-8 rounded-[30px] bg-[#6b21e8] text-white font-dm-sans font-bold text-base md:text-lg hover:bg-[#5a1bc4] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
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
