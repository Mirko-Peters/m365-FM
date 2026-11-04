import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { decideEventImport, eventImportAutomatic, eventImportCandidatesWithDuplicates, importExternalEvents, sessionContributionDraft } from "../src/extevents.js";
import { handleEvents } from "../src/events.js";

function sqliteDb(raw) {
  return {
    prepare(sql) {
      let args = [];
      const stmt = raw.prepare(sql), result = {
        bind(...values) { args = values; return result; },
        all: async () => ({ results: stmt.all(...args) }),
        first: async () => stmt.get(...args) ?? null,
        run: async () => { const r = stmt.run(...args); return { meta: { changes: Number(r.changes), last_row_id: Number(r.lastInsertRowid) } }; },
      };
      return result;
    },
    async batch(statements) { for (const statement of statements) await statement.run(); },
  };
}

async function setup() {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:");
  const dir = new URL("../migrations/", import.meta.url);
  for (const file of readdirSync(dir).filter((name) => name.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(file, dir), "utf-8"));
  raw.exec("INSERT INTO users(id,provider,sub,name,role,banned,created) VALUES(1,'google','admin','Admin Name','admin',0,1); INSERT INTO meta(k,v) VALUES('entity_source','db'); INSERT INTO entity_rev(eid,data,summary,user_id,status,created) VALUES('microsoft-365','{\"type\":\"product\",\"name\":\"Microsoft 365\"}','',0,'live',1)");
  return { raw, env: { DB: sqliteDb(raw), SITE: "https://site.example", EVENTS_AUTO_SOURCES: "" } };
}

const item = {
  fp: "0123456789abcdef0123456789abcdef",
  hash: "abcdef0123456789abcdef0123456789",
  sources: [{ source: "community_days", ext_id: "event-42", url: "https://communitydays.org/events/m365" }],
  title: "M365 Community Day", start: "2027-03-10", end: "2027-03-10",
  mode: "online", location: "Online", country: "", url: "https://communitydays.org/events/m365",
  organizer_name: "Community Group events@example.com", topics: ["microsoft-365"], cfs_close: "2027-02-01",
  sessions: [{ title: "Copilot in Teams", start: "2027-03-10T10:00Z", end: "2027-03-10T10:45Z", room: "Main",
    speakers: [{ n: "Public Speaker", links: ["https://example.org/profile"] },
      { n: "hidden@example.com", links: ["https://example.org/?email=hidden%40example.com"] }] }],
};
const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json" } });

test("external events: wiederholter Import, redaktionelle Freigabe und Quellen-Veranstalter (SQLite)", async () => {
  const { raw, env } = await setup(), originalFetch = globalThis.fetch;
  globalThis.fetch = async (url) => String(url).endsWith("/ext_events.json") ? json({ items: [item] }) : json({ entities: [] });
  try {
    assert.deepEqual(await importExternalEvents(env), { imported: 1 });
    assert.deepEqual(await importExternalEvents(env), { imported: 0 });
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM event_import").get().n, 1);
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM event_source").get().n, 1);
    const request = new Request("https://api.example/api/admin/panel/event-imports/decide", {
      method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ fp: item.fp, action: "approve" }),
    });
    const response = await (await import("../src/adminpanel.js")).handleAdminPanel(env, request, new URL(request.url), "/api/admin/panel/event-imports/decide", { id: 1, admin: true }, json);
    assert.equal(response.status, 200);
    const event = raw.prepare("SELECT id,owner_id,source,organizer_name,cfs_close FROM events WHERE handle=?").get(`ext-${item.fp}`);
    assert.deepEqual([event.owner_id, event.source, event.organizer_name, event.cfs_close], [0, "community_days", "Community Group", "2027-02-01"]);
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM event_sessions WHERE event_id=?").get(event.id).n, 1);
    const speaker = JSON.parse(raw.prepare("SELECT speakers FROM event_sessions WHERE event_id=?").get(event.id).speakers)[0];
    assert.deepEqual(speaker.links, ["https://example.org/profile"]);
    assert.equal(JSON.parse(raw.prepare("SELECT speakers FROM event_sessions WHERE event_id=?").get(event.id).speakers).length, 1);
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM speaker_invites").get().n, 0);
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM sqlite_master WHERE type='table' AND name='contributions'").get().n, 0);
    const admin = await import("../src/adminpanel.js");
    const hideRequest = new Request("https://api.example/api/admin/panel/event-imports/speaker", {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ event_id: event.id, session_id: raw.prepare("SELECT id FROM event_sessions WHERE event_id=?").get(event.id).id, name: "Public Speaker", hidden: true }),
    });
    const hidden = await admin.handleAdminPanel(env, hideRequest, new URL(hideRequest.url), "/api/admin/panel/event-imports/speaker", { id: 1, admin: true }, json);
    assert.equal(hidden.status, 200);
    assert.equal(JSON.parse(raw.prepare("SELECT speakers FROM event_sessions WHERE event_id=?").get(event.id).speakers)[0].hidden, true);
    const exported = await handleEvents(env, new Request("https://api.example/api/events/export"), new URL("https://api.example/api/events/export"), "/api/events/export", null, json);
    const eventView = (await exported.json()).events.find((entry) => entry.handle === `ext-${item.fp}`);
    assert.equal(eventView.sessions[0].speakers.length, 0);
    assert.deepEqual(eventView.organizer, { kind: "o", handle: "", name: "Community Group" });
    assert.equal(eventView.source, "community_days");
    const registration = await handleEvents(env, new Request(`https://api.example/api/event/${eventView.handle}/attendees`),
      new URL(`https://api.example/api/event/${eventView.handle}/attendees`), `/api/event/${eventView.handle}/attendees`, null, json);
    assert.equal(registration.status, 404);
    assert.equal((await importExternalEvents(env)).imported, 0);
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM event_sessions WHERE event_id=?").get(event.id).n, 1);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("external events: contribution draft bleibt inaktiv und entspricht dem vorbereiteten Schema", () => {
  const schema = new Set(["user_id", "kind", "category", "public", "manual", "source", "url", "date"]);
  const draft = sessionContributionDraft({ user_id: 7, fp: item.fp, url: item.url, date: item.sessions[0].start });
  assert.deepEqual(new Set(Object.keys(draft)), schema);
  assert.deepEqual(draft, { user_id: 7, kind: "session", category: "Speaker/Presenter", public: 0, manual: 0,
    source: `event:${item.fp}`, url: item.url, date: item.sessions[0].start });
});

