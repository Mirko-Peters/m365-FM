import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { dispatchTopicNotifications, handleTopicSubscriptions, queueTopicArticles, queueSessionReminders, queueTopicNotification, quietHours } from "../src/topic_notifications.js";
import { refreshFeeds } from "../src/feeds.js";
import { sign } from "../src/util.js";
import { savePushSubscription } from "../src/push.js";
import { digestPushSubscriptions } from "../src/digest.js";
import worker from "../src/index.js";

async function database() {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:");
  const dir = new URL("../migrations/", import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(f, dir), "utf-8"));
  const db = {
    prepare(sql) {
      const st = raw.prepare(sql); let args = [];
      const q = {
        sql,
        bind(...values) { if (values.length > 100) throw new Error("too many SQL variables"); args = values; return q; },
        all: async () => ({ results: st.all(...args) }),
        first: async () => st.get(...args) ?? null,
        run: async () => { const r = st.run(...args); return { meta: { changes: Number(r.changes) } }; },
      };
      return q;
    },
    async batch(stmts) { return Promise.all(stmts.map((s) => /^\s*SELECT/i.test(s.sql) ? s.all() : s.run())); },
  };
  return { db, raw };
}

test("topic notifications: timezone quiet hours include midnight and end at 07:00", () => {
  assert.equal(quietHours("Europe/Berlin", new Date("2026-11-04T00:30:00Z")), true);
  assert.equal(quietHours("Europe/Berlin", new Date("2026-11-04T05:59:00Z")), true);
  assert.equal(quietHours("Europe/Berlin", new Date("2026-11-04T06:00:00Z")), false);
  assert.equal(quietHours("invalid/timezone", new Date("2026-11-04T06:00:00Z")), true);
});

test("creator topic notifications include new organization feed items", async () => {
  const { db, raw } = await database(), now = Math.floor(Date.now() / 1000);
  raw.exec(`
    INSERT INTO orgs(id,handle,name,public,created) VALUES(3,'acme-labs','Acme',1,1);
    INSERT INTO channels(id,owner_type,owner_id,kind,url,feed,fetched) VALUES(10,'o',3,'github','https://github.com/acme','https://github.com/acme.atom',0);
    INSERT INTO feed_items(channel_id,owner_type,owner_id,url,title,published) VALUES(10,'o',3,'https://github.com/acme/old','Old item',${now});
    INSERT INTO mail_addr(user_id,email,verified,token,created) VALUES(7,'test@example.invalid',1,'',1);
    INSERT INTO email_topics(user_id,kind,topic_id,lang,timezone,created) VALUES(7,'creator','acme-labs','en','UTC',1);
  `);
  const xml = `<rss><channel>
    <item><title>Old item</title><link>https://github.com/acme/old</link></item>
    <item><title>New organization item</title><link>https://github.com/acme/new</link></item>
  </channel></rss>`;
  const oldFetch = globalThis.fetch;
  globalThis.fetch = async () => ({ ok: true, text: async () => xml });
  try {
    await refreshFeeds({ DB: db, SITE: "https://www.m365.fm" });
    const queued = raw.prepare("SELECT title,url FROM topic_queue WHERE channel='email' AND recipient='7'").get();
    assert.equal(queued.title, "New organization item");
    assert.equal(queued.url, "https://github.com/acme/new");
  } finally {
    globalThis.fetch = oldFetch;
  }
});

