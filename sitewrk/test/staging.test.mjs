// Site-Worker in der Testumgebung (ENVIRONMENT=staging): liefert nur aus dem Staging-Bucket, nie von GitHub Pages / vom Live-Ursprung, alles noindex.
import { test } from "node:test"; import assert from "node:assert/strict";

const calls = [];
globalThis.fetch = async (req) => { calls.push(String(req.url || req)); throw new Error("Staging darf keinen Ursprung abrufen: " + (req.url || req)); };
globalThis.caches = { default: { match: async () => undefined, put: async () => {} } };
const { default: W, isStaging, stagingFetch, STAGING_ROBOTS } = await import("../index.js");

const FILES = {
  "pages/index.html": ["<html>start</html>", {}],
  "pages/de/index.html": ["<html>de</html>", {}],
  "pages/de/show/episodes/a/index.html": ["<html>folge</html>", {}],
  "pages/sitemap.xml": ["<urlset/>", {}],
  "pages/app.js": ["x=1", { contentType: "application/javascript" }],
  "pages/img/x.bin": ["B", { contentType: "application/octet-stream" }],
  "pages/gone/index.html": ["alt", { gone: "1" }],
  "pages/404.html": ["<html>nix</html>", {}],
};
const gets = [];
const PAGES = {
  get: async (k) => {
    gets.push(k);
    const f = FILES[k]; if (!f) return null;
    return { httpEtag: '"e-' + k.length + '"', httpMetadata: f[1].contentType ? { contentType: f[1].contentType } : {}, customMetadata: f[1].gone ? { gone: "1" } : {}, body: f[0], text: async () => f[0], arrayBuffer: async () => new TextEncoder().encode(f[0]) };
  },
};
const env = { ENVIRONMENT: "staging", PAGES, MIGRATED: "0", R2_PRIMARY: "0" };
const run = (path, method = "GET", e = env, headers = {}) => W.fetch(new Request("https://staging.m365.fm" + path, { method, headers }), e, { waitUntil() {} });

test("isStaging nur bei ENVIRONMENT=staging", () => {
  assert.ok(isStaging({ ENVIRONMENT: "staging" }) && isStaging({ ENVIRONMENT: "Staging" }));
  assert.ok(!isStaging({}) && !isStaging({ ENVIRONMENT: "production" }) && !isStaging(undefined));
});

test("Startseite und Verzeichnisse kommen aus pages/ im Staging-Bucket", async () => {
  let r = await run("/"); assert.equal(r.status, 200); assert.equal(await r.text(), "<html>start</html>");
  assert.equal(r.headers.get("content-type"), "text/html; charset=utf-8");
  r = await run("/de/"); assert.equal(await r.text(), "<html>de</html>");
  r = await run("/de/show/episodes/a/"); assert.equal(await r.text(), "<html>folge</html>");
  assert.ok(gets.includes("pages/index.html") && gets.includes("pages/de/index.html"));
  assert.deepEqual(calls, [], "kein Abruf eines Ursprungs");
});

test("jede Antwort: noindex, nofollow, nie im Cache, Sicherheits-Header", async () => {
  for (const path of ["/", "/de/", "/sitemap.xml", "/gibt-es-nicht/x.html", "/robots.txt"]) {
    const r = await run(path);
    assert.equal(r.headers.get("x-robots-tag"), "noindex, nofollow", path);
    assert.equal(r.headers.get("cache-control"), "no-store", path);
    assert.equal(r.headers.get("x-m365-environment"), "staging");
    assert.equal(r.headers.get("x-content-type-options"), "nosniff");
  }
});

test("robots.txt sperrt alles, auch ohne Bucket", async () => {
  const r = await run("/robots.txt", "GET", { ENVIRONMENT: "staging" });
  assert.equal(r.status, 200); assert.equal(await r.text(), STAGING_ROBOTS); assert.match(STAGING_ROBOTS, /Disallow: \/\n/);
  assert.match(r.headers.get("content-type"), /text\/plain/);
});

test("Dateien mit Endung, Content-Type aus Bucket oder Endung", async () => {
  let r = await run("/sitemap.xml"); assert.equal(r.status, 200); assert.match(r.headers.get("content-type"), /application\/xml/);
  r = await run("/app.js"); assert.equal(r.headers.get("content-type"), "application/javascript");
  r = await run("/img/x.bin"); assert.equal(r.headers.get("content-type"), "application/octet-stream");
});

test("Verzeichnis ohne Schraegstrich: 301 mit Schraegstrich, Query bleibt", async () => {
  const r = await run("/de?x=1"); assert.equal(r.status, 301);
  assert.equal(r.headers.get("location"), "https://staging.m365.fm/de/?x=1");
});

test("fehlt oder als entfernt markiert: 404 mit der 404-Seite des Baus", async () => {
  let r = await run("/nicht/da.html"); assert.equal(r.status, 404); assert.equal(await r.text(), "<html>nix</html>");
  r = await run("/gone/"); assert.equal(r.status, 404);
});

test("nur GET und HEAD; HEAD ohne Inhalt", async () => {
  let r = await run("/", "POST"); assert.equal(r.status, 405);
  r = await run("/", "HEAD"); assert.equal(r.status, 200); assert.equal(await r.text(), "");
});

test("Pfad mit .. wird abgewiesen", async () => {
  const r = await stagingFetch(new Request("https://staging.m365.fm/a%2f..%2fb.html"), env);
  assert.equal(r.status, 400);
});

test("ohne Bucket-Bindung: 503 statt eines Rueckfalls auf Live", async () => {
  const r = await run("/", "GET", { ENVIRONMENT: "staging" });
  assert.equal(r.status, 503); assert.deepEqual(calls, []);
});

test("keine Live-Weiterleitungen und keine Sprachumleitung in Staging", async () => {
  const r = await run("/", "GET", env, { "accept-language": "de", accept: "text/html", "user-agent": "Mozilla/5.0" });
  assert.equal(r.status, 200, "Startseite bleibt Startseite");
  const old = await run("/m365-fm-podcast/etwas", "GET", { ...env, MIGRATED: "1" });
  assert.equal(old.headers.get("location"), "https://staging.m365.fm/m365-fm-podcast/etwas/", "nur der Schraegstrich, kein Sprung auf www.m365.fm/show/");
  assert.deepEqual(calls, []);
});
