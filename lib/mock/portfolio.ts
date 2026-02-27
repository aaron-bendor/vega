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

export const MOCK_ACCOUNT: MockAccount = {
  equity: 52_450,
  availableCash: 12_450,
  allocated: 40_000,
  unrealizedPnl: 2_450,
  unrealizedPnlPct: 6.53,
  holdings: [
    {
      id: "h1",
      algorithmId: "demo-1",
      name: "Alpha Momentum Pro",
      allocated: 15_000,
      currentValue: 16_850,
      weight: 32.1,
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
      weight: 30.0,
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
      weight: 37.8,
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
