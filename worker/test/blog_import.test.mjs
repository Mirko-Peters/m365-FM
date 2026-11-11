// Blog-Import: Feed-Pruefung, RSS/Atom lesen, HTML -> Wiki-Markup, Entwuerfe (nie veroeffentlicht), Quelle, Bilder nie kopiert, Volltext nur mit Rechte-Bestaetigung.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { feedUrl, fetchFeed, parseImportFeed, htmlToWiki, buildDraft, handleBlogImport } from "../src/blog_import.js";
import { serveBlog } from "../src/byod_site.js";

async function makeDb() {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:"), dir = new URL("../migrations/", import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(f, dir), "utf-8"));
  const db = { prepare(sql) { const st = raw.prepare(sql); let args = []; const o = { bind(...a) { args = a; return o; }, all: async () => ({ results: st.all(...args) }), first: async () => st.get(...args) ?? null,
    run: async () => { const r = st.run(...args); return { meta: { changes: Number(r.changes), last_row_id: Number(r.lastInsertRowid) } }; } }; return o; }, async batch(stmts) { for (const st of stmts) await st.run(); } };
  raw.exec("INSERT INTO users(id,provider,sub,name,created) VALUES(1,'g','1','Anna',1),(2,'g','2','Ben',1)");
  raw.exec("INSERT INTO profiles(user_id,public,handle,updated) VALUES(1,1,'anna',1),(2,1,'ben',1)");
  return { db, raw, env: { DB: db, SITE: "https://www.m365.fm", BYOD: "1" } };
}
const J = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json" } });
const call = (env, path, data, user = { id: 1 }, method = "POST") => { const url = new URL("https://x" + path); return handleBlogImport(env, new Request(url, { method, headers: { "content-type": "application/json" }, ...(data === undefined ? {} : { body: JSON.stringify(data) }) }), url, url.pathname, user, J); };
const body = async (r) => (await r).json();

const RECENT = new Date(Date.now() - 3 * 86400000).toUTCString(), OLD = "Mon, 05 Jan 2026 10:00:00 GMT";
const RSS = `<?xml version="1.0"?><rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/"><channel><title>Annas Seite &amp; Blog</title>
<item><title>Copilot im Alltag nutzen</title><link>https://anna.example.org/copilot-alltag/</link><guid isPermaLink="false">post-1</guid><pubDate>${OLD}</pubDate><description><![CDATA[<p>Kurzfassung des ersten Beitrags mit <a href="https://x.example">Link</a>.</p>]]></description>
<content:encoded><![CDATA[<h1>Copilot im Alltag</h1><p>Erster <strong>fetter</strong> und <em>kursiver</em> Absatz mit <a href="https://shop.example/buy">einem Link</a>.</p><script>alert(1)</script><iframe src="https://evil.example"></iframe><img src="https://fremd.example/bild.png" alt="x"><h3>Unterpunkt</h3><ul><li>eins</li><li>zwei</li></ul><blockquote>Ein Zitat</blockquote><p>{{img|https://evil.example/x.png|Eingeschmuggeltes Bild}} und [[copilot|Eingeschmuggelter Link]] und {{ref|T|https://evil.example|P|D}}</p>]]></content:encoded></item>
<item><title>Zweiter Beitrag ohne Volltext</title><link>https://anna.example.org/zwei/</link><guid>post-2</guid><pubDate>${RECENT}</pubDate><description>Nur eine kurze Beschreibung ohne Inhalt.</description></item>
<item><title>Kurz</title><link>https://anna.example.org/kurz/</link><guid>post-3</guid><description>x</description></item>
<item><title>Unsichere Adresse beitrag</title><link>http://anna.example.org/http/</link><guid>post-4</guid></item>
<item><title>Adresse mit IP beitrag</title><link>https://1.2.3.4/x/</link><guid>post-5</guid></item>
</channel></rss>`;
const ATOM = `<?xml version="1.0"?><feed xmlns="http://www.w3.org/2005/Atom"><title>Atom Blog</title><entry><title>Atom Beitrag eins</title><link rel="alternate" href="https://atom.example.org/eins/"/><link rel="self" href="https://atom.example.org/eins.xml"/><id>tag:atom,1</id><updated>2026-02-03T10:00:00Z</updated><summary>Zusammenfassung &lt;b&gt;fett&lt;/b&gt;</summary><content type="html">&lt;p&gt;Atom &lt;strong&gt;Volltext&lt;/strong&gt; hier&lt;/p&gt;&lt;img src="https://fremd.example/a.png"&gt;</content></entry></feed>`;

