"""Google AdSense (seit 5.11.2026 abgeschaltet: data/adsense.json enabled false; bis 22.01.2027 nur eigene M365Con-Banner).
Urspruenglich: Alles ist abgeschaltet, bis data/adsense.json eine Publisher-ID enthaelt und die Seite
unter der eingetragenen Domain (www.m365.fm) ausgeliefert wird. Dann:
- ads.txt im Wurzelverzeichnis, <meta name="google-adsense-account">, adsbygoogle.js im <head>
- feste Anzeigenbloecke (mit reserviertem Platz, Kennzeichnung "Anzeige") nur auf ausreichend langen Inhaltsseiten,
  nie auf Community-, Rechts-, Login- oder noindex-Seiten, nie ueber dem ersten Textabschnitt
- Einwilligung fuer EWR/UK/CH: laeuft ueber die in AdSense eingerichtete Google-Nachricht (zertifizierte CMP, "Datenschutz und Mitteilungen")."""
import json, re
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
    slots = c.get("slots", {}) if ads else {"mid": "con" if con_running(today) else "", "end": "svc"}
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
