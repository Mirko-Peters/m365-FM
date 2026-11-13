# Store-Eintrag: M365.FM Contributor (Google Play)

Stand 13.11.2026. Alles hier ist ein Entwurf zum Einfügen in die Play Console. Es wird nichts automatisch eingereicht.
Texte beschreiben nur, was die Web-App unter <https://www.m365.fm/community/contributor/> heute kann (Stand der Seiten im Repo).
Wo etwas nicht sicher ist, steht **Prüfen**.

## Stammdaten

| Feld | Wert |
|---|---|
| App-Name (max. 30 Zeichen) | M365.FM Contributor (19) |
| Paketname | `fm.m365.contributor` (nach der Veröffentlichung nicht mehr änderbar) |
| Standardsprache | Englisch (en-US), zusätzlich Deutsch (de-DE) |
| Art / Kategorie | App, Kategorie **Produktivität**; Tags z. B. Produktivität, Business |
| Kontakt-E-Mail | mirko.peters@m365.fm |
| Website | https://www.m365.fm |
| Datenschutzerklärung (URL) | https://www.m365.fm/privacy/ (englisch; deutsch: https://www.m365.fm/datenschutz/, beide Seiten haben einen Umschalter) |
| Preis / Anzeigen | kostenlos, **keine Anzeigen**, keine In-App-Käufe |
| Zielgruppe | nur Erwachsene (18+), nicht für Kinder gedacht |
| Grafiken | Symbol 512x512 und Feature-Grafik 1024x500 liegen im Workflow-Artefakt `mvp-tracker-store-graphics`. Telefon-Screenshots (mind. 2) macht Mirko mit der Debug-APK selbst, sie gehören nicht ins Repo. |

## Kurzbeschreibung (max. 80 Zeichen)

- **EN** (58): `Collect and export your Microsoft community contributions.`
- **DE** (57): `Sammle und exportiere deine Microsoft-Community-Beiträge.`

## Langbeschreibung English (max. 4000 Zeichen)

```
M365.FM Contributor is the companion app for people who share Microsoft 365, Azure, Power Platform and security knowledge with the community: blog posts, videos, podcast episodes, talks, GitHub work and more.

Keep all your contributions in one place:
• Add a contribution in seconds. Share a link from any app to M365.FM Contributor and the link is ready to save.
• Connect your own sources (YouTube, podcast, blog, GitHub). New contributions are collected automatically, metadata only. You review what was found before it counts.
• See your overview and the impact of your work over a reporting year.
• Export your contributions as a list (CSV) or prepared for community-program portals such as the Microsoft MVP portal.
• Contributions stay private until you choose to show them on your public profile.

Android extras: share-to-app, back button, a status bar in the app colors and a friendly offline screen when there is no connection.

Sign in with a Microsoft, LinkedIn or GitHub account. An internet connection is required; your data is stored in your M365.FM account, not on the phone. You can delete your account and its data yourself.

M365.FM Contributor is an independent project of M365.FM. It is not affiliated with, endorsed by or sponsored by Microsoft. Microsoft, Microsoft 365, Azure and MVP are trademarks of the Microsoft group of companies.

Privacy policy: https://www.m365.fm/privacy/
Contact: mirko.peters@m365.fm
```

## Langbeschreibung Deutsch (max. 4000 Zeichen)

```
M365.FM Contributor ist die App für alle, die ihr Wissen zu Microsoft 365, Azure, Power Platform und Security mit der Community teilen: Blogbeiträge, Videos, Podcast-Folgen, Vorträge, GitHub-Arbeit und mehr.

Alle Beiträge an einem Ort:
• Beitrag in Sekunden erfassen. Teile einen Link aus einer beliebigen App an M365.FM Contributor, dann steht der Link zum Speichern bereit.
• Eigene Quellen verbinden (YouTube, Podcast, Blog, GitHub). Neue Beiträge werden automatisch gesammelt, nur Metadaten. Du prüfst, was gefunden wurde, bevor es zählt.
• Übersicht und Wirkung deiner Arbeit über ein Berichtsjahr.
• Export als Liste (CSV) oder aufbereitet für Portale von Community-Programmen, zum Beispiel das Microsoft-MVP-Portal.
• Beiträge bleiben privat, bis du sie in deinem öffentlichen Profil zeigst.

Android-Extras: Teilen-in-die-App, Zurück-Taste, Statusleiste in den App-Farben und eine freundliche Offline-Seite, wenn keine Verbindung besteht.

Anmeldung mit Microsoft-, LinkedIn- oder GitHub-Konto. Eine Internetverbindung ist nötig; deine Daten liegen in deinem M365.FM-Konto, nicht auf dem Handy. Du kannst dein Konto und die Daten selbst löschen.

M365.FM Contributor ist ein unabhängiges Projekt von M365.FM. Es steht in keiner Verbindung zu Microsoft und wird von Microsoft weder unterstützt noch gesponsert. Microsoft, Microsoft 365, Azure und MVP sind Marken der Microsoft-Unternehmensgruppe.

Datenschutzerklärung: https://www.m365.fm/privacy/
Kontakt: mirko.peters@m365.fm
```

