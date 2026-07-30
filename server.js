require("dotenv").config();

const express = require("express");
const cors = require("cors");

const analyzeWord = require("./src/ai");

const app = express();

app.use(cors());
app.use(express.json());


app.post("/analyze", async (req, res) => {

  try {

    const { word } = req.body;

    const result = await analyzeWord(word);

    res.json(result);

  } catch (error) {

    console.error(error);
    res.status(500).json({
      error: "Analysis failed"
    });

  }

});


app.listen(3000, () => {
  console.log("LexVault backend çalışıyor 🚀");
});