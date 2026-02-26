import Link from "next/link";
import { Button } from "@/components/ui/button";

const BANNER = "University prototype. Paper trading and synthetic data only.";

export function LandingShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex flex-col relative"
      style={{
        backgroundImage: "url(/images/backgrounds/mesh-gradient-1.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-background/70 dark:bg-background/80 backdrop-blur-[2px]" />
      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="border-b border-border/50 bg-background/90 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="font-semibold text-lg tracking-tight">
              Vega
            </Link>
            <nav className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/vega-financial">Vega Financial</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/vega-developer">Vega Developer</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/private">Private</Link>
              </Button>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-border/50 py-3 text-center text-xs text-muted-foreground bg-background/50">
          {BANNER}
        </footer>
      </div>
    </div>
  );
}
