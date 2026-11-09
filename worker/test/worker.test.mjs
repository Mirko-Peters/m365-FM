// Tests vor dem Deploy (node --test test/): reine Funktionen des Workers und die Schema-Disziplin (Migrationen).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { cleanText, cleanName, esc, isLang, LANGS, b64u, sign, verify, sha256hex, anthropicUrl, anthropicHeaders, anthropicFetch, haikuJson, usageUsd, AI_BUDGET_ERROR } from "../src/util.js";
import { runTrQueue } from "../src/autotr.js";
import worker from "../src/index.js";
import { sanitize } from "../src/wiki.js";
import { parseFeed } from "../src/feeds.js";
import { scoreOf, levelOf, levelName, CAPS, THRESH } from "../src/levels.js";
import { handleSponsor, handleSponsorLink } from "../src/sponsor.js";
import { handleAdminPanel } from "../src/adminpanel.js";
import { d1BackupExportArgs, d1BackupTables } from "../src/d1_backup.js";
import { embed, queryVectors, rrf, upsertVectors, vectorId } from "../src/vectors.js";
import { handleContributions, refreshContributions } from "../src/contributions.js";

async function searchDb(failTrigram = false) {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:");
  const dir = new URL("../migrations/", import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(f, dir), "utf-8"));
  let trigramFailed = false, indexWrites = 0, searchQueries = 0, maxBatch = 0, lastSearchQuery, lastVectorQuery;
  const db = {
    prepare(sql) {
      if (sql.includes("eligible AS (")) {
        searchQueries++;
        lastSearchQuery = { sql, params: [] };
      }
      if (sql.includes("FROM json_each(?) j CROSS JOIN search_vector")) lastVectorQuery = { sql, params: [] };
      const st = raw.prepare(sql); let args = [];
      const o = {
        bind(...a) {
          if (a.length > 100) throw new Error("D1_ERROR: too many SQL variables");
          args = a;
          if (lastSearchQuery?.sql === sql) lastSearchQuery.params = [...a];
          if (lastVectorQuery?.sql === sql) lastVectorQuery.params = [...a];
          return o;
        },
        all: async () => ({ results: st.all(...args) }),
        first: async () => st.get(...args) ?? null,
        run: async () => {
          if (failTrigram && !trigramFailed && /CREATE VIRTUAL TABLE IF NOT EXISTS search_fts .*tokenize='trigram'/.test(sql)) {
            trigramFailed = true;
            throw new Error("no such tokenizer: trigram");
          }
          const r = st.run(...args), n = Number(r.changes);
          if (/^\s*(INSERT|UPDATE|DELETE)/i.test(sql) && /search_doc|search_fts/.test(sql)) indexWrites += n;
          return { meta: { changes: n } };
        },
      };
      return o;
    },
    async batch(stmts) { maxBatch = Math.max(maxBatch, stmts.length); for (const st of stmts) await st.run(); },
  };
  return { db, raw, indexWrites: () => indexWrites, searchQueries: () => searchQueries, maxBatch: () => maxBatch, lastSearchQuery: () => lastSearchQuery, lastVectorQuery: () => lastVectorQuery };
}

function seedSearchDocs(raw, docs) {
  raw.exec("CREATE VIRTUAL TABLE search_fts USING fts5(title,keywords,summary,tokenize='trigram'); INSERT INTO meta(k,v) VALUES('search_fts_tokenizer','trigram')");
  const insert = raw.prepare("INSERT INTO search_doc(id,url,lang,type,title,title_norm,summary,keywords,entities,date,image,h,gone,updated,grp) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,0,1,?)");
  const fts = raw.prepare("INSERT INTO search_fts(rowid,title,keywords,summary) VALUES(?,?,?,?)");
  raw.exec("BEGIN");
  try {
    for (const doc of docs) {
      const titleNorm = ` ${doc.title.toLocaleLowerCase().normalize("NFKD").replace(/\p{M}/gu, "").replace(/[^\p{L}\p{N}]+/gu, " ").trim().replace(/\s+/g, " ")} `;
      insert.run(doc.id, doc.url, doc.lang, doc.type, doc.title, titleNorm, doc.summary || "", doc.keywords || "", (doc.entities || []).join(","), doc.date || "", "", doc.id, doc.group || "");
      const { rowid } = raw.prepare("SELECT rowid FROM search_doc WHERE id=?").get(doc.id);
      fts.run(rowid, doc.title, doc.keywords || "", doc.summary || "");
    }
    raw.exec("COMMIT");
  } catch (error) {
    raw.exec("ROLLBACK");
    throw error;
  }
}

async function seedSearchVectors(raw, docs) {
  const insert = raw.prepare("INSERT INTO search_vector(id,vid,h) VALUES(?,?,?)");
  const ids = new Map();
  for (const doc of docs) {
    const vid = await vectorId(doc.id);
    insert.run(doc.id, vid, doc.id);
    ids.set(doc.id, vid);
  }
  return ids;
}

test("util: Texte bereinigen und escapen", () => {
  assert.equal(cleanText("  a<b>c  ", 3), "a<b");
  assert.equal(cleanName("<x> Name  Y"), "x Name Y");
  assert.equal(esc('<a&"'), "&lt;a&amp;&quot;");
  assert.equal(isLang("de"), true);
  assert.equal(isLang("hi"), false, "entfernte Sprache darf nicht mehr gelten");
  assert.equal(LANGS.length, 14);
  assert.equal(b64u.enc(new Uint8Array([1, 2, 3])), "AQID");
});

test("util: HMAC-Signatur ist pruefbar und faelschungssicher", async () => {
  const s = await sign("geheim", "42");
  assert.equal(await verify("geheim", "42", s), true);
  assert.equal(await verify("geheim", "43", s), false);
  assert.equal(await verify("anders", "42", s), false);
});

test("AI Gateway: Fallback, Metadaten, Haiku-Budget und Usage", async () => {
  assert.equal(anthropicUrl({}, "/v1/messages"), "https://api.anthropic.com/v1/messages");
  assert.equal(anthropicUrl({ CLOUDFLARE_ACCOUNT_ID: "account", AI_GATEWAY_ID: "m365fm", CF_AIG_TOKEN: "unit-test-token" }), "https://gateway.ai.cloudflare.com/v1/account/m365fm/anthropic/v1/messages");
  const headers = anthropicHeaders({ ANTHROPIC_API_KEY: "unit-test-key", CLOUDFLARE_ACCOUNT_ID: "account", CF_AIG_TOKEN: "unit-test-token" }, { job: "test_job", lang: "de", model: "claude-haiku-5-5", cacheTtl: 604800 });
  assert.deepEqual(JSON.parse(headers["cf-aig-metadata"]), { job: "test_job", lang: "de", model: "claude-haiku-5-5" });
  assert.equal(headers["cf-aig-authorization"], "Bearer unit-test-token");
  assert.equal(headers["cf-aig-cache-ttl"], "604800");
  assert.equal(anthropicHeaders({ CF_AIG_TOKEN: "unit-test-token" }, { job: "direct", model: "claude-haiku-5-5" })["cf-aig-authorization"], undefined);
  const oldWarn = console.warn; console.warn = () => {};
  try {
    const direct = { CLOUDFLARE_ACCOUNT_ID: "account", AI_GATEWAY_ID: "m365fm" };
    assert.equal(anthropicUrl(direct), "https://api.anthropic.com/v1/messages");
    assert.equal(anthropicHeaders(direct, { job: "direct" })["cf-aig-authorization"], undefined);
    assert.equal(anthropicHeaders(direct, { job: "direct" })["cf-aig-metadata"], undefined);
  } finally { console.warn = oldWarn; }

  const { db, raw } = await searchDb();
  const today = new Date().toISOString().slice(0, 10), yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  raw.prepare("INSERT INTO ai_spend(id,day,model,job,lang,usd,reserved_usd,created) VALUES(?,?,?,?,?,?,0,?)")
    .run("full", today, "claude-haiku-5-5", "test_job", "de", 5.4, Math.floor(Date.now() / 1000));
  const oldFetch = globalThis.fetch; let calls = 0;
  globalThis.fetch = async (url, init) => {
    calls++;
    assert.equal(url, "https://gateway.ai.cloudflare.com/v1/account/m365fm/anthropic/v1/messages");
    assert.deepEqual(JSON.parse(init.headers["cf-aig-metadata"]), { job: "worker_translation_queue", lang: "de", model: "claude-haiku-5-5" });
    return new Response(JSON.stringify({ usage: { input_tokens: 1000, output_tokens: 2000 }, content: [{ type: "text", text: "ok" }] }), { status: 200 });
  };
  try {
    await assert.rejects(anthropicFetch({ DB: db, ANTHROPIC_API_KEY: "unit-test-key" }, { model: "claude-haiku-5-5", max_tokens: 4000 }, { job: "worker_translation_queue", lang: "de" }),
      (error) => error.code === AI_BUDGET_ERROR);
    assert.equal(calls, 0, "bei erreichtem Tagesbudget erfolgt kein Claude-Aufruf");
    raw.prepare("UPDATE ai_spend SET day=? WHERE id='full'").run(yesterday);
    const response = await anthropicFetch({ DB: db, ANTHROPIC_API_KEY: "unit-test-key", CLOUDFLARE_ACCOUNT_ID: "account", CF_AIG_TOKEN: "unit-test-token" }, { model: "claude-haiku-5-5", max_tokens: 4000 }, { job: "worker_translation_queue", lang: "de" });
    assert.equal(response.status, 200, "am neuen UTC-Tag ist das Budget wieder frei");
    assert.equal(calls, 1);
    const spend = raw.prepare("SELECT in_tok,out_tok,usd,reserved_usd FROM ai_spend WHERE day=? AND id<>'full'").get(today);
    assert.equal(spend.in_tok, 1000);
    assert.equal(spend.out_tok, 2000);
    assert.ok(Math.abs(spend.usd - 0.0011) < 1e-10, "Kosten werden aus der usage-Antwort berechnet");
    assert.equal(spend.reserved_usd, 0);
  } finally {
    globalThis.fetch = oldFetch;
    raw.close();
  }
});

test("AI Gateway: Cache-Treffer wird nicht gebucht, unbrauchbarer Cache-Treffer einmal am Cache vorbei, Netzfehler gibt Vormerkung frei", async () => {
  const { db, raw } = await searchDb();
  const env = { DB: db, ANTHROPIC_API_KEY: "unit-test-key", CLOUDFLARE_ACCOUNT_ID: "account", CF_AIG_TOKEN: "unit-test-token" };
  const oldFetch = globalThis.fetch, seen = [];
  const res = (text, hit) => new Response(JSON.stringify({ usage: { input_tokens: 1000, output_tokens: 2000 }, content: [{ type: "text", text }] }),
    { status: 200, headers: hit ? { "cf-aig-cache-status": "HIT" } : {} });
  try {
    globalThis.fetch = async (url, init) => { seen.push(init.headers); return seen.length === 1 ? res("{\"a\":", true) : res("{\"a\":1}", false); };
    assert.deepEqual(await haikuJson(env, "sys", { a: "x" }, { job: "cache_test", lang: "de" }), { a: 1 });
    assert.equal(seen.length, 2);
    assert.equal(seen[0]["cf-aig-cache-ttl"], "604800");
    assert.equal(seen[1]["cf-aig-skip-cache"], "true");
    assert.equal(seen[1]["cf-aig-cache-ttl"], undefined);
    const rows = raw.prepare("SELECT usd,reserved_usd FROM ai_spend WHERE job='cache_test' ORDER BY rowid").all();
    assert.equal(rows.length, 2);
    assert.equal(rows[0].usd, 0, "Cache-Treffer kostet nichts");
    assert.equal(rows[0].reserved_usd, 0, "Vormerkung des Cache-Treffers ist freigegeben");
    assert.ok(Math.abs(rows[1].usd - 0.0011) < 1e-10);
    globalThis.fetch = async () => { throw new TypeError("network"); };
    await assert.rejects(anthropicFetch(env, { model: "claude-haiku-5-5", max_tokens: 4000 }, { job: "net_test" }), /request failed/);
    assert.equal(raw.prepare("SELECT reserved_usd FROM ai_spend WHERE job='net_test'").get().reserved_usd, 0);
  } finally {
    globalThis.fetch = oldFetch;
    raw.close();
  }
});

test("AI-Budget: gesperrte Vormerkung bleibt offen", async () => {
  const { db, raw } = await searchDb();
  const day = new Date().toISOString().slice(0, 10), t = Math.floor(Date.now() / 1000);
  raw.exec(`INSERT INTO meta(k,v) VALUES('tr_queue_on','1');
    INSERT INTO blog_posts(user_id,slug,title,summary,body,lang,status,created,updated,published)
    VALUES(1,'budget-test','Titel','Zusammenfassung','Text','en','live',${t},${t},${t});
    INSERT INTO tr_queue(kind,item_id,lang,title,created,status) VALUES('blog','1','de','Titel',${t},'open');`);
  raw.prepare("INSERT INTO ai_spend(id,day,model,job,lang,usd,created) VALUES(?,?,?,?,?,?,?)")
    .run("full", day, "claude-haiku-5-5", "test_job", "de", 5.4, t);
  const oldFetch = globalThis.fetch; let calls = 0;
  globalThis.fetch = async () => { calls++; return new Response("{}"); };
  try {
    const result = await runTrQueue({ DB: db, ANTHROPIC_API_KEY: "unit-test-key" }, async () => new Map());
    assert.equal(calls, 0);
    assert.equal(result.capped, true);
    assert.equal(raw.prepare("SELECT status FROM tr_queue WHERE kind='blog' AND item_id='1' AND lang='de'").get().status, "open");
  } finally {
    globalThis.fetch = oldFetch;
    raw.close();
  }
});

test("AI-Budget-API: Cron-Key schützt Abfrage und idempotente Verbrauchsmeldung", async () => {
  const { db, raw } = await searchDb();
  const env = { DB: db, CRON_KEY: "unit-test-cron", AI_DAILY_EUR_HAIKU: "5", USD_PER_EUR: "1.08" };
  const url = "https://api.example/api/internal/ai-spend";
  try {
    let response = await worker.fetch(new Request(url, { method: "POST", body: JSON.stringify({ action: "check", model: "claude-haiku-5-5" }) }), env);
    assert.equal(response.status, 403);
    response = await worker.fetch(new Request(url, { method: "POST", headers: { "x-cron-key": env.CRON_KEY, "content-type": "application/json" }, body: JSON.stringify({ action: "check", model: "claude-haiku-5-5", estimate_eur: 1 }) }), env);
    assert.equal((await response.json()).allowed, true);
    const report = { action: "report", id: "workflow-run-1", job: "translate_show", lang: "batch", model: "claude-haiku-5-5", input_tokens: 1000, output_tokens: 2000 };
    for (let i = 0; i < 2; i++) {
      response = await worker.fetch(new Request(url, { method: "POST", headers: { "x-cron-key": env.CRON_KEY, "content-type": "application/json" }, body: JSON.stringify(report) }), env);
      assert.equal(response.status, 200);
    }
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM ai_spend WHERE id='workflow-run-1'").get().n, 1);
    assert.ok(Math.abs(raw.prepare("SELECT usd FROM ai_spend WHERE id='workflow-run-1'").get().usd - 0.0011) < 1e-10);
    response = await worker.fetch(new Request(url, { method: "POST", headers: { "x-cron-key": env.CRON_KEY, "content-type": "application/json" }, body: JSON.stringify({ ...report, id: "workflow-batch-1", batch: true }) }), env);
    assert.equal(response.status, 200);
    assert.ok(Math.abs(raw.prepare("SELECT usd FROM ai_spend WHERE id='workflow-batch-1'").get().usd - 0.00055) < 1e-10, "Batch API: halber Preis");
    // Prompt-Cache: 1000 Eingabe-Token, davon 800 gelesen (0,1x) und 100 geschrieben (1,25x) -> (100 + 80 + 125) x 0,10 $/MTok + 2000 x 0,50 $/MTok
    response = await worker.fetch(new Request(url, { method: "POST", headers: { "x-cron-key": env.CRON_KEY, "content-type": "application/json" }, body: JSON.stringify({ ...report, id: "workflow-cache-1", cache_read_input_tokens: 800, cache_creation_input_tokens: 100 }) }), env);
    assert.equal(response.status, 200);
    assert.ok(Math.abs(raw.prepare("SELECT usd FROM ai_spend WHERE id='workflow-cache-1'").get().usd - (305 * 0.10 + 2000 * 0.50) / 1e6) < 1e-12);
    assert.equal(raw.prepare("SELECT in_tok FROM ai_spend WHERE id='workflow-cache-1'").get().in_tok, 1000);
    response = await worker.fetch(new Request(url, { method: "POST", headers: { "x-cron-key": env.CRON_KEY, "content-type": "application/json" }, body: JSON.stringify({ ...report, id: "workflow-cache-2", cache_read_input_tokens: 900, cache_creation_input_tokens: 200 }) }), env);
    assert.equal(response.status, 400, "Cache-Anteile groesser als die Eingabe werden abgelehnt");
  } finally {
    raw.close();
  }
});

