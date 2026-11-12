"""Suchintent-Titel und Meta-Descriptions fuer Community-Seiten (Profile, Firmen, Events, Verzeichnisse, MCP, Updates).

Reine Funktionen ohne Seitenbau: jede liefert (title, desc) oder None. None = Sprache nicht abgedeckt, das Modul behaelt dann seinen bisherigen Text.
Indexierbar sind diese Seiten heute nur auf Englisch (Profile, Firmen, Events, Verzeichnisse) bzw. Englisch und Deutsch (Gaeste, Updates);
deshalb gibt es feste Texte fuer en und de. Marke ' | M365.FM' haengt page() (seo_title) an: Titel hier ohne Marke, Ziel <= 52 Zeichen.
Regeln (Mirko, 12.11.2026): Suchbegriff vorne, keine erfundenen Fakten, jede Seite eigener Titel und eigene Beschreibung.
"""
import re

TITLE_MAX = 52      # + ' | M365.FM' (10 Zeichen) = 62, Grenze von seo_title
DESC_MAX = 155
LANGS = ("en", "de")

_BRACKET = re.compile(r"\s*\[[^\]]*\]\s*")
_SPACE = re.compile(r"\s+")


def _t(lang, en, de):
    return de if lang == "de" else en


def _clean(s):
    return _SPACE.sub(" ", s or "").strip()


def _cut(s, n):
    """Auf n Zeichen kuerzen: an Satzende, sonst Wortgrenze, ohne Auslassungszeichen mitten im Wort."""
    s = _clean(s)
    if len(s) <= n:
        return s
    c = s[:n]
    m = max(c.rfind(". "), c.rfind("! "), c.rfind("? "))
    if m >= n * 0.5:
        return c[:m + 1]
    return c[:n - 1].rsplit(" ", 1)[0].rstrip(",;:–—-|·") + "…"


def _fit(head, bits, tail, n=DESC_MAX):
    """head + bits + tail <= n Zeichen. bits = Liste ganzer Aussagen (jede endet mit Punkt), es kommen nur ganze Aussagen hinein, nie ein Schnitt.
    Ein einzelnes zu langes Stueck (z. B. Eventzusammenfassung) wird vorher mit _cut auf den verfuegbaren Platz gekuerzt."""
    head, tail = _clean(head), _clean(tail)
    out = [head]
    for b in bits:
        b = _clean(b)
        if b and len(" ".join(out + [b, tail])) <= n:
            out.append(b)
    out.append(tail)
    return _clean(" ".join(x for x in out if x)).replace("..", ".")


def person_name(name):
    """Anzeigename ohne Titel-Zusatz in eckigen Klammern ('Vesa Nopanen [MVP]' -> 'Vesa Nopanen')."""
    return _clean(_BRACKET.sub(" ", name or "")) or _clean(name)


def role_of(headline, n=46):
    """Erstes Stueck der Kurzvorstellung vor ' | ' (LinkedIn-Stil). Laenger als n Zeichen: leer (kein Schnitt mitten im Satz)."""
    first = _clean((headline or "").split("|")[0])
    return first if len(first) <= n else ""


def role_long(headline):
    """Wie role_of, aber bis 95 Zeichen (fuer die Description)."""
    return role_of(headline, 95)


def _topics(eids, name_of, k=3, room=70):
    """Bis zu k Themen-Namen, ganze Namen, zusammen hoechstens room Zeichen (kein Schnitt im Namen)."""
    out = []
    for e in eids or []:
        nm = name_of(e) if name_of else ""
        if not nm or nm in out or len(nm) > 40:
            continue
        if len(", ".join(out + [nm])) > room:
            continue
        out.append(nm)
        if len(out) >= k:
            break
    return out


def _bare(lang, title, suffix_en, suffix_de):
    """Titel + Zusatz, der Zusatz entfaellt, wenn alles zusammen laenger als TITLE_MAX waere."""
    suffix = _t(lang, suffix_en, suffix_de)
    full = f"{title} – {suffix}" if suffix else title
    if len(full) <= TITLE_MAX:
        return full
    return title if len(title) <= 70 else _cut(title, 70)


# ---------------------------------------------------------------- Profile

