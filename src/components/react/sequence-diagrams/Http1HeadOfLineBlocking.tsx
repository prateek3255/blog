import {
  LAYOUT,
  buildPhases,
  useSequenceAnimation,
  DiagramArrow,
  SequenceDiagram,
} from "./SequenceDiagram";

const C_CLIENT_FILL = "#2D5FA8";
const C_CLIENT_BG = "#EAF0FB";
const C_SERVER_FILL = "#246B47";
const C_SERVER_BG = "#E4F5EE";
const C_REQUEST = "#5B8FD4";
const C_RESPONSE = "#57A87B";
const C_ACK = "#E5954A";
const C_WAIT = "#D6A32C";
const C_LANE = "#B8BDC7";
const DIAGRAM_H = 600;
const BOX_Y = 20;
const BOX_H = DIAGRAM_H - 80;
const ROW_TOP_SHIFT = -45;
const USABLE_TOP = BOX_Y + 80;

const PHASES = buildPhases([
  { type: "pause", name: "start", weight: 0.5 },
  { type: "arrow", name: "req1", weight: 1.4 },
  { type: "arrow", name: "ackReq1", weight: 1 },
  { type: "arrow", name: "resp1", weight: 1.4 },
  { type: "arrow", name: "ackResp1", weight: 1 },
  { type: "pause", name: "gap1", weight: 0.6 },
  { type: "arrow", name: "req2", weight: 1.4 },
  { type: "arrow", name: "ackReq2", weight: 1 },
  { type: "pause", name: "processing", weight: 2.3 },
  { type: "arrow", name: "resp2a", weight: 1.3 },
  { type: "arrow", name: "ackResp2a", weight: 1 },
  { type: "arrow", name: "resp2b", weight: 1.3 },
  { type: "arrow", name: "ackResp2b", weight: 1 },
  { type: "pause", name: "gap2", weight: 0.7 },
  { type: "arrow", name: "req3", weight: 1.4 },
  { type: "arrow", name: "ackReq3", weight: 1 },
  { type: "arrow", name: "resp3", weight: 1.3 },
  { type: "arrow", name: "ackResp3", weight: 1 },
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

const { CLIENT_X, SERVER_X, LEFT_EDGE, RIGHT_EDGE, BOX_W, BOX_RX } = LAYOUT;
const ACK_GAP = 12;
const FIRST_PACKET_Y = USABLE_TOP + ROW_TOP_SHIFT;
const DATA_ROWS = [
  FIRST_PACKET_Y,
  FIRST_PACKET_Y + 70,
  FIRST_PACKET_Y + 160,
  FIRST_PACKET_Y + 230,
  FIRST_PACKET_Y + 290,
  FIRST_PACKET_Y + 380,
  FIRST_PACKET_Y + 450,
];

function rowY(index: number) {
  return DATA_ROWS[index];
}

function TallActorBox({ x, label, fill, bg }: { x: number; label: string; fill: string; bg: string }) {
  return (
    <g>
      <rect
        x={x}
        y={BOX_Y}
        width={BOX_W}
        height={BOX_H}
        rx={BOX_RX}
        fill={bg}
        stroke={fill}
        strokeWidth={1.5}
      />
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

const ARROWS = [
  {
    name: "req1",
    label: "GET /index.html",
    labelSide: "above" as const,
    color: C_REQUEST,
    x1: LEFT_EDGE,
    y1: rowY(0),
    x2: RIGHT_EDGE - 10,
    y2: rowY(0),
  },
  {
    name: "ackReq1",
    label: "ACK",
    labelSide: "below" as const,
    color: C_ACK,
    x1: RIGHT_EDGE,
    y1: rowY(0) + ACK_GAP,
    x2: LEFT_EDGE + 10,
    y2: rowY(0) + ACK_GAP,
  },
  {
    name: "resp1",
    label: "200 OK",
    labelSide: "above" as const,
    color: C_RESPONSE,
    x1: RIGHT_EDGE,
    y1: rowY(1),
    x2: LEFT_EDGE + 10,
    y2: rowY(1),
  },
  {
    name: "ackResp1",
    label: "ACK",
    labelSide: "below" as const,
    color: C_ACK,
    x1: LEFT_EDGE,
    y1: rowY(1) + ACK_GAP,
    x2: RIGHT_EDGE - 10,
    y2: rowY(1) + ACK_GAP,
  },
  {
    name: "req2",
    label: "GET /hero.jpg",
    labelSide: "above" as const,
    color: C_REQUEST,
    x1: LEFT_EDGE,
    y1: rowY(2),
    x2: RIGHT_EDGE - 10,
    y2: rowY(2),
  },
  {
    name: "ackReq2",
    label: "ACK",
    labelSide: "below" as const,
    color: C_ACK,
    x1: RIGHT_EDGE,
    y1: rowY(2) + ACK_GAP,
    x2: LEFT_EDGE + 10,
    y2: rowY(2) + ACK_GAP,
  },
  {
    name: "resp2a",
    label: "200 OK (1/2)",
    labelSide: "above" as const,
    color: C_RESPONSE,
    x1: RIGHT_EDGE,
    y1: rowY(3),
    x2: LEFT_EDGE + 10,
    y2: rowY(3),
  },
  {
    name: "ackResp2a",
    label: "ACK",
    labelSide: "below" as const,
    color: C_ACK,
    x1: LEFT_EDGE,
    y1: rowY(3) + ACK_GAP,
    x2: RIGHT_EDGE - 10,
    y2: rowY(3) + ACK_GAP,
  },
  {
    name: "resp2b",
    label: "200 OK (2/2)",
    labelSide: "above" as const,
    color: C_RESPONSE,
    x1: RIGHT_EDGE,
    y1: rowY(4),
    x2: LEFT_EDGE + 10,
    y2: rowY(4),
  },
  {
    name: "ackResp2b",
    label: "ACK",
    labelSide: "below" as const,
    color: C_ACK,
    x1: LEFT_EDGE,
    y1: rowY(4) + ACK_GAP,
    x2: RIGHT_EDGE - 10,
    y2: rowY(4) + ACK_GAP,
  },
  {
    name: "req3",
    label: "GET /styles.css",
    labelSide: "above" as const,
    color: C_REQUEST,
    x1: LEFT_EDGE,
    y1: rowY(5),
    x2: RIGHT_EDGE - 10,
    y2: rowY(5),
  },
  {
    name: "ackReq3",
    label: "ACK",
    labelSide: "below" as const,
    color: C_ACK,
    x1: RIGHT_EDGE,
    y1: rowY(5) + ACK_GAP,
    x2: LEFT_EDGE + 10,
    y2: rowY(5) + ACK_GAP,
  },
  {
    name: "resp3",
    label: "200 OK",
    labelSide: "above" as const,
    color: C_RESPONSE,
    x1: RIGHT_EDGE,
    y1: rowY(6),
    x2: LEFT_EDGE + 10,
    y2: rowY(6),
  },
  {
    name: "ackResp3",
    label: "ACK",
    labelSide: "below" as const,
    color: C_ACK,
    x1: LEFT_EDGE,
    y1: rowY(6) + ACK_GAP,
    x2: RIGHT_EDGE - 10,
    y2: rowY(6) + ACK_GAP,
  },
];

const ANNOTATIONS = {
  start: "A single persistent TCP connection carries every HTTP/1.1 request in sequence",
  req1: "Client requests the HTML document first",
  ackReq1: "The server acknowledges the incoming request bytes",
  resp1: "index.html is small, so the server returns it quickly",
  ackResp1: "The client acknowledges the response and the connection becomes free again",
  gap1: "The same TCP connection is immediately reused for the next request",
  req2: "The client now asks for a larger resource: /hero.jpg",
  ackReq2: "The server acknowledges the request, but the response is slower to produce",
  processing: "While the server is busy generating and streaming /hero.jpg, later requests on this same connection must wait",
  resp2a: "The slow image response begins returning in TCP segments",
  ackResp2a: "The client acknowledges the first segment",
  resp2b: "The second segment completes the large response",
  ackResp2b: "Only after the full image is delivered is the connection available again",
  gap2: "The queued CSS request can finally move forward",
  req3: "GET /styles.css had to wait behind /hero.jpg on the same connection",
  ackReq3: "The server acknowledges the final request",
  resp3: "Once unblocked, the CSS response is returned quickly",
  ackResp3: "This is head-of-line blocking on a single HTTP/1.1 connection",
  done: "A slow response keeps the TCP connection occupied, delaying every later request behind it",
};

function getAnnotation(t: number): string {
  const active = PHASES.slice().reverse().find(p => t >= p.start);
  return (active?.name ? ANNOTATIONS[active.name as keyof typeof ANNOTATIONS] : undefined) ?? "";
}

function ConnectionLabel() {
  return (
    <g>
      <line
        x1={LEFT_EDGE + 10}
        y1={rowY(0) - 30}
        x2={RIGHT_EDGE - 10}
        y2={rowY(0) - 30}
        stroke={C_LANE}
        strokeWidth={1}
        strokeDasharray="4 6"
      />
      <text
        x={(LEFT_EDGE + RIGHT_EDGE) / 2}
        y={rowY(0) - 36}
        textAnchor="middle"
        fill="#9298A3"
        fontSize={11}
        fontWeight={600}
      >
        Persistent TCP connection
      </text>
    </g>
  );
}

function ServerSpinner({ visible }: { visible: boolean }) {
  if (!visible) return null;

  const x = RIGHT_EDGE - 54;
  const y = rowY(2) + 38;

  return (
    <g>
      <text x={x} y={y - 18} textAnchor="middle" fill="#B78A18" fontSize={11} fontWeight={600}>
        server busy
      </text>
      <circle
        cx={x}
        cy={y}
        r={7}
        fill="none"
        stroke={C_WAIT}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeDasharray="10 34"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from={`0 ${x} ${y}`}
          to={`360 ${x} ${y}`}
          dur="0.9s"
          repeatCount="indefinite"
        />
      </circle>
    </g>
  );
}

function QueuedRequest({ visible }: { visible: boolean }) {
  if (!visible) return null;

  const x = LEFT_EDGE + 30;
  const y = rowY(5);

  return (
    <g>
      <text x={x} y={y - 18} textAnchor="start" fill="#B78A18" fontSize={11} fontWeight={600}>
        queued behind /hero.jpg
      </text>
      <circle cx={x - 10} cy={y - 21} r={5} fill="#fff" stroke={C_WAIT} strokeWidth={1.5} />
      <text
        x={x - 10}
        y={y - 20.5}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={C_WAIT}
        fontSize={9}
        fontWeight={700}
      >
        •
      </text>
    </g>
  );
}

export default function Http1HeadOfLineBlocking() {
  const { t, playing, setPlaying, seek } = useSequenceAnimation(20000);
  const activeIdx = activeArrowIndex(t);
  const annotation = getAnnotation(t);
  const processingPhase = getPhase("processing");
  const req3Phase = getPhase("req3");

  return (
    <SequenceDiagram
      t={t}
      playing={playing}
      setPlaying={setPlaying}
      seek={seek}
      annotation={annotation}
      viewBoxHeight={DIAGRAM_H}
    >
      <ConnectionLabel />

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

      <ServerSpinner visible={t >= (processingPhase?.start ?? 1) && t < (processingPhase?.end ?? 0)} />
      <QueuedRequest visible={t >= (processingPhase?.start ?? 1) && t < (req3Phase?.start ?? 0)} />

      <TallActorBox x={CLIENT_X} label="Client" fill={C_CLIENT_FILL} bg={C_CLIENT_BG} />
      <TallActorBox x={SERVER_X} label="Server" fill={C_SERVER_FILL} bg={C_SERVER_BG} />
    </SequenceDiagram>
  );
}
