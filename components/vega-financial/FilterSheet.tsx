"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { useState } from "react";
import { Label } from "@/components/ui/label";

export function FilterSheet() {
  const [risk, setRisk] = useState<string>("");
  const [verified, setVerified] = useState(false);
  const [sort, setSort] = useState("trending");

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
            <Label className="text-sm font-medium">Risk</Label>
            <div className="flex gap-2 mt-2">
              {["Low", "Medium", "High"].map((r) => (
                <Button
                  key={r}
                  variant={risk === r ? "default" : "outline"}
                  size="sm"
                  onClick={() => setRisk(risk === r ? "" : r)}
                >
                  {r}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium">Horizon</Label>
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
              onChange={(e) => setVerified(e.target.checked)}
              className="rounded border-input"
            />
            <Label htmlFor="verified" className="cursor-pointer">
              Verified only
            </Label>
          </div>
          <div>
            <Label className="text-sm font-medium">Sort by</Label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full mt-2 rounded-md border border-input bg-background px-3 py-2 text-sm"
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
