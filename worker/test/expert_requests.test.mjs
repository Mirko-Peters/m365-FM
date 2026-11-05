import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { closeExpiredExpertRequests, deleteUserExpertRequests, handleExpertRequests, syncExpertVectors } from "../src/expert_requests.js";
import { vectorId } from "../src/vectors.js";
import { b64u } from "../src/util.js";

async function expertDb() {
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
    async batch(stmts) { const out = []; for (const s of stmts) out.push(await s.run()); return out; },   // wie D1: Ergebnis je Anweisung
  };
  return { db, raw };
}

test("expert requests: private matching, age/week limits, replies, reports, and blocks", async () => {
  const { db, raw } = await expertDb(), t = Math.floor(Date.now() / 1000), deadline = new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10);
  raw.prepare("INSERT INTO meta(k,v) VALUES('entity_source','db')").run();
  raw.prepare("INSERT INTO entity_rev(eid,data,summary,user_id,status,created) VALUES('azure','{}','',0,'live',?)").run(t);
  const addUser = raw.prepare("INSERT INTO users(id,provider,sub,name,created) VALUES(?,?,?,?,?)");
  addUser.run(1, "dev", "publisher", "Publisher", t - 86401);
  addUser.run(2, "dev", "expert", "Expert", t - 86401);
  addUser.run(3, "dev", "new", "New account", t);
  addUser.run(4, "dev", "unverified", "Unverified expert", t - 86401);
  addUser.run(5, "dev", "publisher-two", "Second publisher", t - 86401);
  addUser.run(6, "dev", "expert-two", "Expert Two", t - 86401);
  addUser.run(7, "dev", "applicant", "Applicant", t - 86401);
  const profile = raw.prepare("INSERT INTO profiles(user_id,public,handle,updated) VALUES(?,1,?,?)");
  profile.run(2, "expert-user", t); profile.run(4, "other-expert", t); profile.run(6, "expert-two", t); profile.run(7, "applicant", t);
  const listing = raw.prepare("INSERT INTO guest_listings(user_id,kind,topics,langs,formats,created,updated) VALUES(?,'speaker','[\"azure\"]','[\"en\"]','[\"interview\"]',?,?)");
  listing.run(2, t, t); listing.run(4, t, t); listing.run(6, t, t); listing.run(7, t, t);
  const expertise = raw.prepare("INSERT INTO expertise(owner_type,owner_id,eid,level) VALUES('u',?,'azure',3)");
  expertise.run(2); expertise.run(4); expertise.run(6); expertise.run(7);
  raw.prepare("INSERT INTO programs(owner_type,owner_id,program,verified) VALUES('u',2,'mvp',1),('u',4,'mct',0),('u',6,'mct',1),('u',7,'mvp',1)").run();
  raw.prepare("INSERT INTO expert_settings(user_id,opt_in,formats,langs,contact_pref,contact_value,updated) VALUES(2,1,'[\"interview\"]','[\"en\"]','email','expert@example.com',?),(4,1,'[\"interview\"]','[\"en\"]','platform','',?),(6,1,'[\"interview\"]','[\"en\"]','platform','',?),(7,1,'[\"interview\"]','[\"en\"]','platform','',?)").run(t, t, t, t);
  raw.prepare("INSERT INTO expert_settings(user_id,contact_pref,contact_value,updated) VALUES(1,'email','publisher@example.com',?)").run(t);
  const env = { DB: db, SITE: "https://www.m365.fm" };
  const call = async (path, user, method = "GET", data = {}, targetEnv = env, ctx) => {
    const url = new URL("https://api.example" + path);
    const req = new Request(url, { method, headers: method === "GET" ? {} : { "content-type": "application/json" }, body: method === "GET" ? undefined : JSON.stringify(data) });
    const res = await handleExpertRequests(targetEnv, req, url.pathname, user, (body, status = 200) => new Response(JSON.stringify(body), { status }), ctx);
    return { status: res.status, data: await res.json() };
  };
  const data = { title: "Need an Azure expert", description: "Looking for an expert to discuss identity governance.", topics: ["azure"], format: "interview", lang: "en", deadline };

  assert.equal((await call("/api/expert-requests/list", null)).status, 401, "matching is not public");
  assert.equal((await call("/api/expert-requests/create", { id: 3 }, "POST", data)).data.error, "account_too_new");
  const created = await call("/api/expert-requests/create", { id: 1 }, "POST", data);
  assert.equal(created.status, 200);
  const matches = await call("/api/expert-requests/list", { id: 2 });
  assert.equal(matches.data.items.length, 1, "only verified MVP/MCT experts with a level 3 topic match");
  assert.equal(matches.data.items[0].title, data.title);
  assert.equal("user_id" in matches.data.items[0], false, "matching does not export publisher account identifiers");
  assert.equal(JSON.stringify(matches.data.items).includes("expert@example.com"), false, "matching never exposes contact details");
  assert.equal((await call("/api/expert-settings", { id: 3 })).data.settings.opt_in, false, "existing users are not opted in automatically");
  const tooLong = new Date(Date.now() + 61 * 86400000).toISOString().slice(0, 10);
  assert.equal((await call("/api/expert-requests/create", { id: 6 }, "POST", { ...data, deadline: tooLong })).data.error, "deadline");
  assert.equal((await call("/api/expert-requests/create", { id: 6 }, "POST", { ...data, description: "Contact me at editor@example.com." })).data.error, "contact_details");
  const draft = await call("/api/expert-requests/create", { id: 6 }, "POST", { ...data, draft: true });
  assert.equal(draft.data.status, "draft");
  assert.equal((await call("/api/expert-requests/update", { id: 6 }, "POST", { id: draft.data.id, ...data })).data.status, "open");
  const callOne = await call("/api/expert-requests/create", { id: 6 }, "POST", { ...data, mode: "open" });
  const callTwo = await call("/api/expert-requests/create", { id: 6 }, "POST", { ...data, mode: "open" });
  assert.equal(callOne.data.status, "open");
  assert.equal(callTwo.data.status, "open");
  assert.equal((await call("/api/expert-requests/create", { id: 6 }, "POST", { ...data, mode: "open" })).data.error, "open_call_limit");
  const thirdDraft = await call("/api/expert-requests/create", { id: 6 }, "POST", { ...data, draft: true });
  assert.equal((await call("/api/expert-requests/update", { id: 6 }, "POST", { id: thirdDraft.data.id, ...data, mode: "open" })).data.error, "open_call_limit");
  assert.equal((await call("/api/expert-calls", { id: 7 })).data.items.length, 2);
  assert.equal((await call("/api/expert-requests/apply", { id: 3 }, "POST", { id: callOne.data.id, body: "I can help with Azure governance." })).data.error, "account_too_new");
  assert.equal((await call("/api/expert-requests/apply", { id: 7 }, "POST", { id: callOne.data.id, body: "I can help with Azure governance." })).data.kind, "application");
  for (let i = 0; i < 4; i++) assert.equal((await call("/api/expert-requests/create", { id: 1 }, "POST", data)).status, 200);
  assert.equal((await call("/api/expert-requests/create", { id: 1 }, "POST", data)).data.error, "weekly_limit");

  assert.equal((await call("/api/expert-requests/respond", { id: 2 }, "POST", { id: created.data.id, body: "I can discuss Azure identity governance." })).data.ok, true);
  assert.equal((await call("/api/expert-requests/respond", { id: 2 }, "POST", { id: created.data.id, body: "A second response." })).status, 409);
  const firstReplyId = raw.prepare("SELECT id FROM expert_request_replies WHERE request_id=? AND user_id=2").get(created.data.id).id;
  assert.equal((await call("/api/expert-requests/report", { id: 1 }, "POST", { reply_id: firstReplyId, reason: "unpassend" })).data.ok, true, "Publisher darf Antworten auf die eigene Anfrage melden");
  assert.equal((await call("/api/expert-requests/report", { id: 2 }, "POST", { reply_id: firstReplyId })).status, 404, "Antworten dürfen nur von Eigentümern der Anfrage gemeldet werden");
  const extra = raw.prepare("INSERT INTO expert_requests(user_id,title,description,topics,format,lang,deadline,created) VALUES(5,?,?,?,?,?,?,?)");
  const extraIds = [];
  for (let i = 0; i < 10; i++) extraIds.push(Number(extra.run(`Request ${i}`, data.description, '["azure"]', data.format, data.lang, data.deadline, t).lastInsertRowid));
  for (const id of extraIds.slice(0, 9)) assert.equal((await call("/api/expert-requests/respond", { id: 2 }, "POST", { id, body: "I can help with Azure identity governance." })).status, 200);
  assert.equal((await call("/api/expert-requests/respond", { id: 2 }, "POST", { id: extraIds[9], body: "I can help with Azure identity governance." })).data.error, "daily_limit");
  const reports = await call("/api/admin/expert-requests/reports", { id: 9, admin: true });
  assert.equal(reports.data.reports.length, 1);
  assert.equal(reports.data.reports.find((r) => r.reply_id === firstReplyId).publisher_id, 1);
  assert.equal(reports.data.reports.find((r) => r.reply_id === firstReplyId).publisher_name, "Publisher");
  assert.equal(reports.data.reports.find((r) => r.reply_id === firstReplyId).reply_body, "I can discuss Azure identity governance.");
  const replyId = raw.prepare("SELECT id FROM expert_request_replies WHERE request_id=? AND user_id=2").get(created.data.id).id;
  assert.equal((await call("/api/expert-requests/block", { id: 1 }, "POST", { reply_id: replyId })).data.ok, true);
  assert.equal((await call("/api/expert-requests/block", { id: 1 }, "DELETE", { reply_id: replyId })).data.ok, true);
  assert.equal((await call("/api/expert-requests/block", { id: 2 }, "POST", { id: created.data.id })).data.ok, true);
  const afterBlock = await call("/api/expert-requests/list", { id: 2 });
  assert.ok(afterBlock.data.items.every((item) => item.author !== "Publisher"), "blocking hides every request from that publisher");
  assert.equal((await call("/api/expert-requests/report", { id: 2 }, "POST", { id: created.data.id })).status, 404);
  assert.equal((await call("/api/expert-requests/report", { id: 2 }, "POST", { id: extraIds[0], reason: "irrelevant" })).data.ok, true);
  assert.equal((await call("/api/expert-requests/report", { id: 6 }, "POST", { id: extraIds[0], reason: "irrelevant" })).data.held, true);
  assert.equal(raw.prepare("SELECT status FROM expert_requests WHERE id=?").get(extraIds[0]).status, "held");
  assert.equal((await call("/api/admin/expert-requests/reports", { id: 9, admin: true })).data.reports.length, 3);
  const mine = await call("/api/expert-requests/matches", { id: 1 });
  assert.equal(mine.data.requests.length, 5);
  assert.equal(mine.data.requests.reduce((n, r) => n + r.replies.length, 0), 1);
  const accepted = await call("/api/expert-requests/accept", { id: 1 }, "POST", { reply_id: firstReplyId });
  assert.equal(accepted.data.status, "accepted");
  assert.equal(accepted.data.contacts.publisher.value, "publisher@example.com");
  assert.equal(accepted.data.contacts.expert.value, "expert@example.com");
  assert.equal(raw.prepare("SELECT expert_request_id FROM contributions WHERE expert_request_id=?").get(created.data.id).expert_request_id, created.data.id);
  assert.equal((await call("/api/admin/expert-requests/close", { id: 9, admin: true }, "POST", { id: extraIds[0] })).data.ok, true);
  assert.equal(raw.prepare("SELECT status FROM expert_requests WHERE id=?").get(extraIds[0]).status, "closed");
  assert.equal(raw.prepare("SELECT action FROM audit WHERE target=?").get(String(extraIds[0])).action, "expert_request_close");
  const expired = Number(extra.run("Expired request", data.description, '["azure"]', data.format, data.lang, "2000-01-01", t).lastInsertRowid);
  assert.equal((await closeExpiredExpertRequests(env)).closed, 1);
  assert.equal(raw.prepare("SELECT status FROM expert_requests WHERE id=?").get(expired).status, "closed");
  raw.prepare("UPDATE users SET lang='de' WHERE id=7").run();
  raw.prepare("UPDATE guest_listings SET topics='[\"copilot\"]' WHERE user_id=7").run();
  const upserted = [], deleted = [];
  const vectorEnv = {
    ...env,
    AI: { async run(model, { text: texts }) { return { data: texts.map(() => Array(1024).fill(0.25)) }; } },
    VEC: {
      async upsert(vectors) { upserted.push(...vectors); return { mutationId: "test" }; },
      async query() { return { matches: [{ id: "expert-7", score: 0.9, metadata: { type: "expert", user_id: 7 } }] }; },
      async deleteByIds(ids) { deleted.push(...ids); },
    },
  };
  assert.equal((await syncExpertVectors(vectorEnv)).processed, 4);
  assert.equal(upserted.filter((vector) => vector.metadata.type === "expert").length, 4);
  assert.equal(JSON.stringify(upserted).includes("expert@example.com"), false, "contact data is absent from vector values and metadata");
  const vectorPreview = await call("/api/expert-requests/preview", { id: 1 }, "POST", data, vectorEnv);
  assert.equal(vectorPreview.data.count, 3, `vector results can match without shared entity topics: ${JSON.stringify(vectorPreview.data)}`);
  const fallbackEnv = { ...vectorEnv, VEC: { async query() { throw new Error("offline"); } } };
  const fallbackPreview = await call("/api/expert-requests/preview", { id: 1 }, "POST", data, fallbackEnv);
  assert.equal(fallbackPreview.data.count, 2, "rule matching remains available without Vectorize");
  const search = await call("/api/experts/search?q=cloud+governance", { id: 1 }, "GET", {}, vectorEnv);
  assert.equal(search.data.items.find((item) => item.handle === "applicant").profile_lang, "de", "cross-language vector results show the profile language");
  assert.equal(JSON.stringify(search.data).includes("expert@example.com"), false);
  const termSearch = await call("/api/experts/search?q=APPLICANT", { id: 1 }, "GET", {}, env);
  assert.ok(termSearch.data.items.some((item) => item.handle === "applicant"), "Begriffssuche ohne Vektoren findet Namen (Gross/klein egal)");
  assert.equal(raw.prepare("SELECT 1 FROM sqlite_schema WHERE name LIKE 'expert_profile_fts%'").get(), undefined, "keine FTS-Tabelle zur Laufzeit (D1-Sicherung)");
  const plain = await call("/api/experts/search", { id: 1 }, "GET", {}, env);
  assert.equal(new Set(plain.data.items.map((item) => item.id)).size, plain.data.items.length, "ohne Begriff jede Person nur einmal");
  const pending = [], ctx = { waitUntil(task) { pending.push(task); } };
  await call("/api/expert-settings", { id: 7 }, "POST", { opt_in: false }, vectorEnv, ctx);
  await Promise.all(pending);
  assert.equal(raw.prepare("SELECT 1 FROM expert_vectors WHERE user_id=7").get(), undefined, "opt-out removes the expert vector immediately");
  assert.ok(deleted.length >= 1);
  const pauseTasks = [], pauseCtx = { waitUntil(task) { pauseTasks.push(task); } };
  await call("/api/expert-settings", { id: 7 }, "POST", { opt_in: true, pause_weeks: true, formats: ["interview"], langs: ["en"] }, vectorEnv, pauseCtx);
  await Promise.all(pauseTasks);
  assert.ok(raw.prepare("SELECT paused_until FROM expert_settings WHERE user_id=7").get().paused_until > t);
  assert.equal(raw.prepare("SELECT 1 FROM expert_vectors WHERE user_id=7").get(), undefined, "pause removes the expert vector immediately");
  raw.prepare("UPDATE expert_settings SET opt_in=1,paused_until=0 WHERE user_id=7").run();
  await syncExpertVectors(vectorEnv);
  const beforeDelete = deleted.length;
  await deleteUserExpertRequests(vectorEnv, 7);
  assert.ok(deleted.length > beforeDelete, "account deletion removes its expert vector");
  raw.close();
});


