# Staging: erst testen, dann live

Ziel: Niemand ändert mehr direkt an der Live-Seite herum. Jede Änderung kommt zuerst auf den Zweig `staging`, wird dort automatisch geprüft, und geht erst nach einem Klick von Mirko auf `main` (= live).

Stand: **Schritt 1** (Prüfungen als Pflicht vor Live) und **Schritt 2** (eigene Testumgebung bei Cloudflare: staging.m365.fm, api-staging.m365.fm, eigene Datenbank). Schritt 2 steht weiter unten im Abschnitt „Testumgebung bei Cloudflare“.

> Die Datei liegt im Hauptordner und nicht in `docs/`, weil `docs/` der Ausgabeordner des Seitenbaus ist: er wird bei jedem Bau geleert und auf GitHub Pages veröffentlicht.

## So läuft es

```
Änderung (Pull Request)
        |
        v
   Zweig staging  ---- Push ---->  staging-checks (automatisch)
        |                           Worker-Tests, Python-Tests, MCP-Abdeckung,
        |                           Migrationen, Seitenbau-Probelauf
        |                                  |
        |                       Statuscheck "staging-geprueft"
        |                                  |
        |                     grün?  nein -> Fehler beheben, neuer Push auf staging
        |                                  | ja
        v                                  v
   Mirko klickt "Live schalten"  -->  live-schalten.yml
                                       prüft: ist staging-geprueft grün für genau diesen Stand?
                                         nein -> Abbruch mit klarer Meldung, nichts wird verändert
                                         ja   -> Pull Request staging -> main, sofort zusammengeführt
                                                 danach starten die Live-Workflows (Worker, Site-Worker, Seitenbau)
```

Die drei Live-Workflows (`worker.yml`, `sitewrk.yml`, `site.yml`) sind **unverändert**: ein Push auf `main` veröffentlicht wie bisher sofort. Neu ist nur der Weg dorthin.

### Was `staging-checks` prüft

Der Workflow [`staging-checks.yml`](.github/workflows/staging-checks.yml) läuft bei jedem Push auf `staging`, bei Pull Requests gegen `main` oder `staging` und von Hand. Er veröffentlicht nichts.

| Prüfung | Was genau |
|---|---|
| Worker-Tests | `cd worker && npm ci && node --test`, Syntaxprüfung aller Quelldateien, Tests des Site-Workers (`sitewrk/`) und der Seiten-Skripte (`tests/*.test.mjs`) |
| Python-Tests | `python3 -m unittest discover -s tests` und `tools/test_sync_platforms.py` |
| MCP-Abdeckung | `tools/check_mcp_coverage.mjs`: jede API-Route hat ein MCP-Tool oder eine Begründung |
| Migrationen | `tools/check_migrations.py`: keine Nummernkollision (zwei Pull Requests mit `0047`), neue Nummern liegen über der höchsten auf `main`, schon veröffentlichte Migrationen bleiben unverändert, alle laufen der Reihe nach auf einer leeren SQLite-Datenbank durch |
| Seitenbau-Probelauf | `generate_site.py` baut die Seite wirklich (nur Deutsch und Englisch, von Hand mit „voll“ alle Sprachen), danach `check_schema.py`, `check_titles.py`, `check_encoding.py`. Es wird nichts hochgeladen. |
| Trennung von Live | `tools/check_staging_isolation.py`: die Staging-Konfiguration nennt keine Live-Ressource (siehe „Testumgebung bei Cloudflare“) |
| Rauchtest Testumgebung | `tools/staging_smoke.mjs` gegen staging.m365.fm / api-staging.m365.fm, nur nach einem Push auf `staging` (bei Pull Requests übersprungen) |

Das Gesamtergebnis ist der Statuscheck **`staging-geprueft`** (letzter Job des Workflows). Der Name ist fest. Nicht umbenennen: `live-schalten.yml` und die Schutzregel verlassen sich darauf.

### Live schalten (nur nach Mirkos Klick)

