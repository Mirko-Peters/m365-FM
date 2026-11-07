import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { recordInvite, handleInviter, inviteCount, syncInviterBadges } from "../src/inviter.js";
import { evalBadges, INVITER_TIERS, inviterTier, badgesFor, stats } from "../src/badges.js";
import { mergeStatements } from "../src/identities.js";
import { handleEntityInvite } from "../src/entinvite.js";

const J = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json" } });
async function setup() {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:");
  const dir = new URL("../migrations/", import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(f, dir), "utf8"));
  const db = {
    prepare(sql) { let a = []; const o = { bind(...x) { a = x; return o; }, all: async () => ({ results: raw.prepare(sql).all(...a) }), first: async () => raw.prepare(sql).get(...a) ?? null, run: async () => { const r = raw.prepare(sql).run(...a); return { meta: { changes: Number(r.changes), last_row_id: Number(r.lastInsertRowid) } }; } }; return o; },
    async batch(s) { for (const x of s) await x.run(); },
  };
  const old = globalThis.fetch; globalThis.fetch = async () => ({ json: async () => ({ episodes: [] }) });
  return { raw, env: { DB: db, SITE: "https://site.test", API: "https://api.test", SESSION_SECRET: "s" }, restore: () => { globalThis.fetch = old; } };
}
const user = (raw, id, { provider = "github", created = 100, handle = "" } = {}) => {
  raw.prepare("INSERT INTO users(id,provider,sub,name,created) VALUES(?,?,?,?,?)").run(id, provider, `s${id}`, `U${id}`, created);
  if (handle) raw.prepare("INSERT INTO profiles(user_id,handle,public,updated) VALUES(?,?,1,1)").run(id, handle);
};
const badges = (raw, id) => raw.prepare("SELECT badge FROM user_badges WHERE user_id=? AND badge LIKE 'inviter_%' ORDER BY badge").all(id).map((r) => r.badge);

test("Zurechnung fuer jede Quelle", async () => {
  const { raw, env, restore } = await setup();
  try {
    user(raw, 1);
    let i = 10;
    for (const source of ["ref", "entity", "speaker", "org", "forward"]) { user(raw, ++i); assert.equal(await recordInvite(env, { inviter: 1, invitee: i, source, ref: "x" }), true, source); }
    assert.equal(await inviteCount(env.DB, 1), 5);
    assert.deepEqual(raw.prepare("SELECT source FROM invite_success ORDER BY rowid").all().map((r) => r.source), ["ref", "entity", "speaker", "org", "forward"]);
    assert.equal(await recordInvite(env, { inviter: 1, invitee: 11, source: "bogus" }), false);
  } finally { restore(); }
});

test("Eindeutigkeit: wer zuerst einlaedt, behaelt die Person", async () => {
  const { raw, env, restore } = await setup();
  try {
    user(raw, 1); user(raw, 2); user(raw, 3);
    assert.equal(await recordInvite(env, { inviter: 1, invitee: 3, source: "ref" }), true);
    assert.equal(await recordInvite(env, { inviter: 2, invitee: 3, source: "entity" }), false);
    assert.equal(await recordInvite(env, { inviter: 1, invitee: 3, source: "ref" }), false);
    assert.equal(await inviteCount(env.DB, 2), 0);
  } finally { restore(); }
});

test("keine Selbst-Einladung, nur OAuth oder bestaetigte E-Mail, Konto muss nach der Einladung entstanden sein", async () => {
  const { raw, env, restore } = await setup();
  try {
    user(raw, 1); user(raw, 2, { provider: "dev" }); user(raw, 3, { created: 50 });
    assert.equal(await recordInvite(env, { inviter: 1, invitee: 1, source: "ref" }), false);
    assert.equal(await recordInvite(env, { inviter: 1, invitee: 2, source: "ref" }), false, "dev-Konto ohne Nachweis");
    raw.prepare("INSERT INTO mail_addr(user_id,email,verified,created) VALUES(2,'a@b.c',1,1)").run();
    assert.equal(await recordInvite(env, { inviter: 1, invitee: 2, source: "ref" }), true, "bestaetigte E-Mail");
    assert.equal(await recordInvite(env, { inviter: 1, invitee: 3, source: "entity", since: 80 }), false, "Konto aelter als die Einladung");
  } finally { restore(); }
});

test("Entitaets-Einladung: Annahme zaehlt fuer den Einlader", async () => {
  const { raw, env, restore } = await setup();
  try {
    user(raw, 1); user(raw, 2, { handle: "neu" });
    await handleEntityInvite(env, new Request("https://api.test/api/entityinvite/info?t=x"), new URL("https://api.test/api/entityinvite/info?t=x"), "/api/entityinvite/info", null, J);   // ensure()
    raw.prepare("INSERT INTO entity_invites(token,eid,name,email,by_user,created) VALUES('tok','some-person','N','n@x.de',1,50)").run();
    const req = new Request("https://api.test/api/entityinvite/accept", { method: "POST", body: JSON.stringify({ t: "tok" }) });
    const r = await handleEntityInvite(env, req, new URL(req.url), "/api/entityinvite/accept", { id: 2 }, J);
    assert.equal(r.status, 200);
    assert.equal(await inviteCount(env.DB, 1), 1);
  } finally { restore(); }
});

