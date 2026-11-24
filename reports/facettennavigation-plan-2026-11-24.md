# Plan: Facettennavigation für Bibliothek und Blog (Stand 24.11.2026)

> Ablageort: `reports/` statt `docs/` wie beauftragt, weil `docs/` in diesem Repo die erzeugte Seitenausgabe ist (`.gitignore` Zeile 1, wird vom Bau geleert und nach GitHub Pages veröffentlicht).

Auftrag von Mirko (20.11.2026): `/community/library/` bekommt eine facettierte Navigation nach Thema und Entität, `/community/blog/` eine mit den Entitäten. Dieses Dokument ist nur der Plan. Es ändert keine Seite, keine Daten und verursacht keine KI-Kosten.

**Grenze der Messung:** Die Live-API (`api-dub.m365.fm`) und `www.m365.fm` waren in diesem Lauf von der Cloud-Umgebung aus gesperrt (Proxy 403), und `docs/` und `data/cache/` gibt es im Checkout nicht. Die Zahlen unten stammen deshalb aus dem Repo (importierte Blogbeiträge, Bibliotheks-Seed, `data/entities.json`). Beiträge und Einträge, die Mitglieder live angelegt haben, fehlen darin. Schritt 0 holt die echten Zahlen nach.

## 1. Ziel

Besucher sollen in Blog und Bibliothek nach Entität (Blog und Bibliothek) und Thema (Bibliothek) eingrenzen können, ohne 23 Listenseiten durchzublättern. Suchmaschinen sollen für jede Entität mit genug Inhalt eine saubere, eigene Listenseite finden.

Erreicht ist das Ziel, wenn:
1. `/community/blog/entity/<slug>/` und `/community/library/entity/<slug>/` (sowie `/community/library/topic/<slug>/`) statisch erzeugt werden, in allen 15 Sprachen unter dem Sprachpräfix.
2. jede Facette einen Zähler trägt und die Seiten ohne JavaScript funktionieren.
3. das clientseitige Filtern Kombinationen erlaubt, ohne neue indexierbare URLs zu erzeugen.
4. `docs/` unter 980 MB bleibt und die Tests aus Abschnitt 4 grün sind.

## 2. Ist-Stand

### Wer baut was
| Seite | Modul | Stelle |
|---|---|---|
| Blog-Übersicht `/community/blog/`, je Autor `/community/u/<h>/blog/` | `site_blog.py` | `build()` ab Zeile 137, Listenfunktion `paged()` Zeile 266 |
| Blog-Beitrag mit Themen-Chips | `site_blog.py` | Zeile 211 ff. (`topics`, `EN.list_link`) |
| Bibliothek `/community/library/` und Einträge | `site_library.py` | `build()` ab Zeile 66, Verzeichnis Zeile 108 ff. |
| Index-Entscheidung Bibliothek | `site_library.py` | `is_indexable()` Zeile 41 (10 Stimmen, 2500 Zeichen, `reviewed`) |
| Index-Regel Text | `site_index_rule.py` | `index_or_long()` (Verlinkungslisten zählen nicht als Text) |
| Entitätsseiten, nur für Entitäten | `site_entities.py` | Zeile 1136: zeigt höchstens 30 Artikel je Entität |
| Themen-Zuordnung Beiträge | `site_topics.py` | `score_topics()`, Cache `data/cache/blog_topics.json`; Importbeiträge tragen `topics:` im Frontmatter (`imports/blog/en/*.md`) |
| Oberthemen (7 Kategorien) | `site_taxonomy.py` | `CATS`, `classify()`, `cat_name()` (Namen in 15 Sprachen) |
| Namen der Entitäten je Sprache | `site_ename.py` | `ename()`, `list_link()` |
| Sitemaps je Sprache und Typ | `site_sitemaps.py` | `classify()` Zeile 20 (Pfad → Typ), `MAX_URLS = 45000` |
| R2 statt GitHub Pages | `site_size.py` | `r2_only()` Zeile 8: alle Sprachen außer `en`/`de` liegen im R2-Bucket |
| Seitenrahmen, noindex, Canonical | `generate_site.py` | `page()` Zeile 532 |

