import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import worker from "../src/index.js";
import { recordInvite, handleInviter, inviteCount, syncInviterBadges, deleteUserInvites, clickToken, readClick, REF_DAY_CAP, REF_IP_CAP } from "../src/inviter.js";
import { evalBadges, INVITER_TIERS, inviterTier, badgesFor, stats } from "../src/badges.js";
import { mergeStatements } from "../src/identities.js";
import { handleEntityInvite } from "../src/entinvite.js";
import { makeSession } from "../src/util.js";
const SHARE = createRequire(import.meta.url)("../../assets/invite-share.js");

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
const user = (raw, id, { provider = "github", created = 100, handle = "", pub = 1 } = {}) => {
  raw.prepare("INSERT INTO users(id,provider,sub,name,created) VALUES(?,?,?,?,?)").run(id, provider, `s${id}`, `U${id}`, created);
  if (handle) raw.prepare("INSERT INTO profiles(user_id,handle,public,updated) VALUES(?,?,?,1)").run(id, handle, pub);
};
// Feste Uhr fuer Abfolgen (Klick -> Kontoanlage -> Einloesen): Sekunden seit 1970, im Test verstellbar
function clock(start = 1794000000) { const real = Date.now, c = { t: start, restore: () => { Date.now = real; } }; Date.now = () => c.t * 1000; return c; }
const post = (env, path, u, body, ip = "203.0.113.1") => { const req = new Request("https://api.test" + path, { method: "POST", body: JSON.stringify(body), headers: { "cf-connecting-ip": ip } }); return handleInviter(env, req, new URL(req.url), path, u, J); };
const click = async (env, ref, u = null) => (await (await post(env, "/api/invite/click", u, { ref })).json()).token;
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

test("Ref-Ablauf (320-2): Klick-Beleg des Servers, Konto danach angelegt, erneuter Aufruf mit ?ref= nach der Anmeldung -> zugerechnet", async () => {
  const { raw, env, restore } = await setup(), c = clock();
  try {
    user(raw, 1, { handle: "einlader", created: c.t - 9 * 86400 });
    const mem = {}, store = { setItem: (k, v) => { mem[k] = v; }, getItem: (k) => mem[k] ?? null, removeItem: (k) => { delete mem[k]; } };
    // 1) Einladungslink geoeffnet: Browser merkt das Kuerzel, der Server bestaetigt den Klick (Serverzeit)
    assert.equal(SHARE.takeRef({ pathname: "/community/", search: "?ref=einlader", hash: "" }, store), "/community/");
    const token = await click(env, "einlader");
    assert.deepEqual(await readClick(env, token), { h: "einlader", t: c.t });
    assert.equal(SHARE.setToken("einlader", token, store), true);
    // 2) 60 s spaeter legt die Anmeldung (OAuth) das Konto an
    c.t += 60; user(raw, 2, { created: c.t });
    // 3) Rueckkehr auf dieselbe Adresse mit ?ref= (frueher: Zeitpunkt neu gesetzt, dadurch "Konto aelter als die Einladung" und nie gezaehlt)
    c.t += 2; SHARE.takeRef({ pathname: "/community/", search: "?ref=einlader", hash: "" }, store);
    const r = SHARE.readRef(store);
    assert.equal(r.token, token, "der Beleg des ersten Klicks bleibt");
    const res = await post(env, "/api/invite/ref", { id: 2 }, { token: r.token });
    assert.equal(res.status, 200); assert.deepEqual(await res.json(), { ok: true, counted: true });
    assert.equal(await inviteCount(env.DB, 1), 1);
    assert.deepEqual(raw.prepare("SELECT inviter_user_id i,invitee_user_id e,source,ref,created FROM invite_success").all().map((x) => ({ ...x })), [{ i: 1, e: 2, source: "ref", ref: "einlader", created: c.t }]);
    assert.deepEqual(await (await post(env, "/api/invite/ref", { id: 2 }, { token })).json(), { ok: true, counted: false }, "nur einmal");
  } finally { c.restore(); restore(); }
});

