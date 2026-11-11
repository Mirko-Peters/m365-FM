#!/usr/bin/env python3
"""Sponsor-Reihe Cognillo: 62 Blogbeitraege (Sonnet) als Content-Paket imports/blog/en/<slug>.md, dazu je 3 LinkedIn-Texte. Drei Modi:

  schreiben  (von Hand, workflow_dispatch): schreibt die Beitraege der Nummern von..bis nacheinander (Standard: alle noch nicht geschriebenen) als
             status: review, publish: false (liegen nur im Repo, der Seitenbau und der Worker uebernehmen sie NICHT), Plan-Status "entwurf", LinkedIn-Texte in
             data/sponsor_posts_linkedin_cognillo.json. Vorhandene Dateien werden uebersprungen (Wiederaufnahme nach Abbruch).
  freigeben  (von Hand): setzt im Plan freigegeben=true fuer die genannten Nummern (nur Status "entwurf"). Kein API-Aufruf.
  taeglich   (Cron): der frueheste Eintrag mit freigegeben=true, Status "entwurf" und date <= heute wird auf status: approved, publish: true gesetzt
             (Plan-Status "live"). Normal EIN Beitrag je Lauf; sind mehrere faellig (verpasster Lauf), hoechstens CATCHUP_MAX = 2, die aeltesten zuerst, und
             ein ::warning:: nennt den restlichen Rueckstand. So schrumpft ein Rueckstand um einen Beitrag pro Tag. Gesponserte Beitraege (sponsored=true) traegt
             der Lauf zugleich unter "posts" des Cognillo-Sponsorings in data/sponsorships.json ein: Kennzeichnung, BlogPosting.sponsor und rel="sponsored"
             bleiben dann dauerhaft, auch wenn der Beitrag nach dem Ende der Laufzeit live geht. Kein API-Aufruf.

Plan: data/sponsor_posts_cognillo.json = Liste von {nr, reihe, title, main, others, sponsored, status ("geplant" | "entwurf" | "live"), slug, date, freigegeben?}.
Je Beitrag: Entwurf (Sonnet, inkl. LinkedIn-Texte) -> zweiter Durchgang (Sonnet prueft auf unbelegte Aussagen/Regelverstoesse, nur beanstandete Stellen
werden ueberarbeitet) -> Linkfilter (nur learn.microsoft.com, techcommunity.microsoft.com, www.cognillo.com, www.m365.fm; Rest entfernt, uebrige per HTTP
geprueft) -> eigene Regelpruefung -> site_content_blog.check. Bei Fehlern genau EIN Wiederholungsversuch mit der Fehlermeldung im Prompt, sonst keine Datei
und keine Statusaenderung fuer diesen Beitrag.
Kosten: Kostenbuch data/spend.json unter "sponsor-cognillo" (kumulativ, getrennt von der Monatsgrenze des Artikel-Generators). Eigene harte Gesamtgrenze
SPONSOR_POSTS_BUDGET_USD (Standard 50): ist sie erreicht, gibt es keinen API-Aufruf mehr. Haiku-Tageslimits werden nicht beruehrt (nur Sonnet).
Umgebung: ANTHROPIC_API_KEY, SPONSOR_POSTS_BUDGET_USD, SPONSOR_POSTS_MODEL, SPONSOR_COMMIT_MSG_FILE (Commit-Nachricht), SPONSOR_WRITTEN_FILE (Anzahl neu
geschriebener Beitraege). Jeder Modus kennt --dry-run: nur Anzeige (bei "schreiben": Prompt und Kostenschaetzung), KEIN API-Aufruf, keine Aenderung."""
import argparse, json, os, re, sys, tempfile, time, urllib.error, urllib.parse, urllib.request
from datetime import date, datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

SERIES_KEY = "sponsor-cognillo"
PLAN_FILE = ROOT / "data" / "sponsor_posts_cognillo.json"
LINKEDIN_FILE = ROOT / "data" / "sponsor_posts_linkedin_cognillo.json"
ENTITIES_FILE = ROOT / "data" / "entities.json"
SPEND_FILE = ROOT / "data" / "spend.json"
SPONSORSHIPS_FILE = ROOT / "data" / "sponsorships.json"
SPONSOR_ENTITY = "cognillo"   # Sponsoring der Reihe: Eintrag in data/sponsorships.json mit dieser Entitaet unter "entities"
CATCHUP_MAX = 2   # taeglich: hoechstens so viele Beitraege je Lauf, wenn mehrere faellig sind (Rueckstand nach verpasstem Lauf)
BLOG_DIR = ROOT / "imports" / "blog"
OUT_DIR = BLOG_DIR / "en"
MODEL = os.environ.get("SPONSOR_POSTS_MODEL") or "claude-sonnet-5-5"
DEFAULT_BUDGET_USD = 50.0
ALLOWED_HOSTS = ("learn.microsoft.com", "techcommunity.microsoft.com", "www.cognillo.com", "www.m365.fm")
ANCHORS = ("cognillo", "sharepoint-essentials-toolkit")   # Entitaeten des Sponsors: Cognillo-Themen beziehen sich auf sie
PLAN_KEYS = ("nr", "reihe", "title", "main", "others", "sponsored", "status", "slug", "date")
SLUG_RE = re.compile(r"^[a-z0-9][a-z0-9-]{1,100}$")
ID_RE = re.compile(r"^[a-z0-9][a-z0-9-]*$")
DRAFT_MAX_TOKENS, REVIEW_MAX_TOKENS = 10000, 6000
TYPICAL_OUT = {"draft": 3700, "review": 800}   # Ausgabe-Token (Schaetzung): 1.400 Woerter Text + Kurzfassung + FAQ + 3 LinkedIn-Texte; die Pruefung liefert nur Aenderungen
FACT_CAP, ANCHOR_CAP = 2500, 4500   # Zeichen der Langbeschreibung je Entitaet im Prompt
LI_KEYS = ("profile", "page", "group")
LI_MAX = 1300   # Zeichen je LinkedIn-Text (mit Sponsor-Zeile)
SPONSOR_LI = "Sponsored by Cognillo · #Anzeige"
BATCH_DEFAULT = 10


class Stop(Exception):
    """Sauberer Abbruch; code = Exit-Code (0 = kein Fehler, nur Meldung)."""
    def __init__(self, msg, code=0):
        super().__init__(msg); self.code = code


class PostFailed(Stop):
    """Ein einzelner Beitrag besteht die Pruefung nicht: die Schleife von "schreiben" macht mit dem naechsten weiter (am Ende Exit 1)."""
    def __init__(self, msg):
        super().__init__(msg, 1)


# ------------------------------------------------------------------ Plan
def budget_usd():
    raw = os.environ.get("SPONSOR_POSTS_BUDGET_USD", "").strip()
    if not raw: return DEFAULT_BUDGET_USD
    try:
        v = float(raw)
    except ValueError:
        raise Stop(f"SPONSOR_POSTS_BUDGET_USD ist keine Zahl: {raw!r}", 1)
    if v < 0: raise Stop("SPONSOR_POSTS_BUDGET_USD darf nicht negativ sein", 1)
    return v


def load_plan(path=None):
    """-> Liste der Plan-Eintraege. Fehlt die Datei, bricht der Lauf sauber ab (Exit 0): der Plan kommt mit dem anderen Pull Request."""
    path = Path(path or PLAN_FILE)
    if not path.exists():
        raise Stop(f"Plan-Datei {path.name} fehlt - nichts zu tun (erst den Pull Request mit dem Plan und den Entitaeten mergen).", 0)
    try:
        plan = json.loads(path.read_text("utf-8"))
    except ValueError as ex:
        raise Stop(f"Plan-Datei {path.name} ist kein gueltiges JSON: {ex}", 1)
    errs = plan_errors(plan)
    if errs:
        raise Stop(f"Plan-Datei {path.name} ungueltig:\n - " + "\n - ".join(errs[:20]), 1)
    return plan


def _iso(d):
    try:
        return date.fromisoformat(d) if isinstance(d, str) and re.fullmatch(r"\d{4}-\d{2}-\d{2}", d) else None
    except ValueError:
        return None


