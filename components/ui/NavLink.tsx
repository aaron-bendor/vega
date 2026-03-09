"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface NavLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
  className?: string;
  /** Use "light" for dark backgrounds, "dark" for light backgrounds */
  variant?: "light" | "dark" | "brand";
  /** When true, omit the link's own underline */
  noUnderline?: boolean;
}

export function NavLink({
  href,
  children,
  className,
  variant = "dark",
  noUnderline = false,
  ...props
}: NavLinkProps) {
  const pillOpacity =
    variant === "light"
      ? "before:bg-white/15"
      : variant === "brand"
        ? "before:bg-primary/10"
        : "before:bg-foreground/8";

  return (
    <Link
      href={href}
      className={cn(
        "relative inline-block py-1.5 px-3 rounded-full",
        "before:content-[''] before:absolute before:inset-0 before:rounded-full before:scale-[0.98] before:opacity-0",
        "before:transition-[transform,opacity] before:duration-motion-normal before:ease-motion",
        "hover:before:opacity-100 hover:before:scale-100 focus-visible:before:opacity-100 focus-visible:before:scale-100",
        !noUnderline && [
          "after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:origin-left after:scale-x-0",
          "after:transition-transform after:duration-motion-normal after:ease-motion",
          "hover:after:scale-x-100 focus-visible:after:scale-x-100",
          variant === "light" ? "after:bg-white" : "after:bg-primary",
        ],
        variant === "light"
          ? "text-white/80 hover:text-white"
          : variant === "brand"
            ? "text-primary hover:text-primary-hover"
            : "text-muted-foreground hover:text-foreground",
        pillOpacity,
        "focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:rounded-full",
        "transition-colors duration-motion-normal ease-motion",
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