test("Ref-Ablauf (320-6): ohne gueltigen Klick-Beleg keine Zurechnung - kein Zeitpunkt aus dem Browser, keine alten Konten, nicht selbst", async () => {
  const { raw, env, restore } = await setup(), c = clock();
  try {
    user(raw, 1, { handle: "farmer", created: c.t - 90 * 86400 });
    for (let i = 0; i < 50; i++) user(raw, 100 + i, { created: c.t - 20 * 86400 });   // 50 Konten, 20 Tage alt, haben den Link nie geoeffnet
    for (let i = 0; i < 50; i++) {
      const res = await post(env, "/api/invite/ref", { id: 100 + i }, { ref: "farmer", t: 0 });   // frueher: alle 50 gezaehlt (Abzeichen inviter_50, 135 Punkte)
      assert.equal(res.status, 400); assert.equal((await res.json()).error, "bad_request");
    }
    assert.equal(await inviteCount(env.DB, 1), 0); assert.deepEqual(badges(raw, 1), []);
    // Beleg von heute fuer ein Konto von vor 20 Tagen: Konto ist aelter als der Klick
    const token = await click(env, "farmer");
    assert.deepEqual(await (await post(env, "/api/invite/ref", { id: 100 }, { token })).json(), { ok: true, counted: false });
    assert.deepEqual(await (await post(env, "/api/invite/ref", { id: 1 }, { token })).json(), { ok: true, counted: false }, "selbst");
    // gefaelschte oder veraenderte Belege: 400
    const [h, t, sig] = token.split(".");
    user(raw, 2, { created: c.t + 5 }); c.t += 10;
    for (const bad of [`${h}.${+t - 40 * 86400}.${sig}`, `anderer.${t}.${sig}`, `${h}.${t}.${sig.slice(0, -2)}xx`, `${h}.${t}`, "", null, `${h}.0.${sig}`, await clickToken({ SESSION_SECRET: "fremd" }, "farmer", +t)])
      assert.equal((await post(env, "/api/invite/ref", { id: 2 }, { token: bad })).status, 400, String(bad));
    assert.equal((await post(env, "/api/invite/ref", { id: 2 }, { ref: "farmer", t: +t, token: undefined })).status, 400);
    assert.equal(await readClick(env, await clickToken(env, "farmer", c.t - 31 * 86400)), null, "Beleg aelter als 30 Tage");
    assert.equal(await readClick(env, await clickToken(env, "farmer", c.t + 3600)), null, "Beleg aus der Zukunft");
    assert.deepEqual(await (await post(env, "/api/invite/ref", { id: 2 }, { token })).json(), { ok: true, counted: true }, "echter Ablauf zaehlt");
    // unbekanntes Kuerzel: Beleg wird ausgestellt (kein Nachschlagen, keine Auskunft ueber Kuerzel), zaehlt aber nicht
    user(raw, 3, { created: c.t + 5 }); const t2 = await click(env, "gibt-es-nicht"); c.t += 10;
    assert.deepEqual(await (await post(env, "/api/invite/ref", { id: 3 }, { token: t2 })).json(), { ok: true, counted: false });
    // Klick: ungueltiges Kuerzel 400; angemeldet gibt es keinen Beleg (das Konto besteht schon); Einloesen nur angemeldet
    assert.equal((await post(env, "/api/invite/click", null, { ref: "../x" })).status, 400);
    assert.equal(await click(env, "farmer", { id: 3 }), "");
    assert.equal((await post(env, "/api/invite/ref", null, { token })).status, 401);
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM ratelimit WHERE k LIKE 'invclick%'").get().n, 0, "der Klick schreibt nichts in die Datenbank");
  } finally { c.restore(); restore(); }
});

