// Blog auf der eigenen Domain: Weiche nach Host, Seiten, Feed, Sitemap, Canonical, Index-Regel, Sicherheit.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { serveBlog, wikiToHtml, activeDomain } from "../src/byod_site.js";
import { handleByodServe } from "../src/byod.js";

async function makeDb() {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:"), dir = new URL("../migrations/", import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(f, dir), "utf-8"));
  const db = { prepare(sql) { const st = raw.prepare(sql); let args = []; const o = { bind(...a) { args = a; return o; }, all: async () => ({ results: st.all(...args) }), first: async () => st.get(...args) ?? null,
    run: async () => { const r = st.run(...args); return { meta: { changes: Number(r.changes), last_row_id: Number(r.lastInsertRowid) } }; } }; return o; }, async batch(stmts) { for (const st of stmts) await st.run(); } };
  raw.exec("INSERT INTO users(id,provider,sub,name,created) VALUES(1,'g','1','Anna <b>Test</b>',1),(2,'g','2','Ben',1),(3,'g','3','Cora',1)");
  raw.exec("INSERT INTO profiles(user_id,public,handle,updated) VALUES(1,1,'anna',1),(2,0,'ben',1),(3,1,'cora',1)");
  raw.exec("UPDATE users SET banned=1 WHERE id=3");
  const d = "INSERT INTO blog_domains(user_id,domain,status,token,imprint_url,privacy_url,created,updated) VALUES";
  raw.exec(`${d}(1,'blog.anna.de','active','t1','https://anna.de/impressum','https://anna.de/datenschutz',1,1),(1,'pending.anna.de','pending','t2','',  '',1,1),(2,'blog.ben.de','active','t3','https://ben.de/i','',1,1),(3,'blog.cora.de','active','t4','https://cora.de/i','',1,1),(1,'gesperrt.anna.de','blocked','t5','https://anna.de/i','',1,1)`);
  const post = (uid, slug, title, body, o = {}) => raw.prepare("INSERT INTO blog_posts(user_id,slug,title,summary,body,html,lang,topics,status,created,updated,published) VALUES(?,?,?,?,?,?,?,'[]',?,?,?,?)")
    .run(uid, slug, title, o.summary ?? "Kurz", body, o.html ?? "", o.lang ?? "en", o.status ?? "live", 100, o.updated ?? 200, o.published ?? 100);
  post(1, "hallo-welt", "Hallo Welt", "## Abschnitt\n\nEin **fetter** und *kursiver* Text mit [[copilot|Copilot]] und Quelle{{ref|Doku|https://learn.microsoft.com/x|Microsoft|2026-01-01}}.\n\n- eins\n- zwei\n\n{{img|https://img.m365.fm/i/a.webp|Alt Text hier}} {{img|https://fremd.example.org/x.png|Fremdes Bild}}");
  post(1, "beliebt", "Beliebt", "Text", { published: 300 });
  post(1, "entwurf", "Entwurf", "geheim", { status: "draft" });
  post(1, "alt-html", "Alt HTML", "", { html: "<p>Voller Text</p><script>alert(1)</script>", published: 50 });
  post(1, "deutsch", "Deutscher Beitrag", "Text", { lang: "de", published: 400 });
  post(2, "ben-post", "Ben Post", "x"); post(3, "cora-post", "Cora Post", "x");
  for (let i = 10; i < 20; i++) raw.exec(`INSERT INTO users(id,provider,sub,name,created) VALUES(${i},'g','${i}','V${i}',1)`);
  const beliebt = raw.prepare("SELECT id FROM blog_posts WHERE slug='beliebt'").get().id;
  for (let i = 10; i < 20; i++) raw.exec(`INSERT INTO blog_votes(post_id,user_id,created) VALUES(${beliebt},${i},1)`);   // genau 10 Upvotes
  return { db, raw, env: { DB: db, SITE: "https://www.m365.fm", BYOD: "1" } };
}
const text = async (r) => await r.text();

