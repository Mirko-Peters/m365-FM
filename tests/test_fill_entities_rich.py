"""Langtext-Modus (--rich) von fill_entities.py: Auswahl, Pruefung (>= 2600 Zeichen, keine erfundenen Zahlen), Vorrang des KI-Langtexts vor kurzem GENTEXT."""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import fill_entities as F
import entity_fill_data as FD

PARA = ("Contoso Hub is a Microsoft 365 service for organising shared team documents. The episode \"Hub deep dive\" explains that teams use it to keep files, "
        "notes and tasks together and to decide who may edit which library. It also covers the typical rollout questions that administrators ask before they switch it on. ")
LONG = "\n\n".join([PARA * 4] * 3).strip()   # > 2600 Zeichen
FACTS = {"name": "Contoso Hub", "aliases": [], "type": "product", "short_description": "A hub.", "relations": [], "docs_url": "", "official_site": "",
         "episodes": [{"title": "Hub deep dive", "date": "2026-01-01", "excerpt": "Contoso Hub keeps files together."}]}
GOOD = {"desc": "Contoso Hub is a Microsoft 365 service for organising shared team documents.", "long": LONG, "faq": [{"q": "What is Contoso Hub?", "a": "A document service."}]}


def ent(i, t="product", **kw):
    return {"id": i, "type": t, "name": kw.pop("name", i.title()), "aliases": [], "desc": kw.pop("desc", {"en": "", "de": ""}), "web": "", "docs": "", "rel": [], **kw}


def test_rich_validation():
    assert len(LONG) > F.RICH_MIN_CHARS
    rec, err = F.validate_write(GOOD, FACTS, "rich"); assert err is None and rec["long"] == LONG
    short = dict(GOOD, long=PARA * 5)   # ~1.600 Zeichen
    assert F.validate_write(short, FACTS, "rich")[1] == "long_length"
    assert F.validate_write(dict(GOOD, long=LONG + "\n\nIt has 4711 users."), FACTS, "rich")[1] == "invented_number"
    assert F.validate_write(dict(GOOD, long=LONG + "\n\nSee https://example.com now."), FACTS, "rich")[1] == "url"
    assert F.validate_write(dict(GOOD, long=LONG.replace("Contoso Hub", "The service")), FACTS, "rich")[1] == "name_missing"


def test_rich_status(monkeypatch):
    monkeypatch.setattr(F, "RICH", True)
    st = lambda e, gen={}, fill={}: F.status(e, gen, fill, set(), set())
    assert st(ent("a")) == (None, "rich")
    assert st(ent("a"), gen={"a": {"en": "x" * 1200}}) == (None, "rich")          # kurzer Ueberblick wird ersetzt
    assert st(ent("a"), gen={"a": {"en": "x" * 2600}}) == (None, None)             # schon lang genug
    assert st(ent("a"), fill={"a": {"long": "x" * 2600, "desc": "d"}}) == (None, None)
    assert st(ent("a", long={"en": "Redaktion"})) == (None, None)                  # redaktionell nie
    assert st(ent("a", t="person")) == (None, None)
    assert st(ent("a", edited=True))[0] == "member_edited"
    monkeypatch.setattr(F, "RICH", False)
    assert st(ent("a")) == (None, "full")


def test_prompt_rich():
    p = F.write_prompt(FACTS, "rich")
    assert "2,700" in p and "Hub deep dive" in p and "at least 2,700 characters" in F.SYSTEM_WRITE_RICH and "Output ONLY one JSON object" in F.SYSTEM_WRITE_RICH
    assert "episode excerpts" in F.SYSTEM_WRITE_RICH and "No superlatives" in F.SYSTEM_WRITE_RICH


def test_fhash_ignores_rich_keys():
    a = dict(FACTS); b = dict(FACTS, overview="Existing overview text.", episodes=[])
    assert F.fhash(a) == F.fhash(b)


def test_source_gate():
    assert F.source_chars(FACTS) < F.RICH_MIN_SOURCE
    rich = dict(FACTS, episodes=[{"excerpt": "x" * 700}] * 3)
    assert F.source_chars(rich) >= F.RICH_MIN_SOURCE


def test_ai_long_beats_short_gentext_only_when_long_enough():
    assert FD.prefer_ai("x" * 1200, "y" * 2600)
    assert not FD.prefer_ai("x" * 2600, "y" * 3000)    # GENTEXT ab 2500 bleibt
    assert not FD.prefer_ai("x" * 1200, "y" * 2000)    # KI-Text unter der Schwelle ersetzt nichts
    e = ent("a")
    src = FD.effective_en(e, {"a": {"en": "x" * 1200}}, {"a": {"long": "y" * 2600, "desc": "d"}})
    assert src["long"] == "y" * 2600
    src = FD.effective_en(e, {"a": {"en": "x" * 1200}}, {"a": {"long": "y" * 2000, "desc": "d"}})
    assert src["long"] == "x" * 1200


def test_translate_need_for_rich(monkeypatch):
    e = ent("a", desc={"en": "d" * 90, "de": ""})
    gen = {"a": {"en": "x" * 1200, "de": "z" * 1200}}
    src = {"desc": "d" * 90, "long": "y" * 2600}
    need = F.translate_need(e, "de", src, gen, {})
    assert "long" in need   # GENTEXT.de (kurz) blockiert die Uebersetzung des neuen langen en-Textes nicht
    src2 = {"desc": "d" * 90, "long": "x" * 1200}
    assert "long" not in F.translate_need(e, "de", src2, gen, {})


def test_sources_loaded_and_used_as_facts(monkeypatch, tmp_path):
    import json
    monkeypatch.setattr(FD, "ROOT", tmp_path)
    (tmp_path / "data" / "entity_sources").mkdir(parents=True)
    (tmp_path / "data" / "entity_sources" / "x.json").write_text(json.dumps({
        "hub": {"url": "https://learn.microsoft.com/hub", "title": "Hub overview - Microsoft Learn", "notes": "Hub keeps files together. " * 40},
        "bad": {"url": "http://insecure.example", "title": "t", "notes": "n"}, "none": None}), encoding="utf-8")
    src = FD.load_sources()
    assert set(src) == {"hub"} and src["hub"]["url"].startswith("https://")
    monkeypatch.setattr(F, "_SRC", src); monkeypatch.setattr(F, "_GEN", {}); monkeypatch.setattr(F, "excerpts_for", lambda e: [])
    e = ent("hub", name="Contoso Hub", desc={"en": "A hub.", "de": ""})
    f = F.facts_for(e, {"hub": e}, rich=True)
    assert f["sources"][0]["title"].startswith("Hub overview") and F.source_chars(f) >= 1000
    assert F.fhash(f) == F.fhash({k: v for k, v in f.items() if k != "sources"})   # Quellen-Notizen sind nicht im Hash
