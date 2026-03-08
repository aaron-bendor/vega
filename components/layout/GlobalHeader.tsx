"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Wallet, Code2, Lock, Home } from "lucide-react";

const navItems = [
  { href: "/", label: "Home", icon: Home, exact: true },
  { href: "/vega-financial", label: "Vega Financial", icon: Wallet },
  { href: "/vega-developer", label: "Developer", icon: Code2 },
  { href: "/private", label: "Private", icon: Lock },
];

interface GlobalHeaderProps {
  title?: string;
}

export function GlobalHeader({ title }: GlobalHeaderProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[rgba(51,51,51,0.12)] h-14">
      <div className="h-full flex items-center justify-between px-4 lg:px-6 max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-semibold text-lg tracking-tight text-foreground shrink-0">
            {title ?? "Vega"}
          </Link>
          <nav className="hidden md:flex items-center">
            {navItems.map(({ href, label, icon: Icon, exact }) => {
              const isActive = mounted && (exact ? pathname === href : pathname?.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "relative flex items-center gap-1.5 px-3 py-2 text-sm transition-colors rounded-lg",
                    isActive
                      ? "text-foreground font-medium"
                      : "text-muted-foreground hover:bg-[rgba(51,51,51,0.04)] hover:text-foreground"
                  )}
                >
                  <Icon className="size-3.5" />
                  {label}
                  <span
                    className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary rounded-full"
                    aria-hidden
                    style={{ opacity: isActive ? 1 : 0 }}
                  />
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Mobile nav */}
        <nav className="flex md:hidden items-center gap-1">
          {navItems.map(({ href, icon: Icon, exact, label }) => {
            const isActive = mounted && (exact ? pathname === href : pathname?.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                aria-label={label}
                className={cn(
                  "relative flex items-center justify-center size-9 rounded-lg transition-colors",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:bg-[rgba(51,51,51,0.04)] hover:text-foreground"
                )}
              >
                <Icon className="size-4" />
                <span
                  className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"
                  aria-hidden
                  style={{ opacity: isActive ? 1 : 0 }}
                />
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
