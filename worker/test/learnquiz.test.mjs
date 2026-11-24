// Lernpfad-Abschlusstest + Certopus-Zertifikat (learnquiz.js): ganzer Worker gegen eine In-Memory-SQLite mit allen Migrationen.
// Certopus wird nie wirklich aufgerufen: globalThis.fetch ist in den Zertifikat-Tests ein Mock fuer api.certopus.com.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import worker from "../src/index.js";
import { makeSession } from "../src/util.js";
import { issuePendingCerts, deleteUserLearn, linkedinUrl, scoreText, dateText, threshold, quizLang, pageFilter, NAME_URL_RX, NAME_TLD, certName, HAVE_GRACE } from "../src/learnquiz.js";

const PATH = "manufacturing-excellence";
const PILLARS = ["lean-manufacturing", "kaizen", "six-sigma", "tpm", "kanban", "smed", "oee", "mes", "aps", "digital-twin"];
const ANSWER = (n) => n % 4;   // richtige Option der Testfragen <pillar>-<n>
const KEY = "certopus-test-key-123456";
const CERTOPUS_PATHS = JSON.stringify({ [PATH]: { org: "projectmanagementgroup", event: "ev-1", category: "cat-1", course: { en: "Manufacturing Excellence: From Lean Basics to Digital Production Planning", de: "Manufacturing Excellence: von den Lean-Grundlagen zur digitalen Produktionsplanung" } } });

async function setup(extra = {}) {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:");
  const dir = new URL("../migrations/", import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(f, dir), "utf-8"));
  const db = { prepare(sql) { const st = raw.prepare(sql); let a = []; const o = { bind(...x) { a = x; return o; }, all: async () => ({ results: st.all(...a) }), first: async () => st.get(...a) ?? null, run: async () => { const r = st.run(...a); return { meta: { changes: Number(r.changes), last_row_id: Number(r.lastInsertRowid) } }; } }; return o; }, batch: async (l) => { for (const s of l) await s.run(); return []; } };
  const now = Math.floor(Date.now() / 1000);
  raw.prepare("INSERT INTO users(id,provider,sub,name,created) VALUES (1,'github','ada','Ada L.',?),(2,'github','bob','Bob',?),(3,'github','boss','Chef',?)").run(now, now, now);
  raw.prepare("UPDATE users SET role='admin' WHERE id=3").run();
  raw.prepare("INSERT INTO user_prefs(user_id,real_name) VALUES (1,'Ada Lovelace')").run();
  raw.prepare("INSERT INTO mail_addr(user_id,email,verified,token,created) VALUES (1,'ada@example.com',1,'',?),(2,'bob@example.com',0,'x',?)").run(now, now);
  const env = { DB: db, SITE: "https://www.m365.fm", API: "https://api-dub.m365.fm", SESSION_SECRET: "test-secret", ADMIN_SUBS: "", CRON_KEY: "cron-test", CERTOPUS_PATHS, CERTOPUS_ON: "0", ...extra };
  const s = { ada: `m365s=${await makeSession(env, 1)}`, bob: `m365s=${await makeSession(env, 2)}`, admin: `m365s=${await makeSession(env, 3)}` };
  return { env, raw, s };
}

async function call(env, path, { method = "GET", body, cookie, headers = {} } = {}) {
  const h = { origin: "https://www.m365.fm", ...(method !== "GET" ? { "x-requested-with": "m365", "content-type": "application/json" } : {}), ...(cookie ? { cookie } : {}), ...headers };
  const res = await worker.fetch(new Request("https://api-dub.m365.fm" + path, { method, headers: h, body: body === undefined ? undefined : JSON.stringify(body) }), env, { waitUntil() {} });
  const text = await res.text();
  let data = null; try { data = JSON.parse(text); } catch { /* kein JSON */ }
  return { status: res.status, data, text };
}

const keys = () => PILLARS.flatMap((p) => [1, 2, 3, 4, 5].map((n) => ({ qid: `${p}-${n}`, pillar: p, answer: ANSWER(n), why_en: `Because ${p} ${n}.`, why_de: `Weil ${p} ${n}.` })));
const seed = (env) => call(env, "/api/internal/learn-quiz", { method: "POST", body: { path: PATH, keys: keys() }, headers: { "x-cron-key": "cron-test", "x-requested-with": "" } });
const answersFor = (qids, wrong = 0) => Object.fromEntries(qids.map((q, i) => { const right = ANSWER(+q.split("-").pop()); return [q, i < wrong ? (right + 1) % 4 : right]; }));
const start = (env, cookie, body = {}) => call(env, "/api/learn/quiz/start", { method: "POST", cookie, body: { path: PATH, lang: "en", ...body } });
const submit = (env, cookie, attempt, answers) => call(env, "/api/learn/quiz/submit", { method: "POST", cookie, body: { attempt, answers } });
async function passedAttempt(env, cookie) {
  const st = await start(env, cookie, { lang: "de" });
  const sb = await submit(env, cookie, st.data.attempt, answersFor(st.data.qids, 3));
  assert.equal(sb.data.passed, true);
  return st.data.attempt;
}
const certBody = (attempt, o = {}) => ({ path: PATH, attempt, name: "Ada Lovelace", email: "ada@example.com", consent: true, lang: "de", ...o });

function mockCertopus({ fields = ["email", "{Name}", "{Course}"], fail = false } = {}) {
  const calls = [], old = globalThis.fetch;
  globalThis.fetch = async (url, init = {}) => {
    const u = new URL(String(url));
    assert.equal(u.hostname, "api.certopus.com", "nur Certopus darf hier gerufen werden: " + url);
    calls.push({ url: u, init, body: init.body ? JSON.parse(init.body) : null });
    if (u.pathname === "/v1/recipient_fields") return new Response(JSON.stringify({ data: fields.map((k) => ({ key: k, label: k, type: "text" })) }), { status: 200 });
    if (u.pathname === "/v1/certificates") {
      if (fail) return new Response(JSON.stringify({ message: `invalid api key ${KEY}` }), { status: 401 });
      return new Response(JSON.stringify({ responses: [{ certificateId: "CERT-42", certificateUrl: "https://certopus.com/c/CERT-42", pdfUrl: "https://certopus.com/c/CERT-42.pdf" }] }), { status: 200 });
    }
    return new Response("{}", { status: 404 });
  };
  return { calls, restore: () => { globalThis.fetch = old; } };
}

test("Hilfsfunktionen: Schwelle 80 %, Sprache, Score/Datum, LinkedIn-Link", () => {
  assert.equal(threshold(30), 24);
  assert.equal(quizLang("de"), "de"); assert.equal(quizLang("fr"), "en"); assert.equal(quizLang(undefined), "en");
  assert.equal(scoreText(27, 30), "27/30 (90 %)");
  const ts = Date.UTC(2026, 10, 4) / 1000;
  assert.equal(dateText(ts, "de"), "04.11.2026"); assert.equal(dateText(ts, "en"), "2026-11-04");
  const l = new URL(linkedinUrl("Kurs A", "https://certopus.com/c/1", "ID1", ts));
  assert.equal(l.origin + l.pathname, "https://www.linkedin.com/profile/add");
  assert.equal(l.searchParams.get("startTask"), "CERTIFICATION_NAME"); assert.equal(l.searchParams.get("name"), "Kurs A");
  assert.equal(l.searchParams.get("organizationName"), "M365.FM"); assert.equal(l.searchParams.get("issueYear"), "2026"); assert.equal(l.searchParams.get("issueMonth"), "11");
  assert.equal(l.searchParams.get("certUrl"), "https://certopus.com/c/1"); assert.equal(l.searchParams.get("certId"), "ID1");
});

