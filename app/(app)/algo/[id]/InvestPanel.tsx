"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function InvestPanel({ versionId }: { versionId: string }) {
  const router = useRouter();
  const [amount, setAmount] = useState(10000);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleInvest() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/invest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ versionId, amount }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to invest");
      }
      router.push("/portfolio");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to invest");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6 pt-4 border-t flex flex-wrap items-center gap-4">
      <Input
        type="number"
        min={100}
        step={1000}
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value) || 10000)}
        className="w-32"
      />
      <Button onClick={handleInvest} disabled={loading}>
        {loading ? "Adding…" : "Add to paper portfolio"}
      </Button>
      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  );
}
