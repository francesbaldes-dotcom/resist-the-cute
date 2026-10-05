# Übergabe an das Quellprojekt: Optik und Tutorial

Stand 4. Oktober 2026. Für die Sitzung, die im Quellprojekt von Resist the Cute arbeitet (Phaser 3, TypeScript, Vite).
Dieses Build-Repository enthält nur den fertigen Build; Texte, Logik und Szenen liegen im Quellprojekt.
Alles Nötige zum Einbauen liegt im Ordner `design/` dieses Repositories.

Zwei Dinge dürfen sich im Quellprojekt nicht ändern, weil das Build-Repository den Build damit für die iOS-App
verpackt (`scripts/prepare-www.mjs`): der Konfigurationsschlüssel `ads.enabled` (im Bundle als `ads:{enabled:true,`)
und der Szenenname `Title`. Ändert sich eines davon, bricht `npm run sync:ios` mit einer klaren Meldung ab.

Hintergrund und Bilder:

- Vorschlagsseite zur Optik (beschlossen: Richtung A „Comic-Kontur“): https://claude.ai/artifact/3dVZ18a1fCQnH39MTu9CRa
- Prüfung des Tutorials mit Screenshots: https://claude.ai/artifact/7eyY5sW5A6XNTjjCgxbfUy
- Schritt-für-Schritt-Einbau der Optik mit Codebeispielen: `design/ANLEITUNG.md`, Farben und Maße: `design/README.md`

---

## Teil A: Optische Änderungen

### A1. Schrift Fredoka

- Dateien: `design/fonts/Fredoka-latin.woff2`, `Fredoka-latin-ext.woff2`, `fredoka.css`, Lizenz `OFL.txt` (SIL Open Font License, darf mit App und Webseite ausgeliefert werden). Ziel: `public/fonts/`.
- `index.html`: vor dem Spiel-Script `<link rel="stylesheet" href="fonts/fredoka.css">`.
- Schriftkonstante im Spiel (heute `"Arial Rounded MT Bold", "Nunito", system-ui, sans-serif`) wird
  `"Fredoka", "Arial Rounded MT Bold", "Nunito", system-ui, sans-serif`.
- Vor `new Phaser.Game(...)` warten, bis die Schrift geladen ist, sonst zeichnet Phaser den ersten Text mit der Ersatzschrift:
  `await Promise.all([document.fonts.load('600 20px Fredoka'), document.fonts.load('700 20px Fredoka')]).catch(() => undefined);`
- Gewichte: Buttons und Überschriften `fontStyle: '600'`, Kosten und Zahlen `'700'`.

### A2. Buttons im Stil „Comic-Kontur“

Neue Klasse `design/reference/UiButton.ts` (Ziel `src/ui/UiButton.ts`) ersetzt die bisherige Button-Klasse (im Build `Q`).
Die Signatur ist gleich geblieben: `new UiButton(scene, x, y, text, { width, height, fontSize, color, textColor, onTap })`,
dazu `setText`, `setEnabled`. Neu: `icon`, `iconSize`, `iconColored`, `cost`, `costIcon`, `costIconColored`, `layout: 'row' | 'stack'`,
`setCost`, `sounds: { tap, denied }` (die Tipp-Töne werden nicht mehr in der Klasse selbst gespielt).

| Maß | Wert |
| --- | --- |
| Kontur | `#1b1026`, 3 px |
| Eckenradius | 18 px |
| Sockel | 6 px unter der Fläche; beim Drücken sinkt die Fläche um 5 px |
| Lichtkante | obere 40 % der Fläche, Weiß mit 17 % Deckkraft, 5 px eingerückt |
| Mindestgröße | 52 × 52 px (Daumen) |
| Gesperrt | 45 % Deckkraft, Tipp löst ein kurzes Wackeln und den „denied“-Ton aus |
| Schrift | Fredoka 600; Buttons 22 px, großer Startknopf 26 px in Versalien, Leiste 17 px |

Farbrollen (Fläche / Sockel / Text):

| Rolle | Fläche | Sockel | Text |
| --- | --- | --- | --- |
| Primär (Spiel starten, Weiter, Lernen, Verstanden) | `#ff5fa2` | `#c23a78` | `#fff4fb` |
| Sekundär (Spielstand, Tutorial, Sprache, Zurück) | `#3b2a55` | `#1d1230` | `#fff4fb` |
| Los (Welle starten) | `#7cff6b` | `#3f9a36` | `#143012` |
| Gold (Etage, Anbau, Kauf, früher rufen) | `#ffd84d` | `#b78f10` | `#3a2a00` |
| Leiste (Tempo, Pause, Speichern, Spezialkräfte) | `#2a1a3e` | `#120a1c` | `#fff4fb` |
| Kosten (Energie, Gold) | Text `#ffd84d` mit Symbol `bolt` oder `coin` | | |

