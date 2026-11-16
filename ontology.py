"""Ontologie-Regeln fuer die Entitaeten (data/entities.json, Community-Aenderungen aus D1, Gaeste, Speaker).

Drei Haupt-Aufgaben, alle ohne KI-Kosten und ohne Netz:
  audit(ents)         Pruefbericht: Verwaiste, fehlende Oberbegriffe, Zyklen, tote Verweise, Dubletten, Alias-Kollisionen, Luecken (Wikidata, Deutsch, Art).
  infer_parent(e,..)  Regeln fuer den Oberbegriff eines Eintrags, der noch keinen hat (Klammer "(Microsoft Entra ID)", Namens-Praefix "Azure Policy ...").
  derive(ents)        Beim Seitenbau fuer ALLE Eintraege (Repo, Community, neu) die Regeln anwenden und die Eintraege im Speicher ergaenzen - nichts wird gespeichert.

Drei getrennte Hierarchie-Straenge (Kante immer Kind -> Elternteil, in e["rel"] als [praedikat, id]):
  instance_of   Art ("Teams ist ein Collaboration-Tool")
  part_of       Bestandteil ("Conditional Access ist Teil von Entra ID")
  broader       Oberbegriff bei Begriffen ("Access token" -> "OAuth"), wie SKOS broader; Gegenrichtung = narrower (wird beim Anzeigen berechnet)
Jeder Eintrag hat hoechstens einen Hauptelternteil (primary_parent) fuer Brotkruemel; weitere Eltern sind erlaubt (Power BI: Power Platform und Fabric).
"""
import re
from collections import Counter, defaultdict

HIER = ("part_of", "broader", "instance_of")    # Reihenfolge = Rang fuer den Hauptelternteil (Teil-von vor Oberbegriff vor Art)
GENERIC_TOP = {"microsoft-tool"}               # Sammelkategorie fuer fast alle Produkte: nie Hauptelternteil/Brotkrume, wenn es eine bessere Wahl gibt
MAX_DEPTH = 4                                    # Brotkruemel/Hierarchie hoechstens so tief (ohne die Kategorie an der Spitze)
PARENT_TYPES = ("product", "platform")           # Eltern, die die Regeln vorschlagen duerfen
CHILD_TYPES = ("concept", "product")             # Kinder, fuer die die Regeln einen Oberbegriff suchen
KINDS = ("protocol", "standard", "framework", "method", "practice", "architecture", "metric", "role", "feature", "format", "technique", "threat", "term")
# zu allgemeine Namen: nie als Oberbegriff aus dem Namen ableiten (wie site_learn._AMBIG/_GENERIC)
AMBIGUOUS = {"word", "project", "access", "forms", "lists", "stream", "loop", "bookings", "publisher", "flow", "excel online", "to do", "planner", "whiteboard", "tasks",
             "teams", "graph", "fabric", "viva", "outlook", "excel", "connector", "prompt", "governance", "copilot", "azure ad", "ad", "pac", "rag", "mcp", "dlp", "crm"}
_PAREN = re.compile(r"\(([^()]+)\)\s*$")
_NORM = re.compile(r"[^a-z0-9]+")


def norm(s):
    return _NORM.sub("", (s or "").lower())


def rels(e):
    return [(r[0], r[1]) for r in (e.get("rel") or []) if isinstance(r, (list, tuple)) and len(r) == 2]


def parents_of(e, preds=HIER):
    return [(p, t) for p, t in rels(e) if p in preds]


def primary_parent(e, by):
    """Hauptelternteil (id) oder None: erst part_of, dann broader, dann instance_of; Kategorien nur als letzte Wahl."""
    for pred in HIER:
        cands = [t for p, t in rels(e) if p == pred and t in by and t not in GENERIC_TOP]
        non_cat = [t for t in cands if by[t].get("type") != "category"]
        if non_cat or cands:
            return (non_cat or cands)[0]
    return None


def ancestors(i, by, limit=8):
    """Kette der Hauptelternteile von i nach oben (ohne i), bricht bei Zyklen/Tiefe ab."""
    out, seen = [], {i}
    cur = by.get(i)
    while cur and len(out) < limit:
        p = primary_parent(cur, by)
        if not p or p in seen:
            break
        out.append(p); seen.add(p); cur = by.get(p)
    return out


