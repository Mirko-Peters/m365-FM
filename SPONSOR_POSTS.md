# Sponsor-Reihe Cognillo: 62 Beiträge

Cognillo sponsert M365.FM. Dafür entstehen 62 englische Blogbeiträge (einer pro Tag vom 15.11.2026 bis 15.01.2027) und zu jedem Beitrag drei LinkedIn-Texte.
Sonnet schreibt, Mirko sieht alles an und gibt frei. **Nichts geht live, bevor Mirko es freigibt.**

(Diese Datei liegt im Hauptordner und nicht in `docs/`, weil `docs/` das Bau-Ergebnis der Webseite ist und nicht im Repo liegt.)

## Der Ablauf in vier Schritten

1. **Schreiben** (von Hand, einmal): Actions → „Sponsor-Reihe Cognillo“ → Run workflow → Modus `schreiben`. Sonnet schreibt alle 62 Beiträge nacheinander.
2. **Ansehen**: Mirko liest die Dateien in `imports/blog/en/` und die LinkedIn-Texte in `data/sponsor_posts_linkedin_cognillo.json`. Er kann Dateien von Hand ändern.
3. **Freigeben** (von Hand): Modus `freigeben`, Eingabe `nummern`, z. B. `1-62` oder `1-10,15`.
4. **Täglich live** (automatisch, 04:20 UTC): Der Lauf schaltet jeden Tag **einen** freigegebenen Beitrag frei. Danach holt der Seitenbau ihn auf die Seite.

Link zur Seite der Workflows: <https://github.com/Mirko-Peters/m365-FM/actions/workflows/sponsor-posts.yml>

## Die drei Modi

| Modus | Wer startet | Was passiert | API-Aufruf |
|---|---|---|---|
| `schreiben` | von Hand | Schreibt die Beiträge von `von` bis `bis` (leer = alle, die noch fehlen). Datei mit `status: review` und `publish: false`, Plan-Status `entwurf`, LinkedIn-Texte. | ja (Sonnet) |
| `freigeben` | von Hand | Setzt im Plan `freigegeben: true` für die Nummern. Nur für Beiträge mit Status `entwurf`, die eine Datei haben. | nein |
| `taeglich` | Cron, auch von Hand möglich | Nimmt den frühesten Beitrag mit `freigegeben: true`, Status `entwurf` und `date` bis heute. Setzt die Datei auf `status: approved` und `publish: true`, Plan-Status `live`. | nein |

**Dry-Run:** Bei jedem Handstart ist `dry_run` zuerst auf `true`. Dann wird nichts geändert und nichts bezahlt. Bei `schreiben` zeigt der Lauf den Prompt, die Nummern und die Kostenschätzung.
Erst mit `dry_run = false` wird wirklich geschrieben. Der tägliche Cron-Lauf ist nie ein Dry-Run, er ruft aber auch nie die KI auf.

### Wie der Lauf `schreiben` arbeitet

- Er schreibt höchstens 10 Beiträge pro Runde und speichert danach (Commit auf `main`, bei Streit mit anderen Bots mit Wiederholung). Der Workflow macht bis zu 8 Runden.
- Bricht ein Lauf ab, startet man ihn einfach neu. **Vorhandene Dateien werden übersprungen, nie überschrieben.** Hat die Datei den Status `review`, aber der Plan steht noch auf `geplant`, zieht der Lauf den Plan nach (ohne Kosten).
- Besteht ein Beitrag die Prüfung nicht (auch nicht im zweiten Versuch), gibt es für ihn keine Datei und keine Statusänderung. Die anderen Beiträge werden trotzdem geschrieben, der Lauf endet am Schluss rot. Der Fehler steht im Log.
- Mit `von` und `bis` kann man einzelne Nummern schreiben, z. B. `von = 12`, `bis = 12`.

### Wie der tägliche Lauf arbeitet

- Pro Lauf höchstens **ein** Beitrag. Hat ein Tag gefehlt, holt der nächste Lauf den früheren Beitrag nach, am nächsten Tag den nächsten. So wird jeden Tag aufgeholt, ohne dass mehrere auf einmal erscheinen.
- Nicht freigegebene Beiträge bleiben unberührt.
- Vor dem Freischalten prüft der Lauf die Datei noch einmal mit `site_content_blog.check`. Hat Mirko die Datei so geändert, dass sie nicht mehr passt (z. B. Kurzfassung zu kurz), geht der Beitrag **nicht** live und der Lauf meldet den Fehler.
- Die Commit-Nachricht lautet „Cognillo-Beitrag 12: Titel“.
- Auf die Webseite kommt der Beitrag mit dem nächsten nächtlichen Seitenbau (`site.yml`, 01:07 UTC). Bot-Commits lösen keinen Bau aus. Es kann also bis zu etwa einem Tag dauern.