def plan_errors(plan):
    if not isinstance(plan, list) or not plan:
        return ["oberste Ebene muss eine nicht leere Liste sein"]
    errs, nrs, slugs = [], set(), set()
    for i, e in enumerate(plan):
        w = f"Eintrag {i + 1}"
        if not isinstance(e, dict): errs.append(f"{w}: kein Objekt"); continue
        miss = [k for k in PLAN_KEYS if k not in e]
        if miss: errs.append(f"{w}: Felder fehlen: {', '.join(miss)}"); continue
        w = f"Eintrag nr {e['nr']}"
        if not isinstance(e["nr"], int) or isinstance(e["nr"], bool) or e["nr"] in nrs: errs.append(f"{w}: nr fehlt, ist keine Zahl oder doppelt")
        nrs.add(e["nr"])
        if not isinstance(e["title"], str) or not 10 <= len(e["title"].strip()) <= 140: errs.append(f"{w}: title muss 10-140 Zeichen haben")
        if not isinstance(e["main"], str) or not ID_RE.match(e["main"]): errs.append(f"{w}: main ist keine Entitaets-ID")
        if not isinstance(e["others"], list) or not all(isinstance(x, str) and ID_RE.match(x) for x in e["others"]): errs.append(f"{w}: others muss eine Liste von Entitaets-IDs sein")
        if not isinstance(e["sponsored"], bool): errs.append(f"{w}: sponsored muss true oder false sein")
        if not isinstance(e["status"], str) or not e["status"]: errs.append(f"{w}: status fehlt")
        if "freigegeben" in e and not isinstance(e["freigegeben"], bool): errs.append(f"{w}: freigegeben muss true oder false sein")
        if not isinstance(e["slug"], str) or not SLUG_RE.match(e["slug"]): errs.append(f"{w}: slug ungueltig")
        elif e["slug"] in slugs: errs.append(f"{w}: slug {e['slug']} doppelt")
        slugs.add(e["slug"])
        if not _iso(e["date"]): errs.append(f"{w}: date muss JJJJ-MM-TT sein")
    return errs


def package_path(slug, blog_dir=None):
    """Vorhandene Paketdatei zum Slug in irgendeiner Sprache (gleicher Slug in zwei Sprachen waere ein Fehler im Seitenbau) oder None."""
    d = Path(blog_dir or BLOG_DIR)
    return next(iter(sorted(d.glob(f"*/{slug}.md"))), None) if d.exists() else None


def package_exists(slug, blog_dir=None):
    return package_path(slug, blog_dir) is not None


def parse_nummern(text, valid=None):
    """"1-10,15" -> [1, 2, ..., 10, 15]; leer = None (alle). Fehler bei Unsinn oder Nummern ausserhalb des Plans."""
    text = (text or "").strip()
    if not text: return None
    out = set()
    for part in re.split(r"[,\s;]+", text):
        if not part: continue
        m = re.fullmatch(r"(\d+)(?:\s*-\s*(\d+))?", part)
        if not m: raise Stop(f"Nummern nicht lesbar: {part!r} (erlaubt z. B. \"1-62\" oder \"1-10,15\")", 1)
        a = int(m.group(1)); b = int(m.group(2) or a)
        if b < a or b - a > 1000: raise Stop(f"Bereich ungueltig: {part!r}", 1)
        out.update(range(a, b + 1))
    if valid is not None and out - set(valid): raise Stop("Nummern nicht im Plan: " + ", ".join(map(str, sorted(out - set(valid)))), 1)
    return sorted(out)


def select_write(plan, von=None, bis=None, blog_dir=None):
    """Beitraege fuer "schreiben": Nummern von..bis, Status "geplant", Datei noch nicht vorhanden, in Reihenfolge der Nummer.
    -> (zu schreiben, schon vorhanden). Vorhandene Dateien werden NIE ueberschrieben (Wiederaufnahme nach Abbruch)."""
    todo, have = [], []
    for e in sorted(plan, key=lambda e: e["nr"]):
        if e["status"] != "geplant" or (von is not None and e["nr"] < von) or (bis is not None and e["nr"] > bis): continue
        (have if package_exists(e["slug"], blog_dir) else todo).append(e)
    return todo, have


def due_released(plan, target, blog_dir=None):
    """Alle faelligen Beitraege fuer den taeglichen Lauf, aelteste (date, nr) zuerst: freigegeben=true, Status "entwurf", date <= Zieldatum, Datei vorhanden.
    -> (Liste, Liste der freigegebenen Eintraege ohne Datei). Nicht freigegebene Beitraege bleiben unberuehrt."""
    t = target if isinstance(target, date) else _iso(target)
    if not t: raise Stop(f"Zieldatum ungueltig: {target!r} (JJJJ-MM-TT)", 1)
    due, broken = [], []
    for e in sorted(plan, key=lambda e: (e["date"], e["nr"])):
        if e.get("freigegeben") is not True or e["status"] != "entwurf" or _iso(e["date"]) > t: continue
        (due if package_exists(e["slug"], blog_dir) else broken).append(e)
    return due, broken


def select_publish(plan, target, blog_dir=None):
    """Fruehester faelliger Beitrag (siehe due_released). -> (Eintrag oder None, Liste der Eintraege ohne Datei)."""
    due, broken = due_released(plan, target, blog_dir)
    return (due[0] if due else None), broken


def update_plan(changes, path=None):
    """changes: {nr: {feld: wert}}. Liest die Plan-Datei frisch ein, aendert nur diese Felder und behaelt die Einrueckung bei (kleines Diff)."""
    path = Path(path or PLAN_FILE)
    text = path.read_text("utf-8")
    plan = json.loads(text)
    by = {e.get("nr"): e for e in plan}
    for nr, fields in changes.items():
        if nr not in by: raise Stop(f"Plan: Eintrag nr {nr} nicht gefunden", 1)
        by[nr].update(fields)
    m = re.match(r"\s*\[\s*\n([ \t]+)", text)
    path.write_text(json.dumps(plan, ensure_ascii=False, indent=(m.group(1) if m else None)) + ("\n" if text.endswith("\n") else ""), "utf-8")


def set_status(nr, status, path=None):
    update_plan({nr: {"status": status}}, path)


def save_linkedin(nr, texts, path=None):
    """data/sponsor_posts_linkedin_cognillo.json: {"<nr>": {profile, page, group}}; liest frisch ein, sortiert nach Nummer."""
    path = Path(path or LINKEDIN_FILE)
    try:
        d = json.loads(path.read_text("utf-8")) if path.exists() else {}
    except ValueError:
        raise Stop(f"{path.name} ist kein gueltiges JSON - nichts ueberschrieben.", 1)
    d[str(nr)] = {k: texts.get(k, "") for k in LI_KEYS}
    path.write_text(json.dumps(dict(sorted(d.items(), key=lambda kv: int(kv[0]))), ensure_ascii=False, indent=1) + "\n", "utf-8")


def sponsor_record(recs, day):
    """Sponsoring der Reihe fuer einen Beitrag mit Plan-Datum day: Eintraege mit SPONSOR_ENTITY unter "entities"; bevorzugt der am Tag laufende, sonst der zuletzt
    begonnene (start <= day), sonst der zuletzt angelegte. -> Eintrag oder None."""
    cands = [r for r in recs if isinstance(r, dict) and SPONSOR_ENTITY in (r.get("entities") or []) and isinstance(r.get("start"), str)]
    act = [r for r in cands if r["start"] <= day and (r.get("end") is None or day <= str(r["end"]))]
    past = [r for r in cands if r["start"] <= day]
    return max(act or past or cands, key=lambda r: (r["start"], str(r.get("id")))) if cands else None


def post_handle(text):
    """Autor-Handle aus dem YAML-Kopf, gelesen wie im Seitenbau (site_shownotes.parse_file, dann wie site_content_blog: Standard mirko-p, ohne Leerraum, klein).
    So nennt der Eintrag unter "posts" denselben Handle wie CBL.live_refs, auch bei einfachen Anfuehrungszeichen, Kommentar oder Grossbuchstaben."""
    return str(parse_package("post", text)["meta"].get("author") or "mirko-p").strip().lower()


def sponsorship_post(entry, handle, dry_run=False, path=None):
    """Traegt einen gesponserten Beitrag unter "posts" des Cognillo-Sponsorings in data/sponsorships.json ein ("/community/u/<handle>/blog/<slug>/", Format
    site_sponsorships.post_ref): Kennzeichnung, BlogPosting.sponsor und rel="sponsored" bleiben dann dauerhaft, egal ob die Laufzeit noch laeuft. Idempotent: steht
    der Beitrag schon unter irgendeinem Sponsoring, bleibt die Datei unveraendert. Laufzeit (start/end) wird nie geaendert. -> (Sponsoring-ID, neu eingetragen?)."""
    import site_sponsorships as SPM
    path = Path(path or SPONSORSHIPS_FILE)
    try:
        text = path.read_text("utf-8"); d = json.loads(text)
    except (OSError, ValueError) as ex:
        raise Stop(f"{path.name} nicht lesbar ({ex}) - gesponserter Beitrag {entry['nr']} geht NICHT live (Kennzeichnung fehlt sonst).", 1)
    recs = d.get("sponsorships") if isinstance(d, dict) else None
    key = (handle, entry["slug"])
    for r in recs if isinstance(recs, list) else []:
        if isinstance(r, dict) and any(SPM.post_ref(x) == key for x in r.get("posts") or [] if isinstance(x, str)): return r.get("id"), False
    r = sponsor_record(recs if isinstance(recs, list) else [], entry["date"])
    if not r: raise Stop(f"{path.name}: kein Sponsoring mit \"{SPONSOR_ENTITY}\" unter \"entities\" - gesponserter Beitrag {entry['nr']} geht NICHT live (Kennzeichnung fehlt sonst).", 1)
    if dry_run: return r["id"], True
    r["posts"] = list(r.get("posts") or []) + [f"/community/u/{handle}/blog/{entry['slug']}/"]
    _, errs = SPM.check_structure(d)
    if errs: raise Stop(f"{path.name} waere nach dem Eintrag ungueltig - nichts geaendert, Beitrag {entry['nr']} geht NICHT live:\n - " + "\n - ".join(errs), 1)
    m = re.match(r"\s*\{\s*\n([ \t]+)", text)
    path.write_text(json.dumps(d, ensure_ascii=False, indent=(m.group(1) if m else 1)) + "\n", "utf-8")
    return r["id"], True


