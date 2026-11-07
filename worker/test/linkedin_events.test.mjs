// LinkedIn-Events: nur Fixtures, kein Netz. Vorschlagsregel, Nutzlast, OAuth-State, Token-Verschluesselung, Aufrufe (Schein-fetch), Admin-Zugriff.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { LI, UTM, localToMs, matchHeySummit, buildPayload, encryptToken, decryptToken, oauthStartLE, checkState, oauthCallbackLE, handleLinkedinEvents, proposals, act, getConn } from "../src/linkedin_events.js";
import { handleEvents } from "../src/events.js";
import { callTool } from "../src/mcp.js";

const J = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json" } });
const NOW = Date.UTC(2027, 0, 1);
const EV = { id: 1, handle: "m365con-day1", title: "M365Con Day 1", summary: "Free online day", about: "", start: "2027-01-11T17:00", end: "2027-01-11T18:30", tz: "Europe/Berlin", url: "https://m365con.net/", tickets_url: "", public: 1 };
const HSX = [{ id: "229506", name: "M365Con 2027", url: "https://m365con.net/", start: Date.UTC(2027, 0, 11, 8), end: Date.UTC(2027, 0, 22), talks: [{ id: "t1", title: "Keynote", url: "https://m365con.net/talks/keynote", start: Date.UTC(2027, 0, 11, 15, 30), end: Date.UTC(2027, 0, 11, 17, 0) }] }];

async function setup() {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:"), dir = new URL("../migrations/", import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(f, dir), "utf-8"));
  raw.exec("INSERT INTO users(id,provider,sub,name,role,banned,created) VALUES(1,'google','a','Admin','admin',0,1),(2,'google','b','Normal','',0,1)");
  const db = { prepare(sql) { let a = []; const o = { bind(...x) { a = x; return o; }, all: async () => ({ results: raw.prepare(sql).all(...a) }), first: async () => raw.prepare(sql).get(...a) ?? null, run: async () => { const r = raw.prepare(sql).run(...a); return { meta: { changes: Number(r.changes) } }; } }; return o; }, async batch(s) { for (const x of s) await x.run(); } };
  const env = { DB: db, SESSION_SECRET: "s3cret", SITE: "https://www.m365.fm", API: "https://api-dub.m365.fm", LINKEDIN_CLIENT_ID: "cid", LINKEDIN_CLIENT_SECRET: "csec", HEYSUMMIT_API_KEY: "hk" };
  return { raw, env };
}
// Schein-fetch: zeichnet Aufrufe auf
function mockFetch(log) {
  return async (u, o = {}) => {
    log.push({ u: String(u), method: o.method || "GET", headers: o.headers || {}, body: o.body });
    u = String(u);
    if (u.startsWith("https://api.heysummit.com/api/events")) return J({ results: [{ id: 229506, title: "M365Con 2027", url: "https://m365con.net/", start_date: "2027-01-11T08:00:00Z", end_date: "2027-01-22T20:00:00Z" }] });
    if (u.startsWith("https://api.heysummit.com/api/talks")) return J({ results: [{ id: 1, title: "Keynote", url: "https://m365con.net/talks/keynote", start_date: "2027-01-11T15:30:00Z", end_date: "2027-01-11T17:00:00Z" }] });
    if (u === LI.token) return J({ access_token: "AT", refresh_token: "RT", expires_in: 3600, scope: LI.scope });
    if (u.startsWith(LI.api + LI.events) && (o.method === "POST") && !u.includes("urn")) return new Response("", { status: 201, headers: { "x-restli-id": "urn:li:event:777" } });
    if (u.includes("urn%3Ali%3Aevent")) return new Response(null, { status: 204 });
    if (u.includes("organizationAcls")) return J({ elements: [{ organization: "urn:li:organization:42" }] });
    if (u.includes("/rest/organizations/")) return J({ localizedName: "M365 Show" });
    return new Response("", { status: 404 });
  };
}
async function connected(env, org = true) {
  const { encryptToken: enc } = await import("../src/linkedin_events.js");
  await env.DB.prepare("INSERT INTO linkedin_conn(id,org_urn,org_name,access_enc,refresh_enc,expires,scope,connected_by,updated) VALUES(1,?,?,?,?,?,?,1,1)").bind(org ? "urn:li:organization:42" : "", org ? "M365 Show" : "", await enc(env, "AT"), "", Math.floor(Date.now() / 1000) + 3600, LI.scope).run();
}
const addEv = (raw, e = {}) => { const x = { ...EV, ...e }; raw.prepare("INSERT INTO events(id,handle,owner_id,title,summary,about,start,end,url,tickets_url,tz,public,created,updated) VALUES(?,?,1,?,?,?,?,?,?,?,?,?,1,1)").run(x.id, x.handle, x.title, x.summary, x.about, x.start, x.end, x.url, x.tickets_url, x.tz, x.public); };

