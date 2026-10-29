import { useMemo, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Check, MoveRight, Plus } from "lucide-react";
import { AnimatedMoney, Btn, EASE, Label, Leader, Reveal, TextLink } from "./ui";
import { CitrusWheel, DrinkGlass, HurricaneGlass } from "./brand";
import {
  MAX_DRINKS,
  MIN_DRINKS,
  PACKAGES,
  SEGMENTS,
  TIER_LABEL,
  buildCuradoria,
  drinkSum,
  fmt,
  tierOf,
  totalPerPerson,
  type Drink,
  type PackageId,
  type Pkg,
  type SegmentId,
  type Suggestion,
} from "../data/catalog";

interface Props {
  segment: SegmentId;
  packageId: PackageId;
  selected: string[];
  onChange: (ids: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

type Filter = "todos" | "alcool" | "zero";
const FILTERS: [Filter, string][] = [
  ["todos", "Todos"],
  ["alcool", "Com álcool"],
  ["zero", "Sem álcool"],
];

const WARN = "text-[#e2412f]";

export default function DrinksScreen({ segment, packageId, selected, onChange, onNext, onBack }: Props) {
  const pkg = PACKAGES[packageId];
  const [filter, setFilter] = useState<Filter>("todos");
  const [auto, setAuto] = useState(true);
  const [autoNote, setAutoNote] = useState<{ suggestions: Suggestion[]; before: string[] } | null>(null);
  const [dismissed, setDismissed] = useState<string | null>(null);

  const total = totalPerPerson(pkg, selected);
  const over = total > pkg.ceiling + 0.001;
  const ready = selected.length >= MIN_DRINKS;
  const cur = useMemo(() => buildCuradoria(pkg, selected), [pkg, selected]);
  const sig = [...selected].sort().join("|");
  const showSuggestion = !autoNote && (cur.over || cur.mixed) && cur.suggestions.length > 0 && dismissed !== sig;
  const visible = pkg.drinks.filter((x) => filter === "todos" || (filter === "zero" ? x.zero : !x.zero));

  const toggle = (drink: Drink) => {
    const isOn = selected.includes(drink.id);
    if (!isOn && selected.length >= MAX_DRINKS) return;
    const next = isOn ? selected.filter((x) => x !== drink.id) : [...selected, drink.id];
    setAutoNote(null);
    if (auto && !isOn) {
      const c = buildCuradoria(pkg, next, drink.id);
      if (c.over && c.suggestions.length > 0) {
        onChange(c.resultIds);
        setAutoNote({ suggestions: c.suggestions, before: next });
        return;
      }
    }
    onChange(next);
  };

  const setAutoMode = (v: boolean) => {
    setAuto(v);
    if (v && cur.over && cur.suggestions.length > 0) {
      setAutoNote({ suggestions: cur.suggestions, before: selected });
      onChange(cur.resultIds);
    }
    if (!v) setAutoNote(null);
  };

  const undo = () => {
    if (!autoNote) return;
    onChange(autoNote.before);
    setAuto(false);
    setAutoNote(null);
  };

  return (
    <section className="mx-auto max-w-7xl px-5 pb-40 pt-28 sm:px-8 lg:pb-24 lg:pt-32">
      <div className="grid gap-6 border-b border-fg/15 pb-10 md:grid-cols-12 md:items-end">
        <div className="md:col-span-8">
          <Reveal>
            <Label index="06">
              Carta · Pacote {pkg.name} · {SEGMENTS[segment].name}
            </Label>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 font-display text-[clamp(2.4rem,5.6vw,4.9rem)] font-medium leading-[0.95] tracking-[-0.02em]">
              Monte a <span className="font-normal italic">sua carta.</span>
            </h2>
          </Reveal>
        </div>
        <Reveal delay={0.1} className="md:col-span-4">
          <p className="max-w-sm text-[15px] leading-relaxed text-fg/60 md:ml-auto">
            Escolha de {MIN_DRINKS} a {MAX_DRINKS} drinks. Cada escolha soma ao valor por pessoa — o cálculo é automático.
          </p>
        </Reveal>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <div className="mb-8 lg:hidden">
            <Summary pkg={pkg} selected={selected} total={total} over={over} auto={auto} onAuto={setAutoMode} compact />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {FILTERS.map(([f, l]) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`border px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.16em] transition-colors ${
                  filter === f ? "border-fg bg-fg text-bg" : "border-fg/20 text-fg/65 hover:border-fg/50 hover:text-fg"
                }`}
              >
                {l}
              </button>
            ))}
            <span className="ml-auto font-mono text-[13px] text-fg/50">{visible.length} drinks</span>
          </div>

          <AnimatePresence initial={false}>
            {autoNote && (
              <BarNote
                key="auto"
                title="Ajuste automático ao plano"
                intro={`Sua carta passou do teto do plano ${pkg.name}. Trocamos os extremos por drinks de meio-termo para caber no orçamento:`}
                suggestions={autoNote.suggestions}
                actions={
                  <>
                    <button
                      type="button"
                      onClick={undo}
                      className="border border-fg/30 px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.14em] hover:border-fg"
                    >
                      Desfazer ajuste
                    </button>
                    <button
                      type="button"
                      onClick={() => setAutoNote(null)}
                      className="text-[12px] font-semibold uppercase tracking-[0.14em] text-fg/60 underline underline-offset-4 hover:text-fg"
                    >
                      Ok, entendi
                    </button>
                  </>
                }
              />
            )}
            {showSuggestion && (
              <BarNote
                key={`sug-${sig}`}
                title={cur.over ? "Passou do teto do plano" : "Sugestão da casa"}
                intro={
                  cur.over
                    ? `Sua carta está acima do teto do plano ${pkg.name}. Estas trocas de meio-termo fazem caber no orçamento:`
                    : "Sua carta mistura extremos (premium com leves). Para uma experiência mais coesa, sugerimos aproximar do meio-termo:"
                }
                suggestions={cur.suggestions}
                actions={
                  <>
                    <button
                      type="button"
                      onClick={() => onChange(cur.resultIds)}
                      className="bg-acc px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-onacc shadow-[-3px_3px_0_0_var(--acc2)]"
                    >
                      Aplicar · {fmt.format(cur.total)}/pessoa
                    </button>
                    <button
                      type="button"
                      onClick={() => setDismissed(sig)}
                      className="text-[12px] font-semibold uppercase tracking-[0.14em] text-fg/60 underline underline-offset-4 hover:text-fg"
                    >
                      Manter minha carta
                    </button>
                  </>
                }
              />
            )}
          </AnimatePresence>

          <div className="mt-6 grid border-l border-t border-fg/12 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((x) => (
              <DrinkCard
                key={x.id}
                drink={x}
                pkg={pkg}
                active={selected.includes(x.id)}
                disabled={!selected.includes(x.id) && selected.length >= MAX_DRINKS}
                onToggle={() => toggle(x)}
              />
            ))}
          </div>

          <div className="mt-10">
            <TextLink onClick={onBack} back>
              Trocar de pacote
            </TextLink>
          </div>
        </div>

        <aside className="hidden lg:col-span-4 lg:block">
          <div className="sticky top-24">
            <Summary pkg={pkg} selected={selected} total={total} over={over} auto={auto} onAuto={setAutoMode} />
            <Btn onClick={onNext} disabled={!ready} full className="mt-6">
              {ready ? "Ver minha comanda" : `Escolha mais ${MIN_DRINKS - selected.length}`}
            </Btn>
          </div>
        </aside>
      </div>

      {createPortal(
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: EASE }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-fg/12 bg-bg/95 backdrop-blur-md lg:hidden print:hidden"
        >
          <div className="mx-auto flex max-w-7xl items-center gap-4 px-5 py-3">
            <HurricaneGlass level={total / pkg.ceiling} className="h-12 w-auto shrink-0 text-fg/60" />
            <div className="min-w-0 flex-1">
              <p className={`font-mono text-[12px] uppercase tracking-[0.12em] ${over ? WARN : "text-fg/55"}`}>
                {over ? "Acima do teto" : ready ? "Por pessoa" : `Faltam ${MIN_DRINKS - selected.length}`}
              </p>
              <AnimatedMoney value={total} className="block font-sans text-2xl font-extrabold tracking-[-0.03em] tabular-nums" />
            </div>
            <button
              type="button"
              disabled={!ready}
              onClick={onNext}
              className={`flex items-center gap-2 px-5 py-3.5 text-[12px] font-semibold uppercase tracking-[0.14em] ${
                ready ? "bg-acc text-onacc shadow-[-3px_3px_0_0_var(--acc2)]" : "bg-fg/10 text-fg/35"
              }`}
            >
              Comanda <MoveRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>,
        document.body
      )}
    </section>
  );
}

