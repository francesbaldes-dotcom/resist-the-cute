// Erzeugt die Masterplan-Symbole als SVG (weiß mit dunklen Details, 32×32) und eine Vorschauseite.
// Aufruf: node design/icons/src/build.mjs
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { P, D } from './primitives.mjs';
import { motifs } from './motifs.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, '..', 'masterplan');
mkdirSync(out, { recursive: true });

function layer(l) {
  if (!P[l.p]) throw new Error(`Grundform fehlt: ${l.p}`);
  if (l.x === undefined) return P[l.p];
  const cx = l.x + 16 * l.s, cy = l.y + 16 * l.s, r = 15 * l.s + 2;
  const badge = l.badge ? `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${D}"/>` : '';
  return `${badge}<g transform="translate(${l.x} ${l.y}) scale(${l.s})">${P[l.p]}</g>`;
}
export function svgFor(id) {
  const body = motifs[id].map(layer).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="64" height="64">${body}</svg>\n`;
}
const names = JSON.parse(readFileSync(join(here, 'names.json'), 'utf8'));
let n = 0;
for (const id of Object.keys(motifs)) {
  writeFileSync(join(out, `${id.replace(/\./g, '-')}.svg`), svgFor(id));
  n++;
}
// Vorschau: alle Symbole auf dunklem Grund, in Schulfarbe getönt wie im Spiel
const colors = { I: '#ffa043', O: '#6be35a', W: '#ffd84d', X: '#b98fff', B: '#8fb6e6', F: '#ff7bb6', kind: '#fff4fb', school: '#fff4fb', bridge: '#e9e3f2', L: '#ffd84d', bp: '#b9a7cf' };
const cells = Object.keys(motifs).map((id) => {
  const school = id.split('.')[0];
  const color = colors[school] ?? '#fff4fb';
  const svg = svgFor(id).replace('width="64" height="64"', 'width="40" height="40"').replace(/#ffffff/g, color);
  return `<figure><span class="n" style="--c:${color}">${svg}</span><figcaption><b>${id}</b><br>${names[id] ?? ''}</figcaption></figure>`;
}).join('\n');
writeFileSync(join(out, '..', 'preview.html'), `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Masterplan-Symbole</title>
<style>body{margin:0;background:#1b1026;color:#fff4fb;font:13px/1.3 system-ui,sans-serif;padding:20px}h1{font-size:18px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(118px,1fr));gap:14px}figure{margin:0;text-align:center}
.n{display:inline-flex;width:64px;height:64px;border-radius:50%;background:#2c1d40;border:3px solid var(--c);align-items:center;justify-content:center}
figcaption{margin-top:5px;color:#b9a7cf}figcaption b{color:#fff4fb;font-weight:600}</style></head>
<body><h1>Masterplan-Symbole (${n}) – weiß gezeichnet, im Spiel in Schulfarbe getönt</h1><div class="grid">${cells}</div></body></html>\n`);
console.log(`${n} Symbole nach ${out} geschrieben, Vorschau: design/icons/preview.html`);
