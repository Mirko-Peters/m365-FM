"""T37 Sponsor-Seite: /sponsor/ (en, kanonisch) und /<lang>/sponsor/ fuer alle 14 weiteren Sprachen, ein hreflang-Cluster (x-default = en),
indexierbar und in der Sitemap (wie die Barrierefreiheitserklaerung).

- Preise und Regeln nur aus data/sponsor_pricing.json, Texte aus data/sponsor_i18n.json (Rueckfall je Schluessel auf en).
- Rechnen und Texte bauen: assets/sponsor-calc.js (dieselben Funktionen im Browser, im Test und hier beim Vorab-Rendern ueber
  tools/sponsor_ssr.mjs). Ohne Node rendert das Skript das Standardpaket beim Laden (Hinweis im Baulog).
- Bedienung: assets/sponsor.js (Ereignis-Delegation, ein Rendern je Frame, kein erzwungenes Layout).
- Belegzahlen: data/stats/ai_performance.json (bing_ai, google_ai, gsc) und data/stats/topic_difficulty.json; fehlen die Dateien, gelten die
  eingebauten Startwerte (gleiche Felder wie design.md D4). Folgen der Hauptshow und Sprach-Shows zaehlt der Seitenbau.
- Haengt nicht von generate_site ab: alle Helfer (page, header, footer, write, ...) kommen ueber den ctx-Dict."""
import hashlib, html, json, math, re, subprocess
from pathlib import Path
from urllib.parse import urlsplit
from site_i18n import T

ROOT = Path(__file__).parent
D = ROOT / "data"
MAIL = "mirko.peters@m365.fm"
LANGS_ALL = ("en", "de", "es", "fr", "it", "pt", "nl", "pl", "id", "ru", "uk", "ar", "he", "ja", "ko")   # = ["en"] + LANGS in generate_site
E = lambda s: html.escape("" if s is None else str(s), quote=True)


def _json(p, default):
    try:
        return json.loads(Path(p).read_text("utf-8"))
    except Exception:
        return default


PRICING = {k: v for k, v in _json(D / "sponsor_pricing.json", {}).items() if not k.startswith("_")}
I18N = {k: v for k, v in _json(D / "sponsor_i18n.json", {}).items() if not k.startswith("_")}
EN = I18N.get("en", {})

# Schnellauswahl = die 13 Themen des Prototyps: (id, Entitaet auf m365.fm oder None, Prototyp-Bezeichnung, Textschluessel, vorausgewaehlt).
# Mit Entitaet zeigt die Seite deren Namen und verlinkt sie; sonst die (uebersetzbare) Bezeichnung als einfaches Thema.
QUICK = (
    ("your-brand", None, "Your brand name", "topic_your_brand", True),
    ("teams-phone", "teams-phone", "Microsoft Teams Phone", None, True),
    ("teams-rooms", "teams-rooms", "Teams Rooms", None, False),
    ("azure-virtual-desktop", "azure-virtual-desktop", "Azure Virtual Desktop", None, False),
    ("windows-365", "windows-365", "Windows 365", None, False),
    ("purview", "purview", "Microsoft Purview", None, False),
    ("entra-id", "entra-id", "Microsoft Entra ID", None, False),
    ("copilot-studio", "copilot-studio", "Copilot Studio", None, False),
    ("copilot", "copilot", "Microsoft 365 Copilot", None, False),
    ("m365-backup", None, "Microsoft 365 Backup", None, False),
    ("sharepoint-permissions", None, "SharePoint permissions", "topic_sp_permissions", False),
    ("power-bi-governance", None, "Power BI governance", "topic_pbi_governance", False),
    ("defender-xdr", None, "Defender XDR", None, False),
)

# Eingebaute Startwerte = Felder aus design.md D4 (Mirkos Export aus dem Prototyp), falls data/stats/*.json noch fehlt
DEFAULT_AI = {"version": 1, "bing_ai": {
    "status": "ok", "source": "Bing Webmaster Tools, AI Performance (Microsoft Copilot and partners)", "period": {"from": "2026-08-01", "to": "2026-10-30"},
    "retrieved": "2026-11-01", "entered": "manual", "citations": 1100000, "cited_pages_per_day": 622,
    "weekly": [["2026-08-03", 62300], ["2026-08-10", 65400], ["2026-08-17", 61100], ["2026-08-24", 85800], ["2026-08-31", 89100], ["2026-09-07", 85800],
               ["2026-09-14", 96800], ["2026-09-21", 97500], ["2026-09-28", 97200], ["2026-10-05", 84800], ["2026-10-12", 89100], ["2026-10-19", 87200]]},
    "gsc": {"status": "missing_secret"}}
DEFAULT_DIFF = {"example": True, "updated": "2026-11-01", "levels": {
    "Your brand name": 1, "Microsoft Teams Phone": 3, "Teams Rooms": 2, "Azure Virtual Desktop": 3, "Windows 365": 3, "Microsoft Purview": 3, "Microsoft Entra ID": 4,
    "Copilot Studio": 3, "Microsoft 365 Copilot": 4, "Microsoft 365 Backup": 2, "SharePoint permissions": 2, "Power BI governance": 2, "Defender XDR": 3}}

# Themensuche: kuratierte Entitaeten (Typen product, platform, cert, concept, category; nicht veraltet/ersetzt). Produkte und Plattformen
# nur von Microsoft: Doku/Website auf einem Microsoft-Host oder Name/Beschreibung einer Microsoft-Produktfamilie; ausdruecklich ohne
# Marken anderer Anbieter (design.md D2: keine anderen Marken auf der Seite). Begriffe, Zertifikate und Kategorien sind herstellerneutral.
TYPES = ("product", "platform", "cert", "concept", "category")
MS_HOSTS = ("microsoft.com", "office.com", "azure.com", "github.com", "github.io")   # GitHub gehoert zu Microsoft (GitHub Copilot, PnP)
MS_NAME = re.compile(r"^(Microsoft|Azure|Dynamics 365|Power |Viva|Teams|SharePoint|Copilot|Fabric|Windows|Entra|Defender|Intune|Visual Studio|GitHub|Active Directory|Exchange|Outlook|OneDrive|OneNote|Bicep|Dataverse|Foundry)\b")
MS_DESC = re.compile(r"\b(Microsoft|Azure|Dynamics 365|Microsoft Fabric)\b")
OTHER_VENDOR = re.compile(r"\b(OpenAI|HashiCorp|Google|Amazon|AWS|Salesforce|Anthropic|Meta|Figma|Atlassian|Slack|Zoom|SAP|Oracle|IBM)\b")
DENY = {"chatgpt", "gpt-5", "figma", "terraform", "rayfin"}   # Fremdmarken (rayfin: Werkzeug eines Drittanbieters, nur Session-Thema)


def url(base, lang):
    return f"{base}/sponsor/" if lang == "en" or lang not in LANGS_ALL else f"{base}/{lang}/sponsor/"


def mediakit_url(base, lang):
    """Mediadaten-Seite: nur EN und DE (site_mediakit.py), andere Sprachen auf EN."""
    return f"{base}/de/media-kit/" if lang == "de" else f"{base}/media-kit/"


def dashboard_url(base, lang):
    return f"{base}/sponsor/dashboard/" if lang == "en" else f"{base}/{lang}/sponsor/dashboard/"


def dashboard_view_url(base, lang, view):
    root = dashboard_url(base, lang)
    return root if view == "overview" else root + view + "/"


def tx(lang, key, **kw):
    """Text der Sprache, sonst Englisch (je Schluessel); {platzhalter} aus kw."""
    s = I18N.get(lang, {}).get(key)
    if s is None: s = EN.get(key, key)
    return re.sub(r"\{([a-z_]+)\}", lambda m: str(kw[m.group(1)]) if m.group(1) in kw else m.group(0), s)


