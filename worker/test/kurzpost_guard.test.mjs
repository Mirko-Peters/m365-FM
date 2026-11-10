// Kurzposts aus dem MVP-Tracker: Schutz des oeffentlichen Feeds (Review #318). Tagesgrenze, Vertrauens-Schwelle, Eigentum, Datumsgrenzen,
// Moderation bleibt Moderation, Zurueckziehen und Loeschen, eigener Kanal uebernimmt (fremde Kurzposts bleiben), stiller erster Abruf,
// Abruf-Reihenfolge, Import. "318 Nachpruefung": zweite Runde (Uebernahme ueber Sammel-Feeds, Adress-Varianten, Hinweise, Link aendern).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { handleContributions, refreshContributions } from "../src/contributions.js";
import { parseSessionize, KURZPOST_DAY, BOT_UA } from "../src/contrib_sources.js";
import { handleProfiles, deleteUserData } from "../src/profiles.js";
import { refreshFeeds } from "../src/feeds.js";
import { mergeStatements } from "../src/identities.js";
import { handleMcp, TOOLS } from "../src/mcp.js";
import { FEED_DAYS } from "../src/feedpolicy.js";
import { sha256hex, b64u, memberOf } from "../src/util.js";

const SITE = "https://www.m365.fm", NOW = Math.floor(Date.now() / 1000), ISO = new Date(NOW * 1000).toISOString(), DAY = 86400;
const day = (t) => new Date(t * 1000).toISOString().slice(0, 10);
const ADMIN = { id: 9, admin: true };

// Anna (1): oeffentliches Profil, bestaetigtes Programm = darf Kurzposts. Ben (2): oeffentliches Profil, aber neu (10 Punkte). Carl (3): ohne Profil.
async function makeDb() {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:"), dir = new URL("../migrations/", import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(f, dir), "utf-8"));
  const db = { prepare(sql) { const st = raw.prepare(sql); let args = []; const o = { bind(...a) { args = a; return o; }, all: async () => ({ results: st.all(...args) }), first: async () => st.get(...args) ?? null,
    run: async () => { const r = st.run(...args); return { meta: { changes: Number(r.changes), last_row_id: Number(r.lastInsertRowid) } }; } }; return o; }, async batch(stmts) { for (const st of stmts) await st.run(); } };
  raw.exec("INSERT INTO users(id,provider,sub,name,created) VALUES(1,'g','1','Anna',1),(2,'g','2','Ben',1),(3,'g','3','Carl',1),(9,'g','9','Admin',1)");
  raw.exec("INSERT INTO profiles(user_id,public,handle,headline,about,company,job,country,show_org,updated) VALUES(1,1,'anna','','','','','',1,1),(2,1,'ben','','','','','',1,1)");
  raw.exec("INSERT INTO programs(owner_type,owner_id,program,verified) VALUES('u',1,'mvp',1)");
  const env = { DB: db, SITE };
  const J = (data, status = 200, headers = {}) => new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json", ...headers } });
  const via = (handler) => async (path, data, actor = { id: 1 }) => {
    const url = new URL(`https://x${path}`), res = await handler(env, new Request(url, { method: data === undefined ? "GET" : "POST", headers: { "content-type": "application/json" }, ...(data === undefined ? {} : { body: JSON.stringify(data) }) }), url, url.pathname, actor, J);
    return { s: res.status, j: await res.json() };
  };
  const one = (sql, ...a) => raw.prepare(sql).get(...a), all = (sql, ...a) => raw.prepare(sql).all(...a).map((r) => ({ ...r }));
  return { db, raw, env, J, call: via(handleContributions), prof: via(handleProfiles), one, all };
}
async function withFetch(map, fn) {   // map: url(-Anfang) -> { body, status?, headers? }; zeichnet Anfragen auf
  const orig = globalThis.fetch, calls = [];
  globalThis.fetch = async (u, init = {}) => {
    const url = String(u), h = map[url] ?? Object.entries(map).find(([k]) => url.startsWith(k))?.[1];
    calls.push({ url, headers: init.headers || {}, method: init.method || "GET" });
    if (!h) return new Response("nope", { status: 404 });
    const res = new Response(h.body ?? "", { status: h.status || 200, headers: h.headers || {} });
    Object.defineProperty(res, "url", { value: url });
    return res;
  };
  try { return await fn(calls); } finally { globalThis.fetch = orig; }
}
const links = (n, at = NOW, host = "posts.example.com") => Array.from({ length: n }, (_, i) => ({ title: `Post ${i + 1}`, url: `https://${host}/p${i + 1}`, date: day(at), summary: "One. Two." }));
const atom = (entries) => `<?xml version="1.0"?><feed xmlns="http://www.w3.org/2005/Atom"><title>F</title>${entries.map(([title, url, when = ISO]) => `<entry><title>${title}</title><id>${url}</id><link rel="alternate" href="${url}"/><published>${when}</published><summary>About ${title}.</summary></entry>`).join("")}</feed>`;
const posts = (x, where = "1=1") => x.all(`SELECT id,url,title,owner_id,channel_id,origin,hidden,published FROM feed_items WHERE ${where} ORDER BY id`);
// ein Beitrag von Hand plus Kurzpost; gibt { id, post } zurueck
async function posted(x, title, url, actor = { id: 1 }) {
  const c = await x.call("/api/contributions/manual", { title, url, kind: "blog", published: day(NOW) }, actor);
  assert.equal(c.s, 201, JSON.stringify(c.j));
  const p = await x.call("/api/contributions/review", { id: c.j.id, action: "publish" }, actor);
  assert.equal(p.s, 200, JSON.stringify(p.j));
  return { id: c.j.id, post: p.j.feed_item_id };
}

async function pushEnv(x, uid) {   // echtes VAPID-Schluesselpaar und ein Push-Abo des Mitglieds: Hinweise werden als POST an den Push-Dienst sichtbar
  const v = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign"]), e = await crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveBits"]);
  Object.assign(x.env, { VAPID_PRIVATE_JWK: JSON.stringify(await crypto.subtle.exportKey("jwk", v.privateKey)), VAPID_PUBLIC: "pub", VAPID_SUBJECT: "mailto:test@example.com" });
  x.raw.prepare("INSERT INTO push_subs(endpoint,p256dh,auth,lang,user_id,created,digest) VALUES('https://push.example.com/sub1',?,?,'en',?,1,1)")
    .run(b64u.enc(new Uint8Array(await crypto.subtle.exportKey("raw", e.publicKey))), b64u.enc(crypto.getRandomValues(new Uint8Array(16))), uid);
}
const YT = "https://www.youtube.com/feeds/videos.xml?channel_id=UCabcdefghijklmnopqrstuv", PUSH = "https://push.example.com/";

const queued = (x) => x.one("SELECT COUNT(*) n FROM topic_queue").n;
const follow = (x, handle) => x.raw.prepare("INSERT INTO push_subs(endpoint,p256dh,auth,lang,user_id,created,digest) VALUES('https://push.example.com/f','k','a','en',3,1,0)").run() && x.raw.prepare("INSERT INTO push_topics(endpoint,kind,topic_id,lang,user_id,created) VALUES('https://push.example.com/f','creator',?,'en',3,1)").run(handle);

test("318-1 Tagesgrenze: hoechstens 5 neue Kurzposts je Mitglied und Tag, ueber Import, Neu gefunden und Batch zusammen", async () => {
  const x = await makeDb();
  assert.equal(KURZPOST_DAY, 5);
  const r = await x.call("/api/contributions/import", { kind: "other", mode: "publish", items: links(8) });
  assert.equal(r.s, 201);
  assert.deepEqual([r.j.added, r.j.published, r.j.pending, r.j.held], [8, 5, 3, "post_limit"]);
  assert.match(r.j.message, /5 short posts per day/);
  assert.equal(posts(x).length, 5);
  assert.equal(x.one("SELECT COUNT(*) n FROM contributions WHERE review='pending' AND public=0 AND feed_item_id=0").n, 3, "der Rest wartet in Neu gefunden");
  // weitere Importe am selben Tag: nichts kommt dazu (vorher: 20 Aufrufe x 200 = 4000 oeffentliche Posts)
  for (let i = 0; i < 3; i++) assert.equal((await x.call("/api/contributions/import", { kind: "other", mode: "publish", items: links(50, NOW, `h${i}.example.com`) })).j.published, 0);
  assert.equal(posts(x).length, 5);
  // was ohnehin nie ein Kurzpost wird (zu alt, ohne Link), wartet auch bei erreichter Grenze nicht in Neu gefunden
  const mixed = await x.call("/api/contributions/import", { kind: "other", mode: "publish", items: [{ title: "Old one", url: "https://old.example.com/1", date: day(NOW - 200 * DAY) }, { title: "No link", url: "", date: day(NOW) }, { title: "Fresh one", url: "https://fresh.example.com/1", date: day(NOW) }] });
  assert.deepEqual([mixed.j.published, mixed.j.pending, mixed.j.unposted, mixed.j.tracked], [0, 1, 2, 2]);
  const wait = x.one("SELECT id FROM contributions WHERE review='pending' ORDER BY id").id;
  const again = await x.call("/api/contributions/review", { id: wait, action: "publish" });
  assert.deepEqual([again.s, again.j.error], [429, "post_limit"]);
  assert.equal(x.one("SELECT review FROM contributions WHERE id=?", wait).review, "pending", "bleibt in Neu gefunden");
  const batch = await x.call("/api/contributions/review-batch", { decisions: [{ id: wait, action: "publish" }], confirm: true });
  assert.deepEqual([batch.j.results[0].ok, batch.j.results[0].error], [false, "post_limit"]);
  assert.match(batch.j.results[0].message, /per day/);
  assert.equal(posts(x).length, 5);
  // die Grenze zaehlt je Mitglied
  x.raw.exec("INSERT INTO programs(owner_type,owner_id,program,verified) VALUES('u',2,'mct',1)");
  assert.equal((await x.call("/api/contributions/import", { kind: "other", mode: "publish", items: links(2, NOW, "ben.example.com") }, { id: 2 })).j.published, 2);
  // am naechsten Tag geht es weiter; ein zurueckgezogener Kurzpost verbraucht beim erneuten Veroeffentlichen nichts
  x.raw.exec("UPDATE ratelimit SET win=win-86400 WHERE k='kurzpost:1'");
  assert.equal((await x.call("/api/contributions/review", { id: wait, action: "publish" })).s, 200);
  const n = x.one("SELECT n FROM ratelimit WHERE k='kurzpost:1'").n;
  assert.equal((await x.call("/api/contributions/unpublish", { id: wait })).j.withdrawn, true);
  assert.equal((await x.call("/api/contributions/review", { id: wait, action: "publish" })).s, 200);
  assert.equal(x.one("SELECT n FROM ratelimit WHERE k='kurzpost:1'").n, n);
});

test("318-1 Vertrauens-Schwelle: neue Mitglieder veroeffentlichen nicht direkt, ihre Funde warten in Neu gefunden", async () => {
  const x = await makeDb(), ben = { id: 2 };
  assert.equal((await memberOf(x.env, 2)).pro, false);
  const imp = await x.call("/api/contributions/import", { kind: "other", mode: "publish", items: links(3) }, ben);
  assert.deepEqual([imp.s, imp.j.added, imp.j.published, imp.j.pending, imp.j.held], [201, 3, 0, 3, "not_trusted"]);
  assert.match(imp.j.message, /trusted members/);
  assert.equal(posts(x).length, 0);
  const id = x.one("SELECT id FROM contributions WHERE user_id=2 ORDER BY id").id;
  const pub = await x.call("/api/contributions/review", { id, action: "publish" }, ben);
  assert.deepEqual([pub.s, pub.j.error], [403, "not_trusted"]);
  assert.equal((await x.call("/api/contributions/review", { id, action: "track" }, ben)).s, 200, "tracken geht immer");
  // Quelle im Modus publish: wird angelegt (mit Hinweis), Neues wartet in Neu gefunden statt im Feed zu landen
  const src = await x.call("/api/contributions/source", { kind: "blog", url: "https://ben.example.com/feed.xml", mode: "publish" }, ben);
  assert.deepEqual([src.s, src.j.hint], [201, "not_trusted"]);
  assert.equal((await x.call("/api/contributions/source", { kind: "blog", url: "https://anna.example.com/feed.xml", mode: "publish" })).j.hint, undefined, "Anna bekommt keinen Hinweis");
  await withFetch({ "https://ben.example.com/feed.xml": { body: atom([["Old", "https://ben.example.com/old"]]) } }, () => refreshContributions(x.env, 5));
  x.raw.exec("UPDATE contribution_sources SET fetched=1");
  await withFetch({ "https://ben.example.com/feed.xml": { body: atom([["New", "https://ben.example.com/new"], ["Old", "https://ben.example.com/old"]]) } }, () => refreshContributions(x.env, 5));
  assert.equal(x.one("SELECT review FROM contributions WHERE url='https://ben.example.com/new'").review, "pending");
  assert.equal(posts(x).length, 0);
  // gleiche Schwelle wie bei Wiki und Entitaeten: bestaetigtes Programm, Redaktion oder 25 Punkte
  x.raw.exec("INSERT INTO programs(owner_type,owner_id,program,verified) VALUES('u',2,'mvp',0)");
  assert.equal((await x.call("/api/contributions/review", { id, action: "publish" }, ben)).s, 403, "unbestaetigtes Programm reicht nicht");
  x.raw.exec("UPDATE programs SET verified=1 WHERE owner_id=2");
  assert.equal((await x.call("/api/contributions/review", { id, action: "publish" }, ben)).s, 200);
  assert.deepEqual(posts(x).map((p) => [p.owner_id, p.origin, p.hidden]), [[2, "kurzpost", 0]]);
  // ohne oeffentliches Profil geht es auch mit Rolle nicht
  x.raw.exec("UPDATE users SET role='editor' WHERE id=3");
  const carl = await x.call("/api/contributions/import", { kind: "other", mode: "publish", items: links(1, NOW, "carl.example.com") }, { id: 3 });
  assert.deepEqual([carl.j.published, carl.j.held], [0, "profile_required"]);
});

