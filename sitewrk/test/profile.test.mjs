// Live-Profilseite (Rueckfall fuer /community/u/<kuerzel>/, solange der Seitenbau sie noch nicht erzeugt hat): oeffentliches Profil -> 200,
// sonst und bei jedem API-Fehler das normale 404; alles escaped; noindex und no-store.
import { test, beforeEach } from "node:test"; import assert from "node:assert/strict";
const store = new Map(); let apiCalls = [], apiMode = null;
globalThis.caches = { default: { match: async (r) => { const x = store.get(r.url); return x ? x.clone() : undefined; }, put: async (r, res) => { store.set(r.url, res.clone()); } } };
const PUB = (o = {}) => ({ profile: { type: "u", handle: "nilufer", name: "Nilufer Aydin", headline: "Copilot Trainerin", about: "Zeile 1\nZeile 2", company: "Contoso", job: "Beraterin", country: "Germany", public: true, show_org: true, org: null,
  img: 123, channels: [{ kind: "linkedin", url: "https://www.linkedin.com/in/nilufer/", followers: 1500 }], i18n: { de: { headline: "Copilot-Trainerin", about: "Über mich auf Deutsch" } },
  contact: { email: "geheim@example.com", phone: "+49 123" }, items: [{ title: "Ein gezogener Beitrag" }], recs: [{ body: "Empfehlung" }], ...o } });
globalThis.fetch = async (req) => {
  const r = typeof req === "string" ? new Request(req) : req, u = new URL(r.url);
  if (u.hostname === "api-dub.m365.fm") {
    apiCalls.push(u.pathname);
    if (apiMode === "throw") throw new Error("netz weg");
    if (apiMode === "500") return new Response("kaputt", { status: 500 });
    if (apiMode === "badjson") return new Response("<html>nope", { status: 200, headers: { "content-type": "application/json" } });
    if (apiMode === "private") return new Response('{"error":"not_found"}', { status: 404, headers: { "content-type": "application/json" } });
    if (apiMode && typeof apiMode === "object") return new Response(JSON.stringify(apiMode), { status: 200, headers: { "content-type": "application/json" } });
    const m = /^\/api\/profile\/([a-z0-9-]+)$/.exec(u.pathname);
    if (m && m[1] === "nilufer") return new Response(JSON.stringify(PUB()), { headers: { "content-type": "application/json" } });
    return new Response('{"error":"not_found"}', { status: 404, headers: { "content-type": "application/json" } });
  }
  if (u.pathname === "/show/redirects.json") return new Response("{}", { headers: { "content-type": "application/json" } });
  if (u.pathname === "/community/u/gebaut/") return new Response("<html>fest</html>", { headers: { "content-type": "text/html; charset=utf-8" } });
  return new Response("404", { status: 404, headers: { "content-type": "text/html" } });
};
const { default: W } = await import("../index.js");
const env = { MIGRATED: "1" };
const req = (path, method = "GET") => new Request("https://www.m365.fm" + path, { method });
const run = async (r) => { const w = []; const res = await W.fetch(r, env, { waitUntil: (p) => w.push(p) }); await Promise.all(w); return res; };
beforeEach(() => { store.clear(); apiCalls = []; apiMode = null; });

