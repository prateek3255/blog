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

const DIAGRAM_H = 750;
const BOX_Y = 20;
const BOX_H = DIAGRAM_H - 84;
const ACK_GAP = 12;

const { CLIENT_X, SERVER_X, LEFT_EDGE, RIGHT_EDGE, BOX_W, BOX_RX } = LAYOUT;

// Tightened row spacing: 56px between distinct request/response exchanges,
// 40px between segments that belong to the same multi-part response, 62px
// between the two connection lanes.
const CONN_1_ROWS = [55, 95, 160, 200, 240];
const CONN_2_ROWS = [325, 365, 430, 470, 510, 550, 615, 655];

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
    label: "GET /script.js",
    labelSide: "above",
    color: C_REQUEST,
    x1: LEFT_EDGE,
    y1: CONN_2_ROWS[0],
    x2: RIGHT_EDGE - 10,
    y2: CONN_2_ROWS[0],
    start: 0.05,
    end: 0.12,
  },
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
    name: "conn2-resp1",
    label: "200 OK",
    labelSide: "above",
    color: C_RESPONSE,
    x1: RIGHT_EDGE,
    y1: CONN_2_ROWS[1],
    x2: LEFT_EDGE + 10,
    y2: CONN_2_ROWS[1],
    start: 0.16,
    end: 0.23,
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
    name: "conn2-ack2",
    color: C_ACK,
    x1: LEFT_EDGE,
    y1: CONN_2_ROWS[1] + ACK_GAP,
    x2: RIGHT_EDGE - 10,
    y2: CONN_2_ROWS[1] + ACK_GAP,
    start: 0.23,
    end: 0.27,
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
    name: "conn2-req2",
    label: "GET /large-image.jpg",
    labelSide: "above",
    color: C_REQUEST,
    x1: LEFT_EDGE,
    y1: CONN_2_ROWS[2],
    x2: RIGHT_EDGE - 10,
    y2: CONN_2_ROWS[2],
    start: 0.29,
    end: 0.36,
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
    name: "conn2-ack3",
    color: C_ACK,
    x1: RIGHT_EDGE,
    y1: CONN_2_ROWS[2] + ACK_GAP,
    x2: LEFT_EDGE + 10,
    y2: CONN_2_ROWS[2] + ACK_GAP,
    start: 0.36,
    end: 0.4,
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
    name: "conn2-resp2a",
    label: "200 OK (1/3)",
    labelSide: "above",
    color: C_RESPONSE,
    x1: RIGHT_EDGE,
    y1: CONN_2_ROWS[3],
    x2: LEFT_EDGE + 10,
    y2: CONN_2_ROWS[3],
    start: 0.5,
    end: 0.57,
  },
  {
    name: "conn2-ack4",
    color: C_ACK,
    x1: LEFT_EDGE,
    y1: CONN_2_ROWS[3] + ACK_GAP,
    x2: RIGHT_EDGE - 10,
    y2: CONN_2_ROWS[3] + ACK_GAP,
    start: 0.57,
    end: 0.61,
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
    name: "conn2-resp2b",
    label: "200 OK (2/3)",
    labelSide: "above",
    color: C_RESPONSE,
    x1: RIGHT_EDGE,
    y1: CONN_2_ROWS[4],
    x2: LEFT_EDGE + 10,
    y2: CONN_2_ROWS[4],
    start: 0.62,
    end: 0.69,
  },
  {
    name: "conn2-ack5",
    color: C_ACK,
    x1: LEFT_EDGE,
    y1: CONN_2_ROWS[4] + ACK_GAP,
    x2: RIGHT_EDGE - 10,
    y2: CONN_2_ROWS[4] + ACK_GAP,
    start: 0.69,
    end: 0.73,
  },
  {
    name: "conn2-resp2c",
    label: "200 OK (3/3)",
    labelSide: "above",
    color: C_RESPONSE,
    x1: RIGHT_EDGE,
    y1: CONN_2_ROWS[5],
    x2: LEFT_EDGE + 10,
    y2: CONN_2_ROWS[5],
    start: 0.74,
    end: 0.81,
  },
  {
    name: "conn2-ack6",
    color: C_ACK,
    x1: LEFT_EDGE,
    y1: CONN_2_ROWS[5] + ACK_GAP,
    x2: RIGHT_EDGE - 10,
    y2: CONN_2_ROWS[5] + ACK_GAP,
    start: 0.81,
    end: 0.85,
  },
  {
    name: "conn2-req3",
    label: "GET /style.css",
    labelSide: "above",
    color: C_REQUEST,
    x1: LEFT_EDGE,
    y1: CONN_2_ROWS[6],
    x2: RIGHT_EDGE - 10,
    y2: CONN_2_ROWS[6],
    start: 0.86,
    end: 0.92,
  },
  {
    name: "conn2-ack7",
    color: C_ACK,
    x1: RIGHT_EDGE,
    y1: CONN_2_ROWS[6] + ACK_GAP,
    x2: LEFT_EDGE + 10,
    y2: CONN_2_ROWS[6] + ACK_GAP,
    start: 0.92,
    end: 0.95,
  },
  {
    name: "conn2-resp3",
    label: "200 OK",
    labelSide: "above",
    color: C_RESPONSE,
    x1: RIGHT_EDGE,
    y1: CONN_2_ROWS[7],
    x2: LEFT_EDGE + 10,
    y2: CONN_2_ROWS[7],
    start: 0.95,
    end: 0.985,
  },
  {
    name: "conn2-ack8",
    color: C_ACK,
    x1: LEFT_EDGE,
    y1: CONN_2_ROWS[7] + ACK_GAP,
    x2: RIGHT_EDGE - 10,
    y2: CONN_2_ROWS[7] + ACK_GAP,
    start: 0.985,
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
  { start: 0.14, text: "index.html and script.js both complete quickly on separate connections" },
  { start: 0.29, text: "Both image requests start, but large-image.jpg will occupy connection 2 longer" },
  { start: 0.5, text: "Connection 1 finishes hero.jpg sooner while connection 2 keeps streaming large-image.jpg" },
  { start: 0.66, text: "style.css is queued behind large-image.jpg on TCP connection 2" },
  { start: 0.86, text: "Only after large-image.jpg completes can style.css finally be sent" },
  { start: 0.985, text: "Head-of-line blocking is per connection, but still slows the overall page load" },
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
  const y = (CONN_2_ROWS[2] + CONN_2_ROWS[3]) / 2;

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
        server busy
      </text>
    </g>
  );
}

