"use client";

import { AppShell } from "@/components/layout/AppShell";
import { VegaFinancialBottomNav } from "./VegaFinancialBottomNav";

export function VegaFinancialShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShell naturalScroll bottomNav={<VegaFinancialBottomNav />}>
      {children}
    </AppShell>
  );
}
