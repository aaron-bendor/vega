"use client";

import { useState, type ReactNode } from "react";
import { ProfileSidebar } from "@/components/vega-financial/ProfileSidebar";
import { Button } from "@/components/ui/button";
import { TextLink } from "@/components/ui/TextLink";
import { Menu, ChevronLeft } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface AppShellProps {
  children: ReactNode;
  /** Optional toolbar (e.g. search + filters) shown below top bar */
  toolbar?: ReactNode;
}

/**
 * App layout for /vega-financial/* and (app) routes (marketplace, portfolio, etc.).
 * Top bar (product name, Back to Vega, user) + sidebar (Dashboard, Marketplace, Portfolio) + optional toolbar + main.
 * No marketing header (SiteHeader/PillNav).
 */
export function AppShell({ children, toolbar }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header
        className="shrink-0 border-b border-[rgba(51,51,51,0.12)] bg-white h-12 flex items-center justify-between px-4 lg:px-6"
        role="banner"
      >
        <div className="flex items-center gap-3">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden shrink-0 -ml-2"
                aria-label="Open navigation menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <ProfileSidebar />
            </SheetContent>
          </Sheet>
          <span className="font-semibold text-foreground text-sm lg:text-base">Vega Financial</span>
          <TextLink
            href="/"
            className="text-muted-foreground hover:text-foreground text-xs lg:text-sm flex items-center gap-1 rounded focus-visible:outline-none"
            aria-label="Back to Vega home"
          >
            <ChevronLeft className="size-3.5 shrink-0" aria-hidden />
            Back to Vega
          </TextLink>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground hidden sm:inline">Demo User</span>
          <div
            className="size-8 rounded-full bg-primary/10 flex items-center justify-center"
            aria-hidden
          >
            <span className="text-xs font-medium text-primary">VF</span>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        <aside className="hidden lg:block shrink-0" aria-label="App navigation">
          <ProfileSidebar />
        </aside>

        <div className="flex-1 flex flex-col min-w-0">
          {toolbar != null ? (
            <div className="shrink-0 border-b border-primary/10 bg-primary/[0.02]">{toolbar}</div>
          ) : null}
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </div>
  );
}