test("Ref-Ablauf (320-6): Tagesgrenzen je Einlader, je Anschluss und je Konto; der Beleg bleibt gueltig und zaehlt spaeter", async () => {
  const { raw, env, restore } = await setup(), c = clock();
  try {
    user(raw, 1, { handle: "einlader", created: c.t - 86400 }); user(raw, 2, { handle: "zweite", created: c.t - 86400 });
    const token = await click(env, "einlader"), token2 = await click(env, "zweite"); c.t += 30;
    let id = 1000; const fresh = () => { user(raw, ++id, { created: c.t }); return { id }; };
    // je Anschluss: REF_IP_CAP gezaehlte Einladungen pro Tag, die naechste wartet (429) und zaehlt am Folgetag
    for (let i = 0; i < REF_IP_CAP; i++) assert.equal((await (await post(env, "/api/invite/ref", fresh(), { token }, "198.51.100.7")).json()).counted, true, "ip " + i);
    const late = fresh(), r1 = await post(env, "/api/invite/ref", late, { token }, "198.51.100.7");
    assert.equal(r1.status, 429); assert.equal(await inviteCount(env.DB, 1), REF_IP_CAP);
    assert.equal((await (await post(env, "/api/invite/ref", fresh(), { token }, "198.51.100.8")).json()).counted, true, "anderer Anschluss");
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM ratelimit WHERE k LIKE '%198.51.100%'").get().n, 0, "die IP-Adresse steht nur als Hash in der Datenbank");
    // je Einlader: REF_DAY_CAP pro Tag, egal von wo
    for (let i = REF_IP_CAP + 1; i < REF_DAY_CAP; i++) assert.equal((await (await post(env, "/api/invite/ref", fresh(), { token }, "192.0.2." + i)).json()).counted, true, "tag " + i);
    assert.equal(await inviteCount(env.DB, 1), REF_DAY_CAP);
    const over = fresh();
    assert.equal((await post(env, "/api/invite/ref", over, { token }, "192.0.2.200")).status, 429);
    assert.equal((await (await post(env, "/api/invite/ref", fresh(), { token: token2 }, "192.0.2.201")).json()).counted, true, "andere Einlader sind nicht betroffen");
    assert.equal(await inviteCount(env.DB, 1), REF_DAY_CAP);
    c.t += 86400 + 60;   // am naechsten Tag zaehlen die wartenden Belege
    assert.equal((await (await post(env, "/api/invite/ref", over, { token }, "192.0.2.200")).json()).counted, true);
    assert.equal((await (await post(env, "/api/invite/ref", late, { token }, "198.51.100.7")).json()).counted, true);
    assert.equal(await inviteCount(env.DB, 1), REF_DAY_CAP + 2);
    // je Konto: hoechstens 10 Versuche pro Tag
    const u = fresh(); let last;
    for (let i = 0; i < 11; i++) last = await post(env, "/api/invite/ref", u, { token: await click(env, "gibt-es-nicht") }, "192.0.2.250");
    assert.equal(last.status, 429);
    // der Tageslauf loescht abgelaufene Zaehler (Konto, Hash der IP-Adresse) - laufende und fremde Zaehler bleiben
    raw.prepare("INSERT INTO ratelimit(k,n,win) VALUES('login:1.2.3.4',3,1),('invref',1,1),('invref;x',1,1)").run();
    const keys = () => raw.prepare("SELECT k FROM ratelimit WHERE k LIKE 'invref:%'").all().map((r) => r.k);
    const before = keys(); assert.ok(before.some((k) => k.startsWith("invref:ip:")) && before.includes(`invref:${u.id}`));
    const fresh1 = before.filter((k) => raw.prepare("SELECT win FROM ratelimit WHERE k=?").get(k).win >= c.t - 86400).sort();
    await syncInviterBadges(env);
    assert.deepEqual(keys().sort(), fresh1);
    assert.ok(keys().length > 0 && keys().length < before.length, "nur die Zaehler von gestern sind weg");
    c.t += 2 * 86400; await syncInviterBadges(env);
    assert.deepEqual(keys(), [], "nach spaetestens zwei Tagen steht kein Hash einer IP-Adresse mehr in der Datenbank");
    assert.deepEqual(raw.prepare("SELECT k FROM ratelimit ORDER BY k").all().map((r) => r.k), ["invref", "invref;x", "login:1.2.3.4"]);
  } finally { c.restore(); restore(); }
});

