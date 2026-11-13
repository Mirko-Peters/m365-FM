"""Entitaetsseiten fuellen: englischer SEO-Text (Sonnet, Batch) + Uebersetzung in 14 Sprachen (Haiku, Batch).

Aufruf: python fill_entities.py inventory|plan|run|collect|push [--limit N] [--budget USD] [--model ID] [--no-translate] [--stale]
  inventory  Bestandsaufnahme ohne API -> reports/entity_fill_inventory.md + data/entity_fill/todo.json
  plan       Anzahl, geschaetzte Kosten (Sonnet/Haiku, Batch = halber Preis) und Rest bis alles fertig; sendet nichts
  collect    fertige Batches abholen, pruefen, speichern
  push       KI-Texte (data/entity_fill = Audit-Kopie) in die Datenbank schreiben: POST /api/internal/entity-fill (CRON_KEY), Revision "KI-Entwurf"
  run        collect -> Schreib-Batch (en) -> warten -> collect -> Uebersetzungs-Batches -> warten -> collect; stoppt am Budget
Speicher (siehe entity_fill_data.py): data/entity_fill/en.json, data/entity_fill/i18n/<lang>.json, stale.json, state.json (Batches mit ihren Auftraegen, Versuche),
edited.json, spend.json (Kostenbuch dieses Jobs; eigene Datei, damit kein Commit die Monatszahlen anderer Jobs in data/spend.json ueberschreibt).
Regeln: Datenbank = Quelle der Wahrheit; von Menschen bearbeitete (D1-Export src=human), selbst verwaltete (src=owned), Sponsor-/Eigenfirma-Entitaeten (ifakt, polaris*,
data/sponsorships.json) und Entitaeten mit redaktionellem Langtext werden uebersprungen; Personen nur mit Quellenfakten; Uebersetzungen entstehen einmal und werden nie
automatisch ueberschrieben (translate-once, Vertrag von #315): aendert sich die englische Quelle, steht die Fassung in stale.json und wird nicht mehr gezeigt; neu
uebersetzt wird sie nur mit --stale. Auftraege in noch offenen Batches werden nie ein zweites Mal gekauft; was die Auto-Uebersetzung des Workers schon in ent_tr
hat (zur selben englischen Quelle), wird uebernommen statt gekauft. Laengere Texte, als der Worker speichert, gehen nicht in die Datenbank. max. 3 Versuche je Auftrag.
Kosten: Denken ist abgeschaltet, wo das Modell es zulaesst (ai_gateway.thinking_off), sonst bekommt max_tokens einen Zuschlag; jede Grenze rechnet mit der OBERGRENZE
(Eingabe ein Token je Byte, Ausgabe = max_tokens), die beim Absenden vorgemerkt wird (state.json); nur Modelle mit Preis in PRICES (sonst Abbruch). Grenzen: ENTITY_BUDGET_USD kumulativ fuer alles; Schreiben (Sonnet)
hoechstens SONNET_MONTH_CAP_USD je Kalendermonat; Uebersetzen (Haiku) hoechstens HAIKU_RUN_CAP_EUR je Lauf und nie mehr als der Rest des Haiku-Tagesbudgets
(ai_gateway) abzueglich der noch offenen Uebersetzungs-Batches; der Verbrauch geht nach dem Einsammeln an das Kostenbuch des Workers (ai_gateway.report_usage)."""
import hashlib, json, os, re, sys, time, urllib.request
from datetime import datetime, timezone
from pathlib import Path

import entity_fill_data as FD

ROOT = Path(__file__).parent
D = ROOT / "data"
OUT = FD.FILL
LANGS = FD.LANGS14
NAMES = {"de": "German", "es": "Spanish", "fr": "French", "it": "Italian", "pt": "Brazilian Portuguese", "nl": "Dutch", "pl": "Polish", "id": "Indonesian", "ru": "Russian",
         "uk": "Ukrainian", "ar": "Arabic", "he": "Hebrew", "ja": "Japanese", "ko": "Korean"}
MODEL = os.environ.get("ENTITY_MODEL", "claude-sonnet-5-5")
TMODEL = os.environ.get("ENTITY_TRANSLATE_MODEL", "claude-haiku-5-5")
BUDGET = float(os.environ.get("ENTITY_BUDGET_USD") or 100)
SONNET_MONTH_CAP_USD = 30.0   # feste Monatsgrenze fuer das Schreiben (wie rewrite_shownotes.HARD_CAP_USD); ENTITY_MONTH_USD kann sie nur senken
MONTH_CAP = min(SONNET_MONTH_CAP_USD, float(os.environ.get("ENTITY_MONTH_USD") or SONNET_MONTH_CAP_USD))
HAIKU_RUN_CAP_EUR = 4.0       # je Lauf, innerhalb des Haiku-Tagesbudgets von 5 EUR (ai_gateway.check_budget); ENTITY_HAIKU_RUN_EUR kann sie nur senken
HAIKU_RUN_EUR = min(HAIKU_RUN_CAP_EUR, float(os.environ.get("ENTITY_HAIKU_RUN_EUR") or HAIKU_RUN_CAP_EUR))
WRITE_MAX_TOKENS = 1800       # Antwort eines Schreibauftrags (Denken aus); TR_MAX_TOKENS ist die Obergrenze je Uebersetzung
TR_MAX_TOKENS = 4000
THINK_TOKENS = 4000           # Zuschlag auf max_tokens fuer Modelle, bei denen sich das Denken nicht abschalten laesst
MAX_TRIES = int(os.environ.get("MAX_TRIES", "3"))
PER_BATCH = int(os.environ.get("PER_BATCH", "5000"))
WAIT_MIN = int(os.environ.get("WAIT_MIN", "90"))
# Listenpreis je 1 Mio. Token (Mirko, 9.11.2026: Sonnet 2/10, Haiku 0.10/0.50; uebrige laut Anthropic-Preisliste, Stand 3.11.2026); Batch API = halber Preis.
# Nur Modelle aus dieser Liste: ein anderes --model/ENTITY_MODEL bricht ab, statt mit einem zu niedrigen Preis die harten Grenzen auszuhebeln.
PRICES = {"claude-sonnet-5-5": (2.0, 10.0), "claude-sonnet-5": (2.0, 10.0), "claude-sonnet-4-6": (3.0, 15.0), "claude-haiku-5-5": (0.10, 0.50), "claude-haiku-4-5": (1.0, 5.0),
          "claude-opus-5-5": (4.0, 20.0), "claude-opus-5": (5.0, 25.0), "claude-opus-4-8": (5.0, 25.0), "claude-opus-4-7": (5.0, 25.0), "claude-opus-4-6": (5.0, 25.0),
          "claude-fable-5-2": (8.0, 40.0), "claude-mythos-5-2": (8.0, 40.0), "claude-fable-5-1": (10.0, 50.0), "claude-mythos-5-1": (10.0, 50.0), "claude-fable-5": (10.0, 50.0)}
BATCH_FACTOR = 0.5
SPONSORED = ("ifakt", "polaris")   # Eigenfirma/Sponsor: nie anfassen (id == ifakt oder Praefix polaris)
TYPE_ORDER = ("product", "platform", "cert", "concept", "org", "event", "industry", "job", "category", "media", "person")
WRITE_OUT_TOK = {"full": 650, "desc": 70}   # Ausgabe-Token je Schreibauftrag (Schaetzung bis Messwerte da sind)
LANG_FACTOR = {"ru": 2.2, "uk": 2.2, "ar": 2.2, "he": 2.2, "ja": 1.8, "ko": 2.0}   # Ausgabe-Token je Quell-Token (wie translate_blog.py)
KEEP = ["Microsoft 365", "Microsoft Teams", "SharePoint", "OneDrive", "Copilot Studio", "Copilot", "Power BI", "Power Apps", "Power Automate", "Power Platform", "Dataverse",
        "Azure", "Entra", "Intune", "Purview", "Defender", "Sentinel", "Fabric", "Exchange Online", "Outlook", "Excel", "PowerPoint", "Word", "Viva", "Loop", "Planner",
        "Dynamics 365", "GitHub", "Windows", "Microsoft Graph", "PowerShell", "M365.FM", "M365 Show", "M365Con", "MVP"]
