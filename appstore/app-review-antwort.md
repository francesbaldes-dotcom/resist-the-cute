# Antwort auf die Rückfrage der App-Prüfung (Richtlinie 2.1, „Information Needed“)

Apple fragt bei neuen Entwicklerkonten standardmäßig nach: Das ist keine Ablehnung des Spiels, sondern eine Bitte um
Informationen, bevor die Prüfung weitergeht. Die Mail ist eine maschinelle Übersetzung (deshalb „Artikel“, „Antrag“,
„App-Rezension“ und der übersetzte App-Name „Widerstehe der Niedlichkeit“). In App Store Connect muss der Name weiter
„Resist the Cute“ heißen; das bitte einmal prüfen.

## Was zu tun ist

1. **Bildschirmaufnahme auf dem iPhone machen** (Ablauf unten), 2 bis 4 Minuten.
2. In App Store Connect → Apps → Resist the Cute → **App-Prüfung** (Nachrichtenverlauf) auf die Nachricht **antworten**:
   Text unten einfügen, Video anhängen. Lässt sich das Video wegen der Größe nicht anhängen, in iCloud Drive ablegen,
   Link „Jeder mit dem Link“ erzeugen und den Link in den Text setzen.
3. Dieselben Punkte 2 bis 6 zusätzlich unter **App-Informationen → App-Review-Informationen → Hinweise** eintragen
   (Feld fasst 4.000 Zeichen; der Text unten passt).
4. Sicherstellen, dass der eingereichte Build mit `npm run sync:ios` erzeugt wurde. Nur dann ist die Werbe-Attrappe
   des Web-Builds abgeschaltet, und die Aussage „keine Werbung“ stimmt.

## Bildschirmaufnahme

Auf dem iPhone mit dem aktuellen iOS: Kontrollzentrum → Bildschirmaufnahme starten, **dann erst** die App vom Home-Bildschirm
öffnen. Das iPhone quer halten, die App läuft nur im Querformat. Reihenfolge:

1. Start vom Home-Bildschirm, Titelbildschirm.
2. Auf dem Titel kurz Ton, Musik und Vibration umschalten, Sprache auf Englisch und zurück auf Deutsch.
3. „Spiel starten“, Tutorial-Fenster mit „Verstanden“ schließen, Gerät bauen, Welle 1 starten, eine Katze antippen.
4. Nach der Welle: Gerät aufrüsten, Etage kaufen, Welle 2 und 3 spielen, Tempo 2×.
5. Ab Welle 3: eine Spezialkraft benutzen, den Masterplan öffnen, einen Knoten lernen, schließen.
6. Pause-Knopf, „Zum Titel“, dann „Spielstand“ (Weiter) drücken: das Spiel geht weiter.
7. Zurück zum Titel, Link „Datenschutz“ öffnen, Seite scrollen, „Zurück zum Spiel“.
8. Aufnahme beenden.

Das Video liegt danach in Fotos. Bei über etwa 200 MB in iMovie mit 720p exportieren.

## Antworttext (Englisch, zum Einfügen)

Die Prüfung arbeitet auf Englisch; die deutsche Mail ist übersetzt. Der Text ist ohne Platzhalter und kann so abgeschickt
werden. Punkt 6 sagt aus, dass Grafik, Musik und Töne eigene Arbeit sind.

```text
Hello App Review team,

thank you for your note. Here is the requested information.

Resist the Cute is a small single-player tower-defense game. It has no user accounts, no user-generated content, no in-app purchases, no advertising and no network features, so none of the account, user-content or paid-content flows apply.

1. Screen recording
The attached recording was made on a physical iPhone running the latest iOS release. It starts with the app launch and shows the typical flow: title screen and settings, starting a new game, the in-game tutorial, building and upgrading gadgets, starting waves, using a special power, the Master Plan (skill tree), pausing, saving and continuing a game, and the privacy page.

2. Purpose and audience
Resist the Cute is a casual tower-defense game for one player. You play a cartoon villain whose lair is stormed by cute animals (kittens, bunnies, chicks) that want to cuddle it. You build gadgets on the floors of your tower, upgrade them, start waves and unlock special powers and skills. It is made for casual players of all ages who enjoy light strategy. The humor is family-friendly and there is no realistic violence: defeated animals simply run home. The game works completely offline, with no accounts, no in-app purchases and no advertising. Its benefit is a self-contained session of a few minutes with long-term progression (Master Plan, heroes, legacy bonuses) for players who keep going.

3. Setup and access to the main features
No setup, login, demo account, credentials or sample files are needed. Launch the app and tap "Spiel starten" / "Start game". An in-game tutorial (speech bubbles and short explanation windows) guides you through the first waves. Main features: tap a free slot in the tower to build a gadget (cannon, slimer, laser); tap "Welle" / "Wave" at the bottom right to start a wave; tap a built gadget to upgrade or sell it; special powers appear in the bottom bar from wave 3; the Master Plan (skill tree) opens with the brain button at the bottom left; the village (gold mine, lab, barracks) is on the left from wave 4. Progress is saved automatically on the device, and "Spielstand" / "Continue" on the title screen resumes it. The title screen also has toggles for sound, music and vibration, a language switch (German/English; the app follows the device language by default) and a link to the privacy policy.

4. External services
None. The app does not connect to any server and uses no third-party SDKs for analytics, advertising, authentication, payments or AI. It is built with the open-source frameworks Phaser (game engine, MIT license) and Capacitor (native wrapper, MIT license) and uses only the Capacitor Haptics and Preferences plugins, for vibration feedback and for storing the save game locally on the device. No data is collected or transmitted.

5. Regional differences
None. The app works identically in all regions. The only difference is the language, German or English, which follows the device language and can be switched in the app.

6. Regulated industry / third-party material
The app is not used in a regulated industry. All artwork, music, sound effects and texts were created for this app by me; it contains no licensed or protected third-party material beyond the open-source frameworks named above.

Best regards
Marius Baldes
```

## Was der Text sagt (Kurzfassung auf Deutsch)

1. Video: auf einem iPhone mit aktuellem iOS aufgenommen, zeigt den gesamten typischen Ablauf vom Start bis zur Datenschutzseite.
2. Zweck und Zielgruppe: Gelegenheitsspiel, Tower Defense, ein Spieler, familienfreundlich, komplett offline, ohne Konto, Käufe und Werbung.
3. Zugang: keine Einrichtung, kein Login, keine Zugangsdaten; Tutorial im Spiel; Liste der Hauptfunktionen und wo sie sich befinden.
4. Externe Dienste: keine; nur die quelloffenen Frameworks Phaser und Capacitor sowie zwei lokale Capacitor-Plugins (Vibration, lokaler Speicher); keine Datenerhebung.
5. Regionen: überall gleich; nur die Sprache (Deutsch/Englisch) folgt dem Gerät.
6. Regulierte Branche oder fremdes Material: nein; alle Inhalte sind eigene Arbeit (bitte vor dem Absenden bestätigen).
