// KI-Entwurf fuer Entitaeten: Auth, Hash-Schutz, nie Menschen-Aenderungen ueberschreiben, Export-Herkunft, idempotente Uebernahme aus dem Repo
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { handleEntFill, stateHash } from "../src/entfill.js";
import { handleEntity, importEntitiesFromSite, mergeFromJson, syncEntitiesFromSite } from "../src/entities.js";
import { ensureEntTr, entTrHash, entTrSource } from "../src/autotr.js";
import { handleAdminPanel } from "../src/adminpanel.js";

const J = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json" } });
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
  return { raw, env: { DB: db, SITE: "https://site.test", CRON_KEY: "k" } };
}
const seedRev = (raw, eid, data, user = 0, summary = "Übernahme aus entities.json", status = "live") =>
  raw.prepare("INSERT INTO entity_rev(eid,data,summary,user_id,status,created) VALUES(?,?,?,?,?,1)").run(eid, JSON.stringify(data), summary, user, status);
const thin = { name: "Contoso Hub", type: "product", aliases: [], desc: { en: "A hub.", de: "" }, rel: [] };
const call = async (env, key, body, method = "POST") => {
  const r = new Request("https://api.test/api/internal/entity-fill", { method, headers: key ? { "x-cron-key": key } : {}, body: method === "POST" ? JSON.stringify(body) : undefined });
  const x = await handleEntFill(env, r, "/api/internal/entity-fill", J); return { s: x.status, j: await x.json() };
};
const item = (id, base, extra = {}) => ({ id, base, desc: "Contoso Hub is a Microsoft 365 service for organising shared team documents.", long: "Contoso Hub is a service.\n\nIt organises documents.",
  faq: [{ q: "What is it?", a: "A document hub." }], de: { desc: "Contoso Hub ist ein Microsoft-365-Dienst für gemeinsame Dokumente.", long: "Contoso Hub ist ein Dienst." }, tr: { fr: { desc: "Contoso Hub est un service." } }, ...extra });

test("Endpunkt: nur POST mit CRON_KEY", async () => {
  const { env } = await setup();
  assert.equal((await call(env, "", { items: [] })).s, 403);
  assert.equal((await call(env, "falsch", { items: [] })).s, 403);
  assert.equal((await call(env, "k", {}, "GET")).s, 405);
  assert.equal((await call(env, "k", { nope: 1 })).s, 400);
  assert.equal((await call({ DB: env.DB }, "k", { items: [] })).s, 403, "ohne gesetzten Schluessel nie offen");
});

test("Seed-Fassung wird zum KI-Entwurf (Systemnutzer, Markierung), andere Sprachen in ent_tr; Menschen-Text bleibt", async () => {
  const { raw, env } = await setup();
  seedRev(raw, "hub", thin);
  const base = await stateHash(thin), r = await call(env, "k", { items: [item("hub", base)] });
  assert.equal(r.j.results[0].status, "ok", JSON.stringify(r.j));
  const live = raw.prepare("SELECT r.data,r.summary,r.user_id,u.name FROM entity_rev r JOIN users u ON u.id=r.user_id WHERE r.eid='hub' AND r.status='live'").get(), d = JSON.parse(live.data);
  assert.equal(live.name, "M365.FM Redaktion (KI-Entwurf)"); assert.match(live.summary, /^KI-Entwurf: desc\.en, long\.en, desc\.de, long\.de, faq\.en/);
  assert.equal(d.name, "Contoso Hub"); assert.match(d.desc.en, /organising shared team/); assert.deepEqual(d.faq.en, [{ q: "What is it?", a: "A document hub." }]);
  assert.equal(raw.prepare("SELECT text FROM ent_tr WHERE eid='hub' AND lang='fr' AND field='desc'").get().text, "Contoso Hub est un service.");
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM entity_rev WHERE eid='hub' AND status='live'").get().n, 1);
  // zweiter Lauf mit dem alten Hash: Stand hat sich geaendert (durch den Entwurf selbst) -> nichts passiert, nichts wird doppelt geschrieben
  assert.equal((await call(env, "k", { items: [item("hub", base)] })).j.results[0].status, "changed_meanwhile");
  assert.equal((await call(env, "k", { items: [item("hub", await stateHash(d))] })).j.results[0].status, "unchanged");
});

