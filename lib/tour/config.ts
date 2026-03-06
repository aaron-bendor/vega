/**
 * Vega Financial guided tour — step definitions.
 * Selectors use data-tour attributes for stability when copy changes.
 */

export const TOUR_VERSION = "v1";

export interface TourStepConfig {
  route: string;
  selector: string;
  title?: string;
  body: string;
}

export const TOUR_STEPS: TourStepConfig[] = [
  {
    route: "/vega-financial",
    selector: "[data-tour=\"vf-overview\"]",
    body: "This is a demo portfolio. Values are simulated.",
  },
  {
    route: "/vega-financial",
    selector: "[data-tour=\"vf-tabs\"]",
    body: "Use Marketplace to browse algorithms, Portfolio to track holdings.",
  },
  {
    route: "/vega-financial/marketplace",
    selector: "[data-tour=\"mp-demo-banner\"]",
    body: "Demo mode: simulated performance only. Paper trading only.",
  },
  {
    route: "/vega-financial/marketplace",
    selector: "[data-tour=\"mp-filters\"]",
    body: "Filter by style and risk. Start with Low or Low Risk if you are unsure.",
  },
  {
    route: "/vega-financial/marketplace",
    selector: "[data-tour=\"mp-card-alpha\"]",
    body: "Open an algorithm to see its metrics and run a backtest.",
  },
  {
    route: "/vega-financial/algorithms/demo-1",
    selector: "[data-tour=\"algo-scores\"]",
    body: "These scores summarise risk and behaviour. Hover for definitions.",
  },
  {
    route: "/vega-financial/algorithms/demo-1",
    selector: "[data-tour=\"algo-metrics\"]",
    body: "Key metrics: cumulative return, Sharpe, max drawdown, volatility.",
  },
  {
    route: "/vega-financial/algorithms/demo-1",
    selector: "[data-tour=\"algo-timeframe\"]",
    body: "Switch timeframe to see how performance changes.",
  },
  {
    route: "/vega-financial/algorithms/demo-1",
    selector: "[data-tour=\"algo-run-backtest\"]",
    body: "Run a backtest with configurable parameters. Simulated only.",
  },
  {
    route: "/vega-financial/algorithms/demo-1",
    selector: "[data-tour=\"algo-add-paper\"]",
    body: "Add to your paper portfolio to track allocation.",
  },
  {
    route: "/vega-financial",
    selector: "[data-tour=\"vf-holdings\"]",
    body: "Holdings show value, weight, and return for each algorithm.",
  },
  {
    route: "/vega-financial",
    selector: "",
    body: "You are set. You can replay this tour from Help.",
  },
];

export function getStep(index: number): TourStepConfig | undefined {
  return TOUR_STEPS[index];
}

export function getStepCount(): number {
  return TOUR_STEPS.length;
}
