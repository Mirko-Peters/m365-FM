"""Transkripte lesbar setzen: Absaetze und Zwischenueberschriften (h3/h4) - ohne den Text zu veraendern.

Der Text bleibt Wort fuer Wort der Originaltext. Die KI (tools/transcript_format.py, Haiku) bekommt die Saetze nummeriert und liefert nur Zahlen:
bei welchem Satz ein neuer Absatz beginnt und wo eine Ueberschrift steht (mit ihrem kurzen Text). Der Seitenbau setzt daraus Absaetze und Ueberschriften;
die Saetze selbst stammen immer aus dem Original. Aenderte sich der Quelltext, passt der Pruefwert nicht mehr und die Seite zeigt wieder den unformatierten Text.

Speicher:  data/transcript_fmt/<sprache>.json.gz  {schluessel: {"s": Pruefwert, "b": [Satznummern neuer Absaetze], "h": [[Satznummer, 3|4, "Ueberschrift"], ...]}}
Freigabe:  data/transcript_fmt_live.json  {"langs": ["en"]}. Fehlt die Datei oder ist sie leer, ist die Seite Byte fuer Byte wie vorher. Notschalter: Datei leeren.
Dieses Modul wird vom Seitenbau (site_podpage.py) und vom Werkzeug (tools/transcript_format.py) gemeinsam benutzt: gleiche Satzteilung, gleicher Pruefwert."""
import gzip, hashlib, json, re
from html import escape
from pathlib import Path

D = Path(__file__).resolve().parent / "data"
_SPLIT = re.compile(r'(?<=[.!?…。！？])["”»)\]]*\s+|(?<=[。！？])(?=\S)')
_CJK = re.compile(r"[　-ヿ㐀-鿿가-힯＀-￯]")
_IDX, _LIVE = {}, []
MAX_PAR = 9      # hoechstens so viele Saetze je Absatz (sonst setzt repair() Umbrueche)
LEVELS = (3, 4)  # auf der Folgenseite steht schon eine h2 "Transcript"
PROMPT_V = 2     # Version der Anweisung an die KI: bei Aenderung werden Eintraege mit alter Version beim naechsten Lauf neu gesetzt


def sentences(text):
    """Text -> Saetze (Leerraum vereinheitlicht, nichts weggelassen). Die Teilung entscheidet nur, wo ein Absatz beginnen DARF."""
    t = re.sub(r"\s+", " ", text or "").strip()
    out = []
    for part in _SPLIT.split(t):
        part = part.strip()
        if not part: continue
        out.append(part)
    return out


def sig(text):
    return hashlib.sha1("\n".join(sentences(text)).encode("utf-8")).hexdigest()[:10]


def _join(a, b):
    return a + ("" if (a and b and _CJK.match(a[-1]) and _CJK.match(b[0])) else " ") + b


def repair(n, breaks, heads):
    """Absatzliste sauber machen: sortiert, eindeutig, beginnt bei 0, jede Ueberschrift steht an einem Absatzanfang, kein Absatz laenger als MAX_PAR Saetze."""
    b = {0} | {i for i in breaks if isinstance(i, int) and not isinstance(i, bool) and 0 <= i < n} | {h[0] for h in heads}
    b = sorted(b); out = []
    for k, s in enumerate(b):
        end = b[k + 1] if k + 1 < len(b) else n
        out.append(s)
        out.extend(range(s + MAX_PAR, end, MAX_PAR))   # zu lange Absaetze regelmaessig teilen
    return sorted(set(out))


def clean_heads(n, heads, max_heads=None):
    """Nur gueltige Ueberschriften behalten: Satznummer in [0, n), Stufe 3/4, Text 3-80 Zeichen ohne Zeilenumbruch/Tags, aufsteigend, hoechstens max_heads."""
    out, last = [], -1
    for h in heads or []:
        try: i, lv, tx = int(h[0]), int(h[1]), re.sub(r"\s+", " ", str(h[2])).strip()
        except (TypeError, ValueError, IndexError): continue
        if not (0 <= i < n and i > last and lv in LEVELS and 3 <= len(tx) <= 80) or "<" in tx or ">" in tx: continue
        out.append([i, lv, tx]); last = i
    return out[:max_heads] if max_heads else out


def plain_breaks(n):
    """Absaetze ohne KI (Rueckfall): gleichmaessig alle MAX_PAR-2 Saetze."""
    return list(range(0, n, max(3, MAX_PAR - 2)))


def render_html(text, entry, style="line-height:1.6"):
    """Absaetze und Ueberschriften aus dem Original. entry muss zum Text passen (Pruefwert), sonst None."""
    if not entry or entry.get("s") != sig(text): return None
    ss = sentences(text); n = len(ss)
    if not n: return None
    heads = {h[0]: h for h in clean_heads(n, entry.get("h"))}
    b = repair(n, entry.get("b") or [], list(heads.values()))
    out = []
    for k, s in enumerate(b):
        end = b[k + 1] if k + 1 < len(b) else n
        if s in heads: out.append(f'<h{heads[s][1]}>{escape(heads[s][2])}</h{heads[s][1]}>')
        par = ""
        for x in ss[s:end]: par = _join(par, x) if par else x
        out.append(f'<p style="{style}">{escape(par)}</p>')
    return "".join(out)


# ------------------------------------------------------------------ Speicher und Freigabe
def _jload(p, default):
    try:
        p = Path(p)
        return json.loads(gzip.open(p, "rt", encoding="utf-8").read() if p.suffix == ".gz" else p.read_text("utf-8"))
    except (OSError, ValueError):
        return default


def live():
    if not _LIVE:
        d = _jload(D / "transcript_fmt_live.json", {})
        _LIVE.append(frozenset(x for x in (d.get("langs") if isinstance(d, dict) else []) or [] if isinstance(x, str)))
    return _LIVE[0]


def reset():   # Tests
    _IDX.clear(); _LIVE.clear()


def get(lang, key):
    """Eintrag fuer Sprache/Schluessel, nur wenn die Sprache freigegeben ist; sonst None."""
    if lang not in live(): return None
    if lang not in _IDX: _IDX[lang] = _jload(D / "transcript_fmt" / f"{lang}.json.gz", {}) or {}
    return _IDX[lang].get(key)


def html_for(lang, key, text, fallback_html):
    """Formatierter Transkripttext, sonst der bisherige HTML-Block (fallback_html) unveraendert."""
    return render_html(text, get(lang, key)) or fallback_html