def dashboard_copy(lang):
    texts = {
        "intro": ("A source-backed view of your sponsorship placements and results.",
                  "Quellenbasierte Übersicht deiner Sponsorings und Ergebnisse."),
        "dash_kicker": ("Sponsor dashboard", "Sponsor-Dashboard"),
        "achievement_title": ("What your sponsorship achieved", "Was dein Sponsoring erreicht hat"),
        "login": ("Sign in with a community account linked to a company to view its sponsorships.",
                  "Melde dich mit einem Community-Konto an, das einer Firma zugeordnet ist, um deren Sponsorings zu sehen."),
        "signin": ("Sign in", "Anmelden"),
        "no_placements": ("No placements for this period.", "Keine Platzierungen für diesen Zeitraum."),
        "scope": ("Only aggregate figures are shown. No individual listener or visitor data is shared.",
                  "Es werden nur zusammengefasste Zahlen angezeigt. Daten einzelner Hörer oder Besucher werden nicht geteilt."),
        "status": ("Status", "Status"),
        "period": ("Period", "Zeitraum"),
        "attendees": ("Event participants", "Event-Teilnehmer"),
        "unavailable": ("No data", "Keine Daten"),
        "csv": ("Export CSV", "CSV exportieren"),
        "pdf": ("Print / save PDF", "Drucken / als PDF speichern"),
        "error": ("Could not send the request. Please try again.", "Anfrage konnte nicht gesendet werden. Bitte versuche es erneut."),
        "pending": ("Pending", "Offen"),
        "confirmed": ("Confirmed", "Bestätigt"),
        "event_partner": ("Event partner", "Event-Partner"),
        "company": ("Company", "Firma"),
        "type": ("Type", "Art"),
        "placement": ("Placement", "Platzierung"),
        "podcast": ("Podcast mention", "Podcast-Erwähnung"),
        "page_banner": ("Page sponsorship", "Seitensponsoring"),
        "article": ("Sponsored article", "Gesponserter Artikel"),
        "impressions": ("Impressions", "Impressions"),
        "clicks": ("Clicks", "Klicks"),
        "downloads": ("Episode downloads", "Folgen-Downloads"),
        "ended": ("Ended", "Beendet"),
        "dashboard": ("Overview", "Übersicht"),
        "placement_view": ("Placement detail", "Platzierungsdetails"),
        "report_view": ("Monthly report", "Monatsbericht"),
        "sources_view": ("Data sources", "Datenquellen"),
        "period_30": ("Last 30 days", "Letzte 30 Tage"),
        "period_campaign": ("This campaign", "Diese Kampagne"),
        "period_year": ("This year", "Dieses Jahr"),
        "active": ("Active", "Aktiv"),
        "upcoming": ("Upcoming", "Demnächst"),
        "planned": ("Planned", "Geplant"),
        "key_figures": ("Key figures", "Kennzahlen"),
        "reach_week": ("Reach per week", "Reichweite pro Woche"),
        "weekly_no_data": ("No weekly reach data is available.", "Keine wöchentlichen Reichweitendaten verfügbar."),
        "placements": ("Your placements", "Deine Platzierungen"),
        "channel": ("Channel", "Kanal"),
        "languages": ("Languages", "Sprachen"),
        "key_figure": ("Key figure", "Kennzahl"),
        "how_count": ("How we count", "So zählen wir"),
        "measured": ("Measured", "Gemessen"),
        "estimated": ("Estimated", "Geschätzt"),
        "manual": ("Manual", "Manuell"),
        "measured_desc": ("Counted by the platform.", "Von der Plattform gezählt."),
        "estimated_desc": ("Calculated; the method is stated in the report.", "Berechnet; die Methode steht im Bericht."),
        "manual_desc": ("Entered by an administrator from an export.", "Von einem Administrator aus einem Export eingetragen."),
        "as_of": ("As of", "Stand"),
        "no_date": ("No data date", "Kein Datenstand"),
        "source": ("Source", "Quelle"),
        "type": ("Type", "Art"),
        "people_reached": ("People reached", "Erreichte Personen"),
        "podcast_plays": ("Podcast plays", "Podcast-Aufrufe"),
        "video_views": ("Video views", "Video-Aufrufe"),
        "page_views": ("Sponsored page views", "Aufrufe gesponserter Seiten"),
        "link_clicks": ("Clicks to your website", "Klicks zu deiner Website"),
        "project_requests": ("Project requests", "Projektanfragen"),
        "ai_citations": ("AI citations", "KI-Zitate"),
        "languages_viewed": ("Languages with views", "Sprachen mit Aufrufen"),
        "episodes_with_mention": ("Episodes with a mention", "Folgen mit Erwähnung"),
        "method_follows": ("Method to be confirmed", "Methode folgt"),
        "highlight": ("Highlight", "Highlight"),
        "rules": ("Rules", "Regeln"),
        "rule_aggregate": ("Only aggregate counts, never individual listener or visitor data.", "Nur zusammengefasste Zahlen, niemals Daten einzelner Hörer oder Besucher."),
        "rule_clicks": ("Clicks are counted without cookies; the same device counts once per day.", "Klicks zählen wir ohne Cookies; dasselbe Gerät zählt pro Tag einmal."),
        "rule_leads": ("Leads are shared only with consent.", "Leads geben wir nur mit Einwilligung weiter."),
        "rule_source": ("Every figure shows its source and latest update.", "Jede Kennzahl zeigt Quelle und letzten Datenstand."),
        "search_impressions": ("Search impressions", "Such-Impressionen"),
        "ads_title": ("Booked ad placements", "Gebuchte Werbeplätze"),
        "ads_impressions": ("Impressions", "Einblendungen"),
        "ads_ctr": ("Click rate", "Klickrate"),
        "ads_leads": ("Leads", "Leads"),
        "ads_volume": ("Used / booked", "Verbraucht / gebucht"),
        "ads_note": ("Counted on M365.FM without cookies; bots are filtered out. Leads are listed on the ad placements page.", "Auf M365.FM ohne Cookies gezählt; Bots werden herausgefiltert. Leads stehen auf der Seite Werbeplätze."),
        "detail_intro": ("Placement performance and source data", "Leistung und Quelldaten der Platzierung"),
        "podcast_tab": ("Podcast", "Podcast"),
        "video_tab": ("Video", "Video"),
        "website_tab": ("Website", "Website"),
        "search_ai_tab": ("Search & AI", "Suche & KI"),
        "report_title": ("Monthly sponsorship report", "Monatsbericht Sponsoring"),
        "report_sentence": ("Your month in one sentence", "Dein Monat in einem Satz"),
        "month": ("Month", "Monat"),
        "highlights": ("Highlights", "Höhepunkte"),
        "next_month": ("Next month", "Nächster Monat"),
        "print_report": ("Print / save as PDF", "Drucken / als PDF speichern"),
        "sponsored_label": ("Sponsored content is labelled. No individual listener data is shared.",
                            "Gesponserte Inhalte sind gekennzeichnet. Es werden keine Daten einzelner Hörer geteilt."),
        "privacy_note": ("No individual listener data is shared. Leads are shown only with consent.",
                         "Es werden keine Daten einzelner Hörer geteilt. Leads zeigen wir nur mit Einwilligung."),
        "source_note": ("Source and measurement type are shown with every value; missing values are not estimated.",
                        "Quelle und Messart stehen bei jedem Wert; fehlende Werte werden nicht geschätzt."),
        "admin_only": ("This view is only available to administrators.", "Diese Ansicht ist nur für Administratoren verfügbar."),
        "source_status": ("Source status", "Status der Datenquellen"),
        "figures": ("Figures", "Kennzahlen"),
        "method": ("How", "Methode"),
        "frequency": ("Frequency", "Takt"),
        "ready": ("Ready", "Bereit"),
        "setup": ("Setup needed", "Einrichtung nötig"),
        "build": ("To build", "Noch zu bauen"),
        "source_manual": ("Manual entry", "Manuelle Eingabe"),
        "later": ("Later", "Später"),
        "enter_manual": ("Enter monthly figures", "Monatswerte eintragen"),
        "manual_help": ("Enter only values from an export and provide the R2 evidence key. The value is labelled Manual.",
                        "Trage nur Exportwerte ein und gib den R2-Belegschlüssel an. Der Wert wird als manuell gekennzeichnet."),
        "company": ("Company", "Firma"),
        "source_select": ("Source", "Quelle"),
        "placement_name": ("Placement or issue", "Platzierung oder Ausgabe"),
        "metric": ("Figure", "Kennzahl"),
        "value": ("Value", "Wert"),
        "link": ("Public report link", "Link zum öffentlichen Bericht"),
        "proof": ("R2 evidence key", "R2-Belegschlüssel"),
        "save": ("Save value", "Wert speichern"),
        "saved": ("Saved · visible to the sponsor", "Gespeichert · für den Sponsor sichtbar"),
        "invalid": ("Please check the fields and try again.", "Bitte prüfe die Eingaben und versuche es erneut."),
        "source_bing": ("Bing AI Performance", "Bing AI Performance"),
        "source_no_data": ("No data", "Keine Daten"),
        "source_press": ("Press Ranger", "Press Ranger"),
        "source_spreaker": ("Spreaker", "Spreaker"),
        "source_youtube": ("YouTube Analytics", "YouTube Analytics"),
        "source_cloudflare": ("Cloudflare analytics", "Cloudflare Analytics"),
        "source_counter": ("M365.FM link counter", "M365.FM-Linkzähler"),
        "source_gsc": ("Google Search Console", "Google Search Console"),
        "source_bing_webmaster": ("Bing Webmaster Tools", "Bing Webmaster Tools"),
        "source_events": ("Event registrations", "Event-Anmeldungen"),
        "source_directory": ("Sponsor profile requests", "Anfragen über das Sponsorprofil"),
        "source_app": ("News app", "News-App"),
        "source_reach": ("Cross-channel estimate", "Kanalübergreifende Schätzung"),
        "source_desc_spreaker": ("Plays per sponsored episode; no per-listener data.", "Aufrufe gesponserter Folgen; keine Daten einzelner Hörer."),
        "source_desc_youtube": ("Views and watch time, after Analytics access is enabled.", "Aufrufe und Wiedergabezeit nach Freigabe des Analytics-Zugriffs."),
        "source_desc_cloudflare": ("Page views by URL; no cookies or client-side tracking.", "Seitenaufrufe je URL; keine Cookies und kein Client-Tracking."),
        "source_desc_counter": ("Cookie-free daily totals by link and page surface.", "Cookiefreie Tagessummen je Link und Fläche."),
        "source_desc_gsc": ("Impressions and clicks for sponsored URLs.", "Impressions und Klicks für gesponserte URLs."),
        "source_desc_bing_webmaster": ("Page statistics for sponsored URLs.", "Seitenstatistik für gesponserte URLs."),
        "source_desc_bing": ("Monthly export entered by an administrator.", "Monatlicher Export, von einem Administrator eingetragen."),
        "source_desc_press": ("Placement-specific distribution and AI visibility reports.", "Platzierungsbezogene Verteilungs- und KI-Sichtbarkeitsberichte."),
        "source_desc_events": ("Registered attendees from event records.", "Registrierte Teilnehmer aus Event-Datensätzen."),
        "source_desc_directory": ("Consent-based requests; source is not connected yet.", "Anfragen mit Einwilligung; Quelle noch nicht angebunden."),
        "source_desc_app": ("App events are planned for a later version.", "App-Ereignisse sind für eine spätere Version geplant."),
        "source_desc_reach": ("Planned estimate from channel totals with estimated overlap removed; not calculated yet.",
                              "Geplante Schätzung aus Kanalwerten abzüglich geschätzter Überschneidungen; noch nicht berechnet."),
        "daily": ("Daily", "Täglich"),
        "monthly": ("Monthly", "Monatlich"),
        "live": ("Live", "Live"),
        "weekly": ("Weekly", "Wöchentlich"),
        "not_connected": ("Not connected", "Noch nicht verbunden"),
        "no_orgs": ("No sponsored company accounts are linked to your profile.",
                    "Deinem Profil sind keine gesponserten Firmenkonten zugeordnet."),
        "company_total": ("Company total", "Firma gesamt"),
        "breadcrumbs": ("Breadcrumb", "Brotkrumen"),
        "video_watch_minutes": ("Watch time (minutes)", "Wiedergabezeit (Minuten)"),
        "video_retention": ("Retention at the mention", "Wiedergabe bis zur Erwähnung"),
        "ai_visibility": ("Brand visibility in AI answers", "Markensichtbarkeit in KI-Antworten"),
        "views": ("Views", "Aufrufe"),
        "refs": ("References (JSON)", "Referenzen (JSON)"),
        "placement_id": ("Placement ID", "Platzierungs-ID"),
        "assign_placement": ("Assign a company placement", "Platzierung einer Firma zuordnen"),
        "placement_help": ("Map a placement to one company; refs may contain video_ids, mention_sec, press_release and page_paths.",
                           "Ordne eine Platzierung genau einer Firma zu; refs können video_ids, mention_sec, press_release und page_paths enthalten."),
        "start": ("Start", "Beginn"),
        "end": ("End", "Ende"),
        "ai_citations": ("AI citations", "KI-Zitate"),
    }
    return {**{k: T(lang, en, de) for k, (en, de) in texts.items()}, "title": tx(lang, "dash_h")}