test("external events: Dublette zusammenführen und Kandidat ablehnen", async () => {
  const { raw, env } = await setup(), originalFetch = globalThis.fetch;
  const duplicate = raw.prepare("INSERT INTO events(handle,owner_id,title,start,created,updated) VALUES('manual-event',1,?,?,1,1)").run(item.title, item.start);
  const reject = { ...item, fp: "fedcba9876543210fedcba9876543210", hash: "1234567890abcdef1234567890abcdef",
    title: "Microsoft Copilot User Group", topics: ["copilot"] };
  let items = [item];
  globalThis.fetch = async () => json({ items });
  try {
    await importExternalEvents(env);
    const candidates = await eventImportCandidatesWithDuplicates(env.DB);
    assert.equal(candidates[0].duplicates[0].id, Number(duplicate.lastInsertRowid));
    const merged = await decideEventImport(env, { id: 1 }, item.fp, "merge", Number(duplicate.lastInsertRowid));
    assert.equal(merged.status, "merged");
    const stored = raw.prepare("SELECT source,organizer_name,topics FROM events WHERE id=?").get(Number(duplicate.lastInsertRowid));
    assert.equal(stored.source, "community_days");
    assert.equal(stored.organizer_name, "Community Group");
    assert.deepEqual(JSON.parse(stored.topics), ["microsoft-365"]);
    items = [item, reject];
    assert.deepEqual(await importExternalEvents(env), { imported: 1 });
    const rejected = await decideEventImport(env, { id: 1 }, reject.fp, "reject");
    assert.equal(rejected.status, "rejected");
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM events WHERE handle LIKE 'ext-%'").get().n, 0);
    assert.equal(raw.prepare("SELECT status FROM event_import WHERE fp=?").get(reject.fp).status, "rejected");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("Community Days wird ohne Dublette automatisch freigegeben; andere Quellen und Dubletten bleiben in der Warteschlange", async () => {
  const { raw, env } = await setup(), originalFetch = globalThis.fetch;
  env.EVENTS_AUTO_SOURCES = "communitydays";
  let items = [item];
  globalThis.fetch = async () => json({ items });
  try {
    await importExternalEvents(env);
    const approved = raw.prepare("SELECT status,reviewed_by,event_id FROM event_import WHERE fp=?").get(item.fp);
    assert.deepEqual([approved.status, approved.reviewed_by], ["approved", 0]);
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM events WHERE id=?").get(approved.event_id).n, 1);
    assert.equal((await eventImportAutomatic(env.DB)).length, 1);

    const duplicate = "0123456789abcdef0123456789abcde0";
    raw.prepare("INSERT INTO events(handle,owner_id,title,start,created,updated) VALUES('manual-event',1,?,?,1,1)")
      .run("Copilot Community Day", item.start);
    const dupeItem = { ...item, fp: duplicate, hash: "1234567890abcdef1234567890abcdef", title: "Copilot Community Day" };
    items = [dupeItem];
    await importExternalEvents(env);
    assert.equal(raw.prepare("SELECT status FROM event_import WHERE fp=?").get(duplicate).status, "new");

    const otherFp = "fedcba9876543210fedcba9876543210";
    items = [{ ...item, fp: otherFp, hash: "abcdef0123456789abcdef0123456789",
      sources: [{ source: "future_source", ext_id: "external-1", url: item.url }] }];
    await importExternalEvents(env);
    assert.equal(raw.prepare("SELECT status FROM event_import WHERE fp=?").get(otherFp).status, "new");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("Community-Days-Updates protokollieren Änderungen, bewahren manuelle Felder und markieren Wegfall ohne Löschen", async () => {
  const { raw, env } = await setup(), originalFetch = globalThis.fetch;
  env.EVENTS_AUTO_SOURCES = "communitydays";
  let items = [item];
  globalThis.fetch = async () => json({ items });
  try {
    await importExternalEvents(env);
    const event = raw.prepare("SELECT id FROM events WHERE handle=?").get(`ext-${item.fp}`);
    const session = raw.prepare("SELECT id FROM event_sessions WHERE event_id=?").get(event.id);
    const hiddenSpeaker = JSON.parse(raw.prepare("SELECT speakers FROM event_sessions WHERE id=?").get(session.id).speakers);
    hiddenSpeaker[0].hidden = true;
    raw.prepare("UPDATE event_sessions SET speakers=? WHERE id=?").run(JSON.stringify(hiddenSpeaker), session.id);
    const speakerUpdate = { ...item, hash: "11111111111111111111111111111111",
      sessions: [{ ...item.sessions[0], room: "Updated room",
        speakers: [...item.sessions[0].speakers, { n: "Second Speaker", links: ["https://example.org/second"] }] }] };
    items = [speakerUpdate];
    await importExternalEvents(env);
    const updatedSession = raw.prepare("SELECT room,speakers FROM event_sessions WHERE id=?").get(session.id);
    assert.equal(updatedSession.room, "Updated room");
    assert.equal(JSON.parse(updatedSession.speakers).length, 2);
    assert.equal(JSON.parse(updatedSession.speakers)[0].hidden, true);
    raw.prepare("UPDATE events SET location='Redaktioneller Ort' WHERE id=?").run(event.id);
    const updated = { ...speakerUpdate, start: "2027-03-11", end: "2027-03-11", hash: "1234567890abcdef1234567890abcdef",
      sessions: [{ ...speakerUpdate.sessions[0], start: "2027-03-11T10:00Z" }] };
    items = [updated];
    await importExternalEvents(env);
    const saved = raw.prepare("SELECT start,location FROM events WHERE id=?").get(event.id);
    assert.deepEqual([saved.start, saved.location], ["2027-03-11", "Redaktioneller Ort"]);
    const imported = raw.prepare("SELECT locked_fields,changes FROM event_import WHERE fp=?").get(item.fp);
    assert.ok(JSON.parse(imported.locked_fields).includes("location"));
    assert.ok(JSON.parse(imported.changes).some((entry) => entry.fields.includes("start")));
    assert.equal(raw.prepare("SELECT status FROM event_sessions WHERE id=?").get(session.id).status, "gone");

    items = [{ ...updated, gone: true, hash: "abcdef0123456789abcdef0123456789" }];
    await importExternalEvents(env);
    const gone = raw.prepare("SELECT status,event_id,gone_at FROM event_import WHERE fp=?").get(item.fp);
    assert.deepEqual(gone.status, "gone");
    assert.ok(gone.gone_at > 0);
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM events WHERE id=?").get(event.id).n, 1);
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM event_sessions WHERE event_id=? AND status='gone'").get(event.id).n, 2);
    const exported = await handleEvents(env, new Request("https://api.example/api/events/export"),
      new URL("https://api.example/api/events/export"), "/api/events/export", null, json);
    const eventView = (await exported.json()).events.find((entry) => entry.handle === `ext-${item.fp}`);
    assert.equal(eventView.external_status, "gone");
  } finally {
    globalThis.fetch = originalFetch;
  }
});
