"""Passende Sticky-Man-Videos zu den Leitfaeden des Lernpfads (data/pillars.json) - Zuordnung, Speicher und Karte "Passende Videos".

Zuordnung ohne KI: Titel, SEO-Texte (data/video_seo/en.json.gz), deutscher Titel, Beschreibung und Tags der Dub-Folge (episodes/<id>.json) und das deutsche
Transkript (transcripts/de/<id>.vtt) werden gegen die Muster des Leitfadens geprueft: "re" und "topics" aus data/pillars.json plus die Video-Muster
"rules" aus data/pillar_videos.json (englisch und deutsch). Gewichte: Treffer im Titel 4, in der Kurzbeschreibung 2, im uebrigen Text je Begriff 1
(hoechstens 3), im Transkript je Begriff mit mindestens 3 Nennungen 1 (hoechstens 2), +2 wenn der Fertigungsbezug schon im Titel steht.
Ein Video zaehlt nur, wenn alle drei Bedingungen gelten:
  - Fertigungsbezug: mindestens 2 verschiedene Konzepte aus "context" (Konzept -> Muster, englisch und deutsch in einem Muster; manufacturing und
    Fertigung sind EIN Konzept, Beugungsformen auch), davon mindestens eines im Titel oder in der Kurzbeschreibung oder 3-mal im Transkript.
    So wird ein Nebensatz "Beispiele aus Handel und Fertigung" in einem Copilot-Video kein Fertigungsbezug.
  - ein spezifischer Treffer: ein Muster aus "rules" oder ein Thema (Entitaet) des Leitfadens, nicht nur ein allgemeines Wort aus "re"
    (kpis, scheduling, lean, iot) - so wird "KPI" in einem Copilot-Video oder "Scheduling" in einem Teams-Shifts-Video kein Treffer.
  - mindestens "min_score" Punkte; lieber kein Video als ein unpassendes.

Speicher: data/pillar_videos.json
  {"max": 4, "min_score": 6, "context": {Konzept: Muster}, "rules": {pillar-id: {"en": Muster, "de": Muster, "not": Titelmuster, "ignore_topics": [...]}},
   "blocked": [video-id, ...], "pillars": {pillar-id: {"videos": [{"id", "score", "date", "title"} | {"id", "manual": true}], "blocked": [video-id, ...]}}}
Regeln (stabil, "einmalig"): Eintraege werden nie umsortiert oder entfernt. Neue Videos werden beim Seitenbau geprueft und nur angehaengt, solange
der Leitfaden weniger als "max" Eintraege hat; ein Video steht hoechstens bei einem Leitfaden. Von Hand: {"id": ..., "manual": true} steht immer
(auch ueber "max"); "blocked" je Leitfaden sperrt ein Video dort (es wird dort nicht angezeigt und nicht mehr zugeordnet, darf aber zu einem anderen
Leitfaden), "blocked" ganz oben sperrt es ueberall. Eine kaputte Datei (ungueltiges JSON) wird nicht ueberschrieben: der Bau meldet eine Warnung und
zeigt keine Karten. Der Seitenbau schreibt die Datei nur, wenn etwas angehaengt wurde; site.yml sichert sie im Schritt direkt nach generate_site.py.
Hand-Aenderungen nicht waehrend eines laufenden Seitenbaus committen: bei einem Konflikt verwirft der Bau seine neuen Treffer (der naechste Bau
rechnet sie auf der Hand-Fassung neu), die Hand-Fassung bleibt.

Kommandozeile (ohne Netz, ohne KI): python site_pillar_videos.py measure  -> Punkte je Leitfaden und Video, nichts wird geschrieben
                                    python site_pillar_videos.py assign   -> wie der Seitenbau: neue Treffer anhaengen und speichern"""
import gzip
import html as _html
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
FILE = ROOT / "data" / "pillar_videos.json"
W_TITLE, W_DESC, CAP_BODY, CAP_TR, TR_MIN, W_CTX, CTX_MIN = 4, 2, 3, 2, 3, 2, 2


