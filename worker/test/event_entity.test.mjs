// Event <-> Event-Entitaet (Migration 0046, evententity.js): Namensvergleich, Vorschlaege per Cron, Zuordnung durch Veranstalter und Admin, oeffentlich nur bestaetigt.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { handleEvents } from "../src/events.js";
import { handleEventEntity, ENTITY_ROUTE, nameHow, matchEntity, suggestEventEntities } from "../src/evententity.js";
import { mergeEvents } from "../src/eventmerge.js";
import { callTool } from "../src/mcp.js";

const J = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json" } });
async function setup() {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:"), dir = new URL("../migrations/", import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(f, dir), "utf8"));
  const n = { calls: 0 }, reads = (sql) => /^\s*(SELECT|WITH)\b/i.test(sql);
  const db = { prepare(sql) { let args = []; const exec = () => { if (reads(sql)) return { results: raw.prepare(sql).all(...args), meta: { changes: 0, last_row_id: 0 } }; const r = raw.prepare(sql).run(...args); return { results: [], meta: { changes: Number(r.changes), last_row_id: Number(r.lastInsertRowid) } }; };
    const o = { bind(...a) { args = a; return o; }, exec: async () => exec(), all: async () => { n.calls++; return { results: raw.prepare(sql).all(...args) }; }, first: async () => { n.calls++; return raw.prepare(sql).get(...args) ?? null; }, run: async () => { n.calls++; return exec(); } }; return o; }, async batch(s) { n.calls++; const out = []; for (const x of s) out.push(await x.exec()); return out; } };
  raw.prepare("INSERT INTO meta(k,v) VALUES('entity_source','db')").run();   // Entitaeten nur aus der Datenbank
  const ent = (eid, data) => raw.prepare("INSERT INTO entity_rev(eid,data,summary,user_id,status,created) VALUES(?,?,?,0,'live',1)").run(eid, JSON.stringify(data), "t");
  ent("microsoft-ignite", { type: "event", name: "Microsoft Ignite", aliases: [] });
  ent("m365con", { type: "event", name: "M365Con 2027", aliases: [] });
  ent("comms-vnext", { type: "event", name: "Comms vNext", aliases: [] });
  ent("copilot", { type: "product", name: "Copilot", aliases: [] });
  return { raw, env: { DB: db, SITE: "https://site.test" }, n };
}
const user = (raw, id, name, role) => { raw.prepare("INSERT INTO users(id,provider,sub,name,created,role) VALUES(?,'github',?,?,1,?)").run(id, "s" + id, name, role || "user"); return { id, name, ...(role === "editor" ? { role } : {}), ...(role === "moderator" ? { role } : {}) }; };
const event = (raw, handle, title, o = {}) => raw.prepare("INSERT INTO events(handle,owner_id,title,start,end,mode,public,created,updated) VALUES(?,?,?,?,?,?,?,1,1)").run(handle, o.owner ?? 0, title, o.start ?? "2026-11-17", o.end ?? "", o.mode ?? "online", o.public ?? 1).lastInsertRowid;
const row = (raw, h) => ({ ...raw.prepare("SELECT entity,entity_state FROM events WHERE handle=?").get(h) });
const via = (handler, env) => (u, path, method = "GET", b) => { const req = new Request("https://x" + path, { method, body: b ? JSON.stringify(b) : undefined }); return handler(env, req, new URL(req.url), path, u, J).then(async (r) => [r.status, await r.json()]); };
const ENTS = [{ id: "microsoft-ignite", name: "Microsoft Ignite", aliases: [] }, { id: "m365con", name: "M365Con 2027", aliases: [] }, { id: "comms-vnext", name: "Comms vNext", aliases: [] }];

