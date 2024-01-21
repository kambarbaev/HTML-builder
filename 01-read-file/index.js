const fs = require('fs');
const path = require('path');

const readStream = fs.createReadStream(path.resolve(__dirname, 'text.txt'));

readStream.on('data', (chunk) => {
  process.stdout.write(`${'\x1b[33m'}${chunk}${'\x1b[0m'}`);
});

readStream.on('error', (error) => {
  process.stderr.write(error.message);
});
