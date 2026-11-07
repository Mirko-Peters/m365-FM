# MVP-Tracker (App 2) – Klickdummy

Entwürfe aus dem Design-Canvas „M365.FM MVP-Tracker – Clickdummy“ (https://claude.ai/artifact/CsbpTTvFZSfBoTBASQmQ4V). Stand: 4.11.2026.
Je Datei ein Screen (390 × 844), Stil wie die Seite.

| Datei | Funktion |
|---|---|
| Main.dc.html | Übersicht: Programme (MVP, MCT, Nerdio NVP, SAP Champion), offene Portal-Einträge, Monatsziel |
| Program-Detail.dc.html | Programm: Verlängerung, Checkliste, Erinnerungen, was zählt |
| Contributions.dc.html | Beiträge, automatisch gesammelt (M365.FM, YouTube, Blog, GitHub; Contribution Collector #172) |
| Contribution-Detail.dc.html | Felder fertig fürs MVP-Portal zum Kopieren, „Im Portal eingetragen“, zählt für Programme |
| Add.dc.html | Beitrag erfassen per Foto (Badge, Agenda, Flyer, Zertifikat; Texterkennung auf dem Handy), Link (Teilen → MVP-Tracker) oder von Hand |
| Impact.dc.html | Wirkung pro Jahr, Beiträge pro Monat und Typ, Jahresbericht als PDF |
| Chances.dc.html | CFPs, Gastanfragen, Matching-Anfragen (#174), Erinnerungen |

**Status „im Portal“:** Für das MVP-Portal gibt es keine offizielle Schnittstelle. Deshalb führt der Tracker den Status selbst: Der Nutzer hakt nach dem Kopieren ab. Optional ist ein späterer Abgleich mit dem öffentlichen MVP-Profil, falls es die Beiträge zeigt. Kein Schreiben über inoffizielle Portal-Endpunkte.

Zahlen und Namen sind Beispieldaten bzw. Platzhalter. Planung: Issue #203.

**Ansehen:** Die Screens laden `./support.js`, die Laufzeit von Claude Design. Die Datei liegt nicht im Repo, deshalb zeigt eine direkt geöffnete Datei nur rohe `{{Platzhalter}}`. Ansehen und klicken über den Canvas-Link oben.

## Abgleich mit dem Formular im MVP-Portal

Das Formular „Add activity“ auf mvp.microsoft.com hat diese Felder, in dieser Reihenfolge: Aktivitätstyp, Primary Technology Area, Titel (max. 100 Zeichen), Beschreibung (max. 1000 Zeichen), Start- und Enddatum, Target Audience, Activity URL. Bei „Online Support“ kommen Rolle und Anzahl dazu.

- **Kein Feld für Reichweite.** Zuhörer, Aufrufe und Teilnehmer gehören in die Beschreibung. Der Tracker erfasst sie trotzdem einzeln und schreibt sie in den Beschreibungstext.
- **Typen wie im Portal.** Erfassen und Liste nutzen die Portal-Typen (Article, Podcast, Webinar/Online Training/Video/Livestream, Speaker/Presenter at Microsoft Event, Speaker/Presenter at Third-party Event, Open Source/Project/Sample code/Tools, Online Support, Product Feedback, Mentorship/Coaching). Dann muss beim Eintragen nichts mehr umsortiert werden.
- **Feld für Feld kopieren.** „Alles kopieren“ ist weg, weil das Portal jedes Feld einzeln will. Die Kopier-Knöpfe schreiben wirklich in die Zwischenablage, Titel und Beschreibung zeigen die Zeichen gegen das Limit.
- **Warten, bis es zählt.** Ein Pull Request, der noch offen ist, steht als „Pull request open · wait“ in der Liste und nicht als offener Portal-Eintrag. Eingetragen wird erst, was angenommen ist.
- **Ein Detail-Screen pro Programm.** `Program-Detail.dc.html?p=mvp|mct|nvp|sap`. Ohne Parameter erscheint MVP. Für MCT, NVP und SAP bleiben die Prüfpunkte allgemein, bis die Regeln der Programme feststehen.
- **Prüfung statt Nominierung.** Bestehende MVPs werden jährlich geprüft und nicht neu nominiert. Die Checkliste fragt deshalb nach dem Prüftermin im Program Hub.
