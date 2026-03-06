"use client";

import { useState } from "react";
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

  const toolbar = (
    <>
      <div className="flex items-center gap-3 px-4 lg:px-6 h-14">
        <div className="flex-1 flex items-center gap-2 max-w-md">
          <Search className="size-4 text-muted-foreground shrink-0" aria-hidden />
          <Input
            placeholder="Search algorithms…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 text-sm"
            aria-label="Search algorithms"
          />
        </div>
        <FilterSheet />
      </div>
      <div className="px-4 lg:px-6 pb-2">
        <FilterChips />
      </div>
    </>
  );

  return (
    <AppShell toolbar={toolbar} naturalScroll>
      {children}
    </AppShell>
  );
}
