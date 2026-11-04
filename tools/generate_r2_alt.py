#!/usr/bin/env python3
"""Ergaenzt fehlende Bildbeschreibungen fuer R2-Bilder mit Workers AI."""
import argparse
import base64
import json
import os
import re
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MAP_FILE = ROOT / "data" / "r2_map.json"
ALT_FILE = ROOT / "data" / "r2_alt.json"
MODEL = "@cf/meta/llama-3.2-11b-vision-instruct"
IMAGE_NEURONS = int(os.environ.get("WORKERS_AI_ALT_IMAGE_NEURONS", "1000"))
PROMPT = (
    "Describe the visible image in factual English in at most 125 characters. "
    "Do not start with 'Image of' or 'Picture of'. Do not invent names or details. "
    "Return only the alt text."
)


class _SameHostRedirect(urllib.request.HTTPRedirectHandler):
    def __init__(self, host):
        self.host = host

    def redirect_request(self, req, fp, code, msg, headers, newurl):
        target = urllib.parse.urlparse(newurl)
        if target.hostname != self.host or target.scheme != "https" or target.port not in (None, 443):
            raise urllib.error.URLError("redirect to an unapproved host")
        return super().redirect_request(req, fp, code, msg, headers, newurl)


def _request(url, data=None, headers=None, timeout=30, max_bytes=None, allowed_host=None):
    req = urllib.request.Request(url, data=data, headers=headers or {})
    parsed = urllib.parse.urlparse(url)
    if parsed.scheme != "https" or (allowed_host and (parsed.hostname != allowed_host or parsed.port not in (None, 443))):
        raise ValueError("unapproved URL")
    opener = urllib.request.build_opener(_SameHostRedirect(allowed_host)) if allowed_host else urllib.request.build_opener()
    with opener.open(req, timeout=timeout) as response:
        return response.status, response.read(max_bytes + 1 if max_bytes else -1)


def _caption(image_url, account, token):
    status, image = _request(image_url, headers={"User-Agent": "m365-r2-alt/1.0"}, max_bytes=8_000_000, allowed_host="img.m365.fm")
    if status != 200 or len(image) > 8_000_000:
        return ""
    api = f"https://api.cloudflare.com/client/v4/accounts/{account}/ai/run/{MODEL}"
    payload = json.dumps({"image": base64.b64encode(image).decode("ascii"), "prompt": PROMPT}).encode()
    status, raw = _request(api, payload, {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json",
    }, timeout=60, max_bytes=1_000_000, allowed_host="api.cloudflare.com")
    if status != 200:
        return ""
    response = json.loads(raw).get("result", {}).get("response", "")
    text = re.sub(r"\s+", " ", str(response)).strip().strip('"“”')
    text = re.sub(r"^(?:an?\s+|the\s+)?(?:image|picture|photo)\s+of\s+", "", text, flags=re.I)
    return text[:125].strip()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true")
    parser.add_argument("--limit", type=int, default=9)
    args = parser.parse_args()
    if not 1 <= args.limit <= 100:
        raise SystemExit("--limit muss zwischen 1 und 100 liegen")
    images = json.loads(MAP_FILE.read_text(encoding="utf-8"))
    alts = json.loads(ALT_FILE.read_text(encoding="utf-8")) if ALT_FILE.exists() else {}
    urls = sorted({url for url in images.values() if isinstance(url, str) and url.startswith("https://img.m365.fm/")})
    todo = [url for url in urls if not str(alts.get(url) or "").strip()]
    print(f"{len(urls)} R2-Bilder, {len(todo)} ohne Alt-Text; Lauf-Limit {args.limit}.")
    if not args.apply:
        return
    account, token = os.environ.get("CLOUDFLARE_ACCOUNT_ID", ""), os.environ.get("CF_AI_TOKEN", "")
    budget_api = os.environ.get("COMMUNITY_API", "https://api-dub.m365.fm").rstrip("/") + "/api/internal/ai-budget"
    if not re.fullmatch(r"[a-f0-9]{32}", account, re.I) or not token:
        raise SystemExit("CLOUDFLARE_ACCOUNT_ID und CF_AI_TOKEN muessen gesetzt sein")
    done = 0
    for url in todo[:args.limit]:
        reserve = urllib.request.Request(budget_api, json.dumps({"neurons": IMAGE_NEURONS}).encode(), {
            "Authorization": "Bearer " + token, "Content-Type": "application/json", "X-Requested-With": "m365",
        })
        try:
            with urllib.request.urlopen(reserve, timeout=20) as response:
                allowed = json.loads(response.read()).get("reserved", False)
        except (urllib.error.URLError, ValueError):
            print("Tagesbudget nicht erreichbar; Lauf wird beendet.")
            break
        if not allowed:
            print("Workers-AI-Tageslimit erreicht; Lauf wird beendet.")
            break
        try:
            alt = _caption(url, account, token)
        except (urllib.error.URLError, TimeoutError, ValueError):
            alt = ""
        if not alt:
            print("Kein Alt-Text erzeugt:", url)
            continue
        alts[url] = alt
        ALT_FILE.write_text(json.dumps(alts, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print("Alt-Text ergänzt:", url, "—", alt)
        done += 1
    print(f"{done} Alt-Texte ergänzt.")


if __name__ == "__main__":
    main()