test("Prompt-Cache: Kosten aus usage mit gelesenen und geschriebenen Cache-Token", async () => {
  const prices = { input: 0.10, output: 0.50 };
  assert.ok(Math.abs(usageUsd(prices, { input_tokens: 1000, output_tokens: 2000 }) - 0.0011) < 1e-12);
  assert.ok(Math.abs(usageUsd(prices, { input_tokens: 100, cache_read_input_tokens: 1000, cache_creation_input_tokens: 400, output_tokens: 0 }) - (100 + 100 + 500) * 0.10 / 1e6) < 1e-12);
  assert.ok(Math.abs(usageUsd(prices, { input_tokens: 0, cache_creation_input_tokens: 400, cache_creation: { ephemeral_1h_input_tokens: 400 } }) - 800 * 0.10 / 1e6) < 1e-12, "1-h-Cache: 2x");
  assert.ok(Math.abs(usageUsd(prices, { input_tokens: 1000 }, true) - 0.00005) < 1e-12, "Batch: halber Preis");
  const { db, raw } = await searchDb();
  const oldFetch = globalThis.fetch; let sent;
  const body = { model: "claude-haiku-5-5", max_tokens: 100, system: [{ type: "text", text: "lange Regeln", cache_control: { type: "ephemeral", ttl: "1h" } }], messages: [{ role: "user", content: "x" }] };
  globalThis.fetch = async (url, init) => { sent = JSON.parse(init.body); return new Response(JSON.stringify({ usage: { input_tokens: 50, cache_read_input_tokens: 1000, output_tokens: 10 }, content: [{ type: "text", text: "ok" }] }), { status: 200 }); };
  try {
    await anthropicFetch({ DB: db, ANTHROPIC_API_KEY: "unit-test-key", CLOUDFLARE_ACCOUNT_ID: "account", CF_AIG_TOKEN: "unit-test-token" }, body, { job: "prompt_cache_test" });
    assert.deepEqual(sent, body, "cache_control geht unveraendert ueber das AI Gateway");
    const row = raw.prepare("SELECT in_tok,usd FROM ai_spend WHERE job='prompt_cache_test'").get();
    assert.equal(row.in_tok, 1050);
    assert.ok(Math.abs(row.usd - ((50 + 100) * 0.10 + 10 * 0.50) / 1e6) < 1e-12, "Cache-Lesen kostet 0,1x");
  } finally {
    globalThis.fetch = oldFetch;
    raw.close();
  }
});

test("wiki: sanitize entfernt Skripte, laesst Markup und viz nur mit Option", () => {
  const a = sanitize("Hallo **fett** <script>alert(1)</script> [[power-automate]] {{viz|bars|Titel|a~1;b~2}}", { viz: true });
  assert.equal(a.err, null);
  assert.ok(!a.body.includes("<script"), "kein Script-Tag");
  assert.ok(a.body.includes("[[power-automate]]"), "Wiki-Link bleibt");
  assert.ok(a.body.includes("{{viz|bars|Titel|a~1;b~2}}"), "Infografik bleibt mit viz-Option");
  const b = sanitize("{{viz|bars|Titel|a~1;b~2}}");
  assert.equal(b.body, "", "ohne viz-Option faellt die Infografik weg");
});

test("feeds: parseFeed nimmt nur https-Links und liest Titel, Datum, Beschreibung", () => {
  const rss = `<rss><channel>
    <item><title>T1 &amp; mehr</title><link>https://example.com/1</link><pubDate>Mon, 01 Jan 2024 00:00:00 GMT</pubDate><category>Power Automate</category><category>&lt;script</category><description>&lt;p&gt;Hallo https://example.com/x Welt&lt;/p&gt;</description></item>
    <item><title>Unsicher</title><link>http://example.com/2</link></item>
    <entry><title>Atom</title><link rel="alternate" href="https://example.com/3"/><updated>2024-02-01T00:00:00Z</updated><category term="Microsoft Teams"/></entry>
  </channel></rss>`;
  const out = parseFeed(rss);
  assert.equal(out.length, 2);
  assert.equal(out[0].title, "T1 & mehr");
  assert.equal(out[0].url, "https://example.com/1");
  assert.equal(out[0].t, Date.parse("Mon, 01 Jan 2024 00:00:00 GMT") / 1000);
  assert.deepEqual(out[0].topics, ["Power Automate", "script"]);
  assert.equal(out[0].desc, "Hallo Welt");
  assert.equal(out[1].url, "https://example.com/3");
  assert.deepEqual(out[1].topics, ["Microsoft Teams"]);
});

test("contributions: Quellen, Metadaten, Privatsphäre, Kategorien und Berichtsexport", async () => {
  const { db, raw } = await searchDb();
  raw.exec("ALTER TABLE contributions DROP COLUMN topics_edited");
  raw.exec("INSERT INTO users(id,provider,sub,name,created) VALUES(1,'g','1','Anna',1),(2,'g','2','Ben',1); INSERT INTO profiles(user_id,public,handle,headline,about,company,job,country,show_org,updated) VALUES(1,0,'anna','','','','','',1,1)");
  const user = { id: 1 }, J = (data, status = 200) => new Response(JSON.stringify(data), { status });
  const call = (path, method = "GET", data, actor = user) => {
    const url = new URL(`https://x${path}`);
    return handleContributions({ DB: db },
      new Request(url, { method, headers: { "content-type": "application/json" }, ...(data === undefined ? {} : { body: JSON.stringify(data) }) }),
      url, url.pathname, actor, J);
  };

  const source = await call("/api/contributions/source", "POST", { kind: "blog", url: "https://example.com/feed.xml", title: "My blog", public: true, mode: "track" });
  assert.equal(source.status, 201);
  assert.equal((await source.json()).source.public, true);
  assert.equal((await (await call("/api/contributions/source", "POST", { kind: "blog", url: "https://example.com/feed.xml" })).json()).error, "source_exists");
  assert.equal((await call("/api/contributions/source", "POST", { kind: "youtube", url: "https://example.com/channel" })).status, 400);
  assert.equal((await call("/api/contributions/source", "POST", { kind: "youtube", url: "https://evil.youtube.com/@handle" })).status, 400);
  const created = await call("/api/contributions/manual", "POST", {
    title: "=SUM(1,1)", url: "https://example.com/post", kind: "article", published: "1767225600", category: "Blog",
  });
  assert.equal(created.status, 201);
  assert.equal((await call("/api/contributions/manual", "POST", { title: "Bad day", kind: "blog", published: "2026-02-30" })).status, 400);
  assert.equal((await (await call("/api/contributions/manual", "POST", { title: "Bad day", kind: "blog", published: "not-a-date" })).json()).error, "bad_date");
  assert.equal((await (await call("/api/contributions/manual", "POST", { title: "No date", kind: "blog" })).json()).error, "bad_date");
  assert.equal((await call("/api/contributions/manual", "POST", { title: "Bad category", kind: "blog", category: "Other" })).status, 400);
  const manualId = raw.prepare("SELECT id FROM contributions WHERE manual=1").get().id;
  assert.equal(raw.prepare("SELECT published FROM contributions WHERE id=?").get(manualId).published, 1767225600, "numerische Zeichenkette bleibt Unix-Zeit in Sekunden");

  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(`<rss><channel>
    <item><title>Feed article</title><link>https://example.com/post</link><pubDate>Mon, 01 Jan 2024 00:00:00 GMT</pubDate><category>Power Automate</category><description>Never persist the full text</description></item>
    <item><title>Imported article</title><link>https://example.com/post-auto</link><pubDate>Mon, 01 Jan 2024 00:00:00 GMT</pubDate><category>Power BI</category></item>
  </channel></rss>`);
  try { await refreshContributions({ DB: db }, 1); } finally { globalThis.fetch = originalFetch; }
  const manual = raw.prepare("SELECT title,kind,published,public,manual,source_id FROM contributions WHERE id=?").get(manualId);
  assert.deepEqual([manual.title, manual.kind, manual.published, manual.public, manual.manual, manual.source_id], ["=SUM(1,1)", "article", 1767225600, 0, 1, null], "Feed-Upsert bewahrt manuelle Felder");
  const imported = raw.prepare("SELECT id,title,url,topics,public,category,published FROM contributions WHERE url='https://example.com/post-auto'").get();
  assert.equal(imported.title, "Imported article");
  assert.deepEqual(JSON.parse(imported.topics), ["power-bi"]);
  assert.equal(imported.category, "Blog");
  assert.equal(imported.public, 1, "Quellen-Sichtbarkeit gilt beim Import");
  const sourceId = raw.prepare("SELECT id FROM contribution_sources WHERE user_id=1").get().id;
  assert.equal((await (await call("/api/contributions/mine")).json()).sources[0].status, "active");
  assert.equal((await call("/api/contributions/source/update", "POST", { id: sourceId, public: false, active: false })).status, 200);
  assert.equal(raw.prepare("SELECT public FROM contributions WHERE id=?").get(imported.id).public, 0, "Quellensichtbarkeit wird auf importierte Einträge übertragen");
  assert.equal(raw.prepare("SELECT active FROM contribution_sources WHERE id=?").get(sourceId).active, 0);
  assert.equal((await call("/api/contributions/source/update", "POST", { id: sourceId, public: true, active: true })).status, 200);
  raw.prepare("UPDATE contribution_sources SET fails=5,fetched=9999999999 WHERE id=?").run(sourceId);
  assert.equal((await (await call("/api/contributions/mine")).json()).sources[0].status, "paused_after_errors");
  assert.equal((await call("/api/contributions/source/update", "POST", { id: sourceId, active: true })).status, 200);
  const resetSource = raw.prepare("SELECT fails,fetched FROM contribution_sources WHERE id=?").get(sourceId);
  assert.equal(resetSource.fails, 0, "Reaktivierung hebt die Fehlersperre auf");
  assert.ok(resetSource.fetched <= Math.floor(Date.now() / 1000) - 1801, "Reaktivierung plant den Abruf vor, ohne ihn auf null zu setzen");
  const firstReactivationTime = resetSource.fetched;
  for (let i = 0; i < 27; i++) assert.equal((await call("/api/contributions/source/update", "POST", { id: sourceId, active: true })).status, 200);
  assert.equal((await call("/api/contributions/source/update", "POST", { id: sourceId, active: true })).status, 429, "Reaktivierungen sind rate-limitiert");
  assert.equal(raw.prepare("SELECT fetched FROM contribution_sources WHERE id=?").get(sourceId).fetched, firstReactivationTime, "wiederholte Reaktivierung bevorzugt die Quelle nicht weiter");
  await call("/api/contributions/update", "POST", { id: imported.id, public: false, topics: [] });
  globalThis.fetch = async () => new Response(`<rss><channel><item><title>New title</title><link>https://example.com/post-auto</link><pubDate>Tue, 02 Jan 2024 00:00:00 GMT</pubDate><category>Fabric</category></item></channel></rss>`);
  try { await refreshContributions({ DB: db }, 1); } finally { globalThis.fetch = originalFetch; }
  const kept = raw.prepare("SELECT title,published,public,kind FROM contributions WHERE id=?").get(imported.id);
  assert.deepEqual([kept.title, kept.published, kept.public, kept.kind], ["New title", imported.published, 0, "blog"], "Cron überschreibt weder Privatstatus noch Typ/Datum");
  assert.deepEqual(JSON.parse(raw.prepare("SELECT topics FROM contributions WHERE id=?").get(imported.id).topics), [], "Cron befüllt manuell geleerte Themen nicht erneut");
  assert.ok(raw.prepare("SELECT fetched FROM contribution_sources WHERE id=?").get(sourceId).fetched > 0, "reaktivierte Quelle wird wieder abgerufen");
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM pragma_table_info('contributions') WHERE name IN ('summary','description','body')").get().n, 0, "nur Metadaten ohne Volltext werden gespeichert");

  const session = await call("/api/contributions/manual", "POST", { title: "Power Automate talk", kind: "session", published: "2026-01-01" });
  assert.equal(session.status, 201);
  const sessionId = raw.prepare("SELECT id FROM contributions WHERE kind='session'").get().id;
  assert.equal(raw.prepare("SELECT category FROM contributions WHERE id=?").get(sessionId).category, "Speaker/Presenter");
  assert.equal((await call("/api/contributions/manual", "POST", { title: "Video presentation", kind: "video", published: "2026-01-02" })).status, 201);
  assert.equal(raw.prepare("SELECT category FROM contributions WHERE kind='video'").get().category, "Video/Webcast/Podcast");
  assert.equal((await (await call("/api/contributions/mine")).json()).contributions.length, 4);
  assert.equal((await (await call("/api/contributions/mine", "GET", undefined, { id: 2 })).json()).contributions.length, 0, "Mitglieder sehen nur eigene Einträge");

  const exported = await (await call("/api/contributions/export?from=2026-01-01&to=2026-01-01")).json();
  assert.equal(exported.total, 2, "Datumsgrenzen sind inklusiv");
  assert.ok(exported.csv.includes("'=SUM(1,1)"), "CSV-Formeln werden entschärft");
  assert.equal((await (await call("/api/contributions/export?from=2026-02-30")).json()).error, "bad_period");
  for (let i = 0; i < 1001; i++) raw.prepare("INSERT INTO contributions(user_id,title,url,published,kind,created) VALUES(1,?,?,1767225600,'blog',1)").run(`Imported ${i}`, `https://example.com/import-${i}`);
  const truncated = await (await call("/api/contributions/export?from=2026-01-01&to=2026-01-01")).json();
  assert.equal(truncated.total, 1003);
  assert.equal(truncated.items.length, 1000);
  assert.equal(truncated.truncated, true, "gekürzte Exporte weisen die Gesamttrefferzahl aus");
  assert.equal((await call("/api/contributions/delete", "POST", { id: imported.id })).status, 200);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM contribution_ignored WHERE user_id=1 AND url=?").get(imported.url).n, 1, "Import-Löschung legt einen Tombstone an");
  assert.ok(!(await (await call("/api/contributions/mine")).json()).contributions.some((x) => x.url === imported.url), "Tombstones erscheinen nicht in /mine");
  assert.ok(!(await (await call("/api/contributions/export")).json()).items.some((x) => x.url === imported.url), "Tombstones erscheinen nicht im Export");
  globalThis.fetch = async () => new Response(`<rss><channel><item><title>Reappeared</title><link>https://example.com/post-auto</link><pubDate>Mon, 01 Jan 2024 00:00:00 GMT</pubDate></item></channel></rss>`);
  raw.prepare("UPDATE contribution_sources SET fetched=0 WHERE id=?").run(sourceId);
  try { await refreshContributions({ DB: db }, 1); } finally { globalThis.fetch = originalFetch; }
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM contributions WHERE user_id=1 AND url=?").get(imported.url).n, 0, "Tombstone verhindert den erneuten Import");
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM contribution_ignored WHERE user_id=1 AND url=?").get(imported.url).n, 1);
  assert.equal((await call("/api/contributions/delete", "POST", { id: manualId }, { id: 2 })).status, 404, "Beiträge anderer werden nicht gelöscht");
  assert.equal((await call("/api/contributions/delete", "POST", { id: manualId })).status, 200);
  assert.equal((await call("/api/contributions/source/delete", "POST", { id: sourceId }, { id: 2 })).status, 404, "Quellen anderer werden nicht gelöscht");
  assert.equal((await call("/api/contributions/source/delete", "POST", { id: sourceId, delete_contributions: true })).status, 200);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM contributions WHERE id=?").get(imported.id).n, 0, "Quellen-Löschen kann ihre Importe entfernen");
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM contribution_sources WHERE id=?").get(sourceId).n, 0);
  const { deleteUserData: wipe } = await import("../src/profiles.js");   // Kontoloeschung entfernt auch die Loeschmarken (sie enthalten URLs)
  await wipe(db, 1);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM contribution_ignored WHERE user_id=1").get().n, 0, "Kontolöschung entfernt Tombstones");
});

