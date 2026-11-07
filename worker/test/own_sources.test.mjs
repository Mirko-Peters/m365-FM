// MVP-Tracker: eigene Quellen (#282): Parser je Quellenart, URL-Pruefung, die drei Modi, Dedupe, Zugriff, LinkedIn-OG, Import, MCP.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { handleContributions, refreshContributions } from "../src/contributions.js";
import { describeSource, canonUrl, parseBody, parseIcal, ogOnly, summarize, BOT_UA, ctypeOf, CTYPES } from "../src/contrib_sources.js";
import { TOOLS } from "../src/mcp.js";

const NOW = Math.floor(Date.now() / 1000), RFC = new Date(NOW * 1000).toUTCString(), ISO = new Date(NOW * 1000).toISOString();
const fx = (n) => readFileSync(new URL(`./fixtures/own_sources/${n}`, import.meta.url), "utf-8").replaceAll("%NOW%", RFC).replaceAll("%ISO%", ISO);

async function makeDb() {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:"), dir = new URL("../migrations/", import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(f, dir), "utf-8"));
  const db = { prepare(sql) { const st = raw.prepare(sql); let args = []; const o = { bind(...a) { args = a; return o; }, all: async () => ({ results: st.all(...args) }), first: async () => st.get(...args) ?? null,
    run: async () => { const r = st.run(...args); return { meta: { changes: Number(r.changes), last_row_id: Number(r.lastInsertRowid) } }; } }; return o; }, async batch(stmts) { for (const st of stmts) await st.run(); } };
  raw.exec("INSERT INTO users(id,provider,sub,name,created) VALUES(1,'g','1','Anna',1),(2,'g','2','Ben',1)");
  raw.exec("INSERT INTO profiles(user_id,public,handle,headline,about,company,job,country,show_org,updated) VALUES(1,1,'anna','','','','','',1,1)");
  return { db, raw, env: { DB: db, SITE: "https://www.m365.fm" } };
}
const J = (data, status = 200, headers = {}) => new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json", ...headers } });
const caller = (db) => (path, method = "GET", data, actor = { id: 1 }) => {
  const url = new URL(`https://x${path}`);
  return handleContributions({ DB: db }, new Request(url, { method, headers: { "content-type": "application/json" }, ...(data === undefined ? {} : { body: JSON.stringify(data) }) }), url, url.pathname, actor, J);
};
const json = async (r) => (await r).json();
async function withFetch(map, fn) {   // map: url -> { body, status?, headers? } | function(req); zeichnet Anfragen auf
  const orig = globalThis.fetch, calls = [];
  globalThis.fetch = async (u, init = {}) => {
    const url = String(u), h = map[url] ?? Object.entries(map).find(([k]) => url.startsWith(k))?.[1];
    calls.push({ url, headers: init.headers || {} });
    if (!h) return new Response("nope", { status: 404 });
    const r = typeof h === "function" ? h(init) : h;
    const res = new Response(r.status === 304 ? null : r.body, { status: r.status || 200, headers: r.headers || {} });
    Object.defineProperty(res, "url", { value: url });
    return res;
  };
  try { return await fn(calls); } finally { globalThis.fetch = orig; }
}
const addSource = (call, body) => call("/api/contributions/source", "POST", body);

