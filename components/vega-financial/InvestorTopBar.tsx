"use client";

import { useState } from "react";
import { Search, Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface InvestorTopBarProps {
  /** Call to open the sidebar (e.g. on mobile). Rendered as menu button when provided. */
  onOpenSidebar?: () => void;
}

export function InvestorTopBar({ onOpenSidebar }: InvestorTopBarProps = {}) {
  const [searchFocused, setSearchFocused] = useState(false);

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
      </div>
    </header>
  );
}
