"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SmoothScrollToHash } from "@/components/landing/SmoothScrollToHash";

export function LandingLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <>
      <SmoothScrollToHash />
      <SiteHeader variant={isHome ? "hero" : "standalone"} />
      <main className="flex-1 flex flex-col relative z-[1]">{children}</main>
    </>
  );
}
