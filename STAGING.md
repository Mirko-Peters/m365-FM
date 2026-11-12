# Staging: erst testen, dann live

Ziel: Niemand ändert mehr direkt an der Live-Seite herum. Jede Änderung kommt zuerst auf den Zweig `staging`, wird dort automatisch geprüft, und geht erst nach einem Klick von Mirko auf `main` (= live).

Stand: **Schritt 1** (Prüfungen als Pflicht vor Live). Die eigene Testumgebung bei Cloudflare (staging.m365.fm, eigene Datenbank) kommt in Schritt 2 und wird hier ergänzt.

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
- `staging`: noch ohne Inhalt. Wird in Schritt 2 (Testumgebung bei Cloudflare) gebraucht, dort stehen auch die Secret-Namen.

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