SUPERLATIVES = re.compile(r"\b(best|leading|market[- ]leading|world[- ]class|#1|number one|ultimate|revolutionary|unmatched|unrivall?ed|cutting[- ]edge|game[- ]chang\w+|"
                          r"most (?:powerful|popular|advanced)|unparalleled|state[- ]of[- ]the[- ]art|industry[- ]leading|perfect)\b", re.I)
URL_RX = re.compile(r"(https?://|www\.|\b[\w-]+\.(?:com|net|org|io|de|ai|dev|microsoft)\b/?|@[\w.-]+\.\w{2,})", re.I)
SCRIPT = {"ru": "Ѐ-ӿ", "uk": "Ѐ-ӿ", "ar": "؀-ۿ", "he": "֐-׿", "ja": "぀-ヿ一-鿿", "ko": "가-힯ᄀ-ᇿ"}


# ---------- Hilfen ----------
def jload(p, default):
    try:
        return json.loads(Path(p).read_text("utf-8"))
    except Exception:
        return default


def jsave(p, v, **kw):
    p = Path(p); p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(json.dumps(v, ensure_ascii=False, indent=kw.get("indent", 1), sort_keys=True), encoding="utf-8")


def key(eid): return hashlib.sha1(eid.encode()).hexdigest()[:12]
def hsh(o): return hashlib.sha1(json.dumps(o, sort_keys=True, ensure_ascii=False).encode()).hexdigest()[:16]
def words(t): return len(re.findall(r"\S+", t or ""))
def price(model):
    p = PRICES.get(str(model).strip().lower())
    if not p: raise SystemExit(f"Unbekanntes Modell {model!r}: kein Preis hinterlegt (PRICES) - ohne Preis keine Kostengrenze, es wird nichts gesendet")
    return p


def check_models(model, tmodel):
    """Vor jedem Lauf: beide Modelle haben einen Preis; uebersetzt wird nur mit Haiku (nur dort gelten Tagesbudget und Kostenbuch des Workers)."""
    price(model); price(tmodel)
    if "haiku" not in str(tmodel).lower(): raise SystemExit(f"ENTITY_TRANSLATE_MODEL {tmodel!r}: Uebersetzen nur mit einem Haiku-Modell (Haiku-Tagesbudget)")
def cost(model, tin, tout, batch=True):
    pi, po = price(model)
    return (tin * pi + tout * po) / 1e6 * (BATCH_FACTOR if batch else 1)
def tok(t): return int(len(t) / 3.6) + 1


def is_sponsored(eid, extra=()):
    return eid in extra or eid == "ifakt" or eid.startswith("polaris")


def sponsored_ids():
    return FD.sponsored_ids()


def month_key():
    return datetime.now(timezone.utc).strftime("%Y-%m")


def max_tokens(model, base):
    """max_tokens einer Anfrage: Denken aus (thinking_off) -> base, sonst base + THINK_TOKENS (Denken zaehlt zur Ausgabe)."""
    from ai_gateway import thinking_off
    return base if thinking_off(model) else base + THINK_TOKENS


def cost_cap(model, in_bytes, out_tokens):
    """OBERGRENZE der Kosten einer Batch-Anfrage: Eingabe hoechstens ein Token je UTF-8-Byte, alles zum Preis eines Cache-Eintrags (1,25x), Ausgabe = max_tokens."""
    return cost(model, int(in_bytes * 1.25) + 64, out_tokens)


def nbytes(*parts): return sum(len(str(x).encode("utf-8")) for x in parts)


# ---------- Daten ----------
def load_entities():
    ents = {}
    for f in ("entities", "guest_entities", "speaker_entities"):
        for e in jload(D / f"{f}.json", []):
            ents.setdefault(e["id"], e)
    return ents


def load_gentext():
    return FD.load_gentext()


_EPS = None
def episodes():
    global _EPS
    if _EPS is None:
        import site_podpage as P
        eps = [x for x in P.load("episodes") if x.get("published") not in (False, "False") and x.get("hidden") not in (True, "True")]
        eps.sort(key=lambda x: x["create_time"], reverse=True)
        _EPS = [(x["name"], (x["create_time"] or "")[:10], x["name"] + " " + P.plain(x.get("summary")) + " " + P.plain(x.get("show_notes"))) for x in eps]
    return _EPS


def names_of(e):
    out = {e["name"]} | set(e.get("aliases") or [])
    out |= {re.sub(r"^Microsoft\s+", "", n) for n in out}
    return {n for n in out if len(n) >= 4}


_EPC = {}; _IDX = None
def _index():
    global _IDX
    if _IDX is None:
        _IDX = {}
        for i, (_, _, text) in enumerate(episodes()):
            for w in set(re.findall(r"[\w-]+", text.lower())): _IDX.setdefault(w, set()).add(i)
    return _IDX


def episodes_for(e, limit=6):
    ck = (e["id"], limit)
    if ck in _EPC: return _EPC[ck]
    eps, idx = episodes(), _index(); cand = set(); rxs = []
    for n in names_of(e):
        toks = re.findall(r"[\w-]+", n.lower())
        sets = [idx.get(t, set()) for t in toks]
        if toks: cand |= set.intersection(*sets)   # nur Folgen, die alle Woerter des Namens enthalten
        rxs.append(re.compile(r"(?<![\w-])" + re.escape(n) + r"(?![\w-])", re.I))
    hits = []
    for i in sorted(cand):
        title, date, text = eps[i]
        n = sum(len(r.findall(text)) for r in rxs)
        if n: hits.append((not any(r.search(title) for r in rxs), -min(n, 5), i, title, date))
    hits.sort(key=lambda h: (h[0], h[1], h[2]))
    _EPC[ck] = [{"title": t, "date": d} for *_, t, d in hits[:limit]]
    return _EPC[ck]


def facts_for(e, ents, eps=None):
    """Alle Fakten, die das Modell sehen darf (und die der Hash abdeckt)."""
    d = e.get("desc") or {}
    rel = [{"relation": p, "name": ents[t]["name"]} for p, t in (e.get("rel") or []) if t in ents][:14]
    f = {"name": e["name"], "type": e["type"], "aliases": (e.get("aliases") or [])[:8], "short_description": d.get("en", ""), "relations": rel,
         "docs_url": e.get("docs", ""), "official_site": e.get("web", ""), "episodes": episodes_for(e) if eps is None else eps}
    for k in ("job", "company", "version", "released", "license", "exam", "level"):
        if e.get(k): f[k] = e[k]
    if e.get("long", {}).get("en"): f["existing_long"] = e["long"]["en"][:1200]
    return f


def fhash(f):
    """Hash der Fakten OHNE die Folgenliste: eine neue Folge zwischen Absenden und Einsammeln macht einen bezahlten Text nicht ungueltig (die genannten Folgen
    stimmen weiter); aendern sich Name, Beschreibung, Beziehungen oder Links, gilt das Ergebnis als veraltet."""
    return hsh({k: v for k, v in f.items() if k != "episodes"})