# ------------------------------------------------------------------ Entitaeten und Prompt
def load_entities(path=None):
    path = Path(path or ENTITIES_FILE)
    try:
        data = json.loads(path.read_text("utf-8"))
    except (OSError, ValueError) as ex:
        raise Stop(f"{path.name} nicht lesbar: {ex}", 1)
    return {e["id"]: e for e in data if isinstance(e, dict) and e.get("id")}


def resolve_entities(entry, ents, log=print):
    """-> (topics, others_ok, scope_anchors). Unbekannte IDs in others werden weggelassen (Warnung); fehlt die Haupt-Entitaet, bricht der Lauf ab."""
    if entry["main"] not in ents:
        raise Stop(f"Haupt-Entitaet {entry['main']!r} fehlt in data/entities.json - Beitrag {entry['nr']} wird nicht geschrieben "
                   "(erst den Pull Request mit den neuen Entitaeten mergen).", 1)
    others = []
    for x in entry["others"]:
        if x == entry["main"] or x in others: continue
        if x not in ents: log(f"::warning::Entitaet {x!r} (Beitrag {entry['nr']}) gibt es nicht in data/entities.json - weggelassen")
        else: others.append(x)
    topics = [entry["main"]] + others
    in_scope = entry["sponsored"] or "cognillo" in str(entry["reihe"]).lower() or any(a in topics for a in ANCHORS)
    anchors = [a for a in ANCHORS if a in ents] if in_scope else []
    if in_scope and not anchors:
        raise Stop("Cognillo-Beitrag, aber die Entitaeten cognillo / sharepoint-essentials-toolkit fehlen in data/entities.json - nichts geschrieben.", 1)
    return topics, others, anchors


def entity_facts(eid, e, cap):
    """Die EINZIGEN Fakten, die der Beitrag ueber diese Entitaet nennen darf: Name, Art, Kurz- und Langbeschreibung (englisch), Doku-/Webadresse."""
    d = ((e.get("desc") or {}).get("en") or "").strip()
    lg = ((e.get("long") or {}).get("en") or "").strip()
    lines = [f"### {e.get('name') or eid} (id: {eid}, type: {e.get('type', '')}) - link as https://www.m365.fm/entity/{eid}/"]
    if e.get("aliases"): lines.append("Also called: " + ", ".join(map(str, e["aliases"][:6])))
    if d: lines.append("Short description: " + d)
    if lg: lines.append("Details: " + (lg if len(lg) <= cap else lg[:cap].rsplit(" ", 1)[0] + " ..."))
    for k, lab in (("web", "Website"), ("docs", "Documentation")):
        if e.get(k) and urllib.parse.urlsplit(str(e[k])).netloc.lower() in ALLOWED_HOSTS: lines.append(f"{lab}: {e[k]}")
    return "\n".join(lines)


def facts_text(topics, anchors, ents):
    ids = list(dict.fromkeys(anchors + topics))
    return "\n\n".join(entity_facts(i, ents[i], ANCHOR_CAP if i in ANCHORS else FACT_CAP) for i in ids)


RULES = """You write blog articles and LinkedIn posts for M365.FM, an independent Microsoft 365 knowledge site and podcast. The articles are in English, written for IT admins, SharePoint owners and Microsoft 365 decision makers.

QUALITY RULES (hard rules, a second reviewer checks everything against them, LinkedIn texts included):
1. Only provable statements. Use the ENTITY FACTS below and well-documented, stable Microsoft 365 behaviour that is described in Microsoft documentation. If you are not sure that something is true or still current, leave it out or say that it depends and that readers should check Microsoft Learn.
2. Never invent numbers, percentages, prices, dates, version numbers, customer names, case studies, quotes, survey results, statistics or sources. Do not write "studies show", "according to a report" or similar. No first-person experience ("we tested", "in our experience", "our customers"). No anecdotes.
3. About Cognillo and its products (for example the SharePoint Essentials Toolkit) say ONLY what is stated in the ENTITY FACTS and nothing more: no features, prices, editions, customers, integrations, awards, roadmap or performance claims from your memory. If the facts do not cover something, do not claim it.
4. Competitors and alternatives: neutral and factual. Name them only if the facts or Microsoft documentation do; never disparage, never rank, no "better than". Native Microsoft features come first; third-party tools are one option among others.
5. No promises: no "guarantee", "eliminates all", "100%", "never again", "zero risk", "risk-free", no hype words. Describe what a tool or feature is designed to help with, not that it solves everything.
6. Admin actions that can lose data or change access (deleting, removing permissions, breaking inheritance, restoring, migrating, bulk changes, PowerShell that changes things) must always come with a clear note to test first (pilot site or test tenant) and to have a backup or a way back. No step-by-step instructions for risky actions without that note.
7. Links in the article: only these hosts are allowed: learn.microsoft.com, techcommunity.microsoft.com, www.cognillo.com, www.m365.fm. Use Markdown links [text](https://...). Link exactly the pages given in the ENTITY FACTS (documentation / website URLs) or well-known stable Microsoft Learn start pages you are sure exist; never guess deep links. Every other link will be removed automatically. No images, no HTML, no code blocks longer than 8 lines.
8. Internal links: link entity names on first mention in the article as [Name](https://www.m365.fm/entity/<id>/), using the ids from the ENTITY FACTS. Link the MAIN entity and at least two of the OTHER entities. Do not link the same entity more than twice.
9. Style: clear, plain, practical, no filler. Short paragraphs, concrete examples that are clearly hypothetical ("Imagine a team site ...") and not presented as real cases. Use ## headings (4 to 6), no # title, no repeated title, no "In conclusion" cliche. End with a short section of practical takeaways.

ENTITY FACTS (the only source for facts about these entities):

"""

DRAFT_TASK = """Write the article and the LinkedIn texts.

Title (fixed, do not change): {title}
Main topic entity: {main}
Other entities to cover and link: {others}
{cognillo}
Length: 1,200 to 1,600 words of article text. Structure: a short intro (2 short paragraphs), 4 to 6 sections with ## headings, last section with practical takeaways.
{sponsored}
LinkedIn texts (same quality rules, no invented numbers, Cognillo only with facts from the ENTITY FACTS): value first, not promotional, a curiosity-making first line that gives away one useful insight from the article, short paragraphs, at most 1,000 characters each, the LAST sentence before the hashtags is an open question to the readers, then one line with 2 or 3 hashtags (for example #Microsoft365 #SharePoint). Write the placeholder {{URL}} exactly once where the link to the article belongs (for example "Full article: {{URL}}"); no other links or addresses. At most one emoji. No "Sponsored" label (it is added automatically where needed).
- "profile": written for a personal profile, neutral editorial voice, addresses the reader as "you".
- "page": for the company page of the "M365 Show" podcast, same value, slightly more factual.
- "group": for professional LinkedIn groups, discussion first, the least promotional of the three.{group}

Output EXACTLY in this format and nothing else:
===SUMMARY===
One sentence summary for search results, 120 to 250 characters, no links, no quotation marks.
===FAQ===
A JSON list with 2 or 3 objects {{"q": "...", "a": "..."}}: questions readers really ask, answers of 30 to 70 words, plain text, no links, no markdown.
===LINKEDIN===
A JSON object {{"profile": "...", "page": "...", "group": "..."}} (use \\n for line breaks).
===BODY===
The article in Markdown (## headings, paragraphs, lists, **bold**, [links](https://...)). No front matter."""

RETRY_TASK = """Your previous answer failed automatic checks. Fix ALL of these problems and return the complete corrected answer in the same format as before:
{errors}

Your previous answer was:
{previous}"""