test("Zeitumrechnung Berlin Winter/Sommer in UTC-ms", () => {
  assert.equal(localToMs("2027-01-11T17:00", "Europe/Berlin"), Date.UTC(2027, 0, 11, 16));
  assert.equal(localToMs("2027-07-01T17:00", "Europe/Berlin"), Date.UTC(2027, 6, 1, 15));
  assert.equal(localToMs("2027-01-11", "Europe/Berlin"), null);
});

test("Eignung: Treffer, kein Treffer, vergangen, ohne Uhrzeit", () => {
  assert.equal(matchHeySummit(EV, HSX, {}, NOW).ok, true);                                   // Talk-Zeitraum 16:30-18:00 Berlin enthaelt 17:00
  const near = { ...EV, url: "", start: "2027-01-11T09:00" };                                 // 08:00 UTC = HeySummit-Event-Start (+-2 h)
  assert.deepEqual([matchHeySummit(near, HSX, {}, NOW).ok, matchHeySummit(near, HSX, {}, NOW).how], [true, "event_start"]);
  const talkStart = { ...EV, url: "", start: "2027-01-11T19:00" };                            // 18:00 UTC: Talk-Start 2,5 h davor, Talk-Ende 1 h davor, Event-Start 10 h davor: kein Treffer
  assert.equal(matchHeySummit(talkStart, HSX, {}, NOW).ok, false);
  assert.equal(matchHeySummit({ ...EV, url: "", start: "2027-01-15T10:00" }, HSX, {}, NOW).reason, "no_match");
  assert.equal(matchHeySummit({ ...EV, url: "", start: "2026-12-01T10:00" }, HSX, {}, NOW).reason, "past");
  assert.equal(matchHeySummit({ ...EV, start: "2027-01-11" }, HSX, {}, NOW).reason, "no_time");
  assert.equal(matchHeySummit({ ...EV, url: "", start: "2027-03-01T10:00" }, HSX, { "m365con-day1": "heysummit:229506" }, NOW).how, "linked");   // direkte Verknuepfung
  assert.equal(matchHeySummit({ ...EV, url: "https://www.m365con.net/x", start: "2027-03-01T10:00" }, HSX, {}, NOW).how, "linked");               // gleicher Host
});

test("Vorschlagsliste: nur Treffer, nicht veroeffentlichte; veroeffentlichte bleiben mit Status", async () => {
  const { raw, env } = await setup(); await connected(env);
  addEv(raw); addEv(raw, { id: 2, handle: "other", title: "Other", start: "2027-02-20T10:00", end: "", url: "" }); addEv(raw, { id: 3, handle: "old", title: "Old", start: "2020-01-11T17:00", url: "" });
  const log = [], f = mockFetch(log), p = await proposals(env, f, NOW);
  assert.deepEqual(p.items.map((x) => x.handle), ["m365con-day1"]);
  assert.equal(p.items[0].state, "proposal");
  assert.match(p.items[0].when, /11\.01\.2027/);
  const r = await act(env, { id: 1, admin: true }, "publish", "m365con-day1", true, f, NOW);
  assert.equal(r.linkedin_url, "https://www.linkedin.com/events/777/");
  const p2 = await proposals(env, f, NOW);
  assert.equal(p2.items[0].state, "published");
  assert.equal(p2.items[0].changed, false);
});

test("Nutzlast: Laengenlimits, Zeiten in ms, UTM, Links", () => {
  const env = { SITE: "https://www.m365.fm" };
  const p = buildPayload(env, { ...EV, title: "T".repeat(300), summary: "S".repeat(5000) }, { event: HSX[0], talk: HSX[0].talks[0] }, "urn:li:organization:42");
  assert.ok([...p.name.value].length <= LI.nameMax && p.name.value.endsWith("…"));
  assert.ok([...p.description.value].length <= LI.descMax);
  assert.equal(p.timeRange.start, Date.UTC(2027, 0, 11, 16)); assert.equal(p.timeRange.end, Date.UTC(2027, 0, 11, 17, 30));
  assert.ok(Number.isInteger(p.timeRange.start));
  assert.ok(p.description.value.includes("https://www.m365.fm/community/events/m365con-day1/?" + UTM));
  assert.ok(p.description.value.includes("https://m365con.net/talks/keynote?" + UTM));
  assert.equal(p.organizer, "urn:li:organization:42"); assert.equal(p.eventFormat, "ONLINE"); assert.equal(p.visibility, "PUBLIC");
  assert.equal(buildPayload(env, { ...EV, end: "" }, null, "o").timeRange.end - p.timeRange.start, 3600000);
  assert.equal(buildPayload(env, { ...EV, start: "2027-01-11" }, null, "o"), null);
});

