"""Zweite Brotkrumen-Spur nach dem Hauptthema (Mirko, 16.11.2026): Folgen, Blogbeitraege und Videos tragen neben der bisherigen
Struktur-Spur (M365.FM > Episodes > Titel) eine zweite schema.org-BreadcrumbList, nur im JSON-LD, nichts Sichtbares:

    M365.FM > bis zu 3 Oberbegriffe des Hauptthemas (von oben nach unten) > Hauptthema (Entitaetsseite) > die Seite selbst

Die Oberbegriffe kommen aus derselben Kette wie die Brotkrumen der Entitaetsseiten (ontology.ancestors: part_of > broader > instance_of).
Google erlaubt mehrere Brotkrumen-Spuren je Seite.

Hauptthema (main_topic) - Regeln, aus der Verteilung der ersten about-Entitaeten abgeleitet (Stand 16.11.2026: 1.094 englische Folgen,
644 Dub-Folgen mit QA-gepruefter Extraktion, 2.307 fruehere Blogbeitraege, 349 Content-Pakete):
  R1  Nur Entitaeten mit eigener Seite in der Sprache der Seite (bekannte Entitaet, Sprache in COMM_LANGS), nicht veraltet/ersetzt.
  R2  Nie ein Thema: Personen (Host mirko-peters - 8x erste Entitaet der Dub-Extraktion -, Gaeste), Organisationen (microsoft,
      github, ifakt: 12x erstes Thema der Content-Pakete), das Medium selbst (m365fm), Events und Kategorien (microsoft-tool,
      ai-assistant, low-code-tool ...). Das sind Knoten des Graphen, keine Themen einer Folge.
  R3  Wurzeln (ROOT_IDS: microsoft-365, automation, compliance, ai ...) und Branchen/Jobs nur als letzte Wahl - der Titel zaehlt bei
      ihnen nicht ("Microsoft 365" steht in sehr vielen Titeln).
  R4  Breite Themen (BROAD: die uebrigen allgemeinen Begriffe aus site_topics.GENERIC wie governance, ai-agent, prompt und alle
      Plattformen wie azure, fabric, power-platform, dynamics-365) zaehlen nach spezifischen Produkten/Konzepten/Zertifizierungen,
      ausser der Titel nennt sie. Microsoft 365 Copilot (copilot) gilt als spezifisches Produkt (38x erste Dub-Entitaet, meist zu Recht).
  R5  Reihenfolge: spezifisch + im Titel > breit + im Titel > spezifisch > breit > Wurzel/Branche/Job; innerhalb einer Stufe die
      bestehende about-Reihenfolge. Englische Folgen ordnen ihre about-Liste dafuer vorher nach der Extraktion (score) bzw. nach
      Nennungen in Kernpunkten/FAQ (rank), weil ep_about in der Reihenfolge der Entitaetsdatei steht (keine Relevanz).
Kandidaten je Seitenart (die about-Liste im JSON-LD bleibt unveraendert):
  Englische Folge   Extraktion (score) + im Titel genannte Entitaeten (named_in) + ep_about. ep_about allein fehlen die grossen Themen,
                    weil jede Entitaetsseite nur ihre 12 besten Folgen fuehrt.
  Dub-Folge         Extraktion der Dub-Folge (heute fuer keine Dub-Folge vorhanden) + im Titel genannte Entitaeten - so wie die
                    Entitaetsseiten Dub-Folgen ueber Namenstreffer im Titel finden (generate_site._ep_find).
  Blogbeitrag       topics (Content-Pakete, Community, fruehere Beitraege: gewichtet nach site_topics.score_topics); Sprachfassungen
                    werten R4 mit dem Titel des englischen Originals, damit alle Sprachen dasselbe Hauptthema haben.
  Video             topics.
"""
import re

import ontology as ONT
from site_i18n import COMM_LANGS, pfx
from site_topics import GENERIC as _TOPIC_GENERIC

MAX_ANCESTORS = 3   # wie die Entitaetsseiten (site_entities: ONT.ancestors(...)[:3])
NO_TOPIC_TYPES = {"person", "org", "media", "event", "category"}   # R2
NO_TOPIC_IDS = {"mirko-peters", "m365fm", "microsoft", "microsoft-tool"}   # R2, auch falls sich der Typ einmal aendert
ROOT_IDS = {"microsoft-365", "automation", "compliance", "security", "ai", "artificial-intelligence", "cloud", "data"}   # R3
ROOT_TYPES = {"industry", "job"}   # R3
SPECIFIC_IDS = {"copilot"}   # R4: Produkt, obwohl site_topics es fuer die Themen-Gewichtung als allgemein fuehrt
BROAD_IDS = set(_TOPIC_GENERIC) - ROOT_IDS - SPECIFIC_IDS - NO_TOPIC_IDS   # R4 (dazu jede Plattform)
ROOT_NAME = "M365.FM"


