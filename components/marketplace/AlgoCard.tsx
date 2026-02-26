import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import { formatPercent } from "@/lib/utils/format";
import type { MockAlgorithm } from "@/lib/mock/algorithms";

interface AlgoCardProps {
  algo: MockAlgorithm;
}

function riskVariant(level: string) {
  if (level === "Low") return "success" as const;
  if (level === "High") return "destructive" as const;
  return "outline" as const;
}

export function AlgoCard({ algo }: AlgoCardProps) {
  const visibleTags = algo.tags.slice(0, 2);
  const extraCount = algo.tags.length - 2;

  return (
    <Card className="flex flex-col h-full transition-colors">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-sm leading-tight text-foreground line-clamp-1">{algo.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{algo.shortDesc}</p>
          </div>
          {algo.verified && (
            <ShieldCheck className="size-4 text-primary shrink-0 mt-0.5" aria-label="Verified" />
          )}
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {visibleTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-[10px]">
              {tag}
            </Badge>
          ))}
          {extraCount > 0 && (
            <Badge variant="outline" className="text-[10px]">
              +{extraCount}
            </Badge>
          )}
          <Badge variant={riskVariant(algo.riskLevel)} className="text-[10px]">
            {algo.riskLevel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0 flex-1 flex flex-col">
        <div className="h-10 flex items-end gap-px mb-3">
          {algo.sparkline.map((v, i) => (
            <div
              key={i}
              className="flex-1 min-w-[2px] bg-primary/30 rounded-sm"
              style={{ height: `${Math.max(4, v * 100)}%` }}
            />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs mb-4">
          <span className="text-muted-foreground">Return</span>
          <span className="text-foreground font-medium text-right">{formatPercent(algo.return)}</span>
          <span className="text-muted-foreground">Max DD</span>
          <span className="text-foreground text-right">{formatPercent(algo.maxDrawdown)}</span>
          <span className="text-muted-foreground">Sharpe</span>
          <span className="text-foreground text-right">{algo.sharpe.toFixed(2)}</span>
          <span className="text-muted-foreground">Volatility</span>
          <span className="text-foreground text-right">{formatPercent(algo.volatility)}</span>
          <span className="text-muted-foreground">Correlation</span>
          <span className="text-foreground text-right">{algo.correlationToBenchmark.toFixed(2)}</span>
        </div>
        <div className="flex gap-2 mt-auto">
          <Button size="sm" className="flex-1" asChild>
            <Link href={`/vega-financial/algo/${algo.id}`}>View</Link>
          </Button>
          <Button size="sm" variant="outline" className="flex-1" asChild>
            <Link href={`/vega-financial/algo/${algo.id}#simulate`}>Simulate invest</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
