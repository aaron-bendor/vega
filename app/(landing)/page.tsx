import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Wallet, Code2, Lock, ArrowRight, TrendingUp, ShieldCheck, BarChart3 } from "lucide-react";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-p1/30 text-sm text-brand-p3 mb-6">
          <ShieldCheck className="size-4" />
          University prototype — paper trading only
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
          Vega
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Algorithmic trading simulation platform. Browse strategies, run
          backtests, and manage a paper portfolio. Synthetic data only.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 max-w-4xl mx-auto">
        <Link href="/vega-financial" className="group">
          <div className="p-5 rounded-lg border border-[rgba(51,51,51,0.12)] bg-white hover:border-[rgba(51,51,51,0.18)] hover:bg-[rgba(51,51,51,0.02)] transition-all h-full flex flex-col">
            <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Wallet className="size-6 text-primary" />
            </div>
            <h2 className="font-semibold text-base mb-2 text-foreground">Vega Financial</h2>
            <p className="text-sm text-muted-foreground mb-4 flex-1">
              Investor dashboard. Portfolio overview, algorithm marketplace,
              and simulated backtesting.
            </p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
              <span className="flex items-center gap-1"><TrendingUp className="size-3" /> 6 algorithms</span>
              <span className="flex items-center gap-1"><BarChart3 className="size-3" /> Live charts</span>
            </div>
            <span className="text-sm font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
              Open dashboard <ArrowRight className="size-4" />
            </span>
          </div>
        </Link>

        <Link href="/vega-developer" className="group">
          <div className="p-5 rounded-lg border border-[rgba(51,51,51,0.12)] bg-white hover:border-[rgba(51,51,51,0.18)] hover:bg-[rgba(51,51,51,0.02)] transition-all h-full flex flex-col">
            <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Code2 className="size-6 text-primary" />
            </div>
            <h2 className="font-semibold text-base mb-2 text-foreground">Vega Developer</h2>
            <p className="text-sm text-muted-foreground mb-4 flex-1">
              Developer portal. Create, backtest, and publish algorithmic
              strategies to the marketplace.
            </p>
            <span className="text-sm font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
              Coming soon <ArrowRight className="size-4" />
            </span>
          </div>
        </Link>

        <Link href="/private" className="group">
          <div className="p-5 rounded-lg border border-[rgba(51,51,51,0.12)] bg-white hover:border-[rgba(51,51,51,0.18)] hover:bg-[rgba(51,51,51,0.02)] transition-all h-full flex flex-col">
            <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Lock className="size-6 text-primary" />
            </div>
            <h2 className="font-semibold text-base mb-2 text-foreground">Private</h2>
            <p className="text-sm text-muted-foreground mb-4 flex-1">
              Assessment materials. Validation evidence, P&amp;L analysis,
              risk assessment, and funding route map.
            </p>
            <span className="text-sm font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
              View placeholder <ArrowRight className="size-4" />
            </span>
          </div>
        </Link>
      </div>

      <div className="text-center mt-12">
        <Button size="lg" asChild>
          <Link href="/vega-financial" className="gap-2">
            Start with Vega Financial <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
