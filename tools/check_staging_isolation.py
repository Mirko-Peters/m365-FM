#!/usr/bin/env python3
"""Staging darf nie Live-Ressourcen anfassen (STAGING.md). Diese Pruefung verbietet Live-Namen in den Staging-Konfigurationen und -Workflows.

Geprueft werden
  - worker/wrangler.toml und sitewrk/wrangler.toml, Abschnitt [env.staging]: eigener Name, eigene Domain, eigene Datenbank, eigener Bucket,
    routes und workers_dev ausdruecklich (wrangler erbt sie sonst vom Live-Teil!), keine KI-/Vectorize-/Mail-Bindung, keine Crons, ENVIRONMENT=staging;
  - .github/workflows/worker-staging.yml und site-staging.yml: laufen nur auf `staging`, jeder Job in der Umgebung `staging`, jeder wrangler-Aufruf mit
    `--env staging` (oder mit Staging-Ressource), nur erlaubte Secrets, keine Live-Skripte (setup.mjs), keine Live-Namen.
Ende 0 = sauber, 1 = Verstoss (jede Zeile erklaert, was falsch ist). Aufruf:  python3 tools/check_staging_isolation.py
"""
import re
import sys
import tomllib
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

LIVE_NAMES = {"m365-dub-community", "m365-dub-site", "m365-dub", "m365-fm", "m365-search"}
LIVE_HOSTS = ("api-dub.m365.fm", "dub.m365.fm", "www.m365.fm", "m365.fm", "img.m365.fm")
STAGING_HOSTS = {"staging.m365.fm", "api-staging.m365.fm"}
ENV_KEYS_OK = {"name", "workers_dev", "routes", "d1_databases", "r2_buckets", "vars", "observability", "main", "compatibility_date", "triggers"}
SECRETS_OK = re.compile(r"^(CLOUDFLARE_API_TOKEN|CLOUDFLARE_ACCOUNT_ID|R2_ACCOUNT_ID|STAGING_[A-Z0-9_]+|GITHUB_TOKEN)$")
WORKFLOWS = ("worker-staging.yml", "site-staging.yml")


def host_of(pattern):
    return str(pattern).split("/", 1)[0].lower()


