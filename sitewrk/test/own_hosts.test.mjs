// admin.m365.fm (Verwaltung) und profil.m365.fm (Konto und Profil): eigene Subdomains wie partner.m365.fm, immer noindex, nur lesen, alte Adressen per 301
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
const { default: W, wwwToAdmin, adminToWww, wwwToProfil, profilToWww } = await import("../index.js");
const E = { MIGRATED: "1", ADMIN_HOST: "admin.m365.fm", ADMIN_REDIRECT: "1", PROFIL_HOST: "profil.m365.fm", PROFIL_REDIRECT: "1" };
const run = async (url, { method = "GET", headers = {}, e = E } = {}) => { const w = []; const res = await W.fetch(new Request(url, { method, headers }), e, { waitUntil: (p) => w.push(p) }); await Promise.all(w); return res; };

test("admin: Pfade eindeutig zwischen www und admin", () => {
  assert.equal(wwwToAdmin("/admin/"), "/"); assert.equal(wwwToAdmin("/admin"), "/");
  assert.equal(adminToWww("/"), "/admin/"); assert.equal(adminToWww("/admin/"), "/admin/");
  for (const p of ["/admin/x/", "/de/admin/", "/administrator/", "/community/", "/"]) assert.equal(wwwToAdmin(p), "", p);
  for (const p of ["/x/", "/de/", "/admin/x/", "//evil.example/", "/assets/a.css"]) assert.equal(adminToWww(p), "", p);
});
test("profil: Pfade eindeutig zwischen www und profil, nur die App, nicht die oeffentlichen Seiten", () => {
  const pairs = [["/community/", "/"], ["/de/community/", "/de/"], ["/ko/community/", "/ko/"]];
  for (const [www, p] of pairs) { assert.equal(wwwToProfil(www), p, www); assert.equal(profilToWww(p), www, p); }
  assert.equal(wwwToProfil("/community"), "/"); assert.equal(profilToWww("/community/"), "/community/", "lange Form wird angenommen");
  for (const p of ["/community/podcast/", "/community/u/max-m/", "/community/members/", "/de/community/u/x/", "/xx/community/", "/en/community/", "/communityx/", "/", "/de/"]) assert.equal(wwwToProfil(p), "", p);
  for (const p of ["/podcast/", "/community/u/max-m/", "/en/", "/xx/", "//evil.example/", "/de/foo/"]) assert.equal(profilToWww(p), "", p);
});
test("admin.m365.fm und profil.m365.fm zeigen die App-Seiten, noindex, nur lesen", async () => {
  for (const [url, body] of [["https://admin.m365.fm/", "/admin/"], ["https://profil.m365.fm/", "/community/"], ["https://profil.m365.fm/de/?invite=abc", "/de/community/"]]) {
    const r = await run(url); assert.equal(r.status, 200, url); assert.equal(await r.text(), "<html>" + body + "</html>", url);
    assert.match(r.headers.get("x-robots-tag"), /noindex/, url);
    assert.equal(r.headers.get("strict-transport-security") !== null, true, "Sicherheitsheader bleiben");
  }
  for (const h of ["admin.m365.fm", "profil.m365.fm"]) {
    let r = await run("https://" + h + "/", { method: "HEAD" }); assert.equal(r.status, 200); assert.equal(await r.text(), "");
    for (const m of ["POST", "PUT", "DELETE"]) { r = await run("https://" + h + "/", { method: m }); assert.equal(r.status, 405, h + m); assert.equal(r.headers.get("allow"), "GET, HEAD"); }
  }
});
test("robots.txt sperrt alles, keine Sitemap, fremde Pfade gehen zur Website, kein offener Redirect", async () => {
  for (const h of ["admin.m365.fm", "profil.m365.fm"]) {
    let r = await run("https://" + h + "/robots.txt"); assert.equal(r.status, 200); assert.match(await r.text(), /Disallow: \//);
    for (const p of ["/sitemap.xml", "/sitemap-1.xml"]) { r = await run("https://" + h + p); assert.equal(r.status, 404, p); assert.match(r.headers.get("x-robots-tag"), /noindex/); }
    r = await run("https://" + h + "/entity/x/?a=1"); assert.equal(r.status, 302); assert.equal(r.headers.get("location"), "https://www.m365.fm/entity/x/?a=1");
    assert.match(r.headers.get("x-robots-tag"), /noindex/); assert.equal(r.headers.get("cache-control"), "no-store");
    r = await run("https://" + h + "//evil.example/"); assert.equal(r.status, 302); assert.equal(new URL(r.headers.get("location")).origin, "https://www.m365.fm");
    r = await run("https://" + h + "/assets/a.css"); assert.equal(r.status, 200); assert.equal(await r.text(), "a{}");
  }
});
test("profil: oeffentliche Community-Seiten gehoeren nicht auf die Subdomain (302 zu www)", async () => {
  for (const p of ["/community/podcast/", "/community/u/max-m/", "/community/members/"]) {
    const r = await run("https://profil.m365.fm" + p); assert.equal(r.status, 302, p); assert.equal(r.headers.get("location"), "https://www.m365.fm" + p);
  }
});
test("alte Adressen auf www/m365.fm/dub leiten mit 301 um, sonst nichts; Schalter *_REDIRECT=0 und fehlender Host", async () => {
  for (const [from, to] of [["https://www.m365.fm/admin/", "https://admin.m365.fm/"], ["https://m365.fm/admin", "https://admin.m365.fm/"],
    ["https://www.m365.fm/community/", "https://profil.m365.fm/"], ["https://www.m365.fm/de/community/?invite=abc", "https://profil.m365.fm/de/?invite=abc"], ["https://dub.m365.fm/ko/community/", "https://profil.m365.fm/ko/"]]) {
    const r = await run(from); assert.equal(r.status, 301, from); assert.equal(r.headers.get("location"), to);
  }
  for (const u of ["https://www.m365.fm/", "https://www.m365.fm/community/podcast/", "https://www.m365.fm/community/u/max-m/", "https://www.m365.fm/community/members/"])
    assert.notEqual((await run(u)).status, 301, u);
  assert.notEqual((await run("https://www.m365.fm/admin/", { method: "POST" })).status, 301, "nur GET/HEAD");
  assert.notEqual((await run("https://www.m365.fm/admin/", { e: { ...E, ADMIN_REDIRECT: "0" } })).status, 301, "Schalter aus");
  assert.equal((await run("https://www.m365.fm/community/", { e: { ...E, ADMIN_REDIRECT: "0" } })).status, 301, "Schalter gelten je Adresse");
  assert.notEqual((await run("https://www.m365.fm/community/", { e: { ...E, PROFIL_REDIRECT: "0" } })).status, 301, "Schalter aus");
  assert.notEqual((await run("https://www.m365.fm/admin/", { e: { MIGRATED: "1" } })).status, 301, "ohne Host nichts");
});
test("keine Schleife: Anfragen der Subdomain tragen den Schutz-Header und werden nicht zurueckgeleitet", async () => {
  const r = await run("https://www.m365.fm/admin/", { headers: { "x-partner-rewrite": "1" } });
  assert.equal(r.status, 200, "mit Schutz-Header kein 301");
});