def person_has_source(e, f):
    return bool(e.get("job") or e.get("company") or f["episodes"] or len(f["short_description"]) > FD.SHORT_DESC and not e.get("speaker"))


def status(e, gen, fill_en, edited, spons):
    """-> (skip_reason | None, write 'full'|'desc'|None)"""
    eid = e["id"]
    if is_sponsored(eid, spons): return "sponsored", None
    if eid in edited or e.get("edited"): return "member_edited", None
    has_long = bool((e.get("long") or {}).get("en")) or eid in gen
    short = len((e.get("desc") or {}).get("en") or "") < FD.SHORT_DESC
    if eid in fill_en and fill_en[eid].get("desc") and (has_long or fill_en[eid].get("long")): return None, None
    if not has_long: return None, "full"
    return (None, "desc") if short else (None, None)


# ---------- Prompts ----------
SYSTEM_WRITE = """You write entity pages for M365.FM, an English-language knowledge base about the Microsoft ecosystem. Write SEO-friendly, neutral, factual English.

Use ONLY the facts in the JSON the user sends (name, type, short description, relations, episode titles, official links). Never invent facts, dates, numbers, features, prices, versions or quotes. If little is known, write less rather than padding.
Rules:
- No superlatives or promotion (no "best", "leading", "ultimate", "revolutionary", "cutting-edge"). No marketing tone. No second person.
- Do not output any URL, domain or e-mail address.
- Use the entity's exact name (and product/company/person names) in the text as given. Do not translate or alter names.
- Person entities: only the public professional role and work connection stated in the facts. Nothing private, no age, family, health, politics; never invent a biography.
- Write for people who search for the term: first sentence defines it, then what it is used for, how it relates to the linked topics, where it appears on M365.FM (mention episode titles only if given).
Output ONLY one JSON object, no markdown fences:
{"desc": "<ONE sentence, 90-170 characters, also used as hover text and meta description>",
 "long": "<150-300 words in 2-4 short paragraphs separated by a blank line (\\n\\n); fewer if little is known>",
 "faq": [{"q": "<question>", "a": "<answer of 1-3 sentences grounded in the facts>"}]}
"faq" has 2-3 items, or [] if the facts do not support questions. If the user asks for desc only, output {"desc": "..."} only."""


def write_prompt(f, want):
    ask = "Output desc, long and faq." if want == "full" else 'Output only {"desc": "..."} (the existing long text is given as context).'
    return ask + "\nFacts:\n" + json.dumps(f, ensure_ascii=False)


def system_translate(lang, protected):
    return (f"You translate website text from English into {NAMES[lang]} for M365.FM, a knowledge base about the Microsoft ecosystem. Keep the meaning exactly; add nothing, drop nothing; natural, neutral register.\n"
            "Never translate or transliterate product, company, feature, certification or person names (e.g. Microsoft 365, Copilot, SharePoint, Power Automate, M365.FM) - keep them exactly as written in the source.\n"
            "Do not output URLs. Keep paragraph breaks (\\n\\n) and the number and order of FAQ items.\n"
            "The user message is a JSON object with some of the keys desc (string), long (string), faq (list of {q, a}). Output ONLY a JSON object with exactly the same keys, translated, no markdown fences.")


# ---------- Pruefung ----------
def parse_json(text):
    t = (text or "").strip()
    t = re.sub(r"^```(?:json)?\s*|\s*```$", "", t)
    try:
        v = json.loads(t)
    except Exception:
        m = re.search(r"\{.*\}", t, re.S)
        if not m: return None
        try: v = json.loads(m.group(0))
        except Exception: return None
    return v if isinstance(v, dict) else None


def validate_write(out, f, want):
    """-> (record | None, Fehler)"""
    if not out: return None, "no_json"
    desc = (out.get("desc") or "").strip()
    if not 40 <= len(desc) <= 230: return None, "desc_length"
    if re.search(r"[.!?]\s+[A-Z]", desc): return None, "desc_not_one_sentence"
    rec = {"desc": desc}
    texts = [desc]
    if want == "full":
        long = (out.get("long") or "").strip()
        sparse = not (f["episodes"] or f["relations"] or f["docs_url"] or f["official_site"])
        w = words(long)
        if w < (40 if sparse else 100) or w > 330: return None, "long_length"
        names = {f["name"]} | set(f.get("aliases") or [])
        if not any(n.lower() in long.lower() for n in names): return None, "name_missing"
        rec["long"] = long; texts.append(long)
        faq = out.get("faq") or []
        if not isinstance(faq, list) or len(faq) > 3: return None, "faq_shape"
        fq = []
        for x in faq:
            if not isinstance(x, dict) or not (x.get("q") or "").strip() or not (x.get("a") or "").strip() or len(x["q"]) > 180 or len(x["a"]) > 500: return None, "faq_shape"
            fq.append({"q": x["q"].strip(), "a": x["a"].strip()}); texts += [x["q"], x["a"]]
        rec["faq"] = fq
    blob = "\n".join(texts)
    if URL_RX.search(blob): return None, "url"
    if SUPERLATIVES.search(blob): return None, "superlative"
    return rec, None


def validate_translation(lang, src, out, protected):
    """src/out: {desc?, long?, faq?}. -> (record | None, Fehler)"""
    if not out: return None, "no_json"
    rec = {}
    for k in src:
        v = out.get(k)
        if k == "faq":
            if not isinstance(v, list) or len(v) != len(src["faq"]): return None, "faq_shape"
            if any(not isinstance(x, dict) or not x.get("q") or not x.get("a") for x in v): return None, "faq_shape"
            rec[k] = [{"q": x["q"].strip(), "a": x["a"].strip()} for x in v]
            s_txt = " ".join(x["q"] + " " + x["a"] for x in src["faq"]); t_txt = " ".join(x["q"] + " " + x["a"] for x in rec[k])
        else:
            if not isinstance(v, str) or not v.strip(): return None, "missing_" + k
            rec[k] = v.strip(); s_txt, t_txt = src[k], rec[k]
        if URL_RX.search(t_txt) and not URL_RX.search(s_txt): return None, "url"
        for n in protected:
            if n in s_txt and n not in t_txt: return None, "name_changed"
        ratio = len(t_txt) / max(1, len(s_txt))
        lo, hi = (0.15, 1.6) if lang in ("ja", "ko") else (0.4, 3.0)
        if not lo <= ratio <= hi: return None, "length_ratio"
        if lang in SCRIPT and len(s_txt) > 60 and len(re.findall(f"[{SCRIPT[lang]}]", t_txt)) < 0.3 * len(re.findall(r"[^\W\d_]", t_txt)): return None, "wrong_script"
        if "�" in t_txt: return None, "encoding"
    return rec, None


# ---------- Aufgabenliste ----------
D1 = {}   # id -> {"src": seed|ai|human, "h": Hash von desc/long/faq, "en": {desc, long} der live-Fassung} aus dem D1-Export (wird von edited_ids gefuellt)


def d1_edited(items):
    """Datenbank = Quelle der Wahrheit: bearbeitet = die live-Fassung stammt von einem Menschen (Export-Feld src == human). Nur-Uebernahme (seed) und
    eigene KI-Entwuerfe (ai) sperren nicht. Fehlt src (aelterer Worker), gilt jede D1-Fassung als bearbeitet (fail-closed)."""
    D1.clear(); ids = set()
    for it in items:
        if not it.get("id"): continue
        src = it.get("src") or "human"
        dd = it.get("data") if isinstance(it.get("data"), dict) else {}
        D1[it["id"]] = {"src": src, "h": it.get("h") or "", "en": {f: str((dd.get(f) if isinstance(dd.get(f), dict) else {}).get("en") or "") for f in ("desc", "long")}}
        if src == "human" or (src != "seed" and src != "ai"): ids.add(it["id"])
    return ids


