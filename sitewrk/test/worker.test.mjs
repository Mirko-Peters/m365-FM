// Site-Worker: Region (T32), Cache (T41), Validatoren - mit nachgebauter Cache API, R2 und fetch (ohne HTMLRewriter)
import { test } from "node:test"; import assert from "node:assert/strict";
import { regionOf, tagFor, lmFor, conditional, countries, isHtmlPath } from "../consent.js";
import { execFileSync } from "node:child_process";
const LM = "Sun, 01 Nov 2026 10:00:37 GMT", LM0 = "Sun, 01 Nov 2026 10:00:00 GMT", LM1 = "Sun, 01 Nov 2026 10:00:01 GMT";
const store = new Map(); let r2gets = 0, lastOrigin = null;
globalThis.caches = { default: { match: async (r) => { const x = store.get(r.url); return x ? x.clone() : undefined; }, put: async (r, res) => { store.set(r.url, res.clone()); } } };
globalThis.fetch = async (req) => {
  const r = typeof req === "string" ? new Request(req) : req, u = new URL(r.url); lastOrigin = r;
  if (u.pathname === "/show/redirects.json") return new Response("{}", { headers: { "content-type": "application/json" } });
  const inm = r.headers.get("if-none-match"), ims = r.headers.get("if-modified-since");
  if (u.pathname === "/") { if (inm === 'W/"abc"' || (!inm && ims && Date.parse(ims) >= Date.parse(LM))) return new Response(null, { status: 304, headers: { etag: '"abc"', "last-modified": LM } }); return new Response("<html><body>gh</body></html>", { headers: { "content-type": "text/html; charset=utf-8", etag: '"abc"', "last-modified": LM } }); }
  if (u.pathname === "/nolm/") { if (ims && Date.parse(ims) >= Date.parse(LM)) return new Response(null, { status: 304 }); return new Response("<html>x</html>", { headers: { "content-type": "text/html; charset=utf-8", "last-modified": LM } }); }
  if (u.pathname === "/feed.json") { if (ims) return new Response(null, { status: 304, headers: { "last-modified": LM } }); return new Response("{}", { headers: { "content-type": "application/json", etag: '"j1"', "last-modified": LM } }); }
  if (u.pathname === "/rng/") { if (r.headers.get("range")) return new Response("<html><b", { status: 206, headers: { "content-type": "text/html", "content-range": "bytes 0-8/30" } }); return new Response("<html><body>full</body></html>", { headers: { "content-type": "text/html" } }); }
  if (u.pathname === "/assets/a.css") return new Response("a{}", { headers: { "content-type": "text/css", etag: 'W/"css1"' } });
  return new Response("404", { status: 404, headers: { "content-type": "text/html" } });
};
const { default: W, r2Key } = await import("../index.js");
const PAGES = { get: async (k) => { r2gets++; if (k === "pages/pl/x/index.html") return { httpEtag: '"r2e"', uploaded: new Date("2026-11-01T20:00:00Z"), arrayBuffer: async () => new TextEncoder().encode("<html>pl</html>").buffer }; if (k === "pages/blog-import/index.json") return { body: new Response('{"total":7}').body }; if (k === "pages/translations-blog.json") return { body: new Response('{"count":3}').body }; return null; } };
const env = { PAGES, MIGRATED: "1", CONSENT_COUNTRIES: "DE,AT,GB,CH,NO,PL" };
const req = (path, c, h = {}, method = "GET") => { const r = new Request("https://www.m365.fm" + path, { headers: h, method }); if (c) Object.defineProperty(r, "cf", { value: { country: c } }); return r; };
const run = async (r) => { const w = []; const res = await W.fetch(r, env, { waitUntil: (p) => w.push(p) }); await Promise.all(w); return res; };

