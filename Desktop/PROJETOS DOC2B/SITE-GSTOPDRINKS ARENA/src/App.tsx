import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GSMark, HurricaneGlass } from "./components/brand";
import { EASE, IgIcon } from "./components/ui";
import IntroScreen from "./components/IntroScreen";
import QuizScreen from "./components/QuizScreen";
import EssentialsScreen from "./components/quiz/EssentialsScreen";
import SegmentScreen from "./components/SegmentScreen";
import PackageScreen from "./components/PackageScreen";
import DrinksScreen from "./components/DrinksScreen";
import ResultScreen from "./components/ResultScreen";
import {
  BRAND_THEME,
  CONTACT,
  GUEST_OPTIONS,
  PACKAGES,
  SEGMENTS,
  seedSelection,
  waLink,
  type PackageId,
  type SegmentId,
} from "./data/catalog";
import { ThemeCtx } from "./theme";
import { initGA, AnalyticsEvents } from "./utils/analytics";

type Step = "intro" | "q0" | "q1" | "q2" | "q3" | "segment" | "package" | "drinks" | "result";

const STEP_INDEX: Record<Step, number> = {
  intro: -1,
  q0: 0,
  q1: 1,
  q2: 2,
  q3: 3,
  segment: 4,
  package: 5,
  drinks: 6,
  result: 7,
};
const STEP_NAMES = ["Momento", "Convidados", "Estilo", "Essenciais", "Destino", "Pacote", "Carta", "Comanda"];

const screen = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
  transition: { duration: 0.5, ease: EASE },
};

function StepIndicator({ index }: { index: number }) {
  const total = STEP_NAMES.length;
  return (
    <div className="flex items-center gap-3">
      <HurricaneGlass level={(index + 1) / total} className="h-10 w-auto text-fg/60" />
      <div className="leading-tight">
        <p className="font-mono text-[12px] text-fg/55">
          <span className="text-acc">{String(index + 1).padStart(2, "0")}</span> / {String(total).padStart(2, "0")}
        </p>
        <p className="hidden text-[11px] font-semibold uppercase tracking-[0.18em] sm:block">{STEP_NAMES[index]}</p>
      </div>
    </div>
  );
}