1. Alle Änderungen sind auf `staging` und `staging-geprueft` ist grün: <https://github.com/Mirko-Peters/m365-FM/actions/workflows/staging-checks.yml>
2. Knopf: <https://github.com/Mirko-Peters/m365-FM/actions/workflows/live-schalten.yml> → **Run workflow** (Zweig `main` lassen). Mit „Nur prüfen“ kann man vorher testen, ob es gehen würde, ohne etwas zu übernehmen.
3. Der Workflow bricht ab (rot, deutsche Meldung, **nichts verändert**), wenn
   - der Zweig `staging` fehlt,
   - für den aktuellen Stand von `staging` kein Lauf von `staging-checks` existiert, er noch läuft oder rot ist,
   - der Statuscheck `staging-geprueft` fehlt oder nicht grün ist,
   - `staging` und `main` einen Konflikt haben (dann `main` in `staging` übernehmen und Konflikte lösen),
   - in der Zwischenzeit ein neuer Commit auf `staging` kam.
4. Sonst legt er einen Pull Request `staging` → `main` an (oder nimmt den offenen), führt ihn mit genau dem geprüften Stand zusammen (Merge-Commit, kein Force-Push) und startet danach selbst die Live-Workflows, die ein Push dieser Dateien auf `main` gestartet hätte.

**Warum die Live-Workflows extra angestoßen werden:** GitHub startet bei Änderungen, die mit dem eingebauten Token (`GITHUB_TOKEN`) gemacht werden, absichtlich keine Push-Workflows (Schutz vor Endlosschleifen). Ohne den Anstoß wäre `main` zwar aktuell, aber nichts würde veröffentlicht. `tools/live_schalten.py plan` liest dafür die Pfadlisten (`paths:`) aus `worker.yml`, `sitewrk.yml` und `site.yml`. `site.yml` startet mit `mode=fresh` (wie ein Push-Bau, ohne Spotify-/Plattform-Abgleich) und wird übersprungen, wenn die Repo-Variable `SITE_PUSH_BUILD` auf `0` steht.

**Hinweis zu `main`:** Bots schreiben laufend Daten auf `main` (Spreaker-Prüfung, Übersetzungen, Seitenbau-Daten, rund 30 Workflows). `staging` ist deshalb meistens ein paar Bot-Commits „hinter“ `main`. Das ist normal und kein Fehler: der Pull Request führt beides zusammen. Nur bei einem echten Konflikt in derselben Datei muss man von Hand `main` in `staging` holen.

## Was NUR Mirko in den GitHub-Einstellungen tun muss

Reihenfolge einhalten. Zugangsdaten und Secrets legt Mirko selbst an. Hier stehen nur die **Namen**, nie Werte.

### 1. Diesen Pull Request mergen lassen

Der Dev-Chef prüft und mergt „Staging Schritt 1“. Erst danach existieren `staging-checks.yml` und `live-schalten.yml` auf `main`.

### 2. Zweig `staging` anlegen (aus dem aktuellen `main`)

Der Zweig muss **nach** dem Merge aus Schritt 1 entstehen, damit die neuen Workflows auch dort liegen.

- Im Browser: <https://github.com/Mirko-Peters/m365-FM/branches> → **New branch** → Name `staging`, Quelle `main`.
- Oder der Dev-Chef legt ihn an: `gh api repos/Mirko-Peters/m365-FM/git/refs -f ref=refs/heads/staging -f sha=$(gh api repos/Mirko-Peters/m365-FM/git/ref/heads/main --jq .object.sha)`

