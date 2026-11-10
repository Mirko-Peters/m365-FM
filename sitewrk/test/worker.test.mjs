// Site-Worker: Cache (T41), Validatoren, R2 - mit nachgebauter Cache API, R2 und fetch. Die Einwilligungs-Region (T32) ist mit Microsoft Clarity entfernt.
import { test } from "node:test"; import assert from "node:assert/strict";
const LM = "Sun, 01 Nov 2026 10:00:37 GMT", LM0 = "Sun, 01 Nov 2026 10:00:00 GMT", LM1 = "Sun, 01 Nov 2026 10:00:01 GMT";
const store = new Map(); let r2gets = 0, lastOrigin = null;
globalThis.caches = { default: { match: async (r) => { const x = store.get(r.url); return x ? x.clone() : undefined; }, put: async (r, res) => { store.set(r.url, res.clone()); } } };
globalThis.fetch = async (req) => {
  const r = typeof req === "string" ? new Request(req) : req, u = new URL(r.url); lastOrigin = r;
  if (u.pathname === "/show/redirects.json") return new Response("{}", { headers: { "content-type": "application/json" } });
  if (u.pathname === "/r2-build.txt") return globalThis.ORIGIN_BUILD ? new Response(globalThis.ORIGIN_BUILD + "\n", { headers: { "content-type": "text/plain" } }) : new Response("404", { status: 404 });
  const inm = r.headers.get("if-none-match"), ims = r.headers.get("if-modified-since");
  if (u.pathname === "/") { if (inm === 'W/"abc"' || (!inm && ims && Date.parse(ims) >= Date.parse(LM))) return new Response(null, { status: 304, headers: { etag: '"abc"', "last-modified": LM } }); return new Response("<html><body>gh</body></html>", { headers: { "content-type": "text/html; charset=utf-8", etag: '"abc"', "last-modified": LM } }); }
  if (u.pathname === "/nolm/") { if (ims && Date.parse(ims) >= Date.parse(LM)) return new Response(null, { status: 304 }); return new Response("<html>x</html>", { headers: { "content-type": "text/html; charset=utf-8", "last-modified": LM } }); }
  if (u.pathname === "/feed.json") { if (ims) return new Response(null, { status: 304, headers: { "last-modified": LM } }); return new Response("{}", { headers: { "content-type": "application/json", etag: '"j1"', "last-modified": LM } }); }
  if (u.pathname === "/rng/") { if (r.headers.get("range")) return new Response("<html><b", { status: 206, headers: { "content-type": "text/html", "content-range": "bytes 0-8/30" } }); return new Response("<html><body>full</body></html>", { headers: { "content-type": "text/html" } }); }
  if (u.pathname === "/assets/a.css") return new Response("a{}", { headers: { "content-type": "text/css", etag: 'W/"css1"' } });
  if (u.pathname === "/callback") return new Response(null, { status: 301, headers: { location: "https://www.m365.fm/callback/" } });
  if (u.pathname === "/og/alt.png") return new Response("PNG", { headers: { "content-type": "image/png" } });
  if (u.pathname === "/community/feed/101-copilot-explained/") return new Response("<html>feed</html>", { headers: { "content-type": "text/html; charset=utf-8" } });
  if (u.pathname === "/einladung/gebaut/") return new Response("<html>einladung</html>", { headers: { "content-type": "text/html; charset=utf-8" } });
  return new Response("404", { status: 404, headers: { "content-type": "text/html" } });
};
const { default: W, r2Key, __resetR2Ready, isHtmlPath } = await import("../index.js");
const PAGES = { get: async (k) => { r2gets++; if (k === "pages/pl/x/index.html") return { httpEtag: '"r2e"', uploaded: new Date("2026-11-01T20:00:00Z"), arrayBuffer: async () => new TextEncoder().encode("<html>pl</html>").buffer }; if (k === "pages/blog-import/index.json") return { body: new Response('{"total":7}').body }; if (k === "pages/translations-blog.json") return { body: new Response('{"count":3}').body }; return null; } };
const env = { PAGES, MIGRATED: "1" };
const req = (path, c, h = {}, method = "GET") => { const r = new Request("https://www.m365.fm" + path, { headers: h, method }); if (c) Object.defineProperty(r, "cf", { value: { country: c } }); return r; };
const run = async (r) => { const w = []; const res = await W.fetch(r, env, { waitUntil: (p) => w.push(p) }); await Promise.all(w); return res; };

