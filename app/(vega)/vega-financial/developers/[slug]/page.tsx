import { notFound } from "next/navigation";
import { getDeveloperProfileBySlug } from "@/lib/demo/developer-profile-data";
import { Breadcrumb } from "@/components/vega-financial/Breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, GraduationCap } from "lucide-react";

const DEVELOPER_TAGS: { label: string; icon?: "verified" | "education" }[] = [
  { label: "Equity momentum" },
  { label: "Mean reversion" },
  { label: "Trend following" },
  { label: "Python / pandas" },
  { label: "Backtesting" },
  { label: "Verified developer", icon: "verified" },
  { label: "Imperial College London", icon: "education" },
  { label: "3 strategies published" },
];

export default async function DeveloperProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ from?: string; fromName?: string }>;
}) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const developer = getDeveloperProfileBySlug(slug);
  if (!developer) notFound();

  const fromAlgoId = query.from?.trim();
  const fromAlgoName = query.fromName?.trim();
  const breadcrumbItems = [
    { label: "Strategies", href: "/vega-financial/marketplace" },
    ...(fromAlgoId && fromAlgoName
      ? [
          { label: fromAlgoName, href: `/vega-financial/algorithms/${fromAlgoId}` as const },
          { label: developer.name },
        ]
      : [{ label: developer.name }]),
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-5 sm:py-6">
      <Breadcrumb items={breadcrumbItems} />

      {/* Hero: purple glass (vf-glass-hero vf-glass-violet) */}
      <section
        aria-labelledby="developer-heading"
        className="vf-glass-hero vf-glass-violet rounded-2xl overflow-hidden border border-white/50"
      >
        <div className="relative px-6 py-8 sm:px-8 sm:py-10">
          <div className="flex flex-col sm:flex-row sm:items-end gap-6">
            <div
              className="size-16 sm:size-20 shrink-0 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center text-xl sm:text-2xl font-bold text-primary"
              aria-hidden
            >
              {developer.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <h1
                id="developer-heading"
                className="font-maven-pro text-2xl sm:text-3xl font-bold text-foreground tracking-tight"
              >
                {developer.name}
              </h1>
              <p className="text-sm text-muted-foreground mt-1 max-w-2xl leading-relaxed">
                {developer.role}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                {developer.verified && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                    <ShieldCheck className="size-3.5" aria-hidden />
                    Verified
                  </span>
                )}
                <span className="rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                  Joined {developer.joined}
                </span>
              </div>
            </div>
          </div>

          {/* Tags row */}
          <div className="flex flex-wrap gap-2 mt-6">
            {DEVELOPER_TAGS.map((tag, i) => (
              <span
                key={i}
                className="vf-glass-quiet vf-glass-violet inline-flex items-center gap-1.5 rounded-full border border-white/40 px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
              >
                {tag.icon === "verified" && <ShieldCheck className="size-3 shrink-0 text-primary" aria-hidden />}
                {tag.icon === "education" && <GraduationCap className="size-3 shrink-0 text-primary" aria-hidden />}
                {tag.label}
              </span>
            ))}
          </div>

          {/* Stat summary inside hero */}
          <div className="mt-8 pt-6 border-t border-border/60">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="vf-glass-card vf-glass-violet rounded-xl px-4 py-3 sm:px-5 sm:py-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Live algorithms
                </p>
                <p className="text-lg sm:text-xl font-bold text-foreground tabular-nums">
                  {developer.stats.liveAlgorithms}
                </p>
              </div>
              <div className="vf-glass-card vf-glass-violet rounded-xl px-4 py-3 sm:px-5 sm:py-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Total capital managed
                </p>
                <p className="text-lg sm:text-xl font-bold text-foreground tabular-nums">
                  {developer.stats.totalCapitalManaged}
                </p>
              </div>
              <div className="vf-glass-card vf-glass-violet rounded-xl px-4 py-3 sm:px-5 sm:py-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Average return
                </p>
                <p className="text-lg sm:text-xl font-bold text-foreground tabular-nums">
                  {developer.stats.averageReturn}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section aria-labelledby="about-heading" className="mt-6">
        <Card className="rounded-2xl border border-border">
          <CardHeader>
            <CardTitle id="about-heading" className="text-lg">
              About
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {developer.about}
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
