"use client";

import Image from "next/image";
import { AnimateOnScroll } from "@/components/landing/AnimateOnScroll";

const algorithmFeatures = [
  { title: "Runs 24/7", description: "without breaks or fatigue" },
  { title: "No emotional decisions;", description: "follows its rules exactly" },
  { title: "Executes instantly", description: "when conditions are met" },
  { title: "Backtestable", description: "against historical data before going live" },
  { title: "Fully consistent;", description: "the 1,000th trade follows the same logic as the first" },
];

const humanTraderLimitations = [
  "Needs sleep, misses overnight moves",
  "Subject to fear, greed, and hesitation",
  "Reaction time limited by human cognition",
  "Past decisions can't be reliably replicated or tested",
  "Performance varies day to day based on mood and energy",
];

export function AlgorithmImportanceSection(): JSX.Element {
  return (
    <section className="relative w-full min-h-0 md:min-h-screen bg-white flex flex-col justify-center py-16 md:py-20">
      <div className="max-w-[1400px] xl:max-w-[1520px] mx-auto px-6 md:px-10 lg:px-12 xl:px-16 w-full">
        <AnimateOnScroll direction="up" duration={600} distance={24}>
        <header className="flex flex-col gap-[33px] mb-12">
          <div className="font-dm-mono font-normal text-[#531cb3] text-xl tracking-[2px] leading-[17.6px]">
            {"// WHY IT MATTERS"}
          </div>
          <h2 className="font-maven-pro font-extrabold text-[#111111] text-3xl md:text-4xl lg:text-[50px] tracking-[-2px] leading-tight">
            <span className="font-bold">Why algorithms</span> <span className="text-[#793de1] font-bold">outperform</span> <span className="font-bold">human traders.</span>
          </h2>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-[#793de1] rounded-[20px] overflow-hidden">
          <div className="bg-[#f0edff80] border-b border-[#793de1] md:border-b-0 md:border-r md:border-[#793de1] p-6 md:p-10 rounded-t-[20px] md:rounded-tr-none">
            <h3 className="font-maven-pro font-bold text-[#333333] text-xl md:text-[22px] tracking-[-0.55px] leading-[1.4] md:leading-[35px]">
              Algorithms
            </h3>
            <p className="font-maven-pro font-normal text-[#333333] text-sm md:text-base tracking-[-0.55px] leading-[1.5] md:leading-[35px] mt-1">
              <span className="font-semibold">Rules-based, automated, consistent</span>
            </p>
            <ul className="mt-4 md:mt-6 list-none space-y-2 md:space-y-[9px] font-maven-pro text-sm md:text-base tracking-[-0.55px] leading-[1.5] md:leading-[35px] text-black">
              {algorithmFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="shrink-0 w-[15px] h-[15px] relative mt-[0.4em]" style={{ lineHeight: 1 }}>
                    <Image src="/greendot.png" alt="" width={15} height={15} className="object-contain" />
                  </span>
                  <span>
                    <span className="font-medium">{feature.title}</span>{" "}
                    <span className="font-normal">{feature.description}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white border border-t-0 md:border-t border-l-0 border-[#793de180] rounded-b-[20px] md:rounded-bl-none md:rounded-[0_20px_20px_0] p-6 md:p-10 opacity-90">
            <h3 className="font-maven-pro font-bold text-[#333333] text-xl md:text-[22px] tracking-[-0.55px] leading-[1.4] md:leading-[35px] opacity-76">
              Human Trader
            </h3>
            <p className="font-maven-pro font-normal text-[#333333] text-sm md:text-base tracking-[-0.55px] leading-[1.5] md:leading-[35px] mt-1 opacity-80">
              <span className="font-semibold">Intuition-based, manual, variable</span>
            </p>
            <ul className="mt-4 md:mt-6 list-none space-y-2 md:space-y-[9px] font-maven-pro font-normal text-[#333333] text-sm md:text-base tracking-[-0.55px] leading-[1.5] md:leading-[35px] opacity-70">
              {humanTraderLimitations.map((limitation, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="shrink-0 w-[15px] h-[15px] relative mt-[0.4em] opacity-40" style={{ lineHeight: 1 }}>
                    <Image src="/graydot.png" alt="" width={15} height={15} className="object-contain" />
                  </span>
                  {limitation}
                </li>
              ))}
            </ul>
          </div>
        </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
