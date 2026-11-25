import os, sys, unittest
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "tools"))
import certopus_test as T


class CertopusTest(unittest.TestCase):
    def test_nur_bekannte_felder(self):
        b = T.payload("a@b.de", "Max", {"email", "{Name}"}, today="2026-11-25")
        self.assertEqual(b["recipients"][0]["data"], {"{Name}": "Max"})
        self.assertTrue(b["publish"] and b["generate"])

    def test_alle_felder(self):
        b = T.payload("a@b.de", "Max", {"{Name}", "{Course}", "{Score}", "{Date}"}, today="2026-11-25")
        self.assertEqual(b["recipients"][0]["data"]["{Course}"], T.COURSE)
        self.assertEqual(b["recipients"][0]["data"]["{Date}"], "2026-11-25")

    def test_ohne_adresse_kein_versand(self):
        env = {"CERTOPUS_API_KEY": "x", "CERT_EMAIL": ""}
        old = {k: os.environ.get(k) for k in env}
        os.environ.update(env)
        try:
            self.assertEqual(T.main(), 2)
        finally:
            for k, v in old.items():
                os.environ.pop(k, None) if v is None else os.environ.__setitem__(k, v)


if __name__ == "__main__":
    unittest.main()
