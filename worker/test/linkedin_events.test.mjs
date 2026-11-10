// LinkedIn-Events: nur Fixtures, kein Netz. HeySummit nur als Zusatzinfo (echte Feldnamen; seit der Pruefliste 0045 keine Voraussetzung mehr), Reservierung vor dem LinkedIn-Aufruf, Nutzlast nach Event,
// Regeln je Aktion auf dem Server, verwaiste LinkedIn-Events, Routen und Deploy-Abgleich, Konto loeschen/zusammenfuehren, OAuth-State, Token-Verschluesselung.
// Zweite Runde (R2-1 bis R2-5): Wartezeit ab der Reservierung, Vorauswahl nach HeySummit-Zeitraum vor dem LIMIT, HeySummit-Entwuerfe, auf LinkedIn geloeschte
// Events, sofortiges Nachtragen nach store_failed.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import vm from "node:vm";
import worker from "../src/index.js";
import { orgUrn, LI, HS, UTM, HOLD_S, CAND_MAX, localToMs, hsMs, evWindow, fetchHeySummit, matchHeySummit, buildPayload, encryptToken, decryptToken, oauthStartLE, checkState, oauthCallbackLE, handleLinkedinEvents, proposals, act, getConn, urnOf, deleteUserLinkedin, linkedinUrlFor, purgeLinkedinOrphans } from "../src/linkedin_events.js";
import { handleEvents, deleteUserEvents } from "../src/events.js";
import { handleEventImport } from "../src/eventimport.js";
import { mergeStatements } from "../src/identities.js";
import { callTool, TOOLS, HOWTO } from "../src/mcp.js";
import { makeSession } from "../src/util.js";
import { routes } from "../../tools/mcp_routes.mjs";

const J = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json" } });
// LATER: die Wartezeit einer Reservierung ist vorbei. Eine Reservierung traegt immer die echte Uhr: Tests, die danach etwas klaeren, halten sie mit freeze(t, NOW) an.
const NOW = Date.UTC(2026, 10, 9, 12), LATER = NOW + (HOLD_S + 1) * 1000;
const ADMIN = { id: 1, admin: true };
// m365.fm-Event zur selben Minute wie die Keynote (08:00 Berlin = 07:00 UTC), verlinkt auf m365con.net
const EV = { id: 1, handle: "m365con-day1", title: "M365Con Day 1", summary: "Free online day", about: "", start: "2027-01-11T08:00", end: "2027-01-11T17:00", tz: "Europe/Berlin", url: "https://m365con.net/", tickets_url: "", public: 1, free: 1, mode: "online", location: "", country: "" };

// HeySummit so, wie das verbundene Konto antwortet (Events und Talks von Event 229506, gekuerzt auf die Felder der Antwort ohne Texte und Personen).
// Es gibt KEIN start_date/end_date: Events tragen first_talk_at/last_talk_at, Talks date (UTC ohne Zone) + date_timezone_offset + broadcast_duration_mins.
const HS_EVENTS = [
  { id: 232509, url: "https://datascience.show", title: "DataScience.Show", event_url: "https://datascience.show", first_talk_at: null, last_talk_at: null, is_live: true, is_archived: false, is_evergreen: false, status: "planning", timezone: "Europe/London" },
  { id: 229506, url: "https://m365con.net", title: "M365 Con 27 - The Microsoft Community Convention", event_url: "https://m365con.net", first_talk_at: "2027-01-11T07:00:00", last_talk_at: "2027-01-22T19:00:00", is_live: true, is_archived: false, is_evergreen: false, status: "planning", timezone: "Europe/Berlin" },
  { id: 229540, url: "https://de.m365con.net", title: "M365 Con DACH", event_url: "https://de.m365con.net", first_talk_at: "2026-09-14T07:00:00", last_talk_at: "2026-09-18T19:00:00", is_live: true, is_archived: false, is_evergreen: false, status: "finished", timezone: "Europe/Berlin" },
  { id: 229209, url: "https://m365-con-copy.heysummit.com", title: "M365 Con (copy)", event_url: "https://m365-con-copy.heysummit.com", first_talk_at: "2026-01-12T08:00:00", last_talk_at: "2026-01-23T19:00:00", is_live: false, is_archived: false, is_evergreen: false, status: "finished", timezone: "Europe/Berlin" },
  { id: 150009, url: "https://2026.m365con.net", title: "M365 Con", event_url: "https://2026.m365con.net", first_talk_at: "2026-01-12T08:00:00", last_talk_at: "2026-01-23T19:00:00", is_live: true, is_archived: false, is_evergreen: false, status: "finished", timezone: "Europe/Berlin" },
];
const talk = (x) => ({ external_url: "", date_timezone_offset: "+0000", broadcast_duration_mins: 45, event: 229506, is_active: true, talk_cancelled: false, is_agenda_item: false, ...x });
const HS_TALKS = [
  talk({ id: 917909, title: "Power Platform Meets Agent Governance: Building Trustworthy Automation at Scale", url: "https://m365con.net/talks/keynote-overview-tbd-topic/", date: "2027-01-11T07:00:00", date_localised: "2027-01-11T08:00:00" }),
  talk({ id: 1107710, title: "Make AI Adoption Safe: What Happens When the Rules Run Out?", url: "https://m365con.net/talks/make-ai-adoption-safe-what-happens-when-the-rules-run-out/", date: "2027-01-11T08:00:00", date_localised: "2027-01-11T09:00:00" }),
  talk({ id: 3, title: "Abgesagt", url: "https://m365con.net/talks/abgesagt/", date: "2027-01-13T10:00:00", talk_cancelled: true }),
  talk({ id: 4, title: "Inaktiv", url: "https://m365con.net/talks/inaktiv/", date: "2027-01-14T10:00:00", is_active: false }),
  talk({ id: 5, title: "Fremdes Event", url: "https://de.m365con.net/talks/fremd/", date: "2027-01-15T10:00:00", event: 229540 }),
  talk({ id: 6, title: "Workshop mit Versatz", url: "https://m365con.net/talks/workshop/", date: "2027-01-12T10:00:00", date_timezone_offset: "+0100", broadcast_duration_mins: 120 }),
];
const page = (results, next = null) => ({ count: results.length, next, previous: null, results });

async function setup() {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:"), dir = new URL("../migrations/", import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(f, dir), "utf-8"));
  raw.exec("INSERT INTO users(id,provider,sub,name,role,banned,created) VALUES(1,'google','a','Admin','admin',0,1),(2,'google','b','Normal','',0,1),(3,'google','c','Zweitkonto','admin',0,1)");
  // failOn(sql): D1-Fehler fuer genau diese Anweisung (z. B. das Eintragen der URN nach dem LinkedIn-Aufruf)
  const db = { failOn: null, prepare(sql) { let a = []; const hit = () => { if (db.failOn && db.failOn(sql)) throw new Error("D1_ERROR: transient"); }; const o = { bind(...x) { a = x; return o; }, all: async () => { hit(); return { results: raw.prepare(sql).all(...a) }; }, first: async () => { hit(); return raw.prepare(sql).get(...a) ?? null; }, run: async () => { hit(); if (/^\s*(SELECT|WITH)\b/i.test(sql)) return { results: raw.prepare(sql).all(...a), meta: { changes: 0, last_row_id: 0 } }; const r = raw.prepare(sql).run(...a); return { results: [], meta: { changes: Number(r.changes), last_row_id: Number(r.lastInsertRowid) } }; } }; return o; }, async batch(s) { const out = []; for (const x of s) out.push(await x.run()); return out; } };
  const env = { DB: db, SESSION_SECRET: "s3cret", SITE: "https://www.m365.fm", API: "https://api-dub.m365.fm", LINKEDIN_CLIENT_ID: "cid", LINKEDIN_CLIENT_SECRET: "csec", HEYSUMMIT_API_KEY: "hk" };
  return { raw, env };
}
// Schein-fetch: zeichnet Aufrufe auf. o.create / o.patch ersetzen die LinkedIn-Antwort, o.hsEvents / o.hsStatus die von HeySummit.
function mockFetch(log, o = {}) {
  let n = 776;
  return async (u, init = {}) => {
    u = String(u); log.push({ u, method: init.method || "GET", headers: init.headers || {}, body: init.body });
    if (u.startsWith(HS.api)) {
      if (o.hsStatus) return new Response("kaputt", { status: o.hsStatus });
      if (u === HS.api + HS.events) return J(page(o.hsEvents || HS_EVENTS));
      if (u === `${HS.api}${HS.talks}?event=229506`) return J(page(HS_TALKS.slice(0, 1), `${HS.api}${HS.talks}?event=229506&page=2`));
      if (u === `${HS.api}${HS.talks}?event=229506&page=2`) return J(page(HS_TALKS.slice(1)));
      return new Response("", { status: 404 });
    }
    if (u === LI.token) return J({ access_token: "AT", refresh_token: "RT", expires_in: 3600, scope: LI.scope });
    if (u === LI.api + LI.events && init.method === "POST") return o.create ? o.create() : new Response("", { status: 201, headers: { "x-restli-id": String(++n) } });
    if (u.startsWith(LI.api + LI.events + "/")) return o.patch ? o.patch() : new Response(null, { status: 204 });
    if (u.includes("organizationAcls")) return J({ elements: [{ organization: "urn:li:organization:42" }] });
    if (u.includes("/rest/organizations/")) return J({ localizedName: "M365 Show" });
    return new Response("", { status: 404 });
  };
}
const creates = (log) => log.filter((l) => l.u === LI.api + LI.events && l.method === "POST").length;
const patches = (log) => log.filter((l) => l.u.startsWith(LI.api + LI.events + "/"));
async function connected(env, org = true, by = 1) {
  await env.DB.prepare("INSERT INTO linkedin_conn(id,org_urn,org_name,access_enc,refresh_enc,expires,scope,connected_by,updated) VALUES(1,?,?,?,?,?,?,?,1)").bind(org ? "urn:li:organization:42" : "", org ? "M365 Show" : "", await encryptToken(env, "AT"), await encryptToken(env, "RT"), Math.floor(Date.now() / 1000) + 3600, LI.scope, by).run();
}
const addEv = (raw, e = {}) => { const x = { ...EV, ...e }; raw.prepare("INSERT INTO events(id,handle,owner_id,title,summary,about,start,end,url,tickets_url,tz,public,free,mode,location,country,created,updated) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,1,1)").run(x.id, x.handle, x.owner_id || 1, x.title, x.summary, x.about, x.start, x.end, x.url, x.tickets_url, x.tz, x.public, x.free, x.mode, x.location, x.country); };
const liRows = (raw) => raw.prepare("SELECT event_id,urn,status FROM linkedin_events ORDER BY event_id").all().map((r) => ({ ...r }));
const hsParsed = async (o) => (await fetchHeySummit({ HEYSUMMIT_API_KEY: "hk" }, mockFetch([], o), NOW)).events;
const rest = (env, f, user = ADMIN) => async (path, method = "GET", body) => { const r = await handleLinkedinEvents(env, new Request("https://x" + path, { method, body: method === "GET" || !body ? undefined : JSON.stringify(body) }), new URL("https://x" + path), path, user, J, f); return { status: r.status, j: await r.json() }; };

const freeze = (t, ms) => t.mock.timers.enable({ apis: ["Date"], now: ms });   // Wege ohne nowMs (REST, MCP) lesen die Uhr: im Test steht sie fest

// ---------- Zeit ----------
test("Zeitumrechnung: Ortszeit je Zeitzone, HeySummit-Zeiten ohne Zone als UTC, Zeitfenster eines Events", () => {
  assert.equal(localToMs("2027-01-11T17:00", "Europe/Berlin"), Date.UTC(2027, 0, 11, 16));
  assert.equal(localToMs("2027-07-01T17:00", "Europe/Berlin"), Date.UTC(2027, 6, 1, 15));
  assert.equal(localToMs("2027-01-11T02:00", "America/New_York"), Date.UTC(2027, 0, 11, 7));
  assert.equal(localToMs("2027-01-11", "Europe/Berlin"), null);
  assert.equal(hsMs("2027-01-11T07:00:00"), Date.UTC(2027, 0, 11, 7), "ohne Zone = UTC, nicht die Zeitzone des Rechners");
  assert.equal(hsMs("2027-01-11T07:00:00", "+0000"), Date.UTC(2027, 0, 11, 7));
  assert.equal(hsMs("2027-01-11T08:00:00", "+0100"), Date.UTC(2027, 0, 11, 7), "mitgelieferter Versatz");
  assert.equal(hsMs("2027-01-11T08:00:00+01:00", "+0000"), Date.UTC(2027, 0, 11, 7), "Zone im Text hat Vorrang");
  assert.equal(hsMs("2027-01-11T07:00:00Z"), Date.UTC(2027, 0, 11, 7));
  assert.equal(hsMs(null), null); assert.equal(hsMs("bald"), null);
  assert.deepEqual(evWindow(EV), { start: Date.UTC(2027, 0, 11, 7), end: Date.UTC(2027, 0, 11, 16) });
  assert.deepEqual(evWindow({ ...EV, end: "" }), { start: Date.UTC(2027, 0, 11, 7), end: Date.UTC(2027, 0, 11, 8) }, "ohne Ende: eine Stunde");
  assert.equal(evWindow({ ...EV, end: "2027-01-22" }).end, Date.UTC(2027, 0, 22, 22, 59), "Ende nur als Datum: bis 23:59 Ortszeit");
  assert.equal(evWindow({ ...EV, tz: "America/New_York" }).start, Date.UTC(2027, 0, 11, 13));
  assert.equal(evWindow({ ...EV, start: "2027-01-11" }), null);
});

// ---------- 323-1: echte HeySummit-Felder, "gleichzeitig" = ueberschneidende Zeitfenster, auf jedem Weg ----------
test("323-1 HeySummit lesen: echte Feldnamen, Folgeseiten, abgesagte/inaktive/fremde Talks zaehlen nicht", async () => {
  const log = [], r = await fetchHeySummit({ HEYSUMMIT_API_KEY: "hk" }, mockFetch(log), NOW), con = r.events.find((e) => e.id === "229506");
  assert.equal(r.error, undefined); assert.equal(r.partial, false);
  assert.deepEqual(r.events.map((e) => e.id), ["232509", "229506", "229540", "150009"]);
  assert.equal(con.start, Date.UTC(2027, 0, 11, 7), "first_talk_at"); assert.equal(con.end, Date.UTC(2027, 0, 22, 19, 45), "last_talk_at ist der Beginn des letzten Talks");
  assert.equal(con.url, "https://m365con.net"); assert.equal(con.name, "M365 Con 27 - The Microsoft Community Convention");
  assert.deepEqual(con.talks.map((t) => t.id), ["917909", "1107710", "6"], "Seite 2 gelesen; abgesagt, inaktiv und fremdes Event entfallen");
  assert.deepEqual([con.talks[0].start, con.talks[0].end], [Date.UTC(2027, 0, 11, 7), Date.UTC(2027, 0, 11, 7, 45)], "date + broadcast_duration_mins");
  assert.deepEqual([con.talks[2].start, con.talks[2].end], [Date.UTC(2027, 0, 12, 9), Date.UTC(2027, 0, 12, 11)], "date_timezone_offset +0100");
  assert.deepEqual([r.events[0].start, r.events[0].end], [null, null], "Event ohne Termin");
  assert.deepEqual(log.map((l) => l.u), [HS.api + HS.events, `${HS.api}${HS.talks}?event=229506`, `${HS.api}${HS.talks}?event=229506&page=2`], "Talks nur fuer Events, die noch nicht vorbei sind");
  assert.ok(log.every((l) => l.headers.authorization === "Token hk"));
});