test("Laenderliste: ohne Variable, leer, * oder fehlerhaft -> ueberall Banner (frischer Prozess, Reihenfolge egal)", () => {
  const code = `import { regionOf, countries } from "./consent.js"; const r = new Request("https://x/"); Object.defineProperty(r, "cf", { value: { country: "US" } });
    console.log(JSON.stringify([regionOf(r, {}), regionOf(r, undefined), countries(undefined) === "*"]));`;
  const out = execFileSync(process.execPath, ["--input-type=module", "-e", code], { cwd: new URL("..", import.meta.url), encoding: "utf8" });
  assert.deepEqual(JSON.parse(out.trim().split("\n").pop()), ["1", "1", true]);
  const us = req("/", "US");
  for (const bad of ["DEU,AUT", '["DE","AT"]', "DE|AT", "DE,AUT", "   "]) assert.equal(regionOf(us, { CONSENT_COUNTRIES: bad }), "1", bad);
  assert.equal(regionOf(us, { CONSENT_COUNTRIES: "de, at;\nch" }), "0"); assert.equal(regionOf(req("/", "CH"), { CONSENT_COUNTRIES: "de, at;\nch" }), "1");
  assert.equal(countries("*"), "*");
});
test("Region aus cf.country, Liste aus der Konfiguration, sicherer Rueckfall", () => {
  assert.equal(regionOf(req("/", "DE"), env), "1"); assert.equal(regionOf(req("/", "US"), env), "0");
  assert.equal(regionOf(req("/", "XX"), env), "1"); assert.equal(regionOf(req("/", "T1"), env), "1"); assert.equal(regionOf(req("/"), env), "1");
  assert.equal(regionOf(req("/", undefined, { "cf-ipcountry": "us" }), env), "0");
  assert.equal(regionOf(req("/", "US"), {}), "1"); assert.equal(regionOf(req("/", "US"), { CONSENT_COUNTRIES: "*" }), "1");
});
test("Validatoren mit Region: ETag-Endung, Last-Modified-Sekunde (Region 1 immer spaeter)", () => {
  assert.equal(tagFor('"abc"', "1"), 'W/"abc.r1"'); assert.equal(tagFor('W/"abc"', "0"), 'W/"abc.r0"'); assert.equal(tagFor(null, "0"), null);
  assert.equal(lmFor(LM, "0"), LM0); assert.equal(lmFor(LM, "1"), LM1); assert.equal(lmFor("kaputt", "1"), null);
  assert.ok(Date.parse(lmFor(LM, "1")) > Date.parse(lmFor(LM, "0")));
  assert.ok(isHtmlPath("/") && isHtmlPath("/de/entity/x/") && isHtmlPath("/impressum") && isHtmlPath("/a.html"));
  assert.ok(!isHtmlPath("/feed.json") && !isHtmlPath("/sitemap.xml") && !isHtmlPath("/llms.txt"));
  let c = conditional(req("/", "DE", { "if-none-match": 'W/"abc.r1"', "if-modified-since": LM1 }), "1");
  assert.equal(c.own, true); assert.equal(c.req.headers.get("if-none-match"), 'W/"abc"'); assert.equal(c.req.headers.get("if-modified-since"), "Sun, 01 Nov 2026 10:00:59 GMT");
  c = conditional(req("/", "US", { "if-none-match": 'W/"abc.r1"', "if-modified-since": LM1 }), "0");
  assert.equal(c.own, false); assert.equal(c.req.headers.get("if-none-match"), null); assert.equal(c.req.headers.get("if-modified-since"), null);
  c = conditional(req("/", "US", { "if-none-match": '"abc"', "if-modified-since": LM }), "0");   // Browser-Cache von vor T32: verworfen
  assert.equal(c.req.headers.get("if-none-match"), null); assert.equal(c.req.headers.get("if-modified-since"), null);
  c = conditional(req("/", "US", { range: "bytes=0-9", "if-range": '"abc"' }), "0"); assert.equal(c.req.headers.get("range"), null); assert.equal(c.req.headers.get("if-range"), null);
});
test("HTML von GitHub Pages: Region im Header, privater Cache, Validatoren mit Region", async () => {
  const r = await run(req("/", "US")); assert.equal(r.status, 200);
  assert.equal(r.headers.get("x-m365-cr"), "0"); assert.equal(r.headers.get("cache-control"), "private, no-cache");
  assert.equal(r.headers.get("etag"), 'W/"abc.r0"'); assert.equal(r.headers.get("last-modified"), LM0);
  const d = await run(req("/", "DE")); assert.equal(d.headers.get("x-m365-cr"), "1"); assert.equal(d.headers.get("etag"), 'W/"abc.r1"'); assert.equal(d.headers.get("last-modified"), LM1);
});
test("304 nur fuer die eigene Region - per ETag und per Last-Modified allein (Kante entfernt den ETag)", async () => {
  let r = await run(req("/", "DE", { "if-none-match": 'W/"abc.r1"' })); assert.equal(r.status, 304); assert.equal(r.headers.get("etag"), 'W/"abc.r1"'); assert.equal(r.headers.get("x-m365-cr"), "1");
  assert.equal(lastOrigin.headers.get("if-none-match"), 'W/"abc"');
  r = await run(req("/", "US", { "if-none-match": 'W/"abc.r1"' })); assert.equal(r.status, 200); assert.equal(r.headers.get("etag"), 'W/"abc.r0"');   // Laenderwechsel: neue Fassung
  r = await run(req("/", "DE", { "if-modified-since": LM1 })); assert.equal(r.status, 304); assert.equal(r.headers.get("last-modified"), LM1); assert.equal(r.headers.get("cache-control"), "private, no-cache");
  r = await run(req("/", "US", { "if-modified-since": LM0 })); assert.equal(r.status, 304); assert.equal(r.headers.get("last-modified"), LM0);
  r = await run(req("/", "DE", { "if-modified-since": LM0 })); assert.equal(r.status, 200); assert.equal(r.headers.get("last-modified"), LM1);   // Fassung ohne Banner -> nie 304 in Region 1
  assert.equal(lastOrigin.headers.get("if-modified-since"), null);
  r = await run(req("/", "US", { "if-modified-since": LM1 })); assert.equal(r.status, 200);
  r = await run(req("/", "US", { "if-none-match": '"abc"' })); assert.equal(r.status, 200); assert.equal(r.headers.get("x-m365-cr"), "0");   // alter Browser-Cache: frische, markierte Fassung
});
test("ohne ETag: Revalidierung allein ueber Last-Modified mit Region", async () => {
  const r = await run(req("/nolm/", "US")); assert.equal(r.headers.get("etag"), null); assert.equal(r.headers.get("last-modified"), LM0);
  const r2 = await run(req("/nolm/", "US", { "if-modified-since": LM0 })); assert.equal(r2.status, 304); assert.equal(lastOrigin.headers.get("if-modified-since"), "Sun, 01 Nov 2026 10:00:59 GMT");
});
test("R2-Seite: Region, Cache, 304 mit Regions-Validatoren", async () => {
  const r = await run(req("/pl/x/", "PL")); assert.equal(r.status, 200); assert.equal(await r.text(), "<html>pl</html>");
  assert.equal(r.headers.get("x-m365-cr"), "1"); assert.equal(r.headers.get("etag"), 'W/"r2e.r1"'); assert.equal(r.headers.get("last-modified"), "Sun, 01 Nov 2026 20:00:01 GMT");
  const n = r2gets; const r2 = await run(req("/pl/x/", "PL", { "if-none-match": 'W/"r2e.r1"' })); assert.equal(r2.status, 304); assert.equal(r2gets, n, "aus dem Kanten-Cache");
  const r2b = await run(req("/pl/x/", "PL", { "if-modified-since": "Sun, 01 Nov 2026 20:00:01 GMT" })); assert.equal(r2b.status, 304);
  const r3 = await run(req("/pl/x/", "US", { "if-none-match": 'W/"r2e.r1"', "if-modified-since": "Sun, 01 Nov 2026 20:00:01 GMT" })); assert.equal(r3.status, 200); assert.equal(r3.headers.get("x-m365-cr"), "0");
});
test("R2-Datenexporte: gleiche Pfade, JSON- und Cache-Header, Blog-Import bleibt noindex", async () => {
  const blog = await run(req("/blog-import/index.json", "US"));
  assert.equal(blog.status, 200); assert.equal(await blog.text(), '{"total":7}');
  assert.equal(blog.headers.get("content-type"), "application/json; charset=utf-8");
  assert.equal(blog.headers.get("cache-control"), "public, max-age=0, s-maxage=600, stale-while-revalidate=86400");
  assert.equal(blog.headers.get("x-robots-tag"), "noindex");
  const translations = await run(req("/translations-blog.json", "US"));
  assert.equal(translations.status, 200); assert.equal(await translations.text(), '{"count":3}');
  assert.equal(translations.headers.get("content-type"), "application/json; charset=utf-8");
  assert.equal(translations.headers.get("cache-control"), "public, max-age=0, s-maxage=600, stale-while-revalidate=86400");
  assert.equal(translations.headers.get("x-robots-tag"), null);
});
test("Range auf HTML: ganze Seite statt 206; Dateien (JSON) und Assets unveraendert", async () => {
  const g = await run(req("/rng/", "DE", { range: "bytes=0-8" })); assert.equal(g.status, 200); assert.equal(await g.text(), "<html><body>full</body></html>");
  const j = await run(req("/feed.json", "DE")); assert.equal(j.headers.get("etag"), '"j1"'); assert.equal(j.headers.get("last-modified"), LM); assert.equal(j.headers.get("x-m365-cr"), null);
  const j2 = await run(req("/feed.json", "DE", { "if-modified-since": LM })); assert.equal(j2.status, 304); assert.equal(lastOrigin.headers.get("if-modified-since"), LM);
});
test("HEAD ohne Body; Assets und 404 unveraendert", async () => {
  const h = await run(req("/", "US", {}, "HEAD")); assert.equal(h.status, 200); assert.equal(h.body, null); assert.equal(h.headers.get("x-m365-cr"), "0");
  const a = await run(req("/assets/a.css", "DE")); assert.equal(a.headers.get("etag"), 'W/"css1"'); assert.equal(a.headers.get("x-m365-cr"), null); assert.match(a.headers.get("cache-control"), /max-age=3600/);
  const n = await run(req("/gibt-es-nicht/", "DE")); assert.equal(n.status, 404);
});

