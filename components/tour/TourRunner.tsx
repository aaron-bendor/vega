"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  TOUR_STEPS,
  getStepCount,
} from "@/lib/tour/config";
import {
  getTourCompleted,
  getTourDismissed,
  getTourStep,
  setTourCompleted,
  setTourStep,
  setTourStartedAt,
  setTourDismissed,
  getTourStartRequested,
  clearTourStartRequested,
} from "@/lib/tour/storage";
import {
  waitForSelector,
  createDriverForStep,
  getStepRoute,
} from "@/lib/tour/controller";

/**
 * Renders nothing; runs the guided tour when the current route matches the
 * stored step. Mount in layouts that wrap /vega-financial, /marketplace, and
 * /vega-financial/algorithms/*.
 */
export function TourRunner() {
  const pathname = usePathname();
  const router = useRouter();
  const [step, setStep] = useState(-1);

  // Sync step from storage. Run tour only once (or when explicitly replayed via Help / Profile).
  useEffect(() => {
    // Explicit replay: user clicked "Replay tour" or "Reset tutorial"
    if (getTourStartRequested()) {
      clearTourStartRequested();
      setTourStep(0);
      setTourStartedAt(new Date().toISOString());
      setStep(0);
      return;
    }
    // Already completed or dismissed: don't auto-show again
    if (getTourCompleted() || getTourDismissed()) {
      setStep(-1);
      return;
    }
    // First time or resuming mid-tour
    const stored = getTourStep();
    setStep(stored);
  }, [pathname]);

  // When pathname or step matches a step's route, wait for element and show driver
  useEffect(() => {
    if (typeof window === "undefined" || step < 0 || step >= getStepCount()) return;
    const route = getStepRoute(step);
    if (route !== pathname) return;

    const config = TOUR_STEPS[step];
    const selector = config?.selector ?? "";

    let cancelled = false;
    const run = async () => {
      const el = selector ? await waitForSelector(selector) : null;
      if (cancelled) return;

      const overrides =
        selector && !el
          ? {
              noElement: true,
              body: "This part may not appear in demo mode. Click Next to continue.",
            }
          : undefined;

      const driverObj = createDriverForStep(step, {
        onNext: () => {
          const nextStep = step + 1;
          const total = getStepCount();
          if (nextStep >= total) {
            setTourCompleted();
            setStep(-1);
            return;
          }
          setTourStep(nextStep);
          setStep(nextStep);
          const nextRoute = getStepRoute(nextStep);
          if (nextRoute && nextRoute !== pathname) {
            router.push(nextRoute);
          }
        },
        onPrev: () => {
          const prevStep = Math.max(0, step - 1);
          setTourStep(prevStep);
          setStep(prevStep);
          const prevRoute = getStepRoute(prevStep);
          if (prevRoute && prevRoute !== pathname) {
            router.push(prevRoute);
          }
        },
        onClose: () => {
          setTourDismissed();
          setStep(-1);
        },
      }, overrides);

      if (driverObj && !cancelled) {
        driverObj.drive(0);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [pathname, step, router]);

  return null;
}
