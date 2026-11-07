"""Uebersetzungsspeicher (TM): nur neue/geaenderte Einheiten sind offen. Keine API."""
import json, sys

import pytest

import i18n_overrides as OV
import translate_blog as TB
import translate_show as TS
from tm_hash import unit_hash, norm

PARAS = [f"Paragraph number {i} talks about Microsoft 365 governance in some detail for admins." for i in range(1, 9)]


def post(paras, slug="a-post", title="A title for the post"):
    return {"slug": slug, "title": title, "desc": "Short description of the post.", "html": "".join(f"<p>{x}</p>" for x in paras)}


@pytest.fixture
def out(tmp_path, monkeypatch):
    monkeypatch.setattr(TB, "OUT", tmp_path / "blog_i18n")
    monkeypatch.setattr(TB, "_SRC", {})
    monkeypatch.setattr(OV, "DIR", tmp_path / "ov"); OV.clear_cache()
    monkeypatch.delenv("I18N_OVERRIDES_API", raising=False)
    return tmp_path


def translate_all(lang, p, tm, have):
    """Simuliert den Batch (wie collect): uebersetzt alle offenen Einheiten, gibt die 'bezahlten' ids zurueck."""
    tpl, units, h = TB.source_of(p)
    rec, _ = TB.resolve(lang, p, units, h, have, tm)
    paid = [i for i, t in TB.open_units(rec, units)]
    for i, t in units:
        if i in paid: TB.store(rec, i, t, f"{lang}:{t}"); TB.tm_put(tm, i, t, f"{lang}:{t}", "test")
    rec["ok"] = all(i in rec["seg"] for i, _ in units); have[p["slug"]] = rec
    return paid


def run_args(monkeypatch, *argv):
    monkeypatch.setattr(sys, "argv", ["translate_blog.py", *argv]); return TB.args()


def fake_api(monkeypatch, posts):
    sent = []
    monkeypatch.setattr(TB, "posts", lambda: posts)
    monkeypatch.setattr(TB, "check_budget", lambda *a, **k: True)
    monkeypatch.setattr(TB, "api", lambda m, path, body=None, raw=False: (sent.append(body) or {"id": "b%d" % len(sent)}))
    return sent


def sent_units(sent):
    import re
    return [m for body in sent for r in body["requests"] for m in re.findall(r"^\[\[(\w+)\]\]", r["params"]["messages"][0]["content"], re.M)]


def test_changed_source_is_stale_and_not_sent(out, monkeypatch):
    tm, have = {}, {}
    translate_all("de", post(PARAS), tm, have); TB.save_lang("de", have)
    edited = list(PARAS); edited[3] = "A completely new fourth paragraph about Copilot rollout plans."
    p2 = post(edited); tpl, units, h = TB.source_of(p2)
    rec, dirty = TB.resolve("de", p2, units, h, have, tm)
    assert dirty and rec["ok"] and rec["seg"]["4"] == f"de:{PARAS[3]}"   # alter Text bleibt stehen
    assert TB.stale_ids(rec, units) == ["4"] and TB.open_units(rec, units) == []
    sent = fake_api(monkeypatch, [p2])
    TB.submit(run_args(monkeypatch, "auto", "--langs", "de"))
    assert sent == []   # kein API-Aufruf: Uebersetzung wird nie automatisch ersetzt
    TB.OUT.mkdir(parents=True, exist_ok=True)
    monkeypatch.setattr(TB, "LANGS", ("de",))
    TB.status(); assert json.loads((TB.OUT / "stale.json").read_text()) == {"de": {"a-post": ["4"]}}


