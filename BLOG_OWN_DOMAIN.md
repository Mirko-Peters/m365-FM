# Blog auf der eigenen Domain („Bring your own domain“)

Stand: 11.11.2026, **Entwurf** für Mirko. Alles hinter dem Schalter `BYOD`, standardmäßig **aus**. Nichts davon ist deployt, kein Cloudflare-Aufruf wurde gemacht.

## Kurz gesagt

- Ein Mitglied trägt bei seiner Domain **einen** DNS-Eintrag ein (CNAME auf unser Ziel). Danach läuft sein Blog dort, mit eigenem Zertifikat (https), und bleibt im m365.fm-Ökosystem (gleiche Beiträge, gleiche Upvotes, gleiche Redaktionsregeln).
- Technisch ist das **Cloudflare for SaaS (Custom Hostnames)**. Es ist bei Cloudflare in den normalen Tarifen enthalten, also auch in Mirkos **Pro**-Tarif. **100 Domains sind inklusive**, jede weitere kostet laut Doku 0,10 USD.
- Wir brauchen dafür **keinen neuen Server**. Der vorhandene Site-Worker (`sitewrk/`) schaut auf den Host der Anfrage. Gehört er zu einer aktiven Mitglieds-Domain, liefert er den Blog dieses Mitglieds aus, sonst bleibt alles wie heute.
- Domain-Einnahmen: **70 % Banner-Werbung an den Autor, 30 % an M365.FM. Sponsoring bleibt zu 100 % bei M365.FM.** Es wird nur vorbereitet (Datenmodell und Rechenregel), nichts ausgezahlt.

## 1. Was Cloudflare kann (belegt, Stand 11.11.2026)

Quellen sind die offiziellen Cloudflare-Seiten, am 11.11.2026 gelesen.

