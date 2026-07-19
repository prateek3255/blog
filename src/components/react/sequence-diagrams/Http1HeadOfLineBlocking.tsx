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
const C_REQUEST = "#5B8FD4";
const C_RESPONSE = "#57A87B";
const C_ACK = "#E5954A";
const C_WAIT = "#D6A32C";
const C_LANE = "#B8BDC7";

const DIAGRAM_H = 630;
const BOX_Y = 20;
const BOX_H = DIAGRAM_H - 60;
const ACK_GAP = 12;

const { CLIENT_X, SERVER_X, LEFT_EDGE, RIGHT_EDGE, BOX_W, BOX_RX } = LAYOUT;

// Row spacing: 40px between a request and its direct response (or between
// segments of the same multi-part response), 65px when starting a brand new
// request after a previous exchange fully completes. Conn1's first row starts
// at 70 (not 55) so the lane label text (row0-40) clears the box top (y=20).
const CONN_1_ROWS = [70, 110, 175, 215, 255];
const CONN_2_ROWS = [335, 375, 415, 455, 520, 560];

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
    name: "conn1-req1",
    label: "GET /index.html",
    labelSide: "above",
    color: C_REQUEST,
    x1: LEFT_EDGE,
    y1: CONN_1_ROWS[0],
    x2: RIGHT_EDGE - 10,
    y2: CONN_1_ROWS[0],
    start: 0.04,
    end: 0.11,
  },
  {
    name: "conn2-req1",
    label: "GET /large-image.jpg",
    labelSide: "above",
    color: C_REQUEST,
    x1: LEFT_EDGE,
    y1: CONN_2_ROWS[0],
    x2: RIGHT_EDGE - 10,
    y2: CONN_2_ROWS[0],
    start: 0.05,
    end: 0.12,
  },
  // NOTE: Conn2 transit durations below intentionally match Conn1's
  // benchmark pattern exactly (req/resp = 0.07, ack = 0.04, chunk gap =
  // 0.01, new-request gap = 0.02). Only the processing/wait gaps (server
  // generating the image / css) vary in length, since those represent
  // real server work rather than network transit.
  {
    name: "conn1-ack1",
    color: C_ACK,
    x1: RIGHT_EDGE,
    y1: CONN_1_ROWS[0] + ACK_GAP,
    x2: LEFT_EDGE + 10,
    y2: CONN_1_ROWS[0] + ACK_GAP,
    start: 0.11,
    end: 0.15,
  },
  {
    name: "conn2-ack1",
    color: C_ACK,
    x1: RIGHT_EDGE,
    y1: CONN_2_ROWS[0] + ACK_GAP,
    x2: LEFT_EDGE + 10,
    y2: CONN_2_ROWS[0] + ACK_GAP,
    start: 0.12,
    end: 0.16,
  },
  // Server begins generating/streaming the large image here (0.16). This is
  // the big processing gap that absorbs the timeline slack -- resp1a doesn't
  // start until 0.36.
  {
    name: "conn1-resp1",
    label: "200 OK",
    labelSide: "above",
    color: C_RESPONSE,
    x1: RIGHT_EDGE,
    y1: CONN_1_ROWS[1],
    x2: LEFT_EDGE + 10,
    y2: CONN_1_ROWS[1],
    start: 0.15,
    end: 0.22,
  },
  {
    name: "conn1-ack2",
    color: C_ACK,
    x1: LEFT_EDGE,
    y1: CONN_1_ROWS[1] + ACK_GAP,
    x2: RIGHT_EDGE - 10,
    y2: CONN_1_ROWS[1] + ACK_GAP,
    start: 0.22,
    end: 0.26,
  },
  {
    name: "conn1-req2",
    label: "GET /hero.jpg",
    labelSide: "above",
    color: C_REQUEST,
    x1: LEFT_EDGE,
    y1: CONN_1_ROWS[2],
    x2: RIGHT_EDGE - 10,
    y2: CONN_1_ROWS[2],
    start: 0.28,
    end: 0.35,
  },
  {
    name: "conn1-ack3",
    color: C_ACK,
    x1: RIGHT_EDGE,
    y1: CONN_1_ROWS[2] + ACK_GAP,
    x2: LEFT_EDGE + 10,
    y2: CONN_1_ROWS[2] + ACK_GAP,
    start: 0.35,
    end: 0.39,
  },
  {
    name: "conn2-resp1a",
    label: "200 OK (1/3)",
    labelSide: "above",
    color: C_RESPONSE,
    x1: RIGHT_EDGE,
    y1: CONN_2_ROWS[1],
    x2: LEFT_EDGE + 10,
    y2: CONN_2_ROWS[1],
    start: 0.36,
    end: 0.43,
  },
  {
    name: "conn2-ack2",
    color: C_ACK,
    x1: LEFT_EDGE,
    y1: CONN_2_ROWS[1] + ACK_GAP,
    x2: RIGHT_EDGE - 10,
    y2: CONN_2_ROWS[1] + ACK_GAP,
    start: 0.43,
    end: 0.47,
  },
  {
    name: "conn1-resp2a",
    label: "200 OK (1/2)",
    labelSide: "above",
    color: C_RESPONSE,
    x1: RIGHT_EDGE,
    y1: CONN_1_ROWS[3],
    x2: LEFT_EDGE + 10,
    y2: CONN_1_ROWS[3],
    start: 0.46,
    end: 0.53,
  },
  {
    name: "conn1-ack4",
    color: C_ACK,
    x1: LEFT_EDGE,
    y1: CONN_1_ROWS[3] + ACK_GAP,
    x2: RIGHT_EDGE - 10,
    y2: CONN_1_ROWS[3] + ACK_GAP,
    start: 0.53,
    end: 0.57,
  },
  {
    name: "conn1-resp2b",
    label: "200 OK (2/2)",
    labelSide: "above",
    color: C_RESPONSE,
    x1: RIGHT_EDGE,
    y1: CONN_1_ROWS[4],
    x2: LEFT_EDGE + 10,
    y2: CONN_1_ROWS[4],
    start: 0.58,
    end: 0.65,
  },
  {
    name: "conn1-ack5",
    color: C_ACK,
    x1: LEFT_EDGE,
    y1: CONN_1_ROWS[4] + ACK_GAP,
    x2: RIGHT_EDGE - 10,
    y2: CONN_1_ROWS[4] + ACK_GAP,
    start: 0.65,
    end: 0.69,
  },
  {
    name: "conn2-resp1b",
    label: "200 OK (2/3)",
    labelSide: "above",
    color: C_RESPONSE,
    x1: RIGHT_EDGE,
    y1: CONN_2_ROWS[2],
    x2: LEFT_EDGE + 10,
    y2: CONN_2_ROWS[2],
    start: 0.48,
    end: 0.55,
  },
  {
    name: "conn2-ack3",
    color: C_ACK,
    x1: LEFT_EDGE,
    y1: CONN_2_ROWS[2] + ACK_GAP,
    x2: RIGHT_EDGE - 10,
    y2: CONN_2_ROWS[2] + ACK_GAP,
    start: 0.55,
    end: 0.59,
  },
  {
    name: "conn2-resp1c",
    label: "200 OK (3/3)",
    labelSide: "above",
    color: C_RESPONSE,
    x1: RIGHT_EDGE,
    y1: CONN_2_ROWS[3],
    x2: LEFT_EDGE + 10,
    y2: CONN_2_ROWS[3],
    start: 0.60,
    end: 0.67,
  },
  {
    name: "conn2-ack4",
    color: C_ACK,
    x1: LEFT_EDGE,
    y1: CONN_2_ROWS[3] + ACK_GAP,
    x2: RIGHT_EDGE - 10,
    y2: CONN_2_ROWS[3] + ACK_GAP,
    start: 0.67,
    end: 0.71,
  },
  {
    name: "conn2-req2",
    label: "GET /style.css",
    labelSide: "above",
    color: C_REQUEST,
    x1: LEFT_EDGE,
    y1: CONN_2_ROWS[4],
    x2: RIGHT_EDGE - 10,
    y2: CONN_2_ROWS[4],
    start: 0.73,
    end: 0.80,
  },
  {
    name: "conn2-ack5",
    color: C_ACK,
    x1: RIGHT_EDGE,
    y1: CONN_2_ROWS[4] + ACK_GAP,
    x2: LEFT_EDGE + 10,
    y2: CONN_2_ROWS[4] + ACK_GAP,
    start: 0.80,
    end: 0.84,
  },
  {
    name: "conn2-resp2",
    label: "200 OK",
    labelSide: "above",
    color: C_RESPONSE,
    x1: RIGHT_EDGE,
    y1: CONN_2_ROWS[5],
    x2: LEFT_EDGE + 10,
    y2: CONN_2_ROWS[5],
    start: 0.89,
    end: 0.96,
  },
  {
    name: "conn2-ack6",
    color: C_ACK,
    x1: LEFT_EDGE,
    y1: CONN_2_ROWS[5] + ACK_GAP,
    x2: RIGHT_EDGE - 10,
    y2: CONN_2_ROWS[5] + ACK_GAP,
    start: 0.96,
    end: 1,
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
  { start: 0, text: "Two persistent TCP connections can carry requests in parallel" },
  { start: 0.05, text: "Client requests index.html on connection 1 while a large image starts downloading on connection 2" },
  { start: 0.16, text: "Connection 2 is now busy generating and streaming the large image" },
  { start: 0.28, text: "Connection 1 reuses its freed capacity for hero.jpg while connection 2 keeps streaming the large image" },
  { start: 0.48, text: "style.css is queued behind the large image on connection 2" },
  { start: 0.73, text: "Only after the large image completes can style.css finally be sent" },
  { start: 0.96, text: "Head-of-line blocking is per connection, but still slows the overall page load" },
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

function LaneLabel({ y, label }: { y: number; label: string }) {
  // Arrow labels (from DiagramArrow) are centered at y-12 with ~12px font,
  // spanning roughly [y-18, y-6]. Keep the dashed line and text clearly above
  // that band so they never collide.
  return (
    <g>
      <line
        x1={LEFT_EDGE + 10}
        y1={y - 27}
        x2={RIGHT_EDGE - 10}
        y2={y - 27}
        stroke={C_LANE}
        strokeWidth={1}
        strokeDasharray="4 6"
      />
      <text
        x={(LEFT_EDGE + RIGHT_EDGE) / 2}
        y={y - 40}
        textAnchor="middle"
        fill="#9298A3"
        fontSize={11}
        fontWeight={600}
      >
        {label}
      </text>
    </g>
  );
}

function ServerSpinner({ visible }: { visible: boolean }) {
  if (!visible) return null;

  // Positioned in the gap between the request and its first response segment.
  // Label sits beside the circle (not above it) so this stays compact and
  // safely fits even in tighter row gaps.
  const x = RIGHT_EDGE - 66;
  const y = (CONN_2_ROWS[0] + CONN_2_ROWS[1]) / 2;

  return (
    <g>
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
      <text x={x - 12} y={y + 0.5} textAnchor="end" dominantBaseline="middle" fill="#B78A18" fontSize={11} fontWeight={600}>
        Processing
      </text>
    </g>
  );
}

export default function Http1HeadOfLineBlocking() {
  const { t, playing, setPlaying, seek } = useSequenceAnimation(19000);
  const annotation = getAnnotation(t);
  const showSpinner = t >= 0.16 && t < 0.71;

  return (
    <SequenceDiagram
      t={t}
      playing={playing}
      setPlaying={setPlaying}
      seek={seek}
      annotation={annotation}
      viewBoxHeight={DIAGRAM_H}
      legendItems={[
        { color: C_REQUEST, label: "Request" },
        { color: C_RESPONSE, label: "Response" },
        { color: C_ACK, label: "ACK" },
      ]}
    >
      <LaneLabel y={CONN_1_ROWS[0]} label="TCP connection 1" />
      <LaneLabel y={CONN_2_ROWS[0]} label="TCP connection 2" />

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

      <ServerSpinner visible={showSpinner} />

      <TallActorBox x={CLIENT_X} label="Client" fill={C_CLIENT_FILL} bg={C_CLIENT_BG} />
      <TallActorBox x={SERVER_X} label="Server" fill={C_SERVER_FILL} bg={C_SERVER_BG} />
    </SequenceDiagram>
  );
}
