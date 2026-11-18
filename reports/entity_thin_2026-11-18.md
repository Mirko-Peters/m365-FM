# Duenne Entitaetsseiten - Auswertung und Kostenschaetzung (18.11.2026)

Grundlage: data/entities.json (ohne Personen), Langtext aus `long.en` und data/entity_texts. Schwelle fuer Index per Langtext: 2500 Zeichen (LONG_INDEX_MIN).
Rangfolge = Zahl der Folgen, in denen Name/Alias vorkommt (+3 je Folge mit Treffer im Titel). Naeherung per Textsuche: allgemeine Woerter (access, project, teams) werden ueberzaehlt.

- Entitaeten unter 2500 Zeichen Langtext: **2011** (ohne jeden Langtext: 1605, mit Kurz-Ueberblick 800-1400 Zeichen: 406)
- davon in mindestens 20 Folgen: 285
- davon in mindestens 10 Folgen: 459
- davon in mindestens 3 Folgen: 878
- davon in mindestens 1 Folgen: 1354

## Kostenschaetzung (Batch-Preis, Sonnet 2/10 USD, Haiku 0,10/0,50 USD je 1 Mio. Token; kalibriert an `fill_entities.py plan`: 1.920 Texte = 7,4 USD)

| Umfang | A: Pipeline wie heute (150-300 Woerter, erreicht 2500 NICHT) en / +14 Sprachen | B: 2500+ Zeichen, mit Folgen-Auszuegen: en / en+de / +14 Sprachen | selbst geschrieben (API-Gegenwert) |
|---|---|---|---|
| Top 100 | 0.4 / 0.8 USD | 0.8 / 0.8 / 1.4 USD | ca. 1.8 USD |
| Top 285 (>=20 Folgen) | 1.1 / 2.3 USD | 2.1 / 2.3 / 4.0 USD | ca. 5.1 USD |
| Top 459 (>=10) | 1.8 / 3.7 USD | 3.4 / 3.7 / 6.4 USD | ca. 8.3 USD |
| 878 (>=3) | 3.4 / 7.1 USD | 6.6 / 7.0 / 12.2 USD | ca. 15.8 USD |
| alle 1.920 | 7.4 / 15.5 USD | 14.4 / 15.3 / 26.6 USD | ca. 34.6 USD |

Annahmen B: Eingabe ca. 2.500 Token (Fakten + 3 Folgen-Auszuege), Ausgabe ca. 1.000 Token; Uebersetzung je Sprache ca. 1.600 Token Ein, 1.500 Aus. Nicht im Preis: Pruefung durch einen zweiten Agenten.
Wichtig: Die Pipeline darf nur Fakten aus dem Auftrag nutzen. Fuer 2500+ Zeichen braucht es reichere Fakten (Folgen-Auszuege, Docs-Seiten), sonst kommt Fuelltext oder ein zu kurzer Text.

## Rangliste (Top 60)

