import { useState, type CSSProperties } from "react";
import { motion } from "framer-motion";
import { Check, MoveRight } from "lucide-react";
import { EASE, Label, Reveal, TextLink } from "./ui";
import { GUEST_OPTIONS, SEGMENTS, SEGMENT_ORDER, VIBE_OPTIONS } from "../data/catalog";

interface Props {
  question: 0 | 1 | 2 | 3;
  selected?: string;
  onAnswer: (value: string) => void;
  onBack: () => void;
}

const COPY = [
  {
    label: "O momento",
    title: "Que momento",
    em: "vamos brindar?",
    hint: "Cada tipo de evento leva você a uma experiência com identidade própria.",
  },
  {
    label: "Os convidados",
    title: "Quantos convidados",
    em: "no brinde?",
    hint: "Usamos esse número para dimensionar a equipe e estimar o investimento total.",
  },
  {
    label: "O estilo",
    title: "Qual a cara",
    em: "do seu bar?",
    hint: "Sua resposta indica o pacote mais alinhado ao seu evento.",
  },
  {
    label: "O essencial",
    title: "O que <span className='font-normal italic'>não pode faltar</span>?",
    hint: "Marque os itens indispensáveis. Isso ajuda a GS a montar a carta ideal para o seu perfil.",
  },
];

type Row = { id: string; label: string; sub: string; meta: string };

export default function QuizScreen({ question, selected, onAnswer, onBack }: Props) {
  const [locked, setLocked] = useState<string | null>(null);
  const c = COPY[question];
  const isActive = (id: string) => locked === id || (!locked && selected === id);

  const pick = (v: string) => {
    if (locked) return;
    setLocked(v);
    window.setTimeout(() => onAnswer(v), 480);
  };

  const rows: Row[] =
    question === 1
      ? GUEST_OPTIONS.map((g: typeof GUEST_OPTIONS[0]) => ({ id: g.id, label: g.label, sub: g.sub, meta: g.staff }))
      : question === 2
      ? VIBE_OPTIONS.map((v: typeof VIBE_OPTIONS[0]) => ({ id: v.id, label: v.label, sub: v.sub, meta: v.meta }))
      : [];

  return (
    <section className="mx-auto max-w-7xl px-5 pb-20 pt-28 sm:px-8 lg:pt-32">
      <div className="grid gap-6 border-b border-fg/15 pb-10 md:grid-cols-12 md:items-end">
        <div className="md:col-span-8">
          <Reveal>
            <Label index={`0${question + 1}`}>{c.label}</Label>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 font-display text-[clamp(2.4rem,5.6vw,4.9rem)] font-medium leading-[0.95] tracking-[-0.02em]">
              {/* eslint-disable-next-line react/no-danger */}
              <span dangerouslySetInnerHTML={{ __html: c.title }} />
            </h2>
          </Reveal>
        </div>
        <Reveal delay={0.1} className="md:col-span-4">
          <p className="max-w-sm text-[15px] leading-relaxed text-fg/60 md:ml-auto">{c.hint}</p>
        </Reveal>
      </div>

      {question === 0 ? (
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {SEGMENT_ORDER.map((id: string, i: number) => {
            const segmentId = id as import("../data/catalog").SegmentId;
            const s = SEGMENTS[segmentId];
            const active = isActive(id);
            const vars = { "--acc": s.theme.acc, "--acc2": s.theme.acc2 } as CSSProperties;
            return (
              <motion.button
                key={id}
                type="button"
                style={vars}
                onClick={() => pick(id)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.7, ease: EASE }}
                className="group relative aspect-[4/5] overflow-hidden text-left outline-none focus-visible:ring-2 focus-visible:ring-[var(--acc)] md:aspect-[3/4.2]"
              >
                <img
                  src={s.image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/5" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-[#fbf6ef]">
                  <span className="gs-offset font-sans text-5xl font-extrabold tracking-[-0.04em]">0{i + 1}</span>
                  <p className="mt-5 font-display text-[2.1rem] leading-none">{s.name}</p>
                  <p className="mt-2.5 font-mono text-[13px] uppercase tracking-[0.12em] text-white/70">{s.short}</p>
                </div>
                <span
                  className="absolute inset-x-0 bottom-0 h-1.5 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                  style={{ background: "var(--acc)" }}
                />
                <motion.span
                  initial={false}
                  animate={{ scale: active ? 1 : 0 }}
                  className="absolute right-5 top-5 grid h-10 w-10 place-items-center text-[#0a0a0a]"
                  style={{ background: "var(--acc)" }}
                >
                  <Check className="h-5 w-5" strokeWidth={2.5} />
                </motion.span>
              </motion.button>
            );
          })}
        </div>
      ) : question === 3 ? (
        <div className="mt-10">
          <p className="text-center text-fg/60 mb-8">Esta etapa é renderizada pelo componente EssentialsScreen</p>
        </div>
      ) : (
        <ul className="mt-2">
          {rows.map((o, i) => {
            const active = isActive(o.id);
            return (
              <motion.li
                key={o.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + i * 0.06, duration: 0.6, ease: EASE }}
                className="border-b border-fg/15"
              >
                <button
                  type="button"
                  onClick={() => pick(o.id)}
                  className="group relative grid w-full grid-cols-[auto_1fr_auto] items-center gap-5 overflow-hidden py-6 text-left outline-none focus-visible:bg-fg/5 sm:gap-10 sm:py-8"
                >
                  <motion.span
                    aria-hidden
                    initial={false}
                    animate={{ scaleX: active ? 1 : 0 }}
                    transition={{ duration: 0.45, ease: EASE }}
                    className="absolute inset-0 origin-left bg-acc/10"
                  />
                  <span className="gs-offset relative w-12 font-sans text-3xl font-extrabold tracking-[-0.04em] sm:w-20 sm:text-5xl">
                    0{i + 1}
                  </span>
                  <span className="relative min-w-0">
                    <span className="block font-display text-[clamp(1.5rem,3.2vw,2.6rem)] leading-[1.05] transition-transform duration-500 group-hover:translate-x-2">
                      {o.label}
                    </span>
                    <span className="mt-1.5 block text-[15px] text-fg/55">{o.sub}</span>
                  </span>
                  <span className="relative flex items-center gap-5">
                    <span className="hidden font-mono text-[13px] uppercase tracking-[0.12em] text-fg/50 md:block">
                      {o.meta}
                    </span>
                    <span
                      className={`grid h-12 w-12 place-items-center border transition-colors duration-300 ${
                        active
                          ? "border-acc bg-acc text-onacc"
                          : "border-fg/25 group-hover:border-acc group-hover:bg-acc group-hover:text-onacc"
                      }`}
                    >
                      {active ? <Check className="h-5 w-5" strokeWidth={2.5} /> : <MoveRight className="h-5 w-5" />}
                    </span>
                  </span>
                </button>
              </motion.li>
            );
          })}
        </ul>
      )}

      <div className="mt-12">
        <TextLink onClick={onBack} back>
          Voltar
        </TextLink>
      </div>
    </section>
  );
}