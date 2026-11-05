import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { closeExpiredExpertRequests, deleteUserExpertRequests, handleExpertRequests, syncExpertVectors } from "../src/expert_requests.js";

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
    async batch(stmts) { for (const s of stmts) await s.run(); },
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
