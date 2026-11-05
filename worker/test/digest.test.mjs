import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { conBanner } from "../src/mailer.js";
import { renderWeeklyMail, runDigest } from "../src/digest.js";
import worker from "../src/index.js";
import { handleMail } from "../src/mail.js";
import { deleteUserData } from "../src/profiles.js";

async function database({ fresh = false } = {}) {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:");
  const dir = new URL("../migrations/", import.meta.url);
  for (const file of readdirSync(dir).filter((name) => name.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(file, dir), "utf-8"));
  if (!fresh) raw.exec("INSERT INTO meta(k,v) VALUES('weekly_start','2000-01-03')");   // Umstellung liegt in den Tests in der Vergangenheit
  const db = {
    prepare(sql) {
      const stmt = raw.prepare(sql); let args = [];
      const out = {
        bind(...values) { args = values; return out; },
        all: async () => ({ results: stmt.all(...args) }),
        first: async () => stmt.get(...args) ?? null,
        run: async () => { const result = stmt.run(...args); return { meta: { changes: Number(result.changes), last_row_id: Number(result.lastInsertRowid || 0) } }; },
      };
      return out;
    },
    async batch(stmts) { const results = []; for (const stmt of stmts) results.push(await stmt.run()); return results; },
  };
  return { db, raw };
}

test("M365Con-Banner gilt bis einschließlich 22.01.2027 und wird danach ausgeblendet", () => {
  assert.match(conBanner("de", "2027-01-22T23:59:59Z"), /m365con\.net/);
  assert.match(conBanner("en", "2026-11-04T06:00:00Z"), /Learn more/);
  assert.equal(conBanner("de", "2027-01-23T00:00:00Z"), "");
});

test("Wochenmail-Vorschau de/en mit und ohne persönliche Hinweise", () => {
  const item = { title: "Neuer Inhalt", summary: "Ein Satz", url: "https://www.m365.fm/de/" };
  const de = renderWeeklyMail({ lang: "de", itemsByLang: { de: [item] }, personal: [{ title: "Du wurdest hinzugefügt" }] });
  const en = renderWeeklyMail({ lang: "en", itemsByLang: { en: [item] }, personal: [{ title: "You were added" }] });
  const noPersonal = renderWeeklyMail({ lang: "en", itemsByLang: { en: [item] } });
  assert.match(de, /Deine Wochenübersicht/);
  assert.match(de, /Persönliche Hinweise/);
  assert.match(en, /Your weekly overview/);
  assert.match(en, /Personal updates/);
  assert.doesNotMatch(noPersonal, /Personal updates/);
});

test("Wochenmail reserviert kein Wochenlimit, wenn der Mailversand nicht konfiguriert ist", async () => {
  const { db, raw } = await database();
  const t = Date.UTC(2026, 10, 8, 6);
  raw.exec("INSERT INTO email_subs(email,lang,token,confirmed,created) VALUES('member','en','token',1,1)");
  const oldFetch = globalThis.fetch;
  globalThis.fetch = async () => ({ json: async () => ({ episodes: [{ id: "new", language: "en", date: new Date(t - 3600_000).toISOString(), url: "https://www.m365.fm/en/new", title: "New" }] }) });
  try {
    const result = await runDigest({ DB: db, SITE: "https://www.m365.fm" }, { at: t });
    assert.equal(result.mailOff, true);
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM mail_weekly_delivery").get().n, 0);
  } finally { globalThis.fetch = oldFetch; }
});

