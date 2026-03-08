"use client";

/**
 * Investing made simple — scroll-driven phone carousel.
 * Phone slot uses aspect-[440/901] and object-contain to avoid layout clipping.
 * If slides 2–4 look truncated: the source PNGs (investingmadesimple2–4) are truncated in the
 * design export. Re-export from the design file with the same full canvas and device frame as
 * investingmadesimple1 / investingmadesimple5 (full bottom of phone + bottom nav).
 */

import { useState, useEffect, useRef, useCallback } from "react";

const IMG_V = "?v=2";
const screens = [
  {
    step: null as string | null,
    heading: "Investing\nmade simple",
    sub: "Start investing in minutes. No experience needed.",
    phone: "/investingmadesimple1.png" + IMG_V,
  },
  {
    step: "1",
    heading: "Browse &\nDiscover",
    sub: "Explore trading strategies **verified by our own experienced developers.**\nFilter by risk, return, and timeframe.",
    phone: "/investingmadesimple2.png" + IMG_V,
  },
  {
    step: "2",
    heading: "View\nperformance",
    sub: "See _plain-English descriptions_, past returns, developer background, etc.\nPick a strategy that matches how much risk **you're comfortable with.**",
    phone: "/investingmadesimple3.png" + IMG_V,
  },
  {
    step: "3",
    heading: "Invest any\namount",
    sub: "Start from **as little as £1.**\nNo minimum, no accreditation requirements.",
    phone: "/investingmadesimple4.png" + IMG_V,
  },
  {
    step: "4",
    heading: "Watch\nit grow",
    sub: "The strategy trades for you automatically. Check your returns at any time in the app. Sell whenever you like.\n**No lock-in period, no exit fees.**",
    phone: "/investingmadesimple5.png" + IMG_V,
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
          if (m.index > last) tokens.push({ t: "plain", s: line.slice(last, m.index) });
          if (m[1] !== undefined) tokens.push({ t: "bold", s: m[1] });
          if (m[2] !== undefined) tokens.push({ t: "italic", s: m[2] });
          last = m.index + m[0].length;
        }
        if (last < line.length) tokens.push({ t: "plain", s: line.slice(last) });
        return (
          <span key={li}>
            {tokens.map((tok, ti) =>
              tok.t === "bold" ? (
                <strong key={ti} className="text-white" style={{ fontWeight: 800 }}>{tok.s}</strong>
              ) : tok.t === "italic" ? (
                <em key={ti} style={{ fontStyle: "italic", color: "rgba(237,233,254,0.95)" }}>{tok.s}</em>
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
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);

  const scrollToSlide = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(index, screens.length - 1));
    if (isScrolling.current) return;
    isScrolling.current = true;
    setActive(clamped);
    setTimeout(() => { isScrolling.current = false; }, 800);
  }, []);

  // Scroll-driven: linear progress, rAF for smooth updates
  useEffect(() => {
    const section = containerRef.current;
    if (!section) return;
    let rafId: number | null = null;
    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const rect = section.getBoundingClientRect();
        const sectionHeight = rect.height;
        const viewHeight = typeof window !== "undefined" ? window.innerHeight : 0;
        const scrollable = Math.max(0, sectionHeight - viewHeight);
        if (scrollable <= 0) return;
        const scrolled = -rect.top;
        const progress = Math.max(0, Math.min(1, scrolled / scrollable));
        const stepIndex = Math.min(
          screens.length - 1,
          Math.floor(progress * screens.length)
        );
        setActive(stepIndex);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (isScrolling.current) { e.preventDefault(); return; }
      if (Math.abs(e.deltaY) < 30) return;
      e.preventDefault();
      if (e.deltaY > 0) scrollToSlide(active + 1);
      else scrollToSlide(active - 1);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [active, scrollToSlide]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let startY = 0;
    const onTouchStart = (e: TouchEvent) => { startY = e.touches[0].clientY; };
    const onTouchEnd = (e: TouchEvent) => {
      const dy = startY - e.changedTouches[0].clientY;
      if (Math.abs(dy) < 40) return;
      if (dy > 0) scrollToSlide(active + 1);
      else scrollToSlide(active - 1);
    };
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [active, scrollToSlide]);

  return (
    <section
      id="investing-made-simple"
      ref={containerRef}
      className="relative w-full overflow-visible"
      style={{
        // Taller section: more scroll per step for a smoother, less twitchy feel
        height: `calc(100vh + ${(screens.length - 1) * 70}vh)`,
        fontFamily: "'Maven Pro', sans-serif",
      }}
    >
      <div
        className="sticky top-0 left-0 w-full h-screen overflow-visible"
        style={{ height: "100vh" }}
      >
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .anim-fade-up { animation: fadeUp 0.55s cubic-bezier(0.22,1,0.36,1) both; }
        .dot-ind {
          border: none; cursor: pointer; padding: 0; height: 8px; border-radius: 4px;
          transition: width 0.35s cubic-bezier(0.4,0,0.2,1), background 0.35s ease;
        }
        .dot-ind-btn {
          display: flex; align-items: center; justify-content: center;
          border: none; cursor: pointer; padding: 0; background: transparent;
        }
        @media (max-width: 1023px) {
          .dot-ind-btn { min-width: 44px; min-height: 44px; }
          .dot-ind-btn .dot-ind { height: 10px; border-radius: 5px; min-width: 10px; }
          .phone-slide-img {
            backface-visibility: hidden;
            transform: translateZ(0);
            -webkit-backface-visibility: hidden;
          }
        }
      `}</style>

      {/* Background */}
      <div
        className="absolute inset-0 z-0"
        style={{ backgroundImage: "url(/backgroundInvestingMadesimple.png)", backgroundSize: "cover", backgroundPosition: "center" }}
      />
      <div className="absolute inset-0 z-[1]" style={{ background: "rgba(20,0,60,0.18)" }} />

      <div className="relative z-[2] flex h-full overflow-visible">
        {/* LEFT — phone crossfade. Slot fixed to 440/901 aspect; object-contain prevents layout clipping.
            Note: investingmadesimple2–4 are currently truncated in the source PNGs (they stop mid-content).
            Re-export those three from the design file with the same full canvas and device frame as
            investingmadesimple1 / investingmadesimple5, including the full bottom of the phone and bottom nav. */}
        <div className="hidden lg:flex w-1/2 h-full items-center justify-center flex-shrink-0 overflow-visible">
          <div
            className="absolute w-[280px] h-[280px] rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(210,185,255,0.18) 0%, transparent 65%)" }}
          />
          <div className="relative w-[320px] max-w-[28vw] aspect-[440/901] overflow-visible">
            {screens.map((s, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={s.phone}
                src={s.phone}
                alt=""
                className="absolute inset-0 w-full h-full object-contain transition-opacity duration-700"
                style={{ opacity: active === i ? 1 : 0 }}
              />
            ))}
          </div>
        </div>

        {/* RIGHT — text content */}
        <div className="w-full lg:w-1/2 h-full flex items-start lg:items-center justify-center px-5 sm:px-6 lg:pl-6 lg:pr-14 pt-[14vh] lg:pt-0 lg:pb-0">
          <div className="relative w-full min-w-0" style={{ maxWidth: 440 }}>
            {screens.map((s, i) => (
              <div
                key={i}
                className={active === i ? "anim-fade-up" : ""}
                style={{
                  position: i === 0 ? "relative" : "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  opacity: active === i ? 1 : 0,
                  transition: "opacity 0.6s ease",
                  pointerEvents: active === i ? "auto" : "none",
                  visibility: active === i ? "visible" : "hidden",
                }}
              >
                {s.step && (
                  <div className="-mt-2 mb-1 lg:-mt-4">
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
                  className="text-white font-extrabold leading-[1.08] mb-3 lg:mb-5 whitespace-pre-line tracking-tight"
                  style={{
                    fontSize: i === 0 ? "clamp(2rem, 4vw, 48px)" : "clamp(1.75rem, 3.5vw, 42px)",
                    fontWeight: 900,
                    letterSpacing: -1.5,
                  }}
                >
                  {s.heading}
                </h2>

                <p
                  className="text-[rgba(228,215,255,0.8)] leading-[1.55] lg:leading-[1.75]"
                  style={{ fontSize: 16, fontWeight: 400 }}
                >
                  <RichText text={s.sub} />
                </p>

                {/* Dot indicators — on mobile: step label + 44px touch targets */}
                <div className="mt-6 lg:mt-10">
                  <p className="lg:sr-only text-[rgba(228,215,255,0.9)] text-sm font-medium mb-2" aria-live="polite">
                    Step {active + 1} of {screens.length}
                  </p>
                  <div className="flex gap-1 lg:gap-2 items-center">
                    {screens.map((_, di) => (
                      <button
                        key={di}
                        type="button"
                        className="dot-ind-btn"
                        onClick={() => scrollToSlide(di)}
                        aria-label={`Go to step ${di + 1}`}
                        aria-current={active === di ? "step" : undefined}
                      >
                        <span
                          className="dot-ind"
                          style={{
                            width: active === di ? 28 : 8,
                            background: active === di ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.28)",
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile phone — stable aspect slot, overflow-hidden to avoid layout bugs; GPU layer for smooth crossfade */}
          <div
            className="lg:hidden absolute left-1/2 -translate-x-1/2 pointer-events-none overflow-hidden rounded-[2rem] aspect-[440/901]"
            style={{
              width: "min(260px, 64vw)",
              bottom: "0.5rem",
              contain: "layout paint",
              minHeight: 0,
            }}
          >
            {screens.map((s, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={s.phone}
                src={s.phone}
                alt=""
                className="phone-slide-img absolute inset-0 w-full h-full object-contain transition-opacity duration-500"
                style={{ opacity: active === i ? 1 : 0 }}
                loading="eager"
                decoding="async"
              />
            ))}
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
