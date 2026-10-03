# Resist the Cute

Spielbare Web-App (fertiger Build). Spielen: https://francesbaldes-dotcom.github.io/resist-the-cute/

Auf dem iPhone in Safari öffnen → Teilen → „Zum Home-Bildschirm“.

## iOS-App für den App Store (Capacitor)

Der Ordner `ios/` enthält ein Xcode-Projekt, das die Web-App als native iOS-App verpackt
(Capacitor mit Swift Package Manager, CocoaPods wird nicht gebraucht). Die Web-Dateien bleiben
unverändert im Repo-Stamm, GitHub Pages läuft weiter wie bisher.

Voraussetzungen: Mac mit aktuellem Xcode, Node.js 20 oder neuer, Mitgliedschaft im Apple Developer Program.

1. `npm install` – lädt Capacitor und das Haptics-Plugin nach `node_modules/` (Xcode braucht den Ordner).
2. `npm run sync:ios` – kopiert die Web-Dateien nach `www/`, passt `index.html` für die App an
   (Vollbild-Button samt Safari-Hinweis ausgeblendet, Vibrations-Schalter über die iOS-Haptik)
   und überträgt alles ins Xcode-Projekt. Nach jedem neuen Build der Web-App wiederholen.
3. `npm run open:ios` – öffnet das Projekt in Xcode. Beim ersten Öffnen lädt Xcode die Swift-Pakete.
4. In Xcode unter „Signing & Capabilities“ das eigene Team wählen.
   Bundle-ID: `com.francesbaldes.resistthecute` (änderbar in `capacitor.config.json` und in Xcode,
   muss im App Store eindeutig sein). Version und Build-Nummer stehen unter „General“.
5. Zum Testen ein iPhone anschließen und auf „Run“ drücken.
6. Für den Upload: Product → Archive, dann „Distribute App“ → App Store Connect.

Bereits eingerichtet: App-Icon (1024 px), Startbildschirm mit Logo, nur Querformat,
Statusleiste ausgeblendet, Export-Compliance (keine eigene Verschlüsselung), Sprachen Deutsch und Englisch.

Vor der Einreichung noch nötig: Datenschutzerklärung als öffentliche URL, Screenshots (iPhone und iPad,
Querformat), App-Store-Texte, Altersfreigabe. Das App-Icon ist aus `icons/icon-512.png` hochskaliert;
besser aus dem Original-Artwork in 1024×1024 neu exportieren nach
`ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png`.

Hinweis für den Build-Prozess der Web-App: Beim Veröffentlichen eines neuen Builds in dieses Repo
dürfen `ios/`, `scripts/`, `package.json`, `package-lock.json`, `capacitor.config.json` und
`.gitignore` nicht gelöscht werden.
