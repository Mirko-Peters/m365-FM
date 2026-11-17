"""Beziehungen einer Entitaet als ganze Saetze (Mirko, 16.11.2026): "Power BI ist ein Analyse- und BI-Werkzeug von [Microsoft] und Teil von [Power Platform]
und [Microsoft Fabric]." auf der Seite von Power BI, "Microsoft entwickelt [Microsoft 365], [Azure], ... und 243 weitere." auf der Seite von Microsoft.

- Satzvorlagen je Sprache und Beziehung stehen in data/relation_sentences.json (en/de von Hand, die anderen 13 Sprachen maschinell uebersetzt, Feld _mt).
  Fehlt eine Vorlage in einer Sprache, gibt es fuer diese Beziehung keinen Satz: die vollstaendige Liste der Beziehungen unter dem Text (site_entities, div.en-rel)
  bleibt in jeder Sprache stehen, es geht also nichts verloren.
- Verlinkt werden die Ziel-Entitaeten mit ihrem Namen als Ankertext (beschreibend, kein "hier"); die Seite selbst ({s}) ist kein Link.
  Linktext = Name des Ziels in der Sprache der Seite (site_ename.ename, Linktexte Paket 4), wie in Listen und Brotkruemel; Begriffe ohne
  Uebersetzung als englischer Text (lang="en"), in ar/he jeder Name in <bdi>. Nur der Einleitungssatz (en/de) nimmt die Satzform aus "cat".
- Listen: hoechstens CAP Namen, dann "und N weitere" als Text (bei CAP+1 Namen stehen alle da, nie "und 1 weitere"); der Sprung auf die vollstaendige Liste
  darunter ist ein eigener Link mit Ziel und Beziehung im Linktext ("Vollstaendige Listen: alle 246 Produkte und Werke von Microsoft", data/link_context.json more.*).
- Seiten ohne Beziehungen: Rueckfall-Satz aus gemeinsamen Folgen ("In Folgen zu {s} geht es oft auch um ...", cooc/cooc_pick), nie in e["rel"].
  "oft" nur bei Themen aus mindestens 2 gemeinsamen Folgen; sonst "In Folgen zu {s} geht es auch um ..." bzw. "In der Folge zu {s} ..."; Personen sind kein Thema.
- Keine Doppelung: was ein genauerer Satz schon nennt (Kategorie, Entwickler, Teil von ...), steht nicht noch einmal im "eng verwandt"-Satz.

Index-Regel (site_index_rule, "ab 2500 Zeichen eigener Text"): diese Saetze sind aus Vorlagen erzeugt und zaehlen NICHT als eigener Text. Die Entitaetsregel
(site_entities.long_index_langs) zaehlt nur den Langtext der Sprache; der Abschnitt traegt ausserdem data-own-text="no", den site_index_rule.plain_text
herausnimmt, falls einmal die ganze Seite gemessen wird. Sonst kaemen duenne Seiten mit vielen Beziehungen allein durch Schablonentext in den Index.

Reine Funktionen (bis auf das einmalige Lesen der JSON-Datei)."""
import html
import json
import re
from pathlib import Path

import site_ename as EN   # Namen in der Sprache der Seite (data/entity_names.json), englischer Rest mit lang="en", RTL in <bdi>

FILE = Path(__file__).parent / "data" / "relation_sentences.json"
CAP = 6   # hoechstens so viele Namen je Satz
SYM = ("related_to", "similar_to")   # symmetrische Beziehungen: Gegenrichtung = gleiche Aussage
WEAK = ("related_to", "similar_to")   # schwache Beziehungen: nennen nichts, was ein anderer Satz schon nennt
LEAD = ("instance_of", "developed_by", "part_of")   # gehen (en/de) in den Einleitungssatz "X ist ein ... von ... und Teil von ..."
ORDER = ("instance_of", "part_of", "broader", "developed_by", "covers", "requires", "created_by", "organized_by", "works_for", "similar_to", "related_to")
RTL = ("ar", "he")
_DATA = None


def data():
    global _DATA
    if _DATA is None:
        try:
            _DATA = json.loads(FILE.read_text("utf-8"))
        except (OSError, ValueError):
            _DATA = {}
    return _DATA


def esc(s):
    return html.escape(s or "", quote=True)


