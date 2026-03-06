"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect, useCallback, useId } from "react";
import { cn } from "@/lib/utils";

const CLOSE_DELAY_MS = 160;

export type NavDropdownItem = { href: string; label: string };

type NavDropdownProps = {
  label: string;
  items: NavDropdownItem[];
  /** Light variant for dark nav (hero), dark for light nav */
  variant?: "light" | "dark";
  className?: string;
  /** Called when trigger is hovered so parent can show highlight */
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  /** Called when trigger receives keyboard focus so parent can move highlight */
  onFocus?: () => void;
  /** Called when trigger loses focus */
  onBlur?: () => void;
  triggerRef?: (el: HTMLButtonElement | null) => void;
  /** Whether this trigger is "active" for highlight */
  isActive?: boolean;
};

/**
 * Single dropdown panel that opens on hover/focus. Stripe-style: one panel,
 * no gap to trigger, close delay for forgiveness. Keyboard: Enter/Space open,
 * Escape close, focus trapped in panel when open.
 */
export function NavDropdown({
  label,
  items,
  variant = "light",
  className,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  triggerRef,
}: NavDropdownProps) {
  const [open, setOpen] = useState(false);
  const [panelRect, setPanelRect] = useState({ top: 0, left: 0, width: 0 });
  const triggerEl = useRef<HTMLButtonElement | null>(null);
  const panelEl = useRef<HTMLDivElement | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const id = useId();
  const panelId = `nav-dropdown-panel-${id.replace(/:/g, "")}`;
  const triggerId = `nav-dropdown-trigger-${id.replace(/:/g, "")}`;

  const updatePanelPosition = useCallback(() => {
    const trigger = triggerEl.current;
    if (!trigger) return;
    const tr = trigger.getBoundingClientRect();
    setPanelRect({
      top: tr.bottom,
      left: tr.left,
      width: Math.max(tr.width, 200),
    });
  }, []);

  const clearCloseTimeout = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    clearCloseTimeout();
    closeTimeoutRef.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  }, [clearCloseTimeout]);

  const openPanel = useCallback(() => {
    clearCloseTimeout();
    setOpen(true);
    requestAnimationFrame(() => requestAnimationFrame(updatePanelPosition));
  }, [clearCloseTimeout, updatePanelPosition]);

  const closePanel = useCallback(() => {
    clearCloseTimeout();
    setOpen(false);
  }, [clearCloseTimeout]);

  useEffect(() => {
    if (!open) return;
    updatePanelPosition();
    const ro = new ResizeObserver(updatePanelPosition);
    if (triggerEl.current) ro.observe(triggerEl.current);
    window.addEventListener("scroll", updatePanelPosition, true);
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", updatePanelPosition, true);
    };
  }, [open, updatePanelPosition]);

  useEffect(() => {
    return () => clearCloseTimeout();
  }, [clearCloseTimeout]);

  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen((o) => !o);
      if (!open) requestAnimationFrame(() => updatePanelPosition());
    }
    if (e.key === "Escape") {
      closePanel();
      triggerEl.current?.focus();
    }
  };

  const handlePanelKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      closePanel();
      triggerEl.current?.focus();
    }
  };

  const isLight = variant === "light";
  const textClass = isLight
    ? "text-white/80 hover:text-white"
    : "text-muted-foreground hover:text-foreground";
  const panelBg = isLight
    ? "bg-black/90 backdrop-blur-xl border border-white/15"
    : "bg-popover border border-border";

  return (
    <div
      className={cn("relative", className)}
      onMouseEnter={() => {
        openPanel();
        onMouseEnter?.();
      }}
      onMouseLeave={() => {
        scheduleClose();
        onMouseLeave?.();
      }}
    >
      <button
        ref={(el) => {
          triggerEl.current = el;
          triggerRef?.(el);
        }}
        id={triggerId}
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls={panelId}
        className={cn(
          "flex items-center gap-0.5 py-1.5 px-3 rounded-full text-sm lg:text-base font-normal outline-none",
          "transition-colors duration-motion-normal ease-motion",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
          textClass
        )}
        onFocus={() => {
          openPanel();
          onFocus?.();
        }}
        onBlur={(e) => {
          const leavingToPanel = panelEl.current?.contains(e.relatedTarget as Node);
          if (!leavingToPanel) {
            scheduleClose();
            onBlur?.();
          }
        }}
        onKeyDown={handleTriggerKeyDown}
      >
        {label}
        <ChevronDown
          className={cn(
            "size-4 shrink-0 transition-transform duration-motion-normal ease-motion",
            open && "rotate-180"
          )}
          aria-hidden
        />
      </button>

      <div
        ref={panelEl}
        id={panelId}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby={triggerId}
        className={cn(
          "fixed z-[1001] rounded-xl shadow-xl overflow-hidden py-1 min-w-[200px]",
          panelBg,
          "transition-[opacity,transform] duration-motion-normal ease-motion",
          open
            ? "opacity-100 visible translate-y-0"
            : "opacity-0 invisible -translate-y-1 pointer-events-none"
        )}
        style={{
          top: panelRect.top,
          left: panelRect.left,
          width: panelRect.width,
        }}
        onKeyDown={handlePanelKeyDown}
      >
        {items.map(({ href, label: itemLabel }) => (
          <Link
            key={href}
            href={href}
            role="menuitem"
            className={cn(
              "block px-4 py-2.5 text-sm transition-colors duration-motion-normal ease-motion",
              isLight
                ? "text-white/90 hover:bg-white/10 hover:text-white"
                : "text-popover-foreground hover:bg-muted"
            )}
            onClick={closePanel}
          >
            {itemLabel}
          </Link>
        ))}
      </div>
    </div>
  );
}
