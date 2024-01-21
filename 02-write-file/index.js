const fs = require('fs');
const path = require('path');
const { stdin, stdout } = require('process');
const writeStream = fs.createWriteStream(path.resolve(__dirname, 'text.txt'));

stdout.write(
  `${'\x1b[34m'}Пожалуйста введите текст:${'\x1b[0m'}\n${'\x1b[33m'}*!После каждого слова нажмите enter!*${'\x1b[0m'}\n${'\x1b[32m'}Введите текст: ${'\x1b[0m'}`,
);
stdin.on('data', (data) => {
  const text = data.toString().trim();
  if (text !== 'exit') {
    stdout.write(`${'\x1b[32m'}Введите текст: ${'\x1b[0m'}`);
    writeStream.write(data);
  } else {
    process.exit();
  }
});
process.on('SIGINT', () => {
  process.exit();
});
process.on('exit', () => {
  process.stdout.write(`\n${'\x1b[34m'}Завершение программы.${'\x1b[0m'}`);
});
