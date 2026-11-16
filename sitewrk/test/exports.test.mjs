// Grosse Datenexporte liegen seit 16.11.2026 nur im R2-Bucket (r2out/, site_size.EXPORT_RX): Register fuer die Datenbank, og-manifest.json, seo-report.json.
// Nach dem 404 von GitHub Pages aus pages/<datei>: application/json, noindex genau wie bisher (noindexPath), SEC-Header, Cache wie HTML, CORS, ETag/304, HEAD;
// nie als entfernt markierte Objekte (gone=1) oder Spiegel von GitHub Pages (src=docs); auch mit R2 als Ursprung (R2_PRIMARY=1).
import { test } from "node:test"; import assert from "node:assert/strict";
const store = new Map(); let origins = 0;
globalThis.caches = { default: { match: async (r) => { const x = store.get(r.url); return x ? x.clone() : undefined; }, put: async (r, res) => { store.set(r.url, res.clone()); } } };
const IDX = '<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></sitemapindex>';
globalThis.fetch = async (req) => {
  const r = typeof req === "string" ? new Request(req) : req, u = new URL(r.url);
  if (u.pathname === "/show/redirects.json") return new Response("{}", { headers: { "content-type": "application/json" } });
  if (u.pathname === "/r2-build.txt") return new Response("b1\n", { headers: { "content-type": "text/plain" } });
  origins++;
  if (u.pathname === "/sitemap.xml") return new Response(IDX, { headers: { "content-type": "application/xml" } });
  if (u.pathname === "/episodes.json") return new Response('{"count":1}', { headers: { "content-type": "application/json; charset=utf-8", "access-control-allow-origin": "*" } });
  if (u.pathname === "/agent.json") return new Response('{"name":"a"}', { headers: { "content-type": "application/json; charset=utf-8" } });
  return new Response("404", { status: 404, headers: { "content-type": "text/html" } });
};
const { default: W, R2_EXPORT, __resetR2Ready } = await import("../index.js");
const UP = new Date("2026-11-16T08:00:00Z");
const J = '{"generated":"2026-11-16","episodes":[]}';
const obj = (body, ct, meta = {}) => ({ httpEtag: '"e1"', uploaded: UP, httpMetadata: ct ? { contentType: ct } : {}, customMetadata: meta, arrayBuffer: async () => new TextEncoder().encode(body).buffer, text: async () => body, get body() { return new Response(body).body; } });
const B = {
  "pages/episodes-register.json": obj('{"parts":5}', "application/json; charset=utf-8"),
  "pages/episodes-register-3.json": obj(J, "application/octet-stream"),
  "pages/translations-register-ja.json": obj(J, ""),
  "pages/translations-register.json": obj(J, "application/json; charset=utf-8"),
  "pages/og-manifest.json": obj("[]", "application/json; charset=utf-8"),
  "pages/seo-report.json": obj("{}", "application/json; charset=utf-8"),
  "pages/translations-blog.json": obj('{"count":3}', "application/json; charset=utf-8"),
  "pages/episodes-register-4.json": obj("alt", "application/json; charset=utf-8", { gone: "1" }),
  "pages/translations-register-de.json": obj("spiegel", "application/json; charset=utf-8", { src: "docs" }),
  "pages/blog-import/part-9.json": obj("weg", "application/json; charset=utf-8", { gone: "1" }),
  "pages/episodes.json": obj('{"count":0}', "application/json; charset=utf-8"),
  "pages/r2-build.txt": obj("b1\n", "text/plain; charset=utf-8"),
};
const PAGES = { get: async (k) => B[k] || null };
const env = { PAGES, MIGRATED: "1" };
const req = (path, h = {}, method = "GET") => new Request("https://www.m365.fm" + path, { headers: h, method });
const run = async (r, e = env) => { const w = []; const res = await W.fetch(r, e, { waitUntil: (p) => w.push(p) }); await Promise.all(w); return res; };
const hdr = (res) => {
  assert.equal(res.headers.get("content-type"), "application/json; charset=utf-8");
  assert.equal(res.headers.get("x-robots-tag"), "noindex", "Datenexporte noindex wie aus GitHub Pages");
  assert.equal(res.headers.get("x-content-type-options"), "nosniff"); assert.match(res.headers.get("strict-transport-security"), /max-age=/);
  assert.equal(res.headers.get("cache-control"), "public, max-age=0, s-maxage=600, stale-while-revalidate=86400");
  assert.equal(res.headers.get("access-control-allow-origin"), "*");
  assert.equal(res.headers.get("x-m365-exports"), "r2");
};
const MOVED = ["/episodes-register.json", "/episodes-register-3.json", "/translations-register-ja.json", "/translations-register.json", "/og-manifest.json", "/seo-report.json"];

