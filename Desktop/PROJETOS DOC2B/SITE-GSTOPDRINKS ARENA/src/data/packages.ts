/* ================================================================== */
/*  GS TOP DRINKS — Pacotes & Preços (Placeholders realistas)          */
/*  Base: 45/65/95  |  Teto: +30%  |  Ajustar com valores reais depois  */
/* ================================================================== */

export type PackageId = "classico" | "intermediario" | "sonhos";
export type Tier = "economico" | "assinatura" | "premium";
export type GlassType = 
  | "rocks" | "highball" | "martini" | "coupe" 
  | "wine" | "flute" | "mug" | "hurricane";

export interface Drink {
  id: string;
  name: string;
  desc: string;
  cost: number;
  tags: string[];
  glass: GlassType;
  color: string | string[];
  zero: boolean;
  signature: boolean;
  image?: string;
  packageId?: PackageId;
}

export interface Package {
  id: PackageId;
  name: string;
  tagline: string;
  base: number;
  ceiling: number;
  bestSeller?: boolean;
  image: string;
  features: string[];
  drinks: Drink[];
}

export type Pkg = Package;

const d = (
  id: string,
  name: string,
  desc: string,
  cost: number,
  tags: string[],
  glass: GlassType,
  color: string | string[],
  opts: { zero?: boolean; signature?: boolean; image?: string } = {}
): Drink => ({ 
  id, 
  name, 
  desc, 
  cost, 
  tags, 
  glass, 
  color, 
  zero: !!opts.zero, 
  signature: !!opts.signature,
  image: opts.image 
});

