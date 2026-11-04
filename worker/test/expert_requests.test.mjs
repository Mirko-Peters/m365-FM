import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { handleExpertRequests } from "../src/expert_requests.js";

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
  const profile = raw.prepare("INSERT INTO profiles(user_id,public,handle,updated) VALUES(?,1,?,?)");
  profile.run(2, "expert-user", t); profile.run(4, "other-expert", t);
  const listing = raw.prepare("INSERT INTO guest_listings(user_id,kind,topics,langs,created,updated) VALUES(?,'speaker','[\"azure\"]','[\"en\"]',?,?)");
  listing.run(2, t, t); listing.run(4, t, t);
  const expertise = raw.prepare("INSERT INTO expertise(owner_type,owner_id,eid,level) VALUES('u',?,'azure',3)");
  expertise.run(2); expertise.run(4);
  raw.prepare("INSERT INTO programs(owner_type,owner_id,program,verified) VALUES('u',2,'mvp',1),('u',4,'mct',0)").run();
  const env = { DB: db, SITE: "https://www.m365.fm" };
  const call = async (path, user, method = "GET", data = {}) => {
    const req = new Request("https://api.example" + path, { method, headers: method === "GET" ? {} : { "content-type": "application/json" }, body: method === "GET" ? undefined : JSON.stringify(data) });
    const res = await handleExpertRequests(env, req, path, user, (body, status = 200) => new Response(JSON.stringify(body), { status }));
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
  assert.equal((await call("/api/expert-requests/report", { id: 2 }, "POST", { id: created.data.id, reason: "irrelevant" })).data.ok, true);
  const reports = await call("/api/admin/expert-requests/reports", { id: 9, admin: true });
  assert.equal(reports.data.reports.length, 2);
  assert.equal(reports.data.reports.find((r) => r.reply_id === firstReplyId).publisher_id, 1);
  assert.equal(reports.data.reports.find((r) => r.reply_id === firstReplyId).publisher_name, "Publisher");
  assert.equal(reports.data.reports.find((r) => r.reply_id === firstReplyId).reply_body, "I can discuss Azure identity governance.");
  const replyId = raw.prepare("SELECT id FROM expert_request_replies WHERE request_id=? AND user_id=2").get(created.data.id).id;
  assert.equal((await call("/api/expert-requests/block", { id: 1 }, "POST", { reply_id: replyId })).data.ok, true);
  assert.equal((await call("/api/expert-requests/block", { id: 1 }, "DELETE", { reply_id: replyId })).data.ok, true);
  assert.equal((await call("/api/expert-requests/block", { id: 2 }, "POST", { id: created.data.id })).data.ok, true);
  const afterBlock = await call("/api/expert-requests/list", { id: 2 });
  assert.ok(afterBlock.data.items.every((item) => item.author === "Second publisher"), "blocking hides every request from that publisher");
  assert.equal((await call("/api/expert-requests/report", { id: 2 }, "POST", { id: created.data.id })).status, 404);
  const mine = await call("/api/expert-requests/matches", { id: 1 });
  assert.equal(mine.data.requests.length, 5);
  assert.equal(mine.data.requests.reduce((n, r) => n + r.replies.length, 0), 1);
  assert.equal((await call("/api/admin/expert-requests/close", { id: 9, admin: true }, "POST", { id: created.data.id })).data.ok, true);
  assert.equal(raw.prepare("SELECT status FROM expert_requests WHERE id=?").get(created.data.id).status, "closed");
  assert.equal(raw.prepare("SELECT action FROM audit WHERE target=?").get(String(created.data.id)).action, "expert_request_close");
  raw.close();
});
