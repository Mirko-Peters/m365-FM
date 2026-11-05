"""Google AdSense (seit 5.11.2026 abgeschaltet: data/adsense.json enabled false; bis 22.01.2027 nur eigene M365Con-Banner).
Urspruenglich: Alles ist abgeschaltet, bis data/adsense.json eine Publisher-ID enthaelt und die Seite
unter der eingetragenen Domain (www.m365.fm) ausgeliefert wird. Dann:
- ads.txt im Wurzelverzeichnis, <meta name="google-adsense-account">, adsbygoogle.js im <head>
- feste Anzeigenbloecke (mit reserviertem Platz, Kennzeichnung "Anzeige") nur auf ausreichend langen Inhaltsseiten,
  nie auf Community-, Rechts-, Login- oder noindex-Seiten, nie ueber dem ersten Textabschnitt
- Einwilligung fuer EWR/UK/CH: laeuft ueber die in AdSense eingerichtete Google-Nachricht (zertifizierte CMP, "Datenschutz und Mitteilungen")."""
import hashlib, json, os, re
from html import escape
from pathlib import Path

CFG_FILE = Path(__file__).parent / "data" / "adsense.json"
LABEL = {"de": "Anzeige", "en": "Advertisement", "es": "Publicidad", "fr": "Publicité", "it": "Pubblicità", "pt": "Publicidade", "nl": "Advertentie", "pl": "Reklama"}
CSS = (".ad{margin:2rem auto;max-width:50rem;padding:.8rem 1rem 1rem;border:1px solid var(--bd,#1412101f);border-radius:14px;background:var(--card,transparent);text-align:center;min-height:280px;clear:both}"
       ".ad small{display:block;font:600 .7rem system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:var(--mut,#6b645c);margin-bottom:.5rem}"
       ".ad ins{display:block;min-height:250px}"
       # Leerer Block (AdSense meldet unfilled, z. B. nach spaeter Einwilligung im EWR): nicht zusammenklappen - das verschiebt alles darunter (CLS).
       # Stattdessen behaelt der Block seine Hoehe und zeigt den eigenen Hinweis auf die Sponsor-Seite.
       ".ad .ad-house{display:none}.ad:has(ins[data-ad-status=unfilled]) ins{display:none}"
       ".ad:has(ins[data-ad-status=unfilled]) .ad-house{display:flex;min-height:250px;flex-direction:column;align-items:center;justify-content:center;gap:.4rem;text-decoration:none;color:var(--fg,#17191c)}"
       ".ad-house b{font-size:1.15rem}.ad-house span{color:var(--mut,#6b645c);font-size:.95rem}")
CSS += (".ad-con{background:linear-gradient(135deg,#0b2a3c,#0e4a5e);color:#fff!important;border-radius:10px;padding:1.2rem}"
        ".ad-con b{color:#fff}.ad-con span{color:#d7f1f7!important}.ad-con em{font-style:normal;font-weight:700;background:#f5b041;color:#0b2a3c;"
        "border-radius:999px;padding:.35rem .9rem;margin-top:.3rem}"
        ".ad-svc em{font-style:normal;font-weight:700;background:var(--ac,#b4233c);color:#fff;border-radius:999px;padding:.35rem .9rem;margin-top:.3rem}"
        ".ad.ad-own{min-height:0}.ad-own .ad-house{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.4rem;text-decoration:none}")


def cfg():
    try:
        return json.loads(CFG_FILE.read_text("utf-8"))
    except Exception:
        return {}


def active(base):
    c = cfg()
    if c.get("enabled") is False:   # Hauptschalter in data/adsense.json: aus = kein Meta-Tag, keine ads.txt, kein Skript, keine Bloecke
        return False
    pub = (c.get("publisher") or "").strip()
    host = base.split("//")[-1].strip("/")
    return bool(re.fullmatch(r"pub-\d{10,20}", pub)) and host == (c.get("domain") or "")


