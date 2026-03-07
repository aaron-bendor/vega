"use client";

import Link from "next/link";
import Image from "next/image";

/**
 * Slim top banner with Vega Financial logo only. Links to the public homepage
 * so users can leave the investor app and return to the marketing site.
 */
export function InvestorLogoBanner() {
  return (
    <div className="h-12 shrink-0 flex items-center justify-center border-b border-border bg-white px-4">
      <Link
        href="/"
        className="flex items-center rounded-md focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Vega Financial – Back to homepage"
      >
        <Image
          src="/logo.png"
          alt=""
          width={120}
          height={30}
          className="h-6 w-auto object-contain sm:h-7"
        />
      </Link>
    </div>
  );
}
