# SEO-Experiment: beschreibende Ankertexte statt Namen (16.11.2026)

## Frage
Verbessert ein **semantisch beschreibender interner Ankertext** ("Conditional Access – a policy engine in Microsoft Entra") gegenüber der **klassischen Namensverlinkung** ("Conditional Access") die thematische Relevanz und Auffindbarkeit der verlinkten Entitätsseite?

## Hypothese (vorab festgelegt)
- **H1:** Seiten mit beschreibenden Ankern bekommen mehr Impressionen pro Tag und mehr verschiedene Suchanfragen als vergleichbare Seiten mit Namens-Ankern.
- **H0:** Kein Unterschied. (Möglich auch: Google gewichtet interne Anker kaum, oder Anker mit Zusatz wirken verwässert.)
- **Hauptmaß:** Änderung der Impressionen pro Tag (ln(1+x)) der englischen Entitätsseite, Gruppe *sem* minus Gruppe *ctl*.
- **Nebenmaße:** Klicks pro Tag, mittlere Position, Zahl verschiedener Suchanfragen je Seite.

## Aufbau
- **Teilnehmer:** 200 englische Entitätsseiten (Begriffe und Produkte), die mindestens 2 Beziehungen haben, nicht doppelt sind und einen sauberen Zusatz aus ihrer Beschreibung bekommen. Dateien: `data/seo_experiment.json` (eingefroren, nicht per Hand ändern).
- **Gruppen:** *sem* (100, beschreibender Anker) und *ctl* (100, Name wie bisher). Zufällig nach Hash, getrennt nach Art (Begriff/Produkt) und Zahl der Beziehungen (2–3 / 4+), damit beide Gruppen ähnlich sind.
- **Behandlung:** Nur Links **auf** diese Seiten von anderen englischen Entitätsseiten (Listen „Teil von / Enthält / Verwandt mit …“ und „Verwandte Themen kurz erklärt“). Ankertext bei *sem*: `Name – Zusatz` (Zusatz = Anfang des ersten Beschreibungssatzes, regelbasiert, ohne KI, eingefroren in `anchors`). Jeder betroffene Link trägt `data-xv="sem"` oder `data-xv="ctl"`.
- **Nicht betroffen:** Brotkrumen, Blog, Navigation, Sitemap, alle anderen Sprachen. Die Brotkrumen-Änderung (PR #499) und die Dubletten-Canonicals gelten für beide Gruppen gleich und fallen in der Differenz heraus.
- **Start:** `start` in der JSON-Datei (geplant 30.11.2026); davor und ohne Datei ändert sich nichts. Mit `stop` endet es wieder.

## Ablauf
1. **Vorher:** 4 Wochen vor dem Start. Search Console → Leistung → Seiten (nur Web), Filter „Seite enthält /entity/“, 28 Tage vor dem Start als CSV exportieren (oder die Wochen-Exporte von `tools/gsc_export.py`).
2. **Laufzeit:** mindestens 8 Wochen ab Start (Google braucht Wochen, bis neue Anker erfasst sind). Keine weiteren Änderungen an den Teilnehmerseiten und ihren Links.
3. **Nachher:** 28 Tage ab etwa Woche 5 bis 8.
4. **Auswertung:** `python tools/seo_xp.py report --before vorher.csv --after nachher.csv --days-before 28 --days-after 28` (mit JSON-Exporten werden die Tage und die Suchanfragen automatisch gezählt). Ausgabe: Differenz der Gruppen mit 95-%-Intervall (Bootstrap). Ein Intervall ohne 0 ist ein Hinweis, kein Beweis.
5. **Prüfung des Aufbaus:** `python tools/seo_xp.py check docs` (nach einem Bau): *sem*-Links beschreibend, *ctl*-Links nur Name.

## Grenzen (ehrlich nennen)
- **Kleine Stichprobe:** je 100 Seiten, viele mit wenigen Impressionen. Kleine Effekte sind kaum nachweisbar; ein „kein Unterschied“ heißt nicht „kein Effekt“.
- **Nicht verblindet, keine Zufallszuteilung im strengen Sinn** (Hash-Zuteilung, aber nur aus Seiten mit sauberem Zusatz). Ergebnis gilt für ähnliche Seiten, nicht für alle.
- **Störfaktoren:** Google-Updates, neue Folgen/Artikel, die einzelne Seiten pushen, Saison. Gleichzeitige Änderungen auf nur einer Gruppe vermeiden.
- **Interne Links sind nur ein Signal.** Hier wird nur der Ankertext geändert; die Zahl der Links bleibt gleich.
- Der Zusatz ist automatisch erzeugt; einige Ankertexte sind holprig (Liste in `data/seo_experiment.json` unter `anchors`).

## Für den Reddit-Beitrag
Hypothese, Design (Gruppen, Behandlung, Maße, Laufzeit) jetzt veröffentlichen, **bevor** Zahlen vorliegen – das macht das Experiment glaubwürdig. Nach der Laufzeit die Ausgabe von `report` und die Grenzen zeigen.
