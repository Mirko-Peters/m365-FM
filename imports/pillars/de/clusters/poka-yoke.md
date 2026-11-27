# SEO-Metadaten

| Feld | Wert |
|---|---|
| Meta-Title | Poka Yoke in der Produktion: Arten, Beispiele, Schritte (55 Zeichen) |
| Meta-Description | Poka Yoke (Fehlervermeidung) in der Produktion: Kontroll- vs. Warnfunktion, 3 Methoden, 20 Beispiele, Umsetzung in 5 Schritten und ein Kostenbeispiel. (150 Zeichen) |
| Slug | `/learn/lean-management/poka-yoke/` (vollständige URL: https://www.m365.fm/learn/lean-management/poka-yoke/) |
| Parent-Pillar | [Lean Management](https://www.m365.fm/learn/lean-management/) |
| Hauptkeyword | Poka Yoke, Fehlervermeidung |
| Nebenkeywords | Poka Yoke Beispiele, Poka-Yoke, Fehlhandlungssicherheit, Fehlersicherheit, Poka Yoke Arten, Kontaktmethode, Festwertmethode, Schrittfolgemethode, Quellenprüfung, Shigeo Shingo, Null-Fehler-Prinzip, Poka Yoke Warnung Abschaltung, Poka Yoke Produktion, Poka Yoke Prüfung, digitales Poka Yoke, Poka Yoke Alltag |
| Suchintention | Informational mit starker Beispielabsicht ("Poka Yoke Beispiele"). Zielgruppe: Fertigungs- und Qualitätsingenieure, Meister und Schichtführer, KVP-Coaches, Qualitätsverantwortliche in Umgebungen nach IATF 16949 und AS9100 |
| Wortzahl | Ziel 3.000 bis 5.000 Wörter (Cluster). Tatsächlich H1 bis Fazit (`wc -w`): **4.621 Wörter** (englische Fassung: 4.576) |
| Sprachversion | Deutsch (`de-DE`). hreflang-Paar: `de-DE` https://www.m365.fm/learn/lean-management/poka-yoke/ <-> `en-US` https://www.m365.fm/en/learn/lean-manufacturing/poka-yoke/ |

# Hinweis zur Wettbewerbsanalyse

Die Wettbewerbsanalyse der englischen Fassung bezieht sich auf google.com (USA). Für google.de steht ein eigener SERP-Check (z. B. mit NEURONwriter) noch aus; deutsche Suchbegriffe wie "Poka Yoke", "Poka Yoke Beispiele" und "Fehlervermeidung" sind dabei gesondert zu prüfen.

# Poka Yoke in der Produktion (Fehlervermeidung): Arten, Methoden und 20 Beispiele

*Stand: November 2026 · Lesezeit: etwa 17 Minuten*

> **Kurzantwort:** Poka Yoke (japanisch für "Fehlervermeidung", englisch Mistake Proofing) bezeichnet einfache, kostengünstige Vorrichtungen oder Konstruktionsmerkmale, die verhindern, dass aus Fehlhandlungen Fehler am Produkt werden, zum Beispiel eine Vorrichtung, die ein Teil nur in der richtigen Lage aufnimmt [1]. Die ASQ definiert Mistake Proofing als jede automatische Vorrichtung oder Methode, die einen Fehler unmöglich macht oder ihn sofort offensichtlich macht, sobald er passiert ist [2]. Die stärksten Vorrichtungen halten den Prozess an (Kontroll- oder Abschaltfunktion); schwächere warnen (Licht, Ton) [1][2].

Diese Vertiefung gehört zu unserem [Leitfaden zu Lean Management](https://www.m365.fm/learn/lean-management/), der Poka Yoke als eines der Werkzeuge von Jidoka einführt, also als Weg, Qualität an der Quelle einzubauen. Hier gehen wir weiter: die Rangfolge der Ansätze zur Fehlervermeidung, Shingos drei Erkennungsmethoden, 20 Beispiele aus der Fertigung, ein Vorgehen zur Gestaltung, die Prüfung der Vorrichtungen und wann sich eine Vorrichtung bezahlt macht.

> **Das Wichtigste in Kürze**
> - Poka Yoke zielt auf 100 % Qualität, indem Fehler an der Quelle abgefangen werden [1]. Zugeschrieben wird es Shigeo Shingo, der es im Rahmen seiner Arbeit am Toyota-Produktionssystem formalisierte [3].
> - Shingo soll "Narrensicherheit" (*Baka Yoke*) aus Respekt vor den Mitarbeitenden in "Fehlervermeidung" (*Poka Yoke*) umbenannt haben: Fehlhandlungen sind menschlich, Fehler am Produkt müssen nicht folgen [4].
> - Kontroll- (Abschalt-) Vorrichtungen sind Warnvorrichtungen überlegen; das LEI nennt Abschaltvorrichtungen die wirksamsten [1][2].
> - Drei klassische Methoden: Kontaktmethode, Festwertmethode und Schrittfolgemethode [2].
> - Gute Vorrichtungen sind einfach, robust, zuverlässig, günstig und an den Arbeitsplatz angepasst [1]. In der Sammlung der AHRQ kostete die mittlere Vorrichtung (Median) etwa 100 USD [3].
> - Jede Vorrichtung braucht eine Prüfroutine; ein ungeprüfter Sensor erzeugt trügerische Sicherheit.
> - Eine Erkennungsvorrichtung ohne Ursachenverfolgung wird "just a scrap sorter" (nur ein Ausschusssortierer) [4].

## Inhaltsverzeichnis

1. [Was ist Poka Yoke?](#was-ist-poka-yoke)
2. [Fehlhandlung vs. Fehler: die Idee dahinter](#fehlhandlung-vs-fehler-die-idee-dahinter)
3. [Nutzen von Poka Yoke in der Produktion](#nutzen-von-poka-yoke-in-der-produktion)
4. [Die Rangfolge: von der Fehlervermeidung bis zur Prüfung](#die-rangfolge-von-der-fehlervermeidung-bis-zur-prüfung)
5. [Arten von Poka Yoke: Kontrolle vs. Warnung](#arten-von-poka-yoke-kontrolle-vs-warnung)
6. [Die drei Methoden: Kontakt, Festwert, Schrittfolge](#die-drei-methoden-kontakt-festwert-schrittfolge)
7. [20 Poka-Yoke-Beispiele aus der Produktion](#20-poka-yoke-beispiele-aus-der-produktion)
8. [Poka Yoke einführen in fünf Schritten](#poka-yoke-einführen-in-fünf-schritten)
9. [Poka-Yoke-Vorrichtungen prüfen](#poka-yoke-vorrichtungen-prüfen)
10. [Rechenbeispiel: Lohnt sich eine Vorrichtung gegen fehlende Schrauben?](#rechenbeispiel-lohnt-sich-eine-vorrichtung-gegen-fehlende-schrauben)
11. [Warum Poka Yoke scheitert](#warum-poka-yoke-scheitert)
12. [FAQ](#faq-poka-yoke-und-fehlervermeidung)
13. [Fazit](#fazit)

## Was ist Poka Yoke?

Das Lean Enterprise Institute (LEI) übersetzt Poka Yoke aus dem Japanischen als "error-proofing" (Fehlersicherheit): einfache, kostengünstige Vorrichtungen, die verhindern, dass Werker Fehler machen, etwa das falsche Teil wählen, ein Teil weglassen oder ein Teil verkehrt herum einbauen [1]. Das Ziel ist "100% quality by finding defects at their source" (100 % Qualität, indem Fehler an ihrer Quelle gefunden werden), damit Teams Ursachen beheben, statt Fehler weiterzureichen [1].

Die ASQ verwendet "Mistake Proofing", mit Poka Yoke und Fail-Safing als Synonymen, und definiert es als Einsatz jeder automatischen Vorrichtung oder Methode, die entweder das Auftreten eines Fehlers unmöglich macht oder den Fehler sofort offensichtlich macht, sobald er passiert ist [2]. John Grouts Bericht für die US-Behörde Agency for Healthcare Research and Quality (AHRQ) definiert es als "the use of process or design features to prevent errors or the negative impact of errors" (den Einsatz von Prozess- oder Konstruktionsmerkmalen, um Fehler oder deren negative Auswirkungen zu verhindern) und merkt an, dass Shingo Mistake Proofing im Rahmen seines Beitrags zum Produktionssystem für Toyota-Automobile formalisierte [3].

Die Begriffe Mistake Proofing, Error Proofing und Poka Yoke (auch Poka-Yoke geschrieben) werden in US-Werken gleichbedeutend verwendet; im Deutschen sind Fehlervermeidung, Fehlhandlungssicherheit und Poka Yoke üblich. Das LEI nennt die wörtliche Bedeutung: Im Japanischen bedeutet "poka" unbeabsichtigter Fehler und "yoke" Vermeidung [1]. Automobilkunden sagen meist "Error Proofing".

### Kurze Geschichte

Shigeo Shingo beschrieb das System in *Zero Quality Control: Source Inspection and the Poka-Yoke System* (englische Ausgabe 1986). Laut Verlagsbeschreibung enthält das Buch 112 Beispiele für Vorrichtungen aus der Fertigung, deren Umsetzung meist unter 100 USD kostete [5]. Einem Artikel des Shingo Institute zufolge ersetzte Shingo den früheren Begriff *Baka Yoke* ("Narrensicherheit") durch *Poka Yoke*, weil es respektlos ist, Mitarbeitende als Narren zu bezeichnen; seine Haltung war, dass Fehlhandlungen menschlich sind, die Fehler, die sie verursachen, aber nicht auftreten müssen [4].

## Fehlhandlung vs. Fehler: die Idee dahinter

Die zentrale Idee ist der Unterschied zwischen einer Fehlhandlung (Error) und einem Fehler am Produkt (Defect). Eine Fehlhandlung ist ein Ausrutscher von Mensch oder Maschine: ein verkehrt eingelegtes Teil, ein übersprungener Schritt, eine falsche Einstellung. Ein Fehler ist das, was beim nächsten Prozess oder beim Kunden ankommt, wenn die Fehlhandlung nicht abgefangen wird: ein fehlerhaftes Teil oder Produkt. Poka Yoke akzeptiert, dass Fehlhandlungen passieren, und sorgt dafür, dass daraus keine Fehler werden [4].

Das ändert, wo Qualität geprüft wird. Shingos Buchtitel enthält den Begriff schon: *Source Inspection* (Quellenprüfung). Die ASQ unterscheidet drei Prüfarten [2]:

| Prüfart | Wer prüft, wann | Fängt ab |
|---|---|---|
| Folgeprüfung (Successive Inspection) | der nächste Werker prüft den vorherigen Schritt | Fehler, einen Schritt zu spät |
| Selbstprüfung (Self-Inspection) | der Werker prüft die eigene Arbeit sofort | Fehler, sofort |
| Quellenprüfung (Source Inspection) | Bedingungen werden geprüft, bevor der Schritt beginnt | Fehlhandlungen, bevor sie zu Fehlern werden |

Die klassische Endprüfung am Bandende (Judgment Inspection) sortiert nur Gut von Schlecht, nachdem die Wertschöpfung schon erfolgt ist. Poka Yoke verlegt die Prüfung an den Punkt, an dem die Fehlhandlung passiert, oder besser noch davor.

## Nutzen von Poka Yoke in der Produktion

Warum investieren Werke in Fehlervermeidung, wenn sie ohnehin prüfen? Weil Prüfung Fehler erst findet, nachdem die Wertschöpfung erfolgt ist, während eine Poka-Yoke-Vorrichtung an der Quelle wirkt. Der Nutzen in einem Fertigungsprozess:

- **Qualität an der Quelle.** Das LEI nennt als Ziel 100 % Qualität, indem Fehler an ihrer Quelle gefunden werden [1]; null Fehler wird zum Konstruktionsziel statt zum Slogan.
- **Geringe Kosten.** Die meisten Vorrichtungen sind einfach: In der Sammlung der AHRQ kostete die mittlere Vorrichtung (Median) etwa 100 USD [3].
- **Große Wirkung auf Fehlerschlupf.** Eine einzige gut gewählte Vorrichtung kann einen Fehlermodus fast vollständig beseitigen; der Fall TRW im nächsten Abschnitt ist ein Beispiel [3].
- **Weniger nachgelagerte Prüfungen.** Ist eine Fehlhandlung physisch unmöglich, lässt sich die Endprüfung darauf reduzieren, nachdem die Vorrichtung geprüft ist.
- **Weniger Belastung für die Werker.** Menschen müssen sich nicht mehr bei jeder Wiederholung eines Routineschritts auf Gedächtnis und Aufmerksamkeit verlassen; das passt zum Gedanken des Respekts vor den Menschen hinter dem Begriff [4].

Die Grenzen folgen weiter unten: Vorrichtungen können unbemerkt ausfallen, sich umgehen lassen und nicht jede Fehlhandlung beseitigen [3].

## Die Rangfolge: von der Fehlervermeidung bis zur Prüfung

Nicht jeder Ansatz zur Fehlervermeidung ist gleich stark, und sowohl Vermeidung als auch Erkennung haben ihren Platz. Das Vorgehen der ASQ sucht zuerst nach Wegen, den Fehler unmöglich zu machen (den Schritt streichen, ihn durch einen fehlersicheren Schritt ersetzen oder die richtige Handlung deutlich einfacher machen), und erst dann, wenn Vermeidung nicht möglich ist, nach Wegen, den Fehler zu erkennen und seine Auswirkungen zu begrenzen [2]. Grout zitiert im selben Sinn Tsudas vier Ansätze: Fehlervermeidung im Arbeitsumfeld, Fehlererkennung, Fehlervermeidung und das Verhindern der Auswirkungen von Fehlern [3].

| Stufe | Ansatz | Beispiel | Stärke |
|---|---|---|---|
| 1 | Schritt streichen (Konstruktion) | ein einteilig gegossener Halter ersetzt zwei Teile und eine Schraube | am stärksten: Fehler unmöglich |
| 2 | Vermeiden durch Konstruktion (Geometrie) | asymmetrischer Stecker passt nur in einer Richtung | sehr stark, kein Sensor nötig |
| 3 | Vermeiden durch Kontrolle (Abschaltung) | Presse löst nicht aus, solange der Sensor nicht bestätigt, dass das Teil richtig liegt | stark, braucht Prüfung |
| 4 | Erkennen und anhalten | Drehmomentsteuerung sperrt den Weitertransport, wenn Schrauben fehlen | stark, wenn sich der Halt nicht umgehen lässt |
| 5 | Erkennen und warnen | Licht und Summer, wenn ein Greifbehälter übersprungen wurde | mittel: hängt von der Reaktion ab |
| 6 | Fehler sichtbar machen | farbcodierte Schläuche, Schattenbretter, Umrisse | allein schwach, als Unterstützung nützlich |
| 7 | Nachträglich prüfen | visuelle Endkontrolle, Checkliste | am schwächsten: sortiert, vermeidet nicht |

Die Faustregel: so weit oben auf der Liste ansetzen, wie Kosten und Technik es erlauben. Der Ertrag kann groß sein: Der AHRQ-Bericht zitiert TRW, das seine Fehler mit Mistake Proofing von 288 auf 2 ppm (Teile pro Million) senkte [3]. Konstruktive Änderungen (Stufe 1 und 2) gehören in die Produktentwicklung; deshalb nehmen viele Unternehmen die Fehlervermeidung in Design-Reviews und Prozess-FMEAs auf [unbelegt: übliche Praxis, keine belegte Anforderung].

## Arten von Poka Yoke: Kontrolle vs. Warnung

Das LEI unterscheidet zwei Arten [1]:

- **Abschalt- (Kontroll-) Poka-Yoke** hält den Prozess an. Beispiel: Eine Maschine startet nicht, wenn das Werkstück falsch eingelegt ist. Das LEI nennt diese "the most powerful error-proofing devices" (die wirksamsten Vorrichtungen zur Fehlervermeidung) [1].
- **Warn-Poka-Yoke** gibt dem Werker ein Signal mit Summer oder Licht [1].

Die ASQ verwendet dieselbe Aufteilung unter dem Begriff "Regulierfunktionen" (Regulatory Functions): Warnfunktionen nutzen Glocken, Summer, Lichter und andere Sinnessignale; Kontrollfunktionen verhindern, dass der Prozess weiterläuft, bis der Fehler behoben ist, oder bei der Quellenprüfung, bis die Bedingungen stimmen [2].

| | Kontrolle (Abschaltung) | Warnung |
|---|---|---|
| Was passiert | Prozess hält an oder kann nicht starten | Signal; Prozess kann weiterlaufen |
| Hängt von der Reaktion des Werkers ab | nein | ja |
| Am besten für | Fehler mit hoher Bedeutung, hohe Stückzahlen | geringe Bedeutung, oder wo Anhalten unsicher oder unmöglich ist |
| Risiko | Fehlstopps führen zum Umgehen | Alarmmüdigkeit; Signal wird ignoriert |
| Beispiel | Steuerung des Mutternschraubers gibt die Vorrichtung erst frei, wenn 6 von 6 Schrauben angezogen sind | Pick-by-Light blinkt rot, wenn in den falschen Behälter gegriffen wird |

Eine Warnvorrichtung ist nur so gut wie die Reaktion dahinter. Ertönt der Summer 40-mal pro Schicht wegen Fehlalarmen, hören die Werker ihn nicht mehr. Das verbindet Poka Yoke mit [Andon](https://www.m365.fm/learn/shop-floor-management/andon/) (geplant): Eine Warnung sollte eine festgelegte Reaktion auslösen, nicht nur Lärm.

## Die drei Methoden: Kontakt, Festwert, Schrittfolge

Die ASQ nennt sie "Einstellfunktionen" (Setting Functions): die Arten, wie eine Vorrichtung einen Parameter oder ein Merkmal prüft [2]. Alle drei werden üblicherweise Shingo zugeschrieben [unbelegt: in dieser Sitzung nicht an Shingos eigenen Büchern geprüft].

| Methode | Was sie prüft | Typische Vorrichtungen | Beispiel |
|---|---|---|---|
| Kontaktmethode (physisch) | physische Merkmale, oft durch Berührung: Form, Größe, Lage, Durchmesser, Temperatur | Führungsstifte, Endschalter, Näherungssensoren, in Vorrichtungen integrierte Gut-/Schlecht-Lehren | Vorrichtungsstift taucht nur in eine Bohrung ein, die nur die richtige Variante hat |
| Festwertmethode (Zählen) | Anzahl von Teilen oder Handlungen, oder ein Gewicht | Zähler, Waagen, Kommissionierschalen mit einem Fach pro Teil | Drehmomentwerkzeug zählt Verschraubungen; Schale mit 8 Fächern muss leer sein |
| Schrittfolgemethode (Reihenfolge) | dass Schritte in der richtigen Reihenfolge erfolgen | Ablauflogik in der SPS, Pick-by-Light, Barcode-Scan vor dem nächsten Schritt | Etikettendrucker gibt erst frei, wenn die Prüfstation "bestanden" meldet |

Kurz: Die Kontaktmethode prüft das Teil, die Festwertmethode die Anzahl und die Schrittfolgemethode, dass Schritte in der richtigen Reihenfolge erfolgen.

Die ASQ nennt als mögliche vierte Art die Informationsverbesserung (Information Enhancement): sicherstellen, dass benötigte Informationen dort und dann verfügbar und sichtbar sind, wo und wann sie gebraucht werden [2]. Digitale Arbeitsanweisungen, die die richtige Variante zeigen, sind ein Beispiel; der [Leitfaden zur papierlosen Fertigung](https://www.m365.fm/learn/shop-floor-management/papierlose-fertigung/) (geplant) behandelt sie.

## 20 Poka-Yoke-Beispiele aus der Produktion

Die folgenden Beispiele sind typische Vorrichtungen aus der Fertigung, gruppiert nach Methode und Art. Die Beispiele 1, 6 und 15 folgen den Beschreibungen des LEI [1]; die übrigen sind übliche Praxis und dienen der Veranschaulichung.

| Nr. | Vermiedene Fehlhandlung | Vorrichtung | Methode | Art |
|---|---|---|---|---|
| 1 | Teil in falscher Lage eingelegt | asymmetrisches Teilemerkmal oder Vorrichtung, die nur eine Lage zulässt [1] | Kontakt | Kontrolle (Konstruktion) |
| 2 | falsche Variante eingelegt | Aufnahmestift, der in eine Bohrung passt, die nur die richtige Variante hat | Kontakt | Kontrolle |
| 3 | Teil nicht vollständig eingelegt | Näherungssensor; Presse löst nur bei richtig liegendem Teil aus | Kontakt | Kontrolle |
| 4 | zu großes oder zu kleines Teil gelangt in die Montage | integrierter Gut-/Schlecht-Schlitz am Förderband | Kontakt | Kontrolle |
| 5 | Stecker in falschen Anschluss gesteckt | codierte Stecker, die nur in einer Richtung passen | Kontakt | Kontrolle (Konstruktion) |
| 6 | Teil im Kit übersprungen | Lichtschranke über jedem Behälter; Prozess hält an, bis jeder Strahl unterbrochen wurde [1] | Festwert / Schrittfolge | Kontrolle |
| 7 | fehlende Schraube | Drehmomentsteuerung zählt die Verschraubungen und sperrt die Vorrichtung | Festwert | Kontrolle |
| 8 | fehlendes Kleinteil im Karton | Kontrollwaage schleust Kartons außerhalb des Gewichtsfensters aus | Festwert | Kontrolle |
| 9 | falsche Anzahl Teile entnommen | Kit-Schale mit genau einem Fach pro Teil | Festwert | Warnung (visuell) |
| 10 | Schritt in der Abfolge übersprungen | SPS-Ablaufverriegelung: Werkzeug für Schritt 4 erst nach bestätigtem Schritt 3 freigegeben | Schrittfolge | Kontrolle |
| 11 | falsches Etikett am Produkt | Scanner vergleicht Produkt-Barcode vor der Freigabe mit dem Etikett | Schrittfolge | Kontrolle |
| 12 | ungeprüfte Einheit versandt | Packplatz nimmt nur Seriennummern mit "bestanden"-Eintrag an | Schrittfolge | Kontrolle |
| 13 | falsches Programm auf der CNC-Maschine geladen | Programmaufruf durch Scannen der Teilenummer auf dem Laufzettel | Schrittfolge | Kontrolle |
| 14 | falscher Schlauch angeschlossen | farbcodierte Kupplungen in unterschiedlichen Größen | Kontakt | Kontrolle (Konstruktion) |
| 15 | falsche Teilekombination für die Variante | System prüft die gescannten Teile gegen den Fertigungsauftrag [1] | Schrittfolge | Kontrolle |
| 16 | Werkzeug in der Baugruppe vergessen | Schattenbrett mit Sensor; Linie taktet erst weiter, wenn alle Werkzeuge zurück sind | Festwert | Kontrolle |
| 17 | abgelaufenes Material verwendet | Scan am Verbrauchsort weist Chargen nach Ablauf der Haltbarkeit zurück | Kontakt (Information) | Kontrolle |
| 18 | falsche Drehmomenteinstellung | Werkzeug erhält das Programm von der Stationssteuerung; manuelle Einstellung gesperrt | Informationsverbesserung | Kontrolle |
| 19 | falscher Zeichnungsstand verwendet | Arbeitsanweisung wird aus dem Auftrag am Bildschirm angezeigt, Papierkopien entfernt | Informationsverbesserung | Warnung |
| 20 | fehlendes Teil bei der Endkontrolle | Bildverarbeitungssystem vergleicht das Bild mit einer Referenz | Kontakt | Kontrolle |

Das LEI nennt auch Beispiele aus dem Alltag, mit denen sich die Idee leicht vermitteln lässt: Waschmaschinen, die bei offener Tür nicht starten, Rasenmäher, die nur laufen, solange der Sicherheitsbügel gehalten wird, und Tischkreissägen, die automatisch stoppen [1].

**Ein Wort zu Sicherheitseinrichtungen.** Verriegelungen und Lichtvorhänge, die Menschen vor Maschinengefahren schützen, sind sicherheitsbezogene Steuerungen mit eigenen Konstruktionsregeln und Vorschriften (in den USA die allgemeine Anforderung der OSHA an Schutzeinrichtungen, 29 CFR 1910.212(a)(1): "One or more methods of machine guarding shall be provided" (eine oder mehrere Methoden der Maschinenabsicherung sind vorzusehen) [6]). Eine Sicherheitseinrichtung sollte nicht zum Qualitäts-Poka-Yoke umfunktioniert werden, und eine Qualitätsvorrichtung darf keine Sicherheitsfunktion schwächen. EHS gehört dazu, wenn eine Vorrichtung Maschinenbewegungen stoppt [unbelegt: Normen zur Gestaltung von Sicherheitsfunktionen in dieser Sitzung nicht geprüft].

## Poka Yoke einführen in fünf Schritten

Die Schritte folgen dem Vorgehen der ASQ [2], ergänzt um Auswahl und Prüfung.

1. **Den Prozess abbilden und die wahrscheinlichen Fehlerstellen finden.** Flussdiagramm, Fehlerdaten, PFMEA und das Wissen der Werker nutzen. Nach Bedeutung und Häufigkeit priorisieren.
2. **Jede Fehlhandlung bis zu ihrer Quelle zurückverfolgen.** Was genau geht schief, und welche Bedingung lässt es zu?
3. **Zuerst nach Wegen suchen, Fehlhandlungen zu vermeiden.** Lässt sich der Schritt streichen, durch einen fehlersicheren Schritt ersetzen oder so gestalten, dass die richtige Handlung die einfachste ist [2]?
4. **Ist Vermeidung nicht möglich, erkennen und die Auswirkung begrenzen.** Eine Einstellfunktion (Kontakt, Festwert, Schrittfolge) und eine Regulierfunktion (Kontrolle oder Warnung) wählen [2].
5. **Auswählen, testen, einführen, prüfen.** Einen günstigen Prototyp bauen, mit den Werkern aller Schichten ausprobieren, in Standardarbeit und Produktionslenkungsplan aufnehmen und eine Prüfroutine einrichten [2].

**Vorlage: Poka-Yoke-Arbeitsblatt**

| Feld | Beispiel |
|---|---|
| Prozess / Station | Gehäusemontage, Station 3 |
| Fehlhandlung | eine von sechs M8-Schrauben nicht angezogen |
| Auswirkung, wenn nicht abgefangen | loser Deckel, Ölleck beim Kunden; Bedeutung 8 (PFMEA) |
| Derzeitige Entdeckung | Sichtprüfung am Bandende |
| Quelle der Fehlhandlung | Werker wird unterbrochen und verzählt sich; keine Rückmeldung vom Werkzeug |
| Vermeidungsoption? | Konstruktion mit weniger Schrauben: von der Konstruktion abgelehnt (Abdichtung) |
| Einstellfunktion | Festwert (6 Verschraubungen mit Drehmoment i. O. zählen) |
| Regulierfunktion | Kontrolle: Vorrichtungsspanner gibt erst frei, wenn 6 von 6 i. O. |
| Kostenschätzung | 6.000 USD (siehe Rechenbeispiel) |
| Prüfmethode | tägliche Prüfung zu Schichtbeginn mit 5 Schrauben; Ergebnis in der Checkliste |
| Verantwortlich / Termin | Fertigungsingenieur, 4 Wochen |
| Standardarbeit aktualisiert? | ja, Schritt 3.4 und Reaktionsplan |

Die Werker, die die Vorrichtung nutzen werden, gehören ab Schritt 1 dazu. Der Artikel des Shingo Institute nennt den Ausschluss der Nutzer von der Gestaltung als einen der Gründe, warum Vorrichtungen abgelehnt werden [4].

## Poka-Yoke-Vorrichtungen prüfen

Ein Poka Yoke, das unbemerkt ausgefallen ist, ist schlimmer als keines: Alle glauben, der Fehler sei unmöglich, also schaut niemand hin. Die Prüfung ist daher Teil der Vorrichtung, kein Zusatz.

**Tägliche Prüfroutine** (übliche Praxis; IATF 16949 Abschnitt 10.2.4 fordert, Fehlervermeidungsvorrichtungen auf Ausfall oder simulierten Ausfall zu prüfen, mit im Produktionslenkungsplan dokumentierter Prüfhäufigkeit [7])

| Schritt | Was zu tun ist | Wer | Wann |
|---|---|---|---|
| 1 | die Vorrichtung mit einem bekannten Schlechtteil oder Zustand testen (ein gekennzeichnetes "Challenge Part", oft rot lackiert und in vielen Werken "Red Rabbit" genannt; im Deutschen auch Grenzmuster oder Prüfteil) | Werker oder Teamleiter | zu Beginn jeder Schicht, nach Instandhaltung, nach Rüstvorgängen |
| 2 | bestätigen, dass die Vorrichtung reagiert (Halt oder Signal) | Werker | ebenso |
| 3 | das Ergebnis auf dem Prüfblatt oder im MES festhalten | Werker | ebenso |
| 4 | wenn die Vorrichtung versagt: anhalten, Produktion seit der letzten guten Prüfung sperren, Qualität rufen | Teamleiter | sofort |
| 5 | Prüfaufzeichnungen und Überbrückungen auswerten | Meister, Qualität | wöchentlich |
| 6 | Prüfteile verwalten: nummeriert, gelagert, bei Verschleiß ersetzt | Qualität | monatlich |

**Kontrolle von Überbrückungen.** Viele Vorrichtungen lassen sich für Instandhaltung oder Fehlersuche abschalten. Dafür gehören ein Schlüssel oder Passwort her, jede Überbrückung wird mit Zeit und Grund protokolliert, und Produktion während einer Überbrückung gilt als verdächtig, bis sie geprüft ist. Ein nicht protokollierter Überbrückungsschalter an einer Vorrichtung ist ein häufiger Auditbefund [unbelegt: Beobachtung aus der Praxis].

## Rechenbeispiel: Lohnt sich eine Vorrichtung gegen fehlende Schrauben?

Die Zahlen dienen der Veranschaulichung.

**Ausgangslage.** Eine Linie baut 1.200 Gehäuse pro Tag an 250 Tagen im Jahr: 300.000 Gehäuse pro Jahr. Jedes hat sechs Schrauben. Fehlende oder nicht angezogene Schrauben treten bei 150 von einer Million Gehäusen auf (150 ppm). Die visuelle Endprüfung fängt etwa 80 % davon ab.

**Ohne Poka Yoke:**

| Position | Rechnung | Ergebnis |
|---|---|---|
| Gehäuse mit fehlender Schraube pro Jahr | 300.000 × 150 / 1.000.000 | 45 |
| im Werk abgefangen (80 %) | 45 × 0,8 | 36 |
| zum Kunden durchgerutscht (20 %) | 45 × 0,2 | 9 |
| interne Nacharbeitskosten | 36 × 60 USD | 2.160 USD |
| Feld- / Gewährleistungskosten (Ölleck, Austausch, Abwicklung) | 9 × 2.500 USD | 22.500 USD |
| **Jährliche Kosten der Fehlhandlung** | | **24.660 USD** |

**Poka Yoke:** eine Zählfunktion an der vorhandenen Drehmomentsteuerung plus eine Verriegelung der Vorrichtung (Festwert, Kontrolle).

| Position | Rechnung | Ergebnis |
|---|---|---|
| Steuerungsoption, Spannverriegelung, Verkabelung | Angebot | 4.500 USD |
| Engineering und SPS-Integration | 16 h × 95 USD | 1.520 USD |
| **Investition** | | **6.020 USD** |
| tägliche Prüfzeit | 2 min × 3 Schichten × 250 Tage = 1.500 min = 25 h × 45 USD | 1.125 USD pro Jahr |
| **Jährlicher Nettonutzen** | 24.660 USD − 1.125 USD | **23.535 USD** |
| **Einfache Amortisation** | 6.020 USD / 23.535 USD × 12 Monate | **etwa 3 Monate** |

Zwei Vorbehalte aus Sicht des Controllings. Erstens sind die Gewährleistungskosten je durchgerutschtem Fehler unsicher; hier gehören die eigenen Gewährleistungsdaten hinein, dazu Rückbelastungen des Kunden, wenn die Verträge sie vorsehen. Zweitens können die Kosten eines durchgerutschten Fehlers beim Kunden (ein Bandstillstand beim OEM, ein Rückruf) alles oben Genannte weit übersteigen; bei Fehlermodi mit Bedeutung 9 oder 10 sollte niemand auf eine Amortisationsrechnung warten.

## Warum Poka Yoke scheitert

Der Artikel von Bruce Hamilton für das Shingo Institute nennt Gründe, warum Teams Poka-Yoke-Vorrichtungen ablehnen oder verlieren [4]. Kurz gefasst, mit unseren Abhilfen:

| Grund für das Scheitern [4] | Abhilfe |
|---|---|
| der zusätzliche Schritt steht nicht in der Standardarbeit, also tauschen Werker Qualität gegen Tempo | Vorrichtung und Reaktion in die [Standardarbeit](https://www.m365.fm/learn/shop-floor-management/standardarbeit/) (geplant) und in die Zykluszeit aufnehmen |
| undokumentierte, nicht geschulte Methoden sind keine echten Standards | jede Schicht schulen; den Reaktionsplan dokumentieren |
| Vorrichtungen, die Werker belasten, halten nicht | Greifweg, Kraft und Körperhaltung vor dem Rollout prüfen |
| Erkennung ohne Ursachenverfolgung wird "just a scrap sorter" (nur ein Ausschusssortierer) | jeden Treffer protokollieren; bei häufigen Treffern 5 Why, einen [PDCA](https://www.m365.fm/learn/lean-management/pdca-zyklus/) oder einen [A3](https://www.m365.fm/learn/lean-management/a3-methode/) fahren |
| Vorrichtungen, die nicht funktionieren, brauchen weitere PDCA-Zyklen | Prototyp bauen, testen, anpassen, bevor sie als fertig gelten |
| der Begriff wird für jede Vorrichtung oder jedes Werkzeug missbraucht | "Poka Yoke" für Vorrichtungen gegen menschliche Fehlhandlungen reservieren |
| Nutzer von der Gestaltung ausgeschlossen | Werker gestalten den Prototyp mit und testen ihn |

Zwei weitere Punkte aus dem AHRQ-Bericht: Mistake Proofing ist kein Allheilmittel und kann nicht alle Fehler und Ausfälle aus einem Prozess entfernen [3]. Und eine Schuldkultur besiegt das Werkzeug, bevor es anfängt: Der Artikel des Shingo Institute merkt an, dass Organisationen, die Fehler bestrafen oder lächerlich machen, vom Melden abhalten; so werden die Fehler, die Vorrichtungen bräuchten, nie gefunden [4].

**Respekt vor den Menschen.** Poka Yoke ist einer der deutlichsten Ausdrücke von Respekt im Lean: Es setzt voraus, dass der Werker fähig ist und dass Fehler aus der Prozessgestaltung kommen, nicht aus Nachlässigkeit. Auch Worte zählen. "Idiotensicher" ist in manchen Werkhallen noch zu hören; Shingo hat "Narrensicherheit" genau deshalb fallen gelassen [4].

### Digitales Poka Yoke

Viele moderne Vorrichtungen sind Software: Barcode-Prüfung vor dem nächsten Schritt, Workflow-Verriegelungen im MES, die eine Station sperren, wenn ein vorheriger Schritt fehlt, Drehmomentdaten, die an eine Seriennummer gebunden sind, Pick-by-Light-Systeme, die vom Auftrag gesteuert werden. Das sind Schrittfolge- und Informationsmethoden in neuer Form. Sie werfen zwei neue Fragen auf: Wem gehört die Logik, wenn sich die Software ändert, und was passiert, wenn Netzwerk oder MES ausfallen? Sinnvoll ist eine Rückfallebene (manuelle Prüfung mit Abzeichnung), und die Verriegelungen gehören ins Änderungsmanagement: SPS- oder MES-Logik versionieren, Änderungen vor der Freigabe mit Prüfteilen testen und einschränken, wer sie bearbeiten oder abschalten darf. Der letzte Punkt ist auch eine Frage der OT-Security, die der geplante [Leitfaden zu OT-Security und IEC 62443](https://www.m365.fm/learn/ot-security-iec-62443/) behandelt. Die Systemseite deckt der geplante [Leitfaden zu MES und ISA-95](https://www.m365.fm/learn/mes-isa-95/) ab.

### Poka Yoke in Lean Management und Six Sigma

Poka Yoke ist Teil von Jidoka, dem Lean-Prinzip, Qualität in den Prozess einzubauen; es bildet ein Paar mit Andon, das Abweichungen sichtbar macht und eine Reaktion auslöst. In einem [Six-Sigma](https://www.m365.fm/learn/six-sigma-ursachenanalyse/)-Projekt (geplant) ist Poka Yoke eine typische Maßnahme der Control-Phase. In einem [Kaizen-Workshop](https://www.m365.fm/learn/lean-management/kaizen/) ist Fehlervermeidung eine der klassischen Workshop-Arten. Und in einer PFMEA ist eine gut geprüfte Vorrichtung vom Kontrolltyp die stärkste Entdeckungs- oder Vermeidungsmaßnahme, die sich eintragen lässt.

## FAQ: Poka Yoke und Fehlervermeidung

### Was ist Poka Yoke einfach erklärt?

Eine Vorrichtung oder ein Konstruktionsmerkmal, das es unmöglich oder zumindest offensichtlich macht, einen Schritt falsch auszuführen, etwa ein Stecker, der nur in einer Richtung passt. Das LEI beschreibt es als einfache, kostengünstige Fehlervermeidung mit dem Ziel von 100 % Qualität [1].

### Wer hat Poka Yoke erfunden?

Shigeo Shingo formalisierte es im Rahmen seiner Arbeit am Toyota-Produktionssystem [3] und beschrieb es in *Zero Quality Control* (englische Ausgabe 1986) [5].

### Welche zwei Arten von Poka Yoke gibt es?

Kontroll- (Abschalt-) Vorrichtungen, die den Prozess anhalten, und Warnvorrichtungen, die mit Licht oder Ton signalisieren [1][2]. Kontrollvorrichtungen sind stärker [1].

### Welche drei Methoden von Poka Yoke gibt es?

Kontaktmethode (prüft physische Merkmale), Festwertmethode (prüft Anzahl oder Gewicht) und Schrittfolgemethode (prüft die Reihenfolge der Schritte) [2]. Die ASQ nennt die Informationsverbesserung als mögliche vierte [2].

### Was sind Beispiele für Poka Yoke?

Asymmetrische Teile, die nur in einer Richtung passen, Lichtschranken über Teilebehältern, Drehmomentwerkzeuge, die Verschraubungen zählen, Kontrollwaagen, Barcode-Prüfung vor dem Etikettieren und Alltagsbeispiele wie Waschmaschinen, die bei offener Tür nicht starten [1]. Siehe die Tabelle mit 20 Beispielen oben.

### Ist eine Checkliste ein Poka Yoke?

Im strengen Sinn nicht. Eine Checkliste baut auf Aufmerksamkeit und fängt nichts automatisch ab; sie ist eine Prüfhilfe am unteren Ende der Rangfolge. Bis eine Vorrichtung eingeführt ist, kann sie eine nützliche Zwischenlösung sein.

### Was ist der Unterschied zwischen Poka Yoke und Error Proofing?

In der Praxis keiner. Poka Yoke ist der japanische Begriff; Error Proofing und Mistake Proofing sind die englischen Entsprechungen [1][2], im Deutschen Fehlervermeidung oder Fehlhandlungssicherheit.

### Was kostet ein Poka Yoke?

Oft sehr wenig. Shingos Buch beschreibt Vorrichtungen, die meist unter 100 USD kosteten [5], und in der Sammlung der AHRQ kostete die mittlere Vorrichtung (Median) etwa 100 USD, 90 % kosteten 1.000 USD oder weniger [3]. Sensor- und softwarebasierte Vorrichtungen kosten mehr; das Rechenbeispiel oben kostet etwa 6.000 USD und amortisiert sich in etwa drei Monaten.

### Wie prüft man, ob ein Poka Yoke funktioniert?

Zu Beginn jeder Schicht, nach Instandhaltung und nach Rüstvorgängen mit einem bekannten Schlechtteil oder Zustand testen, das Ergebnis festhalten und sofort reagieren, wenn es versagt. Jede Überbrückung protokollieren und auswerten.

### Was bedeutet Poka Yoke im Lean?

Im Japanischen bedeutet "poka" unbeabsichtigter Fehler und "yoke" Vermeidung [1]. Im Lean Management ist Poka Yoke eines der Werkzeuge von Jidoka: Es baut Qualität in den Prozess ein, damit eine unbeabsichtigte Fehlhandlung gestoppt wird, bevor daraus ein fehlerhaftes Produkt wird.

### Was sind 3 Beispiele für Poka Yoke im Alltag?

Das LEI nennt mehrere: Waschmaschinen, die erst starten, wenn die Tür geschlossen ist, Rasenmäher, die nur laufen, solange der Sicherheitsbügel gedrückt wird, und die automatische Abschaltung einer Tischkreissäge; außerdem nennt es Totwinkel-Warner und Rechtschreibprüfung [1].

### Kann Poka Yoke alle Fehler beseitigen?

Nein. Der AHRQ-Bericht sagt klar, dass Mistake Proofing kein Allheilmittel ist und nicht alle Fehler und Ausfälle aus einem Prozess entfernen kann [3]. Es beseitigt bestimmte, bekannte Fehlermodi. Fehler aus Streuung, Konstruktion oder Material brauchen andere Werkzeuge, etwa SPC oder ein Six-Sigma-Projekt.

### Lässt sich Poka Yoke auch außerhalb der Produktion nutzen?

Ja. Grouts Bericht zum Mistake Proofing wurde für das Gesundheitswesen geschrieben [3], und die Alltagsbeispiele oben stammen aus Autos, Haushaltsgeräten und Software [1]. Die Logik ist überall dieselbe, wo ein Routineschritt schiefgehen kann.

## Fazit

Poka Yoke geht von einer respektvollen Annahme aus: Menschen machen Fehler, und der Prozess sollte verhindern, dass daraus Fehler am Produkt werden. Die stärksten Lösungen beseitigen die Möglichkeit der Fehlhandlung durch Konstruktion; die nächstbesten halten den Prozess an; Warnungen und Checklisten kommen zuletzt. Die drei Einstellmethoden (Kontakt, Festwert, Schrittfolge) geben Ingenieuren ein einfaches Vokabular zur Gestaltung von Vorrichtungen, und das Fünf-Schritte-Vorgehen der ASQ gibt ihnen eine Reihenfolge der Arbeit. Zwei Gewohnheiten entscheiden, ob die Vorrichtungen weiter funktionieren: die tägliche Prüfung mit einem bekannten Schlechtteil und die Ursachenverfolgung bei jedem Treffer.

**Die nächsten Schritte**

- [ ] Die fünf wichtigsten durchgerutschten oder internen Fehler nach Bedeutung und Häufigkeit auflisten
- [ ] Für jeden fragen: Lässt sich der Schritt streichen, durch Konstruktion vermeiden oder der Prozess anhalten?
- [ ] Das Poka-Yoke-Arbeitsblatt mit den Werkern ausfüllen, die die Arbeit machen
- [ ] Einen günstigen Prototyp bauen und in allen Schichten testen
- [ ] Vorrichtung und Reaktionsplan in die Standardarbeit aufnehmen
- [ ] Eine tägliche Prüfroutine mit gekennzeichneten Prüfteilen starten

---

## Weiterlesen auf m365.fm

**Übergeordneter Leitfaden**
- [Lean Management: Prinzipien, Werkzeuge, Einführung und Grenzen](https://www.m365.fm/learn/lean-management/)

**Weitere Vertiefungen zu Lean**
- [Kaizen und Kaizen-Workshops](https://www.m365.fm/learn/lean-management/kaizen/) (geplant)
- [PDCA-Zyklus](https://www.m365.fm/learn/lean-management/pdca-zyklus/) (geplant)
- [A3-Methode](https://www.m365.fm/learn/lean-management/a3-methode/) (geplant)

**Verwandte Leitfäden**
- [Six Sigma und Ursachenanalyse](https://www.m365.fm/learn/six-sigma-ursachenanalyse/) (geplant)
- [Standardarbeit](https://www.m365.fm/learn/shop-floor-management/standardarbeit/) (geplant)
- [Andon-System](https://www.m365.fm/learn/shop-floor-management/andon/) (geplant)
- [Papierlose Fertigung](https://www.m365.fm/learn/shop-floor-management/papierlose-fertigung/) (geplant)
- [MES und ISA-95](https://www.m365.fm/learn/mes-isa-95/) (geplant)
- [OT-Security und IEC 62443](https://www.m365.fm/learn/ot-security-iec-62443/) (geplant)
- [Produktionskennzahlen](https://www.m365.fm/learn/produktionskennzahlen/)
- [Operational Excellence](https://www.m365.fm/learn/operational-excellence/)

**Glossarbegriffe (Entities)**
[Poka Yoke](https://www.m365.fm/entity/poka-yoke/) · [Lean Management](https://www.m365.fm/entity/lean-management/) · [Standardarbeit](https://www.m365.fm/entity/standard-work/)

# Autorenbox

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** ist Host von m365.fm und arbeitet bei der iFAKT GmbH. Auf m365.fm schreibt er über Lean Management, Operational Excellence und die digitale Transformation der Produktion. [Redaktion: Rolle, Kurzbiografie und Foto ergänzen.]

**Hinweis: Der Autor arbeitet bei der iFAKT GmbH.**

# Quellen

Alle Quellen abgerufen am 20. November 2026.

1. Poka-Yoke. Lean Enterprise Institute. https://www.lean.org/lexicon-terms/poka-yoke/
2. Mistake Proofing. American Society for Quality (ASQ). https://asq.org/quality-resources/mistake-proofing
3. Grout, J.: Mistake-Proofing the Design of Health Care Processes. AHRQ Publication No. 07-0020, Agency for Healthcare Research and Quality, Mai 2007. Volltext über govinfo.gov: https://www.govinfo.gov/content/pkg/GOVPUB-HE20_6500-PURL-gpo3107/pdf/GOVPUB-HE20_6500-PURL-gpo3107.pdf (Zusammenfassung: https://psnet.ahrq.gov/issue/mistake-proofing-design-health-care-processes)
4. Hamilton, B.: Mistake-Proofing Mistakes (4. Februar 2020). Blog des Shingo Institute. https://shingo.org/mistake-proofing-mistakes/
5. Shingo, S.: Zero Quality Control: Source Inspection and the Poka-Yoke System. Productivity Press, 1986; Verlagsseite (Routledge). https://www.routledge.com/Zero-Quality-Control-Source-Inspection-and-the-Poka-yoke-System/Shingo/p/book/9780915299072
6. 29 CFR 1910.212, General requirements for all machines, Absatz (a)(1). OSHA. https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.212 (abgerufen am 20. November 2026)
7. How to establish an error-proofing process according to IATF 16949 (Abschnitt 10.2.4; Sekundärquelle, die Norm ist kostenpflichtig). Advisera 16949 Academy. https://advisera.com/16949academy/wp-json/wp/v2/posts/10367 (abgerufen am 20. November 2026)

# Prüfhinweise für die Redaktion

**URL-Schema:** verschachtelte Cluster-URL laut Übersetzungs-Brief; eine Annahme über die finale CMS-Struktur.

**Herstellerangaben:** keine.

**[unbelegt]-Stellen:** Fehlervermeidung in Design-Reviews/PFMEA als übliche Praxis; Zuschreibung der drei Methoden an Shingo (nicht an Shingos Büchern geprüft); Normen zur Gestaltung von Sicherheitsfunktionen (nicht geprüft); nicht protokollierte Überbrückungsschalter als häufiger Auditbefund. Die OSHA-Vorschrift (1910.212(a)(1)) und IATF 16949 Abschnitt 10.2.4 sind über [6] und [7] belegt.

**Zitate:** Englische Originalzitate (LEI, AHRQ, Shingo Institute, OSHA) stehen mit deutscher Übersetzung in Klammern.

**Rechenbeispiel:** Beispielzahlen, nachgerechnet wie in der englischen Fassung (300.000; 45; 36 / 9; 2.160 USD; 22.500 USD; 24.660 USD; 1.520 USD; 6.020 USD; 1.500 min = 25 h × 45 USD = 1.125 USD; 23.535 USD; 3,07 Monate). USD bleibt laut Brief.

**Konsistenz mit der Pillar:** Die englische Pillar schreibt die drei Erkennungsmethoden über Wikipedia Shingo zu; dieser Cluster zitiert dafür die ASQ [2]. Bei der Abstimmung mit der deutschen Lean-Management-Pillar prüfen.

**iFAKT:** im Artikeltext nicht erwähnt; Offenlegung nur in der Autorenbox.

**Interne Links (Text):** Parent-Pillar Lean Management (erste 150 Wörter), Geschwister Kaizen, PDCA-Zyklus, A3-Methode; Cluster Standardarbeit, Andon, papierlose Fertigung; Pillars MES/ISA-95 (neu), Six Sigma (neu), OT-Security (neu). Neue URLs sind geplant; nach Veröffentlichung aktivieren.

**Kannibalisierung:** Die Lean-Management-Pillar hat einen kurzen Abschnitt zu Poka Yoke. Dieser Cluster besetzt "Poka Yoke Beispiele", "Fehlervermeidung", "Poka Yoke Arten". Die Entity-Seite `/entity/poka-yoke/` sollte hierher verlinken.

**JSON-LD-Vorschlag:** wie in der englischen Fassung (`TechArticle` mit `about.sameAs` auf die Entity-Seite, `FAQPage`, `BreadcrumbList`) mit `inLanguage: de-DE`, deutscher `headline` ("Poka Yoke in der Produktion (Fehlervermeidung): Arten, Methoden und 20 Beispiele"), `mainEntityOfPage` https://www.m365.fm/learn/lean-management/poka-yoke/, `isPartOf` https://www.m365.fm/learn/lean-management/, deutschen FAQ-Fragen und -Antworten (ohne [n]). Breadcrumb: Start > Learn > Lean Management > Poka Yoke.

**Empfohlene Grafiken:** (1) Rangfolge der Fehlervermeidung als Pyramide (streichen → prüfen); (2) Vergleich Kontroll- vs. Warnvorrichtung mit Symbolen; (3) Fotos oder Zeichnungen von fünf Beispielvorrichtungen (codierter Stecker, Aufnahmestift, Behälter mit Lichtschranke, zählendes Drehmomentwerkzeug, Kontrollwaage); (4) Vorlage Prüfblatt als PDF zum Herunterladen. Beschriftungen auf Deutsch, Dezimalkomma.

**hreflang:** `de-DE` https://www.m365.fm/learn/lean-management/poka-yoke/ <-> `en-US` https://www.m365.fm/en/learn/lean-manufacturing/poka-yoke/; gegenseitige Verweise und selbstreferenzierende Canonicals. Die englische Fassung muss beim Livegang um das hreflang-Paar ergänzt werden.

**Für den deutschen Markt prüfen:**
- Abschnitt "Ein Wort zu Sicherheitseinrichtungen": nennt US-Recht (OSHA 29 CFR 1910.212). Für deutsche Werke prüfen, ob ein Hinweis auf Maschinenrichtlinie/Maschinenverordnung, Betriebssicherheitsverordnung, DGUV-Regeln und die Normen zur funktionalen Sicherheit (z. B. EN ISO 13849) ergänzt werden soll. Nur nach Fachprüfung als Fakt einfügen.
- Digitales Poka Yoke und Protokollierung im MES (Daten je Seriennummer und Werker): Mitbestimmung des Betriebsrats bei technischen Einrichtungen zur Leistungs- und Verhaltenskontrolle (§ 87 Abs. 1 Nr. 6 BetrVG) und Datenschutz prüfen.
- Abschnitt OT-Security: Bezug zu NIS2-Umsetzung prüfen (nicht im Original).

**Review-Log:** Fachliche Prüfung (9-köpfiges Expertenpanel, mehrere Runden) siehe englische Fassung; die deutsche Fassung ist eine Übertragung ohne inhaltliche Änderungen.