test("323-1 HeySummit lesen: Schluessel geht nie an einen fremden Host; Fehler und unbekannte Antwortform schlagen nichts vor", async () => {
  const log = [], f = async (u, init) => { log.push(String(u)); return String(u) === HS.api + HS.events ? J(page(HS_EVENTS.slice(2), "https://evil.example/api/events/?page=2")) : new Response("", { status: 404 }); };
  const r = await fetchHeySummit({ HEYSUMMIT_API_KEY: "hk" }, f, NOW);
  assert.deepEqual(log, [HS.api + HS.events]); assert.equal(r.partial, true, "abgeschnitten wird gemeldet");
  assert.deepEqual(await fetchHeySummit({}, f, NOW), { error: "no_heysummit_key", events: [] });
  assert.deepEqual(await fetchHeySummit({ HEYSUMMIT_API_KEY: "hk" }, mockFetch([], { hsStatus: 500 }), NOW), { error: "hs_500", events: [] });
  assert.deepEqual(await fetchHeySummit({ HEYSUMMIT_API_KEY: "hk" }, async () => J({ data: [] }), NOW), { error: "hs_format", events: [] });
  assert.deepEqual(await fetchHeySummit({ HEYSUMMIT_API_KEY: "hk" }, async () => { throw Object.assign(new Error("x"), { name: "TimeoutError" }); }, NOW), { error: "hs_timeout", events: [] });
  // die alten, geratenen Feldnamen ergeben keinen Termin und damit nie einen Vorschlag
  const old = await hsParsed({ hsEvents: [{ id: 229506, title: "M365Con", url: "https://m365con.net/", start_date: "2027-01-11T08:00:00Z", end_date: "2027-01-22T20:00:00Z" }] });
  assert.deepEqual([old[0].start, old[0].end], [null, null]);
  assert.equal(matchHeySummit(EV, old, {}, NOW).reason, "no_match");
});

test("323-1 Regel: Verknuepfung allein genuegt nie, es zaehlt die Ueberschneidung der Zeitfenster (Zeitzonen beachtet)", async () => {
  const hs = await hsParsed(), other = { ...EV, url: "", handle: "stream" };
  const m = matchHeySummit(other, hs, {}, NOW);                                              // andere Adresse, gleiche Minute wie die Keynote
  assert.deepEqual([m.ok, m.how, m.talk.id], [true, "talk", "917909"]);
  const linked = matchHeySummit(EV, hs, {}, NOW); assert.deepEqual([linked.ok, linked.how, linked.event.id], [true, "linked", "229506"]);   // gleicher Host UND im Zeitraum
  assert.equal(matchHeySummit({ ...EV, start: "2027-06-15T10:00", end: "" }, hs, {}, NOW).reason, "no_match", "gleicher Host, anderer Termin");
  assert.equal(matchHeySummit({ ...EV, url: "https://de.m365con.net/", start: "2027-06-15T10:00", end: "" }, hs, {}, NOW).reason, "no_match", "HeySummit-Event ist vorbei");
  assert.equal(matchHeySummit({ ...EV, url: "", tickets_url: "https://datascience.show/", start: "2027-06-15T10:00", end: "" }, hs, {}, NOW).reason, "no_match", "HeySummit-Event ohne Termin");
  const T = { "m365con-2027": "heysummit:229506" };
  assert.equal(matchHeySummit({ ...EV, handle: "m365con-2027", url: "", start: "2027-01-11T09:00", end: "2027-01-22" }, hs, T, NOW).how, "linked");
  assert.equal(matchHeySummit({ ...EV, handle: "m365con-2027", url: "", start: "2027-03-01T10:00", end: "" }, hs, T, NOW).reason, "no_match", "TRANSFER ohne Ueberschneidung");
  // Zeitzone des Events: 02:00 in New York ist 07:00 UTC (Keynote), 02:00 in Berlin ist 01:00 UTC (sechs Stunden davor)
  assert.equal(matchHeySummit({ ...other, start: "2027-01-11T02:00", end: "", tz: "America/New_York" }, hs, {}, NOW).how, "talk");
  assert.equal(matchHeySummit({ ...other, start: "2027-01-11T02:00", end: "", tz: "Europe/Berlin" }, hs, {}, NOW).reason, "no_match");
  // ohne Toleranz: Beginn genau am Ende des zweiten Talks (08:45 UTC = 09:45 Berlin, danach ist bis zum naechsten Tag nichts)
  assert.equal(matchHeySummit({ ...other, start: "2027-01-11T09:45", end: "" }, hs, {}, NOW).reason, "no_match");
  assert.equal(matchHeySummit({ ...other, start: "2027-01-11T09:44", end: "" }, hs, {}, NOW).how, "talk");
  assert.equal(matchHeySummit({ ...other, start: "2027-01-13T11:00", end: "" }, hs, {}, NOW).reason, "no_match", "abgesagter Talk zaehlt nicht");
  assert.equal(matchHeySummit({ ...EV, start: "2026-10-01T10:00", end: "" }, hs, {}, NOW).reason, "past");
  assert.equal(matchHeySummit({ ...EV, start: "2027-01-11" }, hs, {}, NOW).reason, "no_time");
  assert.equal(matchHeySummit(EV, hs, {}, Date.UTC(2027, 1, 1)).reason, "past");
});

test("323-1 Server (Pruefliste 0045): HeySummit ist keine Voraussetzung mehr - jedes uebernommene, kommende Event mit Uhrzeit ist ein Kandidat, ein passendes HeySummit-Event nur Zusatzinfo", async () => {
  const { raw, env } = await setup(); await connected(env);
  addEv(raw); addEv(raw, { id: 2, handle: "spaeter", title: "Gleicher Host, anderer Termin", start: "2027-06-15T10:00", end: "" }); addEv(raw, { id: 3, handle: "alt-dach", title: "Vorbei", url: "https://de.m365con.net/", start: "2027-06-16T10:00", end: "" });
  addEv(raw, { id: 4, handle: "stream", title: "Stream zur Keynote", url: "", start: "2027-01-11T08:30", end: "" });
  const log = [], f = mockFetch(log), p = await proposals(env, f, NOW);
  assert.deepEqual(p.items.map((x) => [x.handle, x.state, x.hs ? x.hs.how : null]), [["m365con-day1", "proposal", "linked"], ["stream", "proposal", "talk"], ["spaeter", "proposal", null], ["alt-dach", "proposal", null]]);   // Treffer = Zusatzinfo
  assert.deepEqual(p.hs_info, { events: 4, dated: 3, talks: 3, partial: false });
  assert.ok(p.items.every((x) => x.can.join() === "publish"));
  // ohne gleichzeitiges HeySummit-Event geht Veroeffentlichen trotzdem; die Nutzlast bekommt dann nur keinen Anmeldelink von HeySummit
  assert.equal((await act(env, ADMIN, "publish", "spaeter", true, f, NOW)).ok, true); assert.equal(creates(log), 1);
  assert.equal((await act(env, ADMIN, "publish", "m365con-day1", true, f, NOW)).ok, true);
  // Termin verschoben (kein HeySummit-Treffer mehr): Aktualisieren geht, die Liste zeigt keine Sperre
  raw.prepare("UPDATE events SET start='2027-06-15T10:00', end='' WHERE id=1").run(); log.length = 0;
  assert.equal((await act(env, ADMIN, "update", "m365con-day1", true, f, NOW)).ok, true); assert.equal(patches(log).length, 1);
  const row = (await proposals(env, f, NOW)).items.find((x) => x.handle === "m365con-day1");
  assert.deepEqual([row.state, row.rule, row.hs, row.changed, row.can], ["published", undefined, null, false, ["update", "cancel"]], "keine Sperre mehr; nach dem Aktualisieren ist nichts offen (changed false)");
  // HeySummit nicht lesbar oder ohne Schluessel: die Liste meldet es nur als Zusatzinfo, Veroeffentlichen geht trotzdem
  let nid = 9000; const down = mockFetch(log, { hsStatus: 503, create: () => new Response("", { status: 201, headers: { "x-restli-id": String(++nid) } }) }); log.length = 0;
  const pd = await proposals(env, down, NOW); assert.equal(pd.hs_error, "hs_503"); assert.deepEqual(pd.items.filter((x) => x.state === "proposal").map((x) => x.handle), ["stream", "alt-dach"]);
  assert.equal((await act(env, ADMIN, "publish", "stream", true, down, NOW)).ok, true);
  assert.equal((await act({ ...env, HEYSUMMIT_API_KEY: "" }, ADMIN, "publish", "alt-dach", true, down, NOW)).ok, true);
  assert.equal(creates(log), 2); assert.equal(liRows(raw).length, 4);
});

test("323-2 gleichzeitige Klicks: genau ein LinkedIn-Event", async () => {
  const { raw, env } = await setup(); await connected(env); addEv(raw);
  const log = [], f = mockFetch(log);
  const res = await Promise.all([act(env, ADMIN, "publish", "m365con-day1", true, f, NOW), act(env, ADMIN, "publish", { event_id: 1 }, true, f, NOW), act(env, ADMIN, "publish", "m365con-day1", true, f, NOW)]);
  assert.equal(creates(log), 1);
  assert.deepEqual(res.map((r) => r.error || "ok").sort(), ["ok", "publish_pending", "publish_pending"]);
  assert.deepEqual(liRows(raw), [{ event_id: 1, urn: "urn:li:event:777", status: "published" }]);
  assert.equal((await act(env, ADMIN, "publish", "m365con-day1", true, f, NOW)).error, "already_published"); assert.equal(creates(log), 1);
});

test("323-2 LinkedIn legt an, nennt aber keine ID: Reservierung bleibt, kein zweiter Event; im Admin klaerbar (ID eintragen)", async (t) => {
  freeze(t, NOW); const { raw, env } = await setup(); await connected(env); addEv(raw); addEv(raw, { id: 2, handle: "stream", title: "Stream", url: "", start: "2027-01-11T08:30", end: "" });
  const log = [], f = mockFetch(log, { create: () => new Response("", { status: 201 }) });
  assert.deepEqual(await act(env, ADMIN, "publish", "m365con-day1", true, f, NOW), { error: "li_no_urn", pending: true });
  assert.deepEqual(liRows(raw), [{ event_id: 1, urn: "", status: "pending" }]);
  assert.equal((await act(env, ADMIN, "publish", "m365con-day1", true, f, NOW)).error, "publish_pending"); assert.equal(creates(log), 1, "Wiederholung ruft LinkedIn nicht noch einmal");
  // Liste: waehrend der Wartezeit ohne Knopf, danach "ID eintragen" und "freigeben"
  let it = (await proposals(env, f, NOW)).items[0]; assert.deepEqual([it.handle, it.state, it.can, it.wait], ["m365con-day1", "pending", [], HOLD_S]);
  assert.equal((await act(env, ADMIN, "resolve", { event_id: 1, urn: "7777777" }, true, f, NOW)).error, "publish_running");
  assert.equal((await act(env, ADMIN, "release", { event_id: 1 }, true, f, NOW)).error, "publish_running");
  it = (await proposals(env, f, LATER)).items[0]; assert.deepEqual([it.state, it.can, it.wait], ["pending", ["resolve", "release"], 0]);
  assert.equal((await act(env, ADMIN, "resolve", { event_id: 1, urn: "kaputt" }, true, f, LATER)).error, "bad_urn");
  assert.deepEqual(await act(env, ADMIN, "resolve", { event_id: 1, urn: "https://www.linkedin.com/events/7777777/" }, false, f, LATER), { preview: { action: "resolve", urn: "urn:li:event:7777777", linkedin_url: "https://www.linkedin.com/events/7777777/" } });
  assert.deepEqual(await act(env, ADMIN, "resolve", { event_id: 1, urn: "7777777" }, true, f, LATER), { ok: true, urn: "urn:li:event:7777777", linkedin_url: "https://www.linkedin.com/events/7777777/" });
  assert.deepEqual(liRows(raw), [{ event_id: 1, urn: "urn:li:event:7777777", status: "published" }]);
  assert.equal((await act(env, ADMIN, "resolve", { event_id: 1, urn: "7777777" }, true, f, LATER)).error, "not_pending");
  // dieselbe LinkedIn-ID kann nicht zu einem zweiten Event gehoeren
  assert.equal((await act(env, ADMIN, "publish", "stream", true, f, NOW)).pending, true);
  assert.equal((await act(env, ADMIN, "resolve", { event_id: 2, urn: "urn:li:event:7777777" }, true, f, LATER)).error, "urn_taken");
  assert.equal(creates(log), 2, "je Event genau ein Aufruf");
  assert.deepEqual([urnOf("12345"), urnOf("urn:li:event:12345"), urnOf("https://www.linkedin.com/events/12345"), urnOf("https://evil.example/events/12345"), urnOf("12")], ["urn:li:event:12345", "urn:li:event:12345", "urn:li:event:12345", "", ""]);
});

test("323-2 D1-Fehler nach dem LinkedIn-Aufruf: Reservierung bleibt, die URN geht an den Admin, Wiederholung legt nichts Zweites an", async (t) => {
  freeze(t, NOW); const { raw, env } = await setup(); await connected(env); addEv(raw);
  const log = [], f = mockFetch(log, { create: () => new Response("", { status: 201, headers: { "x-restli-id": "7123456789012345678" } }) });   // IDs sind bei LinkedIn so lang
  env.DB.failOn = (sql) => /^UPDATE linkedin_events SET urn=/.test(sql);
  const sf = await act(env, ADMIN, "publish", "m365con-day1", true, f, NOW), { ticket, ...plain } = sf;
  assert.deepEqual(plain, { error: "store_failed", pending: true, urn: "urn:li:event:7123456789012345678", linkedin_url: "https://www.linkedin.com/events/7123456789012345678/" }); assert.match(ticket, /^[\w-]{20,}$/);
  env.DB.failOn = null;
  assert.deepEqual(liRows(raw), [{ event_id: 1, urn: "", status: "pending" }]);
  assert.equal((await act(env, ADMIN, "publish", "m365con-day1", true, f, NOW)).error, "publish_pending"); assert.equal(creates(log), 1);
  const rs = await act(env, ADMIN, "resolve", { event_id: 1, urn: "urn:li:event:7123456789012345678" }, true, f, LATER); assert.equal(rs.ok, true, JSON.stringify(rs));
  assert.deepEqual(raw.prepare("SELECT action,detail FROM audit WHERE action LIKE 'linkedin-%' ORDER BY id").all().map((r) => [r.action, r.detail]), [["linkedin-publish-unstored", "urn:li:event:7123456789012345678"], ["linkedin-resolve", "urn:li:event:7123456789012345678"]]);
  // scheitert schon die Reservierung, wird LinkedIn gar nicht erst gerufen
  addEv(raw, { id: 2, handle: "stream", title: "Stream", url: "", start: "2027-01-11T08:30", end: "" }); env.DB.failOn = (sql) => /^INSERT INTO linkedin_events/.test(sql);
  assert.deepEqual(await act(env, ADMIN, "publish", "stream", true, f, NOW), { error: "db_error" }); assert.equal(creates(log), 1);
});