REVIEW_TASK = """You are the second reviewer. Check the article and the LinkedIn texts below against the QUALITY RULES and the ENTITY FACTS.
Find: (a) statements that are not provable or not covered by the facts or by stable Microsoft documentation, (b) invented or unverifiable numbers, dates, prices, names, quotes, sources, (c) claims about Cognillo or its products that go beyond the ENTITY FACTS, (d) disparaging or non-factual wording about competitors or alternatives, (e) promises or hype, (f) risky admin actions without a test/backup note, (g) real or guessed links outside the allowed hosts, (h) personal experience claims, (i) wording that sounds like unmarked advertising, especially in the LinkedIn texts.
Change ONLY the passages that have a problem. Do not rewrite anything else.

Answer with JSON only (no markdown fence):
{{"verdict": "ok" or "edits", "edits": [{{"find": "<exact text copied from the text below, 20 to 400 characters, must appear exactly once>", "replace": "<corrected text, or an empty string to delete the passage>", "reason": "<short reason>"}}]}}
Rules for edits: "find" is copied character by character from the summary, a FAQ answer, a LinkedIn text or the body. The replacement must not add new facts, must keep Markdown links valid, must keep the {{URL}} placeholder in the LinkedIn texts and must keep the text readable. At most 25 edits. If everything is fine, answer {{"verdict": "ok", "edits": []}}.

TITLE: {title}

===SUMMARY===
{summary}
===FAQ===
{faq}
===LINKEDIN===
{linkedin}
===BODY===
{body}"""


def draft_prompt(entry, topics, others, anchors):
    cog = ""
    if anchors:
        cog = ("This is a Cognillo-related topic. Relate it to the entities " + " and ".join(anchors)
               + " ONLY where the topic truly calls for it and ONLY with facts from the ENTITY FACTS; link them as described.")
    spon = ("The article opens with a sponsorship notice that the system adds automatically. Do not write a sponsorship notice yourself and do not start with one.\n"
            if entry["sponsored"] else "This is an editorial article. Mention Cognillo only if the topic needs it, factually and without praise.\n" if anchors else "")
    grp = ' This article is sponsored: set "group" to an empty string "" (sponsored articles never go to groups).' if entry["sponsored"] else ""
    return DRAFT_TASK.format(title=entry["title"], main=entry["main"], others=", ".join(others) or "(none)", cognillo=cog, sponsored=spon, group=grp)


def build_prefix(topics, anchors, ents):
    return RULES + facts_text(topics, anchors, ents)


# ------------------------------------------------------------------ Kosten
def cost_of(tin, tout, cr, cw):
    import generate_articles as GA
    return GA.cost_usd(tin, tout, cr, cw, MODEL)


def prices():
    import generate_articles as GA
    return GA.price_of(MODEL)


def tok(text):
    return int(len(text) / 3.5) + 1   # grobe Schaetzung (Englisch ~4 Zeichen je Token, hier vorsichtig)


def estimate(prefix, task):
    """-> {"typical": USD, "cap": USD, "draft": ..., "review": ...} je Beitrag samt LinkedIn-Texten (stecken im selben Aufruf). Typisch: Entwurf + Pruefung mit den
    geschaetzten Ausgaben; cap: zwei volle Durchgaenge (Wiederholung) mit ausgeschoepften max_tokens. Prompt-Cache auf dem gemeinsamen Anfang (Regeln + Fakten):
    Schreiben 1,25x im Entwurf, Lesen 0,1x in der Pruefung."""
    p = prices(); tp, tt = tok(prefix), tok(task)
    def draft(out): return (tp * p["cw"] + tt * p["in"] + out * p["out"]) / 1e6
    def review(out, art): return (tp * p["cr"] + (tok(REVIEW_TASK) + art) * p["in"] + out * p["out"]) / 1e6
    art = TYPICAL_OUT["draft"]
    typical = draft(TYPICAL_OUT["draft"]) + review(TYPICAL_OUT["review"], art)
    cap_one = draft(DRAFT_MAX_TOKENS) + review(REVIEW_MAX_TOKENS, DRAFT_MAX_TOKENS)
    return {"typical": round(typical, 4), "cap": round(2 * cap_one, 4), "draft": round(draft(TYPICAL_OUT["draft"]), 4), "review": round(review(TYPICAL_OUT["review"], art), 4)}


def load_spend(path=None):
    path = Path(path or SPEND_FILE)
    try:
        return json.loads(path.read_text("utf-8")) if path.exists() else {}
    except ValueError:
        raise Stop(f"{path.name} ist kein gueltiges JSON - Abbruch, damit das Kostenbuch nicht ueberschrieben wird.", 1)


def series_spent(path=None):
    """Bisherige Kosten der Reihe in USD (kumulativ, Schluessel "sponsor-cognillo")."""
    return float((load_spend(path).get(SERIES_KEY) or {}).get("usd") or 0.0)


def book(tin, tout, cr, cw, path=None):
    """Bucht einen bezahlten Aufruf SOFORT im Kostenbuch (der Speichern-Schritt des Workflows laeuft auch nach Fehlern). Zaehler wie beim Artikel-Generator
    (Eingabe gesamt inkl. Cache, davon Cache gelesen/geschrieben), damit tools/spend_merge.py sie je Schluessel addiert."""
    path = Path(path or SPEND_FILE)
    sd = load_spend(path)
    m = sd.setdefault(SERIES_KEY, {})
    m["usd"] = round(float(m.get("usd") or 0) + cost_of(tin, tout, cr, cw), 4)
    for k, v in (("input_tokens", tin), ("output_tokens", tout), ("cache_read_tokens", cr), ("cache_write_tokens", cw), ("calls", 1)):
        m[k] = int(m.get(k) or 0) + v
    m.setdefault("models", {})[MODEL] = int(m.get("models", {}).get(MODEL) or 0) + 1
    path.write_text(json.dumps(sd, indent=1), "utf-8")


def check_series_budget(spent=None):
    """Kein API-Aufruf, wenn die Gesamtgrenze der Reihe erreicht oder ueberschritten ist. Nur diese eigene Grenze bremst (nicht die Monatsgrenze des Artikel-Generators)."""
    b, s = budget_usd(), series_spent() if spent is None else spent
    if s >= b:
        raise Stop(f"::warning::BUDGET DER REIHE ERREICHT: {s:.2f} von {b:.2f} USD (SPONSOR_POSTS_BUDGET_USD) - kein API-Aufruf, nichts geschrieben.", 0)
    return s, b


# ------------------------------------------------------------------ API
def api_call(prefix, task, max_tokens):
    """Ein Sonnet-Aufruf ueber dieselben Helfer wie generate_articles.py (Gateway, thinking_off, Cache-Breakpoint auf dem gemeinsamen Anfang). Bucht die Kosten
    sofort. -> (Text, stop_reason)."""
    from ai_gateway import anthropic_request, thinking_off, urlopen, usage_tokens
    check_series_budget()
    key = os.environ.get("ANTHROPIC_API_KEY", "")
    if not key: raise Stop("Kein ANTHROPIC_API_KEY (Secret ANTHROPIC_API_KEY_SHOW) - nichts geschrieben.", 1)
    body = {"model": MODEL, "max_tokens": max_tokens, **thinking_off(MODEL),
            "messages": [{"role": "user", "content": [{"type": "text", "text": prefix, "cache_control": {"type": "ephemeral"}}, {"type": "text", "text": task}]}]}
    req = anthropic_request("/v1/messages", body, job="sponsor_post", lang="en", model=MODEL, api_key=key)
    r = None
    for attempt in range(4):
        try:
            with urlopen(req, timeout=240) as resp:
                r = json.load(resp)
            break
        except urllib.error.HTTPError as ex:
            if ex.code in (401, 402): raise Stop(f"Anthropic-Guthaben leer oder Schluessel ungueltig (HTTP {ex.code}) - nichts geschrieben.", 1)
            if ex.code in (429, 500, 502, 503, 529) and attempt < 3:
                time.sleep(15 * (attempt + 1)); continue
            raise Stop(f"Anthropic-API antwortet mit HTTP {ex.code} - nichts geschrieben.", 1)
        except (urllib.error.URLError, TimeoutError, OSError) as ex:
            if attempt < 3: time.sleep(10 * (attempt + 1)); continue
            raise Stop(f"Anthropic-API nicht erreichbar ({type(ex).__name__}) - nichts geschrieben.", 1)
    tin, tout, cr, cw = usage_tokens(r.get("usage"))
    book(tin, tout, cr, cw)
    return "".join(b.get("text", "") for b in r.get("content", [])), r.get("stop_reason")


