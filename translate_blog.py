"""Uebersetzer-Team fuer Mirkos englische Blog-Originale in 14 Sprachen. Zwei Wege, gleiche Profile, gleiche Pruefung:

A) Haiku im Message Batch (guenstig, fuer die Masse) - laeuft als GitHub-Workflow translate-blog.yml:
   plan     Status + Kostenschaetzung (ohne Schluessel)
   submit   offene Uebersetzungen als Batch(es) absenden (Monatsbudget BLOG_BUDGET_USD)
   collect  fertige Batches abholen, pruefen (QA), speichern
   run      collect -> submit -> warten (WAIT_MIN) -> collect;  auto = run nur fuer Artikel der letzten NEW_DAYS Tage
B) Claude-Agenten hier in Claude (Cowork, ohne API) - fuer Nacharbeit, Reviews, wichtige Artikel:
   prepare  -> work/blog-i18n/<lang>/BRIEF.md + <key>.in.txt;  Agent schreibt <key>.out.txt;  apply -> pruefen, speichern
sample: Stichprobe fuer die Review-Agenten (data/blog_i18n/review/<lang>.json)
Optionen: --langs de,fr  --limit N (Artikel je Sprache, Batch)  --per-agent N  --order newest|oldest  --slugs a,b  --redo  --stale  --force-manual  --wishes
POLITIK (Mirko, 7.11.2026): Sprachfassungen werden nur EINMAL uebersetzt; danach sind sie Redaktionssache. Eine vorhandene Uebersetzung wird nie automatisch neu
uebersetzt oder ueberschrieben - auch nicht, wenn sich das englische Original aendert (auto/run/submit/prepare): die Quell-Hashes erkennen nur die Aenderung, die Einheit
bleibt mit altem Text stehen und wird in data/blog_i18n/stale.json {lang: {slug: [ids]}} fuer die Redaktion gelistet. Nie uebersetzte Einheiten (neu/fehlend) werden einmal
uebersetzt - auch neue Absaetze eines aelteren, schon uebersetzten Beitrags (Kennzeichen gap), damit dessen Fassung nicht verschwunden bleibt.
Neu uebersetzen nur auf Anforderung: --slugs/--redo (ganzer Beitrag; der alte Text bleibt stehen, bis die neue Fassung die Pruefung besteht), Modus `stale` bzw. --stale
(nur die geaenderten Einheiten veralteter Fassungen, --langs/--slugs/--limit; --wishes = nur die Wunschliste der Redaktion).
Von Hand bearbeitete Einheiten (Redaktion, i18n_overrides.py: kind lblog) sind eine reine Leseschicht ueber dem Maschinentext: assemble legt sie beim Seitenbau darueber, hier
sperren sie die Einheit nur fuer die Uebersetzung (auch bei --redo; Ausnahme --force-manual). In data/blog_i18n steht ausschliesslich Maschinentext.
Quell-Hashes: je Einheit merkt der Datensatz den Hash des Quelltexts, aus dem sie uebersetzt wurde (rec.sh, 8 Hex). Aendert sich das Original, ordnet realign die alten Texte
den neuen Einheiten zu (auch im Seitenbau, dort nur im Speicher); settle() speichert das vor jedem Lauf fuer ALLE Beitraege. Der Altbestand hat kein rec.sh: fuer ihn liegt einmalig
ein sprachunabhaengiger Schnappschuss der Quell-Hashes in data/blog_i18n/srch/ (rund 1,4 MB), die Schalen selbst werden dafuer nicht neu geschrieben.
Uebersetzungsspeicher (TM): nur im Speicher, nie auf der Platte oder in git - je Lauf und Sprache beim ersten Nachschlagen aus den gespeicherten Datensaetzen gebaut
{hash(Art + normalisierter Quelltext): Text}. Geaenderte Artikel schicken so nur neue Einheiten an Haiku; nur QA-gepruefter, nicht veralteter Text kommt hinein.
Profile: agents/blog-team/uebersetzer/<lang>.md (Systemprompt je Sprache). Quellen: data/podpage/blog_posts.json.gz (dieselben Beitraege liegen inzwischen in D1)
und die freigegebenen englischen Content-Pakete imports/blog/en/*.md (status: approved, site_content_blog.tr_sources; Schluessel content/<slug>, --slugs nimmt auch den nackten Slug).
Zwischenablage: data/blog_i18n/<lang>/<bucket>.json.gz {slug: {h, n, seg{id: text}, sh{id: quell-hash}, ok, m, ts, tries, gap}}; Seiten baut site_legacy_blog bzw. site_content_blog.translations.
"""
import gzip, hashlib, json, os, random, re, sys, time, urllib.request, urllib.error
from site_text import bad as bad_text
from difflib import SequenceMatcher
import i18n_overrides as OV
from tm_hash import unit_hash, kind_of
from datetime import datetime, timezone, timedelta
from pathlib import Path
from ai_gateway import anthropic_request, check_budget, estimated_eur, report_usage, urlopen

ROOT = Path(__file__).parent
OUT = ROOT / "data" / "blog_i18n"
TEAM = ROOT / "agents" / "blog-team"
SRC = ROOT / "data" / "podpage" / "blog_posts.json.gz"
LANGS = ("de", "fr", "es", "it", "nl", "pt", "pl", "id", "ru", "uk", "ar", "he", "ja", "ko")
NAMES = {"de": "German", "es": "Spanish", "fr": "French", "it": "Italian", "pt": "Brazilian Portuguese", "nl": "Dutch", "pl": "Polish", "id": "Indonesian", "ru": "Russian",
         "uk": "Ukrainian", "ar": "Arabic", "he": "Hebrew", "ja": "Japanese", "ko": "Korean"}
WORK = ROOT / "work" / "blog-i18n"
MODEL = os.environ.get("TRANSLATE_MODEL", "claude-haiku-5-5")
AGENT_MODEL = os.environ.get("AGENT_MODEL", "claude-agent")   # Herkunft bei Weg B
# Haiku 5.5 im Message Batch (50 % Rabatt, Prompts bis 100K Tokens), $ je 1 Mio. Tokens
PRICE_IN, PRICE_OUT = float(os.environ.get("PRICE_IN", "0.05")), float(os.environ.get("PRICE_OUT", "0.25"))
BUDGET = float(os.environ.get("BLOG_BUDGET_USD") or "10")   # Monatsbudget in USD (Mirko, 5.11.2026: 25 $ im Monat); zaehlt je Kalendermonat (UTC) neu
CHUNK = int(os.environ.get("CHUNK_CHARS", "4500"))        # Quelltext je Batch-Anfrage
MAX_TOK = int(os.environ.get("MAX_TOKENS", "16000"))
PER_BATCH = int(os.environ.get("PER_BATCH", "5000"))
WAIT_MIN = int(os.environ.get("WAIT_MIN", "300"))
# Ausgabe-Tokens je Quell-Token (Schaetzung bis Messwerte in usage.json da sind)
FACTOR = {**{l: 1.5 for l in LANGS}, "ru": 2.2, "uk": 2.2, "ar": 2.2, "he": 2.2, "ja": 1.8, "ko": 2.0}
PER_AGENT = int(os.environ.get("PER_AGENT", "2"))         # Artikel je Agent und Runde
NEW_DAYS = int(os.environ.get("NEW_DAYS", "14"))
BUCKETS = 16
# Namen, die nie uebersetzt werden duerfen (Pruefung: im Quelltext vorhanden -> muss in der Uebersetzung stehen)
KEEP = ["Microsoft 365", "Microsoft Teams", "SharePoint", "OneDrive", "Copilot Studio", "Copilot", "Power BI", "Power Apps", "Power Automate", "Power Platform", "Dataverse",
        "Azure", "Entra", "Intune", "Purview", "Defender", "Sentinel", "Fabric", "Exchange Online", "Outlook", "Excel", "PowerPoint", "Word", "Viva", "Loop", "Planner",
        "Dynamics 365", "GitHub", "Windows", "Microsoft Graph", "PowerShell", "Mirko Peters", "M365.FM", "M365 Show", "M365Con", "MVP"]
