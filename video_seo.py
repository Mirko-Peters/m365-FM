"""Video-SEO fuer die Sticky-Man-Videoseiten auf m365.fm: SEO-Titel, Meta-Description, Zusammenfassung und Kapitel je Video und Sprache.

Die Texte schreibt tools/video_seo_gen.py: Sonnet aus dem Transkript (Englisch), Haiku uebersetzt sie in die uebrigen Sprachen. Dieses Modul wird vom
Seitenbau (generate_site.py, Folgenseiten der Dub-Sprachen) und vom Werkzeug gemeinsam benutzt: gleiche Pruefregeln, gleiche Zeitmarken-Aufbereitung.
Die YouTube-Videos selbst (Titel, Beschreibung, Tags) bleiben bei Taja AI - hier wird nichts nach YouTube geschrieben.

Speicher:  data/video_seo/<sprache>.json.gz  {video-id: {"s": Pruefwert, "v": PROMPT_V, "t": SEO-Titel, "d": Meta-Description, "u": Zusammenfassung,
                                                          "c": [[Sekunde, Kapitelname], ...], "h": [Ueberschrift Zusammenfassung, Ueberschrift Kapitel]}}
Freigabe:  data/video_seo_live.json  {"langs": ["en", "de", ...]}. Fehlt die Datei oder ist sie leer, ist jede Seite Byte fuer Byte wie vorher. Notschalter: Datei leeren.
Eine Seite nimmt die Texte nur, wenn der Eintrag die Pruefung (valid_entry) besteht."""
import gzip, hashlib, json, re
from html import escape
from pathlib import Path

D = Path(__file__).resolve().parent / "data"
PROMPT_V = 1                  # Version der Anweisung an die KI; bei Aenderung werden Eintraege mit alter Version neu geschrieben
BLOCK_S = 40                  # Transkript-Bloecke: ungefaehr so viele Sekunden je Zeitmarke
MAX_SRC = 70000               # hoechstens so viele Zeichen Transkript an die KI
SRC_LANGS = ("de", "es", "fr", "it", "nl", "pt", "pl", "id", "ru", "uk", "he", "ja", "ko", "ar", "hi", "te", "ta", "ml", "pa")   # Quelle fuer die Texte: erste Sprache mit Transkript
LANG_NAME = {"en": "English", "de": "German", "es": "Spanish", "fr": "French", "it": "Italian", "nl": "Dutch", "pt": "Portuguese", "pl": "Polish", "id": "Indonesian",
             "ru": "Russian", "uk": "Ukrainian", "he": "Hebrew", "ja": "Japanese", "ko": "Korean", "ar": "Arabic", "hi": "Hindi", "te": "Telugu", "ta": "Tamil",
             "ml": "Malayalam", "pa": "Punjabi (Gurmukhi script)"}
SCRIPT = {"ja": r"[぀-ヿ一-鿿]", "ko": r"[가-힯]", "ru": r"[Ѐ-ӿ]", "uk": r"[Ѐ-ӿ]", "ar": r"[؀-ۿ]", "he": r"[֐-׿]",
          "hi": r"[ऀ-ॿ]", "te": r"[ఀ-౿]", "ta": r"[஀-௿]", "ml": r"[ഀ-ൿ]", "pa": r"[਀-੿]"}
_CJK = re.compile(r"[　-ヿ㐀-鿿가-힯＀-￯]")
_IDX, _LIVE = {}, []
_TIME = re.compile(r"(?:(\d+):)?(\d{1,2}):(\d{2})(?:[.,]\d+)?")


# ------------------------------------------------------------------ Transkript aufbereiten (Quelle fuer die KI)
def vtt_cues(vtt):
    """WebVTT -> [(Sekunde, Text)]; Tags und Leerraum entfernt."""
    cues, cur, t = [], [], None
    def flush():
        if t is not None and cur:
            tx = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", " ".join(cur))).strip()
            if tx: cues.append((t, tx))
    for line in (vtt or "").lstrip("﻿").splitlines():
        if "-->" in line:
            flush(); cur = []
            m = _TIME.search(line.split("-->")[0])
            t = int((int(m.group(1) or 0)) * 3600 + int(m.group(2)) * 60 + int(m.group(3))) if m else None
        elif not line.strip():
            flush(); cur = []; t = None
        elif t is not None:
            cur.append(line.strip())
    flush()
    return cues


