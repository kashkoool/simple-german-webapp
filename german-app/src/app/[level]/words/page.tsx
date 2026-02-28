import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getLevelData,
  getAvailableLevels,
  getNounCategories,
  getVerbCategories,
} from "@/lib/data";

export function generateStaticParams() {
  return getAvailableLevels().map((level) => ({ level }));
}

export default async function WordsPage({
  params,
}: {
  params: Promise<{ level: string }>;
}) {
  const { level } = await params;
  const data = getLevelData(level);
  if (!data) notFound();

  const nounCats = getNounCategories(level);
  const verbCats = getVerbCategories(level);
  const adjectiveCount = data.words.filter((w) => w.type === "adjective").length;

  const cardTransition =
    "transition-all duration-200 ease-out hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-500 rounded-xl";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
          {data.level} Vocabulary
        </h1>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
          {data.words.length} words · Choose a word type to see categories
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <Link
          href={`/${level}/words/nouns`}
          className={`group rounded-xl border-2 border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/30 p-4 sm:p-5 min-h-[44px] hover:border-amber-400 dark:hover:border-amber-600 ${cardTransition} touch-manipulation`}
        >
          <span className="inline-block w-2 h-8 rounded-full bg-amber-500 mb-3 transition-transform duration-200 group-hover:scale-110" />
          <h2 className="text-lg font-semibold text-amber-900 dark:text-amber-100">
            Nouns
          </h2>
          <p className="text-sm text-stone-600 dark:text-stone-400 mt-0.5">
            {nounCats.length} categories · {nounCats.reduce((s, c) => s + c.count, 0)} words
          </p>
        </Link>

        <Link
          href={`/${level}/words/verbs`}
          className={`group rounded-xl border-2 border-teal-200 dark:border-teal-800 bg-teal-50/50 dark:bg-teal-950/30 p-4 sm:p-5 min-h-[44px] hover:border-teal-400 dark:hover:border-teal-600 ${cardTransition} touch-manipulation`}
        >
          <span className="inline-block w-2 h-8 rounded-full bg-teal-500 mb-3 transition-transform duration-200 group-hover:scale-110" />
          <h2 className="text-lg font-semibold text-teal-900 dark:text-teal-100">
            Verbs
          </h2>
          <p className="text-sm text-stone-600 dark:text-stone-400 mt-0.5">
            {verbCats.length} categories · {verbCats.reduce((s, c) => s + c.count, 0)} words
          </p>
        </Link>

        <Link
          href={`/${level}/words/adjectives`}
          className={`group rounded-xl border-2 border-violet-200 dark:border-violet-800 bg-violet-50/50 dark:bg-violet-950/30 p-4 sm:p-5 min-h-[44px] hover:border-violet-400 dark:hover:border-violet-600 ${cardTransition} touch-manipulation`}
        >
          <span className="inline-block w-2 h-8 rounded-full bg-violet-500 mb-3 transition-transform duration-200 group-hover:scale-110" />
          <h2 className="text-lg font-semibold text-violet-900 dark:text-violet-100">
            Adjectives
          </h2>
          <p className="text-sm text-stone-600 dark:text-stone-400 mt-0.5">
            {adjectiveCount} words
          </p>
        </Link>
      </div>

      <p className="pt-4 text-sm text-stone-500 dark:text-stone-400">
        <Link
          href={`/${level}/grammar`}
          className="min-h-[44px] inline-flex items-center font-medium text-stone-700 dark:text-stone-300 hover:underline transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-500 rounded py-2.5 px-2 touch-manipulation"
        >
          View {data.level} grammar →
        </Link>
      </p>
    </div>
  );
}
