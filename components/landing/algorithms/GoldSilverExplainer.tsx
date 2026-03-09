"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ─────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────
const N = 120;
const AVG = 80;
const TRIGGER = 90;
const REVEAL_SPEED = 50; // ms per point

// Step ranges:
// Step ranges defined in goldSilverStepLogic.ts (0–50, 51, 52–87, 88–N-1).

// Pause at idx=51: 4000ms total. Signal anno at 51, trade anno at 2000ms, then resume at 4000ms.
const SIGNAL_PAUSE_MS = 4000;
const TRADE_ANNO_AT_MS = 2000;

const STEP_TITLES = [
  "Watching the ratio, 24/7",
  "Signal: trigger line crossed",
  "Trade placed — automatically",
  "Ratio normalises — profit taken",
];

// Step/progress helpers (testable in goldSilverStepLogic.test.ts)
import { getStepForIndex, getStepSnapshot } from "./goldSilverStepLogic";
export { getStepForIndex, getStepSnapshot };

// ─────────────────────────────────────────
// PLAYBACK STATE MACHINE
// ─────────────────────────────────────────
// mode:    idle → (play) → playing → (pause) → paused → (play) → playing
//         playing → (reach end) → completed → (replay) → playing
//         playing | paused → (reset | step click) → idle (or snapped to step)
// phase:   "reveal" = advancing point-by-point; "signal-pause" = waiting 4s at index 51
// We never run more than one active loop (one RAF chain). All timers/RAF cancelled on pause, reset, step jump, unmount.

type PlaybackMode = "idle" | "playing" | "paused" | "completed";
type Phase = "reveal" | "signal-pause";

export interface AnimationState {
  mode: PlaybackMode;
  revealedTo: number;
  currentStep: number;
  showTradeAnno: boolean;
  phase: Phase;
  phaseStartTime: number;
  /** When pausing during signal-pause, ms already spent so resume can continue from correct point. */
  signalPauseElapsedMs: number;
}

function getInitialAnimationState(): AnimationState {
  return {
    mode: "idle",
    revealedTo: 0,
    currentStep: 0,
    showTradeAnno: false,
    phase: "reveal",
    phaseStartTime: 0,
    signalPauseElapsedMs: 0,
  };
}

// ─────────────────────────────────────────
// BUILD DATA ONCE (module-level, never recreated)
// ─────────────────────────────────────────
const ALL_DATA = (() => {
  let seed = 42;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) & 0xffffffff;
    return (seed >>> 0) / 0xffffffff;
  };
  const pts: { idx: number; ratio: number }[] = [];
  for (let i = 0; i < N; i++) {
    let ratio: number;
    if (i < 30) ratio = AVG + Math.sin(i * 0.6) * 3.5 + (rand() - 0.5) * 2;
    else if (i < 60) ratio = AVG + ((i - 30) / 29) * 14 + Math.sin(i * 0.5) * 1.5 + (rand() - 0.5) * 1.8;
    else if (i === 60) ratio = 93.8;
    else if (i < 90) ratio = 93.8 - ((i - 61) / 28) * 14.5 + (rand() - 0.5) * 1.8;
    else ratio = AVG + (rand() - 0.5) * 2.8;
    pts.push({ idx: i, ratio: +ratio.toFixed(2) });
  }
  return pts;
})();

const LABELS = ALL_DATA.map((_, i) => {
  const d = new Date(2024, 8, 1);
  d.setDate(d.getDate() + i);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
});

