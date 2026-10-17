// ─────────────────────────────────────────────────────────────────────────────
// Http2Multiplexing.jsx
//
// Visualizes HTTP/2 stream multiplexing over a single TCP connection: four
// requests fire back-to-back without waiting on each other, and the server's
// responses interleave freely -- a fully-loaded stream (the large image)
// never blocks a smaller one (style.css) from completing sooner.
// ─────────────────────────────────────────────────────────────────────────────

import {
  LAYOUT,
  useSequenceAnimation,
  DiagramArrow,
  SequenceDiagram,
} from "./SequenceDiagram";

const C_CLIENT_FILL = "#2D5FA8";
const C_CLIENT_BG = "#EAF0FB";
const C_SERVER_FILL = "#246B47";
const C_SERVER_BG = "#E4F5EE";

// One color per stream, reused for both its request and all of its response
// arrows -- makes it easy to visually track a single stream as its messages
// interleave with the others on the shared connection.
const C_STREAM1 = "#5B8FD4"; // script.js
const C_STREAM3 = "#57A87B"; // hero.jpg
const C_STREAM5 = "#8B5FBF"; // large-image.jpg
const C_STREAM7 = "#D68A3D"; // style.css

const DIAGRAM_H = 560;
const BOX_Y = 20;
const BOX_H = DIAGRAM_H - 60;

const { CLIENT_X, SERVER_X, LEFT_EDGE, RIGHT_EDGE, BOX_W, BOX_RX } = LAYOUT;

// Arrows are laid out in the order they happen on the wire (not grouped by
// stream), one row each with a constant gap between rows.
const ARROW_PITCH = 42;
const FIRST_ARROW_Y = 60;
const ROW = Array.from({ length: 11 }, (_, i) => FIRST_ARROW_Y + i * ARROW_PITCH);

type ScheduledArrow = {
  name: string;
  label?: string;
  labelSide?: "above" | "below";
  color: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  start: number;
  end: number;
};

const ARROWS: ScheduledArrow[] = [
  {
    name: "req1",
    label: "Stream 1: GET /script.js",
    labelSide: "above",
    color: C_STREAM1,
    x1: LEFT_EDGE, y1: ROW[0],
    x2: RIGHT_EDGE - 10, y2: ROW[0],
    start: 0.03, end: 0.14,
  },
  {
    name: "req3",
    label: "Stream 3: GET /hero.jpg",
    labelSide: "above",
    color: C_STREAM3,
    x1: LEFT_EDGE, y1: ROW[1],
    x2: RIGHT_EDGE - 10, y2: ROW[1],
    start: 0.08, end: 0.19,
  },
  {
    name: "req5",
    label: "Stream 5: GET /large-image.jpg",
    labelSide: "above",
    color: C_STREAM5,
    x1: LEFT_EDGE, y1: ROW[2],
    x2: RIGHT_EDGE - 10, y2: ROW[2],
    start: 0.13, end: 0.24,
  },
  {
    name: "req7",
    label: "Stream 7: GET /style.css",
    labelSide: "above",
    color: C_STREAM7,
    x1: LEFT_EDGE, y1: ROW[3],
    x2: RIGHT_EDGE - 10, y2: ROW[3],
    start: 0.18, end: 0.29,
  },
  {
    name: "resp1",
    label: "Stream 1: 200 OK",
    labelSide: "above",
    color: C_STREAM1,
    x1: RIGHT_EDGE, y1: ROW[4],
    x2: LEFT_EDGE + 10, y2: ROW[4],
    start: 0.34, end: 0.45,
  },
  {
    name: "resp3a",
    label: "Stream 3: 200 OK (1/2)",
    labelSide: "above",
    color: C_STREAM3,
    x1: RIGHT_EDGE, y1: ROW[5],
    x2: LEFT_EDGE + 10, y2: ROW[5],
    start: 0.40, end: 0.51,
  },
  {
    name: "resp5a",
    label: "Stream 5: 200 OK (1/3)",
    labelSide: "above",
    color: C_STREAM5,
    x1: RIGHT_EDGE, y1: ROW[6],
    x2: LEFT_EDGE + 10, y2: ROW[6],
    start: 0.46, end: 0.57,
  },
  {
    name: "resp7",
    label: "Stream 7: 200 OK",
    labelSide: "above",
    color: C_STREAM7,
    x1: RIGHT_EDGE, y1: ROW[7],
    x2: LEFT_EDGE + 10, y2: ROW[7],
    start: 0.52, end: 0.63,
  },
  {
    name: "resp3b",
    label: "Stream 3: 200 OK (2/2)",
    labelSide: "above",
    color: C_STREAM3,
    x1: RIGHT_EDGE, y1: ROW[8],
    x2: LEFT_EDGE + 10, y2: ROW[8],
    start: 0.58, end: 0.69,
  },
  {
    name: "resp5b",
    label: "Stream 5: 200 OK (2/3)",
    labelSide: "above",
    color: C_STREAM5,
    x1: RIGHT_EDGE, y1: ROW[9],
    x2: LEFT_EDGE + 10, y2: ROW[9],
    start: 0.74, end: 0.85,
  },
  {
    name: "resp5c",
    label: "Stream 5: 200 OK (3/3)",
    labelSide: "above",
    color: C_STREAM5,
    x1: RIGHT_EDGE, y1: ROW[10],
    x2: LEFT_EDGE + 10, y2: ROW[10],
    start: 0.78, end: 0.89,
  },
];