DASHBOARD_CSS = """:root{--sdb-measured:#2f6b3a;--sdb-estimated:var(--ac);--sdb-manual:#9a4f0f}
@media(prefers-color-scheme:dark){:root{--sdb-measured:#91d59a;--sdb-manual:#ffc078}}
:root[data-theme=dark]{--sdb-measured:#91d59a;--sdb-manual:#ffc078}
.sdb-main{display:grid;gap:1.5em}.sdb-org>.cols{display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr))}
.sdb-nav,.sdb-actions,.sdb-periods,.sdb-tabs{display:flex;flex-wrap:wrap;gap:.6em;margin:1em 0}
.sdb-card,.sdb-org,.sdb-placement,.sdb-panel{border:1px solid var(--bd);background:var(--card);padding:1em;margin:.5em 0}
.sdb-card{display:grid;gap:.4em}.sdb-card strong{font:600 1.8rem/1.1 \"Barlow Condensed\",sans-serif}
.sdb-card h3,.sdb-org h2,.sdb-placement h3{margin:.1em 0 .4em}
.sdb-meta,.sdb-source{display:flex;flex-wrap:wrap;gap:.5em 1.5em;color:var(--mut)}
.sdb-badge{display:inline-block;border:1px solid var(--bd);padding:.05em .5em;font:600 .8rem \"Barlow Condensed\",sans-serif;text-transform:uppercase}
.sdb-kind-measured{color:var(--sdb-measured)}.sdb-kind-estimated{color:var(--sdb-estimated)}.sdb-kind-manual{color:var(--sdb-manual)}
.sdb-status-ready{color:var(--sdb-measured);border-color:var(--sdb-measured)}.sdb-status-setup{color:var(--sdb-manual);border-color:var(--sdb-manual)}
.sdb-status-build{color:var(--ac);border-color:var(--ac)}.sdb-status-source_manual{color:var(--sdb-manual);border-style:dashed}
.sdb-status-later{color:var(--mut);background:var(--bd)}
.sdb-table{overflow-x:auto}.sdb-table table{min-width:800px;width:100%;border-collapse:collapse}.sdb-table th,.sdb-table td{text-align:start;padding:.65em;border-bottom:1px solid var(--bd)}
.sdb-row-link{display:block;color:var(--fg);text-decoration:none}.sdb-row-link:hover{color:var(--ac)}
.sdb-status{white-space:nowrap}.sdb-source-inline{display:block;margin-top:.35em}.sdb-rule-box{background:var(--ink);color:var(--bg)}
.sdb-form{display:grid;gap:.8em;border-top:1px solid var(--bd);margin-top:1.5em;padding-top:1em}
.sdb-form label{display:grid;gap:.25em}.sdb-form input,.sdb-form select{max-width:40em;font:inherit;color:var(--fg);background:var(--bg);border:1px solid var(--bd);padding:.6em}
.sdb-status{border:1px solid var(--bd);padding:.05em .5em}
.sdb-chart{min-height:8em;display:grid;gap:.6em}.sdb-bars{height:12em;display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:.5em;align-items:end;border-bottom:1px solid var(--bd)}
.sdb-bar-group{height:100%;display:flex;flex-direction:column;justify-content:end;align-items:center;gap:1px;min-width:0}.sdb-bar-group small{font-size:.65em;color:var(--mut);overflow:hidden}
.sdb-bar{display:block;width:70%;height:var(--bar-height);min-height:2px}.sdb-bar-podcast{background:var(--ac)}.sdb-bar-video{background:var(--sdb-measured)}.sdb-bar-website{background:var(--sdb-manual)}
.sdb-lang-bars{display:grid;gap:.5em;grid-column:1/-1}.sdb-lang-row{display:grid;grid-template-columns:3em 1fr auto;gap:.75em;align-items:center}.sdb-lang-track{height:.65em;background:var(--bd)}.sdb-lang-bar{display:block;width:var(--bar-width);height:100%;background:var(--ac)}
.sdb-legend{color:var(--mut);font-size:.9em}.sdb-company{display:flex;gap:.5em;align-items:center}
.sdb-report{max-width:794px;margin:auto}.sdb-report-head{border-bottom:2px solid var(--bd);padding-bottom:1em}.sdb-report .cols{display:grid;grid-template-columns:repeat(4,minmax(0,1fr))}
@media(max-width:700px){.sdb-report .cols{grid-template-columns:repeat(2,minmax(0,1fr))}}
@page{size:A4;margin:0}
@media print{body *{visibility:hidden!important}.sdb-report,.sdb-report *{visibility:visible!important}.sdb-report{position:absolute;inset-inline-start:0;top:0;display:block!important;max-width:none;width:210mm;margin:0}.sdb-report-page{min-height:297mm;padding:14mm;box-sizing:border-box;break-after:auto}.sdb-card,.sdb-report-head,.sdb-panel{break-inside:avoid}.sdb-report-page:last-child{break-after:auto}}"""


def label(lang):
    """Fusszeilen-Link 'Become a sponsor' der Sprache (Schluessel footer_link, Rueckfall Englisch)."""
    return tx(lang if lang in LANGS_ALL else "en", "footer_link")


def fmt_usd(n):
    return "$" + f"{int(round(n)):,}"


def _pcat(lang, n):   # CLDR-Pluralkategorie fuer ganze Zahlen n >= 0 (wie Intl.PluralRules in den 15 Sprachen der Seite)
    n = int(n); m10, m100 = n % 10, n % 100
    if lang in ("ja", "ko", "id"): return "other"
    if lang in ("ru", "uk"):
        return "one" if m10 == 1 and m100 != 11 else "few" if 2 <= m10 <= 4 and not 12 <= m100 <= 14 else "many"
    if lang == "pl":
        return "one" if n == 1 else "few" if 2 <= m10 <= 4 and not 12 <= m100 <= 14 else "many"
    if lang == "ar":
        return "zero" if n == 0 else "one" if n == 1 else "two" if n == 2 else "few" if 3 <= m100 <= 10 else "many" if 11 <= m100 <= 99 else "other"
    if lang == "he": return "one" if n == 1 else "two" if n == 2 else "other"
    if lang in ("fr", "pt"): return "one" if n in (0, 1) else "many" if n and n % 1000000 == 0 else "other"
    if lang in ("es", "it"): return "one" if n == 1 else "many" if n and n % 1000000 == 0 else "other"
    return "one" if n == 1 else "other"


def _plural_en(lang, key, n, **kw):   # Rueckfall ohne Node (Laufzeit-Beschriftungen): eigene Kategorie, dann .other der Sprache, dann en
    for lg, cat in ((lang, _pcat(lang, n)), (lang, "other"), ("en", _pcat("en", n)), ("en", "other")):
        k = f"{key}.{cat}"
        if k in (I18N.get(lg, {}) if lg != "en" else EN): return tx(lg, k, n=n, **kw)
    return str(n)


def _num(v):
    return f"{int(v):,}" if float(v).is_integer() else f"{v:,.1f}"


def _nice_max(v):
    if v <= 0: return 1
    e = 10 ** math.floor(math.log10(v))
    for m in (1, 2, 2.5, 5, 10):
        if m * e >= v: return int(m * e)
    return int(10 * e)


# ---- Daten: Belegzahlen und Schwierigkeit ----
def load_stats():
    a = _json(D / "stats" / "ai_performance.json", None) or DEFAULT_AI
    src = a.get("sources") or {}
    bing, gsc = dict(a.get("bing_ai") or src.get("bing_ai") or {}), dict(a.get("gsc") or src.get("gsc") or {})
    gai = dict(a.get("google_ai") or src.get("google_ai") or {})   # Google Search Console, Generative AI (AI Overviews und AI Mode)
    for b in (bing, gsc, gai):   # auch die Variante mit "totals"/"label" lesen
        for k, v in (b.get("totals") or {}).items(): b.setdefault(k, v)
        if not b.get("source") and isinstance(b.get("label"), dict): b["source"] = b["label"].get("en", "")
    def ok(b, *need):
        p = b.get("period") or {}
        return b.get("status") == "ok" and p.get("from") and p.get("to") and all(isinstance(b.get(k), (int, float)) for k in need)
    bing["ok"] = bool(ok(bing, "citations", "cited_pages_per_day"))
    gsc["ok"] = bool(ok(gsc, "clicks"))
    gai["ok"] = bool(ok(gai, "impressions"))
    wk = [(str(d)[:10], float(v)) for d, v in (bing.get("weekly") or []) if isinstance(v, (int, float))]
    bing["weekly"] = wk if len(wk) >= 2 else []
    dd = _json(D / "stats" / "topic_difficulty.json", None) or DEFAULT_DIFF
    raw = dd.get("levels") or {}
    if raw and all(isinstance(v, str) for v in raw.values()): raw = dd.get("topics") or {}   # "levels" als Legende (1: easy ...)
    levels, ex_any = {}, bool(dd.get("example"))
    for k, v in raw.items():
        lv = v.get("level") if isinstance(v, dict) else v
        if isinstance(lv, (int, float)) and 1 <= int(lv) <= 4:
            levels[str(k).strip().lower()] = (int(lv), ex_any or bool(isinstance(v, dict) and v.get("example")))
    return {"bing": bing, "gsc": gsc, "google": gai, "levels": levels, "example": ex_any, "diff_updated": str(dd.get("updated") or "")[:10]}


def _level(levels, *keys):
    for k in keys:
        if k and str(k).strip().lower() in levels: return levels[str(k).strip().lower()]
    return None


