# Certopus: Zertifikat für den Lernpfad-Abschlusstest

Wer den kostenlosen Abschlusstest eines Lernpfads besteht (Testseite `/learn/path/<pfad>/test/`, de: `/de/learn/path/<pfad>/test/`), kann ein Zertifikat anfordern.
Der Worker (`worker/src/learnquiz.js`) legt es über die Certopus-API an (`POST https://api.certopus.com/v1/certificates`, Header `x-api-key`), Certopus veröffentlicht es
und schickt die E-Mail. Die Seite zeigt danach den Link zum Zertifikat, das PDF und „Zu LinkedIn hinzufügen“.

**Empfänger = E-Mail-Adresse der Anmeldung** (Entscheidung Mirko 24.11.2026: „die mail aus der anmeldung nehmen“ – „oauth“). Es gibt kein E-Mail-Feld.
Ablauf auf der Testseite nach dem Bestehen:
1. Das Formular hat nur Name und Einwilligung. Darüber steht „Das Zertifikat geht an die E-Mail-Adresse Ihrer Anmeldung: m\*\*\*@example.com (Google)“
   oder – wenn noch keine vorliegt – je verknüpftem Anbieter ein Knopf „E-Mail aus Ihrer Anmeldung bei <Anbieter> übernehmen“.
2. Der Knopf startet einen **Zusatzschritt nur für das Zertifikat**: `GET https://api-dub.m365.fm/auth/login/<anbieter>?purpose=certmail&path=<pfad>&return=<testseite>`.
   Nur mit gültiger Sitzung und nur für einen mit dem Konto verknüpften Anbieter. Zweck, Nutzer, Zeit, Sitzungs-Hash und Pfad stehen im signierten state-Cookie
   (`m365o`, wie beim Verknüpfen), nicht nur in der URL. Scopes nur für diesen Schritt (`CERTMAIL_SCOPE`): Google und Microsoft `openid email`,
   LinkedIn `openid profile email` (wie die Anmeldung), GitHub `read:user user:email`. Die normale Anmeldung behält ihre Scopes (Google/Microsoft `openid profile`,
   GitHub `read:user`). Die Redirect-URI bleibt `/auth/callback/<anbieter>` – bei den Anbietern ist nichts neu einzutragen.
3. Der Callback (`certMailCallback`) **meldet nie an, verknüpft nichts und legt kein Konto an**. Er prüft: Sitzung passt zum state, die zurückgegebene
   Anbieter-Identität (Anbieter + `sub`/ID) gehört genau diesem Nutzer (`user_identities`, alte Konten `users.provider/sub`; nur lesend), der Test ist bestanden.
   Übernommen wird nur eine **vom Anbieter bestätigte** Adresse:
   - Google, LinkedIn: `email_verified === true` aus userinfo;
   - GitHub: `GET https://api.github.com/user/emails`, nur die Adresse mit `primary` und `verified`;
   - Microsoft: aus dem `id_token` (direkt vom Token-Endpunkt; `aud` = Client-ID, `sub` = userinfo-`sub`), nur private Microsoft-Konten
     (`tid` `9188040d-6c67-4c5b-b112-36a304b66dad`) oder mit Claim `xms_edov === true`. Arbeits- und Schulkonten ohne diesen Beleg werden abgelehnt
     (bekannte „nOAuth“-Schwäche: ein Tenant-Admin kann das Mail-Attribut frei setzen).
   Gespeichert wird nur in `learn_certs` (Zeile `status='draft'` je Nutzer und Pfad, Spalten `email`, `email_src` = Anbieter, `email_at`) – nicht in `mail_addr`,
   nicht im Konto; das Access-Token wird nicht gespeichert. Zurück geht es auf die Testseite mit `?certmail=ok|wrong_account|unverified|session|cancel|not_passed|issued|busy|error`;
   die Seite entfernt den Parameter, zeigt Ergebnis (aus `sessionStorage`) und Formular wieder und den passenden Hinweis.
