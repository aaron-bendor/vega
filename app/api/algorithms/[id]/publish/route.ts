import { NextResponse } from "next/server";
import { getAlgorithmById, publishAlgorithm } from "@/lib/db/algorithms";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const strategyTemplateId =
      (body.strategyTemplateId as string) || "buyAndHold";
    const parameters = (body.parameters as Record<string, unknown>) ?? {};

    const algo = await getAlgorithmById(id);
    if (!algo) {
      return NextResponse.json({ error: "Algorithm not found" }, { status: 404 });
    }

    const version = await publishAlgorithm(
      id,
      strategyTemplateId,
      parameters
    );
    return NextResponse.json(version);
  } catch (err) {
    console.error("Publish error:", err);
    return NextResponse.json({ error: "Failed to publish" }, { status: 500 });
  }
}
