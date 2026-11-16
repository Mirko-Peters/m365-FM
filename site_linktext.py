"""Linktexte, die das Ziel nennen (Audit Linktexte F1-F5, WCAG 2.4.4).

Regeln:
- Ein Kanal heisst nach seinem Namen, nicht nach seiner Art: "m365con.net" statt "Web", "M365.FM Deutsch auf Spreaker" statt "Podcast".
- Gleicher Text heisst gleiches Ziel: haben zwei Kanaele dasselbe Label, kommt Domain bzw. Pfad dazu (channel_links).
- Kurze Knopftexte duerfen bleiben, bekommen aber ein aria-label "{sichtbarer Text}: {Ziel}" (aria()): der sichtbare Text
  steht immer vorn im Namen (WCAG 2.5.3, Label in Name), deshalb braucht das Muster keine eigene Uebersetzung.
- Pfeile und Icons stehen in aria-hidden (arrow()), sonst liest der Screenreader "Pfeil nach rechts" vor.
- Alles in der Seitensprache ueber site_i18n.T (data/py_i18n.json).
Gemeinsam benutzt von generate_site.author_box, site_members.chan_ul, site_home (Creator-Feed), site_feed und site_entities."""
import html
from urllib.parse import urlsplit

from site_i18n import T

# Spreaker-Shows von M365.FM: Show-ID -> eigener Name der Show (gleiche IDs wie generate_site.LANGS[..][3]; tests/test_linktext.py prueft den Gleichlauf)
SHOWS = {"6704921": "M365.FM English", "7393187": "M365.FM Deutsch", "7393248": "M365.FM Español", "7393223": "M365.FM Français",
         "7393231": "M365.FM Italiano", "7393243": "M365.FM Português", "7393222": "M365.FM Nederlands", "7393242": "M365.FM Polski",
         "7393230": "M365.FM Bahasa Indonesia", "7393247": "M365.FM Русский", "7393254": "M365.FM Українська", "7393221": "M365.FM العربية",
         "7393227": "M365.FM עברית", "7393232": "M365.FM 日本語", "7393236": "M365.FM 한국어"}

# Marke je Host (ohne "www."); Subdomains wie de.wikipedia.org greifen ueber die Endung
BRANDS = {"linkedin.com": "LinkedIn", "github.com": "GitHub", "youtube.com": "YouTube", "youtu.be": "YouTube", "music.youtube.com": "YouTube Music",
          "x.com": "X", "twitter.com": "X", "bsky.app": "Bluesky", "twitch.tv": "Twitch", "open.spotify.com": "Spotify", "spotify.com": "Spotify",
          "podcasts.apple.com": "Apple Podcasts", "music.amazon.com": "Amazon Music", "music.amazon.de": "Amazon Music", "audible.com": "Audible",
          "audible.de": "Audible", "deezer.com": "Deezer", "instagram.com": "Instagram", "tiktok.com": "TikTok", "facebook.com": "Facebook",
          "spreaker.com": "Spreaker", "medium.com": "Medium", "substack.com": "Substack", "learn.microsoft.com": "Microsoft Learn",
          "docs.microsoft.com": "Microsoft Learn", "wikipedia.org": "Wikipedia", "wikidata.org": "Wikidata", "m365.fm": "M365.FM",
          "sessionize.com": "Sessionize", "mvp.microsoft.com": "Microsoft MVP", "iheart.com": "iHeart", "castbox.fm": "Castbox",
          "podcastaddict.com": "Podcast Addict", "podchaser.com": "Podchaser", "xing.com": "XING", "threads.net": "Threads"}
# Marke je Kanal-Art (Profil-Editor assets/profile.js KINDS), wenn der Host nichts sagt (z. B. eigene Mastodon-Instanz)
KIND_BRAND = {"linkedin": "LinkedIn", "github": "GitHub", "youtube": "YouTube", "x": "X", "mastodon": "Mastodon", "bluesky": "Bluesky", "twitch": "Twitch",
              "spotify": "Spotify", "apple": "Apple Podcasts", "amazon": "Amazon Music", "deezer": "Deezer", "instagram": "Instagram", "tiktok": "TikTok",
              "facebook": "Facebook"}
PODCAST_KINDS = frozenset({"podcast", "spotify", "apple", "amazon", "deezer"})
# Plattformen, auf denen der Pfad das Konto nennt (medium.com/@name): dort gehoert der erste Pfadteil zum Namen
MULTI = frozenset({"medium.com", "github.com", "linkedin.com", "youtube.com", "x.com", "twitter.com", "instagram.com", "tiktok.com", "facebook.com"})


def host(url):
    """Host ohne www. und Port, klein geschrieben ('' bei unbrauchbarer URL)."""
    try:
        h = (urlsplit(str(url or "")).hostname or "").lower()
    except ValueError:
        return ""
    return h[4:] if h.startswith("www.") else h


def brand(url):
    """Markenname des Hosts ('Microsoft Learn', 'Wikipedia', 'M365.FM' ...) oder ''."""
    h = host(url)
    while h:
        if h in BRANDS:
            return BRANDS[h]
        if "." not in h:
            return ""
        h = h.split(".", 1)[1]
    return ""


