import {
  LAYOUT,
  buildPhases,
  useSequenceAnimation,
  ActorBox,
  DiagramArrow,
  SequenceDiagram,
} from "./SequenceDiagram";

const C_CLIENT_FILL = "#2D5FA8";
const C_CLIENT_BG = "#EAF0FB";
const C_SERVER_FILL = "#246B47";
const C_SERVER_BG = "#E4F5EE";
const C_CLIENT_PACKET = "#5B8FD4";
const C_SERVER_PACKET = "#57A87B";
const C_ACK = "#E5954A";

const PHASES = buildPhases([
  { type: "pause", name: "start", weight: 0.5 },
  { type: "arrow", name: "clientPacket1", weight: 1.6 },
  { type: "arrow", name: "serverAck1", weight: 1.2 },
  { type: "pause", name: "settle1", weight: 0.7 },
  { type: "arrow", name: "serverPacket1", weight: 1.6 },
  { type: "arrow", name: "clientAck1", weight: 1.2 },
  { type: "pause", name: "settle2", weight: 0.7 },
  { type: "arrow", name: "clientPacket2", weight: 1.6 },
  { type: "pause", name: "timeout1", weight: 2.5 },
  { type: "arrow", name: "clientRetry1", weight: 1.6 },
  { type: "pause", name: "timeout2", weight: 2.5 },
  { type: "arrow", name: "clientRetry2", weight: 1.6 },
  { type: "arrow", name: "serverAck2", weight: 1.2 },
  { type: "pause", name: "done", weight: 0.8 },
]);

function getPhase(name: string) {
  return PHASES.find(p => p.name === name);
}

function phaseProgress(name: string, t: number): number {
  const p = getPhase(name);
  if (!p) return 0;
  return Math.max(0, Math.min(1, (t - p.start) / (p.end - p.start)));
}

function activeArrowIndex(t: number): number {
  const arrowPhases = PHASES.filter(p => p.type === "arrow");
  let idx = -1;
  arrowPhases.forEach((p, i) => {
    if (t >= p.start) idx = i;
  });
  return idx;
}

const { CLIENT_X, SERVER_X, LEFT_EDGE, RIGHT_EDGE, BOX_W, USABLE_TOP } = LAYOUT;
const SERVER_CENTER = SERVER_X + BOX_W / 2;
const ROW_TOP_SHIFT = -45;
const ACK_GAP = 12;
const PAIR_GAP = 62;
const RETRY_GAP = 54;
const FIRST_PACKET_Y = USABLE_TOP + ROW_TOP_SHIFT;
const ROWS = [
  FIRST_PACKET_Y,
  FIRST_PACKET_Y + ACK_GAP + PAIR_GAP,
  FIRST_PACKET_Y + (ACK_GAP + PAIR_GAP) * 2,
  FIRST_PACKET_Y + (ACK_GAP + PAIR_GAP) * 2 + RETRY_GAP,
  FIRST_PACKET_Y + (ACK_GAP + PAIR_GAP) * 2 + RETRY_GAP * 2,
];

function rowY(index: number) {
  return ROWS[index];
}

const ARROWS = [
  {
    name: "clientPacket1",
    label: "PACKET (CP1)",
    labelSide: "above" as const,
    color: C_CLIENT_PACKET,
    x1: LEFT_EDGE,
    y1: rowY(0),
    x2: RIGHT_EDGE - 10,
    y2: rowY(0),
  },
  {
    name: "serverAck1",
    label: "ACK",
    labelSide: "below" as const,
    color: C_ACK,
    x1: RIGHT_EDGE,
    y1: rowY(0) + ACK_GAP,
    x2: LEFT_EDGE + 10,
    y2: rowY(0) + ACK_GAP,
  },
  {
    name: "serverPacket1",
    label: "PACKET (SP1)",
    labelSide: "above" as const,
    color: C_SERVER_PACKET,
    x1: RIGHT_EDGE,
    y1: rowY(1),
    x2: LEFT_EDGE + 10,
    y2: rowY(1),
  },
  {
    name: "clientAck1",
    label: "ACK",
    labelSide: "below" as const,
    color: C_ACK,
    x1: LEFT_EDGE,
    y1: rowY(1) + ACK_GAP,
    x2: RIGHT_EDGE - 10,
    y2: rowY(1) + ACK_GAP,
  },
  {
    name: "clientPacket2",
    label: "PACKET (CP2)",
    labelSide: "above" as const,
    color: C_CLIENT_PACKET,
    x1: LEFT_EDGE,
    y1: rowY(2),
    x2: RIGHT_EDGE - 10,
    y2: rowY(2),
  },
  {
    name: "clientRetry1",
    label: "RETRY (CP2)",
    labelSide: "above" as const,
    color: C_CLIENT_PACKET,
    x1: LEFT_EDGE,
    y1: rowY(3),
    x2: RIGHT_EDGE - 10,
    y2: rowY(3),
  },
  {
    name: "clientRetry2",
    label: "RETRY (CP2)",
    labelSide: "above" as const,
    color: C_CLIENT_PACKET,
    x1: LEFT_EDGE,
    y1: rowY(4),
    x2: RIGHT_EDGE - 10,
    y2: rowY(4),
  },
  {
    name: "serverAck2",
    label: "ACK",
    labelSide: "below" as const,
    color: C_ACK,
    x1: RIGHT_EDGE,
    y1: rowY(4) + ACK_GAP,
    x2: LEFT_EDGE + 10,
    y2: rowY(4) + ACK_GAP,
  },
];

