import { Suspense } from "react";
import { VegaFinancialShell } from "@/components/vega-financial/VegaFinancialShell";

function VegaFinancialFallback() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="border-b border-[rgba(51,51,51,0.12)] h-12 flex items-center px-4" />
      <main className="flex-1 flex items-center justify-center p-8">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </main>
    </div>
  );
}

export default function VegaFinancialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<VegaFinancialFallback />}>
      <VegaFinancialShell>{children}</VegaFinancialShell>
    </Suspense>
  );
}
