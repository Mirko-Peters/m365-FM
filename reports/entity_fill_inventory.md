# Entitaeten fuellen - Bestandsaufnahme (9.11.2026, ohne API)

2197 Repo-Entitaeten (data/entities.json, guest_entities.json, speaker_entities.json). Seiten je Entitaet: 15 Sprachen = 32955 Seiten.

## Noindex- und Duenn-Regeln (site_entities.py)
- Sprachen ausser en/de: Entitaetsseite immer noindex (`lang not in (en, de)`), bis Uebersetzungen angezeigt werden - betrifft 13 Sprachen x 2197 = 28561 Seiten (Absicht, bis Text da ist).
- de: noindex, wenn kein echter deutscher Text (`desc.de` fehlt/gleich en, kein `long.de`, kein GENTEXT.de).
- Personen (ausser Autor): noindex, wenn `desc.en` <= 80 Zeichen oder Speaker-Schablone, kein `long.en`, keine Zitate und < 2 Auftritte (`_thin`; gilt fuer en und de).
- Ohne Index (Absicht, nicht angefasst): Blogbeitraege unter 10 Upvotes, Tag-/Suche-/Rechts-/Community-Seiten, Profile ausser en, Gaeste-Verzeichnis ausser en/de.
- Verzeichnis-Seiten (site_directory.py `_indexable`): Land/Stadt/Thema brauchen >= 3 bzw. 5 Eintraege und >= 150 Woerter eigenen Text; data/directory_intros.json hat 1 Seite (country:de, nicht freigegeben, 4 Eintraege), members_export.json 3 Personen + 3 Firmen -> alle Detailseiten noindex. Nicht Teil dieser Pipeline (eigene Mitglieder-Daten).
- Profile (site_members.py): ausser en immer noindex (Absicht).

## Zahlen je Typ (en)

| Typ | Anzahl | desc.en fehlt | desc.en <80 | desc.de fehlt | long fehlt | nur KI-Ueberblick (GENTEXT) | Person duenn/noindex |
|---|---|---|---|---|---|---|---|
| concept | 1051 | 20 | 2 | 972 | 995 | 52 | 0 |
| product | 688 | 27 | 9 | 534 | 570 | 98 | 0 |
| person | 319 | 7 | 13 | 180 | 319 | 0 | 109 |
| cert | 58 | 0 | 5 | 8 | 8 | 50 | 0 |
| org | 35 | 1 | 2 | 32 | 32 | 2 | 0 |
| industry | 13 | 0 | 0 | 0 | 13 | 0 | 0 |
| job | 12 | 0 | 0 | 0 | 12 | 0 | 0 |
| category | 9 | 0 | 9 | 0 | 0 | 9 | 0 |
| platform | 8 | 0 | 0 | 0 | 0 | 7 | 0 |
| event | 3 | 0 | 0 | 2 | 2 | 1 | 0 |
| media | 1 | 0 | 0 | 0 | 0 | 1 | 0 |

## Auswahl der Pipeline

Schreiben (en, Sonnet): product 578, cert 13, concept 996, org 32, event 2, industry 13, job 12, category 9, person 317 = 1972
Uebersprungen: sponsored 9, needs_source 2

## Fehlende Sprachtexte (Entitaeten mit offenem Text je Sprache)

| Sprache | offen |
|---|---|
| de | 1972 |
| fr | 2186 |
| es | 2186 |
| it | 2186 |
| nl | 2186 |
| pt | 2186 |
| pl | 2186 |
| id | 2186 |
| ru | 2186 |
| uk | 2186 |
| ar | 2186 |
| he | 2186 |
| ja | 2186 |
| ko | 2186 |

Kostenschaetzung Rest (Batch): 17.08 USD (Schreiben 7.6, Uebersetzen 9.48); Details `python fill_entities.py plan`.
Maschinenliste: data/entity_fill/todo.json
