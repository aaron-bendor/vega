import Link from "next/link";
import { Nav } from "./Nav";

const BANNER_TEXT =
  "University prototype. Synthetic data. Paper trading only. Not investment advice.";

export function VegaFinancialShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-semibold text-lg">
            Vega Financial
          </Link>
          <Nav />
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t py-2 text-center text-xs text-muted-foreground">
        {BANNER_TEXT}
      </footer>
    </div>
  );
}
