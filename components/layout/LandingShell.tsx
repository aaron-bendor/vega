import Link from "next/link";

const BANNER = "University prototype. Paper trading and synthetic data only.";

export function LandingShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="border-b border-[rgba(51,51,51,0.12)] bg-white sticky top-0 z-50 h-14">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <Link href="/" className="font-semibold text-lg tracking-tight text-foreground">
            Vega
          </Link>
          <nav className="flex items-center gap-2">
            <Link
              href="/vega-financial"
              className="text-sm text-muted-foreground hover:bg-[rgba(51,51,51,0.04)] hover:text-foreground rounded-lg px-3 py-2 transition-colors"
            >
              Vega Financial
            </Link>
            <Link
              href="/vega-developer"
              className="text-sm text-muted-foreground hover:bg-[rgba(51,51,51,0.04)] hover:text-foreground rounded-lg px-3 py-2 transition-colors"
            >
              Vega Developer
            </Link>
            <Link
              href="/private"
              className="text-sm text-muted-foreground hover:bg-[rgba(51,51,51,0.04)] hover:text-foreground rounded-lg px-3 py-2 transition-colors"
            >
              Private
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-[rgba(51,51,51,0.12)] py-3 text-center text-xs text-muted-foreground">
        {BANNER}
      </footer>
    </div>
  );
}
