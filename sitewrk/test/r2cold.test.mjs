// R2 als Ursprung im kalten Isolat (Dienstag-Check 17.11.2026, /entity/* Desktop TTFB p75 2,85 s): Ein frisch gestartetes Isolat kannte die
// Bau-Kennung nicht und nahm den Umweg GitHub Pages (404 fuer R2-only-Seiten wie /entity/*) -> R2. Jetzt legt die Pruefung ihr Ergebnis 30 s
// im Kanten-Cache ab (/__r2c/~ready, mit Pruefzeit); ein neues Isolat liest es kurz (hoechstens READY_WAIT) und bedient die Seite gleich aus R2.
// Kein Warten auf checkBuild (nie gecachter Abruf bei GitHub Pages), Rueckfall GitHub Pages wie bisher, R2_PRIMARY=0 unveraendert.
// Server-Timing zeigt den Weg (src r2/pages/r2fallback, ready mem/cache/cold/off) fuer die Messung mit url-peek bzw. curl.
// Seit 24.11.2026: ohne gueltige Kennung (cold, "nicht bereit") holt der Worker Seiten, die es nur im Bucket gibt (R2_ONLY_PAGE: /entity/*,
// Sprachseiten ausser en/de und ausser /<l>/), gleich ueber r2Page (src=r2direct, Schluessel /__r2c, nie /__r2f) - fehlt die Seite, GitHub Pages wie bisher.
// Dazu je Seitenaufruf dieser Pfade eine JSON-Zeile im Log (Workers Logs).
import { test } from "node:test"; import assert from "node:assert/strict";
const store = new Map(); let origins = 0, buildFetches = 0, readyMatches = 0, hang = false;
const READY_URL = "https://www.m365.fm/__r2c/~ready";
globalThis.caches = { default: {
  match: async (r) => { if (r.url === READY_URL) { readyMatches++; if (hang) return new Promise(() => {}); } const x = store.get(r.url); return x ? x.clone() : undefined; },
  put: async (r, res) => { store.set(r.url, res.clone()); } } };
