import type { Metadata } from "next";
import { Syne, DM_Sans, Maven_Pro, DM_Mono } from "next/font/google";
import "./globals.css";
import { CommandPalette } from "@/components/layout/CommandPalette";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const mavenPro = Maven_Pro({
  subsets: ["latin"],
  variable: "--font-maven-pro",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vega — University Prototype",
  description:
    "University prototype for algorithmic trading simulation. Paper trading only. Synthetic data. Not investment advice.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable} ${mavenPro.variable} ${dmMono.variable}`}>
      <body className="antialiased">
        {/* SVG filter for liquid-ish card effect (bevel / distortion) */}
        <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
          <filter id="lg-distort">
            <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="1" seed="8" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="18" xChannelSelector="R" yChannelSelector="G" />
            <feGaussianBlur stdDeviation="0.25" />
          </filter>
        </svg>
        {children}
        <CommandPalette />
      </body>
    </html>
  );
}
