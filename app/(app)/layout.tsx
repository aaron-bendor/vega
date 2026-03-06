import { AppShell } from "@/components/layout/AppShell";
import { TourRunner } from "@/components/tour/TourRunner";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell>
      <TourRunner />
      {children}
    </AppShell>
  );
}