SCRIPT = {"ru": "Ѐ-ӿ", "uk": "Ѐ-ӿ", "ar": "؀-ۿ", "he": "֐-׿", "ja": "぀-ヿ一-鿿",
          "ko": "가-힯ᄀ-ᇿ"}
DENSE = {"ja": 2, "ko": 2}   # ein Kana/Kanji/Hangul-Zeichen traegt etwa so viel wie zwei lateinische Buchstaben
MAX_TRIES = int(os.environ.get("MAX_TRIES", "3"))   # danach sendet auto/submit einen Beitrag je Sprache nicht erneut (nur --slugs oder --redo)
BLOCK = {"p", "li", "h2", "h3", "h4", "blockquote", "td", "th", "ul", "ol", "table", "thead", "tbody", "tr", "hr", "pre"}


# ---------- Quelle und Segmente ----------
def posts():
    ps = [p for p in json.loads(gzip.open(SRC, "rt", encoding="utf-8").read()) if p.get("title") and p.get("html")] if SRC.exists() else []
    ps += content_posts()
    ps.sort(key=lambda p: p.get("iso") or "", reverse=True)
    return ps


def content_posts():
    """Freigegebene englische Content-Pakete (imports/blog/en/*.md) im Format der frueheren Beitraege; Schluessel content/<slug> (kollidiert nie mit einem Slug)."""
    import site_content_blog as CBL
    return CBL.tr_sources()


def segment(html_clean):
    """Zerlegt bereinigtes HTML (site_podpage.san) in Vorlage + Textsegmente. Bloecke bleiben Struktur, Inline-Inhalt wird Segment; <pre> bleibt unuebersetzt."""
    toks = re.split(r"(<[^>]+>)", html_clean)
    tpl, segs, buf, pre = [], [], [], 0

    def flush():
        s = re.sub(r"\s+", " ", "".join(buf)).strip()
        if s and re.sub(r"<[^>]+>|&\w+;|[\s\W\d_]+", "", s):
            segs.append(s); tpl.append(f"\x00{len(segs)}\x00")
        elif s: tpl.append(s)
        buf.clear()
    for t in toks:
        if not t: continue
        m = re.match(r"<\s*(/?)\s*([a-zA-Z0-9]+)", t)
        name = m.group(2).lower() if m else None
        if name == "pre":
            flush(); tpl.append(t); pre += -1 if m.group(1) else 1; pre = max(0, pre); continue
        if pre: tpl.append(t); continue
        if name in BLOCK: flush(); tpl.append(t)
        else: buf.append(t)
    flush()
    return "".join(tpl), segs


_SRC = {}   # Inhalts-Hash -> (tpl, units, h): der Seitenbau ruft source_of je Beitrag und Sprache auf (14 x, und items() zweimal) - einmal zerlegen reicht


def source_of(p):
    """Alle zu uebersetzenden Einheiten eines Beitrags: T (Titel), D (Beschreibung), Q/A (FAQ), 1..n (Absaetze).
    Ergebnis je Inhalt (HTML, Titel, Beschreibung, FAQ) gemerkt; dieselbe Eingabe ergibt dasselbe Ergebnis, units wird als Kopie zurueckgegeben."""
    ck = hashlib.sha1(json.dumps([p["html"], p["title"], p.get("desc"), p.get("faq")], ensure_ascii=False, sort_keys=True, default=str).encode("utf-8")).hexdigest()
    if ck in _SRC:
        tpl, units, h = _SRC[ck]
        return tpl, list(units), h
    tpl, units, h = _source_of(p)
    _SRC[ck] = (tpl, tuple(units), h)
    return tpl, units, h


def _source_of(p):
    import site_podpage as P
    tpl, segs = segment(P.san(p["html"]))
    units = [("T", p["title"].strip())]
    if (p.get("desc") or "").strip(): units.append(("D", p["desc"].strip()))
    for i, q in enumerate([q for q in (p.get("faq") or []) if q.get("name") and (q.get("acceptedAnswer") or {}).get("text")], 1):
        units += [(f"Q{i}", q["name"].strip()), (f"A{i}", P.plain(q["acceptedAnswer"]["text"]))]
    units += [(str(i), s) for i, s in enumerate(segs, 1)]
    h = hashlib.sha1(json.dumps(units, ensure_ascii=False).encode()).hexdigest()[:16]
    return tpl, units, h


def key(slug): return hashlib.sha1(slug.encode()).hexdigest()[:12]
def bucket(slug): return int(hashlib.sha1(slug.encode()).hexdigest()[:2], 16) % BUCKETS


# ---------- Speicher ----------
def load_lang(lang):
    d = OUT / lang; res = {}
    if d.exists():
        for f in sorted(d.glob("*.json.gz")): res.update(json.loads(gzip.open(f, "rt", encoding="utf-8").read()))
    return res


def save_lang(lang, data, only_buckets=None):
    d = OUT / lang; d.mkdir(parents=True, exist_ok=True)
    by = {}
    for s, r in data.items(): by.setdefault(bucket(s), {})[s] = r
    for b in range(BUCKETS):
        if only_buckets is not None and b not in only_buckets: continue
        f = d / f"{b:02x}.json.gz"
        if by.get(b): f.write_bytes(gzip.compress(json.dumps(by[b], ensure_ascii=False, sort_keys=True).encode(), mtime=0))
        elif f.exists(): f.unlink()


# ---------- Quell-Hashes, Uebersetzungsspeicher (TM), Zuordnung ----------
_UH = {}   # Quell-Hash h eines Beitrags -> ({id: unit_hash, 16 Hex}, {id: Quell-Anker, 8 Hex}); je Original einmal rechnen (14 Sprachen, Status, TM)


def h8(h): return h[:8]


def unit_hashes(units, h):
    if h not in _UH:
        full = {i: unit_hash(i, t) for i, t in units}; _UH[h] = (full, {i: h8(x) for i, x in full.items()})
    return _UH[h]


def new_rec(h, units): return {"h": h, "n": len(units), "seg": {}, "sh": {}, "ok": False}


def ordkey(i):
    i = str(i)
    if i == "T": return (0, 0, 0)
    if i == "D": return (1, 0, 0)
    n = int(re.sub(r"\D", "", i) or 0)
    return (2, n, 0) if i[0] == "Q" else (2, n, 1) if i[0] == "A" else (3, n, 0)


class TM:
    """Uebersetzungsspeicher einer Sprache {unit_hash(Art + normalisierter Quelltext): Text}. Nur im Speicher, nie auf der Platte oder in git (eine gz-Datei je Sprache
    waeren 17-27 MB, die bei jeder neuen Einheit komplett neu ins Repo kaemen): beim ersten Nachschlagen aus den gespeicherten Datensaetzen gebaut - nur
    Einheiten, deren Text zum aktuellen Quelltext passt (nicht veraltet). Was die QA nicht bestanden hat, steht in keinem Datensatz und damit nie hier."""

    def __init__(self, lang, have, ps): self.lang, self.have, self.ps, self.d = lang, have, ps, None

    def build(self):
        self.d = {}
        for p in self.ps:
            rec = self.have.get(p["slug"])
            if not rec or not rec.get("seg"): continue
            tpl, units, h = source_of(p)
            if rec.get("h") != h: continue   # ids passen nur zum Original dieser Fassung
            full, a8 = unit_hashes(units, h); sh = rec.get("sh") or {}
            for i, x in rec["seg"].items():
                if x and i in full and sh.get(i, a8[i]) == a8[i]: self.d[full[i]] = x
        return self.d

    def get(self, k, default=None): return (self.d if self.d is not None else self.build()).get(k, default)
    def __len__(self): return len(self.d if self.d is not None else self.build())


_SNAP = {}


