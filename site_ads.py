"""Google AdSense (seit 5.11.2026 abgeschaltet: data/adsense.json enabled false; bis 22.01.2027 nur eigene M365Con-Banner).
Urspruenglich: Alles ist abgeschaltet, bis data/adsense.json eine Publisher-ID enthaelt und die Seite
unter der eingetragenen Domain (www.m365.fm) ausgeliefert wird. Dann:
- ads.txt im Wurzelverzeichnis, <meta name="google-adsense-account">, adsbygoogle.js im <head>
- feste Anzeigenbloecke (mit reserviertem Platz, Kennzeichnung "Anzeige") nur auf ausreichend langen Inhaltsseiten,
  nie auf Community-, Rechts-, Login- oder noindex-Seiten, nie ueber dem ersten Textabschnitt
- Einwilligung fuer EWR/UK/CH: laeuft ueber die in AdSense eingerichtete Google-Nachricht (zertifizierte CMP, "Datenschutz und Mitteilungen")."""
import hashlib, json, os, re
from site_i18n import T
from html import escape
from urllib.parse import urlencode
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
    # #281: weitere Sprachen der Website (maschinell uebersetzt, noch nicht geprueft)
    "id": ("M365Con 2027 – konferensi Microsoft online gratis", "11–22 Januari 2027 · 120+ sesi dari komunitas Microsoft · Daftar gratis"),
    "ru": ("M365Con 2027 – бесплатная онлайн-конференция о Microsoft", "11–22 января 2027 г. · более 120 сессий от сообщества · Бесплатная регистрация"),
    "uk": ("M365Con 2027 – безкоштовна онлайн-конференція про Microsoft", "11–22 січня 2027 р. · понад 120 сесій від спільноти · Безкоштовна реєстрація"),
    "ar": ("M365Con 2027 – مؤتمر Microsoft مجاني عبر الإنترنت", "11–22 يناير 2027 · أكثر من 120 جلسة من مجتمع Microsoft · سجّل مجانًا"),
    "he": ("M365Con 2027 – כנס Microsoft מקוון בחינם", "11–22 בינואר 2027 · יותר מ‑120 מפגשים מקהילת Microsoft · הרשמה בחינם"),
    "ja": ("M365Con 2027 – 無料のオンライン Microsoft カンファレンス", "2027年1月11日～22日 · コミュニティによる120以上のセッション · 無料で登録"),
    "ko": ("M365Con 2027 – 무료 온라인 Microsoft 콘퍼런스", "2027년 1월 11–22일 · 커뮤니티 세션 120개 이상 · 무료 등록"),
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
           "pt": "Ver serviços", "nl": "Bekijk de services", "pl": "Zobacz usługi",
           "id": "Lihat layanan", "ru": "Смотреть услуги", "uk": "Переглянути послуги", "ar": "عرض الخدمات", "he": "לשירותים", "ja": "サービスを見る", "ko": "서비스 보기"}
