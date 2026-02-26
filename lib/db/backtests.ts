import { prisma } from "./prisma";

export async function createBacktest(data: {
  versionId: string;
  horizon: number;
  strategyId: string;
  parameters: Record<string, unknown>;
  startingCapital: number;
  seed: string;
  equityPoints: { dayIndex: number; value: number }[];
  metrics: { key: string; value: number }[];
}) {
  const run = await prisma.backtestRun.create({
    data: {
      versionId: data.versionId,
      horizon: data.horizon,
      strategyId: data.strategyId,
      parameters: data.parameters as object,
      startingCapital: data.startingCapital,
      seed: data.seed,
      equityPoints: {
        create: data.equityPoints.map((p) => ({
          dayIndex: p.dayIndex,
          value: p.value,
        })),
      },
      metrics: {
        create: data.metrics.map((m) => ({ key: m.key, value: m.value })),
      },
    },
    include: { metrics: true, equityPoints: { orderBy: { dayIndex: "asc" } } },
  });
  return run;
}

export async function getBacktestById(id: string) {
  return prisma.backtestRun.findUnique({
    where: { id },
    include: { metrics: true, equityPoints: { orderBy: { dayIndex: "asc" } } },
  });
}

export async function getLatestBacktestForVersion(versionId: string) {
  return prisma.backtestRun.findFirst({
    where: { versionId },
    orderBy: { createdAt: "desc" },
    include: { metrics: true, equityPoints: { orderBy: { dayIndex: "asc" } } },
  });
}