test("318-1 Eigentum: kein Link, den schon jemand im Feed hat; keine Seiten der eigenen Website; wer zuerst da ist, behaelt den Eintrag", async () => {
  const x = await makeDb();
  x.raw.exec(`INSERT INTO channels(id,owner_type,owner_id,kind,url,feed,fetched) VALUES(700,'u',2,'youtube','https://www.youtube.com/@ben','https://www.youtube.com/feeds/videos.xml?channel_id=UCben',${NOW});
    INSERT INTO feed_items(id,channel_id,owner_type,owner_id,url,title,published) VALUES(70,700,'u',2,'https://www.youtube.com/watch?v=bbbbbbbbbbb','Ben video',${NOW - 100})`);
  const man = async (title, url) => (await x.call("/api/contributions/manual", { title, url, kind: "video", published: day(NOW) })).j.id;
  for (const [title, url] of [["Same link", "https://www.youtube.com/watch?v=bbbbbbbbbbb"], ["Short link", "https://youtu.be/bbbbbbbbbbb"], ["Music link", "https://music.youtube.com/watch?v=bbbbbbbbbbb&si=abc"], ["Embed link", "https://www.youtube-nocookie.com/embed/bbbbbbbbbbb"]]) {
    const r = await x.call("/api/contributions/review", { id: await man(title, url), action: "publish" });
    assert.deepEqual([r.s, r.j.error], [400, "url_taken"], title);
  }
  const own = await x.call("/api/contributions/review", { id: await man("Bens blog post", `${SITE}/community/u/ben/blog/hello/`), action: "publish" });
  assert.deepEqual([own.s, own.j.error], [400, "not_publishable"], "Blog, Podcast und Video der Website kommen selbst in den Feed");
  assert.equal(posts(x, "origin='kurzpost'").length, 0);
  // Anna postet einen Link, den spaeter auch Bens Kanal fuehrt: Der Eintrag bleibt bei Anna, samt eigenem Text, Themen und Stimmen. Die Feed-Adresse
  // eines Kanals ist frei eingetippt und belegt nichts - nicht einmal auf demselben Host (Kanal-Feed, Playlist, Blog mit mehreren Autoren).
  const first = await posted(x, "My great video", "https://www.youtube.com/watch?v=ccccccccccc");
  x.raw.prepare("UPDATE feed_items SET body=?, topics='[\"copilot\"]' WHERE id=?").run("x".repeat(320), first.post);
  x.raw.exec("INSERT INTO item_votes(item_id,user_id,created) VALUES(" + first.post + ",3,1); UPDATE channels SET fetched=1 WHERE id=700");
  await pushEnv(x, 2); follow(x, "ben");
  let pushes = 0;
  for (let run = 0; run < 3; run++) {
    x.raw.exec("UPDATE channels SET fetched=1 WHERE id=700");
    await withFetch({ "https://www.youtube.com/feeds/videos.xml?channel_id=UCben": { body: atom([["Ben: the real title", "https://www.youtube.com/watch?v=ccccccccccc"], ["Ben video", "https://www.youtube.com/watch?v=bbbbbbbbbbb"]]) }, [PUSH]: { status: 201 } },
      async (calls) => { await refreshFeeds(x.env); pushes += calls.filter((c) => c.url.startsWith(PUSH)).length; });
  }
  const kept = { owner_type: "u", owner_id: 1, origin: "kurzpost", title: "My great video", hidden: 0, n: 320, topics: "[\"copilot\"]" };
  assert.deepEqual({ ...x.one("SELECT owner_type,owner_id,origin,title,hidden,length(body) n,topics FROM feed_items WHERE id=?", first.post) }, kept);
  assert.deepEqual([x.one("SELECT feed_item_id FROM contributions WHERE id=?", first.id).feed_item_id, x.one("SELECT COUNT(*) n FROM item_votes WHERE item_id=?", first.post).n], [first.post, 1]);
  assert.deepEqual([pushes, queued(x), x.one("SELECT fetched>1 f, fails FROM channels WHERE id=700").f], [0, 0, 1], "kein Hinweis fuer einen Link, den ein anderer haelt; der Kanal selbst wurde gelesen");
  assert.equal((await x.prof("/api/feed/export")).j.items.find((i) => i.url.endsWith("ccccccccccc")).handle, "anna");
});

test("318 Nachpruefung: ein Kanal mit Playlist- oder Sammel-Feed zieht keine Kurzposts anderer Mitglieder an sich (echte Profil-Route)", async () => {
  const x = await makeDb();
  const video = await posted(x, "Anna's own video", "https://www.youtube.com/watch?v=aaaaaaaaaaa"), article = await posted(x, "Anna's article", "https://techcommunity.microsoft.com/blog/microsoft365copilotblog/annas-article/123");
  x.raw.prepare("UPDATE feed_items SET body=?, topics='[\"copilot\"]', keypoints='[\"k\"]', faq='[{\"q\":\"a\"}]' WHERE id IN (?,?)").run("Annas eigener Text. ".repeat(30), video.post, article.post);
  x.raw.exec(`INSERT INTO item_votes(item_id,user_id,created) VALUES(${video.post},9,1)`);
  const before = x.all("SELECT id,channel_id,owner_type,owner_id,url,title,origin,hidden,body,topics,keypoints,faq FROM feed_items ORDER BY id");
  // Ben (neu, ohne Vertrauen) traegt zwei Kanaele ein, deren Feeds Annas Links auflisten: eine YouTube-Playlist und den Feed eines Blogs mit vielen Autoren
  const PLAY = "https://www.youtube.com/feeds/videos.xml?playlist_id=PLbenplaylist", BOARD = "https://techcommunity.microsoft.com/t5/s/gxcuf89792/rss/board?board.id=Microsoft365CopilotBlog";
  const save = await withFetch({}, () => x.prof("/api/profile/me", { handle: "ben", public: true, name: "Ben", channels: [{ kind: "youtube", url: "https://www.youtube.com/@ben", feed: PLAY },
    { kind: "blog", url: "https://techcommunity.microsoft.com/category/microsoft365copilot/blog/microsoft365copilotblog", feed: BOARD }] }, { id: 2, name: "Ben" }));
  assert.equal(save.s, 200, JSON.stringify(save.j));
  assert.deepEqual(x.all("SELECT feed FROM channels WHERE owner_id=2 AND feed<>'' ORDER BY id").map((c) => c.feed), [PLAY, BOARD]);
  await pushEnv(x, 2); follow(x, "ben");
  let pushes = 0;
  for (let run = 0; run < 3; run++) {
    x.raw.exec("UPDATE channels SET fetched=1 WHERE owner_id=2");
    await withFetch({ [PLAY]: { body: atom([["Annas Video (Playlist)", "https://www.youtube.com/watch?v=aaaaaaaaaaa"]]) },
      [BOARD]: { body: atom([["Anna's article", "https://techcommunity.microsoft.com/blog/microsoft365copilotblog/annas-article/123"], ["Other", "https://techcommunity.microsoft.com/blog/microsoft365copilotblog/other/124"]]) }, [PUSH]: { status: 201 } },
      async (calls) => { await refreshFeeds(x.env); pushes += calls.filter((c) => c.url.startsWith(PUSH)).length; });
  }
  assert.deepEqual(x.all(`SELECT id,channel_id,owner_type,owner_id,url,title,origin,hidden,body,topics,keypoints,faq FROM feed_items WHERE id IN (${video.post},${article.post}) ORDER BY id`), before, "Eigentuemer, Kanal, Titel, eigener Text, Themen, Kernpunkte und FAQ unveraendert");
  assert.deepEqual(x.all("SELECT id,feed_item_id FROM contributions ORDER BY id"), [{ id: video.id, feed_item_id: video.post }, { id: article.id, feed_item_id: article.post }]);
  assert.deepEqual(x.all("SELECT item_id,user_id FROM item_votes"), [{ item_id: video.post, user_id: 9 }]);
  const exp = (await x.prof("/api/feed/export")).j.items.map((i) => [i.title, i.handle]).sort();
  assert.deepEqual(exp, [["Anna's article", "anna"], ["Anna's own video", "anna"], ["Other", "ben"]], "Ben bekommt nur, was noch niemand im Feed hat");
  assert.deepEqual(x.all("SELECT title,owner_id FROM feed_items WHERE owner_id=2"), [{ title: "Other", owner_id: 2 }]);
  assert.equal(pushes, 0, "kein Dauer-Hinweis fuer Links, die Anna haelt");
  // zurueckziehen und wieder veroeffentlichen, solange kein Kanal den Link fuehrt: Anna behaelt den Eintrag
  assert.equal((await x.call("/api/contributions/unpublish", { id: video.id })).j.withdrawn, true);
  const again = await x.call("/api/contributions/review", { id: video.id, action: "publish" });
  assert.deepEqual([again.s, again.j.feed_item_id, x.one("SELECT hidden FROM feed_items WHERE id=?", video.post).hidden], [200, video.post, 0]);
  // Folge-PR (F04): ein zurueckgezogener fremder Kurzpost gibt den Link frei - der naechste Kanal, der ihn fuehrt, bekommt ihn (wer zuerst da ist)
  assert.equal((await x.call("/api/contributions/unpublish", { id: video.id })).j.withdrawn, true);
  x.raw.exec("UPDATE channels SET fetched=1 WHERE owner_id=2");
  await withFetch({ [PLAY]: { body: atom([["Annas Video (Playlist)", "https://www.youtube.com/watch?v=aaaaaaaaaaa"]]) } }, () => refreshFeeds(x.env));
  assert.equal(x.one("SELECT COUNT(*) n FROM feed_items WHERE id=?", video.post).n, 0);
  assert.deepEqual(x.all("SELECT owner_id,origin,hidden FROM feed_items WHERE url='https://www.youtube.com/watch?v=aaaaaaaaaaa'"), [{ owner_id: 2, origin: "", hidden: 0 }]);
  assert.deepEqual([x.one("SELECT feed_item_id FROM contributions WHERE id=?", video.id).feed_item_id, x.one("SELECT COUNT(*) n FROM item_votes").n], [0, 0]);
  assert.deepEqual((await x.call("/api/contributions/review", { id: video.id, action: "publish" })).j.error, "url_taken");
});