def _ents(g):
    ents = g.get("ents")
    if not ents:
        ents = {e["id"]: e for e in _json(D / "entities.json", []) if e.get("id")}
    return ents


def ms_or_neutral(e):
    """Kuratierte Themen fuer die Suche (siehe TYPES/MS_*): Microsoft-Produkte und herstellerneutrale Begriffe."""
    if e.get("type") not in TYPES or e.get("outdated") or e.get("replaced_by") or e.get("id") in DENY: return False
    name, desc = e.get("name") or "", ((e.get("desc") or {}).get("en") or "")
    if OTHER_VENDOR.search(name) and not MS_NAME.search(name): return False
    if e["type"] in ("product", "platform"):
        hosts = [urlsplit(e.get(k) or "").netloc for k in ("docs", "web")]
        ms = any(h.endswith(MS_HOSTS) for h in hosts if h) or bool(MS_NAME.search(name)) or bool(MS_DESC.search(desc))
        return ms and not re.search(r"\bfrom (OpenAI|HashiCorp|Google|Amazon|Anthropic|Meta)\b", desc)
    return True


def topics_for(g, lang, stats):
    B, ents, lv = g["BASE"], _ents(g), stats["levels"]
    ebase = f"{B}/entity/" if lang == "en" else f"{B}/{lang}/entity/"
    quick, used = [], set()
    for qid, eid, proto, key, dflt in QUICK:
        e = ents.get(eid) if eid else None
        name = e["name"] if e else (tx(lang, key) if key else proto)
        en_name = e["name"] if e else (EN.get(key, proto) if key else proto)
        hit = _level(lv, qid, eid, proto, e and e.get("name"), en_name)
        al = [proto] + [a for a in ((e or {}).get("aliases") or []) if isinstance(a, str) and 2 < len(a) <= 60][:3]
        quick.append({"id": qid, "eid": eid if e else None, "name": name, "en": en_name, "lvl": hit[0] if hit else 0, "rated": bool(hit),
                      "example": bool(hit and hit[1]), "custom": False, "url": (ebase + eid + "/") if e else "", "default": dflt, "al": al})
        if e: used.add(eid)
    search = []
    for eid, e in sorted(ents.items(), key=lambda kv: (kv[1].get("name") or "").lower()):
        if eid in used or not ms_or_neutral(e): continue
        hit = _level(lv, eid, e.get("name"))
        al = [a for a in (e.get("aliases") or []) if isinstance(a, str) and 2 < len(a) <= 60][:3]
        search.append([eid, e["name"], hit[0] if hit else 0, bool(hit and hit[1]), al])
    return quick, search, ebase


# ---- Vorab-Rendern (Node) ----
def _ssr(payload):
    try:
        r = subprocess.run(["node", str(ROOT / "tools" / "sponsor_ssr.mjs")], input=json.dumps(payload, ensure_ascii=False), capture_output=True,
                           text=True, encoding="utf-8", timeout=90, check=True)
        return json.loads(r.stdout)
    except Exception as e:
        print("Sponsor-Seite: Vorab-Rendern nicht moeglich (" + str(e)[:160] + "); das Skript rendert das Paket beim Laden.")
        return {}


def default_state(quick):
    d = PRICING["defaults"]
    tops = [{k: q[k] for k in ("id", "name", "en", "lvl", "rated", "example", "custom", "url")} for q in quick if q["default"]]
    return {"goal": d["goal"], "rt": d["runtime"], "topics": tops, "video": False, "pr": bool(d["pr"]), "auth": False, "dash": False, "l14": False,
            "topic": False, "expert": False, "li": False, "live": False, "con": False,
            "cnt": {"pr": 1, "ex": d["cnt"]["ex"], "li": d["cnt"]["li"], "lv": d["cnt"].get("lv", 1)}, "prTouched": False}


