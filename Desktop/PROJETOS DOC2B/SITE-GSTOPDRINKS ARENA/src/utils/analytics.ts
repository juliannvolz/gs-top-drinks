/* ================================================================== */
/*  GS TOP DRINKS — Analytics (GA4)                                    */
/*  Eventos estruturados para rastreamento do funil                    */
/* ================================================================== */

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

declare global {
  interface ImportMetaEnv {
    readonly VITE_GA_ID: string;
  }
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_ID || "";

/**
 * Inicializa GA4
 */
export function initGA(): void {
  if (!GA_MEASUREMENT_ID || typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, {
    send_page_view: false, // SPA: manual page_view
  });

  // Script tag
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);
}

/**
 * Envia evento para GA4
 */
export function trackEvent(eventName: string, parameters: Record<string, any> = {}): void {
  if (!GA_MEASUREMENT_ID || typeof window === "undefined" || !window.gtag) return;
  
  window.gtag("event", eventName, {
    ...parameters,
    timestamp: Date.now(),
  });
}

/* ------------------------------------------------------------------ */
/*  Eventos do Funil GS Top Drinks                                     */
/* ------------------------------------------------------------------ */

export const AnalyticsEvents = {
  /** Início do quiz */
  quizStart: () => trackEvent("quiz_start", { 
    funnel_step: 1,
    funnel_name: "gs_top_drinks_quiz"
  }),

  /** Conclusão de cada step */
  stepComplete: (step: number, stepName: string, value?: string) => trackEvent("step_complete", {
    funnel_step: step + 1,
    step_name: stepName,
    step_value: value,
  }),

  /** Seleção de pacote */
  packageSelect: (packageId: string, segment: string) => trackEvent("package_select", {
    package_id: packageId,
    segment,
    value: packageId,
  }),

  /** Toggle de drink */
  drinkToggle: (drinkId: string, packageId: string, action: "add" | "remove", totalPP: number) => trackEvent("drink_toggle", {
    drink_id: drinkId,
    package_id: packageId,
    action,
    total_per_person: totalPP,
  }),

  /** Aplicação de sugestão da curadoria */
  curadoriaApply: (suggestionsCount: number, beforeTotal: number, afterTotal: number) => trackEvent("curadoria_apply", {
    suggestions_count: suggestionsCount,
    total_before: beforeTotal,
    total_after: afterTotal,
    savings: beforeTotal - afterTotal,
  }),

  /** Visualização do resultado final */
  resultView: (data: {
    segment: string;
    packageId: string;
    guests: string;
    perPerson: number;
    totalEvent: number;
  }) => trackEvent("result_view", {
    ...data,
    funnel_step: 7,
    funnel_name: "gs_top_drinks_quiz",
  }),

  /** Clique no WhatsApp */
  whatsappClick: (messageType: "proposal" | "contact") => trackEvent("whatsapp_click", {
    message_type: messageType,
  }),

  /** Download do PDF */
  pdfDownload: (data: { segment: string; packageId: string }) => trackEvent("pdf_download", {
    ...data,
  }),

  /** Impressão da comanda */
  printComanda: (data: { segment: string; packageId: string }) => trackEvent("print_comanda", {
    ...data,
  }),

  /** Reinício do quiz */
  quizRestart: () => trackEvent("quiz_restart", {}),

  /** Mudança de segmento no step 4 */
  segmentDetailView: (segment: string) => trackEvent("segment_detail_view", {
    segment,
  }),
};

/* ------------------------------------------------------------------ */
/*  Helpers para componentes                                           */
/* ------------------------------------------------------------------ */

/** Hook para rastrear page views em SPA */
export function usePageView(path: string, title: string) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: path,
      page_title: title,
    });
  }
}

/** Rastreia tempo de permanência em step */
export function useStepTimer(stepName: string) {
  const startRef = { current: Date.now() };
  
  return {
    start: () => { startRef.current = Date.now(); },
    end: () => {
      const duration = Math.round((Date.now() - startRef.current) / 1000);
      trackEvent("step_duration", { step_name: stepName, duration_seconds: duration });
    },
  };
}