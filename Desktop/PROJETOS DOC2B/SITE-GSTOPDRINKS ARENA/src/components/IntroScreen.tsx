/* ================================================================== */
/*  GS TOP DRINKS — IntroScreen com GSAP Timeline                       */
/*  Hero reveal orquestrado: logo → headline → stats → CTA             */
/* ================================================================== */

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Btn, Footer, Label, Marquee, TextLink } from "./ui";
import { CitrusWheel, Stamp } from "./brand";
import { waLink } from "../data/catalog";
import { useReducedMotion, useGSAP } from "../hooks/useGSAP";

gsap.registerPlugin(ScrollTrigger);

const STATS: [string, string][] = [
  ["10+", "anos de mercado"],
  ["500+", "eventos realizados"],
  ["100%", "premium spirits"],
];

const HOW: [string, string][] = [
  ["Conte sobre o evento", "Três perguntas rápidas: o momento, o número de convidados e o estilo de bar."],
  ["Escolha o pacote", "Clássico, Intermediário ou Dos Sonhos — cada um com estrutura e carta próprias."],
  ["Monte a sua carta", "Selecione os drinks e veja o valor por pessoa ser calculado na hora."],
];

function safeSelect(ctx: gsap.Context, selector: string): Element[] {
  if (!ctx.selector) return [];
  const selectorFn = ctx.selector(selector);
  if (!selectorFn) return [];
  try {
    return selectorFn() ?? [];
  } catch {
    return [];
  }
}