4. **Rückfall:** Ohne Adresse aus der Anmeldung gilt eine bereits bestätigte Adresse des Kontos (`mail_addr`, `verified=1`, `email_src` = `account`) – ebenfalls nie frei eingetippt.
   Bei wartenden Zeilen mit `account` nimmt das Ausstellen (Anfrage oder Cron) die dann bestätigte Adresse (wie `GET` sie anzeigt); gibt es keine mehr, wird nichts
   gesendet (`status='error'`, `error='need_email'`).
5. `POST /api/learn/cert {path, attempt, name, consent, lang}` nimmt die Adresse nur so; ohne beides `409 need_email`, ein mitgeschicktes abweichendes
   `email`-Feld `400 email_fixed`. `GET /api/learn/cert` liefert nur `email_masked`, `email_src` und `providers` (verknüpft und im Worker eingerichtet), nie die Adresse.
6. Konto löschen: `deleteUserLearn` entfernt alle Zeilen samt E-Mail und Herkunft. Zusammenführen: Hat das Zielkonto nur einen Entwurf, das Quellkonto aber eine
   Anforderung, gilt die des Quellkontos (`mergeStatements` in `worker/src/identities.js`).

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
   (`tools/pillar_quiz.py push`). Im Log muss die Antwort `'upserted': 60`, `'deactivated': 0`, `'total': 60`, `'pillars': 10` stehen (10 Leitfäden × 6 Fragen;
   0055 war nie live, alte IDs gibt es dort nicht) und keine `::warning::Schluessel-Push` (sie erscheint, sobald ein Push Fragen stilllegt).
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
7. **Testabschluss inkl. E-Mail-Schritt** mit je einem eigenen Konto pro Anbieter (das Konto muss die Anmeldung verknüpft haben):
   - **Google:** bestehen, „E-Mail aus Ihrer Anmeldung bei Google übernehmen“ → Google fragt nach der E-Mail-Berechtigung → zurück auf der Testseite,
     Hinweis „übernommen“, maskierte Adresse mit „(Google)“; bei Google ein anderes, nicht verknüpftes Google-Konto wählen → Hinweis „gehört nicht zu Ihrem
     m365.fm-Konto“, die Sitzung bleibt dieselbe (weiter als dasselbe Konto angemeldet).
   - **Microsoft privat** (outlook.com/hotmail.com): Adresse wird übernommen. **Microsoft Arbeitskonto:** erwartet „nicht bestätigt“, solange die Organisation
     `xms_edov` nicht mitsendet (siehe offene Punkte). Wird auch ein privates Konto abgelehnt, im Worker-Log prüfen, ob `sub` im id_token und in userinfo gleich sind.
   - **LinkedIn:** Adresse wird übernommen (LinkedIn liefert `email_verified`).
   - **GitHub:** GitHub fragt nach `user:email`; übernommen wird die primäre, bestätigte Adresse.
   - Danach Name + Häkchen → Zertifikat anfordern; E-Mail, Zertifikatsseite, PDF und LinkedIn-Knopf der Testseite prüfen (Schritt 7 oben), Zahlen unter `/api/learn/stats`.
   - Normale Anmeldung danach mit allen vier Anbietern einmal prüfen (Scopes unverändert, kein E-Mail-Dialog).

**Offene Punkte (blockieren den Merge nicht):**
- *Microsoft-Arbeitskonten:* Ohne den optionalen Claim `xms_edov` lehnt der Worker deren E-Mail ab (Hinweis „nicht bestätigt“, andere Anmeldung wählen).
  Soll das gehen, in Entra ID (App-Registrierung des Logins, Client-ID `MS_CLIENT_ID`) unter *Token configuration → Add optional claim → ID* die Claims
  `email` und `xms_edov` hinzufügen (fehlt `xms_edov` in der Liste: im Manifest unter `optionalClaims.idToken` eintragen). Private Microsoft-Konten brauchen das nicht.
  **Empfehlung: vor dem Einschalten (`CERTOPUS_ON=1`) erledigen**, sonst bekommen Mitglieder, die nur mit dem M365-Arbeitskonto angemeldet sind und keine bestätigte
  Adresse im Konto haben, kein Zertifikat (`409 need_email`). Danach Schritt 7 mit einem echten Arbeitskonto prüfen. Nicht geprüft: ob `xms_edov` bei der
  `common`-Anmeldung für alle Tenants kommt. Bei den anderen Anbietern ist in der Konsole nichts zu tun (gleiche Redirect-URI, LinkedIn mit den Login-Scopes,
  GitHub als OAuth App mit dynamischen Scopes).
