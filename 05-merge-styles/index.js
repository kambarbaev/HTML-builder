const fs = require('fs');
const path = require('path');
const sourcePath = path.resolve(__dirname, 'styles');
const distinationPath = path.resolve(__dirname, 'project-dist');
const bundleCssPath = path.join(distinationPath, 'bundle.css');

const writeStream = fs.createWriteStream(bundleCssPath);

function bundleCss(srcPath) {
  fs.readdir(srcPath, { withFileTypes: true }, (error, data) => {
    if (error) throw error;
    data.forEach((item) => {
      const filePath = path.join(srcPath, item.name);
      fs.stat(filePath, (error) => {
        if (error) throw error;
        if (path.extname(filePath) === '.css') {
          const readStream = fs.createReadStream(filePath);
          readStream.on('data', (chunk) => {
            writeStream.write(chunk);
          });
        }
      });
    });
  });
}
bundleCss(sourcePath);