def _name_index(ents):
    """Kleingeschriebener Name/Alias -> id, nur eindeutige Treffer von Produkten/Plattformen mit >= 4 Zeichen, ohne zu allgemeine Namen."""
    idx = defaultdict(set)
    for e in ents:
        if e.get("type") not in PARENT_TYPES or e.get("outdated") or e.get("replaced_by"):
            continue
        for n in [e["name"], *(e.get("aliases") or [])]:
            n2 = re.sub(r"\s*\(.*?\)", "", n).strip().lower()
            if len(n2) >= 4 and n2 not in AMBIGUOUS:
                idx[n2].add(e["id"])
    return {k: next(iter(v)) for k, v in idx.items() if len(v) == 1}


def would_cycle(child, parent, by):
    """True, wenn parent schon (ueber irgendeine Hierarchie-Kante) unter child haengt."""
    stack, seen = [parent], set()
    while stack:
        x = stack.pop()
        if x == child:
            return True
        if x in seen or x not in by:
            continue
        seen.add(x)
        stack += [t for _, t in parents_of(by[x])]
    return False


def infer_parent(e, idx, by):
    """(praedikat, parent_id, regel) fuer einen Eintrag ohne Hierarchie-Eltern oder None. Nur sichere Regeln:
    R1 Klammer am Ende des Namens nennt ein Produkt/eine Plattform: "Host pool (Azure Virtual Desktop)".
    R2 der Name beginnt mit einem eindeutigen Produktnamen (Praefix, mindestens 2 Woerter oder eine Plattform): "Azure Policy initiative"."""
    if e.get("type") not in CHILD_TYPES or e.get("outdated") or e.get("replaced_by") or parents_of(e):
        return None
    pred = "broader" if e["type"] == "concept" else "part_of"
    m = _PAREN.search(e["name"])
    if m:
        pid = idx.get(m.group(1).strip().lower())
        if pid and pid != e["id"] and not would_cycle(e["id"], pid, by):
            return pred, pid, "klammer"
    n = e["name"].lower()
    best = None
    for k, pid in idx.items():
        if pid == e["id"] or not n.startswith(k + " ") or n == k:
            continue
        if " " not in k and by[pid].get("type") != "platform":   # Ein-Wort-Praefix nur bei Plattformen ("Azure ...")
            continue
        if not best or len(k) > len(best[0]):
            best = (k, pid)
    if best and not would_cycle(e["id"], best[1], by):
        return pred, best[1], "praefix"
    return None


def apply_rules(ents):
    """Wendet die Regeln auf eine Liste von Eintraegen an (in place). Rueckgabe: [(id, praedikat, parent, regel)]."""
    by = {e["id"]: e for e in ents}
    idx = _name_index(ents)
    added = []
    for e in ents:
        r = infer_parent(e, idx, by)
        if r:
            pred, pid, rule = r
            e["rel"] = list(e.get("rel") or []) + [[pred, pid]]
            added.append((e["id"], pred, pid, rule))
    return added


def derive(by):
    """Beim Seitenbau: Regeln fuer alle Eintraege (dict id -> Eintrag, wie site_learn.ENTS) im Speicher anwenden. Gibt die Zahl ergaenzter Kanten zurueck."""
    ents = list(by.values())
    n = 0
    idx = _name_index(ents)
    for e in ents:
        r = infer_parent(e, idx, by)
        if r:
            e["rel"] = list(e.get("rel") or []) + [[r[0], r[1]]]
            n += 1
    return n


def depth(i, by, cache=None):
    cache = {} if cache is None else cache
    if i in cache:
        return cache[i]
    cache[i] = 99   # Zyklenschutz
    ps = [t for _, t in parents_of(by[i]) if t in by]
    cache[i] = 0 if not ps else 1 + max(depth(p, by, cache) for p in ps)
    return cache[i]


def find_cycles(by):
    out = []
    for i, e in by.items():
        stack, seen = [t for _, t in parents_of(e)], set()
        while stack:
            x = stack.pop()
            if x == i:
                out.append(i); break
            if x in seen or x not in by:
                continue
            seen.add(x)
            stack += [t for _, t in parents_of(by[x])]
    return sorted(set(out))


