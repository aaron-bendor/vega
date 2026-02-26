import { NextResponse } from "next/server";
import { getStooqBars } from "@/lib/marketdata/providers/stooq";
import { z } from "zod";

const prefetchSchema = z.object({
  symbols: z.array(z.string()).min(1).max(10),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = prefetchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { symbols, startDate, endDate } = parsed.data;

    const results: { symbol: string; bars: number; error?: string }[] = [];

    for (const symbol of symbols) {
      try {
        const bars = await getStooqBars(symbol, startDate, endDate);
        results.push({ symbol, bars: bars.length });
      } catch (err) {
        results.push({
          symbol,
          bars: 0,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }

    return NextResponse.json({
      success: true,
      results,
      message: `Downloaded ${results.filter((r) => r.bars > 0).length}/${symbols.length} symbols`,
    });
  } catch (err) {
    console.error("Prefetch error:", err);
    return NextResponse.json(
      { error: "Prefetch failed" },
      { status: 500 }
    );
  }
}