test("Wochenmail bündelt Sprachen und Antworten, versendet persönliche Kontohinweise ohne Newsletter-Inhalte", async () => {
  const { db, raw } = await database();
  const t = Date.UTC(2026, 10, 9, 6), recent = new Date(t - 86400_000).toISOString();
  raw.exec("INSERT INTO users(id,provider,sub,name,lang,created) VALUES(1,'test','one','User','de',1),(2,'test','two','No subscription','en',1); INSERT INTO mail_addr(user_id,email,verified,created) VALUES(1,'member',1,1),(2,'account-only',1,1);");
  raw.exec("INSERT INTO email_subs(email,lang,token,confirmed,created) VALUES('member','de','de-token',1,1),('member','en','en-token',1,1),('pending','de','pending-token',0,1);");
  const oldFetch = globalThis.fetch, sent = [];
  let episodes = [{ id: "old", language: "de", date: new Date(t - 10 * 86400_000).toISOString(), url: "https://www.m365.fm/de/alt", title: "Alt" }];
  globalThis.fetch = async () => ({ json: async () => ({ episodes }) });
  const env = { DB: db, SITE: "https://www.m365.fm", API: "https://api-dub.m365.fm", MAIL_FROM: "M365.FM", EMAIL: { send: async (message) => { sent.push(message); return { messageId: `mail-${sent.length}` }; } } };
  try {
    const empty = await runDigest(env, { at: t });
    assert.equal(empty.empty, 2);
    assert.equal(sent.length, 0, "leere Woche sendet nichts");

    raw.prepare("INSERT INTO mail_outbox(user_id,kind,subject,html,created) VALUES(2,'reply','Antwort','<p>Persönliche Antwort</p>',?)").run(Math.floor(t / 1000));
    raw.prepare("INSERT INTO email_topics(user_id,kind,topic_id,lang,created) VALUES(1,'entity','power-bi','de',1)").run();   // eine Themenliste (#205)
    raw.prepare("INSERT INTO blog_posts(user_id,slug,title,lang,status,created,updated,published) VALUES(1,'topic-article','Power BI article','de','live',?,?,?)").run(Math.floor(t / 1000), Math.floor(t / 1000), Math.floor(t / 1000));
    raw.prepare("INSERT INTO content_topic(kind,item_id,eid,weight,src,created) VALUES('blog','1','power-bi',1,'admin',?)").run(Math.floor(t / 1000));
    for (let i = 0; i < 45; i++) raw.prepare("INSERT INTO content_topic(kind,item_id,eid,weight,src,created) VALUES('lblog',?,'power-bi',1,'admin',?)").run(String(i), Math.floor(t / 1000));
    raw.exec("INSERT INTO events(id,handle,owner_id,title,start,created,updated) VALUES(1,'topic-event',1,'Topic event','2026-11-08',1,1);");
    raw.prepare("INSERT INTO event_sessions(id,event_id,title,lang,topics,speakers,status,proposer_id,created) VALUES(1,1,'Power BI session','en','[]','[]','live',1,?)").run(Math.floor(t / 1000));
    raw.prepare("INSERT INTO content_topic(kind,item_id,eid,weight,src,created) VALUES('session','1','power-bi',1,'admin',?)").run(Math.floor(t / 1000));
    raw.prepare("INSERT INTO mail_outbox(user_id,kind,subject,html,created) VALUES(1,'reply','Antwort','<p>Neue Antwort</p>',?)").run(Math.floor(t / 1000));
    episodes = [
      { id: "de-new", language: "de", date: recent, url: "https://www.m365.fm/de/neu", title: "Neu auf Deutsch", summary: "Ein Satz" },
      { id: "en-new", language: "en", date: recent, url: "https://www.m365.fm/en/new", title: "New in English", summary: "One sentence" },
    ];
    const sentResult = await runDigest(env, { at: t });
    assert.equal(sentResult.sent, 2, "zwei Sprach-Abos an derselben Adresse ergeben eine Mail; Konto-Hinweise bleiben getrennt");
    assert.equal(sent.length, 2);
    const newsletterMail = sent.find((message) => message.to === "member");
    assert.match(newsletterMail.html, /Neu auf Deutsch/);
    assert.match(newsletterMail.html, /New in English/);
    const accountMail = sent.find((message) => message.to === "account-only");
    assert.ok(accountMail);
    assert.match(accountMail.html, /Personal updates/);
    assert.match(accountMail.html, /New reply to your comment/);
    assert.doesNotMatch(accountMail.html, /Neu in deiner Sprache|New in your language|Power BI/);
    assert.match(newsletterMail.html, /Neu bei deinen Themen/);
    assert.match(newsletterMail.html, /Power BI article/);
    assert.match(newsletterMail.html, /Power BI session/);
    assert.equal(raw.prepare("SELECT sent FROM mail_outbox WHERE user_id=1").get().sent, 1);
    assert.equal(raw.prepare("SELECT sent FROM mail_monthly_usage").get().sent, 2);

    const second = await runDigest(env, { at: t + 12 * 3600_000 });
    assert.equal(second.sent, 0);
    assert.equal(sent.length, 2, "gleiche Adresse erhält höchstens eine Wochenmail");

    const token = raw.prepare("SELECT token FROM mail_weekly_unsub WHERE email='member'").get().token;
    const response = await worker.fetch(new Request(`https://api-dub.m365.fm/api/email/unsub?token=${token}&lang=all`), env);
    assert.equal(response.status, 200);
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM email_subs WHERE email='member' AND confirmed=1").get().n, 0);
    assert.equal(raw.prepare("SELECT on_ FROM mail_prefs WHERE user_id=1 AND kind='weekly'").get().on_, 0);
  } finally { globalThis.fetch = oldFetch; }
});