test("interner Upsert nur mit CRON_KEY, alles oder nichts, Antworten nie in der Antwort", async () => {
  const { env, raw, s } = await setup();
  assert.equal((await call(env, "/api/internal/learn-quiz", { method: "POST", body: { path: PATH, keys: keys() } })).status, 403);
  assert.equal((await call(env, "/api/internal/learn-quiz", { method: "POST", body: { path: PATH, keys: keys() }, headers: { "x-cron-key": "falsch" } })).status, 403);
  assert.equal((await call(env, "/api/internal/learn-quiz", { method: "POST", cookie: s.admin, body: { path: PATH, keys: keys() } })).status, 403, "auch ein Admin braucht den CRON_KEY");
  assert.equal((await call(env, "/api/internal/learn-quiz", { method: "GET", headers: { "x-cron-key": "cron-test" } })).status, 405);
  const bad = await call(env, "/api/internal/learn-quiz", { method: "POST", body: { path: PATH, keys: [...keys(), { qid: "kaizen-9", pillar: "kaizen", answer: 4 }] }, headers: { "x-cron-key": "cron-test" } });
  assert.equal(bad.status, 400); assert.equal(bad.data.error, "bad_keys");
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM learn_quiz_keys").get().n, 0, "ungueltiger Eintrag: nichts geschrieben");
  const ok = await seed(env);   // ohne x-requested-with (Actions), nur CRON_KEY
  assert.equal(ok.status, 200);
  assert.deepEqual({ upserted: ok.data.upserted, deactivated: ok.data.deactivated, total: ok.data.total, pillars: ok.data.pillars }, { upserted: 50, deactivated: 0, total: 50, pillars: 10 });
  assert.doesNotMatch(ok.text, /answer|Because/);
  // erneuter Lauf mit geaenderter Antwort und neuer Frage: aktualisiert, nichts geloescht
  const again = await call(env, "/api/internal/learn-quiz", { method: "POST", body: { path: PATH, keys: [...keys().filter((k) => k.qid !== "kaizen-1"), { qid: "kaizen-1", pillar: "kaizen", answer: 3, why_en: "x", why_de: "y" }, { qid: "kaizen-6", pillar: "kaizen", answer: 0 }] }, headers: { "x-cron-key": "cron-test" } });
  assert.deepEqual({ upserted: again.data.upserted, deactivated: again.data.deactivated, total: again.data.total }, { upserted: 51, deactivated: 0, total: 51 });
  assert.equal(raw.prepare("SELECT answer FROM learn_quiz_keys WHERE qid='kaizen-1'").get().answer, 3);
});

test("Push ist je Pfad massgeblich: fehlende Fragen werden stillgelegt (nicht geloescht), nicht mehr gezogen, offene Versuche weiter gewertet", async () => {
  const { env, raw, s } = await setup();
  await seed(env);
  // anderer Pfad bleibt unberuehrt
  await call(env, "/api/internal/learn-quiz", { method: "POST", body: { path: "other-path", keys: [{ qid: "x-guide-1", pillar: "x-guide", answer: 1 }] }, headers: { "x-cron-key": "cron-test" } });
  const st = await start(env, s.ada);   // offener Versuch mit alten Fragen
  assert.equal(st.data.total, 30);
  // neue Fragen <pillar>-6..8 ersetzen die alten 1..5
  const fresh = PILLARS.flatMap((p) => [6, 7, 8].map((n) => ({ qid: `${p}-${n}`, pillar: p, answer: ANSWER(n), why_en: `New ${p} ${n}.`, why_de: `Neu ${p} ${n}.` })));
  const r = await call(env, "/api/internal/learn-quiz", { method: "POST", body: { path: PATH, keys: fresh }, headers: { "x-cron-key": "cron-test" } });
  assert.equal(r.status, 200, r.text);
  assert.deepEqual({ upserted: r.data.upserted, deactivated: r.data.deactivated, total: r.data.total, pillars: r.data.pillars }, { upserted: 30, deactivated: 50, total: 30, pillars: 10 });
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM learn_quiz_keys WHERE path=?").get(PATH).n, 80, "nichts geloescht");
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM learn_quiz_keys WHERE path=? AND active=0").get(PATH).n, 50);
  assert.equal(raw.prepare("SELECT active FROM learn_quiz_keys WHERE qid='x-guide-1'").get().active, 1, "anderer Pfad bleibt aktiv");
  // offener Versuch mit stillgelegten Fragen: Abgabe wertet weiter mit den gespeicherten Schluesseln
  const sb = await submit(env, s.ada, st.data.attempt, answersFor(st.data.qids, 2));
  assert.equal(sb.status, 200, sb.text);
  assert.deepEqual({ score: sb.data.score, total: sb.data.total, passed: sb.data.passed }, { score: 28, total: 30, passed: true });
  assert.ok(sb.data.results.every((x) => x.why.startsWith("Because ")), "Erklaerungen der alten Fragen");
  // neuer Versuch zieht nur aktive Fragen
  raw.prepare("DELETE FROM ratelimit").run();
  const st2 = await start(env, s.bob);
  assert.equal(st2.data.total, 30);
  assert.ok(st2.data.qids.every((q) => /-[678]$/.test(q)), st2.data.qids.join(","));
  assert.equal((await call(env, "/api/learn/cert?path=" + PATH, { cookie: s.bob })).data.quiz_ready, true);
  // Reaktivieren: eine stillgelegte ID kommt wieder mit (z. B. Ruecknahme) -> active=1, die anderen bleiben aus
  const back = await call(env, "/api/internal/learn-quiz", { method: "POST", body: { path: PATH, keys: [...fresh, keys()[0]] }, headers: { "x-cron-key": "cron-test" } });
  assert.deepEqual({ upserted: back.data.upserted, deactivated: back.data.deactivated, total: back.data.total }, { upserted: 31, deactivated: 0, total: 31 });
  assert.equal(raw.prepare("SELECT active FROM learn_quiz_keys WHERE qid=?").get(keys()[0].qid).active, 1);
  // gleicher Push noch einmal: idempotent
  const same = await call(env, "/api/internal/learn-quiz", { method: "POST", body: { path: PATH, keys: fresh }, headers: { "x-cron-key": "cron-test" } });
  assert.deepEqual({ deactivated: same.data.deactivated, total: same.data.total }, { deactivated: 1, total: 30 });
  const again = await call(env, "/api/internal/learn-quiz", { method: "POST", body: { path: PATH, keys: fresh }, headers: { "x-cron-key": "cron-test" } });
  assert.deepEqual({ deactivated: again.data.deactivated, total: again.data.total }, { deactivated: 0, total: 30 });
  // alle Fragen stillgelegt (Pfad ohne aktive Fragen) -> kein Test
  raw.prepare("UPDATE learn_quiz_keys SET active=0").run();
  raw.prepare("DELETE FROM learn_attempts").run(); raw.prepare("DELETE FROM ratelimit").run();
  assert.equal((await start(env, s.bob)).data.error, "no_quiz");
});