test("OAuth-Callback: State-Pruefung (Cookie, Wert, Admin-Bindung) und Token-Speicherung verschluesselt", async () => {
  const { env } = await setup();
  const o = await oauthStartLE(env, { id: 1 }), state = new URL(o.location).searchParams.get("state");
  assert.equal(new URL(o.location).searchParams.get("scope"), LI.scope);
  assert.equal(new URL(o.location).searchParams.get("redirect_uri"), "https://api-dub.m365.fm/auth/linkedin-events/callback");
  const ck = o.setCookie.split(";")[0];
  assert.equal(await checkState(env, ck, state, 1), true);
  assert.equal(await checkState(env, ck, "falsch", 1), false);
  assert.equal(await checkState(env, ck, state, 2), false);
  assert.equal(await checkState(env, "", state, 1), false);
  assert.equal(await checkState(env, ck.slice(0, -2) + "xx", state, 1), false);
  const log = [], f = mockFetch(log), mk = (st) => new Request("https://x/cb", { headers: { cookie: ck } });
  assert.deepEqual(await oauthCallbackLE(env, mk(), new URL("https://x/cb?code=c&state=nope"), { id: 1 }, f), { error: "bad_state" });
  assert.equal(log.length, 0);   // bei falschem State kein Token-Aufruf
  assert.deepEqual(await oauthCallbackLE(env, mk(), new URL(`https://x/cb?code=c&state=${state}`), { id: 1 }, f), { ok: true });
  const c = await getConn(env.DB);
  assert.equal(c.access_enc.split(".").length, 2); assert.notEqual(c.access_enc, "AT"); assert.notEqual(c.refresh_enc, "RT"); assert.equal(await decryptToken(env, c.refresh_enc), "RT");
  assert.equal(await decryptToken(env, c.access_enc), "AT");
});

test("Token-Verschluesselung: Round-Trip, zufaelliger IV, falscher Schluessel scheitert", async () => {
  const env = { SESSION_SECRET: "a" }, a = await encryptToken(env, "geheim"), b = await encryptToken(env, "geheim");
  assert.notEqual(a, b); assert.ok(!a.includes("geheim"));
  assert.equal(await decryptToken(env, a), "geheim");
  await assert.rejects(decryptToken({ SESSION_SECRET: "b" }, a));
  assert.equal(await decryptToken({ SESSION_SECRET: "a", LINKEDIN_TOKEN_KEY: "k" }, await encryptToken({ SESSION_SECRET: "a", LINKEDIN_TOKEN_KEY: "k" }, "x")), "x");
  assert.equal(await encryptToken(env, ""), "");
});

test("Veroeffentlichen/Aktualisieren/Absagen rufen die richtigen Endpunkte; ohne confirm nur Vorschau", async () => {
  const { raw, env } = await setup(); await connected(env); addEv(raw);
  const log = [], f = mockFetch(log), admin = { id: 1, admin: true };
  const pre = await act(env, admin, "publish", "m365con-day1", false, f, NOW);
  assert.ok(pre.preview); assert.ok(!log.some((l) => l.u.startsWith(LI.api + LI.events)));   // nichts an LinkedIn gesendet
  const pub = await act(env, admin, "publish", "m365con-day1", true, f, NOW);
  const post = log.find((l) => l.u === LI.api + LI.events);
  assert.equal(post.method, "POST"); assert.equal(post.headers["LinkedIn-Version"], LI.version); assert.equal(post.headers.authorization, "Bearer AT");
  assert.equal(JSON.parse(post.body).organizer, "urn:li:organization:42");
  assert.equal(pub.urn, "urn:li:event:777");
  assert.equal((await act(env, admin, "publish", "m365con-day1", true, f, NOW)).error, "already_published");
  raw.prepare("UPDATE events SET title='Neuer Titel' WHERE id=1").run();
  assert.equal((await proposals(env, f, NOW)).items[0].changed, true);
  log.length = 0;
  const ur = await act(env, admin, "update", "m365con-day1", true, f, NOW); assert.equal(ur.ok, true, JSON.stringify(ur));
  const up = log.find((l) => l.u.includes("urn%3Ali%3Aevent%3A777"));
  assert.equal(up.headers["X-RestLi-Method"], "PARTIAL_UPDATE");
  const patch = JSON.parse(up.body).patch.$set; assert.equal(patch.name.value, "Neuer Titel"); assert.equal(patch.organizer, undefined);
  assert.equal((await proposals(env, f, NOW)).items[0].changed, false);
  log.length = 0;
  assert.equal((await act(env, admin, "cancel", "m365con-day1", true, f, NOW)).ok, true);
  assert.deepEqual(JSON.parse(log.find((l) => l.u.includes("urn%3Ali%3Aevent")).body), { patch: { $set: { lifecycleState: "CANCELLED" } } });
  assert.equal(raw.prepare("SELECT status FROM linkedin_events").get().status, "cancelled");
});

