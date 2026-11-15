#!/usr/bin/env python3
"""Schreibt duenne englische Show Notes neu (SEO-freundlich, Claude Sonnet, Message Batches API = halber Preis), einmal fuer den Bestand und danach woechentlich
nur fuer neue oder geaenderte Folgen. Ergebnis: data/shownotes_en/<bucket>.json.gz (site_shownotes_seo.py), Kosten in data/spend.json unter "shownotes".
Regel (Mirko, 9.11.2026, site_shownotes_seo.rule): gesendet und bezahlt wird nur, was die Folgenseite auch aendert - Folgen, deren bisherige Show Notes duenn sind
(unter 1.500 reine Textzeichen), die nicht im Show-Notes-Editor bearbeitet sind und keine QA-gepruefte Vollfassung haben. Der Lauf nennt je Regel die Zahl der Folgen.
Eingabe je Folge: Titel, bisherige Notes, Transkript-Auszug (ca. 5.000 Token: Anfang/Mitte/Ende), passende Entitaeten; Ausgabe: JSON.
Aufruf: python rewrite_shownotes.py [--limit N] [--collect-only] [--no-wait]. Umgebung: ANTHROPIC_API_KEY, SHOWNOTES_MODEL, SHOWNOTES_BUDGET_USD (Standard 30),
SHOWNOTES_LIMIT, SHOWNOTES_WAIT_S (Standard 18000). Inhaltliche Fehlversuche (ungueltige Antwort) werden in data/shownotes_en/_tries.json gezaehlt (3 je Eingabe-Hash);
Ausfaelle der API (errored/expired/canceled, HTTP-Fehler) zaehlen nicht, der Grund steht im Protokoll, und faellt mehr als die Haelfte so aus, endet der Lauf mit Fehler.
Budget: die Monatsgrenze gilt fuer die OBERGRENZE der Kosten (Eingabe hoechstens ein Token je Byte, Ausgabe = max_tokens), die schon beim Absenden vorgemerkt wird."""
import argparse, hashlib, json, os, re, sys, time, time as _t, urllib.error
from pathlib import Path

import site_podpage as P
import site_shownotes_seo as S
from ai_gateway import anthropic_request, thinking_off, urlopen
from generate_articles import cost_usd

ROOT = Path(__file__).resolve().parent
MODEL = os.environ.get("SHOWNOTES_MODEL") or "claude-sonnet-5-5"
HARD_CAP_USD = 30.0          # Mirko, 9.11.2026: feste Monatsgrenze fuer Sonnet; Umgebung und Workflow-Eingabe koennen sie nur senken
BUDGET_USD = min(HARD_CAP_USD, float(os.environ.get("SHOWNOTES_BUDGET_USD") or HARD_CAP_USD))
VERSION = 1                  # bei Aenderung des Prompts erhoehen: dann werden alle Folgen neu geschrieben
MAX_TRIES = 3
TR_TOKENS = 5000             # Obergrenze des Transkript-Auszugs
CHARS_PER_TOKEN = 4
NOTES_CHARS = 6000
MIN_NOTES = 400              # ohne Transkript braucht es mindestens so viele Zeichen bisheriger Notes (sonst waere der Titel die einzige Eingabe)
OUT_TOKENS = 1500            # max_tokens je Anfrage, solange das Modell ohne Denken antwortet (thinking_off)
THINK_TOKENS = 4500          # Zuschlag auf max_tokens fuer Modelle, bei denen sich das Denken nicht abschalten laesst (zaehlt zur Ausgabe)
MAX_ENTS = 15
KEEP = ["Microsoft 365", "Microsoft Copilot", "Copilot Studio", "Power BI", "Power Apps", "Power Automate", "Power Platform", "Power Pages", "SharePoint", "OneDrive", "Microsoft Teams",
        "Microsoft Fabric", "Entra ID", "Microsoft Entra", "Microsoft Intune", "Microsoft Defender", "Microsoft Purview", "Dataverse", "Azure", "Exchange Online", "GitHub Copilot",
        "Azure OpenAI", "Windows 365", "Azure Virtual Desktop", "Viva Engage", "OneNote", "Outlook", "Excel", "PowerShell", "Dynamics 365", "Nerdio", "SAP"]   # Produktnamen, die nie veraendert werden

SYSTEM = """You write SEO-friendly show notes for one episode of the M365.FM podcast about Microsoft 365, Azure and related technology. Rewrite from the inputs you are given.
House rules:
- Plain, factual English. No hype, no marketing words, no exclamation marks.
- Use only what the inputs support. Never invent facts, numbers, quotes, names, dates or promises. If a passage looks garbled (speech recognition error), stay neutral or leave it out.
- Product names are never altered or abbreviated differently: write Microsoft 365, Copilot, Power BI, SharePoint, Entra ID etc. exactly as given in the inputs.
- No URLs, no domain names, no HTML or Markdown. Plain text only; links are added later by code.
- Do not refer to "the transcript", "the podcast", "the host" or "the episode"; write as a standalone summary of the topic. No mention of AI.
Output ONLY one JSON object, no code fence, with these fields:
{"meta": "one sentence, at most 160 characters, search-result description with the main keyword near the start",
 "summary": "2-3 sentences (200-600 characters) intro for readers: the problem, who it helps, what they learn",
 "key_points": ["4 to 7 concrete takeaways, each one sentence, max 220 characters"],
 "chapters": [{"t": "mm:ss exactly as shown in a [mm:ss] marker of the excerpt", "title": "max 80 characters"}],
 "entities": ["ids from the given entity list that are actually discussed, not just mentioned in passing"],
 "faq": [{"q": "question a searcher would ask, max 140 characters", "a": "answer grounded in the excerpt, 1-3 sentences, max 450 characters"}]}
"chapters": only if the excerpt contains [mm:ss] markers (3 to 8 chapters in ascending order); otherwise use an empty list. "faq": 2 or 3 items."""

