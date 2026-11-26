// Lernfortschritt (learnprogress.js, Migration 0056): ganzer Worker gegen eine In-Memory-SQLite mit allen Migrationen.
// Die DB-Huelle zaehlt jedes prepare (D1-Kosten) und jedes Schreiben in learn_progress.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import worker from "../src/index.js";
import { makeSession, RL_SHORT } from "../src/util.js";
import { deleteUserLearn } from "../src/learnquiz.js";
import { mergeStatements } from "../src/identities.js";
import { LP_ID_RX, LP_VID_RX, LP_MAX, LP_MAX_STATE, LP_AGE_MAX, applyChanges, normState, purgeLearnProgress, LP_KEEP_MS, unionState, cleanHeading } from "../src/learnprogress.js";

const PATH = "manufacturing-excellence";
const R = "/api/learn/progress";

async function setup(extra = {}) {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:");
  const dir = new URL("../migrations/", import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(f, dir), "utf-8"));
  const sql = [], writes = [];
  const db = {
    prepare(q) {
      sql.push(q);
      const st = raw.prepare(q); let a = [];
      const o = {
        bind(...x) { a = x; return o; },
        all: async () => ({ results: st.all(...a) }),
        first: async () => { const r = st.get(...a) ?? null; if (/^INSERT INTO learn_progress/.test(q) && r) writes.push(q); return r; },
        run: async () => { const r = st.run(...a); if (/learn_progress/.test(q) && /^(INSERT|UPDATE|DELETE)/.test(q) && r.changes) writes.push(q); return { meta: { changes: Number(r.changes), last_row_id: Number(r.lastInsertRowid) } }; },
      };
      return o;
    },
    batch: async (l) => { for (const s of l) await s.run(); return []; },
  };
  const now = Math.floor(Date.now() / 1000);
  raw.prepare("INSERT INTO users(id,provider,sub,name,created) VALUES (1,'github','ada','Ada',?),(2,'github','bob','Bob',?)").run(now, now);
  const env = { DB: db, SITE: "https://www.m365.fm", API: "https://api-dub.m365.fm", SESSION_SECRET: "test-secret", ADMIN_SUBS: "", LEARN_PROGRESS_SYNC: "1", ...extra };
  const s = { ada: `m365s=${await makeSession(env, 1)}`, bob: `m365s=${await makeSession(env, 2)}` };
  return { env, raw, s, sql, writes };
}

async function call(env, path, { method = "GET", body, cookie, headers = {}, rawBody } = {}) {
  const h = { origin: "https://www.m365.fm", ...(method !== "GET" ? { "x-requested-with": "m365", "content-type": "application/json" } : {}), ...(cookie ? { cookie } : {}), ...headers };
  const res = await worker.fetch(new Request("https://api-dub.m365.fm" + path, { method, headers: h, body: rawBody !== undefined ? rawBody : body === undefined ? undefined : JSON.stringify(body) }), env, { waitUntil() {} });
  const text = await res.text();
  let data = null; try { data = JSON.parse(text); } catch { /* kein JSON */ }
  return { status: res.status, data, text, headers: res.headers };
}
const get = (env, cookie, path = PATH) => call(env, `${R}?path=${encodeURIComponent(path)}`, { cookie });
const post = (env, cookie, body) => call(env, R, { method: "POST", cookie, body: { path: PATH, ep: 0, ...body } });
const del = (env, cookie, path = PATH) => call(env, `${R}?path=${encodeURIComponent(path)}`, { method: "DELETE", cookie });

test("Gleichlauf: ID-, Video- und Pfadregel wie learnquiz.js PATH_RX und index.js VID; Route steht als Literal in learnquiz.js", () => {
  const lq = readFileSync(new URL("../src/learnquiz.js", import.meta.url), "utf8"), ix = readFileSync(new URL("../src/index.js", import.meta.url), "utf8");
  assert.ok(lq.includes(`const PATH_RX = ${LP_ID_RX};`), "PATH_RX = LP_ID_RX");
  assert.ok(ix.includes(`const VID = ${LP_VID_RX};`), "VID = LP_VID_RX");
  assert.ok(lq.includes('path === "/api/learn/progress"'), "tools/mcp_routes.mjs findet die Route");
  assert.ok(RL_SHORT.includes("learnp:"));
  const toml = readFileSync(new URL("../wrangler.toml", import.meta.url), "utf8");
  assert.match(toml, /\[\[ratelimits\]\]\s*\nname = "RL_LEARN"\s*\nnamespace_id = "1002"\s*\nsimple = \{ limit = 30, period = 60 \}/);
  const [live, staging] = toml.split("[env.staging]");
  assert.match(live, /^LEARN_PROGRESS_SYNC = "1"/m, "live [vars]");
  assert.match(staging.split("[env.staging.vars]")[1].split("[env.staging.observability]")[0], /^LEARN_PROGRESS_SYNC = "1"/m, "staging erbt [vars] nicht");
  const cov = JSON.parse(readFileSync(new URL("../mcp_coverage.json", import.meta.url), "utf8")).routes;
  assert.ok(cov[R]?.skip);
});

