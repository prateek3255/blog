// ─────────────────────────────────────────────────────────────────────────────
// TlsHandshake.jsx
//
// Simplified TLS 1.2 (RSA key exchange) handshake, built with the same
// SequenceDiagram primitives as TcpHandshake/Http1HeadOfLineBlocking. Runs
// *after* the TCP three-way handshake, to visualize how the browser and
// server establish a shared secret before any encrypted application data is
// exchanged.
// ─────────────────────────────────────────────────────────────────────────────

import {
  LAYOUT,
  buildPhases,
  useSequenceAnimation,
  DiagramArrow,
  SequenceDiagram,
} from "./SequenceDiagram";

// ── colors ────────────────────────────────────────────────────────────────────
const C_CLIENT_FILL = "#2D5FA8";
const C_CLIENT_BG   = "#EAF0FB";
const C_SERVER_FILL = "#246B47";
const C_SERVER_BG   = "#E4F5EE";
const C_CLIENT_HELLO = "#B8860B";
const C_SERVER_HELLO = "#57A87B";
const C_SECRET       = "#5B8FD4";
const C_DATA         = "#8B5FBF";

// ── custom (taller) canvas ────────────────────────────────────────────────────
// Five sequential arrows need more vertical room than the default LAYOUT.H,
// so this diagram uses its own diagram height (like Http1HeadOfLineBlocking)
// instead of the shared LAYOUT.BOX_H.
const DIAGRAM_H = 520;
const BOX_Y = 20;
const BOX_H = DIAGRAM_H - 60;

const { CLIENT_X, SERVER_X, LEFT_EDGE: CE, RIGHT_EDGE: SE, BOX_W, BOX_RX } = LAYOUT;

// ── phases ────────────────────────────────────────────────────────────────────
// type:"arrow" phases map 1:1 to arrows below.
// type:"pause" phases are gaps between arrows (verification/decryption time).
const PHASES = buildPhases([
  { type: "pause", name: "start",        weight: 0.5 },
  { type: "arrow", name: "clientHello",  weight: 1.8 },
  { type: "pause", name: "pick",         weight: 0.6 },
  { type: "arrow", name: "serverHello",  weight: 1.8 },
  { type: "pause", name: "verify",       weight: 1.4 },
  { type: "arrow", name: "secret",       weight: 1.8 },
  { type: "pause", name: "decrypt",      weight: 1.4 },
  { type: "arrow", name: "dataToClient", weight: 1.6 },
  { type: "arrow", name: "dataToServer", weight: 1.6 },
  { type: "pause", name: "done",         weight: 0.5 },
]);

// Phase lookup helper
function getPhase(name: string) { return PHASES.find(p => p.name === name); }
function phaseProgress(name: string, t: number): number {
  const p = getPhase(name);
  if (!p) return 0;
  return Math.max(0, Math.min(1, (t - p.start) / (p.end - p.start)));
}

// Is a given phase (by name) active or already completed at time t?
function isPastOrActive(name: string, t: number) {
  const p = getPhase(name);
  return !!p && t >= p.start;
}
function isComplete(name: string, t: number) {
  const p = getPhase(name);
  return !!p && t >= p.end;
}

// ── arrows ────────────────────────────────────────────────────────────────────
// Straight horizontal lines (not zigzag) at fixed rows, like the HTTP
// diagrams -- easier to read as a straightforward top-to-bottom timeline.
const ROW_CLIENT_HELLO   = 100;
const ROW_SERVER_HELLO   = 175;
const ROW_SECRET         = 250;
const ROW_DATA_TO_CLIENT = 325;
const ROW_DATA_TO_SERVER = 400;

