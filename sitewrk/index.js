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
// Datenexporte des Seitenbaus: fuer Programme da, nicht fuer die Suche; jede .json bekommt noindex, ausser den oeffentlichen API-Beschreibungen
// und Datenfeeds (agent.json, episodes.json, openapi.json, /.well-known/). llms*.txt, Feeds (.xml) und HTML bleiben sichtbar.
const NOINDEX = /^\/(search\/|entities\.json|entities-src\.json|entities\.jsonld|og-manifest\.json|seo-report\.json|top\.json|show\/redirects\.json|show\/transcripts\.json|show-notes\/|blog-import\/|blog-content\/)|\.jsonld$/i;
const noindexPath = (p) => !p.startsWith("/.well-known/") && !/^\/(?:agent|episodes|openapi)\.json$/i.test(p) && (NOINDEX.test(p) || /\.json$/i.test(p));
// #266: Transkript-Dateien je Folge (Hauptshow, Dub-Folge, Sprachfassung) liegen im R2-Bucket (r2out/): fuer Podcast-Apps (CORS) und Programme,
// nicht fuer die Suche (der Text steht schon auf der Folgenseite). Gleiche Regel wie site_transcripts.PATH_RX.
export const TRANSCRIPT = /^(?:\/[a-z]{2})?(?:\/show\/episodes)?\/[a-z0-9-]+\/transcript\.(txt|vtt)$/;
const R2_EXPORT = /^\/(?:blog-import\/[^/]+\.json|translations-blog\.json)$/i;
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
function finishHeaders(h, p) {
  const isImg = IMG.test(p), isStatic = STATIC.test(p) || FONT.test(p);
  for (const [k, v] of Object.entries(SEC)) h.set(k, v);
  // T41: Schriften aendern sich unter gleichem Namen nicht (1 Jahr), Bilder 1 Tag, Skripte/Stile 1 h und danach im Hintergrund pruefen
  h.set("cache-control", HASHED.test(p) || FONT.test(p) ? "public, max-age=31536000, immutable" : isImg ? "public, max-age=86400, stale-while-revalidate=604800"
    : isStatic ? "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400" : HTML_CC);
  if (noindexPath(p)) h.set("x-robots-tag", "noindex");
  const tm = TRANSCRIPT.exec(p);
  if (tm) { h.set("content-type", CT[tm[1]]); h.set("x-robots-tag", "noindex"); h.set("access-control-allow-origin", "*"); }   // #266
  if (isImg) h.set("vary", "accept");
  // Merker fuer den Seitenbau (site.yml, Deploy-Job): diese Worker-Fassung liefert die Sitemaps der Sprachen ausser en/de aus R2 (SITEMAP_R2).
  // Erst wenn /sitemap.xml ihn traegt, veroeffentlicht der Deploy-Job ein docs/ ohne diese Sitemaps - sonst antworteten sie mit 404 (alter Worker).
  if (p === "/sitemap.xml" || SITEMAP_R2.test(p)) h.set("x-m365-sitemaps", "r2");
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
  if (request.method !== "GET" && !head) return new Response("Method not allowed", { status: 405, headers: stagingHeaders({ allow: "GET, HEAD", "content-type": "text/plain; charset=utf-8" }) });
  if (p === "/robots.txt") return new Response(head ? null : STAGING_ROBOTS, { headers: stagingHeaders({ "content-type": "text/plain; charset=utf-8" }) });
  if (!env.PAGES) return new Response("Staging-Bucket nicht verbunden", { status: 503, headers: stagingHeaders({ "content-type": "text/plain; charset=utf-8" }) });
  let dp = p; try { dp = decodeURIComponent(p); } catch { /* ungueltige Kodierung: wie angefragt */ }
  if (dp.split("/").includes("..") || dp.includes("\0")) return new Response("Bad request", { status: 400, headers: stagingHeaders({ "content-type": "text/plain; charset=utf-8" }) });
  if (!dp.endsWith("/") && !extOf(dp)) return new Response(null, { status: 301, headers: stagingHeaders({ location: url.origin + p + "/" + url.search }) });   // wie GitHub Pages: Verzeichnis ohne "/" -> mit "/"
  const key = r2Key(dp);
  const obj = key ? await env.PAGES.get(key).catch(() => null) : null;
  if (!obj || (obj.customMetadata && obj.customMetadata.gone === "1")) {
    const nf = await env.PAGES.get("pages/404.html").catch(() => null);
    const body = nf && !head ? await nf.text().catch(() => "") : "";
    return new Response(head ? null : body || "Not found", { status: 404, headers: stagingHeaders({ "content-type": nf ? CT.html : "text/plain; charset=utf-8" }) });
  }
  const ext = key.endsWith("/index.html") ? "html" : extOf(key), meta = obj.httpMetadata && obj.httpMetadata.contentType;
  const h = stagingHeaders({ "content-type": ext === "html" ? CT.html : (meta && !/octet-stream/i.test(meta) ? meta : CT[ext] || "application/octet-stream") });
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
const COMMUNITY_API = "https://api-dub.m365.fm", PROFILE_MISS_TTL = 60;
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
  const cache = caches.default, ck = new Request(url.origin + "/__live/u/" + handle);
  if (await cache.match(ck).catch(() => null)) return null;   // kurz gemerkt: eindeutig kein oeffentliches Profil (schuetzt die API vor Abfragen erfundener Kuerzel)
  let r;
  try { r = await fetch(api + "/api/profile/" + handle, { headers: { accept: "application/json" }, signal: AbortSignal.timeout(3000), cf: { cacheTtl: 0 } }); } catch { return null; }
  if (r.status === 404) { ctx.waitUntil(cache.put(ck, new Response("", { headers: { "cache-control": `public, max-age=${PROFILE_MISS_TTL}` } })).catch(() => {})); return null; }
  if (!r.ok) return null;
  let j; try { j = await r.json(); } catch { return null; }
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
const WWW_HOSTS = new Set(["www.m365.fm", "m365.fm", "dub.m365.fm"]);
const PARTNER_NOINDEX = { "x-robots-tag": "noindex, nofollow" };

async function partnerRequest(request, env, ctx, url) {
  const quiet = (status, extra = {}) => new Response(status === 405 ? "Method not allowed" : null, { status, headers: { ...SEC, ...PARTNER_NOINDEX, "cache-control": "no-store", ...extra } });
  const p = url.pathname;
  if (p === "/robots.txt") return new Response("User-agent: *\nDisallow: /\n", { headers: { ...SEC, "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" } });
  if (request.method !== "GET" && request.method !== "HEAD") return quiet(405, { allow: "GET, HEAD" });
  if (/^\/sitemap[^/]*\.xml$/i.test(p)) return quiet(404);   // die Subdomain steht in keiner Sitemap
  const origin = (env.ORIGIN || "https://www.m365.fm").replace(/\/+$/, "");
  const www = partnerToWww(p);
  // Dashboard-Seiten und statische Dateien (Skripte, Stile, Bilder, Schriften) kommen ueber die normale Kette von www.m365.fm; alles andere gehoert zur Website
  if (!www && !(STATIC.test(p) || FONT.test(p) || IMG.test(p))) return quiet(302, { location: origin + p + url.search });
  const target = new URL(origin + (www || p)); target.search = url.search;
  const inner = new Request(target.href, request);
  inner.headers.set("x-partner-rewrite", "1");   // der www-Zweig leitet dann nicht zurueck auf partner (keine Schleife)
  const res = await worker.fetch(inner, env, ctx);
  const h = new Headers(res.headers);
  if (www) h.set("x-robots-tag", PARTNER_NOINDEX["x-robots-tag"]);
  const loc = h.get("location");
  if (loc && res.status >= 300 && res.status < 400) {
    try { const l = new URL(loc, target); const back = l.origin === new URL(origin).origin ? wwwToPartner(l.pathname) : ""; if (back) h.set("location", url.origin + back + l.search); } catch { /* Ziel bleibt wie geliefert */ }
  }
  return new Response(request.method === "HEAD" ? null : res.body, { status: res.status, statusText: res.statusText, headers: h });
}

const worker = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (isStaging(env)) return stagingFetch(request, env);   // Testumgebung: eigener, abgeschlossener Pfad (oben); Live-Verhalten unveraendert
    const fh = foreignHost(env, request, url);   // BYOD: Fremd-Domain eines Mitglieds (nur mit Schalter)
    if (fh === "bad") return plain(421, "Misdirected request");
    if (fh) return byodServe(request, env, url, fh);
    // img.m365.fm ist die oeffentliche Adresse des R2-Buckets: Spiegel- und Sprachseiten (pages/) und Verwaltungsdateien (meta/) sind dort nicht
    // gedacht (doppelte Inhalte, als entfernt markierte Seiten). Nur diese Pfade sind hierher geroutet; Bilder (i/, og/) kommen weiter direkt aus R2.
    if (url.hostname === "img.m365.fm") return new Response("Not found", { status: 404, headers: { "content-type": "text/plain; charset=utf-8", "x-robots-tag": "noindex", "cache-control": "public, max-age=3600" } });
    // partner.m365.fm (PARTNER_HOST): Sponsor-Dashboard auf eigener Subdomain, noindex, nicht in der Sitemap
    const partnerHost = env.PARTNER_HOST || "";
    if (partnerHost && url.hostname === partnerHost) return partnerRequest(request, env, ctx, url);
    if (partnerHost && env.PARTNER_REDIRECT === "1" && WWW_HOSTS.has(url.hostname) && !request.headers.has("x-partner-rewrite") && (request.method === "GET" || request.method === "HEAD")) {
      const to = wwwToPartner(url.pathname);   // alte Adresse /sponsor/dashboard/... -> 301 in einem Schritt (auch von m365.fm, dub.m365.fm und http://)
      if (to) return new Response(null, { status: 301, headers: { ...SEC, location: "https://" + partnerHost + to + url.search, "cache-control": "public, max-age=3600" } });
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
    if (p.startsWith("/__r2c/")) return new Response("Not found", { status: 404 });   // interner Cache-Schluessel, keine oeffentliche Adresse
    if (p === "/") { const hl = homeLang(request); if (hl) return langRedirect(url.origin, hl, url.search); }   // vor jedem Cache: eine englische Startseite aus dem Cache erreicht nie einen deutschen Browser
    const cf = isImg ? { cacheEverything: true, cacheTtl: 604800, polish: "lossy", mirage: true }
      : isStatic ? { cacheEverything: true, cacheTtl: 86400 }
      : { cacheEverything: true, cacheTtlByStatus: { "200-299": EDGE_HTML, "404": 60, "500-599": 0 } };   // HTML: 4 h am Rand, Purge nach jedem Deploy
    // T41: ohne Query zum Ursprung - GitHub Pages ist statisch, so landen ?utm_…/?fbclid=… im selben Cache-Eintrag (Zone steht auf Caching-Level "basic": mit Query sonst gar kein Cache)
    const page = !isImg && !isStatic && isHtmlPath(p), rq = request;   // Seiten: R2 zuerst auch bei Range-Anfragen (s. u.)
    if (env.R2_PRIMARY === "1" && env.PAGES && !isImg && (request.method === "GET" || request.method === "HEAD") && !p.startsWith("/search/") && p !== "/r2-build.txt" && (page || !request.headers.has("range"))) {
      let dp = p; try { dp = decodeURIComponent(p); } catch { /* ungueltige Kodierung: wie angefragt */ }   // Schluessel im Bucket sind UTF-8 (z. B. /ru/tag/облако/)
      const key = r2Key(dp);
      const build = key ? r2Ready(env, url, ctx) : "";
      if (build) {
        const r2 = await r2First(rq, env, ctx, url, p, key, build);
        if (r2) return r2;
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
    if (res.status === 404 && env.PAGES && /^\/search\/(manifest|part-\d{1,4})\.json$/.test(p)) {   // T37: Suchindex liegt im R2-Bucket (pages/search/...)
      const obj = await env.PAGES.get("pages" + p).catch(() => null);
      if (obj) return new Response(obj.body, { headers: { "content-type": "application/json; charset=utf-8", "cache-control": "public, max-age=300, s-maxage=600", "x-robots-tag": "noindex", "access-control-allow-origin": "*" } });
    }
    if (res.status === 404 && env.PAGES && R2_EXPORT.test(p) && (request.method === "GET" || request.method === "HEAD")) {
      const obj = await env.PAGES.get("pages" + p).catch(() => null);
      if (obj) {
        const h = new Headers({ "content-type": "application/json; charset=utf-8", "cache-control": HTML_CC });
        for (const [k, v] of Object.entries(SEC)) h.set(k, v);
        if (noindexPath(p)) h.set("x-robots-tag", "noindex");
        return new Response(request.method === "HEAD" ? null : obj.body, { headers: h });
      }
    }
    // Sitemap aus dem R2-Bucket (pages/<datei>): indexierbar (kein noindex), application/xml, SEC- und HTML-Cache-Header (finishHeaders), ETag/304, HEAD.
    // Nur Objekte des r2out-Uploads: als entfernt markiert (gone=1) oder nur Spiegel von GitHub Pages (src=docs, dort 404 = wirklich weg) -> 404 wie bisher.
    if (res.status === 404 && env.PAGES && SITEMAP_R2.test(p) && (request.method === "GET" || request.method === "HEAD")) {
      const obj = await env.PAGES.get("pages" + p).catch(() => null);
      const cm = (obj && obj.customMetadata) || {};
      if (obj && cm.gone !== "1" && cm.src !== "docs") {
        const h = new Headers({ "content-type": CT.xml, "access-control-allow-origin": "*" });   // CORS wie GitHub Pages
        if (obj.httpEtag) h.set("etag", obj.httpEtag);
        if (obj.uploaded) h.set("last-modified", obj.uploaded.toUTCString());
        finishHeaders(h, p);
        if (notModified(request, h.get("etag"), h.get("last-modified"))) return new Response(null, { status: 304, headers: h });
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
    finishHeaders(h, p);
    return new Response(request.method === "HEAD" ? null : res.body, { status: res.status, statusText: res.statusText, headers: h });
  },
};
export default worker;
