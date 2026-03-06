"use client";

import { useState, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ProfileSidebar } from "@/components/vega-financial/ProfileSidebar";
import { Button } from "@/components/ui/button";
import { Menu, HelpCircle } from "lucide-react";
import { clearTourForReplay, TOUR_START_SESSION_KEY, setTourStep } from "@/lib/tour/storage";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: ReactNode;
  /** Optional toolbar (e.g. search + filters) shown below top bar */
  toolbar?: ReactNode;
  /** When true, content scrolls with the page instead of in an internal container.
   *  Use when AppShell is nested under another fixed-position header (e.g. SiteHeader). */
  naturalScroll?: boolean;
}

/**
 * App layout for /vega-financial/* and (app) routes (marketplace, portfolio, etc.).
 * Top bar (menu, tour, user) + sidebar (Dashboard, Marketplace, Portfolio) + optional toolbar + main.
 * No marketing header (SiteHeader/PillNav).
 */
export function AppShell({ children, toolbar, naturalScroll }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled((window.scrollY ?? 0) > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleReplayTour = () => {
    clearTourForReplay();
    if (typeof sessionStorage !== "undefined") {
      sessionStorage.setItem(TOUR_START_SESSION_KEY, "1");
    }
    setTourStep(0);
    router.push("/vega-financial");
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
        <div className="flex items-center gap-3">
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
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReplayTour}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Replay guided tour"
            title="Replay tour"
          >
            <HelpCircle className="size-4" />
          </button>
          <span className="text-xs text-muted-foreground hidden sm:inline">Demo User</span>
          <div
            className="size-8 rounded-full bg-primary/10 flex items-center justify-center"
            aria-hidden
          >
            <span className="text-xs font-medium text-primary">VF</span>
          </div>
        </div>
      </header>

      {naturalScroll ? (
        <div className="lg:flex min-w-0">
          <div className="hidden lg:block shrink-0 self-start sticky top-[5.25rem]">
            <ProfileSidebar naturalScroll />
          </div>
          <div className="flex-1 min-w-0 overflow-x-hidden">
            {toolbar != null ? (
              <div className="sticky top-[5.25rem] z-10 border-b border-primary/10 bg-primary/[0.02] bg-white">
                {toolbar}
              </div>
            ) : null}
            <main className="min-w-0">{children}</main>
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
    </div>
  );
}
