// Site-Worker: Weiche fuer Blogs auf eigener Domain (BYOD). Ohne Schalter nie aktiv, eigene Hosts unveraendert, fremde Hosts streng geprueft.
import { test } from "node:test"; import assert from "node:assert/strict";
const calls = [];
globalThis.caches = { default: { match: async () => undefined, put: async () => {} } };
let apiReply = () => new Response("<html>blog</html>", { status: 200, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, s-maxage=300", "content-security-policy": "default-src 'none'", "set-cookie": "x=1", "x-evil": "1" } });
globalThis.fetch = async (req, init) => {
  const r = typeof req === "string" ? new Request(req) : req; calls.push(r.url);
  if (r.url.startsWith("https://api-dub.m365.fm/api/byod/serve")) return apiReply(new URL(r.url));
  const u = new URL(r.url);
  if (u.pathname === "/show/redirects.json") return new Response("{}", { headers: { "content-type": "application/json" } });
  return new Response("<html>origin</html>", { status: 200, headers: { "content-type": "text/html" } });
};
const { default: W, foreignHost } = await import("../index.js");
const on = { BYOD: "1", MIGRATED: "1" }, off = { BYOD: "0", MIGRATED: "1" };
const req = (host, path = "/", { hostHeader, method = "GET", scheme = "https" } = {}) => { const h = new Headers(); if (hostHeader !== undefined) h.set("host", hostHeader); return new Request(`${scheme}://${host}${path}`, { method, headers: h }); };
const run = (r, env) => W.fetch(r, env, { waitUntil() {} });

test("Schalter aus: Fremd-Host wird nicht beachtet (altes Verhalten), keine Abfrage an den Community-Worker", async () => {
  calls.length = 0;
  assert.equal(foreignHost(off, req("blog.kunde.de"), new URL("https://blog.kunde.de/")), "");
  assert.equal(foreignHost({}, req("blog.kunde.de"), new URL("https://blog.kunde.de/")), "");
  await run(req("blog.kunde.de", "/x/"), off);
  assert.ok(!calls.some((u) => u.includes("/api/byod/serve")));
});

test("Schalter an: eigene Hosts gehen unveraendert den alten Weg", async () => {
  for (const h of ["www.m365.fm", "m365.fm", "dub.m365.fm", "img.m365.fm", "m365con.net", "x.m365con.net"]) assert.equal(foreignHost(on, req(h), new URL(`https://${h}/`)), "", h);
  calls.length = 0;
  const r = await run(req("www.m365.fm", "/"), on);
  assert.equal(r.status, 200); assert.equal(await r.text(), "<html>origin</html>");
  assert.ok(!calls.some((u) => u.includes("/api/byod/serve")));
});

test("Schalter an: Fremd-Host fragt den Community-Worker mit Host und Pfad und reicht die Antwort mit sicheren Kopfzeilen weiter", async () => {
  calls.length = 0;
  const r = await run(req("blog.kunde.de", "/hallo-welt/?utm=1"), on);
  assert.equal(r.status, 200); assert.equal(await r.text(), "<html>blog</html>");
  assert.deepEqual(calls, ["https://api-dub.m365.fm/api/byod/serve?host=blog.kunde.de&path=%2Fhallo-welt%2F"]);   // ohne Query der Anfrage
  assert.equal(r.headers.get("content-security-policy"), "default-src 'none'");
  assert.equal(r.headers.get("set-cookie"), null); assert.equal(r.headers.get("x-evil"), null);
  assert.equal(r.headers.get("strict-transport-security"), "max-age=31536000");   // ohne includeSubDomains: die Domain gehoert dem Mitglied
  assert.equal(r.headers.get("x-content-type-options"), "nosniff"); assert.equal(r.headers.get("x-frame-options"), "DENY");
});

test("Host-Header-Tricks und ungueltige Hosts: 421, nie eine Abfrage", async () => {
  calls.length = 0;
  const r1 = await run(req("blog.kunde.de", "/", { hostHeader: "www.m365.fm" }), on);
  assert.equal(r1.status, 421);
  const r2 = await run(req("blog.kunde.de", "/", { hostHeader: "evil.com" }), on); assert.equal(r2.status, 421);
  assert.equal(foreignHost(on, req("1.2.3.4"), new URL("https://1.2.3.4/")), "bad");
  assert.equal(foreignHost(on, req("localhost"), new URL("https://localhost/")), "bad");
  assert.equal(foreignHost(on, req("blog.kunde.de", "/", { hostHeader: "blog.kunde.de:443" }), new URL("https://blog.kunde.de/")), "blog.kunde.de");
  assert.equal(foreignHost(on, req("Blog.Kunde.DE"), new URL("https://Blog.Kunde.DE/")), "blog.kunde.de");
  assert.ok(!calls.some((u) => u.includes("/api/byod/serve")));
});

test("Unbekannte Domain: neutrales 404 des Community-Workers, keine Weiterleitung; Fehler des Community-Workers: 503 ohne Cache", async () => {
  apiReply = () => new Response("Not found", { status: 404, headers: { "content-type": "text/plain" } });
  const r = await run(req("unbekannt.kunde.de"), on); assert.equal(r.status, 404); assert.equal(r.headers.get("location"), null);
  apiReply = () => new Response("boom", { status: 500 });
  const e = await run(req("blog.kunde.de"), on); assert.equal(e.status, 503); assert.equal(e.headers.get("cache-control"), "no-store");
  apiReply = () => { throw new Error("netz"); };
  const t = await run(req("blog.kunde.de"), on); assert.equal(t.status, 503);
});

test("Weiterleitung nur als Pfad auf dieselbe Domain; fremde Ziele werden verworfen", async () => {
  apiReply = () => new Response(null, { status: 301, headers: { location: "/hallo-welt/" } });
  const ok = await run(req("blog.kunde.de", "/hallo-welt"), on);
  assert.equal(ok.status, 301); assert.equal(ok.headers.get("location"), "https://blog.kunde.de/hallo-welt/");
  for (const evil of ["https://evil.com/", "//evil.com/", "/\\evil.com", "javascript:alert(1)"]) {
    apiReply = () => new Response(null, { status: 301, headers: { location: evil } });
    const r = await run(req("blog.kunde.de", "/x"), on); assert.equal(r.status, 404, evil); assert.equal(r.headers.get("location"), null);
  }
});

test("Nur GET und HEAD; http wird auf https derselben Domain umgestellt", async () => {
  const p = await run(req("blog.kunde.de", "/", { method: "POST" }), on); assert.equal(p.status, 405); assert.equal(p.headers.get("allow"), "GET, HEAD");
  const h = await run(req("blog.kunde.de", "/a/", { scheme: "http" }), on);
  assert.equal(h.status, 301); assert.equal(h.headers.get("location"), "https://blog.kunde.de/a/");
  apiReply = () => new Response("<html>blog</html>", { status: 200, headers: { "content-type": "text/html" } });
  const hd = await run(req("blog.kunde.de", "/", { method: "HEAD" }), on); assert.equal(hd.status, 200); assert.equal(await hd.text(), "");
});

test("Service-Binding COMMUNITY hat Vorrang vor dem oeffentlichen Abruf", async () => {
  calls.length = 0; let seen = "";
  const env = { ...on, COMMUNITY: { fetch: async (r) => { seen = r.url; return new Response("<html>sb</html>", { headers: { "content-type": "text/html" } }); } } };
  const r = await run(req("blog.kunde.de", "/"), env);
  assert.equal(await r.text(), "<html>sb</html>"); assert.match(seen, /\/api\/byod\/serve\?host=blog\.kunde\.de&path=%2F$/); assert.equal(calls.length, 0);
});
