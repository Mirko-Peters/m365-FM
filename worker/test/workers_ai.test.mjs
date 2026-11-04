import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { handleAiBudget, handleModerationAdmin, moderateText, queueAiReview, reserveWorkersAi, teaserValue } from "../src/workers_ai.js";
import { askQuestion, answerQuestion } from "../src/qa.js";
import { handleReviews } from "../src/reviews.js";
import { api } from "../src/index.js";
import { handleBlog } from "../src/blog.js";

async function database() {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:");
  const dir = new URL("../migrations/", import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(f, dir), "utf-8"));
  const db = {
    prepare(sql) {
      const st = raw.prepare(sql); let args = [];
      const q = {
        bind(...values) { args = values; return q; },
        first: async () => st.get(...args) ?? null,
        all: async () => ({ results: st.all(...args) }),
        run: async () => { const r = st.run(...args); return { meta: { changes: Number(r.changes), last_row_id: Number(r.lastInsertRowid) } }; },
      };
      return q;
    },
    async batch(statements) { for (const statement of statements) await statement.run(); },
  };
  return { db, raw };
}

test("Workers AI budget uses a shared UTC-day cap and resets on the next day", async () => {
  const { db, raw } = await database(), env = { WORKERS_AI_DAILY_NEURONS: "10" };
  assert.equal(await reserveWorkersAi(db, env, 7, "2026-11-04"), true);
  assert.equal(await reserveWorkersAi(db, env, 4, "2026-11-04"), false);
  assert.equal(await reserveWorkersAi(db, env, 4, "2026-11-05"), true);
  assert.deepEqual(raw.prepare("SELECT day,neurons FROM workers_ai_daily ORDER BY day").all().map((r) => [r.day, r.neurons]), [
    ["2026-11-04", 7], ["2026-11-05", 4],
  ]);
});

test("moderation marks unsafe output and fails open when AI errors", async () => {
  const { db } = await database();
  const user = { id: 1 };
  const unsafe = await moderateText({ DB: db, AI: { run: async () => ({ response: "unsafe\nS1, S3" }) } }, user, "text");
  assert.deepEqual(unsafe, { unsafe: true, category: "S1: Gewalttaten, S3: Sexualbezogene Straftaten" });
  const failed = await moderateText({ DB: db, AI: { run: async () => { throw new Error("offline"); } } }, user, "text");
  assert.deepEqual(failed, { unsafe: false });
  const safe = await moderateText({ DB: db, AI: { run: async () => ({ response: "safe" }) } }, user, "text");
  assert.deepEqual(safe, { unsafe: false });
});

test("admins and editors bypass moderation without spending neurons", async () => {
  const { db, raw } = await database();
  let calls = 0;
  const env = { DB: db, WORKERS_AI_DAILY_NEURONS: "10", AI: { run: async () => { calls++; return { response: "unsafe\nS1" }; } } };
  assert.deepEqual(await moderateText(env, { admin: true }, "text"), { unsafe: false, skipped: true });
  assert.deepEqual(await moderateText(env, { editor: true }, "text"), { unsafe: false, skipped: true });
  assert.equal(calls, 0);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM workers_ai_daily").get().n, 0);
});

test("teaser generation preserves existing text and lets an author replace an automatic teaser", async () => {
  const { db } = await database();
  let calls = 0;
  const env = { DB: db, AI: { run: async () => { calls++; return { response: "A factual one-sentence teaser." }; } } };
  assert.deepEqual(await teaserValue(env, "Existing summary", true, "", "Long source", "en"), { text: "Existing summary", auto: true });
  assert.deepEqual(await teaserValue(env, "Automatic text", true, "Author's version", "Long source", "en"), { text: "Author's version", auto: false });
  assert.deepEqual(await teaserValue(env, "", false, "", "Long source", "en"), { text: "A factual one-sentence teaser.", auto: true });
  assert.equal(calls, 1);
});

