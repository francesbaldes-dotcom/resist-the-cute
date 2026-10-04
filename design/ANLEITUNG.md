# Anleitung: Design-Paket ins Quellprojekt einbauen

Für die Sitzung, die im Quellprojekt von Resist the Cute arbeitet (Phaser 3, TypeScript, Vite).
Das Paket liegt im Build-Repository unter `design/`. Alle Schritte lassen sich einzeln umsetzen und
testen; die Reihenfolge ist nach Nutzen sortiert.

Bitte zuerst `design/README.md` lesen (Inhalt, Farben, Maße).

## 0. Dateien übernehmen

- `design/icons/specials/*.svg`, `design/icons/ui/*.svg`, `design/icons/masterplan/*.svg` nach `public/assets/icons/…`
  (oder die PNG-Fassungen aus den `png/`-Ordnern, wenn SVG-Laden Probleme macht).
- `design/fonts/Fredoka-latin.woff2`, `Fredoka-latin-ext.woff2`, `fredoka.css`, `OFL.txt` nach `public/fonts/`.
- `design/reference/UiButton.ts` nach `src/ui/UiButton.ts`.

## 1. Symbole laden

In der Boot-Szene (dort, wo heute Bilder und Sprites geladen werden):

```ts
const ui = ['speaker', 'speaker-off', 'music', 'music-off', 'vibe', 'vibe-off', 'pause', 'play', 'save', 'back',
  'bolt', 'coin', 'brain', 'tower', 'forward', 'upgrade', 'bulk', 'sell', 'close', 'globe', 'book', 'heart', 'check', 'skip'];
for (const n of ui) this.load.svg(`ui-${n}`, `assets/icons/ui/${n}.svg`, { width: 96, height: 96 });
for (const n of ['sleep', 'bomb', 'shout', 'magnet', 'slowmo']) this.load.svg(`special-${n}`, `assets/icons/specials/${n}.svg`, { width: 128, height: 128 });
// Masterplan: Knotenarten, Schulen, alle Knoten. Die IDs stehen in der Skill-Definition (M()).
for (const kind of ['core', 'small', 'notable', 'study', 'doctrine', 'keystone', 'mastery', 'socket', 'bridge', 'legacy'])
  this.load.svg(`mp-kind-${kind}`, `assets/icons/masterplan/kind-${kind}.svg`, { width: 128, height: 128 });
for (const s of ['I', 'O', 'W', 'X', 'B', 'F']) this.load.svg(`mp-school-${s}`, `assets/icons/masterplan/school-${s}.svg`, { width: 128, height: 128 });
for (const id of allSkillIds) this.load.svg(`mp-${id}`, `assets/icons/masterplan/${id.replace(/\./g, '-')}.svg`, { width: 128, height: 128 });
```

`allSkillIds` sind die Knoten-IDs (`I.a` … `F.L2`, `bridge.IO` …, `L.start`, `L.megalomania`) und die Bauplan-IDs (`bp.paw` …).

## 2. Schrift Fredoka

1. In `index.html` vor dem Spiel-Script: `<link rel="stylesheet" href="fonts/fredoka.css">`.
2. Die Schriftkonstante im Spiel (heute `"Arial Rounded MT Bold", "Nunito", system-ui, sans-serif`) ersetzen durch
   `"Fredoka", "Arial Rounded MT Bold", "Nunito", system-ui, sans-serif`. `UiButton.ts` exportiert sie als `UI_FONT`.
3. Vor `new Phaser.Game(...)` warten, bis die Schrift da ist, sonst zeichnet Phaser den ersten Text mit der Ersatzschrift:
   ```ts
   await Promise.all([document.fonts.load('600 20px Fredoka'), document.fonts.load('700 20px Fredoka')]).catch(() => undefined);
   ```
4. Gewicht: Buttons und Überschriften `fontStyle: '600'`, Kosten und Zahlen `'700'`.

## 3. Buttons umstellen

Die bisherige Button-Klasse (im Build `Q`) durch `UiButton` ersetzen. Die Signatur ist gleich geblieben:
`new UiButton(scene, x, y, text, { width, height, fontSize, color, textColor, onTap })`, dazu `setText`, `setEnabled`.
Neu: `icon`, `iconSize`, `iconColored`, `cost`, `costIcon`, `layout: 'stack'`, `sounds`.

Die Tipp-Töne, die bisher in der Klasse selbst gespielt wurden, kommen jetzt über `sounds: { tap: () => X.play('tap'), denied: () => X.play('denied') }`.
Am einfachsten einmal zentral setzen (z. B. kleine Fabrikfunktion `button(scene, …)`).

Konkrete Stellen und was sich ändert:

| Stelle | Heute | Neu |
| --- | --- | --- |
| Titel: Startknopf | `▶  SPIEL STARTEN` als Text | `icon: 'ui-play'`, Text `SPIEL STARTEN`, `fontSize: 26`, Breite 500 |
| Titel: Weiter · Welle n | Text mit ▶ | `icon: 'ui-play'` |
| Titel: Spielstand, Tutorial, Sprache | Emoji im Text (💾 📖 🌐) | `color: UI_COLORS.panel`, `icon: 'ui-save' / 'ui-book' / 'ui-globe'` |
| Titel: Ton, Musik, Vibration | 🔊🔇 🎵🚫 📳📴 | Textloser Button 52×52 mit `icon: 'ui-speaker'` bzw. `'ui-speaker-off'` usw.; Umschalten per `setTexture` auf dem Bild oder Button neu anlegen |
| Spiel: Zurück | `← Zurück` | `icon: 'ui-back'`, Text `Zurück` |
| Spiel: Masterplan | 🧠 mit Zahl-Badge | `icon: 'ui-brain'`; Badge bleibt |
| Spiel: Etage / Anbau | `Etage 💰140` | `color: UI_COLORS.gold`, `textColor: UI_COLORS.textGold`, `icon: 'ui-tower'`, `cost: 140`, `costIcon: 'ui-coin'`, `costIconColored: true` |
| Spiel: Tempo, Pause, Speichern | `1×`, ⏸, 💾 | `color: UI_COLORS.hud`; Tempo bleibt Text `1×`/`2×`, Pause `icon: 'ui-pause'`, Speichern `icon: 'ui-save'` |
| Spiel: Welle starten | `▶ Welle 15` | `color: UI_COLORS.go`, `textColor: UI_COLORS.textDark`, `icon: 'ui-play'` |
| Spiel: früher rufen | `⏩ Welle 16 +7 💰 früher` | `icon: 'ui-forward'`, zwei Zeilen wie heute, Gold-Button |
| Spezialkräfte | Emoji + Zahl | `layout: 'stack'`, `icon: 'special-sleep'` usw., `iconColored: true`, `iconSize: 34`, `cost: 40`, `costIcon: 'ui-bolt'`; bei laufendem Cooldown `setCost('12s')` |
| Gerätemenü: Aufrüsten, +5 Stufen, Verkaufen | ⬆ ⏫ 💸 im Text | Kachel-Überschrift mit `ui-upgrade`, `ui-bulk`, `ui-sell` als Bild links vom Text |
| Dialoge: Verstanden, Weiter, Zum Titel, Schließen, Lernen | Text mit ✓ ▶ 🧠 | `icon: 'ui-check' / 'ui-play' / 'ui-brain'` |
| Tutorial-Hinweis: Überspringen × | Text | `ui-skip` oder `ui-close` klein |

Der Pfeil-Emoji in Bannern und Hinweistexten (z. B. „▶ Welle“ im Lektionstext) kann bleiben, das sind Fließtexte.

## 4. Masterplan

In der Skilltree-Szene:

1. **Knotenarten (Ebene 1):** Die Glyph-Tabelle (`Za`: `notable: '★', doctrine: 'D', …`) und die Text-Objekte in `glyphs` durch Bilder ersetzen:
   ```ts
   const img = this.add.image(node.x, node.y, `mp-${node.id}` /* oder `mp-kind-${node.kind}` */)
     .setDisplaySize(r * 1.3, r * 1.3).setTint(schoolColor(node));
   ```
   `r` ist der Radius der Knotenart (`Xa`). Kleine Knoten bekommen `mp-kind-small` oder gar kein Bild.
2. **Schul-Embleme (Ebene 2):** Neben jedem Schulnamen am Rand (`drawSchoolBackdrop`) ein Bild `mp-school-${s}`, 28 px, getönt in Schulfarbe. Auf der Karte rechts vor dem Schulnamen ebenfalls, 20 px.
3. **Knoten-Motive (Ebene 3):** Für jeden Knoten `mp-${id}` statt des Art-Symbols verwenden; die Form (Kreis, Sechseck, Stern, Achteck, Raute) bleibt. Brücken und Vermächtnis-Knoten haben eigene Bilder (`bridge-IO` …, `L-start`, `L-megalomania`). Baupläne (`bp-*`) im Sockel-Dialog neben dem Namen zeigen.
4. Knotenbilder bei „gelernt“ voll deckend, sonst 60 % Deckkraft, so wie heute die Glyphen.

Schulfarben und Knotenfarbe bleiben, wie sie sind.

## 5. Prüfen

- Titel, Spiel, Gerätemenü, Pause, Spielstand-Dialog, Masterplan in Deutsch und Englisch durchklicken.
- Buttons bei gesperrtem Zustand (zu wenig Gold, Cooldown) und beim Drücken (Fläche sinkt auf den Sockel).
- Auf einem Android-Gerät oder in Chrome prüfen, dass Fredoka geladen ist (keine Ersatzschrift).

## 6. Für die iOS-App wichtig

Das Build-Repository verpackt den fertigen Build mit `scripts/prepare-www.mjs` für die App. Das Skript sucht im
gebauten Bundle zwei Ankerpunkte:

- `ads:{enabled:true,` in der Spielkonfiguration (schaltet die Werbe-Attrappen ab)
- den Konstruktor der Titel-Szene: `super('Title')}create(){` (hängt den Datenschutz-Link an)

Bleiben Konfigurationsschlüssel `ads.enabled` und der Szenenname `Title` bestehen, läuft alles weiter. Ändert sich
eines davon, bricht das Skript beim nächsten `npm run sync:ios` mit einer klaren Meldung ab; dann die beiden
Suchmuster im Skript anpassen.

## 7. Außerdem offen im Quellprojekt

- Versionsanzeige „Version 0.0.1“ auf dem Titelbildschirm auf die Release-Version setzen (1.0).
- App-Icon aus dem Original-Artwork in 1024×1024 exportieren (für den App Store).
