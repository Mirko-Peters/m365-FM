// admin.m365.fm (Verwaltung) und profile.m365.fm (Konto und Profil): eigene Subdomains wie partner.m365.fm, immer noindex, nur lesen, alte Adressen per 301
// (hinter Schalter), oeffentliche Community-Seiten bleiben auf www.
import { test } from "node:test"; import assert from "node:assert/strict";
globalThis.caches = { default: { match: async () => undefined, put: async () => {} } };
const page = (t) => new Response("<html>" + t + "</html>", { headers: { "content-type": "text/html; charset=utf-8" } });
globalThis.fetch = async (req) => {
  const r = typeof req === "string" ? new Request(req) : req, u = new URL(r.url);
  if (u.pathname === "/show/redirects.json") return new Response("{}", { headers: { "content-type": "application/json" } });
  if (u.pathname === "/assets/a.css") return new Response("a{}", { headers: { "content-type": "text/css" } });
  if (["/admin/", "/community/", "/de/community/", "/ko/community/", "/community/podcast/", "/community/u/max-m/", "/community/members/", "/"].includes(u.pathname)) return page(u.pathname + u.search);
  return new Response("404", { status: 404, headers: { "content-type": "text/html" } });
};
const { default: W, wwwToAdmin, adminToWww, wwwToProfile, profileToWww, gateSnippet } = await import("../index.js");
import vm from "node:vm";
const E = { MIGRATED: "1", ADMIN_HOST: "admin.m365.fm", ADMIN_REDIRECT: "1", PROFILE_HOST: "profile.m365.fm", PROFILE_REDIRECT: "1" };
const run = async (url, { method = "GET", headers = {}, e = E } = {}) => { const w = []; const res = await W.fetch(new Request(url, { method, headers }), e, { waitUntil: (p) => w.push(p) }); await Promise.all(w); return res; };