test("323-2 Ausgang offen (Netz, Zeit, 5xx) haelt die Reservierung; sichere Ablehnung (4xx) gibt sie frei; Freigeben im Admin", async (t) => {
  freeze(t, NOW); const { raw, env } = await setup(); await connected(env); addEv(raw);
  const log = [];
  for (const [create, code] of [[() => { throw new TypeError("fetch failed"); }, "li_network"], [() => { throw Object.assign(new Error("t"), { name: "TimeoutError" }); }, "li_timeout"], [() => new Response("", { status: 502 }), "li_502"], [() => new Response("", { status: 408 }), "li_408"]]) {
    assert.deepEqual(await act(env, ADMIN, "publish", "m365con-day1", true, mockFetch(log, { create }), NOW), { error: code, pending: true }, code);
    assert.deepEqual(liRows(raw), [{ event_id: 1, urn: "", status: "pending" }]);
    assert.equal((await act(env, ADMIN, "publish", "m365con-day1", true, mockFetch(log), NOW)).error, "publish_pending");
    assert.deepEqual(await act(env, ADMIN, "release", { event_id: 1 }, false, mockFetch(log), LATER), { preview: { action: "release" } });
    assert.deepEqual(await act(env, ADMIN, "release", { event_id: 1 }, true, mockFetch(log), LATER), { ok: true });   // der Admin hat auf LinkedIn nachgesehen: nichts angelegt
    assert.deepEqual(liRows(raw), []);
  }
  assert.equal(creates(log), 4);
  for (const st of [400, 401, 403, 422, 429]) {
    assert.deepEqual(await act(env, ADMIN, "publish", "m365con-day1", true, mockFetch(log, { create: () => new Response("{\"message\":\"nein\"}", { status: st }) }), NOW), { error: "li_" + st });
    assert.deepEqual(liRows(raw), [], "abgelehnt: keine Reservierung bleibt zurueck");
  }
  // ID aus dem Location-Kopf, wenn x-restli-id fehlt
  const ok = await act(env, ADMIN, "publish", "m365con-day1", true, mockFetch(log, { create: () => new Response("", { status: 201, headers: { location: "/rest/events/4242" } }) }), NOW);
  assert.deepEqual(ok, { ok: true, urn: "urn:li:event:4242", linkedin_url: "https://www.linkedin.com/events/4242/" });
  assert.equal((await act(env, ADMIN, "release", { event_id: 1 }, true, mockFetch(log), LATER)).error, "not_pending", "ein veroeffentlichter Event laesst sich nicht freigeben");
});

// ---------- 323-3: Text, Aufruf und Format folgen dem Event ----------
test("323-3 Nutzlast: kostenlos oder nicht, online / vor Ort / hybrid, Laengenlimits, Zeiten in ms, UTM, Links", async () => {
  const env = { SITE: "https://www.m365.fm" }, hs = await hsParsed(), m = { event: hs[1], talk: hs[1].talks[0] };
  const p = buildPayload(env, { ...EV, title: "T".repeat(300), summary: "S".repeat(5000) }, m, "urn:li:organization:42");
  assert.ok([...p.name.value].length <= LI.nameMax && p.name.value.endsWith("…"));
  assert.ok([...p.description.value].length <= LI.descMax);
  assert.deepEqual(p.timeRange, { start: Date.UTC(2027, 0, 11, 7), end: Date.UTC(2027, 0, 11, 16) });
  assert.ok(p.description.value.includes("Mehr zum Event: https://www.m365.fm/community/events/m365con-day1/?" + UTM));
  assert.ok(p.description.value.includes("Kostenlos anmelden: https://m365con.net/talks/keynote-overview-tbd-topic/?" + UTM));
  assert.equal(p.externalUrl, "https://m365con.net/talks/keynote-overview-tbd-topic/?" + UTM);
  assert.equal(p.organizer, "urn:li:organization:42"); assert.equal(p.eventFormat, "ONLINE"); assert.equal(p.visibility, "PUBLIC");
  assert.ok(!/\nOrt: /.test(p.description.value));
  // kostenpflichtig und vor Ort: kein "Kostenlos", Format und Ort stimmen, der eigene Ticket-Link geht vor
  const paid = buildPayload(env, { ...EV, free: 0, mode: "onsite", location: "Köln", country: "Deutschland", tickets_url: "https://tickets.example/buy?x=1" }, m, "o");
  assert.equal(paid.eventFormat, "IN_PERSON"); assert.ok(!/kostenlos/i.test(paid.description.value));
  assert.ok(paid.description.value.includes("Anmeldung und Tickets: https://tickets.example/buy?x=1&" + UTM));
  assert.ok(paid.description.value.includes("\nOrt: Köln, Deutschland\n"));
  const hybrid = buildPayload(env, { ...EV, free: 1, mode: "hybrid", location: "Wien" }, null, "o");
  assert.equal(hybrid.eventFormat, "HYBRID"); assert.ok(hybrid.description.value.includes("Ort: Wien (und online)")); assert.ok(hybrid.description.value.includes("Kostenlos anmelden: https://m365con.net/?" + UTM));
  assert.equal(buildPayload(env, { ...EV, mode: "unbekannt" }, null, "o").eventFormat, "ONLINE");
  const bare = buildPayload(env, { ...EV, url: "", free: 0 }, null, "o");   // ohne Anmeldelink: kein Aufruf, externalUrl ist die Event-Seite
  assert.ok(!/anmeld/i.test(bare.description.value)); assert.equal(bare.externalUrl, "https://www.m365.fm/community/events/m365con-day1/?" + UTM);
  assert.equal(buildPayload(env, { ...EV, start: "2027-01-11" }, null, "o"), null);
});

test("323-3 Vorschau im Admin nennt Format, Preis und Zeitraum; gesendet wird dasselbe", async () => {
  const { raw, env } = await setup(); await connected(env);
  addEv(raw, { free: 0, mode: "hybrid", location: "Köln", tickets_url: "https://tickets.example/buy" });
  const log = [], f = mockFetch(log), it = (await proposals(env, f, NOW)).items[0];
  assert.deepEqual([it.preview.format, it.preview.free, it.preview.start, it.preview.end], ["Hybrid (vor Ort und online)", false, "11.01.2027, 08:00", "11.01.2027, 17:00"]);
  assert.ok(it.preview.description.includes("Anmeldung und Tickets: https://tickets.example/buy?" + UTM)); assert.ok(!/kostenlos/i.test(it.preview.description));
  assert.equal((await act(env, ADMIN, "publish", { event_id: 1 }, true, f, NOW)).ok, true);
  const sent = JSON.parse(log.find((l) => l.u === LI.api + LI.events).body);
  assert.equal(sent.eventFormat, "HYBRID"); assert.equal(sent.description.value, it.preview.description);
});

// ---------- Aufrufe ----------
test("Veroeffentlichen/Aktualisieren/Absagen rufen die richtigen Endpunkte; ohne confirm nur Vorschau", async () => {
  const { raw, env } = await setup(); await connected(env); addEv(raw);
  const log = [], f = mockFetch(log);
  const pre = await act(env, ADMIN, "publish", "m365con-day1", false, f, NOW);
  assert.ok(pre.preview); assert.equal(creates(log), 0); assert.deepEqual(liRows(raw), [], "Vorschau reserviert nichts");
  const pub = await act(env, ADMIN, "publish", "m365con-day1", true, f, NOW);
  const post = log.find((l) => l.u === LI.api + LI.events);
  assert.equal(post.method, "POST"); assert.equal(post.headers["LinkedIn-Version"], LI.version); assert.equal(post.headers.authorization, "Bearer AT");
  assert.equal(JSON.parse(post.body).organizer, "urn:li:organization:42");
  assert.deepEqual(pub, { ok: true, urn: "urn:li:event:777", linkedin_url: "https://www.linkedin.com/events/777/" });
  assert.deepEqual({ ...raw.prepare("SELECT handle,title,starts,ends,published_by FROM linkedin_events").get() }, { handle: "m365con-day1", title: "M365Con Day 1", starts: Date.UTC(2027, 0, 11, 7), ends: Date.UTC(2027, 0, 11, 16), published_by: 1 });
  let it = (await proposals(env, f, NOW)).items[0]; assert.deepEqual([it.state, it.changed, it.can], ["published", false, ["update", "cancel"]]);
  raw.prepare("UPDATE events SET title='Neuer Titel' WHERE id=1").run();
  assert.equal((await proposals(env, f, NOW)).items[0].changed, true);
  log.length = 0;
  assert.ok((await act(env, ADMIN, "update", "m365con-day1", false, f, NOW)).preview); assert.equal(patches(log).length, 0);
  const ur = await act(env, ADMIN, "update", "m365con-day1", true, f, NOW); assert.equal(ur.ok, true, JSON.stringify(ur));
  const up = patches(log)[0]; assert.ok(up.u.endsWith("/urn%3Ali%3Aevent%3A777"));
  assert.equal(up.headers["X-RestLi-Method"], "PARTIAL_UPDATE");
  const patch = JSON.parse(up.body).patch.$set; assert.equal(patch.name.value, "Neuer Titel"); assert.equal(patch.organizer, undefined);
  it = (await proposals(env, f, NOW)).items[0]; assert.deepEqual([it.changed, it.state], [false, "published"]);
  log.length = 0;
  assert.deepEqual(await act(env, ADMIN, "cancel", "m365con-day1", false, f, NOW), { preview: { action: "cancel", urn: "urn:li:event:777", linkedin_url: "https://www.linkedin.com/events/777/" } }); assert.equal(patches(log).length, 0);
  assert.equal((await act(env, ADMIN, "cancel", "m365con-day1", true, f, NOW)).ok, true);
  assert.deepEqual(JSON.parse(patches(log)[0].body), { patch: { $set: { lifecycleState: "CANCELLED" } } });
  assert.deepEqual(liRows(raw), [{ event_id: 1, urn: "urn:li:event:777", status: "cancelled" }]);
  // LinkedIn lehnt eine Aenderung ab: der Stand hier bleibt, wie er war
  const { raw: r2, env: e2 } = await setup(); await connected(e2); addEv(r2);
  assert.equal((await act(e2, ADMIN, "publish", "m365con-day1", true, f, NOW)).ok, true);
  assert.deepEqual(await act(e2, ADMIN, "cancel", "m365con-day1", true, mockFetch([], { patch: () => new Response("", { status: 500 }) }), NOW), { error: "li_500" });
  assert.equal(liRows(r2)[0].status, "published");
});

test("Ohne Verbindung oder Seite geht nichts; abgelaufener Zugang wird als solcher gemeldet und reserviert nichts", async () => {
  const { raw, env } = await setup(); addEv(raw);
  const log = [], f = mockFetch(log);
  assert.equal((await act(env, ADMIN, "publish", "m365con-day1", true, f, NOW)).error, "not_connected");
  await connected(env, false);
  assert.equal((await act(env, ADMIN, "publish", "m365con-day1", true, f, NOW)).error, "no_org");
  await env.DB.prepare("UPDATE linkedin_conn SET org_urn='urn:li:organization:42', expires=1, refresh_enc=''").run();
  assert.deepEqual(await act(env, ADMIN, "publish", "m365con-day1", true, f, NOW), { error: "expired" });
  assert.equal(creates(log), 0); assert.deepEqual(liRows(raw), []);
  assert.equal((await act(env, ADMIN, "publish", "gibt-es-nicht", true, f, NOW)).error, "not_found");
  assert.equal((await act(env, ADMIN, "sprengen", "m365con-day1", true, f, NOW)).error, "bad_action");
});

// ---------- 323-4: Regeln auf dem Server ----------
test("323-4 nur oeffentliche, kommende Events; nach der Absage kein Aktualisieren, kein zweites Absagen, kein neues Veroeffentlichen", async () => {
  const { raw, env } = await setup(); await connected(env);
  addEv(raw); addEv(raw, { id: 2, handle: "versteckt", title: "Entwurf", public: 0 }); addEv(raw, { id: 3, handle: "laeuft", title: "Läuft schon", start: "2027-01-11T08:00", end: "2027-01-22" }); addEv(raw, { id: 4, handle: "ohne-zeit", title: "Ohne Uhrzeit", start: "2027-01-12", end: "" });
  const log = [], f = mockFetch(log), call = rest(env, f);
  assert.deepEqual(await call("/api/admin/linkedin/publish", "POST", { handle: "versteckt", confirm: true }), { status: 400, j: { error: "not_public" } });
  assert.deepEqual(await act(env, ADMIN, "publish", { event_id: 2 }, true, f, NOW), { error: "not_public" });
  assert.deepEqual(await act(env, ADMIN, "publish", "ohne-zeit", true, f, NOW), { error: "no_time" });
  const running = Date.UTC(2027, 0, 12);   // Event 3 hat begonnen, laeuft aber noch
  assert.deepEqual(await act(env, ADMIN, "publish", "laeuft", true, f, running), { error: "past" });
  assert.ok(!(await proposals(env, f, running)).items.some((x) => x.handle === "laeuft"));
  assert.equal(creates(log), 0); assert.deepEqual(liRows(raw), []);
  assert.deepEqual((await proposals(env, f, NOW)).items.map((x) => x.handle), ["m365con-day1", "laeuft"], "versteckte und Events ohne Uhrzeit fehlen in der Liste");
  // veroeffentlichen -> absagen -> aktualisieren
  assert.equal((await act(env, ADMIN, "publish", "m365con-day1", true, f, NOW)).ok, true);
  assert.equal((await act(env, ADMIN, "cancel", "m365con-day1", true, f, NOW)).ok, true); log.length = 0;
  assert.deepEqual(await call("/api/admin/linkedin/update", "POST", { handle: "m365con-day1", confirm: true }), { status: 409, j: { error: "cancelled", linkedin_url: "https://www.linkedin.com/events/777/" } });
  assert.equal((await act(env, ADMIN, "cancel", "m365con-day1", true, f, NOW)).error, "cancelled");
  assert.equal((await act(env, ADMIN, "publish", "m365con-day1", true, f, NOW)).error, "cancelled");
  assert.equal(log.filter((l) => l.u.startsWith(LI.api)).length, 0, "nichts davon erreicht LinkedIn");
  assert.deepEqual(liRows(raw), [{ event_id: 1, urn: "urn:li:event:777", status: "cancelled" }]);
  const it = (await proposals(env, f, NOW)).items.find((x) => x.handle === "m365con-day1"); assert.deepEqual([it.state, it.can], ["cancelled", []]);
  // Aktionen ohne LinkedIn-Event
  for (const a of ["update", "cancel", "resolve", "release"]) assert.equal((await act(env, ADMIN, a, { event_id: 3, urn: "12345" }, true, f, NOW)).error, "not_published", a);
  // veroeffentlicht, dann versteckt: Aktualisieren gesperrt
  assert.equal((await act(env, ADMIN, "publish", "laeuft", true, f, NOW)).ok, true); raw.prepare("UPDATE events SET public=0 WHERE id=3").run();
  assert.equal((await act(env, ADMIN, "update", "laeuft", true, f, NOW)).error, "not_public");
});

