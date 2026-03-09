"use client";

import { useState, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import { RunBacktestPanel } from "@/app/(app)/algo/[id]/RunBacktestPanel";

const RISK_LEVELS = ["Low", "Medium", "High"];
const TAGS = ["Momentum", "Mean Reversion", "Trend Following", "Multi-Asset", "Equity"];

type Algorithm = {
  id: string;
  name: string;
  shortDesc: string | null;
  description: string | null;
  universe: string | null;
  riskLevel: string | null;
  tags: { tag: { id: string; name: string } }[];
  versions: { id: string; publishedAt: Date; verificationStatus: string | null }[];
};

export function DeveloperAlgorithmEditor({ algorithm }: { algorithm: Algorithm }) {
  const [name, setName] = useState(algorithm.name);
  const [description, setDescription] = useState(algorithm.description ?? "");
  const [universe, setUniverse] = useState(algorithm.universe ?? "");
  const [riskLevel, setRiskLevel] = useState(algorithm.riskLevel ?? "");
  const [tags, setTags] = useState<string[]>(
    algorithm.tags.map((t) => t.tag.name)
  );
  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [algo, setAlgo] = useState(algorithm);

  useEffect(() => {
    setAlgo(algorithm);
    setName(algorithm.name);
    setDescription(algorithm.description ?? "");
    setUniverse(algorithm.universe ?? "");
    setRiskLevel(algorithm.riskLevel ?? "");
    setTags(algorithm.tags.map((t) => t.tag.name));
  }, [algorithm]);

  async function handleSave() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/algorithms/${algo.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description: description || undefined,
          universe: universe || undefined,
          riskLevel: riskLevel || undefined,
          tags,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to update");
      }
      const updated = await res.json();
      setAlgo(updated);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update");
    } finally {
      setLoading(false);
    }
  }

  async function handlePublish() {
    setPublishing(true);
    setError(null);
    try {
      const res = await fetch(`/api/algorithms/${algo.id}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          strategyTemplateId: "buyAndHold",
          parameters: {},
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to publish");
      }
      await res.json();
      window.location.href = `/developer/algorithms/${algo.id}`;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to publish");
    } finally {
      setPublishing(false);
    }
  }

  function toggleTag(tag: string) {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Edit draft</CardTitle>
          <CardDescription>
            Update metadata. Published versions are immutable.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={200}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Description</label>
            <textarea
              className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={2000}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Universe</label>
            <Input
              value={universe}
              onChange={(e) => setUniverse(e.target.value)}
              maxLength={500}
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
          {error && <p className="text-destructive text-sm">{error}</p>}
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving…" : "Save draft"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preview backtest</CardTitle>
          <CardDescription>
            Run a backtest to preview results before publishing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RunBacktestPanel
            versionId={algo.id}
            preview
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Published versions</CardTitle>
          <CardDescription>
            Published versions are immutable and appear in the marketplace.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {algo.versions.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No published versions yet.
            </p>
          ) : (
            <ul className="space-y-2">
              {algo.versions.map((v) => (
                <li
                  key={v.id}
                  className="flex items-center justify-between py-2 border-b"
                >
                  <div>
                    <Link
                      href={`/vega-financial/algorithms/${v.id}`}
                      className="font-medium hover:underline"
                    >
                      View in Explore
                    </Link>
                    <span className="text-muted-foreground text-sm ml-2">
                      {new Date(v.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <Badge variant="outline">{v.verificationStatus ?? "pending"}</Badge>
                </li>
              ))}
            </ul>
          )}
          <Button
            onClick={handlePublish}
            disabled={publishing}
          >
            {publishing ? "Publishing…" : "Publish new version"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