test("topic notifications: coalesce a topic, cap daily sends at three topics, then release the remainder next day", async () => {
  const { db, raw } = await database(), sent = [];
  raw.exec("INSERT INTO mail_addr(user_id,email,verified,token,created) VALUES(7,'test@example.invalid',1,'',1)");
  for (const [kind, topicId, itemKey] of [
    ["entity", "copilot", "episode:1"], ["entity", "copilot", "article:1"],
    ["entity", "copilot", "article:2"], ["entity", "copilot", "article:3"],
    ["entity", "fabric", "episode:2"], ["creator", "mirko-p", "article:3"],
    ["event", "m365con-2027", "reminder:4"],
  ]) {
    raw.prepare("INSERT INTO topic_queue(channel,recipient,lang,timezone,kind,topic_id,item_key,title,body,url,created,expires) VALUES('email','7','de','UTC',?,?,?,?,?,?,?,?)")
      .run(kind, topicId, itemKey, itemKey, "", "https://www.m365.fm/", 1, 2000000000);
  }
  const env = {
    DB: db, SESSION_SECRET: "test-secret", API: "https://api-dub.m365.fm", MAIL_FROM: "M365.FM <system@m365.fm>",
    EMAIL: { async send(message) { sent.push(message); return { messageId: "test" }; } },
  };
  const noon = new Date("2026-11-04T12:00:00Z");
  const first = await dispatchTopicNotifications(env, { at: noon });
  assert.equal(first.sent, 1);
  assert.equal(sent.length, 1);
  assert.equal((sent[0].html.match(/<li>/g) || []).length, 5);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM topic_deliveries").get().n, 3);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM topic_queue WHERE sent=1").get().n, 6);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM topic_queue WHERE sent=0").get().n, 1);
  await dispatchTopicNotifications(env, { at: noon });
  assert.equal(sent.length, 1, "same-day delivery limit prevents another batch");
  await dispatchTopicNotifications(env, { at: new Date("2026-11-05T12:00:00Z") });
  assert.equal(sent.length, 2, "pending topic is delivered on the next local day");
  assert.equal((sent[1].html.match(/<li>/g) || []).length, 1);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM topic_queue WHERE sent=0").get().n, 0);
});

test("topic delivery defers quiet recipients so they cannot starve the next eligible recipient", async () => {
  const { db, raw } = await database(), sent = [];
  const rows = [];
  for (let id = 1; id <= 121; id++) {
    rows.push(db.prepare("INSERT INTO mail_addr(user_id,email,verified,token,created) VALUES(?,?,1,'',1)").bind(id, `user${id}@example.invalid`));
    rows.push(db.prepare("INSERT INTO topic_queue(channel,recipient,lang,timezone,kind,topic_id,item_key,title,url,created,expires) VALUES('email',?,'en',?,'entity',?,'item','Title','https://www.m365.fm/',?,2000000000)")
      .bind(String(id), id <= 120 ? "America/Los_Angeles" : "Europe/Berlin", `topic-${id}`, id));
  }
  await db.batch(rows);
  const env = {
    DB: db, SESSION_SECRET: "test-secret", API: "https://api-dub.m365.fm",
    EMAIL: { async send(message) { sent.push(message); return { messageId: "test" }; } },
  };
  const first = await dispatchTopicNotifications(env, { at: new Date("2026-11-04T12:00:00Z") });
  assert.equal(first.quiet, 120);
  assert.equal(first.sent, 0);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM topic_recipient_state WHERE not_before>0").get().n, 120);
  const second = await dispatchTopicNotifications(env, { at: new Date("2026-11-04T12:15:00Z") });
  assert.equal(second.sent, 1);
  assert.equal(sent.length, 1);
  assert.equal(raw.prepare("SELECT sent FROM topic_queue WHERE recipient='121'").get().sent, 1);
});

test("topic subscriptions label over 50 followed creators without exceeding D1's bind limit", async () => {
  const { db, raw } = await database();
  for (let i = 0; i < 51; i++) raw.prepare(
    "INSERT INTO email_topics(user_id,kind,topic_id,lang,timezone,created) VALUES(7,'creator',?,'en','UTC',1)",
  ).run(`creator-${i}`);
  const req = new Request("https://api-dub.m365.fm/api/topics/mine");
  const response = await handleTopicSubscriptions({ DB: db, SITE: "https://www.m365.fm" }, req, new URL(req.url), "/api/topics/mine", { id: 7 }, (data) => data);
  assert.equal(response.subscriptions.length, 51);
  assert.equal(response.subscriptions[0].label.startsWith("creator-"), true);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM email_topics WHERE user_id=7").get().n, 51);
});

