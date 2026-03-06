"use client";

import { useState, useEffect, useRef, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ProfileSidebar } from "@/components/vega-financial/ProfileSidebar";
import { Button } from "@/components/ui/button";
import { Menu, HelpCircle } from "lucide-react";
import { clearTourForReplay, TOUR_START_SESSION_KEY, setTourStep } from "@/lib/tour/storage";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { PORTFOLIO_STORAGE_KEY } from "@/lib/vega-financial/portfolio-store";

interface AppShellProps {
  children: ReactNode;
  /** Optional toolbar (e.g. search + filters) shown below top bar */
  toolbar?: ReactNode;
  /** When true, content scrolls with the page; top bar is the only header (no external banner). */
  naturalScroll?: boolean;
  /** Optional bottom nav (e.g. for mobile). When set, main content gets bottom padding on small screens. */
  bottomNav?: ReactNode;
  /** When true, show minimal app top bar with brand + Back to website + user menu (single nav system). */
  minimalTopBar?: boolean;
}

/**
 * App layout for /vega-financial/* and (app) routes (marketplace, portfolio, etc.).
 * Top bar (menu, tour, user) + sidebar (Dashboard, Marketplace, Portfolio) + optional toolbar + main.
 * No marketing header (SiteHeader/PillNav).
 */
export function AppShell({ children, toolbar, naturalScroll, bottomNav, minimalTopBar }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled((window.scrollY ?? 0) > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!userMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [userMenuOpen]);

  const handleReplayTour = () => {
    clearTourForReplay();
    if (typeof sessionStorage !== "undefined") {
      sessionStorage.setItem(TOUR_START_SESSION_KEY, "1");
    }
    setTourStep(0);
    router.push("/vega-financial");
  };

  const handleResetDemoPortfolio = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(PORTFOLIO_STORAGE_KEY);
    }
    setUserMenuOpen(false);
    router.push("/vega-financial");
    router.refresh();
  };

  return (
    <div className={naturalScroll ? "bg-white" : "min-h-screen flex flex-col bg-white"}>
      <header
        className={cn(
          "sticky top-0 z-50 shrink-0 border-b bg-white flex items-center justify-between px-4 lg:px-6 transition-[height,background-color,box-shadow,border-color] duration-200 ease-out",
          scrolled
            ? "h-11 border-[rgba(51,51,51,0.12)] bg-white/90 backdrop-blur-md shadow-[0_1px_0_0_rgba(51,51,51,0.06)]"
            : "h-12 border-[rgba(51,51,51,0.12)]"
        )}
        role="banner"
      >
        <div className="flex items-center gap-3 min-w-0">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden shrink-0 -ml-2 min-w-[44px] min-h-[44px]"
                aria-label="Open navigation menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64 max-w-[85vw]">
              <ProfileSidebar />
            </SheetContent>
          </Sheet>
          {minimalTopBar && (
            <Link
              href="/"
              className="flex items-center shrink-0 gap-2 rounded-md focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Vega Financial home"
            >
              <Image
                src="/logo.png"
                alt=""
                width={120}
                height={30}
                className="h-6 w-auto object-contain sm:h-7"
              />
              <span className="sr-only">Vega Financial</span>
            </Link>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleReplayTour}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Replay guided tour"
            title="Replay tour"
          >
            <HelpCircle className="size-4" />
          </button>
          <div className="relative" ref={userMenuRef}>
            <button
              type="button"
              onClick={() => setUserMenuOpen((o) => !o)}
              className="flex items-center gap-2 min-h-[44px] rounded-full focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring"
              aria-expanded={userMenuOpen}
              aria-haspopup="true"
              aria-label="User menu"
            >
              <div
                className="size-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0"
                aria-hidden
              >
                <span className="text-xs font-medium text-primary">VF</span>
              </div>
            </button>
            <div
              role="menu"
              className={cn(
                "absolute right-0 top-full mt-1 z-50 min-w-[180px] rounded-lg border border-border bg-popover py-1 shadow-lg",
                "transition-[opacity,visibility] duration-150",
                userMenuOpen
                  ? "opacity-100 visible"
                  : "opacity-0 invisible pointer-events-none"
              )}
            >
              <Link
                href="/vega-financial/profile"
                role="menuitem"
                className="block px-4 py-2.5 text-sm text-popover-foreground hover:bg-muted"
                onClick={() => setUserMenuOpen(false)}
              >
                Profile
              </Link>
              <Link
                href="/vega-financial/profile#preferences"
                role="menuitem"
                className="block px-4 py-2.5 text-sm text-popover-foreground hover:bg-muted"
                onClick={() => setUserMenuOpen(false)}
              >
                Preferences
              </Link>
              <button
                type="button"
                role="menuitem"
                className="w-full text-left px-4 py-2.5 text-sm text-popover-foreground hover:bg-muted"
                onClick={handleResetDemoPortfolio}
              >
                Reset demo portfolio
              </button>
            </div>
          </div>
        </div>
      </header>

      {naturalScroll ? (
        <div className="lg:flex min-w-0">
          <div
            className={cn(
              "hidden lg:block shrink-0 self-start sticky",
              minimalTopBar ? "top-12" : "top-[5.25rem]"
            )}
          >
            <ProfileSidebar naturalScroll />
          </div>
          <div className="flex-1 min-w-0 overflow-x-hidden">
            {toolbar != null ? (
              <div
                className={cn(
                  "sticky z-10 border-b border-primary/10 bg-primary/[0.02] bg-white",
                  minimalTopBar ? "top-12" : "top-[5.25rem]"
                )}
              >
                {toolbar}
              </div>
            ) : null}
            <main className={cn("min-w-0 pt-4 sm:pt-6", bottomNav && "pb-16 lg:pb-0")}>
              {children}
            </main>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex">
          <aside className="hidden lg:block shrink-0" aria-label="App navigation">
            <ProfileSidebar />
          </aside>
          <div className="flex-1 flex flex-col min-w-0 min-h-0">
            {toolbar != null ? (
              <div className="shrink-0 border-b border-primary/10 bg-primary/[0.02]">{toolbar}</div>
            ) : null}
            <main className="flex-1 min-h-0 overflow-auto">{children}</main>
          </div>
        </div>
      )}
      {bottomNav}
    </div>
  );
}
