"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect, useCallback, useId } from "react";
import { cn } from "@/lib/utils";

export type DemoCTADropdownVariant = "hero" | "header";

type DemoCTADropdownProps = {
  /** Called when user chooses Invest: run tour init then navigate. */
  onInvest: (e: React.MouseEvent) => void;
  variant?: DemoCTADropdownVariant;
  /** Optional: when true (header variant), trigger uses primary colour (scrolled state). */
  scrolled?: boolean;
  /** Optional class for the wrapper (e.g. for mobile full width). */
  className?: string;
  /** Optional: close callback when dropdown closes (e.g. close mobile menu). */
  onClose?: () => void;
};

/**
 * Accessible "Open Demo" dropdown with Invest (investor flow + tour) and Develop (developer demo).
 * Click to open; Escape / outside click to close; arrow keys move between options.
 */
export function DemoCTADropdown({
  onInvest,
  variant = "hero",
  scrolled = false,
  className,
  onClose,
}: DemoCTADropdownProps) {
  const [open, setOpen] = useState(false);
  const [panelRect, setPanelRect] = useState({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const investRef = useRef<HTMLButtonElement>(null);
  const developRef = useRef<HTMLAnchorElement>(null);
  const id = useId();
  const panelId = `demo-cta-panel-${id.replace(/:/g, "")}`;
  const triggerId = `demo-cta-trigger-${id.replace(/:/g, "")}`;

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const tr = trigger.getBoundingClientRect();
    setPanelRect({
      top: tr.bottom + 4,
      left: tr.left,
      width: tr.width,
    });
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    onClose?.();
    triggerRef.current?.focus();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    updatePosition();
    const ro = new ResizeObserver(updatePosition);
    if (triggerRef.current) ro.observe(triggerRef.current);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, updatePosition]);

  useEffect(() => {
    if (open) investRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        panelRef.current?.contains(target) ||
        triggerRef.current?.contains(target)
      )
        return;
      close();
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, close]);

  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen((o) => !o);
      if (!open) requestAnimationFrame(updatePosition);
    }
    if (e.key === "Escape") {
      close();
    }
  };

  const handlePanelKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      close();
      return;
    }
    const items: (HTMLButtonElement | HTMLAnchorElement)[] = [
      investRef.current,
      developRef.current,
    ].filter((el): el is HTMLButtonElement | HTMLAnchorElement => el != null);
    const current = document.activeElement;
    const idx = items.indexOf(current as HTMLButtonElement | HTMLAnchorElement);
    if (e.key === "ArrowDown" && idx < items.length - 1) {
      e.preventDefault();
      (items[idx + 1] as HTMLElement).focus();
    }
    if (e.key === "ArrowUp" && idx > 0) {
      e.preventDefault();
      (items[idx - 1] as HTMLElement).focus();
    }
  };

  const handleInvestClick = (e: React.MouseEvent) => {
    close();
    onInvest(e);
  };

  const isHero = variant === "hero";

  const triggerClass = isHero
    ? "font-dm-sans inline-flex items-center justify-center gap-1.5 h-14 px-8 w-full sm:w-auto min-w-[174px] rounded-[30px] bg-white/20 backdrop-blur-sm border border-white/30 font-black text-white hover:bg-white/30 hover:scale-[1.02] active:scale-[0.98] transition-[transform,background-color,border-color] duration-motion-normal ease-motion"
    : cn(
        "font-dm-sans flex items-center justify-center gap-1.5 ml-2 px-5 h-9 md:h-10 font-bold text-sm md:text-base transition-[transform,background-color,border-color,box-shadow] duration-motion-chip ease-motion hover:scale-[1.02] active:scale-[0.98] shrink-0 focus-visible:outline focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-[30px]",
        scrolled
          ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90 hover:border-primary/90 shadow-md shadow-primary/20"
          : "bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 hover:border-white/40"
      );

  const panelClass =
    "fixed z-[1001] rounded-2xl shadow-xl overflow-hidden py-1 bg-white/20 backdrop-blur-md border border-white/30";

  const itemClass =
    "flex items-center w-full text-left px-4 py-2.5 text-sm font-semibold text-white outline-none rounded-lg mx-1 hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-inset";

  return (
    <div className={cn("relative", className)}>
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls={panelId}
        className={triggerClass}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={handleTriggerKeyDown}
        data-tour="try-it-now"
      >
        Open Demo
        <ChevronDown
          className={cn(
            "size-4 shrink-0 transition-transform duration-motion-normal ease-motion",
            open && "rotate-180"
          )}
          aria-hidden
        />
      </button>

      <div
        ref={panelRef}
        id={panelId}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby={triggerId}
        className={cn(
          panelClass,
          open ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        )}
        style={{
          top: panelRect.top,
          left: panelRect.left,
          width: panelRect.width,
        }}
        onKeyDown={handlePanelKeyDown}
      >
        <button
          ref={investRef}
          type="button"
          role="menuitem"
          className={itemClass}
          onClick={handleInvestClick}
        >
          Invest
        </button>
        <Link
          ref={developRef}
          href="/vega-developer"
          role="menuitem"
          className={itemClass}
          onClick={close}
        >
          Develop
        </Link>
      </div>
    </div>
  );
}