test("Start: ohne Login 401, ohne CSRF-Kopf 400, ohne Fragen 404, 3 Fragen je Leitfaden, Neuladen kostet keinen Versuch", async () => {
  const { env, raw, s } = await setup();
  assert.equal((await start(env, undefined)).status, 401);
  assert.equal((await call(env, "/api/learn/cert?path=" + PATH)).status, 401);
  assert.equal((await call(env, "/api/learn/quiz/start", { method: "POST", cookie: s.ada, body: { path: PATH }, headers: { "x-requested-with": "" } })).status, 400, "CSRF-Schutz wie andere Routen");
  assert.equal((await start(env, s.ada)).data.error, "no_quiz");
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM ratelimit").get().n, 0, "ohne Fragen wird kein Versuch verbraucht");
  await seed(env);
  assert.equal((await start(env, s.ada, { path: "Bad Path" })).status, 400);
  const st = await start(env, s.ada, { src: "LinkedIn_Post!<x>-sehr-lange-herkunft-die-abgeschnitten-wird" });
  assert.equal(st.status, 200);
  assert.equal(st.data.qids.length, 30); assert.equal(new Set(st.data.qids).size, 30);
  for (const p of PILLARS) assert.equal(st.data.qids.filter((q) => q.startsWith(p + "-")).length, 3, p);
  assert.equal(st.data.total, 30); assert.equal(st.data.threshold, 24); assert.equal(st.data.attempts_left, 2);
  assert.ok(st.data.expires > Date.now() / 1000 + 86000);
  assert.doesNotMatch(st.text, /Because|answer/);
  const row = raw.prepare("SELECT * FROM learn_attempts").get();
  assert.equal(row.user_id, 1); assert.equal(row.lang, "en"); assert.equal(row.finished, 0);
  assert.ok(row.src.length <= 40 && /^[a-z0-9._:/-]+$/.test(row.src), row.src);
  const again = await start(env, s.ada, { lang: "de" });
  assert.equal(again.data.attempt, st.data.attempt); assert.equal(again.data.resumed, true); assert.deepEqual(again.data.qids, st.data.qids);
  assert.equal(raw.prepare("SELECT lang FROM learn_attempts").get().lang, "de");
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM learn_attempts").get().n, 1);
});

test("Rate-Limit: hoechstens 3 Versuche je 24 h und Nutzer", async () => {
  const { env, s } = await setup();
  await seed(env);
  for (let i = 0; i < 3; i++) {
    const st = await start(env, s.ada);
    assert.equal(st.status, 200, "Versuch " + (i + 1));
    const sb = await submit(env, s.ada, st.data.attempt, answersFor(st.data.qids, 10));
    assert.equal(sb.data.attempts_left, 2 - i);
  }
  const fourth = await start(env, s.ada);
  assert.equal(fourth.status, 429); assert.equal(fourth.data.error, "rate_limit");
  assert.equal((await start(env, s.bob)).status, 200, "andere Nutzer sind nicht betroffen");
  const cert = await call(env, "/api/learn/cert?path=" + PATH, { cookie: s.ada });
  assert.equal(cert.data.attempts_left, 0); assert.equal(cert.data.passed, false); assert.equal(cert.data.best.score, 20);
});

test("Abgabe: Zaehlung, Bestehen ab 24/30, Erklaerungen in der Sprache des Versuchs, je Leitfaden", async () => {
  const { env, raw, s } = await setup();
  await seed(env);
  const st = await start(env, s.ada, { lang: "de" });
  const sb = await submit(env, s.ada, st.data.attempt, answersFor(st.data.qids, 6));
  assert.equal(sb.status, 200);
  assert.equal(sb.data.score, 24); assert.equal(sb.data.total, 30); assert.equal(sb.data.passed, true); assert.equal(sb.data.threshold, 24);
  assert.equal(sb.data.results.length, 30);
  const first = sb.data.results[0];
  assert.equal(first.ok, false); assert.equal(first.correct, ANSWER(+first.qid.split("-").pop())); assert.match(first.why, /^Weil /);
  assert.equal(Object.keys(sb.data.per_pillar).length, 10);
  assert.equal(Object.values(sb.data.per_pillar).reduce((a, p) => a + p.ok, 0), 24);
  assert.ok(Object.values(sb.data.per_pillar).every((p) => p.n === 3));
  const row = raw.prepare("SELECT * FROM learn_attempts WHERE id=?").get(st.data.attempt);
  assert.equal(row.score, 24); assert.equal(row.passed, 1); assert.ok(row.finished > 0); assert.match(row.detail, /per_pillar/);
  // 23/30: nicht bestanden, englische Erklaerungen, unbeantwortet zaehlt falsch
  const st2 = await start(env, s.bob);
  const ans = answersFor(st2.data.qids, 6); delete ans[st2.data.qids[29]];
  const sb2 = await submit(env, s.bob, st2.data.attempt, ans);
  assert.equal(sb2.data.score, 23); assert.equal(sb2.data.passed, false);
  assert.equal(sb2.data.results[29].chosen, null);
  // nicht bestanden, Versuche uebrig: Loesung und Erklaerung nur bei richtig beantworteten Fragen (sonst liesse sich der Schluessel abfragen)
  assert.equal(sb2.data.shown, "none");
  for (const x of sb2.data.results) {
    if (x.ok) { assert.equal(x.correct, x.chosen); assert.match(x.why, /^Because /); }
    else { assert.equal(x.correct, undefined, x.qid); assert.equal(x.why, undefined, x.qid); }
  }
  assert.doesNotMatch(JSON.stringify(sb2.data.results.filter((x) => !x.ok)), /correct|why/);
});

test("Abgabe: leere Abgaben verraten keine Loesungen; ohne verbleibende Versuche nur die der beantworteten Fragen", async () => {
  const { env, s } = await setup();
  await seed(env);
  const known = new Set();
  for (let i = 0; i < 2; i++) {
    const st = await start(env, s.ada);
    const sb = await submit(env, s.ada, st.data.attempt, {});
    assert.equal(sb.data.score, 0); assert.equal(sb.data.shown, "none"); assert.equal(sb.data.attempts_left, 2 - i);
    for (const x of sb.data.results) { assert.equal(x.correct, undefined); if (x.correct !== undefined) known.add(x.qid); }
  }
  assert.equal(known.size, 0, "zwei leere Abgaben: keine einzige Loesung");
  // letzter Versuch: 10 beantwortet (alle falsch), 20 leer -> Loesungen nur fuer die 10 beantworteten
  const st = await start(env, s.ada);
  const ans = Object.fromEntries(st.data.qids.slice(0, 10).map((q) => [q, (ANSWER(+q.split("-").pop()) + 1) % 4]));
  const sb = await submit(env, s.ada, st.data.attempt, ans);
  assert.equal(sb.data.attempts_left, 0); assert.equal(sb.data.shown, "answered");
  assert.equal(sb.data.results.filter((x) => x.correct !== undefined).length, 10);
  for (const x of sb.data.results) assert.equal(x.correct !== undefined, x.chosen !== null, x.qid);
  // bestanden: alle Loesungen
  const pass = await passedAttempt(env, s.bob);
  assert.ok(pass);
});