def status(base):
    c = cfg(); pub = (c.get("publisher") or "").strip(); host = base.split("//")[-1].strip("/")
    return {"publisher_set": bool(pub), "publisher_valid": bool(re.fullmatch(r"pub-\d{10,20}", pub)), "domain": c.get("domain"), "serving_host": host, "active": active(base)}


def ads_txt(base):
    if not active(base):
        return None
    pub = cfg()["publisher"].replace("pub-", "")
    return f"google.com, pub-{pub}, DIRECT, f08c47fec0942fa0\n"


def eligible(base, body, canonical, noindex=False, need_ads=True):
    """Seite darf Werbung zeigen: indexierbar, keine Community-/Rechts-/Live-Seite, genug Text. Die Startseite zaehlt mit (AdSense prueft dort die Website).
    need_ads=False: dieselben Regeln fuer die eigenen Banner, auch wenn AdSense aus ist."""
    if (need_ads and not active(base)) or noindex:
        return False
    c = cfg(); path = canonical.replace(base, "") or "/"
    if path in ("/", ""):
        return True
    if any(s in path for s in c.get("skip_paths", [])):
        return False
    return len(re.sub(r"<[^>]+>", "", body)) >= int(c.get("min_chars", 2500))


def head(base, body="", canonical="", noindex=False):
    """Meta-Tag (immer, fuer die AdSense-Pruefung). Das Skript laedt standardmaessig nur auf Seiten, auf denen wir selbst einen Anzeigenblock gesetzt haben (feste Bloecke:
    keine Auto-Anzeigen wie das Popup 'Discover more' ueber dem Header). Mit "auto_ads": true in data/adsense.json laedt es wie frueher auf allen geeigneten Seiten."""
    if not active(base):
        return ""
    pub = cfg()["publisher"]
    out = f'<meta name="google-adsense-account" content="ca-{pub}">'
    load = eligible(base, body, canonical, noindex) if cfg().get("auto_ads") else 'class="adsbygoogle"' in body
    if load:
        out += f'<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-{pub}" crossorigin="anonymous"></script>'
    return out


# Mirko, 5.11.2026: freie (von AdSense nicht gefuellte) Werbeplaetze bewerben bis einschliesslich 22.01.2027 die M365Con 2027.
# Reines HTML/CSS-Banner ohne Bild (kein fremder Bildhost, kein Layoutsprung); danach wieder der Hinweis auf die Sponsor-Seite.
CON_UNTIL = "2027-01-22"
CON_URL = "https://m365con.net/?utm_source=m365.fm&utm_medium=house_ad&utm_campaign=m365con2027"
CON_TXT = {
    "en": ("M365Con 2027 – free online Microsoft conference", "Jan 11–22, 2027 · 120+ sessions from the Microsoft community · Register free"),
    "de": ("M365Con 2027 – kostenlose Online-Konferenz rund um Microsoft", "11.–22. Januar 2027 · über 120 Sessions aus der Community · Kostenlos anmelden"),
    "es": ("M365Con 2027 – conferencia online gratuita sobre Microsoft", "11–22 de enero de 2027 · más de 120 sesiones de la comunidad · Inscripción gratuita"),
    "fr": ("M365Con 2027 – conférence Microsoft en ligne et gratuite", "11–22 janvier 2027 · plus de 120 sessions de la communauté · Inscription gratuite"),
    "it": ("M365Con 2027 – conferenza online gratuita su Microsoft", "11–22 gennaio 2027 · oltre 120 sessioni della community · Iscrizione gratuita"),
    "pt": ("M365Con 2027 – conferência online gratuita sobre Microsoft", "11–22 de janeiro de 2027 · mais de 120 sessões da comunidade · Inscrição gratuita"),
    "nl": ("M365Con 2027 – gratis online Microsoft-conferentie", "11–22 januari 2027 · ruim 120 sessies uit de community · Gratis aanmelden"),
    "pl": ("M365Con 2027 – bezpłatna konferencja online o Microsoft", "11–22 stycznia 2027 · ponad 120 sesji społeczności · Bezpłatna rejestracja"),
}


