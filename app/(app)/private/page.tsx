import { Lock, FileText, BarChart3, Shield, Video, Map, KeyRound } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const sections = [
  {
    icon: FileText,
    title: "Validation evidence",
    description:
      "Documentation of the validation approach, test coverage, user testing results, and quality assurance methodology.",
    status: "Planned",
  },
  {
    icon: BarChart3,
    title: "P&L and performance",
    description:
      "Profit and loss analysis across backtested strategies, benchmark comparisons, and risk-adjusted performance metrics.",
    status: "Planned",
  },
  {
    icon: Shield,
    title: "Risk assessment",
    description:
      "Comprehensive risk analysis including drawdown limits, concentration risk, correlation matrices, and mitigation strategies.",
    status: "Planned",
  },
  {
    icon: Map,
    title: "Funding route map",
    description:
      "Path to commercialisation, regulatory considerations, target market analysis, and funding strategy.",
    status: "Planned",
  },
  {
    icon: Video,
    title: "Video asset",
    description:
      "Product demo walkthrough and pitch video for assessment purposes.",
    status: "Planned",
  },
];

export default function PrivatePage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <div className="text-center mb-10">
        <div className="size-16 rounded-full bg-[rgba(51,51,51,0.04)] flex items-center justify-center mx-auto mb-4">
          <Lock className="size-8 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Private — For Marking</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          This section will contain assessment materials and evidence.
          It will be password-protected in a future release.
        </p>
        <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
          <KeyRound className="size-4" />
          Password protection coming soon
        </div>
      </div>

      <div className="space-y-3">
        {sections.map((s) => (
          <Card key={s.title} className="hover:border-primary/20 transition-colors">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <s.icon className="size-4 text-muted-foreground" />
                  {s.title}
                </CardTitle>
                <Badge variant="outline" className="text-[10px]">
                  {s.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{s.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
