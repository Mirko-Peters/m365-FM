import contextlib
import io
import tempfile
import unittest
from pathlib import Path

import site_size


class DocsSizeTest(unittest.TestCase):
    def test_warns_with_largest_files_at_warning_threshold(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "community").mkdir()
            (root / "community" / "data.json").write_bytes(b"x" * 91)
            output = io.StringIO()
            with contextlib.redirect_stdout(output):
                site_size.sizes(root, warning=90, limit=100)
            self.assertIn("::warning::", output.getvalue())
            self.assertIn("community/data.json", output.getvalue())

    def test_aborts_with_breakdown_at_limit(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "blog-import").mkdir()
            (root / "blog-import" / "part-1.json").write_bytes(b"x" * 101)
            output = io.StringIO()
            with contextlib.redirect_stdout(output), self.assertRaisesRegex(SystemExit, "Abbruch"):
                site_size.sizes(root, warning=90, limit=100)
            self.assertIn("::error::", output.getvalue())
            self.assertIn("blog-import/part-1.json", output.getvalue())


if __name__ == "__main__":
    unittest.main()
