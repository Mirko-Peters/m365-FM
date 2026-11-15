// Branche und Job/Rolle als Entitaeten: Neu anlegen (Auth, Laenge, Dubletten ueber normalisierten Namen, Moderation), Auswahl im Mitglieds- und Firmenprofil, oeffentlicher Export
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { handleProfiles, refreshProfilesExport } from "../src/profiles.js";
import { handleEntity } from "../src/entities.js";
import { normName } from "../src/kinds.js";

const J = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json" } });
const entities = [
  { id: "manufacturing", type: "industry", name: "Manufacturing", aliases: ["Fertigung"], desc: { en: "x", de: "y" } },
  { id: "mechanical-engineering", type: "industry", name: "Mechanical engineering", aliases: ["Maschinenbau"], desc: { en: "x", de: "y" } },
  { id: "marketing-manager", type: "job", name: "Marketing manager", aliases: ["Marketingmanager"], desc: { en: "x", de: "y" } },
  { id: "ifakt", type: "org", name: "iFAKT GmbH", aliases: ["iFAKT"], desc: { en: "x", de: "y" } },
];
async function setup() {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:"), dir = new URL("../migrations/", import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(f, dir), "utf8"));
  const db = {
    prepare(sql) {
      let args = [];
      const o = {
        bind(...a) { args = a; return o; },
        all: async () => ({ results: raw.prepare(sql).all(...args) }),
        first: async () => raw.prepare(sql).get(...args) ?? null,
        run: async () => { const r = raw.prepare(sql).run(...args); return { meta: { changes: Number(r.changes), last_row_id: Number(r.lastInsertRowid) } }; },
      };
      return o;
    },
    async batch(stmts) { for (const s of stmts) await s.run(); },
  };
  return { raw, env: { DB: db, SITE: "https://site.test", API: "https://api.test" } };
}
function withEntities() {
  const old = globalThis.fetch;
  globalThis.fetch = async (input) => String(input).endsWith("/entities.json") ? { json: async () => ({ entities }) } : { ok: false, json: async () => ({}) };
  return () => { globalThis.fetch = old; };
}
function addUser(raw, id, name) {
  raw.prepare("INSERT INTO users(id,provider,sub,name,role,created) VALUES(?,'test',?,?,'',1)").run(id, `sub-${id}`, name);
  raw.prepare("INSERT INTO profiles(user_id,public,handle,job,show_org,updated) VALUES(?,1,?,'',1,1)").run(id, `user-${id}`);
}
const req = (path, method, body) => new Request("https://api.test" + path, { method, ...(body ? { body: JSON.stringify(body), headers: { "content-type": "application/json" } } : {}) });
const ent = async (env, user, body) => { const r = req("/api/entity", "POST", body), res = await handleEntity(env, r, new URL(r.url), "/api/entity", user, J); return { s: res.status, j: await res.json() }; };
const prof = async (env, user, path, body) => { const r = req(path, body ? "POST" : "GET", body), res = await handleProfiles(env, r, new URL(r.url), path, user, J); return { s: res.status, j: await res.json() }; };
const newEnt = (name, type, extra = {}) => ({ id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), data: { name, type, aliases: [], desc: { en: "A short neutral description of the new entry.", de: "" }, rel: [], ...extra } });

test("normName: Gross-/Kleinschreibung, Akzente und Trennzeichen zaehlen nicht", () => {
  assert.equal(normName("Marketing-Manager"), normName("marketing  manager"));
  assert.equal(normName("Öffentlicher Sektor"), normName("offentlicher sektor"));
  assert.notEqual(normName("Retail"), normName("Retail trade"));
});

test("Neu anlegen: ohne Anmeldung 401, Namen- und Beschreibungslaenge geprueft", async () => {
  const { raw, env } = await setup(), restore = withEntities();
  try {
    addUser(raw, 1, "Member One");
    assert.equal((await ent(env, null, newEnt("Retail trade", "industry"))).s, 401);
    assert.equal((await ent(env, { id: 1 }, { ...newEnt("R", "industry"), id: "rr" })).j.error, "bad_name");
    const short = newEnt("Retail trade", "industry"); short.data.desc = { en: "kurz", de: "" };
    assert.equal((await ent(env, { id: 1 }, short)).j.error, "too_short");
    assert.equal((await ent(env, { id: 1 }, newEnt("Retail trade", "unknown"))).j.error, "bad_type");
  } finally { restore(); raw.close(); }
});

test("Neu anlegen: Neulinge landen als pending (Freigabe in der Verwaltung), Dubletten ueber normalisierten Namen/Alias werden mit 409 abgewiesen", async () => {
  const { raw, env } = await setup(), restore = withEntities();
  try {
    addUser(raw, 1, "Member One"); addUser(raw, 2, "Member Two");
    const ok = await ent(env, { id: 1 }, newEnt("Retail trade", "industry"));
    assert.deepEqual([ok.s, ok.j.status], [200, "pending"]);
    assert.equal(raw.prepare("SELECT status FROM entity_rev WHERE eid='retail-trade'").get().status, "pending");
    const dupLive = await ent(env, { id: 1 }, { ...newEnt("Mechanical-Engineering", "industry"), id: "mech-eng" });
    assert.deepEqual([dupLive.s, dupLive.j.error, dupLive.j.id], [409, "duplicate", "mechanical-engineering"]);
    const dupAlias = await ent(env, { id: 1 }, { ...newEnt("Marketing Manager!", "job"), id: "mktg-mgr" });
    assert.deepEqual([dupAlias.s, dupAlias.j.id], [409, "marketing-manager"]);
    const dupPending = await ent(env, { id: 2 }, { ...newEnt("RETAIL  Trade", "industry"), id: "retail-2" });
    assert.deepEqual([dupPending.s, dupPending.j.id], [409, "retail-trade"], "auch gegen wartende Vorschlaege anderer Mitglieder");
    const sameName = await ent(env, { id: 2 }, newEnt("Retail trade", "job"));
    assert.equal(sameName.s, 200, "gleicher Name in einem anderen Typ ist keine Dublette");
  } finally { restore(); raw.close(); }
});

