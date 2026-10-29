import { useEffect, useRef, useState, type ReactNode } from "react";
import { animate, motion, useMotionValue } from "framer-motion";
import { MoveLeft, MoveRight } from "lucide-react";
import { CONTACT, fmt, waLink } from "../data/catalog";
import { CitrusWheel, GSMark } from "./brand";

export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ------------------------------ Botões ----------------------------- */

interface BtnProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  variant?: "solid" | "line";
  full?: boolean;
  arrow?: boolean;
  icon?: ReactNode;
  className?: string;
}

/** Botão com sombra deslocada — o mesmo efeito de impressão do logo GS */
export function Btn({
  children,
  onClick,
  href,
  disabled = false,
  variant = "solid",
  full = false,
  arrow = true,
  icon,
  className = "",
}: BtnProps) {
  const base = `group relative inline-flex items-center gap-3 px-7 py-[17px] text-[12.5px] font-semibold uppercase tracking-[0.18em] transition-[transform,box-shadow,background-color,border-color,color] duration-200 outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-acc ${
    full ? "w-full justify-between" : "justify-center"
  }`;
  const solid = disabled
    ? "cursor-not-allowed bg-fg/10 text-fg/35"
    : "bg-acc text-onacc shadow-[-5px_5px_0_0_var(--acc2)] hover:-translate-x-[2px] hover:translate-y-[2px] hover:shadow-[-3px_3px_0_0_var(--acc2)] active:-translate-x-[5px] active:translate-y-[5px] active:shadow-none";
  const line = disabled
    ? "cursor-not-allowed border border-fg/15 text-fg/35"
    : "border border-fg/30 text-fg hover:border-fg hover:bg-fg/[0.05]";
  const cls = `${base} ${variant === "solid" ? solid : line} ${className}`;
  const inner = (
    <>
      {icon}
      <span>{children}</span>
      {arrow && <MoveRight className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />}
    </>
  );
  if (href)
    return (
      <a href={href} target="_blank" rel="noreferrer" className={cls}>
        {inner}
      </a>
    );
  return (
    <button type="button" onClick={disabled ? undefined : onClick} aria-disabled={disabled} className={cls}>
      {inner}
    </button>
  );
}

export function TextLink({
  children,
  onClick,
  href,
  back = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  back?: boolean;
}) {
  const cls =
    "group inline-flex items-center gap-2.5 text-[13px] font-semibold uppercase tracking-[0.16em] text-fg/65 transition-colors hover:text-fg";
  const inner = (
    <>
      {back && <MoveLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />}
      <span className="border-b border-fg/25 pb-1 transition-colors group-hover:border-acc">{children}</span>
    </>
  );
  if (href)
    return (
      <a href={href} target="_blank" rel="noreferrer" className={cls}>
        {inner}
      </a>
    );
  return (
    <button type="button" onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}

/* ---------------------------- Tipografia --------------------------- */

export function Label({ children, index, className = "" }: { children: ReactNode; index?: string; className?: string }) {
  return (
    <p className={`font-mono text-[13px] uppercase tracking-[0.16em] text-fg/60 ${className}`}>
      {index && <span className="text-acc">{index} — </span>}
      {children}
    </p>
  );
}

export function Leader({ left, right, className = "" }: { left: ReactNode; right: ReactNode; className?: string }) {
  return (
    <div className={`flex items-baseline gap-2 ${className}`}>
      <span className="min-w-0">{left}</span>
      <span className="leader" />
      <span className="shrink-0 tabular-nums">{right}</span>
    </div>
  );
}

/* --------------------------- Valor animado ------------------------- */

export function AnimatedMoney({ value, className = "" }: { value: number; className?: string }) {
  const mv = useMotionValue(value);
  const [display, setDisplay] = useState(value);
  const first = useRef(true);

  useEffect(() => {
    const controls = animate(mv, value, {
      duration: first.current ? 0 : 0.7,
      ease: EASE,
      onUpdate: (v) => setDisplay(v),
    });
    first.current = false;
    return () => controls.stop();
  }, [value, mv]);

  return <span className={className}>{fmt.format(display)}</span>;
}

/* ----------------------------- Reveal ------------------------------ */

export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* --------------------------- Ícone Instagram ----------------------- */

export function IgIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

/* ------------------------------ Marquee ---------------------------- */

export function Marquee({ items }: { items: string[] }) {
  const half = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-fg/12 py-5" aria-hidden>
      <div className="flex w-max animate-marquee items-center">
        {[...half, ...half].map((t, i) => (
          <span key={i} className="flex items-center">
            <span className="px-8 font-display text-[clamp(1.6rem,3vw,2.4rem)] italic text-fg/85">{t}</span>
            <CitrusWheel size={22} />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------ Rodapé ----------------------------- */

export function Footer() {
  return (
    <footer className="border-t border-fg/12 print:hidden">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-12">
        <div className="md:col-span-4">
          <GSMark size={34} />
          <p className="mt-6 max-w-xs text-[15px] leading-relaxed text-fg/55">
            Open bar premium para casamentos, 15 anos, formaturas, eventos corporativos e festas.
          </p>
        </div>
        <div className="md:col-span-3">
          <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-fg/45">Contato</p>
          <a href={waLink()} target="_blank" rel="noreferrer" className="mt-3 block text-[15px] hover:text-acc">
            {CONTACT.phone}
          </a>
          <a href={`mailto:${CONTACT.email}`} className="mt-1 block text-[15px] hover:text-acc">
            {CONTACT.email}
          </a>
        </div>
        <div className="md:col-span-3">
          <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-fg/45">Endereço</p>
          <p className="mt-3 text-[15px] leading-relaxed">
            {CONTACT.street}
            <br />
            {CONTACT.city}
          </p>
        </div>
        <div className="md:col-span-2">
          <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-fg/45">Redes</p>
          <a href={CONTACT.instagram} target="_blank" rel="noreferrer" className="mt-3 flex items-center gap-2 text-[15px] hover:text-acc">
            <IgIcon size={15} /> {CONTACT.handle}
          </a>
          <a href={CONTACT.site} target="_blank" rel="noreferrer" className="mt-1 block text-[15px] hover:text-acc">
            gstopdrinks.com.br
          </a>
        </div>
      </div>
      <div className="border-t border-fg/10">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-2 px-5 py-5 font-mono text-[12px] text-fg/40 sm:px-8">
          <span>© GS Top Drinks</span>
          <span>Protótipo · simulador de evento</span>
        </div>
      </div>
    </footer>
  );
}