test("Schalter: Var fehlt oder '0' -> 404 off ohne D1-Abfrage (alle Methoden)", async () => {
  for (const v of [undefined, "0", ""]) {
    const { env, sql } = await setup({ LEARN_PROGRESS_SYNC: v });
    for (const m of ["GET", "POST", "DELETE"]) {
      const r = m === "GET" ? await get(env) : m === "POST" ? await post(env, undefined, {}) : await del(env);
      assert.equal(r.status, 404, `${m} ${v}`); assert.deepEqual(r.data, { error: "off" });
    }
    assert.equal(sql.length, 0, "keine D1-Abfrage");
  }
});

test("Gast: GET ohne Cookie -> 401 mit 0 vorbereiteten Statements; CORS mit Credentials fuer die eigene Seite", async () => {
  const { env, sql } = await setup();
  const r = await get(env);
  assert.equal(r.status, 401); assert.deepEqual(r.data, { error: "login" });
  assert.equal(sql.length, 0);
  assert.equal(r.headers.get("access-control-allow-origin"), "https://www.m365.fm");
  assert.equal(r.headers.get("access-control-allow-credentials"), "true");
  assert.equal((await post(env, undefined, { set: [["g", "kaizen"]] })).status, 401);
  assert.equal((await del(env)).status, 401);
  assert.equal(sql.length, 0);
});

test("Methoden, Header, Pfad: POST ohne x-requested-with 400, PUT 405, falscher/unbekannter Pfad 400", async () => {
  const { env, s, writes } = await setup();
  const noHdr = await call(env, R, { method: "POST", cookie: s.ada, body: { path: PATH }, headers: { "x-requested-with": "" } });
  assert.equal(noHdr.status, 400);
  assert.equal((await call(env, R, { method: "PUT", cookie: s.ada, body: { path: PATH } })).status, 405);
  assert.equal((await call(env, R, { method: "PATCH", cookie: s.ada, body: { path: PATH } })).status, 405);
  for (const p of ["", "Manufacturing", "../x", "other-path", "a"]) assert.equal((await get(env, s.ada, p)).status, 400, p);
  assert.equal((await post(env, s.ada, { path: "other-path" })).status, 400);
  assert.equal((await call(env, R, { method: "POST", cookie: s.ada, rawBody: "{kaputt" })).status, 400);
  assert.equal((await call(env, R, { method: "POST", cookie: s.ada, rawBody: "[1,2]" })).status, 400);
  assert.equal((await del(env, s.ada, "x y")).status, 400);
  assert.equal(writes.length, 0);
});

test("Groesse: content-length ueber 16 KB -> 413, ebenso ein Body ueber 16 KB ohne passende Angabe", async () => {
  const { env, s, writes } = await setup();
  const big = JSON.stringify({ path: PATH, ep: 0, set: [], pad: "x".repeat(17000) });
  assert.equal((await call(env, R, { method: "POST", cookie: s.ada, rawBody: "{}", headers: { "content-length": "20000" } })).status, 413);
  const stream = new ReadableStream({ start(c) { c.enqueue(new TextEncoder().encode(big)); c.close(); } });
  const res = await worker.fetch(new Request("https://api-dub.m365.fm" + R, { method: "POST", duplex: "half", body: stream, headers: { origin: "https://www.m365.fm", "x-requested-with": "m365", "content-type": "application/json", cookie: s.ada } }), env, { waitUntil() {} });
  assert.equal(res.status, 413);
  assert.equal((await call(env, R, { method: "POST", cookie: s.ada, rawBody: big })).status, 413);
  // knapp darunter geht
  const ok = JSON.stringify({ path: PATH, ep: 0, set: [["g", "kaizen"]], pad: "x".repeat(16000) });
  assert.equal((await call(env, R, { method: "POST", cookie: s.ada, rawBody: ok })).status, 200);
  assert.equal(writes.length, 1);
});

test("GET ohne Zeile: leerer Stand mit g/c/v, uid, ep 0, updated 0, now", async () => {
  const { env, s } = await setup();
  const r = await get(env, s.ada);
  assert.equal(r.status, 200);
  assert.deepEqual({ ...r.data, now: 0 }, { uid: 1, ep: 0, updated: 0, now: 0, state: { g: {}, c: {}, v: {} } });
  assert.ok(Math.abs(r.data.now - Date.now() / 1000) < 5);
});

