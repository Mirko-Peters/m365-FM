// Sitemaps der Sprachen ausser en/de liegen nur im R2-Bucket (r2out/, site_size.r2_only): nach dem 404 von GitHub Pages aus pages/<datei>,
// indexierbar (kein noindex), application/xml, SEC-Header, Cache wie HTML, ETag/304, HEAD; auch mit R2 als Ursprung (R2_PRIMARY=1).
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
  if (u.pathname === "/sitemap-de-blog.xml") return new Response("<urlset>de</urlset>", { headers: { "content-type": "application/xml" } });
  return new Response("404", { status: 404, headers: { "content-type": "text/html" } });
};
const { default: W, SITEMAP_R2, __resetR2Ready } = await import("../index.js");
const UP = new Date("2026-11-16T08:00:00Z");
const XML = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://www.m365.fm/fr/a/</loc></url></urlset>';
const obj = (body, ct, meta = {}) => ({ httpEtag: '"s1"', uploaded: UP, httpMetadata: ct ? { contentType: ct } : {}, customMetadata: meta, arrayBuffer: async () => new TextEncoder().encode(body).buffer, text: async () => body, get body() { return new Response(body).body; } });
const B = {
  "pages/sitemap-fr-blog.xml": obj(XML, "application/xml; charset=utf-8"),
  "pages/sitemap-ja-show-episodes-2.xml": obj(XML, "application/octet-stream"),
  "pages/sitemap-ko-pages.xml": obj(XML, ""),
  "pages/sitemap-ru-blog.xml": obj("alt", "application/xml; charset=utf-8", { gone: "1" }),
  "pages/sitemap-es-entity.xml": obj("spiegel", "application/xml; charset=utf-8", { src: "docs" }),
  "pages/sitemap-en-old.xml": obj("spiegel", "application/xml; charset=utf-8", { src: "docs", gone: "1" }),
  "pages/r2-build.txt": obj("b1\n", "text/plain; charset=utf-8"),
};
const PAGES = { get: async (k) => B[k] || null };
const env = { PAGES, MIGRATED: "1" };
const req = (path, h = {}, method = "GET") => new Request("https://www.m365.fm" + path, { headers: h, method });
const run = async (r, e = env) => { const w = []; const res = await W.fetch(r, e, { waitUntil: (p) => w.push(p) }); await Promise.all(w); return res; };
const hdr = (res) => {
  assert.equal(res.headers.get("content-type"), "application/xml; charset=utf-8");
  assert.equal(res.headers.get("x-robots-tag"), null, "Sitemaps nie noindex");
  assert.equal(res.headers.get("x-content-type-options"), "nosniff"); assert.match(res.headers.get("strict-transport-security"), /max-age=/);
  assert.equal(res.headers.get("cache-control"), "public, max-age=0, s-maxage=600, stale-while-revalidate=86400");
  assert.equal(res.headers.get("access-control-allow-origin"), "*");
};

test("Regel: sitemap-<l>-<typ>[-<n>].xml im Wurzelverzeichnis; Index, Unterordner und andere Namen nicht", () => {
  for (const p of ["/sitemap-fr-blog.xml", "/sitemap-ja-show-episodes.xml", "/sitemap-ko-pages-2.xml", "/sitemap-en-entity.xml"]) assert.ok(SITEMAP_R2.test(p), p);
  for (const p of ["/sitemap.xml", "/fr/sitemap-fr-blog.xml", "/sitemap-fr.xml", "/sitemap-fra-blog.xml", "/sitemap-FR-blog.xml", "/sitemap-fr-blog.xml/", "/sitemap-fr-blog.json", "/sitemap-fr-2.xml"]) assert.ok(!SITEMAP_R2.test(p), p);
});
test("R2-Rueckfall nach 404 bei GitHub Pages: Body, Header (indexierbar, application/xml, SEC, Cache), HEAD, 304", async () => {
  store.clear();
  const s = await run(req("/sitemap-fr-blog.xml")); assert.equal(s.status, 200); hdr(s); assert.equal(await s.text(), XML);
  assert.equal(s.headers.get("etag"), '"s1"'); assert.equal(s.headers.get("last-modified"), UP.toUTCString());
  const j = await run(req("/sitemap-ja-show-episodes-2.xml")); assert.equal(j.status, 200); hdr(j);   // octet-stream in den Metadaten: trotzdem application/xml
  const k = await run(req("/sitemap-ko-pages.xml")); assert.equal(k.status, 200); hdr(k);
  const h = await run(req("/sitemap-fr-blog.xml", {}, "HEAD")); assert.equal(h.status, 200); assert.equal(h.body, null); hdr(h);
  const n = await run(req("/sitemap-fr-blog.xml", { "if-none-match": '"s1"' })); assert.equal(n.status, 304); assert.equal(n.body, null);
  const m = await run(req("/sitemap-fr-blog.xml", { "if-modified-since": new Date(UP.getTime() + 1000).toUTCString() })); assert.equal(m.status, 304);
  const q = await run(req("/sitemap-fr-blog.xml?x=1")); assert.equal(q.status, 200, "mit Query (wie GitHub Pages)");
});
test("fehlt, als entfernt markiert oder nur Spiegel von GitHub Pages -> 404; andere Methoden nicht aus R2", async () => {
  store.clear();
  for (const p of ["/sitemap-pl-blog.xml", "/sitemap-ru-blog.xml", "/sitemap-es-entity.xml", "/sitemap-en-old.xml"]) {
    const r = await run(req(p)); assert.equal(r.status, 404, p); assert.notEqual(r.headers.get("content-type"), "application/xml; charset=utf-8", p);
  }
  const post = await run(req("/sitemap-fr-blog.xml", {}, "POST")); assert.equal(post.status, 404);
});
test("Index und en/de-Sitemaps weiter von GitHub Pages, ohne noindex", async () => {
  const i = await run(req("/sitemap.xml")); assert.equal(i.status, 200); assert.equal(await i.text(), IDX); assert.equal(i.headers.get("x-robots-tag"), null);
  const d = await run(req("/sitemap-de-blog.xml")); assert.equal(d.status, 200); assert.equal(await d.text(), "<urlset>de</urlset>"); assert.equal(d.headers.get("x-robots-tag"), null);
});
test("R2 als Ursprung: Sitemap direkt aus dem Bucket (application/xml, indexierbar), ohne Abruf bei GitHub Pages", async () => {
  store.clear(); __resetR2Ready();
  const e2 = { ...env, R2_PRIMARY: "1" };
  await run(req("/x/"), e2); await new Promise((r) => setTimeout(r, 10));   // Bau-Kennung im Hintergrund pruefen
  origins = 0;
  const s = await run(req("/sitemap-fr-blog.xml"), e2); assert.equal(s.status, 200); assert.equal(s.headers.get("x-m365-src"), "r2"); hdr(s); assert.equal(await s.text(), XML);
  const j = await run(req("/sitemap-ja-show-episodes-2.xml", {}, "HEAD"), e2); assert.equal(j.status, 200); assert.equal(j.body, null); hdr(j);
  assert.equal(origins, 0, "kein Abruf bei GitHub Pages");
  const g = await run(req("/sitemap-ru-blog.xml"), e2); assert.equal(g.status, 404, "als entfernt markiert: auch mit R2 als Ursprung nicht");
});
test("partner-Subdomain: keine Sitemap", async () => {
  const r = await run(new Request("https://partner.m365.fm/sitemap-fr-blog.xml"), { ...env, PARTNER_HOST: "partner.m365.fm" }); assert.equal(r.status, 404);
});
