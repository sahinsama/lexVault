require('dns').setDefaultResultOrder('ipv4first');
const { getWordData, closeInput } = require("./input");

const analyzeWord = require("./ai");
const addWord = require("./addWord");

async function start() {
  console.log("\n📚 LexVault\n");

  const input = await getWordData();

  console.log("\n🧠 AI analiz ediyor...\n");

  const analysis = await analyzeWord(input.word);

  const wordData = {
    word: input.word,

    meaning: analysis.meaning,

    example: analysis.example,

    notes: analysis.notes,

    source: input.source,

    type: analysis.type,

    level: analysis.level,

    pronunciation: analysis.pronunciation,

    language: analysis.language,

    date: new Date().toISOString().split("T")[0],
  };

  await addWord(wordData);

  closeInput();
}

start();