# ---------- Daten ----------
def load(path=None, out=print):
    """Datei lesen. Fehlt sie oder ist sie kaputt, gibt es eine Warnung und ein leeres Dokument mit "_error": prepare() schreibt es dann nie zurueck
    (eine Hand-Aenderung mit Tippfehler darf nicht durch eine neu gerechnete Fassung ersetzt werden)."""
    f = Path(path or FILE)
    try:
        d = json.loads(f.read_text("utf-8"))
        if not isinstance(d, dict): raise ValueError("kein JSON-Objekt")
    except (OSError, ValueError) as ex:
        out(f"::warning::{f.name} nicht lesbar ({type(ex).__name__}: {ex}) - keine Karte 'Passende Videos', die Datei bleibt unveraendert")
        d = {"_error": str(ex)}
    d.setdefault("max", 4); d.setdefault("min_score", 6); d.setdefault("blocked", []); d.setdefault("pillars", {})
    d.setdefault("rules", {}); d.setdefault("context", {})
    return d


def save(doc, path=None):
    Path(path or FILE).write_text(json.dumps({k: v for k, v in doc.items() if k != "_error"}, ensure_ascii=False, indent=1) + "\n", "utf-8")


def _ids(x):
    """Liste von Video-IDs aus einem Hand-Eintrag (Liste oder einzelne ID)."""
    if isinstance(x, str): return {x}
    return {v for v in x if isinstance(v, str)} if isinstance(x, (list, tuple, set)) else set()


def _entries(d):
    """Eintraege eines Leitfadens als dicts: eine blosse ID ("abc") gilt als {"id": "abc"}, alles andere ohne ID wird uebergangen."""
    vs = d.get("videos") if isinstance(d, dict) else None
    out = []
    for e in vs if isinstance(vs, list) else []:
        if isinstance(e, str): e = {"id": e}
        if isinstance(e, dict) and isinstance(e.get("id"), str) and e["id"]: out.append(e)
    return out


def _pl(doc, pid):
    d = (doc.get("pillars") or {}).get(pid) if isinstance(doc.get("pillars"), dict) else None
    return d if isinstance(d, dict) else {}


def _rx(pat):
    return re.compile(f"(?<![\\w])(?:{pat})(?![\\w])", re.I) if pat else None


def _strip(h):
    return re.sub(r"\s+", " ", _html.unescape(re.sub(r"<[^>]+>", " ", h or ""))).strip()


def _vtt_text(vtt):
    return " ".join(ln.strip() for ln in (vtt or "").splitlines() if ln.strip() and "-->" not in ln and not ln.startswith(("WEBVTT", "NOTE")) and not ln.strip().isdigit())


_CACHE = {}


def texts(vid, root=ROOT):
    """Texte eines Videos je Ebene: title, desc, body (Listen von Strings) und tr (deutsches Transkript)."""
    if "seo" not in _CACHE:
        try: _CACHE["seo"] = json.load(gzip.open(root / "data" / "video_seo" / "en.json.gz", "rt", encoding="utf-8"))
        except (OSError, ValueError): _CACHE["seo"] = {}
        try: _CACHE["en"] = json.loads((root / "data" / "en_titles.json").read_text("utf-8"))
        except (OSError, ValueError): _CACHE["en"] = {}
    s = _CACHE["seo"].get(vid) or {}
    try: de = (json.loads((root / "episodes" / f"{vid}.json").read_text("utf-8")) or {}).get("de") or {}
    except (OSError, ValueError): de = {}
    dd = _strip(de.get("desc"))
    try: tr = _vtt_text((root / "transcripts" / "de" / f"{vid}.vtt").read_text("utf-8"))
    except OSError: tr = ""
    return {"title": [_CACHE["en"].get(vid) or "", s.get("t") or "", clean_title(de.get("title") or "")],
            "desc": [s.get("d") or "", dd[:400]],
            "body": [s.get("u") or "", " | ".join(str(c[1]) for c in s.get("c") or [] if isinstance(c, (list, tuple)) and len(c) > 1), de.get("tags") or "", dd[400:]],
            "tr": tr}


