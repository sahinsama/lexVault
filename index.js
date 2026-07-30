require("dotenv").config();

const { Client } = require("@notionhq/client");

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

async function testConnection() {
  try {
    const response = await notion.databases.retrieve({
      database_id: process.env.NOTION_DATABASE_ID,
    });

    console.log("✅ Bağlantı başarılı!");
    console.log("Database:", response.title[0]?.plain_text);
  } catch (error) {
    console.error("❌ Hata:", error.body || error.message);
  }
}

testConnection();