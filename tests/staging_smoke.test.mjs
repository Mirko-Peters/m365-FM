// tools/staging_smoke.mjs gegen lokale Attrappen von staging.m365.fm und api-staging.m365.fm (kein Netz). Prueft auch: Access-Header, Live-Hosts abgelehnt.
import { test } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { runSmoke, checkHost, accessHeaders, locsOf, KINDS } from "../tools/staging_smoke.mjs";

const NOINDEX = { "x-robots-tag": "noindex, nofollow" };
function serve(handler) {
  return new Promise((resolve) => {
    const srv = http.createServer(handler);
    srv.listen(0, "127.0.0.1", () => resolve({ srv, url: `http://127.0.0.1:${srv.address().port}` }));
  });
}
const html = "<!doctype html><html><body>x</body></html>";

function fakes({ needAccess = false, broken = new Set(), noSitemap = false, noEntity = false } = {}) {
  const seen = { site: [], api: [] };
  const guard = (req, res) => {
    if (needAccess && !(req.headers["cf-access-client-id"] === "id1" && req.headers["cf-access-client-secret"] === "sec1")) { res.writeHead(403); res.end("access"); return false; }
    return true;
  };
  const site = (req, res) => {
    seen.site.push(req.url);
    if (!guard(req, res)) return;
    const u = req.url;
    if (broken.has(u)) { res.writeHead(404, NOINDEX); return res.end("nf"); }
    if (u === "/robots.txt") { res.writeHead(200, { "content-type": "text/plain", ...NOINDEX }); return res.end("User-agent: *\nDisallow: /\n"); }
    if (u === "/sitemap.xml") {
      if (noSitemap) { res.writeHead(404); return res.end(); }
      res.writeHead(200, { "content-type": "application/xml", ...NOINDEX });
      return res.end(`<sitemapindex><sitemap><loc>https://staging.m365.fm/sitemap-1.xml</loc></sitemap></sitemapindex>`);
    }
    if (u === "/sitemap-1.xml") {
      res.writeHead(200, { "content-type": "application/xml", ...NOINDEX });
      return res.end(`<urlset><url><loc>https://staging.m365.fm/de/community/</loc></url><url><loc>https://staging.m365.fm/show/episodes/copilot-erklaert/</loc></url>${noEntity ? "" : "<url><loc>https://staging.m365.fm/entity/copilot/</loc></url>"}<url><loc>https://staging.m365.fm/community/events/m365con-2027/</loc></url></urlset>`);
    }
    res.writeHead(200, { "content-type": "text/html; charset=utf-8", ...NOINDEX }); res.end(html);
  };
  const api = (req, res) => {
    seen.api.push(req.url);
    if (!guard(req, res)) return;
    const j = (o, s = 200) => { res.writeHead(s, { "content-type": "application/json", ...NOINDEX }); res.end(JSON.stringify(o)); };
    if (broken.has("api" + req.url)) return j({ error: "server" }, 500);
    if (req.url === "/api/health") return j({ ok: true });
    if (req.url === "/api/events/export") return j({ events: [] });
    if (req.url === "/robots.txt") { res.writeHead(200, { "content-type": "text/plain", ...NOINDEX }); return res.end("User-agent: *\nDisallow: /\n"); }
    j({ error: "not_found" }, 404);
  };
  return { site, api, seen };
}

async function withServers(opts, fn) {
  const f = fakes(opts), a = await serve(f.site), b = await serve(f.api);
  try { return await fn({ site: a.url, api: b.url, seen: f.seen }); } finally { a.srv.close(); b.srv.close(); }
}
const run = (s, extra = {}) => runSmoke({ site: s.site, api: s.api, extraAllowed: ["127.0.0.1"], delayMs: 5, retries: 2, log: () => {}, ...extra });

test("alles in Ordnung: Startseiten, Stichprobe aus dem Sitemap, API", async () => {
  await withServers({}, async (s) => {
    const r = await run(s);
    assert.equal(r.ok, true, JSON.stringify(r.results.filter((x) => !x.ok)));
    const names = r.results.map((x) => x.name).join("\n");
    for (const n of ["API /api/health", "API /api/events/export", "Startseite (en)", "Startseite (de)", "Folgenseite", "Entitaetsseite", "Eventseite", "robots.txt"]) assert.match(names, new RegExp(n.replace(/[()/]/g, "\\$&")));
    assert.ok(s.seen.site.includes("/show/episodes/copilot-erklaert/") && s.seen.site.includes("/entity/copilot/") && s.seen.site.includes("/community/events/m365con-2027/"));
  });
});