test("Abgabe: fremder Versuch 403, doppelte Abgabe 409, abgelaufen 410, unbekannt 404", async () => {
  const { env, raw, s } = await setup();
  await seed(env);
  const st = await start(env, s.ada);
  assert.equal((await submit(env, s.bob, st.data.attempt, answersFor(st.data.qids))).status, 403);
  assert.equal((await submit(env, undefined, st.data.attempt, {})).status, 401);
  assert.equal((await submit(env, s.ada, "unbekannter-versuch", {})).status, 404);
  assert.equal((await submit(env, s.ada, st.data.attempt, answersFor(st.data.qids))).status, 200);
  const dup = await submit(env, s.ada, st.data.attempt, answersFor(st.data.qids));
  assert.equal(dup.status, 409); assert.equal(dup.data.error, "already_submitted");
  const st2 = await start(env, s.ada);
  raw.prepare("UPDATE learn_attempts SET started=started-86401 WHERE id=?").run(st2.data.attempt);
  const late = await submit(env, s.ada, st2.data.attempt, answersFor(st2.data.qids));
  assert.equal(late.status, 410); assert.equal(late.data.error, "expired");
  assert.equal(raw.prepare("SELECT finished FROM learn_attempts WHERE id=?").get(st2.data.attempt).finished, 0);
});

test("Zertifikat aus (CERTOPUS_ON=0): Pruefungen, 503 cert_off, Zeile pending mit Name/E-Mail, Status mit Vorschlaegen", async () => {
  const { env, raw, s } = await setup();
  await seed(env);
  const before = await call(env, "/api/learn/cert?path=" + PATH, { cookie: s.ada });
  assert.equal(before.status, 200);
  assert.equal(before.data.name, "Ada Lovelace", "real_name aus user_prefs"); assert.equal(before.data.email, "ada@example.com", "nur bestaetigte Adresse");
  assert.equal(before.data.quiz_ready, true); assert.equal(before.data.cert, null); assert.equal(before.data.cert_on, false);
  const bobState = await call(env, "/api/learn/cert?path=" + PATH, { cookie: s.bob });
  assert.equal(bobState.data.name, "Bob"); assert.equal(bobState.data.email, "", "unbestaetigte Adresse wird nicht vorgeschlagen");
  // nicht bestanden
  const st = await start(env, s.ada);
  await submit(env, s.ada, st.data.attempt, answersFor(st.data.qids, 10));
  assert.equal((await call(env, "/api/learn/cert", { method: "POST", cookie: s.ada, body: certBody(st.data.attempt) })).data.error, "not_passed");
  const attempt = await passedAttempt(env, s.ada);
  assert.equal((await call(env, "/api/learn/cert", { method: "POST", cookie: s.bob, body: certBody(attempt) })).status, 403, "fremder Versuch");
  for (const [o, err] of [[{ consent: false }, "consent"], [{ consent: "true" }, "consent"], [{ name: "A" }, "name"], [{ name: "x".repeat(81) }, "name"], [{ email: "kein-mail" }, "email"], [{ email: "a@b" }, "email"]]) {
    const r = await call(env, "/api/learn/cert", { method: "POST", cookie: s.ada, body: certBody(attempt, o) });
    assert.equal(r.status, 400, JSON.stringify(o)); assert.equal(r.data.error, err);
  }
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM learn_certs").get().n, 0);
  const off = await call(env, "/api/learn/cert", { method: "POST", cookie: s.ada, body: certBody(attempt, { name: "  Ada   <Love>lace " }) });
  assert.equal(off.status, 503); assert.equal(off.data.error, "cert_off");
  const row = raw.prepare("SELECT * FROM learn_certs").get();
  assert.equal(row.status, "pending"); assert.equal(row.name, "Ada Lovelace"); assert.equal(row.email, "ada@example.com"); assert.equal(row.attempt_id, attempt); assert.equal(row.lang, "de");
  const after = await call(env, "/api/learn/cert?path=" + PATH, { cookie: s.ada });
  assert.equal(after.data.passed, true); assert.equal(after.data.cert.status, "pending"); assert.equal(after.data.best.attempt, attempt);
  // Schalter an, aber ohne Schluessel: weiterhin aus
  env.CERTOPUS_ON = "1";
  assert.equal((await call(env, "/api/learn/cert", { method: "POST", cookie: s.ada, body: certBody(attempt) })).data.error, "cert_off");
});

test("Zertifikat: Name ohne Link/Domain, E-Mail nur die bestaetigte bzw. hoechstens 2 verschiedene ohne Bestaetigung", async () => {
  const { env, raw, s } = await setup();
  await seed(env);
  const attempt = await passedAttempt(env, s.ada);
  const post = (o, cookie = s.ada, att = attempt) => call(env, "/api/learn/cert", { method: "POST", cookie, body: certBody(att, o) });
  for (const name of ["https://ada.dev", "Ada http:x", "www.ada", "Ada Lovelace.com", "ada.example.de/", "Ada @lovelace", "Ada / Lovelace", "AdA.DE"]) {
    const r = await post({ name });
    assert.equal(r.status, 400, name); assert.equal(r.data.error, "name_url", name);
  }
  for (const name of ["Visit evil.com today", "t.me x", "evil\uff0ecom", "evil[.]com", "evil.c\u2060om"]) assert.equal((await post({ name })).data.error, "name_url", name);
  for (const name of ["Dr. Ada Lovelace", "J.R.R. Tolkien", "Ada Lovelace-Byron", "St. Clair, M.Sc."]) assert.equal((await post({ name })).status, 503, name + " ist erlaubt");
  // Ada hat eine bestaetigte Adresse: nur diese (Gross/Klein egal)
  const st = await call(env, "/api/learn/cert?path=" + PATH, { cookie: s.ada });
  assert.equal(st.data.email, "ada@example.com"); assert.equal(st.data.email_verified, true);
  const other = await post({ email: "jemand@example.org" });
  assert.equal(other.status, 400); assert.equal(other.data.error, "email_unverified");
  assert.equal((await post({ email: " ADA@Example.COM ", name: "Ada\u2060 Love\u00adlace\ufeff" })).status, 503);
  assert.equal(raw.prepare("SELECT email FROM learn_certs WHERE user_id=1").get().email, "ada@example.com");
  assert.equal(raw.prepare("SELECT name FROM learn_certs WHERE user_id=1").get().name, "Ada Lovelace", "gespeichert wird der normalisierte Name");
  // Bob ohne bestaetigte Adresse: frei, aber hoechstens 2 verschiedene je Pfad
  const bobAttempt = await passedAttempt(env, s.bob);
  const bobState = await call(env, "/api/learn/cert?path=" + PATH, { cookie: s.bob });
  assert.equal(bobState.data.email_verified, false); assert.equal(bobState.data.email, "");
  assert.equal((await post({ email: "bob1@example.com" }, s.bob, bobAttempt)).status, 503);
  assert.equal((await post({ email: "BOB2@example.com" }, s.bob, bobAttempt)).status, 503);
  assert.equal((await post({ email: "bob1@example.com" }, s.bob, bobAttempt)).status, 503, "eine schon genutzte Adresse geht weiter");
  const third = await post({ email: "bob3@example.com" }, s.bob, bobAttempt);
  assert.equal(third.status, 400); assert.equal(third.data.error, "email_limit"); assert.equal(third.data.max, 2);
  const row = raw.prepare("SELECT email, emails FROM learn_certs WHERE user_id=2").get();
  assert.equal(row.email, "bob1@example.com"); assert.deepEqual(JSON.parse(row.emails), ["bob1@example.com", "bob2@example.com"]);
  assert.equal((await call(env, "/api/learn/cert?path=" + PATH, { cookie: s.bob })).data.email, "bob1@example.com", "Vorschlag: zuletzt genutzte Adresse");
  // bestaetigt Bob spaeter eine Adresse, gilt nur noch diese - auch die Obergrenze spielt dann keine Rolle
  raw.prepare("UPDATE mail_addr SET email='bob3@example.com', verified=1 WHERE user_id=2").run();
  assert.equal((await call(env, "/api/learn/cert?path=" + PATH, { cookie: s.bob })).data.email, "bob3@example.com");
  assert.equal((await post({ email: "bob1@example.com" }, s.bob, bobAttempt)).data.error, "email_unverified");
  assert.equal((await post({ email: "bob3@example.com" }, s.bob, bobAttempt)).status, 503);
});