test("Nicht vorschlagbare Events lassen sich nicht veroeffentlichen; ohne Verbindung/Seite Fehler", async () => {
  const { raw, env } = await setup(); addEv(raw, { id: 2, handle: "x", start: "2027-02-20T10:00", url: "" });
  const admin = { id: 1, admin: true }, f = mockFetch([]);
  assert.equal((await act(env, admin, "publish", "x", true, f, NOW)).error, "not_connected");
  await connected(env, false);
  assert.equal((await act(env, admin, "publish", "x", true, f, NOW)).error, "no_org");
  await env.DB.prepare("UPDATE linkedin_conn SET org_urn='urn:li:organization:42'").run();
  assert.equal((await act(env, admin, "publish", "x", true, f, NOW)).error, "no_match");
});

test("Seitenwahl: Organisationen laden und URN speichern (nur gueltige URN)", async () => {
  const { env } = await setup(); await connected(env, false);
  const f = mockFetch([]), admin = { id: 1, admin: true };
  const call = (path, method = "GET", body) => handleLinkedinEvents(env, new Request("https://x" + path, { method, body: body && JSON.stringify(body) }), new URL("https://x" + path), path, admin, J, f).then((r) => r.json());
  assert.deepEqual((await call("/api/admin/linkedin/orgs")).orgs, [{ urn: "urn:li:organization:42", name: "M365 Show" }]);
  assert.equal((await call("/api/admin/linkedin/org", "POST", { urn: "evil" })).error, "bad_urn");
  assert.equal((await call("/api/admin/linkedin/org", "POST", { urn: "urn:li:organization:42", name: "M365 Show" })).ok, true);
  assert.equal((await getConn(env.DB)).org_name, "M365 Show");
});

test("Nur Admin: REST, MCP und Event-Export ohne Token", async () => {
  const { raw, env } = await setup(); await connected(env); addEv(raw);
  const f = mockFetch([]);
  for (const [p, m] of [["/api/admin/linkedin/status", "GET"], ["/api/admin/linkedin/proposals", "GET"], ["/api/admin/linkedin/publish", "POST"], ["/api/admin/linkedin/cancel", "POST"]]) {
    for (const u of [null, { id: 2, admin: false }]) assert.equal((await handleLinkedinEvents(env, new Request("https://x" + p, { method: m, body: m === "POST" ? "{}" : undefined }), new URL("https://x" + p), p, u, J, f)).status, 403);
  }
  assert.equal((await act(env, { id: 2, admin: false }, "publish", "m365con-day1", true, f, NOW)).error, "forbidden");
  const user = { id: 2, admin: false };
  assert.equal((await callTool(env, user, "linkedin_event_proposals", {})).error, "forbidden");
  assert.equal((await callTool(env, user, "publish_linkedin_event", { handle: "m365con-day1" })).error, "forbidden");
  const pub = await handleEvents(env, new Request("https://x/api/events/export"), new URL("https://x/api/events/export"), "/api/events/export", null, J);
  const txt = await pub.text(); assert.ok(!txt.includes("AT") || !/access|token|urn:li:organization/.test(txt));
});

test("MCP publish_linkedin_event veroeffentlicht nie, nur Vorschau", async () => {
  const { raw, env } = await setup(); await connected(env); addEv(raw);
  const log = [], realFetch = globalThis.fetch; globalThis.fetch = mockFetch(log);
  try {
    const out = await callTool(env, { id: 1, admin: true }, "publish_linkedin_event", { handle: "m365con-day1", confirm: true });
    assert.ok(out.preview); assert.ok(!log.some((l) => l.u.startsWith(LI.api + LI.events)));
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM linkedin_events").get().n, 0);
  } finally { globalThis.fetch = realFetch; }
});

test("Event-Export zeigt die LinkedIn-URL erst nach der Veroeffentlichung", async () => {
  const { raw, env } = await setup(); addEv(raw);
  const get = async () => (await (await handleEvents(env, new Request("https://x/api/events/export"), new URL("https://x/api/events/export"), "/api/events/export", null, J)).json()).events[0];
  assert.equal((await get()).linkedin_url, "");
  raw.prepare("INSERT INTO linkedin_events(event_id,urn,url,status,published,updated) VALUES(1,'urn:li:event:777','https://www.linkedin.com/events/777/','published',1,1)").run();
  assert.equal((await get()).linkedin_url, "https://www.linkedin.com/events/777/");
  raw.prepare("UPDATE linkedin_events SET status='cancelled'").run();
  assert.equal((await get()).linkedin_url, "");
});
