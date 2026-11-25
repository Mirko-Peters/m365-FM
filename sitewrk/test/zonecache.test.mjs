// R2 ueber den Zonen-Cache (Schalter R2_ZONE_CACHE, Ladezeit 27.11.2026, Punkt 2): mit "1" holt r2First (R2 als Ursprung, Pfad-Kennung "-pfad") Seiten und
// Dateien zuerst als normalen Zonen-Abruf von der oeffentlichen R2-Domain (live img.m365.fm, Staging img-staging.m365.fm) statt ueber die Cache API.
// Nur Treffer (200) kommen von dort; 404, Entfernt-Marker, 5xx, Fehler, Zeitlimit oder ein Worker statt R2 -> in derselben Anfrage der heutige Weg
// (Cache API + Bindung mit customMetadata.gone). Schalter aus (live "0"): kein einziger Zonen-Abruf.
import { test } from "node:test"; import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const store = new Map();
globalThis.caches = { default: { match: async (r) => { const x = store.get(r.url); return x ? x.clone() : undefined; }, put: async (r, res) => { store.set(r.url, res.clone()); } } };
const HTML = { "content-type": "text/html; charset=utf-8" };
const zoneCalls = [], origins = [];
let zoneMode = "ok";   // ok | 404 | 500 | throw | hang | guard | gone-cc | gone-amz
const ZONE = {   // Objekte der oeffentlichen R2-Domain (Inhalt, Content-Type, Cache-Control wie im Bucket gespeichert)
  "https://img.m365.fm/pages/entity/copilot/index.html": ["<html>zone entity</html>", "text/html; charset=utf-8"],
  "https://img.m365.fm/pages/ru/tag/%D0%BE%D0%B1%D0%BB%D0%B0%D0%BA%D0%BE/index.html": ["<html>zone ru</html>", "text/html; charset=utf-8"],
  "https://img.m365.fm/pages/feed.json": ['{"z":1}', "application/octet-stream"],
  "https://img-staging.m365.fm/pages/de/index.html": ["<html>zone staging de</html>", "text/html; charset=utf-8"],
};
globalThis.fetch = async (req, init = {}) => {
  const r = typeof req === "string" ? new Request(req) : req, u = new URL(r.url);
  if (u.hostname === "img.m365.fm" || u.hostname === "img-staging.m365.fm") {
    zoneCalls.push({ url: r.url, cf: init.cf, headers: [...r.headers.keys()], method: r.method });
    if (zoneMode === "throw") throw new Error("connect");
    if (zoneMode === "hang") return new Promise(() => {});
    if (zoneMode === "500") return new Response("err", { status: 522 });
    if (zoneMode === "guard") return new Response("Not found", { status: 404, headers: { "x-m365-guard": "1" } });
    const o = ZONE[r.url];
    if (!o || zoneMode === "404") return new Response("<Error>NoSuchKey</Error>", { status: 404 });
    const h = { "content-type": o[1], etag: '"zone-etag"', "last-modified": "Mon, 16 Nov 2026 08:00:00 GMT", "cache-control": "public, max-age=600", "cf-cache-status": "HIT" };
    if (zoneMode === "gone-cc") h["cache-control"] = "public, max-age=600, m365-gone";
    if (zoneMode === "gone-amz") h["x-amz-meta-gone"] = "1";
    return new Response(o[0], { headers: h });
  }
  if (u.pathname === "/show/redirects.json") return new Response("{}", { headers: { "content-type": "application/json" } });
  if (u.pathname === "/r2-build.txt") return new Response("b1-pfad\n", { headers: { "content-type": "text/plain" } });
  origins.push(u.pathname);
  return new Response("<html>404</html>", { status: 404, headers: HTML });
};
const { default: W, __resetR2Ready, __resetZone, zoneHost, zoneTtl, zoneUrl, goneMarked, r2Key, ZONE_HOSTS, stagingFetch } = await import("../index.js");
const enc = (t) => new TextEncoder().encode(t).buffer;
const obj = (body, ct, meta = {}) => ({ httpEtag: '"bind"', uploaded: new Date("2026-11-16T08:00:00Z"), httpMetadata: { contentType: ct }, customMetadata: meta, arrayBuffer: async () => enc(body), text: async () => body, get body() { return new Response(body).body; } });
const B = {
  "pages/r2-build.txt": obj("b1-pfad\n", "text/plain"),
  "pages/entity/copilot/index.html": obj("<html>bind entity</html>", "text/html; charset=utf-8"),
  "pages/ru/tag/облако/index.html": obj("<html>bind ru</html>", "text/html; charset=utf-8"),
  "pages/feed.json": obj('{"b":1}', "application/json"),
  "pages/de/index.html": obj("<html>bind staging de</html>", "text/html; charset=utf-8"),
};
const gets = [];
let goneInBucket = false;
const PAGES = { get: async (k) => { gets.push(k); const o = B[k]; if (o && goneInBucket && k !== "pages/r2-build.txt") return { ...o, customMetadata: { gone: "1" } }; return o || null; } };
const LIVE = { PAGES, MIGRATED: "1", R2_PRIMARY: "1", R2_EDGE_TTL: "86400", R2_ZONE_CACHE: "1", R2_ZONE_HOST: "https://img.m365.fm", R2_ZONE_TTL: "3600" };
const STG = { ENVIRONMENT: "staging", PAGES, MIGRATED: "0", R2_PRIMARY: "0", R2_ZONE_CACHE: "1", R2_ZONE_HOST: "https://img-staging.m365.fm", R2_ZONE_TTL: "300" };
const READY_URL = "https://www.m365.fm/__r2c/~ready";
const warm = () => store.set(READY_URL, new Response("b1-pfad", { headers: { "x-r2-build-t": String(Date.now() - 1000) } }));
const fresh = (mode = "ok") => { store.clear(); __resetR2Ready(); __resetZone(); zoneMode = mode; zoneCalls.length = 0; origins.length = 0; gets.length = 0; goneInBucket = false; warm(); };
const req = (p, h = {}, method = "GET", host = "www.m365.fm") => new Request("https://" + host + p, { method, headers: h });
const run = async (r, e = LIVE) => { const w = []; const res = await W.fetch(r, e, { waitUntil: (p) => w.push(p) }); await Promise.all(w); return res; };
const st = (r) => r.headers.get("server-timing") || "";
const pageGets = () => gets.filter((k) => k !== "pages/r2-build.txt");

