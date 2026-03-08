import { VegaFinancialPageScaffold } from "@/components/vega-financial/VegaFinancialPageScaffold";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const glossaryItems = [
  {
    title: "Momentum strategy",
    alias: "",
    category: "Strategy type",
    body: "Buys assets already moving up, or cuts exposure to those moving down, on the view that recent price strength can persist for a while.",
  },
  {
    title: "Trend following",
    alias: "",
    category: "Strategy type",
    body: "Similar to momentum, but usually built to stay with longer, steadier market moves rather than short bursts.",
  },
  {
    title: "Mean reversion",
    alias: "",
    category: "Strategy type",
    body: "Looks for prices that have moved unusually far from their usual range and bets on a move back towards that average.",
  },
  {
    title: "Backtesting",
    alias: "",
    category: "Metric",
    body: "Runs a strategy on historical market data to see how it would have behaved. Useful for comparison, but not a guarantee of future results.",
  },
  {
    title: "Return",
    alias: "",
    category: "Metric",
    body: "How much a strategy gained or lost over the period shown. Read it alongside risk, not on its own.",
  },
  {
    title: "Biggest drop",
    alias: "Max drawdown",
    category: "Metric",
    body: "The largest fall from a previous peak to a later low before a new high is reached.",
  },
  {
    title: "Risk-adjusted return",
    alias: "Sharpe ratio",
    category: "Metric",
    body: "Shows how much return a strategy earned for the amount of volatility it took on. Higher is generally better.",
  },
  {
    title: "Price movement",
    alias: "Volatility",
    category: "Metric",
    body: "Shows how much a strategy's value tends to move up and down. Bigger swings usually mean a bumpier ride.",
  },
  {
    title: "Market similarity",
    alias: "Correlation",
    category: "Metric",
    body: "Shows how closely a strategy tends to move with the wider market or another strategy. Lower similarity can help diversification.",
  },
  {
    title: "Allocation",
    alias: "",
    category: "Portfolio term",
    body: "How much of your portfolio you put into a specific strategy or asset.",
  },
  {
    title: "Diversification",
    alias: "",
    category: "Portfolio term",
    body: "Spreading money across different strategies or assets so one weak area does less damage to the whole portfolio.",
  },
  {
    title: "Rebalancing",
    alias: "",
    category: "Portfolio term",
    body: "Adjusting holdings back towards your target mix after markets move and weights drift.",
  },
];

const categoryPillClass: Record<string, string> = {
  "Strategy type": "bg-slate-100 text-slate-700 border-slate-200/60",
  Metric: "bg-sky-50 text-sky-800 border-sky-200/60",
  "Portfolio term": "bg-emerald-50 text-emerald-800 border-emerald-200/60",
};

const glassCardClass =
  "rounded-3xl border border-white/40 bg-white/60 backdrop-blur-xl shadow-[0_8px_30px_rgba(15,23,42,0.06)]";

export default function LearnPage() {
  return (
    <VegaFinancialPageScaffold
      title="Learn"
      description="Investor education on comparing strategies, risk, and building a diversified portfolio."
    >
      <section className="space-y-6">
        <Card className="rounded-xl border border-border bg-card overflow-hidden">
          <CardHeader>
            <CardTitle className="font-maven-pro text-lg">How to compare strategies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              Compare strategies by return, biggest drop (drawdown), and risk level first. Then check how each strategy might fit with your existing holdings—lower correlation can improve diversification. Use the Compare feature on Explore or your watchlist to see several strategies side by side.
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-border bg-card overflow-hidden">
          <CardHeader>
            <CardTitle className="font-maven-pro text-lg">How to read drawdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              Drawdown is the peak-to-trough decline in value over a period. &quot;Biggest drop&quot; shows the largest such decline in the strategy&apos;s track record. A smaller drawdown generally means less severe losses in bad periods, but past results are simulated and do not guarantee future outcomes.
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-border bg-card overflow-hidden">
          <CardHeader>
            <CardTitle className="font-maven-pro text-lg">Why correlation matters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              Correlation measures how closely two strategies move together. Strategies with low or negative correlation can smooth your portfolio when one part falls while another holds up. Adding a diversifier that behaves differently from your main holdings can reduce overall volatility.
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-border bg-card overflow-hidden">
          <CardHeader>
            <CardTitle className="font-maven-pro text-lg">How to build a diversified strategy portfolio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              Start with your risk tolerance and time horizon. Combine strategies with different roles: growth for long-term return, diversifiers to reduce concentration, and defensive strategies for downside cushion. Avoid putting too much in one strategy; spread allocation across roles and risk levels. Review concentration and rebalancing ideas on your Portfolio page regularly.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-6">
        <h2 className="font-maven-pro text-xl font-semibold text-foreground">Glossary of terms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {glossaryItems.map((item) => (
            <Card
              key={item.title}
              className={`${glassCardClass} overflow-hidden border-0`}
            >
              <CardHeader className="p-4 pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <CardTitle className="font-maven-pro text-base font-semibold leading-tight">
                    {item.title}
                  </CardTitle>
                  <span
                    className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${categoryPillClass[item.category] ?? "bg-muted text-muted-foreground"}`}
                  >
                    {item.category}
                  </span>
                </div>
                {item.alias ? (
                  <p className="text-xs text-muted-foreground mt-1">Also called {item.alias}.</p>
                ) : null}
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <p className="text-sm text-muted-foreground leading-relaxed max-w-prose">
                  {item.body}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </VegaFinancialPageScaffold>
  );
}