// ---------- 323-5: kein LinkedIn-Event bleibt ohne Absage-Knopf zurueck ----------
test("323-5 Event versteckt oder geloescht: der LinkedIn-Event bleibt gelistet und absagbar", async () => {
  const { raw, env } = await setup(); await connected(env);
  addEv(raw); addEv(raw, { id: 2, handle: "stream", title: "Stream", url: "", start: "2027-01-11T08:30", end: "" }); addEv(raw, { id: 3, handle: "abgesagt", title: "Wird abgesagt", url: "", start: "2027-01-11T09:10", end: "" });
  const log = [], f = mockFetch(log);
  for (const h of ["m365con-day1", "stream", "abgesagt"]) assert.equal((await act(env, ADMIN, "publish", h, true, f, NOW)).ok, true);
  assert.equal((await act(env, ADMIN, "cancel", "abgesagt", true, f, NOW)).ok, true);
  // versteckt (public=0): bleibt in der Liste, markiert, mit Absagen
  raw.prepare("UPDATE events SET public=0 WHERE id=2").run();
  let items = (await proposals(env, f, NOW)).items, hid = items.find((x) => x.handle === "stream");
  assert.deepEqual([hid.state, hid.hidden, hid.can], ["published", true, ["cancel"]]); assert.equal(items[0].handle, "stream", "Zeilen mit Handlungsbedarf stehen oben");
  // geloescht (Route und Kontoloeschung): veroeffentlichte Zeile bleibt, die abgesagte faellt weg
  const del = await handleEvents(env, new Request("https://x/api/event/m365con-day1", { method: "DELETE" }), new URL("https://x/api/event/m365con-day1"), "/api/event/m365con-day1", ADMIN, J);
  assert.equal(del.status, 200);
  await handleEvents(env, new Request("https://x/api/event/abgesagt", { method: "DELETE" }), new URL("https://x/api/event/abgesagt"), "/api/event/abgesagt", ADMIN, J);
  assert.deepEqual(liRows(raw), [{ event_id: 1, urn: "urn:li:event:777", status: "published" }, { event_id: 2, urn: "urn:li:event:778", status: "published" }]);
  items = (await proposals(env, f, NOW)).items; const orphan = items.find((x) => x.id === 1);
  assert.deepEqual([orphan.orphan, orphan.state, orphan.title, orphan.handle, orphan.linkedin_url, orphan.can], [true, "published", "M365Con Day 1", "m365con-day1", "https://www.linkedin.com/events/777/", ["cancel"]]);
  assert.equal((await act(env, ADMIN, "cancel", "m365con-day1", true, f, NOW)).error, "not_found", "das Handle gibt es nicht mehr ...");
  assert.equal((await act(env, ADMIN, "update", { event_id: 1 }, true, f, NOW)).error, "orphan");
  log.length = 0;
  assert.deepEqual(await act(env, ADMIN, "cancel", { event_id: 1 }, true, f, NOW), { ok: true, linkedin_url: "https://www.linkedin.com/events/777/" });   // ... die event_id schon
  assert.ok(patches(log)[0].u.endsWith("/urn%3Ali%3Aevent%3A777"));
  assert.deepEqual(liRows(raw), [{ event_id: 2, urn: "urn:li:event:778", status: "published" }], "verwaiste Zeile ist nach der Absage erledigt");
  assert.equal((await act(env, ADMIN, "cancel", { event_id: 2 }, true, f, NOW)).ok, true);
  assert.deepEqual(liRows(raw), [{ event_id: 2, urn: "urn:li:event:778", status: "cancelled" }]);
  assert.ok(!(await proposals(env, f, NOW)).items.some((x) => x.id === 2), "abgesagt und versteckt: nichts mehr zu tun");
});

test("323-5 Kontoloeschung des Veranstalters: veroeffentlichter LinkedIn-Event bleibt als verwaist stehen, bis er vorbei ist; Reservierung bleibt klaerbar", async (t) => {
  freeze(t, NOW); const { raw, env } = await setup(); await connected(env);
  addEv(raw, { owner_id: 2 }); addEv(raw, { id: 2, handle: "stream", title: "Stream", url: "", start: "2027-01-11T08:30", end: "", owner_id: 2 });
  const f = mockFetch([]);
  assert.equal((await act(env, ADMIN, "publish", "m365con-day1", true, f, NOW)).ok, true);
  assert.equal((await act(env, ADMIN, "publish", "stream", true, mockFetch([], { create: () => new Response("", { status: 500 }) }), NOW)).pending, true);
  await deleteUserEvents(env.DB, 2);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM events").get().n, 0);
  let items = (await proposals(env, f, LATER)).items;
  assert.deepEqual(items.map((x) => [x.id, x.state, x.orphan, x.can]), [[1, "published", true, ["cancel"]], [2, "pending", true, ["resolve", "release"]]]);
  items = (await proposals(env, f, Date.UTC(2027, 0, 11, 16))).items;   // LinkedIn-Event 1 ist zu Ende
  assert.deepEqual(items.map((x) => [x.id, x.state]), [[2, "pending"]]);
  assert.deepEqual(await act(env, ADMIN, "release", { event_id: 2 }, true, f, LATER), { ok: true });
});

// ---------- 323-6 / 323-7: Routen ----------
test("323-6 unbekannte Unterroute und falsche Methode: 404 als JSON statt null (auch durch den ganzen Worker)", async () => {
  const { env } = await setup(), call = rest(env, mockFetch([]));
  for (const [p, m] of [["/api/admin/linkedin/nope", "GET"], ["/api/admin/linkedin/publish", "GET"], ["/api/admin/linkedin/status", "POST"], ["/api/admin/linkedin/", "GET"]]) assert.deepEqual(await call(p, m, m === "POST" ? {} : undefined), { status: 404, j: { error: "not_found" } }, `${m} ${p}`);
  assert.equal(await handleLinkedinEvents(env, new Request("https://x/api/admin/panel/x"), new URL("https://x/api/admin/panel/x"), "/api/admin/panel/x", ADMIN, J), null, "fremde Praefixe bleiben beim Aufrufer");
  const cookie = `m365s=${await makeSession(env, 1)}`;
  const res = await worker.fetch(new Request("https://api-dub.m365.fm/api/admin/linkedin/nope", { headers: { cookie } }), env);
  assert.ok(res instanceof Response); assert.equal(res.status, 404); assert.deepEqual(await res.json(), { error: "not_found" });
  const st = await worker.fetch(new Request("https://api-dub.m365.fm/api/admin/linkedin/status", { headers: { cookie } }), env);
  assert.equal(st.status, 200); assert.equal((await st.json()).connected, false);
});

