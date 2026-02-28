import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getLevelData,
  getAvailableLevels,
  getNounCategories,
  getVerbCategories,
  getWordsByTypeAndCategory,
  getCategorySlugsForType,
  type WordTypeSlug,
} from "@/lib/data";
import { WordListWithSearch } from "@/components/WordListWithSearch";
import { Breadcrumbs } from "@/components/Breadcrumbs";

const TYPE_LABELS: Record<WordTypeSlug, string> = {
  nouns: "Nouns",
  verbs: "Verbs",
  adjectives: "Adjectives",
};

export function generateStaticParams() {
  const params: { level: string; type: string; category: string }[] = [];
  for (const level of getAvailableLevels()) {
    for (const type of ["nouns", "verbs", "adjectives"] as const) {
      const slugs = getCategorySlugsForType(level, type);
      for (const category of slugs) {
        params.push({ level, type, category });
      }
    }
  }
  return params;
}

export default async function WordsCategoryPage({
  params,
}: {
  params: Promise<{ level: string; type: string; category: string }>;
}) {
  const { level, type, category } = await params;
  const typeSlug = type as WordTypeSlug;
  if (!["nouns", "verbs", "adjectives"].includes(type)) notFound();

  const result = getWordsByTypeAndCategory(level, typeSlug, category);
  if (!result) notFound();

  const { categoryName, words } = result;
  const data = getLevelData(level)!;

  const breadcrumbItems = [
    { label: "Words", href: `/${level}/words` },
    { label: TYPE_LABELS[typeSlug], href: `/${level}/words/${type}` },
    { label: categoryName },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumbs items={breadcrumbItems} />

      <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
        {data.level} {categoryName}
      </h1>
      <p className="text-sm text-stone-500 dark:text-stone-400">
        {words.length} word{words.length !== 1 ? "s" : ""} in this category
      </p>

      <WordListWithSearch words={words} />

      <p className="pt-4 text-sm text-stone-500 dark:text-stone-400">
        <Link
          href={`/${level}/words/${type}`}
          className="min-h-[44px] inline-flex items-center gap-1.5 rounded px-3 py-2.5 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:underline transition-all duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-500 touch-manipulation"
        >
          ← Back to {TYPE_LABELS[typeSlug]} categories
        </Link>
      </p>
    </div>
  );
}