test("318 Nachpruefung: nur die Moderation gibt einen Link frei - ein von ihr ausgeblendeter fremder Kurzpost weicht dem Kanal, die Sperre wandert nicht mit", async () => {
  const x = await makeDb(), V = "https://www.youtube.com/watch?v=bbbbbbbbbbb", FEED = "https://www.youtube.com/feeds/videos.xml?channel_id=UCben";
  x.raw.exec(`INSERT INTO channels(id,owner_type,owner_id,kind,url,feed,fetched) VALUES(700,'u',2,'youtube','https://www.youtube.com/@ben','${FEED}',1);
    INSERT INTO feed_items(id,channel_id,owner_type,owner_id,url,title,published) VALUES(70,700,'u',2,'https://www.youtube.com/watch?v=ooooooooooo','Older',${NOW - DAY})`);
  const a = await posted(x, "Bens video, posted by Anna", V);
  x.raw.prepare("UPDATE feed_items SET body=? WHERE id=?").run("x".repeat(320), a.post);
  x.raw.exec(`INSERT INTO item_votes(item_id,user_id,created) VALUES(${a.post},3,1)`);
  assert.equal((await x.prof("/api/admin/feed-hide", { id: a.post, hidden: true }, ADMIN)).s, 200);
  follow(x, "ben");
  for (let run = 0; run < 2; run++) {
    x.raw.exec("UPDATE channels SET fetched=1 WHERE id=700");
    await withFetch({ [FEED]: { body: atom([["Ben video", V], ["Older", "https://www.youtube.com/watch?v=ooooooooooo"]]) } }, () => refreshFeeds(x.env));
  }
  assert.deepEqual(x.all("SELECT title,owner_id,channel_id,origin,hidden,body FROM feed_items WHERE url=?", V), [{ title: "Ben video", owner_id: 2, channel_id: 700, origin: "", hidden: 0, body: "" }], "Bens eigenes Video ist sichtbar, ohne Annas Text");
  assert.deepEqual([x.one("SELECT COUNT(*) n FROM item_votes").n, x.one("SELECT feed_item_id FROM contributions WHERE id=?", a.id).feed_item_id, queued(x)], [0, 0, 1], "Stimmen galten dem Kurzpost; wer Ben folgt, erfaehrt einmal vom Video");
  const mine = (await x.call("/api/contributions/mine")).j.contributions.find((c) => c.id === a.id);
  assert.deepEqual([mine.posted, mine.post], [false, ""]);
  const re = await x.call("/api/contributions/review", { id: a.id, action: "publish" });
  assert.deepEqual([re.s, re.j.error], [400, "url_taken"]);
  assert.equal((await x.prof("/api/feed/export")).j.items.find((i) => i.url === V).handle, "ben");
});

test("318-2 Datum: Sekunden zwischen 1970 und 2100, im Feed nie in der Zukunft und nicht aelter als das Feed-Fenster", async () => {
  const x = await makeDb();
  for (const published of [Date.now(), String(Date.now()), "2999-01-01", "1969-12-31", -5, 4102444801, 1.5]) {
    const r = await x.call("/api/contributions/manual", { title: "Bad date", kind: "blog", published });
    assert.deepEqual([r.s, r.j.error], [400, "bad_date"], String(published));
  }
  assert.equal((await x.call("/api/contributions/import", { kind: "other", mode: "publish", items: [{ title: "ms timestamp", url: "https://a.example.com/ms", date: Date.now() }, { title: "Pinned forever", url: "https://a.example.com/pin", date: "2999-01-01" }] })).s, 400, "nichts Brauchbares dabei");
  assert.equal(x.one("SELECT COUNT(*) n FROM contributions").n, 0);
  // ein geplanter Vortrag steht mit seinem Termin im Tracker; der Kurzpost traegt hoechstens das heutige Datum
  const future = await x.call("/api/contributions/manual", { title: "Talk next month", url: "https://conf.example.com/talk", kind: "session", published: day(NOW + 30 * DAY) });
  assert.equal(future.s, 201);
  assert.ok(x.one("SELECT published FROM contributions WHERE id=?", future.j.id).published > NOW);
  assert.equal((await x.call("/api/contributions/review", { id: future.j.id, action: "publish" })).s, 200);
  const t = x.one("SELECT published FROM feed_items WHERE url='https://conf.example.com/talk'").published;
  assert.ok(t <= Math.floor(Date.now() / 1000) && t >= NOW - 5, "auf jetzt begrenzt");
  // Altbestand mit Millisekunden (vor der Pruefung angelegt) kann den Feed nicht anheften
  x.raw.prepare("INSERT INTO contributions(user_id,title,url,published,kind,created,manual) VALUES(1,'Legacy ms','https://a.example.com/legacy',?,'blog',1,1)").run(Date.now());
  assert.equal((await x.call("/api/contributions/review", { id: x.one("SELECT id FROM contributions WHERE title='Legacy ms'").id, action: "publish" })).s, 200);
  assert.ok(x.one("SELECT MAX(published) m FROM feed_items").m <= Math.floor(Date.now() / 1000));
  // aelter als das Fenster des Feeds (Export und Seitenbau zeigen nur 120 Tage): kein Kurzpost
  assert.equal(FEED_DAYS, 120);
  const old = await x.call("/api/contributions/manual", { title: "Old article", url: "https://a.example.com/old", kind: "blog", published: day(NOW - 200 * DAY) });
  const r = await x.call("/api/contributions/review", { id: old.j.id, action: "publish" });
  assert.deepEqual([r.s, r.j.error], [400, "too_old"]);
  assert.match(r.j.message, /last 120 days/);
  assert.equal(x.one("SELECT COUNT(*) n FROM feed_items WHERE url='https://a.example.com/old'").n, 0);
  const order = (await x.prof("/api/feed/export")).j.items.map((i) => i.published);
  assert.ok(order.every((p) => p <= Math.floor(Date.now() / 1000)), "nichts sortiert sich mit einem Zukunftsdatum nach oben");
});

test("318-3 Moderation: was die Redaktion ausblendet, holt das Mitglied nicht zurueck; eigenes Zurueckziehen ist ein anderer Zustand", async () => {
  const x = await makeDb();
  const a = await posted(x, "Spammy", "https://a.example.com/spam");
  assert.equal((await x.prof("/api/admin/feed-hide", { id: a.post, hidden: true }, { id: 1 })).s, 403);
  assert.equal((await x.prof("/api/admin/feed-hide", { id: a.post, hidden: true }, ADMIN)).s, 200);
  const state = () => x.one("SELECT hidden FROM feed_items WHERE id=?", a.post).hidden, mine = async (id) => (await x.call("/api/contributions/mine")).j.contributions.find((c) => c.id === id);
  assert.equal(state(), 1);
  const again = await x.call("/api/contributions/review", { id: a.id, action: "publish" });
  assert.deepEqual([again.s, again.j.error, state()], [400, "hidden_by_moderation", 1]);
  assert.deepEqual([(await mine(a.id)).posted, (await mine(a.id)).post], [false, "moderated"]);
  // Die Redaktion kann ihre Entscheidung aufheben - und wieder treffen
  assert.equal((await x.prof("/api/admin/feed-hide", { id: a.post, hidden: false }, ADMIN)).s, 200);
  assert.deepEqual([state(), (await mine(a.id)).post], [0, "live"]);
  await x.prof("/api/admin/feed-hide", { id: a.post, hidden: true }, ADMIN);
  // Moderation und Zurueckziehen sind zwei Schalter (feedpolicy.js): Zurueckziehen unter der Sperre wird vermerkt, die Sperre bleibt
  assert.deepEqual([(await x.call("/api/contributions/unpublish", { id: a.id })).j.withdrawn, state(), (await mine(a.id)).post], [true, 3, "moderated"]);
  assert.deepEqual([(await x.call("/api/contributions/review", { id: a.id, action: "publish" })).j.error, state()], ["hidden_by_moderation", 3]);
  // Loeschen und neu anlegen ist kein Umweg: die Sperre bleibt stehen, auch fuer dieselbe Seite unter leicht anderer Adresse
  x.raw.exec(`INSERT INTO item_votes(item_id,user_id,created) VALUES(${a.post},2,1)`);
  assert.equal((await x.call("/api/contributions/delete", { id: a.id })).s, 200);
  assert.equal(state(), 3);
  for (const url of ["https://a.example.com/spam", "https://a.example.com/spam/", "https://www.a.example.com/spam?utm_source=x", "https://a.example.com/Spam?fbclid=1", "https://a.example.com/spam?x=1", "https://a.example.com/spam/?page=2&utm_source=y"]) {
    const re = await x.call("/api/contributions/manual", { title: "Spammy again", url, kind: "blog", published: day(NOW) });
    assert.equal(re.s, 201, url);
    assert.equal((await x.call("/api/contributions/review", { id: re.j.id, action: "publish" })).j.error, "hidden_by_moderation", url);
    const imp = await x.call("/api/contributions/import", { kind: "other", mode: "publish", items: [{ title: "Spammy import", url: url + (url.includes("?") ? "&" : "?") + "utm_medium=m", date: day(NOW) }] });
    assert.deepEqual([imp.j.published, imp.j.pending], [0, 0], url);
  }
  assert.deepEqual([state(), posts(x, "hidden=0").length, (await x.prof("/api/feed/export")).j.items.length], [3, 0, 0]);
  // Hebt die Redaktion die Sperre auf, nachdem das Mitglied den Beitrag geloescht hatte, steht kein Kurzpost ohne Beitrag oeffentlich da
  x.raw.exec("DELETE FROM contributions");
  await x.prof("/api/admin/feed-hide", { id: a.post, hidden: false }, ADMIN);
  assert.deepEqual([state(), (await x.prof("/api/feed/export")).j.items.length], [2, 0]);
  const back = await x.call("/api/contributions/manual", { title: "Spammy, allowed again", url: "https://a.example.com/spam/", kind: "blog", published: day(NOW) });
  assert.deepEqual([(await x.call("/api/contributions/review", { id: back.j.id, action: "publish" })).j.feed_item_id, state()], [a.post, 0], "derselbe Eintrag, kein zweiter fuer dieselbe Seite");
  // eigenes Zurueckziehen: nur das Mitglied macht es rueckgaengig - die Redaktion blendet es weder direkt noch mit Aus- und Einblenden wieder ein
  const b = await posted(x, "Mine", "https://a.example.com/mine");
  assert.equal((await x.call("/api/contributions/unpublish", { id: b.id })).j.withdrawn, true);
  assert.equal((await x.call("/api/contributions/unpublish", { id: b.id })).j.withdrawn, false, "war schon zurueckgezogen");
  const hb = () => x.one("SELECT hidden FROM feed_items WHERE id=?", b.post).hidden;
  assert.deepEqual([hb(), (await mine(b.id)).post, (await mine(b.id)).posted], [2, "withdrawn", false]);
  assert.ok(!(await x.prof("/api/feed/export")).j.items.some((i) => i.url === "https://a.example.com/mine"));
  await x.prof("/api/admin/feed-hide", { id: b.post, hidden: false }, ADMIN);
  assert.equal(hb(), 2);
  await x.prof("/api/admin/feed-hide", { id: b.post, hidden: true }, ADMIN);
  assert.deepEqual([hb(), (await mine(b.id)).post], [3, "moderated"]);
  await x.prof("/api/admin/feed-hide", { id: b.post, hidden: false }, ADMIN);
  assert.deepEqual([hb(), (await mine(b.id)).post], [2, "withdrawn"], "Aus- und Einblenden veroeffentlicht nichts, was das Mitglied zurueckgezogen hat");
  assert.ok(!(await x.prof("/api/feed/export")).j.items.some((i) => i.url === "https://a.example.com/mine"));
  assert.equal((await x.call("/api/contributions/review", { id: b.id, action: "publish" })).s, 200);
  assert.deepEqual([hb(), (await mine(b.id)).post], [0, "live"]);
  // Wo der Parameter die Seite bestimmt, sperrt ein ausgeblendeter Eintrag nicht die anderen Seiten; auch die Startseite sperrt nicht alles darunter
  const q1 = await posted(x, "Query page 1", "https://q.example.com/?p=1"), q0 = await posted(x, "Start page", "https://r.example.com/"), q3 = await posted(x, "Thread 5", "https://f.example.com/viewtopic.php?t=5");
  for (const p of [q1, q0, q3]) await x.prof("/api/admin/feed-hide", { id: p.post, hidden: true }, ADMIN);
  x.raw.exec("DELETE FROM ratelimit WHERE k='kurzpost:1'");
  for (const url of ["https://q.example.com/?p=2", "https://r.example.com/?p=2", "https://r.example.com/article", "https://f.example.com/viewtopic.php?t=6"]) {
    const c = await x.call("/api/contributions/manual", { title: "Another page", url, kind: "blog", published: day(NOW) });
    assert.equal((await x.call("/api/contributions/review", { id: c.j.id, action: "publish" })).s, 200, url);
  }
  for (const url of ["https://q.example.com/?p=1&utm_source=a", "https://r.example.com/?utm_source=a", "https://f.example.com/viewtopic.php?t=5&ref=x"]) {
    const c = await x.call("/api/contributions/manual", { title: "Same page", url, kind: "blog", published: day(NOW) });
    assert.equal((await x.call("/api/contributions/review", { id: c.j.id, action: "publish" })).j.error, "hidden_by_moderation", url);
  }
  // gezogener Eintrag eines eigenen Profil-Kanals: der Tracker fasst ihn nicht an, weder sichtbar noch ausgeblendet
  x.raw.exec(`INSERT INTO channels(id,owner_type,owner_id,kind,url,feed,fetched) VALUES(600,'u',1,'youtube','https://www.youtube.com/@anna','https://www.youtube.com/feeds/videos.xml?channel_id=UCanna',${NOW});
    INSERT INTO feed_items(id,channel_id,owner_type,owner_id,url,title,published,hidden) VALUES(61,600,'u',1,'https://www.youtube.com/watch?v=aaaaaaaaaaa','Hidden video',${NOW - 50},1),(62,600,'u',1,'https://www.youtube.com/watch?v=eeeeeeeeeee','Visible video',${NOW - 50},0)`);
  for (const url of ["https://www.youtube.com/watch?v=aaaaaaaaaaa", "https://youtu.be/aaaaaaaaaaa", "https://www.youtube.com/watch?v=aaaaaaaaaaa&t=5", "https://www.youtube.com/embed/aaaaaaaaaaa", "https://www.youtube.com/live/aaaaaaaaaaa",
    "https://music.youtube.com/watch?v=aaaaaaaaaaa", "https://www.youtube-nocookie.com/embed/aaaaaaaaaaa", "https://youtube.com/watch?v=aaaaaaaaaaa", "https://m.youtube.com/watch?v=aaaaaaaaaaa&feature=share", "https://www.youtube.com/shorts/aaaaaaaaaaa"]) {
    const c1 = await x.call("/api/contributions/manual", { title: "Hidden video", url, kind: "video", published: day(NOW) });
    assert.equal((await x.call("/api/contributions/review", { id: c1.j.id, action: "publish" })).j.error, "hidden_by_moderation", url);
  }
  const c2 = await x.call("/api/contributions/manual", { title: "Visible video", url: "https://youtu.be/eeeeeeeeeee", kind: "video", published: day(NOW) });
  const r2 = await x.call("/api/contributions/review", { id: c2.j.id, action: "publish" });
  assert.deepEqual([r2.s, r2.j.error], [400, "already_in_feed"]);
  assert.deepEqual(x.all("SELECT id,hidden,origin FROM feed_items WHERE id IN (61,62) ORDER BY id"), [{ id: 61, hidden: 1, origin: "" }, { id: 62, hidden: 0, origin: "" }]);
  assert.equal(x.one("SELECT COUNT(*) n FROM feed_items WHERE url='https://youtu.be/eeeeeeeeeee'").n, 0, "kein zweiter Eintrag fuer dasselbe Video");
});

