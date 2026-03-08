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
    body: "Filter by style and risk. If you are unsure, start with Low risk.",
  },
  {
    route: "/vega-financial/marketplace",
    selector: "[data-tour=\"mp-card-alpha\"]",
    body: "Open a strategy to see its metrics and try an allocation in your paper portfolio.",
  },
  {
    route: "/vega-financial",
    selector: "[data-tour=\"vf-holdings\"]",
    body: "Holdings show value, weight, and return for each algorithm.",
  },
  {
    route: "/vega-financial",
    selector: "",
    body: "You are set. You can replay this tutorial from Settings.",
  },
];

export function getStep(index: number): TourStepConfig | undefined {
  return TOUR_STEPS[index];
}

export function getStepCount(): number {
  return TOUR_STEPS.length;
}