// ---------- Folgebefunde Expert Connect (#247) ----------
// Gemeinsame Ausgangslage: 1 Publisher (en), 2 Experte MVP (de), 6 Expertin MCT, 7 Experte nur per Vektor (Thema copilot), 8 Mitglied ohne Profil.
async function seeded() {
  const { db, raw } = await expertDb(), t = Math.floor(Date.now() / 1000), deadline = new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10);
  raw.prepare("INSERT INTO meta(k,v) VALUES('entity_source','db')").run();
  raw.prepare("INSERT INTO entity_rev(eid,data,summary,user_id,status,created) VALUES('azure','{}','',0,'live',?)").run(t);
  const addUser = raw.prepare("INSERT INTO users(id,provider,sub,name,lang,created) VALUES(?,?,?,?,?,?)");
  for (const [id, name, lang] of [[1, "Publisher", "en"], [2, "Expert", "de"], [5, "Second publisher", "en"], [6, "Expert Two", "en"], [7, "Vector Expert", "en"], [8, "Member", "en"], [9, "Expert Three", "en"]]) addUser.run(id, "dev", `u${id}`, name, lang, t - 2 * 86400);
  const profile = raw.prepare("INSERT INTO profiles(user_id,public,handle,updated) VALUES(?,1,?,?)");
  for (const id of [2, 6, 7, 9]) profile.run(id, `expert-${id}`, t);
  const listing = raw.prepare("INSERT INTO guest_listings(user_id,kind,topics,langs,formats,created,updated) VALUES(?,'speaker',?,'[\"en\"]','[\"interview\"]',?,?)");
  for (const id of [2, 6, 9]) listing.run(id, '["azure"]', t, t);
  listing.run(7, '["copilot"]', t, t);
  for (const id of [2, 6, 7, 9]) raw.prepare("INSERT INTO expertise(owner_type,owner_id,eid,level) VALUES('u',?,'azure',3)").run(id);
  raw.prepare("INSERT INTO programs(owner_type,owner_id,program,verified) VALUES('u',2,'mvp',1),('u',6,'mct',1),('u',7,'mvp',1),('u',9,'mvp',1)").run();
  const settings = raw.prepare("INSERT INTO expert_settings(user_id,opt_in,formats,langs,contact_pref,contact_value,updated) VALUES(?,?,'[\"interview\"]','[\"en\"]',?,?,?)");
  settings.run(2, 1, "email", "expert@example.com", t); settings.run(6, 1, "platform", "", t); settings.run(7, 1, "platform", "", t); settings.run(9, 1, "platform", "", t);
  settings.run(1, 0, "email", "publisher@example.com", t);
  const env = { DB: db, SITE: "https://www.m365.fm" };
  const call = async (path, user, method = "GET", data = {}, targetEnv = env, ctx) => {
    const url = new URL("https://api.example" + path);
    const req = new Request(url, { method, headers: method === "GET" ? {} : { "content-type": "application/json" }, body: method === "GET" ? undefined : JSON.stringify(data) });
    const res = await handleExpertRequests(targetEnv, req, url.pathname, user, (body, status = 200) => new Response(JSON.stringify(body), { status }), ctx);
    return { status: res.status, data: await res.json() };
  };
  const data = { title: "Need an Azure expert", description: "Looking for an expert to discuss identity governance.", topics: ["azure"], format: "interview", lang: "en", deadline };
  return { db, raw, t, env, call, data };
}

