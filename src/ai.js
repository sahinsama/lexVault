require("dotenv").config();

const { GoogleGenerativeAI, SchemaType } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


const responseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    meaning: { type: SchemaType.STRING },
    example: { type: SchemaType.STRING },
    notes: { type: SchemaType.STRING },
    type: {
      type: SchemaType.STRING,
      enum: [
        "noun",
        "verb",
        "adjective",
        "adverb",
        "preposition",
        "conjunction",
        "pronoun",
        "interjection",
        "phrasal verb",
        "idiom",
        "phrase",
      ],
    },
    level: {
      type: SchemaType.STRING,
      enum: ["A1", "A2", "B1", "B2", "C1", "C2"],
    },
    pronunciation: { type: SchemaType.STRING },
    language: { type: SchemaType.STRING },
  },
  required: [
    "meaning",
    "example",
    "notes",
    "type",
    "level",
    "pronunciation",
    "language",
  ],
};


// kısaltılmış prompt: aynı kuralları daha az kelimeyle, tekrarsız anlatıyor.
const SYSTEM_PROMPT = `
You are an expert English lexicographer helping a Turkish English learner understand ONE word/phrase.

Rules:
- Return JSON only, no markdown, no extra text.
- meaning/notes: Turkish only, natural (not word-for-word translation).
  Always use correct Turkish characters (ı, ğ, ü, ş, ö, ç) — never write Turkish without diacritics (e.g. write "geçmiş" not "gecmis", "günlük" not "gunluk").
  Short: one word for simple words ("happy" = "mutlu"), a short phrase for complex ones ("meticulous" = "çok dikkatli ve titiz").
  If the word has two common meanings, explain the main one first, then the second briefly.
- example: one natural American English sentence showing the word's meaning clearly.
- notes: one specific, useful tip (nuance, collocation, or difference from a similar word) — not generic advice. Write it as a natural, fluent Turkish sentence, not a stiff/literal translation.
- type: exactly one of noun/verb/adjective/adverb/preposition/conjunction/pronoun/interjection/phrasal verb/idiom/phrase.
- level: exactly one of A1/A2/B1/B2/C1/C2, based on real-world frequency.
- pronunciation: IPA only.
- language: always "🇺🇸".

Double-check before answering: meaning matches the exact word (not a synonym), example uses it naturally, no non-Turkish characters leaked into meaning/notes.
`;


const model = genAI.getGenerativeModel({
  model: "gemini-3.5-flash-lite",
  systemInstruction: SYSTEM_PROMPT,
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: responseSchema,
  },
});


async function analyzeWord(word) {

  const result = await model.generateContent(word);

  const text = result.response.text();

  const parsed = JSON.parse(text);

  parsed.language = "🇺🇸";

  return parsed;

}


module.exports = analyzeWord;