test("contributions: URL ohne Feed-Endung wird direkt als Feed geprüft", async () => {
  const { db, raw } = await searchDb();
  raw.exec("INSERT INTO users(id,provider,sub,name,created) VALUES(1,'g','1','Anna',1)");
  const user = { id: 1 }, J = (data, status = 200) => new Response(JSON.stringify(data), { status });
  const sourceUrl = "https://api.spreaker.com/v2/shows/42/episodes/feed", url = new URL("https://x/api/contributions/source");
  const sourceResponse = await handleContributions({ DB: db },
    new Request(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ kind: "podcast", url: sourceUrl }) }),
    url, url.pathname, user, J);
  assert.equal(sourceResponse.status, 201);
  const originalFetch = globalThis.fetch;
  let fetched = "";
  globalThis.fetch = async (input) => { fetched = String(input); return new Response(`<rss><channel><item><title>Spreaker episode</title><link>https://www.spreaker.com/episode/42</link></item></channel></rss>`); };
  try { await refreshContributions({ DB: db }, 1); } finally { globalThis.fetch = originalFetch; }
  assert.equal(fetched, sourceUrl);
  assert.equal(raw.prepare("SELECT category FROM contributions").get().category, "Video/Webcast/Podcast");
});

test("contributions: Metriken filtern Hosts, autorisieren Spreaker und lassen Fehlschläge nicht blockieren", async () => {
  const { db, raw } = await searchDb();
  raw.exec("INSERT INTO users(id,provider,sub,name,created) VALUES(1,'g','1','Anna',1),(2,'g','2','Ben',1)");
  raw.exec("INSERT INTO pod_episodes(id,user_id,title,status,spreaker_id,created,updated) VALUES(1,1,'Own','published',101,1,1),(2,2,'Guest','published',202,1,1),(3,2,'Foreign','published',303,1,1),(4,1,'Slug','published',112,1,1)");
  raw.exec("INSERT INTO item_guests(kind,item_id,user_id,status,created) VALUES('podcast',2,1,'confirmed',1)");
  for (let i = 102; i <= 111; i++) raw.prepare("INSERT INTO pod_episodes(id,user_id,title,status,spreaker_id,created,updated) VALUES(?,1,'Own','published',?,1,1)").run(i, i);
  for (let i = 1; i <= 51; i++) raw.prepare("INSERT INTO contributions(user_id,title,url,published,kind,created) VALUES(1,?,?,1,'video',1)").run(`missing ${i}`, `https://www.youtube.com/watch?v=missin${String(i).padStart(5, "0")}`);
  raw.prepare("INSERT INTO contributions(user_id,title,url,published,kind,created) VALUES(1,'Real','https://www.youtube.com/watch?v=abcdefghijk',1,'video',1)").run();
  raw.prepare("INSERT INTO contributions(user_id,title,url,published,kind,created) VALUES(1,'Own episode','https://www.spreaker.com/episode/101',1,'podcast',1),(1,'Guest episode','https://spreaker.com/episode/202',1,'podcast',1),(1,'Foreign episode','https://spreaker.com/episode/303',1,'podcast',1),(1,'Fake host','https://evilspreaker.com/episode/404',1,'podcast',1),(1,'Slug episode','https://www.spreaker.com/episode/a-title--112',1,'podcast',1)").run();
  for (let i = 102; i <= 111; i++) raw.prepare("INSERT INTO contributions(user_id,title,url,published,kind,created) VALUES(1,?,?,1,'podcast',1)").run(`Own episode ${i}`, `https://spreaker.com/episode/${i}`);

  const originalFetch = globalThis.fetch, requested = [];
  globalThis.fetch = async (input) => {
    const target = String(input); requested.push(target);
    if (target.includes("oauth2.googleapis.com/token")) return new Response(JSON.stringify({ access_token: "test" }));
    if (target.includes("/youtube/v3/videos?")) {
      const ids = new URL(target).searchParams.get("id").split(",");
      return new Response(JSON.stringify({ items: ids.includes("abcdefghijk") ? [{ id: "abcdefghijk", statistics: { viewCount: "123" } }] : [] }));
    }
    if (target.includes("api.spreaker.com/v2/episodes/")) {
      const id = target.split("/").pop();
      return new Response(JSON.stringify({ response: { episode: { show_id: "6704921", downloads_count: id === "101" ? "10" : "20" } } }));
    }
    throw new Error("unexpected request " + target);
  };
  const env = { DB: db, YT_CLIENT_ID: "id", YT_CLIENT_SECRET: "secret", YT_REFRESH_TOKEN: "refresh", SPREAKER_TOKEN: "test", SPREAKER_SHOW_IDS: "6704921" };
  try {
    await refreshContributions(env);
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM contributions WHERE (title LIKE 'Own episode%' OR title IN ('Guest episode','Slug episode')) AND metrics_updated=0").get().n, 3, "Spreaker-Zeilen außerhalb des Lauf-Limits bleiben für den nächsten Lauf offen");
    await refreshContributions(env);
  } finally { globalThis.fetch = originalFetch; }
  assert.equal(raw.prepare("SELECT views FROM contributions WHERE title='Real'").get().views, 123);
  assert.ok(raw.prepare("SELECT COUNT(*) n FROM contributions WHERE title LIKE 'missing %' AND metrics_updated>0").get().n >= 50, "fehlende Videos werden nicht dauerhaft erneut selektiert");
  assert.equal(requested.filter((x) => x.includes("api.spreaker.com/v2/episodes/")).length, 13, "alle autorisierten Folgen werden über mehrere Läufe abgefragt");
  assert.equal(raw.prepare("SELECT downloads FROM contributions WHERE title='Own episode'").get().downloads, 10);
  assert.equal(raw.prepare("SELECT downloads FROM contributions WHERE title='Guest episode'").get().downloads, 20);
  assert.equal(raw.prepare("SELECT downloads FROM contributions WHERE title='Slug episode'").get().downloads, 20, "Slug-URL wird per gebundener Episoden-ID autorisiert");
  assert.equal(raw.prepare("SELECT downloads FROM contributions WHERE title='Foreign episode'").get().downloads, 0);
  assert.equal(raw.prepare("SELECT metrics_updated FROM contributions WHERE title='Fake host'").get().metrics_updated, 0);
});

test("schema: Migrationen sind idempotent und enthalten jede zur Laufzeit angelegte Tabelle", () => {
  const dir = new URL("../migrations/", import.meta.url);
  const files = readdirSync(dir).filter((f) => f.endsWith(".sql")).sort();
  assert.ok(files.length >= 1 && files[0] === "0001_baseline.sql");
  const prefixes = files.map((f) => /^\d+/.exec(f)?.[0]);
  assert.ok(prefixes.every(Boolean), "jede Migration braucht ein numerisches Präfix");
  assert.equal(new Set(prefixes).size, prefixes.length, "Migrationsnummern müssen eindeutig sein");
  const sql = files.map((f) => readFileSync(new URL(f, dir), "utf-8")).join("\n");
  const stmts = sql.replace(/--[^\n]*/g, "").split(";").map((s) => s.trim()).filter(Boolean);
  for (const s of stmts) {
    if (/^ALTER TABLE search_doc ADD COLUMN (?:grp|title_norm) TEXT NOT NULL DEFAULT ''$/i.test(s)
      || /^ALTER TABLE (?:push_subs ADD COLUMN digest INTEGER NOT NULL DEFAULT 1|events ADD COLUMN tz TEXT NOT NULL DEFAULT 'Europe\/Berlin')$/i.test(s)) continue;
    if (/^ALTER TABLE (?:expert_requests ADD COLUMN (?:hide_outlet INTEGER NOT NULL DEFAULT 0|reach TEXT NOT NULL DEFAULT ''|audience TEXT NOT NULL DEFAULT 'all'|mode TEXT NOT NULL DEFAULT 'match'|held_reason TEXT NOT NULL DEFAULT '')|expert_request_replies ADD COLUMN (?:kind TEXT NOT NULL DEFAULT 'match'|status TEXT NOT NULL DEFAULT 'pending')|contributions ADD COLUMN expert_request_id INTEGER)$/i.test(s)) continue;
    if (/^ALTER TABLE users ADD COLUMN (?:merged_into INTEGER|merged_at INTEGER NOT NULL DEFAULT 0)$/i.test(s)
      || /^INSERT OR IGNORE INTO user_identities\(user_id, provider, sub, created\) SELECT id, provider, sub, created FROM users$/i.test(s)) continue;   // #279: Rueckfuellung ist idempotent
    if (/^INSERT OR IGNORE INTO ad_(?:products|prices|settings)\(/i.test(s)) continue;   // #281: Startwerte, idempotent (vorhandene Admin-Werte bleiben)
    if (/^ALTER TABLE org_entity ADD COLUMN confirmed INTEGER NOT NULL DEFAULT 0$/i.test(s) || /^UPDATE org_entity SET confirmed=1 WHERE EXISTS \(/i.test(s)) continue;   // 0026: Rueckfuellung setzt nur 1, idempotent
    if (/^ALTER TABLE orgs ADD COLUMN unclaimed INTEGER NOT NULL DEFAULT 0$/i.test(s)) continue;   // 0034: Spalte mit Standardwert
    if (/^ALTER TABLE entity_claims ADD COLUMN (?:verified_via|verified_domain|fwd_mask) TEXT NOT NULL DEFAULT ''$/i.test(s) || /^UPDATE entity_claims SET verified_via=CASE /i.test(s)) continue;   // 0032: Spalten mit Standardwert, Rueckfuellung idempotent
    if (/^ALTER TABLE ad_leads ADD COLUMN (?:sponsor|assigned) TEXT NOT NULL DEFAULT ''$/i.test(s)) continue;   // 0033: Sponsor-Leads, Spalten mit Standardwert
    if (/^ALTER TABLE (?:mediakit_requests ADD COLUMN (?:status TEXT NOT NULL DEFAULT 'open'|status_updated INTEGER)|ad_leads ADD COLUMN (?:lead_status TEXT NOT NULL DEFAULT 'open'|lead_status_updated INTEGER))$/i.test(s)) continue;   // 0031: Lead-Status, Laufzeit-Absicherung in mediakit.js
    // MVP-Tracker (0027): Spalten mit Standardwert; die Laufzeit-Absicherung in contributions.js legt sie nur an, wenn sie fehlen
    if (/^ALTER TABLE contributions ADD COLUMN (?:portal|portal_at|attendees|live_views|sessions) INTEGER NOT NULL DEFAULT 0$/i.test(s)
      || /^ALTER TABLE contributions ADD COLUMN (?:review|portal_desc|role|area|event_format|country) TEXT NOT NULL DEFAULT ''$/i.test(s)
      || /^ALTER TABLE contributions ADD COLUMN audience TEXT NOT NULL DEFAULT '\[\]'$/i.test(s)
      || /^ALTER TABLE user_prefs ADD COLUMN report_start INTEGER NOT NULL DEFAULT 4$/i.test(s)) continue;
    // 0036 (eigene Quellen): Spalten mit Standardwert; contributions.js legt sie zur Laufzeit nur an, wenn sie fehlen
    if (/^ALTER TABLE (?:contributions ADD COLUMN (?:guid|canon|ctype|teaser) TEXT NOT NULL DEFAULT ''|contributions ADD COLUMN feed_item_id INTEGER NOT NULL DEFAULT 0|contribution_sources ADD COLUMN (?:mode TEXT NOT NULL DEFAULT 'track'|(?:etag|modified|last_error) TEXT NOT NULL DEFAULT ''|topics TEXT NOT NULL DEFAULT '\[\]')|feed_items ADD COLUMN origin TEXT NOT NULL DEFAULT '')$/i.test(s)) continue;
    assert.match(s, /^CREATE (TABLE|INDEX|UNIQUE INDEX) IF NOT EXISTS /i, "nur idempotente Anweisungen: " + s.slice(0, 60));
  }
  const inMig = new Set([...sql.matchAll(/CREATE (?:TABLE|UNIQUE INDEX|INDEX) IF NOT EXISTS (\w+)/gi)].map((m) => m[1]));
  const src = new URL("../src/", import.meta.url);
  for (const f of readdirSync(src).filter((f) => f.endsWith(".js"))) {
    const js = readFileSync(new URL(f, src), "utf-8");
    for (const m of js.matchAll(/CREATE (?:TABLE|UNIQUE INDEX|INDEX) IF NOT EXISTS (\w+)/gi)) assert.ok(inMig.has(m[1]), `${m[1]} (aus ${f}) fehlt in migrations/`);
  }
});

test("d1 backup: virtueller FTS-Index und Schatten werden vom Tabellenexport ausgeschlossen", () => {
  const tables = d1BackupTables([
    { name: "search_doc" }, { name: "search_fts" }, { name: "search_fts_data" }, { name: "search_fts_idx" },
    { name: "search_fts_content" }, { name: "search_fts_docsize" }, { name: "search_fts_config" },
    { name: "users" }, { name: "sqlite_sequence" }, { name: "unsafe;DROP_TABLE" },
  ]);
  assert.deepEqual(tables, ["search_doc", "users"]);
  const args = d1BackupExportArgs(tables);
  assert.deepEqual(args.slice(-2), ["--table=search_doc", "--table=users"]);
  assert.deepEqual(d1BackupExportArgs([]), ["d1", "export", "m365-dub", "--remote", "--output=backup-d1.sql"]);
});

test("d1 backup: jede zur Laufzeit angelegte FTS5-Tabelle (samt Schatten) faellt aus der Sicherung", () => {
  assert.deepEqual(d1BackupTables([
    { name: "expert_profile_fts" }, { name: "expert_profile_fts_data" }, { name: "expert_profile_fts_idx" }, { name: "expert_profile_fts_content" },
    { name: "expert_profile_fts_docsize" }, { name: "expert_profile_fts_config" }, { name: "fts_notes" }, { name: "expert_requests" },
  ]), ["fts_notes", "expert_requests"]);
  const src = new URL("../src/", import.meta.url);
  for (const f of readdirSync(src).filter((f) => f.endsWith(".js"))) {
    for (const m of readFileSync(new URL(f, src), "utf-8").matchAll(/CREATE VIRTUAL TABLE IF NOT EXISTS (\w+)/gi)) {
      const shadow = ["", "_data", "_idx", "_content", "_docsize", "_config"].map((x) => ({ name: m[1] + x }));
      assert.deepEqual(d1BackupTables(shadow), [], `${m[1]} (aus ${f}) muss aus der D1-Sicherung fallen`);
    }
  }
});

test("levels: Punkte sind je Art gedeckelt, Stufen 1-6 folgen Belegen und Bestaetigungen", () => {
  assert.equal(scoreOf({ blog: 3 }), 3, "ein Beitrag = 3 Punkte");
  assert.equal(scoreOf({ library: 40 }), CAPS.library, "viele Bibliotheks-Eintraege zaehlen nur bis zur Obergrenze");
  assert.equal(scoreOf({ self: 3 }, 50), CAPS.self + CAPS.endorse, "Selbstangabe und Bestaetigungen gedeckelt");
  assert.equal(levelOf({ score: 0 }), 1); assert.equal(levelOf({ score: THRESH.practitioner }), 2); assert.equal(levelOf({ score: THRESH.expert }), 3);
  assert.equal(levelOf({ score: 1, verified: 1 }), 3, "Redaktion bestaetigt = Experte");
  assert.equal(levelOf({ score: 2, endorsed: 5000 }), 1, "ohne Expertenstufe keine hoeheren Stufen");
  assert.equal(levelOf({ score: scoreOf({}, 500) }), 2, "Bestaetigungen allein reichen hoechstens fuer Praxis");
  assert.equal(levelOf({ score: 12, endorsed: 99 }), 3); assert.equal(levelOf({ score: 12, endorsed: 100 }), 4, "Evangelist ab 100 Bestaetigungen");
  assert.equal(levelOf({ score: 12, endorsed: 1000 }), 5, "Master ab 1000"); assert.equal(levelOf({ score: 12, endorsed: 1000, endorsedEv: 1000 }), 6, "Master Evangelist ab 1000 Evangelisten");
  assert.equal(levelName(6), "Master Evangelist"); assert.equal(levelName(2, true), "Praxis");
});

// Ablauf gegen SQLite (node:sqlite) mit einem D1-aehnlichen Adapter: Migrationen, Belege einsammeln, Selbstangabe uebernehmen, Stufen berechnen
test("levels: syncExpertise baut Belege aus den Quelltabellen und setzt Stufen (SQLite)", async () => {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:");
  const dir = new URL("../migrations/", import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(f, dir), "utf-8"));
  const db = { prepare(sql) { const st = raw.prepare(sql); let args = []; const o = { bind(...a) { args = a; return o; }, all: async () => ({ results: st.all(...args) }), first: async () => st.get(...args) ?? null, run: async () => { const r = st.run(...args); return { meta: { changes: Number(r.changes) } }; } }; return o; }, async batch(stmts) { for (const s of stmts) await s.run(); } };
  const t = 1700000000;
  raw.exec(`INSERT INTO users(id,provider,sub,name,role,banned,created) VALUES(1,'g','1','Anna','user',0,${t}),(2,'g','2','Ben','user',0,${t}),(3,'g','3','Cem','user',0,${t});
    INSERT INTO profiles(user_id,public,handle,headline,about,company,job,country,show_org,updated) VALUES(1,1,'anna','','','','','',1,${t}),(2,1,'ben','','','','','',1,${t}),(3,1,'cem','','','','','',1,${t});
    INSERT INTO expertise(owner_type,owner_id,eid,level,verified) VALUES('u',2,'power-bi',3,0),('u',3,'power-bi',2,1);
    INSERT INTO blog_posts(id,user_id,slug,title,body,topics,status,created,updated) VALUES(1,1,'p1','T','B','["power-bi","fabric"]','live',${t},${t}),(2,1,'p2','T','B','["power-bi"]','live',${t},${t}),(3,1,'p3','T','B','["power-bi"]','draft',${t},${t});
    INSERT INTO events(id,owner_id,handle,title,start,created,updated) VALUES(1,2,'ev','E','2026-01-01',${t},${t});
    INSERT INTO event_sessions(id,event_id,title,topics,speakers,status,proposer_id,created) VALUES(1,1,'S','["power-bi"]','[{"h":"anna","n":"Anna","s":"confirmed"},{"h":"ben","n":"Ben"}]','live',2,${t});
    INSERT INTO certs(user_id,eid,year,url) VALUES(1,'pl-300',2025,''); INSERT INTO cert_check(user_id,eid,status,via,created) VALUES(1,'pl-300','verified','auto',${t});
    INSERT INTO endorsements(owner_id,eid,by_id,created) VALUES(1,'power-bi',2,${t}),(1,'power-bi',3,${t});`);
  const emap = new Map([["power-bi", { type: "product", rel: [] }], ["fabric", { type: "platform", rel: [] }], ["pl-300", { type: "cert", rel: [["covers", "power-bi"], ["covers", "fabric"]] }]]);
  const { syncExpertise, computeLevels } = await import("../src/levels.js");
  const r = await syncExpertise({ DB: db }, async () => emap);
  const ev = raw.prepare("SELECT owner_id,eid,kind,COUNT(*) n,SUM(weight) w FROM expertise_evidence GROUP BY owner_id,eid,kind ORDER BY owner_id,eid,kind").all();
  assert.deepEqual(ev.map((x) => [x.owner_id, x.eid, x.kind, x.n, x.w]), [[1, "fabric", "blog", 1, 3], [1, "fabric", "cert", 1, 4], [1, "power-bi", "blog", 2, 6], [1, "power-bi", "cert", 1, 4], [1, "power-bi", "session", 1, 5], [2, "power-bi", "self", 1, 3], [2, "power-bi", "session", 1, 2], [3, "power-bi", "self", 1, 2]],
    "Entwuerfe zaehlen nicht; unbestaetigter Sprecher zaehlt nur, wenn er der Veranstalter ist (Ben, eigene Veranstaltung = Gewicht 2); Selbstangaben einmal als 'self' uebernommen");
  assert.equal(r.seeded, 2);
  const lv = Object.fromEntries(raw.prepare("SELECT owner_id||':'||eid k,level FROM expertise WHERE owner_type='u'").all().map((x) => [x.k, x.level]));
  assert.deepEqual(lv, { "1:fabric": 2, "1:power-bi": 3, "2:power-bi": 2, "3:power-bi": 3 }, "Anna: 6+4+5+2 Punkte = Experte, Fabric 7 = Praxis; Ben: Selbstangabe 3 + eigene Session 2 = 5 -> Praxis; Cem: Redaktion bestaetigt -> Experte");
  const sc = raw.prepare("SELECT score,endorsed FROM expertise_score WHERE owner_id=1 AND eid='power-bi'").get();
  assert.equal(sc.score, 17); assert.equal(sc.endorsed, 2);
  // zweiter Lauf: keine doppelte Uebernahme, nichts aendert sich; Bestaetigungen bis zur Stufe Evangelist werden nachgezogen
  const r2 = await syncExpertise({ DB: db }, async () => emap); assert.equal(r2.seeded, 0); assert.equal(r2.changed, 0);
  for (let i = 10; i < 110; i++) raw.exec(`INSERT INTO endorsements(owner_id,eid,by_id,created) VALUES(1,'power-bi',${i},${t})`);
  await computeLevels(db, { uid: 1, eid: "power-bi" });
  assert.equal(raw.prepare("SELECT level FROM expertise WHERE owner_id=1 AND eid='power-bi'").get().level, 4, "102 Bestaetigungen: Evangelist");
  // Paar-Pfad vor dem ersten vollen Lauf (Bestaetigung direkt nach dem Deploy): Selbstangabe wird trotzdem uebernommen
  raw.exec(`INSERT INTO users(id,provider,sub,name,role,banned,created) VALUES(4,'g','4','Dana','user',0,${t}); INSERT INTO expertise(owner_type,owner_id,eid,level,verified) VALUES('u',4,'fabric',3,0); INSERT INTO endorsements(owner_id,eid,by_id,created) VALUES(4,'fabric',1,${t})`);
  await computeLevels(db, { uid: 4, eid: "fabric" });
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM expertise_evidence WHERE owner_id=4 AND kind='self'").get().n, 1, "self-Beleg auch im Paar-Pfad");
  assert.equal(raw.prepare("SELECT level FROM expertise WHERE owner_id=4 AND eid='fabric'").get().level, 2, "3 (self) + 1 (Bestaetigung) = 4 Punkte -> Praxis");
  // geloeschtes Konto: deleteUserData raeumt Belege und Kennzahlen, der naechste Lauf legt nichts neu an
  const { deleteUserData } = await import("../src/profiles.js");
  await deleteUserData(db, 4); raw.exec("DELETE FROM users WHERE id=4");
  await syncExpertise({ DB: db }, async () => emap);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM expertise WHERE owner_id=4").get().n + raw.prepare("SELECT COUNT(*) n FROM expertise_evidence WHERE owner_id=4").get().n + raw.prepare("SELECT COUNT(*) n FROM expertise_score WHERE owner_id=4").get().n, 0, "nichts bleibt fuer das geloeschte Konto");
});

test("quotes: importQuotesFromSite schreibt nur Zitate mit Personen-Entitaet und ueberschreibt keine Redaktions-Zitate (SQLite)", async () => {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:");
  const dir = new URL("../migrations/", import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(f, dir), "utf-8"));
  const db = { prepare(sql) { const st = raw.prepare(sql); let args = []; const o = { bind(...a) { args = a; return o; }, all: async () => ({ results: st.all(...args) }), first: async () => st.get(...args) ?? null, run: async () => st.run(...args) }; return o; }, async batch(s) { for (const x of s) await x.run(); } };
  raw.exec("INSERT INTO quote(id,person_eid,text,lang,src,created) VALUES('2-1','anna','Redaktion','en','admin',1)");
  const file = { quotes: [{ id: "1-1", person: "mirko-peters", text: "Ein Zitat", lang: "de", episode_id: "1", time_s: 12.4, about: ["azure"] }, { id: "1-2", person: "", text: "ohne Person", lang: "en" }, { id: "2-1", person: "anna", text: "Seitenbau", lang: "en" }] };
  const old = globalThis.fetch; globalThis.fetch = async () => ({ json: async () => file });
  try {
    const { importQuotesFromSite, handleQuotes } = await import("../src/quotes.js");
    const r = await importQuotesFromSite({ DB: db, SITE: "https://x" });
    assert.equal(r.imported, 2);
    const rows = raw.prepare("SELECT id,person_eid,text,time_s FROM quote ORDER BY id").all();
    assert.deepEqual(rows.map((x) => [x.id, x.person_eid, x.text, x.time_s]), [["1-1", "mirko-peters", "Ein Zitat", 12], ["2-1", "anna", "Redaktion", null]], "ohne Person verworfen, Redaktions-Zitat bleibt");
    const res = await handleQuotes({ DB: db }, new URL("https://x/api/quotes/export?person=mirko-peters"), (d) => d);
    assert.equal(res.quotes.length, 1); assert.deepEqual(res.quotes[0].about, ["azure"]);
  } finally { globalThis.fetch = old; }
});

