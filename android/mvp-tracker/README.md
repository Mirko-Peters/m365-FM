# Android-App „M365.FM Contributor“ (MVP-Tracker)

Capacitor-Hülle um die Web-App <https://www.m365.fm/community/contributor/>. Erste Store-App; weitere (z. B. News) kommen als getrennte Apps mit eigener `applicationId`.

**Paketname `fm.m365.contributor`: Er ist nach der Veröffentlichung im Play Store unveränderlich.** Vorher noch einmal prüfen, danach nie mehr ändern.

Stand 13.11.2026. Hier wird nichts veröffentlicht: der Workflow baut nur Artefakte, im Play Console reicht Mirko selbst ein.

## Aufbau

```
android/mvp-tracker/
  capacitor.config.json     appId, server.url (Live-Seite), errorPath (Offline-Seite), allowNavigation, SystemBars
  package.json / -lock.json Capacitor 8.6.2 (+ push-notifications 8.1.3), sharp für Grafiken; alles exakt gepinnt
  www/index.html            lokale Start-Seite (nur Fallback), www/offline.html: Offline-Seite (DE/EN)
  tools/native/MainActivity.java  Teilen-in-die-App, Zurück-Taste, Splash, App-Links
  tools/customize_android.py      passt die im CI erzeugte Android-Plattform an (Manifest, Farben, Icons, Signierung, Firebase)
  tools/make-graphics.mjs         Play-Symbol 512, Feature-Grafik 1024x500 und alle Launcher-Icons aus assets/favicon.svg
  STORE.md                        Store-Eintrag (EN/DE), Data safety, Inhaltsfreigabe
.github/workflows/android-mvp-tracker.yml
```

Die Android-Plattform (`android/mvp-tracker/android/`) liegt **nicht** im Repo: Der Workflow erzeugt sie mit `npx cap add android` und `customize_android.py`. Gründe: kleines Repo, keine Rasterbilder im Repo (CLAUDE.md, Bilder-Regel), reproduzierbarer Build über `package-lock.json`. Alle Bilder (Symbole, Store-Grafiken) entstehen im CI aus `assets/favicon.svg` und liegen als Artefakt vor.

### Entscheidung: `server.url` statt lokaler Kopie der Seite

Die App lädt die Live-Seite (`server.url`). Begründung: Die Web-App ist eine generierte Seite mit eigener API und Anmeldung über die Cookies von `api-dub.m365.fm`; eine lokale Kopie müsste bei jeder Änderung neu gebaut, hochgeladen und von Google geprüft werden. So sind Fehlerbehebungen sofort für alle da. Der Preis: Ohne Netz gibt es nur die Offline-Seite (`www/offline.html`, über `errorPath`), keine echte Offline-Nutzung. Capacitor weist darauf hin, dass `server.url` und `allowNavigation` „nicht für Produktion gedacht“ seien (Live-Reload-Gedanke); für Google Play ist das zulässig, für den App Store (später) wäre ein lokaler Inhalt sicherer.

`allowNavigation` enthält nur eigene Hosts (`www.m365.fm`, `api-dub.m365.fm`) und die Anmeldeseiten, die die OAuth-Weiterleitung braucht (`login.microsoftonline.com`, `login.live.com`, `www.linkedin.com`, `github.com`). Alles andere öffnet im Systembrowser. **Google-Anmeldung geht in der App nicht**: Google blockiert OAuth in eingebetteten WebViews (`disallowed_useragent`); der Google-Host steht bewusst nicht in der Liste, ein Klick öffnet Chrome, und die Anmeldung dort landet nicht in der App. Mirko meldet sich in der App mit Microsoft, LinkedIn oder GitHub an (nicht getestet). Eine saubere Lösung wäre Anmeldung über Chrome Custom Tabs mit Rücksprung per App-Link; das braucht Änderungen im Worker und ist nicht gebaut.

## Mehrwert gegenüber der Webseite (Play-Richtlinie)

