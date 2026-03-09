"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState, useRef, useEffect, useLayoutEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { NavLink } from "@/components/ui/NavLink";
import { NavDropdown, type NavDropdownItem } from "@/components/layout/NavDropdown";
import { DemoCTADropdown } from "@/components/landing/DemoCTADropdown";

/** Lock body scroll when mobile menu is open; restore on close or pathname change. */
function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const scrollY = window.scrollY;
    const prev = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      left: document.body.style.left,
      right: document.body.style.right,
    };
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    return () => {
      document.body.style.overflow = prev.overflow;
      document.body.style.position = prev.position;
      document.body.style.top = prev.top;
      document.body.style.left = prev.left;
      document.body.style.right = prev.right;
      window.scrollTo(0, scrollY);
    };
  }, [locked]);
}

const SHOW_THRESHOLD_PX = 16;
const HIDE_THRESHOLD_PX = 24;
const TOP_SHOW_THRESHOLD_PX = 8;

const LIGHT_SURFACE_LUMINANCE_THRESHOLD = 0.72;
const SURFACE_SAMPLE_INSET_PX = 12;

type RGB = { r: number; g: number; b: number; a: number };

function parseCssRgb(value: string): RGB | null {
  const match = value
    .trim()
    .match(
      /^rgba?\((\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)(?:\s*,\s*(\d*(?:\.\d+)?))?\)$/i
    );

  if (!match) return null;

  const [, r, g, b, a] = match;
  return {
    r: Number(r),
    g: Number(g),
    b: Number(b),
    a: a == null || a === "" ? 1 : Number(a),
  };
}

