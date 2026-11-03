// Site-Worker: Region (T32), Cache (T41), Validatoren - mit nachgebauter Cache API, R2 und fetch (ohne HTMLRewriter)
import { test } from "node:test"; import assert from "node:assert/strict";
import { regionOf, tagFor, conditional } from "../consent.js";
const store = new Map(); let r2gets = 0, lastOrigin = null;
globalThis.caches = { default: { match: async (r) => { const x = store.get(r.url); return x ? x.clone() : undefined; }, put: async (r, res) => { store.set(r.url, res.clone()); } } };
globalThis.fetch = async (req) => {
  const r = typeof req === "string" ? new Request(req) : req, u = new URL(r.url); lastOrigin = r;
  if (u.pathname === "/show/redirects.json") return new Response("{}", { headers: { "content-type": "application/json" } });
  const inm = r.headers.get("if-none-match"), ims = r.headers.get("if-modified-since");
  if (u.pathname === "/") { if (inm === 'W/"abc"') return new Response(null, { status: 304, headers: { etag: '"abc"' } }); return new Response("<html><body>gh</body></html>", { headers: { "content-type": "text/html; charset=utf-8", etag: '"abc"', "last-modified": "Sun, 01 Nov 2026 10:00:00 GMT" } }); }
  if (u.pathname === "/nolm/") { if (ims && Date.parse(ims) >= Date.parse("Sun, 01 Nov 2026 10:00:00 GMT")) return new Response(null, { status: 304 }); return new Response("<html>x</html>", { headers: { "content-type": "text/html; charset=utf-8", "last-modified": "Sun, 01 Nov 2026 10:00:00 GMT" } }); }
  if (u.pathname === "/assets/a.css") return new Response("a{}", { headers: { "content-type": "text/css", etag: 'W/"css1"' } });
  return new Response("404", { status: 404, headers: { "content-type": "text/html" } });
};
const { default: W } = await import("../index.js");
const PAGES = { get: async (k) => { r2gets++; return k === "pages/pl/x/index.html" ? { httpEtag: '"r2e"', uploaded: new Date("2026-11-01T20:00:00Z"), arrayBuffer: async () => new TextEncoder().encode("<html>pl</html>").buffer } : null; } };
const env = { PAGES, MIGRATED: "1", CONSENT_COUNTRIES: "DE,AT,GB,CH,NO,PL" };
const req = (path, c, h = {}, method = "GET") => { const r = new Request("https://www.m365.fm" + path, { headers: h, method }); if (c) Object.defineProperty(r, "cf", { value: { country: c } }); return r; };
const run = async (r) => { const w = []; const res = await W.fetch(r, env, { waitUntil: (p) => w.push(p) }); await Promise.all(w); return res; };