test("Pruefung je Eintrag: ungueltige ids, vids, Anker, Sprachen und pc werden still verworfen, gueltige bleiben; Unicode-Anker bis 160 Zeichen", async () => {
  const { env, s } = await setup();
  const de160 = "ä".repeat(80) + "wertstrom-analyse-" + "ö".repeat(62), ru160 = "ж".repeat(160), long = "ж".repeat(161);
  assert.equal([...de160].length, 160);
  const r = await post(env, s.ada, {
    set: [["g", "lean-basics"], ["x", "kaizen"], ["g", "Kaizen!"], ["g", 5], "g", ["c", "5s-audit"]],
    vid: ["ZY12nBEY2qc", "bad id", "x", 7, "AXT4Qac8mQ8"],
    pos: [
      { k: "g", id: "lean-basics", a: de160, h: "Wert<b>strom</b>  analyse", l: "de", pc: 42, age: 10 },
      { k: "c", id: "5s-audit", a: ru160, h: "Аудит", l: "ru", pc: 101, age: 5 },
      { k: "g", id: "oee", a: long, h: "x".repeat(200), l: "xx", pc: "7", age: 1 },
      { k: "z", id: "oee", a: "abc", age: 1 }, { k: "g", id: "<script>", age: 1 }, null, "x",
    ],
  });
  assert.equal(r.status, 200);
  const st = r.data.state, t = r.data.now;
  assert.deepEqual(Object.keys(st.g).sort(), ["lean-basics", "oee"]);
  assert.deepEqual(Object.keys(st.c), ["5s-audit"]);
  assert.deepEqual(Object.keys(st.v).sort(), ["AXT4Qac8mQ8", "ZY12nBEY2qc"]);
  assert.equal(st.g["lean-basics"].r, 1); assert.equal(st.c["5s-audit"].r, 1); assert.equal(st.g.oee.r, 0);
  assert.equal(st.g["lean-basics"].a, de160); assert.equal(st.g["lean-basics"].h, "Wertbstrom/b analyse"); assert.equal(st.g["lean-basics"].l, "de"); assert.equal(st.g["lean-basics"].pc, 42);
  assert.equal(st.c["5s-audit"].a, ru160); assert.equal(st.c["5s-audit"].pc, undefined, "pc 101 verworfen"); assert.equal(st.c["5s-audit"].l, "ru");
  assert.equal(st.g.oee.a, undefined, "161 Zeichen: ohne Anker"); assert.equal(st.g.oee.h.length, 80); assert.equal(st.g.oee.l, undefined); assert.equal(st.g.oee.pc, 7);
  assert.ok(Math.abs(st.g["lean-basics"].at - (t - 10)) <= 1 && Math.abs(st.g["lean-basics"].rt - t) <= 1);
});

test("Zeiten: age negativ/riesig wird gekappt, absolute at/t/rt vom Client werden ignoriert", async () => {
  const { env, s } = await setup();
  const r = await post(env, s.ada, { set: [["g", "kaizen"]], pos: [
    { k: "g", id: "kaizen", a: "a1", age: -500, at: 1, t: 1, rt: 1 },
    { k: "g", id: "tpm", a: "a2", age: 10 ** 12, at: 9e12 },
    { k: "g", id: "smed", a: "a3", age: "abc" },
  ] });
  const st = r.data.state, t = r.data.now;
  assert.ok(Math.abs(st.g.kaizen.at - t) <= 1, "age < 0 -> 0");
  assert.ok(Math.abs(st.g.kaizen.rt - t) <= 1, "rt vom Server");
  assert.ok(Math.abs(st.g.tpm.at - (t - LP_AGE_MAX)) <= 1, "age gekappt auf 30 Tage");
  assert.ok(Math.abs(st.g.smed.at - t) <= 1);
  assert.ok(!JSON.stringify(r.data).includes("9000000000000"));
});

