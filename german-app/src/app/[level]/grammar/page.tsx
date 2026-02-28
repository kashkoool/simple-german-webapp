import { notFound } from "next/navigation";
import Link from "next/link";
import { getLevelData, getAvailableLevels, getGrammarCategories } from "@/lib/data";

export function generateStaticParams() {
  return getAvailableLevels().map((level) => ({ level }));
}

export default async function GrammarPage({
  params,
}: {
  params: Promise<{ level: string }>;
}) {
  const { level } = await params;
  const data = getLevelData(level);
  if (!data) notFound();

  const categories = getGrammarCategories(level);

  const cardTransition =
    "transition-all duration-200 ease-out hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-500 rounded-xl";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
          {data.level} Grammar
        </h1>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
          Choose a category to see topics
        </p>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <li key={cat.slug}>
            <Link
              href={`/${level}/grammar/${cat.slug}`}
              className={`block rounded-xl border-2 border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-900/30 p-4 sm:p-5 min-h-[44px] hover:border-stone-400 dark:hover:border-stone-600 ${cardTransition} touch-manipulation`}
            >
              <span className="inline-block w-2 h-8 rounded-full bg-stone-500 mb-3" />
              <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                {cat.name}
              </h2>
              <p className="text-sm text-stone-600 dark:text-stone-400 mt-0.5">
                {cat.count} topic{cat.count !== 1 ? "s" : ""}
              </p>
            </Link>
          </li>
        ))}
      </ul>

      <p className="pt-4 text-sm text-stone-500 dark:text-stone-400">
        <Link
          href={`/${level}/words`}
          className="min-h-[44px] inline-flex items-center font-medium text-stone-700 dark:text-stone-300 hover:underline transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-500 rounded py-2.5 px-2 touch-manipulation"
        >
          View {data.level} vocabulary →
        </Link>
      </p>
    </div>
  );
}