test("Hash-Schutz, Menschen-Aenderung und fehlende DB-Fassung", async () => {
  const { raw, env } = await setup();
  seedRev(raw, "hub", thin); seedRev(raw, "edited", thin); seedRev(raw, "deleted", thin, 0, "Verwaltung");
  raw.prepare("INSERT INTO users(id,provider,sub,name,created) VALUES(7,'t','7','Eva',1)").run();
  seedRev(raw, "edited", { ...thin, desc: { en: "Eva wrote this", de: "" } }, 7, "Verwaltung", "old");   // Mensch war da, danach kam eine Maschinen-Fassung
  const r = await call(env, "k", { items: [item("hub", "falscher-hash"), item("edited", await stateHash(thin)), item("deleted", await stateHash(thin)), item("ghost", "x"), item("BAD id", "x")] });
  assert.deepEqual(r.j.results.map((x) => x.status), ["changed_meanwhile", "human_edited", "human_edited", "no_db_version", "bad_id"]);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM entity_rev WHERE summary LIKE 'KI-Entwurf%'").get().n, 0);
  // vorhandener Langtext wird nie ueberschrieben, nur Leeres gefuellt
  const rich = { ...thin, desc: { en: "Contoso Hub is a long enough description of the product for the page, written by the editorial team.", de: "" }, long: { en: "Redaktioneller Text.", de: "" } };
  seedRev(raw, "rich", rich);
  assert.equal((await call(env, "k", { items: [item("rich", await stateHash(rich))] })).j.results[0].status, "ok");
  const d = JSON.parse(raw.prepare("SELECT data FROM entity_rev WHERE eid='rich' AND status='live'").get().data);
  assert.equal(d.long.en, "Redaktioneller Text."); assert.equal(d.desc.en, rich.desc.en); assert.match(d.long.de, /Dienst/);
});

test("Export nennt Herkunft (seed/ai/human) und Hash", async () => {
  const { raw, env } = await setup();
  seedRev(raw, "seeded", thin); seedRev(raw, "hub", thin); seedRev(raw, "human", thin, 0, "Verwaltung");
  await call(env, "k", { items: [item("hub", await stateHash(thin))] });
  const r = new Request("https://api.test/api/entity/export"), x = await handleEntity(env, r, new URL(r.url), "/api/entity/export", null, J), by = Object.fromEntries((await x.json()).items.map((i) => [i.id, i]));
  assert.deepEqual([by.seeded.src, by.hub.src, by.human.src], ["seed", "ai", "human"]);
  assert.equal(by.seeded.h, await stateHash(thin));
});

test("Uebernahme aus dem Repo: idempotent, nur Eintraege ohne DB-Fassung, kein Knopf mehr", async () => {
  const { raw, env } = await setup(), old = globalThis.fetch;
  const list = [{ id: "contoso", type: "org", name: "Contoso", desc: { en: "Contoso builds Microsoft 365 apps.", de: "" } }, { id: "hub", type: "product", name: "Hub", desc: { en: "Seed hub text here.", de: "" } }];
  globalThis.fetch = async (u) => String(u).endsWith("/entities.json") ? { ok: true, json: async () => ({ entities: list }) } : { ok: false, json: async () => ({}) };
  try {
    seedRev(raw, "hub", { ...thin, desc: { en: "Edited by DB.", de: "" } }, 7, "Verwaltung");
    const a = await importEntitiesFromSite(env), b = await importEntitiesFromSite(env);
    assert.equal(a.imported, 1); assert.equal(b.imported, 0);
    assert.equal(JSON.parse(raw.prepare("SELECT data FROM entity_rev WHERE eid='hub' AND status='live'").get().data).desc.en, "Edited by DB.", "DB gewinnt");
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM org_entity WHERE eid='contoso'").get().n, 1, "Firmen-Entitaet bekommt ihre Firma automatisch");
    const q = new Request("https://api.test/api/admin/panel/import-entities", { method: "POST" });
    assert.equal((await handleAdminPanel(env, q, new URL(q.url), "/api/admin/panel/import-entities", { admin: true }, J)).status, 404);
  } finally { globalThis.fetch = old; }
});

test("Selbst verwaltete Entitaet (Claim verified): kein KI-Entwurf, Export src owned", async () => {
  const { raw, env } = await setup();
  seedRev(raw, "hub", thin); seedRev(raw, "free", thin);
  raw.prepare("INSERT INTO users(id,provider,sub,name,created) VALUES(5,'t','5','Owner',1)").run();
  raw.prepare("INSERT INTO entity_claims(eid,user_id,status,created) VALUES('hub',5,'verified',1)").run();
  const r = await call(env, "k", { items: [item("hub", await stateHash(thin)), item("free", await stateHash(thin))] });
  assert.deepEqual(r.j.results.map((x) => x.status), ["owned", "ok"]);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM entity_rev WHERE eid='hub' AND summary LIKE 'KI-Entwurf%'").get().n, 0);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM ent_tr WHERE eid='hub'").get().n, 0);
  const q = new Request("https://api.test/api/entity/export"), x = await handleEntity(env, q, new URL(q.url), "/api/entity/export", null, J), by = Object.fromEntries((await x.json()).items.map((i) => [i.id, i]));
  assert.deepEqual([by.hub.src, by.free.src], ["owned", "ai"]);
});

