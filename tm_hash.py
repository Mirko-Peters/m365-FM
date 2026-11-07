"""Gemeinsame Normalisierung und Hashes fuer die Uebersetzungsspeicher (translate_blog / translate_show / translate_notes).
Eine Einheit wird ueber Art + normalisierten Quelltext identifiziert, nicht ueber ihre Position: unveraenderte Texte werden nie erneut uebersetzt.
Art: T Titel, D Beschreibung, Q/A FAQ, P Absatz (ids "1", "2" ...). Inline-Platzhalter/-Tags bleiben im Text unveraendert."""
import hashlib, re, unicodedata


def norm(text):
    """Whitespace-normalisiert (NFC, Folgen von Leerraum -> ein Leerzeichen, Raender weg); sonst unveraendert."""
    return re.sub(r"\s+", " ", unicodedata.normalize("NFC", text or "")).strip()


def kind_of(uid):
    """Art einer Einheiten-id: 'T', 'D', 'Q1' -> 'Q', 'A1' -> 'A', '7' -> 'P'."""
    u = str(uid)
    return u[0] if u[:1] in ("T", "D", "Q", "A") else "P"


def digest(kind, text):
    return hashlib.sha1(f"{kind}\x1f{norm(text)}".encode("utf-8")).hexdigest()[:16]


def unit_hash(uid, text):
    return digest(kind_of(uid), text)


def fields_hash(*fields):
    """Hash ueber mehrere Felder (Show: Titel + Zusammenfassung; Notes: HTML)."""
    return digest("F", "\x1e".join(norm(f) for f in fields))
