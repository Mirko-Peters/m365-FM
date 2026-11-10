"""Rollen-Abzeichen (Editor/Moderator): Ring, Chip, Fach-Editor-Tooltip und Person-JSON-LD ueber die echten Render-Helfer."""
import re
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import site_members as MEM  # noqa: E402
import site_roles as ROLE  # noqa: E402

BASE = "https://www.m365.fm"


def person(role=None, **kw):
    p = {"handle": "elliot-margot", "name": "Elliot Margot", "img": 3, "programs": [], "expertise": [], "certs": [], "channels": []}
    if role:
        p["role"] = role
    p.update(kw)
    return p


class RoleBadges(unittest.TestCase):
    def test_editor_ring_and_icon(self):
        h = MEM.img_tag("u", person("editor"), "Elliot Margot")
        self.assertIn('class="rav rav-editor"', h)
        self.assertIn('aria-label="Editor"', h)
        self.assertIn("<svg", h)
        self.assertIn("<img", h)
        self.assertEqual(h.count("float:inline-end"), 1)

    def test_moderator_uses_second_color_class_and_shield(self):
        h = MEM.img_tag("u", person("moderator"), "Mo")
        self.assertIn("rav-moderator", h)
        self.assertIn(ROLE.ICON["moderator"], h)
        self.assertNotEqual(ROLE.ICON["moderator"], ROLE.ICON["editor"])

    def test_plain_member_and_company_unchanged(self):
        for kind, x in (("u", person()), ("u", person("admin")), ("o", person("editor"))):
            h = MEM.img_tag(kind, x, "x")
            self.assertNotIn("rav", h)
            self.assertIn("float:inline-end", h)
        self.assertEqual(MEM.img_tag("u", person("editor", img=0), "x"), "")

    def test_chip_tooltip_link_and_languages(self):
        for lang in ROLE.TT:
            for role in ROLE.ROLES:
                c = ROLE.chip(BASE, lang, role)
                self.assertIn(f'data-role="{role}"', c)
                self.assertIn('title="', c)
                self.assertIn(("/rollen/#" + role), c)
        self.assertIn(f"{BASE}/de/rollen/#editor", ROLE.chip(BASE, "de", "editor"))
        self.assertIn(f"{BASE}/rollen/#moderator", ROLE.chip(BASE, "en", "moderator"))
        self.assertEqual(ROLE.chip(BASE, "en", "admin"), "")

    def test_subject_editor_tooltip_names_topics(self):
        ROLE.set_people([person("editor", scope=["teams", "purview"]), person("editor", handle="gen"), person("moderator", handle="mo", scope=["x"])])
        c = ROLE.chip_for(BASE, "de", "elliot-margot")
        self.assertRegex(c, r'title="Fach-Editor für [^"]*(teams|Teams)')
        self.assertNotIn("Fach-Editor", ROLE.chip_for(BASE, "de", "gen"))   # allgemeiner Editor
        self.assertNotIn("Fach-Editor", ROLE.chip_for(BASE, "de", "mo"))
        ROLE.set_people([])
        self.assertEqual(ROLE.chip_for(BASE, "de", "elliot-margot"), "")

    def test_existing_editor_without_scope_gets_badge_automatically(self):
        # Bestandseditor: nur role=editor im Export, keine weiteren Felder noetig
        self.assertEqual(ROLE.role_of({"role": "editor"}), "editor")
        ROLE.set_people([{"handle": "elliot-margot", "role": "editor"}])
        self.assertIn("rchip-editor", ROLE.chip_for(BASE, "en", "elliot-margot"))
        ROLE.set_people([])

    def test_person_jsonld_adds_role_without_overriding(self):
        p = person("editor", programs=[{"p": "mvp", "verified": 1, "year": 2024}], job="Consultant")
        n = MEM.person_ld(BASE, p, {})
        roles = [m for m in n["memberOf"] if isinstance(m, dict) and m.get("roleName") == "Editor"]
        self.assertEqual(len(roles), 1)
        self.assertEqual(roles[0]["memberOf"], {"@id": f"{BASE}/#org"})
        self.assertTrue(any(m.get("roleName") != "Editor" for m in n["memberOf"]))   # Microsoft-Programm bleibt
        self.assertEqual(n["jobTitle"], "Consultant")
        self.assertNotIn("hasOccupation", n)
        plain = MEM.person_ld(BASE, person(), {})
        self.assertNotIn("memberOf", plain)
        mod = MEM.person_ld(BASE, person("moderator"), {})
        self.assertEqual(mod["memberOf"][0]["roleName"], "Moderator")

    def test_css_one_shot_animation_and_reduced_motion(self):
        css = ROLE.CSS
        self.assertRegex(css, r"animation:rshine 1\.4s ease-out 1[;}]")
        self.assertRegex(css, r"prefers-reduced-motion:reduce\)\{\.rav\{animation:none\}")

    def test_author_box_uses_helpers(self):
        import generate_site as G
        old = dict(G.AUTHOR)
        try:
            G.AUTHOR.clear()
            G.AUTHOR.update({"handle": "elliot-margot", "name": "Elliot Margot", "role": "editor", "about": "Editor.", "channels": [], "expertise": [], "certs": [], "programs": []})
            h = G.author_box("de")
            self.assertIn("rchip-editor", h)
            self.assertIn("rav-editor", h)
        finally:
            G.AUTHOR.clear()
            G.AUTHOR.update(old)

    def test_about_page_lists_both_roles(self):
        for lang in ROLE.TT:
            b = ROLE.about_page_body(BASE, lang)
            self.assertIn('id="editor"', b)
            self.assertIn('id="moderator"', b)


if __name__ == "__main__":
    unittest.main()
