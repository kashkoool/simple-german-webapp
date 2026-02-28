import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getLevelData,
  getAvailableLevels,
  getGrammarTopic,
  getGrammarTopicSlugs,
} from "@/lib/data";
import { Breadcrumbs } from "@/components/Breadcrumbs";

/** German text: lang="de" and translate="no" so browsers don't auto-translate */
function De({ children }: { children: React.ReactNode }) {
  return (
    <span lang="de" translate="no">
      {children}
    </span>
  );
}

export function generateStaticParams() {
  const params: { level: string; category: string; topic: string }[] = [];
  for (const level of getAvailableLevels()) {
    for (const { category, topic } of getGrammarTopicSlugs(level)) {
      params.push({ level, category, topic });
    }
  }
  return params;
}

export default async function GrammarTopicPage({
  params,
}: {
  params: Promise<{ level: string; category: string; topic: string }>;
}) {
  const { level, category, topic } = await params;
  const data = getLevelData(level);
  if (!data) notFound();

  const result = getGrammarTopic(level, category, topic);
  if (!result) notFound();

  const { categoryName, topic: topicData } = result;

  const breadcrumbItems = [
    { label: "Grammar", href: `/${level}/grammar` },
    { label: categoryName, href: `/${level}/grammar/${category}` },
    { label: topicData.title },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumbs items={breadcrumbItems} />

      <article className="rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-900/30 p-5 shadow-sm transition-all duration-200 hover:shadow-lg">
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
          {topicData.title}
        </h1>
        <p className="mt-2 text-stone-700 dark:text-stone-300 text-sm leading-relaxed">
          {topicData.explanation}
        </p>
        {topicData.structure && (
          <p className="mt-3 text-sm font-mono text-stone-600 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 px-3 py-2 rounded-lg">
            {topicData.structure}
          </p>
        )}
        {topicData.examples.length > 0 && (
          <div className="mt-4">
            <span className="text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
              Beispiele (Examples)
            </span>
            <ul className="mt-2 space-y-3">
              {topicData.examples.map((ex, i) => (
                <li
                  key={i}
                  className="flex flex-col gap-0.5 rounded-lg bg-white dark:bg-stone-800/50 p-3 border border-stone-100 dark:border-stone-700"
                >
                  <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
                    Deutsch
                  </span>
                  <p className="text-base font-medium text-stone-900 dark:text-stone-100">
                    <De>{ex.sentence}</De>
                  </p>
                  <span className="text-xs font-medium text-stone-500 dark:text-stone-400 mt-1">
                    English
                  </span>
                  <p className="text-sm text-stone-600 dark:text-stone-400">
                    {ex.translation}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
        {topicData.notes && topicData.notes.length > 0 && (
          <div className="mt-4 pt-3 border-t border-stone-200 dark:border-stone-700">
            <span className="text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
              Notes
            </span>
            <ul className="mt-1.5 space-y-1 text-sm text-stone-600 dark:text-stone-400 list-disc list-inside">
              {topicData.notes.map((note, i) => (
                <li key={i}>{note}</li>
              ))}
            </ul>
          </div>
        )}
      </article>

      <p className="pt-4 text-sm text-stone-500 dark:text-stone-400">
        <Link
          href={`/${level}/grammar/${category}`}
          className="min-h-[44px] inline-flex items-center gap-1.5 rounded px-3 py-2.5 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:underline transition-all duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-500 touch-manipulation"
        >
          ← Back to {categoryName}
        </Link>
      </p>
    </div>
  );
}