Google nennt in seinem Hinweisartikel zu häufigen Richtlinienverstößen reine WebView-Hüllen um bestehende Webseiten „webview spam“ und entfernt sie; verlangt wird ein erkennbarer Mehrwert (Quelle: Android Developers Blog, „Developer tips and guides: common policy violations“, 2020; die aktuelle Richtlinie „Minimum Functionality“ konnte ich nicht selbst abrufen). Eingebaut sind:

| Funktion | Stand |
|---|---|
| **Teilen-in-die-App**: In jeder App „Teilen“ > M365.FM Contributor öffnet „Erfassen“ mit vorbefülltem Link (`?link=`, `#add`) | gebaut, nicht auf einem Gerät getestet |
| **Zurück-Taste**: geht in der Web-App zurück, beendet die App erst auf der ersten Seite | gebaut, nicht getestet |
| **Splash-Screen** (App-Farben, bis die Seite geladen ist, höchstens 3 s) | gebaut, nicht getestet |
| **Statusleiste** `#3b6391` | gebaut (Theme + SystemBars); Aussehen unter Android 15+ (Edge-to-Edge) nicht geprüft |
| **Offline-Seite** (DE/EN) | gebaut, nicht getestet |
| **App-Links** (`https://www.m365.fm/community/contributor/…` öffnet in der App) | gebaut; wirkt erst nach dem Eintrag des Fingerabdrucks (siehe unten) |
| **Native Push (FCM)** | Plugin in `package.json` vorbereitet, wird im CI **nur mit `google-services.json` eingebaut** (sonst entfernt der Workflow es vor dem Build: keine Firebase-Bibliotheken, keine Push-Berechtigungen); Worker und Web-App fehlen noch (siehe unten) |

Ehrliche Einschätzung: Das ist mehr als eine nackte WebView, aber ob Google es als genug Mehrwert ansieht, entscheidet die Prüfung. Wenn Google ablehnt, ist Push (FCM) der stärkste nächste Schritt, danach ein Startbildschirm-Widget oder Verknüpfungen („Beitrag erfassen“ als App-Shortcut).

## Bauen

