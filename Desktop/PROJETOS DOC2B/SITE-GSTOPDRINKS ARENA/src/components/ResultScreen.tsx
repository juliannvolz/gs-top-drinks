import { useMemo, type CSSProperties, type ReactNode } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Download } from "lucide-react";
import { AnimatedMoney, Btn, EASE, IgIcon, Label, Reveal, TextLink } from "./ui";
import { useTheme } from "../theme";
import { generateComandaPDF, generateSimplePDF } from "../utils/pdf";
import { saveComanda } from "../lib/supabase";
import {
  CONTACT,
  PACKAGES,
  SEGMENTS,
  buildProposalMessage,
  fmt,
  fmtNum,
  totalPerPerson,
  waLink,
  type GuestsOption,
  type PackageId,
  type SegmentId,
} from "../data/catalog";

interface Props {
  segment: SegmentId;
  guests: GuestsOption;
  packageId: PackageId;
  selected: string[];
  leadNome?: string;
  leadTelefone?: string;
  onBack: () => void;
  onRestart: () => void;
}

const INK = "#1b1410";
const WARN = "#e2412f";

function Row({ l, r }: { l: ReactNode; r: ReactNode }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="min-w-0">{l}</span>
      <span className="leader" />
      <span className="shrink-0 tabular-nums">{r}</span>
    </div>
  );
}

const Rule = ({ double = false }: { double?: boolean }) => (
  <div className={`my-4 ${double ? "border-t-[3px] border-double" : "border-t border-dashed"}`} style={{ borderColor: `${INK}59` }} />
);

