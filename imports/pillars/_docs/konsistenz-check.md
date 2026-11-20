# Konsistenz-Check der zehn SEO-Pillar-Artikel (m365.fm)

Stand: 20.11.2026. Geprüft wurden alle zehn Markdown-Dateien in `/mnt/project-files/seo-pillars/` und die zugehörigen Claude Docs. Jede Änderung ist in Datei **und** Doc identisch umgesetzt. Jeder Artikel hat im Review-Protokoll (Datei und Doc) einen Absatz „Konsistenz-Check 20.11.2026“ erhalten.

## 1. Kanonische Slugs

Alle Slugs stammen aus der Metadaten-Tabelle (Zeile „Slug“) des jeweiligen Zielartikels. Alle Verweise in den zehn Artikeln nutzten bereits diese Slugs; abweichende Schreibweisen (z. B. `/learn/shopfloor-management/` oder `/learn/digitaler-zwilling/`) gab es nicht.

| Kompendium | Datei | Kanonischer Slug | Doc |
|---|---|---|---|
| Lean Management | lean-management.md | `/learn/lean-management/` | https://claude.ai/artifact/HKhsAXPvmeJk8CHKpPFGdq |
| Operational Excellence | operational-excellence.md | `/learn/operational-excellence/` | https://claude.ai/artifact/59q1PWXCcKNPyJcFSoLcvA |
| Wertstromanalyse | wertstromanalyse.md | `/learn/wertstromanalyse/` | https://claude.ai/artifact/1iqxpoPqZu4y7C187bMKEG |
| Digitaler Zwilling | digitaler-zwilling.md | `/learn/digital-twin/` | https://claude.ai/artifact/VqjeQnp7Zi2Az8E1bXu5De |
| Produktionsplanung und APS | produktionsplanung-aps.md | `/learn/produktionsplanung-aps/` | https://claude.ai/artifact/4rr9Zuash2aCY5DQxnm6Q3 |
| Shopfloor Management | shopfloor-management.md | `/learn/shop-floor-management/` | https://claude.ai/artifact/7z56RUJoAE1ZjHMbKtxVq7 |
| Produktionskennzahlen | produktionskennzahlen.md | `/learn/produktionskennzahlen/` | https://claude.ai/artifact/WPMAW23LiNy288cykFDu3Y |
| iFAKT Polaris | ifakt-polaris.md | `/learn/ifakt-polaris/` | https://claude.ai/artifact/TtyFLDRfp9ndmsdxKteKia |
| Manufacturing IT mit Azure | manufacturing-it-azure.md | `/learn/manufacturing-it-azure/` | https://claude.ai/artifact/6EgtnxGbUNfviCS7ZXB8WC |
| Produktionsplanung Luftfahrt | produktionsplanung-luftfahrt.md | `/learn/produktionsplanung-luftfahrt/` | https://claude.ai/artifact/4uDiPRhbLavkGJjGGwhxS5 |

**Regel für die Schwester-Listen:** Verweist Artikel A in seiner Liste auf B, nennt auch B den Artikel A. Daraus folgten zehn Ergänzungen (siehe Abschnitt 3). Alle Einträge bleiben als „geplant“ gekennzeichnet.

## 2. Prüfergebnis iFAKT-Fakten (eigene Prüfung am 20.11.2026)