test("Unbekannte, nicht aktive, gesperrte, nicht oeffentliche Hosts: null (neutrales 404)", async () => {
  const { env } = await makeDb();
  for (const h of ["unbekannt.example.com", "pending.anna.de", "gesperrt.anna.de", "blog.ben.de", "blog.cora.de", "", "www.m365.fm", "m365.fm", "blog.anna.de:8080", "blog.anna.de/x", "1.2.3.4"]) assert.equal(await serveBlog(env, h, "/"), null, h);
  assert.ok(await serveBlog(env, "blog.anna.de", "/"));
  assert.ok(await serveBlog(env, "BLOG.Anna.DE", "/"), "Gross-/Kleinschreibung egal");
});

test("Domain erst aktiv, wenn Status active: Wechsel pending -> active schaltet frei", async () => {
  const { env, raw } = await makeDb();
  assert.equal(await serveBlog(env, "pending.anna.de", "/"), null);
  raw.exec("UPDATE blog_domains SET status='active' WHERE domain='pending.anna.de'");
  assert.ok(await serveBlog(env, "pending.anna.de", "/"));
  raw.exec("UPDATE blog_domains SET status='blocked' WHERE domain='pending.anna.de'");
  assert.equal(await serveBlog(env, "pending.anna.de", "/"), null);
});

test("Startseite: Beitragsliste nur mit live-Beitraegen des Mitglieds, Impressum, Hosting-Hinweis, keine Cookies und kein Skript", async () => {
  const { env } = await makeDb();
  const r = await serveBlog(env, "blog.anna.de", "/"), h = await text(r);
  assert.equal(r.status, 200); assert.match(r.headers.get("content-type"), /text\/html/);
  for (const s of ["Hallo Welt", "Beliebt", "Deutscher Beitrag", "Alt HTML"]) assert.ok(h.includes(s), s);
  for (const s of ["geheim", "Ben Post", "Cora Post"]) assert.ok(!h.includes(s), s);
  assert.ok(h.includes('href="https://anna.de/impressum"') && h.includes('href="https://anna.de/datenschutz"'));
  assert.match(h, /Gehostet auf <a href="https:\/\/www\.m365\.fm\/"/, "Sprache der Seite = Sprache des neuesten Beitrags (hier de)");
  assert.ok(h.includes("https://www.m365.fm/impressum/") && h.includes("https://www.m365.fm/datenschutz/"));
  const en = await text(await serveBlog(env, "blog.anna.de", "/hallo-welt/"));
  assert.match(en, /Hosted on <a href="https:\/\/www\.m365\.fm\/"/); assert.ok(en.includes("https://www.m365.fm/legal/") && en.includes("https://www.m365.fm/privacy/"));
  assert.ok(!/<script(?![^>]*ld\+json)/i.test(h), "kein Skript ausser JSON-LD");
  assert.ok(h.includes("Anna &lt;b&gt;Test&lt;/b&gt;") && !h.includes("<b>Test</b>"), "Namen werden maskiert");
  assert.equal(r.headers.get("set-cookie"), null);
  assert.match(r.headers.get("content-security-policy"), /default-src 'none'.*img-src https:\/\/img\.m365\.fm/);
  assert.ok(h.indexOf("Deutscher Beitrag") < h.indexOf("Beliebt") && h.indexOf("Beliebt") < h.indexOf("Hallo Welt"), "neueste zuerst");
});

