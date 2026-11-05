// MVP-Tracker (#231): Portal-Felder (format=mvp/gde), Portal-Status, Session-Pruefung, oeffentliche Sichtbarkeit, bedingte MCP-Tools.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { handleContributions, previewFromHtml } from "../src/contributions.js";
import { mvpActivity, gdeActivity, MVP_AUDIENCES } from "../src/mvp_mapping.js";
import { refreshProfilesExport } from "../src/profiles.js";
import { handleMcp, visibleTools, TOOLS } from "../src/mcp.js";
import { sha256hex } from "../src/util.js";

async function makeDb() {
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
    async batch(stmts) { for (const st of stmts) await st.run(); },
  };
  raw.exec("INSERT INTO users(id,provider,sub,name,created) VALUES(1,'g','1','Anna',1),(2,'g','2','Ben',1)");
  raw.exec("INSERT INTO profiles(user_id,public,handle,headline,about,company,job,country,show_org,updated) VALUES(1,1,'anna','','','','','',1,1)");
  return { db, raw };
}

const J = (data, status = 200, headers = {}) => new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json", ...headers } });
function caller(db) {
  return (path, method = "GET", data, actor = { id: 1 }) => {
    const url = new URL(`https://x${path}`);
    return handleContributions({ DB: db }, new Request(url, { method, headers: { "content-type": "application/json" }, ...(data === undefined ? {} : { body: JSON.stringify(data) }) }), url, url.pathname, actor, J);
  };
}
const json = async (r) => (await r).json();

test("format=mvp: Typ-Zuordnung, Rollen, Kennzahlen und Pruefregeln nach dem MVP-Portal", () => {
  const base = { title: "Copilot governance", url: "https://example.com/x", published: 1767225600, portal_desc: "About governance", audience: '["IT Pro"]', area: "Microsoft 365 Copilot", views: 120, downloads: 0 };
  const video = mvpActivity({ ...base, kind: "video", live_views: 30 });
  assert.equal(video.activity.activityTypeName, "Video");
  assert.equal(video.activity.role, "Presenter", "Standardrolle Video");
  assert.equal(video.activity.onDemandViews, 120);
  assert.equal(video.activity.liveStreamViews, 30);
  assert.equal(video.activity.numberOfSessions, 1);
  assert.deepEqual(video.activity.additionalTechnologyAreas, [], "additionalTechnologyAreas bleibt leer");
  assert.equal(video.activity.date, "2026-01-01");
  assert.equal(video.ready, true);
  const podcast = mvpActivity({ ...base, kind: "podcast", downloads: 900, views: 0 });
  assert.deepEqual([podcast.activity.activityTypeName, podcast.activity.role, podcast.activity.onDemandViews], ["Video", "Host", 900]);
  assert.equal(mvpActivity({ ...base, kind: "podcast", role: "Speaker" }).activity.role, "Speaker", "erlaubte Rolle bleibt");
  assert.equal(mvpActivity({ ...base, kind: "podcast", role: "Author" }).activity.role, "Host", "Rolle eines anderen Typs fällt auf den Standard zurück");
  const blog = mvpActivity({ ...base, kind: "blog" }), article = mvpActivity({ ...base, kind: "article" });
  assert.deepEqual([blog.activity.activityTypeName, blog.activity.role, blog.activity.numberOfViews], ["Blog", "Author", 120]);
  assert.equal(article.activity.activityTypeName, "Blog");
  const talk = mvpActivity({ ...base, kind: "session", attendees: 80, sessions: 2, role: "Panelist" });
  assert.deepEqual([talk.activity.activityTypeName, talk.activity.typeName, talk.activity.role, talk.activity.inPersonAttendees, talk.activity.numberOfSessions],
    ["Speaking (Conference)", "Speaking", "Panelist", 80, 2]);
  assert.equal(mvpActivity({ ...base, kind: "book" }).activity.activityTypeName, "Book/E-book");
  assert.equal(mvpActivity({ ...base, kind: "github" }), null, "GitHub hat keine Zuordnung (nicht im Kommentar vom 5.11.)");
  assert.equal(mvpActivity({ ...base, kind: "other", category: "Blog" }).activity.activityTypeName, "Blog", "Kategorie als Rückfall");

  const bad = mvpActivity({ ...base, kind: "blog", title: "x".repeat(101), portal_desc: "d".repeat(1001), url: "http://example.com/", audience: '["Hacker"]', area: "" });
  const codes = Object.fromEntries(bad.issues.map((i) => [i.field, i.code]));
  assert.deepEqual(codes, { title: "too_long", description: "too_long", url: "not_https", targetAudience: "missing", technologyFocusArea: "missing" });
  assert.equal(bad.issues.find((i) => i.field === "title").limit, 100);
  assert.equal(bad.ready, false);
  assert.equal(mvpActivity({ ...base, kind: "blog", title: "x".repeat(100) }).ready, true, "100 Zeichen sind erlaubt");
  assert.deepEqual(MVP_AUDIENCES.slice(0, 2), ["Developer", "Technical Decision Maker"]);
});

