"use client";

import Link from "next/link";
import Image from "next/image";

export function HeroVideoSection() {
  return (
    <section
      className="relative w-full h-screen flex flex-col bg-black bg-cover bg-center pt-20"
      style={{ backgroundImage: "url(/backgroundHero.png)" }}
    >
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/5 to-black/25 pointer-events-none"
        aria-hidden
      />

      <div className="relative flex flex-col flex-1 min-h-0">
        {/* SiteHeader (marketing nav) is rendered once by (landing) layout with variant="hero" */}

        <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-12 px-4 md:px-8 max-w-7xl mx-auto w-full py-6 md:py-8 min-h-0">
          {/* Phone — desktop, full device visible (524×1063), no crop */}
          <div className="hidden lg:block flex-shrink-0 animate-fade-in-left flex items-center justify-center">
            <Image
              src="/appHero.png"
              alt="Vega Financial mobile app"
              width={524}
              height={1063}
              className="w-[min(360px,25vw)] h-auto max-h-[85vh] object-contain object-top drop-shadow-2xl"
              sizes="360px"
              priority
            />
          </div>

          {/* Content */}
          <div className="flex flex-col items-center text-center flex-1 max-w-[839px]">
            <h1 className="font-syne text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-white tracking-[-3px] leading-[1.05] animate-fade-up-hero animate-hero-1">
              Algorithmic
              <br />
              trading,
              <br />
              <span className="hero-reveal-delay inline-block">
                finally for
                <br />
                everyone.
              </span>
            </h1>

            <p className="font-dm-sans mt-4 text-white/90 text-base md:text-[19px] font-light leading-[1.7] max-w-[527px] animate-fade-up-hero animate-hero-3">
              Invest in trading algorithms built by verified developers.
              <br className="hidden sm:inline" />
              Access the same tools that move 70% of financial markets.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center animate-fade-up-hero animate-hero-4">
              <Link
                href="/vega-financial"
                className="font-dm-sans inline-flex items-center justify-center h-14 px-8 w-full sm:w-auto min-w-[174px] rounded-[30px] bg-white/20 backdrop-blur-sm border border-white/30 font-black text-white text-[15px] hover:bg-white/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                Start Investing
              </Link>
              <Link
                href="/vega-developer"
                className="font-dm-sans inline-flex items-center justify-center h-14 px-8 w-full sm:w-auto min-w-[206px] rounded-[30px] border border-white/50 font-normal text-white text-[15px] hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                Build Algorithms&nbsp;→
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
