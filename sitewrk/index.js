// Worker vor der Plattform (GitHub Pages): Cache- und Sicherheits-Header, Bild-Optimierung (Polish), Weiterleitungen fuer den Umzug von www.m365.fm.
const SEC = {
  "strict-transport-security": "max-age=31536000; includeSubDomains",
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
  "permissions-policy": "camera=(), microphone=(), geolocation=(), payment=()",
  "x-frame-options": "SAMEORIGIN",
};
const IMG = /\.(png|jpe?g|gif|webp|avif|svg|ico)$/i, STATIC = /^\/(assets|covers|og)\//i, FONT = /\.(woff2?|ttf|otf)$/i;
// Dateiname traegt den Inhalts-Hash (<name>.<hex8+>.css|js, Seitenbau site_assets.hashed bzw. css_link): darf ein Jahr im Browser bleiben (immutable).
// Ladezeit 27.11.2026: vorher nur site.<hash>.css und page|a11y.<hash>.js, jetzt jedes gehashte Stylesheet oder Skript unter /assets/ (eine Ebene).
// Ungehashte Namen (page.js, wk-de.js, cm-de.js?v=...) passen nie: dort fehlt der Punkt-Hex-Teil vor der Endung; sie behalten 1 h.
export const HASHED = /^\/assets\/[a-z0-9][a-z0-9_-]*\.[0-9a-f]{8,}\.(?:css|js)$/i;
// T41 Caching: HTML 4 h am Rand statt 10 Min (nach jedem Deploy leert tools/purge_changed.py genau die geaenderten Adressen),
// Sprachseiten aus R2 ebenfalls 4 h im Kanten-Cache (Cache API, Schluessel /__r2c/<pfad>/ bzw. mit R2 als Ursprung /__r2f<pfad>, s. r2CacheKey; Purge nach
// dem Upload bzw. vor der Bau-Kennung), Browser fragt bei HTML immer nach (304 per ETag/Last-Modified)
const EDGE_HTML = 14400, R2_TTL = 14400, R2_MISS_TTL = 600;
// Kostenanalyse 25.11.2026: Eintraege unter /__r2f (R2 als Ursprung, Bau-Kennung mit "-pfad") bleiben R2_EDGE_TTL Sekunden im Kanten-Cache (wrangler.toml,
// Standard dort 86400). Sicher, weil jede Byte-Aenderung einer Seite oder Datei ihren Purge-Hash aendert (tools/page_hashes.py, seit 25.11. ohne Sonderregel
// fuer die frühere Liste "Neueste Folgen") und tools/purge_changed.py --r2 genau diese Adressen vor der neuen Bau-Kennung leert. Vorher galten 4 h, weil die
// Liste "Neueste Folgen" ohne Purge veralten durfte. Notschalter: R2_EDGE_TTL = "14400" (oder Variable entfernen). Erlaubt 600 s bis 7 Tage, sonst R2_TTL.
export const r2EdgeTtl = (env) => { const n = Number(env && env.R2_EDGE_TTL); return Number.isInteger(n) && n >= 600 && n <= 604800 ? n : R2_TTL; };
// Typische Scanner-Adressen (WordPress, PHP, Zugangsdateien): die Website hat keine solche Adresse (geprueft 25.11.2026: docs/, data/*.json,
// data/podpage/redirects.json, data/redirects_extra.json, sitewrk/test/legacy_cases.json). Frueh ein 404 ohne Abruf bei GitHub Pages und ohne R2-Lesung,
// im Browser bzw. bei Zwischen-Caches einen Tag gueltig. /.well-known/ ist nicht betroffen.
// wp-…: nur als ganzes Pfadsegment (danach "/", "." oder Ende) und nur an der Wurzel oder unter EINEM Vorsatz-Segment (/blog/wp-admin/,
// /wordpress/wp-login.php), nie unter /community/ oder /entity/: Mitglieder waehlen Blog-Slugs und Handles selbst (wp-mail-smtp-…, wp-content-pro).
export const SCANNER = /\.php\d?$|^\/(?:(?!community\/|entity\/)[^/]+\/)?wp-(?:admin|content|includes|json|login|config|cron|signup|load|mail|trackback|links)(?:[/.]|$)|(?:^|\/)\.(?:env|git)(?:[./_-]|$)/i;
const HTML_CC = "public, max-age=0, s-maxage=600, stale-while-revalidate=86400";
const r2Path = (p) => (p.endsWith("/") ? p : p + "/");
// HTML-Adressen: Verzeichnisse, .html und Pfade ohne Dateiendung. Dateien (.json, .xml, .txt, Bilder, Assets) sind keine Seiten.
// (Bis 5.11.2026 bekamen Seiten hier eine Einwilligungs-Region fuer den Clarity-Hinweis (T32, consent.js); Clarity und Hinweis sind entfernt.)
export const isHtmlPath = (p) => p.endsWith("/") || /\.html?$/i.test(p) || !/\.[a-z0-9]{1,8}$/i.test(p);