URL_RX = re.compile(r"https?://|\bwww\.|\b[a-z0-9-]+\.(?:com|org|net|io|fm|ai|dev|de|co|ly|gl)\b|<[a-z/][^>]*>", re.I)
# Produktnamen mit Punkt sind keine Domains (genau diese Schreibweise): .NET-Familie (ASP.NET, ML.NET, VB.NET ...), der Name der Show, verbreitete Bibliotheken.
DOTTED = re.compile(r"(?<![\w.-])(?:[A-Z][A-Za-z0-9#+]{0,5})?\.NET\b|(?<![\w.-])M365\.FM\b|(?<![\w.-])(?:Node|Next|Express|Nest|Nuxt|Vue|React|Angular|Three|D3)\.js\b|(?<![\w.-])Socket\.IO\b|(?<![\w.-])xUnit\.net\b")
BRANDS = {"Microsoft", "Azure", "Power", "Copilot", "Dynamics", "Windows", "Office", "Viva", "GitHub", "Visual", "Entra", "Defender", "Purview", "Intune", "Fabric"}
STRICT_TYPES = ("product", "platform")   # nur bei diesen Entitaetsarten ist die Schreibweise fest; Begriffe (concept: Conditional Access, Generative AI ...) duerfen klein stehen
TS_LINE = re.compile(r"^\s*\[?(\d{1,2}:\d{2}(?::\d{2})?)\]?\s+\S", re.M)


# ------------------------------------------------------------------ Eingaben
def _mmss(sec):
    sec = int(sec); h, r = divmod(sec, 3600); m, s = divmod(r, 60)
    return f"{h}:{m:02d}:{s:02d}" if h else f"{m:02d}:{s:02d}"


def timed_text(raw):
    """Transkript mit Zeitmarken -> Text mit [mm:ss]-Zeilen (rund alle 45 s); ohne Zeitmarken None (dann keine Kapitel)."""
    if not raw:
        return None
    if "-->" in raw:   # VTT
        out, last = [], -999
        for blk in re.split(r"\n\s*\n", raw):
            m = re.search(r"(?:(\d+):)?(\d{1,2}):(\d{2})[.,]\d{1,3}\s*-->", blk)
            if not m:
                continue
            t = int(m.group(1) or 0) * 3600 + int(m.group(2)) * 60 + int(m.group(3))
            txt = " ".join(l.strip() for l in blk.splitlines() if "-->" not in l and l.strip() and not l.strip().isdigit() and l.strip() != "WEBVTT")
            if not txt:
                continue
            if t - last >= 45 or not out:
                out.append(f"[{_mmss(t)}] {txt}"); last = t
            else:
                out[-1] += " " + txt
        return "\n".join(out) if len(out) >= 3 else None
    return raw if len(TS_LINE.findall(raw)) >= 5 else None


