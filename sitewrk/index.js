import { regionOf, conditional, markHtml, isHtmlPath } from "./consent.js";   // T32: Einwilligungs-Region je Anfrage
// Worker vor der Plattform (GitHub Pages): Cache- und Sicherheits-Header, Bild-Optimierung (Polish), Weiterleitungen fuer den Umzug von www.m365.fm.
const SEC = {
  "strict-transport-security": "max-age=31536000; includeSubDomains",
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
  "permissions-policy": "camera=(), microphone=(), geolocation=(), payment=()",
  "x-frame-options": "SAMEORIGIN",
};
const IMG = /\.(png|jpe?g|gif|webp|avif|svg|ico)$/i, STATIC = /^\/(assets|covers|og)\//i, FONT = /\.(woff2?|ttf|otf)$/i;
const HASHED = /^\/assets\/(site\.[0-9a-f]{8,}\.css|(page|a11y)\.[0-9a-f]{8,}\.js)$/i;   // Dateiname traegt den Inhalts-Hash: darf ein Jahr im Browser bleiben
// T41 Caching: HTML 4 h am Rand statt 10 Min (nach jedem Deploy leert tools/purge_changed.py genau die geaenderten Adressen),
// Sprachseiten aus R2 ebenfalls 4 h im Kanten-Cache (Cache API, Schluessel /__r2c/<pfad>/, Purge nach dem Upload), Browser fragt bei HTML immer nach (304 per ETag/Last-Modified)
const EDGE_HTML = 14400, R2_TTL = 14400, R2_MISS_TTL = 600;
const HTML_CC = "public, max-age=0, s-maxage=600, stale-while-revalidate=86400";
const r2Path = (p) => (p.endsWith("/") ? p : p + "/");

