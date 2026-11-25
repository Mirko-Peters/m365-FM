#!/usr/bin/env bash
# Ladezeit-Messung (nur lesen, Ladezeit 27.11.2026): je Adresse mehrere Abrufe mit Antwort-Headern (Server-Timing, cf-cache-status, Cache-Control,
# Link, Age, x-m365-*) und Zeiten (TTFB). Staging mit dem Access-Service-Token (Werte werden nie ausgegeben). Live nur GET (normale Seitenaufrufe).
# MODI (Umgebung, durch Leerzeichen getrennt): live staging schutz purge domains
#   purge: leert NUR https://img-staging.m365.fm/pages/index.html (Staging-Eintrag im Zonen-Cache) und misst danach erneut.
#   domains: listet (nur lesen) die R2-Domains des Buckets m365-fm-staging.
set -uo pipefail
STAGE=https://staging.m365.fm
LIVE=https://www.m365.fm
MODI=${MODI:-"live staging schutz"}
UA="m365-ladezeit-messung/1"
acc=()
if [ -n "${STAGING_ACCESS_ID:-}" ] && [ -n "${STAGING_ACCESS_SECRET:-}" ]; then acc=(-H "CF-Access-Client-Id: ${STAGING_ACCESS_ID}" -H "CF-Access-Client-Secret: ${STAGING_ACCESS_SECRET}"); echo "Access-Service-Token: gesetzt"; else echo "Access-Service-Token: fehlt"; fi
HDRS='^(HTTP/|server-timing|cf-cache-status|cache-control|link|age|x-m365-cache|x-m365-src|x-m365-environment|x-m365-guard|etag|content-type|location|cf-ray|cf-mitigated|x-robots-tag)'
has() { case " $MODI " in *" $1 "*) return 0;; *) return 1;; esac; }
host_ok() { case "$1" in https://staging.m365.fm/*|https://img-staging.m365.fm/*|https://www.m365.fm/*|https://img.m365.fm/*) return 0;; *) echo "Host nicht erlaubt: $1"; return 1;; esac; }
one() {   # Bezeichnung URL [curl-Argumente]
  local label=$1 url=$2; shift 2; host_ok "$url" || return
  local tmp; tmp=$(mktemp)
  local w; w=$(curl -sS --http2 -o /dev/null -D "$tmp" -A "$UA" -m 60 -w 'HTTP %{http_code} ttfb=%{time_starttransfer} connect=%{time_connect} tls=%{time_appconnect} total=%{time_total} bytes=%{size_download}' "$@" "$url" 2>&1 | sed -E 's/[A-Za-z0-9]{32,}/***/g')
  echo "--- $label $url -> $w"
  grep -iE "$HDRS" "$tmp" | tr -d '\r' | cut -c1-600 | sed 's/^/    /'
  rm -f "$tmp"
}
body() { local url=$1; shift; host_ok "$url" || return; curl -sS --compressed -A "$UA" -m 60 "$@" "$url" 2>/dev/null; }
pick() { grep -oE "$1" | head -1; }
serie() {   # Bezeichnung Basis Pfad Anzahl [curl-Argumente]
  local label=$1 base=$2 p=$3 n=$4; shift 4
  [ -z "$p" ] && { echo "--- $label: kein Pfad gefunden"; return; }
  for i in $(seq 1 "$n"); do one "$label#$i" "$base$p" "$@"; done
}
messen() {   # Umgebung Basis [curl-Argumente]
  local envn=$1 base=$2; shift 2
  echo; echo "=================== $envn ($base) $(date -u +%FT%TZ)"
  local home ep ent de dep gl gls js css
  home=$(body "$base/" "$@")
  echo "Startseite: $(printf %s "$home" | wc -c) Bytes; Skripte: $(printf %s "$home" | grep -oE '/assets/[a-z0-9_-]+(\.[0-9a-f]{8,})?\.js' | sort -u | tr '\n' ' ')"
  echo "Kopf: preload/stylesheet: $(printf %s "$home" | grep -oiE '<link[^>]+rel="?(preload|stylesheet)[^>]*>' | head -4 | tr '\n' ' ' | cut -c1-700)"
  ep=$(printf %s "$home" | pick '/show/episodes/[a-z0-9-]{8,}/')
  [ -z "$ep" ] && ep=$(body "$base/show/episodes/" "$@" | pick '/show/episodes/[a-z0-9-]{8,}/')
  ent=/entity/windows-11/
  de=/de/
  dep=${ep:+/de$ep}
  gls=$(body "$base/glossary/" "$@" | pick '/glossary/[a-z0-9-]{2,}/')
  js=$(printf %s "$home" | pick '/assets/page\.[0-9a-f]{8,}\.js')
  [ -z "$js" ] && js=/assets/page.js
  css=$(printf %s "$home" | pick '/assets/site\.[0-9a-f]{8,}\.css')
  serie "$envn Start" "$base" / 3 "$@"
  serie "$envn Folge" "$base" "$ep" 2 "$@"
  serie "$envn Entitaet" "$base" "$ent" 2 "$@"
  serie "$envn Sprachseite" "$base" "$de" 2 "$@"
  serie "$envn de-Folge(R2-only)" "$base" "$dep" 2 "$@"
  serie "$envn Glossar(R2-only)" "$base" "$gls" 2 "$@"
  serie "$envn JS" "$base" "$js" 2 "$@"
  serie "$envn JS-ungehasht" "$base" /assets/page.js 1 "$@"
  serie "$envn CSS" "$base" "$css" 1 "$@"
  serie "$envn 404" "$base" /gibt-es-nicht-ladezeit-xyz/ 2 "$@"
  # Wiederholungsbesuch: bedingter Abruf der Startseite mit ETag
  local et; et=$(curl -sS -o /dev/null -D - -A "$UA" -m 30 "$@" "$base/" 2>/dev/null | tr -d '\r' | grep -i '^etag:' | head -1 | cut -d' ' -f2-)
  [ -n "$et" ] && one "$envn Start bedingt" "$base/" -H "If-None-Match: $et" "$@"
}
has live && messen live "$LIVE"
if has staging; then
  messen staging "$STAGE" "${acc[@]}"
  echo; echo "Staging HEAD /:"; one "staging HEAD" "$STAGE/" -I "${acc[@]}"
fi
if has schutz; then
  echo; echo "=================== Schutz (oeffentlich, ohne Token)"
  one "img-staging /pages" https://img-staging.m365.fm/pages/index.html
  one "img-staging /" https://img-staging.m365.fm/
  one "img-staging /meta" https://img-staging.m365.fm/meta/r2-build.txt
  one "img /pages" https://img.m365.fm/pages/index.html
  one "img /meta" https://img.m365.fm/meta/r2-build.txt
  one "staging ohne Token" "$STAGE/"
fi
if has purge; then
  echo; echo "=================== Purge-Probe (nur der Staging-Eintrag img-staging.m365.fm/pages/index.html)"
  serie "vor Purge" "$STAGE" / 2 "${acc[@]}"
  r=$(curl -sS -m 30 -X POST "https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/purge_cache" -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" -H "content-type: application/json" \
      --data '{"files":["https://img-staging.m365.fm/pages/index.html"]}' 2>&1 | python3 -c 'import json,sys; d=json.load(sys.stdin); print("success", d.get("success"), [e.get("code") for e in d.get("errors") or []])' 2>&1)
  echo "Purge: $r"
  sleep 5
  serie "nach Purge" "$STAGE" / 3 "${acc[@]}"
fi
if has domains; then
  echo; echo "=================== R2-Domains m365-fm-staging (nur lesen)"
  npx --yes wrangler@4 r2 bucket domain list m365-fm-staging 2>&1 | sed -E 's/[a-f0-9]{32}/[id]/g' | tail -20
fi
