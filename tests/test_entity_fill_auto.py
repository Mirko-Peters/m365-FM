"""Zeitplan fuer Entitaeten-Texte: Uebersetzen erst ab Mindestalter des KI-Textes, Wochengrenze inkl. offener Batches, Workflow-Schalter (unittest, ohne API)."""
import json, sys, unittest
from datetime import date
from pathlib import Path
from unittest import mock

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "tests"))
import fill_entities as F
from test_entity_fill_fixes import Base, GOOD


class MinAge(Base):
    def todo(self, ts, **kw):
        fill = {"hub": dict(GOOD, ts=ts, h="x", m="claude-sonnet-5-5")}
        return F.build_todo(self.ents, {}, fill, {l: {} for l in F.LANGS}, set(), set(), {}, **kw)

    def test_young_text_is_not_translated_yet(self):
        todo, sk = self.todo("2026-11-19", min_age_days=1, today=date(2026, 11, 19))
        self.assertEqual(todo, []); self.assertEqual(sk.get("too_young"), ["hub"])

    def test_text_older_than_a_day_is_translated(self):
        todo, sk = self.todo("2026-11-18", min_age_days=1, today=date(2026, 11, 19))
        self.assertEqual(len(todo), 1); self.assertEqual(set(todo[0]["translate"]), set(F.LANGS)); self.assertNotIn("too_young", sk)

    def test_without_min_age_nothing_changes(self):
        todo, sk = self.todo("2026-11-19", today=date(2026, 11, 19))
        self.assertEqual(len(todo), 1); self.assertNotIn("too_young", sk)

    def test_unknown_or_broken_ts_is_not_held_back(self):
        self.assertFalse(F.too_young({"ts": "kaputt"}, 1)); self.assertFalse(F.too_young({}, 1)); self.assertFalse(F.too_young(None, 1))


class WeekCap(Base):
    def test_no_cap_means_unlimited(self):
        with mock.patch.object(F, "WEEK_CAP", 0.0): self.assertEqual(F.week_room({}), float("inf"))

    def test_spend_and_pending_reduce_the_room(self):
        with mock.patch.object(F, "WEEK_CAP", 10.0):
            self.assertAlmostEqual(F.week_room({}), 10.0)
            F.add_spend("write", F.MODEL, 1_000_000, 100_000)
            spent = sum(v for k, v in F.spend_entities()["weeks"][F.week_key()].items() if k.endswith("_usd"))
            self.assertGreater(spent, 0)
            state = {"batches": [{"kind": "translate", "est_usd": 2.0, "month": F.month_key()}]}
            self.assertAlmostEqual(F.week_room(state), 10.0 - spent - 2.0, places=3)

    def test_exhausted_week_blocks_new_orders(self):
        todo, _ = F.build_todo(self.ents, {}, {}, {l: {} for l in F.LANGS}, set(), set(), {})
        with mock.patch.object(F, "WEEK_CAP", 0.001):
            reqs, c = F.next_writes(todo, self.ents, {"batches": [], "tries": {}}, 0)
        self.assertEqual(reqs, [])


class Workflow(unittest.TestCase):
    def test_schedule_has_kill_switch_and_week_cap(self):
        y = (ROOT / ".github/workflows/entity-fill.yml").read_text("utf-8")
        for need in ("schedule:", "vars.ENTITY_AUTO != '0'", "ENTITY_WEEK_USD", "--min-age-days $MINAGE_IN", "github.event_name == 'schedule' && '1'"):
            self.assertIn(need, y)


if __name__ == "__main__":
    unittest.main()