const HTML_CC = "public, max-age=0, s-maxage=600, stale-while-revalidate=86400";
test("HTML-Adressen erkennen", () => {
  assert.ok(isHtmlPath("/") && isHtmlPath("/de/entity/x/") && isHtmlPath("/impressum") && isHtmlPath("/a.html"));
  assert.ok(!isHtmlPath("/feed.json") && !isHtmlPath("/sitemap.xml") && !isHtmlPath("/llms.txt"));
});
test("HTML von GitHub Pages: ohne Einwilligungs-Region, oeffentlicher Cache, Validatoren des Ursprungs unveraendert", async () => {
  for (const c of ["US", "DE", undefined]) {
    const r = await run(req("/", c)); assert.equal(r.status, 200);
    assert.equal(r.headers.get("x-m365-cr"), null); assert.equal(r.headers.get("cache-control"), HTML_CC);
    assert.equal(r.headers.get("etag"), '"abc"'); assert.equal(r.headers.get("last-modified"), LM);
    assert.doesNotMatch(await r.text(), /data-cr/);
  }
});
test("304 ueber die Validatoren des Ursprungs; alte Regions-Validatoren (T32) bekommen die frische Seite", async () => {
  let r = await run(req("/", "DE", { "if-modified-since": LM })); assert.equal(r.status, 304); assert.equal(r.headers.get("cache-control"), HTML_CC);
  assert.equal(lastOrigin.headers.get("if-modified-since"), LM);
  r = await run(req("/", "DE", { "if-none-match": 'W/"abc"' })); assert.equal(r.status, 304);
  r = await run(req("/", "DE", { "if-none-match": 'W/"abc.r1"' })); assert.equal(r.status, 200, "Browser-Cache mit Clarity-Hinweis: neue Fassung");
  r = await run(req("/", "US", { "if-modified-since": LM0 })); assert.equal(r.status, 200);
  r = await run(req("/nolm/", "US", { "if-modified-since": LM })); assert.equal(r.status, 304);
});
test("R2-Seite: Cache, 304 per ETag und Last-Modified, gleich fuer alle Laender", async () => {
  const r = await run(req("/pl/x/", "PL")); assert.equal(r.status, 200); assert.equal(await r.text(), "<html>pl</html>");
  assert.equal(r.headers.get("x-m365-cr"), null); assert.equal(r.headers.get("etag"), '"r2e"'); assert.equal(r.headers.get("last-modified"), "Sun, 01 Nov 2026 20:00:00 GMT");
  const n = r2gets; const r2 = await run(req("/pl/x/", "US", { "if-none-match": '"r2e"' })); assert.equal(r2.status, 304); assert.equal(r2gets, n, "aus dem Kanten-Cache");
  const r2b = await run(req("/pl/x/", "PL", { "if-modified-since": "Sun, 01 Nov 2026 20:00:00 GMT" })); assert.equal(r2b.status, 304);
  const r3 = await run(req("/pl/x/", "PL", { "if-none-match": 'W/"r2e.r1"' })); assert.equal(r3.status, 200);
});
test("R2-Datenexporte: gleiche Pfade, JSON- und Cache-Header, Blog-Import bleibt noindex", async () => {
  const blog = await run(req("/blog-import/index.json", "US"));
  assert.equal(blog.status, 200); assert.equal(await blog.text(), '{"total":7}');
  assert.equal(blog.headers.get("content-type"), "application/json; charset=utf-8");
  assert.equal(blog.headers.get("cache-control"), "public, max-age=0, s-maxage=600, stale-while-revalidate=86400");
  assert.equal(blog.headers.get("x-robots-tag"), "noindex");
  const translations = await run(req("/translations-blog.json", "US"));
  assert.equal(translations.status, 200); assert.equal(await translations.text(), '{"count":3}');
  assert.equal(translations.headers.get("content-type"), "application/json; charset=utf-8");
  assert.equal(translations.headers.get("cache-control"), "public, max-age=0, s-maxage=600, stale-while-revalidate=86400");
  assert.equal(translations.headers.get("x-robots-tag"), null);
});
test("Dateien (JSON) und Assets unveraendert", async () => {
  const j = await run(req("/feed.json", "DE")); assert.equal(j.headers.get("etag"), '"j1"'); assert.equal(j.headers.get("last-modified"), LM); assert.equal(j.headers.get("x-m365-cr"), null);
  const j2 = await run(req("/feed.json", "DE", { "if-modified-since": LM })); assert.equal(j2.status, 304); assert.equal(lastOrigin.headers.get("if-modified-since"), LM);
});
test("HEAD ohne Body; Assets und 404 unveraendert", async () => {
  const h = await run(req("/", "US", {}, "HEAD")); assert.equal(h.status, 200); assert.equal(h.body, null); assert.equal(h.headers.get("x-m365-cr"), null);
  const a = await run(req("/assets/a.css", "DE")); assert.equal(a.headers.get("etag"), 'W/"css1"'); assert.equal(a.headers.get("x-m365-cr"), null); assert.match(a.headers.get("cache-control"), /max-age=3600/);
  const n = await run(req("/gibt-es-nicht/", "DE")); assert.equal(n.status, 404);
});