def snap():
    """Quell-Anker des Altbestands: data/blog_i18n/srch/<bucket>.json.gz {slug: [h, "T D 1 2 ...", "<8 Hex je Einheit>"]}. Datensaetze von vor den Quell-Hashes
    haben kein rec.sh; solange ihr Original unveraendert ist, laesst es sich aus dem Quelltext rechnen - danach nicht mehr. settle() haelt die Anker deshalb fest,
    solange Datensatz und Original zusammenpassen: sprachunabhaengig, einmalig rund 1,4 MB, statt sh in alle 224 Schalen nachzutragen (rund 210 MB in einem Commit)."""
    if _SNAP.get("dir") != OUT:
        d = {}
        for f in sorted((OUT / "srch").glob("*.json.gz")) if (OUT / "srch").exists() else []: d.update(json.loads(gzip.open(f, "rt", encoding="utf-8").read()))
        _SNAP.clear(); _SNAP.update({"dir": OUT, "d": d})
    return _SNAP["d"]


def save_snap(buckets):
    d = OUT / "srch"; d.mkdir(parents=True, exist_ok=True); by = {}
    for s, v in snap().items(): by.setdefault(bucket(s), {})[s] = v
    for b in sorted(buckets): (d / f"{b:02x}.json.gz").write_bytes(gzip.compress(json.dumps(by.get(b, {}), ensure_ascii=False, sort_keys=True).encode(), mtime=0))


def old_hashes(slug, rec):
    """Quell-Anker je uebersetzter Einheit eines Datensatzes, dessen Original sich geaendert hat: rec.sh, beim Altbestand ergaenzt aus dem Schnappschuss
    derselben Fassung (h). Leer = keine Zuordnung moeglich."""
    sh = dict(rec.get("sh") or {}); s = snap().get(slug)
    if s and s[0] == rec.get("h"):
        for i, x in zip(s[1].split(" "), re.findall(".{8}", s[2])): sh.setdefault(i, x)
    return {i: x for i, x in sh.items() if i in rec.get("seg", {})}


def rec_hashes(rec, a8):
    """Quell-Anker je uebersetzter Einheit bei unveraendertem Original (rec.h == h): rec.sh; ohne Eintrag (Altbestand) der aktuelle Quelltext."""
    sh = rec.get("sh") or {}
    return {i: sh.get(i, a8[i]) for i in rec.get("seg", {}) if i in a8}


def manual_ids(lang, slug, units, h, rec):
    """Einheiten des aktuellen Originals mit Handtext der Redaktion: {id: (text, "ok" | "stale")} - ueber den Quell-Anker zugeordnet (i18n_overrides.place),
    nie ueber die Nummer allein. Reine Leseschicht: nichts davon steht in rec."""
    ov = OV.get("lblog", lang, slug)
    if not ov: return {}
    a8 = unit_hashes(units, h)[1]
    placed, lost = OV.place(ov, a8, rec_hashes(rec, a8) if rec and rec.get("h") == h else None)
    if lost: OV.note("lblog", lang, "verwaist (Absatz geloescht oder neu uebersetzt, nicht angewendet)", len(lost))
    return placed


def stale_ids(rec, units, h, manual=None):
    """Einheiten, deren angezeigter Text zu einem aelteren englischen Quelltext gehoert (Text bleibt stehen, Redaktion entscheidet). Mit Handtext entscheidet
    dessen Anker (manual aus manual_ids), sonst der Quell-Hash des Maschinentexts."""
    a8 = unit_hashes(units, h)[1]; sh = rec_hashes(rec, a8); man = manual or {}
    return [i for i, _ in units if (man[i][1] == "stale" if i in man else (i in sh and sh[i] != a8[i]))]


def fresh(rec, i, t):
    """Einheit hat eine zum aktuellen Quelltext passende Uebersetzung (nichts mehr zu tun)."""
    return i in rec["seg"] and (rec.get("sh") or {}).get(i, h8(unit_hash(i, t))) == h8(unit_hash(i, t))


def store(rec, i, t, text, manual=(), force=False):
    """Maschinentext einer QA-geprueften Einheit speichern; nie ueber eine gesperrte (Handtext) und nur mit force (--redo) ueber eine aktuelle Einheit. -> True wenn gespeichert."""
    if i in manual or (not force and fresh(rec, i, t)): return False
    rec["seg"][i] = text; rec.setdefault("sh", {})[i] = h8(unit_hash(i, t)); return True


def realign(old, osh, units, h, tm=None):
    """Quelle hat sich geaendert: vorhandene Uebersetzungen auf die neuen ids abbilden (difflib ueber die Quell-Anker osh des alten Datensatzes). Gleiche Einheiten
    wandern mit (auch bei eingefuegten Absaetzen), geaenderte behalten den alten Text (-> stale), neue bleiben offen. Kennt das TM genau den neuen Quelltext
    eines ersetzten Absatzes, bleibt er offen und resolve nimmt den Treffer statt des Textes eines anderen Absatzes."""
    rec = {**new_rec(h, units), **{k: old[k] for k in ("m", "ts") if k in old}}
    opairs = [(i, osh[i]) for i in sorted(osh, key=ordkey)]
    full, a8 = unit_hashes(units, h); new = [(i, a8[i]) for i, _ in units]
    for tag, i1, i2, j1, j2 in SequenceMatcher(None, [x[1] for x in opairs], [x[1] for x in new], autojunk=False).get_opcodes():
        if tag == "equal":
            for k in range(i2 - i1):
                (oi, _), (ni, nh) = opairs[i1 + k], new[j1 + k]; rec["seg"][ni] = old["seg"][oi]; rec["sh"][ni] = nh
        elif tag == "replace":
            for k in range(min(i2 - i1, j2 - j1)):
                (oi, oh), (ni, nh) = opairs[i1 + k], new[j1 + k]
                if kind_of(oi) != kind_of(ni) or (tm is not None and tm.get(full[ni])): continue
                rec["seg"][ni] = old["seg"][oi]; rec["sh"][ni] = oh   # alter Hash bleibt -> stale
    return rec


def current(slug, rec, units, h, tm=None):
    """Datensatz passend zum aktuellen Original, ohne etwas zu speichern oder zu veraendern: unveraendert der gespeicherte; Original geaendert -> realign;
    None, wenn es keinen gibt oder keine Zuordnung moeglich ist (Altbestand ohne Quell-Anker: wie bisher nicht mehr anzeigbar)."""
    if not rec or rec.get("h") == h: return rec or None
    osh = old_hashes(slug, rec)
    return realign(rec, osh, units, h, tm) if osh else None


def resolve(lang, p, units, h, have, tm=None):
    """Aktueller Maschinen-Datensatz des Beitrags. Unveraendert: wie gespeichert. Original geaendert: realign (alte Texte bleiben, geaenderte werden stale). Fehlende
    Einheiten kommen aus dem TM, wenn der Quelltext dort steht (tm=None: ohne TM). -> (rec, dirty); dirty = gegenueber have geaendert, speichern. Ein Altbestand
    ohne Zuordnung beginnt leer und wird erst gespeichert, wenn etwas dazukommt (der alte Datensatz bleibt bis dahin liegen)."""
    old = have.get(p["slug"]); rec = current(p["slug"], old, units, h, tm)
    dirty = rec is not None and rec is not old and bool(rec["seg"])
    if rec is None: rec = new_rec(h, units)
    if tm is not None:
        full, a8 = unit_hashes(units, h)
        for i, t in units:
            if i not in rec["seg"]:
                hit = tm.get(full[i])
                if hit: rec["seg"][i] = hit; rec.setdefault("sh", {})[i] = a8[i]; dirty = True
    if all(i in rec["seg"] for i, _ in units):
        if not rec.get("ok") or rec.get("gap"):
            rec["ok"] = True; rec.setdefault("m", "tm"); rec.setdefault("ts", datetime.now(timezone.utc).strftime("%Y-%m-%d")); rec.pop("tries", None); rec.pop("gap", None); dirty = True
    elif rec is not old and old and (old.get("ok") or old.get("gap")) and rec["seg"]:
        rec["gap"] = True   # vorher vollstaendige Fassung, dem geaenderten Original fehlen neue Einheiten: auto uebersetzt sie nach (auch bei aelteren Beitraegen)
    return rec, dirty


