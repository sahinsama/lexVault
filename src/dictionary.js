const axios = require("axios");

async function getDictionaryData(word) {
  try {
    const response = await axios.get(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );

    const data = response.data[0];

    const pronunciation =
      data.phonetics.find((p) => p.text)?.text || "";

    let type = "";
    let definition = "";
    let example = "";

    for (const meaning of data.meanings || []) {
      if (!type && meaning.partOfSpeech) {
        type = meaning.partOfSpeech;
      }

      for (const def of meaning.definitions || []) {
        if (!definition && def.definition) {
          definition = def.definition;
        }

        if (!example && def.example) {
          example = def.example;
        }

        if (definition && example) break;
      }

      if (definition && example) break;
    }

    return {
      pronunciation,
      type,
      definition,
      example,
    };

  } catch (error) {
    console.error(
      "Dictionary error:",
      error.response?.data || error.message
    );

    return {
      pronunciation: "",
      type: "",
      definition: "",
      example: "",
    };
  }
}

module.exports = getDictionaryData;