test("zoneHost: nur mit Schalter \"1\" und genau dem Host der Umgebung (live img, Staging img-staging, nie gekreuzt)", () => {
  assert.equal(zoneHost(LIVE), "https://img.m365.fm");
  assert.equal(zoneHost({ ...LIVE, R2_ZONE_HOST: "https://img.m365.fm/" }), "https://img.m365.fm");
  assert.equal(zoneHost(STG), "https://img-staging.m365.fm");
  for (const e of [{ ...LIVE, R2_ZONE_CACHE: "0" }, { ...LIVE, R2_ZONE_CACHE: undefined }, { ...LIVE, R2_ZONE_HOST: "https://img-staging.m365.fm" }, { ...LIVE, R2_ZONE_HOST: "https://evil.example" },
    { ...LIVE, R2_ZONE_HOST: "" }, { ...STG, R2_ZONE_HOST: "https://img.m365.fm" }, { ...STG, R2_ZONE_HOST: "http://img-staging.m365.fm" }, undefined]) assert.equal(zoneHost(e), "", JSON.stringify(e));
  assert.deepEqual(ZONE_HOSTS, { live: "https://img.m365.fm", staging: "https://img-staging.m365.fm" });
});

test("zoneUrl: gemeinsame Faelle mit tools/purge_changed.py (zone_cases.json); URL-Parser aendert nichts; Punkt-Segmente -> kein Zonen-Weg", () => {
  const C = JSON.parse(readFileSync(new URL("./zone_cases.json", import.meta.url), "utf8")).cases;
  assert.ok(C.length >= 10);
  for (const c of C) {
    assert.equal(r2Key(c.path), c.key, c.path);
    assert.equal(zoneUrl(ZONE_HOSTS.live, c.key), c.url, c.path);
    if (c.url) { assert.equal(new URL(c.url).href, c.url, c.path + ": unveraendert durch den URL-Parser"); assert.ok(new URL(c.url).pathname.startsWith("/pages/"), c.path); }
  }
  assert.equal(zoneUrl(ZONE_HOSTS.live, "meta/gone.json"), "", "nur pages/");
  assert.equal(zoneUrl("", "pages/a/index.html"), "");
});