test("318-4 Zurueckziehen und Loeschen: der Kurzpost geht mit dem Beitrag; Oberflaeche und MCP koennen zurueckziehen", async () => {
  const x = await makeDb();
  // drei Wege, einen Beitrag loszuwerden: Loeschen, Ignorieren, Quelle samt Importen loeschen
  const a = await posted(x, "Post A", "https://a.example.com/a"), b = await posted(x, "Post B", "https://a.example.com/b");
  const imp = await x.call("/api/contributions/import", { kind: "linkedin", mode: "publish", items: [{ title: "Post C", url: "https://www.linkedin.com/pulse/post-c", date: day(NOW) }] });
  assert.equal(imp.j.published, 1);
  const cPost = x.one("SELECT id FROM feed_items WHERE url='https://www.linkedin.com/pulse/post-c'").id;
  x.raw.exec(`INSERT INTO item_votes(item_id,user_id,created) VALUES(${a.post},2,1),(${b.post},2,1),(${cPost},2,1)`);
  assert.equal((await x.prof("/api/feed/export")).j.items.length, 3);
  x.raw.exec("INSERT INTO export_cache(k,v,updated) VALUES('profiles','{}',1)");
  assert.equal((await x.call("/api/contributions/delete", { id: a.id })).s, 200);
  assert.equal(x.one("SELECT COUNT(*) n FROM export_cache WHERE k='profiles'").n, 0, "Profil-Zwischenspeicher zeigt den Kurzpost nicht weiter");
  assert.equal((await x.call("/api/contributions/review", { id: b.id, action: "ignore" })).s, 200);
  assert.equal((await x.call("/api/contributions/source/delete", { id: imp.j.source_id, delete_contributions: true })).s, 200);
  assert.deepEqual([x.one("SELECT COUNT(*) n FROM contributions").n, posts(x).length, x.one("SELECT COUNT(*) n FROM item_votes").n], [0, 0, 0]);
  assert.deepEqual((await x.prof("/api/feed/export")).j.items, []);
  // gezogene Eintraege eigener Kanaele bleiben beim Loeschen des Tracker-Eintrags stehen
  x.raw.exec(`INSERT INTO channels(id,owner_type,owner_id,kind,url,feed,fetched) VALUES(600,'u',1,'blog','https://anna.example.com/','https://anna.example.com/feed.xml',${NOW});
    INSERT INTO feed_items(id,channel_id,owner_type,owner_id,url,title,published) VALUES(61,600,'u',1,'https://anna.example.com/pulled','Pulled',${NOW - 50});
    INSERT INTO contributions(id,user_id,title,url,published,kind,created,feed_item_id) VALUES(900,1,'Pulled','https://anna.example.com/pulled',${NOW},'blog',1,61)`);
  assert.equal((await x.call("/api/contributions/delete", { id: 900 })).s, 200);
  assert.equal(x.one("SELECT COUNT(*) n FROM feed_items WHERE id=61").n, 1);
  // zurueckziehen und wieder veroeffentlichen; Stimmen und eigener Text bleiben am Eintrag
  const d = await posted(x, "Post D", "https://a.example.com/d");
  x.raw.prepare("UPDATE feed_items SET body=? WHERE id=?").run("y".repeat(320), d.post);
  const mine = async () => (await x.call("/api/contributions/mine")).j.contributions.find((c) => c.id === d.id);
  assert.deepEqual([(await mine()).posted, (await mine()).post], [true, "live"]);
  assert.equal((await x.call("/api/contributions/unpublish", { id: d.id }, { id: 2 })).s, 404, "nur der Eigentuemer");
  assert.equal((await x.call("/api/contributions/unpublish", { id: d.id }, null)).s, 401);
  const un = await x.call("/api/contributions/unpublish", { id: d.id });
  assert.deepEqual([un.s, un.j.withdrawn], [200, true]);
  assert.ok(!(await x.prof("/api/feed/export")).j.items.some((i) => i.url === "https://a.example.com/d"));
  assert.equal((await mine()).post, "withdrawn");
  assert.equal((await x.call("/api/contributions/review", { id: d.id, action: "publish" })).j.feed_item_id, d.post, "derselbe Eintrag, keine neue Seite");
  assert.equal(x.one("SELECT length(body) n FROM feed_items WHERE id=?", d.post).n, 320);
  // der Link eines veroeffentlichten Beitrags aendert sich nicht unter dem Kurzpost weg; der Titel wandert mit
  const ch = await x.call("/api/contributions/update", { id: d.id, url: "https://a.example.com/other" });
  assert.deepEqual([ch.s, ch.j.error], [400, "posted"]);
  assert.equal((await x.call("/api/contributions/update", { id: d.id, title: "Post D, better" })).s, 200);
  assert.equal(x.one("SELECT title FROM feed_items WHERE id=?", d.post).title, "Post D, better");
  // MCP: unpublish_contribution ueber die Bruecke
  const tool = TOOLS.find((t) => t.name === "unpublish_contribution");
  assert.deepEqual([tool.route, tool.write, !!tool.de], [["POST", "/api/contributions/unpublish"], true, true]);
  const token = "m365_testtoken";
  x.raw.prepare("INSERT INTO api_tokens(hash,user_id,created) VALUES(?,1,1)").run(await sha256hex(token));
  const dispatch = (req, user) => { const u = new URL(req.url); return handleContributions(x.env, req, u, u.pathname, user, x.J); };
  const rpc = async (name, args) => JSON.parse((await (await handleMcp(x.env, new Request("https://x/mcp", { method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name, arguments: args } }) }), (id) => memberOf(x.env, id), dispatch)).json()).result.content[0].text);
  assert.deepEqual(await rpc("unpublish_contribution", { id: d.id }), { ok: true, action: "unpublish", withdrawn: true });
  assert.equal(x.one("SELECT hidden FROM feed_items WHERE id=?", d.post).hidden, 2);
  assert.equal((await rpc("list_my_contributions", {})).contributions.find((c) => c.id === d.id).post, "withdrawn");
  assert.equal((await rpc("delete_contribution", { id: d.id })).ok, true);
  assert.equal(x.one("SELECT COUNT(*) n FROM feed_items WHERE id=?", d.post).n, 0, "auch ein zurueckgezogener Kurzpost bleibt nicht liegen");
});

test("318 Nachpruefung: der Link eines Beitrags laesst sich aendern, sobald der Kurzpost zurueckgezogen ist; die Meldung sagt, was zu tun ist", async () => {
  const x = await makeDb();
  const a = await posted(x, "Title one", "https://t.example.com/1");
  x.raw.exec(`INSERT INTO item_votes(item_id,user_id,created) VALUES(${a.post},2,1)`);
  const live = await x.call("/api/contributions/update", { id: a.id, url: "https://t.example.com/other" });
  assert.deepEqual([live.s, live.j.error], [400, "posted"]);
  assert.match(live.j.message, /Take the short post back first/);
  assert.equal((await x.call("/api/contributions/update", { id: a.id, url: "https://t.example.com/1", title: "Title two" })).s, 200, "derselbe Link ist keine Aenderung");
  assert.equal(x.one("SELECT title FROM feed_items WHERE id=?", a.post).title, "Title two");
  assert.equal((await x.call("/api/contributions/unpublish", { id: a.id })).j.withdrawn, true);
  // ein Link, den schon ein anderer eigener Beitrag hat, aendert nichts - auch der zurueckgezogene Kurzpost bleibt
  const other = await x.call("/api/contributions/manual", { title: "Other entry", url: "https://t.example.com/taken", kind: "blog", published: day(NOW) });
  assert.equal((await x.call("/api/contributions/update", { id: a.id, url: "https://t.example.com/taken" })).j.error, "contribution_exists");
  assert.deepEqual([x.one("SELECT hidden FROM feed_items WHERE id=?", a.post).hidden, x.one("SELECT feed_item_id f FROM contributions WHERE id=?", a.id).f], [2, a.post]);
  // jetzt mit freiem Link: der zurueckgezogene Kurzpost entfaellt samt Stimmen, der Beitrag ist wieder frei
  const moved = await x.call("/api/contributions/update", { id: a.id, url: "https://t.example.com/other/?utm_source=x" });
  assert.equal(moved.s, 200, JSON.stringify(moved.j));
  assert.deepEqual({ ...x.one("SELECT url,canon,feed_item_id FROM contributions WHERE id=?", a.id) }, { url: "https://t.example.com/other/?utm_source=x", canon: "t.example.com/other", feed_item_id: 0 });
  assert.deepEqual([posts(x).length, x.one("SELECT COUNT(*) n FROM item_votes").n], [0, 0]);
  const mine = async (id) => (await x.call("/api/contributions/mine")).j.contributions.find((c) => c.id === id);
  assert.deepEqual([(await mine(a.id)).post, (await mine(a.id)).posted], ["", false]);
  const re = await x.call("/api/contributions/review", { id: a.id, action: "publish" });
  assert.equal(re.s, 200);
  assert.deepEqual(posts(x).map((p) => [p.url, p.hidden]), [["https://t.example.com/other/?utm_source=x", 0]]);
  // unter einer Sperre der Moderation: der Beitrag loest sich, die Sperre bleibt fuer den alten Link stehen (und gilt als zurueckgezogen)
  await x.prof("/api/admin/feed-hide", { id: re.j.feed_item_id, hidden: true }, ADMIN);
  assert.equal((await x.call("/api/contributions/update", { id: a.id, url: "https://t.example.com/third" })).s, 200);
  assert.deepEqual([x.one("SELECT feed_item_id f FROM contributions WHERE id=?", a.id).f, x.one("SELECT hidden FROM feed_items WHERE id=?", re.j.feed_item_id).hidden], [0, 3]);
  assert.equal((await x.call("/api/contributions/update", { id: other.j.id, url: "https://t.example.com/other" })).s, 200);
  assert.equal((await x.call("/api/contributions/review", { id: other.j.id, action: "publish" })).j.error, "hidden_by_moderation", "der alte Link bleibt gesperrt, auch ohne Tracking-Parameter");
  assert.equal((await x.call("/api/contributions/review", { id: a.id, action: "publish" })).s, 200);
  assert.deepEqual(posts(x, "hidden=0").map((p) => p.url), ["https://t.example.com/third"]);
  assert.equal((await x.call("/api/contributions/update", { id: a.id, url: "https://t.example.com/fourth" }, { id: 2 })).s, 404);
  // Oberflaeche: die Detailansicht (mvp-tracker.js) zeigt fuer posted den Text aus mvp-sources.js statt "Fehler"
  const tracker = readFileSync(new URL("../../assets/mvp-tracker.js", import.meta.url), "utf-8"), sources = readFileSync(new URL("../../assets/mvp-sources.js", import.meta.url), "utf-8");
  const errText = new Function("window", "t", /function errText\(j\) \{[\s\S]*?\n  \}/.exec(tracker)[0] + "; return errText;");
  const strings = { e_posted: /e_posted: "(Dieser Beitrag[^"]+)"/.exec(sources)[1] };
  assert.match(errText({ M365MVPSources: { strings } }, (k) => `[${k}]`)(live.j), /^Dieser Beitrag steht als Kurzpost .* Zieh den Kurzpost zuerst zurück/);
  assert.equal(errText({ M365MVPSources: { strings } }, (k) => `[${k}]`)({ error: "bad_date" }), "[e_date]");
  assert.equal(errText({}, (k) => `[${k}]`)({ error: "posted" }), "[error]", "ohne nachgeladenes Skript bleibt die allgemeine Meldung");
  assert.match(TOOLS.find((t) => t.name === "update_contribution").description, /error posted\) until you take the post back with unpublish_contribution/);
});

