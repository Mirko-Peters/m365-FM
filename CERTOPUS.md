# Certopus: Zertifikat für den Lernpfad-Abschlusstest

Wer den kostenlosen Abschlusstest eines Lernpfads besteht (Testseite `/learn/path/<pfad>/test/`, de: `/de/learn/path/<pfad>/test/`), kann ein Zertifikat anfordern.
Der Worker (`worker/src/learnquiz.js`) legt es über die Certopus-API an (`POST https://api.certopus.com/v1/certificates`, Header `x-api-key`), Certopus veröffentlicht es
und schickt die E-Mail. Die Seite zeigt danach den Link zum Zertifikat, das PDF und „Zu LinkedIn hinzufügen“.

Solange etwas fehlt (Secret, IDs, Vorlage, Schalter), läuft der Test trotzdem: bestandene Versuche werden gespeichert, die Seite zeigt
„Ihr Zertifikat folgt in Kürze – Sie erhalten es per E-Mail“, und der Worker stellt wartende Zertifikate später aus (Cron alle 30 Minuten oder erneuter Klick),
sobald `CERTOPUS_ON="1"` ist.

Antwortschlüssel stehen nie im Klartext im Repo (es ist öffentlich): `data/pillar_quiz.json` enthält nur Fragen und Optionen, die Lösungen liegen verschlüsselt in
`data/pillar_quiz_keys.enc` und im Worker (D1).

## Einrichtung Schritt für Schritt

Stand 24.11.2026: Schritte 1–3 sind erledigt. Offen sind die Schritte unter „Nach dem Merge“ (unten) – die Schritte 4–7 hier beschreiben sie im Detail.

1. **Erledigt (24.11.2026). API-Schlüssel als GitHub-Secret anlegen.** In Certopus: Einstellungen → API → Schlüssel kopieren. In GitHub: Repository → Settings → Secrets and variables →
   Actions → *New repository secret*, Name `CERTOPUS_API_KEY`, Wert einfügen. Den Schlüssel nie in Code, Chat, Issues oder Commits schreiben.
   `worker.yml` reicht ihn beim nächsten Worker-Deploy an den Worker weiter (`worker/setup.mjs`).
2. **Erledigt (24.11.2026). IDs auslesen.** Actions → Workflow **„Certopus-IDs auslesen (nur lesen)“** (`certopus-ids.yml`) → *Run workflow*, bei Bedarf eine andere Event-ID eingeben.
   Das Protokoll zeigt Organisation, Event, Kategorien und die Felder der Vorlage (`recipient_fields`), nie den Schlüssel.
   Dahinter steckt `tools/certopus_ids.py` (nur lesende Aufrufe `GET /organisations`, `/events/<org>`, `/categories`, `/recipient_fields`).
   Lokal geht es auch: `CERTOPUS_API_KEY=… python3 tools/certopus_ids.py [event-id]` (ohne Event-ID gilt das Event des Lernpfads);
   Rückgabe 0 = Event gefunden, 1 = nicht gefunden oder API-Fehler, 2 = Schlüssel fehlt.
   Stand 24.11.2026: Organisation `projectmanagementgroup` („M365 Show“), Event `1b364220-e7df-11f1-a542-95dd4baa2628`
   („Manufacturing Excellence: From Lean Basics to Digital Production Planning“), Kategorie `1b361b10-e7df-11f1-a542-95dd4baa2628` („Completion“;
   daneben „Achievement“ `1b361b11-…`). Felder der Vorlage heute: `email`, `{Name}`.
3. **Erledigt (24.11.2026). IDs eintragen.** In `worker/wrangler.toml` unter `[vars]` die Var `CERTOPUS_PATHS` (JSON, ein Eintrag je Lernpfad):
   ```toml
   CERTOPUS_PATHS = '{"manufacturing-excellence":{"org":"projectmanagementgroup","event":"1b364220-e7df-11f1-a542-95dd4baa2628","category":"1b361b10-e7df-11f1-a542-95dd4baa2628","course":{"en":"Manufacturing Excellence: From Lean Basics to Digital Production Planning","de":"Manufacturing Excellence: von den Lean-Grundlagen zur digitalen Produktionsplanung"}}}'
   ```
   Ein weiterer Lernpfad bekommt einen eigenen Eintrag mit eigenem Event (und eigener Vorlage). Zur Übersicht stehen die IDs auch in `data/pillars.json`
   beim Pfad unter `certopus` (nur Doku; für den Worker gilt `CERTOPUS_PATHS`).
