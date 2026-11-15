"""Transkripte als Dateien je Folge (Issue #266), auf der eigenen Domain statt bei raw.githubusercontent.com:

- Hauptshow:            /show/episodes/<slug>/transcript.txt (+ transcript.vtt, wenn es eine VTT gibt)
- Dub-Folge:            /<lang>/<slug>/transcript.txt|.vtt (Seite der Dub-Folge, Quelle transcripts/<lang>/<video-id>.vtt)
- Sprachfassung der Hauptshow-Folge: /<lang>/show/episodes/<slug>/transcript.txt|.vtt (dieselben Dateien wie die Dub-Folge der Sprache)

Die Dateien liegen nur im R2-Bucket (r2out/, tools/r2_pages_upload.py), nicht in GitHub Pages (Groessengrenze). Der Site-Worker
(sitewrk/index.js, TRANSCRIPT) liefert sie mit X-Robots-Tag: noindex, Content-Type text/plain bzw. text/vtt (UTF-8) und CORS *.
Fehlt eine Form, entsteht .txt aus .vtt (Zeitmarken entfernt). Aus .txt allein entsteht nie eine .vtt.
Index aller Transkripte: /show/transcripts.txt (Titel - URL, verlinkt aus llms.txt) und /show/transcripts.json (Spreaker-ID -> Dateien,
fuer tools/apply_podcast_transcripts.py)."""
import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
TR_DIR = ROOT / "transcripts"
PODCAST_DIR = TR_DIR / "podcast"
MIN_LEN = 200   # kuerzere Texte sind kein Transkript (wie die Schwelle der Folgenseite)
# gleiche Regel wie TRANSCRIPT im Site-Worker: nur diese Adressen bekommen die Transkript-Header
PATH_RX = re.compile(r"^(?:/[a-z]{2})?(?:/show/episodes)?/[a-z0-9-]+/transcript\.(txt|vtt)$")

_TS = re.compile(r"(?:(\d+):)?(\d{1,2}):(\d{2})[.,](\d{1,3})")
_CJK = re.compile(r"[　-ヿ㐀-鿿가-힯＀-￯]")
_END = tuple(".!?…。！？」』\"»”")


def _secs(s):
    m = _TS.search(s or "")
    if not m: return None
    h, mi, se, ms = m.groups()
    return int(h or 0) * 3600 + int(mi) * 60 + int(se) + int(ms.ljust(3, "0")) / 1000


def _join(a, b):   # Japanisch/Chinesisch/Koreanisch ohne Leerzeichen zwischen den Cues, sonst mit
    if not a: return b
    return a + ("" if _CJK.match(a[-1]) or _CJK.match(b[0]) else " ") + b


def is_vtt(text):
    return (text or "").lstrip("﻿").startswith("WEBVTT")


def vtt_to_txt(vtt, gap=2.0, max_par=900):
    """WebVTT -> Klartext: Kopf (WEBVTT, NOTE, STYLE, REGION), Cue-Kennungen, Zeitmarken und Inline-Tags entfernt; Cues zu Absaetzen
    verbunden. Neuer Absatz nach einer Pause >= gap Sekunden oder wenn der Absatz max_par Zeichen erreicht und ein Satz endet.
    Direkt wiederholte Cues (rollende Untertitel) erscheinen einmal."""
    t = (vtt or "").lstrip("﻿").replace("\r\n", "\n").replace("\r", "\n")
    pars, cur, last_end, last_txt = [], "", None, None
    for block in re.split(r"\n[ \t]*\n", t):
        lines = [ln.strip() for ln in block.split("\n") if ln.strip()]
        if not lines or lines[0].startswith(("WEBVTT", "NOTE", "STYLE", "REGION")): continue
        ti = next((i for i, ln in enumerate(lines) if "-->" in ln), None)
        if ti is None: continue   # kein Cue (z. B. "Kind: captions" ohne Leerzeile nach WEBVTT)
        start, _, end = lines[ti].partition("-->")
        text = " ".join(lines[ti + 1:])
        text = re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]*>", "", text))).strip()
        if not text or text == last_txt: continue
        s, e = _secs(start), _secs(end)
        brk = cur and ((s is not None and last_end is not None and s - last_end >= gap) or (len(cur) >= max_par and cur.endswith(_END)))
        if brk: pars.append(cur); cur = ""
        cur = _join(cur, text); last_txt = text
        if e is not None: last_end = e
    if cur: pars.append(cur)
    return "\n\n".join(pars) + ("\n" if pars else "")


def clean_vtt(vtt):
    """VTT unveraendert ausliefern, nur Zeilenenden vereinheitlicht und BOM entfernt; None, wenn es keine VTT ist."""
    if not is_vtt(vtt): return None
    t = vtt.lstrip("﻿").replace("\r\n", "\n").replace("\r", "\n").strip()
    return t + "\n" if "-->" in t else None


