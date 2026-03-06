"use client";

import { useState } from "react";
import { AnimateOnScroll } from "./AnimateOnScroll";

const faqFinancial: { question: string; answer: string }[] = [
  {
    question: "What is VegaFinancial?",
    answer:
      "Vega is a platform that lets you invest in algorithmic trading strategies built by verified developers. Think of it like buying a share in a trading algorithm: as the strategy performs, so does your investment.",
  },
  {
    question: "Do I need any financial knowledge to use Vega?",
    answer:
      "No. Every strategy is described in plain English with no jargon. We show you what the algorithm trades, how it has performed historically, and what level of risk it carries. All explained clearly.",
  },
  {
    question: "How is this different from just buying stocks or index funds?",
    answer:
      "Traditional investing gives you exposure to company performance. Vega gives you exposure to trading strategies. Algorithms can generate returns regardless of whether the market is going up or down, depending on how they're designed.",
  },
  {
    question: "What is a trading algorithm?",
    answer:
      "A trading algorithm is a set of rules that automatically buys and sells financial assets — like currencies, stocks, or commodities — based on data and pre-defined conditions. Unlike a human trader, it has no emotion, it doesn't panic when markets drop, or get greedy when they rise. It simply follows its rules, around the clock, without hesitation or error. For example, an algorithm might be programmed to buy gold when its price drops below a certain level relative to silver, then sell when the gap closes. It runs that logic continuously, far faster and more consistently than any human could.",
  },
  {
    question: "How is this different from a robo-advisor like Nutmeg or Moneybox?",
    answer:
      "Robo-advisors manage a diversified portfolio on your behalf using a fixed approach. Vega lets you choose specific strategies, see exactly how they work, and decide how much to allocate to each. You stay in control.",
  },
  {
    question: "What's the minimum investment?",
    answer:
      "There's no minimum and no requirement to be a sophisticated or high-net-worth investor. You can start with as little as £1.",
  },
  {
    question: "Can I withdraw my money whenever I want?",
    answer:
      "Yes. There are no lock-in periods and no exit fees. You can sell your position at any time, just like selling a stock.",
  },
  {
    question: "How do I know a strategy is safe to invest in?",
    answer:
      "Every strategy goes through human review before it's listed on the platform. You'll also see full backtested performance data, a risk rating, and a profile of the developer who built it. We don't publish strategies without verification.",
  },
  {
    question: 'What does "backtested" mean?',
    answer:
      "Backtesting means running the algorithm against historical market data to see how it would have performed. It's a standard method for evaluating trading strategies, though past performance doesn't guarantee future results, and we're transparent about that.",
  },
  {
    question: "Are my funds protected?",
    answer:
      "Vega is on the path to getting regulated by the FCA. We are working closely with the FCA and compliance experts to mitigate any risks before launching. All trades will also be handled by an already regulated third-party broker, ensuring even more protection to our users.",
  },
  {
    question: "Is there a mobile app?",
    answer:
      "Yes, Vega will be available on iOS and Android, as well as via the web.",
  },
];

const faqDeveloper: { question: string; answer: string }[] = [
  {
    question: "Who can build and publish strategies on Vega?",
    answer:
      "Any established or aspiring quantitative developer with Python knowledge can apply to become a Vega developer. We'll verify your background before you can publish.",
  },
  {
    question: "What tools do I get to build with?",
    answer:
      "Vega Developer is a web-hosted Python IDE with access to live market data, built-in backtesting, and one-click publishing to the platform. You don't need to set up your own infrastructure.",
  },
  {
    question: "How do I earn money?",
    answer:
      "You earn a performance fee — a percentage of the returns generated for investors in your strategy. The more assets your strategy attracts and the better it performs, the more you earn.",
  },
  {
    question: "Why is immutability important?",
    answer:
      "It's what makes the platform trustworthy. Investors can see exactly what algorithm they're backing and know it won't be silently altered. It's the same principle behind transparency in fund management.",
  },
  {
    question: "Can I publish multiple strategies?",
    answer:
      "Yes. Developers can maintain a portfolio of published strategies across different markets and risk profiles.",
  },
  {
    question: "How is this useful for my career?",
    answer:
      "Most quant developers can show code on GitHub or backtests in a notebook. Very few can point to a real algorithm that has managed real investor capital. A published Vega strategy gives you a live, verifiable track record, which is the hardest thing to come by early in a quant career, and the thing that hiring managers at hedge funds and prop trading firms actually want to see.",
  },
];

function FaqItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-[rgba(51,51,51,0.12)] last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-4 py-5 text-left focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#531cb3] focus-visible:ring-offset-2 rounded"
        aria-expanded={isOpen}
      >
        <span className="font-maven-pro font-semibold text-[#333] text-base md:text-lg leading-snug pr-4">
          {question}
        </span>
        <span
          className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-[#531cb3]/10 text-[#531cb3] transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          aria-hidden
        >
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-200 ease-out ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p className="font-dm-sans text-[#333]/90 text-sm md:text-base leading-relaxed pb-5 pr-12">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

function FaqBlock({
  title,
  items,
  openIndex,
  onOpenIndex,
  baseKey,
}: {
  title: string;
  items: { question: string; answer: string }[];
  openIndex: number | null;
  onOpenIndex: (i: number | null) => void;
  baseKey: string;
}) {
  return (
    <div className="w-full">
      <h3 className="font-maven-pro font-bold text-[#531cb3] text-lg md:text-xl mb-6">
        {title}
      </h3>
      <div className="bg-white rounded-xl border border-[rgba(51,51,51,0.12)] px-4 md:px-6 shadow-sm">
        {items.map((item, i) => (
          <FaqItem
            key={`${baseKey}-${i}`}
            question={item.question}
            answer={item.answer}
            isOpen={openIndex === i}
            onToggle={() => onOpenIndex(openIndex === i ? null : i)}
          />
        ))}
      </div>
    </div>
  );
}

export function FaqSection() {
  const [financialOpen, setFinancialOpen] = useState<number | null>(0);
  const [developerOpen, setDeveloperOpen] = useState<number | null>(null);

  return (
    <section
      id="faq"
      className="relative z-0 w-full overflow-hidden py-16 md:py-24 bg-[#fafafa]"
    >
      <div className="relative z-10 max-w-[900px] mx-auto px-4 md:px-8">
        <AnimateOnScroll>
          <h2 className="font-maven-pro font-extrabold text-2xl sm:text-3xl md:text-4xl tracking-[-2px] text-[#333] text-center">
            Frequently asked questions
          </h2>
          <p className="font-dm-sans text-[#333]/80 text-base md:text-lg text-center mt-3 max-w-[560px] mx-auto">
            For investors and developers.
          </p>
        </AnimateOnScroll>

        <div className="mt-12 md:mt-16 space-y-14">
          <AnimateOnScroll delay={0.05}>
            <FaqBlock
              title="For VegaFinancial"
              items={faqFinancial}
              openIndex={financialOpen}
              onOpenIndex={setFinancialOpen}
              baseKey="financial"
            />
          </AnimateOnScroll>
          <AnimateOnScroll delay={0.1}>
            <FaqBlock
              title="For VegaDeveloper"
              items={faqDeveloper}
              openIndex={developerOpen}
              onOpenIndex={setDeveloperOpen}
              baseKey="developer"
            />
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
