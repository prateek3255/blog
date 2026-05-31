// ─────────────────────────────────────────────────────────────────────────────
// TCPHandshake.jsx
//
// TCP three-way handshake built with SequenceDiagram primitives.
// Shows how to wire up buildPhases, useSequenceAnimation, ActorBox,
// DiagramArrow, and SequenceDiagram together.
// ─────────────────────────────────────────────────────────────────────────────

import {
  LAYOUT,
  buildPhases,
  useSequenceAnimation,
  ActorBox,
  DiagramArrow,
  SequenceDiagram,
} from "./SequenceDiagram";

// ── colors ────────────────────────────────────────────────────────────────────
const C_CLIENT_FILL = "#2D5FA8";
const C_CLIENT_BG   = "#EAF0FB";
const C_SERVER_FILL = "#246B47";
const C_SERVER_BG   = "#E4F5EE";
const C_SYN         = "#5B8FD4";
const C_SYNACK      = "#57A87B";
const C_ACK         = "#E5954A";

// ── phases ────────────────────────────────────────────────────────────────────
// type:"arrow" phases map 1:1 to arrows below.
// type:"pause" phases are gaps between arrows (server/client processing time).
const PHASES = buildPhases([
  { type: "pause", name: "start",  weight: 0.5 },
  { type: "arrow", name: "syn",    weight: 2 },
  { type: "pause", name: "pause1", weight: 1 },
  { type: "arrow", name: "synack", weight: 2 },
  { type: "pause", name: "pause2", weight: 0.8 },
  { type: "arrow", name: "ack",    weight: 1.5 },
  { type: "pause", name: "done",   weight: 0.5 },
]);

// Phase lookup helper
function getPhase(name: string) { return PHASES.find(p => p.name === name); }
function phaseProgress(name: string, t: number): number {
  const p = getPhase(name);
  if (!p) return 0;
  return Math.max(0, Math.min(1, (t - p.start) / (p.end - p.start)));
}

// Which arrow index is active (or completed) at time t
function activeArrowIndex(t: number): number {
  const arrowPhases = PHASES.filter(p => p.type === "arrow");
  let idx = -1;
  arrowPhases.forEach((p, i) => { if (t >= p.start) idx = i; });
  return idx;
}

// ── arrows ────────────────────────────────────────────────────────────────────
// Zigzag: each arrow's fromY = previous arrow's toY.
const { LEFT_EDGE: CE, RIGHT_EDGE: SE, USABLE_TOP, USABLE_H } = LAYOUT;

const ARROWS = [
  {
    name: "syn", color: C_SYN,
    x1: CE, y1: USABLE_TOP + USABLE_H * 0.0,
    x2: SE, y2: USABLE_TOP + USABLE_H * 0.32,
  },
  {
    name: "synack", color: C_SYNACK,
    x1: SE, y1: USABLE_TOP + USABLE_H * 0.32,
    x2: CE, y2: USABLE_TOP + USABLE_H * 0.65,
  },
  {
    name: "ack", color: C_ACK,
    x1: CE, y1: USABLE_TOP + USABLE_H * 0.65,
    x2: SE, y2: USABLE_TOP + USABLE_H * 1.0,
  },
];

// ── state labels shown inside boxes ──────────────────────────────────────────
type BoxState = "idle" | "syn" | "synack" | "ack";

function getBoxState(t: number): BoxState {
  const syn    = getPhase("syn");
  const synack = getPhase("synack");
  const ack    = getPhase("ack");
  if (!syn || !synack || !ack) return "idle";
  if (t < syn.start)    return "idle";
  if (t < synack.start) return "syn";
  if (t < ack.start)    return "synack";
  return "ack";
}

const CLIENT_STATES = {
  idle:   { text: "CLOSED",      color: "#7090c0" },
  syn:    { text: "SYN_SENT",    color: "#4a78b8" },
  synack: { text: "ESTABLISHED", color: "#2D5FA8" },
  ack:    { text: "ESTABLISHED", color: "#2D5FA8" },
};
const SERVER_STATES = {
  idle:   { text: "LISTEN",       color: "#50a070" },
  syn:    { text: "SYN_RECEIVED", color: "#3a8060" },
  synack: { text: "SYN_RECEIVED", color: "#3a8060" },
  ack:    { text: "ESTABLISHED",  color: "#246B47" },
};

// ── annotation text per phase ─────────────────────────────────────────────────
const ANNOTATIONS = {
  start:  "Waiting to connect...",
  syn:    "SYN - client initiates: 'I want to connect'",
  pause1: "Server processing SYN...",
  synack: "SYN-ACK - server responds: 'OK, acknowledged'",
  pause2: "Client processing SYN-ACK...",
  ack:    "ACK - client confirms: 'Connected!'",
  done:   "Handshake complete - connection established",
};

function getAnnotation(t: number): string {
  const active = PHASES.slice().reverse().find(p => t >= p.start);
  return (active?.name ? ANNOTATIONS[active.name as keyof typeof ANNOTATIONS] : undefined) ?? "";
}

// ── legend ────────────────────────────────────────────────────────────────────
const LEGEND = [
  { color: C_SYN,    label: "SYN - synchronise" },
  { color: C_SYNACK, label: "SYN-ACK - synchronise + acknowledge" },
  { color: C_ACK,    label: "ACK - acknowledge" },
];

// ── component ─────────────────────────────────────────────────────────────────
export default function TCPHandshake() {
  const { t, playing, setPlaying, seek } = useSequenceAnimation(5200);

  const boxState   = getBoxState(t);
  const activeIdx  = activeArrowIndex(t);
  const annotation = getAnnotation(t);

  const { CLIENT_X, SERVER_X } = LAYOUT;

  return (
    <SequenceDiagram
      t={t} playing={playing} setPlaying={setPlaying} seek={seek}
      annotation={annotation}
      legendItems={LEGEND}
    >
      {/* Arrows first so box edges clip their tips */}
      {ARROWS.map((arrow, i) => (
        <DiagramArrow
          key={arrow.name}
          x1={arrow.x1} y1={arrow.y1}
          x2={arrow.x2} y2={arrow.y2}
          color={arrow.color}
          visible={i <= activeIdx}
          progress={
            i < activeIdx ? 1 : phaseProgress(arrow.name, t)
          }
        />
      ))}

      {/* Boxes on top */}
      <ActorBox
        x={CLIENT_X} label="Client"
        fill={C_CLIENT_FILL} bg={C_CLIENT_BG}
        stateText={CLIENT_STATES[boxState].text}
        stateColor={CLIENT_STATES[boxState].color}
      />
      <ActorBox
        x={SERVER_X} label="Server"
        fill={C_SERVER_FILL} bg={C_SERVER_BG}
        stateText={SERVER_STATES[boxState].text}
        stateColor={SERVER_STATES[boxState].color}
      />
    </SequenceDiagram>
  );
}