Bewusst nicht genannt: Push-Benachrichtigungen (erst nach Firebase-Anbindung, siehe README), Google-Anmeldung (funktioniert in der App nicht, siehe README).

## Data safety (Datensicherheit)

Grundlage ist das tatsächliche Verhalten der App. Sie zeigt die Web-App im WebView; über die Anmeldung und Links erreicht man auch die Community-Seiten unter www.m365.fm (Profil, Kommentare, Nachrichten). Deshalb sind deren Datenfelder mit angegeben. **Prüfen:** Diese Tabelle vor dem Absenden mit der Datenschutzerklärung abgleichen (siehe „Lücke in der Datenschutzerklärung“ unten).

**Erste Frage:** Erhebt oder teilt die App Nutzerdaten? **Ja.**

| Datentyp (Play-Kategorie) | Erhoben | Zweck | Pflicht oder freiwillig | Weitergabe |
|---|---|---|---|---|
| Name (Persönliche Daten) | ja (Anzeigename vom Anmeldeanbieter, standardmäßig „Vorname I.“) | App-Funktionen, Kontoverwaltung | Pflicht für die Anmeldung | nein |
| Nutzer-IDs (Persönliche Daten) | ja (anonyme Kennung des Anmeldeanbieters, Konto-ID) | Kontoverwaltung, App-Funktionen | Pflicht | nein |
| E-Mail-Adresse | nur freiwillig (Kontakt-/Benachrichtigungs-E-Mail im Profil, Community-Seite) | Kommunikation, App-Funktionen | freiwillig | nein |
| Adresse, Telefonnummer | nur freiwillig (Profilfelder auf der Community-Seite) | App-Funktionen | freiwillig | nein |
| Andere nutzergenerierte Inhalte (App-Aktivität) | ja (Beiträge: Titel, Link, Datum, Beschreibung, Quellen; Kommentare, Nachrichten) | App-Funktionen | Pflicht für die Funktion | nein |
| Geräte- oder andere IDs (Push-Token) | **nein in Version 1** (kein Push ohne Firebase). Wird Push aktiviert: **ja**, Data safety vorher aktualisieren | App-Funktionen (Benachrichtigungen) | freiwillig | nein |
| Standort, Fotos, Kontakte, Finanzdaten, Gesundheit, Audio, Dateien | nein | | | |

Weitere Angaben:
- **Daten während der Übertragung verschlüsselt:** ja (nur HTTPS, Klartext-Verkehr ist gesperrt).
- **Nutzer können Löschung verlangen:** ja. Das Konto und alle Daten kann man selbst auf der Community-Seite löschen (laut Datenschutzerklärung). **Prüfen:** Play verlangt für Apps mit Kontoerstellung eine öffentliche Web-URL zur Kontolöschung. Vorschlag: https://www.m365.fm/community/ , sobald dort der Abschnitt zur Kontolöschung ohne Umweg erreichbar ist; sonst eine eigene Seite anlegen.
- **Weitergabe an Dritte:** nein. Hosting und Datenbank laufen bei Cloudflare, E-Mails über Resend: das sind Auftragsverarbeiter (nach Play-Definition keine „Weitergabe“). Die Anmeldung bei Microsoft, LinkedIn oder GitHub löst der Nutzer selbst aus. **Prüfen** mit der für Datenschutz zuständigen Stelle, falls es eine gibt.
- **Werbe-ID:** nein, die App verwendet keine. Der CI-Lauf gibt die Berechtigungen des zusammengeführten Manifests aus (Schritt „Berechtigungen“), dort darf `AD_ID` nicht stehen.
- **Unabhängige Sicherheitsprüfung:** nein.
- **Kinder-Richtlinie / Familien:** nicht teilnehmen, Zielgruppe 18+.

