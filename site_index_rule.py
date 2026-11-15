"""Gemeinsame Index-Regel "langer eigener Text" (Mirko, 13.11.2026: "Alle Sprachen ab 2500 Zeichen im Text auf index ... Alle Blog, Episoden und so weiter").

Regel: Hat der Haupttext einer Seite in DER Sprache der Seite mindestens MIN_CHARS Zeichen (reiner Text ohne HTML, ohne Menues/Footer/Verlinkungslisten,
ohne Englisch-/Deutsch-Rueckfall), steht die Seite auf index (Sitemap, hreflang, canonical) - egal in welcher Sprache und auch dann, wenn sie sonst noindex
waere (zu wenig Stimmen, Sprache nicht freigegeben, keine Show Notes ...).

Die Regel hebt NUR "zu wenig Inhalt" und "Sprache nicht freigegeben" auf. Seiten, die aus anderen Gruenden noindex sind (Archiv, Suche, Tag-/Seiten-N-Listen,
Entwuerfe, Weiterleitungen, outdated/replaced, Testeintraege, vom Autor ausgeblendete Seiten), prueft der Aufrufer weiterhin selbst und fragt diese Regel nicht.
Bereits indexierte Seiten bleiben unveraendert: die Regel kann nur von noindex auf index heben, nie umgekehrt (index_or_long).

Entitaetsseiten haben ihre eigene, gleichlautende Regel (site_entities.py, LONG_INDEX_MIN); dieses Modul fasst sie nicht an.

Reine Funktionen, keine Abhaengigkeiten ausser der Standardbibliothek."""
import html as _html
import re

MIN_CHARS = 2500   # "ab 2500 Zeichen" (>=): genau 2500 Zeichen reichen

# Bloecke, die nie Haupttext sind: Skripte, Stile, Menues, Kopf/Fuss, Seitenleisten, Formulare, Knoepfe, Grafiken
_BLOCK = re.compile(r"<(script|style|nav|header|footer|aside|form|button|noscript|template|svg|select|textarea|figcaption|iframe)\b[^>]*>.*?</\1\s*>", re.I | re.S)
_COMMENT = re.compile(r"<!--.*?-->", re.S)
_HASTAG = re.compile(r"<[a-zA-Z/!][^>]*>")
_LI = re.compile(r"<li\b[^>]*>(.*?)</li\s*>", re.I | re.S)
_A = re.compile(r"<a\b[^>]*>(.*?)</a\s*>", re.I | re.S)
_BREAK = re.compile(r"</?(?:p|div|br|li|ul|ol|h[1-6]|tr|td|th|table|section|article|blockquote|dd|dt|dl|pre|details|summary|figure)\b[^>]*>", re.I)
_TAG = re.compile(r"<[^>]+>")
_WS = re.compile(r"\s+")
LINK_SHARE = 0.8   # Listenpunkt, dessen Text zu mindestens diesem Anteil Linktext ist = Verlinkungsliste, kein Haupttext


def _text_of(fragment):
    return _WS.sub(" ", _html.unescape(_TAG.sub(" ", _BREAK.sub(" ", fragment)))).strip()


def _drop_link_items(s):
    """Listenpunkte, die (fast) nur aus einem Link bestehen (Inhaltsverzeichnis, Verwandte Artikel, Folgenlisten), zaehlen nicht zum Haupttext."""
    def keep_or_drop(m):
        inner = m.group(1)
        total = len(_text_of(inner))
        if not total:
            return " "
        linked = sum(len(_text_of(a)) for a in _A.findall(inner))
        return " " if linked / total >= LINK_SHARE else m.group(0)
    return _LI.sub(keep_or_drop, s)


def plain_text(html_or_text):
    """Reiner Text: ohne Tags, Skripte, Menues, Kopf/Fuss, Formulare, Kommentare und Verlinkungslisten; Entities aufgeloest, Leerraum zusammengezogen.
    Text ohne Tags bleibt (bis auf den Leerraum) unveraendert, damit ein "a < b" im Klartext nichts verliert."""
    s = "" if html_or_text is None else str(html_or_text)
    if not s.strip():
        return ""
    if not _HASTAG.search(s):
        return _WS.sub(" ", s).strip()
    s = _COMMENT.sub(" ", s)
    prev = None
    while prev != s:   # verschachtelte Bloecke (nav in header) bis zum Ende abraeumen
        prev = s
        s = _BLOCK.sub(" ", s)
    s = _drop_link_items(s)
    return _text_of(s)


def plain_len(html_or_text):
    """Anzahl Zeichen des reinen Textes (plain_text)."""
    return len(plain_text(html_or_text))


def total_len(*parts):
    """Summe der Zeichen mehrerer Textteile der Seite (z. B. Kurztext + Beitrag + Kernpunkte); leere und None-Teile zaehlen 0."""
    return sum(plain_len(p) for p in parts if p)


def long_enough(*parts, min_chars=None):
    """True, wenn die Teile zusammen mindestens min_chars Zeichen reinen Text haben. Die Teile muessen der EIGENE Text der Seitensprache sein:
    wer einen Rueckfall (Englisch auf einer fr-Seite) uebergibt, rechnet falsch - dafuer ist own_long() da."""
    return total_len(*parts) >= (MIN_CHARS if min_chars is None else min_chars)


def own_long(own, shown=None, min_chars=None):
    """Wie long_enough fuer einen Text, der nur zaehlt, wenn die Seite genau diesen eigenen Text zeigt: own = Text in der Sprache der Seite (leer, wenn es keinen gibt),
    shown = was die Seite tatsaechlich anzeigt. Zeigt sie etwas anderes (Rueckfall auf Englisch/Deutsch), gibt es keinen eigenen Text -> False."""
    o = plain_text(own)
    if not o:
        return False
    if shown is not None and plain_text(shown) != o:
        return False
    return len(o) >= (MIN_CHARS if min_chars is None else min_chars)


def index_or_long(already_indexable, *parts, min_chars=None):
    """Endgueltige Entscheidung "steht die Seite auf index?": die bisherige Regel der Seite (already_indexable) oder langer eigener Text. Hebt nur noindex auf index,
    eine schon indexierbare Seite bleibt es (auch bei kurzem Text)."""
    return bool(already_indexable) or long_enough(*parts, min_chars=min_chars)