# ---------- Punkte ----------
def _hits(rxs, s):
    out = set()
    for r in rxs:
        if r: out |= {m.group(0).lower() for m in r.finditer(s or "")}
    return out


def _often(rxs, s):
    """Begriffe, die im Text mindestens TR_MIN-mal vorkommen."""
    n = {}
    for r in rxs:
        if r:
            for m in r.finditer(s or ""): n[m.group(0).lower()] = n.get(m.group(0).lower(), 0) + 1
    return {k for k, c in n.items() if c >= TR_MIN}


def _concepts(doc):
    """Fertigungskonzepte aus "context": {Konzept: Muster}. Jedes Konzept zaehlt einmal, egal in welcher Sprache und Form es vorkommt."""
    return [(k, _rx(v)) for k, v in sorted((doc.get("context") or {}).items()) if isinstance(v, str) and v]


def _ctx_in(cons, s, often=False):
    out = set()
    for k, r in cons:
        n = len(r.findall(s or ""))
        if n >= (TR_MIN if often else 1): out.add(k)
    return out


def _memo(fn):
    if not fn: return None
    m = {}
    def f(s):
        if s not in m: m[s] = list(fn(s))
        return m[s]
    return f


def score(p, tx, doc, ent_ids=None):
    """Punkte eines Videos fuer einen Leitfaden -> (punkte, gruende). tx: texts(); ent_ids(text) -> Entitaets-IDs (Themen des Leitfadens, optional)."""
    ru = (doc.get("rules") or {}).get(p["id"]) or {}
    rule_rx = [_rx(ru.get("en")), _rx(ru.get("de"))]
    rxs = [_rx(p.get("re"))] + rule_rx
    cons = _concepts(doc)
    topics = set(p.get("topics") or []) - set(ru.get("ignore_topics") or [])
    ts, ds, bs = (" · ".join(x for x in tx.get(k) or [] if x) for k in ("title", "desc", "body"))
    tr = tx.get("tr") or ""
    if _hits([_rx(ru.get("not"))], ts): return 0, ["ausgeschlossen (not)"]
    def lvl(s):
        h = _hits(rxs, s)
        if ent_ids and topics: h |= {"#" + t for t in set(ent_ids(s)) & topics}
        return h
    th, dh, bh, trh = lvl(ts), lvl(ds), lvl(bs), _often(rxs, tr)
    ck = ("_cx", tuple(r.pattern for _, r in cons))   # Fertigungskonzepte haengen nicht vom Leitfaden ab: einmal je Video und Regelstand
    if ck not in tx:
        t_ = _ctx_in(cons, ts)
        tx[ck] = (t_, t_ | _ctx_in(cons, ds) | _ctx_in(cons, tr, True), _ctx_in(cons, bs))
    ct, anchor, cb = tx[ck]   # im Titel; im Titel, in der Kurzbeschreibung oder 3-mal im Transkript; im uebrigen Text
    ctx = anchor | cb
    if len(ctx) < CTX_MIN or not anchor:
        return 0, ["kein Fertigungsbezug" + (f" ({', '.join(sorted(ctx))}{'' if anchor else ', nur im Text'})" if ctx else "")]
    spec = {h for h in th | dh | bh if h.startswith("#")} | _hits(rule_rx, " · ".join((ts, ds, bs))) | _often(rule_rx, tr)
    if not spec: return 0, ["nur allgemeine Begriffe (" + ", ".join(sorted(th | dh | bh | trh)) + ")" if th | dh | bh | trh else "kein Treffer"]
    sc = (W_TITLE if th else 0) + (W_DESC if dh else 0) + min(CAP_BODY, len(bh)) + min(CAP_TR, len(trh))
    if sc and ct: sc += W_CTX   # Fertigung steht schon im Titel
    why = [f"{k}: {', '.join(sorted(v))}" for k, v in (("Titel", th), ("Beschreibung", dh), ("Text", bh), ("Transkript", trh), ("Fertigung im Titel", ct)) if v]
    return sc, why


