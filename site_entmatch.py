"""Gemeinsamer Namensindex fuer alle Stellen, die Entitaeten in Texten erkennen (Audit Linktexte, gap 2, Paket 2):
Seitenleisten-Chips (site_sidebar.Index), Themen von Beitraegen (site_topics.score_topics), Folgen je Entitaet und PodcastEpisode.about
(site_podpage.episode_index/find_episodes), Kontext-Links im Fliesstext (site_topics.autolink_html, site_learn.gloss_link, Show Notes,
Videos, Entitaetsseiten) und die Themen-Spur (site_topic_crumbs.named_in).

Regeln (Mirko, 17.11.2026):
- Produkte, Plattformen, Organisationen, Zertifikate, Events, Medien und Personen werden mit Beachtung der Schreibung gesucht ("Teams", nicht
  "teams"; "Surface", nicht "attack surface"). Personen nur mit vollem Namen (mehrteilig).
- Mehrteilige Konzeptnamen ohne Beachtung der Schreibung ("data governance" trifft "Data governance"); einteilige Konzeptnamen mit beliebigem
  ersten Buchstaben ("cardinality"/"Cardinality"), Abkuerzungen und Binnenmajuskeln (DLP, eDiscovery) genau.
- Allerweltswoerter brauchen Kontext. Eine Form ist ein Allerweltswort, wenn sie (a) bei Eigennamen im Textbestand oft kleingeschrieben vorkommt
  (data/entmatch_common.json, tools/entmatch_common.py), (b) bei Konzepten nur ein Kurzname (Alias) eines laengeren Namens ist ("Workspace",
  "Dataset", "Agent") oder (c) aus einem Namen mit Zusatz in Klammern stammt ("Recall (Windows)" -> "Recall", nur mit Windows im Kontext).
  Eigennamen-Allerweltswoerter zaehlen nur in der Eigennamen-Stellung: grossgeschrieben mitten im Satz, nicht am Satzanfang und nicht in einer
  Titel-Reihe ("Apply to Each Loop Limit"); im Deutschen zaehlt die Grossschreibung bei deutschen Substantiven ("Ihre Teams") nicht.
- Kontext entscheidet IMMER bei Mehrdeutigkeit: Kandidaten, die mit den uebrigen erkannten Entitaeten, den Themen der Seite oder der Seite selbst
  verbunden sind (Kanten in rel beider Richtungen, gemeinsamer Oberbegriff, gemeinsame Folgen in der QA-geprueften Extraktion), gewinnen; ohne
  Stuetze gibt es keinen Treffer. Sammelknoten (microsoft, azure, microsoft-tool, Kategorien) stuetzen Konzept-Kurznamen nicht.

Kontext-Links (link_html): jede Entitaet nur bei der ersten Nennung je Seite, ohne Obergrenze, nie in Ueberschriften, Links, Code, Bildunterschriften,
Fragen-Ueberschriften (summary) oder Knoepfen, keine Selbstverweise. Linktext ist das Wort, wie es im Satz steht (Sprache der Seite); weicht es vom
kanonischen Namen ab, steht der Name im title. Bestehende Entitaets-Links (z. B. a.gl der Show Notes) zaehlen als erste Nennung; weitere Links auf
dieselbe Entitaet, Links in Ueberschriften und Selbstverweise werden zu Text (keine Doppellinks)."""
import json
import re
from functools import lru_cache
from pathlib import Path

ROOT = Path(__file__).resolve().parent
D = ROOT / "data"
COMMON_FILE = D / "entmatch_common.json"