def _house(base, lang, today=None):
    """Eigener Hinweis fuer einen leer gebliebenen Block (nur sichtbar bei data-ad-status=unfilled): bis CON_UNTIL das
    M365Con-Banner, danach der Hinweis auf die Sponsor-Seite."""
    if con_running(today):
        h, sub = CON_TXT.get(lang, CON_TXT["en"])
        cta = sub.rsplit(" · ", 1)[-1]
        return (f'<a class="ad-house ad-con" href="{escape(CON_URL)}" rel="noopener"><b>{escape(h)}</b>'
                f'<span>{escape(sub.rsplit(" · ", 1)[0])}</span><em>{escape(cta)}</em></a>')
    import site_sponsor as SPN
    return (f'<a class="ad-house" href="{escape(SPN.url(base, lang))}"><b>{escape(SPN.label(lang))}</b>'
            f'<span>{escape(SPN.tx(lang if lang in SPN.LANGS_ALL else "en", "h1"))}</span></a>')


def _block(lang, slot, pub, base=""):
    return (f'<aside class="ad" aria-label="{escape(LABEL.get(lang, LABEL["en"]))}"><small>{escape(LABEL.get(lang, LABEL["en"]))}</small>'
            f'<ins class="adsbygoogle" data-ad-client="ca-{pub}" data-ad-slot="{escape(slot)}" data-ad-format="auto" data-full-width-responsive="true"></ins>'
            + _house(base, lang) + '<script>(adsbygoogle=window.adsbygoogle||[]).push({});</script></aside>')


def con_running(today=None):
    from datetime import date
    return (today or date.today().isoformat()) <= CON_UNTIL


def css_needed(base, today=None):
    return True   # ohne AdSense stehen immer eigene Banner (Services, bis 22.01.2027 auch die M365Con)


# Mirko, 5.11.2026: an den freien Plaetzen auch die eigenen Services bewerben (Hub /services/: Sponsoring, Live-Session, Profile ...).
SVC_CTA = {"en": "View services", "de": "Services ansehen", "es": "Ver servicios", "fr": "Voir les services", "it": "Scopri i servizi",
           "pt": "Ver serviços", "nl": "Bekijk de services", "pl": "Zobacz usługi"}


def _svc(base, lang):
    """Banner fuer den Service-Hub; Titel und Text kommen aus site_landing_copy (dieselben Uebersetzungen wie die Hub-Seite)."""
    import site_landing as L
    lg = lang if lang in L.LANGS_ALL else "en"
    h = L._text(lg, L.C.HUB["h1"])
    lead = L._text(lg, L.C.HUB["lead"]).split(". ")[0].rstrip(".") + "."
    return (f'<a class="ad-house ad-svc" href="{escape(L.hub_url(base, lg))}"><b>{escape(h)}</b><span>{escape(lead)}</span>'
            f'<em>{escape(SVC_CTA.get(lang, SVC_CTA["en"]))}</em></a>')


def _own_block(inner, lang):
    """Eigenes Banner ohne Google-Skript und ohne reservierte Anzeigenhoehe."""
    return (f'<aside class="ad ad-own" aria-label="{escape(LABEL.get(lang, LABEL["en"]))}"><small>{escape(LABEL.get(lang, LABEL["en"]))}</small>'
            + inner + '</aside>')


def _con_block(lang, base="", today=None):
    return _own_block(_house(base, lang, today), lang)


