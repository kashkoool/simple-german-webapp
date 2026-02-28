"use client";

import { useState, useMemo } from "react";
import type { NounWord, VerbWord, AdjectiveWord } from "@/types";

type WordEntry = NounWord | VerbWord | AdjectiveWord;

function getSearchableText(entry: WordEntry): string {
  const parts = [
    entry.word,
    entry.meaning,
    entry.example_sentence,
    entry.translation,
  ];
  if (entry.type === "noun") {
    parts.push(entry.article, entry.plural);
  }
  if (entry.type === "verb") {
    parts.push(entry.prasens_ich, entry.prateritum, entry.partizip_ii);
  }
  if (entry.type === "adjective") {
    parts.push(entry.comparative, entry.superlative);
  }
  return parts.join(" ").toLowerCase();
}

function De({ children }: { children: React.ReactNode }) {
  return (
    <span lang="de" translate="no">
      {children}
    </span>
  );
}

function WordCard({ entry }: { entry: WordEntry }) {
  const base =
    "rounded-xl border p-3 sm:p-4 min-w-0 transition-all duration-200 ease-out hover:scale-[1.02] hover:shadow-lg touch-manipulation";

  if (entry.type === "noun") {
    return (
      <li
        className={`${base} border-amber-200 bg-amber-50/50 dark:border-amber-900/50 dark:bg-amber-950/20`}
      >
        <p className="text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400 mb-0.5">
          Deutsch
        </p>
        <p className="font-semibold text-stone-900 dark:text-stone-100 text-sm">
          <De>{entry.article} {entry.word}</De>
        </p>
        <p className="text-xs text-stone-500 dark:text-stone-500 mt-0.5">
          Plural: <De>{entry.plural}</De>
        </p>
        <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
          English: {entry.meaning}
        </p>
        <p className="text-xs font-medium text-stone-500 dark:text-stone-500 mt-1.5">
          Example (Deutsch)
        </p>
        <p className="text-sm italic text-stone-800 dark:text-stone-200">
          <De>{entry.example_sentence}</De>
        </p>
        <p className="text-[11px] text-stone-500 dark:text-stone-500 mt-0.5">
          {entry.translation}
        </p>
      </li>
    );
  }

  if (entry.type === "verb") {
    return (
      <li
        className={`${base} border-teal-200 bg-teal-50/50 dark:border-teal-900/50 dark:bg-teal-950/20`}
      >
        <p className="text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400 mb-0.5">
          Deutsch
        </p>
        <p className="font-semibold text-stone-900 dark:text-stone-100 text-sm">
          <De>{entry.word}</De>
        </p>
        <p className="text-[11px] text-stone-500 dark:text-stone-500 mt-0.5">
          ich: <De>{entry.prasens_ich}</De> · Prät.: <De>{entry.prateritum}</De> · Part. II: <De>{entry.partizip_ii}</De>
        </p>
        <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
          English: {entry.meaning}
        </p>
        <p className="text-xs font-medium text-stone-500 dark:text-stone-500 mt-1.5">
          Example (Deutsch)
        </p>
        <p className="text-sm italic text-stone-800 dark:text-stone-200">
          <De>{entry.example_sentence}</De>
        </p>
        <p className="text-[11px] text-stone-500 dark:text-stone-500 mt-0.5">
          {entry.translation}
        </p>
      </li>
    );
  }

  if (entry.type === "adjective") {
    return (
      <li
        className={`${base} border-violet-200 bg-violet-50/50 dark:border-violet-900/50 dark:bg-violet-950/20`}
      >
        <p className="text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400 mb-0.5">
          Deutsch
        </p>
        <p className="font-semibold text-stone-900 dark:text-stone-100 text-sm">
          <De>{entry.word}</De>
        </p>
        <p className="text-[11px] text-stone-500 dark:text-stone-500 mt-0.5">
          <De>{entry.comparative}</De>, <De>{entry.superlative}</De>
        </p>
        <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
          English: {entry.meaning}
        </p>
        <p className="text-xs font-medium text-stone-500 dark:text-stone-500 mt-1.5">
          Example (Deutsch)
        </p>
        <p className="text-sm italic text-stone-800 dark:text-stone-200">
          <De>{entry.example_sentence}</De>
        </p>
        <p className="text-[11px] text-stone-500 dark:text-stone-500 mt-0.5">
          {entry.translation}
        </p>
      </li>
    );
  }

  return null;
}

interface WordListWithSearchProps {
  words: WordEntry[];
}

export function WordListWithSearch({ words }: WordListWithSearchProps) {
  const [query, setQuery] = useState("");

  const filteredWords = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return words;
    return words.filter((entry) => getSearchableText(entry).includes(q));
  }, [words, query]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <label htmlFor="word-search" className="sr-only">
          Search words in this category
        </label>
        <input
          id="word-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by German or English..."
          className="w-full min-h-[48px] rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 py-3 pl-4 pr-12 text-base text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent transition-shadow duration-200 touch-manipulation"
          aria-describedby="search-result-count"
        />
        <span
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500"
          aria-hidden
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </span>
      </div>

      <p id="search-result-count" className="text-sm text-stone-500 dark:text-stone-400">
        {filteredWords.length} word{filteredWords.length !== 1 ? "s" : ""}
        {query.trim() ? ` matching "${query.trim()}"` : ""}
      </p>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filteredWords.map((entry) => (
          <WordCard key={`${entry.type}-${entry.word}`} entry={entry} />
        ))}
      </ul>

      {filteredWords.length === 0 && (
        <p className="text-stone-500 dark:text-stone-400 text-center py-8">
          No words match your search. Try a different term.
        </p>
      )}
    </div>
  );
}
