#!/usr/bin/env python3
"""Infografiken fuer Entitaeten, Blogbeitraege und Podcast-Folgen: je Inhalt 1 Kopfbild (1200x630, wird og:image) + 2-3 Infografiken,
je Seitensprache (15), als WebP im R2-Bucket (img.m365.fm/ig/...), Index in data/infographics/<art>.json.gz. Nur Standbilder, keine Videos.

  python tools/infographics.py plan   [--kinds ..] [--langs ..] [--limit N]    zaehlen, Kosten und Laufzeit schaetzen (nichts wird gesendet/bezahlt)
  python tools/infographics.py specs  [--kinds ..] [--limit N]                  Haiku-Batch: englische Bildtexte (Kopfbild + Infografiken) je Inhalt
  python tools/infographics.py translate --langs de,fr,.. [--kinds ..] [--limit N]   Haiku-Batch je Sprache: Bildtexte uebersetzen
  python tools/infographics.py collect [--wait SEK]                             fertige Batches einsammeln, pruefen, speichern
  python tools/infographics.py render --langs ..  [--kinds ..] [--limit N] [--max-min M]   rendern (Playwright), pruefen, WebP nach R2, Index schreiben

Ablauf, Kosten, Notschalter: INFOGRAPHICS.md. Nur von Hand ueber .github/workflows/infographics.yml. Bildtexte (Specs) liegen im Bucket unter ig/_specs/<art>/<slug>.json
(eine Datei je Inhalt mit allen Sprachen), der Index in Git. Auf der Seite erscheinen Bilder erst, wenn data/infographics_live.json Sprache und Art freigibt
(site_infographics.py); ohne Freigabe ist die Seite Byte fuer Byte wie vorher. Fertige Bilder werden nie ein zweites Mal bezahlt oder gerendert."""
import argparse, gzip, hashlib, html as htmlmod, io, json, os, re, subprocess, sys, tempfile, time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
from ai_gateway import anthropic_request, check_budget, estimated_eur, remaining_eur, report_usage, thinking_off, urlopen  # noqa: E402

MODEL = os.environ.get("INFOGRAPHICS_MODEL", "claude-haiku-5-5")
JOB = "infographics"
PUBLIC = "https://img.m365.fm"
KINDS = ("entity", "blog", "episode", "pillar")
LANGS = ("en", "de", "es", "fr", "it", "pt", "nl", "pl", "id", "ru", "uk", "ar", "he", "ja", "ko")
LANG_NAMES = {"en": "English", "de": "German", "fr": "French", "es": "Spanish", "it": "Italian", "nl": "Dutch", "pt": "Portuguese (Brazil)", "pl": "Polish",
              "id": "Indonesian", "ru": "Russian", "uk": "Ukrainian", "ar": "Arabic", "he": "Hebrew", "ja": "Japanese", "ko": "Korean"}
RTL = ("ar", "he")
SIZES = {"flow": (1920, 1080), "compare": (1200, 1040), "ladder": (1200, 1800), "bigfact": (1200, 630), "hub": (1200, 1200)}   # wie templates.mjs
FIG_TEMPLATES = ("flow", "compare", "ladder", "hub")   # bigfact ist dem Kopfbild vorbehalten
FIGS = {"pillar": (6, 10)}   # Infografiken je Inhalt nach Art (ohne Kopfbild): Leitfaeden sind lang und bekommen insgesamt 10 Bilder; sonst 2-3
FIGS_DEFAULT = (2, 3)
LANG_FACTOR_BIG = 1.6   # Leitfaeden: Uebersetzungen duerfen laenger werden (Deutsch hielt bei 30-Zeichen-Chips 42 nicht ein); das Rendern prueft das Layout
EN_SLACK_BIG = 1.3   # Leitfaeden: laengere englische Texte (die KI haelt 30-Zeichen-Grenzen oft nicht); ob es passt, entscheidet das Rendern (Layoutpruefung)
MAX_SAME = 4         # bei Leitfaeden duerfen sich Vorlagen wiederholen, aber hoechstens so oft
PILLAR_TEXT = 90000  # Zeichen des Leitfadens, die an die KI gehen (ganze Leitfaeden sind 70-95 Tsd.)
MAX_TRIES = 8          # Textversuche je Inhalt/Sprache (ab dem zweiten mit Rueckmeldung der Pruefung)
RENDER_TRIES = 2       # Layoutfehler sind immer gleich: nach zwei Versuchen nicht mehr rendern
EN_SLACK = 1.15    # englische Texte duerfen die Grenze um 15 % ueberschreiten (die KI zaehlt Zeichen nicht genau; Stresstest bestand bis x 1,4)
LANG_FACTOR = 1.4   # Textgrenzen der Uebersetzungen: Englisch x 1,4 (Deutsch/Russisch laenger); die Layoutpruefung beim Rendern ist die endgueltige Grenze
OUT_EST, IN_EST_SPECS, IN_EST_TR = 1300, 2100, 1700   # Token-Schaetzung je Anfrage (aus dem Testlauf)
PILLAR_EST = {"specs": (24000, 4200), "tr": (4500, 4200)}   # Leitfaden: (Token ein, Token aus) je Anfrage; 10 Bilder statt 3
BATCH_MAX = 500   # kleine Teile: ein Zeitueberschreiten beim Senden betrifft wenig, Ergebnisse kommen frueher

# ------------------------------------------------------------------ Spezifikation der Bildtexte
# Grenzen in Zeichen (Englisch). Vorlage -> {Feld: Grenze}; Listen: (Mindestanzahl, Hoechstanzahl, {Unterfeld: Grenze})
LIMITS = {
    "bigfact": {"kicker": 36, "title": 48, "hero.value": 2, "hero.label": 34, "chips": (3, 4, {"t": 14, "n": 30})},
    "flow": {"kicker": 36, "title": 26, "sub": 80, "hero.value": 2, "hero.label": 14, "hero.sub": 28, "steps": (3, 4, {"t": 12, "n": 44}), "note": 60},
    "compare": {"kicker": 36, "title": 40, "left.head": 18, "left.items": (2, 3, 34), "right.head": 18, "right.items": (2, 3, 34), "verdict": 70},
    "ladder": {"kicker": 36, "title": 36, "sub": 100, "tiers": (3, 5, {"t": 22, "n": 60}), "axis": 70},
    "hub": {"kicker": 36, "title": 40, "core.value": 3, "core.label": 22, "nodes": (3, 4, {"t": 22, "n": 48})},
}
ALT_MAX = 125
TAG_MAX = (0, 3, 20)


def _s():
    return {"type": "string"}


def _list(item, extra=None):
    return {"type": "array", "items": item}


_TN = {"type": "object", "additionalProperties": False, "required": ["t", "n"], "properties": {"t": _s(), "n": _s()}}
_VL = {"type": "object", "additionalProperties": False, "required": ["value", "label"], "properties": {"value": _s(), "label": _s()}}
_VLS = {"type": "object", "additionalProperties": False, "required": ["value", "label", "sub"], "properties": {"value": _s(), "label": _s(), "sub": _s()}}
_HI = {"type": "object", "additionalProperties": False, "required": ["head", "items"], "properties": {"head": _s(), "items": {"type": "array", "items": _s()}}}


def _obj(template, props):
    p = {"template": {"type": "string", "enum": [template]}, "alt": _s(), "tags": {"type": "array", "items": _s()}, **props}
    return {"type": "object", "additionalProperties": False, "required": list(p), "properties": p}


