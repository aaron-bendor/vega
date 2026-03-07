"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Store, Wallet, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/vega-financial", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/vega-financial/marketplace", label: "Explore", icon: Store },
  { href: "/vega-financial/portfolio", label: "Portfolio", icon: Wallet },
  { href: "/vega-financial/profile", label: "Settings", icon: User },
];

export function VegaFinancialBottomNav() {
  const pathname = usePathname();

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname === href || pathname?.startsWith(href + "/");
  }

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 safe-area-pb"
      aria-label="App navigation"
    >
      <div className="flex items-center justify-around min-h-14">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 min-w-[64px] min-h-[44px] px-2 py-2 text-xs font-medium transition-colors",
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="size-5 shrink-0" aria-hidden />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