def fetch_export():
    api = os.environ.get("COMMUNITY_API", "https://api-dub.m365.fm")
    req = urllib.request.Request(api.rstrip("/") + "/api/entity/export", headers={"user-agent": "m365fm-actions/1.0 (+https://www.m365.fm)", "accept": "application/json", "cache-control": "no-cache"})
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read().decode()).get("items") or []


def fetch_tr():
    """Uebersetzungen der Auto-Uebersetzung des Workers (ent_tr, /api/entity/tr): {eid: {field: {lang: text}}}; nicht erreichbar -> {} (dann wird nur nichts uebernommen)."""
    api = os.environ.get("COMMUNITY_API", "https://api-dub.m365.fm")
    try:
        req = urllib.request.Request(api.rstrip("/") + "/api/entity/tr", headers={"user-agent": "m365fm-actions/1.0 (+https://www.m365.fm)", "accept": "application/json", "cache-control": "no-cache"})
        with urllib.request.urlopen(req, timeout=60) as r:
            v = json.loads(r.read().decode()).get("items")
        return v if isinstance(v, dict) else {}
    except Exception as ex:
        print(f"::warning::/api/entity/tr nicht erreichbar ({type(ex).__name__}); vorhandene Auto-Uebersetzungen werden diesmal nicht uebernommen"); return {}


def adopt_ent_tr(ents, gen, fill, i18n, tr, edited=(), spons=()):
    """Was die Auto-Uebersetzung (autotr.js) schon in ent_tr hat, wird nicht noch einmal gekauft: die Fassung kommt als vorhandene Uebersetzung nach
    data/entity_fill/i18n (Quelle sh = aktueller englischer Text). Nur wenn ihre Quelle - der englische Text der D1-Fassung - genau der Quelltext ist, den
    dieser Job uebersetzen wuerde (effective_en); Vorhandenes bleibt (translate-once). -> geaenderte Sprachen"""
    touched = set(); today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    for eid, fields in (tr or {}).items():
        e = ents.get(eid); d = D1.get(eid) or {}
        if not e or not isinstance(fields, dict) or eid in edited or is_sponsored(eid, spons) or e.get("edited"): continue
        src = effective_en(e, gen, fill); db_en = d.get("en") or {}
        for f in ("desc", "long"):
            if f not in src or not db_en.get(f) or FD.norm(db_en[f]) != FD.norm(src[f]): continue   # ent_tr uebersetzt den D1-Text: nur dieselbe Quelle zaehlt
            for lang, text in (fields.get(f) if isinstance(fields.get(f), dict) else {}).items():
                if lang not in LANGS or not isinstance(text, str) or not text.strip(): continue
                rec = i18n.setdefault(lang, {}).setdefault(eid, {"h": hsh(src), "m": "autotr", "ts": today})
                if rec.get(f): continue
                rec[f] = text.strip(); rec.setdefault("sh", {})[f] = FD.src_hash(src[f]); touched.add(lang)
    return touched


def edited_ids(strict):
    """IDs der von Menschen bearbeiteten Entitaeten (D1-Export). strict: ohne frische Antwort abbrechen (Fail-closed)."""
    cache = OUT / "edited.json"
    try:
        ids = d1_edited(fetch_export())
        jsave(cache, sorted(ids), indent=0)
        return ids
    except Exception as ex:
        if strict:
            raise SystemExit(f"D1-Export nicht erreichbar ({type(ex).__name__}) - ohne die Liste bearbeiteter Entitaeten wird nichts gesendet (fail-closed)")
        print(f"::warning::D1-Export nicht erreichbar ({type(ex).__name__}); nehme gespeicherte Liste")
        return set(jload(cache, []))


def payload_for(eid, fill, i18n):
    """Was an /api/internal/entity-fill geht: englischer KI-Text, deutscher und die uebrigen Sprachen (Audit-Stand data/entity_fill)."""
    # nur Felder, die der Worker ungekuerzt speichert (FD.fits): ein laengerer Text bliebe sonst mitten im Satz abgeschnitten in D1 stehen; die Seite zeigt ihn
    # dann weiter aus data/entity_fill (mit KI-Hinweis)
    en = fill.get(eid) or {}; pick = lambda r: {k: r[k] for k in ("desc", "long", "faq") if r.get(k) and FD.fits(k, r[k])}
    out = {"id": eid, **pick(en), "de": pick(i18n.get("de", {}).get(eid) or {}),
           "tr": {l: pick(i18n[l].get(eid) or {}) for l in LANGS if l != "de" and i18n.get(l, {}).get(eid)}}
    return out


def push(ents, state, edited, fill, i18n, post=None, spons=None):
    """KI-Texte in die Datenbank schreiben (neue Revision "KI-Entwurf" des Systemnutzers). Der Worker prueft nochmals Mensch/Hash und fuellt nur duenne Felder."""
    api = os.environ.get("COMMUNITY_API", "https://api-dub.m365.fm").rstrip("/"); keyv = os.environ.get("CRON_KEY", "")
    if post is None:
        if not keyv: raise SystemExit("CRON_KEY fehlt")
        def post(items):
            req = urllib.request.Request(api + "/api/internal/entity-fill", data=json.dumps({"items": items}).encode(), method="POST", headers={
                "content-type": "application/json", "x-cron-key": keyv, "x-requested-with": "m365", "user-agent": "m365fm-actions/1.0 (+https://www.m365.fm)"})
            with urllib.request.urlopen(req, timeout=120) as r: return json.loads(r.read().decode())
    done = state.setdefault("pushed", {}); jobs = []; spons = sponsored_ids() if spons is None else spons   # Sponsor erst nach dem Schreiben geworden: trotzdem nie senden
    for eid in sorted(set(fill) | set(i18n.get("de", {}))):
        d = D1.get(eid)
        if eid not in ents or not d or eid in edited or d["src"] not in ("seed", "ai") or is_sponsored(eid, spons): continue
        item = payload_for(eid, fill, i18n); ph = hsh(item)
        if done.get(eid) == ph: continue
        item["base"] = (fill.get(eid) or {}).get("d1h") or d["h"]   # Stand, fuer den der Text erzeugt wurde (sonst der aktuelle)
        jobs.append((eid, ph, item))
    counts = {}
    for i in range(0, len(jobs), 20):
        part = jobs[i:i + 20]; res = post([j[2] for j in part])
        for r in res.get("results") or []:
            counts[r["status"]] = counts.get(r["status"], 0) + 1
            job = next((j for j in part if j[0] == r["id"]), None)
            if not job: continue
            if r["status"] in ("ok", "unchanged", "human_edited"): done[job[0]] = job[1]
            elif r["status"] == "changed_meanwhile" and (fill.get(job[0]) or {}).get("d1h"):
                fill[job[0]].pop("d1h", None); print(f"::warning::{job[0]}: changed_meanwhile - uebersprungen, naechster Lauf nimmt den dann aktuellen Stand")
    jsave(OUT / "en.json", fill); jsave(OUT / "state.json", state)
    print("Push in die Datenbank: " + (", ".join(f"{k} {v}" for k, v in sorted(counts.items())) or "nichts zu senden"))
    return counts


def effective_en(e, gen, fill):
    """Quelltext fuer die Uebersetzung: redaktionell > GENTEXT > KI-Text. -> {desc?, long?, faq?} (dieselbe Regel liest der Seitenbau: entity_fill_data)"""
    return FD.effective_en(e, gen, fill)