| Angabe | Beleg | Ergebnis |
|---|---|---|
| Sitz | Impressum ifakt.de/de/imprint: „iFAKT GmbH, Curiestr. 2, 70563 Stuttgart“, Amtsgericht Stuttgart, HRB 22661, vertreten durch Jörg Drees. Kontaktseite: „Company headquarters“ Curiestraße 2, Stuttgart | **Stuttgart belegt.** |
| Leinfelden-Echterdingen | Kontaktseite ifakt.de/de/contact: „Subsidiary (On-site office)“, Stadionstraße 66, 70771 Leinfelden-Echterdingen | Niederlassung, nicht Sitz. In keinem Artikel genannt; kein Handlungsbedarf. |
| Toulouse seit 2013 | Nur auf der englischen Unternehmensseite ifakt.de/en/company/: „Since 2013 we have been present with a further location in Toulouse, France.“ Nicht auf Kontaktseite, Impressum, Startseite und nicht auf der m365.fm-Entitätsseite | **Nur Unternehmensangabe einer älteren Seite.** In Polaris und Kennzahlen als Angabe der Unternehmensseite gekennzeichnet; Luftfahrt-Prüfhinweis korrigiert. |
| Gründung 2001 | m365.fm-Entitätsseite („founded in 2001“); ZWF-Autorenbiografie (Paywall) laut Wertstromanalyse. ifakt.de nennt nur „über 25 Jahre“ | Unternehmensangabe; passt zu „über 25 Jahre“. Unverändert. |
| ca. 25 Mitarbeitende | nur m365.fm-Entitätsseite („about 25 (as of 2026-11)“) | Unternehmensangabe; in Lean und OpEx so gekennzeichnet. |
| ISO 9001 seit 10/2014 | ifakt.de/en/company/ | belegt |
| ISO/IEC 27001 | Startseite ifakt.de, Siegel „TÜV SÜD – ISO 9001 & ISO/IEC 27001 Certified“ | belegt |
| WiWo Best of Technology Award 2025 | award.wiwo.de/bot/gewinner-2025/: Kategorie Produktion 1. Skeleton, **2. iFAKT GmbH (Polaris IMS)**, 3. OMRON | **unabhängig belegt** (Lean- und OpEx-Prüfhinweise sagten „nicht gefunden“ → korrigiert) |
| AppSource Polaris VSM/BSM | AppSource-Einträge und Microsoft-Tech-Community-Beitrag (in Polaris, WSA, Shopfloor, Lean zitiert) | belegt |
| ECOWERT | WSA: 1.9.2021–31.8.2022, Volumen 500.000 € (Fraunhofer IPA). Polaris: einjährig bis 31.8.2022, rund 300.000 € Invest BW (Presseinformation) | widerspruchsfrei (Gesamtvolumen vs. Förderung). Unverändert. |
| Microsoft Gold Partner 2019 | ifakt.de/en/company/ | nur im Polaris-Artikel, dort korrekt als historischer Status eingeordnet |
| „AI + Digital Twin for Production“ (OpEx) | m365.fm-Entitätsseite enthält den Claim | belegt über die Entitätsseite; unverändert |

## 3. Änderungen je Artikel (Datei und Doc)

### Lean Management
- Autorenbox: „… **schreibt auf m365.fm über** Lean Management …“ → „… **ist Gastgeber von m365.fm und schreibt dort über** Lean Management …“
- Prüfhinweis 9: „eine unabhängige Bestätigung (z. B. Award-Seite der WirtschaftsWoche) wurde online nicht gefunden.“ → „der Award ist inzwischen auf der Gewinnerseite der WirtschaftsWoche bestätigt (award.wiwo.de/bot/gewinner-2025/, Kategorie Produktion, Platz 2 iFAKT GmbH; Konsistenz-Check 20.11.2026).“
- Review-Protokoll: Absatz „Konsistenz-Check 20.11.2026“ ergänzt.

