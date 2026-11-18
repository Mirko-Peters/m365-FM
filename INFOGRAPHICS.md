# Infografiken: Kopfbild + 2–3 Infografiken je Inhalt

Für Entitäten, Blogbeiträge und Podcast-Folgen entstehen automatisch **1 Kopfbild (1200×630) und 2–3 Infografiken**, in allen 15 Seitensprachen (en, de, es, fr, it, pt, nl, pl, id, ru, uk, ar, he, ja, ko), nur als Standbilder (WebP, Dark-Glass-Stil). Keine Videos (Entscheidung vom 18.11.2026: geteilt wird das Standbild, Link-Vorschauen zeigen ohnehin nur ein Standbild).

## Was auf der Seite passiert (erst nach Freigabe)
- Das **Kopfbild ersetzt das bisherige** (erzeugtes SVG der Entität bzw. Titelbild/Cover am Textanfang früherer Blogbeiträge) und wird das **Teilen-Bild (`og:image`, 1200×630, als JPEG neben dem WebP, weil LinkedIn/Facebook JPEG zuverlässiger zeigen; `twitter:card` = `summary_large_image`)**. Die Teilen-Schaltflächen bleiben. Die alten Dateien bleiben im Bucket. Das kleine Folgen-Cover (160 px) bleibt, es ist kein Kopfbild.
- Die 2–3 Infografiken stehen gleichmäßig verteilt im Text (nach Absätzen, nie in Listen/Tabellen/Bildern), lazy geladen, mit Alt-Text.
- Eine Sprache/Art erscheint nur, wenn für den Inhalt **Kopfbild und mindestens zwei Infografiken** in dieser Sprache fertig sind; sonst bleibt die Seite wie vorher.

## Freigabe und Notschalter
`data/infographics_live.json`, z. B. `{"langs": ["en", "de"], "kinds": ["blog"]}`. Fehlt die Datei oder ist sie leer, ist der Seitenbau **Byte für Byte wie vorher** (Test `tests/test_infographics.py`). Notschalter: Datei leeren, danach Seitenbau (`site.yml`). Gestaffelt freigeben (z. B. erst `en,de` und eine Art) und in der Search Console vergleichen.

## Einführung in Stufen
Erste Stufe: **Englisch und Deutsch** (Workflow-Standard `langs=en,de`, Freigabe `{"langs": ["en", "de"], ...}`). Danach die übrigen 13 Sprachen mit derselben Befehlsfolge (`translate`/`render` mit `langs=es,fr,...`); die englischen Bildtexte (`specs`) entstehen nur einmal.

## Ablauf (Workflow `infographics.yml`, nur von Hand)
1. `plan`: zählt, schätzt Haiku-Kosten und Rechenzeit. Nichts wird bezahlt.
2. `specs` mit `limit=20`: Haiku-Batch schreibt je Inhalt die englischen Bildtexte (Kopfbild + 2–3 Infografiken, Vorlagen flow/compare/ladder/hub, Kopfbild bigfact). Danach `collect` (läuft im selben Workflow bis zu 3,5 h). Ergebnis prüfen, dann ohne `limit`.
3. `translate` (je Sprache ein Batch). Jede Antwort wird geprüft: dieselbe Struktur und Zahlen wie das Englische, Textlängen (Englisch ×1,4), richtige Schrift (ru/uk kyrillisch, ar, he, ja, ko), keine Sonderzeichen.
4. `render`: Playwright rendert jedes Bild (Schriften Sora/Albert Sans/IBM Plex Mono lokal, Noto für ru/uk/ar/he/ja/ko), **Layoutprüfung** (Überlauf, außerhalb der Fläche, Text auf Text). Nur wenn Kopfbild und alle Infografiken eines Inhalts tadellos sind, wird er als WebP nach R2 geladen (`ig/<art>/<slug>/<sprache>-<nr>-<hash>.webp`, das Kopfbild zusätzlich als `.jpg`; unveränderlich, ein Jahr Cache) und in `data/infographics/<art>.json.gz` eingetragen. Fehlerhafte Sätze erscheinen im Protokoll, werden höchstens zweimal versucht und bleiben ohne Bild. Der Lauf endet nach 320 Minuten und macht beim nächsten Start weiter.
5. Freigeben (`data/infographics_live.json`), Seitenbau.

**Neue Inhalte** bekommen Bilder, sobald sie in den Quellen stehen: `specs` → `translate` → `render` erledigen nur das, was fehlt. (Ein Zeitplan dafür ist bewusst nicht eingebaut; er braucht Mirkos Ja.)

## Speicherorte
- Bildtexte (alle Sprachen je Inhalt): R2 `ig/_specs/<art>/<slug>.json` (nicht in Git, sonst ~90 MB).
- Index in Git: `data/infographics/<art>.json.gz` mit `{slug: {"s": Quellhash, "<sprache>": [[vorlage, hash, alt], ...]}}`, Eintrag 0 = Kopfbild. Masse ergeben sich aus der Vorlage (`SIZES`), die URL aus Schlüsselschema und Hash; deshalb stehen die Bilder nicht in `data/r2_dims.json`.
- Zustand der Batches: `data/infographics_state.json`.

## Kosten (Schätzung, Stand 18.11.2026)
~3.700 Inhalte (2.307 Blog, 1.114 Folgen, ~250 Entitäten mit Text; mehr, sobald PR #542/Entity-Fill Texte liefern). Haiku 5.5 im Batch (halber Preis): ca. 21 € bei knapper, ca. 55 € bei vorsichtiger Rechnung (ar/he/ja/ko/ru brauchen mehr Token). Rendern: ~205.000 Bilder ≈ 28 h Rechenzeit ≈ 10 $ bei privatem Repo. R2 ≈ 10 GB ≈ 0,15 $/Monat. Danach ≈ 1 Cent je neuem Inhalt in allen Sprachen. Das Tagesbudget (`AI_DAILY_EUR_HAIKU`, `ai_gateway.check_budget`) gilt wie bei den anderen KI-Läufen; den genauen Preis zeigt der Probelauf.

## Nicht enthalten (Folgearbeit)
- Community-Blog (`site_blog.py` für nicht frühere Beiträge): Anbindung nur für frühere Podpage-Beiträge (`legacy`).
- Spiegelung der Vorlagen für ar/he (Rechts-nach-links): Text läuft rechts nach links, die Kartenpositionen sind nicht gespiegelt.
- Neue Inhalte automatisch per Zeitplan.

## Prüfungen und Schutz (nach der Gegenprüfung vom 18.11.2026)
- Die große Zahl im Bild ist geprüft: Flow = Zahl der Schritte, Hub = Zahl der Teile, Kopfbild = Zahl der Punkte oder im Text genannt. Keine Adressen/@ in den Bildtexten.
- Batches in Teilen zu 500; vor jedem Teil Budgetprüfung inklusive dessen, was der Lauf schon vorgemerkt hat, und Kürzung auf das Restbudget. Nach einem Fehler beim Senden wird nichts wiederholt. `collect` verarbeitet immer alle offenen Batches (alle Arten) und sichert den Stand nach jedem.
- Textgrenzen wurden mit den echten Schriften und den längsten erlaubten Texten (×1,4) gemessen. Dateien für Polnisch u. a. (latin-ext) liegen bei den Schriften.
- Vor der Freigabe prüfen: LinkedIn Post Inspector und Facebook-Debugger mit einem Beitrag; Search-Console-Vergleich.
- Offen: JSON-LD `image` zeigt weiter auf das alte Bild; ändert sich ein Quelltext, bleibt das Bild stehen (Quellhash `s` ist gespeichert, wird noch nicht verglichen).
