const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');
const distinationPath = path.resolve(__dirname, 'project-dist');
const distinationAssetsPath = path.join(distinationPath, 'assets');
const assetsSrcPath = path.resolve(__dirname, 'assets');
const stylesSrcPath = path.resolve(__dirname, 'styles');
const bundleCssPath = path.join(distinationPath, 'style.css');
const componentsSrcPath = path.resolve(__dirname, 'components');
const bundlehtmlPath = path.join(distinationPath, 'index.html');
const templateHtml = path.resolve(__dirname, 'template.html');

function createDirectory(destPath) {
  fs.mkdir(destPath, { recursive: true }, (error) => {
    if (error) throw error;
  });
}

function copyFiles(srcPath, distPath) {
  fs.readdir(srcPath, { withFileTypes: true }, (error, data) => {
    if (error) throw error;
    data.forEach((item) => {
      const srcFilePath = path.join(srcPath, item.name);
      const distinationFilePath = path.join(distPath, item.name);
      if (item.isDirectory()) {
        createDirectory(distinationFilePath);
        copyFiles(srcFilePath, distinationFilePath);
      } else {
        fs.copyFile(srcFilePath, distinationFilePath, (error) => {
          if (error) throw error;
        });
      }
    });
  });
}
function bundleCss(srcPath, bundlePath) {
  fs.readdir(srcPath, { withFileTypes: true }, (error, data) => {
    if (error) throw error;
    const writeStreamBundleCss = fs.createWriteStream(bundlePath);
    data.forEach((item) => {
      const filePath = path.join(srcPath, item.name);
      fs.stat(filePath, (error) => {
        if (error) throw error;
        const readStream = fs.createReadStream(filePath);
        readStream.on('data', (chunk) => {
          writeStreamBundleCss.write(chunk);
        });
      });
    });
  });
}
async function bundleHtml(templatePath, srcPath, bundlePath) {
  const data = await fsp.readFile(templatePath, 'utf-8');
  let dataStr = data;
  const dirData = await fsp.readdir(srcPath, { withFileTypes: true });
  for (const item of dirData) {
    const filePath = path.join(srcPath, item.name);
    const fileName = path.basename(filePath, path.extname(filePath));
    const itemData = await fsp.readFile(filePath, 'utf-8');
    const changeTemplate = dataStr.replace(`{{${fileName}}}`, itemData);
    dataStr = changeTemplate;
  }
  const writeStream = fs.createWriteStream(bundlePath);
  writeStream.write(dataStr);
}

createDirectory(distinationPath);
createDirectory(distinationAssetsPath);
copyFiles(assetsSrcPath, distinationAssetsPath);
bundleCss(stylesSrcPath, bundleCssPath);
bundleHtml(templateHtml, componentsSrcPath, bundlehtmlPath);