def settle(ps, langs=None):
    """Ohne API, vor jedem schreibenden Lauf, ueber ALLE Beitraege und Sprachen (nicht nur die Auswahl des Laufs; auto sieht sonst nur die letzten NEW_DAYS Tage):
    1. Original geaendert -> Datensatz auf die neuen Einheiten abbilden und speichern, damit die Fassung sichtbar bleibt und status.json/stale.json zum Speicher passen.
    2. Altbestand ohne rec.sh -> Quell-Anker im Schnappschuss festhalten, solange das Original noch dazu passt (siehe snap).
    Nur Datensaetze mit geaendertem Original werden neu geschrieben. -> Anzahl nachgezogener Datensaetze."""
    n = 0; sd = snap(); want = {}
    for lang in langs or LANGS:
        have = load_lang(lang)
        if not have: continue
        tm = TM(lang, have, ps); touched = set()
        for p in ps:
            old = have.get(p["slug"])
            if not old: continue
            tpl, units, h = source_of(p)
            if old.get("h") == h:
                if (sd.get(p["slug"]) or [None])[0] != h and p["slug"] not in want and any(i not in (old.get("sh") or {}) for i in old.get("seg", {})):
                    a8 = unit_hashes(units, h)[1]; want[p["slug"]] = [h, " ".join(i for i, _ in units), "".join(a8[i] for i, _ in units)]
                continue
            if not old_hashes(p["slug"], old): continue   # Altbestand ohne Quell-Anker: keine Zuordnung, Datensatz bleibt unangetastet (offen wie bisher)
            rec, dirty = resolve(lang, p, units, h, have, tm)
            if dirty: have[p["slug"]] = rec; touched.add(bucket(p["slug"])); n += 1
        if touched: save_lang(lang, have, touched)
    if want:   # erst nach allen Sprachen: eine andere Sprache kann die bisherigen Anker in diesem Lauf noch gebraucht haben
        sd.update(want); save_snap({bucket(s) for s in want})
    if n: print(f"{n} Datensaetze auf geaenderte Originale nachgezogen (ohne API)")
    return n


def jload(name, default):
    f = OUT / name
    return json.loads(f.read_text("utf-8")) if f.exists() else default


def jsave(name, obj):
    OUT.mkdir(parents=True, exist_ok=True); (OUT / name).write_text(json.dumps(obj, ensure_ascii=False, indent=1), encoding="utf-8")


def shown(p, rec, lang=None):
    """Was der Seitenbau von einer Sprachfassung zeigt: (units, h, rec, texte {id: text}, hand {id: (text, zustand)}) oder None, solange sie nicht vollstaendig ist.
    Original geaendert -> alte Texte den neuen Einheiten zugeordnet (current, nur im Speicher). Mit lang liegen die Handtexte der Redaktion darueber: ueber den
    Quell-Anker gesetzt und beim Anwenden bereinigt (i18n_overrides, Vertrag 4) - der Datei wird nie vertraut."""
    if not rec: return None
    tpl, units, h = source_of(p)
    rec = current(p["slug"], rec, units, h)
    if not rec: return None   # Altbestand ohne Zuordnung: alte Uebersetzung nicht mehr anzeigen
    sg = dict(rec["seg"]); man = manual_ids(lang, p["slug"], units, h, rec) if lang else {}
    for i, (t, _) in man.items():
        t = OV.clean("lblog", i, t)
        if t.strip(): sg[i] = t
    if not rec.get("ok") and not all(i in sg for i, _ in units): return None
    return units, h, rec, sg, man


def assemble(p, rec, lang=None):
    """Fertige Sprachfassung: (titel, beschreibung, html, faq) oder None, solange nicht vollstaendig."""
    v = shown(p, rec, lang)
    if not v: return None
    sg = v[3]
    html = re.sub("\x00(\\d+)\x00", lambda m: sg.get(m.group(1), ""), source_of(p)[0])
    faq, i = [], 1
    while f"Q{i}" in sg:
        faq.append({"@type": "Question", "name": sg[f"Q{i}"], "acceptedAnswer": {"@type": "Answer", "text": sg.get(f"A{i}", "")}}); i += 1
    return sg.get("T", p["title"]), sg.get("D", ""), html, faq


def editor_view(lang, p, rec):
    """Fuer die Redaktion (#319, docs/i18n-units): die Einheiten einer angezeigten Fassung, so wie assemble sie zeigt. None, wenn die Fassung nicht erscheint.
    -> {"units": [[id, original, angezeigter Text, Quell-Anker]], "stale": [ids], "edited": [ids]}; der Anker ist das "sh", das beim Speichern eines Handtexts mitgeht."""
    v = shown(p, rec, lang)
    if not v: return None
    units, h, rec, sg, man = v; a8 = unit_hashes(units, h)[1]
    return {"units": [[i, t, sg.get(i, ""), a8[i]] for i, t in units], "stale": stale_ids(rec, units, h, man), "edited": sorted(man, key=ordkey)}


# ---------- Agenten-Profile ----------
from functools import lru_cache


@lru_cache(None)
def profile(lang):
    f = TEAM / "uebersetzer" / f"{lang}.md"
    t = f.read_text("utf-8") if f.exists() else ""
    return re.sub(r"^---.*?---\s*", "", t, flags=re.S).strip()


@lru_cache(None)
def system_prompt(lang):
    return (f"You are the {NAMES[lang]} translator agent of the M365.FM translation team. You translate English blog articles written by Microsoft MVP Mirko Peters "
            f"(Microsoft 365, Azure, Power Platform, Copilot, security) into natural, fluent, professional {NAMES[lang]} for IT professionals and decision makers.\n\n"
            "TEAM RULES (always):\n"
            "1. Translate meaning, not word for word. It must read as if written natively. Do not add, drop, summarise or comment on content.\n"
            "2. NEVER translate names: product and feature brand names (Microsoft 365, Copilot, Teams, SharePoint, Power BI, Entra ID, Purview, Fabric ...), "
            "people, companies, events (M365.FM, M365 Show, M365Con), session and episode titles in quotes, code, cmdlets, file names, URLs, licence SKUs (E3, E5).\n"
            "3. Keep every inline HTML tag and its attributes exactly as in the source (<strong>, <em>, <a href=\"...\">, <code>, <br>, <img ...>); translate only the text between tags. "
            "Keep HTML entities valid. Never translate text inside <code>.\n"
            "4. Output format: the same markers as the input ([[T]], [[D]], [[Q1]], [[A1]], [[1]], [[2]] ...), each marker at the start of a new line followed by its translation, "
            "same order, every marker exactly once, nothing else (no intro, no notes, no code fences).\n"
            "5. Follow your language profile below (style, address form, typography, Microsoft terminology, glossary). The glossary wins over your own preference.\n\n"
            f"YOUR LANGUAGE PROFILE ({lang}):\n{profile(lang)}")


def user_prompt(lang, units):
    body = "\n".join(f"[[{i}]] {t}" for i, t in units)
    return f"Translate every segment into {NAMES[lang]}. Keep the markers.\n\n{body}"


def open_units(rec, units, h, stale=False, manual=()):
    """Was jetzt zu uebersetzen ist: normal nur nie uebersetzte Einheiten; im Modus stale nur die geaenderten Einheiten veralteter Fassungen. Gesperrte (Handtext) nie."""
    if stale:
        sid = set(stale_ids(rec, units, h)); return [(i, t) for i, t in units if i in sid and i not in manual]
    return [(i, t) for i, t in units if i not in rec["seg"] and i not in manual]


def wanted_units(a, rec, units, h, manual=()):
    """Auftrag eines Laufs fuer einen Beitrag: --redo = alle nicht gesperrten Einheiten (der gespeicherte Text bleibt bis zum Ergebnis stehen), sonst open_units."""
    return [(i, t) for i, t in units if i not in manual] if a.get("redo") else open_units(rec, units, h, a.get("stale"), manual)


def chunks(units, have):
    """Offene Einheiten in Anfragen zu ~CHUNK Zeichen; T/D/FAQ zuerst."""
    todo = [(i, t) for i, t in units if i not in have]
    out, cur, n = [], [], 0
    for u in todo:
        if cur and n + len(u[1]) > CHUNK: out.append(cur); cur, n = [], 0
        cur.append(u); n += len(u[1])
    if cur: out.append(cur)
    return out


