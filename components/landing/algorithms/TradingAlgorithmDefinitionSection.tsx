"use client";

import { AnimateOnScroll } from "@/components/landing/AnimateOnScroll";

export function TradingAlgorithmDefinitionSection(): JSX.Element {
  const contentData = {
    subtitle: "// THE DEFINITION",
    title: "What are trading algorithms?",
    paragraphs: [
      "A trading algorithm is a set of rules that automatically buys and sells financial assets — like currencies, stocks, or commodities — based on data and pre-defined conditions. Unlike a human trader, it has no emotion, it doesn't panic when markets drop, or get greedy when they rise. It simply follows its rules, around the clock, without hesitation or error.",
      "For decades, algorithms have been the backbone of financial markets. Around 70% of all trades are now executed by algorithms rather than humans. Investment banks use them for high-frequency trading. Hedge funds use them to run systematic strategies across global markets.",
      "The strategies vary enormously. Some look for tiny price discrepancies between assets and exploit them in milliseconds. Others analyse long-term trends and take positions that hold for weeks. Some use machine learning to spot patterns that no human would notice.",
    ],
  };

  return (
    <section className="relative w-full min-h-screen bg-white flex flex-col justify-center">
      <div className="max-w-[1210px] mx-auto px-6 md:px-10 lg:px-[190px] py-16 md:py-20 w-full">
        <AnimateOnScroll direction="up" duration={600} distance={20}>
        <h2 className="font-dm-mono font-normal text-[#531cb3] text-xl tracking-[2px] leading-[17.6px]">
          {contentData.subtitle}
        </h2>
        <h3 className="font-maven-pro font-extrabold text-[#111111] text-4xl md:text-5xl lg:text-6xl tracking-[-2px] leading-[60px] mt-2">
          {contentData.title}
        </h3>
        <div className="flex flex-col gap-5 mt-10">
          {contentData.paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className="font-maven-pro font-normal text-[#333333] text-lg md:text-xl tracking-[-0.55px] leading-[30px]"
            >
              {paragraph}
            </p>
          ))}
        </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