Alle Werte stehen in `UiButton.ts` als `UI_COLORS` und `UI_METRICS`.

Welche Buttons sich wie ändern:

| Stelle | Heute | Neu |
| --- | --- | --- |
| Titel: Startknopf | `▶  SPIEL STARTEN` als Text | `icon: 'ui-play'`, Text `SPIEL STARTEN`, 26 px, Breite 500 |
| Titel: Weiter · Welle n | Text mit ▶ | `icon: 'ui-play'` |
| Titel: Spielstand, Tutorial, Sprache | Emoji im Text (💾 📖 🌐) | Sekundär, `icon: 'ui-save' / 'ui-book' / 'ui-globe'` |
| Titel: Ton, Musik, Vibration | 🔊🔇 🎵🚫 📳📴 | textlose 52 × 52-Buttons mit `ui-speaker(-off)`, `ui-music(-off)`, `ui-vibe(-off)` |
| Spiel: Zurück | `← Zurück` | `icon: 'ui-back'`, Text `Zurück` |
| Spiel: Masterplan | 🧠 mit Zahl-Badge | `icon: 'ui-brain'`, Badge bleibt |
| Spiel: Etage / Anbau | `Etage 💰140` | Gold, `icon: 'ui-tower'`, `cost: 140`, `costIcon: 'ui-coin'`, `costIconColored: true` |
| Spiel: Tempo, Pause, Speichern | `1×`, ⏸, 💾 | Leiste; Tempo bleibt Text `1×`/`2×`, Pause `ui-pause`, Speichern `ui-save` |
| Spiel: Welle starten | `▶ Welle 15` | Los, `icon: 'ui-play'` |
| Spiel: früher rufen | `⏩ Welle 16 +7 💰 früher` | Gold, `icon: 'ui-forward'`, zwei Zeilen wie heute |
| Spezialkräfte | Emoji + Zahl | `layout: 'stack'`, `icon: 'special-sleep'` usw., `iconColored: true`, `iconSize: 34`, `cost: 40`, `costIcon: 'ui-bolt'`; bei Abklingzeit `setCost('12s')` |
| Gerätemenü: Aufrüsten, +5 Stufen, Verkaufen | ⬆ ⏫ 💸 im Text | Kachel-Überschrift mit `ui-upgrade`, `ui-bulk`, `ui-sell` als Bild links vom Text |
| Dialoge: Verstanden, Weiter, Zum Titel, Schließen, Lernen | Text mit ✓ ▶ 🧠 | `icon: 'ui-check' / 'ui-play' / 'ui-brain'` |
| Tutorial-Sprechblase: Überspringen ✕ | Text | `ui-skip` oder `ui-close` klein |

Pfeil-Emoji in Bannern und Fließtexten können bleiben.

### A3. Symbole statt Emoji

- `design/icons/ui/`: 24 weiße Leisten-Symbole (24 × 24 SVG, PNG 96 px): speaker, speaker-off, music, music-off, vibe, vibe-off,
  pause, play, save, back, bolt, coin, brain, tower, forward, upgrade, bulk, sell, close, globe, book, heart, check, skip.
  Im Spiel mit `setTint(Textfarbe)` einfärben, dann passen sie zu jedem Button (Gold-Button: dunkler Tint).
- `design/icons/specials/`: 5 farbige Symbole (64 × 64 SVG, PNG 128 px), werden nicht getönt. Feste Farben:
  Schlafgas Blau, Knuddelbombe Pink, Schreckschrei Orange, Kuschelmagnet Pink-Rot, Zeitlupe Gelb-Grün.
- Laden als SVG (`this.load.svg(key, pfad, { width, height })`) oder als PNG aus den `png/`-Ordnern (mit Chromium gerastert, auf allen Geräten identisch).
- Ziel im Quellprojekt: `public/assets/icons/ui/`, `public/assets/icons/specials/`, `public/assets/icons/masterplan/`.

### A4. Masterplan mit Bildern

`design/icons/masterplan/`: 132 weiße Symbole mit dunklen Details (`#2c1d40`, die Knotenfarbe), 32 × 32 SVG, PNG 128 px:
10 Knotenarten (`kind-core`, `kind-small`, `kind-notable`, `kind-study`, `kind-doctrine`, `kind-keystone`, `kind-mastery`, `kind-socket`, `kind-bridge`, `kind-legacy`),
6 Schul-Embleme (`school-I` … `school-F`), 102 Knoten, 6 Brücken (`bridge-IO` …), 2 Vermächtnis (`L-start`, `L-megalomania`), 6 Baupläne (`bp-paw` …).
Dateinamen sind die Knoten-IDs mit Bindestrich statt Punkt: `I-a.svg` für `I.a`.