test("format=gde: Advocu-Zuordnung und Pruefregeln", () => {
  const base = { title: "Talk", url: "https://example.com/t", published: 1767225600, portal_desc: "desc" };
  const talk = gdeActivity({ ...base, kind: "session", attendees: 40, live_views: 10, event_format: "In-Person" });
  assert.equal(talk.type, "public-speaking");
  assert.equal(talk.activity.metrics.attendees, 50);
  assert.deepEqual(talk.issues, [{ field: "country", code: "missing" }], "Land ist bei Präsenz Pflicht");
  assert.equal(gdeActivity({ ...base, kind: "session", attendees: 40, event_format: "In-Person", country: "Germany" }).ready, true);
  assert.equal(gdeActivity({ ...base, kind: "session", attendees: 40, event_format: "Virtual" }).ready, true);
  const video = gdeActivity({ ...base, kind: "video", views: 0 });
  assert.deepEqual([video.type, video.activity.contentType], ["content-creation", "Videos"]);
  assert.deepEqual(video.issues, [{ field: "metrics", code: "missing" }], "metrics mindestens 1");
  assert.equal(gdeActivity({ ...base, kind: "workshop", attendees: 3, event_format: "Virtual" }).type, "workshop");
  assert.equal(gdeActivity({ ...base, kind: "mentoring", attendees: 1, event_format: "Virtual" }).type, "mentoring");
  assert.equal(gdeActivity({ ...base, kind: "blog", title: "ab", views: 5 }).issues[0].code, "too_short", "Titel 3-200");
  assert.equal(gdeActivity({ ...base, kind: "other" }), null);
});

