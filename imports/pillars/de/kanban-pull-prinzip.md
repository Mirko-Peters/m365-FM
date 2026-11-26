# SEO-Metadaten

| Feld | Wert |
|---|---|
| Meta-Title | Kanban in der Produktion: Pull-Prinzip und Kartenanzahl (55 Zeichen) |
| Meta-Description | Kanban in der Produktion erklärt: wie das Pull-Prinzip funktioniert, Kanban-Arten, Kanban-Formel, E-Kanban, CONWIP, Einführung und Kennzahlen. (143 Zeichen) |
| Slug | `/learn/kanban-pull-prinzip/` (vollständige URL: https://www.m365.fm/learn/kanban-pull-prinzip/) |
| Hauptkeyword | Kanban in der Produktion; zweites Hauptkeyword: Pull-Prinzip |
| Nebenkeywords | Kanban-System, Kanban Produktion, Pull-System, Pull-Prinzip Produktion, Push und Pull, Push-Prinzip, Kanban-Karte, Kanban-Formel, Kanban berechnen, Anzahl Kanban-Karten berechnen, Kanban-Regelkreis, Produktionskanban, Entnahmekanban, Transportkanban, Signalkanban, Dreieckskanban, Lieferantenkanban, Zwei-Behälter-System (2-Behälter-Kanban), Kanban-Supermarkt, FIFO-Bahn, E-Kanban, elektronisches Kanban, CONWIP, POLCA, Drum-Buffer-Rope, Heijunka-Box, Pitch, sechs Kanban-Regeln Toyota, Kanban und MRP, Kanban im ERP, Kanban SAP, Kanban-Kennzahlen, Kanban einführen |
| Suchintention | Gemischt. "Kanban" allein ist mehrdeutig: Die Suchergebnisse mischen Seiten zur Fertigung mit Seiten zu Software-Boards. Diese Seite bedient die Fertigungsabsicht: informational (was ist Kanban, wie funktioniert das Pull-Prinzip) plus praktisch (Kanban-Regelkreise dimensionieren, gestalten und einführen). Die Software-Bedeutung wird in einem Abschnitt behandelt, damit fehlgeleitete Leser eine Antwort und einen Verweis bekommen. Zielgruppe: Werksleitung, Materialwirtschaft und Produktionssteuerung, Lean-Coaches, Studierende des Wirtschaftsingenieurwesens, ERP/MES-Teams |
| Wortzahl | H1 bis Fazit inkl. Tabellen, Glossar und FAQ (`wc -w`, 26.11.2026): **14.223 Wörter** (englische Fassung: 15.050, gleiche Zählweise; 94,5 %) |
| Sprachversion | Deutsch (`de-DE`). hreflang-Paar: `de-DE` https://www.m365.fm/learn/kanban-pull-prinzip/ <-> `en-US` https://www.m365.fm/en/learn/kanban-pull-system/ |

# Hinweis zur Wettbewerbsanalyse

Die Wettbewerbsanalyse der englischen Fassung bezieht sich auf google.com (USA). Für google.de steht ein eigener SERP-Check (z. B. mit NEURONwriter) noch aus; dabei auch prüfen, wie stark "Kanban" auf google.de von Software-Board-Seiten belegt ist und ob "Kanban Produktion" oder "Kanban-System" das stärkere Hauptkeyword ist.

# Kanban in der Produktion: wie das Pull-Prinzip funktioniert, wie man Kanban-Regelkreise dimensioniert und wann man etwas anderes einsetzt

*Stand: November 2026 · Lesezeit: etwa 50 Minuten (Schnelleinstieg: Kurzantwort, "Das Wichtigste in Kürze", der Abschnitt zur Dimensionierung und die Vorlagen)*

> **Kurzantwort:** Ein Kanban-System ist eine verbrauchsgesteuerte Art, Produktion und Materialfluss zu steuern: Ein Signal (eine Karte, ein leerer Behälter oder eine elektronische Nachricht) erlaubt einem vorgelagerten Prozess erst dann, eine feste Menge herzustellen oder zu transportieren, wenn der nachgelagerte Prozess sie verbraucht hat. Die Zahl der Signale in einem Regelkreis begrenzt den Bestand. Das Lean Enterprise Institute definiert ein Kanban als "ein Signalmittel, das Freigabe und Anweisungen für die Herstellung oder Entnahme (den Transport) von Teilen in einem Pull-System gibt" [1]; entwickelt wurde die Methode bei Toyota unter Taiichi Ohno [7][10].

> **Das Wichtigste in Kürze**
> - Ein Pull-System ist durch eine einzige Eigenschaft definiert: Es begrenzt den Umlaufbestand (Work in Process, WIP) ausdrücklich [2]. Kanban ist das bekannteste Pull-System, aber auch CONWIP, POLCA und Drum-Buffer-Rope gehören dazu.
> - Kanban in der Fertigung (Karten, Behälter, Supermärkte) ist nicht dasselbe wie ein Kanban-Board aus der Software, auch wenn die Board-Methode daraus abgeleitet wurde [22].
> - Grundarten: Produktionskanban, Entnahme- bzw. Transportkanban, Signalkanban (Dreieckskanban) und Lieferantenkanban [1]. Zwei-Behälter-Systeme und E-Kanban sind physische und digitale Formen derselben Logik.
> - Grunddimensionierung: Anzahl Kanbans = Bedarf × Wiederbeschaffungszeit × (1 + Sicherheitsfaktor) ÷ Behältermenge, aufgerundet. Reale Regelkreise brauchen zusätzlich Kanbans für Sammelintervalle und vorgelagerte Losgrößen [12][13][15].
> - Kanban braucht stabilen, wiederkehrenden Bedarf je Sachnummer, kurze Rüstzeiten und zuverlässige Prozesse. Für Fertigung mit hoher Variantenvielfalt und kleinen Stückzahlen passen CONWIP oder POLCA meist besser [3][20].
> - ERP/MRP und Kanban sind keine Gegner: MRP plant Kapazität und Material mit langer Wiederbeschaffungszeit, Kanban steuert den täglichen Nachschub. Die meisten ERP-Systeme haben ein Kanban-Modul mit eigener Dimensionierungsformel [15][16].
> - Kanban baut überschüssigen Bestand ab; strategische Puffer gegen Störungen sind eine eigene Risikoentscheidung. Toyota selbst hält seit einem nach 2011 eingeführten Kontinuitätsplan bewusst einen Halbleiterpuffer [26].

## Inhaltsverzeichnis

1. [Was ist ein Kanban-System?](#was-ist-ein-kanban-system)
2. [Kanban in der Fertigung vs. Kanban-Board: die Verwechslung in der Suche auflösen](#kanban-in-der-fertigung-vs-kanban-board-die-verwechslung-in-der-suche-auflösen)
3. [Push vs. Pull: was ein Pull-System wirklich ist](#push-vs-pull-was-ein-pull-system-wirklich-ist)
4. [Geschichte: von Toyotas mechanischer Fertigung zur weltweiten Praxis](#geschichte-von-toyotas-mechanischer-fertigung-zur-weltweiten-praxis)
5. [Wie ein Kanban-Regelkreis funktioniert, Schritt für Schritt](#wie-ein-kanban-regelkreis-funktioniert-schritt-für-schritt)
6. [Kanban-Arten](#kanban-arten)
7. [Toyotas sechs Kanban-Regeln](#toyotas-sechs-kanban-regeln)
8. [Anzahl der Kanbans berechnen: Formeln und Rechenbeispiele](#anzahl-der-kanbans-berechnen-formeln-und-rechenbeispiele)
9. [Supermärkte, FIFO-Bahnen und der Schrittmacherprozess](#supermärkte-fifo-bahnen-und-der-schrittmacherprozess)
10. [Heijunka: den Plan glätten, von dem Kanban abhängt](#heijunka-den-plan-glätten-von-dem-kanban-abhängt)
11. [Mehr als Kanban: CONWIP, POLCA und Drum-Buffer-Rope](#mehr-als-kanban-conwip-polca-und-drum-buffer-rope)
12. [E-Kanban und das Zusammenspiel mit ERP/MRP](#e-kanban-und-das-zusammenspiel-mit-erpmrp)
13. [Vorlagen: Karte, Dimensionierungsblatt, Supermarkt-Checkliste, Audit](#vorlagen-karte-dimensionierungsblatt-supermarkt-checkliste-audit)
14. [Kanban in der Produktion einführen: Roadmap über 26 Wochen](#kanban-in-der-produktion-einführen-roadmap-über-26-wochen)
15. [Kanban-Kennzahlen und die Sicht des Controllings](#kanban-kennzahlen-und-die-sicht-des-controllings)
16. [Typische Kanban-Fehler und wie man sie behebt](#typische-kanban-fehler-und-wie-man-sie-behebt)
17. [Grenzen: wann Kanban das falsche Werkzeug ist](#grenzen-wann-kanban-das-falsche-werkzeug-ist)
18. [Kanban-Glossar](#kanban-glossar)
19. [FAQ: Fragen zu Kanban und Pull-Prinzip](#faq-fragen-zu-kanban-und-pull-prinzip)
20. [Fazit und erste Schritte](#fazit-und-erste-schritte)

## Was ist ein Kanban-System?

Ein Kanban-System ist ein Satz von Regeln und Signalen, der Produktion und Materialfluss an den tatsächlichen Verbrauch koppelt. Wenn ein nachgelagerter Prozess einen Behälter mit Teilen verbraucht, geht der leere Behälter oder seine Karte zurück an den vorgelagerten Prozess. Dieses Signal ist die einzige Freigabe, Ersatz herzustellen oder zu transportieren. Kein Signal, keine Produktion. Das japanische Wort Kanban bedeutet "Zeichen" oder "Schild" [1]. In der Praxis ist Kanban ein visuelles System. Ein leerer Behälter oder eine Karte im Kanban-Briefkasten ist ein visuelles Signal, eines der einfachsten auf dem Shopfloor: Jeder kann es lesen, ohne Bericht und ohne Bildschirm.

Drei Dinge lassen ein Kanban-System funktionieren:

1. **Eine feste Zahl von Signalen je Regelkreis.** Jede Karte oder jeder Behälter steht für einen Behälter mit fester Menge. Die Zahl der umlaufenden Karten ist der höchste Bestand, den dieser Regelkreis überhaupt halten kann.
2. **Ein festgelegter Lagerort.** Die Teile warten in einem Supermarkt oder am Verbrauchsort, an einer Adresse, die auf der Karte steht [1].
3. **Regeln, an die sich alle halten.** Nichts wird ohne Kanban hergestellt, die Karte bleibt bei den Teilen, fehlerhafte Teile werden nicht weitergegeben [10][11].

Eine Kanban-Karte zeigt typischerweise Teilebezeichnung, Sachnummer, den externen Lieferanten oder liefernden internen Prozess, die Füllmenge, den Lagerplatz und die Adresse des verbrauchenden Prozesses [1]. Kanbans können Papierkarten, Metallschilder, leere Behälter, farbige Kugeln oder elektronische Nachrichten sein; das Medium zählt weniger als die Disziplin.

### Kanban, Pull und Just-in-Time: wie die Begriffe zusammenhängen

Die drei Begriffe werden oft gleichbedeutend verwendet. Das sind sie nicht:

| Begriff | Was er ist | Zusammenhang |
|---|---|---|
| Just-in-Time (JIT) | Ein Produktionsprinzip: nur das herstellen, was gebraucht wird, wann es gebraucht wird, in der Menge, in der es gebraucht wird [8] | Eine der beiden Säulen des Toyota-Produktionssystems, neben Jidoka [8] |
| Pull-System | Eine Steuerungslogik, die den Umlaufbestand ausdrücklich begrenzt, sodass Arbeit nur begonnen wird, wenn nachgelagert Platz oder Bedarf da ist [2] | Der Mechanismus, der JIT möglich macht |
| Kanban | Ein bestimmtes Signalmittel mit Regelwerk, das Pull umsetzt [1] | Eine Art, ein Pull-System zu bauen; andere sind CONWIP, POLCA und Drum-Buffer-Rope |

Toyota beschreibt den Nachschubkreislauf hinter JIT schlicht: An der Linie liegt ein Minimum an Teilen, und vorgelagerte Prozesse füllen auf, was nachgelagerte Prozesse entnehmen, sodass nur hergestellt wird, was sich verkauft (sinngemäß nach Toyotas TPS-Seite) [8]. Kanban ist das Anweisungssystem, das diesen Kreislauf trägt. Deshalb ist Kanban eines der Kernwerkzeuge im Lean Management: Es macht aus dem Lean-Prinzip Pull eine tägliche Routine. Kanban beseitigt Verschwendung nicht von selbst, aber es begrenzt die Überproduktion, eine von Ohnos sieben Verschwendungsarten, und macht die übrige Verschwendung sichtbar.

### Vorteile eines Kanban-Systems in der Produktion

Die Vorteile von Kanban folgen aus der Begrenzung des Umlaufbestands, nicht aus den Karten:

- **Niedrigerer und vorhersehbarer Bestand.** Der Regelkreis kann nicht mehr halten als Karten × Behältermenge; das begrenzt Überbestand, Lagerfläche und Bestandskosten.
- **Kürzere Durchlaufzeit.** Nach Littles Gesetz ist die mittlere Durchlaufzeit gleich dem mittleren Umlaufbestand geteilt durch den Durchsatz [6]. Wer den Bestand deckelt, deckelt die Durchlaufzeit.
- **Sichtbare Probleme.** Wenn ein Regelkreis knapp wird, sehen es alle. Genau das ist der Sinn von Toyotas Regel, die Kanbans schrittweise zu verringern [10].
- **Weniger Planungsaufwand.** Nur ein Prozess, der Schrittmacher, bekommt einen Plan; vorgelagerte Prozesse folgen den Signalen.
- **Weniger Feuerwehreinsätze.** Nachschub ist Routine statt Ausnahme.

Diese Vorteile sind an Bedingungen geknüpft. Wettbewerberseiten nennen 25 Prozent weniger Bestand oder 50 Prozent kürzere Durchlaufzeit, ohne Werk, Ausgangsbasis oder Methode zu nennen. Dieser Leitfaden wiederholt solche Zahlen nicht. Was sich im eigenen Werk messen lässt, zeigt der Abschnitt zu den Kennzahlen, mit Formeln.

## Kanban in der Fertigung vs. Kanban-Board: die Verwechslung in der Suche auflösen

Wer nach "Kanban" gesucht und Haftnotizen auf einem Whiteboard oder ein Projektmanagement-Werkzeug erwartet hat, ist auf dem Fertigungsast eines Stammbaums gelandet. Die Software-Bedeutung, oft mit großem K als "Kanban-Methode" geschrieben, beschreibt Wikipedia als "eine Lean-Methode, um Arbeit in menschlichen Systemen zu steuern und zu verbessern"; David J. Andersons Buch *Kanban: Successful Evolutionary Change for Your Technology Business* von 2010 beschrieb, wie sie aus Projekten bei Microsoft und Corbis entstand, und die Methode führt ihre Wurzeln auf Toyotas Just-in-Time-Produktion zurück [22].

Beide teilen die Idee, die Menge der laufenden Arbeit zu begrenzen. In fast allem anderen unterscheiden sie sich:

| Aspekt | Kanban in der Fertigung | Kanban-Board (Wissensarbeit) |
|---|---|---|
| Was fließt | Physische Teile in Standardbehältern | Aufgaben, Tickets, User Stories |
| Das Signal | Karte, leerer Behälter oder elektronische Nachricht, die eine feste Menge freigibt | Eine Karte für ein Arbeitspaket; WIP-Limits je Spalte |
| Wer zieht | Der nachgelagerte Prozess entnimmt Teile; der vorgelagerte ersetzt genau diese | Ein Teammitglied zieht das nächste Element, wenn Kapazität frei wird |
| Dimensionierung | Formel aus Bedarf, Wiederbeschaffungszeit, Behältergröße und Sicherheit | WIP-Limits nach Einschätzung des Teams und Flusskennzahlen |
| Typisches Versagen | Fehlteile, überlaufende Supermärkte, verlorene Karten | überladene Spalten, versteckte Arbeit |
| Wichtige Standardtexte | Ohnos TPS-Buch, LEI-Lexikon, Toyota-Handbücher [1][9][11] | Anderson (2010) und spätere Literatur zur Kanban-Methode [22] |

Manche Wettbewerberseiten mischen beide Bedeutungen, etwa indem sie auf einer Seite über Fertigungsbestände Kanban mit Scrum vergleichen. Das verwirrt Leser aus dem Werk. Der Rest dieses Leitfadens handelt vom Kanban-System in der Fertigung: Teile, Behälter, Regelkreise, Formeln. Wer ein Kanban-Board für ein Entwicklungs- oder Büroteam oder einen agilen Softwareablauf aufbauen will, kann die Prinzipien der WIP-Limits und des sichtbaren Arbeitsflusses übernehmen, die Dimensionierungsformeln unten aber nicht.

## Push vs. Pull: was ein Pull-System wirklich ist

Die Alltagserklärung lautet: "Push fertigt nach Prognose, Pull fertigt nach Bedarf." Das kommt nahe, ist aber nicht genau genug, um ein System zu gestalten. Wallace Hopp und Mark Spearman schlugen eine sauberere Definition vor: "Ein Pull-Produktionssystem ist eines, das die Menge an Umlaufbestand, die sich im System befinden kann, ausdrücklich begrenzt" [2]. Ihr Aufsatz argumentiert, dass die Praktikerliteratur Pull und Lean zu stark vereinfacht hat und dass Pull im Kern eine Art ist, den Umlaufbestand zu deckeln [2].

Diese Definition hat praktische Folgen:

- **Eine Lagerfertigungslinie mit Kanban ist Pull,** weil die Karten Umlauf- und Fertigwarenbestand deckeln.
- **Auch eine Auftragsfertigungslinie kann Pull sein,** wenn Aufträge nur dann eingesteuert werden, wenn eine Bestandsobergrenze es erlaubt (CONWIP, POLCA).
- **Ein Werk, das "nach Kundenauftrag fertigt", aber jeden Auftrag sofort nach Erfassung in die Werkstatt freigibt, ist Push,** obwohl der Bedarf echt ist. Der Umlaufbestand wächst mit dem Auftragsbestand.

Der traditionelle Ansatz in der Fertigung ist Push. Ein Planungssystem, meist die Materialbedarfsplanung (Material Requirements Planning, MRP) in einem ERP-System, ermittelt aus Prognosen und Vergangenheitsdaten die Produktionsmenge und gibt Fertigungsaufträge frei, bevor ein Kundenauftrag eingegangen ist. In einem Pull-System beginnt die Produktion erst, wenn nachgelagerter Verbrauch oder ein Kundenauftrag Platz unter der Bestandsobergrenze schafft. Einfach gesagt ist ein Pull-System eine Methode der Produktionssteuerung, die vom tatsächlichen Bedarf getrieben wird; die beiden Systeme unterscheiden sich weniger in ihren Daten als darin, was die Arbeit auslöst.

### Littles Gesetz: warum ein gedeckelter Bestand die Durchlaufzeit deckelt

John Little veröffentlichte 1961 den Beweis der Warteschlangenformel L = λW [6]. In der Sprache der Fabrik: mittlerer Umlaufbestand = Durchsatz × mittlere Durchlaufzeit, oder Durchlaufzeit = Umlaufbestand ÷ Durchsatz.

**Rechenbeispiel.** Eine Zerspanungszelle liefert 400 Teile pro Tag. Eine Zählung im Werk findet 3.200 Teile Umlaufbestand zwischen Säge und Endprüfung. Mittlere Durchlaufzeit = 3.200 ÷ 400 = 8 Tage. Wenn ein Pull-System den Umlaufbestand auf 1.200 Teile deckelt und der Durchsatz bei 400 pro Tag bleibt, sinkt die mittlere Durchlaufzeit auf 1.200 ÷ 400 = 3 Tage. Die Maschinen sind nicht schneller geworden. Die Teile warten einfach weniger.

Littles Gesetz gilt für langfristige Mittelwerte in einem stabilen System [6]. Es sagt nicht, wie weit man den Bestand senken kann, bevor der Durchsatz leidet. Das hängt von der Schwankung ab; deshalb brauchen Pull-Systeme einen gewissen Puffer, und deshalb enthalten die Dimensionierungsformeln Sicherheitsanteile.

### Push vs. Pull: die wichtigsten Unterschiede und Mischformen

| Kriterium | Push (MRP-gesteuerte Freigabe) | Pull (Kanban, CONWIP, POLCA) |
|---|---|---|
| Auslöser der Produktion | Planauftragsfreigabe aus Prognose oder Aufträgen | Verbrauch oder eine freie Bestandsfreigabe |
| Umlaufbestand | Nicht gedeckelt; folgt dem Plan und seinen Fehlern | Gedeckelt durch die Zahl der Karten oder Freigaben [2] |
| Durchlaufzeit | Schwankend, wächst oft mit der Last | Stabil, solange die Bestandsobergrenze hält (Littles Gesetz) [6] |
| Reaktion auf Prognosefehler | Überproduktion oder Fehlmenge | Korrigiert sich innerhalb der Spannweite des Regelkreises selbst |
| Datenbedarf | Genaue Stücklisten, Arbeitspläne, Wiederbeschaffungszeiten, Bestände | Genaue Behälterzahlen, Kartendisziplin |
| Passt zu | Langen Wiederbeschaffungszeiten, komplexen Stücklisten, geringer Menge je Teil | Wiederkehrendem Bedarf, kurzen Wiederbeschaffungszeiten |

Die meisten Werke fahren Mischformen. Ein von einem Anbieter verfasster Beitrag in IndustryWeek argumentiert, dass eine Kombination aus Push und Pull bei schwankendem Bedarf am besten sein kann [25]. In der Praxis heißt das meist: MRP plant Kapazität und Zukaufteile mit langer Wiederbeschaffungszeit, Kanban oder CONWIP steuern die tägliche Freigabe. Der ERP-Abschnitt unten zeigt, wie. Die Wahl zwischen Push und Pull ist daher selten eine Entscheidung für das ganze Werk; sie fällt je Sachnummer und je Prozessschritt.

## Geschichte: von Toyotas mechanischer Fertigung zur weltweiten Praxis

Kanban ist aus dem Toyota-Produktionssystem hervorgegangen. Toyota schreibt Kiichiro Toyoda (1894–1952) das Just-in-Time-Konzept zu und vermerkt, dass er bis 1927 Kettenförderer-Fluss in die Webstuhlmontage und bis 1938 in die Karosseriemontagelinie im Werk Koromo einführte [8]. Eine Bildunterschrift auf Toyotas TPS-Seite schreibt Taiichi Ohno (1912–1990) zu, "das Grundgerüst der Just-in-Time-Methode geschaffen" zu haben [8].

Laut dem Wikipedia-Artikel zu Kanban wendete Toyota die Kanban-Logik 1953 in der mechanischen Fertigung seines Stammwerks an [10]. Derselbe Artikel sagt, Toyota habe Ende der 1940er Jahre Supermärkte studiert, mit der Idee, deren Regalauffüllung auf den Shopfloor zu übertragen; dieser Satz trägt dort keinen Beleg, behandeln Sie die Jahreszahl daher als [unbelegt]. Die Supermarkt-Analogie selbst ist so zentral, dass "Supermarkt" zum Lean-Begriff für einen gesteuerten Bestandspunkt wurde.

Die erste englischsprachige wissenschaftliche Beschreibung stammt von Toyota-Ingenieuren. Sugimori und drei Mitautoren veröffentlichten 1977 im *International Journal of Production Research* den Aufsatz "Toyota production system and Kanban system: Materialization of just-in-time and respect-for-human system" [7]. Er nennt zwei Merkmale: Just-in-Time-Produktion, bei der nur die notwendigen Produkte zur notwendigen Zeit in der notwendigen Menge hergestellt werden, und ein System des "Respekts vor dem Menschen", in dem Beschäftigte ihre Fähigkeiten voll einsetzen, indem sie an Führung und Verbesserung ihrer Werkstatt mitwirken [7]. Ohnos eigenes Buch, *Toyota Production System: Beyond Large-Scale Production*, erschien 1988 auf Englisch [9].

Ab den 1980er Jahren begannen westliche Forscher, die Methode zu analysieren und abzuwandeln. Spearman, Woodruff und Hopp stellten 1990 CONWIP als "Pull-Alternative zu Kanban" vor [3]. Co und Moosa untersuchten 1997 Toyotas eigene Kanban-Formel [14]. Rajan Suri, der von 1993 bis 2007 das Center for Quick Response Manufacturing an der University of Wisconsin–Madison gründete und leitete, entwickelte POLCA für Betriebe mit hoher Variantenvielfalt und kleinen Stückzahlen [20][21]. Eine Literaturübersicht von Lage Junior und Godinho Filho aus dem Jahr 2010 zählte 32 veröffentlichte Varianten des Kanban-Systems und fand eine große Lücke zwischen theoretischen und praktischen Vorschlägen [17]. Die Kernlogik des Regelkreises aus den 1950er Jahren hat sie alle überlebt.

## Wie ein Kanban-Regelkreis funktioniert, Schritt für Schritt

Die klassische Toyota-Gestaltung verwendet zwei Kartenarten: Entnahmekanbans, die Teile vom Supermarkt zum Verbraucher bringen, und Produktionskanbans, die dem liefernden Prozess sagen, Ersatz herzustellen [1]. Hier ein vollständiger Zyklus zwischen einer Montagelinie und einer Stanz- und Schweißzelle, die Halter liefert.

| Schritt | Wo | Was passiert | Signal |
|---|---|---|---|
| 1 | Montagelinie, Verbrauchsort | Der Werker nimmt den letzten Halter aus einem Behälter; der leere Behälter geht ins Leergutregal | Entnahmekanban wird abgenommen und in den Kanban-Briefkasten gesteckt |
| 2 | Kanban-Briefkasten | Ein Logistiker sammelt die Entnahmekanbans auf einer festen Route ein, etwa alle 30 oder 60 Minuten | Gesammelte Entnahmekanbans |
| 3 | Supermarkt hinter der Halterzelle | Der Logistiker nimmt je Entnahmekanban einen vollen Behälter; das Produktionskanban an diesem Behälter wird abgenommen und in den Produktionskanban-Briefkasten gesteckt | Entnahmekanban kommt an den vollen Behälter; Produktionskanban geht an die Zelle |
| 4 | Montagelinie | Der volle Behälter kommt an seiner Adresse am Verbrauchsort an | Entnahmekanban reist mit den Teilen |
| 5 | Halterzelle | Produktionskanbans werden der Reihe nach aufgereiht, oft auf einer Heijunka-Tafel oder einer einfachen Schiene | Jedes Produktionskanban gibt einen Behälter frei |
| 6 | Halterzelle | Die Zelle fertigt genau die Menge auf der Karte und stellt den vollen Behälter mit angehängtem Produktionskanban zurück in den Supermarkt | Produktionskanban wieder am Behälter |

Zwei Merkmale übersieht man leicht:

- **Der Supermarkt ist der Puffer, nicht die Linie.** Die Linie hält nur, was sie zwischen zwei Anlieferungen verbraucht. Der Supermarkt fängt den Unterschied zwischen dem Losrhythmus der Zelle und dem gleichmäßigen Verbrauch der Linie ab.
- **Die Karten messen den Bestand.** Wenn es 12 Produktionskanbans für den Halter B-200 gibt und 3 an der Zelle warten, sind 9 Behälter entweder voll im Supermarkt, unterwegs oder an der Linie. Eine kurze Zählung zeigt, ob Karten verloren gegangen sind oder Behälter gehortet werden.

Eine einfachere Variante mit nur einer Karte verzichtet auf das Entnahmekanban: Der Verbraucher nimmt einen Behälter aus einem nahen Lager, und der leere Behälter oder eine Produktionskarte geht direkt an den liefernden Prozess zurück. Das ist einfacher und funktioniert gut, wenn Lieferant und Verbraucher nah beieinander liegen.

## Kanban-Arten

Das Lean Enterprise Institute nennt zwei Grundfamilien, Produktionskanban und Entnahmekanban, mit dem Signalkanban als besonderem Produktionskanban und dem Lieferantenkanban als besonderem Entnahmekanban [1]. Anbieter und Lehrbücher ergänzen weitere Bezeichnungen; deshalb unterscheiden sich Listen der Kanban-Arten von Seite zu Seite. Die Tabelle ordnet sie danach, was sie freigeben.

| Art | Gibt frei | Typischer Einsatz | Anmerkungen |
|---|---|---|---|
| Produktionskanban | Den vorgelagerten Prozess, Art und Menge auf der Karte für einen nachgelagerten Prozess herzustellen [1] | Zellen und Maschinen mit kurzen Rüstzeiten, die Behälter für Behälter fertigen können | Eine Karte = ein Behälter |
| Signalkanban (Dreieckskanban) | Die Fertigung eines Loses, wenn der Bestand auf einen Auslösepunkt fällt, "wenn eine Mindestmenge an Behältern erreicht ist" [1] | Pressen, Spritzguss, Wärmebehandlung, Lackierung: Prozesse mit langen Rüstzeiten, die in Losen laufen müssen | Hängt am Meldepunkt im Behälterstapel; oft dreieckige Metallschilder |
| Entnahmekanban (Transportkanban) | Den Transport von Teilen zu einem nachgelagerten Prozess [1] | Zwischen Supermarkt und Linie | Internes Kanban bzw. Kanban zwischen Prozessen [1] |
| Lieferantenkanban | Die Entnahme bei einem externen Lieferanten [1] | Zukaufteile mit regelmäßigem Verbrauch | Das LEI merkt an, dass Lieferantenkanbans für weit entfernte Lieferanten typischerweise elektronisch umgesetzt werden [1] |
| Zwei-Behälter-System (und Drei-Behälter-System) | Den Nachschub eines Behälters, wenn er leer ist, während der zweite Behälter den Verbrauch abdeckt | Schrauben, Verbrauchsmaterial, günstige C-Teile | Der leere Behälter ist das Signal; Wikipedia beschreibt das Zwei-Behälter-System als einfachsten Ursprung von Kanban und beschreibt auch eine Drei-Behälter-Variante (Linie, Werkslager, Lieferant) [10] |
| Not- oder Eilkanban | Einen einmaligen zusätzlichen Nachschub nach einer Fehlmenge oder einem Fehler | Erholung nach Ausschuss oder ausgefallener Lieferung | Muss nach Gebrauch wieder eingezogen werden; sonst wächst der Regelkreis unbemerkt |
| Einmalkanban (Ereigniskanban) | Zusätzliche Teile für einen bekannten, außergewöhnlichen Bedarf | Aktionen, ein Serviceauftrag, ein Prototypenbau | Microsoft Dynamics 365 behandelt diese als Einmalkanbans, die an einer Regel mit fester Menge gekennzeichnet sind, plus Ereigniskanbans für außergewöhnlichen Bedarf über einer festgelegten Menge [15] |
| Durchlaufkanban (Tunnelkanban) | Produktion und Entnahme in einer Karte vereint | Zwei eng gekoppelte Prozesse, die wie einer laufen, etwa Schmieden und Wärmebehandlung | Von Cin7 unter seinen sechs Arten genannt; die Begriffe unterscheiden sich je nach Quelle |
| CONWIP-Karte | Die Freigabe eines beliebigen Auftrags in eine Linie; die Karte geht an den Linienanfang zurück, wenn ein Auftrag fertig ist [5] | Linien mit vielen Sachnummern, aber gemeinsamem Arbeitsgang | Nicht teilespezifisch, siehe Abschnitt CONWIP |
| E-Kanban | Jede der obigen Arten als elektronische Nachricht | Weit entfernte Lieferanten, große Regelkreise, ERP-integrierter Nachschub | Beseitigt Fehler durch verlorene Karten und manuelle Erfassung [10] |

### Welche Kanban-Art für welchen Regelkreis

| Situation | Empfohlene Art | Warum |
|---|---|---|
| Lieferzelle neben der Linie, Rüstzeit unter 10 Minuten | Produktionskanban, Ein-Karten-System | Kann Behälter für Behälter fertigen |
| Presswerk mit 45 Minuten Rüstzeit, das mehrere Linien versorgt | Signalkanban mit Supermarkt | Die Losgröße ergibt sich aus der Wirtschaftlichkeit des Rüstens, nicht aus der Behältergröße |
| Zentrallager versorgt mehrere Zellen | Entnahmekanban plus Route (Milkrun) | Trennt Transportieren von Herstellen |
| Zugekaufte Normteile, regelmäßiger Verbrauch, Lieferant ca. 800 km (500 Meilen) entfernt | Lieferanten-E-Kanban | Papierkarten reisen zu langsam |
| Schrauben, Unterlegscheiben, Etiketten, Handschuhe | Zwei-Behälter-System | Billigstes mögliches Signal, kein Zählen |
| Viele Varianten auf einer Route, Bedarf je Variante unregelmäßig | CONWIP-Karten | Teilespezifische Karten würden das Werk mit Langsamdrehern füllen |
| Werkstattfertigung mit vielen Arbeitsgangfolgen | POLCA-Karten | Steuert den Fluss zwischen Paaren von Zellen |

## Toyotas sechs Kanban-Regeln

Fast jede Wettbewerberseite listet "sechs Regeln" auf. Es kursieren zwei Fassungen, und es hilft, beide zu kennen.

**Fassung 1, wie auf Wikipedia zusammengefasst** (mit Verweis auf Toyota) [10]:

1. Jeder Prozess gibt Anforderungen (Kanbans) an seine Lieferanten aus, wenn er seinen Vorrat verbraucht.
2. Jeder Prozess fertigt nach Menge und Reihenfolge der eingehenden Anforderungen.
3. Ohne Anforderung wird nichts hergestellt oder transportiert.
4. Die Anforderung zu einem Teil ist immer an diesem Teil angebracht.
5. Prozesse dürfen keine fehlerhaften Teile weitergeben, damit die Endprodukte fehlerfrei sind.
6. Die Begrenzung der Zahl offener Anforderungen macht den Prozess empfindlicher und deckt Ineffizienzen auf.

**Fassung 2, nach dem *Toyota Production System Handbook* (1973, übersetzt von Mark Warren), wie von Christoph Roser dargestellt** [11]:

1. Keine fehlerhaften Produkte an den nachfolgenden Prozess weitergeben.
2. Der nachfolgende Prozess holt ab.
3. Nur die Menge herstellen, die der nachfolgende Prozess abgeholt hat.
4. Schwankungen verringern.
5. Kanban ist ein Mittel zur Feinsteuerung.
6. Den Produktionsprozess stabilisieren und rationalisieren.

Roser merkt an, dass "verschiedene Fassungen der Toyota-Regeln für Kanban im Umlauf sind", und ergänzt eine Regel, die er bei Toyota gelernt hat und die in keiner der beiden Listen steht: An jedem Material im System muss eine Kanban-Karte hängen [11]. Er weist außerdem darauf hin, dass die Handbuch-Fassung Voraussetzungen (keine Fehler, stabile Prozesse) mit Betriebsregeln vermischt [11].

### Was die Regeln auf dem Shopfloor bedeuten

| Regel (zusammengefasst) | Verhalten im Werk | Typischer Verstoß | Folge |
|---|---|---|---|
| Der Nachfolger zieht | Verbraucher oder Logistiker holt; der Lieferant liefert nicht unaufgefordert | Die vorgelagerte Zelle "hilft" und schiebt zusätzliche Behälter nach | Supermarkt läuft über, Karten zeigen nicht mehr den wahren Bestand |
| Nur herstellen, was entnommen wurde | Produktionskanbans legen Menge und Reihenfolge fest | "Wo wir schon gerüstet sind", eine ganze Schicht durchfahren | Versteckte Überproduktion, eine von Ohnos sieben Verschwendungsarten |
| Kein Teil ohne Karte | Jeder volle Behälter trägt seine Karte | Behälter ohne Karte in einer Ecke, "Sicherheitsbestand" | Bestand im Regelkreis unbekannt; die Kartenzahlen lügen |
| Die Karte bleibt bei den Teilen | Nur im festgelegten Moment abnehmen | Karten in Hosentaschen, auf Schreibtischen, in Schubladen | Verlorene Karte = verlorener Nachschub = Fehlteil |
| Keine Fehler an den Nachfolger | Schlechte Teile werden an der Quelle gestoppt und gekennzeichnet | Fehlerhafte Teile in einem vollen Behälter untergemischt | Der Verbraucher läuft mit einem "vollen" Behälter leer |
| Karten schrittweise verringern | Eine Karte herausnehmen, beobachten, Problem lösen, wiederholen | Die Hälfte der Karten auf einen Schlag streichen | Linienstillstand, Vertrauensverlust, Rückkehr zu Push |
| Glätten und stabilisieren | Der Bedarf am Schrittmacher wird geglättet; die Prozesse sind fähig | Große tägliche Schwankungen in der Endmontage | Kanban verstärkt Schwankungen nach oben (siehe Heijunka) |

Regel 6 in Fassung 1 ist die, die westliche Werke am häufigsten falsch anwenden. Roser argumentiert in einer Antwort an Leser, dass Toyota "a) viel weniger Probleme und b) viel mehr Personal zu ihrer Behebung" hat; Werke ohne diese Problemlösungskapazität sollten deshalb lieber genug Kanbans behalten, statt sie zu kürzen, um Probleme zu provozieren, die sie noch nicht lösen können [12]. Eine Karte herauszunehmen, ist ein Experiment. Führen Sie es nur durch, wenn jemand bereit ist, das zu beheben, was es aufdeckt.

## Anzahl der Kanbans berechnen: Formeln und Rechenbeispiele

Das ist die Frage, die die meisten Suchenden haben und die die meisten Seiten überspringen. Die folgenden Abschnitte beginnen mit der Grundformel, zeigen, wie die Praxis sie verfeinert, vergleichen die Formeln von ERP-Anbietern und Wettbewerbern auf denselben Daten und rechnen sechs Fälle durch. Alle sechs Kanban-Beispiele sind beispielhaft: Sie verwenden typische Werksdaten statt realer Beispiele eines namentlich genannten Unternehmens, sodass Sie jeden Schritt nachvollziehen und die Zahlen durch Ihre eigenen ersetzen können.

Vorab eine Warnung, mit Rosers Worten: "Die Kanban-Berechnung ist nichts weiter als eine sehr grobe Schätzung mit vielen Annahmen" [12]. Die Formel liefert einen Startwert. Danach wird der Regelkreis durch Beobachtung nachjustiert.

### Die Grundformel

> **Anzahl der Kanbans N = (D × L × (1 + α)) ÷ C**, aufgerundet
>
> D = mittlerer Bedarf je Zeiteinheit (zum Beispiel Stück pro Tag)
> L = Wiederbeschaffungszeit in derselben Zeiteinheit: vom Moment, in dem ein Behälter geleert (oder seine Karte freigegeben) wird, bis der volle Behälter wieder an seinem Lagerplatz steht
> α = Sicherheitsfaktor (zum Beispiel 0,10 für 10 Prozent)
> C = Behältermenge (Stück je Kanban)

Diese Struktur, Bedarf während der Wiederbeschaffungszeit plus Sicherheitszuschlag, geteilt durch die Behältermenge, verwendet Microsoft Dynamics 365 Supply Chain Management als Basis, in seinen Hauptvarianten mit einem zusätzlichen "+1" [15]. Smartsheet verwendet eine Variante mit Sicherheitsbestand in Tagen: C = [D × (L + SSD)] ÷ S, wobei SSD die Sicherheitsbestandstage und S die Menge je Behälter ist [23]. Toyotas eigene Praxis, wie von Co und Moosa analysiert, legt die Zahl der Kanbans aus dem mittleren Bedarf während eines Bestellzyklus fest, hochgerechnet mit einem konstanten Überplanungsfaktor [14].

**Rechenbeispiel 1: einfacher Regelkreis.** Die Endmontagelinie verbraucht den Halter B-200. Tagesbedarf D = 960 Stück über zwei Schichten. Wiederbeschaffungszeit aus der Halterzelle L = 0,25 Tag. Sicherheitsfaktor α = 0,10. Behältermenge C = 40.

N = 960 × 0,25 × 1,10 ÷ 40 = 264 ÷ 40 = 6,6, aufgerundet **7 Kanbans**.

Der Regelkreis kann nie mehr als 7 × 40 = 280 Halter halten, das sind 280 ÷ 960 = 0,29 Tage Bedarf. Nach Littles Gesetz verbringt ein Halter im Mittel höchstens etwa 0,29 Tage im Regelkreis, rund 4,4 Arbeitsstunden bei einem 15-Stunden-Tag [6].

### Woher L wirklich kommt: die Wiederbeschaffungszeit aufgeschlüsselt

Die Grundformel versteckt die schwierigste Eingangsgröße. L ist nicht die Zykluszeit der liefernden Maschine. Roser zerlegt die Wiederbeschaffungszeit in die Durchlaufzeit des Materialflusses plus Informationsverzögerungen: Wartezeit des Kanbans, bis die Karte eingesammelt wird, Warten, bis genug Kanbans für ein Los zusammengekommen sind, Wartezeit hinter anderen Sachnummern, Rüsten und Transport [12]. Dann ergänzt er zusätzliche Kanbans für die Losbildung, für das Warten hinter anderen Losen, für Sammelabrufe des Kunden und für Bedarfsspitzen, plus einen optionalen Sicherheitszuschlag [13].

| Bestandteil der Wiederbeschaffungszeit | Wie messen | Typischer blinder Fleck |
|---|---|---|
| Wartezeit der Karte im Kanban-Briefkasten | Sammelintervall der Route; für eine vorsichtige Schätzung das volle Intervall ansetzen | Annahme, Karten reisen ohne Verzögerung |
| Warten auf die Losbildung | Wenn die Zelle Lose aus n Behältern fährt, warten bis zu n – 1 Karten | Losgrößen beim Lieferanten ignorieren |
| Wartezeit hinter anderen Sachnummern | Reihenfolge der Zelle beobachten; vorgelagerte Lose zählen | Annahme, die Zelle sei frei, wenn die Karte ankommt |
| Rüsten | Zeitstudie oder SMED-Ausgangsbasis | Rüstvorgänge weglassen, "weil sie kurz sind" |
| Bearbeitungszeit für ein Los | Zykluszeit × Losmenge | Ein Stück statt des ganzen Loses ansetzen |
| Transport und Einlagerung | Routenzeit zum Supermarkt | Wartezeiten auf den Stapler und Schichtpausen vergessen |

**Rechenbeispiel 2: derselbe Halter mit der vollständigen Wiederbeschaffungszeit.** Zwei Schichten ergeben 900 Minuten verfügbare Zeit, also Takt = 900 ÷ 960 = 0,9375 Minuten (56,25 Sekunden) je Halter.

- Kartenabholung alle 60 Minuten: vorsichtig 60 Minuten Wartezeit
- Wartezeit an der Halterzelle hinter anderen Sachnummern: 90 Minuten
- Bearbeitung eines Behälters: 40 Stück × 30 Sekunden = 20 Minuten
- Transport und Einlagerung: 15 Minuten
- Wiederbeschaffungszeit ohne Loseffekte: 60 + 90 + 20 + 15 = 185 Minuten

In dieser Zeit verbrauchte Teile: 185 ÷ 0,9375 = 197,3 Stück, das sind 197,3 ÷ 40 = 4,93 Kanbans.

Die Zelle fertigt Halter in Losen zu vier Behältern, um das Rüsten zu begrenzen. Bis zu drei Karten können auf die Losbildung warten, also kommen 3 Kanbans hinzu: 4,93 + 3 = 7,93. Dazu 10 Prozent Sicherheitszuschlag auf den zeitabhängigen Teil (0,49): 8,42, aufgerundet **9 Kanbans**.

Die Grundformel ergab 7. Der Unterschied von zwei Karten kommt fast vollständig aus der Losgröße an der liefernden Zelle. Deshalb ist SMED, das kleinere Lose erlaubt, der übliche Hebel zur Verringerung der Kanbans, nicht strengere Regeln. Mehr zum Rüsten im [Leitfaden SMED und Rüstzeitreduzierung](https://www.m365.fm/learn/smed-ruestzeitreduzierung/).

### Dieselben Daten, verschiedene Formeln

Werke streiten oft über die "richtige" Formel, wenn sie sich eigentlich über die Eingangsgrößen uneinig sind. Die Tabelle wendet die veröffentlichten Formeln auf die Daten aus Beispiel 1 an (D = 960 pro Tag, L = 0,25 Tag, α = 0,10, C = 40). Für die Smartsheet-Formel wird der Sicherheitsfaktor von 10 Prozent in Sicherheitstage umgerechnet: 0,1 × 0,25 = 0,025 Tag.

| Quelle | Formel wie veröffentlicht | Rechnung | Ergebnis |
|---|---|---|---|
| Einfache Lehrbuchform | D × L × (1 + α) ÷ C | 960 × 0,25 × 1,1 ÷ 40 = 6,6 | 7 |
| Smartsheet [23] | D × (L + SSD) ÷ S | 960 × (0,25 + 0,025) ÷ 40 = 6,6 | 7 |
| Microsoft Dynamics 365 SCM, ohne Sicherheitsbestand [15] | (mittlerer Bedarf × Wiederbeschaffungszeit × (Sicherheitsfaktor + 1)) ÷ Menge je Ladungsträger + 1, aufgerundet | 6,6 + 1 = 7,6 | 8 |
| Oracle JD Edwards, Gleichung 1 [16] | Kanban-Größe = hoher Tagesbedarf × (Lieferzeit in Tagen + Scan-Delta in Tagen) + Sicherheitsbestand; Karten = Kanban-Größe ÷ Behältergröße | mit hohem Tagesbedarf 1.100, Lieferzeit 0,25 Tag, Scan-Delta 0, Sicherheitsbestand 40: (1.100 × 0,25 + 40) ÷ 40 = 7,9 | 8 |
| Roser schrittweise [12][13] | Wiederbeschaffungszeit ÷ Takt ÷ Teile je Kanban + zusätzliche Kanbans + Sicherheit | siehe Beispiel 2 | 9 |

Die Ergebnisse reichen von 7 bis 9. Die Spanne entsteht aus drei Entscheidungen: ob eine zusätzliche Karte für den gerade verbrauchten Behälter hinzukommt (das +1 von Dynamics 365), ob Spitzen- oder Durchschnittsbedarf verwendet wird (JD Edwards nimmt den höchsten Periodenbedarf im MRP-Zeitfenster [16]) und ob Loseffekte gezählt werden (Roser [13]). Entscheiden Sie diese drei Punkte einmal, schreiben Sie sie in Ihren Kanban-Standard und wenden Sie sie auf jeden Regelkreis an.

### Rechenbeispiel 3: Lieferantenkanban

Bei Zukaufteilen umfasst die Wiederbeschaffungszeit das Bestellintervall (wie oft Karten oder Signale verschickt werden), die Lieferzeit des Lieferanten und die Transportzeit. Eine gängige Form ist:

> **N = D × (Bestellintervall + Lieferzeit des Lieferanten + Sicherheitszeit) ÷ C**

Ein Gehäuse wird mit 300 Stück pro Tag verbraucht. Signale gehen einmal täglich an den Lieferanten (Bestellintervall 1 Tag), der Lieferant braucht 3 Tage vom Signal bis zur Lieferung, und das Werk will 1 Tag Sicherheitszeit. Behälter fassen 100 Stück.

N = 300 × (1 + 3 + 1) ÷ 100 = 1.500 ÷ 100 = **15 Kanbans**. Der höchste Bestand im Regelkreis liegt bei 1.500 Stück oder 5 Tagen Verbrauch, der größte Teil davon in der Pipeline beim Lieferanten oder auf dem Lkw statt im Werk.

Geht das Werk von täglichen auf zweimal tägliche Signale über (Bestellintervall 0,5 Tag), ist N = 300 × 4,5 ÷ 100 = 13,5, also 14 Kanbans. Sinkt die Lieferzeit des Lieferanten von 3 auf 2 Tage, ist N = 300 × 4 ÷ 100 = 12. Die Lieferzeit des Lieferanten ist meist der größere Hebel.

### Rechenbeispiel 4: Signalkanban für einen Losprozess

Signalkanbans werden anders dimensioniert, weil der liefernde Prozess ein Los fertigt, das viel größer ist als ein Behälter. Es braucht zwei Zahlen: den Meldepunkt (wann ein Los gestartet wird) und die Losgröße (wie viel gefertigt wird).

Eine Stanzpresse liefert unter anderem das Teil P-17. Der Bedarf beträgt 1.200 Stück pro Tag bei 900 verfügbaren Minuten, also 1,333 Stück pro Minute. Behälter fassen 60 Stück, die Linie verbraucht also 20 Behälter am Tag. Weil die Presse 40 Minuten zum Rüsten braucht, hat die Planung ein Los von 10 Behältern (600 Stück) festgelegt.

- Warten auf die Presse (andere Teile davor): bis zu 120 Minuten
- Rüsten: 40 Minuten
- 600 Stück zu je 3 Sekunden fertigen: 30 Minuten
- Transport zum Supermarkt: 10 Minuten
- Wiederbeschaffungszeit: 200 Minuten

Bedarf während der Wiederbeschaffung = 200 × 1,333 = 267 Stück = 4,44 Behälter. Mit einem Behälter Sicherheit liegt der Meldepunkt bei 5,44, aufgerundet 6 Behälter. Das Dreieckskanban hängt am sechsten Behälter von unten im Stapel. Erreicht die Linie diesen Behälter, bekommt die Presse ihr Signal.

Höchstbestand = Meldepunkt + Los = 6 + 10 = 16 Behälter = 960 Stück, etwa 0,8 Tage Bedarf. Wenn SMED die Rüstzeit auf 10 Minuten senkt und die Planung das Los auf 4 Behälter verringert, fällt der Höchstbestand auf etwa 6 + 4 = 10 Behälter, vorausgesetzt, die Warteschlange an der Presse bleibt gleich. Die Logik der Losgrößenbestimmung selbst behandelt der [Leitfaden zur Losgröße](https://www.m365.fm/learn/produktionsplanung-aps/losgroesse/).

### Rechenbeispiel 5: Zwei-Behälter-System für C-Teile

An einem Arbeitsplatz werden etwa 1.500 M6-Schrauben pro Woche verbraucht. Der Händler füllt einen leeren Behälter innerhalb einer Woche wieder auf, nachdem er ins Abholregal gestellt wurde. Jeder Behälter muss den Bedarf während der Wiederbeschaffung plus einen Zuschlag abdecken.

Behältergröße = 1.500 × 1 Woche × 1,2 = 1.800 Schrauben. Zwei Behälter zu 1.800 fassen zusammen 3.600 Schrauben. Ist der erste Behälter leer, wechselt der Werker zum zweiten und stellt den leeren Behälter mit seinem Etikett ins Regal. Niemand zählt Schrauben. Läuft der zweite Behälter regelmäßig leer, bevor der erste zurückkommt, stimmt entweder die Behältergröße oder die Nachfüllzeit nicht; die Lösung ist dann, beides zu messen, nicht stillschweigend einen dritten Behälter einzuführen.

### Rechenbeispiel 6: Wie empfindlich ist der Regelkreis?

Ausgehend von Beispiel 1 als Basisfall (D = 960, L = 0,25 Tag, α = 0,10, C = 40) zeigt die Tabelle, wie viele Kanbans die Grundformel ergibt, wenn sich eine Eingangsgröße ändert.

| Änderung | N (ungerundet) | Kanbans | Höchstbestand im Regelkreis |
|---|---|---|---|
| Basisfall | 6,6 | 7 | 280 |
| Wiederbeschaffungszeit halbiert auf 0,125 Tag | 3,3 | 4 | 160 |
| Wiederbeschaffungszeit verdoppelt auf 0,5 Tag | 13,2 | 14 | 560 |
| Behältermenge halbiert auf 20 | 13,2 | 14 | 280 |
| Behältermenge verdoppelt auf 80 | 3,3 | 4 | 320 |
| Bedarf um 25 Prozent auf 1.200 gestiegen | 8,25 | 9 | 360 |
| Sicherheitsfaktor 0,25 statt 0,10 | 7,5 | 8 | 320 |

Daraus folgen zwei Lehren. Erstens wirkt die Wiederbeschaffungszeit am stärksten auf den Bestand: Ihre Halbierung senkt den Höchstbestand von 280 auf 160. Zweitens senken kleinere Behälter den Höchstbestand für sich allein kaum (14 × 20 = 280); sie glätten vor allem den Fluss und machen Probleme früher sichtbar, während eine Verdopplung auf 80 den Bestand erhöht, weil beim Runden mehr verschenkt wird.

### Runden, Mindestwerte und Neuberechnung

- **Erst aufrunden, dann urteilen.** 6,6 auf 7 aufzurunden, ist klar. Roser würde in einem großen Regelkreis ein Ergebnis von 61,2 Kanbans abrunden, 61,9 aber aufrunden [13]. In kleinen Regelkreisen immer aufrunden.
- **Mindestens zwei Kanbans.** Ein Regelkreis mit einer Karte stoppt den Verbraucher jedes Mal, wenn die Karte unterwegs ist. Zwei sind das praktische Minimum; manche Werke legen drei als Hausregel fest.
- **Planmäßig neu berechnen.** Der Bedarf ändert sich. Die Größe der Regelkreise monatlich neu berechnen oder dann, wenn sich die Bedarfsprognose um mehr als eine vereinbarte Schwelle ändert (zum Beispiel 15 Prozent). Kanban-Module im ERP können das aus Bedarfsperioden tun [15].
- **Karten formell hinzufügen und entfernen.** Jede Änderung läuft über die Person, die die Kanban-Stammliste führt, mit Datum. Sonst vermehren sich die Karten.
- **Spitzen ausdrücklich planen.** Für saisonale Spitzen befristete Karten in anderer Farbe mit Enddatum ergänzen oder Einmalkanbans verwenden [15].

## Supermärkte, FIFO-Bahnen und der Schrittmacherprozess

Die Karten sind der sichtbare Teil eines Pull-Systems. Seine Struktur wird früher festgelegt, in der Soll-Wertstromkarte: wo Supermärkte stehen, wo Prozesse über FIFO-Bahnen verbunden werden und welcher einzelne Prozess den Plan bekommt. Wer diese Karte noch nicht gezeichnet hat, beginnt mit dem [Leitfaden zur Wertstromanalyse](https://www.m365.fm/learn/wertstromanalyse/); dort sind auch die Kanban-Symbole (Produktionskanban, Entnahmekanban, Signalkanban, Kanban-Briefkasten) erklärt.

### Arten von Pull-Systemen: drei Grundformen

| Form | Funktionsweise | Passt zu | Gehaltener Bestand |
|---|---|---|---|
| Supermarkt-Pull (Nachschub-Pull) | Jeder Prozess hält einen Supermarkt seiner Erzeugnisse; der Nachfolger entnimmt, der Vorgänger ersetzt das Entnommene | Vielen Wiederholteilen mit gleichmäßigem Bedarf | Jede aktive Sachnummer liegt auf Lager |
| Sequenzieller Pull | Aufträge werden am Anfang einer Kette in der Reihenfolge freigegeben, in der sie gebaut werden müssen; Prozesse sind über FIFO-Bahnen mit Höchstmenge verbunden | Vielen Varianten, geringer Menge je Variante, kurzer und vorhersehbarer Durchlaufzeit | Wenig oder kein Fertigbestand; Umlaufbestand durch die Bahngrößen gedeckelt |
| Gemischter Pull | Schnelldreher in Supermärkten, Langsamdreher auftragsbezogen in Reihenfolge gefertigt | Den meisten realen Werken | Bestand nur für Schnelldreher |

### Sachnummern segmentieren, bevor man Regelkreise gestaltet

Nicht jede Sachnummer gehört in einen Supermarkt. Eine praktische Einteilung nutzt Menge und Regelmäßigkeit des Bedarfs, oft als Runner, Repeater und Stranger bezeichnet (im Deutschen auch als Renner, Wiederholer und Exoten, vergleichbar einer XYZ-Analyse).

| Segment | Profil (Beispielschwellen, selbst festlegen) | Steuerungsmethode |
|---|---|---|
| Runner | Bedarf an jedem Tag, geringe Schwankung (zum Beispiel Variationskoeffizient unter 0,5) | Supermarkt mit Produktions- oder Signalkanban |
| Repeater | Bedarf in den meisten Wochen, mittlere Schwankung | Supermarkt mit weniger Karten oder Auftragsfertigung mit kleinem FIFO-Puffer |
| Stranger | Sporadisch, kundenspezifisch oder neu | Auftragsfertigung, freigegeben über CONWIP- oder POLCA-Freigabe, oder per MRP geplant |

Der Variationskoeffizient ist die Standardabweichung des Tages- (oder Wochen-)Bedarfs geteilt durch seinen Mittelwert. Ein Teil mit einem Mittelwert von 100 pro Tag und einer Standardabweichung von 30 hat VK = 0,3. Ein Teil mit einem Mittelwert von 10 pro Tag und einer Standardabweichung von 15 hat VK = 1,5 und ist ein schlechter Kanban-Kandidat: Sein Regelkreis müsste genug Bestand für seltene Spitzen halten, also stünden die Behälter die meiste Zeit nur herum.

### Einen Supermarkt gestalten

| Gestaltungspunkt | Faustregel | Warum |
|---|---|---|
| Standort | Neben dem liefernden Prozess, nicht beim Verbraucher | Der Lieferant sieht seinen eigenen Bestand und ersetzt ihn; der Logistiker holt |
| Adressierung | Jede Sachnummer hat eine feste Adresse (Gang, Regal, Ebene, Fach), die auf der Karte steht [1] | Verlorene Behälter werden sichtbar; Nachschub geht schnell |
| Kapazität | Physische Stellplätze für genau die Höchstzahl der Behälter im Regelkreis, nicht mehr | Überproduktion hat keinen Platz; sie wird sichtbar |
| Flussrichtung | Von hinten beschicken, vorne entnehmen (Durchlaufregale mit Schwerkraft) | First in, first out durch die Bauart |
| Sichtbares Max/Min | Farbmarkierungen oder Position des Signalkanbans am Regal | Jeder sieht den Status ohne System |
| Behälterstandard | Vereinbarter Behälter je Sachnummer mit fester Menge; ergonomisches Gewicht | Zählen in Behältern statt in Stück |
| Sicherheit und Ergonomie | Schwere Behälter zwischen Knie- und Schulterhöhe lagern; Heben und Greifen anhand der Ergonomie-Hinweise der US-Arbeitsschutzbehörde OSHA prüfen [28] | Logistiker wiederholen diese Bewegungen hunderte Male pro Schicht |

### FIFO-Bahnen: die Warteschlange dimensionieren

Eine FIFO-Bahn ist eine Warteschlange mit Höchstmenge zwischen zwei Prozessen. Ist sie voll, stoppt der liefernde Prozess; ist sie leer, wartet der Verbraucher. Anders als ein Supermarkt hält sie keinen Bestand je Sachnummer, sondern nur eine Reihenfolge von Aufträgen.

**Dimensionierungsbeispiel.** Eine Lackierlinie übernimmt Aufträge aus einer Schweißzelle. Das Schweißen liefert etwa einen Auftrag alle 10 Minuten; die Lackierung verbraucht im Mittel im gleichen Takt, stoppt aber zweimal pro Schicht für 90-minütige Farbwechsel. Die FIFO-Bahn muss die Schweißausbringung während eines Farbwechsels aufnehmen: 90 ÷ 10 = 9 Aufträge. Mit einem Zuschlag von 3 fasst die Bahn 12 Aufträge. Nach Littles Gesetz wartet ein Auftrag höchstens etwa 12 × 10 = 120 Minuten in der Bahn [6].

Ist die Bahn oft voll, ist die Lackierung der Engpass oder der Farbwechsel zu lang. Ist sie oft leer, liegt das Problem beim Schweißen. In beiden Fällen macht die Bahn es sichtbar. Das ist ihre Aufgabe.

### Der Schrittmacher: ein einziger Planungspunkt

In einem Pull-System bekommt nur ein Prozess einen Produktionsplan: der Schrittmacher (Pacemaker). Meist ist das die Endmontage oder der letzte Prozess mit kontinuierlichem Fluss vor dem Versand. Alles davor folgt Kanban-Signalen; alles danach fließt in FIFO. Bei der Planung des Schrittmachers trifft der [Leitfaden zur Produktionsplanung und APS](https://www.m365.fm/learn/produktionsplanung-aps/) auf diesen hier: APS oder Planer entscheiden, was der Schrittmacher in welcher Reihenfolge baut, die Kanban-Regelkreise entscheiden, was der Rest des Werks nachfüllt.

### Die Route des Logistikers

Supermärkte brauchen jemanden, der Karten und Behälter in einem festen Zyklus bewegt. Diese Rolle heißt oft Water Spider oder Mizusumashi. Die Route ist auf den Pitch getaktet (siehe unten): In jedem Pitch-Intervall holt der Logistiker die nächste Produktionsanweisung an der Heijunka-Box ab, bringt sie aus, sammelt Leergut und Entnahmekanbans ein und bringt volle Behälter an die Linie. Eine feste Route macht das Sammelintervall in der Dimensionierungsformel zu einem bekannten Wert statt zu einer Schätzung. Takten Sie die Route gemeinsam mit dem Logistiker und lassen Sie einen Zuschlag für Verzögerungen und Pausen; eine Route, die nie in den Pitch passt, ist Überlastung (Muri), und sie wird genau dann ausgelassen, wenn an der Linie am meisten los ist. Werksinterne Routen und Milkruns vertieft der [Leitfaden zur Intralogistik](https://www.m365.fm/learn/produktionsplanung-aps/intralogistik/).

## Heijunka: den Plan glätten, von dem Kanban abhängt

Kanban reagiert auf Verbrauch. Baut der Schrittmacher am Montag 300 Einheiten von Modell A und am Dienstag keine, sieht jeder vorgelagerte Regelkreis für Modell A eine Spitze und dann nichts. Die Regelkreise müssen für die Spitze dimensioniert werden, und der Bestand wächst. Die Glättung des Schrittmacherplans verhindert das.

Das Lean Enterprise Institute definiert Heijunka als "Glättung von Art und Menge der Produktion über einen festen Zeitraum" [18]. Seine zwei Beispiele sind die Standardreferenz:

- **Mengenglättung:** Ein Hersteller erhält 500 Aufträge pro Woche, von 200 am Montag bis 50 am Mittwoch und am Freitag, hält einen kleinen Fertigwarenpuffer nahe am Versand und fertigt gleichmäßig 100 pro Tag [18].
- **Mixglättung:** Bei einem Wochenbedarf von 5 A, 3 B, 2 C und 2 D fertigt ein Massenhersteller erst alle A, dann alle B; ein Lean-Hersteller verschachtelt die Modelle in einer sich wiederholenden Reihenfolge [18].

Das LEI nennt als Vorteile kürzere Durchlaufzeiten, gleichmäßigeren Teileverbrauch, der die Lieferanten entlastet, kleinere Lose, die begrenzen, wie weit sich ein Fehler ausbreitet, und gleichmäßigere Arbeitslast für die Beschäftigten [18].

### Pitch: die Zeiteinheit eines Pull-Systems

Das LEI definiert den Pitch als "die Zeit, die ein Produktionsbereich braucht, um einen Behälter Produkte herzustellen", berechnet als Taktzeit × Packmenge; bei einem Takt von einer Minute und 20 Stück je Behälter beträgt der Pitch 20 Minuten [19].

### Rechenbeispiel: eine Heijunka-Box für die Halterlinie

Weiter mit der Zwei-Schicht-Linie aus dem Dimensionierungsabschnitt: Takt 0,9375 Minuten, Behälter zu 40 Stück.

- Pitch = 0,9375 × 40 = 37,5 Minuten
- Fächer pro Tag = 900 ÷ 37,5 = 24 (12 je Schicht)
- Tagesbedarf 960 Stück = 24 Behälter

Die Linie baut vier Modelle mit einem Tagesbedarf von A = 480, B = 240, C = 160 und D = 80 Stück, also 12, 6, 4 und 2 Behälter pro Tag oder 6, 3, 2 und 1 je Schicht.

Ein Losplan je Schicht liefe A A A A A A B B B C C D. Ein geglätteter Plan verteilt jedes Modell über die Schicht:

| Fach (alle 37,5 min) | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Modell | A | B | A | C | A | B | A | C | A | B | A | D |

Zählprobe: A kommt 6-mal vor, B 3-mal, C 2-mal, D 1-mal. In der Heijunka-Box enthält jedes Fach das Produktionskanban für einen Behälter. Der Logistiker nimmt alle 37,5 Minuten ein Kanban heraus. Steckt ein Kanban noch in der Box, wenn das nächste Fach beginnt, ist die Linie im Rückstand, und jeder sieht, um wie viel.

Die geglättete Reihenfolge braucht 11 Modellwechsel je Schicht statt 3. Das ist nur wirtschaftlich, wenn die Umstellung am Schrittmacher Sekunden oder wenige Minuten dauert; das ist der konkrete Grund, warum SMED vor der Mixglättung kommt. Der [Leitfaden zu Lean Management](https://www.m365.fm/learn/lean-management/) nennt als allgemeine Reihenfolge Stabilität vor Fluss, Fluss vor Pull, Pull vor Glättung. In der Praxis beginnt die Mengenglättung am Schrittmacher oft zusammen mit den ersten Kanban-Regelkreisen, und die feine Mixglättung folgt, sobald die Rüstzeiten es erlauben.

### Was vorgelagert passiert, wenn man glättet

Vergleichen Sie die Halter für Modell D. Im Losplan werden die 40 Stück für D am Ende der Schicht in einem Block von 37,5 Minuten verbraucht, und der Regelkreis muss einen Bedarf von 80 pro Tag in bis zu zwei Stößen abdecken. Im geglätteten Plan liegt der Verbrauch weiter bei 80 pro Tag, aber über den Tag verteilt. Der Spitzenbedarf während der Wiederbeschaffungszeit sinkt und damit auch der nötige Sicherheitszuschlag. Über Dutzende Sachnummern ist dieser Unterschied oft größer als jede Optimierung der Kartenzahl.

## Mehr als Kanban: CONWIP, POLCA und Drum-Buffer-Rope

Teilespezifische Kanban-Regelkreise funktionieren, wenn jede Sachnummer regelmäßigen Bedarf hat. Wenn eine Linie Hunderte von Varianten fertigt, würde ein Supermarkt für jede mehr Bestand halten, als das Werk vorher hatte. Drei Alternativen halten die Bestandsobergrenze, ohne jede Sachnummer zu bevorraten.

### CONWIP: eine Bestandsobergrenze für die ganze Linie

CONWIP steht für Constant Work in Process, konstanter Umlaufbestand. Spearman, Woodruff und Hopp beschrieben es 1990 im *International Journal of Production Research* als "ein neues Pull-basiertes Produktionssystem", gestützt auf theoretische Argumente und Simulationsstudien [3]. Der Mechanismus: Kein Auftrag darf ohne Karte in die Linie; wenn ein fertiger Auftrag die letzte Station verlässt, geht seine Karte zur ersten Station zurück und gibt den nächsten Auftrag frei [5]. Innerhalb der Linie fließen die Aufträge in FIFO-Reihenfolge wie in einer Push-Linie.

Der Vergleich im Wikipedia-Artikel zu CONWIP ist hilfreich: Kanban steuert den Umlaufbestand über einzelne Karten an jeder Station enger, während CONWIP leichter einzuführen und anzupassen ist, weil nur ein Kartensatz den Systembestand steuert [5]. 2022 veröffentlichten dieselben drei Autoren "CONWIP Redux", einen Rückblick auf 30 Jahre Entwicklung, der verbreitete Missverständnisse aufgreift [4].

**Rechenbeispiel: ein CONWIP-Niveau festlegen.** Eine Linie mit fünf Stationen hat eine Engpassrate von 60 Einheiten pro Stunde. Die reine Bearbeitungszeit einer Einheit durch alle fünf Stationen ohne jede Wartezeit beträgt 25 Minuten (0,417 Stunden). Nach Littles Gesetz bräuchte man ohne jede Schwankung 60 × 0,417 = 25 Einheiten Umlaufbestand, um den Engpass auszulasten [6]. Reale Linien schwanken, also startet das Werk mit 35 Karten und beobachtet den Durchsatz.

Hält der Durchsatz bei etwa 60 pro Stunde, beträgt die mittlere Durchlaufzeit 35 ÷ 60 = 0,58 Stunden, etwa 35 Minuten. Als Nächstes nimmt das Team Karten in Zweierschritten heraus. Fällt der Durchsatz bei 29 Karten unter die Engpassrate, geht es zurück auf 31. Zum Vergleich eine Linie ohne Obergrenze mit 150 Einheiten: gleiche Ausbringung, Durchlaufzeit 150 ÷ 60 = 2,5 Stunden.

### POLCA: Pull für Betriebe mit hoher Variantenvielfalt und kleinen Stückzahlen

POLCA steht für Paired-cell Overlapping Loops of Cards with Authorization, also sich überlappende Kartenregelkreise zwischen Zellenpaaren mit Freigabe [21]. Rajan Suri entwickelte es im Rahmen seiner Arbeit am Center for Quick Response Manufacturing der University of Wisconsin–Madison [21]. Sein *Practitioner's Guide to POLCA* beschreibt es als "ein kartenbasiertes visuelles Steuerungssystem, das den Fluss der Aufträge durch die Werkstatt steuert", "besonders geeignet für Unternehmen, die Produkte mit hoher Variantenvielfalt, kleinen Stückzahlen und kundenspezifisch fertigen", und merkt an, dass Kanban "bei kleinen Stückzahlen oder kundenspezifischer Fertigung nicht gut funktioniert" [20].

Der Mechanismus in Kürze: Jedes Paar von Zellen, die einander Arbeit übergeben, teilt sich einen Kartenregelkreis (zum Beispiel "Fräsen–Schweißen"). Ein Auftrag darf in der Fräszelle erst beginnen, wenn sein Freigabetermin erreicht ist und eine Fräsen-Schweißen-Karte frei ist; das signalisiert, dass das Schweißen Kapazität für ihn hat. Wenn das Schweißen den Auftrag beendet, geht die Karte zum Fräsen zurück. Weil sich die Regelkreise überlappen, ist jede Zelle durch die Karten ihrer vor- und nachgelagerten Paare abgedeckt. POLCA verbindet geplante Freigabetermine aus dem ERP mit einem Kapazitätssignal aus dem Werk.

### Drum-Buffer-Rope: Pull vom Engpass aus

Drum-Buffer-Rope (DBR) ist die Methode der Produktionssteuerung der Theory of Constraints, die mit Eliyahu Goldratt verbunden ist (Quellen im unten verlinkten Leitfaden zur Theory of Constraints). Der Engpass (die Trommel, Drum) gibt den Takt vor; ein Zeitpuffer schützt ihn vor Störungen davor; das Seil (Rope) koppelt die Materialfreigabe an den Verbrauch der Trommel. DBR deckelt den Umlaufbestand nur vor dem Engpass und ist damit ein Pull-System im Sinne von Hopp und Spearman [2]. Der Leitfaden von Veryable nennt CONWIP und DBR als die beiden wichtigsten Alternativen zu Kanban [24]. DBR erklärt der [Leitfaden zur Theory of Constraints](https://www.m365.fm/learn/theory-of-constraints-engpass/) im Detail.

### Entscheidungstabelle: welches Pull-System passt?

| Kriterium | Kanban (Supermarkt) | CONWIP | POLCA | Drum-Buffer-Rope |
|---|---|---|---|---|
| Produktmix | Gering bis mittel, Wiederholteile | Mittel bis hoch, gemeinsamer Arbeitsgang | Hohe Variantenvielfalt, kundenspezifisch, viele Arbeitsgangfolgen | Beliebig, mit klarem Engpass |
| Bedarf je Sachnummer | Regelmäßig | Unregelmäßig ist in Ordnung | Unregelmäßig ist in Ordnung | Unregelmäßig ist in Ordnung |
| Bevorratet Fertigteile | Ja, in Supermärkten | Nein (Auftragsfertigung möglich) | Nein | Nein; Zeitpuffer vor dem Engpass |
| Bestandssteuerung | Je Regelkreis, je Sachnummer | Ganze Linie | Zwischen jedem Zellenpaar | Vor dem Engpass |
| Braucht Freigabetermine aus der Planung | Nein für Runner | Ja, eine Reihenfolge im Auftragsbestand | Ja, Freigabetermine | Ja, Engpassplan |
| Aufwand der Einrichtung | Mittel (viele Regelkreise zu dimensionieren) | Gering (eine Zahl je Linie) | Mittel (Regelkreise je Zellenpaar) | Mittel (Engpass muss stabil sein) |
| Typisches Versagen | Supermärkte für Stranger | Falsche Reihenfolge im Auftragsbestand | Zu viele Regelkreise, Kartenverwirrung | Engpass wandert mit dem Produktmix |

Die meisten Werke kombinieren sie: Kanban für Runner und zugekaufte C-Teile, CONWIP oder POLCA für Varianten in Auftragsfertigung und DBR dort, wo eine Ressource die Ausbringung klar begrenzt.

## E-Kanban und das Zusammenspiel mit ERP/MRP

### Was E-Kanban ist

Elektronisches Kanban ersetzt physische Karten durch elektronische Signale. Wikipedia merkt an, dass das hilft, verbreitete Probleme wie Fehler bei der manuellen Erfassung und verlorene Karten zu beseitigen [10]. Das LEI weist darauf hin, dass Lieferantenkanbans für weit entfernte Lieferanten "typischerweise elektronisch umgesetzt werden" [1]. Die Logik ändert sich nicht: eine feste Zahl von Pull-Signalen je Regelkreis, ausgelöst durch Verbrauch.

**So funktioniert ein typischer E-Kanban-Regelkreis:**

1. Jeder Behälter trägt ein Etikett mit Barcode, QR-Code oder RFID-Tag, das das Kanban identifiziert (Sachnummer, Regelkreis, Kartennummer).
2. Wird ein Behälter geleert, scannt ihn der Werker oder Logistiker, oder ein Sensor erkennt den leeren Platz (Waage, Lichtschranke, RFID-Gate).
3. Das ERP oder eine eigene Kanban-Anwendung setzt den Status dieses Kanbans auf "leer" und erzeugt ein Nachschubsignal: einen Fertigungsauftrag für einen internen Lieferanten oder einen Abruf aus einem Rahmenvertrag für einen externen.
4. Der liefernde Prozess sieht das Signal in seiner Warteschlange, auf einem Bildschirm (einer digitalen Kanban-Tafel an der Zelle) oder als gedruckte Karte.
5. Wird der volle Behälter vereinnahmt und an seinem Lagerplatz eingescannt, geht das Kanban wieder auf "voll".

### Physisch oder elektronisch: wann umstellen

| Faktor | Physische Karten behalten | Auf E-Kanban umstellen |
|---|---|---|
| Entfernung Lieferant zu Verbraucher | Selbes Gebäude, ca. 100 m (a few hundred feet) | Anderer Standort, externer Lieferant, anderes Land |
| Zahl der Regelkreise | Dutzende | Hunderte oder Tausende |
| Kartenverlustquote | Gering, Karten lassen sich leicht prüfen | Wiederholt verlorene Karten, häufige Fehlteile, die sich auf Karten zurückführen lassen |
| Datenbedarf | Visuelle Steuerung genügt | Wiederbeschaffungszeiten, Leistung der Regelkreise, Bedarfshistorie werden gebraucht |
| Reife | Team lernt die Regeln noch | Regeln sind stabil und werden eingehalten |
| IT/OT-Umgebung | Kein zuverlässiges Scannen oder Netz im Werk | Scanner, Netz und Kanban-Modul im ERP vorhanden |

Ein häufiger Fehler ist, mit E-Kanban anzufangen. Der Bildschirm versteckt, was ein Regal voller Karten zeigt: wer Karten zurückhält, welcher Regelkreis überläuft, welche Regel gebrochen wird. Unsere Empfehlung: einen Regelkreis auf Papier betreiben, bis die Regeln halten, dann digitalisieren.

### Wie ERP-Systeme Kanban abbilden

Große ERP-Systeme enthalten Kanban-Funktionen. Zwei veröffentlichte Beispiele zeigen, wie unterschiedlich sie rechnen.

- **Microsoft Dynamics 365 Supply Chain Management** berechnet die Kanban-Menge aus einer Berechnungsrichtlinie für Kanban-Mengen, mit dem mittleren Bedarf über eine festgelegte Bedarfsperiode, der Wiederbeschaffungszeit, einem Sicherheitsfaktor und optional einem aus einem Servicegrad abgeleiteten Sicherheitsbestand; bei 90 Prozent Servicegrad verwendet es z = 1,29 [15]. Es unterscheidet Kanban-Regeln mit fester Menge, Einmalkanbans und Ereigniskanbans [15]. Umlaufkarten werden einmal gedruckt und bewegen sich dann zwischen Ursprung und Verbrauchsort, oft mehrmals am Tag [15].
- **Oracle JD Edwards** bietet mehrere Kanban-Gleichungen an, zum Beispiel "feste Behältergröße und hoher Bedarf": Kanban-Größe = hoher Tagesbedarf × (Lieferzeit in Tagen + Scan-Delta in Tagen) + Sicherheitsbestand, und die Zahl der Karten = Kanban-Größe geteilt durch Behältergröße [16]. Der hohe Tagesbedarf wird aus dem höchsten Periodenbedarf im MRP-Zeitfenster genommen, bereinigt um Aufteilungen nach Lieferant und Standort [16].

Bevor Sie den vom ERP vorgeschlagenen Kartenzahlen trauen, prüfen Sie drei Dinge: welchen Bedarf es verwendet (Durchschnitt oder Spitze, Vergangenheit oder Zukunft), ob es eine Karte für den Behälter im Verbrauch hinzufügt und wie es Losgrößen am liefernden Prozess behandelt. Diese Entscheidungen erklären die meisten Unterschiede zwischen der Zahl des ERP und der Erfahrung im Werk.

### MRP und Kanban: wer macht was

MRP (Material Requirements Planning, Materialbedarfsplanung) löst einen Primärbedarfsplan über die Stückliste auf und erzeugt terminierte Planaufträge. Kanban ersetzt bei kanbangesteuerten Teilen nur den letzten Schritt: die Freigabe einzelner Aufträge. Eine tragfähige Arbeitsteilung:

| Aufgabe | MRP / ERP | Kanban-Regelkreis |
|---|---|---|
| Langfristige Kapazitäts- und Materialplanung | Ja: S&OP, Primärbedarfsplan, Grobkapazitätsplanung | Nein |
| Lieferantenverträge, Rahmenaufträge, Prognosen an Lieferanten | Ja: Prognosemengen für die Kapazitätsplanung teilen | Nein |
| Teile mit langer Wiederbeschaffungszeit und Nicht-Kanban-Teile | Ja: Planaufträge | Nein |
| Tägliche Freigabe der Kanban-Teile | Nein: Planaufträge für diese Teile unterdrücken | Ja: Verbrauchssignal |
| Bestandsbuchungen | Ja: Wareneingänge, Entnahmen, oft retrograde Entnahme | Erzeugt die Buchungen (Scan) |
| Dimensionierung der Regelkreise | Berechnet Vorschläge aus dem Bedarf | Werk validiert und passt an |
| Kalkulation und Bewertung | Ja | Nein |

Zwei technische Punkte sind wichtig:

- **Doppelte Planung vermeiden.** Wenn MRP weiter Planaufträge für ein Teil erzeugt, das auch über Kanban läuft, bekommen Einkäufer und Disponenten zwei widersprüchliche Signale. Die meisten ERP-Systeme erlauben es, ein Teil als kanbangesteuert zu kennzeichnen, sodass MRP es nur für Kapazitäts- und Prognosezwecke plant. Die Einstellungen unterscheiden sich je nach System; prüfen Sie die Dokumentation Ihres ERP.
- **Retrograde Entnahme braucht genaue Stücklisten.** Wenn das System Komponenten an einem Meldepunkt automatisch abbucht, zeigen sich falsche Stücklistenmengen als Phantom-Fehlteile im Kanban-Regelkreis. Korrigieren Sie die Stückliste, nicht die Kartenzahl.

MRP und S&OP behandelt der [Leitfaden zu S&OP, MRP und Produktionsplanung](https://www.m365.fm/learn/sop-mrp-produktionsplanung/) ausführlich, die Bestandspolitik einschließlich der Berechnung des Sicherheitsbestands der [Leitfaden zum Bestandsmanagement in der Produktion](https://www.m365.fm/learn/produktionsplanung-aps/bestandsmanagement/).

### Wo E-Kanban in der IT/OT-Architektur sitzt

E-Kanban berührt mehrere Systemebenen: das ERP (Planung, Einkauf, Bestandsbewertung), das MES oder die Shopfloor-Anwendung (Produktionssignale, Rückmeldungen), Scanner und Sensoren im Werk sowie Lieferantenportale oder EDI-Verbindungen zu externen Lieferanten. Das ISA-95-Modell zur Integration von Unternehmens- und Steuerungssystemen hilft bei der Entscheidung, welches System welche Kanban-Daten führt; siehe den [Leitfaden zu MES und ISA-95](https://www.m365.fm/learn/mes-isa-95/). Zwei praktische Regeln:

- **Ein System führt die Kanban-Stammdaten** (Regelkreise, Kartenzahlen, Behältermengen). Dubletten in Excel, MES und ERP laufen innerhalb von Wochen auseinander.
- **Gegen doppelte Signale absichern.** Ein zweimal gescannter Behälter oder ein flackernder Sensor erzeugt zwei Nachschubsignale für einen leeren Behälter. Nur ein offenes Signal je Kanban-ID zulassen und jede Statusänderung protokollieren.
- **Für Ausfälle planen.** Fallen Netz oder Kanban-Anwendung aus, braucht das Werk gedruckte Karten oder eine Papier-Rückfallebene für jeden Regelkreis. Jedes Scangerät und jede Lieferantenverbindung gehört außerdem zur Angriffsfläche des Werks; der [Leitfaden zu OT-Security und IEC 62443](https://www.m365.fm/learn/ot-security-iec-62443/) behandelt, wie man solche Verbindungen segmentiert und absichert. Für cloudbasierte Integrationsmöglichkeiten siehe den [Leitfaden Manufacturing IT mit Azure](https://www.m365.fm/learn/manufacturing-it-azure/).

### Regelkreise simulieren, bevor man sie baut

Für Werke mit vielen Regelkreisen oder stark schwankendem Bedarf kann eine ereignisdiskrete Simulation Kartenzahlen, Supermarktgrößen und Routenintervalle gegen den historischen Bedarf testen, bevor sich im Werk etwas ändert. Der [Leitfaden zur Simulation in der Produktion](https://www.m365.fm/learn/digital-twin/simulation-produktion/) erklärt, wie solche Modelle aufgebaut werden. Wertstrom-Software kann helfen, Soll-Wertstromkarten mit Supermärkten und Kanban-Regelkreisen über Standorte hinweg konsistent zu halten; der [Leitfaden zu iFAKT Polaris](https://www.m365.fm/learn/ifakt-polaris/) beschreibt ein solches Werkzeug und seine Grenzen. **Hinweis: Der Autor arbeitet bei der iFAKT GmbH.**

## Vorlagen: Karte, Dimensionierungsblatt, Supermarkt-Checkliste, Audit

Übertragen Sie diese Tabellen in eine Tabellenkalkulation oder Ihre Shopfloor-Dokumentation. Sie sind bewusst schlicht: Ein Kanban-System sollte mit Drucker und Laminiergerät funktionieren, bevor es Software braucht.

### Vorlage 1: Aufbau der Kanban-Karte

| Feld | Beispiel | Anmerkungen |
|---|---|---|
| Sachnummer und Bezeichnung | B-200, Halter links | Große Schrift; aus ca. 2 m (6 feet) lesbar |
| Kanban-Art | Produktionskanban | Farbcode je Art (zum Beispiel weiß = Produktion, gelb = Entnahme, rot = Notfall) |
| Kartennummer | 3 von 9 | Zeigt die Größe des Regelkreises; deckt verlorene Karten auf |
| Behältermenge | 40 Stück | Nie "ca." schreiben |
| Behälterart | Blauer Kasten 600 × 400 mm | Passt zum Regalfach |
| Liefernder Prozess oder Lieferant | Zelle W2 (Stanzen und Schweißen) | Bei Lieferantenkanban: Name und Lieferantennummer |
| Lagerplatz (Supermarkt) | SM-W2, Regal 3, Ebene B, Fach 07 | Ort, an den der volle Behälter zurückkehrt [1] |
| Adresse des verbrauchenden Prozesses | Linie 1, Station 14, linkes Regal | Verbrauchsort [1] |
| Barcode oder QR-Code | Regelkreis-ID + Kartennummer | Für E-Kanban oder Audit-Scans |
| Revision und Datum | Rev. 4, Nov. 2026 | Wird geändert, wenn der Regelkreis neu dimensioniert wird |

### Vorlage 2: Dimensionierungsblatt für einen Regelkreis

| Zeile | Eingangsgröße | Einheit | Beispiel (Halter B-200) |
|---|---|---|---|
| 1 | Mittlerer Tagesbedarf | Stück/Tag | 960 |
| 2 | Verfügbare Zeit pro Tag | Minuten | 900 |
| 3 | Takt (Zeile 2 ÷ Zeile 1) | Minuten/Stück | 0,9375 |
| 4 | Behältermenge | Stück | 40 |
| 5 | Sammelintervall der Karten | Minuten | 60 |
| 6 | Wartezeit am liefernden Prozess | Minuten | 90 |
| 7 | Rüsten je Los (falls nicht in der Wartezeit enthalten) | Minuten | 0 |
| 8 | Bearbeitungszeit je Behälter | Minuten | 20 |
| 9 | Transport und Einlagerung | Minuten | 15 |
| 10 | Wiederbeschaffungszeit (Zeilen 5 bis 9) | Minuten | 185 |
| 11 | Kanbans für die Wiederbeschaffungszeit (Zeile 10 ÷ Zeile 3 ÷ Zeile 4) | Kanbans | 4,93 |
| 12 | Losgröße am liefernden Prozess | Behälter | 4 |
| 13 | Zusätzliche Kanbans für die Losbildung (Zeile 12 – 1) | Kanbans | 3 |
| 14 | Sicherheitszuschlag (10 % von Zeile 11) | Kanbans | 0,49 |
| 15 | Summe (Zeilen 11 + 13 + 14), aufgerundet | Kanbans | 9 |
| 16 | Höchstbestand im Regelkreis (Zeile 15 × Zeile 4) | Stück | 360 |
| 17 | Reichweite (Zeile 16 ÷ Zeile 1) | Tage | 0,375 |
| 18 | Nächster Prüftermin | Datum | monatlich |

### Vorlage 3: Checkliste zur Supermarktgestaltung

| # | Prüfpunkt | Ja / Nein |
|---|---|---|
| 1 | Jede Sachnummer im Supermarkt erfüllt die Runner-Kriterien (regelmäßiger Bedarf, geringe Schwankung) | |
| 2 | Jede Sachnummer hat genau eine feste Adresse | |
| 3 | Die Regalkapazität entspricht der höchsten Regelkreisgröße je Sachnummer, keine zusätzlichen Fächer | |
| 4 | Regale werden von hinten beschickt und vorne entnommen | |
| 5 | Positionen der Signalkanbans oder Min/Max-Markierungen sind sichtbar | |
| 6 | Behältergewichte und Greifhöhen anhand ergonomischer Hinweise geprüft [28] | |
| 7 | Gänge erlauben sicheren Zugang für Wagen oder Routenzüge, getrennt von Fußwegen | |
| 8 | Kanban-Briefkasten beim Verbraucher und beim liefernden Prozess | |
| 9 | Route und Sammelintervall des Logistikers sind schriftlich festgelegt und getaktet | |
| 10 | Rückweg für Leergut ist festgelegt | |
| 11 | Für den Supermarkt sind ein Ansprechpartner und eine Vertretung benannt | |
| 12 | Ablauf und Farbe des Notfallkanbans sind festgelegt | |

### Vorlage 4: wöchentliches Kanban-Audit

| Prüfung | Wie | Ziel | Maßnahme bei Abweichung |
|---|---|---|---|
| Kartenzahl je Regelkreis | Karten in Briefkästen, beim Lieferanten, an vollen Behältern, an der Linie zählen | Gleich der Stammliste | Suchen; wenn verloren, ersetzen und Ursache dokumentieren |
| Behälter ohne Karte | Supermarkt und Linie ablaufen | Null | Karte anbringen oder entfernen; herausfinden, wer sie erzeugt hat |
| Überlauf im Supermarkt | Behälter außerhalb der festen Fächer | Null | Überproduktion stoppen; Regel 3 prüfen |
| Fehlteile | Linienstopps oder Engpässe wegen leerer Regelkreise | Null, Anzahl verfolgen | Ursache: Karte, Dimensionierung, Lieferant, Qualität |
| Notfallkanbans im Umlauf | Rote Karten zählen | Null nach der Erholung | Einziehen; Auslöser analysieren |
| Wiederbeschaffungszeit | Zeitstempel oder Stichprobe von 10 Karten | Innerhalb des Werts, der zur Dimensionierung verwendet wurde | Regelkreis neu dimensionieren oder Verzögerung beheben |
| Fehlerhafte Teile in Behältern | Stichprobe am Verbrauchsort | Null | Qualitätssicherung an der Quelle, Sperrung |

### Vorlage 5: Kanban-Regeln für die Shopfloor-Tafel

| # | Regel | Wer |
|---|---|---|
| 1 | Wir entnehmen Teile nur an unserer eigenen Verbrauchsadresse | Werker |
| 2 | Ist ein Behälter leer, kommt seine Karte sofort in den Kanban-Briefkasten | Werker |
| 3 | Wir fertigen nur, was Produktionskanbans freigeben, in ihrer Reihenfolge | Liefernde Zelle |
| 4 | Ein voller Behälter trägt immer seine Karte | Alle |
| 5 | Fehlerhafte Teile kommen nie in einen Behälter; wir stoppen und rufen | Alle |
| 6 | Karten werden nur vom Verantwortlichen des Regelkreises hinzugefügt oder entfernt, mit Datum | Leitung Materialwirtschaft |
| 7 | Rote Notfallkarten gehen nach Gebrauch an den Verantwortlichen des Regelkreises zurück | Leitung Materialwirtschaft |
| 8 | Wenn System und Regal nicht übereinstimmen, vertrauen wir dem Regal und melden die Abweichung | Alle |

## Kanban in der Produktion einführen: Roadmap über 26 Wochen

Die Einführung eines Pull-Systems beginnt mit einem stabilen Fertigungsprozess, nicht mit Karten. Die folgende Roadmap ist eine typische Abfolge für einen Wertstrom und sein Team in einem mittelgroßen Werk. Die Dauern sind Planungsannahmen, keine Benchmarks; Werke mit Lean-Erfahrung kommen schneller voran, Werke mit instabilen Prozessen langsamer.

| Phase | Wochen | Ziel | Wichtigste Aktivitäten | Ausstiegskriterien |
|---|---|---|---|---|
| 0. Auswählen und Basis messen | 1–2 | Pilot wählen, heute messen | Produktfamilie auswählen; Ist-Wertstromkarte; Umlaufbestand, Durchlaufzeit, Fehlteile, Bestandswert messen | Basiskennzahlen von Produktion und Controlling freigegeben |
| 1. Stabilisieren | 3–6 | Den Prozess pull-fähig machen | 5S an Lieferquelle und Verbrauchsort; die wichtigsten Stillstandsursachen beheben; Rüstzeiten am liefernden Prozess senken; Behälter festlegen | Liefernder Prozess erreicht an 9 von 10 Tagen seine geplante Ausbringung |
| 2. Gestalten | 7–10 | Soll-Zustand und Gestaltung der Regelkreise | Teile segmentieren (Runner, Repeater, Stranger); Arten der Regelkreise wählen; Regelkreise mit dem Dimensionierungsblatt berechnen; Supermarkt und Route gestalten | Liste der Regelkreise mit Kartenzahlen, Adressen, Verantwortlichen |
| 3. Pilot | 11–14 | 5 bis 15 Regelkreise betreiben | Karten drucken, Werker und Logistiker schulen, Regelkreise starten; tägliche Besprechung an der Tafel; Größen anpassen | Zwei Wochen ohne Fehlteile, die auf die Gestaltung der Regelkreise zurückgehen |
| 4. Ausweiten | 15–22 | Den Wertstrom abdecken | Übrige Runner aufnehmen; erste Lieferantenkanbans; Schrittmacherplan anbinden; Mix glätten | 80 % der Runner-Sachnummern auf Kanban; MRP-Planaufträge dafür unterdrückt |
| 5. Verbessern und digitalisieren | 23–26 und laufend | Bestand senken, Daten ergänzen | Karten einzeln herausnehmen; Losgrößen verringern; E-Kanban für entfernte Lieferanten; monatliche Neudimensionierung | Dokumentierte Kartenreduzierungen; E-Kanban für ausgewählte Regelkreise |

### Voraussetzungen, die man nicht überspringen kann

| Voraussetzung | Warum Kanban sie braucht | Wo man mehr liest |
|---|---|---|
| Stabile, fähige liefernde Prozesse | Ein auf 0,25 Tage ausgelegter Regelkreis versagt, wenn die Maschine einen halben Tag steht | [Leitfaden TPM und OEE](https://www.m365.fm/learn/tpm-oee/) |
| Kurze Rüstzeiten | Die Losgröße bestimmt die Kartenzahl (Beispiel 2) | [SMED-Leitfaden](https://www.m365.fm/learn/smed-ruestzeitreduzierung/) |
| Arbeitsplatzorganisation | Feste Adressen, aufgeräumte Regale, sichtbarer Status | [Leitfaden 5S-Methode und visuelles Management](https://www.m365.fm/learn/5s-methode-visuelles-management/) |
| Standardarbeit für Logistiker und Werker | Routenintervalle und Kartenhandhabung müssen wiederholbar sein | [Leitfaden Standardarbeit](https://www.m365.fm/learn/shop-floor-management/standardarbeit/) |
| Geglätteter Schrittmacherplan | Ungeglätteter Bedarf bläht Regelkreise auf | Abschnitt Heijunka oben |
| Zuverlässige Daten | Behältermengen, Stücklisten und Bedarfshistorie | [Leitfaden Produktionskennzahlen](https://www.m365.fm/learn/produktionskennzahlen/) |

### Die Pilot-Regelkreise auswählen

Gute erste Regelkreise haben fünf Merkmale gemeinsam: täglicher Bedarf, ein liefernder Prozess in der Nähe, Rüstzeiten unter etwa 15 Minuten, ein Teil, das sichtbare Fehlmengen oder Überbestände verursacht hat, und ein Teamleiter, der es ausprobieren will. Vermeiden Sie für den ersten Regelkreis das kritischste Engpassteil des Werks; ein Gestaltungsfehler dort stoppt die ganze Linie.

### Werker, Logistiker und ihre Vertretung einbeziehen

Ein Kanban-System verändert die tägliche Arbeit von Werkern und Logistikern. Ob die Regeln halten, entscheidet ihre Zustimmung.

- **Den Zweck vor den Regeln erklären.** Wer die Fehlteile und die überlaufenden Regale sieht, versteht meist schnell, warum eine Bestandsobergrenze hilft. Wer nur hört, er solle "der Karte folgen", versteht es nicht.
- **Werker die Behälterpositionen und Regalhöhen festlegen lassen.** Sie wissen, wo Greifen und Heben wehtun. Für die Prüfung die Ergonomie-Hinweise der OSHA als Referenz nutzen [28].
- **Vereinbaren, was mit frei werdender Zeit und Arbeitskraft geschieht.** Wenn das Bestandshandling schrumpft, machen sich Menschen Sorgen um ihre Arbeitsplätze. Sagen Sie früh, und schriftlich, wenn ein Tarifvertrag gilt, wie frei werdende Kapazität genutzt wird. Der [Leitfaden zu Lean Management](https://www.m365.fm/learn/lean-management/) behandelt den US-arbeitsrechtlichen Kontext, einschließlich Mitarbeiterausschüssen nach dem National Labor Relations Act (NLRA).
- **Die Stopp-Regel sicher machen.** Regel 5 (keine Fehler an den Nachfolger) funktioniert nur, wenn Stoppen und Hilfe rufen nie bestraft wird.
- **Die tägliche Tafel nutzen.** Probleme der Regelkreise gehören in die tägliche Stufenbesprechung; siehe den [Leitfaden Shop Floor Management](https://www.m365.fm/learn/shop-floor-management/).

### Hilfe von außen holen

Hersteller in den USA, besonders kleine und mittelgroße, können beim NIST-Manufacturing-Extension-Partnership-Zentrum (MEP) ihres Bundesstaats Unterstützung zu Lean und Prozessverbesserung anfragen; NIST MEP führt Lean und Prozessverbesserung unter seinen Leistungen [27]. Methoden der kontinuierlichen Verbesserung, mit denen die Regelkreise immer besser werden, behandelt der [Leitfaden zu Kaizen](https://www.m365.fm/learn/lean-management/kaizen/).

## Kanban-Kennzahlen und die Sicht des Controllings

### Operative Kennzahlen

| Kennzahl | Formel | Beispiel | Zielrichtung |
|---|---|---|---|
| Bestand im Regelkreis (max.) | Kanbans × Behältermenge | 9 × 40 = 360 Stück | Mit der Zeit sinkend |
| Reichweite in Tagen | Höchstbestand im Regelkreis ÷ mittlerer Tagesbedarf | 360 ÷ 960 = 0,375 Tage | Sinkend, innerhalb der Sicherheitsgrenzen |
| Fehlteile pro Woche | Anzahl der Linienstopps oder Engpässe durch einen leeren Regelkreis | 2 | Null |
| Kartengenauigkeit | Im Audit gefundene Karten ÷ Karten laut Stammliste | 87 ÷ 90 = 96,7 % | 100 % |
| Einhaltung der Wiederbeschaffungszeit | Innerhalb der dimensionierten Zeit nachgefüllte Kanbans ÷ alle Kanbans | 182 ÷ 200 = 91 % | Steigend |
| Notfallkanbans | Anzahl ausgegebener Karten pro Monat | 4 | Sinkend |
| Umlaufbestand (Wertstrom) | Summe der Stücke zwischen erstem und letztem Prozess | 3.200 -> 1.200 | Sinkend |
| Durchlaufzeit (Littles Gesetz) | Umlaufbestand ÷ Durchsatz [6] | 1.200 ÷ 400 = 3 Tage | Sinkend |
| Lagerumschlag | Jährliche Herstellkosten des Umsatzes ÷ durchschnittlicher Bestandswert | 24 Mio. USD ÷ 3 Mio. USD = 8 | Steigend |
| Liefertreue | Pünktlich versandte Aufträge ÷ alle Aufträge | 95 % | Steigend oder stabil |
| Entfernte Kanbans | Nach Verbesserungen entfernte Karten je Quartal | 12 | Verfolgen, keine Quote |

Achten Sie auf die Paare. Sinkender Bestand bei steigenden Fehlteilen heißt, dass die Regelkreise zu stark gekürzt wurden oder der Prozess nicht stabil genug ist. Steigende Liefertreue bei unverändertem Bestand kann heißen, dass die Regelkreise in Ordnung sind und die Verbesserung aus der Glättung kam. Kennzahlendefinitionen und Dashboards für das ganze Werk behandelt der [Leitfaden Produktionskennzahlen](https://www.m365.fm/learn/produktionskennzahlen/).

### Die Sicht des Controllings: Liquidität, Kapitalbindungskosten und ausgewiesener Gewinn

Ein Werkscontroller betrachtet drei Effekte.

**1. Einmalige Liquiditätsfreisetzung.** Angenommen, 120 Runner-Sachnummern wechseln von Min/Max-Meldebeständen auf Kanban, und der durchschnittliche Bestand je Regelkreis sinkt um 3.000 USD zu Standardkosten. Das setzt 120 × 3.000 USD = 360.000 USD Umlaufvermögen frei, einmalig. Es wiederholt sich nicht jedes Jahr.

**2. Laufende Einsparung bei den Lagerhaltungskosten.** Lagerhaltungskosten umfassen Kapitalkosten, Lagerung, Handling, Versicherung, Veralterung und Schwund. Der Prozentsatz schwankt stark nach Unternehmen und Branche; verwenden Sie den Wert Ihres eigenen Controllers. Mit beispielhaften 20 Prozent pro Jahr (eine Annahme für dieses Beispiel, kein Benchmark) spart die Senkung um 360.000 USD etwa 72.000 USD im Jahr.

**3. Ein vorübergehender Rückgang des ausgewiesenen Gewinns bei Vollkostenbewertung.** Bei der Vollkostenrechnung (Absorption Costing) tragen Fertigerzeugnisse und Umlaufbestand einen Teil der fixen Fertigungsgemeinkosten. Sinkt der Bestand, fließen Gemeinkosten, die in früheren Perioden aktiviert wurden, in die Herstellkosten des Umsatzes; der ausgewiesene Gewinn kann daher in den Quartalen sinken, in denen Umlauf- und Fertigwarenbestand fallen, obwohl sich die Liquidität verbessert. Interne Berichte auf Basis der Teilkostenrechnung zeigen diesen Rückgang nicht; ein Grund, im Pilot-Review beide Sichten zu zeigen. Erklären Sie das der Führung vor dem Pilot, sonst sieht das erste Kanban-Quartal wie ein Misserfolg aus. Rohstoffe und Zukaufteile tragen keine aktivierten Gemeinkosten; der Effekt kommt daher vor allem aus Umlaufbestand und Fertigerzeugnissen.

**Zu budgetierende Kosten.** Behälter, Regale und Durchlaufregale (Investition oder Aufwand je nach Aktivierungsgrenze), Druck und Laminierung der Karten, Schulungszeit, für E-Kanban möglicherweise Scanner und Lizenzen für das Kanban-Modul im ERP (im Abonnementmodell meist Aufwand) sowie die Route des Logistikers. Ein typischer Pilot mit 10 bis 15 Regelkreisen ist vor allem ein Personal- und Behälterkostenblock; Dimensionierung und Regeln kosten nichts außer Disziplin.

**Beispielhafter Business Case für einen Pilot (alle Zahlen beispielhaft):**

| Position | Betrag |
|---|---|
| Behälter und Durchlaufregale für 15 Regelkreise | 18.000 USD |
| Schulung: 40 Personen × 4 Stunden × 45 USD Vollkostensatz | 7.200 USD |
| Engineering- und Coachingzeit, 8 Wochen in Teilzeit | 20.000 USD |
| **Gesamtkosten des Pilots** | **45.200 USD** |
| Einmalige Bestandssenkung, 15 Regelkreise × 3.000 USD | 45.000 USD |
| Jährliche Einsparung bei den Lagerhaltungskosten bei angenommenen 20 % | 9.000 USD |
| Vermiedene Eilfrachten (eigene Daten des Werks, Beispiel) | 12.000 USD pro Jahr |

In diesem Beispiel zahlt sich der Pilot im ersten Jahr in etwa liquiditätswirksam selbst. Der größere Nutzen liegt meist im Ausrollen auf den ganzen Wertstrom und in der damit verbundenen Verkürzung der Durchlaufzeit.

## Typische Kanban-Fehler und wie man sie behebt

| Fehler | Symptom | Abhilfe |
|---|---|---|
| Kanban vor Stabilität | Häufige Fehlteile, weil die liefernde Maschine steht oder der Ausschuss hoch ist | Zuerst stabilisieren (TPM, Qualität an der Quelle); Regelkreise bis dahin auf die reale Wiederbeschaffungszeit auslegen |
| Supermärkte für Stranger | Regale voller Langsamdreher, hoher Bestand trotz "Pull" | Teile segmentieren; für Stranger Auftragsfertigung mit CONWIP oder POLCA |
| Dimensionierung mit Maschinenzykluszeit statt Wiederbeschaffungszeit | Regelkreise laufen immer knapp | Wiederbeschaffungszeit durchgängig messen (Dimensionierungsblatt Zeilen 5 bis 10) |
| Losgröße beim Lieferanten ignoriert | Regelkreise knapp, wenn der Lieferant Lose bildet | Kanbans für die Losbildung ergänzen oder Losgröße mit SMED verringern |
| Nie neu berechnet | Regelkreise nach Bedarfsrückgang zu groß, nach Anstieg zu klein | Monatliche Überprüfung; Neuberechnungsvorschläge aus dem ERP [15] |
| Informelle Zusatzkarten | Regelkreis wächst, Überproduktion kehrt zurück | Kartenstammliste, Verantwortlicher je Regelkreis, farbige Notfallkarten nach Gebrauch eingezogen |
| Karten zu schnell gekürzt | Linienstopps, Vertrauensverlust | Eine Karte nach der anderen herausnehmen, wenn jemand das aufgedeckte Problem lösen kann [12] |
| Parallele MRP-Planaufträge | Einkäufer bestellen Kanban-Teile doppelt | Kanban-Teile im ERP kennzeichnen; MRP nur für Prognose und Kapazität |
| Ungeglätteter Schrittmacher | Vorgelagerte Regelkreise sehen große Spitzen | Heijunka-Box mit Pitch; kleinere Lose am Schrittmacher |
| E-Kanban als Abkürzung | Probleme verstecken sich in einem System, auf das niemand schaut | Papier-Regelkreise betreiben, bis die Regeln halten; dann mit visueller Tafel digitalisieren |
| Keine Verantwortung | Niemand bemerkt verlorene Karten | Benannter Verantwortlicher je Regelkreis und wöchentliches Audit (Vorlage 4) |
| Lieferant nicht eingebunden | Lieferant verpasst Signale oder liefert zu viel | Gemeinsame Vereinbarung zu Signalweg, Lieferzeit, Behälter und Menge; mit wenigen Teilen beginnen |
| Gemischte Chargen oder Revisionen in einem Behälter | Rückverfolgbarkeit geht verloren, wenn eine Charge verdächtig ist oder zurückgerufen wird; falsche Revision an der Linie | Eine Charge und eine Revision je Behälter; Chargen- oder Datumscode auf dem Etikett; FIFO-Regale; Sperrregel, die die Karten des Regelkreises für die verdächtige Charge einfriert |

## Grenzen: wann Kanban das falsche Werkzeug ist

Kanban passt zu einer bestimmten Situation. Werke, die Kanban außerhalb davon einsetzen, stoßen auf die folgenden Probleme.

**Hohe Variantenvielfalt, kleine Stückzahlen und kundenspezifische Fertigung.** Suris Leitfaden sagt klar, dass Kanban "bei kleinen Stückzahlen oder kundenspezifischer Fertigung nicht gut funktioniert" [20]. Ein teilespezifischer Regelkreis für ein Teil, das zweimal im Jahr bestellt wird, ist nur Bestand mit einer Karte daran. CONWIP und POLCA wurden für diese Fälle entwickelt [3][20].

**Stark schwankender Bedarf.** Die Größe des Regelkreises wächst mit dem Bedarf während der Wiederbeschaffungszeit plus Sicherheit. Schwankt der Bedarf von Woche zu Woche um den Faktor drei und lässt sich nicht glätten, muss der Regelkreis auf Spitzen ausgelegt werden und hält die meiste Zeit zu viel. Dann entweder den Bedarf am Schrittmacher glätten, plangesteuert (MRP) arbeiten oder die Regelkreise dynamisch neu dimensionieren.

**Lange und unzuverlässige Wiederbeschaffung.** Lieferantenkanbans mit Überseelieferanten und langen Transitzeiten packen viele Wochen Bestand in den Regelkreis; das Signal kommt zu spät, um auf echte Änderungen zu reagieren. Hier funktionieren Prognosen und geplante Freigaben aus MRP, kombiniert mit einem lokalen Puffer, meist besser.

**Kurze Produktlebenszyklen und technische Änderungen.** Ein Regelkreis voller Teile mit alter Revision wird zu Ausschuss, wenn sich die Konstruktion ändert. Den Auslauf planen: Regelkreis einfrieren, die Karten abbauen, dann die neue Sachnummer mit neuen Karten einführen.

**Versorgungsrisiko und Resilienz.** Pull-Systeme senken den Bestand, der normale Schwankungen abdeckt. Sie sind nicht dafür ausgelegt, Störungen wie einen Brand beim Lieferanten oder einen Chipmangel abzudecken. Toyota, der Ursprung von Kanban, führte nach dem Erdbeben von 2011 einen Business-Continuity-Plan ein, nach dem Lieferanten je nach Teil zwei bis sechs Monate Halbleiterbestand halten [26]. Welche Teile einen strategischen Puffer außerhalb des Kanban-Regelkreises brauchen, ist eine Risikoentscheidung; siehe den [Leitfaden zu resilienten Lieferketten](https://www.m365.fm/learn/operational-excellence/resiliente-lieferketten/).

**Theorie und Praxis.** Die wissenschaftliche Literatur zu Kanban ist umfangreich. Lage Junior und Godinho Filho untersuchten 32 Varianten des Kanban-Systems und fanden eine große Lücke zwischen der Zahl theoretischer und praktischer Vorschläge [17]. Viele optimierte Varianten wurden nie in einem Werk erprobt. Für die meisten Praktiker ist der klassische Regelkreis mit ehrlicher Dimensionierung und disziplinierten Regeln der richtige Ausgangspunkt.

**Kanban in regulierten Umgebungen und in der Projektfertigung.** In Luft- und Raumfahrt sowie Verteidigung beschränken kleine Stückzahlen, lange Wiederbeschaffungszeiten und Anforderungen an die Rückverfolgbarkeit das klassische Kanban auf Normteile, Verbrauchsmaterial und wiederkehrende Baugruppen; siehe den [Leitfaden zur Produktionsplanung in der Luftfahrt](https://www.m365.fm/learn/produktionsplanung-luftfahrt/). In der Prozessindustrie können Signalkanbans an Tanks oder Silos funktionieren, wo Losgrößen groß und Umstellungen lang sind.

## Kanban-Glossar

| Begriff | Definition |
|---|---|
| Behältermenge (Packmenge, Pack-out Quantity) | Feste Teilezahl je Kanban; die Einheit des Regelkreises |
| CONWIP | Constant Work in Process (konstanter Umlaufbestand); ein Pull-System mit einem Kartensatz für eine ganze Linie [3][5] |
| Drum-Buffer-Rope (DBR) | Steuerungsmethode der Theory of Constraints: Der Engpass gibt den Takt vor, ein Zeitpuffer schützt ihn, die Freigabe ist an ihn gekoppelt |
| E-Kanban | Elektronisches Kanban-Signal, ausgelöst durch Scan oder Sensor [10] |
| Notfallkanban | Befristete Zusatzkarte zur Erholung nach einer Fehlmenge; wird nach Gebrauch eingezogen |
| FIFO-Bahn | Warteschlange mit Höchstmenge zwischen zwei Prozessen, first in, first out |
| Heijunka | Glättung von Art und Menge der Produktion über einen festen Zeitraum [18] |
| Heijunka-Box | Visueller Plan mit Produktarten auf einer Achse und Zeitfächern (Pitch) auf der anderen [18] |
| Just-in-Time (JIT) | Nur herstellen, was gebraucht wird, wann es gebraucht wird, in der Menge, in der es gebraucht wird [8] |
| Kanban | Signalmittel, das in einem Pull-System Herstellung oder Entnahme freigibt; japanisch für "Zeichen" oder "Schild" [1] |
| Kanban-Briefkasten (Kanban Post) | Kasten oder Gestell, in dem Kanbans zur Abholung gesammelt werden |
| Littles Gesetz | Mittlerer Umlaufbestand = Durchsatz × mittlere Durchlaufzeit [6] |
| Regelkreis (Loop) | Eine Lieferanten-Verbraucher-Beziehung für eine Sachnummer mit ihrem Satz an Kanbans |
| Schrittmacher (Pacemaker) | Der einzige Prozess, der den Produktionsplan erhält |
| Pitch | Zeit für die Herstellung eines Behälters: Taktzeit × Packmenge [19] |
| POLCA | Paired-cell Overlapping Loops of Cards with Authorization; Pull für Betriebe mit hoher Variantenvielfalt und kleinen Stückzahlen [20][21] |
| Produktionskanban | Karte, die einem Prozess erlaubt, eine Art und Menge herzustellen [1] |
| Pull-System | Ein Produktionssystem, das den Umlaufbestand ausdrücklich begrenzt [2] |
| Push-System | Ein System, das Arbeit nach Plan freigibt, ohne Bestandsobergrenze |
| Wiederbeschaffungszeit | Zeit vom Leeren eines Behälters (Freigabe seiner Karte) bis der volle Behälter wieder an seinem Lagerplatz steht |
| Runner, Repeater, Stranger | Segmentierung der Teile nach Regelmäßigkeit des Bedarfs, um zwischen Kanban und Auftragsfertigung zu wählen |
| Sicherheitsfaktor | Prozentualer Zuschlag auf den Bedarf während der Wiederbeschaffung zur Abdeckung von Schwankungen |
| Signalkanban (Dreieckskanban) | Karte, die ein Los auslöst, wenn der Bestand einen Meldepunkt erreicht [1] |
| Supermarkt | Gesteuerter Bestandspunkt mit festen Adressen und Höchstmengen, aus dem der nachgelagerte Prozess entnimmt |
| Lieferantenkanban | Entnahmekanban an einen externen Lieferanten, oft elektronisch [1] |
| Taktzeit | Verfügbare Zeit geteilt durch Kundenbedarf |
| Zwei-Behälter-System | Zwei Behälter je Teil; ein leerer Behälter ist das Nachschubsignal [10] |
| Water Spider (Mizusumashi) | Logistiker auf einer festen Route, der Kanbans und Behälter bewegt |
| Entnahmekanban (Transportkanban) | Karte, die den Transport von Teilen zu einem nachgelagerten Prozess freigibt [1] |
| Umlaufbestand (WIP) | Work in Process: begonnenes, aber nicht fertiges Material |

## FAQ: Fragen zu Kanban und Pull-Prinzip

### Was ist ein Kanban-System in der Produktion?

Ein Kanban-System steuert Produktion und Materialfluss mit Signalen, die durch Verbrauch ausgelöst werden. Wenn ein nachgelagerter Prozess einen Behälter verbraucht, gehen seine Karte oder der leere Behälter zurück an den vorgelagerten Prozess und geben genau einen Ersatz frei. Die Zahl der Karten deckelt den Bestand in jedem Regelkreis [1].

### Was steht auf einer Kanban-Karte?

Typischerweise Teilebezeichnung und Sachnummer, der liefernde Prozess oder Lieferant, die Behälter- bzw. Packmenge, der Lagerplatz und die Adresse des verbrauchenden Prozesses [1]. Die meisten Werke ergänzen die Kartennummer im Regelkreis (zum Beispiel 3 von 9), die Kanban-Art und einen Barcode für Audits oder E-Kanban.

### Welche Kanban-Arten gibt es?

Produktionskanban (diese Menge herstellen), Entnahme- bzw. Transportkanban (diese Menge transportieren), Signal- bzw. Dreieckskanban (an einem Meldepunkt ein Los starten) und Lieferantenkanban (bei einem externen Lieferanten bestellen) [1]. Zwei-Behälter-Systeme, Notfallkanbans, Einmalkanbans und E-Kanban sind Varianten davon.

### Wie berechnet man die Anzahl der Kanban-Karten?

Beginnen Sie mit N = Bedarf × Wiederbeschaffungszeit × (1 + Sicherheitsfaktor) ÷ Behältermenge und runden Sie auf. Beispiel: 960 × 0,25 × 1,1 ÷ 40 = 6,6, also 7 Karten. Prüfen Sie dann, ob Sammelintervalle und Losgrößen am liefernden Prozess zusätzliche Karten erfordern; im Rechenbeispiel oben erhöhen sie die Zahl auf 9 [12][13].

### Was sind Toyotas sechs Kanban-Regeln?

In der gängigen Fassung: Der nachgelagerte Prozess entnimmt, was er verbraucht; der vorgelagerte Prozess fertigt in Menge und Reihenfolge der Kanbans; ohne Kanban wird nichts hergestellt oder transportiert; das Kanban bleibt immer bei den Teilen; fehlerhafte Teile werden nie weitergegeben; und die Zahl der Kanbans wird schrittweise verringert, um Probleme aufzudecken [10]. Eine zweite Fassung aus Toyotas Handbuch von 1973 formuliert sie anders und ergänzt "Schwankungen verringern" sowie "den Produktionsprozess stabilisieren und rationalisieren" [11].

### Was ist der Unterschied zwischen Push- und Pull-Prinzip?

Ein Pull-System begrenzt den Umlaufbestand ausdrücklich; ein Push-System gibt Arbeit nach Plan frei, ohne eine solche Grenze [2]. Pull ist nicht dasselbe wie Auftragsfertigung: Ein Kanban-Regelkreis in der Lagerfertigung ist Pull, und eine Auftragsfertigung, die jeden Auftrag sofort freigibt, ist Push.

### Ist Kanban dasselbe wie Just-in-Time?

Nein. Just-in-Time ist das Prinzip, nur herzustellen, was gebraucht wird, wann es gebraucht wird, in der Menge, in der es gebraucht wird [8]. Kanban ist das Signalsystem, das Toyota entwickelt hat, um dieses Prinzip in die Praxis umzusetzen [7].

### Was ist ein Zwei-Behälter-Kanban (2-Behälter-System)?

Jedes Teil hat zwei Behälter am Verbrauchsort. Ist der erste leer, beginnt der Werker mit dem zweiten und schickt den leeren Behälter als Nachschubsignal zurück. Jeder Behälter fasst genug, um den Bedarf während der Nachfüllzeit plus einen Zuschlag abzudecken. Es ist die einfachste Form von Kanban und eignet sich für günstiges Verbrauchsmaterial [10].

### Was ist ein Kanban-Supermarkt?

Ein gesteuerter Bestandspunkt, meist neben dem liefernden Prozess, an dem jede Sachnummer eine feste Adresse und eine Höchstmenge hat. Der nachgelagerte Prozess oder ein Logistiker entnimmt daraus, und der Lieferant ersetzt nur, was entnommen wurde.

### Was ist E-Kanban?

Elektronisches Kanban ersetzt physische Karten durch Scans, Sensoren oder Systemnachrichten. Es hilft, Fehler bei der manuellen Erfassung und verlorene Karten zu vermeiden [10], und ist die übliche Form für weit entfernte Lieferanten [1]. Betreiben Sie einen Regelkreis zuerst auf Papier; digitalisieren Sie, sobald die Regeln halten.

### Was ist der Unterschied zwischen Kanban und MRP?

MRP plant Material und Kapazität terminiert aus einem Primärbedarfsplan und Stücklisten. Kanban löst Nachschub durch Verbrauch aus. In den meisten Werken übernimmt MRP die langfristige Planung, Prognosen an Lieferanten und Nicht-Kanban-Teile, während Kanban den täglichen Nachschub der Runner-Teile steuert [15][16].

### Was ist CONWIP und wie unterscheidet es sich von Kanban?

CONWIP (Constant Work in Process) verwendet einen Kartensatz für eine ganze Linie: Ein Auftrag kommt nur hinein, wenn eine Karte frei ist, und die Karte geht an den Anfang zurück, wenn der Auftrag fertig ist [3][5]. Kanban verwendet teilespezifische Karten an jeder Stufe. CONWIP ist leichter einzurichten und passt zu Linien mit vielen Varianten; Kanban steuert je Stufe enger [5].

### Wann sollte man Kanban nicht einsetzen?

Wenn der Bedarf je Teil sporadisch oder stark schwankend ist, wenn Produkte kundenspezifisch sind oder in kleinen Stückzahlen gefertigt werden, wenn Wiederbeschaffungszeiten lang und unzuverlässig sind oder wenn Teile häufig die Revision wechseln. Setzen Sie dann Auftragsfertigung mit CONWIP oder POLCA oder plangesteuerte MRP-Steuerung ein [20].

### Ist Kanban in der Produktion dasselbe wie ein Kanban-Board?

Nein. Beide begrenzen die laufende Arbeit, aber ein Kanban-Board steuert Aufgaben in der Wissensarbeit und wird nach Einschätzung des Teams dimensioniert, während Kanban in der Fertigung physische Teile steuert und per Formel dimensioniert wird. Die Board-Methode führt ihre Wurzeln auf Toyotas Produktionssystem zurück [22].

### Wie viele Kanbans braucht ein Regelkreis mindestens?

Zwei. Mit einer Karte muss der Verbraucher jedes Mal warten, wenn die Karte unterwegs ist. Manche Werke legen für Produktionskanbans ein Hausminimum von drei fest.

### Wie lange dauert die Einführung von Kanban?

Für einen Wertstrom kann ein Pilot mit 5 bis 15 Regelkreisen innerhalb von etwa drei Monaten laufen, wenn die liefernden Prozesse stabil sind; die vollständige Abdeckung eines Wertstroms dauert in der obigen Roadmap typischerweise etwa sechs Monate. Instabile Prozesse und lange Rüstzeiten verlängern das.

### Funktioniert Kanban mit Lieferanten?

Ja, über Lieferantenkanbans, die bei weit entfernten Lieferanten meist elektronisch sind [1]. Vereinbaren Sie Signalweg, Lieferzeit, Behälter, Menge und den Umgang mit Spitzen. Teilen Sie Prognosen aus dem MRP, damit der Lieferant Kapazität planen kann, während Kanban die tatsächlichen Lieferungen auslöst.

### Ist Just-in-Time ein Push- oder ein Pull-System?

Pull. Toyota beschreibt JIT als Kreislauf, in dem vorgelagerte Prozesse nur auffüllen, was nachgelagerte Prozesse entnommen haben [8], und Kanban ist das Werkzeug, das ihn umsetzt [7]. Ein Werk kann sich JIT nennen und trotzdem schieben, etwa indem es jeden Auftrag sofort nach Erfassung freigibt; der Prüfstein ist, ob der Umlaufbestand gedeckelt ist [2].

### Was bedeuten Push und Pull in der Supply Chain?

Dieselbe Logik, angewandt über Unternehmensgrenzen hinweg. In einer Push-Lieferkette werden Rohmaterial und Fertigwaren nach Prognose bewegt und gelagert. In einer Pull-Lieferkette folgt der Nachschub dem tatsächlichen Bedarf, zum Beispiel über Lieferantenkanbans [1]. Die meisten Lieferketten mischen beides: Prognosen planen Kapazität und Beschaffung mit langer Wiederbeschaffungszeit, Verbrauchssignale lösen die Lieferungen aus.

### Funktioniert ein Pull-System ohne Bedarfsprognosen?

Nicht ganz. Der tägliche Nachschub läuft über den Verbrauch, aber die Größe der Regelkreise wird aus dem erwarteten Bedarf berechnet, Kanban-Module im ERP berechnen sie aus Bedarfsperioden neu [15], und Lieferanten brauchen Prognosen, um Kapazität zu planen. Pull ersetzt die prognosegetriebene Auftragsfreigabe, nicht die Prognose.

### Gehört Kanban zu Lean oder zu Six Sigma?

Zu Lean. Kanban stammt aus dem Toyota-Produktionssystem [7][8], der Hauptquelle der Lean Production. Six Sigma ist eine eigenständige, statistikbasierte Methode zur Verringerung von Streuung und Fehlern. Viele Werke nutzen beides, weil stabile, fähige Prozesse kleinere Kanban-Regelkreise erlauben; siehe den [Leitfaden zu Six Sigma und Ursachenanalyse](https://www.m365.fm/learn/six-sigma-ursachenanalyse/).

### Ist Kanban japanisch oder chinesisch?

Japanisch. Kanban ist das japanische Wort für "Zeichen" oder "Schild" [1], und die Methode wurde bei Toyota in Japan entwickelt [7][10].

## Fazit und erste Schritte

Ein Kanban-System ist eine sichtbar gemachte Bestandsobergrenze. Seine Karten, Behälter und Supermärkte machen aus einer einfachen Idee aus Toyotas mechanischer Fertigung der 1950er Jahre tägliche Praxis: nur herstellen und transportieren, was der nächste Prozess verbraucht hat. Die für die Gestaltung wichtigste Definition stammt von Hopp und Spearman: Ein Pull-System begrenzt den Umlaufbestand ausdrücklich [2]. Kanban tut das Sachnummer für Sachnummer. CONWIP, POLCA und Drum-Buffer-Rope tun es für Linien, Zellenpaare und Engpässe und passen dort, wo teilespezifische Regelkreise nur Langsamdreher lagern würden.

Das Schwierige sind die Wiederbeschaffungszeit hinter jeder Karte, die Losgröße am liefernden Prozess, ein geglätteter Schrittmacherplan und die Disziplin, die Regeln einzuhalten. Dimensionieren Sie Regelkreise aus gemessenen Wiederbeschaffungszeiten, vergleichen Sie den Vorschlag Ihres ERP mit Ihrem eigenen Dimensionierungsblatt, nehmen Sie Karten nur heraus, wenn jemand beheben kann, was dadurch sichtbar wird, und halten Sie strategische Puffer außerhalb der Regelkreise, wo das Versorgungsrisiko es verlangt.

**Ihre ersten Schritte in den nächsten 30 Tagen**

- [ ] Eine Produktfamilie vom Versand zurück bis zum Wareneingang ablaufen und den Umlaufbestand zwischen allen Prozessen zählen
- [ ] Die aktuelle Durchlaufzeit mit Littles Gesetz berechnen (Umlaufbestand ÷ Tagesdurchsatz)
- [ ] Die Sachnummern der Familie anhand des Tagesbedarfs und seines Variationskoeffizienten in Runner, Repeater und Stranger einteilen
- [ ] Drei bis fünf Runner-Regelkreise neben einem stabilen liefernden Prozess auswählen
- [ ] Die Wiederbeschaffungszeit jedes Regelkreises durchgängig messen und das Dimensionierungsblatt ausfüllen
- [ ] Karten drucken und laminieren, Supermarktfächer markieren und Werker und Logistiker in den acht Shopfloor-Regeln schulen
- [ ] Mit dem Controlling vereinbaren, wie die Bestandssenkung berichtet wird, einschließlich des Effekts der Vollkostenbewertung
- [ ] Mit der IT prüfen, ob Ihr ERP ein Kanban-Modul hat und wie es Regelkreisgrößen berechnet; verhindern, dass MRP Kanban-Teile doppelt plant
- [ ] Die Regelkreise zwei Wochen lang täglich an der Shopfloor-Tafel besprechen, danach wöchentlich mit der Audit-Vorlage
- [ ] Bei Bedarf an Unterstützung von außen: in den USA das NIST-MEP-Zentrum des Bundesstaats kontaktieren [27]

---

## Weiterlesen auf m365.fm

**Pillar-Leitfäden**
- [Lean Management: Prinzipien, Werkzeuge, Einführung und Grenzen](https://www.m365.fm/learn/lean-management/)
- [Wertstromanalyse](https://www.m365.fm/learn/wertstromanalyse/)
- [Produktionsplanung und APS](https://www.m365.fm/learn/produktionsplanung-aps/)
- [S&OP, MRP und Produktionsplanung](https://www.m365.fm/learn/sop-mrp-produktionsplanung/) (geplant)
- [Theory of Constraints und Drum-Buffer-Rope](https://www.m365.fm/learn/theory-of-constraints-engpass/) (geplant)
- [SMED und Rüstzeitreduzierung](https://www.m365.fm/learn/smed-ruestzeitreduzierung/) (geplant)
- [TPM und OEE](https://www.m365.fm/learn/tpm-oee/) (geplant)
- [5S-Methode und visuelles Management](https://www.m365.fm/learn/5s-methode-visuelles-management/) (geplant)
- [Shop Floor Management](https://www.m365.fm/learn/shop-floor-management/)
- [Produktionskennzahlen](https://www.m365.fm/learn/produktionskennzahlen/)
- [MES und ISA-95](https://www.m365.fm/learn/mes-isa-95/) (geplant)
- [OT-Security und IEC 62443](https://www.m365.fm/learn/ot-security-iec-62443/) (geplant)
- [Manufacturing IT mit Azure](https://www.m365.fm/learn/manufacturing-it-azure/)
- [Produktionsplanung in der Luftfahrt](https://www.m365.fm/learn/produktionsplanung-luftfahrt/)
- [iFAKT Polaris](https://www.m365.fm/learn/ifakt-polaris/)

**Cluster-Leitfäden**
- [Losgröße berechnen](https://www.m365.fm/learn/produktionsplanung-aps/losgroesse/) (geplant)
- [Bestandsmanagement in der Produktion und Sicherheitsbestand](https://www.m365.fm/learn/produktionsplanung-aps/bestandsmanagement/) (geplant)
- [Intralogistik und Milkrun](https://www.m365.fm/learn/produktionsplanung-aps/intralogistik/) (geplant)
- [Simulation in der Produktion](https://www.m365.fm/learn/digital-twin/simulation-produktion/) (geplant)
- [Resiliente Lieferketten](https://www.m365.fm/learn/operational-excellence/resiliente-lieferketten/) (geplant)
- [Standardarbeit](https://www.m365.fm/learn/shop-floor-management/standardarbeit/) (geplant)
- [Kaizen](https://www.m365.fm/learn/lean-management/kaizen/) (geplant)

**Glossarbegriffe (Entities)**
[Kanban](https://www.m365.fm/entity/kanban/) · [Pull-System](https://www.m365.fm/entity/pull-system/) · [Just-in-Time](https://www.m365.fm/entity/just-in-time/) · [Heijunka](https://www.m365.fm/entity/heijunka/) · [5S](https://www.m365.fm/entity/5s/) · [Standardarbeit](https://www.m365.fm/entity/standard-work/) · [Theory of Constraints](https://www.m365.fm/entity/theory-of-constraints/) · [Lean Management](https://www.m365.fm/entity/lean-management/)

# Autorenbox

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** ist Host von m365.fm und arbeitet bei der iFAKT GmbH. Auf m365.fm schreibt er über Lean Management, Produktionsplanung und die digitale Transformation der Produktion, mit Schwerpunkt darauf, wie Wertstrommodelle, Simulation und Kennzahlenanalyse Werken helfen, Fluss und Pull zu gestalten. [Redaktion: Rolle, Kurzbio und Foto ergänzen.]

**Hinweis: Der Autor arbeitet bei der iFAKT GmbH.**

# Quellen

Alle Quellen abgerufen am 20. November 2026. Mit (V) markierte Quellen wurden für diesen Artikel an diesem Tag geöffnet und geprüft. Mit (V-Schwester) markierte Quellen wurden am selben Tag für den Schwester-Pillar Lean Management (englisch `lean-manufacturing.md`) geöffnet und geprüft; das Abrufbudget war erschöpft, bevor eine zweite Prüfung für diesen Artikel möglich war, deshalb hat die Faktenprüfung sie für eine kurze Nachprüfung vor Veröffentlichung markiert (siehe Prüfhinweise).

1. Kanban. Lean Enterprise Institute, Lean Lexicon. https://www.lean.org/lexicon-terms/kanban/ (V)
2. Hopp, W. J.; Spearman, M. L.: To Pull or Not to Pull: What Is the Question? *Manufacturing & Service Operations Management* 6 (2004) 2, S. 133–148. DOI: 10.1287/msom.1030.0028. https://pubsonline.informs.org/doi/pdf/10.1287/msom.1030.0028 (V)
3. Spearman, M. L.; Woodruff, D. L.; Hopp, W. J.: CONWIP: a pull alternative to kanban. *International Journal of Production Research* 28 (1990) 5, S. 879–894. DOI: 10.1080/00207549008942761. Nachdruck und Abstract: Project Production Institute Journal, Bd. 3 (2018). https://projectproduction.org/journal/conwip-a-pull-alternative-to-kanban/ (V; Band, Heft und Seiten wie für den Schwester-Pillar Produktionsplanung und APS geprüft)
4. Spearman, M. L.; Woodruff, D. L.; Hopp, W. J.: CONWIP Redux: reflections on 30 years of development and implementation. *International Journal of Production Research* 60 (2022) 1, S. 381–387. DOI: 10.1080/00207543.2021.1954713. https://econpapers.repec.org/RePEc:taf:tprsxx:v:60:y:2022:i:1:p:381-387 (V)
5. CONWIP. Wikipedia (englisch). https://en.wikipedia.org/wiki/CONWIP (V)
6. Little, J. D. C.: A Proof for the Queuing Formula: L = λW. *Operations Research* 9 (1961) 3, S. 383–387. DOI: 10.1287/opre.9.3.383. https://ideas.repec.org/a/inm/oropre/v9y1961i3p383-387.html (V)
7. Sugimori, Y. et al. (vier Autoren): Toyota production system and Kanban system: Materialization of just-in-time and respect-for-human system. *International Journal of Production Research* 15 (1977) 6, S. 553–564. DOI: 10.1080/00207547708943149. https://scispace.com/papers/toyota-production-system-and-kanban-system-materialization-2c0g0kt2j0 (V; der Datensatz nennt Y. Sugimori plus drei Mitautoren)
8. Toyota Production System. Toyota Motor Corporation. https://global.toyota/en/company/vision-and-philosophy/production-system/index.html (V)
9. Ohno, T.: Toyota Production System: Beyond Large-Scale Production. Productivity Press / Routledge (englische Ausgabe 1988). https://www.routledge.com/Toyota-Production-System/Ohno/p/book/9780915299140 (V-Schwester)
10. Kanban. Wikipedia (englisch). https://en.wikipedia.org/wiki/Kanban (V)
11. Roser, C.: Toyota's Six Rules for Kanban. AllAboutLean. https://www.allaboutlean.com/toyotas-six-rules/ (V)
12. Roser, C.: How Many Kanbans? The Kanban Formula, Part 1. AllAboutLean. https://www.allaboutlean.com/kanban-formula-part1/ (V)
13. Roser, C.: How Many Kanbans? The Kanban Formula, Part 2. AllAboutLean. https://www.allaboutlean.com/kanban-formula-part2/ (V)
14. Co, H. C.; Moosa, S.: Overplanning Factor in Toyota's Formula for Computing the Number of Kanban. *IIE Transactions* 29 (1997) 5, S. 409–415. DOI: 10.1080/07408179708966346. https://ink.library.smu.edu.sg/lkcsb_research/892 (V)
15. Kanban quantity calculations and circulating kanbans (Trainingsmodul Dynamics 365 Supply Chain Management). Microsoft Learn. https://learn.microsoft.com/en-us/training/modules/create-process-fixed-kanbans-dyn365-supply-chain-mgmt/5-calculations (V)
16. Kanban Equation 1: Fixed Container Size and High Demand. Oracle JD Edwards EnterpriseOne Kanban Management 9.2, Dokumentation. https://docs.oracle.com/en/applications/jd-edwards/supply-chain-manufacturing/9.2/eoakm/kanban-equation-1-fixed-container-size-and-high-demand.html (V)
17. Lage Junior, M.; Godinho Filho, M.: Variations of the kanban system: Literature review and classification. *International Journal of Production Economics* 125 (2010) 1, S. 13–21. Elsevier, ScienceDirect PII S0925-5273(10)00019-8. https://ideas.repec.org/a/eee/proeco/v125y2010i1p13-21.html (V; DOI auf der Datensatzseite nicht angegeben)
18. Heijunka. Lean Enterprise Institute, Lean Lexicon. https://www.lean.org/lexicon-terms/heijunka/ (V)
19. Pitch. Lean Enterprise Institute, Lean Lexicon. https://www.lean.org/lexicon-terms/pitch/ (V)
20. Suri, R.: The Practitioner's Guide to POLCA: The Production Control System for High-Mix, Low-Volume and Custom Products. Productivity Press / Taylor & Francis. https://www.taylorfrancis.com/books/9781351170765 (V; Abstract und Inhaltsverzeichnis; Erscheinungsjahr auf der Seite nicht angegeben, siehe Prüfhinweise)
21. Rajan Suri, Professor Emeritus, Industrial and Systems Engineering (POLCA, Center for Quick Response Manufacturing). University of Wisconsin–Madison, College of Engineering. https://engineering.wisc.edu/?p=27657 (V)
22. Kanban (development). Wikipedia (englisch). https://en.wikipedia.org/wiki/Kanban_(development) (V)
23. How the Kanban System of Inventory Management Works. Smartsheet. https://www.smartsheet.com/understanding-kanban-inventory-management-and-its-uses-across-multiple-industries (V; Herstellerseite)
24. Kanban in manufacturing: cards, boards and supermarkets. Veryable. https://www.veryableops.com/blog/kanban-manufacturing-cards-boards-supermarkets (V; Herstellerseite)
25. Plex: Push vs. Pull Manufacturing: Is a Kanban Pull System Right for Your Company? IndustryWeek, 28. Juli 2017. https://www.industryweek.com/cloud-computing/article/22023873/push-vs-pull-manufacturing-is-a-kanban-pull-system-right-for-your-company (V; Autorenzeile eines Anbieters)
26. Shirouzu, N.: How Toyota thrives when the chips are down. Reuters, via nippon.com (März 2021). https://www.nippon.com/en/news/reu20210309KBN2B1004/ (V-Schwester)
27. Lean and Process Improvement. NIST Manufacturing Extension Partnership (MEP). https://www.nist.gov/mep/lean-and-process-improvement (V)
28. Ergonomics. Occupational Safety and Health Administration (OSHA), US Department of Labor. https://www.osha.gov/ergonomics (V)

# Prüfhinweise für die Redaktion

Fachliche Prüfung (9-köpfiges Expertenpanel, mehrere Runden) siehe englische Fassung; die deutsche Fassung ist eine Übertragung ohne inhaltliche Änderungen.

**Herstellerangaben:** Smartsheet [23], Veryable [24], Plex via IndustryWeek [25], Microsoft [15] und Oracle [16] sind Herstellerquellen. Sie werden nur für ihre eigenen Formeln oder für eine Einordnung (Push/Pull-Mischform, Alternativen zu Kanban) zitiert, nie für Leistungsergebnisse. Fallzahlen von Wettbewerbern ("25 % weniger Bestand, 50 % kürzere Durchlaufzeit") wurden bewusst nicht übernommen. Die Nennung von "Cin7" bei den Kanban-Arten (Durchlaufkanban) steht im Original ohne Quellennummer; prüfen.

**[unbelegt]-Stellen:** Supermarkt-Inspiration "Ende der 1940er Jahre" (Wikipedia-Satz ohne Beleg). Weitere offene Punkte: Quellen mit (V-Schwester) [9][26] vor Veröffentlichung erneut öffnen; vollständige Autorenliste zu [7] ergänzen; Erscheinungsjahr von [20] fehlt; Drum-Buffer-Rope und Goldratt sind hier bewusst nicht belegt (Primärquellen im Pillar Theory of Constraints); keine ASCM/APICS-Definition zitiert (Paywall). Alle Formeln der Rechenbeispiele 1 bis 6, das Heijunka- und das CONWIP-Beispiel wurden nachgerechnet; Controlling-Zahlen (20 % Lagerhaltungskostensatz, Pilotkosten) sind beispielhaft und gekennzeichnet.

**Interne Links:** Alle `/en/learn/`-Links auf die deutschen URLs laut Slug-Map umgestellt (Pillars: lean-management 3×, wertstromanalyse, produktionsplanung-aps, sop-mrp-produktionsplanung, theory-of-constraints-engpass, smed-ruestzeitreduzierung 2×, tpm-oee, 5s-methode-visuelles-management, shop-floor-management, produktionskennzahlen 2×, mes-isa-95, ot-security-iec-62443, manufacturing-it-azure, produktionsplanung-luftfahrt, ifakt-polaris; Cluster: produktionsplanung-aps/losgroesse, produktionsplanung-aps/bestandsmanagement, produktionsplanung-aps/intralogistik, digital-twin/simulation-produktion, operational-excellence/resiliente-lieferketten, shop-floor-management/standardarbeit, lean-management/kaizen). Neue Pillars und Cluster tragen "(geplant)"; bei bestehenden deutschen Pillars entfällt der Zusatz. Entity-Links bleiben unverändert. Sprungmarken im Inhaltsverzeichnis gegen die vom CMS erzeugten Anker prüfen (Umlaute in Ankern, z. B. `#supermärkte-fifo-bahnen-und-der-schrittmacherprozess`).

**Kannibalisierung:** Der Pillar Lean Management enthält kurze Abschnitte zu Kanban und Pull/Supermarkt mit einem kurzen Dimensionierungsbeispiel; er sollte mit dem Anker "Kanban-System" hierher verlinken. Produktionsplanung und APS überschneidet sich bei CONWIP und sollte die Planungssicht behalten. Die Wertstromanalyse behandelt Kanban-Symbole; dieser Leitfaden verlinkt dorthin. Die Software-Bedeutung von Kanban (Boards) wird nicht als Ziel verfolgt.

**iFAKT:** Eine Nennung im Abschnitt "Regelkreise simulieren" als Verweis auf den bestehenden Pillar iFAKT Polaris, mit der Offenlegung "Hinweis: Der Autor arbeitet bei der iFAKT GmbH."; zusätzlich in der Autorenbox. Keine Produktfähigkeit wird behauptet; kein Sponsoring-Hinweis, iFAKT zahlt nicht für die Veröffentlichung.

**hreflang:** `de-DE` https://www.m365.fm/learn/kanban-pull-prinzip/ <-> `en-US` https://www.m365.fm/en/learn/kanban-pull-system/. Die englische Fassung muss beim Livegang das Gegenstück erhalten (dort bisher "no hreflang pair").

**JSON-LD-Vorschlag:**

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "headline": "Kanban in der Produktion: wie das Pull-Prinzip funktioniert, wie man Kanban-Regelkreise dimensioniert und wann man etwas anderes einsetzt",
      "description": "Kanban in der Produktion erklärt: wie das Pull-Prinzip funktioniert, Kanban-Arten, Kanban-Formel, E-Kanban, CONWIP, Einführung und Kennzahlen.",
      "inLanguage": "de-DE",
      "url": "https://www.m365.fm/learn/kanban-pull-prinzip/",
      "mainEntityOfPage": "https://www.m365.fm/learn/kanban-pull-prinzip/",
      "datePublished": "2026-11-26",
      "dateModified": "2026-11-26",
      "author": {"@type": "Person", "name": "Mirko Peters", "url": "https://www.m365.fm/entity/mirko-peters/"},
      "publisher": {"@type": "Organization", "name": "m365.fm", "url": "https://www.m365.fm/"},
      "about": [{"@type": "Thing", "name": "Kanban"}, {"@type": "Thing", "name": "Pull-Prinzip"}],
      "keywords": "Kanban Produktion, Pull-Prinzip, Kanban-Formel, Kanban-Karte, Supermarkt, E-Kanban, CONWIP, POLCA, Heijunka"
    },
    {
      "@type": "FAQPage",
      "inLanguage": "de-DE",
      "mainEntity": [
        {"@type": "Question", "name": "Was ist ein Kanban-System in der Produktion?", "acceptedAnswer": {"@type": "Answer", "text": "Ein Kanban-System steuert Produktion und Materialfluss mit Signalen, die durch Verbrauch ausgelöst werden. Wenn ein nachgelagerter Prozess einen Behälter verbraucht, gehen seine Karte oder der leere Behälter zurück und geben genau einen Ersatz frei. Die Zahl der Karten deckelt den Bestand in jedem Regelkreis."}},
        {"@type": "Question", "name": "Wie berechnet man die Anzahl der Kanban-Karten?", "acceptedAnswer": {"@type": "Answer", "text": "Bedarf × Wiederbeschaffungszeit × (1 + Sicherheitsfaktor) ÷ Behältermenge, aufgerundet, zum Beispiel 960 × 0,25 × 1,1 ÷ 40 = 6,6, also 7 Karten. Dann Karten für Sammelintervalle und Losgrößen am liefernden Prozess ergänzen."}},
        {"@type": "Question", "name": "Was ist der Unterschied zwischen Push- und Pull-Prinzip?", "acceptedAnswer": {"@type": "Answer", "text": "Ein Pull-System begrenzt den Umlaufbestand ausdrücklich; ein Push-System gibt Arbeit nach Plan frei, ohne eine solche Grenze. Pull ist nicht dasselbe wie Auftragsfertigung."}},
        {"@type": "Question", "name": "Ist Just-in-Time ein Push- oder ein Pull-System?", "acceptedAnswer": {"@type": "Answer", "text": "Pull. Toyota beschreibt JIT als Kreislauf, in dem vorgelagerte Prozesse nur auffüllen, was nachgelagerte Prozesse entnommen haben, und Kanban ist das Werkzeug, das ihn umsetzt. Der Prüfstein ist, ob der Umlaufbestand gedeckelt ist."}},
        {"@type": "Question", "name": "Was ist CONWIP und wie unterscheidet es sich von Kanban?", "acceptedAnswer": {"@type": "Answer", "text": "CONWIP verwendet einen Kartensatz für eine ganze Linie: Ein Auftrag kommt nur hinein, wenn eine Karte frei ist, und die Karte geht an den Anfang zurück, wenn der Auftrag fertig ist. Kanban verwendet teilespezifische Karten an jeder Stufe."}},
        {"@type": "Question", "name": "Ist Kanban in der Produktion dasselbe wie ein Kanban-Board?", "acceptedAnswer": {"@type": "Answer", "text": "Nein. Beide begrenzen die laufende Arbeit, aber ein Kanban-Board steuert Aufgaben in der Wissensarbeit, während Kanban in der Fertigung physische Teile steuert und per Formel dimensioniert wird."}}
      ]
    }
  ]
}
```

Der FAQPage-Block zeigt sechs der 22 FAQ; auf alle erweitern, wenn das CMS es unterstützt.

**Empfohlene Grafiken (Beschriftungen auf Deutsch):** (1) Zwei-Karten-Kanban-Regelkreis (Montagelinie, Kanban-Briefkasten, Supermarkt, liefernde Zelle) mit den sechs Schritten wie in der Tabelle; (2) Balken der Wiederbeschaffungszeit für Beispiel 2 (Abholung 60, Warten 90, Bearbeitung 20, Transport 15 Minuten, plus Losbildungskarten); (3) Sensitivitätsdiagramm aus Beispiel 6; (4) Signalkanban-Stapel: 16 Behälter mit dem Dreieck an Behälter 6; (5) Heijunka-Box mit der Folge A B A C A B A C A B A D; (6) Entscheidungsbaum Runner / Repeater / Stranger -> Kanban / CONWIP / POLCA / MRP; (7) E-Kanban-Datenfluss: Scan -> Kanban-Anwendung/ERP -> Fertigungsauftrag oder Lieferantenabruf -> Wareneingangsscan.

**Einheiten:** "500 miles" als "ca. 800 km (500 Meilen)", "a few hundred feet" als "ca. 100 m (a few hundred feet)" und "6 feet (about 2 m)" als "ca. 2 m (6 feet)" übertragen; prüfen, ob die Fußangaben im Layout bleiben sollen.

**Für den deutschen Markt prüfen (Aufgabe für die Fachprüfung, nicht als Fakt in den Text übernommen):**
- Ergonomie im Supermarkt, Vorlage 3 und Abschnitt "Werker, Logistiker ... einbeziehen": Der Text verweist auf die OSHA (US-Kontext) [28]. Für Deutschland prüfen: ArbSchG (Gefährdungsbeurteilung), Lastenhandhabungsverordnung (LasthandhabV), DGUV-Informationen, Leitmerkmalmethode (BAuA).
- Abschnitt "Werker, Logistiker und ihre Vertretung einbeziehen": Verweis auf US-Arbeitsrecht (NLRA, Mitarbeiterausschüsse). Für Deutschland prüfen: Mitbestimmung des Betriebsrats nach §87 BetrVG (u. a. Arbeitszeit, technische Einrichtungen zur Leistungs- und Verhaltenskontrolle bei E-Kanban-Scans mit Personenbezug, Arbeitsschutz), §90/§91 BetrVG bei Umgestaltung von Arbeitsplätzen und Abläufen, §111 ff. BetrVG bei grundlegenden Änderungen; Datenschutz (DSGVO, §26 BDSG) bei Scan- und Sensordaten.
- "Hilfe von außen holen" und letzter Punkt der ersten Schritte: NIST MEP ist ein US-Angebot. Für Deutschland ggf. vergleichbare Angebote (z. B. Mittelstand-Digital-Zentren, Fraunhofer-Institute, Förderprogramme der Länder) als redaktionelle Ergänzung prüfen.
- Controlling-Abschnitt: Vollkosten- und Teilkostenrechnung sind auch in Deutschland gängig; die Bewertung des Vorratsvermögens nach HGB (§255 HGB, Herstellungskosten) bzw. IFRS (IAS 2) sollte die Fachprüfung als möglichen ergänzenden Hinweis prüfen.
- ERP-Abschnitt: Microsoft Dynamics 365 und Oracle JD Edwards wie im Original; im deutschen Markt ist SAP verbreitet (Nebenkeyword "Kanban SAP"). Eine SAP-Erwähnung nur mit geprüfter Quelle ergänzen.
- Beträge in USD und Rechenbeispiele bleiben wie im Original.
