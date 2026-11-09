import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import worker from "../src/index.js";
import { handleEntityInvite, inviteVariant, mailBody, mailText, mailSubject, personName, remindInvites, resolveVariant, spokeAtCon, VARIANTS } from "../src/entinvite.js";
import * as entinvite from "../src/entinvite.js";
import { mergeStatements } from "../src/identities.js";
import { makeSession } from "../src/util.js";

const J = (data, status = 200, h = {}) => new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json", ...h } });
const entities = [
  { id: "mvp-person", type: "person", name: "Mia MVP", desc: { en: "Mia is a Microsoft MVP for Azure." } },
  { id: "mct-person", type: "person", name: "Max MCT", long: { en: "Trainer, MCT since 2015." } },
  { id: "plain-person", type: "person", name: "Pia Plain", desc: { en: "Consultant. Loves MVPs-like communities and AMVP things." } },
  { id: "prog-person", type: "person", name: "Pro Gram", program: "MVP" },
  { id: "spk-person", type: "person", name: "Sven Speaker", desc: { en: "Speaker." } },
  { id: "c1", type: "person", name: "C One" }, { id: "c2", type: "person", name: "C Two" }, { id: "c3", type: "person", name: "C Three" }, { id: "c4", type: "person", name: "C Four" },
  { id: "acme-org", type: "org", name: "Acme GmbH" },
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
  const env = { DB: db, SITE: "https://site.test", API: "https://api.test", SESSION_SECRET: "test-secret", MAIL_FROM: "M365.FM <system@m365.fm>", ...(mail ? { EMAIL: { send: async (m) => { sent.push(m); return { messageId: "x" }; } } } : {}) };
  raw.exec("INSERT INTO users(id,provider,sub,name,role,created) VALUES(1,'x','a','Admin','admin',1),(2,'x','b','Ed','editor',1),(3,'x','c','Mallory Member','user',1)");
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
const admin = { id: 1, admin: true, name: "Admin" }, editor = { id: 2, editor: true, name: "Ed" }, member = { id: 3, name: "Mallory Member" };
const invite = (raw, token, eid, email, by = 1, created = 1, status = "sent") => raw.prepare("INSERT INTO entity_invites(token,eid,name,email,by_user,created,status) VALUES(?,?,?,?,?,?,?)").run(token, eid, eid.toUpperCase(), email, by, created, status);
const one = (raw, sql, ...a) => { const r = raw.prepare(sql).get(...a); return r ? { ...r } : undefined; };
const contact = (raw, eid, email, source = "guest", created = 1) => raw.prepare("INSERT INTO entity_contacts(eid,email,name,created,source) VALUES(?,?,?,?,?)").run(eid, email, eid.toUpperCase(), created, source);

test("Variante: MVP/MCT nur als ganzes Wort, Programmfeld zaehlt", () => {
  assert.equal(inviteVariant(entities[0]), "mvp");
  assert.equal(inviteVariant(entities[1]), "mvp");
  assert.equal(inviteVariant(entities[3]), "mvp");
  assert.equal(inviteVariant(entities[2]), "default");
  assert.equal(inviteVariant({ desc: { en: "mvps and AMVP and mct" } }), "default");
  assert.equal(inviteVariant(undefined), "default");
});

test("Mailtext: nur Englisch, passende Variante, Fusszeile (gespeicherte Daten, Herkunft, Widerspruch), Escaping", () => {
  const env = { SITE: "https://site.test", API: "https://api.test" };
  const inv = { token: "tok", eid: "mvp-person", name: "Mia <b>&", email: "m@x.de" };
  for (const v of VARIANTS) for (const rem of [false, true]) {
    const html = mailBody(env, inv, "Mallory Member", rem, v), text = mailText(env, inv, "Mallory Member", rem, v);
    for (const t of [html, text, mailSubject(rem, v)]) assert.doesNotMatch(t, /\b(Hallo|Seite|übernehmen|Erinnerung|Diese Nachricht|Verantwortlich|bitte|dich|deine)\b/i);
    assert.match(html, /Claim my page/); assert.match(html, /This isn&#39;t me \/ please remove<\/a>/);
    assert.match(html, /Controller: M365\.FM, Julius-Hölder-Str 60, 70597 Stuttgart, Germany, mirko\.peters@m365\.fm\./);
    assert.equal(/Quick reminder: /.test(text), rem);
    assert.doesNotMatch(html, /<b>/);
    // 322-1: kein "keine Werbung"-Satz; Name UND Adresse gespeichert; Herkunft der Adresse; der Entfernen-Link ist Widerspruch und Loeschung
    for (const t of [html.replace(/&#39;/g, "'"), text]) {
      assert.doesNotMatch(t, /not advertising/i);
      assert.match(t, /M365\.FM stores your name and your e-mail address/);
      assert.match(t, /use the “This isn't me \/ please remove” link above\. That is how you object and have your data deleted/);
      assert.match(t, /remind you at most once/);
      assert.match(t, v === "neutral" ? /Mallory Member entered your name and address on M365\.FM/ : v === "speaker" ? /I have your address from our correspondence about your M365Con session/ : /I have your address from our correspondence about your guest appearance on the M365 Show/);
    }
  }
  assert.match(mailBody(env, inv, "", false, "mvp"), /MVP Contribution Tracker/);
  assert.doesNotMatch(mailBody(env, inv, "", false, "default"), /Contribution Tracker/);
  assert.match(mailBody(env, inv, "", false, "default"), /guest exchange/);
  assert.match(mailBody(env, inv, "", false, "speaker"), /speaking at M365Con/);
  assert.equal(mailSubject(false, "default"), "Your guest page on M365.FM – claim it");
  assert.equal(mailSubject(true, "mvp"), "Reminder: your guest page on M365.FM");
  assert.equal(mailSubject(false, "speaker"), "Your speaker page on M365.FM – claim it");
  assert.equal(mailSubject(false, "neutral"), "Your page on M365.FM – claim it or have it removed");
  assert.equal(mailSubject(true, "neutral"), "Reminder: your page on M365.FM");
  assert.match(mailBody(env, inv, "", false), /Mia &lt;b&gt;&amp;/);
  // neutrale Fassung: nennt das Mitglied, keine Gast-/Speaker-Behauptung, kein Gruss von Mirko; Anzeigename ohne Link und Markup
  for (const t of [mailBody(env, inv, "Mallory Member", false, "neutral"), mailText(env, inv, "Mallory Member", false, "neutral")]) {
    assert.match(t, /Mallory Member added you to M365\.FM/);
    assert.doesNotMatch(t, /guest on the M365 Show|speaking at M365Con|Best,|Mirko\b(?!\.peters@)/);
    assert.match(t, /The M365\.FM team/);
  }
  for (const evil of ["Eve https://evil.example/login", "Eve www.evil.example", "evil.example today", "eve@evil.example", "E".repeat(61), ""]) {
    const t = mailBody(env, inv, evil, false, "neutral") + mailText(env, inv, evil, false, "neutral");
    assert.doesNotMatch(t, /evil\.example|EEEE/); assert.match(t, /A community member added you/); assert.match(t, /A community member entered your name and address/);
  }
  assert.match(mailBody(env, inv, "Eve & <i>Co", false, "neutral"), /<p>Eve &amp; iCo added you to M365\.FM/);
  assert.match(mailText(env, inv, "J.R. Müller-O'Neil Jr.", false, "neutral"), /J\.R\. Müller-O'Neil Jr\. added you/);
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
    for (const m of sent) assert.doesNotMatch(m.html + m.text, /m365con\.net|Learn more/, "322-1: kein M365Con-Banner unter Einladungen");
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

// ---- Befunde aus der Gegenpruefung von #322 ----
const session = (raw, title, start, speakers, handle) => {
  const ev = one(raw, "SELECT id FROM events WHERE handle=?", handle) || { id: Number(raw.prepare("INSERT INTO events(handle,owner_id,title,start,created,updated) VALUES(?,1,?,?,1,1)").run(handle, handle, start.slice(0, 10)).lastInsertRowid) };
  raw.prepare("INSERT INTO event_sessions(event_id,title,start,speakers,status,proposer_id,created) VALUES(?,?,?,?,'live',1,1)").run(ev.id, title, start, JSON.stringify(speakers));
};

test("322-4: Mitglieder und Redaktion laden neutral ein (Absender M365.FM, nennt das Mitglied), persoenlich von Mirko nur der Admin", async () => {
  const restore = withEntities();
  try {
    const { raw, env, sent } = await setup();
    raw.prepare("INSERT INTO entity_rev(eid,data,summary,user_id,status,created) VALUES('plain-person','{}','x',3,'pending',1)").run();
    const r = await call(env, "/api/entityinvite/send", member, { eid: "plain-person", name: "Pia Plain", email: "pia@example.com" });
    assert.deepEqual(r.j.results, [{ eid: "plain-person", ok: true }]);
    assert.deepEqual(sent[0].from, { email: "system@m365.fm", name: "M365.FM" });
    assert.equal(sent[0].replyTo, undefined);
    assert.equal(sent[0].subject, "Your page on M365.FM – claim it or have it removed");
    for (const t of [sent[0].html, sent[0].text]) {
      assert.match(t, /Mallory Member added you to M365\.FM/);
      assert.match(t, /Mallory Member entered your name and address on M365\.FM to send you this invitation/);
      assert.doesNotMatch(t, /guest on the M365 Show|speaking at M365Con|Best,|m365con\.net/);
    }
    // Anrede: nur ein Name, kein Text mit Link, Adresse oder Hostname
    const names = ["Jane, please confirm your login at https://evil.example/m365 today", "Jane www.evil.example", "Jane (jane@evil.example)", "Jane evil.example today", "Jane\nplease log in", "J".repeat(61)];
    for (const part of [names.slice(0, 3), names.slice(3)]) {   // Mitglieder: hoechstens 3 je Aufruf
      const bad = await call(env, "/api/entityinvite/send", member, { items: part.map((name) => ({ eid: "plain-person", name, email: "jane@victim.example" })) });
      assert.deepEqual(bad.j.results, part.map(() => ({ eid: "plain-person", error: "bad_input" })));
    }
    // ... und keine kurze Nachricht: Ziffern und weitere Satzzeichen (Telefonnummer, Aufforderung) gehoeren in keinen Namen
    const msgs = ["Jane, call +49 170 1234567 now", "Jane – urgent: reply with your password", "Jane 0170 1234567"];
    assert.deepEqual((await call(env, "/api/entityinvite/send", member, { items: msgs.map((name) => ({ eid: "plain-person", name, email: "jane@victim.example" })) })).j.results, msgs.map(() => ({ eid: "plain-person", error: "bad_input" })));
    assert.equal(sent.length, 1);
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM entity_invites").get().n, 1);
    // Redaktion: ebenfalls neutral; gespeicherte Kontaktadressen (Mirkos Korrespondenz) schreibt nur der Admin an
    contact(raw, "c1", "c1@example.com");
    assert.deepEqual((await call(env, "/api/entityinvite/send", editor, { eid: "c1" })).j.results, [{ eid: "c1", error: "bad_input" }]);
    assert.deepEqual((await call(env, "/api/entityinvite/send", editor, { eid: "c2", name: "C. Two-O'Neil Jr.", email: "c2@example.com" })).j.results, [{ eid: "c2", ok: true }]);
    assert.equal(sent[1].from.name, "M365.FM"); assert.match(sent[1].text, /^Hi C\. Two-O'Neil Jr\.,\n\nEd added you to M365\.FM/);
    // Admin: Person -> persoenlich (Kontakt per ID), Firma -> neutral (eine Firma war kein Podcast-Gast)
    assert.deepEqual((await call(env, "/api/entityinvite/send", admin, { items: [{ eid: "c1" }, { eid: "acme-org", name: "Acme", email: "info@acme.example" }] })).j.results, [{ eid: "c1", ok: true }, { eid: "acme-org", ok: true }]);
    assert.equal(sent[2].from.name, "Mirko from M365 Show"); assert.equal(sent[2].replyTo, "mirko.peters@m365.fm"); assert.match(sent[2].text, /being a guest on the M365 Show/);
    assert.equal(sent[3].from.name, "M365.FM"); assert.match(sent[3].text, /Admin added you to M365\.FM/); assert.doesNotMatch(sent[3].text, /guest on the M365 Show/);
    // Erinnerung in derselben Fassung: Mitglied neutral (mit Namen), Admin persoenlich; geloeschtes Konto des Einladenden -> ohne Namen
    raw.exec("UPDATE entity_invites SET created=1; UPDATE entity_invites SET by_user=0 WHERE eid='c2'");
    sent.length = 0;
    assert.equal(await remindInvites(env), 4);
    const by = (to) => sent.find((m) => m.to === to);
    assert.equal(by("pia@example.com").subject, "Reminder: your page on M365.FM"); assert.match(by("pia@example.com").text, /Quick reminder: Mallory Member added you/); assert.equal(by("pia@example.com").from.name, "M365.FM");
    assert.match(by("c2@example.com").text, /Quick reminder: A community member added you/);
    assert.equal(by("c1@example.com").subject, "Reminder: your guest page on M365.FM"); assert.equal(by("c1@example.com").from.name, "Mirko from M365 Show");
    assert.equal(by("info@acme.example").subject, "Reminder: your page on M365.FM");
    for (const m of sent) assert.doesNotMatch(m.html + m.text, /m365con\.net/);
  } finally { restore(); }
});

test("322-8: Speaker-Fassung ohne Kontaktzeile nur nach einer wirklich gehaltenen M365Con-Session", async () => {
  const restore = withEntities();
  try {
    const { raw, env, sent } = await setup();
    session(raw, "Talk", "2026-03-01T10:00", [{ n: "Pia Plain", e: "plain-person", s: "confirmed" }], "other-conf-2026");       // fremdes Event
    session(raw, "Talk", "2026-01-13T10:00", [{ n: "C One", e: "c1", s: "confirmed", o: 1 }, { n: "C Three", e: "c3", s: "declined" }], "m365con-2026");
    session(raw, "Talk", "2099-01-12T10:00", [{ n: "C Two", e: "c2", s: "confirmed" }], "m365con-2027");                       // steht erst im Programm
    session(raw, "Talk", "2026-09-15T10:00", [{ h: "c4", n: "C Four", e: "c4", s: "invited" }], "m365con-dach-2026");          // Profil-Zuordnung noch offen, gesprochen hat die Person
    session(raw, "Talk", "2026-02-01T10:00", [{ n: "Max MCT", e: "mct-person", s: "confirmed" }], "m365con-fake");                // Mitglieder-Event mit aehnlichem Handle
    assert.deepEqual(await Promise.all(["plain-person", "c1", "c2", "c3", "c4", "mct-person"].map((e) => spokeAtCon(env.DB, e))), [false, true, false, false, true, false]);
    const r = await call(env, "/api/entityinvite/send", admin, { items: [{ eid: "plain-person", name: "Pia", email: "pia@example.com" }, { eid: "c1", name: "C One", email: "c1@example.com" }, { eid: "c2", name: "C Two", email: "c2@example.com" }, { eid: "mct-person", name: "Max", email: "max@example.com" }] });
    assert.deepEqual(r.j.results.map((x) => x.ok), [true, true, true, true]);
    assert.equal(sent[0].subject, "Your guest page on M365.FM – claim it"); assert.doesNotMatch(sent[0].text, /speaking at M365Con/);
    assert.equal(sent[1].subject, "Your speaker page on M365.FM – claim it"); assert.match(sent[1].text, /thanks again for speaking at M365Con/);
    assert.equal(sent[2].subject, "Your guest page on M365.FM – claim it");
    assert.equal(sent[3].subject, "Your guest page on M365.FM – claim it"); assert.match(sent[3].text, /MVP Contribution Tracker/);
    // Kontaktquelle (Mirkos Speakerliste) bleibt massgeblich; Nicht-Personen und Nicht-Admins nie persoenlich
    contact(raw, "spk-person", "sven@example.com", "speaker");
    assert.equal(await resolveVariant(env.DB, "spk-person", entities[4]), "speaker");
    assert.equal(await resolveVariant(env.DB, "c1", entities[5], undefined, false), "neutral");
    assert.equal(await resolveVariant(env.DB, "acme-org", entities.at(-1), "speaker"), "neutral");
  } finally { restore(); }
});

test("322-9: Testmail zeigt jede Fassung (variant), ohne Angabe die des echten Versands", async () => {
  const restore = withEntities();
  try {
    const { raw, env, sent } = await setup();
    contact(raw, "spk-person", "sven@example.com", "speaker");
    const auto = await call(env, "/api/entityinvite/test", admin, { eid: "spk-person" });
    assert.equal(auto.j.variant, "speaker"); assert.equal(sent[0].subject, "[TEST] Your speaker page on M365.FM – claim it");
    assert.equal((await call(env, "/api/entityinvite/send-batch", admin, { dry_run: true })).j.items[0].variant, "speaker", "Vorschau und Versand stimmen ueberein");
    const subject = { default: "[TEST] Your guest page on M365.FM – claim it", mvp: "[TEST] Your guest page on M365.FM – claim it", speaker: "[TEST] Your speaker page on M365.FM – claim it", neutral: "[TEST] Your page on M365.FM – claim it or have it removed" };
    const mark = { default: /guest exchange/, mvp: /Handy for your next MVP renewal/, speaker: /speaking at M365Con/, neutral: /Admin added you to M365\.FM/ };
    for (const v of VARIANTS) {
      sent.length = 0;
      const r = await call(env, "/api/entityinvite/test", admin, { eid: "plain-person", variant: v });
      assert.equal(r.status, 200); assert.equal(r.j.variant, v);
      assert.equal(sent[0].to, "admin@example.com"); assert.equal(sent[0].subject, subject[v]); assert.match(sent[0].text, mark[v]);
      assert.equal(sent[0].from.name, v === "neutral" ? "M365.FM" : "Mirko from M365 Show");
      assert.doesNotMatch(sent[0].html + sent[0].text, /m365con\.net/);
    }
    assert.equal((await call(env, "/api/entityinvite/test", admin, { eid: "plain-person", variant: "nope" })).j.variant, "default");
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM entity_invites").get().n, 0);
  } finally { restore(); }
});

test("322-2: One-Click-Abmeldung (RFC 8058, POST ohne Sitzung und ohne x-requested-with) sperrt und loescht; GET fragt nur nach; sonst bleibt der CSRF-Schutz", async () => {
  const restore = withEntities();
  try {
    const { raw, env, sent } = await setup();
    contact(raw, "mvp-person", "mia@example.com"); contact(raw, "plain-person", "pia@example.com");
    assert.equal((await call(env, "/api/entityinvite/send-batch", admin, {})).j.sent, 2);
    assert.equal(sent[0].headers["List-Unsubscribe-Post"], "List-Unsubscribe=One-Click");
    const url = (m) => /^<(https:\/\/api\.test\/api\/entityinvite\/decline\?t=[\w-]+)>$/.exec(m.headers["List-Unsubscribe"])[1];
    // GET (Link-Pruefer eines Mailfilters, Klick im Browser): nur die Rueckfrage, nichts geaendert
    const get = await worker.fetch(new Request(url(sent[1])), env);
    assert.equal(get.status, 200); assert.match(await get.text(), /<form method="post"><button type="submit"/);
    assert.equal(one(raw, "SELECT status FROM entity_invites WHERE eid='plain-person'").status, "sent");
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM invite_block").get().n, 0);
    // POST des Mailanbieters: kein Cookie, kein Zusatz-Header
    const post = await worker.fetch(new Request(url(sent[0]), { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: "List-Unsubscribe=One-Click" }), env);
    assert.equal(post.status, 200);
    assert.deepEqual(raw.prepare("SELECT email FROM invite_block").all().map((x) => x.email), ["mia@example.com"]);
    const row = one(raw, "SELECT status,name,email FROM entity_invites WHERE eid='mvp-person'");
    assert.equal(row.status, "declined"); assert.equal(row.name, ""); assert.doesNotMatch(row.email, /@/);
    assert.equal(one(raw, "SELECT 1 x FROM entity_contacts WHERE eid='mvp-person'"), undefined, "Kontaktdaten geloescht");
    const note = sent.filter((m) => m.to === "admin@example.com");   // das Team erfaehrt, welche Seite zu pruefen ist - ohne die Adresse der Person
    assert.equal(note.length, 1); assert.equal(note[0].subject, "Einladung abgelehnt: Seite mvp-person prüfen und entfernen");
    assert.match(note[0].html, /https:\/\/site\.test\/entity\/mvp-person\//); assert.doesNotMatch(note[0].html, /mia@example\.com|Mia/);
    assert.equal((await worker.fetch(new Request(url(sent[0]), { method: "POST", body: "List-Unsubscribe=One-Click" }), env)).status, 200, "zweiter Klick: schon erledigt");
    assert.equal(sent.filter((m) => m.to === "admin@example.com").length, 1, "kein zweiter Hinweis");
    assert.equal((await worker.fetch(new Request(url(sent[0])), env)).status, 200);
    assert.equal((await worker.fetch(new Request("https://api.test/api/entityinvite/decline?t=nope", { method: "POST" }), env)).status, 404);
    // Rueckfrage-Knopf im Browser (Formular-POST, ebenfalls ohne Zusatz-Header)
    assert.equal((await worker.fetch(new Request(url(sent[1]), { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: "" }), env)).status, 200);
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM invite_block").get().n, 2);
    // keine Erinnerung, keine neue Einladung, kein Wieder-Import
    raw.exec("UPDATE entity_invites SET created=1"); sent.length = 0;
    assert.equal(await remindInvites(env), 0); assert.equal(sent.length, 0);
    assert.equal((await call(env, "/api/entityinvite/contacts", admin, { items: [{ eid: "mvp-person", email: "mia@example.com", name: "Mia" }, { eid: "c1", email: "c1@example.com", name: "C One" }] })).j.saved, 1);
    assert.deepEqual(raw.prepare("SELECT eid FROM entity_contacts").all().map((x) => x.eid), ["c1"]);
    assert.deepEqual((await call(env, "/api/entityinvite/send", admin, { eid: "c2", name: "Mia", email: "mia@example.com" })).j.results, [{ eid: "c2", error: "blocked" }]);
    // alle anderen schreibenden Routen brauchen weiter den Zusatz-Header
    const cookie = `m365s=${await makeSession(env, 1)}`;
    for (const path of ["/api/entityinvite/accept", "/api/entityinvite/send", "/api/entityinvite/send-batch", "/api/entityinvite/test", "/api/entityinvite/contacts"]) {
      const r = await worker.fetch(new Request("https://api.test" + path, { method: "POST", headers: { cookie, "content-type": "application/json" }, body: "{}" }), env);
      assert.equal(r.status, 400, path); assert.deepEqual(await r.json(), { error: "bad_request" });
    }
  } finally { restore(); }
});

test("322-7: keine Erinnerung an Gesperrte, Ablehnende und bei uebernommener oder angefragter Seite", async () => {
  const restore = withEntities();
  try {
    const { raw, env, sent } = await setup();
    invite(raw, "t1", "plain-person", "pia@example.com");      // Seite ueber den normalen Weg uebernommen (status bleibt 'sent')
    invite(raw, "t2", "c1", "bob@example.com");                // Adresse ueber eine andere Einladung gesperrt
    invite(raw, "t3", "c2", "cy@example.com");                 // Uebernahme in Pruefung: die Annahme per Token wuerde scheitern
    invite(raw, "t4", "c3", "dan@example.com", 1, 1, "declined");
    invite(raw, "t5", "mvp-person", "mia@example.com");        // offen -> wird erinnert
    invite(raw, "t6", "c4", "eve@example.com");                // abgelehnter Claim eines anderen zaehlt nicht
    invite(raw, "t7", "mct-person", "max@example.com", 1, Math.floor(Date.now() / 1000));   // noch keine 7 Tage alt
    raw.exec(`INSERT INTO entity_claims(eid,user_id,status,via,created) VALUES('plain-person',3,'verified','linkedin',1),('c2',3,'pending','linkedin',1),('c4',3,'rejected','linkedin',1);
      INSERT INTO invite_block(email,created) VALUES('bob@example.com',1)`);
    assert.equal(await remindInvites(env), 2);
    assert.deepEqual(sent.map((m) => m.to).sort(), ["eve@example.com", "mia@example.com"]);
    assert.deepEqual(raw.prepare("SELECT token,reminded FROM entity_invites ORDER BY token").all().map((x) => [x.token, x.reminded]), [["t1", 3], ["t2", 3], ["t3", 3], ["t4", 0], ["t5", 1], ["t6", 1], ["t7", 0]]);
    // auch spaeter keine verspaetete Erinnerung, wenn der Claim wieder entfaellt
    raw.exec("DELETE FROM entity_claims; DELETE FROM invite_block"); sent.length = 0;
    assert.equal(await remindInvites(env), 0); assert.equal(sent.length, 0);
  } finally { restore(); }
});

test("322-10: zweiter paralleler Sammelversand wird mit 409 abgewiesen (kein 500, keine weiteren 50), gleichzeitige Einzel-Einladungen verlieren sauber", async () => {
  const restore = withEntities();
  try {
    const { raw, env, sent } = await setup();
    for (let i = 0; i < 150; i++) contact(raw, `person-${i}`, `p${i}@example.com`, "guest", i);
    const [a, b] = await Promise.all([call(env, "/api/entityinvite/send-batch", admin, { limit: 50 }), call(env, "/api/entityinvite/send-batch", admin, { limit: 50 })]);
    assert.deepEqual([a.status, b.status].sort(), [200, 409]);
    assert.deepEqual((a.status === 409 ? a : b).j, { error: "busy" });
    assert.equal((a.status === 200 ? a : b).j.sent, 50); assert.equal(sent.length, 50);
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM entity_invites").get().n, 50);
    assert.equal(one(raw, "SELECT 1 x FROM meta WHERE k='einvite_batch'"), undefined, "Sperre nach dem Lauf wieder frei");
    assert.equal((await call(env, "/api/entityinvite/send-batch", admin, { limit: 50, dry_run: true })).status, 200);
    assert.equal((await call(env, "/api/entityinvite/send-batch", admin, { limit: 50 })).j.sent, 50);
    // haengengebliebene Sperre (abgebrochener Lauf): der Probelauf geht trotzdem, der Versand nach Ablauf wieder
    raw.prepare("INSERT INTO meta(k,v) VALUES('einvite_batch',?)").run(String(Math.floor(Date.now() / 1000) + 200));
    assert.equal((await call(env, "/api/entityinvite/send-batch", admin, { limit: 5, dry_run: true })).j.items.length, 5);
    assert.equal((await call(env, "/api/entityinvite/send-batch", admin, { limit: 5 })).status, 409);
    raw.prepare("UPDATE meta SET v=? WHERE k='einvite_batch'").run(String(Math.floor(Date.now() / 1000) - 1));
    assert.equal((await call(env, "/api/entityinvite/send-batch", admin, { limit: 5 })).j.sent, 5);
    assert.equal(sent.length, 105);
    // zwei gleichzeitige Einzel-Einladungen an dieselbe Adresse (verschiedene Entitaeten): genau eine Mail, kein Fehler
    sent.length = 0;
    const [x, y] = await Promise.all([call(env, "/api/entityinvite/send", admin, { eid: "c1", name: "X", email: "same@example.com" }), call(env, "/api/entityinvite/send", admin, { eid: "c2", name: "X", email: "same@example.com" })]);
    assert.deepEqual([x.j.results[0].error || "ok", y.j.results[0].error || "ok"].sort(), ["already", "ok"]);
    assert.equal(sent.length, 1); assert.equal(raw.prepare("SELECT COUNT(*) n FROM entity_invites WHERE email='same@example.com'").get().n, 1);
  } finally { restore(); }
});

// Nur die eigene Definition ist verboten. Ein Import namens maskEmail aus einem anderen Modul (#319 holt ihn aus perm.js) ist erlaubt: der Helfer
// dieser Datei heisst maskAddr, beide Bindungen vertragen sich.
test("322-5: entinvite.js definiert kein eigenes maskEmail (Helfer aus claimverify.js unter anderem Namen)", () => {
  const js = readFileSync(new URL("../src/entinvite.js", import.meta.url), "utf8");
  assert.doesNotMatch(js, /(?:const|let|var|function)\s+maskEmail\b/);
  assert.match(js, /import \{ maskEmail as maskAddr \} from "\.\/claimverify\.js";/);
  assert.doesNotMatch(js, /(?:const|let|var|function)\s+maskAddr\b/);
});

test("Namensregel der Anrede (Mitglieder, Redaktion): Buchstaben, Leerzeichen, Punkt, Apostroph, Bindestrich; 2 bis 60 Zeichen", () => {
  for (const n of ["Pia Plain", "C. Two-O'Neil Jr.", "Jean-Luc O’Brien", "María José García de la Fuente", "Søren Ångström", "Jo", "J.R.R. Tolkien", "王小明", "अमित शर्मा", "J".repeat(60)]) assert.equal(personName(n), true, n);
  for (const n of ["", "J", "J".repeat(61), "Jane, call +49 170 1234567 now", "Jane – urgent: reply with your password", "Jane 2", "Jane!", "Jane: hi", "Jane (HR)", "Jane & Joe", "Jane\nDoe", "Jane\tDoe", " Jane", "-Jane", "jane@evil.example", "Jane evil.example/x", "Jane_Doe", "Jane=Doe", "Jane www.evil.example", "Jane evil.example today", "www.evil.example", "Jane пример.рф", "Jane \u{1F600}"]) assert.equal(personName(n), false, JSON.stringify(n));
});

// Der Loeschhelfer heisst nach dem, was er loescht: inviter.js (#320, Einlader-Kuerzel) bringt ein eigenes deleteUserInvites mit, index.js importiert beide.
test("Kontoloeschung: der Helfer dieser Datei heisst deleteUserEntityInvites (kein Export deleteUserInvites)", () => {
  assert.equal(typeof entinvite.deleteUserEntityInvites, "function");
  assert.equal(entinvite.deleteUserInvites, undefined);
  const idx = readFileSync(new URL("../src/index.js", import.meta.url), "utf8");
  assert.match(idx, /import \{[^}]*\bdeleteUserEntityInvites\b[^}]*\} from "\.\/entinvite\.js";/);
  assert.match(idx, /await deleteUserEntityInvites\(db, id\);/);
});

test("Kontoloeschung und Zusammenfuehren: Kontaktadresse und Einladungen der Person verlieren Name und Adresse, verschickte Einladungen bleiben gueltig", async () => {
  const restore = withEntities();
  try {
    const { raw, env, sent } = await setup();
    raw.exec(`INSERT INTO users(id,provider,sub,name,created) VALUES(4,'x','d','Pia Plain',1),(5,'x','e','Other',1);
      INSERT INTO mail_addr(user_id,email,verified,token,created) VALUES(4,'pia@example.com',1,'',1),(5,'c3@example.com',0,'tok',1);
      INSERT INTO entity_claims(eid,user_id,status,via,created) VALUES('plain-person',4,'verified','invite',1)`);
    contact(raw, "plain-person", "pia.work@example.com");           // eigene, bestaetigte Seite (andere Adresse als im Konto)
    contact(raw, "c1", "pia@example.com", "speaker");               // zweite Kontaktzeile mit der bestaetigten Kontoadresse
    contact(raw, "c2", "other@example.com");                        // fremd
    contact(raw, "c3", "c3@example.com");                           // Adresse von Konto 5 nur unbestaetigt eingetragen
    invite(raw, "i1", "plain-person", "pia.work@example.com", 1, 1, "claimed");
    invite(raw, "i2", "c1", "pia@example.com");
    invite(raw, "i5", "plain-person", "pia.alt@example.com", 3);     // weitere, noch offene Einladung zur eigenen Seite
    invite(raw, "i3", "c2", "other@example.com", 4);                // von Pia selbst verschickt
    invite(raw, "i4", "c3", "c3@example.com", 5);
    // Zusammenfuehren 5 -> 4: verschickte Einladungen wandern mit (entity_contacts hat keinen Nutzerbezug)
    for (const st of await mergeStatements(env.DB, 5, 4)) await st.run();
    assert.equal(one(raw, "SELECT by_user FROM entity_invites WHERE token='i4'").by_user, 4);
    const res = await worker.fetch(new Request("https://api.test/api/me", { method: "DELETE", headers: { cookie: `m365s=${await makeSession(env, 4)}`, "x-requested-with": "m365" } }), env);
    assert.equal(res.status, 200);
    assert.deepEqual(raw.prepare("SELECT eid FROM entity_contacts ORDER BY eid").all().map((x) => x.eid), ["c2", "c3"]);
    const inv = Object.fromEntries(raw.prepare("SELECT token,name,email,by_user,status,reminded FROM entity_invites").all().map((x) => [x.token, { ...x }]));
    for (const t of ["i1", "i2", "i5"]) { assert.equal(inv[t].name, ""); assert.doesNotMatch(inv[t].email, /@/); }
    assert.equal(inv.i1.status, "claimed"); assert.equal(inv.i2.reminded, 3);
    assert.deepEqual([inv.i3.email, inv.i3.by_user, inv.i3.status], ["other@example.com", 0, "sent"]);
    assert.deepEqual([inv.i4.email, inv.i4.by_user], ["c3@example.com", 0]);
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM entity_invites WHERE email LIKE '%pia%' OR name LIKE '%PLAIN%'").get().n, 0);
    // die verschickte Einladung bleibt nutzbar (Entfernen-Link) und wird ohne Namen des geloeschten Kontos erinnert; an entfernte Adressen geht nichts
    assert.equal(await remindInvites(env), 2);
    assert.deepEqual(sent.map((m) => m.to).sort(), ["c3@example.com", "other@example.com"]);
    assert.match(sent[0].text, /A community member added you/);
    assert.equal((await worker.fetch(new Request("https://api.test/api/entityinvite/decline?t=i3", { method: "POST" }), env)).status, 200);
    assert.equal((await worker.fetch(new Request("https://api.test/api/entityinvite/decline?t=i2", { method: "POST" }), env)).status, 200);
    assert.deepEqual(raw.prepare("SELECT email FROM invite_block").all().map((x) => x.email), ["other@example.com"], "eine schon entfernte Adresse landet nicht als Platzhalter auf der Sperrliste");
  } finally { restore(); }
});

test("Migration 0040: Spalte source per Migration oder Laufzeit-Absicherung, beides vertraegt sich", async () => {
  const { DatabaseSync } = await import("node:sqlite");
  const dir = new URL("../migrations/", import.meta.url), files = readdirSync(dir).filter((f) => f.endsWith(".sql")).sort();
  assert.ok(files.includes("0040_entity_contacts_source.sql"));
  const cols = (raw) => raw.prepare("PRAGMA table_info(entity_contacts)").all().map((c) => c.name);
  // 1) Worker vor der Migration (Spalte fehlt): die Laufzeit-Absicherung legt sie an, der Import mit source laeuft
  const raw = new DatabaseSync(":memory:");
  for (const f of files.filter((f) => !f.startsWith("0040_"))) raw.exec(readFileSync(new URL(f, dir), "utf8"));
  assert.ok(!cols(raw).includes("source"));
  const db = { prepare(sql) { let args = []; const o = { bind(...a) { args = a; return o; }, all: async () => ({ results: raw.prepare(sql).all(...args) }), first: async () => raw.prepare(sql).get(...args) ?? null, run: async () => { const r = raw.prepare(sql).run(...args); return { meta: { changes: Number(r.changes) } }; } }; return o; }, async batch(stmts) { for (const s of stmts) await s.run(); } };
  const fresh = await import("../src/entinvite.js?vor-0040");   // eigenes Modul: ensure() laeuft je Instanz nur einmal
  const req = new Request("https://api.test/api/entityinvite/contacts", { method: "POST", body: JSON.stringify({ source: "speaker", items: [{ eid: "s-one", email: "s@example.com", name: "S" }] }) });
  assert.equal((await (await fresh.handleEntityInvite({ DB: db }, req, new URL(req.url), "/api/entityinvite/contacts", admin, J)).json()).saved, 1);
  assert.equal(one(raw, "SELECT source FROM entity_contacts WHERE eid='s-one'").source, "speaker");
  // 2) Migration auf dem Stand der Tabelle aus 0001 (ohne Spalte): laeuft durch, vorhandene Zeilen bekommen 'guest'
  const raw2 = new DatabaseSync(":memory:");
  for (const f of files.filter((f) => f < "0040_")) raw2.exec(readFileSync(new URL(f, dir), "utf8"));
  raw2.exec("INSERT INTO entity_contacts(eid,email,name,created) VALUES('old','o@example.com','O',1)");
  raw2.exec(readFileSync(new URL("0040_entity_contacts_source.sql", dir), "utf8"));
  assert.equal(one(raw2, "SELECT source FROM entity_contacts WHERE eid='old'").source, "guest");
  assert.deepEqual(cols(raw2), ["eid", "email", "name", "created", "source"]);
});