test("Vereinigung: set/vid per ODER, unset nur ausdruecklich, Lesestelle: juengste nach Serverzeit gewinnt", async () => {
  const { env, s } = await setup();
  let r = await post(env, s.ada, { set: [["g", "kaizen"], ["g", "tpm"]], vid: ["ZY12nBEY2qc"], pos: [{ k: "g", id: "oee", a: "neu", h: "Neu", l: "de", pc: 30, age: 60 }] });
  const v1 = r.data.state.v.ZY12nBEY2qc;
  // zweites Geraet: anderes Set, gleiches Video, aeltere Lesestelle -> bleibt "neu"
  r = await post(env, s.ada, { set: [["c", "5s-audit"]], vid: ["ZY12nBEY2qc", "AXT4Qac8mQ8"], pos: [{ k: "g", id: "oee", a: "alt", h: "Alt", age: 3600 }] });
  const st = r.data.state;
  assert.deepEqual(Object.keys(st.g).filter((k) => st.g[k].r).sort(), ["kaizen", "tpm"]);
  assert.equal(st.c["5s-audit"].r, 1);
  assert.equal(st.v.ZY12nBEY2qc, v1, "Videozeit bleibt die erste");
  assert.ok(st.v.AXT4Qac8mQ8);
  assert.equal(st.g.oee.a, "neu"); assert.equal(st.g.oee.h, "Neu"); assert.equal(st.g.oee.pc, 30);
  // juengere Lesestelle ersetzt die ganze Lesestelle (Anker, Titel, Sprache, Anteil)
  r = await post(env, s.ada, { pos: [{ k: "g", id: "oee", a: "juenger", age: 0 }] });
  assert.deepEqual({ ...r.data.state.g.oee, at: 0 }, { r: 0, a: "juenger", at: 0 });
  // unset
  r = await post(env, s.ada, { unset: [["g", "tpm"]] });
  assert.equal(r.data.state.g.tpm.r, 0); assert.equal(r.data.state.g.kaizen.r, 1);
  // set und unset derselben id in einem POST: unset gilt
  r = await post(env, s.ada, { set: [["g", "kaizen"]], unset: [["g", "kaizen"]] });
  assert.equal(r.data.state.g.kaizen.r, 0);
  // GET liefert denselben Stand
  const g = await get(env, s.ada);
  assert.deepEqual(g.data.state, r.data.state); assert.equal(g.data.updated, r.data.updated);
});

test("Kein Schreiben ohne Aenderung; updated steigt nur bei Aenderung", async () => {
  const { env, s, writes } = await setup();
  let r = await post(env, s.ada, {});
  assert.equal(r.status, 200); assert.equal(writes.length, 0, "leerer POST ohne Zeile");
  r = await post(env, s.ada, { unset: [["g", "kaizen"]] });
  assert.equal(writes.length, 0, "unset eines nie gelesenen Eintrags");
  r = await post(env, s.ada, { set: [["g", "kaizen"]], vid: ["ZY12nBEY2qc"] });
  assert.equal(writes.length, 1); const u1 = r.data.updated; assert.ok(u1 > 0);
  r = await post(env, s.ada, { set: [["g", "kaizen"]], vid: ["ZY12nBEY2qc"] });
  assert.equal(writes.length, 1, "dieselben Eintraege nochmal"); assert.equal(r.data.updated, u1);
  r = await post(env, s.ada, { pos: [{ k: "g", id: "kaizen", a: "x", age: 0 }] });
  assert.equal(writes.length, 2); assert.ok(r.data.updated > u1);
  r = await post(env, s.ada, { pos: [{ k: "g", id: "kaizen", a: "y", age: 999 }] });
  assert.equal(writes.length, 2, "aeltere Lesestelle aendert nichts");
});

test("Epoche: falsche ep -> 409 mit Serverstand ohne Schreiben; init:1 vereinigt trotzdem; DELETE setzt ep neu", async () => {
  const { env, s, writes, raw } = await setup();
  await post(env, s.ada, { set: [["g", "kaizen"]] });
  const d = await del(env, s.ada);
  assert.equal(d.status, 200); assert.ok(d.data.ep > 0); assert.deepEqual(d.data.state, { g: {}, c: {}, v: {} });
  assert.equal(raw.prepare("SELECT state FROM learn_progress WHERE user_id=1").get().state, "{}", "Zeile bleibt als leerer Stand");
  const n = writes.length;
  const c = await post(env, s.ada, { ep: 0, set: [["g", "tpm"]] });
  assert.equal(c.status, 409); assert.equal(c.data.ep, d.data.ep); assert.deepEqual(c.data.state, { g: {}, c: {}, v: {} }); assert.equal(c.data.uid, 1);
  assert.equal(writes.length, n, "409 schreibt nicht");
  const i = await post(env, s.ada, { ep: 0, init: 1, set: [["g", "tpm"]] });
  assert.equal(i.status, 200); assert.equal(i.data.ep, d.data.ep); assert.equal(i.data.state.g.tpm.r, 1);
  const ok = await post(env, s.ada, { ep: d.data.ep, set: [["g", "oee"]] });
  assert.equal(ok.status, 200);
  // zweites Zuruecksetzen in derselben Sekunde: ep trotzdem neu
  const d2 = await del(env, s.ada);
  assert.ok(d2.data.ep > d.data.ep); assert.ok(d2.data.updated > ok.data.updated);
  assert.equal((await post(env, s.ada, { ep: d.data.ep, set: [["g", "oee"]] })).status, 409);
  // DELETE ohne Zeile legt den leeren Stand an
  const b = await del(env, s.bob);
  assert.equal(b.status, 200); assert.ok(b.data.ep > 0);
});

