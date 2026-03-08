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
  { type: "link", href: "/about-us", label: "About Us" },
  { type: "link", href: "/vega-developer", label: "Developer" },
  { type: "link", href: "/faq", label: "FAQ" },
  { type: "link", href: "/admin", label: "Admin" },
];

const investorNav: NavEntry[] = [
  { type: "link", href: "/vega-financial", label: "Dashboard", exact: true },
  { type: "link", href: "/vega-financial/marketplace", label: "Explore" },
  { type: "link", href: "/vega-financial/portfolio", label: "Portfolio" },
];

const investorAppNav: NavEntry[] = [
  { type: "link", href: "/vega-financial", label: "Dashboard", exact: true },
];

type PillNavVariant = "hero" | "standalone" | "investor" | "investorApp";

export function PillNav({ variant = "hero" }: { variant?: PillNavVariant }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bannerHidden, setBannerHidden] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isInvestor = variant === "investor";
  const isInvestorApp = variant === "investorApp";
  const navItems = isInvestorApp ? investorAppNav : isInvestor ? investorNav : mainNav;

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
  const isStandalone = variant === "standalone" || variant === "investor" || variant === "investorApp";
  const isInvestorAppCompact = variant === "investorApp";
  const bannerRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const banner = bannerRef.current;
    const spacer = spacerRef.current;
    if (!banner || !spacer) return;

    const minHeight = isInvestorAppCompact ? 56 : 84;
    function setSpacerHeight() {
      const h = Math.max(banner!.offsetHeight || 0, minHeight);
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
  }, [isInvestorAppCompact]);

  const pillBg = isInvestorAppCompact
    ? "bg-shell-banner border border-shell-border shadow-[0_1px_2px_0_rgb(0_0_0/0.04)]"
    : isStandalone
      ? "bg-black/50 backdrop-blur-xl border border-white/15"
      : "bg-white/25 backdrop-blur-xl border border-white/40";

  // Hero variant: match hero section CTA (Start Investing) — glass pill, white text
  const ctaClass = isStandalone
    ? "bg-primary hover:bg-primary/90 text-primary-foreground"
    : "font-dm-sans bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 hover:border-white/40";

  const mobileMenuBg = "bg-black/80 backdrop-blur-xl border border-white/10";

  const isHeroPage = pathname === "/" || pathname === "/about-us";

  const [hoveredNavIndex, setHoveredNavIndex] = useState<number | null>(null);
  const [focusedNavIndex, setFocusedNavIndex] = useState<number | null>(null);
  const [indicator, setIndicator] = useState({ left: 0, top: 0, width: 0, height: 0 });
  const navContainerRef = useRef<HTMLDivElement>(null);
  const navItemRefs = useRef<(HTMLDivElement | HTMLButtonElement | null)[]>([]);

  const activeNavIndex = navItems.findIndex((entry: NavEntry) => {
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
  }, [displayIndex, navItems.length]);

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
      {/* On home and about-us: zero-height spacer so hero starts at top (no white band). Else: reserve space for fixed nav. */}
      <div
        ref={spacerRef}
        id="siteBannerSpacer"
        className={cn(
          "shrink-0 w-full",
          isHeroPage ? "h-0 min-h-0" : ""
        )}
        style={
          isHeroPage
            ? { height: 0, minHeight: 0 }
            : {
                height: "var(--banner-height, 5.5rem)",
                minHeight: "var(--banner-height, 5.5rem)",
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
          "site-banner fixed top-0 left-0 right-0",
          isInvestorAppCompact ? "pt-2" : "pt-4",
          bannerHidden && "is-hidden"
        )}
        role="banner"
      >
        <div className={cn("flex justify-center", isInvestorAppCompact ? "px-4 sm:px-6" : "px-4")}>
          <div
            className={cn(
              "nav-pill-glass w-full max-w-[1400px] flex shrink-0 transition-[height,background-color,box-shadow,border-color] duration-motion-slow ease-motion",
              isInvestorAppCompact ? "border rounded-2xl md:rounded-[1.25rem]" : "rounded-full border-b border-transparent",
              pillBg,
              isInvestorAppCompact && "h-11 md:h-12",
              !isInvestorAppCompact && isScrolled && !isHeroPage && "h-12 md:h-14 bg-black/60 backdrop-blur-xl shadow-lg shadow-black/25 border-white/10",
              !isInvestorAppCompact && isScrolled && isHeroPage && "h-12 md:h-14 bg-white/30 backdrop-blur-xl shadow-lg shadow-black/10 border-white/50",
              !isInvestorAppCompact && !isScrolled && "h-14 md:h-16"
            )}
          >
            <nav
              className={cn(
                "flex flex-1 items-center justify-between gap-4 h-full w-full",
                isInvestorAppCompact ? "max-w-[1160px] mx-auto px-4 sm:px-6 lg:px-6 rounded-2xl md:rounded-[1.25rem]" : "px-4 md:px-8 rounded-full"
              )}
              aria-label="Main navigation"
            >
              <Link
                href="/"
                className={cn(
                  "flex items-center shrink-0 transition-opacity duration-200 ease-out focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md",
                  isInvestorAppCompact ? "focus-visible:ring-offset-shell-banner hover:opacity-90" : ""
                )}
                aria-label="Vega Financial home"
              >
                <Image
                  src="/logo.png"
                  alt="Vega Financial"
                  width={140}
                  height={35}
                  className={cn(
                    "w-auto object-contain",
                    isInvestorAppCompact ? "h-6 md:h-7" : "h-7 md:h-9"
                  )}
                  priority={!isStandalone}
                />
              </Link>

              {isInvestorAppCompact ? (
                <>
                  <span className="hidden sm:inline-flex text-xs text-muted-foreground font-normal ml-1 mr-auto">
                    Investor terminal
                  </span>
                  <Link
                    href="/"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 ease-out focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-shell-banner rounded px-2 py-1.5 -mr-1"
                    aria-label="Back to Vega home"
                  >
                    Back to Vega
                  </Link>
                </>
              ) : !isInvestorApp ? (
                <>
                  <div
                    ref={navContainerRef}
                    className="hidden md:flex relative items-center gap-1 lg:gap-2"
                  >
                    {/* Single shared highlight: glides to hovered/focused link, returns to active on mouseleave/blur. */}
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
                    {navItems.map((entry: NavEntry, i: number) => (
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
                    {!isInvestor && (
                      <Link
                        href="/vega-financial"
                        className={cn(
                          "flex items-center justify-center gap-1.5 ml-2 px-5 h-9 md:h-10 font-bold text-sm md:text-base transition-[transform,background-color,border-color,box-shadow] duration-motion-chip ease-motion hover:scale-[1.02] active:scale-[0.98] shrink-0 focus-visible:outline focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
                          isStandalone ? "rounded-full" : "rounded-[30px]",
                          ctaClass,
                          isScrolled && !isStandalone && "bg-primary text-primary-foreground border-primary hover:bg-primary/90 hover:border-primary/90 shadow-md shadow-primary/20"
                        )}
                        data-tour="try-it-now"
                        onClick={handleTryItNow}
                      >
                        Get Started
                      </Link>
                    )}
                  </div>

                  <div className="flex md:hidden items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setMobileMenuOpen((o) => !o)}
                      className={cn(
                        "flex items-center justify-center min-w-[44px] min-h-[44px] rounded-full transition-colors",
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
                    {!isInvestor && (
                      <Link
                        href="/vega-financial"
                        className={cn(
                          "flex items-center justify-center min-w-[90px] min-h-[44px] px-4 font-bold text-sm transition-[transform,background-color,border-color] duration-motion-chip ease-motion hover:scale-[1.02] active:scale-[0.98] focus-visible:outline focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2",
                          isStandalone ? "rounded-full" : "rounded-[30px]",
                          ctaClass
                        )}
                        data-tour="try-it-now"
                        onClick={handleTryItNow}
                      >
                        Get Started
                      </Link>
                    )}
                  </div>
                </>
              ) : null}
            </nav>
          </div>
        </div>
      </div>

      {!isInvestorApp && mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden animate-in fade-in duration-200"
          aria-hidden="true"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {!isInvestorApp && (
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
          {navItems.map((entry: NavEntry) =>
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
          {!isInvestor && (
            <div className="px-5 pt-2 pb-3">
              <Link
                href="/vega-financial"
                className={cn(
                  "flex items-center justify-center min-h-[44px] w-full font-bold text-sm transition-[background-color,border-color] duration-motion-normal ease-motion",
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
                Get Started
              </Link>
            </div>
          )}
        </nav>
        </div>
      )}
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
