const notion = require("./notion");


function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


async function withRetry(fn, maxAttempts = 2) {

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {

    try {
      return await fn();

    } catch (error) {

      const isLastAttempt = attempt === maxAttempts;

      if (isLastAttempt) throw error;

      await sleep(attempt * 800);
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

  const exactMatch = response.results.find((page) => {
    const title = page.properties.Word.title
      .map((t) => t.plain_text)
      .join("");

    return title.trim().toLowerCase() === word.trim().toLowerCase();
  });

  return exactMatch || null;
}


// notion'a yazma işlemi artık ana akışı bloklamıyor / bozmuyor.
// başarısız olursa sadece log'a düşüyor, kullanıcı hiç fark etmiyor.
async function syncToNotion(data, count) {

  try {

    const existingPage = await findExistingPage(data.word);

    if (existingPage) {

      await withRetry(() =>
        notion.pages.update({
          page_id: existingPage.id,
          properties: {
            Times: { number: count },
            Date: { date: { start: data.date } },
          },
        })
      );

      return;
    }

    await withRetry(() =>
      notion.pages.create({
        parent: { database_id: process.env.NOTION_DATABASE_ID },
        properties: {
          Word: { title: [{ text: { content: data.word } }] },
          Meaning: { rich_text: [{ text: { content: data.meaning || "" } }] },
          Example: { rich_text: [{ text: { content: data.example || "" } }] },
          Notes: { rich_text: [{ text: { content: data.notes || "" } }] },
          Source: {
            multi_select: data.source ? [{ name: data.source }] : [],
          },
          Type: { select: { name: data.type || "noun" } },
          Language: { select: { name: data.language || "🇺🇸" } },
          Level: { select: { name: data.level || "A1" } },
          Pronunciation: {
            rich_text: [{ text: { content: data.pronunciation || "" } }],
          },
          Date: { date: { start: data.date } },
          Times: { number: count },
        },
      })
    );

  } catch (error) {
    console.warn(
      `⚠️  notion sync başarısız oldu (${data.word}):`,
      error.message
    );
  }
}

module.exports = { syncToNotion };
