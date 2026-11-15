"""Migrationspruefung (tools/check_migrations.py): Nummernkollision, Reihenfolge, unveraenderte Altdateien, Einspielen in leere SQLite.
Lauf: python3 -m unittest tests.test_check_migrations"""
import contextlib
import io
import os
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
import check_migrations as CM  # noqa: E402


class Pure(unittest.TestCase):
    def test_gueltige_liste_mit_luecke_ist_nur_hinweis(self):
        err, notes = CM.check_tree(["0001_a.sql", "0002_b.sql", "0004_c.sql"])
        self.assertEqual(err, [])
        self.assertTrue(any("0003" in n for n in notes))

    def test_nummernkollision(self):
        err, _ = CM.check_tree(["0001_a.sql", "0047_x.sql", "0047_y.sql"])
        self.assertEqual(len(err), 1)
        self.assertIn("Nummernkollision 0047", err[0])

    def test_ungueltiger_name(self):
        err, _ = CM.check_tree(["0001_a.sql", "48_zu_kurz.sql", "0049-Bindestrich.sql", "0050_Gross.sql"])
        self.assertEqual(len(err), 3)

    def test_neue_migration_muss_ueber_main_liegen(self):
        base = ["0001_a.sql", "0002_b.sql", "0003_c.sql"]
        self.assertEqual(CM.check_against_base(base, base + ["0004_d.sql"]), [])
        self.assertEqual(CM.check_against_base(base, base + ["0005_d.sql"]), [])   # Luecke ist erlaubt
        err = CM.check_against_base(base, base + ["0002_d.sql"])
        self.assertEqual(len(err), 1)
        self.assertIn("0003", err[0])

    def test_veroeffentlichte_migration_nie_aendern_loeschen_umbenennen(self):
        base = ["0001_a.sql", "0002_b.sql"]
        texts = {"0001_a.sql": "create table a(x);", "0002_b.sql": "create table b(x);"}
        same = CM.check_against_base(base, base, texts.get, texts.get)
        self.assertEqual(same, [])
        changed = dict(texts, **{"0002_b.sql": "create table b(x, y);"})
        err = CM.check_against_base(base, base, texts.get, changed.get)
        self.assertEqual(len(err), 1)
        self.assertIn("geaendert", err[0])
        err = CM.check_against_base(base, ["0001_a.sql", "0002_bb.sql"], texts.get, texts.get)
        self.assertTrue(any("fehlt" in e for e in err))

    def test_einspielen(self):
        with tempfile.TemporaryDirectory() as t:
            Path(t, "0001_a.sql").write_text("create table a(x integer);", "utf-8")
            Path(t, "0002_b.sql").write_text("create table b(y integer); insert into a values (1);", "utf-8")
            tables, err = CM.apply_all(t, ["0001_a.sql", "0002_b.sql"])
            self.assertEqual((tables, err), (2, []))
            Path(t, "0003_c.sql").write_text("alter table gibt_es_nicht add column z;", "utf-8")
            _, err = CM.apply_all(t, ["0001_a.sql", "0002_b.sql", "0003_c.sql"])
            self.assertEqual(len(err), 1)
            self.assertIn("0003_c.sql", err[0])

    def test_echte_migrationen_laufen_durch(self):
        names = sorted(p.name for p in (ROOT / "worker" / "migrations").glob("*.sql"))
        err, _ = CM.check_tree(names)
        self.assertEqual(err, [])
        tables, err = CM.apply_all(ROOT / "worker" / "migrations", names)
        self.assertEqual(err, [])
        self.assertGreater(tables, 10)


def sh(cwd, *a):
    subprocess.run(["git", "-c", "user.name=t", "-c", "user.email=t@t", *a], cwd=cwd, check=True, capture_output=True)


class MitGit(unittest.TestCase):
    """Echtes Git-Repo im Temp-Ordner: Zweig main = Basis, Arbeitsstand = Pull Request."""

    def setUp(self):
        self.t = tempfile.TemporaryDirectory()
        self.old = os.getcwd()
        root = Path(self.t.name)
        (root / "worker" / "migrations").mkdir(parents=True)
        (root / "worker" / "migrations" / "0001_a.sql").write_text("create table a(x);", "utf-8")
        (root / "worker" / "migrations" / "0002_b.sql").write_text("create table b(x);", "utf-8")
        sh(root, "init", "-q", "-b", "main")
        sh(root, "add", "-A")
        sh(root, "commit", "-q", "-m", "basis")
        os.chdir(root)
        self.root = root

    def tearDown(self):
        os.chdir(self.old)
        self.t.cleanup()

    def run_main(self, *extra):
        out = io.StringIO()
        with contextlib.redirect_stdout(out):
            code = CM.main(["--base", "main", *extra])
        return code, out.getvalue()

    def test_unveraendert_ist_gruen(self):
        code, out = self.run_main()
        self.assertEqual(code, 0, out)

    def test_neue_migration_gruen_und_kollision_rot(self):
        (self.root / "worker" / "migrations" / "0003_c.sql").write_text("create table c(x);", "utf-8")
        code, out = self.run_main()
        self.assertEqual(code, 0, out)
        self.assertIn("0003_c.sql", out)
        (self.root / "worker" / "migrations" / "0003_andere.sql").write_text("create table d(x);", "utf-8")
        code, out = self.run_main()
        self.assertEqual(code, 1)
        self.assertIn("Nummernkollision 0003", out)

    def test_geaenderte_alte_migration_rot(self):
        (self.root / "worker" / "migrations" / "0002_b.sql").write_text("create table b(x, y);", "utf-8")
        code, out = self.run_main()
        self.assertEqual(code, 1)
        self.assertIn("geaendert", out)

    def test_zu_niedrige_nummer_rot(self):
        (self.root / "worker" / "migrations" / "0001_zwischen.sql").write_text("create table z(x);", "utf-8")
        code, out = self.run_main()
        self.assertEqual(code, 1)

    def test_basiszweig_fehlt_ist_rot(self):
        out = io.StringIO()
        with contextlib.redirect_stdout(out):
            code = CM.main(["--base", "gibt-es-nicht"])
        self.assertEqual(code, 1)


if __name__ == "__main__":
    unittest.main()
