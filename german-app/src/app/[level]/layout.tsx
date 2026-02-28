import Link from "next/link";
import { getAvailableLevels } from "@/lib/data";

export function generateStaticParams() {
  return getAvailableLevels().map((level) => ({ level }));
}

export default async function LevelLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ level: string }>;
}) {
  const levels = getAvailableLevels();
  const { level } = await params;

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950 min-h-[100dvh]">
      <header className="border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/80 sticky top-0 z-10 pt-[env(safe-area-inset-top,0)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <Link
              href="/"
              className="text-lg font-semibold text-stone-900 dark:text-stone-100 hover:underline transition-colors duration-200 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-500 rounded min-h-[44px] inline-flex items-center py-2"
            >
              German Learning
            </Link>
            <nav className="flex items-center gap-2 flex-wrap">
              {levels.map((l) => (
                <LevelLink key={l} slug={l} current={l === level} />
              ))}
            </nav>
          </div>
          <div className="flex gap-2 sm:gap-4 mt-3 pt-3 border-t border-stone-100 dark:border-stone-800">
            <SubNav level={level} />
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-4 sm:py-6 pb-[calc(1.5rem+env(safe-area-inset-bottom,0))] animate-in fade-in slide-in-from-bottom-4">{children}</main>
    </div>
  );
}

function LevelLink({ slug, current }: { slug: string; current?: boolean }) {
  const label = slug.toUpperCase();
  return (
    <Link
      href={`/${slug}/words`}
      className={`min-h-[44px] inline-flex items-center px-4 py-2.5 sm:px-3 sm:py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 ease-out hover:scale-105 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-500 ${
        current
          ? "bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900"
          : "bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700"
      }`}
    >
      {label}
    </Link>
  );
}

function SubNav({ level }: { level: string }) {
  const linkClass =
    "min-h-[44px] inline-flex items-center py-2.5 px-3 text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors duration-200 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-500 rounded";
  return (
    <>
      <Link href={`/${level}/words`} className={linkClass}>
        Words
      </Link>
      <Link href={`/${level}/grammar`} className={linkClass}>
        Grammar
      </Link>
    </>
  );
}
