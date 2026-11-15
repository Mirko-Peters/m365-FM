"""App "M365.FM Contributor" (MVP-Tracker als installierbare PWA, #231): eigene Seite je Sprache unter /community/contributor/
(en) bzw. /<sprache>/community/contributor/ mit eigenem Web-App-Manifest und eigenem Service Worker, beide nur fuer diesen Pfad.

Neben dem seitenweiten Service Worker /sw.js (Web-Push, kein Caching; PR #204 plant dort ein seitenweites Manifest) gilt:
- Manifest und Service Worker liegen IM App-Pfad und haben scope = App-Pfad. Fuer Seiten unter dem App-Pfad gewinnt nach den
  Regeln des Browsers die laengste passende Registrierung; alle anderen Seiten bleiben beim seitenweiten /sw.js.
- Das Manifest wird nur auf den App-Seiten verlinkt, nie seitenweit.
- Der Service Worker cached nur die App-Huelle (Seite, Skript, Stile, Texte, Symbole) und eine Offline-Seite. Anfragen an /api/
  (und an andere Hosts wie die Community-API) laufen immer direkt ins Netz und werden nie gespeichert - dort liegen private Daten.
Bilder: nur vorhandene Symbole aus /assets (favicon-192.png, favicon.svg); neue Bilder gehoeren nach img.m365.fm (CLAUDE.md)."""
import json
from html import escape as esc
from urllib.parse import urlparse

APP_NAME = "M365.FM Contributor"
THEME = "#3b6391"        # --ac aus site_design.py
BACKGROUND = "#f3f3f2"   # --bg aus site_design.py
RTL = {"ar", "he"}
SW_VERSION = "1"


def path_of(lang):
    """App-Pfad (scope) einer Sprache, mit fuehrendem und abschliessendem Schraegstrich."""
    return "/community/contributor/" if lang == "en" else f"/{lang}/community/contributor/"


def strings(ci, lang):
    t = dict(ci.get("en", {})); t.update(ci.get(lang, {}))
    return {k[4:]: v for k, v in t.items() if k.startswith("mvp_")}


def manifest(base, lang, ci):
    root = urlparse(base).path.rstrip("/")
    scope = root + path_of(lang)
    t = strings(ci, lang)
    return {
        "id": scope, "name": APP_NAME, "short_name": "Contributor", "description": t.get("page_desc", ""),
        "lang": lang, "dir": "rtl" if lang in RTL else "ltr",
        "start_url": scope + "#overview", "scope": scope, "display": "standalone", "orientation": "any",
        "background_color": BACKGROUND, "theme_color": THEME, "categories": ["productivity", "business"],
        "icons": [
            {"src": f"{root}/assets/favicon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any"},
            {"src": f"{root}/assets/favicon.svg", "sizes": "any", "type": "image/svg+xml", "purpose": "any"},
        ],
        "shortcuts": [
            {"name": t.get("nav_add", "Add"), "url": scope + "#add"},
            {"name": t.get("nav_log", "Contributions"), "url": scope + "#log"},
        ],
    }


def service_worker(base, lang):
    """Service Worker nur fuer den App-Pfad: App-Huelle + Offline-Seite, /api/ und fremde Hosts nie aus dem Cache."""
    root = urlparse(base).path.rstrip("/")
    scope = root + path_of(lang)
    shell = [scope, scope + "offline.html", f"{root}/assets/mvp-tracker.js", f"{root}/assets/mvp-sources.js", f"{root}/assets/linkedin-export.js", f"{root}/assets/mvp-tracker.css", f"{root}/assets/community.css",
             f"{root}/assets/cm-{lang}.js", f"{root}/assets/favicon.svg", f"{root}/assets/favicon-192.png"]
    return f"""// Service Worker der App "{APP_NAME}" ({lang}), nur fuer {scope} (site_contributor.py). Kein Web-Push (das macht /sw.js).
// Gespeichert wird nur die App-Huelle. Private Daten kommen von der Community-API (/api/...) und werden NIE gespeichert.
var CACHE = "contributor-{lang}-v{SW_VERSION}", SCOPE = {json.dumps(scope)}, OFFLINE = SCOPE + "offline.html";
var SHELL = {json.dumps(shell)};
self.addEventListener("install", function (e) {{
  e.waitUntil(caches.open(CACHE).then(function (c) {{ return Promise.all(SHELL.map(function (u) {{ return c.add(new Request(u, {{ cache: "reload" }})).catch(function () {{}}); }})); }}).then(function () {{ return self.skipWaiting(); }}));
}});
self.addEventListener("activate", function (e) {{
  e.waitUntil(caches.keys().then(function (ks) {{ return Promise.all(ks.filter(function (k) {{ return k.indexOf("contributor-{lang}-") === 0 && k !== CACHE; }}).map(function (k) {{ return caches.delete(k); }})); }}).then(function () {{ return self.clients.claim(); }}));
}});
function isPrivate(url) {{ return url.origin !== self.location.origin || url.pathname.indexOf("/api/") !== -1; }}
self.addEventListener("fetch", function (e) {{
  var req = e.request, url = new URL(req.url);
  if (req.method !== "GET" || isPrivate(url)) return;   // Netz direkt: API-Antworten (mit Sitzung) nie cachen
  if (req.mode === "navigate") {{
    e.respondWith(fetch(req).then(function (r) {{
      if (r.ok && url.pathname === SCOPE) {{ var copy = r.clone(); caches.open(CACHE).then(function (c) {{ c.put(SCOPE, copy); }}); }}
      return r;
    }}).catch(function () {{ return caches.match(SCOPE).then(function (r) {{ return r || caches.match(OFFLINE); }}); }}));
    return;
  }}
  if (SHELL.indexOf(url.pathname) === -1) return;
  e.respondWith(caches.match(url.pathname).then(function (hit) {{
    var net = fetch(req).then(function (r) {{ if (r.ok) {{ var copy = r.clone(); caches.open(CACHE).then(function (c) {{ c.put(url.pathname, copy); }}); }} return r; }});
    return hit ? (net.catch(function () {{}}), hit) : net;
  }}));
}});
"""


