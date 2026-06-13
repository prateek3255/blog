// ─────────────────────────────────────────────────────────────────────────────
// SequenceDiagram.jsx
//
// Composable primitives for building animated sequence diagrams.
//
// Exports:
//   LAYOUT          — shared coordinate constants (W, H, box edges, usable area)
//   ActorBox        — a tall vertical column representing one participant
//   DiagramArrow    — an animated diagonal arrow between two x positions
//   Legend          — a row of color-labeled items below the diagram
//   Controls        — play/pause button + seeker slider
//   SequenceDiagram — the outer shell (SVG canvas + controls + legend)
//   useSequenceAnimation — hook that drives the animation clock
//   buildPhases     — helper that converts a flat step list into timed phases
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect, useRef, type ReactNode } from "react";

// ── shared layout ─────────────────────────────────────────────────────────────
export const LAYOUT = {
  W: 680,
  H: 400,
  BOX_W: 100,
  BOX_RX: 8,
  PADDING_TOP: 20,
  PADDING_BOTTOM: 20,
  get BOX_H() { return this.H - this.PADDING_TOP - this.PADDING_BOTTOM; },
  get BOX_Y() { return this.PADDING_TOP; },
  get CLIENT_X() { return 40; },
  get SERVER_X() { return this.W - 40 - this.BOX_W; },
  // Usable vertical space for arrows (below header, above annotation)
  get USABLE_TOP()    { return this.BOX_Y + 80; },
  get USABLE_BOTTOM() { return this.BOX_Y + this.BOX_H - 40; },
  get USABLE_H()      { return this.USABLE_BOTTOM - this.USABLE_TOP; },
  // Horizontal edges where arrows start/end
  get LEFT_EDGE()  { return this.CLIENT_X + this.BOX_W; },
  get RIGHT_EDGE() { return this.SERVER_X; },
};

// ── easing ────────────────────────────────────────────────────────────────────
function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

// ── buildPhases ───────────────────────────────────────────────────────────────
// Converts a flat array of steps into timed phases that span [0..1].
//
// Each step can be:
//   { type: "arrow", ... }   — an arrow drawing, takes `weight` units of time
//   { type: "pause", ... }   — a hold/pause between arrows, takes `weight` units
//
// Example:
//   buildPhases([
//     { type: "pause", name: "start",  weight: 0.5 },
//     { type: "arrow", name: "syn",    weight: 2 },
//     { type: "pause", name: "pause1", weight: 1 },
//     { type: "arrow", name: "synack", weight: 2 },
//   ])
export interface Step {
  type: string;
  name?: string;
  weight?: number;
  [key: string]: unknown;
}

export type Phase = Step & { start: number; end: number };

export function buildPhases(steps: Step[]): Phase[] {
  const total = steps.reduce((s: number, p: Step) => s + (p.weight ?? 1), 0);
  let cursor = 0;
  return steps.map((step: Step) => {
    const w = step.weight ?? 1;
    const phase = { ...step, start: cursor / total, end: (cursor + w) / total };
    cursor += w;
    return phase;
  });
}

// ── useSequenceAnimation ──────────────────────────────────────────────────────
// Drives a t value from 0→1 over `duration` ms, looping.
// Returns { t, playing, setPlaying, seek }
//
// Usage:
//   const { t, playing, setPlaying, seek } = useSequenceAnimation(5000);
export function useSequenceAnimation(duration = 5000) {
  const rafRef      = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const tRef        = useRef(0);
  const [t, setT]             = useState(0);
  const [playing, setPlaying] = useState(false);

  function seek(val: number) {
    const clamped = Math.max(0, Math.min(1, val));
    tRef.current = clamped;
    setT(clamped);
  }

  useEffect(() => {
    if (!playing) {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      lastTimeRef.current = null;
      return;
    }
    function tick(now: number) {
      if (!lastTimeRef.current) lastTimeRef.current = now;
      const dt = now - lastTimeRef.current;
      lastTimeRef.current = now;
      let next = tRef.current + dt / duration;
      if (next >= 1) {
        tRef.current = 1;
        setT(1);
        setPlaying(false);
        return;
      }
      tRef.current = Math.max(0, Math.min(1, next));
      setT(tRef.current);
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); };
  }, [playing, duration]);

  return { t, playing, setPlaying, seek };
}

// ── ActorBox ──────────────────────────────────────────────────────────────────
// A full-height column representing a participant (Client, Server, etc.)
//
// Props:
//   x          — left x position (use LAYOUT.CLIENT_X or LAYOUT.SERVER_X)
//   label      — display name shown in the header band
//   fill       — header band + border color
//   bg         — column background color
//   stateText  — small text shown below the header (e.g. "ESTABLISHED")
//   stateColor — color of the state text
interface ActorBoxProps {
  x: number;
  label: string;
  fill: string;
  bg: string;
}

export function ActorBox({ x, label, fill, bg }: ActorBoxProps) {
  const { BOX_Y, BOX_H, BOX_W, BOX_RX } = LAYOUT;

  return (
    <g>
      <rect
        x={x} y={BOX_Y} width={BOX_W} height={BOX_H}
        rx={BOX_RX} fill={bg} stroke={fill} strokeWidth={1.5}
      />
      <text
        x={x + BOX_W / 2} y={BOX_Y + BOX_H / 2}
        textAnchor="middle" dominantBaseline="middle"
        fill={fill} fontSize={14} fontWeight={600}
      >
        {label}
      </text>
    </g>
  );
}