test("323-7 Deploy-Abgleich sieht jede LinkedIn-Route; Schreibwege sind begruendet ausgenommen, die Pruefung selbst hat keine neue Ausnahme", async () => {
  const live = routes().filter((r) => r.startsWith("/api/admin/linkedin/"));
  assert.deepEqual(live, ["cancel", "disconnect", "org", "orgs", "proposals", "publish", "release", "resolve", "status", "update"].map((k) => "/api/admin/linkedin/" + k));
  const cov = JSON.parse(readFileSync(new URL("../mcp_coverage.json", import.meta.url), "utf8")).routes;
  for (const r of live) assert.ok(cov[r], "Eintrag fehlt: " + r);
  assert.deepEqual(cov["/api/admin/linkedin/proposals"], { tools: ["linkedin_event_proposals"] });
  for (const r of live.filter((x) => !x.endsWith("/proposals"))) { assert.equal(cov[r].tools, undefined, r); assert.match(cov[r].skip, /Admin.*Browser/, r); }
  // jede gefundene Route gibt es wirklich (kein 404), keine laeuft am Abgleich vorbei
  const { raw, env } = await setup(), call = rest(env, mockFetch([])), GET = ["status", "orgs", "proposals"]; addEv(raw);
  for (const r of live) assert.notEqual((await call(r, GET.some((k) => r.endsWith("/" + k)) ? "GET" : "POST", { handle: "m365con-day1" })).status, 404, r);
  const src = readFileSync(new URL("../src/linkedin_events.js", import.meta.url), "utf8");
  assert.doesNotMatch(src, /path\.slice\(|\bk === "/, "Routen stehen als path === \"...\" da, nicht hinter einem abgeschnittenen Praefix");
  // beide Tools stehen in einer Anleitung: die Ausnahmeliste der Pruefung braucht sie nicht
  const gate = readFileSync(new URL("../../tools/check_mcp_coverage.mjs", import.meta.url), "utf8");
  assert.doesNotMatch(gate, /linkedin/i);
  for (const t of ["linkedin_event_proposals", "publish_linkedin_event"]) { assert.ok(TOOLS.some((x) => x.name === t && x.de && !x.write)); assert.ok(HOWTO.some((h) => h.tools.includes(t) && h.en && h.de), t); }
});

// ---------- 323-8: kommende Events, naechstes zuerst ----------
test("323-8 Vorschlagsliste: Datumsfilter in SQL (nicht die 300 aeltesten), naechstes zuerst", async () => {
  const { raw, env } = await setup(); await connected(env);
  const ins = raw.prepare("INSERT INTO events(handle,owner_id,title,start,public,created,updated) VALUES(?,1,?,?,1,1,1)");
  raw.exec("BEGIN"); for (let i = 0; i < 320; i++) ins.run(`live-${i}`, `Stream ${i}`, `2026-${String(1 + (i % 10)).padStart(2, "0")}-${String(1 + (i % 28)).padStart(2, "0")}T18:00`); raw.exec("COMMIT");
  addEv(raw, { id: 1001, handle: "tag-2", title: "Tag 2", start: "2027-01-12T09:00", end: "2027-01-12T17:00" }); addEv(raw, { id: 1002 });
  addEv(raw, { id: 1003, handle: "letzter-tag", title: "Letzter Tag", start: "2027-01-22T09:00", end: "" }); addEv(raw, { id: 1004, handle: "kein-treffer", title: "Anderer Termin", start: "2027-03-01T09:00", end: "" });
  const f = mockFetch([]), p = await proposals(env, f, NOW);
  assert.deepEqual(p.items.map((x) => x.handle), ["m365con-day1", "tag-2", "letzter-tag", "kein-treffer"]);   // auch ohne gleichzeitiges HeySummit-Event (Pruefliste 0045)
  assert.ok(p.items.every((x) => x.state === "proposal" && x.can.join() === "publish"));
  // veroeffentlichte stehen weiter in der Liste (mit Knoepfen), auch hinter vielen vergangenen Events
  assert.equal((await act(env, ADMIN, "publish", "tag-2", true, f, NOW)).ok, true);
  assert.deepEqual((await proposals(env, f, NOW)).items.map((x) => [x.handle, x.state]), [["m365con-day1", "proposal"], ["tag-2", "published"], ["letzter-tag", "proposal"], ["kein-treffer", "proposal"]]);
  // heute laufende und gestrige Events stoeren nicht; ein vergangenes Event wird nie vorgeschlagen
  assert.deepEqual((await proposals(env, f, Date.UTC(2027, 0, 12, 12))).items.map((x) => [x.handle, x.state]), [["tag-2", "published"], ["letzter-tag", "proposal"], ["kein-treffer", "proposal"]]);
});

// ---------- 323-9: Konto loeschen / zusammenfuehren, Verbindung trennen ----------
test("323-9 Kontoloeschung entfernt den LinkedIn-Zugang des Admins und loest 'veroeffentlicht von'; Zusammenfuehren zieht beides um", async () => {
  const { raw, env } = await setup(); await connected(env, true, 3); addEv(raw);
  const f = mockFetch([]);
  assert.equal((await act(env, { id: 3, admin: true }, "publish", "m365con-day1", true, f, NOW)).ok, true);
  // zusammenfuehren 3 -> 1
  await env.DB.batch(await mergeStatements(env.DB, 3, 1));
  assert.equal((await getConn(env.DB)).connected_by, 1); assert.equal(raw.prepare("SELECT published_by FROM linkedin_events").get().published_by, 1);
  assert.equal(await decryptToken(env, (await getConn(env.DB)).access_enc), "AT", "der Zugang selbst bleibt beim Zusammenfuehren erhalten");
  // ein anderes Konto loeschen aendert nichts
  await deleteUserLinkedin(env.DB, 2); assert.notEqual((await getConn(env.DB)).access_enc, "");
  // Konto 1 loeschen (ganzer Worker, DELETE /api/me)
  const res = await worker.fetch(new Request("https://api-dub.m365.fm/api/me", { method: "DELETE", headers: { cookie: `m365s=${await makeSession(env, 1)}`, "x-requested-with": "m365" } }), env);
  assert.equal(res.status, 200); assert.equal(raw.prepare("SELECT COUNT(*) n FROM users WHERE id=1").get().n, 0);
  const c = await getConn(env.DB);
  assert.deepEqual([c.access_enc, c.refresh_enc, c.expires, c.scope, c.connected_by], ["", "", 0, "", 0]); assert.equal(c.org_urn, "urn:li:organization:42");
  assert.deepEqual({ ...raw.prepare("SELECT published_by,status,urn FROM linkedin_events").get() }, { published_by: 0, status: "published", urn: "urn:li:event:777" }, "der LinkedIn-Event gehoert der Seite und bleibt verwaltbar");
  assert.equal((await act(env, { id: 3, admin: true }, "cancel", { event_id: 1 }, true, f, NOW)).error, "not_connected");
});

test("323-9 Verbindung trennen loescht die Tokens; Status und Liste geben nie Zugangsdaten heraus", async () => {
  const { raw, env } = await setup(); await connected(env); addEv(raw);
  const f = mockFetch([]), call = rest(env, f);
  const before = JSON.stringify([await call("/api/admin/linkedin/status"), await call("/api/admin/linkedin/proposals"), await call("/api/admin/linkedin/publish", "POST", { handle: "m365con-day1" })]);
  const c0 = await getConn(env.DB);
  for (const secret of ["AT", "RT", c0.access_enc, c0.refresh_enc, "csec", "s3cret", "\"hk\"", "Token hk"]) assert.ok(!before.includes(secret), "Zugangsdaten in der Antwort: " + secret);
  assert.deepEqual((await call("/api/admin/linkedin/status")).j, { configured: true, connected: true, org_urn: "urn:li:organization:42", org_name: "M365 Show", redirect_uri: "https://api-dub.m365.fm/auth/linkedin-events/callback", scope: LI.scope, heysummit_key: true });
  assert.deepEqual(await call("/api/admin/linkedin/disconnect", "POST", {}), { status: 200, j: { ok: true } });
  const c = await getConn(env.DB); assert.deepEqual([c.access_enc, c.refresh_enc, c.connected_by, c.org_name], ["", "", 0, "M365 Show"]);
  assert.equal((await call("/api/admin/linkedin/status")).j.connected, false);
  assert.deepEqual(await call("/api/admin/linkedin/publish", "POST", { handle: "m365con-day1", confirm: true }), { status: 400, j: { error: "not_connected" } });
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM audit WHERE action='linkedin-disconnect'").get().n, 1);
});

test("Migration 0039: zweimal anwendbar, Reservierung ist je Event und je LinkedIn-ID eindeutig", async () => {
  const { raw } = await setup(), sql = readFileSync(new URL("../migrations/0039_linkedin_events.sql", import.meta.url), "utf8");
  raw.exec(sql); raw.exec(sql);
  for (const s of sql.replace(/--[^\n]*/g, "").split(";").map((x) => x.trim()).filter(Boolean)) assert.match(s, /^CREATE (TABLE|UNIQUE INDEX|INDEX) IF NOT EXISTS /);
  raw.exec("INSERT INTO linkedin_events(event_id,published,updated) VALUES(1,1,1),(2,1,1)");   // zwei Reservierungen ohne URN vertragen sich
  assert.deepEqual({ ...raw.prepare("SELECT urn,status FROM linkedin_events WHERE event_id=1").get() }, { urn: "", status: "pending" });
  assert.throws(() => raw.exec("INSERT INTO linkedin_events(event_id,published,updated) VALUES(1,1,1)"), /UNIQUE|PRIMARY/);
  raw.exec("UPDATE linkedin_events SET urn='urn:li:event:5' WHERE event_id=1");
  assert.throws(() => raw.exec("UPDATE linkedin_events SET urn='urn:li:event:5' WHERE event_id=2"), /UNIQUE/);
});

// ---------- Zweite Runde ----------
test("R2-1 Wartezeit zaehlt ab der Reservierung: langsames HeySummit oeffnet kein Fenster fuer Freigeben und zweites Veroeffentlichen", async (t) => {
  freeze(t, NOW); const { raw, env } = await setup(); await connected(env); addEv(raw);
  const log = [], base = mockFetch(log), mid = [];
  // HeySummit braucht 119 s. Waehrend der LinkedIn-Aufruf noch laeuft (2 s spaeter), versucht ein zweiter Reiter freizugeben und neu zu veroeffentlichen
  const f = async (u, init) => {
    if (String(u) === HS.api + HS.events) t.mock.timers.setTime(NOW + 119000);
    if (String(u) === LI.api + LI.events) { t.mock.timers.setTime(NOW + 121000); mid.push(raw.prepare("SELECT updated,published FROM linkedin_events").get().updated, await act(env, ADMIN, "release", { event_id: 1 }, true, base), await act(env, ADMIN, "publish", { event_id: 1 }, true, base), (await proposals(env, base)).items[0].wait); }
    return base(u, init);
  };
  assert.deepEqual(await act(env, ADMIN, "publish", "m365con-day1", true, f), { ok: true, urn: "urn:li:event:777", linkedin_url: "https://www.linkedin.com/events/777/" });
  assert.deepEqual(mid, [(NOW + 119000) / 1000, { error: "publish_running" }, { error: "publish_pending" }, HOLD_S - 2], "Stempel = Uhr beim Eintragen der Reservierung");
  assert.equal(creates(log), 1); assert.deepEqual(liRows(raw), [{ event_id: 1, urn: "urn:li:event:777", status: "published" }]);
  // auch ein von aussen vorgegebener (alter) Anfragezeitpunkt aendert den Stempel nicht
  addEv(raw, { id: 2, handle: "stream", title: "Stream", url: "", start: "2027-01-11T08:30", end: "" });
  assert.equal((await act(env, ADMIN, "publish", "stream", true, mockFetch(log, { create: () => new Response("", { status: 500 }) }), Date.now() - 119000)).pending, true);
  assert.equal(raw.prepare("SELECT updated FROM linkedin_events WHERE event_id=2").get().updated, Math.floor(Date.now() / 1000));
  assert.equal((await act(env, ADMIN, "release", { event_id: 2 }, true, base)).error, "publish_running");
  // die Wartezeit deckt alles, was nach der Reservierung noch warten kann, doppelt ab; auch die Token-Erneuerung hat eine Frist
  assert.ok(HOLD_S * 1000 >= 2 * (LI.timeoutMs + LI.tokenTimeoutMs));
  await env.DB.prepare("UPDATE linkedin_conn SET expires=1").run(); addEv(raw, { id: 3, handle: "tag-2", title: "Tag 2", start: "2027-01-12T09:00", end: "" });
  const seen = [], hang = async (u, init) => { if (String(u) === LI.token) { seen.push(init.signal); throw Object.assign(new Error("t"), { name: "TimeoutError" }); } return base(u, init); };
  const n = creates(log);
  assert.deepEqual(await act(env, ADMIN, "publish", "tag-2", true, hang), { error: "li_timeout" });
  assert.ok(seen[0] instanceof AbortSignal); assert.equal(creates(log), n, "ohne Token kein Aufruf an die Event-API");
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM linkedin_events WHERE event_id=3").get().n, 0, "sicher nichts angelegt: Reservierung wieder frei");
});

test("R2-1 eine Reservierung wird nur von dem Aufruf beschrieben oder entfernt, der sie angelegt hat", async (t) => {
  freeze(t, NOW); const { raw, env } = await setup(); await connected(env); addEv(raw);
  const log = [], base = mockFetch(log), after = NOW + (HOLD_S + 5) * 1000;
  // Aufruf A haengt ueber die Wartezeit hinaus (das verhindern sonst die Fristen); der Admin gibt zu Unrecht frei und veroeffentlicht neu (B). Danach antwortet LinkedIn auf A.
  const slow = (answer, second) => async (u, init) => {
    if (String(u) !== LI.api + LI.events) return base(u, init);
    t.mock.timers.setTime(after); assert.deepEqual(await act(env, ADMIN, "release", { event_id: 1 }, true, base), { ok: true });
    await act(env, ADMIN, "publish", { event_id: 1 }, true, second); return answer();
  };
  const a = await act(env, ADMIN, "publish", "m365con-day1", true, slow(() => new Response("", { status: 201, headers: { "x-restli-id": "999" } }), base));
  assert.deepEqual(a, { error: "store_failed", lost: true, urn: "urn:li:event:999", linkedin_url: "https://www.linkedin.com/events/999/" }, "A meldet seinen Event, statt die Zeile von B zu ueberschreiben");
  assert.deepEqual(liRows(raw), [{ event_id: 1, urn: "urn:li:event:777", status: "published" }]);
  assert.deepEqual(raw.prepare("SELECT action,detail FROM audit WHERE action LIKE 'linkedin-publish%' ORDER BY id").all().map((r) => [r.action, r.detail]), [["linkedin-publish", "urn:li:event:777"], ["linkedin-publish-lost", "urn:li:event:999"]]);
  // A wird sicher abgelehnt, waehrend B noch offen ist: die Reservierung von B bleibt stehen
  t.mock.timers.setTime(NOW); addEv(raw, { id: 2, handle: "stream", title: "Stream", url: "", start: "2027-01-11T08:30", end: "" });
  const open = mockFetch(log, { create: () => new Response("", { status: 500 }) });
  const slow2 = async (u, init) => {
    if (String(u) !== LI.api + LI.events) return base(u, init);
    t.mock.timers.setTime(after); assert.deepEqual(await act(env, ADMIN, "release", { event_id: 2 }, true, base), { ok: true });
    assert.equal((await act(env, ADMIN, "publish", { event_id: 2 }, true, open)).pending, true); return new Response("", { status: 422 });
  };
  assert.deepEqual(await act(env, ADMIN, "publish", "stream", true, slow2), { error: "li_422" });
  assert.deepEqual(liRows(raw)[1], { event_id: 2, urn: "", status: "pending" });
  // A wird angelegt, waehrend B noch offen ist: A traegt sich nicht in die Reservierung von B ein (deren Ausgang klaert der Admin)
  t.mock.timers.setTime(NOW); addEv(raw, { id: 3, handle: "tag-2", title: "Tag 2", start: "2027-01-12T09:00", end: "" });
  const slow3 = async (u, init) => {
    if (String(u) !== LI.api + LI.events) return base(u, init);
    t.mock.timers.setTime(after); assert.deepEqual(await act(env, ADMIN, "release", { event_id: 3 }, true, base), { ok: true });
    assert.equal((await act(env, ADMIN, "publish", { event_id: 3 }, true, open)).pending, true); return new Response("", { status: 201, headers: { "x-restli-id": "998" } });
  };
  assert.deepEqual(await act(env, ADMIN, "publish", "tag-2", true, slow3), { error: "store_failed", lost: true, urn: "urn:li:event:998", linkedin_url: "https://www.linkedin.com/events/998/" });
  assert.deepEqual(liRows(raw)[2], { event_id: 3, urn: "", status: "pending" });
});

test("R2-2 Vorschlagsliste: Events ohne Uhrzeit verbrauchen die Grenze nicht (sie werden gezaehlt); wird die Grenze erreicht, sagt die Antwort es", async () => {
  const { raw, env } = await setup(); await connected(env);
  const ins = raw.prepare("INSERT INTO events(handle,owner_id,title,start,end,public,created,updated) VALUES(?,1,?,?,'',1,1,1)");
  // mehr als CAND_MAX kommende Events nur mit Datum: sie koennen nie ein Vorschlag werden, zaehlen nicht gegen die Grenze, werden aber gemeldet (no_time)
  raw.exec("BEGIN"); for (let i = 0; i < CAND_MAX + 20; i++) ins.run(`cday-${i}`, `Community Day ${i}`, `2027-01-${10 + (i % 2)}`); raw.exec("COMMIT");
  addEv(raw, { id: 90001 }); addEv(raw, { id: 90002, handle: "tag-2", title: "Tag 2", start: "2027-01-12T09:00", end: "2027-01-12T17:00" });
  addEv(raw, { id: 90003, handle: "lang", title: "Beginnt frueher, laeuft in den Kongress", start: "2027-01-05T09:00", end: "2027-01-12" });
  addEv(raw, { id: 90004, handle: "nach-dem-kongress", title: "Gleicher Host, danach", start: "2027-02-10T09:00", end: "" });
  const f = mockFetch([]), p = await proposals(env, f, NOW);
  assert.deepEqual(p.items.map((x) => [x.handle, x.hs ? x.hs.how : null]), [["lang", "linked"], ["m365con-day1", "linked"], ["tag-2", "linked"], ["nach-dem-kongress", null]]);   // nach dem Kongress: Kandidat ohne Zusatzinfo
  assert.deepEqual([p.truncated, p.limit, p.no_time], [false, CAND_MAX, CAND_MAX + 20]);
  // mehr als CAND_MAX Events mit Uhrzeit: die naechsten werden geprueft, der Rest fehlt - und das wird gemeldet
  raw.exec("BEGIN"); for (let i = 0; i < CAND_MAX + 20; i++) ins.run(`abend-${i}`, `Abendstream ${i}`, `2027-01-${String(13 + (i % 8)).padStart(2, "0")}T18:00`); raw.exec("COMMIT");
  addEv(raw, { id: 99001, handle: "letzter-tag", title: "Letzter Tag", start: "2027-03-22T09:00", end: "" });
  const p2 = await proposals(env, f, NOW);
  assert.equal(p2.truncated, true); assert.equal(p2.items.length, CAND_MAX); assert.deepEqual(p2.items.slice(0, 3).map((x) => x.handle), ["lang", "m365con-day1", "tag-2"]); assert.ok(!p2.items.some((x) => x.handle === "letzter-tag"));
  // veroeffentlichte Events haengen nicht an der Grenze, und sie verbrauchen sie nicht
  assert.equal((await act(env, ADMIN, "publish", "letzter-tag", true, f, NOW)).ok, true);
  const p3 = await proposals(env, f, NOW); assert.deepEqual(p3.items.map((x) => [x.handle, x.state]).at(-1), ["letzter-tag", "published"]); assert.equal(p3.items.length, CAND_MAX + 1);
  // ohne kommendes HeySummit-Event wird trotzdem vorgeschlagen (nur die Zusatzinfo fehlt)
  const none = await proposals(env, mockFetch([], { hsEvents: HS_EVENTS.filter((e) => e.id !== 229506) }), NOW);
  assert.equal(none.items.length, CAND_MAX + 1); assert.ok(none.items.filter((x) => x.state === "proposal").every((x) => x.hs === null)); assert.equal(none.truncated, true);
});

test("R2-3 nicht veroeffentlichte HeySummit-Events (is_live false) zaehlen nie als gleichzeitig", async () => {
  const draft = { id: 229209, url: "https://m365-con-copy.heysummit.com", title: "M365 Con (copy)", event_url: "https://m365-con-copy.heysummit.com", first_talk_at: "2027-03-01T09:00:00", last_talk_at: "2027-03-01T10:00:00", is_live: false, is_archived: false, status: "planning", timezone: "Europe/Berlin" };
  const ev = { ...EV, handle: "kopie", url: "https://m365-con-copy.heysummit.com/", start: "2027-03-01T10:00", end: "" };
  const feed = (e) => async (u) => { u = String(u); calls.push(u); return u === HS.api + HS.events ? J(page([e])) : J(page([talk({ id: 9, event: e.id, title: "Talk", url: e.url + "/talks/x/", date: "2027-03-01T09:00:00" })])); };
  let calls = [];
  const off = await fetchHeySummit({ HEYSUMMIT_API_KEY: "hk" }, feed(draft), NOW);
  assert.deepEqual(off, { events: [], partial: false }); assert.deepEqual(calls, [HS.api + HS.events], "fuer einen Entwurf werden auch keine Talks geladen");
  assert.equal(matchHeySummit(ev, off.events, {}, NOW).reason, "no_match");
  calls = []; const live = await fetchHeySummit({ HEYSUMMIT_API_KEY: "hk" }, feed({ ...draft, is_live: true }), NOW);   // Gegenprobe: derselbe Event, veroeffentlicht
  assert.equal(matchHeySummit(ev, live.events, {}, NOW).how, "linked");
  const noFlag = { ...draft }; delete noFlag.is_live;   // fehlt das Feld, entscheidet es nichts
  assert.equal((await fetchHeySummit({ HEYSUMMIT_API_KEY: "hk" }, feed(noFlag), NOW)).events.length, 1);
  assert.equal(HS.evLive, "is_live"); assert.ok(HS_EVENTS.some((e) => e.id === 229209 && e.is_live === false), "die echte Kopie steht in der Fixture und fehlt im Ergebnis (Test oben)");
  // Server: weder Vorschlag noch Veroeffentlichung, kein Aufruf an LinkedIn
  const { raw, env } = await setup(); await connected(env); addEv(raw, ev);
  const log = [], f = mockFetch(log, { hsEvents: [draft] });
  const pk = (await proposals(env, f, NOW)).items; assert.deepEqual(pk.map((x) => [x.handle, x.hs]), [["kopie", null]]);   // der Entwurf ist keine Zusatzinfo, das Event bleibt ein Kandidat
  assert.equal((await act(env, ADMIN, "publish", "kopie", true, f, NOW)).ok, true); assert.equal(creates(log), 1);
});

test("R2-4 auf LinkedIn selbst geloeschter Event: Absagen meldet es, erst die ausdrueckliche Bestaetigung traegt ihn hier aus", async () => {
  const { raw, env } = await setup(); await connected(env); addEv(raw); addEv(raw, { id: 2, handle: "stream", title: "Stream", url: "", start: "2027-01-11T08:30", end: "" });
  const log = [], f = mockFetch(log), gone = (st = 404) => mockFetch(log, { patch: () => new Response("", { status: st }) }), call = rest(env, gone());
  for (const h of ["m365con-day1", "stream"]) assert.equal((await act(env, ADMIN, "publish", h, true, f, NOW)).ok, true);
  assert.deepEqual(await call("/api/admin/linkedin/cancel", "POST", { event_id: 1, confirm: true }), { status: 409, j: { error: "li_gone", linkedin_url: "https://www.linkedin.com/events/777/" } });
  assert.deepEqual(await call("/api/admin/linkedin/cancel", "POST", { event_id: 1, confirm: true, gone: "ja" }), { status: 409, j: { error: "li_gone", linkedin_url: "https://www.linkedin.com/events/777/" } }, "nur gone === true zaehlt");
  assert.equal(liRows(raw)[0].status, "published"); assert.equal(await linkedinUrlFor(env.DB, 1), "https://www.linkedin.com/events/777/");
  raw.prepare("UPDATE events SET title='Neu' WHERE id=1").run();
  assert.deepEqual(await act(env, ADMIN, "update", { event_id: 1 }, true, gone(410), NOW), { error: "li_gone", linkedin_url: "https://www.linkedin.com/events/777/" });
  // die Bestaetigung allein genuegt nicht: LinkedIn muss dabei wieder 404/410 antworten
  assert.deepEqual(await act(env, ADMIN, "cancel", { event_id: 1, gone: true }, true, gone(500), NOW), { error: "li_500" }); assert.equal(liRows(raw)[0].status, "published");
  assert.deepEqual(await act(env, ADMIN, "cancel", { event_id: 1, gone: true }, false, gone(), NOW), { preview: { action: "cancel", urn: "urn:li:event:777", linkedin_url: "https://www.linkedin.com/events/777/" } });
  assert.deepEqual(await call("/api/admin/linkedin/cancel", "POST", { event_id: 1, confirm: true, gone: true }), { status: 200, j: { ok: true, linkedin_url: "https://www.linkedin.com/events/777/", gone: true } });
  assert.deepEqual(liRows(raw)[0], { event_id: 1, urn: "urn:li:event:777", status: "cancelled" }); assert.equal(await linkedinUrlFor(env.DB, 1), "", "der tote Link verschwindet von der Event-Seite");
  assert.equal((await act(env, ADMIN, "publish", { event_id: 1 }, true, f, NOW)).error, "cancelled");
  assert.deepEqual(raw.prepare("SELECT action,target,detail FROM audit WHERE action LIKE 'linkedin-cancel%'").all().map((r) => ({ ...r })), [{ action: "linkedin-cancel-gone", target: "m365con-day1", detail: "urn:li:event:777" }]);
  // gibt es den Event auf LinkedIn doch noch, wird er trotz gone ganz normal abgesagt; eine verwaiste Zeile ist nach "gone" erledigt
  raw.exec("DELETE FROM events WHERE id=2");
  assert.deepEqual(await act(env, ADMIN, "cancel", { event_id: 2 }, true, gone(410), NOW), { error: "li_gone", linkedin_url: "https://www.linkedin.com/events/778/" });
  assert.deepEqual(await act(env, ADMIN, "cancel", { event_id: 2, gone: true }, true, gone(410), NOW), { ok: true, linkedin_url: "https://www.linkedin.com/events/778/", gone: true });
  assert.deepEqual(liRows(raw), [{ event_id: 1, urn: "urn:li:event:777", status: "cancelled" }]);
  addEv(raw, { id: 3, handle: "tag-2", title: "Tag 2", start: "2027-01-12T09:00", end: "" }); assert.equal((await act(env, ADMIN, "publish", "tag-2", true, f, NOW)).ok, true);
  assert.deepEqual(await act(env, ADMIN, "cancel", { event_id: 3, gone: true }, true, f, NOW), { ok: true, linkedin_url: "https://www.linkedin.com/events/779/" });
});

test("R2-5 store_failed: mit dem Beleg aus der Antwort laesst sich die LinkedIn-ID sofort eintragen; ohne ihn gilt die Wartezeit", async (t) => {
  freeze(t, NOW); const { raw, env } = await setup(); await connected(env); addEv(raw); addEv(raw, { id: 2, handle: "stream", title: "Stream", url: "", start: "2027-01-11T08:30", end: "" });
  let k = 0; const log = [], f = mockFetch(log, { create: () => new Response("", { status: 201, headers: { "x-restli-id": "712345678901234567" + (++k) } }) }), call = rest(env, f);   // IDs so lang wie bei LinkedIn
  const URN = "urn:li:event:7123456789012345671", URL1 = "https://www.linkedin.com/events/7123456789012345671/", URN2 = "urn:li:event:7123456789012345672";
  env.DB.failOn = (sql) => /^UPDATE linkedin_events SET urn=/.test(sql);
  const a = await act(env, ADMIN, "publish", "m365con-day1", true, f), b = await act(env, ADMIN, "publish", "stream", true, f); env.DB.failOn = null;
  assert.deepEqual([a.error, a.pending, a.urn, b.urn], ["store_failed", true, URN, URN2]); assert.notEqual(a.ticket, b.ticket);
  // ohne Beleg, mit fremdem Beleg oder mit anderer ID: wie bisher erst nach der Wartezeit
  for (const body of [{ urn: URN }, { urn: URN, ticket: b.ticket }, { urn: URN2, ticket: a.ticket }, { urn: URN, ticket: "x" }, { urn: URN, ticket: 7 }])
    assert.deepEqual(await call("/api/admin/linkedin/resolve", "POST", { event_id: 1, confirm: true, ...body }), { status: 409, j: { error: "publish_running" } }, JSON.stringify(body));
  assert.equal((await act(env, ADMIN, "release", { event_id: 1, ticket: a.ticket, urn: URN }, true, f)).error, "publish_running", "der Beleg gilt nur fuers Eintragen");
  assert.deepEqual(await act(env, ADMIN, "resolve", { event_id: 1, urn: URL1, ticket: a.ticket }, false, f), { preview: { action: "resolve", urn: URN, linkedin_url: URL1 } });
  assert.deepEqual(await call("/api/admin/linkedin/resolve", "POST", { event_id: 1, confirm: true, urn: URN, ticket: a.ticket }), { status: 200, j: { ok: true, urn: URN, linkedin_url: URL1 } });
  assert.deepEqual(liRows(raw), [{ event_id: 1, urn: URN, status: "published" }, { event_id: 2, urn: "", status: "pending" }]);
  // der Beleg haengt an genau dieser Reservierung: nach Freigabe und neuem Versuch gilt er nicht mehr
  t.mock.timers.setTime(LATER); assert.deepEqual(await act(env, ADMIN, "release", { event_id: 2 }, true, f), { ok: true });
  assert.equal((await act(env, ADMIN, "publish", "stream", true, mockFetch(log, { create: () => new Response("", { status: 500 }) }))).pending, true);
  assert.equal((await act(env, ADMIN, "resolve", { event_id: 2, urn: URN2, ticket: b.ticket }, true, f)).error, "publish_running");
  // ein kurzer D1-Aussetzer beim Eintragen wird wiederholt, statt den Admin zu bemuehen
  addEv(raw, { id: 3, handle: "tag-2", title: "Tag 2", start: "2027-01-12T09:00", end: "" }); let fails = 2;
  env.DB.failOn = (sql) => /^UPDATE linkedin_events SET urn=/.test(sql) && fails-- > 0;
  assert.equal((await act(env, ADMIN, "publish", "tag-2", true, f)).ok, true); env.DB.failOn = null;
  assert.deepEqual(liRows(raw)[2], { event_id: 3, urn: "urn:li:event:7123456789012345673", status: "published" });
});

// ---------- OAuth, Verschluesselung, Zugriff ----------
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
  const log = [], f = mockFetch(log), mk = () => new Request("https://x/cb", { headers: { cookie: ck } });
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

test("Seitenwahl: Organisationen laden und URN speichern (nur gueltige URN)", async () => {
  const { env } = await setup(); await connected(env, false);
  const call = rest(env, mockFetch([]));
  assert.deepEqual((await call("/api/admin/linkedin/orgs")).j.orgs, [{ urn: "urn:li:organization:42", name: "M365 Show" }]);
  assert.equal((await call("/api/admin/linkedin/org", "POST", { urn: "evil" })).j.error, "bad_urn");
  assert.equal((await call("/api/admin/linkedin/org", "POST", { urn: "urn:li:organization:42", name: "M365 Show" })).j.ok, true);
  assert.equal((await getConn(env.DB)).org_name, "M365 Show");
});

test("Nur Admin: REST, MCP und Event-Export ohne Token", async () => {
  const { raw, env } = await setup(); await connected(env); addEv(raw);
  const f = mockFetch([]);
  for (const r of routes().filter((x) => x.startsWith("/api/admin/linkedin/"))) for (const m of ["GET", "POST"]) for (const u of [null, { id: 2, admin: false }])
    assert.equal((await rest(env, f, u)(r, m, m === "POST" ? { handle: "m365con-day1", event_id: 1, confirm: true } : undefined)).status, 403, `${m} ${r}`);
  for (const a of ["publish", "update", "cancel", "resolve", "release"]) assert.equal((await act(env, { id: 2, admin: false }, a, "m365con-day1", true, f, NOW)).error, "forbidden");
  const user = { id: 2, admin: false };
  assert.equal((await callTool(env, user, "linkedin_event_proposals", {})).error, "forbidden");
  assert.equal((await callTool(env, user, "publish_linkedin_event", { handle: "m365con-day1" })).error, "forbidden");
  const pub = await handleEvents(env, new Request("https://x/api/events/export"), new URL("https://x/api/events/export"), "/api/events/export", null, J);
  const txt = await pub.text(); assert.ok(!txt.includes("AT") || !/access|token|urn:li:organization/.test(txt));
});

test("MCP publish_linkedin_event veroeffentlicht nie, nur Vorschau", async (t) => {
  freeze(t, NOW); const { raw, env } = await setup(); await connected(env); addEv(raw);
  const log = [], realFetch = globalThis.fetch; globalThis.fetch = mockFetch(log);
  try {
    const out = await callTool(env, ADMIN, "publish_linkedin_event", { handle: "m365con-day1", confirm: true });
    assert.ok(out.preview); assert.equal(out.confirm_in_browser, "https://www.m365.fm/admin/#li"); assert.equal(creates(log), 0);
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM linkedin_events").get().n, 0);
    const list = await callTool(env, ADMIN, "linkedin_event_proposals", {});
    assert.deepEqual(list.items.map((x) => [x.handle, x.state]), [["m365con-day1", "proposal"]]);
  } finally { globalThis.fetch = realFetch; }
});

test("Event-Export zeigt die LinkedIn-URL nur fuer veroeffentlichte Events (nicht reserviert, nicht abgesagt)", async () => {
  const { raw, env } = await setup(); addEv(raw);
  const get = async () => (await (await handleEvents(env, new Request("https://x/api/events/export"), new URL("https://x/api/events/export"), "/api/events/export", null, J)).json()).events[0];
  assert.equal((await get()).linkedin_url, "");
  raw.prepare("INSERT INTO linkedin_events(event_id,published,updated) VALUES(1,1,1)").run();
  assert.equal((await get()).linkedin_url, "", "Reservierung");
  raw.prepare("UPDATE linkedin_events SET urn='urn:li:event:777',url='https://www.linkedin.com/events/777/',status='published'").run();
  assert.equal((await get()).linkedin_url, "https://www.linkedin.com/events/777/");
  raw.prepare("UPDATE linkedin_events SET status='cancelled'").run();
  assert.equal((await get()).linkedin_url, "");
});

// ---------- Admin-Reiter (assets/admin.js unveraendert in node:vm, kleines Schein-DOM, Aufrufe gehen an den echten Handler) ----------
function fakeDom() {
  class Text { constructor(t) { this.nodeType = 3; this.data = String(t); } get textContent() { return this.data; } }
  class El {
    constructor(tag) { this.nodeType = 1; this.tagName = tag.toUpperCase(); this.attrs = {}; this.childNodes = []; this.className = ""; this.disabled = false; }
    setAttribute(k, v) { this.attrs[k] = String(v); }
    getAttribute(k) { return this.attrs[k] ?? null; }
    get hidden() { return "hidden" in this.attrs; }
    set hidden(v) { if (v) this.attrs.hidden = ""; else delete this.attrs.hidden; }
    appendChild(c) { this.childNodes.push(c); return c; }
    append(...cs) { for (const c of cs) this.appendChild(typeof c === "string" ? new Text(c) : c); }
    get textContent() { return this.childNodes.map((n) => n.textContent).join(""); }
    set textContent(t) { this.childNodes = []; if (t != null && t !== "") this.childNodes.push(new Text(t)); }
    get innerHTML() { throw new Error("innerHTML in admin.js"); }
    set innerHTML(_) { throw new Error("innerHTML in admin.js"); }
    all(tag) { const out = []; const walk = (n) => { for (const c of n.childNodes) if (c.nodeType === 1) { if (c.tagName === tag.toUpperCase()) out.push(c); walk(c); } }; walk(this); return out; }
    querySelector(sel) { const m = /^\[([\w-]+)=([\w-]+)\]$/.exec(sel); if (!m) throw new Error("Selektor nicht unterstuetzt: " + sel); let hit = null; const walk = (n) => { for (const c of n.childNodes) if (c.nodeType === 1 && !hit) { if (c.attrs[m[1]] === m[2]) hit = c; else walk(c); } }; walk(this); return hit; }
  }
  const root = new El("div");
  return { root, document: { createElement: (t) => new El(t), createTextNode: (t) => new Text(t), getElementById: (id) => (id === "adm" ? root : null) } };
}
async function until(cond, what) { for (let i = 0; i < 500; i++) { if (cond()) return; await new Promise((r) => setTimeout(r, 2)); } assert.fail("Zeitueberschreitung: " + what); }

// Startet assets/admin.js im Reiter LinkedIn. o.storage = sessionStorage-Ersatz (ueberlebt einen neuen Seitenaufruf), o.intercept(pfad, body) kann eine Antwort vorgeben.
function bootAdmin(env, f, o = {}) {
  const { root, document } = fakeDom(), asked = [], sent = [];
  const fetch = async (url, init = {}) => {
    const u = new URL(url); if (u.pathname === "/api/admin/panel/overview") return J({ queues: {} });
    const body = init.body ? JSON.parse(init.body) : undefined; sent.push({ path: u.pathname, method: init.method || "GET", xrw: (init.headers || {})["x-requested-with"], body });
    return (o.intercept && o.intercept(u.pathname, body)) || handleLinkedinEvents(env, new Request(u, { method: init.method || "GET", headers: init.headers, body: init.body }), u, u.pathname, ADMIN, J, f);
  };
  const win = { M365ADM: { api: "https://api.test", base: "" }, confirm: (q) => { asked.push(q); return o.confirm ? o.confirm(q) : true; }, prompt: () => "", ...(o.storage ? { sessionStorage: o.storage } : {}) };
  vm.runInContext(readFileSync(new URL("../../assets/admin.js", import.meta.url), "utf8"), vm.createContext({ window: win, document, location: { hash: "#li", search: "" }, fetch, setTimeout }), { filename: "assets/admin.js" });
  const pane = () => root.all("section").find((x) => x.all("h2")[0]?.textContent === "LinkedIn-Events (Vorschläge)"), rows = () => (pane()?.all("tbody")[0]?.all("tr") || []).map((tr) => tr.all("td"));
  const buttons = (cells) => cells[5].all("button"), names = (cells) => buttons(cells).map((b) => b.textContent), note = () => pane().all("p").find((x) => x.className.startsWith("adm-msg")).textContent;
  const click = (b) => b.onclick({ target: b }), reload = () => click(root.querySelector("[data-k=li]"));
  const state = (txt) => until(() => rows().length === 1 && rows()[0][5].textContent.startsWith(txt), txt + " / ist: " + (rows()[0]?.[5].textContent || pane()?.textContent));
  return { root, sent, asked, pane, rows, buttons, names, note, click, reload, state };
}
const memStore = () => { const m = new Map(); return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => { m.set(k, String(v)); } }; };