test("KI-Entwurf behaelt Beschreibungen weiterer Sprachen (desc.nl)", async () => {
  const { raw, env } = await setup();
  const multi = { ...thin, desc: { en: "A hub.", de: "", nl: "Contoso Hub is een dienst." }, long: { nl: "Lange tekst." } };
  seedRev(raw, "hub", multi);
  assert.equal((await call(env, "k", { items: [item("hub", await stateHash(multi))] })).j.results[0].status, "ok");
  const d = JSON.parse(raw.prepare("SELECT data FROM entity_rev WHERE eid='hub' AND status='live'").get().data);
  assert.equal(d.desc.nl, "Contoso Hub is een dienst."); assert.equal(d.long.nl, "Lange tekst."); assert.match(d.desc.en, /organising shared team/);
});

test("Auto-Uebersetzung abgestimmt: neuer Text gilt als gesehen, alte desc-Uebersetzungen gehen, neue bleiben", async () => {
  const { raw, env } = await setup();
  seedRev(raw, "hub", thin);
  await ensureEntTr(env.DB);
  raw.prepare("INSERT INTO ent_tr_seen(eid,field,first,h) VALUES('hub','desc',1,?)").run(entTrHash(entTrSource(thin.desc)));
  raw.prepare("INSERT INTO ent_tr(eid,field,lang,text,created) VALUES('hub','desc','fr','Un hub.',1),('hub','desc','es','Un hub.',1)").run();
  assert.equal((await call(env, "k", { items: [item("hub", await stateHash(thin))] })).j.results[0].status, "ok");
  const d = JSON.parse(raw.prepare("SELECT data FROM entity_rev WHERE eid='hub' AND status='live'").get().data);
  const seen = Object.fromEntries(raw.prepare("SELECT field,h FROM ent_tr_seen WHERE eid='hub'").all().map((r) => [r.field, r.h]));
  assert.equal(seen.desc, entTrHash(entTrSource(d.desc)), "autotr sieht keinen geaenderten Text -> loescht nichts");
  assert.equal(seen.long, entTrHash(entTrSource(d.long)));
  const tr = raw.prepare("SELECT lang,text FROM ent_tr WHERE eid='hub' AND field='desc' ORDER BY lang").all().map((r) => [r.lang, r.text]);
  assert.deepEqual(tr, [["fr", "Contoso Hub est un service."]], "Uebersetzung des alten Kurztexts (es) ist weg, die neue (fr) steht");
});

test("T30-Abgleich: KI-Entwurf ist keine Menschen-Aenderung - unveraenderte JSON setzt ihn nicht zurueck, Redaktions-Aenderung gewinnt", async () => {
  const { raw, env } = await setup(), old = globalThis.fetch;
  seedRev(raw, "hub", thin); seedRev(raw, "other", thin);
  await call(env, "k", { items: [item("hub", await stateHash(thin)), item("other", await stateHash(thin))] });
  const sys = raw.prepare("SELECT id FROM users WHERE sub='ki-entwurf'").get().id;
  const revs = (eid) => raw.prepare("SELECT id,data,user_id,summary,status FROM entity_rev WHERE eid=? ORDER BY (status='live'), id").all(eid).map((r) => ({ ...r, data: JSON.parse(r.data) }));
  const edited = { ...thin, desc: { en: "Contoso Hub is the editorial description of the product, improved by the team in entities.json.", de: "" }, long: { en: "Editorial long text." } };
  const m = mergeFromJson(edited, revs("hub"), sys);
  assert.deepEqual([m.fields, m.kept], [["desc.en", "long.en"], []]);
  assert.equal(m.data.desc.en, edited.desc.en);
  const same = mergeFromJson(thin, revs("hub"), sys);   // Repo noch mit dem alten Kurztext: KI-Text bleibt
  assert.deepEqual([same.fields, same.kept], [[], []]);
  assert.deepEqual(mergeFromJson(edited, revs("hub")).kept, ["desc.en", "long.en"], "ohne sysId galt der Entwurf als Mensch (alter Fehler)");
  globalThis.fetch = async (u) => (String(u).endsWith("/entities-src.json") ? { ok: true, json: async () => ({ entities: [{ id: "hub", ...edited }, { id: "other", ...thin }] }) } : { ok: false, json: async () => ({}) });
  try {
    const r = await syncEntitiesFromSite(env);
    assert.equal(r.updated, 1, JSON.stringify(r));
    assert.equal(JSON.parse(raw.prepare("SELECT data FROM entity_rev WHERE eid='hub' AND status='live'").get().data).long.en, "Editorial long text.");
    assert.match(JSON.parse(raw.prepare("SELECT data FROM entity_rev WHERE eid='other' AND status='live'").get().data).desc.en, /organising shared team/);
  } finally { globalThis.fetch = old; }
});