test("Kappung: hoechstens 60 g, 60 c, 100 v je Stand, Listen je POST gekuerzt, Stand hoechstens 24 KB (aelteste Anker/Titel zuerst weg)", async () => {
  const { env, s } = await setup();
  const ids = (p, n) => Array.from({ length: n }, (_, i) => `${p}-${String(i).padStart(3, "0")}`);
  let r = await post(env, s.ada, { set: [...ids("g", 70).map((x) => ["g", x]), ...ids("c", 50).map((x) => ["c", x])], vid: ids("vid", 120) });
  assert.equal(Object.keys(r.data.state.g).length, 60, "set hoechstens 120 Paare, g hoechstens 60");
  assert.equal(Object.keys(r.data.state.c).length, 50);
  assert.equal(Object.keys(r.data.state.v).length, 100);
  r = await post(env, s.ada, { set: ids("c", 70).map((x) => ["c", x]), vid: ids("viz", 5) });
  assert.equal(Object.keys(r.data.state.c).length, LP_MAX.c); assert.equal(Object.keys(r.data.state.v).length, LP_MAX.v);
  // Groesse direkt an applyChanges: 120 Eintraege mit langem Anker und Titel
  const a = "ж".repeat(160), h = "ж".repeat(80);
  const pos = [...ids("g", 60).map((id, i) => ({ k: "g", id, a, h, age: 1000 - i })), ...ids("c", 60).map((id, i) => ({ k: "c", id, a, h, age: 500 - i }))];
  let st = normState({});
  st = applyChanges(st, { pos: pos.slice(0, 60) }, 10000);
  st = applyChanges(st, { pos: pos.slice(60) }, 10000);
  const size = new TextEncoder().encode(JSON.stringify(st)).length;
  assert.ok(size <= LP_MAX_STATE, `Stand ${size} Bytes`);
  assert.equal(st.g["g-000"].a, undefined, "aelteste zuerst ohne Anker"); assert.equal(st.c["c-059"].a, a, "juengste behalten ihren Anker");
  assert.ok(st.g["g-000"].at, "Lesestelle selbst bleibt");
});

test("Ratenlimit: Bindungsattrappe (kein D1) und D1-Rueckfall -> 429", async () => {
  const keys = [];
  let allow = true;
  const { env, s, raw, sql } = await setup({ RL_LEARN: { async limit({ key }) { keys.push(key); return { success: allow }; } } });
  assert.equal((await get(env, s.ada)).status, 200);
  assert.deepEqual(keys, ["learnp:1"]);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM ratelimit").get().n, 0, "mit Bindung keine D1-Zeile");
  assert.ok(!sql.some((q) => /ratelimit/.test(q)));
  allow = false;
  assert.equal((await get(env, s.ada)).status, 429);
  assert.equal((await post(env, s.ada, { set: [["g", "kaizen"]] })).status, 429);
  // Bindung gestoert -> D1
  const warn = console.warn; console.warn = () => {};
  try {
    const broken = await setup({ RL_LEARN: { async limit() { throw new Error("down"); } } });
    assert.equal((await get(broken.env, broken.s.ada)).status, 200);
    assert.equal(broken.raw.prepare("SELECT n FROM ratelimit WHERE k='learnp:1'").get().n, 1);
  } finally { console.warn = warn; }
  // ohne Bindung: 30 je 60 s, dann 429 (je Nutzer)
  const d1 = await setup();
  for (let i = 0; i < 30; i++) assert.equal((await get(d1.env, d1.s.ada)).status, 200, `Anfrage ${i + 1}`);
  assert.equal((await get(d1.env, d1.s.ada)).status, 429);
  assert.equal((await del(d1.env, d1.s.ada)).status, 429);
  assert.equal((await get(d1.env, d1.s.bob)).status, 200, "anderer Nutzer eigenes Fenster");
});

test("Optimistische Sperre: paralleles Schreiben dazwischen -> neu lesen und zusammenfuehren; dauerhaft gestoert -> 503", async () => {
  const { env, s, raw } = await setup();
  await post(env, s.ada, { set: [["g", "kaizen"]] });
  // Huelle: vor dem ersten Schreibversuch schreibt "ein anderes Geraet"
  const inner = env.DB; let hits = 0, always = false;
  env.DB = { ...inner, prepare(q) {
    const st = inner.prepare(q);
    if (!/^INSERT INTO learn_progress\(user_id,path,state,ep,updated\) VALUES\(\?,\?,\?,\?,\?\)/.test(q)) return st;
    const o = { bind(...a) { st.bind(...a); return o; }, run: async () => { if (hits++ === 0 || always) raw.prepare("UPDATE learn_progress SET state=?, updated=updated+1 WHERE user_id=1").run(JSON.stringify({ g: { kaizen: { r: 1, rt: 5 }, tpm: { r: 1, rt: 5 } } })); return st.run(); } };
    return o;
  } };
  let r = await post(env, s.ada, { set: [["g", "oee"]] });
  assert.equal(r.status, 200);
  assert.deepEqual(Object.keys(r.data.state.g).sort(), ["kaizen", "oee", "tpm"], "fremdes Schreiben bleibt erhalten");
  always = true;
  r = await post(env, s.ada, { set: [["g", "smed"]] });
  assert.equal(r.status, 503); assert.deepEqual(r.data, { error: "busy" });
});