const HTML = { "content-type": "text/html; charset=utf-8" };
let ORIGIN_BUILD = "b1", ghSitemap = false; const originPaths = [];
globalThis.fetch = async (req) => {
  const r = typeof req === "string" ? new Request(req) : req, u = new URL(r.url);
  if (u.pathname === "/show/redirects.json") return new Response("{}", { headers: { "content-type": "application/json" } });
  if (u.pathname === "/r2-build.txt") { buildFetches++; return new Response(ORIGIN_BUILD + "\n", { headers: { "content-type": "text/plain" } }); }
  origins++; originPaths.push(u.pathname);
  if (u.pathname === "/show/episodes/a/") return new Response("<html>gh folge</html>", { headers: HTML });
  if (u.pathname === "/fr/") return new Response("<html>gh fr start</html>", { headers: HTML });   // Startseite der Sprache bleibt in GitHub Pages
  if (u.pathname === "/community/u/x/") return new Response("<html>gh profil</html>", { headers: HTML });   // englische Seite in docs/
  if (u.pathname === "/entity/nur-gh/") return new Response("<html>gh entity</html>", { headers: HTML });   // (noch) nicht im Bucket, aber bei GitHub Pages
  if (u.pathname === "/sitemap-fr-blog.xml" && ghSitemap) return new Response("<urlset>gh</urlset>", { headers: { "content-type": "application/xml" } });
  return new Response("<html>404</html>", { status: 404, headers: HTML });
};
const { default: W, __resetR2Ready, __r2ReadyState, READY_TTL, R2_ONLY_PAGE, r2OnlyFile } = await import("../index.js");
import { readFileSync } from "node:fs";
const CASES = JSON.parse(readFileSync(new URL("./r2only_cases.json", import.meta.url), "utf8"));
const enc = (t) => new TextEncoder().encode(t).buffer;
const obj = (body, ct, meta = {}) => ({ httpEtag: '"r2"', uploaded: new Date("2026-11-16T08:00:00Z"), httpMetadata: { contentType: ct }, customMetadata: meta, arrayBuffer: async () => enc(body), text: async () => body, get body() { return new Response(body).body; } });
const B = {
  "pages/r2-build.txt": obj("b1\n", "text/plain; charset=utf-8"),
  "pages/entity/copilot/index.html": obj("<html>r2 entity</html>", "text/html; charset=utf-8"),   // nur im Bucket (site_entities.py)
  "pages/show/episodes/a/index.html": obj("<html>r2 folge</html>", "text/html; charset=utf-8", { src: "docs" }),
  "pages/entity/x/index.html": obj("<html>r2 entity x</html>", "text/html; charset=utf-8"),
  "pages/fr/blog/a/index.html": obj("<html>r2 fr blog</html>", "text/html; charset=utf-8"),
  "pages/fr/index.html": obj("<html>r2 fr start</html>", "text/html; charset=utf-8", { src: "docs" }),
  "pages/community/u/x/index.html": obj("<html>r2 profil</html>", "text/html; charset=utf-8", { src: "docs" }),
  "pages/de/show/episodes/a/index.html": obj("<html>r2 de folge</html>", "text/html; charset=utf-8"),   // nur im Bucket (site_podpage.py, write_r2)
  "pages/glossary/x/index.html": obj("<html>r2 glossar</html>", "text/html; charset=utf-8"),           // site_learn.py, write_r2
  "pages/de/glossary/x/index.html": obj("<html>r2 de glossar</html>", "text/html; charset=utf-8"),
  "pages/sitemap-fr-blog.xml": obj("<urlset>r2</urlset>", "application/xml; charset=utf-8"),
  "pages/sitemap-fr-alt.xml": obj("<urlset>alt</urlset>", "application/xml; charset=utf-8", { gone: "1" }),
  "pages/sitemap-fr-spiegel.xml": obj("<urlset>spiegel</urlset>", "application/xml; charset=utf-8", { src: "docs" }),
  "pages/show/episodes/a/transcript.txt": obj("Hallo", "text/plain; charset=utf-8"),
  "pages/og-manifest.json": obj("[]", "application/json; charset=utf-8"),
};
const r2Gets = [];
const PAGES = { get: async (k) => { r2Gets.push(k); return B[k] || null; } };
const env = { PAGES, MIGRATED: "1", R2_PRIMARY: "1" };
const req = (path, h = {}) => new Request("https://www.m365.fm" + path, { headers: h });
const run = async (r, e = env) => { const w = []; const res = await W.fetch(r, e, { waitUntil: (p) => w.push(p) }); await Promise.all(w); return res; };
const shared = (v, t) => store.set(READY_URL, new Response(v, { headers: { "x-r2-build-t": String(t), "cache-control": "public, max-age=30" } }));
const fresh = () => { store.clear(); __resetR2Ready(); origins = 0; buildFetches = 0; readyMatches = 0; hang = false; ORIGIN_BUILD = "b1"; ghSitemap = false; originPaths.length = 0; r2Gets.length = 0; logs.length = 0; };
const st = (r) => r.headers.get("server-timing") || "";
const pageGets = () => r2Gets.filter((k) => k !== "pages/r2-build.txt");   // Bucket-Abrufe ohne die Pruefung der Bau-Kennung
// Messzeilen (console.log) mitschneiden: nur die JSON-Zeilen des Workers, alles andere unveraendert ausgeben
const logs = [], log0 = console.log;
console.log = (...a) => { if (typeof a[0] === "string" && a[0].startsWith('{"m":"r2page"')) logs.push(JSON.parse(a[0])); else log0(...a); };
const withCf = (r, cf) => { Object.defineProperty(r, "cf", { value: cf }); return r; };