test("zoneTtl begrenzt nach oben, ungueltig -> Wert des heutigen Wegs; goneMarked", () => {
  assert.equal(zoneTtl({ R2_ZONE_TTL: "3600" }, 86400), 3600); assert.equal(zoneTtl({ R2_ZONE_TTL: "3600" }, 600), 600);
  for (const v of ["", "abc", "10", "999999999", "1.5"]) assert.equal(zoneTtl({ R2_ZONE_TTL: v }, 86400), 86400, v);
  const H = (o) => new Headers(o);
  assert.ok(goneMarked(H({ "cache-control": "public, max-age=600, m365-gone" }))); assert.ok(goneMarked(H({ "cache-control": "m365-gone" }))); assert.ok(goneMarked(H({ "x-amz-meta-gone": "1" })));
  assert.ok(!goneMarked(H({ "cache-control": "public, max-age=600" }))); assert.ok(!goneMarked(H({ "cache-control": "x-m365-gone-not" }))); assert.ok(!goneMarked(H({})));
});

test("Schalter aus (live \"0\" bzw. ohne Variable): kein Zonen-Abruf, R2 wie bisher ueber Cache API und Bindung", async () => {
  for (const e of [{ ...LIVE, R2_ZONE_CACHE: "0" }, { ...LIVE, R2_ZONE_CACHE: undefined, R2_ZONE_HOST: undefined }]) {
    fresh();
    const a = await run(req("/entity/copilot/"), e);
    assert.equal(await a.text(), "<html>bind entity</html>"); assert.equal(a.headers.get("x-m365-src"), "r2"); assert.equal(zoneCalls.length, 0);
    assert.doesNotMatch(st(a), /zc;/); assert.ok(store.has("https://www.m365.fm/__r2f/entity/copilot/"));
  }
});

test("Schalter an: Seite aus dem Zonen-Cache, ohne Client-Header, mit cf-Optionen; keine Bindung, kein Cache-API-Eintrag", async () => {
  fresh();
  const a = await run(req("/entity/copilot/", { cookie: "m365_lang=de", range: "bytes=0-10", "accept-language": "de", authorization: "x" }));
  assert.equal(a.status, 200); assert.equal(await a.text(), "<html>zone entity</html>");
  assert.equal(a.headers.get("x-m365-src"), "r2"); assert.equal(a.headers.get("x-m365-cache"), "Z-HIT"); assert.equal(a.headers.get("etag"), '"zone-etag"');
  assert.equal(a.headers.get("content-type"), "text/html; charset=utf-8"); assert.equal(a.headers.get("cache-control"), "public, max-age=0, s-maxage=600, stale-while-revalidate=86400");
  assert.match(st(a), /src;desc="r2"/); assert.match(st(a), /zc;desc="HIT"/);
  assert.equal(zoneCalls.length, 1); const z = zoneCalls[0];
  assert.equal(z.url, "https://img.m365.fm/pages/entity/copilot/index.html"); assert.equal(z.method, "GET");
  assert.deepEqual(z.headers, [], "keine Client-Header (Cookie, Range, Accept-Language)");
  assert.equal(z.cf.cacheEverything, true); assert.deepEqual(z.cf.cacheTtlByStatus, { "200-299": 3600, "404": 600, "500-599": 0 });
  assert.deepEqual(pageGets(), [], "kein Lesen ueber die Bindung");
  assert.ok(![...store.keys()].some((k) => k.includes("/__r2f")), "nichts in der Cache API");
});