test("URL-Pruefung je Quellenart und Feed-Adressen", () => {
  assert.equal(describeSource("youtube", "https://www.youtube.com/channel/UCabcdefghijklmnopqrstuv").feed, "https://www.youtube.com/feeds/videos.xml?channel_id=UCabcdefghijklmnopqrstuv");
  assert.equal(describeSource("youtube", "https://www.youtube.com/@anna").feed, "", "Handle: Feed wird beim Abruf entdeckt");
  assert.equal(describeSource("youtube", "https://example.com/@anna").error, "bad_source");
  assert.equal(describeSource("github", "https://github.com/anna").feed, "https://github.com/anna.atom");
  assert.equal(describeSource("github", "https://github.com/anna/tool").feed, "https://github.com/anna/tool/releases.atom");
  assert.equal(describeSource("github", "https://gitlab.com/anna").error, "bad_source");
  assert.equal(describeSource("blog", "https://dev.example.com/feed/").feed, "https://dev.example.com/feed/");
  assert.equal(describeSource("blog", "http://dev.example.com/feed/").error, "bad_source", "nur https");
  assert.equal(describeSource("blog", "https://user:pw@dev.example.com/").error, "bad_source");
  assert.equal(describeSource("techcommunity", "https://techcommunity.microsoft.com/t5/s/gxcnf55303/rss/board?board.id=x").feed.includes("/rss/"), true);
  assert.equal(describeSource("techcommunity", "https://example.com/rss/x").error, "bad_source");
  assert.equal(describeSource("sessionize", "https://sessionize.com/anna-speaker").url, "https://sessionize.com/anna-speaker/");
  assert.equal(describeSource("sessionize", "https://sessionize.com/s/anna/talk/1").error, "bad_source");
  assert.match(describeSource("stackoverflow", "https://stackoverflow.com/users/123/anna").feed, /api\.stackexchange\.com\/2\.3\/users\/123\/posts\?.*site=stackoverflow/);
  assert.match(describeSource("stackoverflow", "https://dba.stackexchange.com/users/9/x").feed, /site=dba/);
  assert.equal(describeSource("stackoverflow", "https://stackoverflow.com/questions/1").error, "bad_source");
  assert.match(describeSource("package", "https://www.npmjs.com/~anna").feed, /registry\.npmjs\.org.*maintainer:anna/);
  assert.match(describeSource("package", "https://www.nuget.org/profiles/anna").feed, /owner:anna/);
  assert.match(describeSource("package", "https://www.powershellgallery.com/profiles/anna").feed, /owner:anna/);
  assert.equal(describeSource("package", "https://pypi.org/user/anna").error, "bad_source");
  assert.equal(describeSource("meetup", "https://www.meetup.com/m365-ug/events/1/").feed, "https://www.meetup.com/m365-ug/events/ical/");
  assert.equal(describeSource("linkedin").manual, true);
  assert.equal(describeSource("other").manual, true);
  assert.equal(describeSource("tiktok", "https://tiktok.com/@a").error, "bad_source");
});

test("kanonische URL: Schema, www, Tracking, YouTube-Formen", () => {
  assert.equal(canonUrl("https://www.Example.com/Post/?utm_source=rss&b=2&a=1#x"), canonUrl("http://example.com/post?a=1&b=2"));
  const id = "youtube.com/watch?v=aaaaaaaaaaa";
  for (const u of ["https://youtu.be/aaaaaaaaaaa", "https://www.youtube.com/watch?v=aaaaaaaaaaa&feature=share", "https://m.youtube.com/shorts/aaaaaaaaaaa", "https://www.youtube.com/embed/aaaaaaaaaaa"]) assert.equal(canonUrl(u), id, u);
  assert.notEqual(canonUrl("https://example.com/a"), canonUrl("https://example.com/b"));
});