function notModified(request, etag, lastMod) {
  const inm = request.headers.get("if-none-match");
  if (inm) return !!etag && inm.split(",").map((x) => x.trim().replace(/^W\//, "")).some((x) => x === "*" || x === etag.replace(/^W\//, ""));
  const ims = request.headers.get("if-modified-since");
  return !!(ims && lastMod && Date.parse(lastMod) <= Date.parse(ims));
}

// Seite aus dem R2-Bucket (pages/<pfad>/index.html) mit Kanten-Cache; null, wenn es sie dort nicht gibt (auch das wird kurz gemerkt)
async function r2Page(request, env, ctx, url, p) {
  const cache = caches.default, ck = new Request(url.origin + "/__r2c" + r2Path(p));
  let hit = await cache.match(ck).catch(() => null), state = "HIT";
  if (!hit) {
    state = "MISS";
    const obj = await env.PAGES.get("pages" + r2Path(p) + "index.html").catch(() => null);
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
const READY_TTL = 30000;   // Bau-Kennung je Isolate 30 s merken; aufgefrischt wird im Hintergrund, keine Anfrage wartet darauf
let READY = { t: -1e15, v: "", busy: 0 };
export function __resetR2Ready() { READY = { t: -1e15, v: "", busy: 0 }; }   // nur fuer Tests
const withTimeout = (p, ms) => Promise.race([p, new Promise((r) => setTimeout(() => r(null), ms))]);
async function checkBuild(env, url) {
  const [a, b] = await Promise.all([
    fetch(url.origin + "/r2-build.txt?r2check=" + Math.floor(Date.now() / READY_TTL), { signal: AbortSignal.timeout(3000) }).then((x) => (x.ok ? x.text() : "")).catch(() => ""),   // mit Query: nie aus dem Kanten-Cache
    withTimeout(env.PAGES.get("pages/r2-build.txt").then((x) => (x ? x.text() : "")), 3000).then((x) => x || "").catch(() => "")]);
  const o = String(a).trim(), r = String(b).trim();
  return o === r && /^[A-Za-z0-9._-]{1,64}$/.test(o) ? o : "";
}
// Liefert die Bau-Kennung, wenn R2 genau den Bau von GitHub Pages enthaelt, sonst "". Nie auf eine Pruefung warten, die eine andere Anfrage
// gestartet hat (bricht sie ab, haengen sonst alle): die Pruefung laeuft ueber ctx.waitUntil dieser Anfrage, bis dahin gilt der letzte Stand
// (nach dem Start eines Isolates: "" = GitHub Pages).
function r2Ready(env, url, ctx) {
  const now = Date.now();
  if (now - READY.t >= READY_TTL && now - READY.busy > 10000) {
    READY.busy = now;
    ctx.waitUntil(checkBuild(env, url).then((v) => { READY = { t: Date.now(), v, busy: 0 }; }).catch(() => { READY = { t: Date.now(), v: "", busy: 0 }; }));
  }
  return READY.v;
}
async function r2First(request, env, ctx, url, p, key, build) {
  const html = key.endsWith("/index.html"), ext = html ? "html" : extOf(key);
  const cp = html ? (p.endsWith("/index.html") ? p.slice(0, -"index.html".length) : r2Path(p)) : p;   // /a/index.html und /a/ teilen den Eintrag
  // Bau-Kennung im Schluessel: Eintraege eines frueheren Baus treffen nie (kein Purge noetig), getrennt vom alten R2-Rueckfall (/__r2c<pfad>)
  const cache = caches.default, ck = new Request(url.origin + "/__r2c/@" + build + cp);
  let hit = await cache.match(ck).catch(() => null), state = "HIT";
  if (!hit) {
    state = "MISS";
    const obj = await env.PAGES.get(key).catch(() => null);
    if (!obj || (obj.customMetadata && obj.customMetadata.gone === "1")) {   // fehlt oder vom Seitenbau als entfernt markiert (Datei bleibt im Bucket, wird aber nicht mehr ausgeliefert)
      ctx.waitUntil(cache.put(ck, new Response("", { headers: { "cache-control": `public, max-age=${R2_MISS_TTL}`, "x-r2-miss": "1" } })).catch(() => {}));
      return null;
    }
    let buf; try { buf = await obj.arrayBuffer(); } catch { return null; }   // Lesefehler: GitHub Pages statt Fehlerseite
    const meta = obj.httpMetadata && obj.httpMetadata.contentType;
    const ct = html ? CT.html : (meta && !/octet-stream/i.test(meta) ? meta : CT[ext] || "application/octet-stream");
    const ttl = HASHED.test(p) ? 2592000 : FONT.test(p) ? 86400 : R2_TTL;
    hit = new Response(buf, { headers: { "content-type": ct, "etag": obj.httpEtag, "last-modified": obj.uploaded.toUTCString(), "cache-control": `public, max-age=${ttl}` } });
    ctx.waitUntil(cache.put(ck, hit.clone()).catch(() => {}));
  }
  if (hit.headers.get("x-r2-miss")) return null;
  const h = new Headers({ "content-type": hit.headers.get("content-type"), "x-m365-cache": state, "x-m365-src": "r2", "access-control-allow-origin": "*" });   // wie GitHub Pages (CORS fuer openapi.json, llms.txt, Feeds ...)
  for (const k of ["etag", "last-modified"]) { const v = hit.headers.get(k); if (v) h.set(k, v); }
  finishHeaders(h, p);
  if (notModified(request, h.get("etag"), h.get("last-modified"))) return new Response(null, { status: 304, headers: h });
  return new Response(request.method === "HEAD" ? null : hit.body, { status: 200, headers: h });
}
// Datenexporte des Seitenbaus: fuer Programme da, nicht fuer die Suche (Allowlist - .well-known, openapi.json, agent.json, episodes.json, llms*.txt bleiben sichtbar)
const NOINDEX = /^\/(search\/|entities\.json|entities-src\.json|entities\.jsonld|og-manifest\.json|seo-report\.json|top\.json|show\/redirects\.json|show\/transcripts\.json|show-notes\/|blog-import\/|blog-content\/)|\.jsonld$/i;
// #266: Transkript-Dateien je Folge (Hauptshow, Dub-Folge, Sprachfassung) liegen im R2-Bucket (r2out/): fuer Podcast-Apps (CORS) und Programme,
// nicht fuer die Suche (der Text steht schon auf der Folgenseite). Gleiche Regel wie site_transcripts.PATH_RX.
export const TRANSCRIPT = /^(?:\/[a-z]{2})?(?:\/show\/episodes)?\/[a-z0-9-]+\/transcript\.(txt|vtt)$/;
const R2_EXPORT = /^\/(?:blog-import\/[^/]+\.json|translations-blog\.json)$/i;

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

async function redirectMap() {
  const r = await fetch("https://www.m365.fm/show/redirects.json", { cf: { cacheTtl: 3600, cacheEverything: true } });
  return r.ok ? r.json() : {};
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

// Header fuer Antworten von GitHub Pages und aus R2 (gleiche Regeln, egal woher die Datei kommt)
function finishHeaders(h, p) {
  const isImg = IMG.test(p), isStatic = STATIC.test(p) || FONT.test(p);
  for (const [k, v] of Object.entries(SEC)) h.set(k, v);
  // T41: Schriften aendern sich unter gleichem Namen nicht (1 Jahr), Bilder 1 Tag, Skripte/Stile 1 h und danach im Hintergrund pruefen
  h.set("cache-control", HASHED.test(p) || FONT.test(p) ? "public, max-age=31536000, immutable" : isImg ? "public, max-age=86400, stale-while-revalidate=604800"
    : isStatic ? "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400" : HTML_CC);
  if (NOINDEX.test(p)) h.set("x-robots-tag", "noindex");
  const tm = TRANSCRIPT.exec(p);
  if (tm) { h.set("content-type", CT[tm[1]]); h.set("x-robots-tag", "noindex"); h.set("access-control-allow-origin", "*"); }   // #266
  if (isImg) h.set("vary", "accept");
  if (p === "/") h.set("link", '</.well-known/api-catalog>; rel="api-catalog", </openapi.json>; rel="service-desc"; type="application/vnd.oai.openapi+json", </llms.txt>; rel="service-doc"; type="text/plain", </.well-known/agent.json>; rel="describedby"; type="application/json"');   // RFC 8288 / 9727: Startseite verweist auf maschinenlesbare Ressourcen
  if (p === "/.well-known/api-catalog") { h.set("content-type", 'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"'); h.set("access-control-allow-origin", "*"); }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    // img.m365.fm ist die oeffentliche Adresse des R2-Buckets: Spiegel- und Sprachseiten (pages/) und Verwaltungsdateien (meta/) sind dort nicht
    // gedacht (doppelte Inhalte, als entfernt markierte Seiten). Nur diese Pfade sind hierher geroutet; Bilder (i/, og/) kommen weiter direkt aus R2.
    if (url.hostname === "img.m365.fm") return new Response("Not found", { status: 404, headers: { "content-type": "text/plain; charset=utf-8", "x-robots-tag": "noindex", "cache-control": "public, max-age=3600" } });
    // Umzug (MIGRATED=1): dub.m365.fm und m365.fm -> www.m365.fm, alte Podpage-Adressen -> /show/ (301, damit der SEO-Traffic erhalten bleibt)
    if (env.MIGRATED === "1") {
      const p0 = url.pathname.replace(/\/+$/, "") || "/";
      let to = await legacyTarget(p0);
      // T8: dub.m365.fm/m365.fm und alte Adresse in einem Schritt auf das Ziel (vorher zwei 301 hintereinander)
      if (url.hostname === "dub.m365.fm" || url.hostname === "m365.fm") {
        if (!to && /^(\/[a-z]{2})?\/show\/episodes\/[a-z0-9-]+$/.test(p0)) to = (await redirectMap())[p0] || "";   // T12: umbenannte Folge auch vom alten Host in einem Schritt
        return Response.redirect("https://www.m365.fm" + (to || url.pathname) + url.search, 301);
      }
      if (to) return Response.redirect(url.origin + to + url.search, 301);
    }
    { const mp = /^(\/[a-z]{2})?\/community\/u\/mirko-peters(\/.*)?$/.exec(url.pathname); if (mp) return Response.redirect(url.origin + (mp[1] || "") + "/community/u/mirko-p" + (mp[2] || "/") + url.search, 301); }   // alter Name des Blog-Profils
    if (/^\/(pa|hi|ml|ta|te)(\/|$)/.test(url.pathname)) return Response.redirect(url.origin + "/", 301);   // diese Sprachen gibt es nicht mehr (Punjabi, Hindi, Malayalam, Tamil, Telugu)
    const p = url.pathname, isImg = IMG.test(p), isStatic = STATIC.test(p) || FONT.test(p);
    if (p.startsWith("/__r2c/")) return new Response("Not found", { status: 404 });   // interner Cache-Schluessel, keine oeffentliche Adresse
    const cf = isImg ? { cacheEverything: true, cacheTtl: 604800, polish: "lossy", mirage: true }
      : isStatic ? { cacheEverything: true, cacheTtl: 86400 }
      : { cacheEverything: true, cacheTtlByStatus: { "200-299": EDGE_HTML, "404": 60, "500-599": 0 } };   // HTML: 4 h am Rand, Purge nach jedem Deploy
    // T41: ohne Query zum Ursprung - GitHub Pages ist statisch, so landen ?utm_…/?fbclid=… im selben Cache-Eintrag (Zone steht auf Caching-Level "basic": mit Query sonst gar kein Cache)
    const page = !isImg && !isStatic && isHtmlPath(p);   // T32: nur HTML-Adressen bekommen Region und Regions-Validatoren
    const cr = regionOf(request, env), rq = page && (request.method === "GET" || request.method === "HEAD") ? conditional(request, cr).req : request;   // Region nie im Cache-Schluessel oder Ursprungsabruf
    if (env.R2_PRIMARY === "1" && env.PAGES && !isImg && (request.method === "GET" || request.method === "HEAD") && !p.startsWith("/search/") && p !== "/r2-build.txt" && (page || !request.headers.has("range"))) {
      let dp = p; try { dp = decodeURIComponent(p); } catch { /* ungueltige Kodierung: wie angefragt */ }   // Schluessel im Bucket sind UTF-8 (z. B. /ru/tag/облако/)
      const key = r2Key(dp);
      const build = key ? r2Ready(env, url, ctx) : "";
      if (build) {
        const r2 = await r2First(rq, env, ctx, url, p, key, build);
        if (r2) return page ? markHtml(r2, request, cr) : r2;
      }
    }
    const res = await fetch(url.search ? new Request(url.origin + p, rq) : rq, { cf });
    // Weiterleitung des Ursprungs (z. B. GitHub Pages /callback -> /callback/) bekam keine Query, weil wir ohne Query abrufen (T41).
    // Query wieder anhaengen, sonst verliert die OAuth-Rueckleitung den Code (?code=…) - so geschehen am 4.11. beim YouTube-Verbinden.
    if (url.search && res.status >= 301 && res.status <= 308) {
      const loc = res.headers.get("location");
      if (loc && !loc.includes("?")) { const h = new Headers(res.headers); h.set("location", loc + url.search); return new Response(null, { status: res.status, headers: h }); }
    }
    if (res.status === 404 && /^\/og\/.+\.png$/i.test(p)) return Response.redirect("https://img.m365.fm" + p, 301);   // Teilen-Bilder liegen im R2-Bucket (img.m365.fm/og/...): frueher geteilte Adressen bleiben gueltig; solange GitHub Pages das Bild noch hat, kommt es von dort
    // Seiten aus dem R2-Bucket (Paket 20): uebersetzte Seiten (Blog-Sprachfassungen, Sprachfassungen der Folgen) liegen unter pages/<pfad>/index.html im Bucket statt in GitHub Pages - gleiche Adressen, indexierbar
    if (res.status === 404 && env.MIGRATED === "1" && /^(\/[a-z]{2})?\/show\/episodes\/[a-z0-9-]+\/?$/.test(p)) {   // T12: umbenannte Folge (show/redirects.json), vor dem R2-Rueckfall mit der alten Seite
      const to = (await redirectMap())[p.replace(/\/+$/, "")];
      if (to) return Response.redirect(url.origin + to + url.search, 301);
    }
    if (res.status === 404 && env.PAGES && /^\/search\/(manifest|part-\d{1,4})\.json$/.test(p)) {   // T37: Suchindex liegt im R2-Bucket (pages/search/...)
      const obj = await env.PAGES.get("pages" + p).catch(() => null);
      if (obj) return new Response(obj.body, { headers: { "content-type": "application/json; charset=utf-8", "cache-control": "public, max-age=300, s-maxage=600", "x-robots-tag": "noindex", "access-control-allow-origin": "*" } });
    }
    if (res.status === 404 && env.PAGES && R2_EXPORT.test(p) && (request.method === "GET" || request.method === "HEAD")) {
      const obj = await env.PAGES.get("pages" + p).catch(() => null);
      if (obj) {
        const h = new Headers({ "content-type": "application/json; charset=utf-8", "cache-control": HTML_CC });
        for (const [k, v] of Object.entries(SEC)) h.set(k, v);
        if (NOINDEX.test(p)) h.set("x-robots-tag", "noindex");
        return new Response(request.method === "HEAD" ? null : obj.body, { headers: h });
      }
    }
    if (res.status === 404 && env.PAGES && TRANSCRIPT.test(p) && (request.method === "GET" || request.method === "HEAD")) {   // #266: Transkript aus dem R2-Bucket (pages/<pfad>)
      const obj = await env.PAGES.get("pages" + p).catch(() => null);
      if (obj && !(obj.customMetadata && obj.customMetadata.gone === "1")) {
        const h = new Headers();
        if (obj.httpEtag) h.set("etag", obj.httpEtag);
        if (obj.uploaded) h.set("last-modified", obj.uploaded.toUTCString());
        finishHeaders(h, p);
        if (notModified(request, h.get("etag"), h.get("last-modified"))) return new Response(null, { status: 304, headers: h });
        return new Response(request.method === "HEAD" ? null : obj.body, { headers: h });
      }
    }
    if (res.status === 404 && env.PAGES && !IMG.test(p) && (request.method === "GET" || request.method === "HEAD")) {
      const r2 = await r2Page(rq, env, ctx, url, p);
      if (r2) return page ? markHtml(r2, request, cr) : r2;
      const m = /^\/(de|es|fr|it|pt|nl|pl|id|ru|uk|ar|he|ja|ko)\/show\/episodes\/([a-z0-9-]+)\/?$/.exec(p);   // noch nicht hochgeladen: englisches Original statt 404
      if (m) return Response.redirect(url.origin + "/show/episodes/" + m[2] + "/", 301);
    }
    if (res.status === 404 && FEED_ITEM.test(p) && (request.method === "GET" || request.method === "HEAD")) return feedGone(request, p);
    const h = new Headers(res.headers);
    finishHeaders(h, p);
    const out = new Response(res.body, { status: res.status, statusText: res.statusText, headers: h });
    return page ? markHtml(out, request, cr) : out;   // Assets, Bilder und Dateien bleiben unberuehrt (auch bei falschem Content-Type)
  },
};