### Operational Excellence
- Autorenbox: „schreibt auf m365.fm über“ → „ist Gastgeber von m365.fm und schreibt dort über“.
- Schwester-Pillars: ergänzt um „Manufacturing IT mit Azure: `/learn/manufacturing-it-azure/` (geplant)“.
- FAQ „Ist 85 % OEE Weltklasse?“: „Er ergibt sich etwa aus 90 % Verfügbarkeit, 95 % Leistung und 99 % Qualität (≈ 84,6 %), ein Beispiel, das auch das Lean Enterprise Institute verwendet [12].“ → „Häufig wird er aus 90 % Verfügbarkeit, 95 % Leistung und 99,9 % Qualität hergeleitet (≈ 85,4 %) und Nakajima zugeschrieben; eine Primärstelle dafür ist nicht belegt [ungeprüft]. Das Lean Enterprise Institute rechnet in seinem Lexikon ein ähnliches Beispiel mit 99 % Qualität (≈ 84,6 %), ohne es als Weltklasse-Wert zu bezeichnen [12].“ Grund: Das LEI-Lexikon zeigt 84,6 % nur als Rechenbeispiel ohne Weltklasse-Bezug (geprüft); Produktionskennzahlen nennt die verbreitete Herleitung 90/95/99,9 %.
- Quelle [30]: „(gesponserte Seite; Unternehmensangaben laut iFAKT …)“ → „(Unternehmensangaben laut iFAKT …)“.
- Prüfhinweis 3: „Diese Seite ist gesponsert und gibt Unternehmensangaben wieder; eine unabhängige Bestätigung (…) wurde online nicht gefunden.“ → „Diese Seite gibt Unternehmensangaben wieder. Unabhängig bestätigt sind inzwischen der Award (…), die AppSource-Einträge von Polaris VSM und BSM und das ISO-Siegel (…) auf ifakt.de; Gründung 2001 und Mitarbeiterzahl bleiben Unternehmensangaben.“
- Review-Protokoll: Absatz ergänzt.

### Wertstromanalyse
- Autorenbox: „… in Stuttgart und schreibt auf m365.fm über …“ → „… in Stuttgart. Er ist Gastgeber von m365.fm und schreibt dort über …“.
- Geplante Pillar-Pages: ergänzt um Operational Excellence (`/learn/operational-excellence/`) und Produktionsplanung in der Luftfahrt (`/learn/produktionsplanung-luftfahrt/`).
- Prüfhinweis „Geplante Pillar-Links“: dieselben zwei Slugs ergänzt.
- Review-Protokoll: Absatz ergänzt.

### Digitaler Zwilling
- Autorenbox: „schreibt auf m365.fm über die Digitalisierung …“ → „ist Gastgeber von m365.fm und arbeitet bei der iFAKT GmbH. Auf m365.fm schreibt er über die Digitalisierung …“.
- Geplante Schwester-Pillars: ergänzt um Produktionsplanung in der Luftfahrt (`/learn/produktionsplanung-luftfahrt/`).
- Review-Protokoll: Absatz ergänzt.

### Produktionsplanung und APS
- Autorenbox: „schreibt auf m365.fm über“ → „ist Gastgeber von m365.fm und schreibt dort über“.
- Geplante Schwester-Pillars: ergänzt um `/learn/manufacturing-it-azure/`: Manufacturing IT mit Azure.
- Review-Protokoll: Absatz ergänzt.

### Shopfloor Management
- Autorenbox: „… in Stuttgart und schreibt auf m365.fm über …“ → „… in Stuttgart. Er ist Gastgeber von m365.fm und schreibt dort über …“.
- Geplante Pillar-Pages: ergänzt um iFAKT Polaris (`/learn/ifakt-polaris/`).
- Prüfhinweis „Geplante Pillar-Links“: `/learn/ifakt-polaris/` ergänzt.
- Review-Protokoll: Absatz ergänzt.

