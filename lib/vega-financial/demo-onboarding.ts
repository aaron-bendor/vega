/**
 * Demo onboarding state — first-run welcome banner and optional behaviour tracking.
 * Centralised keys so components do not duplicate localStorage usage.
 */

const KEY_WELCOME_BANNER_DISMISSED = "vega_demo_welcome_banner_dismissed";
const KEY_BEHAVIOUR_EVENTS = "vega_demo_behaviour_events";

export type DemoBehaviourEvent =
  | "tutorial_started"
  | "tutorial_skipped"
  | "explore_opened"
  | "learn_opened"
  | "watchlist_item_added"
  | "settings_opened"
  | "reset_demo_clicked";

export function isWelcomeBannerDismissed(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(KEY_WELCOME_BANNER_DISMISSED) === "1";
}

export function setWelcomeBannerDismissed(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY_WELCOME_BANNER_DISMISSED, "1");
}

export function clearWelcomeBannerDismissed(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY_WELCOME_BANNER_DISMISSED);
}

/** Call when user restores first-run experience (e.g. from Settings). */
export function restoreFirstRunExperience(): void {
  clearWelcomeBannerDismissed();
}

/** Record a behaviour event for optional local copy adaptation. No analytics sent. */
export function recordDemoEvent(event: DemoBehaviourEvent): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(KEY_BEHAVIOUR_EVENTS);
    const list: { event: DemoBehaviourEvent; at: string }[] = raw ? JSON.parse(raw) : [];
    list.push({ event, at: new Date().toISOString() });
    // Keep last 50 for lightweight use
    const trimmed = list.slice(-50);
    localStorage.setItem(KEY_BEHAVIOUR_EVENTS, JSON.stringify(trimmed));
  } catch {
    // ignore
  }
}

/** Count how many times an event occurred (for behaviour-aware prompts). */
export function getDemoEventCount(event: DemoBehaviourEvent): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem(KEY_BEHAVIOUR_EVENTS);
    const list: { event: DemoBehaviourEvent }[] = raw ? JSON.parse(raw) : [];
    return list.filter((e) => e.event === event).length;
  } catch {
    return 0;
  }
}
