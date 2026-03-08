import { PageHeader } from "@/components/vega-financial/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LearnPage() {
  return (
    <div className="w-full max-w-6xl min-w-0 mx-auto px-4 py-6 sm:p-6 lg:p-8 space-y-8">
      <PageHeader
        title="Learn"
        subtitle="Investor education on comparing strategies, risk, and building a diversified portfolio."
      />

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
    </div>
  );
}
