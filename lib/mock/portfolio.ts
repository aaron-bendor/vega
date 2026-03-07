export interface MockHolding {
  id: string;
  algorithmId: string;
  name: string;
  allocated: number;
  currentValue: number;
  weight: number;
  returnPct: number;
  tags: string[];
  /** 1–10 risk score for display (optional). */
  riskScore?: number;
}

export interface MockAccount {
  equity: number;
  availableCash: number;
  allocated: number;
  unrealizedPnl: number;
  unrealizedPnlPct: number;
  holdings: MockHolding[];
}

/** Reconciled demo account: equity = availableCash + sum(currentValue); invested = sum(allocated); weight = currentValue/equity*100 (% of portfolio). */
export const MOCK_ACCOUNT: MockAccount = {
  equity: 64_902,
  availableCash: 12_450,
  allocated: 40_000,
  unrealizedPnl: 12_452,
  unrealizedPnlPct: 31.13,
  holdings: [
    {
      id: "h1",
      algorithmId: "demo-1",
      name: "Alpha Momentum Pro",
      allocated: 15_000,
      currentValue: 16_850,
      weight: 25.96,
      returnPct: 12.33,
      tags: ["Momentum", "Equity"],
      riskScore: 5,
    },
    {
      id: "h2",
      algorithmId: "demo-2",
      name: "Trend Tracker",
      allocated: 10_000,
      currentValue: 15_749,
      weight: 24.27,
      returnPct: 57.49,
      tags: ["Trend Following"],
      riskScore: 3,
    },
    {
      id: "h3",
      algorithmId: "demo-3",
      name: "Bollinger Reversion",
      allocated: 15_000,
      currentValue: 19_853,
      weight: 30.61,
      returnPct: 32.35,
      tags: ["Mean Reversion"],
      riskScore: 5,
    },
  ],
};

export const MOCK_ACCOUNT_EMPTY: MockAccount = {
  equity: 10_000,
  availableCash: 10_000,
  allocated: 0,
  unrealizedPnl: 0,
  unrealizedPnlPct: 0,
  holdings: [],
};