test("Zertifikat mit Certopus (Mock): Kopf x-api-key, Felder laut Vorlage, gespeichert, zweiter Aufruf liefert das vorhandene", async () => {
  const { env, raw, s } = await setup({ CERTOPUS_ON: "1", CERTOPUS_API_KEY: KEY });
  await seed(env);
  const attempt = await passedAttempt(env, s.ada);
  const m = mockCertopus();
  try {
    const r = await call(env, "/api/learn/cert", { method: "POST", cookie: s.ada, body: certBody(attempt) });
    assert.equal(r.status, 200, r.text);
    assert.equal(r.data.url, "https://certopus.com/c/CERT-42"); assert.equal(r.data.pdf, "https://certopus.com/c/CERT-42.pdf");
    const li = new URL(r.data.linkedin);
    assert.equal(li.searchParams.get("certId"), "CERT-42"); assert.equal(li.searchParams.get("certUrl"), "https://certopus.com/c/CERT-42");
    assert.equal(li.searchParams.get("name"), "Manufacturing Excellence: von den Lean-Grundlagen zur digitalen Produktionsplanung");
    const fields = m.calls.find((c) => c.url.pathname === "/v1/recipient_fields");
    assert.deepEqual(Object.fromEntries(fields.url.searchParams), { organisationId: "projectmanagementgroup", eventId: "ev-1", categoryId: "cat-1" });
    const post = m.calls.find((c) => c.url.pathname === "/v1/certificates");
    assert.equal(post.init.method, "POST"); assert.equal(post.init.headers["x-api-key"], KEY);
    assert.equal(post.body.organisationId, "projectmanagementgroup"); assert.equal(post.body.eventId, "ev-1"); assert.equal(post.body.categoryId, "cat-1");
    assert.equal(post.body.generate, true); assert.equal(post.body.publish, true);
    assert.equal(post.body.recipients.length, 1); assert.equal(post.body.recipients[0].email, "ada@example.com");
    assert.deepEqual(post.body.recipients[0].data, { "{Name}": "Ada Lovelace", "{Course}": "Manufacturing Excellence: von den Lean-Grundlagen zur digitalen Produktionsplanung" }, "nur Felder, die die Vorlage kennt");
    const row = raw.prepare("SELECT * FROM learn_certs").get();
    assert.equal(row.status, "ok"); assert.equal(row.certopus_id, "CERT-42"); assert.equal(row.cert_url, "https://certopus.com/c/CERT-42"); assert.equal(row.error, "");
    assert.ok(raw.prepare("SELECT v FROM meta WHERE k LIKE 'certopus_fields:%'").get(), "Felder der Vorlage gecacht");
    const n = m.calls.length;
    const second = await call(env, "/api/learn/cert", { method: "POST", cookie: s.ada, body: certBody(attempt, { name: "Anders" }) });
    assert.equal(second.status, 200); assert.equal(second.data.existing, true); assert.equal(second.data.url, "https://certopus.com/c/CERT-42");
    assert.equal(m.calls.length, n, "kein zweites Zertifikat bei Certopus");
    assert.equal(raw.prepare("SELECT name FROM learn_certs").get().name, "Ada Lovelace");
    const state = await call(env, "/api/learn/cert?path=" + PATH, { cookie: s.ada });
    assert.equal(state.data.cert.status, "ok"); assert.equal(state.data.cert.url, "https://certopus.com/c/CERT-42"); assert.equal(state.data.cert_on, true);
  } finally { m.restore(); }
});

test("Zertifikat: alle Standardfelder, wenn die Vorlage sie hat; CERTOPUS_FIELDS gilt ohne Abfrage", async () => {
  const { env, s } = await setup({ CERTOPUS_ON: "1", CERTOPUS_API_KEY: KEY, CERTOPUS_PATHS: CERTOPUS_PATHS.replace('"ev-1"', '"ev-2"') });   // eigenes Event: Feld-Cache im Speicher gilt je Vorlage
  await seed(env);
  const attempt = await passedAttempt(env, s.ada);
  let m = mockCertopus({ fields: ["email", "{Name}", "{Course}", "{Score}", "{Date}"] });
  try {
    await call(env, "/api/learn/cert", { method: "POST", cookie: s.ada, body: certBody(attempt) });
    const data = m.calls.find((c) => c.url.pathname === "/v1/certificates").body.recipients[0].data;
    assert.equal(data["{Score}"], "27/30 (90 %)"); assert.match(data["{Date}"], /^\d{2}\.\d{2}\.\d{4}$/);
  } finally { m.restore(); }
  const b = await setup({ CERTOPUS_ON: "1", CERTOPUS_API_KEY: KEY, CERTOPUS_FIELDS: JSON.stringify({ name: "Teilnehmer", score: "Punkte" }) });
  await seed(b.env);
  const att = await passedAttempt(b.env, b.s.bob);
  m = mockCertopus({ fields: [] });
  try {
    const r = await call(b.env, "/api/learn/cert", { method: "POST", cookie: b.s.bob, body: certBody(att, { lang: "en", email: "bob@example.com", name: "Bob Builder" }) });
    assert.equal(r.status, 200);
    assert.equal(m.calls.filter((c) => c.url.pathname === "/v1/recipient_fields").length, 0);
    assert.deepEqual(m.calls[0].body.recipients[0].data, { Teilnehmer: "Bob Builder", Punkte: "27/30 (90 %)" });
  } finally { m.restore(); }
});

test("Certopus-Fehler: 502, Status error, Schluessel nie im Text; erneuter Klick stellt aus", async () => {
  const { env, raw, s } = await setup({ CERTOPUS_ON: "1", CERTOPUS_API_KEY: KEY });
  await seed(env);
  const attempt = await passedAttempt(env, s.ada);
  let m = mockCertopus({ fail: true });
  try {
    const r = await call(env, "/api/learn/cert", { method: "POST", cookie: s.ada, body: certBody(attempt) });
    assert.equal(r.status, 502); assert.equal(r.data.error, "cert_failed");
    assert.ok(!r.text.includes(KEY), "Schluessel in der Antwort");
    const row = raw.prepare("SELECT * FROM learn_certs").get();
    assert.equal(row.status, "error"); assert.ok(!row.error.includes(KEY)); assert.match(row.error, /HTTP 401/);
  } finally { m.restore(); }
  m = mockCertopus();
  try {
    const r = await call(env, "/api/learn/cert", { method: "POST", cookie: s.ada, body: certBody(attempt) });
    assert.equal(r.status, 200); assert.equal(raw.prepare("SELECT status FROM learn_certs").get().status, "ok");
  } finally { m.restore(); }
});

