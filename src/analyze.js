const analyzeWordWithAI = require("./ai");
const translateWord = require("./translation");
const getDictionaryData = require("./dictionary");


function isQuotaError(error) {
  return (
    error.status === 429 ||
    error.message?.includes("429") ||
    error.message?.toLowerCase().includes("quota")
  );
}


function withTimeout(promise, ms, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`${label} zaman aşımı (${ms}ms)`)), ms)
    ),
  ]);
}


// gemini'yi dener, limit/hata/zaman aşımı durumunda dictionary + deepl'e düşer.
async function analyzeWord(word) {

  const t0 = Date.now();

  try {
    const result = await withTimeout(
      analyzeWordWithAI(word),
      11000,
      "Gemini"
    );

    console.log(`⏱️  Gemini: ${Date.now() - t0}ms`);
    return result;

  } catch (error) {

    console.log(`⏱️  Gemini başarısız oldu (${Date.now() - t0}ms):`, error.message);

    if (isQuotaError(error)) {
      console.warn("⚠️  AI günlük limiti doldu, fallback kullanılıyor.");
    } else {
      console.warn("⚠️  AI analiz hatası, fallback'e geçiliyor:", error.message);
    }

    const t1 = Date.now();

    const [translation, dictData] = await Promise.all([
      translateWord(word).catch(() => word),
      getDictionaryData(word),
    ]);

    console.log(`⏱️  fallback (translate+dictionary): ${Date.now() - t1}ms`);

    return {
      meaning: translation,
      example: dictData.example || "",
      notes: "",
      type: dictData.type || "noun",
      level: "B1",
      pronunciation: dictData.pronunciation || "",
      language: "🇺🇸",
      isFallback: true,
    };
  }
}


module.exports = analyzeWord;