def check_toml(text, label, expect_db=False):
    """Pruefung eines wrangler.toml-Textes. -> Liste von Fehlern."""
    errs = []
    try:
        cfg = tomllib.loads(text)
    except Exception as e:  # noqa: BLE001
        return [f"{label}: nicht lesbar ({e})"]
    env = (cfg.get("env") or {}).get("staging")
    if not isinstance(env, dict):
        return [f"{label}: Abschnitt [env.staging] fehlt"]
    name = env.get("name", "")
    if not name or not name.endswith("-staging"):
        errs.append(f"{label}: [env.staging] name muss mit -staging enden (ist: {name!r}); ohne eigenen Namen wuerde der Live-Worker ueberschrieben")
    if name in LIVE_NAMES or name == cfg.get("name"):
        errs.append(f"{label}: Name {name!r} ist der Live-Name")
    if env.get("workers_dev") is not False:
        errs.append(f"{label}: [env.staging] workers_dev = false fehlt (wrangler erbt sonst den Live-Wert)")
    routes = env.get("routes")
    if not routes:
        errs.append(f"{label}: [env.staging] routes fehlt - wrangler wuerde die Live-Routen erben")
    for r in routes or []:
        pat = r.get("pattern") if isinstance(r, dict) else str(r)
        h = host_of(pat)
        if h not in STAGING_HOSTS:
            errs.append(f"{label}: Route {pat!r} gehoert nicht zu Staging (erlaubt: {', '.join(sorted(STAGING_HOSTS))})")
    if "route" in env:
        errs.append(f"{label}: [env.staging] route (einzeln) ist nicht erlaubt, nur routes mit Staging-Hosts")
    for k in env:
        if k not in ENV_KEYS_OK:
            errs.append(f"{label}: [env.staging] hat {k!r} - nicht erlaubt (KI, Vectorize, Mail, Dienste und andere Bindungen gibt es in Staging nicht)")
    trig = env.get("triggers") or {}
    if trig.get("crons"):
        errs.append(f"{label}: [env.staging] triggers.crons muss leer sein (keine Crons in Staging)")
    top_ids = {d.get("database_id") for d in cfg.get("d1_databases", []) or []}
    for d in env.get("d1_databases", []) or []:
        if d.get("database_name") != "m365-dub-staging":
            errs.append(f"{label}: D1 {d.get('database_name')!r} - in Staging nur m365-dub-staging")
        if d.get("database_id") in top_ids:
            errs.append(f"{label}: Staging-D1 hat dieselbe database_id wie live")
    if expect_db and not env.get("d1_databases"):
        errs.append(f"{label}: [[env.staging.d1_databases]] fehlt")
    for b in env.get("r2_buckets", []) or []:
        if b.get("bucket_name") != "m365-fm-staging":
            errs.append(f"{label}: R2-Bucket {b.get('bucket_name')!r} - in Staging nur m365-fm-staging (nie m365-fm)")
    v = env.get("vars") or {}
    if v.get("ENVIRONMENT") != "staging":
        errs.append(f"{label}: [env.staging.vars] ENVIRONMENT muss \"staging\" sein")
    for k, val in v.items():
        s = str(val)
        for lh in LIVE_HOSTS:
            if re.search(r"(?<![\w.-])" + re.escape(lh) + r"(?![\w.-])", s):
                errs.append(f"{label}: Variable {k} enthaelt die Live-Adresse {lh}")
    if "PAYPAL_ENV" in (cfg.get("vars") or {}) or "ADS_BOOKING" in (cfg.get("vars") or {}):   # Worker: Zahlung/Werbung in Staging fest
        if v.get("PAYPAL_ENV") != "sandbox":
            errs.append(f"{label}: PAYPAL_ENV muss in Staging \"sandbox\" sein")
        if v.get("ADS_BOOKING") != "0":
            errs.append(f"{label}: ADS_BOOKING muss in Staging \"0\" sein")
    if "AI_GATEWAY_ID" in v:
        errs.append(f"{label}: AI_GATEWAY_ID darf in Staging nicht gesetzt sein (kein KI-Zugang)")
    return errs


def check_worker_toml(text):
    errs = check_toml(text, "worker/wrangler.toml", expect_db=True)
    env = (tomllib.loads(text).get("env") or {}).get("staging") or {}
    v = env.get("vars") or {}
    if host_of(v.get("SITE", "").replace("https://", "")) != "staging.m365.fm":
        errs.append(f"worker/wrangler.toml: SITE muss https://staging.m365.fm sein (ist {v.get('SITE')!r})")
    if host_of(v.get("API", "").replace("https://", "")) != "api-staging.m365.fm":
        errs.append(f"worker/wrangler.toml: API muss https://api-staging.m365.fm sein (ist {v.get('API')!r})")
    return errs


def check_site_toml(text):
    errs = check_toml(text, "sitewrk/wrangler.toml")
    env = (tomllib.loads(text).get("env") or {}).get("staging") or {}
    v = env.get("vars") or {}
    if host_of(v.get("ORIGIN", "").replace("https://", "")) != "staging.m365.fm":
        errs.append(f"sitewrk/wrangler.toml: ORIGIN muss https://staging.m365.fm sein (ist {v.get('ORIGIN')!r})")
    if v.get("MIGRATED") != "0":
        errs.append("sitewrk/wrangler.toml: MIGRATED muss in Staging \"0\" sein (keine Live-Weiterleitungen)")
    if v.get("R2_PRIMARY") != "0":
        errs.append("sitewrk/wrangler.toml: R2_PRIMARY muss in Staging \"0\" sein")
    if not env.get("r2_buckets"):
        errs.append("sitewrk/wrangler.toml: [[env.staging.r2_buckets]] (PAGES -> m365-fm-staging) fehlt")
    return errs


WRANGLER = re.compile(r"wrangler(?:@[\w.^~]+)?\s+(deploy|publish|d1|secret|r2|kv|vectorize|queues|versions|delete|rollback|tail|triggers)\b[^\n]*")