def profile_meta(lang, p, members_label, name_of=None):
    """Mitgliederprofil. Suchabsicht: 'Wer ist X?' / 'X Microsoft MVP'. Titel Name + Rolle, Beschreibung mit Expertise und Programmen."""
    if lang not in LANGS:
        return None
    name = person_name(p.get("name"))
    role = role_of(p.get("headline") or p.get("job"))
    title = f"{name} – {role}" if role else f"{name} – {_t(lang, 'Expert profile', 'Expertenprofil')}"
    if len(title) > TITLE_MAX:
        title = f"{name}: {_t(lang, 'Expert profile', 'Expertenprofil')}"
    progs = []
    for k_, pr in (("mvp", "Microsoft MVP"), ("rd", "Microsoft Regional Director"), ("mct", "MCT"), ("gde", "Google Developer Expert")):
        if any(x.get("p") == k_ and (x.get("year") or x.get("url") or x.get("verified")) for x in p.get("programs", [])) and pr.lower() not in role.lower() and (k_ != "mvp" or "mvp" not in role.lower()) and (k_ != "mct" or "mct" not in role.lower()):
            progs.append(pr)   # nur belegte Programme (Jahr, Link oder verifiziert), nichts doppelt zur Rolle
    topics = _topics([e.get("e") for e in p.get("expertise", [])], name_of)
    sep = " – " if name.endswith(".") else ": "
    rl = role_long(p.get("headline") or p.get("job"))
    head = f"{name}{sep}{rl}." if rl else _t(lang, f"Profile of {name}.", f"Profil von {name}.")
    bits = []
    if progs:
        bits.append(", ".join(progs[:2]) + ".")
    if topics:
        bits.append("Expertise: " + ", ".join(topics) + ".")
    if not bits and not rl:
        bits.append(_t(lang, "Public expert profile in the Microsoft 365 community.", "Öffentliches Expertenprofil in der Microsoft-365-Community."))
    tail = _t(lang, "Posts, events and community contributions on M365.FM.", "Beiträge, Events und Community-Engagement auf M365.FM.")
    return title, _fit(head, bits, tail)


def company_meta(lang, o, name_of=None):
    """Firmenprofil. Suchabsicht: 'Firma X Microsoft'. Titel Name + Tagline, Beschreibung mit Expertise und Land."""
    if lang not in LANGS:
        return None
    name = _clean(o.get("name"))
    full = _clean(o.get("tagline") or "")
    tag = full if len(full) <= 46 else ""
    title = f"{name} – {tag}" if tag else f"{name} – {_t(lang, 'Company profile', 'Firmenprofil')}"
    if len(title) > TITLE_MAX:
        title = f"{name}: {_t(lang, 'Company profile', 'Firmenprofil')}"
    topics = _topics([e.get("e") for e in o.get("expertise", [])], name_of)
    sep = " – " if name.endswith(".") else ": "
    head = f"{name}{sep}{full}." if (full and len(full) <= 95) else _t(lang, f"Company profile of {name}.", f"Firmenprofil von {name}.")
    bits = []
    if topics:
        bits.append(_t(lang, "Expertise: ", "Expertise: ") + ", ".join(topics) + ".")
    if o.get("country"):
        bits.append(_t(lang, f"Based in {o['country']}.", f"Sitz: {o['country']}."))
    tail = _t(lang, "Team, channels and posts on M365.FM.", "Team, Kanäle und Beiträge auf M365.FM.")
    return title, _fit(head, bits, tail)


# ---------------------------------------------------------------- Events

_MODE = {"online": ("online", "online"), "onsite": ("in person", "vor Ort"), "hybrid": ("hybrid", "hybrid")}


def _date(lang, iso):
    m = re.match(r"(\d{4})-(\d{2})-(\d{2})", iso or "")
    if not m:
        return ""
    y, mo, d = int(m.group(1)), int(m.group(2)), int(m.group(3))
    if lang == "de":
        return f"{d}.{mo}.{y}"
    return f"{('Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec')[mo - 1]} {d}, {y}"


