// Site-Worker: Region (T32), Cache (T41), Validatoren - mit nachgebauter Cache API, R2 und fetch (ohne HTMLRewriter)
import { test } from "node:test"; import assert from "node:assert/strict";
import { regionOf, tagFor, lmFor, conditional, countries, isHtmlPath, markHtml } from "../consent.js";
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
const { default: W } = await import("../index.js");
const PAGES = { get: async (k) => { r2gets++; return k === "pages/pl/x/index.html" ? { httpEtag: '"r2e"', uploaded: new Date("2026-11-01T20:00:00Z"), arrayBuffer: async () => new TextEncoder().encode("<html>pl</html>").buffer } : null; } };
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
  assert.equal(regionOf(req("/", "GB"), env), "1"); assert.equal(regionOf(req("/", "CH"), env), "1");
  assert.equal(regionOf(req("/", "XX"), env), "1"); assert.equal(regionOf(req("/", "T1"), env), "1"); assert.equal(regionOf(req("/"), env), "1");
  assert.equal(regionOf(req("/", undefined, { "cf-ipcountry": "us" }), env), "0");
  assert.equal(regionOf(req("/", "US"), {}), "1"); assert.equal(regionOf(req("/", "US"), { CONSENT_COUNTRIES: "*" }), "1");
});
test("HTMLRewriter setzt data-cr fuer Consent- und Nicht-Consent-Laender", async () => {
  const previous = globalThis.HTMLRewriter;
  globalThis.HTMLRewriter = class {
    on(selector, handler) { this.selector = selector; this.handler = handler; return this; }
    transform(response) {
      return response.text().then((text) => {
        const attrs = {};
        this.handler.element({ setAttribute: (name, value) => { attrs[name] = value; } });
        return new Response(text.replace(/<html\b([^>]*)>/i, `<html$1 data-cr="${attrs["data-cr"]}">`), {
          status: response.status, headers: response.headers,
        });
      });
    }
  };
  try {
    for (const [country, cr] of [["DE", "1"], ["GB", "1"], ["CH", "1"], ["US", "0"]]) {
      const response = await markHtml(new Response("<html><body>x</body></html>", {
        headers: { "content-type": "text/html" },
      }), req("/", country), cr);
      assert.match(await response.text(), new RegExp(`<html data-cr="${cr}">`));
    }
  } finally {
    if (previous === undefined) delete globalThis.HTMLRewriter;
    else globalThis.HTMLRewriter = previous;
  }
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
test("R2-Cache-Schluessel bleibt unabhaengig von der Consent-Region", async () => {
  const key = "https://www.m365.fm/__r2c/pl/x/";
  store.delete(key);
  const n = r2gets;
  assert.equal((await run(req("/pl/x/", "DE"))).headers.get("x-m365-cr"), "1");
  assert.equal((await run(req("/pl/x/", "US"))).headers.get("x-m365-cr"), "0");
  assert.equal(r2gets, n + 1);
  assert.deepEqual([...store.keys()].filter((k) => k === key), [key]);
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
