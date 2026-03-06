"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimateOnScroll } from "./AnimateOnScroll";

const PHONE_WIDTH = 440;
const PHONE_HEIGHT = 820;
// Reserve space for full screenshot (440×820) so nothing is cropped
const PHONE_ASPECT = PHONE_WIDTH / PHONE_HEIGHT;

const steps = [
  {
    num: "1.",
    title: "Browse & Discover",
    phone: "/investingmadesimple2.png",
    description: (
      <>
        Explore trading strategies verified by our own experienced developers.
        <br />
        Filter by risk, return, and timeframe.
      </>
    ),
  },
  {
    num: "2.",
    title: "View performance",
    phone: "/investingmadesimple3.png",
    description: (
      <>
        See plain-English descriptions, past returns, developer background, etc.
        <br />
        Pick a strategy that matches how much risk you&apos;re comfortable with.
      </>
    ),
  },
  {
    num: "3.",
    title: "Invest any amount",
    phone: "/investingmadesimple3.png",
    description: (
      <>
        Start from as little as £1.
        <br />
        No minimum, no accreditation requirements.
      </>
    ),
  },
  {
    num: "4.",
    title: "Watch it grow",
    phone: "/investingmadesimple2.png",
    description: (
      <>
        The strategy trades for you automatically. Check your returns at any time in the app.
        <br />
        Sell whenever you like.
        <br />
        No lock-in period, no exit fees.
      </>
    ),
  },
];

export function InvestingMadeSimpleSection() {
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    stepRefs.current.forEach((ref, i) => {
      if (!ref) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveStep(i);
        },
        { threshold: 0.4, rootMargin: "-15% 0px -15% 0px" }
      );
      obs.observe(ref);
      observers.push(obs);
    });
    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  return (
    <section
      id="investing-made-simple"
      className="relative w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url(/backgroundInvestingMadesimple.png)" }}
    >
      <div className="absolute inset-0 bg-black/10 pointer-events-none" aria-hidden />

      <div className="relative max-w-[1200px] mx-auto px-4 md:px-8">
        <AnimateOnScroll>
          <div className="pt-16 md:pt-24 pb-8 md:pb-12 text-center">
            <h2 className="font-maven-pro font-extrabold text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-[-2px] leading-tight">
              Investing made simple
            </h2>
            <p className="font-dm-sans font-light text-white/80 text-base md:text-lg leading-relaxed mt-4 max-w-[600px] mx-auto">
              Start investing in minutes. No experience needed.
            </p>
          </div>
        </AnimateOnScroll>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 pb-20 md:pb-28">
          {/* Desktop: one image in flow (active); others absolute + hidden. Column height = image height, no crop. */}
          <div className="hidden lg:block lg:w-[45%] flex justify-center overflow-visible">
            <div className="sticky top-24 w-[280px] xl:w-[320px] overflow-visible">
              {/* Aspect-ratio box reserves full height for 440×820 so the whole screenshot is visible (no crop). */}
              <div
                className="relative w-full overflow-visible"
                style={{ aspectRatio: PHONE_ASPECT }}
              >
                {steps.map((step, i) => (
                  <div
                    key={step.num}
                    className="absolute inset-0 transition-all duration-700 ease-out overflow-visible"
                    style={{
                      opacity: activeStep === i ? 1 : 0,
                      pointerEvents: activeStep === i ? "auto" : "none",
                      transform:
                        activeStep === i
                          ? "translateY(0) scale(1)"
                          : "translateY(12px) scale(0.97)",
                    }}
                  >
                    {/* Plain img + object-contain: full screenshot visible (status bar → bottom nav), like reference. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={step.phone}
                      alt={step.title}
                      width={PHONE_WIDTH}
                      height={PHONE_HEIGHT}
                      className="w-full h-full object-contain object-top drop-shadow-2xl block"
                      style={{ objectFit: "contain", objectPosition: "top" }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-8 lg:space-y-0">
            {steps.map((step, i) => (
              <div
                key={step.num}
                ref={(el) => { stepRefs.current[i] = el; }}
                className="lg:min-h-[70vh] flex flex-col items-center lg:justify-center"
              >
                <AnimateOnScroll delay={0.05}>
                  <div className="w-full lg-card p-6 md:p-10 transition-all duration-300 group">
                    <div className="lg-content">
                      <span className="font-maven-pro font-extrabold text-5xl md:text-7xl text-white leading-none block mb-4">
                        {step.num}
                      </span>
                      <h3 className="font-maven-pro font-bold text-white text-xl md:text-2xl tracking-tight">
                        {step.title}
                      </h3>
                      <p className="font-dm-sans font-light text-white/90 text-base md:text-lg leading-relaxed mt-3 max-w-[450px]">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </AnimateOnScroll>

                {/* Mobile: full phone */}
                <div className="lg:hidden mt-6 flex justify-center w-full">
                  <Image
                    src={step.phone}
                    alt={step.title}
                    width={PHONE_WIDTH}
                    height={PHONE_HEIGHT}
                    className="w-[220px] sm:w-[260px] h-auto object-contain object-top drop-shadow-xl"
                    sizes="260px"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