def blocks(cues, block_s=BLOCK_S):
    """Cues zu Bloecken von etwa block_s Sekunden: [(Startsekunde, Text)]."""
    out, start, buf = [], None, []
    for t, tx in cues:
        if start is None: start = t
        if t - start >= block_s and buf:
            out.append((start, " ".join(buf))); start, buf = t, []
        buf.append(tx)
    if buf: out.append((start or 0, " ".join(buf)))
    return out


def source_text(vtt):
    """(Text mit Zeitmarken '[Sekunde] ...', Menge der Zeitmarken). Zu lange Quellen werden am Ende gekuerzt."""
    bl = blocks(vtt_cues(vtt)); lines, n, marks = [], 0, set()
    for sec, tx in bl:
        ln = f"[{sec}] {tx}"
        if n + len(ln) > MAX_SRC: break
        lines.append(ln); n += len(ln) + 1; marks.add(sec)
    return "\n".join(lines), marks


def src_sig(src, title):
    return hashlib.sha1(f"{PROMPT_V}\n{title}\n{src}".encode("utf-8")).hexdigest()[:10]


def entry_sig(e):
    """Pruefwert eines englischen Eintrags: aendert er sich, werden die Uebersetzungen neu gemacht."""
    return hashlib.sha1(json.dumps([e.get("t"), e.get("d"), e.get("u"), e.get("c")], ensure_ascii=False).encode("utf-8")).hexdigest()[:10]


# ------------------------------------------------------------------ Pruefung
def width(s):
    return sum(2 if _CJK.match(c) else 1 for c in s or "")


def clean_text(s, max_w, min_w=1):
    """Einfacher Text: ein Zeilenumbruch-freier String ohne Tags/Links/Platzhalter, Breite min_w..max_w; sonst None."""
    if not isinstance(s, str): return None
    t = re.sub(r"\s+", " ", s).strip()
    if not (min_w <= width(t) <= max_w) or re.search(r"[<>{}]|https?:|www\.|\[\d+\]", t): return None
    return t


def clean_chapters(ch, marks=None, n_expected=None, min_n=3, max_n=14, title_w=90):
    """Kapitel pruefen: aufsteigende Sekunden (Zeitmarken des Quelltextes, sonst abgelehnt), das erste bei 0, Namen als einfacher Text."""
    if not isinstance(ch, list) or not (min_n <= len(ch) <= max_n): return None
    if n_expected is not None and len(ch) != n_expected: return None
    out, last = [], -1
    for it in ch:
        if not (isinstance(it, (list, tuple)) and len(it) == 2): return None
        try: sec = int(it[0])
        except (TypeError, ValueError): return None
        name = clean_text(it[1], title_w, 3)
        if name is None or sec <= last: return None
        if marks:
            near = min(marks, key=lambda m: abs(m - sec))
            if abs(near - sec) > 30: return None
            sec = near
            if sec <= last: return None
        out.append([sec, name]); last = sec
    if out[0][0] > 20: return None
    out[0][0] = 0
    return out


def clean_labels(h):
    if not (isinstance(h, (list, tuple)) and len(h) == 2): return None
    a, b = clean_text(h[0], 40, 2), clean_text(h[1], 40, 2)
    return [a, b] if a and b else None


def script_ok(lang, text):
    rx = SCRIPT.get(lang)
    if not rx: return True
    letters = [c for c in text if c.isalpha()]
    return bool(letters) and sum(1 for c in letters if re.match(rx, c)) / len(letters) >= 0.4


def valid_entry(e, lang="en"):
    """Gespeicherter Eintrag (nach dem Lesen) ist benutzbar."""
    if not isinstance(e, dict): return False
    return bool(clean_text(e.get("t"), 90, 10) and clean_text(e.get("d"), 200, 40) and clean_text(e.get("u"), 1500, 80)
                and clean_chapters(e.get("c"), None, None, 3, 14, 100) and clean_labels(e.get("h")) and script_ok(lang, e.get("u") or ""))


def make_entry_en(answer, marks, s):
    """Antwort der KI (Sonnet) -> Eintrag oder None. Regeln: Titel bis 62 Zeichen, Meta 120-160, Zusammenfassung 250-1100, 5-12 Kapitel."""
    if not isinstance(answer, dict): return None
    t = clean_text(answer.get("title"), 70, 15); d = clean_text(answer.get("meta"), 160, 100); u = clean_text(answer.get("summary"), 1100, 250)
    c = clean_chapters(answer.get("chapters"), marks, None, 4, 12)
    if not (t and d and u and c): return None
    return {"s": s, "v": PROMPT_V, "t": t, "d": d, "u": u, "c": c, "h": ["Summary", "Chapters"]}


