import { Suspense } from "react";
import { VegaFinancialShell } from "@/components/vega-financial/VegaFinancialShell";
import { VegaFinancialPageSkeleton } from "@/components/vega-financial/VegaFinancialPageSkeleton";
import { TourRunner } from "@/components/tour/TourRunner";

function VegaFinancialFallback() {
  return <VegaFinancialPageSkeleton />;
}

export default function VegaFinancialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TourRunner />
      <Suspense fallback={<VegaFinancialFallback />}>
        <VegaFinancialShell>{children}</VegaFinancialShell>
      </Suspense>
    </>
  );
}
