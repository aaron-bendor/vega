"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const RISK_LEVELS = ["Low", "Medium", "High"];
const TAGS = ["Momentum", "Mean Reversion", "Trend Following", "Multi-Asset", "Equity", "Quant"];

export default function NewAlgorithmPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [universe, setUniverse] = useState("");
  const [riskLevel, setRiskLevel] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/algorithms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description: description || undefined,
          universe: universe || undefined,
          riskLevel: riskLevel || undefined,
          tags: tags.length ? tags : undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to create");
      }
      const algo = await res.json();
      router.push(`/developer/algorithms/${algo.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create");
    } finally {
      setLoading(false);
    }
  }

  function toggleTag(tag: string) {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/developer"
        className="text-sm text-muted-foreground hover:underline mb-6 block"
      >
        ← Back to developer portal
      </Link>
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Create draft listing</CardTitle>
          <CardDescription>
            Create a new algorithm draft. You can run preview backtests and
            publish when ready.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={200}
                placeholder="e.g. Alpha Momentum Pro"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Description</label>
              <textarea
                className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={2000}
                placeholder="Describe your strategy..."
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Universe</label>
              <Input
                value={universe}
                onChange={(e) => setUniverse(e.target.value)}
                maxLength={500}
                placeholder="e.g. US equities"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Risk level</label>
              <Select value={riskLevel} onValueChange={setRiskLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  {RISK_LEVELS.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Tags</label>
              <div className="flex flex-wrap gap-2">
                {TAGS.map((tag) => (
                  <Button
                    key={tag}
                    type="button"
                    variant={tags.includes(tag) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>
            {error && (
              <p className="text-destructive text-sm">{error}</p>
            )}
            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Creating…" : "Create draft"}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/developer">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
