# Website (GitHub Pages) – Einrichtung & Betrieb

Die Seite wird **automatisch** aus `episodes/*.json` + `data/published.json` gebaut (`generate_site.py`) und per GitHub Actions veröffentlicht
(nächtlich 01:07 UTC voll, bei Pushes nur für Code/Vorlagen, bei neu veröffentlichten Folgen per Frische-Bau aus
`spreaker-feed-check.yml`, Kopf von `.github/workflows/site.yml`). Daten-Commits warten auf den nächtlichen Bau; sofort: **Run workflow**. Nichts von Hand pflegen.

## Einmalig einschalten
1. GitHub → Repo → Settings → Pages → **Source: GitHub Actions**.
2. Actions → „Website bauen und veröffentlichen“ → **Run workflow**.
→ https://mirko-peters.github.io/m365-dub-downloader/

## Eigene Domain (z. B. international.m365.fm)
1. DNS bei m365.fm: **CNAME** `international` → `mirko-peters.github.io`
2. Repo: Datei `domain.txt` mit dem Inhalt `international.m365.fm` anlegen (eine Zeile) und committen.
3. Settings → Pages → Custom domain `international.m365.fm` eintragen, „Enforce HTTPS“ aktivieren.
Alle URLs, Sitemap, hreflang und Canonicals schalten automatisch auf die Domain um.

## Apple Podcasts / Spotify je Folge
Die Sprach-Shows müssen dort existieren (Spreaker → Show → Distribution, oder Apple Podcasts Connect / Spotify for Creators mit dem RSS-Feed
`https://www.spreaker.com/show/<ShowID>/episodes/feed`). Danach in `data/platforms.json` je Sprache `apple_id` (Zahl aus der Apple-URL `…/id123456`)
und `spotify_id` (Teil nach `/show/`) eintragen. Der tägliche Lauf ordnet die Folgen per Titel zu (`sync_platforms.py`).
Spotify-Folgenlinks brauchen zusätzlich die Repo-Secrets `SPOTIFY_CLIENT_ID` und `SPOTIFY_CLIENT_SECRET` (kostenlose App auf developer.spotify.com).
Auf der Seite zeigt ein kleines Skript Apple-Nutzern (iPhone, iPad, Mac) zuerst Apple Podcasts, allen anderen zuerst Spotify.

## Search Console
search.google.com/search-console → Property hinzufügen → Sitemap `…/sitemap.xml` einreichen. Bing/Yandex bekommen neue URLs automatisch per IndexNow.

