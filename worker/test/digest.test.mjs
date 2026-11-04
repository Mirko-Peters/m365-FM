import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { conBanner } from "../src/mailer.js";
import { renderWeeklyMail, runDigest } from "../src/digest.js";
import worker from "../src/index.js";
import { handleMail } from "../src/mail.js";

async function database() {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:");
  const dir = new URL("../migrations/", import.meta.url);
  for (const file of readdirSync(dir).filter((name) => name.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(file, dir), "utf-8"));
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
    async batch(stmts) { for (const stmt of stmts) await stmt.run(); },
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

test("Wochenmail bündelt Sprachen und Antworten, überspringt leere Wochen und begrenzt je Adresse", async () => {
  const { db, raw } = await database();
  const t = Date.UTC(2026, 10, 8, 6), recent = new Date(t - 86400_000).toISOString();
  raw.exec("INSERT INTO users(id,provider,sub,name,lang,created) VALUES(1,'test','one','User','de',1); INSERT INTO mail_addr(user_id,email,verified,created) VALUES(1,'member',1,1);");
  raw.exec("INSERT INTO email_subs(email,lang,token,confirmed,created) VALUES('member','de','de-token',1,1),('member','en','en-token',1,1),('pending','de','pending-token',0,1);");
  const oldFetch = globalThis.fetch, sent = [];
  let episodes = [{ id: "old", language: "de", date: new Date(t - 10 * 86400_000).toISOString(), url: "https://www.m365.fm/de/alt", title: "Alt" }];
  globalThis.fetch = async () => ({ json: async () => ({ episodes }) });
  const env = { DB: db, SITE: "https://www.m365.fm", API: "https://api-dub.m365.fm", MAIL_FROM: "M365.FM", EMAIL: { send: async (message) => { sent.push(message); return { messageId: `mail-${sent.length}` }; } } };
  try {
    const empty = await runDigest(env, { at: t });
    assert.equal(empty.empty, 1);
    assert.equal(sent.length, 0, "leere Woche sendet nichts");

    const followsRequest = new Request("https://api-dub.m365.fm/api/mail/follows", { method: "POST", body: JSON.stringify({ eids: ["power-bi"] }) });
    const followsResponse = await handleMail(env, followsRequest, new URL(followsRequest.url), "/api/mail/follows", { id: 1 }, (data) => new Response(JSON.stringify(data)));
    assert.deepEqual(await followsResponse.json(), { ok: true, follows: ["power-bi"] });
    raw.prepare("INSERT INTO blog_posts(user_id,slug,title,lang,status,created,updated,published) VALUES(1,'topic-article','Power BI article','de','live',?,?,?)").run(Math.floor(t / 1000), Math.floor(t / 1000), Math.floor(t / 1000));
    raw.prepare("INSERT INTO content_topic(kind,item_id,eid,weight,src,created) VALUES('blog','1','power-bi',1,'admin',?)").run(Math.floor(t / 1000));
    raw.exec("INSERT INTO mail_outbox(user_id,kind,subject,html,created) VALUES(1,'reply','Antwort','<p>Neue Antwort</p>',1);");
    episodes = [
      { id: "de-new", language: "de", date: recent, url: "https://www.m365.fm/de/neu", title: "Neu auf Deutsch", summary: "Ein Satz" },
      { id: "en-new", language: "en", date: recent, url: "https://www.m365.fm/en/new", title: "New in English", summary: "One sentence" },
    ];
    const sentResult = await runDigest(env, { at: t });
    assert.equal(sentResult.sent, 1, "zwei Sprach-Abos an derselben Adresse ergeben eine Mail");
    assert.equal(sent.length, 1);
    assert.match(sent[0].html, /Neu auf Deutsch/);
    assert.match(sent[0].html, /New in English/);
    assert.match(sent[0].html, /Persönliche Hinweise/);
    assert.match(sent[0].html, /Neue Antwort auf deinen Kommentar/);
    assert.match(sent[0].html, /Neu bei deinen Themen/);
    assert.match(sent[0].html, /Power BI article/);
    assert.equal(raw.prepare("SELECT sent FROM mail_outbox WHERE user_id=1").get().sent, 1);
    assert.equal(raw.prepare("SELECT sent FROM mail_monthly_usage").get().sent, 1);

    const second = await runDigest(env, { at: t + 86400_000 });
    assert.equal(second.skipped, 1);
    assert.equal(sent.length, 1, "gleiche Adresse erhält höchstens eine Wochenmail");

    const token = raw.prepare("SELECT token FROM mail_weekly_unsub WHERE email='member'").get().token;
    const response = await worker.fetch(new Request(`https://api-dub.m365.fm/api/email/unsub?token=${token}&lang=all`), env);
    assert.equal(response.status, 200);
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM email_subs WHERE email='member' AND confirmed=1").get().n, 0);
    assert.equal(raw.prepare("SELECT on_ FROM mail_prefs WHERE user_id=1 AND kind='weekly'").get().on_, 0);
  } finally { globalThis.fetch = oldFetch; }
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