PROPER = {"product", "platform", "org", "person", "cert", "event", "media"}
SKIP_TYPES = {"category"}
HOST = {"mirko-peters"}   # Host: Autorenzeile, Autorenkasten und "Host:" verlinken ihn schon auf jeder seiner Seiten
# Sammelbegriffe, deren einteilige Form in fast jedem Satz steht ("data", "cloud", "security"): als Kontext ja, als Link nein
GENERIC = {"microsoft-365", "compliance", "automation", "governance", "security", "ai", "artificial-intelligence", "cloud", "data", "microsoft-tool", "prompt", "agent", "ai-agent", "productivity"}
EXTRA_COMMON = {"word", "excel", "edge", "store", "search", "learn", "designer", "publisher", "whiteboard", "mesh", "recall", "harness", "clarity", "marketplace",
                "bookings", "planner", "exchange", "teams", "loop", "surface", "react", "places", "shifts", "functions", "guides", "lists", "forms", "stream", "flow",
                "access", "project", "actions", "graph", "fabric", "dynamics", "foundry", "viva", "sway", "office", "pages", "sites", "tasks", "to do"}
NOT_COMMON = {"sharepoint", "powershell", "onedrive", "dataverse", "kubernetes", "github", "openai", "terraform", "bicep", "entra", "purview", "defender", "intune", "sentinel", "visio", "outlook"}
DE_NOUNS = {"teams", "team", "stream", "flow", "store", "designer", "publisher", "projekt", "planner", "places", "lists", "forms", "pages", "sites", "tasks", "actions", "functions"}
BRANDS = {"Microsoft", "Azure", "Power", "Dynamics", "Office", "Viva", "MS", "Windows", "Copilot", "Fabric"}
TITLE_OK = {"I", "A", "An", "The"}   # gross geschriebene Kleinwoerter vor einem Namen machen noch keine Titel-Reihe
VERB_BEFORE = {"can", "could", "might", "may", "will", "would", "should", "must", "to", "do", "does", "did", "you", "we", "they", "i", "it", "he", "she",
               "not", "also", "often", "then", "never", "always", "just", "kann", "können", "wird", "werden", "zu"}
DETS = {"a", "an", "the", "this", "that", "these", "those", "each", "every", "your", "our", "its", "their", "his", "her", "my", "one", "any", "no", "same", "new",
        "ein", "eine", "einen", "einem", "der", "die", "das", "den", "dem", "des", "jeder", "jede", "jedes", "ihr", "ihre", "unser", "unsere"}
HUB_DEGREE = 100
STRICT_KIDS = 25
_TERM = set(".!?:;\n。！？•")
_OPEN = "\"'“„‘«([*>#-–— \t "
_WORD_L = re.compile(r"([^\W\d_][\w'’.+#-]*)[  ]+$")
_WORD_R = re.compile(r"^[  ]+([^\W\d_][\w'’.+#-]*)")
_PAREN = re.compile(r"^(.*?)\s*\(([^()]+)\)\s*$")


def _abbr(x):
    """Klammerinhalt ist eine Abkuerzung (DLP, IaC, CI/CD), kein Zusatz wie "(Windows)" oder "(Azure AI Foundry Agent Service)"."""
    x = x.strip()
    return bool(re.fullmatch(r"[A-Za-z0-9/&.+-]{2,10}", x)) and sum(c.isupper() for c in x) >= 2


_STOPW = {"and", "or", "of", "the", "a", "an", "for", "in", "on", "to", "with", "und", "der", "die", "das", "für"}


def _overlap(a, b):
    w = lambda x: {t for t in re.findall(r"\w+", x.lower()) if t not in _STOPW}
    return bool(w(a) & w(b))


def _shorter(a, b):
    """a ist eine echte Kurzform von b (Woerter von a ohne Plural-s sind eine echte Teilmenge der Woerter von b)."""
    w = lambda x: {t.rstrip("s") for t in re.findall(r"\w+", x.lower()) if t not in _STOPW}
    return w(a) < w(b)


def _distinct(f):
    """Abkuerzung, Binnenmajuskel oder Ziffer: eindeutig geschrieben (DLP, SharePoint, eDiscovery, n8n, M365)."""
    return any(c.isdigit() for c in f) or sum(c.isupper() for c in f[1:]) >= 1 or (f.isupper() and len(f) >= 2)