# ---------- Pruefung (QA) ----------
TAG = re.compile(r"<\s*(/?[a-zA-Z0-9]+)")
HREF = re.compile(r'href="([^"]*)"')


def _plain(s):
    """Buchstaben ohne Tags, Entities, Ziffern, <code>-Inhalt und geschuetzte Namen (KEEP) - Grundlage der Schrift-Pruefung."""
    s = re.sub(r"<code\b[^>]*>.*?</code>", " ", s, flags=re.S | re.I)
    for k in KEEP: s = s.replace(k, " ")
    return re.sub(r"<[^>]+>|&\w+;|[\W\d_]", "", s)


def qa(lang, src, out):
    """Gibt (ok, grund, warnung) zurueck. Harte Fehler -> Segment wird nicht gespeichert und spaeter neu uebersetzt."""
    if not out.strip(): return False, "leer", None
    if sorted(TAG.findall(src)) != sorted(TAG.findall(out)): return False, "html-tags", None
    if sorted(HREF.findall(src)) != sorted(HREF.findall(out)): return False, "links", None
    if lang in SCRIPT and len(_plain(src)) >= 20:
        # Code und Produktnamen bleiben lateinisch (Regel im System-Prompt) und zaehlen hier nicht mit, sonst fiele z. B. ein
        # reiner <code>-Absatz oder "Azure Center for SAP solutionsとは何ですか？" bei jedem Versuch durch
        alpha = _plain(out); raw = len(re.findall(f"[{SCRIPT[lang]}]", alpha)); own = raw * DENSE.get(lang, 1)
        if own < 0.25 * max(1, own + len(alpha) - raw): return False, "falsche-schrift", None
    words = re.findall(r"[a-zA-Z]+", re.sub(r"<[^>]+>", " ", src))
    if lang not in SCRIPT and out.strip() == src.strip() and len(words) >= 8: return False, "unuebersetzt", None
    if len(src) >= 80 and not (0.3 <= len(out) / len(src) <= 5): return False, "laenge", None
    miss = [k for k in KEEP if re.search(rf"(?<!\w){re.escape(k)}(?!\w)", src) and k not in out]
    return True, None, (("name-fehlt:" + ",".join(miss[:4])) if miss else None)


MARK = re.compile(r"^\s*\[\[([TD]|[QA]\d+|\d+)\]\]\s?", re.M)


def parse(text):
    parts = MARK.split(text.strip())
    res = {}
    for i in range(1, len(parts) - 1, 2):
        res[parts[i]] = parts[i + 1].strip()
    return res


# ---------- Runden fuer die Agenten ----------
def locked(a, lang, p, units, h, rec):
    """Einheiten mit Handtext der Redaktion: fuer die Uebersetzung gesperrt, ausser mit --force-manual."""
    return {} if a.get("force_manual") else manual_ids(lang, p["slug"], units, h, rec)


def pick(a, lang, have, ps, busy, tm=None, touched=None):
    n = a["per_agent"] or PER_AGENT
    out = []
    for p in ps:
        if len(out) >= n: break
        if p["slug"] in busy: continue
        if QUEUE and p["slug"] not in QUEUE.get(lang, ()) and p.get("cp_slug") not in QUEUE.get(lang, ()): continue   # Vormerkliste: nur die fuer diese Sprache markierten Beitraege
        tpl, units, h = source_of(p)
        rec, dirty = resolve(lang, p, units, h, have, None if a["redo"] else tm)
        if dirty:
            have[p["slug"]] = rec
            if touched is not None: touched.add(bucket(p["slug"]))
        if not wanted_units(a, rec, units, h, locked(a, lang, p, units, h, rec)): continue   # normal: fertig; stale: nichts veraltet; redo: alles gesperrt
        out.append((p, units, h, rec))
    return out


def prepare(a):
    """Legt fuer jede Sprache die Auftraege der naechsten Runde an (bestehende, noch nicht angewendete Auftraege bleiben)."""
    allps = posts(); langs, ps = select(a, allps); total = 0
    for lang in langs:
        d = WORK / lang; d.mkdir(parents=True, exist_ok=True)
        busy = {json.loads(f.read_text("utf-8").split("\n", 1)[0][2:]).get("slug") for f in d.glob("*.in.txt")}
        have = load_lang(lang); touched = set(); new = pick(a, lang, have, ps, busy, TM(lang, have, allps), touched)
        if touched: save_lang(lang, have, touched)   # komplett aus dem TM aufgefuellte Beitraege ohne API fertig
        for p, units, h, rec in new:
            todo = wanted_units(a, rec, units, h, locked(a, lang, p, units, h, rec))
            head = json.dumps({"slug": p["slug"], "h": h, "lang": lang, **({"fm": True} if a.get("force_manual") else {}), **({"redo": True} if a.get("redo") else {})}, ensure_ascii=False)   # fm/redo gelten auch beim Anwenden
            (d / f"{key(p['slug'])}.in.txt").write_text(f"# {head}\n" + "\n".join(f"[[{i}]] {t}" for i, t in todo) + "\n", encoding="utf-8")
        (d / "BRIEF.md").write_text(system_prompt(lang) + f"""

## YOUR JOB IN THIS ROUND
In the folder {d} you find one or more files `<id>.in.txt`. The first line (starting with `# {{`) is metadata - do not translate it.
For EACH `<id>.in.txt` write a file `<id>.out.txt` in the same folder that contains ONLY the translated segments:
every marker line from the input ([[T]], [[D]], [[Q1]], [[A1]], [[1]] ...) exactly once, same order, marker at the start of the line, followed by the {NAMES[lang]} translation.
No metadata line, no comments, no code fences. Translate the whole file, never stop early, never summarise. Long files: write the output in one go with the Write tool.
When done, answer with one line per file: `<id>: <number of segments> segments`.
""", encoding="utf-8")
        jobs = sorted(f.name for f in d.glob("*.in.txt")); total += len(jobs)
        print(f"{lang}: {len(jobs)} Auftraege ({len(new)} neu) in {d}")
    return total


def apply(a=None):
    """Prueft alle <id>.out.txt, speichert gute Segmente, entfernt erledigte Auftraege, schreibt offene Segmente zurueck in die .in.txt."""
    stats = {}
    for d in sorted(WORK.glob("*")) if WORK.exists() else []:
        lang = d.name
        if lang not in LANGS: continue
        have = load_lang(lang); touched = set(); qa_log = []; ok = bad = done = 0; why = {}
        for fin in sorted(d.glob("*.in.txt")):
            fout = fin.with_name(fin.name.replace(".in.txt", ".out.txt"))
            if not fout.exists(): continue
            meta = json.loads(fin.read_text("utf-8").split("\n", 1)[0][2:]); p = BY_SLUG.get(meta["slug"])
            if not p: fin.unlink(); fout.unlink(); continue
            tpl, units, h = source_of(p)
            if h != meta["h"]: fin.unlink(); fout.unlink(); continue   # Original geaendert -> neu vorbereiten
            src = dict(units); rec, _ = resolve(lang, p, units, h, have); man = locked({"force_manual": meta.get("fm")}, lang, p, units, h, rec)
            asked = set(parse(fin.read_text("utf-8").split("\n", 1)[1])); redo = bool(meta.get("redo")); stored = set()
            for i, t in parse(fout.read_text("utf-8")).items():
                if i not in src: continue
                good, reason, warn = qa(lang, src[i], t)
                if good:
                    txt = __import__("site_podpage").san(t) if ("<" in t or "&" in t) else t
                    if not store(rec, i, src[i], txt, man, redo and i in asked): continue   # schon aktuell oder gesperrt: nie ueberschreiben (--redo: nur die angefragten Einheiten)
                    ok += 1; stored.add(i)
                    if warn: qa_log.append({"slug": p["slug"], "seg": i, "warn": warn})
                else:
                    bad += 1; why[reason] = why.get(reason, 0) + 1
                    qa_log.append({"slug": p["slug"], "seg": i, "fehler": reason, "src": src[i][:160], "out": t[:160]})
            rec["ok"] = all(i in rec["seg"] for i in src); rec["m"] = AGENT_MODEL; rec["ts"] = datetime.now(timezone.utc).strftime("%Y-%m-%d")
            if rec["ok"]: rec.pop("gap", None)
            have[p["slug"]] = rec; touched.add(bucket(p["slug"])); fout.unlink()
            todo = [(i, t) for i, t in units if i not in man and i not in stored and ((redo and i in asked) or (not fresh(rec, i, t) and (i in asked or i not in rec["seg"])))]
            if rec["ok"] and not todo: fin.unlink(); done += 1
            else:
                fin.write_text(fin.read_text("utf-8").split("\n", 1)[0] + "\n" + "\n".join(f"[[{i}]] {t}" for i, t in todo) + "\n", encoding="utf-8")
        if touched: save_lang(lang, have, touched)
        if qa_log:
            (OUT / "qa").mkdir(parents=True, exist_ok=True); f = OUT / "qa" / f"{lang}.json"
            old = json.loads(f.read_text("utf-8")) if f.exists() else []
            f.write_text(json.dumps((old + qa_log)[-500:], ensure_ascii=False, indent=1), encoding="utf-8")
        stats[lang] = {"artikel_fertig": done, "segmente_ok": ok, "segmente_fehler": bad, "gruende": why, "offen": len(list(d.glob("*.in.txt")))}
        print(lang, stats[lang])
    log = jload("rounds.json", []); log.append({"ts": datetime.now(timezone.utc).isoformat()[:19], "stats": stats}); jsave("rounds.json", log[-300:])
    return stats


