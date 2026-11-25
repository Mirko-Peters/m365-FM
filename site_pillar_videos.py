"""Passende Sticky-Man-Videos zu den Leitfaeden des Lernpfads (data/pillars.json) - Zuordnung, Speicher und Karte "Passende Videos".

Zuordnung ohne KI: Titel, SEO-Texte (data/video_seo/en.json.gz), deutscher Titel, Beschreibung und Tags der Dub-Folge (episodes/<id>.json) und das deutsche
Transkript (transcripts/de/<id>.vtt) werden gegen die Muster des Leitfadens geprueft: "re" und "topics" aus data/pillars.json plus die Video-Muster
"rules" aus data/pillar_videos.json (englisch und deutsch). Gewichte: Treffer im Titel 4, in der Kurzbeschreibung 2, im uebrigen Text je Begriff 1
(hoechstens 2), im Transkript je Begriff mit mindestens 3 Nennungen 1 (hoechstens 2). Ein Video zaehlt nur mit Fertigungsbezug ("context": z. B.
manufacturing, shop floor, Fertigung, Instandhaltung) - so wird "lean" in einem SharePoint-Video oder "KPI" in einem Copilot-Video kein Treffer.
Aufgenommen wird ab "min_score" Punkten; lieber kein Video als ein unpassendes.

Speicher: data/pillar_videos.json
  {"max": 4, "min_score": 6, "context": {"en": Muster, "de": Muster}, "rules": {pillar-id: {"en": Muster, "de": Muster}}, "blocked": [video-id, ...],
   "pillars": {pillar-id: {"videos": [{"id", "score", "date", "title"} | {"id", "manual": true}], "blocked": [video-id, ...]}}}
Regeln (stabil, "einmalig"): Eintraege werden nie umsortiert oder entfernt. Neue Videos werden beim Seitenbau geprueft und nur angehaengt, solange
der Leitfaden weniger als "max" Eintraege hat; ein Video steht hoechstens bei einem Leitfaden. Von Hand: {"id": ..., "manual": true} steht immer
(auch ueber "max"), "blocked" (je Leitfaden oder global) sperrt ein Video - es wird nicht mehr zugeordnet und nicht angezeigt.
Der Seitenbau schreibt die Datei nur, wenn etwas angehaengt wurde; site.yml sichert sie mit den uebrigen Daten des Baus.

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
def load(path=None):
    try: d = json.loads(Path(path or FILE).read_text("utf-8"))
    except (OSError, ValueError): d = {}
    d.setdefault("max", 4); d.setdefault("min_score", 6); d.setdefault("blocked", []); d.setdefault("pillars", {})
    d.setdefault("rules", {}); d.setdefault("context", {})
    return d


def save(doc, path=None):
    Path(path or FILE).write_text(json.dumps(doc, ensure_ascii=False, indent=1) + "\n", "utf-8")


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
    return {"title": [_CACHE["en"].get(vid) or "", s.get("t") or "", re.sub(r"\s*\(KI-Synchronfassung\)\s*$", "", de.get("title") or "")],
            "desc": [s.get("d") or "", dd[:400]],
            "body": [s.get("u") or "", " | ".join(str(c[1]) for c in s.get("c") or [] if isinstance(c, (list, tuple)) and len(c) > 1), de.get("tags") or "", dd[400:]],
            "tr": tr}


# ---------- Punkte ----------
def _hits(rxs, s):
    out = set()
    for r in rxs:
        if r: out |= {m.group(0).lower() for m in r.finditer(s or "")}
    return out


def score(p, tx, doc, ent_ids=None):
    """Punkte eines Videos fuer einen Leitfaden -> (punkte, gruende). tx: texts(); ent_ids(text) -> Entitaets-IDs (Themen des Leitfadens, optional)."""
    ru = (doc.get("rules") or {}).get(p["id"]) or {}
    rxs = [_rx(p.get("re")), _rx(ru.get("en")), _rx(ru.get("de"))]
    cx = doc.get("context") or {}
    crx = [_rx(cx.get("en")), _rx(cx.get("de"))]
    topics = set(p.get("topics") or []) - set(ru.get("ignore_topics") or [])
    ts, ds, bs = (" · ".join(x for x in tx.get(k) or [] if x) for k in ("title", "desc", "body"))
    tr = tx.get("tr") or ""
    if _hits([_rx(ru.get("not"))], ts): return 0, ["ausgeschlossen (not)"]
    def lvl(s):
        h = _hits(rxs, s)
        if ent_ids and topics: h |= {"#" + t for t in set(ent_ids(s)) & topics}
        return h
    def often(r_list, s):
        n = {}
        for r in r_list:
            if r:
                for m in r.finditer(s): n[m.group(0).lower()] = n.get(m.group(0).lower(), 0) + 1
        return {k for k, c in n.items() if c >= TR_MIN}
    th, dh, bh, trh = lvl(ts), lvl(ds), lvl(bs), often(rxs, tr)
    ct = _hits(crx, ts)
    ctx = _hits(crx, " · ".join((ts, ds, bs))) | often(crx, tr)
    if len(ctx) < CTX_MIN: return 0, ["kein Fertigungsbezug" + (f" ({', '.join(sorted(ctx))})" if ctx else "")]
    sc = (W_TITLE if th else 0) + (W_DESC if dh else 0) + min(CAP_BODY, len(bh)) + min(CAP_TR, len(trh))
    if sc and ct: sc += W_CTX   # Fertigung steht schon im Titel
    why = [f"{k}: {', '.join(sorted(v))}" for k, v in (("Titel", th), ("Beschreibung", dh), ("Text", bh), ("Transkript", trh), ("Fertigung im Titel", ct)) if v]
    return sc, why


# ---------- Zuordnung (nur anhaengen) ----------
def taken(doc):
    """Video-IDs, die schon bei einem Leitfaden stehen (auch von Hand)."""
    return {e.get("id") for v in (doc.get("pillars") or {}).values() for e in v.get("videos") or []}


def update(doc, pillars, videos, today, ent_ids=None, texts_fn=None, title_fn=None):
    """Prueft alle noch nicht zugeordneten Videos (videos: IDs mit Seite, aelteste zuerst) und haengt Treffer an. Bestehende Eintraege bleiben,
    wie sie sind. Vergeben wird nach Punkten (hoechste zuerst, bei Gleichstand das aeltere Video und der fruehere Leitfaden im Pfad); ein Video geht
    an den besten Leitfaden, der noch Platz hat (weniger als max angezeigte Eintraege, von Hand gesetzte zaehlen mit).
    Rueckgabe: [(pillar-id, video-id, punkte)] der neuen Eintraege in der Reihenfolge, in der sie angehaengt wurden."""
    pl = doc.setdefault("pillars", {})
    for p in pillars: pl.setdefault(p["id"], {"videos": [], "blocked": []})
    mx, ms = int(doc.get("max") or 4), int(doc.get("min_score") or 6)
    gblock, used, added = set(doc.get("blocked") or []), taken(doc), []
    texts_fn = texts_fn or texts
    cand = []
    for k, vid in enumerate(videos):
        if vid in used or vid in gblock: continue
        tx = texts_fn(vid)
        for i, p in enumerate(pillars):
            if vid in set(pl[p["id"]].get("blocked") or []): continue
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
    d = (doc.get("pillars") or {}).get(pid) or {}
    bl = set(d.get("blocked") or []) | set(doc.get("blocked") or [])
    out = []
    for e in d.get("videos") or []:
        v = e.get("id")
        if v and v not in bl and v not in out: out.append(v)
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


def card(doc, pid, lang, pages, r2map, dims=None):
    """Abschnitt "Passende Videos" eines Leitfadens; leer ohne Video mit Seite."""
    its = items(doc, pid, lang, pages)
    if not its: return ""
    h, lead, kind, en = ui(lang)
    li = ""
    for vid, u, t, l in its:
        li += (f'<li><a href="{u}"{_attrs(l, lang)}><span class="pl-vth">{thumb(vid, r2map, dims)}</span><b>{esc(t)}</b>'
               f'<small>{esc("YouTube" if l == "yt" else kind)}{" · " + esc(en) if l != lang and lang != "en" else ""}</small></a></li>')
    return f'{CSS}<section class="pl-vids" id="videos"><h2>{esc(h)}</h2><p class="mut">{esc(lead)}</p><ul class="pl-vgrid">{li}</ul></section>'


def path_line(doc, pid, lang, pages):
    """Kurze Zeile fuer die Karte des Leitfadens auf der Pfadseite (nur Links, ohne Bilder)."""
    its = items(doc, pid, lang, pages)
    if not its: return ""
    return (f'<p class="mut pl-vline">{esc(ui(lang)[0])}: ' + " · ".join(f'<a href="{u}"{_attrs(l, lang)}>{esc(t)}</a>' for _, u, t, l in its) + "</p>")


def ld_refs(doc, pid, lang, pages, has_ld):
    """Verweise fuer Article.video: nur @id der VideoObject-Knoten, die die Videoseite selbst definiert (has_ld(url)) - keine zweite Beschreibung desselben Videos."""
    return [{"@id": u + "#video"} for _, u, _, l in items(doc, pid, lang, pages) if l != "yt" and has_ld(u)]


def prepare(doc, pillars, pages, dates, today, ent_ids=None, ld_urls=(), r2map=None, dims=None, out=print, path=None):
    """Seitenbau: neue Videos pruefen und anhaengen (Datei nur bei Aenderung schreiben), dann den Kontext fuer site_pillars.build.
    pages: vid -> {sprache: (url, titel)} aller Videos mit Seite; dates: vid -> Datum (aelteste zuerst geprueft)."""
    order = sorted(pages, key=lambda v: (dates.get(v) or "9999", v))
    add = update(doc, pillars, order, today, ent_ids, title_fn=lambda v: clean_title((pages[v].get("en") or pages[v].get("de") or next(iter(pages[v].values())))[1]))
    if add:
        try: save(doc, path)
        except OSError as ex: out(f"Passende Videos: Datei nicht gespeichert ({ex})")
    out(f"Passende Videos: {len(add)} neu zugeordnet" + "".join(f"; {pid} + {vid} ({s})" for pid, vid, s in add) + " | je Leitfaden: " + ", ".join(f"{p['id']} {len(shown(doc, p['id']))}" for p in pillars))
    return {"doc": doc, "pages": pages, "ld": set(ld_urls), "r2": r2map or {}, "dims": dims or {}}


# ---------- Kommandozeile ----------
def _all_videos(root=ROOT):
    """Alle Sticky-Man-Videos (data/videos.json und episodes/*.json), aelteste zuerst (Datum aus videos.json, dann ID)."""
    try: v = json.loads((root / "data" / "videos.json").read_text("utf-8"))
    except (OSError, ValueError): v = {}
    ids = set(v) | {p.stem for p in (root / "episodes").glob("*.json")}
    return sorted(ids, key=lambda x: ((v.get(x) or {}).get("date") or "9999", x))


def clean_title(t):
    """Titel ohne Zusatz in Klammern am Ende ("(KI-Synchronfassung)", "(Doublage IA)", "（AI吹き替え）") und ohne doppelte Leerzeichen."""
    return re.sub(r"\s+", " ", re.sub(r"\s*[(（][^()（）]*[)）]\s*$", "", _strip(t))).strip()


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
    doc, pills, ent = load(), PIL.order(), _ents()
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