# ---------- Zuordnung (nur anhaengen) ----------
def taken(doc):
    """Video-IDs, die schon bei einem Leitfaden stehen (auch von Hand). Ein beim eigenen Leitfaden gesperrtes Video ist frei fuer andere Leitfaeden."""
    pls = doc.get("pillars") if isinstance(doc.get("pillars"), dict) else {}
    return {e["id"] for v in pls.values() for e in _entries(v) if e["id"] not in _ids(v.get("blocked") or [])}


def update(doc, pillars, videos, today, ent_ids=None, texts_fn=None, title_fn=None, out=print):
    """Prueft alle noch nicht zugeordneten Videos (videos: IDs mit Seite, aelteste zuerst) und haengt Treffer an. Bestehende Eintraege bleiben,
    wie sie sind. Vergeben wird nach Punkten (hoechste zuerst, bei Gleichstand das aeltere Video und der fruehere Leitfaden im Pfad); ein Video geht
    an den besten Leitfaden, der noch Platz hat (weniger als max angezeigte Eintraege, von Hand gesetzte zaehlen mit).
    Rueckgabe: [(pillar-id, video-id, punkte)] der neuen Eintraege in der Reihenfolge, in der sie angehaengt wurden."""
    if doc.get("_error"): return []
    if not isinstance(doc.get("pillars"), dict): out("::warning::pillar_videos.json: 'pillars' ist kein Objekt - nichts angehaengt"); return []
    pl = doc["pillars"]
    ok = []   # Leitfaeden, an die angehaengt werden kann (ein von Hand verbogener Eintrag wird nicht ersetzt, nur uebergangen)
    for p in pillars:
        d = pl.setdefault(p["id"], {"videos": [], "blocked": []})
        if not isinstance(d, dict) or not isinstance(d.setdefault("videos", []), list):
            out(f"::warning::pillar_videos.json: Eintrag '{p['id']}' hat kein gueltiges 'videos' - dort wird nichts angehaengt"); continue
        ok.append(p)
    mx, ms = int(doc.get("max") or 4), int(doc.get("min_score") or 6)
    gblock, used, added = _ids(doc.get("blocked") or []), taken(doc), []
    texts_fn, ent_ids = texts_fn or texts, _memo(ent_ids)   # Entitaeten je Text nur einmal (gleicher Text fuer alle Leitfaeden)
    cand = []
    for k, vid in enumerate(videos):
        if vid in used or vid in gblock: continue
        tx = texts_fn(vid)
        for i, p in enumerate(ok):
            if vid in _ids(pl[p["id"]].get("blocked") or []): continue
            s, _ = score(p, tx, doc, ent_ids)
            if s >= ms: cand.append((-s, k, i, vid, p["id"], s))
    for _, _, _, vid, pid, s in sorted(cand):
        if vid in used or len(shown(doc, pid)) >= mx: continue
        e = {"id": vid, "score": s, "date": today}
        t = title_fn(vid) if title_fn else ""
        if t: e["title"] = t
        pl[pid]["videos"].append(e); used.add(vid); added.append((pid, vid, s))
    return added


def shown(doc, pid):
    """Video-IDs, die der Leitfaden zeigt: Reihenfolge der Datei, ohne gesperrte, jede ID einmal."""
    d = _pl(doc, pid)
    bl = _ids(d.get("blocked") or []) | _ids(doc.get("blocked") or [])
    out = []
    for e in _entries(d):
        if e["id"] not in bl and e["id"] not in out: out.append(e["id"])
    return out


