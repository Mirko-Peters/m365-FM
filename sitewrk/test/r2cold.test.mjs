// R2 als Ursprung im kalten Isolat (Dienstag-Check 17.11.2026, /entity/* Desktop TTFB p75 2,85 s): Ein frisch gestartetes Isolat kannte die
// Bau-Kennung nicht und nahm den Umweg GitHub Pages (404 fuer R2-only-Seiten wie /entity/*) -> R2. Jetzt legt die Pruefung ihr Ergebnis 30 s
// im Kanten-Cache ab (/__r2c/~ready, mit Pruefzeit); ein neues Isolat liest es kurz (hoechstens READY_WAIT) und bedient die Seite gleich aus R2.
// Kein Warten auf checkBuild (nie gecachter Abruf bei GitHub Pages), Rueckfall GitHub Pages wie bisher, R2_PRIMARY=0 unveraendert.
// Server-Timing zeigt den Weg (src r2/pages/r2fallback, ready mem/cache/cold/off) fuer die Messung mit url-peek bzw. curl.
import { test } from "node:test"; import assert from "node:assert/strict";
const store = new Map(); let origins = 0, buildFetches = 0, readyMatches = 0, hang = false;
const READY_URL = "https://www.m365.fm/__r2c/~ready";
globalThis.caches = { default: {
  match: async (r) => { if (r.url === READY_URL) { readyMatches++; if (hang) return new Promise(() => {}); } const x = store.get(r.url); return x ? x.clone() : undefined; },
  put: async (r, res) => { store.set(r.url, res.clone()); } } };
const HTML = { "content-type": "text/html; charset=utf-8" };
let ORIGIN_BUILD = "b1";
globalThis.fetch = async (req) => {
  const r = typeof req === "string" ? new Request(req) : req, u = new URL(r.url);
  if (u.pathname === "/show/redirects.json") return new Response("{}", { headers: { "content-type": "application/json" } });
  if (u.pathname === "/r2-build.txt") { buildFetches++; return new Response(ORIGIN_BUILD + "\n", { headers: { "content-type": "text/plain" } }); }
  origins++;
  if (u.pathname === "/show/episodes/a/") return new Response("<html>gh folge</html>", { headers: HTML });
  return new Response("<html>404</html>", { status: 404, headers: HTML });
};
const { default: W, __resetR2Ready, __r2ReadyState, READY_TTL } = await import("../index.js");
const enc = (t) => new TextEncoder().encode(t).buffer;
const obj = (body, ct, meta = {}) => ({ httpEtag: '"r2"', uploaded: new Date("2026-11-16T08:00:00Z"), httpMetadata: { contentType: ct }, customMetadata: meta, arrayBuffer: async () => enc(body), text: async () => body, get body() { return new Response(body).body; } });
const B = {
  "pages/r2-build.txt": obj("b1\n", "text/plain; charset=utf-8"),
  "pages/entity/copilot/index.html": obj("<html>r2 entity</html>", "text/html; charset=utf-8"),   // nur im Bucket (site_entities.py)
  "pages/show/episodes/a/index.html": obj("<html>r2 folge</html>", "text/html; charset=utf-8", { src: "docs" }),
};
const PAGES = { get: async (k) => B[k] || null };
const env = { PAGES, MIGRATED: "1", R2_PRIMARY: "1" };
const req = (path, h = {}) => new Request("https://www.m365.fm" + path, { headers: h });
const run = async (r, e = env) => { const w = []; const res = await W.fetch(r, e, { waitUntil: (p) => w.push(p) }); await Promise.all(w); return res; };
const shared = (v, t) => store.set(READY_URL, new Response(v, { headers: { "x-r2-build-t": String(t), "cache-control": "public, max-age=30" } }));
const fresh = () => { store.clear(); __resetR2Ready(); origins = 0; buildFetches = 0; readyMatches = 0; hang = false; ORIGIN_BUILD = "b1"; };
const st = (r) => r.headers.get("server-timing") || "";

test("Kaltes Isolat ohne geteilte Kennung: GitHub Pages (404) -> R2-Rueckfall wie bisher, Pruefung legt die Kennung im Kanten-Cache ab", async () => {
  fresh();
  const a = await run(req("/entity/copilot/"));
  assert.equal(a.status, 200); assert.equal(await a.text(), "<html>r2 entity</html>");
  assert.equal(origins, 1, "Umweg ueber GitHub Pages"); assert.equal(a.headers.get("x-m365-src"), null);
  assert.match(st(a), /src;desc="r2fallback"/); assert.match(st(a), /ready;desc="cold"/); assert.match(st(a), /origin;dur=\d+/);
  const c = store.get(READY_URL); assert.ok(c, "Kennung im Kanten-Cache"); assert.equal(await c.clone().text(), "b1");
  assert.match(c.headers.get("cache-control"), new RegExp("max-age=" + READY_TTL / 1000));
  const t = Number(c.headers.get("x-r2-build-t")); assert.ok(Math.abs(Date.now() - t) < 5000, "Pruefzeit gespeichert");
});

