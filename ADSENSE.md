# AdSense: feste Anzeigenblöcke

Die Seite nutzt **feste Anzeigenblöcke** statt Auto-Anzeigen. Das Skript lädt nur auf Seiten, auf denen wir einen Block gesetzt haben; Googles Auto-Formate (z. B. das Popup „Discover more“ über dem Header) erscheinen dadurch nicht. Das Meta-Tag `google-adsense-account` und `ads.txt` bleiben für die Prüfung.

## Was du in AdSense tun musst
1. **Drei Anzeigenblöcke anlegen:** Anzeigen → *Nach Anzeigenblock* → *Display-Anzeigen*.
   - `m365-top`: Typ **Display, horizontal** (nach H1 und Einleitung)
   - `m365-mitte`: Typ **responsiv** (im Text nach dem zweiten Abschnitt)
   - `m365-ende`: Typ **responsiv** (vor dem Footer)
   Im Codefenster steht je `data-ad-slot="1234567890"`: diese Zahl ist die Block-ID. Den Rest des Codes brauchst du nicht.
2. **IDs eintragen:** in `data/adsense.json` bei `slots` (oder die Zahlen an Claude schicken). Solange keine eigene Top-ID vorliegt, verwendet `top` den Slot von `mid`. Für eine getrennte Auswertung wird ein eigener Block `Display, horizontal` empfohlen.
3. **Auto-Anzeigen ausschalten:** Anzeigen → *Nach Website* → `www.m365.fm` → Stift bei *Auto-Anzeigen* → ausschalten. Sonst platziert Google zusätzlich selbst.
4. **EU-Einwilligungsnachricht** (Datenschutz und Mitteilungen) bleibt Pflicht für Besucher aus EWR/UK/CH.

## Wo Blöcke stehen
Der Top-Block steht nach der H1 und dem ersten Absatz auf indexierbaren Folgen-, Blogartikel- und Entitätsseiten mit mindestens 2500 Zeichen. Mittel- und Endblock behalten ihre bisherigen Positionen. Keine Blöcke auf Hub-, Rechts-, Live- oder noindex-Seiten und nie in Header, Navigation oder Sidebar. Leere Blöcke behalten ihre reservierte Höhe und zeigen den Sponsor-Hinweis.

## Umschalten
`"auto_ads": true` in `data/adsense.json` lädt das Skript wieder auf allen geeigneten Seiten (Google entscheidet dann über die Platzierung).