def test_stale_mode_sends_only_changed_units(out, monkeypatch):
    tm, have = {}, {}
    translate_all("de", post(PARAS), tm, have); TB.save_lang("de", have); TB.save_tm("de", tm)
    edited = list(PARAS); edited[3] = "A completely new fourth paragraph about Copilot rollout plans."; edited[6] = "Another rewritten paragraph seven about Entra conditional access."
    p2 = post(edited); sent = fake_api(monkeypatch, [p2])
    assert TB.submit(run_args(monkeypatch, "stale", "--langs", "de", "--slugs", "a-post")) > 0
    assert sorted(sent_units(sent)) == ["4", "7"]
    # Ergebnis uebernehmen: nur diese Einheiten werden ersetzt, Rest bleibt
    tpl, units, h = TB.source_of(p2); have = TB.load_lang("de"); rec, _ = TB.resolve("de", p2, units, h, have, tm)
    for i in ("4", "7"): assert TB.store(rec, i, dict(units)[i], "de:neu")
    assert TB.stale_ids(rec, units) == [] and rec["seg"]["1"] == f"de:{PARAS[0]}"
    assert not TB.store(rec, "1", dict(units)["1"], "x")   # aktuelle Einheit nie ueberschrieben


def test_inserted_paragraph_remaps_ids(out):
    tm, have = {}, {}
    translate_all("de", post(PARAS), tm, have)
    ins = PARAS[:2] + ["Brand new inserted paragraph about Purview labels for everyone."] + PARAS[2:]
    p2 = post(ins); tpl, units, h = TB.source_of(p2)
    rec, _ = TB.resolve("de", p2, units, h, have, tm)
    assert TB.open_units(rec, units) == [("3", ins[2])] and TB.stale_ids(rec, units) == []
    for k in range(4, 10): assert rec["seg"][str(k)] == f"de:{PARAS[k - 2]}"   # alte Absatz 3..8 stehen jetzt unter 4..9


def test_edit_one_paragraph_only_that_unit_stale_via_realign_without_tm(out):
    tm, have = {}, {}
    translate_all("de", post(PARAS), tm, have)
    edited = list(PARAS); edited[0] = "Changed first paragraph, entirely different words about Intune."
    p2 = post(edited); tpl, units, h = TB.source_of(p2)
    rec, _ = TB.resolve("de", p2, units, h, have, {})
    assert TB.stale_ids(rec, units) == ["1"] and len(rec["seg"]) == len(units)


def test_whitespace_only_change_reuses():
    assert unit_hash("1", "a  b\n c") == unit_hash("1", " a b c ")
    assert unit_hash("1", "x") != unit_hash("T", "x") and norm("a\t b") == "a b"


def test_qa_failed_unit_not_in_tm(out):
    src = "This <strong>text</strong> has a tag that must survive the translation step intact."
    ok, why, _ = TB.qa("de", src, "Dieser Text hat kein Tag mehr und ist deshalb ungueltig im Test.")
    assert not ok and why == "html-tags"
    # Aufrufer speichert nur bei ok: tm_put hinter qa() - hier das Muster aus collect/apply
    tm = {}
    good, _r, _w = TB.qa("de", src, "Dieser <strong>Text</strong> hat ein Tag, das die Uebersetzung ueberlebt.")
    if good: TB.tm_put(tm, "1", src, "x", "t")
    assert len(tm) == 1
    src2 = "Another <em>unit</em> whose broken translation must never reach the memory."
    bad_ok, _r, _w = TB.qa("de", src2, "kaputt")
    if bad_ok: TB.tm_put(tm, "2", src2, "y", "t")
    assert not bad_ok and unit_hash("2", src2) not in tm


def test_collect_and_apply_store_only_qa_ok(out, monkeypatch):
    """apply (Weg B) legt nur QA-gute Segmente ins TM."""
    p = post(["This <em>first</em> paragraph keeps its emphasis tag after translation, always."])
    tpl, units, h = TB.source_of(p)
    work = out / "work"; monkeypatch.setattr(TB, "WORK", work); monkeypatch.setattr(TB, "BY_SLUG", {p["slug"]: p})
    (work / "de").mkdir(parents=True)
    (work / "de" / "k.in.txt").write_text('# {"slug": "a-post", "h": "%s", "lang": "de"}\n' % h)
    (work / "de" / "k.out.txt").write_text("[[T]] Ein Titel fuer den Beitrag\n[[D]] Kurze Beschreibung des Beitrags.\n[[1]] Dieser Absatz hat das Tag verloren, daher ungueltig.\n")
    TB.apply({})
    tm = TB.load_tm("de")
    assert unit_hash("T", p["title"]) in tm and unit_hash("D", p["desc"]) in tm
    assert unit_hash("1", units[2][1]) not in tm


