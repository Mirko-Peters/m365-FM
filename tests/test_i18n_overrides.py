"""Leser der Redaktions-Aenderungen an Sprachfassungen: die echten Lader/Assembler mit einer temporaeren Override-Datei."""
import json, sys, tempfile
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import site_i18n_overrides as OVR
import translate_blog as TB

POST = {"slug": "p", "title": "Title", "desc": "Desc", "html": "<p>First paragraph.</p><p>Second paragraph.</p>", "faq": []}


def _fixture(tmp):
    tpl, units, h = TB.source_of(POST)
    seg = {u: f"DE {t}" for u, t in units}
    return tpl, units, h, {"p": {"h": h, "m": "x", "n": 1, "ok": True, "seg": seg}}


def test_blog_override_wird_im_echten_assemble_angewendet(tmp_path, monkeypatch):
    monkeypatch.setattr(OVR, "DIR", tmp_path)
    _, units, h, data = _fixture(tmp_path)
    ids = [u for u, _ in units]; first = [u for u in ids if u.isdigit()][0]
    before = TB.assemble(POST, data["p"])
    (tmp_path / "lblog").mkdir(); (tmp_path / "lblog" / "de.json").write_text(json.dumps({"p": {first: "Von Hand", "T": "Neuer Titel"}, "fehlt": {"1": "x"}}))
    d = OVR.apply_blog("de", {k: dict(v) for k, v in data.items()})
    title, desc, html, faq = TB.assemble(POST, d["p"])
    assert title == "Neuer Titel" and "Von Hand" in html and "DE " in html and before[0] != title
    assert "p" in d and "fehlt" not in d                      # unbekannte Eintraege erzeugen keine Fassung
    assert data["p"]["seg"]["T"] == "DE Title"                # Eingabe/Schale unveraendert
    assert OVR.apply_blog("fr", {"p": data["p"]})["p"] == data["p"]   # andere Sprache: kein Override


def test_override_ersetzt_keine_veraltete_fassung(tmp_path, monkeypatch):
    monkeypatch.setattr(OVR, "DIR", tmp_path)
    _, _, h, data = _fixture(tmp_path); data["p"]["h"] = "alt"
    (tmp_path / "lblog").mkdir(); (tmp_path / "lblog" / "de.json").write_text(json.dumps({"p": {"T": "X"}}))
    assert TB.assemble(POST, OVR.apply_blog("de", data)["p"]) is None   # Original geaendert -> weiter nicht anzeigen, bis neu uebersetzt


def test_podpage_und_notes(tmp_path, monkeypatch):
    monkeypatch.setattr(OVR, "DIR", tmp_path)
    for k, v in (("episode", {"e1": {"title": "T neu"}}), ("notes", {"e1": {"html": "<p>neu</p>"}})):
        (tmp_path / k).mkdir(); (tmp_path / k / "de.json").write_text(json.dumps(v))
    TRL = {"de": {"e1": ["T alt", "S alt"], "e2": ["a", "b"]}}; NTL = {"de": {"e1": "<p>alt</p>"}}
    OVR.apply_podpage(TRL, NTL)
    assert TRL["de"]["e1"] == ["T neu", "S alt"] and TRL["de"]["e2"] == ["a", "b"] and NTL["de"]["e1"] == "<p>neu</p>"


def test_sync_schreibt_dateien_und_behaelt_sie_offline(tmp_path, monkeypatch):
    import site_fetch as SF
    monkeypatch.setattr(OVR, "DIR", tmp_path)
    ans = {"/api/i18n/overrides?kind=lblog&lang=de": {"items": {"p": {"1": "x"}}}}
    monkeypatch.setattr(SF, "fetch", lambda u, *a, **k: ans.get(u.split("m365.fm", 1)[-1]))
    assert OVR.sync("https://api-dub.m365.fm") == 1
    assert json.loads((tmp_path / "lblog" / "de.json").read_text()) == {"p": {"1": "x"}}
    ans.clear()   # offline: Datei bleibt
    OVR.sync("https://api-dub.m365.fm"); assert (tmp_path / "lblog" / "de.json").exists()
    ans["/api/i18n/overrides?kind=lblog&lang=de"] = {"items": {}}   # alles zurueckgesetzt
    OVR.sync("https://api-dub.m365.fm"); assert not (tmp_path / "lblog" / "de.json").exists()


def test_publish_veraltet_und_einheiten(tmp_path, monkeypatch):
    monkeypatch.setattr(OVR, "DIR", tmp_path / "ov"); monkeypatch.setattr(OVR, "_NOTED", {})
    _, units, h, data = _fixture(tmp_path); data["p"]["h"] = "alt"
    OVR.note_blog("de", "p", POST, data["p"])
    out = tmp_path / "docs"; out.mkdir(); OVR.publish(out)
    st = json.loads((out / "i18n-stale.json").read_text())["items"]
    assert st[0]["item"] == "p" and st[0]["lang"] == "de" and "T" in st[0]["units"]
    u = json.loads((out / "i18n-units" / "lblog" / "de.json").read_text())["p"]
    assert u["units"][0] == ["T", "Title", "DE Title"]
