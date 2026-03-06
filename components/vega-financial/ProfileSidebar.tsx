"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useLayoutEffect, useEffect, useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Wallet,
  Store,
  ChevronLeft,
} from "lucide-react";
import { TextLink } from "@/components/ui/TextLink";

const mainNav = [
  { href: "/vega-financial", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/marketplace", label: "Marketplace", icon: Store },
  { href: "/portfolio", label: "Portfolio", icon: Wallet },
];

export function ProfileSidebar({ naturalScroll }: { naturalScroll?: boolean } = {}) {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname === href || pathname?.startsWith(href + "/");
  }

  const activeIndex = mainNav.findIndex(({ href, exact }) => isActive(href, exact));
  const displayIndex = hoveredIndex ?? (activeIndex >= 0 ? activeIndex : null);

  const updateIndicator = useCallback(() => {
    const container = navRef.current;
    if (!container || displayIndex == null || displayIndex < 0 || displayIndex >= itemRefs.current.length) {
      container?.style.removeProperty("--indicator-top");
      container?.style.removeProperty("--indicator-height");
      return;
    }
    const el = itemRefs.current[displayIndex];
    if (!el) return;
    const cr = container.getBoundingClientRect();
    const er = el.getBoundingClientRect();
    container.style.setProperty("--indicator-top", `${er.top - cr.top}px`);
    container.style.setProperty("--indicator-height", `${er.height}px`);
  }, [displayIndex]);

  useLayoutEffect(() => {
    updateIndicator();
  }, [updateIndicator, pathname]);

  useEffect(() => {
    const container = navRef.current;
    if (!container) return;
    const ro = new ResizeObserver(updateIndicator);
    ro.observe(container);
    window.addEventListener("resize", updateIndicator);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateIndicator);
    };
  }, [updateIndicator]);

  return (
    <aside className={cn(
      "w-64 shrink-0 border-r border-[rgba(51,51,51,0.12)] bg-white flex flex-col",
      naturalScroll ? "h-auto" : "h-screen sticky top-0"
    )}>
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

      <nav
        ref={navRef}
        className="relative p-2 flex-1"
        style={{ "--indicator-top": "0px", "--indicator-height": "0px" } as React.CSSProperties}
        data-tour="vf-tabs"
      >
        <span
          aria-hidden
          className="absolute left-0 top-0 w-[3px] rounded-full bg-primary pointer-events-none transition-[top,height] duration-motion-normal ease-motion"
          style={{
            top: "var(--indicator-top)",
            height: "var(--indicator-height)",
          }}
        />
        <p className="px-3 pt-2 pb-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
          Investor
        </p>
        {mainNav.map(({ href, label, icon: Icon, exact }, i) => {
          const active = isActive(href, exact);
          return (
            <div
              key={href}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <Link
                href={href}
                className={cn(
                  "relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-[transform,background-color,color] duration-motion-normal ease-motion active:scale-[0.98]",
                  active
                    ? "bg-[rgba(51,51,51,0.04)] text-foreground"
                    : "text-muted-foreground hover:bg-[rgba(51,51,51,0.04)] hover:text-foreground"
                )}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="size-4 shrink-0" />
                {label}
              </Link>
            </div>
          );
        })}
      </nav>

      <div className="p-2 border-t border-[rgba(51,51,51,0.12)]">
        <TextLink href="/" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="size-4" />
          Back to Vega
        </TextLink>
      </div>
    </aside>
  );
}