_BIG = _obj("bigfact", {"kicker": _s(), "title": _s(), "hero": _VL, "chips": {"type": "array", "items": _TN}})
_FIGS = [
    _obj("flow", {"kicker": _s(), "title": _s(), "sub": _s(), "hero": _VLS, "hi": {"type": "integer"}, "steps": {"type": "array", "items": _TN}, "note": _s()}),
    _obj("compare", {"kicker": _s(), "title": _s(), "left": _HI, "right": _HI, "verdict": _s()}),
    _obj("ladder", {"kicker": _s(), "title": _s(), "sub": _s(), "tiers": {"type": "array", "items": _TN}, "axis": _s()}),
    _obj("hub", {"kicker": _s(), "title": _s(), "core": _VL, "nodes": {"type": "array", "items": _TN}}),
]
SET_SCHEMA = {"type": "object", "additionalProperties": False, "required": ["header", "figs"],
              "properties": {"header": _BIG, "figs": {"type": "array", "items": {"anyOf": _FIGS}}}}

EXAMPLE = {   # Form der Antwort (die Schema-Grammatik der API ist fuer vier Vorlagen zu gross: "compiled grammar is too large"); geprueft wird streng in check_set
    "header": {"template": "bigfact", "kicker": "Blog · Microsoft Fabric", "title": "Lakehouse basics", "alt": "Header graphic: three key points of Fabric lakehouses.", "tags": ["Fabric"],
               "hero": {"value": "3", "label": "key points"}, "chips": [{"t": "OneLake", "n": "One copy of data"}, {"t": "Delta", "n": "Open table format"}, {"t": "Direct Lake", "n": "No import needed"}]},
    "figs": [
        {"template": "flow", "kicker": "Blog · Microsoft Fabric", "title": "From data to report", "sub": "Four steps", "alt": "Flow of four steps from ingestion to report.", "tags": ["Fabric"],
         "hero": {"value": "4", "label": "steps", "sub": "end to end"}, "hi": 2, "steps": [{"t": "Ingest", "n": "Load data into OneLake"}, {"t": "Clean", "n": "Prepare tables"}, {"t": "Model", "n": "Build the semantic model"}, {"t": "Report", "n": "Publish in Power BI"}], "note": "Direct Lake skips the import step."},
        {"template": "compare", "kicker": "Blog · Microsoft Fabric", "title": "Import vs Direct Lake", "alt": "Comparison of import mode and Direct Lake.", "tags": ["Power BI"],
         "left": {"head": "Import", "items": ["Copy of the data", "Scheduled refresh"]}, "right": {"head": "Direct Lake", "items": ["Reads OneLake files", "No refresh wait"]}, "verdict": "Direct Lake fits large, fresh data."},
    ],
}
SET_EXAMPLE_JSON = json.dumps(EXAMPLE, ensure_ascii=False)


def parse_json(txt):
    """Antworttext -> Objekt oder None; toleriert ```json-Zaeune und Text davor/danach; Zahlen in value werden zu Text."""
    t = (txt or "").strip()
    a, b = t.find("{"), t.rfind("}")
    if a < 0 or b <= a: return None
    try: d = json.loads(t[a:b + 1])
    except ValueError: return None
    if isinstance(d, dict):
        for sp in [d.get("header")] + (d.get("figs") if isinstance(d.get("figs"), list) else []):
            if isinstance(sp, dict):
                for k in ("hero", "core"):
                    if isinstance(sp.get(k), dict) and isinstance(sp[k].get("value"), int) and not isinstance(sp[k]["value"], bool): sp[k]["value"] = str(sp[k]["value"])
    return d


SYSTEM_SPECS = (
    "You turn one article, podcast episode or glossary entry of M365.FM (a podcast and knowledge site about Microsoft 365, Azure, Power Platform and AI) into the texts of "
    "one header graphic and {nfigs} infographics. Return JSON only, matching the schema. A fixed template draws each image; you only fill its fields.\n"
    "header: template bigfact = one big fact. hero.value is a number of at most 2 characters: normally simply the number of chips (3 or 4) with hero.label like 'key points' (a figure from the text such as 12 or 3x is allowed only if the text really states it, never a certification number). hero.label says what the value counts. title = the topic as a headline. chips = 3 or 4 key points.\n"
    "figs: {nfigs} infographics, {tmpl_rule}, chosen by what the text offers:\n"
    "- flow: a process with 3 or 4 steps in order (hero.value = exactly the number of steps, 1-2 digits; hi = index (from 0) of the most important step).\n"
    "- compare: two options or before/after, 2-3 short points per side, plus a verdict line.\n"
    "- ladder: 3-5 ranked tiers, levels or priorities (axis = what rises or falls along them).\n"
    "- hub: one core idea (core.value = exactly the number of nodes, core.label what it counts) with 3 or 4 parts around it.\n"
    "Use only facts from the text. Never invent numbers, product names, prices or dates. Keep product names (Microsoft Teams, SharePoint, Copilot ...) in their official form. "
    "Prefer concrete, useful content over slogans. If the text cannot honestly fill a template, choose another one.\n"
    "Style: plain, short phrases; no emoji, no marketing words, no quotation marks. kicker = kind and topic, e.g. 'Entity · Azure security', 'Blog · Microsoft Fabric', 'Podcast · Power Apps'.\n"
    "alt = one sentence (at most 125 characters) saying what the image shows or explains, for screen readers. tags = up to 3 product or topic names (each at most 20 characters).\n"
    "Hard length limits in characters (English): see the list. A set with one text too long is discarded, so stay clearly below. Rules of thumb: a chip t is 1-2 short words (max 14 characters, e.g. 'Least privilege'), a chip n at most 4 short words (max 30 characters, e.g. 'Checks every request'); every infographic title and step title is short (steps t max 12 characters, e.g. 'Verify'); "
    "any title of a flow at most 3-4 words (26 characters); any kicker at most 5 words (36 characters); hero.value is 1 or 2 characters such as 7, 12 or 3x (never 3 characters); tags at most 3, each at most 20 characters; "
    "compare heads 1-2 words (18 characters); {count_rule}.\n{limits}\n"
    "Answer with one JSON object only (no text before or after, no code fence). All values are strings except hi (integer) and the lists. Exactly this structure and these field names "
    "(the example shows two figures only, you deliver {nfigs}; flow needs hero, hi, steps, note; compare needs left, right, verdict; ladder needs sub, tiers, axis; hub needs core, nodes):\n{example}{extra}"
)
PILLAR_EXTRA = (
    "\nThis text is a long guide with many sections. Give every infographic its own topic from a different part of the guide, in the order of the guide, so that together they cover the whole guide; never two infographics on the same point. "
    "kicker = 'Guide · <short topic>' (for example 'Guide · Lean manufacturing'). Use the facts, numbers and terms of the guide exactly; a number appears only if the guide states it.")


def system_specs(kind=None):
    lo, hi = FIGS.get(kind, FIGS_DEFAULT)
    if kind in FIGS:
        n = str(hi)
        tmpl, cnt, extra = f"templates may repeat but each at most {MAX_SAME} times; every figure uses exactly one of flow, compare, ladder, hub (never bigfact, no other names)", f"the figs array has {hi} items (at least {lo}, never more than {hi}): count them before you answer; a set with fewer than {lo} or more than {hi} is discarded", PILLAR_EXTRA
    else:
        n, tmpl, cnt, extra = f"{lo} or {hi}", "each with a different template", "exactly 2 or 3 infographics, never 1 or 4", ""
    return (SYSTEM_SPECS.replace("{nfigs}", n).replace("{tmpl_rule}", tmpl).replace("{count_rule}", cnt).replace("{extra}", extra)
            .replace("{limits}", limits_text()).replace("{example}", SET_EXAMPLE_JSON))
