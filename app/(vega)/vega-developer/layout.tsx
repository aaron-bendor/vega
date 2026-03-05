import { PillNav } from "@/components/layout/PillNav";

export default function VegaDeveloperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <PillNav variant="standalone" />
      <main className="flex-1">{children}</main>
    </div>
  );
}
