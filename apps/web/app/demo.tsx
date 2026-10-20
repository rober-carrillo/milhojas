"use client";

// Landing-page replay: a buyer and a vendor chat, both confirm the order, and the
// buyer walks to the stand and back. Pure state + timers; no animation library.
import { useEffect, useRef, useState } from "react";
import { formatMoney, translator, type Locale, type MessageKey } from "@milhojas/core";

type Scene = "chat" | "confirm" | "map";
type Walk = "to" | "at" | "back" | "home";
type Tr = ReturnType<typeof translator>;

interface Frame {
  scene: Scene;
  ms: number;
  shown?: number;
  typing?: "ana" | "rosa";
  vendorOk?: boolean;
  buyerOk?: boolean;
  done?: boolean;
  walk?: Walk;
}

const FRAMES: Frame[] = [
  { scene: "chat", ms: 900, shown: 0 },
  { scene: "chat", ms: 1300, shown: 0, typing: "ana" },
  { scene: "chat", ms: 900, shown: 1 },
  { scene: "chat", ms: 1400, shown: 1, typing: "rosa" },
  { scene: "chat", ms: 900, shown: 2 },
  { scene: "chat", ms: 1200, shown: 2, typing: "ana" },
  { scene: "chat", ms: 900, shown: 3 },
  { scene: "chat", ms: 1100, shown: 3, typing: "rosa" },
  { scene: "chat", ms: 2200, shown: 4 },
  { scene: "confirm", ms: 1500 },
  { scene: "confirm", ms: 1200, vendorOk: true },
  { scene: "confirm", ms: 1000, vendorOk: true, buyerOk: true },
  { scene: "confirm", ms: 2800, vendorOk: true, buyerOk: true, done: true },
  { scene: "map", ms: 3800, walk: "to" },
  { scene: "map", ms: 1700, walk: "at" },
  { scene: "map", ms: 3800, walk: "back" },
  { scene: "map", ms: 2200, walk: "home" },
];

const SCENES: { id: Scene; label: MessageKey }[] = [
  { id: "chat", label: "demo.step_chat" },
  { id: "confirm", label: "demo.step_confirm" },
  { id: "map", label: "demo.step_pickup" },
];

/** Frame shown for each scene when the replay is paused or motion is reduced. */
const STILL: Record<Scene, number> = { chat: 8, confirm: 12, map: 14 };

const MESSAGES: { from: "ana" | "rosa"; text: MessageKey }[] = [
  { from: "ana", text: "demo.msg1" },
  { from: "rosa", text: "demo.msg2" },
  { from: "ana", text: "demo.msg3" },
  { from: "rosa", text: "demo.msg4" },
];

const ORDER_MINOR = 1_500_000; // 3 × COP 5.000
const TALLY_BEFORE_MINOR = 24_600_000;

function firstFrame(scene: Scene): number {
  return FRAMES.findIndex((f) => f.scene === scene);
}

/** Share of the scene's duration elapsed at the start and end of frame i. */
function sceneProgress(i: number): { start: number; end: number } {
  const scene = FRAMES[i]!.scene;
  const frames = FRAMES.map((f, idx) => ({ ...f, idx })).filter((f) => f.scene === scene);
  const total = frames.reduce((sum, f) => sum + f.ms, 0);
  const before = frames.filter((f) => f.idx < i).reduce((sum, f) => sum + f.ms, 0);
  return { start: before / total, end: (before + FRAMES[i]!.ms) / total };
}