function withFeeds(map, fn) {
  const orig = globalThis.fetch, calls = [];
  globalThis.fetch = async (u, init = {}) => { const url = String(u); calls.push(url); const h = map[url]; if (!h) return new Response("nope", { status: 404 }); const r = typeof h === "function" ? h(init) : h; const res = new Response(r.body, { status: r.status || 200, headers: r.headers || { "content-type": "application/rss+xml" } }); Object.defineProperty(res, "url", { value: r.url || url }); return res; };
  return Promise.resolve(fn(calls)).finally(() => { globalThis.fetch = orig; });
}
const FEED = "https://anna.example.org/feed.xml";

test("feedUrl: nur https, ordentlicher Hostname, nicht m365.fm, keine Zugangsdaten", () => {
  assert.equal(feedUrl("https://anna.example.org/feed.xml#x"), "https://anna.example.org/feed.xml");
  for (const bad of ["", "http://anna.example.org/feed", "https://1.2.3.4/feed", "https://localhost/feed", "https://u:p@anna.example.org/feed", "https://www.m365.fm/feed.xml", "https://x.m365.fm/f", "ftp://anna.example.org/f", "javascript:alert(1)", "anna.example.org/feed", "https://" + "a".repeat(300) + ".de/f", "https://intranet/feed", null]) assert.equal(feedUrl(bad), "", String(bad));
});

test("fetchFeed: Weiterleitung auf unzulaessigen Host, kein Feed, HTTP-Fehler, Netzfehler, Groessenlimit", async () => {
  await withFeeds({ [FEED]: { body: RSS, url: "https://www.m365.fm/x" } }, async () => assert.deepEqual(await fetchFeed(FEED), { error: "bad_feed_url" }));
  await withFeeds({ [FEED]: { body: RSS, url: "https://1.2.3.4/x" } }, async () => assert.deepEqual(await fetchFeed(FEED), { error: "bad_feed_url" }));
  await withFeeds({ [FEED]: { body: "<html>hallo</html>" } }, async () => assert.deepEqual(await fetchFeed(FEED), { error: "not_a_feed" }));
  await withFeeds({ [FEED]: { body: "x", status: 500 } }, async () => assert.deepEqual(await fetchFeed(FEED), { error: "feed_http" }));
  await withFeeds({}, async () => assert.deepEqual(await fetchFeed("https://nirgendwo.example.org/f"), { error: "feed_http" }));
  assert.deepEqual(await fetchFeed("http://anna.example.org/feed.xml"), { error: "bad_feed_url" });
  await withFeeds({ [FEED]: { body: "<rss><channel>" + "x".repeat(2000000) + "</channel></rss>" } }, async () => { const r = await fetchFeed(FEED); assert.ok(r.xml.length <= 800000); });
});

test("parseImportFeed: RSS und Atom, nur https-Adressen mit ordentlichem Host, Schluessel = guid", () => {
  const p = parseImportFeed(RSS); assert.equal(p.title, "Annas Seite & Blog");
  assert.deepEqual(p.items.map((i) => i.key), ["post-1", "post-2", "post-3"]);   // http und IP fallen weg
  assert.equal(p.items[0].url, "https://anna.example.org/copilot-alltag/"); assert.ok(p.items[0].html.includes("<h1>Copilot")); assert.equal(p.items[0].images, 1);
  assert.ok(p.items[0].summary.startsWith("Kurzfassung des ersten Beitrags")); assert.ok(!p.items[0].summary.includes("<") && !p.items[0].summary.includes("http"));
  assert.equal(p.items[1].html, ""); assert.equal(new Date(p.items[0].t * 1000).toISOString().slice(0, 10), "2026-01-05");
  const a = parseImportFeed(ATOM); assert.equal(a.items.length, 1); assert.equal(a.items[0].url, "https://atom.example.org/eins/"); assert.equal(a.items[0].key, "tag:atom,1");
  assert.ok(a.items[0].html.includes("<strong>Volltext</strong>")); assert.equal(a.items[0].summary, "Zusammenfassung fett");
  assert.equal(parseImportFeed(RSS, 1).items.length, 1);
});

