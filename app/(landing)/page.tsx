import { HeroVideoSection } from "@/components/landing/HeroVideoSection";
import { VideoBlockSection } from "@/components/landing/VideoBlockSection";
import { StatisticsSection } from "@/components/landing/StatisticsSection";
import { InvestingMadeSimpleSection } from "@/components/landing/InvestingMadeSimpleSection";
import { ProductFeaturesSection } from "@/components/landing/ProductFeaturesSection";
import { DeveloperPlatformSection } from "@/components/landing/DeveloperPlatformSection";
import { InvestmentStepsSection } from "@/components/landing/InvestmentStepsSection";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <HeroVideoSection />
      <VideoBlockSection />
      <StatisticsSection />
      <InvestingMadeSimpleSection />
      <ProductFeaturesSection />
      <DeveloperPlatformSection />
      <InvestmentStepsSection />
    </div>
  );
}
