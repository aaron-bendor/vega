import { NextResponse } from "next/server";
import { investSchema } from "@/lib/validation/invest";
import { getOrCreateDemoUser, createInvestment } from "@/lib/db/portfolio";
import { getAlgorithmVersionById } from "@/lib/db/algorithms";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = investSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { versionId, amount } = parsed.data;

    const version = await getAlgorithmVersionById(versionId);
    if (!version) {
      return NextResponse.json(
        { error: "Algorithm version not found" },
        { status: 404 }
      );
    }

    const user = await getOrCreateDemoUser();
    const latestBacktest = await import("@/lib/db/backtests").then((m) =>
      m.getLatestBacktestForVersion(versionId)
    );
    const lastValue = latestBacktest?.equityPoints.at(-1)?.value;
    const pricePerUnit = lastValue && lastValue > 0 ? lastValue : 10000;
    const units = amount / pricePerUnit;

    const investment = await createInvestment({
      userId: user.id,
      versionId,
      amount,
      units,
    });
    return NextResponse.json(investment);
  } catch (err) {
    console.error("Invest error:", err);
    return NextResponse.json({ error: "Failed to invest" }, { status: 500 });
  }
}
