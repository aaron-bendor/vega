"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./Footer";

/**
 * Renders the main site footer on all landing routes except /about-us,
 * which has its own footer (TeamMissionPrinciplesSection).
 */
export function ConditionalLandingFooter() {
  const pathname = usePathname();
  if (pathname === "/about-us") return null;
  return <Footer />;
}