test("Namensvergleich: Jahr, Edition und Zusatzwoerter egal, Fremdes nicht (Ignite 2026 -> microsoft-ignite)", () => {
  assert.equal(nameHow("Microsoft Ignite 2026", "Microsoft Ignite"), "name");
  assert.equal(nameHow("Ignite 2026", "Microsoft Ignite"), "name");
  assert.equal(nameHow("Microsoft Ignite Online 2026", "Microsoft Ignite"), "name");
  assert.equal(nameHow("The 3rd Annual M365Con 2026", "M365Con 2027"), "name");
  assert.equal(nameHow("Microsoft Ignit 2026", "Microsoft Ignite"), "similar");   // kleiner Tippfehler (similarName aus events.js)
  assert.equal(nameHow("M365Con DACH 2026", "M365Con 2027"), "contains");
  for (const t of ["Hamburg Copilot Day 2026", "Ignite the Tour Berlin", "Microsoft Inspire", "Microsoft 365 Community Day"]) assert.equal(nameHow(t, "Microsoft Ignite"), "", t);
  assert.equal(nameHow("", "Microsoft Ignite"), ""); assert.equal(nameHow("Microsoft Ignite", ""), "");
  assert.deepEqual(matchEntity("Ignite 2026", ENTS), { id: "microsoft-ignite", how: "name" });
  assert.deepEqual(matchEntity("M365Con DACH 2026", ENTS), { id: "m365con", how: "contains" });
  assert.equal(matchEntity("Hamburg Copilot Day", ENTS), null);
  // zwei verschiedene gleich gute Entitaeten: nicht eindeutig -> kein Vorschlag; der bessere Treffer gewinnt
  assert.equal(matchEntity("Ignite", [{ id: "a", name: "Microsoft Ignite" }, { id: "b", name: "Ignite" }]), null);
  assert.deepEqual(matchEntity("Ignite 2026", [{ id: "a", name: "Microsoft Ignite" }, { id: "b", name: "Ignite Tour" , aliases: ["Ignite on tour"] }]), { id: "a", how: "name" });
});

test("Cron: Vorschlaege nur fuer eindeutige Treffer, nie ueber eine Entscheidung hinweg, Lauf ohne Aenderung ueberspringt den Vergleich", async () => {
  const { raw, env, n } = await setup();
  event(raw, "ignite-2026", "Microsoft Ignite 2026"); event(raw, "hh-copilot", "Hamburg Copilot Day 2026"); event(raw, "con-dach", "M365Con DACH 2026");
  event(raw, "ignite-2025", "Microsoft Ignite 2025", { start: "2025-11-18" }); event(raw, "ignite-nein", "Ignite 2024", { start: "2024-11-19" });
  raw.prepare("UPDATE events SET entity_state='none' WHERE handle='ignite-nein'").run();   // bewusst keine Zuordnung
  raw.prepare("UPDATE events SET entity='comms-vnext',entity_state='rejected' WHERE handle='ignite-2025'").run();   // abgelehnt
  const r = await suggestEventEntities(env);
  assert.deepEqual({ scanned: r.scanned, suggested: r.suggested }, { scanned: 3, suggested: 2 });
  assert.deepEqual(row(raw, "ignite-2026"), { entity: "microsoft-ignite", entity_state: "suggested" });
  assert.deepEqual(row(raw, "con-dach"), { entity: "m365con", entity_state: "suggested" });
  assert.deepEqual(row(raw, "hh-copilot"), { entity: "", entity_state: "" });
  assert.deepEqual(row(raw, "ignite-nein"), { entity: "", entity_state: "none" }); assert.deepEqual(row(raw, "ignite-2025"), { entity: "comms-vnext", entity_state: "rejected" });
  n.calls = 0; const again = await suggestEventEntities(env);
  assert.deepEqual({ scanned: again.scanned, suggested: again.suggested }, { scanned: 0, suggested: 0 }); assert.ok(n.calls <= 5, "unveraendert: nur Signatur-Abfragen, " + n.calls);
  // neues Event -> wieder verglichen; neue Event-Entitaet -> die uebrigen ohne Entscheidung werden neu verglichen
  event(raw, "ignite-2027", "Microsoft Ignite 2027"); assert.equal((await suggestEventEntities(env)).suggested, 1);
  raw.prepare("INSERT INTO entity_rev(eid,data,summary,user_id,status,created) VALUES('copilot-day',?,'t',0,'live',1)").run(JSON.stringify({ type: "event", name: "Hamburg Copilot Day" }));
  assert.equal((await suggestEventEntities(env)).suggested, 1); assert.deepEqual(row(raw, "hh-copilot"), { entity: "copilot-day", entity_state: "suggested" });
  // eine Zuordnung (suggested) macht nichts oeffentlich
  const exp = await via(handleEvents, env)(null, "/api/events/export");
  assert.ok(exp[1].events.length >= 5 && exp[1].events.every((e) => e.entity === ""), "Vorschlaege stehen nicht im oeffentlichen Export");
});

