// Event-Pruefliste (Migration 0045): neue Events des Scrapers und von noch nicht bestaetigten Mitgliedern warten auf die Entscheidung eines Admins und sind bis dahin
// nirgends oeffentlich; Events bestaetigter Mitglieder sind sofort sichtbar; "Uebernehmen" macht ein Event oeffentlich und zum LinkedIn-Vorschlag (ohne HeySummit),
// "Ablehnen" merkt es sich, damit der Import es nicht noch einmal anlegt. Nur Fixtures, kein Netz.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { handleEvents } from "../src/events.js";
import { handleEventImport } from "../src/eventimport.js";
import { handleAdminPanel } from "../src/adminpanel.js";
import { runCommunityDays } from "../src/communitydays.js";
import { queueSessionReminders } from "../src/topic_notifications.js";
import { confirmedMember, memberReview, countReview, listReview, decideReview } from "../src/eventreview.js";
import { proposals } from "../src/linkedin_events.js";
import { callTool, handleMcp } from "../src/mcp.js";

const J = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json" } });
async function setup() {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:"), dir = new URL("../migrations/", import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(f, dir), "utf8"));
  const reads = (sql) => /^\s*(SELECT|WITH)\b/i.test(sql);
  const db = { prepare(sql) { let args = []; const exec = () => { if (reads(sql)) return { results: raw.prepare(sql).all(...args), meta: { changes: 0, last_row_id: 0 } }; const r = raw.prepare(sql).run(...args); return { results: [], meta: { changes: Number(r.changes), last_row_id: Number(r.lastInsertRowid) } }; };
    const o = { bind(...a) { args = a; return o; }, exec: async () => exec(), all: async () => ({ results: raw.prepare(sql).all(...args) }), first: async () => raw.prepare(sql).get(...args) ?? null, run: async () => exec() }; return o; },
    async batch(s) { const out = []; for (const x of s) out.push(await x.exec()); return out; } };
  const pages = {}, fetch = async (url) => { const p = pages[String(url)]; return p === undefined ? new Response("nf", { status: 404 }) : new Response(String(p), { status: 200 }); };
  raw.prepare("INSERT INTO meta(k,v) VALUES('entity_source','db')").run();
  const env = { DB: db, SITE: "https://site.test", IMPORT_OPTS: { fetch, sleep: async () => {} }, PAGES: { put: async () => {} } };
  return { raw, env, pages, opts: env.IMPORT_OPTS };
}
const user = (raw, id, name, handle, extra = {}) => { raw.prepare("INSERT INTO users(id,provider,sub,name,created) VALUES(?,'github',?,?,1)").run(id, "s" + id, name); if (handle) raw.prepare("INSERT INTO profiles(user_id,public,handle,updated) VALUES(?,1,?,1)").run(id, handle); if (extra.role) raw.prepare("UPDATE users SET role=? WHERE id=?").run(extra.role, id); return { id, name, ...extra }; };
const via = (handler, env) => (u, path, method = "GET", b) => { const req = new Request("https://x" + path, { method, body: b ? JSON.stringify(b) : undefined }); return handler(env, req, new URL(req.url), path, u, J).then(async (r) => [r.status, await r.json()]); };
const cdEvent = (o = {}) => ({ name: "Azure Day Bonn", startDate: "2027-03-16T09:00", url: "https://communitydays.org/events/bonn", description: "Azure day in Bonn with a long text about everything that happens there.", location: { address: { addressLocality: "Bonn" } }, ...o });
const ldList = (events) => `<html><head><script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": events.map((e) => ({ "@type": "Event", ...e })) }).replace(/<\//g, "<\\/")}</script></head></html>`;
const cdRun = async (s, list, today = "2026-11-01") => {
  Object.assign(s.pages, { "https://communitydays.org/robots.txt": "", "https://communitydays.org/events.ics": "nope", "https://communitydays.org/calendar.ics": "nope", "https://communitydays.org/feed.ics": "nope", "https://communitydays.org/events": ldList(list) });
  s.raw.exec("DELETE FROM import_cache"); return runCommunityDays(s.env, { ...s.opts, today, force: true });
};
const exportList = async (env) => (await (await handleEvents(env, new Request("https://x/api/events/export"), new URL("https://x/api/events/export"), "/api/events/export", null, J)).json()).events;
const log = (raw) => raw.prepare("SELECT user_id,role,action,kind,item_id,before,after FROM edit_log ORDER BY id").all().map((r) => ({ ...r, before: JSON.parse(r.before || "{}"), after: JSON.parse(r.after || "{}") }));
const NOW = Date.UTC(2026, 10, 9, 12);
const noNet = async () => new Response("", { status: 404 });
const MEMBER_EV = { handle: "pp-abend-wien", title: "Power Platform Abend Wien", start: "2027-03-20T18:00", mode: "onsite", location: "Wien", url: "https://example.org/pp-wien" };

