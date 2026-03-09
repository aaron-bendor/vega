/**
 * Tour progress persisted in localStorage (versioned).
 */

import { TOUR_VERSION } from "./config";

const KEY_COMPLETED = `vega_tour_${TOUR_VERSION}_completed`;
const KEY_STEP = `vega_tour_${TOUR_VERSION}_step`;
const KEY_STARTED_AT = `vega_tour_${TOUR_VERSION}_startedAt`;
const KEY_DISMISSED = `vega_tour_${TOUR_VERSION}_dismissed`;

/** Session-only: set by "Get Started" to start tour on next VF load. */
export const TOUR_START_SESSION_KEY = "vega_tour_start";

/** Custom event dispatched when "Replay tutorial" is clicked on the same page so the tour starts without navigation. */
export const TOUR_REPLAY_EVENT = "vega_tour_replay";

export function getTourCompleted(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(KEY_COMPLETED) === "1";
}

export function setTourCompleted(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY_COMPLETED, "1");
  localStorage.removeItem(KEY_STEP);
  localStorage.removeItem(KEY_STARTED_AT);
}

export function getTourStep(): number {
  if (typeof window === "undefined") return 0;
  const v = localStorage.getItem(KEY_STEP);
  const n = v ? parseInt(v, 10) : 0;
  return Number.isNaN(n) ? 0 : Math.max(0, n);
}

export function setTourStep(step: number): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY_STEP, String(step));
}

export function getTourStartedAt(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(KEY_STARTED_AT);
}

export function setTourStartedAt(iso: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY_STARTED_AT, iso);
}

export function getTourDismissed(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(KEY_DISMISSED) === "1";
}

export function setTourDismissed(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY_DISMISSED, "1");
}

export function getTourStartRequested(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(TOUR_START_SESSION_KEY) === "1";
}

export function clearTourStartRequested(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(TOUR_START_SESSION_KEY);
}

/** Clear completed and step so tour can run again (Replay). */
export function clearTourForReplay(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY_COMPLETED);
  localStorage.removeItem(KEY_STEP);
  localStorage.removeItem(KEY_STARTED_AT);
  localStorage.removeItem(KEY_DISMISSED);
}