// ─────────────────────────────────────────
// CANVAS CHART (pure: render only from arguments)
// skipCanvasLabels: on small screens we draw labels/legend in HTML instead of tiny canvas text
// ─────────────────────────────────────────
function drawChart(
  canvas: HTMLCanvasElement | null,
  revealedTo: number,
  hoverIdx: number | null,
  _currentStep: number,
  showTradeAnno: boolean,
  options?: { skipCanvasLabels?: boolean; leftPad?: number }
) {
  if (!canvas) return;
  const skipLabels = options?.skipCanvasLabels ?? false;
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.offsetWidth;
  const H = canvas.offsetHeight;

  if (canvas.width !== W * dpr || canvas.height !== H * dpr) {
    canvas.width = W * dpr;
    canvas.height = H * dpr;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, W, H);

  const leftPad = options?.leftPad ?? 48;
  const PAD = { top: 40, right: skipLabels ? 24 : 90, bottom: 24, left: leftPad };
  const cW = W - PAD.left - PAD.right;
  const cH = H - PAD.top - PAD.bottom;
  const minR = 70,
    maxR = 100;

  const toX = (i: number) => PAD.left + (i / (N - 1)) * cW;
  const toY = (val: number) => PAD.top + (1 - (val - minR) / (maxR - minR)) * cH;

  ctx.strokeStyle = "rgba(255,255,255,0.04)";
  ctx.lineWidth = 1;
  ctx.setLineDash([]);
  [75, 80, 85, 90, 95].forEach((v) => {
    ctx.beginPath();
    ctx.moveTo(PAD.left, toY(v));
    ctx.lineTo(W - PAD.right, toY(v));
    ctx.stroke();
  });

  if (!skipLabels) {
    ctx.fillStyle = "#374151";
    ctx.font = "11px monospace";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    [75, 80, 85, 90, 95].forEach((v) => {
      ctx.fillText(String(v), PAD.left - 8, toY(v));
    });
  }

  ctx.save();
  ctx.strokeStyle = "rgba(167,139,250,0.45)";
  ctx.lineWidth = 1.5;
  ctx.setLineDash([6, 4]);
  ctx.beginPath();
  ctx.moveTo(PAD.left, toY(AVG));
  ctx.lineTo(W - PAD.right, toY(AVG));
  ctx.stroke();

  ctx.strokeStyle = "rgba(52,211,153,0.4)";
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.moveTo(PAD.left, toY(TRIGGER));
  ctx.lineTo(W - PAD.right, toY(TRIGGER));
  ctx.stroke();
  ctx.restore();

  if (!skipLabels) {
    ctx.save();
    ctx.font = "10px monospace";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(167,139,250,0.6)";
    ctx.fillText("avg 80", W - PAD.right + 6, toY(AVG));
    ctx.fillStyle = "rgba(52,211,153,0.55)";
    ctx.fillText("trigger 90", W - PAD.right + 6, toY(TRIGGER));
    ctx.restore();
  }

  if (revealedTo >= 1) {
    const grad = ctx.createLinearGradient(0, PAD.top, 0, PAD.top + cH);
    grad.addColorStop(0, "rgba(245,158,11,0.12)");
    grad.addColorStop(1, "rgba(245,158,11,0)");

    ctx.beginPath();
    ctx.moveTo(toX(0), toY(ALL_DATA[0].ratio));
    for (let i = 1; i <= revealedTo; i++) ctx.lineTo(toX(i), toY(ALL_DATA[i].ratio));
    ctx.lineTo(toX(revealedTo), toY(minR));
    ctx.lineTo(toX(0), toY(minR));
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.beginPath();
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 2.5;
    ctx.lineJoin = "round";
    ctx.setLineDash([]);
    ctx.moveTo(toX(0), toY(ALL_DATA[0].ratio));
    for (let i = 1; i <= revealedTo; i++) ctx.lineTo(toX(i), toY(ALL_DATA[i].ratio));
    ctx.stroke();
  }

  // Trade dot at idx=51 where line first meets the trigger
  if (revealedTo >= 51) {
    const tx = toX(51);
    const ty = toY(ALL_DATA[51].ratio);

    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.arc(tx, ty, 18, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(248,113,113,0.07)";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(tx, ty, 10, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(248,113,113,0.18)";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(tx, ty, 5, 0, Math.PI * 2);
    ctx.fillStyle = "#f87171";
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.9)";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  if (!skipLabels) {
    ctx.save();
    ctx.setLineDash([]);
    ctx.textBaseline = "top";

    const drawAnnoLines = (
      x: number,
      y: number,
      align: CanvasTextAlign,
      lines: string[]
    ) => {
      const lineH = 18;
      ctx.textAlign = align;
      lines.forEach((line, i) => {
        const bold = line.startsWith("**");
        const text = bold ? line.replace(/\*\*/g, "") : line;
        ctx.font = bold
          ? "bold 12.5px 'DM Sans', system-ui, sans-serif"
          : "12px 'DM Sans', system-ui, sans-serif";
        ctx.fillStyle = bold ? "rgba(255,255,255,0.95)" : "rgba(200,210,225,0.82)";
        ctx.fillText(text, x, y + i * lineH);
      });
    };

    // ① Watching — always visible once line starts
    if (revealedTo >= 8) {
      drawAnnoLines(PAD.left + 4, PAD.top + 4, "left", [
        "The algorithm watches",
        "the gold/silver ratio, 24/7.",
      ]);
    }

    // ② Signal — above the line at idx=51, right-aligned so text sits left of the dot
    if (revealedTo >= 51) {
      drawAnnoLines(toX(51) - 26, PAD.top + 48, "right", [
        "Ratio crosses the trigger —",
        "**opportunity identified.**",
      ]);
    }

    // ③ Trade placed — below the curve in the high region (shown 2s after idx=51)
    if (showTradeAnno) {
      drawAnnoLines(toX(51) + 54, toY(85.5) + 10, "left", [
        "**Trade placed** — buys gold,",
        "sells silver. No human needed.",
      ]);
    }

    // ④ Profit — top-right, once line returns to avg at idx=87
    if (revealedTo >= 87) {
      drawAnnoLines(toX(89), PAD.top + 4, "left", [
        "Ratio returns to normal.",
        "**Position closed. Profit taken.**",
      ]);
    }

    ctx.restore();
  }

  if (hoverIdx !== null && hoverIdx <= revealedTo) {
    const hx = toX(hoverIdx);
    const hy = toY(ALL_DATA[hoverIdx].ratio);

    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,0.1)";
    ctx.lineWidth = 1;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(hx, PAD.top);
    ctx.lineTo(hx, PAD.top + cH);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(PAD.left, hy);
    ctx.lineTo(W - PAD.right, hy);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(hx, hy, 4, 0, Math.PI * 2);
    ctx.fillStyle = "#f59e0b";
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  }
}