test("expert connect: Datum, Jahresbereich und Version sind keine Telefonnummer, echte Nummern schon", async () => {
  const { call, data } = await seeded();
  for (const extra of ["Publication on 12.11.2026.", "Webinar 2026-11-20.", "Covering the 2019-2024 Teams roadmap.", "Build 16.0.17928.20114 only.", "Runs 12.11.2026 - 15.11.2026.",
    "Runs 12.11.2026-15.11.2026.", "Office 365 E3 2019 - 2024.", "Exchange 15.2.1544.11 and Teams 1.7.00.13456.", "Days 2026-11-20 2026-11-21.",
    "Due 11/25/2026 - 12/02/2026.", "Version 16.10.17928 or later."]) {
    const res = await call("/api/expert-requests/preview", { id: 1 }, "POST", { ...data, description: `${data.description} ${extra}` });
    assert.equal(res.status, 200, `${extra}: ${JSON.stringify(res.data)}`);
  }
  // auch mit Punkten gegliederte Nummern (FR/CH/BE/US), deren Teile wie Datum oder Version aussehen
  for (const number of ["+49 170 1234567", "0170/1234567", "(030) 12345678", "06.12.34.56.78", "+41.79.123.45.67", "+33 6.12.34.56.78", "1.555.123.4567",
    "+1.555.123.4567", "+49 30 12.34.56.78", "+44 20.7946.0958", "089.12.34.56.7", "0170-12-12-1234",
    // Teilnehmernummer nach Leerzeichen, die nur wie Datum oder Version aussieht (Tag/Monat > 31, Jahr dreistellig, ohne v/Build)
    "0475 12.34.56", "+32 475 12.34.56", "+43 1 23.45.678", "0170 12.34.5678", "030 12.34.567", "0221 4567-10-12"]) {
    assert.equal((await call("/api/expert-requests/preview", { id: 1 }, "POST", { ...data, description: `${data.description} Call ${number}.` })).data.error, "contact_details", number);
  }
  const created = await call("/api/expert-requests/create", { id: 1 }, "POST", data);
  assert.equal((await call("/api/expert-requests/respond", { id: 2 }, "POST", { id: created.data.id, body: "Spoke at the 2019-2024 Teams roadmap sessions on 12.11.2026." })).data.ok, true, "Pitch mit Datum geht durch");
  assert.equal((await call("/api/expert-requests/respond", { id: 6 }, "POST", { id: created.data.id, body: "Reach me on +49 170 1234567 any time." })).data.error, "contact_details");
  assert.equal((await call("/api/expert-requests/respond", { id: 6 }, "POST", { id: created.data.id, body: "Call me: 06.12.34.56.78" })).data.error, "contact_details");
  assert.equal((await call("/api/expert-requests/respond", { id: 6 }, "POST", { id: created.data.id, body: "Call me on 0475 12.34.56 any time." })).data.error, "contact_details");
});

