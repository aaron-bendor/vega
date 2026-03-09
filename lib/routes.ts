/**
 * Canonical investor and app routes. Use these constants everywhere so nav labels,
 * links, and README stay aligned with the live nested structure.
 */

export const ROUTES = {
  /** Investor app (vega-financial) */
  vegaFinancial: {
    root: "/vega-financial",
    marketplace: "/vega-financial/marketplace",
    portfolio: "/vega-financial/portfolio",
    watchlist: "/vega-financial/watchlist",
    activity: "/vega-financial/activity",
    learn: "/vega-financial/learn",
    profile: "/vega-financial/profile",
    compare: "/vega-financial/compare",
    algorithm: (id: string) => `/vega-financial/algorithms/${id}`,
    developer: (slug: string) => `/vega-financial/developers/${slug}`,
  },
  /** Developer platform */
  vegaDeveloper: "/vega-developer",
} as const;

/** All canonical investor paths (for tests and redirects). */
export const VEGA_FINANCIAL_PATHS = [
  ROUTES.vegaFinancial.root,
  ROUTES.vegaFinancial.marketplace,
  ROUTES.vegaFinancial.portfolio,
  ROUTES.vegaFinancial.watchlist,
  ROUTES.vegaFinancial.activity,
  ROUTES.vegaFinancial.learn,
  ROUTES.vegaFinancial.profile,
  ROUTES.vegaFinancial.compare,
] as const;

/** Nav label for the profile/settings page (route is profile; UI says Profile). */
export const PROFILE_NAV_LABEL = "Profile";

/** All investor nav hrefs (sidebar + bottom nav). Used by tests to assert canonical routes only. */
export const INVESTOR_NAV_HREFS = [
  ROUTES.vegaFinancial.root,
  ROUTES.vegaFinancial.marketplace,
  ROUTES.vegaFinancial.portfolio,
  ROUTES.vegaFinancial.activity,
  ROUTES.vegaFinancial.learn,
  ROUTES.vegaFinancial.profile,
] as const;