// ── DiagramArrow ──────────────────────────────────────────────────────────────
// An animated diagonal arrow drawn using stroke-dashoffset.
//
// Props:
//   x1, y1     — start point
//   x2, y2     — end point
//   color      — stroke + fill color
//   progress   — 0..1, how far the arrow has drawn (from useSequenceAnimation)
//   visible    — if false, renders nothing (arrow hasn't started yet)
interface DiagramArrowProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  label?: string;
  progress: number;
  visible: boolean;
}

export function DiagramArrow({ x1, y1, x2, y2, color, label, progress, visible }: DiagramArrowProps) {
  if (!visible) return null;

  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  const drawn = easeInOut(Math.max(0, progress));
  const offset = len * (1 - drawn);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  const textAngle = Math.abs(angle) > 90 ? angle + 180 : angle;
  const tipX = x1 + dx * drawn;
  const tipY = y1 + dy * drawn;
  const midX = x1 + dx * 0.5;
  const midY = y1 + dy * 0.5;
  const normalX = dy / len;
  const normalY = -dx / len;
  const labelOffset = normalY <= 0 ? 12 : -12;
  const labelX = midX + normalX * labelOffset;
  const labelY = midY + normalY * labelOffset;

  return (
    <g>
      <line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={color} strokeWidth={2.5}
        strokeDasharray={len} strokeDashoffset={offset}
        strokeLinecap="round"
      />
      {progress > 0.02 && (
        <polygon
          points="-9,0 0,-5.5 0,5.5"
          fill={color}
          transform={`translate(${tipX},${tipY}) rotate(${angle + 180})`}
        />
      )}
      {label && drawn >= 0.5 && (
        <text
          x={labelX} y={labelY}
          textAnchor="middle" dominantBaseline="middle"
          fill={color} fontSize={12} fontWeight={600}
          transform={`rotate(${textAngle}, ${labelX}, ${labelY})`}
        >
          {label}
        </text>
      )}
    </g>
  );
}

// ── Legend ────────────────────────────────────────────────────────────────────
// A row of color-labeled items shown below the diagram.
//
// Props:
//   items — [{ color: string, label: string }]
interface LegendItem {
  color: string;
  label: string;
}

interface LegendProps {
  items: LegendItem[];
}

export function Legend({ items }: LegendProps) {
  return (
    <div style={{ display: "flex", gap: 20, padding: "8px 4px 0", flexWrap: "wrap" }}>
      {items.map(({ color, label }: LegendItem) => (
        <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#888" }}>
          <svg width="22" height="10" viewBox="0 0 22 10">
            <line x1="0" y1="5" x2="15" y2="5" stroke={color} strokeWidth="2.5" />
            <polygon points="15,1.5 22,5 15,8.5" fill={color} />
          </svg>
          {label}
        </div>
      ))}
    </div>
  );
}

// ── Controls ──────────────────────────────────────────────────────────────────
// Play/pause button + seeker slider.
//
// Props:
//   t          — current animation value 0..1
//   playing    — boolean
//   setPlaying — setter
//   seek       — function(0..1)
interface ControlsProps {
  t: number;
  playing: boolean;
  setPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  seek: (val: number) => void;
}

export function Controls({ t, playing, setPlaying, seek }: ControlsProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 4px 0" }}>
      <button
        onClick={() => {
        if (!playing && t >= 1) seek(0);
        setPlaying(p => !p);
      }}
        style={{
          width: 36, height: 36, borderRadius: "50%",
          border: "0.5px solid #ccc", background: "#fff",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {playing ? (
          <svg width="14" height="14" viewBox="0 0 16 16">
            <rect x="3" y="2" width="4" height="12" rx="1" fill="#222" />
            <rect x="9" y="2" width="4" height="12" rx="1" fill="#222" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 16 16">
            <polygon points="4,2 13,8 4,14" fill="#222" />
          </svg>
        )}
      </button>
      <input
        type="range" min={0} max={1000} step={1}
        value={Math.round(t * 1000)}
        onChange={e => { setPlaying(false); seek(parseInt(e.target.value) / 1000); }}
        style={{ flex: 1 }}
      />
      <span style={{ fontSize: 12, color: "#888", minWidth: 32, textAlign: "right" }}>
        {Math.round(t * 100)}%
      </span>
    </div>
  );
}

// ── SequenceDiagram ───────────────────────────────────────────────────────────
// The outer shell: SVG canvas + controls + legend.
// Children are rendered inside the SVG (use ActorBox, DiagramArrow etc.)
//
// Props:
//   t          — from useSequenceAnimation
//   playing    — from useSequenceAnimation
//   setPlaying — from useSequenceAnimation
//   seek       — from useSequenceAnimation
//   annotation — string shown at the bottom of the SVG
//   legendItems— passed to <Legend>
//   children   — SVG elements (ActorBox, DiagramArrow, etc.)
interface SequenceDiagramProps {
  t: number;
  playing: boolean;
  setPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  seek: (val: number) => void;
  annotation?: string;
  legendItems?: LegendItem[];
  children?: ReactNode;
}

export function SequenceDiagram({ t, playing, setPlaying, seek, annotation, legendItems = [], children }: SequenceDiagramProps) {
  const { W, H } = LAYOUT;
  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: W, margin: "0 auto", padding: "16px 0" }}>
      <svg
        viewBox={`0 0 ${W} ${H}`} width="100%"
        style={{ display: "block", border: "0.5px solid #e0e0e0", borderRadius: 8, background: "#fff" }}
      >
        {children}
        {annotation && (
          <text x={W / 2} y={H - 8} textAnchor="middle" dominantBaseline="auto" fill="#aaa" fontSize={11}>
            {annotation}
          </text>
        )}
      </svg>
      <Controls t={t} playing={playing} setPlaying={setPlaying} seek={seek} />
      {legendItems.length > 0 && <Legend items={legendItems} />}
    </div>
  );
}
