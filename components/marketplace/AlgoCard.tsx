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

export function AlgoCard({ algo }: AlgoCardProps) {
  return (
    <Card className="flex flex-col h-full hover:border-primary/30 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold leading-tight">{algo.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{algo.shortDesc}</p>
          </div>
          {algo.verified && (
            <ShieldCheck className="size-4 text-primary shrink-0 mt-0.5" aria-label="Verified" />
          )}
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {algo.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          <Badge variant="outline" className="text-xs">
            {algo.riskLevel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0 flex-1 flex flex-col">
        {/* Mini sparkline */}
        <div className="h-10 flex items-end gap-px mb-3">
          {algo.sparkline.map((v, i) => (
            <div
              key={i}
              className="flex-1 min-w-[2px] bg-primary/50 rounded-sm"
              style={{ height: `${Math.max(4, v * 100)}%` }}
            />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground mb-4">
          <span>Return</span>
          <span className="text-foreground font-medium">{formatPercent(algo.return)}</span>
          <span>Max DD</span>
          <span className="text-foreground">{formatPercent(algo.maxDrawdown)}</span>
          <span>Sharpe</span>
          <span className="text-foreground">{algo.sharpe.toFixed(2)}</span>
          <span>Volatility</span>
          <span className="text-foreground">{formatPercent(algo.volatility)}</span>
          <span>Correlation</span>
          <span className="text-foreground">{algo.correlationToBenchmark.toFixed(2)}</span>
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
