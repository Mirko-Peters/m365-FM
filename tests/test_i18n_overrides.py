"""Sprachfassungen-Editor (#319) gegen den Vertrag i18n-overrides v1 (i18n_overrides.py, #315): site_i18n_overrides wendet nichts an, sync() schreibt genau die
Dateien, die der Leser liest, note_*/publish liefern der Redaktion Original, angezeigte Fassung und Quell-Anker - und Texte aus der Redaktion erreichen die
Seite nie ungefiltert (Skript-, Ereignis- und javascript:-Nutzlasten ueber den echten Bau-Leser)."""
import json, re, shutil, sys, tempfile, unittest
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import i18n_overrides as OV   # noqa: E402
import site_i18n_overrides as OVR   # noqa: E402
import site_fetch as SF   # noqa: E402
import translate_blog as TB   # noqa: E402
import translate_show as TS   # noqa: E402

POST = {"slug": "p", "title": "Title", "desc": "Desc", "html": "<p>First paragraph.</p><p>Second paragraph.</p>", "faq": []}
XSS = ["Hallo <svg/onload=alert(document.domain)>", '<img src="x"onerror="alert(1)">', "<a href=javascript:alert(1)>x</a>", '<a href="&#106;avascript:alert(1)">x</a>',
       '<form action="javascript:alert(1)"><button>ok</button></form>', "<script>alert(1)</script>Text", '<b onclick="alert(1)" style="x">fett</b>', '<iframe src="https://evil.example/"></iframe>']
BAD = re.compile(r"<\s*(script|svg|iframe|form|button|object|embed)\b|\bon\w+\s*=|javascript:|&#106;", re.I)


def record():
    tpl, units, h = TB.source_of(POST)
    return units, h, {"h": h, "m": "x", "n": 1, "ok": True, "seg": {u: f"DE {t}" for u, t in units}, "sh": dict(TB.unit_hashes(units, h)[1])}


class Base(unittest.TestCase):
    def setUp(self):
        self.tmp = Path(tempfile.mkdtemp()); self.addCleanup(shutil.rmtree, self.tmp, True)
        for obj, name, val in ((OV, "DIR", self.tmp / "ov"), (OVR, "_NOTED", {}), (OVR, "_SHOW", {}), (OVR, "SHOW_STALE", self.tmp / "podpage_stale.json"), (TB, "_SRC", {})):
            p = patch.object(obj, name, val); p.start(); self.addCleanup(p.stop)
        OV.use_api(""); self.addCleanup(OV.use_api, "")

    def write(self, kind, lang, data):
        f = OV.DIR / kind / f"{lang}.json"; f.parent.mkdir(parents=True, exist_ok=True); f.write_text(json.dumps(data), "utf-8"); OV.clear_cache()

    def anchors(self):
        units, h, _ = record()
        return TB.unit_hashes(units, h)[1]