**CI (Standard):** Workflow „Android-App MVP-Tracker“ (<https://github.com/Mirko-Peters/m365-fm/actions/workflows/android-mvp-tracker.yml>). Startet bei Push auf `claude/android-**` (Pfad `android/**`) oder per „Run workflow“. Schritte: Node 22, Java 21 (auf dem Runner), Gradle-Cache, `npm ci`, Grafiken, `cap add android`, Anpassung, `cap sync`, `assembleDebug`, dann Release. Artefakte:

- `mvp-tracker-debug.apk` (immer, mit Debug-Schlüssel signiert, nur zum Testen)
- `mvp-tracker-release.aab` (nur wenn alle vier Signier-Secrets gesetzt sind)
- `mvp-tracker-store-graphics` (Symbol 512x512, Feature-Grafik 1024x500)

Ohne Signier-Secrets baut der Workflow zur Kontrolle trotzdem ein unsigniertes Release-AAB (wird nicht hochgeladen), damit der Release-Pfad nicht erst beim ersten echten Lauf auffällt. `versionCode` ist die Nummer des Workflow-Laufs (steigt immer), `versionName` ist `1.0.<Lauf>`.

**Lokal:** Auf Mirkos Platte ist wenig Platz, ein lokales Android SDK ist nicht vorgesehen. Wer es doch will: Node 22, JDK 21, Android SDK 36, dann in `android/mvp-tracker`: `npm ci`, `node tools/make-graphics.mjs`, `npx cap add android`, `python3 tools/customize_android.py`, `node tools/make-graphics.mjs android/app/src/main/res`, `npx cap sync android`, `cd android && ./gradlew assembleDebug`.

Zielversion: Capacitor 8.6.2 setzt `compileSdk`/`targetSdk` 36 (Android 16), `minSdk` 24. Google verlangt für neue Apps und Updates ab 31.08.2026 mindestens API 36 (Quelle: developer.android.com/google/play/requirements/target-sdk): erfüllt.

## Debug-APK auf dem Handy installieren

1. Im Workflow-Lauf unter „Artifacts“ `mvp-tracker-debug.apk` herunterladen (ZIP, entpacken; Ablage z. B. unter `S:\Downloads`).
2. Auf das Handy kopieren, antippen, „Installation aus unbekannten Quellen“ für die Dateien-App erlauben, installieren. Alternativ mit `adb install mvp-tracker-debug.apk`.
3. Testen: Anmeldung (Microsoft/LinkedIn/GitHub), „Teilen“ aus dem Browser an die App, Zurück-Taste, Flugmodus (Offline-Seite).

Die Debug-APK nutzt einen Debug-Schlüssel; App-Links werden dafür nicht verifiziert, und sie lässt sich nicht bei Google Play hochladen.

## Schritte für Mirko

1. **Play-Console-Organisationskonto anlegen:** <https://play.google.com/console/signup>. Kontotyp „Organisation“, D-U-N-S **118441774**, einmalig **25 USD**. Google prüft Identität und Organisation vor der Freischaltung; laut Drittquellen dauert das mit vorhandenem D-U-N-S meist einige Tage bis etwa zwei Wochen (nicht von Google bestätigt, die Prüfzeit steht dort im Formular). Der Name im Konto muss zur D-U-N-S-Registrierung passen. (Ich lege kein Konto an und zahle nichts.)
2. **Upload-Schlüssel erzeugen und als Secrets setzen** (siehe nächster Abschnitt). Secrets-Seite: <https://github.com/Mirko-Peters/m365-fm/settings/secrets/actions>, neues Secret: <https://github.com/Mirko-Peters/m365-fm/settings/secrets/actions/new>. Danach <https://github.com/Mirko-Peters/m365-fm/actions/workflows/android-mvp-tracker.yml> > „Run workflow“: Es entsteht `mvp-tracker-release.aab`.
3. **App in der Play Console anlegen:** <https://play.google.com/console/> > „App erstellen“, Name „M365.FM Contributor“, Standardsprache Englisch, App (kein Spiel), kostenlos. Store-Eintrag und alle Erklärungen aus `STORE.md` einfügen; Symbol und Feature-Grafik aus dem Artefakt `mvp-tracker-store-graphics`; Telefon-Screenshots (mind. 2) von der Debug-APK. Unter „Test und Veröffentlichung > Einrichtung > App-Integrität“ **Play App Signing** akzeptieren (Pflicht bei AAB).
4. **Interner Test:** „Test und Veröffentlichung > Tests > Interner Test“ > „Neuer Release“ > `mvp-tracker-release.aab` hochladen > „Tester“ > E-Mail-Liste anlegen (Google-Konten der Tester) > Release starten und den Opt-in-Link an die Tester schicken. Internal Testing ist meist in Minuten bis Stunden bereit.
5. **Fingerabdruck für App-Links eintragen:** Nach dem ersten Upload in der Play Console unter „App-Integrität > App-Signatur“ den **SHA-256-Fingerabdruck des App-Signaturschlüssels** kopieren und in <https://github.com/Mirko-Peters/m365-fm/edit/main/data/android_app_links.json> in `sha256_cert_fingerprints` eintragen (Format `AA:BB:…`, 32 Bytes). Nach dem nächsten Seitenbau liefert <https://www.m365.fm/.well-known/assetlinks.json> die Datei aus. Bis dahin öffnen Links einfach im Browser.
6. **Test-Pflichten und Prüfung beachten:**
   - Die Pflicht „12 Tester, 14 Tage geschlossener Test“ gilt nach Googles Regel nur für **persönliche** Entwicklerkonten, die nach dem 13.11.2023 erstellt wurden; **Organisationskonten sind ausgenommen** (Quelle: Zitat der Google-Regel in einem Drittartikel, dev.to; die Google-Hilfeseite 14151465 war für mich nicht abrufbar. Bitte in der Play Console unter „Test und Veröffentlichung“ prüfen, ob dort trotzdem eine Test-Aufgabe vor dem Produktionszugang steht).
   - Auch ohne diese Pflicht prüft Google jeden Release (Produktion: oft 1 bis 7 Tage, die erste Einreichung länger). Fehlende Angaben (Data safety, Datenschutz-URL, Kontolöschung, Testkonto für die Prüfung) führen zu Ablehnung.
   - Vor dem Produktions-Release: Datenschutzerklärung ergänzen (Lücke siehe `STORE.md`), Testkonto für Google anlegen (Zugangsdaten nur in der Play Console).

### Upload-Schlüssel erzeugen (ohne dass er irgendwo sichtbar wird)

Im Repo gibt es **keinen** Workflow, der GitHub-Secrets setzen kann: `admin-setzen.yml` schreibt nur ein Cloudflare-Worker-Secret, `secrets-check.yml` liest nur. GitHub erlaubt es dem Workflow-Token nicht, Repository-Secrets zu schreiben (dafür bräuchte man einen persönlichen Zugriffstoken mit Admin-Recht, den es hier nicht gibt, und ich würde keinen anlegen). Einen Schlüssel im Workflow zu erzeugen und als Artefakt abzulegen wäre unsicher. Der einfachste sichere Weg:

1. Auf Mirkos PC einen Schlüssel erzeugen (Java nötig; Android Studio bringt `keytool` mit, ohne den PATH zu ändern mit vollem Pfad aufrufen, z. B. `"C:\Program Files\Android\Android Studio\jbr\bin\keytool.exe"`):
   `keytool -genkeypair -v -keystore m365fm-upload.jks -alias upload -keyalg RSA -keysize 2048 -validity 10000`
   Die Passwort-Abfrage von keytool nutzen (nicht auf der Kommandozeile tippen) und für Speicher und Schlüssel **dasselbe** Passwort wählen. Die Datei außerhalb des Repos in einem Passwortmanager sichern. (Geht sie verloren, kann Google den Upload-Schlüssel auf Antrag zurücksetzen; der App-Signaturschlüssel liegt bei Google.)
2. In PowerShell in den Ordner der Datei wechseln und in die Zwischenablage kopieren:
   `[Convert]::ToBase64String([IO.File]::ReadAllBytes("m365fm-upload.jks")) | Set-Clipboard`
3. Auf <https://github.com/Mirko-Peters/m365-fm/settings/secrets/actions/new> vier Secrets anlegen:
   `ANDROID_KEYSTORE_BASE64` (Einfügen aus der Zwischenablage), `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS` (`upload`), `ANDROID_KEY_PASSWORD` (dasselbe wie Speicher-Passwort).
4. Die Datei `m365fm-upload.jks` danach vom PC löschen, wenn sie im Passwortmanager liegt.

Optional für Push: `GOOGLE_SERVICES_JSON_BASE64` (Base64 der `google-services.json`, siehe unten).

## Native Push (FCM): was Mirko tun muss und was noch fehlt

Aktiv wird Push erst, wenn **alle** drei Teile da sind. Version 1 kommt ohne Push in den Store: Ohne Secret `GOOGLE_SERVICES_JSON_BASE64` baut der Workflow das Plugin gar nicht ein (die erste Probe mit Plugin zeigte `POST_NOTIFICATIONS`, `WAKE_LOCK` und `c2dm.RECEIVE` im Manifest, die in Version 1 nichts zu suchen haben). Die Data safety nennt deshalb noch kein Push-Token.

1. **Firebase:** <https://console.firebase.google.com/> > Projekt anlegen > „Android-App hinzufügen“ mit Paketname `fm.m365.contributor` > `google-services.json` herunterladen (nicht ins Repo!) > Base64 (PowerShell wie oben) als Secret `GOOGLE_SERVICES_JSON_BASE64` setzen. Für den Versand aus dem Worker: unter Projekteinstellungen > Dienstkonten einen Schlüssel für das Firebase-Dienstkonto erzeugen und als Cloudflare-Worker-Secret (z. B. `FCM_SERVICE_ACCOUNT_JSON`) ablegen, nie im Repo. Mit der Datei baut der CI-Lauf das Plugin ein (`customize_android.py` kopiert sie, die Capacitor-Vorlage aktiviert das Google-Services-Plugin dann); dieser Pfad ist nicht getestet.
2. **Worker (`worker/src/push.js`) erweitern, nur beschrieben, nicht gebaut:** Heute sendet `sendPush` ausschließlich Web-Push (VAPID, `aes128gcm`) an `push_subs.endpoint`. Für FCM nötig: (a) Spalte oder Tabelle für Gerätetokens (z. B. `push_subs.kind = 'fcm'` mit dem Token als `endpoint`, `p256dh`/`auth` leer) und eine Route, die den Token eines angemeldeten Nutzers speichert; (b) `sendPush` verzweigt bei `kind === 'fcm'`: OAuth2-Zugriffstoken aus dem Dienstkonto holen (JWT mit RS256 per WebCrypto, Scope `https://www.googleapis.com/auth/firebase.messaging`, Austausch bei `https://oauth2.googleapis.com/token`, wie `vapidJwt` aber RS256) und `POST https://fcm.googleapis.com/v1/projects/<projekt>/messages:send` mit `{message:{token, notification|data}}`; (c) Antwort `UNREGISTERED`/404 löscht den Token wie bisher 404/410 beim Web-Push; (d) die bestehenden Themen-/Digest-Versandwege (`topic_queue`, `topic_deliveries`) nutzen `sendPush` und müssten die Token-Art durchreichen.
3. **Web-App:** Auf der Contributor-Seite erkennt `window.Capacitor?.isNativePlatform?.()` die App, fragt die Berechtigung an (`PushNotifications.requestPermissions()`, Android 13+ braucht `POST_NOTIFICATIONS`, das noch nicht im Manifest steht) und sendet den Token an die neue Route. Das Plugin ist über die Capacitor-Brücke auch auf der Remote-Seite erreichbar (`window.Capacitor.Plugins.PushNotifications`, nicht getestet). Danach Data safety (Geräte-ID/Push-Token) und Datenschutzerklärung aktualisieren **bevor** ein Release mit Push erscheint.

## assetlinks.json (App-Links)

`site_contributor.py` schreibt `/.well-known/assetlinks.json` für `fm.m365.contributor` mit den Fingerabdrücken aus `data/android_app_links.json`. Solange die Liste leer oder ungültig ist, wird **keine** Datei erzeugt (nie erfundene Werte). Test: `python3 -m unittest tests.test_android_assetlinks`. Wenn die Seite per Cloudflare-Worker/Regel verändert wird: `/.well-known/assetlinks.json` muss ohne Weiterleitung, mit Status 200 und `application/json` ausgeliefert werden. Den Fingerabdruck des Debug-Schlüssels kann man zusätzlich eintragen, wenn man App-Links mit der Debug-APK testen will.

## Was nicht getestet ist

- Ich konnte keine App auf einem Gerät oder Emulator ausführen; Teilen-in-die-App, Zurück-Taste, Splash, Statusleiste, Offline-Seite, Anmeldung im WebView und App-Links sind nur gebaut, nicht erprobt.
- Anmeldung mit Microsoft/LinkedIn/GitHub im WebView ist nicht ausprobiert (Cookies über `api-dub.m365.fm`, `SameSite`); Google-Anmeldung geht nachweislich nicht (siehe oben).
- Der Release-Build mit Signierung lief nicht (keine Secrets); nur der unsignierte Release-Probelauf kann im CI-Ergebnis stehen (siehe PR).
- Google-Hilfeseiten (Richtlinie „Minimum Functionality“, Testpflicht 14151465) waren für mich nicht abrufbar; die Angaben dazu stammen aus dem Android-Developers-Blog und Drittquellen und müssen in der Play Console gegengeprüft werden.
- Teilen aus einer App funktioniert nur für Text mit `https://`-Link; ohne Anmeldung geht der geteilte Link beim Weiterleiten zur Anmeldung verloren.