test("Profil: Branchen und Job waehlen (Auth, Typ, Anzahl); eigene wartende Neuanlage waehlbar, fremde nicht", async () => {
  const { raw, env } = await setup(), restore = withEntities();
  try {
    addUser(raw, 1, "Member One"); addUser(raw, 2, "Member Two");
    const base = { public: true, handle: "user-1" };
    assert.equal((await prof(env, null, "/api/profile/me", { ...base, industries: ["manufacturing"] })).s, 401);
    const ok = await prof(env, { id: 1 }, "/api/profile/me", { ...base, industries: ["manufacturing", "manufacturing", "mechanical-engineering"], job_eid: "marketing-manager" });
    assert.equal(ok.s, 200, JSON.stringify(ok.j));
    assert.deepEqual(raw.prepare("SELECT eid FROM profile_industry WHERE user_id=1 ORDER BY rowid").all().map((r) => r.eid), ["manufacturing", "mechanical-engineering"], "Duplikate entfallen, Reihenfolge bleibt");
    assert.equal(raw.prepare("SELECT eid FROM profile_job WHERE user_id=1").get().eid, "marketing-manager");
    const me = await prof(env, { id: 1 }, "/api/profile/me");
    assert.deepEqual([me.j.profile.industries, me.j.profile.job_eid], [["manufacturing", "mechanical-engineering"], "marketing-manager"]);
    assert.equal((await prof(env, { id: 1 }, "/api/profile/me", { ...base, industries: ["ifakt"] })).j.error, "bad_industry", "Typ muss industry sein");
    assert.equal((await prof(env, { id: 1 }, "/api/profile/me", { ...base, job_eid: "manufacturing" })).j.error, "bad_job", "Typ muss job sein");
    assert.equal((await prof(env, { id: 1 }, "/api/profile/me", { ...base, industries: ["no-such-industry"] })).j.error, "bad_industry");
    assert.equal((await prof(env, { id: 1 }, "/api/profile/me", { ...base, industries: ["manufacturing", "mechanical-engineering", "a1", "a2", "a3", "a4"] })).s, 400);
    await ent(env, { id: 1 }, newEnt("Retail trade", "industry"));
    assert.equal((await prof(env, { id: 1 }, "/api/profile/me", { ...base, industries: ["retail-trade"] })).s, 200, "eigene wartende Neuanlage");
    assert.equal((await prof(env, { id: 2 }, "/api/profile/me", { public: true, handle: "user-2", industries: ["retail-trade"] })).j.error, "bad_industry", "fremde wartende Neuanlage");
    const clear = await prof(env, { id: 1 }, "/api/profile/me", { ...base, industries: [], job_eid: "" });
    assert.equal(clear.s, 200); assert.equal(raw.prepare("SELECT COUNT(*) n FROM profile_industry").get().n, 0); assert.equal(raw.prepare("SELECT COUNT(*) n FROM profile_job").get().n, 0);
  } finally { restore(); raw.close(); }
});

test("Firma: Branchen waehlen; Export zeigt nur live veroeffentlichte Branchen, wartende bleiben privat", async () => {
  const { raw, env } = await setup(), restore = withEntities();
  try {
    addUser(raw, 1, "Owner One");
    const o = { handle: "ifakt-gmbh", name: "iFAKT GmbH", public: true };
    assert.equal((await prof(env, null, "/api/org", { ...o, industries: ["manufacturing"] })).s, 401);
    assert.equal((await prof(env, { id: 1 }, "/api/org", { ...o, industries: ["marketing-manager"] })).j.error, "bad_industry");
    await ent(env, { id: 1 }, newEnt("Retail trade", "industry"));
    assert.equal((await prof(env, { id: 1 }, "/api/org", { ...o, industries: ["manufacturing", "retail-trade"] })).s, 200);
    await prof(env, { id: 1 }, "/api/profile/me", { public: true, handle: "user-1", industries: ["retail-trade", "manufacturing"], job_eid: "marketing-manager" });
    const own = await prof(env, { id: 1 }, "/api/org/mine");
    assert.deepEqual(own.j.orgs[0].org.industries, ["manufacturing", "retail-trade"]);
    const ex = await refreshProfilesExport(env);
    assert.deepEqual(ex.orgs[0].industries, ["manufacturing"], "wartende Branche nicht oeffentlich");
    assert.deepEqual([ex.people[0].industries, ex.people[0].job_eid], [["manufacturing"], "marketing-manager"]);
    const rev = raw.prepare("SELECT id FROM entity_rev WHERE eid='retail-trade'").get().id;
    const adm = req("/api/admin/entity/approve/" + rev, "POST"), a = await handleEntity(env, adm, new URL(adm.url), new URL(adm.url).pathname, { id: 9, admin: true }, J);
    assert.equal(a.status, 200);
    const ex2 = await refreshProfilesExport(env);
    assert.deepEqual(ex2.orgs[0].industries.sort(), ["manufacturing", "retail-trade"], "nach der Freigabe oeffentlich");
  } finally { restore(); raw.close(); }
});

test("Migration 0030 legt die drei Auswahltabellen an", () => {
  const sql = readFileSync(new URL("../migrations/0030_industry_job.sql", import.meta.url), "utf8");
  for (const t of ["profile_industry", "profile_job", "org_industry"]) assert.match(sql, new RegExp("CREATE TABLE IF NOT EXISTS " + t));
});