def _plain(h):
    return html.unescape(re.sub(r"<[^>]+>", "", h or ""))


def _pick(v, many):
    if isinstance(v, dict):
        return v.get("many" if many else "one") or v.get("one") or v.get("many") or ""
    return v or ""


_VOWEL = "AEIOUYÀÂÄÉÈÊËÎÏÔÖÛÜaeiouyàâäéèêëîïôöûü"


def fill(lang, tpl, **vals):
    """Setzt {s}/{x}/... ein. Franzoesisch: "de"/"que" vor Vokal wird "d’"/"qu’" (fait partie d’Azure)."""
    out, pos = [], 0
    for m in re.finditer(r"\{(\w+)\}", tpl):
        before = tpl[pos:m.start()]
        val = vals.get(m.group(1), m.group(0))
        if lang == "fr" and _plain(val)[:1] in _VOWEL and _plain(val)[:1]:
            before = re.sub(r"(^|(?<=\s))(de|que) $", lambda k: ("d’" if k.group(2) == "de" else "qu’"), before)
        out += [before, val]; pos = m.end()
    out.append(tpl[pos:])
    return "".join(out)


def _and(lang, L, nxt, two):
    j = L.get("join") or {}
    a = (j.get("and2") if two and j.get("and2") else None) or j.get("and", " and ")
    if lang == "es" and a == " y ":   # "y" wird vor i-/hi-Laut zu "e" (Intune -> "e Intune"), nicht vor hia/hie/hio/hiu
        p = _plain(nxt).lower()
        if p[:1] == "i" or (p[:2] == "hi" and p[2:3] not in ("a", "e", "o", "u")):
            a = " e "
    return a


def join(lang, items, more_html=""):
    """items = HTML-Teile (Links). more_html = fertiger Link "N weitere" oder ''. Kein Oxford-Komma ausser, wo die Sprache es will (id)."""
    L = data().get(lang) or {}
    sep = (L.get("join") or {}).get("sep", ", ")
    if more_html:
        return sep.join(items) + ((L.get("more") or {}).get("tail") or " {link}").replace("{link}", more_html)
    if len(items) <= 1:
        return "".join(items)
    if len(items) == 2:
        return items[0] + _and(lang, L, items[1], True) + items[1]
    return sep.join(items[:-1]) + _and(lang, L, items[-1], False) + items[-1]


def _link(lang, url, text, e=None):
    """Link mit dem Namen des Ziels als Text: ar/he in <bdi>, Begriff ohne Uebersetzung (site_ename.foreign) als englischer Text (lang="en")."""
    return f'<a href="{esc(url)}">{EN.wrap(lang, esc(text), EN.foreign(e, lang))}</a>'


