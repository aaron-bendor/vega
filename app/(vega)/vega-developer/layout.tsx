import Link from "next/link";
import { PrototypeBanner } from "@/components/layout/PrototypeBanner";
import { Button } from "@/components/ui/button";

export default function VegaDeveloperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: "url(/images/backgrounds/mesh-gradient-1.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px]" />
      <div className="relative z-10 flex flex-col min-h-screen">
        <PrototypeBanner />
        <header className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-40">
          <div className="container mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="font-semibold text-lg">
              Vega Developer
            </Link>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">Back to home</Link>
            </Button>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