# #281: Titel und Satz des Services-Banners in allen 15 Sprachen (en/de gepflegt, die anderen maschinell uebersetzt und ungeprueft);
# vorher aus site_landing_copy ueber die Worker-Uebersetzung - die fehlte fuer noch nicht uebersetzte Sprachen.
SVC_TXT = {
    "en": ("M365.FM services", "Sponsorship, expert profiles, podcast pages and event tools for the Microsoft 365 community."),
    "de": ("M365.FM Services", "Sponsoring, Expertenprofile, Podcastseiten und Event-Funktionen für die Microsoft-365-Community."),
    "es": ("Servicios de M365.FM", "Patrocinio, perfiles de expertos, páginas de pódcast y herramientas para eventos de la comunidad de Microsoft 365."),
    "fr": ("Services M365.FM", "Sponsoring, profils d’experts, pages de podcast et outils d’événements pour la communauté Microsoft 365."),
    "it": ("Servizi di M365.FM", "Sponsorizzazioni, profili di esperti, pagine podcast e strumenti per eventi per la community di Microsoft 365."),
    "pt": ("Serviços da M365.FM", "Patrocínio, perfis de especialistas, páginas de podcast e ferramentas de eventos para a comunidade Microsoft 365."),
    "nl": ("Services van M365.FM", "Sponsoring, expertprofielen, podcastpagina’s en eventtools voor de Microsoft 365-community."),
    "pl": ("Usługi M365.FM", "Sponsoring, profile ekspertów, strony podcastów i narzędzia wydarzeń dla społeczności Microsoft 365."),
    "id": ("Layanan M365.FM", "Sponsor, profil pakar, halaman podcast, dan alat acara untuk komunitas Microsoft 365."),
    "ru": ("Услуги M365.FM", "Спонсорство, профили экспертов, страницы подкастов и инструменты для мероприятий сообщества Microsoft 365."),
    "uk": ("Послуги M365.FM", "Спонсорство, профілі експертів, сторінки подкастів та інструменти для подій спільноти Microsoft 365."),
    "ar": ("خدمات M365.FM", "الرعاية وملفات الخبراء وصفحات البودكاست وأدوات الفعاليات لمجتمع Microsoft 365."),
    "he": ("השירותים של M365.FM", "חסויות, פרופילי מומחים, דפי פודקאסט וכלי אירועים לקהילת Microsoft 365."),
    "ja": ("M365.FM のサービス", "Microsoft 365 コミュニティ向けのスポンサーシップ、専門家プロフィール、ポッドキャストページ、イベント機能。"),
    "ko": ("M365.FM 서비스", "Microsoft 365 커뮤니티를 위한 스폰서십, 전문가 프로필, 팟캐스트 페이지, 이벤트 도구."),
}


def _svc(base, lang):
    """Banner fuer den Service-Hub (/services/) in der Sprache der Seite."""
    import site_landing as L
    lg = lang if lang in L.LANGS_ALL else "en"
    h, lead = SVC_TXT.get(lg, SVC_TXT["en"])
    return (f'<a class="ad-house ad-svc" href="{escape(L.hub_url(base, lg))}"><b>{escape(h)}</b><span>{escape(lead)}</span>'
            f'<em>{escape(SVC_CTA.get(lg, SVC_CTA["en"]))}</em></a>')


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
    if not ads and slot_cfg().get("enabled") is not False:   # #281: eigene Werbeplaetze mit eigenen Regeln (slot_eligible)
        return inject_slots(base, body, lang, canonical, today) if slot_eligible(base, body, canonical, noindex) else body
    if path in ("/", "") or not eligible(base, body, canonical, noindex, need_ads=ads):
        return body
    if not ads:   # Werbeplaetze ausgeschaltet (data/ad_slots.json enabled false): nur die bisherigen eigenen Banner
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


def go_link(code, query=""):
    """Zaehl-Link des Workers. Mit GO_BASE (z. B. https://c.m365.fm, nur ein reiner https-Ursprung): Kurzform <GO_BASE>/<code>?...;
    ohne GO_BASE (offline-Bau, Tests, Notfall) die alte Form <API>/go/<code>?... - beide gelten im Worker. GO_BASE setzt der Seitenbau
    (Repo-Variable GO_BASE im Workflow site.yml) erst, wenn der Worker die Kurzdomain ausliefert."""
    base = (os.environ.get("GO_BASE") or "").strip().rstrip("/")
    q = f"?{query}" if query else ""
    return f"{base}/{code}{q}" if re.fullmatch(r"https://[a-z0-9]([a-z0-9.-]*[a-z0-9])?", base) else f"{API}/go/{code}{q}"
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


def booking_on():
    """Schalter (Mirko, 5.11.2026): bis PayPal getestet ist, nur eigene Werbung. data/ad_slots.json "booking" (Standard aus);
    im Worker gilt dazu ADS_BOOKING. Aus: keine bezahlten Kampagnen, keine Buchung, /for/advertisers/ noindex und nicht verlinkt."""
    return slot_cfg().get("booking") is True


DEFAULT_SKIP = ["/community/", "/seo/", "/callback/", "/login/", "/account/", "/admin/", "/impressum/", "/datenschutz/", "/privacy/", "/legal/",
                "/accessibility/", "/live/", "/404.html", "/sponsor/", "/services/", "/for/", "/i-want-to/", "/media-kit/", "/m365con/sponsor/"]
