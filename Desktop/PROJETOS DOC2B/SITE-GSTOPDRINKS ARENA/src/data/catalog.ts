/* ================================================================== */
/*  GS TOP DRINKS — Catálogo Principal (Barrel Export)                 */
/*  Re-exporta tudo dos módulos especializados                         */
/* ================================================================== */

/* --------------------------- Segmentos ----------------------------- */
export * from "./segments";

/* ---------------------------- Pacotes ------------------------------ */
export * from "./packages";

/* ---------------------------- Drinks ------------------------------- */
export { 
  ALL_DRINKS, 
  DRINKS_BY_PACKAGE, 
  DRINKS_BY_TIER, 
  ZERO_DRINKS, 
  SIGNATURE_DRINKS, 
  DRINKS_WITH_REAL_PHOTO,
  DRINK_LOOKUP,
  DRINK_PACKAGE_MAP,
  getDrinksForPackage,
  getDrinksByFilter,
  getSuggestedDrinks,
  fmt,
  fmtNum,
  TIER_LABEL,
  GLASS_LABEL,
  type GlassType,
  type DrinkTier,
  type DrinkWithPackage
} from "./drinks";

/* ----------------------------- Contato ----------------------------- */
export const CONTACT = {
  instagram: "https://instagram.com/gstopdrinks",
  handle: "@gstopdrinks",
  site: "https://gstopdrinks.com.br",
  whatsapp: "5547992791968",
  phone: "(47) 99279-1968",
  email: "gstopdrinks@gmail.com",
  street: "Rua Leofredo Silva, 108",
  city: "Blumenau — SC",
};