test("Parser: ein Fixture je Quellenart", () => {
  const pod = parseBody("podcast", "https://podcast.example.com/feed.xml", fx("podcast.rss"));
  assert.deepEqual(pod.map((x) => [x.title, x.guid]), [["Episode 12: Copilot governance", "pod-ep-12"], ["Episode 11: Fabric basics", "pod-ep-11"]]);
  assert.equal(pod[0].desc, "We talk about governance. It is a long story.", "Kurzfassung: 2 Saetze");
  const blog = parseBody("blog", "https://dev.example.com/feed", fx("blog.atom"));
  assert.equal(blog.length, 2); assert.equal(blog[0].guid, "tag:dev.example.com,2026:1");
  const yt = parseBody("youtube", "https://www.youtube.com/feeds/videos.xml?channel_id=UC", fx("youtube.atom"));
  assert.deepEqual([yt[0].title, yt[0].url], ["Copilot in 10 minutes", "https://youtu.be/aaaaaaaaaaa"]);
  const gh = parseBody("github", "https://github.com/anna/tool/releases.atom", fx("github_releases.atom"));
  assert.deepEqual([gh[0].title, gh[0].url], ["v1.2.0", "https://github.com/anna/tool/releases/tag/v1.2.0"]);
  const tc = parseBody("techcommunity", "https://techcommunity.microsoft.com/rss", fx("techcommunity.rss"));
  assert.equal(tc[0].url, "https://techcommunity.microsoft.com/blog/microsoft365blog/teams-premium-rollout/4000001");
  const sz = parseBody("sessionize", "https://sessionize.com/anna-speaker/", fx("sessionize.html"));
  assert.deepEqual(sz.map((x) => x.title), ["Copilot governance in practice", "Fabric for admins"], "nur Sitzungs-Links, nicht das Profil");
  assert.equal(sz[0].url, "https://sessionize.com/s/anna-speaker/copilot-governance-in-practice/12345");
  assert.equal(sz[0].t, Date.parse("2026-03-12T00:00:00Z") / 1000);
  assert.equal(sz[0].desc, "How to roll out Copilot safely. Real examples.");
  assert.equal(sz[1].t, Date.parse("2025-09-20T00:00:00Z") / 1000);
  const so = parseBody("stackoverflow", "https://api.stackexchange.com/2.3/users/1/posts", fx("stackoverflow.json"));
  assert.deepEqual(so.map((x) => x.title), ['Answer: How to export "Teams" data?', "Graph API throttling"]);
  const npm = parseBody("package", "https://registry.npmjs.org/-/v1/search?text=maintainer:anna", fx("npm.json"));
  assert.deepEqual([npm[0].title, npm[0].url, npm[0].t], ["@anna/graph-tools", "https://www.npmjs.com/package/@anna/graph-tools", Date.parse("2026-02-01T10:00:00Z") / 1000]);
  assert.equal(parseBody("package", "https://azuresearch-usnc.nuget.org/query?q=owner:anna", fx("nuget.json"))[0].url, "https://www.nuget.org/packages/Anna.Graph.Client");
  const ps = parseBody("package", "https://www.powershellgallery.com/api/v2/Search()?x=1", fx("psgallery.atom"));
  assert.deepEqual([ps[0].title, ps[0].url], ["AnnaTools", "https://www.powershellgallery.com/packages/AnnaTools/3.4.5"]);
  const ev = parseIcal(fx("meetup.ics"));
  assert.deepEqual([ev[0].title, ev[0].url, ev[0].guid, ev[0].t], ["M365 User Group: Copilot night", "https://www.meetup.com/m365-ug/events/300/", "event_300@meetup.com", Date.UTC(2026, 2, 12, 18) / 1000]);
  assert.equal(parseBody("blog", "x", "<html>kein feed</html>").length, 0);
  assert.equal(summarize("<b>One.</b> Two! Three?"), "One. Two!");
});

test("Modus 'Nur tracken': zaehlt, privat, keine oeffentliche Seite; Abruf mit eigenem User-Agent und ETag", async () => {
  const { db, raw, env } = await makeDb(), call = caller(db);
  const r = await addSource(call, { kind: "podcast", url: "https://podcast.example.com/feed.xml", mode: "track", public: false });
  assert.equal(r.status, 201);
  const feedUrl = "https://podcast.example.com/feed.xml";
  await withFetch({ [feedUrl]: { body: fx("podcast.rss"), headers: { etag: '"v1"', "last-modified": "Mon, 01 Jan 2026 00:00:00 GMT" } } }, async (calls) => {
    await refreshContributions(env, 5);
    assert.equal(calls[0].headers["user-agent"], BOT_UA);
    assert.equal(BOT_UA, "M365.FM-Bot (+https://www.m365.fm/bot/)");
  });
  const rows = raw.prepare("SELECT title,public,review,kind,guid,feed_item_id FROM contributions ORDER BY id").all();
  assert.equal(rows.length, 2);
  assert.ok(rows.every((x) => x.public === 0 && x.review === "" && x.kind === "podcast" && x.feed_item_id === 0));
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM feed_items").get().n, 0, "keine Feed-Seite");
  const src = raw.prepare("SELECT etag,modified,fetched FROM contribution_sources").get();
  assert.deepEqual([src.etag, src.modified], ['"v1"', "Mon, 01 Jan 2026 00:00:00 GMT"]);
  // zweiter Lauf: bedingte Anfrage, 304 = nichts zu tun
  raw.exec("UPDATE contribution_sources SET fetched=1");
  await withFetch({ [feedUrl]: (init) => (init.headers["if-none-match"] === '"v1"' && init.headers["if-modified-since"] ? { status: 304 } : { body: "broken", status: 500 }) }, async () => { await refreshContributions(env, 5); });
  assert.equal(raw.prepare("SELECT fails,last_error FROM contribution_sources").get().fails, 0, "304 ist kein Fehler");
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM contributions").get().n, 2);
  // Fehler werden an der Quelle sichtbar
  raw.exec("UPDATE contribution_sources SET fetched=1");
  await withFetch({ [feedUrl]: { body: "x", status: 500 } }, async () => { await refreshContributions(env, 5); });
  assert.deepEqual(Object.values(raw.prepare("SELECT fails,last_error FROM contribution_sources").get()), [1, "http_500"]);
});

