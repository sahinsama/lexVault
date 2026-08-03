const translateWord = require("./src/translation");

async function test() {
  const result = await translateWord("abandon");

  console.log(result);
}

test();