// R2 als Ursprung (R2_PRIMARY=1): eigene Umgebung, eigener Bucket-Nachbau mit Metadaten
const enc = (t) => new TextEncoder().encode(t).buffer;
const obj2 = (body, ct, extra = {}) => ({ httpEtag: '"r2x"', uploaded: new Date("2026-11-04T09:00:00Z"), httpMetadata: ct ? { contentType: ct } : {}, customMetadata: extra, arrayBuffer: async () => enc(body), body: new Response(body).body });
const B2 = {
  "pages/de/r2only/index.html": obj2("<html><body>r2 de</body></html>", "text/html; charset=utf-8"),
  "pages/index.html": obj2("<html><body>r2 start</body></html>", "text/html; charset=utf-8"),
  "pages/assets/site.0123456789ab.css": obj2("b{}", "text/css; charset=utf-8"),
  "pages/feed.json": obj2('{"r2":1}', "application/json; charset=utf-8"),
  "pages/alt/index.html": obj2("<html>alt</html>", "text/html; charset=utf-8", { gone: "1" }),
  "pages/old.json": obj2("{}", "application/octet-stream"),
  "pages/blog-import/index.json": obj2('{"total":9}', "application/json; charset=utf-8"),
  "pages/search/manifest.json": obj2('{"parts":1}', "application/json; charset=utf-8"),
};
let r2gets2 = 0, origins2 = 0;
const env2 = { ...env, R2_PRIMARY: "1", PAGES: { get: async (k) => { r2gets2++; return B2[k] || null; } } };
const run2 = async (r) => { const w = []; const before = lastOrigin; const res = await W.fetch(r, env2, { waitUntil: (p) => w.push(p) }); await Promise.all(w); if (lastOrigin !== before && new URL(lastOrigin.url).pathname !== "/show/redirects.json") origins2++; return res; };

