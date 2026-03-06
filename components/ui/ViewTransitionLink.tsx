"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import type { ComponentProps } from "react";

type ViewTransitionLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
};

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Link that uses the View Transitions API when available for smoother navigation.
 * Falls back to normal navigation. Disabled when prefers-reduced-motion: reduce.
 */
export function ViewTransitionLink({
  href,
  onClick,
  children,
  ...props
}: ViewTransitionLinkProps) {
  const router = useRouter();

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      const isSameOrigin =
        typeof href === "string" && href.startsWith("/") && !href.startsWith("//");
      const hasViewTransition =
        typeof document !== "undefined" && "startViewTransition" in document;

      if (
        isSameOrigin &&
        hasViewTransition &&
        !prefersReducedMotion() &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.shiftKey &&
        !e.altKey
      ) {
        e.preventDefault();
        document.startViewTransition(() => {
          router.push(href);
          return new Promise<void>((resolve) => setTimeout(resolve, 350));
        });
        onClick?.(e);
        return;
      }

      onClick?.(e);
    },
    [href, router, onClick]
  );

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