def eurl(BASE, lang, i):
    """Adresse der Entitaetsseite in der Sprache (eine Quelle: site_entities.eurl verwendet diese Funktion)."""
    return f"{BASE}{pfx(lang)}/entity/{i}/"


def _alive(e):
    return bool(e) and not e.get("outdated") and not e.get("replaced_by")


def usable(i, ents, lang="en"):
    """R1 + R2: darf i Hauptthema einer Seite in lang sein?"""
    e = ents.get(i)
    return (lang in COMM_LANGS and _alive(e) and i not in NO_TOPIC_IDS and e.get("type") not in NO_TOPIC_TYPES)


def tier(i, ents):
    """0 spezifisch, 1 breit (R4), 2 Wurzel/Branche/Job (R3)."""
    e = ents.get(i) or {}
    if i in ROOT_IDS or e.get("type") in ROOT_TYPES:
        return 2
    if i in SPECIFIC_IDS:
        return 0
    return 1 if (i in BROAD_IDS or e.get("type") == "platform") else 0


def _names(e):
    out = []
    for n in [e.get("name") or "", *(e.get("aliases") or [])]:
        n = re.sub(r"\s*\(.*?\)\s*$", "", str(n)).strip()
        if len(n) >= 3:
            out.append(n)
    return out


def _rx(i, ents):
    ns = _names(ents.get(i) or {})
    return re.compile(r"(?<![\w-])(?:" + "|".join(re.escape(n) for n in ns) + r")(?![\w-])", re.I) if ns else None


def in_title(i, ents, title):
    r = _rx(i, ents) if title else None
    return bool(r and r.search(title))


_IX = []


def named_in(text, ents):
    """Entitaeten, deren Name/Alias im Text steht, in der Reihenfolge des Auftretens - derselbe vorsichtige Abgleich wie die Themen der
    Sidebar (site_sidebar.Index: laengster Name zuerst, Mindestlaenge, ohne zu allgemeine Einzelwoerter wie "Teams", "Copilot", "Azure")."""
    if not text:
        return []
    if not _IX:
        import site_sidebar as SBR
        _IX.append(SBR.Index())
    ix = _IX[0]
    if not ix.rx:
        return []
    out = [ix.names.get(m.group(1).lower()) for m in ix.rx.finditer(text)]
    return [i for i in dict.fromkeys(out) if i and i in ents]


def rank(ids, ents, text, first=()):
    """Reihenfolge fuer die Themenwahl: zuerst die ids aus first (z. B. Extraktion nach score), dann die uebrigen nach Nennungen in text
    (stabil, sonst wie gegeben). Aendert die about-Liste der Seite nicht."""
    ids = list(dict.fromkeys(ids or []))
    have = set(ids)
    head = [i for i in dict.fromkeys(first or []) if i in have]
    rest = [i for i in ids if i not in set(head)]
    if text:
        cnt = {}
        for i in rest:
            r = _rx(i, ents)
            cnt[i] = len(r.findall(text)) if r else 0
        rest.sort(key=lambda i: -cnt[i])
    return head + rest


def main_topic(about_ids, ents, lang="en", title=""):
    """Hauptthema (Entitaets-id) aus der about-Liste einer Seite oder None (Regeln R1-R5 oben)."""
    cands = [i for i in dict.fromkeys(about_ids or []) if isinstance(i, str) and usable(i, ents, lang)]
    if not cands:
        return None
    t = {i: tier(i, ents) for i in cands}
    hit = {i: t[i] < 2 and in_title(i, ents, title) for i in cands}
    return min(cands, key=lambda i: (0 if hit[i] and t[i] == 0 else 1 if hit[i] else 2 + t[i], cands.index(i)))


def chain(main, ents):
    """Oberbegriffe des Hauptthemas von oben nach unten (hoechstens MAX_ANCESTORS, ohne veraltete/ersetzte, ohne Kategorie microsoft-tool)."""
    anc = [x for x in ONT.ancestors(main, ents)[:MAX_ANCESTORS] if x in ents and _alive(ents[x]) and x not in ONT.GENERIC_TOP]
    return list(reversed(anc))


def breadcrumb(BASE, lang, about_ids, ents, page_name, page_url, title=None):
    """BreadcrumbList (dict mit @context) nach dem Hauptthema oder None ohne Hauptthema."""
    if not page_url or not page_name:
        return None
    main = main_topic(about_ids, ents, lang, page_name if title is None else title)
    if not main:
        return None
    items, seen = [(ROOT_NAME, f"{BASE}/")], {f"{BASE}/"}
    for x in chain(main, ents) + [main]:
        u = eurl(BASE, lang, x)
        if u not in seen and ents[x].get("name"):
            items.append((ents[x]["name"], u)); seen.add(u)
    if page_url in seen:
        return None
    items.append((page_name, page_url))
    return {"@context": "https://schema.org", "@type": "BreadcrumbList",
            "itemListElement": [{"@type": "ListItem", "position": k + 1, "name": n, "item": u} for k, (n, u) in enumerate(items)]}
