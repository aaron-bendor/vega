import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  getTourStartRequested,
  clearTourStartRequested,
  clearTourForReplay,
  TOUR_START_SESSION_KEY,
  setTourCompleted,
  setTourStep,
} from "./storage";

function makeMockStorage(): Record<string, string> {
  const store: Record<string, string> = {};
  return store;
}

function mockSessionStorage(store: Record<string, string>) {
  return {
    getItem(key: string) {
      return store[key] ?? null;
    },
    setItem(key: string, value: string) {
      store[key] = value;
    },
    removeItem(key: string) {
      delete store[key];
    },
    get length() {
      return Object.keys(store).length;
    },
    key() {
      return null;
    },
    clear() {
      for (const k of Object.keys(store)) delete store[k];
    },
  };
}

function makeMockLocalStorage(): Record<string, string> {
  return {};
}

function mockLocalStorage(store: Record<string, string>) {
  return {
    getItem(key: string) {
      return store[key] ?? null;
    },
    setItem(key: string, value: string) {
      store[key] = value;
    },
    removeItem(key: string) {
      delete store[key];
    },
    get length() {
      return Object.keys(store).length;
    },
    key() {
      return null;
    },
    clear() {
      for (const k of Object.keys(store)) delete store[k];
    },
  };
}

describe("tour storage", () => {
  let sessionStore: Record<string, string>;
  let localStore: Record<string, string>;

  beforeEach(() => {
    sessionStore = makeMockStorage();
    localStore = makeMockLocalStorage();
    vi.stubGlobal("window", {
      sessionStorage: mockSessionStorage(sessionStore),
      localStorage: mockLocalStorage(localStore),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
    vi.stubGlobal("sessionStorage", mockSessionStorage(sessionStore));
    vi.stubGlobal("localStorage", mockLocalStorage(localStore));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("tutorial does not start without explicit action", () => {
    it("getTourStartRequested is false when sessionStorage is empty (e.g. initial load)", () => {
      expect(getTourStartRequested()).toBe(false);
    });

    it("getTourStartRequested is false after refresh (session not set)", () => {
      // Simulate: user never clicked Play Tutorial; refresh doesn't set the key
      expect(getTourStartRequested()).toBe(false);
    });

    it("persisted localStorage state does not set session key", () => {
      setTourCompleted();
      setTourStep(3);
      // clearTourForReplay is only called when user clicks Replay; it doesn't set session key
      clearTourForReplay();
      expect(getTourStartRequested()).toBe(false);
    });
  });

  describe("explicit start and replay", () => {
    it("setting session key makes getTourStartRequested true (simulating Play Tutorial click)", () => {
      sessionStore[TOUR_START_SESSION_KEY] = "1";
      expect(getTourStartRequested()).toBe(true);
    });

    it("clearTourStartRequested clears the flag (tour consumes the request)", () => {
      sessionStore[TOUR_START_SESSION_KEY] = "1";
      clearTourStartRequested();
      expect(getTourStartRequested()).toBe(false);
    });

    it("clearTourForReplay does not set session key (Replay button must set it)", () => {
      clearTourForReplay();
      expect(sessionStore[TOUR_START_SESSION_KEY]).toBeUndefined();
      expect(getTourStartRequested()).toBe(false);
    });
  });
});
