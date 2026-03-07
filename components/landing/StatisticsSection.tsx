"use client";

import Image from "next/image";
import { AnimateOnScroll } from "./AnimateOnScroll";
import { CountUp } from "./CountUp";

const stats = [
  {
    value: <CountUp to={70} suffix="%" />,
    description:
      "of all stock market trades are executed by algorithms. Every time you buy a stock, it\u2019s likely an algo on the other side.",
  },
  {
    value: <CountUp to={5} prefix="$" suffix="T" />,
    description:
      "managed by hedge funds using algorithmic strategies, exclusively accessible to accredited investors with \u00a3200K+ income.",
  },
  {
    value: <CountUp to={99.3} suffix="%" decimals={1} />,
    description:
      "of the population has zero access to algorithmic investing tools.",
  },
];

export function StatisticsSection() {
  return (
    <section
      id="market-stats"
      className="relative w-full min-h-screen bg-white flex items-center overflow-hidden"
    >
      <div className="relative max-w-[1200px] mx-auto px-4 md:px-8 py-16 md:py-20 w-full">
        <AnimateOnScroll>
          <p className="font-dm-mono text-sm md:text-xl font-normal text-[#531cb3] tracking-[2px] leading-tight">
            {"// OUR MISSION"}
          </p>
        </AnimateOnScroll>

        <AnimateOnScroll delay={100}>
          <h2 className="font-maven-pro font-extrabold text-[#111] text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-[-2px] leading-[1.3] mt-4 max-w-[900px]">
            Algorithms trade the markets. Not you.
          </h2>
        </AnimateOnScroll>

        {/* Stats grid */}
        <div className="mt-12 md:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-14">
          {stats.map((stat, i) => (
            <AnimateOnScroll key={i} delay={150 + i * 150}>
              <div className="relative">
                {/* Purple gradient behind each stat (e.g. behind 70%) */}
                <div
                  className="absolute -top-16 -left-8 w-[300px] h-[300px] rounded-full opacity-10 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(50% 50% at 50% 50%, rgba(83,28,179,1) 0%, rgba(83,28,179,0) 87%)",
                  }}
                  aria-hidden
                />
                <div className="relative">
                  <p className="font-maven-pro font-extrabold text-[#793de1] text-5xl sm:text-6xl md:text-[80px] tracking-[-2px] leading-[1]">
                    {stat.value}
                  </p>
                  <p className="font-dm-sans font-light text-[#333] text-base md:text-xl leading-6 mt-5 max-w-[280px]">
                    {stat.description}
                  </p>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>

        {/* "This is why we built Vega" footer with thisiswhybuiltvega.png */}
        <AnimateOnScroll delay={600} className="mt-14 md:mt-20">
          <div className="flex items-center flex-wrap gap-3">
            <p className="font-maven-pro font-semibold text-[#111] text-2xl md:text-[50px] tracking-[-2px] leading-[1.6]">
              This is why we built
            </p>
            <Image
              src="/thisiswhybuiltvega.png"
              alt="Vega"
              width={140}
              height={56}
              className="h-8 md:h-14 w-auto object-contain"
            />
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