# ------------------------------------------------------------------ Antworten lesen
def parse_draft(raw):
    """===SUMMARY=== / ===FAQ=== / ===LINKEDIN=== / ===BODY=== -> {"summary", "faq", "li", "body"} oder ValueError."""
    m = re.search(r"===SUMMARY===\s*(.*?)\s*===FAQ===\s*(.*?)\s*===LINKEDIN===\s*(.*?)\s*===BODY===\s*(.*)\Z", raw, re.S)
    if not m: raise ValueError("Antwort hat nicht das Format ===SUMMARY=== / ===FAQ=== / ===LINKEDIN=== / ===BODY===")
    summary, faq_raw, li_raw, body = (g.strip() for g in m.groups())
    fm = re.search(r"\[.*\]", faq_raw, re.S)
    try:
        faq = json.loads(fm.group(0)) if fm else None
    except ValueError:
        faq = None
    if not isinstance(faq, list): raise ValueError("FAQ ist keine gueltige JSON-Liste")
    faq = [{"q": str(x["q"]).strip(), "a": str(x["a"]).strip()} for x in faq if isinstance(x, dict) and x.get("q") and x.get("a")]
    lm = re.search(r"\{.*\}", li_raw, re.S)
    try:
        li = json.loads(lm.group(0)) if lm else None
    except ValueError:
        li = None
    if not isinstance(li, dict): raise ValueError("LINKEDIN ist kein gueltiges JSON-Objekt")
    return {"summary": summary, "faq": faq, "li": {k: str(li.get(k) or "").strip() for k in LI_KEYS}, "body": body}


def parse_review(raw):
    m = re.search(r"\{.*\}", raw, re.S)
    if not m: raise ValueError("keine JSON-Antwort")
    j = json.loads(m.group(0))
    if not isinstance(j, dict) or j.get("verdict") not in ("ok", "edits") or not isinstance(j.get("edits", []), list):
        raise ValueError("JSON ohne verdict/edits")
    return [e for e in j.get("edits", []) if isinstance(e, dict) and isinstance(e.get("find"), str) and isinstance(e.get("replace", ""), str)][:25]


def _fields(doc):
    f = {"summary": doc["summary"], "body": doc["body"]}
    for k in LI_KEYS: f["li_" + k] = doc["li"].get(k, "")
    for i, x in enumerate(doc["faq"]): f[f"faq{i}q"] = x["q"]; f[f"faq{i}a"] = x["a"]
    return f


def apply_edits(doc, edits, log=print):
    """Wendet die Aenderungen des zweiten Durchgangs an: nur bei genau einem Treffer in genau einem Feld (Kurzfassung, FAQ, LinkedIn, Text); alles andere bleibt
    unveraendert. -> (doc, Anzahl)."""
    n = 0
    for e in edits:
        f, r = e["find"], e.get("replace", "")
        hits = [(k, v) for k, v in _fields(doc).items() if f in v]
        if len(f) < 8 or len(hits) != 1 or hits[0][1].count(f) != 1:
            log(f"Pruefung: Aenderung nicht eindeutig anwendbar, uebersprungen: {f[:60]!r}"); continue
        k = hits[0][0]
        if k in ("summary", "body"): doc[k] = doc[k].replace(f, r, 1)
        elif k.startswith("li_"): doc["li"][k[3:]] = doc["li"][k[3:]].replace(f, r, 1)
        else:
            i = int(re.match(r"faq(\d+)", k).group(1)); key = "q" if k.endswith("q") else "a"; doc["faq"][i][key] = doc["faq"][i][key].replace(f, r, 1)
        n += 1
        log(f"Pruefung: Stelle geaendert ({str(e.get('reason', ''))[:80]})")
    return doc, n


# ------------------------------------------------------------------ Links
_MD_LINK = re.compile(r"(?<!!)\[([^\]]*)\]\(\s*([^)\s]+)(?:\s+\"[^\"]*\")?\s*\)")
_IMAGE = re.compile(r"!\[[^\]]*\]\([^)]*\)")
_BARE = re.compile(r"https?://[^\s)<>\]\"']+|\bwww\.[^\s)<>\]\"']+")
_TAG = re.compile(r"</?[A-Za-z][^>]*>")


def http_ok(url, timeout=15):
    """HTTP-Pruefung eines Links (HEAD, bei 403/405/501 GET). Jeder Fehler = nicht erreichbar."""
    hdr = {"User-Agent": "Mozilla/5.0 (compatible; m365fm-link-check/1.0; +https://www.m365.fm)", "Accept": "text/html,*/*"}
    for method in ("HEAD", "GET"):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=hdr, method=method), timeout=timeout) as r:
                return r.status < 400
        except urllib.error.HTTPError as ex:
            if method == "HEAD" and ex.code in (403, 405, 501): continue
            return False
        except Exception:
            return False
    return False


def filter_links(text, ents, check=http_ok, log=print):
    """Entfernt Bilder, HTML und bare URLs; jeden Markdown-Link auf einen nicht erlaubten Host (Text bleibt, Warnung). www.m365.fm nur als /entity/<id>/ einer
    bekannten Entitaet (die neuen Seiten sind noch nicht live, deshalb keine HTTP-Anfrage); die uebrigen erlaubten Hosts per HTTP (Fehler = Link weg, Text bleibt)."""
    cache = {}
    text = _IMAGE.sub("", text)
    text = _TAG.sub("", text)
    def fix(m):
        label, url = m.group(1).strip(), m.group(2).strip()
        sp = urllib.parse.urlsplit(url)
        host = sp.netloc.lower()
        if sp.scheme not in ("http", "https") or host not in ALLOWED_HOSTS:
            log(f"::warning::Link entfernt (Host nicht erlaubt): {url}"); return label
        if host == "www.m365.fm":
            em = re.fullmatch(r"/entity/([a-z0-9-]+)/?", sp.path)
            if not em or em.group(1) not in ents:
                log(f"::warning::Link entfernt (keine bekannte Entitaetsseite): {url}"); return label
            return f"[{label}](https://www.m365.fm/entity/{em.group(1)}/)"
        url = "https://" + url.split("://", 1)[1]
        if url not in cache: cache[url] = bool(check(url))
        if not cache[url]:
            log(f"::warning::Link entfernt (HTTP-Pruefung fehlgeschlagen): {url}"); return label
        return f"[{label}]({url})"
    keep = []
    def stash(m):
        keep.append(fix(m)); return f"\x00{len(keep) - 1}\x00"
    text = _MD_LINK.sub(stash, text)
    text = _BARE.sub(lambda m: (log(f"::warning::Freie Adresse entfernt: {m.group(0)}"), "")[1], text)
    text = re.sub(r"\x00(\d+)\x00", lambda m: keep[int(m.group(1))], text)
    return re.sub(r"[ \t]+\n", "\n", re.sub(r" {2,}", " ", text))


def plain(text):
    """Text ohne Links und Markdown (Kurzfassung, FAQ)."""
    text = _MD_LINK.sub(lambda m: m.group(1), _IMAGE.sub("", text))
    text = _BARE.sub("", _TAG.sub("", text))
    return re.sub(r"\s+", " ", re.sub(r"[*_`]", "", text)).strip()


def clean_linkedin(li, entry, log=print):
    """LinkedIn-Texte: Adressen, Links und HTML raus (nur der Platzhalter {URL} bleibt); bei sponsored=true kein Gruppentext und die Sponsor-Zeile vorn
    (profile, page). -> dict {profile, page, group}."""
    out = {}
    for k in LI_KEYS:
        t = str(li.get(k, "")).strip().replace("\\n", "\n")
        t = _MD_LINK.sub(lambda m: m.group(1), _IMAGE.sub("", t))
        t = _TAG.sub("", t)
        t = _BARE.sub(lambda m: (log(f"::warning::LinkedIn-Text {k}: Adresse entfernt: {m.group(0)}"), "")[1], t)
        t = re.sub(r"[ \t]{2,}", " ", t)
        t = re.sub(r"\n{3,}", "\n\n", re.sub(r"[ \t]+\n", "\n", t)).strip()
        if entry["sponsored"]:
            if k == "group": t = ""
            else:
                t = re.sub(r"(?im)^.*sponsored by cognillo.*$\n?", "", t).replace("#Anzeige", "").strip()
                t = SPONSOR_LI + "\n\n" + t
        out[k] = t
    return out


# ------------------------------------------------------------------ eigene Regelpruefung
PROMISES = re.compile(r"\b(guarantee[sd]?|risk-free|zero[- ]risk|100\s?%|never again|eliminates? all|problem solved|solves? everything|revolutionary|game[- ]chang\w+|best-in-class|world-class|unmatched)\b", re.I)
DISPARAGE = re.compile(r"\b(worse than|inferior|useless|terrible|garbage|rip-?off|overpriced|scam|beats? (?:microsoft|every)|better than (?:microsoft|native|the competition))\b", re.I)
EXPERIENCE = re.compile(r"\b(we tested|i tested|in our (?:tests|experience|lab)|our customers|our clients|i have seen|we have seen|clients told|customers told)\b", re.I)
SOURCES = re.compile(r"\b(studies show|according to (?:a|the) (?:report|study|survey|analyst)|survey(?:s)? (?:show|found)|research shows|gartner|forrester|idc)\b", re.I)
RISKY = re.compile(r"\b(delet\w+|remov\w+ (?:permissions?|access|users?|sites?)|break\w* inheritance|disable\w*|restor\w+|purg\w+|revok\w+|migrat\w+|bulk|Remove-\w+|Set-(?:SP|PnP)\w+|reset\w*)\b", re.I)
SAFETY = re.compile(r"\b(test(?:s|ed|ing)?|pilot|backup|back up|back-up|sandbox|non-production|staging|roll ?back|way back|recycle bin|first copy)\b", re.I)
AMOUNT = re.compile(r"(?:[$€£]\s?\d[\d.,]*|\b\d[\d.,]*\s?(?:%|percent\b|USD\b|EUR\b|dollars\b|euros\b))", re.I)
COUNT = re.compile(r"\b\d{2,}(?:[.,]\d+)*\s+(?:customers|clients|users|companies|organi[sz]ations|sites|employees|installations|partners|countries)\b", re.I)