### Produktionskennzahlen
- Autorenbox: „… in Stuttgart und schreibt auf m365.fm über …“ → „… in Stuttgart. Er ist Gastgeber von m365.fm und schreibt dort über …“.
- Abschnitt 19: „(seit 2013 zusätzlich mit einem Standort in Toulouse)“ → „(laut Unternehmensseite seit 2013 zusätzlich mit einem Standort in Toulouse)“.
- Weiterführende Kompendien: ergänzt um [Produktionsplanung und APS](https://www.m365.fm/learn/produktionsplanung-aps/) und [iFAKT Polaris](https://www.m365.fm/learn/ifakt-polaris/).
- Prüfhinweis „Schwester-Kompendien“: Slug-Liste um APS und Polaris ergänzt; „Hinweis: … der Slug lautet laut Briefing `/learn/shop-floor-management/`; bitte abgleichen.“ → „Der Slug `/learn/shop-floor-management/` ist laut Metadaten der Schwesterdatei bestätigt (Konsistenz-Check 20.11.2026).“
- Prüfhinweis „Offenlegung“: „Die Schwester-Kompendien verwenden noch „Bezahlte Partnerschaft“; Vereinheitlichung prüfen.“ → „Alle zehn Kompendien verwenden inzwischen dieselbe Kennzeichnung (Konsistenz-Check 20.11.2026).“
- Review-Protokoll: Absatz ergänzt.

### iFAKT Polaris
- Autorenbox: „schreibt auf m365.fm über Wertstrommanagement …“ → „ist Gastgeber von m365.fm und arbeitet bei der iFAKT GmbH. Auf m365.fm schreibt er über Wertstrommanagement …“.
- Abschnitt 10: „Die iFAKT GmbH sitzt in Stuttgart in der Nähe des Flughafens und betreibt seit 2013 einen zweiten Standort in Toulouse [4].“ → „Die iFAKT GmbH hat ihren Sitz in Stuttgart; nach Angabe ihrer englischen Unternehmensseite liegen die Büros in der Nähe des Flughafens, und seit 2013 besteht ein zweiter Standort in Toulouse [4].“
- Prüfhinweis „Interne Links“: „Slug `/learn/digital-twin/` vs. Dateiname `digitaler-zwilling.md` abgleichen.“ → „Slug `/learn/digital-twin/` laut Metadaten von `digitaler-zwilling.md` bestätigt (Konsistenz-Check 20.11.2026).“
- Review-Protokoll: Absatz ergänzt.

### Manufacturing IT mit Azure
- Geplante Kompendien: ergänzt um Produktionsplanung in der Luftfahrt (`/learn/produktionsplanung-luftfahrt/`).
- Autorenbox hatte die Grundaussage bereits („Gastgeber von m365.fm und arbeitet bei der iFAKT GmbH“); unverändert.
- Review-Protokoll: Absatz ergänzt.

### Produktionsplanung in der Luftfahrt
- Fünf relative Links → absolute URLs (Datei: `](/learn/…)` → `](https://www.m365.fm/learn/…)`; Doc: dort fehlten die Links, sie wurden mit denselben URLs gesetzt):
  - 5.2 „Produktionsplanung und APS“ → https://www.m365.fm/learn/produktionsplanung-aps/
  - 6.2 „Wertstromanalyse“ → https://www.m365.fm/learn/wertstromanalyse/
  - 11.3 „Produktionsplanung und APS“ → https://www.m365.fm/learn/produktionsplanung-aps/
  - 14.3 „Digitaler Zwilling“ → https://www.m365.fm/learn/digital-twin/
  - 14.3 „Manufacturing IT mit Azure“ → https://www.m365.fm/learn/manufacturing-it-azure/
- Autorenbox: „schreibt auf m365.fm über Produktionsplanung …“ → „ist Gastgeber von m365.fm und arbeitet bei der iFAKT GmbH. Auf m365.fm schreibt er über Produktionsplanung …“.
- Prüfhinweis 5 (Toulouse): „Ein Büro in Toulouse ließ sich auf ifakt.de (Startseite, Kontakt, Impressum) nicht verifizieren. …“ → „Korrigiert im Konsistenz-Check 20.11.2026: Die englische Unternehmensseite nennt einen Standort in Toulouse seit 2013 (Unternehmensangabe). Kontaktseite und Impressum führen ihn nicht; sie nennen den Sitz Curiestraße 2, 70563 Stuttgart (Amtsgericht Stuttgart, HRB 22661) und eine Niederlassung in Leinfelden-Echterdingen. …“
- Review-Protokoll: Absatz ergänzt.

### Geprüft ohne Änderungsbedarf
- **Offenlegung:** Alle zehn Artikel tragen genau „> **Hinweis: Der Autor arbeitet bei der iFAKT GmbH.**“ (Polaris unter der H1). Keine Autorenbox spricht von bezahlter Partnerschaft. Kein `rel="sponsored"` im Artikeltext; Erwähnungen von „Bezahlte Partnerschaft“ stehen nur noch in historischen Review-Protokollen (MIT, WSA) bzw. in Verneinungen („kein `rel="sponsored"`“).
- **OEE-Definition:** überall Verfügbarkeit × Leistung × Qualität.
- **Nakajima:** OEE erstmals 1982 in „TPM Tenkai“ (OpEx, laut Wikipedia geprüft); „Introduction to TPM“ 1988 (Kennzahlen) ist ein anderes Buch, kein Widerspruch.
- **Krafcik 1988** (Lean, OpEx), **Rother/Shook 1998** (DZ, WSA, Kennzahlen; Lean nennt nur den Shingo-Preis 1999), **Little 1961**, **Kingman 1961** (DZ, APS, Luftfahrt; Faktoren 4/9/19 identisch), **acht TPM-Säulen** (Lean, OpEx; gleiche Liste): einheitlich.
- **Microsoft-Status:** Digital Twin Builder bzw. digital twin builder in Fabric = Preview (DZ, MIT); Azure IoT Operations, Defender for IoT, IoT Central nur in MIT bzw. konsistent in Shopfloor; Dataverse for Teams (abgekündigt, Termine) und Power-BI-Seitenaktualisierung (30 min geteilte Kapazität) nur in Shopfloor. Keine Widersprüche.

## 4. Offene Punkte für die Redaktion

1. **m365.fm-Entitätsseite iFAKT** (https://www.m365.fm/entity/ifakt/) ist derzeit als „Sponsored“ / „Paid partnership with iFAKT GmbH“ gekennzeichnet und zeigt „Advertisement“-Banner. Das widerspricht Mirkos Bestätigung, dass iFAKT nicht zahlt. Alle Artikel verlinken die Seite, Lean und OpEx nutzen sie als Quelle. Kennzeichnung der Entitätsseite klären und angleichen.
2. **Toulouse:** Nur die ältere englische Unternehmensseite nennt den Standort. Bei iFAKT klären, ob er noch besteht; sonst die Angabe in Polaris (Abschnitt 10) und Produktionskennzahlen (Abschnitt 19) streichen. Bis dahin ist sie als Unternehmensangabe gekennzeichnet.
3. **Branchen:** Die englische Unternehmensseite nennt Automobil, Luft- und Raumfahrt, Maschinenbau und Medizintechnik (Polaris); Startseite und Entitätsseite nennen zusätzlich bzw. stattdessen Automatisierung sowie Energie und Infrastruktur (OpEx, APS). Beide Fassungen sind belegt; bei Bedarf auf die aktuelle Startseite vereinheitlichen.
4. **Gründung 2001 und ca. 25 Mitarbeitende** sind nicht auf ifakt.de belegt, nur über die Entitätsseite (Unternehmensangabe). Wertstromanalyse nennt die Gründung mit Verweis auf die ZWF-Autorenbiografie [18] (Paywall, im Polaris-Artikel nicht erneut geprüft). Wenn möglich, eine Belegseite auf ifakt.de anlegen lassen.
5. **85-%-OEE-Herleitung (90/95/99,9 %):** in Kennzahlen und OpEx als [ungeprüft] markiert; Originalstelle bei Nakajima einsehen.
6. **Autorenbox:** Werdegang, Funktion und Profilfoto fehlen weiterhin (Platzhalter in mehreren Artikeln). Die Offenlegungszeile ist sprachlich leicht unterschiedlich („arbeitet bei“, „ist beschäftigt“, „ist tätig“), inhaltlich aber gleich; bei der CMS-Übernahme auf eine Formulierung vereinheitlichen.
7. **Format der Schwester-Listen:** Acht Artikel führen die Slugs als Code ohne Link, Produktionskennzahlen und Polaris verlinken bereits absolut, Luftfahrt verlinkt im Fließtext. Beim Livegang einheitlich verlinken und „(geplant)“ entfernen.
8. **Defender for IoT:** Der Widerspruch zwischen Oktober 2029 (Azure Updates) und 31.05.2028 (Partnerblog) im MIT-Artikel bleibt offen (bestehender Prüfpunkt).
9. **ECOWERT:** Optional in Wertstromanalyse ergänzen, dass vom Volumen (500.000 €) rund 300.000 € Förderung über Invest BW stammen (Quelle: Presseinformation, wie im Polaris-Artikel [24]).
