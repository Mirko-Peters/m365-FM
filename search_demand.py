"""Suchnachfrage (Issue #156) fuer die Uebersetzungsskripte: GET <COMMUNITY_API>/api/search/demand-export liefert je Sprache die meistgesuchten
fehlenden Uebersetzungen ({"langs": {"de": [{"kind": "episode"|"lblog", "item": slug, "title", "searches", "days"}]}}, meistgesucht zuerst).
translate_show.py, translate_notes.py und translate_blog.py nutzen sie NUR als Reihenfolge: was ueberhaupt gesendet wird, entscheiden weiter ihre
eigenen Regeln (#315: einmal uebersetzen, Neuuebersetzung nur fuer stale auf Anforderung, Handtexte gesperrt, Budgets, Top-Grenzen). Ohne Export
(Netz, 404, Fehler) bleibt die bisherige Reihenfolge; nichts wird dadurch zusaetzlich oder erneut uebersetzt."""
import json, os, urllib.request

_CACHE = {}


def load(api=None, timeout=20, opener=None):
    """-> {lang: {(kind, item): rang}} (rang 0 = meistgesucht); {} wenn nicht abrufbar. Je Lauf einmal abgerufen. Nur mit COMMUNITY_API (setzen die
    Uebersetzungs-Workflows) und ohne SEARCH_DEMAND=0: lokale Laeufe und Tests fragen nie die Live-API und behalten die bisherige Reihenfolge."""
    api = (api if api is not None else os.environ.get("COMMUNITY_API") or "").rstrip("/")
    if not api or os.environ.get("SEARCH_DEMAND") == "0": return {}
    if api in _CACHE: return _CACHE[api]
    out = {}
    try:
        req = urllib.request.Request(api + "/api/search/demand-export", headers={"user-agent": "m365-dub-build"})
        with (opener or urllib.request.urlopen)(req, timeout=timeout) as r:
            data = json.loads(r.read().decode("utf-8"))
        for lang, rows in ((data or {}).get("langs") or {}).items():
            if not isinstance(rows, list): continue
            ranks = {}
            for it in rows:
                if isinstance(it, dict) and isinstance(it.get("kind"), str) and isinstance(it.get("item"), str):
                    ranks.setdefault((it["kind"], it["item"]), len(ranks))
            if ranks: out[str(lang)] = ranks
        if out: print("Suchnachfrage:", {l: len(v) for l, v in out.items()})
    except Exception as e:
        print("Suchnachfrage nicht abrufbar (Reihenfolge unveraendert):", str(e)[:100])
    _CACHE[api] = out
    return out


def rank(demand, kind, lang, item):
    """Rang des Inhalts in dieser Sprache; ohne Nachfrage hinter allen gesuchten (stabile Sortierung behaelt die bisherige Reihenfolge)."""
    return (demand.get(lang) or {}).get((kind, item), 10 ** 9)


def order(seq, demand, kind, lang_of, item_of):
    """Stabil nach Nachfrage sortiert (gesuchte zuerst, sonst unveraendert). Aendert nur die Reihenfolge, nie den Inhalt der Liste."""
    if not demand: return list(seq)
    return sorted(seq, key=lambda x: rank(demand, kind, lang_of(x), item_of(x)))


def order_any(seq, demand, kind, langs, item_of):
    """Wie order, fuer Listen ohne Sprache (z. B. Folgen vor dem Plan): bester Rang ueber die gegebenen Sprachen."""
    if not demand: return list(seq)
    return sorted(seq, key=lambda x: min([rank(demand, kind, l, item_of(x)) for l in langs] or [10 ** 9]))
