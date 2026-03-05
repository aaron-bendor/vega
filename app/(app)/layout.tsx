import { PillNav } from "@/components/layout/PillNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PillNav variant="standalone" />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-[rgba(51,51,51,0.12)] py-3" />
    </div>
  );
}