test("Regel: umgezogene Exporte, Blog-Import und Blog-Uebersetzungen; nicht episodes.json, entities.json, agent.json, Unterordner oder andere Namen", () => {
  for (const p of [...MOVED, "/episodes-register-12.json", "/translations-register-uk.json", "/translations-blog.json", "/blog-import/index.json", "/blog-import/part-3.json"]) assert.ok(R2_EXPORT.test(p), p);
  for (const p of ["/episodes.json", "/entities.json", "/entities-src.json", "/agent.json", "/openapi.json", "/top.json", "/fr/og-manifest.json", "/og-manifest.jsonl",
    "/episodes-register-x.json", "/episodes-register-1234.json", "/translations-register-jpn.json", "/translations-register-JA.json", "/seo-report.json/", "/blog-import/a/b.json", "/sitemap-fr-blog.xml"]) assert.ok(!R2_EXPORT.test(p), p);
});
test("R2-Rueckfall nach 404 bei GitHub Pages: Body, Header (application/json, noindex, SEC, Cache, CORS), HEAD, 304", async () => {
  store.clear();
  for (const p of MOVED) { const r = await run(req(p)); assert.equal(r.status, 200, p); hdr(r); assert.equal(r.headers.get("etag"), '"e1"'); assert.equal(r.headers.get("last-modified"), UP.toUTCString()); }
  assert.equal(await (await run(req("/episodes-register.json"))).text(), '{"parts":5}');
  assert.equal(await (await run(req("/episodes-register-3.json"))).text(), J, "octet-stream in den Metadaten: trotzdem application/json");
  const t = await run(req("/translations-blog.json")); assert.equal(t.status, 200); hdr(t); assert.equal(await t.text(), '{"count":3}');
  const h = await run(req("/og-manifest.json", {}, "HEAD")); assert.equal(h.status, 200); assert.equal(h.body, null); hdr(h);
  const n = await run(req("/seo-report.json", { "if-none-match": '"e1"' })); assert.equal(n.status, 304); assert.equal(n.body, null); assert.equal(n.headers.get("etag"), '"e1"');
  const m = await run(req("/og-manifest.json", { "if-modified-since": new Date(UP.getTime() + 1000).toUTCString() })); assert.equal(m.status, 304);
  const o = await run(req("/og-manifest.json", { "if-modified-since": new Date(UP.getTime() - 1000).toUTCString() })); assert.equal(o.status, 200);
  const q = await run(req("/episodes-register.json?x=1")); assert.equal(q.status, 200, "mit Query (wie GitHub Pages)");
});
test("fehlt, als entfernt markiert oder nur Spiegel von GitHub Pages -> 404; andere Methoden nicht aus R2", async () => {
  store.clear();
  for (const p of ["/episodes-register-9.json", "/episodes-register-4.json", "/translations-register-de.json", "/blog-import/part-9.json"]) {
    const r = await run(req(p)); assert.equal(r.status, 404, p); assert.notEqual(r.headers.get("content-type"), "application/json; charset=utf-8", p);
  }
  const post = await run(req("/og-manifest.json", {}, "POST")); assert.equal(post.status, 404);
});
test("episodes.json und agent.json bleiben in GitHub Pages und indexierbar; R2 wird dafuer nicht gefragt", async () => {
  const e = await run(req("/episodes.json")); assert.equal(e.status, 200); assert.equal(await e.text(), '{"count":1}'); assert.equal(e.headers.get("x-robots-tag"), null);
  assert.equal(e.headers.get("x-m365-exports"), null);
  const a = await run(req("/agent.json")); assert.equal(a.status, 200); assert.equal(a.headers.get("x-robots-tag"), null);
});
test("Merker x-m365-exports: r2 (Pruefung im Deploy-Job von site.yml) zusammen mit x-m365-sitemaps auf dem Index, auch per HEAD und mit Query", async () => {
  for (const r of [req("/sitemap.xml"), req("/sitemap.xml?worker-check=1", {}, "HEAD")]) {
    const res = await run(r); assert.equal(res.status, 200, r.url); assert.equal(res.headers.get("x-m365-exports"), "r2", r.url); assert.equal(res.headers.get("x-m365-sitemaps"), "r2", r.url);
  }
  for (const p of ["/", "/fr/", "/feed.xml", "/episodes.json"]) assert.equal((await run(req(p))).headers.get("x-m365-exports"), null, p);
});
test("R2 als Ursprung: Exporte direkt aus dem Bucket (application/json, noindex, CORS), ohne Abruf bei GitHub Pages; entfernt markierte nicht", async () => {
  store.clear(); __resetR2Ready();
  const e2 = { ...env, R2_PRIMARY: "1" };
  await run(req("/x/"), e2); await new Promise((r) => setTimeout(r, 10));   // Bau-Kennung im Hintergrund pruefen
  origins = 0;
  const s = await run(req("/episodes-register-3.json"), e2); assert.equal(s.status, 200); assert.equal(s.headers.get("x-m365-src"), "r2"); hdr(s); assert.equal(await s.text(), J);
  const j = await run(req("/og-manifest.json", {}, "HEAD"), e2); assert.equal(j.status, 200); assert.equal(j.body, null); hdr(j);
  assert.equal(origins, 0, "kein Abruf bei GitHub Pages");
  const g = await run(req("/episodes-register-4.json"), e2); assert.equal(g.status, 404, "als entfernt markiert: auch mit R2 als Ursprung nicht");
});
