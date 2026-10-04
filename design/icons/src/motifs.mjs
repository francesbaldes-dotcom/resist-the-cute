// Motivtabelle: Symbol-ID → Ebenen aus Grundformen. ov() legt eine verkleinerte Grundform darüber,
// badge:true setzt einen dunklen Kreis dahinter, damit Weiß auf Weiß sichtbar bleibt.
import { P, W, D } from './primitives.mjs';

// Zusätzliche Varianten, die nur in Kombinationen gebraucht werden
P.sheet = `<path d="M8 3h11l6 6v20H8z" fill="${W}"/><path d="M19 3v6h6" stroke="${D}" stroke-width="2" fill="none"/>`;
P.heartD = P.heart.replaceAll(W, D);
P.crosshairD = P.crosshair.replaceAll(W, D);

export const ov = (p, x, y, s, badge = false) => ({ p, x, y, s, badge });
const L = (...layers) => layers.map((l) => (typeof l === 'string' ? { p: l } : l));

export const motifs = {
  // Knotenarten
  'kind.core': L('skull'), 'kind.small': L('dot'), 'kind.notable': L('star'), 'kind.study': L('magnifier'),
  'kind.doctrine': L('book'), 'kind.keystone': L('gem'), 'kind.mastery': L('crown'), 'kind.socket': L('ring'),
  'kind.bridge': L('chain'), 'kind.legacy': L('medal'),
  // Schul-Embleme
  'school.I': L('gear'), 'school.O': L('axe'), 'school.W': L('sack'), 'school.X': L('cauldron'), 'school.B': L('wall'), 'school.F': L('paw'),
  // Ingenieurwesen
  'I.a': L('gear'), 'I.b': L('kettle'), 'I.c': L('lens'), 'I.d': L('nozzle'), 'I.e': L('tube'), 'I.f': L('prism'),
  'I.g': L('snowflake'), 'I.h': L('drop', ov('skull', 15, 15, .5, true)), 'I.i': L('mirror'),
  'I.D1': L(ov('blaster', 3, -4, .55), ov('blaster', 3, 7, .55), ov('blaster', 3, 18, .55)),
  'I.D2': L(ov('blaster', 0, 2, .5), ov('bomb', 15, 0, .5), ov('gear', 8, 15, .5)),
  'I.D3': L('conveyor'), 'I.K': L('gauge'), 'I.M': L('wrench', ov('crown', 15, -1, .5, true)), 'I.S': L('bench'),
  'I.L1': L('crate', ov('gear', 16, 15, .5, true)), 'I.L2': L('sheet', ov('seal', 14, 14, .55, true)),
  // Schergenkunde
  'O.a': L('bowl'), 'O.b': L('whistle'), 'O.c': L('whetstone', 'sparks'), 'O.d': L('shield', 'fur'), 'O.e': L('cross'),
  'O.f': L('doubleaxe'), 'O.g': L('heads4'), 'O.h': L('mouth', 'waves'), 'O.i': L('cyclearrow'),
  'O.D1': L('heads6'), 'O.D2': L('trophy'), 'O.D3': L('shields3'), 'O.K': L('angry'),
  'O.M': L('helmet', ov('crown', 8, -4, .5)), 'O.S': L('gate'), 'O.L1': L('mug'), 'O.L2': L('drum'),
  // Finsterwirtschaft
  'W.a': L('coin'), 'W.b': L('tag'), 'W.c': L('pickaxe', 'nugget'), 'W.d': L('balls3'),
  'W.e': L(ov('coin', 4, -1, .75), 'wave'), 'W.f': L('coin', ov('percent', 15, 15, .5, true)),
  'W.g': L('sheet', ov('face', 4, 6, .6)), 'W.h': L('mask'), 'W.i': L('moon', ov('coin', 15, 15, .5, true)),
  'W.D1': L('fist', ov('coin', -1, 3, .5, true)), 'W.D2': L('chartup'), 'W.D3': L('building'), 'W.K': L('safe'),
  'W.M': L('tophat', ov('coin', 16, -1, .5, true)), 'W.S': L('vaultdoor'), 'W.L1': L('ledger'), 'W.L2': L('shovel'),
  // Hexenküche
  'X.a': L('battery'), 'X.b': L('battery', ov('bolt', 8, 3, .6, true)), 'X.c': L('moon', 'zz'),
  'X.d': L('magnet', ov('heart', 10, 0, .38)), 'X.e': L('recycle'),
  'X.f': L(ov('bomb', -2, -1, 1.15), ov('heartD', 4, 15, .35), ov('heartD', 12, 18, .3)),
  'X.g': L('snail'), 'X.h': L('sparkchain'), 'X.i': L('bottle', ov('ghost', 9, 13, .45)),
  'X.D1': L('flask'), 'X.D2': L('wand'), 'X.D3': L('witchhat'), 'X.K': L('flask', 'bubbles'),
  'X.M': L('book', ov('star', 10, 8, .4, true)), 'X.S': L('cauldron'), 'X.L1': L('shelf'), 'X.L2': L('scroll'),
  // Bollwerk
  'B.a': L('trowel'), 'B.b': L('block'), 'B.c': L('column'), 'B.d': L('wallpiece', 'spikes'),
  'B.e': L('hammer', ov('heart', 16, 15, .45, true)), 'B.f': L('lifering'), 'B.g': L('turret'),
  'B.h': L(ov('cauldron', 3, -5, .8), 'drops'), 'B.i': L('plate'), 'B.D1': L('castle'), 'B.D2': L('thorns'), 'B.D3': L('phoenix'),
  'B.K': L('castle', ov('heart', 16, 0, .45, true)), 'B.M': L('square', 'compass'), 'B.S': L('cornerstone'),
  'B.L1': L('wallpiece'), 'B.L2': L('bunker'),
  // Feindkunde
  'F.a': L('crosshair'), 'F.b': L('fort', ov('magnifier', 15, 14, .5, true)), 'F.c': L('crown', ov('magnifier', 15, 14, .5, true)),
  'F.d': L('cat'), 'F.e': L('balloon'), 'F.f': L('ears'), 'F.g': L('chick'), 'F.h': L('yarn'), 'F.i': L('dog'),
  'F.D1': L('crosshairOpen', ov('paw', 8.5, 8.5, .47, true)), 'F.D2': L('crook'), 'F.D3': L('target'),
  'F.K': L(ov('heart', 1, 1, .95), 'crossD'), 'F.M': L('notepad', ov('paw', 15, 15, .5, true)),
  'F.S': L('book', ov('paw', 15, 15, .5, true)), 'F.L1': L('book', ov('pen', 12, 11, .6, true)),
  'F.L2': L('crate', ov('fish', 14, 14, .55, true)),
  // Brücken, Außenring, Baupläne
  'bridge.IO': L('axe', ov('drop', 16, 15, .5, true)), 'bridge.OW': L('sack'), 'bridge.WX': L('bottle'),
  'bridge.XB': L('dome'), 'bridge.BF': L('bird'), 'bridge.FI': L('magnifier', ov('crack', 6, 5, .5)),
  'L.start': L('flag'), 'L.megalomania': L(ov('crown', -2, -2, 1.15)),
  'bp.paw': L('blueprint', ov('paw', 6, 6, .62)), 'bp.mane': L('blueprint', ov('lion', 6, 6, .62)),
  'bp.crown': L('blueprint', ov('crown', 6, 6, .62)), 'bp.carrot': L('blueprint', ov('carrot', 6, 6, .62)),
  'bp.carton': L('blueprint', ov('carton', 6, 6, .62)), 'bp.castle': L('blueprint', ov('castle', 6, 6, .62)),
};
