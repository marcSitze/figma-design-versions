const axios = require('axios');
const fs = require('fs');
const path = require('path');

const FIGMA_API_TOKEN = 'figd_RzaC0394r0K77ZMysZH5uoWnMePxjFG3eQZNGmQh';
const FILE_ID = 'DsTMoukpoM35d1ZOdCSsWw';
const EXPORT_PATH = 'figma_designs';

const headers = {
  'X-Figma-Token': FIGMA_API_TOKEN,
};

async function getFileComponents(fileId) {
  const url = `https://api.figma.com/v1/files/${fileId}`;
  const response = await axios.get(url, { headers });
  return response.data;
}

async function exportSvgs(fileId) {
  const components = await getFileComponents(fileId);
  if (!fs.existsSync(EXPORT_PATH)) {
    fs.mkdirSync(EXPORT_PATH);
  }

  const nodes = components.document.children;
  for (const node of nodes) {
    const nodeId = node.id;
    const nodeName = node.name;
    await exportSvg(fileId, nodeId, nodeName);
  }
}

async function exportSvg(fileId, nodeId, name) {
  const url = `https://api.figma.com/v1/images/${fileId}?ids=${nodeId}&format=svg`;
  const response = await axios.get(url, { headers });
  const imageUrl = response.data.images[nodeId];
  const svgData = await axios.get(imageUrl);
  fs.writeFileSync(path.join(EXPORT_PATH, `${name}.svg`), svgData.data);
}

exportSvgs(FILE_ID)
  .then(() => console.log('Export completed'))
  .catch(err => console.error('Error exporting SVGs:', err));