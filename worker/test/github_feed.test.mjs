// GitHub-Aktivitaet (Commits, PRs, Stars aus github.com/<user>.atom) erscheint auf keiner oeffentlichen Flaeche (feedpolicy.js)
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { handleProfiles } from "../src/profiles.js";
import { handleSeo } from "../src/seo_api.js";
import { refreshFeeds } from "../src/feeds.js";
import { PRIVATE_FEED_KINDS, isPublicFeedKind, publicKindSql, publicItemSql } from "../src/feedpolicy.js";

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
        bind(...values) { args = values; return q; },
        all: async () => ({ results: st.all(...args) }),
        first: async () => st.get(...args) ?? null,
        run: async () => { const r = st.run(...args); return { meta: { changes: Number(r.changes) } }; },
      };
      return q;
    },
    async batch(stmts) { const out = []; for (const s of stmts) out.push(/^\s*SELECT/i.test(s.sql) ? await s.all() : await s.run()); return out; },
  };
  return { db, raw };
}

const SITE = "https://www.m365.fm";
const J = (data, status = 200, headers = {}) => new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json", ...headers } });

// Mitglied (1, oeffentlich) und Firma (3, oeffentlich) mit je einem GitHub- und einem YouTube-Kanal und je einem Inhalt davon
async function seeded() {
  const { db, raw } = await database(), now = Math.floor(Date.now() / 1000), body = "x".repeat(320);
  raw.exec(`
    INSERT INTO meta(k,v) VALUES('entity_source','db');
    INSERT INTO users(id,provider,sub,name,created) VALUES(1,'github','1','Mirko',1),(2,'github','2','Leser',1);
    INSERT INTO profiles(user_id,public,handle,updated) VALUES(1,1,'mirko-p',1);
    INSERT INTO orgs(id,handle,name,public,created) VALUES(3,'m365-show','M365 Show',1,1);
    INSERT INTO channels(id,owner_type,owner_id,kind,url,feed,fetched) VALUES
      (10,'u',1,'github','https://github.com/Mirko-Peters','https://github.com/Mirko-Peters.atom',0),
      (11,'u',1,'youtube','https://www.youtube.com/@m365','https://www.youtube.com/feeds/videos.xml?channel_id=UCx',${now}),
      (12,'o',3,'github','https://github.com/m365show','https://github.com/m365show.atom',0),
      (13,'o',3,'youtube','https://www.youtube.com/@m365show','https://www.youtube.com/feeds/videos.xml?channel_id=UCy',${now});
    INSERT INTO feed_items(id,channel_id,owner_type,owner_id,url,title,published,body) VALUES
      (100,10,'u',1,'https://github.com/Mirko-Peters/repo/commit/abc','Mirko-Peters pushed to main',${now - 60},'${body}'),
      (101,11,'u',1,'https://www.youtube.com/watch?v=aaaaaaaaaaa','Copilot explained',${now - 120},'${body}'),
      (102,12,'o',3,'https://github.com/m365show/site/pull/1','m365show opened a pull request',${now - 60},''),
      (103,13,'o',3,'https://www.youtube.com/watch?v=bbbbbbbbbbb','Teams tips',${now - 120},'');
  `);
  return { db, raw };
}
const call = async (env, path, user = null, init = {}) => {
  const url = new URL("https://api.example.test" + path), req = new Request(url, init);
  const res = (await handleProfiles(env, req, url, url.pathname, user, J)) || (await handleSeo(env, req, url, url.pathname, user, J));
  return { status: res.status, j: await res.json() };
};
const GH = /github/i;

test("feedpolicy: GitHub ist privat, die SQL-Bausteine nennen die Art", () => {
  assert.deepEqual([...PRIVATE_FEED_KINDS], ["github"]);
  assert.equal(isPublicFeedKind("github"), false); assert.equal(isPublicFeedKind("GitHub"), false);
  assert.equal(isPublicFeedKind("youtube"), true); assert.equal(isPublicFeedKind(""), true);
  assert.equal(publicKindSql(), "c.kind NOT IN ('github')");
  assert.match(publicItemSql("x"), /^x\.channel_id NOT IN \(SELECT id FROM channels WHERE kind IN \('github'\)\)$/);
});

