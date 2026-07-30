const notion = require("./notion");

async function addWord(data) {
  try {
    await notion.pages.create({
      parent: {
        database_id: process.env.NOTION_DATABASE_ID,
      },

      properties: {
        Word: {
          title: [
            {
              text: {
                content: data.word,
              },
            },
          ],
        },

        Meaning: {
          rich_text: [
            {
              text: {
                content: data.meaning,
              },
            },
          ],
        },

        Example: {
          rich_text: [
            {
              text: {
                content: data.example,
              },
            },
          ],
        },

        Notes: {
          rich_text: [
            {
              text: {
                content: data.notes,
              },
            },
          ],
        },

        Source: {
          multi_select: data.source
            ? [{ name: data.source }]
            : [],
        },

        Type: {
          select: {
            name: data.type,
          },
        },

        Language: {
          select: {
            name: data.language || "🇺🇸",
          },
        },

        Level: {
          select: {
            name: data.level,
          },
        },

        Pronunciation: {
          rich_text: [
            {
              text: {
                content: data.pronunciation,
              },
            },
          ],
        },

        Date: {
          date: {
            start: data.date,
          },
        },
      },
    });

    console.log(`✅ ${data.word} eklendi!`);

  } catch (error) {
    console.error("❌ Hata:", error.body || error.message);
  }
}

module.exports = addWord;