SYSTEM_TR = (
    "You translate the texts of an infographic set (JSON) from English into {lang}. Answer with one JSON object only (no text before or after, no code fence), with exactly the same structure, the same field names and the same template values: the same templates, the same number of "
    "list items, the same numbers and the same hi index. Translate every string natively (not word for word), keep it as short as the English or shorter; hard limit: English length x {f}. "
    "Keep product names (Microsoft Teams, SharePoint, Power BI, Copilot, Azure ...) in their official form; tags stay product names. Keep numbers and symbols (4, 99.9%, 3x) unchanged. "
    "Do not add or remove facts. alt stays one sentence for screen readers. The kicker keeps its pattern (kind · topic) with the kind word translated "
    "(Entity, Blog, Podcast, Guide)."
)


def limits_text():
    out = []
    for t, spec in LIMITS.items():
        parts = []
        for k, v in spec.items():
            if isinstance(v, tuple):
                n = f"{v[0]}-{v[1]} items" + ("" if isinstance(v[2], int) else ", " + ", ".join(f"{a} <= {b}" for a, b in v[2].items()))
                parts.append(f"{k}: {n}" + (f", each <= {v[2]}" if isinstance(v[2], int) else ""))
            else:
                parts.append(f"{k} <= {v}")
        out.append(f"{t}: " + "; ".join(parts))
    return "\n".join(out)


# ------------------------------------------------------------------ Pruefung
SCRIPTS = {"ru": r"[Ѐ-ӿ]", "uk": r"[Ѐ-ӿ]", "ar": r"[؀-ۿ]", "he": r"[֐-׿]", "ja": r"[぀-ヿ一-鿿]", "ko": r"[가-힯ᄀ-ᇿ]"}
ANY_NON_LATIN = re.compile(r"[Ѐ-ӿ֐-ۿ぀-ヿ一-鿿가-힯]")


def _get(spec, path):
    cur = spec
    for p in path.split("."):
        cur = cur.get(p) if isinstance(cur, dict) else None
    return cur


def strings(spec):
    """Alle sichtbaren Texte eines Bildes (ohne template/hi)."""
    out = []
    def walk(v, key=""):
        if isinstance(v, str):
            if key not in ("template",): out.append(v)
        elif isinstance(v, list):
            for x in v: walk(x, key)
        elif isinstance(v, dict):
            for k, x in v.items(): walk(x, k)
    walk(spec)
    return out


def check_spec(spec, lang="en", template=None, slack=None, tr_factor=None):
    """None = in Ordnung, sonst Grund. Pruefung von Form, Anzahl, Laengen und Schrift."""
    if not isinstance(spec, dict): return "kein Objekt"
    t = spec.get("template")
    if t not in LIMITS or (template and t != template): return f"Vorlage {t!r}"
    f = (slack or EN_SLACK) if lang == "en" else (tr_factor or LANG_FACTOR)
    for k, lim in LIMITS[t].items():
        v = _get(spec, k)
        if isinstance(lim, tuple):
            lo, hi, sub = lim
            if not isinstance(v, list) or not lo <= len(v) <= hi: return f"{k}: Anzahl"
            for it in v:
                if isinstance(sub, dict):
                    if not isinstance(it, dict): return f"{k}: Form"
                    for a, b in sub.items():
                        if not isinstance(it.get(a), str) or not it[a].strip() or len(it[a]) > b * f: return f"{k}.{a}: Laenge/leer (max {b * f:.0f} Zeichen, war {str(it.get(a))[:60]!r})"
                elif not isinstance(it, str) or not it.strip() or len(it) > sub * f: return f"{k}: Laenge/leer (max {sub * f:.0f} Zeichen, war {str(it)[:60]!r})"
        else:
            if not isinstance(v, str) or not v.strip() or len(v) > lim * f: return f"{k}: Laenge/leer ({len(v) if isinstance(v, str) else '-'}>{lim * f:.0f})"
    if t == "flow":
        if not isinstance(spec.get("hi"), int) or not -1 <= spec["hi"] < len(spec["steps"]): return "hi"
    alt = spec.get("alt")
    if not isinstance(alt, str) or not alt.strip() or len(alt) > ALT_MAX * f: return "alt"
    tags = spec.get("tags")
    if not isinstance(tags, list) or len(tags) > TAG_MAX[1] or any(not isinstance(x, str) or len(x) > TAG_MAX[2] * f for x in tags): return "tags"
    txt = " ".join(strings({k: v for k, v in spec.items() if k not in ("tags",)}))
    if "<" in txt or ">" in txt or "{" in txt: return "Sonderzeichen"
    if re.search(r"(?i:https?:|www\.|@|\.(com|org|de|fm)\b)|[a-z0-9-]\.net\b", txt): return "Adresse im Text"
    letters = re.findall(r"[^\W\d_]", txt)
    if letters:
        if lang in SCRIPTS:
            if len(re.findall(SCRIPTS[lang], txt)) < 0.5 * len(letters): return f"Schrift passt nicht zu {lang}"
        elif ANY_NON_LATIN.search(txt): return f"fremde Schrift in {lang}"
    return None


def salvage(st, kind):
    """Leitfaeden haben bis zu 10 Infografiken: einzelne fehlerhafte (falsche Vorlage, zu lange Texte, falsche Zahl, zu oft dieselbe Vorlage) werden weggelassen, statt den ganzen Satz zu verwerfen.
    Ob genug uebrig bleiben, entscheidet danach check_set. Nur Englisch (Uebersetzungen muessen die Struktur des englischen Satzes behalten)."""
    if not isinstance(st, dict) or not isinstance(st.get("figs"), list): return st
    lo, hi = FIGS.get(kind, FIGS_DEFAULT)
    keep, used = [], {}
    for f in st["figs"]:
        t = f.get("template") if isinstance(f, dict) else None
        if t not in FIG_TEMPLATES or check_spec(f, "en", None, EN_SLACK_BIG) or used.get(t, 0) >= MAX_SAME: continue
        if t == "flow" and f["hero"]["value"] != str(len(f["steps"])): continue
        if t == "hub" and f["core"]["value"] != str(len(f["nodes"])): continue
        keep.append(f); used[t] = used.get(t, 0) + 1
    return {**st, "figs": keep[:hi]}


