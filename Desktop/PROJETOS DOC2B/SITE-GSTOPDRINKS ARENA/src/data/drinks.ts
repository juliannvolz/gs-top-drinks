/* ================================================================== */
/*  GS TOP DRINKS — Catálogo Unificado de Drinks                       */
/*  Fonte única para busca, filtros e exibição cross-package           */
/* ================================================================== */

import { PACKAGES, type Drink, type PackageId } from "./packages";

export type GlassType = 
  | "rocks" | "highball" | "martini" | "coupe" 
  | "wine" | "flute" | "mug" | "hurricane";

export type DrinkTier = "economico" | "assinatura" | "premium";

/** Drink com packageId anexado */
export type DrinkWithPackage = Drink & { packageId: PackageId };

/** Todos os drinks únicos (deduplicados por ID) com packageId */
export const ALL_DRINKS: DrinkWithPackage[] = Object.values(PACKAGES)
  .flatMap((pkg) => pkg.drinks.map((d) => ({ ...d, packageId: pkg.id })))
  .reduce((acc: DrinkWithPackage[], drink: DrinkWithPackage) => {
    if (!acc.find((d) => d.id === drink.id)) acc.push(drink);
    return acc;
  }, []);

/** Drinks por pacote (para compatibilidade) */
export const DRINKS_BY_PACKAGE: Record<PackageId, Drink[]> = {
  classico: PACKAGES.classico.drinks,
  intermediario: PACKAGES.intermediario.drinks,
  sonhos: PACKAGES.sonhos.drinks,
};

/** Drinks por tier (para curadoria/sugestões) */
export const DRINKS_BY_TIER: Record<DrinkTier, DrinkWithPackage[]> = {
  economico: ALL_DRINKS.filter((d) => !d.zero && getTier(d.cost, d.packageId) === "economico"),
  assinatura: ALL_DRINKS.filter((d) => !d.zero && getTier(d.cost, d.packageId) === "assinatura"),
  premium: ALL_DRINKS.filter((d) => !d.zero && getTier(d.cost, d.packageId) === "premium"),
};

/** Drinks sem álcool */
export const ZERO_DRINKS: DrinkWithPackage[] = ALL_DRINKS.filter((d) => d.zero);

/** Drinks assinatura (autorais) */
export const SIGNATURE_DRINKS: DrinkWithPackage[] = ALL_DRINKS.filter((d) => d.signature);

/** Drinks com foto real */
export const DRINKS_WITH_REAL_PHOTO: DrinkWithPackage[] = ALL_DRINKS.filter((d) => d.image);

/** Mapeamento ID -> Drink (lookup rápido) */
export const DRINK_LOOKUP: Record<string, DrinkWithPackage> = Object.fromEntries(
  ALL_DRINKS.map((d) => [d.id, d])
);

/** Mapeamento ID -> PackageId */
export const DRINK_PACKAGE_MAP: Record<string, PackageId> = Object.fromEntries(
  ALL_DRINKS.map((d) => [d.id, d.packageId])
);

/* ------------------------------------------------------------------ */
/*  Helpers de tier (baseado no range de custos do pacote)             */
/* ------------------------------------------------------------------ */

function getTier(cost: number, packageId: PackageId): DrinkTier {
  const pkg = PACKAGES[packageId];
  const costs = pkg.drinks.filter((x) => !x.zero).map((x) => x.cost);
  const min = Math.min(...costs);
  const max = Math.max(...costs);
  if (max === min) return "assinatura";
  const t = (cost - min) / (max - min);
  return t <= 0.34 ? "economico" : t >= 0.66 ? "premium" : "assinatura";
}

/* ------------------------------------------------------------------ */
/*  Filtros úteis para UI                                              */
/* ------------------------------------------------------------------ */

export function getDrinksForPackage(packageId: PackageId): Drink[] {
  return DRINKS_BY_PACKAGE[packageId];
}

export function getDrinksByFilter(
  packageId: PackageId,
  filter: "todos" | "alcool" | "zero"
): Drink[] {
  const drinks = getDrinksForPackage(packageId);
  if (filter === "todos") return drinks;
  return drinks.filter((d) => (filter === "zero" ? d.zero : !d.zero));
}

export function getSuggestedDrinks(
  packageId: PackageId,
  essentials: string[] = []
): Drink[] {
  const drinks = getDrinksForPackage(packageId);
  return drinks
    .map((d) => ({
      ...d,
      score: calculateSuggestionScore(d, essentials),
    }))
    .sort((a, b) => b.score - a.score)
    .map(({ score, ...d }) => d);
}

function calculateSuggestionScore(drink: Drink, essentials: string[]): number {
  let score = 0;
  if (drink.signature) score += 10;
  if (drink.zero) score += 5;
  if (essentials.includes("welcome") && drink.tags.includes("espumante")) score += 8;
  if (essentials.includes("shot") && drink.cost <= 5) score += 8;
  if (essentials.includes("show") && drink.signature) score += 6;
  if (essentials.includes("mocktail") && drink.zero) score += 10;
  if (essentials.includes("personalizado") && drink.signature) score += 7;
  // Preferir meio-termo (assinatura) para equilíbrio
  const pkgId = DRINK_PACKAGE_MAP[drink.id];
  if (pkgId) {
    const tier = getTier(drink.cost, pkgId);
    if (tier === "assinatura") score += 3;
  }
  return score;
}

/* ------------------------------------------------------------------ */
/*  Formatação                                                         */
/* ------------------------------------------------------------------ */

export const fmt = new Intl.NumberFormat("pt-BR", { 
  style: "currency", 
  currency: "BRL" 
});

export const fmtNum = new Intl.NumberFormat("pt-BR", { 
  minimumFractionDigits: 2, 
  maximumFractionDigits: 2 
});

export const TIER_LABEL: Record<DrinkTier, string> = {
  economico: "Leve",
  assinatura: "Meio-termo",
  premium: "Premium",
};

export const GLASS_LABEL: Record<GlassType, string> = {
  rocks: "Rocks",
  highball: "Highball",
  martini: "Martini",
  coupe: "Coupe",
  wine: "Taça Vinho",
  flute: "Flute",
  mug: "Caneca",
  hurricane: "Hurricane",
};