def _trie(words):
    """Muster als Praefixbaum statt ~4.000 Alternativen: gleiche Treffer (laengste Form zuerst, bei verfehlter Wortgrenze die naechstkuerzere),
    aber ein Vielfaches schneller, weil re nicht jede Alternative an jeder Stelle probiert."""
    root = {}
    for w in words:
        n = root
        for ch in w:
            n = n.setdefault(ch, {})
        n[""] = {}
    def build(n):
        alts = [re.escape(ch) + build(n[ch]) for ch in sorted(k for k in n if k)]
        if not alts: return ""
        p = alts[0] if len(alts) == 1 else "(?:" + "|".join(alts) + ")"
        return "(?:" + p + ")?" if "" in n else p
    return build(root)


class Used(dict):
    """Menge der auf einer Seite schon verlinkten ids in der Reihenfolge der ersten Verlinkung (fuer mentions und Chips: gleiche Ausgabe bei jedem Bau,
    eine set-Reihenfolge haengt vom Hash-Seed ab)."""
    def __init__(self, it=()):
        super().__init__((x, True) for x in it)

    def add(self, x):
        self[x] = True

    def discard(self, x):
        self.pop(x, None)


class Form:
    __slots__ = ("text", "eid", "mode", "common", "qual", "is_name", "proper", "is_abbr")

    def __init__(self, text, eid, mode, common, qual, is_name, proper, is_abbr=False):
        self.text, self.eid, self.mode, self.common, self.qual, self.is_name, self.proper, self.is_abbr = text, eid, mode, common, qual, is_name, proper, is_abbr

    def accepts(self, t):
        if self.mode == "ci": return True
        if self.mode == "cs": return t == self.text
        return t == self.text or (t[1:] == self.text[1:] and t[:1].lower() == self.text[:1].lower())   # "fl": nur der erste Buchstabe frei


def load_common(path=COMMON_FILE):
    try:
        return {str(x).lower() for x in json.loads(path.read_text("utf-8")).get("common", [])}
    except (OSError, ValueError, AttributeError):
        return set()


def cooc_from_extraction():
    """Gemeinsame Folgen je Entitaetspaar aus der QA-geprueften Extraktion (site_extract): {(a, b): n}, {a: Zahl der Folgen}."""
    try:
        import site_extract as SX
    except Exception:
        return {}, {}
    pair, df = {}, {}
    for rec in SX.BY_EPISODE.values():
        ids = sorted({s for s, _ in rec.get("entities") or []})
        for a in ids: df[a] = df.get(a, 0) + 1
        for i, a in enumerate(ids):
            for b in ids[i + 1:]:
                pair[(a, b)] = pair.get((a, b), 0) + 1
    return pair, df


