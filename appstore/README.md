# App-Store-Unterlagen

Alles, was die Store-Seite in App Store Connect braucht, zum Kopieren.

| Datei | Inhalt |
| --- | --- |
| `de.md` | Store-Seite auf Deutsch, Primärsprache |
| `en.md` | Store-Seite auf Englisch |
| `altersfreigabe-und-datenschutz.md` | Antworten für Altersfreigabe und App-Datenschutz, EU-Händlerstatus, Hinweise für das Review-Team |
| `../privacy.html` | Datenschutz- und Kontaktseite, zweisprachig |

Die Länge jedes Feldes ist gegen Apples Limits geprüft. Die Texte beschreiben den App-Build, bei dem `npm run www` die Werbe-Platzhalter des Spiels abschaltet. Für die Web-Version im Repo-Stamm stimmt „keine Werbung“ nicht.

## Vor dem Veröffentlichen

1. **Platzhalter ersetzen.** In `privacy.html` stehen gelb markierte Platzhalter für Name, Anschrift und E-Mail. `npm run check:privacy` meldet, ob noch welche offen sind. Die App liefert die Seite mit und zeigt sie über den Link „Datenschutz“ auf dem Titelbildschirm, offene Platzhalter wären also auch in der App sichtbar. `npm run sync:ios` warnt deshalb, solange welche offen sind. Dieselben Angaben gehören in die Copyright-Zeile von `de.md` und `en.md`.
2. **Seite öffentlich machen.** GitHub Pages liefert nur `main` aus. Nach dem Merge ist die Seite unter https://francesbaldes-dotcom.github.io/resist-the-cute/privacy.html erreichbar. Öffne sie, bevor du die URL in App Store Connect einträgst.
3. **Eine URL für alles.** Sie enthält die Kontaktdaten und dient als Support-URL und als Datenschutz-URL, in beiden Sprachen.

## Reihenfolge in App Store Connect

1. Neue App anlegen: Plattform iOS, Name, Primärsprache Deutsch, Bundle-ID `com.francesbaldes.resistthecute` (muss zu Xcode passen), SKU frei wählbar.
2. App-Informationen: Untertitel, Kategorie Spiele mit den Unterkategorien Strategie und Gelegenheitsspiele, Inhaltsrechte, Altersfreigabe.
3. Preise und Verfügbarkeit festlegen. Im Spiel gibt es nichts zu kaufen.
4. App-Datenschutz ausfüllen und die Datenschutz-URL eintragen.
5. Englisch als zweite Lokalisierung anlegen und die Texte aus `en.md` einfügen.
6. Version 1.0: Screenshots, Werbetext, Beschreibung, Schlüsselwörter, Support-URL, Copyright.
7. Build aus Xcode hochladen (Product, Archive, Distribute App) und bei der Version auswählen.
8. App-Review-Informationen und EU-Händlerstatus ausfüllen, dann zur Prüfung einreichen.

## Screenshots

Die Bilder entstehen am echten Gerät oder im Xcode-Simulator, denn nur dort stimmt die Schrift mit der App überein. Querformat, jeweils für das größte iPhone und das größte iPad. Vorschlag für fünf Motive:

1. Titelbildschirm
2. Welle im Gange, Tiere am Turm
3. Gerätemenü
4. Masterplan-Rad
5. Boss-Kampf

Passende Überschriften stehen am Ende von `de.md` und `en.md`.
