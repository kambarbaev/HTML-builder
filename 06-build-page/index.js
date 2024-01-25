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

async function createDirectory(destPath) {
  await fsp.mkdir(destPath, { recursive: true });
}
async function copyFiles(srcPath, distPath) {
  const data = await fsp.readdir(srcPath, {withFileTypes: true });
  if (data.length > 0) {
    for (let item of data) {
      const srcFilePath = path.join(srcPath, item.name);
      const distinationFilePath = path.join(distPath, item.name);
      if (item.isDirectory()) {
        await createDirectory(distinationFilePath);
        await copyFiles(srcFilePath, distinationFilePath);
      } else {
        await fsp.copyFile(srcFilePath, distinationFilePath);
      }
    }
  }
}
async function deleteFiles(distPath) {
  const data = await fsp.readdir(distPath, { withFileTypes: true });
  if (data.length !== 0) {
    for (let item of data) {
      const distinationPath = path.join(distPath, item.name);
      if (item.isDirectory()) {
        await deleteFiles(distinationPath);
      } else {
        await fsp.unlink(distinationPath);
      }
    }
    await fsp.rmdir(distPath);
  } else {
    await fsp.rmdir(distPath);
  }
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
    const changeTemplate = dataStr.replaceAll(`{{${fileName}}}`, itemData);
    dataStr = changeTemplate;
  }
  const writeStream = fs.createWriteStream(bundlePath);
  writeStream.write(dataStr);
}
async function assembler() {
  await createDirectory(distinationPath);
  await deleteFiles(distinationPath);
  await createDirectory(distinationAssetsPath);
  await copyFiles(assetsSrcPath, distinationAssetsPath);
  bundleCss(stylesSrcPath, bundleCssPath);
  await bundleHtml(templateHtml, componentsSrcPath, bundlehtmlPath);
}
assembler();