test("zusammengefuehrte Konten zaehlen nicht doppelt", async () => {
  const { raw, env, restore } = await setup();
  try {
    user(raw, 1); user(raw, 2); user(raw, 3); user(raw, 4);
    await recordInvite(env, { inviter: 1, invitee: 2, source: "ref" });
    await recordInvite(env, { inviter: 1, invitee: 3, source: "ref" });
    await recordInvite(env, { inviter: 4, invitee: 3, source: "ref" });   // schon vergeben
    for (const s of await mergeStatements(env.DB, 3, 2)) await s.run();   // Konto 3 geht in 2 auf: dieselbe Person
    assert.equal(await inviteCount(env.DB, 1), 1);
    raw.prepare("UPDATE users SET merged_into=2,banned=2 WHERE id=3").run();
    assert.equal(await recordInvite(env, { inviter: 4, invitee: 3, source: "ref" }), false, "stillgelegtes Konto zaehlt nie");
  } finally { restore(); }
});

test("Stufen: 0 keine, 1, 5, 10, 50, 100, 1000", async () => {
  assert.deepEqual(INVITER_TIERS, [1, 5, 10, 50, 100, 1000]);
  const exp = [[0, 0], [1, 1], [4, 1], [5, 2], [9, 2], [10, 3], [49, 3], [50, 4], [99, 4], [100, 5], [999, 5], [1000, 6]];
  for (const [n, t] of exp) assert.equal(inviterTier(n), t, String(n));
  const { raw, env, restore } = await setup();
  try {
    user(raw, 1);
    await evalBadges(env, 1); assert.deepEqual(badges(raw, 1), []);
    const ins = raw.prepare("INSERT INTO invite_success(inviter_user_id,invitee_user_id,source,created) VALUES(1,?,'ref',1)");
    for (let n = 1; n <= 10; n++) { ins.run(1000 + n); await evalBadges(env, 1); }
    assert.deepEqual(badges(raw, 1), ["inviter_1", "inviter_10", "inviter_5"]);
    assert.deepEqual((await badgesFor(env.DB, [1])).get(1).filter((b) => b.startsWith("inviter_")), ["inviter_10"], "nur die hoechste Stufe wird angezeigt");
    assert.equal((await stats(env.DB, 1)).badges.filter((b) => b.startsWith("inviter_")).length, 1);
  } finally { restore(); }
});

test("Ref-Ablauf: Ref des Browsers wird bei der Anmeldung zugerechnet, nur frische Konten", async () => {
  const { raw, env, restore } = await setup();
  try {
    const now = Math.floor(Date.now() / 1000);
    user(raw, 1, { handle: "einlader" }); user(raw, 2, { created: now }); user(raw, 3, { created: now - 90 * 86400 });
    const call = (u, body) => { const req = new Request("https://api.test/api/invite/ref", { method: "POST", body: JSON.stringify(body) }); return handleInviter(env, req, new URL(req.url), "/api/invite/ref", u, J).then((r) => r.json()); };
    assert.equal((await call({ id: 2 }, { ref: "einlader", t: now - 60 })).counted, true);
    assert.equal((await call({ id: 3 }, { ref: "einlader", t: now - 60 })).counted, false, "altes Konto");
    assert.equal((await call({ id: 1 }, { ref: "einlader", t: now - 60 })).counted, false, "selbst");
    assert.equal((await call({ id: 2 }, { ref: "../x" })).error, "bad_request");
    const me = await handleInviter(env, new Request("https://api.test/api/invite/me"), new URL("https://api.test/api/invite/me"), "/api/invite/me", { id: 1 }, J).then((r) => r.json());
    assert.equal(me.count, 1); assert.equal(me.link, "https://site.test/einladung/einlader/"); assert.equal(me.ref_link, "https://site.test/community/?ref=einlader");
  } finally { restore(); }
});

test("Admin kann einen Eintrag entwerten, Abzeichen und Zaehler folgen", async () => {
  const { raw, env, restore } = await setup();
  try {
    user(raw, 1); user(raw, 2);
    await recordInvite(env, { inviter: 1, invitee: 2, source: "ref" });
    assert.deepEqual(badges(raw, 1), ["inviter_1"]);
    const call = (u, body) => { const req = new Request("https://api.test/api/admin/invite/void", { method: "POST", body: JSON.stringify(body) }); return handleInviter(env, req, new URL(req.url), "/api/admin/invite/void", u, J); };
    assert.equal((await call({ id: 9 }, { invitee: 2 })).status, 403);
    const r = await (await call({ id: 9, admin: true }, { invitee: 2 })).json();
    assert.equal(r.count, 0); assert.deepEqual(badges(raw, 1), []);
    assert.equal(await recordInvite(env, { inviter: 5, invitee: 2, source: "ref" }), false, "entwerteter Eintrag blockiert weiter (UNIQUE)");
    await (await call({ id: 9, admin: true }, { invitee: 2, undo: true })).json();
    assert.equal(await inviteCount(env.DB, 1), 1);
    assert.equal(await syncInviterBadges(env), 1);
  } finally { restore(); }
});
