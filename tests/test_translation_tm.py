"""Uebersetzungsspeicher (TM): nur neue/geaenderte Einheiten sind offen. Keine API."""
import pytest

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
    return tmp_path


def translate_all(lang, p, tm, have):
    """Simuliert den Batch: uebersetzt alle offenen Einheiten (wie collect) und gibt die dafuer 'bezahlten' ids zurueck."""
    tpl, units, h = TB.source_of(p)
    rec, _ = TB.resolve(lang, p, units, h, have, tm)
    paid = [i for i, _t in units if i not in rec["seg"]]
    for i, t in units:
        if i in paid:
            rec["seg"][i] = f"{lang}:{t}"; TB.tm_put(tm, i, t, rec["seg"][i], "test")
    rec["ok"] = all(i in rec["seg"] for i, _ in units); have[p["slug"]] = rec
    return paid


def test_edit_one_paragraph_only_that_unit_pending(out):
    tm, have = {}, {}
    assert len(translate_all("de", post(PARAS), tm, have)) == 10   # T, D, 8 Absaetze
    edited = list(PARAS); edited[3] = "A completely new fourth paragraph about Copilot rollout plans."
    p2 = post(edited); tpl, units, h = TB.source_of(p2)
    rec, dirty = TB.resolve("de", p2, units, h, have, tm)
    assert dirty and not rec["ok"]
    assert [i for i, _ in units if i not in rec["seg"]] == ["4"]
    assert [c for c in TB.chunks(units, rec["seg"])] == [[("4", edited[3])]]


def test_inserted_paragraph_remaps_ids(out):
    tm, have = {}, {}
    translate_all("de", post(PARAS), tm, have)
    ins = PARAS[:2] + ["Brand new inserted paragraph about Purview labels for everyone."] + PARAS[2:]
    p2 = post(ins); tpl, units, h = TB.source_of(p2)
    rec, _ = TB.resolve("de", p2, units, h, have, tm)
    assert [i for i, _ in units if i not in rec["seg"]] == ["3"]
    for k in range(4, 10):   # alte Absatz 3..8 stehen jetzt unter 4..9
        assert rec["seg"][str(k)] == f"de:{PARAS[k - 2]}"
    TB.tm_put(tm, "3", ins[2], "de:new", "test"); rec["seg"]["3"] = "de:new"
    assert TB.resolve("de", p2, units, h, {"a-post": rec}, tm)[0]["seg"]["3"] == "de:new"


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


# ---- Show / Notes ----
def ep(name="Episode title", summary="Episode summary text."):
    return {"slug": "ep-1", "name": name, "summary": summary, "show_notes": ""}


def test_show_unchanged_skipped_changed_pending():
    e = ep(); h = TS.show_hash(e)
    have = {"ep-1": ["Titel", "Zusammenfassung"]}
    hashes = {}
    assert TS.sync_hashes(have, hashes, {"ep-1": h}) == 1   # Altbestand: Hash ohne API
    assert not TS.is_pending("ep-1", have, hashes, h)
    h2 = TS.show_hash(ep(summary="Episode summary text, now edited."))
    assert h2 != h and TS.is_pending("ep-1", have, hashes, h2)
    assert TS.is_pending("ep-2", have, hashes, h)   # neue Folge
    assert TS.sync_hashes(have, hashes, {"ep-1": h2}) == 0   # vorhandener Hash wird nie ueberschrieben