def test_migration_builds_tm_without_api(out, monkeypatch):
    p, q = post(PARAS), post(PARAS, slug="changed")
    tpl, units, h = TB.source_of(p)
    have = {"a-post": {"h": h, "n": len(units), "seg": {i: f"de:{t}" for i, t in units}, "ok": True, "m": "old"},
            "changed": {"h": "stale", "n": 1, "seg": {"1": "alt"}, "ok": True}}
    TB.save_lang("de", have)
    monkeypatch.setattr(TB, "api", lambda *a, **k: pytest.fail("API call"))
    n = TB.migrate([p, q])
    tm = TB.load_tm("de")
    assert len(tm) == len(units) and tm[unit_hash("1", PARAS[0])]["t"] == f"de:{PARAS[0]}"
    assert (TB.OUT / "tm" / "fr.json.gz").exists() and TB.load_tm("fr") == {}
    # zweiter Lauf aendert nichts
    assert TB.migrate([p, q]) == 0
    # Artikel mit Bestands-Hash und TM: nichts offen; Kostenschaetzung zaehlt nur fehlende Einheiten
    rec, dirty = TB.resolve("de", p, units, h, have, tm)
    assert not dirty and rec["ok"]
    changed = list(PARAS); changed[0] = "Only this first paragraph changed in the English source text."
    p3 = post(changed); _t, u3, h3 = TB.source_of(p3)
    rec3, _ = TB.resolve("de", p3, u3, h3, have, tm)
    pend = [u for u in u3 if u[0] not in rec3["seg"]]
    assert [i for i, _ in pend] == ["1"]
    assert TB.est("de", pend)[1] < TB.est("de", u3)[1] / 5   # Ausgabe-Tokens: 1 von 10 Einheiten


def test_fully_reused_article_becomes_ok_without_api(out):
    tm, have = {}, {}
    translate_all("de", post(PARAS), tm, have)
    p2 = post(PARAS + [PARAS[0]])   # nur ein Absatz doppelt: alles im TM
    tpl, units, h = TB.source_of(p2)
    rec, dirty = TB.resolve("de", p2, units, h, have, tm)
    assert dirty and rec["ok"] and rec["m"] == "tm"


def test_assemble_reads_seg_like_before(out):
    tm, have = {}, {}
    p = post(PARAS); translate_all("de", p, tm, have)
    t, d, html, faq = TB.assemble(p, have["a-post"])
    assert t.startswith("de:") and "<p>de:Paragraph number 2" in html