# ---------- Darstellung ----------
UI = {"en": ("Related videos", "Animated explainers from the Sticky Man Explained series on the topics of this guide.", "Video", "English"),
      "de": ("Passende Videos", "Animierte Erklärvideos aus der Reihe Sticky Man Explained zu den Themen dieses Leitfadens.", "Video", "Englisch"),
      "fr": ("Vidéos associées", "Vidéos explicatives animées de la série Sticky Man Explained sur les thèmes de ce guide.", "Vidéo", "anglais"),
      "es": ("Vídeos relacionados", "Vídeos explicativos animados de la serie Sticky Man Explained sobre los temas de esta guía.", "Vídeo", "inglés"),
      "it": ("Video correlati", "Video esplicativi animati della serie Sticky Man Explained sui temi di questa guida.", "Video", "inglese"),
      "nl": ("Bijpassende video's", "Geanimeerde uitlegvideo's uit de reeks Sticky Man Explained over de onderwerpen van deze gids.", "Video", "Engels"),
      "pt": ("Vídeos relacionados", "Vídeos explicativos animados da série Sticky Man Explained sobre os temas deste guia.", "Vídeo", "inglês"),
      "pl": ("Powiązane filmy", "Animowane filmy objaśniające z serii Sticky Man Explained na tematy tego przewodnika.", "Film", "angielski"),
      "id": ("Video terkait", "Video penjelasan animasi dari seri Sticky Man Explained tentang topik panduan ini.", "Video", "Inggris"),
      "ru": ("Подходящие видео", "Анимированные видео-объяснения из серии Sticky Man Explained по темам этого руководства.", "Видео", "английский"),
      "uk": ("Відповідні відео", "Анімовані відео-пояснення із серії Sticky Man Explained на теми цього посібника.", "Відео", "англійська"),
      "ar": ("مقاطع فيديو ذات صلة", "فيديوهات شرح متحركة من سلسلة Sticky Man Explained حول موضوعات هذا الدليل.", "فيديو", "الإنجليزية"),
      "he": ("סרטונים קשורים", "סרטוני הסבר מונפשים מהסדרה Sticky Man Explained בנושאי המדריך הזה.", "סרטון", "אנגלית"),
      "ja": ("関連動画", "このガイドのテーマを扱うアニメーション解説シリーズ「Sticky Man Explained」の動画です。", "動画", "英語"),
      "ko": ("관련 동영상", "이 가이드의 주제를 다루는 애니메이션 해설 시리즈 Sticky Man Explained의 동영상입니다.", "동영상", "영어")}

CSS = """<style>
.pl-vids{margin:2em 0}.pl-vgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(13em,1fr));gap:1em;margin:.8em 0 0;padding:0;list-style:none}
.pl-vgrid li{margin:0}.pl-vgrid a{display:block;text-decoration:none;color:inherit;border:1px solid var(--bd,#ccd);border-radius:.5em;overflow:hidden;height:100%}
.pl-vgrid a:hover,.pl-vgrid a:focus-visible{border-color:var(--ac,#0a6)}
.pl-vth{display:block;aspect-ratio:16/9;background:rgba(120,140,150,.16);overflow:hidden}.pl-vth img{display:block;width:100%;height:100%;object-fit:cover}
.pl-vgrid b{display:block;padding:.5em .7em .2em;line-height:1.3;font-size:.95em}.pl-vgrid small{display:block;padding:0 .7em .6em;color:var(--mut,#667)}
</style>"""


def ui(lang):
    return UI.get(lang) or UI["en"]


def esc(s):
    return _html.escape(str(s or ""), quote=True)