test("expert connect: Kontaktdaten werden auch im bereinigten Text erkannt (<, >, Null-Breite, Bidi)", async () => {
  const { raw, call, data } = await seeded();
  // text() entfernt <, > und cleanText() unsichtbare Zeichen; gespeichert wuerde sonst eine saubere Adresse/Nummer
  const hidden = ["editor>@example.com", "editor<@example.com", "editor\u200b@example.com", "editor@\u2066example.com", "0170>1234567", "0170<1234567", "0170\u200b1234567", "+49 170\u202e1234567"];
  for (const value of hidden) {
    assert.equal((await call("/api/expert-requests/preview", { id: 1 }, "POST", { ...data, description: `${data.description} Reach ${value}` })).data.error, "contact_details", `Beschreibung ${JSON.stringify(value)}`);
    assert.equal((await call("/api/expert-requests/preview", { id: 1 }, "POST", { ...data, title: `Azure ${value}` })).data.error, "contact_details", `Titel ${JSON.stringify(value)}`);
    assert.equal((await call("/api/expert-requests/create", { id: 1 }, "POST", { ...data, reach: `Mag ${value}` })).data.error, "contact_details", `Reichweite ${JSON.stringify(value)}`);
  }
  assert.equal((await call("/api/expert-requests/preview", { id: 1 }, "POST", { ...data, title: 491701234567 })).data.error, "contact_details", "Zahl statt Text");
  const created = await call("/api/expert-requests/create", { id: 1 }, "POST", { ...data, reach: "Weekly newsletter" });
  assert.equal(created.data.status, "open");
  const id = created.data.id;
  assert.equal((await call("/api/expert-requests/update", { id: 1 }, "POST", { id, reach: "Mail editor>@example.com" })).data.error, "contact_details");
  for (const value of hidden) {
    assert.equal((await call("/api/expert-requests/respond", { id: 6 }, "POST", { id, body: `Happy to help, reach me at ${value} please.` })).data.error, "contact_details", `Pitch ${JSON.stringify(value)}`);
  }
  const stored = JSON.stringify(raw.prepare("SELECT title,description,reach FROM expert_requests").all()) + JSON.stringify(raw.prepare("SELECT body FROM expert_request_replies").all());
  assert.equal(/@example|1234567/.test(stored), false, stored);
});

