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
- mvp-tracker.css kommt mit dem MVP-Tracker (vor dessen Skript), nicht mehr renderblockierend im <head>.
- <main> hat min-height:100vh: Reiterleiste und Inhalt von #c-page entstehen per Skript ueber der Fusszeile; so liegt die Fusszeile beim
  ersten Bild schon unter dem Bildschirm und verschiebt sich nicht sichtbar (CLS).
"""
import json

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


def asset(base, cv, name):
    """Adresse mit Inhalts-Hash (?v=), wie community.js und community.css: neue Version = neue Adresse."""
    return f"{base}/assets/{name}?v={cv('assets/' + name)}"


def lazy_config(base, cv):
    return [{"ids": list(ids), "js": [asset(base, cv, n) for n in js], "css": [asset(base, cv, n) for n in css], "when": when}
            for ids, js, css, when in GROUPS]


def build(lang, title_html, *, base, api, cv, header, footer, community_tags):
    """-> (body, extra_head) der Community-Seite einer Sprache. header/footer/community_tags sind fertiges HTML, title_html ist escaped."""
    divs = "".join(f'<div id="{i}"></div>' for i in SECTIONS)
    cfg = json.dumps(lazy_config(base, cv), separators=(",", ":")).replace("</", "<\\/")
    eager = "".join(f'<script defer src="{asset(base, cv, n)}"></script>' for n in EAGER)
    body = (f'{header}<main class="wrap" style="max-width:48em;min-height:100vh"><h1 id="c-h1">{title_html}</h1>{divs}</main>{footer}{community_tags}'
            f'<script>window.M365X={{api:"{api}",base:"{base}",lang:"{lang}"}}</script>{eager}'
            f'<script>window.M365LZ={cfg}</script><script defer src="{asset(base, cv, LOADER)}"></script>')
    # community.js fragt beim Laden /api/me (Anmeldung, LCP-Inhalt): Verbindung zur API frueh aufbauen. Ohne crossorigin, weil die
    # Abfragen mit credentials:"include" laufen (der Browser nutzt dafuer die Verbindung ohne crossorigin-Kennzeichen).
    extra_head = f'<link rel="preconnect" href="{api}">'
    return body, extra_head
