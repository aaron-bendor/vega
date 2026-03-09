"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// Vega design system
const COLORS = {
  lightPurple: "#793DE1",
  lighterPurple: "#9877D1",
  black: "#111111",
  gray: "#333333",
  white: "#FFFFFF",
  panel: "#171717",
  panelSoft: "#1F1F1F",
  textSoft: "#C9BEDF",
  textMuted: "#9A8FB5",
  border: "rgba(255,255,255,0.10)",
  borderSoft: "rgba(255,255,255,0.06)",
  overlay: "rgba(0,0,0,0.62)",
};

// Brand logo (public asset)
const LOGO_SRC = "/logo.png";

// Native image size
const NW = 7560;
const NH = 4910;

// Highlight regions [x, y, w, h] in native px
const REGIONS: Record<string, [number, number, number, number]> = {
  sidebar: [250, 580, 1300, 4010],
  editor: [1740, 500, 5700, 4100],
  tabs: [1740, 500, 5700, 200],
  csv_pane: [1740, 500, 2900, 4100],
  charts_pane: [4750, 500, 2700, 4100],
  terminal_pane: [4750, 500, 2700, 4100],
  tools_list: [260, 550, 1300, 4010],
  mc_charts: [1700, 500, 1600, 4100],
  debug_chart: [1740, 800, 5700, 3000],
  publish_modal: [2230, 1200, 3080, 2500],
  review_modal: [2680, 1950, 2250, 1000],
};

type Step = {
  frame: string;
  region: string;
  color: string;
  label: string;
  title: string;
  body: string;
};

const STEPS: Step[] = [
  {
    frame: "Frame_102",
    region: "editor",
    color: COLORS.lighterPurple,
    label: "Start Tutorial",
    title: "Welcome to the Vega Developer tour",
    body: "Take a quick walkthrough of the IDE — file explorer, notebooks, backtesting, and one-click publish. Click next to begin.",
  },
  {
    frame: "Frame_102",
    region: "sidebar",
    color: COLORS.lighterPurple,
    label: "01 — File Explorer",
    title: "Your full project, organised",
    body: "Navigate through files easily. Notebooks, scripts, tables, and plots side by side",
  },
  {
    frame: "Frame_102",
    region: "editor",
    color: COLORS.lighterPurple,
    label: "02 — Notebook Editor",
    title: "Write strategies in code",
    body: "Supports Python, C++, R, and more. Jupyter-style cells with the Vega API built in. Pull live market data and run cells inline — no local setup.",
  },
  {
    frame: "Frame_102",
    region: "tabs",
    color: COLORS.lighterPurple,
    label: "03 — Multi-file Tabs",
    title: "Open files side by side",
    body: "Keep your notebook, preprocessing script and CSV open simultaneously. Toolbar controls run, stop and restart.",
  },
  {
    frame: "Frame_104",
    region: "csv_pane",
    color: COLORS.lighterPurple,
    label: "04 — Data Viewer",
    title: "Inspect tick data instantly",
    body: "Import CSVs or pull OHLCV data with v.get_price_data(). View SPY, EUR/USD and global equities at millisecond resolution.",
  },
  {
    frame: "Frame_104",
    region: "charts_pane",
    color: COLORS.lighterPurple,
    label: "05 — Returns Charts",
    title: "Visualise your portfolio",
    body: "Candlestick returns across every asset — BHP, AAL, FCX, TECK. Spot regime changes and outliers at a glance.",
  },
  {
    frame: "Frame_105",
    region: "terminal_pane",
    color: COLORS.lighterPurple,
    label: "06 — Terminal",
    title: "Backtest without leaving the IDE",
    body: "Real-time trade traces with timestamps, prices and PnL. Final equity, Sharpe ratio and max drawdown printed on completion.",
  },
  {
    frame: "Frame_106",
    region: "tools_list",
    color: COLORS.lighterPurple,
    label: "07 — Quant Toolbox",
    title: "20+ professional tools",
    body: "Monte Carlo, Walk-Forward, Parameter Optimisation, Risk Analyser, Execution Simulator, Market Regime Detector — all one click away.",
  },
  {
    frame: "Frame_106",
    region: "mc_charts",
    color: COLORS.lighterPurple,
    label: "08 — Monte Carlo",
    title: "Stress-test across thousands of paths",
    body: "Simulate price paths per asset and render a 3D implied volatility surface — natively inside the IDE, no context switching.",
  },
  {
    frame: "Frame_107",
    region: "debug_chart",
    color: COLORS.lighterPurple,
    label: "09 — Debug & Charts",
    title: "Charts render inline",
    body: "Step through with the debugger and see backtest results as interactive candlestick charts directly below your code cells.",
  },
  {
    frame: "Frame_103",
    region: "publish_modal",
    color: COLORS.lighterPurple,
    label: "10 — Publish",
    title: "One click to go live",
    body: "Vega validates backtesting, cost estimation, execution config and capital allocation. Reviewed and deployed within 2 business days.",
  },
  {
    frame: "Frame_108",
    region: "review_modal",
    color: COLORS.lighterPurple,
    label: "11 — Under Review",
    title: "Your algorithm is in the queue",
    body: "Confirmation is instant. The team reaches out via email if they need more detail. Most strategies are live within 2 business days.",
  },
];