class Matcher:
    def __init__(self, ents, common=None, cooc=None, merged=None):
        """ents: {id: Eintrag} (z. B. site_learn.ENTS); common: Allerweltswoerter (klein); cooc: (Paare, Folgenzahl) oder None; merged: alte ids."""
        self.ents = dict(ents)   # Abzug zum Zeitpunkt des Aufbaus (Aufrufer duerfen ihr dict spaeter aendern)
        common = set(load_common() if common is None else common) | EXTRA_COMMON
        self.common_words = {c for c in common if c not in NOT_COMMON}
        merged = set(merged or ())
        self.forms = {}   # klein -> [Form]
        self.names = {}   # klein -> erste id (Fingerabdruck, Kompatibilitaet mit site_sidebar.Index.names)
        live = {i: e for i, e in ents.items() if not e.get("outdated") and not e.get("replaced_by") and i not in merged}
        self.live = live
        for i, e in live.items():
            if e.get("type") in SKIP_TYPES: continue
            for f, kind, qual in self._forms_of(e):
                self._add(f, e, kind, qual)
        self.by_name = {}
        for i, e in live.items():
            self.by_name.setdefault((e.get("name") or "").lower(), i)
        # Graph: Nachbarn (rel beider Richtungen), Oberbegriffe, Kinder, Sammelknoten
        self.nbr, self.par, self.kids, deg = {}, {}, {}, {}
        for i, e in live.items():
            for r in e.get("rel") or []:
                t, x = (r.get("type"), r.get("to")) if isinstance(r, dict) else (r[0], r[1])
                if not x or x == i: continue
                self.nbr.setdefault(i, set()).add(x); self.nbr.setdefault(x, set()).add(i)
                deg[i] = deg.get(i, 0) + 1; deg[x] = deg.get(x, 0) + 1
                if t in ("part_of", "instance_of", "broader"):
                    self.par.setdefault(i, set()).add(x); self.kids.setdefault(x, set()).add(i)
        self.hubs = {i for i, n in deg.items() if n >= HUB_DEGREE} | {i for i, e in live.items() if e.get("type") in SKIP_TYPES}
        self.pair, self.df = cooc if cooc is not None else ({}, {})
        for fs in self.forms.values():   # kurze Abkuerzung einer Entitaet, die der Graph nicht kennt (keine Kanten, keine Folgen): mehrdeutig
            for f in fs:                 # ("PCI" = Permission Creep Index oder Payment Card Industry), nur mit Kontext
                if f.is_abbr and len(f.text) <= 3 and f.eid not in self.nbr and not self.df.get(f.eid):
                    f.common = True
        self.rx = re.compile(r"(?<![\w-])(" + _trie(self.forms) + r")(?![\w-])", re.I) if self.forms else None

    # ---------------------------------------------------------------- Formen
    def _forms_of(self, e):
        n = (e.get("name") or "").strip()
        out = [(n, "name", None)]
        m = _PAREN.match(n)
        if m:
            base, par = m.group(1).strip(), m.group(2).strip()
            if _abbr(par):
                out += [(base, "name", None), (par, "abbr", None)]
            else:
                out.append((base, "qual", par))   # "Recall (Windows)": "Recall" nur mit Windows im Kontext
        if n.startswith("Microsoft ") and len(n) > 12:
            out.append((n[10:], "short", None))   # "Microsoft Places" -> "Places"
        for a in e.get("aliases") or []:
            a = (a or "").strip()
            if a: out.append((a, "alias", None))
        return out

    def _add(self, f, e, kind, qual):
        t = e.get("type")
        if not f or f.isdigit(): return
        multi = " " in f
        proper = t in PROPER
        if t == "person" and not multi: return   # Personen nur mit vollem Namen
        if len(f) < 3 or (len(f) < 4 and not _distinct(f)): return
        if proper:
            mode = "cs"
        elif multi:
            mode = "ci"
        else:
            mode = "cs" if _distinct(f) else "fl"
        lo = f.lower()
        if multi:
            common = lo in self.common_words
        elif proper:
            common = (lo in self.common_words and not _distinct(f)) or kind == "qual"
        else:
            common = kind in ("alias", "short", "qual") and not _distinct(f)
        if kind == "alias" and multi and not proper and (not _overlap(f, e.get("name") or "") or _shorter(f, e.get("name") or "")):
            common = True   # Konzept-Alias ohne gemeinsames Wort mit dem Namen ("Change management" bei "Copilot adoption") oder Kurzform ("Task flows"
                            # bei "Fabric task flow"): anderer bzw. allgemeinerer Begriff, nur mit Kontext
        q = None
        if kind == "qual":
            common = True; q = qual
        is_name = kind == "name"
        lst = self.forms.setdefault(lo, [])
        if any(x.eid == e["id"] and x.text == f for x in lst): return
        lst.append(Form(f, e["id"], mode, common, q, is_name, proper, kind == "abbr"))
        self.names.setdefault(lo, e["id"])

    # ---------------------------------------------------------------- Kontext
    def support(self, eid, C, strict=False, qual=None):
        """Stuetze der Kandidatin eid durch den Kontext C (Menge von ids). strict: Sammelknoten zaehlen nicht (Konzept-Kurznamen)."""
        if qual:
            q = self.lookup(qual)
            if not q or not (q in C or (self.nbr.get(q, set()) - self.hubs) & C):
                return 0
        if not C: return 0
        s = 3 if eid in C else 0
        nb = self.nbr.get(eid, set())
        s += 2 * len((nb - self.hubs if strict else nb) & C)
        for p in self.par.get(eid, ()):
            if p in self.hubs: continue
            k = self.kids.get(p, set())
            if strict and len(k) > STRICT_KIDS: continue
            s += len((k - {eid}) & C)
        if self.pair:
            da = self.df.get(eid, 0)
            for x in C:
                n = self.pair.get((eid, x) if eid < x else (x, eid), 0)
                if n >= 2 and n >= 0.2 * min(da, self.df.get(x, 0) or 1):
                    s += 1
        return s

    def lookup(self, name):
        """Name -> id (Name, sonst eindeutiger nicht mehrdeutiger Treffer)."""
        lo = (name or "").strip().lower()
        if lo in self.by_name: return self.by_name[lo]
        fs = [f for f in self.forms.get(lo, []) if not f.common]
        return fs[0].eid if len({f.eid for f in fs}) == 1 else None

    # ---------------------------------------------------------------- Erkennung
    @staticmethod
    def _sentence_start(plain, s):
        k = s
        while k > 0 and plain[k - 1] in _OPEN: k -= 1
        return k == 0 or plain[k - 1] in _TERM

    def _cue(self, plain, s, e, lang, f):
        """Eigennamen-Stellung eines Allerweltsworts: gross mitten im Satz, keine Titel-Reihe; Marke davor ("Microsoft Places") zaehlt immer."""
        if (lang or "en")[:2] == "de" and f.text.lower() in DE_NOUNS:
            return False
        m = _WORD_L.search(plain, max(0, s - 40), s)
        pw = m.group(1) if m else ""
        if pw in BRANDS: return True
        if self._sentence_start(plain, s): return False
        if pw and pw[:1].isupper() and pw not in TITLE_OK and not self._sentence_start(plain, m.start(1)):
            return False
        n = _WORD_R.match(plain, e, min(len(plain), e + 40))
        nw = n.group(1) if n else ""
        if nw and nw[:1].isupper() and nw not in TITLE_OK and not _distinct(nw):
            return False
        return not self._titleish(plain, s, e)

    def _titleish(self, plain, s, e):
        """Zeile oder Satzstueck in Titel-Schreibung ("Attack Surface and Real Threats:", "Close the Loop:", "Long Shifts"): dort sagt die
        Grossschreibung nichts ueber einen Eigennamen."""
        a = s
        while a > 0 and plain[a - 1] not in _TERM and s - a < 160: a -= 1
        b = e
        while b < len(plain) and plain[b] not in _TERM and b - e < 160: b += 1
        words = [w for w in re.findall(r"[^\W\d_][\w'’-]*", plain[a:s] + " " + plain[e:b])
                 if w.lower() not in _STOPW and not _distinct(w) and w.lower() not in self.forms]   # Produktnamen in Aufzaehlungen sind kein Titel-Beleg
        if not words: return False
        caps = sum(1 for w in words if w[:1].isupper())
        label = (b < len(plain) and plain[b] == ":") or ((a == 0 or plain[a - 1] == "\n") and (b >= len(plain) or plain[b] == "\n") and len(words) <= 6)
        if label and caps == len(words): return True
        return len(words) >= 2 and caps >= 0.6 * len(words)

    def raw(self, plain):
        """Alle Kandidaten-Treffer: [(start, end, text, [Form])], laengste Form zuerst, ohne Ueberlappung."""
        out = []
        if not self.rx or not plain: return out
        acc = lambda t: [f for f in self.forms.get(t.lower(), ()) if f.accepts(t)]
        pos, n = 0, len(plain)
        while True:
            m = self.rx.search(plain, pos)
            if not m: break
            s0, e0, t = m.start(1), m.end(1), m.group(1)
            fs = acc(t)
            while not fs and e0 - 1 > s0:   # laengste Form passt nicht (z. B. "SharePoint lists" klein): kuerzere Form an derselben Stelle
                mm = self.rx.match(plain, s0, e0 - 1)
                if not mm: break
                e0, t = mm.end(1), mm.group(1)
                if e0 < n and (plain[e0].isalnum() or plain[e0] in "_-"): continue
                fs = acc(t)
            if fs:
                out.append((s0, e0, t, fs)); pos = e0
            else:
                pos = s0 + 1
        return out

    def resolve(self, plain, lang="en", ctx=(), hits=None):
        """Angenommene Nennungen [(start, end, text, id)] in der Reihenfolge des Textes. ctx: ids der Seite (eigene Entitaet, Themen, Kategorie)."""
        hits = self.raw(plain) if hits is None else hits
        sure, C = {}, set(ctx or ())
        for k, (s, e, t, fs) in enumerate(hits):
            ids = {f.eid for f in fs}
            names = [f for f in fs if f.is_name and not f.common and not f.qual]
            if len(ids) == 1 and not any(f.common or f.qual for f in fs):
                sure[k] = fs[0].eid
            elif len({f.eid for f in names}) == 1 and not any(f.common for f in fs if f.eid == names[0].eid):
                sure[k] = names[0].eid   # Name schlaegt Alias anderer Eintraege
        C |= set(sure.values())
        out = []
        for k, (s, e, t, fs) in enumerate(hits):
            if k in sure:
                out.append((s, e, t, sure[k])); continue
            best, bs, tie = None, 0, False
            for f in fs:
                if f.common and f.proper and not self._cue(plain, s, e, lang, f):
                    continue
                if not f.proper and f.common and " " not in f.text:
                    if not f.qual and f.eid not in C:
                        continue   # einteiliger Konzept-Kurzname ("harness", "workspace"): nur, wenn die Entitaet selbst Thema der Seite ist oder voll genannt wird
                    m = _WORD_L.search(plain, max(0, s - 40), s)
                    if m and m.group(1).lower() in VERB_BEFORE:
                        continue   # als Verb gebraucht ("might trigger", "you harness")
                    if f.eid not in C and not self._sentence_start(plain, s) and not (m and m.group(1).lower() in DETS):
                        continue   # Kurzname mit Zusatz nur als Nomen ("the trigger", "Grounding is ..."), nicht "change data, trigger actions"
                sc = self.support(f.eid, C - {f.eid} if f.eid not in (ctx or ()) else C, strict=not f.proper, qual=f.qual)
                if sc <= 0: continue
                sc = sc * 10 + (5 if f.is_name else 0)
                if best is None or sc > bs: best, bs, tie = f, sc, False
                elif sc == bs and f.eid != best.eid: tie = True
            if best is not None and not tie:
                out.append((s, e, t, best.eid))
        return out

    def ids(self, text, lang="en", ctx=(), generic=True):
        """{id: Zahl der Nennungen} in der Reihenfolge der ersten Nennung. generic=False: einteilige Nennungen der Sammelbegriffe (GENERIC) weglassen."""
        out = {}
        for _, _, t, i in self.resolve(text or "", lang, ctx):
            if not generic and i in GENERIC and " " not in t: continue
            out[i] = out.get(i, 0) + 1
        return out

    def ids_tags(self, text):
        """Schlagwortlisten ohne verlaessliche Schreibung (Tags der Dub-Folgen, oft klein): nur eindeutige Formen, die kein Allerweltswort und kein
        Kurzname mit Zusatz sind, ohne Beachtung der Schreibung. -> {id: Nennungen}"""
        out = {}
        if not self.rx or not text: return out
        for m in self.rx.finditer(text):
            fs = [f for f in self.forms.get(m.group(1).lower(), ()) if not f.common and not f.qual]
            if len({f.eid for f in fs}) == 1:
                out[fs[0].eid] = out.get(fs[0].eid, 0) + 1
        return out

    # ---------------------------------------------------------------- Kontext-Links
    def link_html(self, html, url_of, lang="en", ctx=(), exclude=(), used=None, cls="en-al", attrs=None, ent_of=None, dedupe=True):
        """Kontext-Links im HTML: erste Nennung je Entitaet (used: Menge der auf der Seite schon verlinkten ids, wird fortgeschrieben).
        url_of(id) -> Adresse; attrs(id, text) -> zusaetzliche Attribute (z. B. Glossar-Hover); ent_of(href) -> id fuer bestehende Links
        (Standard: /entity/<id>/ auf m365.fm). -> (html, [(text, id)])"""
        used = Used() if used is None else used
        excl = set(exclude or ()) | HOST
        ent_of = ent_of or _ent_of_href
        if not html: return html, []
        if dedupe:
            html = _dedupe(html, used, excl, ent_of)
        else:
            for m in _A.finditer(html):
                i = ent_of(_href(m.group(1)))
                if i: used.add(i)
        # Text in Stuecke: (html, plain_off, editierbar); Skip-Bereiche liefern Kontext, aber keine Links
        pieces, plain, pos = [], [], 0
        def add_text(seg, editable):
            nonlocal pos
            for tok in _TAGS.split(seg):
                if not tok: continue
                if tok.startswith("<"):
                    pieces.append((tok, -1, False))
                    if _BLOCK.match(tok): plain.append("\n"); pos += 1
                    continue
                pieces.append((tok, pos, editable)); plain.append(tok); pos += len(tok)
        last = 0
        for m in _SKIP.finditer(html):
            add_text(html[last:m.start()], True)
            plain.append("\n"); pos += 1
            pieces.append((m.group(0), -1, False))
            t = _TAGS.sub(" ", m.group(0)); plain.append(t); pos += len(t)   # Kontext aus Ueberschriften/Links
            plain.append("\n"); pos += 1
            last = m.end()
        add_text(html[last:], True)
        P = "".join(plain)
        C = set(ctx or ()) | {i for i in used if i not in HOST}
        hits = self.resolve(P, lang, C)
        if not hits: return html, []
        # Treffer auf editierbare Textstuecke abbilden
        spans = [(off, off + len(tok), n) for n, (tok, off, ed) in enumerate(pieces) if ed and off >= 0]
        rep, links = {}, []
        j = 0
        for s, e, t, i in hits:
            if i in used or i in excl or i not in self.live or self.live[i].get("type") in SKIP_TYPES: continue
            if i in GENERIC and " " not in t: continue
            while j < len(spans) and spans[j][1] <= s: j += 1
            if j >= len(spans) or not (spans[j][0] <= s and e <= spans[j][1]): continue
            u = url_of(i)
            if not u: continue
            used.add(i); links.append((t, i))
            rep.setdefault(spans[j][2], []).append((s - spans[j][0], e - spans[j][0], t, i, u))
        if not rep: return html, []
        out = []
        for n, (tok, off, ed) in enumerate(pieces):
            if n in rep:
                for a, b, t, i, u in sorted(rep[n], reverse=True):
                    nm = self.live[i].get("name") or ""
                    extra = attrs(i, t) if attrs else ""
                    ti = "" if t == nm or "title=" in extra else f' title="{_esc(nm)}"'
                    tok = tok[:a] + f'<a href="{_esc(u)}" class="{cls}"{ti}{extra}>{tok[a:b]}</a>' + tok[b:]
            out.append(tok)
        return "".join(out), links


