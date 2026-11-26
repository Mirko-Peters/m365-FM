# Brief: Deutsche Fassungen der Kurs-Erweiterung (10 Pillars + 15 Cluster), 26.11.2026

Auftrag (Mirko, 26.11.2026: "deutsch ?"): Die 25 englischen Artikel der Kurs-Erweiterung "Manufacturing Excellence" (`/mnt/project-files/seo-pillars-en/` und `.../clusters/`) bekommen eine deutsche Fassung. Natürliches Deutsch für deutsche Produktionsleute (Werksleitung, Lean-Verantwortliche, Meister, Planer, IT/OT), keine Wort-für-Wort-Übersetzung. Struktur, Fakten, Zahlen, Quellen, Links und iFAKT-Offenlegung bleiben inhaltlich gleich. Keine neuen Fakten oder Zahlen erfinden.

## Ausgabe

- Pillars: `/mnt/project-files/seo-pillars-de-course/<de-slug>.md`
- Cluster: `/mnt/project-files/seo-pillars-de-course/cluster/<de-cluster-slug>.md`
- ZIP: `/mnt/project-files/seo-pillars-zip/m365fm-kurs-erweiterung-de.zip`

## URL-Schema und Slug-Map

Deutsch: `https://www.m365.fm/learn/<de-slug>/`, Cluster verschachtelt `https://www.m365.fm/learn/<de-parent-slug>/<de-cluster-slug>/`. hreflang-Paar `de-DE` <-> `en-US` (englische URL wie im EN-Artikel).

### Bestehende deutsche Pillars (Linkziele; ersetzen die EN-Links `/en/learn/...`)

| EN-Slug | DE-URL |
|---|---|
| lean-manufacturing | https://www.m365.fm/learn/lean-management/ |
| operational-excellence | https://www.m365.fm/learn/operational-excellence/ |
| value-stream-mapping | https://www.m365.fm/learn/wertstromanalyse/ |
| digital-twin-manufacturing | https://www.m365.fm/learn/digital-twin/ |
| production-scheduling-aps | https://www.m365.fm/learn/produktionsplanung-aps/ |
| shop-floor-management | https://www.m365.fm/learn/shop-floor-management/ |
| manufacturing-kpis | https://www.m365.fm/learn/produktionskennzahlen/ |
| ifakt-polaris | https://www.m365.fm/learn/ifakt-polaris/ |
| manufacturing-it-azure | https://www.m365.fm/learn/manufacturing-it-azure/ |
| aerospace-production-planning | https://www.m365.fm/learn/produktionsplanung-luftfahrt/ |

### Neue Pillars

| EN-Datei | DE-Slug (Datei `<de-slug>.md`) | Hauptkeyword DE (Arbeitsstand) |
|---|---|---|
| 5s-visual-management | `5s-methode-visuelles-management` | 5S-Methode, visuelles Management |
| smed-changeover-reduction | `smed-ruestzeitreduzierung` | SMED, Rüstzeit reduzieren |
| tpm-oee | `tpm-oee` | TPM (Total Productive Maintenance), OEE |
| kanban-pull-system | `kanban-pull-prinzip` | Kanban in der Produktion, Pull-Prinzip |
| six-sigma-root-cause-analysis | `six-sigma-ursachenanalyse` | Six Sigma, DMAIC, Ursachenanalyse |
| sop-mrp-production-planning | `sop-mrp-produktionsplanung` | S&OP, MRP / Materialbedarfsplanung, Produktionsplanung im ERP |
| mes-isa-95 | `mes-isa-95` | MES (Manufacturing Execution System), ISA-95 |
| predictive-maintenance-iiot | `predictive-maintenance-iiot` | Predictive Maintenance, vorausschauende Wartung, IIoT |
| theory-of-constraints | `theory-of-constraints-engpass` | Theory of Constraints, Engpasstheorie, Drum-Buffer-Rope |
| ot-cybersecurity-iec-62443 | `ot-security-iec-62443` | OT-Security, IEC 62443 |