test("contentblog: importContentBlog legt Pakete pending/live an, erneuert nur unveraenderte und schuetzt Editor-Aenderungen (SQLite)", async () => {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:");
  const dir = new URL("../migrations/", import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(f, dir), "utf-8"));
  const db = { prepare(sql) { const st = raw.prepare(sql); let args = []; const o = { bind(...a) { args = a; return o; }, all: async () => ({ results: st.all(...args) }), first: async () => st.get(...args) ?? null, run: async () => st.run(...args) }; return o; }, async batch(s) { for (const x of s) await x.run(); } };
  raw.exec(`INSERT INTO users(id,provider,sub,name,role,banned,created) VALUES(1,'g','1','Mirko','user',0,1);
    INSERT INTO profiles(user_id,public,handle,headline,about,company,job,country,show_org,updated) VALUES(1,1,'mirko-p','','','','','',1,1);
    INSERT INTO blog_posts(user_id,slug,title,created,updated) VALUES(1,'von-hand','Von Hand',1,1)`);
  const P = (o) => ({ slug: "a-post", lang: "de", title: "Ein Beitrag", summary: "Kurz", html: "<p>Text</p>", author: "mirko-p", topics: ["azure"], faq: [], publish: false, published: 100, hash: "h1", ...o });
  let file = { items: [P(), P({ slug: "b-post", publish: true }), P({ slug: "von-hand" }), P({ slug: "boese", html: "<script>x</script>" }), P({ slug: "fremd", author: "niemand" })] };
  const old = globalThis.fetch; globalThis.fetch = async () => ({ ok: true, json: async () => file });
  let clock = 1000; const now = () => clock;
  try {
    const { importContentBlog } = await import("../src/contentblog.js");
    let r = await importContentBlog({ DB: db, SITE: "https://x" }, now);
    assert.deepEqual([r.created, r.published, r.skipped], [2, 1, 3], "zwei neu, einer live; Slug von Hand, Skript, unbekannter Autor uebersprungen");
    const st = (s) => raw.prepare("SELECT status,title,published FROM blog_posts WHERE slug=?").get(s);
    assert.equal(st("a-post").status, "pending"); assert.equal(st("b-post").status, "live"); assert.equal(st("b-post").published, 100);
    assert.equal(st("von-hand").title, "Von Hand", "Beitrag von Hand bleibt");
    clock = 2000; file = { items: [P({ title: "Neuer Titel", hash: "h2", publish: true }), P({ slug: "b-post", publish: true, title: "B neu", hash: "h3" })] };
    raw.exec("UPDATE blog_posts SET title='Im Editor', updated=1500 WHERE slug='b-post'");
    r = await importContentBlog({ DB: db, SITE: "https://x" }, now);
    assert.equal(st("a-post").title, "Neuer Titel"); assert.equal(st("a-post").status, "live", "publish-Flag schaltet wartenden Beitrag live");
    assert.equal(st("b-post").title, "Im Editor", "im Editor geaendert: Paket ueberschreibt nicht");
    clock = 3000; file = { items: [P({ slug: "b-post", publish: true, title: "B noch neuer", hash: "h4" })] };
    await importContentBlog({ DB: db, SITE: "https://x" }, now);
    assert.equal(st("b-post").title, "Im Editor", "Schutz bleibt dauerhaft");
  } finally { globalThis.fetch = old; }
});

test("register: applyRenames gibt der vorhandenen Folge den neuen Slug, nimmt Uebersetzungen mit und legt keine zweite Zeile an (SQLite)", async () => {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:");
  const dir = new URL("../migrations/", import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(f, dir), "utf-8"));
  const db = { prepare(sql) { const st = raw.prepare(sql); let args = []; const o = { bind(...a) { args = a; return o; }, all: async () => ({ results: st.all(...args) }), first: async () => st.get(...args) ?? null, run: async () => st.run(...args) }; return o; }, async batch(s) { for (const x of s) await x.run(); } };
  raw.exec("INSERT INTO episode(slug,spreaker_id,title,lang,h,updated) VALUES('alt','73815737','Titel','en','x',1)");
  raw.exec("INSERT INTO episode_text(episode_id,field,text,h,updated) VALUES(1,'notes','Notizen','y',1)");
  raw.exec("INSERT INTO translation(kind,item_id,lang,field,text,src,created) VALUES('episode','alt','de','title','Titel DE','haiku',1)");
  raw.exec("INSERT INTO episode(slug,spreaker_id,title,lang,h,updated) VALUES('b','2','B','en','x',1),('b-neu','3','B neu','en','x',1)");
  const { applyRenames } = await import("../src/register.js");
  const r = await applyRenames(db, { alt: "neu", b: "b-neu", fehlt: "egal" });
  assert.deepEqual(r, [{ from: "alt", to: "neu" }, { from: "b", to: "b-neu", conflict: true }]);
  assert.deepEqual(raw.prepare("SELECT id,slug,h FROM episode ORDER BY id").all().map((x) => [x.id, x.slug, x.h]), [[1, "neu", ""], [2, "b", "x"], [3, "b-neu", "x"]], "id bleibt, Konflikt laesst beide Zeilen stehen");
  assert.equal(raw.prepare("SELECT text FROM episode_text WHERE episode_id=1").get().text, "Notizen");
  assert.equal(raw.prepare("SELECT item_id FROM translation WHERE kind='episode'").get().item_id, "neu");
  assert.deepEqual(await applyRenames(db, { alt: "neu" }), [], "zweiter Lauf aendert nichts");
});

