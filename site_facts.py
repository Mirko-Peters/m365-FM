"""Strukturierte, belegte Fakten fuer Firmen-, Produkt- und Personen-Entitaeten (data/entities.json): Fakten-Zeilen, sichtbare Abschnitte, Logo-Kachel, Schema.org.

Alle Felder sind optional; fehlt ein Feld, entsteht weder Ausgabe noch JSON-LD (nichts wird erfunden). Texte laufen ueber T() (data/py_i18n.json, alle 15 Sprachen).

Org-Felder
  legal_form      "GmbH"
  register        {court, number, url}                         Handelsregister (Amtsgericht, HRB-Nummer, Beleg)
  employees       {value: "ca. 25", as_of: "2026-11", source: url|Text}
  founders, ceo   [Entitaets-IDs von Personen]
  certifications  [{name, issuer, source}]
  partners        [{name, kind: consulting|research|funding|technology, url?, source}]
  customers       [{name, industry? (Entitaets-ID oder Text), case_study_url?, title?, source}]
  logo_src        Original-URL des Logos (auch fuer Orgs); Auslieferung nur ueber R2 (data/r2_map.json -> e["logo"])
  logo_bg         "dark" fuer weisse Logos (dunkle Kachel)
Produkt-/Plattform-Felder
  deployment      z. B. "SaaS, browser-based"
  integrations    [Text]
  release_year    "2024"
  version, docs   wie bisher
  trial_url       Link zur Testversion
Personen-Felder
  positions       [{title, org (Entitaets-ID), start (YYYY-MM), end?}]
"""
import html
import json
import re
from pathlib import Path
from site_i18n import T

esc = lambda s: html.escape(str(s if s is not None else ""), quote=True)
_DIMS = {}
try:
    _DIMS = json.loads((Path(__file__).parent / "data" / "r2_dims.json").read_text("utf-8"))
except Exception:
    pass

KINDS = [("consulting", "Consulting partners", "Beratungspartner"), ("research", "Research partners", "Forschungspartner"),
         ("funding", "Research funding", "Forschungsförderung"), ("technology", "Technology partners", "Technologiepartner")]


def _url(u):
    return isinstance(u, str) and u.startswith(("http://", "https://"))


def _a(u, label=None):
    return f'<a href="{esc(u)}" rel="noopener">{esc(label or u.replace("https://", "").replace("http://", "").rstrip("/"))}</a>'


def _src(lang, s):
    """Quellenangabe: URL als Link, sonst Text."""
    if not s:
        return ""
    return f' <span class="mut">({esc(T(lang, "Source", "Quelle"))}: {_a(s) if _url(s) else esc(s)})</span>'


def _person_link(root, ents, pid):
    p = ents.get(pid)
    return f'<a href="{root}{pid}/">{esc(p["name"])}</a>' if p else ""


def _since(lang, d):
    return T(lang, "since {d}", "seit {d}").replace("{d}", d)


def employees_text(lang, emp):
    v = str(emp.get("value") or "").strip()
    if v.startswith("ca. "):
        v = T(lang, "about", "ca.") + " " + v[4:]
    return v


