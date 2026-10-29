/* ================================================================== */
/*  GS TOP DRINKS — HurricaneGlass com GSAP                             */
/*  Versão GSAP da taça de progresso para animações suaves             */
/* ================================================================== */

import { useEffect, useRef, type CSSProperties } from "react";
import { gsap } from "gsap";
import { useTheme } from "../../theme";

const H_BOWL =
  "M10 6 L54 6 C54 22 44 32 44 46 C44 58 51 66 51 78 C51 90 40 96 34 97 L30 97 C24 96 13 90 13 78 C13 66 20 58 20 46 C20 32 10 22 10 6 Z";
const H_STEM = "M30 97 L30 108 C30 110.5 19 110.5 16 114 L48 114 C45 110.5 34 110.5 34 108 L34 97";
const WAVE = "M-60 0 q7.5 -2.6 15 0" + " t15 0".repeat(11) + " V160 H-60 Z";

interface HurricaneGlassGSAPProps {
  level: number;
  className?: string;
  style?: CSSProperties;
  garnish?: boolean;
  still?: boolean;
  colors?: string[];
}

export function HurricaneGlassGSAP({
  level,
  className = "",
  style,
  garnish = false,
  still = false,
  colors,
}: HurricaneGlassGSAPProps) {
  const theme = useTheme();
  const liq = colors ?? theme.liquid;
  const svgRef = useRef<SVGSVGElement>(null);
  const liquidRef = useRef<SVGRectElement>(null);
  const waveRef = useRef<SVGPathElement>(null);
  const overflowAdded = useRef(false);

  // Animação do nível do líquido
  useEffect(() => {
    if (!liquidRef.current) return;
    
    const l = Math.max(0, Math.min(1, level));
    const TOP = 9;
    const BOTTOM = 97;
    const surface = l === 0 ? BOTTOM + 8 : BOTTOM - l * (BOTTOM - TOP);
    const over = level > 1.0001;

    gsap.to(liquidRef.current, {
      y: surface,
      duration: 0.6,
      ease: "power2.out",
    });

    // Animação da onda
    if (!still && waveRef.current) {
      gsap.to(waveRef.current, {
        y: surface,
        duration: 0.6,
        ease: "power2.out",
      });
    }

    // Overflow animation
    if (over && !overflowAdded.current) {
      overflowAdded.current = true;
      animateOverflow();
    }
  }, [level, still]);

  const animateOverflow = () => {
    if (!svgRef.current) return;
    
    const overflowColor = liq[liq.length - 1];
    const overflowGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    overflowGroup.setAttribute("fill", overflowColor);
    
    for (let i = 0; i < 3; i++) {
      const x = [8.5, 55.5, 11][i];
      const delay = [0, 0.7, 1.3][i];
      
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", `M${x} 8 q-2.2 3.8 0 5.4 q2.2 -1.6 0 -5.4 Z`);
      overflowGroup.appendChild(path);
      
      // Animação em sequência: fade in -> move down -> fade out
      gsap.timeline({ repeat: -1, delay })
        .fromTo(path, { y: 0, opacity: 0 }, { y: 20, opacity: 1, duration: 0.6, ease: "power2.out" })
        .to(path, { y: 70, opacity: 0, duration: 1.2, ease: "power1.in" });
    }
    
    svgRef.current?.appendChild(overflowGroup);
  };

  // Wave animation contínua
  useEffect(() => {
    if (still || !waveRef.current) return;
    
    const ctx = gsap.context(() => {
      gsap.to(waveRef.current, {
        x: "-=60",
        duration: 3,
        ease: "none",
        repeat: -1,
      });
    });
    
    return () => ctx.revert();
  }, [still]);

  const id = useRef("gsap-glass-" + Math.random().toString(36).substr(2, 9)).current;

  return (
    <svg
      ref={svgRef}
      viewBox="0 -14 64 130"
      className={className}
      style={style}
      aria-hidden
    >
      <defs>
        <clipPath id={`${id}b`}>
          <path d={H_BOWL} />
        </clipPath>
        <linearGradient id={`${id}l`} gradientUnits="userSpaceOnUse" x1="0" y1={9} x2="0" y2={97}>
          {liq.map((c, i) => (
            <stop key={i} offset={i / Math.max(1, liq.length - 1)} stopColor={c} />
          ))}
        </linearGradient>
        <mask id={`${id}m`} maskUnits="userSpaceOnUse" x="-10" y="-20" width="90" height="150">
          <rect ref={liquidRef} x="0" y="97" width="64" height="100" fill="white" />
          <path ref={waveRef} d={WAVE} fill="#fff" />
        </mask>
      </defs>

      {garnish && (
        <path d="M36 74 L48 -3 L57 -10" fill="none" stroke="#e8341c" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      )}

      <g clipPath={`url(#${id}b)`}>
        <rect x="0" y="0" width="64" height="100" fill={`url(#${id}l)`} mask={`url(#${id}m)`} />
      </g>

      <path
        d={H_BOWL}
        fill="currentColor"
        fillOpacity="0.06"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d={H_STEM} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M16.5 14 C17.5 26 25 33 25 45" fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="1.6" strokeLinecap="round" />
      {garnish && (
        <svg viewBox="0 0 40 40" x="40" y="-10" width="22" height="22">
          <circle cx="20" cy="20" r="19" fill="#f07a12" />
          <circle cx="20" cy="20" r={19 * 0.86} fill="#fff3d6" />
          {Array.from({ length: 10 }, (_, i) => {
            const a0 = (i / 10) * Math.PI * 2;
            const a1 = ((i + 1) / 10) * Math.PI * 2;
            const inner = 19 * 0.74;
            return (
              <path
                key={i}
                d={`M20 20 L${20 + inner * Math.sin(a0)} ${20 - inner * Math.cos(a0)} A${inner} ${inner} 0 0 1 ${20 + inner * Math.sin(a1)} ${20 - inner * Math.cos(a1)} Z`}
                fill="#fdb72a"
                stroke="#fff3d6"
                strokeWidth={19 * 0.09}
                strokeLinejoin="round"
              />
            );
          })}
          <circle cx="20" cy="20" r={19 * 0.12} fill="#fff3d6" />
        </svg>
      )}
    </svg>
  );
}