test("318 Nachpruefung: dieselbe Seite unter zwei Adressen ist ein Kurzpost; er bleibt, solange noch ein Beitrag an ihm haengt", async () => {
  const x = await makeDb();
  const a = await posted(x, "Vid long", "https://www.youtube.com/watch?v=ccccccccccc&t=5"), b = await posted(x, "Vid short", "https://youtu.be/ccccccccccc"), c = await posted(x, "Vid music", "https://music.youtube.com/watch?v=ccccccccccc&si=abc");
  const d = await posted(x, "Page", "https://p.example.com/page"), e = await posted(x, "Page again", "https://www.p.example.com/page/?utm_campaign=x#top");
  assert.deepEqual([b.post, c.post, e.post], [a.post, a.post, d.post]);
  assert.equal(posts(x).length, 2);
  assert.equal(x.one("SELECT n FROM ratelimit WHERE k='kurzpost:1'").n, 2, "nur neue Eintraege zaehlen gegen die Tagesgrenze");
  x.raw.prepare("UPDATE feed_items SET body=? WHERE id=?").run("y".repeat(320), a.post);
  x.raw.exec(`INSERT INTO item_votes(item_id,user_id,created) VALUES(${a.post},2,1)`);
  assert.equal((await x.call("/api/contributions/delete", { id: a.id })).s, 200);
  assert.equal((await x.call("/api/contributions/review", { id: b.id, action: "ignore" })).s, 200);
  assert.deepEqual({ ...x.one("SELECT hidden,length(body) n,(SELECT COUNT(*) FROM item_votes v WHERE v.item_id=feed_items.id) votes FROM feed_items WHERE id=?", a.post) }, { hidden: 0, n: 320, votes: 1 }, "der dritte Beitrag haelt den Kurzpost");
  assert.equal((await x.call("/api/contributions/mine")).j.contributions.find((k) => k.id === c.id).post, "live");
  assert.equal((await x.call("/api/contributions/delete", { id: c.id })).s, 200);
  assert.deepEqual(posts(x).map((p) => p.id), [d.post]);
  assert.equal(x.one("SELECT COUNT(*) n FROM item_votes").n, 0);
});

test("318 Nachpruefung: wer dem Creator folgt, erfaehrt von Inhalten, die zuerst als Kurzpost kamen - einmal, ohne 'Neuer Inhalt gezogen'", async () => {
  for (const withSource of [false, true]) {
    const x = await makeDb(), NEW = "https://www.youtube.com/watch?v=nnnnnnnnnnn", OLD = "https://www.youtube.com/watch?v=ooooooooooo", old = new Date((NOW - 5 * DAY) * 1000).toISOString();
    await pushEnv(x, 1); follow(x, "anna");
    x.raw.exec(`INSERT INTO channels(id,owner_type,owner_id,kind,url,feed,fetched) VALUES(600,'u',1,'youtube','https://www.youtube.com/channel/UCabcdefghijklmnopqrstuv','${YT}',1);
      INSERT INTO feed_items(id,channel_id,owner_type,owner_id,url,title,published) VALUES(60,600,'u',1,'${OLD}','Older video',${NOW - 5 * DAY})`);
    if (withSource) {   // die Quelle im Modus publish sieht das neue Video vor dem Profil-Kanal
      await x.call("/api/contributions/source", { kind: "youtube", url: "https://www.youtube.com/channel/UCabcdefghijklmnopqrstuv", mode: "publish" });
      await withFetch({ [YT]: { body: atom([["Older video", OLD, old]]) } }, () => refreshContributions(x.env, 5));
      x.raw.exec("UPDATE contribution_sources SET fetched=1");
      await withFetch({ [YT]: { body: atom([["Brand new video", NEW], ["Older video", OLD, old]]) } }, () => refreshContributions(x.env, 5));
      assert.equal(x.one("SELECT origin FROM feed_items WHERE url=?", NEW).origin, "kurzpost");
      assert.equal(queued(x), 0, "der Kurzpost selbst loest keinen Hinweis aus");
    }
    let pushes = 0;
    for (let run = 0; run < 3; run++) {
      x.raw.exec("UPDATE channels SET fetched=1 WHERE id=600");
      await withFetch({ [YT]: { body: atom([["Brand new video", NEW], ["Older video", OLD, old]]) }, [PUSH]: { status: 201 } }, async (calls) => { await refreshFeeds(x.env); pushes += calls.filter((c) => c.url.startsWith(PUSH)).length; });
      assert.equal(queued(x), 1, `Lauf ${run + 1}, Quelle zuerst: ${withSource}`);
    }
    assert.deepEqual({ ...x.one("SELECT kind,topic_id,item_key,url FROM topic_queue") }, { kind: "creator", topic_id: "anna", item_key: `feed:${NEW}`, url: NEW });
    assert.equal(pushes, withSource ? 0 : 1, "nur wirklich neu Gezogenes meldet sich beim Creator");
    assert.deepEqual(x.all("SELECT channel_id,origin FROM feed_items WHERE url=?", NEW), [{ channel_id: 600, origin: "" }]);
  }
  // Der Kanal uebernimmt den eigenen Kurzpost auch, wenn er dieselbe Seite unter leicht anderer Adresse fuehrt: ein Eintrag, mit der Adresse aus dem Feed.
  // Ausgeblendetes bleibt ausgeblendet und meldet sich nicht; ein neuer Kanal (erster Abruf) meldet gar nichts.
  const x = await makeDb(), FEED = "https://anna.example.com/feed.xml";
  follow(x, "anna");
  x.raw.exec(`INSERT INTO channels(id,owner_type,owner_id,kind,url,feed,fetched) VALUES(610,'u',1,'blog','https://anna.example.com/','${FEED}',1);
    INSERT INTO feed_items(id,channel_id,owner_type,owner_id,url,title,published) VALUES(61,610,'u',1,'https://anna.example.com/old','Old',${NOW - DAY})`);
  const a = await posted(x, "Post A", "https://www.anna.example.com/a/?utm_source=newsletter"), b = await posted(x, "Post B", "https://anna.example.com/b"), w = await posted(x, "Post W", "https://anna.example.com/w/");
  await x.prof("/api/admin/feed-hide", { id: b.post, hidden: true }, ADMIN);
  await x.call("/api/contributions/unpublish", { id: w.id });
  x.raw.prepare("UPDATE feed_items SET body=? WHERE id=?").run("y".repeat(320), a.post);
  for (let run = 0; run < 2; run++) {
    x.raw.exec("UPDATE channels SET fetched=1 WHERE id=610");
    await withFetch({ [FEED]: { body: atom([["Post A (feed)", "https://anna.example.com/a"], ["Post B (feed)", "https://anna.example.com/b"], ["Post W (feed)", "https://anna.example.com/w"], ["Old", "https://anna.example.com/old"]]) } }, () => refreshFeeds(x.env));
  }
  assert.deepEqual(x.all("SELECT id,url,channel_id,origin,hidden,length(body) n FROM feed_items WHERE id<>61 ORDER BY id"), [
    { id: a.post, url: "https://anna.example.com/a", channel_id: 610, origin: "", hidden: 0, n: 320 },
    { id: b.post, url: "https://anna.example.com/b", channel_id: 610, origin: "", hidden: 1, n: 0 },
    { id: w.post, url: "https://anna.example.com/w", channel_id: 610, origin: "", hidden: 0, n: 0 }], "zurueckgezogen war der Kurzpost, nicht der Kanal-Inhalt; die Sperre bleibt");
  assert.deepEqual(x.all("SELECT url FROM topic_queue ORDER BY url").map((r) => r.url), ["https://anna.example.com/a", "https://anna.example.com/w"]);
  assert.equal((await x.call("/api/contributions/review", { id: a.id, action: "publish" })).j.error, "already_in_feed");
  assert.equal((await x.call("/api/contributions/review", { id: b.id, action: "publish" })).j.error, "hidden_by_moderation");
  // Ein Feed-Eintrag, der aelter ist als die Aufbewahrung (400 Tage), wird nach jedem Lauf wieder geloescht - er meldet sich nicht jedes Mal als neu
  await pushEnv(x, 1);
  let pushes = 0;
  for (let run = 0; run < 3; run++) {
    x.raw.exec("UPDATE channels SET fetched=1 WHERE id=610");
    await withFetch({ [FEED]: { body: atom([["Old", "https://anna.example.com/old"], ["Ancient", "https://anna.example.com/ancient", new Date((NOW - 500 * DAY) * 1000).toISOString()]]) }, [PUSH]: { status: 201 } },
      async (calls) => { await refreshFeeds(x.env); pushes += calls.filter((c) => c.url.startsWith(PUSH)).length; });
  }
  assert.deepEqual([pushes, queued(x), x.one("SELECT COUNT(*) n FROM feed_items WHERE url LIKE '%/ancient'").n, x.one("SELECT fails FROM channels WHERE id=610").fails], [0, 2, 0, 0]);
});

test("318-5 Derselbe Feed als Profil-Kanal und als Quelle: der Kanal uebernimmt den Kurzpost, kein Hinweis alle 30 Minuten", async () => {
  const x = await makeDb();
  await pushEnv(x, 1);
  x.raw.exec(`INSERT INTO channels(id,owner_type,owner_id,kind,url,feed,fetched) VALUES(600,'u',1,'youtube','https://www.youtube.com/channel/UCabcdefghijklmnopqrstuv','${YT}',${NOW});
    INSERT INTO feed_items(id,channel_id,owner_type,owner_id,url,title,published) VALUES(60,600,'u',1,'https://www.youtube.com/watch?v=ooooooooooo','Older video',${NOW - 5 * DAY})`);
  assert.equal((await x.call("/api/contributions/source", { kind: "youtube", url: "https://www.youtube.com/channel/UCabcdefghijklmnopqrstuv", mode: "publish" })).s, 201);
  const feed1 = atom([["Older video", "https://www.youtube.com/watch?v=ooooooooooo", new Date((NOW - 5 * DAY) * 1000).toISOString()]]);
  const feed2 = atom([["Brand new video", "https://www.youtube.com/watch?v=nnnnnnnnnnn"], ["Older video", "https://www.youtube.com/watch?v=ooooooooooo", new Date((NOW - 5 * DAY) * 1000).toISOString()]]);
  await withFetch({ [YT]: { body: feed1 } }, () => refreshContributions(x.env, 5));
  assert.equal(posts(x, "origin='kurzpost'").length, 0);
  // die Quelle sieht das neue Video zuerst: Kurzpost im Blog-Kanal
  x.raw.exec("UPDATE contribution_sources SET fetched=1");
  await withFetch({ [YT]: { body: feed2 } }, () => refreshContributions(x.env, 5));
  const kp = x.one("SELECT id,channel_id,origin FROM feed_items WHERE url LIKE '%nnnnnnnnnnn'");
  assert.equal(kp.origin, "kurzpost");
  assert.notEqual(kp.channel_id, 600);
  const cid = x.one("SELECT id FROM contributions WHERE url LIKE '%nnnnnnnnnnn'").id;
  x.raw.prepare("UPDATE feed_items SET hidden=2 WHERE id=?").run(kp.id);   // selbst zurueckgezogen: als Kanal-Inhalt gilt wieder der Kanal
  // danach zieht der Profil-Kanal dasselbe Video: der Eintrag wandert zum YouTube-Kanal, und das genau einmal
  let pushes = 0;
  for (let run = 0; run < 4; run++) {
    x.raw.exec("UPDATE channels SET fetched=1 WHERE id=600");
    await withFetch({ [YT]: { body: feed2 }, [PUSH]: { status: 201 } }, async (calls) => { await refreshFeeds(x.env); pushes += calls.filter((c) => c.url.startsWith(PUSH)).length; if (!run) assert.equal(calls.find((c) => c.url === YT).headers["user-agent"], BOT_UA); });
    assert.deepEqual({ ...x.one("SELECT channel_id,origin,hidden,owner_id FROM feed_items WHERE id=?", kp.id) }, { channel_id: 600, origin: "", hidden: 0, owner_id: 1 }, `Lauf ${run + 1}`);
  }
  assert.equal(pushes, 0, "das Video war dem Mitglied schon bekannt: kein 'Neuer Inhalt gezogen', schon gar nicht bei jedem Lauf");
  assert.equal(x.one("SELECT COUNT(*) n FROM feed_items WHERE url LIKE '%nnnnnnnnnnn'").n, 1);
  const exp = (await x.prof("/api/feed/export")).j.items.find((i) => i.url.endsWith("nnnnnnnnnnn"));
  assert.deepEqual([exp.kind, exp.origin], ["youtube", ""], "Seite als YouTube-Video, nicht als Blog-Kurzpost");
  const mine = (await x.call("/api/contributions/mine")).j.contributions.find((c) => c.id === cid);
  assert.deepEqual([mine.posted, mine.post], [false, ""]);
  assert.equal((await x.call("/api/contributions/review", { id: cid, action: "publish" })).j.error, "already_in_feed");
  assert.equal((await x.call("/api/contributions/delete", { id: cid })).s, 200);
  assert.equal(x.one("SELECT COUNT(*) n FROM feed_items WHERE id=?", kp.id).n, 1, "der gezogene Eintrag gehoert dem Kanal");
  // wirklich Neues loest den Hinweis weiter aus, einmal
  const feed3 = atom([["Third video", "https://www.youtube.com/watch?v=ttttttttttt"], ["Brand new video", "https://www.youtube.com/watch?v=nnnnnnnnnnn"]]);
  for (let run = 0; run < 2; run++) {
    x.raw.exec("UPDATE channels SET fetched=1 WHERE id=600");
    await withFetch({ [YT]: { body: feed3 }, [PUSH]: { status: 201 } }, async (calls) => { await refreshFeeds(x.env); pushes += calls.filter((c) => c.url.startsWith(PUSH)).length; });
  }
  assert.equal(pushes, 1);
});