### Datenquellen
- Entitäten: `data/entities.json`, 2.114 Einträge (1.152 concept, 798 product, 58 cert, 36 org, 25 job, 13 industry, 12 person, 9 category, 7 platform, 3 event, 1 media). Die Seiten liegen unter `/entity/<id>/`.
- Beitrag → Entitäten: Feld `topics` (Liste von Entitäts-IDs). Das ist schon die einzige Zuordnung, die der Beitragsseite ihre Chips liefert. Sprachfassungen erben `topics` vom Original.
- Bibliothekseintrag → Entitäten: Feld `topics` je Eintrag (`site_library.py` Zeile 78). Eine Zuordnung zu den sieben Oberthemen gibt es für die Bibliothek nicht; sie lässt sich mit `site_taxonomy.classify()` aus Titel, Kurztext und Entitätsnamen ableiten, ohne KI.
- Live-Daten kommen aus `/api/blog/export` und `/api/library/export` (`site_fetch.py`, Cache `data/cache/`).

### Zahlen aus dem Repo
- **Blog:** 605 importierte englische Originale, alle mit `topics`; im Mittel 3,2 Entitäten je Beitrag, 407 verschiedene Entitäten. Es gibt keine unbekannten IDs. Verteilung der Entitäten: 235 mit mindestens 2 Beiträgen, 159 mit mindestens 3, 106 mit mindestens 5, 56 mit mindestens 10, 20 mit mindestens 20. Spitzenreiter: teams 67, sharepoint 59, ifakt 37, copilot 34, sharepoint-permissions 31. Die Typen der verwendeten Entitäten: 925 Zuordnungen concept, 906 product, 53 org, 29 platform, 14 industry. Kommentar im Code (`site_blog.py` Zeile 265): „vorher ~2.300 Beiträge in einer Liste“, also grob 2.300 Beiträge über alle Sprachen. Davon sind 16 Sprachpakete in `data/blog_i18n/<lang>/` übersetzt; die echte Zahl je Sprache ist offen (Schritt 0).
- **Bibliothek:** 261 Seed-Einträge (alle Englisch) in 16 Arten (prompt 22, other 20, flow 18, dax 18, agent 18, …), 211 verschiedene Entitäten, davon 102 mit mindestens 3 und 36 mit mindestens 10 Einträgen (manufacturing 86, copilot 69, sharepoint 61, teams 56). Dazu kommen Einträge der Mitglieder, die nur live bekannt sind.

### Paginierung, Filter, SEO heute
- **Blog:** `paged()` zeigt 100 Beiträge je Seite (`PER = 100`, `site_blog.py` Zeile 265), Seite 2 ff. unter `/page/N/` mit `rel=prev/next`, immer `noindex,follow`, nicht in der Sitemap (Mirko 18.11.2026, `tests/test_pagination_noindex.py`). Seite 1 ist indexierbar, sobald mindestens ein Beitrag der Sprache indexierbar ist, und steht in der Sitemap. Ein Filter nach Entität oder Thema existiert nicht. Die Autorenverzeichnisse folgen derselben Regel.
- **Bibliothek:** keine Paginierung, ein Verzeichnis je Sprache mit allen Einträgen, gruppiert nach Art (16 Überschriften). Mit 261+ Einträgen und wachsendem Bestand wird die Seite lang. Kein Filter. Einträge: `noindex` nach `is_indexable()`; Verzeichnis `noindex`, wenn kein Eintrag indexierbar ist; sonst Sitemap.
- **Canonical:** jede Liste setzt ihre eigene URL als Canonical (`page()` bekommt `pu`); Seite 2 ff. zeigt auf sich selbst.
- **Sitemap-Typen:** `/community/blog/…` und `/community/library/…` landen in `site_sitemaps.classify()` im Typ `community` (Blog-Typ gilt nur für `/community/u/<h>/blog/…`).

## 3. Vorschlag

