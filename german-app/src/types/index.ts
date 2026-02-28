// Word entry types (nouns, verbs, adjectives) per prompt.md

export interface NounWord {
  type: "noun";
  word: string;
  article: "der" | "die" | "das";
  plural: string;
  meaning: string;
  example_sentence: string;
  translation: string;
  category?: string;
}

export interface VerbWord {
  type: "verb";
  word: string;
  meaning: string;
  prasens_ich: string;
  prateritum: string;
  partizip_ii: string;
  example_sentence: string;
  translation: string;
  category?: string;
}

export interface AdjectiveWord {
  type: "adjective";
  word: string;
  meaning: string;
  comparative: string;
  superlative: string;
  example_sentence: string;
  translation: string;
}

export type WordEntry = NounWord | VerbWord | AdjectiveWord;

export interface GrammarExample {
  sentence: string;
  translation: string;
}

export interface GrammarTopic {
  title: string;
  explanation: string;
  structure?: string;
  examples: GrammarExample[];
  notes?: string[];
  category?: string;
}

export interface LevelData {
  level: string;
  words: WordEntry[];
  grammar: GrammarTopic[];
}

export const LEVELS = ["a1", "a2", "b1", "b2", "c1", "c2"] as const;
export type LevelSlug = (typeof LEVELS)[number];
