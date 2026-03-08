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
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur-md shadow-[0_-2px_10px_rgba(0,0,0,0.04)] supports-[backdrop-filter]:bg-background/80 safe-area-pb transition-shadow duration-[var(--motion-duration-normal)]"
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
                "vf-nav-press flex flex-col items-center justify-center gap-0.5 min-w-[64px] min-h-[44px] px-2 py-2 text-xs font-medium rounded-xl transition-[color,transform,background-color] duration-[var(--motion-duration-fast)] ease-[var(--motion-ease)]",
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-current={active ? "page" : undefined}
            >
              <span
                className={cn(
                  "vf-bottom-nav-icon flex flex-col items-center justify-center rounded-lg px-3 py-1.5 transition-[transform,background-color] duration-[var(--motion-duration-fast)] ease-[var(--motion-ease)]",
                  active && "bg-primary/10 -translate-y-[1px]"
                )}
              >
                <Icon className="size-5 shrink-0" aria-hidden />
              </span>
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