test("Migration 0045: bestehende Events bleiben freigegeben und oeffentlich, keine neue Tabelle", async () => {
  const sql = readFileSync(new URL("../migrations/0045_event_review.sql", import.meta.url), "utf8");
  assert.ok(!/CREATE TABLE/i.test(sql), "keine neue Tabelle: nichts mit Nutzerbezug in mergeStatements/deleteAccount noetig");
  const { DatabaseSync } = await import("node:sqlite"), raw = new DatabaseSync(":memory:"), dir = new URL("../migrations/", import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql") && f < "0045").sort()) raw.exec(readFileSync(new URL(f, dir), "utf8"));
  raw.exec("INSERT INTO events(handle,owner_id,title,start,mode,created,updated,public) VALUES('alt',1,'Altes Event','2026-12-01','online',1,1,1)");
  raw.exec(sql);
  assert.deepEqual({ ...raw.prepare("SELECT review,review_at,public FROM events").get() }, { review: "approved", review_at: 0, public: 1 });
});

test("Scraper-Event kommt zur Pruefung: nirgends oeffentlich, bei erneutem Import keine Dublette", async () => {
  const s = await setup(), { raw, env } = s;
  const r = await cdRun(s, [cdEvent()]); assert.equal(r.created, 1);
  const e = raw.prepare("SELECT * FROM events").get();
  assert.deepEqual([e.review, e.public, e.review_at], ["pending", 0, 0]);
  assert.deepEqual(await exportList(env), [], "nicht im Export (Seite, Sitemap, Feeds, Suche bauen darauf)");
  // Erinnerungen und Benachrichtigungen: eine Session des Events loest nichts aus
  raw.exec(`INSERT INTO event_sessions(id,event_id,title,start,status,proposer_id,created) VALUES(7,${e.id},'Keynote','2027-03-16T09:00','live',0,1); INSERT INTO push_subs(endpoint,p256dh,auth,lang,created,digest) VALUES('https://push.example/r','p','a','en',1,0); INSERT INTO push_topics(endpoint,kind,topic_id,lang,timezone,created) VALUES('https://push.example/r','session','7','en','UTC',1);`);
  await queueSessionReminders({ DB: env.DB, SITE: "https://www.m365.fm" }, Math.floor(Date.UTC(2027, 2, 16, 8, 45) / 1000));
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM topic_queue").get().n, 0);
  // MCP-Liste und Einzelabruf (anonym) kennen es nicht
  const rpc = await handleMcp(env, new Request("https://x/mcp", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name: "list_events", arguments: {} } }) }), async () => null, null);
  assert.ok(!JSON.stringify(await rpc.json()).includes("Azure Day Bonn"));
  // erneuter Import: weder neue Zeile noch Dublette
  const again = await cdRun(s, [cdEvent()], "2026-11-02"); assert.equal(again.created, 0);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM events").get().n, 1);
  assert.equal(await countReview(env.DB), 1);
});

