require("dotenv").config();

const express = require("express");
const cors = require("cors");

const analyzeWord = require("./src/analyze");
const { addWord, getAllWords } = require("./src/storage");

const app = express();

app.use(cors());
app.use(express.json());


app.post("/analyze", async (req, res) => {

  try {

    const { word, source } = req.body;

    const result = await analyzeWord(word);

    const saveResult = await addWord({
      word: word,
      ...result,
      source: source,
      date: new Date().toISOString().split("T")[0],
    });

    res.json({
      ...result,
      isDuplicate: saveResult.isDuplicate,
      count: saveResult.count,
    });

  } catch (error) {

    console.error(error);
    res.status(500).json({
      error: "Analysis failed"
    });

  }

});


app.get("/words", async (req, res) => {

  try {

    const words = await getAllWords();
    res.json(words);

  } catch (error) {

    console.error(error);
    res.status(500).json({
      error: "Failed to fetch words"
    });

  }

});


app.listen(3000, () => {
  console.log("LexVault backend çalışıyor 🚀");
});