## Wie ein Beitrag entsteht (Qualität)

Pro Beitrag gibt es zwei Sonnet-Durchgänge:

1. **Entwurf:** Artikel (Ziel 1.200 bis 1.600 Wörter), Kurzfassung, 2–3 FAQ-Fragen und die drei LinkedIn-Texte (`profile`, `page`, `group`) in einem Aufruf. Der Prompt enthält die Regeln und die Fakten der Entitäten (Beschreibung und Langtext aus `data/entities.json`). Über Cognillo und seine Produkte darf nur stehen, was in den Entitätsdaten steht.
2. **Prüfdurchgang:** Ein zweiter Aufruf liest alles gegen die Regeln und liefert nur die beanstandeten Stellen (unbelegte Aussagen, erfundene Zahlen oder Quellen, Aussagen über Cognillo jenseits der Fakten, Wettbewerber nicht sachlich, Heilsversprechen, riskante Admin-Aktionen ohne Test-/Backup-Hinweis, fremde Links). Das Skript tauscht nur diese Stellen aus. Der Rest des Textes bleibt, wie er war.

Danach prüft das Skript selbst:

- **Links:** erlaubt sind nur `learn.microsoft.com`, `techcommunity.microsoft.com`, `www.cognillo.com` und `www.m365.fm` (dort nur `/entity/<id>/` bekannter Entitäten). Jeder andere Link wird entfernt, der Text bleibt. Die übrigen Links werden per HTTP geprüft: Fehler = Link entfernt, im Log steht eine Warnung. Bilder und HTML werden entfernt.
- **Regeln:** Haupt-Entität und mindestens zwei weitere Entitäten sind verlinkt; bei Cognillo-Themen `cognillo` oder `sharepoint-essentials-toolkit`; keine Prozent- oder Geldangaben, die nicht in den Entitätsdaten stehen; keine Heilsversprechen, keine „Studien zeigen“, keine erfundene Erfahrung; 2–3 FAQ-Fragen; mindestens drei `##`-Überschriften.
- **LinkedIn-Texte:** höchstens 1.300 Zeichen, `{URL}` genau einmal als Platzhalter (kein echter Link), 2–3 Hashtags, am Ende eine offene Frage.
- **Front Matter:** die fertige Datei läuft durch `site_content_blog.check`, so wie der Seitenbau sie liest.

Fällt etwas durch, gibt es **genau einen** Wiederholungsversuch mit der Fehlermeldung im Prompt. Danach bricht der Beitrag ohne Datei ab.

**Gesponserte Beiträge** (`sponsored: true`) beginnen mit einem Hinweisabsatz („Sponsored: Cognillo sponsors M365.FM …“). Den setzt das Skript, nicht die KI.
Ihre LinkedIn-Texte für `profile` und `page` beginnen mit „Sponsored by Cognillo · #Anzeige“, der Text für `group` bleibt **leer**. Gesponserte Beiträge gehen nie in Gruppen.

## Wo stehen die Dateien?

| Was | Wo |
|---|---|
| Plan (Nummer, Titel, Status, Datum, Freigabe) | `data/sponsor_posts_cognillo.json` |
| Beiträge | `imports/blog/en/<slug>.md` |
| LinkedIn-Texte (Nummer → `profile`, `page`, `group`) | `data/sponsor_posts_linkedin_cognillo.json` |
| Kosten | `data/spend.json`, Schlüssel `sponsor-cognillo` |
| Skript / Workflow | `tools/sponsor_post.py`, `.github/workflows/sponsor-posts.yml` |

Status im Plan: `geplant` → `entwurf` (geschrieben, wartet) → `live` (vom täglichen Lauf freigeschaltet). Dazu das Feld `freigegeben` (`true`, wenn Mirko freigegeben hat).

## Kosten und Budget