def queue_items():
    """Vormerkliste aus der Verwaltung (/admin/ -> Uebersetzungen): {lang: {slugs}} fuer fruehere Blogbeitraege (kind lblog)."""
    api = os.environ.get("COMMUNITY_API", "https://api-dub.m365.fm")
    try:
        with urllib.request.urlopen(urllib.request.Request(api + "/api/tr-queue", headers={"user-agent": "m365-dub-build"}), timeout=30) as r:
            items = json.loads(r.read().decode("utf-8")).get("items", [])
    except Exception as e:
        print("Vormerkliste nicht abrufbar:", str(e)[:100]); return {}
    out = {}
    for it in items:
        if it.get("kind") == "lblog" and it.get("lang") in LANGS: out.setdefault(it["lang"], set()).add(it["item_id"])
    return out


QUEUE = {}
WISH = {}   # --wishes: {lang: {slug: [ids]}} aus der Wunschliste der Redaktion (i18n_overrides.wishes, Vertrag 8)


def select(a, ps):
    langs = a["langs"]; sl = set(a["slugs"])
    if a.get("queue"):   # nur vorgemerkte Beitraege und nur deren Sprachen
        QUEUE.clear(); QUEUE.update(queue_items()); langs = [l for l in langs if QUEUE.get(l)]
        sl = sl | set().union(*QUEUE.values()) if QUEUE else {"-"}
        print("Vormerkliste:", {l: len(v) for l, v in QUEUE.items()} or "leer")
    if a.get("wishes"):   # nur die von der Redaktion gewuenschten Beitraege und Sprachen (submit beschraenkt auf die gewuenschten Einheiten)
        WISH.clear(); WISH.update({l: v for l, v in OV.wishes("lblog").items() if l in LANGS}); langs = [l for l in langs if WISH.get(l)]
        w = set().union(*[set(v) for v in WISH.values()]) if WISH else set(); sl = ((sl & w) if sl else w) or {"-"}
        print("Wunschliste:", {l: len(v) for l, v in WISH.items()} or "leer")
    if sl: ps = [p for p in ps if p["slug"] in sl or p.get("cp_slug") in sl]   # Content-Pakete auch ueber den nackten Slug
    if a["mode"] == "auto":
        lim = (datetime.now(timezone.utc) - timedelta(days=NEW_DAYS)).isoformat()
        ps = [p for p in ps if (p.get("iso") or "") >= lim]
    if a["order"] == "oldest": ps = list(reversed(ps))
    return langs, ps


# ---------- API ----------
def api(method, path, body=None, raw=False):
    req = anthropic_request(path, body, job="translate_blog", lang="batch", model=MODEL, api_key=os.environ["ANTHROPIC_API_KEY"])
    req.method = method
    try:
        r = urlopen(req, timeout=900).read()
        return r if raw else json.loads(r)
    except urllib.error.HTTPError as e:
        msg = f"API-Fehler {e.code} {method} {path}: {e.read()[:600]!r}"; print(msg)
        OUT.mkdir(parents=True, exist_ok=True); (OUT / "last_error.txt").write_text(msg); raise


def cost(tin, tout): return tin * PRICE_IN / 1e6 + tout * PRICE_OUT / 1e6


def measured_factor(lang):
    u = jload("usage.json", {}).get("by_lang", {}).get(lang)
    return (u["output_tokens"] / max(1, u["input_tokens"] - u.get("system_tokens", 0))) if u and u.get("input_tokens", 0) > 20000 else FACTOR[lang]


