const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function getWordData() {
  const word = await ask("\nWord: ");
  const source = await ask("Source: ");

  return {
    word,
    source,
  };
}

function closeInput() {
  rl.close();
}

module.exports = {
  getWordData,
  closeInput,
};