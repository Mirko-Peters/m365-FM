// Issue #156: Suchbegriffe anonym erfassen, Luecken erkennen, Uebersetzung auf Nachfrage. SQLite mit allen Migrationen, kein Netz (fetch gemockt).
// Geprueft: Anonymisierung, Zaehlung per waitUntil ueber den echten Worker-Einstieg (Antwort wartet nicht), Einordnung der drei Faelle, Missbrauchsschwelle,
// Budget -> Warteschlange wartet, 12 Monate Aufbewahrung, demand-export, gaps, Rechte je Rolle (Route und MCP), keine Personenspalten.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import worker from "../src/index.js";
import { searchTerm, countSearch, classifySearches, aggregateDemand, purgeSearchStats, demandItem, deleteUserSearchDemand } from "../src/search_demand.js";
import { runTrDemand } from "../src/autotr.js";
import { makeSession, sha256hex } from "../src/util.js";
import { mergeStatements } from "../src/identities.js";

const MIG = new URL("../migrations/", import.meta.url);
const day = (n = 0) => new Date(Date.now() - n * 86400000).toISOString().slice(0, 10);

async function setup({ hook } = {}) {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:");
  for (const f of readdirSync(MIG).filter((f) => f.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(f, MIG), "utf-8"));
  raw.exec("INSERT INTO users(id,provider,sub,name,role,banned,created) VALUES(1,'google','a','Admin','admin',0,1),(2,'google','b','Editor','editor',0,1),(3,'google','c','Moderator','moderator',0,1),(4,'google','d','Mitglied','',0,1)");
  const db = {
    prepare(sql) {
      let args = [];
      const o = {
        bind(...a) { args = a; return o; },
        all: async () => { if (hook) await hook(sql); return { results: raw.prepare(sql).all(...args) }; },
        first: async () => { if (hook) await hook(sql); return raw.prepare(sql).get(...args) ?? null; },
        run: async () => { if (hook) await hook(sql); const r = raw.prepare(sql).run(...args); return { meta: { changes: Number(r.changes) } }; },
      };
      return o;
    },
    async batch(s) { for (const x of s) await x.run(); },
  };
  const env = { DB: db, SESSION_SECRET: "s3cret", SITE: "https://www.m365.fm", API: "https://api-dub.m365.fm", ADMIN_SUBS: "" };
  return { raw, env };
}
function seedDocs(raw, docs) {
  raw.exec("CREATE VIRTUAL TABLE IF NOT EXISTS search_fts USING fts5(title,keywords,summary,tokenize='trigram'); INSERT OR IGNORE INTO meta(k,v) VALUES('search_fts_tokenizer','trigram')");
  for (const d of docs) {
    raw.prepare("INSERT INTO search_doc(id,url,lang,type,title,title_norm,summary,keywords,entities,date,image,h,gone,updated,grp) VALUES(?,?,?,?,?,?,'','','','','',?,0,1,'')")
      .run(d.id, d.url, d.lang, d.type, d.title, ` ${d.title.toLowerCase()} `, d.id);
    const { rowid } = raw.prepare("SELECT rowid FROM search_doc WHERE id=?").get(d.id);
    raw.prepare("INSERT INTO search_fts(rowid,title,keywords,summary) VALUES(?,?,'','')").run(rowid, d.title);
  }
}
const sq = (raw) => raw.prepare("SELECT day,lang,q_norm,n,zero,cls FROM search_q ORDER BY lang,q_norm").all().map((r) => ({ ...r }));
const addQ = (raw, d, lang, q, n, cls = "", docs = []) => raw.prepare("INSERT INTO search_q(day,lang,q_norm,n,zero,cls,docs) VALUES(?,?,?,?,0,?,?)").run(d, lang, q, n, cls, JSON.stringify(docs));
const cookieFor = async (env, uid) => ({ cookie: `m365s=${await makeSession(env, uid)}` });

test("Anonymisierung: E-Mail, Telefon, Adresse, lange Eingabe und reine Zahlen werden verworfen, der Rest normalisiert", () => {
  for (const bad of ["max@example.com", "mail an jemand @ firma", "+49 176 1234567", "0176/123 45 67", "(555) 123-4567", "call 555-123-4567", "https://www.m365.fm/x",
    "www.contoso.com", "teams.microsoft.com", "contoso.de/impressum", "12345678", "2024", "  42  ", "!!!", "x".repeat(121), "",
    // Ziffernfolgen neben Woertern (Gegenpruefung): ohne Trennzeichen mit +/0, 10+ am Stueck, 7+ mit Trennzeichen, IBAN
    "tel +491512345678", "rückruf 01512345678", "call 4155552671", "mobil 151 2345 6789", "my ssn 123-45-6789", "ticket 4711-0815-1234",
    "iban de89 3704 0044 0532 0130 00", "IBAN DE89370400440532013000", "kunde 0049 30 1234567", "sharepoint 2016 01761234567"]) assert.equal(searchTerm(bad), "", bad);
  assert.equal(searchTerm("  Copilot   STUDIO\tAgent "), "copilot studio agent");
  assert.equal(searchTerm("SharePoint 2016 2019 2022"), "sharepoint 2016 2019 2022", "Versionslisten sind keine Rufnummer");
  assert.equal(searchTerm("Exchange 2010/2013/2016/2019"), "exchange 2010/2013/2016/2019");
  assert.equal(searchTerm("Windows 11 24H2 build 26100"), "windows 11 24h2 build 26100");
  assert.equal(searchTerm("KB5034441"), "kb5034441");
  assert.equal(searchTerm("ASP.NET Core"), "asp.net core");
  assert.equal(searchTerm("Entra ID 2026-11"), "entra id 2026-11");
  assert.equal(Array.from(searchTerm("ä".repeat(100))).length, 80, "hoechstens 80 Zeichen");
});