test("Schalter an: Unicode-Pfad kodiert wie im Purge; Datei mit octet-stream bekommt den Typ aus der Endung", async () => {
  fresh();
  const a = await run(req("/ru/tag/%D0%BE%D0%B1%D0%BB%D0%B0%D0%BA%D0%BE/")); assert.equal(await a.text(), "<html>zone ru</html>");
  assert.equal(zoneCalls[0].url, "https://img.m365.fm/pages/ru/tag/%D0%BE%D0%B1%D0%BB%D0%B0%D0%BA%D0%BE/index.html");
  const f = await run(req("/feed.json")); assert.equal(await f.text(), '{"z":1}'); assert.equal(f.headers.get("content-type"), "application/json; charset=utf-8");
  assert.equal(f.headers.get("x-robots-tag"), "noindex", "finishHeaders wie bisher");
});

test("Schalter an: ETag/304 und HEAD wie bisher", async () => {
  fresh();
  const c = await run(req("/entity/copilot/", { "if-none-match": '"zone-etag"' })); assert.equal(c.status, 304); assert.equal(c.body, null);
  const h = await run(req("/entity/copilot/", {}, "HEAD")); assert.equal(h.status, 200); assert.equal(h.body, null); assert.equal(h.headers.get("etag"), '"zone-etag"');
});

test("Entfernt-Marker (Cache-Control m365-gone oder x-amz-meta-gone): heutiger Weg, Bindung prueft gone -> GitHub Pages wie bisher", async () => {
  for (const mode of ["gone-cc", "gone-amz"]) {
    fresh(mode); goneInBucket = true;
    const a = await run(req("/entity/copilot/"));
    assert.equal(a.status, 404, mode); assert.deepEqual(origins, ["/entity/copilot/"], mode + ": GitHub Pages"); assert.deepEqual(pageGets(), ["pages/entity/copilot/index.html"], mode + ": Bindung genau einmal");
    assert.match(st(a), /src;desc="pages"/, mode);
  }
});

test("404 der Zone: heutiger Weg (Bindung entscheidet) - findet die Bindung das Objekt, kommt es von dort", async () => {
  fresh("404");
  const a = await run(req("/entity/copilot/")); assert.equal(await a.text(), "<html>bind entity</html>"); assert.match(st(a), /zc;desc="404"/);
  assert.deepEqual(pageGets(), ["pages/entity/copilot/index.html"]); assert.equal(origins.length, 0);
  const b = await run(req("/entity/copilot/")); assert.equal(zoneCalls.length, 2, "404 pausiert den Weg nicht");
});

test("Fehler, 5xx, Zeitlimit, Worker statt R2: dieselbe Anfrage nimmt den heutigen Weg; danach Pause je Isolat", async () => {
  for (const mode of ["throw", "500", "guard", "hang"]) {
    fresh(mode); __resetZone(mode === "hang" ? 50 : 3000);
    const t0 = Date.now();
    const a = await run(req("/entity/copilot/"));
    assert.equal(await a.text(), "<html>bind entity</html>", mode); assert.equal(a.headers.get("x-m365-cache"), "MISS", mode);
    assert.match(st(a), new RegExp(`zc;desc="${{ throw: "error", 500: "522", guard: "worker", hang: "timeout" }[mode]}"`), mode);
    assert.ok(Date.now() - t0 < 1000, mode + ": kein langes Warten");
    const b = await run(req("/entity/copilot/"));
    assert.equal(await b.text(), "<html>bind entity</html>", mode); assert.equal(zoneCalls.length, 1, mode + ": Pause, kein zweiter Zonen-Abruf"); assert.match(st(b), /zc;desc="paused"/, mode);
  }
});

test("Bau-Kennung ohne -pfad: kein Zonen-Weg (Schluessel ohne Bau-Kennung wuerde nie geleert)", async () => {
  fresh(); store.set(READY_URL, new Response("b1", { headers: { "x-r2-build-t": String(Date.now() - 1000) } }));
  const B0 = B["pages/r2-build.txt"]; B["pages/r2-build.txt"] = obj("b1\n", "text/plain");
  try {
    const a = await run(req("/entity/copilot/")); assert.equal(await a.text(), "<html>bind entity</html>"); assert.equal(zoneCalls.length, 0);
  } finally { B["pages/r2-build.txt"] = B0; }
});

