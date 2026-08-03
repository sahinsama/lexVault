require("dotenv").config();

const getDictionaryData = require("./src/dictionary");
const express = require("express");
const cors = require("cors");

const translateWord = require("./src/translation");
const addWord = require("./src/addWord");

const app = express();

app.use(cors());
app.use(express.json());


app.post("/analyze", async (req, res) => {
  try {
    const { word, source } = req.body;

    const meaning = await translateWord(word);
    const dictionary = await getDictionaryData(word);
    console.log(dictionary);

    const result = {
        word,
        meaning,
        example: dictionary.example,
        pronunciation: dictionary.pronunciation,
        type: dictionary.type,
        notes: "",
        level: "",
        source,
        language: "🇺🇸",
        date: new Date().toISOString().split("T")[0],
    };

    const saveResult = await addWord(result);

    res.json({
      ...result,
      isDuplicate: saveResult.isDuplicate,
      count: saveResult.count,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Translation failed"
    });
  }
});


app.listen(3000, () => {
  console.log("LexVault backend çalışıyor 🚀");
});