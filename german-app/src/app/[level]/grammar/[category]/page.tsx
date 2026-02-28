import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getLevelData,
  getAvailableLevels,
  getGrammarCategories,
  getGrammarTopicsByCategory,
  getGrammarCategorySlugs,
} from "@/lib/data";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export function generateStaticParams() {
  const params: { level: string; category: string }[] = [];
  for (const level of getAvailableLevels()) {
    for (const category of getGrammarCategorySlugs(level)) {
      params.push({ level, category });
    }
  }
  return params;
}

export default async function GrammarCategoryPage({
  params,
}: {
  params: Promise<{ level: string; category: string }>;
}) {
  const { level, category } = await params;
  const data = getLevelData(level);
  if (!data) notFound();

  const result = getGrammarTopicsByCategory(level, category);
  if (!result) notFound();

  const { categoryName, topics } = result;

  const linkTransition =
    "transition-all duration-200 ease-out hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-500 rounded-xl";

  const breadcrumbItems = [
    { label: "Grammar", href: `/${level}/grammar` },
    { label: categoryName },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumbs items={breadcrumbItems} />

      <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
        {data.level} {categoryName}
      </h1>
      <p className="text-sm text-stone-500 dark:text-stone-400">
        Choose a topic to read
      </p>

      <ul className="space-y-3">
        {topics.map((t) => (
          <li key={t.slug}>
            <Link
              href={`/${level}/grammar/${category}/${t.slug}`}
              className={`block rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-900/30 p-4 min-h-[44px] hover:border-stone-400 dark:hover:border-stone-600 ${linkTransition} touch-manipulation`}
            >
              <h2 className="font-semibold text-stone-900 dark:text-stone-100">
                {t.title}
              </h2>
            </Link>
          </li>
        ))}
      </ul>

      <p className="pt-4 text-sm text-stone-500 dark:text-stone-400">
        <Link
          href={`/${level}/grammar`}
          className="min-h-[44px] inline-flex items-center gap-1.5 rounded px-3 py-2.5 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:underline transition-all duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-500 touch-manipulation"
        >
          ← Back to grammar categories
        </Link>
      </p>
    </div>
  );
}