| Frage | Antwort | Quelle |
|---|---|---|
| Was ist das? | Kunden-Domains werden als „Custom Hostnames“ in **unserer** Zone angelegt. Cloudflare leitet den Verkehr zu unserem Ursprung und stellt das Zertifikat aus. | [Cloudflare for SaaS](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/index.md) |
| Welche Tarife? | In den Nicht-Enterprise-Tarifen enthalten (Free, Pro, Business). Die Seite nennt „Pro“ nicht eigens, die Tabelle der Pläne aber schon. | [Plans](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/plans/) |
| Freigrenze und Preis | Free, Pro, Business: **100 Hostnamen inklusive**, jeder weitere **0,10 USD**, Obergrenze **50.000**. Die Seite sagt nicht ausdrücklich „pro Monat“. Ältere Doku nannte „pro Monat“. Bitte im Dashboard unter Abrechnung bestätigen. | [Plans](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/plans/) |
| Zählung | Jeder Hostname zählt, bis er gelöscht wird, auch wenn er noch auf Prüfung wartet. Die Grenze ist weich (Warnung), die API hat bei Nicht-Enterprise eine harte Obergrenze. Verbrauch: `GET /zones/{zone}/custom_hostnames/quota`. | [Quotas and billing](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/quotas-and-billing/) |
| Fallback-Ursprung | Pflicht. Ein **proxied** DNS-Eintrag (A, AAAA oder CNAME) in unserer Zone, der als „Fallback Origin“ festgelegt wird. Status muss „Active“ sein. | [Getting started](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/start/getting-started/index.md) |
| CNAME-Ziel | Optional, empfohlen: ein proxied CNAME, auf den die Kunden zeigen (z. B. `blogs.beispiel.net`). Kunden tragen `blog.kunde.de CNAME blogs.beispiel.net` ein. | [Getting started](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/start/getting-started/index.md) |
| Zertifikat | Automatisch. Cloudflare stellt für jeden Hostnamen ein ECDSA-Zertifikat und ein RSA-Ersatzzertifikat aus. Prüfung per HTTP (automatisch), TXT oder Delegated DCV. Der Hostname ist fertig, wenn `status` **und** `ssl.status` beide `active` sind und der CNAME stimmt. | [Getting started](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/start/getting-started/index.md) |
| Besitz der Domain | Cloudflare muss prüfen, dass der Kunde die Domain besitzt („Hostname Validation“). Bei „Echtzeit-Prüfung“ genügt, dass der CNAME auf unser Ziel zeigt. Dabei kann es einen kurzen Ausfall geben, bis das Zertifikat da ist. Eine Prüfung per Vorab-Eintrag (TXT) vermeidet den Ausfall. | [Hostname validation](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/domain-support/hostname-validation/index.md) |
| Apex-Domains (`kunde.de` ohne Unterdomain) | Nur per CNAME auf dem Apex, wenn der DNS-Anbieter des Kunden das kann („CNAME-Flattening“). Eine A-Adresse auf unser Ziel geht nicht. Dafür gibt es „Apex Proxying“ oder BYOIP, beides **Enterprise-Zusatz**. | [Overview](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/index.md), [Getting started](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/start/getting-started/index.md) |
| Wildcards, eigene Zertifikate | Nur Enterprise. Brauchen wir nicht. | [Plans](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/plans/) |
| Worker als Ursprung | Geht. Fallback-Eintrag ohne echten Server (z. B. `service.beispiel.net AAAA 100::`), dazu eine **Worker-Route** in der SaaS-Zone (`*/*` oder je Hostname). Der Worker liest den Host. | [Worker as origin](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/start/advanced-settings/worker-as-origin/index.md) |
| Was sieht der Worker? | Den Host des Kunden. Cloudflare gibt den Host-Header „genau wie vom Browser gesendet“ weiter. Wichtig: Die Einstellung „eigener Ursprung je Hostname“ greift bei Workern nicht, die Auswahl muss im Worker passieren. | [Connection details](https://developers.cloudflare.com/cloudflare-for-saas/reference/connection-details), [Worker as origin](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/start/advanced-settings/worker-as-origin/index.md) |
| Falle | Ein Hostname darf **nicht** dem Namen der Zone entsprechen. Stellt ein Kunde seinen CNAME selbst auf „Proxied“ (Cloudflare), kann eine spezifischere Route den Worker umgehen. | [Worker as origin](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/start/advanced-settings/worker-as-origin/index.md) |
| API | Anlegen, Lesen, Ändern, Löschen von Custom Hostnames unter `/zones/{zone_id}/custom_hostnames`. Antwort enthält oft `validation_records` erst bei einem zweiten Abruf. | [Common API calls](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/start/common-api-calls/) |

### Was ich nicht belegen konnte

- Welche **Token-Rechte** genau nötig sind. Mein Wissensstand: Zone → *SSL and Certificates* → Bearbeiten, für die SaaS-Zone. Bitte beim Anlegen des Tokens prüfen.
- Ob ein Hostname bei Cloudflare nach einer Frist automatisch gelöscht wird, wenn der CNAME nie kommt. Die Seiten, die ich lesen konnte, sagen dazu nichts. Unser Code legt einen Hostnamen erst an, wenn der CNAME nachweislich gesetzt ist, und löscht ihn beim Entfernen der Domain (siehe Abschnitt 3). So entstehen kaum verwaiste Einträge.
- Ob das Pro-Abo von m365.fm als „SaaS-Zone“ taugt. Die Doku verlangt eine Zone auf einem Nicht-Enterprise-Tarif. Wir empfehlen trotzdem eine eigene, kleine Zone (Abschnitt 3).
- Preise für die Zusatzdomain und das Pro-Abo selbst habe ich nicht neu geprüft.

## 2. Kosten

| Posten | Betrag | Quelle, Stand |
|---|---|---|
| Custom Hostnames, die ersten 100 | 0 USD | [Plans](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/plans/), 11.11.2026 |
| jeder weitere Hostname | 0,10 USD (wohl je Monat, bitte bestätigen) | gleiche Seite, 11.11.2026 |
| Beispiel 500 Mitglieder-Domains | 400 × 0,10 = 40 USD (je Monat, falls monatlich) | gerechnet |
| Workers Paid (hat Mirko) | 5 USD je Monat Mindestbetrag, 10 Mio. Anfragen und 30 Mio. CPU-ms inklusive, danach 0,30 USD je Mio. Anfragen und 0,02 USD je Mio. CPU-ms | [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/index.md), 11.11.2026 |
| Pro-Tarif (hat Mirko) | schon bezahlt, kein Aufpreis für Custom Hostnames | [Plans](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/plans/), 11.11.2026 |
| Eigene Zone für die Blogs (Vorschlag) | eine Domain, rund 10 bis 15 USD im Jahr (Schätzung, nicht belegt) | nicht belegt |

Die Blog-Anfragen der Mitglieder laufen über denselben Worker und zählen zu den 10 Mio. Anfragen im Monat. Der Worker legt Antworten kurz in den Cache (5 Minuten), das hält die Zahl klein.

## 3. So bauen wir es

```
Leser ──https──> blog.kunde.de ──CNAME──> blogs.<unsere-zone>  (Cloudflare)
                                              │  Custom Hostname (Zertifikat automatisch)
                                              ▼
                                   Worker m365-dub-site (sitewrk)
                                              │  Host streng prüfen, nur wenn BYOD=1
                                              ▼
                       Community-Worker  /api/byod/serve?host=…&path=…
                                              │  Host in D1 (blog_domains) und Status = active?
                                              ▼
                                  Blog des Mitglieds als fertige Seite
```

- **Eigene Zone empfohlen.** Eine kleine zusätzliche Domain (Beispiel `m365blogs.net`, Name offen), im selben Cloudflare-Konto, Tarif Free. Dort liegen `origin.<zone>` (AAAA `100::`, Proxied, als Fallback-Ursprung) und `blogs.<zone>` (CNAME auf `origin`, Proxied, das **CNAME-Ziel** für die Kunden). Grund: Die Route `*/*` für Kundendomains würde sonst in der Zone m365.fm alle anderen Unterdomains (`c.`, `partner.`, `api-dub.` …) erfassen. Mit eigener Zone ist das sauber getrennt und die Marke „m365.fm“ wird nicht an fremde Domains gebunden.
- **Zertifikat und https**: automatisch von Cloudflare. In der SaaS-Zone *Always Use HTTPS* einschalten.
- **Host-Weiche** (`sitewrk/index.js`, nur mit `BYOD=1`): Eigene Hosts (`m365.fm` und `*.m365.fm`) gehen **unverändert** den alten Weg. Jeder andere Host wird streng geprüft (Kleinbuchstaben, nur Buchstaben, Ziffern, Bindestriche und Punkte, Host-Header und Anfrage-Adresse müssen gleich sein, keine IP, kein Port) und dann beim Community-Worker erfragt. Der antwortet nur für Domains mit Status `active`, deren Mitglied ein öffentliches Profil hat und nicht gesperrt ist. Alles andere ist ein neutrales 404 ohne Weiterleitung.
- **Keine offenen Weiterleitungen**: Der Worker leitet nie auf einen Host aus der Anfrage um. Die einzige Weiterleitung ist `/slug` → `/slug/` auf derselben Domain mit geprüftem Slug.
- **Was die Domain ausliefert**: Startseite = Beitragsliste, `/<slug>/` = Beitrag, `/feed.xml`, `/sitemap.xml`, `/robots.txt`. Sonst nichts.
- **Besitz**: Eine Domain wird erst **aktiv**, wenn (1) der CNAME auf unser Ziel nachweislich gesetzt ist (DNS-Abfrage über Cloudflare DNS-über-HTTPS), (2) Cloudflare den Hostnamen und das Zertifikat als `active` meldet und (3) das Mitglied einen Impressum-Link eingetragen hat. Bis dahin bleibt es `pending` oder `verified`.
- **Status**: `pending` (eingetragen, wartet auf DNS), `verified` (CNAME gefunden), `active` (wird ausgeliefert), `blocked` (von uns gesperrt, zum Beispiel bei Missbrauch).
- **Ohne Cloudflare-Token** (`CF_API_TOKEN` und `CF_ZONE_ID` fehlen) macht der Code **keinen** Aufruf an Cloudflare. Eine Domain bleibt dann nach dem DNS-Test auf `verified`, nie `active`, ohne Fehlermeldung.
- **Aufräumen**: Findet die Prüfung den CNAME nicht, steht im Feld „Fehler“ der Text „DNS fehlt“ (kein Abbruch, das Mitglied kann es später erneut versuchen). Das Mitglied kann die Domain jederzeit entfernen. Beim Entfernen wird der Hostname bei Cloudflare gelöscht (das spart den Hostnamen-Zähler).

### Regeln für Domains (Vorschlag, im Code umgesetzt)

- Nur ganze Domainnamen mit Punkt, mindestens eine Unterdomain (`blog.kunde.de`, `www.kunde.de`). **Apex-Domains** (`kunde.de`) sind am Anfang **nicht erlaubt**, weil sie bei Cloudflare nur über Enterprise-Zusatz oder CNAME-Flattening beim Kunden gehen. Entscheidung 3.
- Nicht erlaubt: `m365.fm` und alles darunter, `m365con.net`, die SaaS-Zone selbst, `localhost`, IP-Adressen, `*.workers.dev`, `*.github.io`, `*.pages.dev`, Domains mit Punycode-Mischformen (`xn--`) vorerst, Marken-Hosts von Microsoft, Google, LinkedIn, Spreaker, YouTube und ähnlichen (Liste in `worker/src/byod_rules.js`, wird bei Bedarf erweitert).
- Höchstens **1 Domain je Mitglied** am Anfang. Jede Domain gehört genau einem Mitglied (eindeutig in der Datenbank).
- Entfernt ein Mitglied die Domain, ist sie sofort wieder frei.

## 4. SEO: Canonical und Doppelte Inhalte

Der Beitrag existiert zweimal: `https://www.m365.fm/community/u/<handle>/blog/<slug>/` und `https://<domain>/<slug>/`.

**Vorschlag (Entscheidung 1):** Die **eigene Domain ist die Haupt-Adresse** (`rel=canonical` zeigt auf die eigene Domain, auch auf der Domain-Seite selbst). Die m365.fm-Seite bekommt dann ebenfalls ein Canonical auf die eigene Domain. Das ist das Medium-Prinzip und der Grund, weshalb Mitglieder überhaupt eine Domain einrichten.

**Warum nicht gleich so im Code?** Die m365.fm-Seiten baut der Seitenbau (Python), nicht der Worker. Dort muss die Domain erst bekannt sein. Das ist ein eigener, späterer Schritt.

**Im Code gilt heute ein Schalter** `BYOD_CANONICAL`:
- `platform` (Standard): Die Domain-Seite zeigt per Canonical auf die m365.fm-Seite. Sie ist dann eine Spiegelung und kein Duplikat. Sicher, solange Mirko nicht entschieden hat.
- `own`: Canonical auf die eigene Domain.

**Regel „erst ab 10 Upvotes in Google und Sitemap“** (`INDEX_VOTES`, 10): gilt **weiter, auch auf der eigenen Domain**. Beitrag unter 10 Upvotes: `noindex,follow` und nicht in der `sitemap.xml`. Ab 10: indexierbar und in der Sitemap. Gründe: (1) Qualitätsschwelle, sonst wird die Domain-Funktion zum Gratis-Hoster für Spam und Linkfarmen, und die Spam-Wirkung träfe die Marke m365.fm. (2) Gleiche Regel an beiden Adressen vermeidet, dass die Domain-Kopie indexiert wird, die m365.fm-Seite aber nicht. (3) Die Startseite der Domain ist ebenfalls `noindex`, solange kein Beitrag die Schwelle erreicht hat. Schalter `BYOD_INDEX_VOTES` für eine eigene Schwelle (Entscheidung 2).

Weitere SEO-Punkte: eigene `sitemap.xml` und `robots.txt` je Domain (Sitemap-Verweis auf die eigene Domain), RSS mit eigener Adresse, `BlogPosting`-Daten mit Autor und `isPartOf`.

## 5. Recht für Betreiber (deutsches Recht)

Der Autor betreibt seinen Blog selbst, M365.FM hostet nur. Deshalb zeigt jede Seite im Fuß:

- **Impressum** und **Datenschutz** des Autors. Das Mitglied trägt die Links (https) selbst ein. Ohne Impressum-Link wird die Domain **nicht aktiv**. Der Datenschutz-Link ist freiwillig, Fallback ist die Datenschutzerklärung von m365.fm.
- „**Gehostet auf m365.fm**“ mit Link zu m365.fm samt dessen Impressum und Datenschutz.
- **Bezahlte Inhalte**: Anzeigen sind als „Anzeige“ beschriftet, bezahlte Links tragen `rel="sponsored noopener"`. Links im Beitragstext sind Nutzerinhalt: `rel="nofollow ugc noopener"`.
- **Keine Cookies, kein Tracking**: Die Seiten setzen keine Cookies, laden kein JavaScript, keine Schriften und keine Bilder von Fremden. Content-Security-Policy erlaubt nur eigene Bilder (`img.m365.fm`). Darum kein Einwilligungsbanner nötig. Das gilt, solange dies so bleibt.
- Bilder im Beitragstext: nur von `img.m365.fm` (R2-Regel des Projekts). Bilder von fremden Hosts werden als Alt-Text gezeigt. Entscheidung 4.

Hinweis: Das ist keine Rechtsberatung. Bitte Impressums- und Datenschutz-Texte der Plattform einmal prüfen lassen, ob die Rollen (Autor verantwortlich, M365.FM Hoster) dort stimmen. Entscheidung 6.

## 6. Einnahmen (nur vorbereitet)

Mirkos Vorgabe vom 11.11.2026: **70 % an den Autor, 30 % an M365.FM nur für Einnahmen aus Banner-Werbung** (Werbeplätze auf den Seiten des Blogs). **Sponsoring** (Pakete, Sponsoren-Beiträge, Themen- und Entitäts-Sponsoring) bleibt bei M365.FM.

- Tabelle `blog_revenue` hält je Zeile **Art** (`banner_ad` oder `sponsoring`), Zeitraum, Betrag in Cent, Währung, Beteiligung des Autors in Basispunkten, Beteiligung der Plattform, Herkunft, Status (`open`, `reviewed`, `void`). Es gibt **keine** Auszahlungstabelle und keinen Auszahlungscode.
- Rechenregel `splitRevenue(kind, cents)` in `worker/src/byod_revenue.js`: `banner_ad` 70/30, `sponsoring` 0/100. Der Rest bei Rundung bleibt bei der Plattform. Getestet.
- Offen (Entscheidung 5): Auszahlungsschwelle, Zahlungsweg, Steuer (Umsatzsteuer, Gutschriftsverfahren oder Rechnung des Autors, Kleinunternehmer, Ausland), Nachweis der Werbeeinnahmen je Domain (Zuordnung nach Aufrufen auf der Domain), Frist für Einspruch.

## 7. Blog-Import

Mitglieder geben die Feed-Adresse (RSS oder Atom) ihrer bisherigen Seite ein. Der Import legt **Entwürfe** an. Er veröffentlicht nie von selbst. Regeln: Quelle wird als Link angegeben, Bilder werden nicht kopiert (nur Hinweis), der Text wird nur mit der Bestätigung „Ich habe die Rechte an diesen Texten“ übernommen, sonst nur Titel, Kurzfassung und Link. Siehe PR „Blog-Import“.

## 8. Entscheidungen, die Mirko treffen muss

1. **Canonical**: eigene Domain als Haupt-Adresse (Vorschlag) oder m365.fm. Der Schalter im Code steht auf `platform`.
2. **Index-Schwelle** auf der eigenen Domain: 10 Upvotes wie bisher (Vorschlag) oder niedriger.
3. **Apex-Domains** (`kunde.de`): am Anfang verbieten (Vorschlag) oder erlauben und das Mitglied auf CNAME-Flattening hinweisen.
4. **Bilder** im Beitrag: nur `img.m365.fm` (Vorschlag, mit Datenschutz-Vorteil) oder auch fremde https-Bilder.
5. **Auszahlung**: 70/30 nur für Banner-Werbung, Schwelle, Zahlungsweg, Steuern. Sponsoring bleibt bei M365.FM.
6. **Recht**: Texte für Impressum und Datenschutz der Plattform durch eine Fachperson prüfen lassen.
7. **Eigene Zone** für die Blog-Domains (Vorschlag, kostet eine Domain) oder die vorhandene Zone `m365.fm` nutzen (Route je Kundendomain nötig, mehr Aufwand und Risiko).
8. **Tarif**: Pro und Workers Paid genügen bis 100 Domains ohne Aufpreis. Ab dann 0,10 USD je Domain. Budget-Grenze festlegen (zum Beispiel höchstens 100 Domains in der ersten Phase).
9. **Domain-Limit** je Mitglied (am Anfang 1) und wer eine Domain bekommen darf (alle mit öffentlichem Profil oder nur Pro).
10. **Podcast auf eigener Domain** kommt später, hier nicht gebaut.

## 9. Manuelle Schritte für Mirko (wenn er es einschalten will)

Nichts davon wurde gemacht. Reihenfolge:

1. Zone anlegen (Entscheidung 7): <https://dash.cloudflare.com/?to=/:account/add-site>, Tarif Free.
2. In dieser Zone: DNS-Eintrag `origin` Typ AAAA, Inhalt `100::`, **Proxied**. Dann `blogs` Typ CNAME auf `origin.<zone>`, **Proxied**.
3. Cloudflare for SaaS einschalten und Fallback-Ursprung festlegen: im Dashboard der neuen Zone **SSL/TLS → Custom Hostnames** (<https://dash.cloudflare.com/?to=/:account/:zone/ssl-tls/custom-hostnames>). Fallback `origin.<zone>`, warten bis „Active“.
4. In der Zone **Worker-Route** `*/*` auf den Worker `m365-dub-site` (Dashboard der Zone → Workers Routes, <https://dash.cloudflare.com/?to=/:account/:zone/workers/routes>) oder in `sitewrk/wrangler.toml` eintragen.
5. SSL/TLS der neuen Zone: Modus **Full (strict)**, *Always Use HTTPS* an.
6. API-Token anlegen: <https://dash.cloudflare.com/profile/api-tokens>. Nur diese Zone, Rechte *SSL and Certificates: Edit* (siehe „nicht belegt“). Die Zone-ID steht rechts unten auf der Übersicht der Zone.
7. Worker-Secrets setzen (nie im Chat oder Code): **Workers & Pages → m365-dub-community → Settings → Variables and Secrets** (<https://dash.cloudflare.com/?to=/:account/workers/services/view/m365-dub-community/production/settings>): `CF_API_TOKEN`, `CF_ZONE_ID`. Der Name des CNAME-Ziels kommt als normale Variable `BYOD_CNAME_TARGET` (zum Beispiel `blogs.m365blogs.net`) in `worker/wrangler.toml`.
8. In `worker/wrangler.toml` und `sitewrk/wrangler.toml` den Schalter `BYOD = "1"` setzen und mergen. Zurück: `"0"`.
9. Mit einer eigenen Test-Domain durchspielen (Domain eintragen, CNAME setzen, „Jetzt prüfen“).

## 10. Stand der Umsetzung

Drei Pull Requests, jeder für sich testbar (alles hinter `BYOD`, aus):

1. **Teil 1** (PR #361): diese Doku, Datenmodell (Migration 0048), Namensregeln, Host-Weiche im Site-Worker, Auslieferung der Blog-Seiten, Erlös-Regel.
2. **Teil 2**: Verwaltung der Domain (API `/api/byod/*`, Prüfung des DNS-Eintrags, Cloudflare-Anbindung als Code gegen die Custom-Hostnames-API, regelmäßige Prüfung im 30-Minuten-Lauf), Oberfläche im Community-Bereich (`assets/blogdomain.js`, en/de, weitere Sprachen über den Worker) und MCP-Werkzeuge (`list_my_blog_domains`, `add_blog_domain`, `check_blog_domain`, `set_blog_domain_links`, `remove_blog_domain`).
3. **Teil 3**: Blog-Import per Feed.

Nicht prüfbar ohne Cloudflare-Zugang: echter Deploy, DNS, Zertifikat, Worker-Route, Custom-Hostnames-API. Im Test ist Cloudflare nur gemockt, es gibt keinen echten Aufruf.

### Wie die Prüfung entscheidet (Teil 2)

1. DNS (über Cloudflare DNS-über-HTTPS): CNAME der Domain zeigt auf `BYOD_CNAME_TARGET`, oder der TXT-Eintrag `_m365fm-verify.<domain>` trägt das Prüf-Token. Eindeutig nichts gefunden: `pending` (eine schon aktive Domain wird dabei abgeschaltet). Netzfehler: nichts ändern, Fehler `dns_unavailable`.
2. Mit `CF_API_TOKEN` und `CF_ZONE_ID`: Custom Hostname anlegen (Zertifikat per HTTP-Prüfung) und abfragen. Erst wenn `status` und `ssl.status` beide `active` sind, geht es weiter. Ohne die Secrets: `verified`, nie `active`, kein Aufruf.
3. Impressum-Link vorhanden: erst dann `active`. Fehlt er: `verified` mit `need_imprint`.
4. Das Mitglied kann Impressum und Datenschutz jederzeit ändern. Ohne Impressum schaltet die Domain sofort ab.
5. Admin kann Domains sperren (`blocked`). Gesperrte Domains werden nie ausgeliefert, nicht neu geprüft und bleiben vergeben.
