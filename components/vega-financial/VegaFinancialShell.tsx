"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { FilterSheet } from "./FilterSheet";
import { FilterChips } from "./FilterChips";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function VegaFinancialShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [search, setSearch] = useState("");
  const pathname = usePathname();
  // Only show global search/toolbar on dashboard; marketplace has its own filter bar
  const showToolbar = pathname === "/vega-financial";

  const toolbar = showToolbar ? (
    <>
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 px-4 lg:px-6 min-h-14 py-2 min-w-0">
        <div className="flex-1 min-w-0 flex items-center gap-2 w-full sm:w-auto sm:max-w-md">
          <Search className="size-4 text-muted-foreground shrink-0" aria-hidden />
          <Input
            placeholder="Search algorithms…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 sm:h-8 text-sm min-w-0 w-full"
            aria-label="Search algorithms"
          />
        </div>
        <div className="shrink-0">
          <FilterSheet />
        </div>
      </div>
      <div className="px-4 lg:px-6 pb-2 min-w-0">
        <FilterChips />
      </div>
    </>
  ) : null;

  return (
    <AppShell toolbar={toolbar} naturalScroll>
      {children}
    </AppShell>
  );
}
