// Bereitet den Ordner www/ für Capacitor vor.
//
// Die fertige Web-App liegt im Stamm des Repos (index.html, assets/, icons/, manifest.webmanifest),
// weil GitHub Pages von dort ausliefert. Capacitor braucht einen eigenen Ordner, der NUR die
// Web-Dateien enthält. Dieses Skript kopiert sie nach www/ und passt die Kopie für die native App an.
// Die Dateien im Repo-Stamm, also die Web-Version, bleiben unverändert.
// Aufruf: npm run www   (oder automatisch über: npm run sync:ios)
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const www = join(root, 'www');
// fonts/: Schrift Fredoka (seit Build 37f6ebb), index.html bindet fonts/fredoka.css ein
const items = ['index.html', 'assets', 'icons', 'fonts', 'manifest.webmanifest', 'privacy.html'];

for (const item of items) {
  if (!existsSync(join(root, item))) throw new Error(`Datei fehlt im Repo-Stamm: ${item}`);
}
rmSync(www, { recursive: true, force: true });
mkdirSync(www);
for (const item of items) cpSync(join(root, item), join(www, item), { recursive: true });
const notes = [];

// ---------------------------------------------------------------------------
// 1. Spielcode anpassen
// ---------------------------------------------------------------------------
const assetsDir = join(www, 'assets');
const bundles = readdirSync(assetsDir).filter((f) => /^index-.+\.js$/.test(f));
if (bundles.length !== 1) throw new Error(`Erwartet genau ein Spiel-Bundle in assets/, gefunden: ${bundles.length}`);
const bundlePath = join(assetsDir, bundles[0]);
let js = readFileSync(bundlePath, 'utf8');

