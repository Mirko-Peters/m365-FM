"""Community-Seite /community/ und /<sprache>/community/ (noindex): Bereiche, Skripte und das Nachladen der Bereichs-Skripte.

Vorher standen ~22 Bereichs-Skripte (~430 KB ungepackt) als defer im HTML. DOMContentLoaded wartete auf alle, und erst danach zeigt
community.js den Inhalt von #c-page (Anmeldung bzw. Konto) - das war das LCP-Element (Lighthouse Handy 7,1 s). guests.js holte dazu bei
jedem Aufruf /entities.json (~2 MB), mvp-tracker.js zwei weitere Skripte. Alle Bereiche ausser #c-page liegen aber in Reitern
(assets/profile.js blendet sie mit hidden aus) und rendern nur in ihren eigenen Platz.

Jetzt:
- sofort (defer, wie bisher): community_tags (Texte, community.js mit #c-page), entity-match.js und profile.js (Reiterleiste ueber
  dem Inhalt, Einladungskarte ?invite= ueber den Reitern, Profil/Firmen);
- "view": assets/community-lazy.js laedt die Skripte eines Bereichs, sobald sein Platz sichtbar ist (Reiter gewaehlt) und in die Naehe
  des Bildschirms kommt (IntersectionObserver mit Vorlauf); Abhaengigkeiten stehen vorn in der Liste (M365U aus events.js, dazu
  editor/seo/credits), jedes Skript laeuft einmal und in Listenreihenfolge;
- "idle": Bereiche ohne Reiter (immer sichtbar, aber nur angemeldet und mit eingeschalteter Funktion gefuellt) nach dem Laden der Seite.
- mvp-tracker.css kommt mit dem MVP-Tracker (vor dessen Skript), nicht mehr renderblockierend im <head>; dessen Druckregel fuer Kopf,
  Fuss und Reiterleiste steht als kleines <style> im <head> (PRINT_CSS), damit jeder Reiter wie vorher ohne sie gedruckt wird.
- <main> hat min-height:100vh: Inhalt von #c-page entsteht per Skript ueber der Fusszeile; so liegt die Fusszeile beim
  ersten Bild schon unter dem Bildschirm und verschiebt sich nicht sichtbar (CLS).
- Erste Ansicht ohne Skript (Dienstag-Check 17.11.2026: LCP mobil war der per Skript eingefuegte Anmeldekasten, render delay 813 ms):
  Reiterleiste (#c-tabs) und Anmeldekasten (#c-login, Texte aus data/community_i18n.json) stehen schon im HTML, ihre Regeln als <style> im
  <head> (community.css kommt erst nach dem Fuss). profile.js verdrahtet die vorhandene Leiste, community.js laesst den Kasten bei
  Abgemeldeten stehen und ersetzt ihn nur fuer Angemeldete. Ein kleines Skript im <head> blendet ihn vorab aus, wenn der Browser sich die
  Anmeldung gemerkt hat (localStorage m365_auth, gesetzt und geloescht von community.js nach /api/me), und bei ?u=<id> (Profil-Ansicht
  ohne Reiter und ohne Anmeldung).
"""
import html
import json
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).resolve().parent
_CI = json.loads((ROOT / "data" / "community_i18n.json").read_text("utf-8")) if (ROOT / "data" / "community_i18n.json").exists() else {}

# Plaetze in Reihenfolge (die Tests in worker/test/*_ui.test.mjs und tests/test_mvp_tracker.py pruefen sie hier)
SECTIONS = ("c-page", "c-expert", "c-mvp", "c-events", "c-events-import", "c-events-entity", "c-blog", "c-blogdomain", "c-blogimport",
            "c-podcast", "c-shows", "c-video", "c-library", "c-guests", "c-feed", "c-notes", "c-wish", "c-mail", "c-messages")

# Sofort geladen (defer): Reiterleiste und Profil (profile.js braucht window.M365EntityMatch)
EAGER = ("entity-match.js", "profile.js")

# window.M365U (h, api, lab, inp, sel, topicsUI) entsteht in events.js; editor.js, seo.js und credits.js haengen U.editor, U.seo und
# U.credits an und brechen ohne M365U ab. Wer M365U braucht, laedt diese vier vorher (vorher: feste Reihenfolge der defer-Skripte).
LIB = ("events.js", "editor.js", "seo.js", "credits.js")

