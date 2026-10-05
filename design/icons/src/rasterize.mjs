// Rastert alle SVG-Symbole mit Chromium nach PNG (transparent), damit das Spiel sie ohne
// Unterschiede zwischen Geräten laden kann. Aufruf: node design/icons/src/rasterize.mjs
import { chromium } from 'playwright';
import { readdirSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url)), root = join(here, '..');
const sets = [['specials', 128], ['ui', 96], ['masterplan', 128]];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 1000 }, deviceScaleFactor: 1 });
let total = 0;
for (const [set, size] of sets) {
  const dir = join(root, set), out = join(root, set, 'png'); mkdirSync(out, { recursive: true });
  const files = readdirSync(dir).filter((f) => f.endsWith('.svg'));
  const html = files.map((f) => `<img id="${f}" src="data:image/svg+xml;base64,${readFileSync(join(dir, f)).toString('base64')}" width="${size}" height="${size}" style="display:block;margin:4px">`).join('');
  await page.setContent(`<body style="margin:0;background:transparent;display:flex;flex-wrap:wrap">${html}</body>`);
  for (const f of files) {
    const el = await page.$(`[id="${f}"]`);
    const png = await el.screenshot({ omitBackground: true, type: 'png' });
    writeFileSync(join(out, f.replace(/\.svg$/, '.png')), png); total++;
  }
}
await browser.close();
console.log(`${total} PNG-Dateien erzeugt`);
