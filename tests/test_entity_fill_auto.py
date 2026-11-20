"""Zeitplan fuer Entitaeten-Texte: Uebersetzen erst ab Mindestalter des KI-Textes, Wochengrenze inkl. offener Batches, Workflow-Schalter (unittest, ohne API)."""
import json, sys, unittest
from datetime import date
from pathlib import Path
from unittest import mock

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "tests"))
import fill_entities as F
from test_entity_fill_fixes import Base, GOOD, ent


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
        with mock.patch.object(F, "WEEK_CAP", None): self.assertEqual(F.week_room({}), float("inf"))

    def test_zero_blocks_instead_of_unlimited(self):
        with mock.patch.dict(F.os.environ, {"ENTITY_WEEK_USD": "0"}):
            import importlib; m = importlib.reload(F)
            try: self.assertEqual(m.WEEK_CAP, 0.0)
            finally: F.os.environ.pop("ENTITY_WEEK_USD", None); importlib.reload(F)

    def test_old_ledger_without_weeks_counts_this_weeks_month_spend(self):
        today = F.datetime.now(F.timezone.utc).isoformat()[:19]
        F.jsave(F.OUT / F.SPEND, {"usd": 31.0, "months": {F.month_key(): {"write_usd": 31.0}}, "updated": today})
        with mock.patch.object(F, "WEEK_CAP", 10.0): self.assertLess(F.week_room({}), 0)
        F.jsave(F.OUT / F.SPEND, {"usd": 31.0, "months": {F.month_key(): {"write_usd": 31.0}}, "updated": "2020-01-01T00:00:00"})
        with mock.patch.object(F, "WEEK_CAP", 10.0): self.assertAlmostEqual(F.week_room({}), 10.0)

    def test_first_week_book_keeps_this_weeks_old_spend(self):
        """Gegenpruefung #559: die erste Buchung legt das Wochenbuch an - die schon verbuchten 31 USD dieser Woche (Altbestand) bleiben darin."""
        today = F.datetime.now(F.timezone.utc).isoformat()[:19]
        F.jsave(F.OUT / F.SPEND, {"usd": 31.0, "months": {today[:7]: {"write_usd": 31.0}}, "updated": today})
        F.add_spend("translate", F.TMODEL, 1000, 1000)
        with mock.patch.object(F, "WEEK_CAP", 10.0): self.assertLess(F.week_room({}), 0)
        self.assertGreaterEqual(F.spend_entities()["weeks"][F.week_key()].get("write_usd", 0), 31.0)

    def test_legacy_uses_month_of_last_booking(self):
        """Woche ueber einen Monatswechsel: es zaehlt der Monat der letzten Buchung, nicht der heutige."""
        d = F.datetime.now(F.timezone.utc)
        sp = {"months": {d.strftime("%Y-%m"): {"write_usd": 5.0}}, "updated": d.isoformat()[:19]}
        self.assertEqual(F.legacy_week(sp), {"write_usd": 5.0})
        self.assertEqual(F.legacy_week({"months": {}, "updated": "kaputt"}), {})

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


class SkipTypes(Base):   # Mirko 20.11.2026: Personen nein, Entitaeten ja
    def todo(self):
        self.ents = {"hub": ent("hub"), "anna": ent("anna", "person", name="Anna Example")}
        return F.build_todo(self.ents, {}, {}, {l: {} for l in F.LANGS}, set(), set(), {})

    def test_person_off_entities_on(self):
        with mock.patch.dict("os.environ", {"ENTITY_SKIP_TYPES": "person"}):
            todo, sk = self.todo()
        self.assertEqual([r["id"] for r in todo], ["hub"]); self.assertEqual(sk.get("type_off"), ["anna"])

    def test_none_or_empty_means_all_types(self):
        for v in ("none", "", "-"):
            with mock.patch.dict("os.environ", {"ENTITY_SKIP_TYPES": v}):
                self.assertEqual(F.skip_types(), frozenset(), v)
        with mock.patch.dict("os.environ", {"ENTITY_SKIP_TYPES": " Person , org "}):
            self.assertEqual(F.skip_types(), {"person", "org"})

    def test_workflow_defaults_to_person_off(self):
        y = (ROOT / ".github/workflows/entity-fill.yml").read_text("utf-8")
        self.assertIn("ENTITY_SKIP_TYPES: ${{ vars.ENTITY_SKIP_TYPES || 'person' }}", y)


class Workflow(unittest.TestCase):
    def test_schedule_has_kill_switch_and_week_cap(self):
        y = (ROOT / ".github/workflows/entity-fill.yml").read_text("utf-8")
        for need in ("schedule:", "vars.ENTITY_AUTO", "ref: ${{ github.event_name == 'schedule'", "ENTITY_WEEK_USD", "--min-age-days $MINAGE_IN", "github.event_name == 'schedule' && '1'",
                     "|| github.ref }}", "ENTITY_HAIKU_RUN_EUR"):
            self.assertIn(need, y)
        self.assertNotIn("|| github.sha }}", y)   # Gegenpruefung #559: ein wartender Handlauf muss den Stand beim Start sehen, nicht den beim Ausloesen


if __name__ == "__main__":
    unittest.main()
