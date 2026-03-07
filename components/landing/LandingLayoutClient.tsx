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
  const useHeroBanner = pathname === "/" || pathname === "/about-us";

  return (
    <>
      <SmoothScrollToHash />
      <SiteHeader variant={useHeroBanner ? "hero" : "standalone"} />
      <main className="flex shrink-0 flex-col relative z-[1] overflow-visible">{children}</main>
    </>
  );
}