def audit(ents):
    """Messwerte der Ontologie als dict (JSON-faehig)."""
    by = {e["id"]: e for e in ents}
    inc = defaultdict(list)
    dangling = []
    for e in ents:
        for p, t in rels(e):
            if t not in by:
                dangling.append([e["id"], p, t])
            else:
                inc[t].append((e["id"], p))
    live = [e for e in ents if not e.get("outdated") and not e.get("replaced_by")]
    orph = [e for e in live if not rels(e) and e["id"] not in inc]
    sym = {(a, b) for a in by for p, b in rels(by[a]) if p == "related_to" and b in by}
    one_sided = sum(1 for a, b in sym if (b, a) not in sym)
    names = defaultdict(list)
    al = defaultdict(set)
    for e in live:
        names[norm(e["name"])].append(e["id"])
        for a in e.get("aliases") or []:
            al[norm(a)].add(e["id"])
    dups = sorted(sorted(v) for v in names.values() if len(v) > 1)
    alias_coll = sorted(k for k, v in al.items() if len(v) > 1)
    dcache = {}
    depths = Counter(depth(e["id"], by, dcache) for e in live)
    ctypes = [e for e in live if e.get("type") in ("concept", "product")]
    no_parent = [e for e in ctypes if not parents_of(e)]
    typed = lambda t: [e for e in live if e.get("type") == t]
    concepts = typed("concept")
    de_missing = [e for e in live if not (e.get("desc") or {}).get("de")]
    prods = [e for e in live if e.get("type") in ("product", "platform")]
    idx = _name_index(ents)
    m = {
        "total": len(ents), "live": len(live), "by_type": dict(Counter(e.get("type") for e in live)),
        "orphans": len(orph), "orphans_by_type": dict(Counter(e.get("type") for e in orph)),
        "with_relation": sum(1 for e in live if rels(e)),
        "no_parent": len(no_parent), "no_parent_of": len(ctypes),
        "concepts": len(concepts), "concepts_no_parent": sum(1 for e in concepts if not parents_of(e)),
        "concepts_no_kind": sum(1 for e in concepts if not e.get("kind")),
        "dangling": dangling, "cycles": find_cycles(by), "max_depth": max(depths) if depths else 0, "depth_hist": dict(sorted(depths.items())),
        "too_deep": sorted(e["id"] for e in live if depth(e["id"], by, dcache) > MAX_DEPTH and depth(e["id"], by, dcache) < 99),
        "duplicate_names": dups, "alias_collisions": alias_coll,
        "related_one_sided": one_sided, "related_total": len(sym),
        "missing_de": len(de_missing), "missing_wikidata_products": sum(1 for e in prods if not e.get("wikidata")),
        "missing_wikipedia_products": sum(1 for e in prods if not e.get("wikipedia")), "missing_docs_products": sum(1 for e in prods if not e.get("docs")),
        "products": len(prods),
        "derivable": sum(1 for e in no_parent if infer_parent(e, idx, by)),
    }
    m["no_parent_share"] = round(m["no_parent"] / m["no_parent_of"], 4) if m["no_parent_of"] else 0
    return m


def problems(m, baseline=None):
    """Harte Fehler (Liste von Texten); leer = in Ordnung. Dubletten/Alias-Kollisionen zaehlen nur, wenn sie nicht schon im Stand (baseline) stehen."""
    base = baseline or {}
    out = []
    if m["dangling"]:
        out.append(f"{len(m['dangling'])} Verweise ins Leere, z. B. {m['dangling'][:3]}")
    if m["cycles"]:
        out.append(f"Zyklen in der Hierarchie: {m['cycles'][:5]}")
    known_d = {tuple(x) for x in base.get("duplicate_names", [])}
    new_d = [d for d in m["duplicate_names"] if tuple(d) not in known_d]
    if new_d:
        out.append(f"neue Dubletten (gleicher Name): {new_d[:5]}")
    new_a = [a for a in m["alias_collisions"] if a not in set(base.get("alias_collisions", []))]
    if new_a:
        out.append(f"neue Alias-Kollisionen: {new_a[:5]}")
    return out


def warnings(m, baseline=None):
    base = baseline or {}
    out = []
    if m["too_deep"]:
        out.append(f"{len(m['too_deep'])} Eintraege tiefer als {MAX_DEPTH} Ebenen")
    if "no_parent_share" in base and m["no_parent_share"] > base["no_parent_share"] + 0.02:
        out.append(f"Anteil ohne Oberbegriff gestiegen: {m['no_parent_share']:.1%} (Stand {base['no_parent_share']:.1%})")
    return out