test("Region aus cf.country, Liste aus der Konfiguration, sicherer Rueckfall", () => {
  assert.equal(regionOf(req("/", "DE"), env), "1"); assert.equal(regionOf(req("/", "US"), env), "0");
  assert.equal(regionOf(req("/", "XX"), env), "1"); assert.equal(regionOf(req("/", "T1"), env), "1"); assert.equal(regionOf(req("/"), env), "1");
  assert.equal(regionOf(req("/", undefined, { "cf-ipcountry": "us" }), env), "0");
  assert.equal(regionOf(req("/", "US"), {}), "1"); assert.equal(regionOf(req("/", "US"), { CONSENT_COUNTRIES: "*" }), "1");
});
test("ETag mit Regions-Endung, auch aus Last-Modified", () => {
  assert.equal(tagFor('"abc"', null, "1"), 'W/"abc.r1"'); assert.equal(tagFor('W/"abc"', null, "0"), 'W/"abc.r0"');
  assert.equal(tagFor(null, "Sun, 01 Nov 2026 10:00:00 GMT", "0"), `W/"lm${Date.parse("Sun, 01 Nov 2026 10:00:00 GMT") / 1000}.r0"`); assert.equal(tagFor(null, null, "0"), null);
  let c = conditional(req("/", "DE", { "if-none-match": 'W/"abc.r1"', "if-modified-since": "x" }), "1");
  assert.equal(c.stripped, true); assert.equal(c.req.headers.get("if-none-match"), 'W/"abc"'); assert.equal(c.req.headers.get("if-modified-since"), null);
  c = conditional(req("/", "US", { "if-none-match": 'W/"abc.r1"' }), "0"); assert.equal(c.stripped, false); assert.equal(c.req.headers.get("if-none-match"), null);
  c = conditional(req("/", "US", { "if-none-match": '"asset1"' }), "0"); assert.equal(c.req.headers.get("if-none-match"), '"asset1"');
});
test("HTML von GitHub Pages: Region im Header, privater Cache, ETag mit Endung, kein Last-Modified", async () => {
  const r = await run(req("/", "US")); assert.equal(r.status, 200);
  assert.equal(r.headers.get("x-m365-cr"), "0"); assert.equal(r.headers.get("cache-control"), "private, no-cache");
  assert.equal(r.headers.get("etag"), 'W/"abc.r0"'); assert.equal(r.headers.get("last-modified"), null);
  const d = await run(req("/", "DE")); assert.equal(d.headers.get("x-m365-cr"), "1"); assert.equal(d.headers.get("etag"), 'W/"abc.r1"');
});
test("304 nur fuer die eigene Region", async () => {
  let r = await run(req("/", "DE", { "if-none-match": 'W/"abc.r1"' })); assert.equal(r.status, 304); assert.equal(r.headers.get("etag"), 'W/"abc.r1"');
  assert.equal(lastOrigin.headers.get("if-none-match"), 'W/"abc"');
  r = await run(req("/", "US", { "if-none-match": 'W/"abc.r1"' })); assert.equal(r.status, 200); assert.equal(r.headers.get("etag"), 'W/"abc.r0"');   // Laenderwechsel: neue Fassung
});
test("ohne ETag: Validator aus Last-Modified, Revalidierung per If-Modified-Since", async () => {
  const r = await run(req("/nolm/", "US")); const et = r.headers.get("etag"); assert.match(et, /^W\/"lm\d+\.r0"$/);
  const r2 = await run(req("/nolm/", "US", { "if-none-match": et })); assert.equal(r2.status, 304); assert.ok(lastOrigin.headers.get("if-modified-since"));
});
test("R2-Seite: Region, Cache, 304 mit Regions-ETag", async () => {
  const r = await run(req("/pl/x/", "PL")); assert.equal(r.status, 200); assert.equal(await r.text(), "<html>pl</html>");
  assert.equal(r.headers.get("x-m365-cr"), "1"); assert.equal(r.headers.get("etag"), 'W/"r2e.r1"');
  const n = r2gets; const r2 = await run(req("/pl/x/", "PL", { "if-none-match": 'W/"r2e.r1"' })); assert.equal(r2.status, 304); assert.equal(r2gets, n, "aus dem Kanten-Cache");
  const r3 = await run(req("/pl/x/", "US", { "if-none-match": 'W/"r2e.r1"' })); assert.equal(r3.status, 200); assert.equal(r3.headers.get("x-m365-cr"), "0");
});
test("HEAD ohne Body; Assets und 404 unveraendert", async () => {
  const h = await run(req("/", "US", {}, "HEAD")); assert.equal(h.status, 200); assert.equal(h.body, null); assert.equal(h.headers.get("x-m365-cr"), "0");
  const a = await run(req("/assets/a.css", "DE")); assert.equal(a.headers.get("etag"), 'W/"css1"'); assert.equal(a.headers.get("x-m365-cr"), null); assert.match(a.headers.get("cache-control"), /max-age=3600/);
  const n = await run(req("/gibt-es-nicht/", "DE")); assert.equal(n.status, 404);
});