test("Kaltes Isolat ohne geteilte Kennung: R2-only-Seite gleich aus dem Bucket (r2direct), kein GitHub Pages; Pruefung legt die Kennung im Kanten-Cache ab", async () => {
  fresh();
  const a = await run(withCf(req("/entity/copilot/"), { colo: "FRA", country: "DE" }));
  assert.equal(a.status, 200); assert.equal(await a.text(), "<html>r2 entity</html>");
  assert.equal(origins, 0, "kein Umweg ueber GitHub Pages"); assert.equal(a.headers.get("x-m365-src"), null);
  assert.match(st(a), /src;desc="r2direct"/); assert.match(st(a), /ready;desc="cold"/); assert.match(st(a), /r2;dur=\d+/); assert.doesNotMatch(st(a), /origin;dur/);
  assert.equal(a.headers.get("x-m365-cache"), "MISS");
  assert.ok(store.has("https://www.m365.fm/__r2c/entity/copilot/"), "Schluessel /__r2c wie der Rueckfall");
  assert.ok(![...store.keys()].some((k) => k.includes("/__r2f")), "nie /__r2f");
  assert.equal(logs.length, 1, "eine Messzeile"); const l = logs[0];
  assert.deepEqual([l.p, l.src, l.ready, l.st, l.cache, l.origin, l.colo, l.country], ["/entity/copilot/", "r2direct", "cold", 200, "MISS", null, "FRA", "DE"]);
  assert.equal(typeof l.r2, "number");
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
  const e = await run(req("/entity/copilot/")); assert.equal(await e.text(), "<html>r2 entity</html>"); assert.match(st(e), /src;desc="r2direct"/, "R2-only-Seite gleich aus dem Bucket");
  assert.match(st(e), /ready;desc="mem"/); assert.equal(origins, 1, "nur die Folge oben ging an GitHub Pages");
});

test("Regel R2_ONLY_PAGE wie site_size.r2_only: Entitaeten aller Sprachen, Sprachseiten ausser en/de und ausser /<l>/", () => {
  for (const p of ["/entity/copilot/", "/de/entity/copilot/", "/fr/entity/copilot/", "/fr/blog/a/", "/ru/tag/%D0%BE/", "/ko/show/episodes/a/", "/ar/community/u/x/"]) assert.ok(R2_ONLY_PAGE.test(p), p);
  for (const p of ["/fr/", "/de/", "/de/blog/a/", "/en/x/", "/community/u/x/", "/show/episodes/a/", "/entity/", "/entity/a/b/", "/entity/copilot", "/fr/blog/a", "/fr/feed.xml", "/xx/blog/a/", "/hi/blog/a/"]) assert.ok(!R2_ONLY_PAGE.test(p), p);
});

test("Nicht bereit (Kennung ''): /entity/x/ ueber r2Page mit Schluessel /__r2c, nie /__r2f", async () => {
  fresh(); shared("", Date.now() - 1000);
  const a = await run(req("/entity/x/"));
  assert.equal(await a.text(), "<html>r2 entity x</html>"); assert.match(st(a), /src;desc="r2direct"/); assert.match(st(a), /ready;desc="cache"/);
  assert.equal(origins, 0);
  assert.deepEqual([...store.keys()].filter((k) => k !== READY_URL), ["https://www.m365.fm/__r2c/entity/x/"]);
  const b = await run(req("/entity/x/")); assert.equal(b.headers.get("x-m365-cache"), "HIT", "zweiter Abruf aus dem Kanten-Cache");
  assert.deepEqual(pageGets(), ["pages/entity/x/index.html"], "Bucket nur einmal gelesen");
});

test("Kalt: Sprachseite /fr/blog/a/ direkt aus R2; Startseite /fr/ und englische Seite /community/u/x/ (docs) weiter von GitHub Pages", async () => {
  fresh();
  const a = await run(req("/fr/blog/a/")); assert.equal(await a.text(), "<html>r2 fr blog</html>"); assert.match(st(a), /src;desc="r2direct"/);
  assert.equal(origins, 0);
  fresh();
  const h = await run(req("/fr/")); assert.equal(await h.text(), "<html>gh fr start</html>"); assert.match(st(h), /src;desc="pages"/); assert.match(st(h), /ready;desc="cold"/);
  __resetR2Ready(); store.clear();
  const c = await run(req("/community/u/x/")); assert.equal(await c.text(), "<html>gh profil</html>"); assert.match(st(c), /src;desc="pages"/); assert.match(st(c), /ready;desc="cold"/);
  assert.deepEqual(originPaths, ["/fr/", "/community/u/x/"]);
  assert.deepEqual(pageGets(), [], "kein direkter Bucket-Abruf fuer /fr/ und /community/u/x/");
  assert.equal(logs.length, 0, "keine Messzeile fuer Seiten ausserhalb von R2_ONLY_PAGE");
});

