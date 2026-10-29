import { useId, type CSSProperties, type ReactNode } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../theme";
import type { GlassType } from "../data/catalog";

export function useSafeId() {
  return "u" + useId().replace(/[^a-zA-Z0-9]/g, "");
}

const RIND = "#f07a12";
const FLESH = "#fdb72a";
const PITH = "#fff3d6";
const STRAW = "#e8341c";
export const SUNRISE = ["#fdb500", "#fe7802", "#e8341c"];
const f2 = (n: number) => n.toFixed(2);

/* ------------------------- Rodela de laranja ------------------------ */

export function CitrusShape({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const segs = 10;
  const inner = r * 0.74;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={RIND} />
      <circle cx={cx} cy={cy} r={r * 0.86} fill={PITH} />
      {Array.from({ length: segs }, (_, i) => {
        const a0 = (i / segs) * Math.PI * 2;
        const a1 = ((i + 1) / segs) * Math.PI * 2;
        const dPath = `M${f2(cx)} ${f2(cy)} L${f2(cx + inner * Math.sin(a0))} ${f2(cy - inner * Math.cos(a0))} A${f2(inner)} ${f2(inner)} 0 0 1 ${f2(cx + inner * Math.sin(a1))} ${f2(cy - inner * Math.cos(a1))} Z`;
        return <path key={i} d={dPath} fill={FLESH} stroke={PITH} strokeWidth={r * 0.09} strokeLinejoin="round" />;
      })}
      <circle cx={cx} cy={cy} r={r * 0.12} fill={PITH} />
    </g>
  );
}

export function CitrusWheel({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} className={className} aria-hidden>
      <CitrusShape cx={20} cy={20} r={19} />
    </svg>
  );
}

/* --------------- Taça hurricane do logo (progresso/orçamento) ------- */

const H_BOWL =
  "M10 6 L54 6 C54 22 44 32 44 46 C44 58 51 66 51 78 C51 90 40 96 34 97 L30 97 C24 96 13 90 13 78 C13 66 20 58 20 46 C20 32 10 22 10 6 Z";
const H_STEM = "M30 97 L30 108 C30 110.5 19 110.5 16 114 L48 114 C45 110.5 34 110.5 34 108 L34 97";
const WAVE = "M-60 0 q7.5 -2.6 15 0" + " t15 0".repeat(11) + " V160 H-60 Z";

export function HurricaneGlass({
  level,
  className = "",
  style,
  garnish = false,
  still = false,
  colors,
}: {
  level: number;
  className?: string;
  style?: CSSProperties;
  garnish?: boolean;
  still?: boolean;
  colors?: string[];
}) {
  const theme = useTheme();
  const liq: string[] = colors ?? theme.liquid;
  const id = useSafeId();
  const over = level > 1.0001;
  const l = Math.max(0, Math.min(1, level));
  const TOP = 9;
  const BOTTOM = 97;
  const surface = l === 0 ? BOTTOM + 8 : BOTTOM - l * (BOTTOM - TOP);

  return (
    <svg viewBox="0 -14 64 130" className={className} style={style} aria-hidden>
      <defs>
        <clipPath id={`${id}b`}>
          <path d={H_BOWL} />
        </clipPath>
        <linearGradient id={`${id}l`} gradientUnits="userSpaceOnUse" x1="0" y1={TOP} x2="0" y2={BOTTOM}>
          {liq.map((c, i) => (
            <stop key={i} offset={i / Math.max(1, liq.length - 1)} stopColor={c} />
          ))}
        </linearGradient>
        <mask id={`${id}m`} maskUnits="userSpaceOnUse" x="-10" y="-20" width="90" height="150">
          <motion.g initial={false} animate={{ y: surface }} transition={{ type: "spring", stiffness: 55, damping: 15 }}>
            <g className={still ? "" : "animate-wave"}>
              <path d={WAVE} fill="#fff" />
            </g>
          </motion.g>
        </mask>
      </defs>

      {garnish && (
        <path d="M36 74 L48 -3 L57 -10" fill="none" stroke={STRAW} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      )}
      <g clipPath={`url(#${id}b)`}>
        <rect x="0" y="0" width="64" height="100" fill={`url(#${id}l)`} mask={`url(#${id}m)`} />
      </g>
      <path
        d={H_BOWL}
        fill="currentColor"
        fillOpacity="0.06"
        stroke={over ? STRAW : "currentColor"}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d={H_STEM} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M16.5 14 C17.5 26 25 33 25 45" fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="1.6" strokeLinecap="round" />
      {garnish && <CitrusShape cx={51} cy={4} r={11} />}
      {over && (
        <g fill={liq[liq.length - 1]}>
          {[
            { x: 8.5, delay: 0 },
            { x: 55.5, delay: 0.7 },
            { x: 11, delay: 1.3 },
          ].map((p, i) => (
            <motion.path
              key={i}
              d={`M${p.x} 8 q-2.2 3.8 0 5.4 q2.2 -1.6 0 -5.4 Z`}
              initial={{ y: 0, opacity: 0 }}
              animate={{ y: [0, 70], opacity: [0, 1, 0] }}
              transition={{ duration: 1.8, delay: p.delay, repeat: Infinity, ease: "easeIn" }}
            />
          ))}
        </g>
      )}
    </svg>
  );
}

/* ----------------------- Monograma GS (logo) ----------------------- */