test("ein Fehler in der API laesst den Rauchtest scheitern", async () => {
  await withServers({ broken: new Set(["api/api/events/export"]) }, async (s) => {
    const r = await run(s);
    assert.equal(r.ok, false);
    assert.ok(r.results.some((x) => !x.ok && /events\/export/.test(x.name)));
  });
});

test("eine fehlende Seite laesst ihn scheitern", async () => {
  await withServers({ broken: new Set(["/entity/copilot/"]) }, async (s) => {
    const r = await run(s);
    assert.equal(r.ok, false);
    assert.ok(r.results.some((x) => !x.ok && /Entitaetsseite/.test(x.name)));
  });
});

test("fehlende Seitenart im Sitemap und fehlendes Sitemap sind Fehler", async () => {
  await withServers({ noEntity: true }, async (s) => { const r = await run(s); assert.equal(r.ok, false); assert.ok(r.results.some((x) => !x.ok && /keine Adresse/.test(x.detail))); });
  await withServers({ noSitemap: true }, async (s) => { assert.equal((await run(s)).ok, false); });
});

test("Cloudflare Access: ohne Token Fehler mit Hinweis, mit Token (Header) grün", async () => {
  await withServers({ needAccess: true }, async (s) => {
    const r1 = await run(s);
    assert.equal(r1.ok, false);
    assert.ok(r1.results.some((x) => /Access/.test(x.detail)), "Hinweis auf STAGING_ACCESS_*");
    const r2 = await run(s, { headers: accessHeaders({ STAGING_ACCESS_ID: "id1", STAGING_ACCESS_SECRET: "sec1" }) });
    assert.equal(r2.ok, true, JSON.stringify(r2.results.filter((x) => !x.ok)));
  });
});

test("accessHeaders nur mit beiden Werten; Werte erscheinen nicht im Protokoll", async () => {
  assert.deepEqual(accessHeaders({}), {}); assert.deepEqual(accessHeaders({ STAGING_ACCESS_ID: "a" }), {});
  assert.deepEqual(accessHeaders({ STAGING_ACCESS_ID: "a", STAGING_ACCESS_SECRET: "b" }), { "CF-Access-Client-Id": "a", "CF-Access-Client-Secret": "b" });
  const lines = [];
  await withServers({ needAccess: true }, async (s) => { await run(s, { headers: accessHeaders({ STAGING_ACCESS_ID: "id1", STAGING_ACCESS_SECRET: "sec1" }), log: (l) => lines.push(l) }); });
  assert.ok(lines.length > 5); assert.ok(lines.every((l) => !/sec1|id1/.test(l)));
});

test("nur Staging-Hosts: Live-Adressen und fremde Hosts werden abgelehnt", () => {
  for (const u of ["https://www.m365.fm", "https://m365.fm/", "https://dub.m365.fm", "https://api-dub.m365.fm", "https://img.m365.fm", "https://example.org"]) assert.throws(() => checkHost(u), /abgelehnt|nur gegen/, u);
  assert.equal(checkHost("https://staging.m365.fm/"), "https://staging.m365.fm");
  assert.equal(checkHost("https://api-staging.m365.fm"), "https://api-staging.m365.fm");
  return assert.rejects(() => runSmoke({ site: "https://www.m365.fm", log: () => {} }), /Live-Adresse/);
});

test("Hilfen: Adressen aus dem Sitemap, Muster der Seitenarten", () => {
  assert.deepEqual(locsOf("<urlset><url><loc> https://a/x/?a=1&amp;b=2 </loc></url></urlset>"), ["https://a/x/?a=1&b=2"]);
  const folge = KINDS[0].rx;
  assert.ok(folge[0].test("/show/episodes/abc-def/") && folge[1].test("/de/ein-langer-folgen-titel/") && !folge[1].test("/de/community/") && !folge[1].test("/de/entity/"));
  assert.ok(KINDS[1].rx[0].test("/de/entity/copilot/") && KINDS[2].rx[0].test("/community/events/x/"));
});