- Das Kostenbuch steht in `data/spend.json` unter `sponsor-cognillo` (Summe in `usd`, dazu Token und Anzahl der Aufrufe). Jeder bezahlte Aufruf wird sofort gebucht, auch wenn der Lauf danach scheitert.
- Preise wie beim Artikel-Generator: Sonnet 2 USD (Eingabe) und 10 USD (Ausgabe) je Million Token, Cache-Schreiben 2,50 USD, Cache-Lesen 0,20 USD.
- **Schätzung:** etwa **0,06 USD je Beitrag** samt LinkedIn-Texten (Entwurf rund 0,04 USD plus Prüfdurchgang rund 0,02 USD), also rund **3,70 USD für alle 62**. Mit voll ausgeschöpften Antworten und einem Wiederholungsversuch höchstens rund 0,37 USD je Beitrag, rund 23 USD für alle 62. Die Schätzung steht auch in der Dry-Run-Ausgabe. Gemessene Werte stehen nach dem ersten echten Lauf im Kostenbuch.
- **Budget:** `SPONSOR_POSTS_BUDGET_USD`, Standard **50 USD** für die ganze Reihe. Ändern ohne Code: GitHub → Settings → Secrets and variables → Actions → Variables → `SPONSOR_POSTS_BUDGET_USD`. Ist die Summe in `sponsor-cognillo` gleich oder größer als das Budget, macht der Lauf **keinen** API-Aufruf mehr und meldet das deutlich. Es ist eine Sicherung gegen Endlosschleifen.
- Die Reihe hängt **nicht** an der Monatsgrenze des Artikel-Generators (`ARTICLE_BUDGET_USD`). Die Tageslimits für Haiku bleiben unberührt (diese Reihe nutzt nur Sonnet).
- Schlüssel (Secret) ist `ANTHROPIC_API_KEY_SHOW`, Modell `claude-sonnet-5-5` (Variable `SPONSOR_POSTS_MODEL`, wenn man es ändern will).

## Beitrag überspringen oder neu schreiben lassen

- **Überspringen:** im Plan den Status auf etwas anderes als `geplant` setzen (z. B. `uebersprungen`). `schreiben` und `taeglich` fassen ihn dann nicht an.
- **Einen Entwurf neu schreiben lassen:** die Datei in `imports/blog/en/` und den Eintrag in `data/sponsor_posts_linkedin_cognillo.json` löschen, im Plan Status auf `geplant` und `freigegeben` auf `false` setzen, dann `schreiben` mit `von` = `bis` = Nummer starten. Das kostet wieder rund 0,06 USD.
- **Freigabe zurücknehmen:** im Plan `freigegeben` auf `false` setzen, solange der Status `entwurf` ist.
- **Schon live und neu schreiben:** zuerst im Plan Status `geplant`, `freigegeben` `false` und die Datei löschen (wie oben). Der Worker erneuert einen Beitrag nur, solange ihn niemand im Editor oder in der Verwaltung geändert hat (siehe `imports/blog/README.md`).
- **Von Hand ändern:** Datei in `imports/blog/en/` bearbeiten. Kopf (`---`) nicht kaputt machen; vor dem Freischalten prüft der tägliche Lauf die Datei noch einmal.

## Übersetzung in 14 Sprachen

Das bestehende Übersetzer-Team (`translate-blog.yml`) greift **freigegebene englische Pakete** (`status: approved`) ohne weiteres Zutun auf: Es läuft alle 3 Stunden im Modus `auto` und übersetzt neue Pakete aus `imports/blog/en/` der letzten 14 Tage (nach dem Feld `date`). Entwürfe (`status: review`) übersetzt es nicht. Erst wenn der tägliche Lauf den Beitrag auf `approved` setzt, kommt er in die Warteschlange. Die Kosten dafür trägt das Budget `BLOG_BUDGET_USD` des Übersetzer-Teams, nicht diese Reihe.
Ein Beitrag, dessen Plan-Datum mehr als 14 Tage zurückliegt, wird vom Zeitplan nicht mehr automatisch aufgegriffen. Dann hilft ein Handstart von `translate-blog.yml` mit `slugs`.

## rel="sponsored"

Links auf die Website eines **laufenden** Sponsors (z. B. `www.cognillo.com`) bekommen in jedem Blogbeitrag und in allen Sprachfassungen `rel="sponsored noopener"`. Voraussetzung: In `data/sponsorships.json` steht ein laufendes Sponsoring mit `sponsor.url` = `https://www.cognillo.com/`. Der Beitrag muss dort nicht einzeln unter `posts` stehen. Wer die Kennzeichnung unter der Überschrift („Sponsored · Paid partnership with Cognillo“) für einzelne Beiträge will, trägt sie unter `posts` ein.
Nach dem Ende des Sponsorings verlieren Beiträge, die nicht unter `posts` stehen, die Link-Kennzeichnung beim nächsten Seitenbau.

## Hinweis zum Staging-Umbau

Der Speichern-Schritt im Workflow pusht heute direkt auf `main` (wie `articles.yml`). Wenn der Staging-Umbau (`claude/staging-schritt1/2`) fertig ist, muss er auf den Zweig `staging` umgestellt werden (Kommentar im Workflow).
