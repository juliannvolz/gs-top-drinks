import { motion } from "framer-motion";
import { Btn, EASE, Label, Reveal, TextLink } from "./ui";
import { CitrusWheel, Stamp } from "./brand";
import { PACKAGE_ORDER, PACKAGES, SEGMENTS, fmt, type PackageId, type SegmentId } from "../data/catalog";

interface Props {
  segment: SegmentId;
  recommended?: PackageId;
  onSelect: (p: PackageId) => void;
  onBack: () => void;
}

export default function PackageScreen({ segment, recommended, onSelect, onBack }: Props) {
  return (
    <section className="mx-auto max-w-7xl px-5 pb-24 pt-28 sm:px-8 lg:pt-32">
      <div className="grid gap-6 border-b border-fg/15 pb-10 md:grid-cols-12 md:items-end">
        <div className="md:col-span-8">
          <Reveal>
            <Label index="05">Pacotes · {SEGMENTS[segment].name}</Label>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 font-display text-[clamp(2.4rem,5.6vw,4.9rem)] font-medium leading-[0.95] tracking-[-0.02em]">
              Escolha o <span className="font-normal italic">seu pacote.</span>
            </h2>
          </Reveal>
        </div>
        <Reveal delay={0.1} className="md:col-span-4">
          <p className="max-w-sm text-[15px] leading-relaxed text-fg/60 md:ml-auto">
            Cada pacote define a estrutura (valor base por pessoa), o teto sugerido do plano e a carta de drinks disponível.
          </p>
        </Reveal>
      </div>

      <div className="mt-16 grid gap-10 lg:grid-cols-3 lg:gap-6">
        {PACKAGE_ORDER.map((id, i) => {
          const p = PACKAGES[id];
          const rec = recommended === id;
          const hero = !!p.bestSeller;
          return (
            <motion.article
              key={id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.7, ease: EASE }}
              className={`group relative flex flex-col border bg-bg2 ${hero ? "border-acc lg:-mt-6" : "border-fg/15"}`}
            >
              {hero && <div className="h-1.5 bg-gradient-to-r from-acc2 via-acc to-acc3" />}
              <div className="relative overflow-hidden">
                <img
                  src={p.image}
                  alt=""
                  className={`w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04] ${
                    hero ? "aspect-[16/11]" : "aspect-[16/10]"
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg2 via-transparent to-transparent" />
                {rec && (
                  <span className="absolute left-4 top-4 bg-bg px-3 py-1.5 font-mono text-[12px] uppercase tracking-[0.12em] text-acc">
                    Indicado pelo seu perfil
                  </span>
                )}
              </div>
              {hero && (
                <div className="absolute -right-3 -top-12 z-10">
                  <Stamp text="mais vendido • dos sonhos • " size={104} className="rotate-12 text-acc">
                    <CitrusWheel size={34} />
                  </Stamp>
                </div>
              )}
              <div className="flex flex-1 flex-col p-7">
                <p className="font-mono text-[13px] uppercase tracking-[0.14em] text-fg/55">{p.tagline}</p>
                <h3 className="mt-2 font-display text-[2.6rem] leading-none">{p.name}</h3>
                <p className="mt-7 text-[12px] uppercase tracking-[0.16em] text-fg/50">a partir de</p>
                <p className="mt-1 flex items-baseline gap-2">
                  <span className={`font-sans text-5xl font-extrabold tracking-[-0.04em] tabular-nums ${hero ? "gs-offset" : ""}`}>
                    {fmt.format(p.base)}
                  </span>
                  <span className="text-[14px] text-fg/50">/pessoa</span>
                </p>
                <p className="mt-3 text-[13px] text-fg/55">
                  Teto sugerido do plano: <span className="text-fg/85">{fmt.format(p.ceiling)}</span> por pessoa
                </p>
                <ul className="mt-7 flex-1 space-y-3 border-t border-fg/12 pt-6">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-[15px] leading-snug text-fg/75">
                      <CitrusWheel size={15} className="mt-[3px] shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Btn variant={hero ? "solid" : "line"} onClick={() => onSelect(id)} full className="mt-8">
                  Ver carta · {p.drinks.length} drinks
                </Btn>
              </div>
            </motion.article>
          );
        })}
      </div>

      <p className="mt-16 text-center font-display text-[clamp(1.4rem,2.4vw,2rem)] italic text-fg/70">
        “Mais que drinks, entregamos sonhos.”
      </p>
      <div className="mt-10">
        <TextLink onClick={onBack} back>
          Voltar
        </TextLink>
      </div>
    </section>
  );
}