test("Modus 'Kurzpost': neuer Beitrag landet im Feed (extern gekennzeichnet), aeltere nur im Tracker; GitHub nie", async () => {
  const { db, raw, env } = await makeDb(), call = caller(db);
  assert.equal((await addSource(call, { kind: "github", url: "https://github.com/anna", mode: "publish" })).status, 400, "GitHub-Aktivitaet bleibt privat");
  assert.equal((await json(addSource(call, { kind: "github", url: "https://github.com/anna", mode: "publish" }))).error, "not_publishable");
  assert.equal((await addSource(call, { kind: "podcast", url: "https://podcast.example.com/feed.xml", mode: "publish", topics: ["Copilot", "power-bi"] })).status, 201);
  await withFetch({ "https://podcast.example.com/feed.xml": { body: fx("podcast.rss") } }, () => refreshContributions(env, 5));
  const posts = raw.prepare("SELECT title,url,summary,topics,origin,hidden,owner_id FROM feed_items").all();
  assert.equal(posts.length, 1, "nur der neue Beitrag, nicht die Folge von 2024");
  assert.deepEqual([posts[0].origin, posts[0].url, posts[0].hidden, posts[0].owner_id], ["kurzpost", "https://podcast.example.com/ep12", 0, 1]);
  assert.equal(posts[0].summary, "We talk about governance. It is a long story.");
  assert.deepEqual(JSON.parse(posts[0].topics), ["copilot", "power-bi"], "gewaehlte Themen-Entitaeten");
  assert.equal(raw.prepare("SELECT body FROM feed_items").get().body, "", "ohne eigenen Text: noindex (site_feed.py)");
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM contributions WHERE review=''").get().n, 2, "beide zaehlen im Tracker");
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM contributions WHERE feed_item_id>0").get().n, 1);
  // ohne oeffentliches Profil kein Kurzpost
  raw.exec("INSERT INTO contributions(user_id,title,url,published,kind,created) VALUES(2,'x','https://b.example.com/x',1,'blog',1)");
  const id2 = raw.prepare("SELECT id FROM contributions WHERE user_id=2").get().id;
  assert.equal((await json(call(`/api/contributions/review`, "POST", { id: id2, action: "publish" }, { id: 2 }))).error, "profile_required");
});