test("moderation queue is visible to editors and approval retains the comment", async () => {
  const { db, raw } = await database();
  raw.exec("INSERT INTO comments(vid,lang,user_id,body,status,created) VALUES('blog123','en',4,'held comment','pending',1)");
  await queueAiReview(db, "comment", 1, 4, "S1", "held comment", 1);
  const editor = { id: 2, editor: true }, J = (data, status = 200) => ({ data, status });
  const listed = await handleModerationAdmin({ DB: db }, new Request("https://x/api/admin/moderation"), "/api/admin/moderation", editor, J);
  assert.equal(listed.data.items[0].category, "S1");
  const response = await handleModerationAdmin({ DB: db }, new Request("https://x/api/admin/moderation/decide", {
    method: "POST", body: JSON.stringify({ id: listed.data.items[0].id, approve: true }),
  }), "/api/admin/moderation/decide", editor, J);
  assert.deepEqual(response, { data: { ok: true }, status: 200 });
  assert.equal(raw.prepare("SELECT status FROM comments WHERE id=1").get().status, "ok");
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM comments WHERE id=1").get().n, 1);
  assert.equal(raw.prepare("SELECT status FROM ai_review_queue WHERE id=1").get().status, "approved");
});

test("REST alt-text budget reservation requires the configured token and enforces the cap", async () => {
  const { db, raw } = await database(), env = { DB: db, CF_AI_TOKEN: "test-token", WORKERS_AI_DAILY_NEURONS: "10" };
  const J = (data, status = 200) => ({ data, status }), path = "/api/internal/ai-budget";
  const auth = ["Bearer", env.CF_AI_TOKEN].join(" "), wrong = ["Bearer", "wrong"].join(" ");
  let r = await handleAiBudget(env, new Request("https://x", { method: "POST", headers: { authorization: wrong }, body: '{"neurons":8}' }), path, J);
  assert.equal(r.status, 403);
  const request = () => new Request("https://x", { method: "POST", headers: { authorization: auth }, body: '{"neurons":8}' });
  r = await handleAiBudget(env, request(), path, J); assert.equal(r.data.reserved, true);
  r = await handleAiBudget(env, request(), path, J); assert.equal(r.data.reserved, false);
  assert.equal(raw.prepare("SELECT neurons FROM workers_ai_daily").get().neurons, 8);
});

test("questions, answers, and reviews hold unsafe text and keep safe or failed checks live", async () => {
  const { db, raw } = await database();
  const oldFetch = globalThis.fetch;
  globalThis.fetch = async () => ({ json: async () => ({ entities: [{ id: "power-bi" }] }) });
  let mode = "unsafe", calls = 0;
  const env = { DB: db, SITE: "https://example.test", WORKERS_AI_DAILY_NEURONS: "9000", AI: { run: async () => {
    calls++;
    if (mode === "error") throw new Error("offline");
    return { response: mode === "unsafe" ? "unsafe\nS2" : "safe" };
  } } };
  try {
    const user = { id: 1 };
    const held = await askQuestion(env, user, "power-bi", "Can this feature do something?", "en");
    mode = "safe";
    const safe = await askQuestion(env, user, "power-bi", "Is this documented clearly?", "en");
    mode = "error";
    const failed = await askQuestion(env, user, "power-bi", "Does the fallback publish?", "en");
    assert.deepEqual([held.status, safe.status, failed.status], ["pending", "live", "live"]);
    assert.equal(raw.prepare("SELECT hidden FROM entity_q WHERE id=?").get(held.id).hidden, 2);
    assert.equal(raw.prepare("SELECT hidden FROM entity_q WHERE id=?").get(safe.id).hidden, 0);
    const answer = await answerQuestion(env, { id: 2 }, safe.id, "This answer should be held for editorial review.");
    assert.equal(answer.status, "live");
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM ai_review_queue WHERE kind='question' AND status='pending'").get().n, 1);
    assert.ok(calls >= 4);

    mode = "unsafe";
    const response = await handleReviews(env, new Request("https://x/api/reviews", {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ show: "en", rating: 5, title: "A thoughtful review", body: "This review text is long enough to submit." }),
    }), new URL("https://x/api/reviews"), "/api/reviews", { id: 3 }, (data, status = 200) => ({ data, status }));
    assert.equal(response.data.status, "pending");
    assert.equal(raw.prepare("SELECT status FROM show_reviews WHERE user_id=3").get().status, "pending");
  } finally {
    globalThis.fetch = oldFetch;
  }
});

