# Resist the Cute

Spielbare Web-App (fertiger Build). Spielen: https://francesbaldes-dotcom.github.io/resist-the-cute/

Auf dem iPhone in Safari öffnen → Teilen → „Zum Home-Bildschirm“.

## iOS-App für den App Store (Capacitor)

Der Ordner `ios/` enthält ein Xcode-Projekt, das die Web-App als native iOS-App verpackt
(Capacitor mit Swift Package Manager, CocoaPods wird nicht gebraucht). Die Web-Dateien bleiben
unverändert im Repo-Stamm, GitHub Pages läuft weiter wie bisher.

Voraussetzungen: Mac mit aktuellem Xcode, Node.js 20 oder neuer, Mitgliedschaft im Apple Developer Program.

1. `npm install` – lädt Capacitor sowie die Plugins Haptics und Preferences nach `node_modules/`
   (Xcode braucht den Ordner). Preferences ist Pflicht: Das Spiel speichert in der nativen App darüber,
   ohne das Plugin gingen Spielstände auf dem iPhone stillschweigend verloren.
2. `npm run sync:ios` – kopiert die Web-Dateien nach `www/`, passt `index.html` für die App an
   (Vollbild-Button samt Safari-Hinweis ausgeblendet, Vibrations-Schalter über die iOS-Haptik,
   Werbe-Platzhalter des Spiels abgeschaltet, Datenschutz-Link auf dem Titelbildschirm)
   und überträgt alles ins Xcode-Projekt. Nach jedem neuen Build der Web-App wiederholen.
3. `npm run open:ios` – öffnet das Projekt in Xcode. Beim ersten Öffnen lädt Xcode die Swift-Pakete.
4. In Xcode unter „Signing & Capabilities“ das eigene Team wählen.
   Bundle-ID: `com.francesbaldes.resistthecute` (änderbar in `capacitor.config.json` und in Xcode,
   muss im App Store eindeutig sein). Version und Build-Nummer stehen unter „General“.
5. Zum Testen ein iPhone anschließen und auf „Run“ drücken.
6. Für den Upload: Product → Archive, dann „Distribute App“ → App Store Connect.

Bereits eingerichtet: App-Icon (1024 px), Startbildschirm mit Logo, nur Querformat,
Statusleiste ausgeblendet, Export-Compliance (keine eigene Verschlüsselung), Sprachen Deutsch und Englisch,
Datenschutz-Link auf dem Titelbildschirm neben der Versionsnummer. Er öffnet die mitgelieferte `privacy.html`
mit „Zurück zum Spiel“ oben, Links zu fremden Seiten öffnen Safari. Privacy-Manifest der App
(`ios/App/App/PrivacyInfo.xcprivacy`): deklariert den UserDefaults-Zugriff des Preferences-Plugins mit
Grund CA92.1, wie Apple es seit 2024 für den Upload verlangt.

Achtung Werbung: Das Spiel enthält Belohnungs-Werbung nur als Attrappe (Dialog „Werbung (Platzhalter)“).
Apple lehnt Platzhalter-Inhalte ab, deshalb schaltet `npm run www` sie in der App-Kopie ab. Die Web-Version im
Repo-Stamm zeigt sie weiter. Soll sie dort auch verschwinden, im Quellprojekt `ads.enabled` auf `false` setzen.

Store-Texte (Deutsch und Englisch), Antworten für Altersfreigabe und App-Datenschutz sowie eine Datenschutzseite
stehen in `appstore/` und `privacy.html`. Vor dem Veröffentlichen Platzhalter in `privacy.html` ersetzen
(`npm run check:privacy` prüft das), Details in `appstore/README.md`. Offen: Screenshots am Gerät und der
Eintrag in App Store Connect. Das App-Icon ist aus `icons/icon-512.png` hochskaliert;
besser aus dem Original-Artwork in 1024×1024 neu exportieren nach
`ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png`.

Hinweis für den Build-Prozess der Web-App: Beim Veröffentlichen eines neuen Builds in dieses Repo
dürfen `ios/`, `appstore/`, `scripts/`, `privacy.html`, `package.json`, `package-lock.json`,
`capacitor.config.json` und `.gitignore` nicht gelöscht werden.
