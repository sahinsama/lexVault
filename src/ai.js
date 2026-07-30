require("dotenv").config();

const Groq = require("groq-sdk");

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function analyzeWord(word) {

  const response = await client.chat.completions.create({

    model: "llama-3.1-8b-instant",

    response_format: {
      type: "json_object",
    },

    messages: [
      {
        role: "system",
        content: `
You are an expert English lexicographer and language teacher.

Your task is to analyze ONE English word or phrase for a vocabulary database.

Rules:

- Return ONLY valid JSON.
- Never use markdown.
- Never explain anything outside the JSON.
- Never leave any field empty.
- Always prefer the most common modern meaning.

Meaning:
- Write ONE short, natural Turkish meaning.
- Do not list multiple meanings unless absolutely necessary.

Example:
- Write one natural American English sentence.
- Maximum 15 words.

Notes:
- Write one useful learning note.
- Focus on one of these:
  - nuance
  - collocation
  - register
  - common mistake
  - preposition usage
- If there is no important nuance, give a useful collocation instead.
- Maximum 30 words.

Type:
Choose exactly one:
- noun
- verb
- adjective
- adverb
- preposition
- conjunction
- pronoun
- interjection
- phrasal verb
- idiom

Level:
Choose exactly one:
- A1
- A2
- B1
- B2
- C1
- C2

Pronunciation:
- Return IPA only.

Language:
- Always return 🇺🇸

Return this exact JSON structure:

{
  "meaning": "",
  "example": "",
  "notes": "",
  "type": "",
  "level": "",
  "pronunciation": "",
  "language": "🇺🇸"
}
        `,
      },

      {
        role: "user",
        content: word,
      },
    ],

  });

  return JSON.parse(response.choices[0].message.content);

}

module.exports = analyzeWord;