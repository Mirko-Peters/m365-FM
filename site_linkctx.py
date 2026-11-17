"""Beziehungskontext fuer Linklisten (Mirko, 17.11.2026): jeder Link soll erkennbar machen, WARUM er da ist. Linktext bleibt der Name des Ziels
(Entitaetsname bzw. Titel); die Beziehung Quelle -> Ziel steht in einem kurzen Einleitungssatz vor der Liste, ausserhalb der Links und nie in der
Ueberschrift ("Folgen, in denen Power BI besprochen wird:", "Zu Gast in dieser Folge:", "Weitere Folgen zu Copilot:").

Matrix Quelle-Seitenart x Ziel-Art x Beziehung: data/link_context.json (15 Sprachen, Schluessel siehe "keys" dort); fehlt eine Sprache oder ein
Schluessel, gilt Englisch. Die Einleitungssaetze sind Schablonentext und tragen data-own-text="no" (zaehlen nicht fuer die Index-Regel).

Inventar der Linklisten (Stand Paket 3, alle Seitenarten aus site_*.py):
- Entitaetsseite (site_entities.build): Beziehungssaetze (site_relsent, Satz = Kontext; Rueckfall "In Folgen zu {s} geht es oft auch um ..."),
  "Vollstaendige Listen" (more.*), Folgenliste (ent.eps / ent.eps.person), Kernpunkte (ent.kp), Artikel (ent.arts), "Verwandte Themen kurz erklaert"
  (ent.relx), vollstaendige Beziehungslisten (ent.rellist), Firmen/Mitglieder einer Branche oder Rolle (ind.*, job.members), Personen einer Firma
  (org.people), Sessions/Auftritte (ent.sessions, ent.spk_*), Expertinnen und Experten (ent.experts, ent.experts_rel), Seitenleiste (side.entity/side.cooc).
- Folgenseite Hauptshow (site_podpage): Gaeste (ep.guests), verwandte Artikel (ep.arts), Seitenleiste (side.episode); Gastseite: Folgen (guest.eps).
- Folgenseite Dub-Sprachen (generate_site): Themen-Chips (ep.topics), weitere Folgen mit gemeinsamem Thema (ep.more / ep.more0), Seitenleiste.
- Kategorieseite der Dub-Sprachen (generate_site): Folgen der Kategorie (cat.eps).
- Blogbeitrag (site_blog): Themen (post.topics), verwandte Artikel mit gemeinsamem Thema (post.more), Seitenleiste (side.post).
- Community-Video, -Podcast, -Bibliothek (site_video, site_podcast, site_library): Themen (video.topics, ep.topics, lib.topics), Seitenleiste.
Reine Funktionen bis auf das einmalige Lesen der JSON-Datei."""
import html
import json
import re
from pathlib import Path

FILE = Path(__file__).parent / "data" / "link_context.json"
RTL = ("ar", "he")
_VOWEL = "AEIOUYÀÂÄÉÈÊËÎÏÔÖÛÜaeiouyàâäéèêëîïôöûü"
_DATA = None


def data():
    global _DATA
    if _DATA is None:
        try:
            _DATA = json.loads(FILE.read_text("utf-8"))
        except (OSError, ValueError):
            _DATA = {}
    return _DATA


def raw(lang, key):
    """Vorlage in der Sprache der Seite, sonst Englisch, sonst ''."""
    D = data()
    return (D.get(lang) or {}).get(key) or (D.get("en") or {}).get(key) or ""


def has(lang, key):
    return bool((data().get(lang) or {}).get(key))


def _name(lang, s):
    t = html.escape(s or "", quote=True)
    return f"<bdi>{t}</bdi>" if lang in RTL and t else t


def text(lang, key, **vals):
    """Fertiger HTML-Text (Namen escaped, in ar/he als <bdi>). Unbekannte Platzhalter bleiben stehen; {n} wird als Zahl eingesetzt."""
    t = html.escape(raw(lang, key), quote=False)
    for k, v in vals.items():
        if lang == "fr" and k != "n" and str(v)[:1] in _VOWEL:   # Franzoesisch: "de Azure" -> "d’Azure" (wie site_relsent.fill)
            t = re.sub(r"(^|(?<=\s))de \{" + k + r"\}", "d’{" + k + "}", t)
        t = t.replace("{" + k + "}", str(v) if k == "n" else _name(lang, v))
    return t


def plain(lang, key, **vals):
    """Wie text, aber ohne HTML (Ueberschriften, aria-label)."""
    return html.unescape(re.sub(r"<[^>]+>", "", text(lang, key, **vals)))


def intro(lang, key, cls="lc", **vals):
    """Einleitungssatz vor einer Linkliste: <p class="lc" data-own-text="no">…</p> ('' ohne Vorlage)."""
    t = text(lang, key, **vals)
    return f'<p class="{cls}" data-own-text="no">{t}</p>' if t else ""