def translate_need(e, lang, src, gen, i18n, restale=False):
    """Welche Felder fehlen in lang? Vorhandenes (redaktionell, GENTEXT, frueher uebersetzt) wird nie automatisch ueberschrieben; eine Uebersetzung, deren
    englische Quelle sich geaendert hat (stale), nur mit restale (--stale)."""
    eid = e["id"]; have = (i18n.get(lang) or {}).get(eid) or {}
    old = set(FD.stale_against(have, src)) if restale else set()
    got = lambda k: have.get(k) and k not in old
    d = e.get("desc") or {}; need = {}
    if "desc" in src and not got("desc") and (not d.get(lang) or d.get(lang) == d.get("en")): need["desc"] = src["desc"]
    if "long" in src and not got("long") and not (e.get("long") or {}).get(lang) and not (gen.get(eid) or {}).get(lang): need["long"] = src["long"]
    if "faq" in src and not got("faq"): need["faq"] = src["faq"]
    return need


def stale_report(ents, gen, fill, i18n):
    """{lang: {id: [felder]}} der Uebersetzungen, deren englische Quelle sich seit dem Uebersetzen geaendert hat; schreibt data/entity_fill/stale.json."""
    out = {}
    for lang in LANGS:
        for eid, rec in sorted((i18n.get(lang) or {}).items()):
            if eid not in ents: continue
            st = FD.stale_against(rec, effective_en(ents[eid], gen, fill))
            if st: out.setdefault(lang, {})[eid] = st
    f = OUT / "stale.json"; new = json.dumps(out, ensure_ascii=False, indent=1, sort_keys=True); old = f.read_text("utf-8") if f.exists() else ""
    if new != old and (out or old): OUT.mkdir(parents=True, exist_ok=True); f.write_text(new, encoding="utf-8")
    return out


def build_todo(ents, gen, fill, i18n, edited, spons, state, with_facts=False, restale=False):
    todo, skipped = [], {}
    tries = state.get("tries", {})
    for e in sorted(ents.values(), key=lambda x: (TYPE_ORDER.index(x["type"]) if x["type"] in TYPE_ORDER else 99, x["id"])):
        skip, want = status(e, gen, fill, edited, spons)
        row = {"id": e["id"], "type": e["type"], "name": e["name"]}
        if skip:
            skipped.setdefault(skip, []).append(e["id"]); continue
        f = None
        if want:
            f = facts_for(e, ents)
            if e["type"] == "person" and not person_has_source(e, f):
                skipped.setdefault("needs_source", []).append(e["id"]); want = None
            elif tries.get("w:" + e["id"], 0) >= MAX_TRIES:
                skipped.setdefault("max_tries", []).append(e["id"]); want = None
        if want: row["write"] = want
        src = effective_en(e, gen, fill)
        if e["type"] == "person" and "needs_source" in skipped and e["id"] in skipped["needs_source"]: src = {}
        tr = {}
        for lang in LANGS:
            need = translate_need(e, lang, src, gen, i18n, restale)
            if need and tries.get(f"t:{lang}:{e['id']}", 0) < MAX_TRIES: tr[lang] = list(need)
        if tr: row["translate"] = tr   # Sprache -> fehlende Felder; gilt fuer die jetzt vorhandene en-Fassung
        elif want is None and not row.get("write"): continue
        # Entitaeten, deren en-Text erst noch geschrieben wird, brauchen spaeter alle 14 Sprachen
        if want and not tr: row["translate_after_write"] = True
        todo.append(row)
    return todo, skipped


def estimate(todo, ents, gen, fill, i18n):
    """Anzahl und Kosten (Batch-Preis, USD) fuer Schreiben und Uebersetzen, inkl. Rest bis alles fertig."""
    sys_w = tok(SYSTEM_WRITE); w_n = w_in = w_out = 0; t_in = t_out = t_n = 0
    for r in todo:
        e = ents[r["id"]]
        if r.get("write"):
            w_n += 1; w_in += sys_w + tok(json.dumps(facts_for(e, ents, eps=[{"title": "x" * 70, "date": "2026-01-01"}] * 3), ensure_ascii=False))
            w_out += WRITE_OUT_TOK[r["write"]]
    tr_sys = {l: tok(system_translate(l, [])) for l in LANGS}
    for r in todo:
        e = ents[r["id"]]
        if r.get("write"):   # en-Text kommt erst: Annahme alle Felder, 14 Sprachen
            src_t = int(WRITE_OUT_TOK[r["write"]]); fields = {l: 1 for l in LANGS}
            for l in LANGS:
                t_n += 1; t_in += tr_sys[l] + src_t; t_out += int(src_t * LANG_FACTOR.get(l, 1.5))
        else:
            src = effective_en(e, gen, fill)
            for l, fl in (r.get("translate") or {}).items():
                st = sum(tok(json.dumps(src[k], ensure_ascii=False)) for k in fl)
                t_n += 1; t_in += tr_sys[l] + st; t_out += int(st * LANG_FACTOR.get(l, 1.5))
    cw, ct = cost(MODEL, w_in, w_out), cost(TMODEL, t_in, t_out)
    return {"write_n": w_n, "write_in": w_in, "write_out": w_out, "write_usd": round(cw, 2), "tr_n": t_n, "tr_in": t_in, "tr_out": t_out, "tr_usd": round(ct, 2), "total_usd": round(cw + ct, 2)}


# ---------- Ausgaben ----------
SPEND = "spend.json"   # data/entity_fill/spend.json: Kostenbuch nur dieses Jobs (nicht data/spend.json - dort schreiben articles/shownotes ihre Monatszahlen)


def spend_entities():
    return jload(OUT / SPEND, {"usd": 0.0})


def add_spend(kind, model, tin, tout, month=None):
    sp = spend_entities()
    c = cost(model, tin, tout)
    sp["usd"] = round(sp.get("usd", 0.0) + c, 4)
    k = sp.setdefault(kind, {"input_tokens": 0, "output_tokens": 0, "usd": 0.0})
    k["input_tokens"] += tin; k["output_tokens"] += tout; k["usd"] = round(k["usd"] + c, 4)
    mo = sp.setdefault("months", {}).setdefault(month or month_key(), {})
    mo[kind + "_usd"] = round(mo.get(kind + "_usd", 0.0) + c, 4)
    sp["updated"] = datetime.now(timezone.utc).isoformat()[:19]
    jsave(OUT / SPEND, sp)
    return c


def pending_usd(state, kind=None, month=None):
    return sum(b.get("est_usd", 0) for b in state.get("batches", []) if (kind is None or b.get("kind") == kind) and (month is None or b.get("month", month) == month))


def room(budget, state):
    return budget - spend_entities().get("usd", 0.0) - pending_usd(state)


def month_room(state, month=None):
    """Rest der Monatsgrenze fuer das Schreiben: verbucht plus Obergrenze offener Schreib-Batches dieses Monats."""
    m = month or month_key()
    return MONTH_CAP - spend_entities().get("months", {}).get(m, {}).get("write_usd", 0.0) - pending_usd(state, "write", m)


def haiku_room_usd(state=None):
    """Uebersetzen je Lauf: HAIKU_RUN_EUR und nie mehr als der Rest des Haiku-Tagesbudgets laut Worker (None = nicht abrufbar -> check_budget entscheidet).
    Offene Uebersetzungs-Batches dieses Jobs kennt der Worker noch nicht (gemeldet wird erst beim Einsammeln): ihre Obergrenze geht vom Tagesrest ab."""
    from ai_gateway import remaining_eur
    rate = max(0.000001, float(os.environ.get("USD_PER_EUR", "1.08"))); rest = remaining_eur("fill_entities", TMODEL)
    if rest is not None: rest = max(0.0, rest - pending_usd(state or {}, "translate") / rate)
    return min(HAIKU_RUN_EUR, rest if rest is not None else HAIKU_RUN_EUR) * rate


