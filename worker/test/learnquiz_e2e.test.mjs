// Lernpfad-Abschlusstest von Ende zu Ende: echte Fragen-IDs aus data/pillar_quiz.json, echte CERTOPUS_PATHS aus wrangler.toml,
// Schluessel-Push genau so, wie tools/pillar_quiz.py push ihn sendet (Python wird mit abgefangenem urlopen aufgerufen), dann
// Start -> Abgabe -> Zertifikat mit gemocktem Certopus. Dazu: jede API-Adresse und jedes Antwortfeld, das assets/learnquiz.js nutzt, gibt es im Worker.
// Die Antworten hier sind erfunden (Index aus der Frage-Nummer) - die echten Loesungen liegen nur verschluesselt in data/pillar_quiz_keys.enc.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import worker from "../src/index.js";
import { perGroup, threshold, scoreText } from "../src/learnquiz.js";
import { makeSession } from "../src/util.js";

const ROOT = new URL("../../", import.meta.url);
const QUIZ = JSON.parse(readFileSync(new URL("data/pillar_quiz.json", ROOT), "utf-8"));
const PILLARS_JSON = JSON.parse(readFileSync(new URL("data/pillars.json", ROOT), "utf-8"));
const TOML = readFileSync(new URL("worker/wrangler.toml", ROOT), "utf-8");
const LQ_JS = readFileSync(new URL("assets/learnquiz.js", ROOT), "utf-8");
const PATH = QUIZ.path;
const CERTOPUS_PATHS = (TOML.match(/^CERTOPUS_PATHS\s*=\s*'(.*)'\s*$/m) || [])[1];
const KEY = "certopus-e2e-key-987654";
const fakeAnswer = (qid) => Number(qid.split("-").pop()) % 4;

// Schluessel-Dokument wie in data/pillar_quiz_keys.enc (entschluesselt), aus den echten oeffentlichen IDs
const keysDoc = () => ({ path: PATH, version: QUIZ.version, keys: Object.entries(QUIZ.pillars).flatMap(([pid, v]) => v.en.map((q) => ({ qid: q.id, path: PATH, pillar: pid, answer: fakeAnswer(q.id), why_en: `Because ${q.id}.`, why_de: `Weil ${q.id}.`, ref: "x" }))) });

// Ruft tools/pillar_quiz.push() auf und faengt die HTTP-Anfrage ab -> {url, method, headers, body} oder null (kein python3)
function pythonPushRequest(doc) {
  const py = `
import json, os, sys
sys.path.insert(0, os.path.join(sys.argv[1], "tools"))
import pillar_quiz as P
seen = {}
class R:
    def __enter__(self): return self
    def __exit__(self, *a): return False
    def read(self): return b'{"ok": true}'
def fake(req, timeout=None):
    seen.update(url=req.full_url, method=req.get_method(), headers=dict(req.header_items()), body=json.loads(req.data.decode()))
    return R()
P.urllib.request.urlopen = fake
P.push(json.load(sys.stdin))
print(json.dumps(seen))
`;
  try {
    const out = execFileSync("python3", ["-I", "-c", py, fileURLToPath(ROOT)], { input: JSON.stringify(doc), env: { ...process.env, CRON_KEY: "cron-e2e", COMMUNITY_API: "https://api-dub.m365.fm" }, encoding: "utf-8" });
    return JSON.parse(out.trim().split("\n").pop());
  } catch (e) {
    if (e.code === "ENOENT") return null;
    throw e;
  }
}

