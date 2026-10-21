// ─────────────────────────────────────────────────────────────────────────────
// Http2HeadOfLineBlocking.tsx
//
// Visualizes TCP-level head-of-line blocking under HTTP/2: one lost segment
// (Stream 5) stalls delivery of later segments that belong to completely
// unrelated streams, until the lost segment is retransmitted.
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

const C_STREAM1 = "#5B8FD4"; // script.js
const C_STREAM3 = "#57A87B"; // hero.jpg
const C_STREAM5 = "#8B5FBF"; // large-image.jpg
const C_STREAM7 = "#D68A3D"; // style.css
const C_STREAM8 = "#C2549B"; // new request, after the loss is recovered
const C_ACK = "#7A8696";

const DIAGRAM_H = 564;
const BOX_Y = 20;
const BOX_H = DIAGRAM_H - 60;

const { CLIENT_X, SERVER_X, LEFT_EDGE, RIGHT_EDGE, BOX_W, BOX_RX } = LAYOUT;

const BUFFER_GAP = 8;
const BUFFER_W = 100;
const BUFFER_X = LEFT_EDGE + BUFFER_GAP;
const BUFFER_RIGHT = BUFFER_X + BUFFER_W;

const BUFFER_TITLE_Y = 246;

const ARROW_PITCH = 42;
const FIRST_ARROW_Y = 60;
const ROW = Array.from({ length: 11 }, (_, i) => FIRST_ARROW_Y + i * ARROW_PITCH);

type ScheduledArrow = {
  name: string;
  label: string;
  color: string;
  fromServer: boolean;
  row: number;
  start: number;
  end: number;
  breakAt?: number;
  throughBuffer?: boolean;
};

const ARROWS: ScheduledArrow[] = [
  { name: "seg1", label: "Stream 5: Seq = 1000", color: C_STREAM5, fromServer: true, row: 0, start: 0.016, end: 0.096, breakAt: 0.8 },
  { name: "seg2", label: "Stream 7: Seq = 1100", color: C_STREAM7, fromServer: true, row: 1, start: 0.032, end: 0.112 },
  { name: "ack1", label: "ACK = 1000", color: C_ACK, fromServer: false, row: 2, start: 0.128, end: 0.192 },
  { name: "seg3", label: "Stream 3: Seq = 1200", color: C_STREAM3, fromServer: true, row: 3, start: 0.208, end: 0.28 },
  { name: "ack2", label: "ACK = 1000", color: C_ACK, fromServer: false, row: 4, start: 0.296, end: 0.36 },
  { name: "seg4", label: "Stream 1: Seq = 1300", color: C_STREAM1, fromServer: true, row: 5, start: 0.376, end: 0.448 },
  { name: "ack3", label: "ACK = 1000", color: C_ACK, fromServer: false, row: 6, start: 0.464, end: 0.528 },
  { name: "retry", label: "Stream 5: Seq = 1000", color: C_STREAM5, fromServer: true, row: 7, start: 0.576, end: 0.656 },
  { name: "ack4", label: "ACK = 1400", color: C_ACK, fromServer: false, row: 8, start: 0.672, end: 0.736 },
  { name: "pkt8", label: "Stream 8: Seq = 1400", color: C_STREAM8, fromServer: true, row: 9, start: 0.77, end: 0.85, throughBuffer: true },
  { name: "ack5", label: "ACK = 1500", color: C_ACK, fromServer: false, row: 10, start: 0.87, end: 0.94 },
];

function arrowProgress(arrow: ScheduledArrow, t: number) {
  if (t < arrow.start) return 0;
  if (t >= arrow.end) return 1;
  return (t - arrow.start) / (arrow.end - arrow.start);
}