// R2 als Ursprung (R2_PRIMARY=1): eigene Umgebung, eigener Bucket-Nachbau mit Metadaten
const enc = (t) => new TextEncoder().encode(t).buffer;
const obj2 = (body, ct, extra = {}) => ({ httpEtag: '"r2x"', uploaded: new Date("2026-11-04T09:00:00Z"), httpMetadata: ct ? { contentType: ct } : {}, customMetadata: { src: "docs", ...extra }, arrayBuffer: async () => enc(body), text: async () => body, body: new Response(body).body });
const B2 = {
  "pages/de/r2only/index.html": obj2("<html><body>r2 de</body></html>", "text/html; charset=utf-8"),
  "pages/index.html": obj2("<html><body>r2 start</body></html>", "text/html; charset=utf-8"),
  "pages/assets/site.0123456789ab.css": obj2("b{}", "text/css; charset=utf-8"),
  "pages/feed.json": obj2('{"r2":1}', "application/json; charset=utf-8"),
  "pages/alt/index.html": obj2("<html>alt</html>", "text/html; charset=utf-8", { gone: "1" }),
  "pages/old.json": obj2("{}", "application/octet-stream"),
  "pages/blog-import/index.json": obj2('{"total":9}', "application/json; charset=utf-8"),
  "pages/search/manifest.json": obj2('{"parts":1}', "application/json; charset=utf-8"),
  "pages/r2-build.txt": obj2("b1\n", "text/plain; charset=utf-8"),
  "pages/ru/tag/облако/index.html": obj2("<html>ru tag</html>", "text/html; charset=utf-8"),
  "pages/broken.json": { ...obj2("{}", "application/json"), arrayBuffer: async () => { throw new Error("reset"); } },
};
let r2gets2 = 0, origins2 = 0;
const env2 = { ...env, R2_PRIMARY: "1", PAGES: { get: async (k) => { r2gets2++; return B2[k] || null; } } };
globalThis.ORIGIN_BUILD = "b1";
const warm = async () => { __resetR2Ready(); await W.fetch(req("/nolm/", "US"), env2, { waitUntil: (p) => p }).then(() => new Promise((r) => setTimeout(r, 5))); for (let i = 0; i < 20 && !(await readyNow()); i++) await new Promise((r) => setTimeout(r, 5)); };
const readyNow = async () => { const w = []; await W.fetch(req("/__probe/", "US"), env2, { waitUntil: (p) => w.push(p) }); await Promise.all(w); return true; };
const run2 = async (r) => { const w = []; const before = lastOrigin; const res = await W.fetch(r, env2, { waitUntil: (p) => w.push(p) }); await Promise.all(w); if (lastOrigin !== before && !["/show/redirects.json", "/r2-build.txt"].includes(new URL(lastOrigin.url).pathname)) origins2++; return res; };