def build(lang, e, fwd, inv, ents, href, anchor=None, works_for=None, rank=None, cap=CAP, total=None):
    """Beziehungssaetze einer Entitaet als HTML-Abschnitt ('' ohne Saetze).
    fwd: [(praedikat, ziel-id)] aus e["rel"]; inv: [(praedikat, quell-id)] (Gegenrichtung); ents: id -> Entitaet; href(id) -> URL der Entitaetsseite;
    anchor(richtung, praedikat[, satzschluessel]) -> id der vollstaendigen Liste (Sprungziel der Zeile "Vollstaendige Listen"); total(richtung, praedikat, satzschluessel)
    -> Zahl der Eintraege dieser Liste (sonst die Zahl im Satz); works_for: Firmen-id der Person; rank(id) -> Sortierwert (hoeher zuerst)
    fuer die Gegenrichtung (bekanntere Eintraege zuerst; die Hinrichtung bleibt in der redaktionellen Reihenfolge)."""
    D = data(); L = D.get(lang) or {}; T = L.get("t") or {}; M = (D.get("en") or {}).get("t") or {}
    if not T:
        return ""
    et = e.get("type", "")
    groups = {}   # schluessel -> {"dir", "p", "ids"}

    def add(key, d, p, i, back=False):
        g = groups.setdefault(key, {"dir": d, "p": p, "k": key, "ids": [], "back": set()})
        if i not in g["ids"] and i != e["id"]:
            g["ids"].append(i)
            if back:
                g["back"].add(i)

    for p, to in fwd:
        if to in ents:
            k = f"f.{p}.subj:{et}"
            add(k if k in M else f"f.{p}", "f", p, to)
    if works_for and works_for in ents:
        add("f.works_for", "f", "works_for", works_for)
    for p, frm in inv:
        if frm not in ents:
            continue
        k = f"i.{p}.src:{ents[frm].get('type', '')}"
        if k in M:
            add(k, "i", p, frm, True)
        elif p in SYM:
            add(f"f.{p}", "f", p, frm, True)   # Gegenrichtung einer symmetrischen Beziehung = derselbe Satz
        else:
            add(f"i.{p}", "i", p, frm, True)
    if rank:   # Hinrichtung: redaktionelle Reihenfolge vorn; Gegenrichtung dahinter, bekanntere zuerst (stabil)
        for g in groups.values():
            g["ids"].sort(key=lambda i: (1, -rank(i)) if i in g["back"] else (0, 0))

    fulls = []   # (Satzschluessel, Sprungziel, Anzahl): Links "alle 246 Produkte und Werke von Microsoft" unter den Saetzen

    def _anchor(g):
        if not anchor:
            return ""
        try:
            return anchor(g["dir"], g["p"], g["k"])   # mit Satzschluessel: eigene Liste z. B. fuer i.developed_by.src:cert
        except TypeError:
            return anchor(g["dir"], g["p"])

    def lst(g, ids=None, more_link=None):
        """Verlinkte Namen; more_link ueberschreibt den Text "N weitere" (Deutsch nach Dativ: "von A und 5 weiteren").
        "N weitere" ist Text, kein Link (Audit SEO-9/E9/A11Y-8: gleich klingende Links ohne Ziel); den Sprung auf die vollstaendige Liste
        traegt ein eigener Link mit Beziehung im Linktext (fulls -> Zeile "Vollstaendige Listen: alle 246 Produkte und Werke von Microsoft")."""
        ids = g["ids"] if ids is None else ids
        if len(ids) > cap + 1:
            shown, n = ids[:cap], len(ids) - cap
            mt = (more_link or (L.get("more") or {}).get("link") or "{n}").replace("{n}", str(n))
            more = esc(mt)
            a = _anchor(g)
            if a and all(a != x[1] for x in fulls):
                fulls.append((g["k"], a, total(g["dir"], g["p"], g["k"]) if total else len(g["ids"])))
        else:
            shown, more = ids, ""
        return join(lang, [_link(lang, href(i), EN.ename(ents[i], lang), ents[i]) for i in shown], more)

    subj = EN.html_name(e, lang)   # Name in der Sprache der Seite (site_ename), wie in der Ueberschrift
    sent_f, sent_i, named = [], [], set()
    if "microsoft-tool" in groups.get("f.instance_of", {}).get("ids", []) and any("microsoft" in g["ids"] for k, g in groups.items() if k.startswith("f.developed_by")):
        groups["f.instance_of"]["ids"].remove("microsoft-tool")   # "Kategorie Microsoft-Werkzeug" + "von Microsoft entwickelt" waere dieselbe Aussage zweimal
        named.add("microsoft-tool")

    # Einleitungssatz (nur Sprachen mit "lead", d. h. en/de): Art + Entwickler + Teil von in einem Satz
    lead = L.get("lead") or {}
    if lead:
        cats = groups.get("f.instance_of", {}).get("ids", [])
        devk = next((k for k in groups if k.startswith("f.developed_by")), None)
        devs = groups[devk]["ids"] if devk else []
        parts = groups.get("f.part_of", {}).get("ids", [])
        catn = L.get("cat") or {}
        used = [c for c in cats if c in catn]
        if used:
            nouns = [f"{catn[c][0]} {_link(lang, href(c), catn[c][1])}" for c in used]
        elif et in (L.get("type_noun") or {}) and (devs or parts):
            tn = L["type_noun"][et]; nouns = [f"{tn[0]} {esc(tn[1])}"]
        else:
            nouns = []
        if nouns:
            key = "n" + ("d" if devs else "") + ("p" if parts else "")
            tpl = lead.get(key)
            if tpl:
                ml = lead.get("more")
                sent_f.append(fill(lang, tpl, s=subj, noun=join(lang, nouns), dev=lst(groups[devk], more_link=ml) if devs else "", part=lst(groups["f.part_of"], more_link=ml) if parts else ""))
                named.update(used + devs + parts)
                if "f.instance_of" in groups:
                    groups["f.instance_of"]["ids"] = [c for c in cats if c not in used]
                for k in (devk, "f.part_of" if parts else None):
                    if k:
                        groups[k]["ids"] = []

    def key_order(k):
        d, rest = k.split(".", 1)
        p = rest.split(".", 1)[0]
        return (0 if d == "f" else 1, ORDER.index(p) if p in ORDER else len(ORDER), k)

    for k in sorted(groups, key=key_order):   # zuerst die genauen Beziehungen, damit "named" fuer die schwachen vollstaendig ist
        g = groups[k]
        if g["p"] in WEAK:
            continue
        named.update(g["ids"])
    for k in sorted(groups, key=key_order):
        g = groups[k]
        ids = [i for i in g["ids"] if i not in named] if g["p"] in WEAK else g["ids"]
        if not ids:
            continue
        tpl = _pick(T.get(k), len(ids) > 1)
        if not tpl:
            continue   # keine sichere Vorlage in dieser Sprache: nur die Liste darunter
        ml = T[k].get("more") if isinstance(T.get(k), dict) else None
        (sent_f if g["dir"] == "f" else sent_i).append(fill(lang, tpl, s=subj, x=lst(g, ids, ml)))
        if g["p"] in WEAK:
            named.update(ids)
    if not sent_f and not sent_i:
        return ""
    ss = L.get("sent_sep", " ")
    ps = "".join(f"<p>{ss.join(x)}</p>" for x in (sent_f, sent_i) if x)
    ps += full_lists(lang, EN.label(e, lang), fulls)
    h = esc(L.get("heading") or (D.get("en") or {}).get("heading") or "Relationships")
    return f'<section class="en-rels" data-own-text="no" aria-labelledby="en-rels-h"><h2 id="en-rels-h">{h}</h2>{ps}</section>'


