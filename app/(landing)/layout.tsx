import { LandingLayoutClient } from "@/components/landing/LandingLayoutClient";
import { ConditionalLandingFooter } from "@/components/landing/ConditionalLandingFooter";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-clip overflow-y-visible w-full min-w-0">
      <LandingLayoutClient>{children}</LandingLayoutClient>
      <div className="mt-auto">
        <ConditionalLandingFooter />
      </div>
    </div>
  );
}