- *Übersetzte Pfadseiten:* `translate_pillars.py` fordert jetzt neue oder im Englischen geänderte UI-Schlüssel je Sprache einzeln nach (`uix`, Hash je Schlüssel in
  `data/pillars_i18n.json` `ui_h`) und erkennt eine versehentlich deutsche Oberfläche (pl, id) und fordert sie ganz neu an. Das läuft **nicht automatisch**
  beim Merge: Nach künftigen Textänderungen Workflow **„Pillar-Leitfaeden uebersetzen“** (`translate-pillars.yml`) mit `mode=run`, `ui_only=true` starten
  (Haiku-Batch, wenige Cent). Für PR #606 lief das einmalig auf dem Branch (siehe unten „Übersetzung“).
- *Merge-Reihenfolge mit PR #527:* #527 nutzt ebenfalls die Nummer `0055` (`0055_orphan_handles.sql`, dazu `0054_person_entity.sql` neben main-`0054`) und ändert
  `worker/src/identities.js`. Wird #606 zuerst gemergt, muss #527 vor seinem Merge auf `0056`/`0057` umnummerieren und `identities.js` mit dem Block zu
  `learn_attempts`/`learn_certs` abgleichen.
- *Ausblenden in den ersten 3 Tagen:* Direkt nach dem ersten Push sind alle Fragen „neu“; in dieser Zeit kann eine manipulierte Seite je Leitfaden nur die
  höchsten Nummern weglassen (mindestens 4 bleiben) und höchstens 2 von 10 Leitfäden. Weil Lösungen erst nach dem Bestehen bzw. dem letzten Versuch
  kommen, lässt sich daraus keine planbare Auswahl bekannter Fragen bauen.
- *Kursausbau 26.11.2026 (20 Leitfäden, 15 Vertiefungen):* Fragen je Leitfaden-Gruppe = `perGroup(G) = min(3, max(2, ceil(30 / G)))` über die Gruppen mit
  Fragen (Worker `worker/src/learnquiz.js` und Seite `site_pillars.per_group` gleich): 10 Gruppen 30 Fragen (bestanden ab 24, wie bisher), 15 Gruppen 30/24,
  20 Gruppen 40/32; Bestehensgrenze weiter 80 %. Leitfäden ohne Fragen zählen nicht mit. Vertiefungen liefern Fragen zur Gruppe ihres Eltern-Leitfadens
  (`src` in `data/pillar_quiz.json`). Neue Leitfäden und Vertiefungen stehen auf der Freigabeliste `hold`: `tools/pillar_quiz.py run` ohne `--pillars` erzeugt
  sie nicht; `plan` nennt Kosten-Obergrenze und Aufruf. Kommen viele neue Gruppen auf einmal in den Worker (Schlüssel vor dem Seitenbau), zählen ganz neue
  Gruppen (alle Schlüssel jünger als 3 Tage, der Seite unbekannt) nicht zur 80-%-Basis von `pageFilter`: der Test bleibt bis zum Seitenbau beim alten Satz.