def thumb(vid, r2map, dims=None):
    """Vorschaubild aus dem eigenen Bucket (img.m365.fm, wie die Videolisten nach site_r2.rewrite): 16:9, feste Masse, lazy. Ohne kopiertes Bild
    leer (die Karte zeigt dann eine Flaeche gleicher Groesse, kein Bild von i.ytimg.com)."""
    mq, hq = (r2map.get(f"https://i.ytimg.com/vi/{vid}/{n}.jpg") for n in ("mqdefault", "hqdefault"))
    ok = lambda u: isinstance(u, str) and u.startswith("https://img.m365.fm/")
    src = mq if ok(mq) else (hq if ok(hq) else None)
    if not src: return ""
    w, h = ((dims or {}).get(src) or [320, 180])[:2] if src == mq else (480, 360)
    ss = ", ".join(f"{u} {x}w" for u, x in ((mq, 320), (hq, 480)) if ok(u))
    return f'<img src="{src}" srcset="{ss}" sizes="(max-width:700px) 92vw, 14em" alt="" width="{int(w)}" height="{int(h)}" loading="lazy" decoding="async">'


def pick(vid, lang, pages):
    """Videoseite in der Sprache der Seite, sonst die englische, sonst das Video auf YouTube (Schluessel "yt", englischer Originaltitel).
    pages: vid -> {sprache: (url, titel)}. -> (url, titel, sprache oder "yt") oder None."""
    pg = pages.get(vid) or {}
    for l in (lang, "en", "yt"):
        if pg.get(l) and pg[l][0]: return pg[l][0], clean_title(pg[l][1]), l
    return None


def items(doc, pid, lang, pages):
    out = []
    for vid in shown(doc, pid):
        x = pick(vid, lang, pages)
        if x: out.append((vid,) + x)
    return out


def _attrs(l, lang):
    """Linkattribute: andere Sprache kennzeichnen; YouTube (fremde Seite, englisches Original) mit rel=noopener."""
    if l == "yt": return ' rel="noopener"' + ('' if lang == "en" else ' lang="en" hreflang="en"')
    return f' lang="{l}" hreflang="{l}"' if l != lang else ""


def _vid(vid, mark):
    """data-vid fuer den Lernfortschritt (assets/learnprogress.js: Klick auf die Karte = "geoeffnet"); mark=False: HTML wie vor dem 26.11.2026."""
    return f' data-vid="{esc(vid)}"' if mark else ""


def card(doc, pid, lang, pages, r2map, dims=None, mark=False):
    """Abschnitt "Passende Videos" eines Leitfadens; leer ohne Video mit Seite."""
    its = items(doc, pid, lang, pages)
    if not its: return ""
    h, lead, kind, en = ui(lang)
    li = ""
    for vid, u, t, l in its:
        li += (f'<li><a href="{u}"{_attrs(l, lang)}{_vid(vid, mark)}><span class="pl-vth">{thumb(vid, r2map, dims)}</span><b>{esc(t)}</b>'
               f'<small>{esc("YouTube" if l == "yt" else kind)}{" · " + esc(en) if l != lang and lang != "en" else ""}</small></a></li>')
    return f'{CSS}<section class="pl-vids" id="videos"><h2>{esc(h)}</h2><p class="mut">{esc(lead)}</p><ul class="pl-vgrid">{li}</ul></section>'


def path_line(doc, pid, lang, pages, mark=False):
    """Kurze Zeile fuer die Karte des Leitfadens auf der Pfadseite (nur Links, ohne Bilder)."""
    its = items(doc, pid, lang, pages)
    if not its: return ""
    return (f'<p class="mut pl-vline">{esc(ui(lang)[0])}: ' + " · ".join(f'<a href="{u}"{_attrs(l, lang)}{_vid(v, mark)}>{esc(t)}</a>' for v, u, t, l in its) + "</p>")


def ld_refs(doc, pid, lang, pages, has_ld):
    """Verweise fuer Article.video: nur @id der VideoObject-Knoten, die die Videoseite selbst definiert (has_ld(url)) - keine zweite Beschreibung desselben Videos."""
    return [{"@id": u + "#video"} for _, u, _, l in items(doc, pid, lang, pages) if l != "yt" and has_ld(u)]


