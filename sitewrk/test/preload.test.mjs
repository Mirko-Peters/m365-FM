// Preload-Link-Header fuer Early Hints (Ladezeit 27.11.2026, Punkt 4, Schalter PRELOAD_LINK): HTML-Seiten bekommen Link-Eintraege genau fuer das
// Stylesheet mit data-sbar und das LCP-Bild, das der Kopf derselben Seite vorlaedt (gleiche imagesrcset/imagesizes/media/type) - nichts sonst,
// keine Schriften, keine fremden Hosts. Koerper byte-gleich; kein Header bei HEAD, 304, Fehlern, Dateien, partner/admin/profile, img, BYOD, Schalter "0".
import { test } from "node:test"; import assert from "node:assert/strict";
globalThis.caches = { default: { match: async () => undefined, put: async () => {} } };
const CSS = '<link rel="stylesheet" href="https://www.m365.fm/assets/site.0123abcd45.css" data-sbar>';
const FONT = '<link rel="preload" href="https://www.m365.fm/assets/fonts/inter-normal.woff2" as="font" type="font/woff2" crossorigin fetchpriority="high">';
const IMGP = '<link rel="preload" as="image" type="image/avif" imagesrcset="https://img.m365.fm/i/a-w400.avif 400w, https://img.m365.fm/i/a-w800.avif 800w" imagesizes="(min-width: 1100px) 320px, 100vw" media="(min-width: 1100px)" fetchpriority="high">';
const HEAD = `<!doctype html><html lang="en"><head><meta charset="utf-8">${FONT}${CSS}${IMGP}<title>x</title></head>`;
let PAGE = HEAD + "<body>" + "x".repeat(70000) + "</body></html>", CHUNKED = false;
const LINK_HOME = '</.well-known/api-catalog>; rel="api-catalog"';
globalThis.fetch = async (req) => {
  const r = typeof req === "string" ? new Request(req) : req, u = new URL(r.url);
  if (u.pathname === "/show/redirects.json") return new Response("{}", { headers: { "content-type": "application/json" } });
  if (u.pathname === "/feed.json") return new Response("{}", { headers: { "content-type": "application/json" } });
  if (u.pathname === "/fehlt/") return new Response(HEAD + "404", { status: 404, headers: { "content-type": "text/html; charset=utf-8" } });
  if (u.pathname === "/assets/x.js") return new Response(HEAD, { headers: { "content-type": "text/javascript" } });
  if (CHUNKED) {   // Kopf ueber mehrere Stuecke verteilt, </head> mitten im Datenstrom
    const parts = [PAGE.slice(0, 50), PAGE.slice(50, 300), PAGE.slice(300, HEAD.length - 3), PAGE.slice(HEAD.length - 3, 9000), PAGE.slice(9000)];
    const body = new ReadableStream({ start(c) { for (const p of parts) c.enqueue(new TextEncoder().encode(p)); c.close(); } });
    return new Response(body, { headers: { "content-type": "text/html; charset=utf-8" } });
  }
  return new Response(PAGE, { headers: { "content-type": "text/html; charset=utf-8", etag: '"e"' } });
};
const { default: W, preloadLinks, withPreload } = await import("../index.js");
const ENV = { MIGRATED: "1", PRELOAD_LINK: "1" };
const run = (p, { method = "GET", host = "www.m365.fm", headers = {}, env = ENV } = {}) => W.fetch(new Request("https://" + host + p, { method, headers }), env, { waitUntil() {} });
const EXP_CSS = "<https://www.m365.fm/assets/site.0123abcd45.css>; rel=preload; as=style";
const EXP_IMG = '<https://img.m365.fm/i/a-w400.avif>; rel=preload; as=image; imagesrcset="https://img.m365.fm/i/a-w400.avif 400w, https://img.m365.fm/i/a-w800.avif 800w"; imagesizes="(min-width: 1100px) 320px, 100vw"; media="(min-width: 1100px)"; type="image/avif"; fetchpriority=high';

test("preloadLinks: Stylesheet mit data-sbar und LCP-Bild mit denselben Attributen; keine Schrift", () => {
  assert.deepEqual(preloadLinks(HEAD), [EXP_CSS, EXP_IMG]);
});