export const PACKAGES: Record<PackageId, Package> = {
  classico: {
    id: "classico",
    name: "Clássico",
    tagline: "O essencial, impecável",
    base: 45,
    ceiling: 60,
    image: "/gs/images/packages/classico.jpg",
    features: [
      "Bar montado + 1 bartender GS",
      "Insumos, frutas frescas, gelo e copos",
      "Caipirinhas de frutas da estação",
      "Clássicos: Mojito, Cuba Libre, Gin Tônica, Moscow Mule",
      "Opções sem álcool (Limonada Suíça, Soda Italiana)",
    ],
    drinks: [
      d("c-limao", "Caipirinha de Limão", "Cachaça, limão taiti e açúcar — a clássica brasileira", 4.0, ["cítrico", "refrescante"], "rocks", "#dcef9a", { image: "/gs/images/drinks/caipirinha-limao.webp" }),
      d("c-maracuja", "Caipirinha de Maracujá", "Maracujá fresco, cachaça e toque de hortelã", 4.5, ["frutado", "cítrico"], "rocks", "#f2b134", { image: "/gs/images/drinks/caipirinha-maracuja-limao.webp" }),
      d("c-morango", "Caipirinha de Morango", "Morangos frescos macerados com limão", 5.0, ["frutado", "doce"], "rocks", "#e8484f", { image: "/gs/images/drinks/caipirinha-morango.webp" }),
      d("c-abacaxi", "Caipirinha de Abacaxi & Hortelã", "Abacaxi pérola e hortelã fresca", 5.0, ["frutado", "herbal"], "rocks", "#f4d35e" ),
      d("c-cuba", "Cuba Libre", "Rum, cola e limão no copo alto", 4.0, ["doce", "refrescante"], "highball", "#5b2a12" ),
      d("c-mojito", "Mojito", "Rum, hortelã, limão e água com gás", 5.5, ["refrescante", "herbal"], "highball", "#d3ecb4" ),
      d("c-pina", "Piña Colada", "Rum, abacaxi e creme de coco", 6.0, ["cremoso", "frutado"], "hurricane", "#f6efd6" ),
      d("c-gin", "Gin Tônica", "Gin, tônica e especiarias na taça", 6.5, ["herbal", "seco"], "wine", "#e3f1ec" ),
      d("c-mule", "Moscow Mule", "Vodka, limão e espuma de gengibre na caneca de cobre", 6.0, ["picante", "cítrico"], "mug", "copper", { image: "/gs/images/drinks/moscow-mule.webp" }),
      d("c-aperol", "Aperol Spritz", "Aperol, espumante e laranja", 7.5, ["espumante", "amargo"], "wine", "#f26b1d" ),
      d("c-limonada", "Limonada Suíça", "Limão batido com leite condensado — 0% álcool", 3.0, ["cítrico", "cremoso"], "highball", "#eef6cf", { zero: true } ),
      d("c-soda", "Soda Italiana de Morango", "Xarope artesanal e água com gás — 0% álcool", 3.5, ["frutado", "refrescante"], "highball", "#f39aa8", { zero: true } ),
    ],
  },
  intermediario: {
    id: "intermediario",
    name: "Intermediário",
    tagline: "Clássicos + autorais da casa",
    base: 65,
    ceiling: 85,
    image: "/gs/images/packages/intermediario.jpg",
    features: [
      "Tudo do Clássico + 2º bartender",
      "2 coquetéis autorais da casa (Paradise + Laranja & Alecrim)",
      "Welcome drink na recepção",
      "Bar com identidade visual do evento",
      "Caipirinha da estação (fruta surpresa)",
    ],
    drinks: [
      d("i-sensacao", "Sensação", "Autoral da casa — frutas vermelhas, limão e espuma leve", 6.0, ["frutado", "cítrico"], "coupe", "#e0566b", { signature: true } ),
      d("i-paradise", "Paradise", "Camadas tropicais em degradê — o queridinho das fotos", 6.5, ["frutado", "doce"], "hurricane", ["#2aa7ff", "#ffc21a", "#ff7a1f", "#d91e2a"], { signature: true, image: "/gs/images/drinks/coquetel-colorido.webp" } ),
      d("i-estacao", "Caipirinha da Estação", "Frutas frescas da época, escolhidas pelo bar", 5.0, ["frutado", "refrescante"], "rocks", "#f0a43a" ),
      d("i-mojito", "Mojito de Maracujá", "O clássico com twist tropical", 6.0, ["frutado", "refrescante"], "highball", "#f5c542" ),
      d("i-alecrim", "Laranja & Alecrim", "Gin, laranja, alecrim tostado e espuma cítrica", 6.5, ["herbal", "cítrico"], "rocks", "#f3df8a", { signature: true, image: "/gs/images/drinks/drink-laranja-alecrim.webp" } ),
      d("i-mule", "Mule da Casa", "Espuma de gengibre, raspas de limão e hortelã", 6.0, ["picante", "refrescante"], "mug", "copper" ),
      d("i-margarita", "Margarita", "Tequila, licor de laranja, limão e borda de sal", 7.0, ["cítrico", "salino"], "coupe", "#e6efa6" ),
      d("i-cosmo", "Cosmopolitan", "Vodka, cranberry, licor de laranja e limão", 7.0, ["frutado", "seco"], "martini", "#e5486c" ),
      d("i-aperol", "Aperol Spritz", "Aperol, espumante e laranja", 7.5, ["espumante", "amargo"], "wine", "#f26b1d" ),
      d("i-sour", "Whiskey Sour", "Bourbon, limão, açúcar e espuma aveludada", 8.0, ["encorpado", "cítrico"], "rocks", "#e3ad55" ),
      d("i-tropical", "Tropical GS", "Rum, abacaxi, maracujá e toque de coco", 7.0, ["frutado", "cremoso"], "hurricane", ["#ffd700", "#ff8c00", "#ff4500"], { image: "/gs/images/drinks/coquetel-tropical.webp" } ),
      d("i-ginger", "Ginger Cooler", "Gengibre, limão e água com gás — 0% álcool", 4.0, ["picante", "refrescante"], "highball", "#f2dca6", { zero: true } ),
      d("i-pink", "Pink Lemonade", "Limonada de frutas vermelhas — 0% álcool", 4.5, ["cítrico", "frutado"], "highball", "#f6a7b5", { zero: true } ),
    ],
  },
  sonhos: {
    id: "sonhos",
    name: "Dos Sonhos",
    tagline: "A experiência completa",
    base: 95,
    ceiling: 120,
    bestSeller: true,
    image: "/gs/images/packages/sonhos.jpg",
    features: [
      "Equipe completa: bartenders + barback",
      "Destilados premium e carta autoral do Gilmar",
      "Drinks com gelo seco e finalizações de show",
      "Show dos Tequileiros incluso",
      "Welcome drink premium + brinde especial",
      "Carta 100% personalizada com a identidade do evento",
    ],
    drinks: [
      d("s-sunrise", "GS Sunrise", "O drink do nosso logo, servido com névoa de gelo seco", 8.5, ["frutado", "cítrico"], "hurricane", ["#fdb500", "#fe7802", "#e8341c"], { signature: true } ),
      d("s-martini", "Dry Martini com Twist", "Gin premium, vermute seco e twist de limão siciliano", 9.0, ["seco", "herbal"], "martini", "#efd38c" ),
      d("s-negroni", "Negroni", "Gin, Campari e vermute rosso", 9.0, ["amargo", "encorpado"], "rocks", "#b3231c" ),
      d("s-french", "French 75", "Gin, limão siciliano e espumante brut", 9.5, ["espumante", "cítrico"], "flute", "#f3e3a2" ),
      d("s-espresso", "Espresso Martini", "Vodka premium, café espresso e baunilha", 10.0, ["encorpado", "café"], "coupe", "#3a1f10" ),
      d("s-old", "Old Fashioned", "Bourbon, angostura e casca de laranja", 10.5, ["encorpado", "doce"], "rocks", "#a9581d" ),
      d("s-penicillin", "Penicillin", "Scotch, gengibre, mel e limão — toque defumado", 11.0, ["defumado", "cítrico"], "rocks", "#e2b25a" ),
      d("s-mezcal", "Margarita de Mezcal", "Mezcal, agave e limão com borda de sal defumado", 11.5, ["defumado", "cítrico"], "coupe", "#dfe79f" ),
      d("s-mule", "Mule Premium de Capim-Santo", "Vodka premium e xarope autoral de capim-santo", 8.5, ["refrescante", "herbal"], "mug", "copper" ),
      d("s-caipi", "Caipirinha Premium Frutas Vermelhas", "Cachaça envelhecida e frutas vermelhas frescas", 7.5, ["frutado", "doce"], "rocks", "#c21f3a" ),
      d("s-virgin", "Virgin Sunrise", "Laranja, grenadine e névoa de gelo seco — 0% álcool", 5.5, ["frutado", "cítrico"], "hurricane", ["#fdc94a", "#fe8a22", "#e8341c"], { zero: true } ),
      d("s-spritz0", "Spritz Zero", "Bitter sem álcool, laranja sanguínea e tônica", 6.0, ["cítrico", "amargo"], "wine", "#e2502c", { zero: true } ),
    ],
  },
};

