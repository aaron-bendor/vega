import Link from "next/link";
import { MeshBackground } from "@/components/layout/MeshBackground";
import { LandingNav } from "@/components/layout/LandingNav";
import { PrototypeBanner } from "@/components/layout/PrototypeBanner";

const BANNER =
  "University prototype. Paper trading and synthetic data only. Not investment advice.";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MeshBackground overlay>
      <PrototypeBanner />
      <div className="flex flex-col min-h-screen">
        <header className="border-b border-border/50 bg-background/90 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="font-semibold text-xl tracking-tight">
              Vega
            </Link>
            <LandingNav />
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-border/50 py-4 text-center text-xs text-muted-foreground bg-background/50">
          {BANNER}
        </footer>
      </div>
    </MeshBackground>
  );
}