test("R2 zuerst: Seite aus dem Bucket ohne Abruf bei GitHub Pages, gleiche Header, Region", async () => {
  store.clear(); origins2 = 0;
  const a = await run2(req("/de/r2only/", "DE"));
  assert.equal(a.status, 200); assert.equal(await a.text(), "<html><body>r2 de</body></html>");
  assert.equal(a.headers.get("x-m365-src"), "r2"); assert.equal(a.headers.get("x-m365-cache"), "MISS");
  assert.equal(a.headers.get("content-type"), "text/html; charset=utf-8");
  assert.equal(a.headers.get("strict-transport-security"), "max-age=31536000; includeSubDomains");
  assert.equal(origins2, 0, "kein Abruf bei GitHub Pages");
  const b = await run2(req("/de/r2only/", "US")); assert.equal(b.headers.get("x-m365-cache"), "HIT");
  assert.notEqual(a.headers.get("etag"), b.headers.get("etag"), "Validatoren je Region");
  const s = await run2(req("/", "US")); assert.equal(await s.text(), "<html><body>r2 start</body></html>"); assert.match(s.headers.get("link") || "", /api-catalog/);
});
test("R2 zuerst: Dateien mit Content-Type aus den Metadaten, gehashtes CSS ein Jahr, Exporte noindex", async () => {
  store.clear();
  const c = await run2(req("/assets/site.0123456789ab.css", "DE"));
  assert.equal(c.status, 200); assert.equal(c.headers.get("content-type"), "text/css; charset=utf-8"); assert.equal(c.headers.get("cache-control"), "public, max-age=31536000, immutable");
  const j = await run2(req("/feed.json", "DE")); assert.equal(await j.text(), '{"r2":1}'); assert.equal(j.headers.get("content-type"), "application/json; charset=utf-8");
  const o = await run2(req("/old.json", "DE")); assert.equal(o.headers.get("content-type"), "application/json; charset=utf-8", "octet-stream -> nach Endung");
  const bi = await run2(req("/blog-import/index.json", "DE")); assert.equal(bi.headers.get("x-robots-tag"), "noindex");
});
test("R2 zuerst: 304 per ETag, HEAD ohne Body", async () => {
  store.clear();
  const f = await run2(req("/feed.json", "DE", { "if-none-match": '"r2x"' })); assert.equal(f.status, 304);
  const h = await run2(req("/feed.json", "DE", {}, "HEAD")); assert.equal(h.status, 200); assert.equal(await h.text(), "");
});
test("R2 zuerst: fehlt oder als entfernt markiert -> GitHub Pages wie bisher; Fehlen wird gemerkt", async () => {
  store.clear(); origins2 = 0; r2gets2 = 0;
  const g = await run2(req("/", "US", {}, "GET")); assert.equal(g.headers.get("x-m365-src"), "r2");
  const x = await run2(req("/nolm/", "US")); assert.equal(await x.text(), "<html>x</html>"); assert.equal(x.headers.get("x-m365-src"), null); assert.equal(origins2, 1);
  const n = r2gets2; await run2(req("/nolm/", "US")); assert.equal(r2gets2, n, "Fehlen im Kanten-Cache gemerkt, kein zweiter R2-Abruf");
  const gone = await run2(req("/alt/", "US")); assert.equal(gone.status, 404, "entfernte Seite wird nicht mehr ausgeliefert");
  const rr = await W.fetch(req("/alt/", "US"), env, { waitUntil: () => {} }); assert.equal(rr.status, 404, "auch nicht ueber den alten R2-Rueckfall");
});
test("R2 zuerst: Bilder, Suchindex, Range auf Dateien und Pfade ohne Endung gehen an GitHub Pages", async () => {
  store.clear(); r2gets2 = 0;
  await run2(req("/assets/a.css", "DE", { range: "bytes=0-1" })); assert.equal(r2gets2, 0);
  await run2(req("/covers/x.png", "DE")); assert.equal(r2gets2, 0);
  assert.equal(r2Key("/de"), ""); assert.equal(r2Key("/de/"), "pages/de/index.html"); assert.equal(r2Key("/feed.json"), "pages/feed.json");
  const si = await run2(req("/search/manifest.json", "DE")); assert.equal(si.headers.get("access-control-allow-origin"), "*", "Suchindex ueber den bisherigen Weg (eigene Header)"); assert.equal(si.headers.get("x-m365-src"), null);
});
test("R2_PRIMARY aus: Seiten weiter zuerst von GitHub Pages", async () => {
  store.clear(); r2gets2 = 0;
  const e3 = { ...env2, R2_PRIMARY: "0" };
  const r = await W.fetch(req("/", "US"), e3, { waitUntil: () => {} }); assert.equal(await r.text(), "<html><body>gh</body></html>"); assert.equal(r2gets2, 0);
});
