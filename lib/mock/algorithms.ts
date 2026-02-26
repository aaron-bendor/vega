/**
 * Mock algorithm type for marketplace UI components (AlgoCard, CategorySection).
 */

export interface MockAlgorithm {
  id: string;
  name: string;
  shortDesc: string;
  tags: string[];
  riskLevel: string;
  verified?: boolean;
  sparkline: number[];
  return: number;
  maxDrawdown: number;
  sharpe: number;
  volatility: number;
  correlationToBenchmark: number;
}
