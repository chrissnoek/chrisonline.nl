/**
 * Genereert de standaard social-share-afbeelding (1200×630) uit een SVG met
 * sharp. Draai lokaal na een merk- of tekstwijziging:
 *   node scripts/generate-og.mjs
 * Het lint wordt als bitmap ingebed, de rest is vector. Tekst gebruikt het
 * systeem-serif (Georgia) zodat het script zonder font-installatie werkt.
 */
/* global Buffer */
import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ribbon = readFileSync(resolve(root, 'src/assets/brand/living-ribbon-wide.png'));
const ribbonB64 = `data:image/png;base64,${ribbon.toString('base64')}`;

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="sun" cx="0.82" cy="0.1" r="0.6">
      <stop offset="0" stop-color="#ffd6aa" stop-opacity="0.9"/>
      <stop offset="0.45" stop-color="#ee4b24" stop-opacity="0.12"/>
      <stop offset="1" stop-color="#f4f4ef" stop-opacity="0"/>
    </radialGradient>
    <clipPath id="frame"><rect width="1200" height="630" rx="0"/></clipPath>
  </defs>
  <rect width="1200" height="630" fill="#f4f4ef"/>
  <rect width="1200" height="630" fill="url(#sun)"/>
  <g clip-path="url(#frame)">
    <image xlink:href="${ribbonB64}" x="420" y="250" width="1000" height="560" opacity="0.98" transform="rotate(-6 920 530)"/>
  </g>
  <g transform="translate(84 76)" fill="none" stroke="#ee4b24" stroke-width="7" stroke-linecap="round">
    <path d="M30 2v56M2 30h56M10.2 10.2l39.6 39.6M49.8 10.2 10.2 49.8"/>
  </g>
  <text x="166" y="118" font-family="Inter, Helvetica, Arial, sans-serif" font-size="30" font-weight="700" fill="#141512" letter-spacing="-1">Chris Online</text>
  <text x="84" y="300" font-family="Georgia, 'Times New Roman', serif" font-size="92" fill="#141512" letter-spacing="-2">Premium Shopify-webshops</text>
  <text x="84" y="396" font-family="Georgia, 'Times New Roman', serif" font-size="92" fill="#141512" letter-spacing="-2">die merken laten groeien.</text>
  <text x="84" y="500" font-family="Inter, Helvetica, Arial, sans-serif" font-size="28" fill="#52544c">Design, develop en maintain door Chris Snoek, Volendam</text>
  <text x="84" y="560" font-family="Inter, Helvetica, Arial, sans-serif" font-size="24" font-weight="600" fill="#c1360f">chrisonline.nl</text>
</svg>`;

const png = await sharp(Buffer.from(svg), { density: 144 })
  .resize(1200, 630)
  .png({ compressionLevel: 9, palette: true, quality: 90 })
  .toBuffer();
const out = resolve(root, 'public/og/og-default.png');
writeFileSync(out, png);
console.log(`OG-afbeelding geschreven: ${out} (${Math.round(png.length / 1024)} kB)`);