test("318-5 Andere Reihenfolge und fremde Kanaele: kein doppelter Eintrag, kein Dauer-Hinweis fuer eine URL, die ein anderer Kanal haelt", async () => {
  const x = await makeDb();
  await pushEnv(x, 1);
  x.raw.exec(`INSERT INTO channels(id,owner_type,owner_id,kind,url,feed,fetched) VALUES(600,'u',1,'youtube','https://www.youtube.com/channel/UCabcdefghijklmnopqrstuv','${YT}',1);
    INSERT INTO feed_items(id,channel_id,owner_type,owner_id,url,title,published) VALUES(60,600,'u',1,'https://www.youtube.com/watch?v=ooooooooooo','Older video',${NOW - 5 * DAY})`);
  await x.call("/api/contributions/source", { kind: "youtube", url: "https://www.youtube.com/channel/UCabcdefghijklmnopqrstuv", mode: "publish" });
  await withFetch({ [YT]: { body: atom([["Older video", "https://www.youtube.com/watch?v=ooooooooooo"]]) } }, () => refreshContributions(x.env, 5));
  const feed = atom([["Brand new video", "https://www.youtube.com/watch?v=nnnnnnnnnnn"], ["Older video", "https://www.youtube.com/watch?v=ooooooooooo"]]);
  // der Profil-Kanal zieht zuerst, die Quelle findet das Video danach: getrackt, aber kein Kurzpost und nicht in Neu gefunden
  await withFetch({ [YT]: { body: feed }, [PUSH]: { status: 201 } }, async (calls) => { await refreshFeeds(x.env); assert.equal(calls.filter((c) => c.url.startsWith(PUSH)).length, 1); });
  x.raw.exec("UPDATE contribution_sources SET fetched=1");
  await withFetch({ [YT]: { body: feed } }, () => refreshContributions(x.env, 5));
  assert.deepEqual(x.all("SELECT channel_id,origin FROM feed_items WHERE url LIKE '%nnnnnnnnnnn'"), [{ channel_id: 600, origin: "" }]);
  assert.deepEqual({ ...x.one("SELECT review,feed_item_id FROM contributions WHERE url LIKE '%nnnnnnnnnnn'") }, { review: "", feed_item_id: 0 });
  // Bens Kanal fuehrt dieselbe URL: sie bleibt bei Anna (wer zuerst zieht), und Ben bekommt nicht bei jedem Lauf einen Hinweis
  x.raw.exec(`INSERT INTO channels(id,owner_type,owner_id,kind,url,feed,fetched) VALUES(700,'u',2,'blog','https://ben.example.com/','https://ben.example.com/feed.xml',1);
    INSERT INTO feed_items(id,channel_id,owner_type,owner_id,url,title,published) VALUES(70,700,'u',2,'https://ben.example.com/first','First',${NOW - DAY});
    UPDATE push_subs SET user_id=2`);
  let pushes = 0;
  for (let run = 0; run < 3; run++) {
    x.raw.exec("UPDATE channels SET fetched=1 WHERE id=700");
    await withFetch({ "https://ben.example.com/feed.xml": { body: atom([["Brand new video", "https://www.youtube.com/watch?v=nnnnnnnnnnn"], ["First", "https://ben.example.com/first"]]) }, [PUSH]: { status: 201 } },
      async (calls) => { await refreshFeeds(x.env); pushes += calls.filter((c) => c.url.startsWith(PUSH)).length; });
  }
  assert.equal(pushes, 0);
  assert.equal(x.one("SELECT owner_id FROM feed_items WHERE url LIKE '%nnnnnnnnnnn'").owner_id, 1, "gezogene Eintraege wechseln den Eigentuemer nicht");
});

test("318-6 Erster Abruf einer Quelle veroeffentlicht nie, auch ohne Datum und nach Fehlversuchen; Sessionize hoechstens 20", async () => {
  const x = await makeDb(), NUGET = "https://azuresearch-usnc.nuget.org/query?q=owner:anna&take=20&prerelease=false";
  const pkgs = (n, from = 1) => JSON.stringify({ data: Array.from({ length: n }, (_, i) => ({ id: `Anna.Pkg${from + i}`, title: `Anna Pkg ${from + i}`, description: "Client library." })) });
  assert.equal((await x.call("/api/contributions/source", { kind: "package", url: "https://www.nuget.org/profiles/anna", mode: "publish" })).s, 201);
  // erster Versuch scheitert (fetched wird trotzdem gesetzt), der zweite liefert 4 Pakete - alle mit dem Datum von heute
  await withFetch({ [NUGET]: { body: "down", status: 500 } }, () => refreshContributions(x.env, 5));
  assert.deepEqual({ ...x.one("SELECT fails,seeded,fetched>0 f FROM contribution_sources") }, { fails: 1, seeded: 0, f: 1 });
  x.raw.exec("UPDATE contribution_sources SET fetched=1");
  await withFetch({ [NUGET]: { body: pkgs(4) } }, () => refreshContributions(x.env, 5));
  assert.deepEqual([x.one("SELECT COUNT(*) n FROM contributions WHERE review=''").n, posts(x).length, x.one("SELECT seeded FROM contribution_sources").seeded], [4, 0, 1]);
  // ein spaeter gefundenes Paket wird veroeffentlicht
  x.raw.exec("UPDATE contribution_sources SET fetched=1");
  await withFetch({ [NUGET]: { body: pkgs(5) } }, () => refreshContributions(x.env, 5));
  assert.deepEqual(posts(x).map((p) => [p.title, p.origin]), [["Anna Pkg 5", "kurzpost"]]);
  // neuer Link der Quelle: der naechste Abruf gilt wieder als erster
  const sid = x.one("SELECT id FROM contribution_sources").id;
  assert.equal((await x.call("/api/contributions/source/update", { id: sid, url: "https://www.nuget.org/profiles/anna2" })).s, 200);
  assert.deepEqual({ ...x.one("SELECT seeded,fetched FROM contribution_sources") }, { seeded: 0, fetched: 0 });
  await withFetch({ "https://azuresearch-usnc.nuget.org/query?q=owner:anna2": { body: pkgs(3, 10) } }, () => refreshContributions(x.env, 5));
  assert.equal(posts(x).length, 1, "nichts dazugekommen");
  // Feed ohne Datum (parseFeed setzt jetzt) im Modus publish: ebenfalls still
  await x.call("/api/contributions/source", { kind: "blog", url: "https://nodate.example.com/feed.xml", mode: "publish" });
  const rss = `<rss><channel>${[1, 2, 3].map((i) => `<item><title>No date ${i}</title><link>https://nodate.example.com/${i}</link></item>`).join("")}</channel></rss>`;
  await withFetch({ "https://nodate.example.com/feed.xml": { body: rss } }, () => refreshContributions(x.env, 5));
  assert.equal(posts(x).length, 1);
  assert.equal(x.one("SELECT COUNT(*) n FROM contributions WHERE url LIKE 'https://nodate.example.com/%'").n, 3);
  // Modus ask: der erste Abruf fuellt Neu gefunden wie bisher
  await x.call("/api/contributions/source", { kind: "blog", url: "https://ask.example.com/feed.xml" });
  await withFetch({ "https://ask.example.com/feed.xml": { body: atom([["Ask me", "https://ask.example.com/1"]]) } }, () => refreshContributions(x.env, 5));
  assert.equal(x.one("SELECT review FROM contributions WHERE url='https://ask.example.com/1'").review, "pending");
  const html = Array.from({ length: 30 }, (_, i) => `<div><a href="/s/anna/talk-${i}/${1000 + i}">Session number ${i}</a></div>`).join("");
  assert.equal(parseSessionize(html).length, 20);
});

test("318-7 Abruf: Quellen desselben Hosts belegen nicht alle Plaetze eines Laufs", async () => {
  const x = await makeDb();
  for (let i = 0; i < 10; i++) {
    x.raw.prepare("INSERT OR IGNORE INTO users(id,provider,sub,name,created) VALUES(?,'g',?,?,1)").run(100 + i, String(100 + i), `U${i}`);
    x.raw.prepare("INSERT INTO contribution_sources(user_id,kind,url,feed,created,mode,active) VALUES(?,'youtube',?,?,?,'track',1)").run(100 + i, `https://www.youtube.com/channel/UC${String(i).padStart(22, "x")}`, `https://www.youtube.com/feeds/videos.xml?channel_id=UC${String(i).padStart(22, "x")}`, NOW - 100 + i);
  }
  x.raw.prepare("INSERT INTO contribution_sources(user_id,kind,url,feed,created,mode,active) VALUES(1,'blog','https://dev.example.com/feed.xml','https://dev.example.com/feed.xml',?,'track',1)").run(NOW);
  const map = { "https://www.youtube.com/feeds/videos.xml": { body: atom([["V", "https://www.youtube.com/watch?v=vvvvvvvvvvv"]]) }, "https://dev.example.com/feed.xml": { body: atom([["B", "https://dev.example.com/b"]]) } };
  const left = () => x.one("SELECT COUNT(*) n FROM contribution_sources WHERE fetched=0").n;
  await withFetch(map, async (calls) => {
    const r = await refreshContributions(x.env, 5);
    assert.equal(r.sources, 2, "ein YouTube-Kanal und der Blog");
    assert.deepEqual(calls.map((c) => new URL(c.url).hostname).sort(), ["dev.example.com", "www.youtube.com"], "je Host eine Anfrage");
    assert.equal(x.one("SELECT fetched>0 f FROM contribution_sources WHERE kind='blog'").f, 1, "der Blog wartet nicht hinter den YouTube-Quellen");
  });
  assert.equal(left(), 9);
  await withFetch(map, async (calls) => { for (let i = 0; i < 9; i++) await refreshContributions(x.env, 5); assert.equal(calls.length, 9, "weiter hoechstens eine Anfrage je Host und Lauf"); });
  assert.equal(left(), 0);
  // die Obergrenze je Lauf gilt weiter
  x.raw.exec("UPDATE contribution_sources SET fetched=0");
  for (let i = 0; i < 8; i++) x.raw.prepare("INSERT INTO contribution_sources(user_id,kind,url,feed,created,mode,active) VALUES(1,'blog',?,?,1,'track',1)").run(`https://b${i}.example.com/feed.xml`, `https://b${i}.example.com/feed.xml`);
  await withFetch({}, async (calls) => { assert.equal((await refreshContributions(x.env, 5)).sources, 5); assert.equal(calls.length, 5); });
});