async function setup(extra = {}) {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:");
  const dir = new URL("../migrations/", import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(f, dir), "utf-8"));
  const db = { prepare(sql) { const st = raw.prepare(sql); let a = []; const o = { bind(...x) { a = x; return o; }, all: async () => ({ results: st.all(...a) }), first: async () => st.get(...a) ?? null, run: async () => { const r = st.run(...a); return { meta: { changes: Number(r.changes), last_row_id: Number(r.lastInsertRowid) } }; } }; return o; }, batch: async (l) => { for (const s of l) await s.run(); return []; } };
  const now = Math.floor(Date.now() / 1000);
  raw.prepare("INSERT INTO users(id,provider,sub,name,created) VALUES (1,'github','ada','Ada L.',?)").run(now);
  raw.prepare("INSERT INTO mail_addr(user_id,email,verified,token,created) VALUES (1,'ada@example.com',1,'',?)").run(now);
  const env = { DB: db, SITE: "https://www.m365.fm", API: "https://api-dub.m365.fm", SESSION_SECRET: "e2e-secret", ADMIN_SUBS: "", CRON_KEY: "cron-e2e", CERTOPUS_PATHS, CERTOPUS_ON: "1", CERTOPUS_API_KEY: KEY, ...extra };
  return { env, raw, cookie: `m365s=${await makeSession(env, 1)}` };
}

async function call(env, path, { method = "GET", body, cookie, headers } = {}) {
  const h = headers || { origin: "https://www.m365.fm", ...(method !== "GET" ? { "x-requested-with": "m365", "content-type": "application/json" } : {}), ...(cookie ? { cookie } : {}) };
  const res = await worker.fetch(new Request("https://api-dub.m365.fm" + path, { method, headers: h, body: body === undefined ? undefined : (typeof body === "string" ? body : JSON.stringify(body)) }), env, { waitUntil() {} });
  const text = await res.text();
  let data = null; try { data = JSON.parse(text); } catch { /* kein JSON */ }
  return { status: res.status, data, text };
}

test("Konfiguration passt zusammen: CERTOPUS_PATHS (wrangler.toml), data/pillars.json und data/pillar_quiz.json", () => {
  assert.ok(CERTOPUS_PATHS, "CERTOPUS_PATHS fehlt in wrangler.toml");
  const cfg = JSON.parse(CERTOPUS_PATHS)[PATH];
  assert.ok(cfg, `kein CERTOPUS_PATHS-Eintrag fuer ${PATH}`);
  const doc = PILLARS_JSON.path.certopus;
  assert.equal(PILLARS_JSON.path.id, PATH);
  for (const k of ["org", "event", "category"]) { assert.ok(cfg[k]); assert.equal(doc[k], cfg[k], `data/pillars.json path.certopus.${k} != CERTOPUS_PATHS`); }
  assert.ok(cfg.course.en && cfg.course.de);
  assert.match(TOML, /^CERTOPUS_ON\s*=\s*"1"\s*$/m, "Zertifikate eingeschaltet (Mirko 25.11.2026); Notschalter zurueck auf \"0\" schaltet sie ab");
  // Jeder Leitfaden des Pfads hat mindestens 3 Fragen, en/de mit gleichen IDs
  const pids = PILLARS_JSON.path.stages.flatMap((s) => s.pillars || s.items || []).map((x) => (typeof x === "string" ? x : x.id)).filter(Boolean);
  for (const pid of Object.keys(QUIZ.pillars)) {
    const v = QUIZ.pillars[pid];
    assert.ok(v.en.length >= 3, `${pid}: zu wenige Fragen`);
    assert.deepEqual(v.de.map((q) => q.id), v.en.map((q) => q.id), `${pid}: IDs en/de verschieden`);
    for (const q of v.en) { assert.ok(q.id.startsWith(pid + "-")); assert.deepEqual(Object.keys(q).filter((k) => k !== "src").sort(), ["id", "opts", "q"]); }   // src: Vertiefung, aus der die Frage stammt (keine Loesung)
  }
  // Fragen gibt es nur fuer Leitfaeden des Pfads; neue Leitfaeden ohne Fragen (vor dem Fragenlauf) fehlen in der Datei und werden uebersprungen
  if (pids.length) for (const pid of Object.keys(QUIZ.pillars)) assert.ok(pids.includes(pid), `${pid} steht nicht im Pfad`);
});

