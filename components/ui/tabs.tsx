"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-9 items-center justify-center rounded-lg bg-[rgba(51,51,51,0.04)] p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

/**
 * TabsList with a sliding underline indicator that tracks the active trigger.
 * Uses transform only for animation; snaps on reduced motion.
 */
const TabsListWithIndicator = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, children, ...props }, ref) => {
  const listRef = React.useRef<HTMLDivElement | null>(null);
  const [indicator, setIndicator] = React.useState({ left: 0, width: 0 });

  const updateIndicator = React.useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    const active = list.querySelector<HTMLElement>('[data-state="active"]');
    if (!active) {
      setIndicator((prev) => (prev.width === 0 ? prev : { left: 0, width: 0 }));
      return;
    }
    // Use offsetLeft/offsetWidth so the indicator stays aligned when the list scrolls (overflow-x-auto)
    const left = active.offsetLeft;
    const width = active.offsetWidth;
    setIndicator((prev) => (prev.left === left && prev.width === width ? prev : { left, width }));
  }, []);

  React.useLayoutEffect(() => {
    updateIndicator();
  }, [updateIndicator, children]);

  React.useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const mo = new MutationObserver(updateIndicator);
    mo.observe(list, { attributes: true, subtree: true, attributeFilter: ["data-state"] });
    const ro = new ResizeObserver(updateIndicator);
    ro.observe(list);
    return () => {
      mo.disconnect();
      ro.disconnect();
    };
  }, [updateIndicator]);

  return (
    <TabsPrimitive.List
      ref={(el) => {
        (listRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
        if (typeof ref === "function") ref(el);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
      }}
      className={cn("relative inline-flex h-9 items-center justify-center rounded-lg bg-[rgba(51,51,51,0.04)] p-1 text-muted-foreground", className)}
      {...props}
    >
      {children}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute bottom-0 left-0 h-0.5 rounded-full bg-primary ease-motion transition-[transform,width] duration-motion-normal motion-reduce:!duration-0"
        )}
        style={{
          transform: `translateX(${indicator.left}px)`,
          width: `${indicator.width}px`,
        }}
      />
    </TabsPrimitive.List>
  );
});
TabsListWithIndicator.displayName = "TabsListWithIndicator";

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "relative z-10 inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-[color,background-color,box-shadow,border-color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:border data-[state=active]:border-[rgba(51,51,51,0.12)] data-[state=active]:shadow-sm",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsListWithIndicator, TabsTrigger, TabsContent }
