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

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (isStaging(env)) return stagingFetch(request, env);   // Testumgebung: eigener, abgeschlossener Pfad (oben); Live-Verhalten unveraendert
    // img.m365.fm ist die oeffentliche Adresse des R2-Buckets: Spiegel- und Sprachseiten (pages/) und Verwaltungsdateien (meta/) sind dort nicht
    // gedacht (doppelte Inhalte, als entfernt markierte Seiten). Nur diese Pfade sind hierher geroutet; Bilder (i/, og/) kommen weiter direkt aus R2.
    if (url.hostname === "img.m365.fm") return new Response("Not found", { status: 404, headers: { "content-type": "text/plain; charset=utf-8", "x-robots-tag": "noindex", "cache-control": "public, max-age=3600" } });
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
      if (r2) return r2;
      const m = LANG_EP.exec(p);   // noch nicht hochgeladen: englisches Original statt 404 - umbenannt gleich auf den neuen Slug (ein Schritt)
      if (m) return Response.redirect(url.origin + ((migrated && (await redirectMap())["/show/episodes/" + m[2]]) || "/show/episodes/" + m[2] + "/") + url.search, 301);
    }
    if (res.status === 404 && FEED_ITEM.test(p) && (request.method === "GET" || request.method === "HEAD")) return feedGone(request, p);
    const h = new Headers(res.headers);
    finishHeaders(h, p);
    return new Response(request.method === "HEAD" ? null : res.body, { status: res.status, statusText: res.statusText, headers: h });
  },
};