export default function App() {
  const [step, setStep] = useState<Step>("intro");
  const [segment, setSegment] = useState<SegmentId | null>(null);
  const [guestId, setGuestId] = useState<string | null>(null);
  const [vibe, setVibe] = useState<PackageId | null>(null);
  const [essentials, setEssentials] = useState<string[]>([]);
  const [packageId, setPackageId] = useState<PackageId>("intermediario");
  const [selected, setSelected] = useState<string[]>([]);

  const theme = segment ? SEGMENTS[segment].theme : BRAND_THEME;
  const guests = useMemo(() => GUEST_OPTIONS.find((g) => g.id === guestId) ?? GUEST_OPTIONS[1], [guestId]);
  const idx = STEP_INDEX[step];

  // Initialize GA4
  useEffect(() => {
    initGA();
  }, []);

  // Track step changes for analytics
  useEffect(() => {
    if (step === "intro") return;
    
    const stepMap: Record<Step, { name: string; num: number }> = {
      q0: { name: "momento", num: 1 },
      q1: { name: "convidados", num: 2 },
      q2: { name: "estilo", num: 3 },
      q3: { name: "essenciais", num: 4 },
      segment: { name: "destino", num: 5 },
      package: { name: "pacote", num: 6 },
      drinks: { name: "carta", num: 7 },
      result: { name: "comanda", num: 8 },
      intro: { name: "intro", num: 0 },
    };
    
    const info = stepMap[step];
    if (info && info.num > 0) {
      AnalyticsEvents.stepComplete(info.num, info.name);
    }
  }, [step]);

  // Track quiz start
  useEffect(() => {
    if (step === "q0") {
      AnalyticsEvents.quizStart();
    }
  }, [step]);

  // Track segment detail view
  useEffect(() => {
    if (step === "segment" && segment) {
      AnalyticsEvents.segmentDetailView(segment);
    }
  }, [step, segment]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [step]);

  // Tema por nicho: variáveis no :root (portais e barra fixa herdam)
  useEffect(() => {
    const root = document.documentElement;
    const vars: Record<string, string> = {
      "--bg": theme.bg,
      "--bg2": theme.bg2,
      "--fg": theme.fg,
      "--acc": theme.acc,
      "--acc2": theme.acc2,
      "--acc3": theme.acc3,
      "--on-acc": theme.onAcc,
    };
    Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
    root.style.colorScheme = theme.mode;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme.bg);
  }, [theme]);

  const goPackage = (p: PackageId) => {
    setPackageId(p);
    setSelected(seedSelection(PACKAGES[p]));
    AnalyticsEvents.packageSelect(p, segment ?? "unknown");
    setStep("drinks");
  };

  const handleDrinkChange = (newSelected: string[]) => {
    const newTotal = totalPerPerson(PACKAGES[packageId], newSelected);
    const added = newSelected.filter((id) => !selected.includes(id));
    const removed = selected.filter((id) => !newSelected.includes(id));
    
    if (added.length > 0) {
      AnalyticsEvents.drinkToggle(added[0], packageId, "add", newTotal);
    }
    if (removed.length > 0) {
      AnalyticsEvents.drinkToggle(removed[0], packageId, "remove", newTotal);
    }
    
    setSelected(newSelected);
  };

  const restart = () => {
    AnalyticsEvents.quizRestart();
    setSegment(null);
    setGuestId(null);
    setVibe(null);
    setEssentials([]);
    setSelected([]);
    setStep("intro");
  };

  return (
    <ThemeCtx.Provider value={theme}>
      <div className="relative min-h-screen bg-bg text-fg transition-colors duration-700">
        <header className="fixed inset-x-0 top-0 z-50 border-b border-fg/10 bg-bg/85 backdrop-blur-md transition-colors duration-700 print:hidden">
          <div className="relative mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
            <button type="button" onClick={restart} aria-label="GS Top Drinks — início" className="outline-none">
              <GSMark size={24} />
            </button>

            {idx >= 0 && (
              <div className="md:absolute md:left-1/2 md:-translate-x-1/2">
                <StepIndicator index={idx} />
              </div>
            )}

            <div className="flex items-center gap-2">
              <a
                href={CONTACT.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram @gstopdrinks"
                className="grid h-10 w-10 place-items-center border border-fg/15 text-fg/75 transition-colors hover:border-fg/50 hover:text-fg"
              >
                <IgIcon size={16} />
              </a>
              <a
                href={waLink("Olá, GS Top Drinks! Gostaria de um orçamento de open bar.")}
                target="_blank"
                rel="noreferrer"
                className="hidden h-10 items-center bg-acc px-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-onacc transition-transform hover:-translate-y-px sm:flex"
              >
                Orçamento
              </a>
            </div>
          </div>
        </header>

        <main>
          <AnimatePresence mode="wait">
            {step === "intro" && (
              <motion.div key="intro" {...screen}>
                <IntroScreen onStart={() => setStep("q0")} />
              </motion.div>
            )}

            {(step === "q0" || step === "q1" || step === "q2") && (
              <motion.div key={step} {...screen}>
                <QuizScreen
                  question={step === "q0" ? 0 : step === "q1" ? 1 : 2}
                  selected={step === "q0" ? segment ?? undefined : step === "q1" ? guestId ?? undefined : vibe ?? undefined}
                  onBack={() => setStep(step === "q0" ? "intro" : step === "q1" ? "q0" : "q1")}
                  onAnswer={(v) => {
                    if (step === "q0") {
                      setSegment(v as SegmentId);
                      setStep("q1");
                    } else if (step === "q1") {
                      setGuestId(v);
                      setStep("q2");
                    } else {
                      setVibe(v as PackageId);
                      setStep("q3");
                    }
                  }}
                />
              </motion.div>
            )}

            {step === "q3" && segment && (
              <motion.div key="essentials" {...screen}>
                <EssentialsScreen
                  selected={essentials}
                  onChange={setEssentials}
                  onNext={() => setStep("segment")}
                  onBack={() => setStep("q2")}
                />
              </motion.div>
            )}

            {step === "segment" && segment && (
              <motion.div key={`seg-${segment}`} {...screen}>
                <SegmentScreen segment={SEGMENTS[segment]} onNext={() => setStep("package")} onBack={() => setStep("q3")} />
              </motion.div>
            )}

            {step === "package" && segment && (
              <motion.div key="package" {...screen}>
                <PackageScreen
                  segment={segment}
                  recommended={vibe ?? undefined}
                  onSelect={goPackage}
                  onBack={() => setStep("segment")}
                />
              </motion.div>
            )}

            {step === "drinks" && segment && (
              <motion.div key="drinks" {...screen}>
                <DrinksScreen
                  segment={segment}
                  packageId={packageId}
                  selected={selected}
                  onChange={handleDrinkChange}
                  onNext={() => setStep("result")}
                  onBack={() => setStep("package")}
                />
              </motion.div>
            )}

            {step === "result" && segment && (
              <motion.div key="result" {...screen}>
                <ResultScreen
                  segment={segment}
                  guests={guests}
                  packageId={packageId}
                  selected={selected}
                  onBack={() => setStep("drinks")}
                  onRestart={restart}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </ThemeCtx.Provider>
  );
}

// Import totalPerPerson for analytics
import { totalPerPerson } from "./data/catalog";