test("assets/learnquiz.js nutzt nur Adressen, die der Worker kennt", () => {
  const used = [...new Set([...LQ_JS.matchAll(/api\("(\/api\/[a-z/-]+)/g)].map((m) => m[1]))].sort();
  assert.deepEqual(used, ["/api/learn/cert", "/api/learn/quiz/start", "/api/learn/quiz/submit", "/api/me", "/api/providers"]);
  const src = readFileSync(new URL("../src/learnquiz.js", import.meta.url), "utf-8") + readFileSync(new URL("../src/index.js", import.meta.url), "utf-8");
  for (const p of used) assert.ok(src.includes(`path === "${p}"`), `Route ${p} fehlt im Worker`);
  assert.match(LQ_JS, /"\/auth\/login\/" \+ p \+ "\?return="/);
});

test("Ende zu Ende: Push wie tools/pillar_quiz.py -> Start -> Abgabe -> Zertifikat (Certopus gemockt), echte Fragen-IDs", async (t) => {
  const { env, raw, cookie } = await setup();
  const doc = keysDoc();
  const req = pythonPushRequest(doc);
  if (!req) { t.skip("python3 fehlt"); return; }
  // 1) Schluessel-Push: genau die Anfrage, die tools/pillar_quiz.py push schickt
  assert.equal(req.url, "https://api-dub.m365.fm/api/internal/learn-quiz");
  assert.equal(req.method, "POST");
  assert.deepEqual(Object.keys(req.body).sort(), ["keys", "path"]);
  for (const k of req.body.keys) assert.deepEqual(Object.keys(k).sort(), ["answer", "pillar", "qid", "why_de", "why_en"]);
  const push = await call(env, "/api/internal/learn-quiz", { method: "POST", body: req.body, headers: req.headers });
  assert.equal(push.status, 200, push.text);
  assert.equal(push.data.upserted, doc.keys.length);
  assert.equal(push.data.pillars, Object.keys(QUIZ.pillars).length);
  // erneuter Push (worker.yml nach jedem Deploy) ist idempotent
  const again = await call(env, "/api/internal/learn-quiz", { method: "POST", body: req.body, headers: req.headers });
  assert.equal(again.status, 200);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM learn_quiz_keys").get().n, doc.keys.length);

  // 2) Stand vor dem Test (Felder, die learnquiz.js liest)
  const st0 = await call(env, `/api/learn/cert?path=${PATH}`, { cookie });
  assert.equal(st0.status, 200);
  for (const k of ["quiz_ready", "passed", "best", "open", "cert", "name", "email_masked", "email_src", "providers", "cert_on", "attempts_left"]) assert.ok(k in st0.data, `GET cert: Feld ${k} fehlt`);
  assert.equal(st0.data.quiz_ready, true); assert.equal(st0.data.cert_on, true); assert.equal(st0.data.attempts_left, 3);

  // 3) Start: perGroup(G) Fragen je Leitfaden (10 Gruppen: 3, 20 Gruppen: 2), alle IDs stehen auf der Testseite (deutsche Fragen)
  const G = Object.keys(QUIZ.pillars).length, PER = perGroup(G), TOTAL = PER * G, NEED = threshold(TOTAL);
  const s = await call(env, "/api/learn/quiz/start", { method: "POST", cookie, body: { path: PATH, lang: "de", src: "e2e" } });
  assert.equal(s.status, 200, s.text);
  for (const k of ["attempt", "qids", "expires", "attempts_left"]) assert.ok(k in s.data, `start: Feld ${k} fehlt`);
  const pageIds = new Set(Object.values(QUIZ.pillars).flatMap((v) => v.de.map((q) => q.id)));
  assert.equal(s.data.qids.length, TOTAL);
  for (const q of s.data.qids) assert.ok(pageIds.has(q), `${q} fehlt in data/pillar_quiz.json`);
  for (const pid of Object.keys(QUIZ.pillars)) assert.equal(s.data.qids.filter((q) => q.startsWith(pid + "-")).length, PER, pid);

  // 4) Abgabe mit Antworten im Format von learnquiz.js ({qid: index}); genau so viele falsch, dass die Schwelle erreicht ist (30: 24/30, 40: 32/40)
  const WRONG = TOTAL - NEED;
  const answers = Object.fromEntries(s.data.qids.map((q, i) => [q, i < WRONG ? (fakeAnswer(q) + 1) % 4 : fakeAnswer(q)]));
  const sb = await call(env, "/api/learn/quiz/submit", { method: "POST", cookie, body: { attempt: s.data.attempt, answers } });
  assert.equal(sb.status, 200, sb.text);
  for (const k of ["attempt", "score", "total", "passed", "threshold", "per_pillar", "results", "attempts_left"]) assert.ok(k in sb.data, `submit: Feld ${k} fehlt`);
  assert.equal(sb.data.total, TOTAL); assert.equal(sb.data.score, NEED); assert.equal(sb.data.threshold, NEED); assert.equal(sb.data.passed, true);
  assert.ok(G === 20 ? TOTAL === 40 && NEED === 32 : true, "Kursausbau 26.11.: 20 Gruppen -> 40 Fragen, Schwelle 32");
  assert.deepEqual(new Set(Object.keys(sb.data.per_pillar)), new Set(Object.keys(QUIZ.pillars)), "per_pillar-Schluessel = Gruppen-IDs der Testseite");
  for (const r of sb.data.results) { for (const k of ["qid", "ok", "chosen", "correct", "why"]) assert.ok(k in r, `results: ${k}`); assert.match(r.why, /^Weil /); }

  // 5) Zertifikat: Certopus gemockt, IDs aus der echten CERTOPUS_PATHS
  const cfg = JSON.parse(CERTOPUS_PATHS)[PATH];
  const calls = [], old = globalThis.fetch;
  globalThis.fetch = async (url, init = {}) => {
    const u = new URL(String(url));
    assert.equal(u.hostname, "api.certopus.com");
    assert.equal(init.headers["x-api-key"], KEY);
    calls.push({ u, body: init.body ? JSON.parse(init.body) : null });
    if (u.pathname === "/v1/recipient_fields") return new Response(JSON.stringify({ data: ["email", "{Name}", "{Course}", "{Score}", "{Date}"].map((k) => ({ key: k, label: k, type: "text" })) }), { status: 200 });
    if (u.pathname === "/v1/certificates") return new Response(JSON.stringify({ responses: [{ certificateId: "E2E-1", certificateUrl: "https://certopus.com/c/E2E-1", pdfUrl: "https://certopus.com/c/E2E-1.pdf" }] }), { status: 200 });
    return new Response("{}", { status: 404 });
  };
  try {
    const st1 = await call(env, `/api/learn/cert?path=${PATH}`, { cookie });
    assert.equal(st1.data.passed, true); assert.equal(st1.data.best.attempt, s.data.attempt); assert.equal(st1.data.email_masked, "a***@example.com"); assert.equal(st1.data.email_src, "account");
    const c = await call(env, "/api/learn/cert", { method: "POST", cookie, body: { path: PATH, attempt: st1.data.best.attempt, name: "Ada Lovelace", consent: true, lang: "de" } });
    assert.equal(c.status, 200, c.text);
    assert.equal(c.data.status, "ok"); assert.equal(c.data.url, "https://certopus.com/c/E2E-1"); assert.equal(c.data.pdf, "https://certopus.com/c/E2E-1.pdf");
    assert.equal(new URL(c.data.linkedin).searchParams.get("name"), cfg.course.de);
    const post = calls.find((x) => x.u.pathname === "/v1/certificates").body;
    assert.equal(post.organisationId, cfg.org); assert.equal(post.eventId, cfg.event); assert.equal(post.categoryId, cfg.category);
    assert.equal(post.generate, true); assert.equal(post.publish, true);
    assert.equal(post.recipients[0].email, "ada@example.com");
    assert.equal(post.recipients[0].data["{Name}"], "Ada Lovelace");
    assert.equal(post.recipients[0].data["{Course}"], cfg.course.de);
    assert.equal(post.recipients[0].data["{Score}"], scoreText(NEED, TOTAL));
    assert.match(post.recipients[0].data["{Date}"], /^\d\d\.\d\d\.\d{4}$/);
    // Seite neu laden: GET cert liefert das Zertifikat (learnquiz.js -> certDone)
    const st2 = await call(env, `/api/learn/cert?path=${PATH}`, { cookie });
    assert.equal(st2.data.cert.status, "ok"); assert.equal(st2.data.cert.url, c.data.url);
  } finally { globalThis.fetch = old; }
});