test("entities: syncEntitiesFromSite uebernimmt JSON-Aenderungen, wenn zuletzt eine Maschine das Feld gesetzt hat, und laesst Menschen-Aenderungen stehen (SQLite)", async () => {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:");
  const dir = new URL("../migrations/", import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(f, dir), "utf-8"));
  const db = { prepare(sql) { const st = raw.prepare(sql); let args = []; const o = { bind(...a) { args = a; return o; }, all: async () => ({ results: st.all(...args) }), first: async () => st.get(...args) ?? null, run: async () => st.run(...args) }; return o; }, async batch(s) { for (const x of s) await x.run(); } };
  const ins = (eid, data, uid, status, summary) => raw.prepare("INSERT INTO entity_rev(eid,data,summary,user_id,status,created) VALUES(?,?,?,?,?,1)").run(eid, JSON.stringify(data), summary, uid, status);
  // a: nur importiert -> Name und Doku-Link aus der JSON
  ins("a", { type: "person", name: "Yves HABERSAAT", desc: { en: "Bio" } }, 0, "live", "Übernahme aus entities.json");
  // b: Mensch hat den Namen geaendert, danach Auto-Uebersetzung -> Name bleibt, neuer Doku-Link kommt, fr-Uebersetzung bleibt
  ins("b", { type: "product", name: "Alt", desc: { en: "E" } }, 0, "old", "Übernahme aus entities.json");
  ins("b", { type: "product", name: "Von Hand", desc: { en: "E" } }, 7, "old", "Korrektur");
  ins("b", { type: "product", name: "Von Hand", desc: { en: "E", fr: "F" } }, 0, "live", "Auto-Übersetzung (Claude Haiku)");
  // c: unveraendert -> nichts
  ins("c", { type: "concept", name: "C" }, 0, "live", "Übernahme aus entities.json");
  const src = [{ id: "a", type: "person", name: "Yves Habersaat", desc: { en: "Bio" }, docs: "https://learn.microsoft.com/x" },
    { id: "b", type: "product", name: "JSON-Name", desc: { en: "E" }, docs: "https://learn.microsoft.com/b", wikidata: "Q42" },
    { id: "c", type: "concept", name: "C" }, { id: "neu", type: "concept", name: "Neu" }];
  const old = globalThis.fetch; let body = { entities: src };
  globalThis.fetch = async (u) => ({ ok: true, json: async () => (String(u).endsWith("/entities-src.json") ? body : { entities: src }) });
  try {
    const { syncEntitiesFromSite, importEntitiesFromSite } = await import("../src/entities.js");
    const r = await syncEntitiesFromSite({ DB: db, SITE: "https://x" });
    assert.equal(r.updated, 2); assert.equal(r.candidates, 2);
    const live = (id) => JSON.parse(raw.prepare("SELECT data FROM entity_rev WHERE eid=? AND status='live'").get(id).data);
    assert.equal(live("a").name, "Yves Habersaat"); assert.equal(live("a").docs, "https://learn.microsoft.com/x");
    assert.equal(live("b").name, "Von Hand", "Menschen-Aenderung bleibt"); assert.equal(live("b").docs, "https://learn.microsoft.com/b"); assert.equal(live("b").wikidata, "Q42"); assert.equal(live("b").desc.fr, "F", "Uebersetzung bleibt");
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM entity_rev WHERE eid='c'").get().n, 1, "unveraendert -> keine neue Fassung");
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM entity_rev WHERE eid IN ('a','b')").get().n, 6, "alte Fassungen bleiben (status old), nichts geloescht");
    const r2 = await syncEntitiesFromSite({ DB: db, SITE: "https://x" });
    assert.equal(r2.updated, 0, "zweiter Lauf aendert nichts"); assert.equal(r2.candidates, 1, "b bleibt Kandidat wegen des Menschen-Namens");
    body = { entities: src.slice(0, 2) };   // halber Seitenbau
    const r3 = await syncEntitiesFromSite({ DB: db, SITE: "https://x" });
    assert.match(r3.skipped || "", /unvollstaendig/);
    body = { entities: src };
    const r4 = await importEntitiesFromSite({ DB: db, SITE: "https://x" });
    assert.equal(r4.imported, 1, "neue ID wird wie bisher uebernommen"); assert.equal(r4.synced.updated, 0);
    raw.exec("INSERT INTO meta(k,v) VALUES('entity_source','db') ON CONFLICT(k) DO UPDATE SET v='db'");
    assert.match((await syncEntitiesFromSite({ DB: db, SITE: "https://x" })).skipped, /entity_source=db/);
  } finally { globalThis.fetch = old; }
});

test("sponsor: Anfragen, Honeypot, Rate-Limit und Admin-Panel (SQLite)", async () => {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:");
  const dir = new URL("../migrations/", import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(f, dir), "utf-8"));
  const db = { prepare(sql) { const st = raw.prepare(sql); let args = []; const o = { bind(...a) { args = a; return o; }, all: async () => ({ results: st.all(...args) }), first: async () => st.get(...args) ?? null, run: async () => { const r = st.run(...args); return { meta: { changes: Number(r.changes), last_row_id: Number(r.lastInsertRowid) } }; } }; return o; }, async batch(s) { for (const x of s) await x.run(); } };
  const env = { DB: db, SESSION_SECRET: "test-secret", SITE: "https://www.m365.fm", ADMIN_SUBS: "google:sub2" };
  raw.exec("INSERT INTO users(id,provider,sub,name,role,banned,created) VALUES(1,'google','sub1','Admin 1','admin',0,1),(2,'google','sub2','Admin 2','user',0,1)");
  raw.exec("INSERT INTO mail_addr(user_id,email,verified,created) VALUES(1,'admin1@example.com',1,1),(2,'admin2@example.com',1,1)");
  const J = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json" } });
  const payload = (extra = {}) => ({ company: "Contoso", name: "Ada Beispiel", email: "ada@example.com", message: "Bitte melden.", package: { ziel: "Azure", themen: ["Cloud"], laufzeit: "3 Monate", bausteine: ["Podcast"], preisMonat: 500, gesamtpreis: 1500 }, lang: "de", ...extra });
  const request = (body) => new Request("https://api.example/api/sponsor/request", { method: "POST", headers: { "cf-connecting-ip": "203.0.113.8", "content-type": "application/json" }, body: JSON.stringify(body) });
  const post = (body) => handleSponsor(env, request(body), new URL("https://api.example/api/sponsor/request"), "/api/sponsor/request", J);

  assert.equal((await post(null)).status, 400, "ungueltige JSON-Form wird kontrolliert abgewiesen");
  assert.equal((await post(payload({ email: "nicht-eine-mail" }))).status, 400);
  let response = await post(payload());
  assert.equal(response.status, 200);
  let rows = raw.prepare("SELECT id,status,ip_hash,package FROM sponsor_requests ORDER BY id").all();
  assert.equal(rows[0].status, "new");
  assert.match(rows[0].ip_hash, /^[a-f0-9]{64}$/);
  assert.notEqual(rows[0].ip_hash, "203.0.113.8");
  assert.equal(JSON.parse(rows[0].package).preisMonat, 500);
  let outbox = raw.prepare("SELECT user_id,key,html FROM mail_outbox ORDER BY user_id").all();
  assert.deepEqual(outbox.map((x) => x.user_id), [1, 2], "beide Admin-Konten bekommen eine Outbox-Mail");
  assert.ok(outbox.some((x) => x.key === `sponsor:${rows[0].id}`));
  assert.match(outbox[0].html, /Contoso/);
  assert.match(outbox[0].html, /\$500\/Monat · \$1,500 gesamt/, "aeltere Anfragen mit Zahlen: gleiches Format wie die Sponsor-Seite");
  assert.match(outbox[0].html, /href="https:\/\/www\.m365\.fm\/admin\/#sponsor"/, "Link oeffnet den Reiter Sponsor-Anfragen");

  response = await post(payload({ website: "gefüllt" }));
  assert.equal(response.status, 200);
  rows = raw.prepare("SELECT id,status FROM sponsor_requests ORDER BY id").all();
  assert.equal(rows[1].status, "spam");
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM mail_outbox").get().n, 2, "Honeypot erzeugt keine Mail");

  for (let i = 0; i < 3; i++) assert.equal((await post(payload())).status, 200);
  assert.equal((await post(payload())).status, 429, "sechste Anfrage innerhalb einer Stunde wird abgewiesen");
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM sponsor_requests").get().n, 5);

  const adminReq = new Request("https://api.example/api/admin/panel/sponsor-requests?status=spam&limit=10");
  response = await handleAdminPanel(env, adminReq, new URL(adminReq.url), "/api/admin/panel/sponsor-requests", { id: 3, admin: false }, J);
  assert.equal(response.status, 403, "Liste ist nur fuer Admins");
  response = await handleAdminPanel(env, adminReq, new URL(adminReq.url), "/api/admin/panel/sponsor-requests", { id: 1, admin: true }, J);
  let result = await response.json();
  assert.equal(result.total, 1);
  assert.equal(result.items[0].status, "spam");
  response = await handleAdminPanel(env, new Request("https://api.example/api/admin/panel/sponsor-requests/status", { method: "POST", body: JSON.stringify({ id: rows[0].id, status: "contacted" }) }), new URL("https://api.example/api/admin/panel/sponsor-requests/status"), "/api/admin/panel/sponsor-requests/status", { id: 1, admin: true }, J);
  assert.equal(response.status, 200);
  assert.equal(raw.prepare("SELECT status FROM sponsor_requests WHERE id=?").get(rows[0].id).status, "contacted");
  raw.close();
});