test("Kalt (r2Page, prueft auch src=docs) bleibt auf der Cache API", async () => {
  fresh(); store.clear();
  const a = await run(req("/entity/copilot/")); assert.equal(await a.text(), "<html>bind entity</html>"); assert.match(st(a), /src;desc="r2direct"/); assert.equal(zoneCalls.length, 0);
});

test("img.m365.fm oeffentlich: /pages/* und /meta/* bleiben 404 mit Merker x-m365-guard", async () => {
  fresh();
  for (const p of ["/pages/entity/copilot/index.html", "/meta/gone.json"]) {
    const r = await run(req(p, {}, "GET", "img.m365.fm")); assert.equal(r.status, 404, p); assert.equal(r.headers.get("x-m365-guard"), "1"); assert.equal(zoneCalls.length, 0);
  }
});

test("Staging: Zonen-Weg ueber img-staging.m365.fm (nie img.m365.fm), no-store/noindex; Fehlschlag -> Bindung; img-staging oeffentlich 404", async () => {
  fresh();
  const a = await stagingFetch(req("/de/", {}, "GET", "staging.m365.fm"), STG);
  assert.equal(await a.text(), "<html>zone staging de</html>"); assert.equal(a.headers.get("cache-control"), "no-store"); assert.equal(a.headers.get("x-robots-tag"), "noindex, nofollow");
  assert.equal(a.headers.get("server-timing"), 'zc;desc="HIT"'); assert.equal(a.headers.get("etag"), '"zone-etag"');
  assert.deepEqual(zoneCalls.map((z) => z.url), ["https://img-staging.m365.fm/pages/de/index.html"]); assert.equal(zoneCalls[0].cf.cacheTtlByStatus["200-299"], 300);
  assert.deepEqual(pageGets(), []);
  fresh("404");
  const b = await stagingFetch(req("/de/", {}, "GET", "staging.m365.fm"), STG); assert.equal(await b.text(), "<html>bind staging de</html>"); assert.equal(b.headers.get("server-timing"), 'zc;desc="fb-404"');
  fresh();
  const c = await stagingFetch(req("/de/", {}, "GET", "staging.m365.fm"), { ...STG, R2_ZONE_HOST: "https://img.m365.fm" }); assert.equal(await c.text(), "<html>bind staging de</html>"); assert.equal(zoneCalls.length, 0, "Live-Host in Staging: aus");
  const g = await W.fetch(req("/pages/de/index.html", {}, "GET", "img-staging.m365.fm"), STG, { waitUntil() {} });
  assert.equal(g.status, 404); assert.equal(g.headers.get("x-m365-guard"), "1"); assert.equal(g.headers.get("x-m365-environment"), "staging");
  fresh("gone-cc"); goneInBucket = true;
  const d = await stagingFetch(req("/de/", {}, "GET", "staging.m365.fm"), STG); assert.equal(d.status, 404, "Marker -> Bindung -> gone -> 404");
});

test("wrangler.toml: Zonen-Cache live aus (\"0\", img.m365.fm), Staging an (img-staging, kurze TTL, Route mit 404); Schutz-Routen /pages/* und /meta/* bleiben", () => {
  const t = readFileSync(new URL("../wrangler.toml", import.meta.url), "utf8"), [live, stg] = t.split("[env.staging]");
  assert.match(live, /^R2_ZONE_CACHE = "0"/m); assert.match(live, /^R2_ZONE_HOST = "https:\/\/img\.m365\.fm"/m);
  assert.match(live, /pattern = "img\.m365\.fm\/pages\/\*"/); assert.match(live, /pattern = "img\.m365\.fm\/meta\/\*"/);
  assert.match(stg, /^R2_ZONE_CACHE = "1"/m); assert.match(stg, /^R2_ZONE_HOST = "https:\/\/img-staging\.m365\.fm"/m); assert.match(stg, /^R2_ZONE_TTL = "300"/m);
  assert.match(stg, /pattern = "img-staging\.m365\.fm\/\*"/); assert.doesNotMatch(stg, /"https:\/\/img\.m365\.fm"/);
});