test("Konto: deleteUserLearn loescht die Zeile; DELETE /api/me entfernt sie samt zusammengefuehrter Konten; Zusammenfuehren mit keepT", async () => {
  const { env, s, raw } = await setup();
  await post(env, s.ada, { set: [["g", "kaizen"]] });
  await post(env, s.bob, { set: [["g", "tpm"]] });
  await deleteUserLearn(env.DB, 2);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM learn_progress WHERE user_id=2").get().n, 0);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM learn_progress WHERE user_id=1").get().n, 1);

  // S=2 -> T=1: T hat schon eine Zeile -> Vereinigung in der Zeile von T (ep von T bleibt), die von S bleibt am stillgelegten S
  await post(env, s.bob, { set: [["g", "tpm"]], vid: ["ZY12nBEY2qc"] });
  raw.prepare("INSERT INTO learn_progress(user_id,path,state,ep,updated) VALUES (2,'other-path','{}',0,1)").run();
  const ep1 = raw.prepare("SELECT ep FROM learn_progress WHERE user_id=1").get().ep;
  for (const st of await mergeStatements(env.DB, 2, 1)) await st.run();
  raw.prepare("UPDATE users SET banned=2, merged_into=1 WHERE id=2").run();
  const rows = raw.prepare("SELECT user_id,path,state,ep FROM learn_progress ORDER BY user_id,path").all().map((x) => ({ ...x }));
  assert.deepEqual(rows.map((x) => [x.user_id, x.path]), [[1, "manufacturing-excellence"], [1, "other-path"], [2, "manufacturing-excellence"]]);
  assert.deepEqual(Object.keys(JSON.parse(rows[0].state).g).sort(), ["kaizen", "tpm"], "gelesen per ODER");
  assert.ok(JSON.parse(rows[0].state).v.ZY12nBEY2qc, "geoeffnet per ODER");
  assert.equal(rows[0].ep, ep1);

  // T ohne Zeile -> T uebernimmt die Zeile von S
  raw.prepare("INSERT INTO users(id,provider,sub,name,created) VALUES (3,'github','cy','Cy',1),(4,'github','di','Di',1)").run();
  raw.prepare("INSERT INTO learn_progress(user_id,path,state,ep,updated) VALUES (3,?,'{\"g\":{\"oee\":{\"r\":1}}}',7,1)").run(PATH);
  for (const st of await mergeStatements(env.DB, 3, 4)) await st.run();
  assert.deepEqual({ ...raw.prepare("SELECT user_id,ep FROM learn_progress WHERE state LIKE '%oee%'").get() }, { user_id: 4, ep: 0 }, "uebernommen mit ep 0 (Geraete von T kennen nur ep 0)");

  // Kontoloeschung von 1 entfernt auch die Zeilen des stillgelegten Kontos 2
  const r = await call(env, "/api/me", { method: "DELETE", cookie: s.ada });
  assert.equal(r.status, 200);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM learn_progress WHERE user_id IN (1,2)").get().n, 0);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM learn_progress WHERE user_id=4").get().n, 1, "fremde Konten bleiben");
});

test("Zusammenfuehren (Endpruefung B1): Schreiben von T zwischen Lesen und Batch bleibt erhalten (optimistische Sperre auf updated)", async () => {
  const { env, raw, s } = await setup();
  await post(env, s.ada, { set: [["g", "kaizen"]] });
  await post(env, s.bob, { set: [["g", "tpm"]] });
  const st = await mergeStatements(env.DB, 2, 1);   // liest learn_progress beider Konten
  const r = await post(env, s.ada, { set: [["g", "oee"]] });   // ein Geraet von T schreibt dazwischen
  assert.equal(r.status, 200);
  for (const x of st) await x.run();
  const g = Object.keys(JSON.parse(raw.prepare("SELECT state FROM learn_progress WHERE user_id=1").get().state).g).sort();
  assert.ok(g.includes("oee"), "Schreiben von T geht nicht verloren: " + g.join(","));
  assert.ok(g.includes("kaizen"));
  assert.ok(JSON.parse(raw.prepare("SELECT state FROM learn_progress WHERE user_id=2").get().state).g.tpm, "Zeile von S bleibt am stillgelegten S");
  // ohne Schreiben dazwischen: Vereinigung wie bisher
  for (const x of await mergeStatements(env.DB, 2, 1)) await x.run();
  assert.deepEqual(Object.keys(JSON.parse(raw.prepare("SELECT state FROM learn_progress WHERE user_id=1").get().state).g).sort(), ["kaizen", "oee", "tpm"]);
});