def linkedin_problems(li, entry):
    err = []
    for k in LI_KEYS:
        t = li.get(k, "")
        if entry["sponsored"] and k == "group":
            if t: err.append("LinkedIn group muss bei sponsored leer sein")
            continue
        if not t: err.append(f"LinkedIn {k}: leer"); continue
        if len(t) > LI_MAX: err.append(f"LinkedIn {k}: {len(t)} Zeichen (hoechstens {LI_MAX})")
        if t.count("{URL}") != 1: err.append(f"LinkedIn {k}: Platzhalter {{URL}} muss genau einmal vorkommen")
        body = t.replace(SPONSOR_LI, "").strip()
        tags = [h for h in re.findall(r"#\w+", body) if h.lower() != "#anzeige"]
        if not 2 <= len(tags) <= 3: err.append(f"LinkedIn {k}: {len(tags)} Hashtags (verlangt 2-3)")
        text_lines = [ln for ln in body.splitlines() if ln.strip() and not re.fullmatch(r"(\s*#\w+)+\s*", ln)]
        if not text_lines or not text_lines[-1].rstrip().endswith("?"): err.append(f"LinkedIn {k}: muss mit einer offenen Frage enden (vor den Hashtags)")
        if re.search(r"\bsponsored\b", body, re.I) and not entry["sponsored"]: err.append(f"LinkedIn {k}: Sponsored-Hinweis bei nicht gesponsertem Beitrag")
        if entry["sponsored"] and not (t.startswith(SPONSOR_LI) and "#Anzeige" in t): err.append(f"LinkedIn {k}: Sponsored-by-Cognillo-Zeile und #Anzeige fehlen")
    return err


def quality_problems(doc, entry, topics, others, anchors, facts, wmin=600):
    """Eigene Regelpruefung (zusaetzlich zum zweiten Durchgang), Artikel UND LinkedIn-Texte. -> (Fehler, Warnungen)."""
    summary, faq, body, li = doc["summary"], doc["faq"], doc["body"], doc["li"]
    err, warn = [], []
    words = len(re.sub(r"[#*`>\[\]()!-]", " ", body).split())
    if words < wmin: err.append(f"Text hat nur {words} Woerter (Ziel 1.200-1.600, mindestens {wmin})")
    elif not 1000 <= words <= 2000: warn.append(f"Text hat {words} Woerter (Ziel 1.200-1.600)")
    if len(re.findall(r"^## \S", body, re.M)) < 3: err.append("weniger als drei ##-Ueberschriften")
    if re.search(r"^# \S", body, re.M): err.append("enthaelt eine #-Ueberschrift (Titel gehoert nicht in den Text)")
    if re.search(r"^\s*sponsored\s*:", body.strip(), re.I) and entry["sponsored"]: err.append("Text beginnt selbst mit einem Sponsored-Hinweis (den setzt das Skript)")
    linked = set(re.findall(r"\]\(https://www\.m365\.fm/entity/([a-z0-9-]+)/\)", body))
    if entry["main"] not in linked: err.append(f"Haupt-Entitaet {entry['main']} ist nicht als https://www.m365.fm/entity/{entry['main']}/ verlinkt")
    need = min(2, len(others))
    got = len([o for o in others if o in linked])
    if got < need: err.append(f"Nur {got} der weiteren Entitaeten verlinkt, verlangt {need} (moegliche: {', '.join(others)})")
    if anchors and not any(a in linked for a in anchors): err.append("Cognillo-Thema, aber weder cognillo noch sharepoint-essentials-toolkit verlinkt")
    li_text = " ".join(li.get(k, "") for k in LI_KEYS)
    alltext = body + " " + summary + " " + " ".join(x["q"] + " " + x["a"] for x in faq) + " " + li_text
    for lab, rx in (("Heilsversprechen/Werbesprache", PROMISES), ("abwertende Wettbewerber-Aussage", DISPARAGE), ("erfundene Erfahrung", EXPERIENCE), ("unbelegte Quelle/Studie", SOURCES)):
        hit = rx.search(alltext)
        if hit: err.append(f"{lab}: {hit.group(0)!r}")
    for rx, lab in ((AMOUNT, "Prozent-/Geldangabe"), (COUNT, "Mengenangabe")):
        for hit in rx.findall(alltext):
            core = re.sub(r"[^\d.,]", "", hit).strip(".,")
            if core and core not in facts and core not in entry["title"]: err.append(f"{lab} nicht in den Entitaetsdaten belegt: {hit.strip()!r}")
    if RISKY.search(body) and not SAFETY.search(body): err.append("riskante Admin-Aktion beschrieben, aber kein Hinweis auf Test/Backup")
    if not 2 <= len(faq) <= 3: err.append(f"FAQ hat {len(faq)} Fragen (verlangt 2-3)")
    err += linkedin_problems(li, entry)
    return err, warn


# ------------------------------------------------------------------ Paket
def yq(s):
    """Wert fuer den YAML-Kopf: eine Zeile, in doppelten Anfuehrungszeichen ohne Escapes (der kleine Leser site_shownotes._yaml_min entfernt nur die Anfuehrungszeichen)."""
    return '"' + re.sub(r"\s+", " ", str(s).replace('"', "'").replace("\\", "")).strip() + '"'


SPONSOR_NOTICE = ("Sponsored: Cognillo sponsors M365.FM, and this article is part of that paid partnership. "
                  "Statements about Cognillo and its products are limited to the facts on the M365.FM entity pages{cog}.")


def notice(ents):
    cog = " ([Cognillo](https://www.m365.fm/entity/cognillo/))" if "cognillo" in ents else ""
    return SPONSOR_NOTICE.format(cog=cog)


def package_text(entry, summary, faq, body, topics, status="review", publish=False):
    head = ["---", f"title: {yq(entry['title'])}", f"summary: {yq(summary)}", f"status: {status}", f"publish: {'true' if publish else 'false'}", "author: mirko-p",
            f"date: {entry['date']}", "topics: [" + ", ".join(topics) + "]", "faq:"]
    for x in faq: head += [f"  - q: {yq(x['q'])}", f"    a: {yq(x['a'])}"]
    head.append("---")
    return "\n".join(head) + "\n\n" + body.strip() + "\n"


def check_package(slug, text, ents):
    """Schreibt den Text in einen Temp-Ordner, liest ihn wie der Seitenbau (site_shownotes.parse_file) und ruft site_content_blog.check (unabhaengig vom status).
    -> Fehlerliste."""
    import site_content_blog as CBL
    _, errs = CBL.check(parse_package(slug, text), "en", slug, ents)
    return errs


def parse_package(slug, text):
    """Liest den Text wie der Seitenbau (site_shownotes.parse_file ueber einen Temp-Ordner). -> {"meta", "body", "path"}."""
    import site_shownotes as SNS
    with tempfile.TemporaryDirectory() as tmp:
        f = Path(tmp) / f"{slug}.md"
        f.write_text(text, "utf-8")
        return SNS.parse_file(f)


def set_head_flags(text, status, publish):
    """Setzt status und publish im YAML-Kopf (nur dort, Rest der Datei bleibt Byte fuer Byte). -> neuer Text oder ValueError."""
    m = re.match(r"^(---\s*\n)(.*?)(\n---\s*\n)", text, re.S)
    if not m: raise ValueError("kein YAML-Kopf")
    head = m.group(2)
    for key, val in (("status", status), ("publish", "true" if publish else "false")):
        head, n = re.subn(rf"(?m)^{key}:.*$", f"{key}: {val}", head, count=1)
        if n != 1: raise ValueError(f"Feld {key} fehlt im Kopf")
    return m.group(1) + head + m.group(3) + text[m.end():]