test("Modus 'Jedes Mal fragen': Neu gefunden, privat, nicht im Export; Tracken / Kurzpost / Ignorieren", async () => {
  const { db, raw, env } = await makeDb(), call = caller(db);
  const created = await json(addSource(call, { kind: "blog", url: "https://dev.example.com/feed.xml" }));   // Standard = ask
  assert.equal(raw.prepare("SELECT mode FROM contribution_sources WHERE id=?").get(created.id).mode, "ask");
  await withFetch({ "https://dev.example.com/feed.xml": { body: fx("blog.atom") } }, () => refreshContributions(env, 5));
  const mine = await json(call("/api/contributions/mine"));
  const pending = mine.contributions.filter((c) => c.found);
  assert.equal(pending.length, 2);
  assert.deepEqual(mine.sources[0].found, 2);
  assert.ok(pending.every((c) => !c.public && c.review === "pending"));
  assert.equal((await json(call("/api/contributions/export?format=csv"))).total, 0, "Funde sind nicht im Export");
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM feed_items").get().n, 0);
  const [a, b] = pending;
  assert.equal((await json(call("/api/contributions/review", "POST", { id: a.id, action: "track" }))).ok, true);
  assert.equal((await json(call("/api/contributions/review", "POST", { id: b.id, action: "publish", ctype: "Video/Webcast" }))).ok, true);
  assert.equal(raw.prepare("SELECT origin FROM feed_items").get().origin, "kurzpost");
  assert.equal(raw.prepare("SELECT ctype FROM contributions WHERE id=?").get(b.id).ctype, "Video/Webcast", "Override je Beitrag");
  assert.equal((await json(call("/api/contributions/export?format=csv"))).total, 2);
  // Ignorieren: weg und kommt nicht wieder
  raw.exec("UPDATE contribution_sources SET fetched=1; DELETE FROM contributions; DELETE FROM feed_items");
  await withFetch({ "https://dev.example.com/feed.xml": { body: fx("blog.atom") } }, () => refreshContributions(env, 5));
  const again = raw.prepare("SELECT id FROM contributions WHERE title='Intune tips'").get();
  assert.equal((await json(call("/api/contributions/review", "POST", { id: again.id, action: "ignore" }))).ok, true);
  raw.exec("UPDATE contribution_sources SET fetched=1");
  await withFetch({ "https://dev.example.com/feed.xml": { body: fx("blog.atom") } }, () => refreshContributions(env, 5));
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM contributions WHERE title='Intune tips'").get().n, 0, "ignoriert bleibt ignoriert");
});

test("Dedupe: dasselbe YouTube-Video aus Blog und Kanal wird einmal gezaehlt; auch per GUID", async () => {
  const { db, raw, env } = await makeDb(), call = caller(db);
  await addSource(call, { kind: "blog", url: "https://dev.example.com/feed.xml", mode: "track" });
  await addSource(call, { kind: "youtube", url: "https://www.youtube.com/channel/UCabcdefghijklmnopqrstuv", mode: "track" });
  await withFetch({ "https://dev.example.com/feed.xml": { body: fx("blog.atom") }, "https://www.youtube.com/feeds/videos.xml": { body: fx("youtube.atom") } }, () => refreshContributions(env, 5));
  const vids = raw.prepare("SELECT url FROM contributions WHERE canon='youtube.com/watch?v=aaaaaaaaaaa'").all();
  assert.equal(vids.length, 1, "Blog-Eintrag (watch?v=) und Kanal (youtu.be) sind dasselbe Video");
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM contributions").get().n, 2);
  // GUID: gleicher Beitrag unter anderer URL
  await addSource(call, { kind: "podcast", url: "https://podcast.example.com/feed.xml", mode: "track" });
  raw.exec("INSERT INTO contributions(user_id,title,url,published,kind,created,guid,canon) VALUES(1,'Old','https://old.example.com/e12',1,'podcast',1,'pod-ep-12','old.example.com/e12')");
  await withFetch({ "https://podcast.example.com/feed.xml": { body: fx("podcast.rss") } }, () => refreshContributions(env, 5));
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM contributions WHERE title LIKE 'Episode 12%'").get().n, 0, "GUID bekannt = zusammengefuehrt");
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM contributions WHERE title LIKE 'Episode 11%'").get().n, 1);
});

test("Zugriff: 'Nur tracken'-Eintraege sieht, aendert und loescht nur der Eigentuemer", async () => {
  const { db, raw, env } = await makeDb(), call = caller(db), ben = { id: 2 };
  const src = await json(addSource(call, { kind: "podcast", url: "https://podcast.example.com/feed.xml", mode: "track" }));
  await withFetch({ "https://podcast.example.com/feed.xml": { body: fx("podcast.rss") } }, () => refreshContributions(env, 5));
  const id = raw.prepare("SELECT id FROM contributions").get().id;
  assert.equal((await json(call("/api/contributions/mine", "GET", undefined, ben))).contributions.length, 0);
  assert.equal((await json(call("/api/contributions/mine", "GET", undefined, ben))).sources.length, 0);
  assert.equal((await json(call("/api/contributions/sources", "GET", undefined, ben))).sources.length, 0);
  for (const action of ["track", "publish", "ignore", "unpublish"]) assert.equal((await call("/api/contributions/review", "POST", { id, action }, ben)).status, 404, action);
  assert.equal((await call("/api/contributions/source/update", "POST", { id: src.id, mode: "publish" }, ben)).status, 404);
  assert.equal((await json(call("/api/contributions/export?format=csv", "GET", undefined, ben))).total, 0);
  assert.equal((await call("/api/contributions/mine", "GET", undefined, null)).status, 401);
  assert.equal((await call("/api/contributions/review-batch", "POST", {}, null)).status, 401);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM contributions").get().n, 2, "nichts veraendert");
  // nicht oeffentlich: Profil-Export enthaelt keine privaten Eintraege
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM contributions WHERE public=1").get().n, 0);
});

