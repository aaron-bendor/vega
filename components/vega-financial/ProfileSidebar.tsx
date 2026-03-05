"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Wallet,
  Store,
  ChevronLeft,
} from "lucide-react";

const mainNav = [
  { href: "/vega-financial", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/marketplace", label: "Marketplace", icon: Store },
  { href: "/portfolio", label: "Portfolio", icon: Wallet },
];

export function ProfileSidebar() {
  const pathname = usePathname();

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname === href || pathname?.startsWith(href + "/");
  }

  return (
    <aside className="w-64 shrink-0 border-r border-[rgba(51,51,51,0.12)] bg-white flex flex-col h-screen sticky top-0">
      <div className="p-4 border-b border-[rgba(51,51,51,0.12)]">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-medium text-primary">VF</span>
          </div>
          <div>
            <p className="font-medium text-sm text-foreground">Demo User</p>
          </div>
        </div>
      </div>

      <nav className="p-2 flex-1">
        <p className="px-3 pt-2 pb-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
          Investor
        </p>
        {mainNav.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-[rgba(51,51,51,0.04)] font-medium text-foreground"
                  : "text-muted-foreground hover:bg-[rgba(51,51,51,0.04)] hover:text-foreground"
              )}
            >
              {active && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-primary" />
              )}
              <Icon className="size-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-2 border-t border-[rgba(51,51,51,0.12)]">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-[rgba(51,51,51,0.04)] hover:text-foreground transition-colors"
        >
          <ChevronLeft className="size-4" />
          Back to Vega
        </Link>
      </div>
    </aside>
  );
}