test("topic push subscriptions do not opt into the episode digest", async () => {
  const { db, raw } = await database();
  await savePushSubscription(db, { endpoint: "https://push.example/topic", p256dh: "p", auth: "a", lang: "en", digest: 0, created: 1 });
  await savePushSubscription(db, { endpoint: "https://push.example/digest", p256dh: "p", auth: "a", lang: "en", digest: 1, created: 1 });
  await savePushSubscription(db, { endpoint: "https://push.example/topic", p256dh: "p2", auth: "a2", lang: "en", digest: 0, created: 2 });
  assert.equal(raw.prepare("SELECT digest FROM push_subs WHERE endpoint='https://push.example/topic'").get().digest, 0);
  assert.deepEqual((await digestPushSubscriptions(db, "en")).map((s) => ({ ...s })), [{ endpoint: "https://push.example/digest", p256dh: "p", auth: "a" }]);
  await savePushSubscription(db, { endpoint: "https://push.example/topic", p256dh: "p2", auth: "a2", lang: "en", digest: 1, created: 3 });
  assert.equal(raw.prepare("SELECT digest FROM push_subs WHERE endpoint='https://push.example/topic'").get().digest, 1);
});

test("push digest can be disabled without removing a topic subscription", async () => {
  const { db, raw } = await database();
  raw.exec(`
    INSERT INTO push_subs(endpoint,p256dh,auth,lang,created,digest) VALUES('https://push.example/topic-digest','p','a','en',1,1);
    INSERT INTO push_topics(endpoint,kind,topic_id,lang,timezone,created) VALUES('https://push.example/topic-digest','entity','copilot-studio','en','UTC',1);
  `);
  const env = { DB: db, SITE: "https://www.m365.fm", API: "https://api-dub.m365.fm", SESSION_SECRET: "test-secret" };
  const request = (path, method = "GET", body) => new Request(`https://api-dub.m365.fm${path}`, {
    method, headers: { origin: "https://www.m365.fm", "x-requested-with": "m365", ...(body ? { "content-type": "application/json" } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const statusBefore = await worker.fetch(request("/api/push/status?endpoint=https%3A%2F%2Fpush.example%2Ftopic-digest"), env);
  assert.deepEqual(await statusBefore.json(), { registered: true, digest: true, topics: true });
  const changed = await worker.fetch(request("/api/push/digest", "POST", { endpoint: "https://push.example/topic-digest", on: false }), env);
  assert.equal(changed.status, 200);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM push_topics WHERE endpoint='https://push.example/topic-digest'").get().n, 1);
  assert.equal(raw.prepare("SELECT digest FROM push_subs WHERE endpoint='https://push.example/topic-digest'").get().digest, 0);
});

test("blog follows are not topic notifications and survive clearing them", async () => {
  const { db, raw } = await database();
  raw.prepare("INSERT INTO blog_follows(user_id,handle,created) VALUES(7,'mirko-p',1)").run();
  const env = { DB: db }, user = { id: 7 };
  const json = (value, status = 200) => new Response(JSON.stringify(value), { status });
  const mine = await handleTopicSubscriptions(env, new Request("https://api-dub.m365.fm/api/topics/mine"), new URL("https://api-dub.m365.fm/api/topics/mine"), "/api/topics/mine", user, json);
  assert.deepEqual((await mine.json()).subscriptions, []);
  const clearUrl = new URL("https://api-dub.m365.fm/api/topics/clear");
  const cleared = await handleTopicSubscriptions(env, new Request(clearUrl, { method: "POST", headers: { "content-type": "application/json" }, body: "{}" }), clearUrl, "/api/topics/clear", user, json);
  assert.equal(cleared.status, 200);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM blog_follows WHERE user_id=7 AND handle='mirko-p'").get().n, 1);
});

test("topic article polling processes only the newest 50 and queues them in batches", async () => {
  const { db, raw } = await database();
  raw.exec(`
    INSERT INTO meta(k,v) VALUES('topic_articles_init','1');
    INSERT INTO push_subs(endpoint,p256dh,auth,lang,created,digest) VALUES('https://push.example/articles','p','a','en',1,0);
    INSERT INTO push_topics(endpoint,kind,topic_id,lang,timezone,created) VALUES('https://push.example/articles','entity','copilot-studio','en','UTC',1);
  `);
  const articles = Array.from({ length: 51 }, (_, i) => ({
    url: `https://www.m365.fm/article/${i}`, title: `Article ${i}`, topics: ["copilot-studio"],
  }));
  const oldFetch = globalThis.fetch;
  globalThis.fetch = async (url) => url.endsWith("/articles.json")
    ? { ok: true, json: async () => ({ articles }) }
    : { ok: true, json: async () => ({ entities: [{ id: "copilot-studio", name: "Copilot Studio" }] }) };
  try {
    const result = await queueTopicArticles({ DB: db, SITE: "https://www.m365.fm" });
    assert.equal(result.seen, 50);
    assert.equal(result.queued, 50);
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM topic_queue WHERE channel='push'").get().n, 50);
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM topic_seen").get().n, 50);
  } finally { globalThis.fetch = oldFetch; }
});

test("session reminders interpret event start as local time and expire at its UTC start", async () => {
  const { db, raw } = await database();
  raw.exec(`
    INSERT INTO events(id,handle,owner_id,title,start,tz,public,created,updated) VALUES(1,'m365con-2027',1,'M365Con','2026-11-05','Europe/Berlin',1,1,1);
    INSERT INTO event_sessions(id,event_id,title,start,status,proposer_id,created) VALUES(42,1,'Copilot session','2026-11-05T13:00','live',1,1);
    INSERT INTO push_subs(endpoint,p256dh,auth,lang,created,digest) VALUES('https://push.example/reminder','p','a','en',1,0);
    INSERT INTO push_topics(endpoint,kind,topic_id,lang,timezone,created) VALUES('https://push.example/reminder','session','42','en','UTC',1);
  `);
  const at = Math.floor(new Date("2026-11-05T11:45:00Z").getTime() / 1000);
  await queueSessionReminders({ DB: db, SITE: "https://www.m365.fm" }, at);
  const row = raw.prepare("SELECT item_key,expires FROM topic_queue WHERE kind='session'").get();
  assert.equal(row.item_key, "session-reminder:42:15m");
  assert.equal(row.expires, Math.floor(new Date("2026-11-05T12:00:00Z").getTime() / 1000));
});

test("topic subscriptions: require a registered push endpoint or a verified, explicit e-mail opt-in", async () => {
  const { db, raw } = await database();
  raw.exec(`
    INSERT INTO events(id,handle,owner_id,title,start,created,updated) VALUES(1,'m365con-2027',1,'M365Con','2027-01-11',1,1);
    INSERT INTO event_sessions(id,event_id,title,start,status,proposer_id,created) VALUES(42,1,'Copilot session','2027-01-11T10:00','live',1,1);
    INSERT INTO push_subs(endpoint,p256dh,auth,lang,user_id,created,digest) VALUES('https://push.example/42','p','a','en',NULL,1,0);
    INSERT INTO users(id,provider,sub,name,created) VALUES(7,'test','7','Test',1);
    INSERT INTO mail_addr(user_id,email,verified,token,created) VALUES(7,'test@example.invalid',1,'',1);
    INSERT INTO event_sessions(id,event_id,title,start,status,proposer_id,created) VALUES(43,1,'Second session','2027-01-11T11:00','live',1,1);
  `);
  const env = { DB: db, SESSION_SECRET: "test-secret", SITE: "https://www.m365.fm", API: "https://api-dub.m365.fm" };
  const run = async (path, body, user = null, method = "POST", query = "") => {
    const request = new Request(`https://api-dub.m365.fm/api/topics/${path}${query}`, {
      method, headers: method === "POST" ? { "content-type": "application/json" } : {}, body: method === "POST" ? JSON.stringify(body || {}) : undefined,
    });
    const result = await handleTopicSubscriptions(env, request, new URL(request.url), `/api/topics/${path}`, user, (data, status = 200) => ({ data, status }));
    return result;
  };
  const denied = await run("follow", { kind: "session", id: "42", lang: "en" });
  assert.equal(denied.status, 400);
  assert.equal(denied.data.error, "consent_required");
  raw.exec("INSERT INTO topic_queue(channel,recipient,lang,timezone,kind,topic_id,item_key,title,url,created,expires) VALUES('push','https://push.example/42','en','UTC','session','42','old','Session','https://www.m365.fm/',1,2000000000)");
  const follow = await run("follow", { kind: "session", id: "42", endpoint: "https://push.example/42", lang: "de", timezone: "Europe/Berlin" });
  assert.deepEqual(follow.data, { ok: true, following: true });
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM push_topics WHERE endpoint='https://push.example/42'").get().n, 1);
  assert.equal(raw.prepare("SELECT timezone FROM push_topics WHERE endpoint='https://push.example/42'").get().timezone, "Europe/Berlin");
  const pushPrefs = raw.prepare("SELECT lang,timezone FROM topic_queue WHERE recipient='https://push.example/42'").get();
  assert.equal(pushPrefs.lang, "de");
  assert.equal(pushPrefs.timezone, "Europe/Berlin");
  const mine = await run("mine", {}, null, "GET", "?endpoint=https%3A%2F%2Fpush.example%2F42");
  assert.equal(mine.data.subscriptions.length, 1);
  assert.equal(mine.data.subscriptions[0].label, "Copilot session");
  const unfollow = await run("unfollow", { kind: "session", id: "42", endpoint: "https://push.example/42" });
  assert.deepEqual(unfollow.data, { ok: true, following: false });
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM push_subs WHERE endpoint='https://push.example/42'").get().n, 0);
  await savePushSubscription(db, { endpoint: "https://push.example/42", p256dh: "p", auth: "a", lang: "en", digest: 0, created: 2 });
  const followAgain = await run("follow", { kind: "session", id: "43", endpoint: "https://push.example/42", lang: "en" });
  assert.deepEqual(followAgain.data, { ok: true, following: true });

  raw.exec(`
    INSERT INTO push_subs(endpoint,p256dh,auth,lang,user_id,created) VALUES('https://push.example/account','p','a','en',7,1);
    INSERT INTO push_topics(endpoint,kind,topic_id,lang,timezone,user_id,created) VALUES('https://push.example/account','session','42','en','UTC',7,1);
    INSERT INTO topic_queue(channel,recipient,lang,timezone,kind,topic_id,item_key,title,body,url,created,expires) VALUES('push','https://push.example/account','en','UTC','session','42','reminder:42','Session','','https://www.m365.fm/',1,2000000000);
  `);
  const status = await run("status", {}, { id: 7 }, "GET", "?kind=session&id=42");
  assert.equal(status.data.following, true, "account follows are visible without the original device");
  const accountUnfollow = await run("unfollow", { kind: "session", id: "42" }, { id: 7 });
  assert.deepEqual(accountUnfollow.data, { ok: true, following: false });
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM push_topics WHERE user_id=7").get().n, 0);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM topic_queue WHERE recipient='https://push.example/account' AND sent=0").get().n, 0);

  raw.exec("INSERT INTO topic_queue(channel,recipient,lang,timezone,kind,topic_id,item_key,title,url,created,expires) VALUES('email','7','en','UTC','session','42','old-email','Session','https://www.m365.fm/',1,2000000000)");
  const email = await run("follow", { kind: "session", id: "42", lang: "de", email: true, timezone: "Europe/Berlin" }, { id: 7 });
  assert.deepEqual(email.data, { ok: true, following: true });
  await queueTopicNotification(env, { kind: "session", topicId: "42", key: "email-only", title: "Session", url: "https://www.m365.fm/" });
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM topic_queue WHERE channel='push' AND item_key='email-only'").get().n, 0);
  const emailPrefs = raw.prepare("SELECT lang,timezone FROM topic_queue WHERE recipient='7'").get();
  assert.equal(emailPrefs.lang, "de");
  assert.equal(emailPrefs.timezone, "Europe/Berlin");
  raw.exec("UPDATE mail_addr SET verified=0 WHERE user_id=7");
  await dispatchTopicNotifications({ DB: db, SESSION_SECRET: "test-secret", API: "https://api-dub.m365.fm" }, { at: new Date("2026-11-04T12:00:00Z") });
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM email_topics WHERE user_id=7").get().n, 1, "an unverified address does not delete topic subscriptions");
  const sig = await sign(env.SESSION_SECRET, "topic-email:7");
  const unsub = await run("email-unsub", {}, null, "GET", `?t=7.${sig}`);
  assert.equal(unsub.status, 200);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM email_topics WHERE user_id=7").get().n, 0);
});