test("R2 zuerst: Seite aus dem Bucket ohne Abruf bei GitHub Pages, gleiche Header", async () => {
  store.clear(); globalThis.ORIGIN_BUILD = "b1"; await warm(); origins2 = 0;
  const a = await run2(req("/de/r2only/", "DE"));
  assert.equal(a.status, 200); assert.equal(await a.text(), "<html><body>r2 de</body></html>");
  assert.equal(a.headers.get("x-m365-src"), "r2"); assert.equal(a.headers.get("x-m365-cache"), "MISS");
  assert.equal(a.headers.get("content-type"), "text/html; charset=utf-8");
  assert.equal(a.headers.get("strict-transport-security"), "max-age=31536000; includeSubDomains");
  assert.equal(origins2, 0, "kein Abruf bei GitHub Pages");
  const b = await run2(req("/de/r2only/", "US")); assert.equal(b.headers.get("x-m365-cache"), "HIT");
  assert.equal(a.headers.get("etag"), b.headers.get("etag"), "gleiche Validatoren fuer alle Laender");
  const s = await run2(req("/", "US")); assert.equal(await s.text(), "<html><body>r2 start</body></html>"); assert.match(s.headers.get("link") || "", /api-catalog/);
});
test("R2 zuerst: Dateien mit Content-Type aus den Metadaten, gehashtes CSS ein Jahr, Exporte noindex", async () => {
  store.clear();
  const c = await run2(req("/assets/site.0123456789ab.css", "DE"));
  assert.equal(c.status, 200); assert.equal(c.headers.get("content-type"), "text/css; charset=utf-8"); assert.equal(c.headers.get("cache-control"), "public, max-age=31536000, immutable");
  const j = await run2(req("/feed.json", "DE")); assert.equal(await j.text(), '{"r2":1}'); assert.equal(j.headers.get("content-type"), "application/json; charset=utf-8");
  const o = await run2(req("/old.json", "DE")); assert.equal(o.headers.get("content-type"), "application/json; charset=utf-8", "octet-stream -> nach Endung");
  const bi = await run2(req("/blog-import/index.json", "DE")); assert.equal(bi.headers.get("x-robots-tag"), "noindex");
});
test("R2 zuerst: 304 per ETag, HEAD ohne Body", async () => {
  store.clear();
  const f = await run2(req("/feed.json", "DE", { "if-none-match": '"r2x"' })); assert.equal(f.status, 304);
  const h = await run2(req("/feed.json", "DE", {}, "HEAD")); assert.equal(h.status, 200); assert.equal(await h.text(), "");
});
test("R2 zuerst: fehlt oder als entfernt markiert -> GitHub Pages wie bisher; Fehlen wird gemerkt", async () => {
  store.clear(); origins2 = 0; r2gets2 = 0;
  const g = await run2(req("/", "US", {}, "GET")); assert.equal(g.headers.get("x-m365-src"), "r2");
  const x = await run2(req("/nolm/", "US")); assert.equal(await x.text(), "<html>x</html>"); assert.equal(x.headers.get("x-m365-src"), null); assert.equal(origins2, 1);
  const n = r2gets2; await run2(req("/nolm/", "US")); assert.equal(r2gets2, n, "Fehlen im Kanten-Cache gemerkt, kein zweiter R2-Abruf");
  const gone = await run2(req("/alt/", "US")); assert.equal(gone.status, 404, "entfernte Seite wird nicht mehr ausgeliefert");
  const rr = await W.fetch(req("/alt/", "US"), env, { waitUntil: () => {} }); assert.equal(rr.status, 404, "auch nicht ueber den alten R2-Rueckfall");
});
test("R2 zuerst: Bilder, Suchindex, Range auf Dateien und Pfade ohne Endung gehen an GitHub Pages", async () => {
  store.clear(); r2gets2 = 0;
  await run2(req("/assets/a.css", "DE", { range: "bytes=0-1" })); assert.equal(r2gets2, 0);
  await run2(req("/covers/x.png", "DE")); assert.equal(r2gets2, 0);
  assert.equal(r2Key("/de"), ""); assert.equal(r2Key("/de/"), "pages/de/index.html"); assert.equal(r2Key("/feed.json"), "pages/feed.json");
  const si = await run2(req("/search/manifest.json", "DE")); assert.equal(si.headers.get("access-control-allow-origin"), "*", "Suchindex ueber den bisherigen Weg (eigene Header)"); assert.equal(si.headers.get("x-m365-src"), null);
});
test("R2_PRIMARY aus: Seiten weiter zuerst von GitHub Pages", async () => {
  store.clear(); r2gets2 = 0;
  const e3 = { ...env2, R2_PRIMARY: "0" };
  const r = await W.fetch(req("/", "US"), e3, { waitUntil: () => {} }); assert.equal(await r.text(), "<html><body>gh</body></html>"); assert.equal(r2gets2, 0);
});