test("Cron: wartende Zertifikate werden nach dem Einschalten ausgestellt, laufende nicht doppelt", async () => {
  const { env, raw, s } = await setup();
  await seed(env);
  const attempt = await passedAttempt(env, s.ada);
  assert.equal((await call(env, "/api/learn/cert", { method: "POST", cookie: s.ada, body: certBody(attempt) })).status, 503);
  assert.deepEqual(await issuePendingCerts(env), { skipped: "aus" });
  env.CERTOPUS_ON = "1"; env.CERTOPUS_API_KEY = KEY;
  raw.prepare("UPDATE learn_certs SET status='issuing',updated=?").run(Math.floor(Date.now() / 1000));
  const m = mockCertopus();
  try {
    const busy = await call(env, "/api/learn/cert", { method: "POST", cookie: s.ada, body: certBody(attempt) });
    assert.equal(busy.status, 409, "Anfrage laeuft schon"); assert.equal(m.calls.filter((c) => c.url.pathname === "/v1/certificates").length, 0);
    raw.prepare("UPDATE learn_certs SET status='pending'").run();
    assert.deepEqual(await issuePendingCerts(env), { ok: 1, error: 0, skipped: 0 });
    assert.equal(raw.prepare("SELECT status FROM learn_certs").get().status, "ok");
  } finally { m.restore(); }
});

test("Statistik nur fuer Admins: je Herkunft und Woche; Konto loeschen entfernt Versuche und Zertifikat-Zeilen", async () => {
  const { env, raw, s } = await setup();
  await seed(env);
  const st = await start(env, s.ada, { src: "linkedin" });
  await submit(env, s.ada, st.data.attempt, answersFor(st.data.qids));
  await call(env, "/api/learn/cert", { method: "POST", cookie: s.ada, body: certBody(st.data.attempt) });
  await start(env, s.bob, { src: "newsletter" });
  assert.equal((await call(env, "/api/learn/stats?path=" + PATH, { cookie: s.ada })).status, 403);
  assert.equal((await call(env, "/api/learn/stats?path=" + PATH)).status, 401);
  const r = await call(env, "/api/learn/stats?path=" + PATH, { cookie: s.admin });
  assert.equal(r.status, 200);
  const li = r.data.rows.find((x) => x.src === "linkedin"), nl = r.data.rows.find((x) => x.src === "newsletter");
  assert.deepEqual({ started: li.started, submitted: li.submitted, passed: li.passed, certs: li.certs }, { started: 1, submitted: 1, passed: 1, certs: 0 });
  assert.deepEqual({ started: nl.started, submitted: nl.submitted, passed: nl.passed }, { started: 1, submitted: 0, passed: 0 });
  assert.match(li.week, /^\d{4}-W\d{2}$/);
  assert.deepEqual(r.data.totals, { started: 2, submitted: 1, passed: 1, certs: 0 });
  assert.deepEqual(r.data.cert_status, { pending: 1 });
  assert.equal((await call(env, "/api/learn/stats", { cookie: s.admin })).status, 200, "ohne path: alle Pfade");
  await deleteUserLearn(env.DB, 1);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM learn_attempts WHERE user_id=1").get().n, 0);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM learn_certs").get().n, 0);
});

test("pageFilter: Seite darf nur junge Fragen ausblenden, die sie nicht kennen kann - keine Auswahl", () => {
  const g = new Map([["pa", ["pa-1", "pa-2", "pa-3", "pa-4", "pa-5", "pa-6"]], ["pb", ["pb-1", "pb-2", "pb-3", "pb-4", "pb-5"]], ["pc", ["pc-1", "pc-2", "pc-3", "pc-4", "pc-5"]],
    ["pd", ["pd-1", "pd-2", "pd-3", "pd-4", "pd-5"]], ["pe", ["pe-1", "pe-2", "pe-3", "pe-4", "pe-5"]]]);
  const all = [...g.values()].flat(), FRESH = new Set(all), OLD = new Set();
  assert.equal(pageFilter(g, undefined, FRESH), g, "ohne have: ganzer Pool");
  assert.equal(pageFilter(g, "pa-1", FRESH), g);
  assert.equal(pageFilter(g, [], FRESH), g, "leere Liste: ganzer Pool");
  assert.equal(pageFilter(g, ["Bad Id!", 42], FRESH), g, "nur ungueltige Eintraege: wie ohne have");
  assert.equal(pageFilter(g, ["px-1", "px-2"], FRESH), null, "gueltige Liste ohne jede aktive Frage: Seite veraltet");
  // junge Fragen (erster Push < HAVE_GRACE): neuer Leitfaden und hoehere Nummern darf die Seite ausblenden
  const newE = pageFilter(g, all.filter((q) => !q.startsWith("pe-")), FRESH);
  assert.deepEqual([...newE.keys()], ["pa", "pb", "pc", "pd"], "ein neuer Leitfaden (1 von 5) faellt weg");
  assert.equal(pageFilter(g, all.filter((q) => !/^p[de]-/.test(q)), FRESH), g, "zwei von fuenf fehlen: zu viel -> ganzer Pool");
  const grown = pageFilter(g, all.filter((q) => q !== "pa-6"), new Set(["pa-6"]));
  assert.deepEqual(grown.get("pa"), ["pa-1", "pa-2", "pa-3", "pa-4", "pa-5"], "neue Frage pa-6 kennt die Seite noch nicht");
  const gaps = pageFilter(g, all.filter((q) => !/^pa-[12]$/.test(q)), FRESH);
  assert.deepEqual(gaps.get("pa"), g.get("pa"), "Luecken unterhalb der hoechsten bekannten Nummer: keine Auswahl, alle bleiben");
  const picky = pageFilter(g, all.filter((q) => !/^pa-[4-6]$/.test(q)), FRESH);
  assert.deepEqual(picky.get("pa"), g.get("pa"), "nur 3 von 6 bleiben (unter HAVE_MIN): ganzer Pool des Leitfadens");
  // aeltere Fragen gehoeren immer zum Pool
  const four = all.filter((q) => !/^p[a-e]-[56]$/.test(q));   // je Leitfaden nur 1-4
  assert.deepEqual(pageFilter(g, four, OLD), g, "4 von 5/6 je Leitfaden bei alten Fragen: Pool bleibt ganz");
  assert.deepEqual(pageFilter(g, all.filter((q) => !q.startsWith("pe-")), OLD), g, "alter Leitfaden laesst sich nicht weglassen");
  const mixed = pageFilter(g, all.filter((q) => !/^pa-[56]$/.test(q)), new Set(["pa-6"]));
  assert.deepEqual(mixed.get("pa"), ["pa-1", "pa-2", "pa-3", "pa-4", "pa-5"], "nur die junge pa-6 faellt weg, die alte pa-5 bleibt");
  const capped = pageFilter(g, [...Array(600).fill("px-1"), ...all], FRESH);
  assert.equal(capped, null, "nur die ersten HAVE_MAX Eintraege zaehlen");
});

