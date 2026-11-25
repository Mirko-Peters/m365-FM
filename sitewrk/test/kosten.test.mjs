// Kostenanalyse D1/R2 (25.11.2026), Paket B: weniger R2-Lesungen und Ursprungs-Abrufe im Site-Worker.
// - Auffrischen der Bau-Kennung liest zuerst den geteilten Stand (/__r2c/~ready), prueft nur ohne juengeren Stand selbst
// - echtes 404 mit gueltiger Bau-Kennung: genau eine R2-Lesung (keine zweite ueber die Rueckfaelle)
// - Scanner-Adressen: fruehes 404 ohne Ursprung und ohne R2
// - Live-Profil: positiver Cache 120 s, negativer 600 s; Suchindex-Rueckfall ueber den Kanten-Cache
// - R2_EDGE_TTL fuer /__r2f-Eintraege
import { test, beforeEach } from "node:test"; import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const store = new Map(); let origins = [], buildFetches = 0, readyMatches = 0, gets = [], api = [];
const READY_URL = "https://www.m365.fm/__r2c/~ready";
globalThis.caches = { default: {
  match: async (r) => { if (r.url === READY_URL) readyMatches++; const x = store.get(r.url); return x ? x.clone() : undefined; },
  put: async (r, res) => { store.set(r.url, res.clone()); } } };
let BUILD = "b1-pfad";
globalThis.fetch = async (req) => {
  const r = typeof req === "string" ? new Request(req) : req, u = new URL(r.url);
  if (u.hostname === "api-dub.m365.fm") {
    api.push(u.pathname);
    if (u.pathname === "/api/profile/nilufer") return new Response(JSON.stringify({ profile: { type: "u", handle: "nilufer", name: "Nilufer Aydin", public: true } }), { headers: { "content-type": "application/json" } });
    return new Response('{"error":"not_found"}', { status: 404 });
  }
  if (u.pathname === "/show/redirects.json") return new Response("{}", { headers: { "content-type": "application/json" } });
  if (u.pathname === "/r2-build.txt") { buildFetches++; return new Response(BUILD + "\n"); }
  origins.push(u.pathname);
  return new Response("<html>404</html>", { status: 404, headers: { "content-type": "text/html; charset=utf-8" } });
};
const { default: W, __resetR2Ready, __r2ReadyState, READY_TTL, SCANNER, r2EdgeTtl } = await import("../index.js");
const enc = (t) => new TextEncoder().encode(t).buffer;
const obj = (body, ct, meta = {}) => ({ httpEtag: '"r2"', uploaded: new Date("2026-11-20T08:00:00Z"), httpMetadata: { contentType: ct }, customMetadata: meta, arrayBuffer: async () => enc(body), text: async () => body, get body() { return new Response(body).body; } });
const B = {
  "pages/r2-build.txt": obj("b1-pfad\n", "text/plain"),
  "pages/de/x/index.html": obj("<html>de x</html>", "text/html; charset=utf-8"),
  "pages/assets/site.0123456789ab.css": obj("a{}", "text/css; charset=utf-8"),
  "pages/search/manifest.json": obj('{"parts":2}', "application/json"),
};
let broken = new Set();
const PAGES = { get: async (k) => { gets.push(k); if (broken.has(k)) return { ...B[k], arrayBuffer: async () => { throw new Error("reset"); } }; return B[k] || null; } };
const env = { PAGES, MIGRATED: "1", R2_PRIMARY: "1", R2_EDGE_TTL: "86400" };
const req = (path, method = "GET") => new Request("https://www.m365.fm" + path, { method });
const run = async (r, e = env) => { const w = []; const res = await W.fetch(r, e, { waitUntil: (p) => w.push(p) }); await Promise.all(w); return res; };
const shared = (v, t) => store.set(READY_URL, new Response(v, { headers: { "x-r2-build-t": String(t), "cache-control": "public, max-age=30" } }));
const realNow = Date.now;
const warm = async (e = env) => { await run(req("/__warm__/"), e); gets = []; origins = []; buildFetches = 0; readyMatches = 0; };
beforeEach(() => { Date.now = realNow; store.clear(); __resetR2Ready(); origins = []; buildFetches = 0; readyMatches = 0; gets = []; api = []; BUILD = "b1-pfad"; broken = new Set(); });

