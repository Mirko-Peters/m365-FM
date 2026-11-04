import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import worker from "../src/index.js";
import { claimEntity, claimLinkedinEntity, handleEvents } from "../src/events.js";
import { ensurePastEvents, linkSpeakerEntities } from "../src/pastevents.js";

const J = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json" } });
const entities = [
  { id: "contact-person", type: "person", name: "Alex Example", same_as: ["https://www.linkedin.com/in/alex"] },
  { id: "invite-person", type: "person", name: "Casey Example", same_as: ["https://www.linkedin.com/in/casey"] },
  { id: "speaker-person", type: "person", name: "Jordan Example", same_as: ["https://www.linkedin.com/in/jordan"] },
  { id: "guest-person", type: "person", name: "Taylor Example", same_as: ["https://www.linkedin.com/in/taylor"] },
  { id: "pending-person", type: "person", name: "Morgan Example", same_as: ["https://www.linkedin.com/in/morgan"] },
  { id: "claimed-person", type: "person", name: "Sam Example", same_as: ["https://www.linkedin.com/in/sam"] },
];

async function setup() {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:");
  const dir = new URL("../migrations/", import.meta.url);
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
  const env = { DB: db, SITE: "https://site.test", API: "https://api.test", SESSION_SECRET: "test-secret", LINKEDIN_CLIENT_ID: "client", LINKEDIN_CLIENT_SECRET: "secret" };
  return { raw, env };
}
function addUser(raw, id, name = "LinkedIn User") {
  raw.prepare("INSERT INTO users(id,provider,sub,name,created) VALUES(?,'linkedin',?,?,1)").run(id, `sub-${id}`, name);
}
function withEntities() {
  const old = globalThis.fetch;
  globalThis.fetch = async (input) => String(input).endsWith("/entities.json") ? { json: async () => ({ entities }) } : { ok: false, json: async () => ({}) };
  return () => { globalThis.fetch = old; };
}
async function adminDecision(env, eid, ok) {
  const req = new Request("https://api.test/api/admin/entity/claim", { method: "POST", body: JSON.stringify({ eid, ok }) });
  return handleEvents(env, req, new URL(req.url), "/api/admin/entity/claim", { id: 99, admin: true }, J);
}

test("LinkedIn: verifizierte E-Mail aus Kontakt, Einladung, Event oder Gästeprofil bestätigt automatisch", async () => {
  const { raw, env } = await setup(), restore = withEntities();
  try {
    for (let id = 1; id <= 4; id++) addUser(raw, id);
    raw.exec(`
      INSERT INTO entity_contacts(eid,email,name,created) VALUES('contact-person','Alex@Example.com','Alex',1);
      INSERT INTO entity_invites(token,eid,name,email,by_user,created,status) VALUES('tok','invite-person','Casey','CASEY@example.com',1,1,'declined');
      INSERT INTO event_sessions(event_id,title,abstract,start,end,room,track,level,lang,topics,speakers,recording_url,status,proposer_id,created)
        VALUES(1,'','','','','','','','','[]','[{"e":"speaker-person","email":"jordan@example.com"}]','','live',1,1);
      INSERT INTO profiles(user_id,public,handle,updated) VALUES(4,1,'guest-handle',1);
      INSERT INTO guest_listings(user_id,kind,created,updated) VALUES(4,'speaker',1,1);
      INSERT INTO profile_private(user_id,email,updated) VALUES(4,'taylor@example.com',1);
      INSERT INTO event_sessions(event_id,title,abstract,start,end,room,track,level,lang,topics,speakers,recording_url,status,proposer_id,created)
        VALUES(2,'','','','','','','','','[]','[{"e":"guest-person","h":"guest-handle"}]','','live',1,1);
    `);
    const cases = [["contact-person", "alex@example.com"], ["invite-person", "casey@example.com"], ["speaker-person", "jordan@example.com"], ["guest-person", "taylor@example.com"]];
    for (const [i, [eid, email]] of cases.entries()) {
      const result = await claimLinkedinEntity(env, { id: i + 1, provider: "linkedin" }, { email, email_verified: true }, eid);
      assert.deepEqual(result, { status: "verified" });
      assert.equal(raw.prepare("SELECT status FROM entity_claims WHERE eid=?").get(eid).status, "verified");
    }
  } finally { restore(); raw.close(); }
});