# ---- Seite ----
CSS = """<style>
.spn{--spn-on:#9a5b00;--spn-good:#0f7a5f;--spn-red:#b3261e;--spn-soft:var(--card);--spn-fill:var(--card)}
@supports (background:color-mix(in srgb,red 10%,blue)){.spn{--spn-soft:color-mix(in srgb,var(--ac) 10%,var(--card));--spn-fill:color-mix(in srgb,var(--ac) 32%,transparent)}}
@media (prefers-color-scheme:dark){.spn{--spn-on:#ffb52e;--spn-good:#3cc9a1;--spn-red:#ff8a80}}
:root[data-theme=dark] .spn{--spn-on:#ffb52e;--spn-good:#3cc9a1;--spn-red:#ff8a80}
html.a11y-hc .spn{--spn-on:#ffb52e;--spn-good:#3cc9a1;--spn-red:#ff8a80}
.spn ::placeholder{color:var(--mut);opacity:1}
.wrap.spn-wrap{max-width:1180px}
.spn h1{font-size:clamp(2rem,4.4vw,3.3rem);line-height:1.04;margin:.25em 0 .4em;text-wrap:balance}
.spn h2{margin:0}.spn h3{margin:0}
.spn-hero{padding:24px 0 26px;border-bottom:1px solid var(--bd)}
.spn-eyebrow{display:flex;align-items:center;gap:8px;margin:0;font:600 .82rem/1.3 "Barlow Condensed","Barlow Condensed FB0","Barlow Condensed FB1",sans-serif;letter-spacing:.14em;text-transform:uppercase;color:var(--mut)}
.spn-dot{position:relative;flex:none;width:9px;height:9px;border-radius:50%;background:var(--spn-on)}
.spn-dot:after{content:"";position:absolute;inset:-4px;border-radius:50%;background:var(--spn-on);opacity:.22}
@media (prefers-reduced-motion:no-preference){.spn-dot:after{animation:spn-pulse 2.4s ease-in-out infinite;will-change:transform,opacity}}
@keyframes spn-pulse{50%{transform:scale(1.35);opacity:.08}}
.spn-lead{max-width:62ch;color:var(--mut);font-size:1.1rem;margin:0 0 20px}.spn-mk{margin:-6px 0 22px}
.spn-cards{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:12px}
.spn-card{background:var(--card);border:1px solid var(--bd);padding:14px 16px;display:grid;gap:3px;align-content:start}
.spn-card b{unicode-bidi:isolate;font:600 2rem/1.05 "Barlow Condensed","Barlow Condensed FB0","Barlow Condensed FB1",sans-serif;font-variant-numeric:tabular-nums;color:var(--ac)}
.spn-card span{color:var(--fg);font-size:.92rem;line-height:1.35}.spn-card small{color:var(--mut);font-size:.78rem}
.spn-src{margin:8px 0 0;font-size:.8rem;line-height:1.45;color:var(--mut)}
.spn-chart{margin:16px 0 0;background:var(--card);border:1px solid var(--bd);padding:14px 16px;min-width:0}
.spn-chart h2{font-size:1.05rem;letter-spacing:.06em;margin:0 0 8px}
.spn-chart svg{display:block;width:100%;height:auto;direction:ltr}
.spn-chart .spn-gl{stroke:var(--bd);stroke-width:1}.spn-chart text{fill:var(--mut);font-family:"Barlow","Barlow FB0",sans-serif}
.spn-chart .spn-cm{display:none}@media (max-width:700px){.spn-chart .spn-cd{display:none}.spn-chart .spn-cm{display:block}}
.spn-chart .spn-area{fill:var(--ac);fill-opacity:.14}.spn-chart .spn-line{fill:none;stroke:var(--ac);stroke-width:2.5;stroke-linejoin:round}.spn-chart .spn-last{fill:var(--spn-on)}
.spn-nojs{border:1px solid var(--ac);padding:12px 14px;margin:20px 0 0}
.spn-grid{display:grid;grid-template-columns:minmax(0,1fr) 380px;column-gap:32px;align-items:start}
.spn-build,.spn-req,.spn-faq{grid-column:1;min-width:0}
.spn-console{grid-column:2;grid-row:1/span 3;margin:24px 0;background:var(--card);border:1px solid var(--bd);padding:20px;display:grid;gap:16px}
@media (min-width:921px) and (min-height:560px){.spn-console{position:sticky;top:52px;max-height:calc(100vh - 68px);overflow:auto}}
@media (max-width:920px){.spn-grid{grid-template-columns:minmax(0,1fr)}.spn-console{grid-column:1;grid-row:auto}}
.spn-step{padding:24px 0;border-bottom:1px solid var(--bd);display:grid;gap:14px;contain:layout style}
.spn-hero,.spn-req,.spn-faq,.spn-console{contain:layout style}
.spn-faq{content-visibility:auto;contain-intrinsic-size:auto 520px}
.spn-sh{display:flex;align-items:baseline;gap:12px;flex-wrap:wrap}.spn-sh h2{font-size:1.5rem;line-height:1.15}
.spn-n{font:600 .85rem "Barlow Condensed","Barlow Condensed FB0",sans-serif;letter-spacing:.12em;text-transform:uppercase;color:var(--ac)}
.spn-hint{margin:0;color:var(--mut);font-size:.95rem;max-width:65ch}
.spn-seg{display:flex;flex-wrap:wrap;gap:8px}
.spn-opt{position:relative;display:block}
.spn-opt input{position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:pointer}
.spn-opt>span{display:flex;flex-direction:column;gap:2px;min-width:120px;padding:10px 14px;border:1px solid var(--bd);background:var(--card);line-height:1.3}
.spn-opt b{font-weight:600}.spn-opt small{color:var(--mut);font-size:.82rem}
.spn-opt input:checked+span{border-color:var(--ac);box-shadow:inset 0 0 0 1px var(--ac);background:var(--spn-soft)}
.spn-opt input:focus-visible+span{outline:3px solid var(--ac);outline-offset:2px}
.spn-chips{display:flex;flex-wrap:wrap;gap:8px}
.spn-chip{display:inline-flex;align-items:center;flex-wrap:wrap;gap:6px 8px;padding:7px 12px;border:1px solid var(--bd);background:var(--card);color:var(--fg);font:inherit;font-size:.93rem;line-height:1.3;cursor:pointer;text-align:start}
.spn-chip[aria-pressed=true]{border-color:var(--ac);background:var(--spn-soft);box-shadow:inset 0 0 0 1px var(--ac)}
.spn-lvl{font-size:.72rem;line-height:1.4;padding:0 6px;border:1px solid currentColor;white-space:nowrap}
.spn-l1{color:var(--spn-good)}.spn-l2{color:var(--ac)}.spn-l3{color:var(--spn-on)}.spn-l4{color:var(--spn-red)}.spn-l0{color:var(--mut)}
.spn-add{display:grid;gap:4px}.spn-add label{font-size:.9rem;color:var(--mut)}
.spn-addrow{display:flex;flex-wrap:wrap;gap:8px}
.spn-addrow input{flex:1 1 220px;min-width:0;font:inherit;color:var(--fg);background:var(--card);border:1px solid var(--bd);padding:9px 11px}
.spn-msg{margin:2px 0 0;font-size:.86rem;color:var(--spn-red)}
.spn-plist{list-style:none;margin:0;padding:0;display:grid;gap:8px}
.spn-prow{display:grid;grid-template-columns:minmax(0,1fr) auto auto;gap:12px;align-items:center;background:var(--card);border:1px solid var(--bd);padding:10px 14px}
.spn-prow strong{display:block;overflow-wrap:anywhere}.spn-meta{display:block;font-size:.84rem;color:var(--mut)}
.spn-meter{display:block;width:90px;height:8px;background:var(--spn-soft);overflow:hidden}.spn-meter i{display:block;height:100%;background:var(--ac)}
.spn-rm{min-width:36px;min-height:36px;padding:0;background:none;border:0;color:var(--mut);font-size:1.3rem;line-height:1;cursor:pointer}.spn-rm:hover{color:var(--spn-red)}
.spn-empty{margin:0;color:var(--mut)}.spn-fine{margin:0;font-size:.82rem;color:var(--mut)}
.spn-note{margin:6px 0 0;font-size:.86rem;color:var(--mut)}
.spn-item{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:6px 14px;align-items:start;background:var(--card);border:1px solid var(--bd);padding:14px 16px}
.spn-item.spn-base{border-color:var(--ac)}
.spn-item>input{width:20px;height:20px;margin:3px 0 0;accent-color:var(--ac)}
.spn-item h3{font-size:1.15rem;line-height:1.25}.spn-item h3 label{cursor:pointer}
.spn-item ul{margin:6px 0 0;padding-inline-start:18px;color:var(--mut);font-size:.93rem}.spn-item .spn-hint{margin-top:4px;font-size:.9rem}
.spn-price{text-align:end;white-space:nowrap;font-weight:600;font-variant-numeric:tabular-nums}.spn-price small{display:block;color:var(--mut);font-size:.76rem;font-weight:400}
.spn-tag{display:inline-block;margin-inline-start:6px;padding:2px 7px;background:var(--spn-soft);color:var(--ac);vertical-align:middle;font:600 .74rem "Barlow Condensed","Barlow Condensed FB0",sans-serif;letter-spacing:.08em;text-transform:uppercase}
.spn-stepper{display:inline-flex;align-items:center;border:1px solid var(--bd);margin-top:8px}
.spn-stepper button{width:36px;height:34px;border:0;background:var(--card);color:var(--fg);font-size:1.1rem;cursor:pointer}.spn-stepper button:hover{color:var(--ac)}
.spn-cnt{min-width:44px;text-align:center;font-variant-numeric:tabular-nums}
.spn-lock{margin:4px 0 0;font-size:.82rem;color:var(--ac)}
.spn-extras{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:10px}
@media (max-width:480px){.spn-item{grid-template-columns:auto minmax(0,1fr)}.spn-price{grid-column:2;text-align:start}.spn-prow{grid-template-columns:minmax(0,1fr) auto}.spn-meter{display:none}}
.spn-total{display:grid;gap:4px}
.spn-big{font:600 2.6rem/1 "Barlow Condensed","Barlow Condensed FB0","Barlow Condensed FB1",sans-serif;font-variant-numeric:tabular-nums}
.spn-warn{margin:0;font-size:.86rem;color:var(--spn-red)}
.spn-rows{display:grid;gap:6px;font-size:.93rem}
.spn-row{display:flex;justify-content:space-between;gap:12px}.spn-amt{white-space:nowrap;font-variant-numeric:tabular-nums}
.spn-save .spn-amt{color:var(--spn-good)}.spn-sum{border-top:1px solid var(--bd);padding-top:6px;font-weight:600}
.spn-tl{display:grid;gap:10px}.spn-tl h3{font-size:1.1rem}
.spn-bar{position:relative;height:30px;background:var(--spn-soft);overflow:hidden}
.spn-fill{position:absolute;top:0;bottom:0;inset-inline-start:var(--a,0);inline-size:var(--w,0);background:var(--spn-fill);border:1px solid var(--ac)}
.spn-run{position:absolute;top:0;bottom:0;inset-inline-start:0;inline-size:var(--run,0);border-inline-end:2px dashed var(--spn-on)}
.spn-bar>span{position:absolute;inset-inline-start:8px;top:5px;font-size:.8rem;font-weight:600}
.spn-scale{position:relative;height:1.3em;font-size:.74rem;color:var(--mut);font-variant-numeric:tabular-nums}
.spn-scale span{position:absolute;top:0;inset-inline-start:var(--p);transform:translateX(-50%)}
[dir=rtl] .spn-scale span{transform:translateX(50%)}.spn-scale span:first-child{transform:none}
.spn-unit{margin:-8px 0 0;font-size:.74rem;color:var(--mut);text-align:end}
.spn-rec{display:grid;gap:6px;padding:14px;background:var(--spn-soft);font-size:.93rem}
.spn-btn{display:inline-flex;justify-content:center;align-items:center;gap:8px;padding:11px 18px;border:1px solid var(--ac);background:var(--ac);color:var(--onac);font:600 .95rem "Barlow Condensed","Barlow Condensed FB0",sans-serif;letter-spacing:.1em;text-transform:uppercase;text-decoration:none;cursor:pointer}
.spn-btn:hover{background:var(--fg);border-color:var(--fg);color:var(--bg)}.spn-btn[disabled]{opacity:.6;cursor:progress}
.spn-ghost{background:transparent;color:var(--ac)}
.spn-req{padding:28px 0;border-bottom:1px solid var(--bd);display:grid;gap:12px}.spn-req h2{font-size:1.5rem}
.spn-req>p{margin:0;max-width:65ch}.spn-sum2{font-weight:600}
.spn-form{display:grid;gap:12px;max-width:560px}
.spn-f{display:grid;gap:4px}.spn-f label{font-size:.9rem;color:var(--mut)}
.spn-f input,.spn-f textarea{font:inherit;color:var(--fg);background:var(--card);border:1px solid var(--bd);padding:9px 11px}
.spn-f textarea{min-height:96px;resize:vertical}.spn-f [aria-invalid=true]{border-color:var(--spn-red);box-shadow:inset 0 0 0 1px var(--spn-red)}
.spn-err{margin:0;font-size:.86rem;color:var(--spn-red)}
.spn-hp{position:absolute;inset-inline-start:-10000px;width:1px;height:1px;overflow:hidden}
.spn-status{padding:10px 12px;border:1px solid var(--spn-red)}.spn-status:focus{outline:3px solid var(--ac)}
.spn-inv{margin-top:20px;padding:14px 18px;border:1px solid var(--bd);background:var(--card)}.spn-inv summary{cursor:pointer;font-weight:700}.spn-inv form{margin-top:10px}
.spn-done{padding:16px 18px;border:1px solid var(--ac);background:var(--spn-soft)}.spn-done h3{font-size:1.3rem;margin-bottom:6px}.spn-done p{margin:0}
.spn-faq{margin-top:8px}.spn-faq h2{font-size:1.5rem;margin:28px 0 8px}
/* Rueckfall-Texte (englisch) auf ar/he-Seiten: Reihenfolge nach dem Inhalt, Ausrichtung bleibt die der Seite */
.spn p,.spn li,.spn summary,.spn-row>span,.spn-tag,.spn-meta,.spn-rec>*,.spn-card span,.spn-card small,.spn-opt>span,.spn-tline,#spn-tline,.spn-chip,.spn-prow strong{unicode-bidi:plaintext}
</style>"""


def _chart_svg(cls, labs, ticks, ymax, wk, vals, lang, day, W, H, fs, step, rtl):
    """Ein Wochen-Diagramm in fester Geometrie; die Schrift ist in viewBox-Einheiten so gewaehlt, dass sie in der jeweiligen Breite lesbar bleibt."""
    pr, pt, pb = 10, 10, round(fs * 2.6)
    pl = max(36, round(8 + fs * 0.62 * max(len(x) for x in labs)))   # Platz fuer die laengste y-Beschriftung (inkl. Wort, z. B. "100 tys.")
    x = lambda i: pl + i * (W - pl - pr) / (len(wk) - 1)
    y = lambda v: pt + (1 - v / ymax) * (H - pt - pb)
    f = lambda v: f"{v:.1f}".rstrip("0").rstrip(".")
    ya = 'direction="rtl" text-anchor="start"' if rtl else 'text-anchor="end"'
    g = "".join(f'<line class="spn-gl" x1="{pl}" x2="{W - pr}" y1="{f(y(t))}" y2="{f(y(t))}"/><text x="{pl - 6}" y="{f(y(t) + fs * 0.4)}" {ya}>{E(labs[i])}</text>' for i, t in enumerate(ticks))
    pts = " ".join(f"{f(x(i))},{f(y(v))}" for i, v in enumerate(vals))
    g += f'<polygon class="spn-area" points="{pl},{f(y(0))} {pts} {f(x(len(vals) - 1))},{f(y(0))}"/><polyline class="spn-line" points="{pts}"/>'
    g += f'<circle class="spn-last" cx="{f(x(len(vals) - 1))}" cy="{f(y(vals[-1]))}" r="4.5"/>'
    last = (len(wk) - 1) // step * step
    anc = lambda i: "start" if i == 0 else "end" if i == last and i == len(wk) - 1 else "middle"   # Rand-Beschriftungen nicht ueber den Rand schieben
    g += "".join(f'<text x="{f(x(i))}" y="{H - round(fs * 0.8)}" text-anchor="{anc(i)}">{E(day(d, lang))}</text>' for i, (d, _) in enumerate(wk) if i % step == 0)
    return f'<svg class="{cls}" viewBox="0 0 {W} {H}" style="font-size:{fs}px" role="img" aria-label="{{aria}}" focusable="false">{g}</svg>'


