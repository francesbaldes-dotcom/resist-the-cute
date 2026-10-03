# Fragebögen und Hinweise für App Store Connect

Das sind Arbeitsgrundlagen, keine Rechtsberatung. Die Antworten richten sich nach dem Spiel im App-Build. Apple rechnet die Altersfreigabe aus den Antworten selbst aus, und die Fragen im Portal heißen gelegentlich etwas anders als hier.

## Altersfreigabe

Voraussichtliches Ergebnis: 9+.

| Thema | Antwort | Grund |
| --- | --- | --- |
| Zeichentrick- oder Fantasy-Gewalt | Selten oder leicht | Spielzeug-Geräte beschießen niedliche Tiere. Treffer lassen Herzen aufsteigen, besiegte Tiere werden zu schwindeligen Fellbällen und kullern davon. Kein Blut, keine Verletzungen. |
| Waffen | Selten oder leicht | Bunte Blaster, Schleim und Laser. Orks mit Äxten halten Tiere auf und kitzeln sie. |
| Realistische Gewalt | Keine | |
| Anhaltende drastische oder sadistische Gewalt | Keine | |
| Horror- und Schockthemen | Keine | |
| Vulgäre Sprache, derber Humor | Keine | |
| Sexuelle Inhalte, Nacktheit | Keine | |
| Alkohol, Tabak, Drogen | Keine | |
| Glücksspiel, Lootboxen, Wettbewerbe | Keine | Gold gibt es nur im Spiel. |
| Medizinische oder Wellness-Themen | Keine | |
| Uneingeschränkter Webzugriff | Nein | Die App öffnet keine Webseiten. |
| Nutzerinhalte, Chat | Nein | |
| Werbung | Nein | Im App-Build abgeschaltet. |
| Jugendschutzfunktionen, Altersprüfung | Nein | |

## App-Datenschutz

- Datenerhebung: **Keine Daten erhoben.** Die App sendet nichts an Server und enthält keine Software von Dritten, die Daten erhebt.
- Tracking: Nein.
- Datenschutz-URL: https://francesbaldes-dotcom.github.io/resist-the-cute/privacy.html
- Die Datenschutz-Deklaration, die Apple für Bibliotheken verlangt, steckt in der mitgelieferten Capacitor-Bibliothek.

## Exportbestimmungen

In der Info.plist steht, dass die App keine eigene Verschlüsselung nutzt. Dadurch entfällt die Rückfrage beim Hochladen.

## Inhaltsrechte

Bestätige nur, wenn du alle Rechte an Bildern und Texten besitzt. Klänge und Musik entstehen laut Spielcode im Spiel selbst, und die Schrift ist die Systemschrift des Geräts.

## EU-Händlerstatus und Impressum

Apple fragt, ob du die App im Rahmen einer gewerblichen, geschäftlichen oder beruflichen Tätigkeit anbietest. Bei „Händler“ zeigt Apple Name, Anschrift, Telefonnummer und E-Mail auf der Store-Seite in der EU an. Bei „Nicht-Händler“ entfällt das. Welcher Status stimmt, entscheidest du.

In Deutschland kann bei einem gewerblichen Angebot zusätzlich ein Impressum nötig sein. Die Datenschutzseite enthält schon Name, Anschrift und E-Mail. Ein Impressumsabschnitt ließe sich mit denselben Angaben ergänzen.

## Hinweise für das Review-Team

Auf Englisch in das Notizfeld bei den App-Review-Informationen kopieren. Anmeldedaten sind nicht nötig.

```text
Resist the Cute is a self-contained, offline tower-defense game.

- No account, login or demo credentials are needed.
- The app has no ads, no in-app purchases and no analytics. It makes no connections to external servers. All content is bundled in the app, and it works in airplane mode.
- It is a native iOS app (Capacitor) that runs the game from files bundled inside the app. It is not a wrapper around a website.
- Landscape only. Languages: English and German, following the device language. The language can be changed on the title screen.
- The cute animals are never harmed: hits release hearts, and defeated animals turn into dizzy fluffy balls and tumble away.
- How to try it: tap START GAME, tap an empty floor of the tower, build a Cannon, then tap "Wave 1". A short tutorial explains the rest.
- "Save data" on the title screen creates a text code that the player can copy to move a save to another device. Nothing is uploaded.
```
