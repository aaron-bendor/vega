"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Wallet, Code2, Lock, Home } from "lucide-react";

const navItems = [
  { href: "/", label: "Home", icon: Home, exact: true },
  { href: "/vega-financial", label: "Vega Financial", icon: Wallet },
  { href: "/vega-developer", label: "Developer", icon: Code2 },
  { href: "/private", label: "Private", icon: Lock },
];

export function LandingNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1">
      {navItems.map(({ href, label, icon: Icon, exact }) => {
        const isActive = exact
          ? pathname === href
          : pathname?.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
              isActive
                ? "text-foreground font-medium"
                : "text-muted-foreground hover:bg-[rgba(51,51,51,0.04)] hover:text-foreground"
            )}
          >
            <Icon className="size-4" />
            <span className="hidden sm:inline">{label}</span>
            {isActive && (
              <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary rounded-full" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
