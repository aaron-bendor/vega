import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck } from "lucide-react";
import { formatPercent } from "@/lib/utils/format";

interface AlgorithmCardProps {
  id: string;
  name: string;
  shortDesc: string;
  tags: string[];
  riskLevel: string;
  verified?: boolean;
  return?: number;
  volatility?: number;
  maxDrawdown?: number;
  sparklineData?: number[];
}

export function AlgorithmCard({
  id,
  name,
  shortDesc,
  tags,
  riskLevel,
  verified,
  return: ret,
  volatility,
  maxDrawdown,
  sparklineData = [],
}: AlgorithmCardProps) {
  return (
    <Link href={`/vega-financial/algorithms/${id}`}>
      <Card className="h-full hover:border-primary/50 transition-colors bg-card/90 backdrop-blur">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-semibold leading-tight">{name}</h3>
            {verified && (
              <ShieldCheck className="size-4 text-muted-foreground shrink-0 mt-0.5" />
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{shortDesc}</p>
          <div className="flex flex-wrap gap-1 pt-1">
            {tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            <Badge variant="outline" className="text-xs">
              {riskLevel}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">
          {sparklineData.length > 1 && (
            <div className="h-12 flex items-end gap-px">
              {sparklineData.map((v, i) => (
                <div
                  key={i}
                  className="flex-1 min-w-[2px] bg-primary/40 rounded-sm"
                  style={{ height: `${Math.max(4, (v / Math.max(...sparklineData)) * 100)}%` }}
                />
              ))}
            </div>
          )}
          <div className="grid grid-cols-3 gap-2 text-xs">
            {ret != null && (
              <span>
                <span className="text-muted-foreground">Return </span>
                {formatPercent(ret)}
              </span>
            )}
            {volatility != null && (
              <span>
                <span className="text-muted-foreground">Vol </span>
                {formatPercent(volatility)}
              </span>
            )}
            {maxDrawdown != null && (
              <span>
                <span className="text-muted-foreground">Max DD </span>
                {formatPercent(maxDrawdown)}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
