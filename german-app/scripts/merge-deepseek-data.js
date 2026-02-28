/**
 * Compare deepseek_json_20260228_f3ba95.json with german-app/data (a1.json, de-en-meanings.json).
 * - Ensure a1.json has all words from deepseek
 * - Update a1 entries with deepseek's translations, meanings, example_sentences
 * - Add any missing words from deepseek to a1
 * - Update de-en-meanings.json with all word -> meaning from merged data
 */

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..", "..");
const deepseekPath = path.join(root, "deepseek_json_20260228_f3ba95.json");
const a1Path = path.join(__dirname, "..", "data", "a1.json");
const meaningsPath = path.join(__dirname, "..", "data", "de-en-meanings.json");

const deepseek = JSON.parse(fs.readFileSync(deepseekPath, "utf8"));
const a1 = JSON.parse(fs.readFileSync(a1Path, "utf8"));
let meanings = {};
try {
  meanings = JSON.parse(fs.readFileSync(meaningsPath, "utf8"));
} catch (_) {}

function key(entry) {
  const t = (entry.type || "").trim();
  const w = (entry.word || "").trim();
  return `${t}|${w}`;
}

const deepseekWords = deepseek.words || [];
const a1ByKey = new Map();
for (const e of a1.words) {
  a1ByKey.set(key(e), e);
}

const mergedWords = [];
const seen = new Set();

// First: add/update from deepseek (source of full translations)
for (const de of deepseekWords) {
  const k = key(de);
  seen.add(k);
  const existing = a1ByKey.get(k);
  if (existing) {
    // Update existing with deepseek's meaning, translation, example_sentence (and other fields if present)
    existing.meaning = de.meaning != null ? de.meaning : existing.meaning;
    existing.example_sentence = de.example_sentence != null ? de.example_sentence : existing.example_sentence;
    existing.translation = de.translation != null ? de.translation : existing.translation;
    if (de.type === "noun" && de.article != null) existing.article = de.article;
    if (de.type === "noun" && de.plural != null) existing.plural = de.plural;
    if (de.type === "verb" && de.prasens_ich != null) existing.prasens_ich = de.prasens_ich;
    if (de.type === "verb" && de.prateritum != null) existing.prateritum = de.prateritum;
    if (de.type === "verb" && de.partizip_ii != null) existing.partizip_ii = de.partizip_ii;
    if (de.category != null) existing.category = de.category;
    if (de.comparative != null) existing.comparative = de.comparative;
    if (de.superlative != null) existing.superlative = de.superlative;
    mergedWords.push(existing);
  } else {
    mergedWords.push({ ...de });
  }
}

// Second: add words that are in a1 but not in deepseek
for (const e of a1.words) {
  const k = key(e);
  if (!seen.has(k)) {
    mergedWords.push(e);
    seen.add(k);
  }
}

a1.words = mergedWords;
fs.writeFileSync(a1Path, JSON.stringify(a1, null, 2), "utf8");
console.log("Merged words: total", mergedWords.length, "(deepseek:", deepseekWords.length, ", a1 had", a1.words.length, "before)");

// Update de-en-meanings: word -> meaning for every word in merged list
for (const e of mergedWords) {
  const w = (e.word || "").trim();
  if (!w) continue;
  const m = (e.meaning || "").trim();
  if (m) meanings[w] = m;
}
fs.writeFileSync(meaningsPath, JSON.stringify(meanings, null, 2), "utf8");
console.log("Updated de-en-meanings.json with", Object.keys(meanings).length, "entries.");