def offline_html(base, lang, ci):
    t = strings(ci, lang)
    d = "rtl" if lang in RTL else "ltr"
    return (f'<!doctype html><html lang="{lang}" dir="{d}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
            f'<meta name="robots" content="noindex"><title>{esc(t.get("pwa_offline_h", "Offline"))} – {APP_NAME}</title><meta name="theme-color" content="{THEME}">'
            f'<style>:root{{--bg:{BACKGROUND};--fg:#17191c;--ac:{THEME};--mut:#5d6470}}@media (prefers-color-scheme:dark){{:root{{--bg:#101214;--fg:#e9ecef;--ac:#82a7d4;--mut:#98a0ab}}}}'
            'body{margin:0;min-height:100vh;display:grid;place-items:center;background:var(--bg);color:var(--fg);font:16px/1.5 Barlow,"Segoe UI",system-ui,sans-serif}'
            'main{max-width:30em;padding:24px 16px}h1{font-family:"Barlow Condensed","Arial Narrow",sans-serif;font-size:2rem;margin:0 0 8px}p{color:var(--mut)}'
            'a{display:inline-flex;min-height:44px;align-items:center;padding:0 18px;background:var(--ac);color:#fff;text-decoration:none;font-weight:600}a:focus-visible{outline:2px solid var(--fg);outline-offset:2px}</style></head>'
            f'<body><main><p>{APP_NAME}</p><h1>{esc(t.get("pwa_offline_h", "Offline"))}</h1><p>{esc(t.get("pwa_offline_p", ""))}</p>'
            f'<a href="{esc(urlparse(base).path.rstrip("/") + path_of(lang))}">{esc(t.get("pwa_retry", "Retry"))}</a></main></body></html>')


def head_tags(base, lang):
    """Nur auf den App-Seiten: Manifest des App-Pfads und Farben fuer die installierte App."""
    u = base.rstrip("/") + path_of(lang)
    return (f'<link rel="manifest" href="{u}manifest.webmanifest"><meta name="theme-color" content="{THEME}">'
            f'<meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-capable" content="yes">'
            f'<meta name="apple-mobile-web-app-title" content="Contributor"><link rel="stylesheet" href="{base}/assets/mvp-tracker.css">')


def build(g):
    """g: BASE, write, page, header, footer, community_tags, COMMUNITY_API, CI (community_i18n), langs (Sprachen der Community-Seiten)."""
    BASE, write, page, header, footer, ci = g["BASE"], g["write"], g["page"], g["header"], g["footer"], g["CI"]
    out = []
    for lang in g["langs"]:
        t = strings(ci, lang)
        rel = path_of(lang).lstrip("/")
        url = BASE.rstrip("/") + path_of(lang)
        cfg = json.dumps({"api": g["COMMUNITY_API"], "base": BASE, "lang": lang}, ensure_ascii=False).replace("</", "<\\/")
        body = (f'{header(lang, "")}<main class="wrap mvp-page"><h1>{esc(t.get("page_title", "MVP Tracker"))}</h1><div id="mvp-app"></div></main>{footer(lang)}'
                f'{g["community_tags"](lang)}<script>window.M365X={cfg}</script><script defer src="{BASE}/assets/mvp-tracker.js"></script>')
        write(rel + "index.html", page(lang, f'{t.get("page_title", "MVP Tracker")} – {APP_NAME}', t.get("page_desc", ""), url, body,
                                       og_type="website", extra_head=head_tags(BASE, lang), noindex=True, share=False))
        write(rel + "manifest.webmanifest", json.dumps(manifest(BASE, lang, ci), ensure_ascii=False, indent=1))
        write(rel + "sw.js", service_worker(BASE, lang))
        write(rel + "offline.html", offline_html(BASE, lang, ci))
        out.append(url)
    return out