const ANNOTATIONS = {
  start: "Connection established - data can now flow in either direction",
  clientPacket1: "Client sends a packet to the server",
  serverAck1: "Server acknowledges the packet with ACK",
  settle1: "Both sides stay in sync after the ACK",
  serverPacket1: "Server can also send data back over the same TCP connection",
  clientAck1: "Client acknowledges the server packet",
  settle2: "TCP continues tracking which bytes have been acknowledged",
  clientPacket2: "Client sends another packet, but no ACK arrives",
  timeout1: "Retransmission timeout expires - the packet is assumed lost or delayed",
  clientRetry1: "Client retries the unacknowledged packet",
  timeout2: "Still no ACK, so TCP waits and retries again",
  clientRetry2: "Client retransmits the same packet one more time",
  serverAck2: "Server finally receives it and sends back an ACK",
  done: "Reliability comes from ACKs plus retransmission when ACKs are missing",
};

function getAnnotation(t: number): string {
  const active = PHASES.slice().reverse().find(p => t >= p.start);
  return (active?.name ? ANNOTATIONS[active.name as keyof typeof ANNOTATIONS] : undefined) ?? "";
}

function TimeoutMarker({ rowIndex, visible }: { rowIndex: number; visible: boolean }) {
  if (!visible) return null;

  const y = rowY(rowIndex);
  const x = RIGHT_EDGE - 56;

  return (
    <g>
      <circle cx={x} cy={y} r={7} fill="#fff" stroke="#D6A32C" strokeWidth={1.5} />
      <text
        x={x}
        y={y + 0.5}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#D6A32C"
        fontSize={11}
        fontWeight={700}
      >
        !
      </text>
      <text x={x + 14} y={y - 1} fill="#B78A18" fontSize={11} fontWeight={600}>
        timeout
      </text>
    </g>
  );
}

export default function TcpPacketRetry() {
  const { t, playing, setPlaying, seek } = useSequenceAnimation(25500);
  const activeIdx = activeArrowIndex(t);
  const annotation = getAnnotation(t);

  return (
    <SequenceDiagram
      t={t}
      playing={playing}
      setPlaying={setPlaying}
      seek={seek}
      annotation={annotation}
    >
      {ARROWS.map((arrow, i) => (
        <DiagramArrow
          key={arrow.name}
          x1={arrow.x1}
          y1={arrow.y1}
          x2={arrow.x2}
          y2={arrow.y2}
          color={arrow.color}
          label={arrow.label}
          labelSide={arrow.labelSide}
          visible={i <= activeIdx}
          progress={i < activeIdx ? 1 : phaseProgress(arrow.name, t)}
        />
      ))}

      <TimeoutMarker rowIndex={2} visible={t >= (getPhase("timeout1")?.start ?? 1)} />
      <TimeoutMarker rowIndex={3} visible={t >= (getPhase("timeout2")?.start ?? 1)} />

      <ActorBox x={CLIENT_X} label="Client" fill={C_CLIENT_FILL} bg={C_CLIENT_BG} />
      <ActorBox x={SERVER_X} label="Server" fill={C_SERVER_FILL} bg={C_SERVER_BG} />
    </SequenceDiagram>
  );
}