function xToIdx(canvas: HTMLCanvasElement | null, clientX: number, rightPad = 90, leftPad = 48): number | null {
  if (!canvas) return null;
  const rect = canvas.getBoundingClientRect();
  const PAD = { left: leftPad, right: rightPad };
  const cW = canvas.offsetWidth - PAD.left - PAD.right;
  const rx = clientX - rect.left - PAD.left;
  const idx = Math.round((rx / cW) * (N - 1));
  return Math.max(0, Math.min(N - 1, idx));
}

const STEP_DESCS = [
  <>
    The algorithm monitors the <strong style={{ color: "#e2e8f0" }}>price ratio between gold and silver</strong> in real time — every second of every day. The ratio is near its historical average of 80. Nothing to do yet.
  </>,
  <>
    The ratio <strong style={{ color: "#e2e8f0" }}>crosses above 90</strong> — the trigger threshold. Gold has become unusually expensive relative to silver. The algorithm flags this as a trading opportunity: the gap is likely to close.
  </>,
  <>
    The algorithm <strong style={{ color: "#e2e8f0" }}>automatically buys gold and sells silver</strong>, betting the ratio will fall back to normal. No human needed. The trade fires in milliseconds. Now we wait for the ratio to revert.
  </>,
  <>
    The ratio falls back to 80. The algorithm <strong style={{ color: "#e2e8f0" }}>closes the position and takes the profit</strong>. Start to finish, no human was involved.
  </>,
];

const VP = "#7c3aed";

/** Chart padding: smaller on mobile so plot area stays readable at 320px. */
const CHART_PAD_RIGHT_DESKTOP = 90;
const CHART_PAD_RIGHT_MOBILE = 24;
const CHART_PAD_LEFT_DESKTOP = 48;
const CHART_PAD_LEFT_MOBILE = 32;

