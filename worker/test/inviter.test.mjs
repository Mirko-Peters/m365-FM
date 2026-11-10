import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import worker from "../src/index.js";
import { recordInvite, handleInviter, inviteCount, syncInviterBadges, creditPending, deleteUserInvites, clickToken, readClick, netOf, REF_DAY_CAP, REF_IP_CAP, PEND_RUN } from "../src/inviter.js";
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
const pend = (raw) => raw.prepare("SELECT invitee_user_id e,inviter_user_id i,ref,since,held,created FROM invite_pending ORDER BY invitee_user_id").all().map((x) => ({ ...x }));
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

test("Ref-Ablauf (320-6): Tagesgrenzen je Einlader (insgesamt und von einem Anschluss) und je Konto; darueber wird vorgemerkt und ohne Wiederkommen nachgeholt", async () => {
  const { raw, env, restore } = await setup(), c = clock();
  try {
    user(raw, 1, { handle: "einlader", created: c.t - 86400 }); user(raw, 2, { handle: "zweite", created: c.t - 86400 });
    const t0 = c.t, token = await click(env, "einlader"), token2 = await click(env, "zweite"); c.t += 30;
    let id = 1000; const fresh = () => { user(raw, ++id, { created: c.t }); return { id }; };
    const P = { ok: true, counted: false, pending: true };
    // je Einlader von einem Anschluss: REF_IP_CAP gezaehlte Einladungen pro Tag, die naechste wird vorgemerkt (frueher 429 und nur gezaehlt, wenn die Person wiederkam)
    for (let i = 0; i < REF_IP_CAP; i++) assert.equal((await (await post(env, "/api/invite/ref", fresh(), { token }, "198.51.100.7")).json()).counted, true, "ip " + i);
    const late = fresh(), r1 = await post(env, "/api/invite/ref", late, { token }, "198.51.100.7");
    assert.equal(r1.status, 200); assert.deepEqual(await r1.json(), P); assert.equal(await inviteCount(env.DB, 1), REF_IP_CAP);
    assert.deepEqual(pend(raw), [{ e: late.id, i: 1, ref: "einlader", since: t0, held: 1, created: c.t }]);
    assert.deepEqual(await (await post(env, "/api/invite/ref", late, { token }, "198.51.100.9")).json(), P, "erneutes Vorlegen: bleibt vorgemerkt, keine zweite Zeile, keine Zurechnung an der Grenze vorbei");
    assert.deepEqual(await (await post(env, "/api/invite/ref", late, { token: token2 }, "198.51.100.9")).json(), P, "auch nicht fuer einen anderen Einlader: die erste Einladung gilt");
    assert.equal(pend(raw).length, 1); assert.equal(await inviteCount(env.DB, 2), 0);
    // der Zaehler je Anschluss gehoert zum Einlader: dieselbe Adresse (Buero, Mobilfunknetz) zaehlt fuer ein anderes Mitglied weiter (frueher gemeinsam: 429)
    assert.equal((await (await post(env, "/api/invite/ref", fresh(), { token: token2 }, "198.51.100.7")).json()).counted, true, "anderer Einlader, selber Anschluss");
    assert.equal((await (await post(env, "/api/invite/ref", fresh(), { token }, "198.51.100.8")).json()).counted, true, "anderer Anschluss");
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM ratelimit WHERE k LIKE '%198.51.100%'").get().n, 0, "die IP-Adresse steht nur als Hash in der Datenbank");
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM ratelimit WHERE k GLOB 'invref:ip:[12]:*'").get().n, 3, "Zaehler je Einlader und Anschluss");
    // je Einlader: REF_DAY_CAP pro Tag, egal von wo
    for (let i = REF_IP_CAP + 1; i < REF_DAY_CAP; i++) assert.equal((await (await post(env, "/api/invite/ref", fresh(), { token }, "192.0.2." + i)).json()).counted, true, "tag " + i);
    assert.equal(await inviteCount(env.DB, 1), REF_DAY_CAP);
    const over = fresh();
    assert.deepEqual(await (await post(env, "/api/invite/ref", over, { token }, "192.0.2.200")).json(), P);
    assert.deepEqual(pend(raw).map((x) => [x.e, x.held]), [[late.id, 1], [over.id, 0]]);
    assert.equal((await (await post(env, "/api/invite/ref", fresh(), { token: token2 }, "192.0.2.201")).json()).counted, true, "andere Einlader sind nicht betroffen");
    assert.equal(await inviteCount(env.DB, 1), REF_DAY_CAP);
    raw.prepare("UPDATE profiles SET public=1 WHERE user_id=1").run();
    const me = await (await handleInviter(env, new Request("https://api.test/api/invite/me"), new URL("https://api.test/api/invite/me"), "/api/invite/me", { id: 1 }, J)).json();
    assert.equal(me.count, REF_DAY_CAP); assert.equal(me.pending, 2, "der Einlader sieht, dass zwei Anmeldungen noch gutgeschrieben werden");
    // am naechsten Tag holt der Tageslauf beide nach - niemand muss dafuer wiederkommen
    c.t += 86400 + 60;
    assert.equal(await creditPending(env), 2);
    assert.equal(await inviteCount(env.DB, 1), REF_DAY_CAP + 2); assert.deepEqual(pend(raw), []);
    assert.deepEqual(raw.prepare("SELECT invitee_user_id e,source,ref,created FROM invite_success WHERE invitee_user_id IN (?,?) ORDER BY invitee_user_id").all(late.id, over.id).map((x) => ({ ...x })),
      [{ e: late.id, source: "ref", ref: "einlader", created: c.t }, { e: over.id, source: "ref", ref: "einlader", created: c.t }]);
    assert.deepEqual(await (await post(env, "/api/invite/ref", late, { token }, "198.51.100.7")).json(), { ok: true, counted: false }, "kommt die Person doch wieder: nichts doppelt");
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

test("Vorgemerkte Zurechnungen: ein Buero hinter einer Adresse wird ohne Wiederkommen gutgeschrieben, Sammeln bleibt begrenzt", async () => {
  const { raw, env, restore } = await setup(), c = clock();
  try {
    user(raw, 1, { handle: "chefin", created: c.t - 9 * 86400 });
    const token = await click(env, "chefin"); c.t += 60;
    let id = 2000; const fresh = () => { user(raw, ++id, { created: c.t }); return { id }; };
    // 12 Kolleginnen und Kollegen melden sich ueber den Link an, alle hinter derselben Adresse; niemand ruft die Seite spaeter noch einmal auf
    const res = []; for (let i = 0; i < 12; i++) res.push(await (await post(env, "/api/invite/ref", fresh(), { token }, "203.0.113.50")).json());
    assert.equal(res.filter((x) => x.counted).length, REF_IP_CAP); assert.equal(res.filter((x) => x.pending).length, 12 - REF_IP_CAP);
    assert.equal(await inviteCount(env.DB, 1), 5); assert.deepEqual(badges(raw, 1), ["inviter_1", "inviter_5"]);
    assert.ok(pend(raw).every((x) => x.held === 1 && x.i === 1));
    // Tageslauf (06:00, cron) am naechsten Morgen: hoechstens REF_IP_CAP der an der Anschluss-Grenze vorgemerkten je Lauf, die Stufe folgt im selben Lauf
    c.t += 86400; await syncInviterBadges(env);
    assert.equal(await inviteCount(env.DB, 1), 10); assert.equal(pend(raw).length, 2); assert.deepEqual(badges(raw, 1), ["inviter_1", "inviter_10", "inviter_5"]);
    assert.deepEqual(pend(raw).map((x) => x.e), [id - 1, id], "die aeltesten zuerst");
    // der naechste Lauf kommt 5 s frueher als 24 h nach dem letzten (cron laeuft nie auf die Sekunde gleich) und zaehlt trotzdem
    c.t += 86400 - 5; await syncInviterBadges(env);
    assert.equal(await inviteCount(env.DB, 1), 12); assert.deepEqual(pend(raw), []);
    // Sammeln mit 50 Wegwerfkonten von einer Adresse: 5 sofort, danach 5 je Tageslauf - nicht alle auf einmal
    c.t += 3 * 86400; const t2 = await click(env, "chefin"); c.t += 60;
    for (let i = 0; i < 50; i++) await post(env, "/api/invite/ref", fresh(), { token: t2 }, "198.51.100.99");
    assert.equal(await inviteCount(env.DB, 1), 17); assert.equal(pend(raw).length, 45);
    await syncInviterBadges(env); assert.equal(await inviteCount(env.DB, 1), 22, "gleicher Tag: 5 direkt + 5 nachgeholt");
    await syncInviterBadges(env); await syncInviterBadges(env); await creditPending(env);
    assert.equal(await inviteCount(env.DB, 1), 22, "weitere Laeufe am selben Tag (Wiederholung von Hand) holen nichts zusaetzlich nach");
    assert.equal(pend(raw).length, 40);
    // viele Adressen: die Tagesgrenze je Einlader gilt fuer direkte und nachgeholte zusammen
    user(raw, 3, { handle: "viral", created: c.t - 86400 }); const t3 = await click(env, "viral"); c.t += 60;
    for (let i = 0; i < 50; i++) await post(env, "/api/invite/ref", fresh(), { token: t3 }, "192.0.2." + i);
    assert.equal(await inviteCount(env.DB, 3), REF_DAY_CAP); assert.equal(pend(raw).filter((x) => x.i === 3 && x.held === 0).length, 30);
    await creditPending(env); assert.equal(await inviteCount(env.DB, 3), REF_DAY_CAP, "am selben Tag nichts darueber");
    c.t += 86400; assert.equal(await creditPending(env, 7), 7, "Obergrenze je Lauf (Datenbankabfragen)"); assert.ok(PEND_RUN >= REF_DAY_CAP);
    await creditPending(env); assert.equal(await inviteCount(env.DB, 3), 2 * REF_DAY_CAP); assert.equal(await inviteCount(env.DB, 1), 22 + REF_IP_CAP);
    c.t += 86400; await creditPending(env); assert.equal(await inviteCount(env.DB, 3), 50, "alle 50 echten Anmeldungen sind am dritten Tag gutgeschrieben");
    assert.equal(pend(raw).filter((x) => x.i === 3).length, 0);
  } finally { c.restore(); restore(); }
});

test("Vorgemerkte Zurechnungen: vor dem Zaehlen wird neu geprueft; Kontoloeschung und Zusammenfuehren erfassen die Vormerkung auf beiden Seiten", async () => {
  const { raw, env, restore } = await setup(), c = clock();
  try {
    user(raw, 1, { handle: "max-m", created: c.t - 9 * 86400 }); user(raw, 4, { handle: "anna-b", created: c.t - 9 * 86400 }); user(raw, 5, { created: c.t - 9 * 86400 });
    const token = await click(env, "max-m"), tokenA = await click(env, "anna-b"); c.t += 60;
    const mk = async (id, tok = token) => { user(raw, id, { created: c.t }); return (await post(env, "/api/invite/ref", { id }, { token: tok }, "203.0.113.50")).json(); };
    for (let i = 0; i < REF_IP_CAP; i++) await mk(100 + i);
    for (const i of [200, 201, 202, 203, 204, 205]) assert.equal((await mk(i)).pending, true);
    // 200: gesperrt; 201: inzwischen ueber einen anderen Weg zugerechnet; 202: in ein aelteres Konto aufgegangen (bestand schon vor dem Klick); 203: Konto geloescht
    raw.prepare("UPDATE users SET banned=1 WHERE id=200").run();
    assert.equal(await recordInvite(env, { inviter: 4, invitee: 201, source: "entity", ref: "firma" }), true);
    for (const st of await mergeStatements(env.DB, 202, 5)) await st.run(); raw.prepare("UPDATE users SET merged_into=5 WHERE id=202").run();
    assert.deepEqual(pend(raw).filter((x) => x.e === 5 || x.e === 202).map((x) => [x.e, x.i]), [[5, 1]], "Vormerkung haengt am Zielkonto");
    const del = (id) => makeSession(env, id).then((sess) => worker.fetch(new Request("https://api.test/api/me", { method: "DELETE", headers: { cookie: `m365s=${sess}`, "x-requested-with": "m365" } }), env));
    assert.equal((await del(203)).status, 200);
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM invite_pending WHERE invitee_user_id=203").get().n, 0, "geloeschtes Konto: Vormerkung sofort weg");
    const me = async (id) => (await (await handleInviter(env, new Request("https://api.test/api/invite/me"), new URL("https://api.test/api/invite/me"), "/api/invite/me", { id }, J)).json()).pending;
    assert.equal(await me(1), 4, "ohne die inzwischen anders zugerechnete Person (201)");
    c.t += 86400; await syncInviterBadges(env);
    assert.deepEqual(raw.prepare("SELECT invitee_user_id e FROM invite_success WHERE inviter_user_id=1 AND invitee_user_id>=200 ORDER BY 1").all().map((x) => x.e), [204, 205], "nur die beiden, die weiterhin zaehlen duerfen");
    assert.deepEqual(pend(raw), [], "was nicht mehr zaehlen kann, bleibt nicht liegen");
    assert.equal(await inviteCount(env.DB, 1), REF_IP_CAP + 2); assert.equal(await inviteCount(env.DB, 4), 1);
    // Einlader loescht sein Konto: Vormerkungen an ihn verschwinden mit (sein Kuerzel steht in ref)
    c.t += 86400; const tk = await click(env, "anna-b"); c.t += 60;
    for (let i = 0; i < REF_IP_CAP + 3; i++) await mk(300 + i, tk);
    assert.equal(pend(raw).filter((x) => x.i === 4 && x.ref === "anna-b").length, 3);
    assert.equal((await del(4)).status, 200);
    assert.deepEqual(pend(raw), []); await syncInviterBadges(env);
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM invite_success WHERE inviter_user_id=4 OR ref='anna-b'").get().n, 0, "der Tageslauf legt fuer das geloeschte Konto nichts neu an");
    // Zusammenfuehren: S=3 ist Einlader einer Vormerkung und selbst vorgemerkt -> beides geht auf T=2; hat T schon eine eigene Vormerkung, bleibt die von T;
    // eine Vormerkung zwischen S und T (dieselbe Person) entfaellt
    for (const i of [2, 3, 6, 7, 8, 9, 12, 13]) user(raw, i, { created: c.t });
    const ins = (e, i) => raw.prepare("INSERT INTO invite_pending(invitee_user_id,inviter_user_id,ref,since,held,created) VALUES(?,?,?,?,0,?)").run(e, i, "x", c.t - 5, c.t);
    ins(7, 3); ins(3, 6); ins(9, 13); ins(13, 8); ins(12, 8); ins(8, 12);
    for (const st of await mergeStatements(env.DB, 3, 2)) await st.run();
    for (const st of await mergeStatements(env.DB, 13, 12)) await st.run();
    assert.deepEqual(pend(raw).map((x) => [x.e, x.i]), [[2, 6], [7, 2], [8, 12], [9, 12], [12, 8]]);
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM invite_pending WHERE invitee_user_id IN (3,13) OR inviter_user_id IN (3,13)").get().n, 0);
    for (const st of await mergeStatements(env.DB, 8, 12)) await st.run();
    assert.deepEqual(pend(raw).map((x) => [x.e, x.i]), [[2, 6], [7, 2], [9, 12]], "keine Selbst-Einladung durch Zusammenfuehren");
  } finally { c.restore(); restore(); }
});

test("Koerper null oder kein Objekt: 400 statt 500 (Klick ohne Anmeldung, Einloesen, Entwerten)", async () => {
  const { raw, env, restore } = await setup(), err = console.error, logged = [];
  try {
    console.error = (...a) => logged.push(a.join(" "));
    user(raw, 1, { handle: "einlader" }); user(raw, 2); env.ADMIN_SUBS = "github:s2";
    const sess = await makeSession(env, 2);
    const call = (path, body, cookie = "") => worker.fetch(new Request("https://api.test" + path, { method: "POST", body, headers: { "content-type": "application/json", "x-requested-with": "m365", ...(cookie ? { cookie } : {}) } }), env);
    for (const body of ["null", "5", "\"x\"", "[]", "true", "", "{", "{\"ref\":null}", "{\"ref\":{}}"]) {
      const a = await call("/api/invite/click", body); assert.equal(a.status, 400, "click " + body); assert.equal((await a.json()).error, "bad_request");
      assert.equal((await call("/api/invite/ref", body.replace("ref", "token"), `m365s=${sess}`)).status, 400, "ref " + body);
      assert.equal((await call("/api/admin/invite/void", body.replace("ref", "invitee"), `m365s=${sess}`)).status, 404, "void " + body);
    }
    assert.deepEqual(logged, [], "keine Ausnahme im Protokoll");
    assert.equal((await call("/api/invite/click", "{\"ref\":\"einlader\"}")).status, 200);
  } finally { console.error = err; restore(); }
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
    // Zaehler der Tagesgrenzen mit der Kontonummer verschwinden sofort; die eines anderen Kontos (33, 13) bleiben
    for (const k of ["invref:3", "invref:late:3", "invref:ip:3:abc", "invref:33", "invref:ip:33:abc", "invref:ip:13:abc"]) raw.prepare("INSERT OR REPLACE INTO ratelimit(k,n,win) VALUES(?,1,?)").run(k, Math.floor(Date.now() / 1000));
    await deleteUserInvites(env, 3);
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM invite_success WHERE invitee_user_id=3").get().n, 0);
    assert.deepEqual(raw.prepare("SELECT k FROM ratelimit WHERE k LIKE 'invref:%' ORDER BY k").all().map((x) => x.k), ["invref:33", "invref:ip:13:abc", "invref:ip:33:abc"]);
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

test("F06 (#320) Tagesgrenze streng: in keinen 24 h mehr als REF_DAY_CAP Link-Zurechnungen, auch nicht ueber den Tageslauf; IPv6 zaehlt je /64", async () => {
  const { raw, env, restore } = await setup(), day0 = Date.UTC(2026, 10, 9, 6, 30) / 1000, c = clock(day0 - 600);
  try {
    user(raw, 1, { handle: "viral", created: c.t - 86400 }); const token = await click(env, "viral"); c.t = day0;
    let id = 5000; const fresh = () => { user(raw, ++id, { created: c.t }); return { id }; };
    for (let i = 0; i < 100; i++) await post(env, "/api/invite/ref", fresh(), { token }, "192.0.2." + i);   // 100 Anmeldungen um 06:30 von 100 Adressen
    assert.equal(await inviteCount(env.DB, 1), REF_DAY_CAP);
    const run = async (at) => { c.t = at; await syncInviterBadges(env); return inviteCount(env.DB, 1); };
    const maxIn24h = () => { const ts = raw.prepare("SELECT created FROM invite_success WHERE inviter_user_id=1 AND source='ref' ORDER BY created").all().map((r) => r.created); return Math.max(...ts.map((t) => ts.filter((u) => u >= t && u < t + 86400).length)); };
    const six = (d, s = 3) => Date.UTC(2026, 10, 9 + d, 6, 0, s) / 1000;
    assert.equal(await run(six(1)), REF_DAY_CAP, "06:00 am Folgetag: die 20 von 06:30 liegen noch in den letzten 24 h");
    assert.equal(await run(six(2)), 2 * REF_DAY_CAP);
    assert.equal(await run(six(3, 1)), 2 * REF_DAY_CAP, "zwei Sekunden vor Ablauf der 24 h: der Rest wartet einen Tag");
    assert.equal(await run(six(4, 5)), 3 * REF_DAY_CAP);
    assert.equal(maxIn24h(), REF_DAY_CAP);
    // IPv6: Adressen aus einem /64 sind ein Anschluss (REF_IP_CAP), ein anderes /64 ist ein anderer
    assert.deepEqual(["2001:db8:1:2::1", "2001:DB8:1:2:ffff:0:0:9", "2001:db8:1:2:0:0:0:abcd", "2001:db8:1:3::1", "::ffff:198.51.100.4", "198.51.100.4", "::1"].map(netOf),
      ["2001:db8:1:2::/64", "2001:db8:1:2::/64", "2001:db8:1:2::/64", "2001:db8:1:3::/64", "198.51.100.4", "198.51.100.4", "0:0:0:0::/64"]);
    user(raw, 2, { handle: "zwei", created: c.t - 86400 }); const t2 = await click(env, "zwei"); c.t += 60;
    const res = []; for (let i = 0; i < REF_IP_CAP + 2; i++) res.push(await (await post(env, "/api/invite/ref", fresh(), { token: t2 }, `2001:db8:aa:bb::${(i + 1).toString(16)}`)).json());
    assert.deepEqual(res.map((x) => !!x.counted), [...Array(REF_IP_CAP).fill(true), false, false]);
    assert.equal((await (await post(env, "/api/invite/ref", fresh(), { token: t2 }, "2001:db8:aa:bc::1")).json()).counted, true);
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM ratelimit WHERE k LIKE '%2001%'").get().n, 0, "nur der Hash steht in der Datenbank");
  } finally { c.restore(); restore(); }
});
