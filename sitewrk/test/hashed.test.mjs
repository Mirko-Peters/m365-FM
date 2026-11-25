// Gehashte Stylesheets und Skripte (Ladezeit 27.11.2026, Punkt 3): jeder Name <name>.<hex8+>.(css|js) unter /assets/ ist ein Jahr immutable, ungehashte
// Namen bleiben bei 1 h. Fehlt eine gehashte Datei bei GitHub Pages (r2out-Seiten gehen vor dem Deploy live und verweisen schon darauf), kommt sie
// aus dem Bucket (pages/assets/<name>, gone-Pruefung, Schluessel /__r2f).
import { test } from "node:test"; import assert from "node:assert/strict";
const store = new Map(); const origins = [];
globalThis.caches = { default: { match: async (r) => { const x = store.get(r.url); return x ? x.clone() : undefined; }, put: async (r, res) => { store.set(r.url, res.clone()); } } };
const cfs = [];
globalThis.fetch = async (req, init = {}) => {
  cfs.push([new URL(typeof req === "string" ? req : req.url).pathname, init.cf]);
  const r = typeof req === "string" ? new Request(req) : req, u = new URL(r.url);
  if (u.pathname === "/show/redirects.json") return new Response("{}", { headers: { "content-type": "application/json" } });
  origins.push(u.pathname);
  if (u.pathname === "/assets/page.js" || u.pathname === "/assets/page.0123abcd89.js") return new Response("gh()", { headers: { "content-type": "application/javascript" } });
  return new Response("404", { status: 404, headers: { "content-type": "text/html" } });
};
const { default: W, HASHED } = await import("../index.js");
const obj = (body, ct, meta = {}) => ({ httpEtag: '"a1"', uploaded: new Date("2026-11-27T08:00:00Z"), httpMetadata: { contentType: ct }, customMetadata: meta, arrayBuffer: async () => new TextEncoder().encode(body).buffer, get body() { return new Response(body).body; } });
const B = { "pages/assets/wk-de.abcdef0123.js": obj("r2()", "text/javascript; charset=utf-8"), "pages/assets/old.abcdef0123.js": obj("alt()", "text/javascript; charset=utf-8", { gone: "1" }) };
const gets = []; const PAGES = { get: async (k) => { gets.push(k); return B[k] || null; } };
const env = { PAGES, MIGRATED: "1", R2_PRIMARY: "0" };
const run = (p) => W.fetch(new Request("https://www.m365.fm" + p), env, { waitUntil() {} });
const IMM = "public, max-age=31536000, immutable";

test("HASHED: <name>.<hex8+>.css|js unter /assets/ (eine Ebene); ungehashte Namen, Unterordner, andere Endungen nicht", () => {
  for (const p of ["/assets/site.0123abcd45.css", "/assets/page.0123abcd89.js", "/assets/a11y.deadbeef.js", "/assets/wk-de.abcdef0123.js", "/assets/entity.0123456789abcdef.js", "/assets/cm-pt.0a1b2c3d4e.js", "/assets/sponsor_x.abcdef01.js"])
    assert.ok(HASHED.test(p), p);
  for (const p of ["/assets/page.js", "/assets/wk-de.js", "/assets/cm-de.js", "/assets/site.css", "/assets/page.abc.js", "/assets/page.0123abcg89.js", "/assets/x/page.0123abcd89.js",
    "/assets/page.0123abcd89.mjs", "/assets/fonts/inter.0123abcd89.woff2", "/js/page.0123abcd89.js", "/assets/.0123abcd89.js", "/assets/page.0123abcd89.js/x"]) assert.ok(!HASHED.test(p), p);
});

test("Cache-Control: gehasht immutable (1 Jahr), ungehasht weiter 1 h", async () => {
  const h = await run("/assets/page.0123abcd89.js"); assert.equal(h.headers.get("cache-control"), IMM);
  const u = await run("/assets/page.js"); assert.equal(u.headers.get("cache-control"), "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400");
});

test("Gehashte Datei fehlt bei GitHub Pages: aus dem Bucket (immutable, Typ, ETag), zweiter Abruf aus dem Kanten-Cache; gone oder fehlt -> 404", async () => {
  origins.length = 0; gets.length = 0;
  const a = await run("/assets/wk-de.abcdef0123.js");
  assert.equal(a.status, 200); assert.equal(await a.text(), "r2()"); assert.equal(a.headers.get("cache-control"), IMM);
  assert.equal(a.headers.get("content-type"), "text/javascript; charset=utf-8"); assert.equal(a.headers.get("etag"), '"a1"'); assert.equal(a.headers.get("x-m365-src"), "r2");
  assert.deepEqual(origins, ["/assets/wk-de.abcdef0123.js"], "erst GitHub Pages");
  assert.ok(store.has("https://www.m365.fm/__r2f/assets/wk-de.abcdef0123.js"));
  const b = await run("/assets/wk-de.abcdef0123.js"); assert.equal(await b.text(), "r2()"); assert.equal(b.headers.get("x-m365-cache"), "HIT"); assert.equal(gets.length, 1);
  for (const [p, why] of [["/assets/old.abcdef0123.js", "als entfernt markiert"], ["/assets/none.abcdef0123.js", "fehlt"], ["/assets/site.0123abcd45.css", "fehlt (css)"]]) {
    const r = await run(p);
    assert.equal(r.status, 404, why);
    assert.equal(r.headers.get("cache-control"), "public, max-age=60", why + ": 404 nie immutable (sonst ein Jahr im Browser, auch nach dem Deploy)");
  }
  assert.equal((await run("/assets/none.js")).status, 404); assert.ok(!gets.includes("pages/assets/none.js"), "ungehasht: kein Bucket-Rueckfall");
});

test("GitHub-Pages-Abruf gehashter Namen: 404 nur 60 s im Kanten-Cache (danach ist die Datei nach dem Deploy da), 200 einen Tag", async () => {
  cfs.length = 0; await run("/assets/none.abcdef0123.js"); await run("/assets/page.js");
  assert.deepEqual(cfs.find(([p]) => p === "/assets/none.abcdef0123.js")[1], { cacheEverything: true, cacheTtlByStatus: { "200-299": 86400, "404": 60, "500-599": 0 } });
  assert.deepEqual(cfs.find(([p]) => p === "/assets/page.js")[1], { cacheEverything: true, cacheTtl: 86400 }, "ungehasht wie bisher");
});
