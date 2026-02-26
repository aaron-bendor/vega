import { AppShell } from "@/components/layout/AppShell";
import { PrototypeBanner } from "@/components/layout/PrototypeBanner";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PrototypeBanner />
      <AppShell>{children}</AppShell>
    </>
  );
}
