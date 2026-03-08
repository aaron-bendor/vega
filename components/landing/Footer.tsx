import Link from "next/link";
import Image from "next/image";

const footerLinks = [
  { href: "/about-us", label: "About Us" },
  { href: "/algorithms", label: "Algorithms" },
  { href: "/#built-for", label: "Built for" },
  { href: "/faq", label: "FAQ" },
  { href: "mailto:aaron@vegafinancial.uk", label: "Contact" },
];

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.5" />
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
      aria-hidden
    >
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="relative w-full bg-[#333333]" role="contentinfo">
      <div className="max-w-[1360px] mx-auto px-6 md:px-10 lg:px-[110px] py-12 md:py-16">
        {/* Top row: left = logo + descriptor, right = links */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 md:gap-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <Link href="/" className="flex items-center gap-2 shrink-0 focus-visible:outline focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#333] rounded">
              <Image src="/logo.png" alt="Vega Financial" width={120} height={30} className="h-7 w-auto object-contain" />
            </Link>
            <p className="text-white/80 text-sm max-w-[280px]">
              Algorithmic investing for everyone. Paper trading prototype.
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-6 md:gap-8" aria-label="Footer navigation">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="font-normal text-white text-base hover:opacity-80 transition-opacity duration-200 focus-visible:outline focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#333] rounded"
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://www.instagram.com/vega.financial/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:opacity-70 transition-opacity focus-visible:outline focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#333] rounded"
              aria-label="Instagram"
            >
              <InstagramIcon className="w-6 h-6" />
            </a>
            <a
              href="https://www.linkedin.com/company/getvega/posts/?feedView=all"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:opacity-70 transition-opacity focus-visible:outline focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#333] rounded"
              aria-label="LinkedIn"
            >
              <LinkedInIcon className="w-6 h-6" />
            </a>
          </nav>
        </div>

        {/* Bottom: copyright */}
        <div className="mt-10 pt-8 border-t border-white/15">
          <p className="text-white/60 text-sm">
            © {new Date().getFullYear()} Vega Financial. University prototype. Not investment advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
