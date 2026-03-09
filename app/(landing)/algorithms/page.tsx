import {
  AlgorithmsHeroSection,
  TradingAlgorithmDefinitionSection,
  TradingAlgorithmExampleSection,
  AlgorithmImportanceSection,
  InvestmentCallToActionSection,
} from "@/components/landing/algorithms";

export const metadata = {
  title: "Algorithms — Vega Financial",
  description:
    "What are trading algorithms? Rules-based, automated strategies that trade markets 24/7. Learn why they outperform human traders.",
};

export default function AlgorithmsPage() {
  return (
    <div className="flex flex-col w-full min-w-0 overflow-x-clip relative bg-white">
      <AlgorithmsHeroSection />
      <TradingAlgorithmDefinitionSection />
      <TradingAlgorithmExampleSection />
      <AlgorithmImportanceSection />
      <InvestmentCallToActionSection />
    </div>
  );
}
