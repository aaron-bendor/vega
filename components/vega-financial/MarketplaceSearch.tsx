"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function MarketplaceSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const input = form.querySelector<HTMLInputElement>("input[name=q]");
        const val = input?.value?.trim() ?? "";
        const params = new URLSearchParams(searchParams.toString());
        if (val) params.set("q", val);
        else params.delete("q");
        router.push(`/vega-financial?${params.toString()}`);
      }}
      className="relative"
    >
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
      <Input
        name="q"
        type="search"
        placeholder="Search algorithms..."
        defaultValue={q}
        className="pl-9 w-full max-w-sm"
        aria-label="Search algorithms"
      />
    </form>
  );
}