test("expert connect: Vektor-Treffer ohne gemeinsames Thema brauchen Mindestaehnlichkeit, gleich fuer Vorschau und Sichtbarkeit", async () => {
  const { raw, env, call, data } = await seeded();
  const id = (await call("/api/expert-requests/create", { id: 1 }, "POST", data)).data.id;
  raw.prepare("INSERT INTO expert_vectors(user_id,vid,h) VALUES(7,'vid-expert-7','h')").run();
  const requestVid = await vectorId(`request:${id}`);
  let score = 0.2;
  const vecEnv = { ...env,
    AI: { async run(model, { text: texts }) { return { data: texts.map(() => Array(1024).fill(0.25)) }; } },
    VEC: {
      async getByIds(list) { return list.map((vid) => ({ id: vid, values: Array(1024).fill(0.1) })); },
      async query(values, options) {
        return { matches: options.filter?.type === "request" ? [{ id: requestVid, score }] : [{ id: "vid-expert-7", score, metadata: { type: "expert", user_id: 7 } }] };
      },
    } };
  // Experte 7 hat nur "copilot", die Anfrage "azure": nur der Vektor kann ihn verbinden
  assert.deepEqual((await call("/api/expert-requests/list", { id: 7 }, "GET", {}, vecEnv)).data.items, [], "geringe Aehnlichkeit: nicht sichtbar");
  assert.equal((await call("/api/expert-requests/respond", { id: 7 }, "POST", { id, body: "I can discuss Copilot governance." }, vecEnv)).status, 404);
  assert.equal((await call("/api/expert-requests/report", { id: 7 }, "POST", { id, reason: "spam" }, vecEnv)).status, 404);
  assert.equal((await call("/api/expert-requests/preview", { id: 1 }, "POST", data, vecEnv)).data.count, 3, "Vorschau zaehlt ihn ebenfalls nicht");
  score = 0.8;
  assert.deepEqual((await call("/api/expert-requests/list", { id: 7 }, "GET", {}, vecEnv)).data.items.map((item) => item.id), [id], "hohe Aehnlichkeit: sichtbar");
  assert.equal((await call("/api/expert-requests/preview", { id: 1 }, "POST", data, vecEnv)).data.count, 4);
  // Regel-Treffer (gemeinsames Thema) brauchen keine Aehnlichkeit
  score = 0.1;
  assert.deepEqual((await call("/api/expert-requests/list", { id: 2 }, "GET", {}, vecEnv)).data.items.map((item) => item.id), [id]);
});

test("expert connect: Freigabe und Cron legen fehlende Anfragevektoren an (Experte nur per Vektor)", async () => {
  const { raw, env: base, call, data } = await seeded();
  raw.prepare("INSERT INTO expert_vectors(user_id,vid,h) VALUES(7,'vid-expert-7','h')").run();
  const store = new Map([["vid-expert-7", { values: Array(1024).fill(0.1), metadata: { type: "expert", user_id: 7 } }]]);
  let aiDown = false;
  const env = { ...base,
    AI: { async run(model, { text: texts }) { if (aiDown) throw new Error("timeout"); return { data: texts.map(() => Array(1024).fill(0.2)) }; } },
    VEC: {
      async upsert(list) { for (const v of list) store.set(v.id, v); return { mutationId: "t" }; },
      async getByIds(ids) { return ids.filter((id) => store.has(id)).map((id) => ({ id, ...store.get(id) })); },
      async query(values, o) { return { matches: [...store.entries()].filter(([, v]) => v.metadata.type === o.filter?.type).map(([id, v]) => ({ id, score: 0.9, metadata: v.metadata })) }; },
      async deleteByIds(ids) { for (const id of ids) store.delete(id); },
    } };
  const tasks = [], ctx = { waitUntil(task) { tasks.push(task); } };
  const run = async (...args) => { const res = await call(...args); await Promise.all(tasks.splice(0)); return res; };
  const listed = async () => (await run("/api/expert-requests/list", { id: 7 }, "GET", {}, env, ctx)).data.items.map((item) => item.id).sort();
  const held = (await run("/api/expert-requests/create", { id: 1 }, "POST", { ...data, description: `${data.description} Includes pricing details.` }, env, ctx)).data;
  assert.equal(held.status, "held");
  assert.deepEqual(await listed(), []);
  assert.equal((await run("/api/admin/expert-requests/resolve", { id: 99, admin: true }, "POST", { id: held.id, action: "release" }, env, ctx)).data.status, "open");
  assert.deepEqual(await listed(), [held.id], "nach Freigabe sichtbar, wie der Push an diese Person");
  assert.equal((await run("/api/expert-requests/respond", { id: 7 }, "POST", { id: held.id, body: "I can discuss Copilot governance." }, env, ctx)).status, 200);
  aiDown = true;   // Embedding beim Anlegen scheitert (Timeout): der Cron holt den Vektor nach
  const failed = (await run("/api/expert-requests/create", { id: 1 }, "POST", data, env, ctx)).data.id;
  aiDown = false;
  assert.deepEqual(await listed(), [held.id]);
  assert.equal((await closeExpiredExpertRequests(env)).synced, 1);
  assert.deepEqual(await listed(), [held.id, failed].sort());
  assert.equal((await closeExpiredExpertRequests(env)).synced, 0, "nur fehlende Vektoren");
});

test("expert connect: Annahme aendert nichts, wenn die Anfrage inzwischen nicht mehr offen ist", async () => {
  const { db, raw, env, call, data } = await seeded();
  const id = (await call("/api/expert-requests/create", { id: 1 }, "POST", data)).data.id;
  for (const expert of [2, 6]) assert.equal((await call("/api/expert-requests/respond", { id: expert }, "POST", { id, body: "I can discuss Azure identity governance." })).data.ok, true);
  const replyOf = (user) => raw.prepare("SELECT id FROM expert_request_replies WHERE request_id=? AND user_id=?").get(id, user).id;
  // Publisher hat "offen" gelesen, dann halten zwei Meldungen die Anfrage zurueck
  const stale = raw.prepare(`SELECT x.*,r.user_id publisher_id,r.title,r.topics,r.status request_status
    FROM expert_request_replies x JOIN expert_requests r ON r.id=x.request_id WHERE x.id=? AND r.user_id=?`).get(replyOf(2), 1);
  raw.prepare("UPDATE expert_requests SET status='held',held_reason='reports' WHERE id=?").run(id);
  const staleEnv = { ...env, DB: { ...db, prepare(sql) { return sql.includes("r.status request_status") ? { bind() { return this; }, first: async () => stale } : db.prepare(sql); } } };
  const res = await call("/api/expert-requests/accept", { id: 1 }, "POST", { reply_id: replyOf(2) }, staleEnv);
  assert.equal(res.status, 409);
  assert.deepEqual(raw.prepare("SELECT user_id,status FROM expert_request_replies WHERE request_id=? ORDER BY user_id").all(id).map((r) => [r.user_id, r.status]), [[2, "pending"], [6, "pending"]]);
  assert.equal(raw.prepare("SELECT status FROM expert_requests WHERE id=?").get(id).status, "held");
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM contributions WHERE user_id=2").get().n, 0);
  assert.deepEqual((await call("/api/expert-requests/matches", { id: 2 })).data.accepted, [], "keine Kontaktdaten nach 409");
});