DEFAULT_ALLOW = [r"^/(?:[a-z]{2}/)?community/u/[^/]+/blog/[^/]+/$"]   # Blogbeitraege liegen unter /community/, sind aber Inhaltsseiten


def slot_eligible(base, body, canonical, noindex=False):
    """Werbeplaetze nur auf Inhaltsseiten: indexierbar, nicht werbefrei (Liste skip_paths, Ausnahmen allow_patterns in data/ad_slots.json)
    und mit mindestens einer verlinkten Entitaet (Thema); Entitaetsseiten selbst zaehlen immer. Kurze Seiten bekommen weniger Plaetze."""
    if noindex:
        return False
    sc = slot_cfg()
    path = canonical.replace(base, "") or "/"
    if path in ("/", ""):
        return False
    allowed = any(re.match(p, path) for p in sc.get("allow_patterns", DEFAULT_ALLOW))
    if not allowed and any(x in path for x in sc.get("skip_paths", DEFAULT_SKIP)):
        return False
    return bool(page_topics(base, canonical, body))   # Entitaet ist Pflicht; die Textlaenge bestimmt nur die Zahl der Plaetze


def page_type(base, canonical):
    """Seitentyp fuer Preise und Auslieferung: episode (Show-Folgen), lang (Sprachseiten), entity (Themen), blog, other."""
    path = canonical.replace(base, "") or "/"
    if re.match(r"^/show/episodes/[^/]+/", path):
        return "episode"
    if re.match(r"^/(?:[a-z]{2}/)?entity/[^/]+/", path):
        return "entity"
    if re.match(r"^/(?:[a-z]{2}/)?(?:community/u/[^/]+/|community/)?blog/", path):
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
    if not booking_on():   # Buchung aus: oben fuer die Sponsoring-Seite (Anfrageformular) werben
        import site_sponsor as SPN
        lg = lang if lang in SPN.LANGS_ALL else "en"
        return (f'<a class="ad-house ad-adv" href="{escape(SPN.url(base, lg))}"><b>{escape(SPN.label(lg))}</b>'
                f'<span>{escape(SPN.tx(lg, "h1"))}</span><em>{escape(SPN.tx(lg, "open_req"))}</em></a>')
    t = texts(lang, "slot")
    return (f'<a class="ad-house ad-adv" href="{escape(advertise_url(base, lang))}"><b>{escape(t["adv_h"])}</b>'
            f'<span>{escape(t["adv_p"])}</span><em>{escape(t["adv_cta"])}</em></a>')


