const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const EXPORT_PATH = 'figma_designs';
const EXPORT_PATH_OLD = 'figma_designs_old';
const PNG_PATH = 'figma_designs_png';
const PNG_PATH_OLD = 'figma_designs_png_old';
// const CONSISTENT_WIDTH = 1024; // Example width, adjust as needed
// const CONSISTENT_HEIGHT = 768; // Example height, adjust as needed

if (!fs.existsSync(PNG_PATH)) {
  fs.mkdirSync(PNG_PATH);
}

if (!fs.existsSync(PNG_PATH_OLD)) {
  fs.mkdirSync(PNG_PATH_OLD);
}

fs.readdir(EXPORT_PATH, (err, files) => {
  if (err) {
    console.error('Error reading SVG files:', err);
    return;
  }

  files.forEach(file => {
    const inputPath = path.join(EXPORT_PATH, file);
    const outputPath = path.join(PNG_PATH, file.replace('.svg', '.png'));

    sharp(inputPath)
    .png()
    // .resize(CONSISTENT_WIDTH, CONSISTENT_HEIGHT)
    .toFile(outputPath)
      .then(() => console.log(`Converted ${file} to PNG`))
      .catch(err => console.error('Error converting SVG to PNG:', err));
  });
});

fs.readdir(EXPORT_PATH_OLD, (err, files) => {
  if (err) {
    console.error('Error reading SVG files:', err);
    return;
  }

  files.forEach(file => {
    const inputPath = path.join(EXPORT_PATH_OLD, file);
    const outputPath = path.join(PNG_PATH_OLD, file.replace('.svg', '.png'));

    sharp(inputPath)
      .png()
      // .resize(CONSISTENT_WIDTH, CONSISTENT_HEIGHT)
      .toFile(outputPath)
      .then(() => console.log(`Converted old ${file} to PNG`))
      .catch(err => console.error('Error converting SVG to PNG:', err));
  });
});
