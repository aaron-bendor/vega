import { GlobalHeader } from "@/components/layout/GlobalHeader";
import { PrototypeBanner } from "@/components/layout/PrototypeBanner";

export default function VegaDeveloperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PrototypeBanner />
      <GlobalHeader />
      <main className="flex-1">{children}</main>
    </div>
  );
}
