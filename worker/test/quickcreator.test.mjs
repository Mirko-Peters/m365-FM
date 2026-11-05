import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { handleQuickCreator, sanitizeHtml } from "../src/quickcreator.js";

async function makeDb() {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:");
  const dir = new URL("../migrations/", import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(f, dir), "utf-8"));
  const db = {
    prepare(sql) {
      let args = [];
      const o = {
        bind(...a) { args = a; return o; },
        all: async () => ({ results: raw.prepare(sql).all(...args) }),
        first: async () => raw.prepare(sql).get(...args) ?? null,
        run: async () => { try { const r = raw.prepare(sql).run(...args); return { meta: { changes: Number(r.changes), last_row_id: Number(r.lastInsertRowid) } }; } catch (e) { if (/duplicate column/i.test(String(e))) throw e; throw e; } },
      };
      return o;
    },
    async batch(stmts) { for (const st of stmts) await st.run(); },
  };
  raw.exec("INSERT INTO users(id,provider,sub,name,created) VALUES(7,'github','7','Mirko',1)");
  raw.exec("INSERT INTO profiles(user_id,handle,public,updated) VALUES(7,'mirko-p',1,1)");
  return { db, raw };
}

const J = (body, status = 200) => ({ status, body });
const body = (extra = {}) => ({
  postId: "qc-1", title: "Understanding Copilot Agents in Microsoft 365", slug: "copilot-agents",
  content: "<h2>Intro</h2><p>" + "Copilot agents help teams. ".repeat(20) + "</p><script>alert(1)</script><p onclick=\"x()\">Text <a href=\"javascript:alert(1)\">bad</a> <a href=\"https://learn.microsoft.com\">ok</a></p><img src=\"https://cdn.example/a.png\" onerror=\"x\"><iframe src=\"https://evil\"></iframe>",
  publishTime: 1748309668000, ...extra,
});
const req = (b, token = "secret-token", method = "POST") => new Request("https://api.example/api/blog/quickcreator", {
  method, headers: { "content-type": "application/json", ...(token ? { authorization: "Bearer " + token } : {}) }, ...(method === "GET" ? {} : { body: JSON.stringify(b) }),
});

test("quickcreator: HTML-Bereinigung entfernt Skripte, Handler, iframes und javascript-Links", () => {
  const h = sanitizeHtml(body().content);
  assert.ok(!/script|onclick|onerror|iframe|javascript:/i.test(h), h);
  assert.match(h, /<a href="https:\/\/learn\.microsoft\.com" rel="noopener">ok<\/a>/);
  assert.match(h, /<img src="https:\/\/cdn\.example\/a\.png" loading="lazy">/);
  assert.match(h, /<h2>Intro<\/h2>/);
});

test("quickcreator: ohne oder mit falschem Token wird abgelehnt, ohne Secret 503", async () => {
  const { db } = await makeDb();
  const url = new URL("https://api.example/api/blog/quickcreator");
  assert.equal((await handleQuickCreator({ DB: db }, req(body()), url, url.pathname, J)).status, 503);
  const env = { DB: db, QUICKCREATOR_TOKEN: "secret-token", SITE: "https://www.m365.fm" };
  assert.equal((await handleQuickCreator(env, req(body(), null), url, url.pathname, J)).status, 401);
  assert.equal((await handleQuickCreator(env, req(body(), "wrong"), url, url.pathname, J)).status, 401);
  assert.equal((await handleQuickCreator(env, req(body(), "secret-token", "GET"), url, url.pathname, J)).status, 405);
});

test("quickcreator: legt Beitrag als pending an, aktualisiert per postId, respektiert Editor-Aenderungen", async () => {
  const { db, raw } = await makeDb();
  const url = new URL("https://api.example/api/blog/quickcreator");
  const env = { DB: db, QUICKCREATOR_TOKEN: "secret-token", SITE: "https://www.m365.fm" };
  const r1 = await handleQuickCreator(env, req(body()), url, url.pathname, J);
  assert.equal(r1.status, 201, JSON.stringify(r1.body));
  assert.equal(r1.body.status, "pending");
  assert.equal(r1.body.url, "https://www.m365.fm/community/u/mirko-p/blog/copilot-agents/");
  const row = raw.prepare("SELECT * FROM blog_posts WHERE id=?").get(r1.body.id);
  assert.equal(row.status, "pending"); assert.equal(row.note, "quickcreator"); assert.equal(row.published, 1748309668);
  assert.ok(!/script/i.test(row.html));

  const same = await handleQuickCreator(env, req(body()), url, url.pathname, J);
  assert.equal(same.body.unchanged, "same_content");

  const upd = await handleQuickCreator(env, req(body({ title: "Understanding Copilot Agents – updated" })), url, url.pathname, J);
  assert.equal(upd.body.updated, true); assert.equal(upd.body.id, r1.body.id);
  assert.equal(raw.prepare("SELECT title FROM blog_posts WHERE id=?").get(r1.body.id).title, "Understanding Copilot Agents – updated");

  raw.prepare("UPDATE blog_posts SET updated=updated+100 WHERE id=?").run(r1.body.id);   // im Editor geaendert
  const ed = await handleQuickCreator(env, req(body({ title: "Overwrite attempt after edit" })), url, url.pathname, J);
  assert.equal(ed.body.unchanged, "edited_on_site");

  const other = await handleQuickCreator(env, req(body({ postId: "qc-2" })), url, url.pathname, J);
  assert.equal(other.status, 201);
  assert.equal(raw.prepare("SELECT slug FROM blog_posts WHERE id=?").get(other.body.id).slug, "copilot-agents-2");
});

test("quickcreator: Pflichtfelder und Sprache werden geprueft", async () => {
  const { db } = await makeDb();
  const url = new URL("https://api.example/api/blog/quickcreator");
  const env = { DB: db, QUICKCREATOR_TOKEN: "secret-token" };
  assert.equal((await handleQuickCreator(env, req({ title: "x" }), url, url.pathname, J)).status, 400);
  assert.equal((await handleQuickCreator(env, req(body({ lang: "xx1" })), url, url.pathname, J)).status, 400);
  const de = new URL("https://api.example/api/blog/quickcreator?lang=de");
  const r = await handleQuickCreator(env, req(body({ postId: "qc-de" })), de, de.pathname, J);
  assert.equal(r.status, 201); assert.match(r.body.url, /\/de\/community\/u\/mirko-p\/blog\//);
});