test("R2 zuerst nur bei gleicher Bau-Kennung: abweichend, fehlend oder ohne Bucket-Kennung -> GitHub Pages; erste Anfrage wartet nie", async () => {
  store.clear(); globalThis.ORIGIN_BUILD = "b1"; __resetR2Ready();
  const first = await run2(req("/", "US")); assert.equal(first.headers.get("x-m365-src"), null, "erste Anfrage nach Start: GitHub Pages, Pruefung im Hintergrund");
  const second = await run2(req("/", "US")); assert.equal(second.headers.get("x-m365-src"), "r2", "danach aus R2");
  for (const ob of ["b2", ""]) {
    store.clear(); globalThis.ORIGIN_BUILD = ob; await warm();
    const r = await run2(req("/", "US")); assert.equal(await r.text(), "<html><body>gh</body></html>", "Kennung " + JSON.stringify(ob)); assert.equal(r.headers.get("x-m365-src"), null);
  }
  store.clear(); globalThis.ORIGIN_BUILD = "b1"; __resetR2Ready();
  const e4 = { ...env2, PAGES: { get: async (k) => (k === "pages/r2-build.txt" ? null : B2[k] || null) } };
  for (let i = 0; i < 2; i++) { const w = []; const r = await W.fetch(req("/", "US"), e4, { waitUntil: (p) => w.push(p) }); await Promise.all(w); assert.equal(await r.text(), "<html><body>gh</body></html>"); }
  store.clear(); await warm();
  const ok = await run2(req("/", "US")); assert.equal(ok.headers.get("x-m365-src"), "r2");
});
test("R2 zuerst: CORS wie GitHub Pages, /a/index.html teilt den Cache-Eintrag mit /a/, Unicode-Pfade, Lesefehler -> GitHub Pages", async () => {
  store.clear(); globalThis.ORIGIN_BUILD = "b1"; await warm();
  const j = await run2(req("/feed.json", "DE")); assert.equal(j.headers.get("access-control-allow-origin"), "*");
  await run2(req("/de/r2only/index.html", "DE")); assert.ok(store.has("https://www.m365.fm/__r2c/@b1/de/r2only/"), "Schluessel mit Bau-Kennung, ohne index.html");
  assert.ok(![...store.keys()].some((k) => k.endsWith("index.html/")));
  const ru = await run2(req("/ru/tag/" + encodeURIComponent("облако") + "/", "US")); assert.equal(await ru.text(), "<html>ru tag</html>");
  const br = await run2(req("/broken.json", "US")); assert.equal(br.status, 404, "Lesefehler: weiter zu GitHub Pages (hier 404), keine Ausnahme");
});
test("Alter R2-Rueckfall (nach 404) liefert keine Spiegel-Objekte von GitHub Pages aus", async () => {
  store.clear();
  const e5 = { ...env, PAGES: { get: async (k) => (k === "pages/gonepage/index.html" ? obj2("<html>stale</html>", "text/html") : k === "pages/thin/index.html" ? { ...obj2("<html>thin</html>", "text/html"), customMetadata: {} } : null) } };
  const a = await W.fetch(req("/gonepage/", "US"), e5, { waitUntil: () => {} }); assert.equal(a.status, 404);
  const b = await W.fetch(req("/thin/", "US"), e5, { waitUntil: () => {} }); assert.equal(b.status, 200); assert.equal(await b.text(), "<html>thin</html>");
});
test("R2 zuerst: haengende Pruefung der Bau-Kennung blockiert keine Anfrage", async () => {
  store.clear(); __resetR2Ready(); globalThis.ORIGIN_BUILD = "b1";
  const e6 = { ...env2, PAGES: { get: (k) => (k === "pages/r2-build.txt" ? new Promise(() => {}) : Promise.resolve(B2[k] || null)) } };
  const t0 = Date.now();
  for (let i = 0; i < 3; i++) { const r = await W.fetch(req("/", "US"), e6, { waitUntil: () => {} }); assert.equal(await r.text(), "<html><body>gh</body></html>"); }
  assert.ok(Date.now() - t0 < 1000, "keine Anfrage wartet auf die Pruefung");
});
test("R2 zuerst: Cache-Eintrag eines frueheren Baus wird nie ausgeliefert", async () => {
  store.clear(); globalThis.ORIGIN_BUILD = "b1"; await warm();
  store.set("https://www.m365.fm/__r2c/@b0/de/r2only/", new Response("<html>alt</html>", { headers: { "content-type": "text/html; charset=utf-8" } }));
  const r = await run2(req("/de/r2only/", "US")); assert.equal(await r.text(), "<html><body>r2 de</body></html>"); assert.equal(r.headers.get("x-m365-cache"), "MISS");
});

test("Teilen-Bilder: nach dem Umzug nach R2 leitet /og/... per 301 auf img.m365.fm, solange GitHub Pages das Bild noch hat, kommt es von dort", async () => {
  const r = await run(req("/og/entity/teams.png"));
  assert.equal(r.status, 301); assert.equal(r.headers.get("location"), "https://img.m365.fm/og/entity/teams.png");
  const h = await run(req("/og/show/episodes/x.png", undefined, {}, "HEAD")); assert.equal(h.status, 301);
  const old = await run(req("/og/alt.png")); assert.equal(old.status, 200); assert.equal(await old.text(), "PNG");
  const other = await run(req("/assets/fehlt.png")); assert.equal(other.status, 404);   // nur /og/ wird umgeleitet
});

