import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { handleEntityInvite, inviteVariant, mailBody, mailText, mailSubject, remindInvites } from "../src/entinvite.js";

const J = (data, status = 200, h = {}) => new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json", ...h } });
const entities = [
  { id: "mvp-person", type: "person", name: "Mia MVP", desc: { en: "Mia is a Microsoft MVP for Azure." } },
  { id: "mct-person", type: "person", name: "Max MCT", long: { en: "Trainer, MCT since 2015." } },
  { id: "plain-person", type: "person", name: "Pia Plain", desc: { en: "Consultant. Loves MVPs-like communities and AMVP things." } },
  { id: "prog-person", type: "person", name: "Pro Gram", program: "MVP" },
  { id: "spk-person", type: "person", name: "Sven Speaker", desc: { en: "Speaker." } },
  { id: "c1", type: "person", name: "C One" }, { id: "c2", type: "person", name: "C Two" }, { id: "c3", type: "person", name: "C Three" }, { id: "c4", type: "person", name: "C Four" },
];

async function setup(mail = true) {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:");
  const dir = new URL("../migrations/", import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(f, dir), "utf8"));
  const db = {
    prepare(sql) {
      let args = [];
      const o = { bind(...a) { args = a; return o; }, all: async () => ({ results: raw.prepare(sql).all(...args) }), first: async () => raw.prepare(sql).get(...args) ?? null, run: async () => { const r = raw.prepare(sql).run(...args); return { meta: { changes: Number(r.changes) } }; } };
      return o;
    },
    async batch(stmts) { for (const s of stmts) await s.run(); },
  };
  const sent = [];
  const env = { DB: db, SITE: "https://site.test", API: "https://api.test", MAIL_FROM: "M365.FM <system@m365.fm>", ...(mail ? { EMAIL: { send: async (m) => { sent.push(m); return { messageId: "x" }; } } } : {}) };
  raw.exec("INSERT INTO users(id,provider,sub,name,created) VALUES(1,'x','a','Admin',1),(2,'x','b','Ed',1)");
  raw.exec("INSERT INTO mail_addr(user_id,email,verified,token,created) VALUES(1,'admin@example.com',1,'t',1)");
  return { raw, env, sent };
}
async function call(env, path, user, body, method = "POST") {
  const req = new Request("https://api.test" + path, { method, ...(method === "POST" ? { body: JSON.stringify(body || {}) } : {}) });
  const r = await handleEntityInvite(env, req, new URL(req.url), path, user, J);
  return { status: r.status, j: await r.json() };
}
function withEntities() {
  const old = globalThis.fetch;
  globalThis.fetch = async (u) => String(u).endsWith("/entities.json") ? { json: async () => ({ entities }) } : { ok: false, json: async () => ({}) };
  return () => { globalThis.fetch = old; };
}
const admin = { id: 1, admin: true, name: "Admin" };
const contact = (raw, eid, email, source = "guest", created = 1) => raw.prepare("INSERT INTO entity_contacts(eid,email,name,created,source) VALUES(?,?,?,?,?)").run(eid, email, eid.toUpperCase(), created, source);

test("Variante: MVP/MCT nur als ganzes Wort, Programmfeld zaehlt", () => {
  assert.equal(inviteVariant(entities[0]), "mvp");
  assert.equal(inviteVariant(entities[1]), "mvp");
  assert.equal(inviteVariant(entities[3]), "mvp");
  assert.equal(inviteVariant(entities[2]), "default");
  assert.equal(inviteVariant({ desc: { en: "mvps and AMVP and mct" } }), "default");
  assert.equal(inviteVariant(undefined), "default");
});