export function GoldSilverExplainer(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Single source of truth for animation. Ref is authoritative for the playback loop; we sync to state for render.
  const animRef = useRef<AnimationState>(getInitialAnimationState());
  const rafIdRef = useRef<number | null>(null);

  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [revealedTo, setRevealedTo] = useState(0);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [showTradeAnno, setShowTradeAnno] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const isPointerDownRef = useRef(false);

  // Match (max-width: 768px) for mobile: show labels/legend in HTML, use pointer/touch for chart.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  /** Push ref state to React state so canvas and UI re-render from same values. */
  const syncToReact = useCallback(() => {
    const a = animRef.current;
    setRevealedTo(a.revealedTo);
    setCurrentStep(a.currentStep);
    setShowTradeAnno(a.showTradeAnno);
    setIsPlaying(a.mode === "playing");
  }, []);

  /** Cancel any in-flight RAF. Ensures only one playback loop can run. */
  const cancelPlayback = useCallback(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    animRef.current.mode = animRef.current.mode === "playing" ? "paused" : animRef.current.mode;
  }, []);

  /** Full reset: clear animation state and UI hover. No pending timers or replay. */
  const resetAnimationState = useCallback(() => {
    cancelPlayback();
    animRef.current = getInitialAnimationState();
    setHoverIdx(null);
    syncToReact();
  }, [cancelPlayback, syncToReact]);

  /** Pause playback. If we're in signal-pause, store elapsed ms so resume continues correctly. */
  const pauseAnimation = useCallback(() => {
    const a = animRef.current;
    if (a.mode !== "playing") return;
    cancelPlayback();
    if (a.phase === "signal-pause") {
      a.signalPauseElapsedMs = Math.min(
        SIGNAL_PAUSE_MS,
        performance.now() - a.phaseStartTime
      );
    }
    a.mode = "paused";
    syncToReact();
  }, [cancelPlayback, syncToReact]);

  /** Start or resume playback from current state. One RAF loop only. */
  const startAnimationFromCurrentState = useCallback(() => {
    const a = animRef.current;
    cancelPlayback();

    a.mode = "playing";
    if (a.revealedTo >= N - 1) {
      // Replay from start
      a.revealedTo = 0;
      a.currentStep = 0;
      a.showTradeAnno = false;
      a.phase = "reveal";
      a.phaseStartTime = performance.now();
      a.signalPauseElapsedMs = 0;
    } else if (a.phase === "signal-pause" && a.revealedTo === 51 && a.signalPauseElapsedMs > 0) {
      // Resuming in the middle of the 4s pause: phaseStartTime is set so elapsed = signalPauseElapsedMs
      a.phaseStartTime = performance.now() - a.signalPauseElapsedMs;
    } else if (a.revealedTo === 51) {
      // At index 51 (e.g. user clicked step 1 then Play): run full signal-pause from start
      a.phase = "signal-pause";
      a.phaseStartTime = performance.now();
      a.showTradeAnno = false;
      a.signalPauseElapsedMs = 0;
    } else {
      // Normal reveal: we're at revealedTo, next tick will advance after REVEAL_SPEED
      a.phase = "reveal";
      a.phaseStartTime = performance.now();
    }
    syncToReact();

    const loop = () => {
      const now = performance.now();
      const a = animRef.current;
      if (a.mode !== "playing") {
        rafIdRef.current = null;
        return;
      }

      if (a.phase === "signal-pause") {
        const elapsed = now - a.phaseStartTime;
        if (elapsed >= TRADE_ANNO_AT_MS && !a.showTradeAnno) {
          a.showTradeAnno = true;
          a.currentStep = 2;
          syncToReact();
        }
        if (elapsed >= SIGNAL_PAUSE_MS) {
          a.revealedTo = 52;
          a.currentStep = 2;
          a.phase = "reveal";
          a.phaseStartTime = now;
          a.signalPauseElapsedMs = 0;
          syncToReact();
        }
        rafIdRef.current = requestAnimationFrame(loop);
        return;
      }

      // phase === "reveal"
      const elapsed = now - a.phaseStartTime;
      const delay = a.revealedTo === 51 ? SIGNAL_PAUSE_MS : REVEAL_SPEED;
      if (elapsed < delay) {
        rafIdRef.current = requestAnimationFrame(loop);
        return;
      }

      const nextIdx = a.revealedTo + 1;
      if (nextIdx > N - 1) {
        a.mode = "completed";
        rafIdRef.current = null;
        syncToReact();
        return;
      }

      a.revealedTo = nextIdx;
      a.currentStep = getStepForIndex(nextIdx);
      a.phaseStartTime = now;

      if (nextIdx === 51) {
        a.phase = "signal-pause";
        a.showTradeAnno = false;
        a.signalPauseElapsedMs = 0;
      }

      syncToReact();
      rafIdRef.current = requestAnimationFrame(loop);
    };
    rafIdRef.current = requestAnimationFrame(loop);
  }, [cancelPlayback, syncToReact]);

  const jumpToStep = useCallback(
    (step: number) => {
      if (step < 0 || step > 3) return;
      cancelPlayback();
      setHoverIdx(null);
      const snap = getStepSnapshot(step);
      animRef.current = {
        ...animRef.current,
        mode: "idle",
        revealedTo: snap.revealedTo,
        currentStep: snap.currentStep,
        showTradeAnno: snap.showTradeAnno,
        phase: "reveal",
        phaseStartTime: 0,
        signalPauseElapsedMs: 0,
      };
      setRevealedTo(snap.revealedTo);
      setCurrentStep(snap.currentStep);
      setShowTradeAnno(snap.showTradeAnno);
      setIsPlaying(false);
    },
    [cancelPlayback]
  );

  const togglePlay = useCallback(() => {
    const a = animRef.current;
    if (a.mode === "playing") {
      pauseAnimation();
      return;
    }
    if (a.mode === "completed" || a.revealedTo >= N - 1) {
      // Replay: full reset then play
      startAnimationFromCurrentState();
      return;
    }
    startAnimationFromCurrentState();
  }, [pauseAnimation, startAnimationFromCurrentState]);

  const reset = useCallback(() => {
    resetAnimationState();
  }, [resetAnimationState]);

  /** Scrub chart to a given index (used by pointer drag on chart). */
  const scrubToIndex = useCallback((idx: number) => {
    const clamped = Math.max(0, Math.min(N - 1, idx));
    cancelPlayback();
    animRef.current = {
      ...animRef.current,
      mode: "idle",
      revealedTo: clamped,
      currentStep: getStepForIndex(clamped),
      showTradeAnno: clamped > 51,
      phase: "reveal",
      phaseStartTime: 0,
      signalPauseElapsedMs: 0,
    };
    setRevealedTo(clamped);
    setCurrentStep(getStepForIndex(clamped));
    setShowTradeAnno(clamped > 51);
    setIsPlaying(false);
  }, [cancelPlayback]);

  const rightPad = isMobile ? CHART_PAD_RIGHT_MOBILE : CHART_PAD_RIGHT_DESKTOP;
  const leftPad = isMobile ? CHART_PAD_LEFT_MOBILE : CHART_PAD_LEFT_DESKTOP;

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    isPointerDownRef.current = true;
    const idx = xToIdx(canvasRef.current, e.clientX, rightPad, leftPad);
    const revealed = animRef.current.revealedTo;
    if (idx !== null && idx <= revealed) {
      setHoverIdx(idx);
    } else if (idx !== null) {
      scrubToIndex(idx);
      setHoverIdx(idx);
    }
  }, [rightPad, leftPad, scrubToIndex]);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    const idx = xToIdx(canvasRef.current, e.clientX, rightPad, leftPad);
    const revealed = animRef.current.revealedTo;
    if (isPointerDownRef.current) {
      if (idx !== null) {
        scrubToIndex(idx);
        setHoverIdx(idx <= revealed ? idx : null);
      }
    } else {
      if (idx !== null && idx <= revealed) setHoverIdx(idx);
      else setHoverIdx(null);
    }
  }, [rightPad, leftPad, scrubToIndex]);

  const onPointerUp = useCallback(() => {
    isPointerDownRef.current = false;
    setHoverIdx(null);
  }, []);

  const onPointerLeave = useCallback(() => {
    isPointerDownRef.current = false;
    setHoverIdx(null);
  }, []);

  const onPointerCancel = useCallback(() => {
    isPointerDownRef.current = false;
    setHoverIdx(null);
  }, []);

  // Render canvas from current React state (single source of truth for draw)
  useEffect(() => {
    drawChart(canvasRef.current, revealedTo, hoverIdx, currentStep, showTradeAnno, {
      skipCanvasLabels: isMobile,
      leftPad,
    });
  }, [revealedTo, hoverIdx, currentStep, showTradeAnno, isMobile, leftPad]);

  // Resize: redraw from current state only (no mixed ref/state)
  useEffect(() => {
    const ro = new ResizeObserver(() => {
      const a = animRef.current;
      const skipLabels = window.matchMedia("(max-width: 768px)").matches;
      const padLeft = skipLabels ? CHART_PAD_LEFT_MOBILE : CHART_PAD_LEFT_DESKTOP;
      drawChart(canvasRef.current, a.revealedTo, null, a.currentStep, a.showTradeAnno, {
        skipCanvasLabels: skipLabels,
        leftPad: padLeft,
      });
    });
    if (canvasRef.current) ro.observe(canvasRef.current);
    return () => ro.disconnect();
  }, []);

  // Unmount: cancel any playback
  useEffect(() => () => cancelPlayback(), [cancelPlayback]);

  const hoveredPoint = hoverIdx !== null ? ALL_DATA[hoverIdx] : null;
  const tooltipLabel = hoverIdx !== null ? LABELS[hoverIdx] : null;
  let tooltipNote: { text: string; color: string } | null = null;
  if (hoverIdx === 51) tooltipNote = { text: "🔴 Trade placed here", color: "#f87171" };
  else if (hoverIdx !== null && hoverIdx >= 30 && hoverIdx < 60)
    tooltipNote = { text: "⚠ Ratio rising above average", color: "#fbbf24" };
  else if (hoverIdx !== null && hoverIdx > 60 && hoverIdx < 90)
    tooltipNote = { text: "✓ Ratio returning to normal", color: "#34d399" };

  const atEnd = revealedTo >= N - 1;
  const buttonLabel = isPlaying ? "⏸ Pause" : atEnd ? "↺ Replay" : "▶ Play";

  return (
    <>
      <style>{`
        @keyframes descIn { from { opacity:0; transform:translateY(5px); } to { opacity:1; transform:none; } }
        .desc-in { animation: descIn 0.3s ease both; }
      `}</style>

      <div
        className="font-dm-sans text-[#f1f5f9] antialiased"
        style={{
          background: "radial-gradient(ellipse at 55% 0%, #180830 0%, #080618 50%, #040210 100%)",
        }}
      >
        <div className="mx-auto max-w-[1100px] px-6 pt-10 pb-6 md:px-12">
          <div
            className="mb-2 font-mono text-xs font-medium uppercase tracking-widest text-[#6d28d9]"
            style={{ letterSpacing: "0.25em" }}
          >
            {"// A simple example"}
          </div>
          <h2
            className="mb-3 text-[clamp(1.75rem,4vw,2.625rem)] font-extrabold leading-tight tracking-tight"
            style={{ letterSpacing: -1.5 }}
          >
            The <span style={{ color: "#f59e0b" }}>Gold</span> &{" "}
            <span className="text-gray-400">Silver</span> Strategy
          </h2>
          <p className="max-w-[560px] text-[15px] leading-[1.7] text-[#6b7280]">
            How a trading algorithm thinks and acts — automatically, 24 hours a day.
          </p>
        </div>

        <div className="relative mx-auto max-w-[1100px] px-6 md:px-12">
          <div className="relative">
            <canvas
              ref={canvasRef}
              className="block w-full cursor-crosshair touch-none h-[280px] sm:h-[320px] md:h-[380px]"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerLeave={onPointerLeave}
              onPointerCancel={onPointerCancel}
              aria-label="Gold/silver ratio chart. Tap a point to select; drag to scrub the timeline."
            />
            {hoveredPoint && (
              <div
                className="pointer-events-none absolute top-3 left-3 right-auto min-w-[120px] max-w-[calc(100%-24px)] rounded-lg border border-[#793de14d] bg-[#080618f0] p-2 px-3 font-mono text-[11px] md:left-auto md:right-3"
                role="status"
                aria-live="polite"
              >
                <div className="mb-1 text-[#4b5563]">{tooltipLabel}</div>
                <div className="font-bold text-[#f59e0b]">Ratio: {hoveredPoint.ratio}</div>
                <div className="mt-0.5 text-[10px] text-[#4b5563]">
                  Avg: {AVG} · Trigger: {TRIGGER}
                </div>
                {tooltipNote && (
                  <div
                    className="mt-1 text-[10px] font-bold"
                    style={{ color: tooltipNote.color }}
                  >
                    {tooltipNote.text}
                  </div>
                )}
              </div>
            )}
          </div>
          {/* Mobile: key labels and legend in HTML so text is readable (not tiny canvas text) */}
          {isMobile && (
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm" role="list" aria-label="Chart legend">
              <span className="flex items-center gap-1.5 text-[#a78bfa]">
                <span className="inline-block h-1 w-5 rounded-sm bg-[#a78bfa]/70" aria-hidden />
                Avg 80
              </span>
              <span className="flex items-center gap-1.5 text-[#34d399]">
                <span className="inline-block h-1 w-5 rounded-sm border-2 border-[#34d399]/60 border-dashed bg-transparent" aria-hidden />
                Trigger 90
              </span>
            </div>
          )}
        </div>

        <div className="mx-auto max-w-[1100px] px-6 pt-5 md:px-12 min-w-0">
          {/* Mobile: 2x2 grid for steps + second row for Reset/Play. Desktop: single row with border-bottom. */}
          <div
            className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap sm:border-b sm:border-white/[0.06]"
            style={{ marginBottom: -1 }}
          >
            <div className="grid grid-cols-2 gap-1 min-w-0 sm:flex sm:flex-wrap">
              {[
                "1 · Watching",
                "2 · Signal",
                "3 · Trade",
                "4 · Profit",
              ].map((label, i) => {
                const active = i === currentStep;
                const done = i < currentStep;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => jumpToStep(i)}
                    className="min-h-[44px] min-w-0 border-b-2 px-3 py-2.5 text-[11px] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#793de1] focus:ring-offset-2 focus:ring-offset-[#080618] sm:min-w-[44px] sm:px-4 sm:py-2.5 sm:text-xs sm:border-b-2"
                    style={{
                      borderBottomColor: active ? VP : "transparent",
                      color: active ? "#a78bfa" : done ? "#374151" : "#1f2937",
                      fontWeight: active ? 800 : 600,
                      letterSpacing: 0.2,
                    }}
                    aria-label={`Step ${i + 1}: ${STEP_TITLES[i]}. ${active ? "Current step." : "Select to jump to this step."}`}
                    aria-current={active ? "step" : undefined}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            <div className="flex-1 min-w-0 hidden sm:block" />
            <div className="flex w-full sm:w-auto justify-end gap-2 pb-2 sm:pb-2">
              <button
                type="button"
                onClick={reset}
                className="min-h-[44px] min-w-[44px] rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-[11px] font-bold text-[#374151] transition-colors hover:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-[#793de1] focus:ring-offset-2 focus:ring-offset-[#080618] sm:px-3.5 sm:text-xs"
                aria-label="Reset chart to start"
              >
                ↺ Reset
              </button>
              <button
                type="button"
                onClick={togglePlay}
                className="min-h-[44px] min-w-[44px] rounded-lg px-4 py-2 text-xs font-extrabold text-white shadow-[0_0_20px_rgba(124,58,237,0.25)] transition-colors focus:outline-none focus:ring-2 focus:ring-[#793de1] focus:ring-offset-2 focus:ring-offset-[#080618] sm:px-5 sm:text-[13px]"
                style={{
                  background: isPlaying ? "rgba(109,40,217,0.7)" : VP,
                }}
                aria-label={isPlaying ? "Pause animation" : atEnd ? "Replay animation" : "Play animation"}
              >
                {buttonLabel}
              </button>
            </div>
          </div>

          {/* Screen reader: readable summary of active step (non-canvas fallback) */}
          <div
            className="sr-only"
            role="status"
            aria-live="polite"
            aria-atomic
          >
            Step {currentStep + 1} of 4: {STEP_TITLES[currentStep]}.
          </div>

          <div key={currentStep} className="desc-in mt-6 mb-16">
            <div className="flex items-start gap-3 md:gap-3">
              <div
                className="flex h-10 w-10 md:h-[38px] md:w-[38px] shrink-0 items-center justify-center rounded-full text-base md:text-[15px] font-extrabold text-white"
                style={{
                  background: VP,
                  boxShadow: "0 0 0 4px rgba(124,58,237,0.15)",
                }}
              >
                {currentStep + 1}
              </div>
              <div className="min-w-0">
                <div className="mb-2 md:mb-1 text-base md:text-base font-extrabold leading-snug tracking-tight text-[#f1f5f9]">
                  {STEP_TITLES[currentStep]}
                </div>
                <div className="max-w-[600px] text-[15px] md:text-sm leading-[1.8] md:leading-[1.75] text-[#6b7280]">
                  {STEP_DESCS[currentStep]}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-[1100px] px-6 pb-20 text-center md:px-12">
          <p className="text-[11px] leading-[1.7] text-[#1f2937]">
            Simplified illustration for educational purposes. Real strategies are more complex and may behave differently in live markets.
            <br />
            Backtested performance does not guarantee future results. This is not investment advice.
          </p>
        </div>
      </div>
    </>
  );
}