def test_manual_override_never_overwritten_and_applied(out, monkeypatch):
    tm, have = {}, {}
    p = post(PARAS); translate_all("de", p, tm, have); TB.save_lang("de", have)
    (OV.DIR / "blog").mkdir(parents=True); (OV.DIR / "blog" / "de.json").write_text(json.dumps({"a-post": {"3": "Von Hand bearbeiteter Absatz drei."}}), encoding="utf-8"); OV.clear_cache()
    tpl, units, h = TB.source_of(p)
    # 1) im gerenderten Text
    t, d, html, faq = TB.assemble(p, have["a-post"], "de")
    assert "Von Hand bearbeiteter Absatz drei." in html and f"de:{PARAS[2]}" not in html and f"de:{PARAS[1]}" in html
    assert "Von Hand" not in TB.assemble(p, have["a-post"], "fr")[2] if TB.assemble(p, have["a-post"], "fr") else True
    # 2) --redo ueberschreibt nur Maschinentext
    rec, _ = TB.resolve("de", p, units, h, have, tm, redo=True)
    assert rec["seg"]["3"] == "Von Hand bearbeiteter Absatz drei." and rec["manual"] == ["3"]
    assert "3" not in [i for i, _ in TB.open_units(rec, units)] and len(TB.open_units(rec, units)) == len(units) - 1
    assert not TB.store(rec, "3", dict(units)["3"], "maschine", {"3"})
    # 3) manuelle Einheit wird auch bei Quelle-geaendert nicht stale/gesendet
    edited = list(PARAS); edited[2] = "Source of the manually edited paragraph changed in English."
    p2 = post(edited); sent = fake_api(monkeypatch, [p2])
    TB.submit(run_args(monkeypatch, "stale", "--langs", "de")); assert sent == []
    # 4) nur mit --force-manual wird sie neu gesendet
    TB.submit(run_args(monkeypatch, "stale", "--langs", "de", "--force-manual")) or None
    rec_fm, _ = TB.resolve("de", p, units, h, have, tm, redo=True, force_manual=True)
    assert "3" in [i for i, _ in TB.open_units(rec_fm, units)]


def test_show_and_notes_overrides_applied(out):
    (OV.DIR / "show").mkdir(parents=True); (OV.DIR / "notes").mkdir(parents=True)
    (OV.DIR / "show" / "de.json").write_text(json.dumps({"ep-1": {"title": "Eigener Titel"}}), encoding="utf-8")
    (OV.DIR / "notes" / "de.json").write_text(json.dumps({"ep-1": {"html": "<p>Eigene Notes</p>"}}), encoding="utf-8"); OV.clear_cache()
    assert OV.apply_show("de", {"ep-1": ["Maschine", "Zusammenfassung"]})["ep-1"] == ["Eigener Titel", "Zusammenfassung"]
    assert OV.apply_notes("de", {"ep-1": "<p>x</p>"})["ep-1"] == "<p>Eigene Notes</p>"
    assert OV.apply_show("fr", {"ep-1": ["a", "b"]}) == {"ep-1": ["a", "b"]}


# ---- Show / Notes ----
import translate_show as TS2


def ep(name="Episode title", summary="Episode summary text."):
    return {"slug": "ep-1", "name": name, "summary": summary, "show_notes": ""}


def test_show_unchanged_ok_changed_stale_never_wanted(out):
    e = ep(); h = TS.show_hash(e)
    have = {"ep-1": ["Titel", "Zusammenfassung"]}; hashes = {}
    assert TS.sync_hashes(have, hashes, {"ep-1": h}) == 1   # Altbestand: Hash ohne API
    assert TS.state("ep-1", have, hashes, h) == "ok" and not TS.wanted("ok", False) and not TS.wanted("ok", True)
    h2 = TS.show_hash(ep(summary="Episode summary text, now edited."))
    st = TS.state("ep-1", have, hashes, h2)
    assert st == "stale" and not TS.wanted(st, False)   # Automatik fasst Vorhandenes nie an
    assert TS.wanted(st, True)                           # nur --stale
    assert TS.changed_fields(hashes["ep-1"], h2, ("title", "summary")) == ["summary"]
    assert TS.state("ep-2", have, hashes, h) == "new" and TS.wanted("new", False)
    assert TS.state("ep-1", have, hashes, h2, manual=True) == "manual" and not TS.wanted("manual", True)
    assert TS.sync_hashes(have, hashes, {"ep-1": h2}) == 0


def test_update_stale_merges(out, monkeypatch):
    monkeypatch.setattr(TS, "OUT", out / "pi18n")
    TS.update_stale(("title", "summary"), {"de": {"ep-1": ["title"]}}, ["ep-1"])
    cur = TS.update_stale(("notes_html",), {"de": {"ep-1": ["notes_html"]}}, ["ep-1"])
    assert sorted(cur["de"]["ep-1"]) == ["notes_html", "title"]
    assert "de" not in TS.update_stale(("title", "summary", "notes_html"), {}, ["ep-1"])