function Highlight({
  region,
  color,
  scale,
}: {
  region: string;
  color: string;
  scale: number;
}) {
  const r = REGIONS[region];
  if (!r) return null;
  const [nx, ny, nw, nh] = r;
  const pad = 12;
  const x = nx * scale - pad;
  const y = ny * scale - pad;
  const w = nw * scale + pad * 2;
  const h = nh * scale + pad * 2;
  const vw = NW * scale;
  const vh = NH * scale;
  const id = region;

  return (
    <svg
      style={{
        position: "absolute",
        inset: 0,
        width: vw,
        height: vh,
        pointerEvents: "none",
        zIndex: 5,
      }}
      viewBox={`0 0 ${vw} ${vh}`}
    >
      <defs>
        <mask id={`m${id}`}>
          <rect width={vw} height={vh} fill="white" />
          <rect x={x} y={y} width={w} height={h} rx={8} fill="black" />
        </mask>
      </defs>
      <rect
        width={vw}
        height={vh}
        fill={COLORS.overlay}
        mask={`url(#m${id})`}
      />
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={8}
        fill="none"
        stroke={color}
        strokeWidth={(2.5 / scale) * 0.3}
        style={{
          filter: `drop-shadow(0 0 ${(6 / scale) * 0.3}px ${color})`,
          animation: "pulse 2.2s ease-in-out infinite",
        }}
      />
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.45}}`}</style>
    </svg>
  );
}

function StepPill({
  step,
  idx,
  total,
  color,
}: {
  step: Step;
  idx: number;
  total: number;
  color: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        fontFamily: "'DM Mono', monospace",
      }}
    >
      <span
        style={{
          fontSize: 13,
          color,
          letterSpacing: "0.06em",
          opacity: 0.95,
        }}
      >
        {step.label}
      </span>
      <span
        style={{
          fontSize: 12,
          color: COLORS.textMuted,
          letterSpacing: "0.04em",
        }}
      >
        {idx + 1}/{total}
      </span>
    </div>
  );
}

function Card({
  step,
  idx,
  total,
  onNext,
  onPrev,
  onJump,
  onClose,
  visible,
}: {
  step: Step;
  idx: number;
  total: number;
  onNext: () => void;
  onPrev: () => void;
  onJump: (i: number) => void;
  onClose: () => void;
  visible: boolean;
}) {
  return (
    <div
      style={{
        width: 400,
        maxWidth: "min(400px, calc(100vw - 32px))",
        background: COLORS.panel,
        border: `1px solid ${COLORS.border}`,
        borderTop: `1px solid ${step.color}88`,
        borderRadius: 14,
        padding: "24px 26px 22px",
        boxShadow: "0 18px 60px rgba(0,0,0,0.35)",
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(6px)",
        transition: "opacity 0.18s, transform 0.18s",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
        <StepPill step={step} idx={idx} total={total} color={step.color} />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close tour"
          style={{
            background: "transparent",
            border: "none",
            color: COLORS.textMuted,
            padding: 4,
            fontSize: 14,
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Close
        </button>
      </div>

      <div
        style={{
          fontSize: 18,
          fontWeight: 500,
          color: COLORS.white,
          lineHeight: 1.35,
          margin: "14px 0 10px",
        }}
      >
        {step.title}
      </div>

      <div
        style={{
          fontSize: 14,
          fontWeight: 300,
          color: COLORS.textSoft,
          lineHeight: 1.72,
          marginBottom: 20,
        }}
      >
        {step.body}
      </div>

      <div
        style={{
          height: 3,
          background: "rgba(255,255,255,0.08)",
          borderRadius: 2,
          marginBottom: 18,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            borderRadius: 2,
            width: `${((idx + 1) / total) * 100}%`,
            background: step.color,
            transition: "width 0.35s ease",
            boxShadow: `0 0 8px ${step.color}`,
          }}
        />
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button
          type="button"
          onClick={onPrev}
          disabled={idx === 0}
          style={{
            background: "transparent",
            border: `1px solid ${COLORS.borderSoft}`,
            color: idx === 0 ? "#555555" : COLORS.textMuted,
            borderRadius: 8,
            padding: "9px 16px",
            fontSize: 13,
            cursor: idx === 0 ? "default" : "pointer",
            fontFamily: "'DM Sans', sans-serif",
            transition: "color 0.15s, border-color 0.15s",
          }}
          onMouseEnter={(e) => {
            if (idx > 0) {
              e.currentTarget.style.color = COLORS.white;
              e.currentTarget.style.borderColor = COLORS.lightPurple;
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color =
              idx === 0 ? "#555555" : COLORS.textMuted;
            e.currentTarget.style.borderColor = COLORS.borderSoft;
          }}
        >
          ← back
        </button>
        <button
          type="button"
          onClick={onNext}
          style={{
            flex: 1,
            background: step.color,
            border: "none",
            color: COLORS.white,
            borderRadius: 8,
            padding: "9px 16px",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "'DM Mono', monospace",
            letterSpacing: "0.02em",
            transition: "opacity 0.12s, transform 0.12s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "0.86";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          {idx === total - 1 ? "get started →" : "next →"}
        </button>
      </div>

      <div
        style={{
          display: "flex",
          gap: 6,
          justifyContent: "center",
          marginTop: 16,
        }}
      >
        {Array.from({ length: total }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onJump(i)}
            aria-label={`Go to step ${i + 1}`}
            style={{
              width: i === idx ? 18 : 6,
              height: 6,
              borderRadius: 3,
              cursor: "pointer",
              padding: 0,
              border: "none",
              background:
                i === idx
                  ? step.color
                  : i < idx
                    ? "rgba(255,255,255,0.18)"
                    : "rgba(255,255,255,0.08)",
              transition: "all 0.22s",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function Landing({ onPlayTutorial }: { onPlayTutorial: () => void }) {
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        background: COLORS.black,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <img
        src={LOGO_SRC}
        alt="Vega Developer"
        style={{
          width: 260,
          maxWidth: "70vw",
          height: "auto",
          marginBottom: 4,
        }}
      />
      <div
        style={{
          fontSize: 22,
          fontWeight: 500,
          color: COLORS.white,
          textAlign: "center",
          lineHeight: 1.35,
        }}
      >
        Interactive tour
      </div>
      <p
        style={{
          fontSize: 14,
          fontWeight: 300,
          color: COLORS.textSoft,
          textAlign: "center",
          maxWidth: 380,
          lineHeight: 1.7,
        }}
      >
        Take a quick walkthrough of the IDE — file explorer, notebooks, backtesting, and one-click publish.
      </p>
      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        <button
          type="button"
          onClick={onPlayTutorial}
          style={{
            background: COLORS.lightPurple,
            border: "none",
            color: COLORS.white,
            padding: "12px 24px",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "'DM Mono', monospace",
            boxShadow: `0 4px 20px ${COLORS.lightPurple}55`,
          }}
        >
          Play Tutorial
        </button>
      </div>
    </div>
  );
}

function Done({ onRestart }: { onRestart: () => void }) {
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        background: COLORS.black,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <img
        src={LOGO_SRC}
        alt="Vega Developer"
        style={{
          width: 260,
          maxWidth: "70vw",
          height: "auto",
          marginBottom: 4,
        }}
      />
      <div
        style={{
          fontSize: 30,
          fontWeight: 500,
          color: COLORS.white,
          textAlign: "center",
          lineHeight: 1.3,
        }}
      >
        Ready to build
        <br />
        <span style={{ color: COLORS.lightPurple }}>your first algorithm?</span>
      </div>
      <div
        style={{
          fontSize: 12.5,
          fontWeight: 300,
          color: COLORS.textSoft,
          textAlign: "center",
          maxWidth: 380,
          lineHeight: 1.7,
        }}
      >
        You&apos;ve seen the full IDE — from notebooks and backtesting
        <br />
        to Monte Carlo simulation and one-click live deployment.
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <button
          type="button"
          onClick={onRestart}
          style={{
            background: "transparent",
            border: `1px solid ${COLORS.border}`,
            color: COLORS.textMuted,
            padding: "9px 18px",
            borderRadius: 7,
            fontSize: 11,
            cursor: "pointer",
            fontFamily: "'DM Mono', monospace",
          }}
        >
          ← restart tour
        </button>
        <a
          href="/vega-developer"
          style={{
            background: COLORS.lightPurple,
            border: "none",
            color: COLORS.white,
            padding: "9px 18px",
            borderRadius: 7,
            fontSize: 11,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "'DM Mono', monospace",
            boxShadow: `0 4px 20px ${COLORS.lightPurple}55`,
            textDecoration: "none",
          }}
        >
          get started free →
        </a>
      </div>
    </div>
  );
}

export default function VegaDeveloperTour() {
  /** Tutorial only runs after explicit "Play Tutorial" or "Replay Tutorial". Never auto-starts on load, refresh, or route change. */
  const [isTutorialActive, setIsTutorialActive] = useState(false);
  const [idx, setIdx] = useState(0);
  const [vis, setVis] = useState(true);
  const [done, setDone] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.1);
  const [imgW, setImgW] = useState(NW * 0.1);
  const [imgH, setImgH] = useState(NH * 0.1);

  // Load DM Mono / DM Sans for inline fontFamily used in tour
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap";
    document.head.appendChild(link);
    return () => link.remove();
  }, []);

  const recalc = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const s = Math.min(el.clientWidth / NW, el.clientHeight / NH);
    setScale(s);
    setImgW(Math.round(NW * s));
    setImgH(Math.round(NH * s));
  }, []);

  useEffect(() => {
    recalc();
    const ro = new ResizeObserver(recalc);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [recalc]);

  const goTo = useCallback((i: number) => {
    setVis(false);
    setTimeout(() => {
      setIdx(Math.max(0, Math.min(STEPS.length - 1, i)));
      setVis(true);
    }, 160);
  }, []);

  const next = () =>
    idx < STEPS.length - 1 ? goTo(idx + 1) : setDone(true);
  const prev = () => goTo(idx - 1);

  if (!isTutorialActive) {
    return <Landing onPlayTutorial={() => setIsTutorialActive(true)} />;
  }

  if (done)
    return (
      <Done
        onRestart={() => {
          setDone(false);
          setIdx(0);
          setVis(true);
        }}
      />
    );

  const step = STEPS[idx];
  const pad = Math.max(12, Math.round(16 * scale));

  return (
    <div
      ref={containerRef}
      style={{
        height: "100vh",
        width: "100vw",
        background: COLORS.black,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        overflow: "hidden",
        paddingBottom: 48,
      }}
    >
      <div
        style={{
          position: "relative",
          width: imgW,
          height: imgH,
          flexShrink: 0,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={step.frame}
          src={`/${step.frame}.png`}
          width={imgW}
          height={imgH}
          style={{
            display: "block",
            userSelect: "none",
            animation: "fin .22s ease",
          }}
          draggable={false}
          alt=""
        />

        <Highlight region={step.region} color={step.color} scale={scale} />

        <div
          style={{
            position: "absolute",
            bottom: pad,
            right: pad,
            zIndex: 20,
          }}
        >
          <Card
            step={step}
            idx={idx}
            total={STEPS.length}
            onNext={next}
            onPrev={prev}
            onJump={goTo}
            onClose={() => setIsTutorialActive(false)}
            visible={vis}
          />
        </div>

        <div
          style={{
            position: "absolute",
            top: Math.max(8, 10 * scale),
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 20,
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "rgba(17,17,17,0.82)",
            backdropFilter: "blur(12px)",
            padding: `${Math.max(5, 6 * scale)}px ${Math.max(10, 14 * scale)}px`,
            borderRadius: 999,
            border: `1px solid ${COLORS.borderSoft}`,
            whiteSpace: "nowrap",
          }}
        >
          <img
            src={LOGO_SRC}
            alt="Vega Developer"
            style={{
              height: Math.max(14, 18 * scale),
              width: "auto",
              display: "block",
            }}
          />
          <span
            style={{
              color: COLORS.textMuted,
              fontFamily: "'DM Mono', monospace",
              fontSize: Math.max(8, 10 * scale),
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            interactive tour
          </span>
        </div>
      </div>

      <style>{`@keyframes fin { from { opacity:.2; } to { opacity:1; } }`}</style>
    </div>
  );
}
