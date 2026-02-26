"use client";

import { AlgoCard } from "./AlgoCard";
import type { MockAlgorithm } from "@/lib/mock/algorithms";

interface CategorySectionProps {
  title: string;
  algorithms: MockAlgorithm[];
}

export function CategorySection({ title, algorithms }: CategorySectionProps) {
  if (!algorithms.length) return null;

  return (
    <section>
      <h3 className="text-sm font-semibold text-muted-foreground mb-3">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {algorithms.map((algo) => (
          <AlgoCard key={algo.id} algo={algo} />
        ))}
      </div>
    </section>
  );
}