test("Admin-Liste, Uebernehmen und Ablehnen: nur Admin ueber gate(), Eintraege im Redaktionsprotokoll", async () => {
  const s = await setup(), { raw, env } = s, call = via(handleEventImport, env);
  const admin = { ...user(raw, 1, "Admin", "admin-p"), admin: true }, editor = user(raw, 2, "Editorin", "ed-p", { role: "editor" }), mod = user(raw, 3, "Moderator", "mod-p", { role: "moderator" });
  await cdRun(s, [cdEvent(), cdEvent({ name: "Teams Day Hamburg", url: "https://communitydays.org/events/hamburg", location: { address: { addressLocality: "Hamburg" } } })]);
  const [id1, id2] = raw.prepare("SELECT id FROM events ORDER BY id").all().map((r) => r.id);
  for (const u of [editor, mod, { id: 9 }, null]) {
    assert.deepEqual(await call(u, "/api/admin/events/review", "GET"), [403, { error: "forbidden" }]);
    assert.deepEqual(await call(u, "/api/admin/events/review", "POST", { id: id1, action: "approve" }), [403, { error: "forbidden" }]);
    assert.deepEqual(await callTool(env, u || {}, "manage_event_duplicates", { action: "list_review" }), { error: "forbidden" });
  }
  assert.deepEqual(raw.prepare("SELECT review FROM events ORDER BY id").all().map((r) => r.review), ["pending", "pending"]);
  const list = await call(admin, "/api/admin/events/review", "GET"); assert.equal(list[0], 200);
  assert.equal(list[1].total, 2); const it = list[1].items[0];
  assert.deepEqual([it.title, it.start, it.place, it.source, it.source_url], ["Azure Day Bonn", "2027-03-16T09:00", "Bonn", "communitydays", "https://communitydays.org/events/bonn"]);
  assert.equal((await call(admin, "/api/admin/events/review", "POST", { id: id1, action: "nonsense" }))[0], 400);
  assert.equal((await call(admin, "/api/admin/events/review", "POST", { id: 999, action: "approve" }))[0], 404);
  const ok = await call(admin, "/api/admin/events/review", "POST", { id: id1, action: "approve" }); assert.equal(ok[0], 200); assert.equal(ok[1].review, "approved");
  assert.equal((await call(admin, "/api/admin/events/review", "POST", { id: id1, action: "approve" }))[0], 400, "zweimal geht nicht");
  assert.equal((await call(admin, "/api/admin/events/review", "POST", { id: id2, action: "reject" }))[0], 200);
  assert.deepEqual((await exportList(env)).map((e) => e.title), ["Azure Day Bonn"], "nur das uebernommene Event ist oeffentlich");
  const e2 = raw.prepare("SELECT review,public FROM events WHERE id=?").get(id2); assert.deepEqual([e2.review, e2.public], ["rejected", 0]);
  assert.deepEqual(log(raw).map((l) => [l.user_id, l.role, l.action, l.kind, l.item_id, l.before.review, l.after.review]), [
    [1, "admin", "review.approve", "event", String(id1), "pending", "approved"],
    [1, "admin", "review.reject", "event", String(id2), "pending", "rejected"],
  ]);
  // abgelehnt bleibt abgelehnt: der Import legt es nicht noch einmal an, auch nicht unter geaendertem Datum; "Doch uebernehmen" holt es zurueck
  const again = await cdRun(s, [cdEvent(), cdEvent({ name: "Teams Day Hamburg", url: "https://communitydays.org/events/hamburg", startDate: "2027-03-17T09:00", location: { address: { addressLocality: "Hamburg" } } })], "2026-11-03");
  assert.equal(again.created, 0); assert.equal(raw.prepare("SELECT COUNT(*) n FROM events").get().n, 2);
  assert.equal(raw.prepare("SELECT review FROM events WHERE id=?").get(id2).review, "rejected");
  assert.deepEqual((await call(admin, "/api/admin/events/review", "GET"))[1].rejected.map((r) => r.id), [id2]);
  assert.equal((await call(admin, "/api/admin/events/review", "POST", { id: id2, action: "approve" }))[0], 200);
  assert.deepEqual((await exportList(env)).map((e) => e.title).sort(), ["Azure Day Bonn", "Teams Day Hamburg"]);
});

test("Moegliche Dubletten stehen in der Liste", async () => {
  const s = await setup(), { raw, env } = s;
  raw.prepare("INSERT INTO events(handle,owner_id,title,start,mode,created,updated,public,name_key,url_key) VALUES('azure-day-bonn',1,'Azure Day Bonn','2027-03-16','onsite',1,1,1,'azure day bonn','')").run();
  await cdRun(s, [cdEvent({ url: "https://communitydays.org/events/bonn-2" })]);
  const l = await listReview(env.DB);
  if (l.total === 1) assert.ok(Array.isArray(l.items[0].dupes));
  else assert.equal(raw.prepare("SELECT COUNT(*) n FROM events WHERE merged_into=0").get().n, 1, "der Import hat es als bekanntes Event erkannt");
});

