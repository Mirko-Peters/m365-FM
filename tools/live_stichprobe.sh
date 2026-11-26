#!/usr/bin/env bash
# Live-Stichproben nach dem Deploy (nur GET auf www.m365.fm und img.m365.fm, aendert nichts, gibt keine Secrets aus).
set -uo pipefail
B=https://www.m365.fm
UA="m365-live-stichprobe/1"
get() { curl -sS --compressed -A "$UA" -m 60 "$1" 2>/dev/null; }
hdr() { curl -sS --http2 -o /dev/null -D - -A "$UA" -m 60 -w 'HTTP %{http_code} ttfb=%{time_starttransfer}\n' "$1" 2>/dev/null | tr -d '\r' | grep -iE '^(HTTP|server-timing|cf-cache-status|cache-control|link|x-robots-tag|content-type|location)' | cut -c1-500 | sed 's/^/    /'; }
cnt() { printf %s "$1" | grep -oE "$2" | wc -l | tr -d ' '; }
show() {   # Bezeichnung Pfad
  local l=$1 p=$2 h; echo; echo "=== $l $B$p"; hdr "$B$p"; h=$(get "$B$p")
  echo "    Bytes: $(printf %s "$h" | wc -c)"
  echo "    robots: $(printf %s "$h" | grep -oiE '<meta name="robots"[^>]*>' | head -1)"
  echo "    canonical: $(printf %s "$h" | grep -oiE '<link rel="canonical"[^>]*>' | head -1)"
  echo "    Seitenleiste: aehnliche (sb-rel)=$(cnt "$h" 'class="sb-card sb-rel"') neueste(sb-list ol)=$(cnt "$h" '<ol class="sb-list">') M365Con-Text(sb-con)=$(cnt "$h" 'sb-card sb-con') Con-Bild=$(cnt "$h" 'attending-m365con') Google-Text(gbt)=$(cnt "$h" 'class="gbt"') Google-Bild(gsource)=$(cnt "$h" 'gsource\.webp')"
  echo "    Skripte: $(printf %s "$h" | grep -oE '/assets/[a-z0-9_-]+(\.[0-9a-f]{8,})?\.(js|css)' | sort -u | tr '\n' ' ')"
  echo "    smooth.js-Lader: $(cnt "$h" 'smooth\.js')  Bild-Preload: $(printf %s "$h" | grep -oiE '<link rel="?preload"? as="?image[^>]*>' | head -1 | cut -c1-200)"
  printf '%s' "$h" > "/tmp/stich_$(echo "$l" | tr -c 'a-zA-Z0-9' '_').html"
}
show Start /
show de-Start /de/
ep=$(get "$B/" | grep -oE '/show/episodes/[a-z0-9-]{8,}/' | head -1); show Folge "${ep:-/show/episodes/}"
show Folgenliste /show/episodes/
show Folgenliste-alt /episodes/
show Entitaet /entity/windows-11/
show Leitfaden /learn/lean-manufacturing/
L=$(get "$B/learn/lean-manufacturing/"); echo "    Videokarte: youtube=$(cnt "$L" 'youtube\.com/watch|youtu\.be|ytimg') pillar-video-Marker=$(cnt "$L" 'pv-|class="ln-vid|data-pv')"
show Pfad /learn/path/manufacturing-excellence/
show Test /learn/path/manufacturing-excellence/test/
show Test-de /de/learn/path/manufacturing-excellence/test/
show Blogbild /community/u/mirko-p/blog/stop-the-industrialization-of-chaos-why-automating-flawed-processes-fails/
BB=$(get "$B/community/u/mirko-p/blog/stop-the-industrialization-of-chaos-why-automating-flawed-processes-fails/"); echo "    Blogbild neu(-r1200x675)=$(cnt "$BB" '5254f600109b589b2c2d-r1200x675') alt=$(cnt "$BB" '5254f600109b589b2c2d\.webp')"
H=$(get "$B/"); for a in $(printf %s "$H" | grep -oE '/assets/(attend|page|site)\.[0-9a-f]{8,}\.(js|css)' | sort -u); do echo; echo "=== Asset $a"; hdr "$B$a"; done
AT=$(printf %s "$H" | grep -oE '/assets/attend\.[0-9a-f]{8,}\.js' | head -1); [ -n "$AT" ] && echo "    attend.js hash-tolerantes Muster: $(get "$B$AT" | grep -c 'attend(?:')"
echo; echo "=== Blogbild-Datei"; hdr "https://img.m365.fm/i/5254f600109b589b2c2d-r1200x675.webp"