class Vertrag(Base):
    def test_modul_wendet_nichts_an(self):
        """Es gibt genau EINEN Anwender (i18n_overrides): keine apply-/load-Funktion mehr hier, kein zweiter Aufruf in den Sprach-Ladern."""
        for name in ("apply_blog", "apply_podpage", "load"):
            self.assertFalse(hasattr(OVR, name), name)
        for f in ("site_content_blog.py", "site_legacy_blog.py", "site_podpage.py", "site_register.py", "generate_site.py"):
            src = (ROOT / f).read_text("utf-8")
            self.assertNotRegex(src, r"(?<![\w])OVR\.apply_|_OV0\.apply_|site_i18n_overrides\.apply_", f)   # _OVR = i18n_overrides (#315), der einzige Anwender
        self.assertIn("TB.assemble(s, data.get(s[\"slug\"]), lang)", (ROOT / "site_content_blog.py").read_text("utf-8"))
        self.assertIn("TB.assemble(p[\"src\"], data.get(slug), lang)", (ROOT / "site_legacy_blog.py").read_text("utf-8"))

    def test_sync_schreibt_die_dateien_des_vertrags_und_behaelt_sie_offline(self):
        a = self.anchors()
        ans = {"/api/i18n/overrides?kind=lblog&lang=de": {"kind": "lblog", "lang": "de", "items": {"p": {"T": {"t": "Neuer Titel", "sh": a["T"]}, "1": {"t": "", "sh": a["1"]}}, "leer": {}}},
               "/api/i18n/overrides?kind=episode&lang=de": {"items": {"e1": {"title": {"t": "T neu", "sh": ""}}}}}
        with patch.object(SF, "fetch", lambda u, *x, **k: ans.get(u.split("m365.fm", 1)[-1])):
            self.assertEqual(OVR.sync("https://api-dub.m365.fm"), 2)
            self.assertEqual(json.loads((OV.DIR / "lblog" / "de.json").read_text("utf-8")), {"p": {"T": {"t": "Neuer Titel", "sh": a["T"]}}})
            self.assertTrue((OV.DIR / "episode" / "de.json").exists())
            # der Leser von #315 liest genau diese Dateien (Verzeichnisnamen = Arten der API)
            self.assertEqual(OV.get("lblog", "de", "p"), {"T": {"t": "Neuer Titel", "sh": a["T"]}})
            _, _, rec = record()
            self.assertEqual(TB.assemble(POST, rec, "de")[0], "Neuer Titel")
            ans.clear()   # Export nicht erreichbar: Dateien bleiben
            OVR.sync("https://api-dub.m365.fm"); self.assertTrue((OV.DIR / "lblog" / "de.json").exists())
            ans["/api/i18n/overrides?kind=lblog&lang=de"] = {"items": {}}   # alles zurueckgesetzt: Datei weg, Maschinentext gilt wieder (Vertrag 6)
            OVR.sync("https://api-dub.m365.fm"); self.assertFalse((OV.DIR / "lblog" / "de.json").exists())
            self.assertEqual(TB.assemble(POST, rec, "de")[0], "DE Title")

    def test_pfade_des_exports(self):
        ps = OVR.paths()
        self.assertEqual(len(ps), 3 * 14)
        self.assertIn("/api/i18n/overrides?kind=lblog&lang=de", ps); self.assertIn("/api/i18n/overrides?kind=notes&lang=ko", ps)
        self.assertTrue(set(ps) <= set(SF.PREFETCH))   # werden vorab parallel geholt


