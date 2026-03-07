"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Search, Bell, HelpCircle, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { clearTourForReplay, TOUR_START_SESSION_KEY, setTourStep } from "@/lib/tour/storage";
import { useRouter } from "next/navigation";
import { PORTFOLIO_STORAGE_KEY } from "@/lib/vega-financial/portfolio-store";

interface InvestorTopBarProps {
  /** Call to open the sidebar (e.g. on mobile). Rendered as menu button when provided. */
  onOpenSidebar?: () => void;
}

export function InvestorTopBar({ onOpenSidebar }: InvestorTopBarProps = {}) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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
    <header
      className="sticky top-0 z-50 shrink-0 h-14 border-b border-border bg-white flex items-center px-4 lg:px-6 gap-4"
      role="banner"
    >
      {onOpenSidebar && (
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden shrink-0 -ml-1 size-9"
          aria-label="Open navigation menu"
          onClick={onOpenSidebar}
        >
          <Menu className="size-5" />
        </Button>
      )}

      <div className="flex-1 max-w-md hidden sm:block min-w-0">
        <div
          className={cn(
            "relative flex items-center rounded-lg border bg-muted/40 transition-colors",
            searchFocused && "bg-background border-border ring-1 ring-ring/20"
          )}
        >
          <Search className="absolute left-3 size-4 text-muted-foreground pointer-events-none" aria-hidden />
          <Input
            type="search"
            placeholder="Search algorithms…"
            className="pl-9 h-9 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            aria-label="Search"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="size-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
          aria-label="Notifications"
        >
          <Bell className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
          aria-label="Replay guided tour"
          title="Replay tour"
          onClick={handleReplayTour}
        >
          <HelpCircle className="size-4" />
        </Button>
        <div className="relative" ref={userMenuRef}>
          <button
            type="button"
            onClick={() => setUserMenuOpen((o) => !o)}
            className="flex items-center gap-2 min-h-[36px] min-w-[36px] rounded-full border border-border bg-muted/50 hover:bg-muted focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring"
            aria-expanded={userMenuOpen}
            aria-haspopup="true"
            aria-label="User menu"
          >
            <span className="text-xs font-medium text-foreground mx-auto">VF</span>
          </button>
          <div
            role="menu"
            className={cn(
              "absolute right-0 top-full mt-1 z-50 min-w-[200px] rounded-lg border border-border bg-popover py-1 shadow-lg",
              "transition-[opacity,visibility] duration-150",
              userMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
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
              Settings
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
  );
}
