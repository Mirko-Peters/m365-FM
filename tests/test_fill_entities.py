"""fill_entities.py ohne API: Prompt, Pruefung, Hash-Skip, Budget, Ueberspringen, translate-once."""
import json, sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import fill_entities as F
import entity_fill_data as FD

LONG = ("Contoso Hub is a Microsoft 365 product used to organise team documents. " * 14).strip()   # ~160 Woerter
GOOD = {"desc": "Contoso Hub is a Microsoft 365 service for organising shared team documents.", "long": LONG, "faq": [{"q": "What is Contoso Hub?", "a": "A document service."}]}


def ent(i, t="product", **kw):
    return {"id": i, "type": t, "name": kw.pop("name", i.title()), "aliases": [], "desc": kw.pop("desc", {"en": "", "de": ""}), "web": "", "docs": kw.pop("docs", ""), "rel": kw.pop("rel", []), **kw}


def setup(monkeypatch):
    monkeypatch.setattr(F, "episodes_for", lambda e, limit=6: [])


def test_prompt_assembly(monkeypatch):
    setup(monkeypatch)
    e = ent("hub", name="Contoso Hub", docs="https://learn.microsoft.com/hub", rel=[["part_of", "m365"]], desc={"en": "A hub.", "de": ""})
    f = F.facts_for(e, {"hub": e, "m365": ent("m365", name="Microsoft 365")}, eps=[{"title": "Hub deep dive", "date": "2026-01-01"}])
    p = F.write_prompt(f, "full")
    assert "Contoso Hub" in p and "Hub deep dive" in p and "Microsoft 365" in p and "learn.microsoft.com/hub" in p
    assert "desc, long and faq" in p and "only" in F.write_prompt(f, "desc")
    assert "No superlatives" in F.SYSTEM_WRITE.replace("no superlatives", "No superlatives") or "superlatives" in F.SYSTEM_WRITE


def test_validate_write_ok_and_rejects(monkeypatch):
    setup(monkeypatch)
    f = {"name": "Contoso Hub", "aliases": [], "episodes": [{"title": "x"}], "relations": [], "docs_url": "", "official_site": ""}
    rec, err = F.validate_write(dict(GOOD), f, "full"); assert err is None and rec["long"] == LONG
    for bad, why in [({**GOOD, "long": LONG + " See https://contoso.com/x"}, "url"), ({**GOOD, "long": LONG.replace("Contoso Hub", "The tool")}, "name_missing"),
                     ({**GOOD, "long": "Contoso Hub is small."}, "long_length"), ({**GOOD, "long": LONG + " It is the best product."}, "superlative"),
                     ({**GOOD, "desc": "Short."}, "desc_length"), ({**GOOD, "desc": "Contoso Hub does one thing here. It does a second thing too."}, "desc_not_one_sentence"), (None, "no_json")]:
        assert F.validate_write(bad, f, "full")[1] == why, why
    sparse = {**f, "episodes": []}   # wenig bekannt: kurzer Text erlaubt
    assert F.validate_write({**GOOD, "long": "Contoso Hub is a Microsoft 365 service. " * 8}, sparse, "full")[1] is None
    assert F.validate_write({"desc": GOOD["desc"]}, f, "desc")[1] is None


def test_validate_translation_keeps_names():
    src = {"desc": "Contoso Hub works with SharePoint and Copilot for document teams in Microsoft 365."}
    ok = {"desc": "Contoso Hub funktioniert mit SharePoint und Copilot für Dokumententeams in Microsoft 365."}
    assert F.validate_translation("de", src, ok, F.KEEP + ["Contoso Hub"])[1] is None
    assert F.validate_translation("de", src, {"desc": "Contoso Hub arbeitet mit Freigabepunkt und Copilot in Microsoft 365 für Teams."}, F.KEEP)[1] == "name_changed"
    assert F.validate_translation("de", src, {"desc": "see https://x.com Contoso Hub SharePoint Copilot Microsoft 365 und viel Text hier"}, [])[1] == "url"
    assert F.validate_translation("ru", src, ok, [])[1] == "wrong_script"