4. **Vorlage im Certopus-Editor bauen** (Event → Kategorie „Completion“ → Vorlage bearbeiten):
   - Platzhalter setzen: `{Name}`, `{Course}`, `{Score}`, `{Date}` (genau so geschrieben, mit geschweiften Klammern; Certopus legt dafür Empfängerfelder an).
   - Den festen Text **„of completion“ entfernen und an seiner Stelle `{Course}` platzieren** – das Zertifikat zeigt dann den Kursnamen.
   - Aussteller: **M365.FM – www.m365.fm**, Unterschrift Mirko Peters.
   - Texte siehe unten („Zertifikat“). Danach den Workflow aus Schritt 2 noch einmal starten und prüfen, dass `recipient_fields` jetzt
     `{Name}`, `{Course}`, `{Score}`, `{Date}` zeigt. Der Worker sendet nur Felder, die die Vorlage kennt (er fragt `recipient_fields` ab und merkt sie sich
     6 Stunden); fest vorgeben lässt sich die Zuordnung mit der Var `CERTOPUS_FIELDS`
     (Standard `{"name":"{Name}","course":"{Course}","score":"{Score}","date":"{Date}"}`).
   - Solange die Vorlage nur `{Name}` hat, kommt der Kursname aus dem Event-Titel bzw. aus festem Text in der Vorlage.
5. **E-Mail-Vorlage einfügen** (Event → E-Mail-Einstellungen; die E-Mail-Vorlage hängt laut Certopus-Hilfe am Event): Betreff und Text aus dem
   Abschnitt „E-Mail“ unten übernehmen. Absendername „M365.FM“, Antwortadresse mirko.peters@m365.fm.
   **Offen: die Variable für den Zertifikatslink.** Ihr genauer Name ist nicht belegt (die Certopus-Doku war aus der Recherche-Umgebung nicht erreichbar;
   auch Drittquellen nennen ihn nicht). So findet Mirko sie: im E-Mail-Editor des Events die Liste der Variablen bzw. Platzhalter öffnen (Einfügen-Menü
   oder Hilfe neben dem Textfeld) und die für den Link zum Zertifikat wählen; damit `<ZERTIFIKATSLINK>` ersetzen, ebenso `{Name}`/`{Course}`,
   falls der Editor dafür eine andere Schreibweise erwartet. Bietet der Editor nur einen festen Knopf „Zertifikat ansehen“, diesen an die Stelle setzen.
   Dann eine Testsendung an die eigene Adresse schicken und prüfen, dass Link, Name und Kursname ersetzt sind. Findet sich nichts: support@certopus.com fragen.
   Den gefundenen Namen hier eintragen.
6. **Einschalten.** In `worker/wrangler.toml` `CERTOPUS_ON = "1"` setzen und den Worker deployen (Push auf main mit Änderung unter `worker/` startet `worker.yml`).
   Notschalter: wieder `"0"` – dann sammelt der Worker Anfragen als „pending“ und stellt sie nach dem Wiedereinschalten aus.
7. **Prüfen.** Mit einem eigenen Konto den Test machen (oder einen Testnutzer nehmen), Zertifikat anfordern, E-Mail, Zertifikatsseite, PDF und LinkedIn-Link ansehen.
   Admins sehen die Zahlen unter `GET https://api-dub.m365.fm/api/learn/stats?path=manufacturing-excellence` (gestartet, abgegeben, bestanden, Zertifikate je Herkunft und Woche).

## Nach dem Merge

Reihenfolge, wenn PR #606 auf main ist:

1. **Automatisch: Worker.** Der Push auf main ändert `worker/` und `data/pillar_quiz_keys.enc`, also startet `worker.yml`: Deploy, Migration 0055
   (`d1 migrations apply`, legt `learn_quiz_keys`, `learn_attempts`, `learn_certs` an), danach der Schritt „Lernpfad-Schluessel an den Worker“
   (`tools/pillar_quiz.py push`). Im Log muss die Antwort `"upserted": 60` stehen (10 Leitfäden × 6 Fragen), `"deactivated": 0` (0055 war nie live, alte IDs gibt es dort nicht).