test("Admin-Reiter: Knoepfe folgen dem Server; eine haengende Veroeffentlichung laesst sich dort klaeren, ein verwaister Event dort absagen", async (t) => {
  freeze(t, NOW);
  const { raw, env } = await setup(); await connected(env); addEv(raw, { free: 0, mode: "onsite", location: "Köln" });
  const log = [], o = { create: () => new Response("", { status: 201 }) }, f = mockFetch(log, { create: () => o.create() });
  const { sent, asked, pane, rows, buttons, names, note, click, reload, state } = bootAdmin(env, f);

  await state("Vorschlag");
  assert.deepEqual(rows()[0].slice(0, 3).map((c) => c.textContent), ["M365Con Day 1", "11.01.2027, 08:00 – 11.01.2027, 17:00", "Vor Ort, kostenpflichtig"]);
  assert.match(rows()[0][4].textContent, /Ort: Köln/); assert.doesNotMatch(rows()[0][4].textContent, /kostenlos anmelden/i);
  assert.deepEqual(names(rows()[0]), ["Auf LinkedIn veröffentlichen"]);
  // 1) Veroeffentlichen, LinkedIn nennt keine ID: Hinweis, Zeile "offen", waehrend der Wartezeit kein Knopf
  click(buttons(rows()[0])[0]); await state("Veröffentlichung offen");
  assert.match(asked.at(-1), /^Jetzt öffentlich auf LinkedIn veröffentlichen\?\n\nM365Con Day 1\n/);
  assert.deepEqual(sent.at(-3), { path: "/api/admin/linkedin/publish", method: "POST", xrw: "m365", body: { event_id: 1, confirm: true } });
  assert.match(note(), /keine Event-ID.*auf LinkedIn nachsehen/); assert.deepEqual(names(rows()[0]), []); assert.match(rows()[0][5].textContent, /klären in 2 Min\. möglich/);
  // 2) nach der Wartezeit: ID eintragen oder freigeben; freigeben -> wieder Vorschlag
  t.mock.timers.setTime(LATER); reload(); await until(() => rows().length === 1 && names(rows()[0]).length === 2, "Knoepfe zum Klaeren");
  assert.deepEqual(names(rows()[0]), ["LinkedIn-ID eintragen", "Reservierung freigeben"]);
  click(buttons(rows()[0])[0]); assert.equal(sent.at(-1).path, "/api/admin/linkedin/proposals", "ohne Eingabe im Dialog geht nichts raus");
  click(buttons(rows()[0])[1]); await state("Vorschlag");
  assert.match(asked.at(-1), /KEIN Event/); assert.deepEqual(liRows(raw), []);
  // 3) jetzt klappt es: veroeffentlicht, Link, nur "Absagen" (nichts geaendert)
  o.create = () => new Response("", { status: 201, headers: { "x-restli-id": "7123456789012345678" } });
  click(buttons(rows()[0])[0]); await state("Veröffentlicht");
  assert.deepEqual(names(rows()[0]), ["Absagen"]); assert.equal(rows()[0][5].all("a")[0].getAttribute("href"), "https://www.linkedin.com/events/7123456789012345678/");
  assert.equal(creates(log), 2);
  // 4) m365.fm-Event geloescht: Zeile bleibt als verwaist mit "Absagen"; danach ist die Liste leer
  raw.exec("DELETE FROM events WHERE id=1"); reload(); await state("Veröffentlicht · m365.fm-Event gelöscht");
  assert.deepEqual(names(rows()[0]), ["Absagen"]);
  click(buttons(rows()[0])[0]); await until(() => /Keine Vorschläge/.test(pane().textContent), "leere Liste");
  assert.deepEqual(sent.findLast((x) => x.method === "POST"), { path: "/api/admin/linkedin/cancel", method: "POST", xrw: "m365", body: { event_id: 1, confirm: true } });
  assert.deepEqual(liRows(raw), []); assert.equal(patches(log).length, 1);
});

