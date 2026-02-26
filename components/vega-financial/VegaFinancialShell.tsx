"use client";

import { useState } from "react";
import { ProfileSidebar } from "./ProfileSidebar";
import { FilterSheet } from "./FilterSheet";
import { PrototypeBanner } from "@/components/layout/PrototypeBanner";
import { GlobalHeader } from "@/components/layout/GlobalHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function VegaFinancialShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PrototypeBanner />
      <GlobalHeader />

      <div className="flex-1 flex">
        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <ProfileSidebar />
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          {/* Sub-header: search + filter */}
          <div className="border-b border-[rgba(51,51,51,0.12)] bg-white">
            <div className="flex items-center gap-3 px-4 lg:px-6 h-12">
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden shrink-0">
                    <Menu className="size-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-64">
                  <ProfileSidebar />
                </SheetContent>
              </Sheet>
              <div className="flex-1 flex items-center gap-2 max-w-md">
                <Search className="size-4 text-muted-foreground shrink-0" />
                <Input
                  placeholder="Search algorithms..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
              <FilterSheet />
            </div>
          </div>
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </div>
  );
}