test("Kaltes Isolat mit geteilter Kennung: Seite sofort aus R2, kein Abruf bei GitHub Pages, keine eigene Pruefung", async () => {
  fresh(); shared("b1", Date.now() - 1000);
  const a = await run(req("/entity/copilot/"));
  assert.equal(a.status, 200); assert.equal(await a.text(), "<html>r2 entity</html>"); assert.equal(a.headers.get("x-m365-src"), "r2");
  assert.equal(origins, 0, "kein GitHub-Pages-404"); assert.equal(buildFetches, 0, "keine eigene Pruefung (Kennung ist frisch)");
  assert.match(st(a), /src;desc="r2"/); assert.match(st(a), /ready;desc="cache"/);
  const b = await run(req("/entity/copilot/"));
  assert.equal(b.headers.get("x-m365-src"), "r2"); assert.match(st(b), /ready;desc="mem"/, "danach aus dem Speicher des Isolats");
  assert.equal(readyMatches, 1, "Kanten-Cache nur einmal gelesen");
});

test("Geteilte Kennung aelter als 30 s, ungueltig oder aus einem anderen Format: nicht verwendet -> GitHub Pages und eigene Pruefung", async () => {
  for (const [v, t, why] of [["b1", Date.now() - READY_TTL - 1, "abgelaufen"], ["b1<x>", Date.now(), "ungueltige Zeichen"], ["b1", "abc", "keine Zeit"], ["b1", "", "Zeit fehlt"]]) {
    fresh(); shared(v, t);
    const a = await run(req("/show/episodes/a/"));
    assert.equal(await a.text(), "<html>gh folge</html>", why); assert.equal(a.headers.get("x-m365-src"), null, why);
    assert.match(st(a), /src;desc="pages"/, why); assert.match(st(a), /ready;desc="cold"/, why);
    assert.equal(buildFetches, 1, why + ": eigene Pruefung im Hintergrund");
    const n = await run(req("/show/episodes/a/")); assert.equal(n.headers.get("x-m365-src"), "r2", why + ": danach aus R2");
  }
});

test("Geteilte Kennung aus der Zukunft (Uhrabweichung) gilt hoechstens 30 s ab jetzt", async () => {
  fresh(); shared("b1", Date.now() + 3600000);
  const a = await run(req("/entity/copilot/")); assert.equal(a.headers.get("x-m365-src"), "r2");
  assert.ok(__r2ReadyState().t <= Date.now(), "Pruefzeit auf jetzt begrenzt");
});

test("Geteiltes Ergebnis 'nicht bereit' (Spiegel laeuft): GitHub Pages, keine zusaetzliche Pruefung in den 30 s", async () => {
  fresh(); shared("", Date.now() - 1000);
  const a = await run(req("/show/episodes/a/")); assert.equal(await a.text(), "<html>gh folge</html>"); assert.match(st(a), /ready;desc="cache"/);
  assert.equal(buildFetches, 0);
  const e = await run(req("/entity/copilot/")); assert.equal(await e.text(), "<html>r2 entity</html>"); assert.match(st(e), /src;desc="r2fallback"/, "R2-only-Seite ueber den alten Rueckfall");
});

test("Bau-Kennung passt nicht: Pruefung legt '' ab, kein R2 zuerst", async () => {
  fresh(); ORIGIN_BUILD = "b2";
  await run(req("/show/episodes/a/"));
  assert.equal(await store.get(READY_URL).clone().text(), "");
  __resetR2Ready(); origins = 0;
  const a = await run(req("/show/episodes/a/")); assert.equal(await a.text(), "<html>gh folge</html>"); assert.equal(origins, 1);
});

test("Haengender Kanten-Cache: Anfrage wartet hoechstens kurz, dann GitHub Pages wie bisher", async () => {
  fresh(); hang = true;
  const t0 = Date.now();
  const a = await W.fetch(req("/show/episodes/a/"), env, { waitUntil: () => {} });
  assert.equal(await a.text(), "<html>gh folge</html>"); assert.ok(Date.now() - t0 < 500, "kurzer Timeout (" + (Date.now() - t0) + " ms)");
  assert.match(st(a), /ready;desc="cold"/);
});

test("Haengende Pruefung der Bau-Kennung: keine Anfrage wartet darauf, auch nicht ueber den Kanten-Cache", async () => {
  fresh();
  const e = { ...env, PAGES: { get: (k) => (k === "pages/r2-build.txt" ? new Promise(() => {}) : Promise.resolve(B[k] || null)) } };
  const t0 = Date.now();
  for (let i = 0; i < 3; i++) { const r = await W.fetch(req("/show/episodes/a/"), e, { waitUntil: () => {} }); assert.equal(await r.text(), "<html>gh folge</html>"); }
  assert.ok(Date.now() - t0 < 1000); assert.equal(store.has(READY_URL), false, "nichts abgelegt");
});

test("Notschalter R2_PRIMARY=0: kein Lesen der Kennung, kein R2 zuerst, Server-Timing ready=off", async () => {
  fresh(); shared("b1", Date.now());
  const e0 = { ...env, R2_PRIMARY: "0" };
  const a = await run(req("/show/episodes/a/"), e0); assert.equal(await a.text(), "<html>gh folge</html>"); assert.equal(a.headers.get("x-m365-src"), null);
  assert.equal(readyMatches, 0); assert.equal(buildFetches, 0); assert.match(st(a), /src;desc="pages"/); assert.match(st(a), /ready;desc="off"/);
  const r = await run(req("/entity/copilot/"), e0); assert.equal(await r.text(), "<html>r2 entity</html>"); assert.match(st(r), /src;desc="r2fallback"/);
});

test("Interner Schluessel /__r2c/~ready ist keine oeffentliche Adresse; Dateien und Bilder lesen ihn nicht", async () => {
  fresh(); shared("b1", Date.now());
  const r = await run(req("/__r2c/~ready")); assert.equal(r.status, 404);
  await run(req("/covers/x.png")); assert.equal(readyMatches, 0, "Bilder nie aus R2 zuerst");
});