def check_set(st, lang="en", en=None, source=None, kind=None):
    """Satz = {"header":..., "figs":[...]} -> None oder Grund. en: englischer Satz; die Uebersetzung muss dieselbe Struktur und Zahlen haben.
    source: Text des Inhalts (nur Englisch): die Kopfbild-Zahl ist die Zahl der Punkte oder steht im Text."""
    if not isinstance(st, dict) or not isinstance(st.get("header"), dict) or not isinstance(st.get("figs"), list): return "Form"
    lo, hi = FIGS.get(kind, FIGS_DEFAULT)
    if not lo <= len(st["figs"]) <= hi: return f"Anzahl Infografiken ({len(st['figs'])}, erlaubt {lo}-{hi})"
    if st["header"].get("template") != "bigfact": return "Kopfbild nicht bigfact"
    seen = [f.get("template") if isinstance(f, dict) else None for f in st["figs"]]
    if any(s not in FIG_TEMPLATES for s in seen): return "Vorlagen"
    if kind in FIGS:
        if any(seen.count(s) > MAX_SAME for s in set(seen)): return "Vorlagen: zu oft dieselbe"
    elif len(set(seen)) != len(seen): return "Vorlagen"
    for i, s in enumerate([st["header"]] + st["figs"]):
        r = check_spec(s, lang, None, EN_SLACK_BIG if kind in FIGS else None, LANG_FACTOR_BIG if kind in FIGS else None)
        if r: return f"Bild {i}: {r}"
    for f in st["figs"]:   # die grosse Zahl ist genau die Zahl der Elemente (sonst steht im Bild eine falsche Zahl)
        if f["template"] == "flow" and f["hero"]["value"] != str(len(f["steps"])): return "flow: Zahl passt nicht zu den Schritten"
        if f["template"] == "hub" and f["core"]["value"] != str(len(f["nodes"])): return "hub: Zahl passt nicht zu den Teilen"
    hv = st["header"]["hero"]["value"]
    if lang == "en" and source is not None and hv != str(len(st["header"]["chips"])):
        digits = re.sub(r"\D", "", hv)
        if not digits or not re.search(r"(?<!\d)" + re.escape(digits) + r"(?!\d)", source): return "Kopfbild: Zahl weder Anzahl noch im Text"
    if en is not None:
        if [f["template"] for f in en["figs"]] != seen: return "Vorlagen weichen vom Englischen ab"
        pairs = list(zip([en["header"]] + en["figs"], [st["header"]] + st["figs"]))
        for a, b in pairs:
            for k in ("hero", "core"):
                if k in a and a[k].get("value") != b[k].get("value"): return "Zahl weicht ab"
            if "hi" in a and a["hi"] != b["hi"]: return "hi weicht ab"
            for k in ("chips", "steps", "tiers", "nodes"):
                if k in a and len(a[k]) != len(b[k]): return "Anzahl weicht ab"
            for k in ("left", "right"):
                if k in a and len(a[k]["items"]) != len(b[k]["items"]): return "Anzahl weicht ab"
    return None


# ------------------------------------------------------------------ Inhalte
def jload(p, default):
    try:
        p = Path(p)
        return json.loads(gzip.open(p, "rt", encoding="utf-8").read() if p.suffix == ".gz" else p.read_text("utf-8"))
    except (OSError, ValueError):
        return default


def plain(h, n=3500):
    h = re.sub(r"(?is)<(script|style).*?</\1>", " ", h or "")
    h = re.sub(r"(?i)</(p|li|h[1-6]|div|tr)>", "\n", h)
    t = htmlmod.unescape(re.sub(r"<[^>]+>", " ", h))
    t = re.sub(r"[ \t]+", " ", t)
    t = re.sub(r"\s*\n\s*", "\n", t).strip()
    return t[:n]


def content_posts(root):
    """Freigegebene englische Beitragspakete (imports/blog/en/<slug>.md, status approved, publish true) -> [(slug, Titel, Text)]. Text ohne Markdown-Zeichen, wie plain() gekuerzt."""
    out = []
    for f in sorted((Path(root) / "imports" / "blog" / "en").glob("*.md")):
        try: t = f.read_text("utf-8")
        except OSError: continue
        m = re.match(r"---\s*\n(.*?)\n---\s*\n(.*)\Z", t, re.S)
        if not m: continue
        head, body = m.groups()
        fm = lambda k: (re.search(rf"(?m)^{k}:\s*(.+?)\s*$", head) or [None, ""])[1].strip().strip("\"'")
        if fm("status") != "approved" or fm("publish").lower() not in ("true", "yes", "1") or not fm("title"): continue
        body = re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", body)
        body = re.sub(r"(?m)^\s*[#>|]+\s*|[*_`]+", "", body)
        body = re.sub(r"(?m)^\s*[-+]\s+", "", body)
        text = plain(body.replace("\n", "\n</p>"))
        out.append((f.stem, fm("title"), text))
    return out


def pillar_hold(root):
    """Leitfaeden, fuer die (noch) keine Bilder entstehen: data/infographics_live.json "pillar_hold" (Kursausbau 26.11.2026: die neuen Leitfaeden bis zur
    Freigabe durch Mirko - der Samstagslauf wuerde sie sonst automatisch und bezahlt verarbeiten). Freigabe: ID aus der Liste entfernen."""
    d = jload(Path(root) / "data" / "infographics_live.json", {})
    return {x for x in ((d.get("pillar_hold") if isinstance(d, dict) else None) or []) if isinstance(x, str)}


def pillar_langs(root, p):
    """Sprachen mit eigener Fassung des Leitfadens: en, de nur mit slug.de und Datei, Uebersetzungen mit Datei (englischer Slug). Fuer andere Sprachen
    entstehen keine Bildtexte und Bilder (es gibt dort keine Seite)."""
    sl = p.get("slug") or {}; en = sl.get("en") or p.get("id")
    base, out = Path(root) / "imports" / "pillars", ["en"]
    for l in LANGS:
        name = sl.get("de") if l == "de" else en
        if l != "en" and name and (base / l / f"{name}.md").exists(): out.append(l)
    return tuple(out)


def pillar_guides(root):
    """Englische Leitfaeden (data/pillars.json + imports/pillars/en/<slug>.md) -> [(id, Titel, Text)]. Text ohne Links und Quellenmarken, bis PILLAR_TEXT Zeichen. Der Schluessel ist die Pillar-ID (steht auch in den Seitenadressen der anderen Sprachen).
    Leitfaeden auf der Halteliste pillar_hold fehlen (keine Bildtexte, keine Kosten)."""
    out = []
    reg = jload(Path(root) / "data" / "pillars.json", {})
    hold = pillar_hold(root)
    for p in (reg.get("pillars") if isinstance(reg, dict) else None) or []:
        if not isinstance(p, dict): continue
        pid = p.get("id")
        if pid in hold: continue
        slug = (p.get("slug") or {}).get("en") or pid
        f = Path(root) / "imports" / "pillars" / "en" / f"{slug}.md"
        if not pid or not f.exists(): continue
        import site_pillars   # gleiche Aufteilung der Datei wie beim Seitenbau (Metadaten, Artikel, Quellen)
        d = site_pillars.parse_file(f)
        if not d or not d.get("h1") or not d.get("article"): continue
        title, body = d["h1"].strip(), d["article"]
        body = re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", body)
        body = re.sub(r"\[(?:\d{1,3}|unverified[^\]]*)\]", "", body)
        body = re.sub(r"(?m)^\s*[>|]+\s*|[*_`]+", "", body)
        text = re.sub(r"[ \t]+", " ", re.sub(r"\n{3,}", "\n\n", body)).strip()[:PILLAR_TEXT]
        if len(text) > 2000: out.append((pid, title, text))
    return out