def _more_key(k):
    """Vorlage fuer den Sprunglink: genauer Satzschluessel, sonst ohne .subj:/.src:-Zusatz, sonst allgemein (data/link_context.json, more.*)."""
    import site_linkctx as LC
    for c in (k, k.split(".subj:")[0].split(".src:")[0]):
        if LC.raw("en", "more." + c):
            return "more." + c
    return "more._"


def full_lists(lang, name, fulls):
    """Zeile "Vollstaendige Listen: alle 246 Produkte und Werke von Microsoft und alle 50 von Microsoft vergebenen Zertifizierungen" (Sprungmarken auf
    die vollstaendigen Listen darunter). Linktext = Ziel samt Beziehung in der Sprache der Seite; '' ohne gekuerzte Liste."""
    if not fulls:
        return ""
    import site_linkctx as LC
    items = [f'<a href="#{esc(a)}">{LC.text(lang, _more_key(k), s=name, n=n)}</a>' for k, a, n in fulls]
    return f'<p class="en-full">{LC.text(lang, "more.full")} {join(lang, items)}</p>'


_DF = {}


def _cooc_scores(eid, eps_of, about, ents, skip):
    """Gewicht und Zahl gemeinsamer Folgen je Thema (siehe cooc_rank) und Zahl der Folgen der Seite (Folgen in about)."""
    import math
    n_all = max(1, len(about))
    if _DF.get("about") is not about or _DF.get("n") != len(about):   # Folgen je Thema einmal je Bau (about aendert sich waehrend des Baus nicht)
        df = {}
        for xs in about.values():
            for i in set(xs):
                df[i] = df.get(i, 0) + 1
        _DF.clear(); _DF.update(about=about, n=len(about), df=df)
    df = _DF["df"]
    sc, shared, n_eps = {}, {}, 0
    for x in dict.fromkeys(eps_of):
        if about.get(x):
            n_eps += 1   # Folgen der Seite (der Hauptshow), auch ohne weitere Themen: entscheidet "eine Folge" / "Folgen"
        xs = [i for i in dict.fromkeys(about.get(x) or ()) if i != eid]
        if not xs:
            continue
        w = 1 / math.log2(2 + len(xs))
        for i in xs:
            if i in skip or i not in ents or ents[i].get("type") in COOC_SKIP_TYPES:
                continue
            sc[i] = sc.get(i, 0) + w * math.log(1 + n_all / max(1, df.get(i, 1)))
            shared[i] = shared.get(i, 0) + 1
    return sc, shared, n_eps


