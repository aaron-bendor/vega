"use client";

import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatPercent } from "@/lib/utils/format";
import { TrendingUp, TrendingDown, ExternalLink } from "lucide-react";

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

function riskLabel(level: string) {
  if (level === "Low") return "text-brand-green";
  if (level === "High") return "text-brand-red";
  if (level === "Medium") return "text-brand-orange";
  return "text-muted-foreground";
}

export function HoldingsTable({ holdings }: HoldingsTableProps) {
  const router = useRouter();

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
          <TableHead className="text-right w-28">Invested</TableHead>
          <TableHead className="text-right w-28">Current value</TableHead>
          <TableHead className="text-right w-24">PnL</TableHead>
          <TableHead className="w-20 text-center">Risk</TableHead>
          <TableHead className="w-12" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {holdings.map((h) => (
          <TableRow
            key={h.id}
            className="cursor-pointer"
            onClick={() => router.push(`/vega-financial/algorithms/${h.versionId}`)}
          >
            <TableCell className="font-medium">
              <span className="truncate block max-w-[200px]" title={h.algorithmName}>
                {h.algorithmName}
              </span>
            </TableCell>
            <TableCell className="text-right">
              {formatCurrency(h.invested)}
            </TableCell>
            <TableCell className="text-right">
              {formatCurrency(h.currentValue)}
            </TableCell>
            <TableCell className="text-right">
              <span
                className={`inline-flex items-center gap-1 ${h.pnl >= 0 ? "text-brand-green" : "text-brand-red"}`}
              >
                {h.pnl >= 0 ? (
                  <TrendingUp className="size-3.5" />
                ) : (
                  <TrendingDown className="size-3.5" />
                )}
                {formatPercent(h.pnl)}
              </span>
            </TableCell>
            <TableCell className={`text-center text-xs font-medium ${riskLabel(h.riskLevel)}`}>
              {h.riskLevel}
            </TableCell>
            <TableCell
              className="text-muted-foreground"
              onClick={(e) => e.stopPropagation()}
            >
              <a
                href={`/vega-financial/algorithms/${h.versionId}`}
                className="inline-flex p-1 rounded hover:bg-[rgba(51,51,51,0.06)] hover:text-foreground"
                aria-label="Open"
              >
                <ExternalLink className="size-3.5" />
              </a>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
