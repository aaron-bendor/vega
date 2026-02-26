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

function riskVariant(level: string) {
  if (level === "Low") return "success" as const;
  if (level === "High") return "destructive" as const;
  return "outline" as const;
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
  const visibleTags = tags.slice(0, 2);
  const extraCount = tags.length - 2;

  return (
    <Link href={`/vega-financial/algorithms/${id}`}>
      <Card className="h-full transition-colors">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold leading-tight text-foreground line-clamp-1">{name}</h3>
            {verified && (
              <ShieldCheck className="size-4 text-primary shrink-0 mt-0.5" />
            )}
          </div>
          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{shortDesc}</p>
          <div className="flex flex-wrap gap-1 pt-1.5">
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
            <Badge variant={riskVariant(riskLevel)} className="text-[10px]">
              {riskLevel}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">
          {sparklineData.length > 1 && (
            <div className="h-10 flex items-end gap-px">
              {sparklineData.map((v, i) => (
                <div
                  key={i}
                  className="flex-1 min-w-[2px] bg-primary/30 rounded-sm"
                  style={{ height: `${Math.max(4, (v / Math.max(...sparklineData)) * 100)}%` }}
                />
              ))}
            </div>
          )}
          <div className="flex items-center gap-4 text-xs">
            {ret != null && (
              <span>
                <span className="text-muted-foreground">Return </span>
                <span className="font-medium text-foreground">{formatPercent(ret)}</span>
              </span>
            )}
            {volatility != null && (
              <span>
                <span className="text-muted-foreground">Vol </span>
                <span className="font-medium text-foreground">{formatPercent(volatility)}</span>
              </span>
            )}
            {maxDrawdown != null && (
              <span>
                <span className="text-muted-foreground">Max DD </span>
                <span className="font-medium text-foreground">{formatPercent(maxDrawdown)}</span>
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
