"use client";

import { AppShell } from "@/components/layout/AppShell";
import { VegaFinancialBottomNav } from "./VegaFinancialBottomNav";

export function VegaFinancialShell({
  children,
}: {
  children: React.ReactNode;
}) {
  // Marketplace page has its own search/filters in MarketplaceFilterBar; no duplicate toolbar

  return (
    <AppShell naturalScroll bottomNav={<VegaFinancialBottomNav />}>
      {children}
    </AppShell>
  );
}