test("preloadLinks: ohne Bild nur CSS; Stylesheet ohne data-sbar, Bild ohne fetchpriority=high, fremde Hosts und crossorigin nicht", () => {
  assert.deepEqual(preloadLinks(`<head>${CSS}</head>`), [EXP_CSS]);
  assert.deepEqual(preloadLinks('<link rel="stylesheet" href="/assets/a11y.css">'), []);
  assert.deepEqual(preloadLinks('<link rel="preload" as="image" href="https://img.m365.fm/i/a.webp">'), [], "ohne fetchpriority=high");
  assert.deepEqual(preloadLinks('<link rel="preload" as="image" href="https://d3wo5wojvuv7l.cloudfront.net/a.jpg" fetchpriority="high">'), [], "fremder Host");
  assert.deepEqual(preloadLinks('<link rel="preload" as="image" imagesrcset="https://img.m365.fm/a.webp 1x, https://evil.example/b.webp 2x" fetchpriority="high">'), [], "ein fremder Kandidat");
  assert.deepEqual(preloadLinks('<link rel="preload" as="image" href="/i/a.webp" fetchpriority="high" crossorigin>'), []);
  assert.deepEqual(preloadLinks('<link rel="stylesheet" href="//evil.example/x.css" data-sbar>'), [], "protokoll-relativ");
  assert.deepEqual(preloadLinks('<link rel="stylesheet" href="https://www.m365.fm/a.css?x=1&amp;y=2" data-sbar>'), ["<https://www.m365.fm/a.css?x=1&y=2>; rel=preload; as=style"], "Entitaeten dekodiert");
  assert.deepEqual(preloadLinks('<link rel="preload" as="image" href="/i/a.webp" fetchpriority="high">'), ["</i/a.webp>; rel=preload; as=image; fetchpriority=high"]);
  assert.deepEqual(preloadLinks("<link rel=stylesheet href=/assets/site.abcdef0123.css data-sbar>"), ["</assets/site.abcdef0123.css>; rel=preload; as=style"], "ohne Anfuehrungszeichen");
  assert.deepEqual(preloadLinks('<link rel="stylesheet" href="/assets/sä.css" data-sbar>'), [], "kein Nicht-ASCII im Header");
  assert.deepEqual(preloadLinks(""), []);
});

test("HTML-Seite: Link-Header gesetzt, Koerper byte-gleich (auch ueber 64 KiB), Speculation-Rules bleibt", async () => {
  for (const chunked of [false, true]) {
    CHUNKED = chunked;
    const r = await run("/show/");
    assert.equal(r.status, 200); assert.equal(r.headers.get("link"), EXP_CSS + ", " + EXP_IMG, "chunked=" + chunked);
    assert.equal(await r.text(), PAGE, "Koerper unveraendert"); assert.equal(r.headers.get("speculation-rules"), '"/speculation.json"');
  }
  CHUNKED = false;
});

test("Startseite: Preload hinter dem vorhandenen api-catalog-Link", async () => {
  const r = await run("/", { headers: { accept: "application/json" } });
  const l = r.headers.get("link"); assert.ok(l.startsWith(LINK_HOME), l); assert.ok(l.endsWith(", " + EXP_CSS + ", " + EXP_IMG), l);
});

test("Kein Header: HEAD, 404, Dateien, Schalter aus, partner/img, fremder Host", async () => {
  const none = async (r, why) => { const x = await r; assert.equal(x.headers.get("link"), null, why); return x; };
  await none(run("/show/", { method: "HEAD" }), "HEAD");
  await none(run("/fehlt/"), "404");
  await none(run("/feed.json"), "JSON");
  await none(run("/assets/x.js"), "Skript");
  await none(run("/show/", { env: { ...ENV, PRELOAD_LINK: "0" } }), "Schalter 0");
  await none(run("/show/", { env: { MIGRATED: "1" } }), "ohne Variable");
  await none(run("/i/a.webp", { host: "img.m365.fm" }), "img");
});