# ------------------------------------------------------------------ Ablauf je Beitrag
def review_pass(doc, entry, prefix, call, log):
    """Zweiter Sonnet-Durchgang: findet unbelegte Aussagen/Regelverstoesse (Artikel und LinkedIn-Texte) und ueberarbeitet nur diese Stellen (Austausch exakter Textstellen)."""
    task = REVIEW_TASK.format(title=entry["title"], summary=doc["summary"], faq=json.dumps(doc["faq"], ensure_ascii=False),
                              linkedin=json.dumps(doc["li"], ensure_ascii=False), body=doc["body"])
    edits = None
    for _ in range(2):
        raw, _stop = call(prefix, task, REVIEW_MAX_TOKENS)
        try:
            edits = parse_review(raw); break
        except ValueError as ex:
            log(f"Pruefung: Antwort nicht lesbar ({ex})")
    if edits is None: raise Stop("Zweiter Durchgang liefert keine lesbare Antwort - nichts geschrieben (kein Beitrag ohne Pruefung).", 1)
    doc, n = apply_edits(doc, edits, log)
    log(f"Pruefung: {len(edits)} Beanstandungen, {n} Stellen geaendert")
    return doc


def produce(entry, topics, others, anchors, ents, prefix, call=api_call, check=http_ok, log=print):
    """Entwurf -> zweiter Durchgang -> Links -> Pruefungen -> ggf. EIN Wiederholungsversuch. -> (Text der Paketdatei, LinkedIn-Texte) oder PostFailed."""
    facts = facts_text(topics, anchors, ents)
    task = draft_prompt(entry, topics, others, anchors)
    errors, previous = [], None
    for attempt in (1, 2):
        t = task if not errors else RETRY_TASK.format(errors="\n".join("- " + e for e in errors), previous=previous) + "\n\n" + task
        raw, stop = call(prefix, t, DRAFT_MAX_TOKENS)
        previous = raw
        if stop == "max_tokens":
            errors = ["Antwort wurde abgeschnitten (zu lang): kuerzer fassen, 1.200-1.600 Woerter"]
            log(f"Versuch {attempt}: Entwurf abgeschnitten"); continue
        try:
            doc = parse_draft(raw)
        except ValueError as ex:
            errors = [str(ex)]; log(f"Versuch {attempt}: {ex}"); continue
        doc = review_pass(doc, entry, prefix, call, log)
        doc["body"] = filter_links(doc["body"], ents, check, log)
        doc["summary"], doc["faq"] = plain(doc["summary"]), [{"q": plain(x["q"]), "a": plain(x["a"])} for x in doc["faq"]]
        doc["li"] = clean_linkedin(doc["li"], entry, log)
        errors, warns = quality_problems(doc, entry, topics, others, anchors, facts)
        for w in warns: log("::warning::" + w)
        if not errors:
            body = (notice(ents) + "\n\n" + doc["body"]) if entry["sponsored"] else doc["body"]
            text = package_text(entry, doc["summary"], doc["faq"], body, topics)
            errors = check_package(entry["slug"], text, ents)
            if not errors: return text, doc["li"]
        log(f"Versuch {attempt}: " + "; ".join(errors))
    raise PostFailed(f"Beitrag {entry['nr']} ({entry['slug']}) besteht die Pruefung auch im zweiten Versuch nicht - keine Datei, kein neuer Status:\n - " + "\n - ".join(errors))


def write_one(entry, ents, log=print, produce_fn=None):
    """Schreibt einen Beitrag samt LinkedIn-Texten und setzt den Plan-Status "entwurf" (erst nach erfolgreicher Pruefung; alles oder nichts). -> Pfad."""
    topics, others, anchors = resolve_entities(entry, ents, log)
    prefix = build_prefix(topics, anchors, ents)
    text, li = (produce_fn or produce)(entry, topics, others, anchors, ents, prefix, log=log)
    if package_exists(entry["slug"]): raise Stop(f"{entry['slug']}.md ist inzwischen aufgetaucht - nichts ueberschrieben.", 1)
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    f = OUT_DIR / f"{entry['slug']}.md"
    f.write_text(text, "utf-8")
    save_linkedin(entry["nr"], li)
    update_plan({entry["nr"]: {"status": "entwurf"}})
    return f


# ------------------------------------------------------------------ Modi
def out_file(env, text):
    f = os.environ.get(env)
    if f: Path(f).write_text(text, "utf-8")


def summary_line(text):
    print(text)
    f = os.environ.get("GITHUB_STEP_SUMMARY")
    if f:
        try:
            with open(f, "a", encoding="utf-8") as fh: fh.write(text + "\n\n")
        except OSError: pass


def compact(nums):
    """[1, 2, 3, 5] -> "1-3, 5"."""
    out, i = [], 0
    nums = sorted(nums)
    while i < len(nums):
        j = i
        while j + 1 < len(nums) and nums[j + 1] == nums[j] + 1: j += 1
        out.append(str(nums[i]) if i == j else f"{nums[i]}-{nums[j]}"); i = j + 1
    return ", ".join(out)


def cost_line(est, spent, bud, n):
    return (f"Kosten je Beitrag (inkl. 3 LinkedIn-Texte): geschaetzt {est['typical']:.2f} USD (Entwurf {est['draft']:.2f} + Pruefung {est['review']:.2f}), Obergrenze mit Wiederholung "
            f"{est['cap']:.2f} USD. Fuer {n} Beitraege: ca. {n * est['typical']:.2f} USD typisch, hoechstens {n * est['cap']:.2f} USD. Reihe bisher {spent:.2f} von {bud:.2f} USD.")


def sync_existing(entries, blog_dir=None, log=print):
    """Wiederaufnahme: Beitrag mit Status "geplant", dessen Datei schon da ist (status: review): Plan-Status auf "entwurf" nachziehen (ohne Kosten)."""
    ch = {}
    for e in entries:
        p = package_path(e["slug"], blog_dir)
        if p and re.search(r"(?m)^status:\s*review\s*$", p.read_text("utf-8")[:3000]): ch[e["nr"]] = {"status": "entwurf"}
        else: log(f"Hinweis: Eintrag {e['nr']} ({e['slug']}) ist \"geplant\", die Datei gibt es aber schon (nicht status: review) - nicht angefasst.")
    return ch


def mode_schreiben(von, bis, dry_run, batch=BATCH_DEFAULT, log=print, produce_fn=None):
    plan = load_plan()
    todo, have = select_write(plan, von, bis)
    ch = sync_existing(have, None, log)
    if ch and not dry_run:
        update_plan(ch); log(f"Wiederaufnahme: {len(ch)} Beitraege mit vorhandener Datei im Plan auf \"entwurf\" gesetzt: {', '.join(map(str, sorted(ch)))}")
    left = len(todo)
    if not todo:
        summary_line("Sponsor-Reihe schreiben: nichts zu schreiben (alle Nummern im Bereich sind schon geschrieben).")
        out_file("SPONSOR_WRITTEN_FILE", "0")
        return 0
    ents = load_entities()
    topics, others, anchors = resolve_entities(todo[0], ents, log)
    prefix, task = build_prefix(topics, anchors, ents), draft_prompt(todo[0], topics, others, anchors)
    est = estimate(prefix, task)
    spent, bud = series_spent(), budget_usd()
    nums = compact([e["nr"] for e in todo])
    if dry_run:
        print(f"::group::Prompt fuer Beitrag {todo[0]['nr']} (Dry-Run, kein API-Aufruf)\n----- gemeinsamer Anfang (wird gecacht) -----\n" + prefix + "\n----- Aufgabe Entwurf -----\n" + task
              + "\n----- Aufgabe zweiter Durchgang (Anfang) -----\n" + REVIEW_TASK.replace("{{", "{").replace("}}", "}")[:900] + "\n::endgroup::")
        summary_line(f"Dry-Run schreiben: {left} Beitraege wuerden geschrieben (Nr {nums}). Prompt des ersten ca. {tok(prefix + task)} Token. {cost_line(est, spent, bud, left)} "
                     "Es wurde nichts geschrieben und nichts bezahlt.")
        if spent >= bud: log(f"::warning::Das Budget der Reihe ist schon erreicht ({spent:.2f} von {bud:.2f} USD) - ein echter Lauf wuerde ohne API-Aufruf abbrechen.")
        elif spent + left * est["cap"] > bud: log("::warning::Im ungünstigsten Fall (alle mit Wiederholung) reicht das Budget nicht fuer alle Beitraege; es bremst dann von selbst.")
        return 0
    check_series_budget(spent)
    log(cost_line(est, spent, bud, left))
    done, failed, stopped = [], [], None
    for e in todo[:max(1, batch)]:
        try:
            f = write_one(e, ents, log, produce_fn)
            done.append(e); log(f"Beitrag {e['nr']} \"{e['title']}\" geschrieben: {f} (Reihe {series_spent():.2f} von {bud:.2f} USD)")
        except PostFailed as ex:
            failed.append(e); log(f"::error::{ex}")
        except Stop as ex:
            stopped = ex; log(str(ex)); break
    out_file("SPONSOR_WRITTEN_FILE", str(len(done)))
    out_file("SPONSOR_COMMIT_MSG_FILE", (f"Cognillo-Beitraege geschrieben (Entwurf): Nr {', '.join(str(e['nr']) for e in done)}\n" if done
                                        else "Cognillo-Beitraege: Kostenbuch aktualisiert (kein Beitrag gespeichert)\n"))
    summary_line(f"Sponsor-Reihe schreiben: {len(done)} geschrieben ({', '.join(str(e['nr']) for e in done) or '-'}), {len(failed)} nicht bestanden ({', '.join(str(e['nr']) for e in failed) or '-'}), "
                 f"noch offen {left - len(done) - len(failed)}. Reihe jetzt {series_spent():.2f} von {bud:.2f} USD. Status review/publish false: nichts geht live.")
    if stopped: return stopped.code
    return 1 if failed else 0


