"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Wallet, LayoutDashboard } from "lucide-react";

const navItems = [
  { href: "/vega-financial", label: "Dashboard", icon: LayoutDashboard },
  { href: "/vega-financial", label: "Portfolio", icon: Wallet },
];

export function ProfileSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 border-r bg-card/50 flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-medium">VF</span>
          </div>
          <div>
            <p className="font-medium text-sm">Demo User</p>
            <p className="text-xs text-muted-foreground">Paper trading</p>
          </div>
        </div>
      </div>
      <nav className="p-2 flex-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href + label}
            href={href}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
              pathname === href || pathname?.startsWith(href + "/")
                ? "bg-muted font-medium"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            )}
          >
            <Icon className="size-4" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