Mit `setTint(Schulfarbe)` werden sie zur Farbe der Schule, die Details bleiben dunkel. Schulfarben wie bisher:
I `#ffa043`, O `#6be35a`, W `#ffd84d`, X `#b98fff`, B `#8fb6e6`, F `#ff7bb6`.

Drei Ebenen in der SkillTree-Szene:

1. **Knotenarten:** Glyph-Tabelle (`notable: '★', doctrine: 'D', …`) und die Text-Objekte durch Bilder ersetzen,
   `setDisplaySize(r * 1.3, r * 1.3)`, `r` ist der Radius der Knotenart. Kleine Knoten bekommen `kind-small` oder kein Bild.
2. **Schul-Embleme:** neben jedem Schulnamen am Rand ein Bild `school-<S>`, 28 px, in Schulfarbe; auf der Karte vor dem Schulnamen 20 px.
3. **Knoten-Motive:** je Knoten `mp-<id>` statt des Art-Symbols; die Form (Kreis, Sechseck, Stern, Achteck, Raute) bleibt.
   Baupläne (`bp-*`) im Sockel-Dialog neben dem Namen zeigen.

Gelernte Knoten voll deckend, sonst 60 % Deckkraft, so wie heute die Glyphen. Knotenfarbe und Schulfarben bleiben.

Gefällt ein Motiv nicht: in `design/icons/src/motifs.mjs` die Zeile des Knotens ändern, dann
`node design/icons/src/build.mjs` und `node design/icons/src/rasterize.mjs` ausführen; Kontaktbogen `design/icons/preview.html`.

### A5. Außerdem offen im Quellprojekt

- Versionsanzeige „Version 0.0.1“ auf dem Titelbildschirm auf die Release-Version setzen (1.0).
- App-Icon aus dem Original-Artwork in 1024 × 1024 exportieren (für den App Store).

---

## Teil B: Tutorial

Das Tutorial besteht aus Sprechblasen des Schurken (Schritte wie `build`, `startWave`, `specials`; Texte `tut*`) und
Lektionsfenstern (`lesson_<id>_title` / `lesson_<id>_text`, Liste mit `when`-Bedingungen). Alle Zahlen in den Texten stimmen
mit der Konfiguration überein; es geht um Logik, Länge und Darstellung.

### B1. Logik

1. **„Überspringen ✕“ an der Sprechblase** schließt nur den aktuellen Schritt (`complete(step)`), nicht mehr `skipAll()`.
   Das Abschalten aller Erklärungen bleibt beim Link „Alle Erklärungen aus“ im Lektionsfenster.
   Heute ruft der Callback `onSkipTutorial` in der Game-Szene `tutorial.skipAll()` auf; wer in Welle 1 die Begrüßung wegtippt,
   sieht nie die Hinweise zu Hasen, Küken, Eiern oder Festung.
2. **Sprechblasen-Höhe aus dem Text berechnen.** Heute ist das Panel fest 660 × 96 Pixel, Text 22 px fett mit Umbruchbreite 410.
   Drei Zeilen passen; „Spezialkräfte“ und „Kaserne“ brauchen fünf und ragen über den Rand und über das Banner „Welle n geschafft!“.
   Höhe = Texthöhe + 48, mindestens 96; Schurkenbild und „Überspringen“ vertikal zentrieren. Zusätzlich die Texte kürzen (B2).
3. **Höchstens ein Lektionsfenster pro Welle.** Wenn in dieser Welle schon eine Lektion gezeigt wurde, die nächste erst in der
   folgenden Welle bringen. Außerdem die Auslöser ändern: `masterplan` nicht bei `skillPoints > 0`, sondern beim ersten Öffnen
   des Masterplans (SkillTree-Szene); `heroes` nicht bei `wave >= 11`, sondern ab `wave >= 15`. Damit entfällt das Doppel in
   Welle 3 (Energie + Masterplan) und das Dreifache in Welle 11 (Siegfenster + Schneller vorankommen + Helden).
4. **Hinweis `specials`** erst in der laufenden Welle und mit mindestens drei Tieren auf dem Feld:
   `running && enemiesOnField >= 3 && specialsReady`. Heute erscheint er in der Bauphase und zeigt mit dem Finger auf den
   Schlafgas-Knopf; ein Tipp verpufft dann 40 Energie ohne Gegner.