test("Zusammenfuehren (Endpruefung B2): T uebernimmt eine Zeile von S mit Reset-Epoche -> ep 0, POST eines Geraets von T (ep 0) kein 409", async () => {
  const { env, raw, s } = await setup();
  const g0 = await get(env, s.ada);
  assert.equal(g0.data.ep, 0, "T ohne Zeile: Geraet kennt ep 0");
  await post(env, s.bob, { set: [["g", "tpm"]] });
  await del(env, s.bob);
  const ep = raw.prepare("SELECT ep FROM learn_progress WHERE user_id=2").get().ep;
  assert.ok(ep > 0);
  await post(env, s.bob, { ep, u: 2, set: [["g", "tpm"]] });
  raw.prepare("INSERT INTO learn_progress(user_id,path,state,ep,updated) VALUES (1,'other-path','{}',5,1),(2,'other-path','{}',9,1)").run();
  for (const x of await mergeStatements(env.DB, 2, 1)) await x.run();
  assert.deepEqual(raw.prepare("SELECT user_id,path,ep FROM learn_progress ORDER BY user_id,path").all().map((x) => [x.user_id, x.path, x.ep]),
    [[1, PATH, 0], [1, "other-path", 5], [2, "other-path", 9]], "nur die uebernommene Zeile bekommt ep 0; Zeilen von T und die bei S verbleibenden behalten ihre ep");
  const r = await post(env, s.ada, { ep: 0, u: 1, set: [["g", "oee"]] });
  assert.equal(r.status, 200, "kein 409 ep"); assert.deepEqual(Object.keys(r.data.state.g).sort(), ["oee", "tpm"]);
});

test("Aufraeumen: am 1. bis 3. des Monats (ausgefallener Lauf wird nachgeholt), Zeilen ohne Aenderung seit 24 Monaten; im Tageslauf eingetragen", async () => {
  const { env, raw } = await setup();
  const at = Date.parse("2026-12-02T06:00:00Z");
  raw.prepare("INSERT INTO learn_progress(user_id,path,state,ep,updated) VALUES (1,'a-path','{}',0,?),(2,'a-path','{}',0,?)").run(at - LP_KEEP_MS - 1000, at - LP_KEEP_MS + 86400000);
  assert.deepEqual(await purgeLearnProgress(env.DB, Date.parse("2026-12-04T06:00:00Z")), { skipped: "nur am 1. bis 3. des Monats" });
  assert.deepEqual(await purgeLearnProgress(env.DB, at), { deleted: 1 }, "am 2. (Lauf vom 1. ausgefallen)");
  assert.deepEqual(await purgeLearnProgress(env.DB, Date.parse("2026-12-03T06:00:00Z")), { deleted: 0 }, "Wiederholung loescht nichts mehr");
  assert.deepEqual(raw.prepare("SELECT user_id FROM learn_progress").all().map((x) => x.user_id), [2]);
  assert.equal(LP_KEEP_MS, 730 * 86400 * 1000, "24 Monate");
  const ix = readFileSync(new URL("../src/index.js", import.meta.url), "utf8");
  const daily = ix.slice(ix.indexOf("if (daily) {"), ix.indexOf("T(\"syncExpertise\""));
  assert.match(daily, /T\("purgeLearnProgress", \(env\) => purgeLearnProgress\(env\.DB, scheduledAt\)\)/);
});

test("Cron: Tageslauf am 1. loescht alte Zeilen, an anderen Tagen nicht", async () => {
  const { env, raw } = await setup();
  const old = globalThis.fetch, err = console.error, log = console.log, warn = console.warn;
  globalThis.fetch = async () => new Response("{}", { status: 404 }); console.error = () => {}; console.log = () => {}; console.warn = () => {};
  const run = async (at) => { const w = []; await worker.scheduled({ cron: "0 6 * * *", scheduledTime: Date.parse(at) }, env, { waitUntil: (x) => w.push(x) }); await Promise.allSettled(w); await Promise.allSettled(w); };
  try {
    raw.prepare("INSERT INTO learn_progress(user_id,path,state,ep,updated) VALUES (1,'a-path','{}',0,1)").run();
    await run("2026-11-10T06:00:00Z");
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM learn_progress").get().n, 1);
    await run("2026-12-01T06:00:00Z");
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM learn_progress").get().n, 0);
  } finally { globalThis.fetch = old; console.error = err; console.log = log; console.warn = warn; }
});

