import { VegaFinancialShell } from "@/components/vega-financial/VegaFinancialShell";

export default function VegaFinancialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <VegaFinancialShell>{children}</VegaFinancialShell>;
}