# ---------- API ----------
def api(method, path, body=None, raw=False, model=""):
    from ai_gateway import anthropic_request, urlopen
    req = anthropic_request(path, body, job="fill_entities", lang="batch", model=model or MODEL, api_key=os.environ["ANTHROPIC_API_KEY"])
    req.method = method
    r = urlopen(req, timeout=900).read()
    return r if raw else json.loads(r)


def usage_in(u):
    return int(u.get("input_tokens") or 0) + int(u.get("cache_read_input_tokens") or 0) + int(u.get("cache_creation_input_tokens") or 0), int(u.get("output_tokens") or 0)


def busy_keys(state):
    """Auftraege in noch offenen Batches ('w_<key>', 't_<lang>_<key>') - die kauft kein Lauf ein zweites Mal. -> (keys, Arten mit Batches ohne Auftragsliste)"""
    keys, blind = set(), set()
    for b in state.get("batches", []):
        if isinstance(b.get("ids"), list): keys |= set(b["ids"])
        else: blind.add(b.get("kind"))
    return keys, blind


def cid_key(custom_id):
    """custom_id -> Auftragsschluessel ohne Hash: w_<key>_<h> -> w_<key>, t_<lang>_<key>_<h> -> t_<lang>_<key>"""
    return custom_id.rsplit("_", 1)[0]


def select_writes(todo, ents, budget_room, limit, state, refresh=False, busy=()):
    """Schreibauftraege in Reihenfolge, solange die Obergrenze der Kosten ins Budget passt. -> (requests, Obergrenze in USD)"""
    reqs, est_total = [], 0.0; mt = max_tokens(MODEL, WRITE_MAX_TOKENS); from ai_gateway import thinking_off
    for r in todo:
        if not r.get("write"): continue
        if limit and len(reqs) >= limit: break
        if f"w_{key(r['id'])}" in busy: continue   # schon in einem offenen Batch bezahlt
        e = ents[r["id"]]; f = facts_for(e, ents); prompt = write_prompt(f, r["write"])
        c = cost_cap(MODEL, nbytes(SYSTEM_WRITE, prompt), mt)
        if est_total + c > budget_room:
            print(f"Budget erreicht - Schreiben stoppt nach {len(reqs)} Auftraegen"); break
        est_total += c; state.setdefault("d1h", {})[r["id"]] = (D1.get(r["id"]) or {}).get("h", "")   # D1-Stand zum Zeitpunkt der Beauftragung (Hash-Schutz beim Push)
        reqs.append({"custom_id": f"w_{key(r['id'])}_{fhash(f)[:8]}", "params": {"model": MODEL, "max_tokens": mt, **thinking_off(MODEL),
                     "system": [{"type": "text", "text": SYSTEM_WRITE, "cache_control": {"type": "ephemeral"}}],
                     "messages": [{"role": "user", "content": prompt}]}})
    return reqs, est_total


def tr_tokens(payload, lang):
    """max_tokens einer Uebersetzung: grosszuegig ueber der erwarteten Laenge (LANG_FACTOR + 1 je Quell-Token), hoechstens TR_MAX_TOKENS."""
    return min(TR_MAX_TOKENS, int(tok(payload) * (LANG_FACTOR.get(lang, 1.5) + 1)) + 300)


def select_translations(todo, ents, gen, fill, budget_room, limit, busy=()):
    reqs, est_total = [], 0.0; from ai_gateway import thinking_off
    for r in todo:
        e = ents[r["id"]]; src = effective_en(e, gen, fill)
        if r.get("write") and not fill.get(e["id"]): continue   # en-Text fehlt noch
        for lang, fields in (r.get("translate") or {}).items():
            if limit and len(reqs) >= limit: return reqs, est_total
            cid = f"t_{lang}_{key(r['id'])}"
            if cid in busy: continue   # schon in einem offenen Batch bezahlt
            part = {k: src[k] for k in fields if k in src}
            if not part: continue
            payload = json.dumps(part, ensure_ascii=False); mt = max_tokens(TMODEL, tr_tokens(payload, lang))
            c = cost_cap(TMODEL, nbytes(system_translate(lang, []), payload), mt)
            if est_total + c > budget_room:
                print(f"Budget erreicht - Uebersetzen stoppt nach {len(reqs)} Auftraegen"); return reqs, est_total
            est_total += c
            reqs.append({"custom_id": f"{cid}_{hsh(part)[:6]}", "params": {"model": TMODEL, "max_tokens": mt, **thinking_off(TMODEL),
                         "system": [{"type": "text", "text": system_translate(lang, []), "cache_control": {"type": "ephemeral"}}],
                         "messages": [{"role": "user", "content": payload}]}})
    return reqs, est_total


def submit(reqs, est, kind, model, state):
    """Sendet die Auftraege als Batch(es). est = Obergrenze der Kosten; sie wird mit der Auftragsliste in state.json vorgemerkt (zaehlt gegen Budget und
    Monatsgrenze, bis der Batch eingesammelt ist), bevor irgendetwas anderes passiert."""
    from ai_gateway import check_budget
    if not reqs: print("Nichts abzusenden."); return 0
    # Haiku: Tagesbudget mit dem neuen Batch UND den noch nicht gemeldeten offenen Uebersetzungs-Batches pruefen
    if "haiku" in model.lower() and not check_budget("fill_entities", model, (est + pending_usd(state, "translate")) / max(0.000001, float(os.environ.get("USD_PER_EUR", "1.08")))):
        return 0
    for i in range(0, len(reqs), PER_BATCH):
        part = reqs[i:i + PER_BATCH]; share = est * len(part) / len(reqs)
        b = api("POST", "/v1/messages/batches", {"requests": part}, model=model)
        state.setdefault("batches", []).append({"id": b["id"], "kind": kind, "model": model, "n": len(part), "est_usd": round(share, 4), "month": month_key(),
                                                "ids": sorted(cid_key(r["custom_id"]) for r in part), "created": datetime.now(timezone.utc).isoformat()[:19]})
        jsave(OUT / "state.json", state); print("Batch", b["id"], kind, len(part), "Anfragen, hoechstens", round(share, 2), "USD")
    return len(reqs)


def bump(state, k):
    state.setdefault("tries", {})[k] = state.get("tries", {}).get(k, 0) + 1


