"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ─────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────
const N = 120;
const AVG = 80;
const TRIGGER = 90;
const REVEAL_SPEED = 50; // ms per point

const STEP_RANGES = [
  { start: 0, end: 29 },
  { start: 30, end: 59 },
  { start: 60, end: 60 },
  { start: 61, end: N - 1 },
];

const PAUSES: Record<number, number> = { 29: 1000, 59: 700, 60: 1600, 85: 600 };

const STEP_TITLES = [
  "Watching the ratio, 24/7",
  "A trading opportunity appears",
  "The trade is placed — instantly",
  "Ratio normalises — profit taken",
];

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
// CANVAS CHART
// ─────────────────────────────────────────
function drawChart(
  canvas: HTMLCanvasElement | null,
  revealedTo: number,
  hoverIdx: number | null
) {
  if (!canvas) return;
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

  const PAD = { top: 40, right: 90, bottom: 24, left: 48 };
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

  ctx.fillStyle = "#374151";
  ctx.font = "11px monospace";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  [75, 80, 85, 90, 95].forEach((v) => {
    ctx.fillText(String(v), PAD.left - 8, toY(v));
  });

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

  ctx.save();
  ctx.font = "10px monospace";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "rgba(167,139,250,0.6)";
  ctx.fillText("avg 80", W - PAD.right + 6, toY(AVG));
  ctx.fillStyle = "rgba(52,211,153,0.55)";
  ctx.fillText("trigger 90", W - PAD.right + 6, toY(TRIGGER));
  ctx.restore();

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

  if (revealedTo >= 60) {
    const tx = toX(60);
    const ty = toY(ALL_DATA[60].ratio);

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

  if (revealedTo >= 8) {
    drawAnnoLines(PAD.left + 4, PAD.top + 4, "left", [
      "The algorithm watches",
      "the gold/silver ratio, 24/7.",
    ]);
  }

  if (revealedTo >= 38) {
    drawAnnoLines(PAD.left + 4, PAD.top + cH - 48, "left", [
      "Ratio rises above average —",
      "**opportunity identified.**",
    ]);
  }

  if (revealedTo >= 60) {
    drawAnnoLines(toX(63), toY(TRIGGER) + 10, "left", [
      "**Trade placed.**",
      "Buys gold, sells silver.",
    ]);
  }

  if (revealedTo >= 80) {
    drawAnnoLines(toX(82), PAD.top + 4, "left", [
      "Ratio returns to normal.",
      "**Profit taken.**",
    ]);
  }

  ctx.restore();

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

function xToIdx(canvas: HTMLCanvasElement | null, clientX: number): number | null {
  if (!canvas) return null;
  const rect = canvas.getBoundingClientRect();
  const PAD = { left: 48, right: 90 };
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
    The ratio <strong style={{ color: "#e2e8f0" }}>spikes significantly above its historical average of 80</strong>. Gold has become unusually expensive relative to silver. The algorithm flags this as a signal: the gap is likely to close.
  </>,
  <>
    The algorithm <strong style={{ color: "#e2e8f0" }}>automatically buys gold and sells silver</strong>, betting the ratio will fall back to normal. No human needed. No hesitation. The trade is placed in milliseconds.
  </>,
  <>
    The ratio falls back toward 80. The algorithm <strong style={{ color: "#e2e8f0" }}>closes the position and takes the profit</strong>. Start to finish, no human was involved. The strategy now watches for the next opportunity.
  </>,
];

const VP = "#7c3aed";

export function GoldSilverExplainer(): JSX.Element {
  const revRef = useRef(0);
  const playRef = useRef(false);
  const stepRef = useRef(0);
  const animRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [revealedTo, setRevealedTo] = useState(0);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [metricVis, setMetricVis] = useState([false, false, false]);

  useEffect(() => {
    drawChart(canvasRef.current, revealedTo, hoverIdx);
  }, [revealedTo, hoverIdx, currentStep]);

  useEffect(() => {
    const ro = new ResizeObserver(() =>
      drawChart(canvasRef.current, revRef.current, null)
    );
    if (canvasRef.current) ro.observe(canvasRef.current);
    return () => ro.disconnect();
  }, []);

  const activateStep = useCallback((s: number) => {
    stepRef.current = s;
    setCurrentStep(s);
    setMetricVis((prev) => {
      const n = [...prev];
      if (s >= 1) n[0] = true;
      if (s >= 2) n[1] = true;
      if (s >= 3) n[2] = true;
      return n;
    });
  }, []);

  const stopAnim = useCallback(() => {
    playRef.current = false;
    setIsPlaying(false);
    if (animRef.current) {
      clearTimeout(animRef.current);
      animRef.current = null;
    }
  }, []);

  const tick = useCallback(
    (from: number) => {
      if (!playRef.current) return;
      if (from >= N - 1) {
        stopAnim();
        return;
      }

      const next = from + 1;
      revRef.current = next;
      setRevealedTo(next);

      for (let s = 0; s < STEP_RANGES.length; s++) {
        if (next >= STEP_RANGES[s].start && next <= STEP_RANGES[s].end) {
          if (s !== stepRef.current) activateStep(s);
          break;
        }
      }

      const delay = PAUSES[next] ?? REVEAL_SPEED;
      animRef.current = setTimeout(() => tick(next), delay);
    },
    [activateStep, stopAnim]
  );

  const jumpToStep = useCallback(
    (s: number) => {
      if (s < 0 || s > 3) return;
      stopAnim();
      const end = STEP_RANGES[s].end;
      revRef.current = end;
      setRevealedTo(end);
      activateStep(s);
    },
    [stopAnim, activateStep]
  );

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      stopAnim();
      return;
    }
    if (revRef.current >= N - 1) {
      stopAnim();
      revRef.current = 0;
      stepRef.current = 0;
      setRevealedTo(0);
      setCurrentStep(0);
      setMetricVis([false, false, false]);
      setTimeout(() => {
        playRef.current = true;
        setIsPlaying(true);
        tick(0);
      }, 60);
      return;
    }
    playRef.current = true;
    setIsPlaying(true);
    tick(revRef.current);
  }, [isPlaying, stopAnim, tick]);

  const reset = useCallback(() => {
    stopAnim();
    revRef.current = 0;
    stepRef.current = 0;
    setRevealedTo(0);
    setCurrentStep(0);
    setMetricVis([false, false, false]);
  }, [stopAnim]);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const idx = xToIdx(canvasRef.current, e.clientX);
    if (idx !== null && idx <= revRef.current) setHoverIdx(idx);
  }, []);
  const onMouseLeave = useCallback(() => setHoverIdx(null), []);

  useEffect(() => {
    const t = setTimeout(() => setMetricVis((v) => [true, v[1], v[2]]), 500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => () => stopAnim(), [stopAnim]);

  const hoveredPoint = hoverIdx !== null ? ALL_DATA[hoverIdx] : null;
  const tooltipLabel = hoverIdx !== null ? LABELS[hoverIdx] : null;
  let tooltipNote: { text: string; color: string } | null = null;
  if (hoverIdx === 60) tooltipNote = { text: "🔴 Trade placed here", color: "#f87171" };
  else if (hoverIdx !== null && hoverIdx >= 30 && hoverIdx < 60)
    tooltipNote = { text: "⚠ Ratio rising above average", color: "#fbbf24" };
  else if (hoverIdx !== null && hoverIdx > 60 && hoverIdx < 90)
    tooltipNote = { text: "✓ Ratio returning to normal", color: "#34d399" };

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
            A real example of how a trading algorithm thinks and acts — completely automatically, 24 hours a day.
          </p>
        </div>

        <div className="relative mx-auto max-w-[1100px] px-6 md:px-12">
          <div className="relative">
            <canvas
              ref={canvasRef}
              className="block w-full cursor-crosshair"
              style={{ height: 380 }}
              onMouseMove={onMouseMove}
              onMouseLeave={onMouseLeave}
              aria-label="Gold/silver ratio chart"
            />
            {hoveredPoint && (
              <div
                className="pointer-events-none absolute right-3 top-3 min-w-[140px] rounded-lg border border-[#793de14d] bg-[#080618f0] p-2 px-3 font-mono text-[11px]"
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
        </div>

        <div className="mx-auto max-w-[1100px] px-6 pt-5 md:px-12">
          <div
            className="mb-5 flex items-center border-b border-white/[0.06]"
            style={{ marginBottom: -1 }}
          >
            {[
              "1 · Watching",
              "2 · Signal",
              "3 · Trade placed",
              "4 · Profit taken",
            ].map((label, i) => {
              const active = i === currentStep;
              const done = i < currentStep;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => jumpToStep(i)}
                  className="border-b-2 px-4 py-2.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#793de1] focus:ring-offset-2 focus:ring-offset-[#080618]"
                  style={{
                    borderBottomColor: active ? VP : "transparent",
                    color: active ? "#a78bfa" : done ? "#374151" : "#1f2937",
                    fontWeight: active ? 800 : 600,
                    letterSpacing: 0.2,
                  }}
                >
                  {label}
                </button>
              );
            })}
            <div className="flex-1" />
            <div className="flex gap-2 pb-2">
              <button
                type="button"
                onClick={reset}
                className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-3.5 py-1.5 text-xs font-bold text-[#374151] transition-colors hover:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-[#793de1] focus:ring-offset-2 focus:ring-offset-[#080618]"
              >
                ↺ Reset
              </button>
              <button
                type="button"
                onClick={togglePlay}
                className="rounded-lg px-5 py-2 text-[13px] font-extrabold text-white shadow-[0_0_20px_rgba(124,58,237,0.25)] transition-colors focus:outline-none focus:ring-2 focus:ring-[#793de1] focus:ring-offset-2 focus:ring-offset-[#080618]"
                style={{
                  background: isPlaying ? "rgba(109,40,217,0.7)" : VP,
                }}
              >
                {isPlaying ? "⏸ Pause" : revealedTo >= N - 1 ? "↺ Replay" : "▶ Play"}
              </button>
            </div>
          </div>

          <div key={currentStep} className="desc-in mb-10">
            <div className="flex items-start gap-3">
              <div
                className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full text-[15px] font-extrabold text-white"
                style={{
                  background: VP,
                  boxShadow: "0 0 0 4px rgba(124,58,237,0.15)",
                }}
              >
                {currentStep + 1}
              </div>
              <div>
                <div className="mb-1 text-base font-extrabold leading-snug tracking-tight text-[#f1f5f9]">
                  {STEP_TITLES[currentStep]}
                </div>
                <div className="max-w-[600px] text-sm leading-[1.75] text-[#6b7280]">
                  {STEP_DESCS[currentStep]}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-3 px-6 pb-12 md:grid-cols-3 md:px-12">
          {[
            {
              icon: "👁️",
              title: "Monitoring frequency",
              value: "24/7",
              color: "#a78bfa",
              desc: "The algorithm watches prices every second — something no human can do consistently.",
              show: metricVis[0],
            },
            {
              icon: "⚡",
              title: "Time to execute",
              value: "< 1ms",
              color: "#f59e0b",
              desc: "Once a signal triggers, the trade is placed in under a millisecond. Human reaction time is ~200ms.",
              show: metricVis[1],
            },
            {
              icon: "🧠",
              title: "Emotions involved",
              value: "Zero",
              color: "#34d399",
              desc: "The algorithm never panics, hesitates, or second-guesses. It follows its rules exactly, every time.",
              show: metricVis[2],
            },
          ].map((m, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-[opacity,transform] duration-500 ease-out"
              style={{
                opacity: m.show ? 1 : 0,
                transform: m.show ? "none" : "translateY(12px)",
              }}
            >
              <div className="mb-3 text-[22px]">{m.icon}</div>
              <div className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-[#1f2937]">
                {m.title}
              </div>
              <div
                className="mb-1.5 text-[26px] font-extrabold tracking-tight"
                style={{ color: m.color }}
              >
                {m.value}
              </div>
              <div className="text-xs leading-[1.6] text-[#374151]">{m.desc}</div>
            </div>
          ))}
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