test("Vorschau der letzten 3 und Quellenstatus", async () => {
  const { db } = await makeDb(), call = caller(db);
  await withFetch({ "https://dev.example.com/feed.xml": { body: fx("blog.atom") }, "https://bad.example.com/feed": { body: "oops", status: 500 } }, async () => {
    const p = await json(call("/api/contributions/source/preview", "POST", { kind: "blog", url: "https://dev.example.com/feed.xml" }));
    assert.deepEqual(p.items.map((x) => x.title), ["Intune tips", "Video post"]);
    assert.equal(p.items[0].type, "Blog/Article");
    assert.equal((await call("/api/contributions/source/preview", "POST", { kind: "blog", url: "https://bad.example.com/feed" })).status, 422);
    assert.equal((await call("/api/contributions/source/preview", "POST", { kind: "github", url: "https://example.com/x" })).status, 400);
  });
});

test("LinkedIn per Link: nur Open-Graph-Tags (og:title, og:description, Veroeffentlichungsdatum), sonst nichts", async () => {
  const og = ogOnly(fx("linkedin_og.html"));
  assert.deepEqual(og, { title: "Why governance matters & how", description: "A short intro. And more.", published: "2026-04-02" });
  assert.deepEqual(Object.keys(og).sort(), ["description", "published", "title"]);
  const { db } = await makeDb(), call = caller(db);
  await withFetch({ "https://www.linkedin.com/pulse/why-governance": { body: fx("linkedin_og.html"), headers: { "content-type": "text/html" } } }, async (calls) => {
    const r = await json(call("/api/contributions/linkedin-og?url=" + encodeURIComponent("https://www.linkedin.com/pulse/why-governance")));
    const text = JSON.stringify(r);
    assert.deepEqual(Object.keys(r.preview).sort(), ["description", "published", "title", "url"]);
    for (const leak of ["SECRET", "Full article body", "1999", "meta description", "licdn", "Should not be read"]) assert.ok(!text.includes(leak), leak);
    assert.deepEqual(Object.keys(calls[0].headers).sort(), ["accept", "user-agent"], "keine Cookies, keine Zugangsdaten");
    assert.equal(calls[0].headers["user-agent"], BOT_UA);
  });
  assert.equal((await call("/api/contributions/linkedin-og?url=" + encodeURIComponent("https://evil.example.com/pulse/x"))).status, 400);
  assert.equal((await call("/api/contributions/linkedin-og?url=" + encodeURIComponent("https://www.linkedin.com.evil.com/pulse/x"))).status, 400);
});

test("Import gewaehlter Eintraege (LinkedIn-Export, andere Links): Modi, Dedupe, nur Titel/Link/Datum", async () => {
  const { db, raw } = await makeDb(), call = caller(db);
  const items = [{ title: "Governance article", url: "https://www.linkedin.com/pulse/governance-anna", date: "2026-04-02", body: "VOLLTEXT", text: "VOLLTEXT" },
    { title: "Other host", url: "https://evil.example.com/x", date: "2026-04-02" }, { title: "No date", url: "https://www.linkedin.com/pulse/x", date: "" }];
  const r = await json(call("/api/contributions/import", "POST", { kind: "linkedin", mode: "ask", items }));
  assert.deepEqual([r.added, r.pending], [1, 1], "fremder Host und fehlendes Datum fallen heraus");
  const row = raw.prepare("SELECT title,kind,review,published,url,topics FROM contributions").get();
  assert.deepEqual([row.title, row.kind, row.review, row.published], ["Governance article", "article", "pending", Date.parse("2026-04-02T00:00:00Z") / 1000]);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM pragma_table_info('contributions') WHERE name IN ('body','text')").get().n, 0);
  const again = await json(call("/api/contributions/import", "POST", { kind: "linkedin", mode: "track", items: [items[0]] }));
  assert.equal(again.added, 0, "gleicher Link: kein Duplikat");
  assert.equal((await call("/api/contributions/import", "POST", { kind: "podcast", items })).status, 400, "nur manuelle Arten");
  const o = await json(call("/api/contributions/import", "POST", { kind: "other", mode: "track", items: [{ title: "My workshop", url: "", date: "2026-01-01" }] }));
  assert.equal(o.tracked, 1);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM contribution_sources WHERE active=1").get().n, 0, "manuelle Quellen werden nie abgerufen");
});