# (Plaetze, Skripte, Stylesheets, wann) - Reihenfolge der Skripte wie vorher im HTML
GROUPS = (
    (("c-mvp",), ("mvp-tracker.js",), ("mvp-tracker.css",), "view"),
    (("c-events", "c-events-import"), ("events.js", "events-import.js"), (), "view"),   # c-events-import gehoert zum Reiter Events (profile.js SUB)
    (("c-events-entity",), ("events-entity.js",), (), "idle"),   # ohne Reiter; nur angemeldet mit eigenen Events oder als Admin
    (("c-notes",), LIB + ("notes.js",), (), "view"),
    (("c-blog",), LIB + ("blog.js",), (), "view"),
    (("c-blogdomain",), ("blogdomain.js",), (), "idle"),   # ohne Reiter; nur angemeldet und mit Schalter BYOD
    (("c-blogimport",), ("blogimport.js",), (), "idle"),   # ohne Reiter; nur angemeldet und mit Schalter BYOD_IMPORT
    (("c-podcast",), LIB + ("podcast.js",), (), "view"),
    (("c-shows",), LIB + ("shows.js",), (), "view"),
    (("c-video",), LIB + ("video.js",), (), "view"),
    (("c-library",), LIB + ("library.js",), (), "view"),
    (("c-guests",), LIB + ("guests.js",), (), "view"),   # guests.js holt /entities.json (~2 MB) - nur noch, wenn der Reiter offen ist
    (("c-feed",), LIB + ("feeditems.js",), (), "view"),
    (("c-wish",), LIB + ("wish.js",), (), "view"),
    (("c-mail",), LIB + ("mailprefs.js",), (), "view"),
    (("c-messages",), ("messages.js",), (), "view"),
)
LOADER = "community-lazy.js"
PRINT_CSS = "@media print{header,footer,.ctabs{display:none!important}}"

# Reiter wie assets/profile.js (T0): (Platz, Deutsch, alle anderen Sprachen); None = Text mvp_tab aus data/community_i18n.json.
# tests/test_community_page.py prueft Reihenfolge und Texte gegen profile.js (sonst aendert sich die Leiste beim Verdrahten).
TABS = (("c-page", "Konto", "Account"), ("c-expert", "Profil", "Profile"), ("c-mvp", None, None), ("c-orgs", "Firmen", "Companies"),
        ("c-events", "Events", "Events"), ("c-blog", "Blog", "Blog"), ("c-podcast", "Podcast", "Podcast"), ("c-shows", "Podcast-Umzug", "Podcast move"),
        ("c-video", "Videos", "Videos"), ("c-library", "Bibliothek", "Library"), ("c-feed", "Meine Inhalte", "My content"), ("c-notes", "Show Notes", "Show Notes"),
        ("c-guests", "Gäste", "Guests"), ("c-wish", "Roadmap & Wünsche", "Roadmap & wishes"), ("c-mail", "Benachrichtigungen", "Notifications"),
        ("c-messages", "Nachrichten", "Messages"))
PROVIDERS = (("google", "signin_google"), ("microsoft", "signin_ms"), ("linkedin", "signin_li"), ("github", "signin_gh"))   # wie loginBox() in community.js
AUTH_KEY = "m365_auth"   # localStorage: "1" = beim letzten /api/me angemeldet (community.js)
# Vor dem ersten Bild: ?u= (keine Reiter, kein Kasten) bzw. gemerkte Anmeldung (Kasten aus, community.js zeigt ihn wieder, falls abgemeldet)
HEAD_JS = ('(function(){try{var d=document.documentElement;if(/[?&]u=/.test(location.search))d.classList.add("c-u");'
           f'else if(localStorage.getItem("{AUTH_KEY}")==="1")d.classList.add("c-in")}}catch(e){{}}}})()')
HIDE_CSS = ".c-in #c-login,.c-u #c-login,.c-u #c-tabs{display:none}#c-login a.btn[aria-disabled=true]{opacity:.45;cursor:default}"


def first_view_css():
    """Regeln fuer Reiterleiste und Anmeldekasten aus assets/community.css (dort bleiben sie fuer die Widgets der anderen Seiten)."""
    rules = [ln for ln in (ROOT / "assets" / "community.css").read_text("utf-8").splitlines() if ln.startswith((".clogin{", ".ctabs{"))]
    if len(rules) != 2:
        raise ValueError("assets/community.css: Regeln .clogin{ und .ctabs{ fehlen")
    return "".join(rules) + HIDE_CSS


