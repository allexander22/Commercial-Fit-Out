// One-off script: generates branded placeholder JPEGs via sharp so the site
// has realistic imagery until real project photography arrives.
// Run with: node scripts/generate-placeholders.mjs
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'src', 'assets', 'images');

function svgFor(width, height, seed) {
  // Deterministic pseudo-random offsets from the seed so each image differs
  // slightly while staying on-brand (dark base + blue/silver diagonal accent).
  let n = 0;
  for (const ch of seed) n = (n * 31 + ch.charCodeAt(0)) >>> 0;
  const rand = (min, max) => min + ((n = (n * 1103515245 + 12345) >>> 0) % (max - min));

  const stripes = [];
  const stripeCount = 5;
  for (let i = 0; i < stripeCount; i++) {
    const offset = rand(-width * 0.4, width * 0.4);
    const w = rand(width * 0.03, width * 0.09);
    const opacity = (0.05 + i * 0.03).toFixed(2);
    stripes.push(
      `<rect x="${width * 0.5 + offset}" y="-${height}" width="${w}" height="${height * 3}" fill="url(#accent)" opacity="${opacity}" transform="rotate(18 ${width / 2} ${height / 2})"/>`
    );
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#57a0ec"/>
      <stop offset="100%" stop-color="#8f9aa6"/>
    </linearGradient>
    <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0f1216"/>
      <stop offset="100%" stop-color="#0b0d10"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  ${stripes.join('\n  ')}
  <rect width="${width}" height="${height}" fill="none" stroke="#2a2f37" stroke-width="2"/>
</svg>`;
}

const images = [
  { name: 'hero', width: 1600, height: 900 },
  { name: 'office-fit-out', width: 1200, height: 800 },
  { name: 'office-refurbishment', width: 1200, height: 800 },
  { name: 'retail-fit-out', width: 1200, height: 800 },
  { name: 'healthcare-fit-out', width: 1200, height: 800 },
  { name: 'sectors-hub', width: 1200, height: 800 },
  { name: 'projects-hub', width: 1200, height: 800 },
  { name: 'locations-hub', width: 1200, height: 800 },
  { name: 'insights-hub', width: 1200, height: 800 },
  { name: 'about', width: 1200, height: 800 },
  { name: 'cost-guide', width: 1200, height: 800 },
];

await mkdir(outDir, { recursive: true });

for (const { name, width, height } of images) {
  const svg = svgFor(width, height, name);
  const outPath = path.join(outDir, `${name}.jpg`);
  await sharp(Buffer.from(svg)).jpeg({ quality: 82 }).toFile(outPath);
  console.log('generated', outPath);
}

console.log('Done.');