test("Auffrischen mit gemerkter Kennung: juengerer geteilter Stand wird uebernommen, keine eigene Pruefung (kein R2-Get, kein GitHub-Abruf)", async () => {
  shared("b1-pfad", Date.now() - 1000);
  const a = await run(req("/de/x/")); assert.equal(a.headers.get("x-m365-src"), "r2"); assert.equal(buildFetches, 0);
  const t0 = __r2ReadyState().t, base = realNow();
  Date.now = () => base + READY_TTL + 5000;   // 35 s spaeter: eigener Stand abgelaufen, ein anderes Isolat hat vor 2 s geprueft
  shared("b1-pfad", Date.now() - 2000); gets = [];
  const b = await run(req("/de/x/"));
  assert.equal(b.headers.get("x-m365-src"), "r2", "Anfrage wartet nicht, gemerkte Kennung gilt weiter");
  assert.equal(buildFetches, 0, "kein Abruf von /r2-build.txt"); assert.ok(!gets.includes("pages/r2-build.txt"), "keine R2-Lesung der Kennung");
  assert.equal(__r2ReadyState().t, Date.now() - 2000, "geteilter Stand uebernommen"); assert.ok(__r2ReadyState().t > t0);
});

test("Auffrischen ohne juengeren geteilten Stand: eigene Pruefung wie bisher, Ergebnis geteilt", async () => {
  shared("b1-pfad", Date.now() - 1000);
  await run(req("/de/x/"));
  const base = realNow(); Date.now = () => base + READY_TTL + 5000;   // geteilter Stand ist jetzt ebenfalls zu alt
  await run(req("/de/x/"));
  assert.equal(buildFetches, 1, "eigene Pruefung"); assert.equal(Number(store.get(READY_URL).headers.get("x-r2-build-t")), Date.now(), "neu abgelegt");
  assert.equal(__r2ReadyState().v, "b1-pfad");
});

test("Echtes 404 mit gueltiger Bau-Kennung: eine R2-Lesung, keine zweite ueber die Rueckfaelle (Seite, Sitemap, Export, Transkript)", async () => {
  await warm();
  for (const [p, key] of [["/fehlt/", "pages/fehlt/index.html"], ["/sitemap-fr-blog.xml", "pages/sitemap-fr-blog.xml"], ["/og-manifest.json", "pages/og-manifest.json"], ["/fr/show/episodes/a/transcript.txt", "pages/fr/show/episodes/a/transcript.txt"]]) {
    gets = [];
    const r = await run(req(p)); assert.equal(r.status, 404, p);
    assert.deepEqual(gets, [key], p + ": genau ein R2-Abruf");
    gets = []; await run(req(p)); assert.deepEqual(gets, [], p + ": Fehlen gemerkt");
  }
});

test("Fremdsprachige Folge ohne R2-Objekt: Weiterleitung zum Original bleibt (ohne zweite R2-Lesung)", async () => {
  await warm();
  const r = await run(req("/fr/show/episodes/a/")); assert.equal(r.status, 301); assert.equal(r.headers.get("location"), "https://www.m365.fm/show/episodes/a/");
  assert.deepEqual(gets, ["pages/fr/show/episodes/a/index.html"]);
});

test("Lesefehler bei R2 zuerst: der Rueckfall nach dem 404 versucht es noch einmal", async () => {
  await warm(); broken.add("pages/de/x/index.html");
  const r = await run(req("/de/x/")); broken.clear();
  assert.equal(r.status, 404, "Lesefehler auch im Rueckfall (gleiche Attrappe)"); assert.equal(gets.filter((k) => k === "pages/de/x/index.html").length, 2, "zweiter Versuch ueber r2Page");
});