test("Kosten: mit RL_LEARN-Bindung kostet GET ausser memberOf genau 1 Lesen, DELETE genau 1 Schreiben", async () => {
  const { env, s, sql } = await setup({ RL_LEARN: { async limit() { return { success: true }; } } });
  await get(env, s.ada);
  assert.deepEqual(sql.filter((q) => !/FROM users WHERE id=|FROM programs/.test(q)), ["SELECT state,ep,updated FROM learn_progress WHERE user_id=? AND path=?"]);
  sql.length = 0;
  await del(env, s.ada);
  assert.equal(sql.filter((q) => /learn_progress/.test(q)).length, 1, "DELETE: ein Schreiben, kein Lesen");
});

test("Konto-Pruefung: POST mit u eines anderen Kontos -> 409 uid mit dem Stand des angemeldeten Kontos, ohne Schreiben (auch mit init:1); DELETE ebenso", async () => {
  const { env, s, raw, writes } = await setup();
  await post(env, s.bob, { set: [["g", "tpm"]] });
  const w0 = writes.length;
  let r = await post(env, s.bob, { u: 1, set: [["g", "geheim-a"]], vid: ["AAAAAAAAAAA"] });
  assert.equal(r.status, 409); assert.equal(r.data.error, "uid"); assert.equal(r.data.uid, 2);
  assert.deepEqual(Object.keys(r.data.state.g), ["tpm"], "Stand von Konto 2 zum Ersetzen");
  r = await post(env, s.bob, { u: 1, init: 1, set: [["g", "geheim-a"]] });
  assert.equal(r.status, 409, "init hebt die Konto-Pruefung nicht auf");
  r = await post(env, s.bob, { u: "1", set: [["g", "geheim-a"]] });
  assert.equal(r.status, 409, "auch als Zeichenkette");
  assert.equal(writes.length, w0);
  assert.doesNotMatch(raw.prepare("SELECT state FROM learn_progress WHERE user_id=2").get().state, /geheim/);
  r = await post(env, s.bob, { u: 2, set: [["g", "oee"]] });
  assert.equal(r.status, 200, "eigenes Konto"); assert.deepEqual(Object.keys(r.data.state.g).sort(), ["oee", "tpm"]);
  r = await call(env, `${R}?path=${PATH}&u=1`, { method: "DELETE", cookie: s.bob });
  assert.equal(r.status, 409); assert.equal(r.data.error, "uid"); assert.deepEqual(Object.keys(r.data.state.g).sort(), ["oee", "tpm"], "nichts geloescht");
  r = await call(env, `${R}?path=${PATH}&u=2`, { method: "DELETE", cookie: s.bob });
  assert.equal(r.status, 200); assert.deepEqual(r.data.state.g, {});
});

test("unionState: ODER fuer gelesen und Videos, juengste Lesestelle, Grenzen; cleanHeading kappt nach Codepunkten", () => {
  const a = { g: { oee: { r: 0, a: "alt", at: 10 }, tpm: { r: 1, rt: 3 } }, v: { ZY12nBEY2qc: 50 } };
  const b = { g: { oee: { r: 1, rt: 7, a: "neu", h: "Neu", l: "de", pc: 40, at: 20 }, kaizen: { r: 1, rt: 2 } }, c: { smed: { r: 1 } }, v: { ZY12nBEY2qc: 30, AXT4Qac8mQ8: 9 } };
  const u = unionState(a, b);
  assert.deepEqual(u.g.oee, { r: 1, rt: 7, a: "neu", h: "Neu", l: "de", pc: 40, at: 20 });
  assert.equal(u.g.tpm.r, 1); assert.equal(u.g.kaizen.r, 1); assert.equal(u.c.smed.r, 1);
  assert.deepEqual(u.v, { ZY12nBEY2qc: 30, AXT4Qac8mQ8: 9 });
  const older = unionState({ g: { oee: { r: 1, a: "neu", at: 20 } } }, { g: { oee: { r: 0, a: "alt", at: 10 } } });
  assert.deepEqual(older.g.oee, { r: 1, a: "neu", at: 20 }, "aeltere Lesestelle und ungelesen von S aendern nichts");
  const full = { g: Object.fromEntries(Array.from({ length: LP_MAX.g }, (_, i) => [`t${i}x`, { r: 1 }])) };
  assert.equal(Object.keys(unionState(full, { g: { extra: { r: 1 } } }).g).length, LP_MAX.g);
  const h = "a".repeat(79) + "😀z";
  assert.equal(cleanHeading(h), "a".repeat(79) + "😀", "kein halbes Emoji");
});
