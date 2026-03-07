"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRef, useLayoutEffect, useEffect, useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Wallet,
  Store,
  Star,
  ChevronLeft,
  ChevronRight,
  Activity,
  BookOpen,
  Settings,
} from "lucide-react";

const mainNav = [
  { href: "/vega-financial", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/vega-financial/marketplace", label: "Explore", icon: Store },
  { href: "/vega-financial/portfolio", label: "Portfolio", icon: Wallet },
  { href: "/vega-financial/watchlist", label: "Watchlist", icon: Star },
  { href: "/vega-financial/activity", label: "Activity", icon: Activity },
  { href: "/vega-financial/learn", label: "Learn", icon: BookOpen },
  { href: "/vega-financial/profile", label: "Settings", icon: Settings },
];

export function ProfileSidebar({
  naturalScroll,
  inSheet,
}: { naturalScroll?: boolean; inSheet?: boolean } = {}) {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const collapsible = naturalScroll && !inSheet;

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname === href || pathname?.startsWith(href + "/");
  }

  const activeIndex = mainNav.findIndex(({ href, exact }) => isActive(href, exact));
  const displayIndex = hoveredIndex ?? (activeIndex >= 0 ? activeIndex : null);

  const updateIndicator = useCallback(() => {
    const container = navRef.current;
    if (!container || displayIndex == null || displayIndex < 0 || displayIndex >= itemRefs.current.length) {
      container?.style.removeProperty("--indicator-top");
      container?.style.removeProperty("--indicator-height");
      return;
    }
    const el = itemRefs.current[displayIndex];
    if (!el) return;
    const cr = container.getBoundingClientRect();
    const er = el.getBoundingClientRect();
    container.style.setProperty("--indicator-top", `${er.top - cr.top}px`);
    container.style.setProperty("--indicator-height", `${er.height}px`);
  }, [displayIndex]);

  useLayoutEffect(() => {
    updateIndicator();
  }, [updateIndicator, pathname, collapsed]);

  useEffect(() => {
    const container = navRef.current;
    if (!container) return;
    const ro = new ResizeObserver(updateIndicator);
    ro.observe(container);
    window.addEventListener("resize", updateIndicator);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateIndicator);
    };
  }, [updateIndicator]);

  const isProfilePage = pathname === "/vega-financial/profile";
  const isCollapsed = collapsible && collapsed;

  return (
    <aside
      className={cn(
        "relative shrink-0 border-r border-shell-border bg-shell-sidebar flex flex-col transition-[width] duration-200 ease-out rounded-r-xl overflow-hidden",
        isCollapsed ? "w-[72px]" : "w-64",
        naturalScroll ? "h-auto min-h-[100dvh]" : "h-screen sticky top-0"
      )}
      aria-label="App navigation"
    >
      {/* Logo – always visible at top, darker background */}
      <div className="shrink-0 p-3 border-b border-primary/20 bg-primary/25">
        <Link
          href="/"
          className={cn(
            "flex items-center transition-opacity hover:opacity-90 focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-primary/20 rounded-lg",
            isCollapsed ? "justify-center p-2 min-h-[44px]" : "gap-3 rounded-lg min-h-[44px]"
          )}
          aria-label="Vega Financial home"
        >
          <Image
            src="/logo.png"
            alt=""
            width={140}
            height={35}
            className={cn("object-contain", isCollapsed ? "h-6 w-auto" : "h-7 w-auto")}
          />
        </Link>
      </div>

      {/* Profile + nav – collapsed shows icon rail, expanded shows full */}
      {collapsible && isCollapsed ? (
        <>
          {/* Collapsed: compact profile (avatar only) */}
          <div className="shrink-0 p-2 border-b border-shell-border/80">
            <Link
              href="/vega-financial/profile"
              className="flex justify-center rounded-lg p-2 min-h-[44px] hover:bg-primary/10 transition-colors focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-shell-sidebar rounded-lg"
              aria-current={isProfilePage ? "page" : undefined}
              aria-label="Profile"
            >
              <div
                className={cn(
                  "size-9 rounded-full flex items-center justify-center shrink-0",
                  isProfilePage ? "bg-primary/20 ring-2 ring-primary/40" : "bg-primary/15"
                )}
                aria-hidden
              >
                <span className="text-xs font-medium text-primary">VF</span>
              </div>
            </Link>
          </div>
          {/* Collapsed: nav icons only */}
          <nav
            ref={navRef}
            className="relative p-2 pt-3 flex-1"
            style={{ "--indicator-top": "0px", "--indicator-height": "0px" } as React.CSSProperties}
            data-tour="vf-tabs"
          >
            <span
              aria-hidden
              className="absolute left-0 top-0 w-[3px] rounded-full bg-primary pointer-events-none transition-[top,height] duration-motion-normal ease-motion"
              style={{
                top: "var(--indicator-top)",
                height: "var(--indicator-height)",
              }}
            />
            <div className="flex flex-col gap-y-0.5">
              {mainNav.map(({ href, label, icon: Icon, exact }, i) => {
                const active =
                  href.startsWith("/vega-financial/profile")
                    ? pathname === "/vega-financial/profile"
                    : isActive(href, exact);
                return (
                  <div
                    key={href}
                    ref={(el) => {
                      itemRefs.current[i] = el;
                    }}
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <Link
                      href={href}
                      className={cn(
                        "relative flex items-center justify-center rounded-lg min-h-[44px] transition-colors focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-shell-sidebar",
                        active
                          ? "bg-primary/15 text-foreground"
                          : "text-muted-foreground hover:bg-primary/10 hover:text-foreground"
                      )}
                      aria-current={active ? "page" : undefined}
                      aria-label={label}
                    >
                      <Icon className="size-5 shrink-0" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </nav>
        </>
      ) : (
        <>
          <div className="shrink-0 p-2.5 pt-2 border-b border-shell-border/80">
            <Link
              href="/vega-financial/profile"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 min-h-[44px] text-sm font-medium text-foreground hover:bg-primary/10 transition-colors duration-200 ease-out focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-shell-sidebar"
              aria-current={isProfilePage ? "page" : undefined}
            >
              <div
                className="size-9 rounded-full bg-primary/15 flex items-center justify-center shrink-0"
                aria-hidden
              >
                <span className="text-xs font-medium text-primary">VF</span>
              </div>
              <span>Profile</span>
            </Link>
          </div>
          <nav
            ref={navRef}
            className="relative p-2 pt-3 flex-1"
            style={{ "--indicator-top": "0px", "--indicator-height": "0px" } as React.CSSProperties}
            data-tour="vf-tabs"
          >
            <span
              aria-hidden
              className="absolute left-0 top-0 w-[3px] rounded-full bg-primary pointer-events-none transition-[top,height] duration-motion-normal ease-motion"
              style={{
                top: "var(--indicator-top)",
                height: "var(--indicator-height)",
              }}
            />
            <p className="px-3 pt-2 pb-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Investor
            </p>
            <div className="flex flex-col gap-y-0.5">
              {mainNav.map(({ href, label, icon: Icon, exact }, i) => {
                const active =
                  href.startsWith("/vega-financial/profile")
                    ? pathname === "/vega-financial/profile"
                    : isActive(href, exact);
                return (
                  <div
                    key={href}
                    ref={(el) => {
                      itemRefs.current[i] = el;
                    }}
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <Link
                      href={href}
                      className={cn(
                        "relative flex items-center gap-2 rounded-lg px-3 py-2.5 min-h-[44px] text-sm transition-[transform,background-color,color] duration-motion-normal ease-motion active:scale-[0.98] focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-shell-sidebar",
                        active
                          ? "bg-primary/15 text-foreground font-medium"
                          : "text-muted-foreground hover:bg-primary/10 hover:text-foreground"
                      )}
                      aria-current={active ? "page" : undefined}
                    >
                      <Icon className="size-4 shrink-0" />
                      {label}
                    </Link>
                  </div>
                );
              })}
            </div>
          </nav>
        </>
      )}

      {/* Edge collapse handle – outer right boundary, only when collapsible */}
      {collapsible && (
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className={cn(
            "absolute top-1/2 -translate-y-1/2 right-0 z-10 flex items-center justify-center w-5 h-12 rounded-l-md border-y border-r border-shell-border bg-primary/15 shadow-[0_1px_2px_0_rgb(0_0_0/0.04)]",
            "text-muted-foreground hover:text-foreground hover:bg-primary/20 hover:border-primary/30",
            "transition-[color,background-color,border-color] duration-200 ease-out",
            "focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-shell-sidebar"
          )}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="size-3.5 shrink-0" aria-hidden />
          ) : (
            <ChevronLeft className="size-3.5 shrink-0" aria-hidden />
          )}
        </button>
      )}
    </aside>
  );
}