### 3.1 Statisch erzeugte Facettenseiten (saubere URLs)
| URL | Inhalt |
|---|---|
| `/community/blog/entity/<slug>/` | Beiträge mit dieser Entität, 100 je Seite, Seite 2 ff. unter `page/N/` |
| `/community/library/entity/<slug>/` | Einträge mit dieser Entität |
| `/community/library/topic/<slug>/` | Einträge eines der 7 Oberthemen (`site_taxonomy.CATS`) |
| `/community/library/kind/<art>/` | optional: vorhandene Arten (heute nur als Überschriften) |

`<slug>` ist die Entitäts-ID; Sprachpräfix wie überall (`/de/community/blog/entity/teams/`). Reihenfolge der Beiträge wie im Verzeichnis (neueste zuerst), in der Bibliothek nach Stimmen. Jede Facettenseite hat ein H1 („Blog: Microsoft Teams“), den Zähler, die Liste, einen Link zur Entitätsseite `/entity/<slug>/` und die Facettennavigation.

Die Entitätsseite verlinkt zusätzlich auf die vollständige Facettenseite („Alle 31 Beiträge“). Heute zeigt sie höchstens 30 (`site_entities.py` Zeile 1136, nur für den Feed). Das gibt den Facettenseiten internes Gewicht aus den ohnehin stärksten Seiten.

### 3.2 Welche Seiten indexierbar sind
- **index:** Facettenseite Seite 1, wenn sie mindestens **3** indexierbare Beiträge bzw. Einträge in der Sprache zeigt (Blog: 159 von 407 Entitäten; Bibliothek: 102 von 211) und die Entität selbst eine indexierbare Seite hat. Gleiche Prüfung wie heute (`_pub` im Blog, `is_indexable` in der Bibliothek), also nie index auf eine Liste ohne indexierbaren Inhalt. Die Schwelle 3 ist ein Vorschlag (offene Frage 1).
- **noindex,follow:** Facette mit weniger als 3; Seite 2 ff. jeder Facette (wie 18.11.2026); alle Sprachfassungen ohne indexierbaren Inhalt.
- **Kombinationen** (zwei Entitäten, Entität × Art) bekommen **keine** statische Seite. Sie existieren nur clientseitig im Fragment `#e=teams,sharepoint&k=prompt` (kein Server-Request, nicht crawlbar). Die Seite behält ihren Canonical. So entstehen keine unbegrenzten URL-Räume und keine Parameterduplikate; `robots.txt` bleibt unverändert.
- **Canonical:** je Facettenseite die eigene saubere URL. Facettenseite mit Filter im Fragment: Canonical der Seite ohne Fragment (automatisch).
- **hreflang:** nur zwischen Sprachfassungen, die selbst `index` sind (wie `page()` es für `alternates` macht).
- **Sitemap:** indexierbare Seite 1 je Facette. `site_sitemaps.classify()` bekommt eine Regel: `/community/blog/entity/…` → Typ `blog`, `/community/library/…` → `community`, damit die Blog-Sitemaps nicht mit Bibliotheksseiten vermischt werden.
- **Strukturierte Daten:** `CollectionPage` mit `about` → `/entity/<slug>/#entity` und `BreadcrumbList` (M365.FM › Community › Blog › Entität).

### 3.3 Zähler je Facette
Statisch im HTML: „Teams (67)“. Die Zähler zählen genau die Beiträge, die die Facettenseite listet (also dieselbe Menge wie der Index-Test), je Sprache. Beim clientseitigen Filtern werden die Zähler der übrigen Facetten für die aktuelle Auswahl neu berechnet; Facetten mit 0 werden deaktiviert, nicht ausgeblendet. Alle Zähler kommen aus einer Zählung (`facet_counts()`), die Build und Test gemeinsam nutzen.