- *Reihenfolge beim Fragenlauf für neue Leitfäden:* (1) Merge des Kursausbaus und ein **grüner** `site.yml`-Lauf, der die neuen Seiten veröffentlicht;
  (2) erst dann `pillar-quiz.yml mode=run pillars=<IDs>`, am besten auf einem Arbeitszweig – der Merge danach startet `worker.yml` (Schlüssel) und
  `site.yml` (Testseite, `data/pillar_quiz.json` steht in den Push-Pfaden) zugleich; (3) prüfen, dass der nächste Seitenbau grün ist. Die Testseite muss
  die neuen Fragen spätestens **3 Tage** (`HAVE_GRACE`) nach dem Einspielen der Schlüssel zeigen: danach gelten die Schlüssel als alt, `pageFilter` blendet
  sie nicht mehr aus, und Fragen, die die Seite nicht kennt, zählen als falsch – mit 20 Gruppen wäre der Test dann nicht mehr zu bestehen. Läuft `run`
  direkt auf main, pusht der Workflow mit dem Standard-Token: das startet weder `site.yml` noch `worker.yml`, die Schlüssel gehen aber sofort an den
  Worker (auto_push); die Seite kommt erst mit dem nächtlichen Bau. Ist der Seitenbau rot, die neuen Schlüssel stilllegen: `data/pillar_quiz_keys.enc`
  auf den Stand vor dem Lauf zurücksetzen (Revert-Commit), `worker.yml` sendet ihn, `tools/pillar_quiz.py push` setzt fehlende qids auf `active=0`.
- *Rückweg Kursausbau:* weich – `"noindex": true` je Leitfaden oder Vertiefung in `data/pillars.json` (Seite bleibt erreichbar, ohne Sitemap und hreflang);
  hart – Revert der Commits (der Purge meldet die entfallenen Seiten). Fragen der neuen Leitfäden wie oben stilllegen. Eine Vertiefung unter einen anderen
  Leitfaden zu hängen (`parent`) ändert ihre Adresse und braucht eine 301 von der alten.
- *Deutsche Fassung der Kurs-Erweiterung (26.11.2026):* Mirkos Dateien liegen unverändert unter `imports/pillars/de/<slug>.md` und
  `imports/pillars/de/clusters/<slug>.md`; `slug.de` (Leitfäden und Vertiefungen) und `label.de` (Vertiefungen) in `data/pillars.json` schalten die Seiten
  `/de/learn/<slug>/` und `/de/learn/<eltern>/<vertiefung>/` frei, mit hreflang de↔en und x-default en. Der deutsche Test fragt dieselben Gruppen wie der
  englische und verlinkt die deutschen Seiten; die deutschen Fragen kommen wie bisher aus dem Fragenlauf. Rückweg: `slug.de` entfernen (die Seiten fallen auf
  die englische Fassung zurück, keine toten Links), für die gebauten `/de/`-Adressen eine 301 auf die englische Seite setzen.
- *Übersetzerlauf für die 10 neuen Leitfäden (13 Sprachen):* von Hand mit `translate-pillars.yml`, erst nach dem Merge und einem grünen `site.yml`-Lauf.
  Ohne Feld `pillars` nimmt der Lauf die neuen Leitfäden jetzt mit (sie haben `slug.de`), Quelle bleibt die englische Datei; vorher `mode=plan`
  (Kostenschätzung). Der Lauf pusht mit dem Standard-Token: das startet keinen Seitenbau, die übersetzten Seiten kommen mit dem nächtlichen Bau oder einem
  Handlauf von `site.yml`. Bis dahin meldet der Bau je Sprache nur eine Sammelzeile „noch ohne Übersetzung“. Vertiefungen übersetzt der Lauf nicht; dafür
  reicht `translate_pillars.py` allein nicht: `build_clusters`/`_cluster_docs`, der Kasten „Deep dives“, `hasPart` und `see_links` arbeiten nur für en/de.
- *Infografiken der neuen Leitfäden:* bei der Freigabe von `pillar_hold` (`data/infographics_live.json`) entstehen jetzt auch deutsche Bildtexte
  (`pillar_langs` = en, de); vorher `tools/infographics.py plan --kinds pillar --langs en,de` (nur Schätzung) und die Kosten mit de angeben.
- *Hinweis „Ausführlich:“ (`see` in `data/pillars.json`):* direkt unter der passenden Überschrift eines Leitfadens ein Link auf den spezialisierten
  Leitfaden oder die Vertiefung (gegen Kannibalisierung, en und de). Ändert Mirko eine Überschrift, meldet der Bau „Sprungmarke für Hinweis … fehlt“ und
  der Test schlägt fehl; dann die Sprungmarke in `see.at` nachziehen. Sitemap-`lastmod` eines Leitfadens = jüngstes Datum seiner verlinkten neuen Ziele.