test("expert connect: Listen ohne Embedding je Anfrage, Vektor-Treffer ueber gespeicherten Expertenvektor", async () => {
  const { raw, env, call, data } = await seeded();
  const ids = [];
  for (let i = 0; i < 5; i++) ids.push((await call("/api/expert-requests/create", { id: 1 }, "POST", { ...data, title: `Azure request ${i}` })).data.id);
  const callIds = [];
  for (let i = 0; i < 2; i++) callIds.push((await call("/api/expert-requests/create", { id: 5 }, "POST", { ...data, title: `Open call ${i}`, mode: "open" })).data.id);
  raw.prepare("INSERT INTO expert_vectors(user_id,vid,h) VALUES(7,'vid-expert-7','h')").run();
  const requestVids = await Promise.all([...ids, ...callIds].map((id) => vectorId(`request:${id}`)));
  let ai = 0; const queries = [];
  const vecEnv = {
    ...env,
    AI: { async run(model, { text: texts }) { ai++; return { data: texts.map(() => Array(1024).fill(0.25)) }; } },
    VEC: {
      async getByIds(list) { return list.map((id) => ({ id, values: Array(1024).fill(0.1) })); },
      async query(values, options) { queries.push(options); return { matches: options.filter?.type === "request" ? requestVids.map((id) => ({ id, score: 0.8 })) : [] }; },
    },
  };
  const vectorOnly = await call("/api/expert-requests/list", { id: 7 }, "GET", {}, vecEnv);
  assert.equal(vectorOnly.data.items.length, 5, "Vektor-Treffer ohne gemeinsames Thema bleiben sichtbar");
  assert.equal(ai, 0, "kein Workers-AI-Aufruf beim Auflisten");
  assert.equal(queries.length, 1, "eine Vectorize-Abfrage je Liste");
  assert.deepEqual(queries[0].filter, { type: "request" });
  const rules = await call("/api/expert-requests/matches", { id: 2 }, "GET", {}, vecEnv);
  assert.equal(rules.data.matches.length, 5);
  assert.deepEqual(rules.data.matches[0].shared_topics, ["azure"]);
  const calls = await call("/api/expert-calls?sort=match", { id: 2 }, "GET", {}, vecEnv);
  assert.equal(calls.data.items.length, 2);
  assert.ok(calls.data.items.every((item) => item.match_score > 0));
  assert.equal(ai, 0, "auch offene Aufrufe nach Treffer sortiert ohne Embedding");
  assert.equal((await call("/api/expert-requests/respond", { id: 7 }, "POST", { id: ids[0], body: "I can help with Copilot and Azure governance." }, vecEnv)).data.ok, true, "Antworten passt zur Liste");
  assert.equal(ai, 0);
  assert.equal((await call("/api/expert-requests/list", { id: 7 })).data.items.length, 0, "ohne Vectorize nur Regeln");
});

test("expert connect: Meldeschwelle nur mit verschiedenen Meldenden zur Anfrage, Freigabe setzt sie zurueck", async () => {
  const { raw, call, data } = await seeded();
  const id = (await call("/api/expert-requests/create", { id: 1 }, "POST", data)).data.id;
  for (const expert of [2, 6]) assert.equal((await call("/api/expert-requests/respond", { id: expert }, "POST", { id, body: "Buy my product now please." })).data.ok, true);
  for (const reply of raw.prepare("SELECT id FROM expert_request_replies WHERE request_id=?").all(id)) {
    assert.equal((await call("/api/expert-requests/report", { id: 1 }, "POST", { reply_id: reply.id, reason: "spam" })).data.held, false);
  }
  assert.equal(raw.prepare("SELECT status FROM expert_requests WHERE id=?").get(id).status, "open", "eigene Meldungen zu Pitches halten die Anfrage nicht zurueck");
  assert.equal((await call("/api/expert-requests/report", { id: 2 }, "POST", { id })).data.held, false);
  assert.equal((await call("/api/expert-requests/report", { id: 6 }, "POST", { id })).data.held, true);
  assert.deepEqual({ ...raw.prepare("SELECT status,held_reason FROM expert_requests WHERE id=?").get(id) }, { status: "held", held_reason: "reports" });
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM moderation_log WHERE action='hold' AND target_id=?").get(id).n, 1);
  // Bearbeiten oder Entwurf durch den Publisher gibt eine wegen Meldungen zurueckgehaltene Anfrage nicht frei
  assert.equal((await call("/api/expert-requests/update", { id: 1 }, "POST", { id, title: "Need an Azure expert (edited)" })).data.status, "held");
  assert.equal((await call("/api/expert-requests/update", { id: 1 }, "POST", { id, draft: true })).data.status, "held");
  assert.deepEqual({ ...raw.prepare("SELECT status,held_reason FROM expert_requests WHERE id=?").get(id) }, { status: "held", held_reason: "reports" });
  assert.equal((await call("/api/admin/expert-requests/resolve", { id: 99, admin: true }, "POST", { id, action: "release" })).data.status, "open");
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM expert_request_reports WHERE request_id=? AND reply_id=0").get(id).n, 0);
  assert.equal((await call("/api/expert-requests/report", { id: 9 }, "POST", { id })).data.held, false, "nach Freigabe beginnt die Schwelle neu");
  assert.equal(raw.prepare("SELECT status FROM expert_requests WHERE id=?").get(id).status, "open");
});

// Web Push im Test entschluesseln (RFC 8291), um Ziel-Link und Anzahl der Pushes zu pruefen
const te = new TextEncoder();
const cat = (...a) => { const o = new Uint8Array(a.reduce((n, x) => n + x.length, 0)); let p = 0; for (const x of a) { o.set(x, p); p += x.length; } return o; };
async function hkdf(salt, ikm, info, len) {
  const key = await crypto.subtle.importKey("raw", ikm, "HKDF", false, ["deriveBits"]);
  return new Uint8Array(await crypto.subtle.deriveBits({ name: "HKDF", hash: "SHA-256", salt, info }, key, len * 8));
}
async function pushSubscriber() {
  const receiver = await crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveBits"]);
  const uaPub = new Uint8Array(await crypto.subtle.exportKey("raw", receiver.publicKey)), auth = crypto.getRandomValues(new Uint8Array(16));
  return { receiver, uaPub, auth, p256dh: b64u.enc(uaPub), authText: b64u.enc(auth) };
}
async function decryptPush(body, sub) {
  const salt = body.slice(0, 16), idlen = body[20], asPub = body.slice(21, 21 + idlen), ct = body.slice(21 + idlen);
  const asKey = await crypto.subtle.importKey("raw", asPub, { name: "ECDH", namedCurve: "P-256" }, false, []);
  const shared = new Uint8Array(await crypto.subtle.deriveBits({ name: "ECDH", public: asKey }, sub.receiver.privateKey, 256));
  const prk = await hkdf(sub.auth, shared, cat(te.encode("WebPush: info\0"), sub.uaPub, asPub), 32);
  const cek = await hkdf(salt, prk, te.encode("Content-Encoding: aes128gcm\0"), 16);
  const nonce = await hkdf(salt, prk, te.encode("Content-Encoding: nonce\0"), 12);
  const aes = await crypto.subtle.importKey("raw", cek, "AES-GCM", false, ["decrypt"]);
  const plain = new Uint8Array(await crypto.subtle.decrypt({ name: "AES-GCM", iv: nonce }, aes, ct));
  return JSON.parse(new TextDecoder().decode(plain.slice(0, -1)));
}

