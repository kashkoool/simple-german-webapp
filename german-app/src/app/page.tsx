import Link from "next/link";
import { getAvailableLevels } from "@/lib/data";

export default function Home() {
  const levels = getAvailableLevels();

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col items-center justify-center px-4 sm:px-6 py-6 bg-stone-50 dark:bg-stone-950">
      <div className="max-w-md w-full text-center animate-in fade-in slide-in-from-bottom-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 mb-2">
          German Learning App
        </h1>
        <p className="text-base sm:text-lg text-stone-600 dark:text-stone-400 mb-6 sm:mb-8">
          Vocabulary and grammar by CEFR level. Choose a level to start.
          <span className="block mt-1 text-stone-500 dark:text-stone-500 text-sm sm:text-base">by Kashkool</span>
        </p>
        <nav className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {levels.map((level) => (
            <Link
              key={level}
              href={`/${level}/words`}
              className="min-h-[48px] inline-flex items-center justify-center px-6 py-3 rounded-xl text-base font-medium bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 hover:scale-105 hover:shadow-lg active:scale-[0.98] transition-all duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-500 touch-manipulation"
            >
              {level.toUpperCase()}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