function notModified(request, etag, lastMod) {
  const inm = request.headers.get("if-none-match");
  if (inm) return !!etag && inm.split(",").map((x) => x.trim().replace(/^W\//, "")).some((x) => x === "*" || x === etag.replace(/^W\//, ""));
  const ims = request.headers.get("if-modified-since");
  return !!(ims && lastMod && Date.parse(lastMod) <= Date.parse(ims));
}

// Seite aus dem R2-Bucket (pages/<pfad>/index.html) mit Kanten-Cache; null, wenn es sie dort nicht gibt (auch das wird kurz gemerkt).
// /a/index.html gilt wie /a/ (wie GitHub Pages). Schluessel im Bucket sind UTF-8 (z. B. pages/ru/tag/облако/index.html), die Adresse kommt
// prozent-kodiert: fuer den Bucket dekodieren, der Cache-Schluessel bleibt kodiert (tools/purge_changed.py leert kodierte Adressen).
async function r2Page(request, env, ctx, url, p) {
  const d = p.replace(/\/index\.html$/i, "/");
  let dp = d; try { dp = decodeURIComponent(d); } catch { /* ungueltige Kodierung: wie angefragt */ }
  const cache = caches.default, ck = new Request(url.origin + "/__r2c" + r2Path(d));
  let hit = await cache.match(ck).catch(() => null), state = "HIT";
  if (!hit) {
    state = "MISS";
    const obj = await env.PAGES.get("pages" + r2Path(dp) + "index.html").catch(() => null);
    const cm = (obj && obj.customMetadata) || {};
    if (!obj || cm.gone === "1" || cm.src === "docs") {   // fehlt, vom Seitenbau als entfernt markiert oder nur Spiegel von GitHub Pages (dort 404 = wirklich weg)
      ctx.waitUntil(cache.put(ck, new Response("", { headers: { "cache-control": `public, max-age=${R2_MISS_TTL}`, "x-r2-miss": "1" } })).catch(() => {}));
      return null;
    }
    let buf; try { buf = await obj.arrayBuffer(); } catch { return null; }
    hit = new Response(buf, { headers: { "content-type": "text/html; charset=utf-8", "etag": obj.httpEtag, "last-modified": obj.uploaded.toUTCString(), "cache-control": `public, max-age=${R2_TTL}` } });
    ctx.waitUntil(cache.put(ck, hit.clone()).catch(() => {}));
  }
  if (hit.headers.get("x-r2-miss")) return null;
  const h = new Headers({ "content-type": "text/html; charset=utf-8", "cache-control": HTML_CC, "x-m365-cache": state });
  for (const k of ["etag", "last-modified"]) { const v = hit.headers.get(k); if (v) h.set(k, v); }
  for (const [k, v] of Object.entries(SEC)) h.set(k, v);
  if (notModified(request, h.get("etag"), h.get("last-modified"))) return new Response(null, { status: 304, headers: h });
  return new Response(request.method === "HEAD" ? null : hit.body, { status: 200, headers: h });
}
// R2 als Ursprung (R2_PRIMARY=1): der Deploy-Job spiegelt die veroeffentlichte Website nach dem GitHub-Pages-Deploy in den Bucket (pages/<pfad>,
// tools/r2_site_sync.py) und setzt danach die Bau-Kennung pages/r2-build.txt. R2 wird nur genutzt, solange sie mit /r2-build.txt auf GitHub Pages
// uebereinstimmt - waehrend des Spiegelns, nach einem Fehler oder ohne Zugang zum Bucket liefert automatisch GitHub Pages (nie ein veralteter Stand).
// Nicht aus R2 zuerst: Bilder (Polish ueber den Ursprung), Suchindex (eigene Header unten), Range-Anfragen auf Dateien, Pfade ohne Endung und ohne "/" (GitHub Pages leitet auf "/" um).
const CT = { html: "text/html; charset=utf-8", json: "application/json; charset=utf-8", jsonld: "application/ld+json; charset=utf-8", xml: "application/xml; charset=utf-8",
  txt: "text/plain; charset=utf-8", md: "text/markdown; charset=utf-8", css: "text/css; charset=utf-8", js: "text/javascript; charset=utf-8", mjs: "text/javascript; charset=utf-8",
  woff2: "font/woff2", woff: "font/woff", ttf: "font/ttf", otf: "font/otf", ics: "text/calendar; charset=utf-8", vtt: "text/vtt; charset=utf-8", webmanifest: "application/manifest+json",
  xsl: "application/xslt+xml", pdf: "application/pdf", csv: "text/csv; charset=utf-8", rss: "application/rss+xml; charset=utf-8" };
const extOf = (p) => { const m = /\.([a-z0-9]{1,12})$/i.exec(p.slice(p.lastIndexOf("/") + 1)); return m ? m[1].toLowerCase() : ""; };
export function r2Key(p) {   // Adresse (dekodiert) -> Schluessel im Bucket ("" = nicht aus R2 zuerst)
  if (p.endsWith("/")) return "pages" + p + "index.html";
  return extOf(p) ? "pages" + p : "";
}
export const READY_TTL = 30000;   // Bau-Kennung 30 s merken (je Isolate und geteilt im Kanten-Cache); aufgefrischt wird im Hintergrund, keine Anfrage wartet auf die Pruefung
let READY = { t: -1e15, v: "", busy: 0 };
export function __resetR2Ready() { READY = { t: -1e15, v: "", busy: 0 }; }   // nur fuer Tests
export function __r2ReadyState() { return { ...READY }; }   // nur fuer Tests
const withTimeout = (p, ms) => Promise.race([p, new Promise((r) => setTimeout(() => r(null), ms))]);
const BUILD_RX = /^[A-Za-z0-9._-]{1,64}$/;
async function checkBuild(env, url) {
  const [a, b] = await Promise.all([
    fetch(url.origin + "/r2-build.txt?r2check=" + Math.floor(Date.now() / READY_TTL), { signal: AbortSignal.timeout(3000) }).then((x) => (x.ok ? x.text() : "")).catch(() => ""),   // mit Query: nie aus dem Kanten-Cache
    withTimeout(env.PAGES.get("pages/r2-build.txt").then((x) => (x ? x.text() : "")), 3000).then((x) => x || "").catch(() => "")]);
  const o = String(a).trim(), r = String(b).trim();
  return o === r && BUILD_RX.test(o) ? o : "";
}
// Kaltes Isolat (Dienstag-Check 17.11.2026): ohne gemerkte Kennung nahm die erste Anfrage eines Isolats den Weg ueber GitHub Pages - fuer Seiten,
// die es nur im Bucket gibt (/entity/*, Sprachseiten), mit 404 und danach dem R2-Rueckfall (zwei Ursprungs-Wege). Deshalb legt jede Pruefung ihr
// Ergebnis mit Pruefzeit 30 s im Kanten-Cache des Rechenzentrums ab (Schluessel /__r2c/~ready, oeffentlich 404 wie alle /__r2c/). Ein neues Isolat
// liest es einmal (hoechstens READY_WAIT ms, eigener Abruf dieser Anfrage) und uebernimmt es nur, wenn die Pruefung juenger als 30 s ist - so ist
// der Stand nie aelter als im Isolat selbst. Auf checkBuild (nie gecachter Abruf bei GitHub Pages) wartet weiterhin keine Anfrage.
// Grenze: Das hilft nur, wenn im selben Rechenzentrum in den letzten 30 s eine Pruefung lief. Bei wenig Verkehr (Messung 17.11.: ~1,7 Seitenaufrufe/min
// weltweit) ist der Eintrag nach einer Ruhepause meist abgelaufen (ready=cold) - eine Senkung der TTFB ist damit NICHT belegt. Erst messen
// (Server-Timing ready/src auf /entity/*). Bleibt ready=cold mit src=r2fallback haeufig, ist der naechste Hebel, im kalten Zustand Pfade, die es nur
// im Bucket gibt (site_size.r2_only, Entitaeten nach site_entities.py), gleich ueber r2Page zu holen (derselbe Inhalt wie heute der 404-Rueckfall).
// Umgesetzt 24.11.2026 (src=r2direct, R2_ONLY_PAGE): ohne gueltige Kennung (cold, oder "nicht bereit" waehrend des Spiegelns) holt der Worker solche
// Seiten gleich ueber r2Page (Schluessel /__r2c<pfad>, den Schritt 1 von tools/purge_changed.py nach dem Deploy leert - nie /__r2f und nie eine
// erfundene Bau-Kennung). Fehlt die Seite im Bucket, geht es wie bisher ueber GitHub Pages. Messung: je Seitenaufruf dieser Pfade eine JSON-Zeile
// im Log (logR2Page, Workers Logs in sitewrk/wrangler.toml).
// READY_TTL NICHT einfach verlaengern: nach einem Deploy gaelte die alte Kennung weiter, und r2First laese unter /__r2c/@<alter Bau>/ bis zu 4 h alte Seiten.
const READY_KEY = "/__r2c/~ready", READY_WAIT = 50;
async function sharedReady(url, wait = READY_WAIT) {
  const read = caches.default.match(new Request(url.origin + READY_KEY)).then(async (c) => (c ? { t: c.headers.get("x-r2-build-t"), v: (await c.text()).trim() } : null));
  const c = await withTimeout(read.catch(() => null), wait);
  if (!c || !/^\d{10,16}$/.test(c.t || "") || (c.v && !BUILD_RX.test(c.v))) return null;
  const now = Date.now(), t = Math.min(Number(c.t), now);   // Uhrabweichung: hoechstens ab jetzt gueltig
  return now - t < READY_TTL ? { t, v: c.v } : null;
}
function storeReady(url, t, v) {
  const age = Math.max(1, Math.ceil((READY_TTL - (Date.now() - t)) / 1000));
  return caches.default.put(new Request(url.origin + READY_KEY), new Response(v, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": `public, max-age=${age}`, "x-r2-build-t": String(t) } })).catch(() => {});
}
// Liefert { v, src }: v = Bau-Kennung, wenn R2 genau den Bau von GitHub Pages enthaelt, sonst ""; src fuer Server-Timing (mem = Isolat,
// cache = geteilt aus dem Kanten-Cache, cold = kein gueltiger Stand: GitHub Pages). Nie auf eine Pruefung warten, die eine andere Anfrage
// gestartet hat (bricht sie ab, haengen sonst alle): die Pruefung laeuft ueber ctx.waitUntil dieser Anfrage, bis dahin gilt der letzte Stand.
// Kostenanalyse 25.11.2026: vorher las jedes Isolat mit gemerkter Kennung alle 30 s selbst pages/r2-build.txt (R2 Class B) und fragte GitHub Pages.
// Jetzt liest die Auffrischung im Hintergrund zuerst den geteilten Stand (/__r2c/~ready) und uebernimmt ihn, wenn er juenger ist als der eigene
// (hoechstens 30 s alt, also nie aelter als der Stand eines Isolats selbst); nur sonst prueft sie selbst und legt das Ergebnis ab. So prueft etwa ein
// Isolat je Rechenzentrum und 30 s. READY_TTL bleibt 30 s (s. o.).
const READY_BG_WAIT = 500;
async function refreshReady(env, url) {
  const sh = await sharedReady(url, READY_BG_WAIT);
  if (sh && sh.t > READY.t) { READY = { t: sh.t, v: sh.v, busy: 0 }; return; }
  const v = await checkBuild(env, url), t = Date.now();
  READY = { t, v, busy: 0 };
  await storeReady(url, t, v);
}
async function r2Ready(env, url, ctx) {
  let src = "mem";
  if (Date.now() - READY.t >= READY_TTL && !READY.v) {   // nach dem Start eines Isolates (oder zuletzt "nicht bereit"): geteilten Stand lesen
    const sh = await sharedReady(url);
    if (sh && sh.t > READY.t) { READY = { t: sh.t, v: sh.v, busy: READY.busy }; src = "cache"; } else src = "cold";
  }
  const now = Date.now();
  if (now - READY.t >= READY_TTL && now - READY.busy > 10000) {
    READY.busy = now;
    ctx.waitUntil(refreshReady(env, url).catch(() => { READY = { t: Date.now(), v: "", busy: 0 }; }));
  }
  return { v: READY.v, src };
}
// Kanten-Cache des R2-Ursprungs. Bau-Kennung mit Endung "-pfad" (site.yml seit 17.11.2026): Schluessel nur aus dem Pfad (/__r2f<pfad>) - ein Eintrag
// ueberlebt den naechsten Deploy, wenn sich die Datei nicht geaendert hat. Geaenderte, neue und entfallene Adressen leert der Deploy-Job nach dem
// vollstaendigen Spiegel und vor dem Setzen der Kennung (tools/purge_changed.py --r2): was ein Isolat mit einer alten Kennung bis dahin gecacht hat, ist
// weg, was es danach cacht, ist schon neu. Gelingt der Purge nicht, bleibt die alte Kennung (dann GitHub Pages).
// "Geaendert" heisst: Purge-Hash (tools/page_hashes.py), seit 25.11.2026 ueber die ganze Seite (die Liste "neueste Folgen", die vorher ohne Purge
// bis R2_TTL veralten durfte, gibt es nicht mehr) - deshalb leben Eintraege hier R2_EDGE_TTL (r2EdgeTtl). Eigener Praefix /__r2f: den Schluessel /__r2c<pfad> bildet der alte R2-Rueckfall aus
// jeder angefragten Adresse (z. B. /@x/... -> /__r2c/@x/...), er darf hier nie treffen. Kennung ohne "-pfad" (Deploy-Job ohne diesen Purge): wie bisher
// mit Bau-Kennung im Schluessel (/__r2c/@<kennung><pfad>), Eintraege eines frueheren Baus treffen nie.
export const PATH_KEY = /-pfad$/;
export const r2CacheKey = (origin, build, cp) => origin + (PATH_KEY.test(build) ? "/__r2f" + cp : "/__r2c/@" + build + cp);
// ---------------------------------------------------------------- R2 ueber den Zonen-Cache (Schalter R2_ZONE_CACHE, Ladezeit 27.11.2026, Punkt 2)
// Heute liest r2First ueber caches.default (Cache API): je Rechenzentrum, ohne Tiered Cache und ohne Request Collapsing. Mit R2_ZONE_CACHE="1" holt der
// Worker dasselbe Objekt zuerst als normalen Zonen-Abruf von der oeffentlichen R2-Domain (live https://img.m365.fm, Staging https://img-staging.m365.fm,
// R2_ZONE_HOST), Schluessel = die URL selbst (Host + /pages/<schluessel>): Live und Staging, Sprachen und Seiten sind dadurch getrennt; keine Query,
// keine Client-Header (kein Cookie, kein Range, kein Accept-Language). Annahmen (Doku hier nicht abrufbar, auf Staging zu pruefen): Tiered Cache und
// Request Collapsing greifen fuer solche Abrufe; ein Abruf des Workers in die eigene Zone loest keine Worker-Route aus (im Betrieb belegt: fetch an
// www.m365.fm erreicht GitHub Pages). Laeuft der Abruf doch in einen Worker, erkennt zoneGet das an x-m365-guard bzw. x-m365-environment.
// Oeffentlich bleibt /pages/* und /meta/* auf img.m365.fm 404 (Routen in wrangler.toml, der Worker antwortet vor dem Cache).
// Nur Treffer (200) kommen aus diesem Weg. Alles andere - 404, als entfernt markiert (Cache-Control-Marker m365-gone aus tools/r2_site_sync.py bzw.
// x-amz-meta-gone), 5xx, Fehler, Zeitueberschreitung, eigener Worker - nimmt in derselben Anfrage den heutigen Weg (Cache API + Bindung, dort die
// Pruefung von customMetadata.gone). Nach einem Fehler pausiert der Weg je Isolat ZONE_PAUSE ms.
// Live erst auf "1", wenn alle bestehenden Markierungen den Marker tragen (python tools/r2_site_sync.py --remark-gone): sonst kaeme eine als entfernt
// markierte Seite ohne Marker aus der Zone. Purge: tools/purge_changed.py leert bei R2_ZONE_CACHE="1" (wrangler.toml) zusaetzlich zoneUrl(...).
export const ZONE_HOSTS = { live: "https://img.m365.fm", staging: "https://img-staging.m365.fm" };
const ZONE_PAUSE = 60000;
let ZONE_DOWN = 0, ZONE_WAIT = 3000;
export function __resetZone(wait = 3000) { ZONE_DOWN = 0; ZONE_WAIT = wait; }   // nur fuer Tests
// Host des Zonen-Wegs oder "" (aus). Staging nur img-staging.m365.fm, live nur img.m365.fm - nie umgekehrt (Staging darf Live nie vergiften).
export function zoneHost(env) {
  if (!env || env.R2_ZONE_CACHE !== "1") return "";
  const want = isStaging(env) ? ZONE_HOSTS.staging : ZONE_HOSTS.live;
  return String(env.R2_ZONE_HOST || "").replace(/\/+$/, "") === want ? want : "";
}
// R2_ZONE_TTL (60 bis 604800 s) begrenzt die Kanten-Dauer im Zonen-Weg nach oben; sonst gilt die des heutigen Wegs
export const zoneTtl = (env, ttl) => { const n = Number(env && env.R2_ZONE_TTL); return Number.isInteger(n) && n >= 60 && n <= 604800 ? Math.min(ttl, n) : ttl; };
// Schluessel -> URL. Kodierung wie tools/purge_changed.py zone_url (urllib.parse.quote mit safe="/!$&'()*+,;=:@-._~"), gemeinsame Faelle in
// sitewrk/test/zone_cases.json. "" bei Punkt-Segmenten ("." / ".."): die URL-Normalisierung koennte sonst aus pages/ heraus fuehren (z. B. meta/).
export function zoneUrl(host, key) {
  if (!host || !key.startsWith("pages/") || key.split("/").some((s) => s === "." || s === "..")) return "";
  return host + "/" + encodeURIComponent(key).replace(/%(2F|24|26|2B|2C|3B|3D|3A|40)/g, (_m, x) => String.fromCharCode(parseInt(x, 16)));
}
// Fail-closed (Gegenpruefung 25.11.2026): ein Zonen-Treffer gilt nur, wenn Cache-Control genau so ankommt, wie die Uploads es setzen (r2_common.upload
// "public, max-age=600", Staging tools/staging_upload.py "no-store"). Ersetzt eine Zonen-Regel (Browser Cache TTL, Cache Rule) den Wert, ginge der Marker
// m365-gone unbemerkt verloren - dann lieber der heutige Weg (Bindung mit customMetadata.gone). Server-Timing zc="cc" zeigt das.
export const ZONE_CC = new Set(["public, max-age=600", "no-store"]);
export const zoneCcOk = (h) => ZONE_CC.has(String(h.get("cache-control") || "").trim().toLowerCase().replace(/\s*,\s*/g, ", "));
export const goneMarked = (h) => /(?:^|,)\s*m365-gone\s*(?:,|$)/i.test(h.get("cache-control") || "") || h.get("x-amz-meta-gone") === "1";
// -> Response (200, Koerper ungelesen) oder null (heutiger Weg). st.zc: Ergebnis fuer Server-Timing (cf-cache-status bzw. Grund des Rueckfalls).
export async function zoneGet(env, key, ttl, st = {}) {
  const host = zoneHost(env), u = host ? zoneUrl(host, key) : "";
  if (!u) return null;
  if (Date.now() < ZONE_DOWN) { st.zc = "paused"; return null; }
  const ac = new AbortController(); let timer;
  let res;
  try {
    // Zeitlimit nur bis zu den Headern: der Koerper (Exporte bis ~75 MB) darf danach so lange stroemen, wie der Browser braucht
    res = await Promise.race([
      fetch(new Request(u, { method: "GET", signal: ac.signal }), { cf: { cacheEverything: true, cacheTtlByStatus: { "200-299": ttl, "404": Math.min(R2_MISS_TTL, ttl), "500-599": 0 } } }),
      new Promise((_r, rej) => { timer = setTimeout(() => { ac.abort(); rej(new Error("timeout")); }, ZONE_WAIT); })]);
  } catch (e) { ZONE_DOWN = Date.now() + ZONE_PAUSE; st.zc = e && e.message === "timeout" ? "timeout" : "error"; return null; }
  finally { clearTimeout(timer); }
  const drop = (why, pause) => { if (pause) ZONE_DOWN = Date.now() + ZONE_PAUSE; st.zc = why; try { res.body && res.body.cancel(); } catch { /* egal */ } return null; };
  if (res.headers.get("x-m365-guard") || res.headers.get("x-m365-environment")) return drop("worker", true);   // lief in einen Worker statt nach R2
  if (res.status !== 200) return drop(String(res.status), res.status !== 404);   // 404: Objekt fehlt; alles andere (5xx, 403/429 von WAF/Bot-Regeln ...) pausiert
  if (!zoneCcOk(res.headers)) return drop(goneMarked(res.headers) ? "gone" : "cc", false);   // Fail-closed: Cache-Control nicht wie vom Upload gesetzt
  if (goneMarked(res.headers)) return drop("gone", false);   // x-amz-meta-gone (falls R2 Metadaten mitschickt)
  st.zc = (res.headers.get("cf-cache-status") || "none").toUpperCase();
  return res;
}
async function r2First(request, env, ctx, url, p, key, build, st = {}) {   // st.miss = true: Objekt fehlt im Bucket oder ist als entfernt markiert (kein Lesefehler)
  const html = key.endsWith("/index.html"), ext = html ? "html" : extOf(key);
  const cp = html ? (p.endsWith("/index.html") ? p.slice(0, -"index.html".length) : r2Path(p)) : p;   // /a/index.html und /a/ teilen den Eintrag
  const ttl = HASHED.test(p) ? 2592000 : FONT.test(p) ? 86400 : PATH_KEY.test(build) ? r2EdgeTtl(env) : R2_TTL;   // /__r2f: R2_EDGE_TTL (Purge je Adresse), /__r2c/@<bau>: 4 h
  // Zonen-Cache (R2_ZONE_CACHE, s. zoneGet): nur mit Pfad-Kennung ("-pfad"), weil sein Schluessel keine Bau-Kennung traegt und nur so geleert wird
  if (PATH_KEY.test(build) && zoneHost(env)) {
    const z = await zoneGet(env, key, zoneTtl(env, ttl), st);
    if (z) {
      const zm = z.headers.get("content-type");
      const h = new Headers({ "content-type": html ? CT.html : (zm && !/octet-stream/i.test(zm) ? zm : CT[ext] || "application/octet-stream"), "x-m365-cache": "Z-" + st.zc, "x-m365-src": "r2", "access-control-allow-origin": "*" });
      for (const k of ["etag", "last-modified"]) { const v = z.headers.get(k); if (v) h.set(k, v); }
      finishHeaders(h, p);
      if (notModified(request, h.get("etag"), h.get("last-modified"))) { try { z.body && z.body.cancel(); } catch { /* egal */ } return new Response(null, { status: 304, headers: h }); }
      if (request.method === "HEAD") { try { z.body && z.body.cancel(); } catch { /* egal */ } return new Response(null, { status: 200, headers: h }); }
      return new Response(z.body, { status: 200, headers: h });
    }
  }
  const cache = caches.default, ck = new Request(r2CacheKey(url.origin, build, cp));
  let hit = await cache.match(ck).catch(() => null), state = "HIT";
  if (!hit) {
    state = "MISS";
    const obj = await env.PAGES.get(key).catch(() => null);
    if (!obj || (obj.customMetadata && obj.customMetadata.gone === "1")) {   // fehlt oder vom Seitenbau als entfernt markiert (Datei bleibt im Bucket, wird aber nicht mehr ausgeliefert)
      ctx.waitUntil(cache.put(ck, new Response("", { headers: { "cache-control": `public, max-age=${R2_MISS_TTL}`, "x-r2-miss": "1" } })).catch(() => {}));
      st.miss = true; return null;
    }
    let buf; try { buf = await obj.arrayBuffer(); } catch { return null; }   // Lesefehler: GitHub Pages statt Fehlerseite (und die R2-Rueckfaelle nach dem 404 versuchen es erneut)
    const meta = obj.httpMetadata && obj.httpMetadata.contentType;
    const ct = html ? CT.html : (meta && !/octet-stream/i.test(meta) ? meta : CT[ext] || "application/octet-stream");
    hit = new Response(buf, { headers: { "content-type": ct, "etag": obj.httpEtag, "last-modified": obj.uploaded.toUTCString(), "cache-control": `public, max-age=${ttl}` } });
    ctx.waitUntil(cache.put(ck, hit.clone()).catch(() => {}));
  }
  if (hit.headers.get("x-r2-miss")) { st.miss = true; return null; }
  const h = new Headers({ "content-type": hit.headers.get("content-type"), "x-m365-cache": state, "x-m365-src": "r2", "access-control-allow-origin": "*" });   // wie GitHub Pages (CORS fuer openapi.json, llms.txt, Feeds ...)
  for (const k of ["etag", "last-modified"]) { const v = hit.headers.get(k); if (v) h.set(k, v); }
  finishHeaders(h, p);
  if (notModified(request, h.get("etag"), h.get("last-modified"))) return new Response(null, { status: 304, headers: h });
  return new Response(request.method === "HEAD" ? null : hit.body, { status: 200, headers: h });
}
// Datenexporte des Seitenbaus: fuer Programme da, nicht fuer die Suche; jede .json bekommt noindex, ausser den oeffentlichen API-Beschreibungen
// und Datenfeeds (agent.json, episodes.json, openapi.json, /.well-known/). llms*.txt, Feeds (.xml) und HTML bleiben sichtbar.
const NOINDEX = /^\/(search\/|entities\.json|entities-src\.json|entities\.jsonld|og-manifest\.json|seo-report\.json|top\.json|show\/redirects\.json|show\/transcripts\.json|show-notes\/|blog-import\/|blog-content\/)|\.jsonld$/i;
const noindexPath = (p) => !p.startsWith("/.well-known/") && !/^\/(?:agent|episodes|openapi)\.json$/i.test(p) && (NOINDEX.test(p) || /\.json$/i.test(p));
// #266: Transkript-Dateien je Folge (Hauptshow, Dub-Folge, Sprachfassung) liegen im R2-Bucket (r2out/): fuer Podcast-Apps (CORS) und Programme,
// nicht fuer die Suche (der Text steht schon auf der Folgenseite). Gleiche Regel wie site_transcripts.PATH_RX.
export const TRANSCRIPT = /^(?:\/[a-z]{2})?(?:\/show\/episodes)?\/[a-z0-9-]+\/transcript\.(txt|vtt)$/;
// Datenexporte nur im R2-Bucket (r2out/, site_size.r2_only): Blog-Import und Uebersetzungsliste der Blogbeitraege, seit 16.11.2026 auch die grossen
// Exporte im Wurzelverzeichnis (site_size.EXPORT_RX, ~75 MB): Register fuer die Datenbank (episodes-register[-<n>].json, translations-register[-<l>].json),
// og-manifest.json und seo-report.json. Nach dem 404 von GitHub Pages aus pages/<pfad> (s. u.), noindex wie bisher (noindexPath).
export const R2_EXPORT = /^\/(?:blog-import\/[^/]+\.json|translations-blog\.json|(?:og-manifest|seo-report|episodes-register(?:-[0-9]{1,3})?|translations-register(?:-[a-z]{2})?)\.json)$/;
// Sitemaps der Sprachen ausser en/de (sitemap-<l>-<typ>[-<n>].xml, site_sitemaps.write_all) liegen seit 16.11.2026 nur im R2-Bucket (r2out/,
// site_size.r2_only; allein die Blog-Sitemaps ~6 MB je Sprache). Gleiche Regel wie site_size.SITEMAP_RX. Index sitemap.xml und en/de bleiben in GitHub Pages.
export const SITEMAP_R2 = /^\/sitemap-[a-z]{2}-[a-z][a-z0-9-]*\.xml$/;

// Eigene Seiten gezogener Inhalte (/community/feed/<id>-<slug>/, site_feed.py), die der Seitenbau nicht mehr erzeugt - GitHub-Aktivitaet
// (worker/src/feedpolicy.js), ausgeblendete oder aeltere Inhalte: 410 Gone statt 404, damit Suchmaschinen sie zuegig aus dem Index nehmen.
// Kurzer Hinweis mit Link zur Community, noindex. Nur wenn weder GitHub Pages noch R2 die Seite liefern.
export const FEED_ITEM = /^(?:\/(de))?\/community\/feed\/\d+-[a-z0-9-]*\/?(?:index\.html)?$/;
function feedGone(request, p) {
  const de = FEED_ITEM.exec(p)[1] === "de", pre = de ? "/de" : "";
  const [t, msg, back] = de ? ["Inhalt entfernt", "Diesen Inhalt gibt es hier nicht mehr.", "Zur Community"] : ["Content removed", "This item is no longer available here.", "Go to the community"];
  const html = `<!doctype html><html lang="${de ? "de" : "en"}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${t} | M365.FM</title></head>` +
    `<body style="font-family:system-ui,sans-serif;max-width:40em;margin:3em auto;padding:0 1em"><h1>${t}</h1><p>${msg}</p><p><a href="${pre}/community/">${back}</a></p></body></html>`;
  const h = new Headers({ "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=3600", "x-robots-tag": "noindex" });
  for (const [k, v] of Object.entries(SEC)) h.set(k, v);
  return new Response(request.method === "HEAD" ? null : html, { status: 410, headers: h });
}

// Je Isolate 5 Minuten gemerkt: die Tabelle hat ~10.000 Eintraege, vorher wurde sie bei jeder alten Adresse neu gelesen und geparst
let RMAP = { t: -1e15, v: null };
async function redirectMap() {
  if (RMAP.v && Date.now() - RMAP.t < 300000) return RMAP.v;
  const r = await fetch("https://www.m365.fm/show/redirects.json", { cf: { cacheTtl: 3600, cacheEverything: true } });
  const v = r.ok ? await r.json().catch(() => ({})) : {};
  if (r.ok) RMAP = { t: Date.now(), v };
  return v;
}
// T8: nur Pfade, die alte Podpage-Adressen sein koennen, fragen die Weiterleitungstabelle ab (keine Dateien, keine Assets);
// unter /show nur die frueheren Blog-Adressen /show/blog/... (dort liegen sonst nur Meta-Refresh-Seiten).
const MAPPABLE = (p) => p !== "/" && !/\.[a-z0-9]{2,5}$/i.test(p) && !/^\/(assets|og|covers|fonts|\.well-known)(\/|$)/i.test(p)
  && (!/^\/shows?(\/|$)/.test(p) || p === "/show/blog" || p.startsWith("/show/blog/"));   // nur /show und /shows selbst ausnehmen, nicht Slugs wie /showback-…
async function legacyTarget(p0) {
  if (!MAPPABLE(p0)) return "";
  const map = await redirectMap();
  if (map[p0] || map[p0.toLowerCase()]) return map[p0] || map[p0.toLowerCase()];
  const m = /^\/m365-fm-podcast\/([a-z0-9-]+)$/.exec(p0);   // T8: Podpage-Folgenadressen unter dem Shownamen
  if (m) return "/show/episodes/" + m[1] + "/";
  if (/^\/categories(\/|$)/.test(p0)) return "/show/episodes/";   // T8: Podpage-Kategorien -> Folgenliste
  if (/^\/people\/mirko-peters\/?$/.test(p0)) return "/about/mirko-peters/";   // Bing-SEO-Bericht 5.11.: fruehere Podpage-Personenseite (toter Link)
  if (/^\/people(\/|$)/.test(p0)) return "/show/hosts/";
  if (/^\/guests\/intake\/?$/.test(p0)) return "/community/guests/";   // fruehere Podpage-Gaesteanmeldung
  return /^\/(blog|videos|p)\//.test(p0) ? "/show/" : "";
}

// ---------- Blog auf der eigenen Domain (BYOD, BLOG_OWN_DOMAIN.md) ----------
// Nur mit BYOD="1" (Standard "0": diese Weiche ist dann nie aktiv). Eigene Hosts (m365.fm, *.m365.fm, m365con.net) gehen unveraendert den alten Weg.
// Jeder andere Host muss streng wie ein Hostname aussehen UND mit dem Host-Header uebereinstimmen (kein Host-Header-Trick); ob er einer aktiven
// Mitglieds-Domain gehoert, entscheidet allein der Community-Worker (D1, Status 'active', oeffentliches Profil). Sonst neutrales 404, nie eine Weiterleitung.
const OWN_HOST = /(^|\.)(m365\.fm|m365con\.net)$/;
const HOSTNAME = /^(?=.{4,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+(?:[a-z]{2,24}|xn--[a-z0-9-]{2,59})$/;
// -> "" (Weiche nicht aktiv oder eigener Host), "bad" (Host verdaechtig) oder der geprüfte Host
export function foreignHost(env, request, url) {
  if (env.BYOD !== "1") return "";
  const u = url.hostname.toLowerCase();
  if (OWN_HOST.test(u)) return "";
  const hh = (request.headers.get("host") || "").trim().toLowerCase().replace(/:\d+$/, "");
  if (!HOSTNAME.test(u) || (hh && hh !== u)) return "bad";
  return u;
}
const FSEC = { "strict-transport-security": "max-age=31536000", "x-content-type-options": "nosniff", "referrer-policy": "strict-origin-when-cross-origin", "permissions-policy": "camera=(), microphone=(), geolocation=(), payment=(), interest-cohort=()", "x-frame-options": "DENY" };   // HSTS ohne includeSubDomains: die Domain gehoert dem Mitglied
const PASS = ["content-type", "cache-control", "content-language", "x-robots-tag", "content-security-policy"];
const plain = (status, msg, extra = {}) => new Response(msg, { status, headers: { "content-type": "text/plain; charset=utf-8", "x-robots-tag": "noindex", "cache-control": "public, max-age=60", ...FSEC, ...extra } });
async function byodServe(request, env, url, host) {
  if (request.method !== "GET" && request.method !== "HEAD") return plain(405, "Method not allowed", { allow: "GET, HEAD" });
  if (url.protocol === "http:") return new Response(null, { status: 301, headers: { location: "https://" + host + url.pathname + url.search, "cache-control": "public, max-age=3600", ...FSEC } });   // gleicher, geprüfter Host
  const q = "/api/byod/serve?host=" + encodeURIComponent(host) + "&path=" + encodeURIComponent(url.pathname);
  let res;
  try {
    res = env.COMMUNITY ? await env.COMMUNITY.fetch(new Request("https://community.internal" + q)) : await fetch((env.API || "https://api-dub.m365.fm") + q, { cf: { cacheEverything: true, cacheTtl: 300 } });
  } catch { return plain(503, "Temporarily unavailable", { "cache-control": "no-store" }); }
  if (res.status >= 500) return plain(503, "Temporarily unavailable", { "cache-control": "no-store" });
  const h = new Headers(FSEC);
  for (const k of PASS) { const v = res.headers.get(k); if (v) h.set(k, v); }
  const loc = res.headers.get("location");
  if (loc) { if (!/^\/(?![\\/])/.test(loc)) return plain(404, "Not found"); h.set("location", "https://" + host + loc); }   // nur Pfad auf derselben Domain
  return new Response(request.method === "HEAD" || res.status === 301 ? null : res.body, { status: res.status, headers: h });
}

// Header fuer Antworten von GitHub Pages und aus R2 (gleiche Regeln, egal woher die Datei kommt)
// status: Status der Antwort (Standard 200). immutable nur bei 200/304 (Gegenpruefung 25.11.2026): ein 404 auf einen gehashten Namen (Datei beim
// r2out-Upload gescheitert, noch nicht deployt) bliebe sonst ein Jahr im Browser, auch nachdem die Datei da ist; Fehler unter solchen Namen 60 s.
function finishHeaders(h, p, status = 200) {
  const isImg = IMG.test(p), isStatic = STATIC.test(p) || FONT.test(p), imm = HASHED.test(p) || FONT.test(p);
  for (const [k, v] of Object.entries(SEC)) h.set(k, v);
  // T41: Schriften aendern sich unter gleichem Namen nicht (1 Jahr), Bilder 1 Tag, Skripte/Stile 1 h und danach im Hintergrund pruefen
  h.set("cache-control", imm && status !== 200 && status !== 304 ? "public, max-age=60" : imm ? "public, max-age=31536000, immutable" : isImg ? "public, max-age=86400, stale-while-revalidate=604800"
    : isStatic ? "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400" : HTML_CC);
  if (noindexPath(p)) h.set("x-robots-tag", "noindex");
  const tm = TRANSCRIPT.exec(p);
  if (tm) { h.set("content-type", CT[tm[1]]); h.set("x-robots-tag", "noindex"); h.set("access-control-allow-origin", "*"); }   // #266
  if (isImg) h.set("vary", "accept");
  // Merker fuer den Seitenbau (site.yml, Deploy-Job): diese Worker-Fassung liefert die Sitemaps der Sprachen ausser en/de aus R2 (SITEMAP_R2).
  // Erst wenn /sitemap.xml ihn traegt, veroeffentlicht der Deploy-Job ein docs/ ohne diese Sitemaps - sonst antworteten sie mit 404 (alter Worker).
  if (p === "/sitemap.xml" || SITEMAP_R2.test(p)) h.set("x-m365-sitemaps", "r2");
  // Ebenso fuer die Datenexporte aus R2 (R2_EXPORT mit gone/src=docs-Pruefung, seit 16.11.2026): der Deploy-Job prueft beide Merker auf /sitemap.xml.
  if (p === "/sitemap.xml" || R2_EXPORT.test(p)) h.set("x-m365-exports", "r2");
  if (p === "/") h.set("vary", VARY_HOME);   // Startseite: Antwort haengt von Sprache und Cookie ab (s. homeLang) - nie fuer eine andere Sprache aus einem Cache
  if (p === "/") h.set("link", '</.well-known/api-catalog>; rel="api-catalog", </openapi.json>; rel="service-desc"; type="application/vnd.oai.openapi+json", </llms.txt>; rel="service-doc"; type="text/plain", </.well-known/agent.json>; rel="describedby"; type="application/json"');   // RFC 8288 / 9727: Startseite verweist auf maschinenlesbare Ressourcen
  if (p === "/.well-known/api-catalog") { h.set("content-type", 'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"'); h.set("access-control-allow-origin", "*"); }
}

// Startseite in der Sprache des Browsers (Wunsch Mirko 6.11.2026): nur GET/HEAD auf genau "/", nur fuer HTML-Anfragen von Menschen.
// Reihenfolge: Cookie m365_lang (Wahl im Sprachmenue, assets/page.js) > Bot/Crawler (nie umleiten) > Accept-Language (q-Werte, Hauptsprache:
// de-AT -> de, pt-BR -> pt; zh -> keine Site-Sprache -> Englisch). Englisch bleibt auf "/", sonst 302 auf /<sprache>/ (privat, nie im Cache).
export const SITE_LANGS = ["en", "de", "fr", "es", "it", "nl", "pt", "pl", "id", "ru", "uk", "ar", "he", "ja", "ko"];
const LANG_ALIAS = { iw: "he", in: "id", nb: "", no: "" };   // alte ISO-Codes (Java/Android) auf die heutigen
export const BOT_UA = /bot\b|bot\/|crawl|spider|slurp|archiver|mediapartners|google-|googleother|feedfetcher|bingpreview|gptbot|chatgpt|oai-searchbot|claude|anthropic|perplexity|cohere|facebookexternalhit|facebot|meta-external|linkedinbot|slackbot|twitterbot|discordbot|telegrambot|whatsapp|skypeuripreview|redditbot|pinterest|embedly|applebot|duckduck|yandex|baidu|petalbot|bytespider|amazonbot|ccbot|semrush|ahrefs|mj12|dotbot|seznam|qwant|ia_archiver|lighthouse|pagespeed|chrome-lighthouse|headlesschrome|phantomjs|curl\/|wget|python-|go-http|okhttp|java\/|node-fetch|axios|postman|uptime|pingdom|statuscake|monitor/i;
export function isBot(ua) { return !ua || BOT_UA.test(ua); }
export function langCookie(cookie) {
  const m = /(?:^|;\s*)m365_lang=([a-z]{2})(?:;|$)/.exec(cookie || "");
  return m && SITE_LANGS.includes(m[1]) ? m[1] : "";
}
// Beste Site-Sprache aus Accept-Language ("" = keine passende Sprache). Gleiche q-Werte: Reihenfolge im Header.
export function pickLang(al) {
  const xs = String(al || "").split(",").map((part, i) => {
    const [tag, ...ps] = part.trim().split(";");
    let q = 1;
    for (const x of ps) { const m = /^\s*q\s*=\s*([0-9.]+)\s*$/i.exec(x); if (m) q = Number(m[1]); }
    return { tag: tag.trim().toLowerCase(), q: Number.isFinite(q) ? q : 0, i };
  }).filter((x) => x.tag && x.tag !== "*" && x.q > 0).sort((a, b) => b.q - a.q || a.i - b.i);
  for (const x of xs) {
    let p = x.tag.split(/[-_]/)[0];
    if (p in LANG_ALIAS) p = LANG_ALIAS[p];
    if (SITE_LANGS.includes(p)) return p;
  }
  return "";
}
// Sprache fuer die Startseite dieser Anfrage oder "" (bleibt auf "/"). Pfad prueft der Aufrufer.
export function homeLang(request) {
  if (request.method !== "GET" && request.method !== "HEAD") return "";
  const acc = request.headers.get("accept") || "";
  if (!/text\/html|\*\/\*/i.test(acc)) return "";   // nur Seitenaufrufe (Browser schicken text/html), keine Feeds/Programme
  const c = langCookie(request.headers.get("cookie"));
  if (c) return c === "en" ? "" : c;
  if (isBot(request.headers.get("user-agent"))) return "";
  const l = pickLang(request.headers.get("accept-language"));
  return l && l !== "en" ? l : "";
}
const VARY_HOME = "Accept-Language, Cookie";
function langRedirect(origin, lang, search) {
  const h = new Headers({ location: origin + "/" + lang + "/" + (search || ""), vary: VARY_HOME, "cache-control": "private, no-store" });
  for (const [k, v] of Object.entries(SEC)) h.set(k, v);
  return new Response(null, { status: 302, headers: h });
}
// Jede Weiterleitung in genau einem Schritt (Wunsch Mirko 6.11.2026): Ziel "/" bekommt fuer Menschen gleich die Sprach-Startseite (302),
// sonst 301. Weiterleitungen auf "/" tragen Vary, damit kein Cache die Antwort fuer eine andere Sprache wiederverwendet.
function redirect(request, origin, path, search, status = 301) {
  if (path === "/") {
    const l = homeLang(request);
    if (l) return langRedirect(origin, l, search);
    return new Response(null, { status, headers: { location: origin + "/" + (search || ""), vary: VARY_HOME } });
  }
  return Response.redirect(origin + path + (search || ""), status);
}
const GONE_LANG = /^\/(pa|hi|ml|ta|te)(\/|$)/, MIRKO = /^(\/[a-z]{2})?\/community\/u\/mirko-peters(\/.*)?$/, EN_PREFIX = /^\/en(\/.*)?$/;
const LANG_EP = /^\/(de|es|fr|it|pt|nl|pl|id|ru|uk|ar|he|ja|ko)\/show\/episodes\/([a-z0-9-]+)\/?$/;
// Seiten, die es nur im R2-Bucket gibt (Nachbau von site_size.r2_only fuer HTML-Verzeichnisse): Entitaeten aller Sprachen (site_entities.py) und alle
// Seiten der Sprachen ausser en/de (PAGES_LANGS) - nicht die Startseite /<l>/ selbst, die liegt in GitHub Pages. Sprachen wie LANG_EP ohne de.
// Seit 27.11.2026 (Ladezeit, Luecken von #602) auch: deutsche Folgenseiten /de/show/episodes/<slug>/ (site_podpage.py, nur write_r2) und die
// Glossar-Hinweisseiten /glossary/<id>/, /de/glossary/<id>/ (site_learn.py, nur write_r2) - nicht /glossary/ selbst. Gemischt und deshalb NICHT hier:
// uebersetzte Blogbeitraege (/de)?/community/u/<h>/blog/<slug>/ (Originale in docs/, ein direkter Versuch kostete dort eine R2-Lesung vor GitHub Pages).
// Faelle: sitewrk/test/r2only_cases.json (auch fuer tests/test_r2_only_paths.py).
export const R2_ONLY_PAGE = /^\/(?:(?:[a-z]{2}\/)?entity\/[^/]+|(?:es|fr|it|pt|nl|pl|id|ru|uk|ar|he|ja|ko)\/.+|de\/show\/episodes\/[a-z0-9-]+|(?:de\/)?glossary\/[^/]+)\/$/;
// Dateien nur im R2-Bucket (Sitemaps ausser en/de, Datenexporte, Transkripte): im kalten Zustand gleich ueber r2File statt erst GitHub Pages (404)
export const r2OnlyFile = (p) => SITEMAP_R2.test(p) || R2_EXPORT.test(p) || TRANSCRIPT.test(p);
// Rueckfall fuer diese Dateien aus pages/<pfad> (vorher drei Bloecke nach dem 404 von GitHub Pages, unveraendert zusammengefasst): Sitemaps indexierbar
// als application/xml, Exporte als application/json mit noindex (noindexPath), Transkripte mit eigenem Typ (finishHeaders); SEC- und Cache-Header, CORS
// wie GitHub Pages, ETag/304, HEAD. Sitemaps und Exporte: als entfernt markiert (gone=1) oder nur Spiegel von GitHub Pages (src=docs, dort 404 = wirklich
// weg) -> null. Transkripte: nur gone=1 -> null (wie bisher). null: der Aufrufer liefert die Antwort von GitHub Pages (bzw. fragt sie erst dann).
async function r2File(request, env, p) {
  const sm = SITEMAP_R2.test(p), ex = !sm && R2_EXPORT.test(p), tr = !sm && !ex && TRANSCRIPT.test(p);
  if (!sm && !ex && !tr) return null;
  const obj = await env.PAGES.get("pages" + p).catch(() => null);
  const cm = (obj && obj.customMetadata) || {};
  if (!obj || cm.gone === "1" || (!tr && cm.src === "docs")) return null;
  const h = tr ? new Headers() : new Headers({ "content-type": sm ? CT.xml : CT.json, "access-control-allow-origin": "*" });   // CORS wie GitHub Pages
  if (obj.httpEtag) h.set("etag", obj.httpEtag);
  if (obj.uploaded) h.set("last-modified", obj.uploaded.toUTCString());
  finishHeaders(h, p);
  if (notModified(request, h.get("etag"), h.get("last-modified"))) return new Response(null, { status: 304, headers: h });
  if (!tr && request.method === "HEAD" && Number.isFinite(obj.size)) h.set("content-length", String(obj.size));   // wie GitHub Pages: Groesse auch per HEAD (GET: Laenge des R2-Datenstroms)
  return new Response(request.method === "HEAD" ? null : obj.body, { headers: h });
}
// T37: Suchindex im R2-Bucket (pages/search/...). Kanten-Cache 600 s (wie s-maxage) unter /__r2f<pfad> (Kostenanalyse 25.11.2026: vorher jede Anfrage eine
// R2-Lesung). Den Schluessel leert der Deploy wie jede geaenderte r2out-Datei (tools/purge_changed.py --r2, Liste aus r2-changed.json). Nur Treffer werden gemerkt.
// Vor dem 27.11.2026 erst nach dem 404 von GitHub Pages; Inhalt, Header und Cache-Schluessel unveraendert. null: nicht im Bucket.
export const SEARCH_R2 = /^\/search\/(manifest|part-\d{1,4})\.json$/;
async function searchIndex(request, env, ctx, url, p) {
  const sh = { "content-type": "application/json; charset=utf-8", "cache-control": "public, max-age=300, s-maxage=600", "x-robots-tag": "noindex", "access-control-allow-origin": "*" };
  const sk = new Request(url.origin + "/__r2f" + p), c = await caches.default.match(sk).catch(() => null);
  if (c) return new Response(request.method === "HEAD" ? null : c.body, { headers: { ...sh, "x-m365-cache": "HIT" } });
  const obj = await env.PAGES.get("pages" + p).catch(() => null);
  let buf = null; if (obj) { try { buf = await obj.arrayBuffer(); } catch { buf = null; } }
  if (!buf) return null;
  ctx.waitUntil(caches.default.put(sk, new Response(buf.slice(0), { headers: { "content-type": sh["content-type"], "cache-control": "public, max-age=600" } })).catch(() => {}));
  return new Response(request.method === "HEAD" ? null : buf, { headers: { ...sh, "x-m365-cache": "MISS" } });
}
// Messung (Workers Logs): eine JSON-Zeile je Seitenaufruf einer R2-only-Seite - Weg (src), Herkunft der Bau-Kennung (ready), Kanten-Cache des
// R2-Wegs (cache = x-m365-cache), Dauern in ms, Rechenzentrum und Land. Keine Query, keine IP, kein User-Agent; kein zusaetzlicher Abruf.
function logR2Page(request, p, src, ready, res, r2, origin) {
  try {
    const cf = request.cf || {};
    console.log(JSON.stringify({ m: "r2page", p, src, ready, st: res.status, cache: res.headers.get("x-m365-cache") || "", edge: res.headers.get("cf-cache-status") || "",
      r2: r2 ?? null, origin: origin ?? null, colo: cf.colo || "", country: cf.country || "" }));
  } catch { /* Messung darf nie eine Antwort verhindern */ }
}
const INVITE = /^\/einladung\/([a-z0-9][a-z0-9-]{1,38})\/?$/;   // Profilkuerzel wie im Community-Worker (worker/src/inviter.js)
// Eigene Seite eines Events, Profils oder einer Firma (site_events.py, site_members.py): entsteht erst mit dem naechsten Seitenbau. Listen zeigen nur
// Eintraege mit Seite; ein Link von anderswo (Mail, Admin, Profil-Bereich) auf eine noch fehlende Seite fuehrt zur Liste der Sprache statt auf ein 404.
export const EVENT_PAGE = /^(\/[a-z]{2})?\/community\/events\/([a-z0-9][a-z0-9-]{2,39})\/?$/;
export const PROFILE_PAGE = /^(\/[a-z]{2})?\/community\/(u|c)\/([a-z0-9][a-z0-9-]{1,38})\/?$/;   // nur die Profilseite selbst (Unterseiten wie /blog/ nicht)
// Reine Adressregeln (ohne Ursprung) - ein Schritt: Ziel oder "". site_links.py rule_target() ist der Nachbau.
async function ruleStep(p, migrated) {
  const p0 = p.replace(/\/+$/, "") || "/";
  if (migrated) { const to = await legacyTarget(p0); if (to) return to; }
  const mp = MIRKO.exec(p); if (mp) return (mp[1] || "") + "/community/u/mirko-p" + (mp[2] || "/");   // alter Name des Blog-Profils
  if (GONE_LANG.test(p)) return "/";   // diese Sprachen gibt es nicht mehr (Punjabi, Hindi, Malayalam, Tamil, Telugu)
  const me = EN_PREFIX.exec(p); if (me) return me[1] || "/";   // Englisch liegt ohne Sprachpfad unter "/" (/en/ gab es nie)
  return "";
}
// Alle Regeln hintereinander bis zum Endziel (A -> C statt A -> B -> C); "" = keine Weiterleitung. Schleife: letzter Stand vor der Wiederholung.
export async function finalTarget(p, migrated) {
  let cur = p, n = 0; const seen = new Set([p]);
  while (n < 6) {
    const nx = await ruleStep(cur, migrated);
    if (!nx || seen.has(nx)) break;
    seen.add(nx); cur = nx; n++;
  }
  return n ? cur : "";
}

// Testumgebung (ENVIRONMENT=staging, [env.staging] in wrangler.toml, Host staging.m365.fm): liefert NUR, was der Staging-Bau im eigenen Bucket
// (m365-fm-staging, Schluessel pages/<pfad>) abgelegt hat. Kein Zugriff auf GitHub Pages, auf den Live-Bucket oder auf Live-Weiterleitungen.
// Jede Antwort: X-Robots-Tag noindex, nofollow, nie im Cache; /robots.txt sperrt alles. Aufgebaut wie die Live-Auslieferung aus R2 (r2First), nur ohne Ursprung.
export const isStaging = (env) => String(env?.ENVIRONMENT || "").toLowerCase() === "staging";
export const STAGING_ROBOTS = "User-agent: *\nDisallow: /\n";
function stagingHeaders(extra = {}) {
  const h = new Headers({ "x-robots-tag": "noindex, nofollow", "x-m365-environment": "staging", "cache-control": "no-store", ...extra });
  for (const [k, v] of Object.entries(SEC)) h.set(k, v);
  return h;
}
export async function stagingFetch(request, env) {
  const url = new URL(request.url), p = url.pathname, head = request.method === "HEAD";
  // img-staging.m365.fm (R2-Domain des Staging-Buckets, nur fuer den Zonen-Cache): oeffentlich immer 404, Route in wrangler.toml [env.staging]
  if (url.hostname === new URL(ZONE_HOSTS.staging).hostname) return new Response(head ? null : "Not found", { status: 404, headers: stagingHeaders({ "content-type": "text/plain; charset=utf-8", "x-m365-guard": "1" }) });
  if (request.method !== "GET" && !head) return new Response("Method not allowed", { status: 405, headers: stagingHeaders({ allow: "GET, HEAD", "content-type": "text/plain; charset=utf-8" }) });
  if (p === "/robots.txt") return new Response(head ? null : STAGING_ROBOTS, { headers: stagingHeaders({ "content-type": "text/plain; charset=utf-8" }) });
  if (!env.PAGES) return new Response("Staging-Bucket nicht verbunden", { status: 503, headers: stagingHeaders({ "content-type": "text/plain; charset=utf-8" }) });
  let dp = p; try { dp = decodeURIComponent(p); } catch { /* ungueltige Kodierung: wie angefragt */ }
  if (dp.split("/").includes("..") || dp.includes("\0")) return new Response("Bad request", { status: 400, headers: stagingHeaders({ "content-type": "text/plain; charset=utf-8" }) });
  if (!dp.endsWith("/") && !extOf(dp)) return new Response(null, { status: 301, headers: stagingHeaders({ location: url.origin + p + "/" + url.search }) });   // wie GitHub Pages: Verzeichnis ohne "/" -> mit "/"
  const key = r2Key(dp);
  // Zonen-Cache (R2_ZONE_CACHE="1" in [env.staging]): derselbe Weg wie live in r2First, Treffer direkt; sonst die Bindung wie bisher (inkl. gone-Pruefung)
  const zst = {}, z = key && zoneHost(env) ? await zoneGet(env, key, zoneTtl(env, 300), zst) : null;
  if (z) {
    const zm = z.headers.get("content-type"), zext = key.endsWith("/index.html") ? "html" : extOf(key);
    const h = stagingHeaders({ "content-type": zext === "html" ? CT.html : (zm && !/octet-stream/i.test(zm) ? zm : CT[zext] || "application/octet-stream"), "server-timing": `zc;desc="${zst.zc}"` });
    const et = z.headers.get("etag"); if (et) h.set("etag", et);
    if (head) { try { z.body && z.body.cancel(); } catch { /* egal */ } }
    return new Response(head ? null : z.body, { status: 200, headers: h });
  }
  const obj = key ? await env.PAGES.get(key).catch(() => null) : null;
  if (!obj || (obj.customMetadata && obj.customMetadata.gone === "1")) {
    const nf = await env.PAGES.get("pages/404.html").catch(() => null);
    const body = nf && !head ? await nf.text().catch(() => "") : "";
    return new Response(head ? null : body || "Not found", { status: 404, headers: stagingHeaders({ "content-type": nf ? CT.html : "text/plain; charset=utf-8" }) });
  }
  const ext = key.endsWith("/index.html") ? "html" : extOf(key), meta = obj.httpMetadata && obj.httpMetadata.contentType;
  const h = stagingHeaders({ "content-type": ext === "html" ? CT.html : (meta && !/octet-stream/i.test(meta) ? meta : CT[ext] || "application/octet-stream") });
  if (zst.zc) h.set("server-timing", `zc;desc="fb-${zst.zc}"`);   // Zonen-Weg versucht, Rueckfall auf die Bindung (Grund)
  if (obj.httpEtag) h.set("etag", obj.httpEtag);
  return new Response(head ? null : obj.body, { status: 200, headers: h });
}

// Profilseite eines neuen Mitglieds, solange der Seitenbau sie noch nicht erzeugt hat: /community/u/<handle>/ und /<sprache>/community/u/<handle>/
// entstehen nur beim statischen Seitenbau (site_members.py, Stunden). Fehlt die Seite (404 vom Ursprung), baut der Worker eine einfache Live-Seite aus
// dem oeffentlichen Profil-Endpunkt der Community-API (GET /api/profile/<handle>, ohne Anmeldung nur fuer oeffentliche Profile, sonst 404).
// 200 nur bei einem oeffentlichen Profil; sonst und bei jedem API-Fehler greift die 302-Weiterleitung zur Mitgliederliste (PROFILE_PAGE, nie eine
// 5xx-Seite). Die Seite ist noindex und no-store: nach dem Bau gilt sofort die feste Seite (die kanonische). Nur Felder, die auch die statische Seite
// zeigt (ohne Kontaktdaten). Nur Personen (/u/); Firmen (/c/) gehen direkt zur Firmenliste.
export const LIVE_PROFILE_PAGE = /^(?:\/(de|fr|es|it|nl|pt|pl|id|ru|uk|ar|he|ja|ko))?\/community\/u\/([a-z0-9][a-z0-9-]{2,29})\/?(?:index\.html)?$/;   // Kuerzel wie HANDLE in worker/src/profiles.js
// Kanten-Cache (Kostenanalyse 25.11.2026): "kein oeffentliches Profil" 600 s (vorher 60), ein oeffentliches Profil 120 s (vorher gar nicht) - je
// Kuerzel unter /__live/u/<kuerzel> bzw. /__live/p/<kuerzel> (interne Schluessel, oeffentlich 404). Die Antwort an den Browser bleibt no-store.
// Folge: ein Profil, das auf nicht oeffentlich wechselt, kann hier hoechstens 120 s weiter erscheinen; ein neues hoechstens 600 s spaeter.
const COMMUNITY_API = "https://api-dub.m365.fm", PROFILE_MISS_TTL = 600, PROFILE_HIT_TTL = 120;
const esc = (x) => String(x ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const str = (x, max) => (typeof x === "string" ? x.trim().slice(0, max) : "");
function safeUrl(u) {   // nur http/https; der Wert kommt aus dem normalisierten URL-Objekt
  try { const x = new URL(String(u)); return (x.protocol === "http:" || x.protocol === "https:") && x.hostname ? x.href : ""; } catch { return ""; }
}
const PROFILE_TXT = {
  en: { members: "Members", about: "About", company: "Company", country: "Country", channels: "Channels", fresh: "This profile is new. The full page follows with the next site update.", followers: "followers", photo: "Profile photo of" },
  de: { members: "Mitglieder", about: "Über mich", company: "Firma", country: "Land", channels: "Kanäle", fresh: "Dieses Profil ist neu. Die vollständige Seite folgt mit dem nächsten Seitenbau.", followers: "Follower", photo: "Profilfoto von" },
};
const CHANNEL_KIND = { linkedin: "LinkedIn", youtube: "YouTube", github: "GitHub", x: "X", twitter: "X", mastodon: "Mastodon", bluesky: "Bluesky", website: "Website", blog: "Blog", podcast: "Podcast", facebook: "Facebook", instagram: "Instagram", tiktok: "TikTok", twitch: "Twitch" };
export function profileHtml(v, lang, handle, api) {
  const L = PROFILE_TXT[lang] || PROFILE_TXT.en, de = lang === "de", pre = lang && lang !== "en" ? "/" + lang : "";
  const tr = (v.i18n && typeof v.i18n === "object" && v.i18n[lang]) || {};   // Profiltexte in der Sprache der Seite, sonst Original (wie site_members.py)
  const name = str(v.name, 120) || handle, headline = str(tr.headline, 200) || str(v.headline, 200), about = str(tr.about, 3000) || str(v.about, 3000);
  const tl = lang && lang !== "en" && lang !== "de" ? ` lang="${esc(lang)}" dir="auto"` : ' dir="auto"';   // Nutzertext kann in einer anderen Sprache stehen als die Oberflaeche
  const facts = [];
  const org = v.org && typeof v.org === "object" ? str(v.org.name, 120) : "", job = str(v.job, 100), company = str(v.company, 100);
  const comp = [job, org || company].filter(Boolean).join(" · ");
  if (comp) facts.push([L.company, esc(comp)]);
  if (str(v.country, 80)) facts.push([L.country, esc(str(v.country, 80))]);
  const chans = (Array.isArray(v.channels) ? v.channels : []).slice(0, 12).map((c) => {
    const href = c && safeUrl(c.url); if (!href) return "";
    const kind = CHANNEL_KIND[String(c.kind || "").toLowerCase()] || str(c.kind, 30) || "Link", fol = Number.isFinite(+c.followers) && +c.followers > 0 ? ` · ${Math.floor(+c.followers).toLocaleString("en-US")} ${L.followers}` : "";
    return `<li><a href="${esc(href)}" rel="me nofollow ugc noopener" target="_blank">${esc(kind)}</a> <span class="mut">${esc(href.replace(/^https?:\/\//, "").replace(/\/$/, "").slice(0, 60))}${fol}</span></li>`;
  }).filter(Boolean);
  const img = Number.isInteger(v.img) && v.img > 0 ? `<img src="${esc(api + "/api/img/u/" + handle + ".jpg?v=" + v.img)}" alt="${esc(L.photo + " " + name)}" width="128" height="128" style="border-radius:50%;object-fit:cover">` : "";
  const title = `${name}${headline ? " – " + headline : ""} | M365.FM`;
  return `<!doctype html><html lang="${de ? "de" : "en"}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${esc(title)}</title>` +
    `<style>body{font-family:system-ui,sans-serif;max-width:42em;margin:2.5em auto;padding:0 1em;line-height:1.5}.mut{color:#666}th{text-align:left;padding-right:1em;font-weight:600}</style></head><body>` +
    `<nav aria-label="breadcrumb"><a href="${pre}/community/members/">${esc(L.members)}</a></nav>${img}<h1${tl}>${esc(name)}</h1>` +
    (headline ? `<p style="font-size:1.1em"${tl}>${esc(headline)}</p>` : "") +
    (facts.length ? `<table><tbody>${facts.map(([a, b]) => `<tr><th scope="row">${esc(a)}</th><td>${b}</td></tr>`).join("")}</tbody></table>` : "") +
    (about ? `<h2>${esc(L.about)}</h2><p style="white-space:pre-line"${tl}>${esc(about)}</p>` : "") +
    (chans.length ? `<h2>${esc(L.channels)}</h2><ul>${chans.join("")}</ul>` : "") +
    `<p class="mut"><small>${esc(L.fresh)}</small></p></body></html>`;
}
// null = kein Live-Profil (unbekannt, nicht oeffentlich, API-Fehler): der Aufrufer leitet dann per 302 zur Mitgliederliste weiter
async function profileLive(request, env, ctx, url, m) {
  const handle = m[2], lang = m[1] || "", api = (env && typeof env.COMMUNITY_API === "string" && /^https:\/\/[a-z0-9.-]+$/i.test(env.COMMUNITY_API) ? env.COMMUNITY_API : COMMUNITY_API);
  const cache = caches.default, ck = new Request(url.origin + "/__live/u/" + handle), pk = new Request(url.origin + "/__live/p/" + handle);
  const [miss, kept] = await Promise.all([cache.match(ck).catch(() => null), cache.match(pk).catch(() => null)]);
  if (miss) return null;   // gemerkt: eindeutig kein oeffentliches Profil (schuetzt die API vor Abfragen erfundener Kuerzel)
  let j = null;
  if (kept) { try { j = await kept.json(); } catch { j = null; } }
  if (!j) {
    let r;
    try { r = await fetch(api + "/api/profile/" + handle, { headers: { accept: "application/json" }, signal: AbortSignal.timeout(3000), cf: { cacheTtl: 0 } }); } catch { return null; }
    if (r.status === 404) { ctx.waitUntil(cache.put(ck, new Response("", { headers: { "cache-control": `public, max-age=${PROFILE_MISS_TTL}` } })).catch(() => {})); return null; }
    if (!r.ok) return null;
    try { j = await r.json(); } catch { return null; }
    const v0 = j && j.profile;
    if (v0 && typeof v0 === "object" && v0.type === "u" && v0.handle === handle && v0.public === true)   // nur gepruefte oeffentliche Profile merken
      ctx.waitUntil(cache.put(pk, new Response(JSON.stringify({ profile: v0 }), { headers: { "content-type": "application/json", "cache-control": `public, max-age=${PROFILE_HIT_TTL}` } })).catch(() => {}));
  }
  const v = j && j.profile;
  if (!v || typeof v !== "object" || v.type !== "u" || v.handle !== handle || v.public !== true) return null;   // nur oeffentliche Profile mit genau diesem Kuerzel
  const html = profileHtml(v, lang || "en", handle, api);
  const h = new Headers({ "content-type": "text/html; charset=utf-8", "cache-control": "no-store", "x-robots-tag": "noindex", "x-m365-live": "profile" });
  for (const [k, x] of Object.entries(SEC)) h.set(k, x);
  return new Response(request.method === "HEAD" ? null : html, { status: 200, headers: h });
}

// ---------------------------------------------------------------- partner.m365.fm: Sponsor-Dashboard auf eigener Subdomain
// Das Dashboard liegt weiter als Seite unter /sponsor/dashboard/ (Seitenbau, GitHub Pages bzw. R2); partner.m365.fm zeigt dieselben Seiten ohne den
// Pfadteil: / = Dashboard, /placement/ /report/ /sources/, davor optional die Sprache (/de/, /de/report/). Die alte Adresse auf www.m365.fm leitet per 301 um.
// Anmeldung und Daten bleiben bei api-dub.m365.fm (Cookie dort, CORS und Rueckkehr erlauben PARTNER_SITE; die OAuth-Rueckleitung bleibt api-dub.m365.fm/auth/callback/<anbieter>).
const PARTNER_LANG = "de|es|fr|it|pt|nl|pl|id|ru|uk|ar|he|ja|ko", PARTNER_VIEWS = "placement|report|sources";
const WWW_DASH = new RegExp(`^(?:/(${PARTNER_LANG}))?/sponsor/dashboard(?:/(${PARTNER_VIEWS}))?/?$`);
const PARTNER_DASH = new RegExp(`^(?:/(${PARTNER_LANG}))?(?:/(${PARTNER_VIEWS}))?/?$`);
// /de/sponsor/dashboard/report/ -> /de/report/ ; "" = kein Dashboard-Pfad
export function wwwToPartner(path) {
  const m = WWW_DASH.exec(path);
  return m ? (m[1] ? "/" + m[1] : "") + (m[2] ? "/" + m[2] : "") + "/" : "";
}
// /de/report/ -> /de/sponsor/dashboard/report/ ; auch die lange Form wird angenommen; "" = kein Dashboard-Pfad
export function partnerToWww(path) {
  const m = PARTNER_DASH.exec(path) || WWW_DASH.exec(path);
  return m ? (m[1] ? "/" + m[1] : "") + "/sponsor/dashboard" + (m[2] ? "/" + m[2] : "") + "/" : "";
}
// admin.m365.fm: die Verwaltung (/admin/) auf eigener Subdomain; "/" = /admin/. Kein weiterer Pfad gehoert dazu (alles andere: Website).
const WWW_ADMIN = /^\/admin\/?$/;
export function wwwToAdmin(path) { return WWW_ADMIN.test(path) ? "/" : ""; }
export function adminToWww(path) { return path === "/" || WWW_ADMIN.test(path) ? "/admin/" : ""; }
// profile.m365.fm: Konto und Profil (die Community-App /community/ mit allen Reitern) auf eigener Subdomain; "/" = /community/, "/de/" = /de/community/.
// Nur die App selbst zieht um: oeffentliche Profile (/community/u/<kuerzel>/), Blog, Podcast, Gaeste und die Einstiegsseiten bleiben auf www.m365.fm.
const WWW_PROFILE = new RegExp(`^(?:/(${PARTNER_LANG}))?/community/?$`);
const PROFILE_ROOT = new RegExp(`^(?:/(${PARTNER_LANG}))?/?$`);
export function wwwToProfile(path) { const m = WWW_PROFILE.exec(path); return m ? (m[1] ? "/" + m[1] : "") + "/" : ""; }
export function profileToWww(path) { const m = PROFILE_ROOT.exec(path) || WWW_PROFILE.exec(path); return m ? (m[1] ? "/" + m[1] : "") + "/community/" : ""; }
const WWW_HOSTS = new Set(["www.m365.fm", "m365.fm", "dub.m365.fm"]);
const PARTNER_NOINDEX = { "x-robots-tag": "noindex, nofollow" };

// Anmelde-Sperre auf admin.m365.fm und profile.m365.fm: wer nicht angemeldet ist (bei admin: kein Admin), sieht NUR die Anmelde-Knoepfe (Google, Microsoft, LinkedIn, GitHub),
// sonst nichts von der Seite. Der Worker setzt das Skript in den <head> der ausgelieferten Seite; Cookie und Pruefung bleiben bei api-dub.m365.fm
// (/api/me mit Cookie, CORS erlaubt beide Adressen). Sicherer Standard: bis die Antwort da ist, ist die Seite ausgeblendet; bei Fehler gilt "nicht angemeldet".
export function gateSnippet(kind, api) {
  const A = JSON.stringify(String(api || "https://api-dub.m365.fm").replace(/\/+$/, "")), K = JSON.stringify(kind === "admin" ? "admin" : "profile");
  return `<style id="m365-gate-css">html.m365g body>*:not(#m365-gate){display:none!important}#m365-gate{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px}#m365-gate .gbox{display:flex;flex-direction:column;gap:12px;width:100%;max-width:320px}#m365-gate .gbox a{text-align:center;text-decoration:none}</style>` +
    `<script id="m365-gate-js">(function(){var d=document,r=d.documentElement,A=${A},K=${K};r.className+=" m365g";` +
    `function ok(){r.className=r.className.split(" m365g").join("");var g=d.getElementById("m365-gate");if(g&&g.parentNode)g.parentNode.removeChild(g)}` +
    `function card(){if(d.getElementById("m365-gate"))return;if(!d.body){d.addEventListener("DOMContentLoaded",card);return}` +
    `var g=d.createElement("main");g.id="m365-gate";var b=d.createElement("div");b.className="gbox";var ret=encodeURIComponent(location.href.split("#")[0]);` +
    `[["google","Google"],["microsoft","Microsoft"],["linkedin","LinkedIn"],["github","GitHub"]].forEach(function(p,i){var a=d.createElement("a");a.className="btn"+(i?"":" main");a.rel="nofollow";a.setAttribute("data-p",p[0]);a.href=A+"/auth/login/"+p[0]+"?return="+ret;a.textContent=p[1];b.appendChild(a)});` +
    `g.appendChild(b);d.body.appendChild(g);` +
    `fetch(A+"/api/providers").then(function(x){return x.json()}).then(function(j){if(!j||!j.providers)return;[].slice.call(b.querySelectorAll("a")).forEach(function(a){if(j.providers.indexOf(a.getAttribute("data-p"))<0)a.parentNode.removeChild(a)})}).catch(function(){})}` +
    `fetch(A+"/api/me",{credentials:"include"}).then(function(x){return x.ok?x.json():null}).then(function(j){var u=j&&j.user;if(u&&(K!=="admin"||u.admin))ok();else card()}).catch(card)})();</script>`;
}

async function partnerRequest(request, env, ctx, url, toWww = partnerToWww, fromWww = wwwToPartner, gate = "") {   // Standard: Sponsor-Dashboard; admin und profil rufen es mit ihren Zuordnungen auf
  const quiet = (status, extra = {}) => new Response(status === 405 ? "Method not allowed" : null, { status, headers: { ...SEC, ...PARTNER_NOINDEX, "cache-control": "no-store", ...extra } });
  const p = url.pathname;
  if (p === "/robots.txt") return new Response("User-agent: *\nDisallow: /\n", { headers: { ...SEC, "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" } });
  if (request.method !== "GET" && request.method !== "HEAD") return quiet(405, { allow: "GET, HEAD" });
  if (/^\/sitemap[^/]*\.xml$/i.test(p)) return quiet(404);   // die Subdomain steht in keiner Sitemap
  const origin = (env.ORIGIN || "https://www.m365.fm").replace(/\/+$/, "");
  const www = toWww(p);
  // Dashboard-Seiten und statische Dateien (Skripte, Stile, Bilder, Schriften) kommen ueber die normale Kette von www.m365.fm; alles andere gehoert zur Website
  if (!www && !(STATIC.test(p) || FONT.test(p) || IMG.test(p))) return quiet(302, { location: origin + p + url.search });
  const target = new URL(origin + (www || p)); target.search = url.search;
  const inner = new Request(target.href, request);
  inner.headers.set("x-partner-rewrite", "1");   // der www-Zweig leitet dann nicht zurueck auf partner (keine Schleife)
  const res = await site.fetch(inner, env, ctx);   // ohne Speculation-Rules (die Regeln gelten nur fuer www.m365.fm)
  const h = new Headers(res.headers);
  if (www) h.set("x-robots-tag", PARTNER_NOINDEX["x-robots-tag"]);
  const loc = h.get("location");
  if (loc && res.status >= 300 && res.status < 400) {
    try { const l = new URL(loc, target); const back = l.origin === new URL(origin).origin ? fromWww(l.pathname) : ""; if (back) h.set("location", url.origin + back + l.search); } catch { /* Ziel bleibt wie geliefert */ }
  }
  if (gate && www && res.status === 200 && /text\/html/i.test(h.get("content-type") || "")) {   // Anmelde-Sperre: nur die Seite selbst, nie Skripte, Stile, Bilder
    const html = (await res.text()).replace(/<\/head>/i, () => gateSnippet(gate, env.API) + "</head>");
    for (const k of ["content-length", "content-encoding", "etag"]) h.delete(k);
    h.set("cache-control", "no-store");
    return new Response(request.method === "HEAD" ? null : html, { status: 200, headers: h });
  }
  return new Response(request.method === "HEAD" ? null : res.body, { status: res.status, statusText: res.statusText, headers: h });
}

// ---------------------------------------------------------------- Vorabruf der naechsten Seite (Speculation Rules, Speed-Massnahme 5, 16.11.2026)
// Jede HTML-Seite (200/304) auf www.m365.fm bekommt den Header Speculation-Rules: "/speculation.json"; die Regeln beantwortet der Worker selbst
// (keine Kopplung an Seitenbau oder R2). Nur prefetch (laedt das HTML-Dokument vor, fuehrt kein Skript aus, laedt keine Bilder), nie prerender.
// "moderate": erst bei Hover (~200 ms) bzw. Antippen. Nur gleiche Herkunft ("/*" relativ zu www.m365.fm): Kurzlinks (c.m365.fm), Klick- und
// Werbezaehler (api-dub.m365.fm) sind fremde Herkunft und nie betroffen. Web Analytics (RUM) zaehlt nur per JavaScript, das beim Vorabruf nicht
// laeuft; die ungefilterte Zonen-Statistik (Rueckfall in tools/sponsor_metrics.py und tools/mediakit.py) zaehlt dagegen jede HTML-Antwort am Rand,
// also auch vorabgerufene Seiten, die nie geoeffnet werden (dort als "ungefiltert inkl. Bots und Vorabrufe" beschriftet).
// Ausgenommen: Community (eigene App, Anmeldung), Arbeitsseiten mit Anmeldung (Admin, Redaktion, Moderation, Sponsor-Dashboard, Login-Rueckleitung),
// Einladungslinks, Suche, /api/ und /auth/ (gibt es auf www nicht, nur zur Sicherheit), Adressen mit Query, Dateien (Feeds, JSON-Exporte, Bilder, PDF ...),
// Links mit rel=nofollow, download, target=_blank oder data-no-prefetch und die Sprachwahl (SPEC_LANG_SEL, dieselben Links wie in assets/page.js):
// deren Klick setzt erst das Cookie m365_lang; ein Vorabruf bei Hover/pointerdown ginge noch mit dem alten Cookie bzw. Accept-Language, und
// homeLang() wuerde "/" mit 302 auf /de/ beantworten - der Browser koennte diese Antwort dann fuer den Klick auf "English" verwenden.
// Weil der Browser Vorabrufe je ADRESSE speichert (nicht je Link), ist "/" selbst (und /index.html, /en, /en/..., die dorthin weiterleiten)
// ausgenommen: sonst laedt z. B. der Knopf "M365.FM" auf /<l>/about/mirko-peters/ "/" mit der alten Sprache vor, und "English" landet wieder auf /<l>/.
// Dateiendungen: URLPattern unterscheidet Gross/Klein; der Seitenbau erzeugt nur kleingeschriebene Pfade.
// Achtung URLPattern: "/*\\?*" (Query beliebig) passt auch auf Adressen OHNE Query und wuerde jeden Vorabruf abschalten - darum "/*\\?(.+)".
export const SPEC_PATH = "/speculation.json";
export const SPEC_LANG_SEL = "details.lsw a[hreflang],a.lt[hreflang],a[data-setlang]";   // = Sprachwahl-Klick in assets/page.js (setzt m365_lang)
export const SPEC_RULES = {
  prefetch: [{
    where: { and: [
      { href_matches: "/*" },
      { not: { href_matches: [
        "/", "/index.html", "/en", "/en/*",
        "/community/*", "/*/community/*", "/api/*", "/auth/*", "/admin/*", "/callback/*", "/einladung/*",
        "/redaktion/*", "/*/redaktion/*", "/moderation/*", "/*/moderation/*",
        "/sponsor/dashboard/*", "/*/sponsor/dashboard/*", "/search/*", "/*/search/*",
        "/*\\?(.+)",
        "/*.(json|jsonld|xml|rss|txt|md|csv|ics|vtt|pdf|zip|mp3|m4a|mp4|png|jpe?g|gif|webp|avif|svg|webmanifest)",
      ] } },
      { not: { selector_matches: "[rel~=nofollow],[download],[target=_blank],[data-no-prefetch]," + SPEC_LANG_SEL } },
    ] },
    eagerness: "moderate",
  }],
};
const SPEC_BODY = JSON.stringify(SPEC_RULES);
function speculationRules(request) {
  const h = new Headers({ "content-type": "application/speculationrules+json", "cache-control": "public, max-age=3600", "x-robots-tag": "noindex" });
  for (const [k, v] of Object.entries(SEC)) h.set(k, v);
  return new Response(request.method === "HEAD" ? null : SPEC_BODY, { status: 200, headers: h });
}
// Header nur auf HTML-Seiten (200, 304 fuer den Browser-Cache) der eigenen Website; nie auf Weiterleitungen, Fehlern, Dateien, partner.m365.fm,
// Staging, img.m365.fm oder BYOD-Domains (dort gibt es /speculation.json nicht)
export function withSpeculation(request, env, res) {
  const url = new URL(request.url);
  if (isStaging(env) || !WWW_HOSTS.has(url.hostname) || url.protocol !== "https:" || request.headers.has("x-partner-rewrite")) return res;
  if ((request.method !== "GET" && request.method !== "HEAD") || (res.status !== 200 && res.status !== 304)) return res;
  const ct = res.headers.get("content-type");
  if (ct ? !/^text\/html\b/i.test(ct) : !(res.status === 304 && isHtmlPath(url.pathname))) return res;
  const h = new Headers(res.headers);
  h.set("speculation-rules", `"${SPEC_PATH}"`);
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers: h });
}

// ---------------------------------------------------------------- Preload-Link-Header fuer Early Hints (Ladezeit 27.11.2026, Punkt 4, Schalter PRELOAD_LINK)
// HTML-Seiten (GET, 200) der eigenen Website bzw. von staging.m365.fm bekommen einen Link-Header mit genau den Ressourcen, die der Kopf derselben Seite
// schon frueh laedt: das Stylesheet mit data-sbar (generate_site.css_link) als as=style und jedes <link rel="preload" as="image" fetchpriority="high">
// (LCP-Bild, z. B. site_sidebar.con_preload) mit denselben imagesrcset/imagesizes/media/type - so verwendet der Browser die Vorab-Anfrage und laedt
// nichts doppelt. Kein crossorigin (der Kopf hat bei Stylesheet und Bild auch keins), keine Schriften (A/B-Test 3.11.: zusaetzliche Prioritaet kostete auf
// 4G FCP), nur eigene Hosts (m365.fm, *.m365.fm, relativ). Annahme: Cloudflare bildet aus diesen Headern Early Hints (103) auch fuer Worker-Antworten
// (Zonen-Einstellung Early Hints an; auf Staging mit curl --http2 pruefen). Ohne 103 bleibt ein Link-Header, den der Browser vor dem HTML-Parser sieht.
// Gelesen wird der Datenstrom nur bis </head> (hoechstens PRELOAD_HEAD Bytes), der Rest stroemt unveraendert; der Koerper bleibt byte-gleich.
// Auf "/" kommt der Wert hinter den vorhandenen api-catalog-Link. Kein Header bei HEAD, 304, Fehlern, Dateien, partner/admin/profile, img, BYOD.
const PRELOAD_HEAD = 65536, PRELOAD_MAX = 4;
const unent = (x) => x.replace(/&(amp|quot|#39|#x27|lt|gt);/gi, (_m, e) => ({ amp: "&", quot: '"', "#39": "'", "#x27": "'", lt: "<", gt: ">" }[e.toLowerCase()]));
function tagAttrs(tag) {
  const a = {}, rx = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  const body = tag.replace(/^<link\b/i, "").replace(/\/?>$/, "");
  let m; while ((m = rx.exec(body))) { const k = m[1].toLowerCase(); if (!(k in a)) a[k] = unent(m[2] ?? m[3] ?? m[4] ?? ""); }
  return a;
}
const HDR_OK = /^[\x20-\x7e]+$/;   // Header-Werte: nur druckbares ASCII
// Hosts, deren Adressen ein Preload-Header nennen darf: die Website selbst und die Bild-Domain (nicht jede *.m365.fm-Subdomain wie admin, api-dub, partner:
// ein Link-Header loest bei jedem Besucher einen GET mit Cookies aus, bei Early Hints schon vor dem HTML)
const PRELOAD_HOSTS = new Set(["www.m365.fm", "m365.fm", "dub.m365.fm", "staging.m365.fm", "img.m365.fm"]);
function ownUrl(u) {   // relativ ("/...", nicht "//") oder https auf PRELOAD_HOSTS; sonst ""
  if (!u || !HDR_OK.test(u) || /[<>"\s]/.test(u)) return "";
  if (u.startsWith("/") && !u.startsWith("//")) return u;
  try { const x = new URL(u); return x.protocol === "https:" && !x.port && !x.username && PRELOAD_HOSTS.has(x.hostname) ? u : ""; } catch { return ""; }
}
// Kopf ohne Inhalte, in denen "<link" nur Text ist: <script> (JSON-LD mit Nutzertexten, z. B. Profil-Headline), <style>, <template>, <noscript>, Kommentare.
// Unvollstaendiger Block am Ende (Kopf bei PRELOAD_HEAD abgeschnitten): bis zum Ende weg. Erst Bloecke, dann Kommentare (Nutzertext kann so nichts zusammenfuegen).
const headTags = (head) => String(head || "").replace(/<(script|style|template|noscript)\b[^>]*>[\s\S]*?(?:<\/\1\s*>|$)/gi, "").replace(/<!--[\s\S]*?(?:-->|$)/g, "");
const linkParam = (k, v) => (v && HDR_OK.test(v) && !v.includes('"') ? `; ${k}="${v}"` : "");
export function preloadLinks(head) {
  const out = [];
  for (const tag of headTags(head).match(/<link\b[^>]*>/gi) || []) {
    if (out.length >= PRELOAD_MAX) break;
    const a = tagAttrs(tag), rel = (a.rel || "").toLowerCase().split(/\s+/);
    if (rel.includes("stylesheet") && "data-sbar" in a) {
      const u = ownUrl(a.href); if (u) out.push(`<${u}>; rel=preload; as=style`);
    } else if (rel.includes("preload") && (a.as || "").toLowerCase() === "image" && (a.fetchpriority || "").toLowerCase() === "high") {
      const set = (a.imagesrcset || "").trim(), cands = set ? set.split(",").map((c) => c.trim().split(/\s+/)[0]).filter(Boolean) : [];
      if ("crossorigin" in a || (set && (!cands.length || cands.some((c) => !ownUrl(c))))) continue;   // nur eigene Hosts; crossorigin gibt es im Kopf nicht
      if (set && !HDR_OK.test(set)) continue;
      const u = ownUrl(a.href || cands[0]); if (!u) continue;
      out.push(`<${u}>; rel=preload; as=image${linkParam("imagesrcset", set)}${linkParam("imagesizes", a.imagesizes)}${linkParam("media", a.media)}${linkParam("type", a.type)}; fetchpriority=high`);
    }
  }
  return out;
}
export async function withPreload(request, env, res) {
  if (!env || env.PRELOAD_LINK !== "1" || request.method !== "GET" || res.status !== 200 || !res.body) return res;
  const url = new URL(request.url);
  if (url.protocol !== "https:" || request.headers.has("x-partner-rewrite")) return res;
  if (isStaging(env) ? url.hostname !== "staging.m365.fm" : !WWW_HOSTS.has(url.hostname)) return res;
  if (!/^text\/html\b/i.test(res.headers.get("content-type") || "")) return res;
  const reader = res.body.getReader(), chunks = [], dec = new TextDecoder();
  let n = 0, text = "", end = -1, done = false;
  try {
    while (n < PRELOAD_HEAD) {
      const r = await reader.read();
      if (r.done) { done = true; break; }
      chunks.push(r.value); n += r.value.byteLength; text += dec.decode(r.value, { stream: true });
      end = text.search(/<\/head\s*>/i); if (end >= 0) break;
    }
  } catch (e) {   // Lesefehler des Ursprungs: wie ohne Header weitergeben (der Fehler zeigt sich im Datenstrom)
    const body = new ReadableStream({ start(c) { for (const x of chunks) c.enqueue(x); c.error(e); } });
    return new Response(body, { status: res.status, statusText: res.statusText, headers: res.headers });
  }
  // Kopf laenger als PRELOAD_HEAD (grosses JSON-LD steht im Kopf hinter Stylesheet und Bild-Preload, z. B. /entity/ mit hasDefinedTerm): das Gelesene ist
  // noch Kopf, solange kein <body> darin steht - dann zaehlen die Links darin (ein angeschnittenes <link ohne ">" passt nicht auf das Muster).
  const head = end >= 0 ? text.slice(0, end) : !done && !/<body[\s>]/i.test(text) ? text : "";
  const links = head ? preloadLinks(head) : [];
  const body = new ReadableStream({
    start(c) { for (const x of chunks) c.enqueue(x); if (done) c.close(); },
    async pull(c) { if (done) return; try { const r = await reader.read(); if (r.done) { done = true; c.close(); } else c.enqueue(r.value); } catch (e) { c.error(e); } },
    cancel(why) { return reader.cancel(why); },
  });
  const h = new Headers(res.headers);
  if (links.length) { const old = h.get("link"); h.set("link", (old ? old + ", " : "") + links.join(", ")); }
  return new Response(body, { status: res.status, statusText: res.statusText, headers: h });
}

const worker = {
  async fetch(request, env, ctx) {
    return withSpeculation(request, env, await withPreload(request, env, await site.fetch(request, env, ctx)));
  },
};
// Auslieferung ohne den Vorabruf-Header (partnerRequest ruft sie direkt auf: partner.m365.fm bekommt ihn nie)
const site = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (isStaging(env)) return stagingFetch(request, env);   // Testumgebung: eigener, abgeschlossener Pfad (oben); Live-Verhalten unveraendert
    const fh = foreignHost(env, request, url);   // BYOD: Fremd-Domain eines Mitglieds (nur mit Schalter)
    if (fh === "bad") return plain(421, "Misdirected request");
    if (fh) return byodServe(request, env, url, fh);
    // img.m365.fm ist die oeffentliche Adresse des R2-Buckets: Spiegel- und Sprachseiten (pages/) und Verwaltungsdateien (meta/) sind dort nicht
    // gedacht (doppelte Inhalte, als entfernt markierte Seiten), die Mediadaten (mediakit/) nur per Formular. Nur diese Pfade sind hierher geroutet;
    // Bilder (i/, og/) kommen weiter direkt aus R2.
    // x-m365-guard: zoneGet erkennt daran, dass ein Zonen-Abruf hier statt in R2 gelandet ist (dann heutiger Weg, nie als "fehlt" gewertet)
    if (url.hostname === "img.m365.fm") return new Response("Not found", { status: 404, headers: { "content-type": "text/plain; charset=utf-8", "x-robots-tag": "noindex", "cache-control": "public, max-age=3600", "x-m365-guard": "1" } });
    if (SCANNER.test(url.pathname)) return new Response(request.method === "HEAD" ? null : "Not found", { status: 404, headers: { ...SEC, "content-type": "text/plain; charset=utf-8", "x-robots-tag": "noindex", "cache-control": "public, max-age=86400" } });   // Scanner (s. SCANNER)
    // partner.m365.fm (PARTNER_HOST): Sponsor-Dashboard auf eigener Subdomain, noindex, nicht in der Sitemap
    const partnerHost = env.PARTNER_HOST || "";
    if (partnerHost && url.hostname === partnerHost) return partnerRequest(request, env, ctx, url);
    // admin.m365.fm (ADMIN_HOST) und profile.m365.fm (PROFILE_HOST): gleiche Technik wie partner, immer noindex; leer = keine Subdomain, keine Umleitung
    const adminHost = env.ADMIN_HOST || "", profileHost = env.PROFILE_HOST || "";
    if (adminHost && url.hostname === adminHost) return partnerRequest(request, env, ctx, url, adminToWww, wwwToAdmin, "admin");
    if (profileHost && url.hostname === profileHost) return partnerRequest(request, env, ctx, url, profileToWww, wwwToProfile, "profile");
    if (WWW_HOSTS.has(url.hostname) && !request.headers.has("x-partner-rewrite") && (request.method === "GET" || request.method === "HEAD")) {
      for (const [host, flag, map] of [[partnerHost, env.PARTNER_REDIRECT, wwwToPartner], [adminHost, env.ADMIN_REDIRECT, wwwToAdmin], [profileHost, env.PROFILE_REDIRECT, wwwToProfile]]) {
        if (!host || flag !== "1") continue;
        const to = map(url.pathname);   // alte Adresse (/sponsor/dashboard/..., /admin/, /community/) -> 301 in einem Schritt (auch von m365.fm, dub.m365.fm und http://)
        if (to) return new Response(null, { status: 301, headers: { ...SEC, location: "https://" + host + to + url.search, "cache-control": "public, max-age=3600" } });
      }
    }
    // Umzug (MIGRATED=1): dub.m365.fm und m365.fm -> www.m365.fm, alte Podpage-Adressen -> /show/ (301, damit der SEO-Traffic erhalten bleibt)
    // Alle Adressregeln (alte Podpage-Adressen, alter Blog-Profilname, entfernte Sprachen, /en/) in EINEM Schritt bis zum Endziel;
    // alter Host (dub.m365.fm, m365.fm) und http:// gleich mit (T8: vorher zwei oder drei 301 hintereinander).
    const migrated = env.MIGRATED === "1";
    const oldHost = migrated && (url.hostname === "dub.m365.fm" || url.hostname === "m365.fm");
    {
      let to = await finalTarget(url.pathname, migrated);
      if (oldHost && !to && /^(\/[a-z]{2})?\/show\/episodes\/[a-z0-9-]+\/?$/.test(url.pathname)) to = (await redirectMap())[url.pathname.replace(/\/+$/, "")] || "";   // T12: umbenannte Folge auch vom alten Host in einem Schritt
      if (oldHost) return redirect(request, "https://www.m365.fm", to || url.pathname, url.search);
      if (url.protocol === "http:" && /(^|\.)m365\.fm$/.test(url.hostname)) return redirect(request, "https://" + url.hostname, to || url.pathname, url.search);
      if (to) return redirect(request, url.origin, to, url.search);
    }
    const p = url.pathname, isImg = IMG.test(p), isStatic = STATIC.test(p) || FONT.test(p);
    if (p.startsWith("/__r2c/") || p.startsWith("/__r2f/") || p.startsWith("/__r2s/") || p.startsWith("/__live/")) return new Response("Not found", { status: 404 });   // interne Cache-Schluessel, keine oeffentlichen Adressen
    if (p === SPEC_PATH && WWW_HOSTS.has(url.hostname) && (request.method === "GET" || request.method === "HEAD")) return speculationRules(request);   // Regeln fuer den Vorabruf (s. withSpeculation)
    if (p === "/") { const hl = homeLang(request); if (hl) return langRedirect(url.origin, hl, url.search); }   // vor jedem Cache: eine englische Startseite aus dem Cache erreicht nie einen deutschen Browser
    const cf = isImg ? { cacheEverything: true, cacheTtl: 604800, polish: "lossy", mirage: true }
      : HASHED.test(p) ? { cacheEverything: true, cacheTtlByStatus: { "200-299": 86400, "404": 60, "500-599": 0 } }   // gehasht: 404 (noch nicht deployt) nur kurz
      : isStatic ? { cacheEverything: true, cacheTtl: 86400 }
      : { cacheEverything: true, cacheTtlByStatus: { "200-299": EDGE_HTML, "404": 60, "500-599": 0 } };   // HTML: 4 h am Rand, Purge nach jedem Deploy
    // T41: ohne Query zum Ursprung - GitHub Pages ist statisch, so landen ?utm_…/?fbclid=… im selben Cache-Eintrag (Zone steht auf Caching-Level "basic": mit Query sonst gar kein Cache)
    const page = !isImg && !isStatic && isHtmlPath(p), rq = request;   // Seiten: R2 zuerst auch bei Range-Anfragen (s. u.)
    // Messung (Server-Timing, nur Seiten): src = r2 (R2 zuerst), r2direct (R2-only-Seite ohne gueltige Kennung gleich aus dem Bucket), pages (GitHub Pages), r2fallback (GitHub Pages 404, dann Bucket);
    // ready = mem/cache/cold (Herkunft der Bau-Kennung, s. r2Ready) oder off (R2 zuerst nicht moeglich: Notschalter, Methode, Pfad); Dauern in ms
    let ready = "off", r2miss = false, r2tried = false;   // r2miss: R2 zuerst mit gueltiger Bau-Kennung fand das Objekt nicht; r2tried: R2-only-Seite schon direkt gefragt -> die R2-Rueckfaelle nach dem 404 lesen es nicht noch einmal
    const r2only = page && R2_ONLY_PAGE.test(p);   // nur im Bucket (s. R2_ONLY_PAGE): im kalten Zustand gleich aus R2, Messzeile im Log
    const r2file = !page && r2OnlyFile(p);   // Datei nur im Bucket (s. r2OnlyFile): im kalten Zustand gleich aus R2
    if (env.R2_PRIMARY === "1" && env.PAGES && !isImg && (request.method === "GET" || request.method === "HEAD") && !p.startsWith("/search/") && p !== "/r2-build.txt" && (page || !request.headers.has("range"))) {
      let dp = p; try { dp = decodeURIComponent(p); } catch { /* ungueltige Kodierung: wie angefragt */ }   // Schluessel im Bucket sind UTF-8 (z. B. /ru/tag/облако/)
      const key = r2Key(dp);
      if (key) {
        const rd = await r2Ready(env, url, ctx);
        ready = rd.src;
        if (rd.v) {
          const t0 = Date.now(), st = {}, r2 = await r2First(rq, env, ctx, url, p, key, rd.v, st);
          const d = Date.now() - t0;
          const zc = st.zc ? `, zc;desc="${st.zc}"` : "";   // Zonen-Cache (R2_ZONE_CACHE): cf-cache-status bzw. Grund des Rueckfalls
          if (r2) { r2.headers.set("server-timing", `src;desc="r2", ready;desc="${ready}", r2;dur=${d}${zc}`); if (r2only) logR2Page(request, p, "r2", ready, r2, d); return r2; }
          r2miss = !!st.miss;   // der Bucket enthaelt genau den Bau von GitHub Pages: was dort fehlt, fehlt ueberall
        } else if (r2only) {
          // Keine gueltige Kennung (cold oder "nicht bereit"): R2-only-Seite gleich aus dem Bucket statt GitHub Pages (404) -> R2-Rueckfall.
          // r2Page mit dem Schluessel /__r2c<pfad> wie der Rueckfall (geleert in Schritt 1 nach dem Deploy), nie /__r2f. null: weiter wie bisher.
          const t0 = Date.now(), r2 = await r2Page(rq, env, ctx, url, p), d = Date.now() - t0;
          r2tried = true;
          if (r2) { r2.headers.set("server-timing", `src;desc="r2direct", ready;desc="${ready}", r2;dur=${d}`); logR2Page(request, p, "r2direct", ready, r2, d); return r2; }
        } else if (r2file) {
          // Ebenso Dateien nur im Bucket (Sitemaps ausser en/de, Exporte, Transkripte): gleich r2File (dieselbe gone/src-Pruefung wie der Rueckfall);
          // null -> GitHub Pages wie bisher, ohne den Bucket nach dem 404 noch einmal zu lesen
          const t0 = Date.now(), r2 = await r2File(rq, env, p), d = Date.now() - t0;
          r2tried = true;
          if (r2) { r2.headers.set("server-timing", `src;desc="r2direct", ready;desc="${ready}", r2;dur=${d}`); return r2; }
        }
      }
    }
    // Suchindex (/search/manifest.json, /search/part-<n>.json) liegt nur im R2-Bucket (r2out/): in jedem Zustand erst dort, ohne vorher GitHub Pages (404)
    // zu fragen (Ladezeit 27.11.2026, Gegenpruefung). Fehlt er dort (noch nicht geladen), wie bisher GitHub Pages - ohne den Bucket danach erneut zu lesen.
    const searchR2 = !!env.PAGES && (request.method === "GET" || request.method === "HEAD") && SEARCH_R2.test(p);
    if (searchR2) { const r = await searchIndex(request, env, ctx, url, p); if (r) return r; }
    const t0 = Date.now(), res = await fetch(url.search ? new Request(url.origin + p, rq) : rq, { cf }), tOrigin = Date.now() - t0;
    // Weiterleitung des Ursprungs (z. B. GitHub Pages /callback -> /callback/) bekam keine Query, weil wir ohne Query abrufen (T41).
    // Query wieder anhaengen, sonst verliert die OAuth-Rueckleitung den Code (?code=…) - so geschehen am 4.11. beim YouTube-Verbinden.
    if (url.search && res.status >= 301 && res.status <= 308) {
      const loc = res.headers.get("location");
      if (loc && !loc.includes("?")) { const h = new Headers(res.headers); h.set("location", loc + url.search); return new Response(null, { status: res.status, headers: h }); }
    }
    if (res.status === 404 && /^\/og\/.+\.png$/i.test(p)) return Response.redirect("https://img.m365.fm" + p, 301);   // Teilen-Bilder liegen im R2-Bucket (img.m365.fm/og/...): frueher geteilte Adressen bleiben gueltig; solange GitHub Pages das Bild noch hat, kommt es von dort
    // Persoenlicher Einladungslink (site_invite.py, #320): die Seite /einladung/<kuerzel>/ gibt es nur fuer oeffentliche Profile und erst nach dem
    // naechsten Seitenbau. Fehlt sie (noch nicht gebaut, Profil nicht mehr oeffentlich, Konto geloescht), fuehrt der Link mit dem Kuerzel zur
    // Community statt auf ein 404 - 302 und ohne Cache, weil die Seite spaeter entstehen kann. Die Zurechnung laeuft dort wie mit der Seite.
    if (res.status === 404 && (request.method === "GET" || request.method === "HEAD")) {
      const iv = INVITE.exec(p);
      if (iv) return new Response(null, { status: 302, headers: { ...SEC, location: url.origin + "/community/?ref=" + iv[1], "cache-control": "no-store", "x-robots-tag": "noindex" } });
    }
    // Seiten aus dem R2-Bucket (Paket 20): uebersetzte Seiten (Blog-Sprachfassungen, Sprachfassungen der Folgen) liegen unter pages/<pfad>/index.html im Bucket statt in GitHub Pages - gleiche Adressen, indexierbar
    if (res.status === 404 && env.MIGRATED === "1" && /^(\/[a-z]{2})?\/show\/episodes\/[a-z0-9-]+\/?$/.test(p)) {   // T12: umbenannte Folge (show/redirects.json), vor dem R2-Rueckfall mit der alten Seite
      const to = (await redirectMap())[p.replace(/\/+$/, "")];
      if (to) return redirect(request, url.origin, (await finalTarget(to, migrated)) || to, url.search);
    }
    // Sitemap, Datenexport oder Transkript aus dem R2-Bucket (pages/<datei>, s. r2File) - nicht, wenn R2 zuerst das Objekt mit gueltiger Kennung schon
    // vermisst hat oder es im kalten Zustand schon direkt gefragt wurde (r2tried)
    if (res.status === 404 && env.PAGES && !r2miss && !r2tried && r2OnlyFile(p) && (request.method === "GET" || request.method === "HEAD")) {
      const r2 = await r2File(rq, env, p);
      if (r2) return r2;
    }
    // Gehashte Stylesheets und Skripte (HASHED): der Seitenbau legt sie auch in r2out/ ab. r2out-Seiten gehen im Build-Job vor dem Deploy live und
    // verweisen schon auf den neuen Namen, den GitHub Pages erst nach dem Deploy hat - bis dahin (und bei R2 zuerst kalt/"nicht bereit") aus dem Bucket.
    // r2First mit Pfad-Schluessel /__r2f (Inhalt unter dem Namen unveraenderlich), gone-Pruefung wie dort.
    if (res.status === 404 && env.PAGES && !r2miss && HASHED.test(p) && (request.method === "GET" || request.method === "HEAD")) {
      const r2 = await r2First(rq, env, ctx, url, p, "pages" + p, "asset-pfad");
      if (r2) return r2;
    }
    // Nur Seiten-Adressen (r2Page liest pages/<pfad>/index.html; fuer /x.php oder /a.json gibt es so ein Objekt nie) und nur, wenn R2 zuerst das Objekt
    // nicht schon mit gueltiger Bau-Kennung vermisst hat bzw. die R2-only-Seite nicht schon direkt gefragt wurde (sonst zwei R2-Lesungen je echtem 404).
    // Die Weiterleitung LANG_EP bleibt in allen Faellen.
    if (res.status === 404 && env.PAGES && !IMG.test(p) && isHtmlPath(p) && (request.method === "GET" || request.method === "HEAD")) {
      const t1 = Date.now(), r2 = r2miss || r2tried ? null : await r2Page(rq, env, ctx, url, p), d = Date.now() - t1;
      if (r2 && page) r2.headers.set("server-timing", `src;desc="r2fallback", ready;desc="${ready}", origin;dur=${tOrigin}, r2;dur=${d}`);
      if (r2 && r2only) logR2Page(request, p, "r2fallback", ready, r2, d, tOrigin);
      if (r2 && !p.endsWith("/") && !/\.[a-z0-9]{1,8}$/i.test(p)) return new Response(null, { status: 301, headers: { ...SEC, location: url.origin + p + "/" + url.search, "cache-control": "public, max-age=600" } });   // wie GitHub Pages: Verzeichnis ohne "/" -> 301 auf "/"
      if (r2) return r2;
      const m = LANG_EP.exec(p);   // noch nicht hochgeladen: englisches Original statt 404 - umbenannt gleich auf den neuen Slug (ein Schritt)
      if (m) return Response.redirect(url.origin + ((migrated && (await redirectMap())["/show/episodes/" + m[2]]) || "/show/episodes/" + m[2] + "/") + url.search, 301);
    }
    if (res.status === 404 && (request.method === "GET" || request.method === "HEAD")) {   // nach dem R2-Rueckfall: eine Sprachfassung im Bucket gilt
      const pm = LIVE_PROFILE_PAGE.exec(p);   // Profil eines neuen Mitglieds vor dem naechsten Seitenbau (s. profileLive); sonst die 302 unten
      if (pm) { const live = await profileLive(request, env, ctx, url, pm); if (live) return live; }
      const ev = EVENT_PAGE.exec(p);   // 302 und ohne Cache, weil die Seite spaeter entsteht
      const pf = ev ? null : PROFILE_PAGE.exec(p);
      const to = ev ? (ev[1] || "") + "/community/events/" : pf ? (pf[1] || "") + "/community/" + (pf[2] === "u" ? "members" : "companies") + "/" : "";
      if (to) return new Response(null, { status: 302, headers: { ...SEC, location: url.origin + to, "cache-control": "no-store", "x-robots-tag": "noindex" } });
    }
    if (res.status === 404 && FEED_ITEM.test(p) && (request.method === "GET" || request.method === "HEAD")) return feedGone(request, p);
    const h = new Headers(res.headers);
    finishHeaders(h, p, res.status);
    if (page) h.append("server-timing", `src;desc="pages", ready;desc="${ready}", origin;dur=${tOrigin}`);
    const out = new Response(request.method === "HEAD" ? null : res.body, { status: res.status, statusText: res.statusText, headers: h });
    if (r2only) logR2Page(request, p, "pages", ready, out, null, tOrigin);
    return out;
  },
};
export default worker;
