// Erzeugt die farbigen Spezialkräfte-Symbole (Kontur-Stil, 64×64) und die weißen Leisten-Symbole (24×24, tönbar).
// Aufruf: node design/icons/src/build-ui.mjs
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const INK = '#1b1026';
const fill = (c) => `fill="${c}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"`;

// --- Spezialkräfte: Konturstil mit festen Farben je Kraft ---
const specials = {
  sleep: { c1: '#8fb6e6', c2: '#fff4fb', c3: '#ffd84d', body: (c) => `
    <path d="M20 46h25a9.5 9.5 0 0 0 1.6-18.9A13.5 13.5 0 0 0 21 23.3 11.5 11.5 0 0 0 20 46z" ${fill(c.c1)}/>
    <path d="M24 31h9l-9 9h9" fill="none" stroke="${c.c2}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M38 24h6l-6 6h6" fill="none" stroke="${c.c2}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M48 12h4l-4 4h4" fill="none" stroke="${c.c3}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>` },
  bomb: { c1: '#5b4a78', c2: '#ff5fa2', c3: '#ffd84d', body: (c) => `
    <path d="M38 24q5-9 13-8" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>
    <path d="M38 24q5-9 13-8" fill="none" stroke="${c.c3}" stroke-width="3" stroke-linecap="round"/>
    <path d="M53 8l1.8 4.2L59 14l-4.2 1.8L53 20l-1.8-4.2L47 14l4.2-1.8z" fill="${c.c3}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
    <circle cx="29" cy="38" r="17" ${fill(c.c1)}/>
    <path d="M29 47l-7.5-7.3a4.3 4.3 0 0 1 7.5-4.4 4.3 4.3 0 0 1 7.5 4.4z" fill="${c.c2}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M20 29q2-5 7-6" fill="none" stroke="${c.c3}" stroke-width="3" stroke-linecap="round" opacity=".9"/>` },
  shout: { c1: '#ffa043', c2: '#c23a78', c3: '#ffd84d', body: (c) => `
    <path d="M12 26h10l20-12v36L22 38H12z" ${fill(c.c1)}/>
    <path d="M16 38v10h9v-10" fill="${c.c2}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
    <path d="M48 24a10 10 0 0 1 0 16" fill="none" stroke="${c.c1}" stroke-width="4" stroke-linecap="round"/>
    <path d="M53 17a18 18 0 0 1 0 30" fill="none" stroke="${c.c3}" stroke-width="3.5" stroke-linecap="round"/>` },
  magnet: { c1: '#ff5fa2', c2: '#ff7bb6', c3: '#e9e3f2', body: (c) => `
    <path d="M19 12v22a13 13 0 0 0 26 0V12" fill="none" stroke="${INK}" stroke-width="16"/>
    <path d="M19 12v22a13 13 0 0 0 26 0V12" fill="none" stroke="${c.c1}" stroke-width="9"/>
    <path d="M13 8h12v12H13zM39 8h12v12H39z" fill="${c.c3}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
    <path d="M32 22l-5.2-5a3 3 0 0 1 5.2-3.1 3 3 0 0 1 5.2 3.1z" fill="${c.c1}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>` },
  slowmo: { c1: '#ffd84d', c2: '#7cff6b', c3: '#7cff6b', body: (c) => `
    <path d="M12 50q0-13 13-13h11v13z" ${fill(c.c3)}/>
    <path d="M19 38L15 27M25 38l-2-13" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>
    <circle cx="14.5" cy="25.5" r="3" fill="${c.c1}" stroke="${INK}" stroke-width="2"/><circle cx="22.5" cy="23.5" r="3" fill="${c.c1}" stroke="${INK}" stroke-width="2"/>
    <circle cx="40" cy="36" r="15" ${fill(c.c1)}/>
    <path d="M40 36m-8 0a8 8 0 1 1 8 8a4.5 4.5 0 1 1-4.5-4.5" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
    <path d="M10 54h46" fill="none" stroke="${c.c3}" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="2 7"/>` },
};
const outS = join(here, '..', 'specials'); mkdirSync(outS, { recursive: true });
for (const [name, s] of Object.entries(specials)) {
  writeFileSync(join(outS, `${name}.svg`), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">${s.body(s)}\n</svg>\n`);
}

// --- Leisten-Symbole: weiß, im Spiel per Tint einfärbbar. Aus-Zustände mit Schrägstrich. ---
const W = '#ffffff', D = '#2c1d40';
const st = (w = 2.2) => `fill="none" stroke="${W}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`;
const slash = `<path d="M4 20L20 4" stroke="${D}" stroke-width="5" stroke-linecap="round"/><path d="M4 20L20 4" stroke="${W}" stroke-width="2.4" stroke-linecap="round"/>`;
const ui = {
  speaker: `<path d="M4 9v6h4l5 4V5L8 9z" fill="${W}"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 6a9 9 0 0 1 0 12" ${st()}/>`,
  music: `<path d="M9 18.5V6l10-2v12.5" ${st(2.4)}/><circle cx="6.5" cy="18.5" r="2.8" fill="${W}"/><circle cx="16.5" cy="16.5" r="2.8" fill="${W}"/>`,
  vibe: `<rect x="8" y="3.5" width="8" height="17" rx="2" ${st()}/><path d="M4.5 8v8M19.5 8v8M1.5 10v4M22.5 10v4" ${st(2)}/>`,
  pause: `<rect x="6" y="5" width="4.5" height="14" rx="1.2" fill="${W}"/><rect x="13.5" y="5" width="4.5" height="14" rx="1.2" fill="${W}"/>`,
  play: `<path d="M7 5l12 7-12 7z" fill="${W}"/>`,
  save: `<path d="M4 4h12l4 4v12H4z" ${st()}/><path d="M8 4v5h7V4" ${st()}/><rect x="8" y="14" width="8" height="6" fill="${W}"/>`,
  back: `<path d="M14 6l-6 6 6 6" ${st(2.6)}/><path d="M8 12h12" ${st(2.6)}/>`,
  bolt: `<path d="M13 2L5 13h6l-1 9 9-12h-6z" fill="${W}"/>`,
  brain: `<path d="M9 4a3.5 3.5 0 0 0-3.4 4.3A3.5 3.5 0 0 0 5 15a3.5 3.5 0 0 0 4 4.5V4zM15 4a3.5 3.5 0 0 1 3.4 4.3A3.5 3.5 0 0 1 19 15a3.5 3.5 0 0 1-4 4.5V4z" fill="${W}"/><path d="M12 4v16" stroke="${D}" stroke-width="1.6"/>`,
  tower: `<path d="M6 21V8h3V5h2v3h2V5h2v3h3v13z" fill="${W}"/><rect x="10" y="13" width="4" height="8" fill="${D}"/>`,
  forward: `<path d="M4 5l8 7-8 7zM12 5l8 7-8 7z" fill="${W}"/>`,
  upgrade: `<path d="M12 4l7 7h-4v9h-6v-9H5z" fill="${W}"/>`,
  bulk: `<path d="M12 2l6 6h-3.5v3h-5V8H6z" fill="${W}"/><path d="M12 11l6 6h-3.5v5h-5v-5H6z" fill="${W}"/>`,
  sell: `<rect x="2" y="6" width="20" height="12" rx="2" fill="${W}"/><circle cx="12" cy="12" r="3.2" fill="${D}"/><circle cx="6" cy="12" r="1.2" fill="${D}"/><circle cx="18" cy="12" r="1.2" fill="${D}"/>`,
  close: `<path d="M6 6l12 12M18 6L6 18" ${st(2.8)}/>`,
  globe: `<circle cx="12" cy="12" r="9" ${st()}/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" ${st(1.8)}/>`,
  book: `<path d="M3 5c3-1.5 6-1.5 9 1v13c-3-2.5-6-2.5-9-1zM21 5c-3-1.5-6-1.5-9 1v13c3-2.5 6-2.5 9-1z" fill="${W}"/>`,
  heart: `<path d="M12 20l-7.5-7.2a4.3 4.3 0 0 1 7.5-4.6 4.3 4.3 0 0 1 7.5 4.6z" fill="${W}"/>`,
  check: `<path d="M5 12.5l4.5 4.5L19 7" ${st(3)}/>`,
  skip: `<path d="M5 5l10 7-10 7z" fill="${W}"/><rect x="16" y="5" width="3" height="14" rx="1" fill="${W}"/>`,
  'speaker-off': null, 'music-off': null, 'vibe-off': null,
};
ui['speaker-off'] = ui.speaker + slash; ui['music-off'] = ui.music + slash; ui['vibe-off'] = ui.vibe + slash;
// Münze: farbig, nicht tönbar
ui.coin = `<circle cx="12" cy="12" r="9" fill="#ffd84d" stroke="#8a6a00" stroke-width="2"/><circle cx="12" cy="12" r="5" fill="none" stroke="#8a6a00" stroke-width="2"/>`;
const outU = join(here, '..', 'ui'); mkdirSync(outU, { recursive: true });
let n = 0;
for (const [name, body] of Object.entries(ui)) {
  writeFileSync(join(outU, `${name}.svg`), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48">${body}</svg>\n`); n++;
}
console.log(`${Object.keys(specials).length} Spezialkräfte-Symbole, ${n} Leisten-Symbole geschrieben`);
