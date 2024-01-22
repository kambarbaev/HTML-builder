const fs = require('fs');
const path = require('path');
const greenColor = '\x1b[32m';
const blueColor = '\x1b[34m';
const yellowColor = '\x1b[33m';
const resetColor = '\x1b[0m';

const dirPath = path.resolve(__dirname, 'secret-folder');

fs.readdir(dirPath, { withFileTypes: true }, (error, data) => {
  if (error) throw error;

  data.forEach((item) => {
    const filePath = path.join(dirPath, item.name);

    fs.stat(filePath, (error, data) => {
      if (error) throw error;
      if (data.isFile()) {
        process.stdout.write(
          `${greenColor}${path.basename(
            filePath,
            path.extname(filePath),
          )} - ${yellowColor}${path
            .extname(filePath)
            .replace(/\./g, '')} - ${blueColor}${(data.size / 1024).toFixed(
            3,
          )}kb${resetColor}\n`,
        );
      }
    });
  });
});
