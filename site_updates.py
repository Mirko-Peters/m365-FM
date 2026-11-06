"""Microsoft-Produktupdates je Entitaet. Quelle: data/product_updates.json (fetch_ms_updates.py, offizielle Release-Communications-Schnittstellen mit Produkt-Tags).
Kein Link auf Microsoft-Seiten: das neueste Update steht direkt sichtbar auf der Entitaet, aeltere klappen per Klick auf."""
import json
from pathlib import Path
from datetime import datetime
from site_i18n import T
from site_learn import esc

BY = {}      # eid -> Liste (neueste zuerst)
ALL = []
_F = Path(__file__).parent / "data" / "product_updates.json"
ST_DE = {"In development": "In Entwicklung", "Rolling out": "Wird ausgerollt", "Launched": "Eingeführt", "Cancelled": "Eingestellt", "In preview": "In der Vorschau",
         "Available": "Verfügbar", "Generally available": "Allgemein verfügbar", "Planned": "Geplant"}
CSS = ("<style>.en-upd{margin:1.6rem 0}.en-upd .u-new{border:1px solid var(--bd,#1412101f);border-left:4px solid var(--acc,#3b6391);border-radius:12px;padding:.9rem 1.1rem;margin:.6rem 0 .8rem}"
       ".en-upd .u-meta{display:flex;flex-wrap:wrap;gap:.4rem .7rem;font-size:.8rem;color:var(--mut,#6b645c);align-items:center}.en-upd .u-st{border:1px solid currentColor;border-radius:99px;padding:0 .55rem}"
       ".en-upd .u-new h3{margin:.35rem 0 .4rem;font-size:1.05rem}.en-upd .u-new p{margin:.3rem 0;white-space:pre-line}.en-upd .u-when{font-size:.85rem;color:var(--mut,#6b645c)}"
       ".en-upd details.u-more>summary{cursor:pointer;font-weight:600;padding:.4rem 0}.en-upd details.u-it{border-top:1px solid var(--bd,#1412101f);padding:.1rem 0}"
       ".en-upd details.u-it>summary{cursor:pointer;padding:.45rem 0;list-style:none}.en-upd details.u-it>summary::before{content:\"▸ \";color:var(--mut,#6b645c)}.en-upd details.u-it[open]>summary::before{content:\"▾ \"}"
       ".en-upd details.u-it>div{padding:0 0 .7rem 1rem}.en-upd details.u-it p{margin:.2rem 0;white-space:pre-line}</style>")


def load(api=None):
    BY.clear(); ALL.clear()
    if not _F.exists():
        return
    import site_text as STX
    for u in STX.fix_tree(json.loads(_F.read_text("utf-8")).get("items", [])):   # Microsoft-Feeds liefern teils Mojibake (check_encoding)
        ALL.append(u)
        for e in u.get("eids", []):
            BY.setdefault(e, []).append(u)


def day(s, lang="en"):
    try:
        d = datetime.strptime(s[:10], "%Y-%m-%d")
        return d.strftime("%d.%m.%Y") if lang == "de" else d.strftime("%Y-%m-%d")
    except Exception:
        return s or ""


def _status(u, lang):
    s = u.get("status") or ""
    return ST_DE.get(s, s) if lang == "de" else s


def _meta(u, lang):
    parts = [f'<time datetime="{esc(u["modified"])}">{esc(day(u["modified"], lang))}</time>']
    st = _status(u, lang)
    if st: parts.append(f'<span class="u-st">{esc(st)}</span>')
    parts.append(esc(u.get("src", "")))
    return " ".join(f'<span>{p}</span>' if not p.startswith("<") else p for p in parts)


def _body(u, lang):
    d = "".join(f"<p>{esc(x)}</p>" for x in (u.get("desc") or "").split("\n") if x.strip())
    w = f'<p class="u-when">{esc(u["when"])}</p>' if u.get("when") else ""
    return d + w


def block(lang, eid, n=14):
    it = BY.get(eid, [])[:n]
    if not it:
        return ""
    first, rest = it[0], it[1:]
    new = f'<div class="u-new"><div class="u-meta">{_meta(first, lang)}</div><h3>{esc(first["title"])}</h3>{_body(first, lang)}</div>'
    more = ""
    if rest:
        li = "".join(f'<details class="u-it"><summary><span class="u-meta">{_meta(u, lang)}</span> {esc(u["title"])}</summary><div>{_body(u, lang)}</div></details>' for u in rest)
        more = f'<details class="u-more"><summary>{esc(T(lang, "Older updates", "Ältere Updates"))} ({len(rest)})</summary>{li}</details>'
    note = f'<p class="mut">{esc(T(lang, "Summaries of official Microsoft release information, checked daily.", "Zusammenfassungen offizieller Microsoft-Release-Informationen, täglich geprüft."))}</p>'
    return f'{CSS}<section class="en-upd"><h2>{esc(T(lang, "Latest update", "Neuestes Update"))}</h2>{new}{more}{note}</section>'