def event_meta(lang, ev, has_sessions=False):
    """Eventseite. Suchabsicht: Name des Events + Datum/Programm/Speaker. Titel: Name – Termin, Sessions & Speaker; Beschreibung mit Datum, Ort."""
    if lang not in LANGS:
        return None
    name = _clean(ev.get("title"))
    title = _bare(lang, name, "Date, Sessions & Speakers", "Termin, Sessions & Speaker")
    when = _date(lang, ev.get("start"))
    mode = _MODE.get(ev.get("mode"), _MODE["online"])[1 if lang == "de" else 0]
    place = _clean(ev.get("location") or ev.get("country") or "")
    where = mode if not place or ev.get("mode") == "online" else f"{mode}, {place}"
    head = _t(lang, f"{name} takes place on {when} ({where})." if when else f"{name} ({where}).",
              f"{name} findet am {when} statt ({where})." if when else f"{name} ({where}).")
    tail = _t(lang, "Sessions, speakers and calendar file (.ics).", "Sessions, Speaker und Kalenderdatei (.ics).") if has_sessions else _t(lang, "Details and calendar file (.ics).", "Details und Kalenderdatei (.ics).")
    summary = _clean(ev.get("summary") or ev.get("about") or "")
    if summary.lower().startswith(name.lower()):
        summary = ""   # Name steht schon vorne
    room = DESC_MAX - len(head) - len(tail) - 2
    bits = [_cut(summary, room)] if summary and room >= 30 else []
    return title, _fit(head, bits, tail)


# ---------------------------------------------------------------- Verzeichnisse und Einzelseiten

HUBS = {
    "members": (("Microsoft 365 Experts & MVPs: Member Directory", "Microsoft-365-Experten & MVPs: Mitgliederverzeichnis"),
                ("Find Microsoft 365 experts, MVPs and MCTs by topic: profiles with certifications, expertise, channels and contributions. Opt-in only.",
                 "Microsoft-365-Experten, MVPs und MCTs nach Thema finden: Profile mit Zertifizierungen, Expertise, Kanälen und Beiträgen. Nur freiwillig.")),
    "companies": (("Microsoft 365 Companies & Partners Directory", "Microsoft-365-Firmen & Partner: Verzeichnis"),
                  ("Find companies in the Microsoft ecosystem by expertise: company profiles with team members, channels and posts.",
                   "Firmen im Microsoft-Ökosystem nach Expertise finden: Firmenprofile mit Team, Kanälen und Beiträgen.")),
    "events": (("Microsoft 365 Events: Conferences, Webinars, Meetups", "Microsoft-365-Events: Konferenzen, Webinare, Meetups"),
               ("Find Microsoft 365 conferences, webinars and meetups with dates, sessions, speakers and calendar files (.ics).",
                "Microsoft-365-Konferenzen, Webinare und Meetups finden: mit Terminen, Sessions, Speakern und Kalenderdateien (.ics).")),
    "guests": (("Find Podcast Guests & Speakers for Microsoft 365", "Podcast-Gäste & Speaker für Microsoft 365 finden"),
               ("Podcasters, YouTubers and organizers find guests and speakers for Microsoft 365 topics, and speakers find shows that need them.",
                "Podcaster, YouTuber und Veranstalter finden Gäste und Speaker für Microsoft-365-Themen, und Speaker finden passende Shows.")),
    "mcp": (("Connect Claude & ChatGPT to M365.FM via MCP", "Claude & ChatGPT mit M365.FM verbinden (MCP)"),
            ("How to connect Claude, ChatGPT or any MCP-capable AI assistant to the M365.FM MCP server: look up the platform and manage your profile.",
             "So verbindest du Claude, ChatGPT oder jeden MCP-fähigen KI-Assistenten mit dem MCP-Server von M365.FM: Plattform nachschlagen, Profil pflegen.")),
    "updates": (("M365.FM Updates: Weekly Website Changes", "M365.FM Updates: Änderungen der Website pro Woche"),
                ("Every Friday a short summary of what changed on M365.FM: new features, design changes and fixes.",
                 "Jeden Freitag eine kurze Zusammenfassung, was sich auf M365.FM geändert hat: neue Funktionen, Design-Änderungen und Fehlerbehebungen.")),
}


def hub_meta(kind, lang):
    """Verzeichnis-/Hub-Seite (members, companies, events, guests, mcp, updates). None fuer nicht abgedeckte Sprachen."""
    if lang not in LANGS or kind not in HUBS:
        return None
    (te, td), (de_, dd) = HUBS[kind]
    return _t(lang, te, td), _t(lang, de_, dd)
