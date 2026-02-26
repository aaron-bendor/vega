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
          <TableHead>Invested</TableHead>
          <TableHead>Current value</TableHead>
          <TableHead>PnL</TableHead>
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
            <TableCell>{formatCurrency(h.invested)}</TableCell>
            <TableCell>{formatCurrency(h.currentValue)}</TableCell>
            <TableCell
              className={
                h.pnl >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
              }
            >
              {formatPercent(h.pnl)}
            </TableCell>
            <TableCell>
              <Badge variant="outline" className="text-xs">
                {h.riskLevel}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
