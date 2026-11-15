import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { handleSponsor, handleSponsorLink } from "../src/sponsor.js";
import { sponsorPhase, GRACE_DAYS } from "../src/sponsor_extra.js";

// Mirko 11.11.2026: "einmal gekauft, bleibt fuer immer" - Dashboard und Zahlen bleiben nach dem Ende (und nach der Karenzzeit) sichtbar,
// /go/-Links leiten weiter und zaehlen weiter; Berechtigungen bleiben unveraendert. Alles ueber die echten Routen.
const DAY = 86400000;
const iso = (offsetDays) => new Date(Date.now() + offsetDays * DAY).toISOString().slice(0, 10);

async function setup() {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:");
  const dir = new URL("../migrations/", import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(f, dir), "utf-8"));
  const db = {
    prepare(sql) {
      const st = raw.prepare(sql); let args = [];
      const o = {
        bind(...a) { args = a; return o; },
        all: async () => ({ results: st.all(...args) }),
        first: async () => st.get(...args) ?? null,
        run: async () => { const r = st.run(...args); return { meta: { changes: Number(r.changes), last_row_id: Number(r.lastInsertRowid) } }; },
      };
      return o;
    },
    async batch(stmts) { for (const st of stmts) await st.run(); },
  };
  // old: vor 3 Jahren gebucht und beendet (weit nach der Karenzzeit); grace: vor 10 Tagen beendet; run: laeuft noch 20 Tage
  raw.exec(`
    INSERT INTO users(id,provider,sub,name,role,banned,created) VALUES (1,'google','owner','Owner','user',0,1),(2,'google','events','Events','user',0,1),
      (3,'google','stranger','Stranger','user',0,1),(4,'google','member','Member','user',0,1),(5,'google','admin','Admin','admin',0,1);
    INSERT INTO orgs(id,handle,name,website,created) VALUES (1,'acme','Acme GmbH','https://acme.example/',1),(2,'other-co','Other','https://other.example/',1);
    INSERT INTO org_members(org_id,user_id,role,status,created) VALUES (1,1,'owner','active',1),(1,2,'events','active',1),(1,4,'member','active',1),(2,3,'owner','active',1);
    INSERT INTO sponsor_placements(id,org_id,title,channel,langs,start,end,refs,created) VALUES
      ('old-pod',1,'Old podcast placement','podcast_video','en','${iso(-1100)}','${iso(-1000)}','{}',1),
      ('grace-web',1,'Grace web placement','website','en','${iso(-100)}','${iso(-10)}','{}',1),
      ('run-pod',1,'Running placement','podcast_video','en','${iso(-30)}','${iso(20)}','{}',1);
    INSERT INTO sponsor_links(code,org_id,placement_id,target_url,utm,active,created_at) VALUES
      ('acme-old',1,'old-pod','https://acme.example/old','{"utm_source":"m365.fm"}',1,1),
      ('acme-off',1,'old-pod','https://acme.example/off','{}',0,1);
  `);
  const env = { DB: db, SITE: "https://www.m365.fm", SESSION_SECRET: "test-key", CRON_KEY: "cron" };
  const J = (data, status = 200, headers = {}) => new Response(JSON.stringify(data), { status, headers });
  const call = async (path, user, method = "GET", body) => {
    const request = new Request(`https://api.example${path}`, { method, headers: { "content-type": "application/json", "x-requested-with": "m365" },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
    return handleSponsor(env, request, new URL(request.url), new URL(request.url).pathname, J, user);
  };
  const go = async (code, ua = "Mozilla/5.0 Chrome/130") => {
    const request = new Request(`https://api.example/go/${code}?s=episode`, { headers: { "user-agent": ua, "cf-connecting-ip": "203.0.113.9" } });
    Object.defineProperty(request, "cf", { value: { country: "DE" } });
    const waits = [], response = await handleSponsorLink(env, request, new URL(request.url), new URL(request.url).pathname, { waitUntil: (p) => waits.push(p) });
    await Promise.all(waits);
    return response;
  };
  return { raw, env, call, go };
}

test("sponsorPhase: laeuft bis end, Karenzzeit bis end + 182 Tage (wie site_sponsorships.grace_end), danach beendet", () => {
  assert.equal(GRACE_DAYS, 182);
  assert.deepEqual(sponsorPhase("2026-11-10", "2027-01-16", "2027-01-16"), { status: "active", grace_end: "2027-07-17" });
  assert.deepEqual(sponsorPhase("2026-11-10", "2027-01-16", "2027-01-17"), { status: "grace", grace_end: "2027-07-17" });
  assert.equal(sponsorPhase("2026-11-10", "2027-01-16", "2027-07-17").status, "grace", "Tag 182 zaehlt noch");
  assert.equal(sponsorPhase("2026-11-10", "2027-01-16", "2027-07-18").status, "ended", "Tag 183 nicht mehr");
  assert.equal(sponsorPhase("2026-11-10", "2027-01-16", "2026-11-09").status, "upcoming");
  assert.deepEqual(sponsorPhase("2026-11-06", null, "2030-01-01"), { status: "active", grace_end: null }, "unbefristet");
});

test("Dashboard ein Jahr nach dem Ende: Platzierung bleibt gelistet, spaetere Klicks, Messwerte und manuelle Werte zaehlen in den Summen", async () => {
  const { raw, call } = await setup();
  try {
    const later = iso(-1000 + 365), from = iso(-1000 + 360), to = iso(-1000 + 370);
    raw.exec(`INSERT INTO sponsor_clicks_daily(day,code,surface,country,clicks) VALUES('${later}','acme-old','episode','DE',4),('${iso(-1050)}','acme-old','episode','DE',2);
      INSERT INTO sponsor_metrics_daily(placement_id,day,metric,dim,value,source,kind,fetched_at) VALUES('old-pod','${later}','podcast_plays','episode:1',9,'spreaker','measured',1);`);
    assert.equal((await call("/api/sponsor/manual-metric", { id: 5, admin: true }, "POST", { placement_id: "old-pod", source: "bing_ai",
      metric: "ai_citations", period: later.slice(0, 7), value: 3, link: "", proof_key: "sponsors/acme/bing.csv" })).status, 200, "manuelle Werte auch nach dem Ende");
    const result = await (await call(`/api/sponsor/dashboard?from=${from}&to=${to}`, { id: 1 })).json();
    assert.equal(result.orgs.length, 1);
    const org = result.orgs[0], old = org.placements.find((p) => p.id === "old-pod");
    assert.ok(old, "beendete Platzierung bleibt im Zeitraum ein Jahr nach dem Ende gelistet");
    assert.equal(old.start, iso(-1100), "gebuchte Laufzeit bleibt wahrheitsgemaess");
    assert.equal(old.end, iso(-1000));
    assert.equal(old.status, "ended");
    assert.equal(old.grace_end, new Date(Date.parse(`${iso(-1000)}T00:00:00Z`) + 182 * DAY).toISOString().slice(0, 10));
    assert.deepEqual(old.clicks.map((c) => c.clicks), [4], "Klicks nach dem Ende stehen an der Platzierung");
    assert.equal(old.metrics[0].value, 9);
    assert.equal(org.metrics.find((m) => m.key === "link_clicks").value, 4, "Summe enthaelt die spaeteren Klicks");
    assert.equal(org.metrics.find((m) => m.key === "podcast_plays").value, 9);
    assert.equal(org.metrics.find((m) => m.key === "ai_citations").value, 3);
    assert.equal(org.placements.some((p) => p.id === "run-pod" || p.id === "grace-web"), false, "erst spaeter beginnende Platzierungen fehlen weiterhin");
    const detail = await (await call(`/api/sponsor/placement?id=old-pod&from=${from}&to=${to}`, { id: 2 })).json();
    assert.equal(detail.placement.status, "ended", "Detailansicht (Rolle events) ohne Ablauf");
    assert.equal(detail.clicks[0].clicks, 4);
    const stats = await (await call(`/api/sponsor/link-stats?org=acme&month=${later.slice(0, 7)}`, { id: 1 })).json();
    assert.equal(stats.stats.find((s) => s.code === "acme-old").clicks, 4);
  } finally { raw.close(); }
});

test("Dashboard heute: Status laeuft / Karenzzeit / beendet, gebuchte Laufzeit unveraendert", async () => {
  const { raw, call } = await setup();
  try {
    const result = await (await call(`/api/sponsor/dashboard?from=${iso(-29)}&to=${iso(0)}`, { id: 1 })).json();
    const by = Object.fromEntries(result.orgs[0].placements.map((p) => [p.id, p]));
    assert.deepEqual(Object.keys(by).sort(), ["grace-web", "old-pod", "run-pod"], "auch die vor 3 Jahren beendete Platzierung bleibt gelistet");
    assert.equal(by["run-pod"].status, "active");
    assert.equal(by["grace-web"].status, "grace");
    assert.equal(by["grace-web"].grace_end, iso(-10 + 182));
    assert.equal(by["grace-web"].end, iso(-10));
    assert.equal(by["old-pod"].status, "ended");
  } finally { raw.close(); }
});

test("Berechtigungen unveraendert: Fremde und einfache Mitglieder sehen nichts, Admin alles", async () => {
  const { raw, call } = await setup();
  try {
    const range = `from=${iso(-1000 + 360)}&to=${iso(-1000 + 370)}`;
    let result = await (await call(`/api/sponsor/dashboard?${range}`, { id: 3 })).json();
    assert.deepEqual(result.orgs.map((o) => o.handle), [], "Fremder ohne eigene Platzierung sieht nichts");
    result = await (await call(`/api/sponsor/dashboard?org=acme&${range}`, { id: 4 })).json();
    assert.deepEqual(result.orgs, [], "Rolle member reicht nicht");
    assert.equal((await call(`/api/sponsor/placement?id=old-pod&${range}`, { id: 3 })).status, 404);
    assert.equal((await call(`/api/sponsor/placement?id=old-pod&${range}`, { id: 4 })).status, 404);
    assert.equal((await call(`/api/sponsor/link-stats?org=acme`, { id: 3 })).status, 404);
    assert.equal((await call(`/api/sponsor/dashboard?${range}`, null)).status, 401);
    result = await (await call(`/api/sponsor/dashboard?org=acme&${range}`, { id: 5, admin: true })).json();
    assert.ok(result.orgs[0].placements.some((p) => p.id === "old-pod"), "Admin sieht die beendete Platzierung");
  } finally { raw.close(); }
});

test("/go/ nach dem Ende: leitet weiter und zaehlt; active=0 (Hand/Erstattung) bleibt gesperrt", async () => {
  const { raw, go } = await setup();
  const originalCaches = globalThis.caches, stored = new Map();
  Object.defineProperty(globalThis, "caches", { configurable: true, value: { default: {
    match: async (key) => stored.get(key.url) || null, put: async (key, value) => { stored.set(key.url, value); } } } });
  try {
    let response = await go("acme-old");
    assert.equal(response.status, 302, "Platzierung seit fast 3 Jahren beendet, Link leitet weiter");
    assert.equal(response.headers.get("location"), "https://acme.example/old?utm_source=m365.fm");
    assert.equal(raw.prepare("SELECT SUM(clicks) n FROM sponsor_clicks_daily WHERE code='acme-old'").get().n, 1, "und zaehlt");
    await go("acme-old", "Another browser");
    assert.equal(raw.prepare("SELECT SUM(clicks) n FROM sponsor_clicks_daily WHERE code='acme-old'").get().n, 2);
    response = await go("acme-off");
    assert.equal(response.status, 404, "deaktivierter Code bleibt aus");
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM sponsor_clicks_daily WHERE code='acme-off'").get().n, 0);
  } finally {
    if (originalCaches === undefined) delete globalThis.caches;
    else Object.defineProperty(globalThis, "caches", { configurable: true, value: originalCaches });
    raw.close();
  }
});