5. **Frühes Rufen („⏩ früher“)** erst ab Welle 5 anbieten. Neuer Hinweisschritt `early` mit Text `tutEarly`, Ziel ist der Knopf,
   erscheint beim ersten Auftauchen des Knopfs, Auto-Ende nach 8 Sekunden. Den Absatz zu „früher“ in `lesson_afterBoss_text` streichen.
   Heute erscheint der Knopf schon in Welle 1 an der Stelle des Startknopfs und wird erst in Welle 11 erklärt.
6. **Titelknopf „📖 Tutorial“**: Beschriftung `tutorialAgain` wird „Erklärungen wieder an“ / „Explanations on again“.
   Verhalten bleibt (löscht `settings.lessons` und `settings.tutorial`).
7. **Schriftgrößen.** Auf dem iPhone wird die Spielfläche mit Faktor 0,55 verkleinert; Lektionstext ist dann 12,6 pt,
   Sprechblase 12 pt, „Überspringen ✕“ und „Alle Erklärungen aus“ 9,8 pt (Apple: Untergrenze 11 pt, Fließtext 17 pt).
   Neu: Lektionstext 23 → 28 px, Sprechblase 22 → 26 px, Kleinschrift 18 → 22 px. Mit den gekürzten Texten passt das weiter
   ins 1000 × 620-Fenster; `lesson_masterplanDeep_text` (503 Zeichen) danach prüfen und notfalls kürzen.
8. **Masterplan erklärt seine Knotenarten selbst.** Beim Antippen eines Doktrin-, Schlussstein-, Sockel-, Meisterschafts- oder
   Studien-Knotens im Infofeld rechts eine Zeile einblenden (Texte in B2). Die Lektion `masterplanDeep` kann dann entfallen.
9. **Emoji in Hinweistexten** (🧠 💤 💣 📣 ⚡ ⏩) durch Namen ersetzen, weil die Knöpfe mit dem neuen Symbol-Design keine Emoji
   mehr zeigen. Die Texte in B2 sind schon so formuliert. „Tipp unten auf“ überall zu „Tippe“ angleichen.

### B2. Texte

Sprechblasen (Schlüssel: DE / EN). Alle nicht genannten Sprechblasen bleiben unverändert.

| Schlüssel | Deutsch | Englisch |
| --- | --- | --- |
| `tutBuild` | Tippe auf ein freies Feld im Turm, um ein Gerät zu bauen. | Tap a free slot in the tower to build a gadget. |
| `tutSpecials` | Viele Tiere? Tippe auf Schlafgas – alle schlafen ein. Kostet 40 Energie. | Too many animals? Tap sleep gas – they all doze off. Costs 40 energy. |
| `tutSkills` | Ein Schurkenpunkt! Tippe unten auf den Masterplan und lerne eine Gemeinheit. | A villain point! Tap the master plan below and learn a new trick. |
| `tutBarracks` | Neu: die Kaserne! Meine Orks halten die Tiere vor dem Turm auf. Tippe sie an! | New: the barracks! My orcs hold the animals off in front of the tower. Tap it! |
| `tutPack` | Ein Hunderudel! Fällt einer, werden die anderen wütend – Schlafgas hilft. | A dog pack! When one falls, the others get angry – sleep gas helps. |
| `tutFortress` | Eine Katzen-Festung! Sie schickt Nachschub, bis du sie zerlegst – nimm den Laser. | A cat fortress! It sends more cats until you tear it down – use the laser. |
| `tutEarly` (neu) | Ungeduldig? „Früher“ ruft die nächste Welle sofort – dafür gibt’s Bonusgold. | Impatient? “Early” calls the next wave right away – with bonus gold. |
| `tutorialAgain` | Erklärungen wieder an | Explanations on again |

Lektionen (Absätze durch Leerzeile getrennt; Titel bleiben):

`lesson_welcome_text` (DE):

> Links mein Turm, rechts kommen die süßen Tiere aus dem Korb. Erreichen sie den Turm, knuddeln sie ihn – und die grüne Lebensleiste oben sinkt.
>
> Bau Geräte auf die freien Felder im Turm: Die Kanone trifft ein Ziel, der Schleimwerfer bremst, der Laser durchschlägt mehrere Tiere. Jeder Treffer bringt Gold.

`lesson_welcome_text` (EN):

> My tower stands on the left; the cute animals come out of the basket on the right. When they reach the tower they cuddle it – and the green health bar at the top drops.
>
> Build gadgets on the free slots in the tower: the cannon hits one target, the slimer slows, the laser shoots through several animals. Every hit earns gold.

`lesson_firstWin_text` (DE):

