require("dotenv").config();

const axios = require("axios");

async function translateWord(word) {
  try {
    const response = await axios.post(
      "https://api-free.deepl.com/v2/translate",
      {
        text: [word],
        target_lang: "TR",
        source_lang: "EN",
      },
      {
        headers: {
          Authorization: `DeepL-Auth-Key ${process.env.DEEPL_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.translations[0].text;

  } catch (error) {
    console.error(
      "Translation error:",
      error.response?.data || error.message
    );

    throw error;
  }
}

module.exports = translateWord;