test("MVP-Zuordnung: Beitragsart je Portal-Kategorie und CSV-Spalte", async () => {
  assert.deepEqual(CTYPES, ["Blog/Article", "Podcast", "Video/Webcast", "Speaking", "Open Source/Code", "Q&A/Forum", "Book", "Other"]);
  const map = { blog: "Blog/Article", article: "Blog/Article", podcast: "Podcast", video: "Video/Webcast", session: "Speaking", github: "Open Source/Code", package: "Open Source/Code", forum: "Q&A/Forum", book: "Book", other: "Other" };
  for (const [k, v] of Object.entries(map)) assert.equal(ctypeOf({ kind: k }), v, k);
  assert.equal(ctypeOf({ kind: "blog", ctype: "Book" }), "Book");
  const { db, raw } = await makeDb(), call = caller(db);
  raw.exec("INSERT INTO contributions(user_id,title,url,published,kind,created) VALUES(1,'Answer','https://stackoverflow.com/a/1',1767225600,'forum',1)");
  const exp = await json(call("/api/contributions/export?format=csv"));
  assert.match(exp.csv.split("\r\n")[0], /"category","mvp_type","topics"/);
  assert.match(exp.csv, /"Q&A\/Forum"/);
});

test("MCP: neue Tools, Standardmodus ask, Vorschau vor Bestaetigung", async () => {
  const names = TOOLS.map((t) => t.name);
  for (const n of ["add_contribution_source", "list_contribution_sources", "review_new_contributions"]) assert.ok(names.includes(n), n);
  const add = TOOLS.find((t) => t.name === "add_contribution_source");
  assert.ok(add.inputSchema.properties.kind.enum.includes("sessionize") && add.inputSchema.properties.mode.enum.join() === "track,publish,ask");
  assert.deepEqual(TOOLS.find((t) => t.name === "review_new_contributions").route, ["POST", "/api/contributions/review-batch"]);
  const { db, raw, env } = await makeDb(), call = caller(db);
  await addSource(call, { kind: "blog", url: "https://dev.example.com/feed.xml" });
  await withFetch({ "https://dev.example.com/feed.xml": { body: fx("blog.atom") } }, () => refreshContributions(env, 5));
  const list = await json(call("/api/contributions/review-batch", "POST", {}));
  assert.equal(list.pending.length, 2);
  const [x, y] = list.pending;
  const prev = await json(call("/api/contributions/review-batch", "POST", { decisions: [{ id: x.id, action: "publish" }, { id: y.id, action: "ignore" }] }));
  assert.equal(prev.confirmed, false);
  assert.match(prev.preview[0].effect, /short post/);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM contributions WHERE review='pending'").get().n, 2, "Vorschau aendert nichts");
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM feed_items").get().n, 0);
  assert.equal((await call("/api/contributions/review-batch", "POST", { decisions: [{ id: 9999, action: "track" }], confirm: true })).status, 400);
  const done = await json(call("/api/contributions/review-batch", "POST", { decisions: [{ id: x.id, action: "publish" }, { id: y.id, action: "ignore" }], confirm: true }));
  assert.deepEqual(done.results.map((r) => r.ok), [true, true]);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM feed_items WHERE origin='kurzpost'").get().n, 1);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM contributions WHERE review='pending'").get().n, 0);
  assert.equal((await json(call("/api/contributions/review-batch", "POST", {}, { id: 2 }))).pending.length, 0, "fremde Funde bleiben unsichtbar");
});