test("Veranstalter waehlt im Formular: nur Event-Entitaeten, Vorschlag bis zur Bestaetigung; Admin bestaetigt, aendert, lehnt ab, entfernt (mit Protokoll)", async () => {
  const { raw, env } = await setup();
  const admin = { ...user(raw, 1, "Admin"), admin: true }, orga = user(raw, 2, "Orga"), other = user(raw, 3, "Fremd");
  event(raw, "ignite-2026", "Microsoft Ignite 2026", { owner: 2 }); event(raw, "privat-ev", "Privates Event", { owner: 2, public: 0 });
  const ent = via(handleEventEntity, env), ev = via(handleEvents, env);
  // Liste waehlbarer Entitaeten: nur Typ event
  assert.deepEqual((await ent(null, "/api/events/entity"))[1].entities.map((e) => e.id), ["comms-vnext", "m365con", "microsoft-ignite"]);   // nach Name: Comms vNext, M365Con, Microsoft Ignite
  // Rechte
  assert.deepEqual(await ent(null, "/api/events/entity", "POST", { handle: "ignite-2026", entity: "microsoft-ignite" }), [401, { error: "login" }]);
  assert.deepEqual(await ent(other, "/api/events/entity", "POST", { handle: "ignite-2026", entity: "microsoft-ignite" }), [403, { error: "forbidden" }]);
  assert.deepEqual(await ent(orga, "/api/events/entity", "POST", { handle: "gibt-es-nicht", entity: "microsoft-ignite" }), [404, { error: "not_found" }]);
  assert.deepEqual(await ent(orga, "/api/events/entity", "POST", { handle: "ignite-2026", entity: "copilot" }), [400, { error: "bad_entity" }], "ein Produkt ist keine Event-Entitaet");
  assert.deepEqual(await ent(orga, "/api/events/entity", "POST", { handle: "ignite-2026", entity: "gibt-es-nicht" }), [400, { error: "bad_entity" }]);
  // Wunsch des Veranstalters: Vorschlag, nicht oeffentlich
  assert.deepEqual(await ent(orga, "/api/events/entity", "POST", { handle: "ignite-2026", entity: "microsoft-ignite" }), [200, { ok: true, entity: "microsoft-ignite", state: "proposed" }]);
  assert.equal((await ev(null, "/api/events/export"))[1].events.find((e) => e.handle === "ignite-2026").entity, "");
  assert.deepEqual((await ev(orga, "/api/events/mine"))[1].events.find((e) => e.handle === "ignite-2026").entity_link, { id: "microsoft-ignite", state: "proposed" }, "der Veranstalter sieht Wunsch und Zustand");
  // Admin: Liste, Wunsch aendern und bestaetigen
  for (const u of [orga, other, null]) { assert.equal((await ent(u, "/api/admin/events/entity"))[0], 403); assert.equal((await ent(u, "/api/admin/events/entity", "POST", { id: 1, action: "confirm" }))[0], 403); }
  const list = (await ent(admin, "/api/admin/events/entity"))[1];
  assert.equal(list.open, 1); assert.equal(list.items[0].handle, "ignite-2026"); assert.equal(list.items[0].state, "proposed"); assert.equal(list.items[0].entity_name, "Microsoft Ignite"); assert.deepEqual(list.entities.map((e) => e.id), ["comms-vnext", "m365con", "microsoft-ignite"]);
  const id = raw.prepare("SELECT id FROM events WHERE handle='ignite-2026'").get().id;
  assert.deepEqual(await ent(admin, "/api/admin/events/entity", "POST", { id, action: "confirm", entity: "gibt-es-nicht" }), [400, { error: "bad_entity" }]);
  assert.deepEqual(await ent(admin, "/api/admin/events/entity", "POST", { id, action: "confirm" }), [200, { ok: true, entity: "microsoft-ignite", state: "confirmed" }]);
  assert.equal((await ev(null, "/api/events/export"))[1].events.find((e) => e.handle === "ignite-2026").entity, "microsoft-ignite", "bestaetigt = oeffentlich");
  assert.deepEqual(await ent(admin, "/api/admin/events/entity", "POST", { id, action: "confirm" }), [400, { error: "not_open" }]);
  // bestaetigte Zuordnung: der Veranstalter darf sie nicht aendern, der Admin schon
  assert.deepEqual(await ent(orga, "/api/events/entity", "POST", { handle: "ignite-2026", entity: "" }), [409, { error: "confirmed" }]);
  assert.deepEqual(await ent(admin, "/api/admin/events/entity", "POST", { id, action: "set", entity: "comms-vnext" }), [200, { ok: true, entity: "comms-vnext", state: "confirmed" }]);
  // Admin setzt im Event-Formular direkt: bestaetigt
  assert.deepEqual(await ent(admin, "/api/events/entity", "POST", { handle: "ignite-2026", entity: "microsoft-ignite" }), [200, { ok: true, entity: "microsoft-ignite", state: "confirmed" }]);
  assert.deepEqual(await ent(admin, "/api/admin/events/entity", "POST", { id, action: "clear" }), [200, { ok: true, entity: "", state: "none" }]);
  assert.equal((await ev(null, "/api/events/export"))[1].events.find((e) => e.handle === "ignite-2026").entity, "");
  // Ablehnen: bleibt als Merkzettel, nie oeffentlich, nie wieder vorgeschlagen
  assert.equal((await ent(orga, "/api/events/entity", "POST", { handle: "ignite-2026", entity: "microsoft-ignite" }))[1].state, "proposed");
  assert.deepEqual(await ent(admin, "/api/admin/events/entity", "POST", { id, action: "reject" }), [200, { ok: true, entity: "microsoft-ignite", state: "rejected" }]);
  await suggestEventEntities(env); assert.deepEqual(row(raw, "ignite-2026"), { entity: "microsoft-ignite", entity_state: "rejected" });
  assert.equal((await ev(null, "/api/events/export"))[1].events.find((e) => e.handle === "ignite-2026").entity, "");
  assert.deepEqual(await ent(admin, "/api/admin/events/entity", "POST", { id, action: "wasauchimmer" }), [400, { error: "bad_action" }]);
  assert.deepEqual(await ent(admin, "/api/admin/events/entity", "POST", { id: 9999, action: "clear" }), [404, { error: "not_found" }]);
  // Protokoll (edit_log) fuer jede Entscheidung des Admins
  const log = raw.prepare("SELECT user_id,role,action,kind,item_id,after FROM edit_log ORDER BY id").all();
  assert.deepEqual(log.map((l) => [l.action, l.kind, l.user_id, l.role]), [["review.approve", "event_entity", 1, "admin"], ["review.approve", "event_entity", 1, "admin"], ["review.approve", "event_entity", 1, "admin"], ["review.reject", "event_entity", 1, "admin"], ["review.reject", "event_entity", 1, "admin"]]);
  assert.equal(JSON.parse(log[0].after).state, "confirmed");
  // Ein nicht oeffentliches Event steht nie im Export, auch mit bestaetigter Zuordnung
  raw.prepare("UPDATE events SET entity='microsoft-ignite',entity_state='confirmed' WHERE handle='privat-ev'").run();
  assert.ok(!(await ev(null, "/api/events/export"))[1].events.some((e) => e.handle === "privat-ev"));
  assert.ok(ENTITY_ROUTE.test("/api/events/entity") && ENTITY_ROUTE.test("/api/admin/events/entity") && !ENTITY_ROUTE.test("/api/events/entity/x"));
});

