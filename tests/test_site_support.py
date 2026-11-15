"""Unterstuetzen-Seite (site_support.py, PR #257): ohne PayPal-Name noindex und ohne Sitemap, mit PayPal-Name paypal.me-Links,
Sitemap-Eintrag, anonyme Eintraege als "Anonym" und gesperrte Ziele. Lauf: python3 -m pytest -q tests/test_site_support.py"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_support as SUP  # noqa: E402

BASE = "https://example.test"
TODAY = "2026-11-15"


def goal(gid, amount, recurring="once", requires=None):
    g = {"id": gid, "recurring": recurring, "amount": amount, "raised": 0,
         "title": {"en": f"Goal {gid}", "de": f"Ziel {gid}"}, "desc": {"en": f"Desc {gid}", "de": f"Beschreibung {gid}"}}
    if requires:
        g["requires"] = requires
    return g


def run(tmp_path, monkeypatch, data):
    p = tmp_path / "support.json"
    p.write_text(json.dumps(data, ensure_ascii=False), "utf-8")
    monkeypatch.setattr(SUP, "DATA", p)
    out, pages, sitemap = {}, {}, []

    def page(lang, title, desc, canonical, body, alts, ld, **kw):
        pages[lang] = kw
        return f'<html data-noindex="{kw.get("noindex")}">{body}</html>'

    g = dict(write=lambda path, html: out.__setitem__(path, html), page=page, header=lambda lang, cur: "<header></header>",
             footer=lambda lang: "<footer></footer>", BASE=BASE, sitemap=sitemap, TODAY=TODAY)
    SUP.build(g)
    return out, pages, sitemap


def test_ohne_paypal_noindex_und_keine_sitemap(tmp_path, monkeypatch):
    out, pages, sitemap = run(tmp_path, monkeypatch, {"paypal": "", "currency": "USD", "goals": [goal("a", 75)], "supporters": []})
    assert not SUP.active()
    assert set(out) == {"support/index.html", "de/unterstuetzen/index.html"}
    assert pages["en"]["noindex"] is True and pages["de"]["noindex"] is True
    assert sitemap == []
    assert "paypal.me" not in out["support/index.html"]
    assert "PayPal link coming soon" in out["support/index.html"]
    assert "PayPal-Link folgt" in out["de/unterstuetzen/index.html"]


def test_mit_paypal_links_sitemap_anonym_und_gesperrt(tmp_path, monkeypatch):
    data = {"paypal": "testhandle", "currency": "USD",
            "goals": [goal("a", 75), goal("b", 200, requires=["a"])],
            "supporters": [{"name": "Geheim", "amount": 10, "goal": "a", "date": "2026-11-01"},
                           {"name": "Auch geheim", "amount": 5, "goal": "a", "date": "2026-11-02", "public": False},
                           {"name": "Erika Muster", "amount": 20, "goal": "a", "date": "2026-11-03", "public": True}]}
    out, pages, sitemap = run(tmp_path, monkeypatch, data)
    assert SUP.active()
    en, de = out["support/index.html"], out["de/unterstuetzen/index.html"]
    assert pages["en"]["noindex"] is False and pages["de"]["noindex"] is False
    assert "https://paypal.me/testhandle/75USD" in en and "https://paypal.me/testhandle" in de
    assert [u for u, _, _ in sitemap] == [f"{BASE}/support/", f"{BASE}/de/unterstuetzen/"]
    # Nicht-oeffentliche Eintraege nur als eine Zeile "Anonym", ohne Namen
    assert "Anonym (2)" in de and "Anonymous (2)" in en
    assert "Geheim" not in de and "Auch geheim" not in en
    assert "Erika Muster" in de
    # Ziel b ist gesperrt, solange Ziel a (35 von 75) nicht erreicht ist: keine Zahl-Links fuer b
    assert 'class="sup-card locked" id="goal-b"' in en
    assert "https://paypal.me/testhandle/200USD" not in en
    assert "Starts once" in en and "Startet, sobald" in de
