// Sicherheits-Audit, Paket Moderation und Rechte: je Befund ein Regressionstest ueber den echten Worker-Eingang (index.js fetch) mit Sitzungs-Cookie.
// Nutzer wie in editor_rules.test.mjs: 1 Admin, 2 Editor, 3 Moderator, 4 Mitglied (Autor), 5 Editor, 6 Mitglied, 7 Fach-Editor (Bereich: teams)
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import W from "../src/index.js";
import { makeSession } from "../src/util.js";

const API = "https://api-dub.m365.fm", SITE = "https://www.m365.fm";
const ENTS = [{ id: "teams", type: "product", name: "Microsoft Teams" }, { id: "azure", type: "product", name: "Azure" }, { id: "contoso", type: "org", name: "Contoso", web: "https://www.contoso.com" }];
const realFetch = globalThis.fetch;
let extraFetch = null;   // je Test: (url, init) -> Response | undefined
globalThis.fetch = async (input, init) => {
  const u = String(input?.url || input);
  if (extraFetch) { const r = await extraFetch(u, init); if (r) return r; }
  if (u.startsWith(SITE + "/") && (u.endsWith("/entities.json") || u.endsWith("/entities-src.json"))) return new Response(JSON.stringify({ entities: ENTS }), { headers: { "content-type": "application/json" } });
  if (/^https:\/\/(www|api-dub)\.m365\.fm\//.test(u)) return new Response("{}", { status: 404 });
  return realFetch(input, init);
};

async function mk(envExtra = {}) {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:"), dir = new URL("../migrations/", import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(f, dir), "utf-8"));
  const db = {
    prepare(sql) { const st = raw.prepare(sql); let a = []; const o = { bind(...x) { a = x; return o; }, all: async () => ({ results: st.all(...a) }), first: async () => st.get(...a) ?? null, run: async () => { const r = st.run(...a); return { meta: { changes: Number(r.changes), last_row_id: Number(r.lastInsertRowid) } }; } }; return o; },
    batch: async (l) => { raw.exec("BEGIN"); try { const out = []; for (const s of l) out.push(await s.run()); raw.exec("COMMIT"); return out; } catch (e) { raw.exec("ROLLBACK"); throw e; } },
  };
  const env = { DB: db, SESSION_SECRET: "test-secret-0123456789", API, SITE, CRON_KEY: "cron-test", ...envExtra };
  for (const [id, name, role] of [[1, "Admin", "admin"], [2, "Edi", "editor"], [3, "Mo", "moderator"], [4, "Autor", "user"], [5, "Edi2", "editor"], [6, "Mitglied", "user"], [7, "Fach", "editor"]]) {
    raw.prepare("INSERT INTO users(id,provider,sub,name,role,created) VALUES(?,?,?,?,?,1)").run(id, "t", "s" + id, name, role);
    raw.prepare("INSERT INTO profiles(user_id,handle,public,updated) VALUES(?,?,1,1)").run(id, "user-" + id);
  }
  ins(raw, "editor_scope", { user_id: 7, topics: '["teams"]', langs: "[]", updated: 1 });
  return { raw, db, env };
}
function ins(raw, table, row) {
  const cols = raw.prepare(`PRAGMA table_info(${table})`).all(), r = { ...row };
  for (const c of cols) if (c.notnull && c.dflt_value === null && !c.pk && !(c.name in r)) r[c.name] = /INT|REAL|NUM/i.test(c.type) ? 0 : "";
  const k = Object.keys(r);
  return Number(raw.prepare(`INSERT INTO ${table}(${k.map((x) => `"${x}"`).join(",")}) VALUES(${k.map(() => "?").join(",")})`).run(...k.map((x) => r[x])).lastInsertRowid);
}
async function call(env, uid, method, path, body, headers = {}) {
  const h = { "x-requested-with": "m365", origin: SITE, ...(uid ? { cookie: `m365s=${await makeSession(env, uid)}` } : {}), ...(body ? { "content-type": "application/json" } : {}), ...headers };
  const r = await W.fetch(new Request(API + path, { method, headers: h, body: body ? JSON.stringify(body) : undefined, redirect: "manual" }), env, { waitUntil() {} });
  const text = await r.text();
  let j = null; try { j = JSON.parse(text); } catch {}
  return { s: r.status, j, text, headers: r.headers };
}

// ---------- K30: erneutes Speichern hebt das Ausblenden der Moderation nicht auf ----------
test("K30: Blogbeitrag erneut speichern laesst das Moderations-Bit im Feed stehen", async () => {
  const { raw, env } = await mk();
  ins(raw, "blog_posts", { id: 50, user_id: 4, slug: "p50", title: "Beitrag 50", summary: "Kurz", body: "Text", lang: "de", topics: "[]", status: "live", created: 100, updated: 100, published: 100 });
  const save = (title) => call(env, 4, "POST", "/api/blog/save", { id: 50, title, summary: "Kurz", body: "Ein Text fuer den Beitrag.", lang: "de", topics: [] });
  assert.equal((await save("Erster Titel")).s, 200);
  const f = raw.prepare("SELECT id,hidden FROM feed_items WHERE owner_id=4").get();
  assert.equal(f.hidden, 0);
  assert.equal((await call(env, 1, "POST", "/api/admin/feed-hide", { id: f.id, hidden: true })).s, 200);
  assert.equal((await save("Zweiter Titel")).s, 200);
  const g = raw.prepare("SELECT title,hidden FROM feed_items WHERE id=?").get(f.id);
  assert.equal(g.title, "Zweiter Titel");
  assert.equal(g.hidden & 1, 1, "Moderations-Bit bleibt");
  const feed = await call(env, 0, "GET", "/api/feed");
  assert.ok(!(feed.j?.items || []).some((x) => x.id === f.id), "nicht im Feed");
  // Mitglieds-Bit (2) loescht das Speichern weiterhin
  raw.prepare("UPDATE feed_items SET hidden=2 WHERE id=?").run(f.id);
  await save("Dritter Titel");
  assert.equal(raw.prepare("SELECT hidden FROM feed_items WHERE id=?").get(f.id).hidden, 0);
});

// ---------- K31: ausgeblendete Bewertung kommt durch Loeschen und Neuanlegen nicht zurueck ----------
test("K31: ausgeblendete Bewertung - eigenes Loeschen leert nur den Text, Neuanlegen bleibt gesperrt", async () => {
  const { raw, env } = await mk();
  const r = ins(raw, "show_reviews", { show: "en", user_id: 4, rating: 1, title: "Boese", body: "Ganz boeser Text hier", status: "published", created: 1, updated: 1 });
  assert.equal((await call(env, 2, "POST", "/api/reviews/delete", { id: r })).s, 200);
  assert.equal(raw.prepare("SELECT status FROM show_reviews WHERE id=?").get(r).status, "hidden");
  assert.equal((await call(env, 4, "POST", "/api/reviews/delete", { id: r })).s, 200);
  const row = raw.prepare("SELECT status,title,body FROM show_reviews WHERE id=?").get(r);
  assert.deepEqual({ ...row }, { status: "hidden", title: "", body: "" });
  const p = await call(env, 4, "POST", "/api/reviews", { show: "en", rating: 5, body: "0123456789 neuer Text" });
  assert.equal(p.s, 403); assert.equal(p.j.error, "hidden");
  const g = await call(env, 0, "GET", "/api/reviews?show=en");
  assert.equal(g.j.count, 0); assert.equal(g.j.items.length, 0);
  // nicht ausgeblendete eigene Bewertung wird weiter wirklich geloescht
  const r2 = ins(raw, "show_reviews", { show: "en", user_id: 6, rating: 4, created: 1, updated: 1 });
  assert.equal((await call(env, 6, "POST", "/api/reviews/delete", { id: r2 })).s, 200);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM show_reviews WHERE id=?").get(r2).n, 0);
});