def pages_index(dubs, orig, orig_t, by_slug, en_titles):
    """Videoseiten je Video fuer die Karte: vid -> {sprache: (url, titel)}.
    dubs: [(vid, sprache, url, titel)] der Dub-Folgenseiten; orig: vid -> Slug der englischen Folge der Hauptshow (Zuordnung ueber den Titel),
    by_slug: Slug -> Folge der Hauptshow ({"url", "e": {"title"}, "yt"}), en_titles: vid -> englischer Originaltitel.
    Englisch gilt die Folge der Hauptshow nur, wenn sie genau dieses Video zeigt ("yt" = vid) - sonst waere die Karte "Video" eine Audio-Folge
    oder ein anderes Video; dann (und ganz ohne englische Folge) verlinkt die Karte das Video auf YouTube mit seinem englischen Originaltitel ("yt")."""
    pages = {}
    for vid, lang, u, t in dubs: pages.setdefault(vid, {})[lang] = (u, t)
    for vid, sl in (orig or {}).items():
        it = (by_slug or {}).get(sl)
        if it and it.get("yt") == vid and it.get("url"):
            pages.setdefault(vid, {})["en"] = (it["url"], (orig_t or {}).get(vid) or (it.get("e") or {}).get("title") or "")
    for vid in pages:
        if (en_titles or {}).get(vid): pages[vid]["yt"] = (f"https://www.youtube.com/watch?v={vid}", en_titles[vid])
    return pages


def _summary(add, titles, out):
    """Neue automatische Treffer zusaetzlich in der Zusammenfassung des Laufs ($GITHUB_STEP_SUMMARY), damit Mirko sie sieht und notfalls sperrt."""
    import os
    f = os.environ.get("GITHUB_STEP_SUMMARY")
    if not add or not f: return
    try:
        with open(f, "a", encoding="utf-8") as h:
            h.write("### Passende Lernpfad-Videos: neu zugeordnet\n\n" + "".join(f"- `{pid}`: [{titles.get(vid) or vid}](https://www.youtube.com/watch?v={vid}) ({s} Punkte)\n" for pid, vid, s in add)
                    + "\nSperren: Video-ID in `pillars.<leitfaden>.blocked` von `data/pillar_videos.json` eintragen.\n\n")
    except OSError as ex: out(f"Passende Videos: Zusammenfassung nicht geschrieben ({ex})")


def prepare(doc, pillars, pages, dates, today, ent_ids=None, ld_urls=(), r2map=None, dims=None, out=print, path=None):
    """Seitenbau: neue Videos pruefen und anhaengen (Datei nur bei Aenderung schreiben), dann den Kontext fuer site_pillars.build.
    pages: vid -> {sprache: (url, titel)} aller Videos mit Seite; dates: vid -> Datum (aelteste zuerst geprueft). Kaputte Datei (doc["_error"]): nichts."""
    if doc.get("_error"):
        out("Passende Videos: Datei nicht lesbar, keine Karten (" + str(doc["_error"]) + ")")
        return None
    order = sorted(pages, key=lambda v: (dates.get(v) or "9999", v))
    tit = lambda v: clean_title((pages[v].get("en") or pages[v].get("de") or next(iter(pages[v].values())))[1])
    add = update(doc, pillars, order, today, ent_ids, title_fn=tit, out=out)
    if add:
        try: save(doc, path)
        except OSError as ex: out(f"::warning::Passende Videos: Datei nicht gespeichert ({ex})")
        _summary(add, {v: tit(v) for _, v, _ in add}, out)
    out(f"Passende Videos: {len(add)} neu zugeordnet" + "".join(f"; {pid} + {vid} ({s})" for pid, vid, s in add) + " | je Leitfaden: " + ", ".join(f"{p['id']} {len(shown(doc, p['id']))}" for p in pillars))
    return {"doc": doc, "pages": pages, "ld": set(ld_urls), "r2": r2map or {}, "dims": dims or {}}


