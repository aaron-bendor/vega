import { NextResponse } from "next/server";
import { listCachedFiles } from "@/lib/marketdata/providers/stooq";

export async function GET() {
  try {
    const cached = listCachedFiles();
    return NextResponse.json({
      cached: cached.map((c) => ({
        symbol: c.symbol,
        startDate: `${c.d1.slice(0, 4)}-${c.d1.slice(4, 6)}-${c.d1.slice(6, 8)}`,
        endDate: `${c.d2.slice(0, 4)}-${c.d2.slice(4, 6)}-${c.d2.slice(6, 8)}`,
        bars: c.bars,
        lastUpdated: c.lastUpdated,
      })),
    });
  } catch (err) {
    console.error("Data status error:", err);
    return NextResponse.json(
      { error: "Failed to list cache" },
      { status: 500 }
    );
  }
}
