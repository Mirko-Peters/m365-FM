# SEO-Metadaten

| Feld | Wert |
|---|---|
| Meta-Title | Nachhaltige Produktion: Energie, Scope 1-3 und Lean (51 Zeichen) |
| Meta-Description | Nachhaltige Produktion für Werksleiter: Energie pro Stück, CO2e nach Scope 1-3, CO2 im Wertstrom, Regeln 2026 (SEC, SB 253, CSRD, CBAM), Programme. (149 Zeichen) |
| Slug | `/learn/operational-excellence/nachhaltige-produktion/` (vollständige URL: https://www.m365.fm/learn/operational-excellence/nachhaltige-produktion/) |
| Parent-Pillar | [Operational Excellence](https://www.m365.fm/learn/operational-excellence/) |
| Hauptkeyword | nachhaltige Produktion |
| Nebenkeywords | Energieeffizienz Produktion, Energieeffizienz in der Industrie, Scope 1 2 3 Emissionen, CO2-Fußabdruck Produkt, Energie pro Stück, Energieintensität, Energieleistungskennzahl (EnPI), energetische Ausgangsbasis, CO2 im Wertstrom, Lean and Green, ISO 50001, Energiemanagementsystem, Druckluftleckagen, CSRD Zulieferer, CBAM Exporteure, Grundlast senken |
| Suchintention | Informational mit praktischer Ebene "Wie setze ich das in meinem Werk um?" (Werksleitung, Produktionsleitung, Umwelt-/Arbeitsschutz- und Energieverantwortliche, KVP-Ingenieure) |
| Wortzahl | 4.715 Wörter (`wc -w` H1 bis Fazit; englische Fassung: 4.977) |
| Sprachversion | `de-DE`. hreflang-Paar: `de-DE` https://www.m365.fm/learn/operational-excellence/nachhaltige-produktion/ <-> `en-US` https://www.m365.fm/en/learn/operational-excellence/sustainable-manufacturing/ |

# Hinweis zur Wettbewerbsanalyse

Die Wettbewerbsanalyse der englischen Fassung bezieht sich auf google.com (USA). Für google.de steht ein eigener SERP-Check (z. B. mit NEURONwriter) noch aus.

---

# Nachhaltige Produktion: Ein Leitfaden für Werksleiter zu Energie pro Stück, Scope 1-3 und Lean

*Stand: 20. November 2026 · Lesezeit: etwa 20 Minuten*

*Ein Cluster-Artikel des m365.fm-Leitfadens [Operational Excellence](https://www.m365.fm/learn/operational-excellence/).*

> **Kurzantwort:** Nachhaltige Produktion heißt nach der Definition der US-Umweltbehörde EPA, Produkte mit wirtschaftlich tragfähigen Prozessen herzustellen, die negative Umweltwirkungen minimieren und dabei Energie und natürliche Ressourcen schonen [1]. Im Werk läuft das auf drei messbare Größen hinaus: Energie pro Gutteil, Treibhausgasemissionen nach Scope und Materialverluste wie Ausschuss. Alle drei reagieren auf dieselben Lean- und TPM-Werkzeuge, die ohnehin im Einsatz sind.

> **Das Wichtigste in Kürze**
> - Mit der Energie pro Gutteil beginnen, normalisiert auf die Menge. Monatliche kWh-Rohwerte täuschen, weil ein großer Teil der Werksenergie feste Grundlast ist.
> - Scope 1 (selbst verbrannte Brennstoffe) und Scope 2 (zugekaufter Strom und Dampf) sind mit Emissionsfaktoren der EPA eine Tabellenübung. Scope 3 braucht Lieferantendaten und dauert länger.
> - Ausschuss ist ein CO2-Multiplikator. Im Wertstrombeispiel unten senkt eine Ausbeutesteigerung bei einem Beschichtungsschritt von 92 % auf 98 % das CO2 pro Gutteil um etwa 6 %, ohne eine einzige Energieanlage anzufassen.
> - US-Bundesregeln sind auf dem Rückzug (die SEC hat im Mai 2026 vorgeschlagen, ihre Klimaregel aufzuheben), aber die Berichtspflicht nach Kaliforniens SB 253 für Scope 1 und 2 gilt seit November 2026, und EU-Kunden reichen Datenanfragen aus CSRD und CBAM weiter die Lieferkette hinunter.
> - Es gibt kostenlose Unterstützung, in den USA etwa das DOE-Programm 50001 Ready, Better Plants, die von Hochschulen betriebenen Industrial Training and Assessment Centers und die NIST-MEP-Zentren.

Dieser Artikel ist ein Cluster des Leitfadens [Operational Excellence](https://www.m365.fm/learn/operational-excellence/) auf m365.fm. Der Pillar erklärt, wie ein Werk ein Managementsystem für kontinuierliche Verbesserung aufbaut. Diese Vertiefung wendet das System auf Energie und CO2 an: wie man beides pro Stück misst, wo sich die Verluste im Wertstrom verstecken, welche Regeln 2026 zählen und wie man die ersten 90 Tage ohne eigene Nachhaltigkeitsabteilung angeht.

## Inhaltsverzeichnis

1. [Was nachhaltige Produktion auf dem Shopfloor bedeutet](#was-nachhaltige-produktion-auf-dem-shopfloor-bedeutet)
2. [Warum das 2026 zählt: Kosten, Kunden und Regeln](#warum-das-2026-zählt-kosten-kunden-und-regeln)
3. [Scope 1, 2 und 3 übersetzt auf ein Werk](#scope-1-2-und-3-übersetzt-auf-ein-werk)
4. [Rechenbeispiel 1: Energie pro Stück und die Grundlastfalle](#rechenbeispiel-1-energie-pro-stück-und-die-grundlastfalle)
5. [Rechenbeispiel 2: CO2e pro Stück für Scope 1 und 2](#rechenbeispiel-2-co2e-pro-stück-für-scope-1-und-2)
6. [Rechenbeispiel 3: CO2 entlang des Wertstroms](#rechenbeispiel-3-co2-entlang-des-wertstroms)
7. [Wo Werke Energie verlieren: Lean-Verschwendungen mit Energiebrille](#wo-werke-energie-verlieren-lean-verschwendungen-mit-energiebrille)
8. [Normen und kostenlose US-Programme](#normen-und-kostenlose-us-programme)
9. [Ein 90-Tage-Plan und Vorlagen](#ein-90-tage-plan-und-vorlagen)
10. [Typische Fehler](#typische-fehler)
11. [FAQ](#faq-nachhaltige-produktion)
12. [Fazit](#fazit)

## Was nachhaltige Produktion auf dem Shopfloor bedeutet

Die oben zitierte EPA-Definition hat drei Teile: wirtschaftlich tragfähige Prozesse, geringere Umweltwirkung und Schonung von Energie und Ressourcen [1]. Die EPA-Seite ist inzwischen ein archivierter Stand der Behördenwebsite vom 19. Januar 2025. Sie dient deshalb als Referenzdefinition, nicht als aktive Programmseite [1].

Für die Werksleitung wird aus der Definition eine kurze Liste zählbarer Dinge:

| Dimension | Was gemessen wird | Typische Einheit | Lean-Bezug |
|---|---|---|---|
| Energie | Strom, Erdgas, Dampf, Druckluft | kWh, MMBtu, kBtu pro Gutteil | Warten, Überbearbeitung, Leerlauf |
| Emissionen | CO2e nach Scope 1, 2 und 3 | Tonnen CO2e, kg CO2e pro Gutteil | folgt Energie- und Materialeinsatz |
| Material | Ausschuss, Nacharbeit, Verpackung, Ausbeute | % Erstdurchlaufquote (First Pass Yield), kg pro Stück (Original: lb) | Fehler, Überproduktion |
| Wasser | Entnahme und Einleitung | Liter pro Stück (Original: gallons) | Überbearbeitung (Spülen, Kühlen) |
| Gefährliche Abfälle | regulierte Abfallströme | kg pro Monat (Original: lb) | Fehler, Bestand (abgelaufenes Material) |

Die Forschung nennt die Schnittmenge dieser Ziele mit Lean "Lean and Green"; ein systematischer Review im *Journal of Cleaner Production* gibt einen Überblick über den Stand dieser Literatur [2]. Das Sustainable Value Stream Mapping (Sus-VSM) von Faulkner und Badurdeen ergänzt das klassische Wertstromdiagramm um ökologische und soziale Kennzahlen, darunter Energie- und Materialeinsatz [3]. Das Lean & Environment Toolkit der EPA geht denselben Weg: Es behandelt das Erkennen von Umweltverschwendung, Wertstromanalyse, Kaizen-Workshops und 6S (5S plus Sicherheit) und zielt auf Verschwendung bei Energie, Wasser und Material [4].

In der Praxis heißt das, den vorhandenen Werkzeugen eine Zeile für Energie und CO2 hinzuzufügen: dem Wertstromdiagramm, dem täglichen Shopfloor-Board, dem Kaizen-Auftrag und dem Kennzahlenbaum aus dem Leitfaden [Produktionskennzahlen](https://www.m365.fm/learn/produktionskennzahlen/).

## Warum das 2026 zählt: Kosten, Kunden und Regeln

**Kosten.** Energie ist ein steuerbarer Kostenblock. Die Industrial Training and Assessment Centers (ITAC) des US-Energieministeriums DOE melden durchschnittlich empfohlene Einsparungen von 144.582 USD pro Jahr und Bewertung, über 23.240 Bewertungen in ihrer Datenbank [5]. Das ist ein Durchschnitt der Empfehlungen, nicht der realisierten Einsparungen, zeigt aber die Größenordnung, die eine kostenlose Bewertung üblicherweise findet.

**Kunden.** Große Kunden, die ihre eigenen Scope-3-Emissionen berichten, fragen bei Lieferanten Daten auf Produkt- oder Werksebene an. Die Datenanfrage kommt oft, bevor überhaupt ein Gesetz für den Lieferanten selbst gilt.

**Regeln.** Die Rechtslage hat sich zwischen 2024 und Ende 2026 stark verändert. Hier der Stand zum 20. November 2026:

| Regel | Wer betroffen ist | Stand (20. November 2026) | Was ein Werk tun sollte |
|---|---|---|---|
| Klimaberichtsregeln der US-Börsenaufsicht SEC (verabschiedet im März 2024) | bei der SEC registrierte Unternehmen | ausgesetzt seit 4. April 2024; die SEC beschloss am 27. März 2025, die Regeln nicht weiter zu verteidigen; der Eighth Circuit setzte das Verfahren am 12. September 2025 aus; am 29. Mai 2026 schlug die SEC vor, die Regeln vollständig aufzuheben [6] | für die Regel selbst nichts. Börsennotierte Muttergesellschaften berichten ggf. freiwillig oder nach anderen Regimen |
| Kalifornien SB 253 (Climate Corporate Data Accountability Act) | US-Unternehmen mit Geschäftstätigkeit in Kalifornien und mehr als 1 Mrd. USD Jahresumsatz | die ersten Durchführungsbestimmungen der Behörde CARB wurden am 12. Oktober 2026 genehmigt; der erste Bericht zu Scope 1 und 2 war am 10. November 2026 fällig [7]. Am 9. November 2026 ließ der Ninth Circuit in einer Eilentscheidung die Berichtspflicht für Scope 1 und 2 bestehen und hielt Scope 3 für wahrscheinlich verfassungswidrig [8] | wenn die eigene Gruppe betroffen ist: Scope-1- und -2-Daten je Werk, dokumentierte Methoden. Zeitpunkt für Scope 3 hängt vom Bezirksgericht ab |
| Kalifornien SB 261 (klimabezogene Finanzrisiken) | Unternehmen mit mehr als 500 Mio. USD Umsatz und Geschäftstätigkeit in Kalifornien | Durchsetzung ausgesetzt; der Ninth Circuit hält einen Verstoß gegen den First Amendment (Meinungsfreiheit) für wahrscheinlich (vorläufige Entscheidung) [8] | Verfahren beobachten; derzeit nichts auf Werksebene |
| EU-CSRD nach der Omnibus-I-Richtlinie | EU-Unternehmen mit mehr als 1.000 Beschäftigten und mehr als 450 Mio. EUR Nettoumsatz; Nicht-EU-Gruppen mit mehr als 450 Mio. EUR EU-Umsatz und einer EU-Tochter oder -Niederlassung über 200 Mio. EUR | Omnibus I am 26. Februar 2026 im EU-Amtsblatt veröffentlicht, in Kraft seit 18. März 2026; Umsetzung durch die Mitgliedstaaten bis 19. März 2027. Anfragen an Unternehmen der Wertschöpfungskette mit weniger als 1.000 Beschäftigten sind begrenzt [9] | US-Gruppen mit großem EU-Umsatz prüfen die Schwellen. Kleinere Lieferanten können mit weniger, aber nicht mit null Datenanfragen rechnen |
| EU-CBAM (CO2-Grenzausgleich) | EU-Importeure von Zement, Eisen und Stahl, Aluminium, Düngemitteln, Strom und Wasserstoff | endgültiges System seit 1. Januar 2026; Importeure von 50 Tonnen oder weniger pro Jahr sind befreit (nicht bei Strom und Wasserstoff); Zertifikate ab Februar 2027 erhältlich; erste Jahreserklärung für Importe 2026 fällig am 30. September 2027 [10] | US-Exporteure betroffener Waren: damit rechnen, dass der EU-Importeur Emissionsdaten auf Anlagenebene anfragt |

Zwei Lehren für die Produktionsleitung. Erstens ist die Bundesregel nicht mehr der Treiber; das sind Kalifornien, die EU und Kundenverträge. Zweitens beginnt jedes dieser Regime mit Scope-1- und -2-Daten, die ein Werk aus Energierechnungen und Brennstoffaufzeichnungen erzeugen kann. Diese Arbeit lohnt sich, egal was vor Gericht passiert.

Die Tabelle ist eine Momentaufnahme, keine Rechtsberatung. Den Anwendungsbereich für die eigenen Gesellschaften rechtlich bestätigen lassen.

## Scope 1, 2 und 3 übersetzt auf ein Werk

Das GHG Protocol definiert Scope 1 als Emissionen aus Tätigkeiten, die das berichtende Unternehmen besitzt oder kontrolliert, Scope 2 als Emissionen aus der Erzeugung von zugekauftem oder bezogenem Strom, Dampf, Wärme oder Kälte, die das Unternehmen verbraucht, und Scope 3 als alle übrigen indirekten Emissionen der Wertschöpfungskette, aufgeteilt in 15 Kategorien [11].

| Scope | Quellen im Werk | Vorhandene Daten | Typischer Datenverantwortlicher |
|---|---|---|---|
| Scope 1 | Erdgas für Kessel, Öfen, Härteöfen; Propan für Stapler; Diesel für Notstromaggregate und Feuerlöschpumpen; Kältemittelverluste; Prozessemissionen | Gasrechnungen, Brennstoffeinkauf, Wartungsprotokolle für Kältemittel | Facility Management / Instandhaltung |
| Scope 2 | zugekaufter Strom, zugekaufter Dampf oder Kaltwasser | Stromrechnungen, Lastgangdaten | Facility Management / Finanzen |
| Scope 3 | zugekaufte Materialien und Teile, eingehende und ausgehende Fracht, extern entsorgte Abfälle, Geschäftsreisen, Arbeitswege der Beschäftigten, Nutzung und Lebensende verkaufter Produkte | Einkaufsmengen nach Material, Frachtrechnungen, Abfallbegleitscheine | Einkauf / Logistik / Umwelt- und Arbeitsschutz |

Für Scope 2 verlangt die Scope 2 Guidance des GHG Protocol eine "duale Berichterstattung", wo vertragliche Instrumente existieren: einen standortbasierten Wert (location-based) mit durchschnittlichen Netzemissionsfaktoren des Standorts und einen marktbasierten Wert (market-based) mit Emissionsfaktoren aus den Verträgen, unter denen der Strom bezogen wird, etwa Zertifikate oder Direktverträge [12]. Ein Werk, das Herkunftsnachweise für erneuerbare Energie kauft, weist zwei verschiedene Scope-2-Zahlen aus. Beide sind richtig; sie beantworten unterschiedliche Fragen.

Für ein einzelnes Werk ist Scope 3 meist der größte und ungenaueste Teil. Eine pragmatische Reihenfolge: zuerst zugekaufte Materialien nach Gewicht (Stahl, Aluminium, Kunststoffgranulat, Verpackung), dann Fracht, dann Abfall. Lieferantenspezifische Daten verwenden, wo Lieferanten sie liefern können, und Durchschnittsfaktoren, wo nicht, und kennzeichnen, was was ist.

## Rechenbeispiel 1: Energie pro Stück und die Grundlastfalle

*Veranschaulichendes Beispiel mit fiktiven Werten.* Ein Werk für Metallteile verfolgt den Strom pro Stück. Zwei Monate:

| Monat | Gutteile | Strom (MWh) | kWh pro Stück |
|---|---|---|---|
| März | 180.000 | 1.180 | 6,56 |
| April | 220.000 | 1.320 | 6,00 |

Der April sieht 8,5 % besser aus. Hat sich das Werk verbessert? Feste und variable Energie trennen:

- Variable Energie pro Stück = (1.320 − 1.180) MWh ÷ (220.000 − 180.000) Stück = 140 MWh ÷ 40.000 = **3,5 kWh pro Stück**
- Feste Grundlast = 1.180 MWh − (180.000 × 3,5 kWh) = 1.180 − 630 = **550 MWh pro Monat**

47 % des Märzstroms (550 ÷ 1.180) hingen also nicht von der Ausbringung ab: Kompressoren, die Druck halten, Lüftung und Klima, Beleuchtung, Maschinen im Leerlauf, warmgehaltene Öfen. Die "Verbesserung" im April ist vor allem Menge, die die Grundlast verteilt. Auf dem Shopfloor hat sich nichts geändert.

Mit 12 oder mehr Monatswerten statt einer Zwei-Punkt-Schätzung eine lineare Regression der Energie über der Ausbringung rechnen (und über Heiz- oder Kühlgradtagen, wenn das Wetter eine Rolle spielt). Dann jeden Monat den Istwert mit dem Erwartungswert aus dem Modell vergleichen:

- Erwartete Energie im Mai bei 200.000 Stück = 550 + 200.000 × 0,0035 = **1.250 MWh**
- Tatsächliche Energie im Mai = 1.205 MWh → **45 MWh (3,6 %) echte Einsparung**

Das ist die Logik hinter einer energetischen Ausgangsbasis (Energy Baseline) und Energieleistungskennzahlen (EnPIs) in einem Energiemanagementsystem nach dem Muster der ISO 50001 [13]. Eine CUSUM-Karte (kumulierte Summe) von "Ist minus Erwartung" zeigt, wann eine Änderung gegriffen hat und ob sie hält, sobald das Regressionsmodell selbst stabil ist.

**Was mit den 550 MWh Grundlast tun:** an einem Sonntag ohne Produktion durch das Werk gehen und die Zähler ablesen. Jedes kW, das noch läuft, ist entweder notwendig (Sicherheitssysteme, Kühlräume, Server) oder Verschwendung. Dieser Rundgang findet oft die günstigsten Einsparungen des Jahres.

## Rechenbeispiel 2: CO2e pro Stück für Scope 1 und 2

*Veranschaulichendes Beispiel, Fortsetzung.* Im Mai verbrauchte das Werk 1.250 MWh Strom und 3.000 MMBtu Erdgas (MMBtu = eine Million British Thermal Units, rund 293 kWh) für 200.000 Gutteile.

**Scope 1 (Erdgas).** Der GHG Emission Factors Hub 2025 der EPA nennt für Erdgas 53,06 kg CO2 pro MMBtu, dazu 1,0 g CH4 und 0,10 g N2O pro MMBtu [14].

- 3.000 MMBtu × 53,06 kg = 159.180 kg = **159,2 Tonnen CO2**
- CH4 und N2O: 3 kg CH4 und 0,3 kg N2O. Selbst nach Multiplikation mit ihrem Treibhauspotenzial machen sie hier nur einen Bruchteil eines Prozents aus. In ein formales Inventar gehören sie hinein; für eine erste Schätzung kann man sie vernachlässigen.

**Scope 2 (Strom, standortbasiert).** eGRID2023 der EPA (Revision 2, Juni 2025) nennt als US-Durchschnitt eine Gesamtemissionsrate von 767,2 lb CO2 pro MWh (ca. 348 kg) [15].

- 1.250 MWh × 767,2 lb = 959.000 lb ÷ 2.204,6 lb pro Tonne = **435,0 Tonnen CO2**

Für ein echtes Inventar den eGRID-Faktor der Subregion des Werksstandorts verwenden, nicht den Landesdurchschnitt. Regionale Faktoren unterscheiden sich stark. Für den marktbasierten Wert den Faktor des Versorgers bzw. Vertrags verwenden [12].

**Pro Stück.**

- Summe Scope 1 + 2 = 159,2 + 435,0 = 594,2 Tonnen CO2
- Pro Gutteil = 594.200 kg ÷ 200.000 = **2,97 kg CO2 pro Stück**

Um Strom für eine Gesamtenergieintensität in dieselbe Energieeinheit wie Gas umzurechnen, 3.412 Btu pro kWh ansetzen: 1.250 MWh = 4.265 MMBtu. Gesamtenergie am Standort = 7.265 MMBtu oder **36,3 kBtu pro Stück** (ca. 10,6 kWh).

Strom und Gas trotzdem getrennt auf dem Board führen. Sie haben unterschiedliche Emissionsfaktoren, unterschiedliche Preise und unterschiedliche Verantwortliche.

## Rechenbeispiel 3: CO2 entlang des Wertstroms

Werkssummen sagen, wie viel Energie man verbraucht; eine Wertstromsicht sagt, wo. Das Lean-&-Environment-Schulungsmaterial der EPA nutzt das Wertstromdiagramm als den Ort, an dem Umweltdaten ergänzt werden [16], und Sus-VSM fügt unter jedem Prozesskasten Zeilen für Energie und Material hinzu [3].

*Veranschaulichendes Beispiel mit fiktiven Werten.* Ein Halter durchläuft fünf Schritte. Die Energie wird je bearbeitetem Teil an jedem Schritt gemessen (einschließlich Leerlauf während der Schicht, geteilt durch die bearbeiteten Teile), zum Beispiel mit einem Unterzähler oder einem Zangen-Leistungslogger für eine Woche je Maschine. Die Erstdurchlaufquote ist der Anteil der Teile, die an den nächsten Schritt weitergehen; Ausschussteile sind verloren. Nachgearbeitete Teile bleiben hier der Einfachheit halber außen vor; in der Realität verbrauchen auch sie Energie.

| Schritt | Strom je bearbeitetem Teil (kWh) | Gas je bearbeitetem Teil (kBtu) | Erstdurchlaufquote |
|---|---|---|---|
| 1 Sägen | 0,40 | 0 | 99,0 % |
| 2 CNC-Bearbeitung | 2,10 | 0 | 97,0 % |
| 3 Wärmebehandlung (Gasofen) | 0,60 | 25 | 98,0 % |
| 4 Pulverbeschichtung (gasbeheizter Einbrennofen) | 0,80 | 12 | 92,0 % |
| 5 Montage und Prüfung | 0,50 | 0 | 99,5 % |

**Schritt 1: Teile, die je ausgeliefertem Gutteil in jeden Schritt hineingehen müssen.** Vom Ende rückwärts rechnen. Eingang eines Schritts = benötigter Ausgang ÷ Ausbeute.

- Schritt 5: 1 ÷ 0,995 = 1,005
- Schritt 4: 1,005 ÷ 0,92 = 1,092
- Schritt 3: 1,092 ÷ 0,98 = 1,115
- Schritt 2: 1,115 ÷ 0,97 = 1,149
- Schritt 1: 1,149 ÷ 0,99 = 1,161

**Schritt 2: CO2 pro Gutteil je Prozess.** Strom mit 0,348 kg CO2 pro kWh (767,2 lb/MWh [15]); Gas mit 53,06 kg CO2 pro MMBtu, also 0,05306 kg pro kBtu [14].

| Schritt | Eingangsteile je Gutteil | kWh je Gutteil | Gas kBtu je Gutteil | kg CO2 je Gutteil | Anteil |
|---|---|---|---|---|---|
| 1 Sägen | 1,161 | 0,46 | 0 | 0,16 | 4 % |
| 2 CNC | 1,149 | 2,41 | 0 | 0,84 | 22 % |
| 3 Wärmebehandlung | 1,115 | 0,67 | 27,9 | 1,71 | 44 % |
| 4 Pulverbeschichtung | 1,092 | 0,87 | 13,1 | 1,00 | 26 % |
| 5 Montage | 1,005 | 0,50 | 0 | 0,17 | 4 % |
| **Summe** | | **4,92** | **41,0** | **3,89** | 100 % |

**Was das Diagramm zeigt:**

1. **Der Hotspot ist die Wärmebehandlung** (44 %), getrieben vom Gas. Ofenbeladung, Türöffnungszeit, Haltetemperatur am Wochenende und Brennereinstellung sind die Hebel.
2. **Ausschuss ist ein CO2-Multiplikator.** Bei 100 % Ausbeute überall würde der Halter 3,49 kg CO2 verursachen. Ausbeuteverluste fügen 0,39 kg hinzu, also 11 %.
3. **Qualität ist ein CO2-Projekt.** Steigt die Ausbeute der Beschichtung von 92 % auf 98 %, sinkt die Summe von 3,89 auf 3,66 kg CO2 pro Gutteil, etwa 6 %, weil jedes ausgesonderte beschichtete Teil die Energie von Sägen, Bearbeitung und Wärmebehandlung mitgetragen hat. Ein Six-Sigma- oder [Poka-Yoke](https://www.m365.fm/learn/lean-management/poka-yoke/)-Projekt an der Beschichtungslinie hat eine energetische Amortisation, die niemand in den Projektauftrag geschrieben hat.
4. **Überproduktion wirkt genauso.** Zu früh gefertigte Teile verbrauchen trotzdem die volle Energiekette, und manche davon werden obsolet.

Diese beiden Zeilen (kWh und kg CO2e pro Gutteil) unter die Zeitlinie des Ist-Wertstromdiagramms setzen. Der Leitfaden [Wertstromanalyse](https://www.m365.fm/learn/wertstromanalyse/) erklärt das Grunddiagramm; die Energiezeilen sind eine Erweiterung derselben Datenaufnahme.

## Wo Werke Energie verlieren: Lean-Verschwendungen mit Energiebrille

Die Tabelle ordnet den klassischen Verschwendungsarten ihre Wirkung auf Energie und Material zu. Sie ist eine redaktionelle Zuordnung für die Praxis, keine Taxonomie aus einer Norm.

| Lean-Verschwendung | Wirkung auf Energie und Umwelt | Beispiel im Werk | Erste Gegenmaßnahme |
|---|---|---|---|
| Warten | Maschinen und Öfen stehen bei voller Temperatur oder vollem Druck im Leerlauf | Einbrennofen bleibt während eines zweistündigen Materialengpasses auf ca. 204 °C (400 °F) | Leerlauf- und Standby-Modi in der Standardarbeit; Abschalt-Checkliste |
| Fehler | Energie und Material aller vorgelagerten Schritte gehen verloren | ausgesonderte beschichtete Teile (Beispiel oben) | Ursachenanalyse, Poka-Yoke |
| Überproduktion | Energie für Teile, die noch niemand braucht | Los gefertigt, "damit die Presse ausgelastet ist" | Pull-System und Kanban |
| Überbearbeitung | engere Toleranzen, längere Zyklen, mehr Spülgänge als nötig | Wärmebehandlungszyklus 20 % länger als spezifiziert | Zyklus gegen die Spezifikation validieren |
| Bestand | beheizte und beleuchtete Lagerfläche, ablaufendes Material, Nacharbeit | klimatisierte Lagerung von Sicherheitsbestand, den niemand nutzt | Bestand richtig dimensionieren |
| Bewegung und Transport | Kraftstoff und Batterieenergie der Stapler | Propanstapler auf langen Wegen | Layout, Milkruns |
| Ungenutztes Talent | Werker sehen Leckagen und leerlaufende Maschinen jeden Tag | kein Kanal für Energieideen | Energiepunkt auf dem täglichen Board und im Kaizen |

**Druckluft verdient eine eigene Zeile.** Die Compressed Air Challenge berichtet, dass Leckagen 20 bis 30 % der Kompressorleistung verschwenden können und dass proaktive Leckageortung und -reparatur die Leckagen auf unter 10 % der Leistung bringen kann [17].

*Veranschaulichende Leckagerechnung (fiktive Werte):* Beim Sonntagsrundgang, bei abgeschalteter Produktion, zieht der Kompressor noch 45 kW. Diese Last besteht aus Leckagen plus etwaigem berechtigtem Bedarf (hier mit null angenommen).

- Leckageenergie pro Jahr = 45 kW × 8.760 Stunden = 394.200 kWh (Leckagen laufen immer, wenn das System unter Druck steht, also auch während der Produktion)
- Kosten bei angenommenen 0,09 USD pro kWh = **35.478 USD pro Jahr**
- CO2 bei 0,348 kg pro kWh = **137 Tonnen pro Jahr**
- Ein Leckageprogramm, das die Leckagelast um zwei Drittel senkt, spart etwa 23.650 USD und 91 Tonnen pro Jahr. Bei 15.000 USD Aufwand (etwa 5.000 USD Investition für ein Ultraschall-Leckortungsgerät, der Rest laufende Kosten für Markierungsanhänger, Arbeitszeit und Verschraubungen) liegt die einfache Amortisationszeit bei etwa 7,6 Monaten.

Je Anlage messen, nicht je Person: Energiedaten sollen auf Maschinen und Abläufe zeigen, nicht auf einzelne Werker. Die Leckagereparatur braucht Lockout/Tagout (Freischalten und Sichern) und ein sicheres Verfahren zum Druckablassen. Sie gehört mit derselben Sorgfalt wie jeder andere Auftrag in den Instandhaltungsplan, und Werker sollten Leckagen im Rahmen der autonomen Instandhaltung markieren, wie im geplanten Leitfaden [TPM und OEE](https://www.m365.fm/learn/tpm-oee/) beschrieben.

## Normen und kostenlose US-Programme

| Programm oder Norm | Was es ist | Kosten und Aufwand | Am besten geeignet für |
|---|---|---|---|
| ISO 50001 | freiwillige internationale Norm für Energiemanagementsysteme; Zertifizierung durch Dritte möglich [13][20] | Zertifizierungsaudits; interner Aufwand für Ausgangsbasis, EnPIs, Ziele, Bewertungen | Werke, die ein zertifiziertes System wollen oder deren Kunden danach fragen |
| DOE 50001 Ready | Anerkennung des US-Energieministeriums für ein an ISO 50001 ausgerichtetes Energiemanagementsystem: 25 Aufgaben im Online-Tool 50001 Ready Navigator, danach Selbsterklärung; kein Drittaudit, und laut DOE kein Zertifizierungsprogramm [13] | kostenlos; interner Aufwand | Werke, die die Struktur der ISO 50001 ohne Zertifizierungskosten wollen |
| DOE Better Plants | freiwillige Partnerschaft; Partner verpflichten sich, die Energieintensität über 10 Jahre in ihren US-Betrieben um 25 % zu senken, und können Ziele für Wasser, Abfall und CO2 ergänzen; das DOE meldet über 315 Industrieunternehmen und kumulierte Einsparungen von 14,1 Mrd. USD und 2,8 Quads Energie [18] | kostenlos; jährliche Berichterstattung | Unternehmen mit mehreren Werken und einer Selbstverpflichtung auf Konzernebene |
| DOE Industrial Training and Assessment Centers (ITAC) | kostenlose Bewertungen durch Hochschulteams; Voraussetzungen: US-Hersteller, jährliche Energiekosten von 100.000 bis 3,5 Mio. USD, Umsatz unter 250 Mio. USD, höchstens ca. 240 km (150 miles) von einem Zentrum entfernt [5] | kostenlos; ein Werksbesuch plus Bericht | kleine und mittlere Werke |
| EPA Lean & Environment Toolkit | Anleitung, um Umweltverschwendung in Wertstromanalyse, Kaizen und 6S aufzunehmen [4][16] | kostenlos | Lean-Teams, die eine Umweltperspektive ergänzen wollen |
| NIST-MEP-Zentren | das nationale Netzwerk Manufacturing Extension Partnership; lokale Zentren bieten Verbesserungsleistungen an, oft auch Energie- und Lean-Projekte [19] | kostenpflichtig, oft gefördert | kleine Hersteller, die praktische Unterstützung brauchen |

Ein sinnvoller Weg für ein einzelnes US-Werk: ITAC-Bewertung (wenn berechtigt) → Aufgaben von 50001 Ready → Zertifizierung nach ISO 50001 nur, wenn Kunden oder Konzernvorgaben sie verlangen.

## Ein 90-Tage-Plan und Vorlagen

**90-Tage-Plan für ein Werk**

| Wochen | Maßnahme | Ergebnis | Verantwortlich |
|---|---|---|---|
| 1 bis 2 | 24 Monate Energierechnungen, Brennstoffaufzeichnungen und monatliche Gutmengen sammeln | Datentabelle | Werkscontroller + Facility Management |
| 3 bis 4 | Regression Energie über Ausbringung; Grundlastrundgang an einem produktionsfreien Tag | energetische Ausgangsbasis, Grundlastliste | Energieverantwortlicher + Instandhaltung |
| 5 bis 6 | Scope-1- und -2-Berechnung mit EPA-Faktoren; Kennzahlen pro Stück auf dem Werksboard | erstes CO2e-Inventar | Umwelt-/Arbeitsschutz + Controller |
| 7 bis 8 | Energiezeilen im Ist-Wertstromdiagramm der wichtigsten Produktfamilie | CO2-Hotspot je Prozess | KVP-Ingenieur |
| 9 bis 10 | Zwei Kaizen-Workshops: Druckluftleckagen und der Hotspot-Prozess | kWh vorher/nachher, Amortisation | Teamleiter + Werker |
| 11 bis 12 | Monatlicher Energie-Review in der Produktionsbesprechung; Lastgangdaten vom Versorger oder von Unterzählern fließen in den Historian oder das BI-Tool; ITAC beantragen oder 50001 Ready starten | Standardroutine | Werksleitung + IT/OT |

**Vorlage: monatliches Energie- und CO2-Board**

| Kennzahl | Formel | Ziel | Ist | Trend |
|---|---|---|---|---|
| Strom pro Gutteil | kWh ÷ Gutteile | aus Ausgangsbasis | | |
| Gas pro Gutteil | kBtu ÷ Gutteile | aus Ausgangsbasis | | |
| Ist- vs. erwartete Energie | Ist-MWh − Modell-MWh | ≤ 0 | | CUSUM |
| Grundlastanteil | feste MWh ÷ gesamte MWh | sinkend | | |
| Scope 1 + 2 CO2e pro Gutteil | (Brennstoff × Faktor + kWh × Faktor) ÷ Gutteile | sinkend | | |
| Erstdurchlaufquote am Hotspot-Schritt | gut ÷ Eingang | steigend | | |
| Offene Energiemaßnahmen | Anzahl, Alter | < 10, keine > 60 Tage | | |

**Vorlage: Datenanfrage an Lieferanten (Scope 3, zugekaufte Waren)**

| Feld | Beispieleintrag |
|---|---|
| Material- oder Teilenummer | Aluminiumstange 6061, Teil 4711 |
| Jährliche Einkaufsmenge | 120 Tonnen |
| Lieferantenspezifischer Emissionsfaktor vorhanden? | ja / nein |
| Wenn ja: kg CO2e pro kg, Systemgrenze (cradle-to-gate), Methode, Jahr | 9,1 kg CO2e/kg, cradle-to-gate, verifiziert 2025 (Beispielwert) |
| Wenn nein: verwendeter Durchschnittsfaktor, Quelle | benannte Datenbank und Version |
| Rezyklatanteil | 35 % |
| Ansprechpartner und Datum | Name, Datum |

Die Anfrage kurz halten. Ein einseitiges Formular wird beantwortet; ein Fragebogen mit 40 Fragen wird ignoriert.

## Typische Fehler

| Fehler | Warum er schadet | Abhilfe |
|---|---|---|
| kWh pro Stück ohne Mengennormalisierung berichten | Mengenschwankungen sehen aus wie Verbesserungen oder Rückschritte | Regressions-Ausgangsbasis, Ist gegen Erwartung |
| Für jedes Werk den Landesdurchschnitt des Netzfaktors verwenden | Scope 2 liegt in CO2-armen oder CO2-reichen Regionen weit daneben | eGRID-Faktor der Subregion; marktbasierter Wert aus Verträgen |
| Nachhaltigkeit als reines Umwelt-/Arbeitsschutzthema behandeln | Energie geht in der Produktion verloren: Leerlauf, Ausschuss, Rüstvorgänge | Energie auf das tägliche Board und in den Kennzahlenbaum |
| Mit Scope 3 beginnen | monatelange Datenjagd vor der ersten Einsparung | zuerst Scope 1 und 2, dann die drei größten Scope-3-Kategorien |
| Zertifikate kaufen, bevor Leckagen behoben sind | die marktbasierte Zahl sinkt, Kosten und Energie nicht | zuerst Effizienz, dann Beschaffung |
| Ausschuss in der CO2-Betrachtung ignorieren | Qualitätsprojekten fehlt ihr Energienutzen | CO2e pro Gutteil, nicht pro bearbeitetem Teil |
| Kein Verantwortlicher für die Grundlast | Wochenendlasten bleiben jahrelang an | benannter Verantwortlicher, Abschalt-Checkliste, monatlicher Grundlast-Review |
| Die Belegschaft ignorieren | Werker wissen, wo die Verschwendung ist | Energieideen im Vorschlagswesen, Anerkennung |

## FAQ: nachhaltige Produktion

### Was ist nachhaltige Produktion?

Die EPA definiert sie als Herstellung von Produkten mit wirtschaftlich tragfähigen Prozessen, die negative Umweltwirkungen minimieren und dabei Energie und natürliche Ressourcen schonen [1]. In der Praxis verfolgen Werke die Energie pro Gutteil, Treibhausgasemissionen nach Scope und Materialverluste.

### Was sind Beispiele für nachhaltige Produktion?

Druckluftleckagen beheben, Öfen und Härteöfen bei langen Stillständen abschalten, die Erstdurchlaufquote erhöhen, um Ausschuss zu senken, Wärmerückgewinnung aus Kompressoren oder Öfen, effiziente Motoren und Antriebe, Einsatz von Rezyklat und überarbeitete Verpackung. Die besten Beispiele verbinden eine Kosteneinsparung mit einem kleineren Fußabdruck.

### Was sind die Herausforderungen nachhaltiger Produktion?

Im Werk ist selten die Idee das Schwierige, sondern Messung und Verantwortung. Typische Hürden sind Energiedaten ohne Mengennormalisierung, falsche Emissionsfaktoren, Scope-3-Daten, deren Erhebung Monate dauert, Grundlasten ohne Verantwortlichen und Nachhaltigkeit als Umwelt-/Arbeitsschutzthema, während die Energie in der Produktion verloren geht. Die Tabelle der typischen Fehler nennt für jede Hürde eine Abhilfe. Günstige erste Projekte, etwa die Reparatur von Druckluftleckagen, helfen, wo das Investitionsbudget knapp ist.

### Was sind Scope-1-, -2- und -3-Emissionen in der Produktion?

Scope 1 umfasst am Standort verbrannte Brennstoffe und andere direkte Emissionen, etwa Erdgas in Kesseln und Öfen. Scope 2 umfasst zugekauften Strom, Dampf, Wärme und Kälte. Scope 3 umfasst den Rest der Wertschöpfungskette, etwa zugekaufte Materialien, Fracht und die Nutzung verkaufter Produkte, in 15 Kategorien [11].

### Wie berechnet man die Energie pro Stück?

Den Energieverbrauch durch die im selben Zeitraum produzierten Gutteile teilen. Weil viel Werksenergie feste Grundlast ist, die Ist-Energie mit dem Erwartungswert aus einer Regression der Energie über der Ausbringung vergleichen. Im Beispiel oben betrug die Grundlast 550 MWh pro Monat und der variable Anteil 3,5 kWh pro Stück.

### Ist Lean Manufacturing nachhaltig?

Weitgehend, weil dieselben Verschwendungen (Fehler, Überproduktion, Warten) auch Energie und Material verbrauchen; die in [2] ausgewertete Lean-and-Green-Literatur baut auf dieser Schnittmenge auf. Lean allein kann Energie aber übersehen, deshalb Energie- und CO2-Zeilen in Wertstromdiagramme und Boards aufnehmen.

### Was sind die drei Säulen nachhaltiger Produktion?

Ökologie, Ökonomie und Soziales. Die EPA-Definition deckt die ersten beiden direkt ab (wirtschaftlich tragfähige Prozesse mit geringerer Umweltwirkung) [1]. Die soziale Säule umfasst Arbeitssicherheit, Qualifizierung und das Umfeld des Werks.

### Gilt die Klimaberichtsregel der SEC für mein Unternehmen?

Stand November 2026: nein. Die Regeln sind seit April 2024 ausgesetzt, die SEC hat ihre Verteidigung im März 2025 eingestellt und am 29. Mai 2026 die Aufhebung vorgeschlagen [6]. Kaliforniens SB 253 und EU-Regeln können für die eigene Gruppe dennoch gelten.

### Wer muss nach dem kalifornischen SB 253 berichten?

US-Unternehmen mit Geschäftstätigkeit in Kalifornien und mehr als 1 Mrd. USD Jahresumsatz. Die Berichte zu Scope 1 und 2 waren erstmals am 10. November 2026 fällig [7]. Eine Eilentscheidung des Ninth Circuit vom 9. November 2026 ließ Scope 1 und 2 bestehen und hielt Scope 3 für wahrscheinlich verfassungswidrig [8].

### Müssen US-Hersteller die CSRD erfüllen?

Nur große Gruppen. Nach der Omnibus-I-Richtlinie fallen Nicht-EU-Gruppen in den Anwendungsbereich, wenn sie mehr als 450 Mio. EUR EU-Umsatz und eine EU-Tochter oder -Niederlassung über 200 Mio. EUR haben [9]. Kleinere US-Lieferanten sehen vor allem Datenanfragen von EU-Kunden.

### Betrifft CBAM US-Exporteure?

Indirekt. Die Pflichten liegen bei EU-Importeuren von Zement, Eisen und Stahl, Aluminium, Düngemitteln, Strom und Wasserstoff oberhalb von 50 Tonnen pro Jahr [10]. US-Hersteller dieser Waren sollten Emissionsdaten auf Anlagenebene für ihre EU-Kunden vorbereiten.

### Lohnt sich eine Zertifizierung nach ISO 50001?

Das hängt davon ab, wer sie verlangt. Wenn Kunden oder Konzernvorgaben eine Zertifizierung fordern, ja. Wenn nicht, bietet das kostenlose US-Programm 50001 Ready des DOE dieselbe Managementstruktur ohne Drittaudits [13].

## Fazit

Nachhaltige Produktion ist Operational Excellence, angewandt auf Energie, CO2 und Material. Mit Zahlen beginnen, die schon vorliegen: Zwei Jahre Energierechnungen und Ausbringung ergeben eine Ausgangsbasis, eine Grundlastzahl und die Scope-1- und -2-Emissionen pro Stück. Wer Energiezeilen in das Wertstromdiagramm aufnimmt, stellt meist fest, dass der größte CO2-Hebel ein Qualitäts- oder Flussproblem ist, keine neue Maschine.

Die US-Regeln haben sich 2025 und 2026 von der Bundesebene hin zu Bundesstaaten und Kundenanforderungen verschoben, und die EU hat die CSRD auf große Unternehmen eingegrenzt. Die Arbeit auf Werksebene bleibt dieselbe: pro Gutteil messen, die Grundlast angehen, Ausschuss senken und Energie mit den Leuten, die die Anlagen fahren, zum Teil der täglichen Routine machen.

## Weiterlesen auf m365.fm

**Parent-Pillar**
- [Operational Excellence: der vollständige Leitfaden](https://www.m365.fm/learn/operational-excellence/)

**Schwester-Cluster (geplant)**
- [Resiliente Lieferketten](https://www.m365.fm/learn/operational-excellence/resiliente-lieferketten/) (geplant)
- [Qualifikationsmatrix, Mitarbeiterqualifizierung und TWI](https://www.m365.fm/learn/operational-excellence/qualifikationsmatrix/) (geplant)

**Verwandte Leitfäden**
- [Lean Management](https://www.m365.fm/learn/lean-management/)
- [Wertstromanalyse](https://www.m365.fm/learn/wertstromanalyse/)
- [Produktionskennzahlen](https://www.m365.fm/learn/produktionskennzahlen/)
- [TPM und OEE](https://www.m365.fm/learn/tpm-oee/) (geplant)
- [Poka-Yoke und Fehlervermeidung](https://www.m365.fm/learn/lean-management/poka-yoke/) (geplant)
- [Kaizen und Kaizen-Workshops](https://www.m365.fm/learn/lean-management/kaizen/) (geplant)
- [Predictive Maintenance und IIoT](https://www.m365.fm/learn/predictive-maintenance-iiot/) (geplant)
- [Manufacturing IT mit Azure](https://www.m365.fm/learn/manufacturing-it-azure/)

---

# Autorenbox

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** ist Host von m365.fm und arbeitet bei der iFAKT GmbH. Auf m365.fm schreibt er über Operational Excellence, Lean Management und die digitale Transformation der Produktion. [Redaktion: Rolle, Kurzbiografie und Foto ergänzen.]

**Hinweis: Der Autor arbeitet bei der iFAKT GmbH.**

# Quellen

Alle Quellen geöffnet und geprüft am 20. November 2026.

1. US EPA: "Sustainable Manufacturing" (archivierter Stand der EPA-Website vom 19. Januar 2025; Seite zuletzt aktualisiert am 16. Dezember 2024). https://19january2025snapshot.epa.gov/sustainability/sustainable-manufacturing
2. Garza-Reyes, J. A.: "Lean and green – a systematic review of the state of the art literature". *Journal of Cleaner Production* 102 (2015), S. 18–29. DOI: 10.1016/j.jclepro.2015.04.064
3. Faulkner, W.; Badurdeen, F.: "Sustainable Value Stream Mapping (Sus-VSM): methodology to visualize and assess manufacturing sustainability performance". *Journal of Cleaner Production* 85 (2014), S. 8–18. DOI: 10.1016/j.jclepro.2014.05.042
4. US EPA: "Lean & Environment Toolkit: Preface" (Kapitel zu Umweltverschwendung, VSM, Kaizen, 6S). https://www.epa.gov/lean/lean-environment-toolkit-preface
5. Industrial Training and Assessment Centers (ITAC), Programmseite des DOE (Voraussetzungen, durchschnittlich empfohlene Einsparungen, Bewertungsdatenbank). https://itac.university/ (Weiterleitungsziel von https://manufacturing.gov/programs/industrial-training-and-assessment-centers-itac)
6. US SEC: "SEC Proposes Rescission of Climate-Related Disclosure Rules", Pressemitteilung 2026-49, 29. Mai 2026. https://www.sec.gov/newsroom/press-releases/2026-49-sec-proposes-rescission-climate-related-disclosure-rules
7. Proskauer: "California Climate Disclosure Regulations Finalized Ahead of November 10, 2026 Reporting Deadline", 16. Oktober 2026. https://www.proskauer.com/alert/california-climate-disclosure-regulations-finalized-ahead-of-november-10-2026-reporting-deadline
8. Crowell & Moring: "Ninth Circuit Declines to Halt CARB's Scope 1 and 2 Disclosure Requirements, Finds Scope 3 and SB 261 Likely Unconstitutional", 9. November 2026. https://www.crowell.com/en/insights/client-alerts/ninth-circuit-declines-to-halt-carbs-scope-1-and-2-disclosure-requirements-finds-scope-3-and-sb-261-likely-unconstitutional
9. Latham & Watkins: "EU Sustainability Omnibus Published in the Official Journal" (2026). https://www.lw.com/en/insights/EU-Sustainability-Omnibus-Published-in-the-Official-Journal
10. Deutsche Emissionshandelsstelle (DEHSt, die deutsche CBAM-Behörde): "CBAM Definitive Regime from 01/01/2026". https://www.dehst.de/EN/Topics/CBAM/CBAM-definitive-regime-2026/cbam-definitive-regime-2026_artikel.html
11. GHG Protocol: "Corporate Standard Frequently Asked Questions" (Scope-Definitionen, 15 Scope-3-Kategorien). https://ghgprotocol.org/corporate-standard-frequently-asked-questions
12. GHG Protocol: *Scope 2 Guidance* (Abschnitt 1.5.1 duale Berichterstattung; Tabelle 4.1 standortbasierte und marktbasierte Methode). https://ghgprotocol.org/sites/default/files/2023-03/Scope%202%20Guidance.pdf
13. US DOE Better Buildings Solution Center: "About 50001 Ready" (25 Aufgaben, Navigator, Selbsterklärung, Ausrichtung an ISO 50001, kein Zertifizierungsprogramm). https://betterbuildingssolutioncenter.energy.gov/iso-50001/50001Ready/about
14. US EPA: "GHG Emission Factors Hub 2025" (Tabelle 1 stationäre Verbrennung; Tabelle 6 Strom). https://origin-awswest-www.epa.gov/system/files/documents/2025-01/ghg-emission-factors-hub-2025.pdf
15. US EPA: "eGRID Summary Data" (eGRID2023, Revision 2 vom 12. Juni 2025; US-Gesamtemissionsrate CO2 767,209 lb/MWh). https://www.epa.gov/egrid/summary-data
16. US EPA: "Lean and Environment Training Modules" (E3-Programm; Modul 3 Wertstromanalyse). https://www.epa.gov/node/88573
17. Compressed Air Challenge: "Fact Sheet 7: Compressed Air System Leaks" (aktualisiert 2026). https://www.compressedairchallenge.org/data/sites/1/media/library/factsheets2026/fact-sheet-7-compressed-air-system-leaks_updated2026.pdf
18. US DOE Better Buildings Solution Center: "About Better Plants". https://betterbuildingssolutioncenter.energy.gov/better-plants/about
19. NIST MEP: Seite "Supply Chain" (Leistungen der MEP-Zentren und Verzeichnis der Zentren). https://www.nist.gov/mep/supply-chain
20. US DOE Better Buildings Solution Center: "ISO 50001 Frequently Asked Questions" (9. April 2019; ANAB akkreditiert Zertifizierungsstellen, deren ISO-50001-Auditoren die Konformität bewerten; Zertifizierung optional; energetische Ausgangsbasis und Energieleistungskennzahlen als Umsetzungsschritte). https://betterbuildingssolutioncenter.energy.gov/iso-50001/iso-50001-frequently-asked-questions

---

# Prüfhinweise für die Redaktion

## URL, Canonical und hreflang

- Cluster-URL verschachtelt unter dem Parent-Pillar: `/learn/operational-excellence/nachhaltige-produktion/`; im CMS bestätigen.
- hreflang-Paar `de-DE` (diese Seite) <-> `en-US` (https://www.m365.fm/en/learn/operational-excellence/sustainable-manufacturing/), jeweils selbstreferenzierendes Canonical. In der englischen Fassung das hreflang-Paar nachtragen.

## Offene Punkte und [unbelegt]-Stellen

1. **Regeltabelle** (Stand 20. November 2026): SEC, SB 253/261, CSRD und CBAM ändern sich schnell; jede Zeile vor Veröffentlichung neu prüfen. SB 253/261 stützen sich auf Kanzlei-Mitteilungen [7][8], nicht auf CARB-Seiten; CSRD auf eine Kanzlei-Zusammenfassung [9]; ggf. die Richtlinie in EUR-Lex zitieren. Die Entscheidung des Ninth Circuit ist vorläufig.
2. **CBAM-Datenanfragen:** "damit rechnen, dass der EU-Importeur Emissionsdaten auf Anlagenebene anfragt" ist redaktioneller Rat, keine zitierte Regel.
3. **ISO 50001:** aktuelle Ausgabe (ISO 50001:2018 und ggf. Änderung) nicht bestätigt; im ISO-Katalog prüfen.
4. **Better-Plants-Zahlen** [18] stammen von einer DOE-Seite mit Stand 4. Januar 2022; aktuellen Fortschrittsbericht prüfen. **ITAC-Durchschnitt** [5] ist als *empfohlene* Einsparung gekennzeichnet.
5. **Rechenbeispiele:** alle Werkswerte fiktiv und gekennzeichnet. Ergänzte reine Einheitenumrechnungen in der deutschen Fassung: MMBtu ≈ 293 kWh, 36,3 kBtu ≈ 10,6 kWh, 400 °F ≈ 204 °C, 150 miles ≈ 240 km; "lb" und "gallons" in der Kennzahlentabelle auf kg bzw. Liter umgestellt, Original in Klammern.
6. **Tabelle Lean-Verschwendungen/Energie:** redaktionelle Zuordnung, so gekennzeichnet.
7. **Kein iFAKT-Abschnitt** im Artikeltext; die Offenlegung "**Hinweis: Der Autor arbeitet bei der iFAKT GmbH.**" steht nur in der Autorenbox. Kein Sponsoring-Hinweis.

## Interne Links

- Parent: https://www.m365.fm/learn/operational-excellence/ (erste 150 Wörter und "Weiterlesen").
- Schwester-Cluster: https://www.m365.fm/learn/operational-excellence/resiliente-lieferketten/, https://www.m365.fm/learn/operational-excellence/qualifikationsmatrix/
- Im Text: produktionskennzahlen, wertstromanalyse, lean-management/poka-yoke (geplanter Cluster), tpm-oee (geplanter Pillar). "Weiterlesen" ergänzt lean-management, lean-management/kaizen, predictive-maintenance-iiot, manufacturing-it-azure. "(geplant)" nur bei noch nicht veröffentlichten deutschen Zielen.

## Empfohlene Grafiken

1. Regressionsdiagramm: monatliche Energie über Gutteilen mit Grundlast-Achsenabschnitt (550 MWh) und dem Maipunkt unter der Linie.
2. Wertstromdiagramm des Halters mit kWh- und kg-CO2-Zeilen unter jedem Prozesskasten, Hotspot Wärmebehandlung hervorgehoben.
3. Wasserfall: 3,49 kg (ohne Ausschuss) → 3,89 kg (aktuelle Ausbeuten) → 3,66 kg (Beschichtung bei 98 %).
4. Zeitstrahl der Regeln 2024 bis 2027 (SEC, SB 253/261, CSRD-Omnibus, CBAM).

## JSON-LD-Vorschlag

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "headline": "Nachhaltige Produktion: Ein Leitfaden für Werksleiter zu Energie pro Stück, Scope 1-3 und Lean",
      "inLanguage": "de-DE",
      "author": {"@type": "Person", "name": "Mirko Peters", "url": "https://www.m365.fm/entity/mirko-peters/"},
      "publisher": {"@type": "Organization", "name": "m365.fm", "url": "https://www.m365.fm/"},
      "datePublished": "2026-11-20",
      "dateModified": "2026-11-26",
      "mainEntityOfPage": "https://www.m365.fm/learn/operational-excellence/nachhaltige-produktion/",
      "isPartOf": {"@type": "Article", "url": "https://www.m365.fm/learn/operational-excellence/"},
      "about": {"@type": "Thing", "name": "Nachhaltige Produktion"}
    },
    {"@type": "FAQPage", "inLanguage": "de-DE", "mainEntity": "[alle 12 FAQ-Fragen als Question mit acceptedAnswer; Antworttext ohne [n]-Verweise]"},
    {"@type": "BreadcrumbList", "itemListElement": ["Startseite", "Learn", "Operational Excellence", "Nachhaltige Produktion"]}
  ]
}
```

## Für den deutschen Markt prüfen

- Der Artikel ist stark US-geprägt (EPA-Faktoren, eGRID, DOE-Programme, SEC, Kalifornien). Für die Fachprüfung: Soll eine deutsche Ergänzung kommen, etwa Netzemissionsfaktor des Umweltbundesamts statt eGRID, Energieeffizienzgesetz (EnEfG) und Energieauditpflicht nach EDL-G, Förderprogramme (BAFA/KfW, Bundesförderung Energie- und Ressourceneffizienz), CSRD-Umsetzung in deutsches Recht und ESRS? Nichts davon wurde neu als Fakt eingefügt; jeweils mit Beleg ergänzen.
- CBAM: Die DEHSt ist bereits Quelle [10]; prüfen, ob die deutsche Seite der DEHSt statt der englischen verlinkt werden soll.
- Einheiten: MMBtu/kBtu sind im deutschen Markt unüblich; prüfen, ob die Rechenbeispiele zusätzlich in kWh (Hs/Hi) angegeben werden sollen.
- Kannibalisierung: Der Parent-Pillar erwähnt Nachhaltigkeit nur am Rande; keine Überschneidung.

## Fachliche Prüfung

Fachliche Prüfung (9-köpfiges Expertenpanel, mehrere Runden) siehe englische Fassung; die deutsche Fassung ist eine Übertragung ohne inhaltliche Änderungen.