**Anrede:** Seite, E-Mail und Zertifikat siezen („Sie“), passend zu den Leitfäden (Entscheidung 24.11.2026).

**Name** (`POST /api/learn/cert`): Der Name darf keine Webadresse, Domain, `@` oder `/` enthalten (er steht öffentlich auf dem Zertifikat).
Geprüft und gespeichert wird er normalisiert (NFKC, ohne Formatzeichen), damit Vollbreiten-Punkte, `[.]` oder unsichtbare Zeichen die Regel nicht umgehen;
Domains werden auch mitten im Text erkannt („evil.com today“), Namen wie „Dr. Max“, „J. R. Smith“ oder „M.Sc.“ bleiben erlaubt.
Empfänger: siehe oben („Empfänger = E-Mail-Adresse der Anmeldung“).

**Antwortschlüssel im Worker.** Der Test startet erst, wenn der Worker die Schlüssel kennt (sonst zeigt die Seite „Test folgt in Kürze“).
Sie kommen aus `data/pillar_quiz_keys.enc`: `tools/pillar_quiz.py push` entschlüsselt die Datei mit `CRON_KEY` und schickt
`{path, keys:[{qid, pillar, answer, why_en, why_de}]}` an `POST https://api-dub.m365.fm/api/internal/learn-quiz` (Header `x-cron-key`; Upsert,
ein ungültiger Eintrag lässt den ganzen Push mit 400 scheitern). Der Push ist je Pfad maßgeblich: nicht mehr gesendete Fragen legt der Worker still
(`active=0`, nicht gelöscht – offene Versuche bleiben wertbar; kennt die neue Testseite die Fragen eines offenen Versuchs nicht mehr, verwirft der Start
ihn und gibt den Versuch zurück); die Antwort nennt `upserted`, `deactivated`, `total` und `pillars`, das Log zeigt alle vier. Das passiert automatisch am Ende von `pillar-quiz.yml` (mode=run, nur auf main) und nach jedem
Worker-Deploy in `worker.yml` (Schritt „Lernpfad-Schluessel an den Worker“); von Hand: Workflow `pillar-quiz.yml` mit mode=push.
Kommen Schlüssel vor dem nächsten Seitenbau an (neuer Leitfaden), zieht der Worker nur Fragen, die die Testseite kennt (die Seite schickt ihre Fragen-IDs mit).
Ausblenden darf die Seite dabei nur Fragen, die erst vor weniger als 3 Tagen zum ersten Mal gepusht wurden (`learn_quiz_keys.created`) und die sie nicht
kennen kann (höhere Nummer als ihre höchste des Leitfadens, oder der ganze Leitfaden fehlt); ältere Fragen bleiben immer im Pool. Kennt die Seite gar keine
aktive Frage (neuer Fragensatz, Seitenbau steht aus), antwortet der Worker 409 `page_outdated`, die Seite bittet um späteres Neuladen.
**Lösungen nach der Abgabe:** Richtige Option und Erklärung gibt es für richtig beantwortete Fragen, nach dem Bestehen für alle, ohne verbleibende Versuche für
alle beantworteten – sonst ließe sich der Schlüssel mit leeren Abgaben abfragen (60 Fragen im Pool). Davor sehen Nutzer richtig/falsch je Frage und das Ergebnis je Leitfaden.
Die Position der richtigen Option ist geheim (HMAC mit einem aus `CRON_KEY` abgeleiteten Schlüssel). Weil die alte, nachrechenbare Reihenfolge der ersten
60 Fragen in der Git-Historie steht, hat `tools/pillar_quiz.py regen` (Workflow `pillar-quiz.yml`, mode=regen, einmalig; Marke `regen` im Schlüssel) alle Fragen
neu erzeugt. Die alten IDs stehen in `data/pillar_quiz.json` unter `retired` und werden nie wieder vergeben. Der Workflow läuft nur noch von Hand.
Die Lösungen lokal ansehen (nie in Actions, Logs sind öffentlich): `CRON_KEY=… python3 tools/pillar_quiz.py show`.