test("LinkedIn: unverifizierte oder abweichende E-Mail bleibt pending und speichert kein unbestätigtes Ziel", async () => {
  const { raw, env } = await setup(), restore = withEntities();
  try {
    addUser(raw, 1, "Morgan Example");
    raw.prepare("INSERT INTO entity_contacts(eid,email,name,created) VALUES('pending-person','known@example.com','Morgan',1)").run();
    raw.prepare("INSERT INTO mail_addr(user_id,email,verified,created) VALUES(1,'account@example.com',1,1)").run();
    const unverified = await claimLinkedinEntity(env, { id: 1, provider: "linkedin" }, { email: "known@example.com", email_verified: false, name: "Morgan Example", picture: "https://media.licdn.com/photo.jpg" }, "pending-person");
    assert.deepEqual(unverified, { status: "pending" });
    assert.equal(raw.prepare("SELECT status FROM entity_claims WHERE eid='pending-person'").get().status, "pending");
    assert.deepEqual({ ...raw.prepare("SELECT email,picture FROM entity_claim_review WHERE eid='pending-person'").get() }, { email: "account@example.com", picture: "https://media.licdn.com/photo.jpg" });
    const other = await claimLinkedinEntity(env, { id: 2, provider: "linkedin" }, { email: "different@example.com", email_verified: true }, "claimed-person");
    assert.deepEqual(other, { status: "pending" });
    assert.equal(raw.prepare("SELECT status FROM entity_claims WHERE eid='claimed-person'").get().status, "pending");
  } finally { restore(); raw.close(); }
});

test("LinkedIn: E-Mail aus Event-Import bleibt am Speaker und kann nach Entitätsverknüpfung matchen", async () => {
  const { raw, env } = await setup(), old = globalThis.fetch;
  addUser(raw, 1, "Event Owner");
  addUser(raw, 2, "Jordan Example");
  env.ADMIN_SUBS = "linkedin:sub-1";
  const program = { speakers: { s1: { name: "Jordan Example", email: "Jordan@Example.com" } }, sessions: [{ title: "Test", start: "2026-01-12T08:00", duration: 30, speaker_ids: ["s1"], topics: [] }] };
  globalThis.fetch = async (input) => {
    const url = String(input);
    if (url.endsWith("/entities.json")) return { ok: true, json: async () => ({ entities: [entities[2]] }) };
    if (url.endsWith("/speakers.json")) return { ok: true, json: async () => ({ speakers: [{ id: "speaker-person", name: "Jordan Example" }] }) };
    if (url.includes("/m365con_program_")) return { ok: true, json: async () => program };
    throw new Error("unexpected fetch");
  };
  try {
    await ensurePastEvents(env);
    await linkSpeakerEntities(env);
    const result = await claimLinkedinEntity(env, { id: 2, provider: "linkedin" }, { email: "jordan@example.com", email_verified: true }, "speaker-person");
    assert.deepEqual(result, { status: "verified" });
    const stored = JSON.parse(raw.prepare("SELECT speakers FROM event_sessions LIMIT 1").get().speakers);
    assert.equal(stored[0].email, "jordan@example.com");
    assert.equal(stored[0].e, "speaker-person");
  } finally { globalThis.fetch = old; raw.close(); }
});

