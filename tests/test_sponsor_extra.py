import unittest
from datetime import date, timedelta
import site_sponsorships as S

ENTS = {"acme": {"type": "org"}, "acme-backup": {"type": "product", "rel": [["developed_by", "acme"]]},
        "acme-suite": {"type": "platform", "rel": [["part_of", "acme"]]}, "acme-concept": {"type": "concept", "rel": [["part_of", "acme"]]},
        "other": {"type": "product", "rel": [["developed_by", "x"]]}}
REC = {"id": "a", "sponsor": {"name": "Acme", "url": "https://acme.example/"}, "label": "sponsored", "start": "2026-01-01", "end": "2026-06-30", "entities": ["acme"]}
END = date(2026, 6, 30)


def ex(d, recs=(REC,)): return S.sponsor_extra_entities("acme", d.isoformat(), ENTS, list(recs))


class Extra(unittest.TestCase):
    def test_constants(self): self.assertEqual((S.GRACE_MONTHS, S.GRACE_DAYS), (6, 182))
    def test_active(self): self.assertEqual(ex(date(2026, 3, 1)), ["acme", "acme-backup", "acme-suite"])
    def test_grace_edges(self):
        self.assertEqual(len(ex(END + timedelta(days=1))), 3)
        self.assertEqual(len(ex(END + timedelta(days=182))), 3)
    def test_expired(self): self.assertEqual(ex(END + timedelta(days=183)), [])
    def test_not_sponsored(self):
        self.assertEqual(ex(date(2026, 3, 1), []), [])
        self.assertEqual(S.post_extras([], "2026-03-01", ENTS), [])
        self.assertEqual(S.split_topics([f"t{i}" for i in range(12)], [])[0], [f"t{i}" for i in range(10)])
    def test_split_dedupe_and_cap(self):
        out, ext = S.split_topics([f"t{i}" for i in range(12)] + ["acme-backup"], ["acme", "acme-backup"])
        self.assertEqual(len(out), 12); self.assertEqual(out[:2], ["acme", "acme-backup"]); self.assertEqual(ext, {"acme", "acme-backup"})
        self.assertEqual(len(set(out)), len(out))
    def test_post_extras_grace_vs_expired(self):
        self.assertEqual(len(S.post_extras([REC], "2026-08-01", ENTS)), 3)
        self.assertEqual(S.post_extras([REC], "2027-01-15", ENTS), [])


if __name__ == "__main__": unittest.main()
