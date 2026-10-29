/* ================================================================== */
/*  GS TOP DRINKS — Segmentos & Temas (6 segmentos reais)              */
/* ================================================================== */

export type SegmentId = 
  | "casamento" 
  | "debutante" 
  | "formatura" 
  | "corporativo" 
  | "aniversario" 
  | "festas";

export interface Theme {
  mode: "dark" | "light";
  bg: string;
  bg2: string;
  fg: string;
  acc: string;
  acc2: string;
  acc3: string;
  onAcc: string;
  liquid: string[];
}

export interface Segment {
  id: SegmentId;
  name: string;
  short: string;
  tag: string;
  title: string;
  highlight: string;
  after?: string;
  copy: string;
  includes: { title: string; text: string }[];
  image: string;
  gallery: string[];
  theme: Theme;
}

export const SEGMENTS: Record<SegmentId, Segment> = {
  casamento: {
    id: "casamento",
    name: "Casamentos",
    short: "Cerimônia & Recepção",
    tag: "Cerimônia & Recepção",
    title: "Brindes à altura",
    highlight: "do seu sim.",
    copy:
      "Do welcome drink ao último brinde da pista, cada taça carrega a assinatura de vocês. Serviço impecável, discreto e em perfeita sintonia com a decoração e o cerimonial.",
    includes: [
      { title: "Drink do casal", text: "Um coquetel autoral batizado com o nome de vocês." },
      { title: "Welcome drink", text: "Servido à francesa na chegada dos convidados." },
      { title: "Menu impresso", text: "Carta personalizada, alinhada à papelaria do casamento." },
      { title: "Equipe cerimonial", text: "Bartenders em traje social, em sintonia com o cerimonial." },
    ],
    image: "/gs/images/segments/casamento.jpg",
    gallery: [
      "/gs/images/gallery/casamento-1.jpg",
      "/gs/images/gallery/casamento-2.jpg",
      "/gs/images/gallery/casamento-3.jpg",
    ],
    theme: {
      mode: "light",
      bg: "#f4ede3",
      bg2: "#ece2d4",
      fg: "#1d1714",
      acc: "#b44c22",
      acc2: "#e9a77c",
      acc3: "#9b7a45",
      onAcc: "#fbf6ef",
      liquid: ["#f7e7c4", "#efbb92", "#d9774a"],
    },
  },
  debutante: {
    id: "debutante",
    name: "15 Anos",
    short: "Festa & Celebração",
    tag: "Festa & Celebração",
    title: "A noite mais",
    highlight: "especial.",
    after: "da debutante.",
    copy:
      "15 anos é energia pura. A GS monta um bar que vira atração: drinks coloridos, fotogênicos, reposição ágil e uma carta pensada para manter a pista cheia e o brinde sempre na mão.",
    includes: [
      { title: "Carta vibrante", text: "Drinks coloridos e fotogênicos, como o Paradise em camadas." },
      { title: "Brinde das 15", text: "Um shot especial servido a todos na hora do parabéns." },
      { title: "Ritmo de pista", text: "Reposição ágil para a fila do bar nunca esfriar a festa." },
      { title: "Atrações GS", text: "Show dos Tequileiros e performances que animam a noite." },
    ],
    image: "/gs/images/segments/debutante.jpg",
    gallery: [
      "/gs/images/gallery/debutante-1.jpg",
      "/gs/images/gallery/debutante-2.jpg",
      "/gs/images/gallery/debutante-3.jpg",
    ],
    theme: {
      mode: "dark",
      bg: "#0b0908",
      bg2: "#17110e",
      fg: "#fbf3ea",
      acc: "#ff5a1f",
      acc2: "#ffc21a",
      acc3: "#2aa7ff",
      onAcc: "#0b0908",
      liquid: ["#2aa7ff", "#ffc21a", "#ff6a1f", "#d91e2a"],
    },
  },
  formatura: {
    id: "formatura",
    name: "Formaturas",
    short: "Conquista & Brindes",
    tag: "Conquista & Brindes",
    title: "Coquetelaria para",
    highlight: "celebrar a vitória.",
    copy:
      "Anos de dedicação merecem um brinde à altura. Drinks sofisticados, serviço premium e uma experiência que marca o fechamento de um ciclo e o início de novas conquistas.",
    includes: [
      { title: "Drink da turma", text: "Coquetel autoral com as cores da formatura." },
      { title: "Brinde oficial", text: "Espumante premium para o momento do canudo." },
      { title: "Bar premium", text: "Destilados de primeira linha e finalizações de show." },
      { title: "Foto & vídeo", text: "Drinks instagramáveis para eternizar a conquista." },
    ],
    image: "/gs/images/segments/formatura.jpg",
    gallery: [
      "/gs/images/gallery/formatura-1.jpg",
      "/gs/images/gallery/formatura-2.jpg",
      "/gs/images/gallery/formatura-3.jpg",
    ],
    theme: {
      mode: "dark",
      bg: "#0a0a0a",
      bg2: "#131110",
      fg: "#f6f0e6",
      acc: "#fe7802",
      acc2: "#fdb500",
      acc3: "#e8341c",
      onAcc: "#0a0a0a",
      liquid: ["#fdb500", "#fe7802", "#e8341c"],
    },
  },
  corporativo: {
    id: "corporativo",
    name: "Corporativo",
    short: "Executivo & Happy Hour",
    tag: "Executivo & Happy Hour",
    title: "Hospitalidade que",
    highlight: "fecha negócios.",
    copy:
      "Encerramentos de ano, happy hours, convenções e lançamentos. Um bar executivo que eleva a percepção da sua marca: pontual, discreto e com carta desenhada para o networking.",
    includes: [
      { title: "Setup invisível", text: "Montagem e desmontagem fora do horário do evento." },
      { title: "Carta com a sua marca", text: "Cardápio com identidade visual e drinks batizados." },
      { title: "Zero álcool premium", text: "Mocktails no mesmo nível de sofisticação." },
      { title: "Operação executiva", text: "Equipe enxuta, discreta e com responsável dedicado." },
    ],
    image: "/gs/images/segments/corporativo.jpg",
    gallery: [
      "/gs/images/gallery/corporativo-1.jpg",
      "/gs/images/gallery/corporativo-2.jpg",
      "/gs/images/gallery/corporativo-3.jpg",
    ],
    theme: {
      mode: "dark",
      bg: "#090b0b",
      bg2: "#111716",
      fg: "#eef0ec",
      acc: "#f5a524",
      acc2: "#2a9d8f",
      acc3: "#fe7802",
      onAcc: "#090b0b",
      liquid: ["#f7c766", "#e08b22", "#8a4312"],
    },
  },
  aniversario: {
    id: "aniversario",
    name: "Aniversários",
    short: "Festa & Celebração",
    tag: "Festa & Celebração",
    title: "O bar que vira",
    highlight: "atração",
    after: "da sua festa.",
    copy:
      "Aniversário é energia do começo ao fim. A GS monta um bar que vira atração: drinks coloridos, reposição ágil e uma carta pensada para manter a pista cheia e o brinde sempre na mão.",
    includes: [
      { title: "Carta vibrante", text: "Drinks coloridos e fotogênicos, como o Paradise em camadas." },
      { title: "Brinde do parabéns", text: "Um shot especial servido a todos na hora do bolo." },
      { title: "Ritmo de pista", text: "Reposição ágil para a fila do bar nunca esfriar a festa." },
      { title: "Atrações GS", text: "Show dos Tequileiros e performances que animam a noite." },
    ],
    image: "/gs/images/segments/aniversario.jpg",
    gallery: [
      "/gs/images/gallery/aniversario-1.jpg",
      "/gs/images/gallery/aniversario-2.jpg",
      "/gs/images/gallery/aniversario-3.jpg",
    ],
    theme: {
      mode: "dark",
      bg: "#0b0908",
      bg2: "#17110e",
      fg: "#fbf3ea",
      acc: "#ff5a1f",
      acc2: "#ffc21a",
      acc3: "#2aa7ff",
      onAcc: "#0b0908",
      liquid: ["#2aa7ff", "#ffc21a", "#ff6a1f", "#d91e2a"],
    },
  },
  festas: {
    id: "festas",
    name: "Festas em Geral",
    short: "Qualquer Ocasião",
    tag: "Qualquer Ocasião",
    title: "Seu evento,",
    highlight: "seu estilo.",
    copy:
      "Qualquer ocasião merece um bar premium. Da confraternização ao chá revelação, a GS adapta estrutura, carta e equipe para o seu momento ser inesquecível.",
    includes: [
      { title: "Carta flexível", text: "Clássicos, autorais e sem álcool — você escolhe o mix." },
      { title: "Estrutura sob medida", text: "Do bar compacto ao setup completo, dimensionamos pro seu espaço." },
      { title: "Equipe GS", text: "Bartenders profissionais, uniformizados e treinados." },
      { title: "Orçamento na hora", text: "Simule aqui e receba a estimativa por pessoa agora." },
    ],
    image: "/gs/images/segments/festas.jpg",
    gallery: [
      "/gs/images/gallery/festas-1.jpg",
      "/gs/images/gallery/festas-2.jpg",
      "/gs/images/gallery/festas-3.jpg",
    ],
    theme: {
      mode: "light",
      bg: "#faf8f5",
      bg2: "#f0ebe0",
      fg: "#1a1612",
      acc: "#c47a2e",
      acc2: "#e8b87d",
      acc3: "#8b6f47",
      onAcc: "#faf8f5",
      liquid: ["#f5e6cc", "#e8b87d", "#c47a2e"],
    },
  },
};

export const SEGMENT_ORDER: SegmentId[] = [
  "casamento",
  "debutante", 
  "formatura",
  "corporativo",
  "aniversario",
  "festas"
];

export const BRAND_THEME: Theme = {
  mode: "dark",
  bg: "#0a0a0a",
  bg2: "#131110",
  fg: "#f6f0e6",
  acc: "#fe7802",
  acc2: "#fdb500",
  acc3: "#e8341c",
  onAcc: "#0a0a0a",
  liquid: ["#fdb500", "#fe7802", "#e8341c"],
};