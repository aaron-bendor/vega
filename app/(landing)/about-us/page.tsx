import Image from "next/image";
import { AboutUsSection } from "@/components/landing/AboutUsSection";

export const metadata = {
  title: "About Us — Vega Financial",
  description:
    "Meet the team behind Vega. We're making sophisticated algorithmic investing accessible to everyone.",
};

export default function AboutUsPage() {
  return (
    <div className="flex flex-col w-full relative bg-white">
      {/* Section 1: Hero — full viewport, then scroll */}
      <section
        className="relative w-full min-h-screen flex flex-col"
        aria-labelledby="about-heading"
      >
        <Image
          src="/backgroundaboutus.png"
          alt=""
          fill
          className="object-cover object-center z-0"
          priority
          sizes="100vw"
        />
        <div className="relative z-10 flex flex-col min-h-screen justify-center pt-[18%] sm:pt-[240px] lg:pt-[281px] px-4 sm:px-6 md:px-10 lg:px-[157px] pb-16 md:pb-24 min-w-0">
          <div className="max-w-[1217px] w-full min-w-0">
            <p className="font-dm-mono font-normal text-white text-base md:text-xl tracking-[2px] leading-tight">
              {"// ABOUT US"}
            </p>
            <h1
              id="about-heading"
              className="font-syne font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[80px] leading-[1.05] tracking-tight mt-4 max-w-[673px]"
            >
              <span className="text-white/60">We&apos;re levelling the </span>
              <span className="text-white">playing field.</span>
            </h1>
            <p className="font-sans font-normal text-white text-xl sm:text-2xl md:text-3xl leading-snug mt-10 md:mt-16 max-w-[1217px]">
              Vega was built by a team of engineering students at Imperial College
              London who got tired of asking the same question: why are only the
              already wealthy getting wealthier?
            </p>
          </div>
        </div>
      </section>

      <AboutUsSection />
    </div>
  );
}
