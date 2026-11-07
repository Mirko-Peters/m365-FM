"""Neu geschriebene englische Show Notes (rewrite_shownotes.py): Speicher und Darstellung, ohne Netzwerk.
Speicher: data/shownotes_en/<bucket>.json.gz {slug: {h_src, v, notes, model, ts}}, bucket = erstes Hex-Zeichen von sha1(slug) (16 Dateien).
notes: {meta, summary, key_points[], chapters[{t, title}], entities[id], faq[{q, a}]} - reiner Text, Links setzt nur dieser Code (Entitaetsseiten)."""
import gzip, hashlib, html as _h, json, re
from pathlib import Path

DIR = Path(__file__).resolve().parent / "data" / "shownotes_en"
_CACHE = {}


def bucket(slug):
    return hashlib.sha1(slug.encode("utf-8")).hexdigest()[0]


def _path(b, d=None):
    return (d or DIR) / f"{b}.json.gz"


def load_bucket(b, d=None):
    p = _path(b, d)
    if not p.exists():
        return {}
    try:
        with gzip.open(p, "rt", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {}


def load_all(d=None):
    out = {}
    for b in "0123456789abcdef":
        out.update(load_bucket(b, d))
    return out


def save_all(store, d=None):
    """Schreibt alle 16 Buckets neu (stabile Reihenfolge, damit Git-Diffs klein bleiben); leere Buckets werden entfernt."""
    d = d or DIR; d.mkdir(parents=True, exist_ok=True)
    by = {}
    for slug, rec in store.items():
        by.setdefault(bucket(slug), {})[slug] = rec
    for b in "0123456789abcdef":
        p = _path(b, d)
        if b not in by:
            p.unlink(missing_ok=True); continue
        with open(p, "wb") as raw, gzip.GzipFile(fileobj=raw, mode="wb", mtime=0) as gz:
            gz.write(json.dumps(by[b], ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8"))


def get(slug):
    """Gespeicherte Notes einer Folge oder None (Zwischenspeicher je Prozess)."""
    b = bucket(slug)
    if b not in _CACHE:
        _CACHE[b] = load_bucket(b)
    rec = _CACHE[b].get(slug)
    return rec["notes"] if rec and rec.get("notes") else None


def esc(s):
    return _h.escape(str(s), quote=True)


def _links(ids, ents, base):
    out = []
    for i in ids:
        e = ents.get(i)
        if e and e.get("name"):
            out.append((e["name"], f"{base}/entity/{i}/"))
    return out


def html_for_translation(notes, ents, base, labels=None):
    """Schlanke HTML-Fassung der Notes (p, h2, h3, ul, li, a) als Quelle der Uebersetzung (translate_notes.py); Kapitelzeiten bleiben unveraendert."""
    L = labels or {}
    o = [f"<p><strong>{esc(notes['summary'])}</strong></p>"]
    if notes.get("key_points"):
        o.append(f"<h2>{esc(L.get('kp', 'Key points'))}</h2><ul>" + "".join(f"<li>{esc(x)}</li>" for x in notes["key_points"]) + "</ul>")
    if notes.get("chapters"):
        o.append(f"<h2>{esc(L.get('ch', 'In this episode'))}</h2><ul>" + "".join(f"<li>{esc(c['t'])} {esc(c['title'])}</li>" for c in notes["chapters"]) + "</ul>")
    if notes.get("faq"):
        o.append(f"<h2>{esc(L.get('faq', 'FAQ'))}</h2>" + "".join(f"<h3>{esc(x['q'])}</h3><p>{esc(x['a'])}</p>" for x in notes["faq"]))
    lk = _links(notes.get("entities") or [], ents, base)
    if lk:
        o.append(f"<p>{esc(L.get('topics', 'Topics'))}: " + ", ".join(f'<a href="{esc(u)}">{esc(n)}</a>' for n, u in lk) + "</p>")
    return "".join(o)


def render(notes, ents, base):
    """-> (kp_html, notes_html, faq_html, jsonld_list) im Aufbau der bisherigen Bloecke (Kernpunkte-Kasten, Notes, FAQ mit FAQPage)."""
    import site_notes as SNT
    import site_shownotes as SNS
    kp, faq_html, ld = SNT.sections(notes.get("key_points"), notes.get("faq"), "en")
    o = [f'<p class="sn-hook"><strong>{esc(notes["summary"])}</strong></p>']
    if notes.get("chapters"):
        o.append('<h2>In this episode</h2><ol class="sn-list sn-ch">' + "".join(f'<li><time class="sn-t">{esc(c["t"])}</time> {esc(c["title"])}</li>' for c in notes["chapters"]) + "</ol>")
    lk = _links(notes.get("entities") or [], ents, base)
    if lk:
        o.append('<p class="mut">Topics: ' + ", ".join(f'<a href="{esc(u)}">{esc(n)}</a>' for n, u in lk) + "</p>")
    return kp, '<section class="shownotes sn">' + "".join(o) + f"</section><style>{SNS.CSS}</style>", faq_html, ld


def choose(slug, ents, base, old):
    """Seitenbau: old = (nkp, nnotes, nfaq, nld) der bisherigen Show Notes. Gibt es neu geschriebene Notes, ersetzen sie Kernpunkte, Notes und FAQ;
    das FAQPage-Schema kommt dann genau einmal (aus den neuen Notes, das alte entfaellt). Ohne Eintrag bleibt old unveraendert.
    -> (nkp, nnotes, nfaq, nld, benutzt)"""
    nkp, nnotes, nfaq, nld = old
    n = get(slug)
    if not n:
        return nkp, nnotes, nfaq, nld, False
    kp, html, faq, ld = render(n, ents, base)
    if faq:
        nld = [x for x in nld if x.get("@type") != "FAQPage"] + ld
    else:
        faq = nfaq   # neue Notes ohne FAQ: bisherige FAQ samt Schema bleiben
    return kp or nkp, html, faq, nld, True