def _chart(lang, bing, nums, day):
    wk = bing["weekly"]
    vals = [v for _, v in wk]
    ymax = _nice_max(max(vals))
    ticks = [ymax * i / 4 for i in range(5)]
    labs = [nums.get(f"y{i}") or _num(ticks[i]) for i in range(5)]
    rtl = lang in ("ar", "he")   # Achsenwerte mit Wort (ar "25 ألف") in RTL-Reihenfolge
    p = bing["period"]
    aria = tx(lang, "chart_aria", **{"from": day(p["from"], lang), "to": day(p["to"], lang), "min": nums.get("wmin") or _num(min(vals)), "max": nums.get("wmax") or _num(max(vals))})
    # Desktop/Tablet: breite Fassung; Handy (<= 600 px): schmale Fassung mit groesserer Schrift und weniger Datumsangaben (nur eine ist sichtbar)
    desk = _chart_svg("spn-cd", labs, ticks, ymax, wk, vals, lang, day, 640, 170, 10, 2, rtl)
    mob = _chart_svg("spn-cm", labs, ticks, ymax, wk, vals, lang, day, 340, 200, 11, 4, rtl)
    return (f'<figure class="spn-chart"><h2>{E(tx(lang, "chart_h"))}</h2>' + (desk + mob).replace("{aria}", E(aria)) + '</figure>')


def _item(cid, title, body, price, unit, checked=False, extra="", also="", cls="spn-item"):
    d = f"{cid}-d"
    return (f'<div class="{cls}"><input type="checkbox" id="{cid}" aria-describedby="{d}{(" " + also) if also else ""}"{" checked" if checked else ""}>'
            f'<div><h3><label for="{cid}">{E(title)}</label></h3><div id="{d}">{body}</div>{extra}</div>'
            f'<div class="spn-price"><span dir="ltr">{E(price)}</span><small>{E(unit)}</small></div></div>')


def _stepper(k, aria, less, more, n):
    return (f'<div class="spn-stepper" role="group" aria-label="{E(aria)}"><button type="button" data-step="{k}" data-d="-1" aria-label="{E(less)}">−</button>'
            f'<span class="spn-cnt" id="spn-cnt-{k}">{n}</span><button type="button" data-step="{k}" data-d="1" aria-label="{E(more)}">+</button></div>')


def _day(g):
    if g.get("day"): return g["day"]
    from site_updates import day   # Datumshelfer der Seite (de: TT.MM.JJJJ, sonst ISO)
    return day


