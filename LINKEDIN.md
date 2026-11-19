# LinkedIn-Follower in die Mediadaten (Pages Data Portability API)

Ziel: Die Follower-Zahl der Unternehmensseite **M365 Show** kommt automatisch aus LinkedIn in `data/stats/m365con_linkedin.json`
(`page.page_followers`). Daraus liest `tools/mediakit_con.py` (M365Con-Sponsordeck). Die API ist **nur lesend**: Damit kann nichts im Namen
der Seite gepostet werden (siehe unten). Gespeichert wird nur die Summe, nie ein Follower-URN oder Name.

Werkzeug: `tools/linkedin_stats.py` · Workflow: `.github/workflows/linkedin-stats.yml` (sonntags automatisch, sonst manuell) · Test: `tests/test_linkedin_stats.py`

## Einrichtung (einmalig, Mirko)

1. **App prüfen**: <https://www.linkedin.com/developers/apps> → die App öffnen → Reiter **Products** → „Pages Data Portability API“ muss auf *Added/Approved* stehen.
2. **Seiten-ID** ablesen: die Admin-Ansicht der Seite öffnen (<https://www.linkedin.com/company/>, dort die Seite M365 Show → „Admin view“). In der Adresse steht
   `linkedin.com/company/`**`ZAHL`**`/admin/` – die Zahl ist die Seiten-ID.
3. **Zugriffstoken** erzeugen: in der App Reiter **Auth** → „OAuth 2.0 tools“ (<https://www.linkedin.com/developers/tools/oauth>) → „Create token“ →
   Recht **`r_dma_admin_pages_content`** ankreuzen → mit dem LinkedIn-Konto bestätigen, das **Administrator** (oder Content-Admin/Analyst) der Seite ist →
   den Token kopieren. Er gilt typischerweise 60 Tage, danach neu erzeugen. *Hinweis: Ich habe nicht geprüft, ob das Werkzeug das DMA-Recht anbietet;
   falls nicht, sag Bescheid – dann gehe ich mit dir den normalen OAuth-Ablauf durch.*
4. **In GitHub eintragen** (nur dort, nie in den Chat):
   - Secret `LINKEDIN_ACCESS_TOKEN`: <https://github.com/Mirko-Peters/m365-FM/settings/secrets/actions/new>
   - Variable `LINKEDIN_PAGE_ID` (die Zahl aus Schritt 2): <https://github.com/Mirko-Peters/m365-FM/settings/variables/actions/new>
5. **Probelauf**: <https://github.com/Mirko-Peters/m365-FM/actions/workflows/linkedin-stats.yml> → „Run workflow“ → Modus **probe**. Das schickt eine Anfrage
   und schreibt nur die *Form* der Antwort ins Protokoll (Feldnamen, `paging.total`), keine Personendaten, und speichert nichts.
6. Danach Modus **fetch** mit `dry_run` an (zählt und zeigt die Zahl), zuletzt mit `dry_run` aus (speichert in die Datei).

## Wöchentlicher Lauf

Sonntags 03:29 UTC liest der Workflow nur die aktuelle Follower-Zahl aus und speichert sie (Modus `fetch`, ohne Probelauf, ohne `trust_total`,
also vollständig gezählt). Solange Secret oder Seiten-ID fehlen, endet er grün mit einem Hinweis und fragt nichts ab. Der Schutz unten gilt auch hier.

## Wie gezählt wird

Die API liefert je Follower eine „Kante“ (`dmaOrganizationalPageFollows`, 1000 je Anfrage, höchstens 1 Anfrage je 60 s, Daten bis 48 h alt).
Bei rund 100.000 Followern sind das gut 100 Anfragen ≈ 1,7 Stunden. Zeigt der Probelauf, dass `paging.total` die Gesamtzahl ist, genügt eine Anfrage
(Eingabe `trust_total`). Der Schutz: Ein Wert unter der Hälfte des bisherigen oder 0 wird nicht gespeichert (z. B. wenn Mitglieder ihre Daten nicht
freigegeben haben und die API weniger liefert).

## Noch offen (bewusst nicht geraten)

- **Besucher- und Inhalts-Statistiken** (Edge Analytics, Reporting): die Doku nennt sie, aber ohne Endpunkt-Seite, die ich lesen konnte. Erst wenn der Probelauf
  die Anmeldung bestätigt, lese ich die Form echter Antworten und baue sie dazu – keine erfundenen Felder.
- **Anzeige auf `/media-kit/`**: die Seite verweist auf das monatliche PDF; die Follower stehen ab dem nächsten PDF-Bau im Sponsordeck.

## Im Namen der Seite posten

Geht **nicht** mit dieser API (nur lesend). Dafür braucht es die **Community Management API** (Recht `w_organization_social`, Rolle Administrator,
Content-Admin oder Direct Sponsored Content Poster). Das ist ein eigenes Produkt mit Freigabe (erst Development-Stufe, dann Standard-Stufe mit
Bildschirmaufnahme) und braucht eine **zweite, neue App**. Quelle: <https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api>
und <https://learn.microsoft.com/en-us/linkedin/marketing/community-management/community-management-overview>. Gepostet wird nur mit Mirkos Ja je Automatisierung.
