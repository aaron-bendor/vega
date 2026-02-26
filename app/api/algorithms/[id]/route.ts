import { NextResponse } from "next/server";
import {
  getAlgorithmById,
  listTags,
  updateAlgorithm,
} from "@/lib/db/algorithms";
import { updateAlgorithmSchema } from "@/lib/validation/algorithms";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const algo = await getAlgorithmById(params.id);
  if (!algo) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(algo);
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const parsed = updateAlgorithmSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const allTags = await listTags();
    const tagIds =
      parsed.data.tags !== undefined
        ? (parsed.data.tags ?? [])
            .map((n: string) => allTags.find((t) => t.name === n)?.id)
            .filter((id: string | undefined): id is string => Boolean(id))
        : undefined;
    const data: Parameters<typeof updateAlgorithm>[1] = {};
    if (parsed.data.name !== undefined) data.name = parsed.data.name;
    if (parsed.data.description !== undefined) {
      data.description = parsed.data.description;
      data.shortDesc = parsed.data.description?.slice(0, 200);
    }
    if (parsed.data.universe !== undefined) data.universe = parsed.data.universe;
    if (parsed.data.riskLevel !== undefined)
      data.riskLevel = parsed.data.riskLevel;
    if (tagIds !== undefined) data.tagIds = tagIds;
    const algo = await updateAlgorithm(params.id, data);
    return NextResponse.json(algo);
  } catch (err) {
    console.error("Update algorithm error:", err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