### 3.4 Navigation und clientseitiges Filtern
- **Ohne JavaScript:** die Navigation besteht aus echten Links auf die statischen Facettenseiten (`<nav aria-label="Entitäten">`, `aria-current="page"` auf der aktiven Facette). Auf `/community/blog/` stehen die 12 häufigsten Entitäten sichtbar, der Rest hinter „Alle Entitäten“ (`<details>`, alphabetisch, nach Typ gruppiert).
- **Mit JavaScript:** ein Skript lädt je Seite und Sprache einmal `facets.json` (siehe unten), filtert die Liste ohne Neuladen nach mehreren Entitäten, Art und Thema, ersetzt die Liste und schreibt die Auswahl ins Fragment (`history.replaceState`). Ohne Skript bleibt alles bedienbar.
- **`facets.json` je Sprache und Bereich:** kompakt (Titel, URL, Datum, Autor, Entitäts-Indizes); Schätzung Blog ≈ 120 Byte je Beitrag, bei 600–2.300 Beiträgen je Sprache 70–280 KB unkomprimiert (gzip etwa 25 %). Für `en`/`de` in GitHub Pages, für die anderen 13 Sprachen im R2-Bucket (wie die anderen großen Dateien, `site_size.r2_only()` muss die Datei erkennen). Nur Beiträge, die in der Sprache existieren, damit keine fremdsprachigen Titel auftauchen.

### 3.5 Mehrsprachigkeit
- Entitätsnamen über `site_ename.ename()`/`list_link()`, Oberthemen über `site_taxonomy.cat_name()` (alle 15 Sprachen vorhanden, teils nur Englisch als Rückfall: `copilot` und `platform` haben nur `en`).
- Neue UI-Texte („Alle Entitäten“, „Filter zurücksetzen“, „n Beiträge“) über `T(lang, en, de)`; die übrigen 13 Sprachen kommen aus `data/py_i18n.json`. Fehlt der Text dort, fällt `T` auf Englisch zurück. Die Übersetzung der neuen Texte ist ein Eintrag je Text in `data/py_i18n.json`, ohne neuen KI-Lauf, wenn die Texte aus bereits übersetzten Satzbausteinen entstehen, sonst ein kleiner, vorher beschlossener Übersetzungslauf (Kosten unter offene Fragen).
- Sortierung der Entitätsliste je Sprache mit `locale`-gerechter Sortierung im Build, in `ar`/`he` `dir=rtl` (Seitenrahmen setzt es bereits).
- Nur Facetten mit Inhalt in der Sprache: eine Entität ohne Beitrag auf Französisch erscheint auf der französischen Seite nicht.

### 3.6 Mobile
- Navigation hinter einer Schaltfläche „Filter (n)“ (`<details>`/Dialog), unter 40em einspaltig; Chips umbrechen statt seitlich zu scrollen; Tippflächen mindestens 44 px; Zähler und aktive Filter bleiben als entfernbare Chips über der Liste sichtbar.
- Keine festen Breiten; CSS im bestehenden `LCSS`, kein neues Stylesheet.

### 3.7 Barrierefreiheit
- Facetten als Links (statisch) bzw. als Gruppe von Kontrollkästchen mit `<fieldset><legend>` (Kombinationsfilter), Tastatur komplett bedienbar.
- Trefferzahl nach jeder Änderung in einem `aria-live="polite"`-Bereich („12 Beiträge“); Fokus bleibt auf der geänderten Kontrolle.
- Aktive Facette mit `aria-current`, deaktivierte Facetten mit `aria-disabled` plus Text „0“; Kontrast wie das bestehende `--ac`/`--bd`-Schema; Bewegungsarmut (`prefers-reduced-motion`).
- Prüfung gegen die bestehende Barrierefreiheitserklärung (`data/a11y_*.json`).

## 4. Schritte, Dateien, Tests

**Schritt 0 – echte Zahlen holen (kein Code, Mensch oder Lauf mit Netz).** Beitrags- und Eintragszahl je Sprache, Verteilung je Entität, Größe der Verzeichnisseiten aus `docs/` bzw. R2. Ergebnis in dieses Dokument eintragen. Davon hängt die Schwelle ab.

**Schritt 1 – gemeinsame Zählung.** Neu: `site_facets.py` mit `entity_index(items, ents)` (Entität → Einträge), `facet_counts()`, `facet_nav()` (HTML, Zähler, `aria`), `facet_json()`. Reine Funktionen. Test neu: `tests/test_facets.py` (Zähler stimmen mit der Liste überein, Sortierung, Sprache ohne Inhalt, unbekannte IDs werden übersprungen, Schwelle 2/3/4).

