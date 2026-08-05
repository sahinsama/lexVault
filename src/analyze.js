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


// gemini'yi dener, limit/hata durumunda dictionary + deepl kombinasyonuna düşer.
// böylece limit dolsa bile site tamamen işlevsiz kalmıyor, sadece kalite bir tık düşüyor.
async function analyzeWord(word) {

  try {
    return await analyzeWordWithAI(word);

  } catch (error) {

    if (!isQuotaError(error)) {
      // quota dışı bir hataysa (network vs.) yine de fallback'e düş,
      // ama logla ki neyin patladığını görebilelim
      console.warn("⚠️  AI analiz hatası, fallback'e geçiliyor:", error.message);
    } else {
      console.warn("⚠️  AI günlük limiti doldu, fallback kullanılıyor.");
    }

    const [translation, dictData] = await Promise.all([
      translateWord(word).catch(() => word),
      getDictionaryData(word),
    ]);

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