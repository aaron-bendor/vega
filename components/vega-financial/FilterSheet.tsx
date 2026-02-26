"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { Label } from "@/components/ui/label";

export function FilterSheet() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const risk = searchParams.get("risk") ?? "";
  const verified = searchParams.get("verified") === "true";
  const sort = searchParams.get("sort") ?? "trending";

  const setParams = (updates: { risk?: string; verified?: boolean; sort?: string }) => {
    const params = new URLSearchParams(searchParams.toString());
    if (updates.risk !== undefined) {
      if (updates.risk) params.set("risk", updates.risk);
      else params.delete("risk");
    }
    if (updates.verified !== undefined) {
      if (updates.verified) params.set("verified", "true");
      else params.delete("verified");
    }
    if (updates.sort !== undefined) {
      params.set("sort", updates.sort);
    }
    router.push(`/vega-financial?${params.toString()}`);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <Filter className="size-4 mr-1" />
          Filter
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className="space-y-6 py-6">
          <div>
            <Label className="text-xs font-medium text-muted-foreground">Risk</Label>
            <div className="flex gap-2 mt-2">
              {["Low", "Medium", "High"].map((r) => (
                <Button
                  key={r}
                  variant={risk === r ? "default" : "outline"}
                  size="sm"
                  onClick={() => setParams({ risk: risk === r ? "" : r })}
                >
                  {r}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <Label className="text-xs font-medium text-muted-foreground">Horizon</Label>
            <div className="flex gap-2 mt-2 flex-wrap">
              {["1M", "3M", "1Y"].map((h) => (
                <Button key={h} variant="outline" size="sm">
                  {h}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="verified"
              checked={verified}
              onChange={(e) => setParams({ verified: e.target.checked })}
              className="rounded border-[rgba(51,51,51,0.18)]"
            />
            <Label htmlFor="verified" className="cursor-pointer text-sm">
              Verified only
            </Label>
          </div>
          <div>
            <Label className="text-xs font-medium text-muted-foreground">Sort by</Label>
            <select
              value={sort}
              onChange={(e) => setParams({ sort: e.target.value })}
              className="w-full mt-2 rounded-lg border border-[rgba(51,51,51,0.18)] bg-background px-3 py-2 text-sm"
            >
              <option value="trending">Trending</option>
              <option value="return">Return</option>
              <option value="drawdown">Lowest drawdown</option>
            </select>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