def items(kind, root=None):
    """-> [{key, kind, slug, title, text, label}] fuer eine Art. Entitaeten: englischer Entitaetstext; Blog: fruehere Podpage-Beitraege; Folgen: Show Notes."""
    D = Path(root or ROOT) / "data"
    out = []
    if kind == "entity":
        names = {e["id"]: e for e in jload(D / "entities.json", []) if isinstance(e, dict) and e.get("id")}
        texts = {}
        for k, v in (jload(D / "entity_fill" / "en.json", {}) or {}).items():   # KI-Entwurf (nur Rueckfall, wie site_entities.long_for)
            if isinstance(v, dict) and isinstance(v.get("long"), str) and len(v["long"]) > 200:
                faq = " ".join(f"{x.get('q', '')} {x.get('a', '')}" for x in (v.get("faq") or []) if isinstance(x, dict))
                texts[k] = (v["long"] + "\n" + faq).strip()
        for f in sorted((D / "entity_texts").glob("part-*.json")):   # Ueberblick aus Folgen und Fakten gewinnt
            for k, v in (jload(f, {}) or {}).items():
                if isinstance(v, dict) and isinstance(v.get("en"), str) and len(v["en"]) > 200: texts[k] = v["en"]
        for k, t in sorted(texts.items()):
            e = names.get(k)
            if e and e.get("name") and e.get("type") != "category":
                out.append({"key": f"entity:{k}", "kind": kind, "slug": k, "title": e["name"], "text": t[:3500], "label": "Entity"})
    elif kind == "blog":
        for p in jload(D / "podpage" / "blog_posts.json.gz", []):
            t = plain(p.get("html"))
            if p.get("slug") and p.get("title") and len(t) > 300:
                out.append({"key": f"blog:{p['slug']}", "kind": kind, "slug": p["slug"], "title": p["title"], "text": t, "label": "Blog"})
        have = {i["slug"] for i in out}
        for slug, title, body in content_posts(Path(root or ROOT)):   # neue, freigegebene Beitraege (imports/blog/en); seit dem 19.11. fehlten sie, weil nur die frueheren Podpage-Beitraege gelesen wurden
            if slug not in have and len(body) > 300:
                out.append({"key": f"blog:{slug}", "kind": kind, "slug": slug, "title": title, "text": body, "label": "Blog"})
    elif kind == "pillar":
        reg = {p.get("id"): p for p in (jload(D / "pillars.json", {}) or {}).get("pillars") or [] if isinstance(p, dict)}
        for slug, title, body in pillar_guides(Path(root or ROOT)):
            out.append({"key": f"pillar:{slug}", "kind": kind, "slug": slug, "title": title, "text": body, "label": "Guide", "langs": pillar_langs(Path(root or ROOT), reg.get(slug) or {"id": slug})})
    elif kind == "episode":
        for p in jload(D / "podpage" / "episodes.json.gz", []):
            if p.get("hidden") or not p.get("published", True): continue
            t = plain(p.get("show_notes"))
            if p.get("slug") and p.get("name") and len(t) > 200:
                out.append({"key": f"episode:{p['slug']}", "kind": kind, "slug": p["slug"], "title": p["name"], "text": t, "label": "Podcast"})
    return [i for i in out if SLUG.fullmatch(i["slug"])]   # nur harmlose Namen: der slug steht in R2-Schluesseln und Bild-Adressen


SLUG = re.compile(r"[a-z0-9][a-z0-9._-]{0,120}")


def src_hash(it):
    return hashlib.sha1((it["title"] + "\n" + it["text"]).encode()).hexdigest()[:8]


# ------------------------------------------------------------------ Speicher (R2 oder Ordner) und Index
class DirStore:
    def __init__(self, d): self.d = Path(d)
    def _p(self, key):
        p = (self.d / key).resolve()
        if self.d.resolve() not in p.parents: raise ValueError("Schluessel ausserhalb: " + key)
        return p
    def get(self, key):
        p = self._p(key)
        return json.loads(p.read_text("utf-8")) if p.exists() else None
    def put(self, key, obj):
        p = self._p(key); p.parent.mkdir(parents=True, exist_ok=True); p.write_text(json.dumps(obj, ensure_ascii=False, separators=(",", ":")), "utf-8")
    def put_image(self, key, data, ctype="image/webp"):
        p = self._p(key); p.parent.mkdir(parents=True, exist_ok=True); p.write_bytes(data)


class R2Store:
    def __init__(self):
        sys.path.insert(0, str(ROOT / "tools"))
        import r2_common
        self.s3, self.bucket = r2_common.client()
        if not self.s3: raise SystemExit("R2-Zugang fehlt (GitHub-Secrets R2_ACCOUNT_ID, R2_BUCKET, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY)")
    def get(self, key):
        try:
            return json.loads(self.s3.get_object(Bucket=self.bucket, Key=key)["Body"].read().decode("utf-8"))
        except Exception as e:
            if "NoSuchKey" in type(e).__name__ or str(((getattr(e, "response", None) or {}).get("Error") or {}).get("Code", "")) in ("NoSuchKey", "404", "NotFound"): return None
            raise
    def put(self, key, obj):
        self.s3.put_object(Bucket=self.bucket, Key=key, Body=json.dumps(obj, ensure_ascii=False, separators=(",", ":")).encode(), ContentType="application/json; charset=utf-8", CacheControl="no-store")
    def put_image(self, key, data, ctype="image/webp"):
        self.s3.put_object(Bucket=self.bucket, Key=key, Body=data, ContentType=ctype, CacheControl="public, max-age=31536000, immutable")


def spec_key(it): return f"ig/_specs/{it['kind']}/{it['slug']}.json"


def img_key(kind, slug, lang, i, h): return f"ig/{kind}/{slug}/{lang}-{i}-{h}.webp"


def index_path(kind, root=None): return Path(root or ROOT) / "data" / "infographics" / f"{kind}.json.gz"


def load_index(kind, root=None): return jload(index_path(kind, root), {})


def save_index(kind, idx, root=None):
    p = index_path(kind, root); p.parent.mkdir(parents=True, exist_ok=True)
    raw = json.dumps(dict(sorted(idx.items())), ensure_ascii=False, separators=(",", ":"), sort_keys=True).encode()
    buf = io.BytesIO()
    with gzip.GzipFile(fileobj=buf, mode="wb", mtime=0, compresslevel=9) as g: g.write(raw)
    if not p.exists() or p.read_bytes() != buf.getvalue(): p.write_bytes(buf.getvalue())   # deterministisch: ohne Aenderung kein Diff


def state_path(root=None): return Path(root or ROOT) / "data" / "infographics_state.json"


def load_state(root=None): return jload(state_path(root), {"batches": [], "tries": {}, "runs": []})


def save_state(st, root=None):
    p = state_path(root); p.parent.mkdir(parents=True, exist_ok=True); p.write_text(json.dumps(st, ensure_ascii=False, indent=1, sort_keys=True), "utf-8")


# ------------------------------------------------------------------ Anfragen an Claude
def api(method, path, body=None):
    req = anthropic_request(path, body, job=JOB, lang="batch", model=MODEL, api_key=os.environ["ANTHROPIC_API_KEY"]); req.method = method
    import urllib.error
    try:
        return json.loads(urlopen(req, timeout=600).read())
    except urllib.error.HTTPError as e:
        try: d = e.read().decode("utf-8", "replace")[:600]
        except Exception: d = ""
        print(f"API-Fehler {e.code} {method} {path.split('?')[0][-60:]}: {d}", flush=True); raise


def results_lines(url):
    rq = anthropic_request(url, headers={"x-api-key": os.environ["ANTHROPIC_API_KEY"]}, job=JOB, lang="batch", model=MODEL)
    return urlopen(rq, timeout=900).read().decode().splitlines()


def req_specs(it, cid, why=None):
    user = f"Kind: {it['label']}\nTitle: {it['title']}\n\nText:\n{it['text']}"
    if why: user += f"\n\nYour previous answer was rejected by the automatic check: {why}. Write the whole set again and keep every text clearly below its limit."
    return {"custom_id": cid, "params": {"model": MODEL, "max_tokens": 9000 if it.get("kind") in FIGS else 3000, **thinking_off(MODEL), "system": system_specs(it.get("kind")),
            "messages": [{"role": "user", "content": user}]}}