test("Mailtext: nur Englisch, passende Variante, Fusszeile, Escaping", () => {
  const env = { SITE: "https://site.test", API: "https://api.test" };
  const inv = { token: "tok", eid: "mvp-person", name: "Mia <b>&", email: "m@x.de" };
  for (const v of ["mvp", "default", "speaker"]) for (const rem of [false, true]) {
    const html = mailBody(env, inv, "Admin", rem, v), text = mailText(env, inv, rem, v);
    for (const t of [html, text, mailSubject(rem, v)]) assert.doesNotMatch(t, /\b(Hallo|Seite|übernehmen|Erinnerung|Diese Nachricht|Verantwortlich|bitte|dich|deine)\b/i);
    assert.match(html, /Claim my page/); assert.match(html, /This isn&#39;t me|This isn't me/);
    assert.match(html, /Controller: M365\.FM, Julius-Hölder-Str 60, 70597 Stuttgart, Germany, mirko\.peters@m365\.fm\./);
    assert.equal(/Quick reminder: /.test(text), rem);
    assert.doesNotMatch(html, /<b>/);
  }
  assert.match(mailBody(env, inv, "", false, "mvp"), /MVP Contribution Tracker/);
  assert.doesNotMatch(mailBody(env, inv, "", false, "default"), /Contribution Tracker/);
  assert.match(mailBody(env, inv, "", false, "default"), /guest exchange/);
  assert.match(mailBody(env, inv, "", false, "speaker"), /speaking at M365Con/);
  assert.equal(mailSubject(false, "default"), "Your guest page on M365.FM – claim it");
  assert.equal(mailSubject(true, "mvp"), "Reminder: your guest page on M365.FM");
  assert.equal(mailSubject(false, "speaker"), "Your speaker page on M365.FM – claim it");
  assert.match(mailBody(env, inv, "", false), /Mia &lt;b&gt;&amp;/);
});

test("send: Anzeigename, Reply-To, technische Absenderadresse, Variante je Entitaet", async () => {
  const restore = withEntities();
  try {
    const { raw, env, sent } = await setup();
    const r = await call(env, "/api/entityinvite/send", admin, { items: [{ eid: "mvp-person", name: "Mia", email: "mia@example.com" }, { eid: "plain-person", name: "Pia", email: "pia@example.com" }] });
    assert.equal(r.status, 200);
    assert.equal(sent.length, 2);
    assert.deepEqual(sent[0].from, { email: "system@m365.fm", name: "Mirko from M365 Show" });
    assert.equal(sent[0].replyTo, "mirko.peters@m365.fm");
    assert.equal(sent[0].subject, "Your guest page on M365.FM – claim it");
    assert.match(sent[0].html, /MVP Contribution Tracker/);
    assert.doesNotMatch(sent[1].html, /Contribution Tracker/);
    assert.ok(sent[0].headers["List-Unsubscribe"]);
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM entity_invites").get().n, 2);
  } finally { restore(); }
});

test("Erinnerung: Praefix, Betreff, Variante speaker bleibt", async () => {
  const restore = withEntities();
  try {
    const { raw, env, sent } = await setup();
    contact(raw, "spk-person", "sven@example.com", "speaker");
    raw.prepare("INSERT INTO entity_invites(token,eid,name,email,by_user,created) VALUES('t1','spk-person','Sven','sven@example.com',1,1)").run();
    await call(env, "/api/entityinvite/contacts", admin, {}, "GET");
    assert.equal(await remindInvites(env), 1);
    assert.equal(sent[0].subject, "Reminder: your speaker page on M365.FM");
    assert.match(sent[0].html, /Quick reminder: thanks again for speaking at M365Con/);
  } finally { restore(); }
});

test("Testmail: nur Admin, nur an die eigene Adresse, keine Einladungszeile, [TEST]-Praefix, MVP-Variante", async () => {
  const restore = withEntities();
  try {
    const { raw, env, sent } = await setup();
    assert.equal((await call(env, "/api/entityinvite/test", { id: 2, editor: true }, { eid: "mvp-person" })).status, 403);
    assert.equal(sent.length, 0);
    const r = await call(env, "/api/entityinvite/test", admin, { eid: "mvp-person", email: "victim@example.com", to: "victim@example.com" });
    assert.equal(r.status, 200); assert.equal(r.j.variant, "mvp");
    assert.equal(sent.length, 1);
    assert.equal(sent[0].to, "admin@example.com");
    assert.equal(sent[0].subject, "[TEST] Your guest page on M365.FM – claim it");
    assert.match(sent[0].html, /MVP Contribution Tracker/);
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM entity_invites").get().n, 0);
    assert.equal((await call(env, "/api/entityinvite/test", admin, { eid: "plain-person" })).j.variant, "default");
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM entity_invites").get().n, 0);
  } finally { restore(); }
});

test("send-batch: nur Admin (403), Probelauf sendet nichts, maskiert, ueberspringt gesperrt/uebernommen", async () => {
  const restore = withEntities();
  try {
    const { raw, env, sent } = await setup();
    contact(raw, "mvp-person", "mia@example.com", "guest", 1);
    contact(raw, "plain-person", "pia@example.com", "guest", 2);
    contact(raw, "c1", "blocked@example.com", "guest", 3);
    contact(raw, "c2", "claimed@example.com", "guest", 4);
    contact(raw, "spk-person", "sven@example.com", "speaker", 5);
    raw.prepare("INSERT INTO invite_block(email,created) VALUES('blocked@example.com',1)").run();
    raw.prepare("INSERT INTO entity_claims(eid,user_id,status,via,created) VALUES('c2',1,'verified','invite',1)").run();
    for (const u of [{ id: 2, editor: true }, { id: 3 }]) assert.equal((await call(env, "/api/entityinvite/send-batch", u, { dry_run: true })).status, 403);
    const d = await call(env, "/api/entityinvite/send-batch", admin, { limit: 50, dry_run: true });
    assert.equal(d.status, 200); assert.equal(d.j.dry_run, true);
    assert.deepEqual(d.j.items.map((x) => [x.eid, x.email, x.variant]), [["mvp-person", "m***@example.com", "mvp"], ["plain-person", "p***@example.com", "default"], ["spk-person", "s***@example.com", "speaker"]]);
    assert.equal(sent.length, 0); assert.equal(raw.prepare("SELECT COUNT(*) n FROM entity_invites").get().n, 0);
    const g = await call(env, "/api/entityinvite/send-batch", admin, {}, "GET");
    assert.deepEqual(g.j.sources, { guest: { contacts: 4, eligible: 2 }, speaker: { contacts: 1, eligible: 1 } });
    const only = await call(env, "/api/entityinvite/send-batch", admin, { dry_run: true, source: "speaker" });
    assert.deepEqual(only.j.items.map((x) => x.eid), ["spk-person"]);
    const r = await call(env, "/api/entityinvite/send-batch", admin, { limit: 50, dry_run: false });
    assert.equal(r.j.sent, 3); assert.equal(sent.length, 3);
    assert.equal(sent[2].subject, "Your speaker page on M365.FM – claim it");
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM entity_invites").get().n, 3);
    assert.equal((await call(env, "/api/entityinvite/send-batch", admin, { dry_run: false })).j.sent, 0);
  } finally { restore(); }
});

test("send-batch: Limit gedeckelt auf 50, Tageslimit 200 gilt", async () => {
  const restore = withEntities();
  try {
    const { raw, env, sent } = await setup();
    for (let i = 0; i < 60; i++) contact(raw, `person-${i}`, `p${i}@example.com`, "guest", i);
    const r = await call(env, "/api/entityinvite/send-batch", admin, { limit: 500 });
    assert.equal(r.j.sent, 50); assert.equal(sent.length, 50);
    raw.prepare("UPDATE ratelimit SET n=198 WHERE k='einv:1'").run();
    const r2 = await call(env, "/api/entityinvite/send-batch", admin, { limit: 10 });
    assert.equal(r2.j.sent, 2); assert.equal(r2.j.rate_limited, true);
    const r3 = await call(env, "/api/entityinvite/send-batch", admin, { limit: 10 });
    assert.equal(r3.status, 429); assert.equal(r3.j.sent, 0);
    assert.equal(sent.length, 52);
  } finally { restore(); }
});

test("Keine Dubletten: eine Einladung je Adresse, auch ueber Gaeste und Speaker und im selben Batch", async () => {
  const restore = withEntities();
  try {
    const { raw, env, sent } = await setup();
    contact(raw, "c1", "same@example.com", "guest", 1);
    contact(raw, "spk-person", "same@example.com", "speaker", 2);   // gleiche Adresse wie Gast
    contact(raw, "c3", "dup@example.com", "guest", 3);
    contact(raw, "c4", "dup@example.com", "guest", 4);              // gleiche Adresse im selben Batch
    contact(raw, "c2", "old@example.com", "speaker", 5);
    raw.prepare("INSERT INTO entity_invites(token,eid,name,email,by_user,created,status) VALUES('o','other-eid','O','old@example.com',1,1,'claimed')").run();
    const d = await call(env, "/api/entityinvite/send-batch", admin, { dry_run: true });
    assert.deepEqual(d.j.items.map((x) => x.eid), ["c1", "c3"]);
    const r = await call(env, "/api/entityinvite/send-batch", admin, {});
    assert.equal(r.j.sent, 2); assert.deepEqual(sent.map((m) => m.to).sort(), ["dup@example.com", "same@example.com"]);
    assert.equal(sent.find((m) => m.to === "same@example.com").subject, "Your guest page on M365.FM – claim it");
    assert.equal((await call(env, "/api/entityinvite/send-batch", admin, {})).j.sent, 0);
    // /send: gleiche Adresse, andere Entitaet -> "already"; im selben Aufruf zweimal -> duplicate_email
    const s = await call(env, "/api/entityinvite/send", admin, { items: [{ eid: "c2", name: "X", email: "same@example.com" }, { eid: "mct-person", name: "Y", email: "new@example.com" }, { eid: "plain-person", name: "Z", email: "new@example.com" }] });
    assert.deepEqual(s.j.results.map((x) => x.error || "ok"), ["already", "ok", "already"]);
  } finally { restore(); }
});

test("Kontakte-Import: source wird gespeichert, Standard guest", async () => {
  const { raw, env } = await setup();
  await call(env, "/api/entityinvite/contacts", admin, { items: [{ eid: "g-one", email: "g@example.com", name: "G" }] });
  await call(env, "/api/entityinvite/contacts", admin, { source: "speaker", items: [{ eid: "s-one", email: "s@example.com", name: "S" }] });
  assert.deepEqual(raw.prepare("SELECT eid,source FROM entity_contacts ORDER BY eid").all().map((x) => ({ ...x })), [{ eid: "g-one", source: "guest" }, { eid: "s-one", source: "speaker" }]);
});
