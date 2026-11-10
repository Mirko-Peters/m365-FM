// Sponsor-Dashboard (Teil 3): echte und gefilterte Klicks mit Quote, Land, Suchbegriffe/Position aus der Search Console,
// Aufnahme von Suchbegriffen ueber die interne Route, Zugriffsschutz. SQLite mit allen Migrationen, kein Netz.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { handleSponsor } from "../src/sponsor.js";
import { adStatsForOrg } from "../src/ads.js";

async function setup() {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:"), dir = new URL("../migrations/", import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(f, dir), "utf-8"));
  const db = { prepare(sql) { const st = raw.prepare(sql); let args = []; const o = { bind(...a) { args = a; return o; },
    all: async () => ({ results: st.all(...args) }), first: async () => st.get(...args) ?? null,
    run: async () => { const r = st.run(...args); return { meta: { changes: Number(r.changes), last_row_id: Number(r.lastInsertRowid) } }; } }; return o; },
  async batch(stmts) { for (const s of stmts) await s.run(); } };
  raw.exec(`
    INSERT INTO users(id,provider,sub,name,role,banned,created) VALUES (1,'google','owner','Owner','user',0,1),(2,'google','admin','Admin','admin',0,1),(3,'google','x','Fremd','user',0,1);
    INSERT INTO orgs(id,handle,name,created) VALUES (1,'cognillo','Cognillo',1),(2,'other-co','Other',1);
    INSERT INTO org_members(org_id,user_id,role,status,created) VALUES (1,1,'owner','active',1),(2,3,'owner','active',1);
    INSERT INTO sponsor_placements(id,org_id,title,channel,langs,start,end,refs,created) VALUES
      ('cog-web',1,'Cognillo Website','website','en','2026-11-01','2026-12-31','{}',1),('other-web',2,'Other','website','en','2026-11-01','2026-12-31','{}',1);
    INSERT INTO sponsor_links(code,org_id,placement_id,target_url,utm,created_at) VALUES ('cog-home',1,'cog-web','https://cognillo.example/','{}',1),('other-home',2,'other-web','https://o.example/','{}',1);
    INSERT INTO sponsor_clicks_daily(day,code,surface,country,clicks,clicks_filtered) VALUES
      ('2026-11-05','cog-home','entity','DE',6,2),('2026-11-06','cog-home','entity','US',3,1),('2026-11-06','cog-home','newsletter','XX',0,4),('2026-11-06','other-home','entity','DE',99,99);
    INSERT INTO sponsor_metrics_daily(placement_id,day,metric,dim,value,source,kind,fetched_at) VALUES
      ('cog-web','2026-11-06','page_views','/entity/cognillo/',40,'cloudflare_rum','measured',1793664000),
      ('cog-web','2026-11-06','gsc_impressions','https://www.m365.fm/entity/cognillo/',500,'gsc','measured',1793664000),
      ('cog-web','2026-11-06','gsc_clicks','https://www.m365.fm/entity/cognillo/',12,'gsc','measured',1793664000);
  `);
  const env = { DB: db, SITE: "https://www.m365.fm", CRON_KEY: "cron" };
  const J = (data, status = 200, headers = {}) => new Response(JSON.stringify(data), { status, headers });
  const call = async (path, method = "GET", user = { id: 1 }, body, headers = {}) => {
    const r = new Request(`https://api.example${path}`, { method, headers: { "content-type": "application/json", "x-requested-with": "m365", ...headers }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
    const res = await handleSponsor(env, r, new URL(r.url), new URL(r.url).pathname, J, user);
    return { status: res.status, json: await res.json().catch(() => null) };
  };
  return { raw, call, db };
}
const Q = "?from=2026-11-01&to=2026-11-30";

test("Dashboard: echte und gefilterte Klicks getrennt, Quote und Land je Platzierung", async () => {
  const { raw, call } = await setup();
  try {
    const { json } = await call("/api/sponsor/dashboard" + Q);
    const org = json.orgs.find((o) => o.handle === "cognillo");
    assert.deepEqual([org.click_quality.real, org.click_quality.filtered], [9, 7], "nur die Links der eigenen Firma");
    assert.equal(org.click_quality.source, "M365.FM-Linkzähler");
    assert.equal(org.click_quality.kind, "measured");
    assert.equal(org.click_quality.filter_kind, "estimated", "die Trennung Mensch/Bot ist eine Schaetzung");
    assert.equal(org.click_quality.as_of, "2026-11-06");
    assert.equal(org.metrics.find((m) => m.key === "link_clicks").value, 9, "Kennzahl 'Klicks zu deiner Website' = echte Klicks");
    const byCountry = Object.fromEntries(org.placements[0].clicks.map((c) => [`${c.surface}/${c.country}`, [c.clicks, c.clicks_filtered]]));
    assert.deepEqual(byCountry, { "entity/DE": [6, 2], "entity/US": [3, 1], "newsletter/XX": [0, 4] });
    // fremde Firma sieht nur ihre eigenen Zahlen
    const other = (await call("/api/sponsor/dashboard" + Q, "GET", { id: 3 })).json.orgs[0];
    assert.deepEqual([other.handle, other.click_quality.real, other.click_quality.filtered], ["other-co", 99, 99]);
    // ohne Klicks: 0 / 0, nichts erfunden
    raw.exec("DELETE FROM sponsor_clicks_daily");
    const empty = (await call("/api/sponsor/dashboard" + Q)).json.orgs[0];
    assert.deepEqual([empty.click_quality.real, empty.click_quality.filtered, empty.click_quality.as_of], [0, 0, null]);
    assert.equal(empty.metrics.find((m) => m.key === "link_clicks").value, null);
  } finally { raw.close(); }
});

test("Suchbegriffe: interne Route nimmt nur Search-Console-Zeilen mit gueltigen Werten, Dashboard gewichtet die Position", async () => {
  const { raw, call } = await setup();
  try {
    const row = (o = {}) => ({ placement_id: "cog-web", day: "2026-11-06", query: "sharepoint oversharing", page: "https://www.m365.fm/entity/oversharing/", clicks: 2, impressions: 60, position: 5, source: "gsc", kind: "measured", ...o });
    const post = (queries, key = "cron") => call("/api/internal/sponsor-metrics", "POST", null, { queries }, key ? { "x-cron-key": key } : {});
    assert.equal((await post([row()], "")).status, 403);
    assert.equal((await post([row()], "falsch")).status, 403);
    for (const bad of [row({ source: "bing_webmaster" }), row({ day: "morgen" }), row({ query: "" }), row({ clicks: -1 }), row({ position: "x" }), row({ kind: "magic" }), row({ page: "" })]) {
      assert.equal((await post([bad])).status, 400, JSON.stringify(bad));
    }
    assert.equal((await post([row({ placement_id: "nope" })])).status, 400, "unbekannte Platzierung");
    assert.equal((await call("/api/internal/sponsor-metrics", "POST", null, {}, { "x-cron-key": "cron" })).status, 400, "weder Werte noch Suchbegriffe");
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM sponsor_queries_daily").get().n, 0, "bei Fehlern wird nichts gespeichert");
    assert.equal((await post([row(), row({ day: "2026-11-07", clicks: 4, impressions: 140, position: 8 }), row({ query: "oversharing sharepoint online", clicks: 0, impressions: 10, position: 12.4 })])).status, 200);
    await post([row({ clicks: 3 })]);   // gleicher Tag/Begriff/Seite: wird ueberschrieben, nicht doppelt
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM sponsor_queries_daily").get().n, 3);
    const org = (await call("/api/sponsor/dashboard" + Q)).json.orgs[0];
    assert.equal(org.queries.length, 2);
    const top = org.queries[0];
    assert.equal(top.query, "sharepoint oversharing");
    assert.deepEqual([top.clicks, top.impressions], [7, 200]);
    assert.equal(top.position, 7.1, "nach Impressionen gewichtet: (5*60 + 8*140) / 200");
    assert.deepEqual([top.source, top.kind], ["Google Search Console", "measured"]);
    // andere Firma bekommt diese Begriffe nicht; ausserhalb des Zeitraums nichts
    assert.deepEqual((await call("/api/sponsor/dashboard" + Q, "GET", { id: 3 })).json.orgs[0].queries, []);
    assert.deepEqual((await call("/api/sponsor/dashboard?from=2026-10-01&to=2026-10-31")).json.orgs[0].queries, []);
  } finally { raw.close(); }
});

test("Werbeplaetze: gefilterte Klicks stehen getrennt in der Firmen- und Admin-Statistik", async () => {
  const { raw, db } = await setup();
  try {
    raw.exec(`INSERT INTO ad_bookings(id,code,org_id,user_id,product,page_types,quantity,delivered,target_url,pay_status,creative_status,status,created,updated)
      VALUES (1,'ad-aaaaaaaa01',1,1,'banner_mid','entity',100,5,'https://c.example/','paid','approved','active',1,1);
      INSERT INTO ad_stats_daily(day,booking_id,slot,page_type,country,impressions,clicks,clicks_filtered,leads) VALUES ('2026-11-06',1,'mid','entity','DE',200,4,6,1);`);
    const [ad] = await adStatsForOrg(db, 1, "2026-11-01", "2026-11-30");
    assert.deepEqual([ad.impressions, ad.clicks, ad.clicks_filtered, ad.leads, ad.ctr], [200, 4, 6, 1, 2], "Klickrate nur aus echten Klicks");
  } finally { raw.close(); }
});
