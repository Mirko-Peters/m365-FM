"""Abschlusstest des Lernpfads: Kasten auf der Pfadseite, Testseite (noindex, nicht in der Sitemap), eingebettete Fragen ohne Lösung,
Rückfall ohne data/pillar_quiz.json, Texte en/de, assets/learnquiz.js und Datenschutzerklärung (Spezifikation Teil C)."""
import contextlib
import io
import json
import re
import sys
import tempfile
import unittest
from pathlib import Path
from unittest import mock

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_infographics as IG
import site_legal as SL
import site_pillars as S

BASE = "https://www.m365.fm"
PID = "manufacturing-excellence"
EN_ONLY = "ifakt-polaris"   # Leitfaden ohne deutsche Fragen in der Testdatei: die deutsche Seite nimmt die englischen


def fixture():
    """Kleine Testdatei wie tools/pillar_quiz.py sie schreibt - absichtlich mit "a"/"why" in einer Frage, die nie auf die Seite dürfen."""
    pills = {}
    for p in S.pillars():
        pid = p["id"]
        en = [{"id": f"{pid}-{i}", "q": f"EN question {i} about {pid}?", "opts": [f"en opt {j}" for j in range(4)]} for i in range(1, 5)]
        de = [{"id": f"{pid}-{i}", "q": f"DE Frage {i} zu {pid}?", "opts": [f"de Option {j}" for j in range(4)]} for i in range(1, 5)]
        en[0]["a"] = 2; en[0]["why"] = "GEHEIM-WHY"; de[0]["a"] = 2; de[0]["why"] = "GEHEIM-WARUM"
        pills[pid] = {"en": en} if pid == EN_ONLY else {"en": en, "de": de}
    return {"_": "Testdatei", "path": PID, "version": "2026-11-24", "pillars": pills}


def build(quiz):
    """Baut alle Pillar-Seiten mit der Testdatei quiz (dict, Text oder None = Datei fehlt) -> (files, sitemap, pages)."""
    d = tempfile.mkdtemp()
    f = Path(d) / "pillar_quiz.json"
    if quiz is not None: f.write_text(quiz if isinstance(quiz, str) else json.dumps(quiz), "utf-8")
    files, sm, pages = {}, [], {}

    def page(lang, title, desc, canon, body, alts, ld, **kw):
        pages[canon] = {"lang": lang, "title": title, "desc": desc, "alts": alts, "ld": ld, **kw}
        return body
    g = dict(BASE=BASE, write=lambda rel, html: files.__setitem__(rel, html), sitemap=sm, author_box=None, LANGS=("en", "de"), page=page, api="https://api-dub.m365.fm",
             header=lambda l, x: "", footer=lambda l: "", footer_en=lambda: "")
    try:
        with contextlib.redirect_stdout(io.StringIO()), mock.patch.object(S, "active", lambda: ("en", "de")), mock.patch.object(IG, "get", lambda *a: None), \
                mock.patch.object(S, "QUIZ_FILE", f):
            S.build(g, [], set())
    finally:
        if f.exists(): f.unlink()
        Path(d).rmdir()
    return files, sm, pages


def embedded(html):
    m = re.search(r'<script type="application/json" id="lq-data">(.*?)</script>', html, re.S)
    return json.loads(m.group(1)) if m else None


def config(html):
    m = re.search(r"<script>window\.M365LQ=(.*?)</script>", html, re.S)
    return json.loads(m.group(1)) if m else None


