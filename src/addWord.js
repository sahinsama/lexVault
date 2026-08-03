const notion = require("./notion");


function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


async function withRetry(fn, maxAttempts = 3) {

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {

    try {
      return await fn();

    } catch (error) {

      const isNetworkError =
        error.message === "fetch failed" ||
        error.code === "ECONNRESET" ||
        error.code === "ETIMEDOUT";

      const isLastAttempt = attempt === maxAttempts;

      if (!isNetworkError || isLastAttempt) {
        throw error;
      }

      console.log(
        `⚠️  ağ hatası, tekrar deneniyor (${attempt}/${maxAttempts})...`
      );

      await sleep(attempt * 1000);
    }
  }
}


let cachedDataSourceId = null;

async function getDataSourceId() {

  if (cachedDataSourceId) return cachedDataSourceId;

  const database = await withRetry(() =>
    notion.databases.retrieve({
      database_id: process.env.NOTION_DATABASE_ID,
    })
  );

  cachedDataSourceId = database.data_sources[0].id;

  return cachedDataSourceId;
}


async function findExistingPage(word) {

  const dataSourceId = await getDataSourceId();

  const response = await withRetry(() =>
    notion.dataSources.query({
      data_source_id: dataSourceId,
      filter: {
        property: "Word",
        title: {
          contains: word,
        },
      },
    })
  );

  // notion'ın "contains" filtresi büyük/küçük harf duyarsız ama
  // kısmi eşleşme de yakalayabiliyor (örn. "book" ararken "bookkeeper" gelebilir)
  // o yüzden tam eşleşmeyi burada elle doğruluyoruz
  const exactMatch = response.results.find((page) => {
    const title = page.properties.Word.title
      .map((t) => t.plain_text)
      .join("");

    return title.trim().toLowerCase() === word.trim().toLowerCase();
  });

  return exactMatch || null;
}


async function addWord(data) {
  try {

    const existingPage = await findExistingPage(data.word);

    if (existingPage) {

      const currentCount =
        existingPage.properties.Times?.number || 1;

      const newCount = currentCount + 1;

      await withRetry(() =>
        notion.pages.update({
          page_id: existingPage.id,
          properties: {
            Times: {
              number: newCount,
            },
            Date: {
              date: {
                start: data.date,
              },
            },
          },
        })
      );

      console.log(`🔁 ${data.word} zaten vardı, x${newCount} yapıldı.`);

      return { isDuplicate: true, count: newCount };
    }

    await withRetry(() =>
      notion.pages.create({
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
            multi_select: finalSource
              ? [{ name: finalSource }]
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

          Times: {
            number: 1,
          },
        },
      })
    );

    console.log(`✅ ${data.word} eklendi!`);

    return { isDuplicate: false, count: 1 };

  } catch (error) {
    console.error("❌ Hata:", error.body || error.message);
    return { isDuplicate: false, count: 1, error: true };
  }
}

const db = await notion.databases.retrieve({
  database_id: DATABASE_ID,
});

const sourceOptions = db.properties.Source.multi_select.options;

const normalize = (s) =>
  s.trim().toLowerCase().replace(/\s+/g, " ");

const matched = sourceOptions.find(
  (option) => normalize(option.name) === normalize(source)
);

const finalSource = matched ? matched.name : source;


module.exports = addWord;