test("Editor und Moderator: keine Admin-Entscheidung (confers); zusammengefuehrtes Event erbt die bestaetigte Zuordnung des aufgegangenen", async () => {
  const { raw, env } = await setup();
  const editor = user(raw, 5, "Editorin", "editor"), mod = user(raw, 6, "Moderator", "moderator");
  const a = event(raw, "ignite-neu", "Microsoft Ignite 2026"), b = event(raw, "ignite-alt", "Ignite 2026");
  const ent = via(handleEventEntity, env);
  for (const u of [editor, mod]) for (const body of [undefined, { id: a, action: "confirm" }, { id: a, action: "reject" }, { id: a, action: "clear" }]) assert.equal((await ent(u, "/api/admin/events/entity", body ? "POST" : "GET", body))[0], 403);
  raw.prepare("UPDATE events SET entity='microsoft-ignite',entity_state='confirmed' WHERE id=?").run(b);
  assert.equal((await mergeEvents(env.DB, b, a)).ok, true);   // b geht in a auf
  const r = await suggestEventEntities(env);
  assert.equal(r.adopted, 1); assert.deepEqual(row(raw, "ignite-neu"), { entity: "microsoft-ignite", entity_state: "confirmed" });
  assert.equal((await suggestEventEntities(env)).adopted, 0, "idempotent");
  // eine eigene Entscheidung am Ziel-Event bleibt
  const c = event(raw, "x-1", "Comms vNext 2026"), d = event(raw, "x-2", "Comms vNext Online");
  raw.prepare("UPDATE events SET entity='m365con',entity_state='confirmed' WHERE id=?").run(c); raw.prepare("UPDATE events SET entity='comms-vnext',entity_state='confirmed' WHERE id=?").run(d);
  await mergeEvents(env.DB, d, c); await suggestEventEntities(env); assert.deepEqual(row(raw, "x-1"), { entity: "m365con", entity_state: "confirmed" });
});