test("Tracker-API: Portal-Status, Session-Pruefung, Export format=mvp und Filter", async () => {
  const { db, raw } = await makeDb(), call = caller(db);
  const add = (b) => json(call("/api/contributions/manual", "POST", b));
  const blog = await add({ title: "Fabric post", kind: "blog", url: "https://example.com/fabric", published: "2026-05-02", description: "Fabric intro", role: "Author", audience: ["Developer"], area: "Microsoft Fabric", views: 300 });
  assert.ok(blog.ok, JSON.stringify(blog));
  assert.equal((await json(call("/api/contributions/manual", "POST", { title: "Bad role", kind: "blog", published: "2026-05-02", role: "King" }))).error, "bad_field");
  const badAudience = await json(call("/api/contributions/manual", "POST", { title: "Bad audience", kind: "blog", published: "2026-05-02", audience: ["Hacker"] }));
  assert.deepEqual([badAudience.error, badAudience.field], ["bad_field", "audience"]);
  assert.ok(badAudience.message, "Fehler kommen mit lesbarem Text");
  const book = await add({ title: "My book", kind: "book", published: "2026-06-01" });
  assert.equal(raw.prepare("SELECT category FROM contributions WHERE id=?").get(book.id).category, "Book/E-book");
  raw.exec(`INSERT INTO contributions(user_id,title,url,published,kind,category,public,review,created) VALUES
    (1,'Scraped talk','https://events.example/talk',1780000000,'session','Speaker/Presenter',1,'pending',1),
    (1,'Repo','https://github.com/anna/repo',1780000000,'github','',0,'',1)`);
  const pendingId = raw.prepare("SELECT id FROM contributions WHERE review='pending'").get().id;

  const mine = await json(call("/api/contributions/mine"));
  const mineBlog = mine.contributions.find((c) => c.id === blog.id);
  assert.equal(mineBlog.mvp.activity.activityTypeName, "Blog");
  assert.equal(mineBlog.mvp.ready, true);
  assert.equal(mineBlog.portal, false);
  assert.equal(mine.contributions.find((c) => c.id === pendingId).review, "pending");
  assert.ok(mine.options.audiences.includes("IT Pro"));

  let exp = await json(call("/api/contributions/export?format=mvp&from=2026-04-01&to=2027-03-31"));
  assert.equal(exp.format, "mvp");
  assert.ok(!exp.items.some((x) => x.id === pendingId), "unbestätigte Sessions fehlen im Export");
  assert.deepEqual(exp.skipped.map((x) => x.reason), ["no_mvp_type"], "GitHub ohne MVP-Typ wird ausgewiesen");
  assert.equal(exp.portal, "https://mvp.microsoft.com/");
  const item = exp.items.find((x) => x.id === blog.id);
  assert.deepEqual(item.activity, { activityTypeName: "Blog", typeName: "Blog", date: "2026-05-02", title: "Fabric post", description: "Fabric intro", url: "https://example.com/fabric",
    role: "Author", targetAudience: ["Developer"], technologyFocusArea: "Microsoft Fabric", additionalTechnologyAreas: [], numberOfViews: 300 });

  assert.equal((await call("/api/contributions/update", "POST", { id: pendingId, review: "" })).status, 200, "Session bestätigen");
  exp = await json(call("/api/contributions/export?format=mvp"));
  assert.ok(exp.items.some((x) => x.id === pendingId && x.activity.activityTypeName === "Speaking (Conference)"));
  assert.equal((await call("/api/contributions/update", "POST", { id: pendingId, review: "pending" })).status, 400, "pending setzt nur der Import");
  assert.equal((await call("/api/contributions/update", "POST", { id: pendingId, review: "hidden" })).status, 200);
  exp = await json(call("/api/contributions/export"));
  assert.ok(!exp.items.some((x) => x.id === pendingId), "verborgene Einträge fehlen im Export");

  assert.equal((await call("/api/contributions/update", "POST", { id: blog.id, portal: true })).status, 200);
  const row = raw.prepare("SELECT portal,portal_at FROM contributions WHERE id=?").get(blog.id);
  assert.equal(row.portal, 1); assert.ok(row.portal_at > 0);
  assert.deepEqual((await json(call("/api/contributions/export?portal=open"))).items.map((x) => x.id).includes(blog.id), false);
  assert.deepEqual((await json(call("/api/contributions/export?portal=entered"))).items.map((x) => x.id), [blog.id]);
  const csv = await json(call("/api/contributions/export?category=Blog"));
  assert.deepEqual(csv.items.map((x) => x.id), [blog.id], "Kategorie-Filter");
  assert.ok(csv.csv.split("\r\n")[0].endsWith('"in_portal"'));
  assert.ok(csv.csv.includes('"yes"'));
  assert.ok((await json(call("/api/contributions/export?category=Blog&lang=de"))).copy.startsWith("Kategorie: Blog"));
  assert.ok(csv.copy.startsWith("Category: Blog"));
  assert.equal((await json(call("/api/contributions/export?format=pdf"))).error, "bad_format");
  assert.equal((await json(call("/api/contributions/export?category=Nope"))).error, "bad_category");
  assert.equal((await json(call("/api/contributions/export?format=gde"))).format, "gde");

  // Bearbeiten: nur manuelle Einträge dürfen Titel/Link/Datum/Art ändern
  const repoId = raw.prepare("SELECT id FROM contributions WHERE kind='github'").get().id;
  raw.prepare("UPDATE contributions SET manual=0 WHERE id=?").run(repoId);
  assert.equal((await json(call("/api/contributions/update", "POST", { id: repoId, title: "Renamed" }))).error, "not_editable");
  assert.equal((await call("/api/contributions/update", "POST", { id: blog.id, title: "Fabric post v2", published: "2026-05-03", url: "https://example.com/fabric2", sessions: 2, event_format: "Virtual" })).status, 200);
  assert.equal((await json(call("/api/contributions/update", "POST", { id: blog.id, attendees: -1 }))).error, "bad_field");
  assert.equal((await json(call("/api/contributions/update", "POST", { id: blog.id, event_format: "Moon" }))).error, "bad_field");
  assert.equal((await call("/api/contributions/update", "POST", { id: blog.id, portal: true }, { id: 2 })).status, 404, "nur eigene Einträge");
});