def mode_freigeben(nummern, dry_run, log=print):
    plan = load_plan()
    nums = parse_nummern(nummern, [e["nr"] for e in plan])
    if not nums: raise Stop("Eingabe nummern fehlt (z. B. \"1-62\" oder \"1-10,15\").", 1)
    by = {e["nr"]: e for e in plan}
    ch, skip = {}, []
    for n in nums:
        e = by[n]
        if e["status"] != "entwurf": skip.append(f"{n}: Status \"{e['status']}\" (nur \"entwurf\" kann freigegeben werden)")
        elif not package_exists(e["slug"]): skip.append(f"{n}: Datei {e['slug']}.md fehlt")
        elif e.get("freigegeben") is True: skip.append(f"{n}: schon freigegeben")
        else: ch[n] = {"freigegeben": True}
    for s in skip: log("Uebersprungen " + s)
    if ch and not dry_run:
        update_plan(ch)
        out_file("SPONSOR_COMMIT_MSG_FILE", f"Cognillo-Beitraege freigegeben: Nr {', '.join(map(str, sorted(ch)))}\n")
    summary_line(("Dry-Run freigeben: wuerde " if dry_run else "Freigegeben: ") + (", ".join(map(str, sorted(ch))) or "keine") + f" ({len(skip)} uebersprungen). Kein API-Aufruf.")
    return 0


def go_live(entry, ents, dry_run, log=print):
    """Ein faelliger Beitrag: Kopf auf approved/publish true, Pruefung wie im Seitenbau, bei sponsored=true Eintrag unter "posts" (vor dem Freischalten),
    Plan-Status "live". Stop bei Fehlern, dann bleibt dieser Beitrag unveraendert. -> Text fuer die Zusammenfassung."""
    f = package_path(entry["slug"])
    text = f.read_text("utf-8")
    try:
        new = set_head_flags(text, "approved", True)
    except ValueError as ex:
        raise Stop(f"Beitrag {entry['nr']} ({entry['slug']}): Kopf der Datei nicht lesbar ({ex}) - geht NICHT live.", 1)
    errs = check_package(entry["slug"], new, ents)
    if errs:   # die Datei wurde nach dem Schreiben von Hand geaendert und besteht die Pruefung nicht mehr: nichts live schalten
        raise Stop(f"Beitrag {entry['nr']} ({entry['slug']}) besteht die Pruefung nicht und geht NICHT live:\n - " + "\n - ".join(errs), 1)
    spo, undo = "", {}   # undo: Datei -> Inhalt vor diesem Beitrag; scheitert ein spaeterer Schreibschritt, werden alle drei Dateien zurueckgesetzt
    try:
        if entry["sponsored"]:   # erst die dauerhafte Kennzeichnung, dann live: ohne Eintrag kein Freischalten
            sp = Path(SPONSORSHIPS_FILE)
            if not dry_run and sp.exists(): undo[sp] = sp.read_text("utf-8")
            rid, added = sponsorship_post(entry, post_handle(new), dry_run)
            spo = f" Gesponsert: {'Eintrag unter' if added else 'steht schon unter'} \"posts\" von {rid} (data/sponsorships.json)."
        if not dry_run:
            pl = Path(PLAN_FILE); undo[pl] = pl.read_text("utf-8"); undo[f] = text
            if new != text: f.write_text(new, "utf-8")
            update_plan({entry["nr"]: {"status": "live"}})
    except Exception as ex:   # sonst bliebe z.B. ein Eintrag unter "posts" ohne freigeschalteten Beitrag stehen, und check_posts stoppt den naechsten Seitenbau
        bad = []
        for p, t in undo.items():
            try:
                if not p.exists() or p.read_text("utf-8") != t: p.write_text(t, "utf-8")
            except OSError: bad.append(p.name)
        if isinstance(ex, Stop) and not bad: raise
        raise Stop(f"Beitrag {entry['nr']} ({entry['slug']}) geht NICHT live: {ex}" + (f" - ZURUECKSETZEN FEHLGESCHLAGEN, von Hand pruefen: {', '.join(bad)}" if bad
                   else " - data/sponsorships.json, Paketdatei und Plan sind unveraendert."), 1) from ex
    return f"Beitrag {entry['nr']} \"{entry['title']}\" (Plan-Datum {entry['date']}).{spo}"


def mode_taeglich(target, dry_run, ents=None, log=print):
    plan = load_plan()
    due, broken = due_released(plan, target)
    for b in broken: log(f"::warning::Eintrag {b['nr']} ist freigegeben, aber die Datei {b['slug']}.md fehlt - uebersprungen")
    if not due:
        free = sum(1 for e in plan if e["status"] == "entwurf" and e.get("freigegeben") is True)
        wait = sum(1 for e in plan if e["status"] == "entwurf" and e.get("freigegeben") is not True)
        summary_line(f"Sponsor-Reihe taeglich ({target}): nichts faellig. Freigegeben und noch nicht live: {free}; Entwuerfe ohne Freigabe: {wait}.")
        return 0
    ents = ents if ents is not None else load_entities()
    done, lines, err = [], [], None
    for e in due[:CATCHUP_MAX]:   # normal einer; nach einem verpassten Lauf hoechstens CATCHUP_MAX, aelteste zuerst (Reihenfolge bleibt: ein Fehler haelt die spaeteren an)
        try:
            lines.append(go_live(e, ents, dry_run, log)); done.append(e)
        except Stop as ex:
            err = ex; break
    rest = len(due) - len(done)
    if dry_run:
        summary_line(f"Dry-Run taeglich ({target}): " + (" ".join("wuerde auf approved/publish true gesetzt: " + x for x in lines) or "nichts freigeschaltet.") + " Nichts geaendert.")
    elif done:
        out_file("SPONSOR_COMMIT_MSG_FILE", (f"Cognillo-Beitrag {done[0]['nr']}: {done[0]['title']}\n" if len(done) == 1
                                            else f"Cognillo-Beitraege {', '.join(str(e['nr']) for e in done)} (Rueckstand)\n\n" + "".join(f"Nr {e['nr']}: {e['title']}\n" for e in done)))
        summary_line("Sponsor-Reihe taeglich: freigeschaltet (approved, publish true): " + " ".join(lines) + " Kommt mit dem naechsten Seitenbau (01:07 UTC) auf die Seite; "
                     "die Uebersetzung holt translate-blog.yml danach ab.")
    if rest and not err:
        log(f"::warning::Sponsor-Reihe: Rueckstand - noch {rest} freigegebene Beitraege faellig (Nr {compact([e['nr'] for e in due[len(done):]])}); der taegliche Lauf holt "
            f"hoechstens {CATCHUP_MAX} je Lauf nach. Schneller: Modus taeglich von Hand starten.")
    if err:
        log(str(err))
        if rest > 1: log(f"::warning::Sponsor-Reihe: {rest} faellige Beitraege warten (Nr {compact([e['nr'] for e in due[len(done):]])}), der erste davon besteht die Pruefung nicht.")
        return err.code
    return 0


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    sub = ap.add_subparsers(dest="mode")
    w = sub.add_parser("schreiben"); w.add_argument("--von", type=int); w.add_argument("--bis", type=int); w.add_argument("--batch", type=int, default=BATCH_DEFAULT); w.add_argument("--dry-run", action="store_true")
    fr = sub.add_parser("freigeben"); fr.add_argument("--nummern", default=""); fr.add_argument("--dry-run", action="store_true")
    t = sub.add_parser("taeglich"); t.add_argument("--date", default=""); t.add_argument("--dry-run", action="store_true")
    a = ap.parse_args(argv)
    try:
        if a.mode == "schreiben": return mode_schreiben(a.von, a.bis, a.dry_run, a.batch)
        if a.mode == "freigeben": return mode_freigeben(a.nummern, a.dry_run)
        if a.mode == "taeglich": return mode_taeglich(a.date.strip() or datetime.now(timezone.utc).date().isoformat(), a.dry_run)
        ap.print_help(); return 2
    except Stop as s:
        print(str(s)); return s.code


if __name__ == "__main__":
    sys.exit(main())