test("sponsor dashboard: Platzierungen, Firmenzugriff, Quellen und manuelle Werte (SQLite)", async () => {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:");
  const dir = new URL("../migrations/", import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(f, dir), "utf-8"));
  let sponsorPlacementListQueries = 0;
  const db = {
    prepare(sql) {
      if (sql === "SELECT id FROM sponsor_placements") sponsorPlacementListQueries++;
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
  raw.exec(`
    INSERT INTO users(id,provider,sub,name,role,banned,created) VALUES
      (1,'google','sponsor','Sponsor User','user',0,1),(2,'google','admin','Platform Admin','admin',0,1),(3,'google','other','Other User','user',0,1);
    INSERT INTO orgs(id,handle,name,website,created) VALUES (1,'acme','Acme GmbH','https://shared.example/',1),(2,'other-co','Other Company','https://shared.example/',1),(3,'empty-co','No Sponsorship','https://empty.example/',1);
    INSERT INTO org_members(org_id,user_id,role,status,created) VALUES
      (1,1,'owner','active',1),(2,3,'owner','active',1),(1,3,'member','pending',1);
    INSERT INTO sponsor_placements(id,org_id,title,channel,langs,start,end,refs,created) VALUES
      ('acme-pod',1,'Podcast placement','podcast_video','de,en','2026-11-01','2026-12-01','{}',1),
      ('other-web',2,'Other placement','website','en','2026-11-01','2026-12-01','{}',1);
    INSERT INTO sponsor_metrics_daily(placement_id,day,metric,dim,value,source,kind,fetched_at) VALUES
      ('acme-pod','2026-11-03','podcast_plays','','12','spreaker','measured',1793664000);
    INSERT INTO events(id,handle,owner_id,title,start,end,created,updated) VALUES
      (1,'event-one',2,'Partner Event','2026-11-01','2026-11-02',1,1),
      (2,'event-two',2,'Pending Event','2026-12-01','2026-12-03',1,1),
      (3,'other-event',3,'Private Event','2026-11-01','2026-11-02',1,1);
    INSERT INTO event_partners(event_id,org_id,kind,level,status,created) VALUES
      (1,1,'sponsor','Gold','confirmed',1),(2,1,'media','Community','pending',1),(3,2,'sponsor','Gold','confirmed',1);
    INSERT INTO event_attendees(event_id,user_id,status,visible,created) VALUES
      (1,3,'going',0,1),(1,2,'waitlist',0,1),(3,1,'going',0,1);
  `);
  const env = { DB: db, ADMIN_SUBS: "", SITE: "https://www.m365.fm", CRON_KEY: "test-cron-key" };
  const J = (data, status = 200, headers = {}) => new Response(JSON.stringify(data), { status, headers });
  const call = (path, method, user, body, extraHeaders = {}) => {
    const request = new Request(`https://api.example${path}`, {
      method, headers: { "content-type": "application/json", "x-requested-with": "m365", ...extraHeaders },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
    return handleSponsor(env, request, new URL(request.url), new URL(request.url).pathname, J, user);
  };

  assert.equal((await call("/api/sponsor/dashboard", "GET", null)).status, 401);
  let response = await call("/api/sponsor/dashboard?from=2026-11-01&to=2026-11-30", "GET", { id: 1 });
  let result = await response.json();
  assert.equal(result.orgs.length, 1, "nur verwaltete Firmen werden angezeigt");
  assert.equal(result.orgs[0].handle, "acme");
  assert.equal(result.admin, false);
  assert.equal(result.orgs[0].metrics.length, 8);
  assert.ok(result.orgs[0].metrics.every((m) => m.source && ["measured", "estimated", "manual"].includes(m.kind)),
    "jede Kennzahl hat Quelle und Messart");
  assert.ok(result.orgs[0].metrics.every((m) => m.value === null || m.as_of), "Werte haben immer einen Datenstand");
  assert.equal(result.orgs[0].metrics.find((m) => m.key === "podcast_plays").value, 12);
  assert.equal(result.orgs[0].metrics.find((m) => m.key === "podcast_plays").source, "Spreaker API");
  assert.equal(result.orgs[0].placements[0].id, "acme-pod");
  response = await call("/api/sponsor/dashboard?org=acme&from=2026-11-01&to=2026-11-30", "GET", { id: 3 });
  result = await response.json();
  assert.equal(result.orgs.some((o) => o.handle === "acme"), false, "fremde Firmen werden nicht angezeigt");
  assert.equal(result.orgs[0].handle, "other-co", "gleiche orgs.website gewährt keinen Zugriff");
  assert.equal((await call("/api/sponsor/placement?id=acme-pod", "GET", { id: 3 })).status, 404,
    "fremde Platzierungsdetails liefern 404");
  assert.equal((await call("/api/sponsor/sources", "GET", { id: 1 })).status, 403, "Datenquellen sind Admin-only");
  assert.equal((await call("/api/sponsor/manual-metric", "POST", { id: 1 }, {
    placement_id: "acme-pod", source: "bing_ai", metric: "ai_citations",
    period: "2026-11", value: 12, link: "https://example.com/report", proof_key: "sponsors/acme/bing-2026-11.csv"
  })).status, 403, "manuelle Werte sind Admin-only");
  assert.equal((await call("/api/sponsor/sources", "GET", { id: 2, admin: true })).status, 200);
  result = await (await call("/api/sponsor/dashboard?from=2026-11-01&to=2026-11-30", "GET", { id: 2, admin: true })).json();
  assert.deepEqual(result.orgs.map((org) => org.handle).sort(), ["acme", "other-co"],
    "Admin ohne org-Auswahl sieht nur Firmen mit Sponsorplatzierung oder Event-Partnerschaft");
  assert.equal((await call("/api/sponsor/dashboard?org=empty-co&from=2026-11-01&to=2026-11-30", "GET", { id: 2, admin: true })).status, 200);
  assert.equal((await call("/api/sponsor/manual-metric", "POST", { id: 2, admin: true }, {
    placement_id: "acme-pod", source: "bing_ai", values: [{ metric: "ai_citations", value: 12 }],
    period: "2026-11", link: "https://example.com/report", proof_key: "sponsors/acme/bing-2026-11.csv"
  })).status, 200);
  result = await (await call("/api/sponsor/dashboard?from=2026-11-01&to=2026-11-30", "GET", { id: 1 })).json();
  assert.equal(result.orgs[0].metrics.find((m) => m.key === "ai_citations").value, 12);
  assert.equal(result.orgs[0].manual[0].value, 12);
  assert.equal(result.orgs[0].manual[0].kind, "manual");
  assert.equal(result.orgs[0].manual[0].period, "2026-11");
  assert.equal(Object.hasOwn(result.orgs[0].manual[0], "proof_key"), false, "interner Belegschlüssel wird nicht offengelegt");
  assert.equal((await call("/api/sponsor/manual-metric", "POST", { id: 2, admin: true }, {
    placement_id: "acme-pod", source: "bing_ai", metric: "ai_citations",
    period: "2026-10", value: 5, link: "https://example.com/report", proof_key: "sponsors/acme/bing-2026-10.csv"
  })).status, 200);
  for (const range of ["from=2026-10-06&to=2026-11-04", "from=2026-01-01&to=2026-12-31"]) {
    result = await (await call(`/api/sponsor/dashboard?${range}`, "GET", { id: 1 })).json();
    assert.equal(result.orgs[0].metrics.find((metric) => metric.key === "ai_citations").value, 17,
      "manueller Vormonatswert erscheint in Zeitraum-Auswahl und Jahresansicht");
  }
  assert.equal(raw.prepare("PRAGMA foreign_key_list(sponsor_manual_metrics)").all().length, 0,
    "manuelle Historie blockiert keine Konto- oder Firmenlöschung");
  assert.equal((await call("/api/sponsor/manual-metric", "POST", { id: 2, admin: true }, {
    placement_id: "acme-pod", source: "bing_ai", metric: "clicks", period: "2026-11",
    value: 12, link: "https://example.com/report", proof_key: "sponsors/acme/bing-2026-11.csv"
  })).status, 400, "nicht erlaubte Quellenkennzahlen werden abgewiesen");
  assert.equal((await call("/api/internal/sponsor-metrics", "POST", null, { metrics: [
    { placement_id: "acme-pod", day: "2026-11-04", metric: "podcast_plays", value: 3, source: "spreaker" }
  ] })).status, 403, "interne Route erfordert CRON_KEY");
  sponsorPlacementListQueries = 0;
  response = await call("/api/internal/sponsor-metrics", "POST", null, { metrics: [
    { placement_id: "acme-pod", day: "2026-11-04", metric: "podcast_plays", value: 3, source: "spreaker", dim: "episode:1" },
    { placement_id: "acme-pod", day: "2026-11-04", metric: "podcast_plays", value: 4, source: "spreaker", dim: "episode:2" }
  ] }, { "x-cron-key": env.CRON_KEY });
  assert.equal(response.status, 200);
  assert.equal(sponsorPlacementListQueries, 1, "Platzierungen werden für den gesamten Batch einmal gelesen");

  raw.exec(`INSERT INTO sponsor_links(code,org_id,placement_id,target_url,utm,created_at)
    VALUES('shared-code',1,'acme-pod','https://acme.example/','{}',1);
    INSERT INTO sponsor_clicks_daily(day,code,surface,country,clicks)
    VALUES('2026-11-04','shared-code','episode','DE',500);`);
  assert.equal((await call("/api/admin/sponsor-links", "POST", { id: 1 }, {
    code: "shared-code", org_id: 2, placement_id: "other-web", target_url: "https://other.example/"
  })).status, 403, "Sponsorlink-Verwaltung bleibt Admin-only");
  response = await call("/api/admin/sponsor-links", "POST", { id: 2, admin: true }, {
    code: "shared-code", org_id: 2, placement_id: "other-web", target_url: "https://other.example/"
  });
  assert.equal(response.status, 409, "bestehende Codes werden nicht überschrieben");
  assert.equal(raw.prepare("SELECT org_id FROM sponsor_links WHERE code='shared-code'").get().org_id, 1);
  assert.equal(raw.prepare("SELECT clicks FROM sponsor_clicks_daily WHERE code='shared-code'").get().clicks, 500);
  assert.equal((await call("/api/admin/sponsor-links", "GET", { id: 1 })).status, 403);

  raw.exec(`INSERT INTO sponsor_links(code,org_id,placement_id,target_url,utm,created_at)
    VALUES('moved-link',1,'other-web','https://other.example/','{}',1);
    INSERT INTO sponsor_clicks_daily(day,code,surface,country,clicks)
    VALUES('2026-11-04','moved-link','episode','DE',7);`);
  const priorStats = await (await call("/api/sponsor/link-stats?org=acme&month=2026-11", "GET", { id: 1 })).json();
  assert.deepEqual(priorStats.stats.map((stat) => stat.code), ["shared-code"],
    "alte Firma sieht keine Klicks für eine inzwischen fremde Platzierung");
  const ownedStats = await (await call("/api/sponsor/link-stats?org=other-co&month=2026-11", "GET", { id: 3 })).json();
  assert.equal(ownedStats.stats.length, 1, "Link-Klicks folgen der zugeordneten Platzierung, nicht sponsor_links.org_id");
  assert.equal((await call("/api/sponsor/link-stats?org=acme", "POST", { id: 1 })).status, 405);
  assert.equal((await call("/api/sponsor/link-stats?org=acme&month=2026-11", "GET", { id: 3 })).status, 404, "link-stats einer fremden Firma liefern 404");
  raw.close();
});

test("sponsor links: redirects, daily deduplication, bots and no cookies (SQLite)", async () => {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:");
  const dir = new URL("../migrations/", import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(f, dir), "utf-8"));
  raw.exec(`INSERT INTO orgs(id,handle,name,created) VALUES(1,'acme','Acme',1);
    INSERT INTO sponsor_placements(id,org_id,title,channel,created) VALUES('p1',1,'Placement','website',1);
    INSERT INTO sponsor_links(code,org_id,placement_id,target_url,utm,created_at)
    VALUES('acme-home',1,'p1','https://acme.example/path?x=1','{"utm_source":"m365.fm"}',1);`);
  const db = { prepare(sql) { const st = raw.prepare(sql); let args = []; const o = {
    bind(...a) { args = a; return o; }, first: async () => st.get(...args) ?? null,
    run: async () => ({ meta: { changes: Number(st.run(...args).changes) } }),
  }; return o; } };
  const originalCaches = globalThis.caches;
  const stored = new Map();
  Object.defineProperty(globalThis, "caches", { configurable: true, value: { default: {
    match: async (key) => stored.get(key.url) || null,
    put: async (key, value) => { stored.set(key.url, value); },
  } } });
  const call = async (method = "GET", ua = "Mozilla/5.0", query = "?s=episode", extra = {}, cf = { country: "DE" }, code = "acme-home") => {
    const request = new Request(`https://api.example/go/${code}${query}`, { method, headers: { "user-agent": ua, "cf-connecting-ip": "203.0.113.1", ...extra } });
    Object.defineProperty(request, "cf", { value: cf });
    const waits = [], response = await handleSponsorLink({ DB: db, SESSION_SECRET: "test-key" }, request,
      new URL(request.url), new URL(request.url).pathname, { waitUntil: (promise) => waits.push(promise) });
    await Promise.all(waits);
    return response;
  };
  try {
    let response = await call();
    assert.equal(response.status, 302);
    assert.equal(response.headers.get("location"), "https://acme.example/path?x=1&utm_source=m365.fm");
    assert.equal(response.headers.get("set-cookie"), null);
    assert.match(response.headers.get("x-robots-tag"), /noindex/);
    await call();
    assert.equal(raw.prepare("SELECT SUM(clicks) n FROM sponsor_clicks_daily").get().n, 1);
    await call("GET", "Different browser");
    assert.equal(raw.prepare("SELECT SUM(clicks) n FROM sponsor_clicks_daily").get().n, 2);
    await call("GET", "bot/1.0");
    await call("HEAD", "Mozilla/5.0");
    await call("GET", "Mozilla/5.0", "?s=episode", { "sec-purpose": "prefetch" });
    await call("GET", "Verified bot", "?s=episode", {}, { country: "DE", botManagement: { verifiedBot: true } });
    await call("GET", "Low score", "?s=episode", {}, { country: "DE", botManagement: { score: 20 } });
    assert.equal(raw.prepare("SELECT SUM(clicks) n FROM sponsor_clicks_daily").get().n, 2,
      "Cloudflare-verifizierte Bots und Score unter 30 werden nicht gezählt");
    response = await call("GET", "Another browser", "?s=invalid-surface");
    assert.equal(response.status, 302);
    assert.equal(raw.prepare("SELECT clicks FROM sponsor_clicks_daily WHERE surface='other'").get().clicks, 1);
    raw.exec(`INSERT INTO sponsor_links(code,org_id,placement_id,target_url,utm,active,created_at)
      VALUES('inactive',1,'p1','https://acme.example/', '{}',0,1);`);
    response = await call("GET", "Mozilla/5.0", "?s=episode", {}, { country: "DE" }, "inactive");
    assert.equal(response.status, 404);
    assert.equal(response.headers.get("location"), null);
    assert.equal(raw.prepare("SELECT SUM(clicks) n FROM sponsor_clicks_daily").get().n, 3,
      "inaktive Codes werden nicht weitergeleitet oder gezählt");
    const missing = await handleSponsorLink({ DB: db }, new Request("https://api.example/go/unknown"),
      new URL("https://api.example/go/unknown"), "/go/unknown", { waitUntil() {} });
    assert.equal(missing.status, 404);
    assert.equal(missing.headers.get("location"), null);
    assert.equal(raw.prepare("SELECT SUM(clicks) n FROM sponsor_clicks_daily").get().n, 3);
  } finally {
    if (originalCaches === undefined) delete globalThis.caches;
    else Object.defineProperty(globalThis, "caches", { configurable: true, value: originalCaches });
    raw.close();
  }
});

test("entities: Abgleich ueberschreibt keine Menschen (freigegebener Vorschlag mit aelterer id, geloeschtes Konto, absichtlich geleertes Feld, selbst verwaltet) (SQLite)", async () => {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:");
  const dir = new URL("../migrations/", import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(f, dir), "utf-8"));
  const db = { prepare(sql) { const st = raw.prepare(sql); let args = []; const o = { bind(...a) { args = a; return o; }, all: async () => ({ results: st.all(...args) }), first: async () => st.get(...args) ?? null, run: async () => st.run(...args) }; return o; }, async batch(s) { for (const x of s) await x.run(); } };
  const ins = (eid, data, uid, status, summary) => raw.prepare("INSERT INTO entity_rev(eid,data,summary,user_id,status,created) VALUES(?,?,?,?,?,1)").run(eid, JSON.stringify(data), summary, uid, status);
  const IMP = "Übernahme aus entities.json", TR = "Auto-Übersetzung (Claude Haiku)";
  // p: Vorschlag (id 2) erst nach einer Maschinen-Fassung (id 3) freigegeben -> live hat die kleinere id
  ins("p", { type: "product", name: "Teams Alt" }, 0, "old", IMP);
  ins("p", { type: "product", name: "Microsoft Teams" }, 7, "live", "Name korrigiert");
  ins("p", { type: "product", name: "Teams Alt", desc: { fr: "x" } }, 0, "old", TR);
  // d: Mensch korrigiert, Konto spaeter geloescht (user_id 0, Zusammenfassung bleibt)
  ins("d", { type: "person", name: "Yves HABERSAAT", job: "CTO" }, 0, "old", IMP);
  ins("d", { type: "person", name: "Yves Habersaat", job: "Principal Architect" }, 0, "live", "Eigenes Profil");
  // w: Mensch entfernt eine falsche Wikidata-ID
  ins("w", { type: "product", name: "W", wikidata: "Q1" }, 0, "old", IMP);
  ins("w", { type: "product", name: "W", wikidata: "" }, 9, "live", "falsche Q-ID entfernt");
  // o: selbst verwaltet (verifizierter Claim)
  ins("o", { type: "org", name: "Firma" }, 0, "live", IMP);
  raw.exec("INSERT INTO entity_claims(eid,user_id,status,created) VALUES('o',5,'verified',1)");
  const src = [{ id: "p", type: "product", name: "Teams Alt", wikidata: "Q2" }, { id: "d", type: "person", name: "Yves HABERSAAT", job: "CTO" },
    { id: "w", type: "product", name: "W", wikidata: "Q1", docs: "https://learn.microsoft.com/w" }, { id: "o", type: "org", name: "JSON-Firma" }];
  const old = globalThis.fetch; globalThis.fetch = async () => ({ ok: true, json: async () => ({ entities: src }) });
  try {
    const { syncEntitiesFromSite } = await import("../src/entities.js");
    const r = await syncEntitiesFromSite({ DB: db, SITE: "https://x" });
    const live = (id) => JSON.parse(raw.prepare("SELECT data FROM entity_rev WHERE eid=? AND status='live'").get(id).data);
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM entity_rev WHERE status='live' GROUP BY eid HAVING n>1").all().length, 0, "je Entitaet genau eine live-Fassung");
    assert.equal(live("p").name, "Microsoft Teams", "freigegebener Vorschlag bleibt"); assert.equal(live("p").wikidata, "Q2");
    assert.equal(live("d").name, "Yves Habersaat", "Aenderung eines geloeschten Kontos bleibt"); assert.equal(live("d").job, "Principal Architect");
    assert.equal(live("w").wikidata, "", "absichtlich geleert bleibt leer"); assert.equal(live("w").docs, "https://learn.microsoft.com/w", "nie gesetztes Feld wird gefuellt");
    assert.equal(live("o").name, "Firma", "selbst verwaltet wird nicht abgeglichen");
    assert.equal(r.updated, 2);
    // Wettlauf: live wechselt zwischen Lesen und Schreiben -> nichts geschrieben
    const before = raw.prepare("SELECT COUNT(*) n FROM entity_rev").get().n;
    const st = raw.prepare("SELECT id FROM entity_rev WHERE eid='w' AND status='live'").get().id;
    raw.exec(`UPDATE entity_rev SET status='old' WHERE id=${st}`); ins("w", { type: "product", name: "W2" }, 9, "live", "neu");
    raw.prepare("UPDATE entity_rev SET status='old' WHERE id=? AND status='live'").run(st);
    raw.prepare("INSERT INTO entity_rev(eid,data,summary,user_id,status,created) SELECT ?,?,?,0,'live',1 WHERE NOT EXISTS (SELECT 1 FROM entity_rev WHERE eid=? AND status='live')").run("w", "{}", "Abgleich mit entities.json: x", "w");
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM entity_rev").get().n, before + 1, "bedingtes Schreiben greift nicht, wenn live gewechselt hat");
    assert.equal(live("w").name, "W2");
  } finally { globalThis.fetch = old; }
});

test("search: Import, Trigramm-Suche, Filter, Facetten und gone-Markierung (SQLite)", async () => {
  const { db, raw, indexWrites } = await searchDb();
  const docs = [
    { id: "en:/entity/aaron-siller/", url: "https://www.m365.fm/entity/aaron-siller/", lang: "en", type: "person", title: "Aaron Siller", summary: "Cloud expert", keywords: "Azure identity", entities: ["azure"], date: "2024-05-01", image: "" },
    { id: "de:/entity/purview/", url: "https://www.m365.fm/de/entity/purview/", lang: "de", type: "entity", title: "Microsoft Purview", summary: "Informationsschutz", keywords: "Azure Purview", entities: ["azure", "purview"], date: "2025-03-10", image: "" },
    { id: "ja:/azure/", url: "https://www.m365.fm/ja/azure/", lang: "ja", type: "page", title: "Azure 日本語の検索", summary: "クラウド検索", keywords: "Azure 日本語 検索", entities: ["azure"], date: "2026-01-20", image: "" },
  ];
  let generated = "2026-11-01", parts = [[docs[0], docs[1]], [docs[2]]];
  const oldFetch = globalThis.fetch;
  let handleSearch;
  globalThis.fetch = async (input) => {
    const path = new URL(input).pathname;
    if (path === "/search/manifest.json") return { ok: true, json: async () => ({ generated, parts: 2, count: parts.flat().length }) };
    const number = Number(/part-(\d+)\.json$/.exec(path)?.[1]);
    return { ok: true, json: async () => ({ part: number, docs: parts[number - 1] }) };
  };
  const env = { DB: db, SITE: "https://www.m365.fm" };
  const call = async (params, ip = "203.0.113.8") => {
    const request = new Request(`https://api.m365.fm/api/search?${params}`, { headers: { "cf-connecting-ip": ip } });
    return handleSearch(env, request, new URL(request.url), (data, status = 200, headers = {}) => ({ data, status, headers }));
  };
  try {
    const { importSearchIndex, handleSearch: search } = await import("../src/search.js");
    handleSearch = search;
    assert.equal((await importSearchIndex(env)).changed, 2);
    const imported = await importSearchIndex(env);
    assert.equal(imported.changed, 1);
    assert.equal(imported.gone, 0);

    const typo = await call("q=Aron+Soller");
    assert.equal(typo.status, 200);
    assert.equal(typo.data.results[0].title, "Aaron Siller");
    assert.equal((await call("q=purvew")).data.results[0].title, "Microsoft Purview");
    assert.equal((await call("q=" + encodeURIComponent("日本語の検索"))).data.results[0].lang, "ja");
    assert.equal((await call("q=Mi")).data.results[0].title, "Microsoft Purview", "kurze Suche nutzt Titel-Praefix");

    const all = await call("q=Azure");
    assert.equal(all.data.total, 3);
    assert.deepEqual(all.data.facets.type, { entity: 1, page: 1, person: 1 });
    assert.deepEqual(all.data.facets.lang, { de: 1, en: 1, ja: 1 });
    assert.deepEqual(all.data.facets.year, { 2024: 1, 2025: 1, 2026: 1 });
    assert.equal(all.data.facets.entity.azure, 3);
    assert.equal(all.data.facets.entity.purview, 1);
    assert.equal((await call("q=Azure&lang=de")).data.total, 1);
    const typeFiltered = await call("q=Azure&type=page");
    assert.equal(typeFiltered.data.total, 1);
    assert.equal(typeFiltered.data.facets.type.person, 1, "type-Facette ignoriert den eigenen Filter");
    assert.equal((await call("q=Azure&entity=purview")).data.results[0].title, "Microsoft Purview");
    assert.equal((await call("q=Azure&year=2025")).data.total, 1);

    const before = indexWrites();
    assert.equal((await importSearchIndex(env)).changed, 0);
    assert.equal((await importSearchIndex(env)).changed, 0);
    assert.equal(indexWrites(), before, "unveraenderte Dokumente werden nicht erneut geschrieben");

    raw.prepare("UPDATE search_doc SET title_norm='' WHERE id=?").run(docs[0].id);
    const beforeTitleNormBackfill = indexWrites();
    assert.equal((await importSearchIndex(env)).changed, 0);
    assert.equal(indexWrites(), beforeTitleNormBackfill + 1, "Titel-Normalisierung baut FTS nicht neu auf");
    assert.equal(raw.prepare("SELECT title_norm FROM search_doc WHERE id=?").get(docs[0].id).title_norm, " aaron siller ");

    generated = "2026-11-02";
    parts = [[{ ...docs[0], title: "Aaron Siller Updated" }, docs[1]], []];
    assert.equal((await importSearchIndex(env)).changed, 1);
    assert.equal(raw.prepare("SELECT title FROM search_doc WHERE id=?").get(docs[0].id).title, "Aaron Siller Updated");
    const final = await importSearchIndex(env);
    assert.equal(final.gone, 1);
    assert.equal(raw.prepare("SELECT gone FROM search_doc WHERE id=?").get(docs[2].id).gone, 1);
    assert.equal((await call("q=Azure")).data.total, 2, "gone-Dokumente erscheinen nicht in der Suche");

    const limitedIp = "198.51.100.27";
    let response;
    for (let i = 0; i < 61; i++) response = await call("q=Azure", limitedIp);
    assert.equal(response.status, 429);
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM ratelimit WHERE k LIKE ?").get(`%${limitedIp}%`).n, 0, "IP-Adresse wird nicht gespeichert");
  } finally {
    globalThis.fetch = oldFetch;
  }
});

test("search: normalisierte Kurzsuche in mehreren Schriften und Import-Backfill (SQLite)", async () => {
  const { db, raw, lastSearchQuery } = await searchDb();
  const docs = [
    { id: "ru:ai", url: "https://www.m365.fm/ru/ai/", lang: "ru", type: "page", title: "Что такое ИИ-агенты", entities: ["azure"], date: "2024-01-01" },
    { id: "en:copilot", url: "https://www.m365.fm/copilot/", lang: "en", type: "page", title: "Copilot AI agents explained", entities: ["azure"], date: "2024-02-01" },
    { id: "en:ai", url: "https://www.m365.fm/ai/", lang: "en", type: "blog", title: "AI agents", entities: ["azure"], date: "2025-01-01" },
    { id: "en:maintain", url: "https://www.m365.fm/maintain/", lang: "en", type: "blog", title: "Maintainable systems", entities: ["other"], date: "2025-02-01" },
    { id: "de:ai", url: "https://www.m365.fm/de/governance/", lang: "de", type: "entity", title: "AI-Governance", entities: ["powerbi"], date: "2026-01-01" },
    { id: "ja:admin", url: "https://www.m365.fm/ja/admin/", lang: "ja", type: "page", title: "Microsoft Entra の管理ポリシー", date: "2026-02-01" },
    { id: "el:omega", url: "https://www.m365.fm/el/omega/", lang: "el", type: "page", title: "Ωμέγα", date: "2026-03-01" },
    { id: "he:aleph", url: "https://www.m365.fm/he/aleph/", lang: "he", type: "page", title: "אבטחת מידע", date: "2026-04-01" },
    { id: "ar:ain", url: "https://www.m365.fm/ar/ain/", lang: "ar", type: "page", title: "عالم البيانات", date: "2026-05-01" },
  ];
  raw.prepare("INSERT INTO search_doc(id,url,lang,type,title,summary,keywords,entities,date,image,h,gone,updated,grp) VALUES(?,?,?,?,?,'','','','','','',0,1,'')")
    .run("legacy:cafe", "https://www.m365.fm/legacy/cafe/", "fr", "page", "Cafe\u0301 ancien");
  const oldFetch = globalThis.fetch;
  globalThis.fetch = async (input) => {
    const path = new URL(input).pathname;
    if (path === "/search/manifest.json") return { ok: true, json: async () => ({ generated: "2026-11-03", parts: 2, count: docs.length }) };
    return { ok: true, json: async () => ({ part: 1, docs }) };
  };
  try {
    const { importSearchIndex, handleSearch } = await import("../src/search.js");
    const env = { DB: db, SITE: "https://www.m365.fm" };
    assert.equal((await importSearchIndex(env)).changed, docs.length);
    assert.equal(raw.prepare("SELECT title_norm FROM search_doc WHERE id='legacy:cafe'").get().title_norm, " cafe ancien ", "bestehende Zeilen werden ohne Vollimport nachgefüllt");
    let ip = 0;
    const call = async (q, extra = "") => {
      const request = new Request(`https://api.m365.fm/api/search?q=${encodeURIComponent(q)}${extra}`, { headers: { "cf-connecting-ip": `short-search-${ip++}` } });
      return handleSearch(env, request, new URL(request.url), (data, status = 200) => ({ data, status }));
    };

    assert.equal((await call("ИИ")).data.results[0].title, "Что такое ИИ-агенты");
    assert.equal((await call("ии")).data.results[0].title, "Что такое ИИ-агенты");
    assert.equal((await call("Co")).data.results[0].title, "Copilot AI agents explained", "Wortanfang mitten im Titel wird gefunden");
    raw.prepare("UPDATE search_doc SET title_norm='' WHERE id='en:copilot'").run();
    assert.equal((await call("Co")).data.results[0].title, "Copilot AI agents explained", "Legacy-Zeilen bleiben über den alten Titelpräfix auffindbar");
    raw.prepare("UPDATE search_doc SET title_norm=' copilot ai agents explained ' WHERE id='en:copilot'").run();
    assert.deepEqual((await call("AI")).data.results.map((row) => row.title).sort(), ["AI-Governance", "AI agents", "Copilot AI agents explained"].sort());
    assert.ok(!(await call("AI")).data.results.some((row) => row.title === "Maintainable systems"), "Treffer nur am Wortanfang, nicht mitten im Wort");
    assert.equal((await call("管理")).data.results[0].title, "Microsoft Entra の管理ポリシー");
    assert.equal((await call("Ω")).data.results[0].title, "Ωμέγα");
    assert.equal((await call("א")).data.results[0].title, "אבטחת מידע");
    assert.equal((await call("ع")).data.results[0].title, "عالم البيانات");
    assert.equal((await call("!!")).data.total, 0, "Satzzeichen ergeben keine Treffer");

    const filtered = await call("AI", "&type=page");
    assert.equal(filtered.data.total, 1);
    assert.deepEqual(filtered.data.facets.type, { blog: 1, entity: 1, page: 1 }, "Typ-Facette ignoriert den eigenen Filter");
    assert.deepEqual(filtered.data.facets.year, { 2024: 1 }, "andere Facetten behalten den Typfilter");
    assert.equal((await call("AI", "&lang=de")).data.total, 1);
    assert.deepEqual((await call("AI", "&lang=de")).data.facets.lang, { de: 1, en: 2 }, "Sprach-Facette ignoriert den eigenen Filter");
    assert.equal((await call("AI", "&entity=azure")).data.total, 2);
    assert.equal((await call("AI", "&year=2024")).data.total, 1);
    assert.equal((await call("Copilot AI agents")).data.results[0].title, "Copilot AI agents explained", "Suchanfragen ab drei Zeichen bleiben im bisherigen FTS-Zweig");
    await call("AI", "&lang=de&type=entity&entity=powerbi&year=2026");
    const facetQuery = lastSearchQuery();
    assert.doesNotMatch(facetQuery.sql.slice(0, facetQuery.sql.indexOf(",eligible AS")), /UNION ALL/, "Kurzsuche hat je Kontext einen CASE-Scan statt drei UNION-Scans");
    const facetPlan = raw.prepare(`EXPLAIN QUERY PLAN ${facetQuery.sql}`).all(...facetQuery.params);
    assert.equal(facetPlan.filter(({ detail }) => /(?:SCAN d\b|SEARCH d USING INDEX)/.test(detail)).length, 5, "fuenf Facettenkontexte bedeuten hoechstens fuenf Titel-Scans");
  } finally {
    globalThis.fetch = oldFetch;
  }
});

test("search: unicode61-Fallback findet Titel per LIKE (SQLite)", async () => {
  const { db, raw } = await searchDb(true);
  const doc = { id: "en:/purview/", url: "https://www.m365.fm/purview/", lang: "en", type: "entity", title: "Microsoft Purview", summary: "", keywords: "", entities: [], date: "", image: "" };
  const oldFetch = globalThis.fetch;
  globalThis.fetch = async (input) => {
    const path = new URL(input).pathname;
    if (path === "/search/manifest.json") return { ok: true, json: async () => ({ generated: "2026-11-01", parts: 1, count: 1 }) };
    return { ok: true, json: async () => ({ part: 1, docs: [doc] }) };
  };
  try {
    const { importSearchIndex, handleSearch } = await import("../src/search.js");
    const env = { DB: db, SITE: "https://www.m365.fm" };
    assert.equal((await importSearchIndex(env)).tokenizer, "unicode61");
    const request = new Request("https://api.m365.fm/api/search?q=purview", { headers: { "cf-connecting-ip": "203.0.113.9" } });
    const response = await handleSearch(env, request, new URL(request.url), (data, status = 200) => ({ data, status }));
    assert.equal(response.status, 200);
    assert.equal(response.data.results[0].title, "Microsoft Purview");
    assert.equal(raw.prepare("SELECT v FROM meta WHERE k='search_fts_tokenizer'").get().v, "unicode61");
  } finally {
    globalThis.fetch = oldFetch;
  }
});

test("search: Import hält D1-Parameterlimit und Dreier-Batches ein", async () => {
  const { db, maxBatch } = await searchDb();
  const docs = Array.from({ length: 120 }, (_, i) => ({
    id: `en:bulk-${i}`, url: `https://www.m365.fm/bulk/${i}/`, lang: "en", type: "page", title: `Bulk document ${i}`,
    summary: "", keywords: "", entities: [], date: "", image: "",
  }));
  const oldFetch = globalThis.fetch;
  globalThis.fetch = async (input) => {
    const path = new URL(input).pathname;
    if (path === "/search/manifest.json") return { ok: true, json: async () => ({ generated: "2026-11-02", parts: 1, count: docs.length }) };
    return { ok: true, json: async () => ({ part: 1, docs }) };
  };
  try {
    const { importSearchIndex } = await import("../src/search.js");
    const result = await importSearchIndex({ DB: db, SITE: "https://www.m365.fm" });
    assert.equal(result.changed, docs.length);
    assert.equal(maxBatch(), 99);
  } finally {
    globalThis.fetch = oldFetch;
  }
});

test("search: Gruppen, Eingabe- und Herkunftsgrenzen sowie FTS-Wiederaufbau (SQLite)", async () => {
  const { db, raw } = await searchDb();
  const docs = [
    { id: "en:episode-a", url: "https://www.m365.fm/en/episode-a/", group: "https://www.m365.fm/episode-a/", lang: "en", type: "episode", title: "Long title with search phrase", image: "https://img.m365.fm/episode.webp" },
    { id: "de:episode-b", url: "https://www.m365.fm/de/anderer-slug/", group: "https://www.m365.fm/episode-a/", lang: "de", type: "dub_episode", title: "Long title with search phrase", image: "https://evil.example/cover.png" },
    { id: "en:foreign", url: "https://evil.example/foreign/", lang: "en", type: "page", title: "Long title with search phrase" },
  ];
  let build = "2026-11-02T10:00:00Z";
  const oldFetch = globalThis.fetch;
  globalThis.fetch = async (input) => {
    const path = new URL(input).pathname;
    if (path === "/search/manifest.json") return { ok: true, json: async () => ({ generated: "2026-11-02", build, parts: 1, count: docs.length }) };
    return { ok: true, json: async () => ({ part: 1, docs }) };
  };
  try {
    const { importSearchIndex, handleSearch } = await import("../src/search.js");
    const env = { DB: db, SITE: "https://www.m365.fm", SESSION_SECRET: "test-secret" };
    assert.equal((await importSearchIndex(env)).changed, 2, "fremde Herkunft wird verworfen");
    assert.equal(raw.prepare("SELECT image FROM search_doc WHERE id='en:episode-a'").get().image, "https://img.m365.fm/episode.webp");
    assert.equal(raw.prepare("SELECT image FROM search_doc WHERE id='de:episode-b'").get().image, "");
    raw.exec("DELETE FROM search_fts");
    assert.equal((await importSearchIndex(env)).changed, 2, "leerer FTS-Index erzwingt Neuaufbau trotz gleicher Hashes");
    const req = new Request("https://api.m365.fm/api/search?q=search+phrase", { headers: { "cf-connecting-ip": "203.0.113.11" } });
    const result = await handleSearch(env, req, new URL(req.url), (data) => data);
    assert.equal(result.total, 1, "Dub-Folge wird anhand der group-Adresse dedupliziert");
    assert.equal(result.results[0].lang, "en", "ohne pref gewinnt en");
    const deReq = new Request("https://api.m365.fm/api/search?q=search+phrase&pref=de", { headers: { "cf-connecting-ip": "203.0.113.12" } });
    const deResult = await handleSearch(env, deReq, new URL(deReq.url), (data) => data);
    assert.equal(deResult.results[0].lang, "de", "group-Deduplizierung bevorzugt pref");

    build = "2026-11-02T11:00:00Z";
    const newCycle = await importSearchIndex(env);
    assert.equal(newCycle.part, 1, "Build-Zeitstempel beginnt einen neuen Importzyklus");
    assert.equal(newCycle.gone, 0, "zweiter Build am selben Tag laesst aktuelle Dokumente bestehen");
    const longQuery = "a".repeat(60);
    const longReq = new Request(`https://api.m365.fm/api/search?q=${longQuery}`, { headers: { "cf-connecting-ip": "203.0.113.13" } });
    assert.equal((await handleSearch(env, longReq, new URL(longReq.url), (data, status = 200) => ({ data, status }))).status, 200);
    const nulReq = new Request("https://api.m365.fm/api/search?q=se%00arch+phrase", { headers: { "cf-connecting-ip": "203.0.113.14" } });
    assert.equal((await handleSearch(env, nulReq, new URL(nulReq.url), (data, status = 200) => ({ data, status }))).status, 200);
    const symbolsReq = new Request("https://api.m365.fm/api/search?q=%21%3F%3F", { headers: { "cf-connecting-ip": "203.0.113.15" } });
    const symbols = await handleSearch(env, symbolsReq, new URL(symbolsReq.url), (data, status = 200) => ({ data, status }));
    assert.equal(symbols.status, 200);
    assert.equal(symbols.data.total, 0);
  } finally {
    globalThis.fetch = oldFetch;
  }
});

test("search: Tippfehler-Ranking, Sprach-Deduplizierung und Titelprioritaet (SQLite)", async () => {
  const { db, raw } = await searchDb();
  const docs = [
    { id: "en:aaron", url: "https://www.m365.fm/entity/aaron-siller/", lang: "en", type: "person", title: "Aaron Siller – Person", keywords: "Microsoft Azure" },
    { id: "de:aaron", url: "https://www.m365.fm/de/entity/aaron-siller/", lang: "de", type: "person", title: "Aaron Siller – Person", keywords: "Microsoft Azure" },
    { id: "en:patrick", url: "https://www.m365.fm/entity/patrick-gruenauer/", lang: "en", type: "person", title: "Patrick Gruenauer – Person" },
    { id: "en:purview", url: "https://www.m365.fm/entity/microsoft-purview/", lang: "en", type: "entity", title: "Microsoft Purview – Produkt", entities: ["purview"] },
    { id: "en:avd", url: "https://www.m365.fm/entity/azure-virtual-desktop/", lang: "en", type: "entity", title: "Azure Virtual Desktop – Product", entities: ["azure-virtual-desktop"] },
  ];
  for (let i = 0; i < 25; i++) docs.push({
    id: `en:blog-${i}`, url: `https://www.m365.fm/blog/blog-${i}/`, lang: "en", type: "blog",
    title: `Azure sollten Entwickler surveillance ${i}`, summary: "Microsoft developers should consider surveillance and privacy",
  });
  seedSearchDocs(raw, docs);
  const { handleSearch } = await import("../src/search.js");
  const env = { DB: db, SITE: "https://www.m365.fm" };
  const call = async (q, extra = "") => {
    const request = new Request(`https://api.m365.fm/api/search?q=${encodeURIComponent(q)}${extra}`, { headers: { "cf-connecting-ip": `${q}:${extra}` } });
    return handleSearch(env, request, new URL(request.url), (data) => data);
  };
  const aron = await call("Aron Soller");
  assert.equal(aron.results[0].title, "Aaron Siller – Person");
  assert.equal(aron.results.filter((row) => row.title === "Aaron Siller – Person").length, 1, "de/en werden zusammengefuehrt");
  const aronDe = await call("Aron Soller", "&pref=de");
  assert.equal(aronDe.results[0].lang, "de", "bevorzugte Sprachfassung bleibt");
  const patrick = await call("Patrik Grünauer");
  assert.equal(patrick.results[0].title, "Patrick Gruenauer – Person");
  const purview = await call("purvew");
  assert.ok(purview.results.slice(0, 3).some((row) => row.title.startsWith("Microsoft Purview")));
  const avd = await call("Azure Virtual Desktop");
  assert.equal(avd.results[0].title, "Azure Virtual Desktop – Product");
});

test("search: Vectorize-Sync ist begrenzt, inkrementell und entfernt gone-Vektoren (SQLite)", async () => {
  const { db, raw } = await searchDb();
  const docs = Array.from({ length: 502 }, (_, i) => ({
    id: i === 0 ? `de:/de/show/episodes/${"sehr-langer-pfad-".repeat(7)}` : `en:vector-${String(i).padStart(3, "0")}`,
    url: `https://www.m365.fm/vector/${i}/`,
    lang: "en", type: "page", title: `Vector document ${i}`,
  }));
  docs[0].lang = "de";
  seedSearchDocs(raw, docs);
  const upserts = [], deletions = [];
  let longIdRejected = false;
  const env = {
    DB: db,
    AI: { async run(model, { text }) {
      assert.equal(model, "@cf/baai/bge-m3");
      assert.ok(text.every((value) => /Vector document/.test(value)));
      return { data: text.map(() => Array(1024).fill(0.1)) };
    } },
    VEC: {
      async upsert(vectors) {
        if (vectors.some(({ id }) => new TextEncoder().encode(id).length > 64)) {
          longIdRejected = true;
          throw new Error("Vectorize-ID exceeds 64 bytes");
        }
        upserts.push(...vectors);
      },
      async deleteByIds(ids) { deletions.push(...ids); },
    },
  };
  const { syncSearchVectors } = await import("../src/search.js");
  assert.equal((await syncSearchVectors(env)).processed, 200, "Erstbefuellung nutzt einen groesseren, begrenzten Batch");
  assert.equal((await syncSearchVectors(env)).processed, 200);
  assert.equal((await syncSearchVectors(env)).processed, 102);
  assert.equal((await syncSearchVectors(env)).processed, 0, "unveraenderte Hashes werden nicht erneut eingebettet");
  assert.equal(longIdRejected, false);
  assert.equal(upserts.length, 502);
  assert.ok(upserts.every(({ id }) => new TextEncoder().encode(id).length <= 64));
  assert.equal(upserts[0].metadata.doc, docs[0].id);
  assert.equal(raw.prepare("SELECT vid FROM search_vector WHERE id=?").get(docs[0].id).vid, upserts[0].id);

  raw.prepare("UPDATE search_doc SET h='changed' WHERE id=?").run(docs[0].id);
  assert.equal((await syncSearchVectors(env)).processed, 1, "geanderte Hashes werden erneut eingebettet");
  assert.equal(upserts.length, 503);
  raw.prepare("UPDATE search_doc SET gone=1 WHERE id=?").run(docs[1].id);
  assert.deepEqual(await syncSearchVectors(env), { deleted: 1 });
  assert.deepEqual(deletions, [await vectorId(docs[1].id)]);
  assert.equal(raw.prepare("SELECT gone FROM search_doc WHERE id=?").get(docs[1].id).gone, 1, "Quelldokument bleibt erhalten");
});

test("vectors: Embeddings, Upsert, gefilterte Abfrage und RRF sind wiederverwendbar", async () => {
  const calls = [];
  const env = {
    AI_GATEWAY_ID: "m365fm",
    AI: { async run(model, payload, options) {
      calls.push({ model, payload, options });
      return { data: payload.text.map(() => Array(1024).fill(0.25)) };
    } },
    VEC: {
      async upsert(vectors) { calls.push({ vectors }); },
      async query(vector, options) { calls.push({ vector, options }); return { matches: [{ id: "vector:1", score: 0.9 }] }; },
    },
  };
  const [vector] = await embed(env, ["cross-language query"], {
    collectLog: false, cacheTtl: 3600, requestTimeoutMs: 1000,
  });
  assert.equal(vector.length, 1024);
  assert.deepEqual(calls[0].options, { gateway: { id: "m365fm", collectLog: false, cacheTtl: 3600 } });
  await upsertVectors(env, [{ id: "vector:1", values: vector, metadata: { lang: "en", type: "blog" } }]);
  assert.deepEqual(await queryVectors(env, vector, { filter: { lang: "en", type: "blog" }, topK: 10 }), [
    { id: "vector:1", score: 0.9 },
  ]);
  assert.deepEqual(calls.at(-1).options, { topK: 10, returnMetadata: "all", filter: { lang: "en", type: "blog" } });
  await queryVectors(env, vector, { returnMetadata: "none" });
  assert.equal(calls.at(-1).options.returnMetadata, "none");
  const longDocId = `de:${"/de/show/episodes/" + "x".repeat(90)}`;
  assert.equal(await vectorId(longDocId), (await sha256hex(longDocId)).slice(0, 32));
  const batches = [];
  const batchEnv = {
    AI: { async run(_model, { text }) { batches.push(text.length); return { data: text.map(() => Array(1024).fill(0.1)) }; } },
    VEC: { async upsert(items) { batches.push(items.length); } },
  };
  await embed(batchEnv, Array.from({ length: 101 }, () => "text"));
  await upsertVectors(batchEnv, Array.from({ length: 1001 }, (_, i) => ({ id: String(i) })));
  assert.deepEqual(batches, [100, 1, 1000, 1], "Embeddings und Upserts werden in Cloudflare-kompatible Batches geteilt");
  await assert.rejects(
    embed({ AI: { run: () => new Promise(() => {}) } }, ["slow"], { requestTimeoutMs: 5 }),
    /Workers-AI-Timeout/,
  );
  assert.deepEqual(rrf([
    [{ id: "shared", title: "Shared" }, { id: "fts-only" }],
    [{ id: "shared", lang: "en" }, { id: "vector-only" }],
  ]).map(({ id }) => id), ["shared", "fts-only", "vector-only"]);
});

test("search: hybride Treffer, Sprachprioritaet, Fallback und classifyQuery (SQLite)", async () => {
  const { db, raw } = await searchDb();
  const docs = [
    { id: "de:own", url: "https://www.m365.fm/de/own/", group: "https://www.m365.fm/own/", lang: "de", type: "page", title: "Purview Bericht Rollengruppen" },
    { id: "en:foreign", url: "https://www.m365.fm/foreign/", group: "https://www.m365.fm/own/", lang: "en", type: "blog", title: "Data security governance" },
    { id: "en:other", url: "https://www.m365.fm/other/", lang: "en", type: "blog", title: "Other relevant document" },
    { id: "en:aaron", url: "https://www.m365.fm/aaron-siller/", lang: "en", type: "person", title: "Aaron Siller" },
    ...Array.from({ length: 40 }, (_, i) => ({
      id: `de:weak-${i}`, url: `https://www.m365.fm/de/weak/${i}/`, lang: "de", type: "page", title: `Unrelated German result ${i}`,
    })),
  ];
  seedSearchDocs(raw, docs);
  const vids = await seedSearchVectors(raw, docs);
  let matches = [{ id: vids.get("en:foreign"), score: 0.9, metadata: { grp: "https://www.m365.fm/own/" } }];
  const env = {
    DB: db, SITE: "https://www.m365.fm", SEARCH_GAP_THRESHOLD: "0.5", SEARCH_VECTOR_MIN_SCORE: "0.4",
    AI: { async run(_model, { text }) { return { data: text.map(() => Array(1024).fill(0.1)) }; } },
    VEC: { async query(_vector, options) {
      assert.deepEqual(options.filter, { type: { $in: ["episode", "dub_episode", "entity", "person", "glossary", "blog", "event", "show", "page"] } });
      return { matches };
    } },
  };
  const { classifyQuery, handleSearch } = await import("../src/search.js");
  const request = new Request("https://api.m365.fm/api/search?q=Rollengruppen+Purview+Bericht&pref=de", {
    headers: { "cf-connecting-ip": "hybrid-search-test" },
  });
  const result = await handleSearch(env, request, new URL(request.url), (data) => data);
  assert.equal(result.results[0].title, "Purview Bericht Rollengruppen", "Treffer in der Seitensprache stehen zuerst");
  matches = [{ id: vids.get("en:other"), score: 0.9 }];
  const foreignResult = await handleSearch(env, request, new URL(request.url), (data) => data);
  assert.equal(foreignResult.results.find((row) => row.title === "Other relevant document").other_lang, true);

  matches = [{ id: vids.get("en:foreign"), score: 0.9, metadata: { grp: "https://www.m365.fm/own/" } }];
  assert.equal((await classifyQuery(env, "purview", "de")).type, "own");
  matches = [{ id: vids.get("en:other"), score: 0.9 }];
  const gap = await classifyQuery(env, "purview", "de");
  assert.equal(gap.type, "translation_gap");
  assert.deepEqual(gap.documents.map(({ id }) => id), ["en:other"]);
  matches = [{ id: vids.get("en:other"), score: 0.2 }];
  assert.equal((await classifyQuery(env, "unknown", "de")).type, "content_gap", "Relevanzschwelle ist konfigurierbar");
  matches = [
    { id: vids.get("en:aaron"), score: 0.95 },
    ...docs.slice(4).map((doc) => ({ id: vids.get(doc.id), score: 0.41 })),
  ];
  const aronRequest = new Request("https://api.m365.fm/api/search?q=Aron+Soller&pref=de", {
    headers: { "cf-connecting-ip": "aron-soller-hybrid-test" },
  });
  const aron = await handleSearch(env, aronRequest, new URL(aronRequest.url), (data) => data);
  assert.equal(aron.results[0].title, "Aaron Siller", "Aron Soller findet Aaron Siller trotz der Sprachpräferenz");
  matches = [{ id: vids.get("en:other"), score: 0.2 }];
  const irrelevant = new Request("https://api.m365.fm/api/search?q=xqzvbnmk&pref=de", {
    headers: { "cf-connecting-ip": "irrelevant-vector-test" },
  });
  assert.equal((await handleSearch(env, irrelevant, new URL(irrelevant.url), (data) => data)).total, 0,
    "Vektortreffer unter der Mindestschwelle erhöhen total nicht");

  const fallback = new Request("https://api.m365.fm/api/search?q=Purview&pref=de", {
    headers: { "cf-connecting-ip": "fts-fallback-test" },
  });
  const onlyFts = await handleSearch({ DB: db, SITE: "https://www.m365.fm" }, fallback, new URL(fallback.url), (data) => data);
  assert.equal(onlyFts.results[0].title, "Purview Bericht Rollengruppen", "ohne Bindungen bleibt FTS aktiv");
  const warning = console.warn;
  const warnings = [];
  console.warn = (...args) => warnings.push(args);
  try {
    const brokenRequest = new Request("https://api.m365.fm/api/search?q=Purview&pref=de", {
      headers: { "cf-connecting-ip": "vector-fallback-error-test" },
    });
    const result = await handleSearch({ ...env, VEC: { async query() { throw new Error("Vectorize unavailable"); } } },
      brokenRequest, new URL(brokenRequest.url), (data) => data);
    assert.equal(result.results[0].title, "Purview Bericht Rollengruppen", "Vectorize-Fehler laesst FTS-Treffer bestehen");
  } finally { console.warn = warning; }
  assert.equal(warnings.length, 1, "Vectorize-Fehler wird protokolliert");
  assert.deepEqual(await classifyQuery({}, "anything", "de"), { type: "unavailable", documents: [] });
  const broken = { ...env, VEC: { async query() { throw new Error("Vectorize unavailable"); } } };
  assert.deepEqual(await classifyQuery(broken, "anything", "de"), { type: "unavailable", documents: [] });
});

test("search: 80.000 Dokumente ohne SQL-Vollscan und mit höchstens 150 ms Hybrid-Aufschlag (SQLite)", async (t) => {
  const { db, raw, searchQueries, lastSearchQuery, lastVectorQuery } = await searchDb();
  const docs = Array.from({ length: 80000 }, (_, i) => ({
    id: `en:synthetic-${i}`, url: `https://www.m365.fm/page/${i}/`, lang: "en", type: i % 8 ? "page" : "entity",
    title: `Common search document ${i}`, summary: "Common content for performance testing", keywords: "Common search",
  }));
  seedSearchDocs(raw, docs);
  const vector = await vectorId(docs[0].id);
  raw.prepare("INSERT INTO search_vector(id,vid,h) VALUES(?,?,?)").run(docs[0].id, vector, docs[0].id);
  const { handleSearch } = await import("../src/search.js");
  const env = {
    DB: db, SITE: "https://www.m365.fm",
    AI: { async run(_model, { text }) { return { data: text.map(() => Array(1024).fill(0.1)) }; } },
    VEC: { async query() { return { matches: [{ id: vector, score: 0.9 }] }; } },
  };
  const request = new Request("https://api.m365.fm/api/search?q=common&pref=de", { headers: { "cf-connecting-ip": "load-test-ip" } });
  const ftsRequest = new Request(request.url, { headers: { "cf-connecting-ip": "load-test-fts-ip" } });
  const measure = async (targetEnv, targetRequest) => {
    const times = [];
    for (let i = 0; i < 6; i++) {
      const started = performance.now();
      await handleSearch(targetEnv, targetRequest, new URL(targetRequest.url), (data) => data);
      if (i) times.push(performance.now() - started);
    }
    return times.sort((a, b) => a - b)[Math.floor(times.length / 2)];
  };
  const before = searchQueries();
  const baselineMedian = await measure({ DB: db, SITE: "https://www.m365.fm" }, ftsRequest);
  const hybridMedian = await measure(env, request);
  t.diagnostic(`80k-SQLite-Median: FTS ${baselineMedian.toFixed(1)} ms, hybrid ${hybridMedian.toFixed(1)} ms, Differenz ${(hybridMedian - baselineMedian).toFixed(1)} ms (AI/Vectorize gemockt)`);
  assert.ok(hybridMedian < 300, `Hybrid-Suchmedian lag bei ${hybridMedian.toFixed(1)} ms`);
  assert.ok(hybridMedian - baselineMedian <= 150,
    `Hybrid-Aufschlag lag bei ${(hybridMedian - baselineMedian).toFixed(1)} ms`);
  let result = await handleSearch(env, request, new URL(request.url), (data) => data);
  assert.equal(result.results.length, 20);
  assert.ok(result.total <= 1000, "Kandidatenpool ist begrenzt");
  assert.equal(searchQueries() - before, 13, "pro Suchanfrage wird eine Kandidatenabfrage ausgefuehrt");
  const vectorQuery = lastVectorQuery();
  assert.match(vectorQuery.sql, /FROM json_each\(\?\) j CROSS JOIN search_vector sv ON sv\.vid=j\.value/);
  const vectorPlan = raw.prepare(`EXPLAIN QUERY PLAN ${vectorQuery.sql}`).all(...vectorQuery.params);
  assert.ok(vectorPlan.some(({ detail }) => /SEARCH sv USING INDEX.*vid/.test(detail)), "Vektor-IDs werden ueber den vid-Index aufgeloest");
  assert.ok(!vectorPlan.some(({ detail }) => /SCAN d\b/.test(detail)), "Vektorkandidaten vermeiden den Vollscan");

  const shortRequest = new Request("https://api.m365.fm/api/search?q=qq", { headers: { "cf-connecting-ip": "short-load-test-ip" } });
  const shortTimes = [];
  for (let i = 0; i < 6; i++) {
    const started = performance.now();
    result = await handleSearch(env, shortRequest, new URL(shortRequest.url), (data) => data);
    if (i) shortTimes.push(performance.now() - started);
  }
  shortTimes.sort((a, b) => a - b);
  const shortMedian = shortTimes[Math.floor(shortTimes.length / 2)];
  assert.ok(shortMedian < 300, `Kurzsuche lag bei ${shortMedian.toFixed(1)} ms`);
  assert.equal(result.total, 0);
  const query = lastSearchQuery();
  assert.match(query.sql, /instr\(d\.title_norm/);
  const plan = raw.prepare(`EXPLAIN QUERY PLAN ${query.sql}`).all(...query.params);
  assert.ok(plan.length > 0);
  assert.equal(plan.filter(({ detail }) => /(?:SCAN d\b|SEARCH d USING INDEX)/.test(detail)).length, 1);
});