export default function ResultScreen({ segment, guests, packageId, selected, onBack, onRestart }: Props) {
  const theme = useTheme();
  const pkg = PACKAGES[packageId];
  const seg = SEGMENTS[segment];
  const drinks = pkg.drinks.filter((x) => selected.includes(x.id));
  const perPerson = totalPerPerson(pkg, selected);
  const over = perPerson > pkg.ceiling + 0.001;
  const totalEvent = perPerson * guests.estimate;
  const msg = buildProposalMessage({ segment: seg, guests, pkg, drinks, perPerson, total: totalEvent });
  const number = useMemo(
    () => 1000 + [...selected.join("")].reduce((a, ch) => (a * 31 + ch.charCodeAt(0)) % 9000, 7),
    [selected]
  );
  const date = new Date().toLocaleDateString("pt-BR");
  const paper = theme.mode === "light" ? "#fffdf8" : "#f7f1e6";
  const brandVars = { "--acc": "#fe7802", "--acc2": "#fdb500" } as CSSProperties;

  const drinksNomes = drinks.map((d) => d.name).join(", ");

  const salvarComanda = async (): Promise<boolean> => {
    if (!leadTelefone) return true; // sem telefone obrigatório, não bloqueia
    const resultado = await saveComanda({
      nome_cliente: leadNome ?? null,
      telefone: leadTelefone,
      segmento: seg.name,
      convidados: guests.estimate,
      pacote: pkg.name,
      drinks: drinksNomes,
      valor_por_pessoa: perPerson,
      valor_total_evento: totalEvent,
    });
    if (!resultado.ok) {
      console.warn("Comanda não salva no banco:", resultado.error);
    }
    return resultado.ok;
  };

  const handleDownloadPDF = async () => {
    try {
      await salvarComanda();
    } catch (e) {
      console.warn("Falha ao salvar comanda", e);
    }
    try {
      await generateComandaPDF({
        segment: seg,
        guests,
        packageId,
        pkg,
        selectedDrinks: drinks,
        perPerson,
        totalEvent,
        number,
        date,
      });
    } catch (e) {
      console.error("PDF principal falhou, usando fallback", e);
      generateSimplePDF({
        segment: seg,
        guests,
        packageId,
        pkg,
        selectedDrinks: drinks,
        perPerson,
        totalEvent,
        number,
        date,
      });
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-5 pb-24 pt-28 sm:px-8 lg:pt-32">
      <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6">
          <Reveal>
            <Label index="07">Comanda · {seg.name}</Label>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-6 font-display text-[clamp(2.6rem,6vw,5.2rem)] font-medium leading-[0.95] tracking-[-0.025em]">
              Sua comanda <span className="block font-normal italic">está pronta.</span>
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-10 border-t border-fg/15 pt-8">
              <p className="font-mono text-[13px] uppercase tracking-[0.14em] text-fg/55">Estimativa por pessoa</p>
              <AnimatedMoney
                value={perPerson}
                className="gs-offset mt-4 block font-sans text-[clamp(3.4rem,8.5vw,6.6rem)] font-extrabold leading-[0.9] tracking-[-0.045em] tabular-nums"
              />
              <p
                className="mt-6 inline-flex items-center border px-3 py-1.5 text-[12px] font-semibold uppercase tracking-[0.14em]"
                style={over ? { color: WARN, borderColor: `${WARN}80` } : { color: "var(--acc)", borderColor: "var(--acc)" }}
              >
                {over ? "Acima do teto do plano" : `Dentro do plano ${pkg.name}`}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <dl className="mt-10 grid grid-cols-3 border-y border-fg/15">
              {[
                [pkg.name, "Pacote"],
                [guests.short, "Convidados"],
                [`${drinks.length}`, "Drinks"],
              ].map(([v, l], i) => (
                <div key={l} className={`py-5 ${i > 0 ? "border-l border-fg/15 pl-5" : ""}`}>
                  <dt className="font-display text-[1.5rem] leading-tight">{v}</dt>
                  <dd className="mt-1 text-[12px] uppercase tracking-[0.16em] text-fg/50">{l}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-fg/65">
              Investimento estimado de <strong className="font-semibold text-fg">≈ {fmt.format(totalEvent)}</strong> para
              cerca de {guests.estimate} convidados, com {guests.staff.toLowerCase()}. Valores-base de simulação — a proposta
              final é confirmada pela equipe GS.
            </p>
          </Reveal>

          <Reveal delay={0.2} className="print:hidden">
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <Btn
                onClick={async () => {
                  try { await salvarComanda(); } catch (e) { console.warn("Falha ao salvar comanda", e); }
                  window.open(waLink(msg), "_blank");
                }}
                icon={<MessageCircle className="h-4 w-4" />}>
                Enviar comanda no WhatsApp
              </Btn>
              <Btn href={CONTACT.instagram} variant="line" arrow={false} icon={<IgIcon size={16} />}>
                {CONTACT.handle}
              </Btn>
            </div>
            <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Btn onClick={handleDownloadPDF} variant="line" icon={<Download className="h-4 w-4" />}>
                Baixar PDF
              </Btn>
              <TextLink onClick={onBack} back>
                Ajustar carta
              </TextLink>
              <TextLink onClick={async () => { try { await salvarComanda(); } catch (e) { console.warn("Falha ao salvar comanda", e); } window.print(); }}>Imprimir comanda</TextLink>
              <TextLink onClick={onRestart}>Nova simulação</TextLink>
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-6">
          <motion.div
            initial={{ opacity: 0, y: 50, rotate: -1 }}
            animate={{ opacity: 1, y: 0, rotate: 1.2 }}
            transition={{ duration: 1, delay: 0.2, ease: EASE }}
            className="mx-auto w-full max-w-[460px]"
            style={{ filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.4))" }}
          >
            <div
              className="receipt px-7 py-12 font-mono text-[15px] leading-relaxed sm:px-9"
              style={{ background: paper, color: INK, ...brandVars }}
            >
              <div className="text-center">
                <p className="gs-offset font-sans text-[3.2rem] font-extrabold leading-none tracking-[-0.06em]">GS</p>
                <p className="mt-2 font-sans text-[11px] font-semibold uppercase tracking-[0.42em]">Top Drinks</p>
                <p className="mt-3 text-[13px] opacity-60">Open bar premium · {CONTACT.city}</p>
              </div>
              <Rule />
              <div className="flex justify-between text-[13px]">
                <span>COMANDA Nº {number}</span>
                <span>{date}</span>
              </div>
              <Rule />
              <div className="space-y-1">
                <Row l="Evento" r={seg.name} />
                <Row l="Convidados" r={guests.short} />
                <Row l="Pacote" r={pkg.name} />
              </div>
              <Rule />
              <div className="space-y-1">
                {drinks.map((x) => (
                  <Row key={x.id} l={x.name} r={fmtNum.format(x.cost)} />
                ))}
                <Row l="Estrutura & equipe" r={fmtNum.format(pkg.base)} />
              </div>
              <Rule double />
              <div className="flex items-baseline justify-between font-sans">
                <span className="text-[13px] font-semibold uppercase tracking-[0.14em]">Total / pessoa</span>
                <span className="text-2xl font-extrabold tabular-nums">{fmt.format(perPerson)}</span>
              </div>
              <p className="mt-1 text-right text-[13px] opacity-60">para cerca de {guests.estimate} convidados</p>
              <div className="mt-2 flex items-baseline justify-between font-sans">
                <span className="text-[13px] font-semibold uppercase tracking-[0.14em]">Total estimado</span>
                <span className="text-xl font-bold tabular-nums">≈ {fmt.format(totalEvent)}</span>
              </div>
              <Rule />
              <div
                className="mx-auto h-12 w-4/5"
                style={{
                  background: `repeating-linear-gradient(90deg, ${INK} 0 2px, transparent 2px 4px, ${INK} 4px 5px, transparent 5px 8px, ${INK} 8px 11px, transparent 11px 12px)`,
                }}
              />
              <p className="mt-4 text-center text-[13px]">obrigado pela preferência!</p>
              <p className="text-center text-[13px] opacity-60">{CONTACT.handle} · gstopdrinks.com.br</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}