test("Ohne gueltige Bau-Kennung (R2_PRIMARY=0): R2-Rueckfall nach dem 404 wie bisher, nur fuer Seiten-Adressen", async () => {
  const e0 = { ...env, R2_PRIMARY: "0" };
  const r = await run(req("/de/x/"), e0); assert.equal(r.status, 200); assert.equal(await r.text(), "<html>de x</html>");
  gets = []; await run(req("/fehlt.json"), e0); assert.deepEqual(gets, [], "keine Lesung von pages/fehlt.json/index.html");
});

test("Scanner-Adressen: fruehes 404 ohne GitHub Pages, ohne R2 und ohne Bau-Kennung", async () => {
  for (const p of ["/wp-login.php", "/xmlrpc.php", "/wp-admin/", "/blog/wp-content/plugins/x/readme.txt", "/wp-includes/wlwmanifest.xml", "/.env", "/.env.local", "/api/.env", "/.git/config", "/.git/HEAD", "/de/index.php", "/wp-json/wp/v2/users", "/wordpress/wp-admin/", "/wp-content"]) {
    origins = []; gets = []; readyMatches = 0;
    const r = await run(req(p)); assert.equal(r.status, 404, p);
    assert.deepEqual(origins, [], p); assert.deepEqual(gets, [], p); assert.equal(readyMatches, 0, p);
    assert.equal(r.headers.get("cache-control"), "public, max-age=86400"); assert.equal(r.headers.get("x-robots-tag"), "noindex");
  }
  for (const p of ["/.well-known/api-catalog", "/entity/wordpress/", "/show/episodes/wp-ready-copilot/", "/blog/the-env-of-teams/", "/entity/git/", "/entity/github/", "/de/wp/", "/.gitignore-tipps/",
    "/community/u/anna/blog/wp-content-migration-to-sharepoint/", "/blog/wp-login-sso-entra/", "/entity/wp-json/", "/community/u/x/blog/wp-mail-smtp-richtig-konfigurieren/",
    "/community/u/wp-content-pro/", "/community/u/wp-admin/", "/de/community/u/wp-content-pro/", "/blog/wp-mail-smtp-x/", "/de/wp-content-migration/"]) {
    assert.equal(SCANNER.test(p), false, p);   // echte Adressen und aehnliche Slugs bleiben unberuehrt
  }
  const h = await run(req("/wp-login.php", "HEAD")); assert.equal(h.status, 404); assert.equal(await h.text(), "");
});

test("Live-Profil: oeffentliches Profil 120 s gemerkt (ein API-Abruf), Browser weiter no-store; Fehlen 600 s", async () => {
  const a = await run(req("/community/u/nilufer/")); assert.equal(a.status, 200); assert.equal(a.headers.get("cache-control"), "no-store");
  const b = await run(req("/de/community/u/nilufer/")); assert.equal(b.status, 200); assert.match(await b.text(), /Nilufer Aydin/);
  assert.deepEqual(api, ["/api/profile/nilufer"], "zweiter Aufruf aus dem Kanten-Cache");
  assert.match(store.get("https://www.m365.fm/__live/p/nilufer").headers.get("cache-control"), /max-age=120$/);
  const m = await run(req("/community/u/unbekannt/")); assert.equal(m.status, 302);
  assert.match(store.get("https://www.m365.fm/__live/u/unbekannt").headers.get("cache-control"), /max-age=600$/);
  await run(req("/community/u/unbekannt/")); assert.equal(api.filter((x) => x === "/api/profile/unbekannt").length, 1);
  for (const p of ["/__live/p/nilufer", "/__live/u/unbekannt", "/__r2s/x"]) assert.equal((await run(req(p))).status, 404, p);
});

test("Live-Profil: verfaelschter Cache-Eintrag (nicht oeffentlich) wird nie ausgeliefert", async () => {
  store.set("https://www.m365.fm/__live/p/nilufer", new Response(JSON.stringify({ profile: { type: "u", handle: "nilufer", public: false } })));
  const r = await run(req("/community/u/nilufer/")); assert.equal(r.status, 302);
});

