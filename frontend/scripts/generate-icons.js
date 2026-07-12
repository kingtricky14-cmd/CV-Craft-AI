#!/usr/bin/env node

/**
 * PWA Icon Generator
 * Run this script to generate PWA icons from the SVG file
 * 
 * Installation:
 *   npm install -D sharp
 * 
 * Usage:
 *   node scripts/generate-icons.js
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const SVG_SOURCE = 'public/icon.svg';
const PUBLIC_DIR = 'public';

const sizes = [
  { name: 'icon-16x16.png', size: 16 },
  { name: 'icon-32x32.png', size: 32 },
  { name: 'icon-96x96.png', size: 96 },
  { name: 'icon-192x192.png', size: 192 },
  { name: 'icon-512x512.png', size: 512 },
  { name: 'icon-maskable-192x192.png', size: 192 },
  { name: 'icon-maskable-512x512.png', size: 512 },
];

async function generateIcons() {
  console.log('📦 Generating PWA icons...');

  try {
    // Check if SVG exists
    if (!fs.existsSync(SVG_SOURCE)) {
      console.error(`❌ SVG source not found: ${SVG_SOURCE}`);
      process.exit(1);
    }

    // Read SVG
    const svgBuffer = fs.readFileSync(SVG_SOURCE);

    // Generate each size
    for (const { name, size } of sizes) {
      const outputPath = path.join(PUBLIC_DIR, name);
      await sharp(svgBuffer)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 249, g: 115, b: 22, alpha: 1 }, // Orange background
        })
        .png()
        .toFile(outputPath);

      console.log(`✅ Generated ${name}`);
    }

    console.log('🎉 All icons generated successfully!');
  } catch (error) {
    console.error('❌ Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();