def rows(lang, e, root, ents):
    """Zusaetzliche Fakten-Zeilen (Label, HTML) in fester Reihenfolge."""
    r, t = [], e.get("type")
    L = lambda en, de: T(lang, en, de)
    if t == "org":
        if e.get("legal_form"):
            r.append((L("Legal form", "Rechtsform"), esc(e["legal_form"])))
        reg = e.get("register") or {}
        if reg.get("number"):
            txt = esc(", ".join(x for x in (reg.get("number"), reg.get("court")) if x))
            r.append((L("Commercial register", "Handelsregister"), txt + (f' <span class="mut">({esc(L("Source", "Quelle"))}: {_a(reg["url"])})</span>' if _url(reg.get("url")) else "")))
        emp = e.get("employees") or {}
        if emp.get("value"):
            r.append((L("Employees", "Mitarbeitende"), esc(employees_text(lang, emp)) + (f' <span class="mut">({esc(L("as of", "Stand"))} {esc(emp["as_of"])})</span>' if emp.get("as_of") else "") + _src(lang, emp.get("source"))))
        for key, en, de in (("founders", "Founders", "Gründer"), ("ceo", "Management", "Geschäftsführung")):
            ls = [_person_link(root, ents, x) for x in (e.get(key) or [])]
            ls = [x for x in ls if x]
            if ls:
                r.append((L(en, de), ", ".join(ls)))
    if t in ("product", "platform"):
        if e.get("deployment"):
            r.append((L("Deployment", "Bereitstellung"), esc(e["deployment"])))
        if e.get("integrations"):
            r.append((L("Integrations", "Anbindungen"), esc(", ".join(e["integrations"]))))
        if e.get("release_year"):
            r.append((L("Release year", "Erscheinungsjahr"), esc(e["release_year"])))
        if _url(e.get("trial_url")):
            r.append((L("Free trial", "Testversion"), _a(e["trial_url"])))
    if t == "person":
        ps = [p for p in (e.get("positions") or []) if p.get("title")]
        if ps:
            cells = []
            for p in ps:
                o = ents.get(p.get("org") or "")
                parts = [esc(p["title"])]
                if o:
                    parts.append(f'<a href="{root}{o["id"]}/">{esc(o["name"])}</a>')
                if p.get("start"):
                    parts.append(esc(_since(lang, p["start"])))
                cells.append(" · ".join(parts))
            r.append((L("Position", "Position"), "<br>".join(cells)))
    return r


def logo_html(lang, e):
    """Logo-Kachel; nur wenn e["logo"] (R2-URL, aus logo_src ueber data/r2_map.json) gesetzt ist. Weisse Logos (logo_bg=dark) liegen auf dunkler Kachel."""
    if not e.get("logo"):
        return ""
    dark = e.get("logo_bg") == "dark"
    wh = _DIMS.get(e["logo"])
    size = f' width="{int(wh[0])}" height="{int(wh[1])}"' if isinstance(wh, list) and len(wh) == 2 else ""
    style = "display:inline-block;padding:.8em 1.2em;border-radius:.5em;" + ("background:#0b1f3a;" if dark else "background:#fff;border:1px solid var(--bd);")
    return (f'<p class="en-logo{" en-logo-dark" if dark else ""}"><span style="{style}"><img src="{esc(e["logo"])}" alt="{esc(T(lang, "Logo of {n}", "Logo von {n}").replace("{n}", e["name"]))}"{size} '
            f'style="display:block;max-height:3.5em;width:auto;height:auto;max-width:100%" loading="lazy" decoding="async"></span></p>')


