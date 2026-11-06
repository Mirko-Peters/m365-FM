// Firma <-> Entitaet immer als Paar (0034): beide Anlegewege, Dedupe, Vertrauensstufen, unbeanspruchte Firmen, Paarungs-Aktion (Probelauf, idempotent)
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { handleProfiles, refreshProfilesExport } from "../src/profiles.js";
import { handleEntity } from "../src/entities.js";
import { handleOrgPair, adoptUnclaimedForEntity } from "../src/orgpair.js";

const J = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json" } });
const entities = [
  { id: "ifakt", type: "org", name: "iFAKT GmbH", aliases: ["iFAKT"], web: "https://www.ifakt.de" },
  { id: "contoso", type: "org", name: "Contoso", web: "https://www.contoso.com" },
  { id: "copilot", type: "product", name: "Copilot", web: "https://copilot.microsoft.com" },
  { id: "ada-person", type: "person", name: "Ada Example" },
];
async function setup() {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:"), dir = new URL("../migrations/", import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(f, dir), "utf8"));
  const db = {
    prepare(sql) {
      let args = [];
      const o = { bind(...a) { args = a; return o; }, all: async () => ({ results: raw.prepare(sql).all(...args) }), first: async () => raw.prepare(sql).get(...args) ?? null,
        run: async () => { const r = raw.prepare(sql).run(...args); return { meta: { changes: Number(r.changes), last_row_id: Number(r.lastInsertRowid) } }; } };
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
function addUser(raw, id, { mail = "", pub = true } = {}) {
  raw.prepare("INSERT INTO users(id,provider,sub,name,created) VALUES(?,'test',?,?,1)").run(id, `sub-${id}`, `User ${id}`);
  raw.prepare("INSERT INTO profiles(user_id,public,handle,show_org,updated) VALUES(?,?,?,1,1)").run(id, pub ? 1 : 0, `user-${id}`);
  if (mail) raw.prepare("INSERT INTO mail_addr(user_id,email,verified,created) VALUES(?,?,1,1)").run(id, mail);
}
const req = (path, method, body) => new Request("https://api.test" + path, { method, ...(body ? { body: JSON.stringify(body), headers: { "content-type": "application/json" } } : {}) });
const org = async (env, user, path, method = "GET", body) => { const r = req(path, method, body), u = new URL(r.url), x = await handleProfiles(env, r, u, u.pathname, user, J); return { s: x.status, j: await x.json() }; };
const ent = async (env, user, body) => { const r = req("/api/entity", "POST", body), x = await handleEntity(env, r, new URL(r.url), "/api/entity", user, J); return { s: x.status, j: await x.json() }; };
const pair = async (env, user, method, body) => { const r = req("/api/admin/org-pair", method, body), x = await handleOrgPair(env, r, new URL(r.url), "/api/admin/org-pair", user, J); return { s: x.status, j: await x.json() }; };
const newOrg = (name, extra = {}) => ({ id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), data: { name, type: "org", aliases: [], desc: { en: `${name} builds Microsoft 365 solutions.`, de: "" }, web: "https://www.fabrikam-example.com", rel: [] }, summary: "", ...extra });
const orgs = (raw) => raw.prepare("SELECT o.handle,o.unclaimed,o.public,e.eid,e.confirmed,(SELECT COUNT(*) FROM org_members m WHERE m.org_id=o.id AND m.role='owner') owners FROM orgs o LEFT JOIN org_entity e ON e.org_id=o.id ORDER BY o.id").all().map((r) => ({ ...r }));
const revs = (raw) => raw.prepare("SELECT eid,status,data FROM entity_rev ORDER BY id").all().map((r) => ({ ...r, data: JSON.parse(r.data) }));

test("Weg 1: Firma ohne passende Entitaet -> Entitaet im selben Request; Neuling wartend, vertrauenswuerdig live; Website und Kurzbeschreibung", async () => {
  const { raw, env } = await setup(), restore = withEntities();
  try {
    addUser(raw, 1); addUser(raw, 2);
    const a = await org(env, { id: 1 }, "/api/org", "POST", { handle: "fabrikam", name: "Fabrikam GmbH", website: "https://www.fabrikam-example.com", tagline: "Fabrikam builds Microsoft 365 solutions", public: true });
    assert.equal(a.s, 200, JSON.stringify(a.j));
    const r = revs(raw);
    assert.deepEqual(r.map((x) => [x.eid, x.status, x.data.type, x.data.web]), [["fabrikam", "pending", "org", "https://www.fabrikam-example.com/"]]);
    assert.equal(r[0].data.desc.en, "Fabrikam builds Microsoft 365 solutions");
    assert.deepEqual(orgs(raw), [{ handle: "fabrikam", unclaimed: 0, public: 1, eid: "fabrikam", confirmed: 1, owners: 1 }], "Ersteller besitzt die Firma und hat die Entitaet erzeugt -> bestaetigt");
    const b = await org(env, { id: 2, admin: true }, "/api/org", "POST", { handle: "tailwind", name: "Tailwind Traders", public: true });
    assert.equal(b.s, 200);
    assert.equal(revs(raw).find((x) => x.eid === "tailwind-traders").status, "live", "Admin = vertrauenswuerdig -> live");
  } finally { restore(); raw.close(); }
});

test("Dedupe Weg 1: Rechtsform und Domain fuehren zur vorhandenen Entitaet, nie zu einer zweiten; Produkt-Slug wird nicht verknuepft", async () => {
  const { raw, env } = await setup(), restore = withEntities();
  try {
    addUser(raw, 1); addUser(raw, 2); addUser(raw, 3);
    assert.equal((await org(env, { id: 1 }, "/api/org", "POST", { handle: "contoso-ltd", name: "Contoso Ltd.", public: true })).s, 200);
    assert.equal((await org(env, { id: 2 }, "/api/org", "POST", { handle: "ifakt-site", name: "Ganz anderer Name", website: "https://ifakt.de/team", public: true })).s, 200);
    assert.equal((await org(env, { id: 3 }, "/api/org", "POST", { handle: "copilot-firma", name: "Copilot", public: true })).s, 200);
    assert.deepEqual(orgs(raw).map((o) => [o.handle, o.eid, o.confirmed]), [["contoso-ltd", "contoso", 0], ["ifakt-site", "ifakt", 0], ["copilot-firma", "copilot-2", 1]]);
    assert.deepEqual(revs(raw).map((x) => x.eid), ["copilot-2"], "nur fuer das Produkt-Namensduell eine neue Firmen-Entitaet");
  } finally { restore(); raw.close(); }
});

test("Weg 2: neue Firmen-Entitaet -> unbeanspruchte Community-Firma (kein Inhaber, nicht oeffentlich, nicht im Export, nicht beitretbar)", async () => {
  const { raw, env } = await setup(), restore = withEntities();
  try {
    addUser(raw, 1);
    const r = await ent(env, { id: 1 }, newOrg("Fabrikam"));
    assert.deepEqual([r.s, r.j.status], [200, "pending"]);
    assert.equal(r.j.owner, false);
    assert.deepEqual(orgs(raw), [{ handle: "fabrikam", unclaimed: 1, public: 0, eid: "fabrikam", confirmed: 0, owners: 0 }]);
    assert.equal(raw.prepare("SELECT website FROM orgs").get().website, "https://www.fabrikam-example.com/");
    assert.equal((await org(env, null, "/api/org/fabrikam")).s, 404, "keine oeffentliche Ansicht");
    assert.equal((await org(env, { id: 1 }, "/api/org/fabrikam/join", "POST")).j.error, "claim_required");
    assert.equal((await org(env, { id: 1 }, "/api/orgs/search?q=fabrikam")).j.items.length, 0);
    assert.equal((await refreshProfilesExport(env)).orgs.length, 0, "Export ohne unbeanspruchte Firmen -> keine Seite im Seitenbau");
    assert.equal((await ent(env, { id: 1 }, newOrg("Fabrikam", { data: { ...newOrg("Fabrikam").data, desc: { en: "Fabrikam builds apps for Microsoft 365 teams.", de: "" } } }))).s, 200);
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM orgs").get().n, 1, "zweite Fassung derselben Entitaet legt keine zweite Firma an");
    const person = await ent(env, { id: 1 }, { id: "grace-example", data: { name: "Grace Example", type: "person", aliases: [], desc: { en: "Grace is a Microsoft 365 architect.", de: "" }, rel: [] }, summary: "" });
    assert.equal(person.s, 200); assert.equal(raw.prepare("SELECT COUNT(*) n FROM orgs").get().n, 1, "Personen bekommen keine Firma");
  } finally { restore(); raw.close(); }
});

test("Weg 2: Eigentum nur unter den Claim-Bedingungen (Admin oder verifizierte Firmen-E-Mail-Domain), sonst unbeansprucht; Vertrauen = live", async () => {
  const { raw, env } = await setup(), restore = withEntities();
  try {
    addUser(raw, 1, { mail: "jane@fabrikam-example.com" }); addUser(raw, 2, { mail: "joe@gmail.com" }); addUser(raw, 3); addUser(raw, 4, { mail: "x@other-example.org" });
    const a = await ent(env, { id: 1 }, newOrg("Fabrikam"));
    assert.equal(a.j.owner, true);
    await ent(env, { id: 2 }, newOrg("Northwind"));
    await ent(env, { id: 4 }, newOrg("Litware"));
    const c = await ent(env, { id: 3, admin: true }, newOrg("Adatum"));
    assert.deepEqual([c.j.status, c.j.owner], ["live", true]);
    const by = Object.fromEntries(orgs(raw).map((o) => [o.eid, o]));
    assert.deepEqual([by.fabrikam.unclaimed, by.fabrikam.owners, by.fabrikam.confirmed], [0, 1, 1]);
    assert.deepEqual(raw.prepare("SELECT verified_via,verified_domain,status FROM entity_claims WHERE eid='fabrikam'").get() && { ...raw.prepare("SELECT verified_via,verified_domain,status FROM entity_claims WHERE eid='fabrikam'").get() }, { verified_via: "domain_email", verified_domain: "fabrikam-example.com", status: "verified" });
    for (const k of ["northwind", "litware"]) assert.deepEqual([by[k].unclaimed, by[k].owners], [1, 0], "Freemail/fremde Domain -> unbeansprucht");
    assert.deepEqual([by.adatum.unclaimed, by.adatum.owners], [0, 1]);
    assert.equal(raw.prepare("SELECT status FROM entity_rev WHERE eid='adatum'").get().status, "live");
  } finally { restore(); raw.close(); }
});

test("Weg 2: gleichnamige unverknuepfte Firma wird verknuepft statt verdoppelt; Beanspruchung macht aus der unbeanspruchten Firma eine eigene", async () => {
  const { raw, env } = await setup(), restore = withEntities();
  try {
    addUser(raw, 1); addUser(raw, 2);
    raw.exec("INSERT INTO orgs(id,handle,name,website,public,created) VALUES(50,'fabrikam-alt','Fabrikam Inc.','https://fabrikam-example.com',1,1)");
    await ent(env, { id: 1 }, newOrg("Fabrikam"));
    assert.deepEqual(orgs(raw).map((o) => [o.handle, o.eid, o.confirmed, o.unclaimed]), [["fabrikam-alt", "fabrikam", 0, 0]]);
    await ent(env, { id: 1 }, newOrg("Northwind"));
    assert.equal(raw.prepare("SELECT unclaimed u FROM orgs WHERE handle='northwind'").get().u, 1);
    // "Nein, meine Firma ist nicht dabei" fuer eine Firma, deren Entitaet eine unbeanspruchte Firma hat: keine zweite Firma
    const again = await org(env, { id: 2 }, "/api/org", "POST", { handle: "meine-northwind", name: "Northwind Ltd", public: true });
    assert.deepEqual([again.s, again.j.handle, again.j.claim_required], [200, "northwind", true]);
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM orgs").get().n, 2);
    assert.equal(await adoptUnclaimedForEntity(env.DB, 2, "northwind"), "northwind");
    assert.deepEqual(orgs(raw).find((o) => o.handle === "northwind"), { handle: "northwind", unclaimed: 0, public: 0, eid: "northwind", confirmed: 1, owners: 1 });
    assert.equal(await adoptUnclaimedForEntity(env.DB, 2, "northwind"), null, "idempotent");
  } finally { restore(); raw.close(); }
});

test("Admin-Aktion Firmen und Entitaeten paaren: Probelauf aendert nichts, Lauf paart nur Firmen-Entitaeten, zweiter Lauf tut nichts", async () => {
  const { raw, env } = await setup(), restore = withEntities();
  try {
    addUser(raw, 1);
    raw.exec(`INSERT INTO orgs(id,handle,name,website,tagline,public,created) VALUES(60,'contoso-eu','Contoso Europe GmbH','https://contoso.com','',1,1),(61,'woodgrove','Woodgrove Bank','https://www.woodgrove-example.com','Woodgrove runs banking on Microsoft Azure',1,1);
      INSERT INTO org_members(org_id,user_id,role,status,created) VALUES(60,1,'owner','active',1),(61,1,'owner','active',1);`);
    assert.equal((await pair(env, { id: 1 }, "POST", {})).s, 403, "nur Admin");
    const dry = await pair(env, { id: 1, admin: true }, "POST", { dry: true });
    assert.deepEqual(dry.j, { dry: true, orgs_without_entity: 2, link_existing: 1, entities_to_create: 1, entities_without_org: 1 });
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM orgs").get().n, 2); assert.equal(raw.prepare("SELECT COUNT(*) n FROM entity_rev").get().n, 0);
    assert.deepEqual((await pair(env, { id: 1, admin: true }, "GET")).j, dry.j, "GET = Probelauf");
    const run = await pair(env, { id: 1, admin: true }, "POST", { dry: false });
    assert.deepEqual(run.j, { dry: false, linked: 1, entities_created: 1, orgs_created: 1, remaining: 0 });
    assert.deepEqual(revs(raw).map((x) => [x.eid, x.status, x.data.type]), [["woodgrove-bank", "pending", "org"]]);
    const o = Object.fromEntries(orgs(raw).map((x) => [x.handle, x]));
    assert.deepEqual([o["contoso-eu"].eid, o["contoso-eu"].confirmed], ["contoso", 0], "vorhandene Entitaet (Domain) wiederverwendet");
    assert.deepEqual([o.woodgrove.eid, o.woodgrove.confirmed], ["woodgrove-bank", 0]);
    assert.deepEqual([o.ifakt.unclaimed, o.ifakt.eid, o.ifakt.owners, o.ifakt.public], [1, "ifakt", 0, 0]);
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM orgs WHERE handle LIKE 'copilot%' OR handle LIKE 'ada%'").get().n, 0, "Produkte und Personen werden nicht gepaart");
    const again = await pair(env, { id: 1, admin: true }, "POST", { dry: false });
    assert.deepEqual(again.j, { dry: false, linked: 0, entities_created: 0, orgs_created: 0, remaining: 0 });
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM orgs").get().n, 3); assert.equal(raw.prepare("SELECT COUNT(*) n FROM entity_rev").get().n, 1);
  } finally { restore(); raw.close(); }
});
