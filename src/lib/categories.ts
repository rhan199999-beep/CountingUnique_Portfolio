/**
 * Category vocabulary for the video library.
 *
 * Categories are derived from each upload's title with a small keyword
 * heuristic — no invented metadata. Every video always resolves to at
 * least one category so the filters never produce an empty grid.
 */

export type CategorySlug =
  | "experiments"
  | "travel"
  | "food"
  | "money"
  | "reality"
  | "shorts"
  | "vlogs";

export type Category = {
  slug: CategorySlug;
  label: string;
  /** Sticker chip colours (Tailwind classes). */
  chip: string;
};

export const CATEGORIES: readonly Category[] = [
  { slug: "experiments", label: "Experiments", chip: "bg-brand text-white" },
  { slug: "travel", label: "Travel", chip: "bg-sky text-ink" },
  { slug: "food", label: "Food", chip: "bg-action text-ink" },
  { slug: "money", label: "Money", chip: "bg-white text-ink" },
  { slug: "reality", label: "Reality checks", chip: "bg-ink text-white" },
  { slug: "shorts", label: "Shorts", chip: "bg-sky text-ink" },
  { slug: "vlogs", label: "Vlogs", chip: "bg-white text-ink" },
] as const;

const RULES: Record<CategorySlug, RegExp> = {
  experiments:
    /\b(try|tried|tries|test|tested|testing|challenge|experiment|experiments|24\s?(hours|hrs)|survive|survived|secret|insane|left hand)\b/i,
  travel:
    /\b(travel|travelled|traveled|trip|railway|train|flight|airport|hotel|city|cities|road|stayed|longest|tour)\b/i,
  food:
    /\b(food|eat|eating|ate|restaurant|cafe|street food|biryani|kitchen|cook|cooked|recipe|snack|taste|tasty|chef)\b/i,
  money:
    /\b(cheap|cheapest|expensive|price|priced|buy|bought|budget|duplicate|money|rich|poor|spend|spent|rupees?|lakh|crore|salary)\b/i,
  reality:
    /\b(reality|real|fake|scam|truth|exposed|expose|disappearing|magic|checking|myth|genuine)\b/i,
  shorts: /\b(shorts?|reels?|vertical)\b/i,
  vlogs: /\b(vlog|vlogs|day in|behind the scenes|routine)\b/i,
};

export function categoriesFor(
  title: string,
  channel: "cu" | "pg" = "cu"
): CategorySlug[] {
  const text = title ?? "";
  const hits = (Object.keys(RULES) as CategorySlug[]).filter((slug) =>
    RULES[slug].test(text)
  );
  if (channel === "pg" && !hits.includes("shorts")) hits.push("shorts");
  if (hits.length > 0) return hits;
  return channel === "pg" ? ["shorts"] : ["experiments"];
}

export function primaryCategory(
  title: string,
  channel: "cu" | "pg" = "cu"
): CategorySlug {
  return categoriesFor(title, channel)[0];
}

export function categoryBySlug(slug: CategorySlug): Category {
  return CATEGORIES.find((c) => c.slug === slug) ?? CATEGORIES[0];
}
