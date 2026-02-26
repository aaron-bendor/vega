import { NextResponse } from "next/server";
import {
  createAlgorithm,
  getOrCreateDemoDeveloper,
  listPublishedVersions,
  listTags,
} from "@/lib/db/algorithms";
import { withDbOrThrow } from "@/lib/db/safe";
import { createAlgorithmSchema } from "@/lib/validation/algorithms";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tag = searchParams.get("tag");
  const risk = searchParams.get("risk");
  const { data: tags } = await withDbOrThrow(() => listTags(), []);
  const tagIds = tag ? tags.filter((t) => t.name === tag).map((t) => t.id) : undefined;
  const { data: versions } = await withDbOrThrow(
    () =>
      listPublishedVersions({
        tagIds,
        riskLevel: risk ?? undefined,
      }),
    []
  );
  return NextResponse.json(versions);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createAlgorithmSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const dev = await getOrCreateDemoDeveloper();
    const allTags = await listTags();
    const tagIds = (parsed.data.tags ?? [])
      .map((n) => allTags.find((t) => t.name === n)?.id)
      .filter((id): id is string => Boolean(id));
    const algo = await createAlgorithm({
      developerId: dev.id,
      name: parsed.data.name,
      shortDesc: parsed.data.description?.slice(0, 200),
      description: parsed.data.description,
      universe: parsed.data.universe,
      riskLevel: parsed.data.riskLevel,
      tagIds: tagIds.length ? tagIds : undefined,
    });
    return NextResponse.json(algo);
  } catch (err) {
    console.error("Create algorithm error:", err);
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