def make_entry_tr(answer, en, lang):
    """Antwort der KI (Haiku) -> Eintrag oder None. Gleiche Kapitelzahl und Sekunden wie im englischen Eintrag; Schrift passt zur Sprache."""
    if not isinstance(answer, dict) or not valid_entry(en): return None
    names = answer.get("chapters")
    if not isinstance(names, list) or len(names) != len(en["c"]): return None
    c = clean_chapters([[sec, nm] for (sec, _), nm in zip(en["c"], names)], None, len(en["c"]), 3, 14, 100)
    t = clean_text(answer.get("title"), 90, 6); d = clean_text(answer.get("meta"), 200, 30); u = clean_text(answer.get("summary"), 1800, 60)
    lab = answer.get("labels") or {}; h = clean_labels([lab.get("summary"), lab.get("chapters")]) if isinstance(lab, dict) else None
    if not (t and d and u and c and h): return None
    if not all(script_ok(lang, x) for x in (t, d, u)): return None
    ratio = len(u) / max(1, len(en["u"]))
    if not (0.25 <= ratio <= 3.0): return None
    return {"s": entry_sig(en), "v": PROMPT_V, "t": t, "d": d, "u": u, "c": c, "h": h}


# ------------------------------------------------------------------ Speicher und Freigabe
def _jload(p, default):
    try:
        p = Path(p)
        return json.loads(gzip.open(p, "rt", encoding="utf-8").read() if p.suffix == ".gz" else p.read_text("utf-8"))
    except (OSError, ValueError):
        return default


def live():
    if not _LIVE:
        d = _jload(D / "video_seo_live.json", {})
        _LIVE.append(frozenset(x for x in (d.get("langs") if isinstance(d, dict) else []) or [] if isinstance(x, str)))
    return _LIVE[0]


def reset():   # Tests
    _IDX.clear(); _LIVE.clear()


def get(lang, vid):
    """Eintrag fuer Sprache/Video, nur wenn die Sprache freigegeben ist und der Eintrag die Pruefung besteht; sonst None."""
    if lang not in live(): return None
    if lang not in _IDX: _IDX[lang] = _jload(D / "video_seo" / f"{lang}.json.gz", {}) or {}
    e = _IDX[lang].get(vid)
    return e if valid_entry(e, lang) else None


# ------------------------------------------------------------------ Seitenbau
def title(lang, vid, fallback):
    e = get(lang, vid); return e["t"] if e else fallback


def meta(lang, vid, fallback):
    e = get(lang, vid); return e["d"] if e else fallback


def mmss(sec):
    sec = int(sec); h, m, s = sec // 3600, sec % 3600 // 60, sec % 60
    return f"{h}:{m:02d}:{s:02d}" if h else f"{m}:{s:02d}"


def yt_at(vid, sec):
    return f"https://www.youtube.com/watch?v={vid}&t={int(sec)}s"


def section(lang, vid):
    """Zusammenfassung und Kapitel der Videoseite (leer ohne Freigabe/Eintrag). Zeitmarken verlinken auf die Stelle im YouTube-Video."""
    e = get(lang, vid)
    if not e: return ""
    li = "".join(f'<li><a href="{escape(yt_at(vid, s), quote=True)}" rel="noopener" target="_blank"><time>{mmss(s)}</time></a> {escape(n)}</li>' for s, n in e["c"])
    return (f'<section class="vseo"><h2>{escape(e["h"][0])}</h2><p>{escape(e["u"])}</p>'
            f'<h2>{escape(e["h"][1])}</h2><ol class="vch" style="list-style:none;padding:0;line-height:1.7">{li}</ol></section>')


def clips(lang, vid):
    """Kapitel als schema.org-Clips (Schluesselmomente) fuer VideoObject.hasPart; leer ohne Freigabe/Eintrag."""
    e = get(lang, vid)
    if not e: return []
    out = []
    for i, (sec, name) in enumerate(e["c"]):
        c = {"@type": "Clip", "name": name, "startOffset": int(sec), "url": yt_at(vid, sec)}
        if i + 1 < len(e["c"]): c["endOffset"] = int(e["c"][i + 1][0])
        out.append(c)
    return out