test("expert connect: Push nur bei erster Veroeffentlichung, Links auf Expert Connect, doppeltes Annehmen 409", async () => {
  const { db, raw, t, env: base, call, data } = await seeded();
  const vapid = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]);
  const env = { ...base, VAPID_PRIVATE_JWK: JSON.stringify(await crypto.subtle.exportKey("jwk", vapid.privateKey)),
    VAPID_PUBLIC: b64u.enc(new Uint8Array(await crypto.subtle.exportKey("raw", vapid.publicKey))), VAPID_SUBJECT: "mailto:test@example.invalid" };
  const subs = {};
  for (const id of [1, 2, 6]) {
    subs[id] = await pushSubscriber();
    raw.prepare("INSERT INTO push_subs(endpoint,p256dh,auth,lang,user_id,created,digest) VALUES(?,?,?,?,?,?,0)").run(`https://push.example/${id}`, subs[id].p256dh, subs[id].authText, "en", id, t);
  }
  const sent = [], originalFetch = globalThis.fetch;
  globalThis.fetch = async (url, o) => { sent.push({ user: Number(String(url).split("/").pop()), body: o.body }); return new Response(null, { status: 201 }); };
  const tasks = [], ctx = { waitUntil(task) { tasks.push(task); } };
  const run = async (...args) => { const res = await call(...args); await Promise.all(tasks.splice(0)); return res; };
  const pushes = async (user) => Promise.all(sent.filter((x) => x.user === user).map((x) => decryptPush(x.body, subs[user])));
  try {
    const id = (await run("/api/expert-requests/create", { id: 1 }, "POST", data, env, ctx)).data.id;
    assert.deepEqual((await pushes(2)).map((p) => p.url), ["https://www.m365.fm/de/community/expert-connect/#expert"], "deutschsprachige Person: /de/, Reiter Fuer Experten");
    assert.deepEqual((await pushes(6)).map((p) => p.url), ["https://www.m365.fm/community/expert-connect/#expert"]);
    for (let i = 0; i < 3; i++) {
      assert.equal((await run("/api/expert-requests/update", { id: 1 }, "POST", { id, draft: true }, env, ctx)).data.status, "draft");
      assert.equal((await run("/api/expert-requests/update", { id: 1 }, "POST", { id }, env, ctx)).data.status, "open");
    }
    assert.equal((await pushes(2)).length, 1, "Entwurf/Veroeffentlichen im Wechsel loest keine weiteren Pushes aus");
    const openCall = (await run("/api/expert-requests/create", { id: 5 }, "POST", { ...data, mode: "open" }, env, ctx)).data.id;
    assert.ok(openCall);
    assert.equal((await pushes(6)).at(-1).url, "https://www.m365.fm/community/expert-connect/#calls", "offene Aufrufe: Reiter Offene Aufrufe");
    // Modus erst beim Veroeffentlichen des Entwurfs geaendert: Link folgt dem neuen Modus
    for (const [from, to, tab] of [["match", "open", "calls"], ["open", "match", "expert"]]) {
      const draftId = (await run("/api/expert-requests/create", { id: 1 }, "POST", { ...data, draft: true, mode: from }, env, ctx)).data.id;
      const before = (await pushes(6)).length;
      assert.equal((await run("/api/expert-requests/update", { id: 1 }, "POST", { id: draftId, mode: to }, env, ctx)).data.status, "open");
      const after = await pushes(6);
      assert.equal(after.length, before + 1);
      assert.equal(after.at(-1).url, `https://www.m365.fm/community/expert-connect/#${tab}`, `${from} -> ${to}`);
    }
    for (const expert of [2, 6]) assert.equal((await run("/api/expert-requests/respond", { id: expert }, "POST", { id, body: "I can discuss Azure identity governance." }, env, ctx)).data.ok, true);
    assert.deepEqual((await pushes(1)).map((p) => p.url), Array(2).fill("https://www.m365.fm/community/expert-connect/#requests"), "Publisher: Reiter Meine Anfragen");
    const replyOf = (user) => raw.prepare("SELECT id FROM expert_request_replies WHERE request_id=? AND user_id=?").get(id, user).id;
    const selectReply = `SELECT x.*,r.user_id publisher_id,r.title,r.topics,r.status request_status
      FROM expert_request_replies x JOIN expert_requests r ON r.id=x.request_id WHERE x.id=? AND r.user_id=?`;
    const stale = raw.prepare(selectReply).get(replyOf(6), 1);   // zweiter Klick hat noch "offen" gelesen
    const accepted = await run("/api/expert-requests/accept", { id: 1 }, "POST", { reply_id: replyOf(2) }, env, ctx);
    assert.equal(accepted.data.status, "accepted");
    assert.equal((await pushes(2)).at(-1).url, "https://www.m365.fm/de/community/expert-connect/#expert");
    const staleEnv = { ...env, DB: { ...db, prepare(sql) { return sql.includes("r.status request_status") ? { bind() { return this; }, first: async () => stale } : db.prepare(sql); } } };
    const before6 = sent.filter((x) => x.user === 6).length;
    const second = await run("/api/expert-requests/accept", { id: 1 }, "POST", { reply_id: replyOf(6) }, staleEnv, ctx);
    assert.equal(second.status, 409);
    assert.equal(second.data.contacts, undefined, "keine Kontaktdaten der abgelehnten Person");
    assert.equal(sent.filter((x) => x.user === 6).length, before6, "keine Annahme-Push an die abgelehnte Person");
    assert.deepEqual(raw.prepare("SELECT user_id,status FROM expert_request_replies WHERE request_id=? ORDER BY user_id").all(id).map((r) => [r.user_id, r.status]), [[2, "accepted"], [6, "declined"]]);
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM contributions WHERE user_id=6").get().n, 0);
  } finally { globalThis.fetch = originalFetch; }
});