test("Quellen: GitHub, Bearbeiten von Name/Link, Pausieren und Reaktivieren", async () => {
  const { db, raw } = await makeDb(), call = caller(db);
  assert.equal((await call("/api/contributions/source", "POST", { kind: "github", url: "https://github.com/anna" })).status, 201);
  assert.equal((await call("/api/contributions/source", "POST", { kind: "github", url: "https://example.com/anna" })).status, 400);
  const id = raw.prepare("SELECT id FROM contribution_sources").get().id;
  raw.prepare("UPDATE contribution_sources SET fails=5, feed='https://github.com/anna.atom' WHERE id=?").run(id);
  assert.equal((await call("/api/contributions/source/update", "POST", { id, title: "Anna on GitHub", url: "https://github.com/anna-dev" })).status, 200);
  const s = raw.prepare("SELECT title,url,feed,fails FROM contribution_sources WHERE id=?").get(id);
  assert.deepEqual([s.title, s.url, s.feed, s.fails], ["Anna on GitHub", "https://github.com/anna-dev", "", 0], "neuer Link startet die Feed-Suche neu");
  assert.equal((await call("/api/contributions/source/update", "POST", { id, url: "https://evil.example/anna" })).status, 400);
  assert.equal((await call("/api/contributions/source/update", "POST", { id, active: false })).status, 200);
  assert.equal((await json(call("/api/contributions/mine"))).sources[0].status, "paused");
  assert.equal((await call("/api/contributions/source/update", "POST", { id, active: true })).status, 200);
  assert.equal((await json(call("/api/contributions/mine"))).sources[0].status, "active");
});

test("Öffentliches Profil zeigt nur public=1 und bestätigte Beiträge; Privatstellen verwirft den Zwischenspeicher", async () => {
  const { db, raw } = await makeDb(), call = caller(db);
  raw.exec(`INSERT INTO contributions(user_id,title,url,published,kind,category,public,review,created) VALUES
    (1,'Public talk','https://example.com/public',1767225600,'session','Speaker/Presenter',1,'',1),
    (1,'Private draft','https://example.com/private',1767225600,'article','Blog',0,'',1),
    (1,'Pending talk','https://example.com/pending',1767225600,'session','Speaker/Presenter',1,'pending',1),
    (1,'Hidden talk','https://example.com/hidden',1767225600,'session','Speaker/Presenter',1,'hidden',1),
    (2,'Ben public','https://example.com/ben',1767225600,'blog','Blog',1,'',1)`);
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify({ entities: [] }));
  try {
    const out = await refreshProfilesExport({ DB: db, SITE: "https://example.test" });
    assert.deepEqual(out.people[0].mvp_contributions.map((x) => x.title), ["Public talk"]);
    const text = JSON.stringify(out);
    for (const hidden of ["Private draft", "Pending talk", "Hidden talk", "Ben public"]) assert.ok(!text.includes(hidden), `${hidden} erscheint nicht öffentlich`);
    raw.prepare("INSERT INTO export_cache(k,v,updated) VALUES('profiles','{}',1) ON CONFLICT(k) DO UPDATE SET v=excluded.v").run();
    const publicId = raw.prepare("SELECT id FROM contributions WHERE title='Public talk'").get().id;
    assert.equal((await call("/api/contributions/update", "POST", { id: publicId, public: false })).status, 200);
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM export_cache WHERE k='profiles'").get().n, 0, "Privatstellen verwirft den öffentlichen Zwischenspeicher");
    assert.deepEqual((await refreshProfilesExport({ DB: db, SITE: "https://example.test" })).people[0].mvp_contributions, []);
    raw.prepare("UPDATE contributions SET public=1 WHERE id=?").run(publicId);
    raw.prepare("UPDATE profiles SET public=0 WHERE user_id=1").run();
    assert.ok(!JSON.stringify(await refreshProfilesExport({ DB: db, SITE: "https://example.test" })).includes("Public talk"), "privates Profil zeigt keine Beiträge");
  } finally { globalThis.fetch = originalFetch; }
});