_SKIP = re.compile(r"<(a|h[1-6]|code|pre|script|style|figure|figcaption|summary|button|svg|title|nav|textarea|select|label|kbd|samp|time)\b[^>]*>.*?</\1\s*>", re.S | re.I)
_TAGS = re.compile(r"(<[^>]+>)")
_BLOCK = re.compile(r"</?(p|li|ul|ol|div|section|article|br|tr|td|th|table|blockquote|dd|dt|dl|details|h[1-6]|hr|aside|main|header|footer)\b", re.I)
_A = re.compile(r"<a\b([^>]*)>(.*?)</a\s*>", re.S | re.I)
_HEAD = re.compile(r"<(h[1-6]|summary)\b[^>]*>.*?</\1\s*>", re.S | re.I)
_ENT_URL = re.compile(r"^(?:https?://(?:www\.)?m365\.fm)?(?:/[a-z]{2})?/entity/([a-z0-9][a-z0-9-]*)/?(?:[?#].*)?$")
_esc = lambda s: str(s).replace("&", "&amp;").replace('"', "&quot;").replace("<", "&lt;").replace(">", "&gt;")


def _href(attrs):
    m = re.search(r'\bhref\s*=\s*"([^"]*)"', attrs) or re.search(r"\bhref\s*=\s*'([^']*)'", attrs)
    return m.group(1).replace("&amp;", "&") if m else ""


