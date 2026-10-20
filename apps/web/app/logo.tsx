// The Milhojas mark: line-art milhoja, one stroke weight, no fills, one color
// (currentColor; amber via .logo-mark in globals.css), so it prints, embroiders and redraws easily. The same drawing
// lives in docs/brand/milhojas-mark.svg. Layers, bottom up: pastry (rounded, a little
// wider so each layer stands out), piped cream,
// pastry, piped cream, top cream. When animated, the whole milhoja drops from the
// air with its layers slightly apart; they land together and the stack squashes.
import type { CSSProperties } from "react";

const STROKE = 2.75;

function Pastry({ y, i }: { y: number; i: number }) {
  return (
    <g className="logo-layer" style={{ "--i": i } as CSSProperties}>
      <rect x="8" y={y} width="80" height="10" rx="5" />
      {/* Seven half-waves, 14.75 → 81.25, so both ends mirror each other. */}
      <path d={`M14.75 ${y + 5} q4.75 -2.4 9.5 0 t9.5 0 t9.5 0 t9.5 0 t9.5 0 t9.5 0 t9.5 0`} />
    </g>
  );
}

function Cream({ cy, i }: { cy: number; i: number }) {
  return (
    <g className="logo-layer" style={{ "--i": i } as CSSProperties}>
      {Array.from({ length: 8 }, (_, n) => (
        <circle key={n} cx={16.5 + n * 9} cy={cy} r="4.5" />
      ))}
    </g>
  );
}

/** Top cream: a tall, soft five-wave layer as wide as the pastry, resting on the last row of piped cream. */
function TopCream({ i }: { i: number }) {
  return (
    <g className="logo-layer" style={{ "--i": i } as CSSProperties}>
      <path d="M13 38 Q8 38 8 33 V29 Q8 25 12 25 q7.2 -8 14.4 0 t14.4 0 t14.4 0 t14.4 0 t14.4 0 Q88 25 88 29 V33 Q88 38 83 38 Z" />
    </g>
  );
}

export function LogoMark({
  size = 32,
  animated = false,
  title,
}: {
  size?: number;
  animated?: boolean;
  /** Accessible name; omit when the mark sits next to the written name. */
  title?: string;
}) {
  return (
    <svg
      className={animated ? "logo-mark animated" : "logo-mark"}
      width={size}
      height={size}
      viewBox="0 0 96 96"
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <Pastry y={66} i={0} />
      <Cream cy={61.5} i={1} />
      <Pastry y={47} i={2} />
      <Cream cy={42.5} i={3} />
      <TopCream i={4} />
    </svg>
  );
}
