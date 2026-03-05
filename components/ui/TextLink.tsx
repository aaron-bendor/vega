"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface TextLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
  className?: string;
  /** Optional trailing icon (e.g. arrow); will nudge on hover */
  trailingIcon?: React.ReactNode;
}

/**
 * Inline text link with underline reveal and optional trailing icon nudge.
 * Use for "Back to Vega", "Learn more", etc. No font metric changes on hover.
 */
export function TextLink({
  href,
  children,
  className,
  trailingIcon,
  ...props
}: TextLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative inline-flex items-center gap-1 rounded outline-none",
        "after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:origin-left after:scale-x-0",
        "after:transition-transform after:duration-motion-normal after:ease-motion",
        "hover:after:scale-x-100 focus-visible:after:scale-x-100",
        "after:bg-current",
        "py-0.5",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "transition-colors duration-motion-normal ease-motion",
        "text-muted-foreground hover:text-foreground",
        className
      )}
      {...props}
    >
      {children}
      {trailingIcon && (
        <span className="inline-flex shrink-0 transition-transform duration-motion-normal ease-motion group-hover:translate-x-0.5">
          {trailingIcon}
        </span>
      )}
    </Link>
  );
}
