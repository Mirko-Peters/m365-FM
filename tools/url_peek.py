"""Liest eine oeffentliche Seite (nur lesen) und gibt Titel, Datum, Autor und die Absaetze aus, die Mirko Peters / M365.FM / M365Con erwaehnen,
plus alle Links auf m365.fm, m365.show und m365con.net. Fuer Seiten, die aus dem Container nicht erreichbar sind (laeuft auf dem Runner).
Aufruf: python tools/url_peek.py <url> [...]
Strukturmodus (Adresse mit Praefix struct:, z. B. struct:https://communitydays.org/): Status, Typ, Groesse, Skripte, JSON-LD-Bloecke, eingebettete
App-Daten (__NEXT_DATA__, __NUXT__ ...), API-Pfade aus Inline-Skripten, Links und Formulare - um Importe an echte Seiten anzupassen. Nur lesen."""
import html, json, re, sys, urllib.error, urllib.request

KEY = re.compile(r"mirko|peters|m365\.?fm|m365\s*show|m365\.show|m365\s*con|m365con", re.I)


def text(s):
    return html.unescape(re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", s))).strip()


def struct(url):
    """Aufbau einer Seite fuer Import-Adapter (nur lesen, gekuerzt)."""
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36", "Accept": "text/html,application/xhtml+xml,application/xml,application/json,text/calendar"})
    try:
        r = urllib.request.urlopen(req, timeout=60)
    except urllib.error.HTTPError as e:
        print("=== STRUCT", url, "HTTP", e.code); return
    except Exception as e:
        print("=== STRUCT", url, "Fehler", str(e)[:200]); return
    raw = r.read(); h = raw.decode("utf-8", "replace")
    print("=== STRUCT", url, "->", r.geturl(), "HTTP", r.status, r.headers.get("content-type"), len(raw), "Bytes")
    if not re.search(r"<html|<!doctype html", h[:2000], re.I):
        print(h[:4000]); return
    print("title:", text((re.search(r"<title>(.*?)</title>", h, re.S | re.I) or [None, ""])[1])[:200])
    print("generator:", (re.search(r'name="generator" content="([^"]*)"', h, re.I) or [None, "-"])[1])
    for s in re.findall(r'<script\b[^>]*src="([^"]+)"', h, re.I)[:25]: print("script src:", s)
    for i, m in enumerate(re.finditer(r'<script[^>]+type=["\']application/ld\+json["\'][^>]*>(.*?)</script>', h, re.S | re.I)):
        if i < 6: print(f"ld+json[{i}]:", re.sub(r"\s+", " ", m.group(1))[:1500])
    for name in ("__NEXT_DATA__", "__NUXT__", "__INITIAL_STATE__", "__APOLLO_STATE__", "wpApiSettings"):
        m = re.search(name + r'[^>{]*>?\s*=?\s*(\{.*?)</script>', h, re.S)
        if m: print(f"{name}:", re.sub(r"\s+", " ", m.group(1))[:3000])
    inline = " ".join(re.findall(r"<script\b(?![^>]*src=)[^>]*>(.*?)</script>", h, re.S | re.I))
    print("api-pfade:", sorted(set(re.findall(r'["\'](/?(?:api|wp-json|graphql|_next/data|feeds?|events?|calendar)[^"\'\s<>]{0,120})["\']', inline + h, re.I)))[:60])
    for f in re.findall(r"<form\b[^>]*>", h, re.I)[:5]: print("form:", f[:200])
    links = []
    for a, t in re.findall(r'<a\b[^>]*href="([^"#]+)"[^>]*>(.*?)</a>', h, re.S | re.I):
        if a not in [x[0] for x in links]: links.append((a, text(t)[:80]))
    print(len(links), "Links")
    for a, t in links[:150]: print("  ", a, "|", t)
    body = re.sub(r"<(script|style|noscript|svg)\b.*?</\1>", " ", h, flags=re.S | re.I)
    print("text:", text(body)[:2500])


for url in sys.argv[1:]:
    if url.startswith("struct:"):
        struct(url[7:]); continue
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
