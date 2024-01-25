const fs = require('fs');
const path = require('path');
const sourcePath = path.resolve(__dirname, 'files');
const distinationPath = path.resolve(__dirname, 'files-copy');

fs.mkdir(distinationPath, { recursive: true }, () => {
  deleteFiles(distinationPath);
  copyFiles(sourcePath, distinationPath);
});

function deleteFiles(distPath) {
  fs.readdir(distPath, (error, data) => {
    if (error) throw error;
    data.forEach((item) => {
      const distinationFilePath = path.join(distPath, item);
      fs.unlink(distinationFilePath, (unlinkError) => {
        if (unlinkError) throw unlinkError;
      });
    });
  });
}

function copyFiles(srcPath, distPath) {
  fs.readdir(srcPath, { withFileTypes: true }, (error, data) => {
    if (error) throw error;
    data.forEach((item) => {
      const srcFilePath = path.join(srcPath, item.name);
      const distinationFilePath = path.join(distPath, item.name);
      if (item.isFile()) {
        fs.copyFile(srcFilePath, distinationFilePath, (error) => {
          if (error) throw error;
        });
      }
    });
  });
}