test("Start zieht nur Fragen, die die Seite kennt (have); alte Fragen und Leitfaeden lassen sich nicht weglassen", async () => {
  const { env, raw, s } = await setup();
  await seed(env);
  raw.prepare("UPDATE learn_quiz_keys SET created=created-?").run(HAVE_GRACE + 60);   // Grundsatz liegt laenger zurueck
  // neuer Leitfaden und gewachsener Pool nur im Worker, Seite noch alt
  const fresh = [...[1, 2, 3, 4, 5].map((n) => ({ qid: `new-guide-${n}`, pillar: "new-guide", answer: 0 })), { qid: "kaizen-6", pillar: "kaizen", answer: 0 }];
  assert.equal((await call(env, "/api/internal/learn-quiz", { method: "POST", body: { path: PATH, keys: [...keys(), ...fresh] }, headers: { "x-cron-key": "cron-test" } })).status, 200);
  assert.ok(raw.prepare("SELECT created FROM learn_quiz_keys WHERE qid='kaizen-1'").get().created < Date.now() / 1000 - HAVE_GRACE, "erneuter Push setzt created nicht neu");
  const page = keys().map((k) => k.qid);
  const reset = () => { raw.prepare("DELETE FROM learn_attempts").run(); raw.prepare("DELETE FROM ratelimit").run(); };
  const st = await start(env, s.ada, { have: [...page, "Bad Id!", 42] });
  assert.equal(st.status, 200);
  assert.equal(st.data.total, 30, "der neue Leitfaden fehlt auf der Seite: 10 x 3 statt 11 x 3");
  assert.ok(st.data.qids.every((q) => page.includes(q)), st.data.qids.join(","));
  reset();
  assert.equal((await start(env, s.ada)).data.total, 33, "ohne have (aeltere Seite im Cache): ganzer Pool wie bisher");
  reset();
  assert.equal((await start(env, s.ada, { have: ["kaizen-1"] })).data.total, 30, "nur eine Frage: alte Leitfaeden bleiben, nur der junge faellt weg");
  reset();
  const drop = (k) => page.filter((q) => !PILLARS.slice(0, k).some((p) => q.startsWith(p + "-")));
  assert.equal((await start(env, s.ada, { have: drop(1) })).data.total, 30, "ein alter Leitfaden fehlt in have: bleibt trotzdem im Test");
  reset();
  // 4 von 5 bekannten Fragen je Leitfaden schicken: Pool wird nicht kleiner (Auswahl bekannter Loesungen geht nicht)
  const four = page.filter((q) => !q.endsWith("-3"));
  const seen = new Set();
  for (let i = 0; i < 12; i++) { reset(); for (const q of (await start(env, s.ada, { have: four })).data.qids) seen.add(q); }
  assert.ok([...seen].some((q) => q.endsWith("-3")), "ausgelassene alte Fragen werden weiter gezogen");
  reset();
  // ganz neuer Fragensatz (alle alten stillgelegt), Seite noch alt: 409 statt nicht beantwortbarer Fragen; kein Versuch verbraucht
  const next = PILLARS.flatMap((p) => [6, 7, 8, 9, 10].map((n) => ({ qid: `${p}-${n}`, pillar: p, answer: ANSWER(n) })));
  assert.equal((await call(env, "/api/internal/learn-quiz", { method: "POST", body: { path: PATH, keys: next }, headers: { "x-cron-key": "cron-test" } })).status, 200);
  const old = await start(env, s.ada, { have: page.filter((q) => !q.startsWith("kaizen-")) });
  assert.equal(old.status, 409); assert.equal(old.data.error, "page_outdated");
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM ratelimit").get().n, 0);
});

test("Fortsetzen: kennt die neue Seite stillgelegte Fragen des offenen Versuchs nicht mehr, wird er verworfen und zurueckgegeben", async () => {
  const { env, raw, s } = await setup();
  await seed(env);
  const page = keys().map((k) => k.qid);
  const st = await start(env, s.ada, { have: page });
  assert.equal(st.data.attempts_left, 2);
  // gleiche Seite: Fortsetzen wie bisher
  const same = await start(env, s.ada, { have: page });
  assert.equal(same.data.attempt, st.data.attempt); assert.equal(same.data.resumed, true);
  // neuer Fragensatz (regen): alte IDs stillgelegt, neue Seite kennt nur die neuen
  const next = PILLARS.flatMap((p) => [6, 7, 8, 9, 10].map((n) => ({ qid: `${p}-${n}`, pillar: p, answer: ANSWER(n) })));
  await call(env, "/api/internal/learn-quiz", { method: "POST", body: { path: PATH, keys: next }, headers: { "x-cron-key": "cron-test" } });
  // alte Seite (kennt die alten IDs): Versuch bleibt und wird weiter gewertet
  const oldPage = await start(env, s.ada, { have: page });
  assert.equal(oldPage.data.attempt, st.data.attempt); assert.equal(oldPage.data.resumed, true);
  const fresh = await start(env, s.ada, { have: next.map((k) => k.qid) });
  assert.equal(fresh.status, 200); assert.notEqual(fresh.data.attempt, st.data.attempt); assert.equal(fresh.data.resumed, undefined);
  assert.ok(fresh.data.qids.every((q) => /-([6-9]|10)$/.test(q)), fresh.data.qids.join(","));
  assert.equal(fresh.data.attempts_left, 2, "der verworfene Versuch wurde zurueckgegeben");
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM learn_attempts WHERE id=?").get(st.data.attempt).n, 0);
  // ohne have (aeltere Seite im Cache) bleibt ein offener Versuch unberuehrt
  const keep = await start(env, s.ada);
  assert.equal(keep.data.attempt, fresh.data.attempt);
});

test("Name auf dem Zertifikat: Domains auch mitten im Text und mit Ersatzzeichen; Seite und Worker pruefen gleich", () => {
  const bad = ["Visit evil.com today", "evil.com now", "evil.com.", "evil.com!", "t.me x", "bit.ly x", "evil．com", "evil。com", "evil｡com", "evil[.]com", "evil(.)com",
    "evil.c⁠om", "evil.c­om", "evil.c﻿om", "Ada ＠lovelace", "Ada ﹫lovelace", "xn--80ak6aa92e", "Ada\\Lovelace", "ada.example.de/x", "https：//x"];
  const good = ["Dr. Max Mustermann", "J. R. Smith", "J.R.R. Tolkien", "St. Clair, M.Sc.", "Dr.-Ing. Anna Schmidt", "Prof. Dr. h.c. Anna", "Ada Lovelace-Byron", "José Núñez", "O'Brien", "Jr. Co Smith"];
  for (const n of bad) assert.ok(NAME_URL_RX.test(certName(n)), "muss abgelehnt werden: " + JSON.stringify(n));
  for (const n of good) assert.ok(!NAME_URL_RX.test(certName(n)), "muss erlaubt sein: " + n);
  assert.equal(certName("Ada⁠ Love­lace﻿"), "Ada Lovelace", "Formatzeichen fallen weg (gespeichert wird der normalisierte Name)");
  // assets/learnquiz.js: gleiche Liste, gleiche Regel, gleiche Normalisierung
  const src = readFileSync(new URL("../../assets/learnquiz.js", import.meta.url), "utf-8");
  const m = src.match(/var NAME_TLD = [^;]+;\n\s*var NAME_URL_RX = [^;]+;\n\s*function certName[\s\S]*?\n  \}/);
  assert.ok(m, "Block NAME_TLD/NAME_URL_RX/certName in assets/learnquiz.js");
  const page = new Function(m[0] + "; return { NAME_TLD, NAME_URL_RX, certName };")();
  assert.equal(page.NAME_TLD, NAME_TLD); assert.equal(page.NAME_URL_RX.source, NAME_URL_RX.source); assert.equal(page.NAME_URL_RX.flags, NAME_URL_RX.flags);
  for (const n of [...bad, ...good]) assert.equal(page.NAME_URL_RX.test(page.certName(n)), NAME_URL_RX.test(certName(n)), n);
});

