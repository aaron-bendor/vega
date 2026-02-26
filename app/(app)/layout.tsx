import { GlobalHeader } from "@/components/layout/GlobalHeader";
import { PrototypeBanner } from "@/components/layout/PrototypeBanner";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PrototypeBanner />
      <GlobalHeader />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-[rgba(51,51,51,0.12)] py-3 text-center text-xs text-muted-foreground">
        University prototype. Synthetic data. Paper trading only. Not investment advice.
      </footer>
    </div>
  );
}