def collect(ents, gen, state, edited, spons=None):
    from ai_gateway import report_usage, usage_tokens
    spons = sponsored_ids() if spons is None else spons
    fill = jload(OUT / "en.json", {}); i18n = {l: jload(OUT / "i18n" / f"{l}.json", {}) for l in LANGS}
    by_key = {key(i): i for i in ents}; left = []; touched_l = set(); en_dirty = False
    for b in state.get("batches", []):
        st = api("GET", f"/v1/messages/batches/{b['id']}", model=b["model"])
        if st["processing_status"] != "ended": print(b["id"], st["processing_status"], st["request_counts"]); left.append(b); continue
        tin = tout = cread = cwrite = ok = bad = 0; why = {}
        for line in api("GET", st["results_url"], raw=True, model=b["model"]).decode().splitlines():
            r = json.loads(line); parts = r["custom_id"].split("_"); res = r["result"]
            kind = parts[0]; eid = by_key.get(parts[-2] if kind == "w" else parts[2]); h8 = parts[-1]
            if res["type"] != "succeeded":
                bad += 1; why[res["type"]] = why.get(res["type"], 0) + 1
                if eid: bump(state, ("w:" + eid) if kind == "w" else f"t:{parts[1]}:{eid}")
                continue
            msg = res["message"]; a, c, rd, wr = usage_tokens(msg["usage"]); tin += a; tout += c; cread += rd; cwrite += wr
            if not eid or eid in edited or ents[eid].get("edited") or is_sponsored(eid, spons): continue
            text = "".join(x.get("text", "") for x in msg["content"] if x.get("type") == "text")
            out = parse_json(text); e = ents[eid]
            if kind == "w":
                f = facts_for(e, ents)
                if h8 not in (fhash(f)[:8], hsh(f)[:8]):   # Fakten (ausser der Folgenliste) inzwischen geaendert: Text passt nicht mehr, zaehlt als Versuch
                    why["stale"] = why.get("stale", 0) + 1; bump(state, "w:" + eid); continue
                _, want = status(e, gen, fill, edited, spons)
                want = want or ("full" if not (e.get("long") or {}).get("en") and eid not in gen else "desc")
                rec, err = validate_write(out, f, want)
                if err: bad += 1; why[err] = why.get(err, 0) + 1; bump(state, "w:" + eid); continue
                if eid in fill and fill[eid].get("long"): continue   # nie ueberschreiben
                rec.update({"h": hsh(f), "d1h": state.get("d1h", {}).get(eid) or "", "m": b["model"], "ts": datetime.now(timezone.utc).strftime("%Y-%m-%d")}); fill[eid] = rec; en_dirty = True; ok += 1
            else:
                # bezahlte Ergebnisse annehmen, auch fuer veraltete Felder (ein Lauf mit --stale hat sie neu gekauft); vorhandene aktuelle Felder bleiben
                lang = parts[1]; src = effective_en(e, gen, fill); need = translate_need(e, lang, src, gen, i18n, restale=True)
                part = {k: src[k] for k in need if not isinstance(out, dict) or k in out}   # nur die Felder, die die Antwort hat (die Auftragsliste kann kleiner gewesen sein)
                if not part: continue
                rec, err = validate_translation(lang, part, out, [n for n in KEEP + [e["name"]] + list(e.get("aliases") or [])])
                if err: bad += 1; why[err] = why.get(err, 0) + 1; bump(state, f"t:{lang}:{eid}"); continue
                same = hsh(part)[:6] == h8   # sonst ist die Quelle seit dem Absenden geaendert: Text speichern, aber als veraltet markieren (nicht gezeigt, stale.json)
                cur = i18n[lang].setdefault(eid, {"h": hsh(src), "m": b["model"], "ts": datetime.now(timezone.utc).strftime("%Y-%m-%d")}); sh = cur.setdefault("sh", {})
                for k, v in rec.items():
                    if cur.get(k) and not (k in sh and sh[k] != FD.src_hash(src[k])): continue   # aktuelle Fassung bleibt (translate-once)
                    cur[k] = v; sh[k] = FD.src_hash(part[k]) if same else "0" * 8
                cur.update({"m": b["model"], "ts": datetime.now(timezone.utc).strftime("%Y-%m-%d")})
                touched_l.add(lang); ok += 1
        c = add_spend("write" if b["kind"] == "write" else "translate", b["model"], tin, tout, b.get("month"))
        report_usage("fill_entities", b["model"], tin, tout, lang="batch", batch=True, cache_read=cread, cache_write=cwrite)   # Haiku: Kostenbuch des Workers (ai_spend)
        print(f"{b['id']}: {ok} ok, {bad} abgelehnt {why}, Kosten {c:.3f} USD")
    if en_dirty: jsave(OUT / "en.json", fill)
    for l in touched_l: jsave(OUT / "i18n" / f"{l}.json", i18n[l])
    state["batches"] = left; jsave(OUT / "state.json", state)
    return len(left)


def wait_batches(state):
    t0 = time.time()
    while state.get("batches") and time.time() - t0 < WAIT_MIN * 60:
        time.sleep(120)
        if all(api("GET", f"/v1/messages/batches/{b['id']}", model=b["model"])["processing_status"] == "ended" for b in state["batches"]): return


# ---------- Bestandsaufnahme ----------
def inventory(ents, gen, fill, i18n, edited, spons, state):
    todo, skipped = build_todo(ents, gen, fill, i18n, edited, spons, state)
    quotes = {}
    for q in jload(D / "quotes.json", []): quotes[q["person"]] = quotes.get(q["person"], 0) + 1
    sp_ = jload(D / "speakers.json", {}).get("speakers")
    sessions = {}
    for x in (sp_ if isinstance(sp_, list) else []):
        sessions[x.get("eid") or x.get("id") or ""] = len(x.get("sessions") or [])
    types = {}
    for e in ents.values():
        t = types.setdefault(e["type"], dict(n=0, desc_en_missing=0, desc_en_short=0, desc_de_missing=0, long_missing=0, gentext_only=0, person_thin_noindex=0))
        d = e.get("desc") or {}; en = d.get("en") or ""; t["n"] += 1
        if not en: t["desc_en_missing"] += 1
        elif len(en) < FD.SHORT_DESC: t["desc_en_short"] += 1
        if not d.get("de") or d.get("de") == en: t["desc_de_missing"] += 1
        has_long = bool((e.get("long") or {}).get("en"))
        if not has_long and e["id"] in gen: t["gentext_only"] += 1
        if not has_long and e["id"] not in gen: t["long_missing"] += 1
        if e["type"] == "person" and e["id"] != "mirko-peters":
            real = (len(en) > 80 and not e.get("speaker")) or has_long
            if not real and not quotes.get(e["id"]) and len(episodes_for(e, 2)) + sessions.get(e["id"], 0) < 2: t["person_thin_noindex"] += 1
    lang_missing = {l: sum(1 for r in todo if l in (r.get("translate") or {}) or r.get("write")) for l in LANGS}
    by_type_write = {}
    for r in todo:
        if r.get("write"): by_type_write[r["type"]] = by_type_write.get(r["type"], 0) + 1
    return todo, skipped, types, lang_missing, by_type_write