test("MCP: set_event_entity (Veranstalter) und manage_event_entity (Admin) gehen durch dieselben Regeln wie die Routen", async () => {
  const { raw, env } = await setup();
  const admin = { ...user(raw, 1, "Admin"), admin: true }, orga = user(raw, 2, "Orga"), other = user(raw, 3, "Fremd");
  event(raw, "ignite-2026", "Microsoft Ignite 2026", { owner: 2 });
  assert.deepEqual(await callTool(env, other, "set_event_entity", { handle: "ignite-2026", entity: "microsoft-ignite" }), { error: "forbidden" });
  assert.deepEqual(await callTool(env, orga, "set_event_entity", { handle: "Ignite-2026", entity: "microsoft-ignite" }), { ok: true, entity: "microsoft-ignite", state: "proposed" });
  assert.deepEqual(await callTool(env, orga, "manage_event_entity", { action: "list" }), { error: "forbidden" });
  const l = await callTool(env, admin, "manage_event_entity", { action: "list" }); assert.equal(l.items.length, 1);
  assert.deepEqual(await callTool(env, admin, "manage_event_entity", { action: "confirm", id: l.items[0].id }), { ok: true, entity: "microsoft-ignite", state: "confirmed" });
  assert.deepEqual(await callTool(env, admin, "manage_event_entity", { action: "clear", id: l.items[0].id }), { ok: true, entity: "", state: "none" });
});
