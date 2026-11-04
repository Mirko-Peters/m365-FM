import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { dispatchTopicNotifications, handleTopicSubscriptions, quietHours } from "../src/topic_notifications.js";
import { refreshFeeds } from "../src/feeds.js";
import { sign } from "../src/util.js";

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
        all: async () => ({ results: st.all(...args) }),
        first: async () => st.get(...args) ?? null,
        run: async () => { const r = st.run(...args); return { meta: { changes: Number(r.changes) } }; },
      };
      return q;
    },
    async batch(stmts) { return Promise.all(stmts.map((s) => s.run())); },
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
    raw.prepare("INSERT INTO topic_queue(channel,recipient,lang,timezone,kind,topic_id,item_key,title,body,url,created) VALUES('email','7','de','UTC',?,?,?,?,?,?,?)")
      .run(kind, topicId, itemKey, itemKey, "", "https://www.m365.fm/", 1);
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
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM topic_queue WHERE sent=1").get().n, 5);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM topic_queue WHERE sent=0").get().n, 2);
  await dispatchTopicNotifications(env, { at: noon });
  assert.equal(sent.length, 1, "same-day delivery limit prevents another batch");
  await dispatchTopicNotifications(env, { at: new Date("2026-11-05T12:00:00Z") });
  assert.equal(sent.length, 2, "pending topic is delivered on the next local day");
  assert.equal((sent[1].html.match(/<li>/g) || []).length, 2);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM topic_queue WHERE sent=0").get().n, 0);
});

test("topic subscriptions: require a registered push endpoint or a verified, explicit e-mail opt-in", async () => {
  const { db, raw } = await database();
  raw.exec(`
    INSERT INTO events(id,handle,owner_id,title,start,created,updated) VALUES(1,'m365con-2027',1,'M365Con','2027-01-11',1,1);
    INSERT INTO event_sessions(id,event_id,title,start,status,proposer_id,created) VALUES(42,1,'Copilot session','2027-01-11T10:00','live',1,1);
    INSERT INTO push_subs(endpoint,p256dh,auth,lang,user_id,created) VALUES('https://push.example/42','p','a','en',NULL,1);
    INSERT INTO users(id,provider,sub,name,created) VALUES(7,'test','7','Test',1);
    INSERT INTO mail_addr(user_id,email,verified,token,created) VALUES(7,'test@example.invalid',1,'',1);
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
  raw.exec("INSERT INTO topic_queue(channel,recipient,lang,timezone,kind,topic_id,item_key,title,url,created) VALUES('push','https://push.example/42','en','UTC','session','42','old','Session','https://www.m365.fm/',1)");
  const follow = await run("follow", { kind: "session", id: "42", endpoint: "https://push.example/42", lang: "de", timezone: "Europe/Berlin" });
  assert.deepEqual(follow.data, { ok: true, following: true });
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM push_topics WHERE endpoint='https://push.example/42'").get().n, 1);
  assert.equal(raw.prepare("SELECT timezone FROM push_topics WHERE endpoint='https://push.example/42'").get().timezone, "Europe/Berlin");
  const pushPrefs = raw.prepare("SELECT lang,timezone FROM topic_queue WHERE recipient='https://push.example/42'").get();
  assert.equal(pushPrefs.lang, "de");
  assert.equal(pushPrefs.timezone, "Europe/Berlin");
  const mine = await run("mine", {}, null, "GET", "?endpoint=https%3A%2F%2Fpush.example%2F42");
  assert.equal(mine.data.subscriptions.length, 1);
  const unfollow = await run("unfollow", { kind: "session", id: "42", endpoint: "https://push.example/42" });
  assert.deepEqual(unfollow.data, { ok: true, following: false });

  raw.exec(`
    INSERT INTO push_subs(endpoint,p256dh,auth,lang,user_id,created) VALUES('https://push.example/account','p','a','en',7,1);
    INSERT INTO push_topics(endpoint,kind,topic_id,lang,timezone,user_id,created) VALUES('https://push.example/account','session','42','en','UTC',7,1);
    INSERT INTO topic_queue(channel,recipient,lang,timezone,kind,topic_id,item_key,title,body,url,created) VALUES('push','https://push.example/account','en','UTC','session','42','reminder:42','Session','','https://www.m365.fm/',1);
  `);
  const status = await run("status", {}, { id: 7 }, "GET", "?kind=session&id=42");
  assert.equal(status.data.following, true, "account follows are visible without the original device");
  const accountUnfollow = await run("unfollow", { kind: "session", id: "42" }, { id: 7 });
  assert.deepEqual(accountUnfollow.data, { ok: true, following: false });
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM push_topics WHERE user_id=7").get().n, 0);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM topic_queue WHERE recipient='https://push.example/account' AND sent=0").get().n, 0);

  raw.exec("INSERT INTO topic_queue(channel,recipient,lang,timezone,kind,topic_id,item_key,title,url,created) VALUES('email','7','en','UTC','session','42','old-email','Session','https://www.m365.fm/',1)");
  const email = await run("follow", { kind: "session", id: "42", lang: "de", email: true, timezone: "Europe/Berlin" }, { id: 7 });
  assert.deepEqual(email.data, { ok: true, following: true });
  const emailPrefs = raw.prepare("SELECT lang,timezone FROM topic_queue WHERE recipient='7'").get();
  assert.equal(emailPrefs.lang, "de");
  assert.equal(emailPrefs.timezone, "Europe/Berlin");
  const sig = await sign(env.SESSION_SECRET, "topic-email:7");
  const unsub = await run("email-unsub", {}, null, "GET", `?t=7.${sig}`);
  assert.equal(unsub.status, 200);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM email_topics WHERE user_id=7").get().n, 0);
});