test("withPreload direkt: 304 und fremde Hosts unveraendert; Staging nur staging.m365.fm", async () => {
  const mk = (status = 200) => new Response(status === 304 ? null : HEAD, { status, headers: { "content-type": "text/html; charset=utf-8" } });
  const rq = (u, h = {}) => new Request(u, { headers: h });
  let r = await withPreload(rq("https://www.m365.fm/a/"), ENV, mk(304)); assert.equal(r.headers.get("link"), null);
  r = await withPreload(rq("https://blog.example.com/a/"), ENV, mk()); assert.equal(r.headers.get("link"), null, "BYOD");
  r = await withPreload(rq("https://partner.m365.fm/a/"), ENV, mk()); assert.equal(r.headers.get("link"), null, "partner");
  r = await withPreload(rq("https://www.m365.fm/a/", { "x-partner-rewrite": "1" }), ENV, mk()); assert.equal(r.headers.get("link"), null, "partner-Umweg");
  r = await withPreload(rq("http://www.m365.fm/a/"), ENV, mk()); assert.equal(r.headers.get("link"), null, "http");
  const S = { ENVIRONMENT: "staging", PRELOAD_LINK: "1" };
  r = await withPreload(rq("https://staging.m365.fm/a/"), S, mk()); assert.equal(r.headers.get("link"), EXP_CSS + ", " + EXP_IMG, "Staging");
  r = await withPreload(rq("https://www.m365.fm/a/"), S, mk()); assert.equal(r.headers.get("link"), null, "Staging-Worker nur auf staging.m365.fm");
  r = await withPreload(rq("https://www.m365.fm/a/"), ENV, new Response("<html><body>ohne Kopf" + "y".repeat(70000), { headers: { "content-type": "text/html" } }));
  assert.equal(r.headers.get("link"), null, "kein </head> in 64 KiB"); assert.equal((await r.text()).length, "<html><body>ohne Kopf".length + 70000);
});

test("Kopf ueber 64 KiB (grosses JSON-LD hinter Stylesheet und Bild): Links aus dem gelesenen Kopfteil, Koerper byte-gleich", async () => {
  const ld = '<script type="application/ld+json">' + "{\"a\":\"" + "z".repeat(90000) + "\"}</script>";
  const big = `<!doctype html><html lang="en"><head><meta charset="utf-8">${FONT}${CSS}${IMGP}${ld}</head><body>b</body></html>`;
  const mk = () => new Response(new ReadableStream({ start(c) { for (let i = 0; i < big.length; i += 16384) c.enqueue(new TextEncoder().encode(big.slice(i, i + 16384))); c.close(); } }),
    { headers: { "content-type": "text/html; charset=utf-8" } });
  const r = await withPreload(new Request("https://www.m365.fm/entity/"), ENV, mk());
  assert.equal(r.headers.get("link"), EXP_CSS + ", " + EXP_IMG); assert.equal(await r.text(), big);
  // angeschnittenes <link> am Lesegrenze: kein halber Eintrag
  const cut = `<!doctype html><html><head>${"<meta name=x>".repeat(5040)}${CSS}${ld}</head><body></body></html>`;
  const r2 = await withPreload(new Request("https://www.m365.fm/a/"), ENV, new Response(cut, { headers: { "content-type": "text/html" } }));
  assert.equal(await r2.text(), cut); const l2 = r2.headers.get("link"); assert.ok(l2 === null || l2 === EXP_CSS, String(l2));
});

test("preloadLinks: <link> als Text in JSON-LD, Skript, Stil, noscript oder Kommentar zaehlt nicht (Nutzertexte im JSON-LD, Gegenpruefung 25.11.2026)", () => {
  const evil = '<link rel=preload as=image fetchpriority=high href=https://admin.m365.fm/x>';
  const ld = `<script type="application/ld+json">{"jobTitle":"${evil}"}</script>`;
  assert.deepEqual(preloadLinks(`${CSS}${ld}`), [EXP_CSS]);
  assert.deepEqual(preloadLinks(`${CSS}<script>var a='${evil.replace("admin.", "")}'</script>`), [EXP_CSS], "Skript");
  assert.deepEqual(preloadLinks(`${CSS}<script type="application/ld+json">{"x":"${evil.replace("admin.", "")}`), [EXP_CSS], "abgeschnittenes JSON-LD (Lesegrenze)");
  assert.deepEqual(preloadLinks(`<!-- ${CSS} -->`), [], "Kommentar");
  assert.deepEqual(preloadLinks(`<noscript>${CSS}</noscript><style>/* ${CSS} */</style><template>${CSS}</template>`), [], "noscript, style, template");
  assert.deepEqual(preloadLinks(`${ld}${IMGP}`), [EXP_IMG], "echter Bild-Preload nach dem JSON-LD bleibt");
});

test("preloadLinks: nur Website- und Bild-Hosts, keine anderen *.m365.fm-Subdomains", () => {
  for (const h of ["admin.m365.fm", "partner.m365.fm", "profile.m365.fm", "api-dub.m365.fm", "x.img.m365.fm", "m365con.net", "img.m365.fm:8443"])
    assert.deepEqual(preloadLinks(`<link rel="preload" as="image" href="https://${h}/a.webp" fetchpriority="high">`), [], h);
  for (const h of ["www.m365.fm", "img.m365.fm", "staging.m365.fm"])
    assert.equal(preloadLinks(`<link rel="preload" as="image" href="https://${h}/a.webp" fetchpriority="high">`).length, 1, h);
});