2. **Automatisch: Seitenbau.** Der Merge ändert `site_*.py` und `assets/`, also startet auch `site.yml` (sonst der nächtliche Bau). Er bringt den Kasten
   „Abschlusstest & Zertifikat“ auf der Pfadseite und die Testseiten `/learn/path/manufacturing-excellence/test/` und
   `/de/learn/path/manufacturing-excellence/test/` mit den Fragen-IDs -7 bis -12. Vorher gibt es die Testseite live nicht; der Worker zieht ohnehin nur
   Fragen, die die Seite kennt (`have`).
3. **Prüfen:** Testseite öffnen, anmelden, Test starten – es kommen 30 Fragen. `CERTOPUS_ON` ist noch `"0"`, ein bestandener Test zeigt „Ihr Zertifikat folgt in Kürze“.
4. **Mirko: Zertifikatsvorlage** (Schritt 4 oben): Platzhalter `{Name}`, `{Course}`, `{Score}`, `{Date}`; Aussteller **M365.FM**; den festen Text „of completion“
   durch `{Course}` (Kursname) ersetzen. Danach `certopus-ids.yml` starten und prüfen, dass `recipient_fields` die vier Felder zeigt.
5. **Mirko: E-Mail-Text einfügen** (Schritt 5 oben, Texte unten unter „E-Mail“), Variable für den Zertifikatslink im Editor suchen, Testsendung.
6. **Einschalten per PR:** in `worker/wrangler.toml` `CERTOPUS_ON = "1"` (eigener kleiner PR; nach dem Merge deployt `worker.yml`). Wartende Zertifikate
   stellt der Cron danach aus.
7. **Testabschluss:** mit einem eigenen Konto bestehen, Zertifikat anfordern; E-Mail, Zertifikatsseite, PDF und LinkedIn-Knopf der Testseite prüfen
   (Schritt 7 oben), Zahlen unter `/api/learn/stats`.

**Anrede:** Seite, E-Mail und Zertifikat siezen („Sie“), passend zu den Leitfäden (Entscheidung 24.11.2026).

**Name und Empfänger** (`POST /api/learn/cert`): Der Name darf keine Webadresse, Domain, `@` oder `/` enthalten (er steht öffentlich auf dem Zertifikat).
Hat das Konto eine bestätigte E-Mail-Adresse (`mail_addr`, verified=1), geht das Zertifikat nur an diese; die Testseite füllt sie vor. Ohne bestätigte Adresse
ist die Eingabe frei, aber höchstens 2 verschiedene Adressen je Nutzer und Pfad.

**Antwortschlüssel im Worker.** Der Test startet erst, wenn der Worker die Schlüssel kennt (sonst zeigt die Seite „Test folgt in Kürze“).
Sie kommen aus `data/pillar_quiz_keys.enc`: `tools/pillar_quiz.py push` entschlüsselt die Datei mit `CRON_KEY` und schickt
`{path, keys:[{qid, pillar, answer, why_en, why_de}]}` an `POST https://api-dub.m365.fm/api/internal/learn-quiz` (Header `x-cron-key`; Upsert,
ein ungültiger Eintrag lässt den ganzen Push mit 400 scheitern). Der Push ist je Pfad maßgeblich: nicht mehr gesendete Fragen legt der Worker still
(`active=0`, nicht gelöscht – offene Versuche werden weiter gewertet); die Antwort nennt `upserted` und `deactivated`. Das passiert automatisch am Ende von `pillar-quiz.yml` (mode=run, nur auf main) und nach jedem
Worker-Deploy in `worker.yml` (Schritt „Lernpfad-Schluessel an den Worker“); von Hand: Workflow `pillar-quiz.yml` mit mode=push.
Kommen Schlüssel vor dem nächsten Seitenbau an (neuer Leitfaden), zieht der Worker nur Fragen, die die Testseite kennt (die Seite schickt ihre Fragen-IDs mit).
Die Position der richtigen Option ist geheim (HMAC mit einem aus `CRON_KEY` abgeleiteten Schlüssel). Weil die alte, nachrechenbare Reihenfolge der ersten
60 Fragen in der Git-Historie steht, hat `tools/pillar_quiz.py regen` (Workflow `pillar-quiz.yml`, mode=regen, einmalig; Marke `regen` im Schlüssel) alle Fragen
neu erzeugt. Die alten IDs stehen in `data/pillar_quiz.json` unter `retired` und werden nie wieder vergeben. Der Workflow läuft nur noch von Hand.
Die Lösungen lokal ansehen (nie in Actions, Logs sind öffentlich): `CRON_KEY=… python3 tools/pillar_quiz.py show`.