class WithQuiz(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.files, cls.sm, cls.pages = build(fixture())
        cls.en, cls.de = cls.files[f"learn/path/{PID}/test/index.html"], cls.files[f"de/learn/path/{PID}/test/index.html"]

    def test_box_on_path_pages(self):
        for rel, link, head in ((f"learn/path/{PID}/index.html", f"{BASE}/learn/path/{PID}/test/", "Final test &amp; certificate"),
                                (f"de/learn/path/{PID}/index.html", f"{BASE}/de/learn/path/{PID}/test/", "Abschlusstest &amp; Zertifikat")):
            h = self.files[rel]
            box = h[h.index('class="pl-box pl-quiz"'):]
            self.assertIn(head, box)
            self.assertIn(f'href="{link}"', box)
            self.assertNotIn(S.tx("de", "q_soon"), box); self.assertNotIn(S.tx("en", "q_soon"), box)
            self.assertGreater(h.index("pl-quiz"), h.rindex("pl-stage"), "Kasten steht nach den Stufen")
        de = self.files[f"de/learn/path/{PID}/index.html"]
        for s in ("Kostenlos", "Anmeldung", "30 Fragen", "80 %", "(24 von 30 richtig)", "Certopus"): self.assertIn(s, de)
        en = self.files[f"learn/path/{PID}/index.html"]
        for s in ("Free of charge", "Sign-in", "30 questions", "80 %", "(24 of 30 correct)", "Certopus"): self.assertIn(s, en)

    def test_test_pages_noindex_and_not_in_sitemap(self):
        for lang in ("en", "de"):
            u = S.quiz_url(BASE, lang)
            self.assertTrue(self.pages[u]["noindex"], lang)
            self.assertIsNone(self.pages[u]["alts"], "kein hreflang auf noindex-Seiten")
            self.assertNotIn(u, [x[0] for x in self.sm])
            self.assertTrue(any(x[0] == S.path_url(BASE, lang) for x in self.sm), "Pfadseite bleibt in der Sitemap")
            self.assertEqual(self.pages[u]["switch"], {"en": S.quiz_url(BASE, "en"), "de": S.quiz_url(BASE, "de")})
        self.assertEqual(len(re.findall(r"<h1[ >]", self.en)), 1)
        self.assertIn("learnquiz.js?v=", self.en)
        self.assertIn('id="lq-app"', self.de)

    def test_embedded_json_without_answers(self):
        for html in (self.en, self.de):
            raw = re.search(r'id="lq-data">(.*?)</script>', html, re.S).group(1)
            self.assertNotIn("GEHEIM", html)
            self.assertNotRegex(raw, r'"(a|why|answer|correct)"\s*:')
            d = embedded(html)
            self.assertEqual(d["path"], PID)
            for g in d["groups"]:
                self.assertEqual(set(g), {"id", "t", "u", "qs"})
                for q in g["qs"]:
                    self.assertEqual(set(q), set(S.QUIZ_KEYS))
                    self.assertEqual(len(q["opts"]), 4)
        self.assertEqual(len(embedded(self.en)["groups"]), 10)

    def test_languages_and_guide_links(self):
        en, de = embedded(self.en), embedded(self.de)
        self.assertEqual((en["lang"], de["lang"]), ("en", "de"))
        dg = {g["id"]: g for g in de["groups"]}
        self.assertTrue(dg["lean-manufacturing"]["qs"][0]["q"].startswith("DE Frage"))
        self.assertEqual(dg["lean-manufacturing"]["u"], f"{BASE}/de/learn/lean-management/")
        self.assertEqual(dg["lean-manufacturing"]["t"], "Lean Management")
        self.assertTrue(dg[EN_ONLY]["qs"][0]["q"].startswith("EN question"), "fehlt die deutsche Fassung, gilt die englische")
        self.assertEqual([q["id"] for q in dg[EN_ONLY]["qs"]], [q["id"] for q in {g["id"]: g for g in en["groups"]}[EN_ONLY]["qs"]], "gleiche IDs in en und de")
        self.assertEqual([g["id"] for g in en["groups"]], [p["id"] for p in S.order()], "Lernreihenfolge")

    def test_config_for_script(self):
        c, d = config(self.en), config(self.de)
        self.assertEqual((c["path"], c["qlang"], d["qlang"]), (PID, "en", "de"))
        self.assertEqual(c["api"], "https://api-dub.m365.fm")
        self.assertEqual(c["privacy"], f"{BASE}/privacy/#learning-path-certificate")
        self.assertEqual(d["privacy"], f"{BASE}/datenschutz/#lernpfad-zertifikat")
        self.assertEqual(set(c["t"]), set(S.JS_KEYS))
        self.assertEqual(d["t"]["q_cert_off"], S.UI["q_cert_off"][1])

    def test_other_language_uses_english_questions(self):
        doc = fixture()
        gr = S.quiz_groups(doc, "fr", lambda p: S.url(BASE, p, "fr"))
        self.assertTrue(all(q["q"].startswith("EN question") for g in gr for q in g["qs"]))
        self.assertEqual(gr[0]["u"], f"{BASE}/fr/learn/lean-manufacturing/")
        seen = {}
        g = dict(BASE=BASE, api="https://api-dub.m365.fm", header=lambda l, x: "", footer=lambda l: "", footer_en=lambda: "", LANGS=("en", "de"),
                 page=lambda lang, title, desc, canon, body, alts, ld, **kw: seen.update(canon=canon, noindex=kw.get("noindex")) or body)
        html = S.quiz_page(g, "fr", gr, S.registry()["path"], [("Learn", BASE + "/fr/learn/")], ["en", "de", "fr"])
        self.assertEqual(seen, {"canon": f"{BASE}/fr/learn/path/{PID}/test/", "noindex": True})
        self.assertEqual(config(html)["qlang"], "en")
        self.assertEqual(config(html)["t"]["q_start"], S.tx("fr", "q_start"))

    def test_numbers(self):
        gr = embedded(self.en)["groups"]
        self.assertEqual(S.quiz_numbers(gr), (30, 24))
        self.assertEqual(S.quiz_numbers([{"qs": [1, 2]}, {"qs": [1, 2, 3, 4, 5]}]), (5, 4))
        self.assertEqual(S.quiz_numbers([]), (30, 24), "ohne Fragen: 3 je Leitfaden")


class WithoutQuiz(unittest.TestCase):
    def check_soon(self, quiz):
        files, sm, pages = build(quiz)
        for lang, rel in (("en", f"learn/path/{PID}/"), ("de", f"de/learn/path/{PID}/")):
            soon = S.tx(lang, "q_soon")
            path, test = files[rel + "index.html"], files[rel + "test/index.html"]
            self.assertIn(soon, path[path.index("pl-quiz"):])
            self.assertNotIn(f'href="{S.quiz_url(BASE, lang)}"', path, "ohne Fragen kein Link auf die Testseite")
            self.assertIn(soon, test)
            self.assertNotIn("learnquiz.js", test); self.assertIsNone(embedded(test))
            self.assertTrue(pages[S.quiz_url(BASE, lang)]["noindex"])
            self.assertNotIn(S.quiz_url(BASE, lang), [x[0] for x in sm])

    def test_missing_file(self): self.check_soon(None)
    def test_empty_file(self): self.check_soon("")
    def test_empty_pillars(self): self.check_soon({"path": PID, "pillars": {}})
    def test_broken_questions_only(self): self.check_soon({"path": PID, "pillars": {"lean-manufacturing": {"en": [{"id": "x", "q": "", "opts": []}, "kaputt"]}}})
    def test_other_path(self): self.check_soon({**fixture(), "path": "anderer-pfad"})


class Texts(unittest.TestCase):
    def test_en_de_complete(self):
        keys = [k for k in S.UI if k.startswith("q_")]
        self.assertGreater(len(keys), 40)
        for k in keys:
            en, de = S.UI[k]
            self.assertTrue(en.strip() and de.strip(), k)
            self.assertEqual(set(re.findall(r"\{\w+\}", en)), set(re.findall(r"\{\w+\}", de)), f"gleiche Platzhalter: {k}")
        self.assertTrue(set(S.JS_KEYS) <= set(S.UI))

    def test_script_keys_known(self):
        js = (ROOT / "assets" / "learnquiz.js").read_text("utf-8")
        used = set(re.findall(r'\bt\("(q_\w+)"', js))
        self.assertTrue(used, "Skript nutzt t(...)")
        self.assertEqual(used - set(S.JS_KEYS), set())

    def test_qx_falls_back_on_broken_placeholder(self):
        with mock.patch.object(S, "overlay", lambda: {"ui": {"fr": {"q_count": "{x} questions"}}}):
            self.assertEqual(S.qx("fr", "q_count", n=30, k=3), "30 questions, 3 from each guide")
        self.assertEqual(S.qx("de", "q_pass", pct=80, need=24, n=30), "Bestanden ab 80 % (24 von 30 richtig)")

    def test_consent_names_certopus_and_privacy_link(self):
        for i in (0, 1):
            self.assertIn("Certopus (DevSquirrel Technologies", S.UI["q_consent"][i])
            self.assertIn("{link}", S.UI["q_consent"][i])


class Script(unittest.TestCase):
    JS = (ROOT / "assets" / "learnquiz.js").read_text("utf-8")

    def test_api_conventions(self):
        js = self.JS
        for s in ('credentials = "include"', '"x-requested-with": "m365"', '"/api/me"', '"/api/providers"', '"/auth/login/"', '"/api/learn/cert?path="',
                  '"/api/learn/quiz/start"', '"/api/learn/quiz/submit"', "consent: true"):
            self.assertIn(s, js)
        self.assertRegex(js, r'/\^\(GET\)\?\$/i\.test\(o\.method')   # Header nur bei schreibenden Anfragen (kein CORS-Preflight bei GET)
        self.assertNotIn("innerHTML", js, "Texte nur als textContent")

    def test_no_answer_key_in_script(self):
        self.assertNotRegex(self.JS, r"answer\s*:\s*\d")


class Privacy(unittest.TestCase):
    def test_certopus_section(self):
        de, en = SL.privacy_de(), SL.privacy_en()
        self.assertIn('id="lernpfad-zertifikat"', de); self.assertIn('id="learning-path-certificate"', en)
        common = ("Certopus", "DevSquirrel Technologies Private Limited", "support@certopus.com", 'href="https://certopus.com/privacy"')
        for text, words in ((de, common + ("Indien", "Art. 49 Abs. 1 lit. a DSGVO", "Einwilligung", "3 je 24 Stunden", "bestätigte E-Mail-Adresse")),
                            (en, common + ("India", "Art. 49(1)(a) GDPR", "consent", "3 per 24 hours", "confirmed email address"))):
            for w in words: self.assertIn(w, text)


if __name__ == "__main__":
    unittest.main()
