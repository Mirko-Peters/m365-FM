"""SEO-Experiment "beschreibende Ankertexte" (16.11.2026, Plan: SEO_EXPERIMENT.md).

Frage: Verbessert ein semantisch beschreibender interner Ankertext ("Conditional Access – a policy engine in Microsoft Entra") gegenueber der
klassischen Namensverlinkung ("Conditional Access") die thematische Relevanz und Auffindbarkeit der Entitaetsseite (Suchanzeigen, Klicks, Position,
Zahl verschiedener Suchanfragen)?

Aufbau: Pruefgruppen stehen fest in data/seo_experiment.json (sem = beschreibender Anker, ctl = klassischer Name). Betroffen sind nur Links AUF die
Entitaetsseiten dieser Gruppen von anderen englischen Entitaetsseiten (Listen "Verwandt/Teil von/Beispiele" und "Verwandte Themen kurz erklaert");
Brotkruemel, Artikel, Navigation und alle anderen Sprachen bleiben unveraendert. Ab dem Startdatum ("start") schreibt der Seitenbau die Anker; davor und
ohne Datei aendert sich nichts. Jeder betroffene Link traegt data-xv="sem"|"ctl", damit man im Gebauten und im Crawl nachpruefen kann.
"""
import hashlib
import json
import re
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent
FILE = ROOT / "data" / "seo_experiment.json"
TYPES = ("concept", "product")   # gleichartige Seiten; Personen, Firmen, Zertifikate usw. sind aussen vor
MIN_LINKS = 2                    # mindestens so viele eingehende/ausgehende Beziehungen: sonst gibt es kaum Links, an denen man etwas aendern koennte
MAX_LEN = 90
PER_GROUP = 100                  # je Gruppe genau so viele Seiten (Vorgabe Mirko, 16.11.2026: 100 gegen 100)
_CUT = re.compile(r"\s+(?:that|which|for|with|used|built|designed|where|who)\s|[;:(,]|\s[–—-]\s|\.\s")
_END = {"a", "an", "the", "of", "in", "on", "at", "by", "to", "from", "into", "and", "or", "as", "than", "its", "their", "your", "managed", "based", "built",
        "fully", "highly", "using", "across", "between", "per", "via", "over", "within", "inside", "such", "like", "both", "any", "all", "not", "is", "are"}
_ART = re.compile(r"^(A|An|The)\s+")


def descriptor(name, desc):
    """Kurzer beschreibender Zusatz aus dem ersten Satz der englischen Beschreibung ("a policy engine in Microsoft Entra") oder None, wenn kein sauberer
    Zusatz entsteht (zu kurz, zu lang, nur der Name). Rein regelbasiert, keine KI, damit Gruppen und Texte nachvollziehbar und stabil bleiben."""
    s = " ".join(str(desc or "").split())
    if not s:
        return None
    s = re.sub(r"^" + re.escape(name) + r"\s+(?:is|are|was|were)\s+", "", s, flags=re.I)
    m = _CUT.search(s)
    s = (s[:m.start()] if m else s).strip(" .,:;–—-")
    w = s.split()
    if len(w) < 3 or len(s) > MAX_LEN or s.casefold().startswith(name.casefold()) or w[-1].casefold() in _END or w[-1].casefold().endswith(("able", "ed", "ing", "ive", "ly")):
        return None
    if re.search(r"\b(?:is|are|was|were)\b", s) or not (len(w) >= 5 or any(x[:1].isupper() for x in w[1:])):   # kein ganzer Satz; nicht nur allgemein ("a managed service"): Eigenname oder genug Inhalt
        return None
    if all(x.casefold() in ("a", "an", "the", "azure", "microsoft", "service", "managed", "fully", "cloud", "first-party", "microsoft's") for x in w):
        return None
    if _ART.match(s):
        s = s[0].lower() + s[1:]
    return s