| # | id | Typ | Folgen | Titel-Treffer | Langtext (Zeichen) |
|---|---|---|---|---|---|
| 1 | microsoft | org | 1129 | 465 | 1189 |
| 2 | azure | platform | 844 | 174 | 1067 |
| 3 | microsoft-365 | platform | 824 | 156 | 1137 |
| 4 | copilot | product | 557 | 191 | 1120 |
| 5 | microsoft-learn | product | 1032 | 6 | 0 |
| 6 | governance | concept | 787 | 75 | 1221 |
| 7 | teams | product | 864 | 46 | 264 |
| 8 | automation | concept | 848 | 36 | 1299 |
| 9 | access | product | 876 | 21 | 1365 |
| 10 | ai-agent | concept | 534 | 105 | 1311 |
| 11 | microsoft-entra | platform | 706 | 47 | 1066 |
| 12 | compliance | concept | 730 | 18 | 1185 |
| 13 | power-platform | platform | 576 | 50 | 300 |
| 14 | github-actions | product | 707 | 5 | 1223 |
| 15 | microsoft-forms | product | 665 | 6 | 1211 |
| 16 | microsoft-stream | product | 638 | 2 | 1201 |
| 17 | project | product | 611 | 6 | 1163 |
| 18 | sharepoint | product | 422 | 54 | 295 |
| 19 | fabric | platform | 262 | 94 | 1275 |
| 20 | graph | product | 403 | 37 | 993 |
| 21 | dynamics-365 | platform | 261 | 80 | 1349 |
| 22 | microsoft-search | product | 467 | 10 | 0 |
| 23 | microsoft-store | product | 464 | 0 | 1164 |
| 24 | modern-work | concept | 454 | 1 | 0 |
| 25 | power-bi | product | 271 | 53 | 330 |
| 26 | dashboards | concept | 387 | 8 | 0 |
| 27 | entra-id | product | 353 | 18 | 1117 |
| 28 | excel | product | 374 | 11 | 403 |
| 29 | prompt | concept | 373 | 7 | 1208 |
| 30 | agent-skill | concept | 379 | 4 | 1351 |
| 31 | visio | product | 359 | 5 | 1185 |
| 32 | power-automate | product | 256 | 26 | 289 |
| 33 | audit-logs | concept | 326 | 2 | 1121 |
| 34 | purview | product | 236 | 29 | 1152 |
| 35 | connector | concept | 289 | 9 | 1272 |
| 36 | azure-functions | product | 291 | 5 | 1291 |
| 37 | microsoft-surface | product | 303 | 1 | 1085 |
| 38 | power-apps | product | 171 | 40 | 280 |
| 39 | copilot-studio | product | 184 | 34 | 1069 |
| 40 | dataverse | product | 186 | 33 | 1245 |
| 41 | semantic-model | concept | 257 | 7 | 1210 |
| 42 | microsoft-lists | product | 242 | 9 | 1225 |
| 43 | microsoft-to-do | product | 256 | 2 | 1148 |
| 44 | defender | product | 185 | 23 | 1094 |
| 45 | continuous-improvement | concept | 247 | 1 | 0 |
| 46 | fabric-workspace | concept | 239 | 3 | 1203 |
| 47 | healthcare | industry | 232 | 0 | 0 |
| 48 | data-quality | concept | 217 | 2 | 0 |
| 49 | react | product | 208 | 3 | 0 |
| 50 | data-governance | concept | 207 | 3 | 1364 |
| 51 | dynamics-365-guides | product | 211 | 1 | 0 |
| 52 | microsoft-clarity | product | 213 | 0 | 0 |
| 53 | onedrive | product | 180 | 8 | 995 |
| 54 | m365fm | media | 203 | 0 | 1165 |
| 55 | conditional-access | concept | 184 | 5 | 1020 |
| 56 | dlp | concept | 190 | 2 | 1013 |
| 57 | least-privilege | concept | 187 | 0 | 0 |
| 58 | telemetry | concept | 172 | 5 | 0 |
| 59 | machine-learning | concept | 179 | 2 | 0 |
| 60 | hipaa | concept | 183 | 0 | 0 |

## Langtext-Modus (`fill_entities.py plan --rich`, Stand 18.11.2026)

- Auswahl: alle Nicht-Personen ohne redaktionellen Langtext, deren Langtext (Ueberblick oder KI-Text) unter 2500 Zeichen liegt.
- Quelle: Auszuege aus den Show Notes der Folgen (bis 5 Folgen, bis 3.600 Zeichen) + vorhandener Ueberblickstext + Kurzbeschreibung. Mindestens 1.800 Zeichen belegte Quelle noetig, sonst wird nicht aufgefuellt (kein Fuelltext).
- Ergebnis des Plans: **801 Entitaeten** haben genug Quelle; **1.043** nicht (`thin_source`). Kosten fuer die 801: Sonnet ca. 6,5 USD + Haiku (14 Sprachen) ca. 7,7 USD = **ca. 14,2 USD** (Batch-Preis).
- Pruefung je Text: mindestens 2.600 und hoechstens 6.500 Zeichen, Name kommt vor, keine URL, keine Superlative, keine Zahl, die nicht in den Quellen steht.
- Ein KI-Langtext ab 2.500 Zeichen ersetzt einen kuerzeren Ueberblickstext (GENTEXT); GENTEXT ab 2.500 Zeichen und redaktionelle Texte bleiben.
- Haiku-Grenze: 4 EUR je Lauf und 5 EUR je Tag -> die Uebersetzungen laufen ueber 2 Laeufe/Tage.
- Die 1.043 ohne Quelle brauchen zusaetzliche Quellen (Microsoft-Learn-Seite, Hersteller-Doku) oder bleiben duenn.