## Anhören-Karten ("Störer") und "Show folgen"
Ziel: mehr Podcast-Follower. In Blogbeiträgen (alle Arten und Sprachen, Wochenzusammenfassungen ausgenommen) erscheinen bis zu zwei Karten "Das solltest du dir anhören" (EN "You should listen to this") zu einer PASSENDEN Folge und am Ende ein kleiner Knopf "Show folgen". Auf Entitätsseiten steht unter jedem aufgelisteten Beitrag mit guter Folge eine kompakte Karte (dieselbe Folge nur beim ersten Beitrag), auf allen Folgenseiten ein Knopf "Show folgen" unter dem Player. Code: `site_listen.py`, Skript `assets/listen.js`, Zwischenspeicher `data/listen_matches.json` (Werkzeug `tools/listen_match.py`), Tests `tests/test_listen.py` und `tests/listen.test.mjs`.
- **Klick**: Das `href` ist die m365.fm-Folgenseite (ohne JavaScript, interne Verlinkung für Google). `assets/listen.js` setzt beim Laden das App-Ziel nach Gerät: iPhone/iPad/Mac → Apple Podcasts, alle anderen → Spotify (direkter Folgenlink aus `data/episode_links.json`/`platforms.json`, sonst Link der Show), Link öffnet im neuen Tab (`rel="noopener"`). Nur User-Agent/Plattform werden gelesen: nichts gespeichert, nichts gesendet, keine Parameter an den Zielen. Gezählt werden kann später im Worker über `data-card="1|2|3|entity|episode|all"` am Link. Die Karte ist ein Block mit einem Haupt-Link (`::after` über die ganze Karte) und dem getrennten Textlink "Alle Plattformen & Player" (kein verschachteltes `<a>`). "Show folgen": ohne JavaScript beide Links gleichwertig, mit Skript Hauptknopf nach Gerät und der andere klein daneben.
- **Zuordnung Beitrag → Folge** (`match_post`, strenge Schwellen, lieber keine Karte als eine schlechte Folge): *Stufe 1 Entitäten*: Themen des Beitrags gegen die QA-geprüfte Extraktion der Folgen (`site_extract`), gewichtet mit Seltenheit der Entität (idf) und Rang im Beitrag; verlangt: Summe ≥ `ENT_MIN` (2,5), eine gemeinsame nicht-allgemeine Entität unter den ersten 3 Themen und mit Wert ≥ 70 in der Folge, eine der zwei Haupt-Entitäten der Folge unter den ersten 5 Themen, Text-Kosinus ≥ 0,16 und Gesamtwert ≥ 1,2. *Stufe 2 Text* (Lücken): TF-IDF-Kosinus Beitrag (Titel, Kurztext, Themen) gegen Folge (Titel, Hook, Takeaways) ≥ `TXT_MIN` (0,36) und mindestens 3 gemeinsame Wörter. Die zweite Karte muss um 0,1 über der Schwelle liegen und eine andere Folge sein (gleicher Titel zählt nicht doppelt). Alle Schwellen stehen oben in `site_listen.py` und sind in `tests/test_listen.py` belegt.
- **Austauschbar**: Die Ähnlichkeit steckt hinter `Similarity` (`fit(docs)`, `query(text, k)`); `SIMILARITY = TfidfSimilarity`. Embeddings (Vektorsuche, z. B. Cloudflare Workers AI) ersetzen sie mit einer Klasse, die dieselben zwei Methoden hat; dann `VERSION` erhöhen (macht den Zwischenspeicher ungültig) und `TXT_MIN` neu belegen.
- **Zwischenspeicher**: `python tools/listen_match.py [--stats]` schreibt `data/listen_matches.json` (Slug → `[{episode, score, via}]`). Der Seitenbau nutzt einen Eintrag nur, wenn Titel, Kurztext, Themen, Folgenbestand und `VERSION` passen, sonst rechnet er selbst (Sekunden, ändert die Datei nicht). Sprachfassungen übernehmen die Zuordnung ihres englischen Originals.
- **Sprachen**: Name und Hook der Folge in der Sprache des Beitrags, wenn es die Dub-Folge dort gibt (`orig_alts`; Hook aus dem übersetzten Teaser), sonst die englische Folge. Oberflächentexte über `site_i18n.T` (`data/py_i18n.json`, alle 15 Sprachen).
- **Bild**: WebP-Banner `design/listen/listen-banner.webp` liegt als `https://img.m365.fm/listen/listen-banner.webp` im R2-Bucket (CLAUDE.md): `data/r2_local.json` nennt lokale Dateien, `tools/r2_upload.py --apply` (Workflow `r2-images.yml`, `apply=true`) lädt sie hoch und trägt Repo-Pfad → URL in `data/r2_map.json` und die Maße in `data/r2_dims.json` ein. Solange das nicht geschehen ist, bauen die Seiten ohne Bild und die Karte zeigt einen CSS-Verlauf schwarz/gelb mit gelbem Rand (kein kaputtes Bild). Folgen-Cover (Spreaker) bleiben bei Spreaker.
- **Stichprobe** (Stand 12.11.2026, 2.418 englische Beiträge ohne Datenbank-Beiträge, 1.203 Folgen im Katalog): keine Karte 1.538 (64 %), eine Folge + "Show folgen" 643 (27 %), zwei Folgen + "Show folgen" 237 (10 %); 969 Folgen-Zuordnungen über Entitäten, 148 über den Text.