function QueuedRequest({ visible }: { visible: boolean }) {
  if (!visible) return null;

  // Single compact line (dot + text on one row) so it safely fits in the
  // tighter gap between the last response segment and the queued request.
  const calloutX = LEFT_EDGE + 46;
  const calloutY = (CONN_2_ROWS[5] + CONN_2_ROWS[6]) / 2;

  return (
    <g>
      <circle cx={calloutX - 12} cy={calloutY} r={5} fill="#fff" stroke={C_WAIT} strokeWidth={1.5} />
      <text
        x={calloutX - 12}
        y={calloutY + 0.5}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={C_WAIT}
        fontSize={9}
        fontWeight={700}
      >
        •
      </text>
      <text x={calloutX} y={calloutY + 0.5} textAnchor="start" dominantBaseline="middle" fill="#B78A18" fontSize={11} fontWeight={600}>
        style.css blocked here
      </text>
    </g>
  );
}

export default function Http1HeadOfLineBlocking() {
  const { t, playing, setPlaying, seek } = useSequenceAnimation(22000);
  const annotation = getAnnotation(t);
  const showSpinner = t >= 0.4 && t < 0.74;
  const showQueue = t >= 0.62 && t < 0.86;

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
      <QueuedRequest visible={showQueue} />

      <TallActorBox x={CLIENT_X} label="Client" fill={C_CLIENT_FILL} bg={C_CLIENT_BG} />
      <TallActorBox x={SERVER_X} label="Server" fill={C_SERVER_FILL} bg={C_SERVER_BG} />
    </SequenceDiagram>
  );
}