def report(ents, todo, skipped, types, lang_missing, by_type_write, est):
    n = len(ents)
    L = ["# Entitaeten fuellen - Bestandsaufnahme (9.11.2026, ohne API)", "",
         f"{n} Repo-Entitaeten (data/entities.json, guest_entities.json, speaker_entities.json). Seiten je Entitaet: 15 Sprachen = {n * 15} Seiten.", "",
         "## Noindex- und Duenn-Regeln (site_entities.py)",
         "- Sprachen ausser en/de: Entitaetsseite immer noindex (`lang not in (en, de)`), bis Uebersetzungen angezeigt werden - betrifft 13 Sprachen x " + f"{n} = {13 * n} Seiten (Absicht, bis Text da ist).",
         "- de: noindex, wenn kein echter deutscher Text (`desc.de` fehlt/gleich en, kein `long.de`, kein GENTEXT.de).",
         "- Personen (ausser Autor): noindex, wenn `desc.en` <= 80 Zeichen oder Speaker-Schablone, kein `long.en`, keine Zitate und < 2 Auftritte (`_thin`; gilt fuer en und de).",
         "- Ohne Index (Absicht, nicht angefasst): Tag-/Suche-/Rechts-/Community-Seiten, Profile ausser en, Gaeste-Verzeichnis ausser en/de.",
         "- Verzeichnis-Seiten (site_directory.py `_indexable`): Land/Stadt/Thema brauchen >= 3 bzw. 5 Eintraege und >= 150 Woerter eigenen Text; data/directory_intros.json hat 1 Seite (country:de, nicht freigegeben, 4 Eintraege), members_export.json 3 Personen + 3 Firmen -> alle Detailseiten noindex. Nicht Teil dieser Pipeline (eigene Mitglieder-Daten).",
         "- Profile (site_members.py): ausser en immer noindex (Absicht).", "",
         "## Zahlen je Typ (en)", "", "| Typ | Anzahl | desc.en fehlt | desc.en <80 | desc.de fehlt | long fehlt | nur KI-Ueberblick (GENTEXT) | Person duenn/noindex |", "|---|---|---|---|---|---|---|---|"]
    for t, v in sorted(types.items(), key=lambda kv: -kv[1]["n"]):
        L.append(f"| {t} | {v['n']} | {v['desc_en_missing']} | {v['desc_en_short']} | {v['desc_de_missing']} | {v['long_missing']} | {v['gentext_only']} | {v['person_thin_noindex']} |")
    L += ["", "## Auswahl der Pipeline", "", "Schreiben (en, Sonnet): " + ", ".join(f"{t} {c}" for t, c in by_type_write.items()) + f" = {sum(by_type_write.values())}",
          "Uebersprungen: " + ", ".join(f"{k} {len(v)}" for k, v in skipped.items()), "",
          "## Fehlende Sprachtexte (Entitaeten mit offenem Text je Sprache)", "", "| Sprache | offen |", "|---|---|"] + [f"| {l} | {c} |" for l, c in lang_missing.items()]
    L += ["", f"Kostenschaetzung Rest (Batch): {est['total_usd']} USD (Schreiben {est['write_usd']}, Uebersetzen {est['tr_usd']}); Details `python fill_entities.py plan`.",
          "Maschinenliste: data/entity_fill/todo.json"]
    return "\n".join(L) + "\n"


def next_writes(todo, ents, state, limit):
    """Schreibauftraege dieses Laufs: nie, was in einem offenen Batch liegt; Obergrenze im kumulativen Budget UND in der Monatsgrenze."""
    busy, blind = busy_keys(state)
    if "write" in blind: print("::warning::Offener Schreib-Batch ohne Auftragsliste (aelterer Lauf) - erst einsammeln, nichts Neues gesendet"); return [], 0.0
    return select_writes(todo, ents, min(room(BUDGET, state), month_room(state)), limit, state, busy=busy)


def next_translations(todo, ents, gen, fill, state, limit):
    """Uebersetzungsauftraege dieses Laufs: nie, was in einem offenen Batch liegt; Obergrenze im Budget, je Lauf und im Haiku-Tagesbudget."""
    busy, blind = busy_keys(state)
    if "translate" in blind: print("::warning::Offener Uebersetzungs-Batch ohne Auftragsliste (aelterer Lauf) - erst einsammeln, nichts Neues gesendet"); return [], 0.0
    return select_translations(todo, ents, gen, fill, min(room(BUDGET, state), haiku_room_usd(state)), limit, busy)


def main():
    args = sys.argv[1:]; mode = args[0] if args else "plan"
    opt = lambda n, d=None: args[args.index(n) + 1] if n in args else d
    global MODEL, BUDGET
    if opt("--model"): MODEL = opt("--model")
    if opt("--budget"): BUDGET = float(opt("--budget"))
    check_models(MODEL, TMODEL)
    limit = int(opt("--limit") or 0); no_tr = "--no-translate" in args; restale = "--stale" in args
    strict = mode in ("run", "collect", "push")
    ents, gen = load_entities(), load_gentext(); fill = jload(OUT / "en.json", {}); i18n = {l: jload(OUT / "i18n" / f"{l}.json", {}) for l in LANGS}
    state = jload(OUT / "state.json", {"batches": [], "tries": {}}); spons = sponsored_ids()
    edited = edited_ids(strict)
    if mode in ("run", "plan", "inventory"):   # schon vorhandene Auto-Uebersetzungen (ent_tr) nicht noch einmal kaufen; gespeichert nur in run
        for l in adopt_ent_tr(ents, gen, fill, i18n, fetch_tr(), edited, spons):
            if mode == "run": jsave(OUT / "i18n" / f"{l}.json", i18n[l])
    todo, skipped = build_todo(ents, gen, fill, i18n, edited, spons, state, restale=restale)
    est = estimate(todo, ents, gen, fill, i18n)
    if mode == "inventory":
        todo, skipped, types, lm, bw = inventory(ents, gen, fill, i18n, edited, spons, state)
        jsave(OUT / "todo.json", {"generated": datetime.now(timezone.utc).isoformat()[:10], "counts": {"entities": len(ents), "write": sum(1 for r in todo if r.get("write")), "entities_with_translation_need": sum(1 for r in todo if r.get("translate"))},
                                  "skipped": skipped, "estimate": est, "entities": todo}, indent=None)
        Path(ROOT / "reports").mkdir(exist_ok=True)
        (ROOT / "reports" / "entity_fill_inventory.md").write_text(report(ents, todo, skipped, types, lm, bw, est), encoding="utf-8")
        print("inventory ok"); return
    sp = spend_entities()
    print(f"Entitaeten {len(ents)} | schreiben {est['write_n']} | Sonnet-Batch ~{est['write_usd']} USD | Uebersetzungsauftraege {est['tr_n']} | Haiku-Batch ~{est['tr_usd']} USD | Rest gesamt ~{est['total_usd']} USD")
    print(f"Budget {BUDGET:.2f} USD, bisher {sp.get('usd', 0):.2f}, offene Batches hoechstens {pending_usd(state):.2f}, frei {room(BUDGET, state):.2f}; "
          f"Schreiben im Monat {month_key()} frei {month_room(state):.2f} von {MONTH_CAP:.2f} USD; uebersprungen: " + ", ".join(f"{k} {len(v)}" for k, v in skipped.items()))
    st = stale_report(ents, gen, fill, i18n)
    if st: print(f"Veraltete Uebersetzungen (englische Quelle geaendert, nicht gezeigt): {sum(len(v) for v in st.values())} -> data/entity_fill/stale.json; neu nur mit --stale")
    if mode == "plan": return
    if mode == "push":
        push(ents, state, edited, jload(OUT / "en.json", {}), {l: jload(OUT / "i18n" / f"{l}.json", {}) for l in LANGS}, spons=spons); return
    if not os.environ.get("ANTHROPIC_API_KEY"): raise SystemExit("ANTHROPIC_API_KEY fehlt")
    collect(ents, gen, state, edited, spons)
    if mode != "collect":
        fill = jload(OUT / "en.json", {}); i18n = {l: jload(OUT / "i18n" / f"{l}.json", {}) for l in LANGS}
        todo, skipped = build_todo(ents, gen, fill, i18n, edited, spons, state, restale=restale)
        reqs, c = next_writes(todo, ents, state, limit)
        if submit(reqs, c, "write", MODEL, state):
            wait_batches(state); collect(ents, gen, state, edited, spons)
        if not no_tr:
            fill = jload(OUT / "en.json", {}); i18n = {l: jload(OUT / "i18n" / f"{l}.json", {}) for l in LANGS}
            todo, skipped = build_todo(ents, gen, fill, i18n, edited, spons, state, restale=restale)
            reqs, c = next_translations(todo, ents, gen, fill, state, limit)
            if submit(reqs, c, "translate", TMODEL, state):
                wait_batches(state); collect(ents, gen, state, edited, spons)
    stale_report(ents, gen, jload(OUT / "en.json", {}), {l: jload(OUT / "i18n" / f"{l}.json", {}) for l in LANGS})


if __name__ == "__main__":
    main()