def body_html(g, lang, stats, quick, ssr, n_main, n_langs, con_on):
    P, pr, B, day = PRICING, PRICING["prices"], g["BASE"], _day(g)
    t = lambda k, **kw: tx(lang, k, **kw)
    S = ssr or {}
    v, nums = S.get("view") or {}, S.get("nums") or {}
    eps = P["episodes_per_topic"]
    bing, gsc, gai = stats["bing"], stats["gsc"], stats.get("google") or {}
    # Belegkarten und Quellen
    cards, srcs = [], []
    if bing["ok"]:
        per = t("period", **{"from": day(bing["period"]["from"], lang), "to": day(bing["period"]["to"], lang)})
        cards.append((nums.get("cit") or _num(bing["citations"]), t("card_citations"), per))
        cards.append((nums.get("ppd") or _num(bing["cited_pages_per_day"]), t("card_pages"), per))
        srcs.append(t("src_bing", source=bing.get("source") or "Bing Webmaster Tools", date=day(bing.get("retrieved") or "", lang),
                      **{"from": day(bing["period"]["from"], lang), "to": day(bing["period"]["to"], lang)}))
    if gai.get("ok"):   # neben den Bing-KI-Karten: Impressionen in Google AI Overviews und AI Mode
        per = t("period", **{"from": day(gai["period"]["from"], lang), "to": day(gai["period"]["to"], lang)})
        cards.append((nums.get("gai") or _num(gai["impressions"]), t("card_gai"), per))
        srcs.append(t("src_gai", source=gai.get("source") or "Google Search Console, Generative AI", date=day(gai.get("retrieved") or "", lang),
                      **{"from": day(gai["period"]["from"], lang), "to": day(gai["period"]["to"], lang)}))
    if gsc["ok"]:
        per = t("period", **{"from": day(gsc["period"]["from"], lang), "to": day(gsc["period"]["to"], lang)})
        cards.append((nums.get("gsc") or _num(gsc["clicks"]), t("card_gsc"), per))
        srcs.append(t("src_gsc", source=gsc.get("source") or "Google Search Console, Search Analytics", date=day(gsc.get("retrieved") or "", lang),
                      **{"from": day(gsc["period"]["from"], lang), "to": day(gsc["period"]["to"], lang)}))
    cards.append((nums.get("eps") or _num(n_main), t("card_episodes"), ""))
    cards.append((nums.get("langs") or _num(n_langs), t("card_langs"), ""))
    srcs.append(t("src_build", date=day(g["TODAY"], lang)))
    proof = ('<ul class="spn-cards">' + "".join(f'<li class="spn-card"><b dir="auto">{E(a)}</b><span>{E(b)}</span>' + (f'<small>{E(c)}</small>' if c else "") + "</li>" for a, b, c in cards) + "</ul>"
             + "".join(f'<p class="spn-src">{E(s)}</p>' for s in srcs) + (_chart(lang, bing, nums, day) if bing["ok"] and bing["weekly"] else ""))
    hero = (f'<header class="spn-hero"><p class="spn-eyebrow"><span class="spn-dot" aria-hidden="true"></span>{E(t("eyebrow"))}</p><h1>{E(t("h1"))}</h1>'
            f'<p class="spn-lead">{E(t("lead", episodes=eps))}</p>'
            f'<p class="spn-mk"><a class="btn" href="{E(mediakit_url(B, lang))}">{E(t("mediakit_cta"))} →</a></p>'   # Mirko, 5.11.2026: Mediadaten immer verlinken
            f'<section aria-label="{E(t("proof_aria"))}">{proof}</section></header>')
    mail = f'<a href="mailto:{MAIL}">{MAIL}</a>'
    nojs = f'<noscript><p class="spn-nojs">{E(t("noscript", mail="{mail}")).replace("{mail}", mail)}</p></noscript>'
    step = lambda n, hid, h, inner: (f'<section class="spn-step" aria-labelledby="{hid}"><div class="spn-sh"><span class="spn-n">{E(t("step", n=n))}</span>'
                                     f'<h2 id="{hid}">{E(h)}</h2></div>{inner}</section>')
    opt = lambda name, val, title, sub, on: (f'<label class="spn-opt"><input type="radio" name="{name}" value="{val}"{" checked" if on else ""}>'
                                             f'<span><b>{E(title)}</b><small>{E(sub)}</small></span></label>')
    d = P["defaults"]
    s1 = step(1, "spn-s1", t("s1_h"), '<div class="spn-seg" role="radiogroup" aria-labelledby="spn-s1">' + "".join(
        opt("spn-goal", k, t(f"goal_{k}"), t(f"goal_{k}_sub"), k == d["goal"]) for k in ("ai", "vis", "lead")) + "</div>")
    def badge(q):
        if not q["rated"]: return f'<span class="spn-lvl spn-l0">{E(t("lvl_unrated"))}</span>'
        nm = t(f'lvl{q["lvl"]}')
        return f'<span class="spn-lvl spn-l{q["lvl"]}">{E(t("lvl_example", level=nm) if q["example"] else nm)}</span>'
    chips = "".join(f'<button type="button" class="spn-chip" data-q="{E(q["id"])}" aria-pressed="{"true" if q["default"] else "false"}">{E(q["name"])}{badge(q)}</button>' for q in quick)
    diff = t("diff_note_example") if stats["example"] else t("diff_note", date=day(stats["diff_updated"] or g["TODAY"], lang))
    s2 = step(2, "spn-s2", t("s2_h"), f'<p class="spn-hint">{E(t("s2_hint", episodes=eps))}</p>'
              f'<div class="spn-chips" role="group" aria-label="{E(t("quick_aria"))}">{chips}</div>'
              f'<div class="spn-add"><label for="spn-q">{E(t("search_label"))}</label><div class="spn-addrow"><input id="spn-q" type="search" list="spn-dl" maxlength="80" autocomplete="off" placeholder="{E(t("search_ph"))}" aria-describedby="spn-q-msg">'
              f'<button type="button" class="spn-btn spn-ghost" data-act="search">{E(t("search_add"))}</button></div><datalist id="spn-dl"></datalist><p class="spn-msg" id="spn-q-msg" hidden></p></div>'
              f'<div class="spn-add"><label for="spn-own">{E(t("own_label"))}</label><div class="spn-addrow"><input id="spn-own" maxlength="80" autocomplete="off" placeholder="{E(t("own_ph"))}" aria-describedby="spn-own-msg">'
              f'<button type="button" class="spn-btn spn-ghost" data-act="own">{E(t("own_add"))}</button></div><p class="spn-msg" id="spn-own-msg" hidden></p></div>'
              f'<h3 class="sr-only">{E(t("picked_aria"))}</h3><div id="spn-picked">{S.get("pickedHtml", "")}</div><p class="spn-fine">{E(diff)}</p>')
    rtl = S.get("rtLabels") or [_plural_en(lang, "months", m) for m in P["runtimes"]]
    rts = "".join(opt("spn-rt", m, rtl[i], t("rt_disc", pct=round(float(P["discount"][str(m)]) * 100)) if float(P["discount"][str(m)]) else t("rt_nodisc"), m == d["runtime"])
                  for i, m in enumerate(P["runtimes"]))
    s3 = step(3, "spn-s3", t("s3_h"), f'<p class="spn-hint">{E(t("s3_hint"))}</p><div class="spn-seg" role="radiogroup" aria-labelledby="spn-s3">{rts}</div>'
              f'<p class="spn-note" id="spn-rtrec">{E(v.get("rtRec", ""))}</p>')
    ul = lambda *xs: "<ul>" + "".join(f'<li>{E(x)}</li>' for x in xs) + "</ul>"
    cnt = {"lv": d["cnt"].get("lv", 1), **(v.get("counts") or {"pr": "", "ex": d["cnt"]["ex"], "li": d["cnt"]["li"]})}
    base = (f'<div class="spn-item spn-base"><input type="checkbox" id="spn-base" checked disabled aria-label="{E(t("base_aria"))}">'
            f'<div><h3><label for="spn-base">{E(t("base_h"))}</label> <span class="spn-tag" id="spn-pk">{E(v.get("pkCount", ""))}</span></h3>'
            f'{ul(t("base_b1", episodes=eps), t("base_b2"), t("base_b3"), t("base_b4"))}</div>'
            f'<div class="spn-price"><span dir="ltr">{fmt_usd(pr["base"])}</span><small>{E(t("unit_topic_month"))}</small></div></div>')
    code = '<code>rel="sponsored"</code>'
    s4 = step(4, "spn-s4", t("s4_h"), base
              + _item("spn-video", t("video_h"), ul(t("video_b")), "+" + fmt_usd(pr["video"]), t("unit_topic_month"))
              + _item("spn-pr", t("pr_h"), ul(t("pr_b")), fmt_usd(pr["pr"]), t("unit_article"), checked=bool(d["pr"]),
                      extra=_stepper("pr", t("pr_stepper"), t("pr_less"), t("pr_more"), cnt["pr"]) + f'<p class="spn-note" id="spn-prrec"{"" if v.get("prRecShow", True) else " hidden"}>{E(v.get("prRec", ""))}</p>')
              + _item("spn-auth", t("auth_h"), ul(t("auth_b")) + f'<p class="spn-note">{E(t("auth_note", code="{code}")).replace("{code}", code)}</p>', "+" + fmt_usd(pr["auth"]), t("unit_month")))
    hint = lambda s: f'<p class="spn-hint">{E(s)}</p>'
    extras = (_item("spn-dash", t("dash_h"), hint(t("dash_hint")), fmt_usd(pr["dash"]), t("unit_once"), extra=f'<p class="spn-lock" id="spn-lock" hidden>{E(t("dash_lock"))}</p>', also="spn-lock")
              + _item("spn-l14", t("lang_h", n=n_langs), hint(t("lang_hint")), fmt_usd(pr["lang"]), t("unit_month"))
              + _item("spn-topic", t("topic_h"), hint(t("topic_hint", n=P["topic_sponsors_max"])), fmt_usd(pr["topic"]), t("unit_month"))
              + _item("spn-expert", t("expert_h"), hint(t("expert_hint")), fmt_usd(pr["expert"]), t("unit_episode"), extra=_stepper("ex", t("expert_stepper"), t("one_less"), t("one_more"), cnt["ex"]))
              + _item("spn-li", t("li_h"), hint(t("li_hint")), fmt_usd(pr["li"]), t("unit_issue"), extra=_stepper("li", t("li_stepper"), t("one_less"), t("one_more"), cnt["li"]) + f'<p class="spn-note">{E(t("li_note"))}</p>')
              + _item("spn-live", t("live_h"), hint(t("live_hint")) + f'<p class="spn-note">{E(t("live_note"))}</p>', fmt_usd(pr["live"]), t("unit_session"),
                      extra=_stepper("lv", t("live_stepper"), t("one_less"), t("one_more"), cnt["lv"]))   # Livesession (LinkedIn + YouTube), immer als gesponsert gekennzeichnet
              + (_item("spn-con", t("con_h"), hint(t("con_hint")), "", t("on_request")) if con_on else ""))
    s5 = step(5, "spn-s5", t("s5_h"), f'<div class="spn-extras">{extras}</div>')
    # Preisuebersicht (sticky, nur die Summenzeile ist live)
    bars = v.get("bars") or {"geo": [0, 0], "seo": [0, 0], "run": 0}
    pc = lambda x: f"{x:.3f}".rstrip("0").rstrip(".") + "%"
    E_ = P["effect"]
    ticks = "".join(f'<span style="--p:{pc(min(100, m / E_["scale_months"] * 100))}"><bdi dir="ltr">{m}{"+" if m == E_["scale_ticks"][-1] else ""}</bdi></span>' for m in E_["scale_ticks"])
    console = (f'<aside class="spn-console" id="spn-console" aria-label="{E(t("console_aria"))}"><p class="spn-eyebrow"><span class="spn-dot" aria-hidden="true"></span>{E(t("console_eyebrow"))}</p>'
               f'<div class="spn-total" aria-live="polite" aria-atomic="true"><span class="spn-fine">{E(t("per_month"))}</span><span class="spn-big" id="spn-month" dir="ltr">{E(v.get("monthly", ""))}</span>'
               f'<span class="spn-fine" id="spn-tline">{E(v.get("totalLine", ""))}</span></div>'
               f'<p class="spn-warn" id="spn-notopic"{"" if v.get("noTopic") else " hidden"}>{E(t("no_topic"))}</p>'
               f'<div class="spn-rows" id="spn-rows">{S.get("rowsHtml", "")}</div>'
               f'<div class="spn-tl" id="spn-tl" style="--run:{pc(bars["run"])}"><h3>{E(t("timeline_h"))}</h3>'
               f'<div class="spn-bar"><div class="spn-run"></div><div class="spn-fill" id="spn-fgeo" style="--a:{pc(bars["geo"][0])};--w:{pc(bars["geo"][1])}"></div><span>{E(t("bar_geo"))}</span></div>'
               f'<div class="spn-bar"><div class="spn-run"></div><div class="spn-fill" id="spn-fseo" style="--a:{pc(bars["seo"][0])};--w:{pc(bars["seo"][1])}"></div><span>{E(t("bar_seo"))}</span></div>'
               f'<div class="spn-scale" aria-hidden="true">{ticks}</div><p class="spn-unit" aria-hidden="true">{E(t("scale_unit"))}</p>'
               f'<p class="spn-fine" id="spn-ttext">{E(v.get("tText", ""))}</p></div>'
               f'<div class="spn-rec" id="spn-rec">{S.get("recHtml", "")}</div>'
               f'<a class="spn-btn" href="#spn-req" id="spn-open">{E(t("open_req"))}</a><p class="spn-fine">{E(t("footnote"))}</p></aside>')
    priv = f'{B}/datenschutz/' if lang == "de" else f'{B}/privacy/'
    plink = f'<a href="{priv}">{E(t("privacy_link"))}</a>'
    fld = lambda fid, lab, inp: f'<div class="spn-f"><label for="{fid}">{E(lab)}</label>{inp}<p class="spn-err" id="{fid}-e" hidden></p></div>'
    form = (f'<section class="spn-req" id="spn-req" aria-labelledby="spn-req-h" tabindex="-1"><h2 id="spn-req-h">{E(t("req_h"))}</h2><p>{E(t("req_intro"))}</p>'
            f'<p class="spn-sum2" id="spn-sum">{E(v.get("summary", ""))}</p>'
            f'<form class="spn-form" id="spn-form" method="post" novalidate>'
            + fld("spn-company", t("f_company"), f'<input id="spn-company" name="company" autocomplete="organization" maxlength="160" required placeholder="{E(t("f_company_ph"))}" aria-describedby="spn-company-e">')
            + fld("spn-name", t("f_name"), '<input id="spn-name" name="name" autocomplete="name" maxlength="120" required aria-describedby="spn-name-e">')
            + fld("spn-email", t("f_email"), '<input id="spn-email" name="email" type="email" autocomplete="email" maxlength="254" required aria-describedby="spn-email-e">')
            + fld("spn-msg", t("f_msg"), '<textarea id="spn-msg" name="message" maxlength="2000"></textarea>')
            + f'<div class="spn-hp" aria-hidden="true"><label for="spn-website">{E(t("f_hp"))}</label><input id="spn-website" name="website" tabindex="-1" autocomplete="off"></div>'
            f'<p class="spn-err" id="spn-topics-e" hidden></p><div><button type="submit" class="spn-btn" id="spn-submit" disabled>{E(t("submit"))}</button></div>'
            f'<p class="spn-fine">{E(t("privacy", link="{link}")).replace("{link}", plink)}</p>'
            f'<div class="spn-status" id="spn-status" tabindex="-1" hidden></div></form>'
            f'<div class="spn-done" id="spn-done" tabindex="-1" hidden><h3>{E(t("done_h"))}</h3><p>{E(t("done_p"))}</p></div>'
            + invoice_html(t) + '</section>')
    faq = "".join(f'<details><summary>{E(q)}</summary><p>{E(a)}</p></details>' for q, a in faq_items(lang, stats, nums, day))
    faq = f'<section class="faq spn-faq" aria-labelledby="spn-faq-h"><h2 id="spn-faq-h">{E(t("faq_h"))}</h2>{faq}</section>'
    return hero + nojs + f'<div class="spn-grid"><div class="spn-build">{s1}{s2}{s3}{s4}{s5}</div>{console}{form}{faq}</div>'


def advertise_button(B, lang):
    """#281: Verweis auf die direkt buchbaren Werbeplaetze - nur, wenn die Buchung an ist (data/ad_slots.json "booking")."""
    import site_ads as ADS
    if not ADS.booking_on():
        return ""
    return f'<a class="btn" href="{E(ADS.advertise_url(B, lang))}">{E(ADS.texts(lang, "slot")["adv_cta"])}</a>'


def invoice_html(t):
    """#281: direkt bestellen per PayPal-Rechnung, nur ohne M365Con (assets/sponsor.js blendet um; Preis rechnet der Server neu).
    Solange die Buchung aus ist (data/ad_slots.json "booking"), gibt es nur das Anfrageformular."""
    import site_ads as ADS
    if not ADS.booking_on():
        return ""
    return (f'<details class="spn-inv" id="spn-inv" hidden><summary>{E(t("inv_h"))}</summary><p>{E(t("inv_intro"))}</p>'
            f'<div id="spn-inv-body" aria-live="polite"></div></details>'
            f'<p class="spn-fine" id="spn-inv-con" hidden>{E(t("inv_con"))}</p>')


