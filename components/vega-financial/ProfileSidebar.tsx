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
  { href: "/vega-financial/marketplace", label: "Explore", icon: Store },
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
      {/* 1. Compact brand header – darker background for logo contrast */}
      <div className="shrink-0 border-b border-shell-border bg-primary/[0.12] px-4 py-3">
        <Link
          href="/"
          className={cn(
            "flex items-center transition-opacity duration-[160ms] hover:opacity-90 focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-shell-sidebar rounded-xl",
            isCollapsed ? "justify-center min-h-[40px] w-10" : "min-h-[40px] gap-3"
          )}
          aria-label="Vega Financial home"
        >
          {isCollapsed ? (
            <Image src="/V.png" alt="" width={28} height={28} className="size-7 object-contain" />
          ) : (
            <>
              <Image src="/logo.png" alt="" width={120} height={30} className="h-6 w-auto object-contain" />
              <span className="sr-only font-maven-pro font-semibold text-foreground">Vega Financial</span>
            </>
          )}
        </Link>
      </div>

      {/* 2. Compact profile / account row */}
      <div className="shrink-0 border-b border-shell-border px-4 py-2">
        <Link
          href="/vega-financial/profile"
          className={cn(
            "flex items-center rounded-xl min-h-[44px] transition-colors duration-[160ms] focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-shell-sidebar",
            isCollapsed ? "justify-center px-0 w-10" : "gap-3 px-4",
            isProfilePage
              ? "bg-primary/10 text-primary"
              : "text-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
          )}
          aria-current={isProfilePage ? "page" : undefined}
        >
          <div
            className={cn(
              "flex shrink-0 items-center justify-center rounded-full size-8 text-xs font-medium",
              isProfilePage ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
            )}
            aria-hidden
          >
            VF
          </div>
          {!isCollapsed && (
            <span className={cn("text-sm truncate", isProfilePage ? "font-maven-pro font-semibold" : "font-medium text-foreground")}>
              Account
            </span>
          )}
        </Link>
      </div>

      {/* 3. Primary nav group */}
      <nav className="flex-1 shrink-0 px-4 pt-4 pb-2" data-tour="vf-tabs">
        {!isCollapsed && (
          <p className="mb-2 px-4 text-[11px] font-maven-pro font-medium uppercase tracking-wider text-muted-foreground">
            Main
          </p>
        )}
        <ul className={cn("flex flex-col", isCollapsed ? "gap-0.5" : "gap-0.5")}>
          {primaryNav.map(({ href, label, icon: Icon, exact }) => {
            const active = isActive(href, exact);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "flex items-center min-h-[44px] rounded-xl transition-colors duration-[160ms] focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-shell-sidebar",
                    isCollapsed ? "justify-center w-10 px-0" : "gap-3 px-4",
                    active
                      ? "bg-primary/10 text-primary border-l-4 border-l-primary -ml-px pl-[12px]"
                      : "text-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.06] border-l-4 border-l-transparent"
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon
                    className={cn("shrink-0", active ? "text-primary" : "text-muted-foreground")}
                    style={{ width: ICON_SIZE, height: ICON_SIZE }}
                    aria-hidden
                  />
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
        {!isCollapsed && (
          <p className="mb-2 px-4 text-[11px] font-maven-pro font-medium uppercase tracking-wider text-muted-foreground">
            Resources
          </p>
        )}
        <ul className="flex flex-col gap-0.5">
          {secondaryNav.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "flex items-center min-h-[44px] rounded-xl transition-colors duration-[160ms] focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-shell-sidebar",
                    isCollapsed ? "justify-center w-10 px-0" : "gap-3 px-4",
                    active
                      ? "bg-primary/10 text-primary border-l-4 border-l-primary -ml-px pl-[12px]"
                      : "text-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.06] border-l-4 border-l-transparent"
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon
                    className={cn("shrink-0", active ? "text-primary" : "text-muted-foreground")}
                    style={{ width: ICON_SIZE, height: ICON_SIZE }}
                    aria-hidden
                  />
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
                    "flex items-center min-h-[44px] rounded-xl transition-colors duration-[160ms] focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-shell-sidebar",
                    isCollapsed ? "justify-center w-10 px-0" : "gap-3 px-4",
                    active
                      ? "bg-primary/10 text-primary border-l-4 border-l-primary -ml-px pl-[12px]"
                      : "text-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.06] border-l-4 border-l-transparent"
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon
                    className={cn("shrink-0", active ? "text-primary" : "text-muted-foreground")}
                    style={{ width: ICON_SIZE, height: ICON_SIZE }}
                    aria-hidden
                  />
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
