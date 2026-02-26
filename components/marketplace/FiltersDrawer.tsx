"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Filter } from "lucide-react";

export interface FilterState {
  risk: string[];
  verifiedOnly: boolean;
  categories: string[];
  horizon: string;
  maxDrawdown: number | null;
}

interface FiltersDrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  state: FilterState;
  onStateChange: (state: FilterState) => void;
  trigger?: React.ReactNode;
}

const RISK_OPTIONS = ["Low", "Medium", "High"];
const HORIZON_OPTIONS = ["1m", "3m", "1y"];
const CATEGORIES = ["Momentum", "Trend Following", "Mean Reversion", "Low Risk", "Diversifiers", "Risk Managed"];

export function FiltersDrawer({
  open,
  onOpenChange,
  state,
  onStateChange,
  trigger,
}: FiltersDrawerProps) {
  const toggleRisk = (r: string) => {
    const next = state.risk.includes(r) ? state.risk.filter((x) => x !== r) : [...state.risk, r];
    onStateChange({ ...state, risk: next });
  };

  const toggleCategory = (c: string) => {
    const next = state.categories.includes(c)
      ? state.categories.filter((x) => x !== c)
      : [...state.categories, c];
    onStateChange({ ...state, categories: next });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        {trigger ?? (
          <Button variant="outline" size="sm">
            <Filter className="size-4 mr-1" />
            Filter
          </Button>
        )}
      </SheetTrigger>
      <SheetContent side="right" className="w-80">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className="space-y-6 py-6">
          <div>
            <Label className="text-sm font-medium">Risk</Label>
            <div className="flex gap-2 mt-2 flex-wrap">
              {RISK_OPTIONS.map((r) => (
                <Button
                  key={r}
                  variant={state.risk.includes(r) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleRisk(r)}
                >
                  {r}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="verified"
              checked={state.verifiedOnly}
              onChange={(e) =>
                onStateChange({ ...state, verifiedOnly: e.target.checked })
              }
              className="rounded border-input"
            />
            <Label htmlFor="verified">Verified only</Label>
          </div>
          <div>
            <Label className="text-sm font-medium">Category</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {CATEGORIES.map((c) => (
                <Button
                  key={c}
                  variant={state.categories.includes(c) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleCategory(c)}
                >
                  {c}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium">Horizon</Label>
            <div className="flex gap-2 mt-2">
              {HORIZON_OPTIONS.map((h) => (
                <Button
                  key={h}
                  variant={state.horizon === h ? "default" : "outline"}
                  size="sm"
                  onClick={() => onStateChange({ ...state, horizon: h })}
                >
                  {h}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
