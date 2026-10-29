import { useMemo } from "react";
import { motion } from "framer-motion";
import { Btn, EASE, Label, Reveal, TextLink } from "./ui";
import { CitrusWheel } from "./brand";
import type { Segment } from "../data/catalog";

interface Props {
  segment: Segment;
  onNext: () => void;
  onBack: () => void;
}

export default function SegmentScreen(props: Props) {
  if (props.segment.id === "casamento") return <Wedding {...props} />;
  if (props.segment.id === "corporativo") return <Corporate {...props} />;
  return <Birthday {...props} />;
}

/* ------------------------------ comuns ----------------------------- */

function Actions({ onNext, onBack, center = false }: { onNext: () => void; onBack: () => void; center?: boolean }) {
  return (
    <div className={`mt-10 flex flex-wrap items-center gap-x-8 gap-y-5 ${center ? "justify-center" : ""}`}>
      <Btn onClick={onNext}>Ver os pacotes</Btn>
      <TextLink onClick={onBack}>Mudar o tipo de evento</TextLink>
    </div>
  );
}

function Includes({ segment, center = false }: { segment: Segment; center?: boolean }) {
  return (
    <div className="grid border-l border-t border-fg/15 sm:grid-cols-2 lg:grid-cols-4">
      {segment.includes.map((inc, i) => (
        <motion.div
          key={inc.title}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 + i * 0.08, duration: 0.6, ease: EASE }}
          className={`border-b border-r border-fg/15 p-7 ${center ? "text-center" : ""}`}
        >
          <span className="gs-offset font-sans text-4xl font-extrabold tracking-[-0.04em]">0{i + 1}</span>
          <p className="mt-5 font-display text-[1.6rem] leading-tight">{inc.title}</p>
          <p className="mt-2 text-[15px] leading-relaxed text-fg/60">{inc.text}</p>
        </motion.div>
      ))}
    </div>
  );
}

function Gallery({ images, caption }: { images: string[]; caption: string }) {
  return (
    <div className="mt-14">
      <p className="font-mono text-[13px] uppercase tracking-[0.14em] text-fg/50">{caption}</p>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {images.map((src, i) => (
          <motion.img
            key={src}
            src={src}
            alt=""
            loading="lazy"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.08, duration: 0.7, ease: EASE }}
            className="aspect-[4/5] w-full object-cover"
          />
        ))}
      </div>
    </div>
  );
}

/* ----------------------- ANIVERSÁRIO (vibrante) --------------------- */

function CitrusConfetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        left: (i * 53 + 7) % 100,
        delay: (i % 9) * 0.6,
        dur: 8 + (i % 5) * 1.4,
        size: 12 + (i % 4) * 6,
        kind: i % 3,
      })),
    []
  );
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden opacity-70">
      {pieces.map((p, i) => (
        <motion.div
          key={i}
          className="absolute top-0"
          style={{ left: `${p.left}%` }}
          initial={{ y: "-12vh", rotate: 0 }}
          animate={{ y: "115vh", rotate: 360 }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "linear" }}
        >
          {p.kind === 0 ? (
            <CitrusWheel size={p.size + 10} />
          ) : (
            <span
              className="block rounded-full"
              style={{ width: p.size * 0.55, height: p.size * 0.55, background: p.kind === 1 ? "var(--acc2)" : "var(--acc3)" }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}

function Birthday({ segment, onNext, onBack }: Props) {
  return (
    <div className="relative overflow-hidden">
      <CitrusConfetti />
      <section className="relative mx-auto max-w-7xl px-5 pb-16 pt-28 sm:px-8 lg:pt-36">
        <div className="grid items-center gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <Label index="04">{segment.tag}</Label>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="mt-7 font-display text-[clamp(2.8rem,7vw,6.2rem)] font-medium leading-[0.93] tracking-[-0.025em]">
                {segment.title}
                <br />
                <span className="gs-offset mb-5 mt-2 block font-sans text-[1.12em] font-extrabold uppercase leading-[0.95] tracking-[-0.045em]">
                  {segment.highlight}
                </span>
                <span className="font-normal italic">{segment.after}</span>
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-8 max-w-xl text-[17px] font-light leading-relaxed text-fg/70">{segment.copy}</p>
            </Reveal>
            <Reveal delay={0.18}>
              <Actions onNext={onNext} onBack={onBack} />
            </Reveal>
          </div>
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, rotate: -5, y: 40 }}
              animate={{ opacity: 1, rotate: 2.5, y: 0 }}
              transition={{ duration: 1, delay: 0.15, ease: EASE }}
              className="relative mx-auto max-w-[400px]"
            >
              <div className="bg-[#fbf3ea] p-3 pb-16 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.85)]">
                <img src={segment.image} alt="Drink Paradise em camadas" className="aspect-[4/5] w-full object-cover" />
                <p className="absolute inset-x-0 bottom-5 text-center font-mono text-[15px] text-[#1b1410]">
                  Paradise · o queridinho das festas
                </p>
              </div>
              <span className="absolute -left-8 top-8 -rotate-[8deg] bg-acc px-4 py-2.5 font-sans text-[12px] font-bold uppercase tracking-[0.16em] text-onacc shadow-[-4px_4px_0_0_var(--acc2)]">
                Bar instagramável
              </span>
              <span className="absolute -right-6 bottom-28 rotate-[7deg] bg-acc2 px-4 py-2.5 font-sans text-[12px] font-bold uppercase tracking-[0.16em] text-[#0b0908]">
                Shot do parabéns
              </span>
            </motion.div>
          </div>
        </div>
      </section>
      <section className="relative mx-auto max-w-7xl px-5 pb-24 sm:px-8">
        <Includes segment={segment} />
        <Gallery images={segment.gallery} caption="Da galeria GS — drinks que fazem sucesso nas festas" />
      </section>
    </div>
  );
}

/* ------------------------- CASAMENTO (convite) ---------------------- */

function Wedding({ segment, onNext, onBack }: Props) {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-5 pb-12 pt-28 sm:px-8 lg:pt-36">
        <Reveal>
          <div className="border border-fg/25 p-2">
            <div className="border border-fg/25 px-6 py-14 text-center sm:px-14 sm:py-20">
              <p className="font-mono text-[13px] uppercase tracking-[0.3em] text-fg/60">{segment.tag}</p>
              <div className="mx-auto mt-8 flex items-center justify-center gap-4 text-acc">
                <span className="h-px w-12 bg-current opacity-50 sm:w-20" />
                <span className="font-display text-2xl italic">G</span>
                <CitrusWheel size={22} />
                <span className="font-display text-2xl italic">S</span>
                <span className="h-px w-12 bg-current opacity-50 sm:w-20" />
              </div>
              <h2 className="mt-8 font-display text-[clamp(2.8rem,7.5vw,6.4rem)] font-normal italic leading-[0.95] tracking-[-0.02em]">
                {segment.title}
                <br />
                <span className="font-medium not-italic">{segment.highlight}</span>
              </h2>
              <p className="mx-auto mt-8 max-w-xl text-[17px] font-light leading-relaxed text-fg/70">{segment.copy}</p>
              <Actions onNext={onNext} onBack={onBack} center />
            </div>
          </div>
        </Reveal>
      </section>
      <section className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
        <div className="grid items-end gap-4 sm:grid-cols-[1fr_1.3fr_1fr]">
          {[segment.gallery[0], segment.image, segment.gallery[1]].map((src, i) => (
            <motion.img
              key={src}
              src={src}
              alt=""
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.8, ease: EASE }}
              className={`w-full object-cover ${i === 1 ? "aspect-[3/4]" : "hidden aspect-[3/4] sm:block"}`}
            />
          ))}
        </div>
        <p className="mt-4 text-center font-mono text-[13px] text-fg/50">Taças e coquetéis da galeria GS Top Drinks</p>
        <div className="mt-14">
          <Includes segment={segment} center />
        </div>
      </section>
    </div>
  );
}

