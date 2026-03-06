/**
 * Tour controller: wait for elements and run driver.js for a single step.
 * Multi-page navigation is handled by the React layer (TourRunner).
 */

import { driver, type Driver, type DriveStep } from "driver.js";
import "driver.js/dist/driver.css";
import { getStep, type TourStepConfig } from "./config";

const POLL_MS = 100;
const WAIT_MAX_MS = 3000;

export function waitForSelector(
  selector: string,
  maxMs: number = WAIT_MAX_MS
): Promise<Element | null> {
  if (!selector) return Promise.resolve(null);
  return new Promise((resolve) => {
    const el = document.querySelector(selector);
    if (el) {
      resolve(el);
      return;
    }
    const deadline = Date.now() + maxMs;
    const t = setInterval(() => {
      const e = document.querySelector(selector);
      if (e) {
        clearInterval(t);
        resolve(e);
        return;
      }
      if (Date.now() >= deadline) {
        clearInterval(t);
        console.warn("[Vega tour] Element not found:", selector);
        resolve(null);
      }
    }, POLL_MS);
  });
}

export function createDriverForStep(
  stepIndex: number,
  callbacks: {
    onNext: () => void;
    onPrev: () => void;
    onClose: () => void;
  }
): Driver | null {
  const config = getStep(stepIndex);
  if (!config) return null;

  const driverRef: { current: Driver | null } = { current: null };

  const step: DriveStep = {
    ...(config.selector ? { element: config.selector } : {}),
    popover: {
      description: config.body,
      showButtons: ["previous", "next", "close"],
      onNextClick: () => {
        driverRef.current?.destroy();
        callbacks.onNext();
      },
      onPrevClick: () => {
        driverRef.current?.destroy();
        callbacks.onPrev();
      },
      onCloseClick: () => {
        driverRef.current?.destroy();
        callbacks.onClose();
      },
    },
  };

  const driverObj = driver({
    showProgress: true,
    progressText: "{{current}} of {{total}}",
    steps: [step],
    nextBtnText: "Next",
    prevBtnText: "Back",
    doneBtnText: "Done",
  });

  driverRef.current = driverObj;
  return driverObj;
}

export function getStepRoute(index: number): string | undefined {
  return getStep(index)?.route;
}

export function getStepSelector(index: number): string | undefined {
  return getStep(index)?.selector;
}

export { getStep, type TourStepConfig };