def excerpt(text, cap_tokens=TR_TOKENS):
    """Hoechstens cap_tokens (ca. 4 Zeichen je Token): ist das Transkript laenger, je ein Drittel aus Anfang, Mitte und Ende."""
    text = (text or "").strip()
    cap = cap_tokens * CHARS_PER_TOKEN
    if len(text) <= cap:
        return text
    n = cap // 3; mid = len(text) // 2
    return text[:n].rstrip() + "\n[...]\n" + text[mid - n // 2: mid + n // 2].strip() + "\n[...]\n" + text[-n:].lstrip()


_ENT_IX = {}


def _entity_index(ents):
    key = id(ents)
    if key not in _ENT_IX:
        ix = {}
        for e in ents:
            if e.get("type") == "category" or not e.get("name"):
                continue
            for nm in [e["name"]] + list(e.get("aliases") or []):
                if len(nm) >= 3 and len(nm.split()) <= 4:
                    ix.setdefault(nm.lower(), []).append((nm, e))
        _ENT_IX[key] = ix
    return _ENT_IX[key]


def candidates(title, notes, transcript, ents, extracted=()):
    """Passende Entitaeten (id, name, type) fuer die Folge: zuerst die QA-gepruefte Extraktion (shownotes/entities), dann Namenstreffer (Titel zaehlt 5x, Transkript je Treffer 1x,
    Einzelwoerter nur in genau dieser Schreibweise). Mindestens 2 Treffer oder Titel; hoechstens MAX_ENTS."""
    ix = _entity_index(ents); score = {}; byid = {}
    for src, w in ((title, 5), (notes, 1), (transcript, 1)):
        toks = re.findall(r"[A-Za-z0-9][A-Za-z0-9+#'-]*", src or "")
        for i in range(len(toks)):
            for n in (1, 2, 3, 4):
                if i + n > len(toks):
                    break
                ph = " ".join(toks[i:i + n])
                for nm, e in ix.get(ph.lower(), ()):
                    if n == 1 and ph != nm:
                        continue
                    score[e["id"]] = score.get(e["id"], 0) + w; byid[e["id"]] = e
    res = [(sc, i) for i, sc in score.items() if sc >= 2]
    res.sort(key=lambda x: (-x[0], x[1]))
    out = [dict(x) for x in extracted]
    seen = {x["id"] for x in out}
    for _, i in res:
        if i not in seen and len(out) < MAX_ENTS:
            out.append({"id": i, "name": byid[i]["name"], "type": byid[i].get("type") or ""}); seen.add(i)
    return out[:MAX_ENTS]


def _source(ep):
    """-> (titel, bisherige Notes gekuerzt, Transkript-Auszug, mit Zeitmarken?) - die Teile der Eingabe, die vom Inhalt der Folge abhaengen."""
    tt = timed_text(ep.get("transcript_raw") or "")
    return ep["title"], (ep.get("notes") or "")[:NOTES_CHARS], excerpt(tt if tt else ep.get("transcript") or ""), bool(tt)


def build_input(ep):
    """ep: {slug, title, notes, transcript, entities} -> (user_text, timed_flag). Das Transkript wird auf TR_TOKENS gekuerzt."""
    title, notes, tx, timed = _source(ep)
    parts = [f"Title: {title}", "Existing show notes (may be thin or promotional):\n" + notes,
             "Entity list (id: name):\n" + "\n".join(f"{x['id']}: {x['name']}" for x in ep.get("entities") or []) if ep.get("entities") else "Entity list: (none)",
             ("Transcript excerpt (with [mm:ss] markers):\n" if timed else "Transcript excerpt (no timestamps, so no chapters):\n") + tx]
    return "\n\n".join(parts), timed


def source_hash(ep):
    """Hash der Eingabe, an dem "geaendert" haengt: Prompt-Version, Systemtext, Titel, bisherige Notes, Transkript-Auszug. Die Entitaetsliste gehoert NICHT dazu:
    data/entities.json aendert sich mehrmals pro Woche, und keine Aenderung dort darf bezahlte Neufassungen (und veraltete Uebersetzungen) ausloesen."""
    title, notes, tx, _ = _source(ep)
    return hashlib.sha256(json.dumps([VERSION, SYSTEM, title, notes, tx], ensure_ascii=False).encode("utf-8")).hexdigest()[:16]


# ------------------------------------------------------------------ Pruefung
def _strings(n):
    yield n.get("meta", ""); yield n.get("summary", "")
    yield from n.get("key_points", [])
    for c in n.get("chapters", []): yield c["title"]
    for x in n.get("faq", []): yield x["q"]; yield x["a"]


def fit_meta(m):
    """Meta-Beschreibung knapp ueber 160 Zeichen (bis 200) an einer Wortgrenze kuerzen statt den bezahlten Text zu verwerfen (Testlauf 10.11.:
    11 von 39 Fehlversuchen hatten 161-164 Zeichen). Ohne Wortgrenze ab Zeichen 100 oder ueber 200 Zeichen bleibt es beim Fehler."""
    if len(m) <= 160 or len(m) > 200 or " " not in m[100:159]: return m
    cut = m[:159].rsplit(" ", 1)[0].rstrip(" ,;:-\u2013\u2014")
    return cut + "\u2026" if len(cut) >= 100 else m


def validate(obj, ep, timed=None):
    """-> (notes | None, fehler[]). Streng: ungueltiges JSON, URLs/HTML, Laengen, veraenderte Produktnamen. Unbekannte Entitaets-ids und Kapitel ohne Zeitmarken werden verworfen."""
    err = []
    if isinstance(obj, str):
        t = obj.strip()
        t = re.sub(r"^```[a-z]*\s*|\s*```$", "", t)
        try:
            obj = json.loads(t[t.index("{"): t.rindex("}") + 1])
        except Exception:
            return None, ["kein gueltiges JSON"]
    if not isinstance(obj, dict):
        return None, ["kein JSON-Objekt"]
    s = lambda k: obj.get(k).strip() if isinstance(obj.get(k), str) else ""
    n = {"meta": fit_meta(s("meta")), "summary": s("summary")}
    if not n["meta"] or len(n["meta"]) > 160: err.append(f"meta Laenge {len(n['meta'])}")
    if not (120 <= len(n["summary"]) <= 700): err.append(f"summary Laenge {len(n['summary'])}")
    kp = obj.get("key_points")
    kp = [x.strip() for x in kp if isinstance(x, str) and x.strip()] if isinstance(kp, list) else []
    if not 4 <= len(kp) <= 7 or any(len(x) > 260 for x in kp): err.append("key_points: 4-7 Punkte, je hoechstens 260 Zeichen")
    n["key_points"] = kp
    faq = obj.get("faq"); fl = []
    for x in faq if isinstance(faq, list) else []:
        if isinstance(x, dict) and isinstance(x.get("q"), str) and isinstance(x.get("a"), str) and x["q"].strip() and x["a"].strip():
            fl.append({"q": x["q"].strip(), "a": x["a"].strip()})
    if not 2 <= len(fl) <= 3 or any(len(x["q"]) > 160 or len(x["a"]) > 520 for x in fl): err.append("faq: 2-3 Fragen, Laengen")
    n["faq"] = fl
    ch = []
    markers = set(re.findall(r"\[(\d{1,2}:\d{2}(?::\d{2})?)\]", build_input(ep)[0])) if timed is None else timed
    if markers:   # Kapitel nur mit Zeitmarken im Auszug
        for c in obj.get("chapters") if isinstance(obj.get("chapters"), list) else []:
            if isinstance(c, dict) and isinstance(c.get("t"), str) and isinstance(c.get("title"), str) and c["t"] in markers and c["title"].strip():
                ch.append({"t": c["t"], "title": c["title"].strip()[:90]})
        secs = lambda t: sum(int(p) * 60 ** i for i, p in enumerate(reversed(t.split(":"))))
        ch = sorted({c["t"]: c for c in ch}.values(), key=lambda c: secs(c["t"]))
        if len(ch) < 3: ch = []
    if ch: n["chapters"] = ch[:8]
    ids = {x["id"] for x in ep.get("entities") or []}
    n["entities"] = [i for i in dict.fromkeys(obj.get("entities") if isinstance(obj.get("entities"), list) else []) if isinstance(i, str) and i in ids]
    text = "\n".join(_strings({**n, "chapters": n.get("chapters", [])}))
    if URL_RX.search(_undotted(text, ep)): err.append("URL, Domain oder HTML im Text")
    if re.search(r"\b(transcript|podcast|the host|this episode|as an ai)\b", text, re.I): err.append("Meta-Verweis")
    err += keep_errors(text, ep)
    return (None if err else n), err


def _undotted(text, ep):
    """Text ohne die Namen mit Punkt, die keine Domain sind: DOTTED, dazu Entitaetsnamen der Folge und Woerter des Titels in genau dieser Schreibweise
    (ASP.NET Core, Socket.IO; der Titel steht ohnehin auf der Seite). "asp.net" oder "m365.fm" klein geschrieben bleiben Domains."""
    names = {x["name"] for x in ep.get("entities") or [] if "." in x.get("name", "")} | set(re.findall(r"[\w#+-]+(?:\.[\w#+-]+)+", ep.get("title") or ""))
    for nm in sorted(names, key=len, reverse=True):
        text = re.sub(r"(?<![\w.-])" + re.escape(nm) + r"(?![\w-])", " ", text)
    return DOTTED.sub(" ", text)


def _proper(nm):
    """Eigenname (Produkt): jedes Wort beginnt gross oder der Name hat einen Binnenversal (SharePoint); allgemeine Begriffe wie "data gateway" nicht."""
    return bool(re.search(r"[a-z][A-Z]", nm)) or all(w[:1].isupper() or w[:1].isdigit() for w in nm.split())


def _branded(nm):
    """Schreibweise, die kein allgemeiner Begriff sein kann: Binnenversal (SharePoint, DevOps), Wort in Versalien oder mit Ziffer (Power BI, Windows 365) oder
    Markenwort vorn (Azure Functions). "Logic Apps", "Key Vault" oder "Virtual Machines" duerfen im Fliesstext klein stehen."""
    w = nm.split()
    return bool(re.search(r"[a-z][A-Z]", nm)) or any((len(x) > 1 and x.isupper()) or any(c.isdigit() for c in x) for x in w) or w[0] in BRANDS


def _keep_names(ep):
    """Namen mit fester Schreibweise: die Liste KEEP und Produkt-/Plattform-Entitaeten der Folge mit Markenschreibweise. Begriffe (concept) und Entitaeten ohne Art
    nicht: "conditional access", "data governance" oder "generative AI" im Fliesstext sind richtiges Englisch und kein Fehler."""
    names = set(KEEP)
    for x in ep.get("entities") or []:
        if x.get("type") in STRICT_TYPES and _proper(x["name"]) and _branded(x["name"]):
            names.add(x["name"])
    return [n for n in names if len(n) >= 3]


def _sentence_start(text, pos):
    before = text[:pos]
    return not before.strip() or before.endswith("\n") or before.rstrip()[-1] in ".!?:"


VERB_PARTICLE = re.compile(r"\s+(?:up|together)\b")   # "teams up", "teams together": das letzte Wort ist hier ein Verb, kein Teil des Namens


def _verb_use(text, m, nm):
    """Gewoehnliches Englisch statt Produktname: der Text hat die vorderen Woerter des Namens woertlich, das letzte klein geschrieben, und dahinter folgt
    eine Verbpartikel ("Microsoft teams up with partners" ist nicht "Microsoft Teams"). "Use Microsoft teams for meetings" bleibt ein Fehler."""
    head, _, last = nm.rpartition(" ")
    return bool(head) and m.group(0) == head + " " + last.lower() and last != last.lower() and bool(VERB_PARTICLE.match(text, m.end()))


def keep_errors(text, ep):
    """Produktnamen (_keep_names): kommt der Name des Titels im Text vor, muss er mindestens einmal woertlich stehen; abweichende Schreibweisen
    (Leerzeichen/Bindestrich, falsche Gross-/Kleinschreibung bei Namen mit Leerzeichen oder Binnenversal) sind Fehler. Kein Fehler: nur der erste Buchstabe
    weicht ab und der Name steht am Satzanfang (eDiscovery -> "EDiscovery helps ..."), oder das letzte Wort ist ein Verb vor einer Partikel (_verb_use)."""
    err = []; title = ep.get("title") or ""
    for nm in _keep_names(ep):
        multi = " " in nm or bool(re.search(r"[a-z][A-Z]", nm))
        if multi:
            for m in re.finditer(r"(?<![\w-])" + re.escape(nm) + r"(?![\w-])", text, re.I):
                if m.group(0) != nm and not (m.group(0) == nm[:1].upper() + nm[1:] and _sentence_start(text, m.start())) and not _verb_use(text, m, nm):
                    err.append(f"Name veraendert: {m.group(0)!r} statt {nm!r}"); break
            if " " in nm:
                for alt in (nm.replace(" ", ""), nm.replace(" ", "-")):
                    if re.search(r"(?<![\w-])" + re.escape(alt) + r"(?![\w-])", text, re.I):
                        err.append(f"Name veraendert: {alt!r} statt {nm!r}"); break
    for nm in _keep_names(ep):
        if re.search(r"(?<![\w-])" + re.escape(nm) + r"(?![\w-])", title) and nm not in text and len(nm) >= 4:
            if nm in ("Excel", "Outlook", "Azure", "SAP"):
                continue
            err.append(f"Name fehlt: {nm!r} (steht im Titel)")
    return err


# ------------------------------------------------------------------ Speicher, Auswahl, Kosten
def tries_path(d=None): return (d or S.DIR) / "_tries.json"


def load_tries(d=None):
    try: return json.loads(tries_path(d).read_text("utf-8"))
    except Exception: return {}


def pending(eps, store, tries):
    """Folgen, die geschrieben werden muessen: nur duenne (ep["rule"] == "thin", site_shownotes_seo.rule - alles andere aendert die Seite nicht und wird nicht bezahlt);
    kein Eintrag oder Quelle bzw. Prompt-Version geaendert; weniger als MAX_TRIES inhaltliche Fehlversuche fuer diesen Hash."""
    out = []
    for ep in eps:
        if ep.get("rule") != "thin":
            continue
        h = source_hash(ep); rec = store.get(ep["slug"])
        if rec and rec.get("h_src") == h and rec.get("v") == VERSION and rec.get("notes"):
            continue
        t = tries.get(ep["slug"]) or {}
        if t.get("h") == h and t.get("n", 0) >= MAX_TRIES:
            continue
        out.append((ep, h))
    return out


def overview(eps, store, tries):
    """Zahlen fuers Protokoll (keine stillen Grenzen): Folgen je Regel, davon unter den duennen schon geschrieben / nach MAX_TRIES gesperrt / offen."""
    c = {k: 0 for k in S.RULES}; done = locked = 0
    for ep in eps:
        c[ep.get("rule")] = c.get(ep.get("rule"), 0) + 1
        if ep.get("rule") != "thin":
            continue
        h = source_hash(ep); rec = store.get(ep["slug"]); t = tries.get(ep["slug"]) or {}
        if rec and rec.get("h_src") == h and rec.get("v") == VERSION and rec.get("notes"): done += 1
        elif t.get("h") == h and t.get("n", 0) >= MAX_TRIES: locked += 1
    return {**c, "done": done, "locked": locked, "open": c["thin"] - done - locked}


def max_tokens_for(model):
    return OUT_TOKENS if thinking_off(model) else OUT_TOKENS + THINK_TOKENS


def estimate_usd(ep):
    """OBERGRENZE der Kosten einer Anfrage, nicht der Erwartungswert: Eingabe hoechstens ein Token je UTF-8-Byte (ein Token ist nie kuerzer) plus Rahmen, der
    Systemtext zum Preis eines Cache-Eintrags, Ausgabe = max_tokens (mehr berechnet die API nicht). Die Monatsgrenze rechnet damit, deshalb kann ein Lauf sie
    auch dann nicht ueberschreiten, wenn jede Anfrage gelingt. Ueblich ist rund ein Viertel davon (ca. 4 Zeichen je Token, 600-900 Token Ausgabe)."""
    user, _ = build_input(ep); nsys = len(SYSTEM.encode("utf-8"))
    return cost_usd(nsys + len(user.encode("utf-8")) + 64, max_tokens_for(MODEL), 0, nsys, MODEL) * 0.5   # Batch: halber Preis


def month_key(): return _t.strftime("%Y-%m", _t.gmtime())


def spent_usd(sd, month=None):
    """Verbrauch des Monats: abgerechnete Kosten plus die Obergrenze noch nicht eingesammelter Batches (reserve)."""
    m = ((sd or {}).get("shownotes") or {}).get(month or month_key()) or {}
    return float(m.get("usd", 0)) + float(m.get("reserved", 0))


def select_within_budget(items, spent, budget, limit=0):
    """Nimmt Folgen der Reihe nach, bis die Obergrenze der Kosten (estimate_usd) die Monatsgrenze erreicht (oder limit). -> (auswahl, obergrenze der Auswahl in USD)"""
    out, total = [], spent
    for ep, h in items:
        c = estimate_usd(ep)
        if total + c > budget or (limit and len(out) >= limit):
            break
        out.append((ep, h)); total += c
    return out, total - spent


def _month(sd, month=None):
    return sd.setdefault("shownotes", {}).setdefault(month or month_key(), {"usd": 0, "input_tokens": 0, "output_tokens": 0, "calls": 0})


def reserve(sd, usd, month=None):
    """Merkt die Obergrenze eines abgesendeten Batches im Monat vor (usd > 0) bzw. loest sie beim Einsammeln wieder auf (usd < 0). So zaehlt ein Batch gegen die
    Monatsgrenze, auch wenn sein Ergebnis erst in einem spaeteren Lauf oder gar nicht eingesammelt wird."""
    m = _month(sd, month); m["reserved"] = round(max(0.0, float(m.get("reserved", 0)) + usd), 4)
    if not m["reserved"]: m.pop("reserved")
    return sd


def add_spend(sd, usd, tin, tout, calls, month=None):
    m = _month(sd, month)
    m["usd"] = round(m["usd"] + usd, 4); m["input_tokens"] += tin; m["output_tokens"] += tout; m["calls"] += calls
    m.setdefault("models", {})[MODEL] = m.get("models", {}).get(MODEL, 0) + calls
    return sd


# ------------------------------------------------------------------ Episoden einlesen
def load_episodes(root=ROOT, pages=None):
    """Alle veroeffentlichten Folgen mit ihrer Regel (site_shownotes_seo.rule). Nur fuer duenne Folgen ("thin") wird die Eingabe gebaut: bisherige Notes als
    reiner Text - genau die, die die Folgenseite zeigt (Spreaker-Show-Notes aus data/show_notes/en.json unter "episodes", sonst die Podpage-Sicherung) -,
    Transkript, Entitaeten. Alle anderen kommen nur mit slug, title und rule zurueck (fuers Protokoll)."""
    D = root / "data"
    eps = [e for e in P.load("episodes") if e.get("published") not in (False, "False") and e.get("hidden") not in (True, "True")]
    eps.sort(key=lambda e: e["create_time"], reverse=True)
    pg = pages or S.Pages(root)
    ents = [x for x in json.loads((D / "entities.json").read_text("utf-8"))]
    out = []
    for e in eps:
        nrec, r, sid, full = pg.facts(e); rule = S.rule(e, nrec, full)
        if rule != "thin":
            out.append({"slug": e["slug"], "title": e["name"], "rule": rule}); continue
        sid = str((r or {}).get("spreaker_id") or sid or "")
        raw = ""
        if sid and (root / "transcripts" / "podcast" / f"{sid}.vtt").exists():
            raw = (root / "transcripts" / "podcast" / f"{sid}.vtt").read_text("utf-8")
        elif r and r.get("transcript") and (D / "en_transcripts" / f"{r['transcript']}.txt").exists():
            raw = (D / "en_transcripts" / f"{r['transcript']}.txt").read_text("utf-8")
        notes = P.plain(S.old_notes(e, nrec))
        plain_tx = re.sub(r"\[?\d{1,2}:\d{2}(?::\d{2})?\]?\s*", "", raw) if timed_text(raw) else raw
        extracted = []
        xf = root / "shownotes" / "entities" / f"{sid}.json"
        if sid and xf.exists():
            try: extracted = [{"id": x["slug"], "name": x["name"], "type": x.get("type") or ""} for x in json.loads(xf.read_text("utf-8")).get("entities", []) if x.get("score", 0) >= 40][:MAX_ENTS]
            except Exception: extracted = []
        if not raw and len(notes) < MIN_NOTES:
            out.append({"slug": e["slug"], "title": e["name"], "rule": "empty"}); continue   # kein Transkript und (fast) keine Notes: nichts, woraus sich ohne Erfinden schreiben liesse; kommt das Transkript, ist die Folge wieder offen
        out.append({"slug": e["slug"], "title": e["name"], "rule": rule, "notes": notes, "transcript": plain_tx, "transcript_raw": raw,
                    "entities": candidates(e["name"], notes, plain_tx, ents, extracted)})
    return out


# ------------------------------------------------------------------ Batch
def api(method, path, body=None):
    req = anthropic_request(path, body, job="rewrite_shownotes", lang="batch", model=MODEL, api_key=os.environ["ANTHROPIC_API_KEY"])
    req.method = method
    try:
        return json.loads(urlopen(req, timeout=300).read())
    except urllib.error.HTTPError as e:   # Grund ins Protokoll (Antworttext der API, enthaelt keinen Schluessel); kein Fehlversuch fuer die Folgen
        try: detail = e.read().decode("utf-8", "replace")[:600]
        except Exception: detail = ""
        print(f"API-Fehler {e.code} {method} {path.split('?')[0][-60:]}: {detail}", flush=True); raise


def request_for(ep, cid):
    """Eine Anfrage des Batches. Denken ist abgeschaltet, wo das Modell es zulaesst (thinking_off), damit max_tokens und die Kostenobergrenze nur die Antwort
    tragen. Kein fallbacks-Feld: die Message Batches API lehnt es ab; eine Ablehnung (stop_reason refusal) wertet apply_results als inhaltlichen Fehlversuch."""
    user, _ = build_input(ep)
    return {"custom_id": cid, "params": {"model": MODEL, "max_tokens": max_tokens_for(MODEL), **thinking_off(MODEL),
            "system": [{"type": "text", "text": SYSTEM, "cache_control": {"type": "ephemeral"}}], "messages": [{"role": "user", "content": user}]}}


def text_of(msg):
    return "".join(c.get("text", "") for c in msg.get("content") or [] if c.get("type") == "text")


def _api_reason(res):
    """Grund eines Ausfalls auf Seiten der API: Ergebnisart, bei "errored" mit Fehlerart und Meldung der API."""
    e = res.get("error") or {}
    while isinstance(e.get("error"), dict): e = e["error"]
    return (res["type"] + (f": {e.get('type', '')} {e.get('message', '')}".rstrip() if e else ""))[:200]


def apply_results(lines, mapping, eps_by_slug, store, tries, now=None):
    """Wertet Batch-Ergebnisse (JSONL-Zeilen) aus: gueltige Notes -> store; inhaltliche Fehler (ungueltige Antwort, max_tokens, Ablehnung) -> tries.
    Ausfaelle der API (errored, expired, canceled) aendern tries NICHT - die Eingabe war nicht schuld, die Folge bleibt offen - und stehen mit Grund in api
    {grund: anzahl}. Ergebnisse fuer Folgen, die inzwischen nicht mehr duenn oder nicht mehr veroeffentlicht sind, werden verworfen (dropped), ebenfalls ohne
    Fehlversuch. -> (ok, failed, tin, tout, api, dropped)"""
    ok = bad = tin = tout = dropped = 0; api_fail = {}; now = now or _t.strftime("%Y-%m-%dT%H:%M:%SZ", _t.gmtime())
    for line in lines:
        r = json.loads(line); slug, h = mapping.get(r["custom_id"], (None, None))
        if not slug:
            continue
        res = r["result"]; why = None; notes = None
        if res["type"] != "succeeded":
            k = _api_reason(res); api_fail[k] = api_fail.get(k, 0) + 1; continue
        msg = res["message"]; u = msg.get("usage") or {}
        tin += u.get("input_tokens", 0) + u.get("cache_read_input_tokens", 0) + u.get("cache_creation_input_tokens", 0); tout += u.get("output_tokens", 0)
        ep = eps_by_slug.get(slug)
        if not ep or ep.get("rule") != "thin":
            dropped += 1; continue
        if msg.get("stop_reason") == "max_tokens": why = ["max_tokens"]
        elif msg.get("stop_reason") == "refusal": why = ["refusal " + str((msg.get("stop_details") or {}).get("category") or "")]
        else: notes, why = validate(text_of(msg), ep)
        if notes:
            store[slug] = {"h_src": h, "v": VERSION, "notes": notes, "model": MODEL, "ts": now}; tries.pop(slug, None); ok += 1
        else:
            t = tries.get(slug) or {}
            tries[slug] = {"h": h, "n": (t.get("n", 0) + 1) if t.get("h") == h else 1, "err": "; ".join(why)[:200]}; bad += 1
    return ok, bad, tin, tout, api_fail, dropped


def main(argv=None):
    ap = argparse.ArgumentParser(); ap.add_argument("--limit", type=int, default=int(os.environ.get("SHOWNOTES_LIMIT") or 0))
    ap.add_argument("--collect-only", action="store_true"); ap.add_argument("--no-wait", action="store_true"); a = ap.parse_args(argv)
    if not os.environ.get("ANTHROPIC_API_KEY"):
        print("Kein ANTHROPIC_API_KEY - uebersprungen"); return
    if not any(k in MODEL.lower() for k in ("sonnet", "haiku")):   # generate_articles.price_of kennt nur diese Preise; ohne Preis keine Budgetgrenze
        raise SystemExit(f"SHOWNOTES_MODEL={MODEL}: Preis unbekannt (nur Sonnet- und Haiku-Modelle) - kein Lauf ohne Budgetgrenze")
    sp = ROOT / "data" / "spend.json"
    sd = json.loads(sp.read_text("utf-8")) if sp.exists() else {}
    store = S.load_all(); tries = load_tries(); eps = load_episodes(); by = {e["slug"]: e for e in eps}
    state = S.DIR / "_batch.json"; S.DIR.mkdir(parents=True, exist_ok=True)
    wait = float(os.environ.get("SHOWNOTES_WAIT_S") or 18000)
    ov = overview(eps, store, tries)
    print(f"{len(eps)} veroeffentlichte Folgen; bisherige Show Notes: " + ", ".join(f"{ov.get(k, 0)} {v}" for k, v in S.RULES.items()) + (f", {ov['empty']} duenn, aber ohne Transkript und mit weniger als {MIN_NOTES} Zeichen Notes (zu wenig Eingabe)" if ov.get("empty") else ""))
    print(f"Von {ov['thin']} duennen Folgen: {ov['done']} schon neu geschrieben, {ov['locked']} nach {MAX_TRIES} inhaltlichen Fehlversuchen gesperrt (data/shownotes_en/_tries.json), {ov['open']} offen")
    if state.exists():   # Batch eines frueheren Laufs (Zeitlimit): zuerst einsammeln
        st = json.loads(state.read_text("utf-8"))
    else:
        if a.collect_only:
            print("Kein offener Batch"); return
        spent = spent_usd(sd)
        if spent >= BUDGET_USD:
            print(f"Monatsgrenze erreicht: {spent:.2f} von {BUDGET_USD:.2f} USD in {month_key()} - nichts geschrieben"); return
        todo = pending(eps, store, tries)
        sel, est = select_within_budget(todo, spent, BUDGET_USD, a.limit)
        print(f"{len(todo)} offen, {len(sel)} in diesem Lauf (Obergrenze {est:.2f} USD; {spent:.2f} von {BUDGET_USD:.2f} USD in {month_key()} verbraucht oder vorgemerkt)"
              + (f", {len(todo) - len(sel)} warten auf den naechsten Lauf (" + (f"--limit {a.limit}" if a.limit and len(sel) >= a.limit else "Monatsgrenze") + ")" if len(todo) > len(sel) else ""))
        if not sel:
            return
        mapping = {f"n{i:05d}": [ep["slug"], h] for i, (ep, h) in enumerate(sel)}
        b = api("POST", "/v1/messages/batches", {"requests": [request_for(ep, cid) for cid, (ep, _) in zip(mapping, sel)]})
        st = {"id": b["id"], "map": mapping, "est": round(est, 4), "month": month_key()}; state.write_text(json.dumps(st), "utf-8"); print("Batch", b["id"])
        reserve(sd, st["est"], st["month"]); sp.write_text(json.dumps(sd, indent=1), "utf-8")   # zaehlt ab jetzt gegen die Monatsgrenze, auch wenn das Einsammeln ausfaellt
    deadline = time.time() + wait
    while True:
        b = api("GET", f"/v1/messages/batches/{st['id']}"); print(b["processing_status"], b.get("request_counts"), flush=True)
        if b["processing_status"] == "ended": break
        if a.no_wait or time.time() > deadline:
            print("Batch laeuft noch; wird im naechsten Lauf eingesammelt"); return
        time.sleep(120)
    rq = anthropic_request(b["results_url"], headers={"x-api-key": os.environ["ANTHROPIC_API_KEY"]}, job="rewrite_shownotes", lang="batch", model=MODEL)
    lines = urlopen(rq, timeout=900).read().decode().splitlines()
    ok, bad, tin, tout, api_fail, dropped = apply_results(lines, st["map"], by, store, tries)
    S.save_all(store); tries_path().write_text(json.dumps(tries, sort_keys=True, indent=0), "utf-8")
    usd = cost_usd(tin, tout, 0, 0, MODEL) * 0.5
    reserve(sd, -float(st.get("est") or 0), st.get("month")); add_spend(sd, usd, tin, tout, ok + bad + dropped, st.get("month")); sp.write_text(json.dumps(sd, indent=1), "utf-8")
    state.unlink(missing_ok=True)
    nfail = sum(api_fail.values())
    print(f"fertig: {ok} ok, {bad} inhaltlich fehlgeschlagen (zaehlt als Versuch), {nfail} ohne Ergebnis der API (zaehlt nicht als Versuch)"
          + (f", {dropped} verworfen (Folge inzwischen nicht mehr duenn oder nicht mehr veroeffentlicht)" if dropped else "") + f", Tokens ein/aus {tin}/{tout}, Kosten {usd:.2f} USD (Batch-Preis)")
    for k, n in sorted(api_fail.items(), key=lambda kv: -kv[1])[:8]: print(f"  ohne Ergebnis {n} x {k}")
    for slug, _ in list(st["map"].values())[:400]:
        if slug in tries: print(f"  Fehlversuch {tries[slug].get('n')} von {MAX_TRIES}: {slug}: {tries[slug].get('err')}")
    if nfail * 2 > len(st["map"]):   # Ausfall auf Seiten der API (Guthaben, Parameter, Stoerung): sichtbar scheitern statt gruen durchlaufen; Daten und Kosten sind gespeichert
        raise SystemExit(f"{nfail} von {len(st['map'])} Anfragen ohne Ergebnis - Ursache siehe oben; die Folgen bleiben offen und laufen im naechsten Lauf erneut")


if __name__ == "__main__":
    main()
