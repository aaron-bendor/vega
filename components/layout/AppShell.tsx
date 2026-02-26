import Link from "next/link";
import { Nav } from "./Nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="sticky top-0 z-50 bg-white border-b border-[rgba(51,51,51,0.12)] h-14">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <Link href="/" className="font-semibold text-lg tracking-tight text-foreground">
            Vega
          </Link>
          <Nav />
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-[rgba(51,51,51,0.12)] py-3 text-center text-xs text-muted-foreground">
        University prototype. Synthetic data. Paper trading only. Not investment advice.
      </footer>
    </div>
  );
}
