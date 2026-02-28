# MASTER PROMPT

I am building a German learning web application.

I will provide you with a German exam file (PDF, text, or document).  
Your task is to extract and transform the content into structured data for my application.

The application has two main sections per German level (A1, A2, B1, etc.):

---

## 1️⃣ WORDS PAGE STRUCTURE

For every vocabulary word found in the file, extract and return:

### For nouns:
- Word  
- Article (der / die / das)  
- Plural form  
- English meaning  
- One simple German sentence using the word  
- English translation of the sentence  

### For verbs:
- Infinitive form  
- English meaning  
- Präsens (ich form)  
- Präteritum  
- Partizip II  
- One example sentence in German  
- English translation  

### For adjectives:
- Base form  
- English meaning  
- Comparative  
- Superlative  
- Example sentence in German  
- English translation  

Return the words cleanly structured in JSON format like this:

```json
{
  "level": "A1",
  "words": [
    {
      "type": "noun",
      "word": "Apfel",
      "article": "der",
      "plural": "Äpfel",
      "meaning": "apple",
      "example_sentence": "Der Apfel ist rot.",
      "translation": "The apple is red."
    }
  ]
}

Only include real vocabulary words — ignore instructions, headings, or exercise numbers.

2️⃣ GRAMMAR PAGE STRUCTURE

From the same file, extract grammar topics and organize them clearly.

For each grammar topic provide:

Grammar title

Clear explanation in simple English

Structure formula (if applicable)

2–3 example sentences in German

English translations

Important notes or common mistakes

Return grammar in this format:

{
  "level": "A1",
  "grammar": [
    {
      "title": "Present Tense (Präsens)",
      "explanation": "The present tense is used to describe actions happening now or regularly.",
      "structure": "Subject + verb (conjugated)",
      "examples": [
        {
          "sentence": "Ich lerne Deutsch.",
          "translation": "I learn German."
        }
      ],
      "notes": [
        "Verb position is always second in main clauses."
      ]
    }
  ]
}
3️⃣ ORGANIZATION RULES

Group everything under the correct German level (A1, A2, etc.).

Do NOT invent content.

Only extract what appears in the provided file.

Clean duplicates.

Make sentences simple and beginner-friendly.

Ensure plurals and articles are 100% correct.

If plural is irregular, keep it accurate.

4️⃣ OUTPUT FORMAT

Return ONE final structured JSON combining words and grammar like this:

{
  "level": "A1",
  "words": [...],
  "grammar": [...]
}