def check_workflow(text, label):
    """Pruefung eines Staging-Workflows. -> Liste von Fehlern."""
    import yaml
    errs = []
    try:
        doc = yaml.safe_load(text) or {}
    except Exception as e:  # noqa: BLE001
        return [f"{label}: nicht lesbar ({e})"]
    text = "\n".join(re.sub(r"(^|\s)#.*$", "", z) for z in text.splitlines())   # Kommentare zaehlen nicht
    on = doc.get("on", doc.get(True)) or {}
    push = (on.get("push") or {}) if isinstance(on, dict) else {}
    branches = list(push.get("branches") or [])
    if branches != ["staging"]:
        errs.append(f"{label}: push darf nur auf den Zweig staging laufen (ist: {branches})")
    if isinstance(on, dict) and ("pull_request" in on or "schedule" in on or "pull_request_target" in on):
        errs.append(f"{label}: nur push auf staging und workflow_dispatch erlaubt (kein pull_request/schedule)")
    for jn, job in (doc.get("jobs") or {}).items():
        env = job.get("environment")
        name = env.get("name") if isinstance(env, dict) else env
        if name != "staging":
            errs.append(f"{label}: Job {jn} muss in der Umgebung staging laufen (environment: staging)")
    for m in WRANGLER.finditer(text):
        line = m.group(0)
        if "--env staging" not in line and "-env staging" not in line and not re.search(r"m365-(dub|fm)-staging", line):
            errs.append(f"{label}: wrangler-Aufruf ohne --env staging: {line.strip()[:100]}")
    if not re.search(r"--env staging|setup-staging\.mjs", text):
        errs.append(f"{label}: kein Deploy mit --env staging gefunden")
    if re.search(r"(?<![\w-])setup\.mjs", text):
        errs.append(f"{label}: ruft setup.mjs (Live) auf - in Staging nur setup-staging.mjs")
    for s in re.findall(r"secrets\.([A-Za-z0-9_]+)", text):
        if not SECRETS_OK.match(s):
            errs.append(f"{label}: Secret {s} ist in Staging nicht erlaubt (nur CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID, R2_ACCOUNT_ID und STAGING_*)")
    for rx, what in ((r"R2_BUCKET:\s*['\"]?m365-fm['\"]?\s*$", "Live-Bucket m365-fm"), (r"bucket_name\s*=\s*\"m365-fm\"", "Live-Bucket m365-fm"),
                     (r"r2 bucket \w+ m365-fm(?![-\w])", "Live-Bucket m365-fm"), (r"(?<![\w-])m365-dub(?![-\w])", "Live-Datenbank m365-dub"),
                     (r"(?<![\w-])m365-dub-(?:community|site)(?![-\w])", "Live-Worker"), (r"m365-search", "Live-Vectorize-Index"),
                     (r"https://(?:www\.|dub\.)?m365\.fm", "Live-Adresse"), (r"https://img\.m365\.fm/[^\s]*\bpages/", "Live-Bucket-Seiten")):
        for m in re.finditer(rx, text, re.M):
            errs.append(f"{label}: {what} in Staging nicht erlaubt: {m.group(0).strip()[:80]}")
    for m in re.finditer(r"[^\n]*api-dub\.m365\.fm[^\n]*", text):
        if not re.search(r"(COMMUNITY_API|EXPORT_API)\s*:", m.group(0)):
            errs.append(f"{label}: Live-API api-dub.m365.fm nur als COMMUNITY_API/EXPORT_API fuer den lesenden Seitenbau erlaubt: {m.group(0).strip()[:80]}")
    return errs


def run(root=ROOT):
    errs = []
    errs += check_worker_toml((root / "worker" / "wrangler.toml").read_text("utf-8"))
    errs += check_site_toml((root / "sitewrk" / "wrangler.toml").read_text("utf-8"))
    for w in WORKFLOWS:
        f = root / ".github" / "workflows" / w
        if not f.exists():
            errs.append(f".github/workflows/{w} fehlt")
            continue
        errs += check_workflow(f.read_text("utf-8"), w)
    return errs


if __name__ == "__main__":
    problems = run()
    for p in problems:
        print("FEHLER:", p)
    print("Staging-Trennung:", "ROT" if problems else "gruen", f"({len(problems)} Verstoesse)" if problems else "")
    sys.exit(1 if problems else 0)