### Neue Cluster

| EN-Datei | Parent DE | DE-Cluster-Slug | Hauptkeyword DE |
|---|---|---|---|
| kaizen | lean-management | `kaizen` | Kaizen, Kaizen-Workshop, KVP |
| pdca-cycle | lean-management | `pdca-zyklus` | PDCA-Zyklus, Deming-Kreis |
| a3-problem-solving | lean-management | `a3-methode` | A3-Methode, A3-Report |
| poka-yoke | lean-management | `poka-yoke` | Poka Yoke, Fehlervermeidung |
| standard-work | shop-floor-management | `standardarbeit` | Standardarbeit |
| andon | shop-floor-management | `andon` | Andon-System |
| paperless-manufacturing | shop-floor-management | `papierlose-fertigung` | papierlose Fertigung, digitale Arbeitsanweisungen |
| lot-sizing | produktionsplanung-aps | `losgroesse` | Losgröße berechnen, optimale Losgröße (Andler) |
| manufacturing-inventory-management | produktionsplanung-aps | `bestandsmanagement` | Bestandsmanagement Produktion, Sicherheitsbestand |
| intralogistics | produktionsplanung-aps | `intralogistik` | Intralogistik, Materialfluss, Milkrun |
| manufacturing-simulation | digital-twin | `simulation-produktion` | Simulation Produktion, Materialflusssimulation, ereignisdiskrete Simulation |
| process-mining-manufacturing | digital-twin | `process-mining-produktion` | Process Mining in der Produktion |
| sustainable-manufacturing | operational-excellence | `nachhaltige-produktion` | nachhaltige Produktion, Energieeffizienz, Scope 1-3 |
| supply-chain-resilience | operational-excellence | `resiliente-lieferketten` | resiliente Lieferketten, Supply Chain Resilienz |
| manufacturing-workforce-skills | operational-excellence | `qualifikationsmatrix` | Qualifikationsmatrix, Mitarbeiterqualifizierung Produktion, TWI |

Interne Links in den Artikeln: jede `https://www.m365.fm/en/learn/...`-URL auf die deutsche URL aus diesen Tabellen umstellen. Links auf `/entity/...` und `/community/...` bleiben unverändert. Externe Quellen-URLs bleiben unverändert.

## Dateistruktur der deutschen Fassung

1. `# SEO-Metadaten` (Tabelle): Meta-Title (<= 60 Zeichen, mit Zeichenzahl), Meta-Description (<= 155 Zeichen, mit Zeichenzahl), Slug, ggf. Parent-Pillar, Hauptkeyword, Nebenkeywords (deutsche Suchbegriffe, wie Deutsche suchen: z. B. "Rüstzeit reduzieren", "KVP", "Andler-Formel"), Suchintention, Wortzahl (tatsächliches `wc -w` von H1 bis Fazit), Sprachversion `de-DE` + hreflang-Paar zur EN-URL.
2. Kein neuer SERP-Abschnitt. Stattdessen ein kurzer Abschnitt `# Hinweis zur Wettbewerbsanalyse`: Die Analyse der englischen Fassung bezieht sich auf google.com (USA); für google.de steht ein eigener SERP-Check (z. B. mit NEURONwriter) noch aus.
3. Der Artikel: H1, Stand-Zeile, Kurzantwort, "Das Wichtigste in Kürze", Inhaltsverzeichnis, alle Abschnitte, Glossar, FAQ, Fazit, "Weiterlesen auf m365.fm". Überschriften und FAQ-Fragen so formulieren, wie Deutsche suchen.
4. `# Autorenbox`: "[Mirko Peters](https://www.m365.fm/entity/mirko-peters/) ist Host von m365.fm und arbeitet bei der iFAKT GmbH. ..." (Platzhalter für Rolle/Bio/Foto wie im Original übernehmen).
5. `# Quellen`: Nummerierung exakt wie im Original (die [n] im Text bleiben gleich). Titel und URLs unverändert, Zusätze wie "abgerufen am" auf Deutsch.
6. `# Prüfhinweise für die Redaktion`: kurz, auf Deutsch: Herstellerangaben, [unbelegt]-Stellen, interne Links, JSON-LD-Vorschlag mit `inLanguage: de-DE`, empfohlene Grafiken, hreflang-Hinweis, plus offene Punkte für den deutschen Markt (siehe unten). Die englische Review-Log-Historie NICHT übersetzen; stattdessen ein Satz: "Fachliche Prüfung (9-köpfiges Expertenpanel, mehrere Runden) siehe englische Fassung; die deutsche Fassung ist eine Übertragung ohne inhaltliche Änderungen."