test("Wochenlimit folgt dem Wochenstart und Sendefehler dürfen im selben Wochenlauf erneut versucht werden", async () => {
  const { db, raw } = await database();
  const t = Date.UTC(2026, 10, 2, 6, 0, 2);
  raw.exec("INSERT INTO email_subs(email,lang,token,confirmed,created) VALUES('member','en','token',1,1);");
  const oldFetch = globalThis.fetch;
  let feedAt = t;
  globalThis.fetch = async () => ({ json: async () => ({ episodes: [{ id: "new", language: "en", date: new Date(feedAt - 3600_000).toISOString(), url: "https://www.m365.fm/en/new", title: "New" }] }) });
  let shouldFail = false, calls = 0;
  const env = { DB: db, SITE: "https://www.m365.fm", MAIL_FROM: "M365.FM", EMAIL: { send: async () => { calls++; if (shouldFail) throw new Error("send_failed"); return { messageId: "ok" }; } } };
  try {
    feedAt = t;
    const first = await runDigest(env, { at: t });
    assert.equal(first.sent, 1);
    feedAt = t + 7 * 86400_000 - 2000;
    const nextWeekEarly = await runDigest(env, { at: feedAt });
    assert.equal(nextWeekEarly.sent, 1, "Montagslauf zwei Sekunden vor der Vorwoche muss zugestellt werden");
    assert.equal(calls, 2);

    shouldFail = true;
    feedAt = t + 14 * 86400_000;
    const failed = await runDigest(env, { at: feedAt });
    assert.equal(failed.sent, 0);
    assert.equal(raw.prepare("SELECT status FROM mail_weekly_delivery").get().status, 2);
    shouldFail = false;
    feedAt += 1800_000;
    const retry = await runDigest(env, { at: feedAt });
    assert.equal(retry.sent, 1, "status=2 muss einen erneuten Versuch erlauben");
  } finally { globalThis.fetch = oldFetch; }
});

test("Mail-Abmeldung und Kontolöschung bereinigen Topic-Follows und unbenötigte Wochen-Abmeldetokens", async () => {
  const { db, raw } = await database();
  raw.exec("INSERT INTO users(id,provider,sub,name,lang,created) VALUES(1,'test','one','User','de',1),(2,'test','two','Other','en',1); INSERT INTO mail_addr(user_id,email,verified,created) VALUES(1,'member',1,1),(2,'subscribed',1,1); INSERT INTO mail_topic_follows(user_id,eid,created) VALUES(1,'power-bi',1),(2,'fabric',1); INSERT INTO mail_weekly_unsub(email,token,updated) VALUES('member','token',1),('subscribed','token2',1); INSERT INTO email_subs(email,lang,token,confirmed,created) VALUES('subscribed','en','confirmed',1,1);");
  const request = new Request("https://api-dub.m365.fm/api/mail/remove", { method: "POST", body: "{}" });
  const response = await handleMail({ DB: db }, request, new URL(request.url), "/api/mail/remove", { id: 1 }, (data) => new Response(JSON.stringify(data)));
  assert.equal(response.status, 200);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM mail_topic_follows WHERE user_id=1").get().n, 0);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM mail_weekly_unsub WHERE email='member'").get().n, 0);
  await deleteUserData(db, 2);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM mail_topic_follows WHERE user_id=2").get().n, 0);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM mail_addr WHERE user_id=2").get().n, 0);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM mail_weekly_unsub WHERE email='subscribed'").get().n, 1, "bestätigtes Newsletter-Abo hält den Abmeldetoken");
});

test("Erster Lauf nach der Umstellung sendet nichts und merkt die Startwoche; ab der naechsten Woche wird gesendet", async () => {
  const { db, raw } = await database({ fresh: true });
  const thursday = Date.UTC(2026, 10, 5, 7), nextMonday = Date.UTC(2026, 10, 9, 6, 0, 2);
  raw.exec("INSERT INTO email_subs(email,lang,token,confirmed,created) VALUES('member','de','de-token',1,1);");
  const oldFetch = globalThis.fetch, sent = [];
  globalThis.fetch = async () => ({ json: async () => ({ episodes: [{ id: "e1", language: "de", date: new Date(nextMonday - 2 * 86400_000).toISOString(), url: "https://www.m365.fm/de/neu", title: "Neu" }] }) });
  const env = { DB: db, SITE: "https://www.m365.fm", API: "https://api-dub.m365.fm", MAIL_FROM: "M365.FM", EMAIL: { send: async (message) => { sent.push(message); return { messageId: "m" + sent.length }; } } };
  try {
    const first = await runDigest(env, { at: thursday });
    assert.equal(first.waiting, true);
    assert.equal(sent.length, 0, "keine Mail am Tag der Umstellung");
    assert.equal(raw.prepare("SELECT v FROM meta WHERE k='weekly_start'").get().v, "2026-11-02");
    assert.equal((await runDigest(env, { at: thursday + 3600_000 })).waiting, true, "auch Nachläufe derselben Woche warten");
    const monday = await runDigest(env, { at: nextMonday });
    assert.ok(!monday.waiting);
    assert.equal(sent.length, 1, "erste Wochenmail am naechsten Montag");
  } finally {
    globalThis.fetch = oldFetch;
    raw.close();
  }
});

