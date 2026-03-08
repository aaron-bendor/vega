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

export function UsageExplanationSection() {
  return (
    <section className="relative w-full bg-white py-20 md:py-28 overflow-hidden">
      {/* Purple gradient accent */}
      <div
        className="absolute -top-10 -left-8 w-[868px] h-[872px] rounded-full opacity-40 pointer-events-none"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(83,28,179,1) 0%, rgba(83,28,179,0) 87%)",
        }}
        aria-hidden
      />

      <div className="relative max-w-[1200px] mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Left: phone image */}
          <AnimateOnScroll direction="left" className="flex-shrink-0 w-full lg:w-1/2 flex justify-center">
            <div className="relative w-[280px] sm:w-[340px] md:w-[400px]" style={{ aspectRatio: "524/1063" }}>
              <Image
                src="/investingmadesimplePhone.png?v=2"
                alt="Investing made simple — app interface"
                fill
                className="object-contain drop-shadow-2xl"
                sizes="400px"
              />
            </div>
          </AnimateOnScroll>

          {/* Right: text + features */}
          <div className="flex-1">
            <AnimateOnScroll>
              <p className="font-dm-sans font-medium text-[#333] text-lg md:text-xl leading-[1.6] max-w-[487px]">
                Browse verified trading algorithms built by real developers. See
                live performance, risk metrics, and creator backgrounds, and invest
                with a single tap.
              </p>
            </AnimateOnScroll>

            <AnimateOnScroll delay={0.15}>
              <ul className="mt-8 space-y-3">
                {features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <span className="font-dm-mono text-[#531cb3] text-sm mt-0.5 shrink-0">
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
                className="mt-10 inline-flex items-center justify-center min-h-[44px] h-[50px] px-8 rounded-[30px] bg-[#6b21e8] text-white font-dm-sans font-bold text-lg shadow-[0_0_40px_rgba(107,33,232,0.4)] hover:bg-[#5a1bc4] hover:shadow-[0_0_60px_rgba(107,33,232,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Open demo
              </Link>
            </AnimateOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}
