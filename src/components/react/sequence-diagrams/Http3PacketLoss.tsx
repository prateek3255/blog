// ─────────────────────────────────────────────────────────────────────────────
// Http3PacketLoss.tsx
//
// Visualizes HTTP/3 (QUIC over UDP) handling a lost packet: only the stream
// whose packet was lost (Stream 5) has to wait for the retransmit, while
// packets for the other streams are delivered to the browser immediately.
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
const C_ACK = "#7A8696";

const DIAGRAM_H = 392;
const BOX_Y = 20;
const BOX_H = DIAGRAM_H - 60;

const { CLIENT_X, SERVER_X, LEFT_EDGE, RIGHT_EDGE, BOX_W, BOX_RX } = LAYOUT;

const ARROW_PITCH = 42;
const FIRST_ARROW_Y = 60;
const ROW = Array.from({ length: 7 }, (_, i) => FIRST_ARROW_Y + i * ARROW_PITCH);

type ScheduledArrow = {
  name: string;
  label: string;
  color: string;
  fromServer: boolean;
  row: number;
  start: number;
  end: number;
  breakAt?: number;
};

const ARROWS: ScheduledArrow[] = [
  { name: "pkt1", label: "Stream 5: Pkt = 1", color: C_STREAM5, fromServer: true, row: 0, start: 0.02, end: 0.13, breakAt: 0.75 },
  { name: "pkt2", label: "Stream 7: Pkt = 2", color: C_STREAM7, fromServer: true, row: 1, start: 0.04, end: 0.15 },
  { name: "pkt3", label: "Stream 3: Pkt = 3", color: C_STREAM3, fromServer: true, row: 2, start: 0.17, end: 0.27 },
  { name: "pkt4", label: "Stream 1: Pkt = 4", color: C_STREAM1, fromServer: true, row: 3, start: 0.29, end: 0.39 },
  { name: "ack1", label: "ACK = 2-4 (1 missing)", color: C_ACK, fromServer: false, row: 4, start: 0.43, end: 0.52 },
  { name: "pkt5", label: "Stream 5: Pkt = 5 (resend of Pkt 1)", color: C_STREAM5, fromServer: true, row: 5, start: 0.58, end: 0.69 },
  { name: "ack2", label: "ACK = 5", color: C_ACK, fromServer: false, row: 6, start: 0.73, end: 0.82 },
];

function arrowProgress(arrow: ScheduledArrow, t: number) {
  if (t < arrow.start) return 0;
  if (t >= arrow.end) return 1;
  return (t - arrow.start) / (arrow.end - arrow.start);
}

const TIMELINE_ANNOTATIONS = [
  { start: 0,    text: "Server sends QUIC packets over UDP, each carrying data from a different HTTP/3 stream" },
  { start: 0.02, text: "Stream 5 packet (Pkt = 1, large-image.jpg 1/3) is sent but lost on the wire" },
  { start: 0.04, text: "Stream 7 packet (Pkt = 2, style.css) is sent right behind it and arrives" },
  { start: 0.17, text: "Stream 3 packet (Pkt = 3, hero.jpg 1/2) arrives and is delivered to the browser immediately" },
  { start: 0.29, text: "Stream 1 packet (Pkt = 4, script.js) is delivered immediately too - nothing waits on Pkt = 1" },
  { start: 0.43, text: "One combined ACK: packets 2-4 received, packet 1 missing - no duplicate ACKs" },
  { start: 0.58, text: "Server resends Stream 5's data in a NEW packet (Pkt = 5) - packet numbers are never reused" },
  { start: 0.73, text: "ACK = 5 - Stream 5's data has arrived and is now delivered to the browser" },
  { start: 0.88, text: "Only Stream 5 waited for the lost packet - Streams 1, 3 and 7 were never blocked" },
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

export default function Http3PacketLoss() {
  const { t, playing, setPlaying, seek } = useSequenceAnimation(14000);
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
          x2={arrow.fromServer ? LEFT_EDGE + 10 : RIGHT_EDGE - 10}
          y2={ROW[arrow.row]}
          color={arrow.color}
          label={arrow.label}
          labelSide="above"
          breakAt={arrow.breakAt}
          visible={t >= arrow.start}
          progress={arrowProgress(arrow, t)}
        />
      ))}

      <TallActorBox x={CLIENT_X} label="Client" fill={C_CLIENT_FILL} bg={C_CLIENT_BG} />
      <TallActorBox x={SERVER_X} label="Server" fill={C_SERVER_FILL} bg={C_SERVER_BG} />
    </SequenceDiagram>
  );
}