test("318-8 Import mit 'Als Kurzpost veroeffentlichen': die Auswahl wird veroeffentlicht, der Rest wird nicht stillschweigend geschluckt", async () => {
  const x = await makeDb();
  const li = await x.call("/api/contributions/import", { kind: "linkedin", mode: "publish", items: [
    { title: "Recent article", url: "https://www.linkedin.com/pulse/recent", date: day(NOW - 30 * DAY), summary: "A short intro. And more. Third." },
    { title: "Old article", url: "https://www.linkedin.com/pulse/old", date: day(NOW - 200 * DAY) }, { title: "Draft without link", url: "", date: day(NOW - 3 * DAY) }] });
  assert.deepEqual([li.s, li.j.added, li.j.published, li.j.pending, li.j.tracked, li.j.unposted, li.j.held], [201, 3, 1, 0, 3, 2, ""]);
  assert.deepEqual(posts(x).map((p) => [p.url, p.origin, p.published]), [["https://www.linkedin.com/pulse/recent", "kurzpost", Date.parse(day(NOW - 30 * DAY)) / 1000]], "mit dem echten Datum, nicht mit heute");
  assert.equal(x.one("SELECT summary FROM feed_items").summary, "A short intro. And more.");
  assert.deepEqual(x.all("SELECT title,review,feed_item_id>0 posted FROM contributions ORDER BY id"), [{ title: "Recent article", review: "", posted: 1 }, { title: "Old article", review: "", posted: 0 }, { title: "Draft without link", review: "", posted: 0 }]);
  // spaeterer Import in dieselbe (manuelle) Quelle: ihr Anlagedatum spielt keine Rolle
  x.raw.exec("UPDATE contribution_sources SET created=created+10*86400");
  const other = await x.call("/api/contributions/import", { kind: "other", mode: "publish", items: [{ title: "Guest post", url: "https://mag.example.com/guest", date: day(NOW - 30 * DAY) }] });
  assert.deepEqual([other.j.added, other.j.published], [1, 1]);
  // Modus ask und track bleiben wie sie waren
  assert.deepEqual((({ added, pending, published }) => [added, pending, published])((await x.call("/api/contributions/import", { kind: "other", mode: "ask", items: links(2, NOW, "ask.example.com") })).j), [2, 2, 0]);
  assert.deepEqual((({ added, tracked, published }) => [added, tracked, published])((await x.call("/api/contributions/import", { kind: "other", mode: "track", items: links(2, NOW, "track.example.com") })).j), [2, 2, 0]);
});

test("318-9 Hand-Eintraege ('anderer Link'): Typ wird gespeichert, sie bleiben aenderbar und zaehlen gegen die Grenze; erneutes Auswaehlen schlaegt die Loeschmarke", async () => {
  const x = await makeDb();
  const r = await x.call("/api/contributions/import", { kind: "other", mode: "track", items: [{ title: "My book", url: "https://books.example.com/b", date: "2026-01-10", ctype: "Book" }, { title: "Bad type", url: "https://books.example.com/c", date: "2026-01-10", ctype: "Nonsense" }] });
  assert.equal(r.j.added, 2);
  const book = x.one("SELECT id,manual,ctype,kind FROM contributions WHERE title='My book'");
  assert.deepEqual({ ...book }, { id: book.id, manual: 1, ctype: "Book", kind: "other" });
  assert.equal(x.one("SELECT ctype FROM contributions WHERE title='Bad type'").ctype, "");
  const out = (await x.call("/api/contributions/mine")).j.contributions.find((c) => c.id === book.id);
  assert.deepEqual([out.type, out.manual], ["Book", true]);
  assert.equal((await x.call("/api/contributions/update", { id: book.id, published: "2026-02-01", title: "My book, 2nd edition" })).s, 200, "Datum und Titel lassen sich korrigieren");
  assert.equal((await x.call("/api/contributions/delete", { id: book.id })).s, 200);
  assert.equal(x.one("SELECT COUNT(*) n FROM contribution_ignored").n, 0, "kein Tombstone fuer Hand-Eintraege");
  assert.equal((await x.call("/api/contributions/import", { kind: "other", mode: "track", items: [{ title: "My book", url: "https://books.example.com/b", date: "2026-01-10" }] })).j.added, 1, "erneut anlegen geht");
  // LinkedIn bleibt ein Import (Loeschmarke gegen erneuten Vorschlag), aber die ausdrueckliche Auswahl gilt
  const li = [{ title: "Governance article", url: "https://www.linkedin.com/pulse/governance", date: "2026-04-02" }];
  await x.call("/api/contributions/import", { kind: "linkedin", mode: "track", items: li });
  const lid = x.one("SELECT id,manual FROM contributions WHERE url LIKE '%governance'");
  assert.equal(lid.manual, 0);
  await x.call("/api/contributions/delete", { id: lid.id });
  assert.equal(x.one("SELECT COUNT(*) n FROM contribution_ignored WHERE url LIKE '%governance'").n, 1);
  assert.equal((await x.call("/api/contributions/import", { kind: "linkedin", mode: "track", items: li })).j.added, 1);
  assert.equal(x.one("SELECT COUNT(*) n FROM contribution_ignored WHERE url LIKE '%governance'").n, 0);
  assert.ok((await x.call("/api/contributions/mine")).j.contributions.some((c) => c.url.endsWith("governance")), "wieder sichtbar");
  // Eintraege ohne Link umgehen die Grenze nicht mehr (vorher: 3600 an einem Tag)
  const st = x.raw.prepare("INSERT INTO contributions(user_id,title,url,published,kind,created,manual) VALUES(1,?,'',1767225600,'other',1,1)");
  for (let i = x.one("SELECT COUNT(*) n FROM contributions WHERE user_id=1 AND manual=1").n; i < 1999; i++) st.run(`Filler ${i}`);
  const fill = await x.call("/api/contributions/import", { kind: "other", mode: "track", items: [{ title: "Workshop one", url: "", date: "2026-01-01" }, { title: "Workshop two", url: "", date: "2026-01-01" }] });
  assert.deepEqual([fill.s, fill.j.added, fill.j.limited], [201, 1, 1]);
  const full = await x.call("/api/contributions/import", { kind: "other", mode: "track", items: [{ title: "Workshop three", url: "", date: "2026-01-01" }] });
  assert.deepEqual([full.s, full.j.error], [400, "contribution_limit"]);
  assert.equal(x.one("SELECT COUNT(*) n FROM contributions WHERE user_id=1 AND manual=1").n, 2000);
});

test("318-11 Ein Bot-Name fuer alle Abrufe: die Kennung steht an einer Stelle", () => {
  assert.equal(BOT_UA, "M365.FM-Bot (+https://www.m365.fm/bot/)");
  const src = new URL("../src/", import.meta.url);
  for (const f of readdirSync(src).filter((f) => f.endsWith(".js") && f !== "util.js")) assert.ok(!/M365\.FM-Bot|M365FM-community-feed/.test(readFileSync(new URL(f, src), "utf-8")), `${f} nutzt BOT_UA aus util.js`);
});

test("Konten zusammenfuehren und loeschen: Spalten und Kurzposts aus 0036 wandern mit bzw. verschwinden", async () => {
  const x = await makeDb(), S = 2, T = 1;
  x.raw.exec("INSERT INTO programs(owner_type,owner_id,program,verified) VALUES('u',2,'mct',1)");
  // T: ein Beitrag ohne Kurzpost (Zwilling ueber die kanonische URL), einer mit eigenem Kurzpost (Zwilling ueber die GUID)
  x.raw.exec(`INSERT INTO contribution_sources(id,user_id,kind,url,created,mode,topics,seeded) VALUES(1,1,'blog','https://blog.example/feed',1,'ask','["copilot"]',1);
    INSERT INTO contributions(id,user_id,source_id,title,url,published,kind,created,guid,canon,ctype,teaser) VALUES
      (10,1,1,'Video (T)','https://www.youtube.com/watch?v=aaaaaaaaaaa',${NOW},'video',1,'','youtube.com/watch?v=aaaaaaaaaaa','','T teaser'),
      (11,1,1,'Episode (T)','https://t.example.com/ep1',${NOW},'podcast',1,'ep-1','t.example.com/ep1','','')`);
  assert.equal((await x.call("/api/contributions/review", { id: 11, action: "publish" })).s, 200);
  // S: eigene Quelle (publish, andere URL) mit drei Kurzposts - zwei davon Zwillinge von T - und eine Loeschmarke
  x.raw.exec(`INSERT INTO contribution_sources(id,user_id,kind,url,created,mode,etag,modified,last_error,topics,seeded) VALUES(2,2,'youtube','https://www.youtube.com/@ben',1,'publish','"e1"','Mon','http_500','["teams"]',1);
    INSERT INTO contributions(id,user_id,source_id,title,url,published,kind,created,guid,canon,ctype,teaser) VALUES
      (20,2,2,'Video (S)','https://youtu.be/aaaaaaaaaaa',${NOW},'video',1,'yt:1','youtube.com/watch?v=aaaaaaaaaaa','Video/Webcast','S teaser'),
      (21,2,2,'Episode (S)','https://s.example.com/ep1',${NOW},'podcast',1,'ep-1','s.example.com/ep1','',''),
      (22,2,2,'Only S','https://s.example.com/only',${NOW},'blog',1,'g-22','s.example.com/only','Book','Teaser 22');
    INSERT INTO contribution_ignored(user_id,url,created) VALUES(2,'https://s.example.com/gone',1)`);
  for (const id of [20, 21, 22]) assert.equal((await x.call("/api/contributions/review", { id, action: "publish" }, { id: S })).s, 200, String(id));
  const sPost = (id) => x.one("SELECT feed_item_id f FROM contributions WHERE id=?", id).f, p20 = sPost(20), p21 = sPost(21), p22 = sPost(22), p11 = sPost(11);
  x.raw.exec(`INSERT INTO item_votes(item_id,user_id,created) VALUES(${p20},3,1),(${p21},3,1),(${p22},3,1)`);
  await x.db.batch(await mergeStatements(x.db, S, T));
  assert.equal(x.one("SELECT COUNT(*) n FROM contributions WHERE user_id=2").n + x.one("SELECT COUNT(*) n FROM contribution_sources WHERE user_id=2").n + x.one("SELECT COUNT(*) n FROM contribution_ignored WHERE user_id=2").n + x.one("SELECT COUNT(*) n FROM feed_items WHERE owner_id=2").n, 0, "nichts bleibt am Quellkonto");
  // Quelle samt neuer Spalten bei T
  assert.deepEqual({ ...x.one("SELECT user_id,mode,etag,modified,last_error,topics,seeded FROM contribution_sources WHERE id=2") }, { user_id: 1, mode: "publish", etag: '"e1"', modified: "Mon", last_error: "http_500", topics: '["teams"]', seeded: 1 });
  // Zwillinge: der Eintrag von T bleibt; der Kurzpost von S haengt jetzt an ihm, wenn T keinen hatte, sonst entfaellt er samt Stimmen
  assert.deepEqual(x.all("SELECT id,title,feed_item_id,ctype,teaser,guid,source_id FROM contributions WHERE user_id=1 ORDER BY id"), [
    { id: 10, title: "Video (T)", feed_item_id: p20, ctype: "", teaser: "T teaser", guid: "", source_id: 1 },
    { id: 11, title: "Episode (T)", feed_item_id: p11, ctype: "", teaser: "", guid: "ep-1", source_id: 1 },
    { id: 22, title: "Only S", feed_item_id: p22, ctype: "Book", teaser: "Teaser 22", guid: "g-22", source_id: 2 }]);
  assert.deepEqual(posts(x).map((p) => [p.id, p.owner_id, p.origin]), [[p11, 1, "kurzpost"], [p20, 1, "kurzpost"], [p22, 1, "kurzpost"]].sort((a, b) => a[0] - b[0]));
  assert.deepEqual(x.all("SELECT item_id FROM item_votes ORDER BY item_id").map((v) => v.item_id), [p20, p22].sort((a, b) => a - b));
  assert.equal(x.one("SELECT user_id FROM contribution_ignored").user_id, 1);
  const mine = (await x.call("/api/contributions/mine")).j.contributions;
  assert.deepEqual(mine.map((c) => [c.id, c.post]).sort((a, b) => a[0] - b[0]), [[10, "live"], [11, "live"], [22, "live"]]);
  assert.equal((await x.call("/api/contributions/unpublish", { id: 10 })).j.withdrawn, true, "T kann den uebernommenen Kurzpost zurueckziehen");
  assert.equal((await x.prof("/api/feed/export")).j.items.length, 2);
  // Kontoloeschung: Beitraege, Quellen, Loeschmarken, Kurzposts (auch zurueckgezogene und von der Moderation ausgeblendete), ihre Kanaele und Stimmen
  await x.prof("/api/admin/feed-hide", { id: p22, hidden: true }, ADMIN);
  x.raw.exec(`INSERT INTO item_votes(item_id,user_id,created) VALUES(${p11},1,1)`);
  await deleteUserData(x.db, T);
  for (const [t, where] of [["contributions", "user_id=1"], ["contribution_sources", "user_id=1"], ["contribution_ignored", "user_id=1"], ["feed_items", "owner_type='u' AND owner_id=1"], ["channels", "owner_type='u' AND owner_id=1"], ["item_votes", "1=1"]])
    assert.equal(x.one(`SELECT COUNT(*) n FROM ${t} WHERE ${where}`).n, 0, t);
  assert.deepEqual(x.all("SELECT k FROM ratelimit WHERE k LIKE '%:1' ORDER BY k").map((r) => r.k), [], "auch die Zaehler des Trackers tragen die Konto-Nummer");
  assert.ok(x.one("SELECT COUNT(*) n FROM ratelimit WHERE k LIKE '%:2'").n > 0, "die Zaehler anderer Konten bleiben");
});

