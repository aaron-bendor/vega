"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState, useRef, useEffect, useLayoutEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { NavLink } from "@/components/ui/NavLink";
import { NavDropdown, type NavDropdownItem } from "@/components/layout/NavDropdown";
import { getTourCompleted, TOUR_START_SESSION_KEY, setTourStep } from "@/lib/tour/storage";

const SHOW_THRESHOLD_PX = 16;
const HIDE_THRESHOLD_PX = 24;
const TOP_SHOW_THRESHOLD_PX = 8;

type NavEntry =
  | { type: "link"; href: string; label: string; exact?: boolean }
  | { type: "dropdown"; label: string; items: NavDropdownItem[] };

const mainNav: NavEntry[] = [
  { type: "link", href: "/", label: "Home", exact: true },
  { type: "link", href: "/#investing-made-simple", label: "How it Works" },
  { type: "link", href: "/vega-developer", label: "Developer" },
  { type: "link", href: "/#get-started", label: "Get Started" },
];

type PillNavVariant = "hero" | "standalone";

export function PillNav({ variant = "hero" }: { variant?: PillNavVariant }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bannerHidden, setBannerHidden] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleTryItNow = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!getTourCompleted()) {
      if (typeof sessionStorage !== "undefined") {
        sessionStorage.setItem(TOUR_START_SESSION_KEY, "1");
      }
      setTourStep(0);
    }
    router.push("/vega-financial");
  };
  const isStandalone = variant === "standalone";
  const bannerRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const banner = bannerRef.current;
    const spacer = spacerRef.current;
    if (!banner || !spacer) return;

    function setSpacerHeight() {
      const h = Math.max(banner!.offsetHeight || 0, 84);
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
    ? "bg-black/50 backdrop-blur-xl border border-white/15"
    : "bg-black/40 backdrop-blur-xl border border-white/15";

  // Hero variant: match hero section CTA (Start Investing) — glass pill, white text
  const ctaClass = isStandalone
    ? "bg-primary hover:bg-primary/90 text-primary-foreground"
    : "font-dm-sans bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 hover:border-white/40";

  const mobileMenuBg = "bg-black/80 backdrop-blur-xl border border-white/10";

  const isHome = pathname === "/";

  const navItems = mainNav;
  const [hoveredNavIndex, setHoveredNavIndex] = useState<number | null>(null);
  const [focusedNavIndex, setFocusedNavIndex] = useState<number | null>(null);
  const [indicator, setIndicator] = useState({ left: 0, top: 0, width: 0, height: 0 });
  const navContainerRef = useRef<HTMLDivElement>(null);
  const navItemRefs = useRef<(HTMLDivElement | HTMLButtonElement | null)[]>([]);

  const activeNavIndex = navItems.findIndex((entry) => {
    if (entry.type !== "link") return false;
    const { href, exact } = entry;
    return exact === true ? pathname === href : !href.startsWith("/#") && pathname?.startsWith(href);
  });
  const displayIndex = hoveredNavIndex ?? focusedNavIndex ?? (activeNavIndex >= 0 ? activeNavIndex : null);

  const updateIndicator = useCallback(() => {
    const container = navContainerRef.current;
    const items = navItemRefs.current;
    if (!container) return;
    if (
      displayIndex == null ||
      displayIndex < 0 ||
      displayIndex >= navItems.length ||
      !items[displayIndex]
    ) {
      setIndicator((prev) => (prev.width === 0 ? prev : { left: 0, top: 0, width: 0, height: 0 }));
      return;
    }
    const el = items[displayIndex];
    const cr = container.getBoundingClientRect();
    const er = el.getBoundingClientRect();
    const left = er.left - cr.left;
    const top = er.top - cr.top;
    const width = er.width;
    const height = er.height;
    setIndicator((prev) =>
      prev.left === left && prev.width === width && prev.height === height && prev.top === top
        ? prev
        : { left, top, width, height }
    );
  }, [displayIndex, pathname, navItems.length]);

  useLayoutEffect(() => {
    const raf = requestAnimationFrame(() => updateIndicator());
    return () => cancelAnimationFrame(raf);
  }, [updateIndicator]);

  useEffect(() => {
    const container = navContainerRef.current;
    if (!container) return;
    const ro = new ResizeObserver(() => updateIndicator());
    ro.observe(container);
    window.addEventListener("resize", updateIndicator);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateIndicator);
    };
  }, [updateIndicator]);

  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setIsScrolled((window.scrollY ?? 0) > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const pill = (
    <>
      {/* On home: zero-height spacer so hero starts at top and fills viewport (no white band). Else: reserve space for fixed nav. */}
      <div
        ref={spacerRef}
        id="siteBannerSpacer"
        className={cn(
          "shrink-0 w-full",
          isHome ? "h-0 min-h-0" : ""
        )}
        style={
          isHome
            ? { height: 0, minHeight: 0 }
            : {
                height: "var(--banner-height, 5.25rem)",
                minHeight: "var(--banner-height, 5.25rem)",
                ...(pathname?.startsWith("/vega-developer")
                  ? { backgroundColor: "#000" }
                  : {}),
              }
        }
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
              "nav-pill-glass w-full max-w-[1400px] h-14 md:h-16 flex rounded-full shrink-0 transition-[background-color,box-shadow] duration-motion-normal ease-motion",
              pillBg,
              isScrolled && "bg-black/50 shadow-lg shadow-black/20"
            )}
          >
            <nav
              className="flex flex-1 items-center justify-between gap-4 px-4 md:px-8 h-full rounded-full"
              aria-label="Main navigation"
            >
              <Link
                href="/"
                className="flex items-center shrink-0 hover:opacity-90 transition-opacity duration-200 ease-out"
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

              <div
                ref={navContainerRef}
                className="hidden md:flex relative items-center gap-1 lg:gap-2"
              >
                {/* Single shared highlight: glides to hovered/focused link, returns to active on mouseleave/blur. Transform/opacity only; respects prefers-reduced-motion (snaps). */}
                <span
                  aria-hidden
                  className="absolute left-0 top-0 rounded-full bg-white/15 pointer-events-none ease-motion transition-[transform,width,height,opacity] duration-motion-slow motion-reduce:!duration-0"
                  style={{
                    transform: `translate(${indicator.left}px, ${indicator.top}px)`,
                    width: `${indicator.width}px`,
                    height: indicator.height > 0 ? `${indicator.height}px` : 0,
                    opacity: indicator.width > 0 ? 1 : 0,
                  }}
                />
                {navItems.map((entry, i) => (
                  <div
                    key={entry.type === "link" ? entry.href : entry.label}
                    ref={(el) => {
                      navItemRefs.current[i] = el;
                    }}
                    onMouseEnter={() => setHoveredNavIndex(i)}
                    onMouseLeave={() => setHoveredNavIndex(null)}
                    onFocus={(e) => {
                      if (e.target !== e.currentTarget && navContainerRef.current?.contains(e.target as Node)) {
                        setFocusedNavIndex(i);
                      }
                    }}
                    onBlur={(e) => {
                      if (!navContainerRef.current?.contains(e.relatedTarget as Node)) {
                        setFocusedNavIndex(null);
                      }
                    }}
                    className="relative"
                  >
                    {entry.type === "link" ? (
                      <NavLink
                        href={entry.href}
                        variant="light"
                        noUnderline
                        className="text-sm lg:text-base whitespace-nowrap font-normal"
                      >
                        {entry.label}
                      </NavLink>
                    ) : (
                      <NavDropdown
                        label={entry.label}
                        items={entry.items}
                        variant="light"
                        onFocus={() => setFocusedNavIndex(i)}
                        onBlur={() => setFocusedNavIndex(null)}
                      />
                    )}
                  </div>
                ))}
                <Link
                  href="/vega-financial"
                  className={cn(
                    "flex items-center justify-center ml-2 px-5 h-9 md:h-10 font-bold text-sm md:text-base transition-[transform,background-color,border-color] duration-motion-normal ease-motion hover:scale-[1.02] active:scale-[0.98] shrink-0",
                    isStandalone ? "rounded-full" : "rounded-[30px]",
                    ctaClass
                  )}
                  data-tour="try-it-now"
                  onClick={handleTryItNow}
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
                    "flex items-center justify-center min-w-[90px] h-9 font-bold text-sm transition-[transform,background-color,border-color] duration-motion-normal ease-motion hover:scale-[1.02] active:scale-[0.98]",
                    isStandalone ? "rounded-full" : "rounded-[30px]",
                    ctaClass
                  )}
                  data-tour="try-it-now"
                  onClick={handleTryItNow}
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
          className="fixed inset-0 z-40 bg-black/50 md:hidden animate-in fade-in duration-200"
          aria-hidden="true"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div
        className={cn(
          "md:hidden fixed top-20 left-4 right-4 z-50 rounded-2xl shadow-2xl overflow-hidden border transition-[transform,opacity] duration-motion-normal ease-motion",
          mobileMenuBg,
          mobileMenuOpen
            ? "opacity-100 visible translate-y-0 scale-100"
            : "opacity-0 invisible -translate-y-2 scale-[0.98] pointer-events-none"
        )}
      >
        <nav className="py-3" aria-label="Mobile navigation">
          {mainNav.map((entry) =>
            entry.type === "link" ? (
              <Link
                key={entry.href}
                href={entry.href}
                className={cn(
                  "block px-5 py-3.5 font-medium transition-colors duration-200 ease-out active:scale-[0.99]",
                  isStandalone
                    ? "text-foreground hover:bg-muted/50"
                    : "text-white hover:bg-white/10"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {entry.label}
              </Link>
            ) : (
              entry.items.map(({ href, label: itemLabel }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "block px-5 py-2.5 pl-7 text-sm transition-colors duration-200 ease-out active:scale-[0.99]",
                    isStandalone
                      ? "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {itemLabel}
                </Link>
              ))
            )
          )}
          <div className="px-5 pt-2 pb-3">
            <Link
              href="/vega-financial"
              className={cn(
                "flex items-center justify-center h-11 font-bold text-sm transition-[background-color,border-color] duration-motion-normal ease-motion",
                isStandalone
                  ? "rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                  : "rounded-[30px] bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30",
                "hover:scale-[1.02] active:scale-[0.98]"
              )}
              onClick={(e) => {
                setMobileMenuOpen(false);
                handleTryItNow(e);
              }}
              data-tour="try-it-now"
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
      <div className="w-full flex flex-col items-center pt-0 pb-3 shrink-0">
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
