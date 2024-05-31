const axios = require("axios");
const fs = require("fs");
const path = require("path");

const FIGMA_API_TOKEN = "figd_RzaC0394r0K77ZMysZH5uoWnMePxjFG3eQZNGmQh";
const FILE_ID = "V66R4rIttL1I6xMOKVQXVh";
const EXPORT_PATH = "figma_designs";
const NEW_EXPORT_PATH = "figma_designs_new";
const OLD_EXPORT_PATH = "figma_designs_old";
const CONSISTENT_WIDTH = 1024; // Example width, adjust as needed
const CONSISTENT_HEIGHT = 768; // Example height, adjust as needed

const headers = {
  "X-Figma-Token": FIGMA_API_TOKEN,
};

async function getFileComponents(fileId) {
  const url = `https://api.figma.com/v1/files/${fileId}`;
  const response = await axios.get(url, { headers });
  // console.log("response: ", response.data)
  return response.data;
}

async function exportSvgs(fileId) {
  const components = await getFileComponents(fileId);

  if (!fs.existsSync(NEW_EXPORT_PATH)) {
    fs.mkdirSync(NEW_EXPORT_PATH);
  }

  const nodes = components.document.children;

  for (const node of nodes) {
    const frames = node.children; // Assuming the frames are direct children of the node
    for (const frame of frames) {
      const nodeId = frame.id;
      const nodeName = frame.name;
      await exportSvg(fileId, nodeId, nodeName, NEW_EXPORT_PATH);
    }
  }
}


async function exportSvg(fileId, nodeId, name, exportPath) {
  const url = `https://api.figma.com/v1/images/${fileId}?ids=${nodeId}&format=svg`;
  const response = await axios.get(url, { headers });
  const imageUrl = response.data.images[nodeId];
  const svgData = await axios.get(imageUrl);
  // console.log("url: ", url)
  fs.writeFileSync(path.join(exportPath, `${name}.svg`), svgData.data);
}

function renameOldFiles() {
  console.log("renameOldFiles")
  if (fs.existsSync(OLD_EXPORT_PATH)) {
    fs.rmdirSync(OLD_EXPORT_PATH, { recursive: true });
  }

  if (fs.existsSync(EXPORT_PATH)) {
    fs.renameSync(EXPORT_PATH, OLD_EXPORT_PATH);
  }
}

function renameNewFiles() {
  console.log("renameNewFiles")

  if (fs.existsSync(NEW_EXPORT_PATH)) {
    fs.renameSync(NEW_EXPORT_PATH, EXPORT_PATH);
  }
}

async function main() {
  // Step 1: Rename current files to old
  renameOldFiles();

  // Step 2: Export new SVG files
  await exportSvgs(FILE_ID);

  // Step 3: Rename new files to current
  renameNewFiles();
}

main()
  .then(() => console.log("Export completed"))
  .catch((err) => console.error("Error exporting SVGs:", err));
