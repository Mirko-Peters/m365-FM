// Community-Firma <-> Firmen-Entitaet (eid): Wahl, Bestaetigung (Claim/Redaktion), Schutz vor fremden Entitaeten, Export eid_ok, Migration 0026
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { handleProfiles, refreshProfilesExport } from "../src/profiles.js";

const J = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json" } });
const entities = [
  { id: "ifakt", type: "org", name: "iFAKT GmbH", aliases: ["iFAKT"] },
  { id: "microsoft", type: "org", name: "Microsoft" },
  { id: "ada-person", type: "person", name: "Ada Example" },
];

async function setup(upTo = null) {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:"), dir = new URL("../migrations/", import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) if (!upTo || f < upTo) raw.exec(readFileSync(new URL(f, dir), "utf8"));
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
function addUser(raw, id, name, role = "") {
  raw.prepare("INSERT INTO users(id,provider,sub,name,role,created) VALUES(?,'test',?,?,?,1)").run(id, `sub-${id}`, name, role);
  raw.prepare("INSERT INTO profiles(user_id,public,handle,job,show_org,updated) VALUES(?,1,?,?,1,1)").run(id, `user-${id}`, id === 1 ? "Geschäftsführer" : "");
}
const call = async (env, user, path, method = "GET", body) => {
  const req = new Request("https://api.test" + path, { method, ...(body ? { body: JSON.stringify(body), headers: { "content-type": "application/json" } } : {}) });
  const r = await handleProfiles(env, req, new URL(req.url), path, user, J);
  return { s: r.status, j: await r.json() };
};
const org = (extra = {}) => ({ handle: "ifakt-gmbh", name: "iFAKT GmbH", public: true, ...extra });
const link = (raw) => raw.prepare("SELECT o.handle,e.eid,e.confirmed FROM org_entity e JOIN orgs o ON o.id=e.org_id").all().map((r) => ({ ...r }));

test("Firma anlegen: vorhandene Firmen-Entitaet per Name wird verknuepft (unbestaetigt), keine Doppel-Entitaet", async () => {
  const { raw, env } = await setup(), restore = withEntities();
  try {
    addUser(raw, 1, "Owner Example");
    const r = await call(env, { id: 1 }, "/api/org", "POST", org());
    assert.equal(r.s, 200, JSON.stringify(r.j));
    assert.deepEqual(link(raw), [{ handle: "ifakt-gmbh", eid: "ifakt", confirmed: 0 }]);
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM entity_rev WHERE eid='ifakt-gmbh'").get().n, 0, "keine neue Entitaet ifakt-gmbh");
    const v = await call(env, null, "/api/org/ifakt-gmbh");
    assert.equal(v.j.org.eid, "ifakt"); assert.equal(v.j.org.eid_ok, false);
  } finally { restore(); raw.close(); }
});

test("Verknuepfung bestaetigen: ohne Claim abgelehnt, mit bestaetigtem Claim oder als Admin bestaetigt; Export meldet eid_ok", async () => {
  const { raw, env } = await setup(), restore = withEntities();
  try {
    addUser(raw, 1, "Owner Example"); addUser(raw, 2, "Colleague Example");
    assert.equal((await call(env, { id: 1 }, "/api/org", "POST", org())).s, 200);
    const no = await call(env, { id: 1 }, "/api/org", "POST", org({ eid: "microsoft" }));
    assert.deepEqual([no.s, no.j.error], [403, "entity_claim_required"], "fremde Entitaet ohne Claim");
    assert.equal((await call(env, { id: 1 }, "/api/org", "POST", org({ eid: "ifakt" }))).s, 200, "dieselbe unbestaetigte Verknuepfung blockiert das Speichern nicht");
    assert.deepEqual(link(raw), [{ handle: "ifakt-gmbh", eid: "ifakt", confirmed: 0 }]);
    const bad = await call(env, { id: 1 }, "/api/org", "POST", org({ eid: "ada-person" }));
    assert.deepEqual([bad.s, bad.j.error], [400, "bad_entity"], "nur Firmen-Entitaeten");
    raw.exec("INSERT INTO entity_claims(eid,user_id,status,via,created) VALUES('ifakt',1,'verified','manual',1)");
    assert.equal((await call(env, { id: 1 }, "/api/org", "POST", org({ eid: "ifakt" }))).s, 200);
    assert.deepEqual(link(raw), [{ handle: "ifakt-gmbh", eid: "ifakt", confirmed: 1 }]);
    raw.exec("INSERT INTO org_members(org_id,user_id,role,status,created) SELECT id,2,'member','active',1 FROM orgs WHERE handle='ifakt-gmbh'");
    const ex = await refreshProfilesExport(env), o = ex.orgs.find((x) => x.handle === "ifakt-gmbh");
    assert.equal(o.eid_ok, true);
    assert.deepEqual(o.members.map((m) => m.handle).sort(), ["user-1", "user-2"]);
    assert.equal(ex.people.find((p) => p.handle === "user-1").job, "Geschäftsführer");
  } finally { restore(); raw.close(); }
});

test("Rechte: Redakteur der Firma darf die Entitaet nicht aendern, Admin der Plattform bestaetigt direkt; leer loest die Verknuepfung", async () => {
  const { raw, env } = await setup(), restore = withEntities();
  try {
    addUser(raw, 1, "Owner Example"); addUser(raw, 3, "Editor Example");
    const created = await call(env, { id: 1, admin: true }, "/api/org", "POST", org({ eid: "ifakt" }));
    assert.equal(created.s, 200, JSON.stringify(created.j));
    assert.deepEqual(link(raw), [{ handle: "ifakt-gmbh", eid: "ifakt", confirmed: 1 }], "Admin: beim Anlegen gewaehlt und bestaetigt");
    raw.exec("INSERT INTO org_members(org_id,user_id,role,status,created) SELECT id,3,'editor','active',1 FROM orgs WHERE handle='ifakt-gmbh'");
    const ed = await call(env, { id: 3, editor: false }, "/api/org", "POST", org({ eid: "microsoft" }));
    assert.deepEqual([ed.s, ed.j.error], [403, "forbidden"]);
    assert.equal((await call(env, { id: 3 }, "/api/org", "POST", org())).s, 200, "Redakteur speichert ohne eid wie bisher");
    assert.deepEqual(link(raw), [{ handle: "ifakt-gmbh", eid: "ifakt", confirmed: 1 }]);
    assert.equal((await call(env, { id: 1 }, "/api/org", "POST", org({ eid: "" }))).s, 200);
    assert.deepEqual(link(raw), [], "Inhaber loest die Verknuepfung");
  } finally { restore(); raw.close(); }
});

test("Firma mit neu erzeugter Entitaet ist bestaetigt (gehoert der Firma)", async () => {
  const { raw, env } = await setup(), restore = withEntities();
  try {
    addUser(raw, 1, "Owner Example");
    assert.equal((await call(env, { id: 1 }, "/api/org", "POST", { handle: "neue-firma", name: "Neue Firma Example", public: true })).s, 200);
    assert.deepEqual(link(raw), [{ handle: "neue-firma", eid: "neue-firma-example", confirmed: 1 }]);
  } finally { restore(); raw.close(); }
});

test("Migration 0026: Bestand mit bestaetigtem Claim eines Inhabers wird bestaetigt, Namens-Treffer nicht", async () => {
  const { raw } = await setup("0026");
  raw.exec(`INSERT INTO users(id,provider,sub,name,created) VALUES(1,'t','1','A',1),(2,'t','2','B',1);
    INSERT INTO orgs(id,handle,name,created) VALUES(10,'m365fm','M365.FM',1),(11,'microsoft-fans','Microsoft',1);
    INSERT INTO org_members(org_id,user_id,role,status,created) VALUES(10,1,'owner','active',1),(11,2,'owner','active',1);
    INSERT INTO org_entity(org_id,eid) VALUES(10,'m365fm'),(11,'microsoft');
    INSERT INTO entity_claims(eid,user_id,status,via,created) VALUES('m365fm',1,'verified','admin',1);`);
  raw.exec(readFileSync(new URL("../migrations/0026_org_entity_confirmed.sql", import.meta.url), "utf8"));
  assert.deepEqual(raw.prepare("SELECT org_id,confirmed FROM org_entity ORDER BY org_id").all().map((r) => ({ ...r })), [{ org_id: 10, confirmed: 1 }, { org_id: 11, confirmed: 0 }]);
  raw.close();
});
