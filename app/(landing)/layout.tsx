import { LandingLayoutClient } from "@/components/landing/LandingLayoutClient";
import { Footer } from "@/components/landing/Footer";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white overflow-visible">
      <LandingLayoutClient>{children}</LandingLayoutClient>
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}
