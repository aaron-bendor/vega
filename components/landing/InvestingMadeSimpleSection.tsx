"use client";

/**
 * Investing made simple — scroll-driven phone carousel.
 * Required images in public/: investingmadesimple1–5.png (phones), 1.png–4.png (step numbers).
 * Built for section uses builtforPhones.png (ProductFeaturesSection).
 */

import { useState, useEffect, useRef } from "react";

const MAVEN_PRO_URL =
  "https://fonts.googleapis.com/css2?family=Maven+Pro:wght@400;500;600;700;800;900&display=swap";

const screens = [
  {
    step: null as string | null,
    heading: "Investing\nmade simple",
    sub: "Start investing in minutes. No experience needed.",
    phone: "/investingmadesimple1.png",
  },
  {
    step: "1",
    heading: "Browse &\nDiscover",
    sub:
      "Explore trading strategies **verified by our own experienced developers.**\nFilter by risk, return, and timeframe.",
    phone: "/investingmadesimple2.png",
  },
  {
    step: "2",
    heading: "View\nperformance",
    sub:
      "See _plain-English descriptions_, past returns, developer background, etc.\nPick a strategy that matches how much risk **you're comfortable with.**",
    phone: "/investingmadesimple3.png",
  },
  {
    step: "3",
    heading: "Invest any\namount",
    sub: "Start from **as little as £1.**\nNo minimum, no accreditation requirements.",
    phone: "/investingmadesimple4.png",
  },
  {
    step: "4",
    heading: "Watch\nit grow",
    sub:
      "The strategy trades for you automatically. Check your returns at any time in the app. Sell whenever you like.\n**No lock-in period, no exit fees.**",
    phone: "/investingmadesimple5.png",
  },
];

function RichText({ text }: { text: string }) {
  const lines = text.split("\n");
  const re = /\*\*(.+?)\*\*|_(.+?)_/g;
  return (
    <>
      {lines.map((line, li) => {
        const tokens: { t: "plain" | "bold" | "italic"; s: string }[] = [];
        let last = 0;
        let m: RegExpExecArray | null;
        re.lastIndex = 0;
        while ((m = re.exec(line)) !== null) {
          if (m.index > last)
            tokens.push({ t: "plain", s: line.slice(last, m.index) });
          if (m[1] !== undefined) tokens.push({ t: "bold", s: m[1] });
          if (m[2] !== undefined) tokens.push({ t: "italic", s: m[2] });
          last = m.index + m[0].length;
        }
        if (last < line.length) tokens.push({ t: "plain", s: line.slice(last) });
        return (
          <span key={li}>
            {tokens.map((tok, ti) =>
              tok.t === "bold" ? (
                <strong
                  key={ti}
                  className="text-white font-extrabold"
                  style={{ fontWeight: 800 }}
                >
                  {tok.s}
                </strong>
              ) : tok.t === "italic" ? (
                <em
                  key={ti}
                  className="italic"
                  style={{ color: "rgba(237,233,254,0.95)" }}
                >
                  {tok.s}
                </em>
              ) : (
                <span key={ti}>{tok.s}</span>
              )
            )}
            {li < lines.length - 1 && <br />}
          </span>
        );
      })}
    </>
  );
}

