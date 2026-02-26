import { GlobalHeader } from "@/components/layout/GlobalHeader";
import { PrototypeBanner } from "@/components/layout/PrototypeBanner";

const BANNER =
  "University prototype. Paper trading and synthetic data only. Not investment advice.";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PrototypeBanner />
      <GlobalHeader />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-[rgba(51,51,51,0.12)] py-4 text-center text-xs text-muted-foreground">
        {BANNER}
      </footer>
    </div>
  );
}
