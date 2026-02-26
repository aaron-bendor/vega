"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
          <Button key={href} variant="ghost" size="sm" asChild>
            <Link
              href={href}
              className={cn(
                "flex items-center gap-2",
                isActive
                  ? "bg-muted/80 font-medium"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="size-4" />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}
