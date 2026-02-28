import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getLevelData,
  getAvailableLevels,
  getNounCategories,
  getVerbCategories,
  type WordTypeSlug,
} from "@/lib/data";
import { Breadcrumbs } from "@/components/Breadcrumbs";

const TYPE_LABELS: Record<WordTypeSlug, string> = {
  nouns: "Nouns",
  verbs: "Verbs",
  adjectives: "Adjectives",
};

const TYPE_STYLES: Record<
  WordTypeSlug,
  { border: string; bg: string; dot: string; title: string }
> = {
  nouns: {
    border: "border-amber-200 dark:border-amber-800 hover:border-amber-400",
    bg: "bg-amber-50/50 dark:bg-amber-950/30",
    dot: "bg-amber-500",
    title: "text-amber-900 dark:text-amber-100",
  },
  verbs: {
    border: "border-teal-200 dark:border-teal-800 hover:border-teal-400",
    bg: "bg-teal-50/50 dark:bg-teal-950/30",
    dot: "bg-teal-500",
    title: "text-teal-900 dark:text-teal-100",
  },
  adjectives: {
    border: "border-violet-200 dark:border-violet-800 hover:border-violet-400",
    bg: "bg-violet-50/50 dark:bg-violet-950/30",
    dot: "bg-violet-500",
    title: "text-violet-900 dark:text-violet-100",
  },
};

export function generateStaticParams() {
  const levels = getAvailableLevels();
  const params: { level: string; type: string }[] = [];
  for (const level of levels) {
    for (const type of ["nouns", "verbs", "adjectives"] as const) {
      params.push({ level, type });
    }
  }
  return params;
}

export default async function WordsTypePage({
  params,
}: {
  params: Promise<{ level: string; type: string }>;
}) {
  const { level, type } = await params;
  const typeSlug = type as WordTypeSlug;
  if (!["nouns", "verbs", "adjectives"].includes(type)) notFound();

  const data = getLevelData(level);
  if (!data) notFound();

  const nounCats = getNounCategories(level);
  const verbCats = getVerbCategories(level);
  const adjectiveCount = data.words.filter((w) => w.type === "adjective").length;

  const categories =
    typeSlug === "nouns"
      ? nounCats
      : typeSlug === "verbs"
        ? verbCats
        : [{ name: "All adjectives", slug: "all", count: adjectiveCount }];

  const style = TYPE_STYLES[typeSlug];

  const cardTransition =
    "transition-all duration-200 ease-out hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-500 rounded-xl";

  const breadcrumbItems = [
    { label: "Words", href: `/${level}/words` },
    { label: TYPE_LABELS[typeSlug] },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumbs items={breadcrumbItems} />

      <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
        {data.level} {TYPE_LABELS[typeSlug]}
      </h1>
      <p className="text-sm text-stone-500 dark:text-stone-400">
        Choose a category to see the words
      </p>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {categories.map((cat) => (
          <li key={cat.slug}>
            <Link
              href={`/${level}/words/${type}/${cat.slug}`}
              className={`block rounded-xl border-2 ${style.border} ${style.bg} p-4 min-h-[44px] ${cardTransition} touch-manipulation`}
            >
              <span className={`inline-block w-1.5 h-5 rounded-full ${style.dot} mb-2`} />
              <h2 className={`font-semibold ${style.title}`}>{cat.name}</h2>
              <p className="text-sm text-stone-600 dark:text-stone-400 mt-0.5">
                {cat.count} word{cat.count !== 1 ? "s" : ""}
              </p>
            </Link>
          </li>
        ))}
      </ul>

      <p className="pt-2 text-sm text-stone-500 dark:text-stone-400">
        <Link
          href={`/${level}/words`}
          className="min-h-[44px] inline-flex items-center gap-1.5 rounded px-3 py-2.5 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:underline transition-all duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-500 touch-manipulation"
        >
          ← Back to word types
        </Link>
      </p>
    </div>
  );
}
