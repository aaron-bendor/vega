import { VegaDeveloperHero } from "@/components/vega-developer/VegaDeveloperHero";
import { VegaDeveloperBuildSection } from "@/components/vega-developer/VegaDeveloperBuildSection";
import { VegaDeveloperIDESection } from "@/components/vega-developer/VegaDeveloperIDESection";
import { Footer } from "@/components/landing/Footer";

export default function VegaDeveloperPage() {
  return (
    <div
      className="relative flex flex-col min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url(/backgroundDeveloper.png)" }}
    >
      <div className="absolute inset-0 bg-black/30 pointer-events-none" aria-hidden />
      <div className="relative flex flex-col flex-1 z-[1]">
        <VegaDeveloperHero />
        <VegaDeveloperBuildSection />
        <VegaDeveloperIDESection />
        <Footer />
      </div>
    </div>
  );
}