class Bereinigung(Base):
    """319-2: Handtexte sind fremde Eingaben. Was die Redaktion (oder ein manipulierter Export) liefert, geht nur bereinigt in die Seite."""

    def test_blog_nutzlasten_ueber_den_echten_zusammenbau(self):
        a = self.anchors(); _, _, rec = record()
        for bad in XSS:
            self.write("lblog", "de", {"p": {"1": {"t": bad, "sh": a["1"]}, "T": {"t": bad, "sh": a["T"]}}})
            r = TB.assemble(POST, rec, "de")
            self.assertIsNotNone(r, bad)
            title, desc, html, faq = r
            self.assertIsNone(BAD.search(html), (bad, html))
            self.assertIsNone(BAD.search(title), (bad, title))
            self.assertIn("DE Second paragraph.", html)   # der Rest der Fassung bleibt

    def test_erlaubtes_inline_html_bleibt(self):
        a = self.anchors(); _, _, rec = record()
        self.write("lblog", "de", {"p": {"1": {"t": 'Mit <strong>Hand</strong> und <a href="https://example.com/x">Link</a>', "sh": a["1"]}}})
        html = TB.assemble(POST, rec, "de")[2]
        self.assertIn("<strong>Hand</strong>", html); self.assertIn('href="https://example.com/x"', html)

    def test_titel_beschreibung_und_faq_sind_reiner_text_ohne_doppelte_maskierung(self):
        # Der Worker speichert T/D/Q/A als reinen Text (wie der Maschinentext); die Seiten maskieren beim Einsetzen. san() wuerde aus '&' ein '&amp;' machen,
        # das auf der Seite als "&amp;" stehen bliebe.
        post = {**POST, "title": "Q&A about Teams", "desc": "Tips & tricks", "faq": [{"name": "Why A&B?", "acceptedAnswer": {"text": "Because C&D."}}]}
        tpl, units, h = TB.source_of(post); a = TB.unit_hashes(units, h)[1]
        rec = {"h": h, "m": "x", "n": 1, "ok": True, "seg": {u: f"DE {t}" for u, t in units}, "sh": dict(a)}
        self.write("lblog", "de", {"p": {"T": {"t": 'Fragen & Antworten zu "Teams"', "sh": a["T"]}, "D": {"t": "Tipps &amp; <b>Tricks</b>", "sh": a["D"]},
                                         "Q1": {"t": "Warum A&B?", "sh": a["Q1"]}, "A1": {"t": "Weil <script>x</script>C&D.", "sh": a["A1"]}, "1": {"t": "R&D <b>x</b>", "sh": a["1"]}}})
        title, desc, html, faq = TB.assemble(post, rec, "de")
        self.assertEqual((title, desc), ('Fragen & Antworten zu "Teams"', "Tipps & Tricks"))
        self.assertEqual((faq[0]["name"], faq[0]["acceptedAnswer"]["text"]), ("Warum A&B?", "Weil x C&D."))
        self.assertIn("<p>R&amp;D <b>x</b></p>", html)   # Absaetze bleiben Inline-HTML und werden bereinigt
        view = TB.editor_view("de", post, rec)["units"]
        self.assertEqual(view[0][2], 'Fragen & Antworten zu "Teams"')   # die Redaktion sieht denselben Text, ein erneutes Speichern maskiert nichts doppelt

    def test_folgen_und_show_notes(self):
        for bad in XSS:
            self.write("episode", "de", {"e1": {"title": {"t": bad, "sh": ""}, "summary": {"t": bad, "sh": ""}}})
            self.write("notes", "de", {"e1": {"html": {"t": "<p>ok</p>" + bad, "sh": ""}}})
            show = OV.apply_show("de", {"e1": ["T alt", "S alt"]})["e1"]
            notes = OV.apply_notes("de", {"e1": "<p>alt</p>"})["e1"]
            for s in (*show, notes):
                self.assertIsNone(re.search(r"<\s*(script|svg|iframe|form|button)\b|\bon\w+\s*=|javascript:", s, re.I), (bad, s))
            self.assertNotIn("<", show[0]); self.assertNotIn("<", show[1])   # Titel und Zusammenfassung sind reiner Text

    def test_einheiten_fuer_die_redaktion_sind_ebenfalls_bereinigt(self):
        a = self.anchors(); _, _, rec = record()
        self.write("lblog", "de", {"p": {"1": {"t": XSS[0], "sh": a["1"]}}})
        OVR.note_blog("de", "p", POST, rec)
        out = self.tmp / "docs"; out.mkdir(); OVR.publish(out)
        raw = (out / "i18n-units" / "lblog" / "de.json").read_text("utf-8")
        self.assertIsNone(BAD.search(raw), raw)