export function GSMark({ size = 26, className = "" }: { size?: number; className?: string }) {
  return (
    <span className={`inline-flex flex-col items-start leading-none ${className}`}>
      <span className="flex items-end">
        <span
          className="gs-offset font-sans font-extrabold tracking-[-0.06em] text-fg"
          style={{ fontSize: size, lineHeight: 0.8 }}
        >
          GS
        </span>
        <HurricaneGlass
          level={1}
          still
          garnish
          colors={SUNRISE}
          className="w-auto text-fg/60"
          style={{ height: size * 1.3, marginLeft: size * 0.04, marginBottom: -size * 0.06 }}
        />
      </span>
      <span
        className="font-sans font-semibold uppercase text-fg/85"
        style={{ fontSize: Math.max(8, size * 0.31), letterSpacing: "0.36em", marginTop: size * 0.22 }}
      >
        Top Drinks
      </span>
    </span>
  );
}

/* ----------------------------- Carimbo ----------------------------- */

export function Stamp({
  text,
  size = 120,
  className = "",
  children,
}: {
  text: string;
  size?: number;
  className?: string;
  children?: ReactNode;
}) {
  const id = useSafeId();
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <path id={`${id}c`} d="M60 60 m-45 0 a45 45 0 1 1 90 0 a45 45 0 1 1 -90 0" />
        </defs>
        <circle cx="60" cy="60" r="58.5" fill="var(--bg)" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="60" cy="60" r="33" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="1.5 3" />
        <text
          fill="currentColor"
          style={{ fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 600, letterSpacing: "1.6px", textTransform: "uppercase" }}
        >
          <textPath href={`#${id}c`} textLength="280" lengthAdjust="spacing">
            {text}
          </textPath>
        </text>
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  );
}

/* ---------------------- Taças ilustradas por drink ------------------ */

const GLASS: Record<GlassType, { bowl: string; extra?: string; top: number; bottom: number }> = {
  rocks: {
    bowl: "M8 18 L40 18 L38.4 55.5 C38.3 58.6 36.4 60 33.6 60 L14.4 60 C11.6 60 9.7 58.6 9.6 55.5 Z",
    top: 25,
    bottom: 60,
  },
  highball: {
    bowl: "M13.5 6 L34.5 6 L33 59 C33 61 32 62 30 62 L18 62 C16 62 15 61 15 59 Z",
    top: 13,
    bottom: 62,
  },
  martini: { bowl: "M5 12 L43 12 L24 34 Z", extra: "M24 34 L24 57 M15.5 58.5 L32.5 58.5", top: 16, bottom: 34 },
  coupe: {
    bowl: "M6 16 C6 27 13 33 24 33 C35 33 42 27 42 16 Z",
    extra: "M24 33 L24 57 M15.5 58.5 L32.5 58.5",
    top: 19,
    bottom: 33,
  },
  wine: {
    bowl: "M11.5 6 L36.5 6 C39.5 15 40.5 24 36 30.5 C32.5 35.5 28.5 37 24 37 C19.5 37 15.5 35.5 12 30.5 C7.5 24 8.5 15 11.5 6 Z",
    extra: "M24 37 L24 57 M15.5 58.5 L32.5 58.5",
    top: 16,
    bottom: 37,
  },
  flute: {
    bowl: "M18.5 4 L29.5 4 C30.5 16 30 27 26.5 35 L21.5 35 C18 27 17.5 16 18.5 4 Z",
    extra: "M24 35 L24 57 M16.5 58.5 L31.5 58.5",
    top: 9,
    bottom: 35,
  },
  mug: {
    bowl: "M7 14 L33 14 L33 58 C33 60 32 61 30 61 L10 61 C8 61 7 60 7 58 Z",
    extra: "M33 22 C41 22 42.5 26 42.5 32 C42.5 38 41 42 33 42",
    top: 14,
    bottom: 61,
  },
  hurricane: {
    bowl: "M13 4 L35 4 C35 13 29.5 18 29.5 26 C29.5 32 33.5 36 33.5 43 C33.5 49 28.5 52 25.8 52.6 L22.2 52.6 C19.5 52 14.5 49 14.5 43 C14.5 36 18.5 32 18.5 26 C18.5 18 13 13 13 4 Z",
    extra: "M24 52.6 L24 58 M16.5 59.5 L31.5 59.5",
    top: 9,
    bottom: 52.6,
  },
};

const COPPER = ["#f0ae78", "#c0652f", "#7a3416"];

export function DrinkGlass({
  glass,
  color,
  filled,
  className = "",
}: {
  glass: GlassType;
  color: string | string[];
  filled: boolean;
  className?: string;
}) {
  const id = useSafeId();
  const g = GLASS[glass];
  const colors = glass === "mug" ? COPPER : Array.isArray(color) ? color : [color, color];
  const h = g.bottom - g.top + 2;
  return (
    <svg viewBox="0 0 48 64" className={className} aria-hidden>
      <defs>
        <clipPath id={`${id}c`}>
          <path d={g.bowl} />
        </clipPath>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="0" y2="1">
          {colors.map((c, i) => (
            <stop key={i} offset={i / (colors.length - 1)} stopColor={c} />
          ))}
        </linearGradient>
      </defs>
      <g clipPath={`url(#${id}c)`}>
        <motion.g initial={false} animate={{ y: filled ? 0 : h }} transition={{ type: "spring", stiffness: 110, damping: 17 }}>
          <rect x="0" y={g.top} width="48" height={h} fill={`url(#${id}g)`} />
        </motion.g>
      </g>
      <path d={g.bowl} fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      {g.extra && <path d={g.extra} fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />}
    </svg>
  );
}
