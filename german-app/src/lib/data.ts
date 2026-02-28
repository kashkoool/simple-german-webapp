import type { LevelData, NounWord, VerbWord, AdjectiveWord, GrammarTopic } from "@/types";
// Explicit imports for static export (no dynamic paths)
import a1Data from "../../data/a1.json";

const levelDataMap: Record<string, LevelData> = {
  a1: a1Data as LevelData,
};

export const AVAILABLE_LEVELS = ["a1"] as const;

export const WORD_TYPES = ["nouns", "verbs", "adjectives"] as const;
export type WordTypeSlug = (typeof WORD_TYPES)[number];

/** "Food & drink" → "food-drink" */
export function categoryToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s*&\s*/g, "-")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

/** "food-drink" → "Food & drink" (we store display name in data, so we match by slug) */
export function slugToCategoryName(slug: string, names: string[]): string | null {
  const lower = slug.toLowerCase();
  for (const name of names) {
    if (categoryToSlug(name) === lower) return name;
  }
  return null;
}

export function getLevelData(level: string): LevelData | null {
  const normalized = level.toLowerCase();
  return levelDataMap[normalized] ?? null;
}

export function getAvailableLevels(): string[] {
  return [...AVAILABLE_LEVELS];
}

function groupByCategory<T extends { category?: string }>(items: T[]) {
  const map = new Map<string, T[]>();
  for (const item of items) {
    const cat = item.category?.trim() || "Other";
    const list = map.get(cat) ?? [];
    list.push(item);
    map.set(cat, list);
  }
  return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
}

export function getNounCategories(level: string): { name: string; slug: string; count: number }[] {
  const data = getLevelData(level);
  if (!data) return [];
  const nouns = data.words.filter((w): w is NounWord => w.type === "noun");
  const groups = groupByCategory(nouns);
  return groups.map(([name, items]) => ({
    name,
    slug: categoryToSlug(name),
    count: items.length,
  }));
}

export function getVerbCategories(level: string): { name: string; slug: string; count: number }[] {
  const data = getLevelData(level);
  if (!data) return [];
  const verbs = data.words.filter((w): w is VerbWord => w.type === "verb");
  const groups = groupByCategory(verbs);
  return groups.map(([name, items]) => ({
    name,
    slug: categoryToSlug(name),
    count: items.length,
  }));
}

export function getWordsByTypeAndCategory(
  level: string,
  type: WordTypeSlug,
  categorySlug: string
): { categoryName: string; words: (NounWord | VerbWord | AdjectiveWord)[] } | null {
  const data = getLevelData(level);
  if (!data) return null;

  if (type === "nouns") {
    const nouns = data.words.filter((w): w is NounWord => w.type === "noun");
    const categories = getNounCategories(level);
    const categoryName = slugToCategoryName(categorySlug, categories.map((c) => c.name));
    if (!categoryName) return null;
    const words = nouns.filter((w) => (w.category || "Other") === categoryName);
    return { categoryName, words };
  }

  if (type === "verbs") {
    const verbs = data.words.filter((w): w is VerbWord => w.type === "verb");
    const categories = getVerbCategories(level);
    const categoryName = slugToCategoryName(categorySlug, categories.map((c) => c.name));
    if (!categoryName) return null;
    const words = verbs.filter((w) => (w.category || "Other") === categoryName);
    return { categoryName, words };
  }

  if (type === "adjectives") {
    const adjectives = data.words.filter((w): w is AdjectiveWord => w.type === "adjective");
    if (categorySlug !== "all") return null;
    return { categoryName: "Adjectives", words: adjectives };
  }

  return null;
}

export function getCategorySlugsForType(level: string, type: WordTypeSlug): string[] {
  if (type === "nouns") return getNounCategories(level).map((c) => c.slug);
  if (type === "verbs") return getVerbCategories(level).map((c) => c.slug);
  if (type === "adjectives") return ["all"];
  return [];
}

/** "Present Tense (Präsens)" → "present-tense" */
function grammarTitleToSlug(title: string): string {
  return title
    .replace(/\s*\([^)]*\)\s*/g, " ")
    .replace(/\s*:.*$/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

/** Topics in a category with unique slugs (collisions get -2, -3, etc.) */
function getTopicsInCategoryWithUniqueSlugs(
  grammar: GrammarTopic[],
  categoryName: string
): { topic: GrammarTopic; slug: string }[] {
  const list = grammar.filter((t) => (t.category || "Other") === categoryName);
  const seen = new Map<string, number>();
  return list.map((topic) => {
    const base = grammarTitleToSlug(topic.title);
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    const slug = count === 0 ? base : `${base}-${count + 1}`;
    return { topic, slug };
  });
}

export function getGrammarCategories(level: string): { name: string; slug: string; count: number }[] {
  const data = getLevelData(level);
  if (!data) return [];
  const groups = groupByCategory(data.grammar);
  return groups.map(([name, items]) => ({
    name,
    slug: categoryToSlug(name),
    count: items.length,
  }));
}

export function getGrammarTopicsByCategory(
  level: string,
  categorySlug: string
): { categoryName: string; topics: { title: string; slug: string }[] } | null {
  const data = getLevelData(level);
  if (!data) return null;
  const categories = getGrammarCategories(level);
  const categoryName = slugToCategoryName(categorySlug, categories.map((c) => c.name));
  if (!categoryName) return null;
  const withSlugs = getTopicsInCategoryWithUniqueSlugs(data.grammar, categoryName);
  return {
    categoryName,
    topics: withSlugs.map(({ topic, slug }) => ({ title: topic.title, slug })),
  };
}

export function getGrammarTopic(
  level: string,
  categorySlug: string,
  topicSlug: string
): { categoryName: string; topic: GrammarTopic } | null {
  const data = getLevelData(level);
  if (!data) return null;
  const categories = getGrammarCategories(level);
  const categoryName = slugToCategoryName(categorySlug, categories.map((c) => c.name));
  if (!categoryName) return null;
  const withSlugs = getTopicsInCategoryWithUniqueSlugs(data.grammar, categoryName);
  const pair = withSlugs.find(({ slug }) => slug === topicSlug);
  if (!pair) return null;
  return { categoryName, topic: pair.topic };
}

export function getGrammarCategorySlugs(level: string): string[] {
  return getGrammarCategories(level).map((c) => c.slug);
}

/** All (categorySlug, topicSlug) pairs for generateStaticParams */
export function getGrammarTopicSlugs(level: string): { category: string; topic: string }[] {
  const data = getLevelData(level);
  if (!data) return [];
  const categories = getGrammarCategories(level);
  const out: { category: string; topic: string }[] = [];
  for (const cat of categories) {
    const withSlugs = getTopicsInCategoryWithUniqueSlugs(data.grammar, cat.name);
    for (const { slug } of withSlugs) {
      out.push({ category: cat.slug, topic: slug });
    }
  }
  return out;
}