Datenschutz: Name und E-Mail gehen nur mit Häkchen (Einwilligung) an Certopus (DevSquirrel Technologies, Indien); der Abschnitt steht in der
Datenschutzerklärung (`/datenschutz/#lernpfad-zertifikat`, `/privacy/#learning-path-certificate`, `site_legal.py`).

## Zertifikat

Die Vorlage ist eine Kategorie je Event; der Worker schickt alle Zertifikate eines Pfads an dieselbe Kategorie. **Englisch ist die Hauptfassung.**
`{Course}` kommt in der Sprache des Tests (deutsche Teilnehmer: deutscher Kursname), `{Date}` als `YYYY-MM-DD` (en) bzw. `TT.MM.JJJJ` (de).
Die deutsche Fassung ist für eine spätere eigene Kategorie/Vorlage gedacht (dann `category` je Sprache im Worker ergänzen).

### Englisch (Hauptfassung)

| Stelle | Text |
|---|---|
| Titel | **CERTIFICATE** |
| Untertitel (statt „of completion“) | `{Course}` |
| Zeile über dem Namen | This is to certify that |
| Name | `{Name}` |
| Zeile darunter | has successfully passed the final test of the learning path `{Course}` with a score of `{Score}`. |
| Datum | Issued on `{Date}` |
| Aussteller | M365.FM – www.m365.fm |
| Unterschrift | Mirko Peters, Author of the learning path |
| *Option (nur wenn Mirko will)* | *Supported by iFAKT* |

### Deutsch

| Stelle | Text |
|---|---|
| Titel | **ZERTIFIKAT** |
| Untertitel (statt „of completion“) | `{Course}` |
| Zeile über dem Namen | Hiermit wird bestätigt, dass |
| Name | `{Name}` |
| Zeile darunter | den Abschlusstest des Lernpfads `{Course}` mit `{Score}` erfolgreich bestanden hat. |
| Datum | Ausgestellt am `{Date}` |
| Aussteller | M365.FM – www.m365.fm |
| Unterschrift | Mirko Peters, Autor des Lernpfads |
| *Option (nur wenn Mirko will)* | *In Zusammenarbeit mit iFAKT* |

`{Score}` sieht so aus: `27/30 (90 %)`.

## E-Mail

Platzhalter wie in der Vorlage: `{Name}`, `{Course}`; `<ZERTIFIKATSLINK>` = Variable des Certopus-E-Mail-Editors für den Zertifikatslink – noch offen, siehe Schritt 5.
Die E-Mail nennt bewusst keine feste Zahl von Leitfäden (der Pfad wächst). Den LinkedIn-Link baut die Testseite selbst (`linkedinUrl` in `worker/src/learnquiz.js`,
`linkedin.com/profile/add` mit Kursname, Aussteller M365.FM, Monat/Jahr, Zertifikats-URL und -ID). Ob die Zertifikatsseite von Certopus selbst einen
LinkedIn-Knopf hat, ist nicht belegt; die E-Mail verweist deshalb auf die Testseite. Hat sie einen, darf der Satz nach der Testsendung ergänzt werden.

### Englisch (Hauptfassung)

**Subject:** Your certificate: {Course}

> Hi {Name},
>
> congratulations – you have passed the final test of the learning path **{Course}** on M365.FM.
>
> Your certificate is ready:
> <ZERTIFIKATSLINK>
>
> **Show it on LinkedIn:** on the final test page, choose “Add to LinkedIn” – the certificate details are filled in for you:
> https://www.m365.fm/learn/path/manufacturing-excellence/test/
> Or add it yourself under *Licenses & certifications* in your profile (issuing organization: M365.FM, credential URL: the link above).
>
> **Keep learning:** all guides of the learning path stay free and are updated regularly:
> https://www.m365.fm/learn/path/manufacturing-excellence/
>
> **From learning to practice – iFAKT**
> The learning path ends with a software example: iFAKT Polaris, a tool from iFAKT GmbH in Stuttgart for digital value stream mapping
> and the planning of production processes. The guide shows how to choose such a tool and what Polaris can and cannot do.
> Read the guide: https://www.m365.fm/learn/ifakt-polaris/
> Learn more about iFAKT: https://www.ifakt.de/
> *Disclosure: Mirko Peters, the author of the learning path, works at iFAKT GmbH.*
>
> Best regards
> Mirko Peters
> M365.FM – www.m365.fm
>
> ---
> M365.FM · Mirko Peters · Julius-Hölder-Str 60 · 70597 Stuttgart · Germany · mirko.peters@m365.fm
> Legal notice: https://www.m365.fm/legal/ · Privacy: https://www.m365.fm/privacy/
> You receive this email because you passed the final test and requested this certificate. This certificate was issued with Certopus.

