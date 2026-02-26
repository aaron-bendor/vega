import Link from "next/link";
import { Nav } from "./Nav";

const BANNER_TEXT =
  "University prototype. Synthetic data. Paper trading only. Not investment advice.";

export function VegaFinancialShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="border-b border-[rgba(51,51,51,0.12)] bg-white sticky top-0 z-50 h-14">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <Link href="/" className="font-semibold text-lg text-foreground">
            Vega Financial
          </Link>
          <Nav />
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-[rgba(51,51,51,0.12)] py-2 text-center text-xs text-muted-foreground">
        {BANNER_TEXT}
      </footer>
    </div>
  );
}