test("Admin-Reiter R2: nach store_failed sofort eintragbar (auch nach Neuladen), auf LinkedIn geloeschter Event austragbar, gekuerzte Liste wird gemeldet", async (t) => {
  freeze(t, NOW);
  const { raw, env } = await setup(); await connected(env); addEv(raw);
  const ID = "7123456789012345678", log = [], o = { patch: () => new Response(null, { status: 204 }) }, f = mockFetch(log, { create: () => new Response("", { status: 201, headers: { "x-restli-id": ID } }), patch: () => o.patch() });
  const storage = memStore(); let ui = bootAdmin(env, f, { storage });
  await ui.state("Vorschlag");
  // 1) LinkedIn legt an, D1 traegt nicht ein: ID im Hinweis UND an der Zeile, Knopf "Jetzt eintragen" ohne Wartezeit
  env.DB.failOn = (sql) => /^UPDATE linkedin_events SET urn=/.test(sql);
  ui.click(ui.buttons(ui.rows()[0])[0]); await ui.state("Veröffentlichung offen"); env.DB.failOn = null;
  assert.match(ui.note(), new RegExp("nicht gespeichert.*LinkedIn-Event-ID: " + ID + ".*Jetzt eintragen"));
  assert.deepEqual(ui.names(ui.rows()[0]), ["Jetzt eintragen"]); assert.match(ui.rows()[0][5].textContent, new RegExp("LinkedIn hat den Event angelegt \\(ID " + ID + "\\)"));
  // Reiter neu laden: der Hinweis oben ist weg, die ID an der Zeile und der Knopf bleiben
  ui.reload(); await until(() => ui.rows().length === 1 && ui.note() === "" && ui.names(ui.rows()[0]).length === 1, "Zeile nach dem Neuladen");
  assert.deepEqual(ui.names(ui.rows()[0]), ["Jetzt eintragen"]);
  // ganze Seite neu laden (neuer Kontext, gleicher sessionStorage): immer noch da
  ui = bootAdmin(env, f, { storage }); await ui.state("Veröffentlichung offen");
  assert.deepEqual(ui.names(ui.rows()[0]), ["Jetzt eintragen"]); assert.match(ui.rows()[0][5].textContent, new RegExp("ID " + ID));
  ui.click(ui.buttons(ui.rows()[0])[0]); await ui.state("Veröffentlicht");
  const rs = ui.sent.findLast((x) => x.method === "POST");
  assert.deepEqual([rs.path, rs.body.event_id, rs.body.urn, rs.body.confirm, typeof rs.body.ticket], ["/api/admin/linkedin/resolve", 1, "urn:li:event:" + ID, true, "string"]);
  assert.deepEqual(liRows(raw), [{ event_id: 1, urn: "urn:li:event:" + ID, status: "published" }]); assert.equal(creates(log), 1);
  assert.equal(storage.getItem("m365li"), "{}", "Merkzettel ist nach dem Eintragen leer"); assert.deepEqual(ui.names(ui.rows()[0]), ["Absagen"]);
  // 2) der Event wurde auf LinkedIn selbst geloescht: Absagen -> 404 -> zweite Rueckfrage -> hier als abgesagt eingetragen
  o.patch = () => new Response("", { status: 404 });
  ui.click(ui.buttons(ui.rows()[0])[0]); await ui.state("Abgesagt");
  assert.match(ui.asked.at(-2), /^Event auf LinkedIn absagen\?/); assert.match(ui.asked.at(-1), /^LinkedIn kennt diesen Event nicht \(mehr\)\.[\s\S]*wirklich nicht mehr gibt[\s\S]*M365Con Day 1$/);
  assert.deepEqual(ui.sent.filter((x) => x.path === "/api/admin/linkedin/cancel").map((x) => x.body), [{ event_id: 1, confirm: true }, { event_id: 1, confirm: true, gone: true }]);
  assert.match(ui.note(), /gab es den Event nicht mehr/); assert.deepEqual(liRows(raw), [{ event_id: 1, urn: "urn:li:event:" + ID, status: "cancelled" }]); assert.deepEqual(ui.names(ui.rows()[0]), []);
  // lehnt der Admin die zweite Rueckfrage ab, bleibt alles, wie es ist
  addEv(raw, { id: 2, handle: "stream", title: "Stream", url: "", start: "2027-01-11T08:30", end: "" }); raw.exec("DELETE FROM events WHERE id=1; DELETE FROM linkedin_events");
  const f2 = mockFetch(log, { create: () => new Response("", { status: 201, headers: { "x-restli-id": "7123456789012345679" } }), patch: () => new Response("", { status: 410 }) });
  ui = bootAdmin(env, f2, { storage, confirm: (q) => !/nicht \(mehr\)/.test(q) }); await ui.state("Vorschlag");
  ui.click(ui.buttons(ui.rows()[0])[0]); await ui.state("Veröffentlicht");
  ui.click(ui.buttons(ui.rows()[0])[0]); await until(() => /kennt diesen Event nicht/.test(ui.note()), "Hinweis li_gone");
  assert.equal(liRows(raw)[0].status, "published"); assert.ok(!ui.sent.some((x) => x.body && x.body.gone));
  // 3) Reservierung inzwischen neu belegt (lost): der Hinweis bleibt ueber das Neuladen stehen, bis er abgehakt ist
  raw.exec("DELETE FROM linkedin_events");
  ui = bootAdmin(env, f2, { storage, intercept: (path) => (path === "/api/admin/linkedin/publish" ? J({ error: "store_failed", lost: true, urn: "urn:li:event:999999", linkedin_url: "https://www.linkedin.com/events/999999/" }, 502) : null) });
  await ui.state("Vorschlag"); ui.click(ui.buttons(ui.rows()[0])[0]);
  const lost = () => (ui.pane()?.all("p") || []).find((x) => /hat hier aber keinen Eintrag/.test(x.textContent));
  await until(() => lost(), "Hinweis lost"); assert.match(lost().textContent, /LinkedIn-Event 999999 \(„Stream“\).*direkt auf LinkedIn absagen oder löschen/); assert.equal(lost().all("a")[0].getAttribute("href"), "https://www.linkedin.com/events/999999/");
  ui = bootAdmin(env, f2, { storage }); await until(() => lost(), "Hinweis lost nach neuem Seitenaufruf");
  ui.click(lost().all("button")[0]); await until(() => ui.rows().length === 1 && !lost(), "abgehakt"); assert.equal(storage.getItem("m365li"), "{}");
  // 4) mehr Kandidaten als die Grenze: die Liste sagt, dass sie gekuerzt ist
  const ins = raw.prepare("INSERT INTO events(handle,owner_id,title,start,end,public,created,updated) VALUES(?,1,?,?,'',1,1,1)");
  raw.exec("BEGIN"); for (let i = 0; i <= CAND_MAX; i++) ins.run(`abend-${i}`, `Abendstream ${i}`, `2027-01-${String(13 + (i % 8)).padStart(2, "0")}T18:00`); raw.exec("COMMIT");
  ui.reload(); await until(() => new RegExp("mehr als " + CAND_MAX + " übernommene kommende m365\\.fm-Events").test(ui.pane()?.textContent || ""), "Hinweis gekuerzt");
});

// ---------- #317 (Event-Import) x #323: Zusammenfuehren, Zuruecknehmen, Loeschen und Vorschlagsliste, alles ueber die echten Routen ----------
const imp = (env, user = ADMIN) => async (path, method = "GET", body) => { const r = await handleEventImport(env, new Request("https://x" + path, { method, body: body ? JSON.stringify(body) : undefined }), new URL("https://x" + path), path, user, J); return { status: r.status, j: await r.json() }; };
const evDel = async (env, h) => (await handleEvents(env, new Request("https://x/api/event/" + h, { method: "DELETE" }), new URL("https://x/api/event/" + h), "/api/event/" + h, ADMIN, J)).status;
const dupeMerge = async (raw, env, a, b) => { const q = raw.prepare("INSERT INTO dedupe_queue(kind,a_id,b_id,reason,created) VALUES('event',?,?,'test',1)").run(a, b); const r = await imp(env)("/api/admin/events/dupes", "POST", { id: Number(q.lastInsertRowid), action: "merge" }); assert.equal(r.status, 200, JSON.stringify(r.j)); return raw.prepare("SELECT id FROM merge_log WHERE kind='event' AND from_id=? AND into_id=? ORDER BY id DESC").get(b, a).id; };

test("317-01b Event-Zusammenfuehrung: die LinkedIn-Zeile wandert mit und zurueck, eine vorhandene des Ziel-Events bleibt; Loeschen laesst veroeffentlichte stehen", async (t) => {
  freeze(t, NOW); const { raw, env } = await setup(); await connected(env);
  addEv(raw); addEv(raw, { id: 2, handle: "stream", title: "Stream", url: "", start: "2027-01-11T08:30", end: "" }); addEv(raw, { id: 3, handle: "drei", title: "Drei", url: "", start: "2027-01-11T09:10", end: "" });
  const f = mockFetch([]), call = rest(env, f);
  assert.equal((await act(env, ADMIN, "publish", "stream", true, f, NOW)).ok, true);
  // (1) Ziel-Event ohne LinkedIn-Zeile: sie wandert mit (Liste und Event-Export zeigen sie am Ziel), beim Zuruecknehmen zurueck
  const l1 = await dupeMerge(raw, env, 1, 2);
  assert.deepEqual(liRows(raw), [{ event_id: 1, urn: "urn:li:event:777", status: "published" }]);
  let items = (await call("/api/admin/linkedin/proposals")).j.items;
  assert.deepEqual(items.filter((x) => x.id <= 2).map((x) => [x.id, x.state, x.linkedin_url]), [[1, "published", "https://www.linkedin.com/events/777/"]], "kein verwaister Eintrag fuer das ausgeblendete Event");
  assert.equal((await (await handleEvents(env, new Request("https://x/api/events/export"), new URL("https://x/api/events/export"), "/api/events/export", null, J)).json()).events.find((e) => e.handle === "m365con-day1").linkedin_url, "https://www.linkedin.com/events/777/");
  assert.equal((await imp(env)("/api/admin/events/unmerge", "POST", { log: l1 })).status, 200);
  assert.deepEqual(liRows(raw), [{ event_id: 2, urn: "urn:li:event:777", status: "published" }]);
  // (2) beide haben eine Zeile: die des Ziel-Events bleibt, die des Quell-Events bleibt am ausgeblendeten Event und ist dort weiter absagbar
  assert.equal((await act(env, ADMIN, "publish", "m365con-day1", true, f, NOW)).ok, true);
  assert.equal((await act(env, ADMIN, "publish", "drei", true, f, NOW)).ok, true);
  const l2 = await dupeMerge(raw, env, 1, 3);
  assert.deepEqual(liRows(raw).map((r) => [r.event_id, r.urn]), [[1, "urn:li:event:778"], [2, "urn:li:event:777"], [3, "urn:li:event:779"]]);
  const hid = (await call("/api/admin/linkedin/proposals")).j.items.find((x) => x.id === 3);
  assert.deepEqual([hid.state, hid.hidden, hid.can], ["published", true, ["cancel"]]);
  assert.equal((await imp(env)("/api/admin/events/unmerge", "POST", { log: l2 })).status, 200);
  assert.deepEqual(liRows(raw).map((r) => [r.event_id, r.urn]), [[1, "urn:li:event:778"], [2, "urn:li:event:777"], [3, "urn:li:event:779"]], "die Zeile des Ziel-Events geht nicht an das Quell-Event");
  // (3) Loeschen des Ziel-Events (mit ausgeblendetem Quell-Event): veroeffentlichte Zeilen bleiben (verwaist, absagbar), eine abgesagte faellt weg
  await dupeMerge(raw, env, 2, 3);
  assert.equal((await act(env, ADMIN, "cancel", { event_id: 3 }, true, f, NOW)).ok, true);
  assert.equal(await evDel(env, "stream"), 200);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM events WHERE id IN (2,3)").get().n, 0);
  assert.deepEqual(liRows(raw), [{ event_id: 1, urn: "urn:li:event:778", status: "published" }, { event_id: 2, urn: "urn:li:event:777", status: "published" }]);
  const orphan = (await call("/api/admin/linkedin/proposals")).j.items.find((x) => x.id === 2);
  assert.deepEqual([orphan.orphan, orphan.can], [true, ["cancel"]]);
});

test("317-01b Eine Reservierung bleibt beim Zusammenfuehren am Quell-Event; Zuruecknehmen bringt keine spaeter am Ziel-Event angelegte Zeile", async (t) => {
  freeze(t, NOW); const { raw, env } = await setup(); await connected(env);
  addEv(raw); addEv(raw, { id: 2, handle: "stream", title: "Stream", url: "", start: "2027-01-11T08:30", end: "" });
  assert.equal((await act(env, ADMIN, "publish", "stream", true, mockFetch([], { create: () => new Response("", { status: 500 }) }), NOW)).pending, true);   // Reservierung am Quell-Event
  const l = await dupeMerge(raw, env, 1, 2);
  assert.deepEqual(liRows(raw), [{ event_id: 2, urn: "", status: "pending" }], "bleibt, wo das Veroeffentlichen sie sucht");
  t.mock.timers.setTime(LATER);
  assert.equal((await act(env, ADMIN, "release", { event_id: 2 }, true, mockFetch([]), LATER)).ok, true);
  assert.equal((await act(env, ADMIN, "publish", "m365con-day1", true, mockFetch([]), LATER)).ok, true);   // neu am Ziel-Event, nach der Zusammenfuehrung
  assert.equal((await imp(env)("/api/admin/events/unmerge", "POST", { log: l })).status, 200);
  assert.deepEqual(liRows(raw), [{ event_id: 1, urn: "urn:li:event:777", status: "published" }]);
});