test("318 Nachpruefung: Zusammenfuehren erkennt dieselbe Seite auch bei Hand-Eintraegen; eine Sperre der Moderation ueberlebt als Sperre", async () => {
  const x = await makeDb(), S = 2, T = 1;
  x.raw.exec("INSERT INTO programs(owner_type,owner_id,program,verified) VALUES('u',2,'mct',1)");
  const t1 = await posted(x, "T both", "https://both.example.com/1"), t2 = await posted(x, "T mod", "https://mod.example.com/1");
  const s1 = await posted(x, "S both variant", "https://www.both.example.com/1/?utm_source=x", { id: S }), s2 = await posted(x, "S mod variant", "https://mod.example.com/1/", { id: S }), s3 = await posted(x, "S only", "https://s.example.com/only", { id: S });
  assert.deepEqual(x.all("SELECT canon FROM contributions ORDER BY id").map((c) => c.canon), ["both.example.com/1", "mod.example.com/1", "both.example.com/1", "mod.example.com/1", "s.example.com/only"], "Hand-Eintraege tragen die kanonische Adresse");
  await x.prof("/api/admin/feed-hide", { id: s2.post, hidden: true }, ADMIN);
  await x.prof("/api/admin/feed-hide", { id: s3.post, hidden: true }, ADMIN);
  await x.db.batch(await mergeStatements(x.db, S, T));
  assert.deepEqual(x.all("SELECT id,user_id,feed_item_id FROM contributions ORDER BY id"), [{ id: t1.id, user_id: 1, feed_item_id: t1.post }, { id: t2.id, user_id: 1, feed_item_id: t2.post }, { id: s3.id, user_id: 1, feed_item_id: s3.post }], "die Zwillinge von S entfallen");
  // der sichtbare Zwilling-Kurzpost entfaellt; die ausgeblendeten bleiben als Sperre bei T - ohne Beitrag zusaetzlich als zurueckgezogen vermerkt
  assert.deepEqual(posts(x).map((p) => [p.id, p.owner_id, p.hidden]), [[t1.post, 1, 0], [t2.post, 1, 0], [s2.post, 1, 3], [s3.post, 1, 1]]);
  await x.prof("/api/admin/feed-hide", { id: s2.post, hidden: false }, ADMIN);
  assert.deepEqual([x.one("SELECT hidden FROM feed_items WHERE id=?", s2.post).hidden, (await x.prof("/api/feed/export")).j.items.length], [2, 2], "Einblenden stellt keinen Kurzpost ohne Beitrag oeffentlich");
});

// ---------- Folge-PR (F03, F04, F05) ----------
test("F03 (#318) ein von der Moderation ausgeblendeter Kurzpost kommt nicht ueber die Firmenseite seines Mitglieds zurueck; einer fremden Firma weicht er weiter", async () => {
  const x = await makeDb(), S = "https://spam.example.com/offer", S2 = "https://spam.example.com/offer-2", FEED = "https://acme.example.com/feed.xml", FEED2 = "https://other.example.com/feed.xml";
  x.raw.exec(`INSERT INTO orgs(id,handle,name,public,created) VALUES(5,'acme','Acme',1,1),(6,'other','Other',1,1);
    INSERT INTO org_members(org_id,user_id,role,status,created) VALUES(5,1,'owner','active',1),(6,2,'owner','active',1);
    INSERT INTO channels(id,owner_type,owner_id,kind,url,feed,fetched) VALUES(800,'o',5,'blog','https://acme.example.com/','${FEED}',1),(801,'o',6,'blog','https://other.example.com/','${FEED2}',1);
    INSERT INTO feed_items(id,channel_id,owner_type,owner_id,url,title,published) VALUES(80,800,'o',5,'https://acme.example.com/old','Old acme',${NOW - DAY}),(81,801,'o',6,'https://other.example.com/old','Old other',${NOW - DAY})`);
  const a = await posted(x, "Spam offer", S), b = await posted(x, "Spam offer two", S2);
  for (const id of [a.post, b.post]) assert.equal((await x.prof("/api/admin/feed-hide", { id, hidden: true }, ADMIN)).s, 200);
  for (let run = 0; run < 2; run++) {
    x.raw.exec("UPDATE channels SET fetched=1 WHERE id IN (800,801)");
    await withFetch({ [FEED]: { body: atom([["Spam offer again", S], ["Old acme", "https://acme.example.com/old"]]) }, [FEED2]: { body: atom([["Real article", S2], ["Old other", "https://other.example.com/old"]]) } }, () => refreshFeeds(x.env));
  }
  assert.deepEqual(x.all("SELECT id,owner_type,owner_id,origin,hidden FROM feed_items WHERE url=?", S), [{ id: a.post, owner_type: "u", owner_id: 1, origin: "kurzpost", hidden: 1 }], "Sperre bleibt, kein neuer sichtbarer Eintrag der eigenen Firma");
  assert.deepEqual(x.all("SELECT owner_type,owner_id,origin,hidden FROM feed_items WHERE url=?", S2), [{ owner_type: "o", owner_id: 6, origin: "", hidden: 0 }], "eine Firma ohne das Mitglied bekommt den Link");
  const exp = (await x.prof("/api/feed/export")).j.items.map((i) => i.url);
  assert.ok(!exp.includes(S) && exp.includes(S2));
});

test("F04 (#318) ein zurueckgezogener fremder Kurzpost gibt den Link frei (Kanal-Abruf und eigener Kurzpost); ein sichtbarer bleibt und wird der Moderation gemeldet", async () => {
  const x = await makeDb(), V1 = "https://www.youtube.com/watch?v=bbbbbbbbbb1", V2 = "https://www.youtube.com/watch?v=bbbbbbbbbb2", V3 = "https://www.youtube.com/watch?v=bbbbbbbbbb3", FEED = "https://www.youtube.com/feeds/videos.xml?channel_id=UCben";
  x.raw.exec(`INSERT INTO programs(owner_type,owner_id,program,verified) VALUES('u',2,'mvp',1);
    INSERT INTO channels(id,owner_type,owner_id,kind,url,feed,fetched) VALUES(700,'u',2,'youtube','https://www.youtube.com/@ben','${FEED}',1);
    INSERT INTO feed_items(id,channel_id,owner_type,owner_id,url,title,published) VALUES(70,700,'u',2,'https://www.youtube.com/watch?v=ooooooooooo','Older',${NOW - DAY})`);
  const a1 = await posted(x, "Bens video, posted by Anna", V1), a2 = await posted(x, "Bens second video, posted by Anna", V2), a3 = await posted(x, "Third", V3);
  const poll = async (list) => { x.raw.exec("UPDATE channels SET fetched=1 WHERE id=700"); await withFetch({ [FEED]: { body: atom(list) } }, () => refreshFeeds(x.env)); };
  // sichtbar: Anna behaelt den Eintrag (wer zuerst da ist), der Konflikt steht einmal im Audit-Protokoll
  await poll([["Ben video", V1], ["Older", "https://www.youtube.com/watch?v=ooooooooooo"]]); await poll([["Ben video", V1]]);
  assert.deepEqual(x.all("SELECT owner_id,origin,hidden FROM feed_items WHERE url=?", V1), [{ owner_id: 1, origin: "kurzpost", hidden: 0 }]);
  assert.deepEqual(x.all("SELECT user_id,action,target,detail FROM audit WHERE action='feed-kurzpost-conflict'"), [{ user_id: 0, action: "feed-kurzpost-conflict", target: `feed_item:${a1.post}`, detail: "channel:700" }]);
  // zurueckgezogen: Bens Kanal bekommt sein Video
  for (const c of [a1, a2, a3]) assert.equal((await x.call("/api/contributions/unpublish", { id: c.id })).j.withdrawn, true);
  await poll([["Ben video", V1]]);
  assert.deepEqual(x.all("SELECT owner_id,channel_id,origin,hidden FROM feed_items WHERE url=?", V1), [{ owner_id: 2, channel_id: 700, origin: "", hidden: 0 }]);
  assert.equal(x.one("SELECT feed_item_id FROM contributions WHERE id=?", a1.id).feed_item_id, 0);
  // Ben veroeffentlicht sein zweites Video selbst als Kurzpost: Annas zurueckgezogener Eintrag haelt den Link nicht mehr
  const b2 = await posted(x, "Ben's second video", V2, { id: 2 });
  assert.deepEqual(x.all("SELECT id,owner_id,origin,hidden FROM feed_items WHERE url=?", V2), [{ id: b2.post, owner_id: 2, origin: "kurzpost", hidden: 0 }]);
  assert.deepEqual([x.one("SELECT COUNT(*) n FROM feed_items WHERE id=?", a2.post).n, x.one("SELECT feed_item_id FROM contributions WHERE id=?", a2.id).feed_item_id], [0, 0]);
  // zurueckgezogen UND von der Moderation gesperrt: bleibt eine Sperre, kein fremder Kurzpost
  assert.equal((await x.prof("/api/admin/feed-hide", { id: a3.post, hidden: true }, ADMIN)).s, 200);
  const c3 = await x.call("/api/contributions/manual", { title: "Third", url: V3, kind: "video", published: day(NOW) }, { id: 2 });
  assert.deepEqual((await x.call("/api/contributions/review", { id: c3.j.id, action: "publish" }, { id: 2 })).j.error, "url_taken");
  assert.deepEqual(x.all("SELECT owner_id,hidden FROM feed_items WHERE url=?", V3), [{ owner_id: 1, hidden: 3 }]);
});

test("F05 (#318) der Blog-Kanal mit Kurzposts bleibt beim Speichern des Profils; erneut veroeffentlichte Kurzposts kommen in den aktuellen Blog-Kanal", async () => {
  const x = await makeDb(), BLOG = `${SITE}/community/u/anna/blog/`;
  const a = await posted(x, "Post one", "https://a.example.com/one"), b = await posted(x, "Post two", "https://a.example.com/two");
  const ch = x.one("SELECT id FROM channels WHERE owner_type='u' AND owner_id=1 AND url=?", BLOG).id;
  const save = await withFetch({}, () => x.prof("/api/profile/me", { handle: "anna", public: true, name: "Anna", channels: [] }, { id: 1, name: "Anna" }));
  assert.equal(save.s, 200, JSON.stringify(save.j));
  x.raw.exec("INSERT OR IGNORE INTO programs(owner_type,owner_id,program,verified) VALUES('u',1,'mvp',1)");   // das Formular ohne Programme hat auch die Programm-Liste geleert
  assert.equal(x.one("SELECT COUNT(*) n FROM channels WHERE id=?", ch).n, 1, "Kanal mit Kurzposts bleibt");
  assert.deepEqual((await x.prof("/api/feed/export")).j.items.map((i) => i.title).sort(), ["Post one", "Post two"]);
  // Altbestand: der Kanal fehlt schon (vor diesem Fix entfernt). Zurueckziehen und erneut veroeffentlichen holt den Kurzpost in den aktuellen Kanal zurueck
  x.raw.exec(`DELETE FROM channels WHERE id=${ch}`);
  assert.deepEqual((await x.prof("/api/feed/export")).j.items, []);
  assert.equal((await x.call("/api/contributions/unpublish", { id: a.id })).j.withdrawn, true);
  const rp = await x.call("/api/contributions/review", { id: a.id, action: "publish" }); assert.equal(rp.j.feed_item_id, a.post, JSON.stringify(rp));
  const now = x.one("SELECT id FROM channels WHERE owner_type='u' AND owner_id=1 AND url=?", BLOG).id;
  assert.deepEqual(x.all("SELECT id,channel_id FROM feed_items ORDER BY id"), [{ id: a.post, channel_id: now }, { id: b.post, channel_id: ch }]);
  assert.deepEqual((await x.prof("/api/feed/export")).j.items.map((i) => i.title), ["Post one"]);
  // ohne Kurzposts darf der Kanal wieder weg
  x.raw.exec("DELETE FROM feed_items");
  assert.equal((await withFetch({}, () => x.prof("/api/profile/me", { handle: "anna", public: true, name: "Anna", channels: [] }, { id: 1, name: "Anna" }))).s, 200);
  assert.equal(x.one("SELECT COUNT(*) n FROM channels WHERE owner_id=1").n, 0);
});