def faq_items(lang, stats, nums, day):
    t = lambda k, **kw: tx(lang, k, **kw)
    b = stats["bing"]
    if b["ok"] and b["weekly"]:
        a1 = t("faq1_a", low=nums.get("low") or _num(_round_k(min(v for _, v in b["weekly"]))), high=nums.get("high") or _num(_round_k(max(v for _, v in b["weekly"]))),
               **{"from": day(b["period"]["from"], lang), "to": day(b["period"]["to"], lang)})
    else:
        a1 = t("faq1_a_nodata")
    return [(t("faq1_q"), a1), (t("faq2_q"), t("faq2_a")), (t("faq3_q"), t("faq3_a")), (t("faq4_q"), t("faq4_a"))]


def _round_k(v):
    return int(v / 1000 + 0.5) * 1000


def jsonld(B, lang, u, hl, lastmod, faqs, n_langs):
    pr, t = PRICING["prices"], (lambda k, **kw: tx(lang, k, **kw))
    def offer(name, key, unit=None):
        o = {"@type": "Offer", "name": name, "price": str(pr[key]), "priceCurrency": PRICING["currency"]}
        if unit: o["priceSpecification"] = {"@type": "UnitPriceSpecification", "price": str(pr[key]), "priceCurrency": PRICING["currency"], "unitCode": unit}
        return o
    offers = [offer(t("base_h"), "base", "MON"), offer(t("video_h"), "video", "MON"), offer(t("pr_h"), "pr"), offer(t("row_auth"), "auth", "MON"),
              offer(t("dash_h"), "dash"), offer(t("lang_h", n=n_langs), "lang", "MON"), offer(t("topic_h"), "topic", "MON"), offer(t("expert_h"), "expert"), offer(t("li_h"), "li"), offer(t("live_h"), "live")]
    return [{"@context": "https://schema.org", "@type": "WebPage", "@id": u + "#page", "url": u, "name": t("h1"), "inLanguage": hl, "isPartOf": {"@id": f"{B}/#website"},
             "publisher": {"@id": f"{B}/#org"}, "dateModified": lastmod, "mainEntity": {"@id": u + "#service"}},
            {"@context": "https://schema.org", "@type": "Service", "@id": u + "#service", "name": t("svc_name"), "serviceType": t("svc_type"), "url": u,
             "provider": {"@id": f"{B}/#org"}, "areaServed": "Worldwide", "hasOfferCatalog": {"@type": "OfferCatalog", "name": t("svc_name"), "itemListElement": offers}},
            {"@context": "https://schema.org", "@type": "FAQPage", "@id": u + "#faq", "inLanguage": hl,
             "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in faqs]}]


def asset_url(B, name):
    """Skript mit Inhalts-Hash als ?v= (Browser-Cache passt zu data-cfg; der Site-Worker entfernt die Abfrage beim Abruf vom Ursprung)."""
    p = ROOT / "assets" / name
    h = hashlib.sha1(p.read_bytes()).hexdigest()[:10] if p.exists() else "0"
    return f"{B}/assets/{name}?v={h}"


def build(g):
    """g: write, page, header, footer, BASE, LANGS (Dict der Dub-Sprachen), sitemap, TODAY, api; optional n_main (Folgen der Hauptshow), n_langs,
    ents (Entitaeten), day (Datumshelfer), langs (Teilmenge fuer Tests). Schreibt sponsor/index.html und <lang>/sponsor/index.html."""
    B, TODAY = g["BASE"], g["TODAY"]
    LG = g.get("LANGS") or {}
    langs = [l for l in (g.get("langs") or LANGS_ALL) if l == "en" or l in LG]
    alts = {l: url(B, l) for l in ["en"] + [x for x in LANGS_ALL if x in LG]}
    stats = load_stats()
    n_main, n_langs = int(g.get("n_main") or 0), int(g.get("n_langs") or len(LG))
    con_on = TODAY <= PRICING["m365con"]["until"]
    _dates = [x for x in (PRICING.get("updated", ""), str(stats["bing"].get("retrieved") or "")[:10],
                          str(stats["google"].get("retrieved") or "")[:10] if stats["google"].get("ok") else "", stats["diff_updated"]) if re.fullmatch(r"\d{4}-\d{2}-\d{2}", x) and x <= TODAY]
    lastmod = max(_dates) if _dates else TODAY   # Inhaltsdatum (Preise, Belegzahlen, Schwierigkeit), nicht das Baudatum
    P = PRICING
    per_lang, payload = {}, []
    for lang in langs:
        quick, search, ebase = topics_for(g, lang, stats)
        page = urlsplit(alts[lang]).path
        st = default_state(quick)
        nums = []
        b = stats["bing"]
        if b["ok"]:
            nums += [["cit", b["citations"], "compact"], ["ppd", b["cited_pages_per_day"], "int"]]
            if b["weekly"]:
                vals = [x for _, x in b["weekly"]]; ymax = _nice_max(max(vals))
                nums += [[f"y{i}", ymax * i / 4, "compact"] for i in range(5)] + [["wmin", min(vals), "int"], ["wmax", max(vals), "int"],
                                                                                 ["low", _round_k(min(vals)), "int"], ["high", _round_k(max(vals)), "int"]]
        if stats["google"]["ok"]: nums.append(["gai", stats["google"]["impressions"], "compact"])
        if stats["gsc"]["ok"]: nums.append(["gsc", stats["gsc"]["clicks"], "compact"])
        nums += [["eps", n_main, "int"], ["langs", n_langs, "int"]]
        per_lang[lang] = (quick, search, ebase, page, st)
        payload.append({"lang": lang, "T": I18N.get(lang, {}) if lang != "en" else {}, "state": st, "page": page, "nums": nums})
    ssr = _ssr({"P": P, "E": EN, "nLangs": n_langs, "con": con_on, "langs": payload})
    js = f'<script defer src="{asset_url(B, "sponsor-calc.js")}"></script><script defer src="{asset_url(B, "sponsor.js")}"></script>'
    for lang in langs:
        quick, search, ebase, page, st = per_lang[lang]
        S = ssr.get(lang) or {}
        hl = g["LANGS"][lang][1] if lang in LG else "en"
        cfg = {"P": P, "T": I18N.get(lang, {}) if lang != "en" else {}, "E": EN, "lang": lang, "api": g["api"], "page": page, "mail": MAIL, "nLangs": n_langs,
               "con": con_on, "quick": [[q["id"], q["name"], q["en"], q["lvl"], q["rated"], q["example"], q["url"], q["default"], q["al"]] for q in quick],
               "ents": search, "entBase": ebase, "key": S.get("key", ""), "dec": S.get("dec"),
               "community": f"{B}/{'' if lang == 'en' else lang + '/'}community/"}
        body = body_html(g, lang, stats, quick, S, n_main, n_langs, con_on)
        dash = dashboard_url(B, lang)
        adv = advertise_button(B, lang)
        body = (f'{g["header"](lang, "")}<main class="wrap spn-wrap"><p><a class="btn" href="{E(dash)}">{E(tx(lang, "dash_h"))}</a> {adv}</p>'
                f'<div class="spn" id="spn" data-ssr="{1 if S else 0}" data-cfg="{E(json.dumps(cfg, ensure_ascii=False, separators=(",", ":")))}">'
                f'{body}</div></main>{g["footer"](lang)}{js}')
        faqs = faq_items(lang, stats, S.get("nums") or {}, _day(g))
        meta = tx(lang, "meta", episodes=P["episodes_per_topic"])
        u = alts[lang]
        g["write"](("sponsor" if lang == "en" else f"{lang}/sponsor") + "/index.html",
                   g["page"](lang, tx(lang, "title") + " – M365.FM", meta, u, body, alts if len(alts) > 1 else None, jsonld(B, lang, u, hl, lastmod, faqs, n_langs),
                             xdefault=alts["en"], og_type="website", extra_head=CSS, share=False))
        g["sitemap"].append((u, lastmod, alts if len(alts) > 1 else None))
        q = dashboard_copy(lang)
        views = (("overview", "dashboard"), ("placement", "placement_view"),
                 ("report", "report_view"), ("sources", "sources_view"))
        urls = {view: dashboard_view_url(B, lang, view) for view, _ in views}
        config = json.dumps({"api": g["api"], "base": B, "lang": lang, "today": TODAY, "copy": q, "urls": urls},
                            ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")
        for view, title_key in views:
            canonical = urls[view]
            dashboard_body = (f'{g["header"](lang, "")}<main class="wrap sdb-main">'
                              f'<div><div class="kicker">{E(q["dash_kicker"])}</div>'
                              f'<h1 id="sdb-title">{E(q["achievement_title"] if view == "overview" else q[title_key])}</h1><p class="lede">{E(q["intro"])}</p></div>'
                              f'<p class="mut" id="sdb-scope">{E(q["scope"])}</p>'
                              f'<div id="sdb" aria-live="polite"><p class="mut">{E(q["login"])}</p></div>'
                              f'<script>window.M365SP=Object.assign({config},{{view:"{view}"}})</script>'
                              f'<script defer src="{asset_url(B, "sponsor-dashboard.js")}"></script></main>{g["footer"](lang)}')
            title = (q["achievement_title"] if view == "overview" else q[title_key]) + " – M365.FM"
            output_path = ("sponsor/dashboard/" if view == "overview" else f"sponsor/dashboard/{view}/") if lang == "en" else \
                          (f"{lang}/sponsor/dashboard/" if view == "overview" else f"{lang}/sponsor/dashboard/{view}/")
            g["write"](output_path + "index.html",
                       g["page"](lang, title, q["intro"], canonical, dashboard_body,
                                 None,
                                 [{"@context": "https://schema.org", "@type": "WebPage", "name": q[title_key],
                                   "url": canonical, "inLanguage": g["LANGS"][lang][1] if lang in LG else "en"}],
                                 og_type="website", extra_head=f"<style>{DASHBOARD_CSS}</style>", share=False, noindex=True))
    print(f"Sponsor-Seite: {len(langs)} Sprachen ({'vorab gerendert' if ssr else 'ohne Vorab-Rendern'}), {len(per_lang[langs[0]][1]) if langs else 0} Themen in der Suche")
    return langs