COOC_SKIP_TYPES = ("category", "person")   # Kategorien sind keine Themen; Gaeste sind Teilnehmer einer Folge, kein besprochenes Thema


def cooc_rank(eid, eps_of, about, ents, k=CAP, skip=("mirko-peters",)):
    """Rueckfall fuer Entitaeten ohne Beziehungen (Audit Linktexte SEO-1, Paket 3): Themen, die in denselben Folgen vorkommen.
    eps_of: Folgen-Schluessel (slug) der Seite; about: Folge -> ids der Entitaeten, deren Seite die Folge fuehrt (generate_site._ep_about).
    Gewicht je gemeinsamer Folge 1/log2(1 + Themen der Folge) (Sammelfolgen zaehlen weniger) mal Seltenheit log(1 + Folgen / Folgen des Themas)
    (Allerweltsthemen wie Microsoft 365 zaehlen weniger). Ohne die Seite selbst, den Host (skip), Kategorien und Personen (Gaeste sind kein Thema);
    hoechstens k ids, beste zuerst."""
    sc, shared, _ = _cooc_scores(eid, eps_of, about, ents, skip)
    return sorted(sc, key=lambda i: (-sc[i], -shared[i], ents[i].get("name", "").lower(), i))[:k]


def cooc_pick(eid, eps_of, about, ents, k=CAP, skip=("mirko-peters",)):
    """Themen fuer den Rueckfall-Satz samt Fassung (Gegenpruefung Paket 3: "oft" nur, wo es stimmt):
    - "often": die Seite hat mindestens 2 Folgen und es gibt Themen aus mindestens 2 gemeinsamen Folgen; genannt werden nur diese
      ("In Folgen zu {s} geht es oft auch um ...");
    - "some": mehrere Folgen, aber jedes Thema nur in einer davon ("In Folgen zu {s} geht es auch um ...");
    - "one": die Seite hat nur eine Folge ("In der Folge zu {s} geht es auch um ...").
    Rueckgabe (ids, fassung); ([], "") ohne Themen."""
    sc, shared, n_eps = _cooc_scores(eid, eps_of, about, ents, skip)
    order = sorted(sc, key=lambda i: (-sc[i], -shared[i], ents[i].get("name", "").lower(), i))
    if not order:
        return [], ""
    if n_eps <= 1:
        return order[:k], "one"
    strong = [i for i in order if shared[i] >= 2]
    return (strong[:k], "often") if strong else (order[:k], "some")


def cooc(lang, e, ids, ents, href, mode="often"):
    """Satz "In Folgen zu {s} geht es oft auch um [A], [B] und [C]." (data/relation_sentences.json, cooc) als eigener Abschnitt; '' ohne ids oder Vorlage.
    mode (cooc_pick): "often" (t), "some" (t_some, ohne "oft") oder "one" (t_one, eine Folge); Personen-Seiten nehmen p/p_some/p_one ("Folgen mit oder ueber {s}").
    Ohne Vorlage der Fassung kein Satz (nie auf "oft" zurueckfallen). Ueberschrift heading bzw. heading_some (ohne "oft").
    Steht nur auf Seiten ohne Beziehungen und schreibt nichts in e["rel"]: die Aussage ist "kommt in denselben Folgen vor", keine Beziehung im Graphen."""
    D = data(); L = D.get(lang) or {}
    c = L.get("cooc") or {}
    ids = [i for i in ids if i in ents and i != e["id"]]
    tk = ("p" if e.get("type") == "person" else "t") + ("" if mode == "often" else "_" + mode)
    hd = c.get("heading" if mode == "often" else "heading_some")
    if not ids or not c.get(tk) or not hd:
        return ""
    subj = EN.html_name(e, lang)
    x = join(lang, [_link(lang, href(i), EN.ename(ents[i], lang), ents[i]) for i in ids])
    return (f'<section class="en-rels en-cooc" data-own-text="no" aria-labelledby="en-rels-h"><h2 id="en-rels-h">{esc(hd)}</h2>'
            f'<p>{fill(lang, c[tk], s=subj, x=x)}</p></section>')