test("comments are held only on unsafe output and staff bypass Workers AI", async () => {
  const { db, raw } = await database();
  raw.exec("INSERT INTO users(id,provider,sub,name,created) VALUES(1,'g','1','A',1),(2,'g','2','B',1),(3,'g','3','C',1)");
  let calls = 0;
  const env = { DB: db, SITE: "https://example.test", WORKERS_AI_DAILY_NEURONS: "9000", AI: { run: async () => {
    calls++;
    return { response: calls === 1 ? "unsafe\nS3" : "safe" };
  } } };
  const oldFetch = globalThis.fetch;
  globalThis.fetch = async () => ({ json: async () => ({ episodes: [] }) });
  const post = (body) => new Request("https://x/api/comments", {
    method: "POST", headers: { "content-type": "application/json", "x-requested-with": "m365" }, body: JSON.stringify(body),
  });
  try {
    const unsafe = await api(env, post({ vid: "blog123", lang: "en", body: "A questionable comment" }), new URL("https://x/api/comments"), "/api/comments", { id: 1, name: "A" });
    const safe = await api(env, post({ vid: "blog123", lang: "en", body: "A safe comment" }), new URL("https://x/api/comments"), "/api/comments", { id: 2, name: "B" });
    const admin = await api(env, post({ vid: "blog123", lang: "en", body: "A staff comment" }), new URL("https://x/api/comments"), "/api/comments", { id: 3, name: "C", admin: true });
    assert.equal((await unsafe.json()).status, "pending");
    assert.equal((await safe.json()).status, "ok");
    assert.equal((await admin.json()).status, "ok");
    assert.equal(calls, 2);
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM comments WHERE status='pending'").get().n, 1);
  } finally {
    globalThis.fetch = oldFetch;
  }
});

test("blog summaries are marked automatic and unsafe posts stay pending", async () => {
  const { db, raw } = await database();
  raw.exec(`INSERT INTO users(id,provider,sub,name,created) VALUES(1,'g','1','Writer',1);
    INSERT INTO profiles(user_id,public,handle,headline,about,company,job,country,show_org,updated) VALUES(1,1,'writer','','','','','',1,1)`);
  const oldFetch = globalThis.fetch;
  globalThis.fetch = async () => ({ json: async () => ({ entities: [] }) });
  let mode = "safe";
  const env = { DB: db, SITE: "https://example.test", WORKERS_AI_DAILY_NEURONS: "9000", AI: { run: async (model) => {
    if (model === "@cf/meta/llama-3.1-8b-instruct") return { response: "A generated teaser." };
    return { response: mode === "unsafe" ? "unsafe\nS2" : "safe" };
  } } };
  const body = "A sufficiently long community article with useful details. ".repeat(20);
  const save = (title) => new Request("https://x/api/blog/save", {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ title, body, lang: "en", submit: true }),
  });
  const J = (data, status = 200) => ({ data, status });
  try {
    const live = await handleBlog(env, save("A safe community article"), new URL("https://x/api/blog/save"), "/api/blog/save", { id: 1 }, J);
    assert.equal(live.data.status, "live");
    assert.equal(live.data.summary, "A generated teaser.");
    assert.equal(live.data.summary_auto, true);
    mode = "unsafe";
    const held = await handleBlog(env, save("A held community article"), new URL("https://x/api/blog/save"), "/api/blog/save", { id: 1 }, J);
    assert.equal(held.data.status, "pending");
    assert.equal(raw.prepare("SELECT status FROM blog_posts WHERE id=?").get(held.data.id).status, "pending");
    assert.equal(raw.prepare("SELECT category FROM ai_review_queue WHERE kind='blog' AND item_id=?").get(held.data.id).category, "S2: Nichtgewalttätige Straftaten");
  } finally {
    globalThis.fetch = oldFetch;
  }
});