def render_md(m, added=None, date=""):
    t = lambda k: f"{m[k]}"
    L = [f"# Ontologie-Bericht {date}".strip(), "",
         f"- Eintraege: **{m['total']}** (aktuell gueltig {m['live']}); Typen: " + ", ".join(f"{k} {v}" for k, v in sorted(m["by_type"].items(), key=lambda x: -x[1])),
         f"- Mit mindestens einer Beziehung: **{m['with_relation']}** ({m['with_relation'] / max(m['live'], 1):.0%}); ganz verwaist (nichts raus, nichts rein): **{m['orphans']}**",
         f"- Begriffe/Produkte ohne Oberbegriff: **{m['no_parent']}** von {m['no_parent_of']} ({m['no_parent_share']:.0%}); davon per Regel ableitbar: {m['derivable']}",
         f"- Begriffe ohne Art (kind): {m['concepts_no_kind']} von {m['concepts']}",
         f"- Hierarchie: tiefste Ebene {m['max_depth']}, Verteilung {m['depth_hist']}; tiefer als {MAX_DEPTH}: {len(m['too_deep'])}",
         f"- Verweise ins Leere: {len(m['dangling'])}; Zyklen: {len(m['cycles'])}; Dubletten (gleicher Name): {len(m['duplicate_names'])}; Alias-Kollisionen: {len(m['alias_collisions'])}",
         f"- related_to ohne Gegenrichtung (Anzeige ergaenzt sie): {m['related_one_sided']} von {m['related_total']}",
         f"- Produkte/Plattformen ohne Wikidata: {m['missing_wikidata_products']} von {m['products']}; ohne Wikipedia: {m['missing_wikipedia_products']}; ohne Docs-Link: {m['missing_docs_products']}",
         f"- Ohne deutschen Kurztext: {m['missing_de']} von {m['live']}", ""]
    if m["duplicate_names"]:
        L += ["## Dubletten", *[f"- {', '.join(d)}" for d in m["duplicate_names"]], ""]
    if added:
        L += [f"## Neu zugeordnet ({len(added)})", *[f"- {i} -> {p} ({pr}, Regel {r})" for i, pr, p, r in added[:200]], ""]
    return "\n".join(L) + "\n"


def candidates(ents):
    """Moegliche Oberbegriffe fuer die KI-Zuordnung: Produkte, Plattformen, Kategorien und Begriffe, die selbst schon im Baum stehen oder Oberbegriffe sein koennen."""
    return [e for e in ents if e.get("type") in ("product", "platform", "category", "concept") and not e.get("outdated") and not e.get("replaced_by")]


def apply_suggestions(ents, sugg, min_conf="high"):
    """KI-Vorschlaege [{id, broader, kind, confidence}] pruefen und eintragen (in place). Eingetragen wird nur, was formal stimmt:
    Oberbegriff existiert, ist nicht der Eintrag selbst, erzeugt keinen Zyklus, der Eintrag hat noch keinen Oberbegriff; kind muss in KINDS stehen;
    der Oberbegriff nur bei confidence == min_conf. Rueckgabe: (angewendet, uebersprungen) als Listen von (id, Grund/Ziel)."""
    by = {e["id"]: e for e in ents}
    done, skipped = [], []
    for s in sugg:
        e = by.get(s.get("id"))
        if not e or e.get("type") != "concept":
            skipped.append((s.get("id"), "kein Begriff")); continue
        kind = s.get("kind")
        if kind in KINDS and not e.get("kind"):
            e["kind"] = kind
        pid = s.get("broader")
        if not pid:
            continue
        if pid not in by or pid == e["id"]:
            skipped.append((e["id"], f"Oberbegriff unbekannt: {pid}")); continue
        if parents_of(e):
            skipped.append((e["id"], "hat schon einen Oberbegriff")); continue
        if would_cycle(e["id"], pid, by):
            skipped.append((e["id"], f"Zyklus mit {pid}")); continue
        if s.get("confidence") != min_conf:
            skipped.append((e["id"], f"unsicher: {pid}")); continue
        e["rel"] = list(e.get("rel") or []) + [["broader", pid]]
        done.append((e["id"], pid))
    return done, skipped