export const waLink = (text?: string) =>
  `https://wa.me/${CONTACT.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

/* --------------------------- Curadoria Engine ---------------------- */
import { 
  type Pkg, 
  type Drink, 
  type Tier, 
  MIN_DRINKS 
} from "./packages";
import { fmt } from "./drinks";

const EPS = 0.001;

/** Faixa relativa ao próprio pacote: terço inferior = leve, superior = premium */
export function tierOf(pkg: Pkg, cost: number): Tier {
  const costs = pkg.drinks.map((x: Drink) => x.cost);
  const min = Math.min(...costs);
  const max = Math.max(...costs);
  const t = max === min ? 0.5 : (cost - min) / (max - min);
  return t <= 0.34 ? "economico" : t >= 0.66 ? "premium" : "assinatura";
}

export const drinkSum = (pkg: Pkg, ids: string[]) =>
  pkg.drinks.filter((x: Drink) => ids.includes(x.id)).reduce((acc: number, x: Drink) => acc + x.cost, 0);

export const totalPerPerson = (pkg: Pkg, ids: string[]) => pkg.base + drinkSum(pkg, ids);

export type Suggestion =
  | { kind: "swap"; out: Drink; into: Drink; reason: string }
  | { kind: "remove"; out: Drink; reason: string };

export interface Curadoria {
  over: boolean;
  mixed: boolean;
  fits: boolean;
  total: number;
  suggestions: Suggestion[];
  resultIds: string[];
}

/**
 * Curadoria GS — equilibra a carta:
 *  • acima do teto → troca os extremos por drinks de meio-termo até caber no plano;
 *  • extremos misturados (premium + leve) → sugere aproximar ambos do meio-termo.
 *  `lockedId` protege o drink que o cliente acabou de escolher.
 */
export function buildCuradoria(pkg: Pkg, selectedIds: string[], lockedId?: string): Curadoria {
  const budget = pkg.ceiling - pkg.base;
  const current = pkg.drinks.filter((x: Drink) => selectedIds.includes(x.id));
  const sum0 = current.reduce((a: number, x: Drink) => a + x.cost, 0);
  const over = sum0 > budget + EPS;
  const alcoholTiers = current.filter((x: Drink) => !x.zero).map((x: Drink) => tierOf(pkg, x.cost));
  const mixed =
    !over && current.length >= MIN_DRINKS && alcoholTiers.includes("premium") && alcoholTiers.includes("economico");

  const inSet = new Set(selectedIds);
  const suggestions: Suggestion[] = [];
  let sum = sum0;

  const shared = (a: Drink, b: Drink) => a.tags.filter((t) => b.tags.includes(t)).length;
  const commonTag = (a: Drink, b: Drink) => a.tags.find((t) => b.tags.includes(t));

  const pick = (target: Drink, dir: "down" | "up", midOnly: boolean, maxCost = Infinity) =>
    pkg.drinks
      .filter(
        (c: Drink) =>
          !inSet.has(c.id) &&
          c.zero === target.zero &&
          (dir === "down" ? c.cost < target.cost : c.cost > target.cost && c.cost <= maxCost + EPS) &&
          (!midOnly || tierOf(pkg, c.cost) === "assinatura")
      )
      .sort((a: Drink, b: Drink) => shared(b, target) - shared(a, target) || (dir === "down" ? b.cost - a.cost : a.cost - b.cost))[0];

  const swap = (out: Drink, into: Drink, reason: string) => {
    suggestions.push({ kind: "swap", out, into, reason });
    inSet.delete(out.id);
    inSet.add(into.id);
    sum += into.cost - out.cost;
  };

  if (over) {
    const ordered = [...current].sort(
      (a: Drink, b: Drink) => Number(a.id === lockedId) - Number(b.id === lockedId) || b.cost - a.cost
    );
    for (const item of ordered) {
      if (sum <= budget + EPS) break;
      const into = pick(item, "down", true) ?? pick(item, "down", false);
      if (!into) continue;
      const tag = commonTag(item, into);
      const mid = tierOf(pkg, into.cost) === "assinatura";
      const why = tag ? `mantém o perfil ${tag}` : mid ? "troca pelo meio-termo" : "alternativa mais leve";
      swap(item, into, `${why} · −${fmt.format(item.cost - into.cost)} por pessoa`);
    }
    while (sum > budget + EPS && inSet.size > MIN_DRINKS) {
      const r = pkg.drinks.filter((x: Drink) => inSet.has(x.id) && x.id !== lockedId).sort((a: Drink, b: Drink) => b.cost - a.cost)[0];
      if (!r) break;
      const idx = suggestions.findIndex((s) => s.kind === "swap" && s.into.id === r.id);
      if (idx >= 0) {
        suggestions[idx] = { kind: "remove", out: suggestions[idx].out, reason: "libera espaço no teto do plano" };
      } else {
        suggestions.push({ kind: "remove", out: r, reason: "libera espaço no teto do plano" });
      }
      inSet.delete(r.id);
      sum -= r.cost;
    }
  } else if (mixed) {
    const premiums = current
      .filter((x: Drink) => !x.zero && tierOf(pkg, x.cost) === "premium")
      .sort((a: Drink, b: Drink) => b.cost - a.cost)
      .slice(0, 2);
    for (const p of premiums) {
      const into = pick(p, "down", true);
      if (into) swap(p, into, `desce ao meio-termo (${fmt.format(p.cost)} → ${fmt.format(into.cost)})`);
    }
    const cheap = current
      .filter((x: Drink) => !x.zero && tierOf(pkg, x.cost) === "economico")
      .sort((a: Drink, b: Drink) => a.cost - b.cost)
      .slice(0, 2);
    for (const c of cheap) {
      const into = pick(c, "up", true, c.cost + (budget - sum));
      if (into) swap(c, into, `sobe ao meio-termo e equilibra a carta (+${fmt.format(into.cost - c.cost)})`);
    }
  }

  return {
    over,
    mixed,
    fits: sum <= budget + EPS,
    total: pkg.base + sum,
    suggestions,
    resultIds: pkg.drinks.filter((x: Drink) => inSet.has(x.id)).map((x: Drink) => x.id),
  };
}

/** Carta inicial: drink assinatura + meio-termo + 1 sem álcool, sempre dentro do plano */
export function seedSelection(pkg: Pkg): string[] {
  const budget = pkg.ceiling - pkg.base;
  const rank = (x: Drink) => (x.signature ? 0 : tierOf(pkg, x.cost) === "assinatura" ? 1 : 2);
  const ordered = pkg.drinks.filter((x: Drink) => !x.zero).sort((a: Drink, b: Drink) => rank(a) - rank(b) || a.cost - b.cost);
  const out: string[] = [];
  let acc = 0;
  for (const x of ordered) {
    if (out.length >= 3) break;
    if (acc + x.cost <= budget) {
      out.push(x.id);
      acc += x.cost;
    }
  }
  const zero = pkg.drinks.find((x: Drink) => x.zero);
  if (zero && acc + zero.cost <= budget) out.push(zero.id);
  return out;
}

export function buildProposalMessage(p: {
  segment: { name: string };
  guests: { short: string; estimate: number; staff: string };
  pkg: Pkg;
  drinks: Drink[];
  perPerson: number;
  total: number;
}) {
  return [
    "Olá, GS Top Drinks! Montei meu evento no simulador do site:",
    "",
    `• Evento: ${p.segment.name}`,
    `• Convidados: ${p.guests.short}`,
    `• Pacote: ${p.pkg.name}`,
    `• Carta: ${p.drinks.map((x: Drink) => x.name).join(", ")}`,
    `• Estimativa: ${fmt.format(p.perPerson)} por pessoa (≈ ${fmt.format(p.total)} no total)`,
    "",
    "Gostaria de receber a proposta oficial.",
  ].join("\n");
}

/* --------------------------- Constantes Globais -------------------- */
export { MIN_DRINKS, MAX_DRINKS } from "./packages";
export { BRAND_THEME } from "./segments";
export { SEGMENT_ORDER } from "./segments";
export { PACKAGE_ORDER } from "./packages";
export type { Theme } from "./segments";