test("Zaehlung: ueber den echten Worker-Einstieg in waitUntil, die Antwort wartet nicht; nur mit c=1; je Begriff einmal je Fenster; MCP zaehlt nicht", async () => {
  let release; const gateP = new Promise((r) => { release = r; });
  const { raw, env } = await setup({ hook: async (sql) => { if (/INSERT INTO search_q/.test(sql)) await gateP; } });
  seedDocs(raw, [{ id: "en:/a/", url: "https://www.m365.fm/a/", lang: "en", type: "page", title: "Copilot Studio agents" }]);
  const store = new Map(), oldCaches = globalThis.caches;
  globalThis.caches = { default: { match: async (k) => store.get(String(k)), put: async (k, v) => { store.set(String(k), v); } } };
  try {
    const pending = [], ctx = { waitUntil: (p) => pending.push(p) };
    const get = (qs, ip = "198.51.100.1") => worker.fetch(new Request(`https://api-dub.m365.fm/api/search?${qs}`, { headers: { "cf-connecting-ip": ip } }), env, ctx);
    await get("q=copilot+stu&pref=de"); await get("q=copilot+studi&pref=de&page=1");
    assert.equal(pending.length, 0, "ohne c=1 (Zwischenstaende beim Tippen) wird nichts gezaehlt");
    const r = await get("q=Copilot+Studio&pref=de&c=1");
    assert.equal(r.status, 200);
    assert.equal(pending.length, 1, "Zaehlung als waitUntil angemeldet");
    assert.equal(sq(raw).length, 0, "Antwort ist da, bevor gezaehlt wird");
    release(); await Promise.all(pending);
    assert.deepEqual(sq(raw), [{ day: day(), lang: "de", q_norm: "copilot studio", n: 1, zero: 0, cls: "" }]);
    await get("q=copilot%20%20studio&pref=de&c=1"); await get("q=nichtvorhanden&pref=de&c=1"); await get("q=a%40b.de&pref=de&c=1"); await get("q=tel+%2B491512345678&pref=de&c=1"); await get("q=Copilot+Studio&c=1");
    await get("q=Purview&pref=de&page=2&c=1");
    await Promise.all(pending);
    assert.deepEqual(sq(raw).map((x) => [x.q_norm, x.n, x.zero]), [["copilot studio", 1, 0], ["nichtvorhanden", 1, 1], ["purview", 1, 1]], "gleicher Begriff im Fenster einmal, E-Mail und Rufnummer verworfen, ohne pref nicht; Mehr (Seite 2) mit c=1 zaehlt");
    store.clear(); await get("q=COPILOT+studio&pref=de&c=1"); await Promise.all(pending);
    assert.equal(sq(raw)[0].n, 2, "nach dem Fenster zaehlt der Begriff wieder");
    assert.equal(await countSearch(env, { q: "Copilot", lang: "xx" }), false, "nur Sprachen der Website");
    const before = pending.length;
    const { handleSearch } = await import("../src/search.js");
    const req = new Request("https://x/api/search?q=Copilot&pref=de&c=1");
    await handleSearch(env, req, new URL(req.url), (d) => d);   // wie der MCP-Weg: ohne ctx
    assert.equal(pending.length, before, "ohne ctx (MCP) wird nichts gezaehlt");
    assert.doesNotMatch(readFileSync(new URL("../src/index.js", import.meta.url), "utf8").match(/path === "\/api\/search"\).*$/m)[0], /handleSearch\(env, request, url, J, ctx\)/, "MCP-Aufrufe (asUser) bekommen kein ctx");
  } finally { globalThis.caches = oldCaches; raw.close(); }
});