export function InvestingMadeSimpleSection() {
  const [active, setActive] = useState(0);
  const rightRef = useRef<HTMLDivElement>(null);
  const secRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    if (typeof document !== "undefined" && !document.querySelector(`link[href="${MAVEN_PRO_URL}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = MAVEN_PRO_URL;
      document.head.appendChild(link);
    }
  }, []);

  useEffect(() => {
    const container = rightRef.current;
    if (!container) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = e.target.getAttribute("data-index");
            if (idx != null) setActive(Number(idx));
          }
        });
      },
      { root: container, threshold: 0.55 }
    );
    secRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const scrollToSlide = (index: number) => {
    secRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const bgImage = "/backgroundInvestingMadesimple.png";

  return (
    <section
      id="investing-made-simple"
      className="relative w-full flex overflow-hidden"
      style={{
        minHeight: "100vh",
        height: "100vh",
        fontFamily: "'Maven Pro', sans-serif",
      }}
    >
      <style>{`
        .snap-r::-webkit-scrollbar { display: none; }
        .snap-r { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .anim-fade-up {
          animation: fadeUp 0.55s cubic-bezier(0.22,1,0.36,1) both;
        }
        .dot-indicator {
          border: none;
          cursor: pointer;
          padding: 0;
          height: 8px;
          border-radius: 4px;
          transition: width 0.35s cubic-bezier(0.4,0,0.2,1), background 0.35s ease;
        }
      `}</style>

      {/* Full-bleed background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{ background: "rgba(20,0,60,0.18)" }}
      />

      {/* LEFT — sticky phone crossfade; container sized so no phone is cropped */}
      <div
        className="hidden lg:flex sticky top-0 z-[2] w-1/2 flex-shrink-0 items-center justify-center overflow-visible"
        style={{ height: "100vh" }}
      >
        <div
          className="absolute w-[280px] h-[280px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(210,185,255,0.18) 0%, transparent 65%)",
          }}
        />
        <div
          className="relative flex items-center justify-center"
          style={{
            width: "min(320px, 28vw)",
            height: "min(680px, 85vh)",
            minHeight: 520,
          }}
        >
          {screens.map((s, i) => (
            <div
              key={i}
              className="absolute inset-0 flex items-center justify-center transition-opacity duration-[800ms]"
              style={{
                opacity: active === i ? 1 : 0,
                transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)",
                pointerEvents: active === i ? "auto" : "none",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.phone}
                alt=""
                className="max-w-full max-h-full w-auto h-auto object-contain"
                style={{
                  filter: "drop-shadow(0 36px 80px rgba(50,0,140,0.6))",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT — snap scroll */}
      <div
        ref={rightRef}
        className="snap-r relative z-[2] w-full lg:w-1/2 overflow-y-auto"
        style={{
          height: "100vh",
          scrollSnapType: "y mandatory",
          scrollBehavior: "smooth",
        }}
      >
        {screens.map((s, i) => (
          <section
            key={i}
            data-index={i}
            ref={(el) => { secRefs.current[i] = el; }}
            className="flex flex-col justify-center min-h-screen py-12 lg:py-0 px-6 lg:pl-6 lg:pr-14"
            style={{
              scrollSnapAlign: "start",
              scrollSnapStop: "always",
            }}
          >
            <div
              className={active === i ? "anim-fade-up" : ""}
              style={{ maxWidth: 430 }}
            >
              {/* Step number: image 1.png–4.png */}
              {s.step && (
                <div className="flex justify-start mb-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/${s.step}.png`}
                    alt=""
                    aria-hidden
                    className="h-16 md:h-20 w-auto object-contain"
                  />
                </div>
              )}

              <h2
                className="text-white font-extrabold leading-[1.08] mb-5 whitespace-pre-line tracking-tight"
                style={{
                  fontSize: i === 0 ? "clamp(2rem, 4vw, 48px)" : "clamp(1.75rem, 3.5vw, 42px)",
                  fontWeight: 900,
                  letterSpacing: -1.5,
                  fontFamily: "'Maven Pro', sans-serif",
                }}
              >
                {s.heading}
              </h2>

              <p
                className="text-[rgba(228,215,255,0.8)] font-normal leading-[1.75]"
                style={{
                  fontSize: 16,
                  fontWeight: 400,
                  fontFamily: "'Maven Pro', sans-serif",
                }}
              >
                <RichText text={s.sub} />
              </p>

              {/* Dot indicators — all slides */}
              <div className="flex gap-2 items-center mt-8">
                {screens.map((_, di) => (
                  <button
                    key={di}
                    type="button"
                    className="dot-indicator"
                    onClick={() => scrollToSlide(di)}
                    aria-label={`Go to step ${di + 1}`}
                    style={{
                      width: active === di ? 28 : 8,
                      background:
                        active === di
                          ? "rgba(255,255,255,0.95)"
                          : "rgba(255,255,255,0.28)",
                    }}
                  />
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Mobile: show single phone under content (no crop) */}
      <div className="lg:hidden absolute bottom-8 left-0 right-0 z-[2] flex justify-center items-center pointer-events-none">
        <div className="relative flex items-center justify-center w-[200px] min-h-[320px] max-h-[380px]">
          {screens.map((s, i) => (
            <div
              key={i}
              className="absolute inset-0 flex items-center justify-center transition-opacity duration-[800ms]"
              style={{
                opacity: active === i ? 1 : 0,
                pointerEvents: "none",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.phone}
                alt=""
                className="max-w-full max-h-full w-auto h-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