## Inhaltsfreigabe (IARC-Fragebogen)

- Kategorie: Dienstprogramm / Produktivität (nicht Spiel, nicht soziales Netzwerk, nicht Nachrichten).
- Gewalt, Sexualität, Drogen, Glücksspiel, vulgäre Sprache, Angst: **nein**, keine solchen Inhalte von uns.
- Nutzerinteraktion / nutzergenerierte Inhalte: **ja, bei „Nutzer können interagieren oder Inhalte austauschen“** (Kommentare, Nachrichten zwischen Mitgliedern, öffentliche Profile). Moderation: Meldefunktion und Entfernung durch den Betreiber (laut Datenschutzerklärung). Das führt zum Hinweis „Nutzer interagieren“; die Altersfreigabe bleibt voraussichtlich bei „Ab 3“/„Everyone“, das bestimmt aber der Fragebogen.
- Standort teilen: nein. Digitale Käufe: nein. Internetzugang ist nötig.
- Die Antworten im Fragebogen selbst ehrlich anhand dieser Punkte geben; die endgültige Einstufung vergibt Google.

## Weitere Erklärungen in der Play Console

- **Werbung:** „Nein, die App enthält keine Werbung.“
- **App-Zugriff:** Teile der App brauchen eine Anmeldung. Für die Prüfung von Google ein **Testkonto** mit Zugangsdaten hinterlegen (Mirko legt es an; Zugangsdaten nur in der Play Console, nie im Repo). Anmeldung mit Microsoft, LinkedIn oder GitHub; **Google-Anmeldung funktioniert im WebView nicht** (Google blockiert eingebettete Browser), also kein Google-Konto als Testkonto angeben.
- **Nachrichten-App / Behörden / Finanzen / Gesundheit / VPN:** jeweils „Nein“.
- **Berechtigungen:** Die App fragt keine gefährlichen Berechtigungen an (Version 1: nur Internet, laut aapt2 im CI-Lauf). Der CI-Lauf listet sie bei jedem Build (Schritt „Berechtigungen und Eckdaten der APK“). Mit Push kämen `POST_NOTIFICATIONS` u. a. dazu.
- **Datenschutzerklärung, Konto-Löschung, Kontakt:** siehe Stammdaten und Data safety oben.

## Lücke in der Datenschutzerklärung (vor dem Absenden schließen)

`site_legal.py` (https://www.m365.fm/privacy/) erwähnt den MVP-Tracker/Contributor noch nicht (kein Treffer für „contribution“, „MVP“, „Beitr“). Play verlangt, dass die Erklärung die Datenverarbeitung der App abdeckt. Ich habe den Rechtstext **nicht** geändert. Vorschlag für einen neuen Abschnitt (englisch; deutsche Fassung entsprechend), den Mirko prüft und selbst einsetzt:

> **Contributor app and MVP Tracker (optional).** If you use the MVP Tracker (web or the M365.FM Contributor app) we store the contributions you add or let us collect from sources you connect (title, link, date, type, optional description and statistics such as views of your own videos or episodes, your selected sources and settings). They are private by default and become public only when you show them on your public profile. We read sources only as metadata, at your request and from public pages. Data is stored in our database at Cloudflare (see above) and deleted when you delete the contribution, the source or your account. The Android app shows this website in an app container; it has no advertising and no analytics. If native push notifications are offered later, we additionally store the device's push token (Firebase Cloud Messaging, Google) until you switch notifications off or delete your account.

## Was nicht geprüft ist

- Alle Texte und Angaben sind Entwürfe nach dem Stand der Repo-Seiten; ich habe nichts in der Play Console eingegeben und keine Richtlinienseite von Google selbst ausgelesen (Google-Hilfeseiten waren für mich nicht abrufbar). Die aktuellen Formulare und Fristen in der Play Console gelten.
- Ob Google die App wegen „Mindestfunktionalität“ ablehnt, lässt sich nicht vorhersagen (siehe README, Abschnitt Mehrwert).
