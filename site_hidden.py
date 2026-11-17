"""Ausgeblendete Entitaeten (data/entity_hidden.json, "ids"): eine Quelle fuer Seitenbau, Gaeste-/Speaker-Erzeugung, Weiterleitungen und Werkzeuge.
Absichtlich ohne Abhaengigkeit von site_learn/site_podpage (die importieren dieses Modul; site_learn laedt beim Import schon alle Entitaeten)."""
import json
from pathlib import Path

FILE = Path(__file__).parent / "data" / "entity_hidden.json"
_CACHE = {}


def ids():
    """Menge der ausgeblendeten Entitaets-ids (leer, wenn die Datei fehlt oder defekt ist). Je Datei-Zeitstempel einmal gelesen."""
    try:
        st = FILE.stat().st_mtime_ns
    except OSError:
        return frozenset()
    if _CACHE.get("t") != (str(FILE), st):
        try:
            raw = json.loads(FILE.read_text("utf-8")).get("ids") or []
        except (OSError, ValueError, AttributeError):
            raw = []
        _CACHE["t"] = (str(FILE), st)
        _CACHE["ids"] = frozenset(str(x).strip() for x in raw if str(x).strip())
    return _CACHE["ids"]


def is_hidden(eid):
    return str(eid or "") in ids()


def guest_hidden(slug):
    """Podcast-Gast (Podpage-Slug) gehoert zu einer ausgeblendeten Entitaet: id = Slug, bei Kollision mit Basis-Entitaeten Slug + "-guest" (site_podpage.make_guest_entities)."""
    s = str(slug or "")
    return s in ids() or (s + "-guest") in ids()


def drop(items, key="id"):
    """Liste von Datensaetzen ohne die ausgeblendeten (key = Feld mit der Entitaets-id)."""
    h = ids()
    return [x for x in items if not (isinstance(x, dict) and x.get(key) in h)] if h else list(items)