test("Kalt, r2Page liefert null: weiter ueber GitHub Pages wie bisher (Seite dort, oder 404 ohne zweites Lesen des Buckets)", async () => {
  fresh();
  const a = await run(withCf(req("/entity/nur-gh/"), { colo: "AMS", country: "NL" }));
  assert.equal(await a.text(), "<html>gh entity</html>"); assert.match(st(a), /src;desc="pages"/); assert.match(st(a), /ready;desc="cold"/);
  assert.deepEqual(originPaths, ["/entity/nur-gh/"]);
  assert.ok(store.get("https://www.m365.fm/__r2c/entity/nur-gh/").headers.get("x-r2-miss"), "Fehlen gemerkt (wie der Rueckfall)");
  assert.equal(logs.length, 1); assert.deepEqual([logs[0].src, logs[0].st, logs[0].cache, logs[0].r2, logs[0].colo, logs[0].country], ["pages", 200, "", null, "AMS", "NL"]);
  assert.equal(typeof logs[0].origin, "number");
  fresh();
  const m = await run(req("/entity/fehlt/"));
  assert.equal(m.status, 404); assert.deepEqual(originPaths, ["/entity/fehlt/"]);
  assert.deepEqual(pageGets(), ["pages/entity/fehlt/index.html"], "Bucket nur einmal gefragt (direkt), nicht noch einmal im Rueckfall");
});

test("Warm (Kennung passt): R2-only-Seite weiter ueber r2First (/__r2c/@<bau>), Messzeile mit src=r2", async () => {
  fresh(); shared("b1", Date.now() - 1000);
  const a = await run(req("/entity/copilot/")); assert.equal(a.headers.get("x-m365-src"), "r2"); assert.match(st(a), /src;desc="r2"/);
  assert.ok(store.has("https://www.m365.fm/__r2c/@b1/entity/copilot/"));
  assert.equal(logs.length, 1); assert.equal(logs[0].src, "r2"); assert.equal(logs[0].ready, "cache");
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
  const r = await run(req("/entity/copilot/"), e0); assert.equal(await r.text(), "<html>r2 entity</html>"); assert.match(st(r), /src;desc="r2fallback"/, "Notschalter: kein direkter Weg");
});

test("Interner Schluessel /__r2c/~ready ist keine oeffentliche Adresse; Dateien und Bilder lesen ihn nicht", async () => {
  fresh(); shared("b1", Date.now());
  const r = await run(req("/__r2c/~ready")); assert.equal(r.status, 404);
  await run(req("/covers/x.png")); assert.equal(readyMatches, 0, "Bilder nie aus R2 zuerst");
});

// ---------------------------------------------------------------- Ladezeit 27.11.2026: Luecken von #602 (Punkt 1)
test("R2_ONLY_PAGE: Faelle aus r2only_cases.json (direct ja, mixed und docs nein)", () => {
  for (const [src, ps] of Object.entries(CASES.direct)) for (const p of ps) assert.ok(R2_ONLY_PAGE.test(p), src + ": " + p);
  for (const [src, ps] of Object.entries(CASES.mixed)) for (const p of ps) assert.ok(!R2_ONLY_PAGE.test(p), src + " (gemischt): " + p);
  for (const p of CASES.docs) assert.ok(!R2_ONLY_PAGE.test(p), "docs: " + p);
});

test("Kalt: /de/show/episodes/a/, /glossary/x/, /de/glossary/x/ direkt aus R2 (r2direct), kein GitHub Pages", async () => {
  for (const [p, body] of [["/de/show/episodes/a/", "<html>r2 de folge</html>"], ["/glossary/x/", "<html>r2 glossar</html>"], ["/de/glossary/x/", "<html>r2 de glossar</html>"]]) {
    fresh();
    const a = await run(req(p)); assert.equal(a.status, 200, p); assert.equal(await a.text(), body, p);
    assert.match(st(a), /src;desc="r2direct"/, p); assert.doesNotMatch(st(a), /origin;dur/, p); assert.equal(origins, 0, p);
    assert.ok(store.has("https://www.m365.fm/__r2c" + p), p + ": Schluessel /__r2c wie der Rueckfall");
  }
});

test("Kalt: /de/show/episodes/<neu>/ fehlt im Bucket -> GitHub Pages 404 -> englisches Original (301) ohne zweites Lesen", async () => {
  fresh();
  const a = await run(req("/de/show/episodes/neu/"));
  assert.equal(a.status, 301); assert.equal(a.headers.get("location"), "https://www.m365.fm/show/episodes/neu/");
  assert.deepEqual(pageGets(), ["pages/de/show/episodes/neu/index.html"], "Bucket genau einmal gefragt");
  assert.deepEqual(originPaths, ["/de/show/episodes/neu/"]);
});