function arrowProgress(arrow: ScheduledArrow, t: number) {
  if (t < arrow.start) return 0;
  if (t >= arrow.end) return 1;
  return Math.max(0, Math.min(1, (t - arrow.start) / (arrow.end - arrow.start)));
}

function isVisible(arrow: ScheduledArrow, t: number) {
  return t >= arrow.start;
}

const TIMELINE_ANNOTATIONS = [
  { start: 0,    text: "A single TCP connection carries every request and response, multiplexed as independent streams" },
  { start: 0.03, text: "Stream 1 request: GET /script.js" },
  { start: 0.08, text: "Stream 3 request: GET /hero.jpg — sent right away, without waiting for script.js to arrive or respond" },
  { start: 0.13, text: "Stream 5 request: GET /large-image.jpg — still in flight while the next request is already sent" },
  { start: 0.18, text: "Stream 7 request: GET /style.css — all four requests fired back-to-back on the same connection" },
  { start: 0.34, text: "Stream 1 response: 200 OK (script.js)" },
  { start: 0.40, text: "Stream 3 response: 200 OK (hero.jpg, 1/2)" },
  { start: 0.46, text: "Stream 5 response: 200 OK (large-image.jpg, 1/3) — the large image starts streaming, interleaved with the others" },
  { start: 0.52, text: "Stream 7 response: 200 OK (style.css) — delivered in between large-image's chunks instead of waiting behind it" },
  { start: 0.58, text: "Stream 3 response: 200 OK (hero.jpg, 2/2) — hero.jpg completes without waiting for the large image" },
  { start: 0.74, text: "Stream 5 response: 200 OK (large-image.jpg, 2/3)" },
  { start: 0.78, text: "Stream 5 response: 200 OK (large-image.jpg, 3/3) — large image finishes last, but nothing else had to wait on it" },
  { start: 0.93, text: "HTTP/2 multiplexing avoids head-of-line blocking at the application layer" },
];

function getAnnotation(t: number) {
  const active = TIMELINE_ANNOTATIONS.slice().reverse().find(item => t >= item.start);
  return active?.text ?? "";
}

function TallActorBox({ x, label, fill, bg }: { x: number; label: string; fill: string; bg: string }) {
  return (
    <g>
      <rect x={x} y={BOX_Y} width={BOX_W} height={BOX_H} rx={BOX_RX} fill={bg} stroke={fill} strokeWidth={1.5} />
      <text
        x={x + BOX_W / 2}
        y={BOX_Y + BOX_H / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={fill}
        fontSize={14}
        fontWeight={600}
      >
        {label}
      </text>
    </g>
  );
}

export default function Http2Multiplexing() {
  const { t, playing, setPlaying, seek } = useSequenceAnimation(10000);
  const annotation = getAnnotation(t);

  return (
    <SequenceDiagram
      t={t}
      playing={playing}
      setPlaying={setPlaying}
      seek={seek}
      annotation={annotation}
      viewBoxHeight={DIAGRAM_H}
    >
      {ARROWS.map(arrow => (
        <DiagramArrow
          key={arrow.name}
          x1={arrow.x1}
          y1={arrow.y1}
          x2={arrow.x2}
          y2={arrow.y2}
          color={arrow.color}
          label={arrow.label}
          labelSide={arrow.labelSide}
          visible={isVisible(arrow, t)}
          progress={arrowProgress(arrow, t)}
        />
      ))}

      <TallActorBox x={CLIENT_X} label="Client" fill={C_CLIENT_FILL} bg={C_CLIENT_BG} />
      <TallActorBox x={SERVER_X} label="Server" fill={C_SERVER_FILL} bg={C_SERVER_BG} />
    </SequenceDiagram>
  );
}
