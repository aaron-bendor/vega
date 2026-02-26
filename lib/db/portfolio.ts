import { prisma } from "./prisma";

export async function getOrCreateDemoUser() {
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({ data: {} });
  }
  return user;
}

export async function getInvestmentsForUser(userId?: string) {
  const id = userId ?? (await getOrCreateDemoUser()).id;
  return prisma.investment.findMany({
    where: { userId: id },
    include: { version: { include: { tags: { include: { tag: true } } } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function createInvestment(data: {
  userId: string;
  versionId: string;
  amount: number;
  units: number;
}) {
  return prisma.investment.create({
    data,
    include: { version: true },
  });
}
