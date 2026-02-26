"use client";

import { useState } from "react";
import Link from "next/link";
import { ProfileSidebar } from "./ProfileSidebar";
import { FilterSheet } from "./FilterSheet";
import { PrototypeBanner } from "@/components/layout/PrototypeBanner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, Search, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function VegaFinancialShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
      className="min-h-screen flex"
      style={{
        backgroundImage: "url(/images/backgrounds/mesh-gradient-1.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-background/75 dark:bg-background/85 backdrop-blur-[2px]" />
      <div className="relative z-10 flex w-full">
        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <ProfileSidebar />
        </div>
        {/* Mobile sidebar */}

        <div className="flex-1 flex flex-col min-w-0">
          <PrototypeBanner />
          <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur-sm">
            <div className="flex items-center gap-4 px-4 py-3">
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="size-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-64">
                  <ProfileSidebar />
                </SheetContent>
              </Sheet>
              <Link href="/vega-financial" className="font-semibold text-lg shrink-0">
                Vega Financial
              </Link>
              <div className="flex-1 flex items-center gap-2 max-w-md">
                <Search className="size-4 text-muted-foreground shrink-0" />
                <Input
                  placeholder="Search algorithms..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-muted/50 border-0 focus-visible:ring-0"
                />
              </div>
              <FilterSheet />
            </div>
          </header>
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </div>
  );
}