def req_tr(en_set, lang, cid, kind=None):
    return {"custom_id": cid, "params": {"model": MODEL, "max_tokens": 12000 if kind in FIGS else 3500, **thinking_off(MODEL), "system": SYSTEM_TR.replace("{lang}", LANG_NAMES[lang]).replace("{f}", str(LANG_FACTOR)),
            "messages": [{"role": "user", "content": json.dumps(en_set, ensure_ascii=False)}]}}


def cost_eur(n, tin, tout=OUT_EST): return estimated_eur(n * tin, n * tout, batch=True)   # n Anfragen


def est_kind(kind, stage, n=1):
    """Kosten (EUR) von n Anfragen einer Art; stage: specs | tr."""
    if kind in FIGS: tin, tout = PILLAR_EST[stage]; return cost_eur(n, tin, tout)
    return cost_eur(n, IN_EST_SPECS if stage == "specs" else IN_EST_TR)


# ------------------------------------------------------------------ Auswahl
def want_langs(s):
    ls = [x.strip() for x in (s or "").split(",") if x.strip()]
    bad = [x for x in ls if x not in LANGS]
    if bad: raise SystemExit("unbekannte Sprachen: " + ",".join(bad))
    return ls


def want_kinds(s):
    ks = [x.strip() for x in (s or ",".join(KINDS)).split(",") if x.strip()]
    bad = [x for x in ks if x not in KINDS]
    if bad: raise SystemExit("unbekannte Arten: " + ",".join(bad))
    return ks


def lang_ok(it, l):
    """Entsteht fuer diesen Inhalt eine Sprachfassung der Bilder? Leitfaeden nur in Sprachen mit eigener Seite (it["langs"]), alles andere wie bisher."""
    return "langs" not in it or l in it["langs"]


def plan(kinds, langs, root=None, store=None, limit=None):
    """Zaehlt je Art: Inhalte, fehlende englische Bildtexte, fehlende Uebersetzungen je Sprache, fehlende Bilder. Liest Specs nur, wenn store gegeben."""
    rep, tot_spec, tot_tr = {}, 0, 0
    for k in kinds:
        its = items(k, root)
        idx = load_index(k, root)
        r = {"n": len(its), "spec_todo": 0, "tr_todo": {}, "img_todo": {}}
        for it in its:
            have = store.get(spec_key(it)) if store else None
            if not have or not have.get("en"): r["spec_todo"] += 1
            for l in langs:
                if not lang_ok(it, l): continue
                if l != "en" and (not have or not have.get(l)): r["tr_todo"][l] = r["tr_todo"].get(l, 0) + 1
                if not (idx.get(it["slug"]) or {}).get(l): r["img_todo"][l] = r["img_todo"].get(l, 0) + 1
        rep[k] = r
    return rep


def plan_text(rep, langs, limit=None):
    lines, eur = [], 0.0
    for k, r in rep.items():
        n_sp = min(r["spec_todo"], limit) if limit else r["spec_todo"]
        lines.append(f"{k}: {r['n']} Inhalte; Bildtexte EN offen {r['spec_todo']}; Uebersetzung offen " + (", ".join(f"{l}:{n}" for l, n in sorted(r["tr_todo"].items())) or "-")
                     + "; Bilder offen " + (", ".join(f"{l}:{n}" for l, n in sorted(r["img_todo"].items())) or "-"))
        eur += est_kind(k, "specs", n_sp)
        for l, n in r["tr_todo"].items(): eur += est_kind(k, "tr", min(n, limit) if limit else n)
    imgs = sum(sum(r["img_todo"].values()) * (11 if k in FIGS else 3.7) for k, r in rep.items())
    lines.append(f"Schaetzung Haiku (Batch, halber Preis): ca. {eur:.2f} EUR; Bilder ca. {imgs:.0f} (Kopfbild + 2-3), Rendern ca. {imgs * 0.5 / 60:.0f} Minuten reine Rechenzeit (2 Kerne)")
    return "\n".join(lines)


# ------------------------------------------------------------------ Batch senden und einsammeln
RUN_EST = [0.0]   # in diesem Lauf schon vorgemerkte Kosten (EUR): der Verbrauch wird erst beim Einsammeln gemeldet, die Tagespruefung sieht ihn sonst nicht


def open_keys(st):
    return {v for b in st["batches"] for v in b["map"].values()}


def submit(stage, lang, reqs, mapping, st, per_req_eur, root=None):
    """Batch(es) senden: Teile zu hoechstens BATCH_MAX Anfragen. Vor jedem Teil Budget pruefen (inklusive dessen, was dieser Lauf schon vorgemerkt hat) und
    notfalls auf das Restbudget kuerzen. Nach einem Fehler beim Senden wird nichts wiederholt (ein Teil koennte schon angelegt sein: erst collect/Konsole pruefen)."""
    if not reqs: print(f"{stage} {lang}: nichts zu tun"); return
    for i in range(0, len(reqs), BATCH_MAX):
        part = reqs[i:i + BATCH_MAX]
        left = remaining_eur(JOB, MODEL)
        if left is not None:
            fit = int(max(0.0, left - RUN_EST[0]) / max(per_req_eur, 1e-9))
            if fit < len(part): print(f"Budget: Rest {left:.2f} EUR, schon vorgemerkt {RUN_EST[0]:.2f} EUR: nur {fit} von {len(part)} Anfragen"); part = part[:fit]
        est = per_req_eur * len(part)
        if not part or not check_budget(JOB, MODEL, est + RUN_EST[0]):
            print("Abbruch: kein Haiku-Budget (Rest folgt beim naechsten Lauf)"); return
        b = api("POST", "/v1/messages/batches", {"requests": part})
        RUN_EST[0] += est
        st["batches"].append({"id": b["id"], "stage": stage, "lang": lang, "map": {r["custom_id"]: mapping[r["custom_id"]] for r in part}, "est_eur": round(est, 3),
                              "ts": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())})
        save_state(st, root)   # Batch-ID sofort sichern
        print(f"Batch {b['id']} ({stage} {lang}): {len(part)} Anfragen, ca. {est:.2f} EUR")


def cmd_specs(kinds, limit, store, st, root=None):
    groups, n, busy = {}, 0, open_keys(st)   # Leitfaeden (viele Bilder, grosse Anfragen) getrennt von den uebrigen: andere Kosten je Anfrage
    for k in kinds:
        for it in items(k, root):
            if limit and n >= limit: break
            if it["key"] in busy or st["tries"].get(it["key"], 0) >= MAX_TRIES: continue
            have = store.get(spec_key(it))
            if have and have.get("en"): continue
            g = groups.setdefault(k in FIGS, ([], {})); cid = f"s{len(g[0])}"; g[0].append(req_specs(it, cid, (st.get("why") or {}).get(it["key"]))); g[1][cid] = it["key"]; n += 1
    if not groups: submit("specs", "en", [], {}, st, 0, root)
    for big, (reqs, mapping) in sorted(groups.items()):
        submit("specs", "en", reqs, mapping, st, est_kind("pillar" if big else "blog", "specs"), root)


