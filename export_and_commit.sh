#!/bin/bash

# Run the Node.js script to export SVGs
node exportFigmaDesigns.js

# Navigate to the Git repository
cd ~/Documents/scratch/figma-designs

# Add and commit changes
git add figma_designs
git commit -m "Automated export and commit of Figma designs"
git push origin main