/* ------------------------ CORPORATIVO (executivo) ------------------- */

function Corporate({ segment, onNext, onBack }: Props) {
  return (
    <section className="mx-auto max-w-7xl px-5 pb-24 pt-28 sm:px-8 lg:pt-36">
      <div className="grid gap-10 border-b border-fg/15 pb-12 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <Reveal>
            <Label index="04">{segment.tag}</Label>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-7 font-display text-[clamp(2.6rem,6.4vw,5.6rem)] font-medium leading-[0.95] tracking-[-0.025em]">
              {segment.title}
              <br />
              <span className="gs-offset mt-3 block font-sans text-[1.02em] font-extrabold uppercase leading-[1] tracking-[-0.045em]">
                {segment.highlight}
              </span>
            </h2>
          </Reveal>
        </div>
        <Reveal delay={0.12} className="lg:col-span-4">
          <p className="text-[16px] font-light leading-relaxed text-fg/70">{segment.copy}</p>
          <Actions onNext={onNext} onBack={onBack} />
        </Reveal>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-12">
        <motion.figure
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
          className="relative lg:col-span-7"
        >
          <img src={segment.image} alt="Bartender servindo em evento corporativo" className="aspect-[16/11] w-full object-cover" />
          <figcaption className="absolute bottom-0 left-0 bg-bg px-4 py-3 font-mono text-[13px] uppercase tracking-[0.12em] text-fg/70">
            Happy hour · encerramentos · convenções
          </figcaption>
        </motion.figure>
        <div className="flex flex-col gap-6 lg:col-span-5">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
            className="flex items-center gap-5 border border-fg/15 bg-bg2 p-5"
          >
            <img src="gs/gilmar-1.jpg" alt="Gilmar Steffen" className="h-28 w-24 shrink-0 object-cover object-top" />
            <div>
              <p className="font-display text-[1.35rem] italic leading-snug">“Profissionalismo e excelência para a sua marca.”</p>
              <p className="mt-3 font-mono text-[12px] uppercase tracking-[0.14em] text-fg/55">Gilmar Steffen · GS Top Drinks</p>
            </div>
          </motion.div>
          <ul className="border-t border-fg/15">
            {segment.includes.map((inc, i) => (
              <motion.li
                key={inc.title}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.07, duration: 0.6, ease: EASE }}
                className="grid grid-cols-[auto_1fr] gap-5 border-b border-fg/15 py-4"
              >
                <span className="font-mono text-[14px] text-acc">0{i + 1}</span>
                <div>
                  <p className="text-[15px] font-semibold uppercase tracking-[0.08em]">{inc.title}</p>
                  <p className="mt-1 text-[14px] leading-relaxed text-fg/60">{inc.text}</p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
      <Gallery images={segment.gallery} caption="Carta executiva — fotos da galeria GS" />
    </section>
  );
}