def inject(base, body, lang, canonical, noindex=False, today=None):
    """Fuegt hoechstens zwei Bloecke ein: einen nach dem 2. Abschnitt (<h2>), einen vor dem Footer.
    AdSense aus (Mirko, 5.11.2026): nur eigene Banner - in der Mitte bis CON_UNTIL die M365Con, vor dem Footer die Services."""
    if noindex:
        return body
    ads = active(base)
    c = cfg()
    path = canonical.replace(base, "") or "/"
    if path in ("/", "") or not eligible(base, body, canonical, noindex, need_ads=ads):
        return body
    if not ads:   # #281: eigene, buchbare Werbeplaetze mit Hausanzeigen als Rueckfall
        return inject_slots(base, body, lang, canonical, today)
    slots = c.get("slots", {})
    pub = c.get("publisher", "")
    own = {"con": lambda: _con_block(lang, base, today), "svc": lambda: _own_block(_svc(base, lang), lang)}
    mk = (lambda slot: _block(lang, slot, pub, base)) if ads else (lambda slot: own[slot]())
    if slots.get("mid"):
        # nur im Textbereich: bei Seiten mit Sidebar bis zum Beginn der Sidebar, sonst im <main>; so landet der Block nie in der Sidebar oder im Header
        a = body.find('class="shmain"'); a = body.find("<main") if a < 0 else a
        z = body.find('<aside class="sbar"', a) if a >= 0 else -1
        z = body.find("</main>", a) if z < 0 and a >= 0 else z
        if a >= 0 and z > a:
            region = body[a:z]; parts = re.split(r"(?=<h2\b)", region)
            if len(parts) > 3:   # Einleitung + mindestens zwei Abschnitte davor
                parts.insert(3, mk(slots["mid"]))
                body = body[:a] + "".join(parts) + body[z:]
    if slots.get("end") and "<footer>" in body:
        body = body.replace("<footer>", mk(slots["end"]) + "<footer>", 1)
    return body



# ---------------------------------------------------------------- #281 Buchbare Werbeplaetze
# Drei Plaetze mit fester Groesse (kein Layoutsprung): oben unter dem Header (728x90, mobil 320x100), Mitte im Text (300x250),
# unten vor dem Footer (728x90 / 320x100). Im HTML steht immer die Hausanzeige; assets/ads.js fragt den Worker (/api/ads/serve),
# sobald der Platz in die Naehe des Sichtbereichs kommt, und ersetzt sie nur, wenn eine bezahlte und freigegebene Kampagne passt.
# Gezaehlt wird im Worker beim Ausliefern, ohne Cookies und ohne Fremd-Tracker.
SLOT_CFG = Path(__file__).parent / "data" / "ad_slots.json"
I18N_FILE = Path(__file__).parent / "data" / "ads_i18n.json"
API = os.environ.get("COMMUNITY_API", "https://api-dub.m365.fm")
_LANG_RX = re.compile(r"^/(de|es|fr|it|pt|nl|pl|id|ru|uk|ar|he|ja|ko)/")
_I18N = None


def i18n():
    global _I18N
    if _I18N is None:
        try:
            _I18N = {k: v for k, v in json.loads(I18N_FILE.read_text("utf-8")).items() if not k.startswith("_")}
        except Exception:
            _I18N = {}
    return _I18N


def texts(lang, part):
    """Texte eines Bereichs (slot | book) in der Sprache, je Schluessel Rueckfall auf Englisch."""
    d = i18n()
    return {**d.get("en", {}).get(part, {}), **d.get(lang, {}).get(part, {})}


def slot_cfg():
    try:
        return json.loads(SLOT_CFG.read_text("utf-8"))
    except Exception:
        return {}


def page_type(base, canonical):
    """Seitentyp fuer Preise und Auslieferung: episode (Show-Folgen), lang (Sprachseiten), entity (Themen), blog, other."""
    path = canonical.replace(base, "") or "/"
    if re.match(r"^/show/episodes/[^/]+/", path):
        return "episode"
    if re.match(r"^/(?:[a-z]{2}/)?entity/[^/]+/", path):
        return "entity"
    if re.match(r"^/(?:[a-z]{2}/)?(?:community/)?blog/", path):
        return "blog"
    if _LANG_RX.match(path) and not re.match(r"^/[a-z]{2}/(?:community|services|for|i-want-to|sponsor|media-kit)/", path):
        return "lang"
    return "other"