def cmd_translate(kinds, langs, limit, store, st, root=None):
    docs, busy = {}, open_keys(st)
    def doc(it):
        if it["key"] not in docs: docs[it["key"]] = store.get(spec_key(it))   # je Inhalt nur einmal aus R2 lesen, nicht je Sprache
        return docs[it["key"]]
    its = [it for k in kinds for it in items(k, root)]
    for l in langs:
        if l == "en": continue
        groups, n = {}, 0
        for it in its:
            if limit and n >= limit: break
            if not lang_ok(it, l): continue
            tk = it["key"] + "#" + l
            if tk in busy or st["tries"].get(tk, 0) >= MAX_TRIES: continue
            have = doc(it)
            if not have or not have.get("en") or have.get(l): continue
            g = groups.setdefault(it["kind"] in FIGS, ([], {})); cid = f"t{len(g[0])}"; g[0].append(req_tr(have["en"], l, cid, it["kind"])); g[1][cid] = tk; n += 1
        if not groups: submit("translate", l, [], {}, st, 0)
        for big, (reqs, mapping) in sorted(groups.items()):
            submit("translate", l, reqs, mapping, st, est_kind("pillar" if big else "blog", "tr"), root)


def cmd_check(kinds, langs, store, root=None):
    """Was ist offen? -> {"spec","tr","render","open"} (Zeitplan: nur starten, wenn etwas zu tun ist). Zaehlt wie specs/translate/render auswaehlen:
    Inhalte ohne en-Bildtexte, ohne Uebersetzung, ohne Bild; ausgenommen Fehlversuchs-Grenzen und Inhalte in offenen Batches. open = offene Batches (einsammeln)."""
    st = load_state(root); busy = open_keys(st); fails = st.get("rfail", {}); out = {"spec": 0, "tr": 0, "render": 0, "open": len(st["batches"])}
    for k in kinds:
        idx = load_index(k, root)
        for it in items(k, root):
            have = store.get(spec_key(it)) or {}
            if not have.get("en"):
                if it["key"] not in busy and st["tries"].get(it["key"], 0) < MAX_TRIES: out["spec"] += 1
                continue
            for l in langs:
                if not lang_ok(it, l): continue
                if have.get(l):
                    if not (idx.get(it["slug"]) or {}).get(l) and fails.get(f"{it['key']}#{l}", 0) < RENDER_TRIES: out["render"] += 1
                elif l != "en":
                    tk = it["key"] + "#" + l
                    if tk not in busy and st["tries"].get(tk, 0) < MAX_TRIES: out["tr"] += 1
    return out


def apply_results(lines, b, store, st, by_key):
    """Ergebnisse eines Batches pruefen und speichern -> (ok, schlecht, token_ein, token_aus, cache_read, cache_write, unbekannt).
    unbekannt = Ergebnisse zu Inhalten, die es in den Quellen nicht mehr gibt (zaehlt nicht als verloren: Batch bleibt dann im Zustand)."""
    ok = bad = tin = tout = cr = cw = unknown = 0
    seen_err = set()
    for line in lines:
        if not line.strip(): continue
        r = json.loads(line); tk = b["map"].get(r.get("custom_id"))
        if not tk: continue
        key, _, lang = tk.partition("#"); lang = lang or "en"
        res = r.get("result") or {}
        if res.get("type") == "errored":   # Fehler der Anfrage (z. B. Schema): zaehlt als Versuch, damit nichts endlos neu gesendet wird
            st["tries"][tk] = st["tries"].get(tk, 0) + 1
            e = (res.get("error") or {}).get("error") or res.get("error") or {}
            msg = f"{e.get('type', '?')}: {str(e.get('message', ''))[:400]}"
            if msg not in seen_err and len(seen_err) < 3: seen_err.add(msg); print(f"Anfrage-Fehler {tk}: {msg}", flush=True)   # Fehlertext der API (ohne Schluessel), je verschiedene Meldung einmal
            continue
        if res.get("type") != "succeeded": continue   # abgelaufen/abgebrochen: zaehlt nicht
        msg = res["message"]; u = msg.get("usage") or {}
        read, write = int(u.get("cache_read_input_tokens") or 0), int(u.get("cache_creation_input_tokens") or 0)
        tin += int(u.get("input_tokens") or 0) + read + write; tout += int(u.get("output_tokens") or 0); cr += read; cw += write
        it = by_key.get(key)
        if not it: unknown += 1; continue
        txt = "".join(c.get("text", "") for c in msg.get("content") or [] if c.get("type") == "text")
        st_set = parse_json(txt)
        if lang == "en" and it.get("kind") in FIGS: st_set = salvage(st_set, it["kind"])
        doc = store.get(spec_key(it)) or {"v": 1, "src": src_hash(it)}
        err = "kein JSON" if st_set is None else check_set(st_set, lang, None if lang == "en" else doc.get("en"), it["title"] + " " + it["text"] if lang == "en" else None, it.get("kind"))
        if err:
            st["tries"][tk] = st["tries"].get(tk, 0) + 1; bad += 1
            if lang == "en": st.setdefault("why", {})[tk] = err[:160]   # beim naechsten Versuch als Rueckmeldung an die KI
            print(f"verworfen {tk}: {err}")
            continue
        doc[lang] = st_set; store.put(spec_key(it), doc); ok += 1
        if lang == "en" and ok <= 3: print(f"Beispiel {tk}: " + json.dumps(st_set, ensure_ascii=False), flush=True)   # Stichprobe fuer die Durchsicht im Protokoll
    return ok, bad, tin, tout, cr, cw, unknown


def cmd_collect(wait_s, store, st, kinds=KINDS, root=None, api_fn=None, results_fn=None, sleep=time.sleep):
    """Fertige Batches einsammeln. Immer ueber ALLE Arten (ein Batch kann von einem Lauf mit anderen Arten stammen); Zustand nach jedem Batch gesichert."""
    api_fn, results_fn = api_fn or api, results_fn or results_lines
    by_key = {it["key"]: it for k in KINDS for it in items(k, root)}
    deadline = time.time() + wait_s
    while st["batches"]:
        for b in list(st["batches"]):
            info = api_fn("GET", f"/v1/messages/batches/{b['id']}")
            print(b["stage"], b["lang"], info.get("processing_status"), info.get("request_counts"), flush=True)
            if info.get("processing_status") != "ended": continue
            ok, bad, tin, tout, cr, cw, unknown = apply_results(results_fn(info["results_url"]), b, store, st, by_key)
            report_usage(JOB, MODEL, tin, tout, b["lang"], batch=True, cache_read=cr, cache_write=cw)   # bezahlt: immer melden
            st["runs"].append({"id": b["id"], "stage": b["stage"], "lang": b["lang"], "ok": ok, "bad": bad, "unknown": unknown, "tin": tin, "tout": tout, "eur": round(estimated_eur(tin, tout, batch=True), 4)})
            print(f"fertig {b['stage']} {b['lang']}: {ok} ok, {bad} verworfen, {unknown} ohne Inhalt in den Quellen; ca. {estimated_eur(tin, tout, batch=True):.2f} EUR (Schaetzung {b.get('est_eur', 0):.2f})")
            if unknown: print(f"::warning::Batch {b['id']}: {unknown} Ergebnisse ohne passenden Inhalt in den Quellen (bezahlt, nicht verwendbar)")
            st["batches"] = [x for x in st["batches"] if x["id"] != b["id"]]; save_state(st, root)
        if not st["batches"] or time.time() >= deadline: break
        sleep(60)
    save_state(st, root)
    if st["batches"]: print(f"{len(st['batches'])} Batch(es) laufen noch; beim naechsten collect")