test("Konten zusammenfuehren: Versuche und Zertifikat wandern mit, kein zweites Zertifikat", async () => {
  const { mergeStatements } = await import("../src/identities.js");
  const { env, raw, s } = await setup({ CERTOPUS_ON: "1", CERTOPUS_API_KEY: KEY });
  await seed(env);
  const attempt = await passedAttempt(env, s.ada);
  let m = mockCertopus();
  try { assert.equal((await call(env, "/api/learn/cert", { method: "POST", cookie: s.ada, body: certBody(attempt) })).status, 200); } finally { m.restore(); }
  // Bob (Zielkonto) hat eine wartende Zeile - das schon ausgestellte Zertifikat von Ada gilt
  const t = Math.floor(Date.now() / 1000);
  raw.prepare("INSERT INTO learn_certs(user_id,path,attempt_id,name,email,lang,status,created,updated) VALUES (2,?,?,?,?,?,'pending',?,?)").run(PATH, "x", "Bob", "bob@example.com", "en", t, t);
  await env.DB.batch(await mergeStatements(env.DB, 1, 2));
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM learn_attempts WHERE user_id=1").get().n, 0);
  const st = await call(env, "/api/learn/cert?path=" + PATH, { cookie: s.bob });
  assert.equal(st.status, 200); assert.equal(st.data.passed, true);
  assert.equal(st.data.cert.status, "ok"); assert.equal(st.data.cert.id, "CERT-42");
  m = mockCertopus();
  try {
    const again = await call(env, "/api/learn/cert", { method: "POST", cookie: s.bob, body: certBody(attempt) });
    assert.equal(again.status, 200); assert.equal(again.data.existing, true);
    assert.equal(m.calls.length, 0, "kein zweiter Certopus-Aufruf");
  } finally { m.restore(); }
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM learn_certs WHERE user_id=2").get().n, 1);
});

test("Konten zusammenfuehren: Versuchszaehler werden addiert (spaeteres Fenster), abgelaufene zaehlen nicht, andere Schluessel bleiben", async () => {
  const { mergeStatements } = await import("../src/identities.js");
  const { env, raw, s } = await setup();
  await seed(env);
  const t = Math.floor(Date.now() / 1000), rl = (k) => { const r = raw.prepare("SELECT n, win FROM ratelimit WHERE k=?").get(k); return r ? { ...r } : null; };
  const ins = raw.prepare("INSERT INTO ratelimit(k,n,win) VALUES (?,?,?)");
  ins.run(`learnq:1:${PATH}`, 2, t - 3600);          // Ada (S): 2 Versuche, Fenster laeuft
  ins.run(`learnq:2:${PATH}`, 1, t - 7200);          // Bob (T): 1 Versuch, Fenster laeuft
  ins.run("learnq:1:anderer-pfad", 1, t - 100);      // nur bei S: wandert
  ins.run("learnq:1:alter-pfad", 3, t - 90000);      // abgelaufen: entfaellt
  ins.run("learnq:2:alter-pfad", 1, t - 90000);      // bei T abgelaufen ...
  ins.run("learnq:1:neu-pfad", 1, t - 60);           // ... S dagegen laeuft
  ins.run("learnq:2:neu-pfad", 3, t - 90000);
  ins.run("learnq:12:" + PATH, 3, t - 10);           // anderer Nutzer (12), dessen Schluessel mit "learnq:1" beginnt: unberuehrt
  ins.run("learncert:1", 4, t - 10);                  // andere Zaehler: unberuehrt
  await env.DB.batch(await mergeStatements(env.DB, 1, 2));
  assert.deepEqual(rl(`learnq:2:${PATH}`), { n: 3, win: t - 3600 }, "2 + 1, spaeteres Fenster");
  assert.deepEqual(rl("learnq:2:anderer-pfad"), { n: 1, win: t - 100 });
  assert.deepEqual(rl("learnq:2:neu-pfad"), { n: 1, win: t - 60 }, "abgelaufener Zaehler von T zaehlt nicht");
  assert.deepEqual(rl("learnq:2:alter-pfad"), { n: 1, win: t - 90000 }, "abgelaufener Zaehler von S aendert nichts");
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM ratelimit WHERE k LIKE 'learnq:1:%'").get().n, 0);
  assert.deepEqual(rl("learnq:12:" + PATH), { n: 3, win: t - 10 }); assert.deepEqual(rl("learncert:1"), { n: 4, win: t - 10 });
  // Bob hat damit keine Versuche mehr in diesem Fenster
  const st = await call(env, "/api/learn/cert?path=" + PATH, { cookie: s.bob });
  assert.equal(st.data.attempts_left, 0);
  assert.equal((await start(env, s.bob)).status, 429);
});

test("Cron: wartende Zeilen eines nicht eingerichteten Pfads blockieren nicht; haengengebliebene (issuing) werden aufgenommen", async () => {
  const { env, raw, s } = await setup();
  await seed(env);
  const attempt = await passedAttempt(env, s.ada);
  assert.equal((await call(env, "/api/learn/cert", { method: "POST", cookie: s.ada, body: certBody(attempt) })).status, 503);   // pending (aus)
  const t = Math.floor(Date.now() / 1000);
  const ins = raw.prepare("INSERT INTO learn_certs(user_id,path,attempt_id,name,email,lang,status,created,updated) VALUES (?,?,?,?,?,?,'pending',?,?)");
  for (let i = 0; i < 6; i++) ins.run(100 + i, "other-path", "x", "N" + i, `n${i}@example.com`, "en", t - 1000 + i, t - 1000 + i);   // aelter als die von Ada
  env.CERTOPUS_ON = "1"; env.CERTOPUS_API_KEY = KEY;
  const m = mockCertopus();
  try {
    assert.deepEqual(await issuePendingCerts(env), { ok: 1, error: 0, skipped: 0 });
    assert.equal(raw.prepare("SELECT status FROM learn_certs WHERE user_id=1").get().status, "ok");
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM learn_certs WHERE path='other-path' AND status='pending'").get().n, 6, "anderer Pfad bleibt unberuehrt");
    raw.prepare("UPDATE learn_certs SET status='issuing',updated=? WHERE user_id=1").run(t);   // laeuft gerade: nicht anfassen
    assert.deepEqual(await issuePendingCerts(env), { ok: 0, error: 0, skipped: 0 });
    raw.prepare("UPDATE learn_certs SET status='issuing',updated=? WHERE user_id=1").run(t - 600);   // haengengeblieben
    assert.deepEqual(await issuePendingCerts(env), { ok: 1, error: 0, skipped: 0 });
    assert.deepEqual(await issuePendingCerts({ ...env, CERTOPUS_PATHS: "{}" }), { skipped: "keine_pfade" });
  } finally { m.restore(); }
});
