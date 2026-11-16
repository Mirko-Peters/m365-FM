// Speed-Massnahme 5: Vorabruf der naechsten Seite per Speculation Rules (nur prefetch). Header Speculation-Rules: "/speculation.json" nur auf
// HTML-Seiten (200/304) von www.m365.fm - von GitHub Pages wie aus R2 (R2_PRIMARY=1); nie auf Weiterleitungen, Fehlern, Dateien, partner.m365.fm,
// Staging oder BYOD. /speculation.json beantwortet der Worker selbst (application/speculationrules+json, 1 h Cache, gueltiges JSON).
import { test } from "node:test"; import assert from "node:assert/strict";
const store = new Map(); let origins = 0;
globalThis.caches = { default: { match: async (r) => { const x = store.get(r.url); return x ? x.clone() : undefined; }, put: async (r, res) => { store.set(r.url, res.clone()); } } };
const HTML = { "content-type": "text/html; charset=utf-8" };
globalThis.fetch = async (req) => {
  const r = typeof req === "string" ? new Request(req) : req, u = new URL(r.url);
  if (u.pathname === "/show/redirects.json") return new Response("{}", { headers: { "content-type": "application/json" } });
  if (u.pathname === "/r2-build.txt") return new Response("b1\n", { headers: { "content-type": "text/plain" } });
  origins++;
  if (u.pathname === "/show/episodes/a/") { if (r.headers.get("if-none-match") === '"gh"') return new Response(null, { status: 304, headers: { etag: '"gh"' } }); return new Response("<html>gh</html>", { headers: { ...HTML, etag: '"gh"' } }); }
  if (u.pathname === "/sponsor/dashboard/") return new Response("<html>dash</html>", { headers: HTML });
  if (u.pathname === "/feed.xml") return new Response("<rss/>", { headers: { "content-type": "application/xml" } });
  if (u.pathname === "/episodes.json") return new Response("{}", { headers: { "content-type": "application/json; charset=utf-8" } });
  if (u.pathname === "/assets/site.css") return new Response("a{}", { headers: { "content-type": "text/css" } });
  if (u.pathname === "/callback") return new Response(null, { status: 301, headers: { location: "https://www.m365.fm/callback/" } });
  if (u.pathname === "/speculation.json") return new Response("origin", { headers: { "content-type": "application/json" } });
  return new Response("<html>404</html>", { status: 404, headers: HTML });
};
const { default: W, SPEC_RULES, SPEC_PATH, __resetR2Ready } = await import("../index.js");
const enc = (t) => new TextEncoder().encode(t).buffer;
const obj = (body, ct) => ({ httpEtag: '"r2"', uploaded: new Date("2026-11-16T08:00:00Z"), httpMetadata: { contentType: ct }, customMetadata: {}, arrayBuffer: async () => enc(body), text: async () => body, get body() { return new Response(body).body; } });
const B = {
  "pages/r2-build.txt": obj("b1\n", "text/plain; charset=utf-8"),
  "pages/de/show/episodes/a/index.html": obj("<html>r2 de</html>", "text/html; charset=utf-8"),
  "pages/llms.txt": obj("llms", "text/plain; charset=utf-8"),
};
const PAGES = { get: async (k) => B[k] || null };
const env = { PAGES, MIGRATED: "1", PARTNER_HOST: "partner.m365.fm", PARTNER_REDIRECT: "1" };
const envR2 = { ...env, R2_PRIMARY: "1" };
const req = (path, { host = "www.m365.fm", h = {}, method = "GET" } = {}) => new Request("https://" + host + path, { headers: h, method });
const run = async (r, e = env) => { const w = []; const res = await W.fetch(r, e, { waitUntil: (p) => w.push(p) }); await Promise.all(w); return res; };
const SR = '"/speculation.json"';

