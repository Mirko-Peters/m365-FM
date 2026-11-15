"""Service-Bilder: jedes Motiv aus site_landing_copy.py muss in generate_service_images.MOTIFS existieren (5.11.: fehlendes Motiv
"company" brach den Seitenbau ab), und jedes Motiv laesst sich zeichnen."""
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import generate_service_images as G
import site_landing as L


class ServiceImages(unittest.TestCase):
    def test_every_page_motif_exists(self):
        missing = sorted({m for _, m, _ in L.image_jobs()} - set(G.MOTIFS))
        self.assertEqual(missing, [], f"Motive fehlen in generate_service_images.MOTIFS: {missing}")

    def test_every_motif_renders(self):
        for name in G.MOTIFS:
            with self.subTest(motif=name):
                img = G.render(name, "Companies", 320, 168)
                self.assertEqual(img.size, (320, 168))
                self.assertGreater(len(set(img.convert("L").getdata())), 8, "Motiv zeichnet sichtbar etwas")

    def test_unknown_motif_falls_back(self):
        self.assertEqual(G.render("does-not-exist", None, 160, 90).size, (160, 90))


if __name__ == "__main__":
    unittest.main()