// 1a. Platzhalter-Werbung abschalten.
// Das Spiel enthält Belohnungs-Werbung nur als Attrappe (Dialog "Werbung (Platzhalter) – Hier läuft später
// ein kurzes Video"). Apple lehnt Platzhalter-Inhalte ab (Richtlinie 2.1), außerdem wäre "keine Werbung"
// in den Store-Texten sonst falsch. Alle Werbe-Knöpfe hängen an EINEM Schalter in der Spielkonfiguration
// (ads.enabled), der hier auf false gesetzt wird. Findet das Skript den Schalter nicht eindeutig
// (z. B. nach einem neuen Build mit anderer Struktur), bricht es ab, statt die Platzhalter auszuliefern.
const adsOn = /ads:\{enabled:(?:!0|true),/g;
const adsOff = /ads:\{enabled:(?:!1|false),/g;
const onCount = (js.match(adsOn) ?? []).length;
const offCount = (js.match(adsOff) ?? []).length;
if (onCount === 1 && offCount === 0) {
  js = js.replace(adsOn, 'ads:{enabled:!1,');
  notes.push('Werbe-Platzhalter abgeschaltet');
} else if (onCount === 0 && offCount === 1) {
  notes.push('Werbung ist im Build bereits abgeschaltet');
} else {
  throw new Error(
    `Werbe-Schalter (ads.enabled) in ${bundles[0]} nicht eindeutig gefunden (an: ${onCount}, aus: ${offCount}). ` +
      'Bitte prüfen, ob der Build jetzt echte Werbung enthält oder die Konfiguration anders aufgebaut ist.',
  );
}

// 1b. Datenschutz-Link auf dem Titelbildschirm.
// Apple verlangt einen Link zur Datenschutzerklärung auch IN der App (Richtlinie 5.1.1). Die Titel-Szene
// ruft dafür beim Aufbau window.__rtcTitle(scene) auf, definiert in index.html (Abschnitt 2).
// Ankerpunkt ist der Konstruktor der Szene "Title". Fehlt er, bricht das Skript ab.
const titleHook = /super\(`Title`\)\}create\(\)\{/g;
const hookCount = (js.match(titleHook) ?? []).length;
if (hookCount !== 1) {
  throw new Error(
    `Titel-Szene in ${bundles[0]} nicht eindeutig gefunden (${hookCount} Treffer). ` +
      'Der Datenschutz-Link lässt sich nicht einfügen. Bitte die Stelle im Skript an den neuen Build anpassen.',
  );
}
js = js.replace(titleHook, (m) => `${m}globalThis.__rtcTitle&&globalThis.__rtcTitle(this);`);
notes.push('Datenschutz-Link auf dem Titelbildschirm');
writeFileSync(bundlePath, js);

// ---------------------------------------------------------------------------
// 2. index.html: Skript vor dem Spielcode
// ---------------------------------------------------------------------------
// Es läuft vor dem Spiel, weil Modul-Skripte erst nach dem Parsen ausgeführt werden.
const appScript = `<script>
      // Datenschutz-Link auf dem Titelbildschirm. Die Titel-Szene ruft diese Funktion beim Aufbau auf.
      // Der Link steht links neben dem Versions-Label, im selben Stil, und öffnet die mitgelieferte privacy.html.
      window.__rtcTitle = function (scene) {
        try {
          var en = (document.documentElement.lang || '').slice(0, 2) === 'en';
          var link = null, ver = null, padX = 22, padY = 22, gap = 28;
          var findVersion = function () {
            var list = (scene.children && scene.children.list) || [];
            for (var i = list.length - 1; i >= 0; i--) {
              var o = list[i];
              if (o && o !== link && o.type === 'Text' && String(o.text || '').indexOf('Version ') === 0) return o;
            }
            return null;
          };
          var place = function () {
            if (!link || !link.active) return;
            if (!ver || !ver.active) ver = findVersion();
            if (ver) link.setPosition(ver.x - ver.displayWidth - gap + padX, ver.y + padY);
            else link.setPosition(scene.scale.width - 220 + padX, scene.scale.height - 20 + padY);
          };
          // Erst nach dem Aufbau der Szene anlegen, damit der Link über dem Hintergrund liegt.
          scene.events.once('update', function () {
            ver = findVersion();
            var st = ver ? ver.style : {};
            link = scene.add.text(0, 0, en ? 'Privacy' : 'Datenschutz', {
              fontFamily: st.fontFamily || 'system-ui, sans-serif',
              fontSize: st.fontSize || '18px',
              color: '#ff8cc6',
              stroke: st.stroke || '#0d0714',
              strokeThickness: st.strokeThickness || 4
            }).setOrigin(1, 1).setPadding(padX, padY, padX, padY);
            link.setInteractive({ useHandCursor: true });
            link.on('pointerup', function () { location.href = 'privacy.html#' + (en ? 'en' : 'de'); });
            place();
            scene.events.on('postupdate', place);
            scene.events.once('shutdown', function () { scene.events.off('postupdate', place); });
          });
        } catch (e) {}
      };

      // Native iOS-App (Capacitor): Das Spiel soll sich wie eine installierte App verhalten.
      (function () {
        var cap = window.Capacitor;
        if (!cap || typeof cap.isNativePlatform !== 'function' || !cap.isNativePlatform()) return;
        // Das Spiel blendet den Vollbild-Button samt Safari-Hinweis nur aus, wenn es als
        // installierte App läuft. In der nativen App ist das immer der Fall.
        try { Object.defineProperty(navigator, 'standalone', { value: true, configurable: true }); } catch (e) {}
        // iOS kennt navigator.vibrate nicht. Der Vibrations-Schalter des Spiels läuft deshalb
        // über das Capacitor-Haptics-Plugin: jeder Impuls des Musters wird ein haptischer Schlag.
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
html = html.replace(marker, `${appScript}\n    ${marker}`);
writeFileSync(indexPath, html);

// ---------------------------------------------------------------------------
// 3. privacy.html: "Zurück zum Spiel" ergänzen
// ---------------------------------------------------------------------------
// In der App gibt es keine Browserleiste. Ohne diesen Link käme man von der Datenschutzseite nicht zurück.
// Links zu fremden Seiten öffnet Capacitor in Safari, die App bleibt dabei auf der Datenschutzseite.
const privacyPath = join(www, 'privacy.html');
let privacy = readFileSync(privacyPath, 'utf8');
const inject = (anchor, text, before) => {
  if (privacy.split(anchor).length !== 2) throw new Error(`privacy.html: "${anchor}" nicht genau einmal gefunden`);
  privacy = privacy.replace(anchor, before ? `${text}${anchor}` : `${anchor}${text}`);
};
// Die App schaltet das Scrollen des WebViews ab (capacitor.config.json, scrollEnabled: false), damit sich das Spiel
// nicht verschiebt. Die Datenschutzseite scrollt deshalb in sich selbst: html bleibt fest, body wird zum Scrollbereich.
inject('</style>', '  html { height: 100%; overflow: hidden; }\n  body { height: 100%; box-sizing: border-box; overflow-y: auto; -webkit-overflow-scrolling: touch; padding-left: max(1.25rem, env(safe-area-inset-left)); padding-right: max(1.25rem, env(safe-area-inset-right)); }\n', true);
privacy = privacy.replace('<meta name="viewport" content="width=device-width, initial-scale=1">', '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">');
inject('</style>', '  .zurueck { position: sticky; top: 0; z-index: 1; margin: -1.5rem -1.25rem 0; padding: .9rem 1.25rem; background: var(--bg); border-bottom: 1px solid var(--line); font-weight: 600; }\n  #de, #en { scroll-margin-top: 4.5rem; }\n', true);
inject('<body>', '\n<p class="zurueck"><a href="./" id="zurueck">← Zurück zum Spiel</a></p>', false);
inject('</body>', "<script>if (location.hash === '#en') { var z = document.getElementById('zurueck'); if (z) z.textContent = '← Back to the game'; }</script>\n", true);
writeFileSync(privacyPath, privacy);
const placeholders = (privacy.match(/class="platzhalter"/g) ?? []).length;

console.log(`www/ vorbereitet: ${items.join(', ')} – ${notes.join('; ')}`);
if (placeholders > 0) {
  console.warn(
    `\n⚠️  privacy.html enthält noch ${placeholders} Platzhalter für Name, Anschrift und E-Mail.\n` +
      '   Die App zeigt diese Seite über den Datenschutz-Link an. Vor dem Upload ersetzen.\n' +
      '   Prüfen mit: npm run check:privacy\n',
  );
}