def short_url(url, n=48):
    """Domain plus Pfad ohne Schema, Abfrage und Schraegstrich am Ende (fuer Eindeutigkeit und die graue Domain-Zeile)."""
    try:
        p = urlsplit(str(url or ""))
    except ValueError:
        return str(url or "")[:n]
    s = (host(url) + p.path).rstrip("/")
    return s if len(s) <= n else s[: n - 1] + "…"


def platform(url, kind=None):
    """Name der Plattform eines Links: Marke des Hosts, sonst Marke der Kanal-Art, sonst die Domain."""
    return brand(url) or KIND_BRAND.get(kind or "", "") or host(url) or "Web"


def spreaker_show(url):
    """Eigener Name einer M365.FM-Show bei Spreaker-Show-URLs (spreaker.com/show/<id>...), sonst ''."""
    if brand(url) != "Spreaker":
        return ""
    parts = [x for x in urlsplit(str(url)).path.split("/") if x]
    if len(parts) >= 2 and parts[0] == "show":
        return SHOWS.get(parts[1].rsplit("-", 1)[-1], "") or SHOWS.get(parts[1], "")
    return ""


def on(lang, name, plat):
    """'{name} auf {Plattform}' in der Seitensprache."""
    return T(lang, "{name} on {platform}", "{name} auf {platform}").format(name=name, platform=plat)


def channel_label(c, lang, person=None):
    """(Linktext, aria-label oder None) fuer einen Kanal {kind, url[, label]}.
    Netzwerke: Marke als Text, aria-label '{Person} auf {Marke}'. Podcasts: Name der Show plus Plattform. Website/Blog/Newsletter/Sonstiges:
    Seitenname (Marke) bzw. Domain. Ein eigenes Feld "label" am Kanal hat Vorrang."""
    url, kind = c.get("url") or "", (c.get("kind") or "other").lower()
    own = " ".join(str(c.get("label") or "").split())[:80]
    if own:
        return own, None
    if kind in PODCAST_KINDS:
        plat = platform(url, kind)
        show = spreaker_show(url)
        if show:
            return on(lang, show, plat), None
        return (on(lang, person, plat) if person else on(lang, "Podcast", plat)), None
    if kind in KIND_BRAND:
        b = platform(url, kind)
        return b, (on(lang, person, b) if person else None)
    h = host(url)
    b = brand(url)
    if h in MULTI or (b and b in KIND_BRAND.values()):   # Website-Kanal auf einem Netzwerk: Konto im Pfad gehoert zum Namen
        return short_url(url), None
    if b:
        return b, None
    return h or "Link", None


def _suffixes(pairs):
    """Je (text, url): Zusatz ' (domain/pfad)', wenn derselbe Text auf verschiedene Ziele zeigt, sonst ''."""
    seen = {}
    for t, u in pairs:
        seen.setdefault(t.casefold(), set()).add(str(u).rstrip("/"))
    out = []
    for t, u in pairs:
        x = short_url(u) if len(seen[t.casefold()]) > 1 else ""
        out.append(f" ({x})" if x and x.casefold() not in t.casefold() else "")
    return out


def unique(pairs):
    """[(text, url)] -> [(text, url)]: gleicher Text heisst gleiches Ziel (sonst Domain/Pfad angehaengt)."""
    return [(t + sx, u) for (t, u), sx in zip(pairs, _suffixes(pairs))]


def channel_links(chans, lang, person=None):
    """[(kanal, text, aria)] mit eindeutigen Texten: gleiche Labels fuer verschiedene Ziele bekommen Domain/Pfad angehaengt."""
    rows = [(c, *channel_label(c, lang, person)) for c in chans if c.get("url")]
    sxs = _suffixes([(t, c["url"]) for c, t, _ in rows])
    return [(c, t + sx, (a + sx) if a else None) for (c, t, a), sx in zip(rows, sxs)]


def a_attr(label):
    """' aria-label="..."' oder ''."""
    return f' aria-label="{html.escape(label, quote=True)}"' if label else ""


def aria(visible, target):
    """aria-label nach dem Muster '{sichtbarer Text}: {Ziel}' (sichtbarer Text vorn: WCAG 2.5.3)."""
    return f"{visible}: {target}" if target else visible


def arrow(ch="→"):
    """Pfeil fuer Knoepfe, fuer Screenreader versteckt."""
    return f' <span aria-hidden="true">{ch}</span>'


def ext_label(lang, name, kind, url):
    """Linktext fuer Quellen einer Entitaet: '{Name} – offizielle Website', '{Name} – Microsoft Learn', '{Name} – Wikipedia',
    'Wikidata-Eintrag zu {Name}', '{Name} auf {Plattform}' (Profile). Nie die rohe URL."""
    if kind == "web":
        return T(lang, "{name} – official website", "{name} – offizielle Website").format(name=name)
    if kind == "wikidata":
        return T(lang, "Wikidata entry for {name}", "Wikidata-Eintrag zu {name}").format(name=name)
    if kind == "wikipedia":
        return f"{name} – Wikipedia"
    b = brand(url)
    if kind == "docs":
        return f"{name} – {b}" if b == "Microsoft Learn" else T(lang, "{name} – documentation", "{name} – Dokumentation").format(name=name)
    return on(lang, name, b or host(url) or "Web")


def domain_note(url):
    """Kleine, graue Domain neben einem Link (nicht als Linktext)."""
    h = host(url)
    return f' <small class="mut">{html.escape(h)}</small>' if h else ""