def _ent_of_href(h):
    m = _ENT_URL.match(h or "")
    return m.group(1) if m else None


def linked_ids(html, ent_of=None):
    """ids der Entitaeten, auf die das HTML schon verlinkt (Beziehungssaetze, bestehende Links)."""
    ent_of = ent_of or _ent_of_href
    return {i for i in (ent_of(_href(m.group(1))) for m in _A.finditer(html or "")) if i}


def _dedupe(html, used, excl, ent_of):
    """Bestehende Entitaets-Links: Ueberschriften und Fragen ohne Link, Selbstverweise und weitere Links auf eine schon verlinkte Entitaet als Text."""
    def unwrap(m):
        i = ent_of(_href(m.group(1)))
        return m.group(2) if i else m.group(0)
    html = _HEAD.sub(lambda m: _A.sub(unwrap, m.group(0)), html)
    def one(m):
        i = ent_of(_href(m.group(1)))
        if not i: return m.group(0)
        if i in used or i in excl: return m.group(2)
        used.add(i); return m.group(0)
    return _A.sub(one, html)


_SHARED = {}


def shared(ents=None):
    """Der eine Index je Bau (aus site_learn.ENTS: Repo + D1 + Gaeste + Speaker, ohne zusammengefuehrte und veraltete Eintraege)."""
    if ents is None:
        import site_learn as LRN
        ents = LRN.ENTS
    k = (id(ents), len(ents))   # neue Eintraege (oder ein Test mit patch.dict) bauen den Index neu
    if k not in _SHARED:
        try:
            import site_learn as LRN
            merged = set(LRN.merge_targets())
        except Exception:
            merged = set()
        _SHARED[k] = Matcher(ents, cooc=cooc_from_extraction(), merged=merged)
    return _SHARED[k]


def url_in(BASE, lang):
    """Ziel eines Kontext-Links: die Entitaetsseite in der Sprache der Seite, wenn sie dort auf index steht, sonst die englische (site_topic_crumbs.crumb_url)."""
    import site_topic_crumbs as TC
    import site_learn as LRN
    @lru_cache(maxsize=None)
    def f(i):
        return TC.crumb_url(BASE, lang, i, LRN.ENTS) if lang != "en" else f"{BASE}/entity/{i}/"
    return f


def mentions(BASE, ids, about=()):
    """JSON-LD mentions: verlinkte Entitaeten (ohne die schon in about stehenden), mit @id der Entitaet und url ihrer Seite."""
    have = set(about or ())
    out = []
    for i in dict.fromkeys(ids or ()):
        if i in have: continue
        have.add(i); out.append({"@id": f"{BASE}/entity/{i}/#entity", "url": f"{BASE}/entity/{i}/"})
    return out