test("img.m365.fm: Bucket-Interna (pages/, meta/) sind dort nicht oeffentlich - 404 ohne Abruf beim Ursprung", async () => {
  const before = lastOrigin;
  for (const p of ["/pages/index.html", "/pages/de/show/x/index.html", "/meta/gone.json"]) {
    const r = await W.fetch(new Request("https://img.m365.fm" + p), env, { waitUntil() {} });
    assert.equal(r.status, 404); assert.equal(r.headers.get("x-robots-tag"), "noindex");
  }
  assert.equal(lastOrigin, before, "kein Abruf bei GitHub Pages oder R2");
});

test("Weiterleitung des Ursprungs behaelt die Query (OAuth-Code auf /callback)", async () => {
  const r = await run(req("/callback?code=4%2F0Ab&scope=x", "DE"));
  assert.equal(r.status, 301); assert.equal(r.headers.get("location"), "https://www.m365.fm/callback/?code=4%2F0Ab&scope=x");
  const r2 = await run(req("/callback", "DE"));
  assert.equal(r2.headers.get("location"), "https://www.m365.fm/callback/");
});

test("Entfernte Inhaltsseiten (/community/feed/<id>-<slug>/, z. B. GitHub-Aktivitaet): 410 Gone mit noindex statt 404, bestehende bleiben 200", async () => {
  for (const p of ["/community/feed/100-mirko-peters-pushed-to-main/", "/de/community/feed/100-mirko-peters-pushed-to-main/", "/community/feed/102-x", "/community/feed/102-x/index.html"]) {
    const r = await run(req(p, "US")); assert.equal(r.status, 410, p);
    assert.equal(r.headers.get("x-robots-tag"), "noindex", p); assert.match(r.headers.get("content-type"), /text\/html/);
    const t = await r.text(); assert.match(t, /noindex/); assert.ok(!/github/i.test(t), p);
    assert.match(t, p.startsWith("/de/") ? /href="\/de\/community\/"/ : /href="\/community\/"/);
  }
  const h = await run(req("/community/feed/100-x/", "US", {}, "HEAD")); assert.equal(h.status, 410); assert.equal(await h.text(), "");
  const ok = await run(req("/community/feed/101-copilot-explained/", "US")); assert.equal(ok.status, 200);
  for (const p of ["/community/feedback/", "/community/feed/", "/community/feed/abc/", "/fr/community/feed/100-x/"]) assert.equal((await run(req(p, "US"))).status, 404, p);
});
test("Einladungslink (#320): gebaute Seite bleibt 200; fehlt sie (noch nicht gebaut, Profil privat, Konto geloescht), 302 zur Community mit dem Kuerzel statt 404", async () => {
  const ok = await run(req("/einladung/gebaut/", "DE")); assert.equal(ok.status, 200); assert.equal(await ok.text(), "<html>einladung</html>");
  for (const [path, to] of [["/einladung/neu-dabei/", "/community/?ref=neu-dabei"], ["/einladung/neu-dabei", "/community/?ref=neu-dabei"], ["/einladung/max-m/?utm_source=x", "/community/?ref=max-m"], ["/einladung/" + "a".repeat(39) + "/", "/community/?ref=" + "a".repeat(39)]]) {
    const r = await run(req(path, "DE")); assert.equal(r.status, 302, path); assert.equal(r.headers.get("location"), "https://www.m365.fm" + to);
    assert.equal(r.headers.get("cache-control"), "no-store"); assert.equal(r.headers.get("x-robots-tag"), "noindex");
  }
  const head = await run(req("/einladung/neu-dabei/", "DE", {}, "HEAD")); assert.equal(head.status, 302);
  for (const path of ["/einladung/", "/einladung/Gross/", "/einladung/a/", "/einladung/" + "a".repeat(40) + "/", "/einladung/max-m/x/", "/einladung/%3Cscript%3E/", "/de/einladung/max-m/"])
    assert.equal((await run(req(path, "DE"))).status, 404, path);   // nur gueltige Kuerzel, nur genau diese Adresse
  assert.equal((await run(req("/einladung/neu-dabei/", "DE", {}, "POST"))).status, 404);
});
