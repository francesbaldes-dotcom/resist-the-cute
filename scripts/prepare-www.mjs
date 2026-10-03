// Bereitet den Ordner www/ für Capacitor vor.
//
// Die fertige Web-App liegt im Stamm des Repos (index.html, assets/, icons/, manifest.webmanifest),
// weil GitHub Pages von dort ausliefert. Capacitor braucht einen eigenen Ordner, der NUR die
// Web-Dateien enthält. Dieses Skript kopiert sie nach www/ und passt index.html für die native App an.
// Aufruf: npm run www   (oder automatisch über: npm run sync:ios)
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const www = join(root, 'www');
const items = ['index.html', 'assets', 'icons', 'manifest.webmanifest'];

for (const item of items) {
  if (!existsSync(join(root, item))) throw new Error(`Web-Datei fehlt im Repo-Stamm: ${item}`);
}
rmSync(www, { recursive: true, force: true });
mkdirSync(www);
for (const item of items) cpSync(join(root, item), join(www, item), { recursive: true });

// Anpassungen für die native App. Das Skript steht vor dem Spielcode und läuft vor ihm
// (Modul-Skripte werden erst nach dem Parsen ausgeführt). Im normalen Browser tut es nichts.
const nativeScript = `<script>
      // Native iOS-App (Capacitor): Das Spiel soll sich wie eine installierte App verhalten.
      (function () {
        var cap = window.Capacitor;
        if (!cap || typeof cap.isNativePlatform !== 'function' || !cap.isNativePlatform()) return;
        // 1. Das Spiel blendet den Vollbild-Button (samt Safari-Hinweis) nur aus, wenn es als
        //    installierte App läuft. In der nativen App ist das immer der Fall.
        try { Object.defineProperty(navigator, 'standalone', { value: true, configurable: true }); } catch (e) {}
        // 2. iOS kennt navigator.vibrate nicht. Der Vibrations-Schalter des Spiels läuft deshalb
        //    über das Capacitor-Haptics-Plugin: jeder Impuls des Musters wird ein haptischer Schlag.
        if (typeof navigator.vibrate !== 'function' && typeof cap.nativePromise === 'function') {
          navigator.vibrate = function (pattern) {
            var p = Array.isArray(pattern) ? pattern : [pattern];
            var at = 0;
            for (var i = 0; i < p.length; i += 2) {
              var on = Number(p[i]) || 0;
              var style = on >= 100 ? 'HEAVY' : on >= 40 ? 'MEDIUM' : 'LIGHT';
              setTimeout(function (s) { cap.nativePromise('Haptics', 'impact', { style: s }).catch(function () {}); }, at, style);
              at += on + (Number(p[i + 1]) || 0);
            }
            return true;
          };
        }
      })();
    </script>`;
const indexPath = join(www, 'index.html');
let html = readFileSync(indexPath, 'utf8');
const marker = '<script type="module"';
if (!html.includes(marker)) throw new Error('index.html: Modul-Skript des Spiels nicht gefunden');
html = html.replace(marker, `${nativeScript}\n    ${marker}`);
writeFileSync(indexPath, html);
console.log(`www/ vorbereitet: ${items.join(', ')} – index.html für die native App angepasst`);