test("Per Link: Metadaten-Vorschlag aus einer Seite", () => {
  const html = `<html><head><title>Fallback</title><meta property="og:title" content="Teams Phone &amp; Copilot"><meta name="description" content="Short summary">
    <meta property="article:published_time" content="2026-03-04T10:00:00Z"></head></html>`;
  assert.deepEqual(previewFromHtml(html, "https://blog.example.com/p"), { url: "https://blog.example.com/p", title: "Teams Phone & Copilot", published: "2026-03-04", description: "Short summary", kind: "blog" });
  assert.equal(previewFromHtml('<script>{"uploadDate":"2025-12-01T00:00:00"}</script>', "https://www.youtube.com/watch?v=abc").published, "2025-12-01");
  assert.equal(previewFromHtml("", "https://www.youtube.com/watch?v=abc").kind, "video");
  assert.equal(previewFromHtml("", "https://sessionize.com/x").kind, "session");
  assert.equal(previewFromHtml("<title><script>x</script></title>", "https://example.com/").title.includes("<"), false);
});

test("MCP: Programm-Tools nur mit aktivem Programm, Fehler als lesbarer Text, format=mvp über die Brücke", async () => {
  const { db, raw } = await makeDb();
  const env = { DB: db }, token = "m365_testtoken";
  raw.prepare("INSERT INTO api_tokens(hash,user_id,created) VALUES(?,1,1)").run(await sha256hex(token));
  raw.exec("INSERT INTO contributions(user_id,title,url,published,kind,category,created) VALUES(1,'Talk','https://example.com/t',1767225600,'session','Speaker/Presenter',1)");
  const dispatch = (req, user) => { const u = new URL(req.url); return handleContributions(env, req, u, u.pathname, user, J); };
  const rpc = async (body, auth = true) => (await handleMcp(env, new Request("https://x/mcp", { method: "POST", headers: { "content-type": "application/json", ...(auth ? { authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify(body) }),
    async (id) => ({ id }), dispatch)).json();
  const names = async (auth) => (await rpc({ jsonrpc: "2.0", id: 1, method: "tools/list" }, auth)).result.tools.map((t) => t.name);
  assert.ok(!(await names(true)).includes("export_mvp_activities"), "ohne Programm unsichtbar");
  assert.ok(!(await names(false)).includes("export_gde_activities"));
  assert.ok((await names(true)).includes("export_contributions"));
  const denied = JSON.parse((await rpc({ jsonrpc: "2.0", id: 2, method: "tools/call", params: { name: "export_mvp_activities", arguments: {} } })).result.content[0].text);
  assert.equal(denied.error, "program_inactive");
  assert.match(denied.message, /program MVP/);
  raw.exec("INSERT INTO programs(owner_type,owner_id,program) VALUES('u',1,'mvp')");
  const list = await names(true);
  assert.ok(list.includes("export_mvp_activities") && !list.includes("export_gde_activities"));
  const res = await rpc({ jsonrpc: "2.0", id: 3, method: "tools/call", params: { name: "export_mvp_activities", arguments: { portal: "open" } } });
  const data = JSON.parse(res.result.content[0].text);
  assert.equal(data.format, "mvp");
  assert.equal(data.items[0].activity.activityTypeName, "Speaking (Conference)");
  const viaExport = JSON.parse((await rpc({ jsonrpc: "2.0", id: 4, method: "tools/call", params: { name: "export_contributions", arguments: { format: "mvp", from: "2026-13-01" } } })).result.content[0].text);
  assert.equal(viaExport.error, "bad_period");
  assert.ok(viaExport.message.includes("YYYY-MM-DD"), "Fehlertext kommt über die Brücke mit");
  assert.ok(TOOLS.filter((t) => t.program).every((t) => t.route && t.fixed && t.de));
  assert.equal((await visibleTools(env, null)).some((t) => t.program), false);
});