test("Eine Themenliste: Altbestand aus mail_topic_follows wird übernommen, schon verschickte Themen-Mails fehlen in der Wochenmail", async () => {
  const { db, raw } = await database();
  const t = Date.UTC(2026, 10, 9, 6, 0, 5), ts = Math.floor(t / 1000) - 3600;
  raw.exec("INSERT INTO users(id,provider,sub,name,lang,created) VALUES(1,'test','one','User','de',1); INSERT INTO mail_addr(user_id,email,verified,created) VALUES(1,'member',1,1);");
  raw.prepare("INSERT INTO mail_topic_follows(user_id,eid,created,active) VALUES(1,'power-bi',1,1)").run();
  raw.prepare("INSERT INTO blog_posts(user_id,slug,title,lang,status,created,updated,published) VALUES(1,'schon-verschickt','Schon verschickt','de','live',?,?,?),(1,'neu-fuer-woche','Neu fuer die Woche','de','live',?,?,?)").run(ts, ts, ts, ts, ts, ts);
  raw.prepare("INSERT INTO content_topic(kind,item_id,eid,weight,src,created) VALUES('blog','1','power-bi',1,'admin',?),('blog','2','power-bi',1,'admin',?)").run(ts, ts);
  raw.prepare("INSERT INTO topic_queue(channel,recipient,lang,kind,topic_id,item_key,title,url,created,expires,sent) VALUES('email','1','de','entity','power-bi','article:x','Schon verschickt','https://www.m365.fm/community/u/user/blog/schon-verschickt/',?,?,1)").run(ts, ts + 86400);
  const oldFetch = globalThis.fetch, sent = [];
  globalThis.fetch = async () => ({ json: async () => ({ episodes: [] }) });
  const env = { DB: db, SITE: "https://www.m365.fm", API: "https://api-dub.m365.fm", MAIL_FROM: "M365.FM", EMAIL: { send: async (message) => { sent.push(message); return { messageId: "m" + sent.length }; } } };
  try {
    await runDigest(env, { at: t });
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM email_topics WHERE user_id=1 AND kind='entity' AND topic_id='power-bi'").get().n, 1, "Altbestand übernommen");
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM mail_topic_follows WHERE active=1").get().n, 0);
    assert.equal(sent.length, 1);
    assert.match(sent[0].html, /Neu fuer die Woche/);
    assert.doesNotMatch(sent[0].html, /Schon verschickt/, "schon als Themen-Mail verschickt");
  } finally {
    globalThis.fetch = oldFetch;
    raw.close();
  }
});

test("One-Click-Abmeldung (List-Unsubscribe-Post) funktioniert ohne x-requested-with", async () => {
  const { db, raw } = await database();
  raw.exec("INSERT INTO email_subs(email,lang,token,confirmed,created) VALUES('member','de','de-token',1,1); INSERT INTO mail_weekly_unsub(email,token,updated) VALUES('member','wtok',1);");
  const response = await worker.fetch(new Request("https://api-dub.m365.fm/api/email/unsub?token=wtok&lang=all", { method: "POST", body: "List-Unsubscribe=One-Click" }), { DB: db, SITE: "https://www.m365.fm" }, { waitUntil() {} });
  assert.equal(response.status, 200);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM email_subs").get().n, 0);
});

test("Admin-Monatszähler meldet Warnung ab 2.500 E-Mails", async () => {
  const { db, raw } = await database();
  const month = new Date().toISOString().slice(0, 7);
  raw.prepare("INSERT INTO mail_monthly_usage(month,sent) VALUES(?,2500)").run(month);
  const request = new Request("https://api-dub.m365.fm/api/admin/mail");
  const response = await handleMail({ DB: db }, request, new URL(request.url), "/api/admin/mail", { admin: true }, (data) => new Response(JSON.stringify(data)));
  const result = await response.json();
  assert.equal(result.sentMonth, 2500);
  assert.equal(result.warning, true);
});