def sections(lang, e, root, ents):
    """Sichtbare Abschnitte: Referenzkunden, Partner, Zertifizierungen."""
    out = ""
    cu = [c for c in (e.get("customers") or []) if c.get("name")]
    if cu:
        h = f'<section class="en-customers"><h2>{esc(T(lang, "Reference customers", "Referenzkunden"))}</h2>'
        cs = [c for c in cu if _url(c.get("case_study_url"))]
        if cs:
            h += f'<h3>{esc(T(lang, "Case studies", "Fallstudien"))}</h3><ul>' + "".join(
                f'<li><a href="{esc(c["case_study_url"])}" rel="noopener">{esc(c.get("title") or c["name"])}</a> <span class="mut">· {esc(c["name"])}</span></li>' for c in cs) + "</ul>"
        groups = {}
        for c in cu:
            ind = c.get("industry")
            if ind or not _url(c.get("case_study_url")):
                groups.setdefault(ind or "", []).append(c)
        for ind, items in groups.items():
            lab = (f'<a href="{root}{ind}/">{esc(ents[ind]["name"])}</a>' if ind in ents else esc(ind)) if ind else esc(T(lang, "Further customers", "Weitere Kunden"))
            names = ", ".join((f'<a href="{esc(c["case_study_url"])}" rel="noopener">{esc(c["name"])}</a>' if _url(c.get("case_study_url")) else esc(c["name"])) for c in items)
            h += f'<p><b>{lab}:</b> {names}</p>'
        srcs = [c["source"] for c in cu if _url(c.get("source")) and not _url(c.get("case_study_url"))]
        if srcs:
            h += f'<p class="mut">{esc(T(lang, "Source: company website", "Quelle: Website des Unternehmens"))} ({_a(srcs[0])})</p>'
        out += h + "</section>"
    pa = [p for p in (e.get("partners") or []) if p.get("name")]
    if pa:
        h = f'<section class="en-partners"><h2>{esc(T(lang, "Partners", "Partner"))}</h2>'
        srcs = []
        for kind, en, de in KINDS:
            items = [p for p in pa if p.get("kind") == kind]
            if items:
                h += f'<h3>{esc(T(lang, en, de))}</h3><ul>' + "".join(f'<li>{_a(p["url"], p["name"]) if _url(p.get("url")) else esc(p["name"])}</li>' for p in items) + "</ul>"
                srcs += [p["source"] for p in items if _url(p.get("source"))]
        srcs = list(dict.fromkeys(srcs))
        if srcs:
            h += f'<p class="mut">{esc(T(lang, "Source", "Quelle"))}: ' + ", ".join(_a(s) for s in srcs) + "</p>"
        out += h + "</section>"
    ce = [c for c in (e.get("certifications") or []) if c.get("name")]
    if ce:
        out += (f'<section class="en-certs"><h2>{esc(T(lang, "Certifications", "Zertifizierungen"))}</h2><ul>' + "".join(
            f'<li>{esc(c["name"])}' + (f' <span class="mut">· {esc(T(lang, "issued by", "ausgestellt von"))} {esc(c["issuer"])}</span>' if c.get("issuer") else "") + _src(lang, c.get("source")) + "</li>" for c in ce) + "</ul></section>")
    return out


def _org_ref(ents, base, x):
    return {"@id": f"{base}/entity/{x}/#entity"}


def ld_extra(BASE, e, ents):
    """Schema.org-Felder aus den Faktenfeldern (nur vorhandene)."""
    n, t = {}, e.get("type")
    if t == "org":
        if e.get("legal_form") and str(e["name"]).endswith(e["legal_form"]):
            n["legalName"] = e["name"]
        reg = e.get("register") or {}
        if reg.get("number") and reg.get("court"):
            n["identifier"] = {"@type": "PropertyValue", "propertyID": "Handelsregister", "value": f'{reg["number"]}, {reg["court"]}', **({"url": reg["url"]} if _url(reg.get("url")) else {})}
        emp = e.get("employees") or {}
        m = re.search(r"\d+", str(emp.get("value") or ""))
        if m:
            q = {"@type": "QuantitativeValue", "value": int(m.group(0))}
            if emp.get("as_of"):
                q["description"] = f'{emp["value"]} (as of {emp["as_of"]})'
            n["numberOfEmployees"] = q
        if e.get("founders"):
            n["founder"] = [_org_ref(ents, BASE, x) for x in e["founders"] if x in ents]
        ce = [{"@type": "Certification", "name": c["name"], **({"issuedBy": {"@type": "Organization", "name": c["issuer"]}} if c.get("issuer") else {})} for c in (e.get("certifications") or []) if c.get("name")]
        if ce:
            n["hasCertification"] = ce
        cs = [{"@type": "CreativeWork", "name": c.get("title") or c["name"], "url": c["case_study_url"], "about": {"@type": "Organization", "name": c["name"]}}
              for c in (e.get("customers") or []) if c.get("name") and _url(c.get("case_study_url"))]
        if cs:
            n["subjectOf"] = cs
    if t in ("product", "platform"):
        if "browser" in str(e.get("deployment") or "").lower():
            n["operatingSystem"] = "Web browser"
        if e.get("release_year") and not e.get("released"):
            n["datePublished"] = str(e["release_year"])
    if t == "person":
        ps = [p for p in (e.get("positions") or []) if p.get("title")]
        if ps:
            n["hasOccupation"] = [{"@type": "Occupation", "name": p["title"]} for p in ps]
            n["_worksFor"] = [_org_ref(ents, BASE, p["org"]) for p in ps if p.get("org") in ents and not p.get("end")]
    return n