test("Persoenlicher Link (320-3, Entscheidung b/d): Seite mit Vorschau nur fuer oeffentliche Profile, sonst der schlichte Link, ohne Kuerzel keiner", async () => {
  const { raw, env, restore } = await setup();
  try {
    user(raw, 1, { handle: "einlader" }); user(raw, 2, { handle: "privat-p", pub: 0 }); user(raw, 3);
    const me = (id) => handleInviter(env, new Request("https://api.test/api/invite/me"), new URL("https://api.test/api/invite/me"), "/api/invite/me", { id }, J).then((r) => r.json());
    const a = await me(1);
    assert.equal(a.link, "https://site.test/einladung/einlader/"); assert.equal(a.ref_link, "https://site.test/community/?ref=einlader"); assert.equal(a.preview, true); assert.equal(a.count, 0);
    const b = await me(2);
    assert.equal(b.link, "https://site.test/community/?ref=privat-p", "privates Profil: keine Seite mit Name, also kein Link dorthin"); assert.equal(b.preview, false); assert.equal(b.handle, "privat-p");
    raw.prepare("UPDATE profiles SET public=0 WHERE user_id=1").run();   // Profil auf privat gestellt: sofort kein Link mehr auf die Seite
    assert.equal((await me(1)).link, "https://site.test/community/?ref=einlader");
    const n = await me(3); assert.equal(n.link, ""); assert.equal(n.ref_link, ""); assert.equal(n.preview, false);
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

test("Ref-Ablauf ueber die echte Anmeldung (OAuth-Rundlauf): Klick -> Login -> Callback legt das Konto an -> Beleg einloesen", async () => {
  const { raw, env, restore } = await setup(), c = clock();
  const H = { "x-requested-with": "m365", "content-type": "application/json", origin: "https://site.test" };
  Object.assign(env, { GH_OAUTH_CLIENT_ID: "gh-client", GH_OAUTH_CLIENT_SECRET: "gh-secret" });
  try {
    user(raw, 1, { handle: "einlader", created: c.t - 86400 });
    globalThis.fetch = async (url) => {
      const u = String(url);
      if (u === "https://github.com/login/oauth/access_token") return new Response(JSON.stringify({ access_token: "gho_test" }), { headers: { "content-type": "application/json" } });
      if (u === "https://api.github.com/user") return new Response(JSON.stringify({ id: 4711, login: "neu", name: "Neu Hier" }), { headers: { "content-type": "application/json" } });
      return { ok: false, json: async () => ({ episodes: [] }) };
    };
    // Klick (ohne Anmeldung, mit CSRF-Kopf), dann Anmeldung mit Ruecksprung OHNE ref (community.js entfernt den Parameter vorher)
    const k = await worker.fetch(new Request("https://api.test/api/invite/click", { method: "POST", headers: H, body: JSON.stringify({ ref: "einlader" }) }), env);
    assert.equal(k.status, 200); const { token } = await k.json(); assert.match(token, /^einlader\.\d+\.[\w-]+$/);
    assert.equal((await worker.fetch(new Request("https://api.test/api/invite/click", { method: "POST", body: JSON.stringify({ ref: "einlader" }) }), env)).status, 400, "ohne x-requested-with: CSRF-Sperre");
    c.t += 20;
    const lg = await worker.fetch(new Request("https://api.test/auth/login/github?return=" + encodeURIComponent("https://site.test/community/")), env);
    const state = new URL(lg.headers.get("location")).searchParams.get("state"), ck = /m365o=([^;]+)/.exec(lg.headers.get("set-cookie"))[1];
    c.t += 15;
    const cb = await worker.fetch(new Request(`https://api.test/auth/callback/github?code=x&state=${state}`, { headers: { cookie: "m365o=" + ck } }), env);
    assert.equal(cb.status, 302); assert.equal(cb.headers.get("location"), "https://site.test/community/");
    const sess = /m365s=([^;]+)/.exec(cb.headers.get("set-cookie"))[1], neu = raw.prepare("SELECT id,created FROM users WHERE provider='github' AND sub='4711'").get();
    assert.equal(neu.created, c.t);
    c.t += 3;
    const red = (cookie) => worker.fetch(new Request("https://api.test/api/invite/ref", { method: "POST", headers: { ...H, cookie }, body: JSON.stringify({ token }) }), env);
    const r = await red(`m365s=${sess}`);
    assert.equal(r.status, 200); assert.deepEqual(await r.json(), { ok: true, counted: true });
    assert.equal(await inviteCount(env.DB, 1), 1); assert.deepEqual(badges(raw, 1), ["inviter_1"]);
    assert.equal(raw.prepare("SELECT invitee_user_id e FROM invite_success").get().e, neu.id);
    // der Einlader selbst kann denselben Beleg nicht fuer sich einloesen
    assert.deepEqual(await (await red(`m365s=${await makeSession(env, 1)}`)).json(), { ok: true, counted: false });
  } finally { c.restore(); restore(); }
});

test("Kontoloeschung (320-5): Zeilen als Einlader und als eingeladene Person verschwinden, Stufe des Einladers folgt, nichts lebt wieder auf", async () => {
  const { raw, env, restore } = await setup();
  try {
    user(raw, 1, { handle: "max-m" }); user(raw, 2); user(raw, 3); user(raw, 4, { handle: "anna-b" }); user(raw, 5);
    await recordInvite(env, { inviter: 1, invitee: 2, source: "ref", ref: "max-m" });
    await recordInvite(env, { inviter: 1, invitee: 3, source: "ref", ref: "max-m" });
    await recordInvite(env, { inviter: 4, invitee: 1, source: "ref", ref: "anna-b" });   // Konto 1 wurde selbst von 4 eingeladen
    await recordInvite(env, { inviter: 4, invitee: 5, source: "entity", ref: "some-person" });
    raw.prepare("UPDATE invite_success SET voided=1,voided_by=1,voided_at=5 WHERE invitee_user_id=5").run();   // Konto 1 hat (als Admin) einen Eintrag entwertet
    assert.deepEqual(badges(raw, 1), ["inviter_1"]); assert.deepEqual(badges(raw, 4), ["inviter_1"]);
    const del = (id) => makeSession(env, id).then((sess) => worker.fetch(new Request("https://api.test/api/me", { method: "DELETE", headers: { cookie: `m365s=${sess}`, "x-requested-with": "m365" } }), env));
    assert.equal((await del(1)).status, 200);
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM users WHERE id=1").get().n, 0);
    assert.deepEqual(raw.prepare("SELECT inviter_user_id i,invitee_user_id e,ref,voided,voided_by FROM invite_success").all().map((x) => ({ ...x })), [{ i: 4, e: 5, ref: "some-person", voided: 1, voided_by: 0 }],
      "weder das Kuerzel des geloeschten Einladers (ref) noch seine Kennung bleiben stehen");
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM invite_success WHERE ref='max-m' OR inviter_user_id=1 OR invitee_user_id=1 OR voided_by=1").get().n, 0);
    assert.deepEqual(badges(raw, 4), [], "Einlader 4 hat keine gueltige Einladung mehr: Stufe sofort entzogen");
    assert.equal(await syncInviterBadges(env), 1, "nur Konto 4 (noch Einlader einer entwerteten Zeile)");
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM user_badges WHERE user_id=1").get().n, 0, "der taegliche Abgleich legt fuer das geloeschte Konto nichts neu an");
    // verwaiste Zeile (z. B. von einem Worker vor diesem Stand): der Abgleich fasst nur bestehende Konten an
    raw.prepare("INSERT INTO invite_success(inviter_user_id,invitee_user_id,source,ref,created) VALUES(77,3,'ref','weg',1)").run();
    assert.equal(await syncInviterBadges(env), 1);
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM user_badges WHERE user_id=77").get().n, 0);
    await deleteUserInvites(env, 3);
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM invite_success WHERE invitee_user_id=3").get().n, 0);
  } finally { restore(); }
});

test("Zusammenfuehren: Einladungen beider Seiten und der Entwertungs-Verweis (voided_by) gehen auf das Zielkonto", async () => {
  const { raw, env, restore } = await setup();
  try {
    for (const id of [1, 2, 3, 4, 5, 6]) user(raw, id);
    await recordInvite(env, { inviter: 3, invitee: 4, source: "ref" });   // S=3 hat 4 eingeladen
    await recordInvite(env, { inviter: 5, invitee: 3, source: "ref" });   // S=3 wurde von 5 eingeladen
    await recordInvite(env, { inviter: 1, invitee: 6, source: "ref" });
    raw.prepare("UPDATE invite_success SET voided=1,voided_by=3,voided_at=9 WHERE invitee_user_id=6").run();   // S=3 hat als Admin entwertet
    for (const st of await mergeStatements(env.DB, 3, 2)) await st.run();
    assert.deepEqual(raw.prepare("SELECT inviter_user_id i,invitee_user_id e,voided_by v FROM invite_success ORDER BY invitee_user_id").all().map((x) => ({ ...x })),
      [{ i: 5, e: 2, v: 0 }, { i: 2, e: 4, v: 0 }, { i: 1, e: 6, v: 2 }]);
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM invite_success WHERE inviter_user_id=3 OR invitee_user_id=3 OR voided_by=3").get().n, 0);
  } finally { restore(); }
});

test("Cron (320-7): syncInviterBadges laeuft einmal am Tag (06:00), nicht bei jedem 30-Minuten-Lauf", async () => {
  const { raw, env, restore } = await setup(), err = console.error, log = console.log;
  try {
    globalThis.fetch = async () => new Response("{}", { status: 404 }); console.error = () => {}; console.log = () => {};
    const runs = async (cron, at) => {
      raw.exec("DELETE FROM cron_runs"); const w = [];
      await worker.scheduled({ cron, scheduledTime: Date.parse(at) }, env, { waitUntil: (x) => w.push(x) }); await Promise.all(w);
      return raw.prepare("SELECT name FROM cron_runs").all().map((r) => r.name);
    };
    const half = await runs("*/30 * * * *", "2026-11-09T10:30:00Z");
    assert.ok(half.includes("remindInvites"), "der 30-Minuten-Lauf laeuft wie bisher");
    assert.equal(half.filter((n) => n === "syncInviterBadges").length, 0);
    assert.equal((await runs("0 6 * * *", "2026-11-10T06:00:00Z")).filter((n) => n === "syncInviterBadges").length, 1);
    assert.deepEqual(await runs("*/30 * * * *", "2026-11-10T06:00:00Z"), [], "um 06:00 laeuft nur der Tageslauf");
    assert.equal((await runs("*/15 * * * *", "2026-11-10T06:15:00Z")).filter((n) => n === "syncInviterBadges").length, 0);
  } finally { console.error = err; console.log = log; restore(); }
});