test("Kalt: /glossary/ selbst und uebersetzte Blogbeitraege nicht direkt (GitHub Pages zuerst)", async () => {
  for (const p of ["/glossary/", "/de/community/u/x/blog/y/"]) {
    fresh();
    await run(req(p));
    assert.deepEqual(originPaths, [p], p + ": GitHub Pages zuerst");
    assert.equal(logs.length, 0, p + ": keine Messzeile");
  }
});

test("r2OnlyFile: Sitemaps ausser en/de, Exporte, Transkripte; nicht sitemap.xml, feed.xml, Seiten", () => {
  for (const p of ["/sitemap-fr-blog.xml", "/og-manifest.json", "/episodes-register-2.json", "/show/episodes/a/transcript.txt", "/de/a/transcript.vtt"]) assert.ok(r2OnlyFile(p), p);
  for (const p of ["/sitemap.xml", "/feed.xml", "/episodes.json", "/a/", "/assets/page.js"]) assert.ok(!r2OnlyFile(p), p);
});

test("Kalt: Sitemap, Export, Transkript nur im Bucket gleich aus R2 (r2direct), ohne GitHub Pages; gone/src=docs -> GitHub Pages ohne zweites Lesen", async () => {
  fresh(); ORIGIN_BUILD = "b0";   // Kennung passt nie: bleibt "nicht bereit" (sonst waere ab der zweiten Anfrage R2 zuerst aktiv)
  const s = await run(req("/sitemap-fr-blog.xml")); assert.equal(s.status, 200); assert.equal(await s.text(), "<urlset>r2</urlset>");
  assert.equal(s.headers.get("content-type"), "application/xml; charset=utf-8"); assert.match(st(s), /src;desc="r2direct"/); assert.equal(s.headers.get("x-m365-sitemaps"), "r2");
  const t = await run(req("/show/episodes/a/transcript.txt")); assert.equal(await t.text(), "Hallo"); assert.equal(t.headers.get("x-robots-tag"), "noindex");
  const e = await run(req("/og-manifest.json")); assert.equal(await e.text(), "[]"); assert.equal(e.headers.get("x-robots-tag"), "noindex");
  const c = await run(req("/sitemap-fr-blog.xml", { "if-none-match": '"r2"' })); assert.equal(c.status, 304);
  assert.equal(origins, 0, "kein Umweg ueber GitHub Pages");
  for (const p of ["/sitemap-fr-alt.xml", "/sitemap-fr-spiegel.xml", "/sitemap-fr-fehlt.xml"]) {
    r2Gets.length = 0; originPaths.length = 0;
    const r = await run(req(p)); assert.equal(r.status, 404, p);
    assert.deepEqual(originPaths, [p], p + ": danach GitHub Pages"); assert.deepEqual(pageGets(), ["pages" + p], p + ": Bucket nur einmal gelesen");
  }
});

test("Kalt, Datei bei GitHub Pages vorhanden, aber im Bucket gone: GitHub Pages liefert", async () => {
  fresh(); ghSitemap = true; ORIGIN_BUILD = "b0";
  B["pages/sitemap-fr-blog.xml"].customMetadata = { gone: "1" };
  try { const r = await run(req("/sitemap-fr-blog.xml")); assert.equal(await r.text(), "<urlset>gh</urlset>"); assert.deepEqual(originPaths, ["/sitemap-fr-blog.xml"]); }
  finally { B["pages/sitemap-fr-blog.xml"].customMetadata = {}; }
});

test("Warm (Kennung passt): Dateien weiter ueber r2First, Notschalter R2_PRIMARY=0: GitHub Pages zuerst, dann Rueckfall", async () => {
  fresh(); shared("b1", Date.now() - 1000);
  const a = await run(req("/sitemap-fr-blog.xml")); assert.equal(a.headers.get("x-m365-src"), "r2"); assert.equal(origins, 0);
  fresh();
  const b = await run(req("/sitemap-fr-blog.xml"), { ...env, R2_PRIMARY: "0" }); assert.equal(await b.text(), "<urlset>r2</urlset>"); assert.deepEqual(originPaths, ["/sitemap-fr-blog.xml"]);
});