**Schritt 2 – Blog.** Geändert: `site_blog.py` (nach der Hauptliste je Sprache `paged()` je Facette mit Schwelle aufrufen; Navigation in `first_html`; Sitemap nur bei index), `site_entities.py` (Link „Alle n Beiträge“). Tests: `tests/test_pagination_noindex.py` (Facette Seite 1 index, Seite 2 noindex, nicht in der Sitemap), `tests/test_index_rule.py` (Facette ohne indexierbaren Beitrag ist noindex), neu `tests/test_blog_facets.py` (Canonical, hreflang nur unter indexierbaren Sprachen, kein Seitenpfad für Kombinationen).

**Schritt 3 – Bibliothek.** Geändert: `site_library.py` (Verzeichnis: Navigation, Seitenweise Ausgabe 100 je Seite statt einer Liste; Facettenseiten nach Entität, Thema, optional Art; Thema über `site_taxonomy.classify()`). Neu/erweitert: `tests/test_library_facets.py` (`is_indexable` bleibt maßgeblich, `reviewed` zählt, Code-Arten, Thema aus `classify`).

**Schritt 4 – Sitemaps und R2.** Geändert: `site_sitemaps.py` (Typregel), `site_size.py` (`facets.json` der Nicht-`en`/`de`-Sprachen nach R2), `sitewrk/index.js` nur falls die Datei nicht schon über `EXPORT_RX` ausgeliefert wird. Tests: `tests/test_sitemaps*.py` (Typ), `tests/test_exports_r2.py`, `sitewrk/test/`.

**Schritt 5 – clientseitiges Filtern.** Neu: Skript in `site_facets.py` (inline, wie die übrigen Seitenskripte). Tests: `tests/test_community_lazy_browser.py` als Vorbild für einen Browser-Test (Fragment setzen, Zähler, Fokus), plus `tests/community_lazy.test.mjs`-artiger Test für die Filterlogik ohne Browser.

**Schritt 6 – Probelauf.** Staging-Seite (`site-staging.yml`, `SITE_LANGS="de,en"`) bauen, Größe und Zeit prüfen, Stichproben in Search-Console-nahen Prüfungen (`check_sitemaps.py`, `check_links.py`, `check_titles.py`, `check_schema.py`, `tests/test_docs_size.py`). Erst danach der Liveauftrag `site.yml`.

Jeder Schritt wird einzeln gemergt (Entwurfs-PR → Gegenprüfung → grüne CI), Branch je Schritt `claude/facetten-<n>`.

## 5. Wirkung nach dem Merge
- Seitenbau über `site.yml` (rund 2 h; die Facetten kommen aus Daten, die der Bau schon im Speicher hat, ich erwarte unter 5 % mehr, also wenige Minuten – Schritt 6 misst es).
- Neue Seiten, Schätzung auf Basis der Repo-Zahlen und Schwelle 3: Blog etwa 160 Facetten × 15 Sprachen = 2.400 Seiten plus Folgeseiten bei den Spitzenentitäten (>100 Beiträge gibt es nach Repo-Stand nicht); Bibliothek etwa 100 Entitäten + 7 Themen × 15 Sprachen = 1.600 Seiten (heute nur englisch befüllt, andere Sprachen zunächst `noindex` ohne Inhalt, nicht gebaut). Das ist eine Größenordnung, keine Messung.
- In den Sitemaps kämen nur indexierbare Seite-1-Seiten dazu; weit unter `MAX_URLS`.
- Danach: Search Console Sitemap neu einreichen (Mirko), Indexierung der Facetten in der Woche darauf beobachten.

