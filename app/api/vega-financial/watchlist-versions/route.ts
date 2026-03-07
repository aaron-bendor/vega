import { NextResponse } from "next/server";
import { getAlgorithmVersionById } from "@/lib/db/algorithms";
import { loadDemoAlgorithms } from "@/lib/demo/loader";
import { withDbOrThrow } from "@/lib/db/safe";

/**
 * GET ?ids=id1,id2 — returns minimal version/strategy info for watchlist display.
 * Uses DB when available, falls back to demo algorithms for demo ids.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const idsParam = searchParams.get("ids");
  const ids = idsParam ? idsParam.split(",").map((s) => s.trim()).filter(Boolean) : [];
  if (ids.length === 0) {
    return NextResponse.json([]);
  }

  const demoAlgos = loadDemoAlgorithms();
  const results: { id: string; name: string; shortDesc: string; riskLevel: string; role?: string }[] = [];

  for (const id of ids) {
    const fromDemo = demoAlgos.find((a) => a.id === id);
    if (fromDemo) {
      const role =
        (fromDemo as { category?: string }).category === "diversifier"
          ? "Diversifier"
          : (fromDemo as { category?: string }).category === "defensive"
            ? "Defensive"
            : "Growth";
      results.push({
        id: fromDemo.id,
        name: fromDemo.name,
        shortDesc: fromDemo.shortDesc,
        riskLevel: fromDemo.riskLevel ?? "—",
        role,
      });
      continue;
    }
    try {
      const { data: version } = await withDbOrThrow(() => getAlgorithmVersionById(id), null);
      if (version) {
        results.push({
          id: version.id,
          name: version.name,
          shortDesc: version.shortDesc ?? "",
          riskLevel: version.riskLevel ?? "—",
        });
      }
    } catch {
      // Skip when DB unavailable or version not found
    }
  }

  return NextResponse.json(results);
}