Datenschutz: Name und E-Mail gehen nur mit Häkchen (Einwilligung) an Certopus; der Abschnitt steht in der
Datenschutzerklärung (`/datenschutz/#lernpfad-zertifikat`, `/privacy/#learning-path-certificate`, `site_legal.py`), samt Zusatzschritt E-Mail aus der Anmeldung
(welche Daten vom Anbieter kommen, nur für das Zertifikat gespeichert, Token nicht gespeichert, Löschung mit dem Konto).
Belegt (Microsoft-Connector-Doku `PowerPlatformConnectors/certified-connectors/Certopus`, Commit c5f24b6b): Betreiber DevSquirrel Technologies Private Limited,
Kontakt support@certopus.com, Datenschutzerklärung https://certopus.com/privacy. Nicht belegt: Firmensitz aus einer Primärquelle (Indien nur aus Drittquellen),
ein Auftragsverarbeitungsvertrag, Standardvertragsklauseln, Serverstandort – deshalb stützt sich die Übermittlung auf die Einwilligung (Art. 49 Abs. 1 lit. a DSGVO).
Die Seite enthält nur die belegten Angaben; eine juristische Prüfung steht aus.

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
| E-Mail aus der Anmeldung (Zusatzschritt) | `worker/src/index.js` (`/auth/login/<anbieter>?purpose=certmail`, Callback-Zweig `certmail`), `worker/src/learnquiz.js` (`certMailIntent`, `certMailCallback`, `providerEmail`) |
| Übersetzung der Testtexte | `translate_pillars.py` (`uix`, `--ui-only`), Workflow `translate-pillars.yml` (`ui_only`) |
| IDs auslesen | `tools/certopus_ids.py`, Workflow `certopus-ids.yml` |
| Schlüssel an den Worker | `tools/pillar_quiz.py push` → `POST /api/internal/learn-quiz` (`pillar-quiz.yml`, `worker.yml`) |
| Zusammenspiel geprüft | `tests/test_lernpfad_e2e.py`, `worker/test/learnquiz_e2e.test.mjs`, `worker/test/learnquiz_certmail.test.mjs` (OAuth-Schritt), `tests/test_learnquiz_browser.py` (Formular im Browser) |

## Übersetzung

Der Kasten auf der Pfadseite und die Testseite nutzen `site_pillars.UI` (`q_*`); übersetzte Sprachen (fr, es, it, nl, pt, pl, id, ru, uk, ar, he, ja, ko) lesen
`data/pillars_i18n.json` und fallen sonst auf Englisch zurück. Die Fragen selbst gibt es nur auf Englisch und Deutsch (`qlang`).
`translate-pillars.yml` läuft nur von Hand (kein Trigger beim Merge; nach künftigen Textänderungen `mode=run`, `ui_only=true`). Für PR #606 lief er
einmalig auf dem Branch per Push-Trigger mit `--ui-only` (Trigger danach entfernt), Haiku-Batch, zusammen rund 0,013 $:
- Lauf [45408778441](https://github.com/Mirko-Peters/m365-FM/actions/runs/45408778441) (Commit `1d178652`): 11 Sprachen (fr, es, it, nl, pt, ru, uk, ar, he, ja, ko)
  bekamen die fehlenden 79 UI-Schlüssel einzeln (`uix`); **id** wurde ganz neu übersetzt (Oberfläche, Pfadtitel, Stufen, Leitfaden-Namen waren deutsch).
- **pl bleibt offen:** Haiku lieferte für Polnisch in drei Läufen (45408778441, 45410648057, 45412567793) wieder Deutsch; die neue Prüfung hat das jedes Mal
  abgelehnt (`data/pillars_i18n/rejected/pl___ui.txt`), `data/pillars_i18n.json` blieb für pl unverändert. Folge: Die polnische Oberfläche ist weiter deutsch,
  die `q_*`-Texte fallen dort auf Englisch zurück. pl ist nicht freigegeben (nicht in `index`, noindex). Nächster Versuch z. B. mit `TRANSLATE_MODEL` (Sonnet) für
  `--langs pl --ui-only`, oder die pl-Texte von Hand.
