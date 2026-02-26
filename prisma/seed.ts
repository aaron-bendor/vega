import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Tags
  const tagNames = ["Momentum", "Mean Reversion", "Trend Following", "Multi-Asset", "Equity", "Quant"];
  const tags: Record<string, string> = {};
  for (const name of tagNames) {
    const t = await prisma.tag.upsert({ where: { name }, create: { name }, update: {} });
    tags[name] = t.id;
  }

  // Users and developers
  const dev1 = await prisma.user.create({ data: {} });
  const dev2 = await prisma.user.create({ data: {} });
  const dev3 = await prisma.user.create({ data: {} });

  const developer1 = await prisma.developerProfile.create({ data: { userId: dev1.id } });
  const developer2 = await prisma.developerProfile.create({ data: { userId: dev2.id } });
  const developer3 = await prisma.developerProfile.create({ data: { userId: dev3.id } });

  const developers = [developer1, developer2, developer3];

  const algoData = [
    {
      name: "Alpha Momentum Pro",
      shortDesc: "Momentum strategy with adaptive lookback",
      description: "Uses dual moving average crossover with configurable windows.",
      universe: "US equities",
      riskLevel: "Medium",
      tagNames: ["Momentum", "Equity"],
    },
    {
      name: "Trend Tracker",
      shortDesc: "Simple trend-following system",
      description: "Buy and hold with trend filter. Low turnover.",
      universe: "S&P 500",
      riskLevel: "Low",
      tagNames: ["Trend Following", "Equity"],
    },
    {
      name: "Mean Reversion Core",
      shortDesc: "Statistical mean reversion",
      description: "Mean reversion on normalised price deviations.",
      universe: "Large cap US",
      riskLevel: "Medium",
      tagNames: ["Mean Reversion", "Quant"],
    },
    {
      name: "Dual MA Crossover",
      shortDesc: "Fast/slow moving average crossover",
      description: "Classic MA crossover with optional volatility filter.",
      universe: "US equities",
      riskLevel: "High",
      tagNames: ["Momentum", "Trend Following"],
    },
    {
      name: "Balanced Portfolio",
      shortDesc: "Multi-asset allocation",
      description: "Diversified allocation across asset classes.",
      universe: "Global multi-asset",
      riskLevel: "Low",
      tagNames: ["Multi-Asset", "Equity"],
    },
    {
      name: "Volatility Harvest",
      shortDesc: "Volatility-targeted strategy",
      description: "Dynamic position sizing based on realised volatility.",
      universe: "US equities",
      riskLevel: "High",
      tagNames: ["Quant", "Momentum"],
    },
  ];

  const createdAlgos: { id: string; name: string }[] = [];
  for (let i = 0; i < algoData.length; i++) {
    const algo = algoData[i];
    const developer = developers[i % 3];
    const created = await prisma.algorithm.create({
      data: {
        developerId: developer.id,
        name: algo.name,
        shortDesc: algo.shortDesc,
        description: algo.description,
        universe: algo.universe,
        riskLevel: algo.riskLevel,
      },
    });
    createdAlgos.push(created);

    for (const tagName of algo.tagNames) {
      const tagId = tags[tagName];
      if (tagId) {
        await prisma.algorithmTag.create({
          data: { algorithmId: created.id, tagId },
        });
      }
    }
  }

  const verificationStatuses = ["verified", "verified", "pending", "verified", "verified", "pending"];

  for (let i = 0; i < createdAlgos.length; i++) {
    const algo = await prisma.algorithm.findUniqueOrThrow({
      where: { id: createdAlgos[i].id },
      include: { tags: true },
    });
    const data = algoData[i];
    const symbolsByAlgo: string[][] = [
      ["^spx"],
      ["spy.us"],
      ["qqq.us"],
      ["tlt.us"],
      ["gld.us"],
      ["^spx", "tlt.us"],
    ];
    const version = await prisma.algorithmVersion.create({
      data: {
        algorithmId: algo.id,
        name: algo.name,
        shortDesc: data.shortDesc,
        description: data.description,
        universe: data.universe,
        riskLevel: data.riskLevel,
        strategyTemplateId: i % 2 === 0 ? "buy_and_hold" : "ma_crossover",
        parameters: i % 2 === 0 ? {} : { fastWindow: 10, slowWindow: 30 },
        verificationStatus: verificationStatuses[i],
        dataSource: "stooq",
        symbols: symbolsByAlgo[i] ?? ["^spx"],
        startDate: "2019-01-01",
        endDate: "2024-12-31",
        cachedReturn: 0.08 + Math.random() * 0.1,
        cachedSharpe: 0.8 + Math.random() * 0.8,
        cachedMaxDrawdown: -(0.05 + Math.random() * 0.1),
        cachedVolatility: 0.12 + Math.random() * 0.08,
      },
    });

    for (const tagName of data.tagNames) {
      const tagId = tags[tagName];
      if (tagId) {
        await prisma.algorithmVersionTag.create({
          data: { versionId: version.id, tagId },
        });
      }
    }
  }

  const firstVersion = await prisma.algorithmVersion.findFirst();
  if (firstVersion) {
    const seedStr = `seed-${firstVersion.id}-252-buy_and_hold-{}`;
    const backtest = await prisma.backtestRun.create({
      data: {
        versionId: firstVersion.id,
        horizon: 252,
        strategyId: "buy_and_hold",
        parameters: {},
        startingCapital: 10000,
        seed: seedStr,
      },
    });

    const points: { backtestId: string; dayIndex: number; value: number }[] = [];
    let v = 10000;
    for (let d = 0; d < 252; d++) {
      v *= 1 + (Math.sin(d / 50) * 0.001 + 0.0003);
      points.push({ backtestId: backtest.id, dayIndex: d, value: Math.round(v * 100) / 100 });
    }
    await prisma.equityPoint.createMany({ data: points });

    const finalValue = points[points.length - 1]?.value ?? 10000;
    const cumReturn = finalValue / 10000 - 1;
    const returns = points.slice(1).map((p, i) => (p.value / (points[i]?.value ?? p.value)) - 1);
    const meanRet = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((a, r) => a + (r - meanRet) ** 2, 0) / returns.length;
    const vol = Math.sqrt(variance);
    const sharpe = vol > 0 ? (Math.sqrt(252) * meanRet) / vol : 0;
    let peak = 10000;
    let mdd = 0;
    for (const p of points) {
      peak = Math.max(peak, p.value);
      mdd = Math.min(mdd, p.value / peak - 1);
    }

    await prisma.metric.createMany({
      data: [
        { backtestId: backtest.id, key: "cumulativeReturn", value: cumReturn },
        { backtestId: backtest.id, key: "sharpeRatio", value: sharpe },
        { backtestId: backtest.id, key: "maxDrawdown", value: mdd },
        { backtestId: backtest.id, key: "annualisedVolatility", value: vol * Math.sqrt(252) },
      ],
    });
  }

  console.log("Seed completed: 3 developers, 6 algorithms, published versions, tags, metrics.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
