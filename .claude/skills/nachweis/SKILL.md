---
name: nachweis
description: Erst beweisen, dann „erledigt“ melden. Nutzen, bevor Mirko oder dem Logbuch gemeldet wird, dass etwas fertig, behoben, gemergt, live oder geprüft ist – und vor jedem Squash-Merge.
---

# Nachweis vor „erledigt“

„Erledigt“ heißt: Es gibt einen Beleg, den jemand anderes nachprüfen kann. Ohne Beleg heißt der Stand „gebaut, noch nicht bestätigt“.

## Welcher Beleg für welche Aussage
| Aussage | Beleg |
|---|---|
| Code funktioniert | Testausgabe mit Anzahl (z. B. `worker 729/729`, `16 passed`) |
| PR ist bereit | alle Checks grün inklusive Seitenbau-Probelauf, Gegenprüfung „bereit“, Befunde behoben oder begründet abgelehnt |
| Gemergt | Merge-SHA auf main |
| Deployt | grüner Lauf von `worker.yml` / `sitewrk.yml` / `site.yml` mit Lauf-ID |
| Live | `url-peek.yml`-Ausgabe oder Header (`x-m365-src`, `x-m365-sitemaps`) der echten Adresse |
| Schneller | Vorher/Nachher aus `crp-check.yml` (Median), gleiche Seiten, gleiche Form (mobil/desktop) |
| Daten richtig | Stichprobe mit Zahl und Fehlerquote (z. B. 25 Kanten, 20 % falsch) |
| Secret gesetzt | nur indirekt: der Lauf, der es braucht, ist grün bzw. die Warnung „fehlt“ ist weg – nie den Wert ansehen oder ausgeben |

## Regeln
- Behauptungen von Unteragenten sind keine Belege. Wichtige Aussagen selbst nachprüfen (Log lesen, Test laufen lassen, Diff ansehen).
- Teilweise erledigt ehrlich melden: was belegt ist, was noch läuft, was blockiert ist.
- Fehlgeschlagene Tests oder rote Läufe mit der Ausgabe melden, nicht beschönigen.
- Keine Tests abschalten, überspringen oder lockern, um grün zu werden.
- Squash-Merge: eigene `commit_message` (deutsch, ohne Modellnamen, ohne `[skip ci]`) mit Abschnitt „Nach Prüfung:“, der die Belege nennt.

## Meldung an Mirko
Kurz, deutsch, mit Beleg in einem Halbsatz. Beispiel: „#502 gemergt (CI grün inkl. Seitenbau-Probelauf, Tests 24/24); 301 auf /entity/oauth/ prüfe ich nach dem nächsten Seitenbau.“
