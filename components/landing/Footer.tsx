import Link from "next/link";

const navigationLinks = [
  { href: "#", label: "Contact Us" },
  { href: "#", label: "About Us" },
  { href: "#", label: "FAQ" },
];

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
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
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" />
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
    >
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="relative w-full bg-[#333333]">
      <div className="max-w-[1360px] mx-auto px-6 md:px-[110px] py-16 md:py-20">
        <div className="flex flex-col md:flex-row items-start justify-between gap-12">
          {/* Left: social icons — gap-[14px] per Frame */}
          <div className="flex items-center gap-[14px]">
            <a
              href="https://www.instagram.com/vega.financial/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 text-white hover:text-white/70 transition-colors"
              aria-label="Instagram"
            >
              <InstagramIcon className="w-10 h-10" />
            </a>
            <a
              href="https://www.linkedin.com/company/getvega/posts/?feedView=all"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-[37px] h-[37px] text-white hover:text-white/70 transition-colors"
              aria-label="LinkedIn"
            >
              <LinkedInIcon className="w-[37px] h-[37px]" />
            </a>
          </div>

          {/* Centre: nav links — gap-[29px] per Frame, Inter-Regular */}
          <nav
            className="flex flex-col gap-[29px] w-[85px] items-start"
            aria-label="Footer navigation"
          >
            {navigationLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="font-normal text-white text-base tracking-[0] leading-4 hover:opacity-80 transition-opacity"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right: CTA button — 263×50, DM_Sans-Bold, border white/17% per Frame */}
          <div>
            <a
              href="https://tally.so/r/ZjaKj5"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-[263px] h-[50px] bg-[#6b21e8] rounded-[30px] border border-solid border-[#ffffff2b] font-dm-sans font-bold text-white text-xl text-center tracking-[0] leading-6 whitespace-nowrap hover:bg-[#5a1bc4] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              Register your interest
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