test("GitHub Pages: HTML 200 und 304 tragen den Header, HEAD ebenso", async () => {
  store.clear(); __resetR2Ready();
  const a = await run(req("/show/episodes/a/")); assert.equal(a.status, 200); assert.equal(a.headers.get("speculation-rules"), SR);
  assert.equal(await a.text(), "<html>gh</html>", "Inhalt unveraendert");
  assert.equal(a.headers.get("strict-transport-security"), "max-age=31536000; includeSubDomains", "uebrige Header bleiben");
  const b = await run(req("/show/episodes/a/", { h: { "if-none-match": '"gh"' } })); assert.equal(b.status, 304); assert.equal(b.headers.get("speculation-rules"), SR);
  const c = await run(req("/show/episodes/a/", { method: "HEAD" })); assert.equal(c.status, 200); assert.equal(c.headers.get("speculation-rules"), SR); assert.equal(c.body, null);
});
test("R2 als Ursprung (R2_PRIMARY=1): HTML 200 und 304 aus dem Bucket tragen den Header", async () => {
  store.clear(); __resetR2Ready();
  await run(req("/x/"), envR2); await new Promise((r) => setTimeout(r, 10));   // Bau-Kennung im Hintergrund pruefen
  origins = 0;
  const a = await run(req("/de/show/episodes/a/"), envR2); assert.equal(a.status, 200); assert.equal(a.headers.get("x-m365-src"), "r2");
  assert.equal(a.headers.get("speculation-rules"), SR); assert.equal(await a.text(), "<html>r2 de</html>"); assert.equal(origins, 0);
  const b = await run(req("/de/show/episodes/a/", { h: { "if-none-match": '"r2"' } }), envR2); assert.equal(b.status, 304); assert.equal(b.headers.get("speculation-rules"), SR);
  const t = await run(req("/llms.txt"), envR2); assert.equal(t.headers.get("x-m365-src"), "r2"); assert.equal(t.headers.get("speculation-rules"), null, "Datei aus R2: kein Header");
});
test("kein Header auf Dateien, Weiterleitungen, 404 und POST", async () => {
  store.clear(); __resetR2Ready();
  for (const p of ["/feed.xml", "/episodes.json", "/assets/site.css"]) { const r = await run(req(p)); assert.equal(r.status, 200, p); assert.equal(r.headers.get("speculation-rules"), null, p); }
  const nf = await run(req("/gibt-es-nicht/")); assert.equal(nf.status, 404); assert.equal(nf.headers.get("speculation-rules"), null);
  const rd = await run(req("/callback")); assert.equal(rd.status, 301); assert.equal(rd.headers.get("speculation-rules"), null);
  const en = await run(req("/en/show/")); assert.ok(en.status >= 300 && en.status < 400, "Regel /en/ -> /"); assert.equal(en.headers.get("speculation-rules"), null);
  const dash = await run(req("/sponsor/dashboard/")); assert.equal(dash.status, 301, "Dashboard -> partner.m365.fm"); assert.equal(dash.headers.get("speculation-rules"), null);
  const old = await run(req("/show/episodes/a/", { host: "dub.m365.fm" })); assert.equal(old.status, 301, "alter Host"); assert.equal(old.headers.get("speculation-rules"), null);
  const post = await run(req("/show/episodes/a/", { method: "POST" })); assert.equal(post.headers.get("speculation-rules"), null);
  const sr = await run(req("/speculation.json")); assert.equal(sr.headers.get("speculation-rules"), null, "die Regeln selbst sind keine Seite");
});
test("nicht auf partner.m365.fm, Staging und img.m365.fm", async () => {
  store.clear(); __resetR2Ready();
  const p = await run(req("/", { host: "partner.m365.fm" })); assert.equal(p.status, 200); assert.match(await p.text(), /dash/);
  assert.equal(p.headers.get("speculation-rules"), null, "Partner-Seite: kein Vorabruf");
  const sj = await run(req("/speculation.json", { host: "partner.m365.fm" })); assert.equal(sj.status, 302, "Regeln gibt es nur auf www");
  const st = await run(req("/de/show/episodes/a/", { host: "staging.m365.fm" }), { ENVIRONMENT: "staging", PAGES }); assert.equal(st.status, 200);
  assert.equal(st.headers.get("speculation-rules"), null);
  const im = await run(req("/pages/x/", { host: "img.m365.fm" })); assert.equal(im.headers.get("speculation-rules"), null);
});
test("/speculation.json: vom Worker, application/speculationrules+json, 1 h Cache, gueltiges JSON mit den Regeln", async () => {
  store.clear(); __resetR2Ready(); origins = 0;
  for (const e of [env, envR2]) {
    const r = await run(req(SPEC_PATH), e); assert.equal(r.status, 200);
    assert.equal(r.headers.get("content-type"), "application/speculationrules+json");
    assert.equal(r.headers.get("cache-control"), "public, max-age=3600");
    assert.equal(r.headers.get("x-content-type-options"), "nosniff");
    const j = JSON.parse(await r.text()); assert.deepEqual(j, SPEC_RULES);
  }
  assert.equal(origins, 0, "weder GitHub Pages noch R2 gefragt");
  const h = await run(req(SPEC_PATH, { method: "HEAD" })); assert.equal(h.status, 200); assert.equal(h.body, null);
  const http = await run(new Request("http://www.m365.fm/speculation.json")); assert.equal(http.status, 301, "http -> https wie ueberall");
});
test("Regeln: nur prefetch (nie prerender), moderate, Ausnahmen fuer Anmeldung, Zaehler, Query und Dateien", () => {
  assert.deepEqual(Object.keys(SPEC_RULES), ["prefetch"]);
  const [rule] = SPEC_RULES.prefetch; assert.equal(rule.eagerness, "moderate");
  const [same, notHref, notSel] = rule.where.and;
  assert.deepEqual(same, { href_matches: "/*" }, "relativ zu /speculation.json: nur www.m365.fm, fremde Hosts (c.m365.fm, api-dub) nie");
  const ex = notHref.not.href_matches;
  for (const p of ["/community/*", "/*/community/*", "/api/*", "/auth/*", "/admin/*", "/callback/*", "/einladung/*", "/redaktion/*", "/*/redaktion/*",
    "/moderation/*", "/*/moderation/*", "/sponsor/dashboard/*", "/*/sponsor/dashboard/*", "/search/*", "/*/search/*"]) assert.ok(ex.includes(p), p);
  assert.ok(ex.includes("/*\\?(.+)"), "Query ausgeschlossen");
  assert.ok(!ex.includes("/*\\?*"), "'/*\\?*' passt (Suche '*') auch ohne Query und schaltete jeden Vorabruf ab");
  assert.equal(notSel.not.selector_matches, "[rel~=nofollow],[download],[target=_blank],[data-no-prefetch]");
});
// Mit URLPattern (Node >= 23.8, Browser): die Regeln wie der Browser auswerten. Node 22 (CI) hat es noch nicht -> uebersprungen.
test("Regeln wie im Browser ausgewertet (URLPattern)", { skip: typeof URLPattern === "undefined" && "URLPattern fehlt in dieser Node-Fassung" }, () => {
  const base = "https://www.m365.fm" + SPEC_PATH, [rule] = SPEC_RULES.prefetch, [same, notHref] = rule.where.and;
  const ok = (u) => new URLPattern(same.href_matches, base).test(u) && !notHref.not.href_matches.some((p) => new URLPattern(p, base).test(u));
  for (const u of ["/", "/de/", "/show/episodes/a/", "/de/show/episodes/a/", "/entity/sharepoint/", "/show/#x"]) assert.ok(ok("https://www.m365.fm" + u), u);
  for (const u of ["/community/", "/de/community/u/a/", "/einladung/abc/", "/sponsor/dashboard/", "/de/sponsor/dashboard/report/", "/search/?q=x", "/admin/",
    "/de/redaktion/", "/show/?utm_source=x", "/feed.xml", "/episodes.json", "/og/a.jpg", "/media.pdf"]) assert.ok(!ok("https://www.m365.fm" + u), u);
  for (const u of ["https://c.m365.fm/abc", "https://api-dub.m365.fm/go/abc", "https://partner.m365.fm/"]) assert.ok(!ok(u), u);
});