# ------------------------------------------------------------------ Rendern, Pruefen, Hochladen
def to_webp(png_bytes):
    from PIL import Image
    im = Image.open(io.BytesIO(png_bytes)).convert("RGB")
    out = io.BytesIO(); im.save(out, "WEBP", quality=82, method=6)
    return out.getvalue()


def to_jpeg(png_bytes):
    """Teilen-Bild: LinkedIn/Facebook zeigen JPEG zuverlaessiger als WebP (die bisherigen Teilen-Bilder sind PNG)."""
    from PIL import Image
    im = Image.open(io.BytesIO(png_bytes)).convert("RGB")
    out = io.BytesIO(); im.save(out, "JPEG", quality=86, optimize=True, progressive=True)
    return out.getvalue()


def render_jobs(jobs, workdir):
    """jobs: [{out, spec}] -> Ergebnisse von render.mjs."""
    jf, rf = Path(workdir) / "jobs.json", Path(workdir) / "res.json"
    jf.write_text(json.dumps(jobs), "utf-8")
    subprocess.run(["node", str(ROOT / "tools" / "infographics" / "render.mjs"), str(jf), str(rf)], check=True)
    return json.loads(rf.read_text("utf-8"))


def spec_for_render(spec, it, lang):
    d = dict(spec); d["lang"] = lang; d["rtl"] = lang in RTL; d["src"] = "m365.fm"
    return d


def cmd_render(kinds, langs, limit, store, root=None, max_min=300, chunk=200, render_fn=None, webp_fn=None, jpeg_fn=None):
    render_fn, webp_fn, jpeg_fn = render_fn or render_jobs, webp_fn or to_webp, jpeg_fn or to_jpeg
    st = load_state(root); fails = st.setdefault("rfail", {})
    t0, made, bad = time.time(), 0, 0
    for k in kinds:
        idx = load_index(k, root)
        todo = []
        for it in items(k, root):
            have = store.get(spec_key(it))
            if not have: continue
            for l in langs:
                if lang_ok(it, l) and have.get(l) and not (idx.get(it["slug"]) or {}).get(l) and fails.get(f"{it['key']}#{l}", 0) < RENDER_TRIES: todo.append((it, l, have))
        if limit: todo = todo[:max(0, limit - made)]
        print(f"{k}: {len(todo)} Bildsaetze zu rendern")
        for i in range(0, len(todo), chunk):
            if time.time() - t0 > max_min * 60: print("Zeitgrenze erreicht; Rest beim naechsten Lauf"); break
            part = todo[i:i + chunk]
            with tempfile.TemporaryDirectory() as wd:
                jobs = []
                for n, (it, l, have) in enumerate(part):
                    for j, spec in enumerate([have[l]["header"]] + have[l]["figs"]):
                        jobs.append({"out": str(Path(wd) / f"{n}-{j}"), "spec": spec_for_render(spec, it, l), "meta": [n, j]})
                try: res = {r["out"]: r for r in render_fn([{"out": j["out"], "spec": j["spec"]} for j in jobs], wd)}
                except Exception as ex:   # Absturz des Renderers (Node, Haenger): jeden Satz einzeln nachrendern, damit nur der ausloesende Satz einen Fehlversuch bekommt
                    print(f"Renderer abgestuerzt ({type(ex).__name__}); Saetze dieses Blocks einzeln")
                    res, crashed = {}, 0
                    for n in range(len(part)):
                        mine = [j for j in jobs if j["meta"][0] == n]
                        try: res.update({r["out"]: r for r in render_fn([{"out": j["out"], "spec": j["spec"]} for j in mine], wd)})
                        except Exception: crashed += 1   # fehlende Ergebnisse zaehlen unten wie ein Layoutfehler dieses einen Satzes
                    if len(part) > 1 and crashed == len(part):   # jeder Satz stuerzt ab: Umgebung kaputt (Browser startet nicht) - kein Fehlversuch zaehlen, Lauf rot
                        save_index(k, idx, root); save_state(st, root)
                        raise RuntimeError(f"Renderer startet nicht ({type(ex).__name__}: {ex}); keine Fehlversuche gezaehlt") from ex
                by_set = {}
                for j in jobs: by_set.setdefault(j["meta"][0], []).append(j)
                for n, js in by_set.items():
                    it, l, have = part[n]
                    rs = [res.get(j["out"]) for j in js]
                    if not all(r and r["ok"] for r in rs):   # Kopfbild und alle Infografiken muessen tadellos sein; sonst nichts hochladen, Grund ins Protokoll, Fehlversuch zaehlen
                        bad += 1; fails[f"{it['key']}#{l}"] = fails.get(f"{it['key']}#{l}", 0) + 1
                        print(f"Layoutfehler {it['key']} {l}: " + "; ".join(sorted({x for r in rs if r for x in r.get("issues", [])})[:4])); continue
                    entry = []
                    for j, r in zip(js, rs):
                        png = Path(j["out"] + ".png").read_bytes()
                        data = webp_fn(png); h = hashlib.sha1(data).hexdigest()[:8]
                        store.put_image(img_key(it["kind"], it["slug"], l, j["meta"][1], h), data)
                        if j["meta"][1] == 0: store.put_image(img_key(it["kind"], it["slug"], l, 0, h)[:-5] + ".jpg", jpeg_fn(png), "image/jpeg")   # Teilen-Bild (og:image)
                        spec = j["spec"]; entry.append([spec["template"], h, spec["alt"]])
                    idx.setdefault(it["slug"], {"s": src_hash(it)})[l] = entry; made += 1
            save_index(k, idx, root); save_state(st, root)
    save_state(st, root)
    print(f"gerendert: {made} Bildsaetze, {bad} mit Layoutfehler")
    return made, bad


# ------------------------------------------------------------------ Aufruf
def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("mode", choices=["plan", "specs", "translate", "collect", "render", "check"])
    ap.add_argument("--kinds"); ap.add_argument("--langs", default=",".join(LANGS)); ap.add_argument("--limit", type=int, default=0)
    ap.add_argument("--wait", type=int, default=0); ap.add_argument("--max-min", type=int, default=300)
    ap.add_argument("--root"); ap.add_argument("--store-dir", help="Ordner statt R2 (Tests)")
    a = ap.parse_args(argv)
    kinds, langs = want_kinds(a.kinds), want_langs(a.langs)
    store = DirStore(a.store_dir) if a.store_dir else (R2Store() if a.mode != "plan" or os.environ.get("R2_BUCKET") else None)
    if a.mode == "plan":
        print(plan_text(plan(kinds, langs, a.root, store, a.limit), langs, a.limit)); return 0
    if a.mode == "check":
        r = cmd_check(kinds, langs, store, a.root); print(*(f"{k}={v}" for k, v in r.items()), sep="\n"); return 0   # key=value: geht in GITHUB_OUTPUT
    st = load_state(a.root)
    if a.mode == "specs": cmd_specs(kinds, a.limit, store, st, a.root)
    elif a.mode == "translate": cmd_translate(kinds, langs, a.limit, store, st, a.root)
    elif a.mode == "collect": cmd_collect(a.wait, store, st, kinds, a.root)
    elif a.mode == "render":
        cmd_render(kinds, langs, a.limit, store, a.root, a.max_min); return 0   # cmd_render liest und speichert den Zustand selbst (Fehlversuche rfail); st hier nicht darueber schreiben
    save_state(st, a.root)
    return 0


if __name__ == "__main__":
    sys.exit(main())
