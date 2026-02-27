"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "vega-risk-disclosure-accepted";

export function getRiskDisclosureAccepted(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function setRiskDisclosureAccepted(): void {
  try {
    localStorage.setItem(STORAGE_KEY, "true");
  } catch {
    // ignore
  }
}

interface RiskDisclosureModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept: () => void;
}

export function RiskDisclosureModal({
  open,
  onOpenChange,
  onAccept,
}: RiskDisclosureModalProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  function handleAccept() {
    if (mounted) setRiskDisclosureAccepted();
    onAccept();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Risk disclosure</DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                This is a <strong className="text-foreground">university prototype</strong>.
                All allocations are paper-only. No real money is invested.
              </p>
              <p>
                If this were a real product offering performance-indexed or tokenised
                instruments in the UK, you should be aware that such assets can be
                <strong className="text-foreground"> largely unregulated</strong>. The
                Financial Services Compensation Scheme (FSCS) may not cover you in the same
                way as for regulated investment products. Do not assume FSCS protection.
              </p>
              <p>
                Past performance does not guarantee future results. You could lose some or
                all of any capital you allocate. This is not investment advice.
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAccept}>
            I understand
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
