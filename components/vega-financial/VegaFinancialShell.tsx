"use client";

import { AppShell } from "@/components/layout/AppShell";
import { VegaFinancialBottomNav } from "./VegaFinancialBottomNav";
import { MobileExperienceNotice } from "./MobileExperienceNotice";

export function VegaFinancialShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShell naturalScroll hideTopBar bottomNav={<VegaFinancialBottomNav />}>
      <MobileExperienceNotice />
      {children}
    </AppShell>
  );
}