test("oeffentliche APIs: Seitenbau-Export, Live-Feed (neu/top), Profil- und Firmenseite ohne GitHub-Inhalte", async () => {
  const { db, raw } = await seeded(), env = { DB: db, SITE };
  try {
    const exp = await call(env, "/api/feed/export");
    assert.equal(exp.status, 200);
    assert.deepEqual(exp.j.items.map((i) => i.id).sort(), [101, 103]);
    assert.ok(exp.j.items.every((i) => i.kind !== "github" && !GH.test(i.url)));
    for (const sort of ["new", "top"]) {
      const f = await call(env, "/api/feed?sort=" + sort);
      assert.deepEqual(f.j.items.map((i) => i.id).sort(), [101, 103], sort);
      assert.ok(f.j.items.every((i) => i.kind !== "github"), sort);
    }
    const p = await call(env, "/api/profile/mirko-p");
    assert.deepEqual(p.j.profile.items.map((i) => i.id), [101]);
    assert.ok(p.j.profile.channels.some((c) => c.kind === "github"), "GitHub bleibt als Profil-Link");
    const o = await call(env, "/api/org/m365-show");
    assert.deepEqual(o.j.org.items.map((i) => i.id), [103]);
    assert.ok(o.j.org.channels.some((c) => c.kind === "github"), "GitHub bleibt als Firmen-Link");
  } finally { raw.close(); }
});

test("Upvote auf GitHub-Inhalt: nicht gefunden; andere Inhalte weiter abstimmbar", async () => {
  const { db, raw } = await seeded(), env = { DB: db, SITE }, user = { id: 2 }, post = { method: "POST", headers: { "content-type": "application/json" } };
  try {
    assert.equal((await call(env, "/api/vote/100", user, post)).status, 404);
    assert.equal((await call(env, "/api/vote/102", user, post)).status, 404);
    const ok = await call(env, "/api/vote/101", user, post);
    assert.equal(ok.status, 200); assert.equal(ok.j.voted, true);
  } finally { raw.close(); }
});

test("eigene Inhalte (privat): Liste, Text speichern und SEO-Liste lassen GitHub-Inhalte weg (keine Seite mehr)", async () => {
  const { db, raw } = await seeded(), env = { DB: db, SITE }, user = { id: 1 };
  try {
    const mine = await call(env, "/api/feed/mine", user);
    assert.equal(mine.status, 200);
    assert.deepEqual(mine.j.items.map((i) => i.id), [101]);
    const save = await call(env, "/api/feed/text", user, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: 100, body: "" }) });
    assert.equal(save.status, 404);
    const seo = await call(env, "/api/seo/mine", user);
    assert.equal(seo.status, 200);
    assert.deepEqual(seo.j.items.filter((i) => i.kind === "feed").map((i) => i.id), [101]);
    assert.equal((await call(env, "/api/seo/check?kind=feed&id=100", user)).status, 404);
    assert.equal((await call(env, "/api/seo/check?kind=feed&id=101", user)).status, 200);
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM feed_items WHERE channel_id IN (10,12)").get().n, 2, "Zeilen bleiben in der Datenbank");
  } finally { raw.close(); }
});

test("Feed-Abruf: GitHub-Kanaele werden nicht abgerufen und loesen keine Benachrichtigung aus", async () => {
  const { db, raw } = await seeded(), now = Math.floor(Date.now() / 1000);
  raw.exec(`UPDATE channels SET fetched=0;
    INSERT INTO channels(id,owner_type,owner_id,kind,url,feed,fetched) VALUES(14,'u',1,'github','https://github.com/other','',0);
    INSERT INTO mail_addr(user_id,email,verified,token,created) VALUES(2,'test@example.invalid',1,'',1);
    INSERT INTO email_topics(user_id,kind,topic_id,lang,timezone,created) VALUES(2,'creator','mirko-p','en','UTC',1),(2,'creator','m365-show','en','UTC',1);`);
  const fetched = [], oldFetch = globalThis.fetch;
  globalThis.fetch = async (u) => {
    const s = String(u?.url || u); fetched.push(s);
    const id = s.includes("UCx") ? "ccccccccccc" : "ddddddddddd";
    return { ok: true, text: async () => `<feed><entry><title>New video ${id}</title><link rel="alternate" href="https://www.youtube.com/watch?v=${id}"/><published>2026-11-01T10:00:00Z</published></entry></feed>` };
  };
  try {
    await refreshFeeds({ DB: db, SITE });
    assert.ok(fetched.length >= 2, "YouTube-Kanaele werden abgerufen");
    assert.ok(fetched.every((u) => !GH.test(u)), "kein Abruf von github.com: " + fetched.join(" "));
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM feed_items WHERE channel_id IN (10,12,14)").get().n, 2, "keine neuen GitHub-Inhalte");
    assert.equal(raw.prepare("SELECT fetched FROM channels WHERE id=14").get().fetched, 0, "keine Feed-Suche fuer GitHub");
    const queued = raw.prepare("SELECT url FROM topic_queue").all().map((r) => r.url);
    assert.ok(queued.length >= 1 && queued.every((u) => !GH.test(u)), queued.join(" "));
  } finally { globalThis.fetch = oldFetch; raw.close(); void now; }
});
