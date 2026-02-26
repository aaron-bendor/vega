import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatPercent } from "@/lib/utils/format";
import { TrendingUp, TrendingDown } from "lucide-react";

export interface HoldingRow {
  id: string;
  algorithmName: string;
  versionId: string;
  invested: number;
  currentValue: number;
  pnl: number;
  riskLevel: string;
}

interface HoldingsTableProps {
  holdings: HoldingRow[];
}

function riskVariant(level: string) {
  if (level === "Low") return "success" as const;
  if (level === "High") return "destructive" as const;
  return "outline" as const;
}

export function HoldingsTable({ holdings }: HoldingsTableProps) {
  if (!holdings.length) {
    return (
      <p className="py-8 text-center text-muted-foreground text-sm">
        No simulated investments yet. Explore algorithms below.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Algorithm</TableHead>
          <TableHead className="text-right">Invested</TableHead>
          <TableHead className="text-right">Current value</TableHead>
          <TableHead className="text-right">PnL</TableHead>
          <TableHead>Risk</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {holdings.map((h) => (
          <TableRow key={h.id}>
            <TableCell className="font-medium">
              <Link
                href={`/vega-financial/algorithms/${h.versionId}`}
                className="hover:underline"
              >
                {h.algorithmName}
              </Link>
            </TableCell>
            <TableCell className="text-right">{formatCurrency(h.invested)}</TableCell>
            <TableCell className="text-right">{formatCurrency(h.currentValue)}</TableCell>
            <TableCell className="text-right">
              <span className={`inline-flex items-center gap-1 ${h.pnl >= 0 ? "text-brand-green" : "text-brand-red"}`}>
                {h.pnl >= 0
                  ? <TrendingUp className="size-3.5" />
                  : <TrendingDown className="size-3.5" />}
                {formatPercent(h.pnl)}
              </span>
            </TableCell>
            <TableCell>
              <Badge variant={riskVariant(h.riskLevel)} className="text-[10px]">
                {h.riskLevel}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