> Tippe ein gebautes Gerät an, um es aufzurüsten oder zu verkaufen. Aufrüsten lohnt sich fast immer mehr als ein neues Gerät.
>
> Tippe ein Tier an, und alle Geräte zielen darauf.
>
> „Etage“ unten links kauft einen weiteren Geräteplatz. 1×/2× stellt das Tempo, ⏸ hält an, 💾 speichert – immer den Stand vom Anfang der Welle.

`lesson_firstWin_text` (EN):

> Tap a built gadget to upgrade or sell it. Upgrading almost always beats a new gadget.
>
> Tap an animal and all gadgets aim at it.
>
> “Floor” at the bottom left buys another gadget slot. 1×/2× sets the speed, ⏸ pauses, 💾 saves – always the state from the start of the wave.

`lesson_masterplan_text` (DE):

> Alle 2 Wellen bekommst du einen Schurkenpunkt, dazu welche für Bosse.
>
> Der Masterplan ist ein Rad aus sechs Schulen. Du lernst vom Kern aus nach außen, immer einen Nachbarn von etwas Gelerntem. Tippe einen Knoten an, und ich erkläre ihn dir.
>
> Lernen und Umlernen geht nur zwischen den Wellen; „Alles zurück“ ist einmal je Partie gratis.

`lesson_masterplan_text` (EN):

> You get a villain point every 2 waves, plus some for bosses.
>
> The Master Plan is a wheel of six schools. You learn from the core outwards, always a neighbor of something you already learned. Tap a node and I’ll explain it.
>
> Learning and unlearning only between waves; “Reset all” is free once per game.

`lesson_afterBoss_text`: den mittleren Absatz („Sind alle Tiere einer Welle unterwegs …“ / „Once all animals of a wave …“) streichen, Rest bleibt.

`lesson_heroes_text` (DE): „die Dachschützin beim Versteck“ → „den Dachschützen beim Versteck“, passend zum Menü-Eintrag „Dachschütze“.

Neue Zeilen im Masterplan-Infofeld (Schlüssel frei wählbar, z. B. `skillKindDoctrine`, `skillKindKeystone`, `skillKindSocket`, `skillKindMastery`, `skillKindStudy`):

| Knotenart | Deutsch | Englisch |
| --- | --- | --- |
| Doktrin (D) | Doktrin: stark, aber mit einem Nachteil – nur eine je Schule. | Doctrine: strong, but with a drawback – only one per school. |
| Schlussstein (◆) | Schlussstein: gibt es nur einmal im ganzen Plan. | Keystone: only one in the whole plan. |
| Sockel (◎) | Sockel: nimmt einen Bauplan auf – Bosse lassen beim ersten Sieg einen fallen. | Socket: holds a blueprint – bosses drop one on their first defeat. |
| Meisterschaft (M) | Meisterschaft: öffnet mit 8 gelernten Knoten und einer Doktrin dieser Schule – wähle eine von drei Wirkungen. | Mastery: opens with 8 learned nodes and a doctrine in this school – pick one of three effects. |
| Studie (?) | Studie: öffnet, sobald du genug Tiere dieser Linie besiegt hast – zählt über alle Partien. | Study: opens once you have defeated enough animals of this line – counts across all games. |

---

## Teil C: Prüfliste

Optik:

- Titel, Spiel, Gerätemenü, Pause, Spielstand-Dialog, Masterplan in Deutsch und Englisch durchklicken.
- Buttons gesperrt (zu wenig Gold, Abklingzeit) und gedrückt (Fläche sinkt auf den Sockel).
- Fredoka ist geladen, keine Ersatzschrift (Chrome: Entwicklerwerkzeuge → Netzwerk, oder `document.fonts.check('600 20px Fredoka')`).

Tutorial:

- Neues Spiel in Deutsch und Englisch bis Welle 12 auf iPhone-Größe (852 × 393): keine Sprechblase ragt über den Rand,
  pro Welle höchstens ein Lektionsfenster, in Welle 11 nur das Siegfenster.
- „Überspringen ✕“ in Welle 1 tippen; danach müssen in Welle 2 und Welle 12 weiter Hinweise kommen.
- Der Spezialkräfte-Hinweis darf in der Bauphase nicht erscheinen.
- Lektionstext mit 28 px im 1000 × 620-Fenster: längste Texte sind `lesson_masterplanDeep_text` und `lesson_heroes_text`.

Build-Repository:

- Nach dem Build `npm run sync:ios` ausführen; das Skript bricht ab, falls `ads.enabled` oder die Szene `Title` fehlen.
- Der Workflow `.github/workflows/ios-build.yml` prüft den App-Build automatisch nach jedem Push.