def anchor(ent):
    """Beschreibender Ankertext "Name – zusatz" oder None."""
    d = descriptor(ent["name"], (ent.get("desc") or {}).get("en"))
    return f"{ent['name']} – {d}" if d else None


def _h(salt, i):
    return hashlib.sha256(f"{salt}:{i}".encode()).hexdigest()


def assign(ents, salt="m365fm-2026-11-16", dup=None, per_group=PER_GROUP):
    """Teilnehmer und Gruppen berechnen: Begriffe/Produkte mit sauberem Zusatz, mindestens MIN_LINKS Beziehungen, keine Dubletten. Gruppen werden je
    Art und Beziehungs-Klasse (2-3 / 4+) nach Hash sortiert und abwechselnd verteilt (gleich grosse, vergleichbare Gruppen)."""
    ids = set(ents)
    deg = {i: 0 for i in ids}
    for i, e in ents.items():
        for p, t in e.get("rel", []):
            if t in ids:
                deg[i] += 1
                deg[t] += 1
    skip = set(dup or {}) | set((dup or {}).values())
    cells = {}
    for i, e in ents.items():
        if e["type"] in TYPES and i not in skip and deg[i] >= MIN_LINKS and anchor(e):
            cells.setdefault((e["type"], "4+" if deg[i] >= 4 else "2-3"), []).append(i)
    # Je Klasse (Art x Beziehungen) abwechselnd verteilen, danach auf PER_GROUP je Gruppe kuerzen: Platz je Klasse im Verhaeltnis zu ihrer Groesse
    # (Verfahren mit groesstem Rest), von hinten nach Hash gestrichen. So bleiben beide Gruppen gleich gross und gleich zusammengesetzt.
    halves = {}
    for k in sorted(cells):
        o = sorted(cells[k], key=lambda x: _h(salt, x))
        halves[k] = (o[0::2], o[1::2])
    total = sum(len(v) for v in cells.values())
    quota = {k: min(len(a), len(b)) for k, (a, b) in halves.items()}
    if per_group and 2 * sum(quota.values()) > 2 * per_group:
        raw = {k: per_group * len(cells[k]) / total for k in cells}
        quota = {k: min(int(raw[k]), len(halves[k][0]), len(halves[k][1])) for k in cells}
        for k in sorted(cells, key=lambda k: -(raw[k] - int(raw[k]))):
            if sum(quota.values()) >= per_group: break
            if quota[k] < min(len(halves[k][0]), len(halves[k][1])): quota[k] += 1
    sem, ctl = [], []
    for k, (a, b) in halves.items():
        sem += a[:quota[k]]; ctl += b[:quota[k]]
    return sorted(sem), sorted(ctl), deg


def load(today=None, path=None):
    """{"start": date, "sem": set, "ctl": set} wenn das Experiment laeuft (Datei da, Startdatum erreicht), sonst None."""
    try:
        d = json.loads(Path(path or FILE).read_text("utf-8"))
        start = date.fromisoformat(d["start"])
    except (OSError, ValueError, KeyError, TypeError):
        return None
    t = today if isinstance(today, date) else date.fromisoformat(str(today)[:10]) if today else date.today()
    if t < start or d.get("stop") and t > date.fromisoformat(d["stop"]):
        return None
    return {"start": start, "sem": set(d.get("sem", [])), "ctl": set(d.get("ctl", [])), "anchors": dict(d.get("anchors", {}))}


def variant(x, i):
    """"sem", "ctl" oder None fuer Entitaet i."""
    if not x:
        return None
    return "sem" if i in x["sem"] else "ctl" if i in x["ctl"] else None


def link_text(x, i, name):
    """(Ankertext, Marke) fuer einen Link auf Entitaet i; ohne laufendes Experiment oder fuer Nicht-Teilnehmer (name, "")."""
    v = variant(x, i)
    if v == "sem" and x["anchors"].get(i):
        return x["anchors"][i], "sem"
    return name, v or ""
