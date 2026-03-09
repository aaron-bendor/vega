"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { Driver } from "driver.js";
import {
  TOUR_STEPS,
  getStepCount,
} from "@/lib/tour/config";
import {
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
  const driverRef = useRef<Driver | null>(null);

  // Sync step from storage. Only run when user explicitly started (or replayed) this session — never auto-start or resume on invest page load.
  useEffect(() => {
    // Explicit start: user clicked "Start tutorial" or "Replay tour" or "Reset tutorial"
    if (getTourStartRequested()) {
      clearTourStartRequested();
      setTourStep(0);
      setTourStartedAt(new Date().toISOString());
      setStep(0);
      return;
    }
    // Do not run tour unless user requested it this session (no resume from localStorage on page load)
    setStep(-1);
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

      const driverObj = createDriverForStep(step, getStepCount(), {
        onNext: () => {
          const nextStep = step + 1;
          const total = getStepCount();
          if (nextStep >= total) {
            setTourCompleted();
            setStep(-1);
            driverRef.current = null;
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
          driverRef.current = null;
        },
      }, overrides);

      if (driverObj && !cancelled) {
        driverRef.current = driverObj;
        driverObj.drive(0);
      }
    };

    run();
    return () => {
      cancelled = true;
      if (driverRef.current) {
        try {
          driverRef.current.destroy();
        } catch {
          // ignore
        }
        driverRef.current = null;
      }
    };
  }, [pathname, step, router]);

  return null;
}