# ---------- Kommandozeile ----------
def _all_videos(root=ROOT):
    """Alle Sticky-Man-Videos (data/videos.json und episodes/*.json), aelteste zuerst (Datum aus videos.json, dann ID)."""
    try: v = json.loads((root / "data" / "videos.json").read_text("utf-8"))
    except (OSError, ValueError): v = {}
    ids = set(v) | {p.stem for p in (root / "episodes").glob("*.json")}
    return sorted(ids, key=lambda x: ((v.get(x) or {}).get("date") or "9999", x))


# Zusaetze der Dub-Titel ("Titel (KI-Synchronfassung)"), wie site_meta_podcast.DUB_LABELS, dazu die indischen Sprachen der Dub-Dateien
_DUBS = ("KI-Synchronfassung", "Doblaje IA", "Doublage IA", "Doppiaggio IA", "Dublagem IA", "AI-nasynchronisatie", "Dubbing AI", "Sulih Suara AI", "ИИ-дубляж",
         "ШІ-дубляж", "دبلجة بالذكاء الاصطناعي", "דיבוב AI", "AI吹き替え", "AI 더빙", "AI डबिंग", "AI ഡബ്ബിംഗ്", "AI டப்பிங்", "AI డబ్బింగ్", "AI ਡਬਿੰਗ")
_DUB_RX = re.compile(r"\s*[（(]\s*(?:" + "|".join(re.escape(x) for x in _DUBS) + r")\s*[)）]\s*$", re.I)


def clean_title(t):
    """Titel ohne Dub-Zusatz am Ende ("(KI-Synchronfassung)", "(Doublage IA)", "（AI吹き替え）") und ohne doppelte Leerzeichen; andere Klammern
    ("(Part 2)", "(Preview)") bleiben."""
    return re.sub(r"\s+", " ", _DUB_RX.sub("", _strip(t))).strip()


def _title(vid):
    tx = texts(vid)
    return clean_title(next((t for t in tx["title"] if t), vid))


def _ents():
    try:
        import site_learn as LRN, site_entmatch as EM
        m = EM.shared(LRN.ENTS)
        return lambda s: list(m.ids(s, "en", set()))
    except Exception as ex:   # ohne Entitaeten zaehlen nur die Muster
        print("Entitaeten nicht geladen:", ex); return None


def main(argv):
    from datetime import date
    import site_pillars as PIL
    cmd = argv[1] if len(argv) > 1 else "measure"
    doc, pills, ent = load(), PIL.order(), _memo(_ents())
    if doc.get("_error"): return 1
    try: pub = {k.split(":")[0] for k in json.loads((ROOT / "data" / "published.json").read_text("utf-8"))}
    except (OSError, ValueError): pub = set()
    vids = [v for v in _all_videos() if v in pub]   # nur Videos mit Folgenseite (wie im Seitenbau)
    if cmd == "measure":
        n_any = 0
        for vid in vids:
            tx = texts(vid); row = []
            for p in pills:
                s, why = score(p, tx, doc, ent)
                if s > 0: row.append((s, p["id"], why))
            if row:
                n_any += any(s >= int(doc["min_score"]) for s, _, _ in row)
                print(vid, _title(vid)[:80]); [print(f"   {s:2d} {pid}: {'; '.join(w)}") for s, pid, w in sorted(row, reverse=True)]
        print(f"{len(vids)} Videos, {n_any} mit mindestens {doc['min_score']} Punkten bei einem Leitfaden")
    elif cmd == "assign":
        add = update(doc, pills, vids, date.today().isoformat(), ent, title_fn=_title)
        if add: save(doc)
        for pid, vid, s in add: print(f"+ {pid}: {vid} ({s} Punkte) {_title(vid)}")
        print(f"{len(add)} neu zugeordnet")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
