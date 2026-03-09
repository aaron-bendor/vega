import Link from "next/link";
import VegaDeveloperTour from "@/components/vega-developer/VegaDeveloperTour";

function MobileDeveloperDemoFallback() {
  return (
    <main className="min-h-[100dvh] bg-black text-white px-4 py-10 lg:hidden">
      <div className="mx-auto max-w-md rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
        <p className="font-dm-mono text-xs tracking-[0.18em] text-violet-400">
          {"// DESKTOP EXPERIENCE"}
        </p>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight leading-tight">
          Vega Developer works best on a laptop.
        </h1>
        <p className="mt-3 text-sm leading-6 text-white/70">
          This interactive IDE demo is desktop-only. On mobile, send users back to the overview page instead of rendering the tour.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/vega-developer"
            className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-white/10 px-5 text-sm font-semibold text-white border border-white/15"
          >
            Back to overview
          </Link>
          <Link
            href="/#get-started"
            className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[#6b21e8] px-5 text-sm font-semibold text-white"
          >
            Join waitlist
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function VegaDeveloperDemoPage() {
  return (
    <>
      <MobileDeveloperDemoFallback />
      <div className="hidden lg:block">
        <VegaDeveloperTour />
      </div>
    </>
  );
}