def rel_files(rel_dir):
    """'show/episodes/<slug>/' -> ('show/episodes/<slug>/transcript.txt', '.../transcript.vtt') (relativ zu r2out/)."""
    d = rel_dir.strip("/") + "/"
    return d + "transcript.txt", d + "transcript.vtt"


def dub_vtt(lang, vid):
    """Text von transcripts/<lang>/<video-id>.vtt oder None."""
    f = TR_DIR / lang / f"{vid}.vtt"
    try:
        return f.read_text("utf-8") if f.is_file() else None
    except Exception:
        return None


def podcast_files(sid):
    """(txt, vtt) aus transcripts/podcast/<spreaker_id>.txt|.vtt (VoiceStudio-Kette); fehlende Form = None."""
    if not sid or not str(sid).isdigit(): return None, None
    out = []
    for ext in (".txt", ".vtt"):
        f = PODCAST_DIR / f"{sid}{ext}"
        try: out.append(f.read_text("utf-8") if f.is_file() else None)
        except Exception: out.append(None)
    return out[0], out[1]


class Registry:
    """Sammelt die geschriebenen Transkripte eines Baus (Dub-Folgen aus generate_site.py, Hauptshow aus site_podpage.py) fuer den Index."""

    def __init__(self):
        self.entries = []   # {"title", "lang", "page", "txt", "vtt", "sid"}
        self.dub = {}       # (lang, englischer Slug) -> (txt, vtt) fuer die Sprachfassungen /<lang>/show/episodes/<slug>/
        self.count = {"txt": 0, "vtt": 0}

    def publish(self, write, base, rel_dir, txt=None, vtt=None, title="", lang="en", page="", sid=None, index=True):
        """Schreibt transcript.txt (und transcript.vtt, falls vorhanden) neben die Seite rel_dir; gibt {"txt": url, "vtt": url|None} zurueck,
        {} wenn es nichts Brauchbares gibt. txt fehlt -> aus vtt. vtt fehlt -> keine VTT (nie aus txt erzeugt)."""
        v = clean_vtt(vtt) if vtt else None
        t = (txt or "").replace("\r\n", "\n").strip()
        if not t and v: t = vtt_to_txt(v).strip()
        if len(t) < MIN_LEN: return {}
        rt, rv = rel_files(rel_dir)
        write(rt, t + "\n"); self.count["txt"] += 1
        if v: write(rv, v); self.count["vtt"] += 1
        urls = {"txt": f"{base}/{rt}", "vtt": f"{base}/{rv}" if v else None}
        if index: self.entries.append({"title": title, "lang": lang, "page": page, "sid": str(sid) if sid else "", **urls})
        return urls

    def index_txt(self, base):
        """Eine Zeile je Folge: '[lang] Titel — URL' (Klartext; die VTT liegt bei vorhandenen Zeitmarken daneben, gleicher Pfad mit .vtt)."""
        head = ["# M365.FM – transcripts of all episodes", "",
                f"> One line per episode: title and plain-text transcript URL. Where timestamps exist, a WebVTT file sits next to it "
                f"(same path, transcript.vtt). {len(self.entries)} transcripts. Episode list: {base}/llms-show.txt", ""]
        rows = sorted(self.entries, key=lambda x: (x["lang"] != "en", x["lang"], x["title"].lower()))
        return "\n".join(head + [f"[{x['lang']}] {re.sub(r'\s+', ' ', x['title']).strip()} — {x['txt']}" for x in rows]) + "\n"

    def index_json(self, today):
        """Spreaker-Folgen-ID -> Dateien (fuer tools/apply_podcast_transcripts.py), dazu alle Eintraege."""
        by_sid = {x["sid"]: {"txt": x["txt"], "vtt": x["vtt"], "lang": x["lang"], "page": x["page"]} for x in self.entries if x["sid"]}
        return json.dumps({"generated": today, "count": len(self.entries), "by_spreaker_id": by_sid,
                           "transcripts": [{k: x[k] for k in ("title", "lang", "page", "txt", "vtt")} for x in self.entries]}, ensure_ascii=False)


REG = Registry()


def links_html(urls, label="Transcript"):
    """Sichtbare Links auf die Dateien ("Transcript (TXT)" und "VTT")."""
    if not urls or not urls.get("txt"): return ""
    v = f' · <a href="{html.escape(urls["vtt"])}" type="text/vtt" rel="nofollow">VTT</a>' if urls.get("vtt") else ""
    return f'<p class="mut trfiles">📄 <a href="{html.escape(urls["txt"])}" type="text/plain" rel="nofollow">{html.escape(label)} (TXT)</a>{v}</p>'