export default function IntroScreen({ onStart }: { onStart: () => void }) {
  const containerRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  // GSAP Timeline para hero reveal
  useGSAP((ctx) => {
    if (reduced) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.from(safeSelect(ctx, ".gs-logo"), { opacity: 0, y: 30, duration: 0.8 })
      .from(safeSelect(ctx, ".gs-label"), { opacity: 0, y: 20, duration: 0.6 }, "-=0.4")
      .from(safeSelect(ctx, ".gs-headline"), { opacity: 0, y: 30, duration: 0.8 }, "-=0.3")
      .from(safeSelect(ctx, ".gs-subheadline"), { opacity: 0, y: 20, duration: 0.6 }, "-=0.5")
      .from(safeSelect(ctx, ".gs-copy"), { opacity: 0, y: 20, duration: 0.6 }, "-=0.4")
      .from(safeSelect(ctx, ".gs-cta"), { opacity: 0, y: 20, duration: 0.6, stagger: 0.12 }, "-=0.3")
      .from(safeSelect(ctx, ".gs-stat"), { opacity: 0, y: 20, duration: 0.6, stagger: 0.08 }, "-=0.2")
      .from(safeSelect(ctx, ".gs-hero-img"), { opacity: 0, y: 40, duration: 1, ease: "power4.out" }, "-=0.6")
      .from(safeSelect(ctx, ".gs-stamp"), { opacity: 0, rotation: -15, scale: 0.8, duration: 0.8, ease: "elastic.out(1, 0.5)" }, "-=0.4");

    // ScrollTrigger para seção "Como funciona"
    safeSelect(ctx, ".gs-how").forEach((section: Element) => {
      gsap.from(section.querySelectorAll(".gs-how-item"), {
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        opacity: 0,
        y: 30,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
      });
    });

    // Parallax suave na foto do Gilmar
    gsap.to(safeSelect(ctx, ".gs-gilmar-img"), {
      scrollTrigger: {
        trigger: ".gs-gilmar-section",
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
      y: -50,
      ease: "none",
    });
  }, [reduced]);

  return (
    <>
      <section ref={containerRef} className="mx-auto max-w-7xl px-5 pb-24 pt-28 sm:px-8 lg:pt-36">
        <div className="grid items-center gap-16 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <div className="gs-label">
              <Label index="GS">Open bar premium · Blumenau — SC</Label>
            </div>
            <div className="gs-headline mt-8">
              <h1 className="font-display text-[clamp(2.8rem,6vw,5.4rem)] font-medium leading-[0.96] tracking-[-0.025em]">
                Mais que drinks,
                <br />
                <span className="font-normal italic">entregamos</span>
                <span className="gs-offset mt-3 block font-sans text-[1.1em] font-extrabold uppercase leading-[0.86] tracking-[-0.045em]">
                  sonhos.
                </span>
              </h1>
            </div>
            <div className="gs-subheadline mt-9">
              <p className="max-w-[34rem] text-[17px] font-light leading-relaxed text-fg/70">
                Responda três perguntas e receba, na hora, a carta ideal para o seu evento — com pacote recomendado e
                investimento estimado por pessoa.
              </p>
            </div>
            <div className="gs-cta mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
              <Btn onClick={onStart}>Montar meu evento</Btn>
              <TextLink href={waLink("Olá, GS Top Drinks! Gostaria de um orçamento de open bar.")}>
                Prefiro falar no WhatsApp
              </TextLink>
            </div>
            <div className="gs-stat mt-14">
              <dl className="grid max-w-xl grid-cols-3 border-t border-fg/15">
                {STATS.map(([n, l], i) => (
                  <div key={l} className={`pt-5 ${i > 0 ? "border-l border-fg/15 pl-5" : ""}`}>
                    <dt className="font-display text-[clamp(1.9rem,3.4vw,2.6rem)] leading-none">{n}</dt>
                    <dd className="mt-2 text-[12px] uppercase tracking-[0.16em] text-fg/50">{l}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="lg:col-span-5">
            <figure className="relative mx-auto w-full max-w-[440px] lg:ml-auto gs-hero-img">
              <div className="relative">
                <div className="absolute inset-0 bg-acc2 gs-accent-layer-1" />
                <div className="absolute inset-0 bg-acc gs-accent-layer-2" />
                <img
                  src="/gs/images/segments/hero-main.jpg"
                  alt="GS Sunrise servido com névoa de gelo seco"
                  className="relative aspect-[4/5] w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-12 -left-10 hidden sm:block gs-stamp">
                <Stamp text="open bar premium • 500+ eventos • " size={128} className="-rotate-12 text-fg">
                  <CitrusWheel size={46} className="animate-spin-slow" />
                </Stamp>
              </div>
              <figcaption className="mt-9 font-mono text-[13px] leading-relaxed text-fg/55 sm:mt-10 sm:pl-24">
                Na foto, o <span className="text-fg">GS Sunrise</span> — o drink do nosso logo, servido com névoa de gelo
                seco.
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <Marquee items={["Casamentos", "15 Anos", "Formaturas", "Corporativos", "Aniversários", "Festas em geral"]} />

      <section className="gs-how mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-display text-[clamp(2rem,4vw,3.4rem)] font-medium leading-[1] tracking-[-0.02em]">
            Como funciona <span className="font-normal italic">o simulador</span>
          </h2>
          <Btn variant="line" onClick={onStart}>
            Começar agora
          </Btn>
        </div>
        <ol className="mt-12 grid border-y border-fg/15 md:grid-cols-3">
          {HOW.map(([t, txt], i) => (
            <li
              key={t}
              className={`gs-how-item py-9 md:px-8 ${i === 0 ? "md:pl-0" : "border-t border-fg/15 md:border-l md:border-t-0"}`}
            >
              <span className="gs-offset font-sans text-5xl font-extrabold tracking-[-0.04em]">0{i + 1}</span>
              <p className="mt-6 font-display text-[1.7rem] leading-tight">{t}</p>
              <p className="mt-2 max-w-xs text-[15px] leading-relaxed text-fg/60">{txt}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="gs-gilmar-section bg-bg2">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 md:grid-cols-12">
          <div className="relative max-w-[300px] md:col-span-4 md:max-w-none lg:col-span-3">
            <div className="absolute inset-0 -translate-x-2.5 translate-y-2.5 bg-acc" />
            <img src="/gs/images/team/gilmar-2.jpg" alt="Gilmar Steffen" className="relative aspect-[4/5] w-full object-cover gs-gilmar-img" />
          </div>
          <div className="md:col-span-8 lg:col-span-8 lg:col-start-5">
            <Label index="—">Quem assina o bar</Label>
            <blockquote className="mt-6 font-display text-[clamp(1.6rem,3vw,2.6rem)] italic leading-[1.18] tracking-[-0.01em]">
              “Nosso compromisso é tornar o seu momento único e incrível, cuidando de cada detalhe do bar para que você
              apenas aproveite.”
            </blockquote>
            <p className="mt-8 text-[13px] font-semibold uppercase tracking-[0.2em]">
              Gilmar Steffen <span className="font-normal text-fg/50">· à frente da GS Top Drinks</span>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}