def page_topics(base, canonical, body, limit=12):
    """Themen der Seite = verlinkte Entitaeten (bei Entitaetsseiten zuerst die eigene). Fuer Firmenkarte und Lead-Formular."""
    out = []
    m = re.match(r"^/(?:[a-z]{2}/)?entity/([a-z0-9][a-z0-9-]{1,79})/", canonical.replace(base, ""))
    if m:
        out.append(m.group(1))
    for t in re.findall(r'/entity/([a-z0-9][a-z0-9-]{1,79})/', body):
        if t not in out:
            out.append(t)
        if len(out) >= limit:
            break
    return out


def advertise_url(base, lang):
    return f"{base}/{'' if lang == 'en' else lang + '/'}for/advertisers/"


def _adv_house(base, lang):
    t = texts(lang, "slot")
    return (f'<a class="ad-house ad-adv" href="{escape(advertise_url(base, lang))}"><b>{escape(t["adv_h"])}</b>'
            f'<span>{escape(t["adv_p"])}</span><em>{escape(t["adv_cta"])}</em></a>')


SLOT_CSS = (
    ".ad-slot{min-height:0;padding:.45rem .75rem .75rem}.ad-slot>small{margin-bottom:.35rem}"
    ".ad-box{position:relative;margin:0 auto;height:100px;max-width:728px;overflow:hidden;display:flex;align-items:center;justify-content:center}"
    "@media(min-width:768px){.ad-box{height:90px}}"
    ".ad-mid .ad-box{height:250px;max-width:none}"
    ".ad-slot .ad-house{display:flex;width:100%;height:100%;box-sizing:border-box;flex-direction:column;align-items:center;justify-content:center;gap:.3rem;text-decoration:none;color:var(--fg,#17191c);padding:.4rem .8rem;border-radius:10px}"
    ".ad-top .ad-house,.ad-bottom .ad-house{gap:.15rem}.ad-top .ad-house b,.ad-bottom .ad-house b{font-size:1rem}"
    ".ad-top .ad-house span,.ad-bottom .ad-house span{display:none}"
    "@media(min-width:768px){.ad-top .ad-house,.ad-bottom .ad-house{flex-direction:row;gap:1rem}.ad-top .ad-house span,.ad-bottom .ad-house span{display:block;font-size:.85rem;max-width:26em;text-align:start}}"
    ".ad-top .ad-house em,.ad-bottom .ad-house em{margin-top:0;padding:.25rem .8rem}"
    ".ad-adv{background:var(--card,transparent);border:1px dashed var(--bd,#1412101f)}.ad-adv em{font-style:normal;font-weight:700;background:var(--ac,#b4233c);color:#fff;border-radius:999px;padding:.35rem .9rem;margin-top:.3rem}"
    ".ad-bn{display:block;line-height:0}.ad-bn img{display:block;max-width:100%;height:auto}"
    ".ad-card{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.5rem;width:100%;max-width:340px;height:100%;text-align:center}"
    ".ad-card img{width:56px;height:56px;border-radius:10px;object-fit:cover}.ad-card b{font-size:1.1rem}.ad-card p{margin:0;color:var(--mut,#6b645c);font-size:.92rem}"
    ".ad-card .btn{margin-top:.2rem}"
    ".ad-dlg{max-width:30rem;width:calc(100vw - 32px);border:1px solid var(--bd,#ccc);border-radius:14px;padding:1.2rem;background:var(--bg,#fff);color:var(--fg,#17191c)}"
    ".ad-dlg::backdrop{background:#0008}.ad-dlg form{display:grid;gap:.6rem}.ad-dlg label{display:grid;gap:.2rem;font-size:.92rem}"
    ".ad-dlg input,.ad-dlg textarea{font:inherit;padding:.5rem;border:1px solid var(--bd,#ccc);border-radius:8px;background:var(--card,#fff);color:inherit}"
    ".ad-dlg .ad-ck{display:flex;gap:.5rem;align-items:flex-start}.ad-dlg .ad-ck input{margin-top:.25rem}"
    ".ad-dlg .ad-x{position:absolute;inset-inline-end:.6rem;top:.4rem;background:none;border:0;font-size:1.4rem;cursor:pointer;color:inherit}"
    ".ad-dlg [role=status]{min-height:1.2em;margin:0}"
)
CSS += SLOT_CSS