SLOT_CSS = (
    ".ad-slot{min-height:0;padding:.45rem .75rem .75rem}.ad-slot>small{margin-bottom:.35rem}"
    ".ad-box{position:relative;margin:0 auto;height:100px;max-width:728px;overflow:hidden;display:flex;align-items:center;justify-content:center}"
    "@media(min-width:768px){.ad-box{height:90px}}"
    ".ad-mid .ad-box,.ad-mid2 .ad-box{height:250px;max-width:none}"
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


def page_slug(base, canonical):
    """Slug der Seite (letzter Pfadteil) fuer utm_content der Hausanzeigen; nur [a-z0-9-], hoechstens 80 Zeichen."""
    parts = [x for x in canonical.replace(base, "").split("/") if x]
    slug = re.sub(r"[^a-z0-9-]+", "-", (parts[-1] if parts else "home").lower()).strip("-")[:80].strip("-")
    return slug or "home"


def _track(house, key, slot, pt, lang, entity, slug):
    """Hausanzeige ueber den Go-Link des Workers: Klick cookiefrei zaehlen (je Platz, Seitentyp, Sprache, Land), dann 302 zum Ziel mit UTM
    (source m365.fm, medium house_ad, campaign je Hausanzeige, term = Haupt-Entitaet, content = Slug der Seite)."""
    q = {"s": slot, "pt": pt, "l": lang}
    if entity:
        q["e"] = entity
    if slug:
        q["p"] = slug
    go = go_link(f"h-{key}", urlencode(q))
    house = re.sub(r'href="[^"]*"', f'href="{escape(go)}"', house, count=1)
    head = house.split(">", 1)[0]
    if ' rel="' in head:
        house = house.replace(' rel="noopener"', ' rel="nofollow noopener"', 1)
    else:
        house = house.replace("<a ", '<a rel="nofollow" ', 1)
    return house


def _slot(name, lang, pt, topics, house, house_only=False, house_key="", slug=""):
    t = texts(lang, "slot")
    lab = escape(t["label"])
    if house_key:
        house = _track(house, house_key, name, pt, lang, topics[0] if topics else "", slug)
    return (f'<aside class="ad ad-own ad-slot ad-{name}" data-ad-slot="{name}" data-pt="{pt}" data-topics="{escape(",".join(topics))}"'
            f'{" data-house=" + chr(34) + house_key + chr(34) if house_key else ""}{" data-slug=" + chr(34) + escape(slug) + chr(34) if slug else ""}'
            f'{" data-ad-house=" + chr(34) + "1" + chr(34) if house_only else ""} aria-label="{lab}">'
            f'<small>{lab}</small><div class="ad-box">{house}</div></aside>')


def slot_script(base, lang):
    """Konfiguration (Texte der Sprache) und das kleine Lade-Skript; nur auf Seiten mit Werbeplatz."""
    t = texts(lang, "slot")
    priv = f"{base}/{'datenschutz' if lang == 'de' else 'privacy'}/"
    cfg = json.dumps({"api": API, "lang": lang, "t": t, "privacy": priv}, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")
    p = Path(__file__).parent / "assets" / "ads.js"
    v = hashlib.sha1(p.read_bytes()).hexdigest()[:10] if p.exists() else "0"
    return f'<script>window.M365AD={cfg}</script><script defer src="{base}/assets/ads.js?v={v}"></script>'


def sponsor_lead(base, lang, eid, name):
    """Lead-Formular eines laufenden Sponsors (data/sponsorships.json) auf der Firmen-Entitaetsseite: gekennzeichneter Kasten mit Button.
    Das Formular ist das bestehende Lead-Formular (assets/ads.js, POST /api/ads/lead); ads.js und Konfiguration kommen nur auf Seiten mit diesem Kasten."""
    t = texts(lang, "slot")
    btn = escape(t["contact"].replace("{org}", name))
    return (f'<section class="ad ad-own en-lead" role="note" data-pt="entity" style="border:1px solid var(--bd);border-inline-start:4px solid var(--ac,#0a5);background:var(--card);'
            f'padding:.6em .9em;border-radius:.4em;margin:.5em 0 .8em"><small><strong>{escape(T(lang, "Sponsored", "Anzeige"))}</strong></small><p style="margin:.3em 0 .5em">{escape(name)}</p>'
            f'<button type="button" class="btn main" data-sponsor-lead="{escape(eid)}" data-pt="entity">{btn}</button></section>') + slot_script(base, lang)


def inject_slots(base, body, lang, canonical, today=None):
    """Werbeplaetze (Mirko, 5.11.2026):
    - "mid": frueh im Text, direkt nach der Einleitung (nach dem ersten Absatz oder vor der ersten H2, was zuerst kommt; nie ueber H1/Lede,
      nie in Liste/Tabelle/Code) - Hausanzeige M365Con bis 22.01.2027, danach Sponsoring/"Hier werben".
    - "bottom": vor dem Footer - Services.
    - Nur auf langen Seiten (>= min_chars Text) zusaetzlich "top" unter dem Header ("Hier werben"/Sponsoring) und, wenn in data/ad_slots.json
      eingeschaltet und weit genug vom fruehen Platz entfernt, "mid2" nach dem ersten Drittel (nur Hausanzeige Services).
    Eingeschaltet/Seitenregeln: slot_eligible (Entitaet Pflicht, werbefreie Seiten nie)."""
    sc = slot_cfg()
    if sc.get("enabled") is False:
        mid = _con_block(lang, base, today) if con_running(today) else ""
        return _place_mid(body, mid).replace("<footer>", _own_block(_svc(base, lang), lang) + "<footer>", 1) if "<footer>" in body else body
    on = {"top": True, "mid": True, "mid2": False, "bottom": True, **(sc.get("slots") or {})}
    pt = page_type(base, canonical)
    topics = page_topics(base, canonical, body)
    long_page = len(re.sub(r"<[^>]+>", "", body)) >= int(sc.get("min_chars", cfg().get("min_chars", 2500)))
    slug = page_slug(base, canonical)
    adv_key = "advertise" if booking_on() else "sponsor"
    placed = False
    if on.get("mid"):
        con = con_running(today)
        early = _house(base, lang, today) if con else _adv_house(base, lang)
        new = _place_intro(body, _slot("mid", lang, pt, topics, early, house_key="m365con" if con else adv_key, slug=slug))
        placed = new != body
        body = new
    if long_page and on.get("mid2"):
        block = _slot("mid2", lang, pt, topics, _svc(base, lang), house_only=True, house_key="services", slug=slug)
        new = _place_mid(body, block)
        if new != body and _far_enough(new, int(sc.get("min_gap_chars", 1200))):
            body = new; placed = True
    if long_page and on.get("top"):
        i = body.find("<main")
        if i >= 0:
            body = body[:i] + _slot("top", lang, pt, topics, _adv_house(base, lang), house_key=adv_key, slug=slug) + body[i:]
            placed = True
    if on.get("bottom") and "<footer>" in body:
        body = body.replace("<footer>", _slot("bottom", lang, pt, topics, _svc(base, lang), house_key="services", slug=slug) + "<footer>", 1)
        placed = True
    if placed and "window.M365AD=" not in body:
        body = body.replace("</body>", slot_script(base, lang) + "</body>", 1) if "</body>" in body else body + slot_script(base, lang)
    return body


_BLOCKS = ("ul", "ol", "table", "pre", "code", "blockquote", "figure", "details", "dl", "aside")


def _region(body):
    """Textbereich: bei Seiten mit Sidebar bis zum Beginn der Sidebar, sonst das <main>."""
    a = body.find('class="shmain"'); a = body.find("<main") if a < 0 else a
    z = body.find('<aside class="sbar"', a) if a >= 0 else -1
    z = body.find("</main>", a) if z < 0 and a >= 0 else z
    return (a, z) if a >= 0 and z > a else (-1, -1)


def _depth_ok(html_before):
    """True, wenn die Stelle in keiner Liste, Tabelle, keinem Code-Block usw. liegt."""
    for t in _BLOCKS:
        if len(re.findall(rf"<{t}\b", html_before)) > len(re.findall(rf"</{t}>", html_before)):
            return False
    return True


def _place_intro(body, block):
    """Frueher Platz im Text: nach dem ersten Absatz oder vor der ersten <h2> (was zuerst kommt), hinter H1 und Lede."""
    a, z = _region(body)
    if a < 0:
        return body
    region = body[a:z]
    start = 0
    m = re.search(r"</h1>", region)
    if m:
        start = m.end()
        lede = re.match(r'\s*<p class="[^"]*\blede\b[^"]*"[^>]*>.*?</p>', region[start:], re.S)
        if lede:
            start += lede.end()
    for c in re.finditer(r"</p>|<h2\b", region[start:]):
        pos = start + (c.end() if c.group(0) == "</p>" else c.start())
        if _depth_ok(region[:pos]):
            return body[:a] + region[:pos] + block + region[pos:] + body[z:]
    return body


def _far_enough(body, gap):
    """Mindestabstand zwischen fruehem Platz und "mid2": mindestens zwei Abschnitte (<h2>) und gap Zeichen Text dazwischen."""
    i, j = body.find('data-ad-slot="mid"'), body.find('data-ad-slot="mid2"')
    if i < 0 or j < 0:
        return j >= 0
    between = body[i:j]
    return between.count("<h2") >= 2 and len(re.sub(r"<[^>]+>", "", between)) >= gap


def _place_mid(body, block):
    """Platz nach dem ersten Drittel: nach dem 2. Abschnitt (<h2>), nur im Textbereich, nie in Sidebar oder Header."""
    if not block:
        return body
    a, z = _region(body)
    if a >= 0:
        region = body[a:z]; parts = re.split(r"(?=<h2\b)", region)
        if len(parts) > 3:
            parts.insert(3, block)
            return body[:a] + "".join(parts) + body[z:]
    return body
