"use client";

// Landing-page backdrop: a faint neighborhood map where people walk from their
// homes to a stand and back, the same motion as the demo's pickup scene.
// Layout is fixed (no randomness) so server and client render the same SVG.
// Walkers use SVG animateMotion; they pause for people who prefer reduced motion.
import { useEffect, useRef } from "react";

const BLOCK_W = 150;
const BLOCK_H = 104;
const STREET = 30;
const COLS = 9;
const ROWS = 7;

const colX = (c: number) => -40 + c * (BLOCK_W + STREET);
const rowY = (r: number) => -30 + r * (BLOCK_H + STREET);
/** Point on the street just below a block, centered on it: where its door opens. */
const door = (c: number, r: number) => ({ x: colX(c) + BLOCK_W / 2, y: rowY(r) + BLOCK_H + STREET / 2 });

type Cell = readonly [col: number, row: number];

const PARKS: Cell[] = [[2, 1], [6, 4], [4, 6]];
const HOUSES: Cell[] = [[0, 1], [3, 2], [5, 1], [1, 3], [8, 4], [2, 5], [5, 5], [7, 2], [0, 5], [6, 6]];
const STORES: Cell[] = [[2, 2], [4, 1], [6, 2], [3, 4], [7, 5], [1, 6]];
/** Who walks where: [house, store, seconds per round trip, start offset in seconds]. */
const WALKS: [Cell, Cell, number, number][] = [
  [[0, 1], [2, 2], 18, 0],
  [[3, 2], [4, 1], 15, 6],
  [[5, 1], [6, 2], 14, 3],
  [[1, 3], [3, 4], 20, 11],
  [[8, 4], [7, 5], 16, 8],
  [[2, 5], [1, 6], 15, 2],
  [[5, 5], [3, 4], 19, 14],
  [[7, 2], [6, 2], 13, 5],
];

const isPark = (c: number, r: number) => PARKS.some(([pc, pr]) => pc === c && pr === r);

/** Manhattan route along street centerlines from a house door to a store door. */
function route([hc, hr]: Cell, [sc, sr]: Cell): string {
  const from = door(hc, hr);
  const to = door(sc, sr);
  const avenue = hc < sc ? colX(sc) - STREET / 2 : colX(sc) + BLOCK_W + STREET / 2;
  return `M${from.x} ${from.y} H${avenue} V${to.y} H${to.x}`;
}

function House({ c, r }: { c: number; r: number }) {
  const { x } = door(c, r);
  const y = rowY(r) + BLOCK_H - 22;
  return <path className="bg-icon" d={`M${x - 11} ${y + 2} L${x} ${y - 9} L${x + 11} ${y + 2} V${y + 14} H${x - 11} Z`} />;
}

function Store({ c, r }: { c: number; r: number }) {
  const { x } = door(c, r);
  const y = rowY(r) + BLOCK_H - 22;
  return (
    <g className="bg-icon">
      <rect x={x - 13} y={y} width={26} height={14} rx={2} />
      <path d={`M${x - 15} ${y} L${x - 11} ${y - 9} H${x + 11} L${x + 15} ${y} Z`} />
    </g>
  );
}

export function MapBackground() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => (query.matches ? svg.pauseAnimations() : svg.unpauseAnimations());
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  return (
    <div className="map-bg" aria-hidden="true">
      <svg ref={svgRef} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        {Array.from({ length: ROWS }, (_, r) =>
          Array.from({ length: COLS }, (_, c) => (
            <rect
              key={`${c}-${r}`}
              x={colX(c)}
              y={rowY(r)}
              width={BLOCK_W}
              height={BLOCK_H}
              rx={12}
              className={isPark(c, r) ? "bg-park" : "bg-block"}
            />
          )),
        )}
        {WALKS.map(([house, store], i) => (
          <path key={i} d={route(house, store)} className="bg-route" />
        ))}
        {HOUSES.map(([c, r]) => (
          <House key={`h${c}-${r}`} c={c} r={r} />
        ))}
        {STORES.map(([c, r]) => (
          <Store key={`s${c}-${r}`} c={c} r={r} />
        ))}
        {WALKS.map(([house, store, seconds, offset], i) => (
          <g key={i} className="bg-walker">
            <circle r={11} className="bg-walker-halo" />
            <circle r={6} />
            {/* Out to the store, a pause to pick up, back home, a pause at home. */}
            <animateMotion
              path={route(house, store)}
              dur={`${seconds}s`}
              begin={`-${offset}s`}
              repeatCount="indefinite"
              keyPoints="0;1;1;0;0"
              keyTimes="0;0.4;0.5;0.9;1"
              calcMode="linear"
            />
          </g>
        ))}
      </svg>
    </div>
  );
}