def texts(lang):
    t = dict(_CI.get("en", {}))
    t.update(_CI.get(lang, {}))
    return t


def page_url(base, lang):
    return f"{base}/community/" if lang == "en" else f"{base}/{lang}/community/"


def privacy_url(base, lang):
    return f"{base}/{'datenschutz' if lang == 'de' else 'privacy'}/"


def tab_bar(lang):
    """Reiterleiste wie profile.js sie baut (Konto gewaehlt); profile.js haengt nur noch die Klicks an."""
    t = texts(lang)
    btn = []
    for i, de, other in TABS:
        label = t.get("mvp_tab") or "MVP Tracker" if de is None else de if lang == "de" else other
        btn.append(f'<button type="button" class="ctab" role="tab" data-t="{i}" aria-selected="{"true" if i == "c-page" else "false"}">{html.escape(label)}</button>')
    return f'<div role="tablist" class="ctabs" id="c-tabs">{"".join(btn)}</div>'


def login_box(lang, base, api):
    """Anmeldekasten wie loginBox() in community.js; Ruecksprung zunaechst die Seite selbst (community.js setzt die aktuelle Adresse ein)."""
    t, ret = texts(lang), quote(page_url(base, lang), safe="")
    e = html.escape
    btns = "".join(f'<a class="btn{" main" if k == 0 else ""}" href="{api}/auth/login/{p}?return={ret}" rel="nofollow">{e(t.get(key, key))}</a>'
                   for k, (p, key) in enumerate(PROVIDERS))
    return (f'<div class="clogin" id="c-login"><p>{e(t.get("login_to_comment", ""))}</p><div class="btns">{btns}</div>'
            f'<small>{e(t.get("signin_note", ""))} <a href="{privacy_url(base, lang)}">{e(t.get("privacy", ""))}</a></small></div>')


def asset(base, cv, name):
    """Adresse mit Inhalts-Hash (?v=), wie community.js und community.css: neue Version = neue Adresse."""
    return f"{base}/assets/{name}?v={cv('assets/' + name)}"


def lazy_config(base, cv):
    return [{"ids": list(ids), "js": [asset(base, cv, n) for n in js], "css": [asset(base, cv, n) for n in css], "when": when}
            for ids, js, css, when in GROUPS]


def build(lang, title_html, *, base, api, cv, header, footer, community_tags):
    """-> (body, extra_head) der Community-Seite einer Sprache. header/footer/community_tags sind fertiges HTML, title_html ist escaped."""
    divs = "".join(f'<div id="{i}">{login_box(lang, base, api) if i == "c-page" else ""}</div>' for i in SECTIONS)
    cfg = json.dumps(lazy_config(base, cv), separators=(",", ":")).replace("</", "<\\/")
    eager = "".join(f'<script defer src="{asset(base, cv, n)}"></script>' for n in EAGER)
    body = (f'{header}<main class="wrap" style="max-width:48em;min-height:100vh"><h1 id="c-h1">{title_html}</h1>{tab_bar(lang)}{divs}</main>{footer}{community_tags}'
            f'<script>window.M365X={{api:"{api}",base:"{base}",lang:"{lang}"}}</script>{eager}'
            f'<script>window.M365LZ={cfg}</script><script defer src="{asset(base, cv, LOADER)}"></script>')
    # community.js fragt beim Laden /api/me (Anmeldung, LCP-Inhalt): Verbindung zur API frueh aufbauen. Ohne crossorigin, weil die
    # Abfragen mit credentials:"include" laufen (der Browser nutzt dafuer die Verbindung ohne crossorigin-Kennzeichen).
    # Druck: Kopf, Fuss und Reiterleiste ausblenden (stand vorher nur in mvp-tracker.css, das jetzt erst mit dem Reiter MVP laedt)
    # Reiterleiste und Anmeldekasten: Regeln und Vorab-Ausblenden im <head>, damit das erste Bild schon fertig aussieht
    extra_head = f'<link rel="preconnect" href="{api}"><style>{PRINT_CSS}{first_view_css()}</style><script>{HEAD_JS}</script>'
    return body, extra_head
