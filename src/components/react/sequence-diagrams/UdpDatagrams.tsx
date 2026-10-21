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
const C_CLIENT_PACKET = "#5B8FD4";

const PHASES = buildPhases([
  { type: "pause", name: "start", weight: 0.5 },
  { type: "arrow", name: "datagram1", weight: 1.8 },
  { type: "pause", name: "settle1", weight: 1.6 },
  { type: "arrow", name: "datagram2", weight: 1.8 },
  { type: "pause", name: "settle2", weight: 2.2 },
  { type: "arrow", name: "datagram3", weight: 1.8 },
  { type: "pause", name: "done", weight: 1.6 },
]);

function getPhase(name: string) {
  return PHASES.find(p => p.name === name)!;
}

function phaseProgress(name: string, t: number): number {
  const p = getPhase(name);
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

const DIAGRAM_H = 300;
const BOX_Y = 20;
const BOX_H = DIAGRAM_H - 60;

const { CLIENT_X, SERVER_X, LEFT_EDGE, RIGHT_EDGE, BOX_W, BOX_RX } = LAYOUT;
const ROWS = [75, 135, 195];

const ARROWS = [
  {
    name: "datagram1",
    label: "Datagram 1",
    x2: RIGHT_EDGE - 10,
    breakAt: undefined,
  },
  {
    name: "datagram2",
    label: "Datagram 2",
    x2: RIGHT_EDGE - 10,
    breakAt: 0.65,
  },
  {
    name: "datagram3",
    label: "Datagram 3",
    x2: RIGHT_EDGE - 10,
    breakAt: undefined,
  },
];

const ANNOTATIONS = {
  start: "UDP just sends datagrams - there is no connection to set up",
  datagram1: "Client sends a datagram to the server",
  settle1: "It arrives, and the server doesn't send any ACK back",
  datagram2: "Client sends another datagram, but it is lost on the way",
  settle2: "The datagram is gone - neither side notices or does anything about it",
  datagram3: "The next datagram is sent as usual, unaffected by the loss",
  done: "UDP gives no delivery or ordering guarantees - any reliability has to be built on top",
};

function getAnnotation(t: number): string {
  const active = PHASES.slice().reverse().find(p => t >= p.start);
  return (active?.name ? ANNOTATIONS[active.name as keyof typeof ANNOTATIONS] : undefined) ?? "";
}

function ShortActorBox({ x, label, fill, bg }: { x: number; label: string; fill: string; bg: string }) {
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

export default function UdpDatagrams() {
  const { t, playing, setPlaying, seek } = useSequenceAnimation(7000);
  const activeIdx = activeArrowIndex(t);
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
      {ARROWS.map((arrow, i) => (
        <DiagramArrow
          key={arrow.name}
          x1={LEFT_EDGE}
          y1={ROWS[i]}
          x2={arrow.x2}
          y2={ROWS[i]}
          color={C_CLIENT_PACKET}
          label={arrow.label}
          labelSide="above"
          breakAt={arrow.breakAt}
          visible={i <= activeIdx}
          progress={i < activeIdx ? 1 : phaseProgress(arrow.name, t)}
        />
      ))}

      <ShortActorBox x={CLIENT_X} label="Client" fill={C_CLIENT_FILL} bg={C_CLIENT_BG} />
      <ShortActorBox x={SERVER_X} label="Server" fill={C_SERVER_FILL} bg={C_SERVER_BG} />
    </SequenceDiagram>
  );
}
