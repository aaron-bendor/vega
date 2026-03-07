import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      transitionDuration: {
        "motion-fast": "120ms",
        "motion-normal": "180ms",
        "motion-slow": "240ms",
        "motion-chip": "200ms",
        "motion-card": "280ms",
        "motion-section": "500ms",
        "motion-countup": "1000ms",
      },
      transitionTimingFunction: {
        "motion": "cubic-bezier(0.2, 0.8, 0.2, 1)",
        "motion-out": "cubic-bezier(0.33, 1, 0.68, 1)",
        "motion-spring": "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      animation: {
        "count-up": "count-up var(--motion-duration-countup, 1000ms) var(--motion-ease-out, cubic-bezier(0.33, 1, 0.68, 1)) forwards",
      },
      keyframes: {
        "count-up": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      fontFamily: {
        syne: ["var(--font-syne)", "system-ui", "sans-serif"],
        "dm-sans": ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        "maven-pro": ["var(--font-maven-pro)", "system-ui", "sans-serif"],
        "dm-mono": ["var(--font-dm-mono)", "monospace"],
      },
      colors: {
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        card: {
          DEFAULT: "rgb(var(--card) / <alpha-value>)",
          foreground: "rgb(var(--card-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "rgb(var(--popover) / <alpha-value>)",
          foreground: "rgb(var(--popover-foreground) / <alpha-value>)",
        },
        primary: {
          DEFAULT: "rgb(var(--primary) / <alpha-value>)",
          foreground: "rgb(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "rgb(var(--secondary) / <alpha-value>)",
          foreground: "rgb(var(--secondary-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "rgb(var(--muted) / <alpha-value>)",
          foreground: "rgb(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          foreground: "rgb(var(--accent-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "rgb(var(--destructive) / <alpha-value>)",
          foreground: "rgb(var(--destructive-foreground) / <alpha-value>)",
        },
        success: "rgb(var(--success) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        input: "rgb(var(--input) / <alpha-value>)",
        ring: "rgb(var(--ring) / <alpha-value>)",
        brand: {
          "111": "rgb(var(--c-111) / <alpha-value>)",
          "333": "rgb(var(--c-333) / <alpha-value>)",
          red: "rgb(var(--c-red) / <alpha-value>)",
          green: "rgb(var(--c-green) / <alpha-value>)",
          orange: "rgb(var(--c-orange) / <alpha-value>)",
          p1: "rgb(var(--c-p1) / <alpha-value>)",
          p2: "rgb(var(--c-p2) / <alpha-value>)",
          p3: "rgb(var(--c-p3) / <alpha-value>)",
        },
        chart: {
          "1": "rgb(var(--chart-1) / <alpha-value>)",
          "2": "rgb(var(--chart-2) / <alpha-value>)",
          "3": "rgb(var(--chart-3) / <alpha-value>)",
          "4": "rgb(var(--chart-4) / <alpha-value>)",
          "5": "rgb(var(--chart-5) / <alpha-value>)",
        },
        shell: {
          banner: "rgb(var(--shell-banner) / <alpha-value>)",
          sidebar: "rgb(var(--shell-sidebar) / <alpha-value>)",
          "shell-border": "rgb(var(--shell-border) / <alpha-value>)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
