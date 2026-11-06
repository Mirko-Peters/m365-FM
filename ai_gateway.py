"""Gemeinsame Claude-Gateway- und Haiku-Budget-Helfer."""
import json
import os
import urllib.error
import urllib.parse
import urllib.request
import uuid


ANTHROPIC_API = "https://api.anthropic.com"
USER_AGENT = "m365fm-actions/1.0 (+https://www.m365.fm)"   # ohne User-Agent weist Cloudflare urllib-Anfragen mit 403 ab
_warned_missing_gateway_token = False


def gateway_base_url():
    global _warned_missing_gateway_token
    account = os.environ.get("CLOUDFLARE_ACCOUNT_ID", "").strip()
    gateway = os.environ.get("AI_GATEWAY_ID", "m365fm").strip()
    if not account or not gateway:
        return ANTHROPIC_API
    if not os.environ.get("CF_AIG_TOKEN", "").strip():
        if not _warned_missing_gateway_token:
            print("AI Gateway ist konfiguriert, aber CF_AIG_TOKEN fehlt; direkter Anthropic-Aufruf.")
            _warned_missing_gateway_token = True
        return ANTHROPIC_API
    return f"https://gateway.ai.cloudflare.com/v1/{urllib.parse.quote(account, safe='')}/{urllib.parse.quote(gateway, safe='')}/anthropic"


def anthropic_request(path, data=None, headers=None, *, job, lang="", model="", cache_ttl=None, api_key=None):
    if path.startswith(ANTHROPIC_API):
        path = path[len(ANTHROPIC_API):]
    elif path.startswith("https://"):
        parsed = urllib.parse.urlsplit(path)
        path = parsed.path + (("?" + parsed.query) if parsed.query else "")
    if not path.startswith("/"):
        path = "/" + path
    h = {"anthropic-version": "2023-06-01", "content-type": "application/json", "user-agent": USER_AGENT}
    gateway_enabled = gateway_base_url() != ANTHROPIC_API
    if gateway_enabled:
        h["cf-aig-metadata"] = json.dumps({"job": job, "lang": lang, "model": model}, separators=(",", ":"))
    if api_key:
        h["x-api-key"] = api_key
    token = os.environ.get("CF_AIG_TOKEN", "").strip()
    if gateway_enabled:
        h["cf-aig-authorization"] = "Bearer " + token   # Format laut Cloudflare-Doku und secrets-check.yml
    if gateway_enabled and cache_ttl:
        h["cf-aig-cache-ttl"] = str(int(cache_ttl))
    h.update(headers or {})
    payload = json.dumps(data).encode() if data is not None and not isinstance(data, bytes) else data
    return urllib.request.Request(gateway_base_url() + path, payload, h)


def urlopen(request, timeout):
    try:
        return urllib.request.urlopen(request, timeout=timeout)
    except urllib.error.HTTPError as exc:
        raise urllib.error.HTTPError("https://gateway.ai.cloudflare.com/[redacted]", exc.code, exc.msg, exc.headers, exc.fp) from None


def _budget_request(payload):
    """Antwort des Community-Workers als dict; bei Fehler ein Text mit dem Grund (ohne Schluesselwerte); None ohne COMMUNITY_API."""
    api = os.environ.get("COMMUNITY_API", "").strip()
    key = os.environ.get("CRON_KEY", "").strip()
    if not api:
        return None
    if not key:
        return "GitHub-Secret CRON_KEY fehlt"
    req = urllib.request.Request(
        api.rstrip("/") + "/api/internal/ai-spend",
        json.dumps(payload).encode(),
        {"content-type": "application/json", "accept": "application/json", "x-cron-key": key, "user-agent": USER_AGENT},
    )
    try:
        with urlopen(req, timeout=15) as response:
            return json.loads(response.read().decode())
    except urllib.error.HTTPError as exc:
        try:
            body = exc.read().decode("utf-8", "replace")[:300]
        except Exception:
            body = ""
        if exc.code == 403 and '"forbidden"' in body:   # Antwort des Workers: Schluessel passt nicht
            return "CRON_KEY in GitHub und im Worker verschieden (Worker-Workflow starten, er uebertraegt den GitHub-Wert)"
        if exc.code == 403:
            return "Zugriff von Cloudflare abgelehnt (HTTP 403 ohne Antwort des Workers)"
        return f"Community-Worker antwortet mit HTTP {exc.code}"
    except Exception:
        return "Community-Worker nicht erreichbar"


def estimated_eur(input_tokens, output_tokens, batch=False):
    p_in = float(os.environ.get("HAIKU_USD_PER_MTOK_IN", "0.10"))
    p_out = float(os.environ.get("HAIKU_USD_PER_MTOK_OUT", "0.50"))
    rate = max(0.000001, float(os.environ.get("USD_PER_EUR", "1.08")))
    return (input_tokens * p_in + output_tokens * p_out) / 1e6 / rate * (0.5 if batch else 1)   # Batch API: halber Preis


def check_budget(job, model, estimate_eur=0):
    """Fail-closed: ohne bestaetigtes Restbudget kein Haiku-Lauf (harte Tagesgrenze), aber immer mit sichtbarer Warnung."""
    if "haiku" not in str(model).lower() or not os.environ.get("COMMUNITY_API"):
        return True
    result = _budget_request({"action": "check", "job": job, "model": model, "estimate_eur": max(0, estimate_eur)})
    if not isinstance(result, dict):
        print(f"::warning::Haiku-Budgetpruefung fuer {job} nicht moeglich: {result}. Lauf wird uebersprungen.")
        return False
    if not result.get("allowed"):
        print(f"::warning::Haiku-Tagesbudget fuer {job} reicht nicht (Rest {result.get('remaining_eur', '?')} EUR, geschaetzt {max(0, estimate_eur):.2f} EUR). Lauf wird uebersprungen.")
        return False
    return True


def usage_tokens(usage):
    """usage-Antwort von Claude -> (Eingabe gesamt inkl. Prompt-Cache, Ausgabe, davon Cache gelesen, davon Cache geschrieben)."""
    u = usage or {}
    read, write = int(u.get("cache_read_input_tokens") or 0), int(u.get("cache_creation_input_tokens") or 0)
    return int(u.get("input_tokens") or 0) + read + write, int(u.get("output_tokens") or 0), read, write


def report_usage(job, model, input_tokens, output_tokens, lang="", batch=False, cache_read=0, cache_write=0):
    """Meldet bezahlten Verbrauch; wirft nie (das Ergebnis ist bezahlt und darf nicht verloren gehen).
    input_tokens = Eingabe gesamt; cache_read/cache_write = Anteil daraus, der aus dem Prompt-Cache gelesen (0,1x) bzw. in ihn geschrieben (1,25x) wurde."""
    if "haiku" not in str(model).lower() or not os.environ.get("COMMUNITY_API"):
        return
    payload = {
        "action": "report", "id": str(uuid.uuid4()), "job": job, "lang": lang, "model": model,
        "input_tokens": int(input_tokens or 0), "output_tokens": int(output_tokens or 0),
    }
    if batch:
        payload["batch"] = True
    if cache_read:
        payload["cache_read_input_tokens"] = int(cache_read)
    if cache_write:
        payload["cache_creation_input_tokens"] = int(cache_write)
    result = _budget_request(payload)
    if not isinstance(result, dict) or not result.get("ok"):
        print(f"::warning::Haiku-Verbrauch von {job} konnte nicht gemeldet werden: {result if not isinstance(result, dict) else 'Antwort ohne ok'}.")