/* ------------------------------ Card ------------------------------- */

function DrinkCard({
  drink,
  pkg,
  active,
  disabled,
  onToggle,
}: {
  drink: Drink;
  pkg: Pkg;
  active: boolean;
  disabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={active}
      className={`group relative flex min-h-[250px] flex-col border-b border-r border-fg/12 p-5 text-left transition-colors duration-300 ${
        active ? "bg-acc/[0.07]" : "hover:bg-fg/[0.03]"
      } ${disabled ? "opacity-40" : ""}`}
    >
      <motion.span
        aria-hidden
        initial={false}
        animate={{ scaleX: active ? 1 : 0 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="absolute inset-x-0 top-0 h-[3px] origin-left bg-acc"
      />
      <div className="flex items-start justify-between gap-3">
        <DrinkGlass glass={drink.glass} color={drink.color} filled={active} className="h-[68px] w-[51px] text-fg/55" />
        <div className="text-right">
          <p className="font-sans text-[19px] font-semibold tabular-nums">+{fmt.format(drink.cost)}</p>
          <p className="mt-0.5 font-mono text-[12px] uppercase tracking-[0.12em] text-fg/50">
            {TIER_LABEL[tierOf(pkg, drink.cost)]}
          </p>
        </div>
      </div>
      <p className="mt-5 font-display text-[1.45rem] leading-[1.1]">{drink.name}</p>
      {drink.signature && (
        <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-acc">Assinatura GS</p>
      )}
      <p className="mt-2 text-[14px] leading-snug text-fg/60">{drink.desc}</p>
      <div className="mt-auto flex items-center justify-between gap-3 pt-5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[12px] text-fg/50">
          {drink.zero && <span className="border border-fg/25 px-2 py-0.5 text-fg/75">0% álcool</span>}
          {drink.tags.slice(0, 2).map((t) => (
            <span key={t}>#{t}</span>
          ))}
        </div>
        <span
          className={`grid h-8 w-8 shrink-0 place-items-center border transition-colors ${
            active ? "border-acc bg-acc text-onacc" : "border-fg/25 text-fg/50 group-hover:border-fg/60 group-hover:text-fg"
          }`}
        >
          {active ? <Check className="h-4 w-4" strokeWidth={2.5} /> : <Plus className="h-4 w-4" />}
        </span>
      </div>
    </button>
  );
}

/* ----------------------------- Resumo ------------------------------ */

function Summary({
  pkg,
  selected,
  total,
  over,
  auto,
  onAuto,
  compact = false,
}: {
  pkg: Pkg;
  selected: string[];
  total: number;
  over: boolean;
  auto: boolean;
  onAuto: (v: boolean) => void;
  compact?: boolean;
}) {
  return (
    <div className="border border-fg/15 bg-bg2 p-6">
      <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-fg/55">Seu copo · plano {pkg.name}</p>
      <div className="mt-4 flex items-end gap-5">
        <HurricaneGlass
          level={total / pkg.ceiling}
          garnish
          className={`${compact ? "h-28" : "h-44"} w-auto shrink-0 text-fg/60`}
        />
        <div className="min-w-0 pb-1">
          <p className="text-[12px] uppercase tracking-[0.16em] text-fg/50">Por pessoa</p>
          <AnimatedMoney
            value={total}
            className={`gs-offset mt-1 block font-sans font-extrabold leading-none tracking-[-0.035em] tabular-nums ${
              compact ? "text-4xl" : "text-[2.9rem]"
            }`}
          />
          <p className={`mt-3 text-[13px] font-medium ${over ? WARN : "text-fg/55"}`}>
            {over ? "O copo transbordou: acima do teto" : `${selected.length} de ${MAX_DRINKS} drinks · dentro do plano`}
          </p>
        </div>
      </div>
      {!compact && (
        <div className="mt-6 space-y-2.5 border-t border-fg/12 pt-5 text-[14px] text-fg/75">
          <Leader left="Estrutura & equipe" right={fmt.format(pkg.base)} />
          <Leader left={`Drinks escolhidos (${selected.length})`} right={fmt.format(drinkSum(pkg, selected))} />
          <Leader left="Teto do plano" right={fmt.format(pkg.ceiling)} />
        </div>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={auto}
        onClick={() => onAuto(!auto)}
        className="mt-5 flex w-full items-start gap-4 border-t border-fg/12 pt-5 text-left"
      >
        <span className={`relative mt-0.5 h-6 w-11 shrink-0 border transition-colors ${auto ? "border-acc bg-acc" : "border-fg/30"}`}>
          <motion.span
            initial={false}
            animate={{ left: auto ? 22 : 3 }}
            transition={{ type: "spring", stiffness: 500, damping: 32 }}
            className={`absolute top-[3px] h-4 w-4 ${auto ? "bg-onacc" : "bg-fg/50"}`}
          />
        </span>
        <span>
          <span className="block text-[14px] font-medium">Ajuste automático ao plano</span>
          <span className="mt-0.5 block text-[13px] leading-snug text-fg/55">
            Se a carta passar do teto, trocamos os extremos por drinks de meio-termo.
          </span>
        </span>
      </button>
    </div>
  );
}

/* --------------------------- Nota do bar --------------------------- */

function BarNote({
  title,
  intro,
  suggestions,
  actions,
}: {
  title: string;
  intro: string;
  suggestions: Suggestion[];
  actions: ReactNode;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="mt-6 border border-acc/40 bg-acc/[0.06] p-5 sm:p-6"
    >
      <div className="flex items-start gap-4">
        <CitrusWheel size={34} className="shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-acc">{title}</p>
          <p className="mt-1.5 font-mono text-[15px] italic leading-relaxed text-fg/75">{intro}</p>
          <ul className="mt-4 space-y-3">
            {suggestions.map((s) => (
              <li key={s.out.id} className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[15px]">
                {s.kind === "swap" ? (
                  <>
                    <span className="text-fg/50 line-through">{s.out.name}</span>
                    <MoveRight className="h-4 w-4 text-acc" />
                    <span className="font-medium">{s.into.name}</span>
                  </>
                ) : (
                  <>
                    <span className="font-medium">Retirar</span>
                    <span className="text-fg/50 line-through">{s.out.name}</span>
                  </>
                )}
                <span className="basis-full font-mono text-[13px] text-fg/50">{s.reason}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap items-center gap-5">{actions}</div>
        </div>
      </div>
    </motion.div>
  );
}
