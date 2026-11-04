import unittest

from generate_r2_alt import _is_managed_image


class ManagedImageTest(unittest.TestCase):
    def test_only_own_r2_image_paths_are_included(self):
        self.assertTrue(_is_managed_image("https://img.m365.fm/i/photo.webp"))
        self.assertFalse(_is_managed_image("https://img.m365.fm/og/card.png"))
        self.assertFalse(_is_managed_image("https://other.example/i/photo.webp"))
        self.assertFalse(_is_managed_image("http://img.m365.fm/i/photo.webp"))
        self.assertFalse(_is_managed_image("https://img.m365.fm.evil.example/i/photo.webp"))


if __name__ == "__main__":
    unittest.main()