def est(lang, units):
    src_tok = sum(len(t) for _, t in units) / 4
    sys_tok = len(system_prompt(lang)) / 3.5
    n_req = max(1, -(-sum(len(t) for _, t in units) // CHUNK))
    return n_req * sys_tok + src_tok * 1.1, src_tok * measured_factor(lang)


def post_cost(units, langs=LANGS):
    """Geschaetzte Batch-Kosten (USD), einen Beitrag komplett in alle langs zu uebersetzen (gleiche Rechnung wie submit/plan)."""
    return round(sum(cost(*est(lang, units)) for lang in langs), 4)


def pending_cost(): return sum(b.get("est_usd", 0) for b in jload("batches.json", []))


def spent(): u = jload("usage.json", {}); return cost(u.get("input_tokens", 0), u.get("output_tokens", 0))   # gesamt seit Beginn (nur Anzeige)


def month(): return datetime.now(timezone.utc).strftime("%Y-%m")


def spent_month(ym=None):
    """Ausgaben im Kalendermonat (UTC) - dagegen gilt der Deckel BLOG_BUDGET_USD. Laeufe vor Einfuehrung (5.11.2026) haben keinen Monat und zaehlen nicht."""
    m = jload("usage.json", {}).get("months", {}).get(ym or month(), {})
    return cost(m.get("input_tokens", 0), m.get("output_tokens", 0))


def submit(a):
    allps = posts(); langs, ps = select(a, allps); sel = {p["slug"] for p in ps}
    busy = {(b2["lang"], b2["slug"]) for b in jload("batches.json", []) for b2 in b.get("items", [])}
    reqs, items, money = [], [], 0.0
    room = BUDGET - spent_month() - pending_cost()
    for lang in langs:
        have = load_lang(lang); tm = TM(lang, have, allps); sysp = system_prompt(lang); n_posts = 0; touched = set()
        # auto sieht nur die letzten NEW_DAYS Tage - plus aeltere, schon uebersetzte Beitraege, deren Original neue Absaetze bekommen hat (gap): nur diese fehlen
        cand = ps + [p for p in allps if p["slug"] not in sel and (have.get(p["slug"]) or {}).get("gap")] if a["mode"] == "auto" else ps
        for p in cand:
            if a["limit"] and n_posts >= a["limit"]: break
            if (lang, p["slug"]) in busy: continue
            if a.get("wishes") and p["slug"] not in WISH.get(lang, {}): continue
            tpl, units, h = source_of(p)
            rec, dirty = resolve(lang, p, units, h, have, None if a["redo"] else tm)   # --redo: alles neu, das TM wuerde nur den alten Text liefern
            man = locked(a, lang, p, units, h, rec)
            todo = wanted_units(a, rec, units, h, man)
            if a.get("wishes") and WISH[lang][p["slug"]]: todo = [u for u in todo if u[0] in WISH[lang][p["slug"]]]
            if a["stale"] and not a["redo"]:   # veraltete Einheit, deren neuer Quelltext schon uebersetzt im TM steht: ohne API ersetzen
                full = unit_hashes(units, h)[0]; hits = {i for i, t in todo if tm.get(full[i]) and store(rec, i, t, tm.get(full[i]), man)}
                if hits: dirty = True; todo = [u for u in todo if u[0] not in hits]
            if dirty: have[p["slug"]] = rec; touched.add(bucket(p["slug"]))   # aus dem TM gefuellt / auf neue ids abgebildet: ohne API gespeichert
            if not todo: continue   # normal: nichts Neues; stale: nichts veraltet. Vorhandene Uebersetzungen werden nie automatisch neu gesendet
            if rec.get("tries", 0) >= MAX_TRIES and not (a["redo"] or a["slugs"] or a["stale"]):
                continue   # schon MAX_TRIES Mal abgeholt und noch unvollstaendig: nicht alle 3 h erneut senden (Kosten, Commits)
            n_posts += 1
            cs = chunks(todo, {})
            ti, to = est(lang, [u for c in cs for u in c]); c_usd = cost(ti, to)
            if money + c_usd > room:
                print(f"Monatsbudget erreicht ({BUDGET:.2f} $; diesen Monat {spent_month():.2f} $, offen {pending_cost():.2f} $) - Rest bleibt fuer naechsten Monat"); break
            money += c_usd
            for ci, c in enumerate(cs):
                reqs.append({"custom_id": f"{lang}_{key(p['slug'])}_{ci}", "params": {"model": MODEL, "max_tokens": MAX_TOK,
                             "system": [{"type": "text", "text": sysp, "cache_control": {"type": "ephemeral"}}],
                             "messages": [{"role": "user", "content": user_prompt(lang, c)}]}})
            # fm/redo gehen mit in den Auftrag: collect muss wissen, dass gesperrte bzw. aktuelle Einheiten ueberschrieben werden duerfen (sonst bezahlt und verworfen)
            items.append({"lang": lang, "slug": p["slug"], "h": h, "n": len(units), **({"fm": True} if a["force_manual"] else {}), **({"redo": True} if a["redo"] else {})})
        if touched: save_lang(lang, have, touched)
    if not reqs:
        print("Nichts abzusenden."); return 0
    if not check_budget("translate_blog", MODEL, money / max(0.000001, float(os.environ.get("USD_PER_EUR", "1.08")))):   # money = Batch-Preis (PRICE_IN/OUT)
        return 0
    bl = jload("batches.json", [])
    for i in range(0, len(reqs), PER_BATCH):
        part = reqs[i:i + PER_BATCH]
        ids = {r["custom_id"].rsplit("_", 1)[0] for r in part}
        its = [it for it in items if f"{it['lang']}_{key(it['slug'])}" in ids]
        share = money * len(part) / len(reqs)
        b = api("POST", "/v1/messages/batches", {"requests": part})
        bl.append({"id": b["id"], "n": len(part), "model": MODEL, "created": datetime.now(timezone.utc).isoformat()[:19], "est_usd": round(share, 3), "items": its})
        jsave("batches.json", bl); print("Batch", b["id"], len(part), "Anfragen, geschaetzt", round(share, 2), "$")
    return len(reqs)


def collect():
    bl = jload("batches.json", []); left = []; usage = jload("usage.json", {"input_tokens": 0, "output_tokens": 0, "runs": [], "by_lang": {}})
    for b in bl:
        st = api("GET", f"/v1/messages/batches/{b['id']}")
        if st["processing_status"] != "ended": print(b["id"], st["processing_status"], st["request_counts"]); left.append(b); continue
        info = {(it["lang"], key(it["slug"])): it for it in b["items"]}
        data, touched, qa_log, seen = {}, {}, {}, set()
        tin = tout = ok = bad = 0; why = {}
        for line in api("GET", st["results_url"], raw=True).decode().splitlines():
            r = json.loads(line); lang, k, _ = r["custom_id"].split("_")
            it = info.get((lang, k))
            if not it: continue
            if lang not in data: data[lang] = load_lang(lang); touched[lang] = set()
            res = r["result"]
            if res["type"] != "succeeded": bad += 1; why[res["type"]] = why.get(res["type"], 0) + 1; continue
            msg = res["message"]; u = msg["usage"]
            ti = u["input_tokens"] + u.get("cache_read_input_tokens", 0) + u.get("cache_creation_input_tokens", 0); tin += ti; tout += u["output_tokens"]
            bl_ = usage["by_lang"].setdefault(lang, {"input_tokens": 0, "output_tokens": 0, "system_tokens": 0})
            bl_["input_tokens"] += ti; bl_["output_tokens"] += u["output_tokens"]; bl_["system_tokens"] += int(len(system_prompt(lang)) / 3.5)
            text = "".join(c.get("text", "") for c in msg["content"] if c.get("type") == "text")
            if bad_text(text): bad += 1; why["encoding"] = why.get("encoding", 0) + 1; continue   # T5: Ersatzzeichen/Mojibake nie speichern
            got = parse(text)
            if msg.get("stop_reason") == "max_tokens" and got: got.pop(list(got)[-1]); why["max_tokens"] = why.get("max_tokens", 0) + 1
            p = BY_KEY.get(k)
            if not p: continue
            tpl, units, h = source_of(p)
            if h != it["h"]: continue   # Original inzwischen geaendert
            src = dict(units)
            rec, _ = resolve(lang, p, units, h, data[lang]); man = locked({"force_manual": it.get("fm")}, lang, p, units, h, rec)
            for i, t in got.items():
                if i not in src: continue
                good, reason, warn = qa(lang, src[i], t)
                if good:
                    txt = __import__("site_podpage").san(t) if "<" in t or "&" in t else t
                    if not store(rec, i, src[i], txt, man, bool(it.get("redo"))): continue   # schon aktuell (Doppel-Antwort) oder gesperrt: nie ueberschreiben; --redo ersetzt auch aktuelle
                    ok += 1
                    if warn: qa_log.setdefault(lang, []).append({"slug": p["slug"], "seg": i, "warn": warn})
                else:
                    bad += 1; why[reason] = why.get(reason, 0) + 1
                    qa_log.setdefault(lang, []).append({"slug": p["slug"], "seg": i, "fehler": reason, "src": src[i][:160], "out": t[:160]})
            rec["ok"] = all(i in rec["seg"] for i in src); rec["m"] = MODEL; rec["ts"] = datetime.now(timezone.utc).strftime("%Y-%m-%d")
            data[lang][p["slug"]] = rec; touched[lang].add(bucket(p["slug"])); seen.add((lang, p["slug"]))
        for lang, sl in seen:   # ein Versuch je Beitrag und Sprache und Batch (nicht je Teilanfrage)
            rc = data[lang].get(sl)
            if rc is not None and rc.get("ok"): rc.pop("tries", None); rc.pop("gap", None)
            elif rc is not None: rc["tries"] = rc.get("tries", 0) + 1
        for lang, d in data.items(): save_lang(lang, d, touched[lang])
        for lang, lg in qa_log.items():
            (OUT / "qa").mkdir(parents=True, exist_ok=True)
            f = OUT / "qa" / f"{lang}.json"; old = json.loads(f.read_text("utf-8")) if f.exists() else []
            f.write_text(json.dumps((old + lg)[-500:], ensure_ascii=False, indent=1), encoding="utf-8")
        usage["input_tokens"] += tin; usage["output_tokens"] += tout
        mo = usage.setdefault("months", {}).setdefault(month(), {"input_tokens": 0, "output_tokens": 0})
        mo["input_tokens"] += tin; mo["output_tokens"] += tout
        report_usage("translate_blog", b["model"], tin, tout, "batch", batch=True)
        usage["runs"].append({"batch": b["id"], "model": b["model"], "segments_ok": ok, "segments_failed": bad, "why": why, "input_tokens": tin, "output_tokens": tout, "cost_usd": round(cost(tin, tout), 3)})
        jsave("usage.json", usage); print(f"{b['id']}: {ok} Segmente ok, {bad} fehlgeschlagen {why}, Kosten {cost(tin, tout):.3f} $")
    jsave("batches.json", left)
    return len(left)


def status():
    ps = posts(); per_round = len(LANGS) * PER_AGENT
    st = {"updated": datetime.now(timezone.utc).isoformat()[:19], "posts": len(ps), "engine": f"{MODEL} (Batch) + Claude-Agenten", "per_agent": PER_AGENT,
          "budget_usd": BUDGET, "budget_period": "month", "month": month(), "spent_month_usd": round(spent_month(), 3), "spent_usd": round(spent(), 3), "pending_batches": len(jload("batches.json", [])), "pending_est_usd": round(pending_cost(), 3), "langs": {}}
    stale_all = {}
    srcs0 = {p["slug"]: source_of(p) for p in ps}; left = 0; all_ti = all_to = 0; cdone = {}
    for lang in LANGS:
        have = load_lang(lang)
        done = 0; ti = to = 0; sl = {}
        for p in ps:
            tpl, units, h = srcs0[p["slug"]]
            rec = current(p["slug"], have.get(p["slug"]), units, h)   # der gespeicherte Stand, wie der Seitenbau ihn zeigt (kein TM, nichts Gedachtes): fertig = sichtbar
            man = manual_ids(lang, p["slug"], units, h, rec) if rec else {}
            pend = [u for u in units if not rec or (u[0] not in rec["seg"] and u[0] not in man)]
            if not pend:
                done += 1
                sid = stale_ids(rec, units, h, man) if rec.get("sh") or man else []   # Altbestand ohne sh passt zum Original, sonst waere er nicht hier
                if sid: sl[p["slug"]] = sid
                if p.get("cp_slug"): cdone[p["slug"]] = cdone.get(p["slug"], 0) + 1
                continue
            x, y = est(lang, pend); ti += x; to += y   # nur nie uebersetzte Einheiten (vorhandene Texte kosten nichts)
        if sl: stale_all[lang] = sl
        all_ti += ti; all_to += to
        qf = OUT / "qa" / f"{lang}.json"; ql = json.loads(qf.read_text("utf-8")) if qf.exists() else []
        st["langs"][lang] = {"name": NAMES[lang], "done": done, "open": len(ps) - done, "pct": round(100 * done / max(1, len(ps)), 1), "rest_est_usd": round(cost(ti, to), 2), "out_factor": round(measured_factor(lang), 2),
                             "qa_errors_logged": sum(1 for x in ql if x.get("fehler")), "jobs_waiting": len(list((WORK / lang).glob("*.in.txt"))) if (WORK / lang).exists() else 0}
        left += len(ps) - done
    st["open_translations"] = left; st["rounds_left"] = -(-left // per_round); st["rest_est_usd_all"] = round(cost(all_ti, all_to), 2)
    st["content"] = [{"slug": p["cp_slug"], "est_usd_all_langs": post_cost(srcs0[p["slug"]][1]), "done_langs": cdone.get(p["slug"], 0)}   # Content-Pakete: Kosten je Beitrag x 14 Sprachen (Batch-Preis)
                     for p in ps if p.get("cp_slug")]
    st["stale_items"] = sum(len(v) for v in stale_all.values())
    jsave("status.json", st); jsave("stale.json", stale_all)   # stale.json: {lang: {slug: [ids]}} - englisches Original geaendert, Fassung steht noch (Redaktion; i18n_overrides Vertrag 7)
    OV.report()
    for c in st["content"]: print(f"  Content-Paket {c['slug']}: ~{c['est_usd_all_langs']} $ fuer {len(LANGS)} Sprachen, fertig {c['done_langs']}/{len(LANGS)}")
    print(f"{st['posts']} Artikel x 19 Sprachen | offen {left} Uebersetzungen | Haiku-Batch ~{st['rest_est_usd_all']} $ (diesen Monat {st['spent_month_usd']} von {BUDGET} $, gesamt {st['spent_usd']} $) | Agenten ~{st['rounds_left']} Runden")
    for l, v in st["langs"].items(): print(f"  {l:3} {v['done']:5}/{st['posts']} fertig ({v['pct']} %), Rest ~{v['rest_est_usd']} $")
    return st


def sample(a):
    import site_podpage as P
    ps = posts(); random.seed(a.get("seed") or None)
    for lang in a["langs"]:
        have = load_lang(lang); okp = [p for p in ps if shown(p, have.get(p["slug"]))]
        pick = random.sample(okp, min(a["limit"] or 3, len(okp)))
        res = []
        for p in pick:
            units, _h, _rec, sg, _man = shown(p, have[p["slug"]])   # Maschinentext, wie er gespeichert ist (Review der Uebersetzer, ohne Handtexte)
            res.append({"slug": p["slug"], "url": f"https://www.m365.fm/{lang}/community/u/{p.get('author') or 'mirko-p'}/blog/{p.get('cp_slug') or p['slug']}/", "pairs": [{"id": i, "en": s, lang: sg.get(i, "")} for i, s in units][:60]})
        (OUT / "review").mkdir(parents=True, exist_ok=True)
        (OUT / "review" / f"{lang}.json").write_text(json.dumps(res, ensure_ascii=False, indent=1), encoding="utf-8")
        print(lang, len(res), "Beitraege ->", OUT / "review" / f"{lang}.json")


def args():
    a = sys.argv[1:]
    def opt(n, d=""):
        return a[a.index(n) + 1] if n in a and a.index(n) + 1 < len(a) else d
    mode = a[0] if a and not a[0].startswith("-") else "plan"
    langs = [l for l in (opt("--langs") or ",".join(LANGS)).split(",") if l in LANGS]
    return {"mode": mode, "langs": langs, "limit": int(opt("--limit", "0") or 0), "per_agent": int(opt("--per-agent", "0") or 0), "order": opt("--order", "newest"),
            "slugs": [s for s in opt("--slugs").split(",") if s], "redo": "--redo" in a, "seed": opt("--seed"), "queue": "--queue" in a,
            "stale": mode == "stale" or "--stale" in a or "--wishes" in a, "force_manual": "--force-manual" in a, "wishes": "--wishes" in a}


BY_SLUG = {}
BY_KEY = {}


def report_wishes():
    """Wunschliste der Redaktion (Vertrag 8): Eintraege zurueckmelden, bei denen nichts Gewuenschtes mehr veraltet ist - auch wenn erst ein spaeterer Lauf den Batch abgeholt hat.
    Gesperrte Einheiten (Handtext) zaehlen nicht: sie bleiben als "Handfassung, Original geaendert" in stale.json."""
    w = {l: v for l, v in OV.wishes("lblog").items() if l in LANGS}
    if not w: return 0
    busy = {(b2["lang"], b2["slug"]) for b in jload("batches.json", []) for b2 in b.get("items", [])}; done = []
    for lang, its in w.items():
        have = load_lang(lang)
        for slug, us in its.items():
            if (lang, slug) in busy: continue
            p = BY_SLUG.get(slug)
            if p:
                tpl, units, h = source_of(p); rec = current(slug, have.get(slug), units, h)
                if rec and [i for i, _ in open_units(rec, units, h, True, manual_ids(lang, slug, units, h, rec)) if not us or i in us]: continue   # noch veraltet
            done.append((lang, slug))
    n = OV.wishes_done("lblog", done)
    if done: print(f"Wunschliste: {len(done)} erledigt, {n} zurueckgemeldet")
    return n


def main():
    a = args(); ps = posts(); BY_SLUG.update({p["slug"]: p for p in ps}); BY_KEY.update({key(p["slug"]): p for p in ps})
    m = a["mode"]
    if m == "sample": sample(a); return
    OV.use_api()   # Handtexte der Redaktion live aus dem Export (COMMUNITY_API), sonst aus data/i18n_overrides
    if m != "plan": settle(ps)   # alle Beitraege auf ihr aktuelles Original nachziehen, ohne API (plan aendert nichts am Speicher)
    if m == "prepare": prepare(a); return
    if m == "apply": apply(a); status(); return
    if m in ("collect", "run", "auto", "stale"): collect()
    if m in ("submit", "run", "auto", "stale"): submit(a)
    if m in ("run", "auto", "stale"):
        t0 = time.time()
        while jload("batches.json", []) and time.time() - t0 < WAIT_MIN * 60:
            time.sleep(120)
            if collect() == 0: break
    if m != "plan": report_wishes()
    status()


if __name__ == "__main__":
    main()