const TIMELINE_ANNOTATIONS = [
  { start: 0,    text: "Server sends TCP segments, each carrying data from a different HTTP/2 stream" },
  { start: 0.016, text: "Stream 5 segment (Seq = 1000, large-image.jpg 1/3) is sent but lost on the wire" },
  { start: 0.032, text: "Stream 7 segment (Seq = 1100, style.css) arrives out of order and waits in the TCP buffer" },
  { start: 0.128, text: "Client can't deliver Seq = 1100 yet, so it sends a duplicate ACK = 1000 (still waiting for 1000)" },
  { start: 0.208, text: "Stream 3 segment (Seq = 1200, hero.jpg 1/2) also arrives out of order and waits in the buffer" },
  { start: 0.296, text: "Another duplicate ACK = 1000 - the client is still waiting for byte 1000" },
  { start: 0.376, text: "Stream 1 segment (Seq = 1300, script.js) arrives, but TCP keeps it in the buffer as well" },
  { start: 0.464, text: "Third duplicate ACK - the server treats Seq = 1000 as lost and triggers a fast retransmit" },
  { start: 0.576, text: "Server retransmits Stream 5 (Seq = 1000) without waiting for a timeout" },
  { start: 0.672, text: "ACK = 1400 - everything up to 1400 received, so buffered data goes to the browser" },
  { start: 0.77, text: "New segment: Stream 8 (Seq = 1400) now passes straight through the buffer to the client" },
  { start: 0.87, text: "ACK = 1500 - Stream 8 is delivered and acknowledged normally, nothing is held up anymore" },
  { start: 0.95, text: "Streams 1, 3 and 7 were stuck behind Stream 5's lost segment - HOL blocking at TCP" },
];

function getAnnotation(t: number) {
  const active = TIMELINE_ANNOTATIONS.slice().reverse().find(item => t >= item.start);
  return active?.text ?? "";
}

// Text shown in brackets under the "TCP buffer" title: which streams' data is
// currently held back, until the retransmitted Stream 5 segment arrives.
function bufferLines(t: number): string[] {
  const arrow = (name: string) => ARROWS.find(a => a.name === name)!;
  if (t < arrow("seg2").end) return ["(empty)"];
  if (t < arrow("seg3").end) return ["(Stream 7)"];
  if (t < arrow("seg4").end) return ["(Streams", "7, 3)"];
  if (t < arrow("retry").start) return ["(Streams", "7, 3, 1)"];
  if (t < arrow("retry").end) return ["(Stream 5", "retransmitted)"];
  return ["(All streams", "in buffer", "delivered)"];
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

export default function Http2HeadOfLineBlocking() {
  const { t, playing, setPlaying, seek } = useSequenceAnimation(20000);
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
          x1={arrow.fromServer ? RIGHT_EDGE : LEFT_EDGE}
          y1={ROW[arrow.row]}
          x2={arrow.fromServer ? (arrow.throughBuffer ? LEFT_EDGE + 10 : BUFFER_RIGHT + 10) : RIGHT_EDGE - 10}
          y2={ROW[arrow.row]}
          color={arrow.color}
          label={arrow.label}
          labelSide="above"
          breakAt={arrow.breakAt}
          visible={t >= arrow.start}
          progress={arrowProgress(arrow, t)}
        />
      ))}

      <rect
        x={BUFFER_X}
        y={BOX_Y}
        width={BUFFER_W}
        height={BOX_H}
        rx={BOX_RX}
        fill="none"
        stroke={C_CLIENT_FILL}
        strokeWidth={1.5}
        strokeDasharray="5 4"
      />
      <text
        x={BUFFER_X + BUFFER_W / 2}
        y={BUFFER_TITLE_Y}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={C_CLIENT_FILL}
        fontSize={13}
        fontWeight={700}
      >
        TCP buffer
      </text>
      {bufferLines(t).map((line, i) => (
        <text
          key={i}
          x={BUFFER_X + BUFFER_W / 2}
          y={BUFFER_TITLE_Y + 17 + i * 15}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={C_CLIENT_FILL}
          fontSize={12}
          fontWeight={600}
          opacity={0.9}
        >
          {line}
        </text>
      ))}

      <TallActorBox x={CLIENT_X} label="Client" fill={C_CLIENT_FILL} bg={C_CLIENT_BG} />
      <TallActorBox x={SERVER_X} label="Server" fill={C_SERVER_FILL} bg={C_SERVER_BG} />
    </SequenceDiagram>
  );
}
