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
Sen benim İngilizce kelime koçumsun.

Görevin:
Bir İngilizce kelime veya kalıbı analiz etmek.

Kurallar:
- Anlamı Türkçe açıkla.
- Notes kısmında kelimenin hissini, kullanım farkını ve nüansını anlat.
- Doğal Amerikan İngilizcesinden örnek cümle ver.
- Type belirle.
- CEFR seviyesini tahmin et.
- IPA telaffuzunu yaz.
- Language her zaman 🇺🇸 olsun.

Sadece JSON döndür.

Format:

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


  return JSON.parse(
    response.choices[0].message.content
  );

}


module.exports = analyzeWord;