import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
