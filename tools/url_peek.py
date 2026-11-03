"""Liest eine oeffentliche Seite (nur lesen) und gibt Titel, Datum, Autor und die Absaetze aus, die Mirko Peters / M365.FM / M365Con erwaehnen,
plus alle Links auf m365.fm, m365.show und m365con.net. Fuer Seiten, die aus dem Container nicht erreichbar sind (laeuft auf dem Runner).
Aufruf: python tools/url_peek.py <url> [...]"""
import html, json, re, sys, urllib.request

KEY = re.compile(r"mirko|peters|m365\.?fm|m365\s*show|m365\.show|m365\s*con|m365con", re.I)


def text(s):
    return html.unescape(re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", s))).strip()


for url in sys.argv[1:]:
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36", "Accept": "text/html"})
    h = urllib.request.urlopen(req, timeout=60).read().decode("utf-8", "replace")
    print("=== " + url, len(h), "Bytes")
    for pat in (r"<title>(.*?)</title>", r'property="og:title" content="([^"]*)"', r'property="article:published_time" content="([^"]*)"', r'"datePublished"\s*:\s*"([^"]+)"',
                r'"dateModified"\s*:\s*"([^"]+)"', r'name="author" content="([^"]*)"', r'"author"\s*:\s*\{[^}]*"name"\s*:\s*"([^"]+)"', r'property="og:description" content="([^"]*)"', r'property="og:image" content="([^"]*)"'):
        m = re.search(pat, h, re.S | re.I)
        if m: print(pat.split('"')[1] if '"' in pat else "title", "=>", text(m.group(1))[:300])
    body = re.sub(r"<(script|style|noscript)\b.*?</\1>", " ", h, flags=re.S | re.I)
    seen = set()
    for m in re.finditer(r"<(p|li|h[1-6]|td|blockquote)\b[^>]*>(.*?)</\1>", body, re.S | re.I):
        t = text(m.group(2))
        if t and KEY.search(t) and t not in seen:
            seen.add(t)
            heads = re.findall(r"<h[1-4]\b[^>]*>(.*?)</h[1-4]>", body[:m.start()], re.S | re.I)
            print(f"\n[{m.group(1)}] unter «{text(heads[-1])[:90] if heads else '-'}»:\n  {t[:900]}")
            for a in re.finditer(r'<a\b[^>]*href="([^"]+)"[^>]*>(.*?)</a>', m.group(2), re.S | re.I): print("   Link:", a.group(1), "|", text(a.group(2))[:100])
    for a in sorted(set(re.findall(r'href="(https?://[^"]*(?:m365\.fm|m365\.show|m365con\.net|youtube\.com/@m365|linkedin\.com/in/mirko)[^"]*)"', h, re.I))): print("Link auf Mirko-Seiten:", a)
    for m in re.finditer(r'href="https?://[^"]*(?:m365\.fm|m365\.show|m365con\.net|linkedin\.com/in/m365showpodcast)[^"]*"', body, re.I):   # Umgebung jedes Links als Text
        print("\nUmgebung von", re.search(r'"([^"]+)"', m.group(0)).group(1), ":\n  ", text(body[max(0, m.start() - 1500):m.end() + 900])[-1200:])
    hs = [text(x)[:80] for x in re.findall(r"<h[1-3]\b[^>]*>(.*?)</h[1-3]>", body, re.S | re.I)]
    print("\nUeberschriften:", json.dumps(hs[:40], ensure_ascii=False))
