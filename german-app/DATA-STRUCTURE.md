# Data structure and how to add future levels (A2, B1, …)

This document describes how level data is built, how translation is done, and how to add new levels. **All content is entered manually; no merge or generation scripts are used** for production data.

---

## Is the app safe to make public?

**Yes.** The app is safe to publish (e.g. on Vercel) because:

- **Read-only:** There are no API routes, forms, or logins. Users only view vocabulary and grammar. They cannot create, edit, or delete content.
- **Static:** The site is built with `output: "export"`. All pages and data are generated at build time. No server or database runs in production.
- **No secrets:** The JSON files do not contain API keys or passwords. No user data is stored.
- **Security headers:** When deployed on Vercel, `vercel.json` sets headers such as `X-Frame-Options`, `X-Content-Type-Options`, and `Referrer-Policy`.

Only people with **repository and deploy access** can change the data; changing content requires editing the JSON files and redeploying.

---

## How the data is built

### One JSON file per level

- **Path:** `data/<level>.json` (e.g. `data/a1.json`, later `data/a2.json`, `data/b1.json`).
- **Shape:** Each file is a single object with:
  - `level`: string (e.g. `"A1"`, `"A2"`).
  - `words`: array of word objects (nouns, verbs, adjectives).
  - `grammar`: array of grammar topic objects.

The app expects this structure (see `src/types/index.ts` and `src/lib/data.ts`). New levels (A2, B1, …) follow the same structure.

### Words

- **Nouns:** `type`, `word`, `article`, `plural`, `meaning`, `example_sentence`, `translation`, optional `category`.
- **Verbs:** `type`, `word`, `meaning`, `prasens_ich`, `prateritum`, `partizip_ii`, `example_sentence`, `translation`, optional `category`.
- **Adjectives:** `type`, `word`, `meaning`, `comparative`, `superlative`, `example_sentence`, `translation`, optional `category`.

All of this is **manually entered or pasted** into the JSON. No script is used to merge or generate words from external files.

### Grammar

- **Fields:** `title`, `explanation`, optional `structure`, `examples` (array of `{ sentence, translation }`), optional `notes` (array of strings), optional `category`.

Grammar content is **manually entered**. If you have a source (e.g. another JSON or document), you **compare** it with the app’s JSON and **copy or type** the explanations, structure, examples, and notes by hand into `data/<level>.json`. Do not use a script to merge grammar from another file into the app data.

---

## How translation is done

- **English meanings and translations** (e.g. `meaning`, `translation`, `explanation`, grammar `translations`) are **written or pasted manually** into the JSON.
- **No automatic translation:** The app does not call an API or script to translate. All German → English content is human-authored (or prepared elsewhere and then entered by hand).
- **Quality:** Because everything is manual, you can control level, style, and consistency for each level (A1, A2, B1, …).

---

## Adding a new level (e.g. A2 or B1)

1. **Create the file:** Add `data/a2.json` (or `data/b1.json`, etc.) in the same folder as `data/a1.json`.
2. **Use the same structure:** Copy the shape of `a1.json`: `level`, `words`, `grammar`. Reuse the same field names and types (see `src/types/index.ts`).
3. **Fill content by hand:** Add words and grammar for the new level. Use the master prompt (e.g. `prompt.md`) as a guide for the format; do not merge from another file with a script.
4. **Register the level in the app:** In `src/lib/data.ts`, import the new file and add it to `levelDataMap` and `AVAILABLE_LEVELS` so the app shows the new level in the UI and routing.

Example for A2:

```ts
import a1Data from "../../data/a1.json";
import a2Data from "../../data/a2.json";

const levelDataMap: Record<string, LevelData> = {
  a1: a1Data as LevelData,
  a2: a2Data as LevelData,
};

export const AVAILABLE_LEVELS = ["a1", "a2"] as const;
```

5. **Build and test:** Run the app and open the new level to confirm words and grammar render correctly.

---

## Summary

- **Safe to make public:** Yes; read-only, static, no secrets, no user data.
- **Data:** One JSON per level (e.g. `a1.json`, `a2.json`, `b1.json`) with `level`, `words`, and `grammar`.
- **Translation:** All English text is entered manually; no automatic translation or merge scripts.
- **New levels:** Add a new JSON file, fill it manually, then register it in `src/lib/data.ts` (and `AVAILABLE_LEVELS`). No scripts for merging or generating production data.
