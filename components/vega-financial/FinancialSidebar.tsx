"use client";

import Link from "next/link";
import { formatCurrency, formatPercent } from "@/lib/utils/format";
import type { MockAccount } from "@/lib/mock/portfolio";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

interface FinancialSidebarProps {
  account: MockAccount;
}

export function FinancialSidebar({ account }: FinancialSidebarProps) {
  const [open, setOpen] = useState(false);

  const sidebarContent = (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Wallet className="size-5 text-primary" />
        </div>
        <div>
          <p className="font-medium">Paper account</p>
          <p className="text-xs text-muted-foreground">Demo mode</p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Account summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Equity</span>
            <span className="font-medium">{formatCurrency(account.equity)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Available</span>
            <span>{formatCurrency(account.availableCash)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Allocated</span>
            <span>{formatCurrency(account.allocated)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Unrealized PnL</span>
            <span className={account.unrealizedPnl >= 0 ? "text-green-600" : "text-destructive"}>
              {formatPercent(account.unrealizedPnlPct / 100)}
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="pt-2">
        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link href="/portfolio">View full portfolio</Link>
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-24">{sidebarContent}</div>
      </aside>

      {/* Mobile: Sheet trigger */}
      <div className="lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              <Menu className="size-4 mr-2" />
              Account
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <SheetHeader>
              <SheetTitle>Account</SheetTitle>
            </SheetHeader>
            <div className="mt-6" onClick={() => setOpen(false)}>
              {sidebarContent}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
