"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { DemoChromeIndicator } from "@/components/vega-financial/DemoChromeIndicator";
import {
  LayoutDashboard,
  Wallet,
  Store,
  Star,
  ChevronLeft,
  ChevronRight,
  Activity,
  BookOpen,
  User,
} from "lucide-react";
import { ROUTES, PROFILE_NAV_LABEL } from "@/lib/routes";

const ICON_SIZE = 18;

const primaryNav = [
  { href: ROUTES.vegaFinancial.root, label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: ROUTES.vegaFinancial.marketplace, label: "Strategies", icon: Store },
  { href: ROUTES.vegaFinancial.portfolio, label: "Portfolio", icon: Wallet },
  { href: ROUTES.vegaFinancial.watchlist, label: "Watchlist", icon: Star },
  { href: ROUTES.vegaFinancial.activity, label: "Activity", icon: Activity },
];

const secondaryNav = [{ href: ROUTES.vegaFinancial.learn, label: "Learn", icon: BookOpen }];

const bottomNav = [{ href: ROUTES.vegaFinancial.profile, label: PROFILE_NAV_LABEL, icon: User }];

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

  const isProfilePage = pathname === ROUTES.vegaFinancial.profile;

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
            "vf-brand-card flex items-center justify-center transition-opacity duration-[160ms] hover:opacity-95 focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-shell-sidebar",
            isCollapsed ? "vf-brand-card-collapsed" : "min-h-[84px] gap-0"
          )}
          aria-label="Vega Financial home"
        >
          <Image
            src={isCollapsed ? "/V.png" : "/logofordemo.png"}
            alt="Vega Financial"
            width={isCollapsed ? 40 : 120}
            height={isCollapsed ? 40 : 30}
            className={cn(
              "object-contain",
              isCollapsed ? "size-10" : "h-9 w-auto"
            )}
            priority
          />
        </Link>

      </div>

      {!isCollapsed && (
        <>
          <div className="shrink-0 px-4 pb-2">
            <DemoChromeIndicator className="py-2 px-3 rounded-lg bg-muted/50 border border-border/80" />
          </div>
          <div className="shrink-0 h-px bg-shell-border/80 mx-4" aria-hidden />
        </>
      )}

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

      {/* 5. Bottom-pinned Profile */}
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
