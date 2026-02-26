import type { Prisma } from "@prisma/client";
import { prisma } from "./prisma";

export async function listTags() {
  return prisma.tag.findMany({ orderBy: { name: "asc" } });
}

export async function listPublishedVersions(filters?: {
  tagIds?: string[];
  riskLevel?: string;
  horizon?: number;
}) {
  const where: Prisma.AlgorithmVersionWhereInput = {};

  if (filters?.tagIds?.length) {
    where.tags = { some: { tagId: { in: filters.tagIds } } };
  }
  if (filters?.riskLevel) {
    where.riskLevel = filters.riskLevel;
  }

  return prisma.algorithmVersion.findMany({
    where,
    include: { tags: { include: { tag: true } } },
    orderBy: { publishedAt: "desc" },
  });
}

export async function getAlgorithmById(id: string) {
  return prisma.algorithm.findUnique({
    where: { id },
    include: { tags: { include: { tag: true } }, versions: true },
  });
}

export async function getAlgorithmVersionById(id: string) {
  return prisma.algorithmVersion.findUnique({
    where: { id },
    include: { tags: { include: { tag: true } } },
  });
}

export async function createAlgorithm(data: {
  developerId: string;
  name: string;
  shortDesc?: string;
  description?: string;
  universe?: string;
  riskLevel?: string;
  tagIds?: string[];
}) {
  const { tagIds, ...rest } = data;
  const algo = await prisma.algorithm.create({
    data: {
      ...rest,
      tags: tagIds?.length
        ? { create: tagIds.map((tagId) => ({ tagId })) }
        : undefined,
    },
    include: { tags: { include: { tag: true } } },
  });
  return algo;
}

export async function updateAlgorithm(
  id: string,
  data: {
    name?: string;
    shortDesc?: string | null;
    description?: string | null;
    universe?: string | null;
    riskLevel?: string | null;
    tagIds?: string[];
  }
) {
  const { tagIds, ...rest } = data;
  if (tagIds !== undefined) {
    await prisma.algorithmTag.deleteMany({ where: { algorithmId: id } });
    if (tagIds.length > 0) {
      await prisma.algorithmTag.createMany({
        data: tagIds.map((tagId) => ({ algorithmId: id, tagId })),
      });
    }
  }
  return prisma.algorithm.update({
    where: { id },
    data: rest,
    include: { tags: { include: { tag: true } } },
  });
}

export async function publishAlgorithm(
  algorithmId: string,
  strategyTemplateId: string,
  parameters: Record<string, unknown>
) {
  const algo = await prisma.algorithm.findUniqueOrThrow({
    where: { id: algorithmId },
    include: { tags: true },
  });
  const version = await prisma.algorithmVersion.create({
    data: {
      algorithmId,
      name: algo.name,
      shortDesc: algo.shortDesc ?? undefined,
      description: algo.description ?? undefined,
      universe: algo.universe ?? undefined,
      riskLevel: algo.riskLevel ?? undefined,
      strategyTemplateId,
      parameters: parameters as object,
      verificationStatus: "pending",
      tags: {
        create: algo.tags.map((t) => ({ tagId: t.tagId })),
      },
    },
    include: { tags: { include: { tag: true } } },
  });
  return version;
}

export async function getOrCreateDemoDeveloper() {
  let dev = await prisma.developerProfile.findFirst();
  if (!dev) {
    const user = await prisma.user.create({ data: {} });
    dev = await prisma.developerProfile.create({ data: { userId: user.id } });
  }
  return dev;
}

export async function listAlgorithmsForDeveloper(developerId: string) {
  return prisma.algorithm.findMany({
    where: { developerId },
    include: {
      tags: { include: { tag: true } },
      versions: { orderBy: { publishedAt: "desc" } },
    },
  });
}