export const PACKAGE_ORDER: PackageId[] = ["classico", "intermediario", "sonhos"];

export const MIN_DRINKS = 4;
export const MAX_DRINKS = 8;

/* ---------------------------- Quiz Options -------------------------- */

export interface GuestsOption {
  id: string;
  label: string;
  short: string;
  sub: string;
  estimate: number;
  staff: string;
}

export const GUEST_OPTIONS: GuestsOption[] = [
  { id: "g1", label: "Até 50 convidados", short: "Até 50", sub: "Recepção intimista", estimate: 40, staff: "1 bartender" },
  { id: "g2", label: "50 a 120 convidados", short: "50 a 120", sub: "Festa em ritmo pleno", estimate: 85, staff: "2 bartenders" },
  { id: "g3", label: "120 a 250 convidados", short: "120 a 250", sub: "Grande celebração", estimate: 180, staff: "3 bartenders + barback" },
  { id: "g4", label: "Mais de 250", short: "250+", sub: "Produção sob medida", estimate: 300, staff: "Operação completa" },
];

export interface VibeOption {
  id: PackageId;
  label: string;
  sub: string;
  meta: string;
}

export const VIBE_OPTIONS: VibeOption[] = [
  { id: "classico", label: "Os clássicos que todo mundo ama", sub: "Caipirinhas, mojito, gin tônica", meta: "Pacote Clássico" },
  { id: "intermediario", label: "Clássicos com autorais da casa", sub: "O equilíbrio entre o conhecido e a surpresa", meta: "Pacote Intermediário" },
  { id: "sonhos", label: "Uma experiência de show", sub: "Destilados premium, gelo seco e atrações", meta: "Pacote Dos Sonhos" },
];