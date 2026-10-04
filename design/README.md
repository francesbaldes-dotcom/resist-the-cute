# Design-Paket: Buttons, Symbole, Schrift

Umsetzung der beschlossenen Richtung: Buttons im Stil „Comic-Kontur“, Symbole im Konturstil statt Emoji,
Masterplan mit Bildern für Knotenarten, Schulen und jeden einzelnen Knoten, Schrift Fredoka.
Die Vorschlagsseite dazu: https://claude.ai/artifact/3dVZ18a1fCQnH39MTu9CRa

Dieses Paket enthält alles, was das Quellprojekt zum Einbauen braucht. Das Einbauen selbst ist in
`ANLEITUNG.md` beschrieben. Am Spiel in diesem Repository ändert das Paket nichts.

## Inhalt

| Ordner | Inhalt |
| --- | --- |
| `icons/specials/` | 5 farbige Symbole für Schlafgas, Knuddelbombe, Schreckschrei, Kuschelmagnet, Zeitlupe (64×64 SVG, PNG 128 px) |
| `icons/ui/` | 24 weiße Leisten-Symbole, im Spiel per Tint einfärbbar (24×24 SVG, PNG 96 px) |
| `icons/masterplan/` | 132 weiße Symbole: 10 Knotenarten, 6 Schul-Embleme, 102 Knoten, 6 Brücken, 2 Vermächtnis, 6 Baupläne (32×32 SVG, PNG 128 px) |
| `icons/preview.html` | Kontaktbogen aller Masterplan-Symbole, getönt wie im Spiel |
| `icons/src/` | Generator: `primitives.mjs` (Grundformen), `motifs.mjs` (Motiv je Knoten), `build.mjs`, `build-ui.mjs`, `rasterize.mjs` |
| `fonts/` | Fredoka als variable Schrift (Latin, Latin Extended), `fredoka.css`, Lizenz `OFL.txt` |
| `reference/UiButton.ts` | Button-Klasse für Phaser 3 im neuen Stil, Ersatz für die bisherige Klasse |

Dateinamen der Masterplan-Symbole entsprechen den Knoten-IDs im Spiel, Punkte durch Bindestriche ersetzt:
`I-a.svg` für Knoten `I.a`, `bridge-IO.svg`, `kind-doctrine.svg`, `school-X.svg`, `bp-paw.svg`.

## Farben und Maße

| Zweck | Wert |
| --- | --- |
| Kontur | `#1b1026`, 3 px |
| Primär (Start, Weiter, Lernen) | Fläche `#ff5fa2`, Sockel `#c23a78`, Text `#fff4fb` |
| Sekundär (Spielstand, Tutorial, Zurück) | Fläche `#3b2a55`, Sockel `#1d1230`, Text `#fff4fb` |
| Los (Welle starten) | Fläche `#7cff6b`, Sockel `#3f9a36`, Text `#143012` |
| Gold (Etage, Kauf) | Fläche `#ffd84d`, Sockel `#b78f10`, Text `#3a2a00` |
| Leiste (Tempo, Pause, Speichern) | Fläche `#2a1a3e`, Sockel `#120a1c`, Text `#fff4fb` |
| Kosten (Energie, Gold) | Text `#ffd84d` mit Symbol `bolt` oder `coin` |
| Eckenradius | 18 px |
| Sockel | 6 px, beim Drücken sinkt die Fläche um 5 px |
| Lichtkante | obere 40 % der Fläche, Weiß mit 17 % Deckkraft, 5 px eingerückt |
| Mindestgröße | 52 × 52 px |
| Gesperrt | 45 % Deckkraft |
| Schrift | Fredoka 600, Buttons 22 px, großer Startknopf 26 px mit Versalien, Leiste 17 px |

Alle Werte sind in `reference/UiButton.ts` als `UI_COLORS` und `UI_METRICS` hinterlegt.

## Symbole im Spiel

- **Leisten-Symbole** sind weiß. Mit `setTint(Textfarbe)` passen sie sich jedem Button an (Gold-Button: dunkler Tint).
- **Spezialkräfte** sind farbig und werden nicht getönt. Jede Kraft hat eine feste Farbe: Schlafgas Blau, Knuddelbombe Pink, Schreckschrei Orange, Kuschelmagnet Pink-Rot, Zeitlupe Gelb-Grün.
- **Masterplan-Symbole** sind weiß mit dunklen Details (`#2c1d40`, die Knotenfarbe). Mit `setTint(Schulfarbe)` werden sie zur Farbe der Schule, die Details bleiben dunkel. Schulfarben wie bisher: I `#ffa043`, O `#6be35a`, W `#ffd84d`, X `#b98fff`, B `#8fb6e6`, F `#ff7bb6`.
- Laden als SVG (`this.load.svg(key, pfad, { width, height })`) oder als PNG aus `png/`. Die PNGs sind mit Chromium gerastert und auf allen Geräten identisch.

## Symbole nachbearbeiten

Gefällt ein Motiv nicht, in `icons/src/motifs.mjs` die Zeile des Knotens ändern (andere Grundform oder Kombination),
dann `node design/icons/src/build.mjs` und `node design/icons/src/rasterize.mjs` ausführen und den
Kontaktbogen `icons/preview.html` im Browser prüfen. Neue Grundformen kommen nach `primitives.mjs`
(Koordinatenraum 32×32, Weiß für Flächen, `D` für dunkle Details).

## Schrift

Fredoka steht unter der SIL Open Font License, darf also mit der App und auf der Webseite ausgeliefert werden.
`fonts/fredoka.css` bindet sie ein; die Schrift muss geladen sein, bevor Phaser Text zeichnet
(siehe `ANLEITUNG.md`, Schritt 2).