// ── annotation text per phase ─────────────────────────────────────────────────
const ANNOTATIONS = {
  start:        "TCP handshake complete - browser and server are ready to begin TLS",
  clientHello:  "ClientHello - browser proposes supported TLS versions & cipher suites, plus a client random value",
  pick:         "Server picks a cipher suite from the browser's list",
  serverHello:  "ServerHello + Certificate - server confirms the chosen cipher suite, sends a server random value, and its public key",
  verify:       "Browser verifies the certificate against a trusted CA and extracts the public key",
  secret:       "Encrypted Secret - browser encrypts a pre-master secret with the server's public key (RSA) and sends it",
  decrypt:      "Server decrypts the pre-master secret using its private key - both sides now derive the same shared secret",
  dataToClient: "Encrypted Data - the server responds, encrypted with AES (symmetric) using the shared secret",
  dataToServer: "Encrypted Request - the browser sends its request the same way, encrypted with AES",
  done:         "TLS handshake complete - secure channel established",
};

function getAnnotation(t: number): string {
  const active = PHASES.slice().reverse().find(p => t >= p.start);
  return (active?.name ? ANNOTATIONS[active.name as keyof typeof ANNOTATIONS] : undefined) ?? "";
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

// ── component ─────────────────────────────────────────────────────────────────
export default function TlsHandshake() {
  const { t, playing, setPlaying, seek } = useSequenceAnimation(9000);

  const annotation = getAnnotation(t);

  return (
    <SequenceDiagram
      t={t} playing={playing} setPlaying={setPlaying} seek={seek}
      annotation={annotation}
      viewBoxHeight={DIAGRAM_H}
    >
      {/* Arrows first so box edges clip their tips */}

      {/* ClientHello: client -> server */}
      <DiagramArrow
        x1={CE} y1={ROW_CLIENT_HELLO}
        x2={SE - 10} y2={ROW_CLIENT_HELLO}
        color={C_CLIENT_HELLO}
        label="ClientHello"
        sublabel="(supported TLS versions & cipher suites, client random)"
        labelSide="above"
        visible={isPastOrActive("clientHello", t)}
        progress={isComplete("clientHello", t) ? 1 : phaseProgress("clientHello", t)}
      />

      {/* ServerHello + Certificate: server -> client */}
      <DiagramArrow
        x1={SE} y1={ROW_SERVER_HELLO}
        x2={CE + 10} y2={ROW_SERVER_HELLO}
        color={C_SERVER_HELLO}
        label="ServerHello + Certificate"
        sublabel="(chosen cipher suite, server random & server's certificate)"
        labelSide="above"
        visible={isPastOrActive("serverHello", t)}
        progress={isComplete("serverHello", t) ? 1 : phaseProgress("serverHello", t)}
      />

      {/* Encrypted secret: client -> server */}
      <DiagramArrow
        x1={CE} y1={ROW_SECRET}
        x2={SE - 10} y2={ROW_SECRET}
        color={C_SECRET}
        label="Encrypted Secret"
        sublabel="(pre-master secret, encrypted with server's public key - RSA)"
        labelSide="above"
        visible={isPastOrActive("secret", t)}
        progress={isComplete("secret", t) ? 1 : phaseProgress("secret", t)}
      />

      {/* Encrypted data: server -> client */}
      <DiagramArrow
        x1={SE} y1={ROW_DATA_TO_CLIENT}
        x2={CE + 10} y2={ROW_DATA_TO_CLIENT}
        color={C_DATA}
        label="Encrypted Data"
        sublabel="(AES symmetric encryption)"
        labelSide="above"
        visible={isPastOrActive("dataToClient", t)}
        progress={isComplete("dataToClient", t) ? 1 : phaseProgress("dataToClient", t)}
      />

      {/* Encrypted request: client -> server */}
      <DiagramArrow
        x1={CE} y1={ROW_DATA_TO_SERVER}
        x2={SE - 10} y2={ROW_DATA_TO_SERVER}
        color={C_DATA}
        label="Encrypted Request"
        sublabel="(AES symmetric encryption)"
        labelSide="above"
        visible={isPastOrActive("dataToServer", t)}
        progress={isComplete("dataToServer", t) ? 1 : phaseProgress("dataToServer", t)}
      />

      {/* Boxes on top */}
      <TallActorBox x={CLIENT_X} label="Client" fill={C_CLIENT_FILL} bg={C_CLIENT_BG} />
      <TallActorBox x={SERVER_X} label="Server" fill={C_SERVER_FILL} bg={C_SERVER_BG} />
    </SequenceDiagram>
  );
}