Danach einmal `staging-checks` von Hand auf `staging` starten (<https://github.com/Mirko-Peters/m365-FM/actions/workflows/staging-checks.yml> → Run workflow, Zweig `staging`). Erst nach einem ersten Lauf kennt GitHub den Statuscheck `staging-geprueft` (man braucht ihn für Schritt 4).

### 3. Einstellungen für Actions

<https://github.com/Mirko-Peters/m365-FM/settings/actions>

- **Workflow permissions**: *Read and write permissions*.
- Haken bei **Allow GitHub Actions to create and approve pull requests**. Ohne das kann `live-schalten.yml` keinen Pull Request anlegen und meldet es mit genau diesem Hinweis.

### 4. Umgebungen `staging` und `production`

<https://github.com/Mirko-Peters/m365-FM/settings/environments> → **New environment**

- `production`: wird von `live-schalten.yml` benutzt. Empfohlen: **Required reviewers** = Mirko (dann braucht das Live-Schalten nach dem Klick noch eine Freigabe in GitHub). Die Live-Secrets (`CLOUDFLARE_API_TOKEN` usw.) bleiben unverändert dort, wo sie sind (Repository-Secrets). Nichts umziehen.
- `staging`: für die Testumgebung (Schritt 2). Die Secrets dieser Umgebung stehen weiter unten bei „Testumgebung bei Cloudflare“, Schritt 8. Hier genügt: Umgebung anlegen, **keine** Required reviewers (die Deploys laufen nach jedem Push auf `staging` von allein).

### 5. Schutzregel für `main` — **noch nicht einschalten, erst Punkt „Achtung“ lesen**

<https://github.com/Mirko-Peters/m365-FM/settings/branches> (klassisch) oder <https://github.com/Mirko-Peters/m365-FM/settings/rules> (Rulesets)

Gewünschte Regel für `main`:

- **Require a pull request before merging** (0 Freigaben nötig).
- **Require status checks to pass**: `staging-geprueft` auswählen (erscheint erst nach dem ersten Lauf, siehe Schritt 2).
- **Require branches to be up to date before merging**: **aus lassen** (Bots ändern `main` ständig, sonst ginge ein Merge fast nie).
- Force-Push und Löschen verbieten.

**Achtung — das bricht heute die Bots.** Rund 30 Workflows (z. B. `site.yml`, `worker.yml`, `spreaker-feed-check.yml`, `translate-*.yml`) pushen ihre Daten direkt auf `main`, mit dem eingebauten `GITHUB_TOKEN`. Dieses Token kann eine Schutzregel „nur über Pull Request“ nicht umgehen (nach Stand der GitHub-Diskussion <https://github.com/orgs/community/discussions/25305>; Ausnahmelisten kennen nur Rollen, Deploy Keys und GitHub Apps). Mit der Regel würden alle diese Pushes abgelehnt, die Automatik stünde still.

Zwei sichere Wege (einer davon vor dem Einschalten, das ist eine eigene Aufgabe für den Dev-Chef):

- **A (empfohlen):** Die Bots bekommen eine eigene GitHub App oder einen Deploy Key mit Schreibrecht, der in der Ausnahmeliste („Bypass list“) der Regel steht; die Workflows holen sich damit ihr Token. Erst danach die Regel einschalten.
- **B (bis dahin):** Keine Schutzregel, sondern Absprache: Änderungen gehen nur in `staging`; nach `main` kommt nur noch `live-schalten.yml`. Die Prüfung `staging-geprueft` hängt trotzdem an jedem Pull Request gegen `main`. Das ist weniger fest als eine Regel, stört aber keinen Bot.

Nach dem Einschalten sofort testen (zum Beispiel <https://github.com/Mirko-Peters/m365-FM/actions/workflows/spreaker-feed-check.yml> → Run workflow) und bei roten Pushes die Regel wieder ausschalten.

### 6. Probelauf

<https://github.com/Mirko-Peters/m365-FM/actions/workflows/live-schalten.yml> → Run workflow → Haken bei **Nur prüfen**. Erwartung: „staging enthält nichts, was main nicht schon hat“ oder „Prüfungen sind grün“. Es wird nichts verändert.

## Testumgebung bei Cloudflare (Schritt 2)

Nach einem Push auf `staging` entstehen automatisch zwei Dinge, getrennt von Live:

| | Live | Testumgebung (Staging) |
|---|---|---|
| Community-API | `api-dub.m365.fm`, Worker `m365-dub-community`, Datenbank `m365-dub` | `api-staging.m365.fm`, Worker `m365-dub-community-staging`, eigene Datenbank `m365-dub-staging` |
| Seite | `www.m365.fm`, Worker `m365-dub-site`, Bucket `m365-fm` | `staging.m365.fm`, Worker `m365-dub-site-staging`, eigener Bucket `m365-fm-staging` |
| Workflows | `worker.yml`, `sitewrk.yml`, `site.yml` (Push auf `main`) | `worker-staging.yml`, `site-staging.yml` (Push auf `staging`, Umgebung `staging`) |
| Zeitpläne (Crons) | ja | **keine** |
| Mail, KI, LinkedIn, Spreaker, YouTube, Push, Google/Maps | ja | **gesperrt** (kein Schlüssel, im Code gesperrt, Netzwerkaufrufe dorthin werden abgewiesen) |
| PayPal / Werbebuchung | live / an | Sandbox / aus |
| Suchmaschinen | ja | `noindex, nofollow` überall, `robots.txt` verbietet alles |

Die Testdatenbank ist am Anfang **leer** (die Crons sind aus, es kommen keine Live-Daten hinein). Getestet werden also Code und Datenbankschema, nicht die Live-Daten. Die Testseite wird verkleinert gebaut (Deutsch und Englisch) und liest dafür nur die **öffentlichen** Exporte der Live-API (nur lesen), schreibt aber überall die Staging-Adressen hinein (`tools/staging_rewrite.py`).

**Schutz gegen Verwechslung:** `tools/check_staging_isolation.py` läuft in `staging-checks` und vor jedem Staging-Deploy. Es wird rot, wenn `[env.staging]` in den `wrangler.toml` oder ein Staging-Workflow eine Live-Datenbank, einen Live-Bucket, einen Live-Worker, eine Live-Domain, einen Cron, eine KI-/Mail-/Vectorize-Anbindung oder ein Live-Secret nennt. Der Staging-Upload (`tools/staging_upload.py`) schreibt nur in den Bucket `m365-fm-staging` und liest nur die Staging-Zugangsdaten. Bilder kommen weiter aus `img.m365.fm` (nur lesen).

**Rauchtest:** Nach dem Deploy ruft `tools/staging_smoke.mjs` (Job `staging-smoke` in `staging-checks`) die wichtigsten Seiten und API-Routen der Testumgebung ab (Health, `noindex`, Events-Export, `robots.txt`, Startseite, `/de/`, je eine Folgen-, Entitäts- und Eventseite aus dem Sitemap). Er fließt in `staging-geprueft` ein: ohne laufende, gesunde Testumgebung wird `live-schalten.yml` nicht grün. Bei Pull Requests wird der Rauchtest übersprungen.

### Was NUR Mirko bei Cloudflare und GitHub tun muss (Schritt 2)

Reihenfolge einhalten. Alles in dieser Liste kann nur Mirko, weil es Zugangsdaten oder Konten betrifft. Hier stehen nur Namen, nie Werte.

#### 7. Beide Pull Requests mergen lassen und Zweig `staging` anlegen

„Staging Schritt 1“ zuerst, dann „Staging Schritt 2“ (Schritt 2 enthält Schritt 1; ist Schritt 1 schon gemergt, zeigt der Pull Request nur das Neue). Danach den Zweig `staging` aus `main` anlegen (Schritt 2 oben). Wichtig: **erst anlegen, wenn die Punkte 8 bis 10 erledigt sind**, sonst laufen die Staging-Workflows beim ersten Push ohne Zugangsdaten rot. Das ist harmlos, aber unnötig.

#### 8. Secrets der GitHub-Umgebung `staging`

<https://github.com/Mirko-Peters/m365-FM/settings/environments> → `staging` → **Add environment secret**. Namen genau so:

| Name | Wofür | Woher |
|---|---|---|
| `STAGING_R2_ACCESS_KEY_ID` | Staging-Seite in den Bucket `m365-fm-staging` laden | Schritt 9 |
| `STAGING_R2_SECRET_ACCESS_KEY` | dito | Schritt 9 |
| `STAGING_ACCESS_ID` | Rauchtest kommt durch Cloudflare Access | Schritt 10 (Service-Token, „Client ID“) |
| `STAGING_ACCESS_SECRET` | dito | Schritt 10 (Service-Token, „Client Secret“) |
| `STAGING_GOOGLE_CLIENT_ID`, `STAGING_GOOGLE_CLIENT_SECRET`, `STAGING_MS_CLIENT_ID`, `STAGING_MS_CLIENT_SECRET`, `STAGING_GH_OAUTH_CLIENT_ID`, `STAGING_GH_OAUTH_CLIENT_SECRET` | **optional**: Anmeldung in der Testumgebung. Nur eigene Staging-Anmelde-Apps eintragen (Weiterleitungsadresse `https://api-staging.m365.fm/…`), nie die Live-Schlüssel. Ohne sie läuft Staging ohne Anmeldung. | eigene Apps bei Google, Microsoft, GitHub |

Diese Repository-Secrets müssen schon da sein (sie werden von der Umgebung `staging` mitgenutzt, es wird nichts umgezogen): `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `R2_ACCOUNT_ID`. Der Cloudflare-Token braucht wie für Live: Workers Scripts bearbeiten, D1 bearbeiten, und für die Domains `staging.m365.fm` und `api-staging.m365.fm` die Rechte der Zone `m365.fm` (DNS bearbeiten, Workers-Routen bearbeiten). Zusätzlich **Workers R2 Storage: Edit**, falls der Workflow den Bucket anlegen soll (sonst Schritt 9 von Hand).

SESSION_SECRET und CRON_KEY der Testumgebung erzeugt `worker/setup-staging.mjs` beim ersten Lauf selbst. Dafür ist nichts zu tun.

#### 9. Bucket `m365-fm-staging` und sein Zugangsschlüssel

1. Bucket anlegen (falls der Workflow es nicht konnte): <https://dash.cloudflare.com/?to=/:account/r2/new> → Name genau `m365-fm-staging`. **Nicht** `m365-fm` (das ist Live). Der Bucket bleibt privat; es wird keine öffentliche Adresse und kein `img.`-Hostname dafür angelegt, nur der Staging-Site-Worker liest ihn.
2. Schlüssel: <https://dash.cloudflare.com/?to=/:account/r2/api-tokens> → **Create API token** → Berechtigung **Object Read & Write** → **nur** für den Bucket `m365-fm-staging` auswählen. Die angezeigte „Access Key ID“ und „Secret Access Key“ als `STAGING_R2_ACCESS_KEY_ID` und `STAGING_R2_SECRET_ACCESS_KEY` in die Umgebung `staging` eintragen (Schritt 8). Mit diesem Schlüssel kann nichts in Live geschrieben werden.

#### 10. Cloudflare Access: Testumgebung nur für Mirko (und den Rauchtest)

<https://one.dash.cloudflare.com/> → **Zero Trust** → **Access** → **Applications** → **Add an application** → **Self-hosted**.

1. Anwendung `m365-staging` mit **beiden** Adressen: `staging.m365.fm` und `api-staging.m365.fm` (kein Pfad, ganze Domains).
2. Richtlinie 1 „Mirko“: Aktion **Allow**, Regel **Emails** = Mirkos E-Mail-Adresse (und wer sonst testen darf).
3. Service-Token: **Access** → **Service Auth** → **Create Service Token**, Name `m365-staging-smoke`, Dauer nach Wunsch. „Client ID“ und „Client Secret“ werden **nur einmal** angezeigt: sofort als `STAGING_ACCESS_ID` und `STAGING_ACCESS_SECRET` in die Umgebung `staging` eintragen (Schritt 8).
4. Richtlinie 2 „Rauchtest“: Aktion **Service Auth**, Regel **Service Token** = `m365-staging-smoke`.
5. Wenn die Testseite die Test-API nicht erreicht (Browser meldet Anmeldung/CORS): einmal <https://api-staging.m365.fm/api/health> im Browser öffnen und anmelden, damit auch dafür ein Anmelde-Cookie da ist.

Access sollte **vor** dem ersten Deploy stehen, damit die Testumgebung nie offen im Netz ist (Suchmaschinen sind ohnehin per `noindex` ausgesperrt). Die Seiten sind auch ohne Access harmlos: leere Datenbank, keine Mail, keine KI.

#### 11. Erster Lauf

1. Zweig `staging` anlegen (Schritt 7), falls noch nicht geschehen. Der Anlege-Push startet `worker-staging.yml` und `site-staging.yml` selbst. Oder von Hand: <https://github.com/Mirko-Peters/m365-FM/actions/workflows/worker-staging.yml> und <https://github.com/Mirko-Peters/m365-FM/actions/workflows/site-staging.yml> → Run workflow → Zweig `staging`.
2. `worker-staging.yml` legt die Datenbank `m365-dub-staging` an, spielt alle Migrationen ein, trägt die Datenbank-ID **nur** in den Staging-Block ein und veröffentlicht den Worker. `site-staging.yml` baut die verkleinerte Seite (dauert länger, bis 90 Minuten), lädt sie in den Bucket und veröffentlicht den Site-Worker.
3. Prüfen: <https://api-staging.m365.fm/api/health> und <https://staging.m365.fm/> (nach der Anmeldung über Access). Zertifikate für neue Domains brauchen manchmal ein paar Minuten.
4. `staging-checks` (<https://github.com/Mirko-Peters/m365-FM/actions/workflows/staging-checks.yml>) wartet auf beide Deploys und macht danach den Rauchtest. Grün = `staging-geprueft` ist grün.

**Was Staging nicht abdeckt:** echte Live-Daten (Datenbank leer), alles, was Mail, KI, LinkedIn, Spreaker, YouTube, Push, Karten oder echtes PayPal braucht, und die Sprachen außer Deutsch und Englisch. Das bleibt Sache der Live-Beobachtung nach dem Schalten.

## Regeln für alle, die Änderungen machen

- Pull Requests gehen gegen `staging`, nicht gegen `main`.
- Neue Migrationen: Nummer über der höchsten auf `main`, nie eine veröffentlichte Migration ändern (`tools/check_migrations.py` prüft es).
- Neue API-Routen: in `worker/mcp_coverage.json` eintragen. Neue Tabellen: in `mergeStatements` und `deleteAccount`. Rechte nur über `can()`/`gate()`.
- Vor jedem Pull Request lokal: `cd worker && node --test`, `python3 -m unittest discover -s tests`, `node tools/check_mcp_coverage.mjs`, `python3 tools/check_migrations.py`.
- Notfall (Live ist kaputt): Fehler auf `staging` beheben, Prüfungen abwarten, „Live schalten“. Ein Eingriff direkt auf `main` nur, wenn Mirko ihn ausdrücklich verlangt.

## Dateien

| Datei | Zweck |
|---|---|
| `.github/workflows/staging-checks.yml` | alle Prüfungen, Statuscheck `staging-geprueft` |
| `.github/workflows/live-schalten.yml` | Knopf: `staging` nach `main`, nur bei grünen Prüfungen |
| `tools/check_migrations.py`, `tests/test_check_migrations.py` | Migrationsprüfung |
| `tools/live_schalten.py`, `tests/test_live_schalten.py` | Entscheidung „darf live?“ und Auswahl der anzustoßenden Live-Workflows |
| `.github/workflows/worker-staging.yml`, `worker/setup-staging.mjs` | Staging-Datenbank anlegen, Migrationen, Staging-Worker veröffentlichen |
| `.github/workflows/site-staging.yml`, `tools/staging_rewrite.py`, `tools/staging_upload.py` | verkleinerte Seite bauen, Adressen umschreiben, in `m365-fm-staging` laden, Staging-Site-Worker veröffentlichen |
| `worker/wrangler.toml`, `sitewrk/wrangler.toml` (Block `[env.staging]`) | Namen, Domains, Datenbank, Bucket und Variablen der Testumgebung |
| `worker/src/staging.js` | Schalter `ENVIRONMENT=staging`: sperrt Mail, KI, LinkedIn, Spreaker und andere Außenaufrufe, `noindex`, keine Crons |
| `sitewrk/index.js` (Zweig `isStaging`) | Staging-Site-Worker: liest nur aus `m365-fm-staging`, `noindex`, keine Weiterleitung auf Live |
| `tools/check_staging_isolation.py`, `tools/staging_smoke.mjs` | Trennungsprüfung und Rauchtest |
