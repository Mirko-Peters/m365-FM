"""Entitaeten fuellen mit der Datenbank als Quelle der Wahrheit (unittest): Eignung, Push-Payload/Idempotenz, KI-FAQ aus D1, Admin-Markup."""
import sys, unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import fill_entities as F
import entity_fill_data as FD


def ent(i, **kw):
    return {"id": i, "type": "product", "name": i.title(), "aliases": [], "desc": kw.pop("desc", {"en": "", "de": ""}), "web": "", "docs": "", "rel": [], **kw}


class Eligibility(unittest.TestCase):
    def test_seed_and_ai_eligible_human_skipped(self):
        edited = F.d1_edited([{"id": "seeded", "src": "seed", "h": "a"}, {"id": "drafted", "src": "ai", "h": "b"}, {"id": "human", "src": "human", "h": "c"}, {"id": "old-worker", "h": "d"}])
        self.assertEqual(edited, {"human", "old-worker"})   # ohne src (aelterer Worker): fail-closed
        ents = {i: ent(i) for i in ("seeded", "human", "repo-only")}
        self.assertEqual(F.status(ents["seeded"], {}, {}, edited, set()), (None, "full"))
        self.assertEqual(F.status(ents["human"], {}, {}, edited, set()), ("member_edited", None))
        self.assertEqual(F.status(ents["repo-only"], {}, {}, edited, set()), (None, "full"))
        self.assertEqual(F.D1["seeded"], {"src": "seed", "h": "a"})


class Push(unittest.TestCase):
    def setUp(self):
        F.d1_edited([{"id": "a", "src": "seed", "h": "H-A"}, {"id": "b", "src": "human", "h": "H-B"}, {"id": "c", "src": "ai", "h": "H-C"}])
        self.ents = {i: ent(i) for i in "abc"}
        self.fill = {"a": {"desc": "A is a thing for tests here.", "long": "A long text.", "faq": [{"q": "Q?", "a": "A."}], "d1h": "OLD-A"}, "b": {"desc": "B text", "long": "B"}, "c": {"desc": "C text is fine.", "long": "C long."}}
        self.i18n = {l: {} for l in F.LANGS}; self.i18n["de"] = {"a": {"desc": "A ist etwas.", "long": "Langer Text."}}; self.i18n["fr"] = {"a": {"desc": "A est."}}
        self.sent = []

    def post(self, items):
        self.sent.append(items); return {"results": [{"id": i["id"], "status": "ok"} for i in items]}

    def run_push(self, state):
        import tempfile
        old = F.OUT; F.OUT = Path(tempfile.mkdtemp())
        try: return F.push(self.ents, state, {"b"}, self.fill, self.i18n, post=self.post)
        finally: F.OUT = old

    def test_payload_guard_and_idempotence(self):
        state = {}
        self.assertEqual(self.run_push(state), {"ok": 2})
        ids = [i["id"] for i in self.sent[0]]; self.assertEqual(ids, ["a", "c"])   # b: von Menschen bearbeitet -> nie gesendet
        a = self.sent[0][0]
        self.assertEqual((a["base"], a["de"]["desc"], a["tr"]["fr"]["desc"], a["faq"][0]["q"]), ("OLD-A", "A ist etwas.", "A est.", "Q?"))   # Hash der Erzeugung gewinnt
        self.assertEqual(self.sent[0][1]["base"], "H-C")   # ohne d1h: aktueller Stand
        self.assertEqual(self.run_push(state), {}); self.assertEqual(len(self.sent), 1)   # zweiter Lauf sendet nichts


class Reading(unittest.TestCase):
    def test_db_faq_and_edited_gate(self):
        e = ent("x", faq={"en": [{"q": "What?", "a": "This."}]})
        self.assertEqual(FD.faq(e, "en"), [{"q": "What?", "a": "This.", "lang": "en"}])
        self.assertEqual(FD.faq(e, "de"), [])
        self.assertEqual(FD.long_text({**e, "edited": 1}, "en"), "")   # Menschen-Fassung: kein KI-Rueckfalltext


class AdminMarkup(unittest.TestCase):
    def test_buttons_gone_status_lines_present(self):
        js = (ROOT / "assets" / "admin.js").read_text("utf-8"); wk = (ROOT / "worker" / "src" / "adminpanel.js").read_text("utf-8")
        self.assertNotIn("Entitäten in die Datenbank übernehmen", js); self.assertNotIn("import-entities", js + wk)
        self.assertNotIn("Probelauf (nur zählen)", js)
        for needle in ("in der Datenbank,", "nur im Repo", "Jetzt nachziehen", "KI-Entwurf"): self.assertIn(needle, js)


if __name__ == "__main__":
    unittest.main()