## 6. Risiken
| Risiko | Einschätzung | Gegenmaßnahme |
|---|---|---|
| Seitenzahl | 2.400 + 1.600 neue Seiten, nur die mit ≥ 3 Treffern sind index | Schwelle, Obergrenze `FACET_MAX_PAGES`, Kombinationen nie statisch |
| Build-Größe (< 980 MB) | Liste je Seite ~8–45 KB (nach heutiger Blogliste ~45 KB je 100 Einträge): `en`/`de` in Pages etwa 320 Seiten ≈ 3–6 MB; die 13 anderen Sprachen liegen im R2-Bucket, nicht in `docs/` | `site_size.r2_only()` deckt sie ab, `tests/test_docs_size.py`, Probelauf misst; ist `docs/` nahe der Grenze (siehe Abbruch ab 980 MB), Facetten von `en` zuerst nach R2 |
| Crawl-Budget | viele ähnliche Listenseiten | Schwelle, Seite 2 ff. `noindex,follow`, Sitemap nur Seite 1, Fragment statt Parameter, Link von der Entitätsseite nur auf Seite 1 |
| Dünne Listen / Kannibalisierung mit `/entity/<slug>/` | Liste hat wenig eigenen Text (Verlinkungslisten zählen laut `site_index_rule` nicht als Text) | kurze Einleitung aus der Entitätsbeschreibung, Canonical je Seite auf sich selbst, Entitätsseite bleibt Hauptseite; Beobachtung in der Search Console, ggf. Schwelle erhöhen |
| Falsche Zuordnung | `topics` von `score_topics` ist heuristisch, allgemeine Begriffe wie „copilot“ sammeln viele Beiträge | Facette nur bei ≥ 3, allgemeine Entitäten (`GENERIC` in `site_topics.py`) in der Navigation nach hinten |
| Sprachfassungen mit fremdem Text | Titel auf Englisch in nicht übersetzten Sprachen | Facette nur aus Beiträgen der Sprache; `facets.json` je Sprache |
| Mehr Last auf der API | keine; Bau nutzt bestehende Exporte | keine zusätzlichen Abrufe |

## 7. Rückweg
- Notschalter: Umgebungsvariable `FACETS_ENABLED=0` in `site.yml` (Standard zunächst `0`, bis Probelauf grün). Bei `0` entstehen keine Facettenseiten, keine Navigation, keine Sitemap-Einträge; die Listen bleiben wie heute.
- Wurde sie schon veröffentlicht und soll zurück: Die Facettenseiten werden nicht gelöscht, sondern per 301 auf `/community/blog/` bzw. `/community/library/` bzw. die Entitätsseite umgeleitet (Redirect-Tabelle `site_podpage.redirect_table`), bis Google sie ausgetragen hat.
- Jeder Schritt ist ein eigener PR und lässt sich einzeln rückgängig machen (`git revert`, danach `site.yml`).
- Es werden keine Daten verändert, daher kein Datenrückweg nötig.

## 8. Kosten
Keine KI-Läufe im Plan. Nur wenn die neuen Oberflächentexte in `data/py_i18n.json` für die 13 weiteren Sprachen übersetzt werden müssen: kleiner Übersetzungslauf (ein Dutzend Sätze); erst `plan`, dann `run`, Schätzung vor dem Lauf in EUR an Mirko.

## 9. Offene Fragen an Mirko
1. **Schwelle für index:** ab 3 Beiträgen bzw. Einträgen je Facette (Vorschlag), oder strenger (5) mit weniger, aber stärkeren Seiten?
2. **Was bedeutet „Thema“ in der Bibliothek?** Die 7 Oberthemen aus `site_taxonomy` (agents, copilot, security, platform, azure, data, workplace), die Art des Eintrags (Prompt, KQL, DAX …) oder beides? Ich plane beides: Thema = Oberthema, dazu Art als weitere Facette.
3. **Soll der Blog auch nach Oberthema filtern** oder nur nach Entität (Auftrag: nur Entitäten)?
4. **Entitätsarten:** alle (concept, product, org …) oder nur Produkte und Konzepte?
5. **Sprachen:** alle 15 gleichzeitig oder zuerst `en`/`de` (kleiner Test, Größe in Pages)?
6. **Live-Zahlen:** Soll ich Schritt 0 mit den Exporten auswerten, sobald ein Lauf mit Zugriff auf `api-dub.m365.fm` möglich ist?