test("317-01b Zusammenfuehrung waehrend des LinkedIn-Aufrufs: die URN landet trotzdem in der Reservierung, eine sichere Ablehnung gibt sie frei", async (t) => {
  freeze(t, NOW); const { raw, env } = await setup(); await connected(env);
  addEv(raw); addEv(raw, { id: 2, handle: "stream", title: "Stream", url: "", start: "2027-01-11T08:30", end: "" }); addEv(raw, { id: 3, handle: "drei", title: "Drei", url: "", start: "2027-01-11T09:10", end: "" });
  const ok = mockFetch([], { create: async () => { await dupeMerge(raw, env, 1, 2); return new Response("", { status: 201, headers: { "x-restli-id": "900" } }); } });
  const r = await act(env, ADMIN, "publish", "stream", true, ok, NOW); assert.equal(r.ok, true, JSON.stringify(r));
  assert.deepEqual(liRows(raw), [{ event_id: 2, urn: "urn:li:event:900", status: "published" }], "kein store_failed, keine haengende Reservierung");
  const no = mockFetch([], { create: async () => { await dupeMerge(raw, env, 1, 3); return new Response("nein", { status: 400 }); } });
  assert.equal((await act(env, ADMIN, "publish", "drei", true, no, NOW)).ok, undefined);
  assert.deepEqual(liRows(raw).map((x) => x.event_id), [2], "die Reservierung von Event 3 ist wieder frei");
});

test("317-01b Vorschlagsliste: importierte Events ohne Veranstalter, zusammengefuehrte und vorbei gemeldete nie; uebernommene und Mitglieds-Events schon", async (t) => {
  freeze(t, NOW); const { raw, env } = await setup(); await connected(env);
  raw.prepare("INSERT INTO profiles(user_id,public,handle,updated) VALUES(2,1,'normal',1)").run();
  addEv(raw);
  addEv(raw, { id: 2, handle: "import-offen", title: "Import offen", url: "", start: "2027-01-12T10:00", end: "", owner_id: 0 });
  addEv(raw, { id: 3, handle: "import-uebernommen", title: "Import uebernommen", url: "", start: "2027-01-12T11:00", end: "", owner_id: 0 });
  addEv(raw, { id: 4, handle: "zusammengefuehrt", title: "Zusammengefuehrt", url: "", start: "2027-01-12T12:00", end: "" });
  addEv(raw, { id: 5, handle: "vorbei-gemeldet", title: "Vorbei gemeldet", url: "", start: "2027-01-12T13:00", end: "", owner_id: 0 });
  raw.exec("UPDATE events SET owner_id=0,unclaimed=1,source='communitydays' WHERE id IN (2,3); UPDATE events SET merged_into=1 WHERE id=4; UPDATE events SET owner_id=0,source='communitydays',retired=1 WHERE id=5");
  const call = rest(env, mockFetch([])), props = async () => (await call("/api/admin/linkedin/proposals")).j.items.filter((x) => x.state === "proposal").map((x) => x.handle);
  assert.deepEqual(await props(), ["m365con-day1"]);
  assert.equal((await act(env, ADMIN, "publish", "import-offen", false, mockFetch([]), NOW)).error, "not_public");
  // Beanspruchen und Freigeben ueber die echten Routen: danach ist es ein Event mit Veranstalter
  assert.equal((await imp(env, { id: 2, name: "Normal" })("/api/event/import-uebernommen/claim", "POST", {})).status, 200);
  assert.deepEqual(await props(), ["m365con-day1"], "nur beansprucht, noch nicht freigegeben");
  assert.equal((await imp(env)("/api/admin/events/claim", "POST", { event_id: 3, user_id: 2, ok: true })).status, 200);
  assert.deepEqual(await props(), ["m365con-day1", "import-uebernommen"]);
});

// ---------- Folge-PR (F02, F10, F11, F12) ----------
test("F02 (#317) Reservierung am zusammengefuehrten Quell-Event: das Ziel-Event wird nicht ein zweites Mal veroeffentlicht (auch ueber zwei Stufen)", async (t) => {
  freeze(t, NOW); const { raw, env } = await setup(); await connected(env);
  addEv(raw); addEv(raw, { id: 2, handle: "stream", title: "Stream", url: "", start: "2027-01-11T08:30", end: "" }); addEv(raw, { id: 3, handle: "drei", title: "Drei", url: "", start: "2027-01-11T09:10", end: "" });
  const log = [], f = mockFetch(log), call = rest(env, f);
  assert.equal((await act(env, ADMIN, "publish", "drei", true, mockFetch([], { create: () => new Response("", { status: 500 }) }), NOW)).pending, true);   // Ausgang offen
  await dupeMerge(raw, env, 2, 3); const l = await dupeMerge(raw, env, 1, 2);   // 3 -> 2 -> 1
  assert.deepEqual(liRows(raw), [{ event_id: 3, urn: "", status: "pending" }]);
  const items = (await call("/api/admin/linkedin/proposals")).j.items;
  assert.deepEqual(items.map((x) => [x.id, x.state, x.hidden, x.can]), [[3, "pending", true, []]], "Event 1 ist kein neuer Vorschlag; die Reservierung laeuft noch");
  assert.deepEqual(await call("/api/admin/linkedin/publish", "POST", { handle: "m365con-day1", confirm: true }), { status: 409, j: { error: "publish_pending" } });
  assert.equal(creates(log), 0);
  // aufgeloest: der LinkedIn-Event haengt am ausgeblendeten Event, das Ziel-Event bleibt belegt
  t.mock.timers.setTime(LATER);
  const rs = await act(env, ADMIN, "resolve", { event_id: 3, urn: "urn:li:event:424242" }, true, f, LATER); assert.equal(rs.ok, true, JSON.stringify(rs));
  assert.deepEqual(await act(env, ADMIN, "publish", "m365con-day1", true, f, LATER), { error: "already_published", linkedin_url: "https://www.linkedin.com/events/424242/" });
  assert.ok(!(await proposals(env, f, LATER)).items.some((x) => x.id === 1 && x.state === "proposal"));
  // Zuruecknehmen trennt die Events wieder: dann ist Event 1 frei
  assert.equal((await imp(env)("/api/admin/events/unmerge", "POST", { log: l })).status, 200);
  assert.ok((await proposals(env, f, LATER)).items.some((x) => x.id === 1 && x.state === "proposal"));
  assert.equal(creates(log), 0);
});

test("F10 (#323) 404 auf Absagen/Aktualisieren gilt erst als 'auf LinkedIn geloescht', wenn auch das Lesen des Events 404/410 antwortet", async () => {
  const { raw, env } = await setup(); await connected(env); addEv(raw);
  const log = [], f = mockFetch(log);
  assert.equal((await act(env, ADMIN, "publish", "m365con-day1", true, f, NOW)).ok, true);
  // falscher Pfad o. ae.: Aendern antwortet 404, der Event selbst ist aber lesbar
  const path404 = (getStatus) => { const base = mockFetch(log, { patch: () => new Response("", { status: 404 }) }); return async (u, init = {}) => (String(u).startsWith(LI.api + LI.events + "/") && (init.method || "GET") === "GET" ? (log.push({ u: String(u), method: "GET" }), new Response("{}", { status: getStatus })) : base(u, init)); };
  log.length = 0;
  assert.deepEqual(await act(env, ADMIN, "cancel", { event_id: 1 }, true, path404(200), NOW), { error: "li_404" });
  assert.deepEqual(log.filter((x) => x.u.startsWith(LI.api + LI.events + "/")).map((x) => [x.method, x.u]), [["POST", LI.api + LI.events + "/urn%3Ali%3Aevent%3A777"], ["GET", LI.api + LI.events + "/urn%3Ali%3Aevent%3A777"]], "derselbe Pfad wird gelesen");
  assert.deepEqual(await act(env, ADMIN, "cancel", { event_id: 1, gone: true }, true, path404(200), NOW), { error: "li_404" }, "auch mit Bestaetigung wird nichts ausgetragen");
  raw.prepare("UPDATE events SET title='Neu' WHERE id=1").run();
  assert.deepEqual(await act(env, ADMIN, "update", { event_id: 1 }, true, path404(200), NOW), { error: "li_404" });
  assert.deepEqual(await act(env, ADMIN, "cancel", { event_id: 1, gone: true }, true, path404(500), NOW), { error: "li_404" }, "Lesen scheitert anders: offen, nichts austragen");
  assert.deepEqual(liRows(raw), [{ event_id: 1, urn: "urn:li:event:777", status: "published" }]); assert.equal(await linkedinUrlFor(env.DB, 1), "https://www.linkedin.com/events/777/");
  // Lesen bestaetigt 404/410: erst dann li_gone, und mit gone erledigt
  assert.deepEqual(await act(env, ADMIN, "cancel", { event_id: 1 }, true, path404(410), NOW), { error: "li_gone", linkedin_url: "https://www.linkedin.com/events/777/" });
  assert.deepEqual(await act(env, ADMIN, "cancel", { event_id: 1, gone: true }, true, path404(404), NOW), { ok: true, linkedin_url: "https://www.linkedin.com/events/777/", gone: true });
  assert.equal(LI.version, "202511", "Version und Pfad bleiben bis zum Live-Test unveraendert");
});

test("F11 (#323) Zusatzinfo HeySummit: Zeitzonen (UTC+14, UTC-12), Ueberschneidung nur in UTC; die Vorschlaege selbst haengen nicht daran", async () => {
  const { raw, env } = await setup(); await connected(env);
  // HeySummit-Zeitraum: 2027-01-11T07:00Z bis 2027-01-22T19:45Z. Beide Events liegen in Ortszeit ausserhalb, in UTC innerhalb.
  addEv(raw, { id: 1, handle: "kiritimati", title: "Kiritimati", start: "2027-01-23T09:30", end: "", tz: "Pacific/Kiritimati" });   // = 2027-01-22T19:30Z
  addEv(raw, { id: 2, handle: "gmt-12", title: "GMT-12", start: "2027-01-10T19:10", end: "", tz: "Etc/GMT+12" });                // = 2027-01-11T07:10Z
  addEv(raw, { id: 3, handle: "zu-spaet", title: "Zu spaet", start: "2027-01-23T10:00", end: "", tz: "Pacific/Kiritimati" });     // = 2027-01-22T20:00Z: kein Treffer
  const p = await proposals(env, mockFetch([]), NOW);
  assert.deepEqual(p.items.map((x) => [x.handle, x.state, x.hs?.how]), [["gmt-12", "proposal", "linked"], ["kiritimati", "proposal", "linked"], ["zu-spaet", "proposal", undefined]]);   // "zu-spaet" ist in UTC kein Treffer, bleibt aber ein Kandidat
});

test("F12 (#323) verwaiste veroeffentlichte Zeilen verschwinden nach dem Ende des Events (Liste und taeglicher Cron), Reservierungen und bestehende Events bleiben", async (t) => {
  freeze(t, NOW); const { raw, env } = await setup(); await connected(env);
  addEv(raw, { owner_id: 2 }); addEv(raw, { id: 2, handle: "stream", title: "Stream", url: "", start: "2027-01-11T08:30", end: "", owner_id: 2 }); addEv(raw, { id: 3, handle: "bleibt", title: "Bleibt", url: "", start: "2027-01-11T09:10", end: "" });
  const f = mockFetch([]);
  assert.equal((await act(env, ADMIN, "publish", "m365con-day1", true, f, NOW)).ok, true);
  assert.equal((await act(env, ADMIN, "publish", "bleibt", true, f, NOW)).ok, true);
  assert.equal((await act(env, ADMIN, "publish", "stream", true, mockFetch([], { create: () => new Response("", { status: 500 }) }), NOW)).pending, true);
  await deleteUserEvents(env.DB, 2);
  assert.deepEqual(await purgeLinkedinOrphans(env.DB, NOW), { deleted: 0 }, "vor dem Ende: noch absagbar");
  const END = Date.UTC(2027, 0, 11, 16);   // LinkedIn-Event 1 ist zu Ende
  assert.deepEqual((await proposals(env, f, END)).items.map((x) => [x.id, x.state]), [[2, "pending"]]);
  assert.deepEqual(liRows(raw).map((r) => [r.event_id, r.status]), [[2, "pending"], [3, "published"]], "Handle und Titel des geloeschten Events sind weg");
  // taeglicher Cron
  raw.prepare("INSERT INTO events(id,handle,owner_id,title,start,end,public,created,updated) VALUES(4,'weg',2,'Weg','2027-01-11T10:00','',1,1,1)").run();
  raw.prepare("INSERT INTO linkedin_events(event_id,urn,url,status,hash,handle,title,starts,ends,published_by,published,updated) VALUES(4,'urn:li:event:5','u','published','h','weg','Weg',1,?,1,1,1)").run(END - 1000);
  raw.exec("DELETE FROM events WHERE id=4");
  t.mock.timers.setTime(END); const err = console.error, lg = console.log, gf = globalThis.fetch;
  try {
    globalThis.fetch = async () => new Response("{}", { status: 404 }); console.error = () => {}; console.log = () => {};
    const w = []; await worker.scheduled({ cron: "0 6 * * *", scheduledTime: END }, env, { waitUntil: (x) => w.push(x) }); await Promise.all(w);
  } finally { console.error = err; console.log = lg; globalThis.fetch = gf; }
  assert.deepEqual(raw.prepare("SELECT ok FROM cron_runs WHERE name='purgeLinkedinOrphans'").all().map((r) => r.ok), [1]);
  assert.deepEqual(liRows(raw).map((r) => [r.event_id, r.status]), [[2, "pending"], [3, "published"]]);
});

test("Seite von Hand (10.11.): die m365.fm-App hat kein r_organization_admin - Adresse oder Nummer der Seite reicht, die Seitenliste meldet no_org_scope", async () => {
  // orgUrn: Schul-, Unternehmens- und Showcase-Seiten, Admin-Adresse, Nummer, URN; alles andere nicht
  assert.equal(orgUrn("https://www.linkedin.com/school/107092120/admin/"), "urn:li:organization:107092120");
  assert.equal(orgUrn("https://de.linkedin.com/company/123456/"), "urn:li:organization:123456");
  assert.equal(orgUrn("https://www.linkedin.com/showcase/77"), "urn:li:organization:77");
  assert.equal(orgUrn(" 107092120 "), "urn:li:organization:107092120");
  assert.equal(orgUrn("urn:li:organization:42"), "urn:li:organization:42");
  for (const bad of ["", "https://evil.example/company/1/", "https://www.linkedin.com/in/someone/", "https://www.linkedin.com/company/m365fm/", "urn:li:person:1", "12a"]) assert.equal(orgUrn(bad), "", bad);
  // Verbinden fragt nur Scopes an, die die App hat
  assert.deepEqual(LI.scope.split(" ").sort(), ["r_events", "rw_events"]);
  const { env } = await setup(); await connected(env, false);
  const f = mockFetch([]), call = rest(env, f);
  assert.deepEqual(await call("/api/admin/linkedin/org", "POST", { ref: "https://www.linkedin.com/school/107092120/admin/", name: "M365.FM" }), { status: 200, j: { ok: true } });
  const c = await getConn(env.DB); assert.deepEqual([c.org_urn, c.org_name], ["urn:li:organization:107092120", "M365.FM"]);
  assert.equal((await call("/api/admin/linkedin/org", "POST", { ref: "https://www.linkedin.com/in/someone/" })).j.error, "bad_urn");
  // Seitenliste ohne r_organization_admin: LinkedIn antwortet 403 -> verstaendlicher Fehler statt li_403
  const f403 = async (u, init) => (String(u).includes("organizationAcls") ? new Response("", { status: 403 }) : f(u, init));
  assert.deepEqual(await rest(env, f403)("/api/admin/linkedin/orgs"), { status: 502, j: { error: "no_org_scope" } });
});
