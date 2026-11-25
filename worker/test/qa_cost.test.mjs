// D1-Kosten (Paket A, Punkt 9): /api/qa ohne N+1 und fuer Abgemeldete im Kanten-Cache, /api/edits/pending ohne Anmeldung ohne D1.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { handleQa } from "../src/qa.js";
import { handleVotes } from "../src/votes.js";

async function setup() {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:");
  const dir = new URL("../migrations/", import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(f, dir), "utf-8"));
  raw.exec(`INSERT INTO users(id,provider,sub,name,role,banned,created) VALUES(1,'g','1','Anna','user',0,1),(2,'g','2','Ben','user',0,1),(3,'g','3','Cem','user',0,1);
    INSERT INTO entity_q(id,eid,user_id,q,lang,created) VALUES(1,'azure',1,'Was ist Azure?','de',10),(2,'azure',2,'Wie teuer?','de',20),(3,'fabric',1,'Fabric?','de',30);
    INSERT INTO entity_a(id,q_id,user_id,a,accepted,created) VALUES(1,1,2,'Eine Cloud von Microsoft.',0,11),(2,1,3,'Cloud-Plattform.',1,12),(3,2,1,'Kommt drauf an.',0,21);
    INSERT INTO entity_a_votes(a_id,user_id,created) VALUES(1,1,1),(1,3,1);`);
  const sql = [];
  const db = { prepare(q) { let a = []; const o = { bind(...x) { a = x; return o; }, all: async () => { sql.push(q); return { results: raw.prepare(q).all(...a) }; }, first: async () => { sql.push(q); return raw.prepare(q).get(...a) ?? null; }, run: async () => { sql.push(q); const r = raw.prepare(q).run(...a); return { meta: { changes: Number(r.changes), last_row_id: Number(r.lastInsertRowid) } }; } }; return o; }, async batch(s) { for (const x of s) await x.run(); } };
  return { raw, sql, env: { DB: db, SITE: "https://www.m365.fm" } };
}
const J = (data, status = 200) => ({ data, status });
const qa = (env, path, user, method = "GET", body) => { const url = new URL(`https://api-dub.m365.fm${path}`); return handleQa(env, new Request(url, { method, ...(body ? { body: JSON.stringify(body), headers: { "content-type": "application/json" } } : {}) }), url, url.pathname, user, J); };

test("/api/qa: Antworten aller Fragen in einer Abfrage, Reihenfolge wie bisher (angenommen, Stimmen, Zeit)", async () => {
  const { sql, env } = await setup();
  const r = await qa(env, "/api/qa?eid=azure", { id: 1 });
  assert.equal(sql.filter((q) => /FROM entity_a a/.test(q)).length, 1);
  assert.deepEqual(r.data.questions.map((q) => [q.id, q.answers.map((a) => a.id)]), [[2, [3]], [1, [2, 1]]]);
  assert.deepEqual(r.data.questions[1].answers.map((a) => [a.votes, a.me, a.accepted]), [[0, false, true], [2, true, false]]);
  assert.equal(r.data.loggedIn, true);
});

test("/api/qa: Abgemeldete aus dem Kanten-Cache; eine Stimme verwirft den Eintrag; Angemeldete nie aus dem Cache", async () => {
  const { sql, env } = await setup();
  const store = new Map(), old = globalThis.caches;
  globalThis.caches = { default: { async match(r) { const v = store.get(r.url); return v ? new Response(v) : undefined; }, async put(r, res) { store.set(r.url, await res.text()); }, async delete(r) { return store.delete(r.url); } } };
  try {
    const a = await qa(env, "/api/qa?eid=azure");
    assert.equal(a.data.loggedIn, false); assert.equal(store.size, 1);
    sql.length = 0;
    assert.deepEqual((await qa(env, "/api/qa?eid=azure")).data, a.data); assert.equal(sql.length, 0, "Treffer ohne D1");
    const mine = await qa(env, "/api/qa?eid=azure", { id: 2 });
    assert.equal(mine.data.loggedIn, true); assert.ok(sql.length > 0, "angemeldet: immer frisch");
    assert.equal((await qa(env, "/api/qa/vote", { id: 2 }, "POST", { aid: 2 })).data.ok, true);
    assert.equal(store.size, 0, "Stimme verwirft den Eintrag der Entitaet");
    assert.equal((await qa(env, "/api/qa?eid=azure")).data.questions[1].answers.find((x) => x.id === 2).votes, 1);
  } finally { globalThis.caches = old; }
});

test("/api/edits/pending: ohne Anmeldung leer und ohne D1; angemeldet wie bisher", async () => {
  const { sql, raw, env } = await setup();
  raw.exec("INSERT INTO entity_rev(eid,data,summary,user_id,status,created) VALUES('azure','{\"name\":\"Azure\"}','Text',2,'pending',5)");
  const call = (user) => { const url = new URL("https://api-dub.m365.fm/api/edits/pending?kind=entity&key=azure"); return handleVotes(env, new Request(url), url, url.pathname, user, J); };
  assert.deepEqual((await call(undefined)).data, { kind: "entity", can_vote: false, edits: [] });
  assert.equal(sql.length, 0);
  assert.equal((await call({ id: 1 })).data.edits.length, 1);
  const js = readFileSync(new URL("../../assets/entity.js", import.meta.url), "utf8");
  assert.match(js, /if \(authHint\(\)\) showVotes\(\);/, "Seite fragt nur mit Anmeldehinweis sofort");
  assert.match(js, /if \(!a\[1\]\.j\.loggedIn\) \{ det\.appendChild\(login\(\)\); return; \}\s*showVotes\(\);/, "sonst nach bestaetigter Anmeldung");
});
