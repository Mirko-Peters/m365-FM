// Blog-Top-Listen nach Upvotes: Tag / Woche / Monat / Jahr / evergreen (/api/blog/top)
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { handleBlog } from "../src/blog.js";

const J = (data, status = 200, h = {}) => new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json", ...h } });
async function setup() {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:"), dir = new URL("../migrations/", import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(f, dir), "utf8"));
  const db = { prepare(sql) { let args = []; const o = { bind(...a) { args = a; return o; }, all: async () => ({ results: raw.prepare(sql).all(...args) }), first: async () => raw.prepare(sql).get(...args) ?? null, run: async () => { const r = raw.prepare(sql).run(...args); return { meta: { changes: Number(r.changes) } }; } }; return o; } };
  return { raw, env: { DB: db } };
}
const top = async (env, q) => { const url = new URL("https://x.test/api/blog/top?" + q); const r = await handleBlog(env, new Request(url), url, url.pathname, null, J); return { s: r.status, j: await r.json() }; };

test("Top-Listen: Stimmen im Zeitraum, evergreen zaehlt alle, Sprache filtert", async () => {
  const { raw, env } = await setup(), t = Math.floor(Date.now() / 1000), D = 86400;
  for (const id of [1, 2, 3, 4, 5, 6]) { raw.prepare("INSERT INTO users(id,provider,sub,name,created) VALUES(?,'test',?,?,1)").run(id, "s" + id, "U" + id); }
  raw.prepare("INSERT INTO profiles(user_id,public,handle,updated) VALUES(1,1,'autor',1)").run();
  const post = (id, slug, lang) => raw.prepare("INSERT INTO blog_posts(id,user_id,slug,title,lang,status,created,updated,published) VALUES(?,1,?,?,?, 'live',?,?,?)").run(id, slug, "T-" + slug, lang, t - 400 * D, t, t - 400 * D);
  post(10, "alt-hit", "en"); post(11, "neu-hit", "en"); post(12, "de-post", "de");
  const vote = (post_id, user_id, ago) => raw.prepare("INSERT INTO blog_votes(post_id,user_id,created) VALUES(?,?,?)").run(post_id, user_id, t - ago);
  for (const u of [2, 3, 4, 5]) vote(10, u, 200 * D);   // 4 Stimmen vor ~200 Tagen
  vote(11, 2, 3600); vote(11, 3, 3 * D);               // 1 Stimme heute, 1 vor 3 Tagen
  vote(12, 2, 40 * D);
  const slugs = (r) => r.j.items.map((x) => x.slug);
  assert.deepEqual(slugs(await top(env, "period=day")), ["neu-hit"]);
  assert.equal((await top(env, "period=day")).j.items[0].votes, 1);
  assert.deepEqual(slugs(await top(env, "period=week")), ["neu-hit"]);
  assert.equal((await top(env, "period=week")).j.items[0].votes, 2);
  assert.deepEqual(slugs(await top(env, "period=month")), ["neu-hit"]);
  assert.deepEqual(slugs(await top(env, "period=year")), ["alt-hit", "neu-hit", "de-post"]);
  assert.deepEqual(slugs(await top(env, "period=evergreen")), ["alt-hit", "neu-hit", "de-post"]);
  assert.deepEqual(slugs(await top(env, "period=evergreen&lang=de")), ["de-post"]);
  assert.equal((await top(env, "period=evergreen&limit=1")).j.items.length, 1);
  assert.equal((await top(env, "period=quatsch")).s, 400);
  assert.equal((await top(env, "period=day")).j.items[0].handle, "autor");
});
