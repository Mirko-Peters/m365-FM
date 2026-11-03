"""Erwaehnungen in fremden Medien (data/press_mentions.json): Liste fuer das Pressekit, Quellen und schema.org subjectOf fuer Entitaeten."""
import html, json
from pathlib import Path

ROOT = Path(__file__).parent
E = lambda s: html.escape(s or "", quote=True)
try:
    ALL = sorted(json.loads((ROOT / "data" / "press_mentions.json").read_text("utf-8")).get("mentions", []), key=lambda m: m.get("date", ""), reverse=True)
except Exception:
    ALL = []


def for_entity(eid):
    return [m for m in ALL if eid in (m.get("about") or [])]


def ld(m, BASE=None):
    """Die Erwaehnung als CreativeWork (fuer subjectOf der Person bzw. das Pressekit)."""
    n = {"@type": "CreativeWork", "name": m["title"], "url": m["url"], "datePublished": m.get("date", ""),
         "publisher": {"@type": "Organization", "name": m.get("publisher") or m.get("outlet", "")}}
    if m.get("author"): n["author"] = {"@type": "Person", "name": m["author"]}
    if BASE and m.get("about"): n["about"] = [{"@id": f"{BASE}/entity/{x}/#entity"} for x in m["about"]]
    if (m.get("work") or {}).get("url"): n["mentions"] = {"@type": "CreativeWork", "name": m["work"].get("title", ""), "url": m["work"]["url"]}
    return n


def item_html(m, lang):
    """Ein Listeneintrag: Titel (Link), Medium und Datum, Hinweis, genannter Beitrag."""
    note = (m.get("note") or {}).get(lang) or (m.get("note") or {}).get("en", "")
    w = m.get("work") or {}
    lbl = "Genannter Beitrag" if lang == "de" else "Featured work"
    return (f'<li><a href="{E(m["url"])}" rel="noopener">{E(m["title"])}</a> <span class="mut">· {E(m.get("outlet", ""))} · <time datetime="{E(m.get("date", ""))}">{E(m.get("date", ""))}</time></span>'
            + (f"<br>{E(note)}" if note else "")
            + (f'<br><span class="mut">{lbl}:</span> <a href="{E(w["url"])}">{E(w.get("title") or w["url"])}</a>' if w.get("url") else "") + "</li>")


def src_li(lang, eid):
    """Zeilen fuer den Quellen-Block einer Entitaetsseite."""
    lab = "Erwähnt in" if lang == "de" else "Mentioned in"
    return "".join(f'<li>{lab}: <a href="{E(m["url"])}" rel="noopener">{E(m["title"])}</a> ({E(m.get("outlet", ""))}, <time datetime="{E(m.get("date", ""))}">{E(m.get("date", ""))}</time>)</li>' for m in for_entity(eid))
