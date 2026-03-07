"use client";

import Link from "next/link";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect
        x="2"
        y="2"
        width="20"
        height="20"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle
        cx="12"
        cy="12"
        r="5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="18" cy="6" r="1" fill="currentColor" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

const navigationLinks = [
  { text: "Contact Us", href: "mailto:aaron@vegafinancial.uk" },
  { text: "About Us", href: "/about-us" },
  { text: "FAQ", href: "/faq" },
];

export function TeamMissionPrinciplesSection() {
  return (
    <footer
      className="relative w-full bg-[#333333] shadow-[0px_-10px_30px_3px_rgba(0,0,0,0.25)]"
      role="contentinfo"
    >
      <div className="max-w-[1360px] mx-auto px-6 md:px-10 lg:px-[110px] py-12 md:py-16 flex flex-col md:flex-row md:items-center justify-between gap-10">
        <div className="flex items-center gap-6">
          <a
            href="https://www.instagram.com/vega.financial/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:opacity-80 transition-opacity focus-visible:outline focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#333] rounded"
            aria-label="Visit our Instagram page"
          >
            <InstagramIcon className="w-10 h-10" />
          </a>
          <a
            href="https://www.linkedin.com/company/getvega/posts/?feedView=all"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:opacity-80 transition-opacity focus-visible:outline focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#333] rounded"
            aria-label="Visit our LinkedIn page"
          >
            <LinkedInIcon className="w-9 h-9" />
          </a>
          <nav
            className="flex flex-col gap-4 md:flex-row md:items-center md:gap-8"
            aria-label="Footer navigation"
          >
            {navigationLinks.map((link) => (
              <Link
                key={link.text}
                href={link.href}
                className="font-normal text-white text-base hover:underline focus-visible:outline focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#333] rounded"
              >
                {link.text}
              </Link>
            ))}
          </nav>
        </div>
        <Link
          href="/vega-financial"
          className="flex items-center justify-center w-full md:w-auto min-w-[263px] h-[50px] bg-[#6b21e8] rounded-[30px] border border-solid border-white/20 hover:bg-[#5a1bc4] focus-visible:outline focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#333] transition-colors font-dm-sans font-bold text-white text-xl text-center shrink-0"
          aria-label="Register your interest"
        >
          Register your interest
        </Link>
      </div>
    </footer>
  );
}