def test_status_skips(monkeypatch):
    setup(monkeypatch)
    g, fill = {}, {}
    assert F.status(ent("ifakt"), g, fill, set(), set())[0] == "sponsored"
    assert F.status(ent("polaris-vsm"), g, fill, set(), set())[0] == "sponsored"
    assert F.status(ent("x"), g, fill, set(), {"x"})[0] == "sponsored"
    assert F.status(ent("a"), g, fill, {"a"}, set())[0] == "member_edited"
    assert F.status(ent("b", edited="2026-11-01"), g, fill, set(), set())[0] == "member_edited"
    assert F.status(ent("c"), g, fill, set(), set()) == (None, "full")
    assert F.status(ent("d", long={"en": "manual " * 30}, desc={"en": "x" * 100}), g, fill, set(), set()) == (None, None)   # redaktioneller Text bleibt
    assert F.status(ent("e", desc={"en": "x" * 100}), {"e": {"en": "t", "de": "t"}}, fill, set(), set()) == (None, None)   # GENTEXT zaehlt als Langtext
    assert F.status(ent("f", desc={"en": "short"}), {"f": {"en": "t"}}, fill, set(), set()) == (None, "desc")


def test_hash_skip_and_max_tries(monkeypatch):
    setup(monkeypatch)
    e = ent("c"); ents = {"c": e}
    todo, sk = F.build_todo(ents, {}, {}, {l: {} for l in F.LANGS}, set(), set(), {})
    assert todo[0]["write"] == "full"
    fill = {"c": {"h": "x", "desc": "d" * 50, "long": LONG}}   # schon geschrieben: nicht erneut
    todo, _ = F.build_todo(ents, {}, fill, {l: {} for l in F.LANGS}, set(), set(), {})
    assert not todo[0].get("write")
    todo, sk = F.build_todo(ents, {}, {}, {l: {} for l in F.LANGS}, set(), set(), {"tries": {"w:c": 3}})
    assert "max_tries" in sk and not any(r.get("write") for r in todo)


def test_budget_stop(monkeypatch):
    setup(monkeypatch)
    ents = {f"e{i}": ent(f"e{i}") for i in range(50)}
    todo = [{"id": i, "type": "product", "write": "full"} for i in ents]
    reqs, est = F.select_writes(todo, ents, 1000.0, 0, {})
    assert len(reqs) == 50 and est > 0
    one = est / 50
    reqs, est2 = F.select_writes(todo, ents, one * 10.5, 0, {})
    assert len(reqs) == 10 and est2 <= one * 10.5
    assert len(F.select_writes(todo, ents, 1000.0, 7, {})[0]) == 7
    assert F.select_writes(todo, ents, 0.0, 0, {})[0] == []


def test_person_without_source_is_skipped(monkeypatch):
    setup(monkeypatch)
    p = ent("jane-doe", "person", desc={"en": ""}); q = ent("john", "person", job="Cloud architect")
    todo, sk = F.build_todo({"jane-doe": p, "john": q}, {}, {}, {l: {} for l in F.LANGS}, set(), set(), {})
    assert sk["needs_source"] == ["jane-doe"] and [r["id"] for r in todo] == ["john"]


def test_translate_once():
    e = ent("c", desc={"en": "x" * 100, "de": "Handgeschrieben " * 6}, long={"en": LONG, "de": "Manueller Langtext"})
    src = F.effective_en(e, {}, {})
    assert F.translate_need(e, "de", src, {}, {"de": {}}) == {}   # de von Hand vorhanden
    assert set(F.translate_need(e, "fr", src, {}, {"fr": {}})) == {"desc", "long"}
    assert F.translate_need(e, "fr", src, {}, {"fr": {"c": {"desc": "a", "long": "b"}}}) == {}   # schon uebersetzt: nie wieder
    assert set(F.translate_need(e, "fr", src, {}, {"fr": {"c": {"desc": "a"}}})) == {"long"}
    assert F.translate_need(e, "de", src, {"c": {"en": "g", "de": "g"}}, {"de": {}}) == {}
    e2 = ent("g1", desc={"en": "x" * 100}); assert F.translate_need(e2, "de", F.effective_en(e2, {"g1": {"en": "G", "de": "G"}}, {}), {"g1": {"en": "G", "de": "G"}}, {"de": {}}).keys() == {"desc"}


def test_reader_precedence(monkeypatch):
    monkeypatch.setattr(FD, "EN", {"c": {"desc": "KI desc " * 8, "long": "KI long"}})
    monkeypatch.setattr(FD, "I18N", {"fr": {"c": {"desc": "FR desc"}}})
    assert FD.desc(ent("c", desc={"en": "short"}), "en").startswith("KI desc")
    assert FD.desc(ent("c", desc={"en": "x" * 100}), "en") == "x" * 100   # redaktionell vorn
    assert FD.desc(ent("c", desc={"en": "x" * 100}), "fr") == "FR desc"
    assert FD.desc(ent("c", desc={"en": "x" * 100}, edited="2026-11-01"), "fr") == "x" * 100   # Mitglied bearbeitet: kein KI-Text
    assert FD.long_text(ent("c", edited="x"), "en") == ""