test("oeffentliches Profil ohne feste Seite: 200 aus dem Community-API, Namen und Texte stehen drin", async () => {
  const r = await run(req("/community/u/nilufer/")); assert.equal(r.status, 200);
  assert.match(r.headers.get("content-type"), /text\/html/);
  const t = await r.text();
  assert.match(t, /<h1[^>]*>Nilufer Aydin<\/h1>/); assert.match(t, /Copilot Trainerin/); assert.match(t, /Zeile 1\nZeile 2/); assert.match(t, /Contoso/); assert.match(t, /Germany/);
  assert.match(t, /<html lang="en"/); assert.match(t, /href="\/community\/members\/"/); assert.match(t, /linkedin\.com\/in\/nilufer\//);
  assert.match(t, /https:\/\/api-dub\.m365\.fm\/api\/img\/u\/nilufer\.jpg\?v=123/);
  assert.deepEqual(apiCalls, ["/api/profile/nilufer"]);
});
test("nur Felder der statischen Seite: keine Kontaktdaten, keine Empfehlungen, keine gezogenen Beitraege", async () => {
  const t = await (await run(req("/community/u/nilufer/"))).text();
  assert.ok(!/geheim@example|\+49 123|Empfehlung|gezogener Beitrag/.test(t));
});
test("Sprache aus dem Praefix: de deutsch mit Profiltext auf Deutsch, andere Sprachen englisch; Rueckweg zum Verzeichnis mit Praefix", async () => {
  let r = await run(req("/de/community/u/nilufer/")); assert.equal(r.status, 200);
  let t = await r.text();
  assert.match(t, /<html lang="de"/); assert.match(t, /Über mich/); assert.match(t, /Mitglieder/); assert.match(t, /Copilot-Trainerin/); assert.match(t, /Über mich auf Deutsch/);
  assert.match(t, /href="\/de\/community\/members\/"/); assert.match(t, /Firma/);
  r = await run(req("/fr/community/u/nilufer/")); assert.equal(r.status, 200); t = await r.text();
  assert.match(t, /<html lang="en"/); assert.match(t, />About</); assert.match(t, /href="\/fr\/community\/members\/"/); assert.match(t, /Copilot Trainerin/); assert.ok(!/Über mich/.test(t));
  assert.equal((await run(req("/community/u/nilufer/index.html"))).status, 200);
});
test("noindex (Header und Meta) und kein Cache; HEAD ohne Inhalt; Sicherheits-Header wie ueberall", async () => {
  const r = await run(req("/community/u/nilufer/"));
  assert.equal(r.headers.get("x-robots-tag"), "noindex"); assert.equal(r.headers.get("cache-control"), "no-store");
  assert.match(await r.text(), /<meta name="robots" content="noindex">/);
  assert.equal(r.headers.get("x-content-type-options"), "nosniff"); assert.ok(r.headers.get("strict-transport-security"));
  const h = await run(req("/de/community/u/nilufer/", "HEAD")); assert.equal(h.status, 200); assert.equal(await h.text(), "");
  assert.equal(h.headers.get("cache-control"), "no-store"); assert.equal(h.headers.get("x-robots-tag"), "noindex");
});
test("nicht oeffentlich oder unbekannt: 404 (kein Live-Profil)", async () => {
  let r = await run(req("/community/u/unbekannt/")); assert.equal(r.status, 404);
  apiMode = "private"; r = await run(req("/de/community/u/nilufer/")); assert.equal(r.status, 404); assert.equal(r.headers.get("x-m365-live"), null);
  // Sicherung: antwortet das API trotzdem mit einem nicht oeffentlichen, fremden oder falsch getypten Profil, bleibt es beim 404
  for (const prof of [{ ...PUB().profile, public: false }, { ...PUB().profile, public: "true" }, { ...PUB().profile, handle: "anderer" }, { ...PUB().profile, type: "o" }]) {
    store.clear(); apiMode = { profile: prof }; assert.equal((await run(req("/community/u/nilufer/"))).status, 404, JSON.stringify([prof.public, prof.handle, prof.type]));
  }
  store.clear(); apiMode = { nope: 1 }; assert.equal((await run(req("/community/u/nilufer/"))).status, 404);
});
test("API-Fehler (Netz, 500, kaputtes JSON): normales 404, nie eine 5xx-Seite", async () => {
  for (const mode of ["throw", "500", "badjson"]) {
    store.clear(); apiMode = mode; const r = await run(req("/community/u/nilufer/")); assert.equal(r.status, 404, mode);
    assert.equal(r.headers.get("x-m365-live"), null);
  }
});
test("XSS: Name, Kopfzeile, Text, Firma, Land, Kanalart und Bild-Kennung werden escaped; nur http/https-Links", async () => {
  const bad = '<script>alert(1)</script>"\'<img src=x onerror=alert(2)>';
  apiMode = { profile: { ...PUB().profile, name: bad, headline: bad, about: bad, company: bad, job: bad, country: bad, org: { handle: "x", name: bad }, img: 5,
    channels: [{ kind: bad, url: "https://example.com/a?x=1&y=\"2\"" }, { kind: "x", url: "javascript:alert(1)" }, { kind: "x", url: "data:text/html,<script>alert(1)</script>" }, { kind: "x", url: "//evil.example/x" }, { kind: "x", url: "ftp://example.com/" }, { kind: "blog", url: "https://example.com/blog" }],
    i18n: { de: { headline: bad, about: bad } } } };
  for (const p of ["/community/u/nilufer/", "/de/community/u/nilufer/", "/ja/community/u/nilufer/"]) {
    store.clear(); const r = await run(req(p)); assert.equal(r.status, 200, p); const t = await r.text();
    assert.ok(!t.includes("<script"), p); assert.ok(!/<img src=x/.test(t), p); assert.ok(!/onerror=alert\(2\)>/.test(t.replace(/&lt;img src=x onerror=alert\(2\)&gt;/g, "")), p);
    assert.ok(t.includes("&lt;script&gt;alert(1)&lt;/script&gt;&quot;&#39;"), p);
    assert.ok(!/href="(javascript|data|ftp):/i.test(t) && !/href="\/\/evil/.test(t), p); assert.match(t, /href="https:\/\/example\.com\/blog"/);
    assert.match(t, /href="https:\/\/example\.com\/a\?x=1&amp;y=%22?2%22?"|href="https:\/\/example\.com\/a\?x=1&amp;y=&quot;2&quot;"/, p);
  }
  // Bild-Kennung nur als ganze Zahl
  store.clear(); apiMode = { profile: { ...PUB().profile, img: '1"><script>x</script>' } }; const t = await (await run(req("/community/u/nilufer/"))).text(); assert.ok(!/<img/.test(t) && !t.includes("<script"));
});
test("nur genau diese Adressen und nur GET/HEAD; ungueltige Kuerzel erreichen das API nie", async () => {
  for (const p of ["/community/u/ni/", "/community/u/Nilufer/", "/community/u/" + "a".repeat(31) + "/", "/community/u/-abc/", "/community/u/nilufer/blog/", "/community/u/nilufer/x/", "/community/u/%3Cscript%3E/", "/xx/community/u/nilufer/", "/community/c/nilufer/", "/community/u/", "/de/de/community/u/nilufer/"])
    assert.equal((await run(req(p))).status, 404, p);
  assert.equal((await run(req("/en/community/u/nilufer/"))).status, 301, "/en/ leitet wie bisher nach /");
  assert.equal(apiCalls.length, 0);
  assert.equal((await run(req("/community/u/nilufer/", "POST"))).status, 404); assert.equal(apiCalls.length, 0);
});
test("gebaute feste Seite hat Vorrang (kein API-Aufruf); danach gilt sie sofort", async () => {
  const r = await run(req("/community/u/gebaut/")); assert.equal(r.status, 200); assert.equal(await r.text(), "<html>fest</html>");
  assert.equal(r.headers.get("x-m365-live"), null); assert.equal(apiCalls.length, 0);
});
test("kein oeffentliches Profil wird kurz gemerkt (API nicht bei jeder Anfrage); ein API-Ausfall wird nicht gemerkt", async () => {
  await run(req("/community/u/unbekannt/")); await run(req("/de/community/u/unbekannt/")); await run(req("/community/u/unbekannt/"));
  assert.equal(apiCalls.length, 1);
  apiMode = "500"; apiCalls = []; await run(req("/community/u/nilufer/")); apiMode = null; const r = await run(req("/community/u/nilufer/"));
  assert.equal(r.status, 200); assert.equal(apiCalls.length, 2);
});
