#!/usr/bin/env node
// Generates responsive AVIF/JPEG variants alongside the source image.
//
//   npm run images:gen
//
// Edit the SOURCES list to control which files are processed. Variants are
// written to the same directory as the source with `-<width>` appended to the
// stem. Skips re-encoding if the variant already exists and is newer than the
// source.

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

// Sources: glob-like relative paths + the widths to emit.
// AVIF/JPEG quality is picked per source for fine control.
const SOURCES = [
  // Home gallery slider (LCP-adjacent).
  { dir: 'src/assets/gallery', names: [
    'fireplace02', 'livingroom05-best', 'bedroom01', 'outside01', 'NZF_4473',
  ], widths: [480, 960, 1440], format: 'avif', quality: 50 },
  // NZF_4359 (Tatra panorama): used by the About section + home slider (bundled via the glob)
  // AND as the LCP hero. About/slider read the src/assets variants; the hero is preloaded from a
  // stable /hero/ path, so a second copy is emitted to public/hero.
  { dir: 'src/assets', names: ['NZF_4359'], widths: [480, 960, 1440], format: 'avif', quality: 55 },
  { dir: 'src/assets', outDir: 'public/hero', names: ['NZF_4359'], widths: [480, 960, 1440], format: 'avif', quality: 55 },
  { dir: 'src/assets/gallery', names: ['NZF_4375'], widths: [480, 960, 1440], format: 'avif', quality: 55 },

  // About section — same NZF_4375 + NZF_4359 reused.
  // (Already covered above.)

  // Attractions cards (JPEGs).
  { dir: 'src/assets/attractions', names: [
    'termy-bukovina', 'terma-bania', 'kotelnica', 'morskie-oko',
    'bachledka', 'dunajec', 'jurgow-kosciol', 'zakopane',
  ], widths: [480, 960], format: 'jpeg', quality: 76, progressive: true },
];

const EXT = { avif: '.avif', jpeg: '.jpg' };
const fileExists = async (p) => !!(await fs.stat(p).catch(() => null));
const isNewer = async (a, b) => {
  const [sa, sb] = await Promise.all([fs.stat(a), fs.stat(b).catch(() => null)]);
  return !sb || sa.mtimeMs > sb.mtimeMs;
};

const findSource = async (dir, name) => {
  const candidates = ['.avif', '.jpg', '.jpeg', '.png'];
  for (const ext of candidates) {
    const p = path.join(repoRoot, dir, `${name}${ext}`);
    if (await fileExists(p)) return p;
  }
  return null;
};

const encode = (s, format, quality, progressive) => {
  if (format === 'avif') return s.avif({ quality, effort: 6 });
  if (format === 'jpeg') return s.jpeg({ quality, progressive: !!progressive, mozjpeg: true });
  throw new Error(`Unsupported format: ${format}`);
};

let made = 0, skipped = 0, failed = 0;

for (const block of SOURCES) {
  for (const name of block.names) {
    const src = await findSource(block.dir, name);
    if (!src) {
      console.warn(`[skip] no source for ${block.dir}/${name}`);
      failed++;
      continue;
    }
    for (const w of block.widths) {
      const outName = `${name}-${w}${EXT[block.format]}`;
      const out = path.join(repoRoot, block.outDir || block.dir, outName);
      if (await fileExists(out) && !(await isNewer(src, out))) {
        skipped++;
        continue;
      }
      try {
        await fs.mkdir(path.dirname(out), { recursive: true });
        await encode(
          sharp(src).resize({ width: w, withoutEnlargement: true }),
          block.format, block.quality, block.progressive,
        ).toFile(out);
        const { size } = await fs.stat(out);
        console.log(`[ok] ${path.relative(repoRoot, out)} (${(size / 1024).toFixed(1)} KB)`);
        made++;
      } catch (e) {
        console.error(`[fail] ${out}: ${e.message}`);
        failed++;
      }
    }
  }
}

// Re-encode outside01.avif at lower quality (q40) — it's the biggest single
// asset on the home route. Overwrite the source so existing imports pick it up.
const big = path.join(repoRoot, 'src/assets/gallery/outside01.avif');
if (await fileExists(big)) {
  const tmp = `${big}.tmp`;
  try {
    await sharp(big).avif({ quality: 40, effort: 6 }).toFile(tmp);
    const { size: tmpSize } = await fs.stat(tmp);
    const { size: srcSize } = await fs.stat(big);
    if (tmpSize < srcSize * 0.9) {
      await fs.rename(tmp, big);
      console.log(`[shrink] outside01.avif ${(srcSize / 1024 / 1024).toFixed(2)} MB → ${(tmpSize / 1024 / 1024).toFixed(2)} MB`);
      made++;
    } else {
      await fs.unlink(tmp);
      console.log(`[shrink] outside01.avif already small enough, leaving as-is`);
      skipped++;
    }
  } catch (e) {
    console.error(`[fail] outside01.avif re-encode: ${e.message}`);
    failed++;
  }
}

console.log(`\nDone — made: ${made}, skipped: ${skipped}, failed: ${failed}`);
process.exit(failed ? 1 : 0);