test("LinkedIn: vorhandener Claim liefert beim OAuth-Ruecksprung HTTP 409; Login fordert E-Mail an", async () => {
  const { raw, env } = await setup(), restore = withEntities();
  try {
    addUser(raw, 1);
    raw.prepare("INSERT INTO entity_claims(eid,user_id,status,via,created) VALUES('claimed-person',1,'verified','admin',1)").run();
    const login = await worker.fetch(new Request("https://api.test/auth/login/linkedin?return=" + encodeURIComponent("https://site.test/entity/claimed-person/?claim=linkedin")), env);
    const auth = new URL(login.headers.get("location"));
    assert.equal(auth.searchParams.get("scope"), "openid profile email");
    const cookie = login.headers.get("set-cookie").split(";")[0], state = auth.searchParams.get("state");
    globalThis.fetch = async (input) => {
      if (String(input) === "https://www.linkedin.com/oauth/v2/accessToken") return { ok: true, json: async () => ({ access_token: "test-access" }) };
      if (String(input) === "https://api.linkedin.com/v2/userinfo") return { ok: true, json: async () => ({ sub: "new-sub", name: "Sam Example", email: "sam@example.com", email_verified: true }) };
      if (String(input).endsWith("/entities.json")) return { json: async () => ({ entities }) };
      throw new Error("unexpected fetch");
    };
    const callback = await worker.fetch(new Request(`https://api.test/auth/callback/linkedin?code=test-code&state=${encodeURIComponent(state)}`, { headers: { cookie } }), env);
    assert.equal(callback.status, 409);
    assert.match(await callback.text(), /bereits beansprucht/);
  } finally { restore(); raw.close(); }
});

test("LinkedIn: Admin bestätigt und lehnt ab, sendet je Claim genau eine Mail und löscht Prüfdetails", async () => {
  const { raw, env } = await setup(), restore = withEntities(), sent = [];
  try {
    addUser(raw, 1, "Alex Example");
    addUser(raw, 2, "Morgan Example");
    addUser(raw, 3, "Another owner");
    env.EMAIL = { send: async (message) => { sent.push(message); return { messageId: `mail-${sent.length}` }; } };
    for (const [id, eid, email] of [[1, "contact-person", "alex@example.com"], [2, "pending-person", "morgan@example.com"]]) {
      const result = await claimLinkedinEntity(env, { id, provider: "linkedin" }, { email, email_verified: true, name: id === 1 ? "Alex Example" : "Morgan Example", picture: "https://media.licdn.com/photo.jpg" }, eid);
      assert.deepEqual(result, { status: "pending" });
    }
    const listReq = new Request("https://api.test/api/admin/entity/claims");
    const list = await handleEvents(env, listReq, new URL(listReq.url), "/api/admin/entity/claims", { id: 99, admin: true }, J);
    const claims = await list.json();
    assert.equal(claims.claims.find((x) => x.eid === "contact-person").name_match, "equal");
    assert.equal(claims.claims.find((x) => x.eid === "contact-person").picture, "https://media.licdn.com/photo.jpg");
    assert.equal(claims.claims.find((x) => x.eid === "contact-person").linkedin_url, entities[0].same_as[0]);
    for (const [eid, ok, status] of [["contact-person", true, "verified"], ["pending-person", false, "rejected"]]) {
      const response = await adminDecision(env, eid, ok);
      assert.equal(response.status, 200);
      assert.equal(raw.prepare("SELECT status FROM entity_claims WHERE eid=?").get(eid).status, status);
      assert.deepEqual({ ...raw.prepare("SELECT email,picture FROM entity_claim_review WHERE eid=?").get(eid) }, { email: "", picture: "" });
      assert.equal((await adminDecision(env, eid, ok)).status, 404);
    }
    assert.equal(sent.length, 2);
    assert.match(sent[0].subject, /bestätigt/);
    assert.match(sent[1].subject, /abgelehnt/);
    assert.deepEqual(sent.map((x) => x.to), ["alex@example.com", "morgan@example.com"]);
    assert.ok(sent.every((x) => x.html && x.text));
    assert.equal(await claimEntity(env.DB, "pending-person", 3, "invite"), true);
    assert.equal(raw.prepare("SELECT status FROM entity_claims WHERE eid='pending-person'").get().status, "verified");
  } finally { restore(); raw.close(); }
});