export function Demo({ locale, numberLocale }: { locale: Locale; numberLocale: string }) {
  const tr = translator(locale);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      setReduced(query.matches);
      if (query.matches) {
        setPlaying(false);
        setIndex(STILL.chat);
      }
    };
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => setIndex((i) => (i + 1) % FRAMES.length), FRAMES[index]!.ms);
    return () => window.clearTimeout(timer);
  }, [index, playing]);

  const frame = FRAMES[index]!;
  const progress = sceneProgress(index);
  const money = (minor: number) => formatMoney(minor, "COP", numberLocale);

  function jump(scene: Scene) {
    setIndex(playing ? firstFrame(scene) : STILL[scene]);
  }

  return (
    <div className="demo">
      <p className="sr-only">{tr("demo.summary")}</p>
      <div className="demo-window">
        <div className="demo-bar">
          <i aria-hidden="true" />
          <i aria-hidden="true" />
          <i aria-hidden="true" />
          <span aria-hidden="true">mismilhojas.vercel.app</span>
          <button type="button" className="demo-toggle" onClick={() => setPlaying((p) => !p)}>
            {playing ? tr("demo.pause") : tr("demo.play")}
          </button>
        </div>
        <div className="demo-screen" aria-hidden="true">
          {frame.scene === "chat" && <ChatScene frame={frame} tr={tr} />}
          {frame.scene === "confirm" && <ConfirmScene frame={frame} tr={tr} money={money} reduced={reduced} />}
          {frame.scene === "map" && (
            <MapScene walk={frame.walk ?? "at"} ms={frame.ms} playing={playing} reduced={reduced} tr={tr} />
          )}
        </div>
      </div>

      <div className="demo-controls">
        <ol className="demo-steps">
          {SCENES.map((scene, i) => {
            const active = scene.id === frame.scene;
            const width = active ? (playing ? progress.end : progress.start) : 0;
            return (
              <li key={scene.id}>
                <button
                  type="button"
                  onClick={() => jump(scene.id)}
                  aria-current={active ? "step" : undefined}
                  className={active ? "on" : undefined}
                >
                  <b>{i + 1}</b>
                  {tr(scene.label)}
                  <span
                    className="demo-progress"
                    style={{
                      transform: `scaleX(${width})`,
                      transitionDuration: active && playing ? `${frame.ms}ms` : "0ms",
                    }}
                  />
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

function ChatScene({ frame, tr }: { frame: Frame; tr: Tr }) {
  return (
    <div className="d-chat">
      <div className="d-chathead">
        <span className="d-avatar" />
        <div>
          <b>{tr("demo.store")}</b>
          <small>{tr("demo.open_now")}</small>
        </div>
      </div>
      <div className="d-msgs">
        <span className="d-ctx">{tr("demo.about")}</span>
        {MESSAGES.slice(0, frame.shown ?? 0).map((m) => (
          <p key={m.text} className={`d-msg ${m.from === "ana" ? "out" : "in"}`}>
            {tr(m.text)}
          </p>
        ))}
        {frame.typing && (
          <p className={`d-msg typing ${frame.typing === "ana" ? "out" : "in"}`}>
            <span />
            <span />
            <span />
          </p>
        )}
      </div>
      <div className="d-composer">
        <span>{tr("demo.composer")}</span>
        <i />
      </div>
    </div>
  );
}

function ConfirmScene({
  frame,
  tr,
  money,
  reduced,
}: {
  frame: Frame;
  tr: Tr;
  money: (minor: number) => string;
  reduced: boolean;
}) {
  return (
    <div className="d-confirm">
      <div className="d-order">
        <span className="d-eyebrow">{tr("demo.order_title")}</span>
        <div className="d-order-line">
          <b>{tr("demo.order_line")}</b>
          <b>{money(ORDER_MINOR)}</b>
        </div>
        <small>{tr("demo.order_pickup")}</small>
      </div>
      <div className={`d-party${frame.vendorOk ? " ok" : ""}`}>
        <span className="d-who">{tr("demo.vendor")}</span>
        <span className="d-btn">
          <i className="d-check" />
          {tr("demo.vendor_confirm")}
        </span>
      </div>
      <div className={`d-party${frame.buyerOk ? " ok" : ""}`}>
        <span className="d-who">{tr("demo.buyer")}</span>
        <span className="d-btn">
          <i className="d-check" />
          {tr("demo.buyer_confirm")}
        </span>
      </div>
      {frame.done && (
        <div className="d-done">
          <b>{tr("demo.confirmed")}</b>
          <div className="d-tally">
            <small>{tr("demo.today_total")}</small>
            <CountUp
              from={TALLY_BEFORE_MINOR}
              to={TALLY_BEFORE_MINOR + ORDER_MINOR}
              format={money}
              instant={reduced}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function CountUp({
  from,
  to,
  format,
  instant,
}: {
  from: number;
  to: number;
  format: (minor: number) => string;
  instant: boolean;
}) {
  const [value, setValue] = useState(instant ? to : from);
  useEffect(() => {
    if (instant) {
      setValue(to);
      return;
    }
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 900);
      // Steps of 100 pesos (10.000 minor units) so the counter reads cleanly mid-way.
      setValue(Math.round((from + (to - from) * (1 - (1 - t) ** 3)) / 10_000) * 10_000);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [from, to, instant]);
  return <b className="d-count">{format(value)}</b>;
}

// Map is 320×420 user units: four rows of blocks between three streets each way.
// Route: Ana's door → street → avenue → Doña Rosa's stand.
const ROUTE = "M 30 288 L 30 230 L 160 230 L 160 110 L 292 110 L 292 88";
const ROWS = [
  [0, 102],
  [118, 104],
  [238, 104],
  [358, 62],
] as const;
const COLS = [
  [0, 52],
  [68, 84],
  [168, 84],
  [268, 52],
] as const;
const PARK = { row: 1, col: 2 };
const TREES = [
  [188, 142],
  [230, 152],
  [198, 196],
  [238, 202],
] as const;

const WALK_TEXT: Record<Walk, MessageKey> = {
  to: "demo.map_to",
  at: "demo.map_at",
  back: "demo.map_back",
  home: "demo.map_done",
};

function MapScene({
  walk,
  ms,
  playing,
  reduced,
  tr,
}: {
  walk: Walk;
  ms: number;
  playing: boolean;
  reduced: boolean;
  tr: Tr;
}) {
  const routeRef = useRef<SVGPathElement>(null);
  const personRef = useRef<SVGGElement>(null);
  const progressRef = useRef(0); // 0 = Ana's home, 1 = the stand

  useEffect(() => {
    const route = routeRef.current;
    const person = personRef.current;
    if (!route || !person) return;
    const length = route.getTotalLength();
    const place = (p: number) => {
      const point = route.getPointAtLength(p * length);
      person.setAttribute("transform", `translate(${point.x} ${point.y})`);
      progressRef.current = p;
    };

    if (reduced || walk === "at" || walk === "home") {
      place(walk === "home" && !reduced ? 0 : 1);
      return;
    }
    if (!playing) {
      place(progressRef.current);
      return;
    }
    const from = progressRef.current;
    const target = walk === "to" ? 1 : 0;
    const start = performance.now();
    const duration = ms * 0.9;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
      place(from + (target - from) * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [walk, ms, playing, reduced]);

  const carrying = walk !== "to";

  return (
    <div className="d-map">
      <svg viewBox="0 0 320 420" preserveAspectRatio="xMidYMid slice" role="presentation">
        <rect width="320" height="420" className="m-land" />
        {ROWS.map(([y, h], r) =>
          COLS.map(([x, w], c) => (
            <rect
              key={`${r}-${c}`}
              x={x}
              y={y}
              width={w}
              height={h}
              rx="6"
              className={r === PARK.row && c === PARK.col ? "m-park" : "m-block"}
            />
          )),
        )}
        {TREES.map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="9" className="m-tree" />
        ))}

        <path d={ROUTE} className="m-route" />
        <path ref={routeRef} d={ROUTE} fill="none" stroke="none" />

        {/* Ana's home */}
        <g transform="translate(30 300)">
          <path d="M -12 2 L 0 -10 L 12 2 L 12 14 L -12 14 Z" className="m-house" />
          <rect x="-3" y="5" width="6" height="9" className="m-door" />
        </g>
        <text x="6" y="332" textAnchor="start" className="m-label">
          {tr("demo.map_home")}
        </text>

        {/* Doña Rosa's stand */}
        <g transform="translate(292 74)">
          <rect x="-14" y="-4" width="28" height="16" rx="2" className="m-stand" />
          <path d="M -16 -4 L -12 -14 L 12 -14 L 16 -4 Z" className="m-awning" />
        </g>
        <text x="314" y="52" textAnchor="end" className="m-label">
          {tr("demo.map_store")}
        </text>

        <g ref={personRef} transform="translate(30 288)">
          <circle r="13" className="m-pulse" />
          <circle r="7" className="m-person" />
          {carrying && <rect x="5" y="-14" width="10" height="9" rx="2" className="m-bag" />}
        </g>
      </svg>
      <span className="d-chip">{tr("demo.map_distance")}</span>
      <span className="d-status" key={walk}>
        {tr(WALK_TEXT[walk])}
      </span>
    </div>
  );
}