## Sprach- und Lokalisierungsregeln

- Deutsche Fachbegriffe, wie sie in deutschen Werken gesprochen werden: Rüsten, Rüstzeit, Werker, Meister, Schichtführer, Instandhaltung, Engpass, Bestand, Durchlaufzeit, Taktzeit, KVP, Wertstrom, Fertigungsauftrag, Stückliste, Arbeitsplan. Etablierte Anglizismen bleiben (OEE, Kanban, Andon, Gemba, Shopfloor, Lean, Six Sigma, Root Cause, Supermarkt, Milkrun). Begriff beim ersten Auftreten ggf. mit englischem Original in Klammern.
- Deutsches Zahlenformat: 1.000,5; Dezimalkomma auch in Formeln und Tabellen. Datumsangaben "20. November 2026" bzw. "20.11.2026". Prozent mit Leerzeichen ist ok ("12 %").
- Einheiten: metrisch zuerst, imperiale Angabe nur in Klammern, wenn sie im Original steht. Nie still umrechnen; wenn das Original nur imperial angibt, metrisch mit "ca." ergänzen und imperial in Klammern belassen.
- Währung: USD-Beträge bleiben USD (es sind Rechenbeispiele bzw. US-Quellen). Nicht in EUR umrechnen. Wo es ein reines Rechenbeispiel ohne Quelle ist, darf es USD bleiben.
- US-Recht und US-Normen (OSHA, NLRA, ANSI, NIST, CISA, SEC usw.) inhaltlich stehen lassen, aber als US-Kontext kennzeichnen ("in den USA schreibt die OSHA ... vor"). KEINE deutschen Paragraphen (ArbSchG, DGUV, BetrVG, NIS2-Umsetzung) neu als Fakt einfügen, außer sie stehen schon im Original. Stattdessen in den Prüfhinweisen einen Punkt "Für den deutschen Markt prüfen" mit den konkreten Stellen (z. B. Arbeitsschutz DGUV/ArbSchG, Mitbestimmung Betriebsrat §87 BetrVG, NIS2, CSRD/ESRS) als Aufgabe für die Fachprüfung.
- Stil: klar, konkret, kurze Absätze, Rechenbeispiele vollständig, keine Marketingfloskeln, keine KI-Phrasen ("in der heutigen schnelllebigen Welt", "eintauchen", "Gamechanger"), keine Gedankenstrich-Ketten. Sie-Form vermeiden, wo möglich neutral formulieren; wenn Anrede nötig, "Sie".
- Markierungen: "[unverified]" -> "[unbelegt]". "(planned)" -> "(geplant)".
- iFAKT: Offenlegung exakt "**Hinweis: Der Autor arbeitet bei der iFAKT GmbH.**" in jedem iFAKT-Abschnitt und in der Autorenbox. Keine Formulierung "gesponsert" oder "bezahlte Partnerschaft". Toulouse nie erwähnen. Sitz: Curiestraße 2, 70563 Stuttgart.
- Vollständigkeit: Jeder Abschnitt, jede Tabelle, jede Formel, jede FAQ des Originals kommt vor. Nichts kürzen, nichts zusammenfassen. Die deutsche Wortzahl liegt typischerweise bei 85 bis 100 % der englischen.
