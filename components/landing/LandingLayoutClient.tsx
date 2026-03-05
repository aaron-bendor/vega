"use client";

import { usePathname } from "next/navigation";
import { PillNav } from "@/components/layout/PillNav";

export function LandingLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <>
      {!isHome && <PillNav variant="standalone" />}
      <main className="flex-1 flex flex-col">{children}</main>
    </>
  );
}