class Zulieferung(Base):
    def test_blog_einheiten_mit_anker_bearbeitet_und_veraltet(self):
        a = self.anchors(); units, h, rec = record()
        OVR.note_blog("de", "p", POST, rec)   # weder veraltet noch bearbeitet: nicht vorgemerkt
        self.assertEqual(OVR._NOTED, {})
        self.write("lblog", "de", {"p": {"1": {"t": "Von Hand", "sh": a["1"]}}})
        OVR.note_blog("de", "p", POST, rec)
        v = OVR._NOTED[("lblog", "de")]["p"]
        self.assertEqual(v["edited"], ["1"]); self.assertEqual(v["stale"], [])
        by = {u[0]: u for u in v["units"]}
        self.assertEqual(by["T"], ["T", "Title", "DE Title", a["T"]])          # [id, Original, angezeigt, Quell-Anker]
        self.assertEqual(by["1"], ["1", "First paragraph.", "Von Hand", a["1"]])
        self.assertTrue(all(re.fullmatch(r"[0-9a-f]{8}", u[3]) for u in v["units"]))

    def test_blog_original_geaendert_handtext_bleibt_und_gilt_als_veraltet(self):
        a = self.anchors(); units, h, rec = record()
        self.write("lblog", "de", {"p": {"1": {"t": "Von Hand", "sh": a["1"]}}})
        neu = {**POST, "html": "<p>First paragraph, now changed.</p><p>Second paragraph.</p>"}
        OVR.note_blog("de", "p", neu, rec)
        v = OVR._NOTED[("lblog", "de")]["p"]
        self.assertEqual(v["stale"], ["1"]); self.assertEqual(v["edited"], ["1"])
        by = {u[0]: u for u in v["units"]}
        self.assertEqual(by["1"][1:3], ["First paragraph, now changed.", "Von Hand"])
        self.assertNotEqual(by["1"][3], a["1"])   # neuer Anker: speichert die Redaktion jetzt, passt der Handtext wieder zum Original
        out = self.tmp / "docs"; out.mkdir(); OVR.publish(out)
        self.assertEqual(json.loads((out / "i18n-stale.json").read_text("utf-8"))["items"], [{"kind": "lblog", "item": "p", "lang": "de", "units": ["1"]}])

    def test_folgen_und_show_notes_feldnamen_der_veraltet_liste(self):
        """319-4: data/podpage_i18n/stale.json nennt FELDER (title, summary, notes_html): title/summary gehoeren zur Art episode, notes_html zur Art notes (Einheit html)."""
        eps = [{"slug": "ep1", "name": "Ep one", "summary": "Sum one", "show_notes": "<p>Notes one</p>"}, {"slug": "ep2", "name": "Ep two", "summary": "Sum two", "show_notes": "<p>Notes two</p>"},
               {"slug": "ep3", "name": "Ep three", "summary": "Sum three", "show_notes": "<p>Notes three</p>"}]
        OVR.SHOW_STALE.write_text(json.dumps({"de": {"ep1": ["title", "notes_html"], "ep2": ["notes_html"]}}), "utf-8")
        self.write("episode", "de", {"ep3": {"summary": {"t": "S3 von Hand", "sh": TS.anchors(eps[2])["summary"]}}})
        TRL = {"de": OV.apply_show("de", {"ep1": ["T1 de", "S1 de"], "ep2": ["T2 de", "S2 de"], "ep3": ["T3 de", "S3 de"]})}
        NTL = {"de": OV.apply_notes("de", {"ep1": "<p>N1 de</p>", "ep2": "<p>N2 de</p>"})}
        OVR.note_podpage(eps, TRL, NTL)
        out = self.tmp / "docs"; out.mkdir(); OVR.publish(out)
        stale = json.loads((out / "i18n-stale.json").read_text("utf-8"))["items"]
        self.assertEqual(sorted((x["kind"], x["item"], tuple(x["units"])) for x in stale), [("episode", "ep1", ("title",)), ("notes", "ep1", ("html",)), ("notes", "ep2", ("html",))])
        ep = json.loads((out / "i18n-units" / "episode" / "de.json").read_text("utf-8"))
        self.assertEqual(sorted(ep), ["ep1", "ep3"])   # ep2: nur die Show Notes sind veraltet, nicht die Folge
        a1 = TS.anchors(eps[0])
        self.assertEqual(ep["ep1"]["units"], [["title", "Ep one", "T1 de", a1["title"]], ["summary", "Sum one", "S1 de", a1["summary"]]])
        self.assertEqual(ep["ep3"]["edited"], ["summary"]); self.assertEqual(ep["ep3"]["units"][1][2], "S3 von Hand")
        nt = json.loads((out / "i18n-units" / "notes" / "de.json").read_text("utf-8"))
        self.assertEqual(sorted(nt), ["ep1", "ep2"])
        self.assertEqual(nt["ep2"]["units"], [["html", TS.notes_source(eps[1]), "<p>N2 de</p>", TS.anchors(eps[1])["html"]]])
        self.assertEqual(nt["ep2"]["stale"], ["html"])

    def test_publish_laeuft_nach_dem_bau_der_show(self):
        """319-4: note_podpage laeuft in PP.build; publish() davor schriebe die Dateien ohne Folgen und Show Notes."""
        src = (ROOT / "generate_site.py").read_text("utf-8")
        self.assertEqual(src.count("OVR.publish(OUT)"), 1)
        self.assertGreater(src.index("OVR.publish(OUT)"), src.index("PP.build(_ctx)"))
        self.assertGreater(src.index("OVR.publish(OUT)"), src.index("CBL.translations("))
        self.assertIn("OVR.note_podpage(eps, TRL, NTL)", (ROOT / "site_podpage.py").read_text("utf-8"))


if __name__ == "__main__":
    unittest.main()
