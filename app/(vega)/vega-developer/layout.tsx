import { SiteHeader } from "@/components/layout/SiteHeader";

export default function VegaDeveloperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <SiteHeader variant="standalone" />
      <main className="flex-1">{children}</main>
    </div>
  );
}