def _slot(name, lang, pt, topics, house):
    t = texts(lang, "slot")
    lab = escape(t["label"])
    return (f'<aside class="ad ad-own ad-slot ad-{name}" data-ad-slot="{name}" data-pt="{pt}" data-topics="{escape(",".join(topics))}" aria-label="{lab}">'
            f'<small>{lab}</small><div class="ad-box">{house}</div></aside>')


def slot_script(base, lang):
    """Konfiguration (Texte der Sprache) und das kleine Lade-Skript; nur auf Seiten mit Werbeplatz."""
    t = texts(lang, "slot")
    priv = f"{base}/{'datenschutz' if lang == 'de' else 'privacy'}/"
    cfg = json.dumps({"api": API, "lang": lang, "t": t, "privacy": priv}, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")
    p = Path(__file__).parent / "assets" / "ads.js"
    v = hashlib.sha1(p.read_bytes()).hexdigest()[:10] if p.exists() else "0"
    return f'<script>window.M365AD={cfg}</script><script defer src="{base}/assets/ads.js?v={v}"></script>'


def inject_slots(base, body, lang, canonical, today=None):
    """Oben unter dem Header, Mitte nach dem ersten Drittel des Textes (nach dem 2. Abschnitt), unten vor dem Footer.
    Rueckfall: oben Hinweis auf die Werbeplaetze, Mitte M365Con (bis 22.01.2027) bzw. Sponsor-Seite, unten Services."""
    cfg = slot_cfg()
    if cfg.get("enabled") is False:
        mid = _con_block(lang, base, today) if con_running(today) else ""
        return _place_mid(body, mid).replace("<footer>", _own_block(_svc(base, lang), lang) + "<footer>", 1) if "<footer>" in body else body
    on = cfg.get("slots") or {"top": True, "mid": True, "bottom": True}
    pt = page_type(base, canonical)
    topics = page_topics(base, canonical, body)
    placed = False
    if on.get("mid", True):
        new = _place_mid(body, _slot("mid", lang, pt, topics, _house(base, lang, today)))
        placed = new != body
        body = new
    if on.get("top", True):
        i = body.find("<main")
        if i >= 0:
            body = body[:i] + _slot("top", lang, pt, topics, _adv_house(base, lang)) + body[i:]
            placed = True
    if on.get("bottom", True) and "<footer>" in body:
        body = body.replace("<footer>", _slot("bottom", lang, pt, topics, _svc(base, lang)) + "<footer>", 1)
        placed = True
    if placed:
        body = body.replace("</body>", slot_script(base, lang) + "</body>", 1) if "</body>" in body else body + slot_script(base, lang)
    return body


def _place_mid(body, block):
    """Mittlerer Platz nur im Textbereich: nach dem 2. Abschnitt (<h2>), nie in Sidebar oder Header."""
    if not block:
        return body
    a = body.find('class="shmain"'); a = body.find("<main") if a < 0 else a
    z = body.find('<aside class="sbar"', a) if a >= 0 else -1
    z = body.find("</main>", a) if z < 0 and a >= 0 else z
    if a >= 0 and z > a:
        region = body[a:z]; parts = re.split(r"(?=<h2\b)", region)
        if len(parts) > 3:
            parts.insert(3, block)
            return body[:a] + "".join(parts) + body[z:]
    return body