test("Mitglied ohne Bestaetigung: Event zur Pruefung, nicht oeffentlich; Entitaet erst nach Uebernehmen", async () => {
  const { raw, env } = await setup(), ev = via(handleEvents, env), admin = { ...user(raw, 1, "Admin", "admin-p"), admin: true };
  const anna = user(raw, 5, "Anna", "anna-p");
  assert.equal(await confirmedMember(env.DB, anna), false);
  const r = await ev(anna, "/api/event", "POST", MEMBER_EV); assert.equal(r[0], 200);
  assert.deepEqual([r[1].review, r[1].public], ["pending", false]);
  const row = raw.prepare("SELECT * FROM events").get(); assert.deepEqual([row.review, row.public, row.owner_id], ["pending", 0, 5]);
  assert.deepEqual(await exportList(env), []);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM entity_rev WHERE eid=?").get(row.handle).n, 0, "Entitaet erst nach der Freigabe");
  // Entwurf zuerst speichern und dann oeffentlich schalten hilft nicht
  const d = await ev(anna, "/api/event", "POST", { ...MEMBER_EV, handle: "entwurf-graz", title: "Entwurf Event Graz", url: "https://example.org/graz", public: false }); assert.equal(d[1].review, "draft");
  const d2 = await ev(anna, "/api/event", "POST", { ...MEMBER_EV, handle: "entwurf-graz", title: "Entwurf Event Graz", url: "https://example.org/graz", public: true }); assert.equal(d2[1].review, "pending");
  assert.equal(await countReview(env.DB), 2);
  assert.equal(await confirmedMember(env.DB, anna), false, "eigene Events zur Pruefung geben keine Punkte: sonst wuerde sich ein Mitglied mit dem ersten Event selbst bestaetigen");
  // Overview-Zaehler fuer den Admin
  const realFetch = globalThis.fetch; globalThis.fetch = async () => { throw new Error("offline"); };
  try {
    const u = new URL("https://x/api/admin/panel/overview"), o = await (await handleAdminPanel(env, new Request(u), u, u.pathname, admin, J)).json();
    assert.equal(o.queues.events_review, 2);
  } finally { globalThis.fetch = realFetch; }
  // Admin uebernimmt: oeffentlich, Entitaet entsteht, Mitglied kann weiter bearbeiten (bleibt freigegeben)
  assert.equal((await decideReview(env, row.id, "approve")).ok, true);
  assert.deepEqual((await exportList(env)).map((e) => e.title), ["Power Platform Abend Wien"]);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM entity_rev WHERE eid=?").get(row.handle).n, 1);
  const again = await ev(anna, "/api/event", "POST", { ...MEMBER_EV, handle: row.handle, summary: "neu" }); assert.deepEqual([again[1].review, again[1].public], ["approved", true]);
});

test("Abgelehntes Mitglieder-Event bleibt auch beim erneuten Speichern abgelehnt", async () => {
  const { raw, env } = await setup(), ev = via(handleEvents, env), anna = user(raw, 5, "Anna", "anna-p");
  await ev(anna, "/api/event", "POST", MEMBER_EV); const id = raw.prepare("SELECT id,handle FROM events").get();
  assert.equal((await decideReview(env, id.id, "reject")).ok, true);
  const r = await ev(anna, "/api/event", "POST", { ...MEMBER_EV, handle: id.handle, summary: "nochmal" });
  assert.deepEqual([r[1].review, r[1].public], ["rejected", false]);
  assert.deepEqual(await exportList(env), []);
});

test("Bestaetigte Mitglieder (Programm/MVP, Editor, Moderator, Admin, genug Punkte): sofort oeffentlich, ohne Freigabe", async () => {
  const { raw, env } = await setup(), ev = via(handleEvents, env);
  const who = [
    user(raw, 11, "Mvp Mia", "mia-p", { pro: true }), user(raw, 12, "Editorin", "edi-p", { role: "editor" }),
    user(raw, 13, "Moderator", "modi-p", { role: "moderator" }), { ...user(raw, 14, "Admin", "adm-p"), admin: true },
  ];
  for (const u of who) assert.equal(await confirmedMember(env.DB, u), true, u.name);
  let n = 0;
  for (const u of who) {
    const r = await ev(u, "/api/event", "POST", { ...MEMBER_EV, handle: `event-${++n}`, title: `Event von ${u.name}`, url: `https://example.org/e${n}` });
    assert.equal(r[0], 200); assert.deepEqual([r[1].review, r[1].public], ["approved", true], u.name);
  }
  assert.equal((await exportList(env)).length, 4);
  assert.equal(await countReview(env.DB), 0);
  assert.deepEqual(log(raw), [], "keine Entscheidung noetig, nichts im Protokoll");
  // die Regel im Detail: wer nicht gewollt oeffentlich speichert, bleibt Entwurf bzw. freigegeben
  const anna = user(raw, 20, "Anna", "anna-p");
  assert.deepEqual(await memberReview(env.DB, anna, null, false), { review: "draft", public: 0 });
  assert.deepEqual(await memberReview(env.DB, who[0], null, false), { review: "approved", public: 0 });
  assert.deepEqual(await memberReview(env.DB, anna, null, true), { review: "pending", public: 0 });
});

