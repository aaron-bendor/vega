"use client";

import { useState, useEffect, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { ProfileSidebar } from "@/components/vega-financial/ProfileSidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

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
  /** When true, do not render the app top bar (e.g. when layout already provides SiteHeader). Sidebar uses top-14 to sit under external banner. */
  hideTopBar?: boolean;
  /** When set, replaces the default header. Receives openSidebar for mobile nav. Sidebar uses top-[6.5rem] when header is logo + main bar. */
  customHeader?: (props: { openSidebar: () => void }) => ReactNode;
}

/**
 * App layout for /vega-financial/* and (app) routes (marketplace, portfolio, etc.).
 * Top bar (menu, tour, user) + sidebar (Dashboard, Marketplace, Portfolio) + optional toolbar + main.
 * No marketing header (SiteHeader/PillNav).
 */
export function AppShell({ children, toolbar, naturalScroll, bottomNav, minimalTopBar, hideTopBar, customHeader }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled((window.scrollY ?? 0) > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const useCustomHeader = Boolean(customHeader);
  /** When hideTopBar: no top banner, sidebar sticks to top-0. When custom header: top-[6.5rem]. */
  const stickyTop = useCustomHeader ? "top-[6.5rem]" : hideTopBar ? "top-0" : minimalTopBar ? "top-12" : "top-[5.25rem]";

  return (
    <div className={naturalScroll ? "bg-white" : "min-h-screen flex flex-col bg-white"}>
      {hideTopBar ? (
        <>
          {/* Mobile: fixed menu button to open sidebar (no top bar) */}
          <div className="lg:hidden fixed top-4 left-4 z-40">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-11 rounded-xl bg-shell-sidebar border border-shell-border shadow-sm hover:bg-primary/10"
                  aria-label="Open navigation menu"
                >
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64 max-w-[85vw] rounded-r-xl border-l border-shell-border">
                <ProfileSidebar inSheet />
              </SheetContent>
            </Sheet>
          </div>
        </>
      ) : useCustomHeader && customHeader ? (
        <>
          <div className="sticky top-0 z-50 shrink-0 bg-white">
            {customHeader({ openSidebar: () => setSidebarOpen(true) })}
          </div>
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetContent side="left" className="p-0 w-64 max-w-[85vw]">
              <ProfileSidebar inSheet />
            </SheetContent>
          </Sheet>
        </>
      ) : (
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
                <ProfileSidebar inSheet />
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
        </header>
      )}

      {naturalScroll ? (
        <div className="lg:flex min-w-0">
          <div
            className={cn(
              "hidden lg:block shrink-0 self-start sticky z-10",
              stickyTop
            )}
          >
            <ProfileSidebar naturalScroll />
          </div>
          <div className="flex-1 min-w-0 overflow-x-hidden">
            {toolbar != null ? (
              <div
                className={cn(
                  "sticky z-10 border-b border-border bg-muted/30",
                  useCustomHeader ? "top-[6.5rem]" : hideTopBar ? "top-0" : minimalTopBar ? "top-12" : "top-[5.25rem]"
                )}
              >
                {toolbar}
              </div>
            ) : null}
            <main
              className={cn(
                "min-w-0",
                hideTopBar ? "pt-16 pl-16 lg:pt-4 lg:pl-0" : "pt-4 sm:pt-6",
                bottomNav && "pb-16 lg:pb-0"
              )}
            >
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
