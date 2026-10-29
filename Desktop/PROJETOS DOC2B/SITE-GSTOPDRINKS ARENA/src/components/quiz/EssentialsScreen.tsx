import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { EASE, Label, Reveal, TextLink } from "../ui";

interface Props {
  selected: string[];
  onChange: (essentials: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const ESSENTIALS = [
  { id: "welcome", label: "Welcome drink na chegada", desc: "Servido à francesa para receber os convidados", icon: "🍾" },
  { id: "shot", label: "Brinde especial (shot)", desc: "Momento sincronizado para todos brindarem juntos", icon: "🥃" },
  { id: "show", label: "Show dos Tequileiros", desc: "Performance com fogo e garrafas — a atração da noite", icon: "🔥" },
  { id: "mocktail", label: "Mocktails premium", desc: "Opções sem álcool no mesmo nível dos drinks", icon: "🍹" },
  { id: "personalizado", label: "Drink personalizado", desc: "Coquetel autoral com nome do evento/do casal", icon: "✨" },
  { id: "carta", label: "Carta impressa personalizada", desc: "Menu alinhado à identidade visual do evento", icon: "📋" },
];

export default function EssentialsScreen({ selected, onChange, onNext, onBack }: Props) {
  const [touched, setTouched] = useState(false);

  const toggle = (id: string) => {
    setTouched(true);
    onChange(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);
  };

  const hasSelection = selected.length > 0;

  return (
    <section className="mx-auto max-w-7xl px-5 pb-20 pt-28 sm:px-8 lg:pt-32">
      <div className="grid gap-6 border-b border-fg/15 pb-10 md:grid-cols-12 md:items-end">
        <div className="md:col-span-8">
          <Reveal>
            <Label index="04">O essencial</Label>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 font-display text-[clamp(2.4rem,5.6vw,4.9rem)] font-medium leading-[0.95] tracking-[-0.02em]">
              O que <span className="font-normal italic">não pode faltar?</span>
            </h2>
          </Reveal>
        </div>
        <Reveal delay={0.1} className="md:col-span-4">
          <p className="max-w-sm text-[15px] leading-relaxed text-fg/60 md:ml-auto">
            Marque os itens indispensáveis. Isso ajuda a GS a montar a carta ideal para o seu perfil.
          </p>
        </Reveal>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ESSENTIALS.map((item, i) => {
          const active = selected.includes(item.id);
          return (
            <motion.button
              key={item.id}
              type="button"
              onClick={() => toggle(item.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + i * 0.06, duration: 0.6, ease: EASE }}
              className={`group relative p-6 border-2 rounded-xl transition-all duration-300 ${
                active
                  ? "border-acc bg-acc/10"
                  : "border-fg/15 hover:border-fg/30 hover:bg-fg/5"
              }`}
            >
              <motion.span
                initial={false}
                animate={{ scale: active ? 1 : 0.8, opacity: active ? 1 : 0.5 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center border-2 rounded-lg"
                style={{
                  borderColor: active ? "var(--acc)" : "currentColor",
                  background: active ? "var(--acc)" : "transparent",
                  color: active ? "var(--on-acc)" : "currentColor",
                }}
              >
                <Check className="h-5 w-5" strokeWidth={3} />
              </motion.span>

              <div className="relative z-10">
                <span className="text-4xl mb-3 block">{item.icon}</span>
                <p className="font-display text-[1.35rem] leading-tight">{item.label}</p>
                <p className="mt-2 text-[14px] text-fg/60">{item.desc}</p>
              </div>

              <motion.div
                initial={false}
                animate={{ height: active ? "3px" : 0 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="absolute bottom-0 left-0 right-0 bg-acc origin-bottom"
              />
            </motion.button>
          );
        })}
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
        <button
          type="button"
          onClick={onNext}
          disabled={!hasSelection}
          className={`group relative inline-flex items-center gap-3 px-7 py-[17px] text-[12.5px] font-semibold uppercase tracking-[0.18em] transition-[transform,box-shadow,background-color,border-color,color] duration-200 outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-acc ${
            hasSelection
              ? "bg-acc text-onacc shadow-[-5px_5px_0_0_var(--acc2)] hover:-translate-x-[2px] hover:translate-y-[2px] hover:shadow-[-3px_3px_0_0_var(--acc2)]"
              : "cursor-not-allowed bg-fg/10 text-fg/35"
          }`}
        >
          <span>Continuar</span>
        </button>
        <TextLink onClick={onBack} back>
          Voltar
        </TextLink>
      </div>

      {touched && !hasSelection && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 text-center text-[14px] text-[#e2412f]"
        >
          Selecione pelo menos um item essencial para continuar
        </motion.p>
      )}
    </section>
  );
}