function getRelativeLuminance({ r, g, b }: Pick<RGB, "r" | "g" | "b">) {
  const toLinear = (channel: number) => {
    const normalized = channel / 255;
    return normalized <= 0.04045
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  };

  const red = toLinear(r);
  const green = toLinear(g);
  const blue = toLinear(b);

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function getEffectiveBackgroundColor(start: HTMLElement | null) {
  let node: HTMLElement | null = start;

  while (node) {
    const { backgroundColor } = window.getComputedStyle(node);
    const parsed = parseCssRgb(backgroundColor);
    if (parsed && parsed.a > 0.01) {
      return parsed;
    }
    node = node.parentElement;
  }

  return (
    parseCssRgb(window.getComputedStyle(document.body).backgroundColor) ??
    parseCssRgb(window.getComputedStyle(document.documentElement).backgroundColor)
  );
}

function isLightSurface(start: HTMLElement | null) {
  const background = getEffectiveBackgroundColor(start);
  if (!background) return false;
  return getRelativeLuminance(background) >= LIGHT_SURFACE_LUMINANCE_THRESHOLD;
}

type NavEntry =
  | { type: "link"; href: string; label: string; exact?: boolean }
  | { type: "dropdown"; label: string; items: NavDropdownItem[] };

const mainNav: NavEntry[] = [
  { type: "link", href: "/", label: "Home", exact: true },
  { type: "link", href: "/about-us", label: "About Us" },
  { type: "link", href: "/algorithms", label: "Algorithms" },
  { type: "link", href: "/vega-developer", label: "Developer" },
  { type: "link", href: "/faq", label: "FAQ" },
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

  useBodyScrollLock(mobileMenuOpen && !isInvestorApp);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileMenuOpen || isInvestorApp) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileMenuOpen, isInvestorApp]);

  // Focus: when mobile menu opens, focus first link; when it closes, return focus to menu button
  const prevMobileMenuOpen = useRef(false);
  useEffect(() => {
    if (isInvestorApp) return;
    if (mobileMenuOpen && !prevMobileMenuOpen.current) {
      mobileMenuFirstLinkRef.current?.focus();
    } else if (!mobileMenuOpen && prevMobileMenuOpen.current) {
      mobileMenuButtonRef.current?.focus();
    }
    prevMobileMenuOpen.current = mobileMenuOpen;
  }, [mobileMenuOpen, isInvestorApp]);

  // When mobile menu is closed, hide from assistive tech and remove from tab order
  useEffect(() => {
    const panel = mobileMenuPanelRef.current;
    if (!panel || isInvestorApp) return;
    if (mobileMenuOpen) {
      panel.removeAttribute("aria-hidden");
      panel.removeAttribute("inert");
    } else {
      panel.setAttribute("aria-hidden", "true");
      panel.setAttribute("inert", "");
    }
  }, [mobileMenuOpen, isInvestorApp]);

  const handleTryItNow = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push("/vega-financial");
  };

  const isStandalone =
    variant === "standalone" || variant === "investor" || variant === "investorApp";
  const isInvestorAppCompact = variant === "investorApp";
  const bannerRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const banner = bannerRef.current;
    const spacer = spacerRef.current;
    if (!banner || !spacer) return;

    const minHeight = isInvestorAppCompact ? 56 : 84;
    const bannerEl = banner;
    const spacerEl = spacer;

    function setSpacerHeight() {
      const h = Math.max(bannerEl.offsetHeight || 0, minHeight);
      spacerEl.style.setProperty("--banner-height", `${h}px`);
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
      const bannerHeight = Math.max(bannerEl.offsetHeight || 0, 72);

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

  const mobileMenuBg = "bg-black/80 backdrop-blur-xl border border-white/10";

  const isHeroPage = pathname === "/" || pathname === "/about-us" || pathname === "/algorithms";

  const [hoveredNavIndex, setHoveredNavIndex] = useState<number | null>(null);
  const [focusedNavIndex, setFocusedNavIndex] = useState<number | null>(null);
  const [indicator, setIndicator] = useState({ left: 0, top: 0, width: 0, height: 0 });
  const navContainerRef = useRef<HTMLDivElement>(null);
  const navItemRefs = useRef<(HTMLDivElement | HTMLButtonElement | null)[]>([]);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuFirstLinkRef = useRef<HTMLAnchorElement>(null);
  const mobileMenuPanelRef = useRef<HTMLDivElement>(null);

  const activeNavIndex = navItems.findIndex((entry: NavEntry) => {
    if (entry.type !== "link") return false;
    const { href, exact } = entry;
    return exact === true ? pathname === href : !href.startsWith("/#") && pathname?.startsWith(href);
  });

  const displayIndex =
    hoveredNavIndex ?? focusedNavIndex ?? (activeNavIndex >= 0 ? activeNavIndex : null);

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
      setIndicator((prev) =>
        prev.width === 0 ? prev : { left: 0, top: 0, width: 0, height: 0 }
      );
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
      prev.left === left &&
      prev.width === width &&
      prev.height === height &&
      prev.top === top
        ? prev
        : { left, top, width, height }
    );
  }, [displayIndex, navItems.length]);

  useLayoutEffect(() => {
    updateIndicator();
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
  const [usePurpleNavText, setUsePurpleNavText] = useState(false);
  const [isDesktopNavVisible, setIsDesktopNavVisible] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktopNavVisible(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (isInvestorAppCompact) return;

    const updateNavContrast = () => {
      const banner = bannerRef.current;
      if (!banner) return;

      const rect = banner.getBoundingClientRect();
      if (rect.bottom <= 0 || rect.top >= window.innerHeight) return;

      const sampleX = window.innerWidth / 2;
      const sampleY = Math.min(
        Math.max(rect.bottom - SURFACE_SAMPLE_INSET_PX, rect.top + SURFACE_SAMPLE_INSET_PX),
        window.innerHeight - 1
      );

      const previousPointerEvents = banner.style.pointerEvents;
      banner.style.pointerEvents = "none";
      const elementBehindBanner = document.elementFromPoint(sampleX, sampleY) as HTMLElement | null;
      banner.style.pointerEvents = previousPointerEvents;

      setUsePurpleNavText(isLightSurface(elementBehindBanner));
    };

    let ticking = false;
    const requestContrastUpdate = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        updateNavContrast();
        ticking = false;
      });
    };

    const resizeObserver = new ResizeObserver(requestContrastUpdate);
    if (bannerRef.current) resizeObserver.observe(bannerRef.current);
    resizeObserver.observe(document.body);

    requestContrastUpdate();
    window.addEventListener("scroll", requestContrastUpdate, { passive: true });
    window.addEventListener("resize", requestContrastUpdate);
    window.addEventListener("load", requestContrastUpdate);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("scroll", requestContrastUpdate);
      window.removeEventListener("resize", requestContrastUpdate);
      window.removeEventListener("load", requestContrastUpdate);
    };
  }, [isInvestorAppCompact, pathname]);

  useEffect(() => {
    const SCROLL_DOWN_THRESHOLD = 24;
    const SCROLL_UP_THRESHOLD = 8;
    const onScroll = () => {
      const y = window.scrollY ?? 0;
      setIsScrolled((prev) => (prev ? y > SCROLL_UP_THRESHOLD : y > SCROLL_DOWN_THRESHOLD));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // On standalone (e.g. FAQ) the pill is dark (bg-black/50); use light text for contrast. Only use purple when pill is light (hero over light content).
  const useBrandNavText = usePurpleNavText && !isStandalone;
  const desktopNavVariant = useBrandNavText ? "brand" : "light";
  const desktopIndicatorClass = useBrandNavText ? "bg-primary/10" : "bg-white/15";
  const mobileTriggerClass = useBrandNavText
    ? "text-primary hover:bg-primary/10"
    : isStandalone
      ? "text-white hover:bg-white/20"
      : "text-white hover:bg-white/20";
  const headerCtaScrolled = isScrolled || useBrandNavText;

  const pill = (
    <>
      <div
        ref={spacerRef}
        id="siteBannerSpacer"
        className={cn("shrink-0 w-full", isHeroPage ? "h-0 min-h-0" : "")}
        style={
          isHeroPage
            ? { height: 0, minHeight: 0 }
            : {
                height: "var(--banner-height, 5.5rem)",
                minHeight: "var(--banner-height, 5.5rem)",
                ...((pathname?.startsWith("/vega-developer") ||
                  pathname?.startsWith("/algorithms"))
                  ? { backgroundColor: "#000" }
                  : {}),
              }
        }
        aria-hidden="true"
      />

      <div
        ref={bannerRef}
        className={cn("site-banner fixed left-0 right-0 top-0", bannerHidden && "is-hidden")}
        style={{
          paddingTop: `calc(${isInvestorAppCompact ? "0.5rem" : "1rem"} + env(safe-area-inset-top, 0px))`,
        }}
        role="banner"
      >
        <div className={cn("flex justify-center", isInvestorAppCompact ? "px-4 sm:px-6" : "px-4")}>
          <div
            className={cn(
              "nav-pill-glass w-full max-w-[1400px] flex shrink-0 transition-[height,background-color,box-shadow,border-color] duration-motion-slow ease-motion",
              isInvestorAppCompact ? "border rounded-2xl md:rounded-[1.25rem]" : "rounded-full border-b border-transparent",
              pillBg,
              isInvestorAppCompact && "h-11 md:h-12",
              !isInvestorAppCompact &&
                isScrolled &&
                !isHeroPage &&
                "h-12 md:h-14 bg-black/60 backdrop-blur-xl shadow-lg shadow-black/25 border-white/10",
              !isInvestorAppCompact &&
                isScrolled &&
                isHeroPage &&
                "h-12 md:h-14 bg-white/30 backdrop-blur-xl shadow-lg shadow-black/10 border-white/50",
              !isInvestorAppCompact && !isScrolled && "h-14 md:h-16"
            )}
          >
            <nav
              className={cn(
                "flex flex-1 items-center justify-between gap-4 h-full w-full",
                isInvestorAppCompact
                  ? "max-w-[1160px] mx-auto px-4 sm:px-6 lg:px-6 rounded-2xl md:rounded-[1.25rem]"
                  : "px-4 md:px-8 rounded-full"
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
                    aria-hidden={!isDesktopNavVisible}
                    onMouseLeave={(e) => {
                      const related = e.relatedTarget;
                      if (!(related instanceof Node) || !navContainerRef.current?.contains(related)) {
                        setHoveredNavIndex(null);
                      }
                    }}
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "absolute left-0 top-0 rounded-full pointer-events-none ease-motion transition-[transform,width,height,opacity] duration-motion-slow motion-reduce:!duration-0",
                        desktopIndicatorClass
                      )}
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
                        onFocus={(e) => {
                          const target = e.target;
                          if (
                            e.target !== e.currentTarget &&
                            target instanceof Node &&
                            navContainerRef.current?.contains(target)
                          ) {
                            setFocusedNavIndex(i);
                          }
                        }}
                        onBlur={(e) => {
                          const related = e.relatedTarget;
                          if (!(related instanceof Node) || !navContainerRef.current?.contains(related)) {
                            setFocusedNavIndex(null);
                          }
                        }}
                        className="relative"
                      >
                        {entry.type === "link" ? (
                          <NavLink
                            href={entry.href}
                            variant={desktopNavVariant}
                            noUnderline
                            className="text-sm lg:text-base whitespace-nowrap font-normal"
                            {...(activeNavIndex === i ? { "aria-current": "page" as const } : {})}
                          >
                            {entry.label}
                          </NavLink>
                        ) : (
                          <NavDropdown
                            label={entry.label}
                            items={entry.items}
                            variant={desktopNavVariant}
                            onFocus={() => setFocusedNavIndex(i)}
                            onBlur={() => setFocusedNavIndex(null)}
                          />
                        )}
                      </div>
                    ))}

                    {!isInvestor && (
                      <DemoCTADropdown
                        onInvest={handleTryItNow}
                        variant="header"
                        scrolled={headerCtaScrolled}
                      />
                    )}
                  </div>

                  <div className="flex md:hidden items-center gap-1.5 min-w-0 shrink-0">
                    <button
                      type="button"
                      id="mobile-nav-menu-button"
                      ref={mobileMenuButtonRef}
                      onClick={() => setMobileMenuOpen((o) => !o)}
                      className={cn(
                        "flex items-center justify-center min-w-[44px] min-h-[44px] rounded-full transition-colors shrink-0",
                        mobileTriggerClass
                      )}
                      aria-expanded={mobileMenuOpen}
                      aria-controls="mobile-nav-menu"
                      aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                    >
                      {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                    </button>

                    {!isInvestor && (
                      <div className="min-w-0 max-w-full shrink">
                        <DemoCTADropdown
                          onInvest={handleTryItNow}
                          variant="header"
                          scrolled={headerCtaScrolled}
                        />
                      </div>
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
          ref={mobileMenuPanelRef}
          id="mobile-nav-menu"
          className={cn(
            "md:hidden fixed left-4 right-4 z-50 rounded-2xl shadow-2xl overflow-hidden border transition-[transform,opacity] duration-motion-normal ease-motion",
            mobileMenuBg,
            mobileMenuOpen
              ? "opacity-100 visible translate-y-0 scale-100"
              : "opacity-0 invisible -translate-y-2 scale-[0.98] pointer-events-none"
          )}
          style={{
            top: "calc(5rem + env(safe-area-inset-top, 0px))",
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation menu"
          aria-hidden={!mobileMenuOpen}
        >
          <nav className="py-3" aria-label="Mobile navigation">
            {navItems.map((entry: NavEntry, idx) =>
              entry.type === "link" ? (
                <Link
                  key={entry.href}
                  ref={idx === 0 ? mobileMenuFirstLinkRef : undefined}
                  href={entry.href}
                  aria-current={
                    entry.exact === true
                      ? pathname === entry.href
                        ? "page"
                        : undefined
                      : !entry.href.startsWith("/#") && pathname?.startsWith(entry.href)
                        ? "page"
                        : undefined
                  }
                  className={cn(
                    "flex items-center min-h-[44px] px-5 py-3.5 font-medium transition-colors duration-200 ease-out active:scale-[0.99] focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    isStandalone ? "text-foreground hover:bg-muted/50" : "text-white hover:bg-white/10"
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
                      "flex items-center min-h-[44px] px-5 py-2.5 pl-7 text-sm transition-colors duration-200 ease-out active:scale-[0.99] focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
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
              <div className="px-5 pt-2 pb-3 w-full [&_button]:w-full [&_button]:min-h-[44px]">
                <DemoCTADropdown
                  onInvest={(e) => {
                    setMobileMenuOpen(false);
                    handleTryItNow(e);
                  }}
                  variant="header"
                  scrolled={isStandalone}
                  className="w-full"
                  onClose={() => setMobileMenuOpen(false)}
                />
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
        <div className="relative w-full flex flex-col items-center">{pill}</div>
      </div>
    );
  }

  return <div className="relative w-full flex flex-col items-center shrink-0">{pill}</div>;
}