test("admin: Pfade eindeutig zwischen www und admin", () => {
  assert.equal(wwwToAdmin("/admin/"), "/"); assert.equal(wwwToAdmin("/admin"), "/");
  assert.equal(adminToWww("/"), "/admin/"); assert.equal(adminToWww("/admin/"), "/admin/");
  for (const p of ["/admin/x/", "/de/admin/", "/administrator/", "/community/", "/"]) assert.equal(wwwToAdmin(p), "", p);
  for (const p of ["/x/", "/de/", "/admin/x/", "//evil.example/", "/assets/a.css"]) assert.equal(adminToWww(p), "", p);
});
test("profile: Pfade eindeutig zwischen www und profile, nur die App, nicht die oeffentlichen Seiten", () => {
  const pairs = [["/community/", "/"], ["/de/community/", "/de/"], ["/ko/community/", "/ko/"]];
  for (const [www, p] of pairs) { assert.equal(wwwToProfile(www), p, www); assert.equal(profileToWww(p), www, p); }
  assert.equal(wwwToProfile("/community"), "/"); assert.equal(profileToWww("/community/"), "/community/", "lange Form wird angenommen");
  for (const p of ["/community/podcast/", "/community/u/max-m/", "/community/members/", "/de/community/u/x/", "/xx/community/", "/en/community/", "/communityx/", "/", "/de/"]) assert.equal(wwwToProfile(p), "", p);
  for (const p of ["/podcast/", "/community/u/max-m/", "/en/", "/xx/", "//evil.example/", "/de/foo/"]) assert.equal(profileToWww(p), "", p);
});
test("admin.m365.fm und profile.m365.fm zeigen die App-Seiten, noindex, nur lesen", async () => {
  for (const [url, body] of [["https://admin.m365.fm/", "/admin/"], ["https://profile.m365.fm/", "/community/"], ["https://profile.m365.fm/de/?invite=abc", "/de/community/"]]) {
    const r = await run(url); assert.equal(r.status, 200, url); assert.equal((await r.text()).replace(/<style id="m365-gate-css">.*<\/script>/s, ""), "<html>" + body + "</html>", url);   // bis auf die Anmelde-Sperre im <head>
    assert.match(r.headers.get("x-robots-tag"), /noindex/, url);
    assert.equal(r.headers.get("strict-transport-security") !== null, true, "Sicherheitsheader bleiben");
  }
  for (const h of ["admin.m365.fm", "profile.m365.fm"]) {
    let r = await run("https://" + h + "/", { method: "HEAD" }); assert.equal(r.status, 200); assert.equal(await r.text(), "");
    for (const m of ["POST", "PUT", "DELETE"]) { r = await run("https://" + h + "/", { method: m }); assert.equal(r.status, 405, h + m); assert.equal(r.headers.get("allow"), "GET, HEAD"); }
  }
});
test("robots.txt sperrt alles, keine Sitemap, fremde Pfade gehen zur Website, kein offener Redirect", async () => {
  for (const h of ["admin.m365.fm", "profile.m365.fm"]) {
    let r = await run("https://" + h + "/robots.txt"); assert.equal(r.status, 200); assert.match(await r.text(), /Disallow: \//);
    for (const p of ["/sitemap.xml", "/sitemap-1.xml"]) { r = await run("https://" + h + p); assert.equal(r.status, 404, p); assert.match(r.headers.get("x-robots-tag"), /noindex/); }
    r = await run("https://" + h + "/entity/x/?a=1"); assert.equal(r.status, 302); assert.equal(r.headers.get("location"), "https://www.m365.fm/entity/x/?a=1");
    assert.match(r.headers.get("x-robots-tag"), /noindex/); assert.equal(r.headers.get("cache-control"), "no-store");
    r = await run("https://" + h + "//evil.example/"); assert.equal(r.status, 302); assert.equal(new URL(r.headers.get("location")).origin, "https://www.m365.fm");
    r = await run("https://" + h + "/assets/a.css"); assert.equal(r.status, 200); assert.equal(await r.text(), "a{}");
  }
});
test("profile: oeffentliche Community-Seiten gehoeren nicht auf die Subdomain (302 zu www)", async () => {
  for (const p of ["/community/podcast/", "/community/u/max-m/", "/community/members/"]) {
    const r = await run("https://profile.m365.fm" + p); assert.equal(r.status, 302, p); assert.equal(r.headers.get("location"), "https://www.m365.fm" + p);
  }
});
test("alte Adressen auf www/m365.fm/dub leiten mit 301 um, sonst nichts; Schalter *_REDIRECT=0 und fehlender Host", async () => {
  for (const [from, to] of [["https://www.m365.fm/admin/", "https://admin.m365.fm/"], ["https://m365.fm/admin", "https://admin.m365.fm/"],
    ["https://www.m365.fm/community/", "https://profile.m365.fm/"], ["https://www.m365.fm/de/community/?invite=abc", "https://profile.m365.fm/de/?invite=abc"], ["https://dub.m365.fm/ko/community/", "https://profile.m365.fm/ko/"]]) {
    const r = await run(from); assert.equal(r.status, 301, from); assert.equal(r.headers.get("location"), to);
  }
  for (const u of ["https://www.m365.fm/", "https://www.m365.fm/community/podcast/", "https://www.m365.fm/community/u/max-m/", "https://www.m365.fm/community/members/"])
    assert.notEqual((await run(u)).status, 301, u);
  assert.notEqual((await run("https://www.m365.fm/admin/", { method: "POST" })).status, 301, "nur GET/HEAD");
  assert.notEqual((await run("https://www.m365.fm/admin/", { e: { ...E, ADMIN_REDIRECT: "0" } })).status, 301, "Schalter aus");
  assert.equal((await run("https://www.m365.fm/community/", { e: { ...E, ADMIN_REDIRECT: "0" } })).status, 301, "Schalter gelten je Adresse");
  assert.notEqual((await run("https://www.m365.fm/community/", { e: { ...E, PROFILE_REDIRECT: "0" } })).status, 301, "Schalter aus");
  assert.notEqual((await run("https://www.m365.fm/admin/", { e: { MIGRATED: "1" } })).status, 301, "ohne Host nichts");
});
test("keine Schleife: Anfragen der Subdomain tragen den Schutz-Header und werden nicht zurueckgeleitet", async () => {
  const r = await run("https://www.m365.fm/admin/", { headers: { "x-partner-rewrite": "1" } });
  assert.equal(r.status, 200, "mit Schutz-Header kein 301");
});

// ---- Anmelde-Sperre: ohne Anmeldung (bei admin: ohne Admin) nur die Knoepfe Google, Microsoft, LinkedIn, GitHub
test("Anmelde-Sperre: Seite mit Sperre im <head>, nie no-cache-Luecke; Dateien und andere Hosts unberuehrt", async () => {
  const hdr = { "content-type": "text/html; charset=utf-8" };
  globalThis.fetch = async (req) => { const u = new URL(typeof req === "string" ? req : req.url); if (u.pathname === "/admin/" || u.pathname === "/community/") return new Response("<html><head><title>t</title></head><body>x</body></html>", { headers: hdr }); if (u.pathname === "/assets/a.css") return new Response("a{}", { headers: { "content-type": "text/css" } }); if (u.pathname === "/show/redirects.json") return new Response("{}"); return new Response("404", { status: 404, headers: hdr }); };
  for (const [url, kind] of [["https://admin.m365.fm/", "admin"], ["https://profile.m365.fm/", "profile"]]) {
    const r = await run(url), t = await r.text();
    assert.equal(r.status, 200); assert.match(t, /<style id="m365-gate-css">/); assert.ok(t.indexOf("m365-gate-js") < t.indexOf("</head>"), "Sperre im <head>");
    assert.ok(t.includes(`K="${kind}"`), kind); assert.equal(r.headers.get("cache-control"), "no-store"); assert.equal(r.headers.get("content-length"), null);
    assert.match(r.headers.get("x-robots-tag"), /noindex/);
    const h = await run(url, { method: "HEAD" }); assert.equal(await h.text(), ""); assert.equal(h.status, 200);
    const css = await run(url.slice(0, -1) + "/assets/a.css"); assert.equal(await css.text(), "a{}", "Dateien bleiben unveraendert");
  }
  assert.ok(!(await (await run("https://www.m365.fm/community/")).text()).includes("m365-gate"), "www bleibt wie bisher");
});

// Das eingesetzte Skript in einer kleinen Attrappe des Browsers ausfuehren
function runGate(kind, me, providers) {
  const html = gateSnippet(kind, "https://api-dub.m365.fm"), js = /<script id="m365-gate-js">(.*)<\/script>/s.exec(html)[1];
  const els = []; const mk = (tag) => { const e = { tag, children: [], attrs: {}, className: "", appendChild(c) { this.children.push(c); c.parentNode = this; return c; }, removeChild(c) { this.children = this.children.filter((x) => x !== c); c.parentNode = null; }, setAttribute(k, v) { this.attrs[k] = v; }, getAttribute(k) { return this.attrs[k]; }, querySelectorAll() { return this.children; } }; els.push(e); return e; };
  const body = mk("body"), root = mk("html"); root.className = "";
  const document = { body, documentElement: root, createElement: mk, getElementById: (id) => els.find((e) => e.id === id && e.parentNode), addEventListener() {} };
  const calls = [];
  const fetch = async (u, o) => { calls.push([u, o]); if (/\/api\/me$/.test(u)) return me === "err" ? Promise.reject(new Error("net")) : { ok: me !== "401", json: async () => ({ user: me && me !== "401" ? me : null }) }; return { ok: true, json: async () => ({ providers }) }; };
  vm.runInNewContext(js, { document, fetch, location: { href: "https://" + kind + ".m365.fm/de/?x=1#h" }, encodeURIComponent, Promise, setTimeout, console });
  return { body, root, calls, document };
}
const tick = () => new Promise((r) => setTimeout(r, 5));
test("Anmelde-Sperre: nicht angemeldet = nur vier Knoepfe mit Ruecksprung; Fehler zaehlt als nicht angemeldet", async () => {
  for (const me of [null, "401", "err"]) {
    const g = runGate("profile", me, ["google", "microsoft", "linkedin", "github"]); await tick();
    assert.match(g.root.className, /m365g/, "Seite bleibt ausgeblendet"); const card = g.document.getElementById("m365-gate"); assert.ok(card, "Anmeldekarte da (" + me + ")");
    const links = card.children[0].children; assert.deepEqual(links.map((a) => a.textContent), ["Google", "Microsoft", "LinkedIn", "GitHub"]);
    assert.ok(links.every((a) => a.href.startsWith("https://api-dub.m365.fm/auth/login/") && a.href.endsWith("?return=" + encodeURIComponent("https://profile.m365.fm/de/?x=1"))));
    assert.ok(g.calls.find((c) => /\/api\/me$/.test(c[0]))[1].credentials === "include");
  }
  const g = runGate("admin", null, ["google", "github"]); await tick();
  assert.deepEqual(g.document.getElementById("m365-gate").children[0].children.map((a) => a.textContent), ["Google", "GitHub"], "nicht eingerichtete Anbieter entfallen");
});
test("Anmelde-Sperre: angemeldet gibt die Seite frei; admin nur fuer Admins", async () => {
  let g = runGate("profile", { id: 7, name: "A" }, []); await tick(); assert.doesNotMatch(g.root.className, /m365g/); assert.ok(!g.document.getElementById("m365-gate"));
  g = runGate("admin", { id: 7, name: "A", admin: false }, []); await tick(); assert.match(g.root.className, /m365g/, "Mitglied ohne Admin bleibt gesperrt"); assert.ok(g.document.getElementById("m365-gate"));
  g = runGate("admin", { id: 1, name: "M", admin: true }, []); await tick(); assert.doesNotMatch(g.root.className, /m365g/, "Admin sieht die Verwaltung");
});