test("expert connect: Kontoloeschung entfernt Experten- und Anfragevektoren, D1-Zeilen nur nach Erfolg", async () => {
  const { raw, env, call, data } = await seeded();
  const ids = [];
  for (let i = 0; i < 2; i++) ids.push((await call("/api/expert-requests/create", { id: 2 }, "POST", { ...data, title: `Request ${i}` })).data.id);
  raw.prepare("INSERT INTO expert_vectors(user_id,vid,h) VALUES(2,'vid-expert-2','h')").run();
  ids.forEach((id, i) => raw.prepare("INSERT INTO expert_request_vectors(request_id,vid,h) VALUES(?,?,'h')").run(id, `vid-request-${i}`));
  await deleteUserExpertRequests({ ...env, VEC: { async deleteByIds() { throw new Error("offline"); } } }, 2);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM expert_vectors WHERE user_id=2").get().n, 1, "Zeile bleibt fuer die spaetere Bereinigung");
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM expert_request_vectors").get().n, 2);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM expert_requests WHERE user_id=2").get().n, 0);
  const deleted = [];
  await closeExpiredExpertRequests({ ...env, VEC: { async deleteByIds(list) { deleted.push(...list); } } });
  assert.deepEqual(deleted.sort(), ["vid-request-0", "vid-request-1"], "verwaiste Anfragevektoren werden nachgeholt");
  raw.prepare("INSERT INTO expert_request_vectors(request_id,vid,h) VALUES(?,?,'h')").run((await call("/api/expert-requests/create", { id: 6 }, "POST", data)).data.id, "vid-request-6");
  raw.prepare("INSERT INTO expert_vectors(user_id,vid,h) VALUES(6,'vid-expert-6','h')").run();
  const removed = [];
  await deleteUserExpertRequests({ ...env, VEC: { async deleteByIds(list) { removed.push(...list); } } }, 6);
  assert.deepEqual(removed.sort(), ["vid-expert-6", "vid-request-6"], "Experten- und Anfragevektoren in einem Aufruf");
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM expert_vectors WHERE user_id=6").get().n, 0);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM expert_request_vectors WHERE vid='vid-request-6'").get().n, 0);
});

test("expert connect: Einstellungen ohne Pausenfelder behalten die Pause", async () => {
  const { raw, t, call } = await seeded();
  const base = { opt_in: true, formats: ["interview"], langs: ["en"], notify: "push", contact_pref: "platform" };
  await call("/api/expert-settings", { id: 6 }, "POST", { ...base, pause_weeks: 2 });
  const until = raw.prepare("SELECT paused_until FROM expert_settings WHERE user_id=6").get().paused_until;
  assert.ok(until > t);
  await call("/api/expert-settings", { id: 6 }, "POST", { ...base, notify: "weekly" });
  assert.equal(raw.prepare("SELECT paused_until FROM expert_settings WHERE user_id=6").get().paused_until, until);
  await call("/api/expert-settings", { id: 6 }, "POST", { ...base, paused_until: 0 });
  assert.equal(raw.prepare("SELECT paused_until FROM expert_settings WHERE user_id=6").get().paused_until, 0, "ausdruecklich beenden geht weiter");
});

test("expert connect: Suche zeigt das hoechste Level, Aufrufe ohne Profil und ohne Blockierte, Medium fuer Eigentuemer und nach Annahme", async () => {
  const { raw, call, data } = await seeded();
  raw.prepare("INSERT INTO expertise(owner_type,owner_id,eid,level) VALUES('u',2,'aaa-topic',5)").run();
  const found = (await call("/api/experts/search", null)).data.items.find((item) => item.id === 2);
  assert.equal(found.level, 5);
  const call1 = (await call("/api/expert-requests/create", { id: 1 }, "POST", { ...data, mode: "open" })).data.id;
  await call("/api/expert-requests/create", { id: 5 }, "POST", { ...data, mode: "open" });
  const member = await call("/api/expert-calls?sort=match", { id: 8 });
  assert.equal(member.data.items.length, 2, "ohne Expertenprofil: neueste statt leerer Liste");
  assert.equal(member.data.needs_profile, true);
  assert.ok(member.data.items.every((item) => item.match_score === 0));
  raw.prepare("INSERT INTO msg_blocks(user_id,blocked_id) VALUES(5,2)").run();
  for (const q of ["", "?sort=match"]) {
    const items = (await call(`/api/expert-calls${q}`, { id: 2 })).data.items;
    assert.deepEqual(items.map((item) => item.id), [call1], `blockierte Konten erscheinen nicht (${q || "neueste"})`);
  }
  const hidden = (await call("/api/expert-requests/create", { id: 1 }, "POST", { ...data, hide_outlet: true, reach: "Contoso Magazine" })).data.id;
  const own = (await call("/api/expert-requests/matches", { id: 1 })).data.requests.find((r) => r.id === hidden);
  assert.equal(own.reach, "Contoso Magazine", "Eigentuemer sieht das Medium auch bei hide_outlet");
  const listed = (await call("/api/expert-requests/list", { id: 2 })).data.items.find((r) => r.id === hidden);
  assert.equal("reach" in listed, false, "Experten sehen es vor der Annahme nicht");
  await call("/api/expert-requests/respond", { id: 2 }, "POST", { id: hidden, body: "I can discuss Azure identity governance." });
  const reply = raw.prepare("SELECT id FROM expert_request_replies WHERE request_id=? AND user_id=2").get(hidden).id;
  assert.equal((await call("/api/expert-requests/accept", { id: 1 }, "POST", { reply_id: reply })).data.status, "accepted");
  const accepted = (await call("/api/expert-requests/matches", { id: 2 })).data.accepted.find((a) => a.request_id === hidden);
  assert.equal(accepted.reach, "Contoso Magazine", "nach Annahme sichtbar");
});

test("expert connect: Spaltenpruefung nur einmal je Datenbank", async () => {
  const { db, call } = await seeded();
  let pragmas = 0;
  const counting = { ...db, prepare(sql) { if (/^PRAGMA/i.test(sql)) pragmas++; return db.prepare(sql); } };
  const env = { DB: counting, SITE: "https://www.m365.fm" };
  await call("/api/expert-settings", { id: 2 }, "GET", {}, env);
  const first = pragmas;
  assert.ok(first > 0);
  await call("/api/expert-settings", { id: 2 }, "GET", {}, env);
  await call("/api/experts/search", null, "GET", {}, env);
  assert.equal(pragmas, first, "keine PRAGMA-Abfragen bei spaeteren Aufrufen");
});