### Deutsch

**Betreff:** Ihr Zertifikat: {Course}

> Hallo {Name},
>
> herzlichen Glückwunsch – Sie haben den Abschlusstest des Lernpfads **{Course}** auf M365.FM bestanden.
>
> Ihr Zertifikat ist fertig:
> <ZERTIFIKATSLINK>
>
> **Auf LinkedIn zeigen:** Wählen Sie auf der Testseite „Zu LinkedIn hinzufügen“ – die Angaben zum Zertifikat sind dann schon ausgefüllt:
> https://www.m365.fm/de/learn/path/manufacturing-excellence/test/
> Oder tragen Sie es selbst in Ihrem Profil unter *Bescheinigungen und Zertifikate* ein (ausstellende Organisation: M365.FM, URL der Qualifikation: der Link oben).
>
> **Weiterlernen:** Alle Leitfäden des Lernpfads bleiben kostenlos und werden laufend aktualisiert:
> https://www.m365.fm/de/learn/path/manufacturing-excellence/
>
> **Vom Lernen in die Praxis – iFAKT**
> Der Lernpfad endet mit einem Software-Beispiel: iFAKT Polaris, ein Werkzeug der iFAKT GmbH aus Stuttgart für die digitale Wertstromanalyse
> und die Planung von Produktionsprozessen. Der Leitfaden zeigt, wie man ein solches Werkzeug auswählt und was Polaris kann und was nicht.
> Zum Leitfaden: https://www.m365.fm/de/learn/ifakt-polaris/
> Mehr über iFAKT: https://www.ifakt.de/
> *Offenlegung: Mirko Peters, Autor des Lernpfads, arbeitet bei der iFAKT GmbH.*
>
> Viele Grüße
> Mirko Peters
> M365.FM – www.m365.fm
>
> ---
> M365.FM · Mirko Peters · Julius-Hölder-Str 60 · 70597 Stuttgart · Deutschland · mirko.peters@m365.fm
> Impressum: https://www.m365.fm/impressum/ · Datenschutz: https://www.m365.fm/datenschutz/
> Sie erhalten diese E-Mail, weil Sie den Abschlusstest bestanden und dieses Zertifikat angefordert haben. Das Zertifikat wurde mit Certopus ausgestellt.

## Technik in Kürze

| Teil | Datei |
|---|---|
| Kasten „Abschlusstest & Zertifikat“ auf der Pfadseite, Testseite (noindex, nicht in der Sitemap), Texte en/de | `site_pillars.py` (`quiz_box`, `quiz_page`, `UI` „q_…“) |
| Ablauf im Browser (Anmeldung, Fragen, Ergebnis, Zertifikatsformular) | `assets/learnquiz.js` |
| Fragen ohne Lösung (öffentlich) | `data/pillar_quiz.json` (`tools/pillar_quiz.py`, Workflow `pillar-quiz.yml`) |
| Antwortschlüssel (verschlüsselt) | `data/pillar_quiz_keys.enc` → Worker-D1 `learn_quiz_keys` |
| API, Certopus-Aufruf, Zähler | `worker/src/learnquiz.js` (`/api/learn/quiz/start`, `/submit`, `/api/learn/cert`, `/api/learn/stats`) |
| IDs auslesen | `tools/certopus_ids.py`, Workflow `certopus-ids.yml` |
| Schlüssel an den Worker | `tools/pillar_quiz.py push` → `POST /api/internal/learn-quiz` (`pillar-quiz.yml`, `worker.yml`) |
| Zusammenspiel geprüft | `tests/test_lernpfad_e2e.py`, `worker/test/learnquiz_e2e.test.mjs` |