test("Beitrag: Inhalt, Quellen mit nofollow ugc, Bilder nur von img.m365.fm, Canonical, Index-Regel", async () => {
  const { env } = await makeDb();
  const r = await serveBlog(env, "blog.anna.de", "/hallo-welt/"), h = await text(r);
  assert.equal(r.status, 200);
  assert.ok(h.includes("<h1>Hallo Welt</h1>") && h.includes("<h2 id=\"h-1\">Abschnitt</h2>") && h.includes("<strong>fetter</strong>") && h.includes("<em>kursiver</em>") && h.includes("<li>eins</li>"));
  assert.ok(h.includes('href="https://www.m365.fm/entity/copilot/"'));
  assert.ok(h.includes('rel="nofollow ugc noopener"') && h.includes("learn.microsoft.com"));
  assert.ok(h.includes('<img src="https://img.m365.fm/i/a.webp"') && !h.includes("fremd.example.org") && h.includes("<em>Fremdes Bild</em>"));
  assert.match(h, /<link rel="canonical" href="https:\/\/www\.m365\.fm\/community\/u\/anna\/blog\/hallo-welt\/">/, "Standard: Canonical auf die Plattform");
  assert.match(h, /<meta name="robots" content="noindex,follow">/, "unter 10 Upvotes: noindex");
  const pop = await text(await serveBlog(env, "blog.anna.de", "/beliebt/"));
  assert.match(pop, /<meta name="robots" content="index,follow">/, "ab 10 Upvotes indexierbar");
  assert.match(pop, /BlogPosting/);
  const de = await serveBlog(env, "blog.anna.de", "/deutsch/");
  assert.equal(de.headers.get("content-language"), "de");
  const dh = await text(de); assert.ok(dh.includes("Impressum") && dh.includes('lang="de"') && dh.includes("/impressum/") && dh.includes("Gehostet auf"));
  assert.match(dh, /canonical" href="https:\/\/www\.m365\.fm\/de\/community\/u\/anna\/blog\/deutsch\/"/);
});

test("Schalter BYOD_CANONICAL=own und BYOD_INDEX_VOTES", async () => {
  const { env } = await makeDb();
  const own = { ...env, BYOD_CANONICAL: "own" };
  assert.match(await text(await serveBlog(own, "blog.anna.de", "/hallo-welt/")), /canonical" href="https:\/\/blog\.anna\.de\/hallo-welt\/"/);
  assert.match(await text(await serveBlog(own, "blog.anna.de", "/")), /canonical" href="https:\/\/blog\.anna\.de\/"/);
  const low = { ...env, BYOD_INDEX_VOTES: "0" };
  assert.match(await text(await serveBlog(low, "blog.anna.de", "/hallo-welt/")), /content="index,follow"/);
  const high = { ...env, BYOD_INDEX_VOTES: "11" };
  assert.match(await text(await serveBlog(high, "blog.anna.de", "/beliebt/")), /content="noindex,follow"/);
});

test("Uebernommene HTML-Beitraege: nur Auszug mit Link, nie das HTML, nie indexierbar", async () => {
  const { env } = await makeDb();
  const h = await text(await serveBlog(env, "blog.anna.de", "/alt-html/"));
  assert.ok(!h.includes("alert(1)") && !h.includes("Voller Text"));
  assert.ok(h.includes("https://www.m365.fm/community/u/anna/blog/alt-html/") && /noindex,follow/.test(h));
});

test("Startseite noindex, solange kein Beitrag die Schwelle erreicht; sonst index", async () => {
  const { env, raw } = await makeDb();
  assert.match(await text(await serveBlog(env, "blog.anna.de", "/")), /content="index,follow"/);   // 'beliebt' hat 10
  raw.exec("DELETE FROM blog_votes");
  assert.match(await text(await serveBlog(env, "blog.anna.de", "/")), /content="noindex,follow"/);
});

test("Sitemap: nur im own-Modus und nur indexierbare Beitraege; robots.txt verweist nur dann darauf", async () => {
  const { env } = await makeDb();
  assert.equal((await serveBlog(env, "blog.anna.de", "/sitemap.xml")).status, 404, "Standard (platform): keine Sitemap");
  assert.ok(!(await text(await serveBlog(env, "blog.anna.de", "/robots.txt"))).includes("Sitemap:"));
  const own = { ...env, BYOD_CANONICAL: "own" };
  const sm = await text(await serveBlog(own, "blog.anna.de", "/sitemap.xml"));
  assert.ok(sm.includes("<loc>https://blog.anna.de/beliebt/</loc>") && !sm.includes("hallo-welt") && !sm.includes("entwurf") && !sm.includes("alt-html"));
  const rb = await text(await serveBlog(own, "blog.anna.de", "/robots.txt"));
  assert.ok(rb.includes("Sitemap: https://blog.anna.de/sitemap.xml") && rb.includes("User-agent: *"));
});

test("Feed: RSS mit Adressen der eigenen Domain, ohne Entwuerfe", async () => {
  const { env } = await makeDb();
  const r = await serveBlog(env, "blog.anna.de", "/feed.xml"), x = await text(r);
  assert.match(r.headers.get("content-type"), /rss\+xml/);
  assert.ok(x.includes("<link>https://blog.anna.de/hallo-welt/</link>") && !x.includes("entwurf") && !x.includes("m365.fm/community"));
  assert.ok(x.includes("Anna &lt;b&gt;Test&lt;/b&gt;"));
});

test("Pfade: Slash-Weiterleitung nur auf dieselbe Domain, unbekannt/Entwurf/Traversal = 404 mit noindex", async () => {
  const { env } = await makeDb();
  const r = await serveBlog(env, "blog.anna.de", "/hallo-welt");
  assert.equal(r.status, 301); assert.equal(r.headers.get("location"), "/hallo-welt/");
  for (const p of ["/entwurf/", "/ben-post/", "/cora-post/", "/gibtsnicht/", "/../etc/passwd", "/a/b/", "//evil.com/", "/%2e%2e/", "/hallo-welt/%00", "/hallo\\welt/", "/hallo-welt/?x=1", "/.well-known/x", "/admin", "/feed", "/" + "a".repeat(200) + "/", "", "hallo-welt", "/Hallo-Welt/"]) {
    const x = await serveBlog(env, "blog.anna.de", p); assert.equal(x.status, 404, JSON.stringify(p)); assert.equal(x.headers.get("x-robots-tag"), "noindex"); assert.ok(!x.headers.get("location"));
  }
});

test("Schalter: ohne BYOD=1 antwortet /api/byod/serve immer neutral mit 404", async () => {
  const { env } = await makeDb();
  const u = new URL("https://x/api/byod/serve?host=blog.anna.de&path=/");
  assert.equal((await handleByodServe({ ...env, BYOD: "0" }, new Request(u), u)).status, 404);
  assert.equal((await handleByodServe({ DB: env.DB }, new Request(u), u)).status, 404);
  const ok = await handleByodServe(env, new Request(u), u); assert.equal(ok.status, 200);
  assert.equal((await handleByodServe(env, new Request(u, { method: "POST" }), u)).status, 404);
  const bad = new URL("https://x/api/byod/serve?host=unbekannt.example.com&path=/");
  const nf = await handleByodServe(env, new Request(bad), bad); assert.equal(nf.status, 404); assert.equal(await nf.text(), "Not found");
  const noh = new URL("https://x/api/byod/serve"); assert.equal((await handleByodServe(env, new Request(noh), noh)).status, 404);
});

test("activeDomain: strenge Host-Pruefung (nur normalisierte Hosts, keine eigenen)", async () => {
  const { db } = await makeDb();
  assert.ok(await activeDomain(db, "blog.anna.de"));
  assert.equal(await activeDomain(db, "Blog.Anna.de"), null, "nicht normalisiert: kein Treffer");
  assert.equal(await activeDomain(db, "www.m365.fm"), null);
  assert.equal(await activeDomain(db, "blog.anna.de' OR '1'='1"), null);
});

test("wikiToHtml: HTML in Text wird maskiert, Skript-Adressen und fremde Bilder gelangen nie als Markup in die Seite", () => {
  const { html } = wikiToHtml("## <script>x</script>\n\nText <img src=x onerror=alert(1)> **fett**\n\n{{img|https://img.m365.fm/i/\"onerror=x.png|Alt}}\n\n{{ref|T|javascript:alert(1)|P|D}}\n\n[[a-b|<i>x</i>]]", { site: "https://www.m365.fm", lang: "en" });
  assert.ok(!/<script|<img src=x|href="javascript/i.test(html), html);
  assert.ok(!html.includes('"onerror'), html);
});
