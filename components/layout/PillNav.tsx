"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

const SHOW_THRESHOLD_PX = 16;
const HIDE_THRESHOLD_PX = 24;
const TOP_SHOW_THRESHOLD_PX = 8;

const mainNav: { href: string; label: string; exact?: boolean }[] = [
  { href: "/", label: "Home", exact: true },
  { href: "/#investing-made-simple", label: "How it Works" },
  { href: "/vega-financial", label: "Products" },
  { href: "/vega-developer", label: "Developer" },
  { href: "/#get-started", label: "Get Started" },
];

type PillNavVariant = "hero" | "standalone";

export function PillNav({ variant = "hero" }: { variant?: PillNavVariant }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bannerHidden, setBannerHidden] = useState(false);
  const pathname = usePathname();
  const isStandalone = variant === "standalone";
  const bannerRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const banner = bannerRef.current;
    const spacer = spacerRef.current;
    if (!banner || !spacer) return;

    function setSpacerHeight() {
      const h = Math.max(banner!.offsetHeight || 0, 72);
      spacer!.style.setProperty("--banner-height", `${h}px`);
    }

    setSpacerHeight();

    let lastY = window.scrollY ?? 0;
    let upAccum = 0;
    let downAccum = 0;
    let currentlyHidden = false;
    let ticking = false;

    function show() {
      if (!currentlyHidden) return;
      setBannerHidden(false);
      currentlyHidden = false;
    }

    function hide() {
      if (currentlyHidden) return;
      setBannerHidden(true);
      currentlyHidden = true;
    }

    function handleScroll() {
      const y = window.scrollY ?? 0;
      const dy = y - lastY;
      const bannerHeight = Math.max(banner!.offsetHeight || 0, 72);

      if (y <= TOP_SHOW_THRESHOLD_PX) {
        upAccum = 0;
        downAccum = 0;
        show();
        lastY = y;
        return;
      }

      if (dy > 0) {
        downAccum += dy;
        upAccum = 0;
        if (y > bannerHeight && downAccum >= HIDE_THRESHOLD_PX) {
          hide();
          downAccum = 0;
        }
      } else if (dy < 0) {
        upAccum += -dy;
        downAccum = 0;
        if (upAccum >= SHOW_THRESHOLD_PX) {
          show();
          upAccum = 0;
        }
      }

      lastY = y;
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
    }

    const raf = requestAnimationFrame(setSpacerHeight);
    window.addEventListener("resize", setSpacerHeight);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", setSpacerHeight);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const pillBg = isStandalone
    ? "bg-primary/10 backdrop-blur-md border border-primary/20"
    : "bg-black/40 backdrop-blur-xl border border-white/15";

  const linkClass = isStandalone
    ? "text-foreground/70 hover:text-foreground"
    : "text-white/80 hover:text-white";

  const ctaClass = isStandalone
    ? "bg-primary hover:bg-primary/90 text-primary-foreground"
    : "bg-[#531cb3] hover:bg-[#6b2dd4] text-white";

  const mobileMenuBg = isStandalone
    ? "bg-white border-border"
    : "bg-black/80 backdrop-blur-xl border border-white/10";

  const pill = (
    <>
      <div
        ref={spacerRef}
        id="siteBannerSpacer"
        className="shrink-0"
        style={{ height: "var(--banner-height, 5rem)" }}
        aria-hidden="true"
      />
      <div
        ref={bannerRef}
        className={cn(
          "site-banner fixed top-0 left-0 right-0 pt-4",
          bannerHidden && "is-hidden"
        )}
        role="banner"
      >
        <div className="flex justify-center px-4">
          <div
            className={cn(
              "nav-pill-glass w-full max-w-[1400px] h-14 md:h-16 flex rounded-full shrink-0 transition-all duration-300",
              pillBg
            )}
          >
            <nav
              className="flex flex-1 items-center justify-between gap-4 px-4 md:px-8 h-full rounded-full"
              aria-label="Main navigation"
            >
              <Link
                href="/"
                className="flex items-center shrink-0 hover:opacity-90 transition-opacity"
                aria-label="Vega Financial Home"
              >
                <Image
                  src="/logo.png"
                  alt="Vega Financial"
                  width={140}
                  height={35}
                  className="h-7 md:h-9 w-auto object-contain"
                  priority={!isStandalone}
                />
              </Link>

              <div className="hidden md:flex items-center gap-1 lg:gap-2">
                {mainNav.map(({ href, label, exact }) => {
                  const isActive =
                    exact === true
                      ? pathname === href
                      : !href.startsWith("/#") && pathname?.startsWith(href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={cn(
                        "relative font-normal text-sm lg:text-base px-3 py-1.5 rounded-full transition-all duration-200 whitespace-nowrap",
                        linkClass,
                        isActive &&
                          (isStandalone
                            ? "font-semibold text-foreground bg-primary/5"
                            : "text-white bg-white/10"),
                        "hover:bg-white/10"
                      )}
                    >
                      {label}
                    </Link>
                  );
                })}
                <Link
                  href="/vega-financial"
                  className={cn(
                    "flex items-center justify-center ml-2 px-5 h-9 md:h-10 rounded-full font-bold text-sm md:text-base transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] shrink-0",
                    ctaClass
                  )}
                >
                  Try it now
                </Link>
              </div>

              <div className="flex md:hidden items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen((o) => !o)}
                  className={cn(
                    "flex items-center justify-center size-10 rounded-full transition-colors",
                    isStandalone
                      ? "text-foreground hover:bg-muted"
                      : "text-white hover:bg-white/20"
                  )}
                  aria-expanded={mobileMenuOpen}
                  aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                >
                  {mobileMenuOpen ? (
                    <X className="size-5" />
                  ) : (
                    <Menu className="size-5" />
                  )}
                </button>
                <Link
                  href="/vega-financial"
                  className={cn(
                    "flex items-center justify-center min-w-[90px] h-9 rounded-full font-bold text-sm transition-all hover:scale-[1.03] active:scale-[0.97]",
                    ctaClass
                  )}
                >
                  Try it now
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          aria-hidden="true"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div
        className={cn(
          "md:hidden fixed top-20 left-4 right-4 z-50 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 border",
          mobileMenuBg,
          mobileMenuOpen
            ? "opacity-100 visible translate-y-0"
            : "opacity-0 invisible -translate-y-4 pointer-events-none"
        )}
      >
        <nav className="py-3" aria-label="Mobile navigation">
          {mainNav.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "block px-5 py-3.5 font-medium transition-colors",
                isStandalone
                  ? "text-foreground hover:bg-muted/50"
                  : "text-white hover:bg-white/10"
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
          <div className="px-5 pt-2 pb-3">
            <Link
              href="/vega-financial"
              className="flex items-center justify-center h-11 rounded-full font-bold text-sm bg-[#531cb3] text-white hover:bg-[#6b2dd4] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Try it now
            </Link>
          </div>
        </nav>
      </div>
    </>
  );

  if (isStandalone) {
    return (
      <div className="w-full flex flex-col items-center bg-white pt-0 pb-3 shrink-0">
        <div className="relative w-full flex flex-col items-center">
          {pill}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full flex flex-col items-center shrink-0">
      {pill}
    </div>
  );
}