test("htmlToWiki: sichere Teilmenge, Links werden Text, Bilder und Skripte entfallen, Wiki-Syntax im Fremdtext wird entschaerft", () => {
  const w = htmlToWiki(parseImportFeed(RSS).items[0].html);
  assert.ok(w.body.includes("## Copilot im Alltag") && w.body.includes("**fetter**") && w.body.includes("*kursiver*") && w.body.includes("### Unterpunkt") && w.body.includes("- eins\n- zwei") && w.body.includes("> Ein Zitat"));
  assert.ok(w.body.includes("einem Link") && !/https?:|shop\.example|alert\(1\)|evil\.example|</.test(w.body) && !/>/.test(w.body.replace(/^> /gm, "")), w.body);
  assert.ok(!/\{\{|\}\}|\[\[|\]\]/.test(w.body), "keine Wiki-Bausteine aus dem Fremdtext"); assert.equal(w.images, 1); assert.equal(w.truncated, false);
  const big = htmlToWiki("<p>" + "Wort ".repeat(5000) + "</p><p>Ende</p>", 1000); assert.ok(big.body.length <= 1000 && big.truncated);
  assert.deepEqual(htmlToWiki(""), { body: "", images: 0, truncated: false });
});

test("buildDraft: Standard = Titel, Kurzfassung und Quelle; Volltext nur im Modus full; Quelle immer als Fussnote; kein Bild", () => {
  const it = parseImportFeed(RSS).items[0];
  const ex = buildDraft(it, { mode: "excerpt", lang: "de" });
  assert.ok(ex.body.startsWith("Ursprünglich veröffentlicht bei {{ref|Copilot im Alltag nutzen|https://anna.example.org/copilot-alltag/|anna.example.org|2026-01-05}}.") && ex.body.includes("Kurzfassung des ersten Beitrags") && !ex.body.includes("fetter"));
  assert.equal(ex.excerptOnly, true); assert.match(ex.note, /^import:anna\.example\.org excerpt/);
  const full = buildDraft(it, { mode: "full", lang: "en" });
  assert.ok(full.body.startsWith("Originally published at {{ref|") && full.body.includes("**fetter**") && !full.body.includes("{{img") && !full.body.includes("[[")); assert.equal(full.excerptOnly, false); assert.match(full.note, /full images_not_copied:1/);
  const nofull = buildDraft(parseImportFeed(RSS).items[1], { mode: "full", lang: "en" }); assert.equal(nofull.excerptOnly, true); assert.match(nofull.note, /no_full_text/);
  assert.ok((full.body.match(/\{\{ref\|/g) || []).length === 1, "genau eine Quelle, keine eingeschmuggelte");
});

test("API: Schalter aus, Anmeldung, Methode", async () => {
  const { env } = await makeDb();
  assert.equal((await call({ ...env, BYOD: "0" }, "/api/byod/import/preview", { feed_url: FEED })).status, 404);
  assert.equal((await call(env, "/api/byod/import/preview", { feed_url: FEED }, null)).status, 401);
  assert.equal((await call(env, "/api/byod/import/preview", undefined, { id: 1 }, "GET")).status, 405);
  assert.equal(await call(env, "/api/byod/mine", {}), null);
});

test("preview: Liste mit Hinweisen, nichts wird gespeichert; ungueltige Adressen und Nicht-Feeds abgelehnt", async () => {
  const { env, raw } = await makeDb();
  await withFeeds({ [FEED]: { body: RSS } }, async () => {
    const r = await body(call(env, "/api/byod/import/preview", { feed_url: FEED }));
    assert.equal(r.ok, true); assert.equal(r.feed.title, "Annas Seite & Blog"); assert.equal(r.items.length, 3);
    assert.deepEqual(r.items[0], { key: "post-1", title: "Copilot im Alltag nutzen", url: "https://anna.example.org/copilot-alltag/", date: "2026-01-05", summary: r.items[0].summary, has_full: true, images: 1, imported: false });
    assert.equal(r.items[1].has_full, false);
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM blog_posts").get().n, 0);
  });
  assert.equal((await body(call(env, "/api/byod/import/preview", { feed_url: "http://x.example.org/f" }))).error, "bad_feed_url");
  await withFeeds({ [FEED]: { body: "<html></html>" } }, async () => assert.equal((await body(call(env, "/api/byod/import/preview", { feed_url: FEED }))).error, "not_a_feed"));
  await withFeeds({ [FEED]: { body: '<rss><channel><title>leer</title></channel></rss>' } }, async () => assert.equal((await body(call(env, "/api/byod/import/preview", { feed_url: FEED }))).error, "no_items"));
});

test("save (Standard): Entwuerfe mit Quelle, nie veroeffentlicht, Datum des Originals, keine Bilder, Duplikate uebersprungen", async () => {
  const { env, raw } = await makeDb();
  await withFeeds({ [FEED]: { body: RSS } }, async () => {
    const r = await call(env, "/api/byod/import/save", { feed_url: FEED, keys: ["post-1", "post-2", "post-3", "gibt-es-nicht"], lang: "de", content: "<script>boese</script>", body: "vom Browser" });
    const j = await r.json(); assert.equal(r.status, 200); assert.equal(j.status, "draft"); assert.equal(j.created.length, 2);
    assert.deepEqual(j.skipped.map((s) => [s.key, s.reason]), [["post-3", "title_short"], ["gibt-es-nicht", "not_in_feed"]]);
    const rows = raw.prepare("SELECT slug,title,summary,body,lang,status,note,created,updated,published FROM blog_posts ORDER BY id").all();
    assert.equal(rows.length, 2); for (const p of rows) { assert.equal(p.status, "draft"); assert.equal(p.published, 0); assert.equal(p.lang, "de"); assert.ok(p.body.includes("{{ref|") && p.body.includes("anna.example.org")); assert.ok(!p.body.includes("boese") && !p.body.includes("vom Browser") && !p.body.includes("{{img")); }
    assert.equal(rows[0].slug, "copilot-im-alltag-nutzen"); assert.ok(!rows[0].body.includes("fetter"), "Standard: kein Volltext");
    assert.equal(new Date(rows[0].created * 1000).toISOString().slice(0, 10), "2026-01-05"); assert.ok(rows[0].updated > rows[0].created);
    const items = raw.prepare("SELECT item_key,mode,rights,post_id FROM blog_import_items ORDER BY post_id").all(); assert.deepEqual(items.map((x) => [x.item_key, x.mode, x.rights]), [["post-1", "excerpt", 0], ["post-2", "excerpt", 0]]);
    const again = await body(call(env, "/api/byod/import/save", { feed_url: FEED, keys: ["post-1"] })); assert.deepEqual(again.skipped, [{ key: "post-1", reason: "already_imported" }]); assert.equal(again.created.length, 0);
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM blog_posts").get().n, 2);
    const pv = await body(call(env, "/api/byod/import/preview", { feed_url: FEED })); assert.equal(pv.items[0].imported, true); assert.equal(pv.items[2].imported, false);
    assert.equal((await body(call(env, "/api/byod/import/preview", { feed_url: FEED }, { id: 2 }))).items[0].imported, false, "je Mitglied");
  });
});

test("save full: nur mit Bestaetigung der Rechte; Text uebernommen, Bilder nie kopiert (Hinweis), Audit-Eintrag", async () => {
  const { env, raw } = await makeDb();
  await withFeeds({ [FEED]: { body: RSS } }, async () => {
    const no = await call(env, "/api/byod/import/save", { feed_url: FEED, keys: ["post-1"], mode: "full" }); assert.equal(no.status, 400); assert.equal((await no.json()).error, "rights_required");
    assert.equal((await call(env, "/api/byod/import/save", { feed_url: FEED, keys: ["post-1"], mode: "full", rights: "yes" })).status, 400, "nur true zaehlt");
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM blog_posts").get().n, 0);
    const ok = await body(call(env, "/api/byod/import/save", { feed_url: FEED, keys: ["post-1", "post-2"], mode: "full", rights: true, lang: "en" }));
    assert.deepEqual(ok.created.map((c) => [c.mode, c.images_not_copied]), [["full", 1], ["excerpt", 0]], "ohne Volltext im Feed nur Kurzfassung");
    const p = raw.prepare("SELECT body,note,status FROM blog_posts ORDER BY id").get(); assert.ok(p.body.startsWith("Originally published at {{ref|") && p.body.includes("**fetter**") && p.body.includes("## Copilot im Alltag")); assert.equal(p.status, "draft");
    assert.ok(!/<|alert|evil|fremd\.example|\{\{img/.test(p.body.replace(/\{\{ref\|[^}]*\}\}/, "")), p.body); assert.match(p.note, /images_not_copied:1/);
    assert.deepEqual(raw.prepare("SELECT mode,rights FROM blog_import_items ORDER BY post_id").all().map((x) => [x.mode, x.rights]), [["full", 1], ["excerpt", 0]]);
    const au = raw.prepare("SELECT action,target,detail FROM audit").get(); assert.equal(au.action, "blog.import"); assert.match(au.detail, /full rights=1 n=2/);
  });
});

test("save: Sprache, Auswahl, Tageslimit, doppelte Titel, Feed-Fehler", async () => {
  const { env, raw } = await makeDb();
  await withFeeds({ [FEED]: { body: RSS } }, async () => {
    assert.equal((await body(call(env, "/api/byod/import/save", { feed_url: FEED, keys: ["post-1"], lang: "xx" }))).error, "bad_lang");
    assert.equal((await body(call(env, "/api/byod/import/save", { feed_url: FEED, keys: [] }))).error, "nothing_selected");
    raw.exec("INSERT INTO blog_posts(user_id,slug,title,body,lang,topics,status,created,updated) VALUES(1,'copilot-im-alltag-nutzen','Vorhanden','x','en','[]','draft',1,1)");
    const r = await body(call(env, "/api/byod/import/save", { feed_url: FEED, keys: ["post-1"] })); assert.equal(r.created[0].slug, "copilot-im-alltag-nutzen-2", "Slug schon vergeben: durchnummeriert");
    for (let i = 0; i < 59; i++) raw.exec(`INSERT INTO blog_import_items(user_id,item_key,source_url,feed_url,post_id,mode,rights,imported) VALUES(1,'k${i}','u','f',1,'excerpt',0,${Math.floor(Date.now() / 1000)})`);
    assert.equal((await body(call(env, "/api/byod/import/save", { feed_url: FEED, keys: ["post-2", "post-3"] }))).error, "rate_limit", "60 je Tag");
  });
  await withFeeds({}, async () => assert.equal((await body(call(env, "/api/byod/import/save", { feed_url: "https://anna.example.org/weg.xml", keys: ["a"] }, { id: 2 }))).error, "feed_http"));
});

test("Entwuerfe erscheinen nicht auf einer Blog-Domain (status draft) und die Tabelle verlangt die Rechte-Bestaetigung fuer Volltext", async () => {
  const { env, raw } = await makeDb();
  raw.exec("INSERT INTO blog_domains(user_id,domain,status,token,imprint_url,created,updated) VALUES(1,'blog.anna.de','active','t','https://anna.de/i',1,1)");
  await withFeeds({ [FEED]: { body: RSS } }, async () => { await call(env, "/api/byod/import/save", { feed_url: FEED, keys: ["post-1"] }); });
  const h = await (await serveBlog(env, "blog.anna.de", "/")).text(); assert.ok(!h.includes("Copilot im Alltag nutzen"));
  assert.equal((await serveBlog(env, "blog.anna.de", "/copilot-im-alltag-nutzen/")).status, 404);
  assert.throws(() => raw.exec("INSERT INTO blog_import_items(user_id,item_key,source_url,feed_url,post_id,mode,rights,imported) VALUES(1,'x','u','f',1,'full',0,1)"));
});