test("Einordnung: eigene Sprache, Uebersetzungsluecke (Inhalte zugeordnet), Inhaltsluecke, unavailable - je Zeile genau einmal", async () => {
  const { raw, env } = await setup();
  raw.exec("INSERT INTO profiles(user_id,handle,public,updated) VALUES(4,'anna',1,1)");
  raw.exec("INSERT INTO blog_posts(id,user_id,slug,title,lang,status,created,published,updated) VALUES(9,4,'teams-tipps','Teams tips','en','live',1,1,1)");
  addQ(raw, day(), "de", "purview", 2); addQ(raw, day(), "de", "copilot agent", 5); addQ(raw, day(), "de", "quantenkaffee", 1); addQ(raw, day(), "de", "ab", 1);
  let calls = 0;
  const classify = async (_env, q, lang) => {
    calls++; assert.equal(lang, "de");
    if (q === "purview") return { type: "own", documents: [{ url: "https://www.m365.fm/de/x/" }] };
    if (q === "copilot agent") return { type: "translation_gap", documents: [
      { url: "https://www.m365.fm/community/u/anna/blog/teams-tipps/", title: "Teams tips", type: "blog" },
      { url: "https://www.m365.fm/community/u/mirko-p/blog/alter-beitrag/", title: "Old post", type: "blog" },
      { url: "https://www.m365.fm/show/episodes/copilot-agents/", title: "Copilot agents", type: "episode" },
      { url: "https://www.m365.fm/community/podcast/7-agent-talk/", title: "Agent talk", type: "page" },
    ] };
    if (q === "quantenkaffee") return { type: "content_gap", documents: [] };
    return { type: "unavailable", documents: [] };
  };
  assert.deepEqual(await classifySearches(env, { classify }), { classified: 4, own: 1, translation_gap: 1, content_gap: 1, unavailable: 1 });
  const rows = Object.fromEntries(raw.prepare("SELECT q_norm,cls,docs FROM search_q").all().map((r) => [r.q_norm, r]));
  assert.equal(rows.purview.cls, "own"); assert.equal(rows.purview.docs, "[]", "eigene Sprache: nichts weiter");
  assert.equal(rows.quantenkaffee.cls, "content_gap"); assert.equal(rows.ab.cls, "unavailable");
  assert.deepEqual(JSON.parse(rows["copilot agent"].docs).map((d) => [d.k, d.i, d.p]), [["blog", "9", "/community/u/anna/blog/teams-tipps/"], ["lblog", "alter-beitrag", "/community/u/mirko-p/blog/alter-beitrag/"], ["episode", "copilot-agents", "/show/episodes/copilot-agents/"]], "hoechstens 3 Inhalte, Community-Beitrag per ID, frueherer per Slug");
  assert.deepEqual(await demandItem(env.DB, { url: "https://www.m365.fm/fr/community/podcast/7-agent-talk/" }), { k: "podcast", i: "7", p: "/community/podcast/7-agent-talk/" });
  assert.deepEqual(await demandItem(env.DB, { url: "https://www.m365.fm/entity/copilot-studio/", type: "entity" }), { k: "entity", i: "copilot-studio", p: "/entity/copilot-studio/" });
  assert.equal(await demandItem(env.DB, { url: "https://www.m365.fm/entity/jane-doe/", type: "person" }), null, "Personen werden nicht uebersetzt");
  assert.equal(await demandItem(env.DB, { url: "https://www.m365.fm/community/u/anna/", title: "Anna Beispiel", type: "person" }), null, "Profil: weder Handle noch Name in die Nachfrage");
  assert.equal(await demandItem(env.DB, { url: "https://www.m365.fm/de/community/u/anna/blog/", title: "Annas Blog", type: "page" }), null);
  assert.equal((await classifySearches(env, { classify })).classified, 0); assert.equal(calls, 4, "jede Zeile (Tag, Sprache, Begriff) nur einmal");
  const thrown = async () => { throw new Error("Vectorize weg"); };
  addQ(raw, day(), "fr", "agent", 1);
  assert.equal((await classifySearches(env, { classify: thrown })).unavailable, 1, "Fehler -> unavailable, kein Abbruch");
  assert.doesNotMatch(readFileSync(new URL("../src/search.js", import.meta.url), "utf8").match(/export async function handleSearch[\s\S]*$/)[0], /classifyQuery\(/, "Suchpfad ruft classifyQuery nie auf");
  raw.close();
});

test("Missbrauchsschwelle: erst N Suchen an mindestens 2 Tagen fuehren zu tr_demand; erledigte werden erkannt", async () => {
  const { raw, env } = await setup();
  const gap = [{ k: "podcast", i: "7", t: "Agent talk", p: "/community/podcast/7-agent-talk/" }], ep = [{ k: "episode", i: "copilot-agents", t: "Copilot agents", p: "/show/episodes/copilot-agents/" }];
  addQ(raw, day(), "de", "eintags-hype", 50, "translation_gap", gap);                       // viele Suchen, aber nur ein Tag
  addQ(raw, day(1), "de", "agent talk", 1, "translation_gap", gap); addQ(raw, day(), "de", "agent talk", 1, "translation_gap", gap);   // 2 Tage, nur 2 Suchen
  addQ(raw, day(2), "de", "copilot agenten", 2, "translation_gap", ep); addQ(raw, day(), "de", "copilot agenten", 1, "");   // 3 Suchen an 2 Tagen
  await aggregateDemand(env);
  assert.deepEqual(raw.prepare("SELECT kind,item,lang,searches,days,status,first_seen,last_seen FROM tr_demand").all().map((r) => ({ ...r })),
    [{ kind: "episode", item: "copilot-agents", lang: "de", searches: 2, days: 1, status: "open", first_seen: day(2), last_seen: day(2) }], "nur der Begriff ueber der Schwelle; gezaehlt werden die eingeordneten Tage");
  await aggregateDemand({ ...env, SEARCH_DEMAND_MIN: "2" });
  assert.ok(raw.prepare("SELECT 1 FROM tr_demand WHERE kind='podcast' AND item='7'").get(), "SEARCH_DEMAND_MIN ist einstellbar");
  raw.exec("INSERT INTO search_doc(id,url,lang,type,title,title_norm,summary,keywords,entities,date,image,h,gone,updated,grp) VALUES('de:ep','https://www.m365.fm/de/show/episodes/copilot-agents/','de','episode','x',' x ','','','','','','h',0,1,'')");
  raw.exec("INSERT INTO item_tr(kind,item_id,lang,title,created) VALUES('podcast',7,'de','Agenten',1)");
  await aggregateDemand({ ...env, SEARCH_DEMAND_MIN: "2" });
  assert.deepEqual(raw.prepare("SELECT kind,status FROM tr_demand ORDER BY kind").all().map((r) => [r.kind, r.status]), [["episode", "translated"], ["podcast", "translated"]], "Seite in der Zielsprache bzw. item_tr vorhanden");
  raw.close();
});

test("Uebersetzung auf Nachfrage: meistgesucht zuerst, Budget erreicht -> wartet (nichts verloren), danach item_tr mit Herkunft demand, nie ueberschreiben", async () => {
  const { raw, env } = await setup();
  Object.assign(env, { ANTHROPIC_API_KEY: "unit-test-key", AI_DAILY_EUR_HAIKU: "5", USD_PER_EUR: "1" });
  raw.exec("INSERT INTO pod_episodes(id,user_id,title,description,lang,status,created,updated,published) VALUES(7,4,'Agent talk','About agents','en','published',1,1,1),(8,4,'Old talk','Old','en','published',1,1,1),(9,4,'Third','x','en','published',1,1,1)");
  const ins = raw.prepare("INSERT INTO tr_demand(kind,item,lang,title,searches,days,status,first_seen,last_seen) VALUES(?,?,?,?,?,?,?,?,?)");
  ins.run("podcast", "8", "de", "Old talk", 3, 2, "open", day(9), day(1)); ins.run("podcast", "7", "de", "Agent talk", 30, 4, "open", day(9), day()); ins.run("episode", "copilot-agents", "de", "Ep", 99, 9, "open", day(9), day());
  ins.run("podcast", "9", "de", "Third", 2, 2, "open", day(9), day());
  raw.exec("INSERT INTO item_tr(kind,item_id,lang,title,summary,body,src,created) VALUES('podcast',9,'de','Von Hand','','','manual',1)");
  const sent = [], oldFetch = globalThis.fetch;
  globalThis.fetch = async (url, init) => { sent.push(JSON.parse(init.body)); return new Response(JSON.stringify({ content: [{ type: "text", text: JSON.stringify({ title: "Agenten-Talk", summary: "Über Agenten" }) }], usage: { input_tokens: 100, output_tokens: 40 } }), { status: 200 }); };
  try {
    raw.prepare("INSERT INTO ai_spend(id,day,model,job,lang,in_tok,out_tok,usd,reserved_usd,created) VALUES('voll',?,'claude-haiku-5-5','x','',0,0,5,0,1)").run(day());
    assert.deepEqual(await runTrDemand(env, async () => new Map()), { waiting_budget: true });
    assert.equal(sent.length, 0, "kein Aufruf bei erreichtem Budget");
    assert.deepEqual(raw.prepare("SELECT kind,item,status FROM tr_demand ORDER BY item").all().map((r) => [r.item, r.status]), [["7", "waiting_budget"], ["8", "waiting_budget"], ["9", "waiting_budget"], ["copilot-agents", "open"]], "Worker-Arten warten, Seitenbau-Arten bleiben unberuehrt");
    raw.exec("UPDATE ai_spend SET usd=4.9999 WHERE id='voll'");   // Status erlaubt noch, die Vormerkung des Aufrufs passt aber nicht mehr hinein
    assert.equal((await runTrDemand(env, async () => new Map())).waiting_budget, true);
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM tr_demand WHERE status='waiting_budget'").get().n, 2, "abgewiesener Aufruf: wartet weiter, der vorhandene Handtext gilt als erledigt");
    assert.equal(raw.prepare("SELECT status FROM tr_demand WHERE item='9'").get().status, "translated");
    raw.exec("DELETE FROM ai_spend");   // naechster Tag: Budget frei
    const r = await runTrDemand(env, async () => new Map());
    assert.equal(r.done, 2);
    assert.deepEqual(sent.map((b) => JSON.parse(b.messages[0].content).title), ["Agent talk", "Old talk"], "meistgesucht zuerst, auch aeltere Inhalte");
    assert.deepEqual(raw.prepare("SELECT item_id,title,src FROM item_tr WHERE kind='podcast' ORDER BY item_id").all().map((x) => [x.item_id, x.title, x.src]), [[7, "Agenten-Talk", "demand"], [8, "Agenten-Talk", "demand"], [9, "Von Hand", "manual"]], "Handfassung bleibt");
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM ai_spend WHERE job='worker_translation_demand' AND usd>0").get().n, 2, "jeder Aufruf zaehlt gegen das Tagesbudget");
    assert.equal(sent[0].thinking?.type, "disabled", "wie die uebrigen Haiku-Auftraege (haikuJson)");
    assert.deepEqual((await runTrDemand(env, async () => new Map())), { done: 0 });
    raw.exec("INSERT OR REPLACE INTO meta(k,v) VALUES('atr_off','1')"); raw.exec("UPDATE tr_demand SET status='open' WHERE item='7'");
    assert.deepEqual(await runTrDemand(env, async () => new Map()), { skipped: true }, "Notaus atr_off gilt auch hier");
  } finally { globalThis.fetch = oldFetch; raw.close(); }
});

test("Aufbewahrung: Suchbegriffe und Nachfrage aelter als 12 Monate werden geloescht", async () => {
  const { raw, env } = await setup();
  const now = new Date("2026-11-10T06:00:00Z");
  addQ(raw, "2025-11-09", "de", "alt", 3); addQ(raw, "2025-11-10", "de", "grenze", 3); addQ(raw, "2026-11-10", "de", "neu", 3);
  raw.exec("INSERT INTO tr_demand(kind,item,lang,status,first_seen,last_seen) VALUES('podcast','1','de','open','2025-01-01','2025-11-01'),('podcast','2','de','open','2025-01-01','2026-10-01')");
  assert.deepEqual(await purgeSearchStats(env.DB, now), { cutoff: "2025-11-10", search_q: 1, tr_demand: 1 });
  assert.deepEqual(raw.prepare("SELECT q_norm FROM search_q ORDER BY q_norm").all().map((r) => r.q_norm), ["grenze", "neu"]);
  assert.match(readFileSync(new URL("../src/index.js", import.meta.url), "utf8"), /event\.cron === "0 6 \* \* \*"[\s\S]*?T\("purgeSearchStats"/, "taeglich im 06:00-Cron");
  assert.match(readFileSync(new URL("../src/index.js", import.meta.url), "utf8"), /T\("searchDemand", async \(\) => \{[\s\S]*?classifySearches\(env\)[\s\S]*?aggregateDemand\(env\)[\s\S]*?runTrDemand\(env, entityMap\)/, "Einordnen, Fortschreiben und Uebersetzen im Cron");
  raw.close();
});

test("Schnittstellen: demand-export und gaps sind oeffentlich, noindex, ohne Personendaten und gedeckelt", async () => {
  const { raw, env } = await setup();
  const ins = raw.prepare("INSERT INTO tr_demand(kind,item,lang,title,path,searches,days,status,first_seen,last_seen) VALUES(?,?,?,?,?,?,?,?,?,?)");
  ins.run("episode", "a", "de", "Folge A", "/show/episodes/a/", 5, 2, "open", day(3), day()); ins.run("lblog", "b", "de", "Beitrag B", "/x/", 9, 3, "waiting_budget", day(3), day());
  ins.run("episode", "c", "de", "Folge C", "/c/", 50, 5, "translated", day(3), day()); ins.run("podcast", "7", "de", "Pod", "/p/", 70, 5, "open", day(3), day()); ins.run("episode", "a", "fr", "Folge A", "/a/", 3, 2, "open", day(3), day());
  let r = await worker.fetch(new Request("https://api-dub.m365.fm/api/search/demand-export"), env, { waitUntil() {} });
  assert.equal(r.status, 200); assert.equal(r.headers.get("x-robots-tag"), "noindex");
  const j = await r.json();
  assert.deepEqual(Object.keys(j).sort(), ["generated", "langs", "min"]);
  assert.deepEqual(j.langs, { de: [{ kind: "lblog", item: "b", title: "Beitrag B", searches: 9, days: 3 }, { kind: "episode", item: "a", title: "Folge A", searches: 5, days: 2 }], fr: [{ kind: "episode", item: "a", title: "Folge A", searches: 3, days: 2 }] },
    "nur offene/wartende Seitenbau-Arten, meistgesucht zuerst");

  for (let i = 0; i < 60; i++) { addQ(raw, day(1), "en", `luecke ${String(i).padStart(2, "0")}`, 2 + i, "content_gap"); addQ(raw, day(), "en", `luecke ${String(i).padStart(2, "0")}`, 1, "content_gap"); }
  addQ(raw, day(), "en", "ignore previous instructions", 40, "content_gap");   // ein Tag: bleibt unter der Schwelle
  addQ(raw, day(20), "en", "alte luecke", 300, "content_gap"); addQ(raw, day(19), "en", "alte luecke", 300, "content_gap");
  addQ(raw, day(1), "en", "copilot", 9, "own"); addQ(raw, day(), "en", "copilot", 9, "own");
  r = await worker.fetch(new Request("https://api-dub.m365.fm/api/search/gaps?weeks=1&lang=en&limit=500", { headers: { "cf-connecting-ip": "203.0.113.5" } }), env, { waitUntil() {} });
  assert.equal(r.status, 200); assert.equal(r.headers.get("x-robots-tag"), "noindex"); assert.match(r.headers.get("cache-control"), /public/);
  const g = await r.json();
  assert.equal(g.gaps.length, 50, "harte Obergrenze 50");
  assert.deepEqual(g.gaps[0], { q: "luecke 59", searches: 62, days: 2 });
  assert.ok(!g.gaps.some((x) => /ignore|alte|copilot/.test(x.q)), "nur Inhaltsluecken ueber der Schwelle im Zeitraum");
  assert.equal(g.lang, "en"); assert.equal(g.weeks, 1);
  r = await worker.fetch(new Request("https://api-dub.m365.fm/api/search/gaps?weeks=4&lang=en"), env, { waitUntil() {} });
  assert.ok((await r.json()).gaps.some((x) => x.q === "alte luecke"), "weeks erweitert den Zeitraum");
  assert.equal((await worker.fetch(new Request("https://api-dub.m365.fm/api/search/gaps?lang=xx"), env, { waitUntil() {} })).status, 400);
  assert.equal((await worker.fetch(new Request("https://api-dub.m365.fm/api/search/gaps", { method: "POST", headers: { "x-requested-with": "m365" } }), env, { waitUntil() {} })).status, 405);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM ratelimit WHERE k LIKE '%203.0.113%'").get().n, 0, "Ratelimit ohne IP im Schluessel");
  raw.close();
});

test("Rechte: Auswertung nur fuer Editoren und Admin (Route und MCP), Inhaltsluecken per MCP ohne Token", async () => {
  const { raw, env } = await setup();
  addQ(raw, day(), "de", "copilot", 4, "content_gap"); addQ(raw, day(1), "de", "copilot", 4, "content_gap");
  const report = async (uid) => worker.fetch(new Request("https://api-dub.m365.fm/api/search/report?weeks=1&lang=de", { headers: uid ? await cookieFor(env, uid) : {} }), env, { waitUntil() {} });
  assert.equal((await report(0)).status, 401);
  assert.equal((await report(4)).status, 403, "Mitglied");
  assert.equal((await report(3)).status, 403, "Moderator (queue.review)");
  for (const uid of [1, 2]) {
    const r = await report(uid); assert.equal(r.status, 200);
    const j = await r.json();
    assert.deepEqual(Object.keys(j).sort(), ["by_week", "classes", "content_gaps", "from", "lang", "min", "to", "top", "totals", "translation_gaps", "weeks", "zero"]);
    assert.deepEqual(j.top, [{ lang: "de", q: "copilot", searches: 8, days: 2 }]);
  }
  const mcp = async (body, token) => (await (await worker.fetch(new Request("https://api-dub.m365.fm/mcp", { method: "POST", headers: { "content-type": "application/json", ...(token ? { authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify(body) }), env, { waitUntil() {} })).json());
  for (const [uid, tok] of [[2, "m365_editor_token_123456789"], [4, "m365_member_token_123456789"]]) raw.prepare("INSERT INTO api_tokens(hash,user_id,label,created,last_used) VALUES(?,?,?,?,0)").run(await sha256hex(tok), uid, "t", 1);
  const call = (name, args, tok) => mcp({ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name, arguments: args } }, tok);
  const ed = JSON.parse((await call("search_report", { lang: "de", weeks: 1 }, "m365_editor_token_123456789")).result.content[0].text);
  assert.deepEqual(ed.content_gaps, [{ lang: "de", q: "copilot", searches: 8, days: 2 }]);
  const mem = await call("search_report", { lang: "de" }, "m365_member_token_123456789");
  assert.equal(mem.result.isError, true); assert.match(mem.result.content[0].text, /forbidden/);
  assert.equal(JSON.parse((await call("search_report", {})).result.content[0].text).error, "token_required");
  const gaps = JSON.parse((await call("search_content_gaps", { lang: "de" })).result.content[0].text);
  assert.deepEqual(gaps.gaps, [{ q: "copilot", searches: 8, days: 2 }], "oeffentlich, wie GET /api/search/gaps");
  const listed = (await mcp({ jsonrpc: "2.0", id: 2, method: "tools/list" })).result.tools.map((t) => t.name);
  assert.ok(listed.includes("search_content_gaps") && !listed.includes("search_report"), "Auswertung nur fuer die Redaktion sichtbar");
  raw.close();
});

test("Datenschutz und Deploy-Gate: keine Personenspalten, Migration 0044 idempotent, Zusammenfuehren/Loeschen unberuehrt", async () => {
  const { raw } = await setup();
  for (const t of ["search_q", "tr_demand"]) {
    const cols = raw.prepare(`PRAGMA table_info(${t})`).all().map((c) => c.name);
    assert.ok(cols.length > 3);
    assert.ok(!cols.some((c) => /user|uid|owner|ip|mail|email|_by$|sub|session|created|ts$/i.test(c)), `${t}: ${cols.join(",")}`);
  }
  assert.deepEqual(raw.prepare("PRAGMA table_info(search_q)").all().filter((c) => c.pk).map((c) => c.name), ["day", "lang", "q_norm"]);
  raw.exec(readFileSync(new URL("0044_search_demand.sql", MIG), "utf-8"));   // zweimal anwenden: keine Fehler
  const merge = JSON.stringify(mergeStatements.toString());
  assert.doesNotMatch(merge, /search_q|tr_demand/, "keine Nutzerbezuege, also nichts zusammenzufuehren");
  const sql = readFileSync(new URL("0044_search_demand.sql", MIG), "utf-8").replace(/--[^\n]*/g, "").split(";").map((s) => s.trim()).filter(Boolean);
  for (const s of sql) assert.match(s, /^CREATE (TABLE|INDEX) IF NOT EXISTS /i);
  raw.close();
});

test("Nachfrage: bleibende Fehler (Antwort kaputt, API 4xx) sofort failed, voruebergehende hoechstens 3 Versuche; DAILY_CAP bleibt fuer den 24-Stunden-Lauf", async () => {
  const { raw, env } = await setup();
  Object.assign(env, { ANTHROPIC_API_KEY: "unit-test-key", AI_DAILY_EUR_HAIKU: "5", USD_PER_EUR: "1" });
  raw.exec("INSERT INTO pod_episodes(id,user_id,title,description,lang,status,created,updated,published) VALUES(1,4,'Kaputt','x','en','published',1,1,1),(2,4,'Verboten','x','en','published',1,1,1),(3,4,'Wackelig','x','en','published',1,1,1),(4,4,'Zurueckgezogen','x','en','rejected',1,1,0)");
  const ins = raw.prepare("INSERT INTO tr_demand(kind,item,lang,title,searches,days,status,first_seen,last_seen) VALUES('podcast',?,'de',?,?,2,'open',?,?)");
  ins.run("1", "Kaputt", 90, day(3), day()); ins.run("2", "Verboten", 80, day(3), day()); ins.run("3", "Wackelig", 70, day(3), day()); ins.run("4", "Zurueckgezogen", 99, day(3), day());
  const sent = [], oldFetch = globalThis.fetch;
  globalThis.fetch = async (url, init) => {
    const title = JSON.parse(JSON.parse(init.body).messages[0].content).title; sent.push(title);
    if (title === "Verboten") return new Response(JSON.stringify({ type: "error" }), { status: 403 });
    if (title === "Wackelig") return new Response("überlastet", { status: 529 });
    return new Response(JSON.stringify({ content: [{ type: "text", text: "{kaputt" }], usage: { input_tokens: 100, output_tokens: 40 } }), { status: 200 });
  };
  const st = () => Object.fromEntries(raw.prepare("SELECT item,status,tries,info FROM tr_demand").all().map((r) => [r.item, [r.status, r.tries, r.info]]));
  const cap = () => +(raw.prepare("SELECT v FROM meta WHERE k=?").get("atr_count:" + day())?.v || 0);
  try {
    await runTrDemand(env, async () => new Map());
    let s = st();
    assert.deepEqual(s["4"], ["failed", 0, "nicht veröffentlicht"], "zurueckgezogener Inhalt: kein Aufruf");
    assert.ok(!sent.includes("Zurueckgezogen"));
    assert.equal(s["1"][0], "failed", "Antwort nicht lesbar: bleibend"); assert.equal(s["1"][1], 1);
    assert.deepEqual(s["2"].slice(0, 2), ["failed", 1], "API 403: bleibend");
    assert.deepEqual(s["3"].slice(0, 2), ["open", 1], "529/5xx: voruebergehend, naechster Lauf");
    assert.equal(cap(), 3, "nur echte Aufrufe zaehlen gegen DAILY_CAP");
    const after1 = sent.length;
    await runTrDemand(env, async () => new Map());
    assert.deepEqual(sent.slice(after1), ["Wackelig"], "kaputte und verbotene werden nicht wiederholt");
    await runTrDemand(env, async () => new Map());
    assert.deepEqual(st()["3"].slice(0, 2), ["failed", 3], "nach 3 voruebergehenden Fehlern: failed");
    const n = sent.length;
    for (let i = 0; i < 5; i++) await runTrDemand(env, async () => new Map());
    assert.equal(sent.length, n, "danach kein einziger bezahlter Aufruf mehr");
    assert.equal(cap(), 5, "DAILY_CAP: 5 Aufrufe statt eines vollen Tages");
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM ai_spend WHERE job='worker_translation_demand'").get().n, 5);
  } finally { globalThis.fetch = oldFetch; raw.close(); }
});

test("Kontoloeschung: Nachfrage zu eigenen Inhalten und zum Profil verschwindet aus tr_demand und search_q.docs, die Begriffe bleiben", async () => {
  const { raw, env } = await setup();
  raw.exec("INSERT INTO profiles(user_id,handle,public,updated) VALUES(4,'anna',1,1),(2,'bert',1,1)");
  raw.exec("INSERT INTO blog_posts(id,user_id,slug,title,lang,status,created,published,updated) VALUES(9,4,'teams-tipps','Teams tips','en','live',1,1,1),(10,2,'bert-post','Bert','en','live',1,1,1)");
  raw.exec("INSERT INTO pod_episodes(id,user_id,title,description,lang,status,created,updated,published) VALUES(7,4,'Annas Talk','x','en','published',1,1,1)");
  raw.exec("INSERT INTO yt_videos(id,user_id,title,description,lang,status,created,updated,published) VALUES(5,4,'Annas Video','x','en','published',1,1,1)");
  const ins = raw.prepare("INSERT INTO tr_demand(kind,item,lang,title,path,searches,days,status,first_seen,last_seen) VALUES(?,?,'de',?,?,5,2,'open',?,?)");
  ins.run("blog", "9", "Teams tips", "/community/u/anna/blog/teams-tipps/", day(2), day()); ins.run("lblog", "alt", "Annas alter Beitrag", "/community/u/anna/blog/alt/", day(2), day());
  ins.run("page", "/community/u/anna/", "Anna Beispiel", "/community/u/anna/", day(2), day()); ins.run("podcast", "7", "Annas Talk", "/community/podcast/7-annas-talk/", day(2), day());
  ins.run("video", "5", "Annas Video", "/community/video/5-annas-video/", day(2), day()); ins.run("blog", "10", "Bert", "/community/u/bert/blog/bert-post/", day(2), day());
  ins.run("episode", "copilot", "Copilot", "/show/episodes/copilot/", day(2), day()); ins.run("page", "/community/u/annabell/", "Annabell", "/community/u/annabell/", day(2), day());
  const docs = [{ k: "blog", i: "9", t: "Teams tips", p: "/community/u/anna/blog/teams-tipps/" }, { k: "podcast", i: "7", t: "Annas Talk", p: "/community/podcast/7-annas-talk/" }, { k: "episode", i: "copilot", t: "Copilot", p: "/show/episodes/copilot/" }];
  addQ(raw, day(), "de", "teams tipps", 4, "translation_gap", docs); addQ(raw, day(), "de", "bert", 4, "translation_gap", [{ k: "blog", i: "10", t: "Bert", p: "/community/u/bert/blog/bert-post/" }]);
  addQ(raw, day(), "de", "nur anna", 4, "translation_gap", docs.slice(0, 1));
  const r = await worker.fetch(new Request("https://api-dub.m365.fm/api/me", { method: "DELETE", headers: { ...(await cookieFor(env, 4)), "x-requested-with": "m365" } }), env, { waitUntil() {} });
  assert.equal(r.status, 200);
  assert.deepEqual(raw.prepare("SELECT kind,item FROM tr_demand ORDER BY kind,item").all().map((x) => [x.kind, x.item]), [["blog", "10"], ["episode", "copilot"], ["page", "/community/u/annabell/"]], "nur fremde Inhalte bleiben (annabell ist nicht anna)");
  const q = Object.fromEntries(raw.prepare("SELECT q_norm,docs FROM search_q").all().map((x) => [x.q_norm, JSON.parse(x.docs)]));
  assert.deepEqual(q["teams tipps"], [{ k: "episode", i: "copilot", t: "Copilot", p: "/show/episodes/copilot/" }]);
  assert.deepEqual(q["nur anna"], []); assert.equal(q.bert.length, 1, "andere Konten unberuehrt");
  assert.doesNotMatch(JSON.stringify(raw.prepare("SELECT * FROM tr_demand").all()) + JSON.stringify(raw.prepare("SELECT docs FROM search_q").all()), /anna\/|Annas|Teams tips/);
  await deleteUserSearchDemand(env.DB, 99);   // Konto ohne Profil: kein Fehler, nichts geloescht
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM tr_demand").get().n, 3);
  raw.close();
});