test("Suchindex-Rueckfall: zweiter Abruf aus dem Kanten-Cache (/__r2f<pfad>, vom Deploy-Purge geleert), gleiche Header", async () => {
  const a = await run(req("/search/manifest.json")); assert.equal(await a.text(), '{"parts":2}'); assert.equal(a.headers.get("access-control-allow-origin"), "*");
  assert.equal(a.headers.get("x-m365-cache"), "MISS"); assert.equal(a.headers.get("cache-control"), "public, max-age=300, s-maxage=600");
  gets = [];
  const b = await run(req("/search/manifest.json")); assert.equal(await b.text(), '{"parts":2}'); assert.equal(b.headers.get("x-m365-cache"), "HIT");
  assert.equal(b.headers.get("x-robots-tag"), "noindex"); assert.deepEqual(gets.filter((k) => k.startsWith("pages/search/")), []);
  assert.ok(store.has("https://www.m365.fm/__r2f/search/manifest.json"));
  const h = await run(req("/search/manifest.json", "HEAD")); assert.equal(await h.text(), "");
  gets = []; const m = await run(req("/search/part-9.json")); assert.equal(m.status, 404); assert.ok(!store.has("https://www.m365.fm/__r2f/search/part-9.json"), "Fehlen nicht gemerkt");
  assert.deepEqual(gets.filter((k) => k.startsWith("pages/search/")), ["pages/search/part-9.json"], "fehlt: Bucket genau einmal, dann GitHub Pages");
  assert.deepEqual(origins.filter((o) => o.startsWith("/search/")), ["/search/part-9.json"], "nur der fehlende Teil fragt GitHub Pages (27.11.: Suchindex zuerst aus R2)");
});

test("R2_EDGE_TTL: /__r2f-Eintraege 1 Tag, gehashte Assets weiter 30 Tage; ohne, ungueltig oder Bau ohne -pfad 4 h", async () => {
  assert.equal(r2EdgeTtl({ R2_EDGE_TTL: "86400" }), 86400); assert.equal(r2EdgeTtl({}), 14400); assert.equal(r2EdgeTtl({ R2_EDGE_TTL: "abc" }), 14400);
  assert.equal(r2EdgeTtl({ R2_EDGE_TTL: "60" }), 14400); assert.equal(r2EdgeTtl({ R2_EDGE_TTL: "9999999" }), 14400); assert.equal(r2EdgeTtl(undefined), 14400);
  await warm();
  await run(req("/de/x/")); assert.equal(store.get("https://www.m365.fm/__r2f/de/x/").headers.get("cache-control"), "public, max-age=86400");
  await run(req("/assets/site.0123456789ab.css")); assert.equal(store.get("https://www.m365.fm/__r2f/assets/site.0123456789ab.css").headers.get("cache-control"), "public, max-age=2592000");
  const b = await run(req("/de/x/")); assert.equal(b.headers.get("cache-control"), "public, max-age=0, s-maxage=600, stale-while-revalidate=86400", "Browser wie bisher");
  store.clear(); __resetR2Ready(); const e1 = { ...env, R2_EDGE_TTL: undefined }; await warm(e1);
  await run(req("/de/x/"), e1); assert.equal(store.get("https://www.m365.fm/__r2f/de/x/").headers.get("cache-control"), "public, max-age=14400");
  store.clear(); __resetR2Ready(); BUILD = "b1"; B["pages/r2-build.txt"] = obj("b1\n", "text/plain"); await warm();
  await run(req("/de/x/")); assert.equal(store.get("https://www.m365.fm/__r2c/@b1/de/x/").headers.get("cache-control"), "public, max-age=14400", "Schluessel mit Bau-Kennung: 4 h");
  B["pages/r2-build.txt"] = obj("b1-pfad\n", "text/plain");
});

test("wrangler.toml: R2_EDGE_TTL = 86400 nur im Live-Teil", () => {
  const t = readFileSync(new URL("../wrangler.toml", import.meta.url), "utf8");
  const live = t.split("[env.staging]")[0];
  assert.match(live, /^R2_EDGE_TTL = "86400"$/m); assert.ok(!/R2_EDGE_TTL/.test(t.split("[env.staging]")[1]));
});
