const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');
const pixelmatch = require('pixelmatch');
const sharp = require('sharp');
const { createCanvas, loadImage } = require('canvas');
const Jimp = require('jimp');

const PNG_PATH = 'figma_designs_png';
const PNG_PATH_OLD = 'figma_designs_png_old';
const DIFF_PATH = 'figma_designs_diff';

if (!fs.existsSync(DIFF_PATH)) {
  fs.mkdirSync(DIFF_PATH);
}

function compareImages(file1, file2, output) {
  const img1 = PNG.sync.read(fs.readFileSync(file1));
  const img2 = PNG.sync.read(fs.readFileSync(file2));
  const { width, height } = img1;
  const diff = new PNG({ width, height });

  pixelmatch(img1.data, img2.data, diff.data, width, height, { threshold: 0.1 });

  fs.writeFileSync(output, PNG.sync.write(diff));
}

const files = fs.readdirSync(PNG_PATH);

for (let i = 1; i < files.length; i++) {
  const prevFile = path.join(PNG_PATH_OLD, files[i - 1]);
  const currFile = path.join(PNG_PATH, files[i - 1]);
  const diffFile = path.join(DIFF_PATH, `diff_${i}.png`);
console.log("prevFile: ", prevFile)
console.log("currFile: ", currFile)
  // compareImages(prevFile, currFile, diffFile);

  compareImages(prevFile, currFile, diffFile)
  .then(numDiffPixels => {
    console.log(`Number of different pixels: ${numDiffPixels}`);
  })
  .catch(err => {
    console.error(err);
  });
}

async function compareImages(imagePath1, imagePath2, outputDiffPath) {
  try {
      // Load images using Jimp
      const img1 = await Jimp.read(imagePath1);
      const img2 = await Jimp.read(imagePath2);

      // Determine the dimensions of the larger image
      const width = Math.max(img1.bitmap.width, img2.bitmap.width);
      const height = Math.max(img1.bitmap.height, img2.bitmap.height);

      // Resize both images to the dimensions of the larger image
      const resizedImg1 = img1.resize(width, height, Jimp.RESIZE_NEAREST_NEIGHBOR);
      const resizedImg2 = img2.resize(width, height, Jimp.RESIZE_NEAREST_NEIGHBOR);

      // Convert images to buffers
      const buffer1 = await resizedImg1.getBufferAsync(Jimp.MIME_PNG);
      const buffer2 = await resizedImg2.getBufferAsync(Jimp.MIME_PNG);

      // Parse buffers as PNG images
      const png1 = PNG.sync.read(buffer1);
      const png2 = PNG.sync.read(buffer2);

      // Create a diff image
      const diff = new PNG({ width, height });

      // Compare images and highlight differences
      const numDiffPixels = pixelmatch(png1.data, png2.data, diff.data, width, height, { threshold: 0.1 });

      // Save the diff image
      fs.writeFileSync(outputDiffPath, PNG.sync.write(diff));

      console.log(`Number of different pixels: ${numDiffPixels}`);
  } catch (error) {
      console.error('Error comparing images:', error);
  }
}