"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
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

const ICON_SIZE = 18;

const primaryNav = [
  { href: "/vega-financial", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/vega-financial/marketplace", label: "Strategies", icon: Store },
  { href: "/vega-financial/portfolio", label: "Portfolio", icon: Wallet },
  { href: "/vega-financial/watchlist", label: "Watchlist", icon: Star },
  { href: "/vega-financial/activity", label: "Activity", icon: Activity },
];

const secondaryNav = [{ href: "/vega-financial/learn", label: "Learn", icon: BookOpen }];

const bottomNav = [{ href: "/vega-financial/profile", label: "Settings", icon: Settings }];

export function ProfileSidebar({
  naturalScroll,
  inSheet,
}: { naturalScroll?: boolean; inSheet?: boolean } = {}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const collapsible = naturalScroll && !inSheet;
  const isCollapsed = collapsible && collapsed;

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname === href || pathname?.startsWith(href + "/");
  }

  const isProfilePage = pathname === "/vega-financial/profile";

  return (
    <aside
      className={cn(
        "relative flex shrink-0 flex-col border-r border-shell-border bg-shell-sidebar overflow-hidden transition-[width] duration-200 ease-out",
        isCollapsed ? "w-[72px]" : inSheet ? "w-full" : "w-[280px]",
        naturalScroll ? "min-h-[100dvh] h-auto" : "sticky top-0 h-screen"
      )}
      aria-label="App navigation"
    >
      {/* 1. Floating brand card + 2. Unified account row */}
      <div className="shrink-0 px-4 pt-4 pb-2 flex flex-col gap-3">
        <Link
          href="/"
          className={cn(
            "vf-brand-card flex items-center transition-opacity duration-[160ms] hover:opacity-95 focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-shell-sidebar",
            isCollapsed ? "vf-brand-card-collapsed justify-center" : "min-h-[84px] gap-0"
          )}
          aria-label="Vega Financial home"
        >
          {isCollapsed ? (
            <div className="relative z-10 flex flex-col items-center gap-1.5">
              <Image src="/V.png" alt="" width={28} height={28} className="size-7 object-contain" />
              <span className="text-[9px] font-medium text-[#18181f]/70 tracking-wide">Paper</span>
            </div>
          ) : (
            <>
              <div className="relative z-10 flex flex-col justify-center min-h-[48px]">
                <span className="vf-brand-title font-maven-pro">
                  <strong>Vega</strong>
                  <span> financial</span>
                </span>
                <span
                  className="mt-2 inline-flex w-fit items-center rounded-full border border-[#7c5cff]/25 bg-[#7c5cff]/08 px-2 py-0.5 text-[10px] font-medium text-[#6f46f6]"
                  aria-hidden
                >
                  Paper trading
                </span>
              </div>
            </>
          )}
        </Link>

      </div>

      <div className="shrink-0 h-px bg-shell-border/80 mx-4" aria-hidden />

      {/* 3. Primary nav group */}
      <nav className="flex-1 shrink-0 px-4 pt-4 pb-2" data-tour="vf-tabs">
        <ul className={cn("flex flex-col", isCollapsed ? "gap-0.5" : "gap-0.5")}>
          {primaryNav.map(({ href, label, icon: Icon, exact }) => {
            const active = isActive(href, exact);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "flex items-center min-h-[44px] rounded-[22px] transition-colors duration-[160ms] focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-shell-sidebar",
                    isCollapsed ? "justify-center w-10 px-0" : "gap-3 px-4",
                    active ? "vf-nav-pill-active" : "text-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <span
                    className={cn(
                      "flex shrink-0 items-center justify-center rounded-[14px] transition-colors duration-[160ms]",
                      active ? "vf-nav-icon-wrap size-9" : "size-9"
                    )}
                  >
                    <Icon
                      className={cn("shrink-0", active ? "text-[#6f46f6]" : "text-muted-foreground")}
                      style={{ width: ICON_SIZE, height: ICON_SIZE }}
                      aria-hidden
                    />
                  </span>
                  {!isCollapsed && (
                    <span className={cn("text-sm truncate", active ? "font-maven-pro font-semibold" : "font-normal")}>
                      {label}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* 4. Secondary nav group */}
      <div className="shrink-0 px-4 pb-2">
        <ul className="flex flex-col gap-0.5">
          {secondaryNav.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "flex items-center min-h-[44px] rounded-[22px] transition-colors duration-[160ms] focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-shell-sidebar",
                    isCollapsed ? "justify-center w-10 px-0" : "gap-3 px-4",
                    active ? "vf-nav-pill-active" : "text-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <span
                    className={cn(
                      "flex shrink-0 items-center justify-center rounded-[14px] transition-colors duration-[160ms]",
                      active ? "vf-nav-icon-wrap size-9" : "size-9"
                    )}
                  >
                    <Icon
                      className={cn("shrink-0", active ? "text-[#6f46f6]" : "text-muted-foreground")}
                      style={{ width: ICON_SIZE, height: ICON_SIZE }}
                      aria-hidden
                    />
                  </span>
                  {!isCollapsed && (
                    <span className={cn("text-sm truncate", active ? "font-maven-pro font-semibold" : "font-normal")}>
                      {label}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* 5. Bottom-pinned Settings */}
      <div className="mt-auto shrink-0 border-t border-shell-border px-4 py-3">
        <ul className="flex flex-col gap-0.5">
          {bottomNav.map(({ href, label, icon: Icon }) => {
            const active = isProfilePage;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "flex items-center min-h-[44px] rounded-[22px] transition-colors duration-[160ms] focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-shell-sidebar",
                    isCollapsed ? "justify-center w-10 px-0" : "gap-3 px-4",
                    active ? "vf-nav-pill-active" : "text-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <span
                    className={cn(
                      "flex shrink-0 items-center justify-center rounded-[14px] transition-colors duration-[160ms]",
                      active ? "vf-nav-icon-wrap size-9" : "size-9"
                    )}
                  >
                    <Icon
                      className={cn("shrink-0", active ? "text-[#6f46f6]" : "text-muted-foreground")}
                      style={{ width: ICON_SIZE, height: ICON_SIZE }}
                      aria-hidden
                    />
                  </span>
                  {!isCollapsed && (
                    <span className={cn("text-sm truncate", active ? "font-maven-pro font-semibold" : "font-normal")}>
                      {label}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Collapse control – integrated into sidebar edge */}
      {collapsible && (
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className={cn(
            "absolute top-1/2 -translate-y-1/2 right-0 z-10 flex h-14 w-5 items-center justify-center rounded-l-lg border-y border-r border-shell-border",
            "bg-shell-sidebar/95 text-muted-foreground hover:text-foreground hover:bg-white/80 dark:hover:bg-white/10",
            "backdrop-blur-[4px] transition-colors duration-[160ms]",
            "focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-shell-sidebar"
          )}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="size-4 shrink-0" aria-hidden />
          ) : (
            <ChevronLeft className="size-4 shrink-0" aria-hidden />
          )}
        </button>
      )}
    </aside>
  );
}