test("LinkedIn-Vorschlag: uebernommenes Scraper-Event ohne HeySummit; Event zur Pruefung und alter unclaimed-Import nicht; bestaetigtes Mitglied sofort", async () => {
  const s = await setup(), { raw, env } = s, ev = via(handleEvents, env), admin = { ...user(raw, 1, "Admin", "admin-p"), admin: true };
  const mia = user(raw, 11, "Mvp Mia", "mia-p", { pro: true }), anna = user(raw, 5, "Anna", "anna-p");
  await cdRun(s, [cdEvent()]);
  const handles = async () => (await proposals(env, noNet, NOW)).items.filter((x) => x.state === "proposal").map((x) => x.title);
  assert.deepEqual(await handles(), [], "zur Pruefung: kein Vorschlag");
  // altes, nie geprueftes Import-Event (Bestand aus der Zeit vor 0045): bleibt oeffentlich, aber kein Vorschlag
  raw.prepare("INSERT INTO events(handle,owner_id,title,start,mode,created,updated,public,unclaimed,source) VALUES('legacy',0,'Altbestand Import','2027-04-01T10:00','online',1,1,1,1,'communitydays')").run();
  assert.deepEqual(await handles(), []);
  // Anna (unbestaetigt): wartet auf Pruefung, kein Vorschlag
  await ev(anna, "/api/event", "POST", MEMBER_EV);
  assert.deepEqual(await handles(), []);
  // Mia (bestaetigt): sofort im Vorschlag
  await ev(mia, "/api/event", "POST", { ...MEMBER_EV, handle: "mia-meetup-linz", title: "Mia Meetup Linz", url: "https://example.org/linz" });
  assert.deepEqual(await handles(), ["Mia Meetup Linz"]);
  // Admin uebernimmt Scraper-Event und Annas Event: beide erscheinen; kein HeySummit-Schluessel noetig
  for (const r of raw.prepare("SELECT id FROM events WHERE review='pending'").all()) assert.equal((await decideReview(env, r.id, "approve")).ok, true);
  const p = await proposals(env, noNet, NOW);
  assert.deepEqual(p.items.filter((x) => x.state === "proposal").map((x) => x.title).sort(), ["Azure Day Bonn", "Mia Meetup Linz", "Power Platform Abend Wien"]);
  assert.ok(p.items.every((x) => x.state !== "proposal" || x.can.includes("publish")));
  assert.equal(p.review_pending, 0); assert.equal(p.hs_error, "no_heysummit_key", "HeySummit nur Zusatzinfo, kein Hindernis");
});

test("MCP manage_event_duplicates: list_review, approve_event, reject_event nur fuer Admin, mit Protokoll", async () => {
  const s = await setup(), { raw, env } = s, admin = { ...user(raw, 1, "Admin", "admin-p"), admin: true }, editor = user(raw, 2, "Editorin", "ed-p", { role: "editor" });
  await cdRun(s, [cdEvent(), cdEvent({ name: "Teams Day Hamburg", url: "https://communitydays.org/events/hamburg", location: { address: { addressLocality: "Hamburg" } } })]);
  const [a, b] = raw.prepare("SELECT id FROM events ORDER BY id").all().map((r) => r.id);
  for (const action of ["list_review", "approve_event", "reject_event"]) assert.deepEqual(await callTool(env, editor, "manage_event_duplicates", { action, id: a }), { error: "forbidden" });
  const l = await callTool(env, admin, "manage_event_duplicates", { action: "list_review" }); assert.equal(l.total, 2);
  assert.equal((await callTool(env, admin, "manage_event_duplicates", { action: "approve_event", id: a })).ok, true);
  assert.equal((await callTool(env, admin, "manage_event_duplicates", { action: "reject_event", id: b })).ok, true);
  assert.deepEqual(log(raw).map((x) => x.action), ["review.approve", "review.reject"]);
  assert.deepEqual((await exportList(env)).map((e) => e.